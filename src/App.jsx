import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LearningJourneyTracker } from './components/LearningJourneyTracker';
import { PracticeQuiz } from './components/PracticeQuiz';
import { RevisionSuggestions } from './components/RevisionSuggestions';
import { FlashcardDeck } from './components/FlashcardDeck';
import { RemindersAndPlanner } from './components/RemindersAndPlanner';
import { AIStudyBuddy } from './components/AIStudyBuddy';
import { LearningStyleSelector } from './components/LearningStyleSelector';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { StorageService } from './services/storageService';
import { NotificationService } from './services/notificationService';
import { ShieldAlert, Accessibility, Heart, ExternalLink } from 'lucide-react';

const DEFAULT_A11Y = {
  highContrast: false,
  fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
  dyslexicSpacing: false,
  autoReadAloud: false,
  reducedMotion: false
};

export function App() {
  const [profile, setProfile] = useState(() => StorageService.getProfile());
  const [masteryState, setMasteryState] = useState(() => StorageService.getMasteryState());
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [targetSubtopicId, setTargetSubtopicId] = useState(null);
  const [quizMode, setQuizMode] = useState('adaptive');

  // Accessibility state
  const [a11ySettings, setA11ySettings] = useState(() => {
    try {
      const saved = localStorage.getItem('africloud_a11y_settings');
      return saved ? { ...DEFAULT_A11Y, ...JSON.parse(saved) } : DEFAULT_A11Y;
    } catch {
      return DEFAULT_A11Y;
    }
  });

  // Modals state
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isA11yModalOpen, setIsA11yModalOpen] = useState(false);

  // Dynamic readiness score
  const readiness = StorageService.calculateReadiness(masteryState);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleUpdateProfile = (newProfile) => {
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
  };

  const handleUpdateA11y = (newSettings) => {
    setA11ySettings(newSettings);
    localStorage.setItem('africloud_a11y_settings', JSON.stringify(newSettings));
  };

  const handleRecordAnswer = (subtopicId, isCorrect) => {
    const updated = StorageService.recordAnswer(subtopicId, isCorrect);
    setMasteryState({ ...updated });
  };

  const handleSelectWeakTopic = (subtopicId) => {
    setTargetSubtopicId(subtopicId);
    setActiveTab('revision');
  };

  const handleStartQuiz = (mode = 'adaptive') => {
    setQuizMode(mode);
    setActiveTab('quiz');
  };

  const handlePracticeSpecificTopic = (subtopicId) => {
    setTargetSubtopicId(subtopicId);
    setQuizMode('adaptive');
    setActiveTab('quiz');
  };

  const handleCalibrateDomain = (domainId, baseScore) => {
    const updated = StorageService.setDomainBaseline(domainId, baseScore);
    setMasteryState({ ...updated });
  };

  const handleClearNotifications = () => {
    StorageService.saveNotifications([]);
    setNotifications([]);
  };

  const handleOpenNotificationItem = (notif) => {
    const updated = notifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
    setIsNotifDrawerOpen(false);
    if (notif.title.includes('Weak Area')) {
      setActiveTab('revision');
    } else if (notif.title.includes('Countdown') || notif.title.includes('Study')) {
      setActiveTab('planner');
    }
  };

  // Determine root CSS modifiers based on accessibility settings
  const getA11yClasses = () => {
    const classes = [];
    if (a11ySettings.highContrast) {
      classes.push('contrast-125 bg-black text-white');
    }
    if (a11ySettings.fontSize === 'large') {
      classes.push('text-[115%]');
    } else if (a11ySettings.fontSize === 'xlarge') {
      classes.push('text-[130%]');
    }
    if (a11ySettings.dyslexicSpacing) {
      classes.push('tracking-wide leading-loose');
    }
    return classes.join(' ');
  };

  return (
    <div className={`min-h-screen ${a11ySettings.highContrast ? 'bg-black text-white' : 'bg-[#0b0f19] text-slate-100'} flex flex-col font-sans selection:bg-blue-600 selection:text-white ${getA11yClasses()}`}>
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        readiness={readiness}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenStyleModal={() => setIsStyleModalOpen(true)}
        onOpenA11yModal={() => setIsA11yModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" id="main-content">
        {activeTab === 'dashboard' && (
          <LearningJourneyTracker
            readiness={readiness}
            profile={profile}
            masteryState={masteryState}
            onStartQuiz={handleStartQuiz}
            onSelectWeakTopic={handleSelectWeakTopic}
            onCalibrateDomain={handleCalibrateDomain}
          />
        )}

        {activeTab === 'quiz' && (
          <PracticeQuiz
            profile={profile}
            readiness={readiness}
            onRecordAnswer={handleRecordAnswer}
            initialMode={quizMode}
            a11ySettings={a11ySettings}
          />
        )}

        {activeTab === 'revision' && (
          <RevisionSuggestions
            profile={profile}
            readiness={readiness}
            initialTopicId={targetSubtopicId}
            onPracticeTopic={handlePracticeSpecificTopic}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardDeck
            profile={profile}
            onRecordMastery={handleRecordAnswer}
          />
        )}

        {activeTab === 'planner' && (
          <RemindersAndPlanner
            profile={profile}
            readiness={readiness}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'buddy' && (
          <AIStudyBuddy
            profile={profile}
          />
        )}
      </main>

      {/* Mandatory Unofficial Community Learning Tool Disclaimer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <span>Built with vibe coding, universal accessibility, and AI for the</span>
            <strong className="text-blue-400">#1MillionDevs Movement</strong>
            <span>across Africa.</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>
              <strong>Unofficial Community Study Tool:</strong> This platform is not affiliated with, endorsed by, or sponsored by Microsoft Corporation. All content is strictly pedagogical and grounded on public Microsoft Learn outlines.
            </span>
          </div>

          <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-500 pt-1">
            <button 
              onClick={() => setIsA11yModalOpen(true)}
              className="text-sky-400 hover:underline flex items-center space-x-1"
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>Accessibility & Inclusion Center</span>
            </button>
            <span>•</span>
            <span>WCAG 2.1 AAA Target</span>
            <span>•</span>
            <span>AZ-900 Vibe Coding Hackathon 2026</span>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <AccessibilityModal
        isOpen={isA11yModalOpen}
        onClose={() => setIsA11yModalOpen(false)}
        a11ySettings={a11ySettings}
        onUpdateA11y={handleUpdateA11y}
      />

      <LearningStyleSelector
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        currentStyleId={profile.learningStyle}
        onSelectStyle={(newStyle) => handleUpdateProfile({ ...profile, learningStyle: newStyle })}
      />

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onClearAll={handleClearNotifications}
        onSelectNotification={handleOpenNotificationItem}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={profile.apiKey}
        onSaveKey={(newKey) => handleUpdateProfile({ ...profile, apiKey: newKey })}
      />

    </div>
  );
}

export default App;
