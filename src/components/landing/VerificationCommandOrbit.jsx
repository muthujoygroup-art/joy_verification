import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Scale, 
  CreditCard, 
  QrCode, 
  FileCheck, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  RefreshCw,
  Check,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

const ORBIT_MODULES = [
  {
    id: 'identity',
    title: 'Government ID & Photo Match',
    badge: 'INSTANT IDENTITY',
    icon: ShieldCheck,
    color: 'from-emerald-500 via-teal-500 to-cyan-600',
    turnaround: 'Under 30 Seconds',
    accuracy: '100% Verified',
    image3d: '/assets/3d/hero_3d_verification.jpg',
    summary: 'Instantly verify Aadhaar, PAN, and government IDs with live selfie camera match to eliminate fake profiles and impersonation.',
    benefits: [
      'Instant Aadhaar & PAN validation directly with official registries',
      'Live selfie check matches candidate face to government ID photo',
      'Zero physical paper copies or manual data entry needed',
      '100% compliant with government privacy and DPDP Act standards'
    ],
    previewCard: {
      checkName: 'Identity & Liveness Verification',
      idNumber: 'PAN: ABCDE****F • Aadhaar Masked',
      holderName: 'Deepak Sharma',
      matchStatus: 'Photo & Name Match: 100%',
      resultBadge: 'GENUINE & VERIFIED'
    }
  },
  {
    id: 'employment',
    title: 'Past Employment & Experience',
    badge: 'WORK HISTORY',
    icon: FileCheck,
    color: 'from-blue-600 via-indigo-600 to-slate-800',
    turnaround: 'Instant Verification',
    accuracy: 'Verified Records',
    image3d: '/assets/3d/corporate_3d_bgv.jpg',
    summary: 'Confirm past company names, job titles, joining dates, and exit details in minutes without waiting weeks for HR phone calls.',
    benefits: [
      'Automated tenure and work history confirmation',
      'Validates authentic relieving letters and experience credentials',
      'Flags inflated designations or fabricated resume timelines',
      'Replaces slow manual reference calls with instant data validation'
    ],
    previewCard: {
      checkName: 'Past Employment Validation',
      idNumber: 'Previous Employer: Apex Cloud Systems (3.5 yrs)',
      holderName: 'Designation: Senior Cloud Engineer',
      matchStatus: 'Service Dates & Exit Relieving Confirmed',
      resultBadge: 'VERIFIED HISTORY'
    }
  },
  {
    id: 'moonlighting',
    title: 'Dual-Employment & Moonlighting',
    badge: 'CONFLICT OF INTEREST',
    icon: Search,
    color: 'from-amber-500 via-orange-500 to-rose-600',
    turnaround: 'Real-Time Alert',
    accuracy: '100% Reliable',
    image3d: '/assets/3d/corporate_shield_vault_3d.jpg',
    summary: 'Detect active concurrent jobs and overlapping employment tenures to protect company data and prevent productivity loss.',
    benefits: [
      'Identifies undeclared second jobs and overlapping payrolls',
      'Protects intellectual property and confidential client data',
      'Prevents productivity loss and contractor compliance risks',
      'Clear, actionable reports showing exact start and end timelines'
    ],
    previewCard: {
      checkName: 'Moonlighting & Conflict Radar',
      idNumber: 'Concurrent Active Payrolls: 0',
      holderName: 'Tenure Status: Single Active Employer',
      matchStatus: 'Zero Overlapping Employment Conflicts',
      resultBadge: 'CLEAN PROFILE'
    }
  },
  {
    id: 'court',
    title: 'Court & Criminal Record Search',
    badge: 'LEGAL CLEARANCE',
    icon: Scale,
    color: 'from-indigo-600 via-purple-600 to-pink-600',
    turnaround: 'Nationwide Search',
    accuracy: 'Comprehensive',
    image3d: '/assets/3d/security_3d_shield.jpg',
    summary: 'Scan national civil, criminal, and high court records across India to ensure your workplace remains safe and trustworthy.',
    benefits: [
      'Nationwide screening across district, state, and central courts',
      'Checks for pending civil lawsuits, criminal charges, and fraud flags',
      'Smart phonetic name matching accounts for regional spelling variations',
      'Protects your brand reputation and physical workplace safety'
    ],
    previewCard: {
      checkName: 'National Court & Judicial Search',
      idNumber: 'Search Scope: Civil, Criminal & High Courts',
      holderName: 'Jurisdiction: Pan-India Database',
      matchStatus: '0 Adverse Proceedings or Court Cases Found',
      resultBadge: 'CLEAR BACKGROUND'
    }
  },
  {
    id: 'bank',
    title: 'Bank Account & Salary Validation',
    badge: 'FINANCIAL INTEGRITY',
    icon: CreditCard,
    color: 'from-teal-600 via-emerald-600 to-cyan-700',
    turnaround: 'Instant Check',
    accuracy: 'Official Banking Rails',
    image3d: '/assets/3d/liquid_glass_vault_3d.jpg',
    summary: 'Validate candidate bank accounts with real-time account holder name matching before payroll setup to prevent salary fraud.',
    benefits: [
      'Instant ₹1 penny-drop validation with registered bank branch',
      'Confirms the bank account actually belongs to the hired candidate',
      'Prevents payroll disbursement errors and contractor kickbacks',
      'Eliminates ghost workers and phantom accounts on your payroll'
    ],
    previewCard: {
      checkName: 'Bank Account Name Verification',
      idNumber: 'Account: State Bank of India • Branch Verified',
      holderName: 'Beneficiary Name: Deepak Sharma',
      matchStatus: 'Name Match: 100% Exact Match',
      resultBadge: 'ACCOUNT VERIFIED'
    }
  },
  {
    id: 'pass',
    title: 'Digital Employee Pass & QR Badge',
    badge: 'WORKFORCE PASS',
    icon: QrCode,
    color: 'from-emerald-600 via-teal-600 to-emerald-800',
    turnaround: 'Instant Download',
    accuracy: 'Tamper-Proof QR',
    image3d: '/assets/3d/labor_3d_management.jpg',
    summary: 'Issue certified digital employee badges and scannable QR passes for instant on-site identification at office gates and industrial plants.',
    benefits: [
      'Instant digital QR badge sent to employee mobile phone',
      'Security guards can scan with any phone camera to verify identity',
      'Automated compliance records for factory audits and contractor muster rolls',
      'Tamper-proof digital credentials that cannot be forged or duplicated'
    ],
    previewCard: {
      checkName: 'Digital Employee Access Badge',
      idNumber: 'Pass ID: JOY-PASS-88492 • Active Badge',
      holderName: 'Facility Access: Authorized Tier-1 Clearance',
      matchStatus: 'Biometrics & Statutory Papers Completed',
      resultBadge: 'ACCESS APPROVED'
    }
  }
];

