import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  DollarSign, 
  Volume2, 
  VolumeX, 
  Compass, 
  FileSpreadsheet, 
  Mail, 
  UserPlus, 
  Share2,
  Scan
} from 'lucide-react';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
import BespokeWorkforceMatrixHero from '../components/landing/BespokeWorkforceMatrixHero';
import CinematicVerificationStoryboard from '../components/landing/CinematicVerificationStoryboard';
import QuantumWorkforceMesh from '../components/landing/QuantumWorkforceMesh';
import EditorialBentoArchitecture from '../components/landing/EditorialBentoArchitecture';
import CryptographicVaultPillars from '../components/landing/CryptographicVaultPillars';
import DualEmploymentRadarVisualizer from '../components/landing/DualEmploymentRadarVisualizer';
import TurnstileGateSimulator from '../components/landing/TurnstileGateSimulator';
import InteractiveSpeedComparison from '../components/landing/InteractiveSpeedComparison';
import VerificationCommandOrbit from '../components/landing/VerificationCommandOrbit';
import LiveVideoSimulationShowcase from '../components/landing/LiveVideoSimulationShowcase';
import LandingPagePreloader from '../components/landing/LandingPagePreloader';
import WhatsAppConcierge3D from '../components/landing/WhatsAppConcierge3D';
import { soundEngine } from '../utils/uiSoundEffects';
import { checkNetworkBeforeAction } from '../utils/networkChecker';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { useApp, DEFAULT_LANDING_PAGE_CONTENT } from '../context/AppContext';

