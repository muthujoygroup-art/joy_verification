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
  Building2
} from 'lucide-react';

export const FullJoiningFormModal = ({ candidate, isHrMode = false, onClose, onSubmitComplete }) => {
  const { updateCandidateVerification, showToast, masterDropdownOptions } = useApp();

  const [activeSection, setActiveSection] = useState('personal'); // 'personal' | 'address' | 'govt' | 'employment' | 'education' | 'bank' | 'nominee'

  const [formData, setFormData] = useState({
    // Section 1: Personal & Bio Demographics
    fullName: candidate?.name || 'Rajesh Kumar',
    fatherName: 'Suresh Kumar',
    dob: '1996-05-15',
    gender: 'Male',
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    nationality: 'Indian',
    religion: 'Hindu',

    // Section 2: Contact & Address
    mobile: candidate?.mobile || '+91 98765 43210',
    email: candidate?.email || 'rajesh.k@gmail.com',
    presentAddress: '124, Green Glen Layout, Bellandur, Bengaluru, KA - 560103',
    permanentAddress: '45, MG Road, Civil Lines, Jaipur, RJ - 302001',
    emergencyContactName: 'Suresh Kumar (Father)',
    emergencyContactPhone: '+91 98111 22334',

    // Section 3: Government Identifiers
    aadhaarNo: candidate?.aadhaarNo || '5489 1234 9876',
    panNo: 'ABCDE1234F',
    drivingLicense: 'RJ-14201800912',
    passportNo: 'Z9812401',
    uanEpf: '100982341209',

    // Section 4: Employment Position
    empId: candidate?.empId || 'EMP-2026-88',
    designation: candidate?.designation || 'Senior Software Engineer',
    dept: candidate?.dept || 'Engineering',
    doj: '2026-08-25',
    employmentType: 'Full Time Permanent',
    workLocation: 'Bengaluru HQ',
    managerName: 'Vikram Malhotra',

    // Section 5: Education
    highestQualification: 'B.Tech in Computer Science',
    university: 'VTU Technological University',
    passingYear: '2018',
    percentage: '82.4%',

    // Section 6: Bank Payroll Details
    accountHolderName: candidate?.name || 'Rajesh Kumar',
    bankName: 'HDFC Bank',
    bankAccountNo: '50100234129845',
    ifscCode: 'HDFC0001234',
    bankBranch: 'Koramangala Branch',

    // Section 7: Nominee Dependents
    nomineeName: 'Sunita Kumar',
    nomineeRelation: 'Spouse',
    nomineeDob: '1998-11-20',
    nomineeAadhaar: '9812 3456 7890'
  });

  // OTP Verification States
  const [showAadhaarOtpModal, setShowAadhaarOtpModal] = useState(false);
  const [showMobileOtpModal, setShowMobileOtpModal] = useState(false);
  const [aadhaarInputOtp, setAadhaarInputOtp] = useState('');
  const [mobileInputOtp, setMobileInputOtp] = useState('');

  const [aadhaarVerified, setAadhaarVerified] = useState(candidate?.verificationsCompleted?.aadhaar || false);
  const [mobileVerified, setMobileVerified] = useState(candidate?.verificationsCompleted?.mobile || false);

  const handleAadhaarOtpSubmit = (e) => {
    e.preventDefault();
    if (aadhaarInputOtp.length < 4) {
      alert('Please enter valid 6-digit OTP code.');
      return;
    }
    setAadhaarVerified(true);
    setShowAadhaarOtpModal(false);
    if (candidate) updateCandidateVerification(candidate.token, 'aadhaar', true);
    showToast('Aadhaar UIDAI OTP Verified successfully!');
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

  const handleFinalFormSubmit = (e) => {
    e.preventDefault();
    if (!aadhaarVerified || !mobileVerified) {
      alert('Mandatory OTP Verification Required: Please complete both Aadhaar OTP and Mobile OTP verification before submitting.');
      return;
    }

    if (onSubmitComplete) {
      onSubmitComplete(formData);
    }
    showToast('Comprehensive Employee Joining Form Submitted & Profile Verified!');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl p-4 sm:p-6 space-y-5 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-purple text-[10px]">CiteHR Enterprise Format</span>
              <span className="text-xs text-slate-500 font-bold">• {isHrMode ? 'HR Manual Entry & Station Verification' : 'Candidate Joining Form'}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">Exhaustive Employee / Labor Profile Joining Form</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
        </div>

        {/* Mandatory OTP Verification Status Bar */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Mandatory Verification Status:</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Aadhaar Badge / Button */}
            {aadhaarVerified ? (
              <span className="badge badge-emerald text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aadhaar OTP Verified ✅</span>
              </span>
            ) : (
              <button 
                type="button"
                onClick={() => setShowAadhaarOtpModal(true)}
                className="btn btn-superadmin text-[11px] py-1 px-3 flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verify Aadhaar OTP *</span>
              </button>
            )}

            {/* Mobile Badge / Button */}
            {mobileVerified ? (
              <span className="badge badge-emerald text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mobile OTP Verified ✅</span>
              </span>
            ) : (
              <button 
                type="button"
                onClick={() => setShowMobileOtpModal(true)}
                className="btn btn-company text-[11px] py-1 px-3 flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Verify Mobile OTP *</span>
              </button>
            )}
          </div>
        </div>

        {/* Form Section Navigation Tabs (7 Sections) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSection('personal')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'personal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Personal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('address')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'address' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>2. Address</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('govt')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'govt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Govt Proofs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('employment')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'employment' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>4. Employment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('education')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'education' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>5. Education</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('bank')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'bank' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>6. Bank Payroll</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('nominee')}
            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'nominee' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>7. Dependents</span>
          </button>
        </div>

        {/* Master Joining Form Body */}
        <form onSubmit={handleFinalFormSubmit} className="space-y-4 text-xs max-h-[55vh] overflow-y-auto pr-1">
          
          {/* SECTION 1: PERSONAL & BIO DEMOGRAPHICS */}
          {activeSection === 'personal' && (
            <div className="space-y-4 animate-fadeIn">
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
            <div className="space-y-4 animate-fadeIn">
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
            <div className="space-y-4 animate-fadeIn">
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
            <div className="space-y-4 animate-fadeIn">
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
            <div className="space-y-4 animate-fadeIn">
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
            <div className="space-y-4 animate-fadeIn">
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
            <div className="space-y-4 animate-fadeIn">
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
              <button type="button" onClick={onClose} className="btn btn-secondary text-xs font-bold">Cancel</button>
              <button 
                type="submit" 
                className="btn btn-hrexecutive text-xs flex items-center gap-2 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save & Submit Joining Form</span>
              </button>
            </div>
          </div>

        </form>

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
                  <button type="button" onClick={() => setShowMobileOtpModal(false)} className="btn btn-secondary text-xs font-bold">Cancel</button>
                  <button type="submit" className="btn btn-company text-xs">Confirm Mobile OTP</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
