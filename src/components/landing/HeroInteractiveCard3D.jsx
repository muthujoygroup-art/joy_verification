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
  FileCheck
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
    avatarBg: 'from-amber-600 via-orange-600 to-rose-700'
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
    avatarBg: 'from-emerald-600 to-teal-800'
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
    avatarBg: 'from-rose-600 to-amber-700'
  }
];

const HeroInteractiveCard3D = () => {
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
      
      {/* Profile Selector Chips */}
      <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl dark-glass-card border border-slate-200 max-w-md w-full shadow-sm">
        {CANDIDATE_PROFILES.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleSelectProfile(idx)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedIdx === idx
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black shadow-md shadow-amber-500/25 border border-amber-400 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="truncate">{p.roleLabel}</span>
          </button>
        ))}
      </div>

      {/* 3D Perspective Card Container */}
      <div
        className="w-full max-w-[440px] h-[520px] [perspective:1400px] cursor-pointer select-none relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={cardRef}
      >
        <div
          className="w-full h-full relative transition-transform duration-300 ease-out [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg) scale3d(1.02, 1.02, 1.02)`
          }}
        >
          {/* ===============================================================
           * FRONT FACE OF VERIFIED EMPLOYEE PASS
           * =============================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl dark-glass-card border-2 border-amber-300/80 p-6 sm:p-7 flex flex-col justify-between shadow-xl backdrop-blur-2xl overflow-hidden [backface-visibility:hidden] bg-white/95"
            style={{
              boxShadow: `0 20px 45px -10px rgba(245, 158, 11, 0.25), 0 4px 15px rgba(15, 23, 42, 0.05)`
            }}
          >
            {/* Dynamic Holographic Foil Specular Sheen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30 z-10 transition-opacity"
              style={{
                background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(254,240,138,0.5) 0%, rgba(245,158,11,0.2) 25%, rgba(244,63,94,0.1) 50%, transparent 75%)`
              }}
            />

            {/* Scanning Laser Beam Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#f59e0b] z-20 animate-laser-vertical"></div>
            )}

            {/* Top Bar: Company & Verification Status */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white font-black shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-700 font-bold block">
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
              {/* Avatar Photo Frame */}
              <div className="relative w-20 h-20 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-md shrink-0">
                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${profile.avatarBg} flex items-center justify-center text-white text-2xl font-black font-outfit relative overflow-hidden`}>
                  <span>{profile.initials}</span>
                  <div className="absolute bottom-1 right-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 drop-shadow" />
                  </div>
                </div>

                {/* Accent Corners */}
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-amber-500"></span>
                <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-amber-500"></span>
                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-amber-500"></span>
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-amber-500"></span>
              </div>

              {/* Candidate Metadata */}
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-900 font-outfit leading-snug">
                  {profile.name}
                </h3>
                <p className="text-amber-700 text-xs font-semibold leading-tight mt-0.5">
                  {profile.title}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">
                    ID: {profile.candidateId}
                  </span>
                  <span className="text-emerald-600 font-bold">
                    ✓ 100% Authentic
                  </span>
                </div>
              </div>
            </div>

            {/* Clear Verification Badges */}
            <div className="grid grid-cols-2 gap-2.5 my-2 relative z-10">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] uppercase text-slate-500 block font-bold">Photo & Face Match</span>
                  <span className="text-xs font-bold text-slate-900">100% Genuine</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
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
                  <QrCode className="w-full h-full" />
                </div>
                <div className="text-[10px] font-mono leading-tight">
                  <span className="font-bold text-slate-800 block">QR Gate Pass</span>
                  <span className="text-emerald-600 font-semibold">Ready to Scan</span>
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
                <span>View Details</span>
              </button>
            </div>

          </div>

          {/* ===============================================================
           * BACK FACE OF VERIFIED PASS (Verification Breakdown)
           * =============================================================== */}
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

            {/* Checkpoints List - Clear B2B Benefits */}
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
                🔒 Verified & Tamper-Proof
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer border border-amber-400"
              >
                <RotateCw className="w-3.5 h-3.5 text-white" />
                <span>View Front Badge</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Micro Controls */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleTriggerScan}
          disabled={isScanning}
          className="px-4 py-2 rounded-xl dark-glass-card border border-amber-500/20 hover:border-amber-400 text-amber-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Zap className={`w-3.5 h-3.5 text-amber-400 ${isScanning ? 'animate-bounce' : ''}`} />
          <span>{isScanning ? 'Verifying Details...' : 'Test Verification Check'}</span>
        </button>

        <button
          onClick={handleFlip}
          className="px-4 py-2 rounded-xl dark-glass-card border border-orange-500/20 hover:border-orange-400 text-orange-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <RotateCw className="w-3.5 h-3.5 text-orange-400" />
          <span>{isFlipped ? 'Show Front' : 'View Full Breakdown'}</span>
        </button>
      </div>

      <span className="text-xs text-slate-400 mt-2.5">
        Move your mouse over the card to explore the interactive 3D badge.
      </span>

    </div>
  );
};

export default HeroInteractiveCard3D;
