import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { QrCodeModal } from '../components/QrCodeModal';
import { FullJoiningFormModal } from '../components/FullJoiningFormModal';
import { CommunicationGatewaysModal } from '../components/CommunicationGatewaysModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
import { MetricDrilldownModal } from '../components/MetricDrilldownModal';
import { ComprehensiveBgvReportModal } from '../components/ComprehensiveBgvReportModal';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { UniversalDocumentExportModal } from '../components/UniversalDocumentExportModal';
import { evaluateVerificationReadiness, VERIFICATION_REQUIREMENTS, getFieldOwnershipStatus } from '../utils/verificationRequirements';
import { 
  User,
  UserCheck, 
  Send, 
  Copy, 
  Check, 
  Sliders, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Lock,
  Download,
  BarChart3,
  ListFilter,
  QrCode,
  MessageSquare,
  Sparkles,
  FileCheck2,
  FileEdit,
  SendHorizontal,
  Settings,
  Save,
  Award,
  FileText,
  ShieldCheck,
  Eye,
  Zap,
  RefreshCw,
  AlertTriangle,
  Scale,
  MapPin,
  GraduationCap,
  Briefcase,
  CreditCard,
  FolderDown,
  Building2,
  KeyRound,
  X,
  AlertCircle,
  ExternalLink,
  Cpu,
  Factory,
  Landmark,
  Stethoscope,
  Truck,
  ShoppingBag,
  HardHat,
  FileSpreadsheet,
  Layers,
  Users,
  CheckSquare,
  FileCode,
  Upload
} from 'lucide-react';

