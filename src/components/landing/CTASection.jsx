import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

export const CTASection = ({ onOpenDemo, onOpenContact }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FCFCFA] text-[#182230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-[36px] sm:rounded-[48px] bg-gradient-to-tr from-[#F1EEFF] via-[#EAF5FF] to-[#EAF8F0] border border-[#E5EAF0] p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(24,34,48,0.06)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left Column: Heading, Subtitle & Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#426CF5] text-xs font-semibold shadow-xs border border-[#E5EAF0]">
                <Sparkles className="w-3.5 h-3.5 text-[#426CF5]" />
                <span>Start Your Smarter Verification Journey</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#182230] font-outfit tracking-tight leading-[1.1]">
                Ready to build a <br />
                <span className="text-[#426CF5]">more trusted workforce?</span>
              </h2>

              <p className="text-base sm:text-lg text-[#5C6878] max-w-xl font-normal leading-relaxed">
                Explore Joy True Profile and discover a smarter, faster, and more respectful way to manage workforce profiles, background screening, and plant access.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={onOpenDemo}
                  className="px-8 py-4 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started with Live Demo 🚀</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={onOpenContact}
                  className="px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-[#182230] text-sm font-semibold border border-[#E5EAF0] shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#5C6878]" />
                  <span>Contact Our Team</span>
                </button>
              </div>

              <div className="pt-3 flex items-center gap-6 text-xs text-[#5C6878] font-medium flex-wrap">
                <span className="flex items-center gap-1.5 text-[#299C68]">
                  <CheckCircle2 className="w-4 h-4" /> 100% Postpaid Billing
                </span>
                <span className="flex items-center gap-1.5 text-[#426CF5]">
                  <CheckCircle2 className="w-4 h-4" /> Zero App Downloads
                </span>
                <span className="flex items-center gap-1.5 text-[#8975E8]">
                  <CheckCircle2 className="w-4 h-4" /> DPDP Act 2023 Compliant
                </span>
              </div>
            </div>

            {/* Right Column: Friendly 3D Mascot Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white p-3 border border-[#E5EAF0]">
                <img 
                  src="/assets/3d/cta_friendly_character.jpg" 
                  alt="Joy True Profile Friendly Mascot 3D Illustration" 
                  className="w-full h-auto object-cover rounded-2xl"
                  loading="eager"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTASection;
