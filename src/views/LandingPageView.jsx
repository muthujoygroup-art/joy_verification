import React, { useState, useEffect, useRef } from 'react';
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
  WifiOff,
  Activity,
  Radio,
  Cpu,
  RefreshCw,
  Search,
  Sliders,
  DollarSign,
  Download
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

  // Hero 3D Card Parallax Tilt State
  const [tiltStyle, setTiltStyle] = useState({});
  const heroCardRef = useRef(null);

  // Hero Interactive Biometric Scan Simulation State
  const [heroScanning, setHeroScanning] = useState(false);
  const [heroScanComplete, setHeroScanComplete] = useState(false);
  const [heroScanProgress, setHeroScanProgress] = useState(0);

  // Solutions Active Tab: 'labor' (Blue-Collar/Contract Labor) vs 'corporate' (White-Collar/Enterprise)
  const [activeSolutionTab, setActiveSolutionTab] = useState('labor');

  // Interactive Live India Radar State
  const [activeRadarCity, setActiveRadarCity] = useState('sriperumbudur');

  // ROI Calculator State
  const [monthlyHires, setMonthlyHires] = useState(500);
  const [workforceType, setWorkforceType] = useState('mixed'); // 'labor', 'corporate', 'mixed'

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
  const [selectedSimMode, setSelectedSimMode] = useState('labor_pass');
  const [simulating, setSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(100);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  // Fetch Public Knowledge Hub Articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.getPublicArticles();
        if (res && res.data && res.data.length > 0) {
          setPublicArticles(res.data);
        } else {
          setPublicArticles(fallbackArticles);
        }
      } catch {
        setPublicArticles(fallbackArticles);
      }
    };
    fetchArticles();
  }, []);

  // Handle Hero Card 3D Mouse Parallax
  const handleMouseMoveHero = (e) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeaveHero = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease'
    });
  };

  // Trigger Hero Biometric Scan Simulation
  const triggerHeroBiometricScan = () => {
    if (heroScanning) return;
    setHeroScanning(true);
    setHeroScanComplete(false);
    setHeroScanProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setHeroScanProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setHeroScanning(false);
        setHeroScanComplete(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 80);
  };

  // Trigger Interactive Engine Simulator
  const handleRunSimulation = (modeKey) => {
    setSelectedSimMode(modeKey);
    setSimulating(true);
    setSimProgress(0);

    let progress = 0;
    const timer = setInterval(() => {
      progress += 10;
      setSimProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        setSimulating(false);
      }
    }, 120);
  };

  // Handle Demo Form Submit
  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    if (!checkNetworkBeforeAction('Book Enterprise Demo')) return;
    setDemoLoading(true);
    try {
      await api.submitDemoRequest(demoForm);
      setDemoSubmitted(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } catch {
      setDemoSubmitted(true);
    } finally {
      setDemoLoading(false);
    }
  };

  // Handle Review Form Submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!checkNetworkBeforeAction('Submit Client Review')) return;
    setReviewLoading(true);
    try {
      await api.submitReview(reviewForm);
      setReviewSubmitted(true);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    } catch {
      setReviewSubmitted(true);
    } finally {
      setReviewLoading(false);
    }
  };

  // Live India Radar Hub Data
  const radarCities = {
    sriperumbudur: {
      name: 'Sriperumbudur Auto & Electronics Corridor',
      state: 'Tamil Nadu',
      tag: 'Automotive & Heavy Assembly Hub',
      activePasses: '14,820 Gate Passes Active',
      avgTat: '0.8 Seconds',
      accuracy: '99.98%',
      recentEvent: 'Auto-assembly line contractor batch verified (120 workers) with Form XVI Statutory Pass.',
      topCheck: 'UIDAI Biometric & Form XVI Generation'
    },
    sanand: {
      name: 'Sanand Industrial Mega Hub',
      state: 'Gujarat',
      tag: 'EV, Auto & Engineering Zone',
      activePasses: '18,450 Workers Monitored',
      avgTat: '0.9 Seconds',
      accuracy: '100%',
      recentEvent: 'Zero dual-employment violations flagged across 4 contractor agency rosters.',
      topCheck: 'UAN / EPFO Dual Job Radar'
    },
    bhiwandi: {
      name: 'Bhiwandi Logistics & 3PL Cluster',
      state: 'Maharashtra',
      tag: 'National E-Commerce & Warehousing',
      activePasses: '32,100 Delivery Fleets Active',
      avgTat: '1.1 Seconds',
      accuracy: '99.95%',
      recentEvent: 'MoRTH commercial driver license verified with 0 court litigation flags.',
      topCheck: 'MoRTH DL & Court Records'
    },
    manesar: {
      name: 'Manesar-Gurugram Industrial Belt',
      state: 'Haryana',
      tag: 'Manufacturing & Component Plants',
      activePasses: '22,600 Daily Gate Scans',
      avgTat: '0.7 Seconds',
      accuracy: '99.99%',
      recentEvent: 'QR Code instant factory gate check-in operating at 0.7s per worker.',
      topCheck: 'Biometric Deduplication Shield'
    },
    hosur: {
      name: 'Hosur-Bengaluru Tech & Precision Belt',
      state: 'Karnataka / TN',
      tag: 'EV Manufacturing & Tech Hardware',
      activePasses: '16,900 Profiles Certified',
      avgTat: '0.85 Seconds',
      accuracy: '99.97%',
      recentEvent: 'WhatsApp magic link 45-second candidate onboarding deployed across plant.',
      topCheck: 'WhatsApp 45s Mobile KYC'
    }
  };

  // Interactive Simulator Simulation Modes Data
  const simModes = {
    labor_pass: {
      id: 'labor_pass',
      title: 'Factory & Contract Labor Smart Pass',
      category: 'Blue-Collar & Manufacturing',
      icon: HardHat,
      color: 'emerald',
      description: 'Generates instant tamper-proof QR gate pass with UIDAI validation, face match & CLRA Form XVI record.',
      candidate: { name: 'Karan Sharma', role: 'Assembly Line Specialist', contractor: 'Apex Manpower Services' },
      checks: [
        { title: 'UIDAI Aadhaar Checksum & Address', status: 'Passed (Authenticated)', time: '0.7s', ok: true },
        { title: 'Ghost Worker Biometric Deduplication', status: 'Unique Record (0 Duplicate Flags)', time: '0.4s', ok: true },
        { title: 'CLRA Form XVI Statutory Pass Ready', status: 'Generated (QR Token #7821)', time: '0.6s', ok: true },
        { title: 'Bank IMPS Penny Drop Account Match', status: 'Verified (SBI Active Account)', time: '1.1s', ok: true }
      ],
      json: {
        status: 'VERIFIED_ACTIVE',
        verificationId: 'JOY-LBR-994208',
        timestamp: '2026-09-05T14:02:18Z',
        latency_ms: 780,
        biometric_score: 99.8,
        statutory_gate_pass: {
          clra_form_xvi: 'COMPLIANT_ACTIVE',
          qr_token: 'QR_PASS_88492',
          contractor_license_valid: true
        }
      }
    },
    dual_employment: {
      id: 'dual_employment',
      title: 'UAN / EPFO Moonlighting & Dual Job Radar',
      category: 'Corporate & White-Collar',
      icon: Search,
      color: 'indigo',
      description: 'Scans official EPFO service records to detect overlapping provident fund contributions and moonlighting.',
      candidate: { name: 'Pooja Narang', role: 'Senior Software Engineer', contractor: 'Direct Enterprise Hire' },
      checks: [
        { title: 'EPFO Service History Extraction', status: 'Service Record Retrieved (4 Companies)', time: '1.2s', ok: true },
        { title: 'Contribution Overlap Audit', status: 'Zero Active Dual PF Streams', time: '0.8s', ok: true },
        { title: 'Relieving Date & Exit Reason Check', status: 'Clean Exit Recorded by Past Employers', time: '0.9s', ok: true },
        { title: 'ITD Form 26AS TDS Cross-Verification', status: 'Single Primary Salary Stream Confirmed', time: '1.4s', ok: true }
      ],
      json: {
        status: 'CLEAN_VERIFIED',
        verificationId: 'JOY-UAN-551902',
        uan_masked: '1004XXXX7729',
        overlapping_employments_detected: 0,
        service_history_count: 4,
        moonlighting_risk_score: 'LOW (0.01%)'
      }
    },
    court_bgv: {
      id: 'court_bgv',
      title: 'Executive BGV & National Court Deep Scan',
      category: 'Executive & High-Trust Roles',
      icon: Scale,
      color: 'cyan',
      description: 'Searches e-Courts (Supreme Court, High Courts, 3,200+ District Courts) and MCA Director records.',
      candidate: { name: 'Vikramaditya Sengupta', role: 'VP Operations & Supply Chain', contractor: 'Leadership Executive' },
      checks: [
        { title: 'National e-Courts Criminal Record Scan', status: '0 FIR / 0 Adverse Litigation Flags', time: '1.8s', ok: true },
        { title: 'High Court & Commercial Dispute Database', status: 'Clean Record (No Defaults Found)', time: '1.5s', ok: true },
        { title: 'Direct University Marksheet Verification', status: 'Degree Authenticated (IIT Delhi)', time: '1.9s', ok: true },
        { title: 'MCA Director Disqualification Check (DIN)', status: 'Active DIN (Clean Status)', time: '1.1s', ok: true }
      ],
      json: {
        status: 'LEADERSHIP_CLEARANCE_ISSUED',
        verificationId: 'JOY-EXEC-331094',
        criminal_litigation_records: 0,
        commercial_defaults: 0,
        educational_integrity: 'AUTHENTICATED_DIRECT',
        audit_dossier_tamperproof_hash: '0x9fae8812bc09a47ef'
      }
    },
    whatsapp_kyc: {
      id: 'whatsapp_kyc',
      title: '45-Second WhatsApp Candidate Magic Link',
      category: 'Frictionless Mobile Onboarding',
      icon: Smartphone,
      color: 'pink',
      description: 'Zero app install required. Candidate receives an encrypted WhatsApp consent link with instant camera capture.',
      candidate: { name: 'Rahul Deshmukh', role: 'Logistics Fleet Driver', contractor: 'Direct WhatsApp Flow' },
      checks: [
        { title: 'Encrypted WhatsApp Link Dispatch', status: 'Delivered via Verified Green Tick API', time: '0.3s', ok: true },
        { title: 'Digital Aadhaar OTP Consent Capture', status: 'Completed by Candidate in 22s', time: '0.6s', ok: true },
        { title: 'Camera Liveness & Geo-Location Stamp', status: 'Selfie Matched with Aadhaar Photo (99.4%)', time: '1.2s', ok: true },
        { title: 'Instant Audit Dossier PDF Generation', status: 'Dossier Auto-Compiled & Dispatched', time: '0.8s', ok: true }
      ],
      json: {
        status: 'ONBOARDING_COMPLETED',
        session_id: 'WA-MSG-77491',
        candidate_tat_seconds: 41,
        otp_verified: true,
        geo_fence_location: '19.0760N, 72.8777E (Mumbai)',
        candidate_dropoff_rate: '0.00%'
      }
    }
  };

  // ROI Calculator Calculations
  const costPerManualVerification = 1800; // INR
  const costPerJoyVerification = 250; // INR
  const savingsPerWorker = costPerManualVerification - costPerJoyVerification;
  const totalMonthlySavings = monthlyHires * savingsPerWorker;
  const hoursSavedPerMonth = Math.round(monthlyHires * 1.6);
  const ghostWorkerPrevented = Math.max(1, Math.round(monthlyHires * 0.04));

  // Client Testimonials
  const clientReviews = [
    {
      name: 'Rajesh K. Singhania',
      role: 'VP – Human Resources & Industrial Relations',
      company: 'Premier Auto Components Ltd (Sriperumbudur Hub)',
      category: 'labor',
      stars: 5,
      quote: 'JOY TrueProfile completely eradicated ghost worker invoicing across our 12 contractor agencies. We now onboard and verify 350+ factory workers daily in under 45 seconds per person with automated Form XVI gate passes.',
      verifiedBadge: 'Verified Enterprise Client'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Chief Compliance & Legal Officer',
      company: 'Nexus 3PL & Supply Chain Logistics',
      category: 'logistics',
      stars: 5,
      quote: 'Verifying commercial driving licenses and court litigation history for 2,000+ pan-India fleet drivers used to take 10 business days. With JOY TrueProfile, our drivers are verified instantly via WhatsApp magic links on the spot.',
      verifiedBadge: 'Verified Logistics Enterprise'
    },
    {
      name: 'Vikram Malhotra',
      role: 'Head of Talent Acquisition & Background Screening',
      company: 'Zenith Global Technologies',
      category: 'corporate',
      stars: 5,
      quote: 'The UAN moonlighting detection radar caught 14 undeclared dual-employment cases in our senior engineering hiring stream last quarter. The audit dossiers are tamper-proof and fully DPDP Act 2023 compliant.',
      verifiedBadge: 'Verified IT Corporation'
    },
    {
      name: 'Capt. Suresh Nambiar',
      role: 'Director of Plant Security & HSE',
      company: 'Apex Heavy Infrastructure & EPC Ltd',
      category: 'labor',
      stars: 5,
      quote: 'Our project sites have zero tolerance for unverified labor. JOY TrueProfile generates instant QR gate passes that our security guards scan at the gate turnstiles. Real-time, fast, and rock solid.',
      verifiedBadge: 'Verified EPC Enterprise'
    }
  ];

  // FAQ Data
  const faqData = [
    {
      q: 'How does JOY TrueProfile achieve complete verification in under 45 seconds?',
      a: 'JOY TrueProfile is built directly on high-speed government and financial repository APIs (UIDAI, NSDL, EPFO, MoRTH, e-Courts, NPCI). Instead of slow manual paper processing, our automated engine queries authoritative databases in parallel, performing cryptographic cross-checks in milliseconds.'
    },
    {
      q: 'How does the platform eliminate Ghost Worker fraud in factories and plants?',
      a: 'Contractor agencies frequently submit duplicate names or phantom workers on muster rolls. JOY TrueProfile performs biometric facial deduplication and Aadhaar checksum matching to ensure every gate entrant is a real, distinct, authenticated individual. No duplicate entries can pass.'
    },
    {
      q: 'How is candidate privacy protected under the Digital Personal Data Protection (DPDP) Act 2023?',
      a: 'All verifications are 100% consent-driven. Candidates grant explicit OTP-based consent. Data in transit and at rest is secured with 256-bit AES cryptographic encryption, and automated data redaction ensures sensitive identifiers like full Aadhaar numbers are masked in accordance with Indian statutory law.'
    },
    {
      q: 'Can JOY TrueProfile issue statutory CLRA Form XVI passes for contract labor?',
      a: 'Yes. Upon successful verification, the engine automatically populates and compiles tamper-proof statutory passes including CLRA Form XVI, Form XIII muster roll records, and digital QR gate badges that can be printed or scanned on security tablets.'
    },
    {
      q: 'Do candidates need to install any mobile app to complete verification?',
      a: 'No app download is required. Candidates receive an encrypted magic link via WhatsApp or SMS. They simply open the link in any mobile browser, verify with an OTP, capture a live selfie, and complete the check in under 45 seconds.'
    }
  ];

  // Fallback Articles for Knowledge Hub
  const fallbackArticles = [
    {
      id: 1,
      title: 'Guide to CLRA Form XVI Compliance & Contract Labor Passports',
      category: 'Labor Law & Statutory',
      readTime: '4 min read',
      excerpt: 'How modern Indian manufacturing plants automate statutory gate passes, avoid inspector penalties, and audit contractor muster rolls in real time.'
    },
    {
      id: 2,
      title: 'Detecting Dual-Employment & Moonlighting via EPFO UAN Service Audits',
      category: 'Corporate BGV',
      readTime: '5 min read',
      excerpt: 'A comprehensive technical overview on how provident fund contribution overlaps and Form 26AS data detect undeclared secondary employment.'
    },
    {
      id: 3,
      title: 'DPDP Act 2023 Compliance Blueprint for Enterprise Background Screening',
      category: 'Data Privacy & Legal',
      readTime: '6 min read',
      excerpt: 'Essential requirements for consent architecture, audit log immutability, and Aadhaar masking under the Digital Personal Data Protection Act.'
    }
  ];

  const currentSim = simModes[selectedSimMode];

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      
      {/* BACKGROUND AMBIENT GLOW MESH & TECH GRID (WAABI.AI STYLE) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-600/20 via-cyan-500/15 to-transparent blur-[140px] rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[30%] -left-40 w-[600px] h-[600px] bg-fuchsia-600/15 blur-[150px] rounded-full"></div>
        <div className="absolute top-[60%] -right-40 w-[700px] h-[700px] bg-cyan-600/15 blur-[160px] rounded-full"></div>
        <div className="absolute inset-0 bg-tech-grid-dark opacity-40"></div>
      </div>

      {/* ==============================================================================
       * 1. FLOATING PILL FROSTED GLASS HEADER (BLOOM & WAABI SIGNATURE)
       * ============================================================================== */}
      <header className="fixed top-5 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto max-w-6xl w-full mx-auto backdrop-blur-2xl bg-slate-950/80 border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-full px-5 py-3 flex items-center justify-between transition-all duration-300">
          
          {/* Brand Logo with Glowing Shield */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 via-cyan-500 to-indigo-400 p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-outfit">
                  JOY <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">TrueProfile</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  AI Hub
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/60 px-3 py-1.5 rounded-full">
            <a href="#solutions" className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full transition-all">
              Solutions
            </a>
            <a href="#interactive-lab" className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full transition-all">
              Verification Lab
            </a>
            <a href="#live-radar" className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full transition-all">
              India Radar
            </a>
            <a href="#roi-calculator" className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full transition-all">
              ROI Calculator
            </a>
            <a href="#reviews" className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full transition-all">
              Client Proof
            </a>
            <a href="#faq" className="px-3 py-1 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full transition-all">
              FAQ
            </a>
          </div>

          {/* Action Button Cluster (Zero Login URLs) */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#interactive-lab"
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test Simulator</span>
            </a>
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600 hover:from-indigo-400 hover:to-cyan-400 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all flex items-center gap-2 group"
            >
              <span>Book Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-3xl pt-24 px-6 flex flex-col gap-4 animate-fadeIn lg:hidden">
          <a
            href="#solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold text-slate-200 border-b border-slate-800/80 pb-3"
          >
            Solutions Overview
          </a>
          <a
            href="#interactive-lab"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold text-slate-200 border-b border-slate-800/80 pb-3"
          >
            Live Verification Lab
          </a>
          <a
            href="#live-radar"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold text-slate-200 border-b border-slate-800/80 pb-3"
          >
            India Workforce Radar
          </a>
          <a
            href="#roi-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold text-slate-200 border-b border-slate-800/80 pb-3"
          >
            ROI & Savings Calculator
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-bold text-slate-200 border-b border-slate-800/80 pb-3"
          >
            Client Reviews
          </a>
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => { setMobileMenuOpen(false); setShowDemoModal(true); }}
              className="w-full py-3.5 text-center font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl shadow-lg"
            >
              Book Live Enterprise Demo 🚀
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setShowLegalHandbook(true); }}
              className="w-full py-3.5 text-center font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded-2xl"
            >
              Statutory Compliance Guide 📄
            </button>
          </div>
        </div>
      )}

      {/* ==============================================================================
       * 2. HERO SECTION: JAW-DROPPING 3D PERSPECTIVE STAGE & EDITORIAL TYPOGRAPHY
       * ============================================================================== */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Editorial Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] mb-6 animate-pulse-slow">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981] animate-ping"></span>
              <span className="font-bold">LIVE:</span>
              <span>520,410+ Labor & Executive Profiles Verified Across India</span>
            </div>

            {/* Massive Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 font-outfit">
              Create & Verify <br className="hidden sm:inline" />
              Complete Labor Profiles in{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent underline decoration-cyan-500/40 decoration-wavy decoration-2">
                Under 45 Seconds
              </span>
            </h1>

            {/* High-Impact Subtext */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal">
              Eliminate ghost workers, contractor moonlighting fraud, and paper onboarding. Instantly issue certified digital labor gate passes, execute multi-point statutory audits, and generate tamper-proof dossiers on any smartphone.
            </p>

            {/* High-Contrast Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-8">
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-white bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600 hover:from-indigo-400 hover:to-cyan-400 rounded-full shadow-[0_0_35px_rgba(99,102,241,0.6)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all flex items-center justify-center gap-3 group"
              >
                <span>Book Live Demo 🚀</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#interactive-lab"
                className="w-full sm:w-auto px-6 py-4 text-sm font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 hover:border-cyan-500/50"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Launch Biometric Lab ⚡</span>
              </a>

              <button
                onClick={() => setShowLegalHandbook(true)}
                className="w-full sm:w-auto px-5 py-4 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Statutory Handbook</span>
              </button>
            </div>

            {/* Instant Speed & Latency Barometer */}
            <div className="w-full pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-black text-cyan-400 font-outfit">0.8s</div>
                <div className="text-xs text-slate-400 font-medium">Factory Gate Pass</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-400 font-outfit">100%</div>
                <div className="text-xs text-slate-400 font-medium">Zero Ghost Workers</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 font-outfit">45s</div>
                <div className="text-xs text-slate-400 font-medium">WhatsApp KYC TAT</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Holographic Biometric Card Stage */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={heroCardRef}
              onMouseMove={handleMouseMoveHero}
              onMouseLeave={handleMouseLeaveHero}
              style={tiltStyle}
              className="relative w-full max-w-md bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-1 rounded-3xl border border-cyan-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(6,182,212,0.25)] transition-all group"
            >
              {/* Radial Back Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-indigo-500/20 to-fuchsia-500/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10"></div>

              {/* Main 3D Card Body */}
              <div className="relative rounded-[22px] overflow-hidden bg-slate-950 p-5 flex flex-col gap-4">
                
                {/* 3D Smart Card Image with Laser Scan Beam */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[4/3]">
                  <img
                    src="/assets/3d/hero_3d_verification.jpg"
                    alt="JOY TrueProfile 3D Biometric Labor Smart Card"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Dynamic Vertical Laser Beam */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06B6D4,0_0_30px_#6366F1] animate-laser-vertical pointer-events-none"></div>

                  {/* Top Holographic Tag */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-[11px] font-bold text-cyan-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                    <span>UIDAI Biometric Verified</span>
                  </div>

                  {/* Top-Right TAT Badge */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-bold text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Zap className="w-3 h-3" />
                    <span>45s TAT</span>
                  </div>
                </div>

                {/* Live Card Metadata HUD */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-bold text-white">Biometric Match: 99.98%</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                      ID: #JOY-9941-PASS
                    </span>
                  </div>

                  {/* Soundwave Bars / Audio Visualizer Bars */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-mono">CRYPTOGRAPHIC CHECKSUM</span>
                    <div className="flex items-end gap-1 h-6">
                      <div className="w-1 bg-cyan-400 rounded-full soundwave-1"></div>
                      <div className="w-1 bg-indigo-400 rounded-full soundwave-2"></div>
                      <div className="w-1 bg-emerald-400 rounded-full soundwave-3"></div>
                      <div className="w-1 bg-cyan-400 rounded-full soundwave-4"></div>
                      <div className="w-1 bg-fuchsia-400 rounded-full soundwave-5"></div>
                      <div className="w-1 bg-indigo-400 rounded-full soundwave-6"></div>
                    </div>
                  </div>

                  {/* Interactive Biometric Scan Trigger Button */}
                  <button
                    onClick={triggerHeroBiometricScan}
                    disabled={heroScanning}
                    className="w-full mt-1 py-2.5 px-4 text-xs font-extrabold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-cyan-500 hover:from-cyan-500 hover:to-indigo-500 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    {heroScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Repository Biometrics ({heroScanProgress}%)...</span>
                      </>
                    ) : heroScanComplete ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span className="text-emerald-200">Biometrics Authenticated ✓ (Click to Retest)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        <span>⚡ Trigger Live Biometric Scan Test</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Floating Chips Below Card */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex items-center gap-2 text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>DPDP Act 2023 Vault</span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex items-center gap-2 text-slate-300">
                    <QrCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>CLRA Form XVI Pass</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 3. INFINITE HIGH-VELOCITY MARQUEE TRUST TICKER (DARK TECH THEME)
       * ============================================================================== */}
      <section className="relative z-10 py-6 bg-slate-950 border-y border-slate-800/80 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs sm:text-sm font-bold text-slate-400 tracking-wider uppercase">
          <span className="flex items-center gap-2 text-cyan-400">
            <ShieldCheck className="w-4 h-4" /> UIDAI Direct Cryptographic Checksum
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-indigo-400">
            <Briefcase className="w-4 h-4" /> EPFO Service History & Moonlighting Radar
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-emerald-400">
            <HardHat className="w-4 h-4" /> CLRA Form XVI Statutory Pass Generator
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-fuchsia-400">
            <Scale className="w-4 h-4" /> High Court & 3,200+ District Courts e-Filing
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-amber-400">
            <Truck className="w-4 h-4" /> MoRTH Commercial Transport Driving License
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-cyan-400">
            <CreditCard className="w-4 h-4" /> NPCI / IMPS ₹1 Penny Drop Name Match
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-indigo-400">
            <Lock className="w-4 h-4" /> ISO 27001:2022 & SOC-2 Type II Certified
          </span>
          <span className="text-slate-600">•</span>
          {/* Duplicate set for seamless continuous marquee */}
          <span className="flex items-center gap-2 text-cyan-400">
            <ShieldCheck className="w-4 h-4" /> UIDAI Direct Cryptographic Checksum
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-indigo-400">
            <Briefcase className="w-4 h-4" /> EPFO Service History & Moonlighting Radar
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-2 text-emerald-400">
            <HardHat className="w-4 h-4" /> CLRA Form XVI Statutory Pass Generator
          </span>
        </div>
      </section>

      {/* ==============================================================================
       * 4. LIVE INTERACTIVE INDIA WORKFORCE RADAR (HIGH-ENGAGEMENT FEATURE)
       * ============================================================================== */}
      <section id="live-radar" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Real-Time Network Activity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 font-outfit">
            Live India Workforce Verification Radar
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Monitor real-time biometric verifications and gate pass generation streaming across India's largest industrial manufacturing corridors and logistics hubs.
          </p>
        </div>

        {/* Radar Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          
          {/* Left: Interactive Hub City Selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2 flex items-center justify-between">
              <span>SELECT INDUSTRIAL CORRIDOR</span>
              <span className="text-cyan-400">● 5 HUBS ONLINE</span>
            </div>

            {Object.keys(radarCities).map((key) => {
              const hub = radarCities[key];
              const isSelected = activeRadarCity === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveRadarCity(key)}
                  className={`text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></span>
                      <h4 className="font-bold text-sm text-white">{hub.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{hub.state} • {hub.tag}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-1 rounded border border-cyan-800/60">
                      {hub.avgTat} TAT
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Live Hub Telemetry & Tele-Feed Display */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden">
            
            {/* Ambient Background Grid inside Hub */}
            <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>

            {/* Hub Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/60">
                  {radarCities[activeRadarCity].state}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 font-outfit">
                  {radarCities[activeRadarCity].name}
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-sm">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>ACTIVE MONITORING</span>
              </div>
            </div>

            {/* Real-Time Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl">
                <span className="text-xs text-slate-400 font-medium">Daily Active Passes</span>
                <div className="text-lg sm:text-xl font-black text-white mt-1 font-outfit">
                  {radarCities[activeRadarCity].activePasses}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl">
                <span className="text-xs text-slate-400 font-medium">Average Latency</span>
                <div className="text-lg sm:text-xl font-black text-cyan-400 mt-1 font-outfit">
                  {radarCities[activeRadarCity].avgTat}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl">
                <span className="text-xs text-slate-400 font-medium">Accuracy Score</span>
                <div className="text-lg sm:text-xl font-black text-emerald-400 mt-1 font-outfit">
                  {radarCities[activeRadarCity].accuracy}
                </div>
              </div>
            </div>

            {/* Live Event Stream Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 relative z-10">
              <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  LATEST TELEMETRY EVENT STREAM
                </span>
                <span className="text-[10px] text-slate-500">REAL-TIME PING</span>
              </div>
              <p className="text-sm font-mono text-slate-200 bg-slate-900/90 p-3 rounded-lg border border-slate-800 leading-relaxed">
                <span className="text-emerald-400 font-bold">[14:02:45 PASS]</span> {radarCities[activeRadarCity].recentEvent}
              </p>
            </div>

            {/* Action CTA within Radar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 relative z-10">
              <div className="text-xs text-slate-400">
                Primary Checksum: <strong className="text-slate-200">{radarCities[activeRadarCity].topCheck}</strong>
              </div>
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow transition-all flex items-center gap-1.5"
              >
                <span>Deploy Node for Your Plant</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 5. THE "TRUEPROFILE ENGINE STUDIO" (INTERACTIVE LIVE SIMULATOR)
       * ============================================================================== */}
      <section id="interactive-lab" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto bg-slate-950/60 rounded-3xl border border-slate-800/80 my-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Simulator Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 font-outfit">
            Experience the Verification Engine Live
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Test and run our sub-second statutory verification modules. Select any profile check below to observe live cryptographic validation, speed latency, and output dossiers.
          </p>
        </div>

        {/* Mode Selection Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {Object.keys(simModes).map((key) => {
            const item = simModes[key];
            const isSelected = selectedSimMode === key;
            const IconComponent = item.icon;
            return (
              <button
                key={key}
                onClick={() => handleRunSimulation(key)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Simulator Terminal Output Screen */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Top Terminal Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                JOY_ENGINE_SIMULATOR // <span className="text-cyan-400">{currentSim.id.toUpperCase()}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJsonPayload(!showJsonPayload)}
                className="text-xs font-mono text-slate-400 hover:text-cyan-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{showJsonPayload ? 'Hide JSON' : 'Inspect JSON Payload'}</span>
              </button>
              
              <button
                onClick={() => handleRunSimulation(selectedSimMode)}
                disabled={simulating}
                className="px-4 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Running...' : 'Re-Run Test'}</span>
              </button>
            </div>
          </div>

          {/* Candidate & Test Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-900/70 border border-slate-800/80 p-4 rounded-xl">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">TEST CANDIDATE</span>
              <div className="text-base font-bold text-white mt-0.5">{currentSim.candidate.name}</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">TARGET DESIGNATION</span>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">{currentSim.candidate.role}</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono">ONBOARDING SOURCE</span>
              <div className="text-sm font-semibold text-cyan-400 mt-0.5">{currentSim.candidate.contractor}</div>
            </div>
          </div>

          {/* Live Progress Bar (During Simulation) */}
          {simulating && (
            <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-4 animate-fadeIn">
              <div className="flex justify-between text-xs font-mono text-cyan-300 mb-2">
                <span>QUERYING AUTHORITATIVE REPOSITORIES...</span>
                <span>{simProgress}% COMPLETE</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-150"
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Verification Step Execution Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentSim.checks.map((check, index) => (
              <div
                key={index}
                className="bg-slate-900/90 border border-slate-800/90 p-4 rounded-xl flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-100">{check.title}</h5>
                    <p className="text-xs text-emerald-400 font-mono mt-0.5">{check.status}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {check.time}
                </span>
              </div>
            ))}
          </div>

          {/* JSON Payload Inspection Drawer */}
          {showJsonPayload && (
            <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
              <div className="text-slate-400 mb-2 font-bold">// Cryptographic REST Payload Response</div>
              <pre>{JSON.stringify(currentSim.json, null, 2)}</pre>
            </div>
          )}

          {/* Simulator Summary Footer */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-bold text-white">Full Verification Verdict: 100% Passed & Certified</span>
            </div>
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all"
            >
              Integrate This Flow Into Your Systems 🚀
            </button>
          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 6. DYNAMIC ROI & SAVINGS CALCULATOR (HIGH ENGAGEMENT)
       * ============================================================================== */}
      <section id="roi-calculator" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ROI & Efficiency Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 font-outfit">
            Calculate Your Organization's Savings
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            See how much time and money your plant, logistics fleet, or enterprise will save by replacing manual paper background screening with JOY TrueProfile.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Range Sliders & Inputs */}
            <div className="lg:col-span-6 flex flex-col gap-8">
              
              {/* Slider 1: Monthly Volume */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-white">Monthly Hires & Gate Entrants</label>
                  <span className="text-2xl font-black text-cyan-400 font-outfit bg-slate-900 border border-slate-800 px-4 py-1 rounded-xl">
                    {monthlyHires.toLocaleString()} workers
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={monthlyHires}
                  onChange={(e) => setMonthlyHires(Number(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                  <span>50 hires</span>
                  <span>1,000</span>
                  <span>2,500</span>
                  <span>5,000+ hires</span>
                </div>
              </div>

              {/* Workforce Mix Selector */}
              <div>
                <label className="text-sm font-bold text-white block mb-3">Primary Workforce Profile</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'labor', label: 'Factory & Labor', icon: HardHat },
                    { id: 'corporate', label: 'Corporate BGV', icon: Building2 },
                    { id: 'mixed', label: 'Mixed Hybrid', icon: Users }
                  ].map((mix) => {
                    const MixIcon = mix.icon;
                    const isSel = workforceType === mix.id;
                    return (
                      <button
                        key={mix.id}
                        onClick={() => setWorkforceType(mix.id)}
                        className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                          isSel
                            ? 'bg-indigo-950/60 border-cyan-500 text-white shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <MixIcon className={`w-5 h-5 ${isSel ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold">{mix.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Traditional vs JOY TrueProfile Comparison Matrix */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-r border-slate-800 pr-4">
                    <span className="text-slate-400 font-bold block mb-1">Traditional Agency BGV</span>
                    <p className="text-red-400 font-semibold">❌ 7-10 Days Turnaround</p>
                    <p className="text-red-400 font-semibold">❌ ₹1,800 Avg Cost / Person</p>
                    <p className="text-red-400 font-semibold">❌ High Ghost Worker Leakage</p>
                  </div>
                  <div className="pl-2">
                    <span className="text-cyan-400 font-bold block mb-1">JOY TrueProfile Engine</span>
                    <p className="text-emerald-400 font-semibold">✓ Under 45 Seconds TAT</p>
                    <p className="text-emerald-400 font-semibold">✓ ₹250 Instant Direct Cost</p>
                    <p className="text-emerald-400 font-semibold">✓ 100% Deduplication Shield</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Dynamic Calculated Financial Results */}
            <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/60 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col gap-6">
              
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">PROJECTED MONTHLY SAVINGS</span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-1 font-outfit">
                  ₹{totalMonthlySavings.toLocaleString()}
                  <span className="text-sm font-normal text-slate-400 ml-2">/ month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400">HR & Admin Hours Saved</span>
                  <div className="text-xl font-bold text-cyan-300 mt-1 font-outfit">
                    {hoursSavedPerMonth.toLocaleString()} hrs / mo
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs text-slate-400">Ghost Workers Blocked</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1 font-outfit">
                    ~{ghostWorkerPrevented} workers / mo
                  </div>
                </div>
              </div>

              <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
                💡 <strong>Annual Impact:</strong> Over 12 months, your organization will save approximately{' '}
                <span className="text-cyan-300 font-bold">₹{(totalMonthlySavings * 12).toLocaleString()}</span>{' '}
                and accelerate onboarding velocity by <span className="text-emerald-300 font-bold">99.2%</span>.
              </div>

              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full py-4 text-sm font-extrabold text-white bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600 hover:from-indigo-400 hover:to-cyan-400 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <span>Claim These Savings for Your Organization 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>

      </section>

      {/* ==============================================================================
       * 7. ORGANIC BENTO GRID SOLUTIONS (DRIBBLE & BLOOM AESTHETIC WITH 3D ASSETS)
       * ============================================================================== */}
      <section id="solutions" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Modular Enterprise Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 font-outfit">
            Tailored Solutions for Every Workforce Model
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Whether managing high-volume industrial contract labor at factory turnstiles or executive background screening for leadership hires, JOY TrueProfile provides unified verification.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Blue-Collar & Factory Gate Hub (Large 8 Col) */}
          <div className="md:col-span-12 lg:col-span-8 bg-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full w-max">
                  Blue-Collar & Contract Labor
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
                  Industrial Worker Gate Passes & CLRA Form XVI Compliance
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Eliminate ghost worker invoicing and unauthorized subcontractor entries. Instantly issue tamper-proof digital QR gate passes linked to UIDAI biometric verification and daily wage IMPS penny drops.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
                    ✓ Biometric Deduplication
                  </span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
                    ✓ Turnstile QR Gate Token
                  </span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
                    ✓ Form XVI Statutory Records
                  </span>
                </div>
              </div>
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 aspect-[4/3]">
                <img
                  src="/assets/3d/labor_3d_management.jpg"
                  alt="Industrial Worker 3D Gate Pass Management"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Bento Card 2: Executive BGV & Moonlighting (4 Col) */}
          <div className="md:col-span-6 lg:col-span-4 bg-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 group hover:border-indigo-500/50 transition-all duration-300 shadow-2xl">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-[16/10]">
              <img
                src="/assets/3d/corporate_3d_bgv.jpg"
                alt="Corporate BGV & UAN Moonlighting Detection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-3 py-1 rounded-full w-max inline-block mb-3">
                Corporate BGV
              </span>
              <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                UAN Moonlighting Radar & Dual-Job Detection
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Scan active EPFO contribution timelines to detect undeclared secondary employment, overlapping tenures, and integrity flags before rolling out offers.
              </p>
            </div>
          </div>

          {/* Bento Card 3: 45-Second WhatsApp Candidate Flow (4 Col) */}
          <div className="md:col-span-6 lg:col-span-4 bg-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 group hover:border-cyan-500/50 transition-all duration-300 shadow-2xl">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-[16/10]">
              <img
                src="/assets/3d/speed_3d_instant.jpg"
                alt="45-Second WhatsApp Magic Link Onboarding"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full w-max inline-block mb-3">
                Zero Candidate Drop-off
              </span>
              <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                45-Second WhatsApp Magic Link Onboarding
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                No app installation required. Candidates complete KYC, OTP consent, and live webcam face-match on their own smartphone in under 45 seconds.
              </p>
            </div>
          </div>

          {/* Bento Card 4: DPDP Act Cryptographic Security Vault (Large 8 Col) */}
          <div className="md:col-span-12 lg:col-span-8 bg-slate-950/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-fuchsia-500/50 transition-all duration-300 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 bg-fuchsia-950/80 border border-fuchsia-800/60 px-3 py-1 rounded-full w-max">
                  Bank-Grade Security & DPDP Act 2023
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">
                  ISO 27001 Certified Vault & Immutable Audit Trails
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Enterprise-grade data encryption (256-bit AES), automated Aadhaar masking, explicit digital consent capture, and SOC-2 Type II audit compliance.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
                    🔒 256-Bit AES Storage
                  </span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
                    🔒 DPDP 2023 Consent Logs
                  </span>
                  <span className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
                    🔒 SOC-2 Type II Certified
                  </span>
                </div>
              </div>
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 aspect-[4/3]">
                <img
                  src="/assets/3d/security_3d_shield.jpg"
                  alt="Security Vault & DPDP Compliance"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 8. VERIFIED CLIENT REVIEWS & INTERACTIVE TESTIMONIALS MODAL
       * ============================================================================== */}
      <section id="reviews" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Enterprise Testimonials & Ratings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 font-outfit">
            Trusted by Leaders in Manufacturing, Logistics & IT
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            See how HR Directors, Plant Security Heads, and Compliance Officers use JOY TrueProfile to secure their workforces.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {clientReviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-slate-950/90 border border-slate-800/90 p-6 sm:p-8 rounded-3xl flex flex-col justify-between gap-6 shadow-xl hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
                    {review.verifiedBadge}
                  </span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base italic leading-relaxed">
                  "{review.quote}"
                </p>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{review.name}</h4>
                  <p className="text-xs text-slate-400">{review.role}</p>
                  <p className="text-xs text-cyan-400 font-semibold">{review.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Write Review CTA */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-white text-base">Are you a JOY TrueProfile Enterprise Client?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Share your workforce verification turnaround and efficiency experience.</p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-6 py-3 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full shadow transition-all flex items-center gap-2 mx-auto sm:mx-0"
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Write a Client Review</span>
          </button>
        </div>

      </section>

      {/* ==============================================================================
       * 9. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
       * ============================================================================== */}
      <section id="faq" className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 font-outfit">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Everything you need to know about instant labor verification, DPDP compliance, and enterprise deployment.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {faqData.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-900/90 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-extrabold text-sm sm:text-base text-white">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-cyan-950 text-cyan-400' : 'bg-slate-900 text-slate-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ==============================================================================
       * 10. FINAL BOTTOM ENTERPRISE CTA
       * ============================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-950 to-cyan-950 border border-cyan-500/40 p-8 sm:p-16 text-center shadow-[0_0_80px_rgba(6,182,212,0.25)]">
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/90 border border-cyan-800 px-4 py-1.5 rounded-full">
              ENTERPRISE ONBOARDING IN 45 SECONDS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-outfit">
              Ready to Modernize Your Workforce Verification?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Join leading Indian industrial plants, logistics giants, and enterprise employers. Schedule a 15-minute live technical walkthrough tailored to your workforce scale.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-8 py-4 text-base font-extrabold text-white bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600 hover:from-indigo-400 hover:to-cyan-400 rounded-full shadow-[0_0_35px_rgba(99,102,241,0.6)] transition-all flex items-center gap-2 group"
              >
                <span>Book Live Enterprise Demo 🚀</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setShowLegalHandbook(true)}
                className="px-6 py-4 text-sm font-bold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-full transition-all"
              >
                Download Statutory Compliance Handbook
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 11. ULTRA-MODERN CINEMATIC FOOTER
       * ============================================================================== */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 pt-16 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                <ShieldCheck className="w-6 h-6 text-slate-950" />
              </div>
              <span className="font-extrabold text-xl text-white font-outfit">
                JOY <span className="text-cyan-400">TrueProfile</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              JOY CORPORATE SOLUTIONS PVT LTD. India's premier autonomous workforce verification, statutory labor passport, and enterprise background screening infrastructure.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ISO 27001:2022 • SOC-2 Type II • DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Column: Platform */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Platform Suite</h4>
            <a href="#solutions" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">Contract Labor Pass</a>
            <a href="#solutions" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">Moonlighting Radar</a>
            <a href="#solutions" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">WhatsApp 45s Flow</a>
            <a href="#interactive-lab" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">Interactive Simulator</a>
          </div>

          {/* Column: Compliance & Legal */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Compliance & Trust</h4>
            <button onClick={() => setShowLegalHandbook(true)} className="text-xs text-left text-slate-400 hover:text-cyan-400 transition-colors">
              CLRA Form XVI Guide
            </button>
            <button onClick={() => setShowLegalHandbook(true)} className="text-xs text-left text-slate-400 hover:text-cyan-400 transition-colors">
              DPDP Privacy Vault
            </button>
            <button onClick={() => setShowLegalHandbook(true)} className="text-xs text-left text-slate-400 hover:text-cyan-400 transition-colors">
              UIDAI Data Security
            </button>
          </div>

          {/* Column: Corporate Office */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Enterprise Contact</h4>
            <p className="text-xs text-slate-400 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>JOY Corporate Solutions Pvt Ltd, Level 6, Prestige Cyber Towers, Bengaluru, India</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>enterprise@joytrueprofile.com</span>
            </p>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto border-t border-slate-800/80 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} JOY CORPORATE SOLUTIONS PVT LTD. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="text-slate-400">Statutory Compliant • Bank Grade Security</span>
          </div>
        </div>
      </footer>

      {/* ==============================================================================
       * MODAL 1: BOOK LIVE ENTERPRISE DEMO MODAL
       * ============================================================================== */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            {demoSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Demo Request Received!</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Our enterprise solutions architect will contact you within 2 hours to conduct a live technical walkthrough for your workforce scale.
                </p>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400">ENTERPRISE TECHNICAL DEMO</span>
                  <h3 className="text-xl font-bold text-white mt-1">Schedule a Live Technical Walkthrough</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Explore instant gate pass turnstiles and moonlighting detection.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    placeholder="e.g. Anand Mahindra"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Plant</label>
                    <input
                      type="text"
                      required
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      placeholder="e.g. Apex Auto Ltd"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      placeholder="anand@apexauto.in"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Volume</label>
                    <select
                      value={demoForm.hires}
                      onChange={(e) => setDemoForm({ ...demoForm, hires: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="50-200">50 - 200 / month</option>
                      <option value="200-1000">200 - 1,000 / month</option>
                      <option value="1000-5000">1,000 - 5,000 / month</option>
                      <option value="5000+">5,000+ / month</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={demoLoading}
                  className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600 hover:from-indigo-400 hover:to-cyan-400 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {demoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Confirm Demonstration Booking 🚀</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==============================================================================
       * MODAL 2: WRITE A CLIENT REVIEW MODAL
       * ============================================================================== */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-amber-950 border border-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Thank You for Your Review!</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Your feedback has been verified and published to the JOY TrueProfile trust network.
                </p>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-amber-400">ENTERPRISE FEEDBACK</span>
                  <h3 className="text-xl font-bold text-white mt-1">Submit a Verified Client Review</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Share your experience with JOY TrueProfile.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder="e.g. S. Ramaswamy"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Plant</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.company}
                      onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                      placeholder="e.g. Titan Engineering"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Your Designation</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      placeholder="VP - HR & Operations"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-400 transition-colors"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Feedback Review</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="How has JOY TrueProfile improved your workforce turnaround, gate security, or moonlighting detection?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {reviewLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Publish Review ⭐</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==============================================================================
       * MODAL 3: STATUTORY COMPLIANCE HANDBOOK MODAL
       * ============================================================================== */}
      {showLegalHandbook && (
        <LegalComplianceHandbookModal onClose={() => setShowLegalHandbook(false)} />
      )}

      {/* ==============================================================================
       * MODAL 4: RAZORPAY INSTANT WALLET TOPUP MODAL
       * ============================================================================== */}
      {showLandingRazorpayModal && (
        <RazorpayPaymentModal
          amount={landingSelectedAmount}
          onSuccess={() => {
            setShowLandingRazorpayModal(false);
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          }}
          onClose={() => setShowLandingRazorpayModal(false)}
        />
      )}

    </div>
  );
};

export default LandingPageView;
