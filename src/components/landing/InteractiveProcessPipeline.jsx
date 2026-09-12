import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Camera, 
  Search, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Pause, 
  RefreshCw,
  Zap,
  Lock,
  Download,
  Sparkles,
  Check
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const PIPELINE_STEPS = [
  {
    stepNumber: '01',
    id: 'magic-link',
    title: '1-Click Invite Link',
    subtitle: 'Sent via WhatsApp or SMS',
    icon: Smartphone,
    color: 'from-amber-500 via-orange-500 to-rose-500',
    description: 'HR initiates the check with just the candidate’s mobile number. The candidate receives an instant, secure link. No app download needed.',
    visualData: {
      channel: 'Instant WhatsApp & SMS Delivery',
      recipient: 'Candidate (+91 98765 43210)',
      timeToOpen: 'Average 45 seconds to open',
      experience: '100% Mobile Browser Friendly'
    }
  },
  {
    stepNumber: '02',
    id: 'liveness',
    title: '2-Minute Self KYC & Selfie',
    subtitle: 'Photo & Document Upload',
    icon: Camera,
    color: 'from-orange-500 via-rose-500 to-amber-600',
    description: 'The candidate snaps a quick live selfie and uploads their ID. Smart face matching ensures the person in front of the camera matches their official government ID.',
    visualData: {
      facialMatch: '100% Live Face Match Confirmed',
      documentCheck: 'Aadhaar / PAN Details Auto-Read',
      timeTaken: 'Completed in under 2 minutes',
      privacy: 'Government Data Redaction & Masking'
    }
  },
  {
    stepNumber: '03',
    id: 'checks',
    title: 'Automated Background Checks',
    subtitle: 'Employment, Legal & Bank',
    icon: Search,
    color: 'from-rose-500 via-amber-500 to-orange-600',
    description: 'Our platform automatically verifies past employment tenures, checks for undeclared moonlighting jobs, scans nationwide court records, and validates bank accounts in parallel.',
    visualData: {
      employmentCheck: 'Work History & Dates Confirmed',
      moonlightingCheck: 'Zero Overlapping Active Jobs',
      courtRecords: 'Pan-India Civil & Criminal Clean',
      bankValidation: 'Account Holder Name 100% Matched'
    }
  },
  {
    stepNumber: '04',
    id: 'report',
    title: 'Download Certified Report',
    subtitle: 'PDF Report & Digital QR Pass',
    icon: FileCheck,
    color: 'from-emerald-500 via-teal-500 to-amber-500',
    description: 'HR receives a certified, audit-ready PDF report with a digital verification badge. Ready for immediate offer letters, onboarding, or plant gate entry.',
    visualData: {
      outputFormat: 'Tamper-Proof PDF Dossier',
      qrBadge: 'Digital Scannable QR Employee Pass',
      auditTrail: 'Legally Compliant & Certified',
      hiringStatus: 'Ready for Immediate Onboarding'
    }
  }
];

export const InteractiveProcessPipeline = () => {
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
    setActiveStep(idx);
    setIsPlaying(false);
  };

  const step = PIPELINE_STEPS[activeStep];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>HOW IT WORKS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Verify Candidates in 4 Simple Steps
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            From sending an invitation to downloading a certified report, the entire process takes minutes instead of weeks.
          </p>
        </div>

        {/* Play/Pause Autoplay Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 border border-slate-800 transition-all cursor-pointer shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPlaying ? 'Pause Walkthrough' : 'Auto-Play Walkthrough'}</span>
          </button>
        </div>
      </div>

      {/* 4 Step Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {PIPELINE_STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={s.id}
              onClick={() => handleStepClick(idx)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400/50 text-white shadow-xl ring-2 ring-emerald-400/30 scale-[1.02]'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-emerald-500/30 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-black font-outfit ${isActive ? 'text-white' : 'text-amber-400'}`}>
                  STEP {s.stepNumber}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isActive ? `bg-white/20 text-white font-black shadow-xs` : 'bg-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className={`font-bold text-sm font-outfit ${isActive ? 'text-white' : 'text-slate-100'}`}>
                  {s.title}
                </h4>
                <p className={`text-[11px] mt-0.5 ${isActive ? 'text-emerald-100 font-medium' : 'text-slate-400'}`}>
                  {s.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Showcase Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>STEP {step.stepNumber} OF 04</span>
            </div>
            <h4 className="text-2xl font-black text-white font-outfit mb-3">
              {step.title}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
              {step.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(step.visualData).map(([key, val], vIdx) => (
                <div key={vIdx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Isometric Pipeline Centerpiece */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl group relative">
              {/* 3D Isometric Render */}
              <div className="relative aspect-[16/11] bg-slate-950 overflow-hidden">
                <img
                  src="/assets/3d/easy_3step_verify_3d.jpg"
                  alt="3D 3-Step Automated Verification Pipeline"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                  loading="lazy"
                />

                {/* Overlaid Active Step Pill */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/60 font-mono text-[10px] text-amber-300 font-bold flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>ACTIVE: STEP {step.stepNumber} — {step.title}</span>
                </div>

                {/* Sub-second latency badge */}
                <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/60 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-md">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>Sub-60s Automated TAT</span>
                </div>
              </div>

              {/* Bottom Step Context Footer */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-white font-outfit">
                    {step.title}
                  </h5>
                  <p className="text-[11px] text-amber-400 font-medium">
                    {step.subtitle}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>100% Automated</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default InteractiveProcessPipeline;
