import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  Zap, 
  HelpCircle, 
  Compass,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const ROLE_TOUR_STEPS = {
  superadmin: {
    roleTitle: 'Super Admin Master Console',
    steps: [
      {
        target: 'superadmin-analytics-tab',
        title: '1. Platform & Profit Analytics',
        description: 'Track real-time multi-tenant verification volumes, revenue gross margins, and active enterprise licenses.'
      },
      {
        target: 'superadmin-companies-tab',
        title: '2. Companies & Feature Matrix',
        description: 'Provision enterprise client tenants, configure custom KYC API suites, and adjust verification quota tiers.'
      },
      {
        target: 'superadmin-apiconfig-tab',
        title: '3. Dual Upstream API Gateways',
        description: 'Manage and test API keys for Server 1 (Sandbox API Gateway) and Server 2 (CoinCircleTrust 47+ APIs Gateway).'
      },
      {
        target: 'superadmin-billing-tab',
        title: '4. Metered Invoicing & Razorpay Ledger',
        description: 'Audit monthly metered billing, Razorpay wallet top-ups, and dispatch official GST tax invoices.'
      },
      {
        target: 'superadmin-dbms-tab',
        title: '5. Master DBMS Table Explorer',
        description: 'Direct SQL-like inspection of live SQLite database tables across Candidates, Companies, Invoices, and Logs.'
      }
    ]
  },
  company: {
    roleTitle: 'Company Admin Console',
    steps: [
      {
        target: 'company-quota-card',
        title: '1. Monthly Verification Quota Monitor',
        description: 'Track real-time verification consumption against your subscription plan tier and remaining quota balance.'
      },
      {
        target: 'company-registry-tab',
        title: '2. Master Employee Verification Registry',
        description: 'Inspect verified profiles, audit 60-day certificate expiry timelines, and download 10+ API verification reports.'
      },
      {
        target: 'company-hr-tab',
        title: '3. HR Recruitment Team Governance',
        description: 'Provision recruiter seats, assign department access, and monitor candidate link dispatch metrics.'
      },
      {
        target: 'company-dochub-tab',
        title: '4. Compliance Document Storage Hub',
        description: 'Access encrypted cloud document vaults, tax invoices, and official JOY Corporate compliance certificates.'
      },
      {
        target: 'company-settings-tab',
        title: '5. Upstream Server Engine Selector',
        description: 'Choose your upstream routing engine: Smart Hybrid Engine (Sandbox + CoinCircleTrust fallback), Server 1 Only, or Server 2 Only.'
      }
    ]
  },
  hrexecutive: {
    roleTitle: 'HR Executive Workstation',
    steps: [
      {
        target: 'hr-pipeline-tab',
        title: '1. Candidate Onboarding Pipeline',
        description: 'View active candidate profiles, filter by verification status, and audit 60-day certificate lifecycle deadlines.'
      },
      {
        target: 'hr-profiler-tab',
        title: '2. Create Profile & Select Verification Checks',
        description: 'Input candidate demographics and pick custom verification checks per employee with live Server 1 / Server 2 tags.'
      },
      {
        target: 'hr-bgv-dossier-btn',
        title: '3. 360° Multi-API Background Dossier',
        description: 'Inspect comprehensive 360° background verification reports combining Aadhaar, PAN, Bank, DL, Passport, and UAN.'
      },
      {
        target: 'hr-dispatch-btn',
        title: '4. Multi-Channel Magic Link Dispatch',
        description: 'Send encrypted verification links to candidates directly via WhatsApp, SMS, Email, or generate on-spot QR codes.'
      }
    ]
  },
  employee_link: {
    roleTitle: 'Candidate Verification Portal',
    steps: [
      {
        target: 'candidate-docs-gate',
        title: '1. Comprehensive Joining Form',
        description: 'Review and submit your 7-section digital onboarding details (Demographics, Contact, KYC, Education, Nominee).'
      },
      {
        target: 'candidate-aadhaar-gate',
        title: '2. Aadhaar UIDAI OTP Gate',
        description: 'Authenticate your identity in real-time via 6-digit UIDAI OTP verification.'
      },
      {
        target: 'candidate-mobile-gate',
        title: '3. Mobile Number SMS OTP Validation',
        description: 'Verify your active phone number with multi-carrier instant SMS OTP validation.'
      },
      {
        target: 'candidate-face-gate',
        title: '4. 3D WebCam Biometric Live Portrait',
        description: 'Capture a secure 3-angle facial liveness scan via camera for anti-spoofing biometric match.'
      }
    ]
  }
};

