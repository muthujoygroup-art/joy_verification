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
  Crosshair,
  Target,
  Truck,
  FileCheck,
  Activity,
  Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import { soundEngine } from '../utils/uiSoundEffects';
import { exportIndividualCandidateToExcel } from '../utils/employeeExcelExport';
import { INDIA_STATES_DISTRICTS, ALL_INDIA_STATES } from '../data/indiaLocations';
import confetti from 'canvas-confetti';

// 4 Major Tactical Verification Missions
const TACTICAL_MISSIONS = [
  {
    id: 'employee_verification',
    title: '🏢 Mission 1: Verify Corporate Employees (Full-Time / IT Staff)',
    category: 'employee',
    badge: 'EMPLOYEE BGV',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Complete end-to-end employee background verification: Recruiter intake, WhatsApp magic link with PIN, UIDAI Aadhaar e-KYC, 3D face biometric selfie, EPFO moonlighting radar, and 360° PDF / Excel dossier export.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Recruiter Intake & State Dropdowns',
        hudPrompt: '🎯 Touch here to configure candidate verification suite and select state/district.',
        targetId: 'mission-step-1',
        instruction: 'Fill in candidate demographics with cascading 28 States & 8 UTs dropdowns and pick API checks.',
        actionLabel: 'Touch to Dispatch Magic Link 🚀'
      },
      {
        stepNumber: 2,
        title: 'Step 2: WhatsApp Magic Link & 4-Digit PIN',
        hudPrompt: '🎯 Touch here to dispatch encrypted magic link via WhatsApp Cloud API & SMS.',
        targetId: 'mission-step-2',
        instruction: 'Candidate receives zero-install mobile web link and unlocks portal using 4-digit PIN (1234).',
        actionLabel: 'Touch to Enter PIN & Unlock 🔓'
      },
      {
        stepNumber: 3,
        title: 'Step 3: UIDAI Aadhaar e-KYC & PAN 2.0',
        hudPrompt: '🎯 Touch here to trigger official UIDAI OTP demographic validation & PAN match.',
        targetId: 'mission-step-3',
        instruction: 'Execute direct UIDAI OTP authentication and NSDL PAN 2.0 identity match with automatic masking.',
        actionLabel: 'Touch to Verify UIDAI OTP 🆔'
      },
      {
        stepNumber: 4,
        title: 'Step 4: 3D AI Biometric Liveness Selfie',
        hudPrompt: '🎯 Touch here to align face and capture 3D anti-spoofing biometric selfie.',
        targetId: 'mission-step-4',
        instruction: 'Camera captures 68-point facial mesh and validates photo match against Aadhaar (99.98% confidence).',
        actionLabel: 'Touch to Capture 3D Live Selfie 🤳'
      },
      {
        stepNumber: 5,
        title: 'Step 5: EPFO UAN Moonlighting Radar',
        hudPrompt: '🎯 Touch here to execute EPFO sonar radar and audit secondary employment.',
        targetId: 'mission-step-5',
        instruction: 'Audit active provident fund contributions under UAN to flag concurrent jobs (0 overlaps / Clean).',
        actionLabel: 'Touch to Sweep Moonlighting Radar 🛡️'
      },
      {
        stepNumber: 6,
        title: 'Step 6: Certified 360° PDF Dossier & 5-Tab Excel Export',
        hudPrompt: '🎯 Touch here to export certified cryptographic PDF dossier & master Excel workbook.',
        targetId: 'mission-step-6',
        instruction: 'Download cryptographic SHA-256 PDF certificate and 50+ column master Excel spreadsheet.',
        actionLabel: 'Touch to Download Verified Dossier 📥'
      }
    ]
  },
  {
    id: 'vendor_labor_verification',
    title: '🏭 Mission 2: Verify Vendors & Contractor Labor (Plant Turnstile & Form XVI)',
    category: 'vendor_labor',
    badge: 'VENDOR & PLANT ACCESS',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Verify third-party labor vendors and contractor technicians for manufacturing plants: Agency CIN registration, bulk Excel onboarding of 100+ workers, CLRA Form XVI muster, sub-second QR gate passes, and ghost worker elimination.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Vendor Staffing Agency Registration',
        hudPrompt: '🎯 Touch here to register third-party labor contractor agency and verify CIN.',
        targetId: 'vendor-step-1',
        instruction: 'Input staffing agency corporate details (CIN, GSTIN, CLRA license number) and verify agency legitimacy.',
        actionLabel: 'Touch to Register Vendor Agency 🏢'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Bulk Import 100+ Factory Workers via Excel',
        hudPrompt: '🎯 Touch here to bulk onboard 100+ contractor technicians via Excel spreadsheet.',
        targetId: 'vendor-step-2',
        instruction: 'Upload contractor staff roster in Excel (.xlsx) format for parallel automated background screenings.',
        actionLabel: 'Touch to Parse Contractor Roster 📥'
      },
      {
        stepNumber: 3,
        title: 'Step 3: CLRA Form XVI Statutory Muster Roll',
        hudPrompt: '🎯 Touch here to generate audit-ready CLRA Form XVI statutory labor register.',
        targetId: 'vendor-step-3',
        instruction: 'System compiles official statutory Form XVI contractor labor muster log for government labor audits.',
        actionLabel: 'Touch to Generate Form XVI Muster 📋'
      },
      {
        stepNumber: 4,
        title: 'Step 4: Sub-Second QR Turnstile Gate Pass Clearance',
        hudPrompt: '🎯 Touch here to scan QR badge and unlock factory access turnstiles.',
        targetId: 'vendor-step-4',
        instruction: 'Security optical scanners read worker mobile QR passes in 0.34s to unlock factory entry turnstiles.',
        actionLabel: 'Touch to Scan Gate Pass 🎫'
      },
      {
        stepNumber: 5,
        title: 'Step 5: Ghost Worker Invoicing Reconciler',
        hudPrompt: '🎯 Touch here to cross-reference agency invoices against turnstile logs to eliminate ghost billing.',
        targetId: 'vendor-step-5',
        instruction: 'Audit actual physical turnstile entry timestamps against agency headcount bills to stop ghost invoicing.',
        actionLabel: 'Touch to Match Invoices ✓'
      }
    ]
  },
  {
    id: 'vendor_b2b_kyc',
    title: '🏢 Mission 3: Verify Vendor Business Entities (B2B Subcontractor KYC)',
    category: 'vendor_b2b',
    badge: 'B2B ENTITY KYC',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Corporate-to-vendor business verification: Ministry of Corporate Affairs (MCA CIN), GSTIN 2B active tax filing compliance, MSME Udyam certification, and NPCI IMPS bank account penny drop.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: MCA Corporate Registry (CIN & ROC Status)',
        hudPrompt: '🎯 Touch here to query Ministry of Corporate Affairs for active company registration.',
        targetId: 'b2b-step-1',
        instruction: 'Query MCA rails to confirm vendor company status, incorporation date, directors, and registered capital.',
        actionLabel: 'Touch to Verify MCA CIN 🏛️'
      },
      {
        stepNumber: 2,
        title: 'Step 2: GSTIN 2B Tax Filing & Active Status',
        hudPrompt: '🎯 Touch here to validate GSTIN status and monthly tax filing history.',
        targetId: 'b2b-step-2',
        instruction: 'Check GST portal for active registration status, principal place of business, and GSTR-3B tax compliance.',
        actionLabel: 'Touch to Verify GSTIN Rail 💳'
      },
      {
        stepNumber: 3,
        title: 'Step 3: MSME Udyam Classification Audit',
        hudPrompt: '🎯 Touch here to verify MSME Udyam certificate.',
        targetId: 'b2b-step-3',
        instruction: 'Validate vendor MSME Udyam registration number and enterprise classification (Micro / Small / Medium).',
        actionLabel: 'Touch to Verify MSME Udyam 📜'
      },
      {
        stepNumber: 4,
        title: 'Step 4: NPCI IMPS Bank Account Penny Drop',
        hudPrompt: '🎯 Touch here to execute ₹1 Penny Drop and verify vendor bank account ownership.',
        targetId: 'b2b-step-4',
        instruction: 'Execute live ₹1 IMPS bank transfer to match legal corporate beneficiary name directly with recipient bank.',
        actionLabel: 'Touch to Execute ₹1 Penny Drop 🏦'
      },
      {
        stepNumber: 5,
        title: 'Step 5: Vendor Trust & Risk Index Score',
        hudPrompt: '🎯 Touch here to issue Vendor Verified Compliance Certificate.',
        targetId: 'b2b-step-5',
        instruction: 'Compute automated composite Trust Index (A+ rating) and issue Certified B2B Vendor Compliance Badge.',
        actionLabel: 'Touch to Issue Vendor Certificate 🎖️'
      }
    ]
  },
  {
    id: 'logistics_driver_verification',
    title: '🚚 Mission 4: Verify 3PL Logistics & Commercial Fleet Drivers',
    category: 'fleet_drivers',
    badge: 'LOGISTICS & FLEET',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Screen pan-India commercial drivers and transport fleet: Parivahan Sarathi heavy transport license verification, commercial vehicle RC & fitness check, and e-Courts pan-India traffic litigation records.',
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Parivahan Commercial Driving License (DL)',
        hudPrompt: '🎯 Touch here to query Parivahan Sarathi for heavy transport driving license.',
        targetId: 'driver-step-1',
        instruction: 'Validate driver commercial license number, authorized vehicle classes (HMV/Transport), and badge validity.',
        actionLabel: 'Touch to Verify Commercial DL 🚗'
      },
      {
        stepNumber: 2,
        title: 'Step 2: Commercial Vehicle RC, Fitness & Insurance',
        hudPrompt: '🎯 Touch here to check vehicle registration and commercial fitness status.',
        targetId: 'driver-step-2',
        instruction: 'Validate fleet vehicle registration certificate (RC), national permit, fitness certificate, and active insurance.',
        actionLabel: 'Touch to Verify Vehicle RC 🚚'
      },
      {
        stepNumber: 3,
        title: 'Step 3: e-Courts Pan-India Traffic & Police Records',
        hudPrompt: '🎯 Touch here to audit pan-India court litigation and active police records.',
        targetId: 'driver-step-3',
        instruction: 'Query nationwide District & High Court registries to confirm zero active criminal cases or pending warrants.',
        actionLabel: 'Touch to Run Court Record Check ⚖️'
      },
      {
        stepNumber: 4,
        title: 'Step 4: Digital Fleet Warehouse Clearance Pass',
        hudPrompt: '🎯 Touch here to issue Digital Fleet Clearance Pass.',
        targetId: 'driver-step-4',
        instruction: 'Generate scannable digital loading bay gate pass for supply chain warehouse entry.',
        actionLabel: 'Touch to Issue Fleet Gate Pass 🎫'
      }
    ]
  }
];

