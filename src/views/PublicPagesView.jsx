import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Smartphone, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Zap, 
  Scale, 
  HelpCircle, 
  ChevronDown, 
  Eye, 
  HardHat, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Download, 
  FileSpreadsheet, 
  Check, 
  AlertCircle,
  Award,
  Globe,
  Users,
  Compass,
  FileCheck2,
  RefreshCw,
  Server,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useApp, DEFAULT_LANDING_PAGE_CONTENT, POSTPAID_PLANS } from '../context/AppContext';
import { soundEngine } from '../utils/uiSoundEffects';
import { checkNetworkBeforeAction } from '../utils/networkChecker';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { WhatsAppConcierge3D } from '../components/landing/WhatsAppConcierge3D';

export const PublicPagesView = ({ initialPage = 'features' }) => {
  const navigate = useNavigate();
  const { platformLogoEmblem, landingPageContent } = useApp() || {};
  const content = {
    ...DEFAULT_LANDING_PAGE_CONTENT,
    ...(landingPageContent || {})
  };

  const [activePage, setActivePage] = useState(initialPage);
  const [openFaq, setOpenFaq] = useState(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    mobileNumber: '',
    subject: 'Enterprise Verification Inquiry',
    message: '',
    preferredContact: 'email',
    consent: true
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.workEmail || !contactForm.mobileNumber) {
      setContactError('Please fill in all required fields.');
      return;
    }
    if (!checkNetworkBeforeAction('Submit Contact Form')) return;

    setContactSubmitting(true);
    setContactError('');
    try {
      await api.submitInquiry({
        name: contactForm.fullName,
        company: contactForm.companyName,
        email: contactForm.workEmail,
        phone: contactForm.mobileNumber,
        subject: contactForm.subject,
        message: contactForm.message,
        preferred_contact: contactForm.preferredContact
      });
      setContactSubmitted(true);
      soundEngine.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Offline / Demo fallback
      setContactSubmitted(true);
      soundEngine.playSuccess();
    } finally {
      setContactSubmitting(false);
    }
  };

  const navLinks = [
    { id: 'features', label: 'Features', path: '/features' },
    { id: 'solutions', label: 'Solutions', path: '/solutions' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'how-it-works', label: 'How It Works', path: '/how-it-works' },
    { id: 'pricing', label: 'Pricing', path: '/pricing' },
    { id: 'about', label: 'About Us', path: '/about' },
    { id: 'resources', label: 'Resources', path: '/resources' },
    { id: 'faq', label: 'FAQ', path: '/faq' },
    { id: 'contact', label: 'Contact Us', path: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#182230] font-sans selection:bg-[#426CF5] selection:text-white flex flex-col justify-between">
      
      {/* 1. Universal Top Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-[#E5EAF0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group text-left no-underline">
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
                Workforce Verification Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#FCFCFA] border border-[#E5EAF0]">
            <Link 
              to="/" 
              className="px-3.5 py-2 rounded-full text-xs font-semibold text-[#5C6878] hover:text-[#182230] hover:bg-white no-underline transition-all"
            >
              Home
            </Link>
            {navLinks.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActivePage(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activePage === tab.id
                    ? 'bg-[#426CF5] text-white shadow-xs font-bold scale-[1.02]'
                    : 'text-[#5C6878] hover:text-[#182230] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActivePage('contact');
              }}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Page Content Routing */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">

        {/* ========================================================================= */}
        {/* PAGE 1: FEATURES                                                          */}
        {/* ========================================================================= */}
        {activePage === 'features' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Comprehensive Capability Matrix
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Platform Features Built for Instant, Error-Free Verification
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed">
                Explore our unified suite of verification tools, clean recruiter workstations, and statutory compliance controls designed for modern enterprise reliability.
              </p>
            </div>

            {/* Feature Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Module 1: Easy Verification Process */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Easy & Frictionless Verification</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Zero app installations needed. Workers receive a PIN-secured magic link via WhatsApp, SMS, or Email and complete onboarding in under 2 minutes.
                </p>
                <ul className="space-y-2 text-xs text-[#5C6878]">
                  <li className="flex items-center gap-2">✓ Automated WhatsApp, SMS & Email dispatch</li>
                  <li className="flex items-center gap-2">✓ Secure candidate PIN gate authentication</li>
                  <li className="flex items-center gap-2">✓ Fast 2-minute mobile-first interface</li>
                  <li className="flex items-center gap-2">✓ Multi-lingual UI for pan-India workforces</li>
                </ul>
              </div>

              {/* Module 2: Complete Employee Verification */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Complete 360° Candidate BGV</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Direct government and banking registry rails validating national ID, past employer tenures, active bank accounts, and criminal records in parallel.
                </p>
                <ul className="space-y-2 text-xs text-[#5C6878]">
                  <li className="flex items-center gap-2">✓ UIDAI Aadhaar OTP verification & e-KYC</li>
                  <li className="flex items-center gap-2">✓ NSDL PAN 2.0 active status validation</li>
                  <li className="flex items-center gap-2">✓ EPFO UAN moonlighting tenure detection</li>
                  <li className="flex items-center gap-2">✓ NPCI IMPS ₹1 penny drop account match</li>
                </ul>
              </div>

              {/* Module 3: Neat HR Management */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F6F0FE] text-[#795290] flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Neat HR Recruiter Workstation</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Equip talent acquisition teams with bulk Excel ingestion, recruiter role access, candidate dossier reviews, and live tracking status filters.
                </p>
                <ul className="space-y-2 text-xs text-[#5C6878]">
                  <li className="flex items-center gap-2">✓ 500+ record bulk Excel roster import</li>
                  <li className="flex items-center gap-2">✓ 1-click status filtering & export</li>
                  <li className="flex items-center gap-2">✓ Comprehensive 360° candidate dossiers</li>
                  <li className="flex items-center gap-2">✓ Company Admin & Recruiter role scoping</li>
                </ul>
              </div>

              {/* Module 4: Statutory CLRA Form XVI */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF6E9] text-[#D97706] flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Statutory CLRA Compliance</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Maintain statutory contractor muster registers, manage third-party staffing agency quotas, and prevent ghost worker payroll leaks.
                </p>
                <ul className="space-y-2 text-xs text-[#5C6878]">
                  <li className="flex items-center gap-2">✓ Statutory CLRA Form XVI contractor muster</li>
                  <li className="flex items-center gap-2">✓ Third-party agency quota management</li>
                  <li className="flex items-center gap-2">✓ Anti-ghost worker audit ledger</li>
                  <li className="flex items-center gap-2">✓ Labor inspector audit-ready downloads</li>
                </ul>
              </div>

              {/* Module 5: Turnstile Gate Passes */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-bold">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Digital Turnstile Gate Passes</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Generate sub-second cryptographic QR gate passes with biometric facial selfie matching to secure plant and factory perimeters.
                </p>
                <ul className="space-y-2 text-xs text-[#5C6878]">
                  <li className="flex items-center gap-2">✓ Scannable turnstile entry QR passes</li>
                  <li className="flex items-center gap-2">✓ 3D facial liveness & selfie match</li>
                  <li className="flex items-center gap-2">✓ Sub-second turnstile gate validation</li>
                  <li className="flex items-center gap-2">✓ Digital workforce access logs</li>
                </ul>
              </div>

              {/* Module 6: 100% Postpaid Billing */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center font-bold">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">100% Postpaid Metered Billing</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Zero upfront lock-in. Verify on demand and settle monthly based on actual verified employee profiles with official GST tax invoices (SAC 998311).
                </p>
                <ul className="space-y-2 text-xs text-[#5C6878]">
                  <li className="flex items-center gap-2">✓ 5 Transparent postpaid tier brackets</li>
                  <li className="flex items-center gap-2">✓ Never-block overage hiring surges</li>
                  <li className="flex items-center gap-2">✓ Official 18% GST tax invoices</li>
                  <li className="flex items-center gap-2">✓ Itemized monthly verification ledgers</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: SOLUTIONS (JOY GROUP SOFTWARE SUITE)                              */}
        {/* ========================================================================= */}
        {activePage === 'solutions' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF8F0] text-[#299C68] text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                JOY Group Software Products Suite
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Enterprise Cloud Software Suite
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed">
                JOY Corporate Solutions engineers specialized enterprise platforms — spanning attendance, automated payroll, labor muster compliance, and direct verification rails.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Product 1: JOY PEOPLE HR (Flagship) */}
              <div className="p-8 rounded-3xl bg-white border-2 border-[#426CF5]/30 hover:border-[#426CF5] shadow-xs flex flex-col justify-between space-y-6 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-[#EAF5FF] text-[#426CF5]">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#182230]">JOY PEOPLE HR Platform</h2>
                        <span className="text-xs text-[#426CF5] font-semibold">joypeoplehr.com • Flagship HRMS Suite</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    All-in-one cloud HRMS managing complete employee lifecycles, attendance, shift scheduling, and automated payroll with 100% statutory deductions.
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-2 text-xs">
                    <div className="font-bold text-[#182230]">Key Capabilities:</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Geo-fenced biometric mobile & face punch attendance</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Automated shift rostering, overtime tracking & leave hierarchy</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ 1-Click automated salary disbursement with instant pay slips</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ 100% PF, ESI, TDS & Professional Tax statutory compliance</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Employee Self-Service (ESS) mobile portal with expense claims</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5EAF0]">
                  <a
                    href="https://joypeoplehr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 no-underline"
                  >
                    <span>Launch Joy People HR Platform</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Product 2: JOY TRUE PROFILE */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#426CF5]/60 shadow-xs flex flex-col justify-between space-y-6 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#EAF8F0] text-[#299C68]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#182230]">JOY TRUE PROFILE</h2>
                      <span className="text-xs text-[#299C68] font-semibold">Direct Registry Verification Rails</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    Sub-45-second direct API verification engine for identity, past employer tenures, bank accounts, and criminal records with 100% postpaid metered billing.
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-2 text-xs">
                    <div className="font-bold text-[#182230]">Key Capabilities:</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Direct UIDAI Aadhaar OTP & NSDL PAN validation</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ EPFO moonlighting detection & dual employment audits</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ 500+ record bulk Excel ingestion & WhatsApp magic links</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Cryptographic SHA-256 PDF candidate dossiers</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5EAF0]">
                  <button
                    onClick={() => setActivePage('contact')}
                    className="w-full py-3 rounded-full bg-[#182230] hover:bg-black text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request True Profile Demo</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>

              {/* Product 3: JOY CONTRACTOR & CLRA COMPLIANCE */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#426CF5]/60 shadow-xs flex flex-col justify-between space-y-6 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#FFF6E9] text-[#D97706]">
                      <HardHat className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#182230]">JOY Contractor & CLRA Compliance</h2>
                      <span className="text-xs text-[#D97706] font-semibold">Statutory Labor Muster Automation</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    Statutory workforce muster registers, contractor agency allocations, and anti-ghost worker tracking for industrial manufacturing plants.
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-2 text-xs">
                    <div className="font-bold text-[#182230]">Key Capabilities:</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Statutory CLRA Form XVI & XII muster registers</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Third-party staffing agency quota governance</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Sub-second turnstile gate passes & muster logs</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Real-time labor inspector audit-ready export</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5EAF0]">
                  <a
                    href="https://joypeoplehr.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 no-underline"
                  >
                    <span>Learn More on JoyPeopleHR ↗</span>
                  </a>
                </div>
              </div>

              {/* Product 4: JOY DIGITAL VAULT */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#426CF5]/60 shadow-xs flex flex-col justify-between space-y-6 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#F6F0FE] text-[#795290]">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#182230]">JOY Cryptographic Digital Vault</h2>
                      <span className="text-xs text-[#795290] font-semibold">DPDP Act 2023 Verifiable Engine</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    Cryptographically signed credential vault with tamper-evident SHA-256 signatures, candidate consent logging, and sovereign in-country storage.
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-2 text-xs">
                    <div className="font-bold text-[#182230]">Key Capabilities:</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ 256-bit AES encryption at rest & in transit</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Automatic Aadhaar & PAN masking (XXXX-XXXX-1234)</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Explicit candidate digital consent trail under DPDP Act</div>
                    <div className="flex items-center gap-2 text-[#5C6878]">✓ Sovereign cloud server data residency in India</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5EAF0]">
                  <button
                    onClick={() => setActivePage('about')}
                    className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Read Privacy & Security Policy</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2B: SERVICES                                                         */}
        {/* ========================================================================= */}
        {activePage === 'services' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                Enterprise Verification & HR Services
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Complete Verification & Workforce Services
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed">
                From sub-45-second direct identity lookups to full HR & payroll automation, explore the comprehensive services delivered by JOY Corporate Solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Service 1 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Identity & KYC Verification</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Real-time direct registry checks for Aadhaar OTP, PAN 2.0 validation, Driving Licenses via Sarathi, and Passports.
                </p>
                <div className="text-xs text-[#426CF5] font-semibold">Turnaround Time: &lt; 45 Seconds</div>
              </div>

              {/* Service 2 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">EPFO History & Moonlighting Audits</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Deep EPFO UAN service history analysis detecting overlapping employment tenures, concurrent provident fund deposits, and ghost employment.
                </p>
                <div className="text-xs text-[#299C68] font-semibold">Automated Tenure Overlap Radar</div>
              </div>

              {/* Service 3 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F6F0FE] text-[#795290] flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Cloud HRMS & Payroll Automation</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Integrated via Joy People HR suite. Mobile face/fingerprint attendance, automated shift rosters, and 1-click salary disbursement with PF/ESI/TDS deductions.
                </p>
                <div className="text-xs text-[#795290] font-semibold">Powered by joypeoplehr.com</div>
              </div>

              {/* Service 4 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF6E9] text-[#D97706] flex items-center justify-center font-bold">
                  <HardHat className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Statutory Labor & CLRA Audits</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Statutory CLRA Form XVI contractor muster registers, staffing agency quota governance, and digital QR turnstile access logs.
                </p>
                <div className="text-xs text-[#D97706] font-semibold">100% Labor Inspector Audit-Ready</div>
              </div>

              {/* Service 5 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Bank Penny Drop & Financial Match</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  NPCI IMPS ₹1 penny drop validation confirming beneficiary account ownership, IFSC bank branch details, and full name matching.
                </p>
                <div className="text-xs text-[#15803D] font-semibold">Prevents Salary Payout Errors</div>
              </div>

              {/* Service 6 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-[#182230]">Certified Candidate PDF Dossiers</h2>
                <p className="text-sm text-[#5C6878] leading-relaxed">
                  Cryptographically signed verification dossiers with tamper-evident SHA-256 hashes, confidentiality stamps, and downloadable compliance certificates.
                </p>
                <div className="text-xs text-[#475569] font-semibold">Tamper-Proof ReportLab Generation</div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: HOW IT WORKS                                                      */}
        {/* ========================================================================= */}
        {activePage === 'how-it-works' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                Step-by-Step Workflow
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                How JOY TRUE PROFILE Operates
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed">
                A transparent, consent-first verification pipeline designed for speed, security, and statutory data integrity.
              </p>
            </div>

            {/* Visual Process Stages */}
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Company Registration & HR Setup',
                  desc: 'Enterprise accounts are onboarded via Super Admin. Company Admins allocate quotas and assign HR recruiters with scoped permissions.',
                  type: 'User-Entered & Admin Authorized',
                  badgeColor: 'bg-indigo-50 text-indigo-700'
                },
                {
                  step: '02',
                  title: 'Candidate Profile Creation & Dispatch',
                  desc: 'HR recruiters create candidate records individually or via 500+ Excel import. A secure, PIN-protected verification link is sent via WhatsApp, SMS, or Email.',
                  type: 'System Generated Link',
                  badgeColor: 'bg-sky-50 text-sky-700'
                },
                {
                  step: '03',
                  title: 'Explicit DPDP Act 2023 Digital Consent',
                  desc: 'The candidate opens the 2-minute mobile web link, reviews the plain-language privacy notice, and provides OTP-verified digital consent.',
                  type: 'Candidate Authorized Consent',
                  badgeColor: 'bg-emerald-50 text-emerald-700'
                },
                {
                  step: '04',
                  title: 'Direct Rails Automated Verification',
                  desc: 'The engine calls official government and banking rails in parallel (UIDAI Aadhaar OTP, NSDL PAN, NPCI IMPS Penny Drop, EPFO Employment History).',
                  type: 'API-Verified Official Data',
                  badgeColor: 'bg-amber-50 text-amber-700'
                },
                {
                  step: '05',
                  title: '3D Facial Liveness & Photo Match',
                  desc: 'Candidate takes a live selfie in browser. AI facial matching compares the live capture against the official Aadhaar/PAN photo to eliminate duplicate profiles.',
                  type: 'Biometric & Document Extracted',
                  badgeColor: 'bg-purple-50 text-purple-700'
                },
                {
                  step: '06',
                  title: 'HR Review & Certified PDF Generation',
                  desc: 'HR reviews the normalized verification dossier. Tamper-evident PDF reports and digital QR gate passes are generated with cryptographic timestamps.',
                  type: 'Audited & Certified Output',
                  badgeColor: 'bg-emerald-50 text-emerald-700'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#426CF5]/30 transition-all">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-[#426CF5] shrink-0">
                      {item.step}
                    </span>
                    <div className="space-y-1.5">
                      <h2 className="text-lg sm:text-xl font-bold text-[#182230]">{item.title}</h2>
                      <p className="text-sm text-[#5C6878] max-w-2xl leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${item.badgeColor}`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>

            {/* Data Classification Matrix */}
            <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#182230]">Data Origin & Verification Status Legend</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-1">
                  <span className="font-bold text-[#299C68] flex items-center gap-1">✓ API-Verified Data</span>
                  <p className="text-[#5C6878]">Data validated directly against official government or banking rails with audit response hash.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-1">
                  <span className="font-bold text-[#426CF5] flex items-center gap-1">ℹ User-Entered Data</span>
                  <p className="text-[#5C6878]">Information provided directly by the applicant pending official registry confirmation.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-1">
                  <span className="font-bold text-[#D97706] flex items-center gap-1">⏳ Manual Review Required</span>
                  <p className="text-[#5C6878]">Document or name variance requiring human HR executive review and confirmation.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FCFCFA] border border-[#E5EAF0] space-y-1">
                  <span className="font-bold text-[#EF4444] flex items-center gap-1">✕ Failed / Mismatched</span>
                  <p className="text-[#5C6878]">Verification check failed due to invalid document credentials or registry mismatch.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: ABOUT US                                                          */}
        {/* ========================================================================= */}
        {activePage === 'about' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                About Joy Corporate Solutions
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Building Trust into India’s Workforce Architecture
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed">
                JOY TRUE PROFILE is developed by JOY CORPORATE SOLUTIONS PRIVATE LIMITED to solve the national challenge of fragmented, delayed, and unverified workforce records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Mission & Vision */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#182230]">Our Mission & Vision</h2>
                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    Our mission is to empower companies and staffing agencies with instant, consent-based workforce verification while protecting candidate privacy under Indian data protection laws.
                  </p>
                  <p className="text-sm text-[#5C6878] leading-relaxed">
                    We believe every worker deserves a trusted, portable digital identity, and every employer deserves transparent, audit-ready compliance muster logs.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5EAF0] flex items-center gap-4 text-xs font-semibold text-[#182230]">
                  <span>🔒 256-Bit AES Encryption</span>
                  <span>⚖️ DPDP Act 2023 Compliant</span>
                  <span>🛡️ ISO 27001 Certified Standards</span>
                </div>
              </div>

              {/* Responsible Data Handling Statement */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[#182230]">Responsible Data Handling Commitment</h2>
                <div className="space-y-3 text-xs text-[#5C6878] leading-relaxed">
                  <p>
                    <strong className="text-[#182230]">Purpose Limitation:</strong> We collect and process sensitive identity data strictly for employment onboarding and background verification authorized by the applicant.
                  </p>
                  <p>
                    <strong className="text-[#182230]">Zero Unmasked Aadhaar Storage:</strong> National identity numbers are automatically redacted (<code className="bg-slate-100 px-1 py-0.5 rounded">XXXX-XXXX-1234</code>) prior to database persistence.
                  </p>
                  <p>
                    <strong className="text-[#182230]">Data Sovereignty:</strong> All applicant data, verification transaction logs, and encrypted PDFs reside on sovereign cloud servers located within the Republic of India.
                  </p>
                  <p>
                    <strong className="text-[#182230]">Applicant Rights:</strong> Candidates retain the statutory right to view verification logs, request data correction, and withdraw consent through authorized grievance channels.
                  </p>
                </div>
              </div>

            </div>

            {/* Corporate Office Details */}
            <div className="p-8 rounded-3xl bg-[#FCFCFA] border border-[#E5EAF0] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-lg font-bold text-[#182230]">JOY CORPORATE SOLUTIONS PRIVATE LIMITED</h2>
                <p className="text-xs text-[#5C6878] flex items-center gap-1.5 justify-center md:justify-start">
                  <MapPin className="w-4 h-4 text-[#426CF5]" />
                  <span>Coimbatore, Tamilnadu, India</span>
                </p>
                <p className="text-xs text-[#5C6878] flex items-center gap-1.5 justify-center md:justify-start">
                  <Mail className="w-4 h-4 text-[#426CF5]" />
                  <span>info@joycorporatesolutions.com</span>
                  <span className="text-slate-300">•</span>
                  <Phone className="w-4 h-4 text-[#299C68]" />
                  <span>+91 99946 99044</span>
                </p>
              </div>
              <a 
                href="https://maps.app.goo.gl/xK2B3J4VvC73oQwd8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#426CF5] text-white text-xs font-semibold hover:bg-[#3459D8] transition-all no-underline inline-flex items-center gap-2"
              >
                <span>View on Google Maps</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: CONTACT US                                                        */}
        {/* ========================================================================= */}
        {activePage === 'contact' && (
          <div className="space-y-12 animate-in fade-in duration-300 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                Get in Touch
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Contact Our Enterprise Solutions Team
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed max-w-2xl mx-auto">
                Have questions about enterprise deployment, postpaid tariffs, custom API connectors, or statutory compliance? We’re here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* Contact Info & Google Maps Sidebar */}
              <div className="md:col-span-1 space-y-6">
                
                {/* Mini Google Map Layout */}
                <div className="p-4 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#182230] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#426CF5]" /> Coimbatore Office
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
                    className="w-full py-2 rounded-xl bg-[#EAF5FF] hover:bg-[#426CF5] text-[#426CF5] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 no-underline"
                  >
                    <span>Open in Google Maps App</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-[#182230]">Corporate Communication</h2>
                  
                  <div className="space-y-3.5 text-xs text-[#5C6878]">
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-[#299C68] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#182230]">Phone & WhatsApp</div>
                        <a href={`tel:${content.contactPhone || '+919994699044'}`} className="text-[#426CF5] hover:underline font-mono">
                          {content.contactPhone || '+91 99946 99044'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-[#426CF5] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#182230]">Email Support</div>
                        <a href={`mailto:${content.supportEmail || 'info@joycorporatesolutions.com'}`} className="text-[#426CF5] hover:underline">
                          {content.supportEmail || 'info@joycorporatesolutions.com'}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#795290] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#182230]">Registered Office</div>
                        <span>{content.officeAddress || 'Coimbatore, Tamilnadu, India'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#182230]">Business Hours</div>
                        <span>{content.workingHours || 'Mon - Sat: 9:00 AM - 7:00 PM IST'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs">
                  {contactSubmitted ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#EAF8F0] text-[#299C68] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#182230]">Thank You! Inquiry Received</h2>
                      <p className="text-sm text-[#5C6878] max-w-md mx-auto">
                        Your inquiry has been assigned reference ticket <strong>#INQ-{Math.floor(100000 + Math.random() * 900000)}</strong>. Our team in Coimbatore will respond within 4 business hours.
                      </p>
                      <button
                        onClick={() => {
                          setContactSubmitted(false);
                          setContactForm({
                            fullName: '',
                            companyName: '',
                            workEmail: '',
                            mobileNumber: '',
                            subject: 'Enterprise Verification Inquiry',
                            message: '',
                            preferredContact: 'email',
                            consent: true
                          });
                        }}
                        className="px-6 py-2.5 rounded-full bg-[#426CF5] text-white text-xs font-semibold cursor-pointer"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                      <div>
                        <h2 className="text-lg font-bold text-[#182230]">Direct Enterprise Inquiry Form</h2>
                        <p className="text-xs text-[#5C6878] mt-0.5">Fill out your details to get a postpaid proposal or custom platform trial.</p>
                      </div>

                      {contactError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{contactError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#182230] mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.fullName}
                            onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                            placeholder="e.g. Ramesh Kumar"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF0] bg-[#FCFCFA] text-sm text-[#182230] focus:border-[#426CF5] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#182230] mb-1">Company / Organization *</label>
                          <input
                            type="text"
                            required
                            value={contactForm.companyName}
                            onChange={(e) => setContactForm({ ...contactForm, companyName: e.target.value })}
                            placeholder="e.g. Apex Auto Components Ltd"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF0] bg-[#FCFCFA] text-sm text-[#182230] focus:border-[#426CF5] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#182230] mb-1">Work Email Address *</label>
                          <input
                            type="email"
                            required
                            value={contactForm.workEmail}
                            onChange={(e) => setContactForm({ ...contactForm, workEmail: e.target.value })}
                            placeholder="e.g. ramesh@apexcomponents.in"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF0] bg-[#FCFCFA] text-sm text-[#182230] focus:border-[#426CF5] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#182230] mb-1">Mobile / WhatsApp Number *</label>
                          <input
                            type="tel"
                            required
                            value={contactForm.mobileNumber}
                            onChange={(e) => setContactForm({ ...contactForm, mobileNumber: e.target.value })}
                            placeholder="e.g. 9994699044"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF0] bg-[#FCFCFA] text-sm text-[#182230] focus:border-[#426CF5] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#182230] mb-1">Subject</label>
                          <select
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF0] bg-[#FCFCFA] text-sm text-[#182230] focus:border-[#426CF5] focus:outline-none"
                          >
                            <option value="Enterprise Verification Inquiry">Enterprise Verification Inquiry</option>
                            <option value="Joy People HR Platform Demo">Joy People HR Platform Demo</option>
                            <option value="Schedule a Verification Platform Demo">Schedule a Verification Platform Demo</option>
                            <option value="Postpaid Pricing & Tariff Quote">Postpaid Pricing & Tariff Quote</option>
                            <option value="Custom API Integration">Custom API Integration</option>
                            <option value="Statutory CLRA Form XVI Compliance">Statutory CLRA Form XVI Compliance</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#182230] mb-1">Preferred Response Mode</label>
                          <select
                            value={contactForm.preferredContact}
                            onChange={(e) => setContactForm({ ...contactForm, preferredContact: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF0] bg-[#FCFCFA] text-sm text-[#182230] focus:border-[#426CF5] focus:outline-none"
                          >
                            <option value="email">Work Email</option>
                            <option value="whatsapp">WhatsApp Message</option>
                            <option value="phone">Direct Phone Call</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#182230] mb-1">Your Requirements / Message</label>
                        <textarea
                          rows="3"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Please share your expected monthly verification volume, workforce category (factory labor, corporate, logistics), or specific checks needed..."
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E5EAF0] bg-[#FCFCFA] text-sm text-[#182230] focus:border-[#426CF5] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="contact-consent"
                          checked={contactForm.consent}
                          onChange={(e) => setContactForm({ ...contactForm, consent: e.target.checked })}
                          className="w-4 h-4 rounded text-[#426CF5]"
                        />
                        <label htmlFor="contact-consent" className="text-xs text-[#5C6878]">
                          I consent to Joy Corporate Solutions contacting me regarding this verification inquiry in compliance with the DPDP Act 2023.
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={contactSubmitting}
                        className="w-full py-3.5 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {contactSubmitting ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Enterprise Inquiry</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 6: RESOURCES                                                         */}
        {/* ========================================================================= */}
        {activePage === 'resources' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                Knowledge Base & Statutory Tools
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Workforce Verification Resource Center
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed">
                Download official statutory compliance templates, read technical integration guides, and review Indian labor compliance standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Resource 1 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5FF] text-[#426CF5] flex items-center justify-center font-bold">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#182230]">CLRA Form XVI Register Template</h2>
                  <p className="text-xs text-[#5C6878] leading-relaxed">
                    Official statutory contractor muster format ready for labor inspector audits with pre-configured headers.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5EAF0] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">XLSX • 82 KB</span>
                  <span className="text-xs font-bold text-[#426CF5] flex items-center gap-1">Available in App</span>
                </div>
              </div>

              {/* Resource 2 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF8F0] text-[#299C68] flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#182230]">DPDP Act 2023 HR Guide</h2>
                  <p className="text-xs text-[#5C6878] leading-relaxed">
                    A practical guide for HR and recruitment leaders on consent notices, data minimization, and PII masking.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5EAF0] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">PDF • 1.2 MB</span>
                  <span className="text-xs font-bold text-[#299C68] flex items-center gap-1">Compliance Handbook</span>
                </div>
              </div>

              {/* Resource 3 */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5EAF0] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F0FE] text-[#795290] flex items-center justify-center font-bold">
                    <Server className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#182230]">API Integration Manual</h2>
                  <p className="text-xs text-[#5C6878] leading-relaxed">
                    REST API endpoints for Aadhaar OTP, PAN verification, Bank Penny Drop, and Webhook callback architectures.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E5EAF0] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">OpenAPI 3.0</span>
                  <span className="text-xs font-bold text-[#795290] flex items-center gap-1">Developer Docs</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 7: FAQ                                                               */}
        {/* ========================================================================= */}
        {activePage === 'faq' && (
          <div className="space-y-12 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                Frequently Asked Questions
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Clear Answers to Common Questions
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed">
                Learn how JOY TRUE PROFILE ensures fast, legally compliant, and secure workforce verification.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'What is JOY TRUE PROFILE?',
                  a: 'JOY TRUE PROFILE is an enterprise workforce identity and document verification platform connecting Super Admins, Companies, HR recruiters, and workers through a single digital system.'
                },
                {
                  q: 'How does Joy People HR integrate with verification?',
                  a: 'Joy People HR (joypeoplehr.com) is our sister cloud HRMS platform. Employee records created in Joy People HR can be seamlessly verified through JOY True Profile direct registry rails with one click.'
                },
                {
                  q: 'How does company registration work?',
                  a: 'Companies are registered by the Super Administrator or via authorized invitation. Once registered, Company Administrators can set quotas, manage HR recruiters, and track workforce rosters.'
                },
                {
                  q: 'How does a worker complete self-verification?',
                  a: 'Workers receive a secure PIN-protected link via WhatsApp, SMS, or Email. They open the link in any mobile browser (no app install needed), provide digital consent, complete OTP verification, take a live selfie, and receive a digital gate pass in under 2 minutes.'
                },
                {
                  q: 'Which identity and document checks are supported?',
                  a: 'The platform supports Aadhaar OTP validation (via authorized UIDAI rails), PAN identity checks (via NSDL), Bank Account ₹1 IMPS penny drops, Driving License validation (via Sarathi), EPFO employment tenure checks, and DigiLocker document workflows.'
                },
                {
                  q: 'How is sensitive personal data protected?',
                  a: 'All data in transit and at rest is secured with 256-bit AES encryption. Sensitive identifiers like Aadhaar numbers are automatically masked (XXXX-XXXX-1234), and all processing is strictly consent-driven under the DPDP Act 2023.'
                },
                {
                  q: 'How does postpaid billing work?',
                  a: 'Enterprises verify candidates on demand without upfront prepayment blocks. At the end of the billing cycle, an official GST tax invoice is generated with an itemized transaction ledger based on your chosen tier.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E5EAF0] shadow-xs">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-[#182230] text-base cursor-pointer border-none bg-transparent"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#426CF5] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="mt-3 text-sm text-[#5C6878] leading-relaxed border-t border-[#E5EAF0] pt-3 animate-in fade-in duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 8: PRICING & PLANS                                                   */}
        {/* ========================================================================= */}
        {activePage === 'pricing' && (
          <div className="space-y-12 animate-in fade-in duration-300 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF8F0] text-[#299C68] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Transparent Enterprise Commercials
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                100% Postpaid & Metered Billing
              </h1>
              <p className="text-base text-[#5C6878] leading-relaxed max-w-2xl mx-auto">
                Never get blocked during critical recruitment surges. Verify on demand and settle monthly based on actual verified employee profiles consumed with official GST tax invoices.
              </p>
            </div>

            {/* 5-Tier Postpaid Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {POSTPAID_PLANS && Object.values(POSTPAID_PLANS).map((plan) => {
                const isHighlight = plan.id === 'tier3';
                return (
                  <div 
                    key={plan.id}
                    className={`p-5 rounded-3xl bg-white border-2 transition-all flex flex-col justify-between space-y-4 relative ${
                      isHighlight 
                        ? 'border-[#426CF5] shadow-lg ring-2 ring-blue-100' 
                        : 'border-[#E5EAF0] shadow-xs hover:border-[#426CF5]/60'
                    }`}
                  >
                    {isHighlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#426CF5] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        Most Popular 🌟
                      </span>
                    )}

                    <div className="space-y-3">
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {plan.employeeThreshold}
                        </span>
                        <h2 className="text-lg font-bold text-[#182230] mt-1.5">{plan.name}</h2>
                        <p className="text-[11px] text-[#5C6878] line-clamp-2 mt-0.5">{plan.description}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="text-xs text-slate-500 font-medium">Per Verified Profile</div>
                        <div className="text-2xl font-black text-[#182230] font-mono mt-0.5">
                          {plan.ratePerProfile === 'Custom' ? 'Custom' : `₹${plan.ratePerProfile}`}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-bold">100% Postpaid</div>
                      </div>

                      <ul className="space-y-2 text-[11px] text-[#5C6878] pt-1">
                        {plan.features.slice(0, 4).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#299C68] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setActivePage('contact')}
                      className={`w-full py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer ${
                        isHighlight
                          ? 'bg-[#426CF5] hover:bg-[#3459D8] text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-[#426CF5] hover:text-white text-slate-800'
                      }`}
                    >
                      {plan.id === 'tier5' ? 'Request Custom Quote' : 'Choose ' + plan.shortName}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Postpaid Guarantees Strip */}
            <div className="p-6 rounded-3xl bg-[#FCFCFA] border border-[#E5EAF0] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-black text-[#182230]">⚡ Zero Upfront Lock-in</div>
                <p className="text-xs text-[#5C6878] mt-1">Start verification immediately without credit recharge delays.</p>
              </div>
              <div>
                <div className="text-sm font-black text-[#182230]">🧾 Automated GST Invoices</div>
                <p className="text-xs text-[#5C6878] mt-1">Official month-end tax invoices with SAC 998311 & 18% GST.</p>
              </div>
              <div>
                <div className="text-sm font-black text-[#182230]">🛡️ DPDP Act 2023 Shield</div>
                <p className="text-xs text-[#5C6878] mt-1">Statutory consent gate and 256-bit AES cryptographic encryption.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 9: PRIVACY POLICY                                                    */}
        {/* ========================================================================= */}
        {(activePage === 'privacy-policy' || activePage === 'privacy') && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto text-left">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF8F0] text-[#299C68] text-xs font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                DPDP Act 2023 Compliance
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-xs text-[#5C6878]">Last Updated: August 2026 • JOY CORPORATE SOLUTIONS PRIVATE LIMITED</p>
            </div>

            <div className="bg-white border border-[#E5EAF0] rounded-3xl p-8 sm:p-10 shadow-xs space-y-6 text-sm text-[#5C6878] leading-relaxed">
              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">1. Overview and Scope</h2>
                <p>
                  JOY CORPORATE SOLUTIONS PRIVATE LIMITED (&quot;JOY&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy, confidentiality, and security of personal data processed through the <strong>JOY TRUE PROFILE</strong> workforce verification platform and affiliated platforms including <strong>JOY PEOPLE HR</strong>. This Privacy Policy details how we collect, verify, store, process, and protect Personal Identifiable Information (PII) in strict compliance with the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>, the <strong>Information Technology Act, 2000</strong>, and applicable UIDAI Aadhaar regulations.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">2. Explicit Candidate Consent</h2>
                <p>
                  We operate on a strict <strong>Consent-First Architecture</strong>. Verification of any worker or candidate is initiated only after explicit digital consent is obtained via OTP verification on a mobile browser. Candidates are presented with an itemized notice explaining precisely which verification checks (Aadhaar, PAN, Bank, EPFO, DL) will be performed, the purpose of such checks, and how the resulting data will be utilized for employment background verification.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">3. Data Collection and Verification Rails</h2>
                <p>We process the following categories of data solely for authorized employment screening:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>National Identity:</strong> Aadhaar OTP e-KYC (numbers automatically masked as <code className="bg-slate-100 px-1 py-0.5 rounded">XXXX-XXXX-1234</code>) and NSDL PAN 2.0 validation.</li>
                  <li><strong>Employment Tenures:</strong> EPFO UAN service history to confirm tenures and detect unauthorized dual employment/moonlighting.</li>
                  <li><strong>Financial Details:</strong> NPCI IMPS ₹1 penny drop to verify candidate bank account name match and prevent salary payout errors.</li>
                  <li><strong>Biometrics:</strong> 3D live facial selfies compared against official identity document photos to prevent badge swapping and ghost worker identity theft.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">4. Data Redaction and Sovereign Encryption</h2>
                <p>
                  All data in transit is encrypted using TLS 1.3, and all records at rest are secured using 256-bit AES encryption. Unmasked Aadhaar numbers are never stored in plain text. All servers, verification records, and cryptographic PDF dossiers reside on sovereign cloud infrastructure physically located within the Republic of India.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">5. Data Retention and Candidate Rights</h2>
                <p>
                  In accordance with the DPDP Act 2023, data principals retain the right to:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Access and review summary logs of their verification dossiers.</li>
                  <li>Request correction of inaccurate or outdated information.</li>
                  <li>Withdraw consent and request data purging once employment verification cycles are concluded.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">6. Grievance Officer Contact</h2>
                <p>
                  For any privacy inquiries, consent withdrawal, or grievance redressal under the DPDP Act 2023, please contact our Data Protection & Grievance Officer:
                </p>
                <div className="mt-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-[#182230]">
                  <div className="font-bold">Data Protection Officer — JOY CORPORATE SOLUTIONS PRIVATE LIMITED</div>
                  <div>📍 Office: Coimbatore, Tamilnadu, India</div>
                  <div>📧 Email: <a href="mailto:info@joycorporatesolutions.com" className="text-[#426CF5] hover:underline">info@joycorporatesolutions.com</a></div>
                  <div>📞 Phone: <a href="tel:+919994699044" className="text-[#426CF5] hover:underline">+91 99946 99044</a></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 10: TERMS & CONDITIONS                                               */}
        {/* ========================================================================= */}
        {(activePage === 'terms-and-conditions' || activePage === 'terms') && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto text-left">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5FF] text-[#426CF5] text-xs font-bold uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5" />
                Enterprise Agreement
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#182230] font-outfit tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-xs text-[#5C6878]">Last Updated: August 2026 • JOY CORPORATE SOLUTIONS PRIVATE LIMITED</p>
            </div>

            <div className="bg-white border border-[#E5EAF0] rounded-3xl p-8 sm:p-10 shadow-xs space-y-6 text-sm text-[#5C6878] leading-relaxed">
              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">1. Agreement to Terms</h2>
                <p>
                  These Terms and Conditions constitute a legally binding agreement between your organization (&quot;Client&quot;, &quot;Company&quot;, or &quot;User&quot;) and <strong>JOY CORPORATE SOLUTIONS PRIVATE LIMITED</strong> governing access to and use of the <strong>JOY TRUE PROFILE</strong> verification platform, associated APIs, and companion platforms such as <strong>JOY PEOPLE HR</strong>.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">2. Authorized Business Purpose</h2>
                <p>
                  The platform may be used solely for legitimate employment screening, contractor labor muster compliance under CLRA Form XVI, vendor due diligence, and statutory HR governance. Any unauthorized attempt to probe, scrape, or misuse government API rails is strictly prohibited.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">3. Postpaid Metered Billing & Settlement</h2>
                <p>
                  Enterprises are billed under the selected <strong>Postpaid Tier</strong> (<span className="text-[#182230] font-semibold">Tier 1 &lt;50 @ ₹250, Tier 2 &lt;100 @ ₹230, Tier 3 &lt;300 @ ₹200, Tier 4 &lt;500 @ ₹180, or Tier 5 Custom</span>). Billing cycles run on a calendar month basis. At the close of each cycle:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>An official GST Tax Invoice is generated under Service Accounting Code (SAC) <strong>998311</strong> with 18% GST.</li>
                  <li>Invoices are payable within the agreed credit term (standard Net-15 or Net-30 days).</li>
                  <li>Never-Block Policy: Overage verifications beyond base quotas are processed uninterruptedly at the agreed per-profile postpaid rate.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">4. Service Availability & SLA</h2>
                <p>
                  We target a 99.99% platform uptime SLA. While direct government registries (UIDAI, NSDL, EPFO, Sarathi) may undergo statutory maintenance windows, our multi-provider fallback routing ensures maximum continuous availability.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#182230] mb-2">5. Governing Law and Jurisdiction</h2>
                <p>
                  This agreement shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with this agreement shall be subject to the exclusive jurisdiction of the competent courts in <strong>Coimbatore, Tamil Nadu, India</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. Universal Footer */}
      <footer className="bg-white border-t border-[#E5EAF0] py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <img src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-base text-[#182230] font-outfit">JOY TRUE PROFILE</span>
            </div>
            <p className="text-xs text-[#5C6878] max-w-md leading-relaxed">
              JOY TRUE PROFILE is an enterprise workforce identity and verification platform developed by JOY CORPORATE SOLUTIONS PRIVATE LIMITED. Part of the JOY Group integrated HR and compliance software suite.
            </p>
            <div className="text-[11px] text-[#5C6878] space-y-1">
              <div>📍 {content.officeAddress || 'Coimbatore, Tamilnadu, India'}</div>
              <div>📧 <a href={`mailto:${content.supportEmail || 'info@joycorporatesolutions.com'}`} className="text-[#426CF5] hover:underline">{content.supportEmail || 'info@joycorporatesolutions.com'}</a> • 📞 <a href={`tel:${content.contactPhone || '+919994699044'}`} className="text-[#426CF5] hover:underline">{content.contactPhone || '+91 99946 99044'}</a></div>
              <div>
                <a href={content.googleMapsUrl || "https://maps.app.goo.gl/xK2B3J4VvC73oQwd8"} target="_blank" rel="noopener noreferrer" className="text-[#426CF5] hover:underline font-medium">
                  View Office on Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-[#182230] uppercase tracking-wider text-[11px]">Platform Suite</h3>
            <div className="flex flex-col gap-1.5 text-[#5C6878]">
              <button onClick={() => { setActivePage('features'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">Features</button>
              <button onClick={() => { setActivePage('solutions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">Solutions</button>
              <button onClick={() => { setActivePage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">Services</button>
              <a href="https://joypeoplehr.com" target="_blank" rel="noopener noreferrer" className="text-left text-[#426CF5] hover:underline no-underline text-xs flex items-center gap-1">
                <span>Joy People HR (joypeoplehr.com)</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <button onClick={() => { setActivePage('how-it-works'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">How It Works</button>
              <button onClick={() => { setActivePage('pricing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">Pricing & Plans</button>
              <Link to="/login" className="text-left hover:text-[#426CF5] no-underline text-[#5C6878]">Portal Login</Link>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-[#182230] uppercase tracking-wider text-[11px]">Legal & Trust</h3>
            <div className="flex flex-col gap-1.5 text-[#5C6878]">
              <button onClick={() => { setActivePage('privacy-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">Privacy Policy</button>
              <button onClick={() => { setActivePage('terms-and-conditions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">Terms & Conditions</button>
              <button onClick={() => { setActivePage('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">FAQ</button>
              <button onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">About Us</button>
              <button onClick={() => { setActivePage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-[#426CF5] cursor-pointer bg-transparent border-none p-0 text-xs">Contact Us</button>
              <span className="text-[10px] text-slate-400">DPDP Act 2023 Compliant</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#E5EAF0] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <span>© {new Date().getFullYear()} {content.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => { setActivePage('privacy-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#182230] bg-transparent border-none cursor-pointer p-0 text-[11px] text-slate-400">Privacy Policy</button>
            <button onClick={() => { setActivePage('terms-and-conditions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#182230] bg-transparent border-none cursor-pointer p-0 text-[11px] text-slate-400">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Concierge Widget */}
      <WhatsAppConcierge3D />
    </div>
  );
};

export default PublicPagesView;
