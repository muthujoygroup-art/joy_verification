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
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-700 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
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
          <span className="bg-purple-100 border border-purple-300 text-purple-800 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Sub-45s Turnaround</span>
          </span>
        </div>
      </div>

      {/* 3D Visual Speed Comparison Hero Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 mb-8 shadow-xl text-white">
        {/* Left: 3D Render Image */}
        <div className="lg:col-span-5 rounded-xl overflow-hidden aspect-[16/10] border border-slate-800 bg-slate-900 shadow-md relative group">
          <img
            src="/assets/3d/speed_3d_instant.jpg"
            alt="3D Instant Speed Verification Smartphone"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-400/50 font-mono text-[9px] text-amber-300 font-bold flex items-center gap-1.5 shadow-md">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Live Latency: 00:45s</span>
          </div>
        </div>

        {/* Right: Dual Countdown Comparison Boxes */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Traditional Card */}
          <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/60 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-rose-400 block mb-1">
                TRADITIONAL MANUAL BGV
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-outfit">
                14 – 18 Days
              </div>
              <p className="text-xs text-rose-200 mt-1 font-medium">
                Manual phone calls, physical postal verifications, and endless back-and-forth emails.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-500/40 flex items-center justify-between text-[11px] font-mono text-rose-300">
              <span>Candidate Drop-off: High</span>
              <span className="font-bold">❌ 40% Churn</span>
            </div>
          </div>

          {/* JOY TrueProfile Card */}
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/60 flex flex-col justify-between shadow-md">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                JOY TRUE PROFILE AUTOMATION
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-outfit flex items-center gap-2">
                <span>&lt; 45 Seconds</span>
                <span className="text-xs font-mono text-emerald-300 bg-emerald-900 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  INSTANT
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1 font-medium">
                Automated parallel connectors across official government, PF, court, and banking rails.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-500/40 flex items-center justify-between text-[11px] font-mono text-emerald-300 font-bold">
              <span>Candidate Completion:</span>
              <span className="text-emerald-400">✓ 98.4% Rate</span>
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
          <div className="md:col-span-4 text-emerald-700">JOY Verification (The Modern Way)</div>
        </div>

        {/* Rows */}
        {COMPARISON_METRICS.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div key={idx} className="py-4 sm:py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start sm:items-center">
              
              {/* Parameter Name */}
              <div className="md:col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                  <Icon className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-outfit">{row.category}</h4>
                  <span className="text-[11px] text-emerald-700 font-bold block sm:hidden">
                    {row.saving}
                  </span>
                </div>
              </div>

              {/* Traditional (Old Way) */}
              <div className="md:col-span-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-900 font-medium leading-relaxed">
                  {row.traditional}
                </span>
              </div>

              {/* JOY (Modern) */}
              <div className="md:col-span-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-emerald-950 font-bold leading-relaxed block">
                    {row.joyTrueProfile}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
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
        <div className="flex items-center gap-2 text-xs text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Trusted by enterprises to screen over 50,000 hires every month.</span>
        </div>

        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open_tour_guide_modal'))}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <span>Explore Interactive Tour</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};

export default InteractiveSpeedComparison;
