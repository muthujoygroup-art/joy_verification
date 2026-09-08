import React, { useState, useEffect } from 'react';

/**
 * Innovative Brand Assembly Preloader for JOY TRUE PROFILE
 * Choreography:
 * 1. Quantum Light Spark & Wing Assembly (Wings spread open from energy core)
 * 2. Emerald Checkmark Pulse Strike (Shockwave ripple & specular glint)
 * 3. 3D Kinetic Stagger Decryption of "JOY TRUE PROFILE" (Letters flip & lock in 3D perspective)
 * 4. Laser Sweep Unmasking of "INSTANT WORKFORCE VERIFICATION" (Optical tracking reveal)
 * 5. Unified Harmonic Bloom & Seamless Exit
 */
export default function LandingPagePreloader({ onFinish }) {
  // Animation stages: 0=Spark, 1=Wings Assemble, 2=Emerald Strike, 3=Title Decrypt, 4=Tagline Sweep, 5=Complete Bloom, 6=Exit
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

  // Tagline words with staggered tracking animation
  const taglineWords = ['INSTANT', 'WORKFORCE', 'VERIFICATION'];

  useEffect(() => {
    // Precise stage timing choreography
    const t1 = setTimeout(() => setStage(1), 150);  // Wings unfold & assemble
    const t2 = setTimeout(() => setStage(2), 700);  // Emerald checkmark ignition
    const t3 = setTimeout(() => setStage(3), 1050); // JOY slam & TRUE PROFILE 3D letter flip
    const t4 = setTimeout(() => setStage(4), 1600); // Tagline laser sweep
    const t5 = setTimeout(() => setStage(5), 2200); // Full harmonious bloom
    const t6 = setTimeout(() => {                   // Smooth curtain dissolve
      setIsExiting(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 550);
    }, 2800);

    // Instant skip on click, tap, spacebar, or ESC
    const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 300);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFinish]);

  const handleManualSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 300);
  };

  return (
    <div 
      onClick={handleManualSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-600 ease-out ${
        isExiting 
          ? 'opacity-0 scale-[1.04] pointer-events-none filter blur-sm' 
          : 'opacity-100 scale-100 bg-[#07090e]'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 48%, rgba(245, 158, 11, 0.16) 0%, rgba(16, 185, 129, 0.08) 32%, rgba(7, 9, 14, 0.98) 72%)
        `
      }}
    >
      {/* Dynamic Radial Energy Field */}
      <div className="relative flex flex-col items-center justify-center max-w-xl w-full px-4">

        {/* Ambient Backlight Breathing Auras */}
        <div 
          className={`absolute w-80 h-80 rounded-full bg-amber-500/20 filter blur-3xl transition-all duration-1000 pointer-events-none ${
            stage >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`} 
        />
        <div 
          className={`absolute w-64 h-64 rounded-full bg-emerald-500/20 filter blur-2xl transition-all duration-700 pointer-events-none ${
            stage >= 2 ? 'scale-110 opacity-100' : 'scale-0 opacity-0'
          }`} 
        />

        {/* =========================================================================
         * 1. INNOVATIVE LOGO BUILDING SEQUENCE
         * ========================================================================= */}
        <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">

          {/* Spark Core on Ignition */}
          <div 
            className={`absolute w-4 h-4 rounded-full bg-white shadow-[0_0_25px_#ffffff,0_0_50px_#f59e0b] transition-all duration-500 pointer-events-none ${
              stage === 0 ? 'scale-150 opacity-100' : 'scale-0 opacity-0'
            }`} 
          />

          {/* Left & Right Golden Energy Beams sweeping in to dock into the wings */}
          <div 
            className={`absolute -left-20 top-1/2 -translate-y-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-white filter blur-[1px] transition-all duration-700 pointer-events-none ${
              stage >= 1 && stage < 3 
                ? 'translate-x-12 opacity-80' 
                : 'opacity-0 -translate-x-8'
            }`}
          />
          <div 
            className={`absolute -right-20 top-1/2 -translate-y-1/2 w-32 h-1.5 bg-gradient-to-l from-transparent via-amber-400 to-white filter blur-[1px] transition-all duration-700 pointer-events-none ${
              stage >= 1 && stage < 3 
                ? '-translate-x-12 opacity-80' 
                : 'opacity-0 translate-x-8'
            }`}
          />

          {/* Expanding Emerald Shockwave Pulse from Checkmark Activation */}
          {stage >= 2 && (
            <div className="absolute inset-4 rounded-full border-2 border-emerald-400/80 animate-[ping_1.6s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />
          )}

          {/* Assembling Winged Shield Crest Container */}
          <div 
            className={`relative flex items-center justify-center transition-all duration-700 ease-out ${
              stage >= 1 
                ? 'opacity-100 scale-100 filter-none' 
                : 'opacity-0 scale-50 filter blur-md'
            }`}
            style={{
              transform: stage >= 1 ? 'scale(1)' : 'scale(0.65)',
              transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out'
            }}
          >
            {/* The Official Winged Shield Logo with Kinetic Glow */}
            <img 
              src="/joy_logo.png" 
              alt="JOY TRUE PROFILE" 
              className={`w-36 h-36 sm:w-44 sm:h-44 object-contain transition-all duration-500 z-10 ${
                stage >= 2 
                  ? 'drop-shadow-[0_12px_32px_rgba(245,158,11,0.5)]' 
                  : 'drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] brightness-125'
              }`} 
            />

            {/* Specular Glint Sheen sweeping across the gold facets */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
              <div 
                className={`w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-20 transition-transform duration-1000 ${
                  stage >= 2 ? 'translate-x-[200%]' : '-translate-x-[200%]'
                }`}
                style={{
                  transition: 'transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>

            {/* Emerald Core Flare at Checkmark Ignition */}
            <div 
              className={`absolute w-12 h-12 rounded-full bg-emerald-400/60 filter blur-md transition-all duration-500 pointer-events-none ${
                stage === 2 ? 'scale-150 opacity-100' : 'scale-0 opacity-0'
              }`}
            />
          </div>

        </div>

        {/* =========================================================================
         * 2. INNOVATIVE 3D KINETIC TYPOGRAPHY ASSEMBLY
         * ========================================================================= */}
        <div className="mt-4 sm:mt-6 text-center flex flex-col items-center">
          
          {/* Main Title Row: "JOY" (Kinetic Drop) + "TRUE PROFILE" (3D Stagger Flip) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
            
            {/* "JOY": Crisp Pure White 3D Kinetic Slam */}
            <span 
              className={`text-3xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-white transition-all duration-500 ${
                stage >= 3 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform -translate-y-4 scale-125 filter blur-[2px]'
              }`}
              style={{
                textShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                transition: 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease'
              }}
            >
              JOY
            </span>

            {/* "TRUE PROFILE": 3D Kinetic Stagger Decryption */}
            <div 
              className="inline-flex items-center perspective-[800px]"
              style={{ perspective: '800px' }}
            >
              {trueProfileLetters.map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-block text-3xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-amber-400 transform-gpu transition-all duration-400 ${
                    item.isSpace ? 'w-2 sm:w-3' : ''
                  }`}
                  style={{
                    transformOrigin: '50% 100%',
                    transform: stage >= 3 
                      ? 'translateY(0px) rotateX(0deg) scale(1)' 
                      : 'translateY(16px) rotateX(-90deg) scale(0.8)',
                    opacity: stage >= 3 ? 1 : 0,
                    filter: stage >= 3 ? 'blur(0px)' : 'blur(4px)',
                    transitionDelay: `${item.delay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    textShadow: '0 0 25px rgba(245, 158, 11, 0.6), 0 0 50px rgba(245, 158, 11, 0.2)'
                  }}
                >
                  {item.char}
                </span>
              ))}
            </div>

          </div>

          {/* =========================================================================
           * 3. INNOVATIVE LASER SWEEP UNMASKING OF TAGLINE
           * ========================================================================= */}
          <div className="relative mt-3 sm:mt-4 overflow-hidden py-1">
            
            {/* Tagline Words with Tracking-Expansion Reveal */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-sans font-extrabold uppercase tracking-[0.25em]">
              {taglineWords.map((word, wIdx) => (
                <React.Fragment key={wIdx}>
                  <span
                    className={`transition-all duration-600 text-amber-300/90 ${
                      stage >= 4 
                        ? 'opacity-100 transform translate-y-0 filter-none' 
                        : 'opacity-0 transform translate-y-2 filter blur-[2px]'
                    }`}
                    style={{
                      transitionDelay: `${wIdx * 120}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {word}
                  </span>
                  {wIdx < taglineWords.length - 1 && (
                    <span 
                      className={`text-amber-500/50 text-[9px] transition-opacity duration-500 ${
                        stage >= 4 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ transitionDelay: `${wIdx * 120 + 60}ms` }}
                    >
                      •
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Glowing Laser Light Flare gliding across tagline */}
            <div 
              className={`absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent pointer-events-none transition-transform duration-1000 ${
                stage >= 4 ? 'translate-x-[400%]' : '-translate-x-[200%]'
              }`}
              style={{
                transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

          {/* Minimalist Glowing Micro-Line that expands from center */}
          <div 
            className={`h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-[0_0_15px_rgba(245,158,11,0.9)] transition-all duration-700 ease-out mt-4 ${
              stage >= 4 ? 'w-32 sm:w-44 opacity-100' : 'w-0 opacity-0'
            }`}
          />

        </div>

      </div>

      {/* Discreet click-to-skip hint */}
      <div 
        className={`absolute bottom-6 font-mono text-[10px] text-slate-500 tracking-wider transition-opacity duration-500 ${
          stage >= 3 ? 'opacity-60 hover:opacity-100' : 'opacity-0'
        }`}
      >
        CLICK ANYWHERE TO ENTER
      </div>
    </div>
  );
}
