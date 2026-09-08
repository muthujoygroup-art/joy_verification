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
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showLandingRazorpayModal, setShowLandingRazorpayModal] = useState(false);
  const [landingSelectedAmount, setLandingSelectedAmount] = useState(5000);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  // Hero 3D Card Parallax Tilt State
  const [tiltStyle, setTiltStyle] = useState({});
  const heroCardRef = useRef(null);

  // Hero Interactive Multi-Worker Personas & Biometric State
  const [activePersona, setActivePersona] = useState('aryan');
  const [heroScanning, setHeroScanning] = useState(false);
  const [heroScanComplete, setHeroScanComplete] = useState(false);
  const [heroScanProgress, setHeroScanProgress] = useState(0);
  const [heroScanStage, setHeroScanStage] = useState('idle'); // 'idle' | 'identity' | 'experience' | 'bank' | 'complete'

  // WhatsApp Floating Widget State
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState('');

  const handleSendWhatsApp = (customText) => {
    const defaultPhone = '919940000000';
    const message = customText || whatsappMsg || 'Hello JOY TrueProfile Team! I would like to learn more about employee profile verification for my enterprise.';
    const url = `https://wa.me/${defaultPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const heroPersonas = {
    aryan: {
      name: 'Sarah J. Chen',
      role: 'Senior Software Engineer',
      contractor: 'Enterprise Direct Hire',
      hub: 'Bengaluru Tech Corridor, KA',
      idChecksum: 'ID-VERIFIED-9012',
      workRecordId: 'EXP-REC-8841',
      bank: 'HDFC Bank (Payroll Validated)',
      gateId: 'JOY-EMP-BLR-9042',
      image: '/assets/3d/liquid_glass_hero_3d.jpg',
      statutoryPass: 'Corporate Security Clearance'
    },
    pooja: {
      name: 'Pooja Verma',
      role: 'Supply Chain Operations Lead',
      contractor: 'FastTrack Logistics Solutions',
      hub: 'Bhiwandi Logistics Hub, MH',
      idChecksum: 'ID-VERIFIED-4811',
      workRecordId: 'EXP-REC-7104',
      bank: 'State Bank of India (Payroll Validated)',
      gateId: 'JOY-EMP-BHW-3108',
      image: '/assets/3d/liquid_glass_flow_3d.jpg',
      statutoryPass: 'Supply Chain Access Pass'
    },
    rajesh: {
      name: 'Aryan Sharma',
      role: 'Precision Engineering Specialist',
      contractor: 'Premier Manufacturing Corp',
      hub: 'Sanand Industrial Cluster, GJ',
      idChecksum: 'ID-VERIFIED-6523',
      workRecordId: 'EXP-REC-4490',
      bank: 'ICICI Bank (Payroll Validated)',
      gateId: 'JOY-EMP-SND-1150',
      image: '/assets/3d/liquid_glass_vault_3d.jpg',
      statutoryPass: 'Workforce Security Pass'
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
    setHeroScanStage('identity');

    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setHeroScanProgress(current);

      if (current >= 35 && current < 70) {
        setHeroScanStage('experience');
      } else if (current >= 70 && current < 100) {
        setHeroScanStage('bank');
      } else if (current >= 100) {
        clearInterval(interval);
        setHeroScanning(false);
        setHeroScanComplete(true);
        setHeroScanStage('complete');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 60);
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

  // Technical Specifications Data (Precision Profile Matrix)
  const technicalSpecs = {
    performance: [
      { label: 'Gate Clearance TAT', value: '0.8 Seconds', detail: 'Sub-second digital pass verification' },
      { label: 'Biometric Deduplication', value: '99.98% Match', detail: 'Zero duplicate profile tolerance' },
      { label: 'Mobile KYC Completion', value: 'Under 2 Minutes', detail: 'Full candidate self-verification' },
      { label: 'Concurrent Throughput', value: '50,000+ Req/Min', detail: 'Distributed microservices engine' },
      { label: 'System Uptime SLA', value: '99.99%', detail: 'Multi-region high availability' }
    ],
    security: [
      { label: 'Data Encryption', value: '256-Bit AES-GCM', detail: 'End-to-end cryptographic protection' },
      { label: 'Privacy Compliance', value: 'DPDP Act 2023', detail: 'Consent-driven tokenized data vault' },
      { label: 'Global Compliance', value: 'ISO 27001 & SOC-2', detail: 'Independently audited infrastructure' },
      { label: 'Data Masking', value: 'Automated Redaction', detail: 'Automated PII masking & tokenization' },
      { label: 'Audit Log Immutability', value: 'Cryptographic Hash', detail: 'SHA-256 tamper-proof ledger' }
    ],
    statutory: [
      { label: 'Workforce Compliance', value: 'Statutory Passes Ready', detail: 'Automated digital access pass' },
      { label: 'Muster Roll Records', value: 'Digital Attendance', detail: 'Audit-ready compliance records' },
      { label: 'Employment History', value: 'Tenure & Experience Scan', detail: 'Active contribution timeline check' },
      { label: 'Financial Verification', value: 'Direct Account Match', detail: 'Penny-drop bank name validation' },
      { label: 'Public Records Scope', value: 'National Legal Databases', detail: 'Comprehensive court records check' }
    ],
    infrastructure: [
      { label: 'Architecture', value: 'Event-Driven Microservices', detail: 'Ultra-low latency edge network' },
      { label: 'Verification APIs', value: 'Automated Enterprise Connectors', detail: 'ID, Experience, Banking, Legal' },
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
      q: 'How does JOY TrueProfile achieve fast and comprehensive employee profile verification?',
      a: 'JOY TrueProfile queries verified identity, past employment history, public legal records, and banking APIs in parallel using automated microservices. Instead of slow manual paper processing and endless phone calls, profile verification is completed seamlessly.'
    },
    {
      q: 'How does the platform eliminate duplicate worker profiles and fraudulent entries?',
      a: 'Contractor agencies and applicant pools can often contain duplicate identities or phantom entries. JOY TrueProfile performs biometric facial deduplication and digital checksum matching to ensure every profile is an authenticated, real individual before access is granted.'
    },
    {
      q: 'How is candidate privacy protected under the Digital Personal Data Protection (DPDP) Act 2023?',
      a: 'All verifications are 100% consent-driven. Candidates grant explicit OTP-based consent. Data in transit and at rest is secured with 256-bit AES cryptographic encryption, and automated data redaction ensures sensitive identifiers are masked in accordance with data privacy laws.'
    },
    {
      q: 'Can JOY TrueProfile issue digital compliance passes and audit-ready dossiers?',
      a: 'Yes. Upon successful verification, the engine automatically compiles tamper-proof audit dossiers, compliance certificates, and digital QR gate passes that can be printed or integrated with on-premise security systems.'
    },
    {
      q: 'Do candidates need to install any mobile app to complete verification?',
      a: 'No app download is required. Candidates receive a secure encrypted magic link via WhatsApp or SMS. They simply open the link in any mobile browser, verify with an OTP, capture a live selfie, and complete the check effortlessly.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      
      {/* Dynamic Aurora Mesh & Liquid Glass Ambient Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated Aurora Orb 1 */}
        <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-cyan-400/20 rounded-full blur-[120px] animate-aurora-1"></div>
        {/* Animated Aurora Orb 2 */}
        <div className="absolute top-[35%] right-[-10%] w-[750px] h-[750px] bg-gradient-to-bl from-cyan-400/20 via-indigo-400/15 to-purple-500/20 rounded-full blur-[140px] animate-aurora-2"></div>
        {/* Animated Aurora Orb 3 */}
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-sky-400/15 via-blue-600/10 to-emerald-400/10 rounded-full blur-[130px] animate-aurora-1"></div>
        {/* Precision Crystalline Grid Layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:48px_48px] opacity-25"></div>
      </div>

      {/* ==============================================================================
       * 1. TOP NAVIGATION (CLEAN & SPACIOUS MODERN SAAS HEADER)
       * ============================================================================== */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/95 border-b border-slate-200/90 px-4 sm:px-8 py-3 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5 font-outfit">
                JOY <span className="text-blue-600">TrueProfile</span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 block -mt-0.5 font-bold">
                Employee Profile Verification
              </span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 font-mono text-xs text-slate-700 font-semibold">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
            <a href="#interactive-lab" className="hover:text-blue-600 transition-colors">Simulator</a>
            <a href="#roi-calculator" className="hover:text-blue-600 transition-colors">ROI Calculator</a>
            
            {/* More Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                className="hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Resources</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {resourcesDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 font-sans animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setResourcesDropdownOpen(false)}
                >
                  <a href="#craft" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                    <span>Architecture</span>
                  </a>
                  <a href="#specs" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>Specifications</span>
                  </a>
                  <a href="#live-radar" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-blue-600" />
                    <span>India Radar</span>
                  </a>
                  <a href="#reviews" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-blue-600" />
                    <span>Client Reviews</span>
                  </a>
                  <a href="#knowledge-hub" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Knowledge Hub</span>
                  </a>
                  <a href="#faq" onClick={() => setResourcesDropdownOpen(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>FAQ</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs & Portal Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Portal Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Select Portal</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {portalDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 font-sans animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setPortalDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                    Authentication Gateways
                  </div>
                  <a
                    href="/login?role=superadmin"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Super Admin Console</div>
                      <div className="text-[10px] text-slate-500">Platform Control & Margins</div>
                    </div>
                  </a>
                  <a
                    href="/login?role=company"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-800 hover:text-sky-900 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Company Admin Portal</div>
                      <div className="text-[10px] text-slate-500">Corporate Quotas & HR Teams</div>
                    </div>
                  </a>
                  <a
                    href="/login?role=hrexecutive"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">HR Executive Workstation</div>
                      <div className="text-[10px] text-slate-500">Candidate Profiler & Links</div>
                    </div>
                  </a>
                  <a
                    href="/login?role=employee_link"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-amber-900 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Smartphone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Candidate Mobile Link</div>
                      <div className="text-[10px] text-slate-500">Passwordless Self-Verification</div>
                    </div>
                  </a>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Book Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 border-t border-slate-200 flex flex-col gap-3 font-mono text-xs px-2 pb-2">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">How It Works</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">Solutions</a>
            <a href="#interactive-lab" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">Simulator Studio</a>
            <a href="#roi-calculator" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">ROI Calculator</a>
            <a href="#craft" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">Architecture</a>
            <a href="#specs" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">Specifications</a>
            <a href="#live-radar" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">India Telemetry Radar</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">Reviews</a>
            <a href="#knowledge-hub" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">Knowledge Hub</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-slate-700 hover:text-blue-600 font-medium">FAQ</a>
            
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <a
                href="/login?role=hrexecutive"
                className="w-full py-2 rounded-xl font-bold text-xs text-slate-800 bg-slate-100 hover:bg-slate-200 text-center border border-slate-300"
              >
                Portals & Login
              </a>
              <button
                onClick={() => { setMobileMenuOpen(false); setShowDemoModal(true); }}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 text-center shadow-sm"
              >
                Book Live Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==============================================================================
       * 2. HERO SECTION: 3D LIQUID GLASS EMPLOYEE PROFILE VERIFICATION STAGE
       * ============================================================================== */}
      <section className="relative z-10 pt-8 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Live Telemetry Pill */}
            <div className="liquid-glass-pill inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 shadow-sm hover-jump-subtle cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono font-bold uppercase tracking-wider text-[11px] text-slate-800">
                LIVE: 520,000+ Employee Profiles Verified Across 34 Indian Hubs
              </span>
            </div>

            {/* Main Headline with Electric Gradient */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] mb-6 font-outfit">
              The Easiest & Most Reliable Way to <br className="hidden sm:inline" />
              <span className="text-gradient-electric">
                Verify Employee Profiles
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed mb-8 font-medium">
              Zero manual paperwork. Zero endless phone calls. JOY TrueProfile makes employee profile verification as simple as sending a link. Validate digital identity, past employment history, legal public records, and payroll bank details in 3 effortless steps.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 hover-jump transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#features"
                className="liquid-glass-card px-5 py-3.5 rounded-xl font-bold text-sm text-slate-800 hover:text-blue-700 shadow-xs hover-jump-subtle transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Explore Features</span>
              </a>

              <a
                href="#how-it-works"
                className="liquid-glass-card px-4 py-3.5 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-900 shadow-2xs hover-jump-subtle transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>How It Works</span>
              </a>
            </div>

            {/* Quick Metrics Bar with Liquid Glass Cards */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 w-full max-w-lg">
              <div className="liquid-glass-card p-4 rounded-2xl hover-jump-subtle transition-all">
                <div className="text-2xl sm:text-3xl font-black text-blue-600 font-outfit">3 Steps</div>
                <div className="text-xs text-slate-700 font-bold mt-0.5">Effortless Flow</div>
              </div>
              <div className="liquid-glass-card p-4 rounded-2xl hover-jump-subtle transition-all">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-outfit">Fast</div>
                <div className="text-xs text-slate-700 font-bold mt-0.5">Automated TAT</div>
              </div>
              <div className="liquid-glass-card p-4 rounded-2xl hover-jump-subtle transition-all">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-outfit">100%</div>
                <div className="text-xs text-slate-700 font-bold mt-0.5">Audit-Ready Dossier</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Floating Stage with Interactive Jumping Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative max-w-[430px] mx-auto">
              
              {/* Persona Switcher Tabs */}
              <div className="flex items-center justify-between p-1.5 liquid-glass-card rounded-2xl mb-3 font-mono text-[11px] font-bold">
                {[
                  { id: 'aryan', label: '💼 Corporate / IT' },
                  { id: 'pooja', label: '📦 Logistics / 3PL' },
                  { id: 'rajesh', label: '🏭 Manufacturing' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePersona(p.id);
                      setHeroScanComplete(false);
                      setHeroScanStage('idle');
                    }}
                    className={`flex-1 py-2 px-2 rounded-xl transition-all cursor-pointer ${
                      activePersona === p.id
                        ? 'bg-white text-blue-700 shadow-sm border border-slate-200 font-extrabold scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Glowing Background Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/25 via-cyan-400/20 to-indigo-500/25 rounded-3xl blur-2xl opacity-90 pointer-events-none"></div>
              
              {/* Floating Liquid Glass Badges that jump on hover */}
              <div className="absolute -top-3 -left-4 z-20 liquid-glass-pill font-mono text-[9px] uppercase tracking-wider text-slate-800 font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-float-bob hover-jump cursor-pointer">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% DPDP Act Compliant</span>
              </div>

              <div className="absolute -bottom-3 -right-4 z-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-[9px] uppercase tracking-wider font-extrabold px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 animate-float-bob-rev hover-jump cursor-pointer">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Automated Verification</span>
              </div>

              <div
                ref={heroCardRef}
                onMouseMove={handleMouseMoveHero}
                onMouseLeave={handleMouseLeaveHero}
                style={tiltStyle}
                className="liquid-glass-hero relative rounded-3xl overflow-hidden p-3 transition-all hover-jump-subtle"
              >
                {/* 3D Smart Card Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950 border border-white/40 shadow-inner">
                  <img
                    src={heroPersonas[activePersona].image}
                    alt="JOY TrueProfile 3D Digital Employee Verification Stage"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Animated Laser Scan Beam */}
                  {heroScanning && (
                    <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#06B6D4,0_0_40px_#6366F1] animate-laser-vertical pointer-events-none z-10"></div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200 font-mono text-[9px] uppercase tracking-wider text-slate-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Fingerprint className="w-3 h-3 text-blue-600" />
                    <span>Identity Authenticated</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-blue-50/95 backdrop-blur-md border border-blue-300 font-mono text-[9px] uppercase tracking-wider text-blue-800 font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Zap className="w-3 h-3 text-blue-600" />
                    <span>Verified Profile</span>
                  </div>

                  {/* Candidate Info Overlay at bottom of image */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-3 pt-6 text-white font-sans">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white font-outfit">{heroPersonas[activePersona].name}</h4>
                        <p className="text-[10px] text-slate-300 font-mono">{heroPersonas[activePersona].role}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-500/30 border border-blue-400/40 text-[9px] font-mono text-cyan-300 font-bold">
                          {heroPersonas[activePersona].gateId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Telemetry & Live Verification Stages Footer */}
                <div className="p-3.5 bg-white/80 backdrop-blur-md rounded-2xl mt-2 border border-slate-200/80 flex flex-col gap-2.5 shadow-xs">
                  
                  {/* Verification Pipeline Checks */}
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[9px]">
                    <div className={`p-1.5 rounded-lg border text-center transition-all ${
                      heroScanStage === 'identity' || heroScanComplete ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                      1. Digital ID & Face
                      <span className="block text-[8px] font-extrabold">{heroScanComplete ? '99.98% ✓' : 'Live Match'}</span>
                    </div>

                    <div className={`p-1.5 rounded-lg border text-center transition-all ${
                      heroScanStage === 'experience' || heroScanComplete ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                      2. Work History
                      <span className="block text-[8px] font-extrabold">{heroScanComplete ? '0 Overlaps ✓' : 'Tenure Check'}</span>
                    </div>

                    <div className={`p-1.5 rounded-lg border text-center transition-all ${
                      heroScanStage === 'bank' || heroScanComplete ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold' : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                      3. Bank & Payroll
                      <span className="block text-[8px] font-extrabold">{heroScanComplete ? '100% Match ✓' : 'Name Match'}</span>
                    </div>
                  </div>

                  {/* Cryptographic SHA-256 Checksum */}
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>DIGITAL PROFILE DOSSIER</span>
                    <span className="text-indigo-700 font-bold">SHA-256 CERTIFIED</span>
                  </div>

                  {/* Interactive Biometric Test Button */}
                  <button
                    onClick={triggerHeroBiometricScan}
                    disabled={heroScanning}
                    className="w-full py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover-jump transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer"
                  >
                    {heroScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Verifying Employee Profile ({heroScanProgress}%)...</span>
                      </>
                    ) : heroScanComplete ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Clearance Issued: {heroPersonas[activePersona].statutoryPass} ✓</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-white" />
                        <span>Run Profile Verification Test</span>
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
       * 3. INFINITE VERIFICATION CAPABILITIES TICKER
       * ============================================================================== */}
      <section className="relative z-10 py-5 bg-white border-y border-slate-200 overflow-hidden shadow-2xs">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee font-mono text-xs text-slate-600 tracking-wider uppercase font-semibold">
          <span className="flex items-center gap-2 text-cyan-700"><Fingerprint className="w-4 h-4" /> DIGITAL IDENTITY & OCR DOCUMENT AUTHENTICATION</span>
          <span className="text-slate-300">■</span>
          <span className="flex items-center gap-2 text-emerald-700"><Search className="w-4 h-4" /> PAST EMPLOYMENT & CAREER HISTORY VERIFICATION</span>
          <span className="text-slate-300">■</span>
          <span className="flex items-center gap-2 text-indigo-700"><Zap className="w-4 h-4" /> DUAL-EMPLOYMENT & MOONLIGHTING RADAR</span>
          <span className="text-slate-300">■</span>
          <span className="flex items-center gap-2 text-amber-700"><Scale className="w-4 h-4" /> COMPREHENSIVE LEGAL & PUBLIC RECORD SCREENING</span>
          <span className="text-slate-300">■</span>
          <span className="flex items-center gap-2 text-sky-700"><CreditCard className="w-4 h-4" /> DIRECT BANK ACCOUNT & PAYROLL NAME MATCH</span>
          <span className="text-slate-300">■</span>
          <span className="flex items-center gap-2 text-purple-700"><ShieldCheck className="w-4 h-4" /> ISO 27001 & SOC-2 TYPE II DATA SECURITY</span>
          <span className="text-slate-300">■</span>
          <span className="flex items-center gap-2 text-cyan-700"><Lock className="w-4 h-4" /> 100% DPDP ACT 2023 CONSENT-DRIVEN PRIVACY</span>
        </div>
      </section>

      {/* ==============================================================================
       * NEW: COMPREHENSIVE EMPLOYEE PROFILE VERIFICATION FEATURES (#features)
       * ============================================================================== */}
      <section id="features" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="liquid-glass-pill font-mono text-xs uppercase tracking-wider text-blue-700 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>ALL-IN-ONE VERIFICATION SUITE</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit mb-4 tracking-tight">
            Complete Employee Profile <br className="hidden sm:inline" />
            <span className="text-gradient-electric">
              Verification Features
            </span>
          </h2>
          <p className="text-slate-700 text-base max-w-2xl leading-relaxed font-medium">
            Everything your HR, talent acquisition, and compliance teams need to verify candidates with 100% confidence, zero paperwork, and complete audit readiness.
          </p>
        </div>

        {/* 8 Features Grid with Liquid Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1: Digital Identity */}
          <div className="liquid-glass-card rounded-3xl p-6 shadow-sm hover-jump flex flex-col justify-between gap-4 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                Digital Identity & KYC
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Automated document extraction, biometric facial match, and real-time OCR validation of government identity credentials.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] text-blue-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>99.98% Biometric Match</span>
            </div>
          </div>

          {/* Feature 2: Employment History */}
          <div className="liquid-glass-card rounded-3xl p-6 shadow-sm hover-jump flex flex-col justify-between gap-4 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                Employment & Experience
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Automated past tenure history, organization track records, joining/relieving dates, and experience authentication.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Career Timeline</span>
            </div>
          </div>

          {/* Feature 3: Dual-Employment Radar */}
          <div className="liquid-glass-card rounded-3xl p-6 shadow-sm hover-jump flex flex-col justify-between gap-4 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                Dual-Employment Radar
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Scans active payroll streams and contribution histories to identify undeclared secondary employment and moonlighting risks.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] text-indigo-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Conflict-of-Interest Shield</span>
            </div>
          </div>

          {/* Feature 4: Legal & Court Screening */}
          <div className="liquid-glass-card rounded-3xl p-6 shadow-sm hover-jump flex flex-col justify-between gap-4 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                Legal & Court Records
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Nationwide screening across criminal, civil, and commercial litigation databases and public tribunal registries.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] text-purple-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Pan-India Legal Scan</span>
            </div>
          </div>

          {/* Feature 5: Bank & Payroll Match */}
          <div className="liquid-glass-card rounded-3xl p-6 shadow-sm hover-jump flex flex-col justify-between gap-4 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                Bank & Payroll Validation
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Direct penny-drop verification ensuring bank account validity and exact candidate name match before salary disbursement.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] text-amber-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Zero Payroll Fraud</span>
            </div>
          </div>

          {/* Feature 6: Education Credentials */}
          <div className="liquid-glass-card rounded-3xl p-6 shadow-sm hover-jump flex flex-col justify-between gap-4 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                Academic Credentials
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Verification of academic degrees, marksheets, diplomas, and certifications against accredited institutional repositories.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] text-sky-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Degree Authenticity</span>
            </div>
          </div>

          {/* Feature 7: Address & Geolocation */}
          <div className="liquid-glass-card rounded-3xl p-6 shadow-sm hover-jump flex flex-col justify-between gap-4 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                Address & Geotagging
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Candidate residential address confirmation with digital proof upload and optional GPS location timestamping.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] text-teal-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Digital Proof of Address</span>
            </div>
          </div>

          {/* Feature 8: Tamper-Proof Audit Dossiers */}
          <div className="liquid-glass-card rounded-3xl p-6 shadow-sm hover-jump flex flex-col justify-between gap-4 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-outfit mb-2">
                Audit-Ready Dossiers
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Instant downloadable SHA-256 encrypted verification reports, compliance certificates, and HR audit-ready logs.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 font-mono text-[11px] text-cyan-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>SHA-256 Tamper-Proof</span>
            </div>
          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 4. HOW EASY EMPLOYEE VERIFICATION WORKS IN 3 STEPS (#how-it-works)
       * ============================================================================== */}
      <section id="how-it-works" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="liquid-glass-pill font-mono text-xs uppercase tracking-wider text-blue-700 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>EFFORTLESS 3-STEP PROCESS</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit mb-4 tracking-tight">
            How Employee Profile Verification <br className="hidden sm:inline" />
            <span className="text-gradient-electric">
              Works in 3 Simple Steps
            </span>
          </h2>
          <p className="text-slate-700 text-base max-w-2xl leading-relaxed font-medium">
            Eliminate slow paper onboarding, physical document submission, and manual verification calls. Completely self-serve on any smartphone.
          </p>
        </div>

        {/* 3 Step Interactive Jumping Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connecting Line between steps (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-indigo-300 to-emerald-300 -translate-y-12 z-0 opacity-60"></div>

          {/* Step 1 Card */}
          <div className="liquid-glass-card rounded-3xl p-8 shadow-xl hover-jump flex flex-col justify-between gap-6 relative z-10 group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-outfit text-2xl font-black shadow-xs group-hover:scale-110 transition-transform">
                  01
                </div>
                <span className="liquid-glass-pill font-mono text-[10px] font-bold text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  1-Click Dispatch
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-outfit mb-3">
                Send Magic Link or QR
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                HR inputs the employee's phone number or email, or candidate scans a QR code. An encrypted, passwordless magic link is sent via WhatsApp and SMS immediately.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200/60 font-mono text-xs text-blue-700 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Zero App Downloads Needed</span>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="liquid-glass-card rounded-3xl p-8 shadow-xl hover-jump flex flex-col justify-between gap-6 relative z-10 group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-outfit text-2xl font-black shadow-xs group-hover:scale-110 transition-transform">
                  02
                </div>
                <span className="liquid-glass-pill font-mono text-[10px] font-bold text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  Mobile Self-KYC
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-outfit mb-3">
                Candidate Self-Verifies
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                The employee opens the link on their mobile browser, verifies identity via secure OTP, and captures a quick live selfie with AI liveness detection.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200/60 font-mono text-xs text-emerald-700 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>99.98% Biometric Facial Match</span>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="liquid-glass-card rounded-3xl p-8 shadow-xl hover-jump flex flex-col justify-between gap-6 relative z-10 group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-outfit text-2xl font-black shadow-xs group-hover:scale-110 transition-transform">
                  03
                </div>
                <span className="liquid-glass-pill font-mono text-[10px] font-bold text-indigo-800 px-3 py-1 rounded-full uppercase tracking-wider">
                  Verified Dossier
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-outfit mb-3">
                360° Certified Dossier Ready
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Identity, experience history, public records, and bank account checks are executed automatically. A tamper-proof SHA-256 PDF report is generated seamlessly.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200/60 font-mono text-xs text-indigo-700 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Downloadable Audit PDF & JSON</span>
            </div>
          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 5. ARCHITECTURE & SECURITY CRAFT SECTION (#craft)
       * ============================================================================== */}
      <section id="craft" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Monospace Category Header */}
          <div className="lg:col-span-4">
            <span className="liquid-glass-pill font-mono text-xs uppercase tracking-wider text-blue-700 font-bold inline-block mb-3 px-3 py-1 rounded-full">
              ENTERPRISE ARCHITECTURE & VAULT
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-outfit leading-tight mb-4">
              Enterprise Trust Meets High-Speed Accuracy
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              Whether verifying executive leadership, corporate IT specialists, logistics drivers, or plant workers, JOY TrueProfile provides unified, cryptographic verification built on automated enterprise connectors.
            </p>
            <button
              onClick={() => setShowLegalHandbook(true)}
              className="liquid-glass-card px-5 py-3 rounded-xl text-slate-800 font-mono text-xs uppercase tracking-wider flex items-center gap-3 shadow-sm hover-jump-subtle transition-all font-bold cursor-pointer"
            >
              <span>Compliance Handbook</span>
              <FileText className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

          {/* Right Column: Split Dual Cards with Liquid Glass & 3D Assets */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Automated Verification Pipeline */}
            <div className="liquid-glass-card rounded-3xl p-6 flex flex-col justify-between gap-6 hover-jump shadow-lg">
              <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-white/40 bg-slate-900 shadow-inner">
                <img
                  src="/assets/3d/liquid_glass_flow_3d.jpg"
                  alt="Automated Employee Verification Pipeline"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-700 font-bold block mb-2">
                  STREAMLINED WORKFLOW
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-outfit">
                  Automated Verification Pipeline
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  From 1-click mobile magic link dispatch to candidate selfie KYC and certified audit dossier compilation.
                </p>
              </div>
            </div>

            {/* Card 2: Enterprise Security Vault & Moonlighting Radar */}
            <div className="liquid-glass-card rounded-3xl p-6 flex flex-col justify-between gap-6 hover-jump shadow-lg">
              <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-white/40 bg-slate-900 shadow-inner">
                <img
                  src="/assets/3d/liquid_glass_vault_3d.jpg"
                  alt="Enterprise Security Vault & Moonlighting Radar"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-700 font-bold block mb-2">
                  ENTERPRISE SECURITY & DATA VAULT
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-outfit">
                  Dual-Employment Radar & Legal Screening
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Screening across national judicial databases, past employment history timelines, and direct bank name validation with 256-bit AES encryption.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 5. SYSTEM SPECIFICATIONS & PERFORMANCE MATRIX (#specs)
       * ============================================================================== */}
      <section id="specs" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-700 font-bold mb-3 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>TECHNICAL SPECIFICATIONS & SLA</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-4">
            Engineering Without Compromise
          </h2>
          <p className="text-slate-600 text-sm">
            Every parameter reflects a singular standard: sub-second velocity, zero ghost worker tolerance, and statutory immutability.
          </p>
        </div>

        {/* Spec Category Segmented Control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 font-mono text-xs uppercase tracking-wider">
            {[
              { id: 'performance', label: 'Performance' },
              { id: 'security', label: 'Security & DPDP' },
              { id: 'statutory', label: 'Statutory Law' },
              { id: 'infrastructure', label: 'Infrastructure' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveSpecCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl transition-all font-bold ${
                  activeSpecCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specification Parameters Table (Hairline Grid) */}
        <div className="max-w-4xl mx-auto divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {technicalSpecs[activeSpecCategory].map((spec, idx) => (
            <div key={idx} className="py-4.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 first:pt-0 last:pb-0">
              <dt className="font-mono text-xs uppercase tracking-wider text-slate-600 flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                <span>{spec.label}</span>
              </dt>
              <dd className="text-left sm:text-right">
                <span className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                  {spec.value}
                </span>
                <span className="block font-mono text-[11px] text-slate-500 mt-0.5">
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
      <section id="live-radar" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-700 font-bold mb-3 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-600" />
            <span>REAL-TIME NETWORK ACTIVITY</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-3">
            Live India Workforce Verification Radar
          </h2>
          <p className="text-slate-600 text-sm">
            Monitor real-time biometric verifications and gate pass generation streaming across India's largest industrial manufacturing corridors and logistics hubs.
          </p>
        </div>

        {/* Radar Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          
          {/* Left: Industrial Corridor Selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between font-bold">
              <span>INDUSTRIAL CORRIDORS</span>
              <span className="text-cyan-700 font-semibold">● 5 HUBS ONLINE</span>
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
                      ? 'bg-cyan-50 border-cyan-500 text-slate-900 shadow-md ring-1 ring-cyan-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-600 animate-ping' : 'bg-slate-400'}`}></span>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-slate-900">{hub.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{hub.state} • {hub.tag}</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2 py-1 rounded border border-cyan-200">
                    {hub.avgTat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Telemetry Event Stream Display */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-white shadow-lg">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                  {radarCities[activeRadarCity].state}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 font-outfit">
                  {radarCities[activeRadarCity].name}
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>TELEMETRY ACTIVE</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">Daily Active Passes</span>
                <div className="text-lg font-bold text-white mt-1 font-outfit">
                  {radarCities[activeRadarCity].activePasses.split(' ')[0]} <span className="text-xs font-normal text-slate-400">Active</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">Average Latency</span>
                <div className="text-lg font-bold text-cyan-400 mt-1 font-outfit">
                  {radarCities[activeRadarCity].avgTat}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">Accuracy Score</span>
                <div className="text-lg font-bold text-emerald-400 mt-1 font-outfit">
                  {radarCities[activeRadarCity].accuracy}
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-2 flex items-center justify-between font-bold">
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
      <section id="interactive-lab" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-700 font-bold mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE SIMULATOR STUDIO</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-3">
            Experience the Verification Engine Live
          </h2>
          <p className="text-slate-600 text-sm">
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
                    ? 'bg-cyan-50 border-cyan-500 text-slate-900 shadow-md ring-1 ring-cyan-400'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-700 font-bold">
                    {isSelected ? 'ACTIVE' : 'READY'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-outfit">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.category}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Simulation Console */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          
          {/* Top Console Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-600 animate-ping"></div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold block">SIMULATION TARGET</span>
                <h3 className="text-lg font-bold text-slate-900 font-outfit">
                  {simModes[selectedSimMode].candidate.name} — <span className="text-cyan-700">{simModes[selectedSimMode].candidate.role}</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJsonPayload(!showJsonPayload)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-mono text-xs flex items-center gap-1.5 transition-colors font-bold"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-600" />
                <span>{showJsonPayload ? 'View Visual Checks' : 'Inspect JSON Payload'}</span>
              </button>

              <button
                onClick={() => handleRunSimulation(selectedSimMode)}
                disabled={simulating}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold font-mono text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Running...' : 'Re-Run Pipeline'}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar when Simulating */}
          {simulating && (
            <div className="mb-6">
              <div className="flex items-center justify-between font-mono text-xs text-cyan-700 font-bold mb-1.5">
                <span>EXECUTING CRYPTOGRAPHIC PIPELINE CHECKS...</span>
                <span>{simProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-indigo-600 transition-all duration-100"
                  style={{ width: `${simProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Main Visual or JSON Output */}
          {showJsonPayload ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
              <pre>{JSON.stringify(simModes[selectedSimMode].json, null, 2)}</pre>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simModes[selectedSimMode].checks.map((check, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{check.title}</h5>
                      <span className="font-mono text-xs text-emerald-700 font-semibold block mt-0.5">{check.status}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 shrink-0 shadow-2xs font-semibold">
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
      <section id="roi-calculator" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-blue-700 font-bold mb-3 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>ENTERPRISE VALUE & STATUTORY ROI ENGINE</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-3">
            Calculate Your Plant & Enterprise Savings
          </h2>
          <p className="text-slate-600 text-sm">
            Discover how much your enterprise saves by replacing slow manual background verification with instant cryptographic checks and automated CLRA Form XVI passes.
          </p>
        </div>

        {/* ROI Calculator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          
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
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs ring-1 ring-blue-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
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
                <span className="font-mono text-base sm:text-lg font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
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
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 border border-slate-300"
              />
              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[10px] font-mono text-slate-400 font-bold mr-1">PRESETS:</span>
                {[250, 500, 1000, 2500, 5000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMonthlyHires(preset)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-colors ${
                      monthlyHires === preset ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
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
                <span className="font-mono text-base font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
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
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-slate-300"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-400 font-semibold mt-1">
                <span>5% (Low Churn)</span>
                <span>25% (Industry Avg)</span>
                <span>60% (High Churn)</span>
              </div>
            </div>

            {/* Benchmark Note */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 font-mono text-xs text-slate-700 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Statutory Benchmark: ₹1,800/person agency manual BGV vs ₹250/person JOY TrueProfile sub-45s automated verification.
              </span>
            </div>

          </div>

          {/* Savings Output Right Column */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-2xl">
            
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                TOTAL ESTIMATED ANNUAL VALUE CREATED
              </span>
              <div className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight">
                ₹{((totalMonthlySavings * 12) + Math.round(monthlyHires * 12 * 4500 * 0.04)).toLocaleString('en-IN')}
                <span className="text-xs sm:text-sm font-normal text-slate-400 ml-2">/ year</span>
              </div>
              <div className="text-xs font-mono text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payback Period: Under 12 Business Days</span>
              </div>
            </div>

            {/* 4 KPI Grid */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Direct Verification Savings</span>
                <div className="text-lg font-bold text-cyan-300 font-outfit mt-0.5">
                  ₹{(totalMonthlySavings * 12).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ yr</span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ghost Payroll Blocked</span>
                <div className="text-lg font-bold text-fuchsia-300 font-outfit mt-0.5">
                  ~{ghostWorkerPrevented * 12} workers
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">HR TAT Hours Saved</span>
                <div className="text-lg font-bold text-emerald-300 font-outfit mt-0.5">
                  {(hoursSavedPerMonth * 12).toLocaleString()} hrs / yr
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold block">CLRA Penalty Risk Reduction</span>
                <div className="text-lg font-bold text-amber-300 font-outfit mt-0.5">
                  100% Protected
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowDemoModal(true)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <span>Unlock These Savings</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
                  alert(`✅ Executive ROI Business Case generated for ${monthlyHires.toLocaleString()} monthly hires! Estimated Annual Savings: ₹${((totalMonthlySavings * 12) + Math.round(monthlyHires * 12 * 4500 * 0.04)).toLocaleString('en-IN')}`);
                }}
                className="py-3.5 px-4 rounded-xl font-bold text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export ROI Summary</span>
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 9. COMPREHENSIVE SOLUTIONS BENTO GRID (#solutions)
       * ============================================================================== */}
      <section id="solutions" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-blue-700 font-bold mb-3 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            <span>ENTERPRISE SOLUTIONS</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-3">
            Architected for High-Trust Organizations
          </h2>
          <p className="text-slate-600 text-sm">
            Whether managing thousands of plant and logistics personnel or screening executive leadership, JOY TrueProfile provides unified, audit-ready profile verification.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Seamless Mobile Flow */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-blue-400 hover-jump shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Seamless Mobile Flow
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Zero app installs required. Candidates complete digital identity check, live selfie liveness verification, and consent via a simple, encrypted magic link.
              </p>
            </div>
            <div className="font-mono text-xs text-blue-700 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>98% Candidate Completion Rate</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Workplace & Gate Access Passes */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-emerald-400 hover-jump shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Workforce Digital Gate Passes
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Automated workforce compliance and digital credential issuance. Generates QR passes that seamlessly integrate with security turnstiles and scanners.
              </p>
            </div>
            <div className="font-mono text-xs text-emerald-700 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>Sub-Second Gate Turnstile Response</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Dual-Employment Radar */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-indigo-400 hover-jump shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-5">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Dual-Employment & Moonlighting Radar
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Extracts career service records and active contribution streams to detect undeclared secondary employment, overlapping tenures, and integrity risks.
              </p>
            </div>
            <div className="font-mono text-xs text-indigo-700 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>Zero-Tamper Work History Audit</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: National Legal & Litigation Screening */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-purple-400 hover-jump shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-5">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                National Legal Records Screening
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Comprehensive criminal and civil court records search across national judicial registries, commercial tribunals, and public registries in real time.
              </p>
            </div>
            <div className="font-mono text-xs text-purple-700 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>Fuzzy Match & Father Name Cross-Check</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Bank & Payroll Match */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-amber-400 hover-jump shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Direct Bank & Payroll Validation
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Performs automated penny-drop validation to verify bank account active status and confirm exact account holder name before wage disbursement.
              </p>
            </div>
            <div className="font-mono text-xs text-amber-700 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>Eliminates Failed Salary Transfers</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Audit-Ready Dossier Reports */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-sky-400 hover-jump shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit mb-2">
                Audit-Ready Profile Dossiers
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Instantly compiles downloadable PDF audit reports stamped with cryptographic SHA-256 verification hashes, fully compliant with DPDP Act 2023.
              </p>
            </div>
            <div className="font-mono text-xs text-sky-700 font-bold flex items-center gap-1.5 pt-3 border-t border-slate-100">
              <span>DPDP Act 2023 Masked & Certified</span>
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </section>

      {/* ==============================================================================
       * 10. CLIENT REVIEWS & VERIFIED TESTIMONIALS (#reviews)
       * ============================================================================== */}
      <section id="reviews" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-700 font-bold mb-3 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 fill-cyan-600 text-cyan-600" />
            <span>ENTERPRISE TRUST & PROVEN IMPACT</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-3">
            Trusted by India's Industrial & Corporate Leaders
          </h2>
          <p className="text-slate-600 text-sm">
            Read how manufacturing giants, logistics fleets, and top enterprises transform contractor onboarding and background verification.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {clientReviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-slate-300 hover:shadow-md transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-200 font-bold">
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
                  <p className="text-[11px] text-cyan-700 font-mono font-bold mt-0.5">{rev.company}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review CTA Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="font-bold text-slate-900 text-base font-outfit">Are you an active JOY TrueProfile enterprise partner?</h4>
            <p className="text-slate-600 text-xs mt-0.5">Share your verification turnaround and ghost worker eradication experience with the community.</p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors font-bold shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
            <span>Submit Client Review</span>
          </button>
        </div>

      </section>

      {/* ==============================================================================
       * 11. KNOWLEDGE HUB & COMPLIANCE ARTICLES (#knowledge-hub)
       * ============================================================================== */}
      <section id="knowledge-hub" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-700 font-bold mb-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>STATUTORY INTELLIGENCE & INSIGHTS</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-3">
            Knowledge Hub & Compliance Guides
          </h2>
          <p className="text-slate-600 text-sm">
            Expert resources on Indian labor laws, DPDP Act 2023 compliance, contractor audit blueprints, and UAN moonlighting detection.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(publicArticles.length > 0 ? publicArticles.slice(0, 3) : fallbackArticles).map((art, idx) => (
            <div
              key={art.id || idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-cyan-400 hover:shadow-md transition-all shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mb-3 font-semibold">
                  <span className="text-cyan-700 uppercase tracking-wider">{art.category || 'Compliance'}</span>
                  <span>{art.readTime || '4 min read'}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-outfit group-hover:text-cyan-700 transition-colors mb-2.5">
                  {art.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {art.excerpt || art.summary || 'Essential technical blueprint for enterprise compliance and background verification architecture.'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs font-mono text-cyan-700 font-bold">
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
      <section id="faq" className="scroll-mt-24 relative z-10 py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-200">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-700 font-bold mb-3 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CLARITY & ASSURANCE</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
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
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 font-outfit flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-cyan-600 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
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
        <div className="relative rounded-3xl overflow-hidden border border-blue-200 bg-gradient-to-br from-indigo-50/70 via-sky-50/60 to-blue-50/70 p-8 sm:p-14 text-center shadow-xl">
          
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 mb-6 shadow-xs">
              <Zap className="w-7 h-7" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-outfit tracking-tight mb-4">
              Ready to Streamline Your Employee <br className="hidden sm:inline" />
              Profile Verification?
            </h2>

            <p className="text-slate-600 text-base max-w-xl mb-8">
              Join leading Indian enterprises, fast-growing tech companies, and nationwide supply chains automating employee profile verification and eliminating onboarding delays today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book Live Enterprise Walkthrough</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setLandingSelectedAmount(5000);
                  setShowLandingRazorpayModal(true);
                }}
                className="px-7 py-4 rounded-xl font-bold text-sm text-slate-800 bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Get Verification Credits</span>
              </button>
            </div>

            {/* Compliance Guarantee Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 font-mono text-[11px] text-slate-600 font-bold">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 100% DPDP Act 2023 Compliant</span>
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-emerald-600" /> Audit-Ready Compliance Reports</span>
              <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-indigo-600" /> 256-Bit AES Cryptography</span>
            </div>
          </div>

        </div>
      </section>

      {/* ==============================================================================
       * 14. FOOTER
       * ============================================================================== */}
      <footer className="relative z-10 py-12 bg-white border-t border-slate-200 px-4 sm:px-8 font-mono text-xs text-slate-600 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 flex items-center justify-center text-white shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 font-outfit text-sm">JOY TrueProfile</span>
              <p className="text-[10px] text-slate-500 font-medium">Intelligent Employee Profile Verification Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold">
            <a href="#features" className="hover:text-blue-700 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-700 transition-colors">How It Works</a>
            <a href="#solutions" className="hover:text-blue-700 transition-colors">Solutions</a>
            <a href="#craft" className="hover:text-blue-700 transition-colors">Architecture</a>
            <a href="#specs" className="hover:text-blue-700 transition-colors">Specifications</a>
            <a href="#interactive-lab" className="hover:text-blue-700 transition-colors">Simulator</a>
            <a href="#live-radar" className="hover:text-blue-700 transition-colors">India Radar</a>
            <a href="#roi-calculator" className="hover:text-blue-700 transition-colors">ROI Calculator</a>
            <a href="#reviews" className="hover:text-blue-700 transition-colors">Reviews</a>
            <a href="#knowledge-hub" className="hover:text-blue-700 transition-colors">Knowledge Hub</a>
            <a href="#faq" className="hover:text-blue-700 transition-colors">FAQ</a>
          </div>

          <div className="text-right text-[10px] text-slate-500 font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mb-4 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Demo Request Received!</h3>
                <p className="text-slate-600 text-sm max-w-sm mb-6">
                  Our enterprise solutions team will contact you within 15 minutes to schedule your live walkthrough and configure test verification credits.
                </p>
                <button
                  onClick={() => { setDemoSubmitted(false); setShowDemoModal(false); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>ENTERPRISE WALKTHROUGH</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">
                  Schedule a Custom Live Demo
                </h3>
                <p className="text-slate-600 text-xs mb-6">
                  Experience sub-second verification configured specifically for your plant turnstiles or corporate BGV pipeline.
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Company / Plant Name *</label>
                    <input
                      type="text"
                      required
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      placeholder="e.g. Apex Auto Manufacturing Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Monthly Hires / Passes</label>
                      <select
                        value={demoForm.hires}
                        onChange={(e) => setDemoForm({ ...demoForm, hires: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
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
                    className="w-full mt-3 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mb-4 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">Review Submitted!</h3>
                <p className="text-slate-600 text-sm max-w-sm mb-6">
                  Thank you for your feedback. Your verified client review will be published to the community wall upon moderation.
                </p>
                <button
                  onClick={() => { setReviewSubmitted(false); setShowReviewModal(false); }}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-cyan-600 hover:bg-cyan-700 transition-colors shadow-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 font-bold mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>CLIENT COMMUNITY WALL</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">
                  Submit Verified Enterprise Review
                </h3>
                <p className="text-slate-600 text-xs mb-6">
                  Share your experience with JOY TrueProfile turnaround velocity, Form XVI compliance, and ghost worker prevention.
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Company / Plant Name *</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.company}
                        onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                        placeholder="e.g. Nexus 3PL Corp"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Rating (1 to 5 Stars)</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-500 focus:bg-white"
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
                      placeholder="Describe how JOY TrueProfile accelerated your turnaround time or eliminated ghost worker fraud..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full mt-2 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-cyan-600 hover:bg-cyan-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
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

      {/* ==============================================================================
       * 11. FLOATING LIQUID GLASS WHATSAPP MESSAGING WIDGET
       * ============================================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Expandable Liquid Glass Quick Chat Panel */}
        {whatsappOpen && (
          <div className="mb-3 w-96 max-w-[calc(100vw-2rem)] liquid-glass-card rounded-3xl p-0 overflow-hidden shadow-2xl border border-white/60 animate-in fade-in slide-in-from-bottom-5 duration-200">
            {/* WhatsApp Header */}
            <div className="bg-gradient-to-r from-[#128C7E] via-[#25D366] to-[#075E54] p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-[#128C7E] rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-outfit">JOY Verification Team</h4>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-100 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
                    <span>Online | Instant Response</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setWhatsappOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-slate-50/70 backdrop-blur-md flex flex-col gap-3">
              {/* Specialist Message Bubble */}
              <div className="p-3.5 bg-white rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-xs text-xs text-slate-800 leading-relaxed">
                <p className="font-semibold mb-1 text-slate-900">👋 Welcome to JOY TrueProfile!</p>
                <p className="text-slate-600">
                  How can our verification specialists assist you today? Tap a quick option or type your message below to chat on WhatsApp.
                </p>
                <span className="block font-mono text-[9px] text-slate-400 text-right mt-1.5">Just now</span>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  Quick Inquiries
                </span>
                {[
                  '🚀 I want to verify employee profiles for my company',
                  '📅 Book a live 1-on-1 enterprise walkthrough',
                  '💰 Request custom volume pricing',
                  '🔒 Ask about security & DPDP compliance'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendWhatsApp(chip)}
                    className="text-left text-xs font-semibold px-3 py-2 rounded-xl bg-white/90 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                  >
                    <span className="truncate pr-2">{chip}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                ))}
              </div>

              {/* Custom Message Box */}
              <div className="pt-2 border-t border-slate-200/80">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendWhatsApp();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={whatsappMsg}
                    onChange={(e) => setWhatsappMsg(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="Send to WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>

            {/* Panel Footer */}
            <div className="px-4 py-2.5 bg-slate-100/80 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <Lock className="w-3 h-3" /> End-to-end encrypted
              </span>
              <button
                onClick={() => handleSendWhatsApp()}
                className="font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Direct WhatsApp</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        )}

        {/* Floating WhatsApp Toggle Button */}
        <button
          onClick={() => setWhatsappOpen(!whatsappOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer z-50 border border-white/40"
          aria-label="Toggle WhatsApp Contact"
        >
          {/* Animated WhatsApp Ping Halo */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>

          {/* WhatsApp SVG Icon */}
          <div className="w-6 h-6 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.405" />
            </svg>
          </div>

          <span className="font-outfit text-xs font-bold tracking-wide">
            {whatsappOpen ? 'Close Chat' : 'Chat on WhatsApp'}
          </span>

          {/* Online status indicator */}
          <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse"></span>
        </button>
      </div>

    </div>
  );
};

export default LandingPageView;

