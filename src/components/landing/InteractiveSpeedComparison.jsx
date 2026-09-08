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
    <div className="w-full dark-glass-card border border-amber-500/20 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/15 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>HOW WE COMPARE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Traditional 15-Day Agency vs JOY Verification
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            See why leading HR teams are replacing slow, expensive background check agencies with our modern platform.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Under 1 Minute Results</span>
          </span>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="flex flex-col divide-y divide-amber-500/15">
        
        {/* Table Column Headers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 text-xs uppercase tracking-wider text-slate-400 font-bold hidden md:grid">
          <div className="md:col-span-4">What You Get</div>
          <div className="md:col-span-4 text-rose-400">Traditional Background Agency (The Old Way)</div>
          <div className="md:col-span-4 text-amber-400">JOY Verification (The Modern Way)</div>
        </div>

        {/* Rows */}
        {COMPARISON_METRICS.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div key={idx} className="py-4 sm:py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start sm:items-center">
              
              {/* Parameter Name */}
              <div className="md:col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900/60 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-outfit">{row.category}</h4>
                  <span className="text-[11px] text-emerald-400 font-bold block sm:hidden">
                    {row.saving}
                  </span>
                </div>
              </div>

              {/* Traditional (Old Way) */}
              <div className="md:col-span-4 p-3 rounded-xl bg-rose-950/20 border border-rose-500/25 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-200 font-medium leading-relaxed">
                  {row.traditional}
                </span>
              </div>

              {/* JOY (Modern) */}
              <div className="md:col-span-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5 shadow-md shadow-amber-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-white font-bold leading-relaxed block">
                    {row.joyTrueProfile}
                  </span>
                  <span className="text-[11px] text-amber-300 font-semibold block mt-0.5">
                    ✨ {row.saving}
                  </span>
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* Bottom Summary Strip */}
      <div className="mt-8 pt-6 border-t border-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Trusted by enterprises to screen over 50,000 hires every month.</span>
        </div>

        <a
          href="#roi-calculator"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 font-bold text-xs text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/25 cursor-pointer"
        >
          <span>Calculate Your Savings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};

export default InteractiveSpeedComparison;
