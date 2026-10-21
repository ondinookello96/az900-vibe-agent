import React, { useState } from 'react';
import { 
  HelpCircle, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Lightbulb, 
  Sparkles,
  Zap
} from 'lucide-react';
import { FLASHCARDS } from '../data/flashcards';
import { NotificationService } from '../services/notificationService';

export const FlashcardDeck = ({ profile }) => {
  const [cards, setCards] = useState(FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progressState, setProgressState] = useState({});
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'review' | 'mastered'

  const currentCard = cards[currentIndex] || cards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(cards.length - 1);
    }
  };

  const markCardStatus = (status) => {
    setProgressState(prev => ({
      ...prev,
      [currentCard.id]: status
    }));

    if (status === 'mastered') {
      NotificationService.playChime('success');
    } else {
      NotificationService.playChime('neutral');
    }

    // Auto advance
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const masteredCount = Object.values(progressState).filter(s => s === 'mastered').length;
  const reviewCount = Object.values(progressState).filter(s => s === 'review').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Spaced-Repetition Memory Coach</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            High-Yield Concept Flashcards
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Master tricky Azure terminology, African analogies, and avoid common exam traps.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            {masteredCount} Mastered
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
            {reviewCount} Review
          </div>
        </div>
      </div>

      {/* Progress Bar & Index */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Card {currentIndex + 1} of {cards.length}</span>
        <span>Click card or flip button to reveal explanation</span>
      </div>

      {/* 3D Flip Flashcard */}
      <div 
        onClick={handleFlip}
        className="w-full min-h-[380px] sm:min-h-[420px] rounded-3xl bg-slate-900/95 border border-slate-800 hover:border-slate-700 transition-all duration-300 p-8 sm:p-10 flex flex-col justify-between shadow-2xl cursor-pointer relative overflow-hidden group select-none"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Card Bar */}
        <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-4">
          <span className="font-mono font-bold uppercase tracking-wider text-purple-400">
            {currentCard.domainId.replace('-', ' ')}
          </span>
          <span className="text-slate-400 flex items-center space-x-1 group-hover:text-slate-200 transition">
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Flip to Term' : 'Click to Reveal'}</span>
          </span>
        </div>

        {/* Center Content */}
        {!isFlipped ? (
          <div className="my-auto text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Target Concept
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentCard.term}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              How would you explain this service and its role on the AZ-900 exam?
            </p>
          </div>
        ) : (
          <div className="my-auto space-y-4 animate-fade-in text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Official Definition
              </span>
              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed mt-1">
                {currentCard.definition}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
              <strong className="block text-amber-400 mb-0.5">🌍 African Analogy:</strong>
              {currentCard.africanAnalogy}
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed">
              <strong className="block text-rose-400 mb-0.5">⚠️ Exam Trap:</strong>
              {currentCard.examTrap}
            </div>

            {currentCard.mnemonic && (
              <div className="text-xs text-slate-300">
                💡 <strong>Mnemonic:</strong> <span className="font-mono text-purple-300">{currentCard.mnemonic}</span>
              </div>
            )}
          </div>
        )}

        {/* Card Footer status indicator */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Status: <strong className="text-slate-300 capitalize">{progressState[currentCard.id] || 'Not Rated'}</strong>
          </span>
          <span className="text-purple-400 text-[11px] font-semibold">
            AZ-900 Core Service
          </span>
        </div>
      </div>

      {/* Rating & Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        
        {/* Navigation Previous/Next */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
          <button
            onClick={handlePrev}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Previous Card"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Next Card"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Leitner Spaced-Repetition Buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => markCardStatus('review')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Still Learning (Review)</span>
          </button>
          <button
            onClick={() => markCardStatus('mastered')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center space-x-1.5 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mastered! ✅</span>
          </button>
        </div>

      </div>

    </div>
  );
};
