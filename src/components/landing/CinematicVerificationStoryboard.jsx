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
  Eye,
  Activity,
  Layers,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const STORY_CHAPTERS = [
  {
    chapter: '01',
    id: 'intake',
    tag: 'CHAPTER I • MULTI-CHANNEL INTAKE',
    headline: 'Initiate Screening at Massive Enterprise Scale',
    subheadline: 'Upload 500+ candidate rosters in 10 seconds or dispatch instantaneous magic links via WhatsApp, SMS, and Email.',
    colorGradient: 'from-amber-400 via-orange-500 to-rose-500',
    accentBorder: 'border-amber-500/50',
    accentBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    metrics: [
      { label: 'Bulk Intake Speed', value: '500 Profiles / 10s' },
      { label: 'Candidate TAT to Open', value: '<45 Seconds' },
      { label: 'App Downloads Required', value: 'Zero (Web Link)' },
      { label: 'PIN Authentication', value: '4-Digit OTP Gate' }
    ],
    liveInspector: {
      action: 'EXCEL_BATCH_PROCESSED',
      candidates_queued: 540,
      dispatch_channels: ['WHATSAPP_CLOUD_API', 'SMS_GATEWAY_INDIA', 'CORP_EMAIL'],
      encryption: 'TLS_1.3_ENCRYPTED_LINK',
      auth_security: '4_DIGIT_CANDIDATE_PIN'
    }
  },
  {
    chapter: '02',
    id: 'biometrics',
    tag: 'CHAPTER II • BIOMETRIC & IDENTITY SOVEREIGNTY',
    headline: 'Direct UIDAI Aadhaar e-KYC with 3D Face Anti-Spoofing',
    subheadline: 'Eliminate ghost workers and synthetic identities through direct UIDAI OTP authentication and browser-based 3D depth camera liveness matching.',
    colorGradient: 'from-emerald-400 via-teal-400 to-cyan-500',
    accentBorder: 'border-emerald-500/50',
    accentBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    metrics: [
      { label: 'Biometric Face Match', value: '99.98% Precision' },
      { label: 'e-KYC Source', value: 'Direct UIDAI OTP' },
      { label: 'Aadhaar Redaction', value: '100% Auto-Masked' },
      { label: 'Anti-Spoofing Depth', value: '3D AI Camera Mesh' }
    ],
    liveInspector: {
      action: 'UIDAI_OTP_VERIFIED',
      aadhaar_number: 'XXXX-XXXX-9941 (MASKED)',
      face_liveness_score: '0.9984 (PASSED)',
      anti_spoof_check: 'PHYSICAL_HUMAN_CONFIRMED',
      dpdp_compliance: 'EXPLICIT_OTP_CONSENT_LOGGED'
    }
  },
  {
    chapter: '03',
    id: 'crosscheck',
    tag: 'CHAPTER III • DEEP STATUTORY RAILS',
    headline: 'EPFO Moonlighting Radar, Bank Penny Drops & Court Records',
    subheadline: 'Automatically detect undisclosed dual-employment through EPFO service overlap audits, validate bank accounts via ₹1 IMPS, and search 3,500+ Indian courts in parallel.',
    colorGradient: 'from-cyan-400 via-indigo-500 to-purple-600',
    accentBorder: 'border-cyan-500/50',
    accentBadge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    metrics: [
      { label: 'Moonlighting Audits', value: 'EPFO UAN Scanned' },
      { label: 'Bank Name Match', value: '100% Instant IMPS' },
      { label: 'Court Record Scope', value: '3,500+ Courts & Tribunals' },
      { label: 'Driving License Check', value: 'Commercial DL Valid' }
    ],
    liveInspector: {
      action: 'STATUTORY_CROSS_CHECK_CLEARED',
      epfo_overlapping_tenures: 0,
      bank_penny_drop_status: 'BENEFICIARY_NAME_CONFIRMED',
      court_proceedings_found: '0_RECORDS_CLEAN',
      tax_form_26as_audit: 'SINGLE_ACTIVE_STREAM'
    }
  },
  {
    chapter: '04',
    id: 'issuance',
    tag: 'CHAPTER IV • WORKFORCE ACCESS ISSUANCE',
    headline: 'Sub-Second Turnstile QR Gate Passes & Tamper-Proof Dossiers',
    subheadline: 'Issue instant digital QR badges for factory security gates and download cryptographically signed, audit-ready PDF compliance dossiers.',
    colorGradient: 'from-purple-400 via-pink-500 to-amber-400',
    accentBorder: 'border-purple-500/50',
    accentBadge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    metrics: [
      { label: 'Turnstile Scan Latency', value: '<0.50 Seconds' },
      { label: 'Statutory Labor Roll', value: 'CLRA Form XVI Ready' },
      { label: 'Dossier Cryptography', value: 'SHA-256 Hash Seal' },
      { label: 'Postpaid Ledger', value: 'GST Invoicing Automated' }
    ],
    liveInspector: {
      action: 'DIGITAL_PASS_GENERATED',
      pass_id: 'QR-PASS-PLANT-99201',
      gate_access_level: 'FACILITY_FLOOR_ZONE_A',
      dossier_pdf_hash: '8f7a9d21b34c0e68e4',
      billing_ledger: '100%_POSTPAID_METERED'
    }
  }
];

