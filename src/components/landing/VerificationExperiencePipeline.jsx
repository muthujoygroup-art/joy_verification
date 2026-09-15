import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Fingerprint, 
  FileCheck2, 
  Network, 
  ShieldCheck, 
  Play, 
  Pause, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Lock, 
  QrCode, 
  Building2, 
  Smartphone,
  Eye
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const PIPELINE_STAGES = [
  {
    step: '01',
    id: 'create-profile',
    title: 'Create Profile',
    subtitle: '1-Click Invite or Excel Bulk Import',
    icon: UserPlus,
    badge: 'STAGE 1 • DISPATCH',
    color: 'from-purple-600 to-indigo-600',
    lightBg: 'bg-purple-50 border-purple-200 text-purple-700',
    description: 'HR initiates single or batch screening in seconds. Candidates receive an encrypted magic link via WhatsApp, SMS, or Email with zero app installation required.',
    details: [
      { label: 'Bulk Engine', value: '500+ candidates imported in 10s via Excel' },
      { label: 'Channels', value: 'Instant WhatsApp, SMS & Email dispatch' },
      { label: 'Security Gate', value: '4-Digit PIN candidate access authorization' },
      { label: 'Candidate TAT', value: '<45s average link open time' }
    ],
    telemetry: {
      status: 'INVITE_DISPATCHED',
      method: 'MULTI_CHANNEL_MAGIC_LINK',
      channel: 'WHATSAPP_SMS_GATEWAY',
      pin_protected: true,
      expiry: '24_HOURS'
    }
  },
  {
    step: '02',
    id: 'verify-identity',
    title: 'Verify Identity',
    subtitle: 'Aadhaar e-KYC & 3D Face Liveness',
    icon: Fingerprint,
    badge: 'STAGE 2 • BIOMETRICS',
    color: 'from-indigo-600 to-cyan-600',
    lightBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    description: 'Direct UIDAI OTP Aadhaar verification and PAN NSDL checksum match paired with browser-based 3D AI biometric camera liveness scan to stop fake profiles.',
    details: [
      { label: 'e-KYC Source', value: 'Direct UIDAI OTP with Aadhaar masking' },
      { label: 'PAN Validation', value: 'Instant NSDL tax database checksum' },
      { label: '3D Face AI', value: 'Camera liveness scan & anti-spoofing' },
      { label: 'Match Confidence', value: '99.98% Biometric precision score' }
    ],
    telemetry: {
      status: 'IDENTITY_CONFIRMED',
      aadhaar_masked: 'XXXX-XXXX-8921',
      pan_status: 'NSDL_VALIDATED_ACTIVE',
      face_liveness: 'PASSED (0.998 MATCH)',
      spoof_detected: false
    }
  },
  {
    step: '03',
    id: 'validate-documents',
    title: 'Validate Documents',
    subtitle: 'Bank Penny Drop, EPFO & Legal',
    icon: FileCheck2,
    badge: 'STAGE 3 • CROSS-CHECK',
    color: 'from-cyan-600 to-emerald-600',
    lightBg: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    description: 'Instant ₹1 penny drop IMPS bank validation, EPFO UAN service history check for secondary moonlighting jobs, and pan-India civil & criminal court record scan.',
    details: [
      { label: 'Bank Validation', value: 'Instant ₹1 IMPS beneficiary name match' },
      { label: 'EPFO Moonlighting', value: 'Full service history overlap audit' },
      { label: 'Driving License', value: 'Instant Parivahan DL validity check' },
      { label: 'Court Records', value: 'Pan-India tribunals & police records' }
    ],
    telemetry: {
      status: 'DOCUMENTS_VERIFIED',
      bank_penny_drop: 'IMPS_NAME_MATCH_100%',
      epfo_overlaps: 0,
      court_cases: '0_RECORDS_FOUND_CLEAN',
      dl_verified: 'COMMERCIAL_HEAVY_ACTIVE'
    }
  },
  {
    step: '04',
    id: 'connect-workforce',
    title: 'Connect Workforce',
    subtitle: 'Multi-Role Enterprise Ecosystem',
    icon: Network,
    badge: 'STAGE 4 • INTEGRATION',
    color: 'from-emerald-600 to-teal-600',
    lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    description: 'Verified worker credentials automatically sync across Company Admin quotas, HR recruiter pipelines, and facility turnstile gate security controllers.',
    details: [
      { label: 'Quota Ledger', value: 'Prepaid metered credits deducted automatically' },
      { label: 'HR Workspace', value: 'Live 360° candidate dossier inspection' },
      { label: 'Gate Turnstile', value: 'Sub-second access badge generated' },
      { label: 'Enterprise Sync', value: 'Multi-tenant department allocation' }
    ],
    telemetry: {
      status: 'WORKFORCE_CONNECTED',
      assigned_company: 'COMP001',
      hr_recruiter: 'COMP001HR001',
      turnstile_zone: 'FACILITY_GATE_NORTH_A',
      sync_latency_ms: 180
    }
  },
  {
    step: '05',
    id: 'build-records',
    title: 'Build Trusted Records',
    subtitle: 'DPDP Vault, Certified PDF & QR Pass',
    icon: ShieldCheck,
    badge: 'STAGE 5 • CERTIFICATION',
    color: 'from-purple-700 via-indigo-700 to-emerald-600',
    lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    description: 'Generates tamper-proof certified audit dossier PDFs with verifiable hash signatures and digital scannable QR gate passes stored in a 256-bit AES encrypted vault.',
    details: [
      { label: 'Certified Dossier', value: 'Tamper-proof official PDF with hash seal' },
      { label: 'Digital Gate Pass', value: 'Scannable QR badge for plant entry' },
      { label: 'DPDP 2023 Law', value: 'Permanent encrypted immutable audit trail' },
      { label: 'Postpaid Ledger', value: 'GST invoice generated automatically' }
    ],
    telemetry: {
      status: 'DOSSIER_CERTIFIED_ACTIVE',
      dossier_id: 'JOY-CERT-2026-99214',
      qr_pass_id: 'QR-PASS-GATE-8819',
      vault_encryption: 'AES_256_GCM',
      dpdp_compliant: true
    }
  }
];

