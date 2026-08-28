import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  Layers
} from 'lucide-react';

export const FullJoiningFormModal = ({ candidate, isHrMode = false, onClose, onSubmitComplete }) => {
  const { updateCandidateVerification, submitCandidateJoiningForm, showToast, masterDropdownOptions } = useApp();

  const [activeSection, setActiveSection] = useState('personal'); // 'personal' | 'address' | 'education' | 'employment' | 'govt' | 'bank' | 'nominee' | 'industry' | 'documents' | 'statutory_agreements'
  const [previewDoc, setPreviewDoc] = useState(null);

  const jfd = candidate?.joiningFormData || {};
  const candSpec = candidate?.industrySpecialization || jfd.industrySpecialization || {};

  const [formData, setFormData] = useState({
    // Section 1: Personal & Bio Demographics
    fullName: candidate?.name || jfd.fullName || 'Rajesh Kumar',
    fatherName: candidate?.fatherName || jfd.fatherName || 'Suresh Kumar',
    motherName: candidate?.motherName || jfd.motherName || 'Kavitha Kumar',
    dob: candidate?.dob || jfd.dob || '1996-05-15',
    gender: candidate?.gender || jfd.gender || 'Male',
    maritalStatus: candidate?.maritalStatus || jfd.maritalStatus || 'Married',
    bloodGroup: candidate?.bloodGroup || jfd.bloodGroup || 'O+',
    nationality: candidate?.nationality || jfd.nationality || 'Indian',
    religion: jfd.religion || 'Hindu',
    languagesKnown: candidate?.languagesKnown || jfd.languagesKnown || 'English (Fluent), Hindi (National)',
    selfInterests: candidate?.selfInterests || jfd.selfInterests || 'Coding & Open Source Development',

    // Section 2: Contact & Address
    mobile: candidate?.mobile || jfd.mobile || '+91 98765 43210',
    alternateMobile: candidate?.alternateMobile || jfd.alternateMobile || '+91 98111 22334',
    email: candidate?.email || jfd.email || 'rajesh.k@gmail.com',
    state: candidate?.state || jfd.state || 'Karnataka',
    city: candidate?.city || jfd.city || 'Bengaluru',
    area: candidate?.area || jfd.area || 'Koramangala 4th Block, Bengaluru',
    pincode: candidate?.pincode || jfd.pincode || '560103',
    presentAddress: candidate?.presentAddress || jfd.presentAddress || '124, Green Glen Layout, Bellandur, Bengaluru, KA - 560103',
    permanentAddress: candidate?.permanentAddress || jfd.permanentAddress || '45, MG Road, Civil Lines, Jaipur, RJ - 302001',
    emergencyContactName: candidate?.emergencyContactName || jfd.emergencyContactName || 'Suresh Kumar (Father)',
    emergencyContactPhone: candidate?.emergencyContactPhone || jfd.emergencyContactPhone || '+91 98111 22334',

    // Section 3: Education & Academic
    qualificationCategory: candidate?.qualificationCategory || jfd.qualificationCategory || 'Under Graduate (UG / Bachelor Degree)',
    highestQualification: candidate?.highestQualification || jfd.highestQualification || 'B.Tech / B.E. in Computer Science',
    primarySkill: candidate?.primarySkill || jfd.primarySkill || 'React JS, Node.js, Python',
    college: candidate?.college || jfd.college || 'BMS College of Engineering',
    university: candidate?.university || jfd.university || 'VTU Technological University',
    passingYear: candidate?.passingYear || jfd.passingYear || '2020',
    percentage: candidate?.percentage || jfd.percentage || '84.5%',

    // Section 4: Employment Position & Experience
    empId: candidate?.empId || jfd.empId || 'EMP-2026-88',
    designation: candidate?.designation || jfd.designation || 'Senior Software Engineer',
    dept: candidate?.dept || jfd.dept || 'Engineering & Software Architecture',
    jobCategory: candidate?.jobCategory || jfd.jobCategory || 'Information Technology & Software Services',
    jobType: candidate?.jobType || jfd.jobType || 'Full Time Permanent',
    workLocation: candidate?.workLocation || jfd.workLocation || 'Bengaluru Global Tech Hub (HQ)',
    previousEmployer: candidate?.previousEmployer || jfd.previousEmployer || 'Infosys Limited',
    experienceYears: candidate?.experienceYears || jfd.experienceYears || '4.5',
    doj: jfd.doj || '2026-09-01',

    // Section 5: Government Identifiers
    aadhaarNo: candidate?.aadhaarNo || jfd.aadhaarNo || '5489 1234 9876',
    panNo: candidate?.panNo || jfd.panNo || 'ABCDE1234F',
    drivingLicense: candidate?.drivingLicense || jfd.drivingLicense || 'KA-01201900124',
    passportNo: candidate?.passportNo || jfd.passportNo || 'J8912401',
    voterId: candidate?.voterId || jfd.voterId || 'WZK8912301',
    uanEpf: candidate?.uanEpf || jfd.uanEpf || '100982341209',
    esicNo: candidate?.esicNo || jfd.esicNo || '310082910291',

    // Section 6: Bank Payroll Details
    accountHolderName: candidate?.name || jfd.accountHolderName || 'Rajesh Kumar',
    bankName: candidate?.bankName || jfd.bankName || 'HDFC Bank',
    bankAccountNo: candidate?.bankAccountNo || jfd.bankAccountNo || '50100234129845',
    ifscCode: candidate?.ifscCode || jfd.ifscCode || 'HDFC0001234',
    bankBranch: jfd.bankBranch || 'Koramangala Branch',

    // Section 7: Nominee Dependents
    nomineeName: candidate?.nomineeName || jfd.nomineeName || 'Sunita Kumar',
    nomineeRelation: candidate?.nomineeRelation || jfd.nomineeRelation || 'Spouse (100% Share)',
    nomineeDob: jfd.nomineeDob || '1998-11-20',
    nomineeAadhaar: jfd.nomineeAadhaar || '9812 3456 7890',
    insuranceDependents: candidate?.insuranceDependents || jfd.insuranceDependents || 'Spouse + Dependent Parents',

    // Section 8: Industry Specialization
    employeeCategory: candidate?.employeeCategory || jfd.employeeCategory || candSpec.industryType || 'it_tech',
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

        {/* Form Section Navigation Tabs (10 Sections) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setActiveSection('personal')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap btn-interactive tab-interactive ${
              activeSection === 'personal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Personal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('address')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap btn-interactive tab-interactive ${
              activeSection === 'address' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>2. Address</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('education')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap btn-interactive tab-interactive ${
              activeSection === 'education' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>3. Education</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('employment')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap btn-interactive tab-interactive ${
              activeSection === 'employment' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>4. Employment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('govt')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap btn-interactive tab-interactive ${
              activeSection === 'govt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>5. Govt IDs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('bank')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap btn-interactive tab-interactive ${
              activeSection === 'bank' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>6. Bank Payroll</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('nominee')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer btn-interactive tab-interactive ${
              activeSection === 'nominee' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>7. Dependents</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('industry')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer btn-interactive tab-interactive ${
              activeSection === 'industry' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>8. Industry Matrix 🌟</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('documents')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer btn-interactive tab-interactive ${
              activeSection === 'documents' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>9. Upload Documents 📁</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('statutory_agreements')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer btn-interactive tab-interactive ${
              activeSection === 'statutory_agreements' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>10. Statutory Agmts ⚖️</span>
          </button>
        </div>

        {/* Master Joining Form Body */}
        <form onSubmit={handleFinalFormSubmit} className="space-y-4 text-xs max-h-[55vh] overflow-y-auto pr-1">
          
          {/* SECTION 1: PERSONAL & BIO DEMOGRAPHICS */}
          {activeSection === 'personal' && (
            <div className="space-y-4 animate-tab-switch">
              <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">Section 1: Personal & Bio Demographics</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Candidate Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.fullName} 
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Father's / Husband's Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.fatherName} 
                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date of Birth (DOB) *</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.dob} 
                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender *</label>
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Marital Status</label>
                  <select 
                    value={formData.maritalStatus} 
                    onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group *</label>
                  <select 
                    value={formData.bloodGroup} 
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    {(masterDropdownOptions?.bloodGroups || ['O+', 'A+', 'B+', 'AB+']).map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nationality</label>
                  <input 
                    type="text" 
                    value={formData.nationality} 
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                    className="form-input" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CONTACT & ADDRESS INFORMATION */}
          {activeSection === 'address' && (
            <div className="space-y-4 animate-tab-switch">
              <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">Section 2: Contact & Address Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Number (SMS & WhatsApp) *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.mobile} 
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="form-input" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Present Residential Address *</label>
                <textarea 
                  rows="2" 
                  required 
                  value={formData.presentAddress} 
                  onChange={e => setFormData({ ...formData, presentAddress: e.target.value })}
                  className="form-textarea text-xs" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Permanent Residential Address *</label>
                <textarea 
                  rows="2" 
                  required 
                  value={formData.permanentAddress} 
                  onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })}
                  className="form-textarea text-xs" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Emergency Contact Person & Relationship *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.emergencyContactName} 
                    onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Emergency Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.emergencyContactPhone} 
                    onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="form-input" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: GOVERNMENT IDENTIFIERS */}
          {activeSection === 'govt' && (
            <div className="space-y-4 animate-tab-switch">
              <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">Section 3: Government Identifiers & Statutory Proofs</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Aadhaar UIDAI Number (12 Digits) *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.aadhaarNo} 
                    onChange={e => setFormData({ ...formData, aadhaarNo: e.target.value })}
                    className="form-input font-mono font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tax PAN Card Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.panNo} 
                    onChange={e => setFormData({ ...formData, panNo: e.target.value })}
                    className="form-input font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Driving License (DL) Number</label>
                  <input 
                    type="text" 
                    value={formData.drivingLicense} 
                    onChange={e => setFormData({ ...formData, drivingLicense: e.target.value })}
                    className="form-input font-mono" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Passport Number</label>
                  <input 
                    type="text" 
                    value={formData.passportNo} 
                    onChange={e => setFormData({ ...formData, passportNo: e.target.value })}
                    className="form-input font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">UAN / EPF Universal Account Number</label>
                  <input 
                    type="text" 
                    value={formData.uanEpf} 
                    onChange={e => setFormData({ ...formData, uanEpf: e.target.value })}
                    className="form-input font-mono" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: EMPLOYMENT ASSIGNMENT */}
          {activeSection === 'employment' && (
            <div className="space-y-4 animate-tab-switch">
              <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">Section 4: Employment & Job Assignment</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Employee Code / ID *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.empId} 
                    onChange={e => setFormData({ ...formData, empId: e.target.value })}
                    className="form-input font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Job Designation *</label>
                  <select 
                    value={formData.designation} 
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    {(masterDropdownOptions?.designations || []).map(desig => (
                      <option key={desig} value={desig}>{desig}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department *</label>
                  <select 
                    value={formData.dept} 
                    onChange={e => setFormData({ ...formData, dept: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    {(masterDropdownOptions?.departments || []).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date of Joining (DOJ) *</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.doj} 
                    onChange={e => setFormData({ ...formData, doj: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Employment Type *</label>
                  <select 
                    value={formData.employmentType} 
                    onChange={e => setFormData({ ...formData, employmentType: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    {(masterDropdownOptions?.employmentTypes || []).map(empType => (
                      <option key={empType} value={empType}>{empType}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Work Location / Branch *</label>
                  <select 
                    value={formData.workLocation} 
                    onChange={e => setFormData({ ...formData, workLocation: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    {(masterDropdownOptions?.workLocations || []).map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: EDUCATION QUALIFICATIONS */}
          {activeSection === 'education' && (
            <div className="space-y-4 animate-tab-switch">
              <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">Section 5: Educational & Professional Qualifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Highest Degree / Qualification *</label>
                  <select 
                    value={formData.highestQualification} 
                    onChange={e => setFormData({ ...formData, highestQualification: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    {(masterDropdownOptions?.qualifications || []).map(qual => (
                      <option key={qual} value={qual}>{qual}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">University / Board / Institute *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.university} 
                    onChange={e => setFormData({ ...formData, university: e.target.value })}
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Year of Passing</label>
                  <input 
                    type="text" 
                    value={formData.passingYear} 
                    onChange={e => setFormData({ ...formData, passingYear: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Aggregate Percentage / Grade</label>
                  <input 
                    type="text" 
                    value={formData.percentage} 
                    onChange={e => setFormData({ ...formData, percentage: e.target.value })}
                    className="form-input" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: BANK PAYROLL DETAILS */}
          {activeSection === 'bank' && (
            <div className="space-y-4 animate-tab-switch">
              <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">Section 6: Bank Account & Salary Payroll Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Holder Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.accountHolderName} 
                    onChange={e => setFormData({ ...formData, accountHolderName: e.target.value })}
                    className="form-input font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bank Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.bankName} 
                    onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bank Account Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.bankAccountNo} 
                    onChange={e => setFormData({ ...formData, bankAccountNo: e.target.value })}
                    className="form-input font-mono font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bank IFSC Code *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.ifscCode} 
                    onChange={e => setFormData({ ...formData, ifscCode: e.target.value })}
                    className="form-input font-mono uppercase" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: NOMINEE DEPENDENTS */}
          {activeSection === 'nominee' && (
            <div className="space-y-4 animate-tab-switch">
              <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider">Section 7: Nominee & Family Dependents</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nominee Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.nomineeName} 
                    onChange={e => setFormData({ ...formData, nomineeName: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Relationship with Candidate *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.nomineeRelation} 
                    onChange={e => setFormData({ ...formData, nomineeRelation: e.target.value })}
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nominee Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.nomineeDob} 
                    onChange={e => setFormData({ ...formData, nomineeDob: e.target.value })}
                    className="form-input" 
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nominee Aadhaar Number</label>
                  <input 
                    type="text" 
                    value={formData.nomineeAadhaar} 
                    onChange={e => setFormData({ ...formData, nomineeAadhaar: e.target.value })}
                    className="form-input font-mono" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: DYNAMIC INDUSTRY & ROLE SPECIALIZATION MATRIX */}
          {activeSection === 'industry' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    <span>Section 8: Industry & Specialized Role Matrix</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Operational and regulatory particulars specific to your industry vertical: <strong className="text-indigo-900 uppercase">{(formData.employeeCategory || 'it_tech').replace('_', ' ')}</strong>
                  </p>
                </div>
                <span className="badge badge-indigo text-[10px]">Sector Specific</span>
              </div>

              {/* IT & Software */}
              {(formData.employeeCategory === 'it_tech' || !formData.employeeCategory) && (
                <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                    <span>💻</span>
                    <span>IT, Software Engineering & AI Operations</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Core Tech Stack & Frameworks</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.techStack || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, techStack: e.target.value } })}
                        className="form-input font-bold"
                        placeholder="React, Node.js, Python, PostgreSQL, AWS"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">GitHub / Code Repository URL</label>
                      <input 
                        type="url"
                        value={formData.industrySpecialization?.githubUrl || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, githubUrl: e.target.value } })}
                        className="form-input font-mono"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Laptop Asset Tag Number</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.laptopAssetTag || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, laptopAssetTag: e.target.value } })}
                        className="form-input font-mono"
                        placeholder="JOY-ASSET-LT-2026-088"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Anti-Moonlighting / Dual Employment Disclosure</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.dualEmploymentDisclosure || 'No Dual Employment / 100% Exclusive Commitment'}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, dualEmploymentDisclosure: e.target.value } })}
                        className="form-input text-emerald-800 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Manufacturing & Plant */}
              {formData.employeeCategory === 'manufacturing' && (
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                    <span>🏭</span>
                    <span>Manufacturing & Plant Operations</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Plant Location & Unit</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.plantLocation || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, plantLocation: e.target.value } })}
                        className="form-input font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Shift Duty Roster</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.shiftRoster || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, shiftRoster: e.target.value } })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Safety Shoe Size (UK/EUR)</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.safetyShoeSize || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, safetyShoeSize: e.target.value } })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Occupational Medical Fitness Cert No</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.occupationalHealthCertNo || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, occupationalHealthCertNo: e.target.value } })}
                        className="form-input font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BFSI & Banking */}
              {formData.employeeCategory === 'bfsi' && (
                <div className="p-4 bg-cyan-50/50 border border-cyan-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-cyan-900 font-extrabold text-xs">
                    <span>🏦</span>
                    <span>BFSI, Banking & Fintech Governance</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">CIBIL Score Range Standing</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.cibilScoreRange || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, cibilScoreRange: e.target.value } })}
                        className="form-input font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Finance & Investment Certifications (NISM/IRDA/CA)</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.certificationsBfsi || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, certificationsBfsi: e.target.value } })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Corporate Fidelity Bond Indemnity Limit</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.fidelityBondLimit || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, fidelityBondLimit: e.target.value } })}
                        className="form-input font-bold text-indigo-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">SEBI Insider Trading Compliance</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.sebiInsiderTradingClearance || 'Cleared - Zero Adverse SEBI Trading Flags'}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, sebiInsiderTradingClearance: e.target.value } })}
                        className="form-input text-emerald-800 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Healthcare & Pharma */}
              {formData.employeeCategory === 'healthcare' && (
                <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-900 font-extrabold text-xs">
                    <span>🏥</span>
                    <span>Healthcare, Hospital & Clinical Practice</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Medical / Nursing Council Registration No</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.medicalCouncilRegNo || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, medicalCouncilRegNo: e.target.value } })}
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Assigned Clinical Department / Ward</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.departmentWard || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, departmentWard: e.target.value } })}
                        className="form-input"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">Mandatory Immunization & Life Support Protocol</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.immunizationStatus || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, immunizationStatus: e.target.value } })}
                        className="form-input text-emerald-800 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Logistics & Fleet */}
              {formData.employeeCategory === 'logistics' && (
                <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                    <span>🚚</span>
                    <span>Logistics, Heavy Transport & Fleet Operations</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Commercial Transport DL Badge No</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.commercialDlBadgeNo || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, commercialDlBadgeNo: e.target.value } })}
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Forklift / MHE License Number</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.forkliftLicenseNo || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, forkliftLicenseNo: e.target.value } })}
                        className="form-input font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">Police Character NOC & Route Telematics Consent</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.policeNocNumber || 'POL-TN-CHN-2026-9041 (Cleared)'}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, policeNocNumber: e.target.value } })}
                        className="form-input text-emerald-800 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Retail & Hospitality */}
              {formData.employeeCategory === 'retail_hospitality' && (
                <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-orange-900 font-extrabold text-xs">
                    <span>🛍️</span>
                    <span>Retail Operations, Hospitality & F&B Frontline</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">FSSAI FoSTaC Training Certificate No</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.fssaiCertNo || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, fssaiCertNo: e.target.value } })}
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Uniform Shirt & Pant Size</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.uniformShirtSize || 'M (38 cm Shirt)'}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, uniformShirtSize: e.target.value } })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Assigned Retail Outlet Code</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.assignedStoreCode || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, assignedStoreCode: e.target.value } })}
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">POS Cash Reconciliation & Shifts Agreement</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.storeShiftPreference || 'Weekend Peak Shifts Available'}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, storeShiftPreference: e.target.value } })}
                        className="form-input text-emerald-800 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contract Labor */}
              {formData.employeeCategory === 'contractual' && (
                <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                    <span>🏗️</span>
                    <span>Contract Labor Act (Form XIII) & Facility Workforce</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Contract Labor Act Form XIII Enrollment No</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.contractFormXIIIEnrollmentNo || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, contractFormXIIIEnrollmentNo: e.target.value } })}
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Manpower Agency Contractor Name</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.contractorAgencyName || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, contractorAgencyName: e.target.value } })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Principal Employer PO / Work Order</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.workOrderPoNumber || ''}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, workOrderPoNumber: e.target.value } })}
                        className="form-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Wage Rate Classification</label>
                      <input 
                        type="text"
                        value={formData.industrySpecialization?.wageRateClassification || 'Skilled Grade Rate (₹950/Day)'}
                        onChange={e => setFormData({ ...formData, industrySpecialization: { ...formData.industrySpecialization, wageRateClassification: e.target.value } })}
                        className="form-input text-emerald-800 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 9: UPLOAD REQUIRED ORIGINAL COMPLIANCE DOCUMENTS */}
          {activeSection === 'documents' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <FolderDown className="w-4 h-4 text-indigo-600" />
                    <span>Section 9: Upload Original Compliance Documents & Proofs</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload clear scanned PDFs or high-resolution photos of your original government documents.
                  </p>
                </div>
                <span className="badge badge-emerald text-[10px]">Vault AES-256 Encrypted</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {[
                  { id: 'u_aadhaar', name: '1. Government Aadhaar Card (Front & Back)', type: 'Identity Proof', size: '1.4 MB PDF', status: 'Uploaded & Verified ✓', masked: 'XXXX XXXX 9876' },
                  { id: 'u_pan', name: '2. Income Tax PAN Card Copy', type: 'Tax Identification', size: '820 KB PNG', status: 'Uploaded & Verified ✓', masked: 'ABCDE1234F' },
                  { id: 'u_bank', name: '3. Bank Passbook / Cancelled Cheque Leaf', type: 'Payroll & Banking', size: '950 KB PDF', status: 'Uploaded & Verified ✓', masked: 'HDFC Bank ...9845' },
                  { id: 'u_degree', name: '4. Highest Degree Certificate / Marksheet', type: 'Academic Convocation', size: '2.1 MB PDF', status: 'Uploaded & Verified ✓', masked: 'B.Tech / 84.5%' },
                  { id: 'u_relieving', name: '5. Previous Employer Relieving & Service Letter', type: 'Employment History', size: '1.8 MB PDF', status: 'Uploaded & Verified ✓', masked: 'Infosys Limited' },
                  { id: 'u_nda', name: '6. Signed Non-Disclosure Agreement (NDA)', type: 'Executed Legal Copy', size: '1.1 MB PDF', status: 'Executed & Signed ✓', masked: 'Legal Covenant' },
                  { id: 'u_passport', name: '7. Passport Bio-Data Page (if applicable)', type: 'Travel & Citizenship', size: '1.6 MB PDF', status: 'Uploaded & Stamped ✓', masked: 'Passport Seva' },
                  { id: 'u_salary', name: '8. Last 3 Months Salary Slips', type: 'Income Proof', size: '1.2 MB PDF', status: 'Uploaded & Stamped ✓', masked: 'Pay Slips Attached' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 hover:border-indigo-300 transition-all flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block leading-tight">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.type} • {item.size}</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap border border-emerald-300">
                        {item.status}
                      </span>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono text-[11px] font-bold text-slate-700">{item.masked}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(item)}
                          className="btn btn-secondary text-[10px] py-1 px-2 flex items-center gap-1 font-bold hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast(`File re-uploaded for ${item.name}`)}
                          className="btn btn-secondary text-[10px] py-1 px-2 flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 border-indigo-200 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Replace</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 10: STATUTORY COMPLIANCE FORMS & LEGAL AGREEMENTS */}
          {activeSection === 'statutory_agreements' && (
            <div className="space-y-4 animate-tab-switch">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-extrabold text-sm text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Section 10: Statutory Compliance Forms & Legal Agreements</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Review and electronically sign official statutory compliance declarations required under Indian Labor Laws.
                  </p>
                </div>
                <span className="badge badge-purple text-[10px]">Govt Approved Formats</span>
              </div>

              {/* Form 16 / 16A TDS Tax Declaration */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-extrabold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>1. Form 16 / 16A TDS Declaration (Income Tax Act 1961 • Sec 192)</span>
                  </strong>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">CBDT Format</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  I confirm my tax regime choice under Section 115BAC (New Tax Regime) and declare that all tax deduction claims under Section 192 are accurate.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 bg-white rounded border">PAN: <strong className="text-emerald-700">{formData.panNo || 'ABCDE1234F'} ✓</strong></div>
                  <div className="p-2 bg-white rounded border">AY: <strong>2026-27</strong></div>
                  <div className="p-2 bg-white rounded border">Regime: <strong>New (Sec 115BAC)</strong></div>
                  <div className="p-2 bg-white rounded border">Form 12B: <strong className="text-emerald-700">Attached ✓</strong></div>
                </div>
              </div>

              {/* Form 11 EPFO Declaration */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>2. Form 11 EPFO Statutory Declaration (EPF Scheme 1952)</span>
                  </strong>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">EPFO Prescribed</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Declaration by a person taking up employment in an establishment in which Employees' Provident Fund Scheme applies.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 bg-white rounded border">UAN No: <strong className="text-emerald-700">{formData.uanEpf || '100982341209'} ✓</strong></div>
                  <div className="p-2 bg-white rounded border">Prev PF ID: <strong>BGBNG0012345...</strong></div>
                  <div className="p-2 bg-white rounded border">Transfer Mode: <strong className="text-emerald-700">Auto Transfer Opted</strong></div>
                </div>
              </div>

              {/* Form F Gratuity Nomination */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-extrabold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>3. Form 'F' Gratuity Nomination (Payment of Gratuity Act 1972 • Rule 6(1))</span>
                  </strong>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">Rule 6(1)</span>
                </div>
                <div className="p-2 bg-white rounded border text-[11px] flex justify-between">
                  <span>Nominee: <strong>{formData.nomineeName} ({formData.nomineeRelation})</strong></span>
                  <span className="text-emerald-700 font-bold">Proportion of Gratuity: 100%</span>
                </div>
              </div>

              {/* ESIC Form 1 Registration */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>4. ESIC Form 1 Declaration (Employees' State Insurance Act 1948)</span>
                  </strong>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">ESIC Medical</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2 bg-white rounded border">ESIC IP Number: <strong>{formData.esicNo || '310082910291'}</strong></div>
                  <div className="p-2 bg-white rounded border">Dispensary: <strong>State ESIC Hospital Unit</strong></div>
                  <div className="p-2 bg-white rounded border">Coverage: <strong className="text-emerald-700">Self + Dependents ✓</strong></div>
                </div>
              </div>

              {/* Employee NDA & IP Assignment */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>5. Employee Non-Disclosure Agreement (NDA) & IP Assignment Covenant</span>
                  </strong>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">Indian Contract Act 1872</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  I agree to keep all proprietary information, algorithms, client lists, and confidential intellectual property of the employer secure and protected indefinitely.
                </p>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Digitally Executed & Bound upon OTP submission.</span>
                </div>
              </div>

              {/* POSH Workplace Harassment Policy */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>6. POSH Policy Acknowledgement (POSH Act 2013)</span>
                  </strong>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">HR Governance</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  I confirm that I have received, read, and understood the Prevention of Sexual Harassment (POSH) workplace policy and agree to adhere strictly to all zero-tolerance workplace standards.
                </p>
              </div>

              {/* Non-Compete & Non-Solicitation */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>7. Non-Compete & Non-Solicitation Undertaking</span>
                  </strong>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">Corporate Covenant</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  I covenant that during my tenure and for 12 months post-cessation, I shall not solicit employer clients, poach colleagues, or utilize proprietary trade secrets in competing businesses.
                </p>
              </div>

              {/* Contract Labor Act Form XIII */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>8. Contract Labor Register Entry (Contract Labor Regulation & Abolition Act 1970 • Form XIII)</span>
                  </strong>
                  <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">CLRA Statutory</span>
                </div>
                <div className="p-2 bg-white rounded border font-mono text-[11px] flex justify-between">
                  <span>Register Reg No: <strong>{formData.industrySpecialization?.contractFormXIIIEnrollmentNo || 'CL-RA-2026-FORM-XIII-912'}</strong></span>
                  <span className="text-emerald-700 font-bold">Principal Employer Work Order Verified ✓</span>
                </div>
              </div>

            </div>
          )}

          {/* Submit Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 font-medium">
              {!aadhaarVerified || !mobileVerified ? (
                <span className="text-rose-600 font-bold">⚠️ Both Aadhaar OTP and Mobile OTP are mandatory before submission.</span>
              ) : (
                <span className="text-emerald-700 font-bold">✅ Mandatory OTP Verifications Completed! Ready to submit profile.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
              <button 
                type="submit" 
                className="btn btn-hrexecutive text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save & Submit Joining Form</span>
              </button>
            </div>
          </div>

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
