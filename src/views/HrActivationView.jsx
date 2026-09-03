import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  FileCheck, 
  Scale, 
  Globe, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  Info
} from 'lucide-react';

export const HrActivationView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast, setCurrentRole } = useApp();

  const token = searchParams.get('token') || '';

  // Loading & State variables
  const [isLoading, setIsLoading] = useState(true);
  const [hrDetails, setHrDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Security Password Lock State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  // 4-Step Wizard Tracking
  // Step 1: Personal & Contact Details
  // Step 2: Employment & Educational Profile
  // Step 3: Statutory Document Proofs Upload
  // Step 4: Code of Conduct & DPDP Agreement
  const [activeStep, setActiveStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dept: 'Human Resources',
    designation: 'HR Recruiter',
    dob: '',
    gender: 'Male',
    emergency_contact: '',
    current_address: '',
    permanent_address: '',
    emp_id: '',
    doj: '',
    work_location: '',
    highest_degree: 'Bachelor of Technology (B.Tech / B.E.)',
    institution: '',
    passing_year: '2022',
    specialization: 'Computer Science & Engineering'
  });

  // Uploaded Files (Base64)
  const [documents, setDocuments] = useState({
    gov_id: null,
    degree_cert: null,
    exp_letter: null,
    photo: null
  });

  // Terms Acceptance State
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dpdpConsentAccepted, setDpdpConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActivatedSuccess, setIsActivatedSuccess] = useState(false);

  // 1. Fetch HR Activation Status on Mount
  useEffect(() => {
    if (!token) {
      setErrorMsg('No activation token provided. Please check the invitation email sent by your Company Administrator.');
      setIsLoading(false);
      return;
    }

    api.getHrActivationDetails(token)
      .then((data) => {
        if (data) {
          setHrDetails(data);
          setIsExpired(data.is_expired);
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            phone: data.phone || (data.personal_details || {}).phone || '',
            dept: data.dept || 'Human Resources',
            designation: data.designation || 'HR Recruiter',
            emp_id: (data.employment_details || {}).emp_id || '',
            highest_degree: (data.education_details || {}).highest_degree || 'Bachelor of Technology (B.Tech / B.E.)'
          }));

          if (data.status === 'Active' || data.activation_status === 'Active') {
            setIsActivatedSuccess(true);
            setIsUnlocked(true);
          } else if (data.status === 'Pending Approval' || data.activation_status === 'Pending Approval') {
            setIsUnlocked(true);
          }
        }
      })
      .catch((err) => {
        console.error('HR token validation failed:', err);
        setErrorMsg(err.message || 'Invalid or expired HR activation link');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  // Handle File Upload to Base64
  const handleFileUpload = (e, docKey) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('⚠️ File size exceeds 5MB limit. Please upload a smaller file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDocuments(prev => ({
        ...prev,
        [docKey]: reader.result
      }));
      showToast(`📄 ${file.name} uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // 2. Unlock Portal with 4-Digit Security PIN
  const handleUnlockSecurity = async (e) => {
    e.preventDefault();
    if (!enteredPassword) {
      setUnlockError('Please enter your 4-digit security unlock PIN');
      return;
    }

    setIsUnlocking(true);
    setUnlockError('');

    try {
      const res = await api.unlockHrActivation(token, enteredPassword);
      if (res && res.success) {
        setIsUnlocked(true);
        showToast(res.message || '🎉 Workstation unlocked! Please complete your HR profile.');
      }
    } catch (err) {
      setUnlockError(err.message || 'Incorrect PIN. Please check your invitation email.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // 3. Final Submission
  const handleSubmitCompleteProfile = async (e) => {
    e.preventDefault();
    if (!termsAccepted || !dpdpConsentAccepted) {
      showToast('⚠️ Please accept the HR Code of Conduct and DPDP Act 2023 Consent to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        token,
        name: formData.name,
        phone: formData.phone,
        dept: formData.dept,
        designation: formData.designation,
        personal_details: {
          dob: formData.dob,
          gender: formData.gender,
          emergency_contact: formData.emergency_contact,
          current_address: formData.current_address,
          permanent_address: formData.permanent_address
        },
        employment_details: {
          emp_id: formData.emp_id,
          doj: formData.doj,
          work_location: formData.work_location,
          department: formData.dept,
          designation: formData.designation
        },
        education_details: {
          highest_degree: formData.highest_degree,
          institution: formData.institution,
          passing_year: formData.passing_year,
          specialization: formData.specialization
        },
        documents: documents
      };

      const res = await api.completeHrActivation(payload);
      showToast(res.message || '🎉 HR Profile submitted successfully!');
      setHrDetails(prev => ({ ...prev, status: 'Pending Approval', activation_status: 'Pending Approval' }));
    } catch (err) {
      showToast(`❌ Submission failed: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-300">Validating HR Invitation Token...</p>
      </div>
    );
  }

  if (errorMsg || isExpired) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {isExpired ? 'HR Invitation Link Expired' : 'HR Invitation Link Invalid'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            {errorMsg || 'This HR onboarding invitation has expired or has already been used. Please request your Company Administrator to resend an invitation link.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Go to Login Portal &rarr;
          </button>
        </div>
      </div>
    );
  }

  // AWAITING APPROVAL STATE
  if (hrDetails?.status === 'Pending Approval' || hrDetails?.activation_status === 'Pending Approval') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-lg w-full bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 text-center space-y-5">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[11px] font-black bg-purple-100 text-purple-700 border border-purple-300">
              🟣 PROFILE SUBMITTED & PENDING APPROVAL
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">Thank You, {hrDetails.name}!</h2>
            <p className="text-xs text-slate-600">
              Your HR profile and credentials for <strong>{hrDetails.company_name}</strong> have been submitted and are currently being reviewed by your Company Administrator.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="font-bold text-slate-700 flex items-center justify-between">
              <span>Recruiter ID:</span>
              <span className="font-mono text-indigo-600 font-black">#{hrDetails.id}</span>
            </div>
            <div className="font-bold text-slate-700 flex items-center justify-between">
              <span>Official Email:</span>
              <span className="font-mono">{hrDetails.email}</span>
            </div>
            <div className="font-bold text-slate-700 flex items-center justify-between">
              <span>Department:</span>
              <span>{hrDetails.dept}</span>
            </div>
          </div>

          <p className="text-[11.5px] text-slate-500">
            You will receive a confirmation email once your administrator grants live login access.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
          >
            Go to HR Login Portal &rarr;
          </button>
        </div>
      </div>
    );
  }

  // PIN UNLOCK SCREEN
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Unlock HR Workstation
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Enter the 4-digit security unlock PIN sent in your invitation email for <strong>{hrDetails.company_name}</strong>.
            </p>
          </div>

          <form onSubmit={handleUnlockSecurity} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                4-Digit Security Unlock PIN
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  maxLength={6}
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full px-4 py-3 text-center tracking-widest text-lg font-mono font-bold rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {unlockError && (
                <p className="text-xs font-bold text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {unlockError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUnlocking || !enteredPassword}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUnlocking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{isUnlocking ? 'Verifying PIN...' : 'Unlock & Complete Profile →'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4-STEP HR ONBOARDING WIZARD
  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 flex justify-center items-start">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">HR Recruiter Self-Onboarding</h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {hrDetails.company_name}
                </span>
              </div>
              <p className="text-xs text-indigo-200/70 mt-0.5">
                Staff Candidate: {hrDetails.name} ({hrDetails.email})
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-indigo-300">Step {activeStep} of 4</div>
            <div className="text-[10px] text-indigo-200/60 font-medium">Profile Completion</div>
          </div>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="grid grid-cols-4 bg-slate-100 border-b border-slate-200 text-center text-xs font-bold">
          {[
            { num: 1, label: '👤 Personal Details' },
            { num: 2, label: '🎓 Education & Work' },
            { num: 3, label: '📄 Document Proofs' },
            { num: 4, label: '⚖️ DPDP Consent' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeStep === s.num
                  ? 'bg-white text-indigo-600 border-indigo-600 shadow-xs'
                  : activeStep > s.num
                  ? 'text-emerald-700 border-emerald-500 bg-emerald-50/50'
                  : 'text-slate-400 border-transparent'
              }`}
            >
              <span>{s.label}</span>
              {activeStep > s.num && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmitCompleteProfile} className="p-6 space-y-6">
          
          {/* STEP 1: PERSONAL DETAILS */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">Personal & Contact Details</h3>
                <p className="text-xs text-slate-500 font-medium">Please enter your official contact and personal identity details</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact Person & Phone</label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Ramesh (Spouse) - +91 98401 99999"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Residential Address</label>
                  <textarea
                    rows={2}
                    value={formData.current_address}
                    onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="Enter complete street address, city, state and PIN code"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
                >
                  <span>Next: Education & Work →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION & EMPLOYMENT */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">Employment & Educational Background</h3>
                <p className="text-xs text-slate-500 font-medium">Record your staff role and academic credentials</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Staff / Employee ID</label>
                  <input
                    type="text"
                    value={formData.emp_id}
                    onChange={(e) => setFormData({ ...formData, emp_id: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. JOY-HR-004"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role Title</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Senior Talent Acquisition Specialist"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Highest Educational Degree *</label>
                  <select
                    value={formData.highest_degree}
                    onChange={(e) => setFormData({ ...formData, highest_degree: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="MBA / PGDM (Human Resources)">MBA / PGDM (Human Resources)</option>
                    <option value="Master of Science (M.Sc / MS)">Master of Science (M.Sc / MS)</option>
                    <option value="Master of Arts (MA / M.Com)">Master of Arts (MA / M.Com)</option>
                    <option value="Bachelor of Technology (B.Tech / B.E.)">Bachelor of Technology (B.Tech / B.E.)</option>
                    <option value="Bachelor of Science (B.Sc / BCA)">Bachelor of Science (B.Sc / BCA)</option>
                    <option value="Bachelor of Commerce / Arts (B.Com / B.A.)">Bachelor of Commerce / Arts (B.Com / B.A.)</option>
                    <option value="Diploma / Associate Degree">Diploma / Associate Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institution / University Name *</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Loyola Institute / Anna University"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialization / Major</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="e.g. Human Resources & Talent Analytics"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Year of Graduation / Passing</label>
                  <input
                    type="number"
                    value={formData.passing_year}
                    onChange={(e) => setFormData({ ...formData, passing_year: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 bg-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    placeholder="2022"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
                >
                  <span>Next: Upload Documents →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT PROOFS */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">Upload Statutory Document Proofs</h3>
                <p className="text-xs text-slate-500 font-medium">Upload proof copies of your identity, academic degree, and photograph</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'gov_id', label: 'Government ID Proof (Aadhaar / PAN / Passport)', desc: 'PDF or JPG format (Max 5MB)' },
                  { key: 'degree_cert', label: 'Highest Degree Certificate / Marksheet', desc: 'University Degree / Diploma certificate' },
                  { key: 'exp_letter', label: 'Previous Experience / Relieving Letter', desc: 'Optional prior employer service proof' },
                  { key: 'photo', label: 'Passport Size Profile Photograph', desc: 'Recent clear front-facing photograph' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="p-4 rounded-2xl border bg-slate-50/70 border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-xs font-bold text-slate-900">{label}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 shadow-2xs">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{documents[key] ? 'Replace File' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleFileUpload(e, key)}
                          className="hidden"
                        />
                      </label>

                      {documents[key] ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Check className="w-3 h-3" /> Attached
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">No file chosen</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
                >
                  <span>Next: DPDP Consent →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DPDP CONSENT & CODE OF CONDUCT */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">HR Confidentiality & DPDP Act 2023 Consent</h3>
                <p className="text-xs text-slate-500 font-medium">Please review the statutory compliance declaration before finalizing</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  <strong>1. Confidentiality of Candidate Data:</strong> As an authorized HR Recruiter for {hrDetails.company_name}, I agree that all candidate Aadhaar, PAN, EPFO records, and identity dossiers accessed on the JOY Platform shall remain strictly confidential and will only be used for legitimate employment verification purposes.
                </p>
                <p>
                  <strong>2. DPDP Act 2023 Compliance:</strong> I acknowledge and agree to comply with the Digital Personal Data Protection Act 2023 guidelines regarding candidate data protection, consent obligations, and safe document retention.
                </p>
                <p>
                  <strong>3. Truthfulness of Submission:</strong> I certify that all personal, employment, and educational details provided in this self-activation wizard are true, accurate, and complete to the best of my knowledge.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 font-bold">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 mt-0.5"
                    required
                  />
                  <span>I agree to the HR Code of Conduct and Confidentiality Terms for {hrDetails.company_name}.</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 font-bold">
                  <input
                    type="checkbox"
                    checked={dpdpConsentAccepted}
                    onChange={(e) => setDpdpConsentAccepted(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 mt-0.5"
                    required
                  />
                  <span>I accept the statutory DPDP Act 2023 Data Protection declaration and submit my digital signature.</span>
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !termsAccepted || !dpdpConsentAccepted}
                  className="btn btn-primary text-xs py-3 px-6 flex items-center gap-2 font-black shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Submitting Profile...' : 'Submit Profile & Request Approval →'}</span>
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
