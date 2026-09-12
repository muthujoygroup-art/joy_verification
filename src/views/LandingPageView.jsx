import React, { useState, useEffect } from 'react';
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
  Zap, 
  Check,
  FileCheck,
  Scale, 
  CreditCard, 
  HelpCircle, 
  ChevronDown,
  Layers,
  Eye,
  X,
  Menu,
  Star,
  HardHat,
  Fingerprint,
  MessageSquare,
  BookOpen,
  Activity,
  Radio,
  Cpu,
  RefreshCw,
  Search,
  Sliders,
  DollarSign,
  Download,
  Volume2,
  VolumeX
} from 'lucide-react';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
import VideoLoopBackground from '../components/VideoLoopBackground';
import HeroInteractiveCard3D from '../components/landing/HeroInteractiveCard3D';
import VerificationCommandOrbit from '../components/landing/VerificationCommandOrbit';
import DualEmploymentRadarVisualizer from '../components/landing/DualEmploymentRadarVisualizer';
import TurnstileGateSimulator from '../components/landing/TurnstileGateSimulator';
import InteractiveProcessPipeline from '../components/landing/InteractiveProcessPipeline';
import InteractiveSpeedComparison from '../components/landing/InteractiveSpeedComparison';
import LandingPagePreloader from '../components/landing/LandingPagePreloader';
import WhatsAppConcierge3D from '../components/landing/WhatsAppConcierge3D';
import { soundEngine } from '../utils/uiSoundEffects';
import { checkNetworkBeforeAction } from '../utils/networkChecker';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const LandingPageView = () => {
  const { platformLogoEmblem } = useApp() || {};
  // Innovative First-Load / Reload Logo Preloader (Plays full cinematic sequence on every page reload)
  const [showPreloader, setShowPreloader] = useState(true);

  // Navigation & Interactive Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showLandingRazorpayModal, setShowLandingRazorpayModal] = useState(false);
  const [landingSelectedAmount, setLandingSelectedAmount] = useState(5000);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundEngine.isMuted());

  const handleToggleSound = () => {
    const nextMute = soundEngine.toggleMute();
    setSoundMuted(nextMute);
    if (!nextMute) {
      soundEngine.playSuccess();
    }
  };

  // Interactive Spec Customizer Tab State (Capricorn Zagato Style)
  const [activeSpecCategory, setActiveSpecCategory] = useState('performance');

  // Interactive Live India Radar State
  const [activeRadarCity, setActiveRadarCity] = useState('sriperumbudur');

  // ROI Calculator State
  const [monthlyHires, setMonthlyHires] = useState(500);
  const [workforceType, setWorkforceType] = useState('mixed');
  const [contractorTurnover, setContractorTurnover] = useState(25); // 25% annual churn

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

  // Technical Specifications Data (Enterprise Standards & Reliability)
  const technicalSpecs = {
    performance: [
      { label: 'Verification Speed', value: 'Under 60 Seconds', detail: 'Instant automated checks across all databases' },
      { label: 'Photo & Identity Match', value: '100% Genuine Match', detail: 'Eliminates duplicate, fake, or fraudulent profiles' },
      { label: 'Candidate Experience', value: 'Under 2 Minutes', detail: 'Mobile-friendly link with zero app downloads' },
      { label: 'System Capacity', value: '50,000+ Checks / Day', detail: 'Built to effortlessly handle high-volume hiring' },
      { label: 'Service Reliability', value: '99.99% Uptime', detail: 'Always-available cloud platform with round-the-clock monitoring' }
    ],
    security: [
      { label: 'Data Encryption', value: 'Bank-Grade 256-Bit AES', detail: 'Encrypted at all times during transit and storage' },
      { label: 'Privacy Law Compliance', value: '100% DPDP Act Compliant', detail: 'Explicit OTP candidate consent and automated data masking' },
      { label: 'Industry Certifications', value: 'ISO 27001 & SOC-2', detail: 'Independently audited enterprise cloud infrastructure' },
      { label: 'Data Masking', value: 'Automatic Redaction', detail: 'Masks sensitive numbers like Aadhaar for complete privacy' },
      { label: 'Certified Reports', value: 'Tamper-Proof PDF', detail: 'Official certified dossiers with verification badge' }
    ],
    statutory: [
      { label: 'Workforce Gate Passes', value: 'Digital Scannable QR', detail: 'Instant digital employee badges for security gates' },
      { label: 'Audit Trail Records', value: 'Always Audit-Ready', detail: 'Permanent, verifiable compliance log for statutory audits' },
      { label: 'Employment History', value: 'Full Career Timeline', detail: 'Past company tenures and relieving dates confirmed' },
      { label: 'Bank Account Match', value: 'Instant ₹1 Verification', detail: 'Validates beneficiary name directly with recipient bank' },
      { label: 'Court Record Scope', value: 'Pan-India Databases', detail: 'Covers civil, criminal, and commercial tribunals' }
    ],
    infrastructure: [
      { label: 'Cloud Architecture', value: 'Modern Cloud Native', detail: 'High-speed distributed servers across India' },
      { label: 'Official Connectors', value: 'Official Registry Connectors', detail: 'Direct validation with official government and banking rails' },
      { label: 'Candidate Experience', value: 'Zero-App Web Link', detail: 'Runs instantly on WhatsApp, SMS, or any mobile browser' },
      { label: 'HR System Integration', value: 'Seamless Integrations', detail: 'Works with your existing HRMS, ATS, or turnstile gates' },
      { label: 'Report Delivery', value: 'Instant PDF & Dashboard', detail: 'Downloadable certified audit record with 1 click' }
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
      recentEvent: '120 Assembly Line Technicians verified with digital access passes in 1.2 min batch.',
      topCheck: 'Identity & Facial Biometric Match'
    },
    sanand: {
      name: 'Sanand Industrial Mega Zone',
      state: 'Gujarat',
      tag: 'EV, Auto & Precision Engineering',
      activePasses: '18,450 Workers Monitored',
      avgTat: '0.9 Seconds',
      accuracy: '99.96%',
      recentEvent: 'Battery plant contractor batch completed with bank account name drop validation.',
      topCheck: 'Direct Bank & Integrity Check'
    },
    bhiwandi: {
      name: 'Bhiwandi Logistics & 3PL Cluster',
      state: 'Maharashtra',
      tag: 'National E-Commerce & Warehousing',
      activePasses: '32,100 Delivery Associates',
      avgTat: '1.1 Seconds',
      accuracy: '99.94%',
      recentEvent: '500 Delivery fleet drivers verified via Mobile Magic Links in 35 minutes.',
      topCheck: 'Commercial License & Digital ID'
    },
    manesar: {
      name: 'Manesar-Gurugram Industrial Belt',
      state: 'Haryana',
      tag: 'Manufacturing & Component Plants',
      activePasses: '22,700 Active Turnstile Passes',
      avgTat: '0.7 Seconds',
      accuracy: '99.99%',
      recentEvent: 'Zero duplicate profile match detected and blocked at East Gate Turnstiles.',
      topCheck: 'Facial Biometric Deduplication'
    },
    hosur: {
      name: 'Hosur-Bengaluru Tech & Precision Belt',
      state: 'Karnataka / TN',
      tag: 'EV Manufacturing & Tech Hardware',
      activePasses: '16,300 Shift Passes Issued',
      avgTat: '0.85 Seconds',
      accuracy: '99.97%',
      recentEvent: 'Contractor agency monthly records matched against verified employment history.',
      topCheck: 'Dual Employment & Moonlighting Radar'
    },
    chakan: {
      name: 'Chakan-Talegaon Industrial Hub',
      state: 'Maharashtra',
      tag: 'Automotive & Heavy Engineering',
      activePasses: '24,600 Active Badges',
      avgTat: '0.75 Seconds',
      accuracy: '99.98%',
      recentEvent: 'Major Tier-1 auto plant completed workforce compliance audit across 850 workers.',
      topCheck: 'Digital Identity + Legal Clearance'
    }
  };

  // Interactive Simulator Simulation Modes Data
  const simModes = {
    labor_pass: {
      id: 'labor_pass',
      title: 'Workforce & Plant Staff Profile',
      category: 'Manufacturing & Industrial',
      icon: HardHat,
      candidate: { name: 'Karan Sharma', role: 'Assembly Line Specialist', contractor: 'Apex Manpower Services' },
      checks: [
        { title: 'Digital ID Checksum & Address Match', status: 'Authenticated ✓', time: '0.7s' },
        { title: 'Facial Biometric Deduplication', status: '0 Duplicate Flags ✓', time: '0.4s' },
        { title: 'Workforce Digital Gate Clearance', status: 'Token #7821 Issued ✓', time: '0.6s' },
        { title: 'Bank Account & Name Match', status: 'SBI Active Match 100% ✓', time: '1.1s' }
      ],
      json: {
        status: 'VERIFIED_ACTIVE',
        verificationId: 'JOY-EMP-994208',
        timestamp: '2026-09-05T14:15:20Z',
        latency_ms: 780,
        biometric_score: 99.8,
        statutory_gate_pass: {
          workforce_pass_status: 'COMPLIANT_ACTIVE',
          qr_token: 'QR_PASS_88492',
          contractor_license_valid: true
        }
      }
    },
    dual_employment: {
      id: 'dual_employment',
      title: 'Career History & Moonlighting Radar',
      category: 'Corporate & Executive',
      icon: Search,
      candidate: { name: 'Pooja Narang', role: 'Senior Software Engineer', contractor: 'Direct Enterprise Hire' },
      checks: [
        { title: 'Employment History & Tenure Extraction', status: '4 Company Records Retrieved ✓', time: '1.2s' },
        { title: 'Active Contribution Overlap Audit', status: '0 Active Overlaps (Clean) ✓', time: '0.8s' },
        { title: 'Relieving Date & Experience Check', status: 'Official Clean Exit ✓', time: '0.9s' },
        { title: 'Income & Tax Record Match', status: 'Single Salary Stream ✓', time: '1.4s' }
      ],
      json: {
        status: 'CLEAN_VERIFIED',
        verificationId: 'JOY-EXP-551902',
        identifier_masked: '1004XXXX7729',
        overlapping_employments_detected: 0,
        service_history_count: 4,
        moonlighting_risk_score: 'LOW (0.01%)'
      }
    },
    court_bgv: {
      id: 'court_bgv',
      title: 'Executive Integrity & Public Records Scan',
      category: 'High-Trust Roles',
      icon: Scale,
      candidate: { name: 'Vikramaditya Sengupta', role: 'VP Operations & Supply Chain', contractor: 'Leadership Executive' },
      checks: [
        { title: 'National Judicial Litigation Scan', status: '0 Adverse Litigation Flags ✓', time: '1.8s' },
        { title: 'Commercial Dispute & Default Check', status: 'Clean Record (No Defaults) ✓', time: '1.5s' },
        { title: 'Academic Degree & Credential Check', status: 'IIT Delhi Authenticated ✓', time: '1.9s' },
        { title: 'Directorship & Corporate Disqualification Check', status: 'Active Clean Status ✓', time: '1.1s' }
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
      title: 'Seamless Mobile Self-Verification',
      category: 'Zero-Drop Mobile Flow',
      icon: Smartphone,
      candidate: { name: 'Rahul Deshmukh', role: 'Logistics Fleet Driver', contractor: 'Direct Mobile Flow' },
      checks: [
        { title: 'Encrypted Magic Link Dispatch', status: 'API Delivered via WhatsApp/SMS ✓', time: '0.3s' },
        { title: 'Candidate OTP Consent Capture', status: 'Verified in 22s ✓', time: '0.6s' },
        { title: 'Camera Liveness & Geo-Location', status: 'Selfie Matched 99.4% ✓', time: '1.2s' },
        { title: 'Audit Dossier PDF Generation', status: 'Dossier Auto-Compiled ✓', time: '0.8s' }
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
      q: 'How does JOY TRUE PROFILE achieve fast and comprehensive employee background verification?',
      a: 'JOY TRUE PROFILE automatically checks candidate identity, past employment history, public court records, and direct bank details in parallel. Instead of slow manual calls and days of paperwork, verifications are completed in under 60 seconds.'
    },
    {
      q: 'How does the platform eliminate duplicate worker profiles and fraudulent entries?',
      a: 'Applicant pools and staffing rosters can often contain duplicate identities or phantom entries. JOY TRUE PROFILE performs biometric photo matching and digital ID verification to ensure every profile is an authentic, real individual before access is granted.'
    },
    {
      q: 'How is candidate privacy protected under the Digital Personal Data Protection (DPDP) Act 2023?',
      a: 'All verifications are 100% consent-driven. Candidates grant explicit OTP-based consent. Data in transit and at rest is secured with 256-bit AES encryption, and automated data masking ensures sensitive numbers are protected.'
    },
    {
      q: 'Can JOY TRUE PROFILE issue digital compliance passes and audit-ready reports?',
      a: 'Yes. Upon successful verification, the engine automatically compiles certified audit reports, compliance certificates, and digital QR gate passes that can be printed or scanned with any phone camera.'
    },
    {
      q: 'Do candidates need to install any mobile app to complete verification?',
      a: 'No app download is required. Candidates receive a secure magic link via WhatsApp or SMS. They simply open the link in any mobile browser, verify with an OTP, capture a quick selfie, and complete the check in under 2 minutes.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-amber-500 selection:text-white relative overflow-x-hidden">
      
      {/* Innovative First-Load / Reload Holographic Logo Preloader */}
      {showPreloader && (
        <LandingPagePreloader onFinish={() => setShowPreloader(false)} />
      )}

      {/* Executive High-Performance Looping Video Background & Frosted Ambient Veil */}
      <VideoLoopBackground />

      {/* ==============================================================================
       * 1. TOP NAVIGATION: SLEEK EXECUTIVE ENTERPRISE NAVBAR
       * ============================================================================== */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo - Single Line, Clean, Balanced */}
          <a href="#" className="flex items-center gap-3 shrink-0 group">
            <div className="relative shrink-0">
              <img 
                src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                alt="JOY TRUE PROFILE Logo" 
                className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <div className="flex items-center gap-1.5 whitespace-nowrap leading-none">
                <span className="text-lg sm:text-xl font-black text-slate-950 font-outfit tracking-tight">JOY</span>
                <span className="text-lg sm:text-xl font-black text-[#047857] font-outfit tracking-tight" style={{ color: '#047857' }}>TRUE PROFILE</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 font-bold whitespace-nowrap mt-1">
                Zero-Trust Verification
              </span>
            </div>
          </a>

          {/* Center Navigation Links - Spacious, Single Line, No Cramping */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans text-xs font-bold text-slate-700">
            <a 
              href="#features" 
              className="whitespace-nowrap hover:text-[#047857] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] hover:after:w-full after:transition-all"
            >
              Features
            </a>
            <a 
              href="#moonlighting-radar" 
              className="whitespace-nowrap hover:text-[#047857] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] hover:after:w-full after:transition-all"
            >
              Moonlighting Radar
            </a>
            <a 
              href="#turnstile-access" 
              className="whitespace-nowrap hover:text-[#047857] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] hover:after:w-full after:transition-all"
            >
              Turnstile Gate
            </a>
            <a 
              href="#comparison" 
              className="whitespace-nowrap hover:text-[#047857] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] hover:after:w-full after:transition-all"
            >
              Speed Matrix
            </a>
            <a 
              href="#roi-calculator" 
              className="whitespace-nowrap hover:text-[#047857] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#047857] hover:after:w-full after:transition-all"
            >
              ROI Calculator
            </a>
            
            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                className="whitespace-nowrap hover:text-[#047857] transition-colors flex items-center gap-1.5 cursor-pointer py-1 font-bold"
              >
                <span>Resources</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {resourcesDropdownOpen && (
                <div 
                  className="absolute left-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 font-sans animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setResourcesDropdownOpen(false)}
                >
                  <a href="#craft" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Architecture</span>
                  </a>
                  <a href="#specs" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Specifications</span>
                  </a>
                  <a href="#live-radar" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    <span>India Radar</span>
                  </a>
                  <a href="#reviews" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Client Reviews</span>
                  </a>
                  <a href="#knowledge-hub" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Knowledge Hub</span>
                  </a>
                  <a href="#faq" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>FAQ</span>
                  </a>

                  <div className="pt-2 mt-1 border-t border-slate-100 flex flex-col gap-1">
                    <button
                      onClick={() => { setResourcesDropdownOpen(false); setShowPreloader(true); }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 text-left cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Replay Intro Animation</span>
                    </button>
                    <button
                      onClick={handleToggleSound}
                      className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 text-left cursor-pointer"
                    >
                      {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{soundMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            
            {/* Book Live Demo Primary Button */}
            <button
              onClick={() => setShowDemoModal(true)}
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black text-white hover:bg-[#065f46] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer border-2 border-[#065f46]"
            >
              <span style={{ color: '#ffffff' }}>Book Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-2xs cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 px-4 py-4 bg-white shadow-xl flex flex-col gap-2 font-sans text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-slate-800 hover:text-[#047857] hover:bg-emerald-50 font-bold">Verification Modules</a>
            <a href="#moonlighting-radar" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-slate-800 hover:text-[#047857] hover:bg-emerald-50 font-bold">Moonlighting Radar</a>
            <a href="#turnstile-access" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-slate-800 hover:text-[#047857] hover:bg-emerald-50 font-bold">Turnstile Simulator</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-slate-800 hover:text-[#047857] hover:bg-emerald-50 font-bold">How It Works</a>
            <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-slate-800 hover:text-[#047857] hover:bg-emerald-50 font-bold">Comparison Matrix</a>
            <a href="#roi-calculator" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-slate-800 hover:text-[#047857] hover:bg-emerald-50 font-bold">ROI Calculator</a>
            
            <div className="pt-3 mt-1 border-t border-slate-200 flex flex-col gap-2">
              <a
                href="/login?role=hrexecutive"
                className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 text-center border border-slate-200"
              >
                Portals & Login
              </a>
              <button
                onClick={() => { setMobileMenuOpen(false); setShowDemoModal(true); }}
                style={{ backgroundColor: '#047857', color: '#ffffff' }}
                className="w-full py-2.5 rounded-xl font-black text-xs text-white hover:bg-[#065f46] text-center shadow-md border-2 border-[#065f46]"
              >
                <span style={{ color: '#ffffff' }}>Book Live Demo</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==============================================================================
       * 2. HERO SECTION: VERIFIED EMPLOYEE PASS SHOWCASE
       * ============================================================================== */}
      <section className="relative z-10 pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Trust Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6 shadow-xs border border-emerald-500/30 text-slate-800 font-bold text-xs bg-white/90 backdrop-blur-md hover:border-emerald-500/60 transition-all cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0" />
              <span className="font-bold font-mono uppercase tracking-wider text-[11px] text-slate-900">
                INDIA'S FIRST ZERO-TRUST WORKFORCE VERIFICATION PLATFORM
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
                500K+ CHECKS
              </span>
            </div>

            {/* Main Marketing Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] mb-5 font-outfit">
              Zero-Trust Workforce Verification. <br className="hidden sm:inline" />
              <span className="text-[#047857] font-black" style={{ color: '#047857' }}>
                In 45 Seconds Flat.
              </span>
            </h1>

            {/* Clear, High-Impact Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed mb-8 font-medium">
              Eliminate fake resumes, ghost workers, dual-employment moonlighting, and statutory penalties. Automated parallel screening across Aadhaar, PAN, EPFO, Court records, and Bank rails — without manual delays or paperwork.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10 w-full sm:w-auto">
              <button
                onClick={() => setShowDemoModal(true)}
                style={{ backgroundColor: '#047857', color: '#ffffff' }}
                className="group relative px-8 py-4 rounded-2xl font-black text-sm text-white shadow-xl shadow-emerald-950/25 hover:shadow-2xl hover:bg-[#065f46] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer border-2 border-[#065f46]"
              >
                <span className="tracking-wide text-white font-black text-base" style={{ color: '#ffffff' }}>Book a Free Live Demo</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#features"
                className="bg-white border-2 border-slate-300 hover:border-emerald-600 px-6 py-4 rounded-2xl font-bold text-sm text-slate-900 hover:text-[#047857] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#047857]" />
                <span>See All Features</span>
              </a>
            </div>

            {/* Key Value Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-6 border-t border-slate-200/80 w-full max-w-2xl">
              <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl hover-jump-subtle transition-all border border-slate-200 shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-700 font-outfit">&lt;45s</div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-bold mt-0.5">Verification TAT</div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl hover-jump-subtle transition-all border border-slate-200 shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-slate-950 font-outfit">99.98%</div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-bold mt-0.5">Precision Rate</div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl hover-jump-subtle transition-all border border-slate-200 shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-teal-700 font-outfit">100%</div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-bold mt-0.5">DPDP 2023 Compliant</div>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl hover-jump-subtle transition-all border border-slate-200 shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-amber-700 font-outfit">80%</div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-bold mt-0.5">Cost Reduction</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Holographic Employee ID Passport Centerpiece */}
          <div className="lg:col-span-5 flex justify-center">
            <HeroInteractiveCard3D />
          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 3. STATUTORY COMPLIANCE & VERIFIED RAILS TICKER
       * ============================================================================== */}
      <section className="relative z-10 py-4 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-2xl dark-glass-card border border-slate-200/90 py-3 px-2 overflow-hidden shadow-sm backdrop-blur-xl [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <div className="flex items-center gap-6 whitespace-nowrap animate-marquee text-xs text-slate-700 tracking-wider uppercase font-bold">
            {[...Array(2)].map((_, loopIdx) => (
              <React.Fragment key={loopIdx}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ISO 27001 CERTIFIED CLOUD
                </span>
                <span className="text-emerald-500">✦</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  <Lock className="w-3.5 h-3.5 text-teal-600" /> DPDP ACT 2023 STATUTORY CONSENT
                </span>
                <span className="text-emerald-500">✦</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-600" /> UIDAI & AADHAAR ECOSYSTEM INTEGRATED
                </span>
                <span className="text-emerald-500">✦</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-amber-600" /> EPFO UAN REAL-TIME PASSBOOK RADAR
                </span>
                <span className="text-emerald-500">✦</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  <Scale className="w-3.5 h-3.5 text-indigo-600" /> PAN-INDIA DISTRICT & HIGH COURT REPOSITORIES
                </span>
                <span className="text-emerald-500">✦</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> NPCI & IMPS DIRECT BANK ACCOUNT RAILS
                </span>
                <span className="text-emerald-500">✦</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================================================
       * 4. VERIFICATION MODULES SHOWCASE (#features)
       * ============================================================================== */}
      <section id="features" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="dark-glass-pill text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 shadow-2xs bg-amber-50/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>ALL-IN-ONE SCREENING SUITE</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit mb-4 tracking-tight">
            Everything You Need to <br className="hidden sm:inline" />
            <span className="text-gradient-electric">
              Hire with Total Confidence
            </span>
          </h2>
          <p className="text-slate-600 text-base max-w-2xl leading-relaxed font-normal">
            Explore our core background screening checks designed to protect your company, speed up onboarding, and eliminate hiring fraud.
          </p>
        </div>

        {/* Verification Command Orbit Component */}
        <VerificationCommandOrbit />
      </section>

      {/* ==============================================================================
       * 5. DUAL-EMPLOYMENT & MOONLIGHTING RADAR VISUALIZER (#moonlighting-radar)
       * ============================================================================== */}
      <section id="moonlighting-radar" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <DualEmploymentRadarVisualizer />
      </section>

      {/* ==============================================================================
       * 6. WORKFORCE DIGITAL TURNSTILE GATE SIMULATOR (#turnstile-access)
       * ============================================================================== */}
      <section id="turnstile-access" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <TurnstileGateSimulator />
      </section>

      {/* ==============================================================================
       * 7. KINETIC PROCESS PIPELINE (#how-it-works)
       * ============================================================================== */}
      <section id="how-it-works" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <InteractiveProcessPipeline />
      </section>

      {/* ==============================================================================
       * 8. TRADITIONAL 15-DAY AGENCY VS JOY TRUEPROFILE COMPARISON (#comparison)
       * ============================================================================== */}
      <section id="comparison" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <InteractiveSpeedComparison />
      </section>

      {/* ==============================================================================
       * 9. ARCHITECTURE & SECURITY CRAFT SECTION (#craft)
       * ============================================================================== */}
      <section id="craft" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Monospace Category Header */}
          <div className="lg:col-span-4">
            <span className="dark-glass-pill font-mono text-xs uppercase tracking-wider text-amber-800 font-bold inline-block mb-3 px-3 py-1 rounded-full border border-amber-300/80 bg-amber-50/60">
              ENTERPRISE ARCHITECTURE & VAULT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-outfit leading-tight mb-4">
              Enterprise Trust Meets High-Speed Accuracy
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
              Whether verifying executive leadership, corporate IT specialists, logistics drivers, or plant workers, JOY TrueProfile provides unified, cryptographic verification built on automated enterprise connectors.
            </p>
            <button
              onClick={() => setShowLegalHandbook(true)}
              className="dark-glass-card px-5 py-3 rounded-xl text-slate-800 font-mono text-xs uppercase tracking-wider flex items-center gap-3 shadow-md hover-jump-subtle transition-all font-bold cursor-pointer border border-slate-200 hover:border-amber-300 hover:text-amber-800"
            >
              <span>Compliance Handbook</span>
              <FileText className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>

          {/* Right Column: Split Dual Cards with Light Glass & 3D Assets */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Enterprise Cryptographic Shield & Security Vault */}
            <div className="dark-glass-card rounded-3xl p-6 flex flex-col justify-between gap-6 hover-jump shadow-xl border border-slate-200 group">
              <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-slate-200 bg-slate-100 shadow-inner relative">
                <img
                  src="/assets/3d/corporate_shield_vault_3d.jpg"
                  alt="Enterprise Cryptographic Security Vault"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 font-mono text-[9px] uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>0.9s Sub-Second Sync</span>
                </div>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 font-bold block mb-2">
                  CRYPTOGRAPHIC ARCHITECTURE
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-outfit">
                  Enterprise Security Vault
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Military-grade 256-bit AES encryption, immutable audit trails, and automatic Aadhaar / PAN redaction built into every check.
                </p>
              </div>
            </div>

            {/* Card 2: DPDP Act 2023 Statutory Compliance Seal */}
            <div className="dark-glass-card rounded-3xl p-6 flex flex-col justify-between gap-6 hover-jump shadow-xl border border-slate-200 group">
              <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-slate-200 bg-slate-100 shadow-inner relative">
                <img
                  src="/assets/3d/security_3d_shield.jpg"
                  alt="DPDP Act 2023 Statutory Compliance Seal"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-emerald-300 font-mono text-[9px] uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5 shadow-md">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>100% DPDP Act 2023</span>
                </div>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-orange-700 font-bold block mb-2">
                  DATA PRIVACY & STATUTORY ASSURANCE
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-outfit">
                  DPDP Act 2023 Certified Shield
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Explicit OTP-driven candidate consent architecture, immutable logging, and ISO 27001 audited cloud infrastructure.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 5. SYSTEM SPECIFICATIONS & PERFORMANCE MATRIX (#specs)
       * ============================================================================== */}
      <section id="specs" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="dark-glass-pill text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/60">
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            <span>ENTERPRISE STANDARDS & RELIABILITY</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit mb-4">
            Enterprise-Grade Reliability & Security
          </h2>
          <p className="text-slate-600 text-sm font-normal">
            Built for organizations that cannot afford to compromise on hiring safety, data privacy, or candidate turnaround time.
          </p>
        </div>

        {/* Spec Category Segmented Control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl dark-glass-card border border-slate-200 font-mono text-xs uppercase tracking-wider">
            {[
              { id: 'performance', label: 'Performance' },
              { id: 'security', label: 'Security & DPDP' },
              { id: 'statutory', label: 'Statutory Law' },
              { id: 'infrastructure', label: 'Infrastructure' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSpecCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl transition-all font-bold cursor-pointer ${
                  activeSpecCategory === cat.id
                    ? 'bg-orange-600 text-white font-black shadow-md shadow-orange-600/25 border border-orange-500'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specification Parameters Table (Light Glass Grid) */}
        <div className="max-w-4xl mx-auto divide-y divide-slate-200 dark-glass-card rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl">
          {technicalSpecs[activeSpecCategory].map((spec, idx) => (
            <div key={idx} className="py-4.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 first:pt-0 last:pb-0">
              <dt className="font-mono text-xs uppercase tracking-wider text-slate-600 flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>{spec.label}</span>
              </dt>
              <dd className="text-left sm:text-right">
                <span className="text-base sm:text-lg font-black text-slate-900 font-outfit">
                  {spec.value}
                </span>
                <span className="block font-mono text-[11px] text-amber-700 mt-0.5">
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
      <section id="live-radar" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="dark-glass-pill font-mono text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/60">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-600" />
            <span>REAL-TIME NETWORK ACTIVITY</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit mb-4">
            Live Workforce Verification Radar
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Monitor real-time profile verifications and digital gate pass generation streaming across key manufacturing corridors and tech hubs.
          </p>
        </div>

        {/* Radar Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center dark-glass-card border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          
          {/* Left: Industrial Corridor Selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-600 mb-2 flex items-center justify-between font-bold">
              <span className="text-slate-800">ACTIVE REGIONAL CORRIDORS</span>
              <span className="text-amber-700 font-bold">● 5 HUBS ONLINE</span>
            </div>

            {Object.keys(radarCities).map((key) => {
              const hub = radarCities[key];
              const isSelected = activeRadarCity === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveRadarCity(key)}
                  className={`text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-orange-600 border-orange-500 text-white shadow-lg ring-1 ring-orange-400'
                      : 'bg-white/80 border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50/40 hover:text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white animate-ping' : 'bg-slate-400'}`}></span>
                      <h4 className={`font-mono text-xs uppercase tracking-wider font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>{hub.name}</h4>
                    </div>
                    <p className={`text-[11px] mt-1 ${isSelected ? 'text-orange-100 font-medium' : 'text-slate-500'}`}>{hub.state} • {hub.tag}</p>
                  </div>
                  <span className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded border ${
                    isSelected 
                      ? 'text-white bg-black/20 border-white/30' 
                      : 'text-amber-800 bg-amber-50 border-amber-200'
                  }`}>
                    {hub.avgTat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Telemetry Event Stream Display */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-slate-900 shadow-md">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-[10px] text-amber-700 uppercase tracking-wider font-bold">
                  {radarCities[activeRadarCity].state}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-outfit">
                  {radarCities[activeRadarCity].name}
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-800 font-mono text-[10px] uppercase tracking-wider font-bold">
                <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                <span>TELEMETRY ACTIVE</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Daily Active Passes</span>
                <div className="text-lg font-black text-slate-900 mt-1 font-outfit">
                  {radarCities[activeRadarCity].activePasses.split(' ')[0]} <span className="text-xs font-normal text-slate-500">Passes</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Average Latency</span>
                <div className="text-lg font-black text-amber-700 mt-1 font-outfit">
                  {radarCities[activeRadarCity].avgTat}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Accuracy Score</span>
                <div className="text-lg font-black text-emerald-700 mt-1 font-outfit">
                  {radarCities[activeRadarCity].accuracy}
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-2 flex items-center justify-between font-bold">
                <span className="text-slate-700">// LATEST TELEMETRY EVENT STREAM</span>
                <span className="text-emerald-700 text-[9px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">REAL-TIME SYNC</span>
              </span>
              <p className="text-slate-700 leading-relaxed font-mono">
                <span className="text-emerald-700 font-bold">[14:15:45 PASS]</span> {radarCities[activeRadarCity].recentEvent}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 7. LIVE VERIFICATION DEMO & SIMULATOR (#interactive-lab)
       * ============================================================================== */}
      <section id="interactive-lab" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="dark-glass-pill text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/60">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>INTERACTIVE PRODUCT DEMO</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit mb-4">
            Try a Live Verification Check
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Select any hiring profile below to see how our platform automatically runs background checks, validates details, and generates a certified report in seconds.
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
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg ring-2 ring-orange-400/40'
                    : 'dark-glass-card border-slate-200 text-slate-700 hover:border-amber-300 hover:text-slate-900 bg-white/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white font-black' : 'bg-amber-50 text-amber-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${isSelected ? 'text-white font-black' : 'text-amber-700'}`}>
                    {isSelected ? 'SELECTED' : 'CLICK TO TEST'}
                  </span>
                </div>
                <div>
                  <h4 className={`font-bold text-sm font-outfit ${isSelected ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                  <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-orange-100 font-medium' : 'text-slate-500'}`}>{item.category}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Simulation Console */}
        <div className="dark-glass-card border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          
          {/* Top Console Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">CANDIDATE PROFILE</span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-outfit">
                  {simModes[selectedSimMode].candidate.name} — <span className="text-amber-700 font-bold">{simModes[selectedSimMode].candidate.role}</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJsonPayload(!showJsonPayload)}
                className="px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs flex items-center gap-1.5 transition-colors font-bold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>{showJsonPayload ? 'View Checklist' : 'View Certified Certificate'}</span>
              </button>

              <button
                onClick={() => handleRunSimulation(selectedSimMode)}
                disabled={simulating}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-md shadow-orange-600/25 border border-orange-500 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Verifying...' : 'Re-Run Verification Check'}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar when Simulating */}
          {simulating && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-amber-800 font-bold mb-1.5">
                <span>Running automated background screening checks...</span>
                <span>{simProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-100"
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Main Visual or Certificate Output */}
          {showJsonPayload ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-700 uppercase tracking-wider font-bold block">
                      OFFICIAL BACKGROUND VERIFICATION CERTIFICATE
                    </span>
                    <h4 className="text-base font-bold text-slate-900 font-outfit">
                      Verification Pass #{simModes[selectedSimMode].json.verificationId || 'JOY-VERIFIED-9921'}
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  VERIFIED & COMPLIANT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Candidate Name:</span>
                  <span className="text-slate-900 font-bold text-sm">{simModes[selectedSimMode].candidate.name}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Position / Department:</span>
                  <span className="text-slate-900 font-bold text-sm">{simModes[selectedSimMode].candidate.role}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Turnaround Time:</span>
                  <span className="text-emerald-700 font-bold">Under 60 Seconds (Instant)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Audit Status:</span>
                  <span className="text-emerald-700 font-bold">100% Verified & Certified</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">🔒 Signed & Secured by JOY Verification</span>
                <span className="text-amber-800 font-medium">Ready for Onboarding</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simModes[selectedSimMode].checks.map((check, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{check.title}</h5>
                      <span className="text-xs text-emerald-700 font-bold block mt-0.5">{check.status}</span>
                    </div>
                  </div>
                  <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 shrink-0 font-bold">
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
      <section id="roi-calculator" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="dark-glass-pill font-mono text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/60">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>ENTERPRISE VALUE & ROI ESTIMATOR</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit mb-4">
            Calculate Your Organization's Savings
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Discover how much your enterprise saves by replacing slow, manual background verification with automated profile verification workflows.
          </p>
        </div>

        {/* ROI Calculator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch dark-glass-card border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-xl">
          
          {/* Controls Left Column */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            
            {/* Workforce Type Selector */}
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold block mb-3">
                1. Select Workforce Structure
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
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      workforceType === item.id
                        ? 'bg-orange-600 text-white font-black border-orange-500 shadow-md shadow-orange-600/25'
                        : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-amber-50/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Monthly Hires */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold">
                  2. Monthly Candidate Onboarding Volume
                </label>
                <span className="font-mono text-base sm:text-lg font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
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
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-300"
              />
              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[10px] font-mono text-slate-500 font-bold mr-1">PRESETS:</span>
                {[250, 500, 1000, 2500, 5000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyHires(preset)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                      monthlyHires === preset ? 'bg-amber-500 text-slate-950 font-black border-amber-400' : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50/60'
                    }`}
                  >
                    {preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: Contractor Turnover Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold">
                  3. Annual Contractor Churn / Turnover
                </label>
                <span className="font-mono text-base font-black text-orange-800 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
                  {contractorTurnover}% / year
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={contractorTurnover}
                onChange={(e) => setContractorTurnover(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 border border-slate-300"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-500 font-semibold mt-1">
                <span>5% (Low Churn)</span>
                <span>25% (Industry Avg)</span>
                <span>60% (High Churn)</span>
              </div>
            </div>

            {/* Benchmark Note */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 font-mono text-xs text-amber-900 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Benchmark: Traditional manual verification averages ₹1,800/profile vs JOY TrueProfile automated verification at a fraction of the cost and time.
              </span>
            </div>

          </div>

          {/* Savings Output Right Column */}
          <div className="lg:col-span-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white text-slate-900 border border-amber-300/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xl">
            
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                TOTAL ESTIMATED ANNUAL VALUE CREATED
              </span>
              <div className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit tracking-tight">
                ₹{((totalMonthlySavings * 12) + Math.round(monthlyHires * 12 * 4500 * 0.04)).toLocaleString('en-IN')}
                <span className="text-xs sm:text-sm font-normal text-slate-500 ml-2">/ year</span>
              </div>
              <div className="text-xs font-mono text-emerald-700 mt-2 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Estimated Payback Period: Under 12 Business Days</span>
              </div>
            </div>

            {/* 4 KPI Grid */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Direct Verification Savings</span>
                <div className="text-lg font-black text-amber-700 font-outfit mt-0.5">
                  ₹{(totalMonthlySavings * 12).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ yr</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Ghost Payroll Blocked</span>
                <div className="text-lg font-black text-rose-700 font-outfit mt-0.5">
                  ~{ghostWorkerPrevented * 12} profiles
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">HR TAT Hours Saved</span>
                <div className="text-lg font-black text-emerald-700 font-outfit mt-0.5">
                  {(hoursSavedPerMonth * 12).toLocaleString()} hrs / yr
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Compliance Assurance</span>
                <div className="text-lg font-black text-amber-700 font-outfit mt-0.5">
                  100% Protected
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowDemoModal(true)}
                className="group relative flex-1 py-4 rounded-xl font-black text-sm text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.96] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer border border-orange-500 overflow-hidden"
              >
                <span className="tracking-wide text-white font-black">Unlock These Savings</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
                  alert(`✅ Executive ROI Business Case generated for ${monthlyHires.toLocaleString()} monthly hires! Estimated Annual Savings: ₹${((totalMonthlySavings * 12) + Math.round(monthlyHires * 12 * 4500 * 0.04)).toLocaleString('en-IN')}`);
                }}
                className="py-4 px-4 rounded-xl font-bold text-xs text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 hover:scale-[1.02] active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <span>Export ROI Summary</span>
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 9. COMPREHENSIVE SOLUTIONS BENTO GRID (#solutions)
       * ============================================================================== */}
      <section id="solutions" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="dark-glass-pill font-mono text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/60 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>ENTERPRISE SOLUTIONS</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit mb-4">
            Architected for High-Trust Organizations
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Whether managing thousands of plant and logistics personnel or screening executive leadership, JOY TrueProfile provides unified, audit-ready employee profile verification.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Seamless Mobile Flow */}
          <div className="rounded-3xl border border-slate-200 dark-glass-card p-6 sm:p-7 flex flex-col justify-between hover:border-amber-300 hover-jump shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-5 shadow-xs">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Seamless Mobile Flow
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Zero app installs required. Candidates complete digital identity verification, live selfie liveness checks, and consent via a simple, encrypted magic link.
              </p>
            </div>
            <div className="font-mono text-xs text-amber-800 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>98% Candidate Completion Rate</span>
              <Check className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>

          {/* Card 2: Workplace & Gate Access Passes */}
          <div className="rounded-3xl border border-slate-200 dark-glass-card p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-300 hover-jump shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-5 shadow-xs">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Workforce Digital Gate Passes
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Automated workforce compliance and digital credential issuance. Generates secure QR passes that seamlessly integrate with facility turnstiles and scanners.
              </p>
            </div>
            <div className="font-mono text-xs text-emerald-800 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>Sub-Second Gate Turnstile Response</span>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>

          {/* Card 3: Dual-Employment Radar */}
          <div className="rounded-3xl border border-slate-200 dark-glass-card p-6 sm:p-7 flex flex-col justify-between hover:border-orange-300 hover-jump shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 mb-5 shadow-xs">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Dual-Employment Radar
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Cross-references career service records and employment tenures to detect undeclared secondary employment, overlapping tenures, and integrity risks.
              </p>
            </div>
            <div className="font-mono text-xs text-orange-800 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>Zero-Tamper Work History Audit</span>
              <Check className="w-3.5 h-3.5 text-orange-600" />
            </div>
          </div>

          {/* Card 4: National Legal & Litigation Screening */}
          <div className="rounded-3xl border border-slate-200 dark-glass-card p-6 sm:p-7 flex flex-col justify-between hover:border-rose-300 hover-jump shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mb-5 shadow-xs">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Court & Legal Records Screening
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Real-time criminal and civil court records screening across national judicial registries, commercial tribunals, and public registries.
              </p>
            </div>
            <div className="font-mono text-xs text-rose-800 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>Fuzzy Match & Cross-Check</span>
              <Check className="w-3.5 h-3.5 text-rose-600" />
            </div>
          </div>

          {/* Card 5: Bank & Payroll Match */}
          <div className="rounded-3xl border border-slate-200 dark-glass-card p-6 sm:p-7 flex flex-col justify-between hover:border-amber-300 hover-jump shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-5 shadow-xs">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Direct Bank & Name Validation
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Performs automated validation to verify bank account active status and confirm exact account holder name before wage disbursement.
              </p>
            </div>
            <div className="font-mono text-xs text-amber-800 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>Eliminates Failed Salary Transfers</span>
              <Check className="w-3.5 h-3.5 text-amber-600" />
            </div>
          </div>

          {/* Card 6: Audit-Ready Dossier Reports */}
          <div className="rounded-3xl border border-slate-200 dark-glass-card p-6 sm:p-7 flex flex-col justify-between hover:border-teal-300 hover-jump shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-5 shadow-xs">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Audit-Ready Profile Dossiers
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Instantly compiles downloadable PDF audit reports stamped with cryptographic verification hashes, fully compliant with DPDP Act 2023.
              </p>
            </div>
            <div className="font-mono text-xs text-teal-800 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>DPDP Act 2023 Masked & Certified</span>
              <Check className="w-3.5 h-3.5 text-teal-600" />
            </div>
          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 10. CLIENT REVIEWS & VERIFIED TESTIMONIALS (#reviews)
       * ============================================================================== */}
      <section id="reviews" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="dark-glass-pill font-mono text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/60 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>ENTERPRISE TRUST & PROVEN IMPACT</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit mb-4">
            Trusted by Industrial & Corporate Leaders
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Read how manufacturing plants, logistics fleets, and corporate enterprises transform onboarding and employee profile verification.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {clientReviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark-glass-card p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-amber-300 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-bold">
                    {rev.badge}
                  </span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm text-slate-900 font-outfit">{rev.name}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">{rev.role}</p>
                  <p className="text-[11px] text-amber-700 font-mono font-bold mt-0.5">{rev.company}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review CTA Banner */}
        <div className="rounded-2xl border border-slate-200 dark-glass-card p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div>
            <h4 className="font-bold text-slate-900 text-base sm:text-lg font-outfit">Are you an active JOY TrueProfile enterprise partner?</h4>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">Share your verification turnaround and efficiency experience with the community.</p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all font-bold shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Submit Client Review</span>
          </button>
        </div>

      </section>

      {/* ==============================================================================
       * 11. KNOWLEDGE HUB & COMPLIANCE ARTICLES (#knowledge-hub)
       * ============================================================================== */}
      <section id="knowledge-hub" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="dark-glass-pill font-mono text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/60 shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>INTELLIGENCE & INSIGHTS</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit mb-4">
            Knowledge Hub & Compliance Guides
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Expert resources on workforce compliance, DPDP Act 2023 regulations, audit blueprints, and dual-employment detection.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(publicArticles.length > 0 ? publicArticles.slice(0, 3) : fallbackArticles).map((art, idx) => (
            <div
              key={art.id || idx}
              className="rounded-2xl border border-slate-200 dark-glass-card p-6 flex flex-col justify-between hover:border-amber-300 transition-all shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mb-3 font-semibold">
                  <span className="text-amber-700 uppercase tracking-wider font-bold">{art.category || 'Compliance'}</span>
                  <span>{art.readTime || '4 min read'}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit group-hover:text-amber-700 transition-colors mb-2.5">
                  {art.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {art.excerpt || art.summary || 'Essential technical blueprint for enterprise compliance and background verification architecture.'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs font-mono text-amber-700 font-bold">
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
      <section id="faq" className="section-lazy-render scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="dark-glass-pill font-mono text-xs uppercase tracking-wider text-amber-800 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/60 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>CLARITY & ASSURANCE</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Everything you need to know about employee profile verification, turnstile integration, and DPDP compliance.
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="flex flex-col gap-3">
          {faqData.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all shadow-md dark-glass-card ${isOpen ? 'border-amber-300 bg-amber-50/70' : 'border-slate-200 hover:border-amber-200'}`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 font-outfit flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
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
      <section className="relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark-glass-hero p-6 sm:p-12 shadow-2xl bg-white/95">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-emerald-600/25">
                <Zap className="w-6 h-6" />
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit tracking-tight mb-4 leading-tight">
                Ready to Streamline Your Employee <br className="hidden sm:inline" />
                <span className="text-[#047857] font-black" style={{ color: '#047857' }}>Profile Verification?</span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
                Join leading enterprises and nationwide supply chains automating employee profile verification, stopping moonlighting fraud, and eliminating onboarding delays today.
              </p>

              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowDemoModal(true)}
                  style={{ backgroundColor: '#047857', color: '#ffffff' }}
                  className="group relative px-8 py-4 rounded-2xl font-black text-sm text-white shadow-xl shadow-emerald-950/25 hover:bg-[#065f46] hover:scale-[1.03] active:scale-[0.96] active:translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer border-2 border-[#065f46]"
                >
                  <span className="tracking-wide text-white font-black" style={{ color: '#ffffff' }}>Book Live Enterprise Walkthrough</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setLandingSelectedAmount(5000);
                    setShowLandingRazorpayModal(true);
                  }}
                  className="px-7 py-4 rounded-2xl font-bold text-sm text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 hover:border-emerald-300 shadow-sm hover:scale-[1.02] active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Get Verification Credits</span>
                </button>
              </div>

              {/* Compliance Guarantee Badges */}
              <div className="flex flex-wrap items-center gap-5 mt-8 font-mono text-[11px] text-slate-600 font-bold border-t border-slate-100 pt-6">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% DPDP Act 2023</span>
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-teal-600" /> Audit-Ready PDF Dossiers</span>
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-700" /> 256-Bit AES Cryptography</span>
              </div>
            </div>

            {/* Right 3D Visual Centerpiece (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-2xl relative group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="/assets/3d/liquid_glass_vault_3d.jpg"
                    alt="Liquid Glass Cryptographic Vault 3D"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-400/50 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Joy Neural Verification Mesh</span>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/50 font-mono text-[9px] text-emerald-300 font-bold flex items-center gap-1.5 shadow-md">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>99.99% Cloud SLA</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 14. MODERN ENTERPRISE 4-COLUMN FOOTER
       * ============================================================================== */}
      <footer className="relative z-10 py-16 bg-white border-t border-slate-200 px-4 sm:px-8 font-mono text-xs text-slate-500 shadow-sm backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          
          {/* Top 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-100">
            
            {/* Column 1: Brand & Credentials */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                  alt="JOY TRUE PROFILE Logo" 
                  className="w-10 h-10 object-contain drop-shadow-[0_4px_12px_rgba(16,185,129,0.25)]" 
                />
                <div>
                  <span className="font-black text-slate-900 font-outfit text-base tracking-tight">JOY <span className="text-[#047857] font-black" style={{ color: '#047857' }}>TRUE PROFILE</span></span>
                  <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Zero-Trust Verification</p>
                </div>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed font-sans font-normal">
                Automated employee background verification platform built for modern enterprises, high-growth teams, and secure workplaces across India.
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ISO 27001 & DPDP Ready
                </span>
              </div>
            </div>

            {/* Column 2: Verification Engines */}
            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate-900 font-bold mb-1">
                Verification Modules
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-600">
                <li><a href="#features" className="hover:text-emerald-700 transition-colors">Digital Identity & Liveness Check</a></li>
                <li><a href="#features" className="hover:text-emerald-700 transition-colors">Employment History & Tenure Radar</a></li>
                <li><a href="#features" className="hover:text-emerald-700 transition-colors">National Judicial & Court Screening</a></li>
                <li><a href="#features" className="hover:text-emerald-700 transition-colors">Direct Bank & Name Validation</a></li>
                <li><a href="#features" className="hover:text-emerald-700 transition-colors">Workplace Digital QR Passes</a></li>
              </ul>
            </div>

            {/* Column 3: Platform & Tools */}
            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate-900 font-bold mb-1">
                Platform & Solutions
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-600">
                <li><a href="#interactive-lab" className="hover:text-emerald-700 transition-colors">TrueProfile Simulator Studio</a></li>
                <li><a href="#live-radar" className="hover:text-emerald-700 transition-colors">Live India Workforce Radar</a></li>
                <li><a href="#roi-calculator" className="hover:text-emerald-700 transition-colors">Enterprise ROI Calculator</a></li>
                <li><a href="#specs" className="hover:text-emerald-700 transition-colors">Technical SLA & Performance</a></li>
                <li><a href="#knowledge-hub" className="hover:text-emerald-700 transition-colors">Knowledge Hub & Insights</a></li>
              </ul>
            </div>

            {/* Column 4: Compliance & Direct Helpdesk */}
            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate-900 font-bold mb-1">
                Support & Contact
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Enterprise support desk with dedicated onboarding specialists and 24/7 SLA monitoring.
              </p>
              <div className="flex flex-col gap-1.5 text-xs text-slate-600 font-mono mt-1">
                <span className="text-slate-900 font-bold">Email: support@joygroup.art</span>
                <span className="text-slate-900 font-bold">WhatsApp: +91 99400 00000</span>
                <span className="text-emerald-700">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
              </div>
            </div>

          </div>

          {/* Bottom Status & Copyright Bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-700 font-bold">All Verification Nodes Operational (99.99% SLA)</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={() => setShowLegalHandbook(true)}
                className="hover:text-emerald-700 transition-colors cursor-pointer text-slate-600 font-bold"
              >
                Statutory Compliance Handbook
              </button>
              <a href="/login" className="hover:text-emerald-700 transition-colors text-slate-600 font-bold">
                Client Portal Login
              </a>
              <span className="text-slate-300">|</span>
              <span>© {new Date().getFullYear()} JOY Corporate Solutions Pvt Ltd.</span>
            </div>

          </div>

        </div>
      </footer>

      {/* ==============================================================================
       * 15. MODALS & OVERLAYS
       * ============================================================================== */}

      {/* Enterprise Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-500/40 flex items-center justify-center text-emerald-600 mb-4 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Demo Request Received!</h3>
                <p className="text-slate-600 text-sm max-w-sm mb-6">
                  Our enterprise solutions team will contact you within 15 minutes to schedule your live walkthrough and configure test verification credits.
                </p>
                <button
                  onClick={() => { setDemoSubmitted(false); setShowDemoModal(false); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-md shadow-orange-600/25 border border-orange-500 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-amber-700 font-bold mb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>ENTERPRISE WALKTHROUGH</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">
                  Schedule a Custom Live Demo
                </h3>
                <p className="text-slate-600 text-xs mb-6">
                  Experience sub-second employee profile verification configured specifically for your organization's workflow.
                </p>

                <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      placeholder="e.g. Anand Mahindra"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        placeholder="anand@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      placeholder="e.g. Apex Enterprises Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Monthly Hires / Passes</label>
                      <select
                        value={demoForm.hires}
                        onChange={(e) => setDemoForm({ ...demoForm, hires: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                      >
                        <option value="50-200">50 - 200 / month</option>
                        <option value="200-1000">200 - 1,000 / month</option>
                        <option value="1000-5000">1,000 - 5,000 / month</option>
                        <option value="5000+">5,000+ / month</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Workforce Focus</label>
                      <select
                        value={demoForm.workforceType}
                        onChange={(e) => setDemoForm({ ...demoForm, workforceType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
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
                    className="w-full mt-3 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-orange-500 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-500/40 flex items-center justify-center text-emerald-600 mb-4 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Review Submitted!</h3>
                <p className="text-slate-600 text-sm max-w-sm mb-6">
                  Thank you for your feedback. Your verified client review will be published to the community wall upon moderation.
                </p>
                <button
                  onClick={() => { setReviewSubmitted(false); setShowReviewModal(false); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-700 transition-all shadow-md shadow-orange-600/25 border border-orange-500 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-amber-700 font-bold mb-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>CLIENT COMMUNITY WALL</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">
                  Submit Verified Enterprise Review
                </h3>
                <p className="text-slate-600 text-xs mb-6">
                  Share your experience with JOY TRUE PROFILE turnaround speed and employee background verification.
                </p>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="e.g. Priya Iyer"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Designation / Role *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.role}
                        onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                        placeholder="e.g. Head of HR"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.company}
                        onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                        placeholder="e.g. Nexus 3PL Corp"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Rating (1 to 5 Stars)</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-amber-500"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value={3}>⭐⭐⭐ (3 - Good)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Your Review / Impact Story *</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Describe how JOY TRUE PROFILE accelerated your turnaround time or eliminated verification delays..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full mt-2 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-orange-500 cursor-pointer"
                  >
                    {reviewLoading ? 'Submitting Review...' : 'Post Client Testimonial'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statutory Compliance Handbook Modal */}
      {showLegalHandbook && (
        <LegalComplianceHandbookModal isOpen={showLegalHandbook} onClose={() => setShowLegalHandbook(false)} />
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

