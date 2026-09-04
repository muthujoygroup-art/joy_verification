import { logPortalError } from '../utils/errorLogger';
import { validateEmail, formatPan, validatePan, formatAadhaar, validateAadhaar, formatMobile, validateMobile, formatIfsc, validateIfsc, formatBankAccount, validateBankAccount, formatPincode, validatePincode, formatUan, validateUan, formatPassport, formatDrivingLicense, formatVoterId } from '../utils/validationRules';
import { EpfoForm11 } from '../components/statutory/EpfoForm11';
import { EpfoForm2 } from '../components/statutory/EpfoForm2';
import { EsicForm1 } from '../components/statutory/EsicForm1';
import { Form16TdsDeclaration } from '../components/statutory/Form16TdsDeclaration';
import { GratuityFormF } from '../components/statutory/GratuityFormF';
import { NdaAgreement } from '../components/statutory/NdaAgreement';
import { PoshPolicyDeclaration } from '../components/statutory/PoshPolicyDeclaration';
import { NonCompeteAgreement } from '../components/statutory/NonCompeteAgreement';
import { ContractFormXIII } from '../components/statutory/ContractFormXIII';
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { QrCodeModal } from '../components/QrCodeModal';
import { LivePhotoCaptureModal } from '../components/LivePhotoCaptureModal';
import { FullJoiningFormModal } from '../components/FullJoiningFormModal';
import { CommunicationGatewaysModal } from '../components/CommunicationGatewaysModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
import { MetricDrilldownModal } from '../components/MetricDrilldownModal';
import { ComprehensiveBgvReportModal } from '../components/ComprehensiveBgvReportModal';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { UniversalDocumentExportModal } from '../components/UniversalDocumentExportModal';
import { StatutoryFormPreviewModal } from '../components/StatutoryFormPreviewModal';
import { evaluateVerificationReadiness, VERIFICATION_REQUIREMENTS, getFieldOwnershipStatus } from '../utils/verificationRequirements';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Copy,
  Cpu,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Factory,
  FileCheck2,
  FileCode,
  FileEdit,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderDown,
  Globe,
  GraduationCap,
  HardHat,
  KeyRound,
  Landmark,
  Layers,
  ListFilter,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  Power,
  QrCode,
  RefreshCw,
  Save,
  Scale,
  Search,
  Send,
  SendHorizontal,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Smartphone,
  Sparkles,
  Stethoscope,
  Trash2,
  Truck,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap
} from 'lucide-react';

