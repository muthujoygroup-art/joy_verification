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
    request2FaOtp,
    verify2FaAndLogin,
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

  // 🛡️ Universal 2FA State
  const [is2FaMode, setIs2FaMode] = useState(false);
  const [twoFaOtp, setTwoFaOtp] = useState('');
  const [twoFaTargetEmail, setTwoFaTargetEmail] = useState('');
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaError, setTwoFaError] = useState('');
  const [twoFaPendingAuth, setTwoFaPendingAuth] = useState(null);
  const [enable2FaStep] = useState(true); // Mandatory 2FA for all login portals
  const [authScanStep, setAuthScanStep] = useState(0);
  const [twoFaTimer, setTwoFaTimer] = useState(900); // 15 minutes TTL

  // Multi-Stage Security Scanner Engagement Animation during login
  useEffect(() => {
    let t1, t2;
    if (isLoading) {
      setAuthScanStep(1);
      t1 = setTimeout(() => setAuthScanStep(2), 450);
      t2 = setTimeout(() => setAuthScanStep(3), 1000);
    } else {
      setAuthScanStep(0);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isLoading]);

  // 15-Minute 2FA Countdown Timer
  useEffect(() => {
    let interval = null;
    if (is2FaMode && twoFaTimer > 0) {
      interval = setInterval(() => {
        setTwoFaTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [is2FaMode, twoFaTimer]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
    if (selectedRoleTab === 'employee_link') {
      setForgotEmail(defaultEmail || candidateTokenInput || '');
    } else {
      setForgotEmail(defaultEmail || (selectedRoleTab === 'superadmin' ? '' : emailInput));
    }
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
      const isCandidate = selectedRoleTab === 'employee_link';
      let emailToUse = '';
      if (isSuperAdmin) {
        emailToUse = (forgotEmail || '').trim();
      } else if (isCandidate) {
        emailToUse = (forgotEmail || candidateTokenInput).trim();
      } else {
        emailToUse = (forgotEmail || emailInput).trim();
      }

      if (!emailToUse && !isSuperAdmin) {
        setForgotError(isCandidate ? 'Please enter your Candidate Verification Token or registered email.' : 'Please enter your registered account email.');
        setIsForgotLoading(false);
        return;
      }

      const res = await requestForgotPassword(emailToUse, selectedRoleTab);
      setForgotSuccess(res.message || 'Passcode dispatched! Please check your email or notifications.');
      setForgotEmail(res.email || emailToUse || 'admin@joycorporatesolutions.com');
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message || 'Failed to dispatch recovery email. Please verify your details.');
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

    const isCandidate = selectedRoleTab === 'employee_link';
    if (isCandidate) {
      if (!forgotNewPassword || !/^\d{4}$/.test(forgotNewPassword)) {
        setForgotError('New Security PIN must be exactly 4 numeric digits.');
        return;
      }
    } else {
      if (!forgotNewPassword || forgotNewPassword.length < 4) {
        setForgotError('New password must be at least 4 characters.');
        return;
      }
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError(isCandidate ? 'Security PINs do not match. Please re-enter.' : 'Passwords do not match. Please re-enter.');
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
      setForgotSuccess(res.message || (isCandidate ? 'Security PIN successfully updated!' : 'Password successfully updated!'));
      if (isCandidate) {
        setCandidatePinInput(forgotNewPassword.trim());
      } else {
        setEmailInput(emailToUse);
        setPasswordInput(forgotNewPassword.trim());
      }
      setTimeout(() => {
        setIsForgotMode(false);
        setForgotStep(1);
        setForgotSuccess(isCandidate ? '🎉 Security PIN reset complete! You can now start verification.' : '🎉 Password reset complete! You can now log in with your new password.');
      }, 1200);
    } catch (err) {
      setForgotError(err.message || 'Failed to update credentials. Please check passcode.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  if (isLoading) {
    const activeSub = selectedRoleTab === 'company'
      ? 'AUTHENTICATING COMPANY PORTAL'
      : selectedRoleTab === 'superadmin'
      ? 'AUTHENTICATING SUPERADMIN CONSOLE'
      : selectedRoleTab === 'hrexecutive'
      ? 'AUTHENTICATING HR WORKSTATION'
      : selectedRoleTab === 'employee_link'
      ? 'INITIALIZING CANDIDATE VERIFICATION'
      : 'AUTHENTICATING AUTHORIZED SESSION';

    return (
      <GlobalPlatformPreloader 
        isFullScreen={true} 
        autoDismissMs={1800} 
        subtitleText={activeSub} 
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
      welcomeImage: '/assets/welcome/welcome_superadmin.jpg',
      heroImage: '/assets/welcome/hero_superadmin.jpg',
      welcomeHeading: 'Welcome, Super Administrator',
      welcomeSub: 'Master Command Console for enterprise multi-tenant governance, 81 verification clusters & DPDP compliance.',
      welcomePill: 'Master Command Access',
      stats: [
        { label: 'System SLA', val: '99.99%' },
        { label: 'Audit Trail', val: 'SHA-256' },
        { label: 'Security', val: 'DPDP Active' }
      ],
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
      welcomeImage: '/assets/welcome/welcome_company.jpg',
      heroImage: '/assets/welcome/hero_company.jpg',
      welcomeHeading: 'Welcome, Corporate Administrator',
      welcomeSub: 'Manage workforce screening, HR recruiter workstations & employee verification dossiers.',
      welcomePill: 'Enterprise Corporate Suite',
      stats: [
        { label: 'Turnaround', val: '< 10 Sec' },
        { label: 'Compliance', val: 'DPDP 2023' },
        { label: 'Vault', val: 'AES-256' }
      ],
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
      welcomeImage: '/assets/welcome/welcome_hrexecutive.jpg',
      heroImage: '/assets/welcome/hero_hrexecutive.jpg',
      welcomeHeading: 'Welcome, HR Talent Recruiter',
      welcomeSub: 'Fast-track candidate onboarding with automated WhatsApp/SMS verification invitations.',
      welcomePill: 'Talent Acquisition Workstation',
      stats: [
        { label: 'Govt APIs', val: '81 Active' },
        { label: 'Speed', val: 'Instant' },
        { label: 'Delivery', val: 'SMS + WA' }
      ],
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
      welcomeImage: '/assets/welcome/welcome_candidate.jpg',
      heroImage: '/assets/welcome/hero_candidate.jpg',
      welcomeHeading: 'Welcome, Candidate',
      welcomeSub: 'Instant self-service candidate identity onboarding with official government checks & biometric matching.',
      welcomePill: 'Candidate Self-Service',
      stats: [
        { label: 'Process', val: 'Paperless' },
        { label: 'Security', val: 'UIDAI / ITD' },
        { label: 'Privacy', val: 'Consent First' }
      ],
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

  const handleVerify2FaSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setTwoFaError('');
    if (!twoFaOtp || !twoFaOtp.trim()) {
      setTwoFaError('Please enter the 6-digit passcode.');
      return;
    }
    if (twoFaTimer === 0) {
      setTwoFaError('⚠️ 2FA passcode has expired. Please click "Resend" to receive a fresh code.');
      return;
    }
    setTwoFaLoading(true);
    try {
      const pending = twoFaPendingAuth || { role: selectedRoleTab, email: twoFaTargetEmail };
      const authRes = await verify2FaAndLogin({
        role: pending.role,
        email: pending.email,
        otp: twoFaOtp.trim(),
        token: pending.token
      });
      setIs2FaMode(false);

      if (pending.role === 'superadmin') {
        navigate('/superadmin');
      } else if (pending.role === 'company') {
        const comp = (companies || []).find(c => c.email?.toLowerCase() === (pending.email || '').toLowerCase()) || (companies || [])[0];
        const compSlug = (pending.compSlug || comp?.name || 'joy-corporate-solutions').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        navigate(`/company/${compSlug}`);
      } else if (pending.role === 'hrexecutive') {
        const compName = authRes?.user?.companyName || authRes?.user?.company_name || 'joy-corporate-solutions';
        const hrSlug = compName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        navigate(`/hr/${hrSlug}`);
      } else if (pending.role === 'employee_link') {
        navigate(`/verify?token=${pending.token}`);
      }
    } catch (err) {
      setTwoFaError(err.message || 'Invalid or expired 2FA passcode.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleResend2FaOtp = async () => {
    setTwoFaError('');
    try {
      const pending = twoFaPendingAuth || { role: selectedRoleTab, email: twoFaTargetEmail };
      await request2FaOtp(twoFaTargetEmail, pending.role);
      setTwoFaTimer(900);
      setForgotSuccess('Fresh 2FA security code resent to your email!');
    } catch (err) {
      setTwoFaError('Failed to resend code: ' + err.message);
    }
  };

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
        const expectedPin = candidateFound?.portalPassword || candidateFound?.portal_password;
        if (expectedPin && pinToUse !== expectedPin) {
          setLoginError('❌ Incorrect Security PIN. Please enter the passcode provided by HR.');
          setIsLoading(false);
          return;
        }

        const res = await loginUser('employee_link', { token: tokenToUse, pin: pinToUse });
        if (res?.requires_2fa) {
          setIs2FaMode(true);
          setTwoFaTargetEmail(res.email || '');
          setTwoFaOtp('');
          setTwoFaTimer(900);
          setTwoFaPendingAuth({ role: 'employee_link', token: tokenToUse, pin: pinToUse, email: res.email });
          setIsLoading(false);
          return;
        }
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

        const res = await loginUser('superadmin', { email, password, enable_2fa: enable2FaStep });
        if (res?.requires_2fa) {
          setIs2FaMode(true);
          setTwoFaTargetEmail(res.email || email);
          setTwoFaOtp('');
          setTwoFaTimer(900);
          setTwoFaPendingAuth({ role: 'superadmin', email: res.email || email, password });
          setIsLoading(false);
          return;
        }

        navigate('/superadmin');
      } 
      else if (selectedRoleTab === 'company') {
        let email = emailInput.trim().toLowerCase();
        if (email.includes('@') && email.endsWith('.c') && !email.endsWith('.com')) {
          email = email + 'om';
        }
        const password = passwordInput.trim();

        if (!email || !password) {
          setLoginError('Please enter Company Administrator Email (or Company Code) and Password.');
          setIsLoading(false);
          return;
        }

        const comp = (companies || []).find(c => 
          c.email?.toLowerCase() === email || 
          c.code?.toLowerCase() === email ||
          c.id?.toLowerCase() === email
        ) || (companies || [])[0];

        const res = await loginUser('company', { email, password, enable_2fa: enable2FaStep, companyId: comp?.id, code: emailInput.trim().toUpperCase() });
        if (res?.requires_2fa) {
          const compSlug = (res?.user?.companyName || comp?.name || 'joy-corporate-solutions').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          setIs2FaMode(true);
          setTwoFaTargetEmail(res.email || email);
          setTwoFaOtp('');
          setTwoFaTimer(900);
          setTwoFaPendingAuth({ role: 'company', email: res.email || email, password, companyId: comp?.id, compSlug });
          setIsLoading(false);
          return;
        }

        const authenticatedName = res?.user?.companyName || res?.user?.name || comp?.name || 'joy-corporate-solutions';
        const authenticatedSlug = authenticatedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        navigate(`/company/${authenticatedSlug}`);
      } 
      else if (selectedRoleTab === 'hrexecutive') {
        const email = emailInput.trim().toLowerCase();
        const password = passwordInput.trim();

        if (!email || !password) {
          setLoginError('Please enter HR Executive Work Email and Password.');
          setIsLoading(false);
          return;
        }

        const res = await loginUser('hrexecutive', { email, password, enable_2fa: enable2FaStep });
        if (res?.requires_2fa) {
          setIs2FaMode(true);
          setTwoFaTargetEmail(res.email || email);
          setTwoFaOtp('');
          setTwoFaTimer(900);
          setTwoFaPendingAuth({ role: 'hrexecutive', email: res.email || email, password });
          setIsLoading(false);
          return;
        }

        const compName = res?.companyName || res?.company_name || 'joy-corporate-solutions';
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
    <div className="h-screen max-h-screen bg-slate-50 flex flex-col justify-between py-2 sm:py-3.5 px-3 sm:px-6 lg:px-8 text-slate-900 relative overflow-x-hidden overflow-y-auto lg:overflow-y-hidden select-none">
      
      {/* Background Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-indigo-100/60 via-sky-50/40 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-between min-h-0 my-auto py-1 relative z-10">
        
        {/* Top Header Navigation Bar (Compact, No Gateway Online, No ISO) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 glass-panel p-2.5 sm:p-3 bg-white/95 border-slate-200 rounded-2xl shadow-xs">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img 
              src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
              alt="JOY TRUE PROFILE Logo" 
              className="w-8 h-8 object-contain shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-xs sm:text-sm text-slate-900 tracking-tight leading-tight">JOY CORPORATE SOLUTIONS</h2>
                <span className="badge badge-purple text-[8.5px] py-0.5 px-1.5 hidden sm:inline-block font-black">PVT LTD</span>
              </div>
              <p className="text-[9.5px] sm:text-[10px] text-indigo-700 font-extrabold uppercase tracking-wider">Enterprise Identity & 360° Verification Platform</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-xs flex-wrap justify-center">
            <span className="badge badge-indigo text-[10.5px] py-1 px-3 font-bold shadow-2xs">
              DPDP Act 2023 Statutory Compliance
            </span>
          </div>
        </div>

        {/* Selected Portal Split-Screen Enterprise Card (Auto-Fit & Zero Scroll) */}
        <div className="glass-panel border-slate-200/90 bg-white shadow-2xl relative overflow-hidden rounded-2xl sm:rounded-3xl animate-tab-switch grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 max-h-[660px] lg:max-h-[700px] my-auto">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 z-30" style={{ background: currentDetail.headerGradient }} />

          {/* ========================================================================= */}
          {/* 🎨 LEFT HALF: FULL-BLEED 3D CINEMATIC VISUAL HERO PANEL (5 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden bg-slate-950 p-4 sm:p-5 lg:p-6 text-white min-h-[280px] lg:min-h-full group">
            
            {/* Full-Bleed 3:4 High-Resolution 3D Artwork */}
            <img 
              src={currentDetail.heroImage || currentDetail.welcomeImage} 
              alt={currentDetail.welcomeHeading}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              onError={(e) => {
                if (e.target.src !== currentDetail.welcomeImage) {
                  e.target.src = currentDetail.welcomeImage;
                }
              }}
            />

            {/* Multi-Layered Cinematic Dark & Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/25 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-slate-950/60 pointer-events-none" />

            {/* TOP: Floating Branding Pill (NO 'PORTAL ACTIVE' & NO 'Master Command Access' Clutter) */}
            <div className="relative z-10 flex items-center justify-between gap-2 min-h-6">
              {selectedRoleTab !== 'superadmin' ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-xl">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>{currentDetail.welcomePill}</span>
                </div>
              ) : <div />}
            </div>

            {/* CENTER / FLOATING GLASS CARD: Real-time Trust Highlights */}
            <div className="relative z-10 my-auto py-2 hidden sm:block">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/15 shadow-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-300 tracking-wide uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enterprise Security Infrastructure</span>
                </div>
                <p className="text-[11px] text-slate-200/90 leading-relaxed font-medium">
                  {currentDetail.welcomeSub}
                </p>
                
                {/* Trust Badges Bar inside floating glass card */}
                <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-white/10 text-center">
                  {(currentDetail.stats || []).map((st, i) => (
                    <div key={i} className="p-1 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-[8.5px] font-bold text-slate-300 uppercase tracking-wider">{st.label}</div>
                      <div className="text-[11px] font-black text-white mt-0.5">{st.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM: Persona Heading, Value Proposition & DPDP Seal */}
            <div className="relative z-10 space-y-1 pt-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20 text-white">
                  {currentDetail.roleTag}
                </span>
                <span className="text-[10.5px] font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Verifiable
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight drop-shadow-md">
                {currentDetail.welcomeHeading}
              </h3>

              <div className="flex items-center justify-between text-[10.5px] text-slate-300 pt-1.5 border-t border-white/10">
                <span>🔒 256-bit Bank Grade Encryption</span>
                <span className="font-bold text-indigo-300">DPDP Act 2023</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 🔐 RIGHT HALF: PROFESSIONAL ENTERPRISE SIGN-IN WORKSTATION (7 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-between overflow-hidden bg-white h-full space-y-2.5 relative">
            
            {/* Header Section of the Right Column */}
            <div className="border-b border-slate-100 pb-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`badge ${currentDetail.badgeClass} text-[9.5px] font-black uppercase tracking-wider`}>
                    {currentDetail.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">• {currentDetail.roleTag}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10.5px] font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure SSL Auth</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-xl ${currentDetail.iconBgClass} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                    {currentDetail.title} Sign In
                  </h1>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {currentDetail.subtitle}
                  </p>
                </div>
              </div>

              {/* Only show provisionNotice if not SuperAdmin */}
              {selectedRoleTab !== 'superadmin' && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10.5px] text-slate-600 font-medium">
                  <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>{currentDetail.provisionNotice}</span>
                </div>
              )}
            </div>

            {/* INNOVATIVE HIGH-TECH ENGAGEMENT ANIMATION OVERLAY DURING AUTHENTICATION */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-fadeIn rounded-2xl">
                {/* Concentric Cryptographic Radar Rings */}
                <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping" />
                  <div className="absolute inset-1 rounded-full border-2 border-t-indigo-600 border-r-purple-600 border-b-transparent border-l-transparent animate-spin" />
                  <div className="absolute inset-3 rounded-full border-2 border-t-transparent border-r-transparent border-b-indigo-400 border-l-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
                  <div className="absolute inset-5 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-300">
                    <ShieldCheck className="w-5 h-5 text-white animate-pulse" />
                  </div>
                </div>

                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  {authScanStep === 1 
                    ? '⚡ Initializing Sovereign Handshake...' 
                    : authScanStep === 2 
                    ? '🔐 Verifying Master Cryptographic Hash...' 
                    : '🛡️ Dispatching Mandatory 2FA Passcode...'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs font-medium">
                  High-assurance zero-trust gateway authenticating authorized Master Admin session.
                </p>

                {/* Animated Dynamic Progress Bar */}
                <div className="w-56 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3.5 border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: authScanStep === 1 ? '35%' : authScanStep === 2 ? '70%' : '95%' }}
                  />
                </div>
              </div>
            )}

            {/* Authentication Form & Workflows */}
            <div className="space-y-4">
              
              {/* ========================================================================= */}
              {/* 🛡️ TWO-FACTOR AUTHENTICATION (2FA) WORKFLOW */}
              {/* ========================================================================= */}
              {is2FaMode ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-black">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-sm">Two-Factor Security Verification (2FA)</h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          High-assurance authentication for {currentDetail.title}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIs2FaMode(false)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Login</span>
                    </button>
                  </div>

                  {twoFaError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{twoFaError}</span>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span>Passcode dispatched to authorized email:</span>
                    </div>
                    <div className="font-mono font-bold text-slate-900 bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between">
                      <span className="truncate">{twoFaTargetEmail}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`badge ${twoFaTimer < 120 ? 'badge-rose' : 'badge-indigo'} text-[10px] font-mono flex items-center gap-1`}>
                          ⏱️ {formatTimer(twoFaTimer)}
                        </span>
                        <span className="badge badge-emerald text-[9px]">OTP Sent ✉️</span>
                      </div>
                    </div>
                  </div>

                  {twoFaTimer === 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Passcode expired after 15 minutes. Click "Resend" below to receive a new code.</span>
                    </div>
                  )}

                  <form onSubmit={handleVerify2FaSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Enter 6-Digit 2FA Passcode *
                      </label>
                      <div className="input-wrapper">
                        <KeyRound className="input-icon-left text-indigo-600" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="••••••"
                          value={twoFaOtp}
                          onChange={(e) => setTwoFaOtp(e.target.value)}
                          className="input-field-styled font-mono font-black tracking-widest text-center text-lg py-3"
                          autoFocus
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        6-digit passcode valid for 15 minutes sent to your registered email.
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={twoFaLoading || !twoFaOtp.trim()}
                        className={`btn ${currentDetail.btnClass} flex-1 py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{twoFaLoading ? 'Verifying 2FA...' : 'Verify Passcode & Enter Portal 🔓'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResend2FaOtp}
                        className="px-3.5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Resend 2FA Passcode"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Resend</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : isForgotMode ? (
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
                      ) : selectedRoleTab === 'employee_link' ? (
                        <>
                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed space-y-1">
                            <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5 text-amber-600" />
                              <span>Candidate Security PIN Recovery:</span>
                            </div>
                            <p>Enter your <strong>Candidate Verification Token</strong> (or registered email/mobile). A 6-digit passcode will be dispatched to your registered email to set a new 4-digit PIN.</p>
                          </div>

                          <div>
                            <label className="block text-slate-700 font-bold mb-1">
                              Candidate Token or Registered Email *
                            </label>
                            <div className="input-wrapper">
                              <KeyRound className="input-icon-left text-amber-600" />
                              <input 
                                type="text" 
                                required
                                placeholder="e.g. tok_dl_9241028942 or candidate@gmail.com"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="input-field-styled font-medium"
                              />
                            </div>
                          </div>
                        </>
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

                  {/* STEP 3: SET NEW PASSWORD OR 4-DIGIT PIN (AFTER OTP IS VERIFIED) */}
                  {forgotStep === 3 && (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Passcode verified for: <strong>{forgotEmail || (selectedRoleTab === 'superadmin' ? 'Master Super Admin Email' : 'Registered Account')}</strong>. {selectedRoleTab === 'employee_link' ? 'Please set your new 4-digit security PIN below.' : 'Please enter your new password below.'}
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                            {selectedRoleTab === 'employee_link' ? 'New 4-Digit Security PIN *' : 'New Password *'}
                          </label>
                          <div className="input-wrapper">
                            <Lock className="input-icon-left text-slate-400" />
                            <input 
                              type={showForgotPw ? 'text' : 'password'} 
                              required
                              minLength={selectedRoleTab === 'employee_link' ? 4 : 4}
                              maxLength={selectedRoleTab === 'employee_link' ? 4 : undefined}
                              placeholder={selectedRoleTab === 'employee_link' ? '••••' : 'Enter new password'}
                              value={forgotNewPassword}
                              onChange={(e) => setForgotNewPassword(e.target.value)}
                              className={`input-field-styled pr-10 font-medium ${selectedRoleTab === 'employee_link' ? 'font-mono text-center tracking-widest' : ''}`}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotPw(!showForgotPw)}
                              className="input-icon-right text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                              title={showForgotPw ? "Hide password" : "Show password"}
                            >
                              {showForgotPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                            {selectedRoleTab === 'employee_link' ? 'Confirm 4-Digit Security PIN *' : 'Confirm New Password *'}
                          </label>
                          <div className="input-wrapper">
                            <Lock className="input-icon-left text-slate-400" />
                            <input 
                              type={showForgotPw ? 'text' : 'password'} 
                              required
                              minLength={selectedRoleTab === 'employee_link' ? 4 : 4}
                              maxLength={selectedRoleTab === 'employee_link' ? 4 : undefined}
                              placeholder={selectedRoleTab === 'employee_link' ? '••••' : 'Re-enter new password'}
                              value={forgotConfirmPassword}
                              onChange={(e) => setForgotConfirmPassword(e.target.value)}
                              className={`input-field-styled font-medium ${selectedRoleTab === 'employee_link' ? 'font-mono text-center tracking-widest' : ''}`}
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
                          <span>
                            {isForgotLoading 
                              ? (selectedRoleTab === 'employee_link' ? 'Updating PIN...' : 'Updating Password...') 
                              : (selectedRoleTab === 'employee_link' ? 'Save New PIN & Start Verification 🚀' : 'Save New Password & Log In 🚀')
                            }
                          </span>
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

                  <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                    
                    {/* 👑 SUPER ADMIN SPECIFIC LOGIN FORM */}
                    {selectedRoleTab === 'superadmin' && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-0.5">
                            Super Admin Master Email *
                          </label>
                          <div className="input-wrapper">
                            <Mail className="input-icon-left text-slate-400" />
                            <input 
                              type="email" 
                              required
                              placeholder="admin@joycorporatesolutions.com"
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              className="input-field-styled py-2 text-xs sm:text-sm font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                              Master Password *
                            </label>
                            <button
                              type="button"
                              onClick={() => openForgotMode(emailInput || 'admin@joycorporatesolutions.com')}
                              className="text-[10.5px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <div className="input-wrapper">
                            <KeyRound className="input-icon-left text-slate-400" />
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              required
                              placeholder="Enter master password"
                              value={passwordInput}
                              onChange={(e) => setPasswordInput(e.target.value)}
                              className="input-field-styled py-2 pr-10 text-xs sm:text-sm font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="input-icon-right text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                              title={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Mandatory 2FA Indicator Badge (No Checkbox Toggle) */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50/90 border border-indigo-200/90 text-xs shadow-2xs">
                          <div className="flex items-center gap-2 text-indigo-950 font-bold">
                            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="text-[11px] font-bold">Two-Factor Authentication (2FA) Mandatory</span>
                          </div>
                          <span className="badge badge-indigo text-[9px] font-black uppercase tracking-wider">
                            Enforced 🛡️
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`btn ${currentDetail.btnClass} w-full py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isLoading ? 'Authenticating Master Access...' : 'Sign In as Super Admin'}</span>
                        </button>
                      </div>
                    )}

                    {/* 🏢 COMPANY ADMIN SPECIFIC LOGIN FORM */}
                    {selectedRoleTab === 'company' && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-0.5">
                            Company Admin Email *
                          </label>
                          <div className="input-wrapper">
                            <Mail className="input-icon-left text-slate-400" />
                            <input 
                              type="email" 
                              required
                              placeholder="muthukumar@joyglobalcorp.com"
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              className="input-field-styled py-2 text-xs sm:text-sm font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                              Company Password *
                            </label>
                            <button
                              type="button"
                              onClick={() => openForgotMode(emailInput)}
                              className="text-[10.5px] font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <div className="input-wrapper">
                            <KeyRound className="input-icon-left text-slate-400" />
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              required
                              placeholder="Enter company password"
                              value={passwordInput}
                              onChange={(e) => setPasswordInput(e.target.value)}
                              className="input-field-styled py-2 pr-10 text-xs sm:text-sm font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="input-icon-right text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                              title={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Mandatory 2FA Indicator Badge (No Checkbox Toggle) */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50/90 border border-sky-200/90 text-xs shadow-2xs">
                          <div className="flex items-center gap-2 text-sky-950 font-bold">
                            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                            <span className="text-[11px] font-bold">Two-Factor Authentication (2FA) Mandatory</span>
                          </div>
                          <span className="badge badge-cyan text-[9px] font-black uppercase tracking-wider">
                            Enforced 🛡️
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`btn ${currentDetail.btnClass} w-full py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isLoading ? 'Signing In...' : 'Sign In as Company Admin'}</span>
                        </button>
                      </div>
                    )}

                    {/* 👥 HR EXECUTIVE SPECIFIC LOGIN FORM */}
                    {selectedRoleTab === 'hrexecutive' && (
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-0.5">
                            HR Recruiter Email *
                          </label>
                          <div className="input-wrapper">
                            <Mail className="input-icon-left text-slate-400" />
                            <input 
                              type="email" 
                              required
                              placeholder="muthujoygroup@gmail.com"
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              className="input-field-styled py-2 text-xs sm:text-sm font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700">
                              HR Password *
                            </label>
                            <button
                              type="button"
                              onClick={() => openForgotMode(emailInput)}
                              className="text-[10.5px] font-bold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer"
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <div className="input-wrapper">
                            <KeyRound className="input-icon-left text-slate-400" />
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              required
                              placeholder="Enter HR password"
                              value={passwordInput}
                              onChange={(e) => setPasswordInput(e.target.value)}
                              className="input-field-styled py-2 pr-10 text-xs sm:text-sm font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="input-icon-right text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                              title={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Mandatory 2FA Indicator Badge (No Checkbox Toggle) */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-xs shadow-2xs">
                          <div className="flex items-center gap-2 text-emerald-950 font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-[11px] font-bold">Two-Factor Authentication (2FA) Mandatory</span>
                          </div>
                          <span className="badge badge-emerald text-[9px] font-black uppercase tracking-wider">
                            Enforced 🛡️
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`btn ${currentDetail.btnClass} w-full py-2.5 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isLoading ? 'Signing In...' : 'Sign In as HR Executive'}</span>
                        </button>
                      </div>
                    )}

                    {/* 📱 CANDIDATE / EMPLOYEE MAGIC LINK ACCESS */}
                    {selectedRoleTab === 'employee_link' && (
                      <div className="space-y-3.5">
                        <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-1">
                          <div className="flex items-center gap-1.5 font-black text-xs">
                            <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Direct Access with Verification Link</span>
                          </div>
                          <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                            Candidates do not require accounts. You can start directly using the verification link sent to your <strong>WhatsApp</strong>, <strong>SMS</strong>, or <strong>Email</strong>, or enter your token below.
                          </p>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
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
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                              4-Digit Security PIN (from HR) *
                            </label>
                            <button
                              type="button"
                              onClick={() => openForgotMode(candidateTokenInput)}
                              className="text-[11px] font-bold text-amber-600 hover:text-amber-800 hover:underline cursor-pointer"
                            >
                              Forgot PIN?
                            </button>
                          </div>
                          <div className="input-wrapper">
                            <Lock className="input-icon-left text-amber-600" />
                            <input 
                              type="password" 
                              maxLength={4}
                              placeholder="Enter 4-digit PIN provided by HR"
                              value={candidatePinInput}
                              onChange={(e) => setCandidatePinInput(e.target.value)}
                              className="input-field-styled font-mono font-bold tracking-widest text-center"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="btn btn-employee w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <ArrowRight className="w-4 h-4" />
                          <span>{isLoading ? 'Validating Token...' : 'Start Verification 🚀'}</span>
                        </button>
                      </div>
                    )}

                  </form>
                </>
              )}

            </div>

            {/* Portal Capabilities / Integrated Capabilities Chips */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Portal Capabilities</span>
                </span>
                <span className="text-[9.5px] font-bold text-slate-400">Enterprise Edition</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold text-slate-700">
                {currentDetail.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/80 hover:border-indigo-300 hover:translate-x-0.5 transition-all">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate text-[10.5px]">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Footer Note */}
        <div className="text-center text-[10.5px] text-slate-400 font-medium py-0.5">
          <p>© 2026 JOY CORPORATE SOLUTIONS PRIVATE LIMITED • Employee Verification Platform</p>
        </div>

      </div>

    </div>
  );
};

export default LoginView;
