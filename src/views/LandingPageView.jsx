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
  const [activeSpecCategory, setActiveSpecCategory] = useState('performance');

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

  // Technical Specifications Data (Capricorn Precision Matrix)
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
      accuracy: '99.96%',
      recentEvent: 'Battery plant contractor batch completed with IMPS bank account penny drop validation.',
      topCheck: 'NPCI Bank Account & Police Record Check'
    },
    bhiwandi: {
      name: 'Bhiwandi Logistics & 3PL Cluster',
      state: 'Maharashtra',
      tag: 'National E-Commerce & Warehousing',
      activePasses: '32,100 Delivery Associates',
      avgTat: '1.1 Seconds',
      accuracy: '99.94%',
      recentEvent: '500 Delivery fleet drivers verified via WhatsApp Magic Links in 35 minutes.',
      topCheck: 'MoRTH Commercial DL & Aadhaar OTP'
    },
    manesar: {
      name: 'Manesar-Gurugram Industrial Belt',
      state: 'Haryana',
      tag: 'Manufacturing & Component Plants',
      activePasses: '22,700 Active Turnstile Passes',
      avgTat: '0.7 Seconds',
      accuracy: '99.99%',
      recentEvent: 'Zero ghost worker duplicate match detected and blocked at East Gate Turnstiles.',
      topCheck: 'Facial Biometric Deduplication'
    },
    hosur: {
      name: 'Hosur-Bengaluru Tech & Precision Belt',
      state: 'Karnataka / TN',
      tag: 'EV Manufacturing & Tech Hardware',
      activePasses: '16,300 Shift Passes Issued',
      avgTat: '0.85 Seconds',
      accuracy: '99.97%',
      recentEvent: 'Contractor agency monthly muster roll matched against EPFO UAN contributions.',
      topCheck: 'EPFO UAN Dual Employment Radar'
    }
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
  const costPerManualVerification = 1800;
  const costPerJoyVerification = 250;
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

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambience & Cybernetic Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.15),rgba(99,102,241,0.06),rgba(0,0,0,0))]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:48px_48px]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none"></div>
      </div>

      {/* ==============================================================================
       * 1. TOP NAVIGATION (SEAMLESS STICKY GLASS HEADER)
       * ============================================================================== */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#070b14]/90 border-b border-slate-800/80 px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 font-outfit">
                JOY <span className="text-cyan-400">TrueProfile</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block -mt-0.5">
                AI Labor Verification Engine
              </span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 font-mono text-xs text-slate-300">
            <a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a>
            <a href="#craft" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#specs" className="hover:text-cyan-400 transition-colors">Specifications</a>
            <a href="#interactive-lab" className="hover:text-cyan-400 transition-colors">Simulator</a>
            <a href="#live-radar" className="hover:text-cyan-400 transition-colors">India Radar</a>
            <a href="#roi-calculator" className="hover:text-cyan-400 transition-colors">ROI Calculator</a>
            <a href="#reviews" className="hover:text-cyan-400 transition-colors">Client Reviews</a>
            <a href="#knowledge-hub" className="hover:text-cyan-400 transition-colors">Knowledge Hub</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#interactive-lab"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Try Simulator</span>
            </a>
            
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Book Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-3 font-mono text-xs px-2 pb-2">
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">Solutions</a>
            <a href="#craft" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">Architecture</a>
            <a href="#specs" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">Specifications</a>
            <a href="#interactive-lab" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">Simulator Studio</a>
            <a href="#live-radar" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">India Telemetry Radar</a>
            <a href="#roi-calculator" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">ROI Calculator</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">Reviews</a>
            <a href="#knowledge-hub" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">Knowledge Hub</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-300 hover:text-cyan-400">FAQ</a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); setShowDemoModal(true); }}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-black bg-cyan-400 text-center"
              >
                Book Live Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==============================================================================
       * 2. HERO SECTION: BALANCED 2-COLUMN WITH 3D PERSPECTIVE CARD
       * ============================================================================== */}
      <section className="relative z-10 pt-10 pb-16 lg:pt-16 lg:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 font-mono text-xs mb-6 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-semibold uppercase tracking-wider text-[11px]">LIVE: 520,000+ Verified Across 34 Indian Industrial Hubs</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6 font-outfit">
              Create & Verify <br className="hidden sm:inline" />
              Complete Labor Profiles <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 bg-clip-text text-transparent">
                in Under 45 Seconds
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
              Eliminate ghost workers, contractor moonlighting fraud, and slow paper onboarding. Instantly issue certified digital labor gate passes, conduct real-time statutory audits, and generate tamper-proof dossiers on any smartphone.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Book Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#interactive-lab"
                className="px-5 py-3.5 rounded-xl font-semibold text-sm text-white bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Launch Biometric Lab</span>
              </a>

              <button
                onClick={() => setShowLegalHandbook(true)}
                className="px-4 py-3.5 rounded-xl font-medium text-xs text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Statutory Handbook</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 w-full max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-outfit">0.8s</div>
                <div className="text-xs text-slate-400 mt-0.5">Turnstile Gate Pass</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-outfit">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Zero Ghost Workers</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-outfit">45s</div>
                <div className="text-xs text-slate-400 mt-0.5">WhatsApp KYC TAT</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Perspective Card Stage */}
          <div className="lg:col-span-5 relative">
            <div className="relative max-w-[420px] mx-auto">
              
              {/* Glowing Background Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 rounded-3xl blur-xl opacity-70"></div>
              
              <div
                ref={heroCardRef}
                onMouseMove={handleMouseMoveHero}
                onMouseLeave={handleMouseLeaveHero}
                style={tiltStyle}
                className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/90 shadow-2xl p-2.5 backdrop-blur-xl"
              >
                {/* 3D Smart Card Image */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-950">
                  <img
                    src="/assets/3d/hero_3d_verification.jpg"
                    alt="JOY TrueProfile Digital Labor Identity Card"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Animated Laser Scan Beam */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06B6D4,0_0_30px_#6366F1] animate-laser-vertical pointer-events-none"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700 font-mono text-[9px] uppercase tracking-wider text-white px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3 text-cyan-400" />
                    <span>UIDAI Biometric Verified</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-emerald-950/85 backdrop-blur-md border border-emerald-600/50 font-mono text-[9px] uppercase tracking-wider text-emerald-300 px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>45s TAT</span>
                  </div>
                </div>

                {/* Card Telemetry Footer */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl mt-2 border border-slate-800/80 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-slate-400">Biometric Match: <span className="text-emerald-400 font-bold">99.98%</span></span>
                    <span className="text-cyan-400">ID: #JOY-WM1-9452</span>
                  </div>
                  
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                    <span className="text-slate-400">CRYPTOGRAPHIC CHECKSUM</span>
                    <span className="text-indigo-300">SHA-256 VERIFIED</span>
                  </div>

                  {/* Interactive Biometric Test Button */}
                  <button
                    onClick={triggerHeroBiometricScan}
                    disabled={heroScanning}
                    className="w-full py-2.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-700/60 hover:bg-cyan-900/60 transition-all flex items-center justify-center gap-2 mt-1"
                  >
                    {heroScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        <span>Querying Central Repositories ({heroScanProgress}%)...</span>
                      </>
                    ) : heroScanComplete ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Biometric Clearance Passed ✓ (Retest)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Trigger Live Biometric Scan Test</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 3. INFINITE GOVERNMENT REPOSITORY TICKER
       * ============================================================================== */}
      <section className="relative z-10 py-5 bg-slate-950 border-y border-slate-800 overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee font-mono text-xs text-slate-400 tracking-wider uppercase">
          <span className="flex items-center gap-2 text-cyan-400"><Fingerprint className="w-4 h-4" /> UIDAI DIRECT CRYPTOGRAPHIC CHECKSUM</span>
          <span className="text-slate-600">■</span>
          <span className="flex items-center gap-2 text-emerald-400"><Search className="w-4 h-4" /> EPFO UAN DUAL EMPLOYMENT RADAR</span>
          <span className="text-slate-600">■</span>
          <span className="flex items-center gap-2 text-indigo-400"><Scale className="w-4 h-4" /> HIGH COURT & 3,200+ DISTRICT COURTS E-FILING</span>
          <span className="text-slate-600">■</span>
          <span className="flex items-center gap-2 text-amber-400"><Truck className="w-4 h-4" /> MORTH COMMERCIAL TRANSPORT DRIVING LICENSE</span>
          <span className="text-slate-600">■</span>
          <span className="flex items-center gap-2 text-sky-400"><CreditCard className="w-4 h-4" /> NPCI / IMPS ₹1 PENNY DROP NAME MATCH</span>
          <span className="text-slate-600">■</span>
          <span className="flex items-center gap-2 text-purple-400"><ShieldCheck className="w-4 h-4" /> ISO 27001:2022 & SOC-2 TYPE II CERTIFIED</span>
          <span className="text-slate-600">■</span>
          <span className="flex items-center gap-2 text-cyan-400"><Lock className="w-4 h-4" /> DPDP ACT 2023 CONSENT ARCHITECTURE</span>
        </div>
      </section>

      {/* ==============================================================================
       * 4. ARCHITECTURE & STATUTORY CRAFT SECTION (#craft)
       * ============================================================================== */}
      <section id="craft" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Monospace Category Header */}
          <div className="lg:col-span-4">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 block mb-3">
              PRECISION ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-outfit leading-tight mb-4">
              Statutory Purity Meets Instant Velocity
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              In high-volume manufacturing plants and enterprise corporate screening, compliance is not a checkbox. It is precision engineering—built on direct government repository connectors, biometric deduplication, and cryptographic immutability.
            </p>
            <button
              onClick={() => setShowLegalHandbook(true)}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-3 transition-all"
            >
              <span>Compliance Handbook</span>
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Right Column: Split Dual Cards (Blue-Collar & Corporate BGV) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Factory & Labor Pass */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between gap-6 group hover:border-slate-700 transition-all">
              <div className="rounded-xl overflow-hidden aspect-[16/10] border border-slate-800">
                <img
                  src="/assets/3d/labor_3d_management.jpg"
                  alt="Industrial Labor Gate Pass Station"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 block mb-2">
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
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between gap-6 group hover:border-slate-700 transition-all">
              <div className="rounded-xl overflow-hidden aspect-[16/10] border border-slate-800">
                <img
                  src="/assets/3d/corporate_3d_bgv.jpg"
                  alt="Corporate Executive BGV & UAN Moonlighting"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-400 block mb-2">
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
       * 5. SYSTEM SPECIFICATIONS & PERFORMANCE MATRIX (#specs)
       * ============================================================================== */}
      <section id="specs" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>TECHNICAL SPECIFICATIONS & SLA</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-4">
            Engineering Without Compromise
          </h2>
          <p className="text-slate-400 text-sm">
            Every parameter reflects a singular standard: sub-second velocity, zero ghost worker tolerance, and statutory immutability.
          </p>
        </div>

        {/* Spec Category Segmented Control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs uppercase tracking-wider">
            {[
              { id: 'performance', label: 'Performance' },
              { id: 'security', label: 'Security & DPDP' },
              { id: 'statutory', label: 'Statutory Law' },
              { id: 'infrastructure', label: 'Infrastructure' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSpecCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl transition-all ${
                  activeSpecCategory === cat.id
                    ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specification Parameters Table (Hairline Grid) */}
        <div className="max-w-4xl mx-auto divide-y divide-slate-800/80 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 sm:p-8">
          {technicalSpecs[activeSpecCategory].map((spec, idx) => (
            <div key={idx} className="py-4.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 first:pt-0 last:pb-0">
              <dt className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{spec.label}</span>
              </dt>
              <dd className="text-left sm:text-right">
                <span className="text-base sm:text-lg font-bold text-white font-outfit">
                  {spec.value}
                </span>
                <span className="block font-mono text-[11px] text-slate-400 mt-0.5">
                  {spec.detail}
                </span>
              </dd>
            </div>
          ))}
        </div>

      </section>

      {/* ==============================================================================
       * 6. LIVE INDIA WORKFORCE VERIFICATION RADAR (#live-radar)
       * ============================================================================== */}
      <section id="live-radar" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME NETWORK ACTIVITY</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-3">
            Live India Workforce Verification Radar
          </h2>
          <p className="text-slate-400 text-sm">
            Monitor real-time biometric verifications and gate pass generation streaming across India's largest industrial manufacturing corridors and logistics hubs.
          </p>
        </div>

        {/* Radar Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Left: Industrial Corridor Selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>INDUSTRIAL CORRIDORS</span>
              <span className="text-cyan-400 font-semibold">● 5 HUBS ONLINE</span>
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
                      ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></span>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-white">{hub.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{hub.state} • {hub.tag}</p>
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-1 rounded border border-cyan-800/50">
                    {hub.avgTat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Telemetry Event Stream Display */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider">
                  {radarCities[activeRadarCity].state}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 font-outfit">
                  {radarCities[activeRadarCity].name}
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>TELEMETRY ACTIVE</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Daily Active Passes</span>
                <div className="text-lg font-bold text-white mt-1 font-outfit">
                  {radarCities[activeRadarCity].activePasses.split(' ')[0]} <span className="text-xs font-normal text-slate-400">Active</span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Average Latency</span>
                <div className="text-lg font-bold text-cyan-400 mt-1 font-outfit">
                  {radarCities[activeRadarCity].avgTat}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Accuracy Score</span>
                <div className="text-lg font-bold text-emerald-400 mt-1 font-outfit">
                  {radarCities[activeRadarCity].accuracy}
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span>// LATEST TELEMETRY EVENT STREAM</span>
                <span className="text-emerald-400 text-[9px]">REAL-TIME SYNC</span>
              </span>
              <p className="text-slate-200 leading-relaxed">
                <span className="text-emerald-400 font-bold">[14:15:45 PASS]</span> {radarCities[activeRadarCity].recentEvent}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 7. THE "TRUEPROFILE ENGINE STUDIO" (#interactive-lab)
       * ============================================================================== */}
      <section id="interactive-lab" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE SIMULATOR STUDIO</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-3">
            Experience the Verification Engine Live
          </h2>
          <p className="text-slate-400 text-sm">
            Test and run our sub-second statutory verification modules. Select any profile check below to observe live cryptographic validation, speed latency, and output dossiers.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {Object.keys(simModes).map((key) => {
            const item = simModes[key];
            const Icon = item.icon;
            const isSelected = selectedSimMode === key;
            return (
              <button
                key={key}
                onClick={() => handleRunSimulation(key)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400">
                    {isSelected ? 'ACTIVE' : 'READY'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-outfit">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.category}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Simulation Console */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Top Console Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 block">SIMULATION TARGET</span>
                <h3 className="text-lg font-bold text-white font-outfit">
                  {simModes[selectedSimMode].candidate.name} — <span className="text-cyan-400">{simModes[selectedSimMode].candidate.role}</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJsonPayload(!showJsonPayload)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showJsonPayload ? 'View Visual Checks' : 'Inspect JSON Payload'}</span>
              </button>

              <button
                onClick={() => handleRunSimulation(selectedSimMode)}
                disabled={simulating}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Running...' : 'Re-Run Pipeline'}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar when Simulating */}
          {simulating && (
            <div className="mb-6">
              <div className="flex items-center justify-between font-mono text-xs text-cyan-400 mb-1.5">
                <span>EXECUTING CRYPTOGRAPHIC PIPELINE CHECKS...</span>
                <span>{simProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-100"
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Main Visual or JSON Output */}
          {showJsonPayload ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre>{JSON.stringify(simModes[selectedSimMode].json, null, 2)}</pre>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simModes[selectedSimMode].checks.map((check, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-white">{check.title}</h5>
                      <span className="font-mono text-xs text-emerald-400 block mt-0.5">{check.status}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 shrink-0">
                    {check.time}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

      </section>

      {/* ==============================================================================
       * 8. ROI CALCULATOR & SAVINGS ESTIMATOR (#roi-calculator)
       * ============================================================================== */}
      <section id="roi-calculator" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>ENTERPRISE VALUE ENGINE</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-3">
            Calculate Your Monthly Verification ROI
          </h2>
          <p className="text-slate-400 text-sm">
            Discover how much your enterprise saves by replacing slow manual background verification with instant cryptographic checks.
          </p>
        </div>

        {/* ROI Calculator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          
          {/* Controls Left Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Workforce Type Selector */}
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-slate-400 block mb-3">
                Select Workforce Structure
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'labor', label: 'Factory / Contract Labor' },
                  { id: 'corporate', label: 'Corporate / IT Staff' },
                  { id: 'mixed', label: 'Mixed Workforce' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setWorkforceType(item.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      workforceType === item.id
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Monthly Hires */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Monthly Candidates / Workers Onboarded
                </label>
                <span className="font-mono text-lg font-bold text-cyan-400">
                  {monthlyHires.toLocaleString()} workers / mo
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={monthlyHires}
                onChange={(e) => setMonthlyHires(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-400 mt-2">
                <span>50 / mo</span>
                <span>1,000 / mo</span>
                <span>2,500 / mo</span>
                <span>5,000+ / mo</span>
              </div>
            </div>

            {/* Explanatory Note */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs text-slate-400 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Based on standard Indian enterprise screening averages: ₹1,800/person manual agency BGV vs ₹250/person JOY TrueProfile automated statutory verification.
              </span>
            </div>

          </div>

          {/* Savings Output Right Column */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xl">
            
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 block mb-1">
                ESTIMATED MONTHLY SAVINGS
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white font-outfit tracking-tight">
                ₹{totalMonthlySavings.toLocaleString('en-IN')}
                <span className="text-sm font-normal text-slate-400 ml-2">/ month</span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                (₹{(totalMonthlySavings * 12).toLocaleString('en-IN')} annual net savings)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">HR Admin Hours Saved</span>
                <div className="text-xl font-bold text-cyan-400 font-outfit mt-0.5">
                  {hoursSavedPerMonth.toLocaleString()} hrs / mo
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Ghost Invoices Blocked</span>
                <div className="text-xl font-bold text-fuchsia-400 font-outfit mt-0.5">
                  ~{ghostWorkerPrevented} phantom workers
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Unlock These Savings For Your Plant</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 9. COMPREHENSIVE SOLUTIONS BENTO GRID (#solutions)
       * ============================================================================== */}
      <section id="solutions" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            <span>FULL-STACK VERIFICATION MODULES</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-3">
            Architected for High-Trust Enterprises
          </h2>
          <p className="text-slate-400 text-sm">
            Whether managing thousands of contract plant laborers or screening executive leadership, JOY TrueProfile provides unified, statutory-compliant verification.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: 45-Second WhatsApp Onboarding */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400 mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-outfit mb-2">
                45-Second WhatsApp Flow
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Zero app installs required. Candidates complete Aadhaar OTP, liveness selfie check, and digital consent via a simple, encrypted WhatsApp magic link.
              </p>
            </div>
            <div className="font-mono text-xs text-cyan-400 flex items-center gap-1.5">
              <span>98% Candidate Completion Rate</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Factory Turnstile Gate Passes */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 mb-5">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-outfit mb-2">
                CLRA Form XVI & Gate Passes
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Automated statutory labor register generation. Issues cryptographic QR gate passes that seamlessly integrate with factory turnstile scanners and security tablets.
              </p>
            </div>
            <div className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
              <span>Sub-0.8s Turnstile Gate Response</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: UAN Moonlighting Detection */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/50 flex items-center justify-center text-indigo-400 mb-5">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-outfit mb-2">
                EPFO UAN Dual Employment Radar
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Directly extracts EPFO service history and active monthly contribution streams to detect undeclared secondary employment, overlap tenures, and integrity red flags.
              </p>
            </div>
            <div className="font-mono text-xs text-indigo-400 flex items-center gap-1.5">
              <span>Zero-Tamper EPFO Ledger Audit</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: National e-Courts & Litigation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-fuchsia-950 border border-fuchsia-700/50 flex items-center justify-center text-fuchsia-400 mb-5">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-outfit mb-2">
                3,200+ Courts Litigation Scan
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Comprehensive criminal and civil court records search across Indian District Courts, High Courts, Supreme Court, and national tribunals in real time.
              </p>
            </div>
            <div className="font-mono text-xs text-fuchsia-400 flex items-center gap-1.5">
              <span>Fuzzy Match & Father Name Cross-Check</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Bank Penny Drop & IMPS */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400 mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-outfit mb-2">
                ₹1 IMPS Bank & UPI Verification
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Performs automated ₹1 penny drops to validate bank account active status and authentic account holder name directly with NPCI before wage disbursement.
              </p>
            </div>
            <div className="font-mono text-xs text-amber-400 flex items-center gap-1.5">
              <span>Eliminates Failed Salary Transfers</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Tamper-Proof Cryptographic Dossiers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-700/50 flex items-center justify-center text-sky-400 mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-outfit mb-2">
                Audit-Ready Dossier Reports
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Instantly compiles downloadable PDF audit reports stamped with cryptographic SHA-256 verification hashes, fully compliant with labor inspectorate guidelines.
              </p>
            </div>
            <div className="font-mono text-xs text-sky-400 flex items-center gap-1.5">
              <span>DPDP Act 2023 Masked & Certified</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 10. CLIENT REVIEWS & VERIFIED TESTIMONIALS (#reviews)
       * ============================================================================== */}
      <section id="reviews" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>ENTERPRISE TRUST & PROVEN IMPACT</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-3">
            Trusted by India's Industrial & Corporate Leaders
          </h2>
          <p className="text-slate-400 text-sm">
            Read how manufacturing giants, logistics fleets, and top enterprises transform contractor onboarding and background verification.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {clientReviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40">
                    {rev.badge}
                  </span>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm text-white font-outfit">{rev.name}</h5>
                  <p className="text-xs text-slate-400 mt-0.5">{rev.role}</p>
                  <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{rev.company}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review CTA Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-white text-base font-outfit">Are you an active JOY TrueProfile enterprise partner?</h4>
            <p className="text-slate-400 text-xs mt-0.5">Share your verification turnaround and ghost worker eradication experience with the community.</p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Submit Client Review</span>
          </button>
        </div>

      </section>

      {/* ==============================================================================
       * 11. KNOWLEDGE HUB & COMPLIANCE ARTICLES (#knowledge-hub)
       * ============================================================================== */}
      <section id="knowledge-hub" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>STATUTORY INTELLIGENCE & INSIGHTS</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-3">
            Knowledge Hub & Compliance Guides
          </h2>
          <p className="text-slate-400 text-sm">
            Expert resources on Indian labor laws, DPDP Act 2023 compliance, contractor audit blueprints, and UAN moonlighting detection.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(publicArticles.length > 0 ? publicArticles.slice(0, 3) : fallbackArticles).map((art, idx) => (
            <div
              key={art.id || idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-3">
                  <span className="text-cyan-400 uppercase tracking-wider">{art.category || 'Compliance'}</span>
                  <span>{art.readTime || '4 min read'}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-outfit group-hover:text-cyan-300 transition-colors mb-2.5">
                  {art.title}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                  {art.excerpt || art.summary || 'Essential technical blueprint for enterprise compliance and background verification architecture.'}
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-4 mt-6 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ==============================================================================
       * 12. FREQUENTLY ASKED QUESTIONS (#faq)
       * ============================================================================== */}
      <section id="faq" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-800/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CLARITY & ASSURANCE</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to know about statutory compliance, turnstile integration, and sub-45 second verification.
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="flex flex-col gap-3">
          {faqData.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-white font-outfit flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* ==============================================================================
       * 13. HIGH IMPACT ENTERPRISE CTA & CONVERSION BANNER
       * ============================================================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 p-8 sm:p-14 text-center shadow-2xl">
          
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-6 shadow-inner">
              <Zap className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight mb-4">
              Ready to Secure Your Workforce <br className="hidden sm:inline" />
              in Under 45 Seconds?
            </h2>

            <p className="text-slate-300 text-base max-w-xl mb-8">
              Join leading Indian automotive plants, logistics warehouses, and tech corporations eliminating ghost worker fraud and automating statutory compliance today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-8 py-4 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Book Live Enterprise Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setLandingSelectedAmount(5000);
                  setShowLandingRazorpayModal(true);
                }}
                className="px-7 py-4 rounded-xl font-semibold text-sm text-white bg-slate-900/90 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Instant Verification Checkout</span>
              </button>
            </div>

            {/* Compliance Guarantee Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 font-mono text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> 100% DPDP Act 2023 Compliant</span>
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-emerald-400" /> Automated CLRA Form XVI</span>
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-indigo-400" /> 256-Bit AES Cryptography</span>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 14. FOOTER
       * ============================================================================== */}
      <footer className="relative z-10 py-12 bg-slate-950 border-t border-slate-800/80 px-4 sm:px-8 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white font-outfit text-sm">JOY TrueProfile</span>
              <p className="text-[10px] text-slate-400">AI Labor Management & Verification Engine</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a>
            <a href="#craft" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#specs" className="hover:text-cyan-400 transition-colors">Specifications</a>
            <a href="#interactive-lab" className="hover:text-cyan-400 transition-colors">Simulator</a>
            <a href="#live-radar" className="hover:text-cyan-400 transition-colors">India Radar</a>
            <a href="#roi-calculator" className="hover:text-cyan-400 transition-colors">ROI Calculator</a>
            <a href="#reviews" className="hover:text-cyan-400 transition-colors">Reviews</a>
            <a href="#knowledge-hub" className="hover:text-cyan-400 transition-colors">Knowledge Hub</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
          </div>

          <div className="text-right text-[10px] text-slate-400">
            <div>© {new Date().getFullYear()} JOY Corporate Solutions Pvt Ltd.</div>
            <div className="mt-0.5">All Rights Reserved. DPDP Act 2023 Compliant.</div>
          </div>

        </div>
      </footer>

      {/* ==============================================================================
       * 15. MODALS & OVERLAYS
       * ============================================================================== */}

      {/* Enterprise Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-outfit mb-2">Demo Request Received!</h3>
                <p className="text-slate-300 text-sm max-w-sm mb-6">
                  Our enterprise solutions team will contact you within 15 minutes to schedule your live walkthrough and configure test verification credits.
                </p>
                <button
                  onClick={() => { setDemoSubmitted(false); setShowDemoModal(false); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-black bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>ENTERPRISE WALKTHROUGH</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-outfit mb-2">
                  Schedule a Custom Live Demo
                </h3>
                <p className="text-slate-400 text-xs mb-6">
                  Experience sub-second verification configured specifically for your plant turnstiles or corporate BGV pipeline.
                </p>

                <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-300 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      placeholder="e.g. Anand Mahindra"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        placeholder="anand@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Company / Plant Name *</label>
                    <input
                      type="text"
                      required
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      placeholder="e.g. Apex Auto Manufacturing Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Monthly Hires / Passes</label>
                      <select
                        value={demoForm.hires}
                        onChange={(e) => setDemoForm({ ...demoForm, hires: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="50-200">50 - 200 / month</option>
                        <option value="200-1000">200 - 1,000 / month</option>
                        <option value="1000-5000">1,000 - 5,000 / month</option>
                        <option value="5000+">5,000+ / month</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Workforce Focus</label>
                      <select
                        value={demoForm.workforceType}
                        onChange={(e) => setDemoForm({ ...demoForm, workforceType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="both">Both Factory & Corporate</option>
                        <option value="labor">Factory & Contract Labor</option>
                        <option value="corporate">Corporate / IT Staff</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={demoLoading}
                    className="w-full mt-3 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {demoLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Demo Booking</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Client Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-outfit mb-2">Review Submitted!</h3>
                <p className="text-slate-300 text-sm max-w-sm mb-6">
                  Thank you for your feedback. Your verified client review will be published to the community wall upon moderation.
                </p>
                <button
                  onClick={() => { setReviewSubmitted(false); setShowReviewModal(false); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-black bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>CLIENT COMMUNITY WALL</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-outfit mb-2">
                  Submit Verified Enterprise Review
                </h3>
                <p className="text-slate-400 text-xs mb-6">
                  Share your experience with JOY TrueProfile turnaround velocity, Form XVI compliance, and ghost worker prevention.
                </p>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="e.g. Priya Iyer"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Designation / Role *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.role}
                        onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                        placeholder="e.g. Head of HR"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Company / Plant Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.company}
                        onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                        placeholder="e.g. Nexus 3PL Corp"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Rating (1 to 5 Stars)</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value={3}>⭐⭐⭐ (3 - Good)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Your Review / Impact Story *</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Describe how JOY TrueProfile accelerated your turnaround time or eliminated ghost worker fraud..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full mt-2 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {reviewLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Review...</span>
                      </>
                    ) : (
                      <>
                        <span>Publish Review</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statutory Compliance Handbook Modal */}
      {showLegalHandbook && (
        <LegalComplianceHandbookModal onClose={() => setShowLegalHandbook(false)} />
      )}

      {/* Razorpay Instant Checkout Modal */}
      {showLandingRazorpayModal && (
        <RazorpayPaymentModal
          amount={landingSelectedAmount}
          onClose={() => setShowLandingRazorpayModal(false)}
          onSuccess={() => {
            setShowLandingRazorpayModal(false);
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          }}
        />
      )}

    </div>
  );
};

export default LandingPageView;
