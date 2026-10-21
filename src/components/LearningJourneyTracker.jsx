import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Brain,
  ShieldCheck,
  Target
} from 'lucide-react';
import { AZ900_DOMAINS } from '../data/curriculum';
import { LEARNING_STYLES } from '../data/learningStyles';

export const LearningJourneyTracker = ({ 
  readiness, 
  profile, 
  masteryState, 
  onStartQuiz, 
  onSelectWeakTopic 
}) => {
  const currentStyle = LEARNING_STYLES[profile.learningStyle] || LEARNING_STYLES.auditory;

  // Compute total questions answered across all topics
  let totalAnswered = 0;
  let totalCorrect = 0;
  Object.values(masteryState).forEach(item => {
    totalAnswered += (item.total || 0);
    totalCorrect += (item.correct || 0);
  });
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Determine readiness status color
  const getReadinessColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'Exam Ready', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    if (score >= 65) return { label: 'Almost Ready', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    return { label: 'Needs Focus', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Hero Banner: Agent Cognitive Diagnosis */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5" />
              <span>Agent Learning Journey Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Habari, <span className="bg-gradient-to-r from-blue-400 to-amber-300 bg-clip-text text-transparent">{profile.name}</span>! 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Your AZ-900 readiness is currently evaluated at <strong className="text-white">{readiness.overallReadiness}%</strong>. 
              The agent has calibrated recommendations tailored to your <strong style={{ color: currentStyle.color }}>{currentStyle.name}</strong> style.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onStartQuiz('weakness')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center space-x-2 transition"
              >
                <Zap className="w-4 h-4" />
                <span>Practice Weak Areas</span>
              </button>
              <button
                onClick={() => onStartQuiz('mock')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-sm transition"
              >
                <span>Full Mock Exam</span>
              </button>
            </div>
          </div>

          {/* SVG Circular Readiness Gauge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-inner">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-slate-800 stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`stroke-current transition-all duration-1000 ease-out ${
                    readiness.overallReadiness >= 80 ? 'text-emerald-500' : readiness.overallReadiness >= 65 ? 'text-amber-500' : 'text-blue-500'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - readiness.overallReadiness / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white">{readiness.overallReadiness}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Readiness</span>
              </div>
            </div>
            <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${getReadinessColor(readiness.overallReadiness)}`}>
              {readiness.readinessStatus}
            </span>
          </div>

        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{totalAnswered}</div>
            <div className="text-xs text-slate-400">Questions Answered</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{overallAccuracy}%</div>
            <div className="text-xs text-slate-400">Accuracy Rate</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{readiness.weakAreas.length}</div>
            <div className="text-xs text-slate-400">High-Priority Weak Areas</div>
          </div>
        </div>
      </div>

      {/* High-Priority Weak Areas & Prescribed Revision Strategies */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Agent Diagnosis: Identified Weak Areas</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Topics scoring below 70% where exam failure risk is concentrated. Click to revise with your custom learning style.
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Tailored to: <strong style={{ color: currentStyle.color }}>{currentStyle.name}</strong>
          </span>
        </div>

        {readiness.weakAreas.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-emerald-300">Outstanding Mastery!</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
              All your AZ-900 topics are scoring 70% or above. Take a full timed simulation to solidify your speed!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {readiness.weakAreas.map((weak) => {
              const badge = getScoreBadge(weak.score);
              return (
                <div 
                  key={weak.subtopicId}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white text-sm sm:text-base">{weak.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badge.color}`}>
                        {weak.score}% Score
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      💡 <strong>Prescribed Revision ({currentStyle.name}):</strong> {currentStyle.studyMethod}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectWeakTopic(weak.subtopicId)}
                    className="w-full md:w-auto px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                  >
                    <span>Revise This Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official AZ-900 Domain Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>AZ-900 Official Domain Breakdown</span>
          </h2>
          <span className="text-xs text-slate-400">Official Microsoft Learn Syllabus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AZ900_DOMAINS.map((domain) => {
            const domainScoreData = readiness.domainScores[domain.id] || { score: 50 };
            const score = domainScoreData.score;
            return (
              <div 
                key={domain.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: domain.bgLight, color: domain.color }}
                    >
                      Weight: {domain.weight}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Mastery: <strong className="text-white">{score}%</strong>
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{domain.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{domain.description}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ 
                        width: `${score}%`, 
                        backgroundColor: domain.color 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{domain.subtopics.length} Subtopics</span>
                    <span>Target: &gt;80%</span>
                  </div>
                </div>

                {/* Subtopic bullet summary */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  {domain.subtopics.map(sub => {
                    const subItem = masteryState[sub.id] || { score: 50 };
                    return (
                      <div key={sub.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 truncate max-w-[180px]">{sub.name}</span>
                        <span className={`font-mono text-[11px] ${subItem.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {subItem.score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
