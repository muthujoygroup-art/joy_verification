import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Compass, 
  Search, 
  Sparkles, 
  UserPlus, 
  Mail, 
  MessageSquare, 
  CreditCard, 
  Bell, 
  LifeBuoy, 
  Building2, 
  Sliders, 
  FileDown, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  X, 
  Play, 
  Pause,
  RotateCcw,
  HelpCircle,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Crown,
  Camera,
  Smartphone,
  HardHat,
  Radio,
  FileSpreadsheet,
  FileText,
  Lock,
  Layers,
  Activity,
  Check,
  RefreshCw,
  Eye,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  QrCode,
  Users,
  MapPin,
  Clock,
  Award
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/uiSoundEffects';
import { exportIndividualCandidateToExcel, exportAllCandidatesToExcel } from '../utils/employeeExcelExport';
import { INDIA_STATES_DISTRICTS, ALL_INDIA_STATES } from '../data/indiaLocations';
import confetti from 'canvas-confetti';

// 4 Video / Animation Channels for Mode 1
const VIDEO_SIMULATION_CHANNELS = [
  {
    id: 'biometric',
    title: '3D AI Biometric Face Mesh Scan',
    subtitle: 'Anti-Spoofing Liveness & UIDAI Photo Match',
    badge: 'BIOMETRIC HUD',
    icon: Camera,
    color: 'from-purple-600 via-indigo-600 to-cyan-500',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    stats: [
      { label: 'Match Confidence', value: '99.98%' },
      { label: 'Latency', value: '0.42s' },
      { label: 'Anti-Spoofing', value: 'Active 3D Mesh' },
      { label: 'Registry', value: 'UIDAI Direct' }
    ],
    chapters: [
      { time: '0:02', title: 'User Face Detected in Oval Frame' },
      { time: '0:12', title: '68-Point Mesh Vectorization & Anti-Spoof' },
      { time: '0:25', title: 'Aadhaar Demographic Photo Correlation' },
      { time: '0:38', title: 'Verification Cleared: Confidence 99.98%' }
    ]
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Candidate Magic Link Flow',
    subtitle: 'Zero-App Mobile Self-Verification Experience',
    badge: 'MOBILE WEB STREAM',
    icon: Smartphone,
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    stats: [
      { label: 'Completion Time', value: '38s' },
      { label: 'Drop-off Rate', value: '<1.8%' },
      { label: 'Channels', value: 'WA / SMS / Email' },
      { label: 'PIN Security', value: '4-Digit Encrypted' }
    ],
    chapters: [
      { time: '0:03', title: 'Recruiter Dispatches WhatsApp Link' },
      { time: '0:14', title: 'Candidate Receives SMS & WA with PIN 1234' },
      { time: '0:26', title: 'Instant Mobile Web KYC Form Loaded' },
      { time: '0:40', title: 'Profile Submitted & Synced to HR Pipeline' }
    ]
  },
  {
    id: 'epfo_radar',
    title: 'EPFO UAN Moonlighting Radar',
    subtitle: 'Dual-Employment & Active Payroll Audit',
    badge: 'RADAR SONAR AUDIT',
    icon: Search,
    color: 'from-amber-500 via-orange-600 to-rose-600',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    stats: [
      { label: 'Service History', value: '4 Historical Tenures' },
      { label: 'Active Overlaps', value: '0 (Clean)' },
      { label: 'Risk Score', value: 'Low (0.01%)' },
      { label: 'Database', value: 'EPFO Unified Member Rail' }
    ],
    chapters: [
      { time: '0:04', title: 'EPFO UAN 100982347891 Queried' },
      { time: '0:16', title: 'Provident Fund Contribution Scan' },
      { time: '0:28', title: 'Dual Employment & Overlap Analysis' },
      { time: '0:42', title: 'Verdict: Zero Active Conflicts (Green)' }
    ]
  },
  {
    id: 'turnstile',
    title: 'Plant QR Pass Turnstile Gate',
    subtitle: 'Sub-Second Scannable Access for Factory Staff',
    badge: 'PLANT IOT GATEWAY',
    icon: HardHat,
    color: 'from-blue-600 via-indigo-600 to-emerald-600',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    stats: [
      { label: 'Scan Response', value: '0.34s' },
      { label: 'Audit Log', value: 'Statutory Form XVI' },
      { label: 'Gate Status', value: 'Turnstile Unlocked' },
      { label: 'Safety Badge', value: 'CLRA Compliant' }
    ],
    chapters: [
      { time: '0:03', title: 'Worker Arrives at Plant Security Gate' },
      { time: '0:15', title: 'Security Scans Digital QR Gate Pass' },
      { time: '0:27', title: 'Real-Time Clearance & Muster Entry' },
      { time: '0:39', title: 'Turnstile Unlocks & Audit Log Recorded' }
    ]
  }
];

