import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Fingerprint, 
  RotateCw,
  Award,
  Zap,
  Check,
  Camera,
  Activity
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const CANDIDATE_PROFILES = [
  {
    id: 'tech',
    roleLabel: 'Software & Tech Hire',
    name: 'Deepak Sharma',
    title: 'Senior Cloud Engineer',
    company: 'Apex Cloud Systems',
    candidateId: 'VERIFIED-EMP-8941',
    speed: 'Instant (Under 60s)',
    status: 'ALL CHECKS CLEARED',
    initials: 'DS',
    accentColor: 'from-amber-400 via-orange-500 to-rose-500',
    badgeGlow: 'rgba(245, 158, 11, 0.45)',
    experience: '7 Years Experience • 3 Previous Employers Confirmed',
    bankMatch: 'Bank Account Verified — 100% Name Match',
    courtScreen: 'Clean Police & Court Record — No Cases Found',
    avatarBg: 'bg-orange-600',
    avatarImage: '/assets/3d/hero_employee_3d_id.jpg',
    outerRing: 'border-orange-500 bg-orange-600',
    biometricScore: '99.8%'
  },
  {
    id: 'plant',
    roleLabel: 'Manufacturing & Plant',
    name: 'Kavita Nair',
    title: 'Plant Operations Manager',
    company: 'Sterling Bharat Manufacturing',
    candidateId: 'VERIFIED-EMP-5120',
    speed: 'Instant (Under 60s)',
    status: 'ALL CHECKS CLEARED',
    initials: 'KN',
    accentColor: 'from-emerald-400 via-teal-500 to-amber-500',
    badgeGlow: 'rgba(16, 185, 129, 0.45)',
    experience: '11 Years Experience • Fully Compliant Work History',
    bankMatch: 'Bank Account Verified — 100% Name Match',
    courtScreen: 'Clean Legal Record — Zero Court Proceedings',
    avatarBg: 'bg-emerald-600',
    avatarImage: '/assets/3d/hero_employee_3d_id.jpg',
    outerRing: 'border-emerald-500 bg-emerald-600',
    biometricScore: '99.9%'
  },
  {
    id: 'fleet',
    roleLabel: 'Operations & Logistics',
    name: 'Rajesh Verma',
    title: 'Logistics Fleet Coordinator',
    company: 'TransIndia Logistics',
    candidateId: 'VERIFIED-EMP-3398',
    speed: 'Instant (Under 60s)',
    status: 'ALL CHECKS CLEARED',
    initials: 'RV',
    accentColor: 'from-orange-400 via-rose-500 to-amber-500',
    badgeGlow: 'rgba(244, 63, 94, 0.45)',
    experience: '9 Years Experience • Zero Moonlighting Conflicts',
    bankMatch: 'Bank Account Verified — 100% Name Match',
    courtScreen: 'Clean Background — Verified Identity & Address',
    avatarBg: 'bg-rose-600',
    avatarImage: '/assets/3d/hero_employee_3d_id.jpg',
    outerRing: 'border-rose-500 bg-rose-600',
    biometricScore: '99.7%'
  }
];

const HeroInteractiveCard3D = () => {
  const [activeStageMode, setActiveStageMode] = useState('pass'); // 'pass' | 'biometric_3d'
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const cardRef = useRef(null);

  const profile = CANDIDATE_PROFILES[selectedIdx];

  // Mouse tilt physics handler
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 14;
    const rotateX = -((y - centerY) / centerY) * 14;
    
    const sheenX = (x / rect.width) * 100;
    const sheenY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, sheenX, sheenY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  };

  const handleFlip = () => {
    soundEngine.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleTriggerScan = () => {
    if (isScanning) return;
    soundEngine.playScan();
    setIsScanning(true);
    setTimeout(() => {
      soundEngine.playSuccess();
      setIsScanning(false);
    }, 1500);
  };

  const handleSelectProfile = (idx) => {
    soundEngine.playClick();
    setSelectedIdx(idx);
    handleTriggerScan();
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Top 3D Stage Mode Switcher */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl mb-3.5 w-full max-w-[440px]">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveStageMode('pass');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeStageMode === 'pass'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-black shadow-lg shadow-emerald-500/25 border border-emerald-400/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Interactive 3D Pass</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveStageMode('biometric_3d');
            handleTriggerScan();
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeStageMode === 'biometric_3d'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-black shadow-lg shadow-emerald-500/25 border border-emerald-400/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
          <span>3D Biometric ID Card</span>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-1.5 py-0.5 rounded-full ml-1 animate-pulse border border-emerald-500/40">3D</span>
        </button>
      </div>

      {/* Role Selection Chips */}
      <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-[440px] w-full shadow-lg backdrop-blur-xl">
        {CANDIDATE_PROFILES.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleSelectProfile(idx)}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              selectedIdx === idx
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black shadow-md border border-emerald-400/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedIdx === idx ? 'bg-emerald-300' : 'bg-slate-600'}`}></span>
            <span className="truncate">{p.roleLabel}</span>
          </button>
        ))}
      </div>

      {/* =========================================================================
       * MODE 1: INTERACTIVE 3D GLASS TILT CARD
       * ========================================================================= */}
      {activeStageMode === 'pass' && (
        <div
          className="w-full max-w-[440px] h-[520px] [perspective:1400px] cursor-pointer select-none relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          ref={cardRef}
        >
          {/* Floating Telemetry Micro-Pills */}
          <div className="absolute -top-3 -right-2 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/40 shadow-xl text-[10px] font-mono font-bold text-emerald-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>UIDAI & DPDP 2023 Verified</span>
          </div>

          <div className="absolute -bottom-3 -left-2 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-teal-500/40 shadow-xl text-[10px] font-mono font-bold text-teal-300 backdrop-blur-md">
            <Activity className="w-3 h-3 text-teal-400 animate-pulse" />
            <span>&lt;0.8s Sub-Second Sync</span>
          </div>

          <div
            className="w-full h-full relative transition-transform duration-300 ease-out [transform-style:preserve-3d]"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg) scale3d(1.02, 1.02, 1.02)`
            }}
          >
            {/* FRONT FACE */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl bg-slate-950/90 border-2 border-emerald-500/40 hover:border-emerald-400 p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-2xl overflow-hidden [backface-visibility:hidden]"
            >
              {/* Dynamic Specular Sheen */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 z-10 transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(16,185,129,0.5) 0%, rgba(20,184,166,0.2) 25%, rgba(6,182,212,0.1) 50%, transparent 75%)`
                }}
              />

              {/* Scanning Laser Beam */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] z-20 animate-laser-vertical"></div>
              )}

              {/* Top Bar: Company & Verification Status */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-600/30 border border-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono font-bold block">
                      JOY VERIFIED EMPLOYEE PASS
                    </span>
                    <h4 className="font-outfit font-black text-sm text-white tracking-tight">
                      {profile.company}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{profile.status}</span>
                </div>
              </div>

              {/* Candidate Center Card */}
              <div className="flex items-center gap-4 my-auto relative z-10">
                {/* Avatar Photo Frame with 3D Image Texture */}
                <div className="relative w-20 h-20 rounded-2xl p-1 bg-emerald-900/60 shadow-lg shrink-0 border border-emerald-500/50 overflow-hidden group">
                  <img
                    src={profile.avatarImage}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Corner Markers */}
                  <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-emerald-400 pointer-events-none"></span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-emerald-400 pointer-events-none"></span>
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-emerald-400 pointer-events-none"></span>
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-emerald-400 pointer-events-none"></span>
                </div>

                {/* Candidate Metadata */}
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white font-outfit leading-snug">
                    {profile.name}
                  </h3>
                  <p className="text-amber-400 text-xs font-semibold leading-tight mt-0.5">
                    {profile.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-medium font-mono text-[10px]">
                      ID: {profile.candidateId}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      Biometrics: {profile.biometricScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clear Verification Badges */}
              <div className="grid grid-cols-2 gap-2.5 my-2 relative z-10">
                <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Photo & Liveness</span>
                    <span className="text-xs font-bold text-white">100% Genuine Match</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2 shadow-md">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">Verification Speed</span>
                    <span className="text-xs font-bold text-amber-300">{profile.speed}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: QR Code & Flip Button */}
              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center text-white shadow-md">
                    <QrCode className="w-full h-full text-emerald-400" />
                  </div>
                  <div className="text-[10px] font-mono leading-tight">
                    <span className="font-bold text-white block">QR Gate Pass</span>
                    <span className="text-emerald-400 font-semibold">Active & Scannable</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playClick();
                    handleFlip();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audit Dossier</span>
                </button>
              </div>

            </div>

            {/* BACK FACE */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl bg-slate-950/95 border-2 border-amber-500/40 p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_45px_rgba(245,158,11,0.2)] backdrop-blur-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                      BACKGROUND SCREENING SUMMARY
                    </span>
                    <h4 className="font-outfit font-black text-sm text-white">
                      Verified Checklist
                    </h4>
                  </div>
                </div>

                <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                  100% COMPLIANT
                </span>
              </div>

              {/* Checkpoints List */}
              <div className="flex flex-col gap-2.5 my-auto text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Employment & Work History</span>
                    <span className="text-[11px] text-slate-300">{profile.experience}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Bank Account & Salary Match</span>
                    <span className="text-[11px] text-slate-300">{profile.bankMatch}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Court & Criminal Record Check</span>
                    <span className="text-[11px] text-slate-300">{profile.courtScreen}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Dual-Employment & Moonlighting</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">Clean — No Overlapping Jobs Detected</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  🔒 Cryptographically Certified
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-emerald-400/50"
                >
                  <RotateCw className="w-3.5 h-3.5 text-white" />
                  <span>View Front Badge</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
       * MODE 2: 3D BIOMETRIC ID CARD HIGH-RES SHOWCASE
       * ========================================================================= */}
      {activeStageMode === 'biometric_3d' && (
        <div className="w-full max-w-[440px] h-[520px] rounded-3xl bg-slate-950/95 border-2 border-emerald-500/40 p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-2xl relative overflow-hidden group">
          {/* Laser Scanning Line */}
          {isScanning && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] z-30 animate-laser-vertical"></div>
          )}

          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                <Fingerprint className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                  3D BIOMETRIC SCAN ENGINE
                </span>
                <span className="text-xs font-black text-white font-outfit">
                  UIDAI / Aadhaar & Liveness HUD
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE HUD</span>
            </span>
          </div>

          {/* Center 3D Graphic Canvas */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-800 bg-slate-900 my-auto shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
            <img
              src="/assets/3d/hero_3d_verification.jpg"
              alt="3D Biometric Verification Card"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Holographic HUD Overlays */}
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/60 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-lg">
              <Camera className="w-3 h-3 text-emerald-400" />
              <span>Face Liveness Match: {profile.biometricScore}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/60 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-lg">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>UIDAI Checksum Valid</span>
            </div>
          </div>

          {/* Bottom Telemetry Bar & Fast Scanner */}
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between relative z-10">
            <div>
              <span className="font-mono text-[10px] text-slate-400 font-bold block">TARGET PROFILE</span>
              <h5 className="font-bold text-xs text-white font-outfit">{profile.name} — {profile.title}</h5>
            </div>

            <button
              onClick={handleTriggerScan}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/25 cursor-pointer border border-emerald-500"
            >
              <Zap className={`w-3.5 h-3.5 text-white ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Test 3D Liveness'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Action Triggers */}
      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleTriggerScan}
          disabled={isScanning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/30 border border-emerald-400/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap className={`w-3.5 h-3.5 text-white ${isScanning ? 'animate-bounce' : ''}`} />
          <span>{isScanning ? 'Verifying Details...' : 'Test Verification Check'}</span>
        </button>

        {activeStageMode === 'pass' && (
          <button
            onClick={handleFlip}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFlipped ? 'Show Front' : 'View Full Breakdown'}</span>
          </button>
        )}
      </div>

      <span className="text-xs text-slate-400 mt-2.5">
        Hover and move cursor over card to explore interactive 3D depth.
      </span>

    </div>
  );
};

export default HeroInteractiveCard3D;
