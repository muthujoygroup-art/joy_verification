import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Layers,
  Award,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GameActionGuideHub = ({ 
  roleKey, 
  roleTitle, 
  badgeColor = 'indigo', 
  steps = [], 
  currentStepIndex, 
  onStepChange, 
  onActionClick 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !steps || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex] || steps[0];
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      onStepChange(currentStepIndex + 1);
    } else {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onStepChange(currentStepIndex - 1);
    }
  };

  // If user minimized the guide, show a floating game-style badge
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40 animate-slideUp">
        <button
          onClick={() => setIsMinimized(false)}
          className="glass-panel px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-indigo-400/40 cursor-pointer transition-all hover:scale-105"
          title="Click to expand Interactive Onboarding Quest Guide"
        >
          <div className="p-1 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-indigo-300 font-mono font-bold leading-none">
              🎮 Guide ({currentStepIndex + 1}/{steps.length})
            </div>
            <div className="text-xs font-extrabold text-white mt-0.5 max-w-[160px] truncate">
              {currentStep.title}
            </div>
          </div>
          <ChevronUp className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-slate-950 to-purple-950 text-white rounded-3xl border-2 border-indigo-500/40 shadow-xl relative overflow-hidden animate-fadeIn space-y-4">
      
      {/* Decorative Top Accent Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner shrink-0">
            <Compass className="w-5 h-5 text-indigo-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                🎮 Interactive Quest Guide
              </span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {roleTitle} Onboarding Flow
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
              Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}
            </h3>
          </div>
        </div>

        {/* Progress & Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="text-right mr-2 hidden md:block">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Quest Progress</span>
            <span className="text-xs font-black text-emerald-400 font-mono">{progressPercent}% Completed</span>
          </div>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Minimize Guide to floating badge"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Dismiss Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Pills & Progress Track */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((s, idx) => {
          const isActive = idx === currentStepIndex;
          const isDone = idx < currentStepIndex;
          return (
            <button
              key={idx}
              onClick={() => onStepChange(idx)}
              className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-2 ${
                isActive 
                  ? 'bg-indigo-600/50 border-indigo-400 shadow-md scale-[1.02]' 
                  : isDone 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                isActive 
                  ? 'bg-indigo-500 text-white shadow-xs' 
                  : isDone 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/10 text-slate-400'
              }`}>
                {isDone ? '✓' : idx + 1}
              </div>
              <div className="truncate">
                <span className="text-[11px] font-extrabold block truncate leading-tight">
                  {s.shortTitle || s.title}
                </span>
                <span className="text-[9px] text-slate-400 font-medium block">
                  {isDone ? 'Completed' : isActive ? 'Current Action' : 'Upcoming'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Directive & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-xs">💡 Action Instruction:</span>
            <span className="text-xs text-slate-200 font-medium leading-relaxed">
              {currentStep.description}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {currentStepIndex > 0 && (
            <button
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {currentStep.actionLabel && onActionClick && (
            <button
              onClick={() => onActionClick(currentStep)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black flex items-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-103"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
              <span>{currentStep.actionLabel}</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Finish Quest 🎉' : 'Next Step 👉'}</span>
            {currentStepIndex < steps.length - 1 && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

    </div>
  );
};
