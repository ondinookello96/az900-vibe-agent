import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { NotificationService } from '../services/notificationService';

export const ApiKeyModal = ({ isOpen, onClose, currentKey, onSaveKey }) => {
  const [apiKey, setApiKey] = useState(currentKey || '');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(apiKey.trim());
    NotificationService.notify({
      title: '🔑 API Key Saved',
      message: apiKey.trim() 
        ? 'Live Gemini API connection configured!' 
        : 'Reverted to built-in local knowledge engine.',
      type: 'success'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Key className="w-4 h-4" />
            <span>AI Mentor Configuration</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Gemini API Key (Optional)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            By default, the app includes a rich pre-computed knowledge base with localized African analogies that works completely offline. You can also provide a Gemini API key for live real-time conversations!
          </p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            Google AI Studio API Key:
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] text-blue-400 hover:underline pt-0.5"
          >
            <span>Get a free Gemini API key from Google AI Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Save & Clear */}
        <div className="flex items-center space-x-3 pt-2">
          {currentKey && (
            <button
              onClick={() => {
                setApiKey('');
                onSaveKey('');
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition"
            >
              Clear Key
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition"
          >
            Save & Activate
          </button>
        </div>

      </div>
    </div>
  );
};
