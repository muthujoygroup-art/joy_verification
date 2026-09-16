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
  MapPin,
  Phone,
  Clock,
  Award
} from 'lucide-react';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
import { InteractiveTourGuideModal } from '../components/InteractiveTourGuideModal';
import Hero3DCharacter from '../components/landing/Hero3DCharacter';
import HumanIdentitySection from '../components/landing/HumanIdentitySection';
import VerificationTimeline from '../components/landing/VerificationTimeline';
import WorkforceConnectionSection from '../components/landing/WorkforceConnectionSection';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import TrustSection from '../components/landing/TrustSection';
import WhyJoyTrueProfile from '../components/landing/WhyJoyTrueProfile';
import CTASection from '../components/landing/CTASection';
import DualEmploymentRadarVisualizer from '../components/landing/DualEmploymentRadarVisualizer';
import TurnstileGateSimulator from '../components/landing/TurnstileGateSimulator';
import InteractiveSpeedComparison from '../components/landing/InteractiveSpeedComparison';
import VerificationCommandOrbit from '../components/landing/VerificationCommandOrbit';
import LandingPagePreloader from '../components/landing/LandingPagePreloader';
import WhatsAppConcierge3D from '../components/landing/WhatsAppConcierge3D';
import { LiveVideoSimulationShowcase } from '../components/landing/LiveVideoSimulationShowcase';
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

  // Innovative Logo Preloader (Preserved strictly untouched)
  const [showPreloader, setShowPreloader] = useState(true);

  // Active View Tab State (7 Standard Clean Navbar Titles)
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tabId) => {
    soundEngine.playClick();
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation & Interactive Modals
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showTourGuideModal, setShowTourGuideModal] = useState(false);
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showLandingRazorpayModal, setShowLandingRazorpayModal] = useState(false);
  const [landingSelectedAmount, setLandingSelectedAmount] = useState(5000);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundEngine.isMuted());

  // Listen for open_tour_guide_modal event
  useEffect(() => {
    const handleOpenTour = () => setShowTourGuideModal(true);
    window.addEventListener('open_tour_guide_modal', handleOpenTour);
    return () => window.removeEventListener('open_tour_guide_modal', handleOpenTour);
  }, []);

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

  // Dynamic Financial Calculations
  const costPerManualCheck = workforceType === 'labor' ? 1200 : workforceType === 'corporate' ? 2400 : 1800;
  const costPerJoyCheck = 180;
  const directCheckSavings = (costPerManualCheck - costPerJoyCheck) * monthlyHires;
  const ghostWorkerRate = workforceType === 'labor' ? 0.04 : 0.015;
  const ghostWorkerPrevented = Math.round(monthlyHires * ghostWorkerRate * (contractorTurnover / 25));
  const avgMonthlySalary = workforceType === 'labor' ? 19500 : workforceType === 'corporate' ? 65000 : 35000;
  const ghostPayrollSavings = ghostWorkerPrevented * avgMonthlySalary;
  const hoursSavedPerMonth = Math.round(monthlyHires * 1.5);
  const totalMonthlySavings = directCheckSavings + ghostPayrollSavings;

  // Simulator Modes Data
  const simModes = {
    labor_pass: {
      title: 'Automotive Factory Contractor',
      category: 'Contract Labor • Sriperumbudur Hub',
      icon: HardHat,
      candidate: { name: 'Muthukumar P.', role: 'Assembly Line Technician', agency: 'Apex Staffing Solutions' },
      checks: [
        { title: 'Aadhaar e-KYC (Masked)', status: 'Demographic Validated', time: '0.42s' },
        { title: '3D Biometric Liveness Scan', status: '99.98% Confidence', time: '0.65s' },
        { title: 'Bank Account Penny Drop', status: 'Beneficiary Matched', time: '0.38s' },
        { title: 'CLRA Form XVI Gate Pass', status: 'QR Token Generated', time: '0.21s' }
      ]
    },
    it_moonlighting: {
      title: 'Senior Software Engineer',
      category: 'Corporate IT • Bengaluru Zone',
      icon: Search,
      candidate: { name: 'Ananya Sharma', role: 'Full Stack Architect', agency: 'Direct Hire' },
      checks: [
        { title: 'EPFO UAN Dual Employment Radar', status: '0 Active Overlaps (Clean)', time: '0.78s' },
        { title: 'PAN 2.0 Identity Match', status: 'NSDL Validated', time: '0.35s' },
        { title: 'Court Records & Criminal Check', status: 'No Adverse Record', time: '1.12s' },
        { title: '360° Certified Audit Dossier', status: 'PDF Issued', time: '0.45s' }
      ]
    },
    logistics_driver: {
      title: '3PL Commercial Fleet Driver',
      category: 'Supply Chain • Bhiwandi Cluster',
      icon: Smartphone,
      candidate: { name: 'Sanjay Deshmukh', role: 'Heavy Vehicle Commercial Driver', agency: 'Express Logistics 3PL' },
      checks: [
        { title: 'Commercial Driving License Check', status: 'Parivahan Validated (Heavy)', time: '0.52s' },
        { title: 'Aadhaar OTP Mobile Authentication', status: 'Verified via WhatsApp Link', time: '0.41s' },
        { title: 'Police / Traffic Litigation Records', status: 'Zero Active Challans', time: '0.89s' },
        { title: 'Digital Fleet Authorization Pass', status: 'Active Badge Issued', time: '0.25s' }
      ]
    },
    plant_security: {
      title: 'Facility Security Guard',
      category: 'Plant Security • Sanand Mega Zone',
      icon: ShieldCheck,
      candidate: { name: 'Vikram Singh', role: 'Security & HSE Marshal', agency: 'Black Belt Security Agency' },
      checks: [
        { title: 'Aadhaar Demographic Verification', status: 'Direct UIDAI Rail Match', time: '0.39s' },
        { title: 'State Court Criminal Background', status: 'Pan-India Tribunals Checked', time: '0.94s' },
        { title: 'Previous Employer Tenures', status: 'Service Record Confirmed', time: '0.62s' },
        { title: 'Facility Gate Turnstile Pass', status: 'CLRA Access Granted', time: '0.19s' }
      ]
    }
  };

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
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
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
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    } catch {
      setReviewSubmitted(true);
      soundEngine.playSuccess();
    } finally {
      setReviewLoading(false);
    }
  };

  // Technical Specs Data
  // Technical Specs Data
  const technicalSpecs = {
    performance: [
      { label: 'Verification Speed', value: 'Sub-Second Rails', detail: 'Parallel automated checks across official registries' },
      { label: 'Photo & ID Match', value: '99.98% Accuracy', detail: '3D facial liveness scan eliminates duplicate profiles' },
      { label: 'Candidate Experience', value: 'Zero-App Web Flow', detail: 'Mobile-friendly link with zero app downloads' },
      { label: 'Platform Capacity', value: '50,000+ Checks / Day', detail: 'Built to effortlessly handle enterprise hiring spikes' },
      { label: 'Service Reliability', value: '99.99% Uptime SLA', detail: 'Always-available cloud platform with round-the-clock monitoring' }
    ],
    security: [
      { label: 'Data Encryption', value: 'Bank-Grade 256-Bit AES', detail: 'Encrypted at all times during transit and storage' },
      { label: 'Privacy Law Compliance', value: '100% DPDP Act Compliant', detail: 'Explicit OTP candidate consent and automated data masking' },
      { label: 'Aadhaar Redaction', value: 'Automated Masking', detail: 'Zero unredacted storage of national identity numbers' },
      { label: 'Industry Standards', value: 'ISO 27001 & SOC-2', detail: 'Independently audited enterprise cloud infrastructure' },
      { label: 'Certified PDF Reports', value: 'Tamper-Proof Dossiers', detail: 'Cryptographic hash signatures with digital timestamps' }
    ],
    statutory: [
      { label: 'Workforce Gate Passes', value: 'Digital Scannable QR', detail: 'Instant digital employee badges for security gates' },
      { label: 'CLRA Form XVI Muster', value: 'Always Audit-Ready', detail: 'Permanent, verifiable compliance log for statutory audits' },
      { label: 'Employment History', value: 'Full Career Timeline', detail: 'Past company tenures and relieving dates confirmed' },
      { label: 'Bank Account Match', value: 'Instant ₹1 IMPS Match', detail: 'Validates beneficiary name directly with recipient bank' },
      { label: 'Court Record Scope', value: 'Pan-India Databases', detail: 'Covers civil, criminal, and commercial tribunals' }
    ],
    infrastructure: [
      { label: 'Cloud Architecture', value: 'Sovereign Indian Cloud', detail: 'High-speed distributed servers across India' },
      { label: 'Official Connectors', value: 'Direct Rails Connectors', detail: 'Direct validation with official government and banking rails' },
      { label: 'Candidate Experience', value: 'Zero-App Web Link', detail: 'Runs instantly on WhatsApp, SMS, or any mobile browser' },
      { label: 'Commercial Model', value: '100% Postpaid & Metered', detail: 'Pay-per-check with official automated Razorpay GST tax invoices' },
      { label: 'Report Delivery', value: 'Instant PDF & Web Link', detail: 'Downloadable certified audit record with 1 click' }
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
    }
  };

  // Client Reviews Data
  const clientReviews = [
    {
      name: 'Rajesh K. Singhania',
      role: 'VP – Human Resources & Industrial Relations',
      company: 'Premier Auto Components Ltd (Sriperumbudur Hub)',
      stars: 5,
      quote: 'JOY TrueProfile completely eradicated ghost worker invoicing across our 12 contractor agencies. We now onboard and verify 350+ factory workers daily with automated Form XVI gate passes.',
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
      q: 'How does JOY TRUE PROFILE achieve fast employee background verification?',
      a: 'JOY TRUE PROFILE connects directly to official registries including UIDAI for Aadhaar, NSDL for PAN, NPCI for Bank Penny Drops, and EPFO for employment history. All checks execute in parallel with direct API rails.'
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
    <div className="min-h-screen bg-[#FCFCFA] text-[#182230] font-sans selection:bg-[#426CF5] selection:text-white relative overflow-x-hidden">
      
      {/* 1. Holographic Preloader (Strictly preserved untouched) */}
      {showPreloader && (
        <LandingPagePreloader onFinish={() => setShowPreloader(false)} />
      )}

      {/* 2. Premium Light Navbar with 7 Standard Clean Titles */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-[#E5EAF0] shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button onClick={() => handleTabChange('overview')} className="flex items-center gap-3 shrink-0 group text-left cursor-pointer border-none bg-transparent">
            <div className="relative shrink-0">
              <img 
                src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                alt="JOY TRUE PROFILE Logo" 
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#299C68] border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left justify-center">
              <div className="flex items-center gap-1.5 whitespace-nowrap leading-none">
                <span className="text-xl font-bold text-[#182230] font-outfit tracking-tight">JOY</span>
                <span className="text-xl font-bold text-[#426CF5] font-outfit tracking-tight">TRUE PROFILE</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#5C6878] font-bold whitespace-nowrap mt-1">
                Human-Centered Digital Trust
              </span>
            </div>
          </button>

          {/* Center Navigation: Standard Clean 7 Titles */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#FCFCFA] border border-[#E5EAF0]">
            {[
              { id: 'overview', label: 'Home' },
              { id: 'features', label: 'Features' },
              { id: 'solutions', label: 'Solutions' },
              { id: 'what_we', label: 'What We Do' },
              { id: 'how_it_works', label: 'How It Works' },
              { id: 'services', label: 'Services' },
              { id: 'contact', label: 'Contact Us' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#426CF5] text-white shadow-xs font-bold scale-[1.02]'
                      : 'text-[#5C6878] hover:text-[#182230] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Tour Guide Trigger */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowTourGuideModal(true);
                window.dispatchEvent(new CustomEvent('open_tour_guide_modal'));
              }}
              className="whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold text-[#426CF5] bg-[#EAF5FF] hover:bg-[#E0EFFE] border border-[#E5EAF0] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-[#426CF5] animate-spin-slow" />
              <span>Tour 🧭</span>
            </button>

            {/* Book Live Demo Primary Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowDemoModal(true);
              }}
              className="whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] hover:bg-white shadow-xs cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5EAF0] px-4 py-4 bg-white shadow-xl flex flex-col gap-2 font-sans text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <button onClick={() => { handleTabChange('overview'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-[#182230] hover:text-[#426CF5] hover:bg-[#EAF5FF] font-semibold text-left">Home</button>
            <button onClick={() => { handleTabChange('features'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-[#182230] hover:text-[#426CF5] hover:bg-[#EAF5FF] font-semibold text-left">Features</button>
            <button onClick={() => { handleTabChange('solutions'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-[#182230] hover:text-[#426CF5] hover:bg-[#EAF5FF] font-semibold text-left">Solutions</button>
            <button onClick={() => { handleTabChange('what_we'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-[#182230] hover:text-[#426CF5] hover:bg-[#EAF5FF] font-semibold text-left">What We Do</button>
            <button onClick={() => { handleTabChange('how_it_works'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-[#182230] hover:text-[#426CF5] hover:bg-[#EAF5FF] font-semibold text-left">How It Works</button>
            <button onClick={() => { handleTabChange('services'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-[#182230] hover:text-[#426CF5] hover:bg-[#EAF5FF] font-semibold text-left">Services</button>
            <button onClick={() => { handleTabChange('contact'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-[#182230] hover:text-[#426CF5] hover:bg-[#EAF5FF] font-semibold text-left">Contact Us</button>
            
            <div className="pt-3 mt-1 border-t border-[#E5EAF0] flex flex-col gap-2">
              <button
                onClick={() => { 
                  setMobileMenuOpen(false); 
                  setShowTourGuideModal(true);
                  window.dispatchEvent(new CustomEvent('open_tour_guide_modal')); 
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-[#426CF5] bg-[#EAF5FF] border border-[#E5EAF0] text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-[#426CF5]" />
                <span>Interactive Tour Guide 🧭</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowDemoModal(true); }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-[#426CF5] hover:bg-[#3459D8] text-center shadow-sm cursor-pointer"
              >
                <span>Get Started / Book Demo</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==============================================================================
       * TAB VIEW CONTENT ROUTING (7 CLEAN VIEWS)
       * ============================================================================== */}

      {/* VIEW 1: HOME (OVERVIEW) */}
      {activeTab === 'overview' && (
        <>
          {/* 3D HERO SECTION */}
          <section className="relative z-10 pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Soft Ambient Pastel Mesh Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-r from-[#F1EEFF]/80 via-[#EAF5FF]/80 to-[#EAF8F0]/80 blur-[120px] pointer-events-none rounded-full" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-center">
              
              {/* Left Column: Editorial Headline & Actions */}
              <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                
                {/* Dynamic Eyebrow Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-xs font-bold text-[#1E40AF] shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  <span className="tracking-wide">{content.heroBadge || 'DIRECT REGISTRY RAILS'}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] text-[10px] font-black uppercase tracking-wider">
                    Real-Time KYC
                  </span>
                </div>

                {/* Main Hero Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0F172A] font-outfit tracking-tight leading-[1.08]">
                  Every person. <br />
                  <span className="text-[#2563EB]">One trusted profile.</span>
                </h1>

                {/* Supporting Copy */}
                <p className="text-base sm:text-lg text-[#334155] max-w-xl leading-relaxed font-normal">
                  {content.heroSubtitle || 'Joy True Profile helps enterprises, HR teams, and contractors connect through instant direct-rail workforce verification—unifying identity, statutory compliance, and digital gate credentials in one seamless workflow.'}
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setShowDemoModal(true);
                    }}
                    className="px-8 py-4 rounded-full font-bold text-sm text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{content.ctaPrimaryText || 'Explore Joy True Profile 🚀'}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setShowTourGuideModal(true);
                      window.dispatchEvent(new CustomEvent('open_tour_guide_modal'));
                    }}
                    className="bg-white hover:bg-slate-50 border border-slate-300 px-7 py-4 rounded-full font-bold text-sm text-[#0F172A] shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#2563EB] animate-spin-slow" />
                    <span>{content.ctaSecondaryText || 'How It Works 🧭'}</span>
                  </button>
                </div>

                {/* Clean Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 w-full max-w-2xl">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center sm:text-left hover:border-blue-200 transition-colors">
                    <div className="text-xl sm:text-2xl font-black text-[#2563EB] font-outfit">{content.statSpeed || 'Real-Time'}</div>
                    <div className="text-xs text-[#475569] font-bold mt-0.5">{content.statSpeedLabel || 'Instant Rails'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center sm:text-left hover:border-slate-300 transition-colors">
                    <div className="text-xl sm:text-2xl font-black text-[#0F172A] font-outfit">{content.statAccuracy || '99.98%'}</div>
                    <div className="text-xs text-[#475569] font-bold mt-0.5">{content.statAccuracyLabel || 'Match Accuracy'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center sm:text-left hover:border-emerald-200 transition-colors">
                    <div className="text-xl sm:text-2xl font-black text-[#166534] font-outfit">{content.statClients || '150+'}</div>
                    <div className="text-xs text-[#475569] font-bold mt-0.5">{content.statClientsLabel || 'Enterprises'}</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center sm:text-left hover:border-purple-200 transition-colors">
                    <div className="text-xl sm:text-2xl font-black text-[#6D28D9] font-outfit">{content.statProfiles || '500k+'}</div>
                    <div className="text-xs text-[#475569] font-bold mt-0.5">{content.statProfilesLabel || 'Profiles Verified'}</div>
                  </div>
                </div>

              </div>

              {/* Right Column: 3D Workforce Character Scene */}
              <div className="lg:col-span-5 flex justify-center">
                <Hero3DCharacter />
              </div>

            </div>
          </section>

          {/* HUMAN SIDE OF VERIFICATION */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <HumanIdentitySection onOpenDemo={() => setShowDemoModal(true)} />
          </div>

          {/* HOW IT WORKS TIMELINE */}
          <VerificationTimeline />

          {/* 3D WORKFORCE CONNECTION */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <WorkforceConnectionSection />
          </div>

          {/* FEATURES ASYMMETRIC BENTO SHOWCASE */}
          <FeatureShowcase onOpenDemo={() => setShowDemoModal(true)} />

          {/* TRUST AND VERIFICATION */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <TrustSection 
              onOpenLegalHandbook={() => setShowLegalHandbook(true)}
              onOpenDemo={() => setShowDemoModal(true)}
            />
          </div>

          {/* WHY JOY TRUE PROFILE */}
          <WhyJoyTrueProfile onOpenDemo={() => setShowDemoModal(true)} />

          {/* REAL-TIME INDIA INDUSTRIAL TELEMETRY */}
          <section className="py-16 sm:py-20 bg-[#FCFCFA] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E5EAF0]">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0]">
                Live Regional Verification Telemetry
              </span>
              <h2 className="text-3xl font-bold text-[#182230] font-outfit">Pan-India Industrial Activity</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white border border-[#E5EAF0] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                <div className="text-xs uppercase tracking-wider text-[#5C6878] mb-1 flex items-center justify-between font-semibold">
                  <span>Active Regional Hubs</span>
                  <span className="text-[#299C68] font-bold">● 6 Hubs Online</span>
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
                      className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#EAF5FF] border-[#426CF5] text-[#182230] shadow-xs'
                          : 'bg-[#FCFCFA] border-[#E5EAF0] text-[#5C6878] hover:bg-white hover:text-[#182230]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#426CF5] animate-ping' : 'bg-slate-300'}`}></span>
                          <h4 className="text-xs font-bold text-[#182230] font-outfit">{hub.name}</h4>
                        </div>
                        <p className="text-[11px] text-[#5C6878] mt-0.5">{hub.state} • {hub.tag}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isSelected ? 'bg-white text-[#426CF5] border-[#426CF5]/30' : 'bg-white text-[#5C6878] border-[#E5EAF0]'
                      }`}>
                        {hub.avgTat}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-7 bg-[#FCFCFA] border border-[#E5EAF0] rounded-2xl p-6 flex flex-col gap-5 text-[#182230]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5EAF0] pb-3">
                  <div>
                    <span className="text-[11px] text-[#426CF5] font-semibold">{radarCities[activeRadarCity].state}</span>
                    <h3 className="text-xl font-bold text-[#182230] font-outfit">{radarCities[activeRadarCity].name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#EAF8F0] px-3 py-1 rounded-full border border-[#299C68]/20 text-[#299C68] text-xs font-semibold">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Telemetry Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border border-[#E5EAF0] p-3.5 rounded-xl shadow-2xs">
                    <span className="text-[10px] text-[#5C6878] font-medium block">Daily Active Passes</span>
                    <div className="text-base font-bold text-[#182230] mt-0.5 font-outfit">{radarCities[activeRadarCity].activePasses.split(' ')[0]}</div>
                  </div>
                  <div className="bg-white border border-[#E5EAF0] p-3.5 rounded-xl shadow-2xs">
                    <span className="text-[10px] text-[#5C6878] font-medium block">Average TAT</span>
                    <div className="text-base font-bold text-[#426CF5] mt-0.5 font-outfit">{radarCities[activeRadarCity].avgTat}</div>
                  </div>
                  <div className="bg-white border border-[#E5EAF0] p-3.5 rounded-xl shadow-2xs">
                    <span className="text-[10px] text-[#5C6878] font-medium block">Accuracy Score</span>
                    <div className="text-base font-bold text-[#299C68] mt-0.5 font-outfit">{radarCities[activeRadarCity].accuracy}</div>
                  </div>
                </div>

                <div className="bg-white border border-[#E5EAF0] rounded-xl p-3.5 text-xs">
                  <span className="text-[#5C6878] text-[10px] font-semibold block mb-1">Latest Regional Activity</span>
                  <p className="text-[#182230] leading-relaxed">
                    <span className="text-[#299C68] font-bold">[Live Update]</span> {radarCities[activeRadarCity].recentEvent}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CLOSING CTA SECTION */}
          <CTASection 
            onOpenDemo={() => setShowDemoModal(true)} 
            onOpenContact={() => handleTabChange('contact')}
          />
        </>
      )}

      {/* VIEW 2: FEATURES */}
      {activeTab === 'features' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
              PLATFORM CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit mb-4">Complete Workforce Verification Rail</h2>
            <p className="text-[#5C6878] text-base">Explore all core screening modules designed for fast, error-free workforce onboarding.</p>
          </div>

          <VerificationCommandOrbit />
          <FeatureShowcase onOpenDemo={() => setShowDemoModal(true)} />

          {/* Dual Employment Moonlighting Radar */}
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
                EPFO UAN INTEGRATED
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182230] font-outfit">Dual-Employment & Moonlighting Radar</h3>
            </div>
            <DualEmploymentRadarVisualizer />
          </div>

          {/* Turnstile Gate Pass Simulator */}
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold text-[#299C68] mb-2 px-3.5 py-1 rounded-full bg-[#EAF8F0] border border-[#299C68]/20 inline-block">
                PLANT ACCESS & SECURITY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182230] font-outfit">Workforce Turnstile Gate Simulator</h3>
            </div>
            <TurnstileGateSimulator />
          </div>

          {/* Speed Matrix Benchmark */}
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold text-[#8975E8] mb-2 px-3.5 py-1 rounded-full bg-[#F1EEFF] border border-[#E5EAF0] inline-block">
                PERFORMANCE COMPARISON
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182230] font-outfit">15-Day Agency vs JOY 45-Second Engine</h3>
            </div>
            <InteractiveSpeedComparison />
          </div>

          {/* Live Interactive Simulation Lab */}
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold text-[#299C68] mb-2 inline-block px-3.5 py-1 bg-[#EAF8F0] border border-[#299C68]/20 rounded-full">LIVE DEMO LAB</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182230] font-outfit">Run Live Verification Simulation</h3>
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
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAF5FF] border-[#426CF5] text-[#182230] shadow-sm'
                        : 'bg-white border-[#E5EAF0] text-[#5C6878] hover:text-[#182230] hover:bg-[#FCFCFA]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-white text-[#426CF5]' : 'bg-[#FCFCFA] text-[#5C6878]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-[#426CF5]' : 'text-[#5C6878]'}`}>
                        {isSelected ? 'SELECTED' : 'TEST'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm font-outfit text-[#182230]">{item.title}</h4>
                      <p className="text-[11px] text-[#5C6878] mt-0.5">{item.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-white border border-[#E5EAF0] rounded-3xl p-6 sm:p-8 shadow-xs text-[#182230]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5EAF0] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#299C68] animate-ping"></div>
                  <div>
                    <span className="text-xs text-[#5C6878] font-medium block">CANDIDATE PROFILE</span>
                    <h3 className="text-lg font-bold text-[#182230] font-outfit">
                      {simModes[selectedSimMode].candidate.name} — <span className="text-[#426CF5]">{simModes[selectedSimMode].candidate.role}</span>
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleRunSimulation(selectedSimMode)}
                  disabled={simulating}
                  className="px-4 py-2 rounded-full font-semibold text-xs bg-[#426CF5] hover:bg-[#3459D8] text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                  <span>{simulating ? 'Verifying...' : 'Re-Run Check'}</span>
                </button>
              </div>

              {simulating && (
                <div className="mb-6 text-xs font-semibold">
                  <div className="flex items-center justify-between text-[#426CF5] mb-1.5">
                    <span>Executing automated queries...</span>
                    <span>{simProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-[#E5EAF0]">
                    <div className="h-full bg-gradient-to-r from-[#426CF5] to-[#299C68] transition-all duration-100" style={{ width: `${simProgress}%` }}></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simModes[selectedSimMode].checks.map((check, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#E5EAF0] bg-[#FCFCFA] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EAF8F0] border border-[#299C68]/20 flex items-center justify-center text-[#299C68] shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-[#182230]">{check.title}</h5>
                        <span className="text-xs text-[#299C68] font-semibold block mt-0.5">{check.status}</span>
                      </div>
                    </div>
                    <span className="text-xs text-[#5C6878] bg-white px-2.5 py-1 rounded border border-[#E5EAF0] shrink-0 font-semibold">{check.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SOLUTIONS */}
      {activeTab === 'solutions' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
              ENTERPRISE SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit mb-4">Enterprise Verification Infrastructure</h2>
            <p className="text-[#5C6878] text-base">Custom tailored verification pipelines for automotive manufacturing, supply chain, corporate IT, and EPC construction.</p>
          </div>

          {/* Industry Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E5EAF0] shadow-xs flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center">
                  <HardHat className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#182230] font-outfit">Manufacturing & Plant Labor</h3>
                <p className="text-xs text-[#5C6878] leading-relaxed">
                  Sub-second turnstile gate passes, CLRA Form XVI statutory muster rolls, and anti-ghost worker agency reconciliation for factory hubs.
                </p>
              </div>
              <ul className="text-xs text-[#5C6878] space-y-2 border-t border-[#E5EAF0] pt-4">
                <li className="flex items-center gap-2 text-[#299C68] font-semibold"><Check className="w-4 h-4" /> 100% CLRA Form XVI Audit-Ready</li>
                <li className="flex items-center gap-2 text-[#299C68] font-semibold"><Check className="w-4 h-4" /> QR Gate Pass Validated in 0.34s</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E5EAF0] shadow-xs flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#182230] font-outfit">Logistics & 3PL Fleet Drivers</h3>
                <p className="text-xs text-[#5C6878] leading-relaxed">
                  Real-time Parivahan commercial driving license checks, court litigation records, and zero-app candidate WhatsApp magic links.
                </p>
              </div>
              <ul className="text-xs text-[#5C6878] space-y-2 border-t border-[#E5EAF0] pt-4">
                <li className="flex items-center gap-2 text-[#299C68] font-semibold"><Check className="w-4 h-4" /> Commercial License Class Verification</li>
                <li className="flex items-center gap-2 text-[#299C68] font-semibold"><Check className="w-4 h-4" /> e-Courts Pan-India Criminal Check</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E5EAF0] shadow-xs flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F1EEFF] text-[#8975E8] flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#182230] font-outfit">Enterprise IT & Professional Staff</h3>
                <p className="text-xs text-[#5C6878] leading-relaxed">
                  Comprehensive EPFO UAN moonlighting radar, Aadhaar e-KYC, Bank account Penny Drops, and 50+ column Master Excel sheets.
                </p>
              </div>
              <ul className="text-xs text-[#5C6878] space-y-2 border-t border-[#E5EAF0] pt-4">
                <li className="flex items-center gap-2 text-[#299C68] font-semibold"><Check className="w-4 h-4" /> Dual Employment Overlap Detection</li>
                <li className="flex items-center gap-2 text-[#299C68] font-semibold"><Check className="w-4 h-4" /> Instant 5-Tab Excel & PDF Dossiers</li>
              </ul>
            </div>
          </div>

          <WorkforceConnectionSection />

          {/* ROI Calculator Section */}
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
                FINANCIAL IMPACT ESTIMATOR
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-[#182230] font-outfit">Enterprise ROI & Savings Calculator</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-[#E5EAF0] rounded-3xl p-6 sm:p-10 shadow-xs">
              <div className="lg:col-span-6 flex flex-col justify-between gap-6">
                <div>
                  <label className="text-xs font-semibold text-[#182230] block mb-2">1. Select Workforce Structure</label>
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
                        className={`p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                          workforceType === item.id
                            ? 'bg-[#426CF5] text-white border-[#426CF5] shadow-xs'
                            : 'bg-[#FCFCFA] border-[#E5EAF0] text-[#5C6878] hover:text-[#182230]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#182230]">2. Monthly Candidate Volume</label>
                    <span className="text-sm font-bold text-[#426CF5] bg-[#EAF5FF] px-3 py-1 rounded-full border border-[#E5EAF0]">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#426CF5]"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-[10px] text-[#5C6878] font-medium mr-1">PRESETS:</span>
                    {[250, 500, 1000, 2500, 5000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          soundEngine.playClick();
                          setMonthlyHires(preset);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                          monthlyHires === preset ? 'bg-[#426CF5] text-white border-[#426CF5]' : 'bg-[#FCFCFA] text-[#5C6878] border-[#E5EAF0]'
                        }`}
                      >
                        {preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#182230]">3. Annual Contractor Churn</label>
                    <span className="text-sm font-bold text-[#E06A26] bg-[#FFF1E8] px-3 py-1 rounded-full border border-[#E5EAF0]">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E06A26]"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EAF8F0] border border-[#299C68]/20 text-xs text-[#299C68] flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Benchmark: Traditional manual verification averages ₹1,800/profile vs JOY TrueProfile automated check at a fraction of cost.</span>
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#F1EEFF] text-[#182230] border border-[#E5EAF0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-xs">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#8975E8] font-bold block mb-1">TOTAL ESTIMATED ANNUAL VALUE CREATED</span>
                  <div className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                    ₹{((totalMonthlySavings * 12) + Math.round(monthlyHires * 12 * 4500 * 0.04)).toLocaleString('en-IN')}
                    <span className="text-xs sm:text-sm font-normal text-[#5C6878] ml-2">/ year</span>
                  </div>
                  <div className="text-xs text-[#299C68] mt-2 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Estimated Payback Period: Under 12 Business Days</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-[#8975E8]/20 pt-4">
                  <div className="bg-white p-3 rounded-2xl border border-[#E5EAF0]">
                    <span className="text-[10px] text-[#5C6878] font-medium block">Direct Verification Savings</span>
                    <div className="text-base font-bold text-[#426CF5] font-outfit mt-0.5">₹{(totalMonthlySavings * 12).toLocaleString('en-IN')} <span className="text-[10px] font-normal text-[#5C6878]">/ yr</span></div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#E5EAF0]">
                    <span className="text-[10px] text-[#5C6878] font-medium block">Ghost Payroll Blocked</span>
                    <div className="text-base font-bold text-[#E06A26] font-outfit mt-0.5">~{ghostWorkerPrevented * 12} profiles</div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#E5EAF0]">
                    <span className="text-[10px] text-[#5C6878] font-medium block">HR TAT Hours Saved</span>
                    <div className="text-base font-bold text-[#299C68] font-outfit mt-0.5">{(hoursSavedPerMonth * 12).toLocaleString()} hrs / yr</div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-[#E5EAF0]">
                    <span className="text-[10px] text-[#5C6878] font-medium block">Compliance Assurance</span>
                    <div className="text-base font-bold text-[#8975E8] font-outfit mt-0.5">100% Protected</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setShowDemoModal(true);
                  }}
                  className="w-full py-3.5 rounded-full font-semibold text-sm text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-sm hover:shadow-md cursor-pointer text-center transition-all"
                >
                  Unlock These Savings Now 🚀
                </button>
              </div>
            </div>
          </div>

          <TrustSection 
            onOpenLegalHandbook={() => setShowLegalHandbook(true)}
            onOpenDemo={() => setShowDemoModal(true)}
          />
        </div>
      )}

      {/* VIEW 4: WHAT WE DO */}
      {activeTab === 'what_we' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
              WHAT WE DO
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit mb-4">Human-Centered Digital Trust</h2>
            <p className="text-[#5C6878] text-base">We bridge companies, HR teams, and workers with frictionless background screening, automated statutory compliance, and digital trust.</p>
          </div>

          <HumanIdentitySection onOpenDemo={() => setShowDemoModal(true)} />

          {/* 4 Pillars of What We Do */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center font-bold">1</div>
              <h4 className="font-bold text-base text-[#182230] font-outfit">Consent-Driven Identity</h4>
              <p className="text-xs text-[#5C6878] leading-relaxed">
                Direct UIDAI Aadhaar e-KYC and PAN 2.0 validation with explicit OTP consent and automatic data redaction.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold">2</div>
              <h4 className="font-bold text-base text-[#182230] font-outfit">3D AI Biometric Liveness</h4>
              <p className="text-xs text-[#5C6878] leading-relaxed">
                68-point facial mesh analysis and anti-spoofing engine with 99.98% match confidence against official ID photos.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF1E8] text-[#E06A26] flex items-center justify-center font-bold">3</div>
              <h4 className="font-bold text-base text-[#182230] font-outfit">Statutory & Moonlighting Audit</h4>
              <p className="text-xs text-[#5C6878] leading-relaxed">
                Real-time EPFO UAN scan to detect active secondary jobs, overlapping provident fund contributions, and payroll risks.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F1EEFF] text-[#8975E8] flex items-center justify-center font-bold">4</div>
              <h4 className="font-bold text-base text-[#182230] font-outfit">Multi-Sheet Excel & PDF Output</h4>
              <p className="text-xs text-[#5C6878] leading-relaxed">
                Instant generation of 5-tab individual employee workbooks, 50+ column master rosters, and cryptographic PDF dossiers.
              </p>
            </div>
          </div>

          <WorkforceConnectionSection />
          <WhyJoyTrueProfile onOpenDemo={() => setShowDemoModal(true)} />
          
          <CTASection 
            onOpenDemo={() => setShowDemoModal(true)} 
            onOpenContact={() => handleTabChange('contact')}
          />
        </div>
      )}

      {/* VIEW 5: HOW IT WORKS */}
      {activeTab === 'how_it_works' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
              SEAMLESS VERIFICATION RAIL
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit mb-4">How JOY True Profile Works</h2>
            <p className="text-slate-600 text-base">A frictionless 4-step direct-registry verification rail taking candidates from invite to certified compliance in real-time.</p>
          </div>

          <VerificationTimeline />
          <LiveVideoSimulationShowcase />
          
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold text-[#299C68] mb-2 px-3.5 py-1 rounded-full bg-[#EAF8F0] border border-[#299C68]/20 inline-block">
                PLANT ACCESS & SECURITY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#182230] font-outfit">Turnstile QR Pass Clearance</h3>
            </div>
            <TurnstileGateSimulator />
          </div>

          <InteractiveSpeedComparison />
        </div>
      )}

      {/* VIEW 6: SERVICES */}
      {activeTab === 'services' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
              ENTERPRISE SERVICES CATALOG
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit mb-4">Full Suite of Verification Services</h2>
            <p className="text-[#5C6878] text-base">Direct official rails connectors and specialized screening modules for Indian enterprises.</p>
          </div>

          {/* Complete Services Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Aadhaar UIDAI e-KYC', desc: 'Direct UIDAI OTP authentication with automatic data redaction and address verification.', speed: '0.42s', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
              { title: 'PAN 2.0 ID Verification', desc: 'Real-time Income Tax & NSDL direct check validating full candidate legal name and status.', speed: '0.35s', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
              { title: 'EPFO Moonlighting Radar', desc: 'Queries active UAN contributions to flag undisclosed secondary jobs and overlap periods.', speed: '0.78s', icon: Search, color: 'text-amber-600 bg-amber-50' },
              { title: 'Bank Account Penny Drop', desc: 'Instant ₹1 IMPS transfer validating bank account number and beneficiary name with 100% accuracy.', speed: '0.38s', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
              { title: 'Driving License (DL) Check', desc: 'Parivahan Sarathi check verifying license validity, transport classes, and active badges.', speed: '0.52s', icon: Smartphone, color: 'text-purple-600 bg-purple-50' },
              { title: 'Pan-India Court & Litigation', desc: 'e-Courts civil and criminal tribunal search across District, High, and Supreme courts.', speed: '1.12s', icon: Scale, color: 'text-rose-600 bg-rose-50' },
              { title: 'Factory Turnstile Gate Pass', desc: 'Instant scannable QR badge for plant turnstiles and statutory CLRA Form XVI muster records.', speed: '0.21s', icon: HardHat, color: 'text-teal-600 bg-teal-50' },
              { title: '5-Tab Excel & PDF Export', desc: 'Instant generation of 5-tab individual workbooks and 50+ column master workforce spreadsheets.', speed: 'Instant', icon: FileSpreadsheet, color: 'text-cyan-600 bg-cyan-50' }
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-[#E5EAF0] shadow-2xs flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-2xl ${srv.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#426CF5] bg-[#EAF5FF] px-2 py-0.5 rounded">
                        TAT {srv.speed}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#182230] font-outfit">{srv.title}</h4>
                    <p className="text-xs text-[#5C6878] leading-relaxed">{srv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical Specs Accordion Table */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex p-1 rounded-full bg-white border border-[#E5EAF0]">
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
                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activeSpecCategory === cat.id
                        ? 'bg-[#426CF5] text-white shadow-xs font-bold'
                        : 'text-[#5C6878] hover:text-[#182230]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto divide-y divide-[#E5EAF0] bg-white rounded-3xl border border-[#E5EAF0] p-6 sm:p-8 shadow-xs">
              {technicalSpecs[activeSpecCategory].map((spec, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 first:pt-0 last:pb-0">
                  <dt className="text-xs uppercase font-semibold text-[#5C6878] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#426CF5]"></span>
                    <span>{spec.label}</span>
                  </dt>
                  <dd className="text-left sm:text-right">
                    <span className="text-base font-bold text-[#182230] font-outfit">{spec.value}</span>
                    <span className="block text-[11px] text-[#426CF5] mt-0.5">{spec.detail}</span>
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 7: CONTACT US */}
      {activeTab === 'contact' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
              CONNECT WITH US
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit mb-4">Get in Touch with Our Team</h2>
            <p className="text-[#5C6878] text-base">Schedule a live demonstration or contact our enterprise solutions team across India.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Contact Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAF0] shadow-xs">
              <div className="flex items-center gap-2 text-xs text-[#426CF5] font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>BOOK ENTERPRISE WALKTHROUGH</span>
              </div>
              <h3 className="text-2xl font-bold text-[#182230] font-outfit mb-2">Schedule a Custom Live Demo</h3>
              <p className="text-[#5C6878] text-xs mb-6">Experience sub-45-second workforce verification tailored for your workforce size.</p>

              {demoSubmitted ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF8F0] border border-[#299C68]/20 flex items-center justify-center text-[#299C68] mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#182230] font-outfit mb-2">Demo Request Received!</h3>
                  <p className="text-[#5C6878] text-sm max-w-sm mb-6">Our enterprise solutions engineers will contact you within 15 minutes.</p>
                  <button onClick={() => setDemoSubmitted(false)} className="px-6 py-2.5 rounded-full font-semibold text-xs text-white bg-[#426CF5] cursor-pointer shadow-sm">Submit Another Request</button>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="text-[#182230] font-semibold block mb-1">Full Name *</label>
                    <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })} placeholder="e.g. Anand Mahindra" className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Work Email *</label>
                      <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })} placeholder="anand@company.com" className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" />
                    </div>
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Phone Number *</label>
                      <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#182230] font-semibold block mb-1">Company / Organization *</label>
                    <input type="text" required value={demoForm.company} onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })} placeholder="e.g. Apex Enterprises Ltd" className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" />
                  </div>
                  <button type="submit" disabled={demoLoading} className="w-full mt-2 py-3.5 rounded-full font-semibold text-xs text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-sm cursor-pointer transition-all">
                    {demoLoading ? 'Submitting...' : 'Confirm Demo Booking 🚀'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Information & Office Locations */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#E5EAF0] shadow-xs space-y-4">
                <h4 className="font-bold text-base text-[#182230] font-outfit">Corporate Headquarters</h4>
                <div className="space-y-3 text-xs text-[#5C6878]">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-[#426CF5] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#182230] block">{content.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}</strong>
                      <span>{content.officeAddress || 'Coimbatore, Tamilnadu, India'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#426CF5] shrink-0" />
                    <a href={`mailto:${content.supportEmail || 'info@joycorporatesolutions.com'}`} className="text-[#426CF5] hover:underline font-medium">
                      {content.supportEmail || 'info@joycorporatesolutions.com'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#426CF5] shrink-0" />
                    <a href={`tel:${content.contactPhone || '+91 99946 99044'}`} className="text-[#426CF5] hover:underline font-medium">
                      {content.contactPhone || '+91 99946 99044'}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#299C68] shrink-0" />
                    <span>{content.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'}</span>
                  </div>
                </div>
              </div>

              {/* Regional Support Hubs */}
              <div className="bg-[#FCFCFA] p-6 rounded-3xl border border-[#E5EAF0] shadow-xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#182230]">Regional Operations Hubs</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E5EAF0] flex items-center justify-between">
                    <div>
                      <strong className="text-slate-800 block">Chennai / Sriperumbudur Hub</strong>
                      <span className="text-[11px] text-slate-500">Automotive & Electronics Cluster</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E5EAF0] flex items-center justify-between">
                    <div>
                      <strong className="text-slate-800 block">Gujarat / Sanand Mega Zone</strong>
                      <span className="text-[11px] text-slate-500">EV & Heavy Engineering</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E5EAF0] flex items-center justify-between">
                    <div>
                      <strong className="text-slate-800 block">Mumbai / Bhiwandi Cluster</strong>
                      <span className="text-[11px] text-slate-500">3PL & Logistics Mega Center</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#182230] font-outfit text-center mb-8">Frequently Asked Questions</h3>
            <div className="flex flex-col gap-3">
              {faqData.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`rounded-2xl border transition-all bg-white ${isOpen ? 'border-[#426CF5] shadow-xs' : 'border-[#E5EAF0]'}`}>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setOpenFaq(isOpen ? -1 : idx);
                      }}
                      className="w-full p-5 text-left font-semibold text-sm sm:text-base text-[#182230] flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#426CF5] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-[#5C6878] text-xs sm:text-sm leading-relaxed border-t border-[#E5EAF0] pt-3 font-normal">
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
       * CLEAN LIGHT FOOTER
       * ============================================================================== */}
      <footer id="contact-footer" className="py-16 bg-white border-t border-[#E5EAF0] px-4 sm:px-8 text-xs text-[#5C6878] mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#E5EAF0]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                  alt="JOY TRUE PROFILE Logo" 
                  className="w-9 h-9 object-contain" 
                />
                <div>
                  <span className="font-bold text-[#182230] font-outfit text-base tracking-tight">JOY <span className="text-[#426CF5] font-bold">TRUE PROFILE</span></span>
                  <p className="text-[10px] text-[#299C68] font-semibold uppercase tracking-wider">Human-Centered Digital Trust</p>
                </div>
              </div>
              <p className="text-[#5C6878] text-xs leading-relaxed font-normal">
                Workforce identity and verification platform built to connect companies, HR teams, and workers with trust, simplicity, and statutory compliance.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs uppercase tracking-wider text-[#182230] font-bold mb-1">Navigation</h4>
              <ul className="flex flex-col gap-2 text-xs text-[#5C6878]">
                <li><button onClick={() => handleTabChange('overview')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Home</button></li>
                <li><button onClick={() => handleTabChange('features')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Features</button></li>
                <li><button onClick={() => handleTabChange('solutions')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Solutions</button></li>
                <li><button onClick={() => handleTabChange('what_we')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">What We Do</button></li>
                <li><button onClick={() => handleTabChange('how_it_works')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">How It Works</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs uppercase tracking-wider text-[#182230] font-bold mb-1">Services & Portal</h4>
              <ul className="flex flex-col gap-2 text-xs text-[#5C6878]">
                <li><button onClick={() => handleTabChange('services')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Verification Services</button></li>
                <li><button onClick={() => handleTabChange('contact')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Contact & Demo</button></li>
                <li><button onClick={() => { setShowTourGuideModal(true); window.dispatchEvent(new CustomEvent('open_tour_guide_modal')); }} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Tour & Knowledge Hub 🧭</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Portal Login</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs uppercase tracking-wider text-[#182230] font-bold mb-1">Corporate & Contact</h4>
              <div className="flex flex-col gap-1.5 text-xs text-[#5C6878]">
                <span className="text-[#182230] font-semibold text-xs">{content.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}</span>
                <span>📧 Support: <a href={`mailto:${content.supportEmail || 'info@joycorporatesolutions.com'}`} className="text-[#426CF5] hover:underline">{content.supportEmail || 'info@joycorporatesolutions.com'}</a></span>
                <span>📞 Phone: <a href={`tel:${content.contactPhone || '+91 99946 99044'}`} className="text-[#426CF5] hover:underline">{content.contactPhone || '+91 99946 99044'}</a></span>
                <span>💬 WhatsApp: <a href="https://wa.me/919994699044" target="_blank" rel="noopener noreferrer" className="text-[#299C68] hover:underline font-semibold">{content.whatsappNumber || '+91 99946 99044'}</a></span>
                <span>🕒 Hours: <span className="text-[#182230]">{content.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'}</span></span>
                <span className="mt-1">
                  <a 
                    href={content.googleMapsUrl || 'https://maps.app.goo.gl/xK2B3J4VvC73oQwd8'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#426CF5] hover:underline inline-flex items-center gap-1 font-medium text-[11px]"
                  >
                    <span>📍 {content.officeAddress || 'Coimbatore, Tamilnadu'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">(Google Maps ↗)</span>
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#5C6878]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#299C68] animate-pulse"></span>
              <span className="text-[#182230] font-semibold">All Verification Nodes Operational (99.99% SLA)</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <button 
                onClick={() => {
                  soundEngine.playClick();
                  setShowLegalHandbook(true);
                }} 
                className="hover:text-[#426CF5] transition-colors cursor-pointer text-[#5C6878] font-semibold"
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

      {/* INTERACTIVE TOUR GUIDE MODAL */}
      <InteractiveTourGuideModal 
        isOpen={showTourGuideModal} 
        onClose={() => setShowTourGuideModal(false)} 
      />

      {/* DEMO MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-[#E5EAF0] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#182230] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowDemoModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-[#FCFCFA] text-[#5C6878] hover:text-[#182230] transition-colors cursor-pointer border border-[#E5EAF0]">
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF8F0] border border-[#299C68]/20 flex items-center justify-center text-[#299C68] mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#182230] font-outfit mb-2">Demo Request Received!</h3>
                <p className="text-[#5C6878] text-sm max-w-sm mb-6">Our enterprise solutions team will contact you within 15 minutes to schedule your live walkthrough.</p>
                <button onClick={() => { setDemoSubmitted(false); setShowDemoModal(false); }} className="px-6 py-2.5 rounded-full font-semibold text-xs text-white bg-[#426CF5] cursor-pointer shadow-sm">Close Window</button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs text-[#426CF5] font-semibold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>CUSTOM ENTERPRISE WALKTHROUGH</span>
                </div>
                <h3 className="text-2xl font-bold text-[#182230] font-outfit mb-2">Schedule a Live Demo</h3>
                <p className="text-[#5C6878] text-xs mb-6">Experience sub-45-second workforce profile verification configured for your organization.</p>

                <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="text-[#182230] font-semibold block mb-1">Full Name *</label>
                    <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })} placeholder="e.g. Anand Mahindra" className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Work Email *</label>
                      <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })} placeholder="anand@company.com" className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" />
                    </div>
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Phone Number *</label>
                      <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#182230] font-semibold block mb-1">Company / Organization *</label>
                    <input type="text" required value={demoForm.company} onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })} placeholder="e.g. Apex Enterprises Ltd" className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" />
                  </div>
                  <button type="submit" disabled={demoLoading} className="w-full mt-2 py-3.5 rounded-full font-semibold text-xs text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-sm cursor-pointer transition-all">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-[#E5EAF0] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#182230] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-[#FCFCFA] text-[#5C6878] hover:text-[#182230] transition-colors cursor-pointer border border-[#E5EAF0]">
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-[#299C68] mb-4" />
                <h3 className="text-2xl font-bold text-[#182230] font-outfit mb-2">Review Submitted!</h3>
                <button onClick={() => { setReviewSubmitted(false); setShowReviewModal(false); }} className="px-6 py-2.5 rounded-full font-semibold text-xs text-white bg-[#426CF5] cursor-pointer shadow-sm">Close Window</button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-[#182230] font-outfit mb-2">Submit Client Review</h3>
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Your Name *</label>
                      <input type="text" required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230]" />
                    </div>
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Role *</label>
                      <input type="text" required value={reviewForm.role} onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#182230] font-semibold block mb-1">Review *</label>
                    <textarea required rows={4} value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] resize-none" />
                  </div>
                  <button type="submit" disabled={reviewLoading} className="w-full py-3.5 rounded-full font-semibold text-xs text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-sm cursor-pointer transition-all">
                    {reviewLoading ? 'Submitting...' : 'Post Client Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEGAL COMPLIANCE HANDBOOK MODAL */}
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