// 6 Video / Animation Channels for Simulation Theater
const VIDEO_CHANNELS = [
  {
    id: 'biometric',
    title: '3D AI Biometric Face Mesh Scan',
    subtitle: 'Anti-Spoofing Liveness & UIDAI Photo Match',
    badge: 'BIOMETRIC HUD',
    icon: Camera,
    color: 'from-purple-600 via-indigo-600 to-cyan-500',
    stats: [
      { label: 'Match Confidence', value: '99.98%' },
      { label: 'Latency', value: '0.42s' },
      { label: 'Anti-Spoofing', value: 'Active 3D Mesh' },
      { label: 'Registry', value: 'UIDAI Direct' }
    ]
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Candidate Magic Link Flow',
    subtitle: 'Zero-App Mobile Self-Verification Experience',
    badge: 'MOBILE STREAM',
    icon: Smartphone,
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    stats: [
      { label: 'Completion Time', value: '38s' },
      { label: 'Drop-off Rate', value: '<1.8%' },
      { label: 'Channels', value: 'WA / SMS / Email' },
      { label: 'PIN Security', value: '4-Digit Lock' }
    ]
  },
  {
    id: 'epfo_radar',
    title: 'EPFO UAN Moonlighting Radar',
    subtitle: 'Dual-Employment & Active Payroll Audit',
    badge: 'RADAR SONAR AUDIT',
    icon: Search,
    color: 'from-amber-500 via-orange-600 to-rose-600',
    stats: [
      { label: 'Service History', value: '4 Tenures' },
      { label: 'Active Overlaps', value: '0 (Clean)' },
      { label: 'Risk Score', value: 'Low (0.01%)' },
      { label: 'Database', value: 'EPFO Rails' }
    ]
  },
  {
    id: 'turnstile',
    title: 'Plant QR Pass Turnstile Gate',
    subtitle: 'Sub-Second Scannable Access for Factory Staff',
    badge: 'PLANT IOT GATEWAY',
    icon: HardHat,
    color: 'from-blue-600 via-indigo-600 to-emerald-600',
    stats: [
      { label: 'Scan Response', value: '0.34s' },
      { label: 'Audit Log', value: 'Statutory Form XVI' },
      { label: 'Gate Status', value: 'Turnstile Unlocked' },
      { label: 'Safety Badge', value: 'CLRA Compliant' }
    ]
  },
  {
    id: 'vendor_mca',
    title: 'Vendor Corporate Entity MCA & GSTIN',
    subtitle: 'B2B Subcontractor Legitimacy & Tax Audit',
    badge: 'B2B REGISTRY',
    icon: Building2,
    color: 'from-indigo-600 via-purple-600 to-pink-600',
    stats: [
      { label: 'MCA Status', value: 'Active & Compliant' },
      { label: 'GSTIN Filing', value: '100% GSTR-3B Active' },
      { label: 'Bank Penny Drop', value: 'Name Matched 100%' },
      { label: 'Trust Rating', value: 'Tier 1 (A+)' }
    ]
  },
  {
    id: 'excel_pdf',
    title: '5-Tab Excel & 360° PDF Exporter',
    subtitle: 'Multi-Sheet Spreadsheets & Cryptographic Dossiers',
    badge: 'EXCEL & PDF SUITE',
    icon: FileSpreadsheet,
    color: 'from-teal-600 via-emerald-600 to-cyan-600',
    stats: [
      { label: 'Excel Engine', value: 'SheetJS Binary (.xlsx)' },
      { label: 'Columns Extracted', value: '50+ Standardized' },
      { label: 'PDF Hash', value: 'SHA-256 Vector' },
      { label: 'Format Fidelity', value: '100% Native' }
    ]
  }
];

