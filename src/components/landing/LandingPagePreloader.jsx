import React, { useState, useEffect } from 'react';

/**
 * Clean, Prestigious & Kinetic Logo Preloader for JOY TRUE PROFILE
 * Refinements:
 * - NO white dot
 * - NO green background circle or green outline ring
 * - NO square box layout or clipping tints around the logo
 * - Pure, seamless high-res logo with kinetic assembly & 3D letter flip typography
 */
export default function LandingPagePreloader({ onFinish }) {
  // Animation stages: 0=Assemble, 1=Crest Lock, 2=Typography Flip, 3=Tagline Sweep, 4=Complete Bloom
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

  // Tagline words with staggered tracking reveal
  const taglineWords = ['INSTANT', 'WORKFORCE', 'VERIFICATION'];

  useEffect(() => {
    // Stage choreography
    const t0 = setTimeout(() => setStage(1), 200);  // Crest smoothly locks into place
    const t1 = setTimeout(() => setStage(2), 650);  // JOY drop & TRUE PROFILE 3D letter flip
    const t2 = setTimeout(() => setStage(3), 1250); // Tagline laser sweep
    const t3 = setTimeout(() => setStage(4), 1800); // Full harmonious bloom
    const t4 = setTimeout(() => {                   // Smooth curtain dissolve
      setIsExiting(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
    }, 2400);

    // Instant skip on click, spacebar, or ESC
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
    }, 300);
  };

  return (
    <div 
      onClick={handleManualSkip}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-500 ease-out ${
        isExiting 
          ? 'opacity-0 scale-[1.03] pointer-events-none filter blur-sm' 
          : 'opacity-100 scale-100 bg-[#07090e]'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 48%, rgba(245, 158, 11, 0.12) 0%, rgba(7, 9, 14, 0.98) 65%)
        `
      }}
    >
      {/* Dynamic Centered Brand Field */}
      <div className="relative flex flex-col items-center justify-center max-w-xl w-full px-4">

        {/* Soft Ambient Warm Amber Backlight Aura (No Green Circle, No Sharp Borders) */}
        <div 
          className={`absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-amber-500/15 filter blur-3xl transition-all duration-1000 pointer-events-none ${
            stage >= 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
          }`} 
        />

        {/* =========================================================================
         * 1. CLEAN LOGO PRESENTATION (NO BOX LAYOUT, NO WHITE DOT, NO GREEN RINGS)
         * ========================================================================= */}
        <div className="relative flex items-center justify-center">
          <img 
            src="/joy_logo.png" 
            alt="JOY TRUE PROFILE" 
            className={`w-36 h-36 sm:w-44 sm:h-44 object-contain relative z-10 transition-all duration-700 ease-out ${
              stage >= 1 
                ? 'opacity-100 transform scale-100 drop-shadow-[0_12px_32px_rgba(245,158,11,0.45)]' 
                : 'opacity-0 transform scale-80 filter blur-[2px]'
            }`}
            style={{
              transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out'
            }}
          />
        </div>

        {/* =========================================================================
         * 2. INNOVATIVE 3D KINETIC TYPOGRAPHY ASSEMBLY
         * ========================================================================= */}
        <div className="mt-5 sm:mt-7 text-center flex flex-col items-center">
          
          {/* Main Title Row: "JOY" (Kinetic Drop) + "TRUE PROFILE" (3D Stagger Flip) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
            
            {/* "JOY": Crisp Pure White 3D Kinetic Slam */}
            <span 
              className={`text-3xl sm:text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-white transition-all duration-500 ${
                stage >= 2 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform -translate-y-4 scale-110 filter blur-[2px]'
              }`}
              style={{
                textShadow: '0 0 24px rgba(255, 255, 255, 0.3)',
                transition: 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease'
              }}
            >
              JOY
            </span>

            {/* "TRUE PROFILE": 3D Kinetic Stagger Decryption */}
            <div 
              className="inline-flex items-center"
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
                    transform: stage >= 2 
                      ? 'translateY(0px) rotateX(0deg) scale(1)' 
                      : 'translateY(14px) rotateX(-90deg) scale(0.85)',
                    opacity: stage >= 2 ? 1 : 0,
                    filter: stage >= 2 ? 'blur(0px)' : 'blur(3px)',
                    transitionDelay: `${item.delay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                    textShadow: '0 0 25px rgba(245, 158, 11, 0.55)'
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
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.25em]">
              {taglineWords.map((word, wIdx) => (
                <React.Fragment key={wIdx}>
                  <span
                    className={`transition-all duration-600 text-amber-300/90 ${
                      stage >= 3 
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
                      className={`text-amber-500/40 text-[9px] transition-opacity duration-500 ${
                        stage >= 3 ? 'opacity-100' : 'opacity-0'
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
                stage >= 3 ? 'translate-x-[400%]' : '-translate-x-[200%]'
              }`}
              style={{
                transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>

          {/* Minimalist Glowing Micro-Line that expands from center */}
          <div 
            className={`h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-all duration-700 ease-out mt-4 ${
              stage >= 3 ? 'w-32 sm:w-44 opacity-100' : 'w-0 opacity-0'
            }`}
          />

        </div>

      </div>
    </div>
  );
}
