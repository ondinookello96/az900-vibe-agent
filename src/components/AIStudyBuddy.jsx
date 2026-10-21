import React, { useState } from 'react';
import { 
  Headphones, 
  Send, 
  Sparkles, 
  Languages, 
  Bot, 
  User, 
  Lightbulb, 
  Zap,
  Globe
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { LEARNING_STYLES } from '../data/learningStyles';

export const AIStudyBuddy = ({ profile }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Jambo! 👋 I am **Rafiki**, your Azure Cloud Mentor for the #1MillionDevs movement.\n\nAsk me any AZ-900 cloud concept and I will break it down in simple terms with relatable real-life African analogies or local dialects. How can I guide you today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedDialect, setSelectedDialect] = useState('english'); // english, swahili, pidgin, french
  const [isLoading, setIsLoading] = useState(false);

  const currentStyle = LEARNING_STYLES[profile.learningStyle] || LEARNING_STYLES.auditory;

  const quickPrompts = [
    { label: 'Availability Zones & M-Pesa', topic: 'core-components', prompt: 'Explain Azure Availability Zones using an M-Pesa agent analogy.' },
    { label: 'IaaS vs PaaS vs SaaS', topic: 'service-models', prompt: 'Break down IaaS, PaaS, and SaaS with everyday African examples.' },
    { label: 'Blob Storage Tiers', topic: 'storage-services', prompt: 'Explain Azure Blob Hot, Cool, and Archive tiers using a village granary analogy.' },
    { label: 'ExpressRoute vs VPN', topic: 'networking-services', prompt: 'What is the real difference between Azure VPN Gateway and ExpressRoute?' },
    { label: 'Azure Policy vs RBAC', topic: 'governance-compliance', prompt: 'How does Azure Policy differ from Role-Based Access Control (RBAC)?' }
  ];

  const handleSendMessage = async (textToSend = null, topicOverride = 'general') => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    // Append user message
    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await GeminiService.askMentor({
        prompt: text,
        topic: topicOverride,
        learningStyle: profile.learningStyle || 'auditory',
        dialect: selectedDialect,
        apiKey: profile.apiKey
      });

      setMessages([...newMessages, { sender: 'bot', text: response }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: `Pole sana! I encountered a small network hitch, but here is the key takeaway: Always link the Azure service back to its official AZ-900 purpose and how it safeguards uptime or manages cost.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header & Dialect Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Rafiki: AI Study Buddy</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              African analogies, simple terms, and localized explanations for AZ-900.
            </p>
          </div>
        </div>

        {/* Dialect / Language Selector */}
        <div className="flex items-center space-x-2 bg-slate-950/70 border border-slate-800 p-1.5 rounded-xl">
          <Globe className="w-4 h-4 text-slate-400 ml-1.5" />
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Language:</span>
          <select
            value={selectedDialect}
            onChange={(e) => setSelectedDialect(e.target.value)}
            className="bg-slate-800 text-white border-0 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="english">English (Global)</option>
            <option value="swahili">Kiswahili / Sheng (East Africa)</option>
            <option value="pidgin">Nigerian Pidgin (West Africa)</option>
            <option value="french">Français (Francophone)</option>
          </select>
        </div>
      </div>

      {/* Quick Prompt Starters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
          Try Asking:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.prompt, qp.topic)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs whitespace-nowrap hover:text-white transition flex-shrink-0"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs ${
                  isBot 
                    ? 'bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-sm' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  isBot
                    ? 'bg-slate-950 border border-slate-800 text-slate-200'
                    : 'bg-blue-600 text-white shadow-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs p-2 animate-pulse">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Rafiki is crafting an explanation with African vibes...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask Rafiki anything (e.g. "Explain Azure Virtual Network Peering in ${selectedDialect}")...`}
            className="flex-1 bg-slate-900 text-white placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`p-2.5 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition flex items-center space-x-1.5 ${
              inputText.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
