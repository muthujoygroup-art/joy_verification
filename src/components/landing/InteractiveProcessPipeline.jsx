import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Fingerprint, 
  Cpu, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Pause, 
  RefreshCw,
  Zap,
  Lock,
  Download,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const PIPELINE_STEPS = [
  {
    stepNumber: '01',
    id: 'magic-link',
    title: 'Zero-App Magic Link',
    subtitle: 'Candidate Identity & Consent',
    icon: Smartphone,
    color: 'from-cyan-500 to-blue-600',
    description: 'HR initiates verification with candidate phone or email. Candidate receives an encrypted, time-bounded magic link requiring zero app downloads.',
    visualData: {
      action: 'SMS / WhatsApp Dispatch',
      target: '+91 98765 43210',
      status: 'LINK ACCESSED (12s TAT)',
      security: 'TLS 1.3 • AES-256 Consent'
    }
  },
  {
    stepNumber: '02',
    id: 'liveness',
    title: 'AI Facial Liveness',
    subtitle: '3D Face Mesh & Anti-Spoof',
    icon: Fingerprint,
    color: 'from-blue-600 to-indigo-600',
    description: 'Candidate completes a 3-second live selfie check. Proprietary 3D face mesh verifies real human presence and matches official document photographs.',
    visualData: {
      action: 'Biometric Depth Analysis',
      faceMeshPoints: '468 Landmark Nodes',
      status: 'LIVENESS MATCH (99.8%)',
      security: 'ISO 30107-3 Compliant'
    }
  },
  {
    stepNumber: '03',
    id: 'radar',
    title: 'Cryptographic Pipeline',
    subtitle: 'Moonlighting & Judicial Radar',
    icon: Cpu,
    color: 'from-indigo-600 to-purple-600',
    description: 'The engine scans career service histories for dual-employment overlaps, performs judicial tribunal checks, and validates bank accounts in parallel.',
    visualData: {
      action: 'Concurrent Database Scan',
      tenureConflict: '0 Overlaps Found',
      status: 'ALL ENGINES CLEARED',
      security: 'Sub-45s Deterministic Output'
    }
  },
  {
    stepNumber: '04',
    id: 'dossier',
    title: 'SHA-256 Audit Dossier',
    subtitle: 'DPDP Certified Report',
    icon: FileCheck,
    color: 'from-purple-600 to-pink-600',
    description: 'An immutable PDF dossier is compiled, stamped with SHA-256 cryptographic hashes, and made instantly available for HR review or plant gate pass activation.',
    visualData: {
      action: 'PDF Dossier & QR Badge',
      hashSignature: 'SHA256: 7f8a9...b34c2',
      status: 'AUDIT-READY CERTIFIED',
      security: 'DPDP Act 2023 Compliant'
    }
  }
];

const InteractiveProcessPipeline = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          const next = (prev + 1) % PIPELINE_STEPS.length;
          soundEngine.playClick();
          return next;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleStepClick = (idx) => {
    soundEngine.playClick();
    setIsPlaying(false);
    setActiveStep(idx);
  };

  const currentStep = PIPELINE_STEPS[activeStep];

  return (
    <div className="w-full dark-glass-card border border-white/15 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Top Header with Auto-Play Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>KINETIC WORKFLOW ENGINE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            How TrueProfile Verifies in Under 45 Seconds
          </h3>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            setIsPlaying(!isPlaying);
          }}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/20'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isPlaying ? 'Pause Automated Flow' : 'Play Automated Pipeline'}</span>
        </button>
      </div>

      {/* 4-Step Interactive Navigation Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(idx)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50 scale-[1.02]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
              }`}
            >
              {/* Top Row: Step Number & Icon */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-cyan-400">
                  STAGE {step.stepNumber}
                </span>
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500 text-white shadow-md' : 'bg-white/10 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white font-outfit">{step.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{step.subtitle}</p>
              </div>

              {/* Active Step Progress Indicator Bar */}
              {isSelected && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Active Stage Interactive Visualizer */}
      <div className="bg-[#050811]/90 border border-white/15 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
        
        {/* Left: Stage Description & Key Metrics (lg:col-span-6) */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center text-white shadow-lg shadow-cyan-500/30`}>
              <currentStep.icon className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                STAGE {currentStep.stepNumber} // PIPELINE EXECUTION
              </span>
              <h4 className="text-2xl font-black text-white font-outfit">
                {currentStep.title}
              </h4>
            </div>
          </div>

          <p className="text-slate-200 text-sm leading-relaxed">
            {currentStep.description}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">Status Output</span>
              <span className="text-xs font-bold text-emerald-400 block mt-0.5">{currentStep.visualData.status}</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">Security Standard</span>
              <span className="text-xs font-bold text-cyan-300 font-mono block mt-0.5">{currentStep.visualData.security}</span>
            </div>
          </div>
        </div>

        {/* Right: Live Graphic Representation of Stage (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-black/60 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner min-h-[240px]">
          
          {activeStep === 0 && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-lg animate-bounce">
                <Smartphone className="w-8 h-8" />
              </div>
              <span className="font-mono text-xs text-white font-bold">📲 Encrypted Magic Link Dispatched</span>
              <p className="text-slate-400 text-xs max-w-xs">
                Sent to candidate via WhatsApp & SMS with 1-click biometric consent.
              </p>
            </div>
          )}

          {activeStep === 1 && (
            <div className="flex flex-col items-center gap-3 relative">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/20 border-2 border-blue-400/60 flex items-center justify-center text-blue-400 shadow-xl relative overflow-hidden">
                <Fingerprint className="w-10 h-10" />
                <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-laser-vertical"></div>
              </div>
              <span className="font-mono text-xs text-white font-bold">👤 3D Face Mesh Liveness Verified</span>
              <p className="text-slate-400 text-xs max-w-xs">
                468 facial landmark depth nodes verified in under 3 seconds.
              </p>
            </div>
          )}

          {activeStep === 2 && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-400 shadow-lg animate-pulse">
                <Cpu className="w-8 h-8" />
              </div>
              <span className="font-mono text-xs text-white font-bold">⚡ Dual-Employment Radar Active</span>
              <p className="text-slate-400 text-xs max-w-xs">
                Cross-referencing past employment tenures & judicial registries simultaneously.
              </p>
            </div>
          )}

          {activeStep === 3 && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-lg">
                <FileCheck className="w-8 h-8" />
              </div>
              <span className="font-mono text-xs text-white font-bold">📜 SHA-256 Stamped Audit Dossier</span>
              <p className="text-slate-400 text-xs max-w-xs">
                PDF compliance certificate generated & ready for instantaneous download.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default InteractiveProcessPipeline;
