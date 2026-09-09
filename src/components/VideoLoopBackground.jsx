import React from 'react';

/**
 * VideoLoopBackground - High-Precision Technical Architectural Background
 * Provides a 100% solid, crisp canvas without cloudy color washes or visual fading.
 */
export const VideoLoopBackground = () => {

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#F8FAFC]"
      aria-hidden="true"
    >
      {/* Precision Technical Engineering Dot Grid Texture */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};

export default VideoLoopBackground;
