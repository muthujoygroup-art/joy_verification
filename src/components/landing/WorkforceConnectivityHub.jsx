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

const ECOSYSTEM_NODES = [
  {
    id: 'company',
    name: 'Enterprise / Company Admin',
    roleTag: 'GOVERNANCE & QUOTAS',
    icon: Building2,
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    cardBorder: 'border-indigo-500',
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
    id: 'hr',
    name: 'HR Recruiter Workstation',
    roleTag: 'CANDIDATE PIPELINE',
    icon: UserCheck,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    cardBorder: 'border-emerald-500',
    summary: 'High-speed recruiter cockpit for sending single & batch verification invites via WhatsApp/SMS and downloading tamper-proof 360° audit dossiers.',
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
    name: 'Candidate / Contract Labor',
    roleTag: 'MOBILE SELF-VERIFICATION',
    icon: Smartphone,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    cardBorder: 'border-amber-500',
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
    name: 'Facility Gate & Turnstile',
    roleTag: 'PLANT ACCESS CONTROL',
    icon: HardHat,
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    cardBorder: 'border-cyan-500',
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

export const WorkforceConnectivityHub = () => {
  const [selectedNodeId, setSelectedNodeId] = useState('hr');

  const handleSelectNode = (nodeId) => {
    soundEngine.playClick();
    setSelectedNodeId(nodeId);
  };

  const activeNode = ECOSYSTEM_NODES.find(n => n.id === selectedNodeId) || ECOSYSTEM_NODES[0];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-100/60 via-purple-100/50 to-emerald-100/60 blur-[120px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-black uppercase tracking-wider mb-3">
          <Share2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>REAL-TIME CONNECTED WORKFORCE MESH</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-slate-900 font-outfit tracking-tight">
          Workforce Connectivity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600">Ecosystem</span>
        </h3>
        <p className="text-slate-600 text-xs sm:text-base mt-2 font-medium">
          See how Enterprise Admins, HR Teams, Onboarding Workers, and Facility Gates collaborate seamlessly over one high-speed verification engine.
        </p>
      </div>

      {/* Interactive Ecosystem Map: 4 Nodes + Central Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Interactive Node Grid (4 Stakeholder Cards) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ECOSYSTEM_NODES.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const NodeIcon = node.icon;
            return (
              <button
                key={node.id}
                onClick={() => handleSelectNode(node.id)}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-4 group ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                    : 'bg-slate-50/90 hover:bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${
                    isSelected ? 'bg-white/20 text-white border border-white/30' : 'bg-white text-indigo-600 border border-slate-200 shadow-2xs'
                  }`}>
                    <NodeIcon className="w-5 h-5" />
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${
                    isSelected ? 'bg-white/20 text-white border-white/30' : node.badgeColor
                  }`}>
                    {node.roleTag}
                  </span>
                </div>

                <div>
                  <h4 className={`text-sm sm:text-base font-black font-outfit line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {node.name}
                  </h4>
                  <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {node.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 text-[11px] font-bold">
                  <span className={isSelected ? 'text-white' : 'text-indigo-600'}>
                    {isSelected ? '● Active Inspection' : 'Inspect Role →'}
                  </span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Node Deep Dive & Live Telemetry Inspector */}
        <div className="lg:col-span-6 bg-white text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-600 font-bold">INSPECTING ROLE</span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit">{activeNode.name}</h4>
                </div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1.5">
                <Activity className="w-3 h-3 animate-pulse" /> LIVE STREAM
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              {activeNode.summary}
            </p>

            {/* Core Capabilities Checklist */}
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                CORE VERIFICATION CAPABILITIES
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeNode.capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug text-[11px] font-medium">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time KPI Metric Pills */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {Object.entries(activeNode.liveMetrics).map(([k, v], mIdx) => (
                <div key={mIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block truncate">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-emerald-700 font-outfit mt-1 block truncate">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>JOY Zero-Trust Core 2.0</span>
            </span>
            <span className="text-emerald-700 font-bold">256-Bit Encrypted Mesh ✓</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkforceConnectivityHub;
