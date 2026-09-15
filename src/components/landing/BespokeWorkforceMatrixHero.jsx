import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Zap, 
  CheckCircle2, 
  QrCode, 
  Activity, 
  Lock, 
  Cpu, 
  Scan, 
  Sparkles, 
  Building2, 
  HardHat, 
  Eye, 
  UserCheck, 
  Check, 
  RotateCw 
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const LIVE_PROFILES = [
  {
    id: 'candidate-01',
    role: 'Senior Cloud Architect',
    name: 'Vikramaditya Sengupta',
    company: 'Nexus Tech Global',
    status: 'CLEAN & VERIFIED',
    tat: '0.42s',
    aadhaarMasked: 'XXXX-XXXX-9941',
    panStatus: 'NSDL VALID',
    epfoStatus: '0 Moonlighting Overlaps',
    bankStatus: 'IMPS Penny Drop Matched',
    courtStatus: 'Zero Legal Proceedings',
    score: 99.98,
    badge: 'LEADERSHIP TIER 1',
    avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'candidate-02',
    role: 'EV Assembly Lead Specialist',
    name: 'Kavita Sundaram',
    company: 'Sterling Bharat Mobility',
    status: 'GATE PASS ACTIVE',
    tat: '0.38s',
    aadhaarMasked: 'XXXX-XXXX-5120',
    panStatus: 'NSDL VALID',
    epfoStatus: 'Single Service Record',
    bankStatus: 'IMPS Beneficiary 100%',
    courtStatus: 'Pan-India Clean Record',
    score: 99.95,
    badge: 'PLANT TURNSTILE #04',
    avatarImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'candidate-03',
    role: 'Logistics Fleet Controller',
    name: 'Rajeshwar Verma',
    company: 'TransIndia Freight Corridors',
    status: 'COMMERCIAL DL VALID',
    tat: '0.45s',
    aadhaarMasked: 'XXXX-XXXX-3389',
    panStatus: 'NSDL VALID',
    epfoStatus: 'No Dual Employment',
    bankStatus: 'Bank Account Verified',
    courtStatus: 'Clearance Approved',
    score: 99.92,
    badge: '3PL CORRIDOR WEST',
    avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  }
];

export const BespokeWorkforceMatrixHero = () => {
  const [profileIdx, setProfileIdx] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'biometric' | 'telemetry'
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const cardRef = useRef(null);

  const profile = LIVE_PROFILES[profileIdx];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      rx: -(y / (rect.height / 2)) * 8,
      ry: (x / (rect.width / 2)) * 8
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const handleSwitchProfile = (idx) => {
    soundEngine.playClick();
    setScanning(true);
    setProfileIdx(idx);
    setTimeout(() => {
      setScanning(false);
      soundEngine.playSuccess();
    }, 400);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-xl mx-auto transition-transform duration-200 ease-out"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
      }}
    >
      {/* Dynamic Chromatic Neon Glow Rings behind the console */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-30 animate-pulse pointer-events-none" />
      
      {/* Outer Obsidian Frame */}
      <div className="relative bg-[#090D16] border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl text-white backdrop-blur-2xl overflow-hidden">
        
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] uppercase font-bold tracking-widest text-emerald-400">
              ZERO-TRUST ENGINE 2.0
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>LATENCY: {profile.tat}</span>
          </div>
        </div>

        {/* Candidate Selector Switcher */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {LIVE_PROFILES.map((p, idx) => {
            const isSelected = profileIdx === idx;
            return (
              <button
                key={p.id}
                onClick={() => handleSwitchProfile(idx)}
                className={`py-2 px-2.5 rounded-xl text-left font-mono text-[10px] transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-amber-400/60 text-white font-bold shadow-xs'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="truncate font-bold">{p.name.split(' ')[0]}</div>
                <div className="text-[9px] text-slate-500 truncate">{p.role.split(' ')[0]}</div>
              </button>
            );
          })}
        </div>

        {/* Main Holographic Profile Card */}
        <div className="relative bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#070A12] border border-slate-800 rounded-2xl p-5 overflow-hidden shadow-inner">
          
          {/* Laser Scanning Line Animation */}
          {scanning && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-[0_0_15px_#22d3ee] z-20" />
          )}

          {/* Profile Header Row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 to-emerald-500/30 p-0.5 border border-amber-400/40">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden">
                    <img 
                      src={profile.avatarImg} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              </div>

              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {profile.badge}
                </span>
                <h4 className="text-base sm:text-lg font-black font-outfit text-white mt-1">
                  {profile.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {profile.role} • <span className="text-slate-300 font-semibold">{profile.company}</span>
                </p>
              </div>
            </div>

            {/* Precision Score Badge */}
            <div className="text-right">
              <span className="font-mono text-[9px] text-slate-400 block uppercase font-bold">TRUST SCORE</span>
              <span className="text-lg sm:text-xl font-black font-outfit text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {profile.score}%
              </span>
            </div>
          </div>

          {/* Verification Rail Checklist Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">Aadhaar OTP</span>
              <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {profile.aadhaarMasked}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">PAN Checksum</span>
              <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {profile.panStatus}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">EPFO Service</span>
              <span className="text-cyan-400 text-[11px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 0 Overlaps
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">Bank Penny Drop</span>
              <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Match
              </span>
            </div>
          </div>

          {/* Scannable Turnstile QR & Cryptographic Seal Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px]">256-Bit Cryptographic Hash Verified</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
              <QrCode className="w-3 h-3" />
              <span>QR PASS READY</span>
            </div>
          </div>

        </div>

        {/* Bottom Interactive Trigger Bar */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Scan className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>Interactive 3D Matrix — Hover to Tilt</span>
          </span>
          <button
            onClick={() => handleSwitchProfile((profileIdx + 1) % LIVE_PROFILES.length)}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Next Verification</span>
            <RotateCw className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BespokeWorkforceMatrixHero;
