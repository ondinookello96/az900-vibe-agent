// Browser Web Notifications, Offline Service Worker & Audio Cue Service
import { StorageService } from './storageService';

let swRegistration = null;

export const NotificationService = {
  // Initialize Service Worker for Offline PWA & Offline Notifications
  async initServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        swRegistration = reg;
        console.log('AfriCloud Service Worker registered for offline capability:', reg.scope);
        return reg;
      } catch (err) {
        console.warn('Service Worker registration skipped:', err);
      }
    }
    return null;
  },

  // Check if Web Notifications are supported
  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  // Check online status
  isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  // Request browser permission
  async requestPermission() {
    if (!this.isSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  },

  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  // Play a pleasant synthesizer sound using Web Audio API (Offline capable)
  playChime(type = 'success') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'alert') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn('Audio chime skipped:', e);
    }
  },

  // Send immediate notification (supports Offline Service Worker + direct fallback)
  notify({ title, message, type = 'info', playSound = true }) {
    if (playSound) {
      this.playChime(type === 'success' ? 'success' : 'alert');
    }

    // Save to in-app drawer
    const updated = StorageService.addNotification({
      title,
      message,
      type
    });

    // If permission is granted, dispatch native OS notification
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        if (swRegistration && swRegistration.showNotification) {
          // Use Service Worker (handles background & offline)
          swRegistration.showNotification(title, {
            body: message,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: 'study-reminder'
          });
        } else {
          // Fallback direct window Notification
          new Notification(title, {
            body: message,
            icon: '/favicon.svg'
          });
        }
      } catch (err) {
        console.warn('Browser notification display warning:', err);
      }
    }

    return updated;
  },

  // Schedule an OFFLINE notification that triggers even when internet is disconnected!
  scheduleOfflineNotification({ title, message, delaySeconds = 5 }) {
    // 1. Post to Service Worker message channel
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_OFFLINE_NOTIFICATION',
        title,
        options: {
          body: message,
          icon: '/favicon.svg'
        },
        delayMs: delaySeconds * 1000
      });
    }

    // 2. Also keep a local client fallback timer in case SW is transitioning
    setTimeout(() => {
      this.notify({
        title,
        message,
        type: 'warning',
        playSound: true
      });
    }, delaySeconds * 1000);

    return true;
  },

  // Trigger automated diagnostic revision check
  checkRevisionNeeds() {
    const readiness = StorageService.calculateReadiness();
    if (readiness.weakAreas.length > 0) {
      const topWeak = readiness.weakAreas[0];
      return {
        needsRevision: true,
        weakTopic: topWeak,
        suggestion: `Your score on "${topWeak.name}" is currently ${topWeak.score}%. Time for a 10-minute focus session!`
      };
    }
    return {
      needsRevision: false,
      suggestion: 'All topics are performing above 70%! Consider taking a full timed mock exam.'
    };
  }
};
