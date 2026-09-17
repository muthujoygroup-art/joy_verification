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
  Award,
  ExternalLink
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
import TurnstileGateSimulator from '../components/landing/TurnstileGateSimulator';
import InteractiveSpeedComparison from '../components/landing/InteractiveSpeedComparison';
import VerificationCommandOrbit from '../components/landing/VerificationCommandOrbit';
import LandingPagePreloader from '../components/landing/LandingPagePreloader';
import WhatsAppConcierge3D from '../components/landing/WhatsAppConcierge3D';
import { soundEngine } from '../utils/uiSoundEffects';
import { checkNetworkBeforeAction } from '../utils/networkChecker';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { useApp, DEFAULT_LANDING_PAGE_CONTENT, POSTPAID_PLANS } from '../context/AppContext';

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

  // 3-Option Inquiry Category & Form State
  const [inquiryType, setInquiryType] = useState('General Query'); // 'General Query' | 'Purchasing Plan' | 'Other'
  const [selectedPlanTier, setSelectedPlanTier] = useState('tier2');
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    preferredContact: 'email'
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  // Contact Submit Handler (Supports 3 Categories: General Query, Purchasing Plan, Other)
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      setContactError('Please complete all required fields.');
      return;
    }
    if (!checkNetworkBeforeAction('Submit Inquiry')) return;
    setContactSubmitting(true);
    setContactError('');
    try {
      await api.submitInquiry({
        name: contactForm.name,
        company: contactForm.company,
        email: contactForm.email,
        phone: contactForm.phone,
        inquiry_type: inquiryType,
        selected_plan: inquiryType === 'Purchasing Plan' ? selectedPlanTier : null,
        subject: inquiryType === 'Purchasing Plan' 
          ? `Plan Purchase Inquiry: ${POSTPAID_PLANS[selectedPlanTier]?.name || selectedPlanTier}` 
          : (contactForm.subject || `${inquiryType} Inquiry`),
        message: contactForm.message || `Inquiry submitted for ${inquiryType}`,
        preferred_contact: contactForm.preferredContact
      });
      setContactSubmitted(true);
      soundEngine.playSuccess();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    } catch {
      setContactSubmitted(true);
      soundEngine.playSuccess();
    } finally {
      setContactSubmitting(false);
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

          {/* Center Navigation: Standard Clean 8 Titles */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#FCFCFA] border border-[#E5EAF0]">
            {[
              { id: 'overview', label: 'Home' },
              { id: 'features', label: 'Features' },
              { id: 'solutions', label: 'Solutions' },
              { id: 'what_we', label: 'What We Do' },
              { id: 'how_it_works', label: 'How It Works' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'services', label: 'Services' },
              { id: 'contact', label: 'Contact Us' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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
            <button onClick={() => { handleTabChange('pricing'); setMobileMenuOpen(false); }} className="py-2.5 px-3 rounded-xl text-[#182230] hover:text-[#426CF5] hover:bg-[#EAF5FF] font-semibold text-left">Pricing</button>
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-center">
              
              {/* Left Column: Editorial Headline & Actions */}
              <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
                
                {/* Dynamic Eyebrow Badge - Perfectly Balanced Modern Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200 text-blue-800 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span className="font-bold text-xs text-blue-900 tracking-wide uppercase">{content.heroBadge || 'DIRECT REGISTRY RAILS'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-extrabold uppercase">
                    Real-Time KYC
                  </span>
                </div>

                {/* Main Hero Headline - Harmonious Deep Slate & Electric Sapphire */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#182230] font-outfit tracking-tight leading-[1.08]">
                  Every person. <br />
                  <span className="text-[#2563EB]">One trusted profile.</span>
                </h1>

                {/* Supporting Copy - Balanced, Natural, Crystal Clear Body Text */}
                <p className="text-base sm:text-lg text-[#475467] max-w-xl leading-relaxed font-normal">
                  {content.heroSubtitle || 'Joy True Profile helps enterprises, HR teams, and contractors connect through instant direct-rail workforce verification—unifying identity, statutory compliance, and digital gate credentials in one seamless workflow.'}
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setShowDemoModal(true);
                    }}
                    className="px-8 py-4 rounded-full font-bold text-sm text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                    className="bg-white hover:bg-slate-50 border border-[#E5EAF0] px-7 py-4 rounded-full font-bold text-sm text-[#182230] shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-[#2563EB] animate-spin-slow" />
                    <span>{content.ctaSecondaryText || 'How It Works 🧭'}</span>
                  </button>
                </div>

                {/* Clean Balanced Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#E5EAF0] w-full max-w-2xl">
                  <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF0] shadow-2xs text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-[#2563EB] font-outfit">{content.statSpeed || 'Real-Time'}</div>
                    <div className="text-xs text-[#475467] font-medium mt-0.5">{content.statSpeedLabel || 'Instant Rails'}</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF0] shadow-2xs text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-[#182230] font-outfit">{content.statAccuracy || '99.98%'}</div>
                    <div className="text-xs text-[#475467] font-medium mt-0.5">{content.statAccuracyLabel || 'Match Accuracy'}</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF0] shadow-2xs text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-[#059669] font-outfit">{content.statClients || '150+'}</div>
                    <div className="text-xs text-[#475467] font-medium mt-0.5">{content.statClientsLabel || 'Enterprises'}</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-[#E5EAF0] shadow-2xs text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-bold text-[#7C3AED] font-outfit">{content.statProfiles || '500k+'}</div>
                    <div className="text-xs text-[#475467] font-medium mt-0.5">{content.statProfilesLabel || 'Profiles Verified'}</div>
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

          {/* JOY GROUP ECOSYSTEM & SOFTWARE SUITE */}
          <section className="py-16 sm:py-24 bg-[#FCFCFA] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E5EAF0]">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-bold text-[#426CF5] px-4 py-1.5 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] uppercase tracking-wider">
                {content.productsSectionBadge || 'JOY GROUP SOFTWARE ECOSYSTEM'}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                {content.productsSectionTitle || 'Complete HR Management & Enterprise Verification Platform'}
              </h2>
              <p className="text-sm sm:text-base text-[#5C6878] leading-relaxed">
                {content.productsSectionSubtitle || 'JOY Corporate Solutions delivers an integrated, enterprise-grade cloud software suite — from biometric attendance and automated payroll to direct registry workforce background verification.'}
              </p>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Product 1: JOY PEOPLE HR (Flagship) */}
              <div className="bg-white border-2 border-[#426CF5]/40 rounded-3xl p-8 sm:p-10 shadow-lg relative flex flex-col justify-between group hover:border-[#426CF5] transition-all">
                <div className="absolute -top-3.5 left-8 px-4 py-1 rounded-full bg-gradient-to-r from-[#426CF5] to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Flagship HRMS Suite
                </div>

                <div className="space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 pt-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-black text-[#182230] font-outfit">JOY</span>
                        <span className="text-2xl font-black text-[#426CF5] font-outfit">PEOPLE HR</span>
                      </div>
                      <p className="text-xs font-semibold text-[#5C6878]">
                        Next-Gen Cloud HRMS, Biometric Attendance & Payroll Suite
                      </p>
                    </div>

                    <a
                      href="https://joypeoplehr.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-[#EAF5FF] hover:bg-[#426CF5] text-[#426CF5] hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-[#426CF5]/30 no-underline cursor-pointer"
                    >
                      <span>Visit joypeoplehr.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    Complete end-to-end human resource management platform. Features geo-fenced biometric mobile & face punch attendance, shift rostering, leave approval hierarchies, 1-click automated salary calculation with 100% PF, ESI, TDS, & PT statutory compliance deductions, and full Employee Self-Service (ESS).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      'Biometric & Mobile Face/Fingerprint Punch Attendance',
                      'Automated Shift Rostering, Overtime & Leave Tracking',
                      '1-Click Automated Salary Disbursement & Pay Slips',
                      '100% PF, ESI, TDS & Professional Tax Statutory Compliance',
                      'Employee Self-Service (ESS) Portal with Expense Claims',
                      'Seamless Direct API Sync with JOY True Profile Verification'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#182230] bg-[#FCFCFA] p-3 rounded-2xl border border-[#E5EAF0]">
                        <CheckCircle2 className="w-4 h-4 text-[#299C68] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-[#E5EAF0] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#5C6878] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#299C68] animate-pulse" />
                    <span>Cloud Hosted • Zero Server Setup Needed</span>
                  </div>
                  <a
                    href="https://joypeoplehr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 no-underline cursor-pointer"
                  >
                    <span>Launch Joy People HR Platform</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Product 2: JOY TRUE PROFILE */}
              <div className="bg-white border border-[#E5EAF0] rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between group hover:border-[#426CF5]/60 transition-all">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-black text-[#182230] font-outfit">JOY</span>
                        <span className="text-2xl font-black text-[#426CF5] font-outfit">TRUE PROFILE</span>
                      </div>
                      <p className="text-xs font-semibold text-[#5C6878]">
                        Instant Workforce Background Verification Rails
                      </p>
                    </div>

                    <button
                      onClick={() => handleTabChange('features')}
                      className="px-4 py-2 rounded-full bg-slate-100 hover:bg-[#426CF5] text-slate-700 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore Engine</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    Direct government and banking registry verification rails executing sub-45-second screening. Validates Aadhaar OTP, NSDL PAN, NPCI IMPS Penny Drop, EPFO employment tenure for moonlighting, and generates cryptographic compliance dossiers.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[
                      'Sub-45s direct API lookups (Aadhaar, PAN, Bank, DL)',
                      'EPFO service history & dual-employment moonlighting radar',
                      'Bulk 500+ Excel candidate ingestion & WhatsApp magic links',
                      'Turnstile gate passes & CLRA Form XVI contractor muster',
                      '100% Postpaid pay-as-you-verify metered billing',
                      'DPDP Act 2023 compliant explicit candidate consent gate'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#182230] bg-[#FCFCFA] p-3 rounded-2xl border border-[#E5EAF0]">
                        <CheckCircle2 className="w-4 h-4 text-[#426CF5] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-[#E5EAF0] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#5C6878] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#426CF5]" />
                    <span>Postpaid Metered Billing • SAC 998311</span>
                  </div>
                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#182230] hover:bg-black text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Verification Demo</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>

              {/* Product 3: JOY CONTRACTOR & CLRA COMPLIANCE */}
              <div className="bg-white border border-[#E5EAF0] rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between group hover:border-[#426CF5]/60 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF6E9] text-[#D97706] flex items-center justify-center font-bold">
                      <HardHat className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#182230] font-outfit">JOY Contractor & CLRA Compliance</h3>
                      <p className="text-xs text-[#5C6878]">Statutory Labor Muster & Vendor Agency Governance</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    Automate statutory CLRA Form XVI registers, manage third-party staffing agencies, prevent ghost worker billing, and track daily headcounts with plant turnstile synchronization.
                  </p>

                  <ul className="space-y-2 text-xs text-[#5C6878] pt-2">
                    <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Statutory CLRA Form XVI & XII muster generation</li>
                    <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Manpower agency quota & shift allocations</li>
                    <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> 100% labor inspector audit-ready export</li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#E5EAF0]">
                  <a
                    href="https://joypeoplehr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#426CF5] hover:underline flex items-center gap-1.5 no-underline"
                  >
                    <span>Learn more about contractor compliance ↗</span>
                  </a>
                </div>
              </div>

              {/* Product 4: JOY DIGITAL VAULT & DPDP SHIELD */}
              <div className="bg-white border border-[#E5EAF0] rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between group hover:border-[#426CF5]/60 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#182230] font-outfit">JOY Cryptographic Digital Vault</h3>
                      <p className="text-xs text-[#5C6878]">DPDP Act 2023 Verifiable Credential Engine</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    Cryptographically signed credential vault with tamper-evident SHA-256 signatures, candidate consent logging, automated PII masking, and sovereign in-country data residency.
                  </p>

                  <ul className="space-y-2 text-xs text-[#5C6878] pt-2">
                    <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> 256-bit AES encryption at rest & in transit</li>
                    <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Automatic Aadhaar & PAN masking (XXXX-XXXX-1234)</li>
                    <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Granular candidate digital consent trail</li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#E5EAF0]">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setShowLegalHandbook(true);
                    }}
                    className="text-xs font-bold text-[#299C68] hover:underline flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0"
                  >
                    <span>View DPDP Compliance Handbook ↗</span>
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* CLIENT TRUST & REVIEWS SECTION */}
          <section className="py-16 bg-white border-t border-b border-[#E5EAF0] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold text-[#426CF5] px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] uppercase tracking-wider">
                  CLIENT TESTIMONIALS & TRUST
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#182230] font-outfit mt-3">
                  Trusted by Over 150+ Enterprise HR & Compliance Teams
                </h2>
                <p className="text-sm text-[#5C6878] mt-1 max-w-2xl">
                  See how leading automotive manufacturing plants, IT enterprises, and 3PL logistics leaders rely on JOY True Profile for fast, error-free workforce verification.
                </p>
              </div>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowReviewModal(true);
                }}
                className="px-5 py-2.5 rounded-full font-bold text-xs text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>+ Write a Client Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clientReviews.map((rev, idx) => (
                <div key={idx} className="p-6 rounded-3xl bg-[#FCFCFA] border border-[#E5EAF0] shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#426CF5]/50 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.stars)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[#426CF5] bg-[#EAF5FF] px-2 py-0.5 rounded-full">
                        {rev.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#182230] leading-relaxed italic font-normal">
                      &quot;{rev.quote}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5EAF0]">
                    <div className="font-bold text-xs text-[#182230] flex items-center gap-1">
                      <span>{rev.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#299C68]" />
                    </div>
                    <div className="text-[11px] text-[#5C6878]">{rev.role}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{rev.company}</div>
                  </div>
                </div>
              ))}
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
            <p className="text-[#5C6878] text-base">Explore our unified suite of verification tools, clean recruiter workstations, and statutory compliance controls designed for modern enterprise reliability.</p>
          </div>

          {/* 6 Core Feature Capability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Module 1: Easy Verification Process */}
            <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#182230] font-outfit">Easy & Frictionless Verification</h3>
              <p className="text-sm text-[#5C6878] leading-relaxed">
                Zero app installations needed. Workers receive a PIN-secured magic link via WhatsApp, SMS, or Email and complete onboarding in under 2 minutes.
              </p>
              <ul className="space-y-2 text-xs text-[#5C6878]">
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Automated WhatsApp, SMS & Email dispatch</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Secure candidate PIN gate authentication</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Fast 2-minute mobile-first interface</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Multi-lingual UI for pan-India workforces</li>
              </ul>
            </div>

            {/* Module 2: Complete Employee Verification */}
            <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#182230] font-outfit">Complete 360° Candidate BGV</h3>
              <p className="text-sm text-[#5C6878] leading-relaxed">
                Direct government and banking registry rails validating national ID, past employer tenures, active bank accounts, and criminal records in parallel.
              </p>
              <ul className="space-y-2 text-xs text-[#5C6878]">
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> UIDAI Aadhaar OTP verification & e-KYC</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> NSDL PAN 2.0 active status validation</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> EPFO past service history & tenure audits</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> NPCI IMPS ₹1 penny drop account match</li>
              </ul>
            </div>

            {/* Module 3: Neat HR Management */}
            <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F1EEFF] text-[#8975E8] flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#182230] font-outfit">Neat HR Recruiter Workstation</h3>
              <p className="text-sm text-[#5C6878] leading-relaxed">
                Equip talent acquisition teams with bulk Excel ingestion, recruiter role access, candidate dossier reviews, and live tracking status filters.
              </p>
              <ul className="space-y-2 text-xs text-[#5C6878]">
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> 500+ record bulk Excel roster import</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> 1-click status filtering & export</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Comprehensive 360° candidate dossiers</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Company Admin & Recruiter role scoping</li>
              </ul>
            </div>

            {/* Module 4: Statutory CLRA Form XVI */}
            <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF6E9] text-[#D97706] flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#182230] font-outfit">Statutory CLRA Compliance</h3>
              <p className="text-sm text-[#5C6878] leading-relaxed">
                Maintain statutory contractor muster registers, manage third-party staffing agency quotas, and prevent ghost worker payroll leaks.
              </p>
              <ul className="space-y-2 text-xs text-[#5C6878]">
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Statutory CLRA Form XVI contractor muster</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Third-party agency quota management</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Anti-ghost worker audit ledger</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Labor inspector audit-ready downloads</li>
              </ul>
            </div>

            {/* Module 5: Turnstile Gate Passes */}
            <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#182230] font-outfit">Digital Turnstile Gate Passes</h3>
              <p className="text-sm text-[#5C6878] leading-relaxed">
                Generate sub-second cryptographic QR gate passes with biometric facial selfie matching to secure plant and factory perimeters.
              </p>
              <ul className="space-y-2 text-xs text-[#5C6878]">
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Scannable turnstile entry QR passes</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> 3D facial liveness & selfie match</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Sub-second turnstile gate validation</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Digital workforce access logs</li>
              </ul>
            </div>

            {/* Module 6: 100% Postpaid Billing */}
            <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FCFCFA] text-[#475569] flex items-center justify-center font-bold border border-[#E5EAF0]">
                <Scale className="w-6 h-6 text-[#426CF5]" />
              </div>
              <h3 className="text-xl font-bold text-[#182230] font-outfit">100% Postpaid Metered Billing</h3>
              <p className="text-sm text-[#5C6878] leading-relaxed">
                Zero upfront lock-in. Verify on demand and settle monthly based on actual verified employee profiles with official GST tax invoices (SAC 998311).
              </p>
              <ul className="space-y-2 text-xs text-[#5C6878]">
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> 5 Transparent postpaid tier brackets</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Never-block overage hiring surges</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Official 18% GST tax invoices</li>
                <li className="flex items-center gap-2 text-[#182230] font-medium"><Check className="w-4 h-4 text-[#299C68]" /> Itemized monthly verification ledgers</li>
              </ul>
            </div>

          </div>

          <FeatureShowcase onOpenDemo={() => setShowDemoModal(true)} />

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

          {/* JOY GROUP SOFTWARE SOLUTIONS SUITE */}
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
                SOFTWARE PRODUCT ECOSYSTEM
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-[#182230] font-outfit">Integrated Cloud Solutions Suite</h3>
              <p className="text-[#5C6878] text-sm mt-2">
                Discover the specialized software solutions engineered by JOY Group to automate workforce compliance, biometric attendance, and direct verification rails.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Joy People HR Solution Card */}
              <div className="bg-white border-2 border-[#426CF5]/30 hover:border-[#426CF5] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase">
                      Cloud HRMS & Payroll
                    </span>
                    <a
                      href="https://joypeoplehr.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#426CF5] hover:underline flex items-center gap-1"
                    >
                      <span>joypeoplehr.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#182230] font-outfit">JOY PEOPLE HR Platform</h4>
                    <p className="text-xs text-[#5C6878] mt-1 leading-relaxed">
                      All-in-one cloud HRMS managing attendance, geo-fenced mobile/biometric punch, shift rosters, leave approvals, and automated 1-click salary disbursement with PF/ESI/TDS compliance.
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs text-[#182230] pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#299C68] shrink-0" /> Biometric & Mobile Face/Fingerprint Punch</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#299C68] shrink-0" /> Automated Shift Rosters & Overtime Calculations</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#299C68] shrink-0" /> 1-Click Automated Salary Disbursement & Pay Slips</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#299C68] shrink-0" /> 100% PF, ESI, TDS & PT Statutory Deductions</li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E5EAF0]">
                  <a
                    href="https://joypeoplehr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 no-underline"
                  >
                    <span>Visit Joy People HR Suite</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* JOY True Profile Solution Card */}
              <div className="bg-white border border-[#E5EAF0] hover:border-[#426CF5]/50 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#EAF8F0] text-[#299C68] text-xs font-bold uppercase">
                      Direct Registry BGV
                    </span>
                    <span className="text-xs font-bold text-[#299C68]">Sub-45s Rail</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#182230] font-outfit">JOY TRUE PROFILE</h4>
                    <p className="text-xs text-[#5C6878] mt-1 leading-relaxed">
                      Direct registry workforce background verification rails executing sub-45-second screening with Aadhaar, PAN, Bank account penny drops, and EPFO moonlighting detection.
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs text-[#182230] pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#426CF5] shrink-0" /> Sub-45s API lookups (Aadhaar OTP, PAN, Bank)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#426CF5] shrink-0" /> Dual-employment EPFO UAN tenure analysis</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#426CF5] shrink-0" /> Bulk 500+ Excel ingestion & WhatsApp magic links</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#426CF5] shrink-0" /> 100% Postpaid metered billing with GST invoices</li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E5EAF0]">
                  <button
                    onClick={() => setShowDemoModal(true)}
                    className="w-full py-3 rounded-full bg-[#182230] hover:bg-black text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Platform Demo</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>

              {/* JOY Contractor & CLRA Compliance Card */}
              <div className="bg-white border border-[#E5EAF0] hover:border-[#426CF5]/50 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#FFF6E9] text-[#D97706] text-xs font-bold uppercase">
                      Contractor Governance
                    </span>
                    <span className="text-xs font-bold text-[#D97706]">Form XVI Ready</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#182230] font-outfit">JOY Contractor & CLRA Compliance</h4>
                    <p className="text-xs text-[#5C6878] mt-1 leading-relaxed">
                      Statutory labor muster automation, contractor quota management, and ghost worker prevention for industrial factories and EPC plants.
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs text-[#182230] pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" /> Statutory CLRA Form XVI & XII muster registers</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" /> Daily contractor agency quota allocation</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" /> Anti-ghost worker turnstile badge sync</li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E5EAF0]">
                  <a
                    href="https://joypeoplehr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 no-underline"
                  >
                    <span>Explore Contractor Suite ↗</span>
                  </a>
                </div>
              </div>

              {/* JOY Cryptographic Vault Card */}
              <div className="bg-white border border-[#E5EAF0] hover:border-[#426CF5]/50 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#F1EEFF] text-[#8975E8] text-xs font-bold uppercase">
                      Security & DPDP Shield
                    </span>
                    <span className="text-xs font-bold text-[#8975E8]">256-Bit AES</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#182230] font-outfit">JOY Cryptographic Digital Vault</h4>
                    <p className="text-xs text-[#5C6878] mt-1 leading-relaxed">
                      Verifiable digital credential engine ensuring full compliance with the Digital Personal Data Protection (DPDP) Act 2023.
                    </p>
                  </div>
                  <ul className="space-y-2 text-xs text-[#182230] pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#8975E8] shrink-0" /> Sovereign in-country encrypted storage</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#8975E8] shrink-0" /> Automatic Aadhaar/PAN PII redaction</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#8975E8] shrink-0" /> Tamper-evident SHA-256 PDF signatures</li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-[#E5EAF0]">
                  <button
                    onClick={() => setShowLegalHandbook(true)}
                    className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View DPDP Compliance Handbook</span>
                  </button>
                </div>
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

      {/* VIEW: PRICING & POSTPAID PLANS */}
      {activeTab === 'pricing' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-semibold text-[#299C68] px-3.5 py-1 rounded-full bg-[#EAF8F0] border border-[#299C68]/20 uppercase tracking-wider inline-block">
              100% POSTPAID TIER PLANS
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
              Transparent, Metered Postpaid Pricing
            </h2>
            <p className="text-base text-[#5C6878] leading-relaxed">
              Never get blocked during critical recruitment surges. Verify candidates on demand and settle monthly based on actual verified employee profiles with official GST tax invoices (SAC 998311).
            </p>
          </div>

          {/* 5-Tier Postpaid Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-stretch">
            {Object.values(POSTPAID_PLANS).map((plan) => {
              const isHighlight = plan.id === 'tier3';
              return (
                <div
                  key={plan.id}
                  className={`p-6 rounded-3xl bg-white border-2 transition-all flex flex-col justify-between space-y-4 relative ${
                    isHighlight
                      ? 'border-[#426CF5] shadow-lg ring-2 ring-blue-100'
                      : 'border-[#E5EAF0] shadow-xs hover:border-[#426CF5]/60'
                  }`}
                >
                  {isHighlight && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#426CF5] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                      Most Popular 🌟
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {plan.employeeThreshold}
                      </span>
                      <h3 className="text-lg font-bold text-[#182230] mt-2 font-outfit">{plan.name}</h3>
                      <p className="text-xs text-[#5C6878] mt-1 line-clamp-2">{plan.description}</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                      <div className="text-[11px] text-[#5C6878] font-medium">Per Verified Profile</div>
                      <div className="text-3xl font-black text-[#182230] font-mono mt-1">
                        {plan.ratePerProfile === 'Custom' ? 'Custom' : `₹${plan.ratePerProfile}`}
                      </div>
                      <div className="text-[10px] text-[#299C68] font-bold mt-0.5">100% Postpaid</div>
                    </div>

                    <ul className="space-y-2 text-xs text-[#5C6878] pt-1">
                      {plan.features.slice(0, 5).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-left">
                          <CheckCircle2 className="w-4 h-4 text-[#299C68] shrink-0 mt-0.5" />
                          <span className="text-[#182230]">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#E5EAF0] space-y-2">
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setInquiryType('Purchasing Plan');
                        setSelectedPlanTier(plan.id);
                        handleTabChange('contact');
                      }}
                      className={`w-full py-3 rounded-full font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isHighlight
                          ? 'bg-[#426CF5] hover:bg-[#3459D8] text-white shadow-sm'
                          : 'bg-[#182230] hover:bg-black text-white'
                      }`}
                    >
                      <span>{plan.id === 'tier5' ? 'Request Custom Quote' : 'Select ' + plan.shortName}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {plan.id !== 'tier5' && (
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setLandingSelectedAmount(plan.ratePerProfile * 20);
                          setShowLandingRazorpayModal(true);
                        }}
                        className="w-full py-1 text-[11px] font-bold text-[#426CF5] hover:underline bg-transparent border-none cursor-pointer text-center"
                      >
                        ⚡ Instant Online Deposit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Postpaid Benefits Strip */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center font-bold mx-auto">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#182230] font-outfit">Zero Upfront Lock-in</h4>
              <p className="text-xs text-[#5C6878]">Start onboarding and verifying immediately. Never blocked during critical hiring surges.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold mx-auto">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#182230] font-outfit">Automated GST Invoices</h4>
              <p className="text-xs text-[#5C6878]">Receive itemized calendar month-end tax invoices under SAC 998311 with 18% GST.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF1E8] text-[#E06A26] flex items-center justify-center font-bold mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#182230] font-outfit">Vendor Quota Parity</h4>
              <p className="text-xs text-[#5C6878]">Contractor manpower agency personnel are verified at identical per-profile postpaid rates.</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 7: CONTACT US (3-OPTION INQUIRY ARCHITECTURE) */}
      {activeTab === 'contact' && (
        <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold text-[#426CF5] mb-2 px-3.5 py-1 rounded-full bg-[#EAF5FF] border border-[#E5EAF0] inline-block">
              CONNECT WITH US
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit mb-4">Enterprise Contact & Inquiries</h2>
            <p className="text-[#5C6878] text-base">Select your inquiry type below for instant plan activation, general support, or business partnerships.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Contact Console */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EAF0] shadow-xs space-y-6">
              
              {/* 3 Inquiry Category Selection Cards */}
              <div>
                <label className="text-xs font-bold text-[#182230] uppercase tracking-wider block mb-2.5">
                  Choose Inquiry Type:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'General Query',
                      label: 'General Queries',
                      desc: 'Email reply & ticket thread',
                      icon: MessageSquare,
                      color: 'border-blue-500 bg-blue-50/50 text-blue-700'
                    },
                    {
                      id: 'Purchasing Plan',
                      label: 'Purchasing Plan',
                      desc: 'Plan choice & onboarding',
                      icon: CreditCard,
                      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700'
                    },
                    {
                      id: 'Other',
                      label: 'Other Inquiries',
                      desc: 'Partnership & custom',
                      icon: Mail,
                      color: 'border-purple-500 bg-purple-50/50 text-purple-700'
                    }
                  ].map((cat) => {
                    const isSelected = inquiryType === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setInquiryType(cat.id);
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? `${cat.color} shadow-xs font-bold`
                            : 'border-[#E5EAF0] bg-[#FCFCFA] text-[#5C6878] hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#426CF5]' : 'text-slate-500'}`} />
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#426CF5]"></span>}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-[#182230]' : 'text-[#5C6878]'}`}>
                            {cat.label}
                          </div>
                          <div className="text-[10px] text-slate-500">{cat.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {contactSubmitted ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#EAF8F0] border border-[#299C68]/20 flex items-center justify-center text-[#299C68] mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#182230] font-outfit mb-2">Inquiry Submitted Successfully!</h3>
                  <p className="text-[#5C6878] text-sm max-w-sm mb-6">
                    {inquiryType === 'Purchasing Plan'
                      ? 'Our enterprise onboarding specialist will reach out to activate your postpaid account within 15 minutes.'
                      : 'An automated confirmation email has been sent. Our team will reply directly to your email thread shortly.'}
                  </p>
                  <button 
                    onClick={() => setContactSubmitted(false)} 
                    className="px-6 py-2.5 rounded-full font-semibold text-xs text-white bg-[#426CF5] cursor-pointer shadow-sm"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 text-xs">
                  
                  {/* Category 1: Purchasing Plan - Dynamic Plan Selection & Pricing */}
                  {inquiryType === 'Purchasing Plan' && (
                    <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#182230]">Select Target Postpaid Plan:</span>
                        <span className="text-[10px] text-[#299C68] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          100% Postpaid
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.values(POSTPAID_PLANS).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              soundEngine.playClick();
                              setSelectedPlanTier(p.id);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedPlanTier === p.id
                                ? 'border-[#426CF5] bg-blue-50/60 shadow-xs'
                                : 'border-[#E5EAF0] bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#182230]">{p.shortName}</span>
                              <span className="text-xs font-mono font-bold text-[#426CF5]">
                                {p.ratePerProfile === 'Custom' ? 'Custom' : `₹${p.ratePerProfile}/check`}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">{p.employeeThreshold}</span>
                          </button>
                        ))}
                      </div>

                      {/* Selected Plan Details Card */}
                      {POSTPAID_PLANS[selectedPlanTier] && (
                        <div className="mt-2 p-3 bg-white rounded-xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div>
                            <div className="font-bold text-xs text-[#182230]">
                              {POSTPAID_PLANS[selectedPlanTier].name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Postpaid Rate: <strong className="text-slate-800">{POSTPAID_PLANS[selectedPlanTier].ratePerProfile === 'Custom' ? 'Custom Quote' : `₹${POSTPAID_PLANS[selectedPlanTier].ratePerProfile} per verified profile`}</strong> • SAC 998311 (18% GST)
                            </div>
                          </div>
                          
                          {selectedPlanTier !== 'tier5' && (
                            <button
                              type="button"
                              onClick={() => {
                                soundEngine.playClick();
                                setLandingSelectedAmount(POSTPAID_PLANS[selectedPlanTier].ratePerProfile * 20);
                                setShowLandingRazorpayModal(true);
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-[#299C68] hover:bg-[#238357] text-white text-[11px] font-bold shrink-0 cursor-pointer shadow-xs"
                            >
                              ⚡ Pay Deposit Online
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* General Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Your Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={contactForm.name} 
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} 
                        placeholder="e.g. Anand Mahindra" 
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Company / Organization *</label>
                      <input 
                        type="text" 
                        required 
                        value={contactForm.company} 
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} 
                        placeholder="e.g. Apex Enterprises Ltd" 
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Work Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        value={contactForm.email} 
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} 
                        placeholder="anand@company.com" 
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Phone / WhatsApp Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={contactForm.phone} 
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} 
                        placeholder="+91 98765 43210" 
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" 
                      />
                    </div>
                  </div>

                  {inquiryType === 'Other' && (
                    <div>
                      <label className="text-[#182230] font-semibold block mb-1">Inquiry Subject</label>
                      <input 
                        type="text" 
                        value={contactForm.subject} 
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} 
                        placeholder="e.g. Technology Partnership / API Customization" 
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none" 
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[#182230] font-semibold block mb-1">
                      {inquiryType === 'Purchasing Plan' 
                        ? 'Expected Monthly Hires / Verification Scope' 
                        : 'Your Message / Requirement'}
                    </label>
                    <textarea 
                      rows={3} 
                      value={contactForm.message} 
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} 
                      placeholder={inquiryType === 'Purchasing Plan' ? "e.g. Need to verify 150 contract workers and 30 corporate employees monthly across Chennai plant..." : "Please describe your question or requirement..."} 
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FCFCFA] border border-[#E5EAF0] text-[#182230] focus:border-[#426CF5] outline-none resize-none" 
                    />
                  </div>

                  {contactError && (
                    <div className="text-xs text-rose-600 font-semibold">{contactError}</div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button 
                      type="submit" 
                      disabled={contactSubmitting} 
                      className="w-full py-3.5 rounded-full font-semibold text-xs text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {contactSubmitting ? (
                        <span>Submitting Inquiry...</span>
                      ) : (
                        <>
                          <span>
                            {inquiryType === 'Purchasing Plan' 
                              ? 'Submit Plan Purchase Request 🚀' 
                              : inquiryType === 'General Query' 
                              ? 'Send General Query via Email ✉️' 
                              : 'Send Direct Inquiry 📨'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-[11px] text-slate-500 text-center">
                    🔒 All inquiries are logged securely in our Super Admin communication console and acknowledged via email.
                  </div>
                </form>
              )}
            </div>

            {/* Right Information & Office Locations */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Mini Google Map Layout */}
              <div className="p-4 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#182230] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#426CF5]" /> Coimbatore Office Location
                  </span>
                  <span className="text-[10px] text-[#299C68] font-bold bg-[#EAF8F0] px-2 py-0.5 rounded">
                    ● Active
                  </span>
                </div>
                
                <div className="overflow-hidden rounded-2xl border border-[#E5EAF0] shadow-xs bg-slate-100">
                  <iframe
                    title="Joy Corporate Solutions Coimbatore Office Location"
                    src={content.googleMapsEmbedUrl || "https://maps.google.com/maps?q=Coimbatore,%20Tamil%20Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  />
                </div>

                <a 
                  href={content.googleMapsUrl || "https://maps.app.goo.gl/xK2B3J4VvC73oQwd8"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#EAF5FF] hover:bg-[#426CF5] text-[#426CF5] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 no-underline cursor-pointer"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Corporate Headquarters */}
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
                    <MessageSquare className="w-4 h-4 text-[#299C68] shrink-0" />
                    <a 
                      href={`https://wa.me/${(content.whatsappNumber || '919994699044').replace(/[^0-9]/g, '')}?text=Hi%20JOY%20Corporate%20Solutions,%20I%20would%20like%20to%20know%20more%20about%20workforce%20verification`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#299C68] hover:underline font-medium flex items-center gap-1"
                    >
                      <span>WhatsApp: {content.whatsappNumber || '+91 99946 99044'}</span>
                      <ExternalLink className="w-3 h-3" />
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
              <h4 className="text-xs uppercase tracking-wider text-[#182230] font-bold mb-1">Navigation & Legal</h4>
              <ul className="flex flex-col gap-2 text-xs text-[#5C6878]">
                <li><button onClick={() => handleTabChange('overview')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Home</button></li>
                <li><button onClick={() => handleTabChange('features')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Features</button></li>
                <li><button onClick={() => handleTabChange('solutions')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Solutions</button></li>
                <li><button onClick={() => handleTabChange('what_we')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">What We Do</button></li>
                <li><button onClick={() => handleTabChange('how_it_works')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">How It Works</button></li>
                <li><button onClick={() => handleTabChange('pricing')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Pricing & Postpaid Plans</button></li>
                <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms-and-conditions')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Terms & Conditions</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs uppercase tracking-wider text-[#182230] font-bold mb-1">Enterprise Platform</h4>
              <ul className="flex flex-col gap-2 text-xs text-[#5C6878]">
                <li><button onClick={() => handleTabChange('services')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Verification Services</button></li>
                <li><button onClick={() => handleTabChange('contact')} className="hover:text-[#426CF5] transition-colors cursor-pointer text-left">Contact & Inquiries</button></li>
                <li>
                  <button 
                    onClick={() => {
                      soundEngine.playClick();
                      setShowLegalHandbook(true);
                    }} 
                    className="hover:text-[#426CF5] transition-colors cursor-pointer text-left"
                  >
                    DPDP Compliance Handbook
                  </button>
                </li>
                <li>
                  <a 
                    href="https://joypeoplehr.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#426CF5] hover:underline no-underline flex items-center gap-1"
                  >
                    <span>Joy People HR (Flagship HRMS)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
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
                onClick={() => navigate('/privacy-policy')}
                className="hover:text-[#426CF5] transition-colors cursor-pointer text-[#5C6878] font-semibold"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/terms-and-conditions')}
                className="hover:text-[#426CF5] transition-colors cursor-pointer text-[#5C6878] font-semibold"
              >
                Terms & Conditions
              </button>
              <button 
                onClick={() => {
                  soundEngine.playClick();
                  setShowLegalHandbook(true);
                }} 
                className="hover:text-[#426CF5] transition-colors cursor-pointer text-[#5C6878] font-semibold"
              >
                DPDP Compliance
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
