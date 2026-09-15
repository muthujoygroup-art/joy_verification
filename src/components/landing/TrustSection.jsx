import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight,
  FileCheck2,
  Zap
} from 'lucide-react';

export const TrustSection = ({ onOpenLegalHandbook, onOpenDemo }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#EAF8F0] rounded-[36px] sm:rounded-[48px] px-6 sm:px-12 lg:px-16 overflow-hidden border border-[#E5EAF0]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: 3D Trust Shield Scene */}
        <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-4 sm:p-5 border border-[#E5EAF0] shadow-[0_20px_50px_rgba(24,34,48,0.06)]">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-tr from-[#EAF8F0] to-white">
              <img 
                src="/assets/3d/trust_security_shield.jpg" 
                alt="Joy True Profile Trust & Security 3D Shield" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#5C6878] px-2">
              <span className="font-semibold text-[#182230]">Sovereign Cloud & 256-Bit AES Vault</span>
              <span className="text-[#299C68] font-bold bg-[#EAF8F0] px-2.5 py-1 rounded-full">
                DPDP 2023 Compliant ✓
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative & Trust Pillars */}
        <div className="lg:col-span-6 space-y-6 text-left order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#299C68] text-xs font-semibold shadow-xs border border-[#E5EAF0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#299C68]" />
            <span>Enterprise Data Protection & Consent</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight leading-[1.1]">
            Trust is built <br />
            <span className="text-[#299C68]">one profile at a time.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5C6878] leading-relaxed font-normal">
            Make workforce verification easier to understand, manage, and connect across your organization with absolute data privacy and statutory compliance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white/90 rounded-2xl border border-[#E5EAF0] shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-[#182230]">
                <Scale className="w-4 h-4 text-[#299C68]" />
                <span>DPDP Act 2023</span>
              </div>
              <p className="text-xs text-[#5C6878] leading-relaxed">
                Explicit candidate OTP consent recorded in permanent audit logs with auto Aadhaar masking.
              </p>
            </div>

            <div className="p-4 bg-white/90 rounded-2xl border border-[#E5EAF0] shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-[#182230]">
                <Lock className="w-4 h-4 text-[#426CF5]" />
                <span>256-Bit AES Vault</span>
              </div>
              <p className="text-xs text-[#5C6878] leading-relaxed">
                End-to-end TLS 1.3 encrypted transit and AES-256 encrypted storage in Indian cloud servers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onOpenLegalHandbook}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#182230] text-xs font-semibold border border-[#E5EAF0] shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#299C68]" />
              <span>Compliance Handbook</span>
            </button>

            <button
              onClick={onOpenDemo}
              className="px-6 py-2.5 rounded-full bg-[#299C68] hover:bg-[#238558] text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Book Security Walkthrough</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