export const HrExecutiveView = () => {
  const { 
    candidates, 
    addCandidate, 
    setRoleView, 
    showToast, 
    hrUsers, 
    companies, 
    featureList, 
    systemSettings, 
    updateRoleSettings, 
    masterDropdownOptions,
    getCertificateLifecycle,
    dispatchReVerificationLink,
    approveCandidateSubmission,
    requestCandidateCorrections
  } = useApp();
  const [showGatewaysModal, setShowGatewaysModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'profiler' | 'analytics' | 'settings'
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFullJoiningModal, setShowFullJoiningModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  
  // Document preview states
  const [downloadingCandidate, setDownloadingCandidate] = useState(null);
  const [viewingCertificateCandidate, setViewingCertificateCandidate] = useState(null);
  const [viewingDossierCandidate, setViewingDossierCandidate] = useState(null);
  const [viewingBgvReportCandidate, setViewingBgvReportCandidate] = useState(null);
  const [viewingUploadedDocsCandidate, setViewingUploadedDocsCandidate] = useState(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState(null);
  const [onboardingMode, setOnboardingMode] = useState('hr_filled'); // 'hr_filled' | 'candidate_filled'
  const [dispatchingCandidate, setDispatchingCandidate] = useState(null);
  const [reviewingCandidate, setReviewingCandidate] = useState(null);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [showCorrectionInput, setShowCorrectionInput] = useState(false);
  const [activeDrilldown, setActiveDrilldown] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('it_tech');
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showUniversalExportModal, setShowUniversalExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const activeHr = hrUsers[0] || { id: 'hr-1', companyId: 'comp-1', name: 'Priya Sundaram', dept: 'Engineering Recruitment' };
  const currentCompany = companies.find(c => c.id === activeHr.companyId) || companies[0];

  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    employeeNumber: '',
    dob: '',
    age: '',
    doj: '',
    motherTongue: '',
    religion: 'Hindu',
    caste: '',
    category: 'General',
    nativeState: '',
    nativeDistrict: '',
    identificationMarks: '',
    pfNumber: '',
    esiNumber: '',
    email: '',
    mobile: '',
    alternateMobile: '',
    aadhaarNo: '',
    portalPassword: '1234',
    designation: 'Senior Software Engineer',
    dept: 'Engineering & Software Architecture',
    fatherName: '',
    motherName: '',
    spouseName: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    nationality: 'Indian',
    languagesKnown: 'English (Fluent), Hindi (National)',
    selfInterests: 'Coding & Open Source Development',
    state: 'Karnataka',
    city: 'Bengaluru',
    area: 'Koramangala 4th Block, Bengaluru',
    pincode: '560103',
    presentAddress: '',
    permanentAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    qualificationCategory: 'Under Graduate (UG / Bachelor Degree)',
    highestQualification: 'B.Tech / B.E. in Computer Science',
    primarySkill: 'React JS, Node.js, Python, Cloud AWS',
    college: 'BMS College of Engineering',
    university: 'VTU Technological University',
    passingYear: '2020',
    percentage: '84.5%',
    jobCategory: 'Information Technology & Software Services',
    jobType: 'Full Time Permanent',
    workLocation: 'Bengaluru Global Tech Hub (HQ)',
    previousEmployer: 'Infosys Limited',
    experienceYears: '4.5',
    panNo: '',
    drivingLicense: '',
    passportNo: '',
    voterId: '',
    uanEpf: '',
    esicNo: '',
    bankName: 'HDFC Bank',
    bankAccountNo: '',
    ifscCode: 'HDFC0001234',
    nomineeName: '',
    nomineeRelation: 'Spouse',
    companyId: currentCompany.id,
    hrId: activeHr.id,
    employeeCategory: 'it_tech',
    hrCustomMessage: 'Welcome to JOY CORPORATE SOLUTIONS PRIVATE LIMITED! Please fill out all required onboarding sections, upload your original KYC & academic certificates, and complete verification by this week.',
    
    // Dynamic Industry & Role-Specific Operational Details
    industrySpecialization: {
      industryType: 'it_tech',
      // IT Fields
      techStack: 'React JS, Node.js, Python, AWS Cloud, PostgreSQL',
      githubUrl: 'https://github.com/developer-demo',
      portfolioUrl: 'https://portfolio-showcase.dev',
      laptopAssetTag: 'ASSET-LT-2026-088 (MacBook Pro M3 Max)',
      monitorAssetTag: 'MON-4K-27-041',
      dualEmploymentDisclosure: 'No Dual Employment / 100% Full-Time Exclusive Commitment',
      openSourceDisclosure: 'Personal open source contributions under MIT License',
      // Manufacturing Fields
      plantLocation: 'Chennai Automotive Assembly Plant - Unit 3',
      shopFloorUnit: 'Chassis & Robotic Welding Section 4',
      shiftRoster: 'General Shift (9:00 AM - 5:30 PM)',
      safetyShoeSize: 'UK 9 / EUR 43',
      hardhatColor: 'Yellow (Floor Supervisor / Engineer)',
      safetyTrainingCompleted: true,
      occupationalHealthCertNo: 'MED-FIT-CHN-2026-912',
      doctorRegNo: 'TN-MCI-48912',
      gatePassId: 'GATE-CH-8812',
      hazardTrainingDate: '2026-01-15',
      // BFSI Fields
      cibilScoreRange: '780 - 820 (Excellent Credit Standing)',
      cibilConsentAgreed: true,
      amlComplianceStatus: 'Cleared - Zero Adverse Flagging',
      sebiInsiderTradingClearance: 'No Active Trading in Company Client Portfolios',
      certificationsBfsi: 'NISM Series VIII Equity Derivatives, IRDA Composite Broker',
      fidelityBondLimit: '₹10,00,000 (Ten Lakhs Corporate Indemnity)',
      familyDirectorships: 'None / Nil Commercial Conflict of Interest',
      // Healthcare Fields
      medicalCouncilRegNo: 'MCI-2018-091823 (Valid till 2028)',
      nursingCouncilRegNo: '',
      departmentWard: 'Intensive Care Unit (ICU) & Critical Care',
      immunizationStatus: 'Hepatitis B (3 Doses Complete), Tetanus Toxoid 2026, COVID Booster',
      gmpCleanroomProtocol: 'Cleared Sterile Class 100 Cleanroom Compliance',
      lifeSupportCert: 'AHA Certified ACLS / BLS (Valid till Nov 2027)',
      // Logistics Fields
      commercialDlBadgeNo: 'KA-01-TR-2021-98124',
      badgeExpiryDate: '2029-12-31',
      forkliftLicenseNo: 'MHE-FL-8819',
      fleetGpsConsent: true,
      routeExperience: 'Interstate Heavy Haulage (NH48 Golden Quadrilateral)',
      policeNocNumber: 'POL-KA-BC-2026-5510',
      // Retail Fields
      fssaiCertNo: 'FSSAI-FSTAC-2026-8812',
      foodHandlerHealthCard: 'Valid Annual Medical Health Card Issued',
      uniformShirtSize: 'L (40 cm)',
      uniformPantsSize: '34 Waist',
      posCashAgreement: true,
      storeShiftPreference: 'Morning & Weekend Peak Shifts (Sat-Sun Available)',
      assignedStoreCode: 'RET-BLR-PHOENIX-04',
      // Contractual Fields
      contractFormXIIIEnrollmentNo: 'CL-RA-2026-FORM-XIII-912',
      contractorAgencyName: 'First Choice Manpower & Facility Solutions Pvt Ltd',
      contractorLicenseNo: 'CL-LIC-KA-2024-8891',
      workOrderPoNumber: 'PO-JOY-2026-CW-410',
      esicSubCode: '52000889120010001',
      wageRateClassification: 'Highly Skilled / Supervisor Grade Rate (₹1,150/Day)',
      contractTenure: '2026-09-01 to 2027-08-31 (12 Months Renewable)'
    },
    statutoryFormsConfig: {
      form16: true,
      form11: true,
      formF: true,
      esicForm1: false,
      nda: true,
      posh: true,
      nonCompete: true,
      contractFormXIII: false
    },
    requiredDocumentsConfig: {
      aadhaarCard: true,
      panCard: true,
      passport: true,
      drivingLicense: false,
      bankProof: true,
      degreeMarksheet: true,
      relievingLetter: true,
      salarySlips: true,
      signedNda: true
    },
    verificationConfig: {
      aadhaar: true,
      pan: false,
      bankCheck: false,
      drivingLicense: false,
      voterId: false,
      mobileOtp: false,
      passport: false,
      uan: false,
      criminalCheck: false,
      education: false,
      directorship: false,
      faceCapture: false
    },
    manualChecks: {
      hrReferenceCompleted: true,
      addressVerifiedPhysically: false
    },
    uploadedDocuments: {},
    customFields: [],
    customDocSlots: []
  });

  const [delegatedFieldsMap, setDelegatedFieldsMap] = useState({});

  // Dynamic Upstream Verification & Data-Fetching Dependency Evaluator
  const readiness = useMemo(() => {
    return evaluateVerificationReadiness({
      ...formData,
      fullName: formData.name,
      accountNo: formData.bankAccountNo
    });
  }, [formData]);

  const toggleFieldDelegation = (fieldName) => {
    setDelegatedFieldsMap(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // 1-Click Multi-Industry Mock / Demo Profile Auto-Fill Engine
  const handleAutoFillMockData = (targetIndustry = 'it_tech') => {
    setSelectedTemplate(targetIndustry);
    const randomEmpNum = Math.floor(1000 + Math.random() * 9000);
    const randomPhone = `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const randomAadhaar = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

    if (targetIndustry === 'it_tech') {
      setFormData({
        name: 'Karthik Ramanathan',
        empId: `EMP-IT-${randomEmpNum}`,
        email: 'karthik.ramanathan@gmail.com',
        mobile: randomPhone,
        alternateMobile: '+91 98111 22334',
        aadhaarNo: randomAadhaar,
        portalPassword: '1234',
        designation: 'Senior Full Stack Cloud Architect',
        dept: 'Engineering & Cloud Architecture',
        fatherName: 'Suresh Ramanathan',
        motherName: 'Kavitha Ramanathan',
        spouseName: 'Sunita Ramanathan',
        dob: '1996-05-15',
        gender: 'Male',
        bloodGroup: 'O+',
        maritalStatus: 'Married',
        nationality: 'Indian',
        languagesKnown: 'English (Fluent), Hindi (National), Tamil (Regional)',
        selfInterests: 'Coding & Open Source Development',
        state: 'Karnataka',
        city: 'Bengaluru',
        area: 'Koramangala 4th Block, Bengaluru',
        pincode: '560103',
        presentAddress: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru, KA - 560103',
        permanentAddress: 'House No 45, MG Road, Civil Lines, Jaipur, RJ - 302001',
        emergencyContactName: 'Suresh Ramanathan (Father)',
        emergencyContactPhone: '+91 98111 22334',
        qualificationCategory: 'Under Graduate (UG / Bachelor Degree)',
        highestQualification: 'B.Tech in Computer Science & Engineering',
        primarySkill: 'React JS, Node.js, Python, AWS Cloud',
        college: 'BMS College of Engineering',
        university: 'VTU Technological University',
        passingYear: '2020',
        percentage: '84.5%',
        jobCategory: 'Information Technology & Software Services',
        jobType: 'Full Time Permanent',
        workLocation: 'Bengaluru Global Tech Hub (HQ)',
        previousEmployer: 'Infosys Limited',
        experienceYears: '5.5',
        panNo: 'ABCDE1234F',
        drivingLicense: 'KA-01201900124',
        passportNo: 'J8912401',
        voterId: 'WZK8912301',
        uanEpf: '100982341209',
        esicNo: '310082910291',
        bankName: 'HDFC Bank',
        bankAccountNo: '50100234129845',
        ifscCode: 'HDFC0001234',
        nomineeName: 'Sunita Ramanathan',
        nomineeRelation: 'Spouse (100% Share)',
        companyId: currentCompany.id,
        hrId: activeHr.id,
        employeeCategory: 'it_tech',
        hrCustomMessage: 'Welcome to the Software Engineering Division! Please complete all 10 onboarding sections, upload your academic degrees, and execute the IP Assignment NDA.',
        industrySpecialization: {
          industryType: 'it_tech',
          techStack: 'React, Node.js, Python, PostgreSQL, AWS Lambda, Docker',
          githubUrl: 'https://github.com/karthik-cloud-dev',
          portfolioUrl: 'https://karthik-fullstack.dev',
          laptopAssetTag: 'JOY-ASSET-LT-2026-088 (MacBook Pro M3 Max 32GB)',
          monitorAssetTag: 'JOY-MON-4K-27-041',
          dualEmploymentDisclosure: 'No Dual Employment / 100% Full-Time Exclusive Commitment',
          openSourceDisclosure: 'Personal open source contributions under MIT License'
        },
        statutoryFormsConfig: { form16: true, form11: true, formF: true, esicForm1: false, nda: true, posh: true, nonCompete: true, contractFormXIII: false },
        requiredDocumentsConfig: { aadhaarCard: true, panCard: true, passport: true, drivingLicense: false, bankProof: true, degreeMarksheet: true, relievingLetter: true, salarySlips: true, signedNda: true },
        verificationConfig: { aadhaar: true, pan: false, bankCheck: false, drivingLicense: false, voterId: false, mobileOtp: false, passport: false, uan: false, criminalCheck: false, education: false, directorship: false, faceCapture: false },
        manualChecks: { hrReferenceCompleted: true, addressVerifiedPhysically: false },
        uploadedDocuments: {
          aadhaar: { title: 'Aadhaar Card Copy', name: 'Aadhaar_Card_Verified_Copy.pdf', type: 'aadhaar', file_format: 'pdf', file_size_kb: 420.5, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          pan: { title: 'Income Tax PAN Card', name: 'PAN_Card_Front_Copy.pdf', type: 'pan', file_format: 'pdf', file_size_kb: 310.2, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          experience: { title: 'Relieving & Experience Letter', name: 'Infosys_Relieving_Experience_Letter.pdf', type: 'experience_letter', file_format: 'pdf', file_size_kb: 750.0, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          salary: { title: 'Last 3 Months Salary Slips', name: 'Payslips_Q1_2026.pdf', type: 'salary_slips', file_format: 'pdf', file_size_kb: 890.4, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          degree: { title: 'Highest Degree Marksheet', name: 'BE_Computer_Science_Degree.pdf', type: 'education_certificate', file_format: 'pdf', file_size_kb: 1200.0, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          bank: { title: 'Bank Cancelled Cheque', name: 'HDFC_Bank_Cancelled_Cheque.pdf', type: 'bank_proof', file_format: 'pdf', file_size_kb: 280.0, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          resume: { title: 'Candidate Resume / CV', name: 'Karthik_Ramanathan_Resume.pdf', type: 'resume', file_format: 'pdf', file_size_kb: 520.0, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          passportPhoto: { title: 'Passport Size Photograph', name: 'Recent_Color_Photo.jpg', type: 'passport_photo', file_format: 'jpg', file_size_kb: 140.0, file_path: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...' },
          signedNda: { title: 'Signed Employer NDA', name: 'Executed_NDA_Confidentiality.pdf', type: 'signed_contract', file_format: 'pdf', file_size_kb: 640.0, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          medicalCert: { title: 'Medical Fitness Certificate', name: 'Medical_Fitness_Declaration.pdf', type: 'medical_fitness', file_format: 'pdf', file_size_kb: 310.0, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          sector_spec_1: { title: 'Anti-Moonlighting Declaration', name: 'IT_Moonlighting_Exclusivity_Undertaking.pdf', type: 'sector_specific', file_format: 'pdf', file_size_kb: 380.0, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' },
          sector_spec_2: { title: 'WFH Asset Security Policy', name: 'Remote_IT_Asset_Policy.pdf', type: 'sector_specific', file_format: 'pdf', file_size_kb: 490.0, file_path: 'data:application/pdf;base64,JVBERi0xLjQKJ...' }
        }
      });
      showToast('💻 Auto-filled complete IT / Software Engineering Profile!');
    } else if (targetIndustry === 'manufacturing') {
      setFormData({
        name: 'Rajeshwar Singh',
        empId: `EMP-MFG-${randomEmpNum}`,
        email: 'rajeshwar.singh@gmail.com',
        mobile: randomPhone,
        alternateMobile: '+91 98222 33445',
        aadhaarNo: randomAadhaar,
        portalPassword: '1234',
        designation: 'Plant Operations & Assembly Supervisor',
        dept: 'Automotive Manufacturing & Assembly',
        fatherName: 'Harbhajan Singh',
        motherName: 'Jaswinder Kaur',
        spouseName: 'Simran Kaur',
        dob: '1993-08-20',
        gender: 'Male',
        bloodGroup: 'B+',
        maritalStatus: 'Married',
        nationality: 'Indian',
        languagesKnown: 'English, Hindi, Tamil (Shop-Floor Fluent)',
        selfInterests: 'Robotics & Industrial Safety Standards',
        state: 'Tamil Nadu',
        city: 'Chennai',
        area: 'Sriperumbudur Industrial Corridor, Chennai',
        pincode: '602105',
        presentAddress: 'Plot 12, Industrial Township, Sriperumbudur, Chennai, TN - 602105',
        permanentAddress: 'Village Kotla, Jalandhar District, PB - 144001',
        emergencyContactName: 'Harbhajan Singh (Father)',
        emergencyContactPhone: '+91 98222 33445',
        qualificationCategory: 'Polytechnic Diploma',
        highestQualification: 'Diploma in Mechanical Engineering & Tool Design',
        primarySkill: 'Robotic Welding, CNC Machining, PLC Automation & Safety Standards',
        college: 'PSG Polytechnic College',
        university: 'State Board of Technical Education',
        passingYear: '2016',
        percentage: '79.2%',
        jobCategory: 'Manufacturing & Heavy Industrial Engineering',
        jobType: 'Full Time Permanent',
        workLocation: 'Chennai Regional Operations Center',
        previousEmployer: 'Tata Motors Limited',
        experienceYears: '6.0',
        panNo: 'RSTUV5678G',
        drivingLicense: 'TN-01201700912',
        passportNo: '',
        voterId: 'TNX9812401',
        uanEpf: '100983419012',
        esicNo: '310091240912',
        bankName: 'State Bank of India (SBI)',
        bankAccountNo: '309124019284',
        ifscCode: 'SBIN0001892',
        nomineeName: 'Simran Kaur',
        nomineeRelation: 'Spouse (100% Share)',
        companyId: currentCompany.id,
        hrId: activeHr.id,
        employeeCategory: 'manufacturing',
        hrCustomMessage: 'Welcome to the Industrial Manufacturing Division! Please review shop floor safety standards, provide your PPE shoe sizes, and complete occupational medical fitness.',
        industrySpecialization: {
          industryType: 'manufacturing',
          plantLocation: 'Chennai Industrial Corridor - Plant Unit 3',
          shopFloorUnit: 'Heavy Chassis & Robotic Arc Welding Line 2',
          shiftRoster: 'Shift A (06:00 AM - 02:30 PM Rotational)',
          safetyShoeSize: 'UK 9 / EUR 43 (Steel Toe ISI Marked)',
          hardhatColor: 'Yellow (Floor Supervisor / Production Engineer)',
          safetyTrainingCompleted: true,
          occupationalHealthCertNo: 'MED-FIT-CHN-2026-912',
          doctorRegNo: 'TN-MCI-48912',
          gatePassId: 'GATE-PASS-PL3-8812',
          hazardTrainingDate: '2026-01-15'
        },
        statutoryFormsConfig: { form16: false, form11: true, formF: true, esicForm1: true, nda: true, posh: true, nonCompete: false, contractFormXIII: false },
        requiredDocumentsConfig: { aadhaarCard: true, panCard: true, passport: false, drivingLicense: true, bankProof: true, degreeMarksheet: true, relievingLetter: true, salarySlips: true, signedNda: true },
        verificationConfig: { aadhaar: true, pan: false, bankCheck: false, drivingLicense: false, voterId: false, mobileOtp: false, passport: false, uan: false, criminalCheck: false, education: false, directorship: false, faceCapture: false },
        manualChecks: { hrReferenceCompleted: true, addressVerifiedPhysically: false }
      });
      showToast('🏭 Auto-filled Manufacturing & Plant Operations Profile!');
    } else if (targetIndustry === 'bfsi') {
      setFormData({
        name: 'Pooja Deshmukh',
        empId: `EMP-BFSI-${randomEmpNum}`,
        email: 'pooja.deshmukh@gmail.com',
        mobile: randomPhone,
        alternateMobile: '+91 98333 44556',
        aadhaarNo: randomAadhaar,
        portalPassword: '1234',
        designation: 'Senior Investment & Credit Risk Analyst',
        dept: 'Corporate Banking & Risk Governance',
        fatherName: 'Anil Deshmukh',
        motherName: 'Meenakshi Deshmukh',
        spouseName: 'Rohit Deshmukh',
        dob: '1995-11-12',
        gender: 'Female',
        bloodGroup: 'A+',
        maritalStatus: 'Married',
        nationality: 'Indian',
        languagesKnown: 'English (Fluent), Hindi, Marathi',
        selfInterests: 'Macroeconomic Risk, SEBI Equity Regulations & Quantitative Modeling',
        state: 'Maharashtra',
        city: 'Mumbai',
        area: 'Bandra Kurla Complex (BKC), Mumbai',
        pincode: '400051',
        presentAddress: 'Tower 4, Sea View Apartments, Worli, Mumbai, MH - 400018',
        permanentAddress: 'Bunglow 14, Shivaji Nagar, Pune, MH - 411005',
        emergencyContactName: 'Anil Deshmukh (Father)',
        emergencyContactPhone: '+91 98333 44556',
        qualificationCategory: 'Post Graduate (PG / Master Degree)',
        highestQualification: 'MBA in Finance & CFA Level 2',
        primarySkill: 'Credit Appraisal, Portfolio Risk, CIBIL Scoring & Financial Modeling',
        college: 'NMIMS School of Business Management',
        university: 'NMIMS Deemed University, Mumbai',
        passingYear: '2019',
        percentage: '88.6%',
        jobCategory: 'Banking, Financial Services & Insurance (BFSI)',
        jobType: 'Full Time Permanent',
        workLocation: 'Mumbai Financial District (BKC)',
        previousEmployer: 'HDFC Bank Limited',
        experienceYears: '4.5',
        panNo: 'PQXYZ1234K',
        drivingLicense: '',
        passportNo: 'Z8912401',
        voterId: 'MHX8812901',
        uanEpf: '100984910291',
        esicNo: '',
        bankName: 'ICICI Bank',
        bankAccountNo: '001102910294',
        ifscCode: 'ICIC0000011',
        nomineeName: 'Rohit Deshmukh',
        nomineeRelation: 'Spouse (100% Share)',
        companyId: currentCompany.id,
        hrId: activeHr.id,
        employeeCategory: 'bfsi',
        hrCustomMessage: 'Welcome to Corporate Banking & Risk Governance! Please sign your CIBIL consent, SEBI Insider Trading clearance, and upload your NISM certifications.',
        industrySpecialization: {
          industryType: 'bfsi',
          cibilScoreRange: '795 - 830 (Prime Credit Standing)',
          cibilConsentAgreed: true,
          amlComplianceStatus: 'Cleared - Zero Anti-Money Laundering Flags',
          sebiInsiderTradingClearance: 'Approved - Zero Personal Trading in Client Scrips',
          certificationsBfsi: 'NISM Series VIII Equity Derivatives, IRDA Composite Broker',
          fidelityBondLimit: '₹15,00,000 (Fifteen Lakhs Corporate Indemnity)',
          familyDirectorships: 'Nil / No Commercial Conflict of Interest'
        },
        statutoryFormsConfig: { form16: true, form11: true, formF: true, esicForm1: false, nda: true, posh: true, nonCompete: true, contractFormXIII: false },
        requiredDocumentsConfig: { aadhaarCard: true, panCard: true, passport: true, drivingLicense: false, bankProof: true, degreeMarksheet: true, relievingLetter: true, salarySlips: true, signedNda: true },
        verificationConfig: { aadhaar: true, pan: false, bankCheck: false, drivingLicense: false, voterId: false, mobileOtp: false, passport: false, uan: false, criminalCheck: false, education: false, directorship: false, faceCapture: false },
        manualChecks: { hrReferenceCompleted: true, addressVerifiedPhysically: false }
      });
      showToast('🏦 Auto-filled BFSI, Banking & Fintech Profile!');
    } else if (targetIndustry === 'healthcare') {
      setFormData({
        name: 'Dr. Sunita Rao',
        empId: `EMP-MED-${randomEmpNum}`,
        email: 'dr.sunita.rao@gmail.com',
        mobile: randomPhone,
        alternateMobile: '+91 98444 55667',
        aadhaarNo: randomAadhaar,
        portalPassword: '1234',
        designation: 'Senior Medical Officer & Clinical Specialist',
        dept: 'Emergency Medicine & Critical Care (ICU)',
        fatherName: 'Dr. Ramachandra Rao',
        motherName: 'Lakshmi Rao',
        spouseName: 'Dr. Vikram Rao',
        dob: '1992-04-18',
        gender: 'Female',
        bloodGroup: 'AB+',
        maritalStatus: 'Married',
        nationality: 'Indian',
        languagesKnown: 'English, Hindi, Telugu, Kannada',
        selfInterests: 'Clinical Cardiology, Bio-Ethics & Advanced Trauma Care',
        state: 'Karnataka',
        city: 'Bengaluru',
        area: 'Indiranagar 100ft Road, Bengaluru',
        pincode: '560038',
        presentAddress: 'Villa 8, Palm Meadows, Whitefield, Bengaluru, KA - 560066',
        permanentAddress: '42, Temple Road, Malleshwaram, Bengaluru, KA - 560003',
        emergencyContactName: 'Dr. Ramachandra Rao (Father)',
        emergencyContactPhone: '+91 98444 55667',
        qualificationCategory: 'Doctorate / Ph.D / Medical Masters',
        highestQualification: 'MBBS, MD in Emergency & Critical Care',
        primarySkill: 'Trauma Resuscitation, Ventilator Management & Clinical Protocols',
        college: 'Bangalore Medical College and Research Institute',
        university: 'Rajiv Gandhi University of Health Sciences (RGUHS)',
        passingYear: '2017',
        percentage: '89.4%',
        jobCategory: 'Healthcare, Pharmaceuticals & Clinical Life Sciences',
        jobType: 'Full Time Permanent',
        workLocation: 'Bengaluru Global Tech Hub (HQ)',
        previousEmployer: 'Apollo Hospitals Enterprise Ltd',
        experienceYears: '7.0',
        panNo: 'MEDXY9812M',
        drivingLicense: 'KA-03201500812',
        passportNo: 'M8912401',
        voterId: 'KAX9812401',
        uanEpf: '100985910291',
        esicNo: '',
        bankName: 'Axis Bank',
        bankAccountNo: '91201002910294',
        ifscCode: 'UTIB0000041',
        nomineeName: 'Dr. Vikram Rao',
        nomineeRelation: 'Spouse (100% Share)',
        companyId: currentCompany.id,
        hrId: activeHr.id,
        employeeCategory: 'healthcare',
        hrCustomMessage: 'Welcome to the Medical & Clinical Operations Team! Please provide your State Medical Council registration, vaccination history, and ACLS certification.',
        industrySpecialization: {
          industryType: 'healthcare',
          medicalCouncilRegNo: 'MCI-2017-089412 (Valid till 2027)',
          nursingCouncilRegNo: '',
          departmentWard: 'Intensive Care Unit (ICU) & Trauma Emergency',
          immunizationStatus: 'Hepatitis B (3 Doses Complete), Tetanus Toxoid 2026, COVID Booster',
          gmpCleanroomProtocol: 'Cleared Sterile Bio-Safety Class 100 Standards',
          lifeSupportCert: 'AHA Certified ACLS / BLS (Valid till Nov 2027)'
        },
        statutoryFormsConfig: { form16: true, form11: true, formF: true, esicForm1: false, nda: true, posh: true, nonCompete: false, contractFormXIII: false },
        requiredDocumentsConfig: { aadhaarCard: true, panCard: true, passport: true, drivingLicense: false, bankProof: true, degreeMarksheet: true, relievingLetter: true, salarySlips: true, signedNda: true },
        verificationConfig: { aadhaar: true, pan: false, bankCheck: false, drivingLicense: false, voterId: false, mobileOtp: false, passport: false, uan: false, criminalCheck: false, education: false, directorship: false, faceCapture: false },
        manualChecks: { hrReferenceCompleted: true, addressVerifiedPhysically: false }
      });
      showToast('🏥 Auto-filled Healthcare & Hospital Profile!');
    } else if (targetIndustry === 'logistics') {
      setFormData({
        name: 'Muthuvelan K',
        empId: `EMP-LOG-${randomEmpNum}`,
        email: 'muthuvelan.k@gmail.com',
        mobile: randomPhone,
        alternateMobile: '+91 98555 66778',
        aadhaarNo: randomAadhaar,
        portalPassword: '1234',
        designation: 'Commercial Fleet Lead & Heavy Transport Driver',
        dept: 'Supply Chain Logistics & Fleet Operations',
        fatherName: 'Kuppusamy M',
        motherName: 'Meenambal K',
        spouseName: 'Vasanthi M',
        dob: '1989-03-25',
        gender: 'Male',
        bloodGroup: 'O+',
        maritalStatus: 'Married',
        nationality: 'Indian',
        languagesKnown: 'Tamil, Telugu, Hindi, Basic English',
        selfInterests: 'Long-Haul Navigation, Telematics & Defensive Driving',
        state: 'Tamil Nadu',
        city: 'Chennai',
        area: 'Madhavaram Transport Nagar, Chennai',
        pincode: '600060',
        presentAddress: 'Plot 45, Transport Hub, Madhavaram, Chennai, TN - 600060',
        permanentAddress: 'Village Melur, Madurai District, TN - 625106',
        emergencyContactName: 'Kuppusamy M (Father)',
        emergencyContactPhone: '+91 98555 66778',
        qualificationCategory: 'Secondary / 10th Standard (SSLC)',
        highestQualification: 'HSC (12th Standard) + Heavy Commercial Driving Certification',
        primarySkill: 'Interstate Heavy Haulage, GPS Telematics, Fleet Route Optimization',
        college: 'Government Higher Secondary School, Melur',
        university: 'State Board of School Examinations',
        passingYear: '2007',
        percentage: '72.0%',
        jobCategory: 'Logistics, Warehousing & Fleet Operations',
        jobType: 'Full Time Permanent',
        workLocation: 'Chennai Regional Operations Center',
        previousEmployer: 'Delhivery Express Logistics',
        experienceYears: '8.0',
        panNo: 'LOGTN9812L',
        drivingLicense: 'TN-01198900412',
        passportNo: '',
        voterId: 'TNV9812401',
        uanEpf: '100986910291',
        esicNo: '310098124012',
        bankName: 'Canara Bank',
        bankAccountNo: '104910291029',
        ifscCode: 'CNRB0001049',
        nomineeName: 'Vasanthi M',
        nomineeRelation: 'Spouse (100% Share)',
        companyId: currentCompany.id,
        hrId: activeHr.id,
        employeeCategory: 'logistics',
        hrCustomMessage: 'Welcome to the Logistics & Supply Chain Division! Please provide your Commercial Driving License badge number, GPS telematics consent, and Police NOC.',
        industrySpecialization: {
          industryType: 'logistics',
          commercialDlBadgeNo: 'TN-01-TR-2018-98412',
          badgeExpiryDate: '2029-08-31',
          forkliftLicenseNo: 'MHE-FL-TN-2022-881',
          fleetGpsConsent: true,
          routeExperience: 'Interstate Heavy Haulage (NH44 & NH48 Expressways)',
          policeNocNumber: 'POL-TN-CHN-2026-9041'
        },
        statutoryFormsConfig: { form16: false, form11: true, formF: true, esicForm1: true, nda: false, posh: true, nonCompete: false, contractFormXIII: false },
        requiredDocumentsConfig: { aadhaarCard: true, panCard: true, passport: false, drivingLicense: true, bankProof: true, degreeMarksheet: true, relievingLetter: true, salarySlips: true, signedNda: false },
        verificationConfig: { aadhaar: true, pan: false, bankCheck: false, drivingLicense: false, voterId: false, mobileOtp: false, passport: false, uan: false, criminalCheck: false, education: false, directorship: false, faceCapture: false },
        manualChecks: { hrReferenceCompleted: true, addressVerifiedPhysically: false }
      });
      showToast('🚚 Auto-filled Logistics, Transport & Fleet Profile!');
    } else if (targetIndustry === 'retail_hospitality') {
      setFormData({
        name: 'Ananya Roy',
        empId: `EMP-RET-${randomEmpNum}`,
        email: 'ananya.roy@gmail.com',
        mobile: randomPhone,
        alternateMobile: '+91 98666 77889',
        aadhaarNo: randomAadhaar,
        portalPassword: '1234',
        designation: 'Store Manager & Customer Experience Lead',
        dept: 'Retail Operations & Merchandising',
        fatherName: 'Debabrata Roy',
        motherName: 'Mousumi Roy',
        spouseName: 'Sourav Roy',
        dob: '1997-07-09',
        gender: 'Female',
        bloodGroup: 'B+',
        maritalStatus: 'Single',
        nationality: 'Indian',
        languagesKnown: 'English (Fluent), Hindi, Bengali, Kannada',
        selfInterests: 'Retail Merchandising, POS Shrinkage Control & Hospitality Training',
        state: 'Karnataka',
        city: 'Bengaluru',
        area: 'Phoenix Marketcity Retail Zone, Whitefield, Bengaluru',
        pincode: '560048',
        presentAddress: 'Flat 204, Royal Palms, Mahadevapura, Bengaluru, KA - 560048',
        permanentAddress: 'Flat 3B, Salt Lake Sector 2, Kolkata, WB - 700091',
        emergencyContactName: 'Debabrata Roy (Father)',
        emergencyContactPhone: '+91 98666 77889',
        qualificationCategory: 'Under Graduate (UG / Bachelor Degree)',
        highestQualification: 'Bachelor of Hotel Management & Catering (BHM)',
        primarySkill: 'POS Cash Reconciliation, Food Safety Standards, Store Merchandising',
        college: 'Institute of Hotel Management (IHM)',
        university: 'National Council for Hotel Management and Catering Technology',
        passingYear: '2021',
        percentage: '83.0%',
        jobCategory: 'Retail, FMCG, Hospitality & Frontline Services',
        jobType: 'Full Time Permanent',
        workLocation: 'Bengaluru Global Tech Hub (HQ)',
        previousEmployer: 'Reliance Retail Limited',
        experienceYears: '3.5',
        panNo: 'RETWB8812R',
        drivingLicense: '',
        passportNo: '',
        voterId: 'WBX8812901',
        uanEpf: '100987910291',
        esicNo: '310098910291',
        bankName: 'Kotak Mahindra Bank',
        bankAccountNo: '501009812984',
        ifscCode: 'KKBK0000412',
        nomineeName: 'Debabrata Roy',
        nomineeRelation: 'Father (100% Share)',
        companyId: currentCompany.id,
        hrId: activeHr.id,
        employeeCategory: 'retail_hospitality',
        hrCustomMessage: 'Welcome to the Retail & Customer Experience Team! Please review the Food Safety Standards, provide your uniform size, and sign the POS cash agreement.',
        industrySpecialization: {
          industryType: 'retail_hospitality',
          fssaiCertNo: 'FSSAI-FOSTAC-2025-9921',
          foodHandlerHealthCard: 'Valid Annual Medical Health Card Issued (Fitness Grade A)',
          uniformShirtSize: 'M (38 cm)',
          uniformPantsSize: '30 Waist',
          posCashAgreement: true,
          storeShiftPreference: 'Morning & Weekend Peak Shifts (Sat-Sun Available)',
          assignedStoreCode: 'RET-BLR-PHOENIX-04'
        },
        statutoryFormsConfig: { form16: false, form11: true, formF: true, esicForm1: true, nda: true, posh: true, nonCompete: false, contractFormXIII: false },
        requiredDocumentsConfig: { aadhaarCard: true, panCard: true, passport: false, drivingLicense: false, bankProof: true, degreeMarksheet: true, relievingLetter: true, salarySlips: true, signedNda: true },
        verificationConfig: { aadhaar: true, pan: false, bankCheck: false, drivingLicense: false, voterId: false, mobileOtp: false, passport: false, uan: false, criminalCheck: false, education: false, directorship: false, faceCapture: false },
        manualChecks: { hrReferenceCompleted: true, addressVerifiedPhysically: false }
      });
      showToast('🛍️ Auto-filled Retail, Hospitality & Frontline Profile!');
    } else if (targetIndustry === 'contractual') {
      setFormData({
        name: 'Basavaraj Patil',
        empId: `EMP-CNT-${randomEmpNum}`,
        email: 'basavaraj.patil@gmail.com',
        mobile: randomPhone,
        alternateMobile: '+91 98777 88990',
        aadhaarNo: randomAadhaar,
        portalPassword: '1234',
        designation: 'Contractual Maintenance Specialist & Facility Helper',
        dept: 'Facility Management, Security & Auxiliary Support',
        fatherName: 'Sharanappa Patil',
        motherName: 'Renuka Patil',
        spouseName: 'Kavitha Patil',
        dob: '1994-09-14',
        gender: 'Male',
        bloodGroup: 'A+',
        maritalStatus: 'Married',
        nationality: 'Indian',
        languagesKnown: 'Kannada, Telugu, Hindi, Basic English',
        selfInterests: 'Facility Maintenance, Electrical Wiring & Fire Safety Protocols',
        state: 'Karnataka',
        city: 'Bengaluru',
        area: 'Electronic City Phase 1 Industrial Area, Bengaluru',
        pincode: '560100',
        presentAddress: 'Quarter 14, Industrial Quarters, Bommasandra, Bengaluru, KA - 560099',
        permanentAddress: 'Village Hunasagi, Yadgir District, KA - 585215',
        emergencyContactName: 'Sharanappa Patil (Father)',
        emergencyContactPhone: '+91 98777 88990',
        qualificationCategory: 'Vocational / ITI Trade Certificate',
        highestQualification: 'ITI Trade Certificate in Electrical Maintenance',
        primarySkill: 'Building Maintenance, Electrical Wiring, Fire Safety Drills',
        college: 'Government Industrial Training Institute (ITI)',
        university: 'National Council for Vocational Training (NCVT)',
        passingYear: '2015',
        percentage: '76.4%',
        jobCategory: 'Contractual Labor, Security & Facility Operations',
        jobType: 'Contractual (Fixed Term 1-3 Yrs)',
        workLocation: 'Bengaluru Global Tech Hub (HQ)',
        previousEmployer: 'SIS Security & Facility Solutions',
        experienceYears: '3.0',
        panNo: 'CNTPT8812P',
        drivingLicense: '',
        passportNo: '',
        voterId: 'KAY9812401',
        uanEpf: '100988910291',
        esicNo: '310099910291',
        bankName: 'Union Bank of India',
        bankAccountNo: '520101002910',
        ifscCode: 'UBIN0552011',
        nomineeName: 'Kavitha Patil',
        nomineeRelation: 'Spouse (100% Share)',
        companyId: currentCompany.id,
        hrId: activeHr.id,
        employeeCategory: 'contractual',
        hrCustomMessage: 'Welcome to the Facility & Operations Team! Please provide your Contractor Agency details, Contract Labor Form XIII registration, and ESIC sub-code.',
        industrySpecialization: {
          industryType: 'contractual',
          contractFormXIIIEnrollmentNo: 'CL-RA-2026-FORM-XIII-912',
          contractorAgencyName: 'First Choice Manpower & Facility Solutions Pvt Ltd',
          contractorLicenseNo: 'CL-LIC-KA-2024-8891',
          workOrderPoNumber: 'PO-JOY-2026-CW-410',
          esicSubCode: '52000889120010001',
          wageRateClassification: 'Skilled Grade Rate (₹950/Day + ESIC & PF)',
          contractTenure: '2026-09-01 to 2027-08-31 (12 Months Renewable)'
        },
        statutoryFormsConfig: { form16: false, form11: true, formF: false, esicForm1: true, nda: false, posh: true, nonCompete: false, contractFormXIII: true },
        requiredDocumentsConfig: { aadhaarCard: true, panCard: true, passport: false, drivingLicense: false, bankProof: true, degreeMarksheet: true, relievingLetter: false, salarySlips: true, signedNda: false },
        verificationConfig: { aadhaar: true, pan: false, bankCheck: false, drivingLicense: false, voterId: false, mobileOtp: false, passport: false, uan: false, criminalCheck: false, education: false, directorship: false, faceCapture: false },
        manualChecks: { hrReferenceCompleted: true, addressVerifiedPhysically: false }
      });
      showToast('🏗️ Auto-filled Contract Labor & Field Staff Profile!');
    }
  };

  const applyEmployeeCategory = (categoryKey) => {
    setSelectedTemplate(categoryKey);
    setFormData(prev => ({
      ...prev,
      employeeCategory: categoryKey,
      industrySpecialization: {
        ...(prev.industrySpecialization || {}),
        industryType: categoryKey
      }
    }));
    handleAutoFillMockData(categoryKey);
  };

  const renderFieldLabel = (label, fieldKey, isRequired = false) => {
    const ownership = getFieldOwnershipStatus(fieldKey, formData[fieldKey], delegatedFieldsMap);
    return (
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-slate-700 font-bold leading-tight">
          {label} {isRequired && <span className="text-rose-500">*</span>}
        </span>
        <span 
          onClick={() => toggleFieldDelegation(fieldKey)}
          title="Click to toggle HR-filled vs Candidate Link-delegated"
          className={`text-[8px] font-black px-1.5 py-0.2 rounded border cursor-pointer select-none transition-all ${ownership.badgeClass}`}
        >
          {ownership.status === 'hr' ? 'HR 🏢' : 'Link 📱'}
        </span>
      </div>
    );
  };

  const getFieldInputClass = (fieldKey, baseClass = 'form-input') => {
    const ownership = getFieldOwnershipStatus(fieldKey, formData[fieldKey], delegatedFieldsMap);
    if (ownership.status === 'employee') {
      return `${baseClass} border-amber-300 bg-amber-50/20 focus:border-amber-500 focus:bg-white`;
    }
    return `${baseClass} border-slate-300 bg-white focus:border-indigo-500`;
  };

  // Dynamic Custom Fields State & Handlers
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [showAddCustomFieldModal, setShowAddCustomFieldModal] = useState(false);

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [showAddCustomDocModal, setShowAddCustomDocModal] = useState(false);

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const fieldId = `custom_${Date.now()}`;
    const newField = {
      id: fieldId,
      key: newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      value: ''
    };
    setFormData(prev => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField]
    }));
    setNewFieldLabel('');
    setShowAddCustomFieldModal(false);
    showToast(`✨ Added custom field: "${newField.label}"!`);
  };

  const handleUpdateCustomFieldValue = (fieldId, val) => {
    setFormData(prev => ({
      ...prev,
      customFields: (prev.customFields || []).map(f => f.id === fieldId ? { ...f, value: val } : f)
    }));
  };

  const handleRemoveCustomField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      customFields: (prev.customFields || []).filter(f => f.id !== fieldId)
    }));
  };

  const handleAddCustomDocSlot = () => {
    if (!newDocTitle.trim()) return;
    const slotId = `custom_doc_${Date.now()}`;
    const newSlot = {
      id: slotId,
      key: slotId,
      title: newDocTitle.trim(),
      desc: newDocDesc.trim() || 'Company specific specialized document attachment',
      type: 'custom_doc'
    };
    setFormData(prev => ({
      ...prev,
      customDocSlots: [...(prev.customDocSlots || []), newSlot]
    }));
    setNewDocTitle('');
    setNewDocDesc('');
    setShowAddCustomDocModal(false);
    showToast(`📄 Added custom document slot: "${newSlot.title}"!`);
  };

  const handleRemoveCustomDocSlot = (slotId) => {
    setFormData(prev => {
      const updatedSlots = (prev.customDocSlots || []).filter(s => s.id !== slotId);
      const updatedDocs = { ...(prev.uploadedDocuments || {}) };
      delete updatedDocs[slotId];
      return {
        ...prev,
        customDocSlots: updatedSlots,
        uploadedDocuments: updatedDocs
      };
    });
  };

  const handleDocFileUpload = (docKey, file, docTitle, docType) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        uploadedDocuments: {
          ...(prev.uploadedDocuments || {}),
          [docKey]: {
            title: docTitle,
            name: file.name,
            type: docType,
            file_format: file.name.split('.').pop().toLowerCase(),
            file_size_kb: parseFloat((file.size / 1024).toFixed(1)),
            file_path: reader.result
          }
        }
      }));
      showToast(`📎 Attached ${docTitle} (${file.name})!`);
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedDoc = (docKey) => {
    setFormData(prev => {
      const updated = { ...(prev.uploadedDocuments || {}) };
      delete updated[docKey];
      return { ...prev, uploadedDocuments: updated };
    });
  };

  const handleCreateCandidateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.aadhaarNo) {
      alert('Please fill out Name, Mobile, and Aadhaar Number.');
      return;
    }

    const docsList = Object.values(formData.uploadedDocuments || {});
    
    // Convert customFields array into key-value map
    const customFieldsMap = {};
    (formData.customFields || []).forEach(f => {
      customFieldsMap[f.key || f.id] = {
        label: f.label,
        type: f.type,
        required: f.required,
        value: f.value
      };
    });

    addCandidate({
      ...formData,
      customFields: customFieldsMap,
      custom_fields: customFieldsMap,
      documents: docsList,
      uploadedDocumentsList: docsList,
      delegatedFieldsMap,
      verificationReadiness: readiness
    });
    setShowAddForm(false);
    setActiveTab('pipeline');
  };

  const handleCopyLink = (token) => {
    const link = `${window.location.origin}/verify?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    showToast('Magic verification link copied to clipboard!');
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      
      {/* Top Header Banner & Navigation Tabs */}
      <div className="glass-panel p-6 border-emerald-200 bg-white space-y-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-700" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald font-bold">HR Executive Workstation</span>
              <span className="text-xs text-slate-500 font-bold">• {activeHr.name} ({currentCompany.name})</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Employee Profiler, Verification & Document Generator</h2>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">Create candidate profiles, auto-fill mock values, dispatch multi-channel verification links, and export official PDF compliance documents.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setShowGatewaysModal(true)}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
              title="Configure WhatsApp & SMTP Email Credentials"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Gateways (WhatsApp/Email) 💬</span>
            </button>

            <button 
              onClick={() => {
                setShowAddForm(true);
                setActiveTab('profiler');
              }}
              className="btn btn-hrexecutive text-xs flex items-center gap-1.5 shadow-md font-bold"
            >
              <SendHorizontal className="w-4 h-4" />
              <span>Create Employee & Send Link</span>
            </button>

            <button 
              onClick={() => setShowFullJoiningModal(true)}
              className="btn btn-company text-xs flex items-center gap-1.5 shadow-md font-bold"
            >
              <FileEdit className="w-4 h-4" />
              <span>HR Station Form Entry</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 gap-1.5 shadow-2xs">
          <button
            data-tour-step="hr-pipeline-tab"
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 text-center select-none cursor-pointer ${
              activeTab === 'pipeline' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="truncate">Candidates</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              activeTab === 'pipeline' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {candidates.length}
            </span>
          </button>

          <button
            data-tour-step="hr-profiler-tab"
            onClick={() => setActiveTab('profiler')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 text-center select-none cursor-pointer ${
              activeTab === 'profiler' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20 scale-[1.02]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span className="truncate">Add Profile</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-black">
              NEW
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 text-center select-none cursor-pointer ${
              activeTab === 'analytics' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span className="truncate">Telemetry & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 text-center select-none cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-indigo-700 text-white shadow-md shadow-indigo-600/20 scale-[1.02]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="truncate">Settings & Policy</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Candidate Forms" 
          value={candidates.length} 
          subtext="Profiles Managed by HR" 
          icon={UserCheck} 
          color="emerald" 
          onClick={() => setActiveDrilldown({
            title: 'Active Candidate Employee Profiles',
            subtitle: `All candidate profiles managed under ${currentCompany.name}`,
            metricValue: `${candidates.length} Profiles`,
            metricType: 'hr_active',
            data: candidates.map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany.name,
              status: c.status,
              verificationDate: c.verificationDate || 'Recent',
              token: c.token
            }))
          })}
        />
        <MetricCard 
          title="Links Dispatched (WhatsApp/SMS)" 
          value={candidates.filter(c => c.status !== 'Draft').length} 
          subtext="Sent via Multi-Channel Router" 
          icon={Send} 
          color="cyan" 
          onClick={() => setActiveDrilldown({
            title: 'Dispatched Verification Links Audit',
            subtitle: 'Candidates who have received a magic link via WhatsApp, SMS, or Email',
            metricValue: `${candidates.filter(c => c.status !== 'Draft').length} Dispatched`,
            metricType: 'hr_dispatched',
            data: candidates.filter(c => c.status !== 'Draft').map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany.name,
              status: c.status,
              verificationDate: c.verificationDate || 'Dispatched',
              token: c.token
            }))
          })}
        />
        <MetricCard 
          title="Verified Successfully" 
          value={candidates.filter(c => c.status === 'Verified').length} 
          subtext="Aadhaar + Mobile + Face Completed" 
          icon={CheckCircle2} 
          color="indigo" 
          onClick={() => setActiveDrilldown({
            title: 'Successfully Verified Employees',
            subtitle: 'Candidates with 100% completed Aadhaar, Mobile, and Face verifications',
            metricValue: `${candidates.filter(c => c.status === 'Verified').length} Verified`,
            metricType: 'hr_verified',
            data: candidates.filter(c => c.status === 'Verified').map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany.name,
              status: 'Verified',
              verificationDate: c.verificationDate || 'Completed',
              token: c.token
            }))
          })}
        />
        <MetricCard 
          title="Pending Verification" 
          value={candidates.filter(c => c.status !== 'Verified').length} 
          subtext="Awaiting Candidate Response" 
          icon={Clock} 
          color="amber" 
          onClick={() => setActiveDrilldown({
            title: 'Pending Candidate Verifications',
            subtitle: 'Candidates who have not yet submitted their OTP or photo verifications',
            metricValue: `${candidates.filter(c => c.status !== 'Verified').length} Pending`,
            metricType: 'hr_pending',
            data: candidates.filter(c => c.status !== 'Verified').map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany.name,
              status: c.status || 'Draft',
              token: c.token
            }))
          })}
        />
      </div>

      {/* TAB 1: CANDIDATE PIPELINE & MULTI-CHANNEL DISPATCHER */}
      {activeTab === 'pipeline' && (
        <div className="glass-panel p-4 sm:p-6 border-slate-200 bg-white space-y-4 shadow-sm rounded-2xl animate-tab-switch">
          
          {/* ⏳ JCS CERTIFICATE 60-DAY EXPIRY NOTICE BOARD BANNER */}
          {(() => {
            const expiringCandidates = candidates.filter(c => {
              const lc = getCertificateLifecycle(c);
              return lc.isVerified && (lc.isExpiringSoon || lc.isExpired);
            });

            if (expiringCandidates.length === 0) return null;

            return (
              <div className="p-4 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse shrink-0" />
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        ⏳ JCS Certificate 60-Day Expiry Notice Board ({expiringCandidates.length} Candidates Action Required)
                      </h4>
                      <p className="text-[11px] text-amber-900 font-medium">
                        JCS Verification Certificates have an active validity lifecycle of <strong>60 days (2 months)</strong>. Download permanent PDF backups or dispatch re-verification links before expiry.
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-amber text-[10px] shrink-0 font-bold">60-Day Lifecycle Policy</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {expiringCandidates.map(c => {
                    const lc = getCertificateLifecycle(c);
                    return (
                      <div key={c.id} className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs">{c.name}</span>
                            <span className={`badge text-[9px] ${lc.badgeColor}`}>{lc.badgeLabel}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Verified: {c.verificationDate?.split(' ')[0]} • Valid until: <strong className="text-slate-800">{lc.expiryDate}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setViewingDossierCandidate(c)}
                            className="btn btn-secondary text-[10px] py-1 px-2 flex items-center gap-1 font-bold text-sky-800 bg-sky-50 border-sky-200 hover:bg-sky-100"
                            title="Download 4-Page Dossier Backup"
                          >
                            <Download className="w-3 h-3" />
                            <span>Backup PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => dispatchReVerificationLink(c.token)}
                            className="btn btn-hrexecutive text-[10px] py-1 px-2 flex items-center gap-1 font-bold shadow-2xs"
                            title="Dispatch Re-Verification Link"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Re-Verify</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ⚖️ Fair Hiring & DPDP Act 2023 Statutory Advisory Banner */}
          <div className="p-4 bg-slate-950 text-white rounded-2xl border-2 border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/50 text-white shrink-0 border border-indigo-400/40">
                <Scale className="w-5 h-5 text-indigo-200" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                    Statutory Fair Hiring Notice
                  </span>
                  <span className="text-[11px] text-indigo-300 font-mono font-bold">• DPDP Act 2023 Section 7(a)</span>
                </div>
                <p className="text-xs text-slate-100 font-medium leading-relaxed">
                  All verification queries are conducted pursuant to candidate digital consent gathered automatically on link dispatch. Masked Aadhaar and 60-day document lifecycle rules apply.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLegalHandbook(true)}
              className="btn text-xs py-2 px-3.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-400/40 shrink-0 self-start sm:self-auto flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Legal Guidelines 📖</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Employee Candidate Verification Pipeline & Document Registry</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Dispatch onboarding links via WhatsApp/SMS/Email, monitor 60-day certificate validity, and export official dossiers</p>
            </div>
            
            <div className="flex items-center gap-2 self-start flex-wrap">
              <button
                onClick={() => setShowUniversalExportModal(true)}
                className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-2xs cursor-pointer"
                title="Download date-filtered candidate reports in PDF, Excel CSV, or ZIP"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Date-Filtered Reports 📥</span>
              </button>

              <button
                onClick={() => {
                  setShowAddForm(true);
                  setActiveTab('profiler');
                }}
                className="btn btn-hrexecutive text-xs flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New Employee</span>
              </button>
            </div>
          </div>

          {/* Search, Filter & Quick Statistics Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50/90 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                placeholder="🔍 Search candidate by name, employee ID, mobile, or Aadhaar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input text-xs py-2 px-3.5 bg-white font-medium flex-1 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold px-2"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select text-xs py-1.5 px-3 bg-white font-bold rounded-xl border-slate-200"
              >
                <option value="All">All Statuses ({candidates.length})</option>
                <option value="Verified">Verified ({candidates.filter(c => c.status === 'Verified').length})</option>
                <option value="In Verification">In Verification ({candidates.filter(c => c.status === 'In Verification').length})</option>
                <option value="Draft">Draft ({candidates.filter(c => c.status === 'Draft' || !c.status).length})</option>
              </select>
            </div>
          </div>

          {/* 📱 ADAPTIVE MOBILE CANDIDATE CARDS (SHOWN ON MOBILE SCREENS < 640px) */}
          <div className="block sm:hidden space-y-3.5">
            {candidates
              .filter(c => {
                const matchesSearch = !searchQuery.trim() || 
                  c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.empId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.mobile?.includes(searchQuery) ||
                  c.aadhaarNo?.includes(searchQuery);
                
                const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
                return matchesSearch && matchesStatus;
              })
              .map((cand, index) => {
                const lc = getCertificateLifecycle(cand);
                return (
                  <div 
                    key={cand.id} 
                    className="p-4 bg-white rounded-2xl border-2 border-slate-200/90 shadow-sm space-y-3 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

                    {/* Card Header: Avatar, Name, Designation, and Status Badge */}
                    <div className="flex items-start justify-between gap-2.5 pt-1">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-sm border border-emerald-200 shrink-0">
                          {cand.name?.charAt(0) || 'C'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 text-sm truncate">{cand.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            {cand.designation || 'Specialist'} • #{cand.empId || 'EMP-2026-88'}
                          </p>
                        </div>
                      </div>

                      <span className={`badge font-black text-[10px] shrink-0 ${
                        cand.status === 'Verified' ? 'badge-emerald' : 
                        cand.status === 'Submitted - Pending HR Review' ? 'badge-amber ring-2 ring-amber-400 animate-pulse' :
                        cand.status === 'Corrections Requested' ? 'badge-rose' :
                        cand.status === 'In Verification' ? 'badge-cyan' : 'badge-slate'
                      }`}>
                        {cand.status === 'Submitted - Pending HR Review' ? '⚡ Review' : cand.status}
                      </span>
                    </div>

                    {/* Contact & Identity Details Chips */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Phone / Mobile</span>
                        <span className="font-mono font-bold text-slate-900 text-[11px] truncate block">{cand.mobile || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">Masked Aadhaar</span>
                        <span className="font-mono font-bold text-slate-700 text-[11px] truncate block">
                          {cand.aadhaarNo ? `XXXX XXXX ${cand.aadhaarNo.slice(-4)}` : 'XXXX XXXX 9876'}
                        </span>
                      </div>
                    </div>

                    {/* Verification Checklist Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Verification Gates</span>
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {cand.verificationConfig?.requireAadhaar && (
                          <span className={`px-2 py-0.5 rounded-md border font-bold flex items-center gap-1 ${
                            cand.verificationsCompleted?.aadhaar ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            Aadhaar {cand.verificationsCompleted?.aadhaar ? '✓' : '⌛'}
                          </span>
                        )}
                        {cand.verificationConfig?.requireMobileOtp && (
                          <span className={`px-2 py-0.5 rounded-md border font-bold flex items-center gap-1 ${
                            cand.verificationsCompleted?.mobile ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            Mobile {cand.verificationsCompleted?.mobile ? '✓' : '⌛'}
                          </span>
                        )}
                        {cand.verificationConfig?.requireFaceMatch && (
                          <span className={`px-2 py-0.5 rounded-md border font-bold flex items-center gap-1 ${
                            cand.verificationsCompleted?.face ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            Face {cand.verificationsCompleted?.face ? '✓' : '⌛'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 60-Day Validity Bar if Verified */}
                    {lc.isVerified && (
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500">60-Day Certificate Validity:</span>
                          <span className={lc.badgeColor}>{lc.badgeLabel}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${lc.progressPercent}%` }} 
                            className={`h-full rounded-full ${lc.isExpired || lc.status === 'critical' ? 'bg-rose-500' : lc.isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          />
                        </div>
                      </div>
                    )}

                    {/* HR Review Action for Submitted Candidates */}
                    {cand.status === 'Submitted - Pending HR Review' && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewingCandidate(cand);
                          setShowCorrectionInput(false);
                          setCorrectionNotes('');
                        }}
                        className="w-full py-2 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>⚡ Review & Approve Submission</span>
                      </button>
                    )}

                    {/* Mobile Touch Action Buttons Grid (2 Columns) */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setViewingBgvReportCandidate(cand)}
                        className="p-2 rounded-xl bg-purple-50 text-purple-950 border border-purple-200 hover:bg-purple-100 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                        <span className="truncate">360° Dossier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewingDossierCandidate(cand)}
                        className="p-2 rounded-xl bg-sky-50 text-sky-950 border border-sky-200 hover:bg-sky-100 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                        <span className="truncate">Profile PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewingUploadedDocsCandidate(cand)}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <FolderDown className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">Vault Files (8)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewingCertificateCandidate(cand)}
                        className="p-2 rounded-xl bg-indigo-50 text-indigo-950 border border-indigo-200 hover:bg-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <Award className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                        <span className="truncate">Certificate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDispatchingCandidate(cand)}
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <QrCode className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Send Link 📲</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRoleView('employee_link', cand.token)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-center"
                      >
                        <Smartphone className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Test Portal 👁️</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            {candidates.length === 0 && (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No candidates registered yet. Click "+ Add New Employee" to get started.
              </div>
            )}
          </div>

          {/* 🖥️ WIDESCREEN DESKTOP CANDIDATE TABLE (SHOWN ON TABLETS & DESKTOPS >= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Candidate Profile</th>
                  <th className="py-3 px-4">Contact & IDs</th>
                  <th className="py-3 px-4">Verification Checklist</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Certificate Validity (60-Day)</th>
                  <th className="py-3 px-4 text-right">Official Document Downloads & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {candidates
                  .filter(c => {
                    const matchesSearch = !searchQuery.trim() || 
                      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.empId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.mobile?.includes(searchQuery) ||
                      c.aadhaarNo?.includes(searchQuery);
                    
                    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
                    return matchesSearch && matchesStatus;
                  })
                  .map((cand, index) => {
                  const lc = getCertificateLifecycle(cand);
                  return (
                    <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 text-sm">{cand.name}</div>
                        <div className="text-slate-500 text-[11px] font-medium">{cand.designation || 'Specialist'} • #{cand.empId || 'EMP-2026-88'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-900 font-bold font-mono">{cand.mobile}</div>
                        <div className="text-slate-500 text-[11px] font-mono">Aadhaar: {cand.aadhaarNo || '5489 1234 9876'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs text-[10px]">
                          {cand.verificationConfig?.requireAadhaar && (
                            <span className={`px-1.5 py-0.5 rounded border font-bold ${
                              cand.verificationsCompleted?.aadhaar ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              Aadhaar {cand.verificationsCompleted?.aadhaar ? '✓' : '⌛'}
                            </span>
                          )}
                          {cand.verificationConfig?.requireMobileOtp && (
                            <span className={`px-1.5 py-0.5 rounded border font-bold ${
                              cand.verificationsCompleted?.mobile ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              Mobile {cand.verificationsCompleted?.mobile ? '✓' : '⌛'}
                            </span>
                          )}
                          {cand.verificationConfig?.requireFaceMatch && (
                            <span className={`px-1.5 py-0.5 rounded border font-bold ${
                              cand.verificationsCompleted?.face ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              Face {cand.verificationsCompleted?.face ? '✓' : '⌛'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`badge font-bold ${
                          cand.status === 'Verified' ? 'badge-emerald' : 
                          cand.status === 'Submitted - Pending HR Review' ? 'badge-amber ring-2 ring-amber-400 animate-pulse' :
                          cand.status === 'Corrections Requested' ? 'badge-rose' :
                          cand.status === 'In Verification' ? 'badge-cyan' : 'badge-slate'
                        }`}>
                          {cand.status === 'Submitted - Pending HR Review' ? '⚡ Pending HR Review' : cand.status}
                        </span>
                      </td>

                      {/* ⏳ 60-Day Certificate Lifecycle Column */}
                      <td className="py-4 px-4 text-center">
                        {lc.isVerified ? (
                          <div className="space-y-1 inline-block text-left">
                            <span className={`badge text-[9px] py-0.5 px-2 font-black ${lc.badgeColor}`}>
                              {lc.badgeLabel}
                            </span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                style={{ width: `${lc.progressPercent}%` }} 
                                className={`h-full rounded-full ${lc.isExpired || lc.status === 'critical' ? 'bg-rose-500' : lc.isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              />
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono block">Expires: {lc.expiryDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Pending Verification</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          
                          {/* 0. HR Review & Approval Button (for Submitted Profiles) */}
                          {cand.status === 'Submitted - Pending HR Review' && (
                            <button
                              onClick={() => {
                                setReviewingCandidate(cand);
                                setShowCorrectionInput(false);
                                setCorrectionNotes('');
                              }}
                              className="btn btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1 font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md animate-bounce"
                              title="Review candidate-submitted form particulars & uploaded documents to Accept or Resend for corrections"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Review & Approve</span>
                            </button>
                          )}

                          {/* 1. 360° Multi-API BGV Dossier Button */}
                          <button
                            data-tour-step={index === 0 ? 'hr-bgv-dossier-btn' : undefined}
                            onClick={() => setViewingBgvReportCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-purple-900 bg-purple-50 border-purple-200 hover:bg-purple-100 shadow-2xs"
                            title="View & Download Complete 360° Background Verification Dossier (10+ APIs)"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                            <span>360° BGV Dossier (10+ APIs)</span>
                          </button>

                          {/* 2. Employee Profile PDF Button */}
                          <button
                            onClick={() => setViewingDossierCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-sky-800 bg-sky-50 border-sky-200 hover:bg-sky-100"
                            title="View & Download Comprehensive Employee Profile Dossier"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-700" />
                            <span>Profile PDF</span>
                          </button>

                          {/* 3. Uploaded Original Documents Inspection Button */}
                          <button
                            onClick={() => setViewingUploadedDocsCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-emerald-900 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                            title="Inspect all uploaded original documents (Aadhaar, PAN, Cheque, Degree, Relieving, NDA)"
                          >
                            <FolderDown className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Docs (8)</span>
                          </button>

                          {/* 4. Official JOY Corporate Certificate PDF Button */}
                          <button
                            onClick={() => setViewingCertificateCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-indigo-800 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                            title="View & Download JOY Corporate Solutions Official Certificate"
                          >
                            <Award className="w-3.5 h-3.5 text-indigo-700" />
                            <span>JOY Certificate</span>
                          </button>

                          {/* 5. Dispatch Link Trigger */}
                          <button
                            data-tour-step={index === 0 ? 'hr-dispatch-btn' : undefined}
                            onClick={() => setDispatchingCandidate(cand)}
                            className="btn btn-hrexecutive text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold shadow-sm"
                            title="Dispatch via WhatsApp, SMS, Email, QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Dispatch Link 📲</span>
                          </button>

                          {/* 4. Test Employee Link Portal */}
                          <button
                            onClick={() => setRoleView('employee_link', cand.token)}
                            className="btn btn-company text-[11px] py-1.5 px-2 flex items-center gap-1"
                            title="Test verification link from candidate perspective"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Test Portal</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE PROFILER & JOINING FORM TEMPLATES */}
      {(activeTab === 'profiler' || showAddForm) && (
        <div className="glass-panel p-4 sm:p-6 border-emerald-200 bg-white space-y-6 rounded-2xl shadow-sm animate-tab-switch">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="badge badge-emerald text-[10px] mb-1">Candidate Profiler</span>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>Create Comprehensive Employee Profile & Dispatch Verification Link</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Fill in employee information manually or click Auto-Fill Mock Profile for instant 1-click testing</p>
            </div>

            {/* ⚡ Instant 1-Click Mock Auto-Fill Button */}
            <button
              type="button"
              onClick={handleAutoFillMockData}
              className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-extrabold text-amber-900 bg-amber-50 border-amber-300 hover:bg-amber-100 shadow-sm self-start sm:self-auto"
            >
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>⚡ Auto-Fill Demo Profile (1-Click Test)</span>
            </button>
          </div>

          {/* ⚡ ONBOARDING WORKFLOW SELECTION: HR FILL vs CANDIDATE LINK FILL */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Onboarding Form Filling Authority & Workflow Mode</span>
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase">
                {onboardingMode === 'hr_filled' ? 'Fast-Track HR Mode' : 'Candidate Self-Service Mode'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Option A: HR Pre-Fills Details */}
              <div 
                onClick={() => setOnboardingMode('hr_filled')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  onboardingMode === 'hr_filled'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="onboardingMode" 
                  checked={onboardingMode === 'hr_filled'} 
                  onChange={() => setOnboardingMode('hr_filled')}
                  className="accent-emerald-600 mt-1 w-4 h-4"
                />
                <div>
                  <strong className="text-slate-900 text-xs block font-extrabold">Option 1: HR Pre-fills All Form Particulars (Fast-Track)</strong>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    HR enters academic, banking, and address fields immediately. The candidate receives a magic verification link solely to authorize OTP and perform 3D face biometric liveness.
                  </p>
                </div>
              </div>

              {/* Option B: Candidate Fills on Magic Link */}
              <div 
                onClick={() => setOnboardingMode('candidate_filled')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  onboardingMode === 'candidate_filled'
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="onboardingMode" 
                  checked={onboardingMode === 'candidate_filled'} 
                  onChange={() => setOnboardingMode('candidate_filled')}
                  className="accent-indigo-600 mt-1 w-4 h-4"
                />
                <div>
                  <strong className="text-slate-900 text-xs block font-extrabold">Option 2: Candidate Self-Service via Magic Link (Recommended)</strong>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    HR configures the mandatory document checklist & statutory agreements. The candidate fills their own details, uploads original document copies, and executes digital sign-off.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 💬 CUSTOM HR MESSAGE & INSTRUCTIONS FOR CANDIDATE */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <span className="text-base">💬</span>
                <span>Custom HR Message & Instructions for Candidate (Displayed on Link & Joining Form)</span>
              </label>
              <span className="text-[10px] text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200">
                Visible to Candidate
              </span>
            </div>

            <textarea
              rows="2"
              value={formData.hrCustomMessage}
              onChange={(e) => setFormData({ ...formData, hrCustomMessage: e.target.value })}
              placeholder="e.g. Welcome to JOY CORPORATE SOLUTIONS PRIVATE LIMITED! Please fill all form sections, upload your educational & KYC documents, and complete your verification by Friday."
              className="form-input text-xs font-medium bg-white"
            />

            {/* Quick Preset Message Buttons */}
            <div className="flex items-center gap-2 flex-wrap text-[10px]">
              <span className="font-bold text-slate-500">Quick Templates:</span>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  hrCustomMessage: 'Welcome to JOY CORPORATE SOLUTIONS PRIVATE LIMITED! Please complete all 9 profile sections, upload your original KYC & academic certificates, and execute the statutory declarations by Friday.'
                })}
                className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-800 font-bold hover:bg-indigo-100 cursor-pointer"
              >
                ✨ Standard Welcome
              </button>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  hrCustomMessage: '⚠️ Urgent: High Priority Onboarding. Please complete your identity checks and document uploads within the next 24 hours.'
                })}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 cursor-pointer"
              >
                ⚡ Urgent 24-Hour
              </button>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  hrCustomMessage: 'Welcome to the Industrial Manufacturing Division. Please ensure your Trade/ITI certificates and safety compliance declarations are submitted.'
                })}
                className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold hover:bg-emerald-100 cursor-pointer"
              >
                🏭 Plant / Field Staff
              </button>
            </div>
          </div>

          {/* 🌟 7-INDUSTRY VERTICAL & ROLE ARCHETYPE SELECTOR */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>1. Select Industry Vertical & Specialized Role Archetype</span>
                </label>
                <p className="text-[11px] text-slate-500 font-medium">
                  Dynamically configures industry-specific operational fields, labor statutory forms & mandatory background verifications.
                </p>
              </div>

              {/* ⚡ Quick 1-Click Multi-Industry Auto-Fill Presets Bar */}
              <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto text-[10px]">
                <span className="font-bold text-slate-500">Quick Demos:</span>
                <button type="button" onClick={() => handleAutoFillMockData('it_tech')} className="px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold border border-purple-200 cursor-pointer">💻 IT / Tech</button>
                <button type="button" onClick={() => handleAutoFillMockData('manufacturing')} className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 cursor-pointer">🏭 Plant</button>
                <button type="button" onClick={() => handleAutoFillMockData('bfsi')} className="px-2 py-1 rounded-md bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold border border-cyan-200 cursor-pointer">🏦 BFSI</button>
                <button type="button" onClick={() => handleAutoFillMockData('healthcare')} className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold border border-rose-200 cursor-pointer">🏥 Health</button>
                <button type="button" onClick={() => handleAutoFillMockData('logistics')} className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 cursor-pointer">🚚 Fleet</button>
                <button type="button" onClick={() => handleAutoFillMockData('retail_hospitality')} className="px-2 py-1 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-900 font-bold border border-orange-200 cursor-pointer">🛍️ Retail</button>
                <button type="button" onClick={() => handleAutoFillMockData('contractual')} className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 cursor-pointer">🏗️ Contract</button>
              </div>
            </div>

            {/* 7 Industry Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2.5 text-xs">
              {[
                { id: 'it_tech', name: 'IT & Software', icon: '💻', tag: 'IP & Code', color: 'purple', desc: 'Developers, Cloud & AI. Covers GitHub, WFH Asset Tags & NDA.' },
                { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', tag: 'Safety & Shift', color: 'emerald', desc: 'Plant & Assembly. Covers Shift Roster, PPE Gear & Medical Cert.' },
                { id: 'bfsi', name: 'BFSI & Fintech', icon: '🏦', tag: 'CIBIL & AML', color: 'cyan', desc: 'Credit & Risk. Covers CIBIL Consent, AML, NISM & Fidelity Bond.' },
                { id: 'healthcare', name: 'Healthcare', icon: '🏥', tag: 'Council & GMP', color: 'rose', desc: 'Doctors & Nurses. Covers MCI/Nursing Reg, Vaccines & Cleanroom.' },
                { id: 'logistics', name: 'Logistics & Fleet', icon: '🚚', tag: 'DL & GPS', color: 'amber', desc: 'Transport Drivers. Covers HMV Badge, GPS Consent & Police NOC.' },
                { id: 'retail_hospitality', name: 'Retail & F&B', icon: '🛍️', tag: 'FSSAI & Cash', color: 'orange', desc: 'Store & Hotel Staff. Covers FSSAI, Uniforms & POS Cash Agreement.' },
                { id: 'contractual', name: 'Contract Staff', icon: '🏗️', tag: 'Form XIII', color: 'slate', desc: 'Facility & Security. Covers Form XIII, Contractor License & ESIC.' }
              ].map((ind) => {
                const isSelected = (formData.employeeCategory || 'it_tech') === ind.id;
                return (
                  <div
                    key={ind.id}
                    onClick={() => applyEmployeeCategory(ind.id)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{ind.icon}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {ind.tag}
                      </span>
                    </div>
                    <div>
                      <strong className="text-slate-900 font-extrabold text-xs block leading-tight">{ind.name}</strong>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{ind.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleCreateCandidateSubmit} className="space-y-6 pt-3 border-t border-slate-100">
            
            {/* 🔐 PORTAL UNLOCK PASSWORD / SECURITY PIN GATE */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 border-2 border-indigo-200 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Portal Unlock Passcode / Security PIN (Set by HR)
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Candidate must enter this exact passcode to unlock their verification portal via QR Code or Link
                    </p>
                  </div>
                </div>
                <span className="badge badge-indigo text-[10px] font-black self-start sm:self-auto">
                  Access Security Gate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Passcode / PIN Code *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 1234 or Joy@2026"
                    value={formData.portalPassword}
                    onChange={(e) => setFormData({ ...formData, portalPassword: e.target.value })}
                    className="form-input font-mono font-black text-sm text-indigo-900 bg-white tracking-wider"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
                      setFormData({ ...formData, portalPassword: randomPin });
                      showToast(`🎲 Generated random 4-digit PIN: ${randomPin}`);
                    }}
                    className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-extrabold text-indigo-900 bg-white border-indigo-200 hover:bg-indigo-50 shadow-xs cursor-pointer btn-interactive"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>🎲 Generate Random PIN</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, portalPassword: '1234' });
                      showToast('⚡ Reset to default PIN: 1234');
                    }}
                    className="btn btn-secondary text-xs py-2 px-2.5 font-bold text-slate-600 bg-white border-slate-200 hover:bg-slate-50 cursor-pointer"
                    title="Reset to 1234"
                  >
                    Default (1234)
                  </button>
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-indigo-100 font-medium">
                  <span className="font-bold text-indigo-900 block mb-0.5">🔒 Passcode Protection:</span>
                  Prevents unauthorized link access. Displayed on candidate card and in QR modal.
                </div>
              </div>
            </div>

            {/* 🎯 SMART REAL-TIME VERIFICATION & DATA-FETCHING READINESS DIAGNOSTICS HUD */}
            <div className="p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl shadow-md border border-indigo-500/30 space-y-3.5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600/80 rounded-xl text-white shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">
                        Smart Verification & Data-Fetching Readiness Engine
                      </h4>
                      <span className="text-[9px] bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                        Live Dependency Diagnostics
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium">
                      Evaluates mandatory prerequisite fields in real-time. Highlights what can be verified immediately vs what the candidate will fill.
                    </p>
                  </div>
                </div>

                {/* Completion Metric */}
                <div className="flex items-center gap-2.5 self-start sm:self-auto bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">Readiness Score</span>
                    <span className="text-xs font-black text-emerald-400 font-mono">
                      {readiness.readyChecks.length} / {readiness.totalChecks} Checks Ready ({readiness.completionScore}%)
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-black text-xs text-white">
                    {readiness.completionScore}%
                  </div>
                </div>
              </div>

              {/* Split: Ready Checks (Green) & Missing Dependencies (Amber) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Box 1: Ready to Verify & Fetch Upstream Data Now */}
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-emerald-300 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Ready to Verify & Fetch Data ({readiness.readyChecks.length})</span>
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded font-bold">
                      All Inputs Present ✓
                    </span>
                  </div>

                  {readiness.readyChecks.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No verification checks fully satisfied yet. Fill candidate details below.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {readiness.readyChecks.map(check => (
                        <div key={check.id} className="p-1.5 px-2 bg-emerald-900/60 border border-emerald-500/50 rounded-lg flex items-center gap-1.5 text-[11px]">
                          <span>{check.icon}</span>
                          <strong className="text-white font-bold">{check.shortName}</strong>
                          <span className="text-emerald-300 text-[10px]">✓</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-emerald-200/80 leading-snug">
                    💡 These upstream API checks have all mandatory parameters and can be executed synchronously or verified upon link creation.
                  </p>
                </div>

                {/* Box 2: Missing Fields to Unlock Upstream Verification */}
                <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-300 flex items-center gap-1.5 text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span>Pending Requirements ({readiness.pendingChecks.length})</span>
                    </span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1.5 py-0.5 rounded font-bold">
                      Needs Missing Fields
                    </span>
                  </div>

                  {readiness.pendingChecks.length === 0 ? (
                    <p className="text-[11px] text-emerald-300 font-bold">🎉 All 9 Core Verification checks have prerequisite data populated!</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {readiness.pendingChecks.map(check => (
                        <div key={check.id} className="p-1.5 px-2 bg-slate-900/80 border border-amber-500/30 rounded-lg text-[11px] space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-200 flex items-center gap-1">
                              <span>{check.icon}</span>
                              <span>{check.name}</span>
                            </span>
                            <span className="text-[9px] text-slate-400">Section: {check.requiredFields[0]?.section}</span>
                          </div>
                          <div className="text-[10px] text-slate-300 flex items-center gap-1 flex-wrap">
                            <span className="text-amber-400 font-medium">To verify, fill:</span>
                            {check.missingFields.map((f, i) => (
                              <span key={i} className="px-1.5 py-0.2 bg-amber-500/20 text-amber-200 border border-amber-400/40 rounded text-[9px] font-bold">
                                {f.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-amber-200/80 leading-snug">
                    📱 Any fields left unentered by HR will be highlighted with amber badges for the candidate to fill on their Magic Link.
                  </p>
                </div>
              </div>

              {/* Visual Field Ownership Legend */}
              <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-[10px] flex-wrap gap-2">
                <span className="text-slate-400 font-bold">🎨 Form Field Ownership Demarcation:</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <strong className="text-slate-200">Filled by HR 🏢 (Pre-filled for Candidate)</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <strong className="text-amber-300">To be filled by Candidate 📱 (Required via Link)</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 1: Personal & Demographic Particulars */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>1. Personal, Demographic & Application Form Particulars</span>
              </h4>
              
              {/* Row 1: Names & Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Candidate Full Name', 'name', true)}
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={getFieldInputClass('name', 'form-input font-bold')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Employee Code / ID', 'empId')}
                  <input 
                    type="text" 
                    placeholder="e.g. EMP-2026-99"
                    value={formData.empId}
                    onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                    className={getFieldInputClass('empId', 'form-input font-mono font-bold')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Employee Number (Payroll)', 'employeeNumber')}
                  <input 
                    type="text" 
                    placeholder="e.g. EN-884912"
                    value={formData.employeeNumber}
                    onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                    className={getFieldInputClass('employeeNumber', 'form-input font-mono')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Date of Joining (DOJ)', 'doj')}
                  <input 
                    type="date" 
                    value={formData.doj}
                    onChange={(e) => setFormData({ ...formData, doj: e.target.value })}
                    className={getFieldInputClass('doj')}
                  />
                </div>
              </div>

              {/* Row 2: Parents & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  {renderFieldLabel("Father's Name", 'fatherName')}
                  <input 
                    type="text" 
                    placeholder="e.g. Suresh Chandra"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className={getFieldInputClass('fatherName')}
                  />
                </div>
                <div>
                  {renderFieldLabel("Mother's Name", 'motherName')}
                  <input 
                    type="text" 
                    placeholder="e.g. Kavitha Chandra"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className={getFieldInputClass('motherName')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Date of Birth (DOB)', 'dob')}
                  <input 
                    type="date" 
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className={getFieldInputClass('dob')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Age (Years)', 'age')}
                  <input 
                    type="number" 
                    placeholder="e.g. 28"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className={getFieldInputClass('age', 'form-input font-bold')}
                  />
                </div>
              </div>

              {/* Row 3: Gender, Marital, Blood Group, Mother Language */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Gender', 'gender')}
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className={getFieldInputClass('gender', 'form-select font-medium')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Status Married / Unmarried', 'maritalStatus')}
                  <select 
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className={getFieldInputClass('maritalStatus', 'form-select font-medium')}
                  >
                    <option value="Single">Single / Unmarried</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Blood Group', 'bloodGroup')}
                  <select 
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className={getFieldInputClass('bloodGroup', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.bloodGroups || ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']).map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Mother Language (Mother Tongue)', 'motherTongue')}
                  <input 
                    type="text" 
                    placeholder="e.g. Tamil, Hindi, Telugu"
                    value={formData.motherTongue}
                    onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value })}
                    className={getFieldInputClass('motherTongue')}
                  />
                </div>
              </div>

              {/* Row 4: Religion, Caste, Category, Identification Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Religion', 'religion')}
                  <select 
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className={getFieldInputClass('religion', 'form-select font-medium')}
                  >
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Caste', 'caste')}
                  <input 
                    type="text" 
                    placeholder="Optional Caste"
                    value={formData.caste}
                    onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                    className={getFieldInputClass('caste')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Category', 'category')}
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={getFieldInputClass('category', 'form-select font-bold')}
                  >
                    <option value="General">General (OC)</option>
                    <option value="OBC">OBC (BC / MBC)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker)</option>
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Physical Identification Marks', 'identificationMarks')}
                  <input 
                    type="text" 
                    placeholder="e.g. Mole on right collar bone"
                    value={formData.identificationMarks}
                    onChange={(e) => setFormData({ ...formData, identificationMarks: e.target.value })}
                    className={getFieldInputClass('identificationMarks')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Spouse Name (if married)', 'spouseName')}
                  <input 
                    type="text" 
                    placeholder="e.g. Sunita Chandra"
                    value={formData.spouseName}
                    onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                    className={getFieldInputClass('spouseName')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Languages Known (Master)', 'languagesKnown')}
                  <select 
                    value={formData.languagesKnown}
                    onChange={(e) => setFormData({ ...formData, languagesKnown: e.target.value })}
                    className={getFieldInputClass('languagesKnown', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.languages || ['English (Fluent)', 'Hindi (National)', 'Tamil (Regional)', 'Telugu (Regional)']).map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Self Interest / Activities (Master)', 'selfInterests')}
                  <select 
                    value={formData.selfInterests}
                    onChange={(e) => setFormData({ ...formData, selfInterests: e.target.value })}
                    className={getFieldInputClass('selfInterests', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.selfInterests || ['Coding & Open Source Development', 'Cricket & Team Athletics', 'Reading, Law & Financial Research']).map(interest => (
                      <option key={interest} value={interest}>{interest}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: Contact & Residential Addresses */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>2. Residential Address & Contact Coordinates</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Primary Mobile (WhatsApp/SMS)', 'mobile', true)}
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className={getFieldInputClass('mobile', 'form-input font-bold')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Alternate Phone / Emergency', 'alternateMobile')}
                  <input 
                    type="tel" 
                    placeholder="+91 98111 22334"
                    value={formData.alternateMobile}
                    onChange={(e) => setFormData({ ...formData, alternateMobile: e.target.value })}
                    className={getFieldInputClass('alternateMobile')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Official / Personal Email', 'email', true)}
                  <input 
                    type="email" 
                    required
                    placeholder="candidate@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={getFieldInputClass('email')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Aadhaar Identity Number', 'aadhaarNo', true)}
                  <input 
                    type="text" 
                    required
                    maxLength="14"
                    placeholder="XXXX XXXX XXXX"
                    value={formData.aadhaarNo}
                    onChange={(e) => setFormData({ ...formData, aadhaarNo: e.target.value })}
                    className={getFieldInputClass('aadhaarNo', 'form-input font-mono font-bold')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-emerald-50/40 p-3 rounded-xl border border-emerald-200/60 mb-3">
                <div>
                  {renderFieldLabel('Native Hometown State', 'nativeState')}
                  <input 
                    type="text" 
                    placeholder="e.g. Tamil Nadu"
                    value={formData.nativeState}
                    onChange={(e) => setFormData({ ...formData, nativeState: e.target.value })}
                    className={getFieldInputClass('nativeState', 'form-input font-bold')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Native Hometown District', 'nativeDistrict')}
                  <input 
                    type="text" 
                    placeholder="e.g. Madurai"
                    value={formData.nativeDistrict}
                    onChange={(e) => setFormData({ ...formData, nativeDistrict: e.target.value })}
                    className={getFieldInputClass('nativeDistrict', 'form-input font-bold')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  {renderFieldLabel('State (Master)', 'state')}
                  <select 
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className={getFieldInputClass('state', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.states || ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi NCR']).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderFieldLabel('City (Master)', 'city')}
                  <select 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={getFieldInputClass('city', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.cities || ['Bengaluru', 'Chennai', 'Mumbai', 'New Delhi']).map(ct => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Area / Locality (Master)', 'area')}
                  <select 
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className={getFieldInputClass('area', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.areas || ['Koramangala 4th Block, Bengaluru', 'Whitefield Tech Corridor, Bengaluru', 'Guindy Industrial Estate, Chennai']).map(ar => (
                      <option key={ar} value={ar}>{ar}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderFieldLabel('PIN / Postal Code', 'pincode')}
                  <input 
                    type="text" 
                    placeholder="560103"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className={getFieldInputClass('pincode', 'form-input font-mono')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Present Residential Address', 'presentAddress')}
                  <textarea 
                    rows="2"
                    placeholder="Flat 402, Green Glen Layout, Bellandur, Bengaluru, KA - 560103"
                    value={formData.presentAddress}
                    onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                    className={getFieldInputClass('presentAddress')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Permanent Home Town Address', 'permanentAddress')}
                  <textarea 
                    rows="2"
                    placeholder="House No 45, MG Road, Civil Lines, Jaipur, RJ - 302001"
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    className={getFieldInputClass('permanentAddress')}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Academic Qualifications & Skills */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>3. Academic Qualifications & Specialized Skills Matrix</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Qualification Category (Master)', 'qualificationCategory')}
                  <select 
                    value={formData.qualificationCategory}
                    onChange={(e) => setFormData({ ...formData, qualificationCategory: e.target.value })}
                    className={getFieldInputClass('qualificationCategory', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.qualificationCategories || ['Under Graduate (UG / Bachelor Degree)', 'Post Graduate (PG / Master Degree)', 'Polytechnic Diploma', 'Vocational / ITI Trade Certificate']).map(qc => (
                      <option key={qc} value={qc}>{qc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Highest Degree / Diploma (Master)', 'highestQualification')}
                  <select 
                    value={formData.highestQualification}
                    onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                    className={getFieldInputClass('highestQualification', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.qualifications || ['B.Tech / B.E. in Computer Science', 'MBA in HR & Operations', 'Diploma in Mechanical Engineering', 'MBBS / Medical Degree']).map(deg => (
                      <option key={deg} value={deg}>{deg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Primary Skill / Core Specialization', 'primarySkill')}
                  <input 
                    type="text"
                    placeholder="e.g. React JS, Python, Robotic Welding"
                    value={formData.primarySkill}
                    onChange={(e) => setFormData({ ...formData, primarySkill: e.target.value })}
                    className={getFieldInputClass('primarySkill', 'form-input font-bold')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Passing Year & Score (%)', 'passingYear')}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="2020"
                      value={formData.passingYear}
                      onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                      className={getFieldInputClass('passingYear', 'form-input w-24 font-mono')}
                    />
                    <input 
                      type="text" 
                      placeholder="84.5%"
                      value={formData.percentage}
                      onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                      className={getFieldInputClass('percentage', 'form-input flex-1 font-mono')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Employment History & References */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>4. Employment Position, Job Category & Work Role</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Job Category (Master)', 'jobCategory')}
                  <select 
                    value={formData.jobCategory}
                    onChange={(e) => setFormData({ ...formData, jobCategory: e.target.value })}
                    className={getFieldInputClass('jobCategory', 'form-select font-medium')}
                  >
                    {(masterDropdownOptions?.jobCategories || ['Information Technology & Software Services', 'Manufacturing & Heavy Industrial Engineering', 'Banking, Financial Services & Insurance (BFSI)', 'Logistics, Warehousing & Fleet Operations']).map(jc => (
                      <option key={jc} value={jc}>{jc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Job Employment Type', 'jobType')}
                  <select 
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    className={getFieldInputClass('jobType', 'form-select font-medium')}
                  >
                    <option value="Full Time Permanent">Full Time Permanent</option>
                    <option value="Contractual (Fixed Term 1-3 Yrs)">Contractual (Fixed Term 1-3 Yrs)</option>
                    <option value="Third-Party Payroll Staff">Third-Party Payroll Staff</option>
                    <option value="Consultant / Specialist">Consultant / Specialist</option>
                  </select>
                </div>
                <div>
                  {renderFieldLabel('Department', 'dept', true)}
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Engineering & Cloud Architecture"
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className={getFieldInputClass('dept')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Designation', 'designation', true)}
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className={getFieldInputClass('designation', 'form-input font-bold')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Work Location', 'workLocation')}
                  <input 
                    type="text" 
                    placeholder="e.g. Bengaluru Global Tech Hub (HQ)"
                    value={formData.workLocation}
                    onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                    className={getFieldInputClass('workLocation')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Previous Employer Name', 'previousEmployer')}
                  <input 
                    type="text" 
                    placeholder="e.g. Infosys Technologies Ltd"
                    value={formData.previousEmployer}
                    onChange={(e) => setFormData({ ...formData, previousEmployer: e.target.value })}
                    className={getFieldInputClass('previousEmployer')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Total Experience (Years)', 'experienceYears')}
                  <input 
                    type="text" 
                    placeholder="e.g. 4.5 Years"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className={getFieldInputClass('experienceYears', 'form-input font-mono')}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: Statutory IDs & Banking Settlement */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>5. Statutory Government IDs & Direct Salary Bank Settlement</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div>
                  {renderFieldLabel('PAN Card Number', 'panNo')}
                  <input 
                    type="text" 
                    placeholder="ABCDE1234F"
                    value={formData.panNo}
                    onChange={(e) => setFormData({ ...formData, panNo: e.target.value.toUpperCase() })}
                    className={getFieldInputClass('panNo', 'form-input font-mono')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Passport Number', 'passportNo')}
                  <input 
                    type="text" 
                    placeholder="J8912401"
                    value={formData.passportNo || ''}
                    onChange={(e) => setFormData({ ...formData, passportNo: e.target.value.toUpperCase() })}
                    className={getFieldInputClass('passportNo', 'form-input font-mono')}
                  />
                </div>
                <div>
                  {renderFieldLabel('EPFO UAN Number', 'uanEpf')}
                  <input 
                    type="text" 
                    placeholder="100982341209"
                    value={formData.uanEpf}
                    onChange={(e) => setFormData({ ...formData, uanEpf: e.target.value })}
                    className={getFieldInputClass('uanEpf', 'form-input font-mono')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Driving License (DL)', 'drivingLicense')}
                  <input 
                    type="text" 
                    placeholder="KA-01201900124"
                    value={formData.drivingLicense}
                    onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
                    className={getFieldInputClass('drivingLicense', 'form-input font-mono')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Bank Name', 'bankName')}
                  <input 
                    type="text" 
                    placeholder="HDFC Bank"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className={getFieldInputClass('bankName')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Bank Account No', 'bankAccountNo')}
                  <input 
                    type="text" 
                    placeholder="50100234129845"
                    value={formData.bankAccountNo}
                    onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                    className={getFieldInputClass('bankAccountNo', 'form-input font-mono')}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: Family Particulars & Gratuity / PF Nominees */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>6. Family Particulars & Gratuity / PF Nominees</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  {renderFieldLabel('Primary Nominee Full Name', 'nomineeName')}
                  <input 
                    type="text" 
                    placeholder="e.g. Sunita Ramanathan"
                    value={formData.nomineeName}
                    onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                    className={getFieldInputClass('nomineeName', 'form-input font-bold')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Nominee Relationship & Share', 'nomineeRelation')}
                  <input 
                    type="text" 
                    placeholder="e.g. Spouse (100% Gratuity & PF Share)"
                    value={formData.nomineeRelation}
                    onChange={(e) => setFormData({ ...formData, nomineeRelation: e.target.value })}
                    className={getFieldInputClass('nomineeRelation')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Mediclaim Dependents', 'insuranceDependents')}
                  <input 
                    type="text" 
                    placeholder="e.g. Spouse + 2 Children + Dependent Parents"
                    value={formData.insuranceDependents || 'Spouse + Dependent Parents'}
                    onChange={(e) => setFormData({ ...formData, insuranceDependents: e.target.value })}
                    className={getFieldInputClass('insuranceDependents')}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 7: ⭐ DYNAMIC INDUSTRY & ROLE SPECIALIZATION MATRIX */}
            <div className="p-4 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-50 border-2 border-indigo-200 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                      <span>7. Industry & Role Specialization Matrix:</span>
                      <span className="text-indigo-700 uppercase bg-white px-2 py-0.5 rounded border border-indigo-200 font-black">
                        {(formData.employeeCategory || 'it_tech').replace('_', ' ').toUpperCase()}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Operational compliance fields dynamically configured for the selected industry sector.
                    </p>
                  </div>
                </div>
                <span className="badge badge-indigo text-[10px] font-black self-start sm:self-auto">
                  Sector-Specific Compliance
                </span>
              </div>

              {/* Dynamic Field Rendering based on Industry Category */}
              {(formData.employeeCategory === 'it_tech' || !formData.employeeCategory) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">💻 Core Tech Stack & Frameworks</label>
                    <input 
                      type="text"
                      placeholder="React, Node.js, Python, PostgreSQL, AWS Lambda, Docker"
                      value={formData.industrySpecialization?.techStack || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, techStack: e.target.value } })}
                      className="form-input font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🔗 GitHub / Portfolio Profile</label>
                    <input 
                      type="url"
                      placeholder="https://github.com/developer-name"
                      value={formData.industrySpecialization?.githubUrl || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, githubUrl: e.target.value } })}
                      className="form-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🖥️ Laptop Asset Provisioning Tag</label>
                    <input 
                      type="text"
                      placeholder="JOY-ASSET-LT-2026-088 (MacBook Pro M3 Max)"
                      value={formData.industrySpecialization?.laptopAssetTag || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, laptopAssetTag: e.target.value } })}
                      className="form-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🛡️ Anti-Moonlighting & Exclusivity</label>
                    <input 
                      type="text"
                      placeholder="No Dual Employment / 100% Exclusive Commitment"
                      value={formData.industrySpecialization?.dualEmploymentDisclosure || 'No Dual Employment / 100% Exclusive Commitment'}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, dualEmploymentDisclosure: e.target.value } })}
                      className="form-input text-emerald-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">📦 Open Source Contribution Policy</label>
                    <input 
                      type="text"
                      placeholder="Personal open source contributions under MIT License"
                      value={formData.industrySpecialization?.openSourceDisclosure || 'Personal open source contributions under MIT License'}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, openSourceDisclosure: e.target.value } })}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {formData.employeeCategory === 'manufacturing' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🏭 Plant & Shop-Floor Unit</label>
                    <input 
                      type="text"
                      placeholder="Chennai Automotive Plant - Unit 3 Chassis Line"
                      value={formData.industrySpecialization?.plantLocation || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, plantLocation: e.target.value } })}
                      className="form-input font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">⏰ Shift Duty Roster</label>
                    <input 
                      type="text"
                      placeholder="Shift A (06:00 AM - 02:30 PM Rotational)"
                      value={formData.industrySpecialization?.shiftRoster || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, shiftRoster: e.target.value } })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🥾 Safety Shoe Size & Hardhat</label>
                    <input 
                      type="text"
                      placeholder="UK 9 / EUR 43 (Steel Toe) • Yellow Hardhat"
                      value={formData.industrySpecialization?.safetyShoeSize || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, safetyShoeSize: e.target.value } })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🏥 Occupational Health Fitness Cert</label>
                    <input 
                      type="text"
                      placeholder="MED-FIT-CHN-2026-912 (Cleared Grade A)"
                      value={formData.industrySpecialization?.occupationalHealthCertNo || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, occupationalHealthCertNo: e.target.value } })}
                      className="form-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🪪 Factory Gate Pass ID</label>
                    <input 
                      type="text"
                      placeholder="GATE-PASS-PL3-8812"
                      value={formData.industrySpecialization?.gatePassId || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, gatePassId: e.target.value } })}
                      className="form-input font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">⚠️ Heavy Machinery & Hazard Training</label>
                    <input 
                      type="text"
                      placeholder="Certified - Arc Welding & Robotic Cell Safety"
                      value={formData.industrySpecialization?.hazardTrainingDate || 'Certified - Arc Welding & Robotic Cell Safety'}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, hazardTrainingDate: e.target.value } })}
                      className="form-input text-emerald-800 font-bold"
                    />
                  </div>
                </div>
              )}

              {formData.employeeCategory === 'bfsi' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">📊 CIBIL Credit Standing Range</label>
                    <input 
                      type="text"
                      placeholder="795 - 830 (Prime Credit Standing)"
                      value={formData.industrySpecialization?.cibilScoreRange || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, cibilScoreRange: e.target.value } })}
                      className="form-input font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">📜 NISM / IRDA Certifications</label>
                    <input 
                      type="text"
                      placeholder="NISM Series VIII Equity Derivatives, IRDA Composite Broker"
                      value={formData.industrySpecialization?.certificationsBfsi || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, certificationsBfsi: e.target.value } })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🛡️ Corporate Fidelity Bond Limit</label>
                    <input 
                      type="text"
                      placeholder="₹15,00,000 (Fifteen Lakhs Indemnity)"
                      value={formData.industrySpecialization?.fidelityBondLimit || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, fidelityBondLimit: e.target.value } })}
                      className="form-input font-bold text-indigo-900"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1">⚖️ SEBI Insider Trading & Anti-Money Laundering (AML) Undertaking</label>
                    <input 
                      type="text"
                      placeholder="Cleared - Zero SEBI Adverse Flags • Zero Personal Trading in Client Scrips"
                      value={formData.industrySpecialization?.sebiInsiderTradingClearance || 'Cleared - Zero SEBI Adverse Flags'}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, sebiInsiderTradingClearance: e.target.value } })}
                      className="form-input text-emerald-800 font-bold"
                    />
                  </div>
                </div>
              )}

              {formData.employeeCategory === 'healthcare' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🩺 Medical / Nursing Council Reg No</label>
                    <input 
                      type="text"
                      placeholder="MCI-2017-089412 (Valid till 2027)"
                      value={formData.industrySpecialization?.medicalCouncilRegNo || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, medicalCouncilRegNo: e.target.value } })}
                      className="form-input font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🏥 Assigned Ward / ICU Department</label>
                    <input 
                      type="text"
                      placeholder="Intensive Care Unit (ICU) & Trauma Emergency"
                      value={formData.industrySpecialization?.departmentWard || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, departmentWard: e.target.value } })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">💉 Mandatory Immunization History</label>
                    <input 
                      type="text"
                      placeholder="Hepatitis B (3 Doses Complete), Tetanus Toxoid 2026"
                      value={formData.industrySpecialization?.immunizationStatus || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, immunizationStatus: e.target.value } })}
                      className="form-input text-emerald-800 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1">🧫 Sterile Bio-Safety Class 100 GMP & Life Support Protocol</label>
                    <input 
                      type="text"
                      placeholder="AHA Certified ACLS / BLS (Valid till Nov 2027) • Sterile Room Cleanroom Standards Compliant"
                      value={formData.industrySpecialization?.gmpCleanroomProtocol || 'AHA Certified ACLS / BLS'}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, gmpCleanroomProtocol: e.target.value } })}
                      className="form-input text-indigo-900 font-bold"
                    />
                  </div>
                </div>
              )}

              {formData.employeeCategory === 'logistics' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🚚 Commercial Transport DL Badge No</label>
                    <input 
                      type="text"
                      placeholder="TN-01-TR-2018-98412 (Exp: 2029)"
                      value={formData.industrySpecialization?.commercialDlBadgeNo || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, commercialDlBadgeNo: e.target.value } })}
                      className="form-input font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🚜 Forklift / MHE Equipment License</label>
                    <input 
                      type="text"
                      placeholder="MHE-FL-TN-2022-881 (Forklift Operator)"
                      value={formData.industrySpecialization?.forkliftLicenseNo || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, forkliftLicenseNo: e.target.value } })}
                      className="form-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">👮 Police Character NOC Number</label>
                    <input 
                      type="text"
                      placeholder="POL-TN-CHN-2026-9041 (Cleared)"
                      value={formData.industrySpecialization?.policeNocNumber || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, policeNocNumber: e.target.value } })}
                      className="form-input font-mono text-emerald-800 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1">🗺️ Interstate Route Experience & Telematics GPS Tracking Consent</label>
                    <input 
                      type="text"
                      placeholder="Interstate Heavy Haulage (NH44/NH48 Expressways) • 24/7 Vehicle GPS Tracking Consented"
                      value={formData.industrySpecialization?.routeExperience || 'Interstate Heavy Haulage'}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, routeExperience: e.target.value } })}
                      className="form-input text-indigo-900 font-bold"
                    />
                  </div>
                </div>
              )}

              {formData.employeeCategory === 'retail_hospitality' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🥗 FSSAI Food Safety Training Cert No</label>
                    <input 
                      type="text"
                      placeholder="FSSAI-FOSTAC-2025-9921"
                      value={formData.industrySpecialization?.fssaiCertNo || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, fssaiCertNo: e.target.value } })}
                      className="form-input font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">👕 Uniform Sizing (Shirt / Waist)</label>
                    <input 
                      type="text"
                      placeholder="M (38 cm Shirt) • 30 Waist Pants"
                      value={formData.industrySpecialization?.uniformShirtSize || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, uniformShirtSize: e.target.value } })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🏪 Assigned Retail Store Code</label>
                    <input 
                      type="text"
                      placeholder="RET-BLR-PHOENIX-04"
                      value={formData.industrySpecialization?.assignedStoreCode || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, assignedStoreCode: e.target.value } })}
                      className="form-input font-mono font-bold"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1">💳 POS Cash Register & Weekend Peak Shifts Availability</label>
                    <input 
                      type="text"
                      placeholder="Agreed to POS Cash Reconciliation • Weekend Peak Rotation Shifts Available"
                      value={formData.industrySpecialization?.storeShiftPreference || 'Weekend Peak Shifts Available'}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, storeShiftPreference: e.target.value } })}
                      className="form-input text-emerald-800 font-bold"
                    />
                  </div>
                </div>
              )}

              {formData.employeeCategory === 'contractual' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">📜 Contract Labor Act Form XIII No</label>
                    <input 
                      type="text"
                      placeholder="CL-RA-2026-FORM-XIII-912"
                      value={formData.industrySpecialization?.contractFormXIIIEnrollmentNo || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, contractFormXIIIEnrollmentNo: e.target.value } })}
                      className="form-input font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">🏢 Manpower Contractor Agency Name</label>
                    <input 
                      type="text"
                      placeholder="First Choice Manpower & Facility Solutions Pvt Ltd"
                      value={formData.industrySpecialization?.contractorAgencyName || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, contractorAgencyName: e.target.value } })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">📄 Principal Employer PO / Work Order</label>
                    <input 
                      type="text"
                      placeholder="PO-JOY-2026-CW-410"
                      value={formData.industrySpecialization?.workOrderPoNumber || ''}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, workOrderPoNumber: e.target.value } })}
                      className="form-input font-mono"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-slate-700 font-bold mb-1">💰 Wage Rate Classification & Tenure</label>
                    <input 
                      type="text"
                      placeholder="Skilled Grade Rate (₹950/Day + ESIC & PF) • Tenure: 12 Months Renewable"
                      value={formData.industrySpecialization?.wageRateClassification || 'Skilled Grade Rate'}
                      onChange={(e) => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, wageRateClassification: e.target.value } })}
                      className="form-input text-emerald-800 font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 📁 SECTION 8: COMPREHENSIVE EMPLOYEE DOCUMENT UPLOADS (UNIVERSAL KYC + SECTOR SPECIALIZED) */}
            <div className="p-4 bg-gradient-to-br from-sky-50/70 via-slate-50 to-indigo-50/50 border-2 border-sky-200 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-600 text-white rounded-xl shadow-xs">
                    <FolderDown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider">
                        8. Employee Document Uploads & Verification Attachments
                      </h4>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2 py-0.5 rounded-md border border-sky-200">
                        {Object.keys(formData.uploadedDocuments || {}).length} Total Documents Attached
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Upload candidate documents before generating verification token. Covers universal standard KYC for all employees + specialized documents for {formData.employeeCategory?.replace('_', ' ').toUpperCase() || 'IT'}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto text-[10px]">
                  <span className="bg-white border border-sky-200 text-sky-900 font-bold px-2.5 py-1 rounded-lg">
                    ⚡ PDF, PNG, JPG up to 10MB
                  </span>
                </div>
              </div>

              {/* 🌟 SUB-SECTION A: UNIVERSAL CORE DOCUMENTS (MANDATORY FOR ALL EMPLOYEES) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>A. Standard KYC & Employment Documents (Common for All Employees)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Standard Across All Sectors
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: 'aadhaar', title: 'Aadhaar Card (Front & Back)', icon: '🪪', type: 'aadhaar', desc: 'UIDAI official e-Aadhaar or scanned copy' },
                    { key: 'pan', title: 'Income Tax PAN Card', icon: '💳', type: 'pan', desc: 'NSDL / UTI permanent account card copy' },
                    { key: 'passportPhoto', title: 'Passport Size Photograph', icon: '📸', type: 'passport_photo', desc: 'Recent professional color portrait' },
                    { key: 'degree', title: 'Highest Degree / Marksheet', icon: '🎓', type: 'education_certificate', desc: 'Graduation / PG degree marksheet copy' },
                    { key: 'experience', title: 'Relieving & Service Certificate', icon: '📜', type: 'experience_letter', desc: 'Relieving / experience letter from previous employer' },
                    { key: 'salary', title: 'Last 3 Months Salary Slips', icon: '💰', type: 'salary_slips', desc: 'Recent payslips or Form 16 showing earnings' },
                    { key: 'bank', title: 'Bank Cancelled Cheque / Passbook', icon: '🏦', type: 'bank_proof', desc: 'Pre-printed cancelled cheque with IFSC & Account No' },
                    { key: 'resume', title: 'Updated Resume / CV', icon: '📄', type: 'resume', desc: 'Latest curriculum vitae of the candidate' },
                    { key: 'signedNda', title: 'Signed Employer NDA & Code', icon: '✍️', type: 'signed_contract', desc: 'Executed confidentiality & integrity agreement' },
                    { key: 'medicalCert', title: 'Medical Fitness Certificate', icon: '🏥', type: 'medical_fitness', desc: 'General medical fitness & health declaration' },
                    { key: 'passportDl', title: 'Passport / Driving License', icon: '🌐', type: 'id_proof', desc: 'Government photo passport or DL copy' }
                  ].map((doc) => {
                    const uploaded = (formData.uploadedDocuments || {})[doc.key];
                    return (
                      <div 
                        key={doc.key}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 ${
                          uploaded 
                            ? 'bg-emerald-50/80 border-emerald-400 shadow-2xs' 
                            : 'bg-white border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl shrink-0">{doc.icon}</span>
                            <div className="min-w-0">
                              <strong className="text-slate-900 font-extrabold text-xs block leading-tight truncate">{doc.title}</strong>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1">{doc.desc}</p>
                            </div>
                          </div>
                          {uploaded && (
                            <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded shrink-0">
                              Attached ✓
                            </span>
                          )}
                        </div>

                        {uploaded ? (
                          <div className="bg-white p-2 rounded-xl border border-emerald-200 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] font-bold text-emerald-950 truncate block flex-1" title={uploaded.name}>
                                📄 {uploaded.name}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 shrink-0 font-mono">
                                {uploaded.file_size_kb} KB
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                              <label className="text-[10px] text-sky-700 hover:text-sky-900 font-bold cursor-pointer underline">
                                Replace
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept=".pdf,.png,.jpg,.jpeg,.docx" 
                                  onChange={(e) => handleDocFileUpload(doc.key, e.target.files[0], doc.title, doc.type)} 
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => removeUploadedDoc(doc.key)}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center justify-center gap-1.5 font-bold text-sky-900 bg-sky-50/70 border-sky-300 hover:bg-sky-100 cursor-pointer">
                            <Upload className="w-3 h-3 text-sky-600" />
                            <span>Upload Document</span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.png,.jpg,.jpeg,.docx" 
                              onChange={(e) => handleDocFileUpload(doc.key, e.target.files[0], doc.title, doc.type)} 
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🌟 SUB-SECTION B: SPECIALIZED SECTOR / ROLE DOCUMENTS */}
              <div className="space-y-2.5 pt-3 border-t border-sky-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>B. Specialized Sector Compliance Documents ({formData.employeeCategory?.replace('_', ' ').toUpperCase() || 'IT & SOFTWARE'})</span>
                  </span>
                  <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Role-Specific Mandate
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {/* Dynamic Sector Document Slots based on active category */}
                  {((category) => {
                    switch (category) {
                      case 'it_tech':
                      default:
                        return [
                          { key: 'sec_moonlighting', title: 'Anti-Moonlighting Undertaking', icon: '💻', type: 'sector_doc', desc: 'Exclusivity & zero dual employment commitment letter' },
                          { key: 'sec_assetPolicy', title: 'Remote IT Asset Policy Copy', icon: '🖥️', type: 'sector_doc', desc: 'Laptop & cybersecurity device handling policy sign-off' },
                          { key: 'sec_githubContrib', title: 'Open Source IP Declaration', icon: '🔗', type: 'sector_doc', desc: 'Code repository & personal IP assignment statement' }
                        ];
                      case 'manufacturing':
                        return [
                          { key: 'sec_safetyProtocol', title: 'Plant Safety & PPE Undertaking', icon: '🥾', type: 'sector_doc', desc: 'Factory safety protocol & PPE gear acknowledgment' },
                          { key: 'sec_gatePass', title: 'Hazard Machinery Safety Cert', icon: '⚠️', type: 'sector_doc', desc: 'Shop floor machinery & arc welding hazard safety certificate' },
                          { key: 'sec_form32Health', title: 'Form 32 Factory Fitness Card', icon: '🩺', type: 'sector_doc', desc: 'Factories Act 1948 occupational health examination card' },
                          { key: 'sec_tradeCert', title: 'ITI / Trade Trade Certificate', icon: '🛠️', type: 'sector_doc', desc: 'National Trade Certificate / Apprenticeship diploma' }
                        ];
                      case 'bfsi':
                        return [
                          { key: 'sec_cibilConsent', title: 'CIBIL Credit Standing Consent', icon: '📊', type: 'sector_doc', desc: 'Signed consent letter for comprehensive credit history audit' },
                          { key: 'sec_nismCert', title: 'NISM / IRDA Certificates', icon: '📜', type: 'sector_doc', desc: 'Series VIII equity derivatives / composite broker certification' },
                          { key: 'sec_sebiClearance', title: 'SEBI Insider Trading Undertaking', icon: '⚖️', type: 'sector_doc', desc: 'Zero personal trading in client scrips & AML clearance' },
                          { key: 'sec_fidelityBond', title: 'Corporate Fidelity Indemnity Bond', icon: '🛡️', type: 'sector_doc', desc: 'Fifteen lakhs corporate financial fidelity agreement' }
                        ];
                      case 'healthcare':
                        return [
                          { key: 'sec_medicalCouncil', title: 'Medical / Nursing Council Reg', icon: '🩺', type: 'sector_doc', desc: 'State Medical Council / MCI valid license certificate' },
                          { key: 'sec_immunization', title: 'Mandatory Immunization Record', icon: '💉', type: 'sector_doc', desc: 'Hepatitis B, Tetanus Toxoid & COVID vaccination card' },
                          { key: 'sec_lifeSupport', title: 'ACLS / BLS Life Support Cert', icon: '🧫', type: 'sector_doc', desc: 'AHA certified advanced cardiac life support credential' },
                          { key: 'sec_cleanroomGmp', title: 'Cleanroom Bio-Safety Clearance', icon: '🧪', type: 'sector_doc', desc: 'Sterile class 100 GMP cleanroom handling clearance' }
                        ];
                      case 'logistics':
                        return [
                          { key: 'sec_hmvBadge', title: 'Commercial Transport HMV Badge', icon: '🚚', type: 'sector_doc', desc: 'Heavy commercial transport driving license badge' },
                          { key: 'sec_forkliftLic', title: 'Forklift / MHE Equipment License', icon: '🚜', type: 'sector_doc', desc: 'Certified material handling equipment operator license' },
                          { key: 'sec_policeNoc', title: 'Police Character Certificate', icon: '👮', type: 'sector_doc', desc: 'State police department verification NOC' },
                          { key: 'sec_gpsConsent', title: 'Vehicle Telematics GPS Consent', icon: '🗺️', type: 'sector_doc', desc: '24/7 route navigation & fleet telematics tracking consent' }
                        ];
                      case 'retail_hospitality':
                        return [
                          { key: 'sec_fssaiCert', title: 'FSSAI FoSTaC Training Cert', icon: '🥗', type: 'sector_doc', desc: 'Food Safety Training & Certification certificate' },
                          { key: 'sec_foodHealthCard', title: 'Food Handler Medical Health Card', icon: '🩺', type: 'sector_doc', desc: 'Annual medical certificate of fitness for food handlers' },
                          { key: 'sec_posCashIndemnity', title: 'POS Cash Register Indemnity', icon: '💳', type: 'sector_doc', desc: 'Cash drawer balancing & register reconciliation agreement' }
                        ];
                      case 'contractual':
                        return [
                          { key: 'sec_formXIII', title: 'Contract Labor Act Form XIII', icon: '📜', type: 'sector_doc', desc: 'Contract Labor Register enrollment card copy' },
                          { key: 'sec_agencyAgreement', title: 'Manpower Agency Deployment Letter', icon: '🏢', type: 'sector_doc', desc: 'Authorized contractor deployment & wage rate letter' },
                          { key: 'sec_workOrderPo', title: 'Principal Employer Work Order', icon: '📄', type: 'sector_doc', desc: 'Assigned company PO & contract tenure document' },
                          { key: 'sec_esicCard', title: 'ESIC Pehchan Temporary Card', icon: '🏥', type: 'sector_doc', desc: 'ESIC Form 1 insurance temporary identity certificate' }
                        ];
                    }
                  })(formData.employeeCategory || 'it_tech').map((doc) => {
                    const uploaded = (formData.uploadedDocuments || {})[doc.key];
                    return (
                      <div 
                        key={doc.key}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 ${
                          uploaded 
                            ? 'bg-indigo-50/80 border-indigo-400 shadow-2xs' 
                            : 'bg-white border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl shrink-0">{doc.icon}</span>
                            <div className="min-w-0">
                              <strong className="text-slate-900 font-extrabold text-xs block leading-tight truncate">{doc.title}</strong>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1">{doc.desc}</p>
                            </div>
                          </div>
                          {uploaded && (
                            <span className="text-[9px] bg-indigo-600 text-white font-black px-1.5 py-0.5 rounded shrink-0">
                              Attached ✓
                            </span>
                          )}
                        </div>

                        {uploaded ? (
                          <div className="bg-white p-2 rounded-xl border border-indigo-200 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] font-bold text-indigo-950 truncate block flex-1" title={uploaded.name}>
                                📄 {uploaded.name}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 shrink-0 font-mono">
                                {uploaded.file_size_kb} KB
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                              <label className="text-[10px] text-indigo-700 hover:text-indigo-900 font-bold cursor-pointer underline">
                                Replace
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept=".pdf,.png,.jpg,.jpeg,.docx" 
                                  onChange={(e) => handleDocFileUpload(doc.key, e.target.files[0], doc.title, doc.type)} 
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => removeUploadedDoc(doc.key)}
                                className="text-[10px] text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center justify-center gap-1.5 font-bold text-indigo-900 bg-indigo-50/70 border-indigo-300 hover:bg-indigo-100 cursor-pointer">
                            <Upload className="w-3 h-3 text-indigo-600" />
                            <span>Upload Sector Doc</span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.png,.jpg,.jpeg,.docx" 
                              onChange={(e) => handleDocFileUpload(doc.key, e.target.files[0], doc.title, doc.type)} 
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ⚡ SECTION 9: DYNAMIC CUSTOM ATTRIBUTES & CUSTOM DOCUMENT BUILDER (HR EXTENSIBILITY) */}
            <div className="p-4 bg-gradient-to-br from-purple-50/70 via-slate-50 to-indigo-50/60 border-2 border-purple-300/80 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-600 text-white rounded-xl shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider">
                        9. Dynamic Custom Fields & Custom Document Slots Builder
                      </h4>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-md border border-purple-200">
                        {(formData.customFields || []).length} Custom Fields • {(formData.customDocSlots || []).length} Custom Doc Slots
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Add any company-specific text attributes (Grade, Project Code, Manager Email) or custom document upload slots on the fly!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomFieldModal(true)}
                    className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold text-purple-900 bg-white border-purple-300 hover:bg-purple-50 shadow-xs cursor-pointer"
                  >
                    <span>+ Add Custom Text Field</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddCustomDocModal(true)}
                    className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold text-indigo-900 bg-white border-indigo-300 hover:bg-indigo-50 shadow-xs cursor-pointer"
                  >
                    <span>+ Add Custom Doc Slot</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Custom Text/Number/Date Fields List */}
              {(formData.customFields || []).length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-purple-900 uppercase tracking-wider block">
                    Custom Attribute Fields ({(formData.customFields || []).length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {(formData.customFields || []).map((f) => (
                      <div key={f.id} className="p-3 bg-white rounded-xl border border-purple-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-extrabold text-slate-900 text-xs truncate">
                            {f.label} {f.required && <span className="text-rose-500">*</span>}
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded uppercase">
                              {f.type}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomField(f.id)}
                              className="text-rose-500 hover:text-rose-700 font-bold text-xs p-1"
                              title="Delete Field"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        {f.type === 'textarea' ? (
                          <textarea
                            rows="2"
                            value={f.value}
                            onChange={(e) => handleUpdateCustomFieldValue(f.id, e.target.value)}
                            placeholder={`Enter ${f.label}...`}
                            className="form-input text-xs"
                          />
                        ) : (
                          <input
                            type={f.type}
                            value={f.value}
                            onChange={(e) => handleUpdateCustomFieldValue(f.id, e.target.value)}
                            placeholder={`Enter ${f.label}...`}
                            className="form-input text-xs font-medium"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Custom Document Slots List */}
              {(formData.customDocSlots || []).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-purple-100">
                  <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider block">
                    Custom Document Upload Slots ({(formData.customDocSlots || []).length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {(formData.customDocSlots || []).map((slot) => {
                      const uploaded = (formData.uploadedDocuments || {})[slot.key];
                      return (
                        <div key={slot.id} className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <strong className="text-slate-900 font-extrabold text-xs block leading-tight">{slot.title}</strong>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1">{slot.desc}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomDocSlot(slot.id)}
                              className="text-rose-500 hover:text-rose-700 font-bold text-xs p-1 shrink-0"
                              title="Delete Slot"
                            >
                              ✕
                            </button>
                          </div>

                          {uploaded ? (
                            <div className="bg-emerald-50/80 p-2 rounded-lg border border-emerald-300 flex items-center justify-between text-[10px]">
                              <span className="font-mono font-bold text-emerald-950 truncate flex-1">
                                📄 {uploaded.name} ({uploaded.file_size_kb} KB)
                              </span>
                              <button
                                type="button"
                                onClick={() => removeUploadedDoc(slot.key)}
                                className="text-rose-600 font-bold hover:underline ml-2"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <label className="btn btn-secondary text-[11px] py-1 px-2 flex items-center justify-center gap-1.5 font-bold text-indigo-900 bg-indigo-50 border-indigo-300 hover:bg-indigo-100 cursor-pointer">
                              <Upload className="w-3 h-3 text-indigo-600" />
                              <span>Attach {slot.title.split(' ')[0]}</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.png,.jpg,.jpeg,.docx" 
                                onChange={(e) => handleDocFileUpload(slot.key, e.target.files[0], slot.title, 'custom_doc')} 
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inline Quick Field Adder Modal / Popup */}
              {showAddCustomFieldModal && (
                <div className="p-3.5 bg-white rounded-xl border-2 border-purple-400 shadow-md space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-950 uppercase tracking-wider">
                      ✨ Create New Custom Attribute Field
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomFieldModal(false)}
                      className="text-slate-400 hover:text-slate-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Field Label / Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Internal Project Code"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        className="form-input text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Widget Input Type</label>
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                        className="form-select text-xs font-medium"
                      >
                        <option value="text">Text Input</option>
                        <option value="number">Numeric (Number)</option>
                        <option value="date">Date Picker</option>
                        <option value="textarea">Multi-line Textarea</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-4 sm:pt-5">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={newFieldRequired}
                          onChange={(e) => setNewFieldRequired(e.target.checked)}
                          className="accent-purple-600 w-4 h-4"
                        />
                        <span>Mandatory *</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddCustomField}
                        className="btn btn-primary text-xs py-1.5 px-3 font-extrabold bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                      >
                        Add Field
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Quick Doc Slot Adder Modal / Popup */}
              {showAddCustomDocModal && (
                <div className="p-3.5 bg-white rounded-xl border-2 border-indigo-400 shadow-md space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                      📄 Create New Custom Document Slot
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomDocModal(false)}
                      className="text-slate-400 hover:text-slate-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Document Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Relocation Agreement"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        className="form-input text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Description / Purpose</label>
                      <input
                        type="text"
                        placeholder="e.g. Executed relocation allowance covenant"
                        value={newDocDesc}
                        onChange={(e) => setNewDocDesc(e.target.value)}
                        className="form-input text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-4 sm:pt-5">
                      <button
                        type="button"
                        onClick={handleAddCustomDocSlot}
                        className="btn btn-primary text-xs py-1.5 px-3 font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      >
                        Add Document Slot
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 10: Mandatory Upstream Verification Requirements Selector */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>8. Select Mandatory Upstream API Identity Verification Checks</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Pick which documents and background records are mandatory for this candidate. Checks are processed via Server 1 (Sandbox) or Server 2 (CoinCircleTrust 47+ APIs).
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        verificationConfig: { aadhaar: true, mobileOtp: false, pan: false, bankCheck: false, faceCapture: false } 
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer"
                  >
                    ⚡ Aadhaar Only (Active)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const allOn = {};
                      featureList.forEach(f => { allOn[f.id] = true; });
                      setFormData({ ...formData, verificationConfig: allOn });
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    Select All Checks
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {featureList.map((feat) => {
                  const isEnabledBySuperAdmin = currentCompany.features?.[feat.id] ?? true;
                  const isChecked = !!formData.verificationConfig?.[feat.id];

                  if (!isEnabledBySuperAdmin) {
                    return (
                      <div key={feat.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs opacity-60 flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{feat.name}</div>
                          <div className="text-[10px]">Disabled in Company Plan</div>
                        </div>
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    );
                  }

                  return (
                    <label 
                      key={feat.id}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-emerald-50/70 border-emerald-400 text-slate-900 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setFormData({
                          ...formData,
                          verificationConfig: { ...formData.verificationConfig, [feat.id]: e.target.checked }
                        })}
                        className="accent-emerald-600 mt-1 w-4 h-4 shrink-0"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-xs text-slate-900 leading-tight">{feat.name}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase whitespace-nowrap ${
                            feat.serverMode === 'server2_only' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}>
                            {feat.serverMode === 'server2_only' ? 'Server 2 ⚡' : 'Server 1/2'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-relaxed">{feat.description || feat.category}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* SECTION 9: Required Documents Upload Checklist */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-sky-700 tracking-wider flex items-center gap-2">
                    <FolderDown className="w-4 h-4 text-sky-600" />
                    <span>9. Required Documents Upload Checklist (Selectable by HR)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Selected documents must be uploaded by the candidate and will be permanently embedded in the final Complete Profile PDF.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { key: 'aadhaarCard', title: 'Government Aadhaar Card', desc: 'UIDAI official masked e-Aadhaar or clear color photo' },
                  { key: 'panCard', title: 'Income Tax PAN Card', desc: 'NSDL / UTI official PAN card front copy' },
                  { key: 'passport', title: 'Passport (First & Last Page)', desc: 'Valid Indian passport showing address & validity' },
                  { key: 'drivingLicense', title: 'MoRTH Driving License (DL)', desc: 'Valid smart card DL with transport / non-transport classes' },
                  { key: 'bankProof', title: 'Bank Passbook / Cheque Leaf', desc: 'Pre-printed cancelled cheque or passbook with IFSC & Name' },
                  { key: 'degreeMarksheet', title: 'Degree Certificate / Marksheet', desc: 'Convocation degree or final semester cumulative marksheet' },
                  { key: 'relievingLetter', title: 'Previous Relieving Letter', desc: 'Official formal relieving certificate from immediate past employer' },
                  { key: 'salarySlips', title: 'Last 3 Months Salary Slips', desc: 'Payslips showing basic, PF deductions, and gross earnings' },
                  { key: 'signedNda', title: 'Signed Employer NDA Copy', desc: 'Executed copy of employee confidentiality agreement' }
                ].map((docItem) => {
                  const isChecked = !!formData.requiredDocumentsConfig?.[docItem.key];
                  return (
                    <label
                      key={docItem.key}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked 
                          ? 'bg-sky-50/70 border-sky-400 text-slate-900 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setFormData({
                          ...formData,
                          requiredDocumentsConfig: { ...formData.requiredDocumentsConfig, [docItem.key]: e.target.checked }
                        })}
                        className="accent-sky-600 mt-0.5 w-4 h-4 shrink-0"
                      />
                      <div className="space-y-0.5 flex-1">
                        <span className="font-extrabold text-xs text-slate-900 leading-tight block">{docItem.title}</span>
                        <p className="text-[10px] text-slate-500 leading-snug">{docItem.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* SECTION 10: Statutory Compliance Forms & Legal Agreements Assignment */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-indigo-700 tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>10. Assign Statutory Compliance Forms & Legal Agreements (Selectable by HR)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Toggled forms will be auto-generated in the Candidate's Onboarding Packet and compiled in the Complete Master Profile PDF.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  { key: 'form16', title: 'Form 16 / TDS Declaration', desc: 'Income Tax Sec 192 / Form 12B declaration for salaried employees', tag: 'Tax Compliance' },
                  { key: 'form11', title: 'Form 11 (EPFO Declaration)', desc: 'Statutory Provident Fund declaration under EPF Act 1952', tag: 'Labor Statutory' },
                  { key: 'formF', title: 'Form F (Gratuity Nomination)', desc: 'Payment of Gratuity Act 1972 statutory family nomination', tag: 'Gratuity Act' },
                  { key: 'esicForm1', title: 'ESIC Form 1 Registration', desc: 'Employee State Insurance Corporation medical coverage', tag: 'Social Security' },
                  { key: 'nda', title: 'Non-Disclosure Agreement (NDA)', desc: 'Proprietary IP protection & employer confidentiality covenant', tag: 'Legal Agreement' },
                  { key: 'posh', title: 'POSH Code of Conduct', desc: 'Prevention of Sexual Harassment workplace policy acknowledgement', tag: 'HR Compliance' },
                  { key: 'nonCompete', title: 'Non-Compete & Non-Solicit', desc: 'Post-employment non-compete covenants & client non-solicitation', tag: 'Enterprise' },
                  { key: 'contractFormXIII', title: 'Contract Labor Form XIII', desc: 'Contract Labor (Regulation & Abolition) Act register format', tag: 'Contract Staff' }
                ].map((formItem) => {
                  const isChecked = !!formData.statutoryFormsConfig?.[formItem.key];
                  return (
                    <label
                      key={formItem.key}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked 
                          ? 'bg-indigo-50/70 border-indigo-400 text-slate-900 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setFormData({
                          ...formData,
                          statutoryFormsConfig: { ...formData.statutoryFormsConfig, [formItem.key]: e.target.checked }
                        })}
                        className="accent-indigo-600 mt-0.5 w-4 h-4 shrink-0"
                      />
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900 leading-tight">{formItem.title}</span>
                          <span className="text-[8px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded uppercase">{formItem.tag}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">{formItem.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setActiveTab('pipeline')} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="btn btn-hrexecutive text-xs flex items-center gap-2 font-bold shadow-md cursor-pointer">
                <Send className="w-4 h-4" />
                <span>Save Profile & Generate Onboarding Link 🚀</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: HR CONVERSION ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="glass-panel p-4 sm:p-6 border-slate-200 bg-white space-y-4 rounded-2xl shadow-sm animate-tab-switch">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>HR Candidate Conversion Pipeline Telemetry</span>
            </h3>
            <span className="badge badge-emerald">85% Completion Conversion Rate</span>
          </div>

          <div className="space-y-4">
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
              <div className="w-[45%] bg-emerald-500 h-full" title="Verified Profiles (45%)"></div>
              <div className="w-[30%] bg-sky-500 h-full" title="In Verification (30%)"></div>
              <div className="w-[25%] bg-amber-400 h-full" title="Link Dispatched (25%)"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-700 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-2xl font-black text-emerald-800 block">45%</span>
                <span className="text-slate-600">Completed & Verified ({candidates.filter(c => c.status === 'Verified').length})</span>
              </div>
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <span className="text-2xl font-black text-sky-800 block">30%</span>
                <span className="text-slate-600">In Active Verification ({candidates.filter(c => c.status === 'In Verification').length})</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-2xl font-black text-amber-800 block">25%</span>
                <span className="text-slate-600">Link Sent / Pending ({candidates.filter(c => c.status === 'Link Sent').length})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: HR EXECUTIVE WORKSTATION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-4 sm:p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm animate-tab-switch">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span>HR Executive Workstation Productivity & Dispatch Settings</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Configure pre-selected onboarding dispatch channels, default form templates, and fast station shortcuts.</p>
            </div>
            <span className="badge badge-indigo text-[10px]">HR Station Preferences</span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateRoleSettings('hr', systemSettings.hr);
            }} 
            className="space-y-6 text-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Onboarding Link Dispatch Defaults</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Preferred Default Dispatch Channel</label>
                  <select 
                    value={systemSettings.hr?.defaultDispatchChannel || 'whatsapp'}
                    onChange={(e) => updateRoleSettings('hr', { defaultDispatchChannel: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="whatsapp">Meta WhatsApp Business API (Fastest 💬)</option>
                    <option value="sms">Carrier SMS Gateway (Mobile OTP)</option>
                    <option value="email">Enterprise SMTP Email (HTML Template)</option>
                    <option value="qrcode">On-Screen Scannable QR Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pre-Selected Joining Template</label>
                  <select 
                    value={systemSettings.hr?.defaultTemplate || 'corporate'}
                    onChange={(e) => updateRoleSettings('hr', { defaultTemplate: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="corporate">Corporate Office Staff (Aadhaar + Mobile + Face Match)</option>
                    <option value="logistics">Fleet Logistics & Field Delivery (DL + Aadhaar)</option>
                    <option value="healthcare">Healthcare & Clinical Staff (Degree Cert + Identity)</option>
                    <option value="tech">Software & Engineering Staff (PAN + Aadhaar + Degree)</option>
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Fast Station Location & Notification Shortcuts</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Default HR Work Location Shortcut</label>
                  <input 
                    type="text" 
                    value={systemSettings.hr?.defaultWorkLocation || 'Bengaluru Tech Park (HQ)'}
                    onChange={(e) => updateRoleSettings('hr', { defaultWorkLocation: e.target.value })}
                    className="form-input text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Real-Time Candidate Verification Toast Alerts</label>
                  <select 
                    value={systemSettings.hr?.realtimeToastAlerts ? 'true' : 'false'}
                    onChange={(e) => updateRoleSettings('hr', { realtimeToastAlerts: e.target.value === 'true' })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="true">Enabled 🟢 (Show pop-up toast when candidate verifies)</option>
                    <option value="false">Disabled ⚪ (Silent background update)</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="btn btn-hrexecutive text-xs flex items-center gap-2 font-bold shadow-md">
                <Save className="w-4 h-4" />
                <span>Save Workstation Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Multi-Channel QR Code & Link Dispatcher Modal */}
      {dispatchingCandidate && (
        <QrCodeModal 
          candidate={dispatchingCandidate}
          onClose={() => setDispatchingCandidate(null)}
          onCopyLink={handleCopyLink}
          isCopied={copiedToken === dispatchingCandidate.token}
        />
      )}

      {/* Full 7-Section Joining Form Modal (HR Manual Station Entry) */}
      {showFullJoiningModal && (
        <FullJoiningFormModal 
          candidate={candidates[0]}
          isHrMode={true}
          onClose={() => setShowFullJoiningModal(false)}
          onSubmitComplete={() => setShowFullJoiningModal(false)}
        />
      )}

      {/* General Document Downloader Modal */}
      {downloadingCandidate && (
        <DocumentDownloader 
          candidate={downloadingCandidate} 
          onClose={() => setDownloadingCandidate(null)} 
        />
      )}

      {/* Direct JOY Corporate Solutions Certificate Preview Modal */}
      {viewingCertificateCandidate && (
        <OfficialVerificationCertificateModal
          candidate={viewingCertificateCandidate}
          onClose={() => setViewingCertificateCandidate(null)}
        />
      )}

      {/* Direct Employee Profile Dossier Preview Modal */}
      {viewingDossierCandidate && (
        <EmployeeProfileDossierModal
          candidate={viewingDossierCandidate}
          onClose={() => setViewingDossierCandidate(null)}
        />
      )}

      {/* WhatsApp & SMTP Email Gateways Modal */}
      {showGatewaysModal && (
        <CommunicationGatewaysModal 
          onClose={() => setShowGatewaysModal(false)} 
        />
      )}

      {/* Metric Drilldown Details Modal */}
      {activeDrilldown && (
        <MetricDrilldownModal
          isOpen={Boolean(activeDrilldown)}
          onClose={() => setActiveDrilldown(null)}
          title={activeDrilldown.title}
          subtitle={activeDrilldown.subtitle}
          metricValue={activeDrilldown.metricValue}
          metricType={activeDrilldown.metricType}
          role="hrexecutive"
          data={activeDrilldown.data}
          onViewCandidateDossier={(cand) => setViewingDossierCandidate(cand)}
          onViewCandidateCertificate={(cand) => setViewingCertificateCandidate(cand)}
          onDispatchLink={(cand) => setDispatchingCandidate(cand)}
        />
      )}

      {/* 360° Multi-API Comprehensive Background Verification Dossier Modal */}
      {viewingBgvReportCandidate && (
        <ComprehensiveBgvReportModal
          candidate={viewingBgvReportCandidate}
          companyName={currentCompany?.name || "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"}
          hrName={activeHr?.name || "PRAVEEN B"}
          onClose={() => setViewingBgvReportCandidate(null)}
        />
      )}

      {/* Statutory Legal & DPDP Compliance Handbook Modal */}
      <LegalComplianceHandbookModal
        isOpen={showLegalHandbook}
        onClose={() => setShowLegalHandbook(false)}
      />

      {/* Universal Date-Filtered Document & Report Export Modal */}
      <UniversalDocumentExportModal
        isOpen={showUniversalExportModal}
        onClose={() => setShowUniversalExportModal(false)}
        initialRole="hrexecutive"
        scopedCompanyId={currentCompany?.id}
      />

      {/* 📁 HR UPLOADED ORIGINAL DOCUMENTS REPOSITORY MODAL */}
      {viewingUploadedDocsCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <FolderDown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Candidate Uploaded Compliance Documents Registry
                  </h3>
                  <p className="text-xs text-slate-400">
                    {viewingUploadedDocsCandidate.name} • #{viewingUploadedDocsCandidate.empId || 'EMP-2026-88'} • {currentCompany?.name}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setViewingUploadedDocsCandidate(null);
                  setSelectedDocPreview(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1">
              
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Vault Security: All files verified against authoritative government APIs & encrypted under DPDP Act 2023.</span>
                </div>
                <span className="badge badge-emerald text-[9px]">8/8 Verified</span>
              </div>

              {/* Grid of Uploaded Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { name: '1. Government Aadhaar Card (Front & Back)', type: 'UIDAI Identity', format: 'PDF • 1.4 MB', hash: 'SHA256-AADH-9812401', status: 'UIDAI API Verified ✓', date: '2026-08-27 11:32:00', masked: 'XXXX XXXX 9876' },
                  { name: '2. Income Tax PAN Card Copy', type: 'NSDL Tax Proof', format: 'PNG • 820 KB', hash: 'SHA256-PANC-1092834', status: 'NSDL Verified ✓', date: '2026-08-27 11:32:15', masked: viewingUploadedDocsCandidate.panNo || 'ABCDE1234F' },
                  { name: '3. Bank Passbook / Cancelled Cheque Leaf', type: 'Banking & Payroll', format: 'PDF • 950 KB', hash: 'SHA256-BANK-5591024', status: 'IMPS Penny Drop ✓', date: '2026-08-27 11:33:04', masked: 'HDFC Bank • A/c ...9845' },
                  { name: '4. Highest Degree Certificate / Marksheet', type: 'Academic Convocation', format: 'PDF • 2.1 MB', hash: 'SHA256-ACAD-7781290', status: 'VTU Verified ✓', date: '2026-08-27 11:34:20', masked: 'B.Tech CS • 84.5%' },
                  { name: '5. Previous Employer Relieving & Service Letter', type: 'Service Certificate', format: 'PDF • 1.8 MB', hash: 'SHA256-EXPR-3341092', status: 'HR Verified ✓', date: '2026-08-27 11:35:12', masked: 'Infosys Limited • 3.2 Yrs' },
                  { name: '6. Signed Non-Disclosure Agreement (NDA)', type: 'Legal Covenant', format: 'PDF • 1.1 MB', hash: 'SHA256-LEGL-8812903', status: 'Executed & Signed ✓', date: '2026-08-27 11:36:00', masked: 'Executed 2026' },
                  { name: '7. Passport Bio-Data Page (if applicable)', type: 'Travel & Citizenship', format: 'PDF • 1.6 MB', hash: 'SHA256-PSPT-4491028', status: 'MEA Seva Verified ✓', date: '2026-08-27 11:36:45', masked: 'Passport Seva' },
                  { name: '8. 3D WebCam Biometric Live Portrait Scan', type: 'Biometric Anti-Spoof', format: 'JPEG • 640 KB', hash: 'SHA256-FACE-1102938', status: '99.4% Liveness ✓', date: '2026-08-27 11:37:10', masked: '3D Face Capture' }
                ].map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block leading-tight">{doc.name}</span>
                        <span className="text-[10px] text-slate-500">{doc.type} • {doc.format}</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-black text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap border border-emerald-300">
                        {doc.status}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-slate-700 font-bold">{doc.masked}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedDocPreview(doc)}
                        className="btn btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1 font-bold hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-1.5">
                      <span>Hash: {doc.hash}</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">Digital Retention: Stored for 60 Days per Fair Hiring Policy</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setViewingDossierCandidate(viewingUploadedDocsCandidate);
                    setViewingUploadedDocsCandidate(null);
                  }}
                  className="btn btn-secondary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-700" />
                  <span>Open Full 5-Page Dossier</span>
                </button>
                <button
                  onClick={() => {
                    setViewingUploadedDocsCandidate(null);
                    setSelectedDocPreview(null);
                  }}
                  className="btn btn-hrexecutive text-xs py-1.5 px-4 font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 👁️ SINGLE DOCUMENT INSPECTION PREVIEW OVERLAY */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-white">{selectedDocPreview.name}</h4>
                <p className="text-[10px] text-slate-400">{selectedDocPreview.type} • {selectedDocPreview.format}</p>
              </div>
              <button 
                onClick={() => setSelectedDocPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-100 space-y-4 text-xs font-mono">
              <div className="p-4 bg-white rounded-xl border border-slate-300 shadow-sm space-y-2.5">
                <div className="flex justify-between border-b border-slate-100 pb-2 font-sans font-bold text-slate-900">
                  <span>Authentic Evidence Record</span>
                  <span className="badge badge-emerald">Verified ✓</span>
                </div>
                <div className="flex justify-between"><span>Subject Name:</span><strong className="text-slate-900">{viewingUploadedDocsCandidate?.name}</strong></div>
                <div className="flex justify-between"><span>Document ID / Reg:</span><strong>{selectedDocPreview.masked}</strong></div>
                <div className="flex justify-between"><span>Upload Execution Date:</span><strong>{selectedDocPreview.date}</strong></div>
                <div className="flex justify-between"><span>SHA-256 Checksum:</span><strong className="text-indigo-700">{selectedDocPreview.hash}</strong></div>
                <div className="flex justify-between"><span>Encryption Protocol:</span><strong className="text-emerald-700">AES-256 GCM (DPDP Compliant)</strong></div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] font-sans flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Original document validated against live government registry and digitally sealed into Candidate Master Dossier.</span>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="btn btn-secondary text-xs py-1.5 px-4 font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 HR CANDIDATE SUBMISSION REVIEW & APPROVAL CONSOLE MODAL */}
      {reviewingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn my-auto">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-amber text-[10px] font-black">SUBMISSION PENDING HR REVIEW</span>
                    <span className="text-xs text-slate-400 font-mono">Token: {reviewingCandidate.token}</span>
                  </div>
                  <h3 className="font-black text-lg text-white mt-0.5">
                    Review Onboarding Submission: {reviewingCandidate.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    #{reviewingCandidate.empId || 'EMP-2026-88'} • {reviewingCandidate.designation} • {currentCompany?.name}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setReviewingCandidate(null);
                  setShowCorrectionInput(false);
                  setCorrectionNotes('');
                }}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 bg-slate-50 flex-1 text-xs">
              
              {/* Submission Status Alert Banner */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-xs font-black text-amber-900">Candidate Has Submitted All Required Particulars & Documents</strong>
                  <p className="text-[11px] text-amber-900/80 mt-0.5 leading-relaxed">
                    Verify the submitted data against uploaded identity proofs. If satisfied, click <strong>Accept & Approve Profile</strong> to certify the employee and generate the permanent Master Dossier. If any field or file is incorrect, click <strong>Request Corrections & Resend</strong>.
                  </p>
                </div>
              </div>

              {/* 1. Candidate Submitted Form Particulars */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between">
                  <span>1. Submitted Personal, Academic & Banking Particulars</span>
                  <span className="badge badge-emerald text-[9px]">Aadhaar & Mobile OTP Verified ✓</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-500 block text-[10px] font-bold">Full Legal Name</span>
                    <strong className="text-slate-900">{reviewingCandidate.submittedFormData?.fullName || reviewingCandidate.name}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-500 block text-[10px] font-bold">Father's Name</span>
                    <strong className="text-slate-900">{reviewingCandidate.submittedFormData?.fatherName || 'Suresh Kumar'}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-500 block text-[10px] font-bold">Date of Birth</span>
                    <strong className="text-slate-900">{reviewingCandidate.submittedFormData?.dob || '1996-05-15'}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-500 block text-[10px] font-bold">Mobile Number</span>
                    <strong className="text-slate-900">{reviewingCandidate.mobile} ✓</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-500 block text-[10px] font-bold">Aadhaar Number</span>
                    <strong className="text-slate-900 font-mono">{reviewingCandidate.aadhaarNo || '5489 1234 9876'} ✓</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-500 block text-[10px] font-bold">PAN Card Number</span>
                    <strong className="text-slate-900 font-mono">{reviewingCandidate.submittedFormData?.panNo || 'ABCDE1234F'} ✓</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-500 block text-[10px] font-bold">Bank Name & A/c</span>
                    <strong className="text-slate-900">{reviewingCandidate.submittedFormData?.bankName || 'HDFC Bank'} • ...9845</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border">
                    <span className="text-slate-500 block text-[10px] font-bold">Gratuity Nominee</span>
                    <strong className="text-slate-900">{reviewingCandidate.submittedFormData?.nomineeName || 'Sunita Kumar (Spouse - 100%)'}</strong>
                  </div>
                </div>
              </div>

              {/* 2. Uploaded Documents Proof Gallery (8 Cards) */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between">
                  <span>2. Uploaded Original Document Evidence (8/8 Verified)</span>
                  <span className="text-[10px] text-slate-500 font-medium">Click Inspect on any file to view original</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  {[
                    { name: '1. Aadhaar Card (Front & Back)', type: 'UIDAI Proof', status: 'Verified ✓', masked: 'XXXX 9876' },
                    { name: '2. Income Tax PAN Card Copy', type: 'NSDL Tax Proof', status: 'Verified ✓', masked: 'ABCDE1234F' },
                    { name: '3. Bank Passbook / Cheque Leaf', type: 'Payroll Proof', status: 'IMPS Settled ✓', masked: 'HDFC ...9845' },
                    { name: '4. Highest Degree Certificate', type: 'Convocation Marksheet', status: 'Verified ✓', masked: 'B.Tech / 84.5%' },
                    { name: '5. Relieving & Service Letter', type: 'Past Experience', status: 'Verified ✓', masked: 'Infosys Limited' },
                    { name: '6. Signed NDA Copy', type: 'Legal Covenant', status: 'Signed ✓', masked: 'Executed 2026' }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block text-xs">{doc.name}</strong>
                        <span className="text-[10px] text-slate-500">{doc.type} • {doc.masked}</span>
                      </div>
                      <span className="badge badge-emerald text-[9px]">{doc.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Statutory Compliance Declarations */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  3. Statutory Declarations & Legal Sign-Offs
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div className="p-2 bg-emerald-50 text-emerald-950 rounded border border-emerald-200 font-bold">✓ Form 16A TDS Declared</div>
                  <div className="p-2 bg-emerald-50 text-emerald-950 rounded border border-emerald-200 font-bold">✓ Form 11 EPFO Declared</div>
                  <div className="p-2 bg-emerald-50 text-emerald-950 rounded border border-emerald-200 font-bold">✓ Form F Gratuity Nominated</div>
                  <div className="p-2 bg-emerald-50 text-emerald-950 rounded border border-emerald-200 font-bold">✓ Legal NDA Signed</div>
                </div>
              </div>

              {/* Optional Inline Correction Input Area */}
              {showCorrectionInput && (
                <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Specify Correction Remarks for Candidate:</span>
                    </strong>
                    <span className="text-[10px] text-rose-700 font-bold">Candidate will see this alert</span>
                  </div>

                  <textarea
                    rows="2"
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    placeholder="e.g. Please re-upload a clearer image of your PAN card and verify your permanent address."
                    className="form-input text-xs font-medium bg-white border-rose-300"
                  />

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCorrectionInput(false)}
                      className="btn btn-secondary text-xs py-1 px-3 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        requestCandidateCorrections(reviewingCandidate.token, correctionNotes);
                        setReviewingCandidate(null);
                        setShowCorrectionInput(false);
                      }}
                      className="btn btn-rose text-xs py-1 px-3.5 font-bold shadow-sm"
                    >
                      Send Correction Request & Resend Link 🔄
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Review Decisions */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                HR Review Authority: {activeHr?.name || 'Priya Sundaram'}
              </span>

              <div className="flex items-center gap-2">
                
                {/* Request Correction Button */}
                {!showCorrectionInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowCorrectionInput(true);
                      setCorrectionNotes('Please re-upload a clearer PAN card image with your full legal name and date of birth clearly readable.');
                    }}
                    className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold text-rose-800 bg-rose-50 border-rose-200 hover:bg-rose-100 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Request Corrections & Resend</span>
                  </button>
                )}

                {/* Accept & Approve Button */}
                <button
                  type="button"
                  onClick={() => {
                    approveCandidateSubmission(reviewingCandidate.token);
                    setReviewingCandidate(null);
                  }}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>✅ Accept & Approve Profile</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
