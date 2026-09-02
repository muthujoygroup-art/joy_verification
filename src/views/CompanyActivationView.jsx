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
  CreditCard, 
  Sparkles, 
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  Info
} from 'lucide-react';

export const CompanyActivationView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast, setCurrentRole } = useApp();

  const token = searchParams.get('token') || '';

  // Loading & State variables
  const [isLoading, setIsLoading] = useState(true);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Security Password Lock State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  // 4-Step Wizard Tracking
  // Step 1: Review SuperAdmin Data & Basic Profile (Logo, Website, Address)
  // Step 2: Statutory Corporate Identifiers (CIN, GSTIN, PAN) & Document Proofs
  // Step 3: Master Services Agreement & DPDP Act 2023 Consent Acceptance
  // Step 4: Activation Success & Direct Login
  const [activeStep, setActiveStep] = useState(1);

  // Corporate Profile Fields
  const [corporateData, setCorporateData] = useState({
    cin_number: '',
    gstin_number: '',
    company_pan: '',
    registered_address: '',
    industry_sector: 'Information Technology & Software (IT/ITeS)',
    website: '',
    signatory_name: '',
    signatory_designation: 'Director / Authorized Signatory'
  });

  const [companyLogoBase64, setCompanyLogoBase64] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);

  // Uploaded Statutory Document Files
  const [documents, setDocuments] = useState({
    coi: null, // Certificate of Incorporation
    pan: null, // Company PAN Card
    gst: null, // GST Certificate
    signatory_proof: null // Board Resolution / Signatory Authorization
  });

  // Terms Acceptance State
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dpdpConsentAccepted, setDpdpConsentAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActivatedSuccess, setIsActivatedSuccess] = useState(false);

  // 1. Fetch Company Activation Status on Mount
  useEffect(() => {
    if (!token) {
      setErrorMsg('No activation token provided. Please use the official link provided by JOY Corporate Solutions.');
      setIsLoading(false);
      return;
    }

    api.getCompanyActivationDetails(token)
      .then((data) => {
        if (data) {
          setCompanyDetails(data);
          setIsExpired(data.is_expired);
          if (data.status === 'Active' || data.activation_status === 'Active') {
            setIsActivatedSuccess(true);
            setIsUnlocked(true);
          }
          if (data.cin_number) {
            setCorporateData({
              cin_number: data.cin_number || '',
              gstin_number: data.gstin_number || '',
              company_pan: data.company_pan || '',
              registered_address: data.registered_address || '',
              industry_sector: data.industry_sector || 'Information Technology & Software (IT/ITeS)',
              website: data.website || '',
              signatory_name: data.contact_person || '',
              signatory_designation: 'Director / Authorized Signatory'
            });
          } else {
            setCorporateData(prev => ({
              ...prev,
              signatory_name: data.contact_person || ''
            }));
          }
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Invalid or expired company activation link.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  // 2. Handle Password Unlock
  const handleUnlockSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!enteredPassword.trim()) {
      setUnlockError('Please enter your 4-digit security PIN or password');
      return;
    }

    setIsUnlocking(true);
    setUnlockError('');
    try {
      const res = await api.unlockCompanyActivation(token, enteredPassword.trim());
      if (res && res.success) {
        setIsUnlocked(true);
        if (showToast) showToast('🔓 Security authentication successful! Welcome to company activation.');
      } else {
        setUnlockError('Invalid password. Please check the passcode provided by Super Admin.');
      }
    } catch (err) {
      setUnlockError(err.message || 'Authentication failed. Please check your passcode.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // 3. Logo Upload Handler with Base64 Conversion
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCompanyLogoBase64(reader.result);
      setLogoPreviewUrl(reader.result);
      if (showToast) showToast('🖼️ Company logo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  // 4. Document Upload Handler
  const handleDocUpload = (docKey, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDocuments(prev => ({
        ...prev,
        [docKey]: {
          name: file.name,
          size_kb: (file.size / 1024).toFixed(1),
          base64: reader.result,
          uploaded_at: new Date().toISOString()
        }
      }));
      if (showToast) showToast(`📎 Uploaded ${file.name} successfully!`);
    };
    reader.readAsDataURL(file);
  };

  // 5. Final Submission & Activation
  const handleCompleteActivation = async (e) => {
    if (e) e.preventDefault();
    if (!termsAccepted || !dpdpConsentAccepted) {
      if (showToast) showToast('⚠️ Please accept both the Master Services Agreement and DPDP Act 2023 Consent', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        token,
        ...corporateData,
        company_logo: companyLogoBase64,
        coi: documents.coi?.base64 || null,
        pan: documents.pan?.base64 || null,
        gst: documents.gst?.base64 || null,
        signatory_proof: documents.signatory_proof?.base64 || null,
        terms_accepted: true
      };
      const res = await api.completeCompanyActivation(payload);
      if (res && res.success) {
        setIsActivatedSuccess(true);
        setActiveStep(4);
        if (showToast) showToast('🎉 Company account successfully activated in database!');
      }
    } catch (err) {
      if (showToast) showToast(`❌ Activation failed: ${err.message || 'Server error'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Navigate to Company Portal Dashboard
  const handleEnterCompanyDashboard = () => {
    if (setCurrentRole) setCurrentRole('company');
    navigate('/company');
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4 text-white">
          <RefreshCw className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
          <h2 className="text-base font-bold">Verifying Company Activation Token...</h2>
          <p className="text-xs text-slate-400">Connecting to JOY Direct Verification Gateway</p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (errorMsg || !companyDetails) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-5 shadow-2xl border border-slate-200">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Activation Link Invalid or Expired</h2>
            <p className="text-xs text-slate-500 mt-2">{errorMsg || 'This company onboarding invitation is no longer active.'}</p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-secondary text-xs py-2.5 px-6 font-bold w-full cursor-pointer"
          >
            Go to Login Portal &rarr;
          </button>
        </div>
      </div>
    );
  }

  // Expired Screen
  if (isExpired && !isActivatedSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-5 shadow-2xl border border-amber-200">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Activation Window Expired</h2>
            <p className="text-xs text-slate-500 mt-2">
              The activation window for <strong>{companyDetails.name}</strong> has expired. Please contact JOY Super Admin to re-issue an activation link.
            </p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-secondary text-xs py-2.5 px-6 font-bold w-full cursor-pointer"
          >
            Go to Login Portal &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 flex flex-col justify-between">
      
      {/* Top Header Bar */}
      <div className="max-w-4xl mx-auto w-full mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg text-white font-black text-lg">
            JOY
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white">JOY DATA VERIFICATION</h1>
              <span className="badge badge-emerald text-[9px] font-bold">DPDP ACT 2023 COMPLIANT</span>
            </div>
            <p className="text-xs text-slate-400">Enterprise Organization Self-Activation & Compliance Gate</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-800 text-indigo-400 font-mono px-3 py-1.5 rounded-xl border border-slate-700 font-bold">
            🏢 {companyDetails.name} (#{companyDetails.code})
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto w-full my-auto">
        
        {/* ========================================================================= */}
        {/* 🔐 STEP 1: SECURITY PASSWORD UNLOCK SCREEN */}
        {/* ========================================================================= */}
        {!isUnlocked && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-200 animate-fadeIn space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-indigo-50 border-2 border-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900">Protected Organization Portal</h2>
              <p className="text-xs text-slate-500 font-medium">
                Please enter the 4-digit security PIN or password provided by JOY Corporate Solutions to unlock <strong>{companyDetails.name}</strong>.
              </p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Security Unlock Passcode / PIN *</span>
                </label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    placeholder="Enter 4-digit PIN..."
                    className="w-full bg-slate-50 border-2 border-slate-300 focus:border-indigo-600 focus:bg-white text-slate-900 font-mono font-black text-base py-3 px-4 rounded-xl outline-none transition-all tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {unlockError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{unlockError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isUnlocking}
                className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 text-xs"
              >
                {isUnlocking ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>{isUnlocking ? 'Verifying Passcode...' : 'Unlock & Complete Activation 🚀'}</span>
              </button>
            </form>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
              <span>Authorized Admin: <strong>{companyDetails.email}</strong></span>
              <span>Plan: <strong>{companyDetails.plan}</strong></span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🏢 STEP 2: UNLOCKED 4-STEP ACTIVATION WIZARD */}
        {/* ========================================================================= */}
        {isUnlocked && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-200 animate-fadeIn space-y-6">
            
            {!isActivatedSuccess ? (
              <div>
                {/* Wizard Step Indicator Bar */}
                <div className="border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="badge badge-indigo text-[10px] font-bold uppercase">Enterprise Self-Activation</span>
                      <h2 className="text-base font-black text-slate-900 mt-1">Complete Corporate Onboarding: {companyDetails.name}</h2>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                      Step {activeStep} of 3
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                      { step: 1, label: '1. Corporate Profile' },
                      { step: 2, label: '2. Statutory & Docs' },
                      { step: 3, label: '3. Legal Agreement' },
                    ].map(s => (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => setActiveStep(s.step)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                          activeStep === s.step
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : activeStep > s.step
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* STEP 1: SuperAdmin Overview & Corporate Profile Form */}
                {/* ------------------------------------------------------------- */}
                {activeStep === 1 && (
                  <div className="space-y-4 text-xs">
                    {/* SuperAdmin Summary Card */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-indigo-900 tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>Super Administrator Provisioned Summary</span>
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold">Company Code</span>
                          <strong className="font-mono text-indigo-700 text-xs">{companyDetails.code}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Plan Tier</span>
                          <strong className="text-slate-800 text-xs">{companyDetails.plan}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Credits Pre-Loaded</span>
                          <strong className="font-mono text-emerald-700 text-xs">{companyDetails.max_limit || 500} Verifications</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Admin Email</span>
                          <strong className="font-mono text-slate-800 text-xs truncate block">{companyDetails.email}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Logo Upload Box */}
                    <div className="p-3.5 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                        {logoPreviewUrl ? (
                          <img src={logoPreviewUrl} alt="Company Logo" className="w-full h-full object-contain" />
                        ) : (
                          <ImageIcon className="w-7 h-7 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <label className="block font-bold text-slate-800 text-xs mb-0.5">Upload Official Corporate Logo</label>
                        <p className="text-[11px] text-slate-500">PNG, JPG, or SVG (Max 2MB). Will appear on employee BGV certificates.</p>
                      </div>
                      <label className="btn btn-secondary text-xs py-1.5 px-3 cursor-pointer shrink-0 font-bold flex items-center gap-1">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Choose Logo</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    </div>

                    {/* Registered Address & Website */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Official Corporate Website *</label>
                        <div className="relative flex items-center">
                          <Globe className="w-4 h-4 text-slate-400 absolute left-3" />
                          <input
                            type="url"
                            placeholder="https://acmetech.com"
                            value={corporateData.website}
                            onChange={(e) => setCorporateData({ ...corporateData, website: e.target.value })}
                            className="form-input text-xs pl-9 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Industry Sector & Domain *</label>
                        <select
                          value={corporateData.industry_sector}
                          onChange={(e) => setCorporateData({ ...corporateData, industry_sector: e.target.value })}
                          className="form-select text-xs font-bold"
                        >
                          <option value="Information Technology & Software (IT/ITeS)">Information Technology & Software (IT/ITeS)</option>
                          <option value="Banking, Financial Services & Insurance (BFSI)">Banking, Financial Services & Insurance (BFSI)</option>
                          <option value="Automobile & Advanced Manufacturing">Automobile & Advanced Manufacturing</option>
                          <option value="Logistics, Supply Chain & Fleet Drivers">Logistics, Supply Chain & Fleet Drivers</option>
                          <option value="Healthcare, Pharmaceuticals & Hospitals">Healthcare, Pharmaceuticals & Hospitals</option>
                          <option value="Retail, FMCG & E-Commerce Operations">Retail, FMCG & E-Commerce Operations</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Registered Corporate Office Address *</label>
                      <div className="relative">
                        <textarea
                          rows={2}
                          required
                          placeholder="Complete building, street, city, state, and pincode..."
                          value={corporateData.registered_address}
                          onChange={(e) => setCorporateData({ ...corporateData, registered_address: e.target.value })}
                          className="form-input text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="btn btn-indigo text-xs py-2.5 px-5 font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>Next: Statutory Identifiers & Documents &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 2: Statutory Corporate Identifiers & Proof Documents */}
                {/* ------------------------------------------------------------- */}
                {activeStep === 2 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-2xl flex items-center gap-2 text-indigo-950 font-medium">
                      <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Enter official government identifiers for institutional BGV invoicing and compliance audits.</span>
                    </div>

                    {/* CIN, GSTIN, Company PAN */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">CIN Number *</label>
                        <input
                          type="text"
                          required
                          maxLength={21}
                          placeholder="e.g. U72200KA2026PTC189201"
                          value={corporateData.cin_number}
                          onChange={(e) => setCorporateData({ ...corporateData, cin_number: e.target.value.toUpperCase() })}
                          className="form-input text-xs font-mono font-bold"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">21-digit MCA CIN</span>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">GSTIN Number *</label>
                        <input
                          type="text"
                          required
                          maxLength={15}
                          placeholder="e.g. 29ABCDE1234F1Z5"
                          value={corporateData.gstin_number}
                          onChange={(e) => setCorporateData({ ...corporateData, gstin_number: e.target.value.toUpperCase() })}
                          className="form-input text-xs font-mono font-bold"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">15-digit GST Number</span>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Company PAN *</label>
                        <input
                          type="text"
                          required
                          maxLength={10}
                          placeholder="e.g. ABCDE1234F"
                          value={corporateData.company_pan}
                          onChange={(e) => setCorporateData({ ...corporateData, company_pan: e.target.value.toUpperCase() })}
                          className="form-input text-xs font-mono font-bold"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">10-digit Entity PAN</span>
                      </div>
                    </div>

                    {/* Document Uploads Grid */}
                    <span className="font-extrabold text-slate-800 text-xs block pt-2">
                      Upload Statutory Verification Attachments (PDF / Images)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'coi', label: 'Certificate of Incorporation (COI)', desc: 'MCA incorporation certificate' },
                        { key: 'pan', label: 'Company PAN Card Scan', desc: 'Copy of official PAN card' },
                        { key: 'gst', label: 'GST Registration Certificate', desc: 'Form GST REG-06' },
                        { key: 'signatory_proof', label: 'Board Resolution / Signatory Letter', desc: 'Signatory authorization proof' },
                      ].map((doc) => (
                        <div key={doc.key} className="p-3 border border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{doc.label}</span>
                            <span className="text-[10px] text-slate-500">
                              {documents[doc.key] ? `✓ ${documents[doc.key].name} (${documents[doc.key].size_kb} KB)` : doc.desc}
                            </span>
                          </div>
                          <label className={`py-1.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            documents[doc.key]
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-white text-slate-700 border border-slate-300 hover:bg-indigo-50'
                          }`}>
                            <span>{documents[doc.key] ? 'Replace' : 'Upload'}</span>
                            <input type="file" accept=".pdf,image/*" onChange={(e) => handleDocUpload(doc.key, e)} className="hidden" />
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="btn btn-secondary text-xs py-2 px-4 cursor-pointer"
                      >
                        &larr; Back to Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        className="btn btn-indigo text-xs py-2.5 px-5 font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>Next: Master Services Agreement &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 3: Master Services Agreement & DPDP Act 2023 Consent */}
                {/* ------------------------------------------------------------- */}
                {activeStep === 3 && (
                  <form onSubmit={handleCompleteActivation} className="space-y-4 text-xs">
                    
                    {/* Legal Notice Banner */}
                    <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-1.5 text-amber-950">
                      <div className="flex items-center gap-2 font-black text-xs">
                        <Scale className="w-4 h-4 text-amber-700" />
                        <span>IMPORTANT LEGAL NOTICE & MANDATORY DPDP ACT 2023 COMPLIANCE</span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        Please review all clauses of the <strong>Master Services Agreement (MSA)</strong>, <strong>Data Processing Addendum (DPA)</strong>, and <strong>DPDP Act 2023 Statutory Undertaking</strong> thoroughly before digital execution.
                      </p>
                    </div>

                    {/* Scrollable Legal Terms Box */}
                    <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl max-h-52 overflow-y-auto space-y-3 text-[11px] text-slate-700 font-serif leading-relaxed">
                      <h4 className="font-bold text-slate-900 font-sans text-xs">MASTER SERVICES & DATA PROCESSING AGREEMENT</h4>
                      <p>
                        This Master Services Agreement ("Agreement") is executed by and between <strong>JOY CORPORATE SOLUTIONS PRIVATE LIMITED</strong> ("Verification Service Provider") and <strong>{companyDetails.name}</strong> ("Enterprise Client Organization").
                      </p>
                      <p><strong>1. PURPOSE & SCOPE:</strong> The Client is granted enterprise access to execute digital background verification (BGV) checks across authorized Government Registries (UIDAI, NSDL, NPCI, MoRTH, EPFO, MEA, eCourts) exclusively for statutory employment screening.</p>
                      <p><strong>2. DIGITAL PERSONAL DATA PROTECTION (DPDP) ACT 2023:</strong> The Client warrants that explicit, verifiable consent will be obtained from every candidate prior to initiating identity, financial, judicial, or past employment checks.</p>
                      <p><strong>3. DATA RETENTION & POINT-IN-TIME VERIFICATION:</strong> In accordance with statutory guidelines, verification certificates and cryptographic tamper-evident hashes shall be retained for 7 years under Point-in-Time Data Verification protocols.</p>
                      <p><strong>4. CONFIDENTIALITY & NON-DISCLOSURE:</strong> All raw payloads, biometric embeddings, and candidate documents are encrypted using AES-256 and TLS 1.3 standards.</p>
                    </div>

                    {/* Authorized Signatory Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Authorized Signatory Full Name *</label>
                        <input
                          type="text"
                          required
                          value={corporateData.signatory_name}
                          onChange={(e) => setCorporateData({ ...corporateData, signatory_name: e.target.value })}
                          className="form-input text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Signatory Official Designation *</label>
                        <input
                          type="text"
                          required
                          value={corporateData.signatory_designation}
                          onChange={(e) => setCorporateData({ ...corporateData, signatory_designation: e.target.value })}
                          className="form-input text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 pt-1">
                      <label className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-start gap-2.5 cursor-pointer hover:bg-indigo-50 transition-all">
                        <input
                          type="checkbox"
                          required
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                        <div className="text-[11px] text-slate-800 font-medium leading-relaxed">
                          <strong>I accept the Enterprise Master Services Agreement (MSA)</strong> on behalf of <strong>{companyDetails.name}</strong> and confirm that I am legally authorized to execute this agreement.
                        </div>
                      </label>

                      <label className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-2.5 cursor-pointer hover:bg-emerald-50 transition-all">
                        <input
                          type="checkbox"
                          required
                          checked={dpdpConsentAccepted}
                          onChange={(e) => setDpdpConsentAccepted(e.target.checked)}
                          className="mt-1 w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                        <div className="text-[11px] text-slate-800 font-medium leading-relaxed">
                          <strong>I confirm adherence to the DPDP Act 2023</strong> and declare that candidate consent will be recorded prior to every verification check.
                        </div>
                      </label>
                    </div>

                    <div className="flex justify-between pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="btn btn-secondary text-xs py-2 px-4 cursor-pointer"
                      >
                        &larr; Back to Documents
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !termsAccepted || !dpdpConsentAccepted}
                        className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-3 px-6 flex items-center justify-center gap-2 font-black shadow-lg cursor-pointer transition-all active:scale-98 rounded-2xl"
                      >
                        {isSubmitting ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>{isSubmitting ? 'Saving to Database & Activating...' : 'Execute Agreement & Activate Account 🚀'}</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            ) : (
              /* ------------------------------------------------------------- */
              /* SUCCESS STATE: CELEBRATION & DIRECT LOGIN BUTTON */
              /* ------------------------------------------------------------- */
              <div className="text-center py-6 space-y-5 animate-fadeIn">
                <div className="w-16 h-16 bg-purple-50 border-2 border-purple-300 text-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <span className="badge badge-purple text-xs font-black uppercase tracking-wider">
                    STATUTORY PROFILE & AGREEMENT SUBMITTED 🟡
                  </span>
                  <h2 className="text-xl font-black text-slate-900">{companyDetails.name}</h2>
                  <p className="text-xs text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{corporateData.signatory_name || companyDetails.contact_person}</strong>! Your statutory documents, entity identifiers, and signed Master Services Agreement have been submitted to JOY Super Administration.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between text-slate-600">
                    <span>Account Status:</span>
                    <strong className="badge badge-amber text-[10px]">Pending Super Admin Approval</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Company Code:</span>
                    <strong className="font-mono text-slate-900">#{companyDetails.code}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Admin Username:</span>
                    <strong className="font-mono text-slate-900">{companyDetails.email}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Signatory Officer:</span>
                    <strong className="text-indigo-900 font-bold">{corporateData.signatory_name} ({corporateData.signatory_designation})</strong>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 font-medium max-w-md mx-auto">
                  📬 An automated confirmation email will be sent to <strong>{companyDetails.email}</strong> as soon as the Super Administrator reviews and authorizes your live portal access.
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-secondary text-xs py-2.5 px-6 font-bold cursor-pointer"
                >
                  Return to Homepage &rarr;
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Bottom Footer */}
      <div className="max-w-4xl mx-auto w-full mt-6 text-center text-slate-500 text-[11px] border-t border-slate-800 pt-4">
        JOY CORPORATE SOLUTIONS PRIVATE LIMITED &bull; ISO 27001 Certified &bull; Direct Government Gateway Authorized Partner
      </div>

    </div>
  );
};
