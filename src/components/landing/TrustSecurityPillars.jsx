import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  Scale, 
  CheckCircle2, 
  Key, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  Database,
  Building,
  Check
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const TrustSecurityPillars = ({ onOpenLegalHandbook, onOpenDemo }) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background Glow Mesh */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Eyebrow & Master Headline */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ZERO-TRUST SOVEREIGN SECURITY ARCHITECTURE</span>
        </div>
        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight text-white leading-tight">
          Every Profile. Every Document. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Every Connection. With Confidence.
          </span>
        </h3>
        <p className="text-slate-300 text-xs sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
          JOY TrueProfile adheres strictly to Indian statutory mandates, the Digital Personal Data Protection (DPDP) Act 2023, and global enterprise encryption standards.
        </p>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 mb-12">
        
        {/* Pillar 1: DPDP Act 2023 */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-5 group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
              STATUTORY LAW
            </span>
            <h4 className="text-lg font-black font-outfit text-white group-hover:text-emerald-300 transition-colors">
              DPDP Act 2023 Compliant
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% explicit candidate consent recorded via OTP audit trail. Automated Aadhaar masking ensures zero unredacted storage of national identity numbers.
            </p>
          </div>
          <div className="text-[11px] font-mono text-emerald-400 font-bold pt-3 border-t border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Consent Architecture
          </div>
        </div>

        {/* Pillar 2: 256-Bit AES Encryption */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between gap-5 group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-400 font-bold block">
              CRYPTOGRAPHY
            </span>
            <h4 className="text-lg font-black font-outfit text-white group-hover:text-indigo-300 transition-colors">
              Bank-Grade 256-Bit AES
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              End-to-end TLS 1.3 data in transit and AES-256 encrypted at rest. Zero plaintext exposure of sensitive verification payloads across all servers.
            </p>
          </div>
          <div className="text-[11px] font-mono text-indigo-400 font-bold pt-3 border-t border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Audit Ledger
          </div>
        </div>

        {/* Pillar 3: Certified PDF Reports */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between gap-5 group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-purple-400 font-bold block">
              AUDIT DOSSIERS
            </span>
            <h4 className="text-lg font-black font-outfit text-white group-hover:text-purple-300 transition-colors">
              Tamper-Proof Dossiers
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each completed check generates a certified PDF with a cryptographic hash signature, verifiable digital timestamp, and scannable employee QR badge.
            </p>
          </div>
          <div className="text-[11px] font-mono text-purple-400 font-bold pt-3 border-t border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click Certified PDF
          </div>
        </div>

        {/* Pillar 4: 100% Postpaid Assurance */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between gap-5 group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Key className="w-6 h-6" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-teal-400 font-bold block">
              COMMERCIAL INTEGRITY
            </span>
            <h4 className="text-lg font-black font-outfit text-white group-hover:text-teal-300 transition-colors">
              100% Postpaid & Metered
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent per-profile pricing with official GST tax invoices generated automatically via Razorpay. Never blocked during critical hiring drives.
            </p>
          </div>
          <div className="text-[11px] font-mono text-teal-400 font-bold pt-3 border-t border-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Zero Upfront Lock-In
          </div>
        </div>

      </div>

      {/* Trust Bottom Action Bar */}
      <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-slate-300">
            Sovereign Indian Cloud Infrastructure • ISO 27001 & SOC-2 Audited
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              if (onOpenLegalHandbook) onOpenLegalHandbook();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Compliance Handbook</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              if (onOpenDemo) onOpenDemo();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white text-xs font-black shadow-md hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5"
          >
            <span>Book Security Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default TrustSecurityPillars;
