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
  EyeOff
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

  // Form Step Tracking
  const [currentStep, setCurrentStep] = useState(1); // 1: Corporate Details, 2: Documents, 3: SLA Acceptance, 4: Complete

  // Corporate Profile Fields
  const [corporateData, setCorporateData] = useState({
    cin_number: '',
    gstin_number: '',
    company_pan: '',
    registered_address: '',
    industry_sector: 'Information Technology (IT/ITeS)',
    website: ''
  });

  // Uploaded Documents State
  const [documents, setDocuments] = useState({
    coi: null, // Certificate of Incorporation
    pan: null, // Company PAN Card
    gst: null, // GST Certificate
    signatory_proof: null // Board Resolution / Signatory ID
  });

  // Terms Acceptance Checkbox
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActivatedSuccess, setIsActivatedSuccess] = useState(false);

  // 1. Fetch Company Activation Status on Mount
  useEffect(() => {
    if (!token) {
      setErrorMsg('No activation token provided. Please use the link sent by JOY Corporate Solutions.');
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
              industry_sector: data.industry_sector || 'Information Technology (IT/ITeS)',
              website: data.website || ''
            });
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
        setUnlockError('Invalid password. Please check the passcode sent by Super Admin.');
      }
    } catch (err) {
      setUnlockError(err.message || 'Authentication failed. Please check your passcode.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // 3. Mock File Upload Handler
  const handleFileUpload = (docKey, file) => {
    if (!file) return;
    setDocuments(prev => ({
      ...prev,
      [docKey]: {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploaded_at: new Date().toISOString()
      }
    }));
    if (showToast) showToast(`📎 Uploaded ${file.name} successfully!`);
  };

  // 4. Final Submission & Activation
  const handleCompleteActivation = async (e) => {
    if (e) e.preventDefault();
    if (!termsAccepted) {
      if (showToast) showToast('⚠️ Please accept the Legal Terms of Service & DPDP Act Compliance Agreement');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        token,
        ...corporateData,
        documents,
        terms_accepted: true
      };
      const res = await api.completeCompanyActivation(payload);
      if (res && res.success) {
        setIsActivatedSuccess(true);
        setCurrentStep(4);
        if (showToast) showToast('🎉 Company portal activated successfully!');
      }
    } catch (err) {
      if (showToast) showToast(`❌ Activation failed: ${err.message || 'Server error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Navigate to Company Portal Dashboard
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
            className="btn btn-secondary text-xs py-2.5 px-6 font-bold w-full"
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
              The 15-day activation window for <strong>{companyDetails.name}</strong> has expired. Please contact JOY Super Admin to re-issue an activation link.
            </p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="btn btn-secondary text-xs py-2.5 px-6 font-bold w-full"
          >
            Go to Login Portal &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 flex flex-col justify-between">
      
      {/* Top Header */}
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
            🏢 {companyDetails.name} ({companyDetails.code})
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
                Please enter the 4-digit security PIN or password provided by JOY Corporate Solutions to activate <strong>{companyDetails.name}</strong>.
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
                    placeholder="Enter security password..."
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
        {/* 🏢 STEP 2: UNLOCKED TERMS & ACCOUNT ACTIVATION SCREEN */}
        {/* ========================================================================= */}
        {isUnlocked && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-200 animate-fadeIn space-y-6 max-w-xl mx-auto">
            
            {!isActivatedSuccess ? (
              <form onSubmit={handleCompleteActivation} className="space-y-5">
                
                {/* Header Strip */}
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">Activate Your Organization Account</h2>
                      <p className="text-xs text-slate-500 font-medium">Accept terms to complete account provisioning</p>
                    </div>
                  </div>
                  <span className="badge badge-purple text-[10px] font-bold">DPDP ACT 2023</span>
                </div>

                {/* Organization Details Summary Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Company Name</span>
                    <strong className="text-slate-900 font-black text-sm">{companyDetails.name}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Company Code</span>
                    <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      #{companyDetails.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Admin Username</span>
                    <span className="font-mono text-slate-900 font-bold">{companyDetails.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Provisioned Plan</span>
                    <span className="text-indigo-700 font-black">{companyDetails.plan}</span>
                  </div>
                </div>

                {/* Terms of Service & DPDP Act Summary */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                  <strong className="text-indigo-950 font-bold block flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-indigo-700" />
                    <span>Master Service Agreement & Statutory Declarations</span>
                  </strong>
                  <p className="text-[11px] text-slate-600">
                    By activating your account for <strong>{companyDetails.name}</strong>, you agree to comply with the <strong>DPDP Act 2023</strong> and the <strong>Information Technology Act 2000</strong>.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
                    <li>Mandatory candidate consent before requesting Aadhaar, EPFO, or judicial records.</li>
                    <li>7-Year immutable audit retention under Point-in-Time Data Verification protocol.</li>
                    <li>Authorized use strictly for employment background checks and statutory onboarding.</li>
                  </ul>
                </div>

                {/* Interactive Acceptance Checkbox */}
                <label className="p-3.5 rounded-2xl bg-slate-50 border-2 border-indigo-200 flex items-start gap-3 cursor-pointer hover:bg-indigo-50/30 transition-all">
                  <input 
                    type="checkbox" 
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-bold">
                      I accept the Enterprise Master Service Agreement & DPDP Compliance Protocol *
                    </strong>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Accepted by {companyDetails.contact_person || 'Authorized Representative'} ({companyDetails.email}) on behalf of {companyDetails.name}
                    </span>
                  </div>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !termsAccepted}
                  className="w-full btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-3 px-6 flex items-center justify-center gap-2 font-black shadow-lg cursor-pointer transition-all active:scale-98 rounded-2xl"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Creating Account & Activating...' : 'Create Account & Activate Portal 🚀'}</span>
                </button>

                <p className="text-center text-[10px] text-slate-400">
                  After activation, you can update your full company details (CIN, GSTIN, PAN, Address, Documents) and create HR recruiter accounts inside your Company Portal.
                </p>
              </form>
            ) : (
              /* Success State */
              <div className="text-center py-6 space-y-5 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-300 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <span className="badge badge-emerald text-xs font-black uppercase tracking-wider">
                    ACCOUNT CREATED & ACTIVATED 🟢
                  </span>
                  <h2 className="text-xl font-black text-slate-900">{companyDetails.name}</h2>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                    Your company account has been created. Log in to update your corporate profile details, create HR recruiters, and start onboarding candidates.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between text-slate-600">
                    <span>Company ID / Code:</span>
                    <strong className="font-mono text-slate-900">{companyDetails.code}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Admin Username:</span>
                    <strong className="font-mono text-slate-900">{companyDetails.email}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Plan:</span>
                    <strong className="text-indigo-700 font-bold">{companyDetails.plan}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEnterCompanyDashboard}
                  className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 text-xs"
                >
                  <span>Enter Company Admin Portal 🚀</span>
                  <ArrowRight className="w-4 h-4" />
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
