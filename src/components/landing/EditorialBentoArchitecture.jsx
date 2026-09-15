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
  RefreshCw,
  QrCode,
  Activity
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const EditorialBentoArchitecture = ({ onOpenDemo }) => {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (id) => {
    soundEngine.playClick();
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div className="w-full space-y-12">
      {/* Editorial Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>STATUTORY VERIFICATION CAPABILITIES</span>
          </div>
          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black font-outfit uppercase tracking-tight text-white leading-none">
            Asymmetric Defense. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Autonomous Speed.
            </span>
          </h3>
        </div>

        <p className="text-slate-400 text-xs sm:text-base max-w-md font-medium leading-relaxed">
          Bespoke screening infrastructure purpose-built for Indian statutory labor compliance, high-volume factory gates, and enterprise corporate hiring.
        </p>
      </div>

      {/* Asymmetric Bento Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* CARD 1: Aadhaar e-KYC & 3D AI Biometric Face Liveness (Monumental 8-col) */}
        <div 
          onClick={() => handleCardClick('liveness')}
          className="md:col-span-12 lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0B0F1C] via-[#0E1528] to-[#080B13] border border-slate-800 hover:border-emerald-500/60 shadow-2xl transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between gap-8"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Fingerprint className="w-8 h-8" />
              </div>
              <span className="font-mono text-[10px] uppercase font-black px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                UIDAI OTP & 3D AI ACTIVE
              </span>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-2">01. IDENTITY & BIOMETRIC MESH</span>
              <h4 className="text-2xl sm:text-4xl font-black font-outfit uppercase tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                Aadhaar e-KYC & 3D Face Anti-Spoofing
              </h4>
            </div>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Direct UIDAI OTP verification coupled with automated Aadhaar number redaction. Candidates capture a live camera selfie — our 3D computer vision mesh performs anti-spoofing and matches facial landmarks against official government records in real time.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Biometric Match</span>
                <span className="text-base sm:text-lg font-black font-outfit text-emerald-400 mt-1 block">99.98% Precision</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">National ID Privacy</span>
                <span className="text-base sm:text-lg font-black font-outfit text-white mt-1 block">100% Masked</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Liveness Detection</span>
                <span className="text-base sm:text-lg font-black font-outfit text-cyan-400 mt-1 block">3D Depth AI</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-800 relative z-10 text-xs font-mono">
            <span className="text-slate-400">Zero mobile app download required</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              EXPLORE BIOMETRIC ENGINE →
            </span>
          </div>
        </div>

        {/* CARD 2: EPFO Moonlighting & Dual Employment Radar (4-col) */}
        <div 
          onClick={() => handleCardClick('epfo')}
          className="md:col-span-6 lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#090D18] border border-slate-800 hover:border-amber-500/60 shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Search className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                EPFO UAN AUDIT
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold block mb-1">02. MOONLIGHTING DEFENSE</span>
              <h4 className="text-xl sm:text-2xl font-black font-outfit uppercase tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Dual Employment & UAN Overlap Radar
              </h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Cross-references active provident fund contributions across multiple employer IDs to uncover undeclared secondary jobs before employment contracts are executed.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>Contribution Overlaps</span>
                <span className="text-emerald-400 font-bold">0 Detected ✓</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Relieving Date Audit</span>
                <span className="text-amber-400 font-bold">Confirmed ✓</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-amber-400">
            <span>UAN Sub-Second Audit</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 3: Instant ₹1 Bank Penny Drop (4-col) */}
        <div 
          onClick={() => handleCardClick('bank')}
          className="md:col-span-6 lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#090D18] border border-slate-800 hover:border-cyan-500/60 shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                IMPS / NPCI
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-bold block mb-1">03. BANK VALIDATION</span>
              <h4 className="text-xl sm:text-2xl font-black font-outfit uppercase tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Instant ₹1 Bank Penny Drop IMPS
              </h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Direct NPCI/IMPS integration checks beneficiary account status with the recipient bank, confirming 100% account name match to eliminate payroll failures.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">BENEFICIARY NAME</span>
              <span className="text-emerald-400 font-bold">100% Match ✓</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
            <span>Instant Banking Rails</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 4: Workforce QR Gate Passes & Plant Turnstiles (Monumental 8-col) */}
        <div 
          onClick={() => handleCardClick('turnstile')}
          className="md:col-span-12 lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0D1120] via-[#090D18] to-[#060810] border border-slate-800 hover:border-amber-500/60 shadow-2xl transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between gap-8"
        >
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <HardHat className="w-8 h-8" />
              </div>
              <span className="font-mono text-[10px] uppercase font-black px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                CLRA FORM XVI COMPLIANCE
              </span>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">04. PHYSICAL WORKFORCE SECURITY</span>
              <h4 className="text-2xl sm:text-4xl font-black font-outfit uppercase tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Workforce QR Gate Passes & Turnstiles
              </h4>
            </div>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Instant digital employee gate passes for factory turnstiles, logistics hubs, and construction project sites. Automatically prevents ghost worker billing and maintains permanent audit records for labor law compliance.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Gate Scan Latency</span>
                <span className="text-base sm:text-lg font-black font-outfit text-amber-400 mt-1 block">&lt;0.50 Seconds</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ghost Payroll Block</span>
                <span className="text-base sm:text-lg font-black font-outfit text-emerald-400 mt-1 block">100% Unverified Block</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Turnstile Sync</span>
                <span className="text-base sm:text-lg font-black font-outfit text-cyan-400 mt-1 block">Sub-Second QR</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-800 relative z-10 text-xs font-mono">
            <span className="text-slate-400">Scannable with any mobile camera or industrial turnstile</span>
            <span className="text-amber-400 font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              LAUNCH TURNSTILE LAB →
            </span>
          </div>
        </div>

        {/* CARD 5: Pan-India Court & Criminal Records (6-col) */}
        <div 
          onClick={() => handleCardClick('court')}
          className="md:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#090D18] border border-slate-800 hover:border-purple-500/60 shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Scale className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
                E-COURTS & TRIBUNALS
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-1">05. LEGAL LITIGATION AUDIT</span>
              <h4 className="text-xl sm:text-2xl font-black font-outfit uppercase tracking-tight text-white group-hover:text-purple-300 transition-colors">
                Pan-India Court & Criminal Records
              </h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Comprehensive real-time queries across civil, criminal, and commercial tribunals in 3,500+ district and high courts across India with intelligent fuzzy name matching.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">TRIBUNAL COVERAGE</span>
              <span className="text-purple-400 font-bold">3,500+ Indian Courts ✓</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-purple-400">
            <span>Zero Manual Court Chasing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 6: 100% Postpaid Transparent Metered Billing (6-col) */}
        <div 
          onClick={() => handleCardClick('billing')}
          className="md:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#090D18] border border-slate-800 hover:border-teal-500/60 shadow-xl transition-all cursor-pointer flex flex-col justify-between gap-6 group"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <Zap className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/20">
                100% POSTPAID MODEL
              </span>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400 font-bold block mb-1">06. COMMERCIAL INTEGRITY</span>
              <h4 className="text-xl sm:text-2xl font-black font-outfit uppercase tracking-tight text-white group-hover:text-teal-300 transition-colors">
                100% Postpaid & Metered Transparency
              </h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Never get locked out mid-hiring sprint. Verify now, settle monthly with official Razorpay GST invoices. Zero upfront lock-ins or mandatory long-term retainers.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">TAX INVOICES</span>
              <span className="text-teal-400 font-bold">Automated 18% GST Receipts ✓</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-teal-400">
            <span>Pay Only For What You Verify</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditorialBentoArchitecture;
