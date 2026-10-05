import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  Smartphone,
  ArrowRight,
  Sparkles,
  CreditCard,
  FileText,
  Zap,
  Scale,
  Search,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
  Clock,
  Eye,
  Award,
  Globe,
  Database,
  Users,
  HardHat,
  Fingerprint,
  MessageSquare,
  FileSpreadsheet,
  QrCode,
  Check,
  Play,
  Share2,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { soundEngine } from '../../utils/uiSoundEffects';

export const GoogleStyleProductExplorer = ({ onOpenDemoModal, onOpenTourModal }) => {
  const navigate = useNavigate();

  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Live Simulator State
  const [simActive, setSimActive] = useState(false);
  const [simCheckIndex, setSimCheckIndex] = useState(0);
  const [simCompleted, setSimCompleted] = useState(false);

  const categories = [
    { id: 'all', label: 'All Products & Ecosystem', count: 18, icon: Layers },
    { id: 'enterprise', label: 'For HR & Enterprises', count: 5, icon: Building2 },
    { id: 'candidates', label: 'For Candidates', count: 4, icon: Smartphone },
    { id: 'vendors', label: 'For Vendors & CLRA', count: 3, icon: HardHat },
    { id: 'statutory_apis', label: 'Statutory Verification Rails', count: 4, icon: Zap },
    { id: 'security', label: 'Data Privacy & Security', count: 2, icon: ShieldCheck }
  ];

  const products = [
    // 1. HR & Enterprises
    {
      id: 'hr_workstation',
      category: 'enterprise',
      title: 'HR Executive Workstation',
      tagline: 'High-Volume Candidate Pipeline & Verification Hub',
      description: 'Single and 500+ candidate Excel bulk uploads, automated WhatsApp magic link dispatch, real-time status telemetry, and 1-click dossier export.',
      icon: UserCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'Core Recruiter Tool',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      features: ['500+ Excel Bulk Import', '1-Click WhatsApp Link Dispatch', 'Instant PDF Dossier Generation'],
      actionLabel: 'Explore HR Workstation',
      actionType: 'portal',
      portalPath: '/company/comp-1/hr/hr-1/candidates'
    },
    {
      id: 'company_admin',
      category: 'enterprise',
      title: 'Company Admin Console',
      tagline: 'Corporate Governance, Roster & Invoicing',
      description: 'Enterprise control center to manage HR team quotas, customize company branding on certificates, and oversee monthly postpaid 18% GST tax invoices.',
      icon: Building2,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      badge: 'Corporate HQ',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      features: ['HR Recruiter Provisioning', 'Postpaid Wallet & Invoicing', 'Company Logo Stamping'],
      actionLabel: 'Launch Company Console',
      actionType: 'portal',
      portalPath: '/company/comp-1/dashboard'
    },
    {
      id: 'super_admin',
      category: 'enterprise',
      title: 'Super Admin Master Console',
      tagline: 'Platform Governance & Multi-Tenant Registry',
      description: 'Master platform management overseeing tenant enterprise activations, dynamic per-check pricing rates, and real-time government API latency telemetry.',
      icon: Cpu,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'Platform Master',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      features: ['Dynamic Pricing Engine', 'Live Gateway Latency Telemetry', 'Universal Profile Locator'],
      actionLabel: 'Super Admin Hub',
      actionType: 'portal',
      portalPath: '/superadmin'
    },
    {
      id: 'excel_bulk_engine',
      category: 'enterprise',
      title: 'Excel Bulk Batch Dispatcher',
      tagline: 'Batch Verification for 500+ Workers in Seconds',
      description: 'Upload standard CSV or Excel rosters. Our engine automatically parses phone numbers, assigns unique 4-digit PINs, and fires instant WhatsApp links in parallel.',
      icon: FileSpreadsheet,
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200',
      badge: 'Mass Scaling',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      features: ['Zero Data Entry Overhead', 'Automated PIN Generation', 'Live Batch Completion Meter'],
      actionLabel: 'View Bulk Workflow',
      actionType: 'demo'
    },
    {
      id: 'postpaid_billing',
      category: 'enterprise',
      title: 'Postpaid Metered Billing & Tax Invoices',
      tagline: 'Transparent B2B Billing with 18% GST Invoicing',
      description: 'Eliminate upfront credits or complex retainers. Pay only for successfully verified candidate checks at the end of each billing cycle with automated GST invoices.',
      icon: CreditCard,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Zero Upfront Lock-in',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      features: ['Pay-Per-Verified-Check', 'Automated 18% GST Invoices', 'Razorpay Instant Settlement'],
      actionLabel: 'View Pricing Tiers',
      actionType: 'navigate',
      path: '/pricing'
    },

    // 2. Candidates & Individuals
    {
      id: 'candidate_mobile',
      category: 'candidates',
      title: 'Candidate Mobile Portal',
      tagline: 'Zero-App Web Flow on WhatsApp & SMS',
      description: 'Candidates complete frictionless self-verification in under 2 minutes directly in their smartphone browser. No app store downloads or complicated logins required.',
      icon: Smartphone,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Under 2 Minutes',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      features: ['No App Download Required', '4-Digit PIN Security', 'Works on Any Mobile Browser'],
      actionLabel: 'Try Candidate Demo',
      actionType: 'portal',
      portalPath: '/verify'
    },
    {
      id: 'face_liveness',
      category: 'candidates',
      title: '3D AI Facial Liveness & Anti-Spoofing',
      tagline: 'Craniofacial Depth Verification in Real-Time',
      description: 'Active anti-spoofing engine compares candidate webcam selfie with official Aadhaar ID photo, detecting screen replays, photo cutouts, and AI deepfakes.',
      icon: Eye,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: '99.4% Precision',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      features: ['Anti-Spoofing Depth Scan', 'Aadhaar Photo Match', 'Sub-Second AI Result'],
      actionLabel: 'See Liveness Tech',
      actionType: 'demo'
    },
    {
      id: 'candidate_pin_security',
      category: 'candidates',
      title: '4-Digit Mobile PIN Lock',
      tagline: 'Personalized Multi-Factor Link Protection',
      description: 'Every candidate magic link is guarded by a private 4-digit security PIN delivered exclusively to their registered mobile number, preventing link interception.',
      icon: Lock,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'Anti-Hijacking',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      features: ['Single-Use 72h Token', 'Device & IP Fingerprinting', 'DPDP Consent Gated'],
      actionLabel: 'Security Overview',
      actionType: 'navigate',
      path: '/privacy-policy'
    },
    {
      id: 'candidate_joining_form',
      category: 'candidates',
      title: 'Smart Digital Joining Form',
      tagline: 'Paperless Onboarding & KYC Auto-Fill',
      description: 'Candidate particulars (Full Name, Father Name, DOB, Address, Emergency Contact) are populated automatically from verified government e-KYC records.',
      icon: FileText,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      badge: 'Zero Manual Typing',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      features: ['e-KYC Auto-Population', 'Emergency Contact Capture', 'Digital Signature Stamp'],
      actionLabel: 'Explore Form Flow',
      actionType: 'demo'
    },

    // 3. Vendors & Contractors
    {
      id: 'vendor_portal',
      category: 'vendors',
      title: 'Vendor Due Diligence Studio',
      tagline: '11-Point Statutory Audit for B2B Contractors',
      description: 'Dedicated portal for third-party manpower agencies, security providers, and facility contractors to complete automated statutory compliance onboarding.',
      icon: HardHat,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'B2B Contractor Due Diligence',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      features: ['MCA CIN & LLPIN Verification', 'GSTIN Filing Track Record', 'Corporate Bank IMPS Check'],
      actionLabel: 'Open Vendor Studio',
      actionType: 'portal',
      portalPath: '/vendor/verify'
    },
    {
      id: 'clra_labor_license',
      category: 'vendors',
      title: 'CLRA Labor License Tracker',
      tagline: 'Statutory Protection for Principal Employers',
      description: 'Validates contractor Contract Labour (Regulation & Abolition) license numbers, authorized worker counts, and expiration dates to prevent regulatory fines.',
      icon: Scale,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: '100% Legal Protection',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      features: ['Form XVI Muster Compliance', 'Authorized Workforce Limits', 'Automatic Expiry Alerts'],
      actionLabel: 'Learn CLRA Rules',
      actionType: 'modal',
      modalType: 'legal_handbook'
    },
    {
      id: 'vendor_risk_matrix',
      category: 'vendors',
      title: 'Vendor Risk & Compliance Score',
      tagline: 'Real-Time Financial & Legal Trust Rating',
      description: 'Automatically analyzes GST return consistency (GSTR-1 & 3B), litigation court history, and active company status to score vendor reliability.',
      icon: Activity,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'Automated Scoring',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      features: ['Tax Filing Consistency Check', 'Directorship Conflict Audit', 'Audit-Ready Master PDF'],
      actionLabel: 'View Audit Specs',
      actionType: 'demo'
    },

    // 4. Statutory Verification Rails
    {
      id: 'aadhaar_pan_rail',
      category: 'statutory_apis',
      title: 'UIDAI & NSDL Identity Rails',
      tagline: 'Direct National Registry Authentication',
      description: 'Direct integration with UIDAI Aadhaar e-KYC and Income Tax Department NSDL registry for instantaneous demographic and identity verification.',
      icon: Zap,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'Sub-10s Latency',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      features: ['256-Bit Masked Aadhaar', 'PAN Holder Name Match', 'Zero Physical Scans'],
      actionLabel: 'Test Live Rail',
      actionType: 'simulator'
    },
    {
      id: 'epfo_moonlighting_rail',
      category: 'statutory_apis',
      title: 'EPFO Service & Dual Employment Rail',
      tagline: 'Universal Account Number (UAN) History',
      description: 'Queries official EPFO service records to verify complete past employment tenures, relieving dates, and automatically flag concurrent dual employment (moonlighting).',
      icon: Users,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      badge: 'Moonlighting Shield',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      features: ['UAN Service History Pull', 'Concurrent Job Detection', 'Past Employer Verification'],
      actionLabel: 'Test EPFO Check',
      actionType: 'simulator'
    },
    {
      id: 'bank_penny_drop_rail',
      category: 'statutory_apis',
      title: 'Bank Account Penny Drop (IMPS)',
      tagline: 'NPCI Direct Account Holder Validation',
      description: 'Transfers ₹1 via IMPS to instantly confirm the registered account holder name at the beneficiary branch, eliminating salary disbursement bounce errors.',
      icon: CreditCard,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      badge: 'Zero Payroll Bounces',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      features: ['Instant Account Validation', 'IFSC Branch Verification', 'Exact Name Match Score'],
      actionLabel: 'Test Bank Drop',
      actionType: 'simulator'
    },
    {
      id: 'digilocker_education_rail',
      category: 'statutory_apis',
      title: 'DigiLocker & Degree Verification',
      tagline: 'National Academic Depository (NAD) Links',
      description: 'Direct digital verification of university degrees, marksheets, and 10th/12th certificates through government-backed DigiLocker repositories.',
      icon: Award,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'Fake-Proof Degrees',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      features: ['University Credential Match', 'Roll Number & Passing Year', 'DigiLocker Certified Seal'],
      actionLabel: 'Explore DigiLocker',
      actionType: 'navigate',
      path: '/features'
    },

    // 5. Data Privacy & Security
    {
      id: 'tamper_proof_certificate',
      category: 'security',
      title: 'Tamper-Proof Certificate & Unique ID',
      tagline: 'Court-Admissible Dossier with Scannable QR',
      description: 'Every verified candidate receives an immutable Certificate ID (e.g. #JCS-VERIF-2026-101-889) backed by a live QR code and cryptographic SHA-256 digital seal.',
      icon: QrCode,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      badge: 'IT Act, 2000 Valid',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      features: ['Unique Certificate ID', 'Scannable Mobile QR Code', 'SHA-256 Cryptographic Stamp'],
      actionLabel: 'View Certificate Sample',
      actionType: 'portal',
      portalPath: '/certificate-preview'
    },
    {
      id: 'dpdp_zero_knowledge',
      category: 'security',
      title: 'Zero-Knowledge Architecture & DPDP 2023',
      tagline: 'Bank-Grade AES-256 & Ephemeral Memory',
      description: 'Candidate OTPs and raw identity tokens are scrubbed from server RAM immediately after verification. Sensitive PII is masked, and records are isolated per tenant.',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'DPDP Act 2023 Shield',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      features: ['Zero Permanent PII Storage', 'AES-256 & TLS 1.3 Encryption', 'Multi-Tenant Data Isolation'],
      actionLabel: 'Read Privacy Protocol',
      actionType: 'navigate',
      path: '/privacy-policy'
    }
  ];

  // Filtered Products based on Category and Search Query
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        product.title.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.badge.toLowerCase().includes(q) ||
        product.features.some(f => f.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  // Handle Product Card Action Click
  const handleAction = (product) => {
    soundEngine.playClick?.();
    if (product.actionType === 'portal' && product.portalPath) {
      navigate(product.portalPath);
    } else if (product.actionType === 'navigate' && product.path) {
      navigate(product.path);
    } else if (product.actionType === 'simulator') {
      startLiveSimulator();
    } else if (onOpenDemoModal) {
      onOpenDemoModal();
    }
  };

  // Run Live Sub-45s Verification Simulation
  const startLiveSimulator = () => {
    soundEngine.playScan?.();
    setSimActive(true);
    setSimCheckIndex(0);
    setSimCompleted(false);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setSimCheckIndex(step);
      if (step >= 4) {
        clearInterval(interval);
        setSimCompleted(true);
        soundEngine.playSuccess?.();
      }
    }, 450);
  };

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-200/80 select-none relative overflow-hidden" id="product-explorer">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-50/40 via-sky-50/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 🌟 1. GOOGLE-STYLE SECTION HEADER                                         */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold tracking-wide uppercase mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Product Ecosystem & Capabilities</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore all JOY TRUE PROFILE <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
              products and services
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover our complete suite of automated workforce verification portals, direct statutory rails, and cryptographic trust systems built for modern enterprises.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🔍 2. GOOGLE OMNISEARCH BAR & STATS BAR                                   */}
        {/* ========================================================================= */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, portals, or verification checks (e.g., Aadhaar, CLRA, Excel)..."
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-xs outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🏷️ 3. GOOGLE-STYLE CATEGORY PILL FILTER CHIPS                             */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none px-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.playClick?.();
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* ⚡ 4. INTERACTIVE LIVE TELEMETRY SIMULATOR CARD                            */}
        {/* ========================================================================= */}
        <div className="mb-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-indigo-900/50">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-indigo-500/30">
                <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Live Statutory Simulator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Experience sub-45-second verification in action
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                Watch how our direct API rails query UIDAI Aadhaar, NSDL PAN, Bank IMPS, and EPFO records in parallel with live telemetry feedback.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={startLiveSimulator}
                disabled={simActive && !simCompleted}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {simActive && !simCompleted ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Auditing Official Rails...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-slate-950" />
                    <span>Run Instant Verification Test</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-Time Telemetry Rails Checklist */}
          {simActive && (
            <div className="mt-6 pt-6 border-t border-indigo-800/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-fadeIn">
              {[
                { title: '1. UIDAI Aadhaar Rail', latency: '0.18s', detail: '256-Bit SHA OTP Match', step: 1 },
                { title: '2. NSDL PAN Tax Rail', latency: '0.24s', detail: 'Active Taxpayer Verified', step: 2 },
                { title: '3. Bank Penny Drop', latency: '0.31s', detail: 'NPCI IMPS Name Match', step: 3 },
                { title: '4. EPFO Service History', latency: '0.42s', detail: 'Zero Moonlighting Clear', step: 4 }
              ].map((item) => {
                const isPassed = simCheckIndex >= item.step;
                const isRunning = simCheckIndex === item.step - 1;
                return (
                  <div
                    key={item.step}
                    className={`p-3.5 rounded-xl border transition-all duration-300 ${
                      isPassed
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : isRunning
                        ? 'bg-indigo-900/60 border-indigo-400 animate-pulse text-indigo-200'
                        : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>{item.title}</span>
                      {isPassed ? (
                        <span className="text-emerald-400 font-mono text-[11px]">{item.latency} ✓</span>
                      ) : isRunning ? (
                        <span className="text-indigo-300 text-[10px] animate-pulse">Checking...</span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">Pending</span>
                      )}
                    </div>
                    <p className="text-[10.5px] opacity-80">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 📦 5. GOOGLE-STYLE BENTO PRODUCT CARDS GRID                                */}
        {/* ========================================================================= */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800">No products matching "{searchQuery}"</h4>
            <p className="text-xs text-slate-500 mt-1">Try searching for keywords like "Aadhaar", "CLRA", "Excel", or "Billing".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Top: Icon & Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${product.iconBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`badge text-[10px] py-0.5 px-2.5 font-bold border rounded-full ${product.badgeColor}`}>
                        {product.badge}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5 mb-3">
                      {product.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {product.description}
                    </p>

                    {/* Feature Bullets */}
                    <ul className="space-y-1.5 pt-3 border-t border-slate-100 mb-5 text-[11.5px] text-slate-700">
                      {product.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Bottom CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleAction(product)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 hover:border-indigo-600 font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 group/btn cursor-pointer"
                  >
                    <span>{product.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 6. BOTTOM BANNER: ENTERPRISE DEMO CTA                                   */}
        {/* ========================================================================= */}
        <div className="mt-16 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="badge badge-indigo text-[10px] font-bold mb-2">CUSTOM DEPLOYMENT</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Need custom statutory rails or enterprise API integration?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Talk to our solutions engineering team for on-premise deployments, private key HSM setups, and custom ATS/HRMS webhooks.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick?.();
                if (onOpenDemoModal) onOpenDemoModal();
              }}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Book Enterprise Demo
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick?.();
                navigate('/pricing');
              }}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              View Pricing
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GoogleStyleProductExplorer;
