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
  BookOpen
} from 'lucide-react';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { AZ900_DOMAINS } from '../data/curriculum';
import { LEARNING_STYLES } from '../data/learningStyles';
import { NotificationService } from '../services/notificationService';

export const PracticeQuiz = ({ 
  profile, 
  readiness, 
  onRecordAnswer, 
  initialMode = 'adaptive' 
}) => {
  const currentStyle = LEARNING_STYLES[profile.learningStyle] || LEARNING_STYLES.auditory;
  const [mode, setMode] = useState(initialMode); // 'adaptive' | 'all' | 'domain'
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreCount, setScoreCount] = useState({ correct: 0, total: 0 });
  const [showDistractors, setShowDistractors] = useState(true);

  // Filter questions based on mode and weak areas
  const getFilteredQuestions = () => {
    let pool = [...PRACTICE_QUESTIONS];

    if (mode === 'adaptive' && readiness.weakAreas.length > 0) {
      // Prioritize weak subtopics first
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

  useEffect(() => {
    // Reset question state on filter/index change
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [currentIndex, mode, selectedDomain]);

  const handleSelectOption = (idx) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsSubmitted(true);

    // Update session score
    setScoreCount(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    // Record answer into persistent storage engine
    onRecordAnswer(currentQuestion.subtopic, isCorrect);

    // Vibe effects!
    if (isCorrect) {
      NotificationService.playChime('success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
      });
    } else {
      NotificationService.playChime('alert');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop or finish
      setCurrentIndex(0);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScoreCount({ correct: 0, total: 0 });
  };

  if (!currentQuestion) {
    return (
      <div className="p-12 text-center text-slate-400">
        No questions match the current filter.
      </div>
    );
  }

  const isCorrect = isSubmitted && selectedOption === currentQuestion.correctIndex;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header & Mode Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>Smart Practice & Assessment Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Instant feedback and deep "Why It's Wrong" distractor explanations.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setMode('adaptive'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              mode === 'adaptive'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Agent Adaptive (Weak Areas)</span>
          </button>

          <button
            onClick={() => { setMode('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mode === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>All Questions</span>
          </button>

          <button
            onClick={() => { setMode('domain'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mode === 'domain'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>Domain Drill</span>
          </button>
        </div>
      </div>

      {/* Domain drill dropdown when in domain mode */}
      {mode === 'domain' && (
        <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <span className="text-xs text-slate-400 font-medium">Select Domain:</span>
          <select
            value={selectedDomain}
            onChange={(e) => { setSelectedDomain(e.target.value); setCurrentIndex(0); }}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Domains</option>
            {AZ900_DOMAINS.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.weight})</option>
            ))}
          </select>
        </div>
      )}

      {/* Progress & Live Score Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-semibold text-slate-300">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center space-x-4">
          <span>Session Accuracy: <strong className="text-white">{scoreCount.total > 0 ? Math.round((scoreCount.correct / scoreCount.total) * 100) : 0}%</strong></span>
          <span className="text-slate-600">|</span>
          <span>Score: <strong className="text-emerald-400">{scoreCount.correct}</strong> / {scoreCount.total}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Topic Tag & Difficulty */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
              {currentQuestion.domainId.replace('-', ' ')}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Topic: <strong className="text-slate-300">{currentQuestion.subtopic}</strong>
            </span>
          </div>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
            currentQuestion.difficulty === 'beginner' 
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
              : currentQuestion.difficulty === 'intermediate'
              ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
              : 'text-purple-400 border-purple-500/30 bg-purple-500/10'
          }`}>
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Question Prompt */}
        <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isTargetCorrect = idx === currentQuestion.correctIndex;

            let optionStyle = 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-200';
            let circleStyle = 'border-slate-700 text-slate-400';

            if (isSelected && !isSubmitted) {
              optionStyle = 'border-blue-500 bg-blue-500/10 text-white shadow-sm';
              circleStyle = 'border-blue-500 bg-blue-500 text-white';
            } else if (isSubmitted) {
              if (isTargetCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-200';
                circleStyle = 'border-emerald-500 bg-emerald-500 text-white';
              } else if (isSelected && !isTargetCorrect) {
                optionStyle = 'border-rose-500 bg-rose-500/15 text-rose-200';
                circleStyle = 'border-rose-500 bg-rose-500 text-white';
              } else {
                optionStyle = 'border-slate-800/80 bg-slate-950/40 text-slate-500 opacity-60';
              }
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-xl border text-sm transition-all duration-150 flex items-start space-x-3 cursor-pointer ${optionStyle}`}
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
              </div>
            );
          })}
        </div>

        {/* Action Controls: Submit or Next */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleRestart}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center space-x-2 ${
                selectedOption !== null
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
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

            {/* Why Other Options Are Wrong (The Hackathon Killer Feature!) */}
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
