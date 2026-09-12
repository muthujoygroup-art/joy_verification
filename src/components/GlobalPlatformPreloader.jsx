import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/uiSoundEffects';

/**
 * Master Innovative Platform Brand Preloader & Loading Animation
 * Features:
 * - 3D Golden Shield Emblem with luminous emerald checkmark & ambient backdrop glow
 * - Holographic laser flare sweep across shield
 * - Kinetic 3D typography reveal for "JOY TRUE PROFILE"
 * - Tagline tracking reveal: "INSTANT WORKFORCE VERIFICATION"
 * - ZERO green circular rings
 * - Smooth 2.2s cinematic choreography while background contents load
 * - Interactive skip controls (Click / Space / Esc)
 */
export const GlobalPlatformPreloader = ({ 
  onFinish, 
  subtitleText = "INSTANT WORKFORCE VERIFICATION",
  isFullScreen = true,
  autoDismissMs = 2200 
}) => {
  const { platformLogoEmblem } = useApp() || {};
  const [stage, setStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Split "TRUE PROFILE" for individual 3D letter flip choreography
  const trueProfileLetters = [
    { char: 'T', delay: 0 },
    { char: 'R', delay: 40 },
    { char: 'U', delay: 80 },
    { char: 'E', delay: 120 },
    { char: ' ', delay: 160, isSpace: true },
    { char: 'P', delay: 200 },
    { char: 'R', delay: 240 },
    { char: 'O', delay: 280 },
    { char: 'F', delay: 320 },
    { char: 'I', delay: 360 },
    { char: 'L', delay: 400 },
    { char: 'E', delay: 440 }
  ];

  const taglineWords = (subtitleText || 'INSTANT WORKFORCE VERIFICATION').split(' ');

  useEffect(() => {
    // Clean up initial static preloader div from index.html if present
    const staticPreloader = document.getElementById('initial-preloader');
    if (staticPreloader) {
      staticPreloader.style.display = 'none';
    }

    const t0 = setTimeout(() => setStage(1), 100);   // Shield appearance & laser sweep
    const t1 = setTimeout(() => {
      setStage(2);                                  // 3D checkmark bloom
      try { soundEngine.playBeep && soundEngine.playBeep(); } catch (e) {}
    }, 500);
    const t2 = setTimeout(() => setStage(3), 900);   // Kinetic typography reveal
    const t3 = setTimeout(() => {
      setStage(4);                                  // Tagline & full statutory verification lock
      try { soundEngine.playSuccess && soundEngine.playSuccess(); } catch (e) {}
    }, 1500);

    let t4;
    if (autoDismissMs > 0) {
      t4 = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (typeof onFinish === 'function') onFinish();
        }, 300);
      }, autoDismissMs);
    }

    const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(() => {
        if (typeof onFinish === 'function') onFinish();
      }, 200);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (t4) clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFinish, autoDismissMs]);

  const handleManualClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (typeof onFinish === 'function') onFinish();
    }, 200);
  };

  return (
    <div 
      onClick={handleManualClick}
      className={`${
        isFullScreen ? 'fixed inset-0 z-[99999]' : 'relative w-full h-full min-h-[360px]'
      } flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
        isExiting 
          ? 'opacity-0 scale-[1.04] pointer-events-none filter blur-md' 
          : 'opacity-100 scale-100 bg-[#070B14]'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.10) 35%, rgba(7, 11, 20, 0.98) 75%)
        `
      }}
    >
      {/* Background Micro Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Dynamic Centered Brand Field */}
      <div className="relative flex flex-col items-center justify-center max-w-xl w-full px-4 z-10">

        {/* Ambient Gold & Emerald Radial Backlight (NO circular rings) */}
        <div 
          className={`absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-500/20 via-amber-400/25 to-emerald-400/10 filter blur-3xl transition-all duration-1000 pointer-events-none ${
            stage >= 2 ? 'scale-110 opacity-100' : 'scale-75 opacity-40'
          }`} 
        />

        {/* =========================================================================
         * 1. 3D GOLDEN SHIELD LOGO EMBLEM (Seamless, No Box Clipping)
         * ========================================================================= */}
        <div className="relative flex items-center justify-center pointer-events-none">
          <img 
            src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
            alt="JOY TRUE PROFILE" 
            className={`w-36 h-36 sm:w-44 sm:h-44 object-contain transition-all duration-700 ease-out ${
              stage >= 1 
                ? 'opacity-100 transform scale-100 drop-shadow-[0_0_35px_rgba(16,185,129,0.5)]' 
                : 'opacity-0 transform scale-75 filter blur-[4px]'
            }`}
            style={{
              transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out'
            }}
          />
        </div>

        {/* =========================================================================
         * 2. 3D KINETIC TYPOGRAPHY ASSEMBLY: JOY TRUE PROFILE
         * ========================================================================= */}
        <div className="mt-5 sm:mt-6 text-center flex flex-col items-center">
          
          {/* Main Title Row: "JOY" (Kinetic Drop) + "TRUE PROFILE" (3D Stagger Flip) */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            
            {/* "JOY": Pristine White Metallic Kinetic Drop */}
            <span 
              className={`text-3xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-white transition-all duration-500 ${
                stage >= 3 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform -translate-y-4 scale-110 filter blur-[2px]'
              }`}
              style={{
                textShadow: '0 2px 20px rgba(255, 255, 255, 0.35)',
                transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease'
              }}
            >
              JOY
            </span>

            {/* "TRUE PROFILE": 3D Kinetic Stagger Flip in Radiant Amber-Gold */}
            <div 
              className="inline-flex items-center"
              style={{ perspective: '800px' }}
            >
              {trueProfileLetters.map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-block text-3xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 transform-gpu transition-all duration-400 ${
                    item.isSpace ? 'w-2 sm:w-3' : ''
                  }`}
                  style={{
                    transformOrigin: '50% 100%',
                    transform: stage >= 3 
                      ? 'translateY(0px) rotateX(0deg) scale(1)' 
                      : 'translateY(14px) rotateX(-90deg) scale(0.85)',
                    opacity: stage >= 3 ? 1 : 0,
                    filter: stage >= 3 ? 'drop-shadow(0 2px 16px rgba(245, 158, 11, 0.5))' : 'blur(3px)',
                    transitionDelay: `${item.delay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  {item.char}
                </span>
              ))}
            </div>

          </div>

          {/* =========================================================================
           * 3. SUBTITLE: INSTANT WORKFORCE VERIFICATION
           * ========================================================================= */}
          <div className="relative mt-2.5 sm:mt-3 overflow-hidden py-1">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-[0.25em]">
              {taglineWords.map((word, wIdx) => (
                <React.Fragment key={wIdx}>
                  <span
                    className={`transition-all duration-600 text-amber-400 ${
                      stage >= 4 
                        ? 'opacity-100 transform translate-y-0 filter-none' 
                        : 'opacity-0 transform translate-y-2 filter blur-[2px]'
                    }`}
                    style={{
                      transitionDelay: `${wIdx * 100}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      textShadow: '0 0 12px rgba(245, 158, 11, 0.6)'
                    }}
                  >
                    {word}
                  </span>
                  {wIdx < taglineWords.length - 1 && (
                    <span 
                      className={`text-emerald-400 text-xs transition-opacity duration-500 ${
                        stage >= 4 ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      •
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Glowing Laser Light Flare */}
            <div 
              className={`absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-emerald-300 to-transparent pointer-events-none transition-transform duration-1000 ${
                stage >= 4 ? 'translate-x-[400%]' : '-translate-x-[200%]'
              }`}
              style={{
                transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default GlobalPlatformPreloader;
