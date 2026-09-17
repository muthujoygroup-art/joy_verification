import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Compass, 
  Search, 
  Sparkles, 
  UserPlus, 
  Mail, 
  Building2, 
  FileDown, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Play, 
  Pause,
  RotateCcw,
  HelpCircle,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Camera,
  Smartphone,
  HardHat,
  FileSpreadsheet,
  FileText,
  Lock,
  RefreshCw,
  Eye,
  Volume2,
  VolumeX,
  Download,
  Users,
  Award,
  Target,
  FileCheck,
  Activity,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Terminal,
  Cpu,
  Fingerprint,
  QrCode,
  Sliders,
  Maximize2,
  CreditCard,
  DollarSign,
  MapPin,
  Shield,
  CheckSquare
} from 'lucide-react';
import jsPDF from 'jspdf';
import { soundEngine } from '../utils/uiSoundEffects';
import { exportIndividualCandidateToExcel } from '../utils/employeeExcelExport';
import { INDIA_STATES_DISTRICTS, ALL_INDIA_STATES } from '../data/indiaLocations';
import confetti from 'canvas-confetti';

// ============================================================================
// 1. TACTICAL MISSIONS DATA (4 Core Requested Guided Modules)
// ============================================================================
const TACTICAL_MISSIONS = [
  {
    id: 'buy_plan',
    title: '💳 Module 1: How to Buy a Plan & Credit Balance Setup',
    shortTitle: 'How to Buy a Plan',
    category: 'billing',
    badge: 'SUBSCRIPTION & BILLING',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Step-by-step interactive walkthrough: Select postpaid credit tiers, instant Razorpay/UPI/Card deposit wallet recharge, set auto-refill guardrails, and download tax-compliant GST invoices.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Select Postpaid Credit Tier & Pricing Plan',
        targetId: 'plan-step-1',
        whatItDoes: 'Displays per-verification credit pricing tiers (Starter, Pro, Enterprise, Unlimited) with volume discounts.',
        whyItMatters: 'Helps companies choose the most cost-effective tier tailored to their hiring volume (saving up to 40% on bulk checks).',
        nextStep: 'Proceed to instant wallet recharge using Razorpay / UPI / Credit Card.',
        instruction: 'Pick your company verification tier (e.g. Corporate Pro @ ₹99/check) and view estimated monthly savings.',
        actionLabel: 'Select Plan & Proceed to Payment 💳',
        deviceView: 'tier_selection'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Instant Wallet Deposit via Razorpay / UPI QR / Card',
        targetId: 'plan-step-2',
        whatItDoes: 'Simulates instant digital payment processing via UPI QR code, Credit/Debit cards, or Corporate NetBanking.',
        whyItMatters: 'Provides zero-downtime wallet funding so recruiters can perform background checks without processing delays.',
        nextStep: 'Set low-balance threshold triggers for automatic balance alerts.',
        instruction: 'Simulate a ₹5,000 credit deposit using instant Razorpay UPI QR code or Corporate Card.',
        actionLabel: 'Simulate ₹5,000 Wallet Recharge 🚀',
        deviceView: 'payment_deposit'
      },
      {
        stepNumber: 3,
        title: 'Step 3: Low-Balance Threshold & Auto-Recharge Guardrails',
        targetId: 'plan-step-3',
        whatItDoes: 'Configures automated email & SMS low-balance alerts when credits drop below a specified limit (e.g. 20 credits).',
        whyItMatters: 'Prevents candidate screening blockages during peak hiring drives and factory shift onboarding.',
        nextStep: 'Generate and download official 18% GST tax invoice.',
        instruction: 'Configure balance alert threshold (e.g. 20 credits) and test automated notification trigger.',
        actionLabel: 'Configure & Test Balance Alert 🔔',
        deviceView: 'balance_alerts'
      },
      {
        stepNumber: 4,
        title: 'Step 4: Statutory GST Tax Invoice & Metered Consumption Ledger',
        targetId: 'plan-step-4',
        whatItDoes: 'Generates itemized 18% GST tax invoices with HSN/SAC code 998313 and downloadable transaction ledger.',
        whyItMatters: 'Enables 100% statutory tax accounting, Input Tax Credit (ITC) claiming, and transparent audit history.',
        nextStep: 'You are ready to begin candidate verifications!',
        instruction: 'Download sample cryptographic GST invoice and inspect per-verification meter logs.',
        actionLabel: 'Download Sample GST Invoice (PDF) 📥',
        deviceView: 'gst_invoice'
      }
    ]
  },
  {
    id: 'verification_process',
    title: '🔍 Module 2: How the Employee Profile Verification Process Works',
    shortTitle: 'How the Process Works',
    category: 'verification',
    badge: 'WORKFORCE VERIFICATION',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    description: 'Complete end-to-end candidate background check: HR intake with 28 State & 8 UT dropdowns, WhatsApp magic link with PIN, UIDAI Aadhaar e-KYC, 3D face liveness scan, EPFO moonlighting radar, and instant certified PDF dossier export.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: HR Recruiter Candidate Intake & Check Selection',
        targetId: 'proc-step-1',
        whatItDoes: 'HR recruiter enters candidate details with cascading 28 Indian States & 8 UTs dropdowns and picks verification APIs.',
        whyItMatters: 'Ensures candidate demographics match regional databases and triggers location-specific court & police record checks.',
        nextStep: 'Dispatch encrypted magic link via WhatsApp Cloud API & SMS.',
        instruction: 'Enter candidate demographics and select required verification checks (Aadhaar, PAN, EPFO, Court, Face Liveness).',
        actionLabel: 'Dispatch WhatsApp Magic Link 🚀',
        deviceView: 'recruiter_intake'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Candidate WhatsApp Magic Link & 4-Digit Security PIN',
        targetId: 'proc-step-2',
        whatItDoes: 'Candidate receives zero-install mobile link on WhatsApp/SMS and unlocks portal using 4-digit PIN (1234).',
        whyItMatters: 'Requires no app downloads, achieving a 98.2% candidate completion rate in under 2 minutes.',
        nextStep: 'Authenticate government identity via UIDAI Aadhaar e-KYC OTP.',
        instruction: 'Candidate opens magic link on mobile browser, enters PIN "1234", and grants explicit consent.',
        actionLabel: 'Enter PIN 1234 & Unlock Portal 🔓',
        deviceView: 'whatsapp_pin'
      },
      {
        stepNumber: 3,
        title: 'Step 3: UIDAI Aadhaar e-KYC & NSDL PAN 2.0 Realtime Match',
        targetId: 'proc-step-3',
        whatItDoes: 'Direct UIDAI OTP demographic verification with automated Aadhaar masking (XXXX-XXXX-8921) and NSDL PAN 2.0 match.',
        whyItMatters: 'Guarantees government-grade identity verification while complying with UIDAI privacy regulations.',
        nextStep: 'Capture 3D AI biometric liveness selfie to prevent photo spoofing.',
        instruction: 'Perform simulated UIDAI OTP validation (567890) to match demographic data.',
        actionLabel: 'Verify UIDAI Aadhaar OTP 🆔',
        deviceView: 'aadhaar_pan'
      },
      {
        stepNumber: 4,
        title: 'Step 4: 3D AI Biometric Anti-Spoofing Liveness Selfie Scan',
        targetId: 'proc-step-4',
        whatItDoes: 'Captures 68-point 3D facial mesh to verify anti-spoofing liveness and match face against Aadhaar photo.',
        whyItMatters: 'Eliminates candidate impersonation fraud, photo-of-photo spoofing, and AI deepfake manipulations.',
        nextStep: 'Audit EPFO provident fund radar for dual employment and moonlighting.',
        instruction: 'Align camera to scan 3D face mesh and compute biometric confidence score (99.98%).',
        actionLabel: 'Capture 3D Live Selfie 🤳',
        deviceView: 'face_biometric'
      },
      {
        stepNumber: 5,
        title: 'Step 5: EPFO UAN Moonlighting Radar Audit',
        targetId: 'proc-step-5',
        whatItDoes: 'Sweeps EPFO member portal using candidate UAN to audit active provident fund contributions and detect concurrent jobs.',
        whyItMatters: 'Protects company IP, confidentiality, and statutory labor compliance by catching undeclared dual employment.',
        nextStep: 'Compile certified 360° cryptographic PDF dossier & master Excel sheet.',
        instruction: 'Trigger EPFO sonar radar sweep to audit candidate employment history timeline.',
        actionLabel: 'Sweep EPFO Moonlighting Radar 🛡️',
        deviceView: 'epfo_radar'
      },
      {
        stepNumber: 6,
        title: 'Step 6: Certified 360° PDF Dossier & 5-Tab Excel Export',
        targetId: 'proc-step-6',
        whatItDoes: 'Exports SHA-256 signed cryptographic PDF verification dossier and 50+ column master Excel spreadsheet.',
        whyItMatters: 'Provides recruiters with tamper-proof statutory proof for labor compliance and internal security audits.',
        nextStep: 'Verification cycle complete! Candidate profile archived safely.',
        instruction: 'Download official sample PDF dossier and multi-tab Excel workbook.',
        actionLabel: 'Download Verified 360° Dossier (PDF) 📥',
        deviceView: 'dossier_ready'
      }
    ]
  },
  {
    id: 'data_handling',
    title: '🛡️ Module 3: Data Handling & Security Governance',
    shortTitle: 'Data Handling & Security',
    category: 'security',
    badge: 'DPDP ACT & PRIVACY',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    description: 'Security awareness and compliance walkthrough: Explicit multi-lingual candidate consent under DPDP Act 2023, automated PII masking, 256-bit AES encryption at rest, and sovereign Indian data residency.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Multi-Lingual Explicit Digital Consent Gate (DPDP Act 2023)',
        targetId: 'sec-step-1',
        whatItDoes: 'Presents explicit digital consent terms in candidate language specifying data purpose, scope, and retention duration.',
        whyItMatters: 'Enforces strict statutory compliance under Digital Personal Data Protection (DPDP) Act 2023 Section 6.',
        nextStep: 'Automatically mask government identifiers (Aadhaar & Bank numbers).',
        instruction: 'Review candidate consent parameters and click to grant explicit digital authorization.',
        actionLabel: 'Grant Explicit Candidate Consent 📝',
        deviceView: 'consent_gate'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Automated Government PII Masking & Data Minimization',
        targetId: 'sec-step-2',
        whatItDoes: 'Masks first 8 digits of Aadhaar (XXXX-XXXX-8921), redacts bank account numbers, and strips unneeded PII.',
        whyItMatters: 'Prevents identity theft and satisfies UIDAI & RBI data minimization regulations.',
        nextStep: 'Encrypt candidate data using AES-256 at rest and TLS 1.3 in transit.',
        instruction: 'Toggle raw vs masked view to see automatic PII obfuscation in real time.',
        actionLabel: 'Test Automated PII Masking Engine 🔒',
        deviceView: 'pii_masking'
      },
      {
        stepNumber: 3,
        title: 'Step 3: AES-256 Encryption at Rest & TLS 1.3 Transport Security',
        targetId: 'sec-step-3',
        whatItDoes: 'Secures candidate documents and verification results using AES-256-GCM encryption and TLS 1.3 network transport.',
        whyItMatters: 'Guarantees zero data leakage even in the event of hardware compromise or network interception.',
        nextStep: 'Enforce sovereign Indian data residency and candidate Right to Erasure.',
        instruction: 'Inspect cryptographic cipher status, SSL certificate handshake, and key rotation cycle.',
        actionLabel: 'Inspect Cryptographic Cipher 🔑',
        deviceView: 'encryption_status'
      },
      {
        stepNumber: 4,
        title: 'Step 4: Sovereign Indian Data Residency & Candidate Right to Erasure',
        targetId: 'sec-step-4',
        whatItDoes: 'Stores all data exclusively in MeitY-empanelled Mumbai & Hyderabad data centers with automated 30-day purge rules.',
        whyItMatters: 'Fulfills Indian data sovereignty mandates and respects candidate Right to be Forgotten.',
        nextStep: 'Security audit complete! System fully compliant.',
        instruction: 'Inspect MeitY data center locations and simulate candidate data purge request.',
        actionLabel: 'Test Candidate Data Purge (Erasure) 🧹',
        deviceView: 'data_residency'
      }
    ]
  },
  {
    id: 'company_onboarding',
    title: '🏢 Module 4: How Company Onboarding Process Works',
    shortTitle: 'Company Onboarding Process',
    category: 'onboarding',
    badge: 'ENTERPRISE ONBOARDING',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Corporate client activation walkthrough: SuperAdmin activation link & 4-digit PIN dispatch, company profile & custom corporate SMTP integration, and recruiter seat allocation with Role-Based Access Control (RBAC).',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: SuperAdmin Activation Link & 4-Digit PIN Dispatch',
        targetId: 'onb-step-1',
        whatItDoes: 'SuperAdmin registers new company entity (CIN, GSTIN, Domain) and dispatches an automated email/SMS activation link with PIN.',
        whyItMatters: 'Prevents unauthorized company account creation and establishes cryptographic corporate ownership.',
        nextStep: 'Configure company branding, logo, and custom corporate SMTP server.',
        instruction: 'Simulate opening company activation email, entering PIN "1234", and completing initial login.',
        actionLabel: 'Open Activation Email & Enter PIN 🔓',
        deviceView: 'company_activation'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Corporate Branding & Custom SMTP Mail Server Integration',
        targetId: 'onb-step-2',
        whatItDoes: 'Company uploads official logo, brand colors, and integrates custom SMTP mail server (e.g. smtp.yourcompany.com).',
        whyItMatters: 'Ensures verification emails and WhatsApp messages carry official company branding, boosting candidate response rate.',
        nextStep: 'Invite HR recruiters and assign Role-Based Access Control (RBAC).',
        instruction: 'Configure custom corporate SMTP credentials and send a test outbound verification email.',
        actionLabel: 'Dispatch Test Corporate SMTP Email 📧',
        deviceView: 'smtp_config'
      },
      {
        stepNumber: 3,
        title: 'Step 3: HR Recruiter Seat Provisioning & RBAC Scoping',
        targetId: 'onb-step-3',
        whatItDoes: 'Admin invites HR executives, Recruiter Leads, and Plant Managers, setting granular permission boundaries.',
        whyItMatters: 'Enforces strict organizational access control so recruiters only access candidates within their assigned department.',
        nextStep: 'Company onboarding complete! Start running verifications.',
        instruction: 'Add a new HR executive seat and configure access privileges.',
        actionLabel: 'Provision New HR Recruiter Seat 👤',
        deviceView: 'recruiter_rbac'
      }
    ]
  }
];

