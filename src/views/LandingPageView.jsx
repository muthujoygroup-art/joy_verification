import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Smartphone, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Award, 
  Zap, 
  Check, 
  BarChart3, 
  Scale, 
  CreditCard, 
  ChevronRight, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  Layers,
  Send,
  Eye,
  X,
  Play,
  FileCheck,
  Clock,
  Briefcase,
  User,
  Shield,
  TrendingUp,
  CheckCircle,
  Laptop,
  CheckCheck,
  Menu
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LandingPageView = () => {
  const [monthlyHires, setMonthlyHires] = useState(250);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', company: '', email: '', phone: '', hires: '100-500' });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Live Simulator State
  const [selectedRoleSample, setSelectedRoleSample] = useState('engineer');
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(4); // 4 = fully verified

  const sampleRoles = {
    engineer: {
      title: 'Senior Software Engineer',
      candidateName: 'Rajesh Kumar Sundaram',
      checks: [
        { name: 'Aadhaar Identity & Address', status: 'UIDAI Verified ✓', time: '1.2s' },
        { name: 'PAN Card & Tax Legal Name', status: 'NSDL Match 100% ✓', time: '0.8s' },
        { name: 'EPFO Past Employment History', status: '3 Past Companies Verified ✓', time: '2.1s' },
        { name: 'Bank Account & Penny Drop', status: 'Active (HDFC Bank) ✓', time: '1.5s' },
        { name: 'AI Face Liveness Biometrics', status: 'Passed (99.4% Match) ✓', time: '3.0s' }
      ]
    },
    manager: {
      title: 'Finance & Operations Manager',
      candidateName: 'Sunita Sharma',
      checks: [
        { name: 'Aadhaar Identity & Address', status: 'UIDAI Verified ✓', time: '1.1s' },
        { name: 'PAN Card & Corporate CIN Link', status: 'NSDL Match 100% ✓', time: '0.9s' },
        { name: 'EPFO Service Timeline', status: '8.5 Years Verified ✓', time: '2.4s' },
        { name: 'Bank Account & Penny Drop', status: 'Active (ICICI Bank) ✓', time: '1.4s' },
        { name: 'National Court & Legal Check', status: 'Clean Record (0 Cases) ✓', time: '1.8s' }
      ]
    },
    field: {
      title: 'Logistics Specialist / Driver',
      candidateName: 'Vikram Singh',
      checks: [
        { name: 'Aadhaar Identity & Address', status: 'UIDAI Verified ✓', time: '1.0s' },
        { name: 'MoRTH Driving License (Sarathi)', status: 'Valid (LMV / Transport) ✓', time: '1.6s' },
        { name: 'Active Mobile & SIM Linkage', status: 'Verified Active Carrier ✓', time: '0.7s' },
        { name: 'Bank IMPS Penny Drop', status: 'Active (SBI Bank) ✓', time: '1.3s' },
        { name: 'AI Face Camera Liveness', status: 'Passed (Real-Time Live) ✓', time: '2.8s' }
      ]
    }
  };

  const handleRunSimulator = (roleKey) => {
    setSelectedRoleSample(roleKey);
    setSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 500);
    setTimeout(() => setSimStep(3), 1100);
    setTimeout(() => {
      setSimStep(4);
      setSimulating(false);
    }, 1800);
  };

  // ROI / Savings calculations
  const getPricePerCandidate = (hires) => {
    if (hires < 100) return 60;
    if (hires < 500) return 50;
    if (hires < 2000) return 42;
    return 35;
  };

  const currentPrice = getPricePerCandidate(monthlyHires);
  const monthlyCost = monthlyHires * currentPrice;
  const traditionalAgencyCost = monthlyHires * 450; // Traditional agencies charge ₹400-₹600
  const monthlySavings = traditionalAgencyCost - monthlyCost;
  const hoursSaved = Math.round(monthlyHires * 3.5); // Average 3.5 hours saved per onboarding

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
    }, 3000);
  };

  const portalGateways = [
    {
      role: 'superadmin',
      title: 'Super Admin Portal',
      url: '/superadmin',
      badge: 'Master Governance',
      badgeClass: 'badge-purple',
      icon: Crown,
      btnClass: 'btn-superadmin',
      accentBorder: 'border-indigo-200 hover:border-indigo-500',
      description: 'Platform master governance, 47-API telemetry, company tariff control, profit matrix, and live DBMS query explorer.',
      features: ['13 Governance Tabs', 'Company Margin & Profit Matrix', 'Live PostgreSQL DBMS', 'System Error Diagnostics']
    },
    {
      role: 'company',
      title: 'Company Admin Portal',
      url: '/company',
      badge: 'Employer Console',
      badgeClass: 'badge-cyan',
      icon: Building2,
      btnClass: 'btn-company',
      accentBorder: 'border-sky-200 hover:border-sky-500',
      description: 'Corporate client operations, HR recruiter oversight, Turnaround Time (TAT) analytics, and Master Employee Registry.',
      features: ['HR Staff Quota Allocation', 'Master Employee Registry', 'Encrypted Document Vault', '1-Click GST Invoices']
    },
    {
      role: 'hrexecutive',
      title: 'HR Executive Workstation',
      url: '/hr',
      badge: 'Recruiter Workstation',
      badgeClass: 'badge-emerald',
      icon: UserCheck,
      btnClass: 'btn-hrexecutive',
      accentBorder: 'border-emerald-200 hover:border-emerald-500',
      description: 'Candidate KYC profiling, custom 10+ check selection, WhatsApp/SMS magic link dispatch, and 360° BGV Dossiers.',
      features: ['Candidate Profiler & Configurator', 'WhatsApp, SMS & Email Dispatch', '360° Multi-API BGV Dossiers', '60-Day Expiry Lifecycle Tracker']
    },
    {
      role: 'employee_link',
      title: 'Candidate Employee Portal',
      url: '/verify?token=tok_sunita_412',
      badge: 'Candidate Gateway',
      badgeClass: 'badge-amber',
      icon: Smartphone,
      btnClass: 'btn-employee',
      accentBorder: 'border-amber-200 hover:border-amber-500',
      description: 'Passwordless token access for candidates to complete instant Aadhaar OTP, Mobile OTP, and 3-Pose AI WebCam face liveness.',
      features: ['Passwordless Magic Link', 'Instant UIDAI Aadhaar OTP', 'Carrier Mobile SMS OTP', '3-Pose AI WebCam Face Match']
    }
  ];

  const businessPillars = [
    {
      icon: Zap,
      color: 'text-amber-600 bg-amber-100',
      title: 'Instant 45-Second Verification',
      desc: 'Say goodbye to 2-week delays from manual agencies. Direct government repository APIs verify identity and past employment in seconds.'
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-100',
      title: 'Zero Moonlighting & Fake Experience',
      desc: 'Direct EPFO passbook audits uncover authentic employer history, joining dates, and overlapping employment timelines.'
    },
    {
      icon: CreditCard,
      color: 'text-indigo-600 bg-indigo-100',
      title: 'Day-1 Payroll & Bank Readiness',
      desc: 'Instant ₹1 IMPS penny drop validates candidate bank account numbers, IFSC codes, and matches legal names seamlessly.'
    },
    {
      icon: Smartphone,
      color: 'text-sky-600 bg-sky-100',
      title: '100% Mobile & Candidate-Friendly',
      desc: 'Candidates complete verification on their phone via WhatsApp or SMS in under 2 minutes with zero app installation.'
    },
    {
      icon: Lock,
      color: 'text-purple-600 bg-purple-100',
      title: 'DPDP Act 2023 & ISO 27001 Certified',
      desc: 'Bank-grade 256-bit encryption, strict candidate consent architecture, and automatic 60-day certified document lifecycles.'
    },
    {
      icon: Award,
      color: 'text-rose-600 bg-rose-100',
      title: 'Audit-Ready 360° PDF Dossiers',
      desc: 'Download consolidated executive compliance certificates and comprehensive background screening reports in 1 click.'
    }
  ];

  const faqs = [
    {
      q: 'How fast is the background verification process completed?',
      a: 'Instantaneous! Once the candidate opens their magic link on mobile and enters their OTP, all verification checks (Aadhaar, PAN, EPFO service history, Bank Penny Drop, and AI Face Liveness) complete in under 45 seconds.'
    },
    {
      q: 'How does JOY prevent fake experience certificates and moonlighting?',
      a: 'We connect directly to official government employment databases (EPFO Unified Portal) to retrieve authenticated employment timelines, past company legal names, and exact tenure dates.'
    },
    {
      q: 'How do candidates access their verification link?',
      a: 'HR recruiters can dispatch an encrypted, passwordless verification link directly to the candidate via WhatsApp, SMS, or Email. Candidates can also scan an on-spot QR code.'
    },
    {
      q: 'What are the dedicated sub-URLs for our team?',
      a: 'Super Admins can log in directly at /superadmin, Corporate Company Admins at /company, and HR Recruiters at /hr. Candidates access their unique token link at /verify?token=...'
    },
    {
      q: 'Is candidate data protected under privacy laws?',
      a: 'Yes. The entire platform is built in full compliance with the Digital Personal Data Protection (DPDP) Act 2023 and ISO 27001 information security standards with strict candidate consent verification.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 🌐 TOP ENTERPRISE NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group cursor-pointer">
            <img 
              src="/joy_logo.png" 
              alt="JOY CORPORATE SOLUTIONS PVT LTD Logo" 
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-none">
                  JOY CORPORATE SOLUTIONS
                </span>
                <span className="badge badge-purple text-[9px] py-0.5 px-2 hidden sm:inline-block font-black">
                  PVT LTD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Digital Solution for Recruitment & Payroll
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600">
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-indigo-600 transition-colors">Enterprise Benefits</a>
            <a href="#simulator" className="hover:text-indigo-600 transition-colors">Live Demo Simulator</a>
            <a href="#portals" className="hover:text-indigo-600 transition-colors">Portal Logins</a>
            <a href="#roi-calculator" className="hover:text-indigo-600 transition-colors">ROI Calculator</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowDemoModal(true)}
              className="btn btn-secondary text-xs py-2 px-3.5 font-bold hidden sm:flex items-center gap-1.5 cursor-pointer hover:border-indigo-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Book Demo</span>
            </button>

            <a
              href="#portals"
              className="btn btn-superadmin text-xs py-2 px-4 font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform"
            >
              <span>Sign In to Portals</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-fadeIn text-xs font-bold">
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-700 hover:text-indigo-600"
            >
              How It Works
            </a>
            <a 
              href="#benefits" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-700 hover:text-indigo-600"
            >
              Enterprise Benefits
            </a>
            <a 
              href="#simulator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-700 hover:text-indigo-600"
            >
              Live Demo Simulator
            </a>
            <a 
              href="#portals" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-700 hover:text-indigo-600"
            >
              Portal Logins
            </a>
            <a 
              href="#roi-calculator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-700 hover:text-indigo-600"
            >
              ROI Calculator
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowDemoModal(true);
              }}
              className="btn btn-superadmin w-full text-xs py-2.5 font-bold justify-center"
            >
              Schedule Live Demo 🚀
            </button>
          </div>
        )}
      </header>

      {/* 🚀 MODERN HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 border-b border-slate-200 hero-mesh-pattern">
        
        {/* Animated Background Gradient Orbs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-indigo-300/30 via-sky-200/30 to-purple-200/30 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-gradient-to-bl from-emerald-200/30 via-teal-200/20 to-sky-200/30 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-200 text-indigo-900 text-xs font-black shadow-sm backdrop-blur-sm animate-float-slow">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Next-Gen Candidate Verification & Payroll Onboarding</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
            Screen & Onboard Candidates in{' '}
            <span className="animated-gradient-text">
              Seconds, Not Weeks
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Eliminate candidate drop-offs and resume fraud. Automate identity verification, past employment checks, and bank penny drop with instant audit-ready certified dossiers.
          </p>

          {/* Hero CTAs */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#portals"
              className="btn btn-superadmin text-xs sm:text-sm py-3.5 px-7 font-black shadow-xl flex items-center gap-2 cursor-pointer hover:scale-103 transition-transform"
            >
              <span>Explore Login Portals</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#simulator"
              className="btn btn-secondary text-xs sm:text-sm py-3.5 px-6 font-bold flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-50 shadow-sm border-slate-300"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>Try Live Verification Demo</span>
            </a>
          </div>

          {/* Floating Trust Pills */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="glass-panel p-3 bg-white/90 border border-slate-200/80 rounded-2xl shadow-2xs text-center space-y-0.5">
              <div className="text-lg sm:text-xl font-black text-indigo-700 font-mono">&lt; 45 Seconds</div>
              <div className="text-[11px] text-slate-500 font-semibold">Average Turnaround Time</div>
            </div>

            <div className="glass-panel p-3 bg-white/90 border border-slate-200/80 rounded-2xl shadow-2xs text-center space-y-0.5">
              <div className="text-lg sm:text-xl font-black text-emerald-700 font-mono">100% Paperless</div>
              <div className="text-[11px] text-slate-500 font-semibold">WhatsApp & SMS Token Flow</div>
            </div>

            <div className="glass-panel p-3 bg-white/90 border border-slate-200/80 rounded-2xl shadow-2xs text-center space-y-0.5">
              <div className="text-lg sm:text-xl font-black text-sky-700 font-mono">99.4% Accuracy</div>
              <div className="text-[11px] text-slate-500 font-semibold">AI Face Liveness & Match</div>
            </div>

            <div className="glass-panel p-3 bg-white/90 border border-slate-200/80 rounded-2xl shadow-2xs text-center space-y-0.5">
              <div className="text-lg sm:text-xl font-black text-purple-700 font-mono">ISO 27001</div>
              <div className="text-[11px] text-slate-500 font-semibold">DPDP Act 2023 Compliant</div>
            </div>
          </div>

        </div>
      </section>

      {/* 🔄 HOW IT WORKS (3-STEP SIMPLE JOURNEY) */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">Fast & Frictionless</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              How Enterprise Verification Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              A 3-step digital journey that takes less than 2 minutes from dispatch to verified hire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="glass-panel p-6 sm:p-7 bg-slate-50/80 border border-slate-200 rounded-3xl space-y-4 card-hover-lift relative">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-200">
                1
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                HR Dispatches Magic Link
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                HR enters the candidate's basic details and dispatches a secure verification token via WhatsApp, SMS, or Email in 1 click.
              </p>
              <div className="pt-2 text-[11px] font-bold text-indigo-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                <span>Zero app download needed</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 sm:p-7 bg-slate-50/80 border border-slate-200 rounded-3xl space-y-4 card-hover-lift relative">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-sky-200">
                2
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Candidate Verifies on Phone
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Candidate enters their Aadhaar OTP, validates their registered mobile number, and takes a quick 3-angle live camera selfie.
              </p>
              <div className="pt-2 text-[11px] font-bold text-sky-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-sky-600" />
                <span>Takes under 90 seconds</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 sm:p-7 bg-slate-50/80 border border-slate-200 rounded-3xl space-y-4 card-hover-lift relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-200">
                3
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Instant 360° Certified Dossier
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                System validates EPFO employment history and bank details, immediately producing an official certified compliance PDF report.
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Ready for Day-1 Payroll</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 🎮 INTERACTIVE LIVE SIMULATOR / PLAYGROUND */}
      <section id="simulator" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Glow Accents */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-emerald text-xs font-black uppercase tracking-wider">Interactive Playground</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Try the Live Verification Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Select a candidate profile below to experience how JOY instantly executes all checks.
            </p>
          </div>

          {/* Simulator Box */}
          <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-8 bg-slate-950/80 border-2 border-indigo-500/40 rounded-3xl shadow-2xl space-y-6">
            
            {/* Role Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Select Candidate Role:
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {Object.keys(sampleRoles).map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => handleRunSimulator(roleKey)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedRoleSample === roleKey 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {sampleRoles[roleKey].title}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Live Banner */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block text-[11px]">Simulating Candidate:</span>
                <span className="text-sm font-black text-white">{sampleRoles[selectedRoleSample].candidateName}</span>
                <span className="text-slate-400 ml-2">({sampleRoles[selectedRoleSample].title})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="badge badge-emerald text-[10px] font-black">
                  {simulating ? 'Verification In Progress ⌛' : '100% Checks Passed ✓'}
                </span>
                <button
                  onClick={() => handleRunSimulator(selectedRoleSample)}
                  className="btn btn-superadmin text-[11px] py-1.5 px-3 font-bold"
                >
                  Re-run Check ⚡
                </button>
              </div>
            </div>

            {/* Checks Execution Pipeline Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleRoles[selectedRoleSample].checks.map((c, i) => {
                const isPassed = simStep >= i + 1;
                return (
                  <div 
                    key={i} 
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isPassed 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isPassed ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 animate-spin-slow'
                      }`}>
                        {isPassed ? '✓' : i + 1}
                      </div>
                      <div>
                        <span className="font-extrabold text-xs block text-white">{c.name}</span>
                        <span className="text-[11px] text-emerald-400 font-medium">{isPassed ? c.status : 'Authenticating...'}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {isPassed ? `⏱️ ${c.time}` : '⌛ ...'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer Directive */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-medium">
                📄 Verified outputs automatically assemble into an official <strong>360° BGV Audit Dossier</strong> with QR verification.
              </span>

              <Link
                to="/hr"
                className="btn btn-hrexecutive text-xs py-2 px-4 font-black shadow-md shrink-0 flex items-center gap-1.5"
              >
                <span>Launch HR Workstation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 💼 ENTERPRISE BUSINESS BENEFITS */}
      <section id="benefits" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-cyan text-xs font-black uppercase tracking-wider">Enterprise Value</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Why Modern HR Teams Choose JOY
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Designed specifically for fast-growing companies, recruitment agencies, and corporate enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessPillars.map((p, idx) => {
              const PIcon = p.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-panel p-6 bg-slate-50/60 border border-slate-200/90 rounded-3xl space-y-3.5 card-hover-lift"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.color} shadow-xs`}>
                    <PIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 👑 DEDICATED SUB-PORTAL GATEWAYS (URL DIRECTS) */}
      <section id="portals" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">Dedicated Portal URL Directs</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Dedicated Portals & Role Logins
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Access your dedicated workspace directly via unique sub-URLs or click any gateway card below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portalGateways.map((gate) => {
              const GateIcon = gate.icon;
              return (
                <div
                  key={gate.role}
                  className={`glass-panel p-6 bg-white border-2 ${gate.accentBorder} rounded-3xl shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden group card-hover-lift`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-slate-100 group-hover:scale-110 transition-transform">
                        <GateIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className={`badge ${gate.badgeClass} text-[10px]`}>{gate.badge}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">{gate.title}</h3>
                      <div className="mt-1 font-mono text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg w-fit">
                        Direct URL: {gate.url}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                        {gate.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
                      {gate.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={gate.url}
                    className={`btn ${gate.btnClass} text-xs py-3 px-4 font-black shadow-md flex items-center justify-center gap-2 w-full`}
                  >
                    <span>Launch {gate.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 💰 ROI & COST SAVINGS CALCULATOR */}
      <section id="roi-calculator" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-emerald text-xs font-black uppercase tracking-wider">Transparent ROI</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Calculate Your Monthly Savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              See how much time and budget JOY saves compared to traditional slow manual agencies.
            </p>
          </div>

          <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-10 bg-slate-50 border-2 border-slate-200 rounded-3xl shadow-md space-y-8">
            
            {/* Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Monthly Candidate Onboarding Volume:</span>
                <span className="text-xl font-black text-indigo-700 font-mono">{monthlyHires} Candidates / Month</span>
              </div>

              <input 
                type="range" 
                min="25" 
                max="3000" 
                step="25"
                value={monthlyHires}
                onChange={(e) => setMonthlyHires(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono font-bold">
                <span>25 hires</span>
                <span>500 hires</span>
                <span>1,500 hires</span>
                <span>3,000+ hires</span>
              </div>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                <span className="text-slate-400 text-[11px] uppercase font-bold block">Rate Per Candidate</span>
                <span className="text-2xl font-black text-slate-900 font-mono">₹{currentPrice}</span>
                <span className="text-[10px] text-emerald-700 font-bold block">All 10+ Checks Included</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                <span className="text-slate-400 text-[11px] uppercase font-bold block">Estimated Cost</span>
                <span className="text-2xl font-black text-indigo-700 font-mono">₹{monthlyCost.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-500 block">per month</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 text-center space-y-1">
                <span className="text-emerald-800 text-[11px] uppercase font-bold block">Estimated Savings</span>
                <span className="text-2xl font-black text-emerald-800 font-mono">₹{monthlySavings.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-900 font-bold block">~{hoursSaved} hrs saved</span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowDemoModal(true)}
                className="btn btn-superadmin text-xs py-3.5 px-8 font-black shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Request Custom Enterprise Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ❓ FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">Clear Answers</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left font-extrabold text-sm text-slate-900 cursor-pointer gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-indigo-600 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>

                {openFaq === idx && (
                  <p className="text-xs text-slate-600 font-medium mt-3 pt-3 border-t border-slate-100 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 🏢 ENTERPRISE FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 sm:py-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <img src="/joy_logo.png" alt="JOY Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h4 className="text-base font-black text-white">JOY CORPORATE SOLUTIONS PVT LTD</h4>
                  <p className="text-[11px] text-slate-400 font-bold uppercase">Digital Solution for Recruitment & Payroll</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">
                Enterprise background verification infrastructure providing instant candidate KYC screening, EPFO passbook audits, IMPS bank verification, and biometric liveness.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Direct Sub-URLs</h5>
              <div className="flex flex-col space-y-1 font-semibold">
                <Link to="/superadmin" className="hover:text-indigo-400 transition-colors">👑 /superadmin (Master Console)</Link>
                <Link to="/company" className="hover:text-sky-400 transition-colors">🏢 /company (Corporate Portal)</Link>
                <Link to="/hr" className="hover:text-emerald-400 transition-colors">👩‍💼 /hr (Recruiter Workstation)</Link>
                <Link to="/verify" className="hover:text-amber-400 transition-colors">📱 /verify (Candidate Gateway)</Link>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Compliance & Support</h5>
              <p className="text-slate-400">
                ✉️ contact@joycorporatesolutions.com<br />
                📞 +91 (080) 4567-8900<br />
                🛡️ ISO 27001:2022 & DPDP Act 2023
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
            <p>© 2026 JOY CORPORATE SOLUTIONS PVT LTD. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>SLA Terms</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 📑 LIVE DEMO REQUEST MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 relative text-slate-900">
            
            <button 
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img src="/joy_logo.png" alt="JOY Logo" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="font-black text-lg text-slate-900">Schedule an Enterprise Demo</h3>
                <p className="text-xs text-slate-500 font-medium">JOY CORPORATE SOLUTIONS PVT LTD</p>
              </div>
            </div>

            {demoSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-sm">Demo Request Received!</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Our enterprise integration consultant will contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Priya Sundaram"
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    className="form-input py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company / Enterprise Legal Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Acme Global Technologies Pvt Ltd"
                    value={demoForm.company}
                    onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                    className="form-input py-2.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Official Work Email *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="priya@acmeglobal.com"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="form-input py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contact Phone *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 98765 43210"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      className="form-input py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expected Monthly Verification Volume</label>
                  <select
                    value={demoForm.hires}
                    onChange={(e) => setDemoForm({ ...demoForm, hires: e.target.value })}
                    className="form-select py-2.5 text-xs font-bold"
                  >
                    <option value="50-200">50 – 200 candidates / month</option>
                    <option value="200-1000">200 – 1,000 candidates / month</option>
                    <option value="1000-5000">1,000 – 5,000 candidates / month</option>
                    <option value="5000+">5,000+ candidates / month (Custom SLA)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn btn-superadmin text-xs py-3 w-full font-black shadow-md">
                    <span>Submit Demo Request 🚀</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
