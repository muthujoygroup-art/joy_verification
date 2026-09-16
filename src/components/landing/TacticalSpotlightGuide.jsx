import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Crosshair, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  ChevronRight,
  Zap,
  HelpCircle,
  Compass
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const TacticalSpotlightGuide = ({
  isActive = false,
  missions = [],
  activeMissionIndex = 0,
  activeStepIndex = 0,
  onNextStep,
  onPrevStep,
  onComplete,
  onClose,
  targetElementSelector = null
}) => {
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      if (targetElementSelector) {
        const el = document.querySelector(targetElementSelector);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      setTargetRect(null);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, targetElementSelector, activeStepIndex]);

  if (!isActive) return null;

  const currentMission = missions[activeMissionIndex] || missions[0];
  const currentStep = currentMission?.steps?.[activeStepIndex] || {};

  return createPortal((
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto" onClick={onClose} />

      {targetRect && (
        <div 
          className="absolute transition-all duration-300 pointer-events-auto border-2 border-[#426CF5] rounded-2xl shadow-[0_0_30px_rgba(66,108,245,0.6)] animate-pulse"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16
          }}
        >
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-white" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-white" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-white" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-white" />
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 pointer-events-auto z-10">
        <div className="bg-gradient-to-br from-slate-900 via-[#182230] to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-[#426CF5] shadow-[0_10px_40px_rgba(0,0,0,0.8)] space-y-4">
          
          <div className="flex items-center justify-between border-b border-indigo-500/30 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">
                TACTICAL MISSION HUD • STEP {activeStepIndex + 1} OF {currentMission?.steps?.length || 1}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#426CF5]/30 border border-[#426CF5] flex items-center justify-center text-[#426CF5] shrink-0 font-bold text-lg animate-bounce">
              🎯
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white font-outfit">
                {currentStep.title || 'Tactical Objective'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentStep.instruction || 'Touch the highlighted element to continue the verification procedure.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-indigo-500/20">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>{currentMission?.title}</span>
            </div>

            <div className="flex items-center gap-2">
              {activeStepIndex > 0 && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    if (onPrevStep) onPrevStep();
                  }}
                  className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  ← Back
                </button>
              )}

              {activeStepIndex < (currentMission?.steps?.length || 1) - 1 ? (
                <button
                  onClick={() => {
                    soundEngine.playSuccess();
                    if (onNextStep) onNextStep();
                  }}
                  className="px-5 py-2 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <span>Touch to Proceed →</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundEngine.playSuccess();
                    if (onComplete) onComplete();
                  }}
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mission Accomplished!</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  ), document.body);
};

export default TacticalSpotlightGuide;
