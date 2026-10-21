// Text-to-Speech (TTS) Service using Web Speech API
// Zero external dependencies, offline-capable, accessible to visually impaired and dyslexic learners.

export const TTSService = {
  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  speak(text, { rate = 1.0, pitch = 1.0, onEnd = null } = {}) {
    if (!this.isSupported()) return;

    this.stop(); // cancel previous utterance

    // Clean markdown formatting before speaking
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/•/g, ', ')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Try to pick an English voice or native system voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
  },

  isSpeaking() {
    if (!this.isSupported()) return false;
    return window.speechSynthesis.speaking;
  }
};
