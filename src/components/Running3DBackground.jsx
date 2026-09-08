import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';
import GLOBE from 'vanta/dist/vanta.globe.min';
import WAVES from 'vanta/dist/vanta.waves.min';
import HALO from 'vanta/dist/vanta.halo.min';

export const Running3DBackground = () => {
  const vantaRef = useRef(null);
  const effectInstanceRef = useRef(null);
  const [activeMode, setActiveMode] = useState('net'); // 'net' | 'globe' | 'waves' | 'halo'
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    // Destroy existing instance if active
    if (effectInstanceRef.current) {
      try {
        effectInstanceRef.current.destroy();
      } catch {
        // ignore
      }
      effectInstanceRef.current = null;
    }

    if (!vantaRef.current) return;

    try {
      if (activeMode === 'net') {
        effectInstanceRef.current = NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xf59e0b, // Golden Amber
          backgroundColor: 0x0c0f17, // Warm Charcoal Slate
          points: 12.00,
          maxDistance: 22.00,
          spacing: 16.00,
          showDots: true,
        });
      } else if (activeMode === 'globe') {
        effectInstanceRef.current = GLOBE({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xf59e0b,
          color2: 0xf97316,
          backgroundColor: 0x0c0f17,
          size: 1.05,
        });
      } else if (activeMode === 'waves') {
        effectInstanceRef.current = WAVES({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x1c2438,
          shininess: 45.00,
          waveHeight: 18.00,
          waveSpeed: 0.85,
          zoom: 0.85,
        });
      } else if (activeMode === 'halo') {
        effectInstanceRef.current = HALO({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0x0c0f17,
          baseColor: 0xf59e0b,
          size: 1.2,
          amplitudeFactor: 1.2,
        });
      }
    } catch (err) {
      console.warn('VantaJS effect failed to initialize:', err);
    }

    return () => {
      if (effectInstanceRef.current) {
        try {
          effectInstanceRef.current.destroy();
        } catch {
          // ignore
        }
        effectInstanceRef.current = null;
      }
    };
  }, [activeMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Real Three.js / Vanta.js WebGL Interactive Background */}
      <div ref={vantaRef} className="absolute inset-0 w-full h-full pointer-events-auto" />

      {/* Luminous Warm Amber & Sunset Coral Ambient Background Overlays */}
      <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] bg-gradient-to-br from-amber-500/10 via-orange-500/6 to-rose-600/8 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[35%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-bl from-orange-600/8 via-rose-500/6 to-amber-500/6 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[25%] w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/8 via-rose-500/6 to-emerald-400/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Subtle Precision Grid Overlay with warm amber tint */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35 pointer-events-none"></div>

      {/* Floating 3D VantaJS WebGL Shader Switcher Pill */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0c0f17]/90 backdrop-blur-xl border border-amber-500/30 shadow-2xl font-mono text-[11px] text-slate-300">
        <button
          onClick={() => setControlsVisible(!controlsVisible)}
          className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1.5 hover:bg-amber-500/25 transition-all cursor-pointer shadow-xs"
          title="Toggle Vanta.js 3D WebGL Shader Presets"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>3D WebGL Engine</span>
        </button>

        {controlsVisible && (
          <div className="flex items-center gap-1 pl-1 animate-in fade-in slide-in-from-left-2 duration-150">
            {[
              { id: 'net', label: '🕸️ Net' },
              { id: 'globe', label: '🌐 Globe' },
              { id: 'waves', label: '🌊 Waves' },
              { id: 'halo', label: '🪐 Halo' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeMode === m.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md border border-amber-300/60'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Running3DBackground;
