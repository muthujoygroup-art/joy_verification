import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Zap, 
  HelpCircle, 
  Compass,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuidedTourSpotlight = ({ 
  tourId, 
  roleTitle, 
  steps = [], 
  isOpen, 
  onClose 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const currentStep = steps[currentStepIndex];

  // Update target element spotlight position
  useEffect(() => {
    if (!isOpen || !currentStep) {
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(`[data-tour-step="${currentStep.target}"]`);
      if (el) {
        // Smooth scroll element into view if not in viewport
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });
      } else {
        setTargetRect(null);
      }
    };

    // Small delay to allow any dynamic tab renders to settle
    const timer = setTimeout(updatePosition, 300);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, currentStepIndex, currentStep]);

  if (!isOpen || !currentStep) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Tour completed!
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`joy_tour_completed_${tourId}`, 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none animate-fadeIn">
      
      {/* Target Element Pulsing Beacon Halo (if element found on screen) */}
      {targetRect && (
        <div 
          style={{
            position: 'absolute',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: '16px',
            border: '2px solid #6366f1',
            boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.25), 0 0 25px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s ease-in-out',
            pointerEvents: 'none'
          }}
          className="animate-pulse"
        >
          {/* Animated Directional Pointer Tag */}
          <div className="absolute -top-7 left-2 bg-indigo-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider">
            <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            <span>Step {currentStepIndex + 1} Target</span>
          </div>
        </div>
      )}

      {/* Floating Guided Tour Card (Bottom Right / Mobile Centered) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-white/95 backdrop-blur-xl border-2 border-indigo-500/40 rounded-3xl shadow-2xl p-5 pointer-events-auto text-slate-900 z-50 space-y-4 animate-slideUp">
        
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Compass className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                Interactive Onboarding
              </span>
              <h4 className="font-extrabold text-slate-900 text-xs mt-0.5">
                {roleTitle} Guide
              </h4>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Skip / Dismiss Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600">
            <span>👉</span>
            <h5>{currentStep.title}</h5>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Progress Dots & Navigation Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          
          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex 
                    ? 'bg-indigo-600 w-5' 
                    : idx < currentStepIndex 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-200'
                }`}
                title={`Jump to Step ${idx + 1}`}
              />
            ))}
            <span className="text-[10px] font-bold text-slate-400 ml-1">
              {currentStepIndex + 1}/{steps.length}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="btn btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="btn btn-superadmin text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish 🎉' : 'Next Step 👉'}</span>
              {currentStepIndex < steps.length - 1 && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
