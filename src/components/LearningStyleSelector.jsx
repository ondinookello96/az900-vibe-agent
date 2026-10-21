import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Eye, 
  Headphones, 
  Terminal, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';
import { LEARNING_STYLES } from '../data/learningStyles';
import { NotificationService } from '../services/notificationService';

export const LearningStyleSelector = ({ 
  isOpen, 
  onClose, 
  currentStyleId, 
  onSelectStyle 
}) => {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'diagnostic'
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  const [diagnosedResult, setDiagnosedResult] = useState(null);

  if (!isOpen) return null;

  const diagnosticQuestions = [
    {
      id: 1,
      q: 'When learning about Azure Virtual Networks & ExpressRoute, what makes it click first?',
      options: [
        { style: 'visual', label: 'Seeing an architecture diagram showing the fiber path vs public internet' },
        { style: 'auditory', label: 'Listening to an analogy like private bullet trains vs public bus highways' },
        { style: 'kinesthetic', label: 'Typing `az network vnet create` in the CLI sandbox' },
        { style: 'reading', label: 'Reviewing a comparison table listing bandwidth, SLAs, and security features' }
      ]
    },
    {
      id: 2,
      q: 'When preparing for tricky AZ-900 exam questions, what is your preferred study method?',
      options: [
        { style: 'visual', label: 'Mind maps and color-coded hierarchy pyramids (Management Groups -> Resources)' },
        { style: 'auditory', label: 'Explaining concepts out loud to a peer or listening to podcasts/mentors' },
        { style: 'kinesthetic', label: 'Navigating the Azure portal to see the configuration toggles firsthand' },
        { style: 'reading', label: 'Writing bullet notes, memorizing acronyms (S.H.E.A.D), and flashcard drills' }
      ]
    }
  ];

  const handleSelectDiagnosticOption = (qId, style) => {
    const updated = { ...diagnosticAnswers, [qId]: style };
    setDiagnosticAnswers(updated);

    if (Object.keys(updated).length === diagnosticQuestions.length) {
      // Calculate most common style
      const counts = {};
      Object.values(updated).forEach(s => counts[s] = (counts[s] || 0) + 1);
      const topStyle = Object.keys(counts).reduce((a, b) => counts[a] >= counts[b] ? a : b);
      setDiagnosedResult(topStyle);
    }
  };

  const handleApplyDiagnosed = () => {
    if (diagnosedResult) {
      onSelectStyle(diagnosedResult);
      NotificationService.notify({
        title: '🎨 Learning Style Calibrated',
        message: `Your learning journey is now tailored to ${LEARNING_STYLES[diagnosedResult]?.name}!`,
        type: 'success'
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Learning Journey Personalization</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Choose Your Primary Learning Style
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            The agent dynamically adapts explanations, analogies, and revision hints based on how your brain learns best.
          </p>
        </div>

        {/* Tabs: Direct Select vs Quick Diagnostic */}
        <div className="flex border-b border-slate-800 space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'direct'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Direct Selector
          </button>
          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`pb-2.5 transition border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'diagnostic'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>2-Question Diagnostic Quiz</span>
          </button>
        </div>

        {/* 1. Direct Selector View */}
        {activeTab === 'direct' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Object.values(LEARNING_STYLES).map(style => {
              const isSelected = currentStyleId === style.id;
              return (
                <div
                  key={style.id}
                  onClick={() => {
                    onSelectStyle(style.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: style.color }}></span>
                      <span>{style.name}</span>
                    </span>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-blue-500 text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{style.description}</p>
                  <span className="text-[11px] font-semibold text-slate-500">
                    💡 Method: {style.studyMethod}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. Diagnostic Quiz View */}
        {activeTab === 'diagnostic' && (
          <div className="space-y-5 animate-fade-in">
            {diagnosticQuestions.map((q) => (
              <div key={q.id} className="space-y-2.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  Scenario {q.id}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-white">{q.q}</h4>
                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, i) => {
                    const isPicked = diagnosticAnswers[q.id] === opt.style;
                    return (
                      <div
                        key={i}
                        onClick={() => handleSelectDiagnosticOption(q.id, opt.style)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          isPicked
                            ? 'bg-blue-600/20 border-blue-500 text-white font-medium'
                            : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {diagnosedResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300 font-semibold block">Diagnostic Result:</span>
                  <span className="text-sm font-bold text-white">
                    You align best with the {LEARNING_STYLES[diagnosedResult]?.name} style!
                  </span>
                </div>
                <button
                  onClick={handleApplyDiagnosed}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
                >
                  Apply Result
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