// Helper to create clean default form data
const getDefaultFormData = (activeHr = {}, currentCompany = {}) => ({
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
  status: 'Active',
  isActive: true,
  designation: 'Senior Software Engineer',
  dept: 'Engineering & Software Architecture',
  fatherName: '',
  motherName: '',
  spouseName: '',
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
  companyId: currentCompany?.id || 'comp-joy',
  hrId: activeHr?.id || 'hr-1',
  employeeCategory: 'it_tech',
  hrCustomMessage: 'Welcome to JOY CORPORATE SOLUTIONS PRIVATE LIMITED! Please fill out all required onboarding sections, upload your original KYC & academic certificates, and complete verification by this week.',
  
  // Professional & Social Media Links
  linkedInUrl: 'https://linkedin.com/in/muthukumar-dev',
  githubUrl: 'https://github.com/muthukumar-dev',
  portfolioUrl: 'https://muthukumar-portfolio.dev',
  twitterUrl: '',

  // Dynamic Multi-Entry Education Qualifications
  educationList: [
    { qualificationCategory: 'Under Graduate (UG / Bachelor Degree)', degreeName: 'B.Tech in Computer Science & Engineering', institutionName: 'PSG College of Technology, Coimbatore', university: 'Anna University', yearOfJoining: '2014', yearOfEnd: '2018', grade: '8.75 CGPA (85.2%)', passingYear: '2018' },
    { qualificationCategory: 'Higher Secondary (12th / HSC)', degreeName: 'Higher Secondary (10+2 Science Stream)', institutionName: 'St. Joseph Higher Secondary School, Madurai', university: 'State Board', yearOfJoining: '2012', yearOfEnd: '2014', grade: '94.5% Distinction', passingYear: '2014' }
  ],

  // Dynamic Multi-Entry Prior Employment Experience
  experienceList: [
    { companyName: 'Infosys Limited', institutionName: 'Infosys Limited', address: 'Electronics City, Phase 1, Bengaluru', institutionAddress: 'Electronics City, Phase 1, Bengaluru', designation: 'Senior Software Engineer', periodOfService: '06/2021 - 07/2024 (3 Yrs 2 Mos)', salaryDrawn: '₹8,50,000 PA (₹62,000/mo)', reasonForLeaving: 'Career advancement & higher role scope', relievingStatus: 'Relieved with Full Notice ✓' }
  ],
  
  // Dynamic Industry & Role-Specific Operational Details
  industrySpecialization: {
    industryType: 'it_tech',
    techStack: 'React JS, Node.js, Python, AWS Cloud, PostgreSQL',
    githubUrl: 'https://github.com/developer-demo',
    portfolioUrl: 'https://portfolio-showcase.dev',
    laptopAssetTag: 'ASSET-LT-2026-088 (MacBook Pro M3 Max)',
    monitorAssetTag: 'MON-4K-27-041',
    dualEmploymentDisclosure: 'No Dual Employment / 100% Full-Time Exclusive Commitment',
    openSourceDisclosure: 'Personal open source contributions under MIT License',
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
    cibilScoreRange: '780 - 820 (Excellent Credit Standing)',
    cibilConsentAgreed: true,
    amlComplianceStatus: 'Cleared - Zero Adverse Flagging',
    sebiInsiderTradingClearance: 'No Active Trading in Company Client Portfolios',
    certificationsBfsi: 'NISM Series VIII Equity Derivatives, IRDA Composite Broker',
    fidelityBondLimit: '₹10,00,000 (Ten Lakhs Corporate Indemnity)',
    familyDirectorships: 'None / Nil Commercial Conflict of Interest',
    medicalCouncilRegNo: 'MCI-2018-091823 (Valid till 2028)',
    nursingCouncilRegNo: '',
    departmentWard: 'Intensive Care Unit (ICU) & Critical Care',
    immunizationStatus: 'Hepatitis B (3 Doses Complete), Tetanus Toxoid 2026, COVID Booster',
    gmpCleanroomProtocol: 'Cleared Sterile Class 100 Cleanroom Compliance',
    lifeSupportCert: 'AHA Certified ACLS / BLS (Valid till Nov 2027)',
    commercialDlBadgeNo: 'KA-01-TR-2021-98124',
    badgeExpiryDate: '2029-12-31',
    forkliftLicenseNo: 'MHE-FL-8819',
    fleetGpsConsent: true,
    routeExperience: 'Interstate Heavy Haulage (NH48 Golden Quadrilateral)',
    policeNocNumber: 'POL-KA-BC-2026-5510',
    fssaiCertNo: 'FSSAI-FSTAC-2026-8812',
    foodHandlerHealthCard: 'Valid Annual Medical Health Card Issued',
    uniformShirtSize: 'L (40 cm)',
    uniformPantsSize: '34 Waist',
    posCashAgreement: true,
    storeShiftPreference: 'Morning & Weekend Peak Shifts (Sat-Sun Available)',
    assignedStoreCode: 'RET-BLR-PHOENIX-04',
    contractFormXIIIEnrollmentNo: 'CL-RA-2026-FORM-XIII-912',
    contractorAgencyName: 'First Choice Manpower & Facility Solutions Pvt Ltd',
    contractorLicenseNo: 'CL-LIC-KA-2024-8891',
    workOrderPoNumber: 'PO-JOY-2026-CW-410',
    esicSubCode: '52000889120010001',
    wageRateClassification: 'Highly Skilled / Supervisor Grade Rate (₹1,150/Day)',
    contractTenure: '2026-09-01 to 2027-08-31 (12 Months Renewable)'
  },
  statutoryFormsConfig: {
    form11: true,
    form2: true,
    esicForm1: true,
    form16: true,
    formF: true,
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

export const HrExecutiveView = () => {
  const { 
    currentUser,
    candidates, 
    setCandidates,
    addCandidate, 
    deleteCandidate,
    toggleCandidateStatus,
    clearAllCandidates,
    verifyCandidateLiveDocument,
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
  const [activeMainSection, setActiveMainSection] = useState('pipeline_dossiers');
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'profiler' | 'analytics' | 'settings'
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFullJoiningModal, setShowFullJoiningModal] = useState(false);
  const [managingDocVerifCandidate, setManagingDocVerifCandidate] = useState(null);
  const [copiedToken, setCopiedToken] = useState(null);
  const [showHrLivePhotoModal, setShowHrLivePhotoModal] = useState(false);
  
  // Document preview states
  const [downloadingCandidate, setDownloadingCandidate] = useState(null);
  const [viewingCertificateCandidate, setViewingCertificateCandidate] = useState(null);
  const [viewingDossierCandidate, setViewingDossierCandidate] = useState(null);
  const [viewingBgvReportCandidate, setViewingBgvReportCandidate] = useState(null);
  const [viewingUploadedDocsCandidate, setViewingUploadedDocsCandidate] = useState(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState(null);
  const [onboardingMode, setOnboardingMode] = useState('hr_filled'); // 'hr_filled' | 'candidate_filled'
  
  // 📋 Dynamic Custom Form Fields Configured by HR
  const [dynamicCustomFields, setDynamicCustomFields] = useState([]);
  const [newDynFieldTitle, setNewDynFieldTitle] = useState('');
  const [newDynFieldType, setNewDynFieldType] = useState('text');
  const [newDynFieldRequired, setNewDynFieldRequired] = useState(true);
  const [newDynFieldMode, setNewDynFieldMode] = useState('through_link');
  const [showAddDynFieldModal, setShowAddDynFieldModal] = useState(false);

  // 📑 Verification Checklist & Mode Configuration (HR Verified vs Through Link)
  const [verificationChecklist, setVerificationChecklist] = useState({
    aadhaar: { enabled: true, mode: 'through_link', title: 'Aadhaar Card (UIDAI OTP e-KYC)' },
    pan: { enabled: true, mode: 'through_link', title: 'PAN Card Verification (NSDL/ITD)' },
    bankCheck: { enabled: true, mode: 'through_link', title: 'Bank Account & IFSC (Penny Drop / IMPS)' },
    uan: { enabled: true, mode: 'through_link', title: 'EPFO UAN / Employment Service History' },
    drivingLicense: { enabled: false, mode: 'through_link', title: 'Driving License (MoRTH / Sarathi)' },
    passport: { enabled: false, mode: 'through_link', title: 'Passport Verification' },
    voterId: { enabled: false, mode: 'through_link', title: 'Voter ID (ECI)' },
    education: { enabled: true, mode: 'through_link', title: 'Academic Degree & Marksheets' },
    criminalCheck: { enabled: true, mode: 'hr_verified', title: 'Police Criminal Record Check' },
    courtLitigation: { enabled: true, mode: 'hr_verified', title: 'Court Litigation / e-Courts Check' },
    specimenSignature: { enabled: true, mode: 'through_link', title: 'Digital Specimen Signature' },
    dpdpConsent: { enabled: true, mode: 'through_link', title: 'DPDP Act 2023 Statutory Consent Gate' }
  }); // 'hr_filled' | 'candidate_filled'
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
  const [activePreviewStatutoryForm, setActivePreviewStatutoryForm] = useState(null);

  // Dynamic Custom Fields State
  const [legacyFieldLabel, setLegacyFieldLabel] = useState('');
  const [legacyFieldType, setLegacyFieldType] = useState('text');
  const [legacyFieldRequired, setLegacyFieldRequired] = useState(false);
  const [showAddCustomFieldModal, setShowAddCustomFieldModal] = useState(false);

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [showAddCustomDocModal, setShowAddCustomDocModal] = useState(false);

  // Dynamic HR Recruiter & Employer Company Resolution (Resolves from live logged-in session)
  const activeHr = (currentUser && (currentUser.role === 'hrexecutive' || currentUser.role === 'hr' || currentUser.email))
    ? {
        id: currentUser.id || currentUser.hrId || 'hr-1',
        name: currentUser.name || currentUser.userName || 'HR Recruiter',
        email: currentUser.email || '',
        dept: currentUser.dept || 'Human Resources',
        companyId: currentUser.companyId || 'comp-joy',
        companyName: currentUser.companyName || 'Joy Corporate Solutions Private Limited',
        hrCode: currentUser.hrCode || currentUser.code || currentUser.id || 'COMP001HR001'
      }
    : (Array.isArray(hrUsers) && hrUsers.length > 0)
    ? (hrUsers.find(h => h.email?.toLowerCase() === currentUser?.email?.toLowerCase()) || hrUsers[0])
    : { id: 'hr-1', companyId: 'comp-joy', name: 'HR Recruiter', dept: 'Human Resources' };

  const currentCompany = (Array.isArray(companies) && companies.length > 0)
    ? (companies.find(c => c.id === activeHr.companyId || c.email === activeHr.companyEmail || c.name === activeHr.companyName) || companies[0])
    : {
        id: activeHr.companyId || 'comp-joy',
        name: activeHr.companyName || currentUser?.companyName || 'Joy Corporate Solutions Private Limited',
        code: 'COMP001'
      };

  const [isSavingHrPref, setIsSavingHrPref] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [testSmtpEmail, setTestSmtpEmail] = useState(activeHr.email || '');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  // HR Workstation Password Reset State
  const [hrNewPassword, setHrNewPassword] = useState('');
  const [showHrNewPassword, setShowHrNewPassword] = useState(false);
  const [isUpdatingHrPassword, setIsUpdatingHrPassword] = useState(false);

  const [hrPreferences, setHrPreferences] = useState({
    notification_email: activeHr.email || '',
    cc_email: '',
    sender_display_name: `${activeHr.name} (${currentCompany?.name || 'Joy Corporate Solutions'})`,
    sender_email: activeHr.email || '',
    smtp_host: 'mail.joycorporatesolutions.com',
    smtp_port: 465,
    smtp_user: activeHr.email || '',
    smtp_password: '',
    use_custom_smtp: true,
    custom_signature: `Best regards,\n${activeHr.name}\n${activeHr.dept || 'Human Resources'}\n${currentCompany?.name || 'Joy Corporate Solutions'}`,
    auto_email_candidate_link: true,
    notify_on_candidate_verified: true,
    notify_on_red_flags: true,
    daily_digest: false
  });

  const [formData, setFormData] = useState(() => {
    try {
      const savedDraft = localStorage.getItem('joy_hr_employee_draft_v1');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object') {
          return {
            ...getDefaultFormData(activeHr, currentCompany),
            ...parsed,
            companyId: currentCompany?.id || 'comp-joy',
            hrId: activeHr?.id || 'hr-1'
          };
        }
      }
    } catch (e) {
      console.warn('Error reading saved HR draft from localStorage:', e);
    }
    return getDefaultFormData(activeHr, currentCompany);
  });

  const [delegatedFieldsMap, setDelegatedFieldsMap] = useState(() => {
    try {
      const savedMap = localStorage.getItem('joy_hr_delegated_map_v1');
      if (savedMap) {
        return JSON.parse(savedMap) || {};
      }
    } catch (e) {}
    return {};
  });

  const [lastAutoSaveTime, setLastAutoSaveTime] = useState(() => {
    try {
      return localStorage.getItem('joy_hr_draft_saved_time_v1') || null;
    } catch (e) {
      return null;
    }
  });

  const [hasRestoredDraft, setHasRestoredDraft] = useState(() => {
    return Boolean(localStorage.getItem('joy_hr_employee_draft_v1'));
  });


  // Dynamic Upstream Verification & Data-Fetching Dependency Evaluator
  const readiness = useMemo(() => {
    return evaluateVerificationReadiness({
      ...formData,
      fullName: formData.name,
      accountNo: formData.bankAccountNo
    });
  }, [formData]);

  const toggleFieldDelegation = (fieldName) => {
    setDelegatedFieldsMap(prev => {
      const currentOwnership = getFieldOwnershipStatus(fieldName, formData[fieldName], prev);
      const nextIsLink = currentOwnership.status === 'hr';
      const nextMap = {
        ...prev,
        [fieldName]: nextIsLink
      };
      showToast(
        nextIsLink 
          ? `📱 Delegated "${fieldName}" to Candidate via Link` 
          : `🖥️ Switched "${fieldName}" to HR Typed Entry`
      );
      return nextMap;
    });
  };

  // ⚡ Auto-Save Draft to LocalStorage across typing, reloads & disconnects
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('joy_hr_employee_draft_v1', JSON.stringify(formData));
        localStorage.setItem('joy_hr_delegated_map_v1', JSON.stringify(delegatedFieldsMap));
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        localStorage.setItem('joy_hr_draft_saved_time_v1', nowStr);
        setLastAutoSaveTime(nowStr);
      } catch (e) {
        console.warn('Auto-save storage note:', e);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData, delegatedFieldsMap]);

  // Clear Saved Draft & Start Fresh
  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear this saved draft and start fresh? All entered particulars in this form will be reset.')) {
      try {
        localStorage.removeItem('joy_hr_employee_draft_v1');
        localStorage.removeItem('joy_hr_delegated_map_v1');
        localStorage.removeItem('joy_hr_draft_saved_time_v1');
      } catch (e) {}
      setFormData(getDefaultFormData(activeHr, currentCompany));
      setDelegatedFieldsMap({});
      setLastAutoSaveTime(null);
      setHasRestoredDraft(false);
      showToast('🧹 Form draft cleared! Starting with a clean blank profile.');
    }
  };

  const setAllFieldsMode = (mode) => {
    if (mode === 'reset') {
      setDelegatedFieldsMap({});
      showToast('🔄 Reset all form field delegations to smart defaults!');
      return;
    }

    const allFieldKeys = [
      'name', 'empId', 'employeeNumber', 'doj', 'fatherName', 'motherName', 'dob', 'age',
      'gender', 'maritalStatus', 'bloodGroup', 'motherTongue', 'religion', 'caste', 'category',
      'identificationMarks', 'spouseName', 'languagesKnown', 'selfInterests', 'mobile',
      'alternateMobile', 'email', 'aadhaarNo', 'nativeState', 'nativeDistrict', 'state', 'city',
      'area', 'pincode', 'presentAddress', 'permanentAddress', 'linkedInUrl', 'githubUrl',
      'portfolioUrl', 'twitterUrl', 'jobCategory', 'jobType', 'dept', 'designation', 'panNo',
      'passportNo', 'uanEpf', 'drivingLicense', 'bankName', 'bankAccountNo', 'nomineeName',
      'nomineeRelation', 'insuranceDependents'
    ];

    const isLink = mode === 'link';
    const newMap = {};
    allFieldKeys.forEach(k => {
      newMap[k] = isLink;
    });
    setDelegatedFieldsMap(newMap);
    showToast(isLink ? '📱 All form fields switched to Candidate Link mode!' : '🖥️ All form fields switched to HR Typed mode!');
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
    status: 'Active',
    isActive: true,
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
        companyId: currentCompany?.id || 'comp-joy',
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
    status: 'Active',
    isActive: true,
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
        companyId: currentCompany?.id || 'comp-joy',
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
    status: 'Active',
    isActive: true,
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
        companyId: currentCompany?.id || 'comp-joy',
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
    status: 'Active',
    isActive: true,
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
        companyId: currentCompany?.id || 'comp-joy',
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
    status: 'Active',
    isActive: true,
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
        companyId: currentCompany?.id || 'comp-joy',
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
    status: 'Active',
    isActive: true,
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
        companyId: currentCompany?.id || 'comp-joy',
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
    status: 'Active',
    isActive: true,
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
        companyId: currentCompany?.id || 'comp-joy',
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
    const isHr = ownership.status === 'hr';
    return (
      <div className="flex items-center justify-between gap-1 mb-1">
        <label className="text-slate-700 font-bold leading-tight flex items-center gap-1 cursor-pointer">
          <span>{label}</span>
          {isRequired && <span className="text-rose-500 font-black">*</span>}
        </label>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFieldDelegation(fieldKey);
          }}
          title={isHr ? "Currently: Filled by HR. Click to switch to Candidate Link 📱" : "Currently: Delegated to Link. Click to switch to HR Typed 🖥️"}
          className={`text-[9px] font-black px-2 py-0.5 rounded-full border cursor-pointer select-none transition-all flex items-center gap-1 shadow-2xs hover:scale-105 active:scale-95 ${
            isHr
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 ring-1 ring-emerald-400/30'
              : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 ring-1 ring-amber-400/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: isHr ? '#059669' : '#d97706' }} />
          <span>{isHr ? 'HR 🖥️' : 'Link 📱'}</span>
        </button>
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

  // Smooth Dashboard & Form Positioning on Tab / Feature Switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, activeMainSection, showAddForm]);

  // Lock Body Scroll when any Modal is Active to Prevent Dashboard Jitter
  const isAnyModalOpen = Boolean(
    showGatewaysModal ||
    showFullJoiningModal ||
    downloadingCandidate ||
    viewingCertificateCandidate ||
    viewingDossierCandidate ||
    viewingBgvReportCandidate ||
    viewingUploadedDocsCandidate ||
    dispatchingCandidate ||
    reviewingCandidate ||
    showLegalHandbook ||
    showUniversalExportModal ||
    activePreviewStatutoryForm ||
    managingDocVerifCandidate ||
    showAddCustomFieldModal ||
    showAddCustomDocModal ||
    selectedDocPreview
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnyModalOpen]);

  // Dynamic Custom Fields Handlers

  const handleAddLegacyCustomField = () => {
    if (!legacyFieldLabel.trim()) return;
    const fieldId = `custom_${Date.now()}`;
    const newField = {
      id: fieldId,
      key: legacyFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      label: legacyFieldLabel.trim(),
      type: legacyFieldType,
      required: legacyFieldRequired,
      value: ''
    };
    setFormData(prev => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField]
    }));
    setLegacyFieldLabel('');
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

  // Dynamic Education Handlers for HR
  const handleHrAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationList: [
        ...(prev.educationList || []),
        { qualificationCategory: 'Under Graduate (UG / Bachelor Degree)', degreeName: '', institutionName: '', university: '', yearOfJoining: '', yearOfEnd: '', grade: '', passingYear: '' }
      ]
    }));
  };

  const handleHrRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      educationList: (prev.educationList || []).filter((_, i) => i !== index)
    }));
  };

  const handleHrUpdateEducation = (index, field, value) => {
    setFormData(prev => {
      const list = [...(prev.educationList || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, educationList: list };
    });
  };

  // Dynamic Experience Handlers for HR
  const handleHrAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experienceList: [
        ...(prev.experienceList || []),
        { companyName: '', institutionName: '', address: '', institutionAddress: '', designation: '', periodOfService: '', salaryDrawn: '', reasonForLeaving: '', relievingStatus: 'Relieved with Full Notice ✓' }
      ]
    }));
  };

  const handleHrRemoveExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experienceList: (prev.experienceList || []).filter((_, i) => i !== index)
    }));
  };

  const handleHrUpdateExperience = (index, field, value) => {
    setFormData(prev => {
      const list = [...(prev.experienceList || [])];
      list[index] = { 
        ...list[index], 
        [field]: value, 
        ...(field === 'companyName' ? { institutionName: value } : {}), 
        ...(field === 'address' ? { institutionAddress: value } : {}) 
      };
      return { ...prev, experienceList: list };
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

    const candidatePayload = {
      ...formData,
      photo: formData.photo || null,
      livePhoto: formData.photo || null,
      faceImages: formData.photo ? { straight: formData.photo, left: formData.photo, right: formData.photo } : (formData.faceImages || { straight: null, left: null, right: null }),
      customFields: customFieldsMap,
      custom_fields: customFieldsMap,
      documents: docsList,
      uploadedDocumentsList: docsList,
      delegatedFieldsMap,
      verificationReadiness: readiness
    };

    addCandidate(candidatePayload).then(createdToken => {
      const dispatchedCandidate = {
        ...candidatePayload,
        id: `emp-${Date.now()}`,
        token: (typeof createdToken === 'string' ? createdToken : createdToken?.token) || `tok_${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(100+Math.random()*900)}`,
        status: 'Link Sent',
        portalPassword: formData.portalPassword || '1234'
      };
      setDispatchingCandidate(dispatchedCandidate);
    });

    // Clear saved draft on successful submission
    try {
      localStorage.removeItem('joy_hr_employee_draft_v1');
      localStorage.removeItem('joy_hr_delegated_map_v1');
      localStorage.removeItem('joy_hr_draft_saved_time_v1');
    } catch (e) {}
    setFormData(getDefaultFormData(activeHr, currentCompany));
    setDelegatedFieldsMap({});
    setLastAutoSaveTime(null);
    setHasRestoredDraft(false);

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


  // Load saved HR preferences on mount
  useEffect(() => {
    if (!activeHr?.id) return;
    api.getHrPreferences(activeHr.id)
      .then(res => {
        if (res && res.preferences) {
          setHrPreferences(prev => ({
            ...prev,
            ...res.preferences,
            notification_email: res.preferences.notification_email || activeHr.email || '',
            sender_display_name: res.preferences.sender_display_name || `${activeHr.name} (${currentCompany?.name || 'Joy Corporate Solutions'})`,
            sender_email: res.preferences.sender_email || activeHr.email || '',
            smtp_user: res.preferences.smtp_user || activeHr.email || ''
          }));
          setTestSmtpEmail(res.preferences.notification_email || activeHr.email || '');
        }
      })
      .catch(err => console.warn('Could not load HR preferences:', err));
  }, [activeHr?.id]);

  // Test Outgoing Mail Dispatch
  const handleTestHrSmtp = async (e) => {
    if (e) e.preventDefault();
    if (!testSmtpEmail || !testSmtpEmail.includes('@')) {
      showToast('⚠️ Please enter a valid test recipient email address');
      return;
    }
    setIsTestingSmtp(true);
    try {
      const cfg = {
        host: hrPreferences.smtp_host || 'mail.joycorporatesolutions.com',
        port: hrPreferences.smtp_port || 465,
        user: hrPreferences.smtp_user || activeHr.email || '',
        password: hrPreferences.smtp_password || '',
        from_email: hrPreferences.sender_email || activeHr.email || '',
        from_name: hrPreferences.sender_display_name || activeHr.name,
        use_ssl: true
      };
      const res = await api.testCompanySmtpDispatch(currentCompany?.id || 'comp-joy', testSmtpEmail, cfg);
      showToast(res.message || `📧 Test email sent to ${testSmtpEmail}!`);
    } catch (err) {
      showToast(`❌ SMTP Test Failed: ${err.message}`, 'error');
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Change HR Login Password
  const handleUpdateHrLoginPassword = async (e) => {
    if (e) e.preventDefault();
    if (!hrNewPassword || hrNewPassword.length < 4) {
      showToast('⚠️ Password must be at least 4 characters');
      return;
    }
    setIsUpdatingHrPassword(true);
    try {
      const res = await api.updateHrPassword(currentCompany?.id || 'comp-joy', activeHr.id, hrNewPassword, false);
      showToast(res.message || '🔐 Workstation login password updated successfully!');
      setHrNewPassword('');
    } catch (err) {
      showToast(`❌ Failed to update password: ${err.message}`, 'error');
    } finally {
      setIsUpdatingHrPassword(false);
    }
  };

  // 👔 Save HR Notification Preferences
  const handleSaveHrPreferences = async (e) => {
    if (e) e.preventDefault();
    setIsSavingHrPref(true);
    try {
      await api.saveHrPreferences('hr-001', hrPreferences);
      showToast('💾 HR notification preferences & email signature saved!');
    } catch (err) {
      console.warn('Error saving HR preferences:', err);
      showToast('❌ Failed to save HR preferences');
    } finally {
      setIsSavingHrPref(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      
      {/* Top Header Banner & Navigation Tabs */}
      <div className="glass-panel p-6 border-emerald-200 bg-white space-y-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-700" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-emerald font-black text-[9.5px] sm:text-xs shrink-0">HR Executive Workstation</span>
              <span className="text-[11px] sm:text-xs text-slate-700 font-bold truncate max-w-[260px] sm:max-w-none">
                • {activeHr.name} <span className="text-slate-400 font-normal">({currentCompany?.name || 'Joy Corporate Solutions'})</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono font-black text-[11px] border border-emerald-300 shadow-2xs">
                👔 HR ID: {activeHr.hrCode || activeHr.uniqueProfileId || `${currentCompany?.code || 'COMP001'}HR001`}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-mono font-black text-[11px] border border-purple-300 shadow-2xs">
                🏢 Company: {currentCompany?.code || 'COMP001'}
              </span>
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

        {/* ========================================================================= */}
        {/* 👔 2-TIER HIERARCHICAL SECTIONS & SUB-SECTIONS NAVIGATION ENGINE          */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          
          {/* TIER 1: 3 MAIN PILLAR CATEGORY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              {
                id: 'pipeline_dossiers',
                title: '1. Candidate Pipeline & Registry',
                subtitle: 'Verification Pipeline & Audit Ledger',
                icon: Smartphone,
                activeBorder: 'border-emerald-500 bg-emerald-50/90 text-emerald-950 shadow-md',
                badgeText: `${candidates.length} In Pipeline`,
                defaultTab: 'pipeline'
              },
              {
                id: 'profiler_dispatch',
                title: '2. Candidate Profiler & Dispatch',
                subtitle: '10-Check Matrix & Magic Links',
                icon: Sliders,
                activeBorder: 'border-teal-500 bg-teal-50/90 text-teal-950 shadow-md',
                badgeText: 'New Onboarding',
                defaultTab: 'profiler'
              },
              {
                id: 'statutory_settings',
                title: '3. Analytics, Policies & Settings',
                subtitle: 'TAT Telemetry, Preferences & Rules',
                icon: Settings,
                activeBorder: 'border-indigo-500 bg-indigo-50/90 text-indigo-950 shadow-md',
                badgeText: 'Rules & TAT',
                defaultTab: 'analytics'
              }
            ].map(cat => {
              const Icon = cat.icon;
              const isSelected = activeMainSection === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveMainSection(cat.id);
                    setActiveTab(cat.defaultTab);
                    if (cat.id === 'profiler_dispatch') {
                      setShowAddForm(true);
                    } else {
                      setShowAddForm(false);
                    }
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between relative group ${
                    isSelected 
                      ? `${cat.activeBorder} scale-[1.02]` 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${
                      isSelected ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-white/80 text-slate-900 font-extrabold shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {cat.badgeText}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm tracking-tight">{cat.title}</h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{cat.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* TIER 2: ACTIVE SUB-SECTIONS RIBBON */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-950 text-white shadow-2xl border-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5 text-xs">
              
              <span className="text-[11px] font-black text-slate-950 uppercase tracking-wider px-3 py-1.5 rounded-xl bg-emerald-400 shadow-md shrink-0">
                SUB-SECTIONS:
              </span>

              {/* 1. Pipeline & Dossiers Sub-Sections */}
              {activeMainSection === 'pipeline_dossiers' && (
                <>
                  <button
                    onClick={() => { setActiveMainSection('pipeline_dossiers'); setActiveTab('pipeline'); setShowAddForm(false); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'pipeline' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>1. Candidate Pipeline & Registry ({candidates.length})</span>
                  </button>
                </>
              )}

              {/* 2. Profiler & Dispatch Sub-Sections */}
              {activeMainSection === 'profiler_dispatch' && (
                <>
                  <button
                    onClick={() => { setActiveMainSection('profiler_dispatch'); setActiveTab('profiler'); setShowAddForm(true); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'profiler' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>1. Add Candidate Profile & 10-Check Matrix</span>
                  </button>
                </>
              )}

              {/* 3. Analytics, Policies & Settings Sub-Sections */}
              {activeMainSection === 'statutory_settings' && (
                <>
                  <button
                    onClick={() => { setActiveMainSection('statutory_settings'); setActiveTab('analytics'); setShowAddForm(false); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>1. Telemetry & TAT Analytics</span>
                  </button>
                  <button
                    onClick={() => { setActiveMainSection('statutory_settings'); setActiveTab('settings'); setShowAddForm(false); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'settings' ? 'bg-indigo-700 text-white shadow-md' : 'bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>2. Settings, Email & Rules</span>
                  </button>
                </>
              )}

            </div>

            {/* Quick Add Profile Action */}
            <button
              type="button"
              onClick={() => {
                setActiveMainSection('profiler_dispatch');
                setActiveTab('profiler');
                setShowAddForm(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-950" />
              <span>+ New Profile</span>
            </button>

          </div>

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
            subtitle: `All candidate profiles managed under ${currentCompany?.name || 'Joy Corporate Solutions'}`,
            metricValue: `${candidates.length} Profiles`,
            metricType: 'hr_active',
            data: candidates.map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany?.name || 'Joy Corporate Solutions',
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
              companyName: currentCompany?.name || 'Joy Corporate Solutions',
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
              companyName: currentCompany?.name || 'Joy Corporate Solutions',
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
              companyName: currentCompany?.name || 'Joy Corporate Solutions',
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
              {candidates.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('⚠️ Are you sure you want to clear ALL candidate records? This will delete all candidate profiles, test data, and documents for a clean slate.')) {
                      clearAllCandidates();
                    }
                  }}
                  className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold text-rose-800 bg-rose-50 border-rose-200 hover:bg-rose-100 shadow-2xs cursor-pointer"
                  title="Wipe all test/old candidate records for a clean slate"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Clean Slate 🧹</span>
                </button>
              )}

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
                <option value="Active">🟢 Active ({candidates.filter(c => c.status?.toLowerCase() !== 'inactive').length})</option>
                <option value="Inactive">⚪ Inactive ({candidates.filter(c => c.status?.toLowerCase() === 'inactive').length})</option>
                <option value="Verified">Verified ({candidates.filter(c => c.status === 'Verified').length})</option>
                <option value="In Verification">In Verification ({candidates.filter(c => c.status === 'In Verification' || c.status === 'Pending').length})</option>
                <option value="Submitted - Pending HR Review">Pending HR Review ({candidates.filter(c => c.status === 'Submitted - Pending HR Review').length})</option>
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
                
                const matchesStatus = statusFilter === 'All' 
  ? true 
  : statusFilter === 'Active' 
    ? c.status?.toLowerCase() !== 'inactive' 
    : statusFilter === 'Inactive' 
      ? c.status?.toLowerCase() === 'inactive' 
      : c.status === statusFilter;
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
                        cand.status?.toLowerCase() === 'inactive' ? 'badge-slate bg-slate-300 text-slate-800 font-bold' : cand.status === 'Verified' ? 'badge-emerald' : 
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

                      <button
                        type="button"
                        onClick={() => {
                          const isInactive = cand.status?.toLowerCase() === 'inactive';
                          const actionPrompt = isInactive ? 're-activate' : 'mark as Inactive';
                          if (window.confirm(`Are you sure you want to ${actionPrompt} employee "${cand.name}"?`)) {
                            toggleCandidateStatus(cand.id || cand.token);
                          }
                        }}
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer text-center col-span-2 font-black ${
                          cand.status?.toLowerCase() === 'inactive'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <Power className={`w-3.5 h-3.5 ${cand.status?.toLowerCase() === 'inactive' ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <span>{cand.status?.toLowerCase() === 'inactive' ? '🟢 Reactivate Employee Profile' : '⚪ Mark Employee Inactive'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`⚠️ Permanently delete employee "${cand.name}" (#${cand.empId || cand.id})?\n\nThis will remove all candidate information, statutory forms, and background verification records.`)) {
                            deleteCandidate(cand.id || cand.token);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 flex items-center justify-center gap-1.5 cursor-pointer text-center col-span-2 font-bold text-xs shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>🗑️ Delete Employee Profile</span>
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
                    
                    const matchesStatus = statusFilter === 'All' 
  ? true 
  : statusFilter === 'Active' 
    ? c.status?.toLowerCase() !== 'inactive' 
    : statusFilter === 'Inactive' 
      ? c.status?.toLowerCase() === 'inactive' 
      : c.status === statusFilter;
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
                          cand.status?.toLowerCase() === 'inactive' ? 'badge-slate bg-slate-300 text-slate-800 font-bold' : cand.status === 'Verified' ? 'badge-emerald' : 
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

                          {/* 4.5 Manage / Verify Documents Later */}
                          <button
                            type="button"
                            onClick={() => setManagingDocVerifCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-2xs cursor-pointer"
                            title="Manage, check, and trigger live document verification for this employee"
                          >
                            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Verify Docs ⚡</span>
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

                          {/* 5. Inactive / Activate Toggle */}
                          <button
                            type="button"
                            onClick={() => {
                              const isInactive = cand.status?.toLowerCase() === 'inactive';
                              const actionPrompt = isInactive ? 're-activate' : 'mark as Inactive';
                              if (window.confirm(`Are you sure you want to ${actionPrompt} employee "${cand.name}"?`)) {
                                toggleCandidateStatus(cand.id || cand.token);
                              }
                            }}
                            className={`btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold transition-all cursor-pointer ${
                              cand.status?.toLowerCase() === 'inactive'
                                ? 'text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
                                : 'text-slate-700 bg-slate-100 border-slate-300 hover:bg-slate-200 shadow-2xs'
                            }`}
                            title={cand.status?.toLowerCase() === 'inactive' ? 'Click to Reactivate Employee' : 'Click to Set Employee to Inactive'}
                          >
                            <Power className={`w-3.5 h-3.5 ${cand.status?.toLowerCase() === 'inactive' ? 'text-emerald-600' : 'text-slate-500'}`} />
                            <span>{cand.status?.toLowerCase() === 'inactive' ? 'Activate' : 'Inactive'}</span>
                          </button>

                          {/* 6. Delete Candidate Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`⚠️ Permanently delete employee "${cand.name}" (#${cand.empId || cand.id})?\n\nThis will delete all background verification records, forms, and uploaded documents.`)) {
                                deleteCandidate(cand.id || cand.token);
                              }
                            }}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100 shadow-2xs cursor-pointer"
                            title="Permanently delete this employee profile"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delete</span>
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

            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              {/* 💾 Live Auto-Save Indicator */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-2xs select-none"
                title="All changes are automatically saved to local storage as you type"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[11px]">{lastAutoSaveTime ? `Auto-Saved (${lastAutoSaveTime})` : 'Auto-Save Active ✓'}</span>
              </div>

              {/* Clear Draft / Reset */}
              <button
                type="button"
                onClick={handleClearDraft}
                className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100 cursor-pointer shadow-2xs"
                title="Clear saved draft and start fresh with blank form"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Clear Draft</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMainSection('pipeline_dossiers');
                  setActiveTab('pipeline');
                  setShowAddForm(false);
                }}
                className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold text-slate-700 bg-white border-slate-300 hover:bg-slate-50 cursor-pointer"
                title="Return to Candidate Pipeline table"
              >
                <span>← Back to Pipeline</span>
              </button>

              {/* ⚡ Instant 1-Click Mock Auto-Fill Button */}
              <button
                type="button"
                onClick={handleAutoFillMockData}
                className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-extrabold text-amber-900 bg-amber-50 border-amber-300 hover:bg-amber-100 shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>⚡ Auto-Fill Demo Profile (1-Click Test)</span>
              </button>
            </div>
          </div>



                    {/* 💾 RESTORED DRAFT NOTICE BANNER */}
          {hasRestoredDraft && (
            <div className="p-3.5 bg-gradient-to-r from-amber-50 via-indigo-50/50 to-slate-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-xs animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-amber-950 block font-black text-xs">
                    Draft Auto-Restored from Previous Session {lastAutoSaveTime ? `(Last saved at ${lastAutoSaveTime})` : ''}
                  </strong>
                  <span className="text-[11px] text-slate-600">
                    Your previous work was saved automatically. You can continue typing where you left off or start fresh anytime.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setHasRestoredDraft(false)}
                  className="px-2.5 py-1 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 cursor-pointer text-[11px]"
                >
                  Dismiss ✕
                </button>
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer text-[11px] shadow-2xs"
                >
                  Clear Draft 🗑️
                </button>
              </div>
            </div>
          )}

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

            {/* 📋 MANDATORY DOCUMENT VERIFICATION SELECTION CHECKLIST */}
            <div className="p-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl shadow-lg border border-indigo-500/30 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <span>Document Verification Checklist</span>
                      <span className="badge badge-emerald text-[9px] font-extrabold uppercase">
                        Flexible Policy
                      </span>
                    </h4>
                    <p className="text-[11px] text-indigo-200 font-medium">
                      Select which original documents to verify now. Unchecked documents can still be saved & verified later by HR anytime.
                    </p>
                  </div>
                </div>

                {/* Quick Selection Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        verificationConfig: {
                          ...prev.verificationConfig,
                          aadhaar: true,
                          pan: true,
                          bankCheck: true
                        }
                      }));
                      showToast('⚡ Selected Core 3: Aadhaar, PAN & Bank Account!');
                    }}
                    className="btn btn-secondary text-[10px] py-1.5 px-2.5 font-bold bg-indigo-900/80 text-indigo-200 border-indigo-700 hover:bg-indigo-800 cursor-pointer"
                  >
                    ⚡ Core 3 (Aadhaar+PAN+Bank)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        verificationConfig: {
                          aadhaar: true,
                          pan: true,
                          bankCheck: true,
                          drivingLicense: true,
                          voterId: true,
                          mobileOtp: true,
                          passport: true,
                          uan: true,
                          criminalCheck: true,
                          education: true,
                          directorship: false,
                          faceCapture: true
                        }
                      }));
                      showToast('✨ Selected all document verification gates!');
                    }}
                    className="btn btn-secondary text-[10px] py-1.5 px-2.5 font-bold bg-emerald-900/80 text-emerald-200 border-emerald-700 hover:bg-emerald-800 cursor-pointer"
                  >
                    ✨ Select All 10
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        verificationConfig: {
                          aadhaar: false,
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
                        }
                      }));
                      showToast('⚪ Unchecked all verifications (Employee will save without verification)!');
                    }}
                    className="btn btn-secondary text-[10px] py-1.5 px-2 font-bold bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 cursor-pointer"
                  >
                    Uncheck All
                  </button>
                </div>
              </div>

              {/* Document Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                {[
                  { key: 'aadhaar', name: '1. Aadhaar UIDAI e-KYC', icon: '🪪', provider: 'UIDAI OTP Gateway', desc: 'UIDAI Biometric / OTP Authentication' },
                  { key: 'pan', name: '2. Income Tax PAN Card', icon: '💳', provider: 'NSDL Direct Gateway', desc: 'Name, DOB & Aadhaar Seeding Match' },
                  { key: 'bankCheck', name: '3. Bank Account & Penny Drop', icon: '🏦', provider: 'NPCI IMPS Gateway', desc: '₹1 Live Beneficiary Verification' },
                  { key: 'uan', name: '4. EPFO UAN Service History', icon: '🏛️', provider: 'EPFO Unified Portal', desc: 'Past Service & Moonlighting Clearance' },
                  { key: 'drivingLicense', name: '5. Driving License Check', icon: '🚗', provider: 'MoRTH Sarathi API', desc: 'State Transport & Vehicle Classes' },
                  { key: 'passport', name: '6. Passport Verification', icon: '✈️', provider: 'MEA Direct File API', desc: 'Passport Seeding & Nationality Check' },
                  { key: 'voterId', name: '7. Voter ID Verification', icon: '🗳️', provider: 'Election Commission', desc: 'EPIC Number & Electoral Roll Audit' },
                  { key: 'faceCapture', name: '8. 3D Face Biometric Liveness', icon: '👤', provider: 'AI Liveness Engine', desc: 'Anti-Spoofing & Aadhaar Face Match' },
                  { key: 'education', name: '9. Educational Degree / Marksheet', icon: '🎓', provider: 'Academic Registry', desc: 'Highest Qualification Verification' },
                  { key: 'criminalCheck', name: '10. Relieving / Experience Letter', icon: '💼', provider: 'Past Employer Audit', desc: 'Previous Work History & Relieving' }
                ].map(item => {
                  const isChecked = !!formData.verificationConfig?.[item.key];
                  return (
                    <label
                      key={item.key}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          verificationConfig: {
                            ...(prev.verificationConfig || {}),
                            [item.key]: !isChecked
                          }
                        }));
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all flex items-start gap-2.5 cursor-pointer select-none ${
                        isChecked 
                          ? 'bg-indigo-900/60 border-indigo-400 ring-2 ring-indigo-400/20 shadow-sm' 
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 opacity-75'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="accent-indigo-500 w-4 h-4 rounded mt-0.5 shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-white text-xs truncate">{item.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            isChecked ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {isChecked ? 'Selected ✓' : 'Verify Later'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                        <span className="text-[9px] text-indigo-300/80 font-mono block">{item.provider}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Informative Reassurance Footer */}
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-indigo-500/20 flex items-center justify-between text-[11px] text-indigo-200">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>
                    <strong>Flexible Save Guarantee:</strong> Even if 0 verifications are selected, this employee will be saved successfully in the database. HR can verify any document later using the <strong>"⚡ Verify Docs"</strong> action!
                  </span>
                </div>
              </div>
            </div>

            {/* 🎛️ GLOBAL FIELD DELEGATION CONTROLLER TOOLBAR */}
            <div className="p-3 bg-gradient-to-r from-slate-50 via-indigo-50/60 to-slate-50 border-2 border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 text-white rounded-lg shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-indigo-950 font-black block leading-tight">Field Entry & Link Delegation Control</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Click any <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[10px]">HR 🖥️</span> or <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300 text-[10px]">Link 📱</span> badge to toggle individual fields, or use 1-click batch controls:
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                <button
                  type="button"
                  onClick={() => setAllFieldsMode('hr')}
                  className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 cursor-pointer text-[11px] flex items-center gap-1 shadow-2xs transition-all hover:scale-105 active:scale-95"
                  title="Set all form fields as HR-typed"
                >
                  <span>🖥️ All HR-Typed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAllFieldsMode('link')}
                  className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 cursor-pointer text-[11px] flex items-center gap-1 shadow-2xs transition-all hover:scale-105 active:scale-95"
                  title="Delegate all form fields to Candidate Link"
                >
                  <span>📱 All Candidate Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAllFieldsMode('reset')}
                  className="px-2 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-600 font-bold border border-slate-300 cursor-pointer text-[10px]"
                  title="Reset to smart defaults"
                >
                  <span>🔄 Reset</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: Personal & Demographic Particulars */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>1. Personal, Demographic & Application Form Particulars</span>
                </h4>
                <span className="badge badge-emerald text-[10px] font-black self-start sm:self-auto">Profile Identity Header</span>
              </div>

              {/* 📸 Real-Time Live Photo Capture & WebCam Snapper Card */}
              <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    {formData.photo ? (
                      <div className="relative">
                        <img 
                          src={formData.photo} 
                          alt="Employee" 
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-indigo-900/60 border-2 border-dashed border-indigo-400/50 flex flex-col items-center justify-center text-indigo-300">
                        <Camera className="w-6 h-6" />
                        <span className="text-[9px] font-bold mt-0.5">No Photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-white">Employee Photo & Live Biometric</span>
                      <span className="badge badge-indigo text-[9px] font-bold">HR WebCam / Candidate Selfie</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                      {formData.photo ? (
                        <span className="text-emerald-300 font-bold">✓ Live Photo Attached (Will be bound to Profile PDF & Certificate)</span>
                      ) : (
                        <span>Snap live photo via WebCam now, upload a photo file, or let candidate take selfie from their magic link.</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowHrLivePhotoModal(true)}
                    className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 font-black bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-sm cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{formData.photo ? '📸 Retake WebCam Photo' : '📸 Capture Live Photo (WebCam)'}</span>
                  </button>

                  <label className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold text-slate-200 bg-slate-800 border-slate-700 hover:bg-slate-700 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setFormData(prev => ({ ...prev, photo: re.target.result }));
                            showToast('📸 Employee photo uploaded and attached to profile!');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {formData.photo && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, photo: null }));
                        showToast('Photo removed.');
                      }}
                      className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 cursor-pointer"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              
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

            {/* 🌟 SOCIAL MEDIA & PROFESSIONAL WEB PRESENCE LINKS */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-extrabold text-indigo-700 tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>2B. Professional & Social Media Presence Links</span>
                </h4>
                <span className="badge badge-indigo text-[9px] font-bold">Auto-Bound to Profile Dossier</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  {renderFieldLabel('LinkedIn Profile URL', 'linkedInUrl')}
                  <input 
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedInUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                    className={getFieldInputClass('linkedInUrl', 'form-input font-mono')}
                  />
                </div>
                <div>
                  {renderFieldLabel('GitHub / Code Repository URL', 'githubUrl')}
                  <input 
                    type="url"
                    placeholder="https://github.com/developer-profile"
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className={getFieldInputClass('githubUrl', 'form-input font-mono')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Portfolio / Live Project URL', 'portfolioUrl')}
                  <input 
                    type="url"
                    placeholder="https://portfolio-showcase.dev"
                    value={formData.portfolioUrl || ''}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className={getFieldInputClass('portfolioUrl', 'form-input font-mono')}
                  />
                </div>
                <div>
                  {renderFieldLabel('Twitter (X) / Other Profile', 'twitterUrl')}
                  <input 
                    type="url"
                    placeholder="https://x.com/handle"
                    value={formData.twitterUrl || ''}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    className={getFieldInputClass('twitterUrl', 'form-input font-mono')}
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Dynamic Multi-Row Academic Qualifications */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>3. Academic Qualifications & Degrees (Multi-Entry Matrix)</span>
                </h4>
                
                <button
                  type="button"
                  onClick={handleHrAddEducation}
                  className="px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-black text-xs flex items-center gap-1.5 border border-emerald-300 shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>+ Add Another Qualification</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {(formData.educationList || []).map((edu, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 relative">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-black text-[10px]">
                        Degree / Qualification #{idx + 1}
                      </span>
                      {formData.educationList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleHrRemoveEducation(idx)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Qualification Level *</label>
                        <select 
                          value={edu.qualificationCategory}
                          onChange={(e) => handleHrUpdateEducation(idx, 'qualificationCategory', e.target.value)}
                          className="form-select text-xs font-medium"
                        >
                          {(masterDropdownOptions?.qualificationCategories || ['Under Graduate (UG / Bachelor Degree)', 'Post Graduate (PG / Master Degree)', 'Higher Secondary (12th / HSC)', 'Secondary / 10th Standard (SSLC)', 'Polytechnic Diploma', 'Vocational / ITI Trade Certificate', 'Doctorate / Ph.D']).map(qc => (
                            <option key={qc} value={qc}>{qc}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Degree / Specialization Name *</label>
                        <input 
                          type="text"
                          placeholder="e.g. B.Tech (Computer Science & Engg)"
                          value={edu.degreeName}
                          onChange={(e) => handleHrUpdateEducation(idx, 'degreeName', e.target.value)}
                          className="form-input text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">College / School / Institution *</label>
                        <input 
                          type="text"
                          placeholder="e.g. PSG College of Technology, Coimbatore"
                          value={edu.institutionName}
                          onChange={(e) => handleHrUpdateEducation(idx, 'institutionName', e.target.value)}
                          className="form-input text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Board / University</label>
                        <input 
                          type="text"
                          placeholder="e.g. Anna University / CBSE"
                          value={edu.university || ''}
                          onChange={(e) => handleHrUpdateEducation(idx, 'university', e.target.value)}
                          className="form-input text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Tenure (Join - Passing Year)</label>
                        <div className="flex gap-2">
                          <input 
                            type="number"
                            placeholder="Join (2014)"
                            value={edu.yearOfJoining || ''}
                            onChange={(e) => handleHrUpdateEducation(idx, 'yearOfJoining', e.target.value)}
                            className="form-input text-xs font-mono w-24"
                          />
                          <input 
                            type="number"
                            placeholder="End (2018)"
                            value={edu.yearOfEnd || edu.passingYear || ''}
                            onChange={(e) => {
                              handleHrUpdateEducation(idx, 'yearOfEnd', e.target.value);
                              handleHrUpdateEducation(idx, 'passingYear', e.target.value);
                            }}
                            className="form-input text-xs font-mono flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Score / Percentage / CGPA *</label>
                        <input 
                          type="text"
                          placeholder="e.g. 8.75 CGPA (85.2% Distinction)"
                          value={edu.grade || ''}
                          onChange={(e) => handleHrUpdateEducation(idx, 'grade', e.target.value)}
                          className="form-input text-xs font-mono font-bold text-emerald-800"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Dynamic Multi-Row Previous Employment Experience */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs uppercase font-extrabold text-indigo-700 tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>4. Employment Position, Job Band & Work History (Multi-Entry)</span>
                </h4>

                <button
                  type="button"
                  onClick={handleHrAddExperience}
                  className="px-3 py-1 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-xs flex items-center gap-1.5 border border-indigo-300 shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-700" />
                  <span>+ Add Prior Employer Record</span>
                </button>
              </div>

              {/* Current Job Role Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
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

              {/* Multi-Employer Experience Rows */}
              <div className="space-y-3">
                {(formData.experienceList || []).map((exp, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 relative">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-black text-[10px]">
                        Prior Employer #{idx + 1}
                      </span>
                      {formData.experienceList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleHrRemoveExperience(idx)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Company / Organization Name *</label>
                        <input 
                          type="text"
                          placeholder="e.g. Infosys Limited"
                          value={exp.companyName || exp.institutionName || ''}
                          onChange={(e) => handleHrUpdateExperience(idx, 'companyName', e.target.value)}
                          className="form-input text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Designation / Job Role *</label>
                        <input 
                          type="text"
                          placeholder="e.g. Systems Engineer / Consultant"
                          value={exp.designation || ''}
                          onChange={(e) => handleHrUpdateExperience(idx, 'designation', e.target.value)}
                          className="form-input text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">Company Location / Address</label>
                      <input 
                        type="text"
                        placeholder="e.g. Electronics City, Phase 1, Hosur Road, Bengaluru, KA"
                        value={exp.address || exp.institutionAddress || ''}
                        onChange={(e) => handleHrUpdateExperience(idx, 'address', e.target.value)}
                        className="form-input text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Period of Service (From - To) *</label>
                        <input 
                          type="text"
                          placeholder="06/2021 - 07/2024 (3 Yrs)"
                          value={exp.periodOfService || ''}
                          onChange={(e) => handleHrUpdateExperience(idx, 'periodOfService', e.target.value)}
                          className="form-input text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Last Drawn CTC / Salary *</label>
                        <input 
                          type="text"
                          placeholder="₹8,50,000 PA"
                          value={exp.salaryDrawn || ''}
                          onChange={(e) => handleHrUpdateExperience(idx, 'salaryDrawn', e.target.value)}
                          className="form-input text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1 text-[11px]">Relieving & Service Status</label>
                        <select 
                          value={exp.relievingStatus || 'Relieved with Full Notice ✓'}
                          onChange={(e) => handleHrUpdateExperience(idx, 'relievingStatus', e.target.value)}
                          className="form-select text-xs font-bold text-emerald-800"
                        >
                          <option value="Relieved with Full Notice ✓">Relieved with Full Notice ✓</option>
                          <option value="Service Certificate Verified ✓">Service Certificate Verified ✓</option>
                          <option value="Currently Serving Notice Period">Currently Serving Notice Period</option>
                          <option value="Direct Exit">Direct Exit</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
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

            {/* 📁 SECTION 8: EMPLOYEE REQUIRED DOCUMENTS CHECKLIST & DIRECT UPLOADS (UNIFIED HR GATING) */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-sky-50/80 via-slate-50 to-indigo-50/60 border-2 border-sky-300 rounded-2xl space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-xs">
                    <FolderDown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider">
                        8. Required Documents Checklist & Direct Uploads
                      </h4>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2 py-0.5 rounded-md border border-sky-200">
                        {Object.values(formData.requiredDocumentsConfig || {}).filter(Boolean).length} Mandatory • {Object.keys(formData.uploadedDocuments || {}).length} Uploaded by HR
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Check the box to make a document <strong>Mandatory</strong> for the candidate. HR can also attach available files directly (PDF, PNG, JPG up to 10MB).
                    </p>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      const allReq = {
                        aadhaar: true, pan: true, passportPhoto: true, degree: true,
                        experience: true, salary: true, bank: true, resume: true,
                        signedNda: true, medicalCert: true, passportDl: false,
                        sec_moonlighting: true, sec_assetPolicy: true, sec_githubContrib: false,
                        sec_safetyProtocol: true, sec_gatePass: true, sec_form32Health: true, sec_tradeCert: true,
                        sec_cibilConsent: true, sec_nismCert: true, sec_sebiClearance: true, sec_fidelityBond: true,
                        sec_medicalCouncil: true, sec_immunization: true, sec_lifeSupport: true, sec_cleanroomGmp: true,
                        sec_hmvBadge: true, sec_forkliftLic: true, sec_policeNoc: true, sec_gpsConsent: true,
                        sec_fssaiCert: true, sec_foodHealthCard: true, sec_posCashIndemnity: true,
                        sec_formXIII: true, sec_agencyAgreement: true, sec_workOrderPo: true, sec_esicCard: true
                      };
                      setFormData(prev => ({ ...prev, requiredDocumentsConfig: allReq }));
                      showToast('✓ Marked all key documents as Mandatory!');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold border border-sky-300 cursor-pointer"
                  >
                    Select All Mandatory
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        requiredDocumentsConfig: { aadhaar: true, pan: true, bank: true, degree: true, resume: true }
                      }));
                      showToast('⚡ Reset to Standard Core KYC (5 docs)');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 cursor-pointer"
                  >
                    Standard Only (5)
                  </button>
                </div>
              </div>

              {/* 🌟 SUB-SECTION A: UNIVERSAL KYC & EMPLOYMENT DOCUMENTS */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>A. Universal Standard KYC Documents (All Employees)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Standard Across All Sectors
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: 'aadhaar', title: 'Government Aadhaar Card', icon: '🪪', type: 'aadhaar', desc: 'UIDAI official masked e-Aadhaar or color scan' },
                    { key: 'pan', title: 'Income Tax PAN Card', icon: '💳', type: 'pan', desc: 'NSDL / UTI permanent account card' },
                    { key: 'passportPhoto', title: 'Passport Size Photograph', icon: '📸', type: 'passport_photo', desc: 'Recent professional color portrait' },
                    { key: 'degree', title: 'Degree Marksheet / Certificate', icon: '🎓', type: 'education_certificate', desc: 'Convocation degree or cumulative marksheet' },
                    { key: 'experience', title: 'Previous Relieving Letter', icon: '📜', type: 'experience_letter', desc: 'Formal relieving / service certificate' },
                    { key: 'salary', title: 'Last 3 Months Salary Slips', icon: '💰', type: 'salary_slips', desc: 'Recent payslips or Form 16 breakdown' },
                    { key: 'bank', title: 'Bank Passbook / Cheque Leaf', icon: '🏦', type: 'bank_proof', desc: 'Pre-printed cancelled cheque with IFSC & Name' },
                    { key: 'resume', title: 'Updated Resume / CV', icon: '📄', type: 'resume', desc: 'Latest curriculum vitae of candidate' },
                    { key: 'signedNda', title: 'Signed Employer NDA Copy', icon: '✍️', type: 'signed_contract', desc: 'Executed employee confidentiality agreement' },
                    { key: 'medicalCert', title: 'Medical Fitness Certificate', icon: '🏥', type: 'medical_fitness', desc: 'General health & medical declaration' },
                    { key: 'passportDl', title: 'Passport / Driving License', icon: '🌐', type: 'id_proof', desc: 'Valid passport or MoRTH driving license' }
                  ].map((doc) => {
                    const isMandatory = formData.requiredDocumentsConfig?.[doc.key] ?? true;
                    const uploaded = (formData.uploadedDocuments || {})[doc.key];

                    return (
                      <div 
                        key={doc.key}
                        className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2.5 ${
                          uploaded 
                            ? 'bg-emerald-50/90 border-emerald-500 shadow-2xs' 
                            : isMandatory 
                              ? 'bg-white border-sky-300 shadow-2xs' 
                              : 'bg-slate-50/70 border-slate-200 opacity-75'
                        }`}
                      >
                        {/* Header: Icon, Title, and Mandatory Checkbox */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl shrink-0">{doc.icon}</span>
                            <div className="min-w-0">
                              <strong className="text-slate-900 font-extrabold text-xs block leading-tight truncate">{doc.title}</strong>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1">{doc.desc}</p>
                            </div>
                          </div>

                          {/* Mandatory Checklist Checkbox */}
                          <label className="flex items-center gap-1 shrink-0 cursor-pointer bg-slate-100 hover:bg-sky-100 px-1.5 py-0.5 rounded-md border border-slate-200" title="Check to make mandatory for candidate">
                            <input 
                              type="checkbox"
                              checked={isMandatory}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                requiredDocumentsConfig: {
                                  ...(prev.requiredDocumentsConfig || {}),
                                  [doc.key]: e.target.checked
                                }
                              }))}
                              className="accent-sky-600 w-3.5 h-3.5"
                            />
                            <span className={`text-[9px] font-black uppercase ${isMandatory ? 'text-sky-900' : 'text-slate-500'}`}>
                              {isMandatory ? 'Required *' : 'Optional'}
                            </span>
                          </label>
                        </div>

                        {/* Upload Status / Upload Button */}
                        {uploaded ? (
                          <div className="bg-white p-2 rounded-xl border border-emerald-300 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] font-bold text-emerald-950 truncate block flex-1" title={uploaded.name}>
                                📄 {uploaded.name}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-700 shrink-0 font-mono">
                                {uploaded.file_size_kb} KB
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                              <label className="text-sky-700 hover:text-sky-900 font-bold cursor-pointer underline">
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
                                className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                            <span className="text-[10px] text-slate-500 italic">
                              {isMandatory ? 'Candidate must upload on link 📱' : 'Not attached'}
                            </span>
                            <label className="btn btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 font-bold text-sky-900 bg-sky-50 border-sky-300 hover:bg-sky-100 cursor-pointer shrink-0">
                              <Upload className="w-3 h-3 text-sky-600" />
                              <span>HR Upload</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.png,.jpg,.jpeg,.docx" 
                                onChange={(e) => handleDocFileUpload(doc.key, e.target.files[0], doc.title, doc.type)} 
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🌟 SUB-SECTION B: SPECIALIZED SECTOR / ROLE COMPLIANCE DOCUMENTS */}
              <div className="space-y-2.5 pt-3 border-t border-sky-200">
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
                          { key: 'sec_tradeCert', title: 'ITI / Trade Certificate', icon: '🛠️', type: 'sector_doc', desc: 'National Trade Certificate / Apprenticeship diploma' }
                        ];
                      case 'bfsi':
                        return [
                          { key: 'sec_cibilConsent', title: 'CIBIL Credit Standing Consent', icon: '📊', type: 'sector_doc', desc: 'Signed consent letter for comprehensive credit history audit' },
                          { key: 'sec_nismCert', title: 'NISM / IRDA Certificates', icon: '📜', type: 'sector_doc', desc: 'Series VIII equity derivatives / composite broker certification' },
                          { key: 'sec_sebiClearance', title: 'SEBI Insider Trading Undertaking', icon: '⚖️', type: 'sector_doc', desc: 'Zero personal trading in client scrips & AML clearance' },
                          { key: 'sec_fidelityBond', title: 'Corporate Fidelity Indemnity Bond', icon: '🛡️', type: 'sector_doc', desc: 'Corporate financial fidelity agreement copy' }
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
                    const isMandatory = formData.requiredDocumentsConfig?.[doc.key] ?? true;
                    const uploaded = (formData.uploadedDocuments || {})[doc.key];

                    return (
                      <div 
                        key={doc.key}
                        className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2.5 ${
                          uploaded 
                            ? 'bg-indigo-50/90 border-indigo-500 shadow-2xs' 
                            : isMandatory 
                              ? 'bg-white border-indigo-300 shadow-2xs' 
                              : 'bg-slate-50/70 border-slate-200 opacity-75'
                        }`}
                      >
                        {/* Header: Icon, Title, and Mandatory Checkbox */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl shrink-0">{doc.icon}</span>
                            <div className="min-w-0">
                              <strong className="text-slate-900 font-extrabold text-xs block leading-tight truncate">{doc.title}</strong>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug line-clamp-1">{doc.desc}</p>
                            </div>
                          </div>

                          {/* Mandatory Checklist Checkbox */}
                          <label className="flex items-center gap-1 shrink-0 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded-md border border-indigo-200" title="Check to make mandatory for candidate">
                            <input 
                              type="checkbox"
                              checked={isMandatory}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                requiredDocumentsConfig: {
                                  ...(prev.requiredDocumentsConfig || {}),
                                  [doc.key]: e.target.checked
                                }
                              }))}
                              className="accent-indigo-600 w-3.5 h-3.5"
                            />
                            <span className={`text-[9px] font-black uppercase ${isMandatory ? 'text-indigo-900' : 'text-slate-500'}`}>
                              {isMandatory ? 'Required *' : 'Optional'}
                            </span>
                          </label>
                        </div>

                        {/* Upload Status / Upload Button */}
                        {uploaded ? (
                          <div className="bg-white p-2 rounded-xl border border-indigo-300 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] font-bold text-indigo-950 truncate block flex-1" title={uploaded.name}>
                                📄 {uploaded.name}
                              </span>
                              <span className="text-[9px] font-bold text-indigo-700 shrink-0 font-mono">
                                {uploaded.file_size_kb} KB
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                              <label className="text-indigo-700 hover:text-indigo-900 font-bold cursor-pointer underline">
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
                                className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                            <span className="text-[10px] text-slate-500 italic">
                              {isMandatory ? 'Candidate must upload on link 📱' : 'Not attached'}
                            </span>
                            <label className="btn btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 font-bold text-indigo-900 bg-indigo-50 border-indigo-300 hover:bg-indigo-100 cursor-pointer shrink-0">
                              <Upload className="w-3 h-3 text-indigo-600" />
                              <span>HR Upload</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.png,.jpg,.jpeg,.docx" 
                                onChange={(e) => handleDocFileUpload(doc.key, e.target.files[0], doc.title, doc.type)} 
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 9: Mandatory Upstream API Identity Verification Checks */}

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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                {[
                  { key: 'form11', title: 'Form 11 (EPFO Declaration)', desc: 'Statutory Provident Fund declaration under EPF Act 1952 & EPS 1995', tag: 'EPFO 1952', previewable: true },
                  { key: 'form2', title: 'Form 2 (EPFO Nomination)', desc: 'Revised Nomination & Declaration Form (Part A EPF & Part B EPS Pension)', tag: 'EPFO Form 2', previewable: true },
                  { key: 'esicForm1', title: 'ESIC Form 1 (Declaration & TIC)', desc: 'Employees State Insurance Corporation medical coverage & Temporary ID Card', tag: 'ESIC 1948', previewable: true },
                  { key: 'form16', title: 'Form 16 / TDS Declaration', desc: 'Income Tax Sec 192 / Form 12B tax regime declaration for salaried employees', tag: 'Income Tax', previewable: false },
                  { key: 'formF', title: 'Form F (Gratuity Nomination)', desc: 'Payment of Gratuity Act 1972 statutory family nomination & legal share', tag: 'Gratuity Act', previewable: false },
                  { key: 'nda', title: 'Non-Disclosure Agreement (NDA)', desc: 'Proprietary IP protection & employer confidentiality binding covenant', tag: 'Legal NDA', previewable: false },
                  { key: 'posh', title: 'POSH Code of Conduct', desc: 'Prevention of Sexual Harassment workplace policy & compliance consent', tag: 'HR POSH', previewable: false },
                  { key: 'nonCompete', title: 'Non-Compete & Non-Solicit', desc: 'Post-employment non-compete covenants & business non-solicitation', tag: 'Enterprise', previewable: false },
                  { key: 'contractFormXIII', title: 'Contract Labor Form XIII', desc: 'Contract Labor (Regulation & Abolition) Act register & deployment slip', tag: 'Contract Act', previewable: false }
                ].map((formItem) => {
                  const isChecked = formData.statutoryFormsConfig?.[formItem.key] !== undefined 
                    ? !!formData.statutoryFormsConfig[formItem.key] 
                    : ['form11', 'form2', 'esicForm1', 'form16', 'nda', 'posh'].includes(formItem.key);

                  return (
                    <div
                      key={formItem.key}
                      className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 shadow-xs ${
                        isChecked 
                          ? 'bg-indigo-50/80 border-indigo-500 text-slate-900' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => setFormData({
                            ...formData,
                            statutoryFormsConfig: { 
                              ...(formData.statutoryFormsConfig || {}), 
                              [formItem.key]: e.target.checked 
                            }
                          })}
                          className="accent-indigo-600 mt-1 w-4 h-4 shrink-0 cursor-pointer"
                        />
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <span className="font-black text-xs text-slate-900 leading-tight truncate">{formItem.title}</span>
                            <span className="text-[9px] bg-purple-100 text-purple-900 font-mono font-bold px-2 py-0.5 rounded uppercase">{formItem.tag}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{formItem.desc}</p>
                        </div>
                      </div>

                      {/* Bottom Action & Preview Trigger Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[10px]">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Auto-Filled from Profile ✓
                        </span>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Opening statutory preview for:", formItem.key);
                            setActivePreviewStatutoryForm(formItem.key);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all hover:scale-105 active:scale-95"
                          title="Preview live form with current candidate inputs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Form 👁️</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ✨ SECTION 11: DYNAMIC CUSTOM FORM FIELDS & CUSTOM DOCUMENT SLOTS BUILDER */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-slate-50 border-2 border-indigo-300 rounded-2xl space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                        11. Dynamic Custom Form Fields & Document Slots Builder
                      </h4>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-md border border-indigo-200">
                        {(formData.customFields || []).length} Custom Fields • {(formData.customDocSlots || []).length} Document Slots
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Add company-specific custom text fields or custom document upload requirements. You can pre-fill values now or delegate them to candidate via magic onboarding link!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomFieldModal(true)}
                    className="btn btn-superadmin text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Text Field</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddCustomDocModal(true)}
                    className="btn btn-hrexecutive text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Document Slot</span>
                  </button>
                </div>
              </div>

              {/* 📝 ACTIVE CUSTOM TEXT FIELDS GRID */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Active Custom Text Fields ({(formData.customFields || []).length})</span>
                  </span>
                  {(formData.customFields || []).length > 0 && (
                    <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Adaptive PDF Integration Active ✓
                    </span>
                  )}
                </div>

                {(formData.customFields || []).length === 0 ? (
                  <div className="p-3.5 bg-white/80 border border-dashed border-indigo-200 rounded-xl text-center space-y-1">
                    <p className="text-xs text-slate-500 font-medium">
                      No custom text fields added yet. Click <strong className="text-indigo-700">+ Add Text Field</strong> above to add company-specific data points (e.g. Asset Serial Number, Uniform Size, Shift Preference, Blood Pressure, etc.).
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {(formData.customFields || []).map((field) => (
                      <div
                        key={field.id}
                        className="p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-extrabold text-slate-900 text-xs truncate">
                              {field.label} {field.required && <span className="text-rose-500">*</span>}
                            </span>
                            <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono uppercase font-bold shrink-0">
                              {field.type || 'text'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(field.id)}
                            className="text-rose-400 hover:text-rose-700 p-0.5 text-xs cursor-pointer shrink-0"
                            title="Delete this custom field"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <input
                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
                            placeholder={`Enter ${field.label}...`}
                            value={field.value || ''}
                            onChange={(e) => handleUpdateCustomFieldValue(field.id, e.target.value)}
                            className="form-input text-xs font-bold w-full bg-slate-50 focus:bg-white"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className={field.value ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                            {field.value ? '🏢 Pre-filled by HR' : '📱 Candidate will fill via Link'}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded font-bold ${field.required ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                            {field.required ? 'Mandatory' : 'Optional'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 📂 ACTIVE CUSTOM DOCUMENT SLOTS GRID */}
              <div className="space-y-2 pt-2 border-t border-indigo-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <FolderDown className="w-4 h-4 text-emerald-600" />
                    <span>Active Custom Document Upload Slots ({(formData.customDocSlots || []).length})</span>
                  </span>
                  {(formData.customDocSlots || []).length > 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Exhibits & Dossier PDF Ready ✓
                    </span>
                  )}
                </div>

                {(formData.customDocSlots || []).length === 0 ? (
                  <div className="p-3.5 bg-white/80 border border-dashed border-emerald-200 rounded-xl text-center space-y-1">
                    <p className="text-xs text-slate-500 font-medium">
                      No custom document slots added yet. Click <strong className="text-emerald-700">+ Add Document Slot</strong> above to request specialized certificates or documents (e.g. Vaccination Proof, NDA Copy, Specific Trade Licenses).
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {(formData.customDocSlots || []).map((slot) => {
                      const uploaded = (formData.uploadedDocuments || {})[slot.id || slot.key];
                      return (
                        <div
                          key={slot.id || slot.key}
                          className={`p-3 rounded-xl border-2 transition-all space-y-2 ${
                            uploaded
                              ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                              : 'bg-white border-indigo-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h5 className="font-extrabold text-slate-900 text-xs truncate">
                                📄 {slot.title}
                              </h5>
                              <p className="text-[10px] text-slate-500 line-clamp-1">
                                {slot.desc || 'Company specific document requirement'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomDocSlot(slot.id || slot.key)}
                              className="text-rose-400 hover:text-rose-700 p-0.5 text-xs cursor-pointer shrink-0"
                              title="Delete this document slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {uploaded ? (
                            <div className="p-2 bg-emerald-100/70 border border-emerald-300 rounded-lg space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                                <span className="truncate flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">{uploaded.name}</span>
                                </span>
                                <span className="text-[10px] bg-emerald-200 px-1.5 py-0.2 rounded font-mono shrink-0">
                                  {uploaded.file_size_kb} KB
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-1 border-t border-emerald-200 text-[10px]">
                                <label className="text-emerald-800 hover:text-emerald-950 font-bold cursor-pointer underline">
                                  Replace File
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                                    onChange={(e) => handleDocFileUpload(slot.id || slot.key, e.target.files[0], slot.title, slot.type || 'custom_doc')}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeUploadedDoc(slot.id || slot.key)}
                                  className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                                >
                                  ✕ Remove File
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                              <span className="text-[10px] text-slate-500 italic">
                                Candidate uploads on link 📱
                              </span>
                              <label className="btn btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 font-bold text-emerald-900 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 cursor-pointer shrink-0">
                                <Upload className="w-3 h-3 text-emerald-600" />
                                <span>HR Upload</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                                  onChange={(e) => handleDocFileUpload(slot.id || slot.key, e.target.files[0], slot.title, slot.type || 'custom_doc')}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => { setActiveMainSection('pipeline_dossiers'); setActiveTab('pipeline'); setShowAddForm(false); }} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
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
            {/* 📧 Dedicated HR Recruiter Outgoing SMTP Mail Server & Password Card */}
            <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-white space-y-6 shadow-xs mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-base">
                        HR Recruiter Outgoing Mail Server (SMTP) & Credentials
                      </h4>
                      <span className="badge badge-indigo text-[10px] font-bold">RECRUITER WORKSTATION</span>
                    </div>
                    <p className="text-slate-500 text-xs">
                      Configure your official webmail password, outgoing SMTP server, and candidate email signature
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveHrPreferences}
                  disabled={isSavingHrPref}
                  className="btn btn-hrexecutive text-xs py-2 px-5 flex items-center gap-1.5 font-black shadow-md cursor-pointer shrink-0"
                >
                  {isSavingHrPref ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSavingHrPref ? 'Saving...' : '💾 Save Mail Configuration'}</span>
                </button>
              </div>

              {/* SMTP MAIL SERVER CONFIGURATION GRID */}
              <div>
                <div className="text-[11px] font-black text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <span>📬 Outgoing SMTP Mail Server Details:</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SMTP Host Server *</label>
                    <input 
                      type="text" 
                      value={hrPreferences.smtp_host || 'mail.joycorporatesolutions.com'}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, smtp_host: e.target.value })}
                      placeholder="mail.joycorporatesolutions.com"
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SMTP Port *</label>
                    <input 
                      type="number" 
                      value={hrPreferences.smtp_port || 465}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, smtp_port: parseInt(e.target.value) || 465 })}
                      placeholder="465"
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SMTP Username / Email *</label>
                    <input 
                      type="email" 
                      value={hrPreferences.smtp_user || activeHr.email || ''}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, smtp_user: e.target.value })}
                      placeholder={activeHr.email || "haripriya@joycorporatesolutions.com"}
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">SMTP Webmail Password *</label>
                    <div className="relative">
                      <input 
                        type={showSmtpPassword ? 'text' : 'password'} 
                        value={hrPreferences.smtp_password || ''}
                        onChange={(e) => setHrPreferences({ ...hrPreferences, smtp_password: e.target.value })}
                        placeholder="••••••••••••"
                        className="form-input font-mono pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showSmtpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Recruiter Display Name</label>
                    <input 
                      type="text" 
                      value={hrPreferences.sender_display_name || `${activeHr.name} (${currentCompany?.name || 'Joy Corporate Solutions'})`}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, sender_display_name: e.target.value })}
                      placeholder={`${activeHr.name} (${currentCompany?.name || 'Joy Corporate Solutions'})`}
                      className="form-input font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sender Email Address</label>
                    <input 
                      type="email" 
                      value={hrPreferences.sender_email || activeHr.email || ''}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, sender_email: e.target.value })}
                      placeholder={activeHr.email}
                      className="form-input font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Supervisor / Team Lead CC Email</label>
                    <input 
                      type="email" 
                      value={hrPreferences.cc_email || ''}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, cc_email: e.target.value })}
                      placeholder="ta_manager@joycorporatesolutions.com"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Notification Email</label>
                    <input 
                      type="email" 
                      value={hrPreferences.notification_email || activeHr.email || ''}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, notification_email: e.target.value })}
                      placeholder={activeHr.email}
                      className="form-input font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* LIVE DIAGNOSTIC SMTP TEST BAR */}
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={testSmtpEmail}
                    onChange={(e) => setTestSmtpEmail(e.target.value)}
                    placeholder="Enter test recipient email..."
                    className="form-input text-xs w-full sm:w-72 font-mono bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleTestHrSmtp}
                    disabled={isTestingSmtp}
                    className="btn btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 font-bold bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 cursor-pointer shadow-2xs whitespace-nowrap"
                  >
                    {isTestingSmtp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <SendHorizontal className="w-3.5 h-3.5" />}
                    <span>{isTestingSmtp ? 'Sending Test...' : 'Send Live Test Email 📨'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-indigo-800 font-medium">
                  Dispatches a diagnostic test email to verify credentials & deliverability.
                </div>
              </div>

              {/* CUSTOM SIGNATURE */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Custom Recruiter Email Signature & Disclaimer</label>
                <textarea 
                  rows={2}
                  value={hrPreferences.custom_signature || `Best regards,\n${activeHr.name}\n${activeHr.dept || 'Human Resources'}\n${currentCompany?.name || 'Joy Corporate Solutions'}`}
                  onChange={(e) => setHrPreferences({ ...hrPreferences, custom_signature: e.target.value })}
                  placeholder={`Best regards,\n${activeHr.name} | Talent Acquisition`}
                  className="form-input text-xs font-mono"
                />
              </div>

              {/* Instant Notification Checkboxes */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Instant Recruiter Email Alerts:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <label className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70">
                    <div>
                      <strong className="text-slate-900 block font-bold text-[11px]">📱 Candidate Link Sent</strong>
                      <span className="text-[10px] text-slate-500">Confirm email delivery to candidate</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={hrPreferences.auto_email_candidate_link !== false}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, auto_email_candidate_link: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 shrink-0 ml-2"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70">
                    <div>
                      <strong className="text-slate-900 block font-bold text-[11px]">✅ Verification Passed</strong>
                      <span className="text-[10px] text-slate-500">Alert when 10+ APIs pass 100%</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={hrPreferences.notify_on_candidate_verified !== false}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, notify_on_candidate_verified: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 shrink-0 ml-2"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70">
                    <div>
                      <strong className="text-slate-900 block font-bold text-[11px]">🚨 Discrepancy Found</strong>
                      <span className="text-[10px] text-slate-500">Urgent moonlighting/court alert</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={hrPreferences.notify_on_red_flags !== false}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, notify_on_red_flags: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 shrink-0 ml-2"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70">
                    <div>
                      <strong className="text-slate-900 block font-bold text-[11px]">📊 Daily Digest</strong>
                      <span className="text-[10px] text-slate-500">Summary of active candidates</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={hrPreferences.daily_digest === true}
                      onChange={(e) => setHrPreferences({ ...hrPreferences, daily_digest: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 shrink-0 ml-2"
                    />
                  </label>
                </div>
              </div>

              {/* 🔐 CHANGE WORKSTATION LOGIN PASSWORD */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      <strong className="text-xs font-black text-slate-900">Change Workstation Login Password</strong>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">User: {activeHr.email}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-72">
                      <input
                        type={showHrNewPassword ? 'text' : 'password'}
                        value={hrNewPassword}
                        onChange={(e) => setHrNewPassword(e.target.value)}
                        placeholder="Enter new login password..."
                        className="form-input text-xs font-mono font-bold pr-9 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowHrNewPassword(!showHrNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showHrNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleUpdateHrLoginPassword}
                      disabled={isUpdatingHrPassword || !hrNewPassword}
                      className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingHrPassword ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                      <span>{isUpdatingHrPassword ? 'Updating...' : '🔐 Update Login Password'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

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

            {/* 📸 Dedicated HR Live WebCam Photo Capture Modal */}
      {showHrLivePhotoModal && (
        <LivePhotoCaptureModal
          isOpen={showHrLivePhotoModal}
          currentPhoto={formData.photo}
          onClose={() => setShowHrLivePhotoModal(false)}
          onPhotoCaptured={(photoUrl) => {
            setFormData(prev => ({ ...prev, photo: photoUrl }));
            setShowHrLivePhotoModal(false);
            showToast('📸 Live employee photo captured and attached to profile!');
          }}
        />
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
      {viewingUploadedDocsCandidate && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setViewingUploadedDocsCandidate(null);
              setSelectedDocPreview(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn my-auto relative z-10">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
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
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
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
        </div>,
        document.body
      )}

      {/* 👁️ SINGLE DOCUMENT INSPECTION PREVIEW OVERLAY */}
      {selectedDocPreview && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedDocPreview(null);
          }}
        >
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn my-auto relative z-10">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
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

            <div className="p-6 bg-slate-100 space-y-4 text-xs font-mono overflow-y-auto flex-1">
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

            <div className="p-3 bg-white border-t border-slate-200 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="btn btn-secondary text-xs py-1.5 px-4 font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 🔍 HR CANDIDATE SUBMISSION REVIEW & APPROVAL CONSOLE MODAL */}
      {reviewingCandidate && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setReviewingCandidate(null);
              setShowCorrectionInput(false);
            }
          }}
        >
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn my-auto relative z-10">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
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
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
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
        </div>,
        document.body
      )}

      {/* 🌟 STATUTORY FORM LIVE PREVIEW MODAL */}
      {activePreviewStatutoryForm && (
        <StatutoryFormPreviewModal
          formKey={activePreviewStatutoryForm}
          formData={formData}
          companyName={currentCompany?.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}
          onClose={() => setActivePreviewStatutoryForm(null)}
        />
      )}

      {/* ⚡ MODAL: MANAGE & VERIFY DOCUMENTS LATER */}
      {managingDocVerifCandidate && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setManagingDocVerifCandidate(null);
          }}
        >
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xl border border-slate-200 animate-modal-spring max-h-[92vh] overflow-hidden flex flex-col my-auto relative z-10">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Verify Documents & KYC Checklist ⚡
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {managingDocVerifCandidate.name} • #{managingDocVerifCandidate.empId || 'EMP-2026'} • {currentCompany?.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setManagingDocVerifCandidate(null)} 
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 space-y-4 pr-1 text-xs">
              <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-2xl text-indigo-950 space-y-1">
                <span className="font-bold block text-xs">💡 On-Demand Document Verification & Dispatch:</span>
                <p className="text-[11px] text-indigo-900 leading-relaxed font-medium">
                  Select which document authentications to execute now or dispatch to the candidate via magic onboarding link.
                </p>
              </div>

              {/* 10-Document Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'aadhaar', name: '1. Aadhaar UIDAI e-KYC', icon: '🪪', provider: 'UIDAI OTP Gateway' },
                  { key: 'pan', name: '2. Income Tax PAN Card', icon: '💳', provider: 'NSDL Direct Gateway' },
                  { key: 'bankCheck', name: '3. Bank Account & Penny Drop', icon: '🏦', provider: 'NPCI IMPS Gateway' },
                  { key: 'uan', name: '4. EPFO UAN Service History', icon: '🏛️', provider: 'EPFO Unified Portal' },
                  { key: 'drivingLicense', name: '5. Driving License Check', icon: '🚗', provider: 'MoRTH Sarathi API' },
                  { key: 'passport', name: '6. Passport Verification', icon: '✈️', provider: 'MEA Direct File API' },
                  { key: 'voterId', name: '7. Voter ID Verification', icon: '🗳️', provider: 'Election Commission' },
                  { key: 'faceCapture', name: '8. 3D Face Biometric Liveness', icon: '👤', provider: 'AI Liveness Engine' },
                  { key: 'education', name: '9. Academic Degree / Marksheet', icon: '🎓', provider: 'Academic Registry' },
                  { key: 'criminalCheck', name: '10. Relieving / Experience Letter', icon: '💼', provider: 'Past Employer Audit' }
                ].map((doc) => {
                  const isChecked = !!managingDocVerifCandidate.verificationConfig?.[doc.key];
                  const isVerified = managingDocVerifCandidate.verificationsCompleted?.[doc.key];
                  return (
                    <div
                      key={doc.key}
                      onClick={() => {
                        const updated = {
                          ...managingDocVerifCandidate,
                          verificationConfig: {
                            ...(managingDocVerifCandidate.verificationConfig || {}),
                            [doc.key]: !isChecked
                          }
                        };
                        setManagingDocVerifCandidate(updated);
                        setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 select-none ${
                        isVerified
                          ? 'bg-emerald-50/90 border-emerald-400'
                          : isChecked
                            ? 'bg-indigo-50/90 border-indigo-400 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{doc.icon}</span>
                        <div className="min-w-0">
                          <strong className="text-slate-900 font-extrabold text-xs block truncate">{doc.name}</strong>
                          <span className="text-[9px] text-slate-500 font-mono block truncate">{doc.provider}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isVerified
                          ? 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                          : isChecked
                            ? 'bg-indigo-200 text-indigo-900'
                            : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isVerified ? 'Verified ✓' : isChecked ? 'Selected' : 'Verify Later'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 shrink-0 text-xs">
              <button
                type="button"
                onClick={() => setManagingDocVerifCandidate(null)}
                className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const cand = managingDocVerifCandidate;
                    setManagingDocVerifCandidate(null);
                    setDispatchingCandidate(cand);
                  }}
                  className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dispatch Link 📲</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const cand = managingDocVerifCandidate;
                    showToast(`⚡ Running live verification checks for ${cand.name}...`);
                    setTimeout(() => {
                      showToast(`✅ Live document verifications complete for ${cand.name}!`);
                      setManagingDocVerifCandidate(null);
                    }, 1200);
                  }}
                  className="btn btn-hrexecutive text-xs py-2 px-4 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute Gateway Verification ⚡</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* 📝 MODAL: ADD DYNAMIC CUSTOM TEXT FIELD */}
      {showAddCustomFieldModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddCustomFieldModal(false);
          }}
        >
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 animate-modal-spring my-auto relative z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>+ Add Dynamic Custom Text Field</span>
              </h4>
              <button onClick={() => setShowAddCustomFieldModal(false)} className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Title / Label *</label>
                <input
                  type="text"
                  placeholder="e.g. Asset Serial Number, Blood Pressure, Uniform Size"
                  value={legacyFieldLabel}
                  onChange={(e) => setLegacyFieldLabel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Data Type</label>
                  <select
                    value={legacyFieldType}
                    onChange={(e) => setLegacyFieldType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="text">Text (Single Line)</option>
                    <option value="number">Number / Integer</option>
                    <option value="date">Date Picker</option>
                    <option value="email">Email Address</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mandatory?</label>
                  <select
                    value={legacyFieldRequired ? 'yes' : 'no'}
                    onChange={(e) => setLegacyFieldRequired(e.target.value === 'yes')}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="yes">Yes (Required)</option>
                    <option value="no">No (Optional)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAddCustomFieldModal(false)}
                className="btn btn-secondary text-xs py-2 px-3 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLegacyCustomField}
                className="btn btn-superadmin text-xs py-2 px-4 font-bold shadow-md cursor-pointer"
              >
                + Add Field
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 📂 MODAL: ADD DYNAMIC CUSTOM DOCUMENT SLOT */}
      {showAddCustomDocModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddCustomDocModal(false);
          }}
        >
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 animate-modal-spring my-auto relative z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FolderDown className="w-4 h-4 text-emerald-600" />
                <span>+ Add Custom Document Upload Slot</span>
              </h4>
              <button onClick={() => setShowAddCustomDocModal(false)} className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. COVID Vaccine Certificate, NDA Acceptance, Form 16"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Instructions for Candidate</label>
                <textarea
                  placeholder="e.g. Please upload clear scanned PDF copy signed by authorized physician."
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs h-20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAddCustomDocModal(false)}
                className="btn btn-secondary text-xs py-2 px-3 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomDocSlot}
                className="btn btn-emerald text-xs py-2 px-4 font-bold shadow-md cursor-pointer"
              >
                + Create Document Slot
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};