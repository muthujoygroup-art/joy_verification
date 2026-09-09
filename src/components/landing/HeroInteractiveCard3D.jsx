import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Lock, 
  Fingerprint, 
  RotateCw,
  Award,
  Zap,
  Check,
  Building,
  Briefcase,
  UserCheck,
  FileCheck,
  Camera,
  Activity,
  Eye
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
      <div className="flex items-center justify-center p-1 rounded-2xl bg-white/95 border border-slate-200/90 shadow-xs mb-3.5 w-full max-w-[440px]">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveStageMode('pass');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeStageMode === 'pass'
              ? 'bg-orange-600 text-white font-black shadow-md shadow-orange-600/25 border border-orange-500'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              ? 'bg-orange-600 text-white font-black shadow-md shadow-orange-600/25 border border-orange-500'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>3D Biometric ID Card</span>
          <span className="text-[9px] bg-amber-200 text-amber-950 font-black px-1.5 py-0.5 rounded-full ml-1 animate-pulse">3D</span>
        </button>
      </div>

      {/* Role Selection Chips */}
      <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl bg-white/90 dark-glass-card border border-slate-200 max-w-[440px] w-full shadow-xs">
        {CANDIDATE_PROFILES.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleSelectProfile(idx)}
            className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
              selectedIdx === idx
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs border border-amber-400 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedIdx === idx ? 'bg-slate-950' : 'bg-amber-500'}`}></span>
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
          <div className="absolute -top-3 -right-2 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-amber-300 shadow-md text-[10px] font-mono font-bold text-amber-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>UIDAI & DPDP 2023 Verified</span>
          </div>

          <div className="absolute -bottom-3 -left-2 z-30 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-emerald-300 shadow-md text-[10px] font-mono font-bold text-emerald-900">
            <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
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
              className="absolute inset-0 w-full h-full rounded-3xl dark-glass-card border-2 border-amber-300/80 p-6 sm:p-7 flex flex-col justify-between shadow-xl backdrop-blur-2xl overflow-hidden [backface-visibility:hidden] bg-white/95"
              style={{
                boxShadow: `0 20px 45px -10px rgba(245, 158, 11, 0.25), 0 4px 15px rgba(15, 23, 42, 0.05)`
              }}
            >
              {/* Dynamic Specular Sheen */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30 z-10 transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(254,240,138,0.5) 0%, rgba(245,158,11,0.2) 25%, rgba(244,63,94,0.1) 50%, transparent 75%)`
                }}
              />

              {/* Scanning Laser Beam */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#f59e0b] z-20 animate-laser-vertical"></div>
              )}

              {/* Top Bar: Company & Verification Status */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black shadow-sm border border-orange-500">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-orange-700 font-bold block">
                      JOY VERIFICATION • VERIFIED EMPLOYEE
                    </span>
                    <h4 className="font-outfit font-black text-sm text-slate-900 tracking-tight">
                      {profile.company}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 text-emerald-700 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{profile.status}</span>
                </div>
              </div>

              {/* Candidate Center Card */}
              <div className="flex items-center gap-4 my-auto relative z-10">
                {/* Avatar Photo Frame with 3D Image Texture */}
                <div className="relative w-20 h-20 rounded-2xl p-1 bg-orange-600 shadow-md shrink-0 border border-orange-500 overflow-hidden group">
                  <img
                    src={profile.avatarImage}
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Corner Markers */}
                  <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-orange-400 pointer-events-none"></span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-orange-400 pointer-events-none"></span>
                  <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-orange-400 pointer-events-none"></span>
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-orange-400 pointer-events-none"></span>
                </div>

                {/* Candidate Metadata */}
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 font-outfit leading-snug">
                    {profile.name}
                  </h3>
                  <p className="text-amber-700 text-xs font-semibold leading-tight mt-0.5">
                    {profile.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium font-mono text-[10px]">
                      ID: {profile.candidateId}
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Biometrics: {profile.biometricScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clear Verification Badges */}
              <div className="grid grid-cols-2 gap-2.5 my-2 relative z-10">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] uppercase text-slate-500 block font-bold">Photo & Liveness</span>
                    <span className="text-xs font-bold text-slate-900">100% Genuine Match</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2 shadow-2xs">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] uppercase text-slate-500 block font-bold">Verification Speed</span>
                    <span className="text-xs font-bold text-amber-700">{profile.speed}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: QR Code & Flip Button */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center text-slate-900 shadow-xs">
                    <QrCode className="w-full h-full text-slate-800" />
                  </div>
                  <div className="text-[10px] font-mono leading-tight">
                    <span className="font-bold text-slate-800 block">QR Gate Pass</span>
                    <span className="text-emerald-600 font-semibold">Active & Scannable</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playClick();
                    handleFlip();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Audit Dossier</span>
                </button>
              </div>

            </div>

            {/* BACK FACE */}
            <div
              className="absolute inset-0 w-full h-full rounded-3xl dark-glass-card border-2 border-amber-300/80 p-6 sm:p-7 flex flex-col justify-between shadow-xl backdrop-blur-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white/95"
              style={{
                boxShadow: `0 20px 45px -10px rgba(245, 158, 11, 0.25)`
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block">
                      BACKGROUND SCREENING SUMMARY
                    </span>
                    <h4 className="font-outfit font-black text-sm text-slate-900">
                      Verified Checklist
                    </h4>
                  </div>
                </div>

                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                  100% COMPLIANT
                </span>
              </div>

              {/* Checkpoints List */}
              <div className="flex flex-col gap-2.5 my-auto text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Employment & Work History</span>
                    <span className="text-[11px] text-slate-600">{profile.experience}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Bank Account & Salary Match</span>
                    <span className="text-[11px] text-slate-600">{profile.bankMatch}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Court & Criminal Record Check</span>
                    <span className="text-[11px] text-slate-600">{profile.courtScreen}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Dual-Employment & Moonlighting</span>
                    <span className="text-[11px] text-emerald-700 font-semibold">Clean — No Overlapping Jobs Detected</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  🔒 Cryptographically Certified
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md shadow-orange-600/25 cursor-pointer border border-orange-500"
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
        <div className="w-full max-w-[440px] h-[520px] rounded-3xl dark-glass-card border-2 border-amber-300/80 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-2xl bg-white/95 relative overflow-hidden group">
          {/* Laser Scanning Line */}
          {isScanning && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_20px_#f59e0b] z-30 animate-laser-vertical"></div>
          )}

          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-orange-700 font-bold block">
                  3D BIOMETRIC SCAN ENGINE
                </span>
                <span className="text-xs font-black text-slate-900 font-outfit">
                  UIDAI / Aadhaar & Liveness HUD
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>LIVE HUD</span>
            </span>
          </div>

          {/* Center 3D Graphic Canvas */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-200 bg-slate-950 my-auto shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
            <img
              src="/assets/3d/hero_3d_verification.jpg"
              alt="3D Biometric Verification Card"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Holographic HUD Overlays */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/60 font-mono text-[9px] text-amber-300 font-bold flex items-center gap-1.5 shadow-lg">
              <Camera className="w-3 h-3 text-amber-400" />
              <span>Face Liveness Match: {profile.biometricScore}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/60 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-lg">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>UIDAI Checksum Valid</span>
            </div>
          </div>

          {/* Bottom Telemetry Bar & Fast Scanner */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between relative z-10">
            <div>
              <span className="font-mono text-[10px] text-slate-500 font-bold block">TARGET PROFILE</span>
              <h5 className="font-bold text-xs text-slate-900 font-outfit">{profile.name} — {profile.title}</h5>
            </div>

            <button
              onClick={handleTriggerScan}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md shadow-orange-600/25 cursor-pointer border border-orange-500"
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
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-600/30 border border-orange-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap className={`w-3.5 h-3.5 text-white ${isScanning ? 'animate-bounce' : ''}`} />
          <span>{isScanning ? 'Verifying Details...' : 'Test Verification Check'}</span>
        </button>

        {activeStageMode === 'pass' && (
          <button
            onClick={handleFlip}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-orange-50 border-2 border-orange-600 text-orange-700 hover:text-orange-800 text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCw className="w-3.5 h-3.5 text-orange-600" />
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
