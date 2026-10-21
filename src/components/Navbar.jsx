import React, { useState } from 'react';
import { 
  Cloud, 
  Flame, 
  Calendar, 
  Bell, 
  Key, 
  Compass, 
  HelpCircle, 
  Sparkles,
  BookOpen,
  Terminal,
  Eye,
  Headphones
} from 'lucide-react';
import { LEARNING_STYLES } from '../data/learningStyles';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  profile, 
  readiness, 
  unreadCount, 
  onOpenNotifications, 
  onOpenApiKeyModal,
  onOpenStyleModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentStyle = LEARNING_STYLES[profile.learningStyle] || LEARNING_STYLES.auditory;

  // Calculate days until exam
  const examDate = new Date(profile.targetExamDate);
  const today = new Date();
  const diffTime = examDate - today;
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const navItems = [
    { id: 'dashboard', label: 'Agent Dashboard', icon: 'Compass' },
    { id: 'quiz', label: 'Smart Practice', icon: 'Sparkles' },
    { id: 'revision', label: 'Adaptive Revision', icon: 'BookOpen' },
    { id: 'flashcards', label: 'Flashcard Coach', icon: 'HelpCircle' },
    { id: 'planner', label: 'Study Planner', icon: 'Calendar' },
    { id: 'buddy', label: 'AI Study Buddy', icon: 'Headphones' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Movement Tag */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                  AfriCloud AZ-900
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  #1MillionDevs
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Adaptive Exam Prep Agent</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all duration-150 flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Indicators & Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Learning Style Pill */}
            <button
              onClick={onOpenStyleModal}
              title={`Active Learning Style: ${currentStyle.name}. Click to change.`}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 transition"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentStyle.color }}></span>
              <span className="hidden lg:inline text-slate-400">Style:</span>
              <span className="font-semibold">{currentStyle.name.split(' ')[0]}</span>
            </button>

            {/* Streak Counter */}
            <div 
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold"
              title={`${profile.streakDays} Day Study Streak`}
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
              <span>{profile.streakDays}d</span>
            </div>

            {/* Exam Countdown */}
            <div 
              onClick={() => setActiveTab('planner')}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold cursor-pointer hover:bg-indigo-500/20 transition"
              title="Target Exam Date"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{diffDays}d left</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Reminders & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {/* Gemini API Key config */}
            <button
              onClick={onOpenApiKeyModal}
              className={`p-2 rounded-lg transition ${
                profile.apiKey ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={profile.apiKey ? 'Gemini API Key Active' : 'Configure Gemini API Key'}
            >
              <Key className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-slate-800 bg-[#0f172a] space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Learning Style:</span>
            <button onClick={onOpenStyleModal} className="text-blue-400 underline font-semibold">
              {currentStyle.name}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
