import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  BookOpen, 
  HelpCircle, 
  Zap, 
  Award, 
  Clock,
  RotateCcw,
  Check,
  ChevronRight,
  Eye,
  Headphones,
  Terminal,
  FileText
} from 'lucide-react';
import { PROGRESSIVE_STAGES } from '../data/progressiveStages';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { FLASHCARDS } from '../data/flashcards';
import { REVISION_CONTENT_BY_TOPIC, LEARNING_STYLES } from '../data/learningStyles';
import { NotificationService } from '../services/notificationService';

export const ProgressiveMasterJourney = ({ 
  profile, 
  readiness, 
  masteryState, 
  onRecordAnswer, 
  onOpenStudyBuddy,
  onOpenPlanner,
  onStartDiagnostic
}) => {
  const currentStyle = LEARNING_STYLES[profile.learningStyle] || LEARNING_STYLES.auditory;

  // Track completed missions in state / storage
  const [completedMissionIds, setCompletedMissionIds] = useState(() => {
    try {
      const saved = localStorage.getItem('africloud_completed_missions');
      return saved ? JSON.parse(saved) : ['m-1-1']; // seeded first step as completed
    } catch {
      return ['m-1-1'];
    }
  });

  // Active mission runner modal state
  const [activeMission, setActiveMission] = useState(null);
  const [runnerStep, setRunnerStep] = useState('learn'); // 'learn' | 'practice' | 'flashcard' | 'result'
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [missionScore, setMissionScore] = useState({ correct: 0, total: 0 });
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

  // Flatten all missions to find the current active one
  const allMissions = [];
  PROGRESSIVE_STAGES.forEach(stage => {
    stage.missions.forEach(m => {
      allMissions.push({ ...m, stageNumber: stage.number, stageTitle: stage.title, stageColor: stage.color });
    });
  });

  const nextUnfinishedMission = allMissions.find(m => !completedMissionIds.includes(m.id)) || allMissions[allMissions.length - 1];

  const handleStartMission = (mission) => {
    setActiveMission(mission);
    setRunnerStep('learn');
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setMissionScore({ correct: 0, total: 0 });
    setIsFlashcardFlipped(false);
  };

  const handleCompleteActiveMission = () => {
    if (!completedMissionIds.includes(activeMission.id)) {
      const updated = [...completedMissionIds, activeMission.id];
      setCompletedMissionIds(updated);
      localStorage.setItem('africloud_completed_missions', JSON.stringify(updated));
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 }
    });
    NotificationService.playChime('success');
    setActiveMission(null);
  };

  // Get matching questions and flashcards for the active mission with safe fallbacks
  const activeQuestions = activeMission?.subtopicId 
    ? PRACTICE_QUESTIONS.filter(q => q.subtopic === activeMission.subtopicId)
    : [];
  const activeQuestion = activeQuestions[0] || PRACTICE_QUESTIONS[0];
  const activeFlashcard = (activeMission?.subtopicId && FLASHCARDS.find(f => f.subtopic === activeMission.subtopicId)) || FLASHCARDS[0];
  const fallbackTopicContent = REVISION_CONTENT_BY_TOPIC['cloud-benefits'] || {};
  const activeTopicContent = (activeMission?.subtopicId && REVISION_CONTENT_BY_TOPIC[activeMission.subtopicId]) || fallbackTopicContent;

  // Handle Quiz in Runner
  const handleAnswerOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleSubmitMissionQuestion = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    const isCorrect = selectedAnswer === activeQuestion.correctIndex;
    setIsAnswerSubmitted(true);
    setMissionScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    onRecordAnswer(activeQuestion.subtopic, isCorrect);
    NotificationService.playChime(isCorrect ? 'success' : 'alert');
  };

  // Calculate overall progressive completion %
  const totalMissionsCount = allMissions.length;
  const completedCount = completedMissionIds.length;
  const progressPercent = Math.round((completedCount / totalMissionsCount) * 100);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Banner: Progressive Level Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Guided Progressive Mastery Journey</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Level {nextUnfinishedMission?.stageNumber || 1}: <span className="bg-gradient-to-r from-blue-400 to-amber-300 bg-clip-text text-transparent">{nextUnfinishedMission?.stageTitle}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Step-by-step progressive path to passing AZ-900. Complete each mission through:
              <strong className="text-white"> 1. Explore by Learning Style</strong> &rarr; <strong className="text-white">2. Practice Checkpoint</strong> &rarr; <strong className="text-white">3. Memory Lock</strong>.
            </p>

            {/* Main Action Button */}
            <div className="pt-2">
              <button
                onClick={() => handleStartMission(nextUnfinishedMission)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition transform hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Continue Journey: {nextUnfinishedMission?.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progressive Circular Progress Tracker */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner flex-shrink-0">
            <span className="text-3xl font-black text-white">{progressPercent}%</span>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Journey Cleared</span>
            <span className="text-xs font-mono text-indigo-300 mt-2 font-semibold">
              {completedCount} of {totalMissionsCount} Missions
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action: Practice First / Diagnostic Assessment */}
      {onStartDiagnostic && (
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>Want to test yourself first?</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Fast 3-Min Assessment</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Take a 5-question diagnostic sprint to immediately generate your <strong>Weak Areas Report</strong> and tailored focus plan.
              </p>
            </div>
          </div>
          <button
            onClick={onStartDiagnostic}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
          >
            <span>Take Diagnostic Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* The Progressive Master Stepper (Roadmap) */}
      <div className="space-y-8">
        {PROGRESSIVE_STAGES.map((stage) => {
          const stageMissions = stage.missions;
          const stageCleared = stageMissions.every(m => completedMissionIds.includes(m.id));

          return (
            <div 
              key={stage.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
            >
              {/* Stage Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.number}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-white">{stage.title}</h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        Weight: {stage.weight}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    stageCleared 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {stageCleared ? 'Stage Mastered ✅' : 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Sequential Mission Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stageMissions.map((mission, idx) => {
                  const isDone = completedMissionIds.includes(mission.id);
                  const isCurrent = nextUnfinishedMission?.id === mission.id;
                  const isWeak = readiness.weakAreas.some(w => w.subtopicId === mission.subtopicId);

                  return (
                    <div
                      key={mission.id}
                      onClick={() => handleStartMission(mission)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-4 relative group ${
                        isDone
                          ? 'bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/60'
                          : isCurrent
                          ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Step Indicator & Status Icon */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          Step {stage.number}.{idx + 1}
                        </span>

                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isCurrent ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                            Active Step
                          </span>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                            <Play className="w-3 h-3 fill-slate-500 ml-0.5" />
                          </div>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5 flex-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                          {mission.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {mission.description}
                        </p>
                      </div>

                      {/* Weak Area Tag or XP Badge */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        {isWeak ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Weakness Pitstop</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-indigo-300 font-semibold">
                            +{mission.xp} XP
                          </span>
                        )}

                        <span className="text-xs font-semibold text-blue-400 flex items-center space-x-0.5 group-hover:translate-x-1 transition">
                          <span>{isDone ? 'Review' : 'Start'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* 🚀 Active Mission Runner Modal (The Guided Experience) */}
      {activeMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Level {activeMission.stageNumber} • Mission Runner
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeMission.title}</h3>
              </div>
              <button
                onClick={() => setActiveMission(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Stepper Tabs within the Mission */}
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              <button
                onClick={() => setRunnerStep('learn')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition ${
                  runnerStep === 'learn'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Explore ({currentStyle.name.split(' ')[0]})</span>
              </button>

              <button
                onClick={() => setRunnerStep('practice')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition ${
                  runnerStep === 'practice'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>2. Practice Checkpoint</span>
              </button>

              <button
                onClick={() => setRunnerStep('flashcard')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center space-x-1.5 transition ${
                  runnerStep === 'flashcard'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>3. Memory Lock</span>
              </button>
            </div>

            {/* Step 1: Learn by Active Style */}
            {runnerStep === 'learn' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs sm:text-sm">
                  💡 <strong>Learning Style: {currentStyle.name}</strong> — {currentStyle.description}
                </div>

                {/* Show content matching learner's style with safe fallbacks */}
                {currentStyle.id === 'auditory' && activeTopicContent?.auditory && (
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-amber-400 text-sm">{activeTopicContent.auditory.analogyTitle}</h4>
                    <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                      {activeTopicContent.auditory.story}
                    </p>
                  </div>
                )}

                {currentStyle.id === 'visual' && activeTopicContent?.visual && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeTopicContent.visual.elements?.map((el, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                        <strong className="text-sky-400 block mb-1">{el.label}</strong>
                        {el.customer && <div>Customer: {el.customer}</div>}
                        {el.cloud && <div>Cloud: {el.cloud}</div>}
                        {el.scope && <div>Scope: {el.scope}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {currentStyle.id === 'kinesthetic' && activeTopicContent?.kinesthetic && (
                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
                    <div className="text-emerald-400 font-bold">{activeTopicContent.kinesthetic.labTitle}</div>
                    <code className="text-slate-200 block p-2 rounded bg-slate-900 border border-slate-800">
                      {activeTopicContent.kinesthetic.cliCommand || 'az group create --name TestRG --location southafricanorth'}
                    </code>
                  </div>
                )}

                {currentStyle.id === 'reading' && activeTopicContent?.reading && (
                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200">
                    <div className="text-pink-400 font-bold font-mono">Mnemonic: {activeTopicContent.reading.mnemonics}</div>
                    {activeTopicContent.reading.cheatSheet?.map((item, idx) => (
                      <div key={idx} className="p-1.5">{item}</div>
                    ))}
                  </div>
                )}

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => setRunnerStep('practice')}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition flex items-center space-x-1.5"
                  >
                    <span>Proceed to Practice Checkpoint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Practice Checkpoint with Instant Feedback */}
            {runnerStep === 'practice' && (
              <div className="space-y-5 animate-fade-in">
                <h4 className="text-sm sm:text-base font-semibold text-white">
                  {activeQuestion?.question}
                </h4>

                <div className="space-y-2.5">
                  {activeQuestion?.options?.map((opt, i) => {
                    const isPicked = selectedAnswer === i;
                    const isTargetCorrect = i === activeQuestion?.correctIndex;

                    let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-850';
                    if (isPicked && !isAnswerSubmitted) style = 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500';
                    if (isAnswerSubmitted) {
                      if (isTargetCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                      else if (isPicked && !isTargetCorrect) style = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    }

                    return (
                      <div
                        key={i}
                        onClick={() => handleAnswerOption(i)}
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-start space-x-3 ${style}`}
                      >
                        <span className="font-bold font-mono">{String.fromCharCode(65 + i)}.</span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitMissionQuestion}
                    disabled={selectedAnswer === null}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                      selectedAnswer !== null 
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div className="space-y-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <strong className="text-emerald-400 block">Explanation:</strong>
                      <p>{activeQuestion?.explanation?.whyCorrect || 'Correct answer verified against syllabus.'}</p>
                    </div>

                    <button
                      onClick={() => setRunnerStep('flashcard')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
                    >
                      <span>Proceed to Memory Lock</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Flashcard Memory Lock */}
            {runnerStep === 'flashcard' && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center text-xs text-slate-400">
                  Click the flashcard to flip and verify active recall.
                </div>

                <div
                  onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                  className="min-h-[220px] rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition p-6 flex flex-col justify-between cursor-pointer text-center select-none shadow-inner"
                >
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    {isFlashcardFlipped ? 'Answer & Analogy' : 'Concept Question'}
                  </span>

                  {!isFlashcardFlipped ? (
                    <h4 className="text-xl font-bold text-white my-auto">
                      {activeFlashcard?.term || 'Concept Lock'}
                    </h4>
                  ) : (
                    <div className="my-auto space-y-2 text-left">
                      <p className="text-xs sm:text-sm text-slate-200 font-medium">{activeFlashcard?.definition}</p>
                      {activeFlashcard?.africanAnalogy && (
                        <p className="text-xs text-amber-300">🌍 {activeFlashcard.africanAnalogy}</p>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500">
                    {isFlashcardFlipped ? 'Click to flip back' : 'Click to flip'}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setRunnerStep('learn')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Back to Learn
                  </button>

                  <button
                    onClick={handleCompleteActiveMission}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center space-x-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Mission (+{activeMission.xp} XP)</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
