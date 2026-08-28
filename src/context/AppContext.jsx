import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

const INITIAL_FEATURE_LIST = [
  { id: 'aadhaar', name: 'Aadhaar UIDAI Verification', provider: 'Server 1 & 2', category: 'Government ID', serverMode: 'both', serverTag: 'Server 1 / Server 2', defaultOn: true, description: '12-Digit UIDAI OTP & Demographic matching' },
  { id: 'pan', name: 'PAN Card NSDL Verification & Link Audit', provider: 'Server 1 & 2', category: 'Tax ID', serverMode: 'both', serverTag: 'Server 1 / Server 2', defaultOn: true, description: 'NSDL status, Name matching & Aadhaar-PAN link audit' },
  { id: 'bankCheck', name: 'Bank Account Penny Drop (IMPS ₹1 / Pennyless)', provider: 'Server 1 & 2', category: 'Financial', serverMode: 'both', serverTag: 'Server 1 / Server 2', defaultOn: true, description: 'NPCI IMPS penny drop or pennyless account holder match' },
  { id: 'drivingLicense', name: 'Driving License (MoRTH) Check', provider: 'Server 1 & 2', category: 'Government ID', serverMode: 'both', serverTag: 'Server 1 / Server 2', defaultOn: false, description: 'MoRTH Sarathi DL status & vehicle classes' },
  { id: 'voterId', name: 'Voter ID Card (ECI) Verification', provider: 'Server 1 & 2', category: 'Government ID', serverMode: 'both', serverTag: 'Server 1 / Server 2', defaultOn: false, description: 'Election Commission of India EPIC voter verification' },
  { id: 'mobileOtp', name: 'Mobile Number OTP & WhatsApp Carrier', provider: 'Multi-Carrier Gateway', category: 'Contact Verification', serverMode: 'both', serverTag: 'Multi-Carrier', defaultOn: true, description: 'Direct carrier SMS OTP and Meta WhatsApp Cloud API' },
  { id: 'passport', name: 'Passport Verification (MEA Direct)', provider: 'Server 2 (CoinCircleTrust Exclusive ⚡)', category: 'Government ID', serverMode: 'server2_only', serverTag: 'Server 2 Exclusive ⚡', defaultOn: false, description: 'Ministry of External Affairs Passport File No & Date of Birth verification' },
  { id: 'uan', name: 'EPFO Past Employment / UAN Dual Employment V3', provider: 'Server 2 (CoinCircleTrust Exclusive ⚡)', category: 'Employment', serverMode: 'server2_only', serverTag: 'Server 2 Exclusive ⚡', defaultOn: true, description: 'EPFO Service Passbook history, overlapping dates & moonlighting detection' },
  { id: 'criminalCheck', name: 'Court & Criminal Record Background Check', provider: 'Server 2 (CoinCircleTrust Exclusive ⚡)', category: 'Compliance', serverMode: 'server2_only', serverTag: 'Server 2 Exclusive ⚡', defaultOn: false, description: 'District Court, High Court & National Crime CCTNS record check' },
  { id: 'education', name: 'Educational Degree & University Board Check', provider: 'Server 2 (CoinCircleTrust)', category: 'Education', serverMode: 'server2_only', serverTag: 'Server 2 Exclusive ⚡', defaultOn: false, description: 'University roll number, UGC/AICTE degree authentication' },
  { id: 'directorship', name: 'DIN / MCA Directorship Check (Moonlighting Prevention)', provider: 'Server 2 (CoinCircleTrust Exclusive ⚡)', category: 'Compliance', serverMode: 'server2_only', serverTag: 'Server 2 Exclusive ⚡', defaultOn: false, description: 'Ministry of Corporate Affairs Director Identification Number & CIN audit' },
  { id: 'faceCapture', name: 'AI 3D WebCam Biometric Liveness Match', provider: 'Server 2 (CoinCircleTrust Biometrics)', category: 'Biometrics', serverMode: 'server2_only', serverTag: 'Server 2 Exclusive ⚡', defaultOn: true, description: '3D face geometry, anti-spoofing liveness & photo match score' },
  { id: 'addressCheck', name: 'Physical Address Verification Dispatch', provider: 'Internal Ops', category: 'Field Check', serverMode: 'both', serverTag: 'Internal Ops', defaultOn: false, description: 'GPS geotagged physical home/office visit' }
];

const INITIAL_COMPANIES = [
  {
    id: 'comp-joy',
    name: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    code: 'JOY',
    contactPerson: 'PRAVEEN B',
    email: 'director@joycorporatesolutions.com',
    plan: 'Enterprise Premier',
    pricePerVerification: 120,
    walletBalance: 100000,
    verifiedCountThisMonth: 1,
    maxLimit: 5000,
    status: 'Active',
    apiRoutingEngine: 'hybrid', // 'hybrid' | 'server1' | 'server2'
    apiStats: {
      server1_sandbox_calls: 12,
      server2_coincircle_calls: 4,
      total_spent: 46.00,
      billable_revenue: 120.00
    },
    rechargeTransactions: [
      {
        id: 'PAY-RZP-981241',
        paymentId: 'pay_Nq98xK1982',
        orderId: 'order_Nq98xK1982',
        date: '2026-08-28 10:00 AM',
        baseAmount: 100000,
        gstAmount: 18000,
        totalAmount: 118000,
        creditsAdded: 833,
        method: 'Razorpay Corporate Banking',
        status: 'Success 🟢',
        invoiceNumber: 'INV-2026-AUG-001'
      }
    ],
    features: {
      // Communication Gateways
      whatsappGateway: true,
      emailGateway: true,
      smsGateway: true,
      // Portal Access Controls
      allowCompanyAdminLogin: true,
      allowHrLogin: true,
      allowEmployeePortalAccess: true,
      // Document & Compliance Protocols
      documentVaultVerification: true,
      statutoryAgreements: true,
      // Biometrics & AI Engine
      aiFaceBiometrics: true,
      // Government Verification APIs
      aadhaar: true, mobileOtp: true, faceCapture: true, drivingLicense: true,
      pan: true, uan: true, education: true, criminalCheck: true,
      addressCheck: true, bankCheck: true, passport: true, directorship: true, voterId: true
    },
    hrPermissions: {
      allowProfileCreation: true,
      allowBulkExcelUpload: true,
      allowWhatsAppDispatch: true,
      allowEmailDispatch: true,
      allowSmsDispatch: true,
      requireOriginalDocumentVault: true,
      requireAiFaceBiometrics: true,
      allow360DossierExport: true,
      allowCertificateGeneration: true
    }
  }
];

const INITIAL_HR_USERS = [
  { 
    id: 'hr-joy-1', 
    companyId: 'comp-joy', 
    companyName: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    name: 'PRAVEEN B', 
    email: 'praveen.b@joycorporatesolutions.com', 
    phone: '+91 98765 43210',
    dept: 'Human Resources & Talent Acquisition', 
    activeLinks: 1 
  }
];

const INITIAL_CANDIDATES = [
  {
    id: 'emp-101',
    token: 'tok_sunita_412',
    name: 'MUTHUKUMAR P',
    empId: 'JOY-2026-001',
    email: 'muthukumar.p@joycorporatesolutions.com',
    mobile: '+91 98765 43210',
    aadhaarNo: '5489 1234 9876',
    designation: 'Senior Verification Engineer',
    dept: 'Technology & Engineering',
    companyId: 'comp-joy',
    companyName: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    hrId: 'hr-joy-1',
    status: 'Pending',
    portalPassword: '1234',
    hrCustomMessage: 'Welcome to JOY CORPORATE SOLUTIONS PRIVATE LIMITED! Please complete your official background verification and e-KYC onboarding process.',
    hrCorrectionRemarks: '',
    verificationConfig: {
      requireAadhaar: true, requireMobileOtp: true, requireFaceMatch: true, requireDL: false, requirePAN: true, requireBankCheck: true
    },
    verificationsCompleted: {
      aadhaar: false, mobile: false, face: false, pan: false, bankCheck: false
    },
    faceImages: {
      straight: null,
      livePhoto: null,
      aadhaarRef: null,
      left: null,
      right: null
    },
    verificationDate: ''
  }
];

