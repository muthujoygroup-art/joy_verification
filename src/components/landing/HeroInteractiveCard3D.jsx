import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  QrCode, 
  Lock, 
  Fingerprint, 
  Layers, 
  RotateCw,
  Cpu,
  Activity,
  Award,
  Zap,
  Check
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const CANDIDATE_PROFILES = [
  {
    id: 'tech',
    roleLabel: 'Software & IT Lead',
    name: 'Deepak Sharma',
    title: 'Lead Cloud Infrastructure Architect',
    company: 'Apex Cloud Systems Pvt Ltd',
    candidateId: 'TP-2026-8941',
    tat: '0.38s',
    riskScore: '0.00%',
    status: 'CLEARED & VERIFIED',
    initials: 'DS',
    accentColor: 'from-amber-400 via-orange-500 to-rose-500',
    badgeGlow: 'rgba(245, 158, 11, 0.45)',
    tenure: '7 Years Experience • 3 Employers Verified',
    bankMatch: 'State Bank of India — Deepak Sharma (100% Match)',
    courtScreen: 'Clean — 0 Judicial Proceedings Found',
    avatarBg: 'from-amber-600 via-orange-600 to-rose-700'
  },
  {
    id: 'plant',
    roleLabel: 'Industrial Plant Lead',
    name: 'Kavita Nair',
    title: 'Senior Operations & Safety Manager',
    company: 'Sterling Bharat Manufacturing',
    candidateId: 'TP-2026-5120',
    tat: '0.41s',
    riskScore: '0.00%',
    status: 'CLEARED & VERIFIED',
    initials: 'KN',
    accentColor: 'from-emerald-400 via-teal-500 to-amber-500',
    badgeGlow: 'rgba(16, 185, 129, 0.45)',
    tenure: '11 Years Experience • Form XVI Compliant',
    bankMatch: 'HDFC Bank — Kavita Nair (100% Match)',
    courtScreen: 'Clean — All Civil & Criminal Tribunals Clear',
    avatarBg: 'from-emerald-600 to-teal-800'
  },
  {
    id: 'fleet',
    roleLabel: 'Supply Chain Captain',
    name: 'Rajesh Verma',
    title: 'National Logistics Fleet Director',
    company: 'TransIndia Freight Logistics',
    candidateId: 'TP-2026-3398',
    tat: '0.34s',
    riskScore: '0.00%',
    status: 'CLEARED & VERIFIED',
    initials: 'RV',
    accentColor: 'from-orange-400 via-rose-500 to-amber-500',
    badgeGlow: 'rgba(244, 63, 94, 0.45)',
    tenure: '9 Years Experience • Dual-Employment Screened',
    bankMatch: 'ICICI Bank — Rajesh Verma (100% Match)',
    courtScreen: 'Clean — Zero Public Registry Flags',
    avatarBg: 'from-rose-600 to-amber-700'
  }
];