export const GuidedTourSpotlight = () => {
  const { currentRole } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const effectiveRole = currentRole || 'superadmin';
  const roleConfig = ROLE_TOUR_STEPS[effectiveRole] || ROLE_TOUR_STEPS.superadmin;
  const steps = roleConfig.steps || [];
  const roleTitle = roleConfig.roleTitle || 'Platform Guide';
  const currentStep = steps[currentStepIndex];

  // Listen for global launch_guided_tour event triggered from Navbar
  useEffect(() => {
    const handleLaunchTour = () => {
      setCurrentStepIndex(0);
      setIsOpen(true);
    };

    window.addEventListener('launch_guided_tour', handleLaunchTour);
    return () => window.removeEventListener('launch_guided_tour', handleLaunchTour);
  }, []);

  // Update target element spotlight position
  useEffect(() => {
    if (!isOpen || !currentStep) {
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(`[data-tour-step="${currentStep.target}"]`);
      if (el) {
        // Smooth scroll element into view if not in viewport
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = el.getBoundingClientRect();
        setTargetRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });
      } else {
        setTargetRect(null);
      }
    };

    // Allow dynamic tab transitions to settle
    const timer = setTimeout(updatePosition, 250);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, currentStepIndex, currentStep, currentRole]);

  if (!isOpen || !currentStep) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Tour completed!
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none animate-fadeIn">
      
      {/* Target Element Pulsing Beacon Halo (if element found on screen) */}
      {targetRect && (
        <div 
          style={{
            position: 'absolute',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: '18px',
            border: '2px solid #4f46e5',
            boxShadow: '0 0 0 6px rgba(79, 70, 229, 0.25), 0 0 30px rgba(79, 70, 229, 0.4)',
            transition: 'all 0.3s ease-in-out',
            pointerEvents: 'none'
          }}
          className="animate-pulse"
        >
          {/* Animated Directional Pointer Tag */}
          <div className="absolute -top-7 left-2 bg-indigo-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg uppercase tracking-wider">
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>Step {currentStepIndex + 1} Spotlight</span>
          </div>
        </div>
      )}

      {/* Ambient Dark Dimmer to highlight feature on screen */}
      <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs pointer-events-auto z-40 transition-opacity" onClick={handleComplete} />

      {/* Floating Guided Tour Card (Top on Mobile to avoid Bottom Nav overlap, Bottom-Right on Desktop) */}
      <div className="fixed top-4 left-3 right-3 max-w-sm mx-auto sm:max-w-none sm:top-auto sm:bottom-8 sm:right-8 sm:left-auto sm:w-[420px] bg-white border-2 border-indigo-600 rounded-3xl shadow-2xl p-5 pointer-events-auto text-slate-900 z-50 space-y-4 animate-modal-spring">
        
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Compass className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                Interactive Onboarding
              </span>
              <h4 className="font-extrabold text-slate-900 text-xs mt-0.5">
                {roleTitle}
              </h4>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Skip / Dismiss Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600">
            <span>👉</span>
            <h5>{currentStep.title}</h5>
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Progress Dots & Navigation Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
          
          {/* Step Progress Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex 
                    ? 'bg-indigo-600 w-5' 
                    : idx < currentStepIndex 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-200'
                }`}
                title={`Jump to Step ${idx + 1}`}
              />
            ))}
            <span className="text-[10px] font-bold text-slate-400 ml-1">
              {currentStepIndex + 1}/{steps.length}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="btn btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="btn btn-superadmin text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish 🎉' : 'Next Step 👉'}</span>
              {currentStepIndex < steps.length - 1 && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
