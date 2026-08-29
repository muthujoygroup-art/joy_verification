import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Database, Sparkles, RefreshCw, Zap } from 'lucide-react';

export const LiveTelemetryLoader = ({ 
  title = "Synchronizing Institutional Gateways", 
  subtitle = "Connecting to 10+ Government Repositories & Encrypted Storage Vault...",
  onCancel
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const steps = [
    "Establishing 256-Bit TLS Handshake with UIDAI DigiLocker...",
    "Querying NSDL & Income Tax Live Operative Registers...",
    "Validating EPFO Unified Member Portal Employment History...",
    "Executing IMPS Penny Drop Bank Beneficiary Verification...",
    "Performing MoRTH Sarathi & MEA Passport Seva Cross-Check...",
    "Binding SHA-256 Tamper-Proof Cryptographic Vault Signature..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIdx(prev => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden animate-modal-spring">
        
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />

        {/* Holographic Radar Scanner Graphic */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Pulsing Concentric Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-200 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full border-2 border-sky-300 animate-pulse opacity-50" />
          <div className="absolute inset-4 rounded-full border border-indigo-400 bg-indigo-50/50" />

          {/* Rotating Radar Sweep Needle */}
          <div className="absolute inset-0 rounded-full animate-radar-sweep border-t-2 border-r-2 border-indigo-600 opacity-80" />

          {/* Center Glowing Icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 z-10 animate-bounce-slight">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Informational Text */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
            <Zap className="w-3 h-3 text-indigo-600 animate-pulse" />
            <span>DPDP Act 2023 Live Telemetry</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">{subtitle}</p>
        </div>

        {/* Real-time Dynamic Telemetry Step Feed */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-slate-700">
              <Database className="w-3 h-3 text-indigo-600" />
              <span>Active Gateway Stream:</span>
            </span>
            <span className="font-mono text-indigo-600">Step {currentStepIdx + 1} of {steps.length}</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2.5">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin shrink-0" />
            <span className="text-xs font-bold text-slate-800 truncate animate-fadeIn">
              {steps[currentStepIdx]}
            </span>
          </div>
        </div>

        {/* Optional Cancel/Dismiss button if taking long */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-700 font-bold transition-colors cursor-pointer"
          >
            Dismiss / Run in Background
          </button>
        )}

      </div>
    </div>
  );
};
