import React from 'react';
import { 
  Users, 
  FileCheck2, 
  Share2, 
  Sliders, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  QrCode,
  CreditCard,
  Building2,
  Lock
} from 'lucide-react';

export const FeatureShowcase = ({ onOpenDemo }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FCFCFA] text-[#182230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1EEFF] text-[#8975E8] text-xs font-semibold border border-[#E5EAF0]">
            <Sparkles className="w-3.5 h-3.5 text-[#8975E8]" />
            <span>Smart Features Built for Modern Hiring</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
            Designed for simplicity. <br />
            <span className="text-[#426CF5]">Engineered for confidence.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5C6878] font-normal leading-relaxed">
            Everything your company needs to verify employee profiles, manage compliance, and issue digital passes in one place.
          </p>
        </div>

        {/* Asymmetric Bento Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Large Feature Block 1: One Place for Workforce Profiles (8-col) */}
          <div className="md:col-span-12 lg:col-span-8 p-8 sm:p-10 rounded-3xl bg-[#F1EEFF] border border-[#E5EAF0] flex flex-col justify-between gap-6 relative overflow-hidden transition-all duration-300 hover:shadow-md group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#8975E8] flex items-center justify-center shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#8975E8] uppercase tracking-wider">
                CENTRALIZED DIRECTORY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182230] font-outfit">
                One Place for Workforce Profiles
              </h3>
              <p className="text-sm sm:text-base text-[#5C6878] leading-relaxed max-w-xl">
                Organize full-time employees, contractor labor, and fleet associates in a unified, searchable directory. Track verification statuses across all departments in real time.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#8975E8]/20 text-xs">
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E5EAF0]">
                <span className="text-[10px] text-[#5C6878] font-medium block">Bulk Import</span>
                <span className="text-sm font-bold text-[#182230] mt-0.5 block">Excel 500+ Hires</span>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E5EAF0]">
                <span className="text-[10px] text-[#5C6878] font-medium block">Multi-Tenant</span>
                <span className="text-sm font-bold text-[#182230] mt-0.5 block">Company Admin Seats</span>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E5EAF0] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#5C6878] font-medium block">Real-Time Search</span>
                <span className="text-sm font-bold text-[#182230] mt-0.5 block">Instant Status HUD</span>
              </div>
            </div>
          </div>

          {/* Medium Block 2: Verify Documents (4-col) */}
          <div className="md:col-span-6 lg:col-span-4 p-8 rounded-3xl bg-[#EAF5FF] border border-[#E5EAF0] flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#426CF5] flex items-center justify-center shadow-xs">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#426CF5] uppercase tracking-wider">
                ACCURATE CHECKS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#182230] font-outfit">
                Verify Documents
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6878] leading-relaxed">
                Check Aadhaar OTP, PAN validity, past employer tenures, bank account names via ₹1 IMPS, and pan-India court records in under 45 seconds.
              </p>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-[#E5EAF0] text-xs font-semibold text-[#426CF5] flex items-center justify-between">
              <span>Parallel Auto-Queries</span>
              <ShieldCheck className="w-4 h-4 text-[#299C68]" />
            </div>
          </div>

          {/* Medium Block 3: Connect HR and Workforce (4-col) */}
          <div className="md:col-span-6 lg:col-span-4 p-8 rounded-3xl bg-[#EAF8F0] border border-[#E5EAF0] flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-md group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#299C68] flex items-center justify-center shadow-xs">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#299C68] uppercase tracking-wider">
                EFFORTLESS DISPATCH
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#182230] font-outfit">
                Connect HR & Workers
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6878] leading-relaxed">
                Dispatch invites directly via WhatsApp or SMS. Candidates complete self-verification in 2 minutes on their phone with 0 app downloads.
              </p>
            </div>

            <div className="p-3.5 bg-white/90 rounded-2xl border border-[#E5EAF0] text-xs font-semibold text-[#299C68] flex items-center justify-between">
              <span>Zero-Friction Mobile Link</span>
              <span className="text-[#299C68] font-bold">&lt; 2 Min ✓</span>
            </div>
          </div>

          {/* Wide Feature Block 4: Make Verification Management Easier (8-col) */}
          <div className="md:col-span-12 lg:col-span-8 p-8 sm:p-10 rounded-3xl bg-[#FFF1E8] border border-[#E5EAF0] flex flex-col justify-between gap-6 relative overflow-hidden transition-all duration-300 hover:shadow-md group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#E06A26] flex items-center justify-center shadow-xs">
                <Sliders className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#E06A26] uppercase tracking-wider">
                COMPLIANCE & PASSES
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182230] font-outfit">
                Make Verification Management Easier
              </h3>
              <p className="text-sm sm:text-base text-[#5C6878] leading-relaxed max-w-xl">
                Automatically generate certified tamper-proof audit dossiers and issue scannable QR passes for factory turnstiles to maintain CLRA Form XVI statutory compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#E06A26]/20 text-xs">
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E5EAF0] flex items-center justify-between">
                <span className="text-slate-700 font-semibold">1-Click PDF Audit Dossier</span>
                <span className="text-[#299C68] font-bold">SHA-256 ✓</span>
              </div>
              <div className="p-3 bg-white/90 rounded-2xl border border-[#E5EAF0] flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Scannable QR Gate Passes</span>
                <span className="text-[#E06A26] font-bold">&lt;0.5s Scan ✓</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeatureShowcase;
