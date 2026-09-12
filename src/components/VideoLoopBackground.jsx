import React from 'react';

/**
 * VideoLoopBackground - High-Precision Executive Dark Background
 * Provides a deep obsidian (#070A11) canvas with subtle cyber dot grid and ambient neon flares.
 */
export const VideoLoopBackground = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#070A11]"
      aria-hidden="true"
    >
      {/* Precision Dark Technical Engineering Dot Grid Texture */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Deep Ambient Mesh Radial Lighting Flares */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-amber-500/05 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
};

export default VideoLoopBackground;
