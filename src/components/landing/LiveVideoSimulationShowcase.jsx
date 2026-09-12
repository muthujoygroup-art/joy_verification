import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Search, 
  HardHat, 
  Fingerprint, 
  Radio, 
  Camera, 
  Layers,
  ArrowRight,
  Eye,
  Activity,
  Check
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const SIMULATION_CHANNELS = [
  {
    id: 'biometric',
    title: '3D AI Biometric Face Camera',
    subtitle: 'Anti-Spoofing Liveness & UIDAI Aadhaar Match',
    badge: 'LIVE CAMERA HUD',
    icon: Camera,
    color: 'from-purple-600 via-indigo-600 to-cyan-500',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    stats: [
      { label: 'Match Confidence', value: '99.8%' },
      { label: 'Latency', value: '0.45s' },
      { label: 'Anti-Spoofing', value: 'Active 3D' }
    ]
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Candidate Magic Link',
    subtitle: 'Zero-Drop Mobile Self-Verification Flow',
    badge: 'MOBILE STREAM',
    icon: Smartphone,
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    stats: [
      { label: 'Completion Time', value: '42s' },
      { label: 'Drop-off Rate', value: '<2%' },
      { label: 'Channels', value: 'WA / SMS / Mail' }
    ]
  },
  {
    id: 'epfo_radar',
    title: 'EPFO UAN Moonlighting Radar',
    subtitle: 'Dual-Employment & Active Payroll Audit',
    badge: 'RADAR SONAR',
    icon: Search,
    color: 'from-amber-500 via-orange-600 to-rose-600',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    stats: [
      { label: 'Service History', value: '4 Tenures' },
      { label: 'Active Overlaps', value: '0 (Clean)' },
      { label: 'Risk Score', value: 'Low (0.01%)' }
    ]
  },
  {
    id: 'turnstile',
    title: 'Plant QR Pass Turnstile Gate',
    subtitle: 'Sub-Second Scannable Access for Factory Staff',
    badge: 'GATE IOT ACCESS',
    icon: HardHat,
    color: 'from-blue-600 via-indigo-600 to-emerald-600',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    stats: [
      { label: 'Scan Response', value: '0.34s' },
      { label: 'Audit Log', value: 'Statutory Form XVI' },
      { label: 'Gate Status', value: 'Turnstile Unlocked' }
    ]
  }
];