// ============================================================================
// 2. VIDEO THEATER CHANNELS
// ============================================================================
const VIDEO_CHANNELS = [
  {
    id: 'buy_plan_video',
    title: 'How to Buy a Plan & Credit Balance',
    subtitle: 'Postpaid Tiers, Razorpay UPI/Card Deposit & Tax GST Invoices',
    badge: 'PAYMENT STREAM',
    icon: CreditCard,
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    stats: [
      { label: 'Deposit Speed', value: 'Instant (<1s)' },
      { label: 'Payment Gateway', value: 'Razorpay / UPI' },
      { label: 'GST Tax Invoice', value: '18% HSN 998313' },
      { label: 'Billing Model', value: '100% Postpaid' }
    ]
  },
  {
    id: 'proc_video',
    title: 'Candidate Verification Process',
    subtitle: 'Intake, WhatsApp Magic Link, Aadhaar OTP, 3D Face & EPFO Radar',
    badge: 'WORKFLOW STREAM',
    icon: Smartphone,
    color: 'from-indigo-600 via-[#426CF5] to-cyan-500',
    stats: [
      { label: 'Completion TAT', value: '< 2 Minutes' },
      { label: 'Face Liveness', value: '99.98% 3D Mesh' },
      { label: 'EPFO Moonlighting', value: 'Sonar Sweep' },
      { label: 'Dossier Output', value: 'PDF & 5-Tab Excel' }
    ]
  },
  {
    id: 'data_video',
    title: 'Data Security & DPDP Compliance',
    subtitle: 'Multi-Lingual Digital Consent, Automated PII Masking & AES-256',
    badge: 'SECURITY STREAM',
    icon: ShieldCheck,
    color: 'from-purple-600 via-indigo-600 to-[#426CF5]',
    stats: [
      { label: 'Consent Scope', value: 'DPDP Act Sec 6' },
      { label: 'PII Redaction', value: 'Aadhaar Masked' },
      { label: 'Data Encryption', value: '256-Bit AES' },
      { label: 'Data Residency', value: 'Mumbai / Hyd' }
    ]
  },
  {
    id: 'onb_video',
    title: 'Company Onboarding & SMTP Setup',
    subtitle: 'SuperAdmin Activation Link, PIN, Corporate SMTP & HR RBAC Seats',
    badge: 'ONBOARDING STREAM',
    icon: Building2,
    color: 'from-amber-500 via-orange-600 to-rose-600',
    stats: [
      { label: 'Activation Link', value: 'PIN Protected' },
      { label: 'SMTP Rail', value: 'Custom Domain' },
      { label: 'Access Control', value: 'RBAC Scoped' },
      { label: 'Setup Time', value: '< 3 Minutes' }
    ]
  }
];

