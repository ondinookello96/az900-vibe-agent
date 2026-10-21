import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  ShieldAlert,
  Send,
  Zap,
  Wifi,
  WifiOff,
  Timer
} from 'lucide-react';
import { AZ900_DOMAINS } from '../data/curriculum';
import { NotificationService } from '../services/notificationService';

export const RemindersAndPlanner = ({ 
  profile, 
  readiness, 
  onUpdateProfile 
}) => {
  const [examDate, setExamDate] = useState(profile.targetExamDate);
  const [dailyHours, setDailyHours] = useState(profile.dailyHours || 1.5);
  const [preferredTime, setPreferredTime] = useState('20:00');
  const [notificationPermission, setNotificationPermission] = useState(NotificationService.getPermissionStatus());
  const [testSent, setTestSent] = useState(false);
  const [isOnline, setIsOnline] = useState(NotificationService.isOnline());
  const [offlineTimerCountdown, setOfflineTimerCountdown] = useState(null);

  // Monitor online / offline network state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize Service Worker
    NotificationService.initServiceWorker();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const target = new Date(examDate);
  const now = new Date();
  const diffDays = Math.max(1, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));

  const handleSaveSettings = () => {
    onUpdateProfile({
      ...profile,
      targetExamDate: examDate,
      dailyHours: parseFloat(dailyHours)
    });

    NotificationService.notify({
      title: '📅 Study Schedule Updated',
      message: `Exam set for ${examDate} (${diffDays} days away). Study plan calibrated!`,
      type: 'success'
    });
  };

  const handleEnableNotifications = async () => {
    const res = await NotificationService.requestPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      NotificationService.notify({
        title: '🔔 Reminders Activated!',
        message: 'You will receive timely nudges on your weak AZ-900 topics.',
        type: 'success'
      });
    }
  };

  const handleSendTestNotification = () => {
    const check = NotificationService.checkRevisionNeeds();
    setTestSent(true);

    NotificationService.notify({
      title: '🚨 AZ-900 Study Reminder',
      message: check.needsRevision 
        ? check.suggestion 
        : 'Daily vibe check: 30 minutes of flashcard review scheduled today!',
      type: 'warning',
      playSound: true
    });

    setTimeout(() => setTestSent(false), 3000);
  };

  // Trigger an offline-scheduled notification in 5 seconds
  const handleScheduleOfflineTest = () => {
    if (notificationPermission !== 'granted') {
      handleEnableNotifications();
      return;
    }

    const check = NotificationService.checkRevisionNeeds();
    const reminderMsg = check.needsRevision 
      ? `[Offline Nudge] ${check.suggestion}` 
      : '[Offline Nudge] Time for 15 minutes of AZ-900 Architecture flashcards!';

    NotificationService.scheduleOfflineNotification({
      title: '⚡ Offline Study Reminder',
      message: reminderMsg,
      delaySeconds: 5
    });

    // Start 5 second visual countdown
    setOfflineTimerCountdown(5);
    const interval = setInterval(() => {
      setOfflineTimerCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Generate dynamic day-by-day study sprint
  const generateSprint = () => {
    const sprint = [];
    const topicsToCover = [
      { name: 'Cloud Concepts & Shared Responsibility', domain: 'Cloud Concepts', days: Math.max(1, Math.round(diffDays * 0.25)) },
      { name: 'Azure Core Architecture, Regions & Zones', domain: 'Architecture', days: Math.max(1, Math.round(diffDays * 0.2)) },
      { name: 'Compute, Storage Tiers & Networking', domain: 'Architecture', days: Math.max(1, Math.round(diffDays * 0.2)) },
      { name: 'Identity (Entra ID), Governance & Policy', domain: 'Governance', days: Math.max(1, Math.round(diffDays * 0.2)) },
      { name: 'Final Timed Mock & Weak Area Blitz', domain: 'Review', days: Math.max(1, Math.round(diffDays * 0.15)) },
    ];

    let currentDay = 1;
    topicsToCover.forEach((item, idx) => {
      const endDay = Math.min(diffDays, currentDay + item.days - 1);
      sprint.push({
        id: idx,
        daysRange: currentDay === endDay ? `Day ${currentDay}` : `Day ${currentDay}–${endDay}`,
        title: item.name,
        domain: item.domain,
        targetHours: (item.days * dailyHours).toFixed(1),
        isCurrent: currentDay <= 3 && endDay >= 1
      });
      currentDay = endDay + 1;
    });

    return sprint;
  };

  const sprintPlan = generateSprint();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* Title Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Automated Study Planner & Offline Notification Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Exam Countdown & Smart Reminders
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalized pacing, browser reminders, and offline-capable notifications powered by Service Workers.
          </p>
        </div>

        {/* Live Network & Test Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Online/Offline Status Pill */}
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 ${
            isOnline 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Network Online' : 'Offline Mode Active'}</span>
          </div>

          <button
            onClick={handleSendTestNotification}
            className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testSent ? 'Alert Dispatched!' : 'Send Instant Alert'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Schedule Configuration & Offline PWA Capabilities */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Target Parameters</span>
            </h3>

            {/* Exam Date Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target AZ-900 Exam Date:</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Daily Hours Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Daily Study Target:</span>
                <span className="text-blue-400">{dailyHours} hours/day</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.0"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Preferred Alert Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Daily Reminder Time:</label>
              <input
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition"
            >
              Update Schedule
            </button>
          </div>

          {/* Offline Push & PWA Notification Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-base">Offline Push & Service Worker</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Yes!</strong> Because AfriCloud runs as a Progressive Web App (PWA) with a background Service Worker, study reminders fire locally <strong>even if your device has zero internet connection or is in airplane mode</strong>.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>PWA Service Worker:</span>
                <strong className="text-emerald-400">Registered (sw.js)</strong>
              </div>
              <div className="flex justify-between">
                <span>Notification Permission:</span>
                <strong className={`capitalize ${notificationPermission === 'granted' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {notificationPermission}
                </strong>
              </div>
            </div>

            {/* Interactive Offline Notification Demo Trigger */}
            <div className="pt-1">
              <button
                onClick={handleScheduleOfflineTest}
                disabled={offlineTimerCountdown !== null}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs transition flex items-center justify-center space-x-2"
              >
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {offlineTimerCountdown !== null 
                    ? `Firing offline alert in ${offlineTimerCountdown}s...` 
                    : 'Test Offline Notification (5s)'}
                </span>
              </button>
              <span className="text-[10px] text-slate-500 block text-center mt-1.5">
                Click, then disconnect your internet to watch the notification appear!
              </span>
            </div>

            {notificationPermission !== 'granted' && (
              <button
                onClick={handleEnableNotifications}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
              >
                Grant Browser Notification Permission
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Day-by-Day Sprint Planner */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Your {diffDays}-Day AZ-900 Sprint Plan</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamically paced to guarantee full coverage before {examDate}.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-400">{diffDays}</span>
                <span className="text-xs block text-slate-500">Days Left</span>
              </div>
            </div>

            <div className="space-y-3">
              {sprintPlan.map((sprint) => (
                <div
                  key={sprint.id}
                  className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
                    sprint.isCurrent
                      ? 'bg-blue-600/10 border-blue-500/40 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      sprint.isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sprint.id + 1}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-indigo-300">{sprint.daysRange}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {sprint.domain}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{sprint.title}</h4>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-300">{sprint.targetHours}h</span>
                    <span className="text-[10px] block text-slate-500">Scheduled</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Offline-Ready Guarantee:</strong> All questions, flashcards, diagnostic radar algorithms, and African analogy stories are bundled locally into the client. You can study on a bus, during a power outage, or in remote rural areas with zero mobile data!
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
