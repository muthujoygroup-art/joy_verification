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
    <div className="w-full dark-glass-card border border-amber-500/20 rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-amber-500/15 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>HOW IT WORKS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Verify Candidates in 4 Simple Steps
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            From sending an invitation to downloading a certified report, the entire process takes minutes instead of weeks.
          </p>
        </div>

        {/* Play/Pause Autoplay Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-200 text-xs font-bold flex items-center gap-2 border border-amber-500/20 transition-all cursor-pointer shadow-xs"
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
                  ? 'bg-gradient-to-br from-amber-950/80 via-orange-950/60 to-slate-900 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50 scale-[1.02]'
                  : 'bg-slate-900/40 border-amber-500/10 text-slate-300 hover:border-amber-500/30 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-amber-400 font-outfit">
                  STEP {s.stepNumber}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isActive ? `bg-gradient-to-br ${s.color} text-slate-950 font-black shadow-md` : 'bg-white/10 text-slate-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white font-outfit">
                  {s.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {s.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Showcase Card */}
      <div className="bg-[#0c101d]/90 border border-amber-500/20 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
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
                <div key={vIdx} className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/15 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 text-center shadow-xl">
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 bg-gradient-to-br ${step.color} flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30`}>
                <step.icon className="w-8 h-8" />
              </div>
              <h5 className="text-base font-bold text-white font-outfit mb-1">
                {step.title}
              </h5>
              <p className="text-xs text-amber-300 font-medium mb-4">
                {step.subtitle}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                <Check className="w-3.5 h-3.5" />
                <span>Fully Automated in Platform</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default InteractiveProcessPipeline;
