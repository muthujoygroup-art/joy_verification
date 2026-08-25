import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { QrCodeModal } from '../components/QrCodeModal';
import { FullJoiningFormModal } from '../components/FullJoiningFormModal';
import { CommunicationGatewaysModal } from '../components/CommunicationGatewaysModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
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
  Eye,
  Zap,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
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
  const [dispatchingCandidate, setDispatchingCandidate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('corporate');

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
      requireAadhaar: true,
      requireMobileOtp: true,
      requireFaceMatch: true,
      requireDL: false,
      requirePAN: true,
      requireBankCheck: true
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
        requireAadhaar: true,
        requireMobileOtp: true,
        requireFaceMatch: true,
        requireDL: false,
        requirePAN: true,
        requireBankCheck: true
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
    <div className="space-y-8 animate-fadeIn text-slate-900 pb-16">
      
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="badge badge-emerald font-bold px-3 py-1 text-[11px] shadow-2xs">HR Executive Workstation</span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{activeHr.name} • {currentCompany.name}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Employee Profiler, Verification & Document Generator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl leading-relaxed">
              Create candidate profiles, auto-fill mock values, dispatch multi-channel verification links, and export official PDF compliance documents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            <button
              onClick={() => setShowGatewaysModal(true)}
              className="btn btn-secondary text-xs sm:text-sm py-2 px-3.5 flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
              title="Configure WhatsApp & SMTP Email Credentials"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Gateways (WhatsApp/Email) 💬</span>
            </button>

            <button 
              onClick={() => {
                setShowAddForm(true);
                setActiveTab('profiler');
              }}
              className="btn btn-hrexecutive text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 shadow-md hover:shadow-lg font-black transition-all cursor-pointer"
            >
              <SendHorizontal className="w-4 h-4" />
              <span>+ Create & Send Link</span>
            </button>

            <button 
              onClick={() => setShowFullJoiningModal(true)}
              className="btn btn-company text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 shadow-md hover:shadow-lg font-black transition-all cursor-pointer"
            >
              <FileEdit className="w-4 h-4" />
              <span>HR Station Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Sub-Navigation Segmented Bar */}
      <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'pipeline' ? 'bg-emerald-600 text-white shadow-md scale-[1.02]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. Candidate Pipeline & Dispatcher</span>
          </button>

          <button
            onClick={() => setActiveTab('profiler')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'profiler' ? 'bg-teal-600 text-white shadow-md scale-[1.02]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>2. Candidate Profiler & Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md scale-[1.02]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>3. HR Conversion Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-700 text-white shadow-md scale-[1.02]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>4. Station Settings ⚙️</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard 
          title="Active Candidate Forms" 
          value={candidates.length} 
          subtext="Profiles Managed by HR" 
          icon={UserCheck} 
          color="emerald" 
        />
        <MetricCard 
          title="Links Dispatched (WhatsApp/SMS)" 
          value={candidates.filter(c => c.status !== 'Draft').length} 
          subtext="Sent via Multi-Channel Router" 
          icon={Send} 
          color="cyan" 
        />
        <MetricCard 
          title="Verified Successfully" 
          value={candidates.filter(c => c.status === 'Verified').length} 
          subtext="Aadhaar + Mobile + Face Completed" 
          icon={CheckCircle2} 
          color="indigo" 
        />
        <MetricCard 
          title="Pending Verification" 
          value={candidates.filter(c => c.status !== 'Verified').length} 
          subtext="Awaiting Candidate Response" 
          icon={Clock} 
          color="amber" 
        />
      </div>

      {/* TAB 1: CANDIDATE PIPELINE & MULTI-CHANNEL DISPATCHER */}
      {activeTab === 'pipeline' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
          
          {/* ⏳ JCS CERTIFICATE 60-DAY EXPIRY NOTICE BOARD BANNER */}
          {(() => {
            const expiringCandidates = candidates.filter(c => {
              const lc = getCertificateLifecycle(c);
              return lc.isVerified && (lc.isExpiringSoon || lc.isExpired);
            });

            if (expiringCandidates.length === 0) return null;

            return (
              <div className="p-5 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce shrink-0" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {expiringCandidates.map(c => {
                    const lc = getCertificateLifecycle(c);
                    return (
                      <div key={c.id} className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-2">
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
                            className="btn btn-secondary text-[10px] py-1 px-2.5 flex items-center gap-1 font-bold text-sky-800 bg-sky-50 border-sky-200 hover:bg-sky-100 cursor-pointer"
                            title="Download 4-Page Dossier Backup"
                          >
                            <Download className="w-3 h-3" />
                            <span>Backup PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => dispatchReVerificationLink(c.token)}
                            className="btn btn-hrexecutive text-[10px] py-1 px-2.5 flex items-center gap-1 font-bold shadow-2xs cursor-pointer"
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Employee Candidate Verification Pipeline & Document Registry</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Dispatch onboarding links via WhatsApp/SMS/Email, monitor 60-day certificate validity, and export official dossiers</p>
            </div>
            
            <button
              onClick={() => {
                setShowAddForm(true);
                setActiveTab('profiler');
              }}
              className="btn btn-hrexecutive text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md font-bold self-start cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add New Employee</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] bg-slate-50/50">
                  <th className="py-3 px-4 rounded-l-xl">Candidate Profile</th>
                  <th className="py-3 px-4">Contact & IDs</th>
                  <th className="py-3 px-4">Verification Checklist</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Certificate Validity (60-Day)</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Official Document Downloads & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {candidates.map((cand) => {
                  const lc = getCertificateLifecycle(cand);
                  return (
                    <tr key={cand.id} className="hover:bg-emerald-50/30 transition-colors">
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
                          
                          {/* 1. Employee Profile PDF Button */}
                          <button
                            onClick={() => setViewingDossierCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-sky-800 bg-sky-50 border-sky-200 hover:bg-sky-100 cursor-pointer"
                            title="View & Download Comprehensive Employee Profile Dossier"
                          >
                            <FileText className="w-3.5 h-3.5 text-sky-700" />
                            <span>Employee Profile PDF</span>
                          </button>

                          {/* 2. Official JOY Corporate Certificate PDF Button */}
                          <button
                            onClick={() => setViewingCertificateCandidate(cand)}
                            className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold text-indigo-800 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                            title="View & Download JOY Corporate Solutions Official Certificate"
                          >
                            <Award className="w-3.5 h-3.5 text-indigo-700" />
                            <span>JOY Certificate PDF</span>
                          </button>

                          {/* 3. Dispatch Link Trigger */}
                          <button
                            onClick={() => setDispatchingCandidate(cand)}
                            className="btn btn-hrexecutive text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold shadow-sm cursor-pointer"
                            title="Dispatch via WhatsApp, SMS, Email, QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Dispatch Link 📲</span>
                          </button>

                          {/* 4. Test Employee Link Portal */}
                          <button
                            onClick={() => setRoleView('employee_link', cand.token)}
                            className="btn btn-company text-[11px] py-1.5 px-2 flex items-center gap-1 cursor-pointer"
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
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-600" />
                <span>Create Candidate Profile & Custom 10-Feature Verification Flags</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Auto-fill values or select standard corporate template to generate custom verification link</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAutoFillMockData}
                className="btn btn-superadmin text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Auto-Fill Mock Profile</span>
              </button>

              {showAddForm && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 cursor-pointer"
                >
                  ✕ Close Form
                </button>
              )}
            </div>
          </div>

          {/* Quick Template Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Select Pre-Configured Joining Template:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { id: 'corporate', title: '🏢 Standard Corporate', desc: 'Aadhaar + Mobile + Face + PAN + Bank' },
                { id: 'logistics', title: '🚚 Fleet & Logistics', desc: 'Aadhaar + Mobile + DL + Address Check' },
                { id: 'healthcare', title: '🏥 Clinical & Health', desc: 'Aadhaar + Mobile + Education + Criminal' },
                { id: 'tech', title: '💻 IT & Engineering', desc: 'Aadhaar + Mobile + Face + UAN/EPF + PAN' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyFormTemplate(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTemplate === t.id ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">{t.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Profiler Form Grid */}
          <form onSubmit={handleCreateCandidateSubmit} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Candidate Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number (WhatsApp/SMS) *</label>
                <input 
                  type="text" 
                  required
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="form-input font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar UID Number (12 Digits) *</label>
                <input 
                  type="text" 
                  required
                  placeholder="5489 1234 9876"
                  value={formData.aadhaarNo}
                  onChange={(e) => setFormData({ ...formData, aadhaarNo: e.target.value })}
                  className="form-input font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select 
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  className="form-select text-xs font-bold"
                >
                  {masterDropdownOptions.departments?.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Designation</label>
                <select 
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="form-select text-xs font-bold"
                >
                  {masterDropdownOptions.designations?.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Employee ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. ACME-2026-88"
                  value={formData.empId}
                  onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                  className="form-input font-mono"
                />
              </div>
            </div>

            {/* Feature Flags Checklist */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Toggle Mandatory Verification Checks:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                {featureList.map(feat => {
                  const keyMap = {
                    aadhaar: 'requireAadhaar',
                    mobileOtp: 'requireMobileOtp',
                    faceCapture: 'requireFaceMatch',
                    drivingLicense: 'requireDL',
                    pan: 'requirePAN',
                    bankCheck: 'requireBankCheck'
                  };
                  const configKey = keyMap[feat.id] || feat.id;
                  const isChecked = formData.verificationConfig[configKey] ?? false;

                  return (
                    <label key={feat.id} className={`p-3 rounded-xl border cursor-pointer flex items-start justify-between gap-2 transition-all ${
                      isChecked ? 'bg-emerald-50 border-emerald-300 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <div>
                        <div className="text-xs">{feat.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{feat.category}</div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            verificationConfig: {
                              ...formData.verificationConfig,
                              [configKey]: e.target.checked
                            }
                          });
                        }}
                        className="accent-emerald-600 w-4 h-4 mt-0.5 shrink-0"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="btn btn-hrexecutive text-xs py-2.5 px-5 font-black shadow-md cursor-pointer">
                Save Profile & Generate Magic Link 🚀
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: HR CONVERSION ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>HR Onboarding Funnel & Conversion Analytics</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Candidate response rates, turnaround time distribution, and gateway delivery metrics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <span className="text-emerald-800 font-bold block uppercase text-[10px]">Verification Completion Rate</span>
              <span className="text-3xl font-black text-slate-900 font-mono">82.4%</span>
              <p className="text-slate-600 text-[11px] font-medium">Average completion time: <strong>3.4 minutes</strong> per candidate</p>
            </div>

            <div className="p-5 bg-sky-50 border border-sky-200 rounded-2xl space-y-2">
              <span className="text-sky-800 font-bold block uppercase text-[10px]">WhatsApp Dispatch Delivery Rate</span>
              <span className="text-3xl font-black text-slate-900 font-mono">99.2%</span>
              <p className="text-slate-600 text-[11px] font-medium">Sent via Meta Cloud API Gateway (Instant Webhook Ack)</p>
            </div>

            <div className="p-5 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
              <span className="text-purple-800 font-bold block uppercase text-[10px]">Face Match Accuracy Score</span>
              <span className="text-3xl font-black text-slate-900 font-mono">98.8%</span>
              <p className="text-slate-600 text-[11px] font-medium">AI 3-Angle Liveness validation threshold active</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STATION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">HR Workstation Station Settings</h3>
            <p className="text-xs text-slate-500 font-medium">Configure default dispatch channels, standard joining templates, and real-time alert preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Link Dispatch Channel</label>
              <select 
                value={systemSettings.hr?.defaultDispatchChannel || 'whatsapp'}
                onChange={(e) => updateRoleSettings('hr', { defaultDispatchChannel: e.target.value })}
                className="form-select"
              >
                <option value="whatsapp">Meta WhatsApp Cloud API (Recommended)</option>
                <option value="sms">Carrier SMS Router</option>
                <option value="email">SMTP Corporate Email</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Work Location</label>
              <input 
                type="text" 
                value={systemSettings.hr?.defaultWorkLocation || 'Bengaluru Tech Park (HQ)'}
                onChange={(e) => updateRoleSettings('hr', { defaultWorkLocation: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {dispatchingCandidate && (
        <QrCodeModal 
          candidate={dispatchingCandidate}
          onClose={() => setDispatchingCandidate(null)}
        />
      )}

      {showFullJoiningModal && (
        <FullJoiningFormModal 
          candidate={{ ...formData, id: 'temp-new', token: 'temp-token', status: 'Draft' }}
          isHrMode={true}
          onClose={() => setShowFullJoiningModal(false)}
          onSubmitComplete={(finalData) => {
            addCandidate(finalData);
            setShowFullJoiningModal(false);
            showToast('Full Joining Form Saved & Candidate Profile Created!');
          }}
        />
      )}

      {showGatewaysModal && (
        <CommunicationGatewaysModal 
          isOpen={showGatewaysModal}
          onClose={() => setShowGatewaysModal(false)}
        />
      )}

      {viewingCertificateCandidate && (
        <OfficialVerificationCertificateModal 
          candidate={viewingCertificateCandidate}
          onClose={() => setViewingCertificateCandidate(null)}
        />
      )}

      {viewingDossierCandidate && (
        <EmployeeProfileDossierModal 
          candidate={viewingDossierCandidate}
          onClose={() => setViewingDossierCandidate(null)}
        />
      )}

      {downloadingCandidate && (
        <DocumentDownloader 
          candidate={downloadingCandidate}
          onClose={() => setDownloadingCandidate(null)}
        />
      )}

    </div>
  );
};
