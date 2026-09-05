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
  Download,
  ArrowUpRight
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

  // Interactive Spec Customizer Tab State (Capricorn Zagato Style)
  const [activeSpecCategory, setActiveSpecCategory] = useState('performance'); // 'performance', 'security', 'statutory', 'infrastructure'

  // Interactive Live India Radar State
  const [activeRadarCity, setActiveRadarCity] = useState('sriperumbudur');

  // ROI Calculator State
  const [monthlyHires, setMonthlyHires] = useState(500);
  const [workforceType, setWorkforceType] = useState('mixed');

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
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeaveHero = () => {
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
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
    }, 70);
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
    }, 100);
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
      name: 'Sriperumbudur Industrial Corridor',
      state: 'Tamil Nadu',
      tag: 'Automotive & Heavy Manufacturing Hub',
      activePasses: '14,820 Passes Streamed',
      avgTat: '0.8 Seconds',
      accuracy: '99.98%',
      recentEvent: '120 Assembly Line Technicians verified with CLRA Form XVI Passes in 1.2 min batch.',
      topCheck: 'UIDAI Biometric & Form XVI Generation'
    },
    sanand: {
      name: 'Sanand Industrial Mega Zone',
      state: 'Gujarat',
      tag: 'EV, Auto & Precision Engineering',
      activePasses: '18,450 Workers Monitored',
      avgTat: '0.9 Seconds',
      accuracy: '100%',
      recentEvent: '0 dual-employment flags detected across 4 contractor rosters.',
      topCheck: 'UAN / EPFO Moonlighting Radar'
    },
    bhiwandi: {
      name: 'Bhiwandi Logistics Hub',
      state: 'Maharashtra',
      tag: 'National E-Commerce & Fleet 3PL',
      activePasses: '32,100 Delivery Fleets Active',
      avgTat: '1.1 Seconds',
      accuracy: '99.95%',
      recentEvent: 'MoRTH commercial driver license verified with 0 court litigation flags.',
      topCheck: 'MoRTH Commercial Transport Check'
    },
    manesar: {
      name: 'Manesar-Gurugram Belt',
      state: 'Haryana',
      tag: 'Tier-1 Auto Component Plants',
      activePasses: '22,600 Daily Gate Scans',
      avgTat: '0.7 Seconds',
      accuracy: '99.99%',
      recentEvent: 'Instant QR turnstile gate access operating at 0.7s per worker.',
      topCheck: 'Biometric Deduplication Shield'
    },
    hosur: {
      name: 'Hosur-Bengaluru Corridor',
      state: 'Karnataka / TN',
      tag: 'EV Hardware & Tech Manufacturing',
      activePasses: '16,900 Profiles Certified',
      avgTat: '0.85 Seconds',
      accuracy: '99.97%',
      recentEvent: 'WhatsApp magic link 45-second candidate onboarding active plant-wide.',
      topCheck: 'WhatsApp 45s Mobile KYC'
    }
  };

  // Technical Specifications Data (Capricorn Zagato Style)
  const technicalSpecs = {
    performance: [
      { label: 'Turnstile Gate TAT', value: '0.8 Seconds', detail: 'Sub-second QR pass verification' },
      { label: 'Biometric Deduplication', value: '99.98% Match', detail: 'Zero ghost worker tolerance' },
      { label: 'WhatsApp KYC Velocity', value: 'Under 45 Seconds', detail: 'Full candidate mobile completion' },
      { label: 'Concurrent Throughput', value: '50,000+ Req/Min', detail: 'Distributed microservices engine' },
      { label: 'System Uptime SLA', value: '99.99%', detail: 'Multi-region high availability' }
    ],
    security: [
      { label: 'Data Encryption', value: '256-Bit AES-GCM', detail: 'End-to-end cryptographic protection' },
      { label: 'Privacy Statutory Law', value: 'DPDP Act 2023', detail: 'Consent-driven tokenized vault' },
      { label: 'Global Compliance', value: 'ISO 27001 & SOC-2', detail: 'Independently audited infrastructure' },
      { label: 'Aadhaar Redaction', value: 'Masked UIDAI Compliant', detail: 'Automated 8-digit masking' },
      { label: 'Audit Log Immutability', value: 'Cryptographic Hash', detail: 'SHA-256 tamper-proof ledger' }
    ],
    statutory: [
      { label: 'Contract Labor Act', value: 'CLRA Form XVI Ready', detail: 'Automated statutory gate pass' },
      { label: 'Muster Roll Records', value: 'CLRA Form XIII', detail: 'Digital muster roll compliance' },
      { label: 'Provident Fund Audit', value: 'EPFO UAN Dual Scan', detail: 'Active contribution timeline check' },
      { label: 'Direct Tax Verification', value: 'ITD Form 26AS', detail: 'Income stream validation' },
      { label: 'Court Record Scope', value: '3,200+ Courts', detail: 'High Courts & District Courts' }
    ],
    infrastructure: [
      { label: 'Architecture', value: 'Event-Driven Microservices', detail: 'Ultra-low latency edge network' },
      { label: 'Repository Connectors', value: 'Direct Govt & Banking APIs', detail: 'UIDAI, EPFO, NSDL, MoRTH, NPCI' },
      { label: 'Candidate Interface', value: 'Zero-Install Web App', detail: 'Runs on any mobile browser' },
      { label: 'Turnstile Integration', value: 'REST API & Webhooks', detail: 'Compatible with all RFID/QR turnstiles' },
      { label: 'Dossier Output', value: 'Cryptographic PDF & JSON', detail: 'Downloadable certified audit record' }
    ]
  };

  // Interactive Simulator Simulation Modes Data
  const simModes = {
    labor_pass: {
      id: 'labor_pass',
      title: 'Factory & Contract Labor Pass',
      category: 'Manufacturing & Industrial',
      icon: HardHat,
      candidate: { name: 'Karan Sharma', role: 'Assembly Line Specialist', contractor: 'Apex Manpower Services' },
      checks: [
        { title: 'UIDAI Aadhaar Checksum & Address', status: 'Authenticated ✓', time: '0.7s' },
        { title: 'Ghost Worker Biometric Deduplication', status: '0 Duplicate Flags ✓', time: '0.4s' },
        { title: 'CLRA Form XVI Statutory Pass', status: 'Token #7821 Issued ✓', time: '0.6s' },
        { title: 'Bank IMPS Penny Drop Account Match', status: 'SBI Active Match 100% ✓', time: '1.1s' }
      ],
      json: {
        status: 'VERIFIED_ACTIVE',
        verificationId: 'JOY-LBR-994208',
        timestamp: '2026-09-05T14:15:20Z',
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
      title: 'UAN / EPFO Moonlighting Radar',
      category: 'Corporate & Executive',
      icon: Search,
      candidate: { name: 'Pooja Narang', role: 'Senior Software Engineer', contractor: 'Direct Enterprise Hire' },
      checks: [
        { title: 'EPFO Service History Extraction', status: '4 Company Records Retrieved ✓', time: '1.2s' },
        { title: 'Contribution Overlap Audit', status: '0 Active Overlaps (Clean) ✓', time: '0.8s' },
        { title: 'Relieving Date & Exit Reason Check', status: 'Official Clean Exit ✓', time: '0.9s' },
        { title: 'ITD Form 26AS TDS Cross-Check', status: 'Single Salary Stream ✓', time: '1.4s' }
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
      title: 'Executive BGV & National Court Scan',
      category: 'High-Trust Roles',
      icon: Scale,
      candidate: { name: 'Vikramaditya Sengupta', role: 'VP Operations & Supply Chain', contractor: 'Leadership Executive' },
      checks: [
        { title: 'National e-Courts Criminal Record Scan', status: '0 Adverse Litigation Flags ✓', time: '1.8s' },
        { title: 'High Court Commercial Dispute DB', status: 'Clean Record (No Defaults) ✓', time: '1.5s' },
        { title: 'Direct University Marksheet Verification', status: 'IIT Delhi Authenticated ✓', time: '1.9s' },
        { title: 'MCA Director Disqualification (DIN)', status: 'Active Clean DIN ✓', time: '1.1s' }
      ],
      json: {
        status: 'LEADERSHIP_CLEARANCE_ISSUED',
        verificationId: 'JOY-EXEC-331094',
        criminal_litigation_records: 0,
        commercial_defaults: 0,
        educational_integrity: 'AUTHENTICATED_DIRECT'
      }
    },
    whatsapp_kyc: {
      id: 'whatsapp_kyc',
      title: '45-Second WhatsApp Magic Link',
      category: 'Zero-Drop Mobile Flow',
      icon: Smartphone,
      candidate: { name: 'Rahul Deshmukh', role: 'Logistics Fleet Driver', contractor: 'Direct WhatsApp Flow' },
      checks: [
        { title: 'Encrypted WhatsApp Link Dispatch', status: 'Green Tick API Delivered ✓', time: '0.3s' },
        { title: 'Digital Aadhaar OTP Consent Capture', status: 'Completed in 22s ✓', time: '0.6s' },
        { title: 'Camera Liveness & Geo-Location', status: 'Selfie Matched 99.4% ✓', time: '1.2s' },
        { title: 'Instant Audit Dossier PDF Generation', status: 'Dossier Auto-Compiled ✓', time: '0.8s' }
      ],
      json: {
        status: 'ONBOARDING_COMPLETED',
        session_id: 'WA-MSG-77491',
        candidate_tat_seconds: 41,
        otp_verified: true,
        geo_fence_location: '19.0760N, 72.8777E'
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
      stars: 5,
      quote: 'JOY TrueProfile completely eradicated ghost worker invoicing across our 12 contractor agencies. We now onboard and verify 350+ factory workers daily in under 45 seconds per person with automated Form XVI gate passes.',
      badge: 'Automotive Manufacturing'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Chief Compliance & Legal Officer',
      company: 'Nexus 3PL & Supply Chain Logistics',
      stars: 5,
      quote: 'Verifying commercial driving licenses and court litigation history for 2,000+ pan-India fleet drivers used to take 10 business days. With JOY TrueProfile, our drivers are verified instantly via WhatsApp magic links on the spot.',
      badge: 'Logistics & 3PL'
    },
    {
      name: 'Vikram Malhotra',
      role: 'Head of Talent Acquisition & Background Screening',
      company: 'Zenith Global Technologies',
      stars: 5,
      quote: 'The UAN moonlighting detection radar caught 14 undeclared dual-employment cases in our senior engineering hiring stream last quarter. The audit dossiers are tamper-proof and fully DPDP Act 2023 compliant.',
      badge: 'Enterprise IT'
    },
    {
      name: 'Capt. Suresh Nambiar',
      role: 'Director of Plant Security & HSE',
      company: 'Apex Heavy Infrastructure & EPC Ltd',
      stars: 5,
      quote: 'Our project sites have zero tolerance for unverified labor. JOY TrueProfile generates instant QR gate passes that our security guards scan at the gate turnstiles. Real-time, fast, and rock solid.',
      badge: 'EPC & Infrastructure'
    }
  ];

  // FAQ Data
  const faqData = [
    {
      q: 'How does JOY TrueProfile achieve complete verification in under 45 seconds?',
      a: 'JOY TrueProfile queries authoritative government and financial repositories (UIDAI, NSDL, EPFO, MoRTH, e-Courts, NPCI) in parallel using high-speed REST microservices. Instead of slow manual paper processing, cryptographic verification occurs in milliseconds.'
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
    <div className="min-h-screen bg-[#05070e] text-slate-100 font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      
      {/* BACKGROUND AMBIENT GLOW MESH & TECH GRID (CAPRICORN ZAGATO PRECISION CANVAS) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-cyan-500/10 to-transparent blur-[160px] rounded-full"></div>
        <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[70%] -right-32 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-tech-grid-dark opacity-30"></div>
      </div>

      {/* ==============================================================================
       * 1. HAUTE COUTURE FLOATING PILL HEADER (CAPRICORN ZAGATO MONOSPACE AESTHETIC)
       * ============================================================================== */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto max-w-6xl w-full mx-auto backdrop-blur-2xl bg-slate-950/85 border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300">
          
          {/* Brand Logo with Haute Monospace Typography */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-mono font-black text-xs shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              JT
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold tracking-zagato text-white uppercase">
                JOY <span className="text-slate-400">TrueProfile</span>
              </span>
              <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-widest text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full bg-cyan-950/40">
                AI Engine
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links with Capricorn Monospace Tracking */}
          <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] uppercase tracking-zagato text-slate-300">
            <a href="#specs" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
              Specifications
            </a>
            <a href="#craft" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
              Engineering
            </a>
            <a href="#interactive-lab" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
              Simulator
            </a>
            <a href="#live-radar" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
              Radar
            </a>
            <a href="#roi-calculator" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
              ROI
            </a>
            <a href="#reviews" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-full transition-all">
              Reviews
            </a>
          </div>

          {/* Haute Couture Action Button (Zero Login URLs) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setShowDemoModal(true)}
              className="btn-zagato-luxury rounded-full px-5 py-2 font-mono text-xs uppercase tracking-zagato flex items-center gap-3"
            >
              <span>Get in Touch</span>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-3xl pt-24 px-6 flex flex-col gap-4 animate-fadeIn lg:hidden font-mono uppercase text-xs tracking-zagato">
          <a href="#specs" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 border-b border-slate-800 py-3">
            Specifications
          </a>
          <a href="#craft" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 border-b border-slate-800 py-3">
            Engineering Craft
          </a>
          <a href="#interactive-lab" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 border-b border-slate-800 py-3">
            Live Simulator
          </a>
          <a href="#live-radar" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 border-b border-slate-800 py-3">
            Workforce Radar
          </a>
          <a href="#roi-calculator" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 border-b border-slate-800 py-3">
            ROI Calculator
          </a>
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => { setMobileMenuOpen(false); setShowDemoModal(true); }}
              className="w-full py-3.5 text-center font-mono font-bold text-black bg-white rounded-full uppercase tracking-zagato"
            >
              Get in Touch →
            </button>
          </div>
        </div>
      )}

      {/* ==============================================================================
       * 2. HERO SECTION: "THE ESSENTIAL MACHINE" AESTHETIC (CAPRICORN ZAGATO STYLE)
       * ============================================================================== */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-44 lg:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          
          {/* Monospace Super-Header */}
          <div className="font-mono text-xs sm:text-sm uppercase tracking-zagato-wide text-slate-400 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Every Millisecond Refined into Trust</span>
          </div>

          {/* Huge Sculptural Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-8 font-outfit">
            The Essential Workforce <br className="hidden sm:inline" />
            Verification Engine
          </h1>

          {/* Editorial Subtext */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
            Eliminate ghost workers, contractor moonlighting, and manual paper onboarding. Instantly create certified digital labor passports, execute multi-repository audits, and issue tamper-proof gate passes in under 45 seconds.
          </p>

          {/* Haute Couture CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowDemoModal(true)}
              className="btn-zagato-luxury rounded-full px-8 py-4 font-mono text-xs sm:text-sm uppercase tracking-zagato flex items-center gap-4 group"
            >
              <span>Schedule Enterprise Walkthrough</span>
              <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-black transition-colors"></div>
            </button>

            <a
              href="#interactive-lab"
              className="px-7 py-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-zagato transition-all flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Launch Simulator</span>
            </a>
          </div>

        </div>

        {/* 3D SCULPTURAL HERO STAGE WITH PARALLAX TILT */}
        <div className="relative max-w-4xl mx-auto">
          <div
            ref={heroCardRef}
            onMouseMove={handleMouseMoveHero}
            onMouseLeave={handleMouseLeaveHero}
            style={tiltStyle}
            className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-slate-900/90 to-slate-950 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
          >
            {/* 3D Visual Asset */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-950">
              <img
                src="/assets/3d/hero_3d_verification.jpg"
                alt="JOY TrueProfile Precision Biometric ID Smart Card"
                className="w-full h-full object-cover"
              />
              
              {/* Dynamic Laser Beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06B6D4,0_0_30px_#6366F1] animate-laser-vertical pointer-events-none"></div>

              {/* Monospace Floating Top Badges */}
              <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/15 font-mono text-[10px] uppercase tracking-zagato text-white px-3 py-1.5 rounded-full flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                <span>UIDAI Repository Checksum Active</span>
              </div>

              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/15 font-mono text-[10px] uppercase tracking-zagato text-emerald-400 px-3 py-1.5 rounded-full flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                <span>45s TAT</span>
              </div>
            </div>

            {/* Interactive Telemetry Bar Beneath 3D Render */}
            <div className="p-4 sm:p-6 bg-slate-950/90 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-zagato text-slate-400 block mb-1">
                  BIOMETRIC & DEDUPLICATION VERDICT
                </span>
                <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>99.98% Cryptographic Match — 0 Duplicate Flags</span>
                </div>
              </div>

              <button
                onClick={triggerHeroBiometricScan}
                disabled={heroScanning}
                className="btn-zagato-luxury rounded-full px-5 py-2 font-mono text-xs uppercase tracking-zagato flex items-center gap-3"
              >
                {heroScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Querying ({heroScanProgress}%)...</span>
                  </>
                ) : heroScanComplete ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-emerald-200">Authenticated ✓ (Retest)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Trigger Live Biometric Test</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ==============================================================================
       * 3. SCULPTURAL NUMBERS TELEMETRY (CAPRICORN ZAGATO 900+ HP STYLE)
       * ============================================================================== */}
      <section className="relative z-10 py-16 bg-slate-950 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            {/* Stat 1: Turnaround Time */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-7xl font-black text-white font-outfit tracking-tight">0.8</span>
                <span className="font-mono text-xs sm:text-sm uppercase text-slate-400 tracking-zagato">SEC</span>
              </div>
              <p className="font-mono text-xs uppercase tracking-zagato text-slate-400">Turnstile Gate Pass TAT</p>
            </div>

            {/* Stat 2: Accuracy */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-7xl font-black text-white font-outfit tracking-tight">99.98</span>
                <span className="font-mono text-xs sm:text-sm uppercase text-slate-400 tracking-zagato">%</span>
              </div>
              <p className="font-mono text-xs uppercase tracking-zagato text-slate-400">Biometric Accuracy</p>
            </div>

            {/* Stat 3: Ghost Worker Tolerance */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-7xl font-black text-white font-outfit tracking-tight">0</span>
                <span className="font-mono text-xs sm:text-sm uppercase text-slate-400 tracking-zagato">%</span>
              </div>
              <p className="font-mono text-xs uppercase tracking-zagato text-slate-400">Ghost Worker Tolerance</p>
            </div>

            {/* Stat 4: Total Verified */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-7xl font-black text-white font-outfit tracking-tight">520</span>
                <span className="font-mono text-xs sm:text-sm uppercase text-slate-400 tracking-zagato">K+</span>
              </div>
              <p className="font-mono text-xs uppercase tracking-zagato text-slate-400">Verified Profiles Streamed</p>
            </div>

          </div>
        </div>
      </section>

      {/* ==============================================================================
       * 4. THE PERFECT UNION: CRAFT & STATUTORY AUTHORITY (ZAGATO STORYTELLING)
       * ============================================================================== */}
      <section id="craft" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Monospace Category Header */}
          <div className="lg:col-span-4">
            <span className="font-mono text-xs uppercase tracking-zagato-wide text-slate-400 block mb-3">
              THE PERFECT UNION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-outfit leading-tight mb-4">
              Statutory Purity Meets Instant Velocity
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              In the world of high-volume industrial manufacturing and corporate screening, compliance is not a checkbox. It is precision engineering—built on direct government repository connectors and cryptographic immutability.
            </p>
            <button
              onClick={() => setShowLegalHandbook(true)}
              className="btn-zagato-luxury rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-zagato flex items-center gap-3"
            >
              <span>Compliance Handbook</span>
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Right Column: Split Dual Cards (Blue-Collar & Corporate BGV) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Factory & Labor Pass */}
            <div className="rounded-3xl border border-white/12 bg-slate-950/80 p-6 flex flex-col justify-between gap-6 group hover:border-white/25 transition-all">
              <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-white/10">
                <img
                  src="/assets/3d/labor_3d_management.jpg"
                  alt="Industrial Labor Gate Pass Station"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-zagato text-emerald-400 block mb-2">
                  BLUE-COLLAR & CONTRACT LABOR
                </span>
                <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                  Industrial Worker Gate Passes & Form XVI
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Eliminate ghost worker invoicing and phantom contractors. Generate tamper-proof digital QR gate passes linked to UIDAI biometric verification and daily wage IMPS penny drops.
                </p>
              </div>
            </div>

            {/* Card 2: Executive BGV & Moonlighting */}
            <div className="rounded-3xl border border-white/12 bg-slate-950/80 p-6 flex flex-col justify-between gap-6 group hover:border-white/25 transition-all">
              <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-white/10">
                <img
                  src="/assets/3d/corporate_3d_bgv.jpg"
                  alt="Corporate Executive BGV & UAN Moonlighting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-zagato text-indigo-400 block mb-2">
                  CORPORATE & EXECUTIVE SCREENING
                </span>
                <h3 className="text-xl font-bold text-white mb-2 font-outfit">
                  UAN Moonlighting Radar & Dual-Job Detection
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Scan active EPFO contribution timelines to detect undeclared secondary employment, overlapping tenures, and integrity flags before rolling out offers.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 5. SYSTEM SPECIFICATIONS & PERFORMANCE MATRIX (CAPRICORN ZAGATO TECH SPECS)
       * ============================================================================== */}
      <section id="specs" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-zagato-wide text-slate-400 mb-3">
            TECHNICAL SPECIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            Engineering Without Compromise
          </h2>
          <p className="text-slate-400 text-sm">
            Every parameter reflects a singular vision: sub-second velocity, statutory compliance, and zero ghost worker tolerance.
          </p>
        </div>

        {/* Spec Category Segmented Control */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-full bg-slate-900 border border-white/10 font-mono text-xs uppercase tracking-zagato">
            {[
              { id: 'performance', label: 'Performance' },
              { id: 'security', label: 'Security & DPDP' },
              { id: 'statutory', label: 'Statutory Law' },
              { id: 'infrastructure', label: 'Infrastructure' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSpecCategory(cat.id)}
                className={`px-5 py-2 rounded-full transition-all ${
                  activeSpecCategory === cat.id
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specification Parameters Table (Hairline Grid) */}
        <div className="max-w-4xl mx-auto divide-y divide-white/10">
          {technicalSpecs[activeSpecCategory].map((spec, idx) => (
            <div key={idx} className="py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <dt className="font-mono text-xs uppercase tracking-zagato text-slate-400">
                {spec.label}
              </dt>
              <dd className="text-right">
                <span className="text-base sm:text-lg font-bold text-white font-outfit">
                  {spec.value}
                </span>
                <span className="block font-mono text-[10px] text-slate-400 mt-0.5">
                  {spec.detail}
                </span>
              </dd>
            </div>
          ))}
        </div>

      </section>

      {/* ==============================================================================
       * 6. INTERACTIVE LIVE INDIA WORKFORCE RADAR (TELEMETRY STREAM)
       * ============================================================================== */}
      <section id="live-radar" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-zagato-wide text-cyan-400 mb-3 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME NETWORK TELEMETRY</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            Live India Workforce Verification Radar
          </h2>
          <p className="text-slate-400 text-sm">
            Monitor real-time biometric verifications and gate pass generation streaming across India's largest industrial manufacturing corridors and logistics hubs.
          </p>
        </div>

        {/* Radar Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Left: Industrial Corridor Selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="font-mono text-[10px] uppercase tracking-zagato text-slate-400 mb-2 flex items-center justify-between">
              <span>INDUSTRIAL CORRIDORS</span>
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
                      ? 'bg-white/10 border-white text-white shadow-lg'
                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></span>
                      <h4 className="font-mono text-xs uppercase tracking-zagato font-bold text-white">{hub.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{hub.state} • {hub.tag}</p>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/40">
                    {hub.avgTat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Telemetry Event Stream Display */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-zagato">
                  {radarCities[activeRadarCity].state}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 font-outfit">
                  {radarCities[activeRadarCity].name}
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase tracking-zagato">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>TELEMETRY ACTIVE</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-white/10 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-zagato text-slate-400">Daily Passes</span>
                <div className="text-lg font-bold text-white mt-1 font-outfit">
                  {radarCities[activeRadarCity].activePasses}
                </div>
              </div>

              <div className="bg-slate-950 border border-white/10 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-zagato text-slate-400">Avg TAT</span>
                <div className="text-lg font-bold text-cyan-400 mt-1 font-outfit">
                  {radarCities[activeRadarCity].avgTat}
                </div>
              </div>

              <div className="bg-slate-950 border border-white/10 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-zagato text-slate-400">Accuracy</span>
                <div className="text-lg font-bold text-emerald-400 mt-1 font-outfit">
                  {radarCities[activeRadarCity].accuracy}
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-slate-950 border border-white/10 rounded-xl p-4 font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase tracking-zagato block mb-2">
                // LATEST REPOSITORY TELEMETRY LOG
              </span>
              <p className="text-slate-200 leading-relaxed">
                <span className="text-emerald-400 font-bold">[14:15:22 PASS]</span> {radarCities[activeRadarCity].recentEvent}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 7. THE "TRUEPROFILE ENGINE STUDIO" (INTERACTIVE SIMULATOR)
       * ============================================================================== */}
      <section id="interactive-lab" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-zagato-wide text-slate-400 mb-3">
            INTERACTIVE SIMULATION LAB
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            Test the Verification Engine
          </h2>
          <p className="text-slate-400 text-sm">
            Experience sub-second verification across blue-collar turnstiles, moonlighting detection, and leadership background screening.
          </p>
        </div>

        {/* Mode Selector */}
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
                    ? 'bg-white/10 border-white text-white shadow-lg'
                    : 'bg-slate-950 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <IconComponent className="w-5 h-5 text-cyan-400" />
                  {isSelected && (
                    <span className="font-mono text-[9px] uppercase tracking-zagato text-cyan-400">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-zagato font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.category}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Simulator Screen */}
        <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <div className="font-mono text-xs text-slate-400">
              SIMULATION CONSOLE // <span className="text-white font-bold">{currentSim.id.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJsonPayload(!showJsonPayload)}
                className="font-mono text-[11px] uppercase tracking-zagato text-slate-400 hover:text-white bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg"
              >
                {showJsonPayload ? 'Hide JSON' : 'Inspect JSON Payload'}
              </button>

              <button
                onClick={() => handleRunSimulation(selectedSimMode)}
                disabled={simulating}
                className="btn-zagato-luxury rounded-lg px-4 py-1.5 font-mono text-xs uppercase tracking-zagato flex items-center gap-2"
              >
                <RefreshCw className={`w-3 h-3 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Executing...' : 'Re-Run Test'}</span>
              </button>
            </div>
          </div>

          {/* Test Candidate Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-900/60 border border-white/10 p-4 rounded-xl font-mono text-xs">
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-zagato">CANDIDATE</span>
              <div className="font-bold text-white text-sm mt-0.5">{currentSim.candidate.name}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-zagato">ROLE</span>
              <div className="text-slate-200 mt-0.5">{currentSim.candidate.role}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-zagato">SOURCE</span>
              <div className="text-cyan-400 mt-0.5">{currentSim.candidate.contractor}</div>
            </div>
          </div>

          {/* Step Execution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {currentSim.checks.map((check, index) => (
              <div
                key={index}
                className="bg-slate-900/40 border border-white/10 p-4 rounded-xl flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">{check.title}</h5>
                    <p className="font-mono text-xs text-emerald-400 mt-0.5">{check.status}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-400">{check.time}</span>
              </div>
            ))}
          </div>

          {/* JSON Payload Drawer */}
          {showJsonPayload && (
            <div className="bg-black border border-white/10 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto mb-6">
              <pre>{JSON.stringify(currentSim.json, null, 2)}</pre>
            </div>
          )}

          {/* Verdict Bar */}
          <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-zagato text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>100% Cryptographic Verification Passed</span>
            </span>

            <button
              onClick={() => setShowDemoModal(true)}
              className="btn-zagato-luxury rounded-full px-6 py-2.5 font-mono text-xs uppercase tracking-zagato"
            >
              Deploy This Flow →
            </button>
          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 8. DYNAMIC ROI & SAVINGS CALCULATOR (CAPRICORN ZAGATO METRICS)
       * ============================================================================== */}
      <section id="roi-calculator" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-zagato-wide text-slate-400 mb-3">
            FINANCIAL IMPACT & CAPACITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            Calculate Enterprise Savings
          </h2>
          <p className="text-slate-400 text-sm">
            Quantify direct agency fee savings, ghost worker prevention, and administrative time compression.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-slate-950 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Sliders */}
            <div className="lg:col-span-6 flex flex-col gap-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-mono text-xs uppercase tracking-zagato text-slate-300">Monthly Hires / Entrants</label>
                  <span className="text-2xl font-black text-white font-outfit">
                    {monthlyHires.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={monthlyHires}
                  onChange={(e) => setMonthlyHires(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-500 mt-2 uppercase">
                  <span>50 hires</span>
                  <span>2,500</span>
                  <span>5,000+ hires</span>
                </div>
              </div>

              {/* Comparison Matrix */}
              <div className="border border-white/10 rounded-2xl p-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-r border-white/10 pr-4">
                    <span className="text-slate-400 block mb-1">TRADITIONAL BGV</span>
                    <p className="text-red-400 font-bold">7-10 Days Turnaround</p>
                    <p className="text-red-400">₹1,800 Cost / Person</p>
                  </div>
                  <div className="pl-2">
                    <span className="text-white block mb-1">JOY TRUEPROFILE</span>
                    <p className="text-emerald-400 font-bold">0.8s - 45s Turnaround</p>
                    <p className="text-emerald-400">₹250 Direct Cost</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Projected Savings */}
            <div className="lg:col-span-6 bg-slate-900/80 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-zagato text-slate-400">PROJECTED MONTHLY SAVINGS</span>
                <div className="text-4xl sm:text-5xl font-black text-white mt-1 font-outfit">
                  ₹{totalMonthlySavings.toLocaleString()}
                  <span className="font-mono text-xs font-normal text-slate-400 ml-2">/ month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-white/10 p-4 rounded-xl">
                  <span className="font-mono text-[10px] uppercase tracking-zagato text-slate-400">Admin Hours Saved</span>
                  <div className="text-xl font-bold text-white mt-1 font-outfit">
                    {hoursSavedPerMonth.toLocaleString()} hrs
                  </div>
                </div>
                <div className="border border-white/10 p-4 rounded-xl">
                  <span className="font-mono text-[10px] uppercase tracking-zagato text-slate-400">Ghost Workers Blocked</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1 font-outfit">
                    ~{ghostWorkerPrevented} workers
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full py-4 text-xs font-mono font-bold uppercase tracking-zagato text-black bg-white hover:bg-slate-200 rounded-xl transition-all"
              >
                Claim These Savings →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ==============================================================================
       * 9. VERIFIED REVIEWS & TESTIMONIALS
       * ============================================================================== */}
      <section id="reviews" className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-zagato-wide text-slate-400 mb-3">
            CLIENT TRUST & TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            Validated by Enterprise Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {clientReviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-white/10 p-6 sm:p-8 rounded-3xl flex flex-col justify-between gap-6"
            >
              <div>
                <span className="font-mono text-[10px] uppercase tracking-zagato text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-full inline-block mb-3">
                  {review.badge}
                </span>
                <p className="text-slate-300 text-sm sm:text-base italic leading-relaxed">
                  "{review.quote}"
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="font-bold text-sm text-white font-outfit">{review.name}</h4>
                <p className="text-xs text-slate-400">{review.role}</p>
                <p className="font-mono text-xs text-cyan-400 mt-0.5">{review.company}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-sm font-outfit">Are you an Enterprise Client?</h4>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">Submit your verification throughput review.</p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="btn-zagato-luxury rounded-full px-5 py-2 font-mono text-xs uppercase tracking-zagato"
          >
            Submit Review ⭐
          </button>
        </div>
      </section>

      {/* ==============================================================================
       * 10. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
       * ============================================================================== */}
      <section id="faq" className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-zagato-wide text-slate-400 mb-3 block">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqData.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all ${
                  isOpen ? 'bg-slate-900 border-white/30' : 'bg-slate-950 border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-sm sm:text-base text-white">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-slate-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==============================================================================
       * 11. FINAL GET IN TOUCH CTA (ZAGATO LUXURY)
       * ============================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-16 text-center">
          <span className="font-mono text-xs uppercase tracking-zagato-wide text-slate-400 mb-4 block">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit mb-6">
            Experience Autonomous Verification
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto mb-8">
            Schedule a 15-minute technical demonstration tailored to your plant, logistics fleet, or corporate hiring volume.
          </p>
          <button
            onClick={() => setShowDemoModal(true)}
            className="btn-zagato-luxury rounded-full px-8 py-4 font-mono text-xs sm:text-sm uppercase tracking-zagato inline-flex items-center gap-4"
          >
            <span>Schedule Walkthrough</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ==============================================================================
       * 12. HAUTE COUTURE FOOTER
       * ============================================================================== */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950 pt-16 pb-12 px-4 sm:px-6 font-mono text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          <div className="md:col-span-5 flex flex-col gap-4">
            <span className="text-sm font-bold tracking-zagato text-white uppercase">
              JOY TrueProfile
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-sm">
              JOY CORPORATE SOLUTIONS PVT LTD. Autonomous workforce verification, statutory labor passport, and enterprise background screening infrastructure.
            </p>
            <p className="text-slate-500 text-[10px]">
              ISO 27001:2022 • SOC-2 Type II • DPDP Act 2023 Compliant
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col gap-2 uppercase tracking-zagato text-slate-400 text-[11px]">
            <span className="text-white font-bold mb-2">Platform</span>
            <a href="#specs" className="hover:text-white">Specifications</a>
            <a href="#interactive-lab" className="hover:text-white">Simulator Studio</a>
            <a href="#live-radar" className="hover:text-white">Workforce Radar</a>
            <a href="#roi-calculator" className="hover:text-white">ROI Calculator</a>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2 text-slate-400 text-[11px]">
            <span className="text-white font-bold uppercase tracking-zagato mb-2">Corporate Office</span>
            <p>Level 6, Prestige Cyber Towers, Bengaluru, India</p>
            <p className="text-white">enterprise@joytrueprofile.com</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex justify-between text-slate-500 text-[10px] uppercase tracking-zagato">
          <span>© {new Date().getFullYear()} JOY CORPORATE SOLUTIONS PVT LTD.</span>
          <span>Precision Engineering & Statutory Purity</span>
        </div>
      </footer>

      {/* ==============================================================================
       * MODALS
       * ============================================================================== */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative font-mono">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            {demoSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-outfit">Request Received</h3>
                <p className="text-slate-300 text-xs mb-6 font-sans">
                  Our enterprise solutions architect will contact you within 2 hours.
                </p>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="px-6 py-2.5 text-xs font-bold text-black bg-white rounded-xl uppercase tracking-zagato"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-zagato text-slate-400">ENTERPRISE INQUIRY</span>
                  <h3 className="text-lg font-bold text-white font-outfit mt-1">Get in Touch</h3>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">FULL NAME</label>
                  <input
                    type="text"
                    required
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    placeholder="e.g. Anand Mahindra"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">COMPANY</label>
                    <input
                      type="text"
                      required
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      placeholder="Apex Auto Ltd"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">EMAIL</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      placeholder="anand@apex.in"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">PHONE</label>
                    <input
                      type="tel"
                      required
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">VOLUME</label>
                    <select
                      value={demoForm.hires}
                      onChange={(e) => setDemoForm({ ...demoForm, hires: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-white focus:outline-none"
                    >
                      <option value="50-200">50 - 200 / mo</option>
                      <option value="200-1000">200 - 1,000 / mo</option>
                      <option value="1000+">1,000+ / mo</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={demoLoading}
                  className="w-full py-3.5 text-xs font-bold uppercase tracking-zagato text-black bg-white hover:bg-slate-200 rounded-xl mt-2"
                >
                  {demoLoading ? 'Submitting...' : 'Confirm Demonstration Request →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-mono">
          <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-xs">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 font-outfit">Review Published</h3>
                <p className="text-slate-300 text-xs mb-6 font-sans">
                  Thank you for sharing your experience.
                </p>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-6 py-2.5 text-xs font-bold text-black bg-white rounded-xl uppercase tracking-zagato"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white font-outfit">Submit Enterprise Review</h3>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Company & Role"
                  value={reviewForm.company}
                  onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="Your feedback review..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white resize-none"
                />
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full py-3 font-bold uppercase tracking-zagato text-black bg-white rounded-xl"
                >
                  {reviewLoading ? 'Publishing...' : 'Publish Review ⭐'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {showLegalHandbook && (
        <LegalComplianceHandbookModal onClose={() => setShowLegalHandbook(false)} />
      )}

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
