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
  Quote,
  BookOpen,
  WifiOff
} from 'lucide-react';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
import { checkNetworkBeforeAction } from '../utils/networkChecker';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export const LandingPageView = () => {
  // Navigation & Interactive Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const [demoLoading, setDemoLoading] = useState(false);

  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', company: '', role: '', industry: 'labor', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewCategory, setReviewCategory] = useState('all');
  const [publicArticles, setPublicArticles] = useState([]);

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

  const handleInitiateRecharge = (amount) => {
    if (!checkNetworkBeforeAction('initiating verification recharge')) return;
    setLandingSelectedAmount(amount);
    setShowLandingRazorpayModal(true);
  };

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    if (!checkNetworkBeforeAction('submitting demo inquiry')) return;
    try {
      setDemoLoading(true);
      await api.submitInquiry({
        name: demoForm.name,
        company: demoForm.company,
        email: demoForm.email,
        phone: demoForm.phone,
        estimated_monthly_hires: demoForm.hires,
        workforce_type: demoForm.workforceType,
        source: 'landing_demo_modal'
      });
      setDemoSubmitted(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setShowDemoModal(false);
        setDemoSubmitted(false);
        setDemoForm({ name: '', company: '', email: '', phone: '', hires: '200-1000', workforceType: 'both' });
      }, 3000);
    } catch (err) {
      console.error('Demo request error:', err);
      alert(err.message || 'Unable to submit demo inquiry. Please check your internet connection.');
    } finally {
      setDemoLoading(false);
    }
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

  // Load live approved public reviews and latest blog articles
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const revRes = await api.getPublicReviews();
        if (revRes && revRes.reviews && revRes.reviews.length > 0) {
          const formatted = revRes.reviews.map(r => ({
            id: r.id,
            name: r.client_name,
            role: r.designation,
            company: r.company_name,
            category: r.industry_category || 'labor',
            rating: r.rating || 5,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Verified',
            title: r.review_title || 'Verified Enterprise Experience',
            content: r.review_text,
            stats: r.verified_metric || 'Verified Enterprise Client ✓'
          }));
          setReviewsList(formatted);
        }
      } catch (err) {
        // Silently use pre-seeded verified reviews
      }

      try {
        const blogRes = await api.getPublicBlogPosts({ limit: 3 });
        if (blogRes && blogRes.articles && blogRes.articles.length > 0) {
          setPublicArticles(blogRes.articles);
        }
      } catch (err) {
        // Silently fallback
      }
    };

    fetchLandingData();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;
    if (!checkNetworkBeforeAction('submitting review')) return;

    try {
      setReviewLoading(true);
      await api.submitReview({
        client_name: reviewForm.name,
        company_name: reviewForm.company || 'Enterprise Client',
        designation: reviewForm.role || 'HR / Operations Leader',
        industry_category: reviewForm.industry,
        rating: reviewForm.rating,
        review_title: 'Verified Client Feedback',
        review_text: reviewForm.comment,
      });

      setReviewSubmitted(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewSubmitted(false);
        setReviewForm({ name: '', company: '', role: '', industry: 'labor', rating: 5, comment: '' });
      }, 3000);
    } catch (err) {
      console.error('Review submission error:', err);
      alert(err.message || 'Unable to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
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
      a: 'JOY uses AI facial recognition and government biometric deduplication across all contractor submissions. If a worker is already active in another plant or submitted by another contractor under a different name, JOY instantly flags the duplicate, stopping fraudulent double billing.'
    },
    {
      q: 'How does the platform prevent fake experience certificates and moonlighting?',
      a: 'JOY performs direct, authenticated EPFO career history passbook audits. It retrieves exact EPFO employer establishment codes, dates of joining/exit, and monthly PF deposits—instantly exposing overlapping full-time employment dates (moonlighting) and fake service letters.'
    },
    {
      q: 'Do candidates or blue-collar workers need to install any mobile application?',
      a: 'No application installation is needed! The verification workflow operates 100% via secure, lightweight browser magic links sent via WhatsApp or SMS. It runs smoothly even on entry-level 4G/5G Android and iOS smartphones.'
    },
    {
      q: 'Are the background reports and labor dossiers compliant with CLRA & DPDP Act 2023?',
      a: 'Yes. Every verification report is ISO 27001:2022 certified, DPDP Act 2023 compliant with digital candidate consent trails, and formats seamlessly into official CLRA Form XIII labor registers for statutory labor officer inspections.'
    },
    {
      q: 'How does JOY ensure enterprise data protection & DPDP Act 2023 compliance?',
      a: 'JOY enforces strict DPDP Act 2023 consent architecture, zero-retention raw biometric storage, end-to-end 256-bit TLS encryption, and immutable cryptographic audit trails. All candidate data is processed exclusively for HR verification purposes with automatic purpose-limitation controls.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* 🌟 ENTERPRISE NAVIGATION HEADER */}
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
            <Link to="/blog" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Knowledge Base</span>
            </Link>
            <a href="#reviews" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Reviews (4.9★)</span>
            </a>
            <a href="#roi-calculator" className="hover:text-indigo-600 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Credits</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          {/* Action CTAs (Marketing First - No login URLs) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="#simulator"
              className="btn btn-secondary text-xs py-2 px-3.5 font-bold hidden sm:flex items-center gap-1.5 cursor-pointer hover:border-indigo-300"
            >
              <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
              <span>Try Simulator</span>
            </a>

            <button
              onClick={() => setShowDemoModal(true)}
              className="btn btn-superadmin text-xs py-2 px-4 font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Book Live Demo 🚀</span>
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
                  setShowDemoModal(true);
                }}
                className="btn btn-superadmin w-full text-xs py-3 font-black justify-center cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 mr-1 text-yellow-300" />
                <span>Schedule Enterprise Live Demo 🚀</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 🚀 HIGH-CONVERTING 3D ANIMATED HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200">
        
        {/* Animated Background Ambient Orbs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-indigo-300/25 via-sky-200/25 to-purple-200/25 blur-3xl rounded-full pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-gradient-to-bl from-amber-200/25 via-teal-200/20 to-sky-200/25 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Hero Text & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-950 text-xs font-black shadow-sm backdrop-blur-sm animate-float-slow">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>JOY TrueProfile — Enterprise Labor Profile Creation & Verification</span>
              </div>

              {/* Hero Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Create & Verify Complete Labor Profiles in{' '}
                <span className="animated-gradient-text">
                  Under 45 Seconds
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Eliminate ghost workers, contractor fraud, and paper onboarding. Instantly create certified digital labor profiles, conduct government repository checks, and generate audit-ready dossiers on any smartphone.
              </p>

              {/* Hero CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
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

              {/* Metrics Highlights */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto lg:mx-0">
                <div className="glass-panel p-3 bg-white/95 border border-slate-200 rounded-2xl shadow-2xs text-center space-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-indigo-700 font-mono">500k+</div>
                  <div className="text-[10px] text-slate-500 font-bold">Workers Verified</div>
                </div>

                <div className="glass-panel p-3 bg-white/95 border border-slate-200 rounded-2xl shadow-2xs text-center space-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-emerald-700 font-mono">&lt; 45s</div>
                  <div className="text-[10px] text-slate-500 font-bold">Verification Speed</div>
                </div>

                <div className="glass-panel p-3 bg-white/95 border border-slate-200 rounded-2xl shadow-2xs text-center space-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-amber-600 font-mono">0 Ghost</div>
                  <div className="text-[10px] text-slate-500 font-bold">Deduplication Rate</div>
                </div>

                <div className="glass-panel p-3 bg-white/95 border border-slate-200 rounded-2xl shadow-2xs text-center space-y-0.5">
                  <div className="text-lg sm:text-xl font-black text-purple-700 font-mono">DPDP & ISO</div>
                  <div className="text-[10px] text-slate-500 font-bold">100% Compliant</div>
                </div>
              </div>

            </div>

            {/* Right Column: 3D Holographic Verification Card (5 Cols) */}
            <div className="lg:col-span-5 perspective-container flex justify-center">
              <div className="relative w-full max-w-md card-3d-interactive floating-3d-hero">
                
                {/* 3D Visual Box */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-200/80 bg-slate-900 group">
                  
                  {/* Live Laser Scanline Beam Animation */}
                  <div className="animate-scanline" />

                  {/* 3D Generated Asset */}
                  <img
                    src="/assets/3d/hero_3d_verification.jpg"
                    alt="3D Biometric Labor Verification Smart Card"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Holographic Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom Float Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black">UIDAI & NSDL Verified</div>
                        <div className="text-[10px] text-emerald-400 font-mono">Biometric Match: 99.8%</div>
                      </div>
                    </div>
                    <span className="badge badge-emerald text-[9px] font-black uppercase">ACTIVE PASSPORT</span>
                  </div>

                </div>

                {/* Floating 3D Badge 1: Top Right */}
                <div className="absolute -top-3 -right-3 p-3 rounded-2xl bg-white shadow-xl border border-indigo-200 text-slate-900 flex items-center gap-2 animate-float-reverse">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black leading-tight">45-Second TAT</div>
                    <div className="text-[9px] text-slate-500 font-medium">Instant Mobile KYC</div>
                  </div>
                </div>

                {/* Floating 3D Badge 2: Bottom Left */}
                <div className="absolute -bottom-3 -left-3 p-2.5 rounded-2xl bg-white shadow-xl border border-emerald-200 text-slate-900 flex items-center gap-2 animate-float-slow">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800">Zero Ghost Workers</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 👷 LABOR MANAGEMENT & VERIFICATION SUITE WITH 3D VISUALS */}
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              
              {/* 3D Labor Visual (5 cols) */}
              <div className="lg:col-span-5 perspective-container flex justify-center">
                <div className="w-full max-w-md card-3d-interactive relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200 bg-white">
                    <img
                      src="/assets/3d/labor_3d_management.jpg"
                      alt="3D Industrial Contract Labor Management Station"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardHat className="w-5 h-5" />
                        <div>
                          <div className="text-xs font-black">Industrial Labor Gate Pass</div>
                          <div className="text-[10px] text-amber-100">CLRA Form XIII Automated</div>
                        </div>
                      </div>
                      <span className="badge bg-white text-amber-900 text-[9px] font-black">100% AUDIT PASS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Labor Feature Cards (7 cols) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="glass-panel p-5 bg-amber-50/40 border-2 border-amber-200 rounded-3xl space-y-3 card-hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">45s Mobile Onboarding</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Workers authenticate via WhatsApp, SMS, or QR magic links. Zero app download required, 100% accessible on any phone.
                  </p>
                  <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 pt-1 border-t border-amber-200">
                    <Check className="w-3.5 h-3.5 text-amber-600" />
                    <span>Instant Aadhaar OTP & Live Selfie</span>
                  </div>
                </div>

                <div className="glass-panel p-5 bg-emerald-50/40 border-2 border-emerald-200 rounded-3xl space-y-3 card-hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Ghost Worker Shield</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Biometric deduplication flags duplicate worker profiles across contractors and plant gates, ending double-billing fraud.
                  </p>
                  <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 pt-1 border-t border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>0 Duplicate Worker Records</span>
                  </div>
                </div>

                <div className="glass-panel p-5 bg-indigo-50/40 border-2 border-indigo-200 rounded-3xl space-y-3 card-hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">IMPS Bank Penny Drop</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Instantly verifies candidate bank account and official beneficiary name via ₹1 IMPS penny drop for wage transfers.
                  </p>
                  <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5 pt-1 border-t border-indigo-200">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>100% Name Match with Aadhaar</span>
                  </div>
                </div>

                <div className="glass-panel p-5 bg-purple-50/40 border-2 border-purple-200 rounded-3xl space-y-3 card-hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-sm">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">QR Digital Worker Passes</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Generates encrypted digital worker passes with QR code verification and automatic CLRA compliance reports for labor officers.
                  </p>
                  <div className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5 pt-1 border-t border-purple-200">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                    <span>Instant Gate Turnstile Access</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: CORPORATE & WHITE-COLLAR BGV */}
          {activeSolutionTab === 'corporate' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
              
              {/* 3D Corporate Visual (5 cols) */}
              <div className="lg:col-span-5 perspective-container flex justify-center">
                <div className="w-full max-w-md card-3d-interactive relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-200 bg-white">
                    <img
                      src="/assets/3d/corporate_3d_bgv.jpg"
                      alt="3D Corporate Executive Background Verification Workstation"
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        <div>
                          <div className="text-xs font-black">Executive Background Dossier</div>
                          <div className="text-[10px] text-indigo-100">EPFO Career History Audited</div>
                        </div>
                      </div>
                      <span className="badge bg-white text-indigo-900 text-[9px] font-black">ZERO MOONLIGHTING</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corporate Feature Cards (7 cols) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="glass-panel p-5 bg-indigo-50/40 border-2 border-indigo-200 rounded-3xl space-y-3 card-hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">EPFO Employment Audit</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Direct authenticated EPFO passbook verification retrieves exact tenure, establishment codes, and catches moonlighting.
                  </p>
                  <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5 pt-1 border-t border-indigo-200">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Eliminates Fake Experience Letters</span>
                  </div>
                </div>

                <div className="glass-panel p-5 bg-purple-50/40 border-2 border-purple-200 rounded-3xl space-y-3 card-hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-sm">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">National Court Checks</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Comprehensive legal records search across High Courts, District Courts, and Tribunals nationwide for clean hiring.
                  </p>
                  <div className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5 pt-1 border-t border-purple-200">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                    <span>Instant FIR & Case Search</span>
                  </div>
                </div>

                <div className="glass-panel p-5 bg-emerald-50/40 border-2 border-emerald-200 rounded-3xl space-y-3 card-hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">AI Face Liveness Match</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Anti-spoofing facial recognition matches live candidate webcam selfie against Aadhaar photo with 99.8% precision.
                  </p>
                  <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 pt-1 border-t border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active Blink & Head-Tilt Checks</span>
                  </div>
                </div>

                <div className="glass-panel p-5 bg-sky-50/40 border-2 border-sky-200 rounded-3xl space-y-3 card-hover-lift">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">5-Page Audit Dossier</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Generates official PDF background dossiers with digital signatures, QR validation links, and board-ready evidence.
                  </p>
                  <div className="text-[11px] font-bold text-sky-900 flex items-center gap-1.5 pt-1 border-t border-sky-200">
                    <Check className="w-3.5 h-3.5 text-sky-600" />
                    <span>One-Click Export & Download</span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </section>

      {/* ⚡ INSTANT VERIFICATION SPEED ENGINE WITH 3D ASSET */}
      <section id="verification-engine" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 3D Smartphone Speed Asset (5 cols) */}
            <div className="lg:col-span-5 perspective-container flex justify-center">
              <div className="w-full max-w-md card-3d-interactive floating-3d-hero">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-500/50 bg-slate-950 relative group">
                  <div className="animate-scanline" />
                  <img
                    src="/assets/3d/speed_3d_instant.jpg"
                    alt="3D 45-Second Rapid Verification Smartphone"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-4 bg-slate-950/90 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-black text-white">Rapid Government Sync</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400">TAT: 45 SECONDS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Verification Checks Matrix (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <span className="badge badge-cyan text-xs font-black uppercase tracking-wider">Multi-Source Engine</span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                  Direct Verification Across Official Repositories
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  JOY connects with government-authorized digital identity and employment databases with zero manual paperwork.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { title: 'UIDAI Aadhaar OTP & Address', desc: 'Instant OTP verification with masked demographic match and verified pin-code address.' },
                  { title: 'NSDL & Income Tax PAN Match', desc: 'Validates official PAN status, legal candidate full name, and father name match.' },
                  { title: 'EPFO Service Passbook Audit', desc: 'Authenticates Universal Account Number (UAN), past employer history, and PF records.' },
                  { title: 'MoRTH Transport Driving License', desc: 'Verifies commercial, heavy goods (HGV), and driver transport license validity.' },
                  { title: 'Bank IMPS Penny Drop', desc: 'Deposits ₹1 to active bank account to verify legal beneficiary name and IFSC.' },
                  { title: 'National Criminal & Court Records', desc: 'Searches e-Courts records across District, High Courts, and National Tribunals.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1.5 hover:border-indigo-500 transition-colors">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 🛡️ TRUST, DPDP ACT & CYBER SECURITY SECTION WITH 3D SHIELD */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="badge badge-emerald text-xs font-black uppercase tracking-wider">Enterprise Trust & Security</span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Bank-Grade Security with DPDP Act 2023 Compliance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                JOY TrueProfile is built strictly for enterprise corporate standards. We operate on zero-retention raw biometric architecture with candidate consent logging and ISO 27001 data encryption.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">DPDP Act 2023 Digital Consent Architecture</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Every candidate verification captures explicit, timestamped digital consent with purpose limitation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">ISO 27001:2022 Certified Infrastructure</h4>
                    <p className="text-[11px] text-slate-500 font-medium">All sensitive data in transit and at rest is secured with 256-bit TLS encryption.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-800 font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">100% CLRA Audit Pass Rate</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Standardized labor registers and candidate dossiers for government statutory inspections.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowLegalHandbook(true)}
                  className="btn btn-secondary text-xs py-2.5 px-5 font-bold flex items-center gap-2 cursor-pointer hover:border-purple-300"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>Open DPDP Compliance Handbook 🛡️</span>
                </button>
              </div>
            </div>

            {/* Right 3D Shield (5 cols) */}
            <div className="lg:col-span-5 perspective-container flex justify-center">
              <div className="w-full max-w-md card-3d-interactive floating-3d-hero">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-300/80 bg-white">
                  <img
                    src="/assets/3d/security_3d_shield.jpg"
                    alt="3D DPDP Act 2023 Security & Cyber Vault Shield"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black">DPDP 2023 Certified</div>
                      <div className="text-[10px] text-emerald-400">Zero-Retention Biometric Vault</div>
                    </div>
                    <span className="badge badge-emerald text-[9px] font-black">SECURE VAULT ✓</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 🎯 INTERACTIVE LIVE VERIFICATION SIMULATOR */}
      <section id="simulator" className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          
          <div className="text-center space-y-3">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">Experience Live Speed</span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Interactive 45-Second Verification Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl mx-auto">
              Select a workforce role below and experience how JOY authenticates identity, employment, and legal records in real-time.
            </p>
          </div>

          {/* Role Selectors */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { key: 'laborer', label: '👷 Contract Factory Laborer', badge: 'Blue-Collar' },
              { key: 'driver', label: '🚚 Logistics Fleet Driver', badge: 'MoRTH DL' },
              { key: 'executive', label: '💼 Enterprise Manager', badge: 'EPFO BGV' }
            ].map((role) => (
              <button
                key={role.key}
                onClick={() => handleRunSimulator(role.key)}
                className={`p-3 sm:px-5 sm:py-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                  selectedRoleSample === role.key
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg scale-102'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{role.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({role.badge})</span>
              </button>
            ))}
          </div>

          {/* Simulated Active Dossier Card */}
          <div className="glass-panel p-6 sm:p-8 bg-slate-900/90 border-2 border-slate-800 rounded-3xl shadow-2xl space-y-6 max-w-3xl mx-auto relative overflow-hidden">
            
            {/* Live Scanning Laser Beam Animation */}
            {simulating && <div className="animate-scanline" />}

            {/* Candidate Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {sampleRoles[selectedRoleSample].candidateName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black">{sampleRoles[selectedRoleSample].candidateName}</h3>
                    <span className="badge badge-emerald text-[9px] font-black">SAMPLE RECORD</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{sampleRoles[selectedRoleSample].title}</p>
                </div>
              </div>

              <button
                onClick={() => handleRunSimulator(selectedRoleSample)}
                disabled={simulating}
                className="btn btn-superadmin text-xs py-2.5 px-4 font-black flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Running Live Check...' : 'Re-Run Live Simulator ⚡'}</span>
              </button>
            </div>

            {/* Checks Execution Matrix */}
            <div className="space-y-2.5">
              {sampleRoles[selectedRoleSample].checks.map((chk, idx) => {
                const isPassed = !simulating || simStep > idx;
                const isCurrent = simulating && simStep === idx;

                return (
                  <div 
                    key={idx} 
                    className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-between text-xs transition-all ${
                      isPassed 
                        ? 'bg-slate-800/80 border border-emerald-500/30 text-slate-200' 
                        : isCurrent 
                          ? 'bg-indigo-950/70 border border-indigo-500 text-indigo-200 animate-pulse'
                          : 'bg-slate-950/50 border border-slate-900 text-slate-500 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Clock className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span className="font-bold">{chk.name}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`font-mono text-[11px] font-bold ${isPassed ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {isPassed ? chk.status : isCurrent ? 'Validating...' : 'Pending'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                        {chk.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complete Banner */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Verification Complete — Audit-Ready 5-Page Dossier Generated!</span>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="btn btn-secondary text-xs py-1.5 px-3 bg-white text-slate-900 font-bold hover:bg-slate-100 cursor-pointer shrink-0"
              >
                Request Enterprise Access 🚀
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ⭐ VERIFIED ENTERPRISE CLIENT REVIEWS */}
      <section id="reviews" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="badge badge-amber text-xs font-black uppercase tracking-wider">4.9 / 5.0 Rating</span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Trusted by Leading Industrial Plants & HR Leaders
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Read authentic feedback from corporate compliance officers, manufacturing plant heads, and staffing agencies.
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="btn btn-superadmin text-xs py-2.5 px-5 font-black flex items-center gap-2 cursor-pointer shrink-0 shadow-md"
            >
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              <span>Submit Verified Review ⭐</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            <button
              onClick={() => setReviewCategory('all')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer whitespace-nowrap ${
                reviewCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Reviews ({reviewsList.length})
            </button>
            <button
              onClick={() => setReviewCategory('labor')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer whitespace-nowrap ${
                reviewCategory === 'labor'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              👷 Factory & Contract Labor
            </button>
            <button
              onClick={() => setReviewCategory('logistics')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer whitespace-nowrap ${
                reviewCategory === 'logistics'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🚚 Driver & Logistics Fleet
            </button>
            <button
              onClick={() => setReviewCategory('corporate')}
              className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer whitespace-nowrap ${
                reviewCategory === 'corporate'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              💼 White-Collar & IT
            </button>
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
                onClick={() => handleInitiateRecharge(2500)}
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
                onClick={() => handleInitiateRecharge(5000)}
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
                onClick={() => handleInitiateRecharge(15000)}
                className="btn btn-secondary w-full text-xs py-3 font-bold justify-center cursor-pointer"
              >
                <span>Recharge ₹15,000 via Razorpay ⚡</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 📰 KNOWLEDGE BASE & COMPLIANCE ARTICLES */}
      <section id="blog" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="badge badge-indigo text-xs font-black uppercase tracking-wider">Compliance & Intelligence</span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Latest Workforce Verification Insights
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Authoritative legal guides, compliance checklists, and anti-fraud case studies from JOY Corporate Solutions.
              </p>
            </div>

            <Link 
              to="/blog" 
              className="btn btn-secondary text-xs py-2.5 px-5 font-bold flex items-center gap-2 group shrink-0"
            >
              <span>Explore Knowledge Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(publicArticles.length > 0 ? publicArticles : [
              {
                id: 1,
                slug: 'contract-labor-regulation-clra-compliance-guide-2026',
                title: 'Contract Labor Regulation Act (CLRA) 2026: Complete Corporate Compliance Guide',
                category: 'Labor Law & CLRA',
                read_time_minutes: 5,
                excerpt: 'Everything Indian manufacturing plants and staffing agencies need to prevent heavy statutory penalties and ghost contractor billing.',
                author_name: 'Adv. Suresh Nair',
                author_role: 'Senior Industrial Labor Law Counsel'
              },
              {
                id: 2,
                slug: 'detecting-dual-employment-moonlighting-epfo-passbook-audit',
                title: 'Detecting Dual Employment & Moonlighting via EPFO Career Audits',
                category: 'White-Collar BGV',
                read_time_minutes: 4,
                excerpt: 'How leading IT & BFSI enterprises catch overlapping service records and fake experience certificates with authenticated EPFO passbook audits.',
                author_name: 'Pooja Kashyap',
                author_role: 'VP – Talent Risk & Enterprise Security'
              },
              {
                id: 3,
                slug: 'dpdp-act-2023-candidate-consent-background-screening',
                title: 'DPDP Act 2023: Candidate Consent & Data Privacy in Background Screening',
                category: 'Data Privacy & DPDP',
                read_time_minutes: 6,
                excerpt: 'A step-by-step breakdown of digital consent architecture, purpose limitation, and automated audit trails under the new Data Protection Act.',
                author_name: 'Dr. Arvind Mahadevan',
                author_role: 'Chief Information Security Officer'
              }
            ]).map((art) => (
              <div 
                key={art.id || art.slug}
                className="glass-panel p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-purple text-[10px] font-bold">{art.category}</span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.read_time_minutes || 5} min read</span>
                    </span>
                  </div>

                  <Link to={`/blog/${art.slug}`}>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">{art.author_name}</span>
                    <span className="text-[10px] text-slate-400 font-medium block">{art.author_role}</span>
                  </div>
                  <Link 
                    to={`/blog/${art.slug}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
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

      {/* 🏢 ENTERPRISE FOOTER (Marketing First - Zero Portal Logins) */}
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
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Enterprise Capabilities</h5>
              <div className="flex flex-col space-y-1.5 font-semibold text-slate-400">
                <a href="#labor-solutions" className="hover:text-amber-400 transition-colors">👷 Contract Labor Management</a>
                <a href="#verification-engine" className="hover:text-indigo-400 transition-colors">⚡ Instant 45s Identity Verification</a>
                <a href="#labor-solutions" className="hover:text-purple-400 transition-colors">📊 EPFO Career Passbook Audits</a>
                <a href="#simulator" className="hover:text-emerald-400 transition-colors">🎯 Live Biometric Simulator</a>
                <Link to="/blog" className="hover:text-sky-400 transition-colors">📰 Knowledge Base & Legal Guides</Link>
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

      {/* 🚀 BOOK A LIVE ENTERPRISE DEMO MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 relative text-slate-900 mt-10">
            
            <button 
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Book Enterprise Demo</h3>
                <p className="text-xs text-slate-500 font-medium">Experience automated workforce verification live</p>
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
                  <button type="submit" disabled={demoLoading} className="btn btn-superadmin text-xs py-3 w-full font-black shadow-md cursor-pointer disabled:opacity-50">
                    <span>{demoLoading ? 'Submitting Request...' : 'Submit Demo Request 🚀'}</span>
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
                  Your review has been successfully submitted and will appear in our verified reviews once moderated.
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
                    <label className="block text-slate-700 font-bold mb-1">Company Legal Name</label>
                    <input 
                      type="text" 
                      placeholder="Titan Industrial Logistics"
                      value={reviewForm.company}
                      onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                      className="form-input py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Industry Category</label>
                    <select
                      value={reviewForm.industry}
                      onChange={(e) => setReviewForm({ ...reviewForm, industry: e.target.value })}
                      className="form-select py-2.5 text-xs font-bold"
                    >
                      <option value="labor">Contract / Industrial Labor</option>
                      <option value="logistics">Logistics & Fleet Drivers</option>
                      <option value="corporate">Corporate / IT / BFSI</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Feedback & Experience *</label>
                  <textarea 
                    rows="3"
                    required
                    placeholder="Share how JOY TrueProfile improved your onboarding TAT, eliminated fraud, or streamlined compliance..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="form-input py-2.5"
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={reviewLoading} className="btn btn-superadmin text-xs py-3 w-full font-black shadow-md cursor-pointer disabled:opacity-50">
                    <span>{reviewLoading ? 'Submitting Review...' : 'Submit Verified Review 🌟'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ⚖️ LEGAL & COMPLIANCE HANDBOOK MODAL */}
      <LegalComplianceHandbookModal
        isOpen={showLegalHandbook}
        onClose={() => setShowLegalHandbook(false)}
      />

      {/* 💳 RAZORPAY VERIFICATION RECHARGE MODAL */}
      <RazorpayPaymentModal
        isOpen={showLandingRazorpayModal}
        onClose={() => setShowLandingRazorpayModal(false)}
        rechargeAmount={landingSelectedAmount}
        onSuccess={() => {
          setShowLandingRazorpayModal(false);
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          alert('Verification wallet recharge successful!');
        }}
      />

    </div>
  );
};
