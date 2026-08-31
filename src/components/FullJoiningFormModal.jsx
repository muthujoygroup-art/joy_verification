import { EpfoForm11 } from './statutory/EpfoForm11';
import { EpfoForm2 } from './statutory/EpfoForm2';
import { EsicForm1 } from './statutory/EsicForm1';
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { evaluateVerificationReadiness } from '../utils/verificationRequirements';
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  CreditCard, 
  Users, 
  KeyRound, 
  Smartphone, 
  CheckCircle2, 
  Send, 
  Save, 
  X, 
  Sparkles, 
  Building2, 
  FolderDown, 
  FileText, 
  Eye, 
  Upload, 
  FileCheck, 
  Mail, 
  Database, 
  Loader2, 
  Cpu, 
  Factory, 
  Landmark, 
  Stethoscope, 
  Truck, 
  ShoppingBag, 
  HardHat, 
  Layers,
  AlertCircle,
  HeartPulse,
  Award,
  Plus,
  Trash2
} from 'lucide-react';

export const FullJoiningFormModal = ({ candidate, isHrMode = false, onClose, onSubmitComplete }) => {
  const { updateCandidateVerification, submitCandidateJoiningForm, showToast, masterDropdownOptions } = useApp();

  const [activeSection, setActiveSection] = useState('personal'); // 'personal' | 'address' | 'education' | 'employment' | 'govt' | 'bank' | 'nominee' | 'industry' | 'documents' | 'statutory_agreements'
  const [previewDoc, setPreviewDoc] = useState(null);

  const jfd = candidate?.joiningFormData || {};
  const candSpec = candidate?.industrySpecialization || jfd.industrySpecialization || {};

  const [formData, setFormData] = useState({
    // Section 1: Basic Personal & Profile Identity
    fullName: candidate?.name || jfd.fullName || 'Muthu Kumar P',
    empId: candidate?.emp_id || candidate?.empId || jfd.empId || 'JOY-2026-001',
    employeeNumber: candidate?.employee_number || jfd.employeeNumber || 'EN-884912',
    status: candidate?.status || jfd.status || 'In Verification',
    workingCompany: jfd.workingCompany || 'JOY CORPORATE SOLUTIONS PVT LTD',
    dept: candidate?.dept || jfd.dept || 'Engineering & Software Architecture',
    designation: candidate?.designation || jfd.designation || 'Senior Software Engineer',
    mobile: candidate?.mobile || jfd.mobile || '+91 98765 43210',
    dob: candidate?.dob || jfd.dob || '1996-05-15',
    age: candidate?.age || jfd.age || '30',
    doj: candidate?.doj || jfd.doj || '2026-09-01',
    motherTongue: candidate?.mother_tongue || jfd.motherTongue || 'Tamil',
    languagesKnown: candidate?.languages_known || jfd.languagesKnown || 'English (Fluent), Tamil (Native), Hindi',
    gender: candidate?.gender || jfd.gender || 'Male',
    maritalStatus: candidate?.marital_status || jfd.maritalStatus || 'Single',
    religion: candidate?.religion || jfd.religion || 'Hindu',
    caste: candidate?.caste || jfd.caste || 'General',
    category: candidate?.category || jfd.category || 'General',
    identificationMarks: candidate?.identification_marks || jfd.identificationMarks || 'Mole on right collar bone, scar on left knee',
    employeeCategory: candidate?.employee_type || candidate?.employeeCategory || jfd.employeeCategory || 'it_tech',

    // Section 2: Contact, Native Domicile & Addresses
    alternateMobile: candidate?.alternateMobile || jfd.alternateMobile || '+91 98111 22334',
    email: candidate?.email || jfd.email || 'muthu.kumar@joycorporatesolutions.com',
    state: candidate?.native_state || jfd.state || 'Tamil Nadu',
    city: candidate?.native_district || jfd.city || 'Chennai',
    area: candidate?.area || jfd.area || 'Koramangala 4th Block, Bengaluru',
    pincode: candidate?.pincode || jfd.pincode || '560034',
    presentAddress: candidate?.presentAddress || jfd.presentAddress || '#42, 3rd Floor, Koramangala 4th Block, Bengaluru - 560034',
    permanentAddress: candidate?.permanentAddress || jfd.permanentAddress || 'No 15, North Car Street, Madurai, TN - 625001',
    nativeState: candidate?.native_state || jfd.nativeState || 'Tamil Nadu',
    nativeDistrict: candidate?.native_district || jfd.nativeDistrict || 'Madurai',
    emergencyContactName: candidate?.emergencyContactName || jfd.emergencyContactName || 'Suresh Kumar (Father)',
    emergencyContactPhone: candidate?.emergencyContactPhone || jfd.emergencyContactPhone || '+91 98765 43211',

    // Section 3: Statutory Identifiers & Banking
    aadhaarNo: candidate?.aadhaar_no || candidate?.aadhaarNo || jfd.aadhaarNo || '5489 1234 9876',
    panNo: candidate?.panNo || jfd.panNo || 'ABCDE1234F',
    pfNumber: candidate?.pf_number || candidate?.uanEpf || jfd.pfNumber || jfd.uanEpf || '101239019283',
    esiNumber: candidate?.esi_number || candidate?.esicNo || jfd.esiNumber || jfd.esicNo || '5300918239',
    drivingLicense: candidate?.drivingLicense || jfd.drivingLicense || 'KA-01201900124',
    passportNo: candidate?.passportNo || jfd.passportNo || 'Z8491024',
    voterId: candidate?.voterId || jfd.voterId || 'WZK8912301',
    uanEpf: candidate?.pf_number || candidate?.uanEpf || jfd.uanEpf || '101239019283',
    esicNo: candidate?.esi_number || candidate?.esicNo || jfd.esicNo || '5300918239',

    // Banking Details
    bankName: candidate?.bankName || jfd.bankName || 'HDFC Bank Limited',
    accountHolderName: candidate?.name || jfd.accountHolderName || 'Muthu Kumar P',
    bankAccountNo: candidate?.bankAccountNo || jfd.bankAccountNo || '501002349845',
    ifscCode: candidate?.ifscCode || jfd.ifscCode || 'HDFC0000128',
    bankBranch: jfd.bankBranch || 'Koramangala 4th Block Branch, Bengaluru',

    // Section 4: Education Details (Multi-Entry)
    educationList: jfd.educationList || [
      { institutionName: 'PSG College of Technology, Coimbatore', degreeName: 'B.Tech in Computer Science & Engg', yearOfJoining: '2014', yearOfEnd: '2018', grade: '8.75 CGPA (85.2%)' },
      { institutionName: 'St. Joseph Higher Secondary School, Madurai', degreeName: 'Higher Secondary (12th Standard)', yearOfJoining: '2012', yearOfEnd: '2014', grade: '94.5% Distinction' }
    ],

    // Section 5: Family Member Particulars
    fatherName: candidate?.fatherName || jfd.fatherName || 'Suresh Kumar P',
    fatherAge: jfd.fatherAge || '58',
    fatherMobile: jfd.fatherMobile || '+91 98765 43211',
    fatherOccupation: jfd.fatherOccupation || 'Retired Govt Officer',
    motherName: candidate?.motherName || jfd.motherName || 'Meenakshi S',
    motherAge: jfd.motherAge || '54',
    motherMobile: jfd.motherMobile || '+91 98765 43212',
    motherOccupation: jfd.motherOccupation || 'Homemaker',
    spouseDetails: jfd.spouseDetails || 'N/A (Single)',
    childrenDetails: jfd.childrenDetails || 'N/A (None)',
    nomineeName: candidate?.nomineeName || jfd.nomineeName || 'Meenakshi S',
    nomineeRelation: candidate?.nomineeRelation || jfd.nomineeRelation || 'Mother (100% Share)',
    nomineeDob: jfd.nomineeDob || '1970-08-12',
    nomineeAadhaar: jfd.nomineeAadhaar || '9812 3456 7890',
    insuranceDependents: candidate?.insuranceDependents || jfd.insuranceDependents || 'Dependent Parents',

    // Section 6: Personal Achievements & Extracurricular Activities
    personalAchievements: jfd.personalAchievements || 'Winner of National Hackathon 2023, Published IEEE Research Paper on Distributed Systems Architecture',
    extraCurricularActivities: jfd.extraCurricularActivities || 'State Level Badminton Player, Active Blood Donor with Red Cross Society',

    // Section 7: Employment Experience (Multi-Entry)
    experienceList: jfd.experienceList || [
      { institutionName: 'Infosys Limited', institutionAddress: 'Electronics City, Phase 1, Hosur Road, Bengaluru', designation: 'Systems Engineer', periodOfService: '06/2021 - 07/2024 (3 Yrs 2 Mos)', salaryDrawn: '₹8,50,000 Per Annum (₹62,000/mo)', reasonForLeaving: 'Career advancement, higher architectural ownership, role alignment' }
    ],

    // Section 8: Health, Lifestyle & Background Disclosures (Conditional Yes/No)
    isSmoker: jfd.isSmoker || 'No',
    cigarettesPerDay: jfd.cigarettesPerDay || '0',
    hasMajorSurgery: jfd.hasMajorSurgery || 'No',
    surgeryDetails: jfd.surgeryDetails || '',
    hasIllnessIssues: jfd.hasIllnessIssues || 'No',
    illnessDetails: jfd.illnessDetails || '',
    ownsHouse: jfd.ownsHouse || 'Yes',
    houseCityTown: jfd.houseCityTown || 'Madurai, Tamil Nadu',
    hasOtherIncome: jfd.hasOtherIncome || 'No',
    otherIncomeDetails: jfd.otherIncomeDetails || '',
    hasCriminalConviction: jfd.hasCriminalConviction || 'No',
    convictionDetails: jfd.convictionDetails || '',

    // Section 9: Group Relationship & Reference Liberty
    relatedToGroupEmployee: jfd.relatedToGroupEmployee || 'No',
    relatedEmployeeDetails: jfd.relatedEmployeeDetails || '',
    previouslyInterviewedInGroup: jfd.previouslyInterviewedInGroup || 'No',
    previousInterviewDetails: jfd.previousInterviewDetails || '',
    contactPresentEmployerLiberty: jfd.contactPresentEmployerLiberty || 'Yes',
    contactPreviousEmployerLiberty: jfd.contactPreviousEmployerLiberty || 'Yes',

    // Section 11: Uploaded Documents Map
    uploadedDocuments: jfd.uploadedDocuments || candidate?.uploadedDocuments || {},

    // Section 10: Industry Specialization
    industrySpecialization: {
      industryType: candidate?.employeeCategory || jfd.employeeCategory || candSpec.industryType || 'it_tech',
      techStack: candSpec.techStack || 'React, Node.js, Python, PostgreSQL, AWS',
      githubUrl: candSpec.githubUrl || 'https://github.com/developer-profile',
      portfolioUrl: candSpec.portfolioUrl || 'https://portfolio-showcase.dev',
      laptopAssetTag: candSpec.laptopAssetTag || 'ASSET-LT-2026-088 (MacBook Pro)',
      dualEmploymentDisclosure: candSpec.dualEmploymentDisclosure || 'No Dual Employment / 100% Exclusive Commitment',
      plantLocation: candSpec.plantLocation || 'Chennai Automotive Assembly Plant - Unit 3',
      shiftRoster: candSpec.shiftRoster || 'General Shift (9:00 AM - 5:30 PM)',
      safetyShoeSize: candSpec.safetyShoeSize || 'UK 9 / EUR 43 (Steel Toe)',
      occupationalHealthCertNo: candSpec.occupationalHealthCertNo || 'MED-FIT-CHN-2026-912',
      gatePassId: candSpec.gatePassId || 'GATE-PASS-PL3-8812',
      cibilScoreRange: candSpec.cibilScoreRange || '795 - 830 (Prime Credit Standing)',
      certificationsBfsi: candSpec.certificationsBfsi || 'NISM Series VIII Equity Derivatives',
      fidelityBondLimit: candSpec.fidelityBondLimit || '₹10,00,000 (Ten Lakhs Indemnity)',
      medicalCouncilRegNo: candSpec.medicalCouncilRegNo || 'MCI-2018-091823',
      departmentWard: candSpec.departmentWard || 'Intensive Care Unit (ICU) & Trauma',
      immunizationStatus: candSpec.immunizationStatus || 'Hepatitis B (3 Doses Complete), Tetanus Toxoid 2026',
      commercialDlBadgeNo: candSpec.commercialDlBadgeNo || 'TN-01-TR-2018-98412',
      forkliftLicenseNo: candSpec.forkliftLicenseNo || 'MHE-FL-TN-2022-881',
      policeNocNumber: candSpec.policeNocNumber || 'POL-TN-CHN-2026-9041',
      fssaiCertNo: candSpec.fssaiCertNo || 'FSSAI-FOSTAC-2025-9921',
      uniformShirtSize: candSpec.uniformShirtSize || 'M (38 cm Shirt)',
      assignedStoreCode: candSpec.assignedStoreCode || 'RET-BLR-PHOENIX-04',
      contractFormXIIIEnrollmentNo: candSpec.contractFormXIIIEnrollmentNo || 'CL-RA-2026-FORM-XIII-912',
      contractorAgencyName: candSpec.contractorAgencyName || 'First Choice Manpower Solutions Pvt Ltd',
      workOrderPoNumber: candSpec.workOrderPoNumber || 'PO-JOY-2026-CW-410'
    }
  });

  // OTP Verification States
  const [showAadhaarOtpModal, setShowAadhaarOtpModal] = useState(false);
  const [showMobileOtpModal, setShowMobileOtpModal] = useState(false);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  
  // Aadhaar Live Data Fetching & e-KYC telemetry states
  const [isFetchingAadhaarData, setIsFetchingAadhaarData] = useState(false);
  const [aadhaarFetchProgress, setAadhaarFetchProgress] = useState(0);
  const [aadhaarFetchStep, setAadhaarFetchStep] = useState(0);

  const [aadhaarInputOtp, setAadhaarInputOtp] = useState('');
  const [mobileInputOtp, setMobileInputOtp] = useState('');
  const [emailInputOtp, setEmailInputOtp] = useState('');

  const [aadhaarVerified, setAadhaarVerified] = useState(candidate?.verificationsCompleted?.aadhaar || false);
  const [mobileVerified, setMobileVerified] = useState(candidate?.verificationsCompleted?.mobile || false);
  const [emailVerified, setEmailVerified] = useState(candidate?.verificationsCompleted?.email || false);

  // Universal Document File Upload Handler
  const handleFileUpload = (docKey, file, customTitle = '') => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        name: file.name,
        type: file.type.includes('pdf') ? 'application/pdf' : file.type.includes('png') ? 'image/png' : 'image/jpeg',
        size: `${Math.round(file.size / 1024)} KB`,
        file_size_kb: Math.round(file.size / 1024),
        dataUrl: e.target.result,
        title: customTitle || file.name,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        verified: true,
        hash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      };

      setFormData(prev => ({
        ...prev,
        uploadedDocuments: {
          ...(prev.uploadedDocuments || {}),
          [docKey]: fileData
        }
      }));
      showToast(`✓ Uploaded ${file.name} successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedDoc = (docKey) => {
    setFormData(prev => {
      const updated = { ...(prev.uploadedDocuments || {}) };
      delete updated[docKey];
      return { ...prev, uploadedDocuments: updated };
    });
  };

  const handleAutoAttachMockDocs = () => {
    const mockMap = {
      docAadhaar: { name: 'Aadhaar_Card_Masked_Front_Back.pdf', type: 'application/pdf', size: '240 KB', file_size_kb: 240, verified: true, uploadedAt: '2026-08-30 10:15:00', hash: 'SHA256-AADH8891' },
      docPan: { name: 'PAN_Card_NSDL_Verified.pdf', type: 'application/pdf', size: '185 KB', file_size_kb: 185, verified: true, uploadedAt: '2026-08-30 10:16:00', hash: 'SHA256-PAN9924' },
      docPassportPhoto: { name: 'Passport_Size_Color_Photo.jpg', type: 'image/jpeg', size: '120 KB', file_size_kb: 120, verified: true, uploadedAt: '2026-08-30 10:17:00', hash: 'SHA256-PHT1029' },
      docSpecimenSignature: { name: 'Official_Specimen_Signature.png', type: 'image/png', size: '85 KB', file_size_kb: 85, verified: true, uploadedAt: '2026-08-30 10:18:00', hash: 'SHA256-SIG7712' },
      docDegreeCert: { name: 'BTech_Degree_Convocation_Cert.pdf', type: 'application/pdf', size: '420 KB', file_size_kb: 420, verified: true, uploadedAt: '2026-08-30 10:19:00', hash: 'SHA256-DEG5541' },
      docConsolidatedMarksheet: { name: 'Consolidated_Semester_Marksheet.pdf', type: 'application/pdf', size: '510 KB', file_size_kb: 510, verified: true, uploadedAt: '2026-08-30 10:20:00', hash: 'SHA256-MRK8842' },
      docHsc12thMarksheet: { name: 'HSC_12th_Marksheet_Board.pdf', type: 'application/pdf', size: '310 KB', file_size_kb: 310, verified: true, uploadedAt: '2026-08-30 10:21:00', hash: 'SHA256-HSC4412' },
      docSslc10thMarksheet: { name: 'SSLC_10th_Standard_Certificate.pdf', type: 'application/pdf', size: '290 KB', file_size_kb: 290, verified: true, uploadedAt: '2026-08-30 10:22:00', hash: 'SHA256-SSL3319' },
      docRelievingLetter: { name: 'Infosys_Official_Relieving_Letter.pdf', type: 'application/pdf', size: '380 KB', file_size_kb: 380, verified: true, uploadedAt: '2026-08-30 10:23:00', hash: 'SHA256-REL1192' },
      docExperienceCertificate: { name: 'Formal_Service_Experience_Certificate.pdf', type: 'application/pdf', size: '340 KB', file_size_kb: 340, verified: true, uploadedAt: '2026-08-30 10:24:00', hash: 'SHA256-EXP8813' },
      docSalarySlips3Months: { name: 'Last_3_Months_Payslips_Combined.pdf', type: 'application/pdf', size: '620 KB', file_size_kb: 620, verified: true, uploadedAt: '2026-08-30 10:25:00', hash: 'SHA256-SAL9941' },
      docBankCancelledCheque: { name: 'HDFC_Preprinted_Cancelled_Cheque.jpg', type: 'image/jpeg', size: '195 KB', file_size_kb: 195, verified: true, uploadedAt: '2026-08-30 10:26:00', hash: 'SHA256-BNK3321' },
      docMedicalFitnessCert: { name: 'Pre_Employment_Medical_Fitness_Certificate.pdf', type: 'application/pdf', size: '275 KB', file_size_kb: 275, verified: true, uploadedAt: '2026-08-30 10:27:00', hash: 'SHA256-MED7721' },
      docSignedNda: { name: 'Executed_NDA_IP_Assignment_Signed.pdf', type: 'application/pdf', size: '480 KB', file_size_kb: 480, verified: true, uploadedAt: '2026-08-30 10:28:00', hash: 'SHA256-NDA6619' }
    };

    // Add sector specific mock
    if (formData.employeeCategory === 'manufacturing') {
      mockMap.docTradeCert = { name: 'NCVT_ITI_Machinist_Certificate.pdf', type: 'application/pdf', size: '310 KB', file_size_kb: 310, verified: true };
      mockMap.docForm33 = { name: 'Factories_Act_Form33_Health_Report.pdf', type: 'application/pdf', size: '280 KB', file_size_kb: 280, verified: true };
    } else if (formData.employeeCategory === 'bfsi') {
      mockMap.docCaCfaMembership = { name: 'ICAI_Chartered_Accountant_Certificate.pdf', type: 'application/pdf', size: '390 KB', file_size_kb: 390, verified: true };
      mockMap.docFidelityIndemnityBond = { name: 'Employee_Fidelity_Indemnity_Bond.pdf', type: 'application/pdf', size: '410 KB', file_size_kb: 410, verified: true };
    } else if (formData.employeeCategory === 'logistics') {
      mockMap.docCommercialDl = { name: 'Commercial_HMV_Transport_License.pdf', type: 'application/pdf', size: '220 KB', file_size_kb: 220, verified: true };
      mockMap.docVisionForm1A = { name: 'Form1A_Night_Blindness_Fitness.pdf', type: 'application/pdf', size: '260 KB', file_size_kb: 260, verified: true };
    } else if (formData.employeeCategory === 'healthcare') {
      mockMap.docCouncilReg = { name: 'Medical_Nursing_Council_Registration.pdf', type: 'application/pdf', size: '340 KB', file_size_kb: 340, verified: true };
      mockMap.docLifeSupportCert = { name: 'AHA_BLS_ACLS_Life_Support_Card.pdf', type: 'application/pdf', size: '290 KB', file_size_kb: 290, verified: true };
      mockMap.docVaccinationRecord = { name: 'HepatitisB_Tetanus_Vaccination_Card.pdf', type: 'application/pdf', size: '210 KB', file_size_kb: 210, verified: true };
    } else if (formData.employeeCategory === 'retail') {
      mockMap.docFieldSalesDl = { name: 'Two_Wheeler_Driving_License.pdf', type: 'application/pdf', size: '190 KB', file_size_kb: 190, verified: true };
      mockMap.docFssaiFoodCert = { name: 'FSSAI_FoSTaC_Food_Safety_Cert.pdf', type: 'application/pdf', size: '310 KB', file_size_kb: 310, verified: true };
    }

    setFormData(prev => ({
      ...prev,
      uploadedDocuments: mockMap
    }));
    showToast('🚀 Auto-attached 14+ verified KYC & industry document proofs!');
  };

  const handleAadhaarOtpSubmit = (e) => {
    e.preventDefault();
    if (aadhaarInputOtp.length < 4) {
      alert('Please enter valid 6-digit OTP code.');
      return;
    }
    setShowAadhaarOtpModal(false);
    setIsFetchingAadhaarData(true);
    setAadhaarFetchProgress(15);
    setAadhaarFetchStep(0);

    setTimeout(() => {
      setAadhaarFetchProgress(50);
      setAadhaarFetchStep(1);
    }, 600);

    setTimeout(() => {
      setAadhaarFetchProgress(85);
      setAadhaarFetchStep(2);
    }, 1200);

    setTimeout(() => {
      setAadhaarFetchProgress(100);
      setAadhaarFetchStep(3);

      // Auto-populate verified official UIDAI data into form fields
      setFormData(prev => ({
        ...prev,
        fullName: candidate?.name || 'Rajesh Suresh Kumar',
        fatherName: 'Suresh Kumar',
        dob: '1996-05-15',
        gender: 'Male',
        presentAddress: '124, Green Glen Layout, Bellandur, Bengaluru, KA - 560103',
        permanentAddress: '124, Green Glen Layout, Bellandur, Bengaluru, KA - 560103'
      }));

      setAadhaarVerified(true);
      setIsFetchingAadhaarData(false);
      if (candidate) updateCandidateVerification(candidate.token, 'aadhaar', true);
      showToast('🎉 UIDAI e-KYC Data Fetched! Profile fields auto-populated and verified.');
    }, 1800);
  };

  const handleMobileOtpSubmit = (e) => {
    e.preventDefault();
    if (mobileInputOtp.length < 4) {
      alert('Please enter valid 6-digit SMS OTP code.');
      return;
    }
    setMobileVerified(true);
    setShowMobileOtpModal(false);
    if (candidate) updateCandidateVerification(candidate.token, 'mobile', true);
    showToast('Mobile Number SMS OTP Verified!');
  };

  const handleEmailOtpSubmit = (e) => {
    e.preventDefault();
    if (emailInputOtp.length < 4) {
      alert('Please enter valid 6-digit Email OTP.');
      return;
    }
    setEmailVerified(true);
    setShowEmailOtpModal(false);
    if (candidate) updateCandidateVerification(candidate.token, 'email', true);
    showToast('Official Email Address Verified!');
  };

  // Multi-entry Education List handlers
  const handleAddEducation = () => {
    setFormData({
      ...formData,
      educationList: [
        ...(formData.educationList || []),
        { institutionName: '', degreeName: '', yearOfJoining: '', yearOfEnd: '', grade: '' }
      ]
    });
  };

  const handleUpdateEducation = (index, field, value) => {
    const list = [...(formData.educationList || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, educationList: list });
  };

  const handleRemoveEducation = (index) => {
    const list = [...(formData.educationList || [])];
    list.splice(index, 1);
    setFormData({ ...formData, educationList: list });
  };

  // Multi-entry Experience List handlers
  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experienceList: [
        ...(formData.experienceList || []),
        { institutionName: '', institutionAddress: '', designation: '', periodOfService: '', salaryDrawn: '', reasonForLeaving: '' }
      ]
    });
  };

  const handleUpdateExperience = (index, field, value) => {
    const list = [...(formData.experienceList || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, experienceList: list });
  };

  const handleRemoveExperience = (index) => {
    const list = [...(formData.experienceList || [])];
    list.splice(index, 1);
    setFormData({ ...formData, experienceList: list });
  };

  const handleFinalFormSubmit = (e) => {
    e.preventDefault();
    if (!aadhaarVerified || !mobileVerified) {
      alert('Mandatory OTP Verification Required: Please complete both Aadhaar OTP and Mobile OTP verification before submitting.');
      return;
    }

    if (candidate?.token) {
      submitCandidateJoiningForm(candidate.token, formData);
    }

    if (onSubmitComplete) {
      onSubmitComplete(formData);
    }
    
    if (onClose) onClose();
  };

  const candidateReadiness = useMemo(() => {
    return evaluateVerificationReadiness({
      ...formData,
      fullName: formData.fullName,
      accountNo: formData.accountNo
    });
  }, [formData]);

  const renderCandidateFieldLabel = (label, fieldKey, isRequired = false) => {
    const hasPreFilledVal = !!(candidate?.[fieldKey] || candidate?.joiningFormData?.[fieldKey]);
    const currentVal = formData[fieldKey];
    const isFilled = !!(currentVal && currentVal.toString().trim().length > 0);

    return (
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-slate-700 font-bold leading-tight">
          {label} {isRequired && <span className="text-rose-500">*</span>}
        </span>
        {hasPreFilledVal ? (
          <span className="text-[8px] font-black px-1.5 py-0.2 rounded border bg-emerald-50 text-emerald-800 border-emerald-300">
            Pre-filled by HR 🏢 ✓
          </span>
        ) : isFilled ? (
          <span className="text-[8px] font-black px-1.5 py-0.2 rounded border bg-indigo-50 text-indigo-800 border-indigo-300">
            Filled by You ✓
          </span>
        ) : (
          <span className="text-[8px] font-black px-1.5 py-0.2 rounded border bg-amber-100 text-amber-900 border-amber-300 animate-pulse">
            Required 📱 ⚠️
          </span>
        )}
      </div>
    );
  };

  const getCandidateFieldInputClass = (fieldKey, baseClass = 'form-input') => {
    const hasPreFilledVal = !!(candidate?.[fieldKey] || candidate?.joiningFormData?.[fieldKey]);
    const currentVal = formData[fieldKey];
    const isFilled = !!(currentVal && currentVal.toString().trim().length > 0);

    if (!isFilled && !hasPreFilledVal) {
      return `${baseClass} border-amber-300 bg-amber-50/20 focus:border-amber-500 focus:bg-white`;
    }
    if (hasPreFilledVal) {
      return `${baseClass} border-emerald-300 bg-emerald-50/10 focus:border-emerald-500`;
    }
    return `${baseClass} border-slate-300 bg-white focus:border-indigo-500`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl max-h-[94vh] overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl sm:rounded-3xl my-auto animate-modal-spring">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-purple text-[10px]">CiteHR Enterprise Format</span>
              <span className="text-xs text-slate-500 font-bold">• {isHrMode ? 'HR Manual Entry & Station Verification' : 'Candidate Joining Form'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">Exhaustive Employee / Labor Profile Joining Form</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg p-1 cursor-pointer btn-interactive">✕</button>
        </div>

        {/* Mandatory OTP Verification Status Bar */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>Mandatory Verification Status:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Aadhaar Badge / Button */}
            {aadhaarVerified ? (
              <span className="badge badge-emerald text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aadhaar e-KYC Fetched & Verified ✅</span>
              </span>
            ) : (
              <button 
                type="button"
                onClick={() => setShowAadhaarOtpModal(true)}
                className="btn btn-superadmin text-[11px] py-1 px-3 flex items-center gap-1 cursor-pointer btn-interactive"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verify Aadhaar OTP & Fetch Data *</span>
              </button>
            )}

            {/* Mobile Badge / Button */}
            {mobileVerified ? (
              <span className="badge badge-emerald text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mobile SMS OTP Verified ✅</span>
              </span>
            ) : (
              <button 
                type="button"
                onClick={() => setShowMobileOtpModal(true)}
                className="btn btn-company text-[11px] py-1 px-3 flex items-center gap-1 cursor-pointer btn-interactive"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Verify Mobile SMS OTP *</span>
              </button>
            )}

            {/* Email Badge / Button */}
            {emailVerified ? (
              <span className="badge badge-emerald text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Email OTP Verified ✅</span>
              </span>
            ) : (
              <button 
                type="button"
                onClick={() => setShowEmailOtpModal(true)}
                className="btn btn-secondary text-[11px] py-1 px-3 flex items-center gap-1 bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100 cursor-pointer btn-interactive"
              >
                <Mail className="w-3.5 h-3.5 text-purple-700" />
                <span>Verify Email OTP</span>
              </button>
            )}
          </div>
        </div>

        {/* 🎯 CANDIDATE GUIDED ACTION & VERIFICATION READINESS NOTIFICATION BANNER */}
        <div className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl border border-indigo-500/30 text-xs space-y-2.5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <strong className="text-white text-xs">Employee Action Checklist & Document Readiness Guide:</strong>
            </div>
            <span className="text-[9px] bg-indigo-800/80 text-indigo-200 px-2 py-0.5 rounded font-mono font-bold self-start sm:self-auto">
              {candidateReadiness.readyChecks.length} / {candidateReadiness.totalChecks} Checks Ready ({candidateReadiness.completionScore}%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {/* Ready */}
            <div className="p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg space-y-1">
              <span className="text-emerald-300 font-bold block text-[10px] uppercase tracking-wider">
                ✅ Ready for Instant Verification ({candidateReadiness.readyChecks.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {candidateReadiness.readyChecks.map(c => (
                  <span key={c.id} className="px-1.5 py-0.5 bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 rounded text-[9px] font-bold">
                    {c.icon} {c.shortName}
                  </span>
                ))}
              </div>
            </div>

            {/* Pending */}
            <div className="p-2 bg-amber-950/40 border border-amber-500/30 rounded-lg space-y-1">
              <span className="text-amber-300 font-bold block text-[10px] uppercase tracking-wider">
                ⚠️ Complete These Remaining Fields for Full Verification ({candidateReadiness.pendingChecks.length}):
              </span>
              <div className="space-y-1 max-h-20 overflow-y-auto pr-1">
                {candidateReadiness.pendingChecks.map(c => (
                  <div key={c.id} className="text-[10px] text-slate-300 leading-tight">
                    <strong className="text-amber-200">{c.shortName}:</strong> Fill {c.missingFields.map(f => f.label).join(', ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Section Navigation Tabs (11 Comprehensive Sections) */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar text-xs font-bold gap-1 shadow-2xs">
          {[
            { id: 'personal', label: '1. Profile & Bio', icon: User },
            { id: 'address', label: '2. Native & Address', icon: MapPin },
            { id: 'govt', label: '3. Statutory & Bank', icon: CreditCard },
            { id: 'education', label: '4. Education (Multi)', icon: GraduationCap },
            { id: 'nominee', label: '5. Family & Nominee', icon: Users },
            { id: 'employment', label: '6. Work Experience', icon: Briefcase },
            { id: 'achievements', label: '7. Achievements', icon: Award },
            { id: 'health_lifestyle', label: '8. Health & Background', icon: HeartPulse },
            { id: 'group_relations', label: '9. Group Relations', icon: ShieldCheck },
            { id: 'industry', label: '10. Industry Matrix', icon: Cpu },
            { id: 'documents', label: '11. Documents & Sign', icon: FolderDown },
            { id: 'statutory_forms', label: '12. Statutory Forms (EPFO / ESIC)', icon: Scale }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer btn-interactive tab-interactive font-bold ${
                  isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Master Joining Form Body */}
        <form onSubmit={handleFinalFormSubmit} className="space-y-4 text-xs max-h-[55vh] overflow-y-auto pr-1">
          {/* SECTION 1: PERSONAL & BIO DEMOGRAPHICS */}
          {activeSection === 'personal' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Section 1: Basic Personal Profile & Bio Demographics</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Standard Enterprise HR Application Form</span>
              </div>
              
              {/* Row 1: Identification & Names */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  {renderCandidateFieldLabel('Employee Name', 'fullName', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.fullName} 
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className={getCandidateFieldInputClass('fullName', 'form-input font-bold')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Employee ID', 'empId', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.empId} 
                    onChange={e => setFormData({ ...formData, empId: e.target.value })}
                    className={getCandidateFieldInputClass('empId', 'form-input font-mono font-bold')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Employee Number', 'employeeNumber', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.employeeNumber} 
                    onChange={e => setFormData({ ...formData, employeeNumber: e.target.value })}
                    className={getCandidateFieldInputClass('employeeNumber', 'form-input font-mono')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Employment Status', 'status')}
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className={getCandidateFieldInputClass('status', 'form-select text-xs font-bold text-indigo-700')}
                  >
                    <option value="In Verification">In Verification</option>
                    <option value="Link Sent">Link Sent</option>
                    <option value="Verified">Verified & Active</option>
                    <option value="Probation">On Probation</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Company, Dept, Designation, DOJ */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  {renderCandidateFieldLabel('Working Company', 'workingCompany', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.workingCompany} 
                    onChange={e => setFormData({ ...formData, workingCompany: e.target.value })}
                    className={getCandidateFieldInputClass('workingCompany')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Department', 'dept', true)}
                  <select 
                    value={formData.dept} 
                    onChange={e => setFormData({ ...formData, dept: e.target.value })}
                    className={getCandidateFieldInputClass('dept', 'form-select text-xs font-bold')}
                  >
                    {(masterDropdownOptions?.departments || ['Engineering & Software Architecture', 'Operations', 'Finance & Accounts', 'Human Resources', 'Sales & Marketing', 'Quality Assurance']).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderCandidateFieldLabel('Designation', 'designation', true)}
                  <select 
                    value={formData.designation} 
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className={getCandidateFieldInputClass('designation', 'form-select text-xs font-bold')}
                  >
                    {(masterDropdownOptions?.designations || ['Senior Software Engineer', 'Software Architect', 'Product Specialist', 'Operations Lead', 'Branch Manager', 'Associate']).map(desig => (
                      <option key={desig} value={desig}>{desig}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderCandidateFieldLabel('Date of Joining (DOJ)', 'doj', true)}
                  <input 
                    type="date" 
                    required 
                    value={formData.doj} 
                    onChange={e => setFormData({ ...formData, doj: e.target.value })}
                    className={getCandidateFieldInputClass('doj')} 
                  />
                </div>
              </div>

              {/* Row 3: DOB, Age, Gender, Marital Status */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  {renderCandidateFieldLabel('Date of Birth (DOB)', 'dob', true)}
                  <input 
                    type="date" 
                    required 
                    value={formData.dob} 
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className={getCandidateFieldInputClass('dob')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Age (Years)', 'age', true)}
                  <input 
                    type="number" 
                    required 
                    min="18"
                    max="80"
                    value={formData.age} 
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className={getCandidateFieldInputClass('age', 'form-input font-bold')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Gender', 'gender', true)}
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className={getCandidateFieldInputClass('gender', 'form-select text-xs')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  {renderCandidateFieldLabel('Status Married / Unmarried', 'maritalStatus', true)}
                  <select 
                    value={formData.maritalStatus} 
                    onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className={getCandidateFieldInputClass('maritalStatus', 'form-select text-xs')}
                  >
                    <option value="Single">Single / Unmarried</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Languages, Religion, Caste, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div>
                  {renderCandidateFieldLabel('Mother Language', 'motherTongue', true)}
                  <input 
                    type="text" 
                    required
                    value={formData.motherTongue} 
                    onChange={e => setFormData({ ...formData, motherTongue: e.target.value })}
                    placeholder="e.g. Tamil, Hindi, Telugu"
                    className={getCandidateFieldInputClass('motherTongue')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Known Languages', 'languagesKnown', true)}
                  <input 
                    type="text" 
                    required
                    value={formData.languagesKnown} 
                    onChange={e => setFormData({ ...formData, languagesKnown: e.target.value })}
                    placeholder="e.g. English, Tamil, Hindi"
                    className={getCandidateFieldInputClass('languagesKnown')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Religion', 'religion')}
                  <select 
                    value={formData.religion} 
                    onChange={e => setFormData({ ...formData, religion: e.target.value })}
                    className={getCandidateFieldInputClass('religion', 'form-select text-xs')}
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
                  {renderCandidateFieldLabel('Caste', 'caste')}
                  <input 
                    type="text" 
                    value={formData.caste} 
                    onChange={e => setFormData({ ...formData, caste: e.target.value })}
                    placeholder="Optional Caste"
                    className={getCandidateFieldInputClass('caste')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Category', 'category', true)}
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className={getCandidateFieldInputClass('category', 'form-select text-xs font-bold')}
                  >
                    <option value="General">General (OC)</option>
                    <option value="OBC">OBC (BC / MBC)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Identification Marks & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  {renderCandidateFieldLabel('Identification Marks (Physical Scars / Moles)', 'identificationMarks', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.identificationMarks} 
                    onChange={e => setFormData({ ...formData, identificationMarks: e.target.value })}
                    placeholder="e.g. Mole on right collar bone, scar on left knee"
                    className={getCandidateFieldInputClass('identificationMarks')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Blood Group', 'bloodGroup', true)}
                  <select 
                    value={formData.bloodGroup} 
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className={getCandidateFieldInputClass('bloodGroup', 'form-select text-xs font-bold')}
                  >
                    {(masterDropdownOptions?.bloodGroups || ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']).map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CONTACT & ADDRESS INFORMATION */}
          {activeSection === 'address' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Section 2: Contact, Native Domicile & Address Information</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Courier & Statutory Police Jurisdiction</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {renderCandidateFieldLabel('Mobile Number (SMS & WhatsApp)', 'mobile', true)}
                  <input 
                    type="tel" 
                    required 
                    value={formData.mobile} 
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className={getCandidateFieldInputClass('mobile', 'form-input font-bold')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Official / Personal Email Address', 'email', true)}
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={getCandidateFieldInputClass('email')} 
                  />
                </div>
              </div>

              <div>
                {renderCandidateFieldLabel('Residential Address (Present Physical Stay)', 'presentAddress', true)}
                <textarea 
                  rows="2" 
                  required 
                  value={formData.presentAddress} 
                  onChange={e => setFormData({ ...formData, presentAddress: e.target.value })}
                  placeholder="House / Flat No, Building Name, Street, Area, City, PIN"
                  className={getCandidateFieldInputClass('presentAddress', 'form-textarea text-xs')} 
                />
              </div>

              <div>
                {renderCandidateFieldLabel('Permanent Address (Native Home / Aadhaar)', 'permanentAddress', true)}
                <textarea 
                  rows="2" 
                  required 
                  value={formData.permanentAddress} 
                  onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })}
                  placeholder="Permanent village / hometown address as per sovereign records"
                  className={getCandidateFieldInputClass('permanentAddress', 'form-textarea text-xs')} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  {renderCandidateFieldLabel('Native State', 'nativeState', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.nativeState} 
                    onChange={e => setFormData({ ...formData, nativeState: e.target.value })}
                    placeholder="e.g. Tamil Nadu"
                    className={getCandidateFieldInputClass('nativeState')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Native District', 'nativeDistrict', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.nativeDistrict} 
                    onChange={e => setFormData({ ...formData, nativeDistrict: e.target.value })}
                    placeholder="e.g. Madurai"
                    className={getCandidateFieldInputClass('nativeDistrict')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Current City & State', 'city', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.city} 
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bengaluru, KA"
                    className={getCandidateFieldInputClass('city')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Postal Pincode', 'pincode', true)}
                  <input 
                    type="text" 
                    required 
                    maxLength="6"
                    value={formData.pincode} 
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 560034"
                    className={getCandidateFieldInputClass('pincode', 'form-input font-mono font-bold')} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  {renderCandidateFieldLabel('Emergency Contact Person & Relationship', 'emergencyContactName', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.emergencyContactName} 
                    onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="e.g. Suresh Kumar (Father)"
                    className={getCandidateFieldInputClass('emergencyContactName')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Emergency Phone Number', 'emergencyContactPhone', true)}
                  <input 
                    type="tel" 
                    required 
                    value={formData.emergencyContactPhone} 
                    onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    placeholder="e.g. +91 98765 43211"
                    className={getCandidateFieldInputClass('emergencyContactPhone')} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: STATUTORY IDENTIFIERS & BANKING */}
          {activeSection === 'govt' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Section 3: Statutory Social Security & Banking Payroll Details</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Instant e-KYC Verification</span>
              </div>

              {/* Statutory Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  {renderCandidateFieldLabel('Aadhaar Number (12 Digits)', 'aadhaarNo', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.aadhaarNo} 
                    onChange={e => setFormData({ ...formData, aadhaarNo: e.target.value })}
                    className={getCandidateFieldInputClass('aadhaarNo', 'form-input font-mono font-bold')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Tax PAN Card Number', 'panNo', true)}
                  <input 
                    type="text" 
                    required 
                    value={formData.panNo} 
                    onChange={e => setFormData({ ...formData, panNo: e.target.value })}
                    className={getCandidateFieldInputClass('panNo', 'form-input font-mono font-bold')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('PF Number / UAN (EPFO)', 'pfNumber', true)}
                  <input 
                    type="text" 
                    required
                    value={formData.pfNumber} 
                    onChange={e => setFormData({ ...formData, pfNumber: e.target.value, uanEpf: e.target.value })}
                    placeholder="12-digit UAN"
                    className={getCandidateFieldInputClass('pfNumber', 'form-input font-mono')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('ESI Number (IP Number)', 'esiNumber')}
                  <input 
                    type="text" 
                    value={formData.esiNumber} 
                    onChange={e => setFormData({ ...formData, esiNumber: e.target.value, esicNo: e.target.value })}
                    placeholder="10-digit IP No"
                    className={getCandidateFieldInputClass('esiNumber', 'form-input font-mono')} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  {renderCandidateFieldLabel('Driving License (DL) Number', 'drivingLicense')}
                  <input 
                    type="text" 
                    value={formData.drivingLicense} 
                    onChange={e => setFormData({ ...formData, drivingLicense: e.target.value })}
                    className={getCandidateFieldInputClass('drivingLicense', 'form-input font-mono')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Passport Number', 'passportNo')}
                  <input 
                    type="text" 
                    value={formData.passportNo} 
                    onChange={e => setFormData({ ...formData, passportNo: e.target.value })}
                    className={getCandidateFieldInputClass('passportNo', 'form-input font-mono')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Voter ID Card Number', 'voterId')}
                  <input 
                    type="text" 
                    value={formData.voterId} 
                    onChange={e => setFormData({ ...formData, voterId: e.target.value })}
                    className={getCandidateFieldInputClass('voterId', 'form-input font-mono')} 
                  />
                </div>
              </div>

              {/* Banking Details Header */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-2">
                  🏦 Direct Salary Deposit & Banking Details:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    {renderCandidateFieldLabel('Bank Name', 'bankName', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.bankName} 
                      onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank Limited"
                      className={getCandidateFieldInputClass('bankName', 'form-input font-bold')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Account Holder Name', 'accountHolderName', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.accountHolderName} 
                      onChange={e => setFormData({ ...formData, accountHolderName: e.target.value })}
                      className={getCandidateFieldInputClass('accountHolderName')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Bank Account Number', 'bankAccountNo', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.bankAccountNo} 
                      onChange={e => setFormData({ ...formData, bankAccountNo: e.target.value })}
                      className={getCandidateFieldInputClass('bankAccountNo', 'form-input font-mono font-bold')} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    {renderCandidateFieldLabel('Bank IFSC Code', 'ifscCode', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.ifscCode} 
                      onChange={e => setFormData({ ...formData, ifscCode: e.target.value })}
                      className={getCandidateFieldInputClass('ifscCode', 'form-input font-mono font-bold')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Bank Branch Name & Location', 'bankBranch', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.bankBranch} 
                      onChange={e => setFormData({ ...formData, bankBranch: e.target.value })}
                      placeholder="e.g. Koramangala 4th Block Branch"
                      className={getCandidateFieldInputClass('bankBranch')} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: EDUCATION DETAILS MATRIX (MULTI-ENTRY) */}
          {activeSection === 'education' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <div>
                  <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Section 4: Educational Qualifications & Degrees (Multi-Entry)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Add all educational degrees from 10th, 12th, Graduation to Post-Graduation</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="btn btn-superadmin text-xs py-1.5 px-3 font-bold flex items-center gap-1 cursor-pointer btn-interactive shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Qualification</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.educationList || []).map((edu, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono font-black text-[10px]">
                        Qualification #{idx + 1}
                      </span>
                      {formData.educationList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(idx)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Name of the Institution / College *</label>
                        <input
                          type="text"
                          required
                          value={edu.institutionName}
                          onChange={e => handleUpdateEducation(idx, 'institutionName', e.target.value)}
                          placeholder="e.g. PSG College of Technology, Coimbatore"
                          className="form-input font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Degree Name / Specialization *</label>
                        <input
                          type="text"
                          required
                          value={edu.degreeName}
                          onChange={e => handleUpdateEducation(idx, 'degreeName', e.target.value)}
                          placeholder="e.g. B.Tech in Computer Science & Engg"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Year of Joining *</label>
                        <input
                          type="number"
                          required
                          min="1980"
                          max="2030"
                          value={edu.yearOfJoining}
                          onChange={e => handleUpdateEducation(idx, 'yearOfJoining', e.target.value)}
                          placeholder="e.g. 2014"
                          className="form-input font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Year of End / Graduation *</label>
                        <input
                          type="number"
                          required
                          min="1980"
                          max="2030"
                          value={edu.yearOfEnd}
                          onChange={e => handleUpdateEducation(idx, 'yearOfEnd', e.target.value)}
                          placeholder="e.g. 2018"
                          className="form-input font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Grade / Percentage / CGPA *</label>
                        <input
                          type="text"
                          required
                          value={edu.grade}
                          onChange={e => handleUpdateEducation(idx, 'grade', e.target.value)}
                          placeholder="e.g. 8.75 CGPA (85.2%)"
                          className="form-input font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: FAMILY MEMBER PARTICULARS */}
          {activeSection === 'nominee' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Section 5: Family Member Particulars & Nominee Record</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">EPFO Form 2 & Gratuity Form F</span>
              </div>

              {/* Father Details */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">👨 Father Details:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    {renderCandidateFieldLabel('Father Name', 'fatherName', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.fatherName} 
                      onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                      className={getCandidateFieldInputClass('fatherName')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Father Age', 'fatherAge', true)}
                    <input 
                      type="number" 
                      required 
                      value={formData.fatherAge} 
                      onChange={e => setFormData({ ...formData, fatherAge: e.target.value })}
                      className={getCandidateFieldInputClass('fatherAge')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Father Mobile Number', 'fatherMobile', true)}
                    <input 
                      type="tel" 
                      required 
                      value={formData.fatherMobile} 
                      onChange={e => setFormData({ ...formData, fatherMobile: e.target.value })}
                      className={getCandidateFieldInputClass('fatherMobile')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Father Occupation', 'fatherOccupation', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.fatherOccupation} 
                      onChange={e => setFormData({ ...formData, fatherOccupation: e.target.value })}
                      placeholder="e.g. Business / Service / Retired"
                      className={getCandidateFieldInputClass('fatherOccupation')} 
                    />
                  </div>
                </div>
              </div>

              {/* Mother Details */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">👩 Mother Details:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    {renderCandidateFieldLabel('Mother Name', 'motherName', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.motherName} 
                      onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                      className={getCandidateFieldInputClass('motherName')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Mother Age', 'motherAge', true)}
                    <input 
                      type="number" 
                      required 
                      value={formData.motherAge} 
                      onChange={e => setFormData({ ...formData, motherAge: e.target.value })}
                      className={getCandidateFieldInputClass('motherAge')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Mother Mobile Number', 'motherMobile', true)}
                    <input 
                      type="tel" 
                      required 
                      value={formData.motherMobile} 
                      onChange={e => setFormData({ ...formData, motherMobile: e.target.value })}
                      className={getCandidateFieldInputClass('motherMobile')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Mother Occupation', 'motherOccupation', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.motherOccupation} 
                      onChange={e => setFormData({ ...formData, motherOccupation: e.target.value })}
                      placeholder="e.g. Homemaker / Teacher"
                      className={getCandidateFieldInputClass('motherOccupation')} 
                    />
                  </div>
                </div>
              </div>

              {/* Spouse & Children Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {renderCandidateFieldLabel('Wife or Husband Details (Name, Age, Mobile, Occupation)', 'spouseDetails')}
                  <textarea 
                    rows="2" 
                    value={formData.spouseDetails} 
                    onChange={e => setFormData({ ...formData, spouseDetails: e.target.value })}
                    placeholder="Enter spouse name, age, mobile number, and occupation (or N/A if single)"
                    className={getCandidateFieldInputClass('spouseDetails', 'form-textarea text-xs')} 
                  />
                </div>
                <div>
                  {renderCandidateFieldLabel('Children Details (Name, Age, Gender, School/College)', 'childrenDetails')}
                  <textarea 
                    rows="2" 
                    value={formData.childrenDetails} 
                    onChange={e => setFormData({ ...formData, childrenDetails: e.target.value })}
                    placeholder="Enter children names, ages, gender, and school details (or N/A if none)"
                    className={getCandidateFieldInputClass('childrenDetails', 'form-textarea text-xs')} 
                  />
                </div>
              </div>

              {/* Gratuity & PF Nominee */}
              <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <span className="text-xs font-black text-purple-900 uppercase tracking-wider block">
                  🛡️ Primary Statutory PF & Gratuity Nominee:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    {renderCandidateFieldLabel('Nominee Full Name', 'nomineeName', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.nomineeName} 
                      onChange={e => setFormData({ ...formData, nomineeName: e.target.value })}
                      className={getCandidateFieldInputClass('nomineeName')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Relationship & % Share', 'nomineeRelation', true)}
                    <input 
                      type="text" 
                      required 
                      value={formData.nomineeRelation} 
                      onChange={e => setFormData({ ...formData, nomineeRelation: e.target.value })}
                      placeholder="e.g. Mother (100% Share)"
                      className={getCandidateFieldInputClass('nomineeRelation')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Nominee Date of Birth', 'nomineeDob')}
                    <input 
                      type="date" 
                      value={formData.nomineeDob} 
                      onChange={e => setFormData({ ...formData, nomineeDob: e.target.value })}
                      className={getCandidateFieldInputClass('nomineeDob')} 
                    />
                  </div>
                  <div>
                    {renderCandidateFieldLabel('Nominee Aadhaar Number', 'nomineeAadhaar')}
                    <input 
                      type="text" 
                      value={formData.nomineeAadhaar} 
                      onChange={e => setFormData({ ...formData, nomineeAadhaar: e.target.value })}
                      placeholder="12-digit Aadhaar"
                      className={getCandidateFieldInputClass('nomineeAadhaar', 'form-input font-mono')} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: EMPLOYMENT EXPERIENCE MATRIX (MULTI-ENTRY) */}
          {activeSection === 'employment' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <div>
                  <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Section 6: Previous Employment & Work Experience (Multi-Entry)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Record all previous companies, tenures, compensation, and reasons for leaving</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="btn btn-superadmin text-xs py-1.5 px-3 font-bold flex items-center gap-1 cursor-pointer btn-interactive shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Employer</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.experienceList || []).map((exp, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-black text-[10px]">
                        Employment Record #{idx + 1}
                      </span>
                      {formData.experienceList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(idx)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Company / Institution Name *</label>
                        <input
                          type="text"
                          required
                          value={exp.institutionName}
                          onChange={e => handleUpdateExperience(idx, 'institutionName', e.target.value)}
                          placeholder="e.g. Infosys Limited"
                          className="form-input font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Job Designation *</label>
                        <input
                          type="text"
                          required
                          value={exp.designation}
                          onChange={e => handleUpdateExperience(idx, 'designation', e.target.value)}
                          placeholder="e.g. Senior Systems Engineer"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Institution / Office Address *</label>
                      <input
                        type="text"
                        required
                        value={exp.institutionAddress}
                        onChange={e => handleUpdateExperience(idx, 'institutionAddress', e.target.value)}
                        placeholder="e.g. Electronics City, Phase 1, Hosur Road, Bengaluru, KA"
                        className="form-input"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Period of Service (From - To) *</label>
                        <input
                          type="text"
                          required
                          value={exp.periodOfService}
                          onChange={e => handleUpdateExperience(idx, 'periodOfService', e.target.value)}
                          placeholder="e.g. 06/2021 - 07/2024 (3 Yrs 2 Mos)"
                          className="form-input font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-700 font-bold block mb-1">Salary Drawn (Last Drawn CTC) *</label>
                        <input
                          type="text"
                          required
                          value={exp.salaryDrawn}
                          onChange={e => handleUpdateExperience(idx, 'salaryDrawn', e.target.value)}
                          placeholder="e.g. ₹8,50,000 Per Annum (₹62,000/mo)"
                          className="form-input font-bold text-emerald-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Reason for Leaving *</label>
                      <textarea
                        rows="2"
                        required
                        value={exp.reasonForLeaving}
                        onChange={e => handleUpdateExperience(idx, 'reasonForLeaving', e.target.value)}
                        placeholder="e.g. Seeking higher architectural ownership, technical career growth, role alignment"
                        className="form-textarea text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: PERSONAL ACHIEVEMENTS & EXTRACURRICULAR */}
          {activeSection === 'achievements' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Section 7: Personal Achievements & Extra-Curricular Activities</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Talent & Leadership Profile</span>
              </div>

              <div>
                {renderCandidateFieldLabel('Personal Achievements (Awards, Honors, Certifications, Publications)', 'personalAchievements')}
                <textarea 
                  rows="3" 
                  value={formData.personalAchievements} 
                  onChange={e => setFormData({ ...formData, personalAchievements: e.target.value })}
                  placeholder="Detail your professional achievements, hackathon wins, IEEE papers, patents, or industry recognition..."
                  className={getCandidateFieldInputClass('personalAchievements', 'form-textarea text-xs font-medium')} 
                />
              </div>

              <div>
                {renderCandidateFieldLabel('Extra-Curricular Activities (Sports, Arts, Community Leadership)', 'extraCurricularActivities')}
                <textarea 
                  rows="3" 
                  value={formData.extraCurricularActivities} 
                  onChange={e => setFormData({ ...formData, extraCurricularActivities: e.target.value })}
                  placeholder="Detail your involvement in sports, cultural arts, volunteering, community blood donation drives, etc..."
                  className={getCandidateFieldInputClass('extraCurricularActivities', 'form-textarea text-xs font-medium')} 
                />
              </div>
            </div>
          )}

          {/* SECTION 8: HEALTH, LIFESTYLE & BACKGROUND DISCLOSURES (CONDITIONAL QUESTIONS) */}
          {activeSection === 'health_lifestyle' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" />
                  <span>Section 8: Health, Lifestyle, Asset & Background Disclosures</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Workplace Health & Integrity Compliance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Smoking */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Do you smoke (Y/N)? *</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="isSmoker" 
                        value="No" 
                        checked={formData.isSmoker === 'No'} 
                        onChange={() => setFormData({ ...formData, isSmoker: 'No', cigarettesPerDay: '0' })} 
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700">
                      <input 
                        type="radio" 
                        name="isSmoker" 
                        value="Yes" 
                        checked={formData.isSmoker === 'Yes'} 
                        onChange={() => setFormData({ ...formData, isSmoker: 'Yes' })} 
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  {formData.isSmoker === 'Yes' && (
                    <div className="pt-1 animate-fadeIn">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">If "Yes", how many cigarettes do you smoke per day?</label>
                      <input 
                        type="number" 
                        min="1"
                        value={formData.cigarettesPerDay} 
                        onChange={e => setFormData({ ...formData, cigarettesPerDay: e.target.value })}
                        className="form-input font-bold" 
                      />
                    </div>
                  )}
                </div>

                {/* 2. Major Surgery */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Have you had any major surgery (Y/N)? *</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="hasMajorSurgery" 
                        value="No" 
                        checked={formData.hasMajorSurgery === 'No'} 
                        onChange={() => setFormData({ ...formData, hasMajorSurgery: 'No', surgeryDetails: '' })} 
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700">
                      <input 
                        type="radio" 
                        name="hasMajorSurgery" 
                        value="Yes" 
                        checked={formData.hasMajorSurgery === 'Yes'} 
                        onChange={() => setFormData({ ...formData, hasMajorSurgery: 'Yes' })} 
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  {formData.hasMajorSurgery === 'Yes' && (
                    <div className="pt-1 animate-fadeIn">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">If "Yes", enter surgery details (Type, Year, Hospital):</label>
                      <textarea 
                        rows="2"
                        value={formData.surgeryDetails} 
                        onChange={e => setFormData({ ...formData, surgeryDetails: e.target.value })}
                        placeholder="e.g. Appendectomy in 2019, fully recovered"
                        className="form-textarea text-xs" 
                      />
                    </div>
                  )}
                </div>

                {/* 3. Illness / Issues */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Do you have any ongoing illness or health issues (Y/N)? *</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="hasIllnessIssues" 
                        value="No" 
                        checked={formData.hasIllnessIssues === 'No'} 
                        onChange={() => setFormData({ ...formData, hasIllnessIssues: 'No', illnessDetails: '' })} 
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700">
                      <input 
                        type="radio" 
                        name="hasIllnessIssues" 
                        value="Yes" 
                        checked={formData.hasIllnessIssues === 'Yes'} 
                        onChange={() => setFormData({ ...formData, hasIllnessIssues: 'Yes' })} 
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  {formData.hasIllnessIssues === 'Yes' && (
                    <div className="pt-1 animate-fadeIn">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">If "Yes", enter illness details & medication:</label>
                      <textarea 
                        rows="2"
                        value={formData.illnessDetails} 
                        onChange={e => setFormData({ ...formData, illnessDetails: e.target.value })}
                        placeholder="e.g. Mild Hypertension, managed with regular medication"
                        className="form-textarea text-xs" 
                      />
                    </div>
                  )}
                </div>

                {/* 4. Own House */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Do you own a house (Y/N)? *</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="ownsHouse" 
                        value="No" 
                        checked={formData.ownsHouse === 'No'} 
                        onChange={() => setFormData({ ...formData, ownsHouse: 'No', houseCityTown: '' })} 
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700">
                      <input 
                        type="radio" 
                        name="ownsHouse" 
                        value="Yes" 
                        checked={formData.ownsHouse === 'Yes'} 
                        onChange={() => setFormData({ ...formData, ownsHouse: 'Yes' })} 
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  {formData.ownsHouse === 'Yes' && (
                    <div className="pt-1 animate-fadeIn">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">If "Yes", in which city/town?</label>
                      <input 
                        type="text" 
                        value={formData.houseCityTown} 
                        onChange={e => setFormData({ ...formData, houseCityTown: e.target.value })}
                        placeholder="e.g. Madurai, Tamil Nadu"
                        className="form-input font-bold" 
                      />
                    </div>
                  )}
                </div>

                {/* 5. Other Income */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Do you get any income other than employment (Y/N)? *</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input 
                        type="radio" 
                        name="hasOtherIncome" 
                        value="No" 
                        checked={formData.hasOtherIncome === 'No'} 
                        onChange={() => setFormData({ ...formData, hasOtherIncome: 'No', otherIncomeDetails: '' })} 
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700">
                      <input 
                        type="radio" 
                        name="hasOtherIncome" 
                        value="Yes" 
                        checked={formData.hasOtherIncome === 'Yes'} 
                        onChange={() => setFormData({ ...formData, hasOtherIncome: 'Yes' })} 
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  {formData.hasOtherIncome === 'Yes' && (
                    <div className="pt-1 animate-fadeIn">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">If "Yes", enter details of other income source:</label>
                      <textarea 
                        rows="2"
                        value={formData.otherIncomeDetails} 
                        onChange={e => setFormData({ ...formData, otherIncomeDetails: e.target.value })}
                        placeholder="e.g. Rental income from ancestral commercial space"
                        className="form-textarea text-xs" 
                      />
                    </div>
                  )}
                </div>

                {/* 6. Criminal Conviction */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Have you ever been convicted in any court of law (Y/N)? *</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700">
                      <input 
                        type="radio" 
                        name="hasCriminalConviction" 
                        value="No" 
                        checked={formData.hasCriminalConviction === 'No'} 
                        onChange={() => setFormData({ ...formData, hasCriminalConviction: 'No', convictionDetails: '' })} 
                      />
                      <span>No (Clean Record)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-700">
                      <input 
                        type="radio" 
                        name="hasCriminalConviction" 
                        value="Yes" 
                        checked={formData.hasCriminalConviction === 'Yes'} 
                        onChange={() => setFormData({ ...formData, hasCriminalConviction: 'Yes' })} 
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                  {formData.hasCriminalConviction === 'Yes' && (
                    <div className="pt-1 animate-fadeIn">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">If "Yes", enter conviction details (Case No, Year, Court):</label>
                      <textarea 
                        rows="2"
                        value={formData.convictionDetails} 
                        onChange={e => setFormData({ ...formData, convictionDetails: e.target.value })}
                        placeholder="Enter full legal particulars of conviction"
                        className="form-textarea text-xs" 
                      />
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* SECTION 9: GROUP RELATIONS & REFERENCE LIBERTY */}
          {activeSection === 'group_relations' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Section 9: Group Relationship & HR Reference Check Liberty</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Anti-Nepotism & Ethics Governance</span>
              </div>

              {/* Group Employee Relative */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="font-bold text-slate-900 block text-xs">Are you related to any employee in our group (Y/N)? *</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input 
                      type="radio" 
                      name="relatedToGroupEmployee" 
                      value="No" 
                      checked={formData.relatedToGroupEmployee === 'No'} 
                      onChange={() => setFormData({ ...formData, relatedToGroupEmployee: 'No', relatedEmployeeDetails: '' })} 
                    />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-indigo-700">
                    <input 
                      type="radio" 
                      name="relatedToGroupEmployee" 
                      value="Yes" 
                      checked={formData.relatedToGroupEmployee === 'Yes'} 
                      onChange={() => setFormData({ ...formData, relatedToGroupEmployee: 'Yes' })} 
                    />
                    <span>Yes</span>
                  </label>
                </div>
                {formData.relatedToGroupEmployee === 'Yes' && (
                  <div className="pt-1 animate-fadeIn">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">If "Yes", enter details of that employee (Name, Position, Mobile number):</label>
                    <textarea 
                      rows="2"
                      value={formData.relatedEmployeeDetails} 
                      onChange={e => setFormData({ ...formData, relatedEmployeeDetails: e.target.value })}
                      placeholder="e.g. Ramesh Kumar, Senior Manager Operations, +91 98401 22334"
                      className="form-textarea text-xs" 
                    />
                  </div>
                )}
              </div>

              {/* Previously Interviewed in Group */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="font-bold text-slate-900 block text-xs">Have you been previously interviewed for any position in our group (Y/N)? *</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input 
                      type="radio" 
                      name="previouslyInterviewedInGroup" 
                      value="No" 
                      checked={formData.previouslyInterviewedInGroup === 'No'} 
                      onChange={() => setFormData({ ...formData, previouslyInterviewedInGroup: 'No', previousInterviewDetails: '' })} 
                    />
                    <span>No</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-indigo-700">
                    <input 
                      type="radio" 
                      name="previouslyInterviewedInGroup" 
                      value="Yes" 
                      checked={formData.previouslyInterviewedInGroup === 'Yes'} 
                      onChange={() => setFormData({ ...formData, previouslyInterviewedInGroup: 'Yes' })} 
                    />
                    <span>Yes</span>
                  </label>
                </div>
                {formData.previouslyInterviewedInGroup === 'Yes' && (
                  <div className="pt-1 animate-fadeIn">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">If "Yes", give particulars (Name of reference/employee, Position, Mobile number):</label>
                    <textarea 
                      rows="2"
                      value={formData.previousInterviewDetails} 
                      onChange={e => setFormData({ ...formData, previousInterviewDetails: e.target.value })}
                      placeholder="e.g. Interviewed for Fullstack Lead role in Jan 2024, Ref: Priya Sharma"
                      className="form-textarea text-xs" 
                    />
                  </div>
                )}
              </div>

              {/* Liberty to Contact Present & Previous Employer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
                  <span className="font-bold text-indigo-950 block text-xs">Are we at liberty to contact your present employer (Y/N)? *</span>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-800">
                      <input 
                        type="radio" 
                        name="contactPresentEmployerLiberty" 
                        value="Yes" 
                        checked={formData.contactPresentEmployerLiberty === 'Yes'} 
                        onChange={() => setFormData({ ...formData, contactPresentEmployerLiberty: 'Yes' })} 
                      />
                      <span>Yes (Authorized)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-600">
                      <input 
                        type="radio" 
                        name="contactPresentEmployerLiberty" 
                        value="No" 
                        checked={formData.contactPresentEmployerLiberty === 'No'} 
                        onChange={() => setFormData({ ...formData, contactPresentEmployerLiberty: 'No' })} 
                      />
                      <span>No (Post-Offer Only)</span>
                    </label>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
                  <span className="font-bold text-indigo-950 block text-xs">Are we at liberty to contact your previous employer (Y/N)? *</span>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-800">
                      <input 
                        type="radio" 
                        name="contactPreviousEmployerLiberty" 
                        value="Yes" 
                        checked={formData.contactPreviousEmployerLiberty === 'Yes'} 
                        onChange={() => setFormData({ ...formData, contactPreviousEmployerLiberty: 'Yes' })} 
                      />
                      <span>Yes (Authorized)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-600">
                      <input 
                        type="radio" 
                        name="contactPreviousEmployerLiberty" 
                        value="No" 
                        checked={formData.contactPreviousEmployerLiberty === 'No'} 
                        onChange={() => setFormData({ ...formData, contactPreviousEmployerLiberty: 'No' })} 
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 10: INDUSTRY MATRIX SPECIALIZATION */}
          {activeSection === 'industry' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>Section 10: Industry Matrix Specialization Particulars</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">Dynamic Sector Onboarding Profile</span>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Select Employee Sector / Industry Category *</label>
                <select
                  value={formData.employeeCategory}
                  onChange={e => setFormData({
                    ...formData,
                    employeeCategory: e.target.value,
                    industrySpecialization: {
                      ...formData.industrySpecialization,
                      industryType: e.target.value
                    }
                  })}
                  className="form-select text-xs font-black text-indigo-700 bg-indigo-50 border-indigo-200"
                >
                  <option value="it_tech">💻 Information Technology & Software Engineering</option>
                  <option value="manufacturing">🏭 Manufacturing, Industrial & Assembly Plant</option>
                  <option value="bfsi">🏦 Banking, Financial Services & Insurance (BFSI)</option>
                  <option value="logistics">🚚 Logistics, Warehousing & Fleet Operations</option>
                  <option value="healthcare">🩺 Healthcare, Clinical & Pharmaceuticals</option>
                  <option value="sales_retail">🛍️ Corporate Sales, Retail & Marketing</option>
                </select>
              </div>

              {/* Dynamic Industry Fields */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                {formData.employeeCategory === 'it_tech' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">GitHub / Code Portfolio Repository URL</label>
                      <input
                        type="url"
                        value={formData.industrySpecialization?.githubUrl || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, githubUrl: e.target.value }
                        })}
                        placeholder="https://github.com/developer-profile"
                        className="form-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={formData.industrySpecialization?.portfolioUrl || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, portfolioUrl: e.target.value }
                        })}
                        placeholder="https://linkedin.com/in/profile"
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                {formData.employeeCategory === 'manufacturing' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Plant Location / Unit</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.plantLocation || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, plantLocation: e.target.value }
                        })}
                        placeholder="e.g. Unit 3 Assembly Plant"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Safety Shoe Size (Steel-Toe)</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.safetyShoeSize || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, safetyShoeSize: e.target.value }
                        })}
                        placeholder="e.g. UK 9 / EUR 43"
                        className="form-input font-bold"
                      />
                    </div>
                  </div>
                )}

                {formData.employeeCategory === 'bfsi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">CA / CFA / CS Membership Number</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.certificationsBfsi || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, certificationsBfsi: e.target.value }
                        })}
                        placeholder="e.g. ICAI-MRN-419820"
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">CIBIL Credit Score Bracket</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.cibilScoreRange || '795 - 830'}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, cibilScoreRange: e.target.value }
                        })}
                        className="form-input font-bold text-emerald-800"
                      />
                    </div>
                  </div>
                )}

                {formData.employeeCategory === 'logistics' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Commercial DL Badge Number</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.commercialDlBadgeNo || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, commercialDlBadgeNo: e.target.value }
                        })}
                        placeholder="e.g. TN-01-TR-2020-98412"
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Assigned Vehicle RC Number</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.forkliftLicenseNo || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, forkliftLicenseNo: e.target.value }
                        })}
                        placeholder="e.g. KA01MF4912"
                        className="form-input font-mono"
                      />
                    </div>
                  </div>
                )}

                {formData.employeeCategory === 'healthcare' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Medical / Nursing Council Registration Number</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.medicalCouncilRegNo || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, medicalCouncilRegNo: e.target.value }
                        })}
                        placeholder="e.g. KMC-REG-2012-9942"
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Immunization & Vaccination Status</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.immunizationStatus || 'Hepatitis B (3 Doses Complete)'}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, immunizationStatus: e.target.value }
                        })}
                        className="form-input"
                      />
                    </div>
                  </div>
                )}

                {formData.employeeCategory === 'sales_retail' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Assigned Retail Store / Territory Code</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.assignedStoreCode || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, assignedStoreCode: e.target.value }
                        })}
                        placeholder="e.g. RET-BLR-PHOENIX-04"
                        className="form-input font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Field Two-Wheeler Driving License</label>
                      <input
                        type="text"
                        value={formData.industrySpecialization?.fssaiCertNo || ''}
                        onChange={e => setFormData({
                          ...formData,
                          industrySpecialization: { ...formData.industrySpecialization, fssaiCertNo: e.target.value }
                        })}
                        placeholder="e.g. TN0120180004918"
                        className="form-input font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 11: DOCUMENTS & STATUTORY CONFIRMATION */}
          {activeSection === 'documents' && (
            <div className="space-y-5 animate-tab-switch">
              
              {/* Header & Preset Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                    <FolderDown className="w-4 h-4 text-indigo-600" />
                    <span>Section 11: Document Uploads & Annexure Exhibits</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Attach clear PDFs or high-resolution images (up to 15MB each). Documents are encrypted and bound to your official Profile Dossier.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleAutoAttachMockDocs}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-102 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>⚡ Auto-Attach Mock Files</span>
                  </button>
                  <span className="badge badge-emerald text-[10px] font-bold">
                    {Object.keys(formData.uploadedDocuments || {}).length} Attached
                  </span>
                </div>
              </div>

              {/* Sub-Group A: Sovereign KYC & Personal Proofs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>A. Sovereign Identity, Tax & Financial Proofs</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">Mandatory for all employees</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: 'docAadhaar', title: 'Aadhaar Card (Front & Back)', icon: '🪪', req: 'Mandatory', desc: 'UIDAI masked e-Aadhaar PDF or color scan' },
                    { key: 'docPan', title: 'Income Tax PAN Card Copy', icon: '💳', req: 'Mandatory', desc: 'NSDL / UTI permanent account number card' },
                    { key: 'docPassportPhoto', title: 'Passport Size Photograph', icon: '📸', req: 'Mandatory', desc: 'Recent formal color portrait (white background)' },
                    { key: 'docSpecimenSignature', title: 'Official Specimen Signature', icon: '✍️', req: 'Mandatory', desc: 'Signed paper specimen for statutory nomination' },
                    { key: 'docBankCancelledCheque', title: 'Bank Pre-Printed Cancelled Cheque', icon: '🏦', req: 'Mandatory', desc: 'Bank passbook first page or pre-printed cheque leaf' },
                    { key: 'docPassportOrDl', title: 'Passport / Driving License', icon: '🌐', req: 'Optional', desc: 'Valid passport (pages 1-2) or MoRTH DL' }
                  ].map((doc) => {
                    const uploaded = (formData.uploadedDocuments || {})[doc.key];
                    return (
                      <div 
                        key={doc.key} 
                        className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2.5 ${
                          uploaded ? 'bg-emerald-50/80 border-emerald-400 shadow-2xs' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl shrink-0">{doc.icon}</span>
                            <div className="min-w-0">
                              <strong className="text-slate-900 font-bold text-xs block truncate">{doc.title}</strong>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{doc.desc}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase shrink-0 ${
                            doc.req === 'Mandatory' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {doc.req}
                          </span>
                        </div>

                        {uploaded ? (
                          <div className="bg-white p-2 rounded-xl border border-emerald-200 flex items-center justify-between gap-2 text-[10px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-mono font-bold text-emerald-950 truncate">{uploaded.name}</span>
                              <span className="text-slate-400 font-mono">({uploaded.size || '200 KB'})</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(uploaded)}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                                title="Preview document"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveUploadedDoc(doc.key)}
                                className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                title="Remove document"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer text-indigo-700 font-bold text-xs transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select & Upload File</span>
                            <input 
                              type="file" 
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0], doc.title)}
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Group B: Academic & Prior Employment Records */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>B. Academic Qualifications & Previous Employment Dossier</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">Relieving & education certificates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {[
                    { key: 'docDegreeCert', title: 'Highest Degree Certificate', icon: '🎓', req: 'Mandatory', desc: 'University convocation degree certificate' },
                    { key: 'docConsolidatedMarksheet', title: 'Consolidated Marksheet', icon: '📑', req: 'Mandatory', desc: 'All-semester cumulative marksheet transcript' },
                    { key: 'docHsc12thMarksheet', title: 'Higher Secondary (12th) Marksheet', icon: '📜', req: 'Mandatory', desc: '10+2 / Intermediate Board certificate' },
                    { key: 'docSslc10thMarksheet', title: 'SSLC (10th Standard) Certificate', icon: '🏫', req: 'Mandatory', desc: 'Secondary school mark memo / DOB proof' },
                    { key: 'docRelievingLetter', title: 'Previous Employer Relieving Letter', icon: '💼', req: 'Mandatory', desc: 'Formal relieving / service release letter' },
                    { key: 'docExperienceCertificate', title: 'Service / Experience Certificate', icon: '⭐', req: 'Mandatory', desc: 'Prior employer work experience certificate' },
                    { key: 'docSalarySlips3Months', title: 'Last 3 Months Salary Slips', icon: '💰', req: 'Mandatory', desc: 'Consecutive payslips or Form 16 statement' },
                    { key: 'docMedicalFitnessCert', title: 'Medical Fitness Certificate', icon: '🏥', req: 'Mandatory', desc: 'Registered medical practitioner fitness certificate' },
                    { key: 'docSignedNda', title: 'Executed Employer NDA & IP Assignment', icon: '📝', req: 'Mandatory', desc: 'Signed employee confidentiality agreement' }
                  ].map((doc) => {
                    const uploaded = (formData.uploadedDocuments || {})[doc.key];
                    return (
                      <div 
                        key={doc.key} 
                        className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2.5 ${
                          uploaded ? 'bg-emerald-50/80 border-emerald-400 shadow-2xs' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl shrink-0">{doc.icon}</span>
                            <div className="min-w-0">
                              <strong className="text-slate-900 font-bold text-xs block truncate">{doc.title}</strong>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{doc.desc}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase shrink-0 ${
                            doc.req === 'Mandatory' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {doc.req}
                          </span>
                        </div>

                        {uploaded ? (
                          <div className="bg-white p-2 rounded-xl border border-emerald-200 flex items-center justify-between gap-2 text-[10px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-mono font-bold text-emerald-950 truncate">{uploaded.name}</span>
                              <span className="text-slate-400 font-mono">({uploaded.size || '250 KB'})</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(uploaded)}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                                title="Preview document"
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveUploadedDoc(doc.key)}
                                className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                title="Remove document"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded-xl cursor-pointer text-indigo-700 font-bold text-xs transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select & Upload File</span>
                            <input 
                              type="file" 
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0], doc.title)}
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-Group C: Industry-Specific Compliance Documents */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    <span>C. Sector-Specific Compliance Documents ({formData.employeeCategory?.toUpperCase() || 'IT/TECH'})</span>
                  </h4>
                  <span className="badge badge-indigo text-[9px] font-bold">Tailored to Job Role</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {formData.employeeCategory === 'manufacturing' && (
                    <>
                      {[
                        { key: 'docTradeCert', title: 'NCVT / ITI Trade Certificate', icon: '⚙️', req: 'Mandatory', desc: 'Apprentices Act 1961 machinist/fitter certification' },
                        { key: 'docForm33', title: 'Factory Health Fitness (Form 33)', icon: '🩺', req: 'Mandatory', desc: 'Factories Act 1948 Section 41C medical report' },
                        { key: 'docHeavyOperatorLicense', title: 'Forklift / Heavy Machinery License', icon: '🚜', req: 'Conditional', desc: 'MoRTH heavy equipment operating certificate' }
                      ].map((doc) => {
                        const uploaded = (formData.uploadedDocuments || {})[doc.key];
                        return (
                          <div key={doc.key} className="p-3.5 rounded-2xl border-2 bg-purple-50/50 border-purple-200 flex flex-col justify-between gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xl">{doc.icon}</span>
                              <strong className="text-slate-900 font-bold text-xs flex-1">{doc.title}</strong>
                              <span className="badge badge-purple text-[8px]">{doc.req}</span>
                            </div>
                            <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-purple-100 border border-purple-300 rounded-xl cursor-pointer text-purple-700 font-bold text-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploaded ? '✓ Replace File' : 'Upload Proof'}</span>
                              <input type="file" onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0], doc.title)} className="hidden" />
                            </label>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {formData.employeeCategory === 'bfsi' && (
                    <>
                      {[
                        { key: 'docCaCfaMembership', title: 'CA / CFA / CMA Membership Certificate', icon: '📊', req: 'Conditional', desc: 'ICAI / CFA Institute statutory registration' },
                        { key: 'docFidelityIndemnityBond', title: 'Employee Fidelity Guarantee Bond', icon: '🛡️', req: 'Mandatory', desc: 'Banking cash handling indemnity agreement' }
                      ].map((doc) => {
                        const uploaded = (formData.uploadedDocuments || {})[doc.key];
                        return (
                          <div key={doc.key} className="p-3.5 rounded-2xl border-2 bg-emerald-50/50 border-emerald-200 flex flex-col justify-between gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xl">{doc.icon}</span>
                              <strong className="text-slate-900 font-bold text-xs flex-1">{doc.title}</strong>
                              <span className="badge badge-emerald text-[8px]">{doc.req}</span>
                            </div>
                            <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl cursor-pointer text-emerald-700 font-bold text-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploaded ? '✓ Replace File' : 'Upload Proof'}</span>
                              <input type="file" onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0], doc.title)} className="hidden" />
                            </label>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {formData.employeeCategory === 'logistics' && (
                    <>
                      {[
                        { key: 'docCommercialDl', title: 'Commercial Heavy Vehicle License (HMV)', icon: '🚛', req: 'Mandatory', desc: 'MoRTH Sarathi commercial transport badge' },
                        { key: 'docVisionForm1A', title: 'Vision & Night Blindness Fitness (Form 1A)', icon: '👁️', req: 'Mandatory', desc: 'Motor Vehicles Act Section 8 medical fitness' }
                      ].map((doc) => {
                        const uploaded = (formData.uploadedDocuments || {})[doc.key];
                        return (
                          <div key={doc.key} className="p-3.5 rounded-2xl border-2 bg-amber-50/50 border-amber-200 flex flex-col justify-between gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xl">{doc.icon}</span>
                              <strong className="text-slate-900 font-bold text-xs flex-1">{doc.title}</strong>
                              <span className="badge badge-amber text-[8px]">{doc.req}</span>
                            </div>
                            <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl cursor-pointer text-amber-700 font-bold text-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploaded ? '✓ Replace File' : 'Upload Proof'}</span>
                              <input type="file" onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0], doc.title)} className="hidden" />
                            </label>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {formData.employeeCategory === 'healthcare' && (
                    <>
                      {[
                        { key: 'docCouncilReg', title: 'Medical / Nursing Council Registration', icon: '🩺', req: 'Mandatory', desc: 'NMC / State Nursing statutory license' },
                        { key: 'docLifeSupportCert', title: 'BLS / ACLS Life Support Certificate', icon: '❤️', req: 'Mandatory', desc: 'American Heart Association accredited cert' },
                        { key: 'docVaccinationRecord', title: 'Hepatitis B & Tetanus Vaccination Card', icon: '💉', req: 'Mandatory', desc: 'Hospital occupational health immunization record' }
                      ].map((doc) => {
                        const uploaded = (formData.uploadedDocuments || {})[doc.key];
                        return (
                          <div key={doc.key} className="p-3.5 rounded-2xl border-2 bg-rose-50/50 border-rose-200 flex flex-col justify-between gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xl">{doc.icon}</span>
                              <strong className="text-slate-900 font-bold text-xs flex-1">{doc.title}</strong>
                              <span className="badge badge-rose text-[8px]">{doc.req}</span>
                            </div>
                            <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-rose-100 border border-rose-300 rounded-xl cursor-pointer text-rose-700 font-bold text-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploaded ? '✓ Replace File' : 'Upload Proof'}</span>
                              <input type="file" onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0], doc.title)} className="hidden" />
                            </label>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {(!formData.employeeCategory || formData.employeeCategory === 'it_tech' || formData.employeeCategory === 'retail') && (
                    <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 col-span-full text-indigo-900 flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div>
                        <strong className="text-xs block">All Universal KYC & Employment Exhibits Ready</strong>
                        <p className="text-[10px] text-indigo-700">Digital signatures, NDA, and sovereign ID proofs will be compiled into the Profile PDF Annexure.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Confirmation Declaration Box */}
              <div className="p-4 rounded-2xl bg-indigo-900 text-white border border-indigo-700 space-y-3 shadow-md">
                <div className="flex items-start gap-2.5">
                  <input 
                    type="checkbox" 
                    id="legalConfirmCheck" 
                    required 
                    defaultChecked
                    className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                  />
                  <label htmlFor="legalConfirmCheck" className="text-xs text-indigo-100 leading-relaxed cursor-pointer">
                    <strong>Legal Declaration & Digital Confirmation:</strong> I hereby solemnly declare that all information furnished in this application form is true, complete, and correct to the best of my knowledge. I authorize Joy Corporate Solutions & client group companies to verify all my educational, employment, medical, financial, and criminal records via authorized statutory and third-party gateways in compliance with the Digital Personal Data Protection (DPDP) Act 2023.
                  </label>
                </div>

                <div className="pt-2 border-t border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-indigo-300 font-mono text-[11px]">
                    🔒 Cryptographic SHA-256 Digital Checksum & Verification Stamp will be generated upon confirmation.
                  </span>

                  <button
                    type="submit"
                    className="btn btn-superadmin py-2.5 px-6 font-black text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl btn-interactive whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Submit Application Form</span>
                  </button>
                </div>
              </div>
            </div>
          )}


        
          {/* SECTION 12: MANUFACTURING & STATUTORY COMPLIANCE FORMS (EPFO 11, FORM 2, ESIC 1) */}
          {activeSection === 'statutory_forms' && (
            <div className="space-y-6 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <h3 className="font-extrabold text-sm text-purple-800 uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Section 12: Statutory Manufacturing & Labor Compliance Declaration Forms</span>
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-mono font-bold">
                  EPFO Form 11 • Form 2 Revised • ESIC Form 1
                </span>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-purple-900">Auto-Generated Statutory Compliance Documents:</strong>
                  <span>
                    These forms are generated automatically using the candidate's statutory profile, UAN/PF accounts, nominee declarations, and family particulars. These documents are compiled into the official <strong>Profile PDF Dossier</strong> upon submission.
                  </span>
                </div>
              </div>

              {/* Form 1: EPFO Form 11 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">1</span>
                    EPFO Form No. 11 — New Declaration Form
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EpfoForm11 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, uanEpf: formData.uanEpf }} jf={formData} />
              </div>

              {/* Form 2: EPFO Form 2 Revised */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">2</span>
                    EPFO Form 2 (Revised) — Nomination & Declaration (EPF & EPS)
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EpfoForm2 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, uanEpf: formData.uanEpf }} jf={formData} />
              </div>

              {/* Form 3: ESIC Form 1 */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">3</span>
                    ESIC Form 1 — Declaration Form & Temporary Identity Card (TIC)
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EsicForm1 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, esiNumber: formData.esiNumber }} jf={formData} />
              </div>
            </div>
          )}

        </form>

        {/* 👁️ CANDIDATE DOCUMENT PREVIEW MODAL */}
        {previewDoc && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleIn">
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{previewDoc.name}</h4>
                  <p className="text-[10px] text-slate-400">{previewDoc.type} • {previewDoc.size}</p>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-slate-100 space-y-4 text-xs font-mono">
                <div className="p-4 bg-white rounded-xl border border-slate-300 shadow-sm space-y-2">
                  <div className="flex justify-between border-b pb-2 font-sans font-bold">
                    <span>Uploaded Proof Record</span>
                    <span className="badge badge-emerald">Verified ✓</span>
                  </div>
                  <div className="flex justify-between"><span>Subject Name:</span><strong className="text-slate-900">{formData.fullName}</strong></div>
                  <div className="flex justify-between"><span>Proof Value:</span><strong>{previewDoc.masked}</strong></div>
                  <div className="flex justify-between"><span>Storage Vault:</span><strong className="text-emerald-700">AES-256 Encrypted</strong></div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] font-sans flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Document securely verified against government database.</span>
                </div>
              </div>

              <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
                <button onClick={() => setPreviewDoc(null)} className="btn btn-secondary text-xs py-1.5 px-4 font-bold cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mandatory Aadhaar OTP Modal */}
        {showAadhaarOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  <span>Aadhaar UIDAI OTP Verification</span>
                </h3>
                <button onClick={() => setShowAadhaarOtpModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                A 6-digit OTP code was sent to registered Aadhaar mobile for <strong className="text-slate-900 font-mono">{formData.aadhaarNo}</strong>.
              </p>

              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-center text-xs text-indigo-900 font-medium">
                <span>💡 Test OTP Code: </span>
                <strong className="text-indigo-900 font-mono text-sm tracking-wider font-bold">482910</strong>
              </div>

              <form onSubmit={handleAadhaarOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit OTP *</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    required
                    placeholder="e.g. 482910"
                    value={aadhaarInputOtp}
                    onChange={(e) => setAadhaarInputOtp(e.target.value)}
                    className="form-input text-center text-lg font-mono tracking-widest font-bold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAadhaarOtpModal(false)} className="btn btn-secondary text-xs font-bold">Cancel</button>
                  <button type="submit" className="btn btn-superadmin text-xs">Verify & Confirm Aadhaar</button>
                </div>
              
          {/* SECTION 12: MANUFACTURING & STATUTORY COMPLIANCE FORMS (EPFO 11, FORM 2, ESIC 1) */}
          {activeSection === 'statutory_forms' && (
            <div className="space-y-6 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <h3 className="font-extrabold text-sm text-purple-800 uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Section 12: Statutory Manufacturing & Labor Compliance Declaration Forms</span>
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-mono font-bold">
                  EPFO Form 11 • Form 2 Revised • ESIC Form 1
                </span>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-purple-900">Auto-Generated Statutory Compliance Documents:</strong>
                  <span>
                    These forms are generated automatically using the candidate's statutory profile, UAN/PF accounts, nominee declarations, and family particulars. These documents are compiled into the official <strong>Profile PDF Dossier</strong> upon submission.
                  </span>
                </div>
              </div>

              {/* Form 1: EPFO Form 11 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">1</span>
                    EPFO Form No. 11 — New Declaration Form
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EpfoForm11 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, uanEpf: formData.uanEpf }} jf={formData} />
              </div>

              {/* Form 2: EPFO Form 2 Revised */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">2</span>
                    EPFO Form 2 (Revised) — Nomination & Declaration (EPF & EPS)
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EpfoForm2 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, uanEpf: formData.uanEpf }} jf={formData} />
              </div>

              {/* Form 3: ESIC Form 1 */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">3</span>
                    ESIC Form 1 — Declaration Form & Temporary Identity Card (TIC)
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EsicForm1 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, esiNumber: formData.esiNumber }} jf={formData} />
              </div>
            </div>
          )}

        </form>
            </div>
          </div>
        )}

        {/* Mandatory Mobile OTP Modal */}
        {showMobileOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-sky-600" />
                  <span>Mobile Number SMS OTP Check</span>
                </h3>
                <button onClick={() => setShowMobileOtpModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                An SMS containing 6-digit OTP code was sent to <strong className="text-slate-900">{formData.mobile}</strong>.
              </p>

              <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-center text-xs text-sky-900 font-medium">
                <span>💡 Test OTP Code: </span>
                <strong className="text-sky-900 font-mono text-sm tracking-wider font-bold">652194</strong>
              </div>

              <form onSubmit={handleMobileOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit SMS OTP *</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    required
                    placeholder="e.g. 652194"
                    value={mobileInputOtp}
                    onChange={(e) => setMobileInputOtp(e.target.value)}
                    className="form-input text-center text-lg font-mono tracking-widest font-bold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setShowMobileOtpModal(false)} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="btn btn-company text-xs cursor-pointer">Confirm Mobile OTP</button>
                </div>
              
          {/* SECTION 12: MANUFACTURING & STATUTORY COMPLIANCE FORMS (EPFO 11, FORM 2, ESIC 1) */}
          {activeSection === 'statutory_forms' && (
            <div className="space-y-6 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <h3 className="font-extrabold text-sm text-purple-800 uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Section 12: Statutory Manufacturing & Labor Compliance Declaration Forms</span>
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-mono font-bold">
                  EPFO Form 11 • Form 2 Revised • ESIC Form 1
                </span>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-purple-900">Auto-Generated Statutory Compliance Documents:</strong>
                  <span>
                    These forms are generated automatically using the candidate's statutory profile, UAN/PF accounts, nominee declarations, and family particulars. These documents are compiled into the official <strong>Profile PDF Dossier</strong> upon submission.
                  </span>
                </div>
              </div>

              {/* Form 1: EPFO Form 11 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">1</span>
                    EPFO Form No. 11 — New Declaration Form
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EpfoForm11 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, uanEpf: formData.uanEpf }} jf={formData} />
              </div>

              {/* Form 2: EPFO Form 2 Revised */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">2</span>
                    EPFO Form 2 (Revised) — Nomination & Declaration (EPF & EPS)
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EpfoForm2 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, uanEpf: formData.uanEpf }} jf={formData} />
              </div>

              {/* Form 3: ESIC Form 1 */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">3</span>
                    ESIC Form 1 — Declaration Form & Temporary Identity Card (TIC)
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EsicForm1 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, esiNumber: formData.esiNumber }} jf={formData} />
              </div>
            </div>
          )}

        </form>
            </div>
          </div>
        )}

        {/* Mandatory Email OTP Modal */}
        {showEmailOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span>Official Email Address OTP Check</span>
                </h3>
                <button onClick={() => setShowEmailOtpModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                A 6-digit confirmation code was sent to <strong className="text-slate-900">{formData.email}</strong>.
              </p>

              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center text-xs text-purple-900 font-medium">
                <span>💡 Test OTP Code: </span>
                <strong className="text-purple-900 font-mono text-sm tracking-wider font-bold">839102</strong>
              </div>

              <form onSubmit={handleEmailOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter 6-Digit Email OTP *</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    required
                    placeholder="e.g. 839102"
                    value={emailInputOtp}
                    onChange={(e) => setEmailInputOtp(e.target.value)}
                    className="form-input text-center text-lg font-mono tracking-widest font-bold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setShowEmailOtpModal(false)} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
                  <button type="submit" className="btn btn-secondary text-xs bg-purple-600 text-white hover:bg-purple-700 cursor-pointer">Confirm Email OTP</button>
                </div>
              
          {/* SECTION 12: MANUFACTURING & STATUTORY COMPLIANCE FORMS (EPFO 11, FORM 2, ESIC 1) */}
          {activeSection === 'statutory_forms' && (
            <div className="space-y-6 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <h3 className="font-extrabold text-sm text-purple-800 uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Section 12: Statutory Manufacturing & Labor Compliance Declaration Forms</span>
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-mono font-bold">
                  EPFO Form 11 • Form 2 Revised • ESIC Form 1
                </span>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-purple-900">Auto-Generated Statutory Compliance Documents:</strong>
                  <span>
                    These forms are generated automatically using the candidate's statutory profile, UAN/PF accounts, nominee declarations, and family particulars. These documents are compiled into the official <strong>Profile PDF Dossier</strong> upon submission.
                  </span>
                </div>
              </div>

              {/* Form 1: EPFO Form 11 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">1</span>
                    EPFO Form No. 11 — New Declaration Form
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EpfoForm11 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, uanEpf: formData.uanEpf }} jf={formData} />
              </div>

              {/* Form 2: EPFO Form 2 Revised */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">2</span>
                    EPFO Form 2 (Revised) — Nomination & Declaration (EPF & EPS)
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EpfoForm2 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, uanEpf: formData.uanEpf }} jf={formData} />
              </div>

              {/* Form 3: ESIC Form 1 */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono font-bold">3</span>
                    ESIC Form 1 — Declaration Form & Temporary Identity Card (TIC)
                  </strong>
                  <span className="badge badge-emerald text-[9px]">Auto-Synced ✓</span>
                </div>
                <EsicForm1 candidate={{ ...candidate, name: formData.fullName, doj: formData.doj, mobile: formData.mobile, email: formData.email, gender: formData.gender, maritalStatus: formData.maritalStatus, aadhaarNo: formData.aadhaarNo, panNo: formData.panNo, esiNumber: formData.esiNumber }} jf={formData} />
              </div>
            </div>
          )}

        </form>
            </div>
          </div>
        )}

        {/* 📡 ENGAGING REAL-TIME UIDAI e-KYC DATA FETCHING RADAR MODAL */}
        {isFetchingAadhaarData && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
            <div className="bg-slate-950 text-white w-full max-w-md rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/40 shadow-2xl space-y-6 relative overflow-hidden text-center animate-scaleIn">
              
              {/* Ambient Background Glow & Radar Pulse */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none" />

              {/* High-Tech Animated Radar Scanner */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border border-indigo-400/50 animate-pulse" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Database className="w-8 h-8 text-white animate-bounce" />
                </div>
              </div>

              {/* Title & Live Percentage */}
              <div className="space-y-1">
                <span className="badge badge-indigo text-[10px] uppercase font-mono tracking-widest">
                  UIDAI CIDR GATEWAY 256-BIT e-KYC
                </span>
                <h3 className="text-xl font-black text-white">Fetching Official Aadhaar Data...</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Demographic XML Decryption • {aadhaarFetchProgress}% Complete
                </p>
              </div>

              {/* Glowing Active Progress Meter */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div 
                  style={{ width: `${aadhaarFetchProgress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                />
              </div>

              {/* Engaging Telemetry Steps */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 text-left space-y-2.5 text-xs font-mono">
                {[
                  { title: 'Connecting to UIDAI Central Data Repository (CIDR)', done: aadhaarFetchStep >= 1, active: aadhaarFetchStep === 0 },
                  { title: 'Validating 256-Bit e-KYC Session & OTP Signature', done: aadhaarFetchStep >= 2, active: aadhaarFetchStep === 1 },
                  { title: 'Extracting Demographic XML (Name, Father, DOB, Address)', done: aadhaarFetchStep >= 3, active: aadhaarFetchStep === 2 },
                  { title: 'Populating Form Fields & Locking Verified Data', done: aadhaarFetchStep >= 3, active: aadhaarFetchStep === 3 }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {step.done ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
                      ) : step.active ? (
                        <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-700 block" />
                      )}
                      <span className={step.done ? 'text-emerald-300 font-bold' : step.active ? 'text-white font-bold' : 'text-slate-500'}>
                        {step.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {step.done ? 'DONE' : step.active ? 'LIVE' : 'WAIT'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400">
                🔒 Official UIDAI e-KYC Verified Record
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
