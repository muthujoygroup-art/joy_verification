import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Smartphone, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Award, 
  Zap, 
  Check, 
  BarChart3, 
  Scale, 
  CreditCard, 
  ChevronRight, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  Layers,
  Send,
  Eye,
  X,
  Play,
  FileCheck
} from 'lucide-react';

export const LandingPageView = () => {
  const navigate = useNavigate();
  const [monthlyVolume, setMonthlyVolume] = useState(500);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', company: '', email: '', phone: '', volume: '500-2000' });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // Dynamic pricing calculation based on volume
  const getPricePerCheck = (vol) => {
    if (vol < 100) return 65;
    if (vol < 500) return 55;
    if (vol < 2000) return 45;
    return 40;
  };

  const currentPrice = getPricePerCheck(monthlyVolume);
  const estimatedMonthly = monthlyVolume * currentPrice;

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
    }, 2500);
  };

  const portalGateways = [
    {
      role: 'superadmin',
      title: 'Super Admin Portal',
      url: '/superadmin',
      badge: 'Master Governance',
      badgeClass: 'badge-purple',
      icon: Crown,
      headerGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      btnClass: 'btn-superadmin',
      description: 'Platform master governance, 47-API telemetry, company tariff control, profit matrix, and PostgreSQL live DBMS query explorer.',
      features: ['13 Governance Tabs', 'Company Margin & Profit Matrix', 'Live PostgreSQL DBMS', 'System Error Diagnostics']
    },
    {
      role: 'company',
      title: 'Company Admin Portal',
      url: '/company',
      badge: 'Employer Console',
      badgeClass: 'badge-cyan',
      icon: Building2,
      headerGradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
      btnClass: 'btn-company',
      description: 'Corporate client operations, HR recruiter oversight, Turnaround Time (TAT) analytics, and Master Employee Registry.',
      features: ['HR Staff Quota Allocation', 'Master Employee Registry', 'Encrypted Document Vault', '1-Click GST Invoices']
    },
    {
      role: 'hrexecutive',
      title: 'HR Executive Workstation',
      url: '/hr',
      badge: 'Recruiter Workstation',
      badgeClass: 'badge-emerald',
      icon: UserCheck,
      headerGradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      btnClass: 'btn-hrexecutive',
      description: 'Candidate KYC profiling, custom 10+ API verification selection, WhatsApp/SMS magic link dispatch, and 360° BGV Dossiers.',
      features: ['Candidate Profiler & Configurator', 'WhatsApp, SMS & Email Dispatch', '360° Multi-API BGV Dossiers', '60-Day Expiry Lifecycle Tracker']
    },
    {
      role: 'employee_link',
      title: 'Candidate Employee Portal',
      url: '/verify?token=tok_sunita_412',
      badge: 'Candidate Gateway',
      badgeClass: 'badge-amber',
      icon: Smartphone,
      headerGradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
      btnClass: 'btn-employee',
      description: 'Passwordless token access for candidates to complete instant Aadhaar OTP, Mobile OTP, and 3-Pose AI WebCam face liveness.',
      features: ['Passwordless Magic Link', 'Instant UIDAI Aadhaar OTP', 'Carrier Mobile SMS OTP', '3-Pose AI WebCam Face Match']
    }
  ];

  const apiStackList = [
    { name: 'UIDAI Aadhaar OTP', cat: 'Identity', desc: 'Direct UIDAI gateway verification with name, DOB, address & linkage check.' },
    { name: 'NSDL / Tax PAN Info', cat: 'Identity', desc: 'Instant PAN active status, legal name matching, and PAN-Aadhaar linkage.' },
    { name: 'EPFO UAN History', cat: 'Employment', desc: 'Chronological employment timeline with past companies, DOJ, DOE & member IDs.' },
    { name: 'Bank Penny Drop (IMPS)', cat: 'Banking', desc: 'Instant ₹1 IMPS deposit verifying account holder name match score & IFSC.' },
    { name: 'MoRTH Driving License', cat: 'Transport', desc: 'Sarathi portal check for valid classes (LMV/HMV), RTO authority, and expiry.' },
    { name: 'Passport Seva Check', cat: 'Identity', desc: 'Passport number and file verification with Ministry of External Affairs.' },
    { name: 'ECI Voter ID (EPIC)', cat: 'Identity', desc: 'Electoral Commission verification with assembly constituency & polling booth.' },
    { name: 'ESIC Social Security', cat: 'Workforce', desc: 'Employee State Insurance IP number, employer code & dispensary branch.' },
    { name: 'Mobile 360 & UPI', cat: 'Telecom', desc: 'Carrier network validation, SIM activation history & linked UPI handles.' },
    { name: 'AI Face Liveness', cat: 'Biometrics', desc: '3-Pose WebCam anti-spoofing camera scan with 99.4% confidence match.' },
    { name: 'eCourts Legal Screening', cat: 'Compliance', desc: 'National Judicial Data Grid scan across 3,400+ district and high courts.' },
    { name: 'GSTIN & MCA Master Data', cat: 'Corporate', desc: 'Corporate CIN, Director DIN, and GST return compliance report.' }
  ];

  const faqs = [
    {
      q: 'How does JOY Data Verification connect to Government & Financial Repositories?',
      a: 'JOY integrates directly with UIDAI (API Setu), Income Tax Dept (NSDL), EPFO Unified Portal, MoRTH Sarathi, and NPCI IMPS Instant Settlement Gateways using secure TLS 256-bit encrypted connections.'
    },
    {
      q: 'What is the 360° Multi-API BGV Audit Dossier?',
      a: 'It is a comprehensive, tamper-proof executive audit document that compiles verified real-time data across all 10+ checks (Aadhaar, PAN, Bank Penny Drop, EPFO history, DL, Face Liveness) into a single downloadable PDF with a cryptographic verification hash.'
    },
    {
      q: 'What are the dedicated sub-URLs for different user types?',
      a: 'Super Admins access /superadmin, Corporate Clients access /company, HR Recruiters access /hr, and Candidates access their encrypted token link at /verify?token=...'
    },
    {
      q: 'Is candidate data compliant with the Digital Personal Data Protection (DPDP) Act 2023?',
      a: 'Yes. All data processing is strictly consent-driven with Point-in-Time verification timestamps, automated 60-day certificate expiry lifecycles, and ISO 27001 certified data handling.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 🌐 TOP PUBLIC NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group cursor-pointer">
            <img 
              src="/joy_logo.png" 
              alt="JOY CORPORATE SOLUTIONS PVT LTD Logo" 
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-none">
                  JOY CORPORATE SOLUTIONS
                </span>
                <span className="badge badge-purple text-[9px] py-0.5 px-2 hidden md:inline-block font-black">
                  PVT LTD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Digital Solution for Recruitment & Payroll
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Portals & Features</a>
            <a href="#apis" className="hover:text-indigo-600 transition-colors">10+ API Services</a>
            <a href="#dossier" className="hover:text-indigo-600 transition-colors">360° Dossier</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing Estimator</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowDemoModal(true)}
              className="btn btn-secondary text-xs py-2 px-3.5 font-bold hidden sm:flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Book Demo</span>
            </button>

            {/* Direct Login Sub-URL Dropdown Menu Button */}
            <div className="relative group">
              <a
                href="#portals"
                className="btn btn-superadmin text-xs py-2 px-4 font-black shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Sign In to Portals</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </header>

      {/* 🚀 HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-b border-slate-200">
        
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-sky-200/30 to-purple-200/40 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-300 text-indigo-900 text-xs font-black shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Next-Gen Enterprise Digital Background Verification & Payroll Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto">
            Automate Employee Background Verification in <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">Seconds</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            Empower your HR & Compliance teams with real-time, automated verification against <strong>UIDAI Aadhaar</strong>, <strong>NSDL PAN</strong>, <strong>EPFO Employment History</strong>, <strong>IMPS Bank Penny Drop</strong>, and <strong>AI WebCam Face Liveness</strong>.
          </p>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#portals"
              className="btn btn-superadmin text-sm py-3.5 px-6 font-black shadow-xl flex items-center gap-2 cursor-pointer hover:scale-103 transition-transform"
            >
              <span>Explore Login Portals</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => setShowDemoModal(true)}
              className="btn btn-secondary text-sm py-3.5 px-6 font-bold flex items-center gap-2 cursor-pointer bg-white hover:bg-slate-100 shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span>Schedule Live Walkthrough</span>
            </button>
          </div>

          {/* Live Government Gateway Status Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold text-slate-600 border-t border-slate-200/80 max-w-4xl mx-auto">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <strong className="text-slate-900">UIDAI Aadhaar</strong> Gateway Online
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong className="text-slate-900">NSDL PAN</strong> Gateway Active
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong className="text-slate-900">EPFO Passbook</strong> Connected
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <strong className="text-slate-900">ISO 27001 & DPDP Act 2023</strong> Certified
            </span>
          </div>

        </div>
      </section>

      {/* 👑 DEDICATED SUB-PORTAL GATEWAYS (URL DIRECTS) */}
      <section id="portals" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">Dedicated Portal URL Directs</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Role-Specific Enterprise Sub-Portals
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Access your dedicated workspace directly via unique sub-URLs or click any gateway card below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portalGateways.map((gate) => {
              const GateIcon = gate.icon;
              return (
                <div
                  key={gate.role}
                  className="glass-panel p-6 bg-white border-2 border-slate-200/90 hover:border-indigo-500 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: gate.headerGradient }} />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-slate-100 group-hover:scale-110 transition-transform">
                        <GateIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <span className={`badge ${gate.badgeClass} text-[10px]`}>{gate.badge}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">{gate.title}</h3>
                      <div className="mt-1 font-mono text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg w-fit">
                        Direct URL: {gate.url}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                        {gate.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
                      {gate.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={gate.url}
                    className={`btn ${gate.btnClass} text-xs py-3 px-4 font-black shadow-md flex items-center justify-center gap-2 w-full`}
                  >
                    <span>Launch {gate.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 📊 10+ VERIFICATION APIS SHOWCASE */}
      <section id="apis" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="badge badge-emerald text-xs font-black uppercase tracking-wider">Multi-API Verification Stack</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              10+ Real-Time Verification Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Direct connection to 47 government and financial API endpoints for comprehensive candidate background screening.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apiStackList.map((api, idx) => (
              <div key={idx} className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2.5 hover:border-indigo-300 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h4 className="font-extrabold text-slate-900 text-sm">{api.name}</h4>
                  </div>
                  <span className="badge badge-indigo text-[10px]">{api.cat}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {api.desc}
                </p>
                <div className="text-[10px] text-emerald-700 font-bold font-mono pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>SLA TAT: &lt; 1.5 Seconds</span>
                  <span>Accuracy: 99.9% ✓</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 📑 360° MASTER BGV DOSSIER SPOTLIGHT */}
      <section id="dossier" className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black">
              <Award className="w-3.5 h-3.5" />
              <span>Standard Enterprise Compliance Deliverable</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Executive 360° Multi-API BGV Audit Dossier
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Every verified candidate generates a standardized, tamper-proof Multi-Page PDF dossier aggregating outputs from UIDAI, NSDL, EPFO, Bank IMPS, and AI camera sensors with a cryptographic SHA-256 hash.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>UIDAI & NSDL Tax Profile</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>EPFO UAN Employment Timeline</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bank Penny Drop IMPS Match</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3-Pose AI Face Biometrics</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/hr"
                className="btn btn-superadmin text-xs py-3 px-6 font-black shadow-lg inline-flex items-center gap-2"
              >
                <span>View Sample Dossier in HR Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Dossier Mock Card Visual */}
          <div className="glass-panel p-6 sm:p-8 bg-white/10 border-2 border-indigo-500/40 rounded-3xl backdrop-blur-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img src="/joy_logo.png" alt="JOY Logo" className="w-10 h-10 object-contain" />
                <div>
                  <div className="font-extrabold text-sm text-white">JOY DATA VERIFICATION</div>
                  <div className="text-[10px] text-slate-400 font-mono">Report ID: SHA256-JOY-BGV-2026</div>
                </div>
              </div>
              <span className="badge badge-emerald text-[10px] font-black">100% VERIFIED ✓</span>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">Candidate:</span>
                <span className="text-white">Rajesh Kumar (#ACME-2026-88)</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">APIs Executed:</span>
                <span className="text-emerald-400 font-mono">10 Government & Bank Checks</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">EPFO History:</span>
                <span className="text-white">Infosys Limited ➔ Wipro Enterprises</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">IMPS Penny Drop:</span>
                <span className="text-white">HDFC Bank (100% Name Match)</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-400">Certificate Expiry:</span>
                <span className="text-amber-400 font-mono">Active for 60 Days</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center font-medium">
              🔒 Digitally signed and certified under the Digital Personal Data Protection (DPDP) Act 2023.
            </div>
          </div>

        </div>
      </section>

      {/* 💰 INTERACTIVE PRICING ESTIMATOR */}
      <section id="pricing" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="badge badge-cyan text-xs font-black uppercase tracking-wider">Metered Transparent Tariff</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Interactive Pricing & Volume Estimator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Slide to calculate your estimated monthly investment based on candidate onboarding volume.
            </p>
          </div>

          <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-10 bg-slate-50 border-2 border-slate-200 rounded-3xl shadow-md space-y-8">
            
            {/* Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Monthly Candidate Verifications:</span>
                <span className="text-xl font-black text-indigo-700 font-mono">{monthlyVolume} Checks / Month</span>
              </div>

              <input 
                type="range" 
                min="50" 
                max="5000" 
                step="50"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono font-bold">
                <span>50 checks</span>
                <span>1,000 checks</span>
                <span>2,500 checks</span>
                <span>5,000+ checks</span>
              </div>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-slate-400 text-[11px] uppercase font-bold block">Rate Per Check</span>
                <span className="text-2xl font-black text-slate-900 font-mono">₹{currentPrice}</span>
                <span className="text-[10px] text-slate-500 block">per candidate</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-slate-400 text-[11px] uppercase font-bold block">Estimated Monthly</span>
                <span className="text-2xl font-black text-indigo-700 font-mono">₹{estimatedMonthly.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-500 block">+ 18% GST itemized</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-slate-400 text-[11px] uppercase font-bold block">Included APIs</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">All 10+</span>
                <span className="text-[10px] text-slate-500 block">unlimited dossiers</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowDemoModal(true)}
                className="btn btn-superadmin text-xs py-3.5 px-8 font-black shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Request Custom Enterprise Contract Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ❓ FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="badge badge-purple text-xs font-black uppercase tracking-wider">Enterprise Answers</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left font-extrabold text-sm text-slate-900 cursor-pointer gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-indigo-600 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>

                {openFaq === idx && (
                  <p className="text-xs text-slate-600 font-medium mt-3 pt-3 border-t border-slate-100 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 🏢 ENTERPRISE FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 sm:py-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <img src="/joy_logo.png" alt="JOY Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h4 className="text-base font-black text-white">JOY CORPORATE SOLUTIONS PVT LTD</h4>
                  <p className="text-[11px] text-slate-400 font-bold uppercase">Digital Solution for Recruitment & Payroll</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">
                Enterprise background verification infrastructure providing instant candidate KYC screening, EPFO passbook audits, IMPS bank verification, and biometric liveness.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Direct Sub-URLs</h5>
              <div className="flex flex-col space-y-1 font-semibold">
                <Link to="/superadmin" className="hover:text-indigo-400 transition-colors">👑 /superadmin (Master Console)</Link>
                <Link to="/company" className="hover:text-sky-400 transition-colors">🏢 /company (Corporate Portal)</Link>
                <Link to="/hr" className="hover:text-emerald-400 transition-colors">👩‍💼 /hr (Recruiter Workstation)</Link>
                <Link to="/verify" className="hover:text-amber-400 transition-colors">📱 /verify (Candidate Gateway)</Link>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-white uppercase tracking-wider text-[11px]">Compliance & Support</h5>
              <p className="text-slate-400">
                ✉️ contact@joycorporatesolutions.com<br />
                📞 +91 (080) 4567-8900<br />
                🛡️ ISO 27001 & DPDP Act 2023
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
            <p>© 2026 JOY CORPORATE SOLUTIONS PVT LTD. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>SLA Terms</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 📑 LIVE DEMO REQUEST MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 relative text-slate-900">
            
            <button 
              onClick={() => setShowDemoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img src="/joy_logo.png" alt="JOY Logo" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="font-black text-lg text-slate-900">Schedule an Enterprise Demo</h3>
                <p className="text-xs text-slate-500 font-medium">JOY CORPORATE SOLUTIONS PVT LTD</p>
              </div>
            </div>

            {demoSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-slate-900 text-sm">Demo Request Received!</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Our enterprise integration consultant will contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Priya Sundaram"
                    value={demoForm.name}
                    onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                    className="form-input py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company / Enterprise Legal Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Acme Global Technologies Pvt Ltd"
                    value={demoForm.company}
                    onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                    className="form-input py-2.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Official Work Email *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="priya@acmeglobal.com"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="form-input py-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contact Phone *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 98765 43210"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      className="form-input py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expected Monthly Verification Volume</label>
                  <select
                    value={demoForm.volume}
                    onChange={(e) => setDemoForm({ ...demoForm, volume: e.target.value })}
                    className="form-select py-2.5 text-xs font-bold"
                  >
                    <option value="50-200">50 – 200 candidates / month</option>
                    <option value="200-1000">200 – 1,000 candidates / month</option>
                    <option value="1000-5000">1,000 – 5,000 candidates / month</option>
                    <option value="5000+">5,000+ candidates / month (Custom SLA)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn btn-superadmin text-xs py-3 w-full font-black shadow-md">
                    <span>Submit Demo Request 🚀</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