export const InteractiveTourGuideModal = ({ 
  isOpen = false, 
  onClose 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeTourMode, setActiveTourMode] = useState('missions'); // 'missions' | 'video_theater' | 'sandbox' | 'guides'
  
  // Mission Walkthrough State (Game-Style Tutorial)
  const [activeMissionIdx, setActiveMissionIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Live Interactive Flow Test Data
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
  
  const [mockVendor, setMockVendor] = useState({
    agencyName: 'Apex Industrial Labor Solutions Pvt Ltd',
    cin: 'U74999TN2021PTC145892',
    gstin: '33AAACA1234A1Z5',
    pan: 'AAACA1234A',
    workersCount: 140,
    plantHub: 'Chennai / Sriperumbudur Hub',
    clraLicense: 'CLRA-TN-CHE-2026-9812'
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
  const [turnstileScanned, setTurnstileScanned] = useState(false);
  const [vendorMcaVerified, setVendorMcaVerified] = useState(false);
  const [pennyDropDone, setPennyDropDone] = useState(false);

  // Video Theater State
  const [activeVideoChannel, setActiveVideoChannel] = useState('biometric');
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoMuted, setVideoMuted] = useState(false);

  // Guides Search State
  const [guideSearchQuery, setGuideSearchQuery] = useState('');
  const [guideCategory, setGuideCategory] = useState('all');
  const [expandedGuideId, setExpandedGuideId] = useState(null);

  // Sync Open States
  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleOpen = () => setInternalOpen(true);
    window.addEventListener('open_tour_guide_modal', handleOpen);
    return () => window.removeEventListener('open_tour_guide_modal', handleOpen);
  }, []);

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
    setInternalOpen(false);
    if (onClose) onClose();
  };

  const selectedMission = TACTICAL_MISSIONS[activeMissionIdx] || TACTICAL_MISSIONS[0];
  const activeStep = selectedMission.steps[currentStepIdx] || selectedMission.steps[0];
  const activeVideo = VIDEO_CHANNELS.find(c => c.id === activeVideoChannel) || VIDEO_CHANNELS[0];

  // Sample PDF Dossier Generator (jsPDF)
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

      // Verification Checks Summary Table
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Real-Time Verification Checks Summary', 14, 85);
      doc.line(14, 88, 196, 88);

      const checks = [
        ['UIDAI Aadhaar e-KYC', 'UIDAI Direct Rail', 'Demographics & Address Match', 'VERIFIED ✓ (0.42s)'],
        ['Income Tax PAN 2.0', 'NSDL / ITD Rail', 'Active & Name Matched 100%', 'VERIFIED ✓ (0.35s)'],
        ['3D AI Face Liveness', 'Anti-Spoofing Biometric Engine', '99.98% Confidence Score', 'VERIFIED ✓ (0.45s)'],
        ['EPFO Moonlighting Radar', 'EPFO Unified Member Portal', '0 Active Overlaps (Clean)', 'CLEAN ✓ (0.61s)'],
        ['Bank Account Penny Drop', 'NPCI IMPS Fast Rail', 'Beneficiary Account Matched', 'VERIFIED ✓ (0.38s)'],
        ['Court Litigation Records', 'e-Courts Pan-India Rail', 'Zero Active Criminal Records', 'CLEAN ✓ (0.78s)']
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

      // Statutory & Turnstile Section
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Statutory Compliance & Plant Turnstile Gate Access', 14, 160);
      doc.line(14, 163, 196, 163);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text('CLRA Form XVI Register: Automatic statutory contractor compliance entry logged.', 14, 172);
      doc.text('Turnstile Gate Badge: QR Token JOY-PASS-2026-9812 valid across all plant security turnstiles.', 14, 179);
      doc.text('Cryptographic Hash (SHA-256): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 14, 186);
      doc.text(`Report Timestamp: ${new Date().toLocaleString('en-IN')}`, 14, 193);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('JOY CORPORATE SOLUTIONS PRIVATE LIMITED • Powered by JOY TRUE PROFILE AI Platform Engine', 14, 280);

      doc.save(`JOY_TrueProfile_Dossier_${mockCandidate.name.replace(/\s+/g, '_')}.pdf`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error('PDF Generation Error:', e);
    }
  };

  // Sample Excel Sheet Generator (SheetJS)
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
      bankName: 'HDFC Bank Ltd',
      bankAccountNo: '501002348912',
      ifscCode: 'HDFC0001234',
      status: 'VERIFIED',
      verificationDate: new Date().toISOString().split('T')[0],
      score: '99.98%'
    };
    exportIndividualCandidateToExcel(candidateData, { name: 'JOY Corporate Solutions Pvt Ltd' });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  // Guides Data
  const guideLibrary = [
    {
      id: 'g_emp_flow',
      title: '👔 How Companies Verify Full-Time Employees',
      category: 'employee',
      badge: 'EMPLOYEE BGV',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      summary: 'Step-by-step recruiter workflow: Intake form with India state/district dropdowns, WhatsApp magic link with PIN, Aadhaar e-KYC, 3D face liveness, EPFO moonlighting audit, and instant 5-tab Excel & PDF exports.',
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
      id: 'g_vendor_flow',
      title: '🏭 How Companies Verify Labor Vendors & Contractors',
      category: 'vendor',
      badge: 'VENDOR & PLANT ACCESS',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      summary: 'Contractor agency registration, bulk Excel onboarding of 100+ site technicians, CLRA Form XVI statutory muster rolls, sub-second turnstile QR gate passes, and ghost worker invoicing prevention.',
      steps: [
        '1. Register third-party contractor agency and validate CIN and CLRA license.',
        '2. Bulk import 100+ contractor personnel via pre-formatted Excel (.xlsx) roster.',
        '3. Automated generation of statutory CLRA Form XVI contractor labor muster.',
        '4. Issue scannable digital QR gate passes for sub-0.5s plant turnstile entry.',
        '5. Reconcile contractor billing invoices against actual physical turnstile logs to eradicate ghost workers.'
      ]
    },
    {
      id: 'g_b2b_flow',
      title: '🏢 How Companies Verify Vendor Business Entities (B2B KYC)',
      category: 'vendor',
      badge: 'B2B ENTITY KYC',
      badgeColor: 'bg-purple-100 text-purple-800',
      summary: 'Validate vendor legal corporate standing: Ministry of Corporate Affairs (MCA CIN), GSTIN 2B active tax filing, MSME Udyam classification, and ₹1 NPCI IMPS bank account penny drop.',
      steps: [
        '1. Query MCA database to check CIN, ROC status, and directors.',
        '2. Validate GSTIN status, principal business address, and GSTR-3B tax compliance.',
        '3. Check MSME Udyam registration number and enterprise scale.',
        '4. Execute ₹1 IMPS Penny Drop to verify bank account beneficiary name match 100%.'
      ]
    },
    {
      id: 'g_fleet_flow',
      title: '🚚 How Companies Verify 3PL Logistics & Fleet Drivers',
      category: 'fleet',
      badge: 'FLEET & DRIVER',
      badgeColor: 'bg-amber-100 text-amber-800',
      summary: 'Screen transport fleet drivers: Parivahan Sarathi commercial driving license check, commercial vehicle RC and fitness validation, and e-Courts pan-India court records.',
      steps: [
        '1. Query Parivahan Sarathi for commercial driving license class and heavy badge.',
        '2. Verify commercial vehicle RC, national permit, and fitness certificates.',
        '3. Check e-Courts pan-India civil and criminal litigation records.',
        '4. Issue digital warehouse loading bay clearance gate pass.'
      ]
    }
  ];

  const filteredGuides = guideLibrary.filter(g => {
    const matchesCat = guideCategory === 'all' || g.category === guideCategory;
    const matchesSearch = guideSearchQuery === '' ||
      g.title.toLowerCase().includes(guideSearchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(guideSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return createPortal((
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex justify-center items-start animate-fadeIn">
      <div className="w-full max-w-6xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 animate-modal-spring max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* ==============================================================================
         * MODAL HEADER: TACTICAL GAME HUD HEADER
         * ============================================================================== */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#182230] to-indigo-950 text-white rounded-t-3xl border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#426CF5]/30 border border-[#426CF5]/40 text-[#426CF5]">
              <Compass className="w-7 h-7 animate-spin-slow text-[#426CF5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#426CF5] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>Interactive Tactical Tour & Guide Hub</span>
                </span>
                <span className="text-xs text-slate-300 font-mono hidden sm:inline">JOY TRUE PROFILE 2.0</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-outfit mt-0.5">
                Workforce & Vendor Verification Interactive Tour 🧭
              </h3>
            </div>
          </div>

          <button 
            onClick={handleModalClose} 
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-all self-end sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ==============================================================================
         * 4-PILLAR PRIMARY MODE SWITCHER
         * ============================================================================== */}
        <div className="p-3 bg-[#FCFCFA] border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 min-w-max">
            {[
              { id: 'missions', label: '🎮 Game-Style Tactical Missions', badge: 'Touch Tutorial' },
              { id: 'video_theater', label: '🎬 AI Animated Video Theater', badge: '6 Channels' },
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
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#426CF5] text-white shadow-sm scale-[1.02]'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ==============================================================================
         * MODE 1: GAME-STYLE TACTICAL MISSIONS (BGMI TUTORIAL HUD)
         * ============================================================================== */}
        {activeTourMode === 'missions' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#FCFCFA]">
            
            {/* 4 Mission Cards Selector */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider block">
                SELECT VERIFICATION MISSION TUTORIAL:
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
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSel 
                          ? 'bg-white border-[#426CF5] shadow-md ring-2 ring-[#426CF5]/20' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {m.steps.length} Steps
                        </span>
                      </div>
                      <h4 className="font-bold text-xs font-outfit text-slate-900 line-clamp-2">
                        {m.title}
                      </h4>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tactical Mission Stage Box */}
            <div className="bg-white border-2 border-[#426CF5] rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              
              {/* Mission Header & Step Indicators */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-mono uppercase font-bold text-indigo-600">
                      LIVE MISSION OBJECTIVE • STEP {currentStepIdx + 1} OF {selectedMission.steps.length}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-outfit mt-0.5">
                    {selectedMission.title}
                  </h3>
                </div>

                {/* Stepper Dots */}
                <div className="flex items-center gap-1.5">
                  {selectedMission.steps.map((st, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        soundEngine.playClick();
                        setCurrentStepIdx(i);
                      }}
                      className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        i === currentStepIdx
                          ? 'bg-[#426CF5] text-white shadow-sm scale-105'
                          : i < currentStepIdx
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {i < currentStepIdx ? '✓' : i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tactical Coachmark Banner (BGMI Tutorial Style) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-start gap-3.5 shadow-inner">
                <div className="w-10 h-10 rounded-xl bg-[#426CF5] text-white flex items-center justify-center shrink-0 font-bold animate-bounce text-base">
                  🎯
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
                    {activeStep.title}
                  </div>
                  <h4 className="text-sm font-bold text-white font-outfit">
                    {activeStep.hudPrompt}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {activeStep.instruction}
                  </p>
                </div>
              </div>

              {/* Interactive Step Simulator Sub-Stage */}
              <div className="min-h-[220px] p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                
                {/* ---------------------------------------------------- */}
                {/* SCENARIO 1: EMPLOYEE VERIFICATION STEPS */}
                {/* ---------------------------------------------------- */}
                {selectedMission.id === 'employee_verification' && (
                  <>
                    {/* Step 1: Recruiter Intake */}
                    {currentStepIdx === 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-fadeIn">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Candidate Full Name *</label>
                          <input 
                            type="text" 
                            value={mockCandidate.name} 
                            onChange={(e) => setMockCandidate({ ...mockCandidate, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium" 
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Designation *</label>
                          <input 
                            type="text" 
                            value={mockCandidate.role} 
                            onChange={(e) => setMockCandidate({ ...mockCandidate, role: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium" 
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">State (All 28 States & 8 UTs) *</label>
                          <select
                            value={mockCandidate.state}
                            onChange={(e) => {
                              const st = e.target.value;
                              const dists = INDIA_STATES_DISTRICTS[st] || ['Others'];
                              setMockCandidate({ ...mockCandidate, state: st, district: dists[0] || 'Others' });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
                          >
                            {ALL_INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">District / City *</label>
                          <select
                            value={mockCandidate.district}
                            onChange={(e) => setMockCandidate({ ...mockCandidate, district: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium"
                          >
                            {(INDIA_STATES_DISTRICTS[mockCandidate.state] || ['Others']).map((d) => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Step 2: WhatsApp Magic Link */}
                    {currentStepIdx === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center animate-fadeIn text-xs">
                        <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <Smartphone className="w-4 h-4" />
                            <span>WhatsApp Notification (From JOY TRUE PROFILE)</span>
                          </div>
                          <p className="text-[11px] text-slate-200">
                            Hello {mockCandidate.name}, your background verification link is ready.
                          </p>
                          <div className="p-2 rounded-xl bg-slate-900 font-mono text-emerald-400 font-bold">
                            Unlock PIN: 1234
                          </div>
                        </div>

                        <div className="space-y-2 text-center">
                          <label className="font-semibold text-slate-800 block">Enter 4-Digit Access PIN</label>
                          <input 
                            type="password" 
                            maxLength={4}
                            placeholder="1234"
                            value={pinInput}
                            onChange={(e) => {
                              setPinInput(e.target.value);
                              if (e.target.value === '1234') {
                                setPinVerified(true);
                                soundEngine.playSuccess();
                              }
                            }}
                            className="w-32 text-center text-lg font-mono tracking-widest px-3 py-1.5 rounded-xl border border-slate-300 bg-white mx-auto block font-bold"
                          />
                          {pinVerified ? (
                            <span className="text-emerald-600 font-bold block">PIN 1234 Verified ✓</span>
                          ) : (
                            <button 
                              onClick={() => { setPinInput('1234'); setPinVerified(true); soundEngine.playSuccess(); }}
                              className="text-[#426CF5] font-semibold underline text-[11px] cursor-pointer"
                            >
                              Auto-fill PIN 1234
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Aadhaar e-KYC */}
                    {currentStepIdx === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-fadeIn">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">1. UIDAI Aadhaar e-KYC</span>
                            <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded">UIDAI Direct</span>
                          </div>
                          <input type="text" disabled value={mockCandidate.aadhaar} className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold" />
                          
                          {!otpSent ? (
                            <button onClick={() => { setOtpSent(true); soundEngine.playScan(); }} className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer">
                              Send UIDAI OTP 📲
                            </button>
                          ) : !otpVerified ? (
                            <div className="flex gap-2">
                              <input type="text" placeholder="OTP 489120" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-center" />
                              <button onClick={() => { setOtpVerified(true); soundEngine.playSuccess(); }} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer">Verify</button>
                            </div>
                          ) : (
                            <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl font-bold text-center">Aadhaar Demographic Matched ✓</div>
                          )}
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">2. Income Tax PAN 2.0</span>
                            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">NSDL Realtime</span>
                          </div>
                          <input type="text" disabled value={mockCandidate.pan} className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold" />
                          <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl font-bold text-center">PAN Status Active • Name Match 100% ✓</div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: 3D Face Biometric Selfie */}
                    {currentStepIdx === 3 && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2 animate-fadeIn text-xs">
                        <div className="w-40 h-48 rounded-3xl bg-slate-900 border-2 border-pink-500 p-2 flex flex-col items-center justify-center text-white relative shadow-md">
                          <Camera className="w-10 h-10 text-pink-400 animate-pulse" />
                          <div className="text-[9px] font-mono text-pink-300 mt-2">68-Point Mesh Scan</div>
                          {faceComplete && <span className="text-[9px] font-mono text-emerald-400 font-bold mt-1">MATCH: 99.98% ✓</span>}
                        </div>

                        <div className="space-y-3 max-w-xs">
                          <h5 className="font-bold text-slate-800">3D Face Anti-Spoofing Scan</h5>
                          <p className="text-slate-500 text-[11px] leading-relaxed">
                            Validates micro-depth geometry against official UIDAI Aadhaar photograph.
                          </p>
                          {!faceComplete ? (
                            <button
                              onClick={() => {
                                setFaceScanning(true);
                                soundEngine.playScan();
                                setTimeout(() => {
                                  setFaceScanning(false);
                                  setFaceComplete(true);
                                  soundEngine.playSuccess();
                                }, 800);
                              }}
                              className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold cursor-pointer shadow-xs"
                            >
                              {faceScanning ? 'Analyzing Face Mesh...' : 'Touch to Capture 3D Selfie 🤳'}
                            </button>
                          ) : (
                            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-center">
                              Face Liveness Cleared (99.98% Confidence) ✓
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 5: EPFO Moonlighting Radar */}
                    {currentStepIdx === 4 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center animate-fadeIn text-xs">
                        <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono space-y-2">
                          <div className="text-amber-400 font-bold">EPFO UAN AUDIT RAIL</div>
                          <div className="text-[11px] text-slate-300">Queried UAN: {mockCandidate.uan}</div>
                          <div className="text-[11px] text-slate-300">Previous: TCS Ltd (Relieved: Dec 2025)</div>
                          <div className="text-emerald-400 font-bold">Active Overlaps: 0 (CLEAN)</div>
                        </div>

                        <div className="space-y-3">
                          {!epfoComplete ? (
                            <button
                              onClick={() => {
                                setEpfoScanning(true);
                                soundEngine.playScan();
                                setTimeout(() => {
                                  setEpfoScanning(false);
                                  setEpfoComplete(true);
                                  soundEngine.playSuccess();
                                }, 700);
                              }}
                              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shadow-xs"
                            >
                              {epfoScanning ? 'Scanning EPFO Rails...' : 'Touch to Sweep Moonlighting Radar 🛡️'}
                            </button>
                          ) : (
                            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-center space-y-1">
                              <div>Dual Employment Verdict: CLEAN ✓</div>
                              <div className="text-[10px] text-emerald-700 font-normal">Candidate has 0 undeclared secondary payrolls.</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 6: PDF & Excel Outputs */}
                    {currentStepIdx === 5 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn text-xs">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                          <div>
                            <span className="text-[10px] font-bold text-red-600 block">360° CERTIFIED PDF</span>
                            <h5 className="font-bold text-sm text-slate-800 mt-0.5">Cryptographic PDF Dossier</h5>
                            <p className="text-slate-500 text-[11px] mt-1">Includes SHA-256 hash, timestamps, and masked Aadhaar.</p>
                          </div>
                          <button onClick={handleDownloadSamplePdfDossier} className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                            <Download className="w-4 h-4" />
                            <span>Download Sample PDF Dossier</span>
                          </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 block">5-TAB EXCEL WORKBOOK</span>
                            <h5 className="font-bold text-sm text-slate-800 mt-0.5">50+ Column Master Roster</h5>
                            <p className="text-slate-500 text-[11px] mt-1">Structured sheets for Demographics, IDs, Experience, Custom Fields.</p>
                          </div>
                          <button onClick={handleDownloadSampleExcelSheet} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                            <Download className="w-4 h-4" />
                            <span>Download Sample 5-Tab Excel</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ---------------------------------------------------- */}
                {/* SCENARIO 2: VENDOR & CONTRACTOR LABOR VERIFICATION */}
                {/* ---------------------------------------------------- */}
                {selectedMission.id === 'vendor_labor_verification' && (
                  <div className="animate-fadeIn text-xs space-y-3">
                    {currentStepIdx === 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Contractor Staffing Agency Name *</label>
                          <input type="text" value={mockVendor.agencyName} onChange={(e) => setMockVendor({ ...mockVendor, agencyName: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-medium" />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Corporate CIN Number *</label>
                          <input type="text" value={mockVendor.cin} onChange={(e) => setMockVendor({ ...mockVendor, cin: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold" />
                        </div>
                      </div>
                    )}

                    {currentStepIdx === 1 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                        <FileSpreadsheet className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h5 className="font-bold text-slate-800">Batch Onboarding 140 Contractor Personnel</h5>
                        <p className="text-slate-500 text-[11px]">Parsed 140 technician profiles with 50+ demographic and statutory columns.</p>
                        <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl font-bold font-mono">140 / 140 Valid Records ✓</div>
                      </div>
                    )}

                    {currentStepIdx === 2 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-800">CLRA Form XVI Statutory Muster Roll</span>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">STATUTORY AUDIT READY</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Automated generation of contractor labor register in compliance with Contract Labour (Regulation and Abolition) Act.
                        </p>
                      </div>
                    )}

                    {currentStepIdx === 3 && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                        <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500 flex flex-col items-center gap-2 shadow-md">
                          <QRCodeSVG value="JOY-PLANT-GATE-SRIPERUMBUDUR-PASS-9821" size={100} />
                          <span className="text-[10px] font-mono font-bold text-emerald-700">QR PASS: JOY-PLANT-9821</span>
                        </div>

                        <div className="space-y-2 max-w-xs">
                          <h5 className="font-bold text-slate-800">Sub-Second Plant Turnstile Clearance</h5>
                          <p className="text-slate-500 text-[11px]">
                            Security guards scan worker QR badge at factory turnstile gates in 0.34s.
                          </p>
                          <button
                            onClick={() => { setTurnstileScanned(true); soundEngine.playSuccess(); }}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
                          >
                            {turnstileScanned ? 'Turnstile Unlocked (0.34s) ✓' : 'Touch to Scan Gate Pass 🎫'}
                          </button>
                        </div>
                      </div>
                    )}

                    {currentStepIdx === 4 && (
                      <div className="p-4 rounded-2xl bg-emerald-950 text-white font-mono space-y-2">
                        <div className="text-emerald-400 font-bold">GHOST WORKER RECONCILIATION COMPLETE</div>
                        <div className="text-[11px] text-slate-300">Turnstile Headcount Matched: 140 / 140 Verified Technicians</div>
                        <div className="text-amber-300 font-bold">Ghost Worker Billing Prevented: ₹3,12,000 / month</div>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* SCENARIO 3: VENDOR B2B ENTITY KYC */}
                {/* ---------------------------------------------------- */}
                {selectedMission.id === 'vendor_b2b_kyc' && (
                  <div className="animate-fadeIn text-xs space-y-3">
                    {currentStepIdx === 0 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">MCA Corporate Registry Rail (CIN)</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">ACTIVE ROC</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-700">CIN: {mockVendor.cin}</div>
                        <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl font-bold">Company Status: Active & In Good Standing ✓</div>
                      </div>
                    )}

                    {currentStepIdx === 1 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">GSTIN 2B Tax Compliance Rail</span>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">GSTR-3B ACTIVE</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-700">GSTIN: {mockVendor.gstin}</div>
                        <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl font-bold">Tax Filings: 100% Up to Date ✓</div>
                      </div>
                    )}

                    {currentStepIdx === 2 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block">MSME Udyam Registration Audit</span>
                        <div className="font-mono text-[11px] text-slate-700">Udyam No: UDYAM-TN-03-009821</div>
                        <div className="text-indigo-700 bg-indigo-50 p-2 rounded-xl font-bold">Enterprise Classification: Small Enterprise (Manufacturing) ✓</div>
                      </div>
                    )}

                    {currentStepIdx === 3 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                        <h5 className="font-bold text-slate-800">NPCI IMPS ₹1 Bank Penny Drop</h5>
                        <p className="text-slate-500 text-[11px]">Validates vendor bank account beneficiary name match directly with receiving bank.</p>
                        <button
                          onClick={() => { setPennyDropDone(true); soundEngine.playSuccess(); }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold cursor-pointer"
                        >
                          {pennyDropDone ? 'Beneficiary Matched 100% (0.38s) ✓' : 'Execute ₹1 Penny Drop 🏦'}
                        </button>
                      </div>
                    )}

                    {currentStepIdx === 4 && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white text-center space-y-2">
                        <Award className="w-8 h-8 text-amber-400 mx-auto" />
                        <h5 className="font-bold text-base font-outfit">Vendor Trust Index: 99.8% (Tier-1 A+ Rating)</h5>
                        <p className="text-slate-300 text-[11px]">Authorized for enterprise procurement and corporate vendor contracts.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------------------------------------------- */}
                {/* SCENARIO 4: 3PL LOGISTICS & FLEET DRIVER SCREENING */}
                {/* ---------------------------------------------------- */}
                {selectedMission.id === 'logistics_driver_verification' && (
                  <div className="animate-fadeIn text-xs space-y-3">
                    {currentStepIdx === 0 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Parivahan Commercial DL Rail</span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">TRANSPORT BADGE</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-700">DL: TN-38-2022-0098214 (Heavy Goods Vehicle)</div>
                        <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl font-bold">Commercial License Active & Valid ✓</div>
                      </div>
                    )}

                    {currentStepIdx === 1 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block">Commercial Vehicle RC & Fitness</span>
                        <div className="font-mono text-[11px] text-slate-700">Vehicle: Ashok Leyland 1616 (Reg: TN-38-BZ-4921)</div>
                        <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl font-bold">Fitness Certificate & National Permit Valid ✓</div>
                      </div>
                    )}

                    {currentStepIdx === 2 && (
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-800 block">e-Courts Pan-India Criminal & Traffic Check</span>
                        <div className="text-emerald-700 bg-emerald-50 p-2 rounded-xl font-bold">Zero Adverse Police Records or Active Court Litigation ✓</div>
                      </div>
                    )}

                    {currentStepIdx === 3 && (
                      <div className="p-4 rounded-2xl bg-amber-950 text-white font-mono text-center space-y-2">
                        <Truck className="w-8 h-8 text-amber-400 mx-auto" />
                        <div className="text-amber-400 font-bold">DIGITAL FLEET GATE PASS ISSUED</div>
                        <div className="text-slate-300 text-[11px]">Authorized for warehouse loading bay access across all distribution centers.</div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Bottom Mission Navigation Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    if (currentStepIdx > 0) setCurrentStepIdx(currentStepIdx - 1);
                  }}
                  disabled={currentStepIdx === 0}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
                >
                  ← Previous Step
                </button>

                {currentStepIdx < selectedMission.steps.length - 1 ? (
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setCurrentStepIdx(currentStepIdx + 1);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
                  >
                    <span>{activeStep.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
                    }}
                    className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mission Completed! 🎉</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ==============================================================================
         * MODE 2: AI ANIMATED VIDEO SIMULATION THEATER
         * ============================================================================== */}
        {activeTourMode === 'video_theater' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950 text-white">
            
            {/* 6 Video Channels Switcher */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {VIDEO_CHANNELS.map((ch) => {
                const isSel = activeVideoChannel === ch.id;
                const Icon = ch.icon;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveVideoChannel(ch.id);
                      setVideoProgress(0);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSel 
                        ? 'bg-gradient-to-br from-indigo-900/90 to-slate-900 border-[#426CF5] text-white shadow-lg ring-1 ring-[#426CF5]' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-1.5 rounded-xl ${isSel ? 'bg-[#426CF5] text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[8px] font-mono px-1 rounded ${isSel ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                        {ch.badge}
                      </span>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold font-outfit text-white line-clamp-1">{ch.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Video Main Stage */}
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <div className="w-3 h-3 rounded-full bg-red-500 absolute inset-0" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">LIVE AI STREAM</span>
                      <span className="text-[10px] text-slate-500 font-mono">• 60 FPS 4K SIMULATION</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white font-outfit">{activeVideo.title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      soundEngine.playClick();
                      setVideoMuted(!videoMuted);
                    }} 
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  >
                    {videoMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button 
                    onClick={() => {
                      soundEngine.playClick();
                      setPlaybackSpeed(prev => prev === 1 ? 2 : prev === 2 ? 0.5 : 1);
                    }} 
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-indigo-300 cursor-pointer"
                  >
                    {playbackSpeed}x Speed
                  </button>
                </div>
              </div>

              {/* Animated Visual Display Area */}
              <div className="min-h-[260px] flex items-center justify-center relative">
                {activeVideoChannel === 'biometric' && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-8">
                    <div className="relative w-48 h-60 rounded-[50px] border-2 border-dashed border-[#426CF5] p-2 flex flex-col items-center justify-center bg-indigo-950/30 overflow-hidden shadow-inner">
                      <div 
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#426CF5] to-transparent shadow-[0_0_15px_#426CF5]"
                        style={{ top: `${(videoProgress * 2.4) % 100}%` }}
                      />
                      <Camera className="w-16 h-16 text-indigo-400/80 mb-2 animate-pulse" />
                      <div className="absolute bottom-3 bg-slate-900/90 px-3 py-1 rounded-full border border-indigo-500/40 text-[10px] font-mono text-emerald-400 font-bold">
                        MATCH: 99.98% ✓
                      </div>
                    </div>

                    <div className="space-y-3 font-mono text-xs max-w-sm">
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">UIDAI Rail Handshake</div>
                        <div className="text-emerald-400 font-bold mt-1">Demographic Match Confirmed (0.42s)</div>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">3D Depth & Liveness</div>
                        <div className="text-[#426CF5] font-bold mt-1">Live Human Confirmed (Anti-Spoof Passed)</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeVideoChannel === 'turnstile' && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-8">
                    <div className="p-4 rounded-3xl bg-white text-slate-900 flex flex-col items-center gap-2 shadow-2xl border-4 border-emerald-500">
                      <QRCodeSVG value="JOY-PASS-2026-SRIPERUMBUDUR" size={120} />
                      <div className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                        ● TURNSTILE UNLOCKED (0.34s)
                      </div>
                    </div>

                    <div className="space-y-3 font-mono text-xs max-w-sm">
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">CLRA Statutory Log</div>
                        <div className="text-emerald-400 font-bold mt-1">Form XVI Auto-Logged ✓</div>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Ghost Worker Prevention</div>
                        <div className="text-amber-400 font-bold mt-1">100% Agency Headcount Matched</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeVideoChannel !== 'biometric' && activeVideoChannel !== 'turnstile' && (
                  <div className="text-center space-y-3 font-mono">
                    <Activity className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
                    <h5 className="text-base font-bold text-white font-outfit">{activeVideo.title}</h5>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">{activeVideo.subtitle}</p>
                    <div className="text-emerald-400 text-xs font-bold">● High-Speed Direct Registry Rail Active</div>
                  </div>
                )}
              </div>

              {/* Video Timeline Scrubber */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-[#426CF5] font-bold">0:{Math.floor(videoProgress * 0.45).toString().padStart(2, '0')}</span>
                  <span>0:45 Total Simulation</span>
                </div>
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setVideoProgress((clickX / rect.width) * 100);
                  }}
                  className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer"
                >
                  <div className="h-full bg-gradient-to-r from-[#426CF5] via-indigo-500 to-emerald-400 transition-all duration-75" style={{ width: `${videoProgress}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setVideoPlaying(!videoPlaying);
                    }}
                    className="px-4 py-2 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {videoPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{videoPlaying ? 'Pause' : 'Resume Simulation'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setVideoProgress(0);
                    }}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom 4 Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeVideo.stats.map((st, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">{st.label}</div>
                  <div className="text-base font-bold text-white font-outfit mt-0.5">{st.value}</div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==============================================================================
         * MODE 3: COMPLETE KNOWLEDGE LIBRARY & SEARCHABLE GUIDES
         * ============================================================================== */}
        {activeTourMode === 'guides' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#FCFCFA]">
            
            {/* Search Box & Category Filters */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  placeholder="Search guides: 'how company verifies employees', 'verify vendors', 'turnstile', 'GSTIN', 'Aadhaar e-KYC'..."
                  value={guideSearchQuery}
                  onChange={(e) => setGuideSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-[#426CF5]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'All Guides' },
                  { id: 'employee', label: '👔 Verify Employees' },
                  { id: 'vendor', label: '🏭 Verify Vendors & Contractors' },
                  { id: 'fleet', label: '🚚 Verify Fleet Drivers' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setGuideCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                      guideCategory === cat.id 
                        ? 'bg-[#426CF5] text-white shadow-xs' 
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guides List */}
            <div className="space-y-3">
              {filteredGuides.map((g) => {
                const isExp = expandedGuideId === g.id;
                return (
                  <div key={g.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${g.badgeColor}`}>
                          {g.badge}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 font-outfit mt-1">{g.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{g.summary}</p>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          setExpandedGuideId(isExp ? null : g.id);
                        }}
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 cursor-pointer"
                      >
                        {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {isExp && (
                      <div className="pt-3 border-t border-slate-100 space-y-2 animate-fadeIn text-xs">
                        <div className="font-bold text-slate-800">Step-by-Step Instructions:</div>
                        <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          {g.steps.map((st, sIdx) => (
                            <div key={sIdx} className="text-slate-700 leading-relaxed font-medium">
                              {st}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ==============================================================================
         * MODAL FOOTER
         * ============================================================================== */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 rounded-b-3xl shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#426CF5]" />
            <span className="font-medium text-slate-700">Need personalized guidance? Enterprise verification engineers on standby 24/7.</span>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            className="px-5 py-2 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer transition-colors"
          >
            Close Guide Hub
          </button>
        </div>

      </div>
    </div>
  ), document.body);
};

export default InteractiveTourGuideModal;
