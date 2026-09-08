import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Zap, Lock, Activity, Volume2, VolumeX, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Native Web Audio API synthesizer for futuristic sci-fi sound effects
 * Zero external MP3 files, zero latency, 100% procedural.
 */
class SoundFxSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Futuristic micro-chirp for telemetry scanning
  playTelemetryChirp(freq = 880) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Majestic verification harmonic chord upon 100% completion
  playUnlockHarmonic() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      // High-tech affirmative major chord [C5, E5, G5, C6]
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.03);

        gain.gain.setValueAtTime(0.035, this.ctx.currentTime + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6 + idx * 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.03);
        osc.stop(this.ctx.currentTime + 0.65 + idx * 0.05);
      });
    } catch {
      // Ignore audio restriction
    }
  }
}

const sfx = new SoundFxSynthesizer();

export default function LandingPagePreloader({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('CONNECTING TO DPDP ENCRYPTED GATEWAY');
  const [stageCode, setStageCode] = useState('SYS_BOOT_01');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  const requestRef = useRef(null);
  const startTimeRef = useRef(null);

  const TARGET_DURATION = 2100; // 2.1s optimal cinematic duration

  // Telemetry stages based on progress
  const stages = [
    { threshold: 18, code: 'SYS_DPDP_INIT', text: 'CONNECTING TO DPDP ENCRYPTED GATEWAY' },
    { threshold: 38, code: 'BIO_SCAN_AI', text: 'CALIBRATING 3D BIOMETRIC NEURAL MATRIX' },
    { threshold: 62, code: 'EPFO_NSDL_SYNC', text: 'CROSS-REFERENCING EPFO & COURT RECORD LEDGERS' },
    { threshold: 84, code: 'IMPS_NPCI_OK', text: 'VERIFYING BANK PENNY DROP & PAN IDENTITY' },
    { threshold: 98, code: 'BADGE_CERT_GEN', text: 'COMPILING AUDIT-READY TRUEPROFILE CREDENTIALS' },
    { threshold: 100, code: 'ACCESS_GRANTED', text: 'JOY TRUE PROFILE READY • ACCESS GRANTED' }
  ];

  // Sound toggle
  const toggleSound = () => {
    sfx.enabled = soundMuted;
    setSoundMuted(!soundMuted);
  };

  // Skip preloader immediately
  const handleSkip = () => {
    setIsUnlocked(true);
    setIsExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 400);
  };

  useEffect(() => {
    // Escape key to skip
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    let lastChirpProgress = 0;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      // Non-linear easing curve for cinematic tension: starts fast, steadies, surges to 100%
      let rawP = elapsed / TARGET_DURATION;
      if (rawP > 1) rawP = 1;

      // Cubic ease-out with dramatic pause near 95%
      let easedP;
      if (rawP < 0.8) {
        easedP = (rawP / 0.8) * 0.85;
      } else {
        const remaining = (rawP - 0.8) / 0.2;
        easedP = 0.85 + (remaining * remaining) * 0.15;
      }

      const currentP = Math.min(100, Math.round(easedP * 100));
      setProgress(currentP);

      // Play soft chirp every ~15%
      if (currentP - lastChirpProgress >= 14 && currentP < 98) {
        lastChirpProgress = currentP;
        sfx.playTelemetryChirp(700 + currentP * 6);
      }

      // Update stage text
      const currentStage = stages.find(s => currentP <= s.threshold) || stages[stages.length - 1];
      if (currentStage) {
        setStageText(currentStage.text);
        setStageCode(currentStage.code);
      }

      if (rawP < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        // Complete!
        setProgress(100);
        setIsUnlocked(true);
        sfx.playUnlockHarmonic();

        // Hold heroic climax for 350ms, then initiate exit curtain
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 650);
        }, 350);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // SVG Circular progress math
  const radius = 108;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ${
        isExiting 
          ? 'opacity-0 scale-[1.06] pointer-events-none filter blur-sm' 
          : 'opacity-100 scale-100 bg-[#07090e]'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.08) 35%, rgba(7, 9, 14, 0.98) 75%),
          linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 32px 32px, 32px 32px'
      }}
    >
      {/* Top Controls: Audio toggle & Telemetry Status */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 font-mono text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-400 font-bold uppercase tracking-widest">
            SECURE VERIFICATION GATEWAY
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-500 font-mono">TLS_1.3 • AES_256 • DPDP READY</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors flex items-center gap-1.5 px-2.5 text-[10px]"
            title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{soundMuted ? 'AUDIO OFF' : 'AUDIO ON'}</span>
          </button>

          <button
            onClick={handleSkip}
            className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-amber-500/40 transition-all text-[11px] font-mono tracking-wider flex items-center gap-1"
          >
            <span>SKIP</span>
            <span className="text-[9px] text-slate-500 hidden sm:inline">[ESC]</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: The Holographic Shield Reticle */}
      <div className="relative flex flex-col items-center justify-center">

        {/* Ambient Volumetric Backlight */}
        <div 
          className={`absolute w-72 h-72 rounded-full transition-all duration-700 pointer-events-none filter blur-3xl ${
            isUnlocked 
              ? 'bg-emerald-500/25 scale-125' 
              : 'bg-amber-500/20 scale-100'
          }`} 
        />

        {/* Outer Circular SVG HUD with Rotating Gyroscopic Arcs */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">

          {/* Precision SVG Reticle */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 240 240">
            {/* Outer static background track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="2"
              fill="transparent"
            />

            {/* Segmented dashed decorative orbit */}
            <circle
              cx="120"
              cy="120"
              r={radius + 8}
              stroke="rgba(245, 158, 11, 0.2)"
              strokeWidth="1.5"
              strokeDasharray="6 8 2 8"
              fill="transparent"
              className="animate-[spin_20s_linear_infinite]"
              style={{ transformOrigin: 'center' }}
            />

            {/* Inner counter-rotating cyan tick marks */}
            <circle
              cx="120"
              cy="120"
              r={radius - 12}
              stroke="rgba(16, 185, 129, 0.25)"
              strokeWidth="1"
              strokeDasharray="4 12"
              fill="transparent"
              className="animate-[spin_12s_linear_infinite_reverse]"
              style={{ transformOrigin: 'center' }}
            />

            {/* Dynamic Progress Arc with Emerald-to-Amber Glow */}
            <defs>
              <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="60%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="url(#preloaderGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              filter="url(#laserGlow)"
              className="transition-[stroke-dashoffset] duration-150 ease-out"
            />
          </svg>

          {/* 4 Cyber Corner Brackets framing the emblem */}
          <div className="absolute -top-3 -left-3 w-5 h-5 border-t-2 border-l-2 border-amber-400/60 pointer-events-none"></div>
          <div className="absolute -top-3 -right-3 w-5 h-5 border-t-2 border-r-2 border-amber-400/60 pointer-events-none"></div>
          <div className="absolute -bottom-3 -left-3 w-5 h-5 border-b-2 border-l-2 border-amber-400/60 pointer-events-none"></div>
          <div className="absolute -bottom-3 -right-3 w-5 h-5 border-b-2 border-r-2 border-amber-400/60 pointer-events-none"></div>

          {/* Biometric Verification Pulse Ring on Completion */}
          {isUnlocked && (
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping pointer-events-none opacity-80" />
          )}

          {/* Holographic Shield Container */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center overflow-hidden rounded-full p-2 bg-gradient-to-b from-[#111624]/60 to-[#07090e]/90 border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            
            {/* The Official Project Logo */}
            <img 
              src="/joy_logo.png" 
              alt="JOY TRUE PROFILE Emblem" 
              className={`w-28 h-28 sm:w-32 sm:h-32 object-contain transition-all duration-500 z-10 drop-shadow-[0_8px_20px_rgba(245,158,11,0.4)] ${
                isUnlocked 
                  ? 'scale-110 drop-shadow-[0_0_35px_rgba(16,185,129,0.8)]' 
                  : 'scale-100'
              }`}
            />

            {/* Vertical Holographic Biometric Laser Scanner Sweep */}
            {!isUnlocked && (
              <div 
                className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-20 shadow-[0_0_15px_#10b981,0_0_25px_#f59e0b] animate-[scanLaser_1.4s_easeInOutSine_infinite] pointer-events-none"
              >
                {/* Laser focal flare */}
                <div className="absolute left-1/2 -top-1 -translate-x-1/2 w-4 h-3 rounded-full bg-white/90 filter blur-[1px]"></div>
              </div>
            )}

            {/* Specular Glint Sheen passing through */}
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent z-15 pointer-events-none transform -translate-x-full animate-[sheenGlide_2.4s_infinite]"
            />
          </div>
        </div>

        {/* Typography & Brand Hierarchy */}
        <div className="mt-8 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-outfit uppercase">
              JOY <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400">TRUE PROFILE</span>
            </h1>
          </div>

          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-amber-300 font-mono font-bold">
            INSTANT WORKFORCE VERIFICATION
          </p>

          {/* Progress Percentage Display */}
          <div className="mt-6 flex items-baseline justify-center gap-1 font-mono">
            <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-emerald-400 tabular-nums">
              {progress}
            </span>
            <span className="text-base sm:text-lg font-bold text-amber-400">%</span>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-56 sm:w-64 h-1.5 bg-slate-800/80 rounded-full mt-3 overflow-hidden p-[1px] border border-slate-700/50">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-emerald-400 transition-all duration-150 relative shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#ffffff]"></div>
            </div>
          </div>

          {/* Dynamic Cryptographic Stage Readout */}
          <div className="mt-3 flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
              {stageCode}
            </span>
            <span className="text-slate-300 tracking-wider">
              {stageText}
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="absolute bottom-6 left-6 right-6 hidden md:flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-white/5 pt-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI BIOMETRIC: <span className="text-emerald-400 font-bold">ONLINE</span></span>
          </span>
          <span className="text-slate-600">•</span>
          <span>EPFO LEDGER: <span className="text-slate-300">CALIBRATED</span></span>
          <span className="text-slate-600">•</span>
          <span>UIDAI GATEWAY: <span className="text-slate-300">ACTIVE</span></span>
        </div>

        <div className="flex items-center gap-4">
          <span>LATENCY: <span className="text-emerald-400 font-bold">14ms</span></span>
          <span className="text-slate-600">•</span>
          <span>ENGINE: <span className="text-amber-400 font-bold">V8.2 HIGH-SPEED</span></span>
        </div>
      </div>

      {/* Global Embedded Keyframes for Laser and Sheen */}
      <style>{`
        @keyframes scanLaser {
          0% {
            top: 5%;
            opacity: 0.2;
          }
          50% {
            top: 90%;
            opacity: 1;
          }
          100% {
            top: 5%;
            opacity: 0.2;
          }
        }
        @keyframes sheenGlide {
          0% {
            transform: translateX(-150%) rotate(25deg);
          }
          40%, 100% {
            transform: translateX(250%) rotate(25deg);
          }
        }
      `}</style>
    </div>
  );
}
