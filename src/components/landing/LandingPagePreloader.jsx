import React, { useState, useEffect } from 'react';

/**
 * Clean & Prestigious Brand Preloader for JOY TRUE PROFILE
 * Exclusively displays:
 * 1. Official Winged Shield Logo with luminous ambient pulse & specular sheen
 * 2. Brand Name: JOY TRUE PROFILE (High contrast)
 * 3. Tagline: INSTANT WORKFORCE VERIFICATION
 */
export default function LandingPagePreloader({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Elegant duration: 1.8s then smooth fade transition
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 550);
    }, 1800);

    // Allow user to click or press any key to enter immediately
    const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 350);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFinish]);

  return (
    <div 
      onClick={() => {
        setIsExiting(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 350);
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-600 ease-out ${
        isExiting 
          ? 'opacity-0 scale-[1.04] pointer-events-none filter blur-sm' 
          : 'opacity-100 scale-100 bg-[#07090e]'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.08) 32%, rgba(7, 9, 14, 0.98) 70%)
        `
      }}
    >
      {/* Ambient Breathing Glow Aura Behind Logo */}
      <div className="relative flex flex-col items-center justify-center">

        {/* Multi-layered Soft Radiance Orbs */}
        <div className="absolute w-80 h-80 rounded-full bg-amber-500/18 filter blur-3xl animate-[pulse_2.2s_easeInOut_infinite] pointer-events-none" />
        <div className="absolute w-56 h-56 rounded-full bg-emerald-500/15 filter blur-2xl animate-[pulse_2.8s_easeInOut_infinite_reverse] pointer-events-none" />

        {/* Expanding Subtle Ripples */}
        <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-amber-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />
        <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-emerald-500/15 animate-[ping_3.6s_cubic-bezier(0,0,0.2,1)_infinite_0.8s] pointer-events-none" />

        {/* Center Logo Container with Sheen Effect */}
        <div className="relative flex items-center justify-center">
          {/* Official Project Logo */}
          <img 
            src="/joy_logo.png" 
            alt="JOY TRUE PROFILE" 
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(245,158,11,0.45)] animate-[float_3s_easeInOut_infinite]" 
          />

          {/* Liquid Specular Sheen Glint gliding across emblem */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-20">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[sheen_2.2s_infinite]" />
          </div>
        </div>

        {/* Project Name: High Contrast, Bold, Executive Typography */}
        <div className="mt-8 sm:mt-10 text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-outfit uppercase">
            JOY <span className="text-amber-400 drop-shadow-[0_0_24px_rgba(245,158,11,0.5)]">TRUE PROFILE</span>
          </h1>

          {/* Tagline */}
          <p className="mt-3 text-xs sm:text-sm uppercase tracking-[0.25em] text-amber-300/90 font-sans font-bold">
            INSTANT WORKFORCE VERIFICATION
          </p>

          {/* Minimalist Glowing Micro-Line */}
          <div className="mt-5 w-24 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-pulse" />
        </div>

      </div>

      {/* Embedded High-Performance CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.02);
          }
        }
        @keyframes sheen {
          0% {
            transform: translateX(-180%) skewX(-20deg);
          }
          50%, 100% {
            transform: translateX(180%) skewX(-20deg);
          }
        }
      `}</style>
    </div>
  );
}
