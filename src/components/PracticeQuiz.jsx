import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  Zap, 
  Filter,
  Check,
  ChevronRight,
  BookOpen,
  Volume2,
  VolumeX,
  Keyboard,
  AlertTriangle,
  BarChart3,
  Target,
  Flame,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { AZ900_DOMAINS } from '../data/curriculum';
import { LEARNING_STYLES } from '../data/learningStyles';
import { NotificationService } from '../services/notificationService';
import { TTSService } from '../services/ttsService';

export const PracticeQuiz = ({ 
  profile, 
  readiness, 
  onRecordAnswer, 
  initialMode = 'diagnostic',
  a11ySettings = {},
  onNavigateToRevision,
  onNavigateToJourney
}) => {
  const currentStyle = LEARNING_STYLES[profile.learningStyle] || LEARNING_STYLES.auditory;
  const [mode, setMode] = useState(initialMode); // 'diagnostic' (5 q) | 'adaptive' | 'domain' | 'all'
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreCount, setScoreCount] = useState({ correct: 0, total: 0 });
  const [sessionAnswers, setSessionAnswers] = useState([]); // { question, subtopic, domainId, isCorrect }
  const [showDistractors, setShowDistractors] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Filter and prepare question pool
  const getFilteredQuestions = () => {
    let pool = [...PRACTICE_QUESTIONS];

    if (mode === 'diagnostic') {
      // Diagnostic mode: pick 5 representative questions spanning different domains
      const concepts = pool.filter(q => q.domainId === 'cloud-concepts');
      const architecture = pool.filter(q => q.domainId === 'architecture-services');
      const governance = pool.filter(q => q.domainId === 'management-governance');
      
      const sample = [
        ...concepts.slice(0, 2),
        ...architecture.slice(0, 2),
        ...governance.slice(0, 1)
      ];
      return sample.length > 0 ? sample : pool.slice(0, 5);
    } else if (mode === 'adaptive' && readiness.weakAreas.length > 0) {
      const weakSubtopicIds = new Set(readiness.weakAreas.map(w => w.subtopicId));
      pool.sort((a, b) => {
        const aWeak = weakSubtopicIds.has(a.subtopic);
        const bWeak = weakSubtopicIds.has(b.subtopic);
        if (aWeak && !bWeak) return -1;
        if (!aWeak && bWeak) return 1;
        return 0;
      });
    } else if (mode === 'domain' && selectedDomain !== 'all') {
      pool = pool.filter(q => q.domainId === selectedDomain);
    }

    return pool;
  };

  const questions = getFilteredQuestions();
  const currentQuestion = questions[currentIndex] || questions[0];
  const maxQuestions = mode === 'diagnostic' ? 5 : questions.length;

  // Stop TTS on question change
  useEffect(() => {
    TTSService.stop();
    setIsSpeaking(false);
    setSelectedOption(null);
    setIsSubmitted(false);

    if (a11ySettings.autoReadAloud && currentQuestion && !isCompleted) {
      const textToRead = `${currentQuestion.question}. Option A: ${currentQuestion.options[0]}. Option B: ${currentQuestion.options[1]}. Option C: ${currentQuestion.options[2]}. Option D: ${currentQuestion.options[3]}.`;
      setIsSpeaking(true);
      TTSService.speak(textToRead, { onEnd: () => setIsSpeaking(false) });
    }
  }, [currentIndex, mode, selectedDomain, a11ySettings.autoReadAloud, isCompleted]);

  // Full Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || isCompleted) return;

      const key = e.key.toUpperCase();

      if (!isSubmitted) {
        if (['1', 'A'].includes(key)) setSelectedOption(0);
        else if (['2', 'B'].includes(key)) setSelectedOption(1);
        else if (['3', 'C'].includes(key)) setSelectedOption(2);
        else if (['4', 'D'].includes(key)) setSelectedOption(3);
        else if (e.key === 'Enter' && selectedOption !== null) {
          handleSubmitAnswer();
        }
      } else {
        if (e.key === 'Enter' || key === 'N') {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selectedOption, currentIndex, isCompleted]);

  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsSubmitted(true);

    setScoreCount(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    setSessionAnswers(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        subtopic: currentQuestion.subtopic,
        domainId: currentQuestion.domainId,
        isCorrect
      }
    ]);

    onRecordAnswer(currentQuestion.subtopic, isCorrect);

    if (isCorrect) {
      NotificationService.playChime('success');
      if (!a11ySettings.reducedMotion) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
        });
      }
    } else {
      NotificationService.playChime('alert');
    }

    if (a11ySettings.autoReadAloud) {
      const feedback = isCorrect 
        ? `Correct! ${currentQuestion.explanation.whyCorrect}` 
        : `Incorrect. The correct answer was option ${String.fromCharCode(65 + currentQuestion.correctIndex)}: ${currentQuestion.options[currentQuestion.correctIndex]}. ${currentQuestion.explanation.whyCorrect}`;
      setIsSpeaking(true);
      TTSService.speak(feedback, { onEnd: () => setIsSpeaking(false) });
    }
  };

  const handleNextQuestion = () => {
    TTSService.stop();
    setIsSpeaking(false);
    
    // Check if diagnostic or drill finished
    if (currentIndex + 1 >= maxQuestions) {
      handleFinishQuiz();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFinishQuiz = () => {
    TTSService.stop();
    setIsSpeaking(false);
    setIsCompleted(true);
    NotificationService.playChime('celebration');
    if (!a11ySettings.reducedMotion) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      TTSService.stop();
      setIsSpeaking(false);
    } else {
      let textToRead = `${currentQuestion.question}. Option A: ${currentQuestion.options[0]}. Option B: ${currentQuestion.options[1]}. Option C: ${currentQuestion.options[2]}. Option D: ${currentQuestion.options[3]}.`;
      if (isSubmitted) {
        textToRead += ` Correct answer is ${String.fromCharCode(65 + currentQuestion.correctIndex)}. Explanation: ${currentQuestion.explanation.whyCorrect}`;
      }
      setIsSpeaking(true);
      TTSService.speak(textToRead, { onEnd: () => setIsSpeaking(false) });
    }
  };

  const handleRestart = (newMode = 'diagnostic') => {
    TTSService.stop();
    setIsSpeaking(false);
    setMode(newMode);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScoreCount({ correct: 0, total: 0 });
    setSessionAnswers([]);
    setIsCompleted(false);
  };

  // Group session answers by subtopic to evaluate weak areas from this practice session
  const getSessionDiagnosticReport = () => {
    const subtopicMap = {};
    sessionAnswers.forEach(ans => {
      if (!subtopicMap[ans.subtopic]) {
        subtopicMap[ans.subtopic] = { correct: 0, total: 0, domainId: ans.domainId };
      }
      subtopicMap[ans.subtopic].total += 1;
      if (ans.isCorrect) subtopicMap[ans.subtopic].correct += 1;
    });

    const weakTopics = [];
    const strongTopics = [];

    Object.entries(subtopicMap).forEach(([subtopic, stat]) => {
      const accuracy = Math.round((stat.correct / stat.total) * 100);
      if (accuracy < 70) {
        weakTopics.push({ subtopic, accuracy, ...stat });
      } else {
        strongTopics.push({ subtopic, accuracy, ...stat });
      }
    });

    // Also include any overall historical weak areas from readiness engine
    readiness.weakAreas.forEach(w => {
      if (!weakTopics.some(t => t.subtopic === w.subtopicId)) {
        weakTopics.push({
          subtopic: w.subtopicName || w.subtopicId,
          accuracy: w.accuracy || 0,
          domainId: w.domainId || 'general'
        });
      }
    });

    return { weakTopics, strongTopics, subtopicMap };
  };

  const isCorrect = isSubmitted && selectedOption === currentQuestion.correctIndex;

  // ==========================================
  // VIEW: DIAGNOSTIC & WEAK AREA REPORT SCREEN
  // ==========================================
  if (isCompleted) {
    const { weakTopics, strongTopics } = getSessionDiagnosticReport();
    const finalPercent = scoreCount.total > 0 ? Math.round((scoreCount.correct / scoreCount.total) * 100) : 0;
    const isPassing = finalPercent >= 70;
    const topWeakTopic = weakTopics[0]?.subtopic || 'azure-networking';

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" role="region" aria-label="Diagnostic Weak Area Report">
        
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Diagnostic Assessment Complete</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Your Cognitive Weak Area Report
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Based on your practice questions, the agent has analyzed your performance against Microsoft Learn AZ-900 domain benchmarks.
              </p>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex-shrink-0 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center min-w-[150px]">
              <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Session Score</span>
              <div className={`text-4xl font-extrabold font-mono ${isPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
                {finalPercent}%
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                {scoreCount.correct} of {scoreCount.total} Correct
              </span>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isPassing ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {isPassing ? 'Passing Mark Hit' : 'Needs Targeted Revision'}
              </span>
            </div>
          </div>
        </div>

        {/* Actionable Weak Areas Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Priority Focus: Weak Areas (<70%) */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-amber-400 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Areas to Focus On ({weakTopics.length})</span>
              </h3>
              <span className="text-xs text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold">
                Accuracy &lt; 70%
              </span>
            </div>

            <p className="text-xs text-slate-300">
              The agent has flagged these concepts as high-risk blindspots for your AZ-900 exam:
            </p>

            {weakTopics.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Incredible! No critical weak areas identified in this session.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {weakTopics.map((topic, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm text-slate-200 capitalize">
                        {topic.subtopic.replace(/-/g, ' ')}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span className="text-rose-400 font-bold">{topic.accuracy}% Accuracy</span>
                        <span>•</span>
                        <span>High Priority</span>
                      </div>
                    </div>

                    {onNavigateToRevision && (
                      <button
                        onClick={() => onNavigateToRevision(topic.subtopic)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1 transition"
                      >
                        <span>Revise</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mastered Strengths */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-emerald-400 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Mastered Strengths ({strongTopics.length})</span>
              </h3>
              <span className="text-xs text-emerald-300/80 bg-emerald-500/10 px-2 py-0.5 rounded font-mono font-bold">
                Accuracy &ge; 70%
              </span>
            </div>

            <p className="text-xs text-slate-300">
              You are retaining these concepts well. Keep them sharp with occasional flashcard reviews:
            </p>

            {strongTopics.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs">
                Complete more questions to validate your strong areas.
              </div>
            ) : (
              <div className="space-y-2.5">
                {strongTopics.map((topic, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-sm text-slate-200 capitalize">
                      {topic.subtopic.replace(/-/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {topic.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Personalized "Rafiki" AI Revision Plan */}
        <div 
          className="p-6 rounded-2xl border space-y-3"
          style={{ 
            backgroundColor: `${currentStyle.color}08`, 
            borderColor: `${currentStyle.color}40` 
          }}
        >
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" style={{ color: currentStyle.color }} />
            <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: currentStyle.color }}>
              Rafiki's Action Plan for {currentStyle.name}s:
            </h4>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            Your top focus area is <strong>{topWeakTopic.replace(/-/g, ' ')}</strong>. Because you prefer <strong>{currentStyle.name} learning</strong>, we recommend reviewing this topic using {currentStyle.name === 'Auditory' ? 'real-world African analogies like M-Pesa float and regional market hubs' : currentStyle.name === 'Visual' ? 'interactive architecture diagrams' : 'hands-on CLI sandboxes'} before taking another test round.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onNavigateToRevision && (
              <button
                onClick={() => onNavigateToRevision(topWeakTopic)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition"
              >
                <span>Revise {topWeakTopic.replace(/-/g, ' ')} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onNavigateToJourney && (
              <button
                onClick={onNavigateToJourney}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition flex items-center space-x-2"
              >
                <span>View Road Map Pitstops</span>
              </button>
            )}

            <button
              onClick={() => handleRestart('diagnostic')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm transition flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retest (New 5-Question Sprint)</span>
            </button>
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW: ACTIVE QUIZ QUESTIONS
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" role="region" aria-label="Practice Quiz">
      
      {/* Header & Mode Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>Practice First &bull; Instant Weak Area Diagnosis</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>Smart Practice & Assessment Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Answer questions first to generate an instant diagnosis of what you need to revise.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleRestart('diagnostic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              mode === 'diagnostic'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>5-Question Diagnostic Sprint</span>
          </button>

          <button
            onClick={() => handleRestart('adaptive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              mode === 'adaptive'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>Weak Areas Drill</span>
          </button>

          <button
            onClick={() => handleRestart('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mode === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>All Questions</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Score Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-semibold text-slate-300">
          Question {currentIndex + 1} of {maxQuestions} {mode === 'diagnostic' && '(Diagnostic Mode)'}
        </span>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline">Shortcuts: <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">1-4</kbd> to pick, <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Enter</kbd> to submit</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span>Score: <strong className="text-emerald-400">{scoreCount.correct}</strong> / {scoreCount.total}</span>
          
          {scoreCount.total > 0 && (
            <button
              onClick={handleFinishQuiz}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-2"
            >
              Finish & View Report →
            </button>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Topic Tag & TTS Read Aloud Control */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              {currentQuestion.domainId.replace('-', ' ')}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Topic: <strong className="text-slate-300">{currentQuestion.subtopic}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Audio Read Aloud Button */}
            <button
              onClick={handleToggleSpeak}
              aria-label={isSpeaking ? 'Stop reading question aloud' : 'Read question aloud with text to speech'}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition border ${
                isSpeaking 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
              title="Read Question Aloud (TTS)"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
            </button>

            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
              currentQuestion.difficulty === 'beginner' 
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>

        {/* Question Prompt */}
        <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3" role="radiogroup" aria-label="Answer options">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isTargetCorrect = idx === currentQuestion.correctIndex;

            let optionStyle = 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-200';
            let circleStyle = 'border-slate-700 text-slate-400';

            if (isSelected && !isSubmitted) {
              optionStyle = 'border-blue-500 bg-blue-500/10 text-white shadow-sm ring-1 ring-blue-500';
              circleStyle = 'border-blue-500 bg-blue-500 text-white';
            } else if (isSubmitted) {
              if (isTargetCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500';
                circleStyle = 'border-emerald-500 bg-emerald-500 text-white';
              } else if (isSelected && !isTargetCorrect) {
                optionStyle = 'border-rose-500 bg-rose-500/15 text-rose-200 ring-1 ring-rose-500';
                circleStyle = 'border-rose-500 bg-rose-500 text-white';
              } else {
                optionStyle = 'border-slate-800/80 bg-slate-950/40 text-slate-500 opacity-60';
              }
            }

            return (
              <div
                key={idx}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && handleSelectOption(idx)}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-xl border text-sm transition-all duration-150 flex items-start space-x-3.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${optionStyle}`}
              >
                <div className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${circleStyle}`}>
                  {isSubmitted && isTargetCorrect ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isSubmitted && isSelected && !isTargetCorrect ? (
                    <XCircle className="w-3.5 h-3.5" />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span className="flex-1 leading-snug">{option}</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono text-[10px] text-slate-400">
                  {idx + 1}
                </kbd>
              </div>
            );
          })}
        </div>

        {/* Action Controls: Submit or Next */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => handleRestart(mode)}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition focus-visible:ring-2 focus-visible:ring-blue-400 p-1 rounded"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Questions</span>
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-blue-400 ${
                selectedOption !== null
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-blue-700 text-blue-200 font-mono text-[10px]">Enter</kbd>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span>{currentIndex + 1 >= maxQuestions ? 'View Weak Area Report' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-blue-700 text-blue-200 font-mono text-[10px]">N</kbd>
            </button>
          )}
        </div>

        {/* Screen Reader Live Region */}
        <div aria-live="polite" className="sr-only">
          {isSubmitted && (isCorrect 
            ? `Correct! ${currentQuestion.explanation.whyCorrect}` 
            : `Incorrect. The correct answer was option ${String.fromCharCode(65 + currentQuestion.correctIndex)}.`)}
        </div>

        {/* Detailed Explanation & Why It's Wrong Panel */}
        {isSubmitted && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-5 animate-fade-in">
            
            {/* Verdict Header */}
            <div className={`p-4 rounded-xl flex items-center space-x-3 ${
              isCorrect 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  {isCorrect ? 'Correct! High Vibes! 🎉' : 'Incorrect, but a great learning moment! 💡'}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">
                  The correct answer is <strong>{String.fromCharCode(65 + currentQuestion.correctIndex)}: {currentQuestion.options[currentQuestion.correctIndex]}</strong>.
                </p>
              </div>
            </div>

            {/* Why Correct Explanation */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-xl space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Why this answer is correct (Microsoft Learn Outline)</span>
              </h5>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentQuestion.explanation.whyCorrect}
              </p>
            </div>

            {/* Why Other Options Are Wrong */}
            {currentQuestion.explanation.distractors && (
              <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Deep Dive: Why the other options are wrong</span>
                  </h5>
                  <button 
                    onClick={() => setShowDistractors(!showDistractors)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    {showDistractors ? 'Hide' : 'Show'}
                  </button>
                </div>

                {showDistractors && (
                  <div className="space-y-2 pt-1">
                    {Object.entries(currentQuestion.explanation.distractors).map(([optIdx, distractorText]) => {
                      const idxNum = parseInt(optIdx, 10);
                      return (
                        <div key={optIdx} className="text-xs p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start space-x-2.5">
                          <span className="font-mono font-bold text-rose-400 flex-shrink-0">
                            Option {String.fromCharCode(65 + idxNum)}:
                          </span>
                          <span className="text-slate-300 leading-relaxed">{distractorText}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Learning-Style Specific Revision Tip */}
            {currentQuestion.learningStyleTip && (
              <div 
                className="p-4 rounded-xl border space-y-1.5"
                style={{ 
                  backgroundColor: `${currentStyle.color}10`, 
                  borderColor: `${currentStyle.color}35` 
                }}
              >
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" style={{ color: currentStyle.color }} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: currentStyle.color }}>
                    Custom Revision Hint for {currentStyle.name}s:
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentQuestion.learningStyleTip[profile.learningStyle] || currentQuestion.learningStyleTip.auditory}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
