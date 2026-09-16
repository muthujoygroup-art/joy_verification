import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  Fingerprint, 
  Lock,
  ArrowRight,
  Zap
} from 'lucide-react';

export const Hero3DCharacter = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full max-w-lg mx-auto flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main 3D Card Container */}
      <div className="relative w-full rounded-3xl bg-white border border-[#E5EAF0] p-4 sm:p-6 shadow-[0_20px_50px_rgba(24,34,48,0.06)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(66,108,245,0.12)]">
        
        {/* Top Status Pill Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF8F0] border border-[#299C68]/20 text-[#299C68] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#299C68] animate-pulse" />
            <span>Active Digital Profile</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-[#5C6878] font-medium bg-[#FCFCFA] px-3 py-1 rounded-full border border-[#E5EAF0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#426CF5]" />
            <span>100% Verified</span>
          </div>
        </div>

        {/* 3D Illustration Scene Container */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#F1EEFF]/60 to-[#EAF5FF]/60 aspect-[4/3] flex items-center justify-center">
          <img 
            src="/assets/3d/hero_3d_character.jpg" 
            alt="Joy True Profile 3D Workforce Professional" 
            className="w-full h-full object-cover transform transition-transform duration-700 ease-out hover:scale-105"
            loading="eager"
          />

          {/* Floating Micro-Badge 1: Verified Tag */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E5EAF0] shadow-md flex items-center gap-2 animate-bounce-slow">
            <div className="w-5 h-5 rounded-full bg-[#299C68] text-white flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-[#5C6878] font-medium leading-none">Status</p>
              <p className="text-xs text-[#182230] font-bold leading-tight">Identity Match</p>
            </div>
          </div>

          {/* Floating Micro-Badge 2: Instant TAT */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 animate-float">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-semibold leading-none">Speed</p>
              <p className="text-xs text-[#0F172A] font-black leading-tight">Direct API Rails</p>
            </div>
          </div>
        </div>

        {/* Profile Card Footer Summary */}
        <div className="mt-4 pt-4 border-t border-[#E5EAF0] flex items-center justify-between text-xs text-[#5C6878]">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#426CF5]" />
            <span className="text-[#182230] font-semibold">Human-Centered Digital Trust</span>
          </div>
          <span className="text-[11px] text-[#299C68] font-semibold bg-[#EAF8F0] px-2.5 py-0.5 rounded-full">
            DPDP Compliant
          </span>
        </div>

      </div>
    </div>
  );
};

export default Hero3DCharacter;
