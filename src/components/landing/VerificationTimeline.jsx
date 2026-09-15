import React, { useState } from 'react';
import { 
  UserPlus, 
  Network, 
  FileCheck2, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const TIMELINE_STEPS = [
  {
    step: '01',
    label: 'CREATE',
    title: 'Create a Workforce Profile',
    desc: 'Initiate candidate onboarding with a single mobile number invite or bulk import hundreds of profiles via Excel in seconds.',
    icon: UserPlus,
    color: 'bg-[#EAF5FF] text-[#426CF5] border-[#426CF5]/30',
    tag: 'Single / Bulk Upload'
  },
  {
    step: '02',
    label: 'CONNECT',
    title: 'Connect Company, HR & Worker',
    desc: 'Candidates receive an encrypted magic link via WhatsApp or SMS. No app download needed—runs on any mobile browser.',
    icon: Network,
    color: 'bg-[#F1EEFF] text-[#8975E8] border-[#8975E8]/30',
    tag: 'Zero App Installs'
  },
  {
    step: '03',
    label: 'VERIFY',
    title: 'Verify Documents & Identity',
    desc: 'Automated verification checks identity, PAN, past employment tenures, direct bank details, and court records in parallel.',
    icon: FileCheck2,
    color: 'bg-[#EAF8F0] text-[#299C68] border-[#299C68]/30',
    tag: 'Parallel Instant Checks'
  },
  {
    step: '04',
    label: 'MANAGE',
    title: 'Manage Profiles & Gate Passes',
    desc: 'Download certified tamper-proof audit dossiers and issue scannable QR gate passes for factory turnstile security.',
    icon: Sliders,
    color: 'bg-[#FFF1E8] text-[#E06A26] border-[#E06A26]/30',
    tag: 'Audit Ready PDF & Pass'
  }
];

export const VerificationTimeline = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index) => {
    soundEngine.playClick();
    setActiveStep(index);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FCFCFA] text-[#182230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-semibold border border-[#E5EAF0]">
            <Sparkles className="w-3.5 h-3.5 text-[#426CF5]" />
            <span>Clear 4-Step Verification Journey</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
            From profile <br />
            <span className="text-[#426CF5]">to confidence.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5C6878] font-normal leading-relaxed">
            A smooth, standardized verification process designed for recruiters, employers, and onboarding candidates.
          </p>
        </div>

        {/* 4 Steps Grid (Horizontal on Desktop, Vertical Stack on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {TIMELINE_STEPS.map((s, idx) => {
            const isSelected = activeStep === idx;
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                onClick={() => handleStepClick(idx)}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-6 relative overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#426CF5] shadow-[0_15px_35px_rgba(66,108,245,0.12)] scale-[1.02]'
                    : 'bg-[#FCFCFA] hover:bg-white border-[#E5EAF0] shadow-xs'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5C6878] font-mono tracking-wider">
                      {s.step} — {s.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${s.color}`}>
                      {s.tag}
                    </span>
                  </div>

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-[#182230] font-outfit">
                    {s.title}
                  </h3>

                  <p className="text-xs text-[#5C6878] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-[#426CF5]' : 'text-[#5C6878]'}>
                    {isSelected ? '● Active Step' : 'Step ' + s.step}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#426CF5]' : 'text-[#5C6878]'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Verification Document Showcase Banner */}
        <div className="rounded-3xl bg-[#EAF8F0] border border-[#299C68]/20 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-3 text-left max-w-xl">
            <span className="text-xs font-bold text-[#299C68] uppercase tracking-wider">
              Document & Identity Intelligence
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#182230] font-outfit">
              100% Genuine Match & Fast Verification
            </h3>
            <p className="text-sm text-[#5C6878] leading-relaxed">
              Every profile is checked against official document checksums and direct banking rails to ensure zero ghost workers and clean compliance records.
            </p>
          </div>

          <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-md bg-white border border-[#E5EAF0]">
            <img 
              src="/assets/3d/document_verification.jpg" 
              alt="3D Document Verification Scene" 
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default VerificationTimeline;
