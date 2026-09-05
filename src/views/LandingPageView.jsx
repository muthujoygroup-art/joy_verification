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
  Menu,
  Star,
  HardHat,
  Users,
  AlertTriangle,
  QrCode,
  FileSpreadsheet,
  Truck,
  Factory,
  Building,
  Fingerprint,
  MessageSquare,
  ThumbsUp,
  Quote
} from 'lucide-react';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
import confetti from 'canvas-confetti';

export const LandingPageView = () => {
  // Navigation & Interactive Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showLandingRazorpayModal, setShowLandingRazorpayModal] = useState(false);
  const [landingSelectedAmount, setLandingSelectedAmount] = useState(5000);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Solutions Active Tab: 'labor' (Blue-Collar/Contract Labor) vs 'corporate' (White-Collar/Enterprise)
  const [activeSolutionTab, setActiveSolutionTab] = useState('labor');

  // ROI Calculator State
  const [monthlyHires, setMonthlyHires] = useState(300);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Demo Form State
  const [demoForm, setDemoForm] = useState({ name: '', company: '', email: '', phone: '', hires: '200-1000', workforceType: 'both' });
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', company: '', role: '', industry: 'labor', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewCategory, setReviewCategory] = useState('all');

  // Interactive Live Simulator State
  const [selectedRoleSample, setSelectedRoleSample] = useState('laborer');
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(4); // 4 = all checks passed

  const sampleRoles = {
    laborer: {
      title: 'Contract Factory Laborer / Industrial Worker',
      badge: 'Blue-Collar & Contract Labor',
      candidateName: 'Karan Verma',
      checks: [
        { name: 'Aadhaar Identity & Address Verification', status: 'UIDAI Authenticated ✓', time: '1.1s' },
        { name: 'Ghost Worker & Biometric Deduplication', status: 'Unique Record (0 Duplicates) ✓', time: '0.9s' },
        { name: 'National Court & Police Criminal Records', status: 'Clean Background (0 Cases) ✓', time: '1.8s' },
        { name: 'Daily Wage Bank IMPS Penny Drop', status: 'Active (SBI Bank) Match 100% ✓', time: '1.4s' },
        { name: 'AI Face Liveness & WebCam Biometrics', status: 'Real-Time Live (99.6% Match) ✓', time: '2.5s' }
      ]
    },
    driver: {
      title: 'Commercial Fleet & Transport Driver',
      badge: 'Logistics & Transportation',
      candidateName: 'Vikram Singh',
      checks: [
        { name: 'Aadhaar Identity & Address Verification', status: 'UIDAI Authenticated ✓', time: '1.0s' },
        { name: 'MoRTH Commercial Transport License', status: 'Valid Heavy Goods Vehicle (HGV) ✓', time: '1.6s' },
        { name: 'National Criminal & Traffic Court Check', status: 'Zero Violations / Clean ✓', time: '1.7s' },
        { name: 'Bank IMPS Penny Drop Name Match', status: 'Active (PNB Bank) ✓', time: '1.3s' },
        { name: 'AI Live Selfie & Facial Match', status: 'Passed Biometric Match ✓', time: '2.8s' }
      ]
    },
    executive: {
      title: 'Senior Enterprise Professional / Manager',
      badge: 'Corporate & White-Collar',
      candidateName: 'Sunita Sharma',
      checks: [
        { name: 'Aadhaar & PAN Identity Authentication', status: 'UIDAI & NSDL Match 100% ✓', time: '1.2s' },
        { name: 'EPFO Career History & Moonlighting Audit', status: '3 Past Employers (8.5 Yrs) Verified ✓', time: '2.2s' },
        { name: 'Corporate CIN & Directorship Check', status: 'No Conflict of Interest ✓', time: '1.5s' },
        { name: 'Corporate Salary Bank Account Penny Drop', status: 'Active (HDFC Bank) ✓', time: '1.4s' },
        { name: 'National Legal & Court Records Check', status: 'Clean Record (0 Cases) ✓', time: '1.9s' }
      ]
    }
  };

  const handleRunSimulator = (roleKey) => {
    setSelectedRoleSample(roleKey);
    setSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 400);
    setTimeout(() => setSimStep(3), 900);
    setTimeout(() => {
      setSimStep(4);
      setSimulating(false);
    }, 1600);
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
  const traditionalAgencyCost = monthlyHires * 480; // Traditional manual screening agencies charge ₹450-₹550
  const monthlySavings = traditionalAgencyCost - monthlyCost;
  const hoursSaved = Math.round(monthlyHires * 3.8); // 3.8 hours of manual paperwork saved per onboarding

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
    }, 3000);
  };

  // Initial Verified Reviews Data
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Rameshwar Patil',
      role: 'VP – Human Resources & Compliance',
      company: 'Apex Industrial Infrastructure Pvt Ltd',
      category: 'labor',
      rating: 5,
      date: '2 days ago',
      title: 'Onboarding 6,000+ factory workers every month with zero ghost workers!',
      content: 'JOY has completely transformed our contract labor management across 4 industrial plants. We verify Aadhaar, police records, and bank accounts right at the factory gate on mobile. Ghost worker billing by contractors dropped to absolute zero.',
      stats: '6,000+ Monthly Laborers Verified'
    },
    {
      id: 2,
      name: 'Ananya Deshmukh',
      role: 'Head of People & Culture',
      company: 'LogiFast Supply Chain & Logistics',
      category: 'logistics',
      rating: 5,
      date: '1 week ago',
      title: 'Instant commercial driver verification in under 45 seconds',
      content: 'We manage over 2,500 fleet drivers. Checking driving licenses, criminal backgrounds, and Aadhaar on basic mobile phones with WhatsApp links has reduced our driver hiring TAT from 12 days to just 3 minutes.',
      stats: '99.4% Driver Onboarding Speed'
    },
    {
      id: 3,
      name: 'Siddharth Menon',
      role: 'Chief Talent Officer',
      company: 'Nexis Cloud Technologies Ltd',
      category: 'corporate',
      rating: 5,
      date: '2 weeks ago',
      title: 'Eliminated moonlighting and fraudulent experience certificates permanently',
      content: 'The authenticated EPFO career history audit is an absolute game-changer. We caught multiple candidates holding dual overlapping full-time jobs. The audit-ready 5-page PDF dossier gives our board 100% confidence.',
      stats: 'Zero Moonlighting Fraud'
    },
    {
      id: 4,
      name: 'Bhavani Shankar',
      role: 'Operations & Labor Contractor Director',
      company: 'Vanguard Staffing & Facility Services',
      category: 'labor',
      rating: 5,
      date: '3 weeks ago',
      title: '100% CLRA audit compliance and instant worker ID passes',
      content: 'As a major staffing agency providing 10,000+ security guards and facility workers, JOY gives us instant digital labor passes with QR verification and automatic CLRA compliance reports for labor officers.',
      stats: '100% CLRA Audit Pass Rate'
    }
  ]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    
    const newRev = {
      id: Date.now(),
      name: reviewForm.name,
      role: reviewForm.role || 'HR / Operations Leader',
      company: reviewForm.company || 'Enterprise Client',
      category: reviewForm.industry,
      rating: reviewForm.rating,
      date: 'Just now',
      title: 'Verified Client Feedback',
      content: reviewForm.comment,
      stats: 'Verified Enterprise Client ✓'
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSubmitted(false);
      setReviewForm({ name: '', company: '', role: '', industry: 'labor', rating: 5, comment: '' });
    }, 2500);
  };

  const filteredReviews = reviewCategory === 'all' 
    ? reviewsList 
    : reviewsList.filter(r => r.category === reviewCategory);

  const faqs = [
    {
      q: 'How does JOY simplify contract labor management and labor verification?',
      a: 'JOY provides a 100% paperless mobile onboarding workflow. Labor recruiters send a WhatsApp or SMS token link to workers on their basic smartphone. Workers authenticate with Aadhaar OTP, take a quick selfie, and the platform validates identity, police/criminal records, and bank account in < 45 seconds—generating a digital worker ID pass with QR code.'
    },
    {
      q: 'How does JOY eliminate ghost workers and duplicate billing by contractors?',
      a: 'Contractors often bill companies for non-existent "ghost workers". JOY uses biometric facial liveness and Aadhaar cryptographic deduplication to ensure every worker on your plant floor is authentic, unique, and legally verified.'
    },
    {
      q: 'How does the platform prevent fake experience certificates and moonlighting?',
      a: 'We connect directly to authorized government employment repositories to retrieve authenticated service records, tenures, and past employer legal entities, immediately exposing overlapping dual employment.'
    },
    {
      q: 'Do candidates or blue-collar workers need to install any mobile application?',
      a: 'No app download is needed. Workers and candidates open a responsive web link directly through WhatsApp, SMS, or on-spot QR code scan on any smartphone.'
    },
    {
      q: 'Are the background reports and labor dossiers compliant with CLRA & DPDP Act 2023?',
      a: 'Yes. Every verification report is generated with SHA-256 cryptographic hashing, dual-logo authority certification, and full compliance with the Contract Labour (Regulation & Abolition) Act and the Digital Personal Data Protection (DPDP) Act 2023.'
    },
    {
      q: 'How do client portals and role-based logins work?',
      a: 'Click "Client Login" at the top to access dedicated consoles: Super Admin (/superadmin), Corporate Company Admin (/company), or HR Recruiter Workstation (/hr).'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 🌐 TOP ENTERPRISE NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
            <img 
              src="/joy_logo.png" 
              alt="JOY TrueProfile Logo" 
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-lg lg:text-xl text-slate-900 tracking-tight leading-none">
                  JOY <span className="text-indigo-600">TrueProfile</span>
                </span>
                <span className="badge badge-purple text-[8px] sm:text-[9px] py-0.5 px-1.5 font-black shrink-0">
                  PVT LTD
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-500 font-extrabold uppercase tracking-wider mt-0.5">
                Labor Profile Creation & Verification
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#labor-solutions" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <HardHat className="w-3.5 h-3.5 text-amber-500" />
              <span>Labor Management</span>
            </a>
            <a href="#verification-engine" className="hover:text-indigo-600 transition-colors">Verification Suite</a>
            <a href="#simulator" className="hover:text-indigo-600 transition-colors">Live Simulator</a>
            <a href="#reviews" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Reviews (4.9★)</span>
            </a>
            <a href="#roi-calculator" className="hover:text-indigo-600 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Credits</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowDemoModal(true)}
              className="btn btn-secondary text-xs py-2 px-3.5 font-bold hidden md:flex items-center gap-1.5 cursor-pointer hover:border-indigo-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Book Demo</span>
            </button>

            {/* Client Login Button (Opens Modal instead of cluttering page) */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="btn btn-superadmin text-xs py-2 px-4 font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-200" />
              <span>Client Login</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-5 space-y-4 animate-drawerSlide text-xs font-bold shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <a 
                href="#labor-solutions" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-800 transition-colors text-center border border-slate-100 flex items-center justify-center gap-1.5"
              >
                <HardHat className="w-3.5 h-3.5 text-amber-500" />
                <span>Labor Solutions</span>
              </a>
              <a 
                href="#verification-engine" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-center border border-slate-100"
              >
                Verification Suite
              </a>
              <a 
                href="#simulator" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-center border border-slate-100"
              >
                Live Simulator
              </a>
              <a 
                href="#reviews" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-600 transition-colors text-center border border-slate-100 flex items-center justify-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Client Reviews</span>
              </a>
              <a 
                href="#roi-calculator" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-center border border-slate-100"
              >
                ROI Calculator
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-center border border-slate-100"
              >
                FAQ
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLoginModal(true);
                }}
                className="btn btn-superadmin w-full text-xs py-2.5 font-black justify-center cursor-pointer shadow-md"
              >
                <Lock className="w-3.5 h-3.5 mr-1" />
                <span>Access Client Portals</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowDemoModal(true);
                }}
                className="btn btn-secondary w-full text-xs py-2.5 font-bold justify-center cursor-pointer"
              >
                Schedule Enterprise Demo 🚀
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 🚀 HIGH-CONVERTING HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200">
        
        {/* Animated Background Ambient Orbs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-indigo-300/25 via-sky-200/25 to-purple-200/25 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-gradient-to-bl from-amber-200/25 via-teal-200/20 to-sky-200/25 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-200 text-indigo-950 text-xs font-black shadow-sm backdrop-blur-sm animate-float-slow">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>JOY TrueProfile — Enterprise Labor Profile Creation & Verification Platform</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
            Create & Verify Complete Labor Profiles in{' '}
            <span className="animated-gradient-text">
              Under 45 Seconds
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Eliminate ghost workers, contractor fraud, and paper onboarding. Instantly create certified digital labor profiles, conduct government repository checks, and generate audit-ready dossiers on any smartphone.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => setShowDemoModal(true)}
              className="btn btn-superadmin text-xs sm:text-sm py-3.5 px-7 font-black shadow-xl flex items-center gap-2 cursor-pointer hover:scale-103 transition-transform"
            >
              <span>Schedule Live Demo 🚀</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#labor-solutions"
              className="btn btn-secondary text-xs sm:text-sm py-3.5 px-6 font-bold flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-50 shadow-sm border-slate-300"
            >
              <HardHat className="w-4 h-4 text-amber-500" />
              <span>Explore Labor Solutions</span>
            </a>

            <a
              href="#simulator"
              className="btn btn-secondary text-xs sm:text-sm py-3.5 px-5 font-bold flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-50 shadow-sm border-slate-300 text-slate-700"
            >
              <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>Live Simulator</span>
            </a>
          </div>

          {/* Floating Trust Metrics Grid */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            <div className="glass-panel p-3.5 bg-white/95 border border-slate-200/90 rounded-2xl shadow-2xs text-center space-y-1">
              <div className="text-xl sm:text-2xl font-black text-indigo-700 font-mono">500,000+</div>
              <div className="text-[11px] text-slate-500 font-bold">Workers & Hires Verified</div>
            </div>

            <div className="glass-panel p-3.5 bg-white/95 border border-slate-200/90 rounded-2xl shadow-2xs text-center space-y-1">
              <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">&lt; 45 Seconds</div>
              <div className="text-[11px] text-slate-500 font-bold">Average Verification Speed</div>
            </div>

            <div className="glass-panel p-3.5 bg-white/95 border border-slate-200/90 rounded-2xl shadow-2xs text-center space-y-1">
              <div className="text-xl sm:text-2xl font-black text-amber-600 font-mono">0 Ghost Workers</div>
              <div className="text-[11px] text-slate-500 font-bold">Biometric Deduplication</div>
            </div>

            <div className="glass-panel p-3.5 bg-white/95 border border-slate-200/90 rounded-2xl shadow-2xs text-center space-y-1">
              <div className="text-xl sm:text-2xl font-black text-purple-700 font-mono">ISO 27001</div>
              <div className="text-[11px] text-slate-500 font-bold">CLRA & DPDP Compliant</div>
            </div>
          </div>

        </div>
      </section>

      {/* 👷 LABOR MANAGEMENT & VERIFICATION SUITE */}
      <section id="labor-solutions" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="badge badge-amber text-xs font-black uppercase tracking-wider">Workforce & Compliance Suite</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tailored Solutions for Every Workforce Model
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Seamlessly switch between High-Volume Contract Labor Management and Corporate Executive Background Screening.
            </p>

            {/* Interactive Solution Switcher */}
            <div className="pt-4 flex justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setActiveSolutionTab('labor')}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    activeSolutionTab === 'labor'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <HardHat className="w-4 h-4" />
                  <span>Blue-Collar & Contract Labor</span>
                </button>

                <button
                  onClick={() => setActiveSolutionTab('corporate')}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    activeSolutionTab === 'corporate'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Corporate & White-Collar</span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: BLUE-COLLAR & CONTRACT LABOR MANAGEMENT */}
          {activeSolutionTab === 'labor' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              
              <div className="glass-panel p-6 sm:p-7 bg-amber-50/30 border-2 border-amber-200/80 rounded-3xl space-y-4 hover:border-amber-400 transition-all card-hover-lift">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-200">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  45-Second Mobile Onboarding
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Workers authenticate via WhatsApp, SMS, or on-spot QR code directly on their smartphone. Zero app download required, making it 100% accessible for plant and field workers.
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] font-bold text-amber-900 border-t border-amber-200/60">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Instant Aadhaar OTP & Live Selfie</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Works on 2G/3G/4G Basic Smartphones</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 sm:p-7 bg-emerald-50/30 border-2 border-emerald-200/80 rounded-3xl space-y-4 hover:border-emerald-400 transition-all card-hover-lift">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Zero Ghost Workers & Fraud Prevention
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Eliminate duplicate contractor billing and fake worker identities. Cryptographic deduplication and AI facial biometrics ensure only verified physical laborers are registered.
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] font-bold text-emerald-900 border-t border-emerald-200/60">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>National Court & Criminal Records Screen</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>MoRTH Heavy Vehicle Driver License Check</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 sm:p-7 bg-indigo-50/30 border-2 border-indigo-200/80 rounded-3xl space-y-4 hover:border-indigo-400 transition-all card-hover-lift">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-200">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  CLRA Compliance & Digital Worker Passes
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Stay 100% audit-ready for state labor inspections. Generate instant 5-page labor dossiers, digital worker ID cards with QR codes, and automated statutory wage compliance reports.
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] font-bold text-indigo-900 border-t border-indigo-200/60">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Day-1 Bank IMPS Penny Drop Wage Check</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>1-Click Labor Audit Reports Export</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CORPORATE & WHITE-COLLAR WORKFORCE */}
          {activeSolutionTab === 'corporate' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              
              <div className="glass-panel p-6 sm:p-7 bg-indigo-50/30 border-2 border-indigo-200/80 rounded-3xl space-y-4 hover:border-indigo-400 transition-all card-hover-lift">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-200">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  EPFO Career History & Moonlighting Audit
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Direct connection to government employment repositories exposes real tenures, past employer legal names, and overlapping employment periods to eliminate moonlighting.
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] font-bold text-indigo-900 border-t border-indigo-200/60">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Zero Resume Inflation & Fake Certificates</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>100% Exact Date of Joining & Relieving</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 sm:p-7 bg-sky-50/30 border-2 border-sky-200/80 rounded-3xl space-y-4 hover:border-sky-400 transition-all card-hover-lift">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black shadow-md shadow-sky-200">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Instant ₹1 IMPS Bank Penny Drop
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Real-time bank account validation matches candidate legal names against bank records, ensuring zero salary transfer failures on Day-1 payroll.
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] font-bold text-sky-900 border-t border-sky-200/60">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Validates IFSC, Branch & Account Active Status</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Fuzzy Legal Name Match Algorithm</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 sm:p-7 bg-purple-50/30 border-2 border-purple-200/80 rounded-3xl space-y-4 hover:border-purple-400 transition-all card-hover-lift">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-200">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Dual-Logo 360° Certified PDF Reports
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Generate beautiful, executive-ready background screening dossiers with JOY Corporate verification seal, employer company logo, and QR code verification.
                </p>
                <div className="space-y-1.5 pt-2 text-[11px] font-bold text-purple-900 border-t border-purple-200/60">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Encrypted Document Vault Storage</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>60-Day DPDP Auto-Purge Lifecycle</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ⚡ PROPRIETARY VERIFICATION ENGINE & REPOSITORIES */}
      <section id="verification-engine" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Glow Accents */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">Proprietary Technology</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              JOY Proprietary Multi-Source Verification Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Direct integration with government-authorized digital trust repositories, biometric neural networks, and banking rails.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
            
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-white">UIDAI Aadhaar OTP & XML</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Cryptographic authentication of resident identity, verified legal name, date of birth, gender, and certified permanent address.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-white">EPFO Career History Passbook</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Complete employment timeline authentication, company establishment names, joining/exit dates, and moonlighting detection.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-white">NPCI IMPS Bank Penny Drop</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Real-time ₹1 IMPS bank validation verifying bank branch, IFSC code, account active status, and beneficiary legal name.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-600/30 text-sky-400 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-black text-sm text-white">MoRTH Driver License & Court</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                National Sarathi driver license validation (LMV, HGV, Transport) and national criminal & court record screening.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 🎮 INTERACTIVE LIVE SIMULATOR / PLAYGROUND */}
      <section id="simulator" className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-emerald text-xs font-black uppercase tracking-wider">Interactive Playground</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Experience the Live Verification Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Select a persona below to see how our engine automatically executes multi-point checks in parallel.
            </p>
          </div>

          {/* Simulator Box */}
          <div className="max-w-4xl mx-auto glass-panel p-6 sm:p-8 bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl shadow-2xl space-y-6">
            
            {/* Role Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Select Persona:
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
                <span className="text-slate-400 font-bold block text-[11px]">Testing Subject:</span>
                <span className="text-sm font-black text-white">{sampleRoles[selectedRoleSample].candidateName}</span>
                <span className="badge badge-purple text-[9px] ml-2 font-bold">{sampleRoles[selectedRoleSample].badge}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="badge badge-emerald text-[10px] font-black">
                  {simulating ? 'Processing Verifications ⌛' : '100% Repository Checks Passed ✓'}
                </span>
                <button
                  onClick={() => handleRunSimulator(selectedRoleSample)}
                  className="btn btn-superadmin text-[11px] py-1.5 px-3 font-bold cursor-pointer"
                >
                  Re-test ⚡
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
                📄 Verified outputs automatically assemble into an official <strong>360° Certified Labor/Candidate Dossier</strong> with QR verification.
              </span>

              <button
                onClick={() => setShowDemoModal(true)}
                className="btn btn-hrexecutive text-xs py-2 px-4 font-black shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request Custom Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ⭐ VERIFIED CLIENT REVIEWS & TESTIMONIALS */}
      <section id="reviews" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>4.9 / 5.0 Rating from 450+ Enterprises & Staffing Firms</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Trusted by Leading Employers & Staffing Leaders
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Read authentic feedback from HR Directors, Plant Operations Managers, and Staffing Agencies who trust JOY.
            </p>

            {/* Category Filter Pills & Submit Review Button */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setReviewCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  reviewCategory === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Reviews ({reviewsList.length})
              </button>
              <button
                onClick={() => setReviewCategory('labor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  reviewCategory === 'labor' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Factory & Contract Labor
              </button>
              <button
                onClick={() => setReviewCategory('logistics')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  reviewCategory === 'logistics' ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Logistics & Drivers
              </button>
              <button
                onClick={() => setReviewCategory('corporate')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  reviewCategory === 'corporate' ? 'bg-purple-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Corporate & IT
              </button>

              <button
                onClick={() => setShowReviewModal(true)}
                className="btn btn-secondary text-xs py-1.5 px-3.5 font-bold flex items-center gap-1.5 ml-2 cursor-pointer bg-white hover:bg-slate-100 border-indigo-200 text-indigo-700"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Write a Review ✍️</span>
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="glass-panel p-6 sm:p-7 bg-white border-2 border-slate-200 rounded-3xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{rev.date}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                    "{rev.title}"
                  </h3>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {rev.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-black text-slate-900 text-xs">{rev.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{rev.role} • <strong className="text-slate-700">{rev.company}</strong></p>
                  </div>
                  <span className="badge badge-emerald text-[9px] font-bold shrink-0">{rev.stats}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 💰 ROI & COST SAVINGS CALCULATOR */}
      <section id="roi-calculator" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-emerald text-xs font-black uppercase tracking-wider">Transparent Economics</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Calculate Your Monthly Savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              See how much time and operational budget JOY saves compared to slow manual agencies.
            </p>
          </div>

          <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-10 bg-slate-50 border-2 border-slate-200 rounded-3xl shadow-md space-y-8">
            
            {/* Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Monthly Workforce & Candidate Volume:</span>
                <span className="text-xl font-black text-indigo-700 font-mono">{monthlyHires} Workers / Month</span>
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
                <span className="text-slate-400 text-[11px] uppercase font-bold block">Rate Per Verification</span>
                <span className="text-2xl font-black text-slate-900 font-mono">₹{currentPrice}</span>
                <span className="text-[10px] text-emerald-700 font-bold block">All Repository Checks Included</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-1">
                <span className="text-slate-400 text-[11px] uppercase font-bold block">Estimated Monthly Cost</span>
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

      {/* 💳 TRANSPARENT VERIFICATION CREDITS & PRICING PLANS */}
      <section id="pricing" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">Metered B2B Pricing</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Prepaid Verification Credits via Razorpay
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              No long setup fees or locked-in annual contracts. Recharge verification wallet via Instant UPI, Corporate Cards, or NetBanking with official 18% GST Invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Plan 1: Starter Pack */}
            <div className="glass-panel p-6 sm:p-8 bg-slate-50/70 border-2 border-slate-200 rounded-3xl space-y-6 flex flex-col justify-between hover:border-indigo-300 transition-all shadow-sm">
              <div className="space-y-4">
                <span className="badge badge-cyan text-xs font-black">STARTER PACK</span>
                <h3 className="text-xl font-black text-slate-900">Startup & SME</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">₹2,500</span>
                  <span className="text-xs text-slate-500 font-bold">/ recharge</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Ideal for hiring up to 25 workers with core identity and court checks.</p>

                <div className="space-y-2.5 pt-2 text-xs text-slate-700 font-semibold border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>~25 Candidate/Worker Verifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>UIDAI Aadhaar OTP + PAN Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mobile OTP & WhatsApp Magic Links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official PDF Verification Dossiers</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setLandingSelectedAmount(2500);
                  setShowLandingRazorpayModal(true);
                }}
                className="btn btn-secondary w-full text-xs py-3 font-bold justify-center cursor-pointer"
              >
                <span>Recharge ₹2,500 via Razorpay ⚡</span>
              </button>
            </div>

            {/* Plan 2: Growth Pack (Most Popular) */}
            <div className="glass-panel p-6 sm:p-8 bg-gradient-to-b from-indigo-50/80 to-white border-2 border-indigo-600 rounded-3xl space-y-6 flex flex-col justify-between shadow-xl relative scale-102">
              <span className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                Most Popular ⭐
              </span>

              <div className="space-y-4">
                <span className="badge badge-purple text-xs font-black">GROWTH PACK</span>
                <h3 className="text-xl font-black text-slate-900">Labor & Mid-Market</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-indigo-700">₹5,000</span>
                  <span className="text-xs text-slate-500 font-bold">/ recharge</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Complete labor screening, EPFO career history, and IMPS bank penny drop.</p>

                <div className="space-y-2.5 pt-2 text-xs text-slate-700 font-semibold border-t border-indigo-100">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>~50 Candidate/Worker Verifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>UIDAI Aadhaar + PAN + MoRTH DL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>EPFO Past Employment Passbook Audit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bank Penny Drop (₹1 IMPS Drop)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>AI Biometric Face Liveness Match</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setLandingSelectedAmount(5000);
                  setShowLandingRazorpayModal(true);
                }}
                className="btn btn-superadmin w-full text-xs py-3.5 font-black justify-center shadow-lg cursor-pointer hover:scale-102 transition-transform"
              >
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>Recharge ₹5,000 (Razorpay) ⚡</span>
              </button>
            </div>

            {/* Plan 3: Enterprise Pack */}
            <div className="glass-panel p-6 sm:p-8 bg-slate-50/70 border-2 border-slate-200 rounded-3xl space-y-6 flex flex-col justify-between hover:border-purple-300 transition-all shadow-sm">
              <div className="space-y-4">
                <span className="badge badge-purple text-xs font-black">ENTERPRISE SCALE</span>
                <h3 className="text-xl font-black text-slate-900">Large Plants & Staffing</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">₹15,000</span>
                  <span className="text-xs text-slate-500 font-bold">/ recharge</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">High volume labor recruitment with dedicated virtual bank accounts and priority SLAs.</p>

                <div className="space-y-2.5 pt-2 text-xs text-slate-700 font-semibold border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>~160 Verifications (+15 Bonus)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All Repository & Biometric Checks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated NEFT / RTGS Virtual Account</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Custom SLAs & Account Manager</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setLandingSelectedAmount(15000);
                  setShowLandingRazorpayModal(true);
                }}
                className="btn btn-secondary w-full text-xs py-3 font-bold justify-center cursor-pointer"
              >
                <span>Recharge ₹15,000 via Razorpay ⚡</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ❓ SEARCH-OPTIMIZED FAQ ACCORDION */}
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
                  <p className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider">Labor Management & Background Verification</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">
                Enterprise labor management & candidate background verification infrastructure providing instant workforce KYC, EPFO career audits, IMPS bank verification, and biometric liveness.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Direct Portal Access</h5>
              <div className="flex flex-col space-y-1.5 font-semibold">
                <button 
                  onClick={() => setShowLoginModal(true)} 
                  className="text-left text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Client Login Gateway</span>
                </button>
                <Link to="/superadmin" className="hover:text-white transition-colors">👑 Master Admin Portal</Link>
                <Link to="/company" className="hover:text-white transition-colors">🏢 Corporate Employer Console</Link>
                <Link to="/hr" className="hover:text-white transition-colors">👩‍💼 HR Recruiter Workstation</Link>
                <Link to="/verify" className="hover:text-white transition-colors">📱 Candidate Verification Gateway</Link>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Compliance & Support</h5>
              <p className="text-slate-400 leading-relaxed">
                ✉️ contact@joycorporatesolutions.com<br />
                📞 +91 (080) 4567-8900<br />
                🛡️ ISO 27001:2022 Certified<br />
                ⚖️ DPDP Act 2023 & CLRA Compliant
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
            <p>© 2026 JOY CORPORATE SOLUTIONS PVT LTD. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowLegalHandbook(true)} 
                className="hover:text-purple-400 underline cursor-pointer transition-colors"
              >
                DPDP Privacy Policy & Legal Handbook 🛡️
              </button>
              <span>•</span>
              <button 
                onClick={() => setShowLegalHandbook(true)} 
                className="hover:text-indigo-400 underline cursor-pointer transition-colors"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button 
                onClick={() => setShowLegalHandbook(true)} 
                className="hover:text-sky-400 underline cursor-pointer transition-colors"
              >
                SLA & Safe Harbor
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* 🔐 CLIENT LOGIN SELECTOR MODAL (Popup cleanly instead of cluttering page) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative text-slate-900 animate-scaleIn">
            
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <img src="/joy_logo.png" alt="JOY Logo" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="font-black text-lg text-slate-900">Select Portal to Sign In</h3>
                <p className="text-xs text-slate-500 font-medium">JOY CORPORATE SOLUTIONS PVT LTD</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              <Link
                to="/superadmin"
                onClick={() => setShowLoginModal(false)}
                className="p-4 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/90 border border-indigo-200 transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                    <Crown className="w-4 h-4" />
                  </div>
                  <span className="badge badge-purple text-[9px]">Master Console</span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-indigo-950 group-hover:text-indigo-700">Super Admin Portal</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Master governance, corporate tariffs, and live telemetry.</p>
                </div>
              </Link>

              <Link
                to="/company"
                onClick={() => setShowLoginModal(false)}
                className="p-4 rounded-2xl bg-sky-50/70 hover:bg-sky-100/90 border border-sky-200 transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="badge badge-cyan text-[9px]">Employer</span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-sky-950 group-hover:text-sky-700">Company Admin Portal</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Workforce registry, recruiter oversight, and GST invoices.</p>
                </div>
              </Link>

              <Link
                to="/hr"
                onClick={() => setShowLoginModal(false)}
                className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/90 border border-emerald-200 transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="badge badge-emerald text-[9px]">Recruiter</span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-emerald-950 group-hover:text-emerald-700">HR Executive Workstation</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Candidate profiler, WhatsApp dispatch, and 360° dossiers.</p>
                </div>
              </Link>

              <Link
                to="/verify?token=tok_karan_903"
                onClick={() => setShowLoginModal(false)}
                className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/90 border border-amber-200 transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="badge badge-amber text-[9px]">Candidate</span>
                </div>
                <div>
                  <h4 className="font-black text-sm text-amber-950 group-hover:text-amber-700">Candidate Token Portal</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Passwordless Aadhaar OTP and AI camera verification.</p>
                </div>
              </Link>

            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link to="/login" onClick={() => setShowLoginModal(false)} className="text-indigo-600 font-bold hover:underline">
                Go to Universal Login Screen ➔
              </Link>
              <span className="text-slate-400">Encrypted 256-Bit SSL</span>
            </div>

          </div>
        </div>
      )}

      {/* 📑 LIVE DEMO REQUEST MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 relative text-slate-900 mt-10">
            
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
                  Our workforce solution consultant will contact you within 2 business hours.
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
                    placeholder="Acme Industrial Infrastructure Pvt Ltd"
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
                      placeholder="priya@acmeindustrial.com"
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
                  <label className="block text-slate-700 font-bold mb-1">Primary Workforce Requirement</label>
                  <select
                    value={demoForm.workforceType}
                    onChange={(e) => setDemoForm({ ...demoForm, workforceType: e.target.value })}
                    className="form-select py-2.5 text-xs font-bold"
                  >
                    <option value="labor">Contract / Factory / Blue-Collar Labor Management</option>
                    <option value="corporate">Corporate / White-Collar Background Screening</option>
                    <option value="both">Both Labor Management & Corporate Screening</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn btn-superadmin text-xs py-3 w-full font-black shadow-md cursor-pointer">
                    <span>Submit Demo Request 🚀</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ✍️ WRITE A REVIEW / CLIENT FEEDBACK MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 relative text-slate-900 mt-10">
            
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-white font-bold">
                <Star className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Submit Client Review</h3>
                <p className="text-xs text-slate-500 font-medium">Share your experience with JOY Platform</p>
              </div>
            </div>

            {reviewSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-sm">Thank You for Your Feedback!</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Your review has been successfully submitted and added to our verified reviews section.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                
                {/* Rating Selector */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Your Rating *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2 font-mono">
                      {reviewForm.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Anil Kumar"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="form-input py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Designation / Role</label>
                    <input 
                      type="text" 
                      placeholder="HR Director / Operations Head"
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      className="form-input py-2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Company / Organization *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Tata Steel / Swiggy / Wipro"
                      value={reviewForm.company}
                      onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                      className="form-input py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Industry Sector</label>
                    <select
                      value={reviewForm.industry}
                      onChange={(e) => setReviewForm({ ...reviewForm, industry: e.target.value })}
                      className="form-select py-2.5 text-xs font-bold"
                    >
                      <option value="labor">Factory & Contract Labor</option>
                      <option value="logistics">Logistics & Fleet Transport</option>
                      <option value="corporate">Corporate & IT Enterprise</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Review & Feedback *</label>
                  <textarea 
                    rows={4}
                    required 
                    placeholder="Describe how JOY improved your hiring speed, labor compliance, or fraud prevention..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="form-textarea py-2 text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn btn-superadmin text-xs py-3 w-full font-black shadow-md cursor-pointer">
                    <span>Submit Verified Review 🌟</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Statutory Legal & DPDP Compliance Handbook Modal */}
      <LegalComplianceHandbookModal
        isOpen={showLegalHandbook}
        onClose={() => setShowLegalHandbook(false)}
      />

      {/* ⚡ Razorpay Verification Wallet Recharge Modal */}
      <RazorpayPaymentModal
        isOpen={showLandingRazorpayModal}
        onClose={() => setShowLandingRazorpayModal(false)}
        defaultAmount={landingSelectedAmount}
      />

    </div>
  );
};
