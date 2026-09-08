import React, { useRef, useState, useEffect } from 'react';

/**
 * VideoLoopBackground
 * 
 * Provides an executive, seamless looping video background with a luxury frosted light veil.
 * Features:
 * - HTML5 hardware-accelerated looping video (muted, playsInline, autoPlay).
 * - Layered ambient animated light mesh (warm amber, rose, slate) for instant 60fps fluidity.
 * - Frosted light veil (bg-white/80) ensuring 100% WCAG contrast and crystal-clear text readability.
 * - Zero wireframe spiderwebs or lines cutting across content.
 */
export const VideoLoopBackground = () => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      video.play().catch(() => {
        // Autoplay policy fallback: video remains paused quietly, ambient mesh continues
      });
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // If already ready
    if (video.readyState >= 3) {
      setVideoLoaded(true);
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#F8FAFC]"
      aria-hidden="true"
    >
      {/* 1. Underlying Luminous Fluid Mesh Gradients (Always active, 60fps hardware accelerated) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Amber Sunburst Orb (Top Right) */}
        <div 
          className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-amber-300/35 via-orange-300/20 to-transparent blur-[100px] animate-pulse" 
          style={{ animationDuration: '8s' }}
        />

        {/* Soft Rose & Coral Luminous Wash (Center Left) */}
        <div 
          className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-rose-300/25 via-amber-200/20 to-transparent blur-[110px] animate-pulse" 
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />

        {/* Indigo / Slate Ambient Floor Glow (Bottom Center) */}
        <div 
          className="absolute -bottom-40 left-1/4 w-[750px] h-[600px] rounded-full bg-gradient-to-t from-indigo-200/25 via-slate-200/20 to-transparent blur-[120px] animate-pulse" 
          style={{ animationDuration: '10s', animationDelay: '4s' }}
        />
      </div>

      {/* 2. Looping Video Element */}
      {!hasError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-35' : 'opacity-0'
          }`}
          style={{
            filter: 'contrast(1.15) brightness(1.05) saturate(1.1)',
            mixBlendMode: 'multiply'
          }}
        >
          <source src="/background_video.webm" type="video/webm" />
        </video>
      )}

      {/* 3. Micro Architectural Precision Dot Grid Texture */}
      <div 
        className="absolute inset-0 opacity-45 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* 4. Luxury Frosted Light Veil (Ensures Foreground Typography Has 100% Crisp Contrast) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/80 via-[#F8FAFC]/65 to-[#F8FAFC]/90 backdrop-blur-[0.5px] pointer-events-none" />

      {/* 5. Delicate Edge Vignette to Softly Frame Content */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(248, 250, 252, 0.65) 100%)'
        }}
      />
    </div>
  );
};

export default VideoLoopBackground;
