import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/uiSoundEffects';

/**
 * Master Innovative Platform Brand Preloader & Loading Animation
 * Features:
 * - 3D Golden Shield Emblem with luminous emerald tick & ambient backdrop glow
 * - Holographic laser flare sweep across shield
 * - Kinetic 3D typography reveal for "JOY TRUE PROFILE"
 * - Tagline tracking reveal: "INSTANT WORKFORCE VERIFICATION"
 * - ZERO green circular rings
 * - Smooth exit animation and skip triggers (Click / Space / Esc)
 */
export const GlobalPlatformPreloader = ({ 
  onFinish, 
  subtitleText = "INSTANT WORKFORCE VERIFICATION",
  isFullScreen = true,
  autoDismissMs = 1250 
}) => {
  const { platformLogoEmblem } = useApp() || {};
  const [stage, setStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Split "TRUE PROFILE" for individual 3D letter flip choreography
  const trueProfileLetters = [
    { char: 'T', delay: 0 },
    { char: 'R', delay: 30 },
    { char: 'U', delay: 60 },
    { char: 'E', delay: 90 },
    { char: ' ', delay: 120, isSpace: true },
    { char: 'P', delay: 150 },
    { char: 'R', delay: 180 },
    { char: 'O', delay: 210 },
    { char: 'F', delay: 240 },
    { char: 'I', delay: 270 },
    { char: 'L', delay: 300 },
    { char: 'E', delay: 330 }
  ];

  const taglineWords = (subtitleText || 'INSTANT WORKFORCE VERIFICATION').split(' ');

  useEffect(() => {
    // Clean up initial static preloader div from index.html if present
    const staticPreloader = document.getElementById('initial-preloader');
    if (staticPreloader) {
      staticPreloader.style.display = 'none';
    }

    const t0 = setTimeout(() => setStage(1), 60);    // Shield appearance & laser sweep
    const t1 = setTimeout(() => {
      setStage(2);                                  // 3D checkmark bloom
      try { soundEngine.playBeep && soundEngine.playBeep(); } catch (e) {}
    }, 380);
    const t2 = setTimeout(() => setStage(3), 600);   // Typography kinetic reveal
    const t3 = setTimeout(() => {
      setStage(4);                                  // Complete lock
      try { soundEngine.playSuccess && soundEngine.playSuccess(); } catch (e) {}
    }, 950);

    let t4;
    if (autoDismissMs > 0) {
      t4 = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          if (typeof onFinish === 'function') onFinish();
        }, 250);
      }, autoDismissMs);
    }

    const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(() => {
        if (typeof onFinish === 'function') onFinish();
      }, 150);
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
    }, 150);
  };

  return (
    <div 
      onClick={handleManualClick}
      className={`${
        isFullScreen ? 'fixed inset-0 z-[99999]' : 'relative w-full h-full min-h-[320px]'
      } flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-400 ease-out ${
        isExiting 
          ? 'opacity-0 scale-[1.03] pointer-events-none filter blur-sm' 
          : 'opacity-100 scale-100 bg-[#070B14]'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.14) 0%, rgba(245, 158, 11, 0.09) 35%, rgba(7, 11, 20, 0.98) 75%)
        `
      }}
    >
      {/* Background Micro Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Dynamic Centered Brand Field */}
      <div className="relative flex flex-col items-center justify-center max-w-xl w-full px-4 z-10">

        {/* Ambient Gold & Emerald Radial Backlight (NO circular rings) */}
        <div 
          className={`absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tr from-emerald-500/20 via-amber-400/25 to-emerald-400/10 filter blur-3xl transition-all duration-700 pointer-events-none ${
            stage >= 2 ? 'scale-110 opacity-100' : 'scale-75 opacity-40'
          }`} 
        />

        {/* =========================================================================
         * 1. 3D GOLDEN SHIELD LOGO EMBLEM
         * ========================================================================= */}
        <div className="relative flex items-center justify-center">
          
          {/* Golden Shield Container */}
          <div className="relative z-10 overflow-hidden p-2">
            <img 
              src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
              alt="JOY TRUE PROFILE" 
              className={`w-32 h-32 sm:w-40 sm:h-40 object-contain transition-all duration-600 ease-out ${
                stage >= 1 
                  ? 'opacity-100 transform scale-100 drop-shadow-[0_12px_36px_rgba(16,185,129,0.4)]' 
                  : 'opacity-0 transform scale-75 filter blur-[4px]'
              }`}
              style={{
                transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease-out'
              }}
            />

            {/* Holographic Cyan-Emerald Laser Sweep */}
            <div 
              className={`absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(52,211,153,1)] pointer-events-none transition-all duration-700 ${
                stage >= 1 && stage < 3 ? 'translate-y-32 opacity-100' : 'translate-y-0 opacity-0'
              }`}
              style={{
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* =========================================================================
         * 2. 3D KINETIC TYPOGRAPHY ASSEMBLY: JOY TRUE PROFILE
         * ========================================================================= */}
        <div className="mt-4 sm:mt-5 text-center flex flex-col items-center">
          
          {/* Main Title Row: "JOY" (Kinetic Drop) + "TRUE PROFILE" (3D Stagger Flip) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
            
            {/* "JOY": Pristine White Metallic Kinetic Drop */}
            <span 
              className={`text-2xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-white transition-all duration-400 ${
                stage >= 3 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform -translate-y-3 scale-110 filter blur-[2px]'
              }`}
              style={{
                textShadow: '0 2px 18px rgba(255, 255, 255, 0.3)',
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease'
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
                  className={`inline-block text-2xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 transform-gpu transition-all duration-350 ${
                    item.isSpace ? 'w-2 sm:w-3' : ''
                  }`}
                  style={{
                    transformOrigin: '50% 100%',
                    transform: stage >= 3 
                      ? 'translateY(0px) rotateX(0deg) scale(1)' 
                      : 'translateY(12px) rotateX(-90deg) scale(0.85)',
                    opacity: stage >= 3 ? 1 : 0,
                    filter: stage >= 3 ? 'drop-shadow(0 2px 14px rgba(245, 158, 11, 0.45))' : 'blur(3px)',
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
          <div className="relative mt-2 sm:mt-2.5 overflow-hidden py-1">
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-sans font-extrabold uppercase tracking-[0.25em]">
              {taglineWords.map((word, wIdx) => (
                <React.Fragment key={wIdx}>
                  <span
                    className={`transition-all duration-500 text-amber-400 ${
                      stage >= 3 
                        ? 'opacity-100 transform translate-y-0 filter-none' 
                        : 'opacity-0 transform translate-y-2 filter blur-[2px]'
                    }`}
                    style={{
                      transitionDelay: `${wIdx * 80}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                    }}
                  >
                    {word}
                  </span>
                  {wIdx < taglineWords.length - 1 && (
                    <span 
                      className={`text-emerald-400 text-[10px] transition-opacity duration-400 ${
                        stage >= 3 ? 'opacity-100' : 'opacity-0'
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
              className={`absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-emerald-300 to-transparent pointer-events-none transition-transform duration-800 ${
                stage >= 3 ? 'translate-x-[400%]' : '-translate-x-[200%]'
              }`}
              style={{
                transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default GlobalPlatformPreloader;
