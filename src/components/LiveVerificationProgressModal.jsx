import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  Search, 
  Database, 
  Fingerprint, 
  Zap, 
  Globe, 
  Info,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';

export const LiveVerificationProgressModal = ({ 
  isOpen, 
  candidateName = "Candidate Profile",
  activeModules = ["aadhaar", "pan", "bankCheck", "aiFaceBiometrics"],
  onComplete,
  onCancel
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);
  const [tipIndex, setTipIndex] = useState(0);

  const securityTips = [
    {
      icon: Lock,
      title: "Bank-Grade Encryption",
      desc: "All candidate identity payloads are ciphered via AES-256-GCM and transferred through TLS 1.3 encrypted tunnels."
    },
    {
      icon: ShieldCheck,
      title: "DPDP Act 2023 Certified",
      desc: "Candidate consent timestamps and audit records are cryptographically sealed with immutable SHA-256 signatures."
    },
    {
      icon: Zap,
      title: "Zero-Lag Pipeline",
      desc: "Multi-threaded microservices communicate directly with Sandbox.co.in & CoinCircleTrust gateways in <450ms."
    },
    {
      icon: Fingerprint,
      title: "3D Biometric Anti-Spoofing",
      desc: "AI face vectors are mapped against high-resolution official ID portraits with 99.8% precision."
    }
  ];

  const steps = [
    {
      id: 'handshake',
      label: 'Cryptographic Gateway Handshake',
      sublabel: 'Establishing TLS 1.3 session with UIDAI / NSDL / EPFO servers',
      icon: Globe,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'demographics',
      label: 'Demographic & Attribute Matching',
      sublabel: 'Cross-referencing Father name, DOB, and Address against Central Registries',
      icon: Search,
      color: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    {
      id: 'biometrics',
      label: 'AI Facial Biometric Vector Analysis',
      sublabel: 'Scanning facial landmarks and anti-spoofing depth vectors',
      icon: Fingerprint,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      id: 'seal',
      label: 'Minting SHA-256 Digital Verification Seal',
      sublabel: 'Generating statutory 360° Dossier & dual-logo tamper-proof certificate',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  // Rotate security tips every 3.2 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % securityTips.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Advance verification steps dynamically
  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgressPercent(15);
      return;
    }

    const t1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgressPercent(45);
    }, 1200);

    const t2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(75);
    }, 2500);

    const t3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(95);
    }, 3800);

    const t4 = setTimeout(() => {
      setProgressPercent(100);
      if (onComplete) {
        setTimeout(onComplete, 600);
      }
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTip = securityTips[tipIndex];
  const TipIcon = currentTip.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-xl overflow-hidden relative animate-modal-spring">
        
        {/* Top Vibrant Ambient Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 animate-pulse" />

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header & Holographic Radar Scan Orb */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              {/* Outer Glowing Ring */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-400/80 animate-spin-slow flex items-center justify-center" />
              {/* Inner Pulse Ring */}
              <div className="absolute w-16 h-16 rounded-full bg-indigo-500/10 animate-ping" />
              {/* Center Hologram Shield Icon */}
              <div className="absolute w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-black uppercase tracking-wider mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Gateway Verification In Progress
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Authenticating {candidateName}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Querying Government & Dual-Bureau Gateways via Real-Time API Pipeline
              </p>
            </div>
          </div>

          {/* Smooth Linear Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-600 uppercase tracking-wide flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Verification Pipeline Status
              </span>
              <span className="text-indigo-600 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step-by-Step Interactive Timeline */}
          <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div 
                  key={step.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-white border border-indigo-200 shadow-sm scale-[1.01]' 
                      : isDone 
                      ? 'opacity-85' 
                      : 'opacity-40'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 border ${
                    isDone 
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                      : isCurrent 
                      ? step.color 
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <StepIcon className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-black ${isCurrent ? 'text-indigo-950' : 'text-slate-700'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 animate-pulse">
                          Processing...
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Cleared ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {step.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Interactive Security Insights Carousel */}
          <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white p-3.5 rounded-2xl border border-indigo-100 flex items-start gap-3 shadow-2xs">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
              <TipIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Security Architecture</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-black text-slate-900">{currentTip.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-relaxed">
                {currentTip.desc}
              </p>
            </div>
          </div>

          {/* Fallback Cancel / Background Execution Button */}
          {onCancel && (
            <div className="flex justify-end pt-1">
              <button
                onClick={onCancel}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Run in background & close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