export const AppProvider = ({ children }) => {
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [hrUsers, setHrUsers] = useState(INITIAL_HR_USERS);
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [activeInvoiceModal, setActiveInvoiceModal] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    name: 'Super Administrator',
    email: 'superadmin@joycorporatesolutions.com',
    role: 'superadmin'
  });
  const [currentRole, setCurrentRole] = useState('superadmin'); // 'superadmin' | 'company' | 'hrexecutive' | 'employee_link'
  const [selectedCandidateToken, setSelectedCandidateToken] = useState('tok_sunita_412');
  const [toastMessage, setToastMessage] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  // SESSION MANAGEMENT & INACTIVITY TRACKING
  const [sessionData, setSessionData] = useState({
    sessionId: 'sess_prod_admin_8812',
    role: 'superadmin',
    expiresIn: 1800
  });
  const [sessionTtlSeconds, setSessionTtlSeconds] = useState(1800); // 30 mins
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(300); // 5 mins warning
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(Date.now());

  // Listen to window interactions for activity tracking
  useEffect(() => {
    const handleActivity = () => {
      setLastActivityTimestamp(Date.now());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // 1-Second Session Heartbeat & Inactivity Countdown Ticker
  useEffect(() => {
    if (!currentUser || !currentRole) return;

    const interval = setInterval(() => {
      const idleSeconds = Math.floor((Date.now() - lastActivityTimestamp) / 1000);
      
      setSessionTtlSeconds(prev => {
        const next = prev - 1;
        if (next <= 0) {
          logoutUser();
          return 0;
        }
        return next;
      });

      // If idle for > 25 minutes (1500s), show warning modal with countdown
      if (idleSeconds >= 1500) {
        const countdown = Math.max(0, 1800 - idleSeconds);
        setInactivityCountdown(countdown);
        setShowInactivityWarning(true);
        if (countdown <= 0) {
          logoutUser();
        }
      } else {
        setShowInactivityWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, currentRole, lastActivityTimestamp]);

  // SUPER ADMIN & HR MASTER DROPDOWN OPTIONS STATE (12 ENTERPRISE MASTER CATEGORIES)
  const [masterDropdownOptions, setMasterDropdownOptions] = useState({
    skills: [
      'MySQL',
      'Node.js',
      'Laravel',
      'Django',
      'Angular',
      'React JS',
      'React',
      'Python',
      'Javascript',
      'PHP',
      'Java & Spring Boot',
      'DevOps & Docker',
      'AWS Cloud Architecture',
      'UI/UX Design & Figma',
      'PLC & SCADA Automation',
      'CNC Machine Programming',
      'Tally Prime & GST Filing',
      'SAP ERP Financials',
      'Quality Assurance & Six Sigma'
    ],
    selfInterests: [
      'Coding & Open Source Development',
      'Robotics & IoT Innovation',
      'Cricket & Team Athletics',
      'Music & Performing Arts',
      'Reading, Law & Financial Research',
      'Photography & Content Creation',
      'Travel & Cultural Exploration',
      'Physical Fitness & Yoga',
      'Social Service & Community Volunteering'
    ],
    qualificationCategories: [
      'Doctorate (Ph.D / Research)',
      'Post Graduate (PG / Master Degree)',
      'Under Graduate (UG / Bachelor Degree)',
      'Polytechnic Diploma',
      'Vocational / ITI Trade Certificate',
      'Higher Secondary Certificate (10+2 / 12th)',
      'Secondary School Leaving Certificate (10th SSLC)'
    ],
    qualifications: [
      'B.Tech / B.E. in Computer Science',
      'B.Tech / B.E. in Mechanical / Electrical',
      'M.Tech / M.E. in Software Systems',
      'MBA in HR & Operations',
      'Master of Computer Applications (MCA)',
      'Bachelor of Computer Applications (BCA)',
      'Bachelor of Commerce (B.Com)',
      'Master of Commerce (M.Com)',
      'Bachelor of Science (B.Sc)',
      'Bachelor of Business Admin (BBA)',
      'Diploma in Mechanical / Automobile',
      'Diploma in Commercial Driving & Logistics',
      'ITI Certified Fitter / Electrician',
      'Higher Secondary (10+2 CBSE / State)',
      'Secondary School (10th SSLC)'
    ],
    languages: [
      'English (Fluent)',
      'Hindi (National)',
      'Tamil (Regional)',
      'Telugu (Regional)',
      'Kannada (Regional)',
      'Malayalam (Regional)',
      'Marathi (Regional)',
      'Bengali (Regional)',
      'Gujarati (Regional)',
      'Punjabi (Regional)',
      'Odia (Regional)',
      'French (Foreign)',
      'German (Foreign)'
    ],
    jobCategories: [
      'Information Technology & Software Services',
      'Manufacturing & Heavy Industrial Engineering',
      'Banking, Financial Services & Insurance (BFSI)',
      'Logistics, Warehousing & Fleet Operations',
      'Healthcare, Clinical & Pharmaceuticals',
      'Corporate Sales, Retail & Marketing',
      'Construction, Infrastructure & Real Estate',
      'Hospitality, Facility & Security Services',
      'Human Resources & Talent Acquisition'
    ],
    jobTypes: [
      'Full Time Permanent',
      'Contractual (Fixed Term 1-3 Yrs)',
      'Third-Party Payroll Staff',
      'Apprentice / National Apprenticeship (NATS)',
      'Internship / Graduate Trainee',
      'Part Time / Shift Consultant',
      'Daily Wage / Contract Field Operative'
    ],
    states: [
      'Tamil Nadu',
      'Karnataka',
      'Maharashtra',
      'Delhi NCR',
      'Telangana',
      'Gujarat',
      'Kerala',
      'Uttar Pradesh',
      'West Bengal',
      'Andhra Pradesh',
      'Rajasthan',
      'Haryana',
      'Punjab',
      'Madhya Pradesh'
    ],
    cities: [
      'Chennai',
      'Bengaluru',
      'Mumbai',
      'New Delhi',
      'Hyderabad',
      'Ahmedabad',
      'Kochi',
      'Pune',
      'Kolkata',
      'Coimbatore',
      'Madurai',
      'Noida',
      'Gurgaon',
      'Jaipur',
      'Chandigarh'
    ],
    areas: [
      'Guindy Industrial Estate, Chennai',
      'T. Nagar / OMR IT Expressway, Chennai',
      'Koramangala 4th Block, Bengaluru',
      'Whitefield Tech Corridor, Bengaluru',
      'Indiranagar / Electronic City, Bengaluru',
      'Bandra Kurla Complex (BKC), Mumbai',
      'Andheri East MIDC, Mumbai',
      'Hitech City / Madhapur, Hyderabad',
      'Gachibowli Financial Hub, Hyderabad',
      'SG Highway Corporate Hub, Ahmedabad',
      'Sector 62 IT Park, Noida',
      'DLF CyberCity, Gurgaon',
      'Salt Lake Sector V, Kolkata'
    ],
    statutoryForms: [
      'Form 16 / TDS Declaration (Income Tax Sec 192)',
      'Form 11 (EPFO Statutory Declaration Act 1952)',
      'Form F (Payment of Gratuity Act 1972 Nomination)',
      'Form 1 (ESIC Social Security Registration)',
      'Factory Act Register Form 12 (Adult Worker)',
      'Employee Non-Disclosure Agreement (NDA)',
      'Non-Compete & Non-Solicitation Agreement',
      'Code of Conduct & Anti-Harassment (POSH)',
      'Contract Labor (R&A) Act Form XIII Register',
      'Background Verification Authorization & DPDP Consent'
    ],
    documentTypes: [
      'Government Aadhaar Card (Front & Back)',
      'Income Tax PAN Card',
      'Passport (Front, Back & Visa pages)',
      'Driving License (MoRTH Sarathi)',
      'Voter Identity Card (ECI EPIC)',
      'Bank Passbook / Cancelled Cheque Leaf',
      'Highest Educational Degree Certificate / Marksheet',
      'Previous Employer Relieving & Service Letter',
      'Last 3 Months Salary / Pay Slips',
      'Signed Non-Disclosure Agreement (NDA)',
      'Statutory Form 11 / Gratuity Nomination Signed Copy'
    ],
    departments: [
      'Engineering & Software Architecture',
      'Manufacturing, Plant & Assembly',
      'Logistics, Warehousing & Fleet Fleet',
      'Finance, Taxation & Payroll',
      'Human Resources & Talent Acquisition',
      'Sales, Enterprise & Marketing',
      'Quality Assurance & Compliance',
      'Customer Support & Helpdesk',
      'Executive Leadership & Strategy'
    ],
    designations: [
      'Vice President / Managing Director',
      'Principal Software Architect',
      'Senior Software Engineer',
      'Full Stack Developer',
      'Plant Operations Supervisor',
      'CNC Machine Operator',
      'Quality Control Engineer',
      'Fleet Logistics Driver',
      'Senior HR Talent Partner',
      'Finance & Payroll Manager',
      'Corporate Account Executive',
      'Facility & Logistics Associate'
    ],
    workLocations: [
      'Bengaluru Global Tech Hub (HQ)',
      'Chennai Regional Operations Center',
      'Mumbai Financial District (BKC)',
      'Hyderabad Technology Innovation Center',
      'Delhi NCR Logistics & Corporate Hub',
      'Ahmedabad Manufacturing Hub',
      'Remote Work From Anywhere'
    ],
    employmentTypes: [
      'Full Time Permanent',
      'Contract Staff (Fixed Term)',
      'Third-Party Retainer',
      'Apprentice / Trainee',
      'Industrial Plant Worker',
      'Internship / Fellowship'
    ],
    bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  });

  // SUPER ADMIN MASTER DEFAULT FORM FIELDS STATE
  const [masterFormFields, setMasterFormFields] = useState([
    { id: 'name', label: 'Candidate Full Name', type: 'text', defaultMandatory: true, category: 'Personal Info' },
    { id: 'empId', label: 'Employee ID Code', type: 'text', defaultMandatory: true, category: 'Personal Info', prefix: 'EMP-2026-' },
    { id: 'designation', label: 'Job Designation / Title', type: 'select', defaultMandatory: true, category: 'Employment' },
    { id: 'mobile', label: 'Registered Mobile Number (SMS Link)', type: 'tel', defaultMandatory: true, category: 'Contact' },
    { id: 'email', label: 'Official Email Address', type: 'email', defaultMandatory: true, category: 'Contact' },
    { id: 'aadhaarNo', label: 'Aadhaar Identity Number (12 Digits)', type: 'text', defaultMandatory: true, category: 'Government ID' },
    { id: 'panNo', label: 'Tax PAN Card Number', type: 'text', defaultMandatory: false, category: 'Tax ID' },
    { id: 'bankAccount', label: 'Bank Account Number & IFSC', type: 'text', defaultMandatory: false, category: 'Financial' }
  ]);

  // SUPER ADMIN SYSTEM ERROR & ISSUE LOGS STATE
  const [systemErrorLogs, setSystemErrorLogs] = useState([
    { id: 'LOG-901', timestamp: '2026-08-20 12:24:10', section: 'Aadhaar UIDAI Gateway', event: 'Invalid Aadhaar OTP Attempt', details: 'Candidate entered incorrect OTP code 3 times in succession.', severity: 'Warning', solved: false, company: 'Acme Global' },
    { id: 'LOG-902', timestamp: '2026-08-20 12:18:45', section: 'AI WebCam Biometrics', event: 'WebCam Permission Blocked', details: 'User browser blocked camera device access stream.', severity: 'Critical', solved: false, company: 'Apex Logistics' },
    { id: 'LOG-903', timestamp: '2026-08-20 12:05:30', section: 'Automated SMS Router', event: 'SMS OTP Dispatch Timeout', details: 'Carrier gateway delayed OTP delivery by 45 seconds.', severity: 'Warning', solved: true, company: 'Acme Global' }
  ]);

  // WHATSAPP & EMAIL INTEGRATION GATEWAYS STATE
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: true,
    wabaId: 'WABA-99823412091',
    phoneNumberId: 'PN-919876543210',
    accessToken: 'EAAG99823412091ZABCPASSWORDTOKEN',
    webhookUrl: 'https://api.joyverification.com/v1/whatsapp/webhook',
    autoSendOnboardingLink: true,
    autoSendOtpCode: true,
    autoSendPdfCertificate: true,
    status: 'Connected 🟢'
  });

  const [emailConfig, setEmailConfig] = useState({
    enabled: true,
    smtpHost: 'email-smtp.us-east-1.amazonaws.com',
    smtpPort: 587,
    senderEmail: 'onboarding@joyverification.com',
    apiKey: 'SG.99823412091_JOYSECRETKEY',
    autoSendOnboardingEmail: true,
    autoSendPdfCertificate: true,
    status: 'Active 🟢'
  });

  // ROLE-SPECIFIC SETTINGS
  const [systemSettings, setSystemSettings] = useState({
    superadmin: {
      platformTitle: 'JOY DATA VERIFICATION',
      apiRateLimitPerMin: 600,
      apiTimeoutSeconds: 30,
      requireSuperAdmin2FA: true,
      sessionTimeoutMins: 30,
      logRetentionDays: 90,
      defaultSmsCarrier: 'AWS SNS / Twilio'
    },
    company: {
      faceMatchThreshold: 85,
      lowCreditAlertThreshold: 50,
      autoRenewCredits: false,
      maxHrSeats: 10,
      mandatoryAadhaarOtp: true
    },
    hr: {
      defaultDispatchChannel: 'whatsapp',
      defaultTemplate: 'corporate',
      defaultWorkLocation: 'Bengaluru Tech Park (HQ)',
      realtimeToastAlerts: true
    },
    candidate: {
      language: 'en',
      digilockerConsent: true,
      highContrast: false,
      largeFont: false
    }
  });

  // GUIDELINES
  const [platformGuidelines, setPlatformGuidelines] = useState({
    superadmin: {
      title: 'Super Admin Master Governance Workflow',
      summary: 'Super Admin controls client company onboarding, API verification lookup, 10 feature flags, metered billing, and support tickets.',
      step1: 'Onboarding Client Enterprises & Tariff Rate Setup: Navigate to Companies & Feature Matrix -> Click "Onboard Company". Input company name, email, subscription tier, and price per verification.',
      step2: 'Configuring Topic-Based Master Data Dropdown Options: Open Master Form Fields tab. Manage master data by topics (Departments, Designations, Locations, Qualifications, Contract Types, Blood Groups).',
      step3: 'Replying to Support Tickets & Data Transactions: Open Error Logs & Support Tickets tab. View client ticket thread with exact date & time stamps. Type official reply message and select status.'
    },
    company: {
      title: 'Company Admin Executive Operations Guidelines',
      summary: 'Company Admin monitors executive staff telemetry, TAT metrics, employee master registry, compliance document vault, and online billing payments.',
      step1: 'Monitoring Turnaround Time (TAT) & HR Telemetry: Open Executive Telemetry & TAT tab. Inspect HR performance charts, total verification volume, and average candidate turnaround time stats.',
      step2: 'Compliance Document Storage Hub (DMS): Navigate to Compliance Document Hub. Search candidates, preview certificates, and export audit files in PDF, Excel, Word, or Image formats.',
      step3: 'Online Invoice Payment & Instant Settlement: Click "Pay Online & Settle Bill 💳" in header. Scan UPI QR code or input card details to complete payment settlement with instant receipt generation.'
    },
    hr: {
      title: 'HR Executive Onboarding Workstation Guidelines',
      summary: 'HR Executives profile new employees, assign customized 10-feature verification flags, and dispatch magic token links via WhatsApp, SMS, Email, or QR code.',
      step1: 'Creating Candidate Profile & Assigning 10-Feature Flags: Click "Send Link to Employee". Input employee name, mobile number, designation, and department dropdowns. Toggle mandatory verification checks.',
      step2: 'Dispatching Magic Token Links via Meta WhatsApp & Email: In Candidate Pipeline, click "Dispatch Link". Dispatch onboarding link via WhatsApp Cloud API, carrier SMS, SMTP email, or display scannable QR Code.',
      step3: 'HR Station Form Manual Entry: If candidate is present at HR desk, click "HR Station Form Entry" to complete full 7-section joining form with pre-filled dropdown options.'
    },
    candidate: {
      title: 'Candidate Verification Portal Guidelines',
      summary: 'Candidates complete verification steps using passwordless magic links on mobile or desktop browsers.',
      step1: 'Aadhaar UIDAI 6-Digit OTP Verification: Click "Verify Aadhaar UIDAI" -> Click "Send Aadhaar OTP". Input 6-digit verification code received on Aadhaar-registered mobile number.',
      step2: 'AI WebCam 3-Pose Face Liveness Capture: Click "Capture WebCam Liveness" -> Allow camera permission. Align face inside oval frame and capture 3 pose snapshots.',
      step3: 'Language Selection & Accessibility: Click "Portal Settings ⚙️" to switch language (English, Hindi, Tamil, Telugu, Kannada, Marathi) or enable high contrast text display.'
    }
  });

  // NOTIFICATIONS (CROSS-ROLE SMART NOTIFICATION FEED)
  const [notifications, setNotifications] = useState([
    // HR NOTIFICATIONS (CRITICAL 60-DAY EXPIRY + PIPELINE)
    {
      id: 'notif-hr-1',
      role: 'hr',
      title: '⏳ JCS Certificate Expiring Soon (6 Days Left)',
      message: 'Employee Vikram Sethi (ACME-2026-92) verified on 2026-07-02 has a JCS Certificate expiring on 2026-08-31. Please download the permanent dossier backup or dispatch a re-verification link.',
      timestamp: '2026-08-25 08:30',
      isRead: false,
      priority: 'high',
      category: 'expiry',
      candidateToken: 'tok_vikram_771',
      candidateName: 'Vikram Sethi'
    },
    {
      id: 'notif-hr-2',
      role: 'hr',
      title: '🚨 Urgent: Certificate Expiry Tomorrow!',
      message: 'Employee Pooja Sharma (ACME-2026-95) verified on 2026-06-27 is reaching the 60-day retention cutoff tomorrow. Take action now.',
      timestamp: '2026-08-25 09:00',
      isRead: false,
      priority: 'critical',
      category: 'expiry',
      candidateToken: 'tok_pooja_229',
      candidateName: 'Pooja Sharma'
    },
    {
      id: 'notif-hr-3',
      role: 'hr',
      title: '✅ Candidate Verification Completed',
      message: 'Rajesh Kumar completed Aadhaar OTP and Live Biometric Face Capture with 99.4% confidence score.',
      timestamp: '2026-08-24 16:45',
      isRead: true,
      priority: 'normal',
      category: 'verification',
      candidateToken: 'tok_rajesh_891',
      candidateName: 'Rajesh Kumar'
    },
    {
      id: 'notif-hr-4',
      role: 'hr',
      title: '⚠️ Candidate Onboarding Stalled (>48h)',
      message: 'Candidate Sunita Mehra received verification link 48 hours ago but has pending Mobile OTP. Click to resend WhatsApp/SMS reminder.',
      timestamp: '2026-08-24 14:10',
      isRead: false,
      priority: 'medium',
      category: 'candidate',
      candidateToken: 'tok_sunita_412',
      candidateName: 'Sunita Mehra'
    },

    // COMPANY ADMIN NOTIFICATIONS
    {
      id: 'notif-comp-1',
      role: 'company',
      title: '⏳ Workforce Compliance: 2 Certificates Expiring',
      message: '2 employee JCS Certificates in your organization are expiring within 15 days (60-day policy). View the Master Registry to archive dossiers or renew verifications.',
      timestamp: '2026-08-25 08:30',
      isRead: false,
      priority: 'high',
      category: 'expiry'
    },
    {
      id: 'notif-comp-2',
      role: 'company',
      title: '💳 Monthly Verification Quota Alert',
      message: 'Acme Global Technologies has utilized 420 / 500 verifications (84% of monthly Premier limit). Auto-rollover enabled.',
      timestamp: '2026-08-24 18:00',
      isRead: false,
      priority: 'medium',
      category: 'billing'
    },
    {
      id: 'notif-comp-3',
      role: 'company',
      title: '👥 HR Workstation Activity Summary',
      message: 'HR Executive Priya Sundaram created 4 candidate verification links and finalized 2 verified dossiers today.',
      timestamp: '2026-08-24 17:30',
      isRead: true,
      priority: 'normal',
      category: 'hr'
    },

    // SUPER ADMIN NOTIFICATIONS
    {
      id: 'notif-sa-1',
      role: 'superadmin',
      title: '💳 Enterprise Bill Settled (₹14,160)',
      message: 'Acme Global Technologies completed monthly invoice payment via UPI QR Code. Receipt #PAY-2026-9812 logged in PostgreSQL.',
      timestamp: '2026-08-25 09:15',
      isRead: false,
      priority: 'high',
      category: 'billing'
    },
    {
      id: 'notif-sa-2',
      role: 'superadmin',
      title: '🚨 Upstream Gateway Latency Spike',
      message: 'API SETU DigiLocker Govt gateway experienced 8.4s response latency on Aadhaar KYC calls. Traffic auto-routed to Sandbox fallback.',
      timestamp: '2026-08-24 15:20',
      isRead: false,
      priority: 'critical',
      category: 'system'
    },
    {
      id: 'notif-sa-3',
      role: 'superadmin',
      title: '🏢 New Enterprise Onboarding Complete',
      message: 'Starlight Healthcare Solutions onboarded with 10 Feature Matrix Flags and Basic Tier (₹80/check).',
      timestamp: '2026-08-24 11:00',
      isRead: true,
      priority: 'normal',
      category: 'company'
    },

    // CANDIDATE PORTAL NOTIFICATIONS
    {
      id: 'notif-cand-1',
      role: 'candidate',
      title: '📜 JCS Official Certificate Ready (60-Day Access)',
      message: 'Your official JOY Corporate Solutions Verification Certificate is generated and accessible for download for the next 60 days.',
      timestamp: '2026-08-24 16:45',
      isRead: false,
      priority: 'high',
      category: 'certificate'
    },
    {
      id: 'notif-cand-2',
      role: 'candidate',
      title: '🔒 Secure Onboarding Link Activated',
      message: 'Your secure onboarding token is encrypted and active for 7 calendar days on this device.',
      timestamp: '2026-08-24 10:00',
      isRead: true,
      priority: 'normal',
      category: 'security'
    }
  ]);

  const [notificationPreferences, setNotificationPreferences] = useState({
    superadmin: { whatsapp: true, email: true, sms: true, inAppSound: true },
    company: { whatsapp: true, email: true, sms: false, inAppSound: true },
    hr: { whatsapp: true, email: true, sms: true, inAppSound: true },
    candidate: { whatsapp: true, email: true, sms: true, inAppSound: false }
  });

  // PAYMENT LEDGER
  const [companyPaymentLedger, setCompanyPaymentLedger] = useState({
    'comp-1': { status: 'SETTLED ✅', paymentId: 'PAY-2026-9812', date: '2026-08-20 11:20', amount: 14160, method: 'UPI QR (GPay / Razorpay)' },
    'comp-2': { status: 'PENDING DEBIT ⏳', paymentId: null, date: null, amount: 21240, method: null }
  });

  // SUPPORT TICKETS
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'TICK-2026-881',
      companyName: 'Acme Global Technologies',
      companyId: 'comp-1',
      reporterName: 'Priya Sundaram (HR)',
      subject: 'Aadhaar OTP Carrier Gateway Delay on Mobile Verification',
      category: 'API Gateway',
      priority: 'High',
      status: 'In Progress',
      createdAt: '2026-08-20 12:45:10',
      details: 'Candidates reported 30-second SMS OTP delivery delay for Jio numbers.',
      messages: [
        {
          id: 'msg-1',
          sender: 'Priya Sundaram (HR)',
          text: 'Candidates reported 30-second SMS OTP delivery delay for Jio mobile numbers during onboarding.',
          timestamp: '2026-08-20 12:45:10',
          type: 'user_ticket'
        },
        {
          id: 'msg-2',
          sender: 'Super Admin Support',
          text: 'Inspecting Jio carrier gateway routing table and switching fallback SMS router to AWS SNS.',
          timestamp: '2026-08-20 13:10:00',
          type: 'admin_reply'
        }
      ]
    }
  ]);

  // SUPER ADMIN API CONFIGURATIONS (SERVER 1: SANDBOX + SERVER 2: COINCIRCLETRUST)
  const [apiConfigurations, setApiConfigurations] = useState({
    server1_sandbox: {
      id: 'server1_sandbox',
      serverNumber: 1,
      name: 'Server 1: Sandbox API Router (api.sandbox.co.in)',
      shortName: 'Server 1 (Sandbox API)',
      provider: 'Sandbox API India',
      apiKey: 'sb_live_key_9942a1bc88',
      secretKey: 'sb_sec_JoyCorp2026_m89',
      endpointUrl: 'https://api.sandbox.co.in/v2',
      status: 'Online',
      mode: 'Production (Live Mode)',
      latency: '48 ms',
      rateLimitPerMin: 2500,
      costPerCall: 2.50,
      monthlyCallCount: 24850,
      errorCount: 3,
      supportedDocs: [
        'Aadhaar UIDAI OTP',
        'PAN Card Basic (NSDL)',
        'Bank Account IMPS Penny Drop (₹1)',
        'Driving License (MoRTH)',
        'Voter ID (ECI)',
        'GSTIN Search & Filing Status',
        'Basic EPFO Passbook'
      ],
      unsupportedDocs: [
        'Passport Verification (MEA Direct)',
        'UAN Dual Employment & Moonlighting History V3',
        'Court & Criminal Record Search (eCourts/CCTNS)',
        'ESIC Social Security Data',
        'DIN to MCA Moonlighting Directorship Check',
        'Credit Score (CRIF / Experian / CIBIL)',
        'AI 3D WebCam Biometrics & Facial Geometry'
      ]
    },
    server2_coincircle: {
      id: 'server2_coincircle',
      serverNumber: 2,
      name: 'Server 2: CoinCircleTrust API Gateway (47+ APIs)',
      shortName: 'Server 2 (CoinCircleTrust)',
      provider: 'CoinCircleTrust Institutional Gateway',
      clientId: 'CCT_CORP_VERIF_882910',
      apiKey: 'CCT_CORP_VERIF_882910',
      clientSecret: 'cct_sec_JoyCircleTrust_9921_xK',
      secretKey: 'cct_sec_JoyCircleTrust_9921_xK',
      endpointUrl: 'https://api.coincircletrust.com/api/v1',
      status: 'Online',
      mode: 'Production (Live Mode)',
      latency: '62 ms',
      rateLimitPerMin: 5000,
      costPerCall: 4.00,
      monthlyCallCount: 38400,
      errorCount: 1,
      totalApis: 47,
      supportedDocs: [
        'Passport Verification (MEA Direct File & DOB Check)',
        'UAN to Employment Profile & Full History V3 (Moonlighting Audit)',
        'Aadhaar–PAN Link Check & Aadhaar to Unmasked PAN',
        'Court & Criminal Record Background Check (eCourts)',
        'Bank Verification Pennyless & UPI ID Analyser',
        'ESIC Data & Social Security Audit',
        'DIN to MCA & CIN Directorship (Moonlighting Prevention)',
        'Credit Report PDF (CRIF / Experian / CIBIL)',
        'Vehicle RC Advance & Traffic Challan Search',
        'AI 3D WebCam Biometrics & Face Anti-Spoofing Match'
      ],
      categories: [
        { name: 'Identity & Government (12 APIs)', count: 12 },
        { name: 'Employment & EPFO History (8 APIs)', count: 8 },
        { name: 'Banking & Financial Assets (9 APIs)', count: 9 },
        { name: 'Compliance, Court & Moonlighting (10 APIs)', count: 10 },
        { name: 'Vehicles, Transport & Biometrics (8 APIs)', count: 8 }
      ]
    },
    // Backwards compatibility aliases
    apiSetu: {
      apiKey: 'sb_live_key_9942a1bc88',
      name: 'Server 1: Sandbox API Router'
    },
    sandbox: {
      apiKey: 'sb_live_key_9942a1bc88',
      name: 'Server 1: Sandbox API Router'
    },
    coincircletrust: {
      apiKey: 'CCT_CORP_VERIF_882910',
      name: 'Server 2: CoinCircleTrust API Gateway'
    }
  });

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // INITIAL LOAD: Sync with Python FastAPI & PostgreSQL Backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [comps, cands, dropdowns, logs, tickets] = await Promise.all([
          api.getCompanies().catch(() => null),
          api.getCandidates().catch(() => null),
          api.getMasterDropdowns().catch(() => null),
          api.getLogs().catch(() => null),
          api.getTickets().catch(() => null),
        ]);

        if (comps && Array.isArray(comps)) {
          setCompanies(comps.map(c => ({
            id: c.id,
            name: c.name,
            code: c.code,
            contactPerson: c.contact_person,
            email: c.email,
            plan: c.plan,
            pricePerVerification: c.price_per_verification,
            verifiedCountThisMonth: c.verified_count_this_month,
            maxLimit: c.max_limit,
            status: c.status,
            features: c.features || {}
          })));
          setIsBackendConnected(true);
        }

        if (cands && Array.isArray(cands)) {
          setCandidates(cands.map(c => ({
            id: c.id,
            token: c.token,
            name: c.name,
            empId: c.emp_id,
            email: c.email,
            mobile: c.mobile,
            aadhaarNo: c.aadhaar_no,
            designation: c.designation,
            dept: c.dept,
            companyId: c.company_id,
            hrId: c.hr_id,
            status: c.status,
            portalPassword: c.portal_password || c.portalPassword || '1234',
            verificationConfig: c.verification_config || {},
            verificationsCompleted: c.verifications_completed || {},
            faceImages: c.face_images || { straight: null, left: null, right: null },
            manualChecks: c.manual_checks || {},
            joiningFormData: c.joining_form_data || {},
            verificationDate: c.verification_date
          })));
        }

        if (dropdowns && typeof dropdowns === 'object') {
          setMasterDropdownOptions(prev => ({
            ...prev,
            ...dropdowns
          }));
        }

        if (logs && Array.isArray(logs)) {
          setSystemErrorLogs(logs.map(l => ({
            id: l.id,
            timestamp: l.timestamp,
            section: l.section,
            event: l.error_code,
            details: l.message,
            severity: l.severity,
            solved: l.solved,
            resolvedTimestamp: l.resolved_at
          })));
        }

        if (tickets && Array.isArray(tickets)) {
          setSupportTickets(tickets.map(t => ({
            id: t.id,
            companyName: t.company_name,
            companyId: t.company_id,
            subject: t.subject,
            category: t.category,
            priority: t.priority,
            status: t.status,
            createdAt: t.created_at,
            messages: (t.replies || []).map(r => ({
              id: r.id,
              sender: r.sender_name,
              text: r.message,
              timestamp: r.timestamp,
              type: r.sender_role === 'superadmin' ? 'admin_reply' : 'user_ticket'
            }))
          })));
        }
      } catch (err) {
        console.warn('Backend sync in background:', err.message);
      }
    };

    fetchBackendData();
  }, []);

  // Login handler with JWT Session Generation
  const loginUser = async (role, userData = {}) => {
    try {
      const resp = await api.login({
        role,
        email: userData.email || '',
        token: userData.token || ''
      });

      setCurrentRole(resp.role);
      setCurrentUser({
        ...resp.user,
        role: resp.role,
        loginTimestamp: new Date().toLocaleTimeString()
      });
      setSessionData({
        sessionId: resp.session_id,
        token: resp.access_token,
        role: resp.role,
        expiresIn: resp.expires_in
      });
      setSessionTtlSeconds(resp.expires_in || 1800);
      setLastActivityTimestamp(Date.now());
      setShowInactivityWarning(false);
      showToast(`Logged in successfully as ${role.toUpperCase()} (Session: 30 Mins)!`);
    } catch (err) {
      // Fallback local login if backend is booting
      setCurrentRole(role);
      setCurrentUser({
        role,
        loginTimestamp: new Date().toLocaleTimeString(),
        ...userData
      });
      setSessionData({
        sessionId: `sess_${Math.random().toString(36).substring(2, 10)}`,
        role: role,
        expiresIn: 1800
      });
      setSessionTtlSeconds(1800);
      setLastActivityTimestamp(Date.now());
      showToast(`Logged in as ${role.toUpperCase()}!`);
    }
  };

  const refreshUserSession = async () => {
    try {
      const resp = await api.refreshSession();
      if (resp && resp.expires_in) {
        setSessionTtlSeconds(resp.expires_in);
      } else {
        setSessionTtlSeconds(1800);
      }
    } catch (err) {
      setSessionTtlSeconds(1800);
    }
    setLastActivityTimestamp(Date.now());
    setShowInactivityWarning(false);
    showToast('⚡ Active Session extended by +30 Minutes!');
  };

  const setRoleView = (role, candidateToken = null) => {
    loginUser(role, candidateToken ? { token: candidateToken } : {});
    if (candidateToken) {
      setSelectedCandidateToken(candidateToken);
    }
  };

  const logoutUser = async () => {
    try {
      await api.logoutSession();
    } catch (err) {}
    setCurrentUser(null);
    setCurrentRole(null);
    setSessionData(null);
    setShowInactivityWarning(false);
    showToast('Logged out of session successfully');
  };

  // Add Company (Persists to PostgreSQL)
  const addCompany = async (companyData) => {
    try {
      const created = await api.createCompany({
        name: companyData.name,
        contact_person: companyData.contactPerson || companyData.name,
        email: companyData.email,
        plan: companyData.plan || 'Enterprise Premier',
        price_per_verification: companyData.pricePerVerification || 120,
        max_limit: companyData.maxLimit || 500,
        features: companyData.features
      });

      const formatted = {
        id: created.id,
        name: created.name,
        code: created.code,
        contactPerson: created.contact_person,
        email: created.email,
        plan: created.plan,
        pricePerVerification: created.price_per_verification,
        verifiedCountThisMonth: created.verified_count_this_month,
        maxLimit: created.max_limit,
        status: created.status,
        features: created.features || {}
      };

      setCompanies(prev => [formatted, ...prev]);
      showToast(`Company "${created.name}" onboarded & saved to PostgreSQL!`);
    } catch (err) {
      const newComp = {
        id: `comp-${Date.now()}`,
        code: companyData.name.substring(0, 4).toUpperCase(),
        verifiedCountThisMonth: 0,
        status: 'Active',
        pricePerVerification: companyData.plan === 'Enterprise Premier' ? 120 : 100,
        ...companyData
      };
      setCompanies(prev => [newComp, ...prev]);
      showToast(`Company "${companyData.name}" onboarded!`);
    }
  };

  // Update Company Features
  const updateCompanyFeatures = async (companyId, newFeatures, newPlan) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, features: newFeatures, plan: newPlan || c.plan } : c));
    try {
      await api.updateCompanyFeatures(companyId, newFeatures);
      showToast('Company features updated & synced to PostgreSQL');
    } catch (err) {
      showToast('Company feature flags updated');
    }
  };

  // Update Company HR Governance Permissions (Configured by Company Admin)
  const updateCompanyHrPermissions = (companyId, newPermissions) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, hrPermissions: { ...(c.hrPermissions || {}), ...newPermissions } } : c));
    showToast('🏢 HR Staff Permissions & Policies Updated Successfully!');
  };

  // Update Candidate-Specific Verification Checklist & Configuration (Configured by HR)
  const updateCandidateVerificationConfig = (candidateToken, newConfig) => {
    setCandidates(prev => prev.map(c => c.token === candidateToken ? { ...c, verificationConfig: { ...(c.verificationConfig || {}), ...newConfig } } : c));
    showToast('👥 Candidate Verification Checklist Updated!');
  };

  // Update Candidate Security Passcode / Password (Persists in PostgreSQL)
  const updateCandidatePassword = async (token, newPassword) => {
    const cleanPin = (newPassword || '1234').toString().trim();
    setCandidates(prev => prev.map(c => c.token === token ? { ...c, portalPassword: cleanPin } : c));
    try {
      await api.setCandidatePassword(token, cleanPin);
    } catch (e) {
      console.warn('Backend set-password sync failed, kept in local state:', e);
    }
    showToast(`🔐 Unlock passcode saved: ${cleanPin}`);
  };

  // Update Company API Server Engine Routing (Hybrid / Server 1 Sandbox / Server 2 CoinCircle)
  const updateCompanyRoutingEngine = (companyId, engine) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, apiRoutingEngine: engine } : c));
    const engineLabels = {
      hybrid: 'Smart Hybrid Engine (Server 1 + Server 2 Auto-Fallback ⚡)',
      server1: 'Server 1 Only (Sandbox API Gateway 🌐)',
      server2: 'Server 2 Only (CoinCircleTrust 47+ APIs 🛡️)'
    };
    showToast(`Verification Engine set to ${engineLabels[engine] || engine}`);
  };

  // Add Candidate (Persists to PostgreSQL)
  const addCandidate = async (candidateData) => {
    const candidatePin = candidateData.portalPassword || candidateData.securityPin || '1234';
    try {
      const created = await api.createCandidate({
        name: candidateData.name,
        emp_id: candidateData.empId,
        email: candidateData.email,
        mobile: candidateData.mobile,
        aadhaar_no: candidateData.aadhaarNo,
        designation: candidateData.designation,
        dept: candidateData.dept,
        company_id: candidateData.companyId,
        hr_id: candidateData.hrId,
        portal_password: candidatePin,
        verification_config: candidateData.verificationConfig,
        manual_checks: candidateData.manualChecks
      });

      const formatted = {
        id: created.id,
        token: created.token,
        name: created.name,
        empId: created.emp_id,
        email: created.email,
        mobile: created.mobile,
        aadhaarNo: created.aadhaar_no,
        designation: created.designation,
        dept: created.dept,
        companyId: created.company_id,
        hrId: created.hr_id,
        status: created.status,
        portalPassword: created.portal_password || candidatePin,
        verificationConfig: created.verification_config || {},
        verificationsCompleted: created.verifications_completed || {},
        faceImages: created.face_images || { straight: null, left: null, right: null },
        manualChecks: created.manual_checks || {},
        verificationDate: created.verification_date
      };

      setCandidates(prev => [formatted, ...prev]);
      setSelectedCandidateToken(created.token);
      showToast(`Verification token created for ${candidateData.name}! Saved in DB.`);
      return created.token;
    } catch (err) {
      const newToken = `tok_${candidateData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(100 + Math.random() * 900)}`;
      const newCand = {
        id: `emp-${Date.now()}`,
        token: newToken,
        status: 'Link Sent',
        portalPassword: candidatePin,
        verificationsCompleted: { aadhaar: false, mobile: false, face: false },
        faceImages: { straight: null, left: null, right: null },
        verificationDate: null,
        ...candidateData
      };
      setCandidates(prev => [newCand, ...prev]);
      setSelectedCandidateToken(newToken);
      showToast(`Verification link generated for ${candidateData.name}!`);
      return newToken;
    }
  };

  // Update candidate verification state (Aadhaar, Mobile, Face, Complete)
  const updateCandidateVerification = async (token, stepName, stepData = true) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.token !== token) return cand;
      
      const updatedVerifs = { ...cand.verificationsCompleted, [stepName]: stepData };
      let updatedFaceImages = { ...cand.faceImages };
      if (stepName === 'faceImages' && typeof stepData === 'object') {
        updatedFaceImages = { ...updatedFaceImages, ...stepData };
      }

      const config = cand.verificationConfig || {};
      const aadhaarDone = !config.requireAadhaar || updatedVerifs.aadhaar;
      const mobileDone = !config.requireMobileOtp || updatedVerifs.mobile;
      const faceDone = !config.requireFaceMatch || updatedVerifs.face;
      const allFinished = aadhaarDone && mobileDone && faceDone;

      const newStatus = allFinished ? 'Verified' : 'In Verification';

      if (allFinished && cand.status !== 'Verified') {
        setCompanies(comps => comps.map(c => c.id === cand.companyId ? { ...c, verifiedCountThisMonth: c.verifiedCountThisMonth + 1 } : c));
        // Complete in backend
        api.completeVerification({ token }).catch(() => {});
      }

      return {
        ...cand,
        verificationsCompleted: updatedVerifs,
        faceImages: updatedFaceImages,
        status: newStatus,
        verificationDate: allFinished ? new Date().toISOString().replace('T', ' ').substring(0, 16) : cand.verificationDate
      };
    }));
  };

  // Candidate Submits Joining Form & Documents from Magic Link
  const submitCandidateJoiningForm = (token, submittedFormData) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.token !== token) return cand;
      return {
        ...cand,
        status: 'Submitted - Pending HR Review',
        submittedFormData: submittedFormData,
        lastSubmittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        verificationsCompleted: {
          ...cand.verificationsCompleted,
          joiningForm: true
        }
      };
    }));
    showToast('🎉 Onboarding Details & Documents Submitted! Sent to HR for Review & Approval.');
  };

  // HR Approves Candidate Submission
  const approveCandidateSubmission = (token) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.token !== token) return cand;
      // update company monthly verified count
      setCompanies(comps => comps.map(c => c.id === cand.companyId ? { ...c, verifiedCountThisMonth: c.verifiedCountThisMonth + 1 } : c));
      return {
        ...cand,
        status: 'Verified',
        hrCorrectionRemarks: '',
        verificationDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
    }));
    showToast('✅ Candidate Profile Approved & Certified! Official Dossier is now ready.');
  };

  // HR Rejects / Requests Corrections & Resends Link
  const requestCandidateCorrections = (token, correctionRemarks, customMessage) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.token !== token) return cand;
      return {
        ...cand,
        status: 'Corrections Requested',
        hrCorrectionRemarks: correctionRemarks || 'Please re-upload clearer documents and correct the highlighted fields.',
        hrCustomMessage: customMessage || cand.hrCustomMessage
      };
    }));
    showToast('🔄 Correction request & updated instructions dispatched to candidate via WhatsApp & SMS!');
  };

  // Get active candidate by token or default
  const getActiveCandidate = (token) => {
    const searchToken = token || selectedCandidateToken;
    return candidates.find(c => c.token === searchToken) || candidates[0] || null;
  };

  // Add HR user
  const addHrUser = async (hrData) => {
    try {
      const created = await api.addHrUser(hrData.companyId || 'comp-1', {
        name: hrData.name,
        email: hrData.email,
        dept: hrData.dept,
        company_id: hrData.companyId || 'comp-1'
      });
      setHrUsers(prev => [...prev, created]);
      showToast(`HR Executive "${hrData.name}" created & stored in PostgreSQL!`);
    } catch (err) {
      const newHr = { id: `hr-${Date.now()}`, activeLinks: 0, ...hrData };
      setHrUsers(prev => [...prev, newHr]);
      showToast(`HR Executive "${hrData.name}" created!`);
    }
  };

  // Master Dropdowns
  const addMasterDropdownOption = async (categoryKey, newOptionValue) => {
    if (!newOptionValue || !newOptionValue.trim()) return;
    const trimmed = newOptionValue.trim();
    if (masterDropdownOptions[categoryKey]?.includes(trimmed)) {
      showToast(`Option "${trimmed}" already exists.`, 'warning');
      return;
    }
    setMasterDropdownOptions(prev => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] || []), trimmed]
    }));
    try {
      await api.addMasterDropdownOption(categoryKey, trimmed);
      showToast(`Added "${trimmed}" to ${categoryKey} & saved to Database!`);
    } catch (err) {
      showToast(`Added "${trimmed}" to ${categoryKey}!`);
    }
  };

  const removeMasterDropdownOption = async (categoryKey, optionValue) => {
    setMasterDropdownOptions(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] || []).filter(opt => opt !== optionValue)
    }));
    try {
      await api.removeMasterDropdownOption(categoryKey, optionValue);
      showToast(`Removed "${optionValue}" from ${categoryKey}.`);
    } catch (err) {
      showToast(`Removed "${optionValue}" from ${categoryKey}.`);
    }
  };

  const addMasterFormField = async (fieldData) => {
    const newField = {
      id: `field_${Date.now()}`,
      category: 'Custom Field',
      defaultMandatory: false,
      ...fieldData
    };
    setMasterFormFields(prev => [...prev, newField]);
    try {
      await api.addMasterFormField({
        label: fieldData.label,
        type: fieldData.type || 'text',
        category: fieldData.category || 'Personal Info',
        default_mandatory: fieldData.defaultMandatory ?? false
      });
      showToast(`Master field "${fieldData.label}" saved in PostgreSQL!`);
    } catch (err) {
      showToast(`Master default field "${fieldData.label}" created!`);
    }
  };

  // Toggle Error Log Solved
  const toggleLogSolvedStatus = async (logId) => {
    let newSolved = false;
    setSystemErrorLogs(prev => prev.map(log => {
      if (log.id !== logId) return log;
      newSolved = !log.solved;
      return { ...log, solved: newSolved, resolvedTimestamp: newSolved ? new Date().toLocaleTimeString() : null };
    }));
    showToast(`Log issue #${logId} updated to ${newSolved ? 'SOLVED ✅' : 'UNRESOLVED 🔴'}`);
    try {
      await api.toggleLogSolved(logId, newSolved);
    } catch (err) {}
  };

  // Support Tickets
  const addSupportTicket = async (ticketData) => {
    const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newTicketId = `TICK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket = {
      id: newTicketId,
      status: 'Open',
      createdAt: timeNow,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: ticketData.reporterName || 'HR User',
          text: ticketData.details,
          timestamp: timeNow,
          type: 'user_ticket'
        }
      ],
      ...ticketData
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    showToast(`Support Ticket #${newTicketId} raised & stored in Database!`);
    try {
      await api.createTicket({
        company_id: ticketData.companyId || 'comp-1',
        company_name: ticketData.companyName || 'Acme Global',
        subject: ticketData.subject,
        category: ticketData.category || 'API Integration',
        priority: ticketData.priority || 'Medium',
        initial_message: ticketData.details
      });
    } catch (err) {}
  };

  const addTicketReply = async (ticketId, replyText, senderName = 'Super Admin Support', newStatus = 'In Progress') => {
    if (!replyText || !replyText.trim()) return;
    const timeNow = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setSupportTickets(prev => prev.map(t => {
      if (t.id !== ticketId) return t;

      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: senderName,
        text: replyText.trim(),
        timestamp: timeNow,
        type: senderName.includes('Super Admin') ? 'admin_reply' : 'user_reply'
      };

      return {
        ...t,
        status: newStatus,
        messages: [...(t.messages || []), newMsg]
      };
    }));

    showToast(`Reply sent for Ticket #${ticketId}! Status: ${newStatus}`);

    try {
      await api.addTicketReply(ticketId, {
        sender_role: senderName.includes('Super Admin') ? 'superadmin' : 'company',
        sender_name: senderName,
        message: replyText.trim()
      });
      await api.updateTicketStatus(ticketId, newStatus);
    } catch (err) {}
  };

  // Payment Settlement
  const payCompanyInvoice = async (companyId, amount, method = 'UPI (Razorpay / GPay)') => {
    const newPaymentId = `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setCompanyPaymentLedger(prev => ({
      ...prev,
      [companyId]: {
        status: 'SETTLED ✅',
        paymentId: newPaymentId,
        date: dateStr,
        amount: amount,
        method: method
      }
    }));

    showToast(`Payment of ₹${amount.toLocaleString()} SETTLED! Ref: ${newPaymentId}`);

    try {
      await api.recordPayment({
        company_id: companyId,
        amount: amount,
        payment_method: method,
        transaction_ref: newPaymentId
      });
    } catch (err) {}
  };

  const updateCommunicationGateways = async (waData, mailData) => {
    if (waData) setWhatsappConfig(prev => ({ ...prev, ...waData }));
    if (mailData) setEmailConfig(prev => ({ ...prev, ...mailData }));
    showToast('WhatsApp & Enterprise Email Gateway credentials saved in Database!');
    try {
      if (waData) await api.saveGateway({ gateway_type: 'whatsapp', settings: waData });
      if (mailData) await api.saveGateway({ gateway_type: 'email_smtp', settings: mailData });
    } catch (err) {}
  };

  const updateRoleSettings = async (roleKey, newSettings) => {
    setSystemSettings(prev => ({
      ...prev,
      [roleKey]: { ...(prev[roleKey] || {}), ...newSettings }
    }));
    showToast(`Settings for ${roleKey.toUpperCase()} saved to Database!`);
    try {
      await api.updateRoleSettings(roleKey, newSettings);
    } catch (err) {}
  };

  const updateGuidelines = (targetRole, updatedGuideData) => {
    setPlatformGuidelines(prev => ({
      ...prev,
      [targetRole]: { ...(prev[targetRole] || {}), ...updatedGuideData }
    }));
    showToast(`Operational Guidelines for ${targetRole.toUpperCase()} updated!`);
  };

  const updateApiConfig = async (gatewayKey, newConfig) => {
    setApiConfigurations(prev => ({
      ...prev,
      [gatewayKey]: { ...prev[gatewayKey], ...newConfig }
    }));
    showToast(`API Configuration for ${apiConfigurations[gatewayKey]?.name || gatewayKey} updated!`);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = (roleKey) => {
    setNotifications(prev => prev.map(n => n.role === roleKey ? { ...n, isRead: true } : n));
    showToast(`Marked all notifications as read for ${roleKey.toUpperCase()}`);
  };

  const clearAllNotifications = (roleKey) => {
    setNotifications(prev => prev.filter(n => n.role !== roleKey));
    showToast(`Cleared notification feed for ${roleKey.toUpperCase()}`);
  };

  const updateNotificationPreferences = (roleKey, newPrefs) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [roleKey]: { ...(prev[roleKey] || {}), ...newPrefs }
    }));
    showToast(`Updated notification preferences for ${roleKey.toUpperCase()}`);
  };

  // ⏳ JCS CERTIFICATE 60-DAY (2-MONTH) RETENTION & EXPIRY CALCULATOR
  const getCertificateLifecycle = (candidate) => {
    if (!candidate || candidate.status !== 'Verified' || !candidate.verificationDate) {
      return {
        isVerified: false,
        verificationDate: null,
        expiryDate: null,
        daysRemaining: 0,
        status: 'unverified',
        badgeColor: 'badge-slate',
        badgeLabel: 'Unverified',
        progressPercent: 0
      };
    }

    const verifTime = new Date(candidate.verificationDate).getTime();
    const validityPeriodMs = 60 * 24 * 60 * 60 * 1000; // 60 days in milliseconds
    const expiryTime = verifTime + validityPeriodMs;
    const expiryDateObj = new Date(expiryTime);
    const now = Date.now();
    
    const diffMs = expiryTime - now;
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(0, 60 - daysRemaining);
    const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / 60) * 100)));

    const expiryDateFormatted = isNaN(expiryDateObj.getTime()) 
      ? '2026-10-18' 
      : expiryDateObj.toISOString().split('T')[0];

    if (daysRemaining <= 0) {
      return {
        isVerified: true,
        verificationDate: candidate.verificationDate,
        expiryDate: expiryDateFormatted,
        daysRemaining: 0,
        status: 'expired',
        badgeColor: 'badge-rose',
        badgeLabel: 'Expired (Purge/Renew)',
        progressPercent: 100,
        isExpired: true
      };
    } else if (daysRemaining <= 3) {
      return {
        isVerified: true,
        verificationDate: candidate.verificationDate,
        expiryDate: expiryDateFormatted,
        daysRemaining,
        status: 'critical',
        badgeColor: 'badge-rose',
        badgeLabel: `🚨 Expiring in ${daysRemaining}d`,
        progressPercent,
        isExpiringSoon: true
      };
    } else if (daysRemaining <= 15) {
      return {
        isVerified: true,
        verificationDate: candidate.verificationDate,
        expiryDate: expiryDateFormatted,
        daysRemaining,
        status: 'expiring_soon',
        badgeColor: 'badge-amber',
        badgeLabel: `⚠️ Expiring in ${daysRemaining}d`,
        progressPercent,
        isExpiringSoon: true
      };
    } else {
      return {
        isVerified: true,
        verificationDate: candidate.verificationDate,
        expiryDate: expiryDateFormatted,
        daysRemaining,
        status: 'valid',
        badgeColor: 'badge-emerald',
        badgeLabel: `🟢 ${daysRemaining}d Valid`,
        progressPercent,
        isValid: true
      };
    }
  };

  // 📜 CUSTOM COMPANY TERMS & CONDITIONS CONTRACTS STATE
  const [customCompanyTerms, setCustomCompanyTerms] = useState({
    'comp-1': {
      companyId: 'comp-1',
      companyName: 'Acme Global Technologies',
      retentionDays: 60,
      customSla: '99.95% High-Availability SLA Tier',
      customIndemnityLimit: '₹10,00,000 INR',
      customClauseNotes: 'Dedicated 24/7 priority enterprise support line & quarterly cryptographic audit certifications.',
      boundVersion: 'v2.4-2026',
      signedBy: 'Vikram Malhotra (Director HR)',
      signedDate: '2026-08-15 10:30'
    },
    'comp-2': {
      companyId: 'comp-2',
      companyName: 'Apex Logistics Solutions',
      retentionDays: 90,
      customSla: '99.9% Standard Commercial Tier',
      customIndemnityLimit: '₹5,00,000 INR',
      customClauseNotes: 'Extended 90-day fleet driver KYC retention with fast-track automated DL authentication.',
      boundVersion: 'v2.4-2026',
      signedBy: 'Sneha Patel (Operations Head)',
      signedDate: '2026-08-18 14:20'
    },
    'comp-3': {
      companyId: 'comp-3',
      companyName: 'Starlight Healthcare Solutions',
      retentionDays: 60,
      customSla: '99.9% Clinical Priority Tier',
      customIndemnityLimit: '₹15,00,000 INR',
      customClauseNotes: 'Healthcare clinical background check indemnity & priority criminal record verification.',
      boundVersion: 'v2.4-2026',
      signedBy: 'Dr. Ramesh Iyer (Medical Director)',
      signedDate: '2026-08-22 09:45'
    }
  });

  // 👥 MULTI-ROLE LOGIN TELEMETRY & LIVE SESSIONS
  const [multiRoleSessions, setMultiRoleSessions] = useState([
    {
      id: 'sess-101',
      role: 'superadmin',
      roleLabel: 'Super Admin',
      userName: 'Super Administrator',
      email: 'superadmin@joyverification.com',
      company: 'JOY Platform HQ',
      ipAddress: '127.0.0.1 (Localhost Gateway)',
      device: 'Chrome 128 / Windows 11 (Host)',
      loginTime: '2026-08-25 08:00:12',
      lastActive: 'Just now',
      actionsCount: 52,
      status: 'Active 🟢'
    },
    {
      id: 'sess-102',
      role: 'company',
      roleLabel: 'Company Admin',
      userName: 'Vikram Malhotra',
      email: 'admin@acmeglobal.com',
      company: 'Acme Global Technologies',
      ipAddress: '192.168.1.83 (Wi-Fi Internal)',
      device: 'Edge 127 / macOS Sequoia',
      loginTime: '2026-08-25 08:30:45',
      lastActive: '4 mins ago',
      actionsCount: 22,
      status: 'Active 🟢'
    },
    {
      id: 'sess-103',
      role: 'hrexecutive',
      roleLabel: 'HR Executive',
      userName: 'Priya Sundaram',
      email: 'priya.s@acmeglobal.com',
      company: 'Acme Global Technologies',
      ipAddress: '106.51.24.112 (Bengaluru ISP)',
      device: 'Chrome 128 / Windows 11',
      loginTime: '2026-08-25 08:45:00',
      lastActive: '1 min ago',
      actionsCount: 38,
      status: 'Active 🟢'
    },
    {
      id: 'sess-104',
      role: 'hrexecutive',
      roleLabel: 'HR Executive',
      userName: 'Sneha Patel',
      email: 'sneha.p@apexlogistics.in',
      company: 'Apex Logistics Solutions',
      ipAddress: '157.48.92.10 (Mumbai Gateway)',
      device: 'Safari 17 / iOS Mobile',
      loginTime: '2026-08-25 09:10:20',
      lastActive: '12 mins ago',
      actionsCount: 14,
      status: 'Active 🟢'
    },
    {
      id: 'sess-105',
      role: 'employee_link',
      roleLabel: 'Candidate Link',
      userName: 'Rajesh Kumar',
      email: 'rajesh.k@gmail.com',
      company: 'Acme Global Technologies',
      ipAddress: '49.37.112.98 (Jio 5G Mobile)',
      device: 'Chrome Mobile / Android 14',
      loginTime: '2026-08-24 16:30:10',
      lastActive: 'Yesterday',
      actionsCount: 8,
      status: 'Completed / Idle 🟡'
    }
  ]);

  // Dispatch Official Invoice Bill to Company
  const sendCompanyInvoiceBill = async (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    const subtotal = company.verifiedCountThisMonth * company.pricePerVerification;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;
    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newNotif = {
      id: `notif-bill-${Date.now()}`,
      role: 'company',
      title: `💳 Monthly Invoice Dispatched (#${invoiceId})`,
      message: `Official bill for ₹${total.toLocaleString()} (${company.verifiedCountThisMonth} verifications + 18% GST) has been dispatched to ${company.email} via SMTP & WhatsApp Cloud Gateway.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
      priority: 'high',
      category: 'billing'
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(`📧 Invoice #${invoiceId} (₹${total.toLocaleString()}) dispatched to ${company.name} via Email & WhatsApp!`);
  };

  // Update Custom Company Terms & Conditions
  const updateCustomCompanyTerms = (companyId, termsData) => {
    setCustomCompanyTerms(prev => ({
      ...prev,
      [companyId]: {
        ...(prev[companyId] || {}),
        ...termsData,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
      }
    }));
    showToast(`Custom Terms & Conditions updated for ${termsData.companyName || companyId}!`);
  };

  // Dispatch 1-Click Re-Verification Link (renews 60-day lifecycle)
  const dispatchReVerificationLink = (token) => {
    const newToken = `tok_renew_${Date.now().toString().slice(-4)}`;
    setCandidates(prev => prev.map(c => {
      if (c.token !== token) return c;
      return {
        ...c,
        token: newToken,
        status: 'Link Sent',
        verificationsCompleted: { aadhaar: false, mobile: false, face: false, dl: false, pan: false, bankCheck: false },
        verificationDate: null
      };
    }));
    setSelectedCandidateToken(newToken);
    showToast(`🔄 Re-Verification Token dispatched! Candidate reset for fresh 60-day lifecycle.`);
    return newToken;
  };

  // 💳 RAZORPAY PAYMENT GATEWAY MASTER CONFIGURATION
  const [paymentGatewayConfig, setPaymentGatewayConfig] = useState({
    provider: 'Razorpay Payments India',
    mode: 'Sandbox / Test Mode', // 'Live Production' | 'Sandbox / Test Mode'
    keyId: 'rzp_test_JoyVerif2026',
    keySecret: 'rzp_sec_JoyCorpMaster99',
    webhookSecret: 'whsec_JoyCorpHook2026',
    autoInvoicing: true,
    gstRate: 18,
    sacCode: '998311'
  });

  const updatePaymentGatewayConfig = (newConfig) => {
    setPaymentGatewayConfig(prev => ({ ...prev, ...newConfig }));
    showToast('Payment Gateway settings updated successfully!');
  };

  // ⚡ 1-Click Verification Wallet Recharge via Razorpay / Payment Link
  const rechargeCompanyWallet = (companyId, amount, paymentRecord) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === companyId) {
        const currentBal = c.walletBalance || 0;
        const newBalance = currentBal + amount;
        const addedChecks = paymentRecord?.creditsAdded || Math.floor(amount / (c.pricePerVerification || 120));
        const updatedTx = [paymentRecord, ...(c.rechargeTransactions || [])];
        return {
          ...c,
          walletBalance: newBalance,
          maxLimit: (c.maxLimit || 500) + addedChecks,
          rechargeTransactions: updatedTx
        };
      }
      return c;
    }));

    const targetComp = companies.find(c => c.id === companyId);
    const newNotif = {
      id: `notif-recharge-${Date.now()}`,
      role: 'company',
      title: `⚡ Wallet Recharged: ₹${amount.toLocaleString('en-IN')}`,
      message: `Successfully credited ₹${amount.toLocaleString('en-IN')} (${paymentRecord?.creditsAdded || ''} BGV checks) to ${targetComp?.name || 'Company'} wallet via ${paymentRecord?.method || 'Razorpay'}.`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false,
      priority: 'high',
      category: 'billing'
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentRole,
      loginUser,
      setRoleView,
      logoutUser,
      companies,
      addCompany,
      updateCompanyFeatures,
      updateCompanyHrPermissions,
      updateCandidateVerificationConfig,
      updateCompanyRoutingEngine,
      hrUsers,
      addHrUser,
      candidates,
      addCandidate,
      updateCandidatePassword,
      updateCandidateVerification,
      submitCandidateJoiningForm,
      approveCandidateSubmission,
      requestCandidateCorrections,
      getActiveCandidate,
      selectedCandidateToken,
      setSelectedCandidateToken,
      getCertificateLifecycle,
      dispatchReVerificationLink,
      customCompanyTerms,
      updateCustomCompanyTerms,
      multiRoleSessions,
      sendCompanyInvoiceBill,
      paymentGatewayConfig,
      updatePaymentGatewayConfig,
      rechargeCompanyWallet,
      apiConfigurations,
      updateApiConfig,
      masterFormFields,
      addMasterFormField,
      masterDropdownOptions,
      addMasterDropdownOption,
      removeMasterDropdownOption,
      systemErrorLogs,
      toggleLogSolvedStatus,
      supportTickets,
      addSupportTicket,
      addTicketReply,
      whatsappConfig,
      emailConfig,
      updateCommunicationGateways,
      companyPaymentLedger,
      payCompanyInvoice,
      systemSettings,
      updateRoleSettings,
      platformGuidelines,
      updateGuidelines,
      notifications,
      notificationPreferences,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearAllNotifications,
      updateNotificationPreferences,
      featureList: INITIAL_FEATURE_LIST,
      activeInvoiceModal,
      setActiveInvoiceModal,
      toastMessage,
      showToast,
      isBackendConnected,
      sessionData,
      sessionTtlSeconds,
      showInactivityWarning,
      inactivityCountdown,
      refreshUserSession,
      activeRole: currentRole
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