export const InteractiveTourGuideModal = ({ 
  isOpen = false, 
  onClose, 
  onSelectAction, 
  currentRole = 'company' 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('video'); // 'video' | 'sample_flow' | 'guides' | 'sandbox'
  
  // Mode 1 State (AI Video Simulation)
  const [activeChannel, setActiveChannel] = useState('biometric');
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoMuted, setVideoMuted] = useState(false);

  // Mode 2 State (Sample 6-Step Verification Flow)
  const [flowStep, setFlowStep] = useState(1);
  const [flowCandidate, setFlowCandidate] = useState({
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
    bank: 'HDFC Bank - 501002348912',
    ifsc: 'HDFC0001234'
  });
  const [candidatePinInput, setCandidatePinInput] = useState('');
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [aadhaarOtpInput, setAadhaarOtpInput] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [faceScanProgress, setFaceScanProgress] = useState(0);
  const [faceScanComplete, setFaceScanComplete] = useState(false);
  const [epfoScanProgress, setEpfoScanProgress] = useState(0);
  const [epfoScanComplete, setEpfoScanComplete] = useState(false);

  // Mode 3 State (Guides Library)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTopicId, setExpandedTopicId] = useState(null);

  // Mode 4 State (Persona Sandbox)
  const [selectedPersona, setSelectedPersona] = useState('recruiter');

  // Sync Open State
  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleOpen = () => setInternalOpen(true);
    window.addEventListener('open_tour_guide_modal', handleOpen);
    return () => window.removeEventListener('open_tour_guide_modal', handleOpen);
  }, []);

  // Video Animation Loop
  useEffect(() => {
    let interval;
    if (activeMode === 'video' && isPlaying && internalOpen) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            return 0; // Loop seamlessly
          }
          return prev + (0.6 * playbackSpeed);
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [activeMode, isPlaying, playbackSpeed, internalOpen]);

  const isModalVisible = isOpen || internalOpen;
  if (!isModalVisible) return null;

  const handleModalClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
  };

  const channelData = VIDEO_SIMULATION_CHANNELS.find(c => c.id === activeChannel) || VIDEO_SIMULATION_CHANNELS[0];
  const ChannelIcon = channelData.icon;

  // Sample PDF Dossier Generator
  const handleDownloadSamplePdfDossier = () => {
    soundEngine.playSuccess();
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Header Banner
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 28, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('JOY TRUE PROFILE - 360° VERIFICATION DOSSIER', 14, 14);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Statutory & Biometric Workforce Verification Certificate • Tamper-Proof Audit Record', 14, 21);

      // Status Badge
      doc.setFillColor(41, 156, 104);
      doc.roundedRect(145, 8, 52, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('100% VERIFIED ✓', 153, 16);

      // Section: Candidate Profile
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Candidate Demographics & Identification', 14, 40);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 43, 196, 43);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Full Name: ${flowCandidate.name}`, 14, 52);
      doc.text(`Designation: ${flowCandidate.role}`, 14, 59);
      doc.text(`Department: ${flowCandidate.department}`, 14, 66);
      doc.text(`State / Region: ${flowCandidate.district}, ${flowCandidate.state}`, 14, 73);

      doc.text(`Mobile: ${flowCandidate.phone}`, 110, 52);
      doc.text(`Email: ${flowCandidate.email}`, 110, 59);
      doc.text(`Aadhaar (Masked): XXXX-XXXX-8921`, 110, 66);
      doc.text(`PAN Number: ${flowCandidate.pan}`, 110, 73);

      // Section: Verification Checks Summary
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Real-Time Verification Checks Summary', 14, 90);
      doc.line(14, 93, 196, 93);

      const checks = [
        ['Aadhaar UIDAI e-KYC', 'UIDAI Direct Rail', 'Demographics & Address Match', 'VERIFIED ✓ (420ms)'],
        ['PAN 2.0 Identity', 'NSDL / Income Tax Dept', 'Active & Name Matched 100%', 'VERIFIED ✓ (380ms)'],
        ['3D AI Face Liveness', 'Anti-Spoofing Biometric Engine', '99.98% Confidence Score', 'VERIFIED ✓ (450ms)'],
        ['EPFO Moonlighting Radar', 'EPFO Unified Member Portal', '0 Active Overlaps (Clean)', 'CLEAN ✓ (610ms)'],
        ['Bank Account Penny Drop', 'NPCI IMPS Fast Rail', 'Account Beneficiary Match', 'VERIFIED ✓ (520ms)'],
        ['Court & Litigation Check', 'e-Courts Pan-India Rail', 'Zero Active Criminal Records', 'CLEAN ✓ (780ms)']
      ];

      let yPos = 103;
      checks.forEach((chk, i) => {
        doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
        doc.rect(14, yPos - 5, 182, 9, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text(chk[0], 16, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(chk[1], 65, yPos);
        doc.text(chk[2], 115, yPos);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 156, 104);
        doc.text(chk[3], 160, yPos);
        doc.setTextColor(30, 41, 59);
        yPos += 9;
      });

      // Section: Turnstile Gate Pass & Hash
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('3. Statutory Compliance & Plant Turnstile Gate Access', 14, 168);
      doc.line(14, 171, 196, 171);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('CLRA Form XVI Register: Automatic statutory compliance entry generated.', 14, 180);
      doc.text('Turnstile Gate Badge: QR Code Token JOY-GATE-2026-9812-PASS valid across all plant gates.', 14, 187);
      doc.text('Cryptographic Hash (SHA-256): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 14, 194);
      doc.text(`Report Generated: ${new Date().toLocaleString('en-IN')}`, 14, 201);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('JOY CORPORATE SOLUTIONS PRIVATE LIMITED • Powered by JOY TRUE PROFILE AI Engine', 14, 280);

      doc.save(`JOY_TrueProfile_Dossier_${flowCandidate.name.replace(/\s+/g, '_')}.pdf`);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error('PDF Generation Error:', e);
    }
  };

  // Sample Excel Sheet Generator
  const handleDownloadSampleExcelSheet = () => {
    soundEngine.playSuccess();
    const mockCandidate = {
      name: flowCandidate.name,
      role: flowCandidate.role,
      department: flowCandidate.department,
      phone: flowCandidate.phone,
      email: flowCandidate.email,
      state: flowCandidate.state,
      district: flowCandidate.district,
      aadhaarNo: flowCandidate.aadhaar,
      panNo: flowCandidate.pan,
      uanEpf: flowCandidate.uan,
      bankName: 'HDFC Bank Ltd',
      bankAccountNo: '501002348912',
      ifscCode: 'HDFC0001234',
      status: 'VERIFIED',
      verificationDate: new Date().toISOString().split('T')[0],
      score: '99.98%'
    };
    exportIndividualCandidateToExcel(mockCandidate, { name: 'JOY Corporate Solutions Pvt Ltd' });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  // Guide Topics Database
  const guideTopics = [
    {
      id: 'hr_add_candidate',
      title: '👔 Adding New Candidates & Multi-Channel Magic Link Dispatch',
      category: 'hr_recruitment',
      badge: 'RECRUITER WORKSTATION',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: UserPlus,
      summary: 'How HR teams can add candidates, configure specific verification checks, and dispatch instant PIN-protected magic links via WhatsApp, SMS, and Email.',
      steps: [
        'Open the HR Executive Portal and click "+ Add Candidate & Send Link".',
        'Fill in candidate Full Name, Mobile Number, Email ID, State, and District from the cascading dropdowns.',
        'Select the required verification modules (UIDAI Aadhaar, PAN 2.0, 3D Face Biometric, EPFO Moonlighting, Bank Penny Drop).',
        'Click "Dispatch Verification Link" - the candidate receives an automated WhatsApp and SMS message with their 4-digit security PIN instantly.'
      ],
      keyTakeaways: 'Candidates do not need to install any mobile app. The link works on any standard mobile browser in under 2 minutes.'
    },
    {
      id: 'hr_bulk_excel',
      title: '📥 Bulk Candidate Onboarding via Formatted Excel Templates',
      category: 'hr_recruitment',
      badge: 'BULK OPERATIONS',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: FileSpreadsheet,
      summary: 'Upload Excel files containing dozens or hundreds of candidate profiles to initiate parallel automated background screenings.',
      steps: [
        'Click "Bulk Import (Excel)" in the candidate pipeline view.',
        'Download the pre-formatted Excel template with 50+ standardized demographic columns.',
        'Populate candidate names, phone numbers, state/district, and designated roles.',
        'Upload the file — our validation parser verifies row schemas and dispatches individual magic links in parallel.'
      ],
      keyTakeaways: 'System automatically issues sequential employee IDs (e.g. JOY-EMP-001) and flags duplicate records in real time.'
    },
    {
      id: 'cand_aadhaar_kyc',
      title: '🆔 Candidate Aadhaar UIDAI e-KYC & Demographic Verification',
      category: 'candidate_flow',
      badge: 'CANDIDATE SELF-SERVICE',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: ShieldCheck,
      summary: 'Complete guide for candidates to authenticate their national identity securely using official UIDAI OTP.',
      steps: [
        'Open the magic link received on WhatsApp / SMS and input your 4-digit security PIN.',
        'Navigate to Step 1: Aadhaar e-KYC and enter your 12-digit Aadhaar number.',
        'Tap "Send UIDAI OTP" to receive an official 6-digit OTP on your Aadhaar-linked mobile.',
        'Enter the OTP code and confirm. Demographic details, photo, and address are verified instantly with zero manual paperwork.'
      ],
      keyTakeaways: 'Aadhaar numbers are automatically masked (e.g. XXXX-XXXX-8921) in full compliance with UIDAI regulations.'
    },
    {
      id: 'cand_3d_face',
      title: '🤳 3D AI Biometric Liveness & Anti-Spoofing Selfie Scan',
      category: 'candidate_flow',
      badge: 'BIOMETRIC AI',
      badgeClass: 'bg-pink-100 text-pink-800 border-pink-200',
      icon: Camera,
      summary: 'Capturing a live 3D face selfie for real-time anti-spoofing detection and automated cross-matching against official ID photos.',
      steps: [
        'Allow camera access permissions in your mobile or desktop browser.',
        'Align your face within the green oval bounding box in a well-lit environment.',
        'Follow subtle prompts (slight nod or blink) for active 3D anti-spoofing liveness verification.',
        'The AI biometric engine computes a 68-point facial mesh and validates the photo match score in under 450 milliseconds.'
      ],
      keyTakeaways: 'Guarantees 99.98% match accuracy and completely blocks deepfakes, photo printouts, and digital replay attacks.'
    },
    {
      id: 'epfo_moonlighting_check',
      title: '🛡️ EPFO UAN Moonlighting Radar & Dual-Employment Detection',
      category: 'compliance',
      badge: 'STATUTORY AUDIT',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Search,
      summary: 'Detect active secondary employment, undisclosed concurrent payrolls, and overlapping provident fund contributions.',
      steps: [
        'The platform queries the candidate’s EPFO Universal Account Number (UAN) across official registries.',
        'Historical employer tenures and PF contribution records are mapped along a unified chronological timeline.',
        'The moonlighting radar analyzes overlapping active contribution dates across different establishment codes.',
        'A comprehensive risk verdict (Clean / Amber / Red Flag) is attached directly to the candidate’s 360° dossier.'
      ],
      keyTakeaways: 'Protects enterprise intellectual property and ensures total statutory compliance before offer letters are released.'
    },
    {
      id: 'turnstile_gate_pass',
      title: '🏭 Plant Turnstile QR Gate Pass & CLRA Form XVI Muster',
      category: 'compliance',
      badge: 'FACILITY ACCESS',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: HardHat,
      summary: 'Issuing tamper-proof QR gate passes for contractor labor and automated logging into statutory CLRA Form XVI muster rolls.',
      steps: [
        'Upon 100% verification clearance, a cryptographic digital QR gate pass is generated automatically.',
        'Contractor technicians present their digital badge to plant turnstile optical scanners or security mobile tablets.',
        'Sub-second authentication unlocks the physical plant turnstile.',
        'The entry is permanently logged into the statutory CLRA Form XVI contractor labor register for government labor audits.'
      ],
      keyTakeaways: 'Eliminates ghost worker billing across third-party staffing agencies and ensures 100% audit readiness.'
    },
    {
      id: 'excel_pdf_export',
      title: '📊 Exporting 5-Tab Excel Spreadsheets & 360° PDF Dossiers',
      category: 'exports',
      badge: 'EXCEL & PDF SUITE',
      badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: FileDown,
      summary: 'Generating multi-sheet Excel workbooks and certified audit-ready PDF dossiers for individual candidates and entire workforce rosters.',
      steps: [
        'For individual candidate profiles: Click "Download Profile Excel" to export a 5-tab workbook (Master Profile, Address, Experience, Statutory IDs, Custom Fields).',
        'Click "Download Profile PDF" to generate a crisp, vector-rendered A4 background verification certificate with digital cryptographic signatures.',
        'For company-wide rosters: Click "Export All Candidates (Excel)" to download a 50+ column master spreadsheet of all verified personnel.',
        'Open the files in Microsoft Excel, Apple Numbers, Google Sheets, or any PDF reader with zero formatting loss.'
      ],
      keyTakeaways: 'Built on SheetJS binary engine and jsPDF vector renderer for instant, high-fidelity exports.'
    },
    {
      id: 'dpdp_consent_framework',
      title: '🔒 Digital Personal Data Protection (DPDP) Act 2023 Compliance',
      category: 'compliance',
      badge: 'DATA PRIVACY',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: Lock,
      summary: 'How JOY TRUE PROFILE implements consent architecture, automated data masking, 256-bit encryption, and immutable audit trails.',
      steps: [
        'Every verification begins with explicit OTP-based consent from the candidate.',
        'Sensitive government identifiers (Aadhaar, PAN, Bank details) are encrypted with 256-bit AES at rest and in transit.',
        'Aadhaar numbers are automatically redacted in generated reports.',
        'Candidates can exercise statutory rights including consent revocation and data viewing through their PIN-secured portal.'
      ],
      keyTakeaways: '100% compliant with Indian sovereign data protection mandates with all data stored strictly within Indian cloud borders.'
    }
  ];

  const filteredGuides = guideTopics.filter(g => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.steps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return createPortal((
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 md:p-6 flex justify-center items-start animate-fadeIn">
      <div className="w-full max-w-5xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 animate-modal-spring max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* ==============================================================================
         * MODAL HEADER
         * ============================================================================== */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#182230] to-indigo-950 text-white rounded-t-3xl border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#426CF5]/30 border border-[#426CF5]/40 text-[#426CF5]">
              <Compass className="w-7 h-7 animate-spin-slow text-[#426CF5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#426CF5] text-white text-[10px] font-bold uppercase tracking-wider">
                  Interactive Tour & Guide Hub
                </span>
                <span className="text-xs text-slate-300 font-mono hidden sm:inline">JOY TRUE PROFILE 2.0</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-outfit mt-0.5">
                Workforce Verification Platform Tour 🧭
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
         * 4-MODE SEGMENTED SWITCHER BAR
         * ============================================================================== */}
        <div className="p-3 bg-[#FCFCFA] border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 min-w-max">
            {[
              { id: 'video', label: '🎬 AI Animated Video Simulation', badge: 'Live Stream' },
              { id: 'sample_flow', label: '⚡ Sample 6-Step Verification Flow', badge: 'Interactive' },
              { id: 'guides', label: '📚 Guide Library & Knowledge Base', badge: '8 Guides' },
              { id: 'sandbox', label: '🎮 Live Persona Sandbox', badge: 'Test-Drive' }
            ].map((m) => {
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveMode(m.id);
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
         * MODAL BODY: MODE 1 — AI ANIMATED VIDEO SIMULATION PLAYER
         * ============================================================================== */}
        {activeMode === 'video' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950 text-white">
            
            {/* Channel Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VIDEO_SIMULATION_CHANNELS.map((ch) => {
                const isSel = activeChannel === ch.id;
                const Icon = ch.icon;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveChannel(ch.id);
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
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isSel ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                        {ch.badge}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold font-outfit text-white line-clamp-1">{ch.title}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{ch.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Video Player Main Stage */}
            <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
              
              {/* Top Video HUD Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500 absolute inset-0"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">LIVE AI STREAM</span>
                      <span className="text-[10px] text-slate-500 font-mono">• 60 FPS 4K SIMULATION</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white font-outfit">{channelData.title}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      soundEngine.playClick();
                      setVideoMuted(!videoMuted);
                    }} 
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
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

              {/* Animated Stage Display */}
              <div className="min-h-[260px] sm:min-h-[300px] flex items-center justify-center relative">
                
                {/* Channel 1: Biometric Face Mesh Scan Animation */}
                {activeChannel === 'biometric' && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-8">
                    {/* 3D Oval Face Frame with Scanning Ray */}
                    <div className="relative w-48 h-60 rounded-[50px] border-2 border-dashed border-[#426CF5] p-2 flex flex-col items-center justify-center bg-indigo-950/30 overflow-hidden shadow-inner">
                      {/* Scanning Laser Line */}
                      <div 
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#426CF5] to-transparent shadow-[0_0_15px_#426CF5] transition-all duration-75"
                        style={{ top: `${(videoProgress * 2.4) % 100}%` }}
                      />
                      
                      {/* Biometric Landmark Dots */}
                      <div className="relative w-36 h-48 flex flex-col items-center justify-center">
                        <Camera className="w-16 h-16 text-indigo-400/80 mb-2 animate-pulse" />
                        <div className="grid grid-cols-5 gap-3 w-28 opacity-70">
                          {[...Array(15)].map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? 'bg-emerald-400 animate-ping' : 'bg-[#426CF5]'}`} />
                          ))}
                        </div>
                      </div>

                      <div className="absolute bottom-3 bg-slate-900/90 px-3 py-1 rounded-full border border-indigo-500/40 text-[10px] font-mono text-emerald-400 font-bold">
                        MATCH: 99.98% ✓
                      </div>
                    </div>

                    {/* Telemetry Stream Box */}
                    <div className="flex-1 max-w-sm space-y-3 font-mono text-xs">
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">UIDAI Registry Handshake</div>
                        <div className="text-emerald-400 font-bold mt-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Demographic Match Confirmed (0.42s)</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">3D Depth & Liveness Vector</div>
                        <div className="text-[#426CF5] font-bold mt-1">
                          Live Human Confirmed (Anti-Spoof Passed)
                        </div>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Tamper-Proof Audit Hash</div>
                        <div className="text-slate-300 text-[10px] truncate mt-1">
                          SHA256: 9f83ac12048592cbfae0892471...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Channel 2: WhatsApp Magic Link Animation */}
                {activeChannel === 'whatsapp' && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-8">
                    {/* Simulated Mobile Device Frame */}
                    <div className="w-64 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 p-4 shadow-2xl relative">
                      <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-3" />
                      
                      {/* WhatsApp Chat Bubble */}
                      <div className="bg-emerald-950/60 border border-emerald-500/30 p-3 rounded-2xl text-xs space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>JOY TRUE PROFILE</span>
                        </div>
                        <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                          Hello Kavitha, your employer has invited you to verify your workforce profile in 45s.
                        </p>
                        <div className="bg-slate-900 p-2 rounded-xl text-[10px] font-mono text-amber-300">
                          Your Unlock PIN: <span className="text-white font-bold">1234</span>
                        </div>
                        <div className="text-[10px] text-[#426CF5] underline font-sans font-semibold">
                          https://joytrueprofile.com/verify/link-9821
                        </div>
                      </div>

                      <div className="mt-4 p-2.5 rounded-xl bg-slate-800 text-center text-[10px] font-mono text-emerald-400">
                        ● Zero App Download Required
                      </div>
                    </div>

                    <div className="flex-1 max-w-sm space-y-3 font-mono text-xs">
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Delivery Channel</div>
                        <div className="text-emerald-400 font-bold mt-1">WhatsApp Cloud API & SMS DLT</div>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Average Candidate Completion</div>
                        <div className="text-amber-400 font-bold mt-1">38 Seconds Total TAT</div>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Security Protection</div>
                        <div className="text-[#426CF5] font-bold mt-1">4-Digit PIN + OTP Dual Lock</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Channel 3: EPFO Moonlighting Radar Animation */}
                {activeChannel === 'epfo_radar' && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-8">
                    {/* Radar Sonar Circle */}
                    <div className="relative w-56 h-56 rounded-full border border-amber-500/40 flex items-center justify-center bg-amber-950/20">
                      <div className="absolute inset-4 rounded-full border border-amber-500/20 animate-ping" />
                      <div className="absolute inset-12 rounded-full border border-amber-500/30" />
                      <div className="absolute inset-20 rounded-full border border-amber-500/40" />
                      
                      {/* Sweeping Beam */}
                      <div 
                        className="absolute w-28 h-28 top-0 left-0 origin-bottom-right bg-gradient-to-br from-amber-400/30 to-transparent"
                        style={{ transform: `rotate(${(videoProgress * 3.6) % 360}deg)` }}
                      />

                      <Search className="w-10 h-10 text-amber-400 relative z-10" />

                      <div className="absolute bottom-2 bg-slate-900 px-3 py-1 rounded-full border border-amber-500/40 text-[10px] font-mono text-emerald-400 font-bold">
                        UAN DUAL EMPLOYMENT: ZERO ✓
                      </div>
                    </div>

                    <div className="flex-1 max-w-sm space-y-3 font-mono text-xs">
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">EPFO Registry Status</div>
                        <div className="text-emerald-400 font-bold mt-1">UAN 100982347891 - Active & Clean</div>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Dual Employment Overlap</div>
                        <div className="text-emerald-400 font-bold mt-1">0 Conflicting Active Tenures</div>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Moonlighting Risk Level</div>
                        <div className="text-emerald-400 font-bold mt-1">LOWEST (0.01% Risk Index)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Channel 4: Turnstile Gate Pass Animation */}
                {activeChannel === 'turnstile' && (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-8">
                    {/* Scannable Turnstile QR Display */}
                    <div className="p-5 rounded-3xl bg-white text-slate-900 flex flex-col items-center gap-3 shadow-2xl border-4 border-emerald-500">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <HardHat className="w-4 h-4 text-[#426CF5]" />
                        <span>PLANT GATE PASS</span>
                      </div>
                      <QRCodeSVG value="JOY-PASS-2026-KAVITHA-SRIPERUMBUDUR" size={130} />
                      <div className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full">
                        ● TURNSTILE UNLOCKED (0.34s)
                      </div>
                    </div>

                    <div className="flex-1 max-w-sm space-y-3 font-mono text-xs">
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Statutory Register Entry</div>
                        <div className="text-emerald-400 font-bold mt-1">CLRA Form XVI Auto-Logged ✓</div>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Gate Optical Scanner</div>
                        <div className="text-[#426CF5] font-bold mt-1">Sriperumbudur Hub - Turnstile #04</div>
                      </div>
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Ghost Worker Prevention</div>
                        <div className="text-amber-400 font-bold mt-1">100% Agency Invoicing Matched</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Video Scrubber & Playback Controls Bar */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                {/* Progress Bar with Chapters */}
                <div className="space-y-1.5">
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
                    className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative"
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-[#426CF5] via-indigo-500 to-emerald-400 transition-all duration-75"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons & Chapter Selector */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setIsPlaying(!isPlaying);
                      }}
                      className="px-4 py-2 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isPlaying ? 'Pause' : 'Resume Simulation'}</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setVideoProgress(0);
                      }}
                      className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Restart Video"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Chapter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
                    {channelData.chapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          soundEngine.playClick();
                          setVideoProgress((idx / channelData.chapters.length) * 100);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white cursor-pointer whitespace-nowrap"
                      >
                        {ch.time} {ch.title.split(' ')[0]}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom 4 Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {channelData.stats.map((st, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">{st.label}</div>
                  <div className="text-base font-bold text-white font-outfit mt-0.5">{st.value}</div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==============================================================================
         * MODAL BODY: MODE 2 — INTERACTIVE SAMPLE 6-STEP VERIFICATION FLOW
         * ============================================================================== */}
        {activeMode === 'sample_flow' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#FCFCFA]">
            
            {/* 6-Step Stepper Progress Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#426CF5] uppercase tracking-wider">
                  Interactive Simulation: Step {flowStep} of 6
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {flowStep === 1 && '1. HR Recruiter Intake'}
                  {flowStep === 2 && '2. WhatsApp Magic Link & PIN'}
                  {flowStep === 3 && '3. Aadhaar e-KYC & PAN'}
                  {flowStep === 4 && '4. 3D Face Biometric Scan'}
                  {flowStep === 5 && '5. EPFO Moonlighting Radar'}
                  {flowStep === 6 && '6. Dossier & Master Excel Output'}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      soundEngine.playClick();
                      setFlowStep(s);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      s <= flowStep ? 'bg-[#426CF5]' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: HR RECRUITER INTAKE */}
            {flowStep === 1 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#426CF5] bg-[#EAF5FF] px-2.5 py-0.5 rounded-full">
                      STEP 1: RECRUITER WORKSTATION
                    </span>
                    <h4 className="text-lg font-bold text-[#182230] font-outfit mt-1">Initiate Candidate Verification</h4>
                  </div>
                  <Users className="w-6 h-6 text-[#426CF5]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Candidate Full Name *</label>
                    <input 
                      type="text" 
                      value={flowCandidate.name} 
                      onChange={(e) => setFlowCandidate({ ...flowCandidate, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Designation / Role *</label>
                    <input 
                      type="text" 
                      value={flowCandidate.role} 
                      onChange={(e) => setFlowCandidate({ ...flowCandidate, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">State / Province (All 28 States & 8 UTs) *</label>
                    <select
                      value={flowCandidate.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const dists = INDIA_STATES_DISTRICTS[newState] || ['Others'];
                        setFlowCandidate({ ...flowCandidate, state: newState, district: dists[0] || 'Others' });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    >
                      {ALL_INDIA_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">District / City *</label>
                    <select
                      value={flowCandidate.district}
                      onChange={(e) => setFlowCandidate({ ...flowCandidate, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    >
                      {(INDIA_STATES_DISTRICTS[flowCandidate.state] || ['Others']).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mobile Number (WhatsApp Enabled) *</label>
                    <input 
                      type="text" 
                      value={flowCandidate.phone} 
                      onChange={(e) => setFlowCandidate({ ...flowCandidate, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Candidate Email Address *</label>
                    <input 
                      type="text" 
                      value={flowCandidate.email} 
                      onChange={(e) => setFlowCandidate({ ...flowCandidate, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EAF5FF] border border-blue-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#426CF5] font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-selected checks: Aadhaar e-KYC, PAN 2.0, 3D Face Biometric, EPFO Moonlighting, Bank Penny Drop</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setFlowStep(2);
                    }}
                    className="px-6 py-3 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Dispatch Magic Link to Candidate 🚀</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: WHATSAPP MAGIC LINK & PIN */}
            {flowStep === 2 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      STEP 2: CANDIDATE MOBILE INBOX
                    </span>
                    <h4 className="text-lg font-bold text-[#182230] font-outfit mt-1">WhatsApp Magic Link & 4-Digit Security PIN</h4>
                  </div>
                  <Smartphone className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-3 shadow-md">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>WhatsApp Notification (From JOY TRUE PROFILE)</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Dear {flowCandidate.name}, please complete your background verification for {flowCandidate.role}.
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs font-mono">
                      Your Access PIN: <span className="text-emerald-400 font-bold">1234</span>
                    </div>
                    <div className="text-xs text-[#426CF5] underline cursor-pointer">
                      Click to start verification (Zero app install) ↗
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 text-center">
                    <h5 className="font-bold text-sm text-slate-800">Enter Candidate Access PIN</h5>
                    <p className="text-xs text-slate-500">Input the 4-digit PIN (default: 1234) to unlock your portal:</p>
                    <input 
                      type="password" 
                      maxLength={4}
                      placeholder="• • • •" 
                      value={candidatePinInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCandidatePinInput(val);
                        if (val === '1234') {
                          soundEngine.playSuccess();
                          setPinUnlocked(true);
                        }
                      }}
                      className="w-36 text-center text-xl font-mono tracking-widest px-4 py-2 rounded-xl border border-slate-300 bg-white font-bold mx-auto block"
                    />

                    {pinUnlocked ? (
                      <div className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>PIN 1234 Verified! Portal Unlocked.</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setCandidatePinInput('1234');
                          soundEngine.playSuccess();
                          setPinUnlocked(true);
                        }}
                        className="text-xs text-[#426CF5] font-semibold underline cursor-pointer"
                      >
                        Auto-fill PIN 1234
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setFlowStep(1)} className="text-xs text-slate-500 font-semibold cursor-pointer">
                    ← Back to Step 1
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setFlowStep(3);
                    }}
                    disabled={!pinUnlocked && candidatePinInput !== '1234'}
                    className="px-6 py-3 rounded-full bg-[#426CF5] hover:bg-[#3459D8] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Continue to Aadhaar e-KYC →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: AADHAAR E-KYC & PAN */}
            {flowStep === 3 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      STEP 3: GOVERNMENT ID VERIFICATION
                    </span>
                    <h4 className="text-lg font-bold text-[#182230] font-outfit mt-1">UIDAI Aadhaar e-KYC & PAN 2.0 Authentication</h4>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aadhaar Card */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">1. UIDAI Aadhaar Verification</span>
                      <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded">UIDAI OTP Rail</span>
                    </div>
                    <input 
                      type="text" 
                      disabled
                      value={flowCandidate.aadhaar}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold"
                    />

                    {!aadhaarOtpSent ? (
                      <button
                        onClick={() => {
                          soundEngine.playScan();
                          setAadhaarOtpSent(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Send UIDAI OTP to Mobile 📲
                      </button>
                    ) : !aadhaarVerified ? (
                      <div className="space-y-2 animate-fadeIn">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter 6-Digit OTP"
                            value={aadhaarOtpInput}
                            onChange={(e) => setAadhaarOtpInput(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-center font-bold"
                          />
                          <button
                            onClick={() => {
                              soundEngine.playSuccess();
                              setAadhaarVerified(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Verify
                          </button>
                        </div>
                        <button 
                          onClick={() => {
                            setAadhaarOtpInput('489120');
                            soundEngine.playSuccess();
                            setAadhaarVerified(true);
                          }}
                          className="text-[11px] text-purple-600 font-semibold underline block text-center cursor-pointer"
                        >
                          Auto-fill OTP (489120)
                        </button>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aadhaar Verified (Name: {flowCandidate.name}) ✓</span>
                      </div>
                    )}
                  </div>

                  {/* PAN Card */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">2. Income Tax PAN 2.0</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">NSDL Instant</span>
                    </div>
                    <input 
                      type="text" 
                      disabled
                      value={flowCandidate.pan}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold"
                    />
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PAN Active • Name Matched 100% ✓</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setFlowStep(2)} className="text-xs text-slate-500 font-semibold cursor-pointer">
                    ← Back to Step 2
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setFlowStep(4);
                    }}
                    className="px-6 py-3 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Proceed to 3D Live Face Biometric →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: 3D FACE BIOMETRICS */}
            {flowStep === 4 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                      STEP 4: AI BIOMETRIC LIVENESS
                    </span>
                    <h4 className="text-lg font-bold text-[#182230] font-outfit mt-1">3D Live Face Selfie & Anti-Spoofing Scan</h4>
                  </div>
                  <Camera className="w-6 h-6 text-pink-600" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                  {/* Camera Simulation Viewport */}
                  <div className="relative w-52 h-64 rounded-3xl bg-slate-900 border-4 border-pink-500/40 p-4 flex flex-col items-center justify-center text-white overflow-hidden shadow-xl">
                    <div className="w-36 h-48 rounded-[40px] border-2 border-dashed border-pink-400 flex flex-col items-center justify-center relative">
                      <Camera className="w-12 h-12 text-pink-400 animate-pulse" />
                      {faceScanProgress > 0 && faceScanProgress < 100 && (
                        <div 
                          className="absolute left-0 right-0 h-1 bg-pink-400 shadow-[0_0_10px_#ec4899] transition-all duration-75"
                          style={{ top: `${faceScanProgress}%` }}
                        />
                      )}
                    </div>

                    <div className="absolute bottom-2 text-[10px] font-mono text-center">
                      {faceScanComplete ? (
                        <span className="text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded">
                          MATCH: 99.98% ✓
                        </span>
                      ) : (
                        <span className="text-pink-300">Align Face in Oval</span>
                      )}
                    </div>
                  </div>

                  {/* Scan Controls */}
                  <div className="space-y-4 max-w-xs text-xs">
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Anti-Spoofing Camera Verification</h5>
                      <p className="text-slate-500 mt-1 leading-relaxed">
                        Validates micro-depth facial geometry against official UIDAI Aadhaar photo.
                      </p>
                    </div>

                    {!faceScanComplete ? (
                      <button
                        onClick={() => {
                          soundEngine.playScan();
                          let p = 0;
                          const timer = setInterval(() => {
                            p += 10;
                            setFaceScanProgress(p);
                            if (p >= 100) {
                              clearInterval(timer);
                              setFaceScanComplete(true);
                              soundEngine.playSuccess();
                            }
                          }, 100);
                        }}
                        className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        {faceScanProgress > 0 && faceScanProgress < 100 ? `Scanning Face (${faceScanProgress}%)...` : 'Capture 3D Live Selfie 🤳'}
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <div>
                          <div>Face Liveness Cleared ✓</div>
                          <div className="text-[10px] text-emerald-700 font-normal">Aadhaar Photo Match: 99.98% Confidence</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setFlowStep(3)} className="text-xs text-slate-500 font-semibold cursor-pointer">
                    ← Back to Step 3
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setFlowStep(5);
                    }}
                    className="px-6 py-3 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Run EPFO Moonlighting Radar →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: EPFO MOONLIGHTING RADAR */}
            {flowStep === 5 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      STEP 5: STATUTORY REPUTATION RADAR
                    </span>
                    <h4 className="text-lg font-bold text-[#182230] font-outfit mt-1">EPFO UAN Dual-Employment & Moonlighting Audit</h4>
                  </div>
                  <Search className="w-6 h-6 text-amber-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-amber-400 font-bold">EPFO UNIFIED PORTAL AUDIT</span>
                      <span className="text-[10px] text-emerald-400">RAIL ACTIVE</span>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Queried UAN Number:</div>
                      <div className="text-white font-bold">{flowCandidate.uan}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Previous Employer:</div>
                      <div className="text-slate-200">TCS Ltd (Relieved: Dec 2025 ✓)</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px]">Active Conflicting Tenures:</div>
                      <div className="text-emerald-400 font-bold">0 Active Overlaps (CLEAN)</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {!epfoScanComplete ? (
                      <button
                        onClick={() => {
                          soundEngine.playScan();
                          let p = 0;
                          const timer = setInterval(() => {
                            p += 15;
                            setEpfoScanProgress(p);
                            if (p >= 100) {
                              clearInterval(timer);
                              setEpfoScanComplete(true);
                              soundEngine.playSuccess();
                            }
                          }, 100);
                        }}
                        className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                      >
                        {epfoScanProgress > 0 && epfoScanProgress < 100 ? `Auditing EPFO History (${epfoScanProgress}%)...` : 'Execute Moonlighting Radar Scan 🛡️'}
                      </button>
                    ) : (
                      <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 text-xs space-y-2 border border-emerald-200 animate-fadeIn">
                        <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Audit Verdict: 100% Clean / Low Risk</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          Candidate has zero active undeclared secondary jobs. Eligible for immediate enterprise offer letter release.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setFlowStep(4)} className="text-xs text-slate-500 font-semibold cursor-pointer">
                    ← Back to Step 4
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playSuccess();
                      setFlowStep(6);
                      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
                    }}
                    className="px-6 py-3 rounded-full bg-[#426CF5] hover:bg-[#3459D8] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Finalize Dossier & Export Output →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: DOSSIER & MASTER EXCEL OUTPUT */}
            {flowStep === 6 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#182230] font-outfit">Verification 100% Completed!</h4>
                  <p className="text-xs text-slate-500">
                    Candidate <strong className="text-slate-800">{flowCandidate.name}</strong> is verified across all statutory registers with zero discrepancies.
                  </p>
                </div>

                {/* Instant Download Triggers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PDF Download Card */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-red-600 mb-1">
                        <FileText className="w-4 h-4" />
                        <span>360° CERTIFIED PDF DOSSIER</span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-800">Tamper-Proof Audit Certificate</h5>
                      <p className="text-xs text-slate-500 mt-1">
                        Includes SHA-256 cryptographic hash, check timestamps, Aadhaar redactions, and QR gate pass token.
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadSamplePdfDossier}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Sample 360° PDF Dossier</span>
                    </button>
                  </div>

                  {/* Excel Download Card */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>5-TAB EXCEL WORKBOOK (.XLSX)</span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-800">Comprehensive Demographic Spreadsheet</h5>
                      <p className="text-xs text-slate-500 mt-1">
                        50+ structured columns: Master Profile, Address, Experience, Statutory IDs, Custom Fields.
                      </p>
                    </div>

                    <button
                      onClick={handleDownloadSampleExcelSheet}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Sample 5-Tab Excel Sheet</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={() => setFlowStep(1)} className="text-xs text-[#426CF5] font-semibold underline cursor-pointer">
                    ← Restart Flow Simulation
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveMode('guides');
                    }}
                    className="px-6 py-3 rounded-full bg-[#182230] hover:bg-black text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Browse All Knowledge Base Guides →</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==============================================================================
         * MODAL BODY: MODE 3 — COMPREHENSIVE GUIDE LIBRARY & KNOWLEDGE BASE
         * ============================================================================== */}
        {activeMode === 'guides' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-[#FCFCFA]">
            
            {/* Search & Category Filter Bar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text" 
                  placeholder="Search guides: 'Aadhaar e-KYC', 'bulk excel', 'whatsapp magic link', 'moonlighting', 'turnstile', 'DPDP compliance'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#426CF5]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                {[
                  { id: 'all', label: 'All Guides' },
                  { id: 'hr_recruitment', label: '👔 HR & Recruitment' },
                  { id: 'candidate_flow', label: '📱 Candidate Self-Verification' },
                  { id: 'compliance', label: '🛡️ DPDP & Statutory Law' },
                  { id: 'exports', label: '📊 Excel & PDF Exports' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id 
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
              {filteredGuides.length === 0 ? (
                <div className="text-center py-12 space-y-2 bg-white rounded-2xl border border-slate-200">
                  <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No walkthrough guides matching "{searchQuery}"</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                    className="text-xs text-[#426CF5] underline font-bold"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                filteredGuides.map((guide) => {
                  const Icon = guide.icon;
                  const isExpanded = expandedTopicId === guide.id;

                  return (
                    <div 
                      key={guide.id}
                      className={`rounded-2xl border transition-all bg-white ${
                        isExpanded 
                          ? 'border-[#426CF5] shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Guide Header */}
                      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#426CF5] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${guide.badgeClass}`}>
                                {guide.badge}
                              </span>
                              <strong className="text-sm font-bold text-slate-900 font-outfit">
                                {guide.title}
                              </strong>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {guide.summary}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setExpandedTopicId(isExpanded ? null : guide.id);
                          }}
                          className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer shrink-0"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Expanded Steps */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3 animate-fadeIn text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Step-by-Step Procedure:</span>
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">{guide.steps.length} Steps</span>
                          </div>

                          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {guide.steps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                                <span className="w-5 h-5 rounded-full bg-[#426CF5] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="flex-1 font-medium">{step}</span>
                              </div>
                            ))}
                          </div>

                          {guide.keyTakeaways && (
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2 text-xs">
                              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold">Key Takeaway: </span>
                                <span>{guide.keyTakeaways}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ==============================================================================
         * MODAL BODY: MODE 4 — LIVE PERSONA TEST-DRIVE SANDBOX
         * ============================================================================== */}
        {activeMode === 'sandbox' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#FCFCFA]">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#426CF5] bg-[#EAF5FF] px-2.5 py-0.5 rounded-full">
                ROLE SIMULATION SANDBOX
              </span>
              <h4 className="text-xl font-bold text-[#182230] font-outfit">Experience the Platform by Persona</h4>
              <p className="text-xs text-slate-500">Select any role below to preview key features and workflows.</p>
            </div>

            {/* Persona Switcher Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'recruiter', role: 'HR Recruiter', icon: UserPlus, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                { id: 'candidate', role: 'Job Candidate', icon: Smartphone, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { id: 'company_admin', role: 'Company Admin', icon: Building2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                { id: 'guard', role: 'Security Guard', icon: HardHat, color: 'text-blue-600 bg-blue-50 border-blue-200' }
              ].map((p) => {
                const isSel = selectedPersona === p.id;
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedPersona(p.id);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      isSel 
                        ? 'bg-white border-[#426CF5] text-slate-900 shadow-md ring-2 ring-[#426CF5]/20' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${p.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold font-outfit">{p.role}</div>
                  </button>
                );
              })}
            </div>

            {/* Persona Details Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              {selectedPersona === 'recruiter' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <UserPlus className="w-6 h-6 text-indigo-600" />
                    <div>
                      <h5 className="font-bold text-base text-slate-900 font-outfit">HR Recruiter Experience</h5>
                      <p className="text-xs text-slate-500">Pipeline tracking, bulk Excel import, magic link dispatches & 360° dossiers.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">1. Instant Intake Form</div>
                      <div className="text-slate-500 mt-0.5">Cascading India state & district dropdowns + check selector.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">2. Real-Time Pipeline</div>
                      <div className="text-slate-500 mt-0.5">Filter pending, verified, and flagged candidate dossiers.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">3. 1-Click Excel / PDF Export</div>
                      <div className="text-slate-500 mt-0.5">Download 5-tab individual workbooks & 50+ column master sheets.</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPersona === 'candidate' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Smartphone className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h5 className="font-bold text-base text-slate-900 font-outfit">Candidate Mobile Self-Verification</h5>
                      <p className="text-xs text-slate-500">Zero application download, 4-digit PIN lock, sub-2-minute mobile flow.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">1. WhatsApp Link Ping</div>
                      <div className="text-slate-500 mt-0.5">Receive direct message with encrypted PIN (1234).</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">2. Aadhaar e-KYC & Selfie</div>
                      <div className="text-slate-500 mt-0.5">Official UIDAI OTP and 3D camera liveness scan.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">3. Verification Receipt</div>
                      <div className="text-slate-500 mt-0.5">Download submission confirmation with QR gate pass.</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPersona === 'company_admin' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Building2 className="w-6 h-6 text-purple-600" />
                    <div>
                      <h5 className="font-bold text-base text-slate-900 font-outfit">Company Admin Console</h5>
                      <p className="text-xs text-slate-500">Manage HR team accounts, verification check suites, wallet & GST invoices.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">1. Team Provisioning</div>
                      <div className="text-slate-500 mt-0.5">Add HR executives and control screening permissions.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">2. Check Suite Config</div>
                      <div className="text-slate-500 mt-0.5">Pick active verification checks per company policy.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">3. Postpaid & Razorpay</div>
                      <div className="text-slate-500 mt-0.5">Automatic GST tax invoices and live wallet ledger.</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPersona === 'guard' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <HardHat className="w-6 h-6 text-blue-600" />
                    <div>
                      <h5 className="font-bold text-base text-slate-900 font-outfit">Plant Security Guard / Turnstile Access</h5>
                      <p className="text-xs text-slate-500">Sub-second QR badge scanning and statutory Form XVI labor muster.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">1. Optical Scanner</div>
                      <div className="text-slate-500 mt-0.5">Scan worker mobile QR code in 0.34 seconds.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">2. Gate Unlock Signal</div>
                      <div className="text-slate-500 mt-0.5">Green barrier clearance for verified personnel.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-800">3. Form XVI Compliance</div>
                      <div className="text-slate-500 mt-0.5">Automated statutory muster logging for labor audits.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==============================================================================
         * MODAL FOOTER
         * ============================================================================== */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 rounded-b-3xl shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#426CF5]" />
            <span className="font-medium text-slate-700">Need personalized guidance? Our enterprise solutions engineers are on standby.</span>
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
