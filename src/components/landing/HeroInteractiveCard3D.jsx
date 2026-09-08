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
    accentColor: 'from-cyan-500 via-blue-500 to-indigo-500',
    badgeGlow: 'rgba(56, 189, 248, 0.4)',
    tenure: '7 Years Experience • 3 Employers Verified',
    bankMatch: 'State Bank of India — Deepak Sharma (100% Match)',
    courtScreen: 'Clean — 0 Judicial Proceedings Found',
    avatarBg: 'from-cyan-600 to-blue-700'
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
    accentColor: 'from-emerald-400 via-teal-500 to-cyan-600',
    badgeGlow: 'rgba(52, 211, 153, 0.4)',
    tenure: '11 Years Experience • Form XVI Compliant',
    bankMatch: 'HDFC Bank — Kavita Nair (100% Match)',
    courtScreen: 'Clean — All Civil & Criminal Tribunals Clear',
    avatarBg: 'from-emerald-600 to-teal-700'
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
    accentColor: 'from-indigo-400 via-purple-500 to-pink-500',
    badgeGlow: 'rgba(168, 85, 247, 0.4)',
    tenure: '9 Years Experience • Dual-Employment Screened',
    bankMatch: 'ICICI Bank — Rajesh Verma (100% Match)',
    courtScreen: 'Clean — Zero Public Registry Flags',
    avatarBg: 'from-purple-600 to-indigo-700'
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
      <div className="flex items-center justify-center gap-2 mb-6 p-1.5 rounded-2xl dark-glass-card border border-white/15 max-w-md w-full">
        {CANDIDATE_PROFILES.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => handleSelectProfile(idx)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedIdx === idx
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg border border-cyan-400/50 scale-[1.02]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="truncate">{p.roleLabel}</span>
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
            className="absolute inset-0 w-full h-full rounded-3xl dark-glass-card border-2 border-white/25 p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-2xl overflow-hidden [backface-visibility:hidden]"
            style={{
              boxShadow: `0 25px 50px -12px ${profile.badgeGlow}, 0 0 40px rgba(56, 189, 248, 0.15)`
            }}
          >
            {/* Dynamic Holographic Foil Specular Sheen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-35 z-10 transition-opacity"
              style={{
                background: `radial-gradient(circle at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255,255,255,0.4) 0%, rgba(56,189,248,0.2) 25%, rgba(168,85,247,0.15) 50%, transparent 75%)`
              }}
            />

            {/* Scanning Laser Beam Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] z-20 animate-laser-vertical"></div>
            )}

            {/* Top Bar: Hologram Emblem & Organization */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/40">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-300 font-bold block">
                    JOY TRUEPROFILE • PASSPORT
                  </span>
                  <h4 className="font-outfit font-black text-sm text-white tracking-tight">
                    {profile.company}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/50 text-emerald-400 font-mono text-[9px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{profile.status}</span>
              </div>
            </div>

            {/* Candidate Center Hero Card */}
            <div className="flex items-center gap-4 my-auto relative z-10">
              {/* Avatar Photo Frame with Biometric Landmarks */}
              <div className="relative w-20 h-20 rounded-2xl p-1 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-xl shrink-0">
                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${profile.avatarBg} flex items-center justify-center text-white text-2xl font-black font-outfit relative overflow-hidden`}>
                  <span>{profile.initials}</span>

                  {/* Biometric Scan Grid Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]"></div>
                  <div className="absolute bottom-1 right-1">
                    <Fingerprint className="w-3.5 h-3.5 text-cyan-300 opacity-80" />
                  </div>
                </div>

                {/* Corner Target Reticles */}
                <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></span>
                <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></span>
                <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></span>
                <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></span>
              </div>

              {/* Candidate Metadata */}
              <div className="flex-1">
                <h3 className="text-xl font-black text-white font-outfit leading-snug">
                  {profile.name}
                </h3>
                <p className="text-cyan-300 text-xs font-semibold leading-tight mt-0.5">
                  {profile.title}
                </p>
                <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-slate-300">
                  <span className="bg-white/10 px-2 py-0.5 rounded border border-white/15 text-slate-200">
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
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Liveness Match</span>
                  <span className="text-xs font-bold text-white">99.8% Confirmed</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Pipeline TAT</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">{profile.tat} Sub-Second</span>
                </div>
              </div>
            </div>

            {/* Bottom Section: QR Code & Security Hash Bar */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center text-slate-950 shadow-md">
                  <QrCode className="w-full h-full" />
                </div>
                <div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                    SECURE QR BADGE
                  </span>
                  <span className="text-[11px] font-mono font-bold text-white">
                    DPDP ACT MASKED
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
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
            className="absolute inset-0 w-full h-full rounded-3xl dark-glass-card border-2 border-cyan-400/40 p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{
              boxShadow: `0 25px 50px -12px ${profile.badgeGlow}`
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-300 font-bold block">
                    CRYPTOGRAPHIC AUDIT SEAL
                  </span>
                  <h4 className="font-outfit font-black text-sm text-white">
                    SHA-256 Verification Trail
                  </h4>
                </div>
              </div>

              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                IMMUTABLE
              </span>
            </div>

            {/* Cryptographic Hash Stream */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-3 font-mono text-[10px] text-slate-300 my-auto">
              <span className="text-cyan-400 text-[9px] uppercase tracking-wider block font-bold mb-1">
                // CRYPTOGRAPHIC SHA-256 SIGNATURE
              </span>
              <p className="text-emerald-400 font-mono break-all font-semibold leading-relaxed">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>

            {/* Checkpoints List */}
            <div className="flex flex-col gap-2 my-auto text-xs">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Tenure & Career History</span>
                  <span className="text-[11px] text-slate-300">{profile.tenure}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Bank Account Match</span>
                  <span className="text-[11px] text-slate-300">{profile.bankMatch}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Judicial Registry Cross-Check</span>
                  <span className="text-[11px] text-slate-300">{profile.courtScreen}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">
                🔒 256-bit AES Stamped
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-bold font-mono text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>View ID Front</span>
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
          className="px-4 py-2 rounded-xl dark-glass-card border border-white/20 hover:border-cyan-400 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <Zap className={`w-3.5 h-3.5 text-cyan-400 ${isScanning ? 'animate-bounce' : ''}`} />
          <span>{isScanning ? 'Scanning Biometrics...' : 'Simulate Laser Re-Scan'}</span>
        </button>

        <button
          onClick={handleFlip}
          className="px-4 py-2 rounded-xl dark-glass-card border border-white/20 hover:border-indigo-400 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
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
