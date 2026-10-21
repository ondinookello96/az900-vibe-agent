// Local Storage Persistence & Agent Tracking Engine
import { AZ900_DOMAINS } from '../data/curriculum';

const STORAGE_KEYS = {
  USER_PROFILE: 'africloud_user_profile',
  MASTERY_STATE: 'africloud_mastery_state',
  STUDY_PLANNER: 'africloud_study_planner',
  NOTIFICATIONS: 'africloud_notifications',
  QUIZ_HISTORY: 'africloud_quiz_history',
  FLASHCARD_STATE: 'africloud_flashcard_state'
};

const DEFAULT_PROFILE = {
  name: 'Cloud Dev',
  targetExamDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
  dailyHours: 1.5,
  learningStyle: 'auditory', // visual, auditory, kinesthetic, reading
  streakDays: 3,
  lastActive: new Date().toISOString(),
  apiKey: ''
};

export const StorageService = {
  getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getMasteryState() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MASTERY_STATE);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }

    // Default initial seed state with slight realistic diagnostic variation
    const initial = {};
    AZ900_DOMAINS.forEach(d => {
      d.subtopics.forEach(s => {
        initial[s.id] = {
          subtopicId: s.id,
          domainId: d.id,
          name: s.name,
          correct: 0,
          total: 0,
          score: 50 // baseline diagnostic score
        };
      });
    });
    // Set seed mastery for realistic initial feel
    if (initial['cloud-benefits']) initial['cloud-benefits'] = { ...initial['cloud-benefits'], correct: 3, total: 3, score: 100 };
    if (initial['service-models']) initial['service-models'] = { ...initial['service-models'], correct: 2, total: 3, score: 66 };
    if (initial['core-components']) initial['core-components'] = { ...initial['core-components'], correct: 1, total: 2, score: 50 };
    if (initial['storage-services']) initial['storage-services'] = { ...initial['storage-services'], correct: 2, total: 2, score: 100 };
    if (initial['networking-services']) initial['networking-services'] = { ...initial['networking-services'], correct: 0, total: 2, score: 0 }; // clear weak area
    if (initial['identity-access']) initial['identity-access'] = { ...initial['identity-access'], correct: 1, total: 3, score: 33 }; // clear weak area
    if (initial['cost-management']) initial['cost-management'] = { ...initial['cost-management'], correct: 2, total: 3, score: 66 };

    return initial;
  },

  saveMasteryState(state) {
    localStorage.setItem(STORAGE_KEYS.MASTERY_STATE, JSON.stringify(state));
  },

  setDomainBaseline(domainId, baseScore) {
    const state = this.getMasteryState();
    AZ900_DOMAINS.forEach(d => {
      if (d.id === domainId) {
        d.subtopics.forEach(sub => {
          state[sub.id] = {
            subtopicId: sub.id,
            domainId: d.id,
            name: sub.name,
            correct: Math.round((baseScore / 100) * 10),
            total: 10,
            score: baseScore,
            lastAnswered: new Date().toISOString()
          };
        });
      }
    });
    this.saveMasteryState(state);
    return state;
  },

  recordAnswer(subtopicId, isCorrect) {
    const state = this.getMasteryState();
    const curr = state[subtopicId] || {
      subtopicId,
      correct: 0,
      total: 0,
      score: 50
    };

    const newCorrect = curr.correct + (isCorrect ? 1 : 0);
    const newTotal = curr.total + 1;
    const newScore = Math.round((newCorrect / newTotal) * 100);

    state[subtopicId] = {
      ...curr,
      correct: newCorrect,
      total: newTotal,
      score: newScore,
      lastAnswered: new Date().toISOString()
    };

    this.saveMasteryState(state);
    return state;
  },

  calculateReadiness(masteryState = null) {
    const state = masteryState || this.getMasteryState();
    const domainScores = {};
    let weightedReadiness = 0;

    AZ900_DOMAINS.forEach(domain => {
      let totalScore = 0;
      let count = 0;

      domain.subtopics.forEach(sub => {
        const item = state[sub.id];
        if (item) {
          totalScore += item.score;
          count++;
        }
      });

      const avgScore = count > 0 ? Math.round(totalScore / count) : 50;
      domainScores[domain.id] = {
        name: domain.name,
        score: avgScore,
        weight: domain.weightValue,
        color: domain.color
      };

      weightedReadiness += (avgScore * (domain.weightValue / 100));
    });

    const overall = Math.round(weightedReadiness);

    // Identify weak areas (score < 70)
    const weakAreas = [];
    Object.values(state).forEach(item => {
      if (item.score < 70) {
        weakAreas.push({
          subtopicId: item.subtopicId,
          domainId: item.domainId,
          name: item.name,
          score: item.score,
          total: item.total
        });
      }
    });

    // Sort weak areas lowest score first
    weakAreas.sort((a, b) => a.score - b.score);

    return {
      overallReadiness: overall,
      domainScores,
      weakAreas,
      isExamReady: overall >= 80,
      readinessStatus: overall >= 80 ? 'Exam Ready! 🚀' : overall >= 65 ? 'Getting Close! ⚡' : 'Foundation Building 📚'
    };
  },

  getStudyPlanner() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_PLANNER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveStudyPlanner(plan) {
    localStorage.setItem(STORAGE_KEYS.STUDY_PLANNER, JSON.stringify(plan));
  },

  getNotifications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }

    // Default seeded notifications
    return [
      {
        id: 'notif-1',
        title: '🧠 Weak Area Alert: Azure Networking',
        message: 'Your mastery in Azure Networking is at 0%. Review VNet Peering and ExpressRoute today!',
        type: 'warning',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: 'notif-2',
        title: '📅 Exam Countdown: 14 Days Left',
        message: 'Stick to your 1.5h daily schedule. Today\'s focus: Describe Azure Architecture.',
        type: 'info',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false
      },
      {
        id: 'notif-3',
        title: '🔥 3-Day Study Streak Active!',
        message: 'Great momentum! Complete 5 quick questions today to keep your vibe alive.',
        type: 'success',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true
      }
    ];
  },

  saveNotifications(notifs) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  addNotification(notif) {
    const list = this.getNotifications();
    const updated = [
      {
        id: 'notif-' + Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notif
      },
      ...list
    ];
    this.saveNotifications(updated);
    return updated;
  },

  getFlashcardProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARD_STATE);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveFlashcardProgress(cardId, status) {
    const state = this.getFlashcardProgress();
    state[cardId] = {
      status, // 'mastered' or 'review'
      lastReviewed: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.FLASHCARD_STATE, JSON.stringify(state));
    return state;
  }
};