// ============================================================================
// 3. KNOWLEDGE BASE GUIDES
// ============================================================================
const GUIDE_LIBRARY = [
  {
    id: 'g_buy_plan',
    title: '💳 How to Buy a Plan & Setup Credit Balance',
    category: 'billing',
    badge: 'SUBSCRIPTION & BILLING',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    summary: 'Complete guide to picking credit tiers (Starter, Pro, Enterprise), executing instant Razorpay UPI/Card deposits, setting low balance alerts, and downloading official 18% GST tax invoices.',
    legalCitation: 'Goods and Services Tax Act 2017 & Reserve Bank of India Payment Guidelines',
    steps: [
      '1. Select your company tier based on monthly verification volume.',
      '2. Deposit credit wallet balance instantly via Razorpay UPI QR code, Credit/Debit card, or NetBanking.',
      '3. Configure low-balance threshold triggers (e.g. 20 credits) for zero-downtime notifications.',
      '4. Download itemized 18% GST tax invoices with HSN code 998313 for corporate tax accounting.'
    ]
  },
  {
    id: 'g_proc',
    title: '🔍 How the Employee Profile Verification Process Works',
    category: 'verification',
    badge: 'WORKFORCE VERIFICATION',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    summary: 'Step-by-step recruiter workflow: Recruiter intake form with 28 State & 8 UT dropdowns, WhatsApp magic link with PIN, UIDAI Aadhaar e-KYC, 3D face liveness, EPFO moonlighting audit, and instant 5-tab Excel & PDF exports.',
    legalCitation: 'Information Technology Act, 2000 (Section 43A) & Aadhaar Regulations (2016)',
    steps: [
      '1. HR Recruiter enters employee demographics and selects verification check modules.',
      '2. Candidate receives secure WhatsApp/SMS notification with a 4-digit PIN (default: 1234).',
      '3. Candidate completes UIDAI Aadhaar e-KYC via OTP (with automatic masking).',
      '4. Candidate captures a 3D live biometric selfie for anti-spoofing face match.',
      '5. System queries EPFO UAN to detect undisclosed moonlighting and overlapping tenures.',
      '6. Download certified 360° PDF dossier and 50+ column master Excel roster.'
    ]
  },
  {
    id: 'g_sec',
    title: '🛡️ Data Handling & Security Governance (DPDP Act 2023)',
    category: 'security',
    badge: 'DPDP ACT & PRIVACY',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    summary: 'Detailed overview of data privacy mandates: Multi-lingual explicit candidate consent, automated masking of Aadhaar and bank identifiers, AES-256 encryption at rest, and MeitY Indian data residency.',
    legalCitation: 'Digital Personal Data Protection (DPDP) Act 2023 (Section 6 & 8)',
    steps: [
      '1. Present multi-lingual consent agreement with explicit timestamping.',
      '2. Automatically mask first 8 digits of Aadhaar (XXXX-XXXX-8921) and redact bank details.',
      '3. Encrypt data payload using AES-256-GCM at rest and TLS 1.3 in transit.',
      '4. Store data in MeitY-empanelled Mumbai & Hyderabad data centers with 30-day purge rules.'
    ]
  },
  {
    id: 'g_onb',
    title: '🏢 How Company Onboarding Process Works',
    category: 'onboarding',
    badge: 'ENTERPRISE ONBOARDING',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    summary: 'Corporate client setup walkthrough: SuperAdmin activation link & 4-digit PIN dispatch, company profile & custom corporate SMTP integration, and recruiter seat allocation with Role-Based Access Control (RBAC).',
    legalCitation: 'Corporate Governance & Information Security Framework 2024',
    steps: [
      '1. SuperAdmin registers company profile and dispatches PIN-protected activation link.',
      '2. Company sets up corporate branding logo and integrates custom corporate SMTP mail server.',
      '3. Invite HR Recruiter leads, assign department roles, and configure RBAC access boundaries.'
    ]
  }
];

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
export const InteractiveTourGuideModal = ({ 
  isOpen = false, 
  onClose,
  onLaunchSpotlightTour
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // 4 Primary Modes: 'missions' | 'video_theater' | 'downloads' | 'guides'
  const [activeTourMode, setActiveTourMode] = useState('missions');
  
  // Mission Walkthrough State (Game-Style Split Screen)
  const [activeMissionIdx, setActiveMissionIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState(false);

  // Live Interactive Flow Test Data
  const [selectedPlanTierState, setSelectedPlanTierState] = useState('pro');
  const [depositAmountState, setDepositAmountState] = useState(5000);
  const [depositSuccessState, setDepositSuccessState] = useState(false);
  const [alertThresholdState, setAlertThresholdState] = useState(20);
  const [alertConfiguredState, setAlertConfiguredState] = useState(false);

  const [mockCandidate, setMockCandidate] = useState({
    name: 'Kavitha Ramanathan',
    role: 'Senior Automation Engineer',
    department: 'Engineering & Operations',
    state: 'Tamil Nadu',
    district: 'Chennai',
    phone: '+91 98765 43210',
    email: 'kavitha.r@joytrueprofile.sample',
    pin: '1234',
    aadhaar: '5489 1204 8921',
    pan: 'ABCDE1234F',
    uan: '100982347891',
    bank: 'HDFC Bank Ltd - 501002348912',
    ifsc: 'HDFC0001234'
  });

  const [consentGrantedState, setConsentGrantedState] = useState(false);
  const [piiMaskToggleState, setPiiMaskToggleState] = useState(true);
  const [purgeTriggeredState, setPurgeTriggeredState] = useState(false);

  const [mockCompanyOnboarding, setMockCompanyOnboarding] = useState({
    name: 'Apex Industrial Solutions Pvt Ltd',
    cin: 'U74999TN2021PTC145892',
    adminEmail: 'admin@apexsolutions.in',
    smtpHost: 'smtp.apexsolutions.in',
    smtpVerified: false,
    hrName: 'R. Muthu Kumar',
    hrRole: 'HR Recruiter Lead',
    hrAdded: false
  });

  // Step Interaction States
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceComplete, setFaceComplete] = useState(false);
  const [epfoScanning, setEpfoScanning] = useState(false);
  const [epfoComplete, setEpfoComplete] = useState(false);

  // Video Theater State
  const [activeVideoChannel, setActiveVideoChannel] = useState('buy_plan_video');
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Guides Search State
  const [guideSearchQuery, setGuideSearchQuery] = useState('');
  const [guideCategory, setGuideCategory] = useState('all');

  // Sync Open States
  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleOpen = () => setInternalOpen(true);
    window.addEventListener('open_tour_guide_modal', handleOpen);
    return () => window.removeEventListener('open_tour_guide_modal', handleOpen);
  }, []);

  // Voice Narration (Web Speech API)
  const speakVoiceInstruction = (text) => {
    if (!voiceGuideEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  const selectedMission = TACTICAL_MISSIONS[activeMissionIdx] || TACTICAL_MISSIONS[0];
  const activeStep = selectedMission.steps[currentStepIdx] || selectedMission.steps[0];
  const activeVideo = VIDEO_CHANNELS.find(c => c.id === activeVideoChannel) || VIDEO_CHANNELS[0];

  // Voice Narration Trigger when step or mission changes
  useEffect(() => {
    if (activeTourMode === 'missions' && voiceGuideEnabled && activeStep) {
      speakVoiceInstruction(`${activeStep.title}. ${activeStep.instruction}`);
    }
  }, [currentStepIdx, activeMissionIdx, activeTourMode, voiceGuideEnabled]);

  // Video Animation Scrubber Loop
  useEffect(() => {
    let interval;
    if (activeTourMode === 'video_theater' && videoPlaying && internalOpen) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + (0.5 * playbackSpeed);
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [activeTourMode, videoPlaying, playbackSpeed, internalOpen]);

  const isModalVisible = isOpen || internalOpen;
  if (!isModalVisible) return null;

  const handleModalClose = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setInternalOpen(false);
    if (onClose) onClose();
  };

  // EXPORTER FUNCTIONS (Real PDF & Excel Downloads)
  const handleDownloadSamplePdfDossier = () => {
    soundEngine.playSuccess();
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Header Banner
      doc.setFillColor(24, 34, 48);
      doc.rect(0, 0, 210, 28, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('JOY TRUE PROFILE - 360° VERIFICATION DOSSIER', 14, 13);
      
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Statutory & Biometric Workforce Verification Certificate • Tamper-Proof Audit Record', 14, 20);

      // Status Badge
      doc.setFillColor(41, 156, 104);
      doc.roundedRect(148, 8, 48, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.text('100% VERIFIED ✓', 154, 16);

      // Candidate Profile Section
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Profile Demographics & Identity', 14, 38);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 41, 196, 41);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Full Name: ${mockCandidate.name}`, 14, 49);
      doc.text(`Designation: ${mockCandidate.role}`, 14, 56);
      doc.text(`Department: ${mockCandidate.department}`, 14, 63);
      doc.text(`State / Region: ${mockCandidate.district}, ${mockCandidate.state}`, 14, 70);

      doc.text(`Mobile (WhatsApp): ${mockCandidate.phone}`, 110, 49);
      doc.text(`Official Email: ${mockCandidate.email}`, 110, 56);
      doc.text(`Aadhaar (Masked): XXXX-XXXX-8921`, 110, 63);
      doc.text(`PAN 2.0 Number: ${mockCandidate.pan}`, 110, 70);

      // Verification Checks Table
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Real-Time Verification Checks Summary', 14, 85);
      doc.line(14, 88, 196, 88);

      const checks = [
        ['UIDAI Aadhaar e-KYC', 'UIDAI Direct Rail', 'Demographics Match', 'VERIFIED ✓ (0.42s)'],
        ['Income Tax PAN 2.0', 'NSDL / ITD Rail', 'Active & Name Matched', 'VERIFIED ✓ (0.35s)'],
        ['3D AI Face Liveness', 'Anti-Spoofing Biometric Engine', '99.98% Confidence', 'VERIFIED ✓ (0.45s)'],
        ['EPFO Moonlighting Radar', 'EPFO Unified Member Portal', '0 Active Overlaps', 'CLEAN ✓ (0.61s)'],
        ['Bank Account Penny Drop', 'NPCI IMPS Fast Rail', 'Beneficiary Account Matched', 'VERIFIED ✓ (0.38s)'],
        ['DPDP Act Consent', 'Digital Encryption Vault', 'Explicit OTP Consent', 'COMPLIANT ✓']
      ];

      let yPos = 98;
      checks.forEach((chk, i) => {
        doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
        doc.rect(14, yPos - 5, 182, 8.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text(chk[0], 16, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(chk[1], 65, yPos);
        doc.text(chk[2], 115, yPos);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 156, 104);
        doc.text(chk[3], 160, yPos);
        doc.setTextColor(30, 41, 59);
        yPos += 8.5;
      });

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('JOY CORPORATE SOLUTIONS PRIVATE LIMITED • Powered by JOY TRUE PROFILE AI Platform Engine', 14, 280);

      doc.save(`JOY_TrueProfile_Dossier_${mockCandidate.name.replace(/\s+/g, '_')}.pdf`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error('PDF Generation Error:', e);
    }
  };

  const handleDownloadSampleGstInvoicePdf = () => {
    soundEngine.playSuccess();
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 30, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('TAX INVOICE (18% GST compliant)', 14, 15);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text('JOY Corporate Solutions Pvt Ltd • GSTIN: 33AAACA1234A1Z5 • HSN/SAC: 998313', 14, 23);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Invoice No: INV-2026-98124`, 14, 42);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 48);
      doc.text(`Billed To: ${mockCompanyOnboarding.name}`, 110, 42);
      doc.text(`GSTIN: ${mockCompanyOnboarding.cin}`, 110, 48);

      doc.line(14, 54, 196, 54);

      doc.setFontSize(9);
      doc.text('Description of Service', 16, 62);
      doc.text('Qty (Credits)', 110, 62);
      doc.text('Rate/Check', 140, 62);
      doc.text('Amount (INR)', 170, 62);

      doc.setFont('helvetica', 'normal');
      doc.text('Enterprise Verification Credit Wallet Refill', 16, 72);
      doc.text('50 Credits', 110, 72);
      doc.text('₹ 100.00', 140, 72);
      doc.text('₹ 5,000.00', 170, 72);

      doc.line(14, 80, 196, 80);

      doc.text('Subtotal:', 140, 88);
      doc.text('₹ 5,000.00', 170, 88);
      doc.text('CGST (9%):', 140, 94);
      doc.text('₹ 450.00', 170, 94);
      doc.text('SGST (9%):', 140, 100);
      doc.text('₹ 450.00', 170, 100);

      doc.setFont('helvetica', 'bold');
      doc.text('Total Payable:', 140, 108);
      doc.text('₹ 5,900.00', 170, 108);

      doc.save(`JOY_Tax_Invoice_${mockCompanyOnboarding.name.replace(/\s+/g, '_')}.pdf`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error('Invoice PDF error:', e);
    }
  };

  const handleDownloadSampleExcelSheet = () => {
    soundEngine.playSuccess();
    const candidateData = {
      name: mockCandidate.name,
      role: mockCandidate.role,
      department: mockCandidate.department,
      phone: mockCandidate.phone,
      email: mockCandidate.email,
      state: mockCandidate.state,
      district: mockCandidate.district,
      aadhaarNo: mockCandidate.aadhaar,
      panNo: mockCandidate.pan,
      uanEpf: mockCandidate.uan,
      status: 'VERIFIED',
      verificationDate: new Date().toISOString().split('T')[0],
      score: '99.98%'
    };
    exportIndividualCandidateToExcel(candidateData, { name: mockCompanyOnboarding.name });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const filteredGuides = GUIDE_LIBRARY.filter(g => {
    const matchesCat = guideCategory === 'all' || g.category === guideCategory;
    const matchesSearch = guideSearchQuery === '' ||
      g.title.toLowerCase().includes(guideSearchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(guideSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return createPortal((
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex justify-center items-start animate-fadeIn">
      <div className="w-full max-w-7xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 animate-modal-spring max-h-[96vh] flex flex-col overflow-hidden">
        
        {/* ==============================================================================
         * MODAL HEADER: TACTICAL GAME HUD HEADER WITH VOICE AUDIO TOGGLE
         * ============================================================================== */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-[#0e1726] to-indigo-950 text-white rounded-t-3xl border-b border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#426CF5] text-white shadow-[0_0_20px_rgba(66,108,245,0.6)] shrink-0">
              <Compass className="w-7 h-7 animate-spin-slow text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#426CF5] text-white text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-xs">
                  <Target className="w-3 h-3 text-white" />
                  <span>TACTICAL TOUR & COMMAND STATION</span>
                </span>
                <span className="text-xs text-indigo-200 font-mono font-bold bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-700/50">
                  JOY TRUE PROFILE 2.0
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-outfit mt-1 tracking-tight">
                Workforce & Vendor Verification Interactive Tour & Guide 🧭
              </h3>
            </div>
          </div>

          {/* Right Action Tools: Voice Narration, Launch Spotlight, Close */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            
            {/* Voice Audio Narration Button */}
            <button
              onClick={() => {
                const next = !voiceGuideEnabled;
                setVoiceGuideEnabled(next);
                soundEngine.playClick();
                if (next && activeStep) {
                  speakVoiceInstruction(`Voice Guide Enabled. ${activeStep.title}. ${activeStep.instruction}`);
                } else if (!next && typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
              }}
              title={voiceGuideEnabled ? 'Mute AI Voice Narration' : 'Enable AI Voice Narration'}
              className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                voiceGuideEnabled 
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                  : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border-slate-700'
              }`}
            >
              {voiceGuideEnabled ? <Volume2 className="w-4 h-4 text-white animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
              <span className="hidden md:inline">{voiceGuideEnabled ? 'Voice HUD: ON' : 'Voice HUD: OFF'}</span>
            </button>

            {/* Launch On-Page Spotlight Tour */}
            <button
              onClick={() => {
                soundEngine.playSuccess();
                handleModalClose();
                if (onLaunchSpotlightTour) {
                  onLaunchSpotlightTour();
                } else {
                  window.dispatchEvent(new CustomEvent('launch_guided_tour'));
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border border-indigo-400/40"
            >
              <Maximize2 className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">On-Page Tour</span>
            </button>

            {/* Modal Close Button */}
            <button 
              onClick={handleModalClose} 
              aria-label="Close Tour Modal"
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==============================================================================
         * 4-PILLAR PRIMARY MODE SWITCHER
         * ============================================================================== */}
        <div className="p-3 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            {[
              { id: 'missions', label: '🎮 Game-Style Guided Missions', badge: 'Interactive HUD' },
              { id: 'video_theater', label: '🎬 4K Interactive Theater', badge: '4 Channels' },
              { id: 'downloads', label: '📥 Sample PDF & Excel Hub', badge: 'Instant Export' },
              { id: 'guides', label: '📚 Complete Knowledge Library', badge: 'Searchable' }
            ].map((m) => {
              const isActive = activeTourMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveTourMode(m.id);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border ${
                    isActive
                      ? 'bg-[#426CF5] text-white border-[#3459D8] shadow-md scale-[1.02]'
                      : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <span className="font-outfit text-xs">{m.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==============================================================================
         * MODE 1: GAME-STYLE TACTICAL MISSIONS (4 Requested Guided Modules)
         * ============================================================================== */}
        {activeTourMode === 'missions' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#F8FAFC]">
            
            {/* 4 Mission Cards Selector */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-black text-slate-800 font-mono tracking-wider block">
                SELECT INTERACTIVE GUIDED WALKTHROUGH MODULE:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {TACTICAL_MISSIONS.map((m, idx) => {
                  const isSel = activeMissionIdx === idx;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setActiveMissionIdx(idx);
                        setCurrentStepIdx(0);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSel 
                          ? 'bg-white border-[#426CF5] shadow-lg ring-2 ring-[#426CF5]/30' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-500">
                          {m.steps.length} Steps
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm font-outfit text-slate-900 leading-snug">
                          {m.title}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SPLIT-SCREEN TACTICAL COMMAND STATION */}
            <div className="bg-white border-2 border-[#426CF5] rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
              
              {/* Mission Header & Stepper */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] font-mono uppercase font-black text-indigo-700 tracking-wider">
                      LIVE MODULE OBJECTIVE • STEP {currentStepIdx + 1} OF {selectedMission.steps.length}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-outfit mt-0.5 tracking-tight">
                    {selectedMission.title}
                  </h3>
                </div>

                {/* Step Navigation Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {selectedMission.steps.map((st, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        soundEngine.playClick();
                        setCurrentStepIdx(i);
                      }}
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center justify-center border ${
                        i === currentStepIdx
                          ? 'bg-[#426CF5] text-white border-[#3459D8] shadow-md scale-105'
                          : i < currentStepIdx
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {i < currentStepIdx ? '✓' : i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* GAME HUD CARD (What it does, Why it matters, Next step) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] text-white space-y-3 shadow-xl border-2 border-[#38BDF8]/40">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#38BDF8] animate-spin-slow" />
                    GAME GUIDANCE HUD • STEP {activeStep.stepNumber} OF {selectedMission.steps.length}
                  </span>
                  <span className="text-[11px] font-mono font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    CODE SIMULATION READY
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-white font-outfit tracking-tight">
                  {activeStep.title}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-indigo-900/60">
                    <span className="font-extrabold text-indigo-300 block mb-1 flex items-center gap-1">
                      🎯 What this feature does:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">{activeStep.whatItDoes}</p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-emerald-900/60">
                    <span className="font-extrabold text-emerald-300 block mb-1 flex items-center gap-1">
                      💡 Why this step is important:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">{activeStep.whyItMatters}</p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-900/60">
                    <span className="font-extrabold text-amber-300 block mb-1 flex items-center gap-1">
                      ➡️ What happens next:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">{activeStep.nextStep}</p>
                  </div>
                </div>
              </div>

              {/* SPLIT SCREEN: LEFT CONTROL CONSOLE VS RIGHT LIVE DEVICE MOCKUP CANVAS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT COLUMN (7 Cols): Interactive Controls & Action Inputs */}
                <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  
                  {/* MODULE 1: BUY PLAN CONTROLS */}
                  {selectedMission.id === 'buy_plan' && (
                    <div className="space-y-4 text-xs">
                      {currentStepIdx === 0 && (
                        <div className="space-y-3 animate-fadeIn">
                          <span className="font-bold text-slate-900 block">Select Postpaid Tier:</span>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'starter', name: 'Starter Tier', rate: '₹199 / check', desc: '10-50 checks/mo' },
                              { id: 'pro', name: 'Corporate Pro', rate: '₹149 / check', desc: '51-200 checks/mo' },
                              { id: 'enterprise', name: 'Enterprise Tier', rate: '₹99 / check', desc: '201-1000 checks/mo' },
                              { id: 'unlimited', name: 'Unlimited Scale', rate: '₹49 / check', desc: '1000+ checks/mo' }
                            ].map((t) => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  setSelectedPlanTierState(t.id);
                                  soundEngine.playClick();
                                }}
                                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                  selectedPlanTierState === t.id 
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                <div className="font-black text-xs text-slate-900">{t.name}</div>
                                <div className="text-emerald-700 font-bold mt-0.5">{t.rate}</div>
                                <div className="text-[10px] text-slate-500 mt-1">{t.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentStepIdx === 1 && (
                        <div className="space-y-3 animate-fadeIn">
                          <span className="font-bold text-slate-900 block">Enter Wallet Deposit Amount:</span>
                          <div className="flex gap-2">
                            {[2000, 5000, 10000].map(amt => (
                              <button
                                key={amt}
                                onClick={() => setDepositAmountState(amt)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border ${
                                  depositAmountState === amt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-300'
                                }`}
                              >
                                ₹{amt.toLocaleString('en-IN')}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setDepositSuccessState(true);
                              soundEngine.playSuccess();
                              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                            }}
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition-all shadow-md active:scale-98"
                          >
                            {depositSuccessState ? `Wallet Credited ₹${depositAmountState.toLocaleString('en-IN')} (Success) ✓` : `Simulate ₹${depositAmountState.toLocaleString('en-IN')} Deposit via Razorpay UPI QR 🚀`}
                          </button>
                        </div>
                      )}

                      {currentStepIdx === 2 && (
                        <div className="space-y-3 animate-fadeIn">
                          <label className="font-bold text-slate-900 block">Low Balance Trigger Threshold:</label>
                          <input 
                            type="range" 
                            min="5" 
                            max="50" 
                            value={alertThresholdState} 
                            onChange={(e) => setAlertThresholdState(Number(e.target.value))}
                            className="w-full accent-indigo-600 cursor-pointer"
                          />
                          <div className="flex justify-between font-mono font-bold text-slate-700 text-xs">
                            <span>5 Credits</span>
                            <span className="text-indigo-700 font-extrabold text-sm">Alert @ {alertThresholdState} Credits</span>
                            <span>50 Credits</span>
                          </div>
                          <button
                            onClick={() => {
                              setAlertConfiguredState(true);
                              soundEngine.playSuccess();
                            }}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            {alertConfiguredState ? `Alert Configured @ ${alertThresholdState} Credits ✓` : `Save & Test Low Balance Guardrail 🔔`}
                          </button>
                        </div>
                      )}

                      {currentStepIdx === 3 && (
                        <div className="space-y-3 animate-fadeIn">
                          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-800 font-sans space-y-1">
                            <div>Invoice ID: <strong className="font-mono">INV-2026-98124</strong></div>
                            <div>Statutory Tax Rate: <strong>18% GST (9% CGST + 9% SGST)</strong></div>
                            <div>HSN/SAC Code: <strong className="font-mono">998313</strong></div>
                          </div>
                          <button
                            onClick={handleDownloadSampleGstInvoicePdf}
                            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Sample GST Invoice (PDF) 📥</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE 2: VERIFICATION PROCESS CONTROLS */}
                  {selectedMission.id === 'verification_process' && (
                    <div className="space-y-4 text-xs animate-fadeIn">
                      {currentStepIdx === 0 && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="font-bold text-slate-800 block mb-1">Candidate Name *</label>
                              <input type="text" value={mockCandidate.name} onChange={(e) => setMockCandidate({ ...mockCandidate, name: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900" />
                            </div>
                            <div>
                              <label className="font-bold text-slate-800 block mb-1">Designation *</label>
                              <input type="text" value={mockCandidate.role} onChange={(e) => setMockCandidate({ ...mockCandidate, role: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900" />
                            </div>
                            <div>
                              <label className="font-bold text-slate-800 block mb-1">State (28 States & 8 UTs) *</label>
                              <select value={mockCandidate.state} onChange={(e) => setMockCandidate({ ...mockCandidate, state: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900">
                                {ALL_INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="font-bold text-slate-800 block mb-1">District / City *</label>
                              <select value={mockCandidate.district} onChange={(e) => setMockCandidate({ ...mockCandidate, district: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900">
                                {(INDIA_STATES_DISTRICTS[mockCandidate.state] || ['Chennai']).map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStepIdx === 1 && (
                        <div className="space-y-3 text-center">
                          <label className="font-bold text-slate-900 block">Candidate 4-Digit Security PIN</label>
                          <input type="password" maxLength={4} value={pinInput} placeholder="1234" onChange={(e) => { setPinInput(e.target.value); if (e.target.value === '1234') { setPinVerified(true); soundEngine.playSuccess(); } }} className="w-32 text-center text-lg font-mono font-bold px-3 py-2 rounded-xl border border-indigo-300 mx-auto block" />
                          {pinVerified ? (
                            <div className="text-emerald-800 bg-emerald-100 font-bold p-2 rounded-xl">✓ PIN Verified & Candidate Portal Unlocked</div>
                          ) : (
                            <button onClick={() => { setPinInput('1234'); setPinVerified(true); soundEngine.playSuccess(); }} className="text-[#426CF5] font-bold underline cursor-pointer">Auto-fill PIN 1234</button>
                          )}
                        </div>
                      )}

                      {currentStepIdx === 2 && (
                        <div className="space-y-3">
                          <input type="text" disabled value={`Aadhaar: ${mockCandidate.aadhaar}`} className="w-full px-3 py-2 rounded-xl bg-slate-100 font-mono font-bold" />
                          {!otpSent ? (
                            <button onClick={() => { setOtpSent(true); soundEngine.playScan(); }} className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold cursor-pointer">Send UIDAI OTP 📲</button>
                          ) : !otpVerified ? (
                            <div className="flex gap-2">
                              <input type="text" placeholder="OTP 567890" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border font-mono text-center" />
                              <button onClick={() => { setOtpVerified(true); soundEngine.playSuccess(); }} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer">Verify OTP</button>
                            </div>
                          ) : (
                            <div className="text-emerald-900 bg-emerald-100 font-bold p-2 rounded-xl text-center">Aadhaar e-KYC Matched 100% ✓</div>
                          )}
                        </div>
                      )}

                      {currentStepIdx === 3 && (
                        <div className="space-y-3 text-center">
                          <Camera className="w-8 h-8 text-pink-600 mx-auto" />
                          {!faceComplete ? (
                            <button onClick={() => { setFaceScanning(true); soundEngine.playScan(); setTimeout(() => { setFaceScanning(false); setFaceComplete(true); soundEngine.playSuccess(); }, 700); }} className="w-full py-2.5 rounded-xl bg-pink-600 text-white font-bold cursor-pointer">
                              {faceScanning ? 'Scanning 3D Mesh...' : 'Touch to Capture 3D Live Selfie 🤳'}
                            </button>
                          ) : (
                            <div className="text-emerald-900 bg-emerald-100 font-bold p-2 rounded-xl">✓ Biometric Liveness Cleared (99.98%)</div>
                          )}
                        </div>
                      )}

                      {currentStepIdx === 4 && (
                        <div className="space-y-3 text-center">
                          <Search className="w-8 h-8 text-amber-600 mx-auto" />
                          {!epfoComplete ? (
                            <button onClick={() => { setEpfoScanning(true); soundEngine.playScan(); setTimeout(() => { setEpfoScanning(false); setEpfoComplete(true); soundEngine.playSuccess(); }, 700); }} className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold cursor-pointer">
                              {epfoScanning ? 'Querying EPFO Radar...' : 'Sweep EPFO Moonlighting Radar 🛡️'}
                            </button>
                          ) : (
                            <div className="text-emerald-900 bg-emerald-100 font-bold p-2 rounded-xl">✓ Dual Employment Verdict: 0 Overlaps (Clean)</div>
                          )}
                        </div>
                      )}

                      {currentStepIdx === 5 && (
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={handleDownloadSamplePdfDossier} className="py-2.5 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center gap-1 cursor-pointer">
                            <Download className="w-4 h-4" /> PDF Dossier
                          </button>
                          <button onClick={handleDownloadSampleExcelSheet} className="py-2.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-1 cursor-pointer">
                            <Download className="w-4 h-4" /> 5-Tab Excel
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE 3: DATA HANDLING CONTROLS */}
                  {selectedMission.id === 'data_handling' && (
                    <div className="space-y-4 text-xs animate-fadeIn">
                      {currentStepIdx === 0 && (
                        <div className="space-y-3">
                          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 font-medium">
                            DPDP Act 2023 Section 6 Mandate: Multi-lingual explicit consent before demographic lookup.
                          </div>
                          <button
                            onClick={() => {
                              setConsentGrantedState(true);
                              soundEngine.playSuccess();
                            }}
                            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-xs"
                          >
                            {consentGrantedState ? 'Explicit Digital Consent Timestamped ✓' : 'Grant Explicit Candidate Consent 📝'}
                          </button>
                        </div>
                      )}

                      {currentStepIdx === 1 && (
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              setPiiMaskToggleState(!piiMaskToggleState);
                              soundEngine.playClick();
                            }}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                          >
                            Toggle PII Masking: {piiMaskToggleState ? 'ENABLED (XXXX-XXXX-8921)' : 'DISABLED (RAW PII)'}
                          </button>
                        </div>
                      )}

                      {currentStepIdx === 2 && (
                        <div className="space-y-3">
                          <div className="p-3 bg-slate-900 text-slate-100 font-mono rounded-xl border border-slate-800">
                            Cipher: AES-256-GCM • Network: TLS 1.3 • Key Rotation: 24h
                          </div>
                        </div>
                      )}

                      {currentStepIdx === 3 && (
                        <div className="space-y-3">
                          <div className="p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-300 font-bold">
                            Data Center: AWS / Azure MeitY Empanelled (Mumbai & Hyderabad)
                          </div>
                          <button
                            onClick={() => {
                              setPurgeTriggeredState(true);
                              soundEngine.playSuccess();
                            }}
                            className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold cursor-pointer"
                          >
                            {purgeTriggeredState ? 'Right to Erasure Executed (Data Purged) ✓' : 'Test Candidate Data Purge (Erasure) 🧹'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE 4: COMPANY ONBOARDING CONTROLS */}
                  {selectedMission.id === 'company_onboarding' && (
                    <div className="space-y-4 text-xs animate-fadeIn">
                      {currentStepIdx === 0 && (
                        <div className="space-y-3">
                          <input type="text" value={mockCompanyOnboarding.name} onChange={(e) => setMockCompanyOnboarding({ ...mockCompanyOnboarding, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border font-bold" />
                          <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-950 font-bold rounded-xl">
                            Activation Link Sent to: {mockCompanyOnboarding.adminEmail} (PIN: 1234)
                          </div>
                        </div>
                      )}

                      {currentStepIdx === 1 && (
                        <div className="space-y-3">
                          <input type="text" value={mockCompanyOnboarding.smtpHost} onChange={(e) => setMockCompanyOnboarding({ ...mockCompanyOnboarding, smtpHost: e.target.value })} className="w-full px-3 py-2 rounded-xl border font-mono font-bold" />
                          <button
                            onClick={() => {
                              setMockCompanyOnboarding({ ...mockCompanyOnboarding, smtpVerified: true });
                              soundEngine.playSuccess();
                            }}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                          >
                            {mockCompanyOnboarding.smtpVerified ? 'SMTP Server Connection Verified ✓' : 'Dispatch Test Corporate SMTP Email 📧'}
                          </button>
                        </div>
                      )}

                      {currentStepIdx === 2 && (
                        <div className="space-y-3">
                          <input type="text" value={mockCompanyOnboarding.hrName} onChange={(e) => setMockCompanyOnboarding({ ...mockCompanyOnboarding, hrName: e.target.value })} className="w-full px-3 py-2 rounded-xl border font-bold" />
                          <button
                            onClick={() => {
                              setMockCompanyOnboarding({ ...mockCompanyOnboarding, hrAdded: true });
                              soundEngine.playSuccess();
                            }}
                            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer"
                          >
                            {mockCompanyOnboarding.hrAdded ? 'HR Seat Provisioned & Scoped ✓' : 'Provision New HR Recruiter Seat 👤'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step Action Button */}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <button
                      disabled={currentStepIdx === 0}
                      onClick={() => {
                        soundEngine.playClick();
                        setCurrentStepIdx(prev => prev - 1);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 disabled:opacity-40 cursor-pointer"
                    >
                      ← Previous Step
                    </button>

                    {currentStepIdx < selectedMission.steps.length - 1 ? (
                      <button
                        onClick={() => {
                          soundEngine.playSuccess();
                          setCurrentStepIdx(prev => prev + 1);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#426CF5] hover:bg-[#3459D8] shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next Step →</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          soundEngine.playSuccess();
                          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                          if (activeMissionIdx < TACTICAL_MISSIONS.length - 1) {
                            setActiveMissionIdx(prev => prev + 1);
                            setCurrentStepIdx(0);
                          } else {
                            setActiveMissionIdx(0);
                            setCurrentStepIdx(0);
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Complete Module 🎉</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN (5 Cols): Live Interactive Simulator Viewport */}
                <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-white min-h-[380px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  
                  {/* Viewport Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-mono text-slate-400 font-bold ml-1">
                        SIMULATOR CANVAS
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      LIVE RENDER
                    </span>
                  </div>

                  {/* Simulator Canvas Contents */}
                  <div className="my-auto py-4 space-y-4">
                    {/* Tier Selection */}
                    {activeStep.deviceView === 'tier_selection' && (
                      <div className="text-center space-y-3">
                        <CreditCard className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="font-bold text-lg text-white font-outfit">Postpaid Credit Tier Selected</h4>
                        <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700 text-emerald-300 font-mono text-xs font-bold">
                          Active Tier: {selectedPlanTierState.toUpperCase()}
                        </div>
                      </div>
                    )}

                    {/* Payment Deposit */}
                    {activeStep.deviceView === 'payment_deposit' && (
                      <div className="text-center space-y-3">
                        <QrCode className="w-12 h-12 text-indigo-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">Razorpay Instant UPI QR Code</h4>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs">
                          Scan & Pay ₹{depositAmountState.toLocaleString('en-IN')} via Google Pay / PhonePe / PayTM
                        </div>
                      </div>
                    )}

                    {/* Balance Alerts */}
                    {activeStep.deviceView === 'balance_alerts' && (
                      <div className="text-center space-y-3">
                        <Zap className="w-10 h-10 text-amber-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">Wallet Balance Guardrail</h4>
                        <div className="p-3 bg-amber-950/80 rounded-xl border border-amber-700 text-amber-300 font-mono text-xs">
                          Alert Trigger: {alertThresholdState} Credits
                        </div>
                      </div>
                    )}

                    {/* GST Invoice */}
                    {activeStep.deviceView === 'gst_invoice' && (
                      <div className="text-center space-y-3">
                        <FileText className="w-10 h-10 text-red-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">Official 18% GST Tax Invoice</h4>
                        <div className="p-3 bg-red-950/80 rounded-xl border border-red-800 text-red-300 font-mono text-xs">
                          HSN Code: 998313 • Cryptographic SHA-256 Seal
                        </div>
                      </div>
                    )}

                    {/* Recruiter Intake */}
                    {activeStep.deviceView === 'recruiter_intake' && (
                      <div className="space-y-2 text-xs font-sans">
                        <div className="text-indigo-400 font-mono font-bold">RECRUITER INTAKE CANVAS</div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                          <div>Candidate: <strong>{mockCandidate.name}</strong></div>
                          <div>Role: <strong>{mockCandidate.role}</strong></div>
                          <div>Region: <strong>{mockCandidate.district}, {mockCandidate.state}</strong></div>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp PIN */}
                    {activeStep.deviceView === 'whatsapp_pin' && (
                      <div className="text-center space-y-3">
                        <Smartphone className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">Candidate WhatsApp Mobile Web</h4>
                        <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-700 text-emerald-300 font-mono text-xs">
                          Zero-App Link • Locked with PIN 1234
                        </div>
                      </div>
                    )}

                    {/* Aadhaar PAN */}
                    {activeStep.deviceView === 'aadhaar_pan' && (
                      <div className="text-center space-y-3">
                        <Fingerprint className="w-10 h-10 text-purple-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">UIDAI Aadhaar & PAN 2.0</h4>
                        <div className="p-3 bg-purple-950/80 rounded-xl border border-purple-800 text-purple-300 font-mono text-xs">
                          Masked Aadhaar: XXXX-XXXX-8921
                        </div>
                      </div>
                    )}

                    {/* Face Biometric */}
                    {activeStep.deviceView === 'face_biometric' && (
                      <div className="text-center space-y-3">
                        <Camera className="w-10 h-10 text-pink-400 mx-auto animate-pulse" />
                        <h4 className="font-bold text-base text-white font-outfit">3D Anti-Spoofing Biometric Mesh</h4>
                        <div className="p-3 bg-pink-950/80 rounded-xl border border-pink-800 text-pink-300 font-mono text-xs">
                          68 Biometric Facial Points • 99.98% Score
                        </div>
                      </div>
                    )}

                    {/* EPFO Radar */}
                    {activeStep.deviceView === 'epfo_radar' && (
                      <div className="text-center space-y-3">
                        <Search className="w-10 h-10 text-amber-400 mx-auto animate-spin-slow" />
                        <h4 className="font-bold text-base text-white font-outfit">EPFO UAN Moonlighting Sonar</h4>
                        <div className="p-3 bg-amber-950/80 rounded-xl border border-amber-800 text-amber-300 font-mono text-xs">
                          Concurrent Overlaps: 0 (Clean Status)
                        </div>
                      </div>
                    )}

                    {/* Dossier Ready */}
                    {activeStep.deviceView === 'dossier_ready' && (
                      <div className="text-center space-y-3">
                        <Award className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">Certified 360° Audit Dossier</h4>
                        <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800 text-emerald-300 font-mono text-xs">
                          Cryptographic SHA-256 PDF & 5-Tab Excel Ready
                        </div>
                      </div>
                    )}

                    {/* Consent Gate */}
                    {activeStep.deviceView === 'consent_gate' && (
                      <div className="text-center space-y-3">
                        <ShieldCheck className="w-10 h-10 text-purple-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">DPDP Act 2023 Consent Gate</h4>
                        <div className="p-3 bg-purple-950/80 rounded-xl border border-purple-800 text-purple-300 font-mono text-xs">
                          Explicit OTP Authorization Signed
                        </div>
                      </div>
                    )}

                    {/* PII Masking */}
                    {activeStep.deviceView === 'pii_masking' && (
                      <div className="text-center space-y-3">
                        <Lock className="w-10 h-10 text-indigo-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">Automated PII Obfuscation</h4>
                        <div className="p-3 bg-indigo-950/80 rounded-xl border border-indigo-800 text-indigo-300 font-mono text-xs">
                          Output: XXXX-XXXX-8921 (Masked)
                        </div>
                      </div>
                    )}

                    {/* Encryption Status */}
                    {activeStep.deviceView === 'encryption_status' && (
                      <div className="text-center space-y-3">
                        <Cpu className="w-10 h-10 text-cyan-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">AES-256-GCM Cryptographic Vault</h4>
                        <div className="p-3 bg-cyan-950/80 rounded-xl border border-cyan-800 text-cyan-300 font-mono text-xs">
                          TLS 1.3 Active Transport Security
                        </div>
                      </div>
                    )}

                    {/* Data Residency */}
                    {activeStep.deviceView === 'data_residency' && (
                      <div className="text-center space-y-3">
                        <MapPin className="w-10 h-10 text-rose-400 mx-auto animate-bounce" />
                        <h4 className="font-bold text-base text-white font-outfit">Sovereign Indian Data Center</h4>
                        <div className="p-3 bg-rose-950/80 rounded-xl border border-rose-800 text-rose-300 font-mono text-xs">
                          Mumbai & Hyderabad MeitY Tier-IV Rails
                        </div>
                      </div>
                    )}

                    {/* Company Activation */}
                    {activeStep.deviceView === 'company_activation' && (
                      <div className="text-center space-y-3">
                        <Mail className="w-10 h-10 text-amber-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">SuperAdmin Activation Dispatch</h4>
                        <div className="p-3 bg-amber-950/80 rounded-xl border border-amber-800 text-amber-300 font-mono text-xs">
                          Company Account Provisioned via PIN 1234
                        </div>
                      </div>
                    )}

                    {/* SMTP Config */}
                    {activeStep.deviceView === 'smtp_config' && (
                      <div className="text-center space-y-3">
                        <Building2 className="w-10 h-10 text-indigo-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">Corporate SMTP Integration</h4>
                        <div className="p-3 bg-indigo-950/80 rounded-xl border border-indigo-800 text-indigo-300 font-mono text-xs">
                          Custom Brand Outbound Email Rail Connected
                        </div>
                      </div>
                    )}

                    {/* Recruiter RBAC */}
                    {activeStep.deviceView === 'recruiter_rbac' && (
                      <div className="text-center space-y-3">
                        <Users className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="font-bold text-base text-white font-outfit">HR Recruiter Seat Allocation</h4>
                        <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800 text-emerald-300 font-mono text-xs">
                          Role-Based Access Control (RBAC) Active
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Viewport Footer */}
                  <div className="border-t border-slate-800 pt-2 text-[10px] font-mono text-slate-400 text-center">
                    JOY TRUE PROFILE 2.0 • INTERACTIVE ENGINE
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==============================================================================
         * MODE 2: VIDEO SIMULATION THEATER
         * ============================================================================== */}
        {activeTourMode === 'video_theater' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#0F172A] text-white">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {VIDEO_CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveVideoChannel(ch.id);
                    soundEngine.playClick();
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    activeVideoChannel === ch.id 
                      ? 'bg-slate-800 border-[#426CF5] shadow-lg ring-2 ring-[#426CF5]/40' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    {ch.badge}
                  </span>
                  <h4 className="font-bold text-sm font-outfit text-white">{ch.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ch.subtitle}</p>
                </button>
              ))}
            </div>

            <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">INTERACTIVE SIMULATION THEATER</span>
                  <h3 className="text-xl font-bold font-outfit text-white">{activeVideo.title}</h3>
                </div>
                <button onClick={() => setVideoPlaying(!videoPlaying)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer">
                  {videoPlaying ? 'Pause Theater' : 'Play Theater'}
                </button>
              </div>

              {/* Simulated Video Scrubber Bar */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative cursor-pointer">
                <div className="bg-gradient-to-r from-[#426CF5] to-emerald-500 h-full transition-all duration-100" style={{ width: `${videoProgress}%` }} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {activeVideo.stats.map((st, i) => (
                  <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">{st.label}</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{st.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================================
         * MODE 3: SAMPLE DOWNLOADS HUB
         * ============================================================================== */}
        {activeTourMode === 'downloads' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#F8FAFC]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <FileText className="w-8 h-8 text-red-600" />
                <h4 className="font-bold text-base text-slate-900 font-outfit">360° Candidate PDF Dossier</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Cryptographic SHA-256 certificate with complete identity & background checks.</p>
                <button onClick={handleDownloadSamplePdfDossier} className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                  <Download className="w-4 h-4" /> Download Sample PDF Dossier
                </button>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                <h4 className="font-bold text-base text-slate-900 font-outfit">5-Tab Master Excel (.xlsx)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">50+ standardized column workbook across Demographics, Rails, and Logs.</p>
                <button onClick={handleDownloadSampleExcelSheet} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                  <Download className="w-4 h-4" /> Download 5-Tab Excel Sheet
                </button>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <CreditCard className="w-8 h-8 text-indigo-600" />
                <h4 className="font-bold text-base text-slate-900 font-outfit">Statutory 18% GST Tax Invoice</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Tax-compliant corporate invoice with HSN code 998313 for ITC claiming.</p>
                <button onClick={handleDownloadSampleGstInvoicePdf} className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                  <Download className="w-4 h-4" /> Download GST Invoice PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================================
         * MODE 4: COMPLETE KNOWLEDGE LIBRARY GUIDES
         * ============================================================================== */}
        {activeTourMode === 'guides' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#F8FAFC]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search how-to guides and statutory compliance procedures..."
                value={guideSearchQuery}
                onChange={(e) => setGuideSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 font-medium text-xs text-slate-900 shadow-2xs focus:border-[#426CF5] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGuides.map(g => (
                <div key={g.id} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${g.badgeColor}`}>
                    {g.badge}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 font-outfit">{g.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.summary}</p>
                  <div className="text-[10px] text-indigo-700 font-mono font-bold bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                    Legal Citation: {g.legalCitation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-950 text-slate-400 text-xs border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="font-mono text-[11px] text-slate-300 font-bold">
            JOY TRUE PROFILE 2.0 • TACTICAL TOUR & GUIDE SYSTEM
          </div>
          <button onClick={handleModalClose} className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer">
            Close Modal
          </button>
        </div>

      </div>
    </div>
  ), document.body);
};

export default InteractiveTourGuideModal;