export const LandingPageView = () => {
  const navigate = useNavigate();
  const { platformLogoEmblem, landingPageContent } = useApp() || {};
  const content = {
    ...DEFAULT_LANDING_PAGE_CONTENT,
    ...(landingPageContent || {})
  };

  // Innovative Holographic Logo Preloader (Preserved strictly untouched)
  const [showPreloader, setShowPreloader] = useState(true);

  // Active View Tab State (Unified Tab Switcher)
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tabId) => {
    soundEngine.playClick();
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

  // Technical Specs Category State
  const [activeSpecCategory, setActiveSpecCategory] = useState('performance');

  // Live India Radar State
  const [activeRadarCity, setActiveRadarCity] = useState('sriperumbudur');

  // ROI Calculator State
  const [monthlyHires, setMonthlyHires] = useState(500);
  const [workforceType, setWorkforceType] = useState('mixed');
  const [contractorTurnover, setContractorTurnover] = useState(25);

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

  // Simulator State
  const [selectedSimMode, setSelectedSimMode] = useState('labor_pass');
  const [simulating, setSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(100);

  // Trigger Live Simulation
  const handleRunSimulation = (modeKey) => {
    soundEngine.playScan();
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
        soundEngine.playSuccess();
      }
    }, 100);
  };

  // Demo Submit Handler
  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    if (!checkNetworkBeforeAction('Book Enterprise Demo')) return;
    setDemoLoading(true);
    try {
      await api.submitDemoRequest(demoForm);
      setDemoSubmitted(true);
      soundEngine.playSuccess();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    } catch {
      setDemoSubmitted(true);
      soundEngine.playSuccess();
    } finally {
      setDemoLoading(false);
    }
  };

  // Review Submit Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!checkNetworkBeforeAction('Submit Client Review')) return;
    setReviewLoading(true);
    try {
      await api.submitReview(reviewForm);
      setReviewSubmitted(true);
      soundEngine.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    } catch {
      setReviewSubmitted(true);
      soundEngine.playSuccess();
    } finally {
      setReviewLoading(false);
    }
  };

  // Technical Specs Data
  const technicalSpecs = {
    performance: [
      { label: 'Verification Latency', value: 'Under 45 Seconds', detail: 'Instant parallel automated queries across UIDAI, NSDL, NPCI, EPFO & e-Courts' },
      { label: 'Biometric Face Match', value: '99.98% Precision', detail: '3D anti-spoofing camera liveness eliminates duplicate and synthetic profiles' },
      { label: 'Candidate Experience', value: 'Under 2 Minutes', detail: 'Zero app download web magic link with 4-digit PIN security authorization' },
      { label: 'Platform Capacity', value: '50,000+ Checks / Day', detail: 'Cloud-native microservices architecture built for high-volume enterprise hiring' },
      { label: 'Service Reliability', value: '99.99% Uptime SLA', detail: 'Sovereign Indian data center infrastructure with round-the-clock telemetry' }
    ],
    security: [
      { label: 'Cryptographic Standard', value: 'Bank-Grade 256-Bit AES', detail: 'Encrypted in transit (TLS 1.3) and encrypted at rest (AES-256 GCM)' },
      { label: 'DPDP Act 2023 Law', value: '100% Consent Architecture', detail: 'Explicit candidate OTP consent recorded in permanent immutable audit logs' },
      { label: 'Aadhaar Redaction', value: 'Automated Data Masking', detail: 'Zero unredacted storage of national identity numbers across all databases' },
      { label: 'Enterprise Audits', value: 'ISO 27001 & SOC-2', detail: 'Independently audited enterprise cloud controls and security policies' },
      { label: 'Certified PDF Dossiers', value: 'Tamper-Proof Seals', detail: 'Cryptographic SHA-256 hash signatures and verifiable digital timestamps' }
    ],
    statutory: [
      { label: 'Workforce Gate Passes', value: 'Scannable Digital QR', detail: 'Sub-second access clearance for industrial turnstiles and security guards' },
      { label: 'CLRA Form XVI Muster', value: 'Always Audit-Ready', detail: 'Permanent statutory compliance muster roll and contractor labor ledger' },
      { label: 'EPFO Moonlighting Audit', value: 'Full Career Timeline', detail: 'Detects active secondary provident fund employer contributions' },
      { label: 'Bank Penny Drop (IMPS)', value: 'Instant ₹1 Account Check', detail: 'Direct NPCI validation confirms beneficiary account name 100%' },
      { label: 'Court Record Scope', value: '3,500+ Pan-India Courts', detail: 'Civil, criminal, and commercial tribunal queries with fuzzy matching' }
    ],
    infrastructure: [
      { label: 'Cloud Architecture', value: 'Indian Sovereign Cloud', detail: 'High-speed edge nodes with sub-200ms API response latency' },
      { label: 'Multi-Tenant Portals', value: '4 Dedicated Workstations', detail: 'Super Admin, Company Admin, HR Recruiter, and Candidate Mobile' },
      { label: 'Candidate Dispatch', value: 'Multi-Channel Rails', detail: 'Automated 1-click delivery via WhatsApp, SMS, and Email' },
      { label: 'Commercial Model', value: '100% Postpaid & Metered', detail: 'Pay-per-check with official automated Razorpay GST tax invoices' },
      { label: 'Report Delivery', value: 'Instant PDF & Web Dossier', detail: 'Certified downloadable dossier generated immediately upon completion' }
    ]
  };

  // Live India Radar Hub Data
  const radarCities = {
    sriperumbudur: {
      name: 'Chennai / Sriperumbudur Hub',
      state: 'Tamil Nadu',
      tag: 'Automotive & Manufacturing Hub',
      activePasses: '14,820 Passes Generated',
      avgTat: '0.8 Seconds',
      accuracy: '99.98%',
      recentEvent: '120 factory technicians verified with digital access passes in under 2 minutes.',
      topCheck: 'Identity & Photo Match'
    },
    sanand: {
      name: 'Gujarat / Sanand Mega Zone',
      state: 'Gujarat',
      tag: 'EV, Auto & Engineering',
      activePasses: '18,450 Workers Checked',
      avgTat: '0.9 Seconds',
      accuracy: '99.96%',
      recentEvent: 'Battery plant contractor batch completed with bank account name verification.',
      topCheck: 'Bank Account & Name Match'
    },
    bhiwandi: {
      name: 'Mumbai / Bhiwandi Cluster',
      state: 'Maharashtra',
      tag: 'Logistics & Warehousing Hub',
      activePasses: '32,100 Delivery Associates',
      avgTat: '1.1 Seconds',
      accuracy: '99.94%',
      recentEvent: '500 delivery drivers verified via mobile verification link in 35 minutes.',
      topCheck: 'Driving License & ID Check'
    },
    manesar: {
      name: 'Gurugram / Manesar Belt',
      state: 'Haryana',
      tag: 'Manufacturing & Component Plants',
      activePasses: '22,700 Active Badges',
      avgTat: '0.7 Seconds',
      accuracy: '99.99%',
      recentEvent: 'Duplicate profile check passed with zero duplicate records.',
      topCheck: 'Duplicate Profile Check'
    },
    hosur: {
      name: 'Hosur / Bengaluru Tech Belt',
      state: 'Karnataka / TN',
      tag: 'EV & Tech Hardware Hub',
      activePasses: '16,300 Shift Passes',
      avgTat: '0.85 Seconds',
      accuracy: '99.97%',
      recentEvent: 'Contractor worker records checked against past employment history.',
      topCheck: 'Past Job & Employment Check'
    },
    chakan: {
      name: 'Pune / Chakan Hub',
      state: 'Maharashtra',
      tag: 'Engineering & Industrial Zone',
      activePasses: '24,600 Active Badges',
      avgTat: '0.75 Seconds',
      accuracy: '99.98%',
      recentEvent: 'Major auto plant completed worker verification across 850 workers.',
      topCheck: 'ID & Document Checks'
    }
  };

  // Simulator Data
  const simModes = {
    labor_pass: {
      id: 'labor_pass',
      title: 'Factory & Plant Worker Check',
      category: 'Manufacturing & Industrial',
      icon: HardHat,
      candidate: { name: 'Karan Sharma', role: 'Assembly Line Specialist', contractor: 'Apex Manpower Services' },
      checks: [
        { title: 'Digital ID & Address Check', status: 'Verified ✓', time: '0.7s' },
        { title: 'Photo & Duplicate Profile Check', status: '0 Duplicates ✓', time: '0.4s' },
        { title: 'Digital Gate Pass Issued', status: 'Pass #7821 Ready ✓', time: '0.6s' },
        { title: 'Bank Account Name Match', status: 'Bank Match 100% ✓', time: '1.1s' }
      ]
    },
    dual_employment: {
      id: 'dual_employment',
      title: 'Past Job & Moonlighting Check',
      category: 'Corporate & Tech Roles',
      icon: Search,
      candidate: { name: 'Pooja Narang', role: 'Senior Software Engineer', contractor: 'Direct Enterprise Hire' },
      checks: [
        { title: 'Past Company Records Check', status: '4 Company Records Found ✓', time: '1.2s' },
        { title: 'Job Overlap Check (Moonlighting)', status: '0 Overlaps (Clean) ✓', time: '0.8s' },
        { title: 'Relieving Date Confirmation', status: 'Clean Exit Verified ✓', time: '0.9s' },
        { title: 'Income & Salary Stream Check', status: 'Single Salary Stream ✓', time: '1.4s' }
      ]
    },
    court_bgv: {
      id: 'court_bgv',
      title: 'Background & Court Check',
      category: 'High-Trust Roles',
      icon: Scale,
      candidate: { name: 'Vikramaditya Sengupta', role: 'VP Operations & Supply Chain', contractor: 'Leadership Executive' },
      checks: [
        { title: 'Court Record Check (Civil & Criminal)', status: '0 Cases Found (Clean) ✓', time: '1.8s' },
        { title: 'Financial & Default Check', status: 'Clean Record (No Defaults) ✓', time: '1.5s' },
        { title: 'College Degree Verification', status: 'IIT Delhi Verified ✓', time: '1.9s' },
        { title: 'Company Directorship Check', status: 'Active Clean Status ✓', time: '1.1s' }
      ]
    },
    whatsapp_kyc: {
      id: 'whatsapp_kyc',
      title: 'Mobile Verification Link',
      category: 'Quick Onboarding',
      icon: Smartphone,
      candidate: { name: 'Rahul Deshmukh', role: 'Logistics Fleet Driver', contractor: 'Direct Mobile Flow' },
      checks: [
        { title: 'Link Sent via WhatsApp / SMS', status: 'Link Delivered ✓', time: '0.3s' },
        { title: 'Candidate Aadhaar OTP Check', status: 'Verified in 22s ✓', time: '0.6s' },
        { title: 'Live Selfie Photo Match', status: 'Photo Matched 99.4% ✓', time: '1.2s' },
        { title: 'Verification Report Created', status: 'Report Ready (PDF) ✓', time: '0.8s' }
      ]
    }
  };

  // ROI Calculations
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
      q: 'How does JOY TRUE PROFILE achieve sub-45-second verification speeds?',
      a: 'JOY TRUE PROFILE connects directly to official verification rails including UIDAI OTP for Aadhaar, NSDL for PAN, NPCI for Bank Penny Drops, and EPFO for employment history. All checks execute in parallel using high-speed cloud microservices, delivering certified results in under 45 seconds.'
    },
    {
      q: 'How does the platform detect moonlighting and dual employment?',
      a: 'The platform performs a real-time audit of active provident fund contributions under the candidate’s EPFO UAN. It automatically identifies overlapping employment tenures, checks Form 26AS tax records, and flags secondary undeclared jobs before offer letters are issued.'
    },
    {
      q: 'How is candidate privacy protected under the Digital Personal Data Protection (DPDP) Act 2023?',
      a: 'All verifications are strictly consent-driven. Candidates grant explicit OTP-based authorization before checks begin. Sensitive identifiers like Aadhaar numbers are automatically masked, data in transit and at rest is secured with 256-bit AES encryption, and immutable audit logs ensure complete statutory compliance.'
    },
    {
      q: 'Can JOY TRUE PROFILE generate digital gate passes for factory turnstiles?',
      a: 'Yes. Upon successful verification, the engine automatically issues a scannable digital QR gate pass. Security personnel or automated turnstiles can scan the badge in under 0.5 seconds, ensuring compliance with CLRA Form XVI statutory labor regulations.'
    },
    {
      q: 'How does the 100% Postpaid billing model work?',
      a: 'Enterprises are never blocked during critical recruitment surges. You verify candidate profiles on demand and settle monthly based on actual checks consumed. Official GST tax invoices are generated automatically with itemized transaction ledgers.'
    },
    {
      q: 'Do candidates need to install any mobile application?',
      a: 'No application install is required. Candidates receive a secure, PIN-protected magic link via WhatsApp, SMS, or Email. The mobile web experience runs smoothly in any mobile browser and completes in under 2 minutes.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* 1. Innovative First-Load Holographic Preloader (Strictly preserved untouched) */}
      {showPreloader && (
        <LandingPagePreloader onFinish={() => setShowPreloader(false)} />
      )}

      {/* 2. Top Database-Driven Announcement Banner */}
      {content.showAnnouncement && content.announcementText && (
        <div className="w-full bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 py-2 px-3 sm:px-6 text-center text-xs font-mono font-semibold text-amber-200 relative z-50 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider shrink-0 border border-amber-500/30">
            📢 UPDATE
          </span>
          <span className="truncate max-w-4xl text-[11px] sm:text-xs text-amber-100">{content.announcementText}</span>
        </div>
      )}

      {/* 3. Top Kinetic Marquee Ticker */}
      <div className="w-full bg-[#060A14] border-b border-slate-800/80 py-2.5 overflow-hidden text-xs font-mono font-bold text-slate-300 relative z-50 shadow-sm">
        <div className="flex animate-marquee whitespace-nowrap gap-8 items-center">
          {[...Array(2)].map((_, mIdx) => (
            <React.Fragment key={mIdx}>
              <span className="inline-flex items-center gap-2 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> e-KYC UIDAI Aadhaar Verification (100% Authentic)
              </span>
              <span className="text-slate-600">✦</span>
              <span className="inline-flex items-center gap-2 text-emerald-400">
                <Zap className="w-3.5 h-3.5" /> 3D AI Biometric Face Liveness Camera Scan
              </span>
              <span className="text-slate-600">✦</span>
              <span className="inline-flex items-center gap-2 text-cyan-400">
                <Mail className="w-3.5 h-3.5" /> Multi-Channel Magic Link Dispatcher (WhatsApp / SMS / Email)
              </span>
              <span className="text-slate-600">✦</span>
              <span className="inline-flex items-center gap-2 text-purple-400">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel Bulk Import Engine (500+ Hires in 10s)
              </span>
              <span className="text-slate-600">✦</span>
              <span className="inline-flex items-center gap-2 text-emerald-400">
                <CreditCard className="w-3.5 h-3.5" /> Razorpay GST Auto-Invoicing & Prepaid Metered Credits
              </span>
              <span className="text-slate-600">✦</span>
              <span className="inline-flex items-center gap-2 text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" /> DPDP Act 2023 Statutory Compliance & Encrypted Vault
              </span>
              <span className="text-slate-600">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4. Ultra-Thin Glassmorphic Cyber Header */}
      <header className="sticky top-0 z-50 w-full bg-[#050811]/90 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button onClick={() => handleTabChange('overview')} className="flex items-center gap-3 shrink-0 group text-left cursor-pointer border-none bg-transparent">
            <div className="relative shrink-0">
              <img 
                src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                alt="JOY TRUE PROFILE Logo" 
                className="w-11 h-11 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#050811] animate-pulse" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <div className="flex items-center gap-2 whitespace-nowrap leading-none">
                <span className="text-xl sm:text-2xl font-black text-white font-outfit tracking-tighter">JOY</span>
                <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 font-outfit tracking-tighter">TRUE PROFILE</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold whitespace-nowrap mt-1">
                Zero-Trust Verification Engine
              </span>
            </div>
          </button>

          {/* Center Navigation: Segmented Cyber Pill Switcher */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner backdrop-blur-xl">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'features', label: 'Capabilities' },
              { id: 'moonlighting', label: 'Moonlighting Radar' },
              { id: 'turnstile', label: 'Turnstile Gate' },
              { id: 'comparison', label: 'Speed Matrix' },
              { id: 'roi', label: 'ROI Engine' },
              { id: 'solutions', label: 'Architecture' },
              { id: 'resources', label: 'Specs & FAQ' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-[1.03]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
              title={soundMuted ? "Unmute Audio Effects" : "Mute Audio Effects"}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Tour Guide Modal Trigger */}
            <button
              onClick={() => {
                soundEngine.playClick();
                window.dispatchEvent(new CustomEvent('open_tour_guide_modal'));
              }}
              className="whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>TOUR 🧭</span>
            </button>

            {/* Book Live Demo Primary Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowDemoModal(true);
              }}
              className="whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:opacity-90 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <span>BOOK DEMO</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xs cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 px-4 py-5 bg-[#070A14] shadow-2xl flex flex-col gap-2 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <button onClick={() => { handleTabChange('overview'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 font-bold text-left">01. Overview</button>
            <button onClick={() => { handleTabChange('features'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 font-bold text-left">02. Capabilities</button>
            <button onClick={() => { handleTabChange('moonlighting'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 font-bold text-left">03. Moonlighting Radar</button>
            <button onClick={() => { handleTabChange('turnstile'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 font-bold text-left">04. Turnstile Simulator</button>
            <button onClick={() => { handleTabChange('comparison'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 font-bold text-left">05. Speed Matrix</button>
            <button onClick={() => { handleTabChange('roi'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 font-bold text-left">06. ROI Engine</button>
            <button onClick={() => { handleTabChange('solutions'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 font-bold text-left">07. Architecture</button>
            <button onClick={() => { handleTabChange('resources'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-900 font-bold text-left">08. Specs & FAQ</button>
            
            <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2.5">
              <button
                onClick={() => { setMobileMenuOpen(false); window.dispatchEvent(new CustomEvent('open_tour_guide_modal')); }}
                className="w-full py-3 rounded-xl font-bold text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>LAUNCH INTERACTIVE TOUR 🧭</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowDemoModal(true); }}
                className="w-full py-3 rounded-xl font-black text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 text-center shadow-lg cursor-pointer"
              >
                <span>BOOK ENTERPRISE DEMO 🚀</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==============================================================================
       * TAB VIEW ROUTING
       * ============================================================================== */}

      {/* VIEW 1: MASTER OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {/* CINEMATIC BRUTALIST HERO SECTION */}
          <section className="relative z-10 pt-12 pb-20 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Chromatic background mesh glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-500/15 via-emerald-500/10 to-transparent blur-[160px] pointer-events-none rounded-full" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-14 items-center">
              
              {/* Left Column: Monumental Kinetic Typography & Narrative */}
              <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                
                {/* Dynamic Eyebrow Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 backdrop-blur-xl text-xs font-mono font-bold text-amber-300 shadow-lg shadow-amber-500/10">
                  <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span className="uppercase tracking-widest text-[11px] font-black">
                    {content.heroBadge || 'ZERO-TRUST WORKFORCE BACKGROUND SCREENING'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                    TAT &lt;45s
                  </span>
                </div>

                {/* Monumental Heavy Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.95] font-outfit uppercase">
                  VERIFY EVERY <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400">
                    PROFILE.
                  </span> <br />
                  ELIMINATE RISK.
                </h1>

                {/* High-Impact Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
                  {content.heroSubtitle || 'Verify identity, PAN, past employment, bank details, and criminal records in under 45 seconds. 100% compliant with Indian statutory labor laws and DPDP Act 2023.'}
                </p>

                {/* Hero Primary Action Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setShowDemoModal(true);
                    }}
                    className="px-8 py-4 rounded-2xl font-mono font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:opacity-90 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-amber-300/40"
                  >
                    <span>{content.ctaPrimaryText || 'BOOK LIVE DEMO 🚀'}</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      window.dispatchEvent(new CustomEvent('open_tour_guide_modal'));
                    }}
                    className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 px-7 py-4 rounded-2xl font-mono font-bold text-xs sm:text-sm text-slate-200 shadow-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                    <span>{content.ctaSecondaryText || 'EXPLORE TOUR 🧭'}</span>
                  </button>
                </div>

                {/* Telemetry Counter Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800 w-full max-w-2xl font-mono">
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-outfit">{content.statSpeed || '<45s'}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{content.statSpeedLabel || 'Verification Speed'}</div>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-black text-emerald-400 font-outfit">{content.statAccuracy || '99.98%'}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{content.statAccuracyLabel || 'Precision Rate'}</div>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-black text-cyan-400 font-outfit">{content.statClients || '150+'}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{content.statClientsLabel || 'Enterprise Clients'}</div>
                  </div>
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-black text-purple-400 font-outfit">{content.statProfiles || '500k+'}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{content.statProfilesLabel || 'Profiles Checked'}</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Bespoke Workforce Identity Holographic Console */}
              <div className="lg:col-span-5 flex justify-center">
                <BespokeWorkforceMatrixHero />
              </div>

            </div>
          </section>

          {/* SECTION 5: CINEMATIC VERIFICATION STORYBOARD */}
          <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <CinematicVerificationStoryboard />
          </section>

          {/* SECTION 6: QUANTUM WORKFORCE MESH */}
          <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <QuantumWorkforceMesh />
          </section>

          {/* SECTION 7: 4 SPECIALIZED ENTERPRISE PORTALS */}
          <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>ROLE-TAILORED PLATFORM ARCHITECTURE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight">
                Four Specialized Portals. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 font-black">
                  One Unified Verification Engine.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-normal">
                Designed specifically for every stakeholder in your hiring ecosystem — from platform admins to corporate HRs, recruiters, and onboarding candidates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Super Admin */}
              <div className="p-6 sm:p-7 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#090D18] via-[#070A14] to-[#04060E] hover:border-amber-400/60 transition-all hover:scale-[1.02] shadow-2xl flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Crown className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest font-black block">01. GOVERNANCE</span>
                  <h3 className="text-xl font-black text-white font-outfit uppercase group-hover:text-amber-300 transition-colors">
                    Super Admin Console
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    Master control panel to manage enterprise client tenants, dual API gateways, database telemetry, and Razorpay metered ledger.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 font-mono">
                    <li className="flex items-center gap-2 text-emerald-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Multi-Tenant Registry</li>
                    <li className="flex items-center gap-2 text-cyan-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Dual Server Gateways</li>
                    <li className="flex items-center gap-2 text-amber-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Database Telemetry Logs</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full font-mono text-xs font-bold py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 cursor-pointer transition-all"
                >
                  Request Master Demo →
                </button>
              </div>

              {/* Card 2: Company Admin */}
              <div className="p-6 sm:p-7 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#090D18] via-[#070A14] to-[#04060E] hover:border-cyan-400/60 transition-all hover:scale-[1.02] shadow-2xl flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-black block">02. ENTERPRISE</span>
                  <h3 className="text-xl font-black text-white font-outfit uppercase group-hover:text-cyan-300 transition-colors">
                    Company Admin Portal
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    Monitor monthly verification check credit quotas, assign recruiter seats (COMP001HR001), top-up wallet via Razorpay, and download invoices.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 font-mono">
                    <li className="flex items-center gap-2 text-cyan-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Quota Consumption HUD</li>
                    <li className="flex items-center gap-2 text-emerald-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Provision HR Recruiter Seats</li>
                    <li className="flex items-center gap-2 text-amber-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Automated Razorpay Invoicing</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full font-mono text-xs font-bold py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 cursor-pointer transition-all"
                >
                  Explore Company Portal →
                </button>
              </div>

              {/* Card 3: HR Executive */}
              <div className="p-6 sm:p-7 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#090D18] via-[#070A14] to-[#04060E] hover:border-emerald-400/60 transition-all hover:scale-[1.02] shadow-2xl flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-black block">03. RECRUITMENT</span>
                  <h3 className="text-xl font-black text-white font-outfit uppercase group-hover:text-emerald-300 transition-colors">
                    HR Recruiter Cockpit
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    Dispatch instant magic links via WhatsApp, SMS & Email. Import 500+ candidates via Excel spreadsheet and inspect 360° verification dossiers.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 font-mono">
                    <li className="flex items-center gap-2 text-emerald-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> WhatsApp & SMS Dispatcher</li>
                    <li className="flex items-center gap-2 text-amber-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Excel Bulk Import Engine</li>
                    <li className="flex items-center gap-2 text-cyan-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> 360° Candidate BGV Dossiers</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full font-mono text-xs font-bold py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-pointer transition-all"
                >
                  Explore Recruiter Cockpit →
                </button>
              </div>

              {/* Card 4: Candidate Mobile */}
              <div className="p-6 sm:p-7 rounded-3xl border border-slate-800 bg-gradient-to-b from-[#090D18] via-[#070A14] to-[#04060E] hover:border-purple-400/60 transition-all hover:scale-[1.02] shadow-2xl flex flex-col justify-between space-y-6 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest font-black block">04. ONBOARDING</span>
                  <h3 className="text-xl font-black text-white font-outfit uppercase group-hover:text-purple-300 transition-colors">
                    Candidate Mobile Portal
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    Mobile-first self-verification flow with 4-digit PIN access, Aadhaar e-KYC UIDAI OTP, contact validation, and 3D WebCam biometric liveness scan.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-300 font-mono">
                    <li className="flex items-center gap-2 text-purple-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> 4-Digit Security PIN Gate</li>
                    <li className="flex items-center gap-2 text-emerald-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Aadhaar UIDAI OTP Check</li>
                    <li className="flex items-center gap-2 text-cyan-400 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> 3D AI Biometric Face Camera</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowDemoModal(true)}
                  className="w-full font-mono text-xs font-bold py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-500/30 cursor-pointer transition-all"
                >
                  View Candidate Mobile →
                </button>
              </div>

            </div>
          </section>

          {/* SECTION 8: ASYMMETRIC BENTO ARCHITECTURE */}
          <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <EditorialBentoArchitecture onOpenDemo={() => setShowDemoModal(true)} />
          </section>

          {/* SECTION 9: 60 FPS MOTION REEL */}
          <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <LiveVideoSimulationShowcase />
          </section>

          {/* SECTION 10: REAL-TIME INDIA INDUSTRIAL TELEMETRY */}
          <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>REAL-TIME INDUSTRIAL TELEMETRY</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight">Pan-India Regional Mesh</h2>
            </div>
            
            {/* Telemetry Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#070A14] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="lg:col-span-5 flex flex-col gap-3 font-mono">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between font-bold">
                  <span className="text-slate-300">ACTIVE REGIONAL CORRIDORS</span>
                  <span className="text-emerald-400 font-bold">● 6 HUBS ONLINE</span>
                </div>
                {Object.keys(radarCities).map((key) => {
                  const hub = radarCities[key];
                  const isSelected = activeRadarCity === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        soundEngine.playClick();
                        setActiveRadarCity(key);
                      }}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`}></span>
                          <h4 className={`text-xs uppercase tracking-wider font-black ${isSelected ? 'text-white' : 'text-slate-300'}`}>{hub.name}</h4>
                        </div>
                        <p className={`text-[11px] mt-1 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>{hub.state} • {hub.tag}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                        isSelected ? 'text-slate-950 bg-amber-400 border-amber-400' : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      }`}>
                        {hub.avgTat}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7 bg-[#050711] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">{radarCities[activeRadarCity].state}</span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1 font-outfit uppercase">{radarCities[activeRadarCity].name}</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-bold">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                    <span>TELEMETRY STREAM ACTIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 font-mono">
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Active Passes</span>
                    <div className="text-lg font-black text-white mt-1 font-outfit">{radarCities[activeRadarCity].activePasses.split(' ')[0]}</div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Average Latency</span>
                    <div className="text-lg font-black text-amber-400 mt-1 font-outfit">{radarCities[activeRadarCity].avgTat}</div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Accuracy Score</span>
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

          {/* SECTION 11: CRYPTOGRAPHIC TRUST & DPDP VAULT PILLARS */}
          <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <CryptographicVaultPillars 
              onOpenLegalHandbook={() => setShowLegalHandbook(true)}
              onOpenDemo={() => setShowDemoModal(true)}
            />
          </section>

          {/* SECTION 12: HIGH IMPACT CONVERSION BANNER */}
          <section className="relative z-10 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-[#070A12] p-8 sm:p-14 text-center flex flex-col items-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight mb-4 relative z-10">
                Transform Your Workforce Verification Today
              </h2>
              <p className="text-slate-300 max-w-xl mb-8 text-sm sm:text-base font-normal relative z-10">
                Schedule a 15-minute live walkthrough with our enterprise security team and experience sub-second screening.
              </p>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowDemoModal(true);
                }}
                className="px-9 py-4 rounded-2xl font-mono font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer relative z-10 border border-amber-300/40"
              >
                BOOK ENTERPRISE DEMO 🚀
              </button>
            </div>
          </section>
        </>
      )}

      {/* VIEW 2: CAPABILITIES TAB */}
      {activeTab === 'features' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              CAPABILITY ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight mb-4">Complete Workforce Verification Rail</h2>
            <p className="text-slate-400 text-base">Explore all core screening modules designed for fast, error-free workforce onboarding.</p>
          </div>

          <VerificationCommandOrbit />
          <EditorialBentoArchitecture onOpenDemo={() => setShowDemoModal(true)} />

          {/* Interactive Simulation Lab */}
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold mb-2 inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">LIVE DEMO LAB</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit uppercase">Run Live Verification Simulation</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.keys(simModes).map((key) => {
                const item = simModes[key];
                const Icon = item.icon;
                const isSelected = selectedSimMode === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleRunSimulation(key)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer font-mono ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                        {isSelected ? 'SELECTED' : 'TEST'}
                      </span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm font-outfit uppercase ${isSelected ? 'text-white' : 'text-slate-300'}`}>{item.title}</h4>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>{item.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#070A14] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold block">CANDIDATE DOSSIER</span>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-outfit uppercase">
                      {simModes[selectedSimMode].candidate.name} — <span className="text-emerald-400">{simModes[selectedSimMode].candidate.role}</span>
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleRunSimulation(selectedSimMode)}
                  disabled={simulating}
                  className="px-4 py-2 rounded-xl font-mono font-bold text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                  <span>{simulating ? 'Verifying...' : 'Re-Run Verification Check'}</span>
                </button>
              </div>

              {simulating && (
                <div className="mb-6 font-mono text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-bold mb-1.5">
                    <span>Executing automated background queries...</span>
                    <span>{simProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-100" style={{ width: `${simProgress}%` }}></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {simModes[selectedSimMode].checks.map((check, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
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
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              EPFO UAN INTEGRATED
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight mb-4">Dual-Employment Detection</h2>
            <p className="text-slate-400 text-base">Cross-reference active provident fund contributions and service history to block unauthorized secondary employment.</p>
          </div>

          <DualEmploymentRadarVisualizer />
        </div>
      )}

      {/* VIEW 4: TURNSTILE GATE TAB */}
      {activeTab === 'turnstile' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              PLANT & FACILITY ACCESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight mb-4">Workforce Turnstile Simulator</h2>
            <p className="text-slate-400 text-base">Automated QR gate pass issuance and contractor labor verification for manufacturing plants and project sites.</p>
          </div>

          <TurnstileGateSimulator />
        </div>
      )}

      {/* VIEW 5: SPEED MATRIX TAB */}
      {activeTab === 'comparison' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10">
              PERFORMANCE BENCHMARK
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight mb-4">15-Day Agency vs JOY 45-Second Engine</h2>
            <p className="text-slate-400 text-base">See how automated digital verification outperforms traditional manual background screening agencies.</p>
          </div>

          <InteractiveSpeedComparison />
          <CinematicVerificationStoryboard />
        </div>
      )}

      {/* VIEW 6: ROI ENGINE TAB */}
      {activeTab === 'roi' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              FINANCIAL IMPACT ESTIMATOR
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight mb-4">Enterprise ROI & Savings Engine</h2>
            <p className="text-slate-400 text-base">Quantify your annual savings, HR hour reductions, and ghost worker prevention metrics.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#070A14] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="lg:col-span-6 flex flex-col justify-between gap-6 font-mono">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-300 font-bold block mb-3">1. Select Workforce Structure</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'labor', label: 'Factory / Labor' },
                    { id: 'corporate', label: 'Corporate / IT' },
                    { id: 'mixed', label: 'Mixed Workforce' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setWorkforceType(item.id);
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        workforceType === item.id
                          ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-slate-300 font-bold">2. Monthly Candidate Volume</label>
                  <span className="text-base font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
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
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-700"
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[10px] text-slate-500 font-bold mr-1">PRESETS:</span>
                  {[250, 500, 1000, 2500, 5000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        soundEngine.playClick();
                        setMonthlyHires(preset);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                        monthlyHires === preset ? 'bg-amber-500 text-slate-950 font-black border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-slate-300 font-bold">3. Annual Contractor Churn</label>
                  <span className="text-base font-black text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
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
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-700"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Benchmark: Traditional manual verification averages ₹1,800/profile vs JOY TrueProfile automated check at a fraction of cost.</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-gradient-to-br from-[#090D18] via-[#050811] to-[#04060E] text-white border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-2xl font-mono">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold block mb-1">TOTAL ESTIMATED ANNUAL VALUE CREATED</span>
                <div className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight">
                  ₹{((totalMonthlySavings * 12) + Math.round(monthlyHires * 12 * 4500 * 0.04)).toLocaleString('en-IN')}
                  <span className="text-xs sm:text-sm font-normal text-slate-400 ml-2">/ year</span>
                </div>
                <div className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Estimated Payback Period: Under 12 Business Days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Direct Verification Savings</span>
                  <div className="text-lg font-black text-amber-400 font-outfit mt-0.5">₹{(totalMonthlySavings * 12).toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ yr</span></div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Ghost Payroll Blocked</span>
                  <div className="text-lg font-black text-rose-400 font-outfit mt-0.5">~{ghostWorkerPrevented * 12} profiles</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">HR TAT Hours Saved</span>
                  <div className="text-lg font-black text-emerald-400 font-outfit mt-0.5">{(hoursSavedPerMonth * 12).toLocaleString()} hrs / yr</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Compliance Assurance</span>
                  <div className="text-lg font-black text-cyan-400 font-outfit mt-0.5">100% Protected</div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowDemoModal(true);
                }}
                className="w-full py-4 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 shadow-lg cursor-pointer text-center"
              >
                UNLOCK SAVINGS NOW 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 7: ARCHITECTURE TAB */}
      {activeTab === 'solutions' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10">
              ENTERPRISE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight mb-4">Enterprise Verification Infrastructure</h2>
            <p className="text-slate-400 text-base">Custom tailored verification pipelines for automotive manufacturing, supply chain, corporate IT, and EPC construction.</p>
          </div>

          <QuantumWorkforceMesh />
          <CryptographicVaultPillars 
            onOpenLegalHandbook={() => setShowLegalHandbook(true)}
            onOpenDemo={() => setShowDemoModal(true)}
          />
        </div>
      )}

      {/* VIEW 8: SPECS & FAQ TAB */}
      {activeTab === 'resources' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-20">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
              SPECIFICATIONS & REVIEWS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-outfit uppercase tracking-tight mb-4">Specifications, Client Reviews & FAQ</h2>
            <p className="text-slate-400 text-base">System reliability specifications, client testimonials, statutory compliance guides, and answers to common questions.</p>
          </div>

          {/* Specs Control */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs uppercase tracking-wider">
              {[
                { id: 'performance', label: 'Performance' },
                { id: 'security', label: 'Security & DPDP' },
                { id: 'statutory', label: 'Statutory Law' },
                { id: 'infrastructure', label: 'Infrastructure' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveSpecCategory(cat.id);
                  }}
                  className={`px-5 py-2.5 rounded-xl transition-all font-bold cursor-pointer ${
                    activeSpecCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Specs Table */}
          <div className="max-w-4xl mx-auto divide-y divide-slate-800 bg-[#070A14] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl text-white font-mono">
            {technicalSpecs[activeSpecCategory].map((spec, idx) => (
              <div key={idx} className="py-4.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 first:pt-0 last:pb-0">
                <dt className="text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>{spec.label}</span>
                </dt>
                <dd className="text-left sm:text-right">
                  <span className="text-base sm:text-lg font-black text-white font-outfit uppercase">{spec.value}</span>
                  <span className="block text-[11px] text-emerald-400 mt-0.5">{spec.detail}</span>
                </dd>
              </div>
            ))}
          </div>

          {/* Client Reviews */}
          <div>
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-8 font-mono">
              <div>
                <h3 className="text-2xl font-black text-white font-outfit uppercase">Client Feedback</h3>
                <p className="text-xs text-slate-400 mt-0.5">Verified executive feedback from enterprise plants and workforce teams.</p>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 border border-amber-500/30 text-xs font-bold cursor-pointer"
              >
                + POST REVIEW
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {clientReviews.map((rev, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-[#070A14] p-6 flex flex-col justify-between gap-6 shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 font-bold">{rev.badge}</span>
                    </div>
                    <p className="text-slate-300 text-sm italic font-sans">"{rev.quote}"</p>
                  </div>
                  <div className="border-t border-slate-800 pt-4">
                    <h5 className="font-bold text-sm text-white font-outfit uppercase">{rev.name}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">{rev.role} — <span className="text-amber-400 font-semibold">{rev.company}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-black text-white font-outfit uppercase text-center mb-8">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-3">
              {faqData.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`rounded-2xl border transition-all shadow-xs bg-[#070A14] ${isOpen ? 'border-amber-400 bg-amber-500/5' : 'border-slate-800'}`}>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setOpenFaq(isOpen ? -1 : idx);
                      }}
                      className="w-full p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800 pt-3 font-sans font-normal">
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
       * CINEMATIC SOVEREIGN ENTERPRISE FOOTER
       * ============================================================================== */}
      <footer className="relative z-10 py-16 bg-[#02040A] border-t border-slate-800 px-4 sm:px-8 font-mono text-xs text-slate-400 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                  alt="JOY TRUE PROFILE Logo" 
                  className="w-10 h-10 object-contain drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)]" 
                />
                <div>
                  <span className="font-black text-white font-outfit text-base tracking-tight uppercase">JOY <span className="text-amber-400 font-black">TRUE PROFILE</span></span>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Zero-Trust Verification</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-sans font-normal">
                Autonomous employee background verification platform built for modern enterprises, high-growth teams, and secure workplaces across India.
              </p>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-1">Navigation</h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-400 font-mono">
                <li><button onClick={() => handleTabChange('overview')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">🚀 01. Overview</button></li>
                <li><button onClick={() => handleTabChange('features')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">🛡️ 02. Capabilities</button></li>
                <li><button onClick={() => handleTabChange('moonlighting')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">📡 03. Moonlighting Radar</button></li>
                <li><button onClick={() => handleTabChange('turnstile')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">🚧 04. Turnstile Simulator</button></li>
                <li><button onClick={() => handleTabChange('comparison')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">⚡ 05. Speed Matrix</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-1">Resources</h4>
              <ul className="flex flex-col gap-2 text-xs text-slate-400 font-mono">
                <li><button onClick={() => handleTabChange('roi')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">💰 06. ROI Engine</button></li>
                <li><button onClick={() => handleTabChange('solutions')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">🏢 07. Architecture</button></li>
                <li><button onClick={() => handleTabChange('resources')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">📚 08. Specs & FAQ</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold mb-1">Corporate</h4>
              <div className="flex flex-col gap-1.5 text-xs text-slate-300 font-sans">
                <span className="text-white font-bold text-xs">{content.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}</span>
                <span className="text-slate-400">📧 Support: <a href={`mailto:${content.supportEmail || 'support@joycorporatesolutions.com'}`} className="text-amber-400 hover:underline">{content.supportEmail || 'support@joycorporatesolutions.com'}</a></span>
                <span className="text-slate-400">📞 Phone: <a href={`tel:${content.contactPhone || '+91 98450 11223'}`} className="text-amber-400 hover:underline">{content.contactPhone || '+91 98450 11223'}</a></span>
                <span className="text-slate-400">💬 WhatsApp: <span className="text-emerald-400 font-semibold">{content.whatsappNumber || '+91 98450 11223'}</span></span>
                <span className="text-slate-400">🕒 Hours: <span className="text-slate-300">{content.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'}</span></span>
                <span className="text-[11px] text-slate-400 mt-1 leading-relaxed">📍 {content.officeAddress || 'Ground Floor, Technology Corridor, Chennai, Tamil Nadu 600032'}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-bold">All Verification Nodes Operational (99.99% SLA)</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <button 
                onClick={() => {
                  soundEngine.playClick();
                  setShowLegalHandbook(true);
                }} 
                className="hover:text-amber-400 transition-colors cursor-pointer text-slate-400 font-bold"
              >
                Statutory Compliance Handbook
              </button>
              <span>© {new Date().getFullYear()} {content.companyName || 'JOY Corporate Solutions Pvt Ltd.'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP CONCIERGE */}
      <WhatsAppConcierge3D />

      {/* DEMO MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#090D18] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto font-mono">
            <button onClick={() => setShowDemoModal(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-outfit uppercase mb-2">Demo Request Received!</h3>
                <p className="text-slate-300 text-sm max-w-sm mb-6 font-sans">Our enterprise solutions team will contact you within 15 minutes to schedule your walkthrough.</p>
                <button onClick={() => { setDemoSubmitted(false); setShowDemoModal(false); }} className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 cursor-pointer shadow-md">Close Window</button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>ENTERPRISE WALKTHROUGH</span>
                </div>
                <h3 className="text-2xl font-black text-white font-outfit uppercase mb-2">Schedule a Custom Live Demo</h3>
                <p className="text-slate-400 text-xs mb-6 font-sans">Experience sub-second employee profile verification configured for your workflow.</p>

                <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Full Name *</label>
                    <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })} placeholder="e.g. Anand Mahindra" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Work Email *</label>
                      <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })} placeholder="anand@company.com" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-400" />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Phone Number *</label>
                      <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Company / Organization *</label>
                    <input type="text" required value={demoForm.company} onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })} placeholder="e.g. Apex Enterprises Ltd" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-400" />
                  </div>
                  <button type="submit" disabled={demoLoading} className="w-full mt-3 py-3.5 rounded-xl font-bold text-xs uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 shadow-md cursor-pointer">
                    {demoLoading ? 'Submitting...' : 'Confirm Demo Booking 🚀'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#090D18] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto font-mono">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-2xl font-bold text-white font-outfit uppercase mb-2">Review Submitted!</h3>
                <button onClick={() => { setReviewSubmitted(false); setShowReviewModal(false); }} className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 cursor-pointer shadow-md">Close Window</button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white font-outfit uppercase mb-2">Submit Client Review</h3>
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 text-xs">
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
                  <button type="submit" disabled={reviewLoading} className="w-full py-3.5 rounded-xl font-bold text-xs uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 shadow-md cursor-pointer">
                    {reviewLoading ? 'Submitting...' : 'Post Client Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEGAL HANDBOOK MODAL */}
      {showLegalHandbook && (
        <LegalComplianceHandbookModal isOpen={showLegalHandbook} onClose={() => setShowLegalHandbook(false)} />
      )}

      {/* RAZORPAY MODAL */}
      {showLandingRazorpayModal && (
        <RazorpayPaymentModal
          amount={landingSelectedAmount}
          onClose={() => setShowLandingRazorpayModal(false)}
          onSuccess={() => {
            setShowLandingRazorpayModal(false);
            soundEngine.playSuccess();
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
          }}
        />
      )}

    </div>
  );
};

export default LandingPageView;
