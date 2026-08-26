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
  Activity,
  Layers,
  FileCheck,
  Zap,
  Check,
  Server,
  Award,
  Users,
  KeyRound,
  Eye,
  EyeOff,
  Briefcase,
  Mail,
  Send,
  QrCode,
  Fingerprint,
  ArrowLeft
} from 'lucide-react';

export const LoginView = ({ initialRole = 'superadmin' }) => {
  const { loginUser, candidates, companies, hrUsers, currentUser, currentRole } = useApp();
  const navigate = useNavigate();
  const [selectedRoleTab, setSelectedRoleTab] = useState(initialRole || 'superadmin');
  
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [candidateTokenInput, setCandidateTokenInput] = useState('tok_sunita_412');
  const [selectedCompanyId, setSelectedCompanyId] = useState('comp-1');
  const [selectedHrId, setSelectedHrId] = useState('hr-1');

  const roleDetails = {
    superadmin: {
      id: 'superadmin',
      title: 'Super Admin Portal',
      subtitle: 'Master Governance, 13-Module Platform Control & Metered Billing',
      badge: 'Master Console',
      iconBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-500',
      headerGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      borderClass: 'border-indigo-400',
      badgeClass: 'badge-purple',
      btnClass: 'btn-superadmin',
      demoEmail: 'superadmin@joyverification.com',
      demoPass: 'Master@Admin2026',
      icon: Crown,
      roleTag: 'Platform Master Governance',
      features: [
        'Full System & API Gateway Telemetry (47 Endpoints)',
        'Company Onboarding & Custom Feature Flag Toggles',
        'Company-Wise Profit & Margin Matrix (₹25 Upstream Cost)',
        'PostgreSQL Database Management & Live SQL Explorer'
      ]
    },
    company: {
      id: 'company',
      title: 'Company Admin Portal',
      subtitle: 'Executive Telemetry, Quota Management & Master Employee Registry',
      badge: 'Employer Console',
      iconBgClass: 'bg-sky-600 text-white shadow-md shadow-sky-200 border border-sky-500',
      headerGradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
      borderClass: 'border-sky-400',
      badgeClass: 'badge-cyan',
      btnClass: 'btn-company',
      demoEmail: 'admin@acmeglobal.com',
      demoPass: 'Company@Admin2026',
      icon: Building2,
      roleTag: 'Corporate Account Management',
      features: [
        'HR Staff Management & Recruiter Activity Metrics',
        'Turnaround Time (TAT) Analytics & Quota Tracking',
        'Master Employee Verification Registry & 360° Dossiers',
        'Document Storage Hub & 1-Click Tax Invoices'
      ]
    },
    hrexecutive: {
      id: 'hrexecutive',
      title: 'HR Executive Workstation',
      subtitle: 'Candidate Profiler, 10+ Multi-API Dispatcher & 60-Day Expiry Notice',
      badge: 'HR Portal',
      iconBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-200 border border-emerald-500',
      headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      borderClass: 'border-emerald-400',
      badgeClass: 'badge-emerald',
      btnClass: 'btn-hrexecutive',
      demoEmail: 'priya.s@acmeglobal.com',
      demoPass: 'Hr@Recruiter2026',
      icon: UserCheck,
      roleTag: 'Recruiting & Onboarding Workstation',
      features: [
        'Create Candidate Employee KYC Profiles',
        'Configure Required 10+ Verification Checks',
        'Dispatch Magic Token Links via WhatsApp, SMS & Email',
        '360° Multi-API BGV Dossiers & 60-Day Expiry Tracker'
      ]
    },
    employee_link: {
      id: 'employee_link',
      title: 'Employee Verification Portal',
      subtitle: 'Passwordless Token Access (Aadhaar OTP, Mobile OTP & AI Face Capture)',
      badge: 'Candidate Portal',
      iconBgClass: 'bg-amber-500 text-white shadow-md shadow-amber-200 border border-amber-500',
      headerGradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
      borderClass: 'border-amber-400',
      badgeClass: 'badge-amber',
      btnClass: 'btn-employee',
      demoEmail: 'Passwordless Magic Link Access',
      icon: Smartphone,
      roleTag: 'Self-Service Candidate Verification',
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

  const handleCustomLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedRoleTab === 'employee_link') {
      const tok = candidateTokenInput || 'tok_sunita_412';
      loginUser('employee_link', { token: tok });
      navigate(`/verify?token=${tok}`);
    } else if (selectedRoleTab === 'company') {
      const comp = companies.find(c => c.id === selectedCompanyId) || companies[0];
      loginUser('company', { email: emailInput || comp.email, companyId: comp.id });
      navigate('/company');
    } else if (selectedRoleTab === 'hrexecutive') {
      const hr = hrUsers.find(h => h.id === selectedHrId) || hrUsers[0];
      loginUser('hrexecutive', { email: emailInput || hr.email, hrId: hr.id });
      navigate('/hr');
    } else {
      loginUser('superadmin', { email: emailInput || currentDetail.demoEmail });
      navigate('/superadmin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 sm:py-10 px-3 sm:px-6 lg:px-8 text-slate-900 relative overflow-hidden">
      
      {/* Background Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-100/60 via-sky-50/40 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full space-y-8 sm:space-y-10 relative z-10 my-auto">
        
        {/* Top Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 bg-white/95 border-slate-200 rounded-2xl shadow-xs">
          <Link to="/" className="flex items-center gap-3.5 group cursor-pointer">
            <img 
              src="/joy_logo.png" 
              alt="JOY Logo" 
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-slate-900 tracking-tight leading-tight">JOY CORPORATE SOLUTIONS</h2>
                <span className="badge badge-purple text-[9px] py-0.5 px-2 hidden sm:inline-block font-black">PVT LTD</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Digital Solution for Recruitment & Payroll</p>
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
        <div className="text-center space-y-3 max-w-3xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Unified Multi-Role Enterprise Access Suite</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Secure Role-Based Login & Verification Portal
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Select your dedicated access portal below. Seamlessly authenticate as <strong className="text-indigo-900">Super Admin</strong>, <strong className="text-sky-900">Company Admin</strong>, <strong className="text-emerald-900">HR Recruiter</strong>, or <strong className="text-amber-900">Candidate</strong>.
          </p>
        </div>

        {/* 4 Multi-Role Access Selector Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 uppercase tracking-wider px-1">
            <span>Select Login Portal (4 Roles Available)</span>
            <span className="text-indigo-600 font-bold hidden sm:inline">Click Any Role to Switch Context</span>
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
                      {isSelected ? 'Active Context ✓' : 'Click to Login'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Portal Login Card Form & Interactive Options */}
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-xl relative overflow-hidden rounded-3xl">
          
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: currentDetail.headerGradient }} />

          {/* Header Row of the Login Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className={`badge ${currentDetail.badgeClass}`}>{currentDetail.badge}</span>
                <span className="text-xs font-bold text-slate-500">• {currentDetail.roleTag}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${currentDetail.iconBgClass} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span>{currentDetail.title}</span>
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">{currentDetail.subtitle}</p>
            </div>

            {/* ⚡ 1-Click Quick Demo Login Button */}
            <button 
              onClick={() => {
                if (selectedRoleTab === 'employee_link') {
                  const tok = candidateTokenInput || 'tok_sunita_412';
                  loginUser('employee_link', { token: tok });
                  navigate(`/verify?token=${tok}`);
                } else if (selectedRoleTab === 'company') {
                  loginUser('company', { email: 'admin@acmeglobal.com', companyId: 'comp-1' });
                  navigate('/company');
                } else if (selectedRoleTab === 'hrexecutive') {
                  loginUser('hrexecutive', { email: 'priya.s@acmeglobal.com', hrId: 'hr-1' });
                  navigate('/hr');
                } else {
                  loginUser('superadmin', { email: 'superadmin@joyverification.com' });
                  navigate('/superadmin');
                }
              }}
              className={`btn ${currentDetail.btnClass} text-xs px-5 py-3 flex items-center justify-center gap-2 shrink-0 shadow-md font-bold cursor-pointer w-full sm:w-auto`}
              title="Quick instant demo access"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>1-Click Quick Login as {currentDetail.badge.toUpperCase()}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Left Col: Portal Capabilities List */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Portal Capabilities & Governance</span>
              </h4>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                {currentDetail.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium">
                🔒 Protected with 256-Bit SSL Encryption, Role-Based Access Control (RBAC) & Audit Trails.
              </div>
            </div>

            {/* Right Col: Interactive Individual Authentication Form */}
            <div className="lg:col-span-2 space-y-4">
              
              <form onSubmit={handleCustomLoginSubmit} className="space-y-4 text-xs">
                
                {/* 👑 SUPER ADMIN SPECIFIC LOGIN FORM */}
                {selectedRoleTab === 'superadmin' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Super Admin Official Email *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input 
                            type="email" 
                            required
                            placeholder="superadmin@joyverification.com"
                            value={emailInput || currentDetail.demoEmail}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="form-input pl-9.5 py-2.5 font-semibold text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Master Password *</label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            required
                            placeholder="Master@Admin2026"
                            value={passwordInput || '••••••••••••'}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="form-input pl-9.5 pr-9 py-2.5 font-semibold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-900 text-[11px] font-medium flex items-center gap-2">
                      <Crown className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Full system privileges: 13 Governance Tabs, Profit Calculations, DBMS table explorer, and System Error Logs.</span>
                    </div>
                  </div>
                )}

                {/* 🏢 COMPANY ADMIN SPECIFIC LOGIN FORM */}
                {selectedRoleTab === 'company' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Select Client Enterprise Account *</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-sky-600 absolute left-3 top-3" />
                        <select 
                          value={selectedCompanyId}
                          onChange={(e) => {
                            setSelectedCompanyId(e.target.value);
                            const comp = companies.find(c => c.id === e.target.value);
                            if (comp) setEmailInput(comp.email);
                          }}
                          className="form-select pl-9.5 text-xs font-bold text-slate-900 bg-slate-50 border-slate-300 py-2.5"
                        >
                          {companies.map(c => (
                            <option key={c.id} value={c.id}>
                              🏢 {c.name} ({c.plan}) — Contact: {c.contactPerson} ({c.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Administrator Email *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input 
                            type="email" 
                            required
                            value={emailInput || companies.find(c => c.id === selectedCompanyId)?.email || 'admin@acmeglobal.com'}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="form-input pl-9.5 py-2.5 font-semibold text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Corporate Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            required
                            placeholder="Company@Admin2026"
                            value={passwordInput || '••••••••••••'}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="form-input pl-9.5 pr-9 py-2.5 font-semibold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 👩‍💼 HR EXECUTIVE SPECIFIC LOGIN FORM */}
                {selectedRoleTab === 'hrexecutive' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Select HR Recruiter Staff Account *</label>
                      <div className="relative">
                        <UserCheck className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                        <select 
                          value={selectedHrId}
                          onChange={(e) => {
                            setSelectedHrId(e.target.value);
                            const hr = hrUsers.find(h => h.id === e.target.value);
                            if (hr) setEmailInput(hr.email);
                          }}
                          className="form-select pl-9.5 text-xs font-bold text-slate-900 bg-slate-50 border-slate-300 py-2.5"
                        >
                          {hrUsers.map(h => {
                            const comp = companies.find(c => c.id === h.companyId);
                            return (
                              <option key={h.id} value={h.id}>
                                👩‍💼 {h.name} — {h.dept} ({comp?.name || 'Acme Global'}) — {h.email}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">HR Email Address *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input 
                            type="email" 
                            required
                            value={emailInput || hrUsers.find(h => h.id === selectedHrId)?.email || 'priya.s@acmeglobal.com'}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="form-input pl-9.5 py-2.5 font-semibold text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Recruiter Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            required
                            placeholder="Hr@Recruiter2026"
                            value={passwordInput || '••••••••••••'}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="form-input pl-9.5 pr-9 py-2.5 font-semibold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 📱 CANDIDATE EMPLOYEE LINK SPECIFIC LOGIN FORM */}
                {selectedRoleTab === 'employee_link' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Select Candidate Magic Verification Link Token *</label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
                        <select 
                          value={candidateTokenInput}
                          onChange={(e) => setCandidateTokenInput(e.target.value)}
                          className="form-select pl-9.5 text-xs bg-slate-50 border-slate-300 text-slate-900 font-mono font-bold py-2.5"
                        >
                          {candidates.map(c => (
                            <option key={c.id} value={c.token}>
                              📱 {c.name} ({c.companyId === 'comp-1' ? 'Acme Tech' : 'Apex Logistics'}) — Token: {c.token} [{c.status}]
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] font-medium space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        <span>Simulated WhatsApp / SMS Magic Link Experience</span>
                      </div>
                      <p>Candidates access this portal directly from their phone by tapping the encrypted magic link dispatched by HR.</p>
                    </div>
                  </div>
                )}

                {/* Submit Actions Bar */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>256-Bit TLS Security & DPDP Act 2023 Compliant</span>
                  </div>

                  <button type="submit" className={`btn ${currentDetail.btnClass} text-xs px-6 py-3 flex items-center justify-center gap-2 w-full sm:w-auto font-bold shadow-md cursor-pointer`}>
                    <span>Enter {currentDetail.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

        {/* 4 Core Platform Technology Pillars */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">Enterprise Verification Technology Pillars</h3>
            <p className="text-xs text-slate-500 font-semibold">High-trust verification infrastructure powering JOY DATA VERIFICATION</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel p-5 bg-white border-slate-200 space-y-2 rounded-2xl shadow-xs">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 w-fit border border-indigo-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Government Identity Checks</h4>
              <p className="text-xs text-slate-500 font-medium">Automated UIDAI Aadhaar OTP, MoRTH Driving License, and Tax PAN validation.</p>
            </div>

            <div className="glass-panel p-5 bg-white border-slate-200 space-y-2 rounded-2xl shadow-xs">
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 w-fit border border-sky-200">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">SMS & Mobile OTP Router</h4>
              <p className="text-xs text-slate-500 font-medium">High-priority SMS dispatching and candidate mobile number validation.</p>
            </div>

            <div className="glass-panel p-5 bg-white border-slate-200 space-y-2 rounded-2xl shadow-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit border border-emerald-200">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">AI WebCam Face Liveness</h4>
              <p className="text-xs text-slate-500 font-medium">3-Pose camera liveness check (*Straight*, *Left Turn*, *Right Turn* with 99.4% confidence).</p>
            </div>

            <div className="glass-panel p-5 bg-white border-slate-200 space-y-2 rounded-2xl shadow-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit border border-amber-200">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">360° Multi-API BGV Dossier</h4>
              <p className="text-xs text-slate-500 font-medium">Itemized monthly billing calculations, EPFO history, and downloadable compliance certificates.</p>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 space-y-1 relative z-10 mt-10 pt-6 border-t border-slate-200">
        <p className="font-bold text-slate-700">© 2026 JOY DATA VERIFICATION. All Rights Reserved.</p>
        <p className="text-[11px] text-slate-400 font-medium">Enterprise Profile Identity Verification Infrastructure • DPDP Act 2023 & ISO 27001 Certified</p>
      </div>

    </div>
  );
};