export const VerificationCommandOrbit = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [viewMode, setViewMode] = useState('benefits'); // 'benefits' | 'certificate'
  const activeModule = ORBIT_MODULES[activeIdx];

  const handleSelectModule = (idx) => {
    soundEngine.playClick();
    setActiveIdx(idx);
  };

  const handleRunTest = () => {
    if (isSimulating) return;
    soundEngine.playScan();
    setIsSimulating(true);
    setTimeout(() => {
      soundEngine.playSuccess();
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: 6 Module Selector Cards (lg:col-span-5) */}
        <div className="lg:col-span-5 dark-glass-card border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl backdrop-blur-xl">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>CORE SCREENING CHECKS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit mb-2">
              Select a Verification Check
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-5">
              Click any module to see how JOY Verification protects your hiring and delivers instant, reliable results.
            </p>

            {/* List of 6 Module Buttons */}
            <div className="flex flex-col gap-2.5">
              {ORBIT_MODULES.map((mod, idx) => {
                const Icon = mod.icon;
                const isSelected = activeIdx === idx;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleSelectModule(idx)}
                    className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-800 text-white shadow-xl ring-2 ring-emerald-500/40 scale-[1.02]'
                        : 'bg-white/85 border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                          isSelected
                            ? `bg-emerald-500 text-slate-950 font-black shadow-sm`
                            : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm font-outfit leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {mod.title}
                        </h4>
                        <span className={`text-[10px] block mt-0.5 font-mono font-bold tracking-wider uppercase ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {mod.badge}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                        isSelected 
                          ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30' 
                          : 'text-slate-600 bg-slate-100 border-slate-200'
                      }`}>
                        {mod.turnaround}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All 6 Screening Engines Active
            </span>
            <span className="text-slate-500 font-mono text-[11px]">100% Automated</span>
          </div>

        </div>

        {/* Right Column: Feature Breakdown & Interactive Preview (lg:col-span-7) */}
        <div className="lg:col-span-7 dark-glass-card border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl backdrop-blur-xl">
          
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeModule.color} flex items-center justify-center text-white font-black shadow-md shadow-slate-900/20 shrink-0`}>
                  <activeModule.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-bold block">
                    {activeModule.badge}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 font-outfit">
                    {activeModule.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'benefits' ? 'certificate' : 'benefits')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{viewMode === 'benefits' ? 'View Sample Certificate' : 'View Key Benefits'}</span>
                </button>

                <button
                  onClick={handleRunTest}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/25 border border-emerald-500 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Verifying...' : 'Simulate Check'}</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-4 font-normal">
              {activeModule.summary}
            </p>

            {/* 3D Module Feature Showcase Viewport */}
            <div className="w-full relative rounded-2xl overflow-hidden aspect-[16/7] border border-slate-200 bg-slate-950 mb-6 shadow-sm group">
              <img
                src={activeModule.image3d}
                alt={activeModule.title}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

              {isSimulating && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] z-20 animate-laser-vertical"></div>
              )}

              <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/50 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{activeModule.turnaround}</span>
              </div>

              <div className="absolute bottom-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/50 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-md">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>{activeModule.accuracy}</span>
              </div>
            </div>

            {/* Switchable View: Benefits or Sample Certificate */}
            {viewMode === 'benefits' ? (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-amber-800 font-bold mb-3">
                  Key Business Benefits:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {activeModule.benefits.map((benefit, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 leading-snug font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black text-slate-900 font-outfit">
                      Certified Verification Result
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {activeModule.previewCard.resultBadge}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Check Type:</span>
                    <span className="text-slate-900 font-bold">{activeModule.previewCard.checkName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Reference / Record:</span>
                    <span className="text-slate-700">{activeModule.previewCard.idNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Candidate / Title:</span>
                    <span className="text-amber-800 font-medium">{activeModule.previewCard.holderName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Verification Outcome:</span>
                    <span className="text-emerald-700 font-bold">{activeModule.previewCard.matchStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center">
              <div>
                <span className="text-[10px] text-slate-600 block font-semibold uppercase">Turnaround</span>
                <span className="text-sm font-black text-amber-700">{activeModule.turnaround}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 block font-semibold uppercase">Accuracy</span>
                <span className="text-sm font-black text-emerald-700">{activeModule.accuracy}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 block font-semibold uppercase">Compliance</span>
                <span className="text-sm font-black text-orange-700">100% Legal</span>
              </div>
            </div>

          </div>

          {/* Bottom Action */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-600">
              Ready to automate this check for your company?
            </span>
            <a
              href="#roi-calculator"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-600/25 border border-orange-500 transition-all cursor-pointer"
            >
              <span>Calculate Your Savings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VerificationCommandOrbit;
