import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundEngine } from '../../utils/uiSoundEffects';

/**
 * World-Class Futuristic Biometric & Cybernetic Logo Preloader
 * Features:
 * - Transparent 3D Golden Shield with Luminous Emerald Checkmark
 * - Holographic laser sweep scanning from top to bottom
 * - Kinetic 3D letter flip typography for "JOY TRUE PROFILE"
 * - Ultra-smooth cinematic fade & skip controls (Click / Space / Esc)
 */
export default function LandingPagePreloader({ onFinish }) {
  const { platformLogo } = useApp() || {};
  // Animation stages: 0=Initialize, 1=Laser Scan, 2=Tick Bloom, 3=Typography Flip, 4=Lock Complete
  const [stage, setStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Split "TRUE PROFILE" for individual 3D letter flip choreography
  const trueProfileLetters = [
    { char: 'T', delay: 0 },
    { char: 'R', delay: 35 },
    { char: 'U', delay: 70 },
    { char: 'E', delay: 105 },
    { char: ' ', delay: 140, isSpace: true },
    { char: 'P', delay: 175 },
    { char: 'R', delay: 210 },
    { char: 'O', delay: 245 },
    { char: 'F', delay: 280 },
    { char: 'I', delay: 315 },
    { char: 'L', delay: 350 },
    { char: 'E', delay: 385 }
  ];

  // Tagline Words
  const taglineWords = ['INSTANT', 'WORKFORCE', 'VERIFICATION'];

  useEffect(() => {
    // Stage Choreography
    const t0 = setTimeout(() => setStage(1), 80);    // Shield appearance & Laser scan begins
    const t1 = setTimeout(() => {
      setStage(2);                                  // Laser hits center -> 3D Checkmark blooms!
      try { soundEngine.playBeep && soundEngine.playBeep(); } catch {}
    }, 420);
    const t2 = setTimeout(() => setStage(3), 680);   // Typography slams & flips
    const t3 = setTimeout(() => {
      setStage(4);                                  // Full statutory verification lock
      try { soundEngine.playSuccess && soundEngine.playSuccess(); } catch {}
    }, 1050);
    const t4 = setTimeout(() => {
      setIsExiting(true);
      try { sessionStorage.setItem('joy_intro_seen', 'true'); } catch {}
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 300);
    }, 1350);

    // Skip on click, spacebar, or ESC
    const handleDismiss = () => {
      setIsExiting(true);
      try { sessionStorage.setItem('joy_intro_seen', 'true'); } catch {}
      setTimeout(() => {
        if (onFinish) onFinish();
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
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFinish]);

  const handleManualSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 200);
  };

  return (
    <div 
      onClick={handleManualSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
        isExiting 
          ? 'opacity-0 scale-[1.04] pointer-events-none filter blur-md' 
          : 'opacity-100 scale-100 bg-[#070B14]'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.08) 35%, rgba(7, 11, 20, 0.98) 70%)
        `
      }}
    >
      {/* Background Cybernetic Grid Lines */}
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

        {/* Ambient Emerald & Gold Radiant Backlight */}
        <div 
          className={`absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-500/20 via-amber-400/25 to-emerald-400/10 filter blur-3xl transition-all duration-1000 pointer-events-none ${
            stage >= 2 ? 'scale-110 opacity-100' : 'scale-75 opacity-40'
          }`} 
        />

        {/* =========================================================================
         * 1. 3D SHIELD & LASER SCANNING CHAMBER
         * ========================================================================= */}
        <div className="relative flex items-center justify-center">
          
          {/* Outer Pulsing Aura Ring */}
          <div 
            className={`absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-emerald-500/30 transition-all duration-700 pointer-events-none ${
              stage >= 2 ? 'scale-125 opacity-100 animate-ping' : 'scale-90 opacity-0'
            }`}
            style={{ animationDuration: '2.5s' }}
          />

          {/* Secondary Concentric Tech Ring */}
          <div 
            className={`absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-dashed border-amber-400/20 pointer-events-none transition-all duration-1000 ${
              stage >= 1 ? 'rotate-180 scale-100 opacity-80' : 'rotate-0 scale-75 opacity-0'
            }`}
            style={{ transition: 'transform 2.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease' }}
          />

          {/* Golden Shield Container */}
          <div className="relative z-10 overflow-hidden p-2">
            <img 
              src="/assets/logos/joy_true_profile_shield_emblem.png" 
              alt="JOY TRUE PROFILE" 
              className={`w-36 h-36 sm:w-44 sm:h-44 object-contain transition-all duration-700 ease-out ${
                stage >= 1 
                  ? 'opacity-100 transform scale-100 drop-shadow-[0_12px_32px_rgba(16,185,129,0.4)]' 
                  : 'opacity-0 transform scale-80 filter blur-[3px]'
              }`}
              style={{
                transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out'
              }}
            />

            {/* Holographic Cyan-Emerald Laser Scan Sweep */}
            <div 
              className={`absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_rgba(52,211,153,1)] pointer-events-none transition-all duration-700 ${
                stage >= 1 && stage < 3 ? 'translate-y-36 opacity-100' : 'translate-y-0 opacity-0'
              }`}
              style={{
                transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* =========================================================================
         * 2. 3D KINETIC TYPOGRAPHY ASSEMBLY
         * ========================================================================= */}
        <div className="mt-4 sm:mt-6 text-center flex flex-col items-center">
          
          {/* Main Title Row: "JOY" (Kinetic Slam) + "TRUE PROFILE" (3D Stagger Flip) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
            
            {/* "JOY": Pristine White Metallic Kinetic Drop */}
            <span 
              className={`text-3xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-white transition-all duration-500 ${
                stage >= 3 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform -translate-y-4 scale-110 filter blur-[2px]'
              }`}
              style={{
                textShadow: '0 2px 16px rgba(255, 255, 255, 0.25)',
                transition: 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease'
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
                    filter: stage >= 3 ? 'blur(0px)' : 'blur(3px)',
                    transitionDelay: `${item.delay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    filter: 'drop-shadow(0 2px 14px rgba(245, 158, 11, 0.4))'
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
          <div className="relative mt-2 sm:mt-3 overflow-hidden py-1">
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-[0.25em]">
              {taglineWords.map((word, wIdx) => (
                <React.Fragment key={wIdx}>
                  <span
                    className={`transition-all duration-600 text-amber-400 ${
                      stage >= 3 
                        ? 'opacity-100 transform translate-y-0 filter-none' 
                        : 'opacity-0 transform translate-y-2 filter blur-[2px]'
                    }`}
                    style={{
                      transitionDelay: `${wIdx * 90}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      textShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                    }}
                  >
                    {word}
                  </span>
                  {wIdx < taglineWords.length - 1 && (
                    <span 
                      className={`text-emerald-400 text-[10px] transition-opacity duration-500 ${
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
              className={`absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-emerald-300 to-transparent pointer-events-none transition-transform duration-1000 ${
                stage >= 3 ? 'translate-x-[400%]' : '-translate-x-[200%]'
              }`}
              style={{
                transition: 'transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

        </div>

      </div>
    </div>
  );
}