export const CinematicVerificationStoryboard = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveIdx((prev) => {
          const next = (prev + 1) % STORY_CHAPTERS.length;
          soundEngine.playClick();
          return next;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleSelectChapter = (idx) => {
    soundEngine.playClick();
    setActiveIdx(idx);
  };

  const current = STORY_CHAPTERS[activeIdx];

  return (
    <div className="w-full bg-[#070A12] border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden text-white">
      {/* Chromatic ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/10 via-emerald-500/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Header with Title & Auto-Play Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-8 mb-10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>INTERACTIVE VERIFICATION STORYBOARD</span>
          </div>
          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit uppercase tracking-tight text-white leading-none">
            From Raw Documents <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400">
              To Verified Confidence
            </span>
          </h3>
          <p className="text-slate-400 text-xs sm:text-base mt-3 max-w-2xl font-medium">
            Explore each milestone of the autonomous workforce verification lifecycle that powers India's leading industrial and tech enterprises.
          </p>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${
            isPlaying
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE STORY TOUR</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span>AUTO-PLAY STORY TOUR</span>
            </>
          )}
        </button>
      </div>

      {/* Chapter Progress Scrubber Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10 relative z-10">
        {STORY_CHAPTERS.map((ch, idx) => {
          const isSelected = activeIdx === idx;
          return (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(idx)}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-3 group ${
                isSelected
                  ? 'bg-slate-900/90 border-amber-400/80 shadow-xl shadow-amber-500/10 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                  isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-500'
                }`}>
                  {ch.chapter}
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                  isSelected ? 'text-amber-400' : 'text-slate-500'
                }`}>
                  {isSelected ? 'ACTIVE CHAPTER' : 'EXPLORE'}
                </span>
              </div>

              <div>
                <h4 className={`text-xs sm:text-sm font-black font-outfit uppercase tracking-wide line-clamp-1 ${
                  isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                }`}>
                  {ch.headline.split(' ').slice(0, 4).join(' ')}...
                </h4>
              </div>

              {isSelected && (
                <div className="w-full h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Chapter Narrative & Live Inspector Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Narrative Panel */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <span className={`font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${current.accentBadge}`}>
              {current.tag}
            </span>

            <h4 className="text-2xl sm:text-4xl font-black font-outfit uppercase tracking-tight text-white leading-tight">
              {current.headline}
            </h4>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-sans font-normal">
              {current.subheadline}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              {current.metrics.map((m, mIdx) => (
                <div key={mIdx} className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-bold">{m.label}</span>
                  <span className="text-sm sm:text-base font-black font-outfit text-white mt-1 block">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-slate-800 flex items-center justify-between gap-4">
            <button
              onClick={() => handleSelectChapter((activeIdx - 1 + STORY_CHAPTERS.length) % STORY_CHAPTERS.length)}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 cursor-pointer"
            >
              ← PREVIOUS CHAPTER
            </button>

            <button
              onClick={() => handleSelectChapter((activeIdx + 1) % STORY_CHAPTERS.length)}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:opacity-95 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>NEXT: CHAPTER {STORY_CHAPTERS[(activeIdx + 1) % STORY_CHAPTERS.length].chapter}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Live Cryptographic Audit Inspector */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[11px] uppercase font-bold tracking-wider text-emerald-400">
                  AUDIT LOG INSPECTOR
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">HASH: SHA-256</span>
            </div>

            {/* Live Telemetry Code Block */}
            <div className="p-4 rounded-xl bg-[#050811] border border-slate-800 space-y-2.5 font-mono text-[11px]">
              <div className="text-amber-400 font-bold">// Verification Event Telemetry Stream</div>
              <div className="space-y-1.5 pt-1">
                {Object.entries(current.liveInspector).map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-3 text-[10px]">
                    <span className="text-slate-400 shrink-0">"{k}":</span>
                    <span className="text-emerald-300 font-bold text-right truncate">
                      {Array.isArray(v) ? `[${v.length} Channels]` : typeof v === 'number' ? v : `"${v}"`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Every verification event is written to an immutable 256-bit encrypted audit ledger.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CinematicVerificationStoryboard;
