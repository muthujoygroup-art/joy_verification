import React, { useState } from 'react';
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
  Users
} from 'lucide-react';

export const LoginView = () => {
  const { loginUser, candidates, companies } = useApp();
  const [selectedRoleTab, setSelectedRoleTab] = useState('superadmin');
  
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [candidateTokenInput, setCandidateTokenInput] = useState('tok_sunita_412');

  const handleCustomLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedRoleTab === 'employee_link') {
      loginUser('employee_link', { token: candidateTokenInput });
    } else {
      loginUser(selectedRoleTab, { email: emailInput || roleDetails[selectedRoleTab].demoEmail });
    }
  };

  const roleDetails = {
    superadmin: {
      title: 'Super Admin Portal',
      subtitle: 'Master Governance, API Gateway Telemetry & Monthly Metered Billing',
      badge: 'Master Console',
      iconBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-200 border border-indigo-500',
      headerGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      borderClass: 'border-indigo-400',
      badgeClass: 'badge-purple',
      btnClass: 'btn-superadmin',
      demoEmail: 'superadmin@joyverification.com',
      icon: Crown,
      features: [
        'Full System & API Gateway Telemetry',
        'Company Onboarding & Pricing Tariff Control',
        '10-Feature Verification Flag Manager',
        'Monthly Metered Billing & Printable Invoices'
      ]
    },
    company: {
      title: 'Company Admin Portal',
      subtitle: 'Executive Operations, HR Telemetry & Employee Master Registry',
      badge: 'Employer Console',
      iconBgClass: 'bg-sky-600 text-white shadow-md shadow-sky-200 border border-sky-500',
      headerGradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
      borderClass: 'border-sky-400',
      badgeClass: 'badge-cyan',
      btnClass: 'btn-company',
      demoEmail: 'admin@acmeglobal.com',
      icon: Building2,
      features: [
        'HR Staff Management & Activity Metrics',
        'Turnaround Time (TAT) Analytics Dashboard',
        'Master Employee Verification Registry',
        'Single-Click Compliance Document Downloads'
      ]
    },
    hrexecutive: {
      title: 'HR Executive Workstation',
      subtitle: 'Candidate Profiler, Custom 10-Feature Configurator & Magic Link Generator',
      badge: 'HR Portal',
      iconBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-200 border border-emerald-500',
      headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      borderClass: 'border-emerald-400',
      badgeClass: 'badge-emerald',
      btnClass: 'btn-hrexecutive',
      demoEmail: 'priya.s@acmeglobal.com',
      icon: UserCheck,
      features: [
        'Create Candidate Employee Profiles',
        'Configure Required Verifications per Candidate',
        'Dispatch Magic Token Links via SMS & Email',
        'Real-Time Candidate Conversion Pipeline Tracker'
      ]
    },
    employee_link: {
      title: 'Employee Verification Portal',
      subtitle: 'Passwordless Token Access (Aadhaar OTP, Mobile OTP & AI WebCam Face Capture)',
      badge: 'Candidate Portal',
      iconBgClass: 'bg-amber-500 text-white shadow-md shadow-amber-200 border border-amber-500',
      headerGradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
      borderClass: 'border-amber-400',
      badgeClass: 'badge-amber',
      btnClass: 'btn-employee',
      demoEmail: 'Token Access (No Password Required)',
      icon: Smartphone,
      features: [
        'Passwordless Tokenized Link Access',
        'Instant Aadhaar UIDAI OTP Verification',
        'Mobile Number SMS OTP Validation',
        '3-Pose AI WebCam Face Liveness Capture'
      ]
    }
  };

  const currentDetail = roleDetails[selectedRoleTab];
  const Icon = currentDetail.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 text-slate-900 relative overflow-hidden">
      
      {/* Background Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-100/60 via-sky-50/40 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full space-y-10 relative z-10 my-auto">
        
        {/* Top Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 bg-white/90 border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-500 p-[2px] shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">JOY DATA VERIFICATION</h2>
              <p className="text-[11px] text-slate-500 font-semibold">Enterprise Identity & Profile Verification Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="badge badge-emerald flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              Govt Repositories Online
            </span>
            <span className="badge badge-indigo">ISO 27001 Certified</span>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen Enterprise Background & Identity Verification</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Seamless Profile Verification Across All Logins
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Connecting <strong className="text-slate-900">Super Admins</strong>, <strong className="text-slate-900">Companies</strong>, <strong className="text-slate-900">HR Executives</strong>, and <strong className="text-slate-900">Candidates</strong> through automated Aadhaar checks, SMS OTP routing, and AI WebCam face liveness matching.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 10-Feature Matrix</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Metered Monthly Billing</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Downloadable Certificates</span>
          </div>
        </div>

        {/* Multi-Role Login Portal Cards Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            <span>Select Login Access Portal (4 Roles Available)</span>
            <span className="text-indigo-600">Click Any Portal to Switch Login Context</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(roleDetails).map((rKey) => {
              const rInfo = roleDetails[rKey];
              const RIcon = rInfo.icon;
              const isSelected = selectedRoleTab === rKey;
              return (
                <div
                  key={rKey}
                  onClick={() => setSelectedRoleTab(rKey)}
                  className={`glass-panel p-5 cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between space-y-4 rounded-2xl ${
                    isSelected 
                      ? `bg-white ${rInfo.borderClass} border-2 shadow-xl scale-[1.03]` 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {/* Top Gradient Bar for Active Selection */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: rInfo.headerGradient }} />
                  )}

                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${rInfo.iconBgClass} flex items-center justify-center`}>
                      <RIcon className="w-6 h-6 text-white shrink-0" />
                    </div>
                    <span className={`badge ${rInfo.badgeClass}`}>{rInfo.badge}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{rInfo.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium line-clamp-2">{rInfo.subtitle}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className={isSelected ? 'text-indigo-600 font-extrabold' : 'text-slate-500'}>
                      {isSelected ? 'Active Selection ✓' : 'Click to Select'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Portal Login Card Form & Capabilities */}
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-2xl relative overflow-hidden rounded-2xl">
          
          <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: currentDetail.headerGradient }} />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            
            <div>
              <div className="flex items-center gap-2">
                <span className={`badge ${currentDetail.badgeClass}`}>{currentDetail.badge}</span>
                <span className="text-xs font-bold text-slate-500">• Portal Login Context</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${currentDetail.iconBgClass} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white shrink-0" />
                </div>
                <span>{currentDetail.title}</span>
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">{currentDetail.subtitle}</p>
            </div>

            <button 
              onClick={() => loginUser(selectedRoleTab, { email: currentDetail.demoEmail })}
              className={`btn ${currentDetail.btnClass} text-xs px-5 py-3 flex items-center gap-2 shrink-0 shadow-md`}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>One-Click Quick Login as {selectedRoleTab.toUpperCase()}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Portal Capabilities List */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Portal Capabilities & Features</span>
              </h4>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                {currentDetail.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Authentication Form */}
            <div className="lg:col-span-2 space-y-4">
              
              <form onSubmit={handleCustomLoginSubmit} className="space-y-4 text-xs">
                
                {selectedRoleTab === 'employee_link' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Select Candidate Magic Verification Link Token *</label>
                      <select 
                        value={candidateTokenInput}
                        onChange={(e) => setCandidateTokenInput(e.target.value)}
                        className="form-select text-xs bg-slate-50 border-slate-300 text-slate-900 font-mono font-bold py-2.5"
                      >
                        {candidates.map(c => (
                          <option key={c.id} value={c.token}>
                            {c.name} ({c.companyId === 'comp-1' ? 'Acme Tech' : 'Apex Logistics'}) - Token: {c.token} [{c.status}]
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      💡 In production, candidates click an SMS/Email link directly (e.g. <code className="text-indigo-600 font-bold">joyverification.app/verify?token={candidateTokenInput}</code>).
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Official Email / Username *</label>
                      <input 
                        type="email" 
                        placeholder={currentDetail.demoEmail}
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="form-input py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Account Password *</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="form-input py-2.5"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit TLS Security & DPDP Act 2023 Compliant</span>
                  </div>

                  <button type="submit" className={`btn ${currentDetail.btnClass} text-xs px-6 py-3 flex items-center gap-2 w-full sm:w-auto`}>
                    <span>Enter {currentDetail.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

        {/* 4 Core Platform Pillars Section */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Enterprise Verification Technology Pillars</h3>
            <p className="text-xs text-slate-500 font-semibold">High-trust verification infrastructure powering JOY DATA VERIFICATION</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="glass-panel p-5 bg-white border-slate-200 space-y-2">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Government Identity Checks</h4>
              <p className="text-xs text-slate-500 font-medium">Automated UIDAI Aadhaar OTP, Driving License, and Tax PAN validation.</p>
            </div>

            <div className="glass-panel p-5 bg-white border-slate-200 space-y-2">
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 w-fit">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">SMS & Mobile OTP Router</h4>
              <p className="text-xs text-slate-500 font-medium">High-priority SMS dispatching and candidate mobile number validation.</p>
            </div>

            <div className="glass-panel p-5 bg-white border-slate-200 space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">AI WebCam Face Liveness</h4>
              <p className="text-xs text-slate-500 font-medium">3-Pose camera liveness check (*Straight*, *Left Turn*, *Right Turn*).</p>
            </div>

            <div className="glass-panel p-5 bg-white border-slate-200 space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Metered Monthly Invoices</h4>
              <p className="text-xs text-slate-500 font-medium">Itemized monthly billing calculations and downloadable compliance certificates.</p>
            </div>

          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 space-y-1 relative z-10 mt-12 pt-6 border-t border-slate-200">
        <p className="font-bold text-slate-700">© 2026 JOY DATA VERIFICATION. All Rights Reserved.</p>
        <p className="text-[11px] text-slate-400 font-medium">Enterprise Profile Identity Verification Infrastructure</p>
      </div>

    </div>
  );
};
