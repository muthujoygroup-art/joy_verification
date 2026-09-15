import React, { useState } from 'react';
import { 
  Fingerprint, 
  Search, 
  CreditCard, 
  HardHat, 
  Scale, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Camera, 
  Lock, 
  FileText, 
  Check,
  Building2,
  RefreshCw
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const AsymmetricFeatureGrid = ({ onOpenDemo }) => {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (id) => {
    soundEngine.playClick();
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="w-full space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>STATUTORY VERIFICATION RAIL SUITE</span>
        </div>
        <h3 className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit tracking-tight">
          Engineered for Precision. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-emerald-600 font-black">
            Built for Enterprise Speed.
          </span>
        </h3>
        <p className="text-slate-600 text-sm sm:text-base font-medium">
          Comprehensive zero-trust screening modules designed for factory floors, corporate tech hubs, and high-trust leadership roles.
        </p>
      </div>

      {/* Asymmetric Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* CARD 1: Aadhaar e-KYC & 3D Biometric Liveness (Large 8-col) */}
        <div 
          onClick={() => handleCardClick('liveness')}
          className="md:col-span-12 lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white border border-purple-500/40 shadow-xl hover:border-purple-400 transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between gap-6"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300">
                <Fingerprint className="w-7 h-7" />
              </div>
              <span className="font-mono text-[10px] uppercase font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                UIDAI & 3D AI ACTIVE
              </span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-black font-outfit text-white group-hover:text-purple-200 transition-colors">
              Aadhaar e-KYC & 3D Biometric Face Liveness
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-medium">
              Direct OTP validation with automatic Aadhaar number masking. The candidate captures a quick selfie via web browser — our 3D anti-spoofing AI matches their live face against their official government photo in real time.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Match Confidence</span>
                <span className="text-base font-black text-emerald-400 font-outfit mt-0.5 block">99.98% Precision</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Aadhaar Privacy</span>
                <span className="text-base font-black text-purple-300 font-outfit mt-0.5 block">Auto Redacted</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Spoof Detection</span>
                <span className="text-base font-black text-cyan-300 font-outfit mt-0.5 block">3D Depth AI</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 relative z-10 text-xs font-mono">
            <span className="text-slate-400">Zero mobile app installation required</span>
            <span className="text-purple-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Experience Flow →
            </span>
          </div>
        </div>

        {/* CARD 2: EPFO UAN Moonlighting Radar (Medium 4-col) */}
        <div 
          onClick={() => handleCardClick('epfo')}
          className="md:col-span-6 lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-amber-200 shadow-md hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200">
                <Search className="w-6 h-6" />
              </div>
              <span className="badge badge-amber text-[10px] font-black uppercase tracking-wider">
                EPFO UAN AUDIT
              </span>
            </div>

            <h4 className="text-xl font-black text-slate-900 font-outfit group-hover:text-amber-700 transition-colors">
              EPFO Moonlighting & Dual Employment Radar
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Detect active provident fund contributions across multiple employer IDs. Cross-references Form 26AS data to identify undeclared secondary jobs.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 font-medium pt-1">
              <li className="flex items-center gap-2 text-amber-900 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Overlap Date Audit</li>
              <li className="flex items-center gap-2 text-slate-800 font-bold"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Relieving Date Verification</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Sub-Second UAN Check</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 3: Instant ₹1 Bank Penny Drop (Medium 4-col) */}
        <div 
          onClick={() => handleCardClick('bank')}
          className="md:col-span-6 lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-emerald-200 shadow-md hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="badge badge-emerald text-[10px] font-black uppercase tracking-wider">
                IMPS / NPCI
              </span>
            </div>

            <h4 className="text-xl font-black text-slate-900 font-outfit group-hover:text-emerald-700 transition-colors">
              Instant ₹1 Bank Account Penny Drop
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Validates beneficiary account status directly against recipient bank records in real time. Confirms candidate name match with zero payroll payment bounces.
            </p>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-mono font-bold text-emerald-900">
              <span>BENEFICIARY MATCH</span>
              <span className="text-emerald-700">100% Name Confirm ✓</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Instant IMPS Rails</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 4: Workforce QR Gate Passes & Turnstiles (Large 8-col) */}
        <div 
          onClick={() => handleCardClick('turnstile')}
          className="md:col-span-12 lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl hover:border-indigo-400 transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between gap-6"
        >
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
                <HardHat className="w-7 h-7" />
              </div>
              <span className="font-mono text-[10px] uppercase font-black px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CLRA FORM XVI COMPLIANCE
              </span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-black font-outfit text-white group-hover:text-indigo-200 transition-colors">
              Workforce QR Gate Passes & Facility Turnstiles
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-medium">
              Instant digital employee gate badges for factory turnstiles, logistics hubs, and construction project sites. Automatically prevents ghost worker billing and maintains permanent audit records for labor law compliance.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Gate Scan Latency</span>
                <span className="text-base font-black text-amber-400 font-outfit mt-0.5 block">&lt;0.5 Seconds</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ghost Payroll Blocked</span>
                <span className="text-base font-black text-emerald-400 font-outfit mt-0.5 block">100% Unverified Block</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Turnstile Sync</span>
                <span className="text-base font-black text-cyan-300 font-outfit mt-0.5 block">Sub-Second QR</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 relative z-10 text-xs font-mono">
            <span className="text-slate-400">Scannable with any mobile phone camera or industrial turnstile</span>
            <span className="text-indigo-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Turnstile Simulator →
            </span>
          </div>
        </div>

        {/* CARD 5: Pan-India Court & Criminal Background Records (Medium 6-col) */}
        <div 
          onClick={() => handleCardClick('court')}
          className="md:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-slate-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200">
                <Scale className="w-6 h-6" />
              </div>
              <span className="badge badge-purple text-[10px] font-black uppercase tracking-wider">
                E-COURTS & TRIBUNALS
              </span>
            </div>

            <h4 className="text-xl font-black text-slate-900 font-outfit group-hover:text-purple-700 transition-colors">
              Pan-India Court & Criminal Record Search
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Real-time query across civil, criminal, and commercial tribunals across 3,500+ district and high courts in India with intelligent fuzzy name matching.
            </p>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs font-mono font-bold text-purple-950">
              <span>COVERAGE</span>
              <span className="text-purple-700">3,500+ Indian Courts ✓</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-purple-700">
            <span>Zero Manual Court Chasing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 6: 100% Postpaid Transparent Metered Billing (Medium 6-col) */}
        <div 
          onClick={() => handleCardClick('billing')}
          className="md:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-teal-200 shadow-md hover:border-teal-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-teal-100 text-teal-700 border border-teal-200">
                <Zap className="w-6 h-6" />
              </div>
              <span className="badge badge-teal text-[10px] font-black uppercase tracking-wider">
                100% POSTPAID MODEL
              </span>
            </div>

            <h4 className="text-xl font-black text-slate-900 font-outfit group-hover:text-teal-700 transition-colors">
              100% Postpaid Transparent Metered Billing
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Never get locked out mid-hiring sprint. Verify now, settle monthly with official Razorpay GST invoices. Zero upfront lock-ins or mandatory long-term retainers.
            </p>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs font-mono font-bold text-teal-950">
              <span>GST INVOICES</span>
              <span className="text-teal-700">Automated Tax Receipts ✓</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>Pay Only For What You Verify</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AsymmetricFeatureGrid;
