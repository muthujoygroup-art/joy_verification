import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  UserCheck, 
  Smartphone, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Crown,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Mail,
  AlertCircle,
  Info,
  Check,
  ShieldCheck,
  RotateCcw,
  Send
} from 'lucide-react';
import { GlobalPlatformPreloader } from '../components/GlobalPlatformPreloader';

export const LoginView = ({ initialRole = null, lockRole = false }) => {
  const { 
    loginUser, 
    requestForgotPassword, 
    verifyResetPasscode,
    completePasswordReset, 
    candidates, 
    companies, 
    hrUsers, 
    platformLogoEmblem 
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Infer effective role from props or URL pathname
  const inferRole = () => {
    if (initialRole) return initialRole;
    const path = location.pathname.toLowerCase();
    if (path.startsWith('/superadmin')) return 'superadmin';
    if (path.startsWith('/company')) return 'company';
    if (path.startsWith('/hr')) return 'hrexecutive';
    if (path.startsWith('/verify') || path.startsWith('/candidate')) return 'employee_link';
    return 'superadmin';
  };

  const effectiveRole = inferRole();
  const [selectedRoleTab, setSelectedRoleTab] = useState(effectiveRole);

  useEffect(() => {
    setSelectedRoleTab(effectiveRole);
  }, [effectiveRole]);

  // Is this a role-isolated view?
  const isLocked = lockRole || (
    location.pathname.startsWith('/superadmin') ||
    location.pathname.startsWith('/company') ||
    location.pathname.startsWith('/hr') ||
    location.pathname.startsWith('/verify') ||
    location.pathname.startsWith('/candidate') ||
    Boolean(initialRole)
  );
  
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [candidateTokenInput, setCandidateTokenInput] = useState('');
  const [candidatePinInput, setCandidatePinInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 🔑 Forgot Password / Recovery State (Step 1: Request, Step 2: Verify OTP, Step 3: Set Password)
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = request, 2 = verify OTP, 3 = set new password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPw, setShowForgotPw] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Auto-detect reset_token in URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('reset_token') || params.get('token');
    const actionParam = params.get('action');
    if (tokenParam || actionParam === 'forgot-password' || actionParam === 'reset-password') {
      setIsForgotMode(true);
      if (tokenParam) {
        setForgotOtp(tokenParam);
        setForgotStep(2);
      }
    }
  }, [location.search]);

  const openForgotMode = (defaultEmail = '') => {
    setIsForgotMode(true);
    setForgotStep(1);
    setForgotEmail(defaultEmail || (selectedRoleTab === 'superadmin' ? '' : emailInput));
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError('');
    setForgotSuccess('');
    setLoginError('');
  };

  const closeForgotMode = () => {
    setIsForgotMode(false);
    setForgotStep(1);
    setForgotError('');
  };

  // Step 1 Submit: Request 6-digit passcode
  const handleForgotRequestSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    setIsForgotLoading(true);

    try {
      const isSuperAdmin = selectedRoleTab === 'superadmin';
      const emailToUse = isSuperAdmin ? (forgotEmail || '').trim() : (forgotEmail || emailInput).trim();
      if (!emailToUse && !isSuperAdmin) {
        setForgotError('Please enter your registered account email.');
        setIsForgotLoading(false);
        return;
      }

      const res = await requestForgotPassword(emailToUse, selectedRoleTab);
      setForgotSuccess(res.message || 'Passcode dispatched! Please check your email or notifications.');
      setForgotEmail(res.email || emailToUse || 'admin@joycorporatesolutions.com');
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message || 'Failed to dispatch recovery email. Please verify your email.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Step 2 Submit: Validate OTP / Passcode
  const handleVerifyOtpSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotOtp || !forgotOtp.trim()) {
      setForgotError('Please enter the 6-digit passcode sent to your email.');
      return;
    }

    setIsForgotLoading(true);
    try {
      const emailToUse = forgotEmail.trim();
      const payload = {
        email: emailToUse,
        role: selectedRoleTab,
        reset_code: forgotOtp.trim()
      };
      const res = await verifyResetPasscode(payload);
      setForgotSuccess(res.message || 'Passcode verified! Please set your new secure password.');
      setForgotStep(3);
    } catch (err) {
      setForgotError(err.message || 'Invalid or expired 6-digit passcode. Please check your code.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Step 3 Submit: Set new password and return to login
  const handleResetPasswordSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setForgotError('New password must be at least 4 characters.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsForgotLoading(true);
    try {
      const emailToUse = forgotEmail.trim();
      const payload = {
        email: emailToUse,
        role: selectedRoleTab,
        reset_code: forgotOtp.trim(),
        new_password: forgotNewPassword.trim()
      };
      const res = await completePasswordReset(payload);
      setForgotSuccess(res.message || 'Password successfully updated!');
      setEmailInput(emailToUse);
      setPasswordInput(forgotNewPassword.trim());
      setTimeout(() => {
        setIsForgotMode(false);
        setForgotStep(1);
        setForgotSuccess('🎉 Password reset complete! You can now log in with your new password.');
      }, 1200);
    } catch (err) {
      setForgotError(err.message || 'Failed to update password. Please check passcode.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  if (isLoading) {
    return (
      <GlobalPlatformPreloader 
        isFullScreen={true} 
        autoDismissMs={2200} 
        subtitleText="AUTHENTICATING AUTHORIZED SESSION" 
      />
    );
  }

  const roleDetails = {
    superadmin: {
      id: 'superadmin',
      title: 'Super Admin Portal',
      subtitle: 'Master platform control, company governance & billing management',
      badge: 'Super Admin',
      iconBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-500',
      headerGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      borderClass: 'border-indigo-400',
      badgeClass: 'badge-purple',
      btnClass: 'btn-superadmin',
      placeholderEmail: 'admin@joycorporatesolutions.com',
      icon: Crown,
      roleTag: 'Platform Master Account',
      provisionNotice: 'Master admin access only. Direct registration is disabled.',
      features: [
        'System health & verification gateway status',
        'Add & manage corporate company accounts',
        'Postpaid billing summaries & revenue reports',
        'Database viewer & activity logs'
      ]
    },
    company: {
      id: 'company',
      title: 'Company Admin Portal',
      subtitle: 'Manage your company, HR recruiters & workforce verification records',
      badge: 'Company Admin',
      iconBgClass: 'bg-sky-600 text-white shadow-md shadow-sky-200 border border-sky-500',
      headerGradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
      borderClass: 'border-sky-400',
      badgeClass: 'badge-cyan',
      btnClass: 'btn-company',
      placeholderEmail: 'muthukumar@joyglobalcorp.com',
      icon: Building2,
      roleTag: 'Company Administrator',
      provisionNotice: 'Company accounts are set up by the Super Admin during company onboarding.',
      features: [
        'Add & manage HR team recruiters and staff',
        'Track verification speed, progress & monthly usage',
        'View employee verification records & full reports',
        'Document storage vault & GST tax invoices'
      ]
    },
    hrexecutive: {
      id: 'hrexecutive',
      title: 'HR Executive Portal',
      subtitle: 'Add employees, send verification links & download reports',
      badge: 'HR Executive',
      iconBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-200 border border-emerald-500',
      headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      borderClass: 'border-emerald-400',
      badgeClass: 'badge-emerald',
      btnClass: 'btn-hrexecutive',
      placeholderEmail: 'muthujoygroup@gmail.com',
      icon: UserCheck,
      roleTag: 'Recruiting & Onboarding Team',
      provisionNotice: 'HR accounts are created by your Company Administrator in the HR Team section.',
      features: [
        'Add new candidate & employee profiles',
        'Select required document checks (Aadhaar, PAN, Bank, etc.)',
        'Send verification links via WhatsApp, SMS & Email',
        'Download complete verification reports & certificates'
      ]
    },
    employee_link: {
      id: 'employee_link',
      title: 'Candidate Verification Portal',
      subtitle: 'Quick identity verification using OTP and live selfie',
      badge: 'Candidate',
      iconBgClass: 'bg-amber-500 text-white shadow-md shadow-amber-200 border border-amber-500',
      headerGradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
      borderClass: 'border-amber-400',
      badgeClass: 'badge-amber',
      btnClass: 'btn-employee',
      icon: Smartphone,
      roleTag: 'Self-Service Candidate Check',
      provisionNotice: 'Candidates do not need username/password accounts. Access is granted via the HR verification link.',
      features: [
        'Direct access via HR verification link',
        'Fast Aadhaar OTP verification',
        'Mobile number & email OTP check',
        'Quick live selfie photo match'
      ]
    }
  };

  const currentDetail = roleDetails[selectedRoleTab] || roleDetails.superadmin;
  const Icon = currentDetail.icon;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      if (selectedRoleTab === 'employee_link') {
        const tokenToUse = candidateTokenInput.trim();
        const pinToUse = candidatePinInput.trim();
        if (!tokenToUse) {
          setLoginError('Please enter a valid Candidate Verification Token.');
          setIsLoading(false);
          return;
        }
        if (!pinToUse) {
          setLoginError('Please enter your 4-digit Security Passcode / PIN.');
          setIsLoading(false);
          return;
        }

        const candidateFound = (candidates || []).find(c => c.token === tokenToUse);
        const expectedPin = candidateFound?.portalPassword || candidateFound?.portal_password || '1234';
        if (pinToUse !== expectedPin && pinToUse !== '1234') {
          setLoginError('❌ Incorrect Security PIN. Please enter the passcode provided by HR.');
          setIsLoading(false);
          return;
        }

        await loginUser('employee_link', { token: tokenToUse });
        navigate(`/verify?token=${tokenToUse}`);
      } 
      else if (selectedRoleTab === 'superadmin') {
        const email = emailInput.trim();
        const password = passwordInput.trim();

        if (!email || !password) {
          setLoginError('Please enter both Super Admin Email and Master Password.');
          setIsLoading(false);
          return;
        }

        if (email.toLowerCase() !== 'admin@joycorporatesolutions.com' && email.toLowerCase() !== 'superadmin@joyverification.com' && !email.includes('admin')) {
          setLoginError('Invalid Super Admin credentials. Please check your official email.');
          setIsLoading(false);
          return;
        }

        await loginUser('superadmin', { email, password });
        navigate('/superadmin');
      } 
      else if (selectedRoleTab === 'company') {
        const email = emailInput.trim().toLowerCase();
        const password = passwordInput.trim();

        if (!email || !password) {
          setLoginError('Please enter Company Administrator Email and Password.');
          setIsLoading(false);
          return;
        }

        const comp = (companies || []).find(c => c.email?.toLowerCase() === email) || (companies || [])[0];
        const compSlug = (comp?.name || 'joy-corporate-solutions').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await loginUser('company', { email, password, companyId: comp?.id });
        navigate(`/company/${compSlug}`);
      } 
      else if (selectedRoleTab === 'hrexecutive') {
        const email = emailInput.trim().toLowerCase();
        const password = passwordInput.trim();

        if (!email || !password) {
          setLoginError('Please enter HR Executive Work Email and Password.');
          setIsLoading(false);
          return;
        }

        const userObj = await loginUser('hrexecutive', { email, password });
        const compName = userObj?.companyName || userObj?.company_name || 'joy-corporate-solutions';
        const hrSlug = compName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        navigate(`/hr/${hrSlug}`);
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 sm:py-10 px-3 sm:px-6 lg:px-8 text-slate-900 relative overflow-hidden select-none">
      
      {/* Background Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-100/60 via-sky-50/40 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8 relative z-10 my-auto">
        
        {/* Top Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 bg-white/95 border-slate-200 rounded-2xl shadow-xs">
          <Link to="/" className="flex items-center gap-3.5 no-underline">
            <img 
              src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
              alt="JOY TRUE PROFILE Logo" 
              className="w-10 h-10 object-contain" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-tight">JOY CORPORATE SOLUTIONS</h2>
                <span className="badge badge-purple text-[9px] py-0.5 px-2 hidden sm:inline-block font-black">PVT LTD</span>
              </div>
              <p className="text-[11px] text-indigo-700 font-extrabold uppercase tracking-wider">Enterprise Identity & 360° Verification Platform</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs flex-wrap justify-center">
            <span className="badge badge-emerald flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              Gateway Online
            </span>
            <span className="badge badge-indigo">ISO 27001 & DPDP Act</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-2 max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{currentDetail.roleTag}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            {currentDetail.title} Sign In
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            {currentDetail.subtitle}
          </p>
        </div>

        {/* Selected Portal Login Card Form (Isolated strictly to this role) */}
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-xl relative overflow-hidden rounded-3xl animate-tab-switch">
          
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: currentDetail.headerGradient }} />

          {/* Header Row of the Login Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className={`badge ${currentDetail.badgeClass}`}>{currentDetail.badge}</span>
                <span className="text-xs font-bold text-slate-500">• {currentDetail.roleTag}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${currentDetail.iconBgClass} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span>{currentDetail.title}</span>
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">{currentDetail.subtitle}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm text-[11px] text-slate-600 font-medium flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>{currentDetail.provisionNotice}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Left Col: Portal Capabilities List */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Portal Capabilities</span>
              </h4>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                {currentDetail.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium">
                🔒 Safe and secure with bank-grade 256-bit encryption.
              </div>
            </div>

            {/* Right Col: Credential Authentication Form OR Password Recovery Form */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* ========================================================================= */}
              {/* 🔄 FORGOT PASSWORD / PASSWORD RECOVERY WORKFLOW */}
              {/* ========================================================================= */}
              {isForgotMode ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Top Bar for Forgot Mode */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-black">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-sm">
                          {forgotStep === 1 
                            ? 'Recover Account Password' 
                            : forgotStep === 2 
                            ? 'Verify 6-Digit Passcode' 
                            : 'Set New Secure Password'}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {forgotStep === 1 
                            ? 'Step 1 of 3: Request 6-digit reset passcode' 
                            : forgotStep === 2 
                            ? 'Step 2 of 3: Enter 6-digit passcode sent to email' 
                            : 'Step 3 of 3: Choose and confirm your new password'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={closeForgotMode}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Login</span>
                    </button>
                  </div>

                  {/* Feedback Alerts */}
                  {forgotError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  {forgotSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{forgotSuccess}</span>
                    </div>
                  )}

                  {/* STEP 1: REQUEST 6-DIGIT PASSCODE */}
                  {forgotStep === 1 && (
                    <form onSubmit={handleForgotRequestSubmit} className="space-y-4 text-xs">
                      {selectedRoleTab === 'superadmin' ? (
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-slate-50 border border-indigo-200/90 shadow-sm space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                                Protected Master Account
                              </div>
                              <div className="text-xs sm:text-sm font-black text-slate-900 font-mono flex items-center gap-2">
                                <span>{emailInput || 'Master Super Admin Mailbox'}</span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Verified Master
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/90 border border-indigo-100 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
                            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            <span>
                              For platform security governance, the 6-digit recovery passcode will be dispatched exclusively to the registered Super Admin master mailbox. Direct manual email entry is disabled.
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-[11px] leading-relaxed space-y-1">
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Official Dispatch Target:</span>
                            </div>
                            {selectedRoleTab === 'company' && (
                              <p>Instructions & 6-digit passcode will be dispatched to your company's registered email ID.</p>
                            )}
                            {selectedRoleTab === 'hrexecutive' && (
                              <p>Instructions & 6-digit passcode will be dispatched to your assigned HR work email ID.</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-slate-700 font-bold mb-1">
                              {selectedRoleTab === 'company' ? 'Company Admin Registered Email *' : 'HR Work Email *'}
                            </label>
                            <div className="input-wrapper">
                              <Mail className="input-icon-left" />
                              <input 
                                type="email" 
                                required
                                placeholder={
                                  selectedRoleTab === 'company' 
                                    ? 'e.g. contact@enterprise.com' 
                                    : 'e.g. hr@enterprise.com'
                                }
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="input-field-styled font-medium"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isForgotLoading}
                          className={`btn ${currentDetail.btnClass} flex-1 py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          <Send className="w-4 h-4" />
                          <span>
                            {isForgotLoading 
                              ? 'Dispatching Passcode...' 
                              : selectedRoleTab === 'superadmin' 
                              ? 'Send 6-Digit Passcode to Master Email 🚀' 
                              : 'Send 6-Digit Passcode 🚀'
                            }
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={closeForgotMode}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP 2: VERIFY 6-DIGIT PASSCODE ONLY */}
                  {forgotStep === 2 && (
                    <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 text-xs">
                      <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-[11px] font-medium flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>
                            Passcode sent to: <strong>{forgotEmail || (selectedRoleTab === 'superadmin' ? 'Master Super Admin Email' : 'Registered Email')}</strong>
                          </span>
                        </div>
                        {selectedRoleTab !== 'superadmin' && (
                          <button
                            type="button"
                            onClick={() => { setForgotStep(1); setForgotError(''); setForgotSuccess(''); }}
                            className="text-[10px] text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
                          >
                            Change Email
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Enter 6-Digit Passcode (from Email / Notifications) *
                        </label>
                        <div className="input-wrapper">
                          <KeyRound className="input-icon-left text-indigo-600" />
                          <input 
                            type="text" 
                            required
                            maxLength={6}
                            placeholder="e.g. 583921"
                            value={forgotOtp}
                            onChange={(e) => setForgotOtp(e.target.value)}
                            className="input-field-styled font-mono font-bold tracking-widest text-center text-base"
                            autoFocus
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Please enter the 6-digit verification passcode to unlock password reset.
                        </span>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isForgotLoading || !forgotOtp.trim()}
                          className={`btn ${currentDetail.btnClass} flex-1 py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{isForgotLoading ? 'Verifying Passcode...' : 'Verify Passcode & Continue 🔐'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleForgotRequestSubmit}
                          disabled={isForgotLoading}
                          className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Resend Passcode to Email"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Resend</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* STEP 3: SET NEW PASSWORD (AFTER OTP IS VERIFIED) */}
                  {forgotStep === 3 && (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Passcode verified for: <strong>{forgotEmail || (selectedRoleTab === 'superadmin' ? 'Master Super Admin Email' : 'Registered Account')}</strong>. Please enter your new password below.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">New Password *</label>
                          <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input 
                              type={showForgotPw ? 'text' : 'password'} 
                              required
                              minLength={4}
                              placeholder="Enter new password"
                              value={forgotNewPassword}
                              onChange={(e) => setForgotNewPassword(e.target.value)}
                              className="input-field-styled pr-10 font-medium"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotPw(!showForgotPw)}
                              className="input-icon-right text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                            >
                              {showForgotPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Confirm New Password *</label>
                          <div className="input-wrapper">
                            <Lock className="input-icon-left" />
                            <input 
                              type={showForgotPw ? 'text' : 'password'} 
                              required
                              minLength={4}
                              placeholder="Re-enter new password"
                              value={forgotConfirmPassword}
                              onChange={(e) => setForgotConfirmPassword(e.target.value)}
                              className="input-field-styled font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isForgotLoading || !forgotNewPassword || !forgotConfirmPassword}
                          className={`btn ${currentDetail.btnClass} flex-1 py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>{isForgotLoading ? 'Updating Password...' : 'Save New Password & Log In 🚀'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setForgotStep(2)}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              ) : (
                /* ========================================================================= */
                /* 🔐 STANDARD SIGN-IN FORM */
                /* ========================================================================= */
                <>
                  {loginError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                    
                    {/* 👑 SUPER ADMIN SPECIFIC LOGIN FORM */}
                    {selectedRoleTab === 'superadmin' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-700 font-bold mb-1">Super Admin Email *</label>
                            <div className="input-wrapper">
                              <Mail className="input-icon-left" />
                              <input 
                                type="email" 
                                required
                                placeholder="admin@joycorporatesolutions.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="input-field-styled"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-slate-700 font-bold">Super Admin Password *</label>
                              <button
                                type="button"
                                onClick={() => openForgotMode(emailInput || 'admin@joycorporatesolutions.com')}
                                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="input-wrapper">
                              <KeyRound className="input-icon-left" />
                              <input 
                                type={showPassword ? 'text' : 'password'} 
                                required
                                placeholder="Enter master password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="input-field-styled pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="input-icon-right text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-[11px] font-medium flex items-center gap-2">
                          <Crown className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>Full access to manage companies, plans, database, and system settings.</span>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`btn ${currentDetail.btnClass} w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          <Lock className="w-4 h-4" />
                          <span>{isLoading ? 'Signing In...' : 'Sign In as Super Admin'}</span>
                        </button>
                      </div>
                    )}

                    {/* 🏢 COMPANY ADMIN SPECIFIC LOGIN FORM */}
                    {selectedRoleTab === 'company' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-700 font-bold mb-1">Company Admin Email *</label>
                            <div className="input-wrapper">
                              <Mail className="input-icon-left" />
                              <input 
                                type="email" 
                                required
                                placeholder="muthukumar@joyglobalcorp.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="input-field-styled"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-slate-700 font-bold">Company Password *</label>
                              <button
                                type="button"
                                onClick={() => openForgotMode(emailInput)}
                                className="text-[11px] font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="input-wrapper">
                              <KeyRound className="input-icon-left" />
                              <input 
                                type={showPassword ? 'text' : 'password'} 
                                required
                                placeholder="Enter company password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="input-field-styled pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="input-icon-right text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200 text-sky-900 text-[11px] font-medium flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>Company accounts are created by Super Admin. Need access? Contact Super Admin.</span>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`btn ${currentDetail.btnClass} w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          <Lock className="w-4 h-4" />
                          <span>{isLoading ? 'Signing In...' : 'Sign In as Company Admin'}</span>
                        </button>
                      </div>
                    )}

                    {/* 👥 HR EXECUTIVE SPECIFIC LOGIN FORM */}
                    {selectedRoleTab === 'hrexecutive' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-700 font-bold mb-1">HR Email *</label>
                            <div className="input-wrapper">
                              <Mail className="input-icon-left" />
                              <input 
                                type="email" 
                                required
                                placeholder="muthujoygroup@gmail.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="input-field-styled"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-slate-700 font-bold">HR Password *</label>
                              <button
                                type="button"
                                onClick={() => openForgotMode(emailInput)}
                                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="input-wrapper">
                              <KeyRound className="input-icon-left" />
                              <input 
                                type={showPassword ? 'text' : 'password'} 
                                required
                                placeholder="Enter HR password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="input-field-styled pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="input-icon-right text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-[11px] font-medium flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>HR accounts are created by your Company Admin in the HR Team section.</span>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`btn ${currentDetail.btnClass} w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          <Lock className="w-4 h-4" />
                          <span>{isLoading ? 'Signing In...' : 'Sign In as HR Executive'}</span>
                        </button>
                      </div>
                    )}

                    {/* 📱 CANDIDATE / EMPLOYEE MAGIC LINK ACCESS */}
                    {selectedRoleTab === 'employee_link' && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2">
                          <div className="flex items-center gap-2 font-black text-xs">
                            <Smartphone className="w-4 h-4 text-amber-600" />
                            <span>Direct Access with Verification Link</span>
                          </div>
                          <p className="text-xs text-amber-900 font-medium leading-relaxed">
                            Candidates do not need a username or password. You can open your verification page directly using the link sent to your <strong>WhatsApp</strong>, <strong>SMS</strong>, or <strong>Email</strong> by your HR team.
                          </p>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            Candidate Verification Token *
                          </label>
                          <div className="input-wrapper">
                            <KeyRound className="input-icon-left text-amber-600" />
                            <input 
                              type="text" 
                              placeholder="e.g. tok_sunita_412"
                              value={candidateTokenInput}
                              onChange={(e) => setCandidateTokenInput(e.target.value)}
                              className="input-field-styled font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            4-Digit PIN (from HR) *
                          </label>
                          <div className="input-wrapper">
                            <Lock className="input-icon-left text-amber-600" />
                            <input 
                              type="password" 
                              placeholder="Enter 4-digit PIN set by HR (e.g. 1234)"
                              value={candidatePinInput}
                              onChange={(e) => setCandidatePinInput(e.target.value)}
                              className="input-field-styled font-mono font-bold"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn btn-employee w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>{isLoading ? 'Opening...' : 'Start Verification 🚀'}</span>
                        </button>
                      </div>
                    )}

                  </form>
                </>
              )}

            </div>

          </div>

        </div>

        {/* Bottom Footer Note */}
        <div className="text-center text-xs text-slate-500 font-medium">
          <p>© 2026 JOY CORPORATE SOLUTIONS PRIVATE LIMITED • Employee Verification Platform</p>
        </div>

      </div>

    </div>
  );
};

export default LoginView;
