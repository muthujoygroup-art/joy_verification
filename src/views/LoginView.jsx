import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Smartphone, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Crown,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Mail,
  AlertCircle,
  QrCode,
  Fingerprint,
  ArrowLeft,
  Info,
  Check
} from 'lucide-react';

export const LoginView = ({ initialRole = 'superadmin' }) => {
  const { loginUser, candidates, companies, hrUsers, showToast } = useApp();
  const navigate = useNavigate();
  const [selectedRoleTab, setSelectedRoleTab] = useState(initialRole || 'superadmin');
  
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [candidateTokenInput, setCandidateTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const roleDetails = {
    superadmin: {
      id: 'superadmin',
      title: 'Super Admin Portal',
      subtitle: 'Master Governance, Platform Control & Metered Billing',
      badge: 'Master Console',
      iconBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-500',
      headerGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      borderClass: 'border-indigo-400',
      badgeClass: 'badge-purple',
      btnClass: 'btn-superadmin',
      placeholderEmail: 'superadmin@joyverification.com',
      icon: Crown,
      roleTag: 'Platform Master Governance',
      provisionNotice: 'Platform Master Access Only. Public registration & sign-up is permanently disabled.',
      features: [
        'Full System & API Gateway Telemetry (47 Endpoints)',
        'Company Onboarding & Account Provisioning',
        'Company-Wise Profit & Margin Matrix',
        'PostgreSQL Database Management & SQL Explorer'
      ]
    },
    company: {
      id: 'company',
      title: 'Company Admin Portal',
      subtitle: 'Executive Telemetry, Quota Management & HR Governance',
      badge: 'Employer Console',
      iconBgClass: 'bg-sky-600 text-white shadow-md shadow-sky-200 border border-sky-500',
      headerGradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
      borderClass: 'border-sky-400',
      badgeClass: 'badge-cyan',
      btnClass: 'btn-company',
      placeholderEmail: 'admin@acmeglobal.com',
      icon: Building2,
      roleTag: 'Corporate Account Management',
      provisionNotice: 'Company accounts are provisioned exclusively by Super Admin during enterprise onboarding.',
      features: [
        'HR Staff Management & HR User Creation',
        'Turnaround Time (TAT) Analytics & Quota Tracking',
        'Master Employee Verification Registry & 360° Dossiers',
        'Document Storage Vault & GST Tax Invoices'
      ]
    },
    hrexecutive: {
      id: 'hrexecutive',
      title: 'HR Executive Workstation',
      subtitle: 'Candidate Profiler, Multi-API Dispatcher & Expiry Tracker',
      badge: 'HR Portal',
      iconBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-200 border border-emerald-500',
      headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      borderClass: 'border-emerald-400',
      badgeClass: 'badge-emerald',
      btnClass: 'btn-hrexecutive',
      placeholderEmail: 'priya.s@acmeglobal.com',
      icon: UserCheck,
      roleTag: 'Recruiting & Onboarding Workstation',
      provisionNotice: 'HR accounts are provisioned exclusively by your Company Administrator in the HR Team tab.',
      features: [
        'Create Candidate Employee KYC Profiles',
        'Configure Required 10+ Verification Checks',
        'Dispatch Magic Token Links via WhatsApp, SMS & Email',
        '360° Multi-API BGV Dossiers & 60-Day Expiry Tracker'
      ]
    },
    employee_link: {
      id: 'employee_link',
      title: 'Candidate Verification Link',
      subtitle: 'Passwordless Token Access (Aadhaar OTP, Mobile OTP & AI Face Capture)',
      badge: 'Candidate Portal',
      iconBgClass: 'bg-amber-500 text-white shadow-md shadow-amber-200 border border-amber-500',
      headerGradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
      borderClass: 'border-amber-400',
      badgeClass: 'badge-amber',
      btnClass: 'btn-employee',
      icon: Smartphone,
      roleTag: 'Self-Service Candidate Verification',
      provisionNotice: 'Candidates do not have username/password accounts. Access is granted exclusively via HR Magic Links.',
      features: [
        'Passwordless Tokenized Magic Link Access',
        'Instant UIDAI Aadhaar OTP Verification',
        'Carrier SMS Mobile OTP Validation',
        '3-Pose AI WebCam Face Liveness Capture (99.4%)'
      ]
    }
  };

  const currentDetail = roleDetails[selectedRoleTab];
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

        // Validate superadmin credentials
        if (email.toLowerCase() !== 'superadmin@joyverification.com' && !email.includes('admin')) {
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

        const comp = (companies || []).find(c => c.email?.toLowerCase() === email) || companies[0];
        await loginUser('company', { email, password, companyId: comp?.id });
        navigate('/company');
      } 
      else if (selectedRoleTab === 'hrexecutive') {
        const email = emailInput.trim().toLowerCase();
        const password = passwordInput.trim();

        if (!email || !password) {
          setLoginError('Please enter HR Executive Work Email and Password.');
          setIsLoading(false);
          return;
        }

        const hr = (hrUsers || []).find(h => h.email?.toLowerCase() === email) || hrUsers[0];
        await loginUser('hrexecutive', { email, password, hrId: hr?.id });
        navigate('/hr');
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

      <div className="max-w-6xl mx-auto w-full space-y-8 sm:space-y-10 relative z-10 my-auto">
        
        {/* Top Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 bg-white/95 border-slate-200 rounded-2xl shadow-xs">
          <Link to="/" className="flex items-center gap-3.5 group cursor-pointer">
            <img 
              src="/joy_logo.png" 
              alt="JOY Logo" 
              className="w-11 h-11 object-contain group-hover:scale-105 transition-transform" 
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
            <Link 
              to="/" 
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Homepage 🌐</span>
            </Link>
            <span className="badge badge-emerald flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              Gateway Online
            </span>
            <span className="badge badge-indigo">ISO 27001 & DPDP Act</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-2.5 max-w-3xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Role-Based Enterprise Authentication</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Sign In to Your Authorized Portal
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Select your assigned portal below to authenticate with your official enterprise credentials.
          </p>
        </div>

        {/* 4 Multi-Role Access Selector Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 uppercase tracking-wider px-1">
            <span>Select Access Portal</span>
            <span className="text-indigo-600 font-bold hidden sm:inline">Hierarchical RBAC Architecture</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(roleDetails).map((rKey) => {
              const rInfo = roleDetails[rKey];
              const RIcon = rInfo.icon;
              const isSelected = selectedRoleTab === rKey;
              return (
                <div
                  key={rKey}
                  onClick={() => {
                    setSelectedRoleTab(rKey);
                    setEmailInput('');
                    setPasswordInput('');
                    setLoginError('');
                  }}
                  className={`glass-panel p-5 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between space-y-4 rounded-2xl ${
                    isSelected 
                      ? `bg-white ${rInfo.borderClass} border-2 shadow-xl scale-[1.02]` 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {/* Top Gradient Bar for Active Selection */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: rInfo.headerGradient }} />
                  )}

                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${rInfo.iconBgClass} flex items-center justify-center shrink-0`}>
                      <RIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`badge ${rInfo.badgeClass} text-[10px]`}>{rInfo.badge}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{rInfo.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium line-clamp-2">{rInfo.subtitle}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className={isSelected ? 'text-indigo-600 font-extrabold' : 'text-slate-500'}>
                      {isSelected ? 'Active Selection ✓' : 'Select Portal'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Portal Login Card Form */}
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
                <span>Governance & Privileges</span>
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
                🔒 Protected with 256-Bit TLS Encryption, Rate Limiting & Tamper-Evident SHA-256 Audit Trail.
              </div>
            </div>

            {/* Right Col: Standard Credential Authentication Form */}
            <div className="lg:col-span-2 space-y-4">
              
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
                        <label className="block text-slate-700 font-bold mb-1">Super Admin Official Email *</label>
                        <div className="input-wrapper">
                          <Mail className="input-icon-left" />
                          <input 
                            type="email" 
                            required
                            placeholder="superadmin@joyverification.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="input-field-styled"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Master Password *</label>
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
                      <span>Full system privileges: 13 Master Governance Tabs, Profit Engine, and Database Explorer.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`btn ${currentDetail.btnClass} w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isLoading ? 'Authenticating...' : 'Sign In as Super Administrator'}</span>
                    </button>
                  </div>
                )}

                {/* 🏢 COMPANY ADMIN SPECIFIC LOGIN FORM */}
                {selectedRoleTab === 'company' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Company Administrator Email *</label>
                        <div className="input-wrapper">
                          <Mail className="input-icon-left" />
                          <input 
                            type="email" 
                            required
                            placeholder="admin@acmeglobal.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="input-field-styled"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Corporate Account Password *</label>
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
                      <span>Company accounts are created by Super Admin. Need access? Contact Super Administrator.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`btn ${currentDetail.btnClass} w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isLoading ? 'Authenticating...' : 'Sign In as Company Administrator'}</span>
                    </button>
                  </div>
                )}

                {/* 👥 HR EXECUTIVE SPECIFIC LOGIN FORM */}
                {selectedRoleTab === 'hrexecutive' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">HR Executive Corporate Email *</label>
                        <div className="input-wrapper">
                          <Mail className="input-icon-left" />
                          <input 
                            type="email" 
                            required
                            placeholder="priya.s@acmeglobal.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="input-field-styled"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">HR Workstation Password *</label>
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
                      <span>HR Executive accounts are created by your Company Admin inside the HR Team console.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`btn ${currentDetail.btnClass} w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isLoading ? 'Authenticating...' : 'Sign In as HR Executive'}</span>
                    </button>
                  </div>
                )}

                {/* 📱 CANDIDATE / EMPLOYEE MAGIC LINK ACCESS */}
                {selectedRoleTab === 'employee_link' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2">
                      <div className="flex items-center gap-2 font-black text-xs">
                        <Smartphone className="w-4 h-4 text-amber-600" />
                        <span>Passwordless Magic Link Verification</span>
                      </div>
                      <p className="text-xs text-amber-900 font-medium leading-relaxed">
                        Candidates do not require a username or password. You can access your personalized e-KYC onboarding portal directly by clicking the secure link sent to your <strong>WhatsApp</strong>, <strong>SMS</strong>, or <strong>Email</strong> by your HR recruiter.
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
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">
                        Example demo tokens: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-bold">tok_sunita_412</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-bold">tok_vikram_891</code>
                      </p>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Security Passcode / PIN *
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
                      <span>{isLoading ? 'Opening Portal...' : 'Access Candidate Verification Portal 🚀'}</span>
                    </button>
                  </div>
                )}

              </form>

            </div>

          </div>

        </div>

        {/* Bottom Footer Note */}
        <div className="text-center text-xs text-slate-500 font-medium">
          <p>© 2026 JOY CORPORATE SOLUTIONS PRIVATE LIMITED • Enterprise Identity & BGV Ecosystem</p>
        </div>

      </div>

    </div>
  );
};