const HeroInteractiveCard3D = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanLaserPos, setScanLaserPos] = useState(0);
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
    }, 1800);
  };

  const handleSelectProfile = (idx) => {
    soundEngine.playClick();
    setSelectedIdx(idx);
    handleTriggerScan();
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Profile Selector Chips */}
      <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl dark-glass-card border border-amber-500/20 max-w-md w-full">
        {CANDIDATE_PROFILES.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleSelectProfile(idx)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedIdx === idx
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black shadow-lg shadow-amber-500/30 border border-amber-300/60 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
            <span className="truncate drop-shadow-xs">{p.roleLabel}</span>
          </button>
        ))}
      </div>

      {/* 3D Perspective Card Container */}
      <div
        className="w-full max-w-[440px] h-[540px] [perspective:1400px] cursor-pointer select-none relative"
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
           * FRONT FACE OF 3D ID PASSPORT
           * =============================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl dark-glass-card border-2 border-amber-500/30 p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-2xl overflow-hidden [backface-visibility:hidden]"
            style={{
              boxShadow: `0 25px 50px -12px ${profile.badgeGlow}, 0 0 40px rgba(245, 158, 11, 0.15)`
            }}
          >
            {/* Dynamic Holographic Foil Specular Sheen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 z-10 transition-opacity"
              style={{
                background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(254,240,138,0.4) 0%, rgba(245,158,11,0.25) 25%, rgba(244,63,94,0.18) 50%, transparent 75%)`
              }}
            />

            {/* Scanning Laser Beam Animation (Warm Amber) */}
            {isScanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] z-20 animate-laser-vertical"></div>
            )}

            {/* Top Bar: Hologram Emblem & Organization */}
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/40">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300 font-bold block">
                    JOY TRUEPROFILE • PASSPORT
                  </span>
                  <h4 className="font-outfit font-black text-sm text-white tracking-tight">
                    {profile.company}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-950/90 px-2.5 py-1 rounded-full border border-emerald-500/50 text-emerald-400 font-mono text-[9px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{profile.status}</span>
              </div>
            </div>

            {/* Candidate Center Hero Card */}
            <div className="flex items-center gap-4 my-auto relative z-10">
              {/* Avatar Photo Frame with Biometric Landmarks */}
              <div className="relative w-20 h-20 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-xl shrink-0">
                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${profile.avatarBg} flex items-center justify-center text-white text-2xl font-black font-outfit relative overflow-hidden`}>
                  <span>{profile.initials}</span>

                  {/* Biometric Scan Grid Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]"></div>
                  <div className="absolute bottom-1 right-1">
                    <Fingerprint className="w-3.5 h-3.5 text-amber-200 opacity-85" />
                  </div>
                </div>

                {/* Corner Target Reticles */}
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-amber-400"></span>
                <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-amber-400"></span>
                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-amber-400"></span>
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-amber-400"></span>
              </div>

              {/* Candidate Metadata */}
              <div className="flex-1">
                <h3 className="text-xl font-black text-white font-outfit leading-snug">
                  {profile.name}
                </h3>
                <p className="text-amber-300 text-xs font-semibold leading-tight mt-0.5">
                  {profile.title}
                </p>
                <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-slate-300">
                  <span className="bg-white/10 px-2 py-0.5 rounded border border-amber-500/20 text-slate-200">
                    ID: {profile.candidateId}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Risk: {profile.riskScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Verification Badges Matrix */}
            <div className="grid grid-cols-2 gap-2.5 my-2 relative z-10">
              <div className="bg-slate-900/60 border border-amber-500/15 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Liveness Match</span>
                  <span className="text-xs font-bold text-white">99.8% Confirmed</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-amber-500/15 p-2.5 rounded-xl flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Pipeline TAT</span>
                  <span className="text-xs font-bold text-amber-300 font-mono">{profile.tat} Sub-Second</span>
                </div>
              </div>
            </div>

            {/* Bottom Section: QR Code & Security Hash Bar */}
            <div className="border-t border-amber-500/15 pt-3 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 p-1 flex items-center justify-center text-slate-950 shadow-md">
                  <QrCode className="w-full h-full" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                    SECURE QR BADGE
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-200">
                    DPDP ACT MASKED
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold font-mono text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Audit Seal</span>
              </button>
            </div>

          </div>

          {/* ===============================================================
           * BACK FACE OF 3D ID PASSPORT (Cryptographic SHA-256 Seal)
           * =============================================================== */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl dark-glass-card border-2 border-amber-500/40 p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{
              boxShadow: `0 25px 50px -12px ${profile.badgeGlow}`
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-500/15 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300 font-bold block">
                    CRYPTOGRAPHIC AUDIT SEAL
                  </span>
                  <h4 className="font-outfit font-black text-sm text-white">
                    SHA-256 Verification Trail
                  </h4>
                </div>
              </div>

              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                IMMUTABLE
              </span>
            </div>

            {/* Cryptographic Hash Stream */}
            <div className="bg-black/60 border border-amber-500/20 rounded-xl p-3 font-mono text-[10px] text-slate-300 my-auto">
              <span className="text-amber-400 text-[9px] uppercase tracking-wider block font-bold mb-1">
                // CRYPTOGRAPHIC SHA-256 SIGNATURE
              </span>
              <p className="text-emerald-400 font-mono break-all font-semibold leading-relaxed">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>

            {/* Checkpoints List */}
            <div className="flex flex-col gap-2 my-auto text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-amber-500/15 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Tenure & Career History</span>
                  <span className="text-[11px] text-slate-300">{profile.tenure}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-amber-500/15 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Bank Account Match</span>
                  <span className="text-[11px] text-slate-300">{profile.bankMatch}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/60 border border-amber-500/15 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Judicial Registry Cross-Check</span>
                  <span className="text-[11px] text-slate-300">{profile.courtScreen}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-amber-500/15 pt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                🔒 256-bit AES Stamped
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-xs font-black font-mono text-white flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/25 cursor-pointer border border-amber-300/40"
              >
                <RotateCw className="w-3.5 h-3.5 text-white" />
                <span className="drop-shadow-xs">View ID Front</span>
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
          className="px-4 py-2 rounded-xl dark-glass-card border border-amber-500/20 hover:border-amber-400 text-amber-200 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Zap className={`w-3.5 h-3.5 text-amber-400 ${isScanning ? 'animate-bounce' : ''}`} />
          <span>{isScanning ? 'Scanning Biometrics...' : 'Simulate Laser Re-Scan'}</span>
        </button>

        <button
          onClick={handleFlip}
          className="px-4 py-2 rounded-xl dark-glass-card border border-orange-500/20 hover:border-orange-400 text-orange-200 font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <RotateCw className="w-3.5 h-3.5 text-orange-400" />
          <span>{isFlipped ? 'Show Front' : 'Flip to Audit Trail'}</span>
        </button>
      </div>

      <span className="font-mono text-[10px] text-slate-400 mt-2.5">
        💡 Move your cursor over the card to explore real-time 3D parallax & holographic sheen.
      </span>

    </div>
  );
};

export default HeroInteractiveCard3D;
