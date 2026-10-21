// Browser Web Notifications and Audio Cue Service
import { StorageService } from './storageService';

export const NotificationService = {
  // Check if Web Notifications are supported
  isSupported() {
    return 'Notification' in window;
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

  // Play a pleasant synthesizer sound using Web Audio API (Zero external assets needed!)
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
        // High upbeat chime (C5 -> E5 -> G5)
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'alert') {
        // Double ping alert
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // Neutral beep
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

  // Send a notification (both Browser Notification if allowed and in-app drawer)
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

    // Fire native browser notification if granted
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/vite.svg',
          badge: '/vite.svg'
        });
      } catch (err) {
        console.warn('Browser notification failed to display:', err);
      }
    }

    return updated;
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
