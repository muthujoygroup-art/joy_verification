import React, { useState } from 'react';
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
import { soundEngine } from '../../utils/uiSoundEffects';

const COMPARISON_METRICS = [
  {
    category: 'Verification Velocity',
    icon: Clock,
    traditional: '12 – 18 Business Days (Manual agencies, phone calls)',
    joyTrueProfile: 'Sub-45 Seconds (100% Cryptographic verification)',
    saving: '99.8% Faster Onboarding'
  },
  {
    category: 'Cost Per Verification',
    icon: DollarSign,
    traditional: '₹1,500 – ₹2,200 / candidate (High agency markups)',
    joyTrueProfile: '₹150 – ₹350 / candidate (Predictable cloud tier)',
    saving: 'Up to 82% Direct Cost Reduction'
  },
  {
    category: 'Dual-Employment Detection',
    icon: AlertTriangle,
    traditional: 'Zero visibility — Overlapping tenures missed completely',
    joyTrueProfile: 'Real-time tenure radar flags concurrent active contributions',
    saving: 'Zero Ghost Workers & Moonlighting'
  },
  {
    category: 'National Judicial Records',
    icon: ShieldCheck,
    traditional: 'Manual district court visits, slow fragmented paper searches',
    joyTrueProfile: 'Automated multi-tribunal & civil court screening in 0.45s',
    saving: 'Comprehensive National Scope'
  },
  {
    category: 'Statutory Compliance & Privacy',
    icon: Layers,
    traditional: 'Unencrypted physical Xerox copies (High DPDP non-compliance risk)',
    joyTrueProfile: '100% DPDP Act 2023 compliant with SHA-256 masked dossiers',
    saving: '100% Protected Against Fines'
  }
];

const InteractiveSpeedComparison = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="w-full dark-glass-card border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>THE ENTERPRISE COMPARISON MATRIX</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Traditional 15-Day Agency vs JOY TrueProfile
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            See how modern algorithmic verification fundamentally outclasses slow, manual third-party background check agencies.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sub-45s AI Advantage</span>
          </span>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="flex flex-col divide-y divide-white/10">
        
        {/* Table Column Headers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 font-mono text-xs uppercase tracking-wider text-slate-400 font-bold hidden md:grid">
          <div className="md:col-span-4">Evaluation Parameter</div>
          <div className="md:col-span-4 text-rose-400">Legacy Manual Agency (Old Way)</div>
          <div className="md:col-span-4 text-cyan-400">JOY TrueProfile Engine (Modern)</div>
        </div>

        {/* Rows */}
        {COMPARISON_METRICS.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div key={idx} className="py-4 sm:py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start sm:items-center">
              
              {/* Parameter Name */}
              <div className="md:col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-cyan-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-outfit">{row.category}</h4>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold block sm:hidden">
                    {row.saving}
                  </span>
                </div>
              </div>

              {/* Traditional (Old Way) */}
              <div className="md:col-span-4 p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-200 font-medium leading-relaxed">
                  {row.traditional}
                </span>
              </div>

              {/* JOY TrueProfile (Modern) */}
              <div className="md:col-span-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-2.5 shadow-md shadow-cyan-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-white font-bold leading-relaxed block">
                    {row.joyTrueProfile}
                  </span>
                  <span className="font-mono text-[10px] text-cyan-300 font-semibold block mt-0.5">
                    ✨ {row.saving}
                  </span>
                </div>
              </div>

            </div>
          );
        })}

      </div>

      {/* Bottom Summary Strip */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Proven across 50,000+ monthly enterprise verifications.</span>
        </div>

        <a
          href="#roi-calculator"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-xs text-white font-mono flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
        >
          <span>Calculate Your Enterprise ROI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};

export default InteractiveSpeedComparison;
