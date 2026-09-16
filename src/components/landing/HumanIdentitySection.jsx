import React from 'react';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Heart,
  Building2,
  UserCheck
} from 'lucide-react';

export const HumanIdentitySection = ({ onOpenDemo }) => {
  return (
    <section className="relative py-16 sm:py-24 bg-[#F1EEFF] rounded-[36px] sm:rounded-[48px] px-6 sm:px-12 lg:px-16 overflow-hidden border border-[#E5EAF0]">
      {/* Background Soft Glow Flares */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#EAF5FF]/80 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Human Story Headline & Supporting Narrative */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#6D28D9] text-xs font-bold shadow-xs border border-purple-200">
            <Heart className="w-3.5 h-3.5 text-[#6D28D9] fill-[#6D28D9]/20" />
            <span>The Human Side of Verification</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-outfit tracking-tight leading-[1.1]">
            Behind every profile, <br />
            <span className="text-[#1D4ED8]">there's a person.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-900 leading-relaxed font-medium max-w-xl">
            From companies and HR teams to the people who power every organization, Joy True Profile brings workforce information into one connected, respectful, and reliable experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/95 border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center mb-2 font-black">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-950">Dignified Onboarding</h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                Zero app downloads. Candidates self-verify in under 2 minutes with explicit consent.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#047857] flex items-center justify-center mb-2 font-black">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-950">Connected Teams</h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                Clear workflows linking corporate HRs, recruiters, and workers with total transparency.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenDemo}
              className="px-6 py-3 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore The Human Experience</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>

        {/* Right Column: 3D Workforce Connection Scene */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-4 sm:p-5 border border-[#E5EAF0] shadow-[0_20px_50px_rgba(24,34,48,0.06)]">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-tr from-[#EAF5FF] to-[#F1EEFF]">
              <img 
                src="/assets/3d/workforce_connection.jpg" 
                alt="Joy True Profile Workforce Connection 3D Scene" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#5C6878] px-2">
              <span className="font-semibold text-[#182230]">Company ⇄ HR ⇄ Worker Ecosystem</span>
              <span className="text-[#299C68] font-bold bg-[#EAF8F0] px-2.5 py-1 rounded-full">
                Connected & Verified ✓
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HumanIdentitySection;
