import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Layers,
  Sparkles
} from 'lucide-react';

const COMPARISON_METRICS = [
  {
    category: 'Verification Speed',
    icon: Clock,
    traditional: '12 – 18 Business Days (Slow manual calls & agency delays)',
    joyTrueProfile: 'Instant in under 1 minute (100% automated checks)',
    saving: '99% Faster Onboarding'
  },
  {
    category: 'Cost Per Verification',
    icon: DollarSign,
    traditional: '₹1,500 – ₹2,200 per hire (High agency markups)',
    joyTrueProfile: '₹150 – ₹350 per hire (Simple, transparent pricing)',
    saving: 'Save Up to 82% on Screening Costs'
  },
  {
    category: 'Moonlighting & Dual-Job Detection',
    icon: AlertTriangle,
    traditional: 'Zero visibility — Second overlapping jobs missed completely',
    joyTrueProfile: 'Instant alert if candidate has an active undeclared job',
    saving: '100% Protection from Moonlighting'
  },
  {
    category: 'Police & Court Records',
    icon: ShieldCheck,
    traditional: 'Manual court visits, fragmented paper searches',
    joyTrueProfile: 'Instant nationwide search across civil & criminal databases',
    saving: 'Complete Legal Peace of Mind'
  },
  {
    category: 'Data Privacy & Compliance',
    icon: Layers,
    traditional: 'Unsecured paper photocopies floating around HR desks',
    joyTrueProfile: '100% DPDP Act compliant with encrypted digital reports',
    saving: 'Zero Compliance & Legal Risk'
  }
];

export const InteractiveSpeedComparison = () => {
  return (
    <div className="w-full dark-glass-card border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>HOW WE COMPARE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-outfit">
            Traditional 15-Day Agency vs JOY Verification
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            See why leading HR teams are replacing slow, expensive background check agencies with our modern platform.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sub-45s Turnaround</span>
          </span>
        </div>
      </div>

      {/* 3D Visual Speed Comparison Hero Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-50/90 border border-slate-200 rounded-2xl p-5 sm:p-7 mb-8 shadow-inner">
        {/* Left: 3D Render Image */}
        <div className="lg:col-span-5 rounded-xl overflow-hidden aspect-[16/10] border border-slate-200 bg-slate-950 shadow-sm relative group">
          <img
            src="/assets/3d/speed_3d_instant.jpg"
            alt="3D Instant Speed Verification Smartphone"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/50 font-mono text-[9px] text-amber-300 font-bold flex items-center gap-1.5 shadow-md">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Live Latency: 00:45s</span>
          </div>
        </div>

        {/* Right: Dual Countdown Comparison Boxes */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Traditional Card */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/80 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-rose-700 block mb-1">
                TRADITIONAL MANUAL BGV
              </span>
              <div className="text-2xl sm:text-3xl font-black text-rose-950 font-outfit">
                14 – 18 Days
              </div>
              <p className="text-xs text-rose-800 mt-1 font-medium">
                Manual phone calls, physical postal verifications, and endless back-and-forth emails.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-200/80 flex items-center justify-between text-[11px] font-mono text-rose-700">
              <span>Candidate Drop-off: High</span>
              <span className="font-bold">❌ 40% Churn</span>
            </div>
          </div>

          {/* JOY TrueProfile Card */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/90 flex flex-col justify-between shadow-xs">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-800 block mb-1">
                JOY TRUE PROFILE AUTOMATION
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-950 font-outfit flex items-center gap-2">
                <span>&lt; 45 Seconds</span>
                <span className="text-xs font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  INSTANT
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1 font-medium">
                Automated parallel connectors across official government, PF, court, and banking rails.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between text-[11px] font-mono text-amber-900 font-bold">
              <span>Candidate Completion:</span>
              <span className="text-emerald-700">✓ 98.4% Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="flex flex-col divide-y divide-slate-200">
        
        {/* Table Column Headers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 text-xs uppercase tracking-wider text-slate-500 font-bold hidden md:grid">
          <div className="md:col-span-4">What You Get</div>
          <div className="md:col-span-4 text-rose-700">Traditional Background Agency (The Old Way)</div>
          <div className="md:col-span-4 text-amber-700">JOY Verification (The Modern Way)</div>
        </div>

        {/* Rows */}
        {COMPARISON_METRICS.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div key={idx} className="py-4 sm:py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start sm:items-center">
              
              {/* Parameter Name */}
              <div className="md:col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-amber-700 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-outfit">{row.category}</h4>
                  <span className="text-[11px] text-emerald-700 font-bold block sm:hidden">
                    {row.saving}
                  </span>
                </div>
              </div>

              {/* Traditional (Old Way) */}
              <div className="md:col-span-4 p-3 rounded-xl bg-rose-50/80 border border-rose-200 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-900 font-medium leading-relaxed">
                  {row.traditional}
                </span>
              </div>

              {/* JOY (Modern) */}
              <div className="md:col-span-4 p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-900 font-bold leading-relaxed block">
                    {row.joyTrueProfile}
                  </span>
                  <span className="text-[11px] text-amber-800 font-semibold block mt-0.5">
                    ✨ {row.saving}
                  </span>
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* Bottom Summary Strip */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Trusted by enterprises to screen over 50,000 hires every month.</span>
        </div>

        <a
          href="#roi-calculator"
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/25 border border-orange-500 cursor-pointer"
        >
          <span>Calculate Your Savings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};

export default InteractiveSpeedComparison;
