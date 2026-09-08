import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Scale, 
  CreditCard, 
  QrCode, 
  FileCheck, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Eye,
  RefreshCw,
  Code
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const ORBIT_MODULES = [
  {
    id: 'identity',
    title: 'Digital Identity & Facial Liveness',
    badge: 'CORE MODULE 01',
    icon: ShieldCheck,
    color: 'from-amber-500 via-orange-500 to-rose-500',
    accentColor: '#F59E0B',
    tat: '0.34s',
    accuracy: '99.98%',
    compliance: 'DPDP Act 2023 Masked',
    summary: 'Direct digital verification cross-referencing candidate identity documents with AI-powered 3D live selfie depth validation.',
    features: [
      'Sub-second document cryptographic signature check',
      '3D face mesh liveness & anti-spoofing detection',
      'Real-time name matching & fuzzy tolerance score',
      'Zero physical paperwork required'
    ],
    payloadSample: {
      check_type: 'IDENTITY_LIVENESS_3D',
      status: 'VERIFIED',
      latency_ms: 340,
      liveness_score: 0.998,
      name_match_confidence: 1.0,
      dpdp_token: 'DPDP_TOKEN_9A2F81C'
    }
  },
  {
    id: 'moonlighting',
    title: 'Dual-Employment & Tenure Radar',
    badge: 'CORE MODULE 02',
    icon: Search,
    color: 'from-orange-500 via-rose-500 to-amber-600',
    accentColor: '#FB923C',
    tat: '0.42s',
    accuracy: '100% Deterministic',
    compliance: 'Dual-Employment Defense',
    summary: 'Analyzes career service histories and active contribution timelines to detect undeclared secondary jobs, moonlighting, and overlapping tenures.',
    features: [
      'Chronological tenure mapping across past employers',
      'Zero-tamper employment verification',
      'Concurrent contribution stream conflict detection',
      'Ghost worker & fictitious contractor elimination'
    ],
    payloadSample: {
      check_type: 'DUAL_EMPLOYMENT_RADAR',
      status: 'NO_OVERLAPS_DETECTED',
      concurrent_tenures: 0,
      tenure_history_years: 7.2,
      risk_rating: 'ZERO_RISK',
      audit_ready: true
    }
  },
  {
    id: 'court',
    title: 'National Judicial & Court Screening',
    badge: 'CORE MODULE 03',
    icon: Scale,
    color: 'from-rose-500 via-pink-600 to-amber-500',
    accentColor: '#F43F5E',
    tat: '0.45s',
    accuracy: 'Multi-Tribunal Coverage',
    compliance: 'High-Trust Clearance',
    summary: 'Real-time background scanning across national judicial registries, commercial tribunals, district courts, and public litigation databases.',
    features: [
      'Fuzzy phonetic matching across state & central courts',
      'Parentage & address secondary validation cross-check',
      'Commercial tribunal & dispute history verification',
      'Automated adverse record flagging'
    ],
    payloadSample: {
      check_type: 'JUDICIAL_LITIGATION_SCREEN',
      status: 'CLEARED',
      tribunals_checked: 48,
      adverse_proceedings_found: 0,
      jurisdiction_scope: 'NATIONAL_INDIA'
    }
  },
  {
    id: 'bank',
    title: 'Direct Bank & Name Validation',
    badge: 'CORE MODULE 04',
    icon: CreditCard,
    color: 'from-amber-400 via-amber-500 to-orange-500',
    accentColor: '#FBBF24',
    tat: '0.28s',
    accuracy: '100% Direct Verification',
    compliance: 'Zero Payroll Leakage',
    summary: 'Performs instant automated penny-drop validation to confirm active bank account status and verify candidate name exact matching before payroll onboarding.',
    features: [
      'Instant active account status check',
      'Exact beneficiary name validation vs ID documents',
      'Eliminates salary disbursement bounce-backs',
      'Seamless integration with enterprise payroll systems'
    ],
    payloadSample: {
      check_type: 'DIRECT_BANK_VALIDATION',
      status: 'ACCOUNT_ACTIVE_MATCH',
      bank_name: 'HDFC BANK',
      name_match: 'EXACT_MATCH',
      response_time_ms: 280
    }
  },
  {
    id: 'gatepass',
    title: 'Workforce Digital QR Passes',
    badge: 'CORE MODULE 05',
    icon: QrCode,
    color: 'from-emerald-500 via-teal-500 to-amber-500',
    accentColor: '#10B981',
    tat: '0.25s',
    accuracy: 'Turnstile Integrated',
    compliance: 'Factory & Facility Ready',
    summary: 'Instant generation of encrypted, time-stamped digital QR credentials engineered for sub-second scanning at industrial security turnstiles and plant gates.',
    features: [
      'Sub-second turnstile response time',
      'Time-bounded validity with dynamic rotation option',
      'Zero hardware lock-in — compatible with all barcode scanners',
      'Real-time facility access logging and muster roll'
    ],
    payloadSample: {
      check_type: 'DIGITAL_QR_GATE_PASS',
      status: 'PASS_ACTIVE',
      turnstile_tat_s: 0.25,
      encryption: 'AES_256_GCM',
      access_tier: 'PLANT_FLOOR_ACCESS'
    }
  },
  {
    id: 'dossier',
    title: 'Audit-Ready Profile Dossiers',
    badge: 'CORE MODULE 06',
    icon: FileCheck,
    color: 'from-amber-500 via-rose-500 to-orange-500',
    accentColor: '#F59E0B',
    tat: '0.38s',
    accuracy: 'SHA-256 Stamped',
    compliance: 'DPDP Act 2023 Masked',
    summary: 'Automatically compiles downloadable PDF compliance dossiers stamped with cryptographic SHA-256 verification hashes for zero-notice regulatory audits.',
    features: [
      'Cryptographically sealed PDF audit dossiers',
      'Fully masked identity attributes complying with DPDP Act 2023',
      'Tamper-evident verification certificate issuance',
      'One-click export for internal and government audits'
    ],
    payloadSample: {
      check_type: 'COMPREHENSIVE_DOSSIER_GEN',
      status: 'DOSSIER_COMPILED',
      sha256_hash: '8f9a2b...c41e8',
      dpdp_compliant: true,
      export_formats: ['PDF', 'JSON', 'API']
    }
  }
];