export const VerificationExperiencePipeline = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveIdx((prev) => {
          const next = (prev + 1) % PIPELINE_STAGES.length;
          soundEngine.playClick();
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleSelectStep = (index) => {
    soundEngine.playClick();
    setActiveIdx(index);
  };

  const currentStage = PIPELINE_STAGES[activeIdx];
  const Icon = currentStage.icon;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header with Title & Auto-Play Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>THE 5-STAGE VERIFICATION JOURNEY</span>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-outfit tracking-tight">
            From Raw Documents to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-emerald-600">Verified Confidence</span>
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            Explore the end-to-end statutory verification workflow that protects your company, streamlines candidate onboarding, and issues instant digital workforce passes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs border ${
              isPlaying
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto-Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-purple-600" />
                <span>Auto-Play Tour</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stage Step Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-8 relative z-10">
        {PIPELINE_STAGES.map((stg, idx) => {
          const isSelected = activeIdx === idx;
          const StgIcon = stg.icon;
          return (
            <button
              key={stg.id}
              onClick={() => handleSelectStep(idx)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white border-purple-500 shadow-lg scale-[1.02]'
                  : 'bg-slate-50/80 hover:bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40' : 'bg-slate-200 text-slate-600'
                }`}>
                  {stg.step}
                </span>
                <StgIcon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
              </div>

              <div>
                <h4 className={`text-xs sm:text-sm font-black font-outfit line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {stg.title}
                </h4>
                <p className={`text-[10px] sm:text-[11px] font-medium line-clamp-1 mt-0.5 ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
                  {stg.subtitle}
                </p>
              </div>

              {isSelected && (
                <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        
        {/* Left Card: Stage Overview & Key Deliverables */}
        <div className="lg:col-span-7 bg-slate-50/90 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className={`text-[11px] font-black uppercase tracking-wider font-mono px-3 py-1 rounded-full border ${currentStage.lightBg}`}>
                {currentStage.badge}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                Step {currentStage.step} of 05
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${currentStage.color} text-white shadow-md shrink-0`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit">
                  {currentStage.title}
                </h4>
                <p className="text-xs sm:text-sm font-semibold text-purple-700 mt-0.5">
                  {currentStage.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {currentStage.description}
            </p>

            {/* Spec Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentStage.details.map((item, dIdx) => (
                <div key={dIdx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">{item.label}</span>
                    <span className="text-xs font-bold text-slate-800 leading-snug block mt-0.5">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => handleSelectStep((activeIdx - 1 + PIPELINE_STAGES.length) % PIPELINE_STAGES.length)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer shadow-2xs"
            >
              ← Previous Step
            </button>

            <button
              onClick={() => handleSelectStep((activeIdx + 1) % PIPELINE_STAGES.length)}
              className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: {PIPELINE_STAGES[(activeIdx + 1) % PIPELINE_STAGES.length].title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Card: Live Visual Telemetry Console */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5 text-white shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] uppercase font-black tracking-wider text-emerald-400">
                  REAL-TIME RAIL TELEMETRY
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">LATENCY &lt; 200ms</span>
            </div>

            {/* Stage-specific Visual Simulation Widget */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono font-bold">NODE STATUS</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                  {currentStage.telemetry.status}
                </span>
              </div>

              {/* JSON Payload Stream */}
              <div className="font-mono text-[11px] text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 overflow-x-auto">
                <div className="text-purple-400 font-bold">// Verification Payload Stream</div>
                {Object.entries(currentStage.telemetry).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="text-slate-400">"{k}":</span>
                    <span className={typeof v === 'boolean' ? 'text-amber-400' : 'text-emerald-300'}>
                      {typeof v === 'boolean' ? String(v) : `"${v}"`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-3.5 rounded-xl flex items-center gap-3">
            <Lock className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-[11px] text-purple-200 font-sans font-medium leading-relaxed">
              Every step is protected with 256-bit AES cryptographic encryption & full DPDP Act 2023 compliance.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerificationExperiencePipeline;
