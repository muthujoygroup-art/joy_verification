import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Share2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const STAKEHOLDERS = [
  {
    id: 'company',
    name: 'Company / Employer',
    role: 'Central Governance',
    desc: 'Allocates recruiter seats, monitors credit consumption quotas, and downloads GST invoices with full audit trails.',
    icon: Building2,
    badge: 'Enterprise Level'
  },
  {
    id: 'hr',
    name: 'HR Recruiter Team',
    role: 'Candidate Pipeline',
    desc: 'Sends WhatsApp & SMS magic links, imports Excel batches, and inspects certified 360° candidate dossiers.',
    icon: UserCheck,
    badge: 'Recruiter Hub'
  },
  {
    id: 'worker',
    name: 'Worker / Candidate',
    role: 'Mobile Self-KYC',
    desc: 'Completes 2-minute mobile browser check with 4-digit PIN access, Aadhaar OTP, and quick camera selfie.',
    icon: Smartphone,
    badge: 'Zero App Installs'
  },
  {
    id: 'profile',
    name: 'Verified True Profile',
    role: 'Single Source of Truth',
    desc: 'Permanent certified record with scannable turnstile QR gate passes and tamper-proof PDF audit reports.',
    icon: ShieldCheck,
    badge: 'Certified & Protected'
  }
];

export const WorkforceConnectionSection = () => {
  const [selectedIdx, setSelectedIdx] = useState(1);

  const handleSelect = (idx) => {
    soundEngine.playClick();
    setSelectedIdx(idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#EAF5FF] rounded-[36px] sm:rounded-[48px] px-6 sm:px-12 lg:px-16 overflow-hidden border border-[#E5EAF0]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#426CF5] text-xs font-semibold shadow-xs border border-[#E5EAF0]">
            <Share2 className="w-3.5 h-3.5 text-[#426CF5]" />
            <span>Connected Workforce Ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
            Connected people. <br />
            <span className="text-[#426CF5]">Clearer workflows.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5C6878] font-normal leading-relaxed">
            Connecting companies, HR departments, and workers through a single, seamless digital identity rail.
          </p>
        </div>

        {/* Workflow Progression Indicator: COMPANY -> HR -> WORKER -> PROFILE */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-xs sm:text-sm font-bold text-[#182230]">
          <span className="px-4 py-2 rounded-2xl bg-white border border-[#E5EAF0] shadow-xs">01. Company</span>
          <span className="text-[#426CF5]">→</span>
          <span className="px-4 py-2 rounded-2xl bg-white border border-[#E5EAF0] shadow-xs">02. HR Team</span>
          <span className="text-[#426CF5]">→</span>
          <span className="px-4 py-2 rounded-2xl bg-white border border-[#E5EAF0] shadow-xs">03. Worker</span>
          <span className="text-[#426CF5]">→</span>
          <span className="px-4 py-2 rounded-2xl bg-[#EAF8F0] text-[#299C68] border border-[#299C68]/30 shadow-xs">04. True Profile ✓</span>
        </div>

        {/* 4 Interactive Stakeholder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAKEHOLDERS.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(idx)}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 bg-white ${
                  isSelected
                    ? 'border-[#426CF5] shadow-[0_15px_35px_rgba(66,108,245,0.12)] scale-[1.02]'
                    : 'border-[#E5EAF0] hover:border-[#426CF5]/40 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#5C6878] bg-[#FCFCFA] px-2.5 py-1 rounded-full border border-[#E5EAF0]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#182230] font-outfit">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#5C6878] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-[#426CF5]' : 'text-[#5C6878]'}>
                    {isSelected ? '● Selected Role' : item.role}
                  </span>
                  <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-[#426CF5]' : 'text-slate-300'}`} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WorkforceConnectionSection;
