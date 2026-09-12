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

  // Active View Tab State (Single Unified Tab Switcher)
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation & Interactive Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Interactive Spec Customizer Tab State
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
    <div className="min-h-screen bg-[#070A11] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      
      {/* Innovative First-Load / Reload Holographic Logo Preloader */}
      {showPreloader && (
        <LandingPagePreloader onFinish={() => setShowPreloader(false)} />
      )}

      {/* Executive High-Performance Looping Video Background & Frosted Ambient Veil */}
      <VideoLoopBackground />

      {/* Ambient Deep Radial Mesh Lighting Flares */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-amber-500/05 rounded-full blur-[160px]" />
      </div>

      {/* ==============================================================================
       * 1. TOP NAVIGATION: SINGLE ELEGANT EXECUTIVE NAVBAR WITH NEAT PILL TOGGLE
       * ============================================================================== */}
      <header className="sticky top-0 z-50 w-full bg-[#070A11]/90 backdrop-blur-2xl border-b border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.6)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo - Single Line, Clean, Balanced */}
          <button onClick={() => handleTabChange('overview')} className="flex items-center gap-3 shrink-0 group text-left cursor-pointer border-none bg-transparent">
            <div className="relative shrink-0">
              <img 
                src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                alt="JOY TRUE PROFILE Logo" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <div className="flex items-center gap-1.5 whitespace-nowrap leading-none">
                <span className="text-lg sm:text-xl font-black text-white font-outfit tracking-tight">JOY</span>
                <span className="text-lg sm:text-xl font-black text-emerald-400 font-outfit tracking-tight">TRUE PROFILE</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 font-bold whitespace-nowrap mt-1">
                Zero-Trust Verification
              </span>
            </div>
          </button>

          {/* Center Navigation: Single Neat Segmented Pill Switcher (No Duplicate Bars!) */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-slate-950/80 border border-slate-800/90 shadow-inner backdrop-blur-xl">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'features', label: 'Features' },
              { id: 'moonlighting', label: 'Moonlighting Radar' },
              { id: 'turnstile', label: 'Turnstile Gate' },
              { id: 'comparison', label: 'Speed Matrix' },
              { id: 'roi', label: 'ROI Calculator' },
              { id: 'solutions', label: 'Solutions' },
              { id: 'resources', label: 'Resources' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-black shadow-[0_0_18px_rgba(16,185,129,0.4)] border border-emerald-400/50 scale-[1.03]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Book Live Demo Primary Button */}
            <button
              onClick={() => setShowDemoModal(true)}
              className="whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/50"
            >
              <span>Book Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 shadow-md cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 px-4 py-4 bg-slate-950 shadow-2xl flex flex-col gap-2 font-sans text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <button onClick={() => { handleTabChange('overview'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-200 hover:text-emerald-400 hover:bg-slate-900 font-bold text-left">Overview</button>
            <button onClick={() => { handleTabChange('features'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-200 hover:text-emerald-400 hover:bg-slate-900 font-bold text-left">Verification Modules</button>
            <button onClick={() => { handleTabChange('moonlighting'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-200 hover:text-emerald-400 hover:bg-slate-900 font-bold text-left">Moonlighting Radar</button>
            <button onClick={() => { handleTabChange('turnstile'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-200 hover:text-emerald-400 hover:bg-slate-900 font-bold text-left">Turnstile Simulator</button>
            <button onClick={() => { handleTabChange('comparison'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-200 hover:text-emerald-400 hover:bg-slate-900 font-bold text-left">Comparison Matrix</button>
            <button onClick={() => { handleTabChange('roi'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-200 hover:text-emerald-400 hover:bg-slate-900 font-bold text-left">ROI Calculator</button>
            <button onClick={() => { handleTabChange('solutions'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-200 hover:text-emerald-400 hover:bg-slate-900 font-bold text-left">Enterprise Solutions</button>
            <button onClick={() => { handleTabChange('resources'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-200 hover:text-emerald-400 hover:bg-slate-900 font-bold text-left">Resources & FAQ</button>
            
            <div className="pt-3 mt-1 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); setShowDemoModal(true); }}
                className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 text-center shadow-lg border border-emerald-500/50 cursor-pointer"
              >
                <span>Book Live Demo</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==============================================================================
       * TAB VIEW CONTENT SWITCHING
       * ============================================================================== */}

      {/* VIEW 1: OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {/* HERO SECTION */}
          <section className="relative z-10 pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
              
              {/* Left Column: Value Proposition & CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                {/* Trust Eyebrow Pill */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6 shadow-xl border border-emerald-500/40 text-emerald-300 font-bold text-xs bg-slate-900/90 backdrop-blur-md hover:border-emerald-400/60 transition-all cursor-pointer">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold font-mono uppercase tracking-wider text-[11px] text-white">
                    INDIA'S FIRST ZERO-TRUST WORKFORCE VERIFICATION PLATFORM
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                    500K+ CHECKS
                  </span>
                </div>

                {/* Main Marketing Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-5 font-outfit">
                  Zero-Trust Workforce Verification. <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 font-black">
                    In 45 Seconds Flat.
                  </span>
                </h1>

                {/* Clear, High-Impact Subtitle */}
                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8 font-medium">
                  Eliminate fake resumes, ghost workers, dual-employment moonlighting, and statutory penalties. Automated parallel screening across Aadhaar, PAN, EPFO, Court records, and Bank rails — without manual delays or paperwork.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10 w-full sm:w-auto">
                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="group relative px-8 py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-emerald-400/50"
                  >
                    <span className="tracking-wide text-white font-black text-base">Book a Free Live Demo</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleTabChange('features')}
                    className="bg-slate-900 border border-slate-700 hover:border-emerald-500/60 px-6 py-4 rounded-2xl font-bold text-sm text-slate-200 hover:text-emerald-400 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Explore All Features</span>
                  </button>
                </div>

                {/* Key Value Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-6 border-t border-slate-800/80 w-full max-w-2xl">
                  <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-outfit">&lt;45s</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold mt-0.5">Verification TAT</div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="text-xl sm:text-2xl font-black text-white font-outfit">99.98%</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold mt-0.5">Precision Rate</div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="text-xl sm:text-2xl font-black text-teal-300 font-outfit">100%</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold mt-0.5">DPDP 2023 Compliant</div>
                  </div>
                  <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-xl">
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-outfit">80%</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold mt-0.5">Cost Reduction</div>
                  </div>
                </div>

              </div>

              {/* Right Column: 3D Holographic Employee ID Passport Centerpiece */}
              <div className="lg:col-span-5 flex justify-center">
                <HeroInteractiveCard3D />
              </div>

            </div>
          </section>

          {/* STATUTORY TICKER */}
          <section className="relative z-10 py-4 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="relative rounded-2xl bg-slate-950/90 border border-slate-800/80 py-3.5 px-2 overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-6 whitespace-nowrap animate-marquee text-xs text-slate-300 tracking-wider uppercase font-bold">
                {[...Array(2)].map((_, loopIdx) => (
                  <React.Fragment key={loopIdx}>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO 27001 CERTIFIED CLOUD
                    </span>
                    <span className="text-emerald-400">✦</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 shadow-md">
                      <Lock className="w-3.5 h-3.5 text-teal-400" /> DPDP ACT 2023 STATUTORY CONSENT
                    </span>
                    <span className="text-emerald-400">✦</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 shadow-md">
                      <Fingerprint className="w-3.5 h-3.5 text-emerald-400" /> UIDAI & AADHAAR ECOSYSTEM INTEGRATED
                    </span>
                    <span className="text-emerald-400">✦</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 shadow-md">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> EPFO UAN REAL-TIME PASSBOOK RADAR
                    </span>
                    <span className="text-emerald-400">✦</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 shadow-md">
                      <Scale className="w-3.5 h-3.5 text-indigo-400" /> PAN-INDIA DISTRICT & HIGH COURT REPOSITORIES
                    </span>
                    <span className="text-emerald-400">✦</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* QUICK FEATURE HIGHLIGHTS */}
          <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-2 inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                4 CORE PILLARS OF JOY VERIFICATION
              </span>
              <h2 className="text-3xl font-black text-white font-outfit">Built for Enterprise Scale & Speed</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div onClick={() => handleTabChange('features')} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-outfit mb-2">Digital ID & Liveness</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">Instant Aadhaar/PAN checksum validation with biometric facial liveness match.</p>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">Open Module <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>

              <div onClick={() => handleTabChange('moonlighting')} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-outfit mb-2">Moonlighting Radar</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">Detect EPFO UAN active contribution overlaps and secondary undisclosed employment.</p>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">Open Module <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>

              <div onClick={() => handleTabChange('turnstile')} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HardHat className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-outfit mb-2">Turnstile Gate Access</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">Real-time QR gate pass issuance for factory workers and contractor labor.</p>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">Open Module <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>

              <div onClick={() => handleTabChange('roi')} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-outfit mb-2">80% Cost Reduction</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">Eliminate manual background verification fees and ghost worker payroll leakages.</p>
                <span className="text-xs text-teal-300 font-bold flex items-center gap-1">Calculate Savings <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          </section>

          {/* LIVE INDIA RADAR PREVIEW */}
          <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>REAL-TIME NETWORK ACTIVITY</span>
              </span>
              <h2 className="text-3xl font-black text-white font-outfit">Live India Industrial Telemetry</h2>
            </div>
            
            {/* Telemetry Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between font-bold">
                  <span className="text-slate-200">ACTIVE REGIONAL CORRIDORS</span>
                  <span className="text-emerald-400 font-bold">● 5 HUBS ONLINE</span>
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
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-white animate-ping' : 'bg-slate-600'}`}></span>
                          <h4 className={`font-mono text-xs uppercase tracking-wider font-black ${isSelected ? 'text-white' : 'text-slate-200'}`}>{hub.name}</h4>
                        </div>
                        <p className={`text-[11px] mt-1 ${isSelected ? 'text-emerald-100 font-medium' : 'text-slate-400'}`}>{hub.state} • {hub.tag}</p>
                      </div>
                      <span className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded border ${
                        isSelected ? 'text-white bg-black/20 border-white/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      }`}>
                        {hub.avgTat}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">{radarCities[activeRadarCity].state}</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1 font-outfit">{radarCities[activeRadarCity].name}</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                    <span>TELEMETRY ACTIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Daily Active Passes</span>
                    <div className="text-lg font-black text-white mt-1 font-outfit">{radarCities[activeRadarCity].activePasses.split(' ')[0]}</div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Average Latency</span>
                    <div className="text-lg font-black text-amber-400 mt-1 font-outfit">{radarCities[activeRadarCity].avgTat}</div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Accuracy Score</span>
                    <div className="text-lg font-black text-emerald-400 mt-1 font-outfit">{radarCities[activeRadarCity].accuracy}</div>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-2 font-bold">// LATEST TELEMETRY EVENT STREAM</span>
                  <p className="text-slate-300 leading-relaxed font-mono">
                    <span className="text-emerald-400 font-bold">[14:15:45 PASS]</span> {radarCities[activeRadarCity].recentEvent}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* HIGH IMPACT CTA */}
          <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 text-center flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit mb-4">Transform Your Employee Verification Today</h2>
              <p className="text-slate-300 max-w-xl mb-8">Schedule a 15-minute live walkthrough with our enterprise security team.</p>
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-8 py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all cursor-pointer border border-emerald-400/50"
              >
                Book Enterprise Demo
              </button>
            </div>
          </section>
        </>
      )}

      {/* VIEW 2: FEATURES TAB */}
      {activeTab === 'features' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              FEATURE SUITE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit mb-4">Complete Employee Background Verification Engine</h2>
            <p className="text-slate-300 text-base">Explore all core screening modules designed for fast, error-free onboarding.</p>
          </div>

          {/* Verification Command Orbit */}
          <div className="mb-20">
            <VerificationCommandOrbit />
          </div>

          {/* Interactive Lab / Simulator */}
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2 inline-block">LIVE DEMO LAB</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">Run a Live Verification Simulation</h3>
            </div>

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
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white backdrop-blur-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white font-black' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${isSelected ? 'text-white font-black' : 'text-amber-400'}`}>
                        {isSelected ? 'SELECTED' : 'TEST'}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm font-outfit ${isSelected ? 'text-white' : 'text-slate-200'}`}>{item.title}</h4>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-100 font-medium' : 'text-slate-400'}`}>{item.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">CANDIDATE PROFILE</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-outfit">
                      {simModes[selectedSimMode].candidate.name} — <span className="text-emerald-400 font-bold">{simModes[selectedSimMode].candidate.role}</span>
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleRunSimulation(selectedSimMode)}
                  disabled={simulating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg border border-emerald-400/50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                  <span>{simulating ? 'Verifying...' : 'Re-Run Verification Check'}</span>
                </button>
              </div>

              {simulating && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1.5">
                    <span>Running automated background screening checks...</span>
                    <span>{simProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-100" style={{ width: `${simProgress}%` }}></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simModes[selectedSimMode].checks.map((check, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950 shadow-xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-white">{check.title}</h5>
                        <span className="text-xs text-emerald-400 font-bold block mt-0.5">{check.status}</span>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 shrink-0 font-bold">{check.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: MOONLIGHTING RADAR TAB */}
      {activeTab === 'moonlighting' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              EPFO UAN INTEGRATED
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit mb-4">Dual-Employment & Moonlighting Detection</h2>
            <p className="text-slate-300 text-base">Cross-reference active provident fund contributions and service history to block unauthorized secondary employment.</p>
          </div>

          <DualEmploymentRadarVisualizer />

          {/* Moonlighting Information Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <Zap className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-lg font-bold text-white font-outfit mb-2">EPFO Service Overlap Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Identifies exact overlapping contribution dates across multiple employer IDs in real time.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <Scale className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white font-outfit mb-2">Form 26AS Tax Cross-Check</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Verifies multiple salary streams and tax deductions to confirm single employment compliance.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <FileCheck className="w-8 h-8 text-teal-300 mb-4" />
              <h3 className="text-lg font-bold text-white font-outfit mb-2">Relieving Date Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Validates exit dates and relieving letters directly with past verified company records.</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: TURNSTILE GATE TAB */}
      {activeTab === 'turnstile' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              PLANT & FACILITY ACCESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit mb-4">Workforce Turnstile Gate Simulator</h2>
            <p className="text-slate-300 text-base">Automated QR gate pass issuance and contractor labor verification for manufacturing plants and project sites.</p>
          </div>

          <TurnstileGateSimulator />
        </div>
      )}

      {/* VIEW 5: SPEED MATRIX COMPARISON TAB */}
      {activeTab === 'comparison' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              PERFORMANCE BENCHMARK
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit mb-4">15-Day Agency vs JOY 45-Second Engine</h2>
            <p className="text-slate-300 text-base">See how automated digital verification outperforms traditional manual background screening agencies.</p>
          </div>

          <InteractiveSpeedComparison />

          <InteractiveProcessPipeline />
        </div>
      )}

      {/* VIEW 6: ROI CALCULATOR TAB */}
      {activeTab === 'roi' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              FINANCIAL IMPACT ESTIMATOR
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit mb-4">Enterprise ROI & Savings Calculator</h2>
            <p className="text-slate-300 text-base">Quantify your annual savings, HR hour reductions, and ghost worker prevention metrics.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold block mb-3">1. Select Workforce Structure</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'labor', label: 'Factory / Labor' },
                    { id: 'corporate', label: 'Corporate / IT' },
                    { id: 'mixed', label: 'Mixed Workforce' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setWorkforceType(item.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        workforceType === item.id
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black border-emerald-400 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold">2. Monthly Candidate Volume</label>
                  <span className="font-mono text-base font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
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
                  className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold mr-1">PRESETS:</span>
                  {[250, 500, 1000, 2500, 5000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setMonthlyHires(preset)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                        monthlyHires === preset ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold">3. Annual Contractor Churn</label>
                  <span className="font-mono text-base font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
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
                  className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-slate-800"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 font-mono text-xs text-emerald-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Benchmark: Traditional manual verification averages ₹1,800/profile vs JOY TrueProfile automated check at a fraction of cost.</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 text-white border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-2xl">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">TOTAL ESTIMATED ANNUAL VALUE CREATED</span>
                <div className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight">
                  ₹{((totalMonthlySavings * 12) + Math.round(monthlyHires * 12 * 4500 * 0.04)).toLocaleString('en-IN')}
                  <span className="text-xs sm:text-sm font-normal text-slate-400 ml-2">/ year</span>
                </div>
                <div className="text-xs font-mono text-emerald-400 mt-2 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Estimated Payback Period: Under 12 Business Days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Direct Verification Savings</span>
                  <div className="text-lg font-black text-amber-400 font-outfit mt-0.5">₹{(totalMonthlySavings * 12).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ yr</span></div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ghost Payroll Blocked</span>
                  <div className="text-lg font-black text-rose-400 font-outfit mt-0.5">~{ghostWorkerPrevented * 12} profiles</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">HR TAT Hours Saved</span>
                  <div className="text-lg font-black text-emerald-400 font-outfit mt-0.5">{(hoursSavedPerMonth * 12).toLocaleString()} hrs / yr</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Compliance Assurance</span>
                  <div className="text-lg font-black text-amber-400 font-outfit mt-0.5">100% Protected</div>
                </div>
              </div>

              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full py-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 shadow-lg border border-emerald-400/50 cursor-pointer text-center"
              >
                Unlock These Savings Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 7: SOLUTIONS TAB */}
      {activeTab === 'solutions' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              INDUSTRY ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit mb-4">Enterprise-Grade Solutions & Security</h2>
            <p className="text-slate-300 text-base">Custom tailored verification pipelines for automotive manufacturing, supply chain, corporate IT, and EPC construction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 flex flex-col justify-between shadow-2xl">
              <div>
                <Smartphone className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white font-outfit mb-2">Seamless Mobile Flow</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Zero app installs. Candidates complete identity verification & selfie liveness via an encrypted magic link.</p>
              </div>
              <div className="font-mono text-xs text-emerald-400 font-bold pt-3 border-t border-slate-800">98% Candidate Completion Rate</div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 flex flex-col justify-between shadow-2xl">
              <div>
                <HardHat className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white font-outfit mb-2">Workforce Digital QR Passes</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Automated workforce compliance and digital credential issuance for facility turnstile gates.</p>
              </div>
              <div className="font-mono text-xs text-emerald-400 font-bold pt-3 border-t border-slate-800">Sub-Second Gate Turnstile Response</div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 flex flex-col justify-between shadow-2xl">
              <div>
                <Search className="w-10 h-10 text-amber-400 mb-4" />
                <h3 className="text-xl font-bold text-white font-outfit mb-2">Dual-Employment Radar</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Cross-references career service records and employment tenures to detect undisclosed secondary jobs.</p>
              </div>
              <div className="font-mono text-xs text-amber-400 font-bold pt-3 border-t border-slate-800">Zero-Tamper Work History Audit</div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 8: RESOURCES TAB */}
      {activeTab === 'resources' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              SPECIFICATIONS & REVIEWS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit mb-4">Resources, Client Reviews & FAQ</h2>
            <p className="text-slate-300 text-base">System reliability specifications, client testimonials, statutory compliance guides, and answers to common questions.</p>
          </div>

          {/* Specs Segmented Control */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs uppercase tracking-wider backdrop-blur-xl">
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
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white font-black shadow-lg shadow-emerald-500/20 border border-emerald-400/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specs Table */}
          <div className="max-w-4xl mx-auto divide-y divide-slate-800 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-white mb-20">
            {technicalSpecs[activeSpecCategory].map((spec, idx) => (
              <div key={idx} className="py-4.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 first:pt-0 last:pb-0">
                <dt className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{spec.label}</span>
                </dt>
                <dd className="text-left sm:text-right">
                  <span className="text-base sm:text-lg font-black text-white font-outfit">{spec.value}</span>
                  <span className="block font-mono text-[11px] text-emerald-400 mt-0.5">{spec.detail}</span>
                </dd>
              </div>
            ))}
          </div>

          {/* Client Reviews */}
          <div className="mb-20">
            <h3 className="text-2xl font-black text-white font-outfit text-center mb-8">What Industrial Leaders Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientReviews.map((rev, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between gap-6 shadow-2xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 font-bold">{rev.badge}</span>
                    </div>
                    <p className="text-slate-300 text-sm italic">"{rev.quote}"</p>
                  </div>
                  <div className="border-t border-slate-800 pt-4">
                    <h5 className="font-bold text-sm text-white font-outfit">{rev.name}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">{rev.role} — <span className="text-emerald-400">{rev.company}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-white font-outfit text-center mb-8">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-3">
              {faqData.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`rounded-2xl border transition-all shadow-xl bg-slate-900/90 ${isOpen ? 'border-emerald-500/50' : 'border-slate-800'}`}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================================
       * FOOTER
       * ============================================================================== */}
      <footer className="relative z-10 py-16 bg-[#04060B] border-t border-slate-800/80 px-4 sm:px-8 font-mono text-xs text-slate-400 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                  alt="JOY TRUE PROFILE Logo" 
                  className="w-10 h-10 object-contain drop-shadow-[0_4px_12px_rgba(16,185,129,0.25)]" 
                />
                <div>
                  <span className="font-black text-white font-outfit text-base tracking-tight">JOY <span className="text-emerald-400 font-black">TRUE PROFILE</span></span>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Zero-Trust Verification</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans font-normal">
                Automated employee background verification platform built for modern enterprises, high-growth teams, and secure workplaces across India.
              </p>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-1">Navigation Tabs</h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-400">
                <li><button onClick={() => handleTabChange('overview')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">🚀 Executive Overview</button></li>
                <li><button onClick={() => handleTabChange('features')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">🛡️ Verification Modules</button></li>
                <li><button onClick={() => handleTabChange('moonlighting')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">📡 Moonlighting Radar</button></li>
                <li><button onClick={() => handleTabChange('turnstile')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">🚧 Turnstile Gate Access</button></li>
                <li><button onClick={() => handleTabChange('comparison')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">⚡ Speed Matrix</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-1">Platform Resources</h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-400">
                <li><button onClick={() => handleTabChange('roi')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">💰 ROI Calculator</button></li>
                <li><button onClick={() => handleTabChange('solutions')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">🏢 Enterprise Solutions</button></li>
                <li><button onClick={() => handleTabChange('resources')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">📚 Technical Specs & FAQ</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-1">Support & Legal</h4>
              <div className="flex flex-col gap-1.5 text-xs text-slate-300 font-mono">
                <span className="text-white font-bold">Email: support@joygroup.art</span>
                <span className="text-emerald-400">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-bold">All Verification Nodes Operational (99.99% SLA)</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <button onClick={() => setShowLegalHandbook(true)} className="hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 font-bold">Statutory Compliance Handbook</button>
              <a href="/login" className="hover:text-emerald-400 transition-colors text-slate-400 font-bold">Client Portal Login</a>
              <span>© {new Date().getFullYear()} JOY Corporate Solutions Pvt Ltd.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP CONCIERGE FLOATING WIDGET */}
      <WhatsAppConcierge3D />

      {/* MODALS */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowDemoModal(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-outfit mb-2">Demo Request Received!</h3>
                <p className="text-slate-400 text-sm max-w-sm mb-6">Our enterprise solutions team will contact you within 15 minutes to schedule your walkthrough.</p>
                <button onClick={() => { setDemoSubmitted(false); setShowDemoModal(false); }} className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400/50 cursor-pointer">Close Window</button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>ENTERPRISE WALKTHROUGH</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-outfit mb-2">Schedule a Custom Live Demo</h3>
                <p className="text-slate-400 text-xs mb-6">Experience sub-second employee profile verification configured for your workflow.</p>

                <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Full Name *</label>
                    <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })} placeholder="e.g. Anand Mahindra" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Work Email *</label>
                      <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })} placeholder="anand@company.com" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Phone Number *</label>
                      <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Company / Organization *</label>
                    <input type="text" required value={demoForm.company} onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })} placeholder="e.g. Apex Enterprises Ltd" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500" />
                  </div>
                  <button type="submit" disabled={demoLoading} className="w-full mt-3 py-3.5 rounded-xl font-bold text-xs uppercase text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 border border-emerald-400/50 cursor-pointer">
                    {demoLoading ? 'Submitting...' : 'Confirm Demo Booking'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-2xl font-bold text-white font-outfit mb-2">Review Submitted!</h3>
                <button onClick={() => { setReviewSubmitted(false); setShowReviewModal(false); }} className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 cursor-pointer">Close Window</button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white font-outfit mb-2">Submit Client Review</h3>
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Your Name *</label>
                      <input type="text" required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white" />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Role *</label>
                      <input type="text" required value={reviewForm.role} onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Review *</label>
                    <textarea required rows={4} value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none" />
                  </div>
                  <button type="submit" disabled={reviewLoading} className="w-full py-3.5 rounded-xl font-bold text-xs uppercase text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 border border-emerald-400/50 cursor-pointer">
                    {reviewLoading ? 'Submitting...' : 'Post Client Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {showLegalHandbook && (
        <LegalComplianceHandbookModal isOpen={showLegalHandbook} onClose={() => setShowLegalHandbook(false)} />
      )}

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