const VerificationCommandOrbit = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showJson, setShowJson] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeModule = ORBIT_MODULES[activeIdx];

  const handleSelectModule = (idx) => {
    soundEngine.playClick();
    setActiveIdx(idx);
  };

  const handleRunModuleTest = () => {
    soundEngine.playScan();
    setIsSimulating(true);
    setTimeout(() => {
      soundEngine.playSuccess();
      setIsSimulating(false);
    }, 1400);
  };

  return (
    <div className="w-full">
      
      {/* Interactive Command Cockpit Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Orbital Command Wheel Selector (lg:col-span-5) */}
        <div className="lg:col-span-5 dark-glass-card border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Section Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>RADIAL VERIFICATION ENGINE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
              Verification Modules
            </h3>
            <p className="text-slate-300 text-xs mt-1">
              Select any core engine to view cryptographic telemetry, performance benchmarks, and live JSON payload inspector.
            </p>
          </div>

          {/* List of 6 Interactive Module Buttons */}
          <div className="flex flex-col gap-2.5">
            {ORBIT_MODULES.map((mod, idx) => {
              const Icon = mod.icon;
              const isSelected = activeIdx === idx;
              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModule(idx)}
                  className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-950/70 via-orange-950/60 to-slate-900 border-amber-400/80 text-white shadow-lg ring-1 ring-amber-400/50 scale-[1.02]'
                      : 'bg-slate-900/40 border-amber-500/10 text-slate-300 hover:border-amber-500/30 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? `bg-gradient-to-br ${mod.color} text-slate-950 font-black shadow-md shadow-amber-500/30`
                          : 'bg-white/10 text-amber-300 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white font-outfit leading-snug">
                        {mod.title}
                      </h4>
                      <span className="font-mono text-[10px] text-amber-300/90 block mt-0.5 font-semibold">
                        {mod.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[10px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                      {mod.tat}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Engine Status Indicator */}
          <div className="mt-6 pt-4 border-t border-amber-500/15 flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All 6 Modules Online
            </span>
            <span className="text-amber-200/80">Sub-Second Response Guarantee</span>
          </div>

        </div>

        {/* Right: Live Telemetry & Inspector Panel (lg:col-span-7) */}
        <div className="lg:col-span-7 dark-glass-card border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          <div>
            {/* Active Module Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/15 pb-5 mb-6">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeModule.color} flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30`}>
                  <activeModule.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300 font-bold block">
                    {activeModule.badge}
                  </span>
                  <h3 className="text-2xl font-black text-white font-outfit">
                    {activeModule.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowJson(!showJson)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono font-bold text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showJson ? 'Visual Specs' : 'JSON Payload'}</span>
                </button>

                <button
                  onClick={handleRunModuleTest}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black font-mono text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Testing Pipeline...' : 'Test Module'}</span>
                </button>
              </div>
            </div>

            {/* Main Content: Specs vs JSON */}
            {showJson ? (
              <div className="bg-black/70 border border-amber-500/20 rounded-2xl p-5 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between text-amber-300/80 text-[10px] uppercase mb-2 border-b border-amber-500/20 pb-1 font-bold">
                  <span>// REST API PAYLOAD RESPONSE</span>
                  <span className="text-emerald-400">HTTP 200 OK</span>
                </div>
                <pre>{JSON.stringify(activeModule.payloadSample, null, 2)}</pre>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                
                {/* Description */}
                <p className="text-slate-200 text-sm leading-relaxed">
                  {activeModule.summary}
                </p>

                {/* 3 Metric Badges */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900/60 border border-amber-500/15 p-3.5 rounded-xl">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                      Response Latency
                    </span>
                    <div className="text-xl font-black text-amber-300 font-outfit mt-0.5">
                      {activeModule.tat}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-amber-500/15 p-3.5 rounded-xl">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                      Verification Standard
                    </span>
                    <div className="text-xl font-black text-emerald-400 font-outfit mt-0.5">
                      {activeModule.accuracy}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-amber-500/15 p-3.5 rounded-xl">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                      Statutory Policy
                    </span>
                    <div className="text-sm font-bold text-orange-300 font-outfit mt-1 truncate">
                      {activeModule.compliance}
                    </div>
                  </div>
                </div>

                {/* Key Architectural Features */}
                <div>
                  <h5 className="font-mono text-xs uppercase tracking-wider text-amber-200 font-bold mb-3">
                    Key Engine Capabilities
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModule.features.map((feat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-amber-500/15 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-200 font-medium leading-relaxed">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Bottom Action Strip */}
          <div className="mt-8 pt-4 border-t border-amber-500/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-200/90">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>AES-256 Encrypted • DPDP Compliant</span>
            </div>

            <a
              href="#interactive-lab"
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Run Live Simulation Lab</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};

export default VerificationCommandOrbit;
