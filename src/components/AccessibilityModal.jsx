import React from 'react';
import { 
  X, 
  Accessibility, 
  Eye, 
  Volume2, 
  Keyboard, 
  Sparkles, 
  Check, 
  Sliders,
  Type,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { TTSService } from '../services/ttsService';

export const AccessibilityModal = ({ 
  isOpen, 
  onClose, 
  a11ySettings, 
  onUpdateA11y 
}) => {
  if (!isOpen) return null;

  const handleToggle = (key) => {
    onUpdateA11y({
      ...a11ySettings,
      [key]: !a11ySettings[key]
    });
  };

  const handleFontSizeChange = (size) => {
    onUpdateA11y({
      ...a11ySettings,
      fontSize: size
    });
  };

  const handleTestTTS = () => {
    TTSService.speak("Accessibility mode active. Text-to-speech is ready to read questions and African analogies aloud.");
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close accessibility settings"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Accessibility className="w-4 h-4" />
            <span>Inclusive Learning & Universal Design</span>
          </div>
          <h3 id="a11y-title" className="text-xl sm:text-2xl font-black text-white">
            Accessibility & Accommodation Hub
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Empowering every learner—including neurodivergent, low-vision, dyslexic, and mobility-impaired developers across Africa.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-4">
          
          {/* 1. Visual & Contrast Accommodations */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xs uppercase tracking-wide">
              <Eye className="w-4 h-4" />
              <span>Visual & Low-Vision Accommodations</span>
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">High-Contrast AAA Mode</span>
                <span className="text-[11px] text-slate-400">Pure black background with 7:1 contrast ratios and reinforced borders.</span>
              </div>
              <button
                onClick={() => handleToggle('highContrast')}
                role="switch"
                aria-checked={a11ySettings.highContrast}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  a11ySettings.highContrast ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-white block mb-1.5">Reading Font Size:</span>
              <div className="grid grid-cols-3 gap-2">
                {['normal', 'large', 'xlarge'].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      a11ySettings.fontSize === size
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {size === 'normal' ? 'Normal (100%)' : size === 'large' ? 'Large (120%)' : 'Extra Large (140%)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexia-Friendly Letter Spacing */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">Dyslexia-Optimized Typography</span>
                <span className="text-[11px] text-slate-400">Increases word & letter spacing to enhance reading clarity and prevent overcrowding.</span>
              </div>
              <button
                onClick={() => handleToggle('dyslexicSpacing')}
                role="switch"
                aria-checked={a11ySettings.dyslexicSpacing}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  a11ySettings.dyslexicSpacing ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>
          </div>

          {/* 2. Auditory & Speech Accommodations */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
              <Volume2 className="w-4 h-4" />
              <span>Auditory & Speech Support (Screen Reader / Dyslexia)</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">Auto Read-Aloud (Text-to-Speech)</span>
                <span className="text-[11px] text-slate-400">Reads out questions, options, and African analogies using Web Speech synthesis.</span>
              </div>
              <button
                onClick={() => handleToggle('autoReadAloud')}
                role="switch"
                aria-checked={a11ySettings.autoReadAloud}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  a11ySettings.autoReadAloud ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleTestTTS}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Voice Synthesizer</span>
              </button>
              <span className="text-[11px] text-slate-500">Offline-ready native Web Speech</span>
            </div>
          </div>

          {/* 3. Neurodivergent & Vestibular Accommodations */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wide">
              <Sliders className="w-4 h-4" />
              <span>Neurodivergent & Sensory Accommodations (ADHD, Autism)</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">Reduced Motion Mode</span>
                <span className="text-[11px] text-slate-400">Suppresses celebration confetti, glowing pulses, and transitions for vestibular ease.</span>
              </div>
              <button
                onClick={() => handleToggle('reducedMotion')}
                role="switch"
                aria-checked={a11ySettings.reducedMotion}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  a11ySettings.reducedMotion ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
              </button>
            </div>
          </div>

          {/* 4. Keyboard Navigation Cheatsheet */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
              <Keyboard className="w-4 h-4" />
              <span>100% Keyboard-Navigable Controls (Mobility Impairments)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Select Option A–D:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-400 border border-slate-700">1, 2, 3, 4</kbd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Submit Answer:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-400 border border-slate-700">Enter</kbd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Next Question:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-400 border border-slate-700">N or Enter</kbd>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Flip Flashcard:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-emerald-400 border border-slate-700">Space</kbd>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Done Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Apply Accommodations
          </button>
        </div>

      </div>
    </div>
  );
};
