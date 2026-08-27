import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { QrCodeModal } from '../components/QrCodeModal';
import { FullJoiningFormModal } from '../components/FullJoiningFormModal';
import { CommunicationGatewaysModal } from '../components/CommunicationGatewaysModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
import { MetricDrilldownModal } from '../components/MetricDrilldownModal';
import { ComprehensiveBgvReportModal } from '../components/ComprehensiveBgvReportModal';
import { GameActionGuideHub } from '../components/GameActionGuideHub';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { UniversalDocumentExportModal } from '../components/UniversalDocumentExportModal';
import { 
  UserCheck, 
  Send, 
  Copy, 
  Check, 
  Sliders, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Lock,
  Download,
  BarChart3,
  ListFilter,
  QrCode,
  MessageSquare,
  Sparkles,
  FileCheck2,
  FileEdit,
  SendHorizontal,
  Settings,
  Save,
  Award,
  FileText,
  ShieldCheck,
  Eye,
  Zap,
  RefreshCw,
  AlertTriangle,
  Scale
} from 'lucide-react';

export const HrExecutiveView = () => {
  const { 
    candidates, 
    addCandidate, 
    setRoleView, 
    showToast, 
    hrUsers, 
    companies, 
    featureList, 
    systemSettings, 
    updateRoleSettings, 
    masterDropdownOptions,
    getCertificateLifecycle,
    dispatchReVerificationLink
  } = useApp();
  const [showGatewaysModal, setShowGatewaysModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'profiler' | 'analytics' | 'settings'
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFullJoiningModal, setShowFullJoiningModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);
  
  // Document preview states
  const [downloadingCandidate, setDownloadingCandidate] = useState(null);
  const [viewingCertificateCandidate, setViewingCertificateCandidate] = useState(null);
  const [viewingDossierCandidate, setViewingDossierCandidate] = useState(null);
  const [viewingBgvReportCandidate, setViewingBgvReportCandidate] = useState(null);
  const [dispatchingCandidate, setDispatchingCandidate] = useState(null);
  const [activeDrilldown, setActiveDrilldown] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('corporate');
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showUniversalExportModal, setShowUniversalExportModal] = useState(false);

  const [activeGuideStep, setActiveGuideStep] = useState(0);

  const hrGuideSteps = [
    {
      id: 'profile',
      title: 'Profile Candidate & Enter Aadhaar',
      shortTitle: '1. Profiler',
      description: 'Enter candidate demographics (Name, Aadhaar UID, Mobile Number, DOB) to prepare their onboarding record.',
      actionLabel: '👉 Open Profiler',
      action: () => {
        setActiveTab('profiler');
        setShowAddForm(true);
      }
    },
    {
      id: 'apis',
      title: 'Configure 10+ Verification APIs',
      shortTitle: '2. Select APIs',
      description: 'Toggle which checks to run for this candidate (UIDAI Aadhaar, NSDL PAN, MoRTH DL, Bank Penny Drop, AI Face Match).',
      actionLabel: '👉 Choose Checks',
      action: () => {
        setActiveTab('profiler');
      }
    },
    {
      id: 'dispatch',
      title: 'Dispatch Encrypted Magic Link',
      shortTitle: '3. Dispatch Link',
      description: 'Send the onboarding link to the candidate via WhatsApp, SMS, Email, or generate a QR code for on-spot scanning.',
      actionLabel: '👉 Dispatch Link',
      action: () => {
        setActiveTab('pipeline');
        if (candidates[0]) setDispatchingCandidate(candidates[0]);
      }
    },
    {
      id: 'dossier',
      title: 'Inspect 360° Multi-API BGV Dossier',
      shortTitle: '4. 360° Dossier',
      description: 'View all verified API results in one place, audit 60-day expiry timelines, and download certified Master BGV PDF dossiers.',
      actionLabel: '👉 View 360° Dossier',
      action: () => {
        setActiveTab('pipeline');
        if (candidates[0]) setViewingBgvReportCandidate(candidates[0]);
      }
    }
  ];

  const activeHr = hrUsers[0] || { id: 'hr-1', companyId: 'comp-1', name: 'Priya Sundaram', dept: 'Engineering Recruitment' };
  const currentCompany = companies.find(c => c.id === activeHr.companyId) || companies[0];

  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    email: '',
    mobile: '',
    aadhaarNo: '',
    designation: '',
    dept: 'Engineering',
    fatherName: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    presentAddress: '',
    permanentAddress: '',
    panNo: '',
    drivingLicense: '',
    passportNo: '',
    voterId: '',
    uanEpf: '',
    highestQualification: 'B.Tech in Computer Science',
    university: 'VTU Technological University',
    bankName: 'HDFC Bank',
    bankAccountNo: '',
    ifscCode: '',
    nomineeName: '',
    nomineeRelation: 'Spouse',
    companyId: currentCompany.id,
    hrId: activeHr.id,
    verificationConfig: {
      aadhaar: true,
      pan: true,
      bankCheck: true,
      drivingLicense: false,
      voterId: false,
      mobileOtp: true,
      passport: false,
      uan: true,
      criminalCheck: false,
      education: false,
      directorship: false,
      faceCapture: true
    },
    manualChecks: {
      hrReferenceCompleted: true,
      addressVerifiedPhysically: false
    }
  });

  // 1-Click Mock / Demo Profile Auto-Fill Engine
  const handleAutoFillMockData = () => {
    const mockNames = ['Karthik Ramanathan', 'Sunita Mehra', 'Arunachalam S', 'Pooja Deshmukh', 'Muthu Kumar P'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomEmpNum = Math.floor(1000 + Math.random() * 9000);
    const randomPhone = `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const randomAadhaar = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;

    setFormData({
      name: randomName,
      empId: `EMP-2026-${randomEmpNum}`,
      email: `${randomName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
      mobile: randomPhone,
      aadhaarNo: randomAadhaar,
      designation: 'Senior Software Engineer',
      dept: 'Engineering',
      fatherName: 'Suresh Kumar',
      dob: '1996-05-15',
      gender: 'Male',
      bloodGroup: 'O+',
      maritalStatus: 'Married',
      presentAddress: '124, Green Glen Layout, Bellandur, Bengaluru, KA - 560103',
      permanentAddress: '45, MG Road, Civil Lines, Jaipur, RJ - 302001',
      panNo: 'ABCDE1234F',
      drivingLicense: 'KA-01201900124',
      passportNo: 'J8912401',
      voterId: 'WZK8912301',
      uanEpf: '100982341209',
      highestQualification: 'B.Tech / B.E. in Computer Science',
      university: 'VTU Technological University',
      bankName: 'HDFC Bank',
      bankAccountNo: '50100234129845',
      ifscCode: 'HDFC0001234',
      nomineeName: 'Priya Kumar',
      nomineeRelation: 'Spouse',
      companyId: currentCompany.id,
      hrId: activeHr.id,
      verificationConfig: {
        aadhaar: true,
        pan: true,
        bankCheck: true,
        drivingLicense: false,
        voterId: false,
        mobileOtp: true,
        passport: true,
        uan: true,
        criminalCheck: false,
        education: false,
        directorship: false,
        faceCapture: true
      },
      manualChecks: {
        hrReferenceCompleted: true,
        addressVerifiedPhysically: false
      }
    });

    showToast(`⚡ Auto-filled complete mock profile for ${randomName}!`);
  };

  const applyFormTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
    let config = { ...formData.verificationConfig };
    
    if (templateKey === 'corporate') {
      config = { requireAadhaar: true, requireMobileOtp: true, requireFaceMatch: true, requirePAN: true, requireBankCheck: true, requireDL: false };
    } else if (templateKey === 'logistics') {
      config = { requireAadhaar: true, requireMobileOtp: true, requireFaceMatch: true, requireDL: true, addressCheck: true, requirePAN: false };
    } else if (templateKey === 'healthcare') {
      config = { requireAadhaar: true, requireMobileOtp: true, requireFaceMatch: true, education: true, criminalCheck: true, requirePAN: false };
    } else if (templateKey === 'tech') {
      config = { requireAadhaar: true, requireMobileOtp: true, requireFaceMatch: true, requirePAN: true, uan: true, requireBankCheck: true };
    }
    
    setFormData(prev => ({ ...prev, verificationConfig: config }));
    showToast(`Applied "${templateKey.toUpperCase()}" Joining Template`);
  };

  const handleCreateCandidateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.aadhaarNo) {
      alert('Please fill out Name, Mobile, and Aadhaar Number.');
      return;
    }

    addCandidate(formData);
    setShowAddForm(false);
    setActiveTab('pipeline');
  };

  const handleCopyLink = (token) => {
    const link = `${window.location.origin}/verify?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    showToast('Magic verification link copied to clipboard!');
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      
      {/* Top Header Banner & Navigation Tabs */}
      <div className="glass-panel p-6 border-emerald-200 bg-white space-y-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-700" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald font-bold">HR Executive Workstation</span>
              <span className="text-xs text-slate-500 font-bold">• {activeHr.name} ({currentCompany.name})</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Employee Profiler, Verification & Document Generator</h2>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">Create candidate profiles, auto-fill mock values, dispatch multi-channel verification links, and export official PDF compliance documents.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setShowGatewaysModal(true)}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
              title="Configure WhatsApp & SMTP Email Credentials"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Gateways (WhatsApp/Email) 💬</span>
            </button>

            <button 
              onClick={() => {
                setShowAddForm(true);
                setActiveTab('profiler');
              }}
              className="btn btn-hrexecutive text-xs flex items-center gap-1.5 shadow-md font-bold"
            >
              <SendHorizontal className="w-4 h-4" />
              <span>Create Employee & Send Link</span>
            </button>

            <button 
              onClick={() => setShowFullJoiningModal(true)}
              className="btn btn-company text-xs flex items-center gap-1.5 shadow-md font-bold"
            >
              <FileEdit className="w-4 h-4" />
              <span>HR Station Form Entry</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            data-tour-step="hr-pipeline-tab"
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'pipeline' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Candidate Pipeline & Dispatcher</span>
          </button>

          <button
            data-tour-step="hr-profiler-tab"
            onClick={() => setActiveTab('profiler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'profiler' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Create Profile & Form Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>HR Conversion Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-indigo-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Station Settings ⚙️</span>
          </button>
        </div>
      </div>

      {/* 🎮 Game-Style Action Guide Hub */}
      <GameActionGuideHub
        roleKey="hrexecutive"
        roleTitle="HR Executive"
        badgeColor="emerald"
        steps={hrGuideSteps}
        currentStepIndex={activeGuideStep}
        onStepChange={setActiveGuideStep}
        onActionClick={(step) => step.action()}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Candidate Forms" 
          value={candidates.length} 
          subtext="Profiles Managed by HR" 
          icon={UserCheck} 
          color="emerald" 
          onClick={() => setActiveDrilldown({
            title: 'Active Candidate Employee Profiles',
            subtitle: `All candidate profiles managed under ${currentCompany.name}`,
            metricValue: `${candidates.length} Profiles`,
            metricType: 'hr_active',
            data: candidates.map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany.name,
              status: c.status,
              verificationDate: c.verificationDate || 'Recent',
              token: c.token
            }))
          })}
        />
        <MetricCard 
          title="Links Dispatched (WhatsApp/SMS)" 
          value={candidates.filter(c => c.status !== 'Draft').length} 
          subtext="Sent via Multi-Channel Router" 
          icon={Send} 
          color="cyan" 
          onClick={() => setActiveDrilldown({
            title: 'Dispatched Verification Links Audit',
            subtitle: 'Candidates who have received a magic link via WhatsApp, SMS, or Email',
            metricValue: `${candidates.filter(c => c.status !== 'Draft').length} Dispatched`,
            metricType: 'hr_dispatched',
            data: candidates.filter(c => c.status !== 'Draft').map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany.name,
              status: c.status,
              verificationDate: c.verificationDate || 'Dispatched',
              token: c.token
            }))
          })}
        />
        <MetricCard 
          title="Verified Successfully" 
          value={candidates.filter(c => c.status === 'Verified').length} 
          subtext="Aadhaar + Mobile + Face Completed" 
          icon={CheckCircle2} 
          color="indigo" 
          onClick={() => setActiveDrilldown({
            title: 'Successfully Verified Employees',
            subtitle: 'Candidates with 100% completed Aadhaar, Mobile, and Face verifications',
            metricValue: `${candidates.filter(c => c.status === 'Verified').length} Verified`,
            metricType: 'hr_verified',
            data: candidates.filter(c => c.status === 'Verified').map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany.name,
              status: 'Verified',
              verificationDate: c.verificationDate || 'Completed',
              token: c.token
            }))
          })}
        />
        <MetricCard 
          title="Pending Verification" 
          value={candidates.filter(c => c.status !== 'Verified').length} 
          subtext="Awaiting Candidate Response" 
          icon={Clock} 
          color="amber" 
          onClick={() => setActiveDrilldown({
            title: 'Pending Candidate Verifications',
            subtitle: 'Candidates who have not yet submitted their OTP or photo verifications',
            metricValue: `${candidates.filter(c => c.status !== 'Verified').length} Pending`,
            metricType: 'hr_pending',
            data: candidates.filter(c => c.status !== 'Verified').map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: currentCompany.name,
              status: c.status || 'Draft',
              token: c.token
            }))
          })}
        />
      </div>

      {/* TAB 1: CANDIDATE PIPELINE & MULTI-CHANNEL DISPATCHER */}
      {activeTab === 'pipeline' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-sm rounded-2xl">
          
          {/* ⏳ JCS CERTIFICATE 60-DAY EXPIRY NOTICE BOARD BANNER */}
          {(() => {
            const expiringCandidates = candidates.filter(c => {
              const lc = getCertificateLifecycle(c);
              return lc.isVerified && (lc.isExpiringSoon || lc.isExpired);
            });

            if (expiringCandidates.length === 0) return null;

            return (
              <div className="p-4 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse shrink-0" />
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        ⏳ JCS Certificate 60-Day Expiry Notice Board ({expiringCandidates.length} Candidates Action Required)
                      </h4>
                      <p className="text-[11px] text-amber-900 font-medium">
                        JCS Verification Certificates have an active validity lifecycle of <strong>60 days (2 months)</strong>. Download permanent PDF backups or dispatch re-verification links before expiry.
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-amber text-[10px] shrink-0 font-bold">60-Day Lifecycle Policy</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                  {expiringCandidates.map(c => {
                    const lc = getCertificateLifecycle(c);
                    return (
                      <div key={c.id} className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs">{c.name}</span>
                            <span className={`badge text-[9px] ${lc.badgeColor}`}>{lc.badgeLabel}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Verified: {c.verificationDate?.split(' ')[0]} • Valid until: <strong className="text-slate-800">{lc.expiryDate}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setViewingDossierCandidate(c)}
                            className="btn btn-secondary text-[10px] py-1 px-2 flex items-center gap-1 font-bold text-sky-800 bg-sky-50 border-sky-200 hover:bg-sky-100"
                            title="Download 4-Page Dossier Backup"
                          >
                            <Download className="w-3 h-3" />
                            <span>Backup PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => dispatchReVerificationLink(c.token)}
                            className="btn btn-hrexecutive text-[10px] py-1 px-2 flex items-center gap-1 font-bold shadow-2xs"
                            title="Dispatch Re-Verification Link"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Re-Verify</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ⚖️ Fair Hiring & DPDP Act 2023 Statutory Advisory Banner */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/40 text-indigo-300 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                    Statutory Fair Hiring Notice
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono hidden sm:inline">DPDP Act 2023 Section 7(a)</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  All verification queries are conducted pursuant to candidate digital consent gathered automatically on link dispatch. Masked Aadhaar and 60-day document lifecycle rules apply.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLegalHandbook(true)}
              className="btn btn-secondary text-xs py-1.5 px-3 font-bold text-white bg-white/10 hover:bg-white/20 border-white/20 shrink-0 self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Legal Guidelines 📖</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Employee Candidate Verification Pipeline & Document Registry</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Dispatch onboarding links via WhatsApp/SMS/Email, monitor 60-day certificate validity, and export official dossiers</p>
            </div>
            
            <div className="flex items-center gap-2 self-start flex-wrap">
              <button
                onClick={() => setShowUniversalExportModal(true)}
                className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-2xs cursor-pointer"
                title="Download date-filtered candidate reports in PDF, Excel CSV, or ZIP"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Date-Filtered Reports 📥</span>
              </button>

              <button
                onClick={() => {
                  setShowAddForm(true);
                  setActiveTab('profiler');
                }}
                className="btn btn-hrexecutive text-xs flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New Employee</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-4">Candidate Profile</th>
                  <th className="py-3 px-4">Contact & IDs</th>
                  <th className="py-3 px-4">Verification Checklist</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Certificate Validity (60-Day)</th>
                  <th className="py-3 px-4 text-right">Official Document Downloads & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {candidates.map((cand, index) => {
                  const lc = getCertificateLifecycle(cand);
                  return (
                    <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900 text-sm">{cand.name}</div>
                        <div className="text-slate-500 text-[11px] font-medium">{cand.designation || 'Specialist'} • #{cand.empId || 'EMP-2026-88'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-900 font-bold font-mono">{cand.mobile}</div>
                        <div className="text-slate-500 text-[11px] font-mono">Aadhaar: {cand.aadhaarNo || '5489 1234 9876'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs text-[10px]">
                          {cand.verificationConfig?.requireAadhaar && (
                            <span className={`px-1.5 py-0.5 rounded border font-bold ${
                              cand.verificationsCompleted?.aadhaar ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              Aadhaar {cand.verificationsCompleted?.aadhaar ? '✓' : '⌛'}
                            </span>
                          )}
                          {cand.verificationConfig?.requireMobileOtp && (
                            <span className={`px-1.5 py-0.5 rounded border font-bold ${
                              cand.verificationsCompleted?.mobile ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              Mobile {cand.verificationsCompleted?.mobile ? '✓' : '⌛'}
                            </span>
                          )}
                          {cand.verificationConfig?.requireFaceMatch && (
                            <span className={`px-1.5 py-0.5 rounded border font-bold ${
                              cand.verificationsCompleted?.face ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              Face {cand.verificationsCompleted?.face ? '✓' : '⌛'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`badge ${
                          cand.status === 'Verified' ? 'badge-emerald' : cand.status === 'In Verification' ? 'badge-cyan' : 'badge-amber'
                        }`}>
                          {cand.status}
                        </span>
                      </td>

                      {/* ⏳ 60-Day Certificate Lifecycle Column */}
                      <td className="py-4 px-4 text-center">
                        {lc.isVerified ? (
                          <div className="space-y-1 inline-block text-left">
                            <span className={`badge text-[9px] py-0.5 px-2 font-black ${lc.badgeColor}`}>
                              {lc.badgeLabel}
                            </span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                style={{ width: `${lc.progressPercent}%` }} 
                                className={`h-full rounded-full ${lc.isExpired || lc.status === 'critical' ? 'bg-rose-500' : lc.isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              />
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono block">Expires: {lc.expiryDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Pending Verification</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          
                          {/* 1. 360° Multi-API BGV Dossier Button */}
                          <button
                            data-tour-step={index === 0 ? 'hr-bgv-dossier-btn' : undefined}
                            onClick={() => setViewingBgvReportCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-purple-900 bg-purple-50 border-purple-200 hover:bg-purple-100 shadow-2xs"
                            title="View & Download Complete 360° Background Verification Dossier (10+ APIs)"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                            <span>360° BGV Dossier (10+ APIs)</span>
                          </button>

                          {/* 2. Employee Profile PDF Button */}
                          <button
                            onClick={() => setViewingDossierCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-sky-800 bg-sky-50 border-sky-200 hover:bg-sky-100"
                            title="View & Download Comprehensive Employee Profile Dossier"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-700" />
                            <span>Profile PDF</span>
                          </button>

                          {/* 3. Official JOY Corporate Certificate PDF Button */}
                          <button
                            onClick={() => setViewingCertificateCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-indigo-800 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                            title="View & Download JOY Corporate Solutions Official Certificate"
                          >
                            <Award className="w-3.5 h-3.5 text-indigo-700" />
                            <span>JOY Certificate PDF</span>
                          </button>

                          {/* 3. Dispatch Link Trigger */}
                          <button
                            data-tour-step={index === 0 ? 'hr-dispatch-btn' : undefined}
                            onClick={() => setDispatchingCandidate(cand)}
                            className="btn btn-hrexecutive text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold shadow-sm"
                            title="Dispatch via WhatsApp, SMS, Email, QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Dispatch Link 📲</span>
                          </button>

                          {/* 4. Test Employee Link Portal */}
                          <button
                            onClick={() => setRoleView('employee_link', cand.token)}
                            className="btn btn-company text-[11px] py-1.5 px-2 flex items-center gap-1"
                            title="Test verification link from candidate perspective"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Test Portal</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE PROFILER & JOINING FORM TEMPLATES */}
      {(activeTab === 'profiler' || showAddForm) && (
        <div className="glass-panel p-6 border-emerald-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="badge badge-emerald text-[10px] mb-1">Candidate Profiler</span>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>Create Comprehensive Employee Profile & Dispatch Verification Link</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Fill in employee information manually or click Auto-Fill Mock Profile for instant 1-click testing</p>
            </div>

            {/* ⚡ Instant 1-Click Mock Auto-Fill Button */}
            <button
              type="button"
              onClick={handleAutoFillMockData}
              className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-extrabold text-amber-900 bg-amber-50 border-amber-300 hover:bg-amber-100 shadow-sm self-start sm:self-auto"
            >
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>⚡ Auto-Fill Demo Profile (1-Click Test)</span>
            </button>
          </div>

          {/* Form Template Selector Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Joining Form Template (Pre-Configured Verification Checks)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div 
                onClick={() => applyFormTemplate('corporate')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTemplate === 'corporate' ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-extrabold text-slate-900">Standard Corporate</div>
                <div className="text-[10px] text-slate-500">Aadhaar + Mobile + Face + PAN + Bank</div>
              </div>

              <div 
                onClick={() => applyFormTemplate('logistics')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTemplate === 'logistics' ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/20' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-extrabold text-slate-900">Fleet Driver & Logistics</div>
                <div className="text-[10px] text-slate-500">Aadhaar + Mobile + Face + DL + Address</div>
              </div>

              <div 
                onClick={() => applyFormTemplate('healthcare')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTemplate === 'healthcare' ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/20' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-extrabold text-slate-900">Healthcare Staff</div>
                <div className="text-[10px] text-slate-500">Aadhaar + Mobile + Face + Education + Criminal</div>
              </div>

              <div 
                onClick={() => applyFormTemplate('tech')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTemplate === 'tech' ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500/20' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-extrabold text-slate-900">Tech & Senior Engg</div>
                <div className="text-[10px] text-slate-500">Aadhaar + Mobile + Face + PAN + UAN + Bank</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateCandidateSubmit} className="space-y-6 pt-3 border-t border-slate-100">
            
            {/* Section 1: Basic Profile Information */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider">1. Basic Profile & Demographic Details</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Candidate Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Employee Code / ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. EMP-2026-99"
                    value={formData.empId}
                    onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Father / Spouse Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Suresh Chandra"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date of Birth (DOB)</label>
                  <input 
                    type="date" 
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Designation</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="form-input font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <select 
                    value={formData.dept}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="form-select font-medium"
                  >
                    {(masterDropdownOptions?.departments || ['Engineering', 'Logistics', 'Operations', 'Human Resources', 'Finance']).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select 
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="form-select font-medium"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="form-select font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Addresses */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider">2. Contact Numbers & Addresses</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mobile Number (WhatsApp/SMS Link) *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="form-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official / Personal Email</label>
                  <input 
                    type="email" 
                    placeholder="candidate@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Aadhaar Identity Number *</label>
                  <input 
                    type="text" 
                    required
                    maxLength="14"
                    placeholder="XXXX XXXX XXXX"
                    value={formData.aadhaarNo}
                    onChange={(e) => setFormData({ ...formData, aadhaarNo: e.target.value })}
                    className="form-input font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Present Residential Address</label>
                  <textarea 
                    rows="2"
                    placeholder="124, Green Glen Layout, Bellandur, Bengaluru, KA - 560103"
                    value={formData.presentAddress}
                    onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Permanent Home Town Address</label>
                  <textarea 
                    rows="2"
                    placeholder="45, MG Road, Civil Lines, Jaipur, RJ - 302001"
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Statutory & Banking Details */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider">3. Statutory IDs, Banking & Nominee</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">PAN Card Number</label>
                  <input 
                    type="text" 
                    placeholder="ABCDE1234F"
                    value={formData.panNo}
                    onChange={(e) => setFormData({ ...formData, panNo: e.target.value.toUpperCase() })}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Passport Number</label>
                  <input 
                    type="text" 
                    placeholder="J8912401"
                    value={formData.passportNo || ''}
                    onChange={(e) => setFormData({ ...formData, passportNo: e.target.value.toUpperCase() })}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">EPFO UAN Number</label>
                  <input 
                    type="text" 
                    placeholder="100982341209"
                    value={formData.uanEpf}
                    onChange={(e) => setFormData({ ...formData, uanEpf: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Driving License (DL)</label>
                  <input 
                    type="text" 
                    placeholder="KA-01201900124"
                    value={formData.drivingLicense}
                    onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="HDFC Bank"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bank Account No</label>
                  <input 
                    type="text" 
                    placeholder="50100234129845"
                    value={formData.bankAccountNo}
                    onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Mandatory Verification Requirements Selector */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>4. Select Required Verification Checks for this Employee</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Pick which documents and background records are mandatory for this candidate. Checks are processed via Server 1 (Sandbox) or Server 2 (CoinCircleTrust).
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const allOn = {};
                      featureList.forEach(f => { allOn[f.id] = true; });
                      setFormData({ ...formData, verificationConfig: allOn });
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  >
                    Select All Checks ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        verificationConfig: { aadhaar: true, mobileOtp: true, pan: true, bankCheck: true, faceCapture: true } 
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Reset to Standard
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {featureList.map((feat) => {
                  const isEnabledBySuperAdmin = currentCompany.features?.[feat.id] ?? true;
                  const isChecked = !!formData.verificationConfig?.[feat.id];

                  if (!isEnabledBySuperAdmin) {
                    return (
                      <div key={feat.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs opacity-60 flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{feat.name}</div>
                          <div className="text-[10px]">Disabled in Company Plan</div>
                        </div>
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    );
                  }

                  return (
                    <label 
                      key={feat.id}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-emerald-50/70 border-emerald-400 text-slate-900 shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setFormData({
                          ...formData,
                          verificationConfig: { ...formData.verificationConfig, [feat.id]: e.target.checked }
                        })}
                        className="accent-emerald-600 mt-1 w-4 h-4 shrink-0"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-black text-xs text-slate-900 leading-tight">{feat.name}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase whitespace-nowrap ${
                            feat.serverMode === 'server2_only' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}>
                            {feat.serverMode === 'server2_only' ? 'Server 2 ⚡' : 'Server 1/2'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 leading-relaxed">{feat.description || feat.category}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setActiveTab('pipeline')} className="btn btn-secondary text-xs font-bold">Cancel</button>
              <button type="submit" className="btn btn-hrexecutive text-xs flex items-center gap-2 font-bold shadow-md">
                <Send className="w-4 h-4" />
                <span>Save Profile & Generate Onboarding Link</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: HR CONVERSION ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>HR Candidate Conversion Pipeline Telemetry</span>
            </h3>
            <span className="badge badge-emerald">85% Completion Conversion Rate</span>
          </div>

          <div className="space-y-4">
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
              <div className="w-[45%] bg-emerald-500 h-full" title="Verified Profiles (45%)"></div>
              <div className="w-[30%] bg-sky-500 h-full" title="In Verification (30%)"></div>
              <div className="w-[25%] bg-amber-400 h-full" title="Link Dispatched (25%)"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-700 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-2xl font-black text-emerald-800 block">45%</span>
                <span className="text-slate-600">Completed & Verified ({candidates.filter(c => c.status === 'Verified').length})</span>
              </div>
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <span className="text-2xl font-black text-sky-800 block">30%</span>
                <span className="text-slate-600">In Active Verification ({candidates.filter(c => c.status === 'In Verification').length})</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-2xl font-black text-amber-800 block">25%</span>
                <span className="text-slate-600">Link Sent / Pending ({candidates.filter(c => c.status === 'Link Sent').length})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: HR EXECUTIVE WORKSTATION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span>HR Executive Workstation Productivity & Dispatch Settings</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Configure pre-selected onboarding dispatch channels, default form templates, and fast station shortcuts.</p>
            </div>
            <span className="badge badge-indigo text-[10px]">HR Station Preferences</span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateRoleSettings('hr', systemSettings.hr);
            }} 
            className="space-y-6 text-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Onboarding Link Dispatch Defaults</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Preferred Default Dispatch Channel</label>
                  <select 
                    value={systemSettings.hr?.defaultDispatchChannel || 'whatsapp'}
                    onChange={(e) => updateRoleSettings('hr', { defaultDispatchChannel: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="whatsapp">Meta WhatsApp Business API (Fastest 💬)</option>
                    <option value="sms">Carrier SMS Gateway (Mobile OTP)</option>
                    <option value="email">Enterprise SMTP Email (HTML Template)</option>
                    <option value="qrcode">On-Screen Scannable QR Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pre-Selected Joining Template</label>
                  <select 
                    value={systemSettings.hr?.defaultTemplate || 'corporate'}
                    onChange={(e) => updateRoleSettings('hr', { defaultTemplate: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="corporate">Corporate Office Staff (Aadhaar + Mobile + Face Match)</option>
                    <option value="logistics">Fleet Logistics & Field Delivery (DL + Aadhaar)</option>
                    <option value="healthcare">Healthcare & Clinical Staff (Degree Cert + Identity)</option>
                    <option value="tech">Software & Engineering Staff (PAN + Aadhaar + Degree)</option>
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Fast Station Location & Notification Shortcuts</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Default HR Work Location Shortcut</label>
                  <input 
                    type="text" 
                    value={systemSettings.hr?.defaultWorkLocation || 'Bengaluru Tech Park (HQ)'}
                    onChange={(e) => updateRoleSettings('hr', { defaultWorkLocation: e.target.value })}
                    className="form-input text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Real-Time Candidate Verification Toast Alerts</label>
                  <select 
                    value={systemSettings.hr?.realtimeToastAlerts ? 'true' : 'false'}
                    onChange={(e) => updateRoleSettings('hr', { realtimeToastAlerts: e.target.value === 'true' })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="true">Enabled 🟢 (Show pop-up toast when candidate verifies)</option>
                    <option value="false">Disabled ⚪ (Silent background update)</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="btn btn-hrexecutive text-xs flex items-center gap-2 font-bold shadow-md">
                <Save className="w-4 h-4" />
                <span>Save Workstation Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Multi-Channel QR Code & Link Dispatcher Modal */}
      {dispatchingCandidate && (
        <QrCodeModal 
          candidate={dispatchingCandidate}
          onClose={() => setDispatchingCandidate(null)}
          onCopyLink={handleCopyLink}
          isCopied={copiedToken === dispatchingCandidate.token}
        />
      )}

      {/* Full 7-Section Joining Form Modal (HR Manual Station Entry) */}
      {showFullJoiningModal && (
        <FullJoiningFormModal 
          candidate={candidates[0]}
          isHrMode={true}
          onClose={() => setShowFullJoiningModal(false)}
          onSubmitComplete={() => setShowFullJoiningModal(false)}
        />
      )}

      {/* General Document Downloader Modal */}
      {downloadingCandidate && (
        <DocumentDownloader 
          candidate={downloadingCandidate} 
          onClose={() => setDownloadingCandidate(null)} 
        />
      )}

      {/* Direct JOY Corporate Solutions Certificate Preview Modal */}
      {viewingCertificateCandidate && (
        <OfficialVerificationCertificateModal
          candidate={viewingCertificateCandidate}
          onClose={() => setViewingCertificateCandidate(null)}
        />
      )}

      {/* Direct Employee Profile Dossier Preview Modal */}
      {viewingDossierCandidate && (
        <EmployeeProfileDossierModal
          candidate={viewingDossierCandidate}
          onClose={() => setViewingDossierCandidate(null)}
        />
      )}

      {/* WhatsApp & SMTP Email Gateways Modal */}
      {showGatewaysModal && (
        <CommunicationGatewaysModal 
          onClose={() => setShowGatewaysModal(false)} 
        />
      )}

      {/* Metric Drilldown Details Modal */}
      {activeDrilldown && (
        <MetricDrilldownModal
          isOpen={Boolean(activeDrilldown)}
          onClose={() => setActiveDrilldown(null)}
          title={activeDrilldown.title}
          subtitle={activeDrilldown.subtitle}
          metricValue={activeDrilldown.metricValue}
          metricType={activeDrilldown.metricType}
          role="hrexecutive"
          data={activeDrilldown.data}
          onViewCandidateDossier={(cand) => setViewingDossierCandidate(cand)}
          onViewCandidateCertificate={(cand) => setViewingCertificateCandidate(cand)}
          onDispatchLink={(cand) => setDispatchingCandidate(cand)}
        />
      )}

      {/* 360° Multi-API Comprehensive Background Verification Dossier Modal */}
      {viewingBgvReportCandidate && (
        <ComprehensiveBgvReportModal
          candidate={viewingBgvReportCandidate}
          companyName={currentCompany?.name || "Acme Global Technologies"}
          hrName={activeHr?.name || "Priya Sundaram"}
          onClose={() => setViewingBgvReportCandidate(null)}
        />
      )}

      {/* Statutory Legal & DPDP Compliance Handbook Modal */}
      <LegalComplianceHandbookModal
        isOpen={showLegalHandbook}
        onClose={() => setShowLegalHandbook(false)}
      />

      {/* Universal Date-Filtered Document & Report Export Modal */}
      <UniversalDocumentExportModal
        isOpen={showUniversalExportModal}
        onClose={() => setShowUniversalExportModal(false)}
        initialRole="hrexecutive"
        scopedCompanyId={currentCompany?.id}
      />

    </div>
  );
};
