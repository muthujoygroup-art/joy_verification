import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Smartphone, 
  ShieldCheck, 
  HardHat, 
  Sparkles, 
  Activity, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Share2, 
  Lock 
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const MESH_STAKEHOLDERS = [
  {
    id: 'enterprise',
    name: 'Enterprise Headquarters',
    roleTag: 'GOVERNANCE & AUDIT',
    icon: Building2,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    summary: 'Master enterprise portal allocating recruiter seats, managing postpaid wallet credits, and auditing monthly department verification spend.',
    capabilities: [
      'Multi-tenant seat provisioning (COMP001HR001 - HR010)',
      'Prepaid/Postpaid metered credit consumption tracking',
      'Automated Razorpay GST tax invoicing & transaction ledger',
      'Department-level hiring analytics & compliance audits'
    ],
    liveMetrics: {
      activeTenants: '150+ Enterprise Accounts',
      avgMonthlyChecks: '42,000 Verified Profiles',
      securityClearance: 'ISO 27001 Certified'
    }
  },
  {
    id: 'recruiter',
    name: 'HR Recruiter Cockpit',
    roleTag: 'CANDIDATE DISPATCH',
    icon: UserCheck,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    summary: 'High-speed recruiter workstation for sending single & batch verification invites via WhatsApp/SMS and downloading tamper-proof 360° audit dossiers.',
    capabilities: [
      'Excel Bulk Import: 500+ hires uploaded in 10 seconds',
      '1-Click WhatsApp & SMS magic link invite dispatch',
      'Real-time candidate verification status tracker',
      '1-Click Certified Dossier PDF & Gate Pass download'
    ],
    liveMetrics: {
      avgDispatchTime: '0.8 Seconds',
      candidateCompletion: '98.4% Onboarding Rate',
      hrTatReduction: '85% Less Manual Work'
    }
  },
  {
    id: 'candidate',
    name: 'Candidate / Mobile Workforce',
    roleTag: 'ZERO-APP SELF KYC',
    icon: Smartphone,
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    summary: 'Zero-app friction-free mobile web experience with 4-digit security PIN, direct UIDAI Aadhaar OTP, and 3D camera biometric face liveness check.',
    capabilities: [
      'Zero app downloads: runs instantly in any mobile browser',
      '4-Digit PIN gate protecting candidate personal data',
      'Direct UIDAI Aadhaar OTP with automated number masking',
      'AI 3D camera selfie liveness scan for anti-spoofing'
    ],
    liveMetrics: {
      avgVerificationTime: '1 Min 42 Seconds',
      faceMatchPrecision: '99.98% Accuracy',
      dropOffRate: '<1.6% Total Drop-Off'
    }
  },
  {
    id: 'gate',
    name: 'Industrial Facility Turnstiles',
    roleTag: 'PHYSICAL ACCESS CONTROL',
    icon: HardHat,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    summary: 'Sub-second QR gate pass scanner for factory turnstiles, logistics hubs, and construction project sites ensuring zero unverified labor entry.',
    capabilities: [
      'Instant digital QR employee gate passes generated',
      'Real-time turnstile sync for shift check-ins',
      'Statutory CLRA Form XVI audit compliance ledger',
      'Ghost worker & contractor billing leakage prevention'
    ],
    liveMetrics: {
      gateScanTat: '0.45 Seconds / Worker',
      preventedGhostLabor: '100% Non-Pass Block',
      turnstileUptime: '99.99% Reliability'
    }
  }
];

export const QuantumWorkforceMesh = () => {
  const [selectedId, setSelectedId] = useState('recruiter');

  const handleSelect = (id) => {
    soundEngine.playClick();
    setSelectedId(id);
  };

  const current = MESH_STAKEHOLDERS.find(s => s.id === selectedId) || MESH_STAKEHOLDERS[0];
  const CurrentIcon = current.icon;

  return (
    <div className="w-full bg-[#070A12] border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden text-white">
      {/* Background Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-8 mb-10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>QUANTUM WORKFORCE MESH</span>
          </div>
          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit uppercase tracking-tight text-white leading-none">
            Ecosystem <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400">
              Interconnectivity
            </span>
          </h3>
        </div>

        <p className="text-slate-400 text-xs sm:text-base max-w-md font-medium leading-relaxed">
          How Enterprise Admins, Recruiter Desks, Candidates, and Factory Gates operate on a single zero-trust verification rail.
        </p>
      </div>

      {/* 4 Node Grid + Deep Inspection Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Interactive Node Stack (4 Cards) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MESH_STAKEHOLDERS.map((node) => {
            const isSelected = selectedId === node.id;
            const NodeIcon = node.icon;
            return (
              <button
                key={node.id}
                onClick={() => handleSelect(node.id)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-4 group ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400/80 shadow-xl shadow-amber-500/10 scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    <NodeIcon className="w-5 h-5" />
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${node.badgeColor}`}>
                    {node.roleTag}
                  </span>
                </div>

                <div>
                  <h4 className={`text-sm sm:text-base font-black font-outfit uppercase tracking-wide line-clamp-1 ${
                    isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {node.name}
                  </h4>
                  <p className="text-[11px] mt-1 line-clamp-2 leading-relaxed text-slate-400">
                    {node.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono font-bold">
                  <span className={isSelected ? 'text-amber-400' : 'text-slate-500'}>
                    {isSelected ? '● ACTIVE NODE' : 'INSPECT NODE →'}
                  </span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Node Telemetry Console */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-2xl">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">NODE TELEMETRY</span>
                  <h4 className="text-xl sm:text-2xl font-black text-white font-outfit uppercase">{current.name}</h4>
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                <Activity className="w-3 h-3 animate-pulse" /> ONLINE
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {current.summary}
            </p>

            {/* Checklist */}
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                NODE CAPABILITIES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {current.capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="p-2.5 rounded-xl bg-[#090D18] border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug text-[11px]">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {Object.entries(current.liveMetrics).map(([k, v], mIdx) => (
                <div key={mIdx} className="p-3 rounded-xl bg-[#090D18] border border-slate-800 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block truncate">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-emerald-400 font-outfit mt-1 block truncate">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#090D18] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>JOY Zero-Trust Core 2.0</span>
            </span>
            <span className="text-emerald-400 font-bold">256-Bit Encrypted Mesh ✓</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuantumWorkforceMesh;
