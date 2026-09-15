import React from 'react';
import { 
  Building2, 
  UserCheck, 
  Smile, 
  CheckCircle2, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';

const PILLARS = [
  {
    title: 'For Companies',
    badge: 'ORGANIZATIONAL CLARITY',
    tagColor: 'bg-[#EAF5FF] text-[#426CF5] border-[#426CF5]/30',
    icon: Building2,
    headline: 'Build a more organized workforce verification experience.',
    points: [
      'Eliminate duplicate and ghost worker billing from contractor agencies',
      'Centralize compliance records for statutory labor audits (CLRA Form XVI)',
      '100% Postpaid transparent metered billing with automated GST tax receipts'
    ]
  },
  {
    title: 'For HR Teams',
    badge: 'RECRUITER EFFICIENCY',
    tagColor: 'bg-[#F1EEFF] text-[#8975E8] border-[#8975E8]/30',
    icon: UserCheck,
    headline: 'Make employee profile and verification management easier.',
    points: [
      'Batch upload 500+ candidates via Excel in 10 seconds without manual typing',
      '1-Click WhatsApp & SMS magic link dispatch with 98%+ candidate completion',
      'Instant parallel checks deliver certified tamper-proof dossiers in under 45s'
    ]
  },
  {
    title: 'For Workers',
    badge: 'DIGNIFIED EXPERIENCE',
    tagColor: 'bg-[#EAF8F0] text-[#299C68] border-[#299C68]/30',
    icon: Smile,
    headline: 'Experience a smoother, more connected profile verification journey.',
    points: [
      'Zero app downloads required—runs on any mobile browser in under 2 minutes',
      'Explicit OTP consent protects personal data under DPDP Act 2023 regulations',
      'Instant digital QR gate passes grant fast, friction-free turnstile entry'
    ]
  }
];

export const WhyJoyTrueProfile = ({ onOpenDemo }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FCFCFA] text-[#182230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1EEFF] text-[#8975E8] text-xs font-semibold border border-[#E5EAF0]">
            <Sparkles className="w-3.5 h-3.5 text-[#8975E8]" />
            <span>Value For Every Stakeholder</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight leading-[1.1]">
            Made for the people <br />
            <span className="text-[#426CF5]">who keep business moving.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#5C6878] font-normal leading-relaxed">
            Tailored advantages designed to remove friction, build trust, and accelerate workforce onboarding at every level.
          </p>
        </div>

        {/* 3 Value Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] flex items-center justify-center text-[#182230]">
                      <Icon className="w-6 h-6 text-[#426CF5]" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${p.tagColor}`}>
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#182230] font-outfit">
                    {p.title}
                  </h3>

                  <p className="text-sm font-semibold text-[#426CF5] leading-snug">
                    {p.headline}
                  </p>

                  <ul className="space-y-3 pt-2 text-xs text-[#5C6878]">
                    {p.points.map((point, ptIdx) => (
                      <li key={ptIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#299C68] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E5EAF0]">
                  <button
                    onClick={onOpenDemo}
                    className="text-xs font-bold text-[#426CF5] hover:text-[#3459D8] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Learn more for {p.title.toLowerCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyJoyTrueProfile;