export const LiveVideoSimulationShowcase = () => {
  const [activeChannel, setActiveChannel] = useState('biometric');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  // Auto-play animation timeline loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setStepIndex((s) => (s + 1) % 4);
            return 0;
          }
          return prev + 1.25;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSelectChannel = (id) => {
    soundEngine.playClick();
    setActiveChannel(id);
    setProgress(0);
    setStepIndex(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    soundEngine.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    soundEngine.playClick();
    setProgress(0);
    setStepIndex(0);
    setIsPlaying(true);
  };

  const currentChannel = SIMULATION_CHANNELS.find(c => c.id === activeChannel) || SIMULATION_CHANNELS[0];

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-indigo-900/50">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>INTERACTIVE MOTION PREVIEW & LIVE REEL</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
              60 FPS SIMULATOR
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            See JOY Verification in Live Motion
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl font-normal">
            Watch real-time simulations of candidate selfie biometric scans, instant WhatsApp magic links, EPFO conflict radars, and factory gate passes.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-2xl shrink-0 self-start md:self-auto backdrop-blur-md">
          <button
            onClick={handleTogglePlay}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md flex items-center gap-1.5 text-xs cursor-pointer"
            title={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play Motion'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs cursor-pointer"
            title="Restart Reel"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Channel Switcher Pill Bar */}
      <div className="p-3 bg-slate-100/80 border-b border-slate-200 overflow-x-auto flex items-center gap-2">
        {SIMULATION_CHANNELS.map((ch) => {
          const Icon = ch.icon;
          const isSelected = activeChannel === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => handleSelectChannel(ch.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md font-black scale-[1.02]'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-purple-600'}`} />
              <span>{ch.title}</span>
            </button>
          );
        })}
      </div>

      {/* Live Looping Progress Bar */}
      <div className="w-full h-1 bg-slate-200 relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Simulation Viewport (Rich Interactive Visual Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Visual Reel Viewport (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[420px] text-white">
          
          {/* Animated Background Mesh & Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
          
          {/* Floating Live Telemetry HUD Bar */}
          <div className="relative z-10 flex items-center justify-between gap-4 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE AI ENGINE • 60 FPS</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
              CHANNEL: {currentChannel.badge}
            </span>
          </div>

          {/* =========================================================================
           * CHANNEL 1: BIOMETRIC FACE LIVENESS CAMERA HUD ANIMATION
           * ========================================================================= */}
          {activeChannel === 'biometric' && (
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
              {/* Simulated Camera Viewfinder Frame */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border-2 border-emerald-400/80 bg-slate-900/90 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.25)]">
                
                {/* Laser Scanning Bar */}
                <div 
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] z-30 transition-all"
                  style={{ top: `${(progress * 2) % 100}%` }}
                />

                {/* Avatar Preview Photo */}
                <img 
                  src="/assets/3d/hero_employee_3d_id.jpg" 
                  alt="Biometric Face Target" 
                  className="w-full h-full object-cover opacity-85 scale-105"
                />

                {/* Facial Landmark AI Bounding Box */}
                <div className="absolute inset-8 border border-emerald-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-2 animate-pulse">
                  <div className="flex justify-between">
                    <span className="w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                    <span className="w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                  </div>
                  <div className="flex justify-between">
                    <span className="w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                    <span className="w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                  </div>
                </div>

                {/* Live Overlays */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1.5">
                  <Camera className="w-3 h-3 text-emerald-400" />
                  <span>3D LIVENESS: 99.8%</span>
                </div>

                <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-emerald-500/40 text-center font-mono text-[10px] text-emerald-300 font-bold">
                  {progress < 30 && "INITIALIZING CAMERA SCANNER..."}
                  {progress >= 30 && progress < 70 && "EXTRACTING FACIAL BIOMETRIC VECTORS..."}
                  {progress >= 70 && "MATCH VERIFIED 100% WITH AADHAAR e-KYC ✓"}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
           * CHANNEL 2: WHATSAPP MAGIC LINK ONBOARDING FLOW ANIMATION
           * ========================================================================= */}
          {activeChannel === 'whatsapp' && (
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl font-sans space-y-3.5">
                {/* Simulated WhatsApp Notification Header */}
                <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-500/30 p-3 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>JOY Verification Concierge</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">Just Now</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">Hi Deepak, your onboarding magic link is ready:</p>
                  </div>
                </div>

                {/* Candidate Action Card */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Magic Link Security</span>
                    <span className="text-emerald-400 font-bold">Encrypted 256-bit</span>
                  </div>
                  
                  {/* Step status display */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>1. PIN Gate:</span>
                      <span className="text-emerald-400 font-bold">PIN 1234 Verified ✓</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>2. Aadhaar OTP:</span>
                      <span className="text-emerald-400 font-bold">UIDAI Validated ✓</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>3. Camera Selfie:</span>
                      <span className="text-cyan-400 font-bold">99.8% Genuine ✓</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dossier Auto-Compiled</span>
                    <span className="text-[10px] font-mono text-slate-400">TAT: 42s</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
           * CHANNEL 3: EPFO UAN MOONLIGHTING RADAR ANIMATION
           * ========================================================================= */}
          {activeChannel === 'epfo_radar' && (
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">EPFO UAN #1004XXXX7729</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    0 CONCURRENT OVERLAPS
                  </span>
                </div>

                {/* Timeline Bar */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 font-bold">Apex Cloud Systems Pvt Ltd</div>
                      <div className="text-[10px] text-slate-400">Jan 2023 – Present • Active Payroll</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Primary</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-300 font-bold">Infosys Technologies Ltd</div>
                      <div className="text-[10px] text-slate-400">Aug 2020 – Dec 2022 • Clean Exit</div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Relieved ✓</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
                  <span>Moonlighting Risk Assessment:</span>
                  <span className="text-emerald-400">CLEAN (0.01% Risk)</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
           * CHANNEL 4: PLANT QR TURNSTILE PASS ANIMATION
           * ========================================================================= */}
          {activeChannel === 'turnstile' && (
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-4">
              <div className="w-full max-w-sm bg-slate-900 border border-blue-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                  <HardHat className="w-8 h-8" />
                </div>
                
                <div>
                  <h4 className="text-base font-bold text-white">Suresh Kumar — Precision CNC</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Sterling Bharat Engine Plant • Shift A</p>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-around font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">QR PASS ID</span>
                    <span className="text-amber-400 font-bold">PASS-99824</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">RESPONSE</span>
                    <span className="text-emerald-400 font-bold">0.34s</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">GATE STATUS</span>
                    <span className="text-emerald-400 font-bold">UNLOCKED ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Video Telemetry Bar */}
          <div className="relative z-10 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="text-slate-300 font-bold">Simulation Step: {stepIndex + 1} of 4</span>
            <span className="text-emerald-400 font-bold">Encrypted End-to-End</span>
          </div>

        </div>

        {/* Right Details Panel (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white text-slate-900">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${currentChannel.tagColor}`}>
                {currentChannel.badge}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-outfit">
              {currentChannel.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {currentChannel.subtitle}. Built to eliminate manual operational friction, prevent fabricated credentials, and safeguard enterprise trust.
            </p>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {currentChannel.stats.map((st, sIdx) => (
                <div key={sIdx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">{st.label}</span>
                  <span className="text-base font-black text-slate-900 font-outfit mt-0.5 block">{st.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open_tour_guide_modal'))}
              className="w-full btn-superadmin text-xs py-3.5 font-black flex items-center justify-center gap-2 rounded-xl shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Experience Guided Role Tour 🚀</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LiveVideoSimulationShowcase;
