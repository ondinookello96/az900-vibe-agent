import React, { useState } from 'react';
import { 
  BookOpen, 
  Eye, 
  Headphones, 
  Terminal, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import { REVISION_CONTENT_BY_TOPIC, LEARNING_STYLES } from '../data/learningStyles';
import { AZ900_DOMAINS } from '../data/curriculum';

export const RevisionSuggestions = ({ 
  profile, 
  readiness, 
  initialTopicId, 
  onPracticeTopic 
}) => {
  // Flatten all subtopics
  const allSubtopics = [];
  AZ900_DOMAINS.forEach(d => {
    d.subtopics.forEach(s => {
      allSubtopics.push({ ...s, domainName: d.name, domainColor: d.color });
    });
  });

  // Default to initialTopicId, or first weak area, or first subtopic
  const defaultTopic = initialTopicId || (readiness.weakAreas[0]?.subtopicId) || 'networking-services';
  const [selectedTopicId, setSelectedTopicId] = useState(defaultTopic);
  const [activeStyleTab, setActiveStyleTab] = useState(profile.learningStyle || 'auditory');
  const [copiedCli, setCopiedCli] = useState(false);

  // Content for current topic (fallback to networking-services if specific topic not in pre-baked set)
  const topicContent = REVISION_CONTENT_BY_TOPIC[selectedTopicId] || REVISION_CONTENT_BY_TOPIC['networking-services'] || REVISION_CONTENT_BY_TOPIC['core-components'];
  const currentSubtopicMeta = allSubtopics.find(s => s.id === selectedTopicId) || allSubtopics[0];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Multimodal Adaptive Revision Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Tailored Revision by Learning Style
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose your topic and explore it through visual maps, African analogies, CLI commands, or cheat sheets.
          </p>
        </div>

        {/* Topic Selector Dropdown */}
        <div className="w-full md:w-auto">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Target Subtopic:
          </label>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full md:w-64 bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {allSubtopics.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weak area alert banner if current selection is weak */}
      {readiness.weakAreas.some(w => w.subtopicId === selectedTopicId) && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-300 text-xs sm:text-sm">
          <div className="flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Identified Weak Area:</strong> Your diagnostic score on this topic is under 70%. Focus on the key concepts below to level up!
            </span>
          </div>
          <button
            onClick={() => onPracticeTopic(selectedTopicId)}
            className="hidden sm:flex items-center space-x-1 font-semibold text-amber-200 underline hover:text-white"
          >
            <span>Practice Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Learning Style Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.values(LEARNING_STYLES).map(style => {
          const isActive = activeStyleTab === style.id;
          return (
            <button
              key={style.id}
              onClick={() => setActiveStyleTab(style.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-slate-800 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.color }}></span>
                  <span>{style.name}</span>
                </span>
                {profile.learningStyle === style.id && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 font-semibold">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{style.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Main Multi-Modal Content Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Topic Title & Subtopic Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-2">
          <div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {currentSubtopicMeta.domainName}
            </span>
            <h3 className="text-xl font-bold text-white mt-1.5">{topicContent.title}</h3>
            <p className="text-xs text-slate-400">{currentSubtopicMeta.description}</p>
          </div>

          <button
            onClick={() => onPracticeTopic(selectedTopicId)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test My Understanding</span>
          </button>
        </div>

        {/* 1. VISUAL EXPLORER TAB */}
        {activeStyleTab === 'visual' && topicContent.visual && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs sm:text-sm flex items-center space-x-3">
              <Eye className="w-5 h-5 text-sky-400 flex-shrink-0" />
              <span>
                <strong>Visual Mental Model:</strong> Study the topology and boundaries below. Focus on where customer responsibility ends and cloud begins.
              </span>
            </div>

            {/* Architecture Card Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topicContent.visual.elements?.map((el, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                    {el.label}
                  </span>
                  <div className="text-xs text-slate-300 pt-1">
                    {el.customer && <div><strong className="text-white">Customer:</strong> {el.customer}</div>}
                    {el.cloud && <div><strong className="text-white">Microsoft:</strong> {el.cloud}</div>}
                    {el.scope && <div><strong className="text-white">Scope:</strong> {el.scope}</div>}
                    {el.access && <div><strong className="text-white">Access:</strong> {el.access}</div>}
                    {el.cost && <div><strong className="text-white">Cost:</strong> {el.cost}</div>}
                    {el.purpose && <div><strong className="text-white">Purpose:</strong> {el.purpose}</div>}
                    {el.effect && <div><strong className="text-white">Effect:</strong> {el.effect}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Gold Tip */}
            {topicContent.visual.tip && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong>Visual Rule of Thumb:</strong> {topicContent.visual.tip}</span>
              </div>
            )}
          </div>
        )}

        {/* 2. AUDITORY & STORYTELLING TAB */}
        {activeStyleTab === 'auditory' && topicContent.auditory && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-center space-x-3">
              <Headphones className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>
                <strong>African Cultural Analogy:</strong> Ground abstract cloud concepts in daily experiences, local telecom infrastructure, and community markets.
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h4 className="text-base font-bold text-amber-300">
                {topicContent.auditory.analogyTitle}
              </h4>
              <div className="text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {topicContent.auditory.story}
              </div>
            </div>

            {/* Vocalize Prompt */}
            {topicContent.auditory.voicePrompt && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Say This Out Loud (Feynman Technique):</strong>
                  <p className="mt-1 italic text-slate-400">"{topicContent.auditory.voicePrompt}"</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. KINESTHETIC & HANDS-ON CLI TAB */}
        {activeStyleTab === 'kinesthetic' && topicContent.kinesthetic && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm flex items-center space-x-3">
              <Terminal className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Kinesthetic Muscle Memory:</strong> Learn by touching the keyboard with simulated Azure CLI commands and portal click-paths.
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">
                {topicContent.kinesthetic.labTitle}
              </h4>
              <p className="text-xs text-slate-400">
                {topicContent.kinesthetic.actionPrompt}
              </p>

              {topicContent.kinesthetic.cliCommand && (
                <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 flex items-center justify-between">
                  <code>{topicContent.kinesthetic.cliCommand}</code>
                  <button
                    onClick={() => handleCopy(topicContent.kinesthetic.cliCommand)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                    title="Copy command"
                  >
                    {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Step by step action guide */}
              <div className="space-y-2 pt-2">
                {topicContent.kinesthetic.stepGuide?.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. READING & HIGH-YIELD CHEAT SHEET TAB */}
        {activeStyleTab === 'reading' && topicContent.reading && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-200 text-xs sm:text-sm flex items-center space-x-3">
              <FileText className="w-5 h-5 text-pink-400 flex-shrink-0" />
              <span>
                <strong>High-Yield Synthesis:</strong> Rapid bullet summaries and memory mnemonics for test day recall.
              </span>
            </div>

            {/* Mnemonic Badge */}
            {topicContent.reading.mnemonics && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Mnemonic:</span>
                <span className="font-mono text-xs font-bold text-white bg-pink-500/20 px-2.5 py-1 rounded border border-pink-500/30">
                  {topicContent.reading.mnemonics}
                </span>
              </div>
            )}

            {/* Bullet Points */}
            <div className="space-y-2.5">
              {topicContent.reading.cheatSheet?.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
