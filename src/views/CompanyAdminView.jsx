import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { HrPerformanceChart, TatDistributionChart } from '../components/StatsCharts';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { DocumentStorageHub } from '../components/DocumentStorageHub';
import { PaymentModal } from '../components/PaymentModal';
import { CommunicationGatewaysModal } from '../components/CommunicationGatewaysModal';
import { TermsAndPrivacyPolicyModal } from '../components/TermsAndPrivacyPolicyModal';
import { MetricDrilldownModal } from '../components/MetricDrilldownModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { ComprehensiveBgvReportModal } from '../components/ComprehensiveBgvReportModal';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { UniversalDocumentExportModal } from '../components/UniversalDocumentExportModal';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  UserPlus,
  FileCheck,
  BarChart3,
  Download,
  FolderDown,
  Layers,
  AlertTriangle,
  CreditCard,
  MessageSquare,
  Receipt,
  Settings,
  Save,
  Lock,
  Scale,
  Zap,
  Copy,
  SendHorizontal,
  Server,
  Sparkles,
  KeyRound,
  FileText
} from 'lucide-react';

export const CompanyAdminView = () => {
  const { 
    companies, 
    hrUsers, 
    candidates, 
    addHrUser, 
    setRoleView, 
    companyPaymentLedger, 
    systemSettings, 
    updateRoleSettings, 
    platformGuidelines, 
    updateGuidelines,
    getCertificateLifecycle,
    rechargeCompanyWallet,
    updateCompanyRoutingEngine,
    updateCompanyHrPermissions,
    updateCompanyFeatures,
    apiConfigurations
  } = useApp();
  const [selectedCompanyId, setSelectedCompanyId] = useState('comp-joy');
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'registry' | 'hrteam' | 'dochub' | 'billing_wallet' | 'hr_permissions'
  const [showAddHrModal, setShowAddHrModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [showGatewaysModal, setShowGatewaysModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [inspectCandidate, setInspectCandidate] = useState(null);
  const [downloadingCandidate, setDownloadingCandidate] = useState(null);
  const [activeDrilldown, setActiveDrilldown] = useState(null);
  const [viewingDossierCandidate, setViewingDossierCandidate] = useState(null);
  const [viewingCertificateCandidate, setViewingCertificateCandidate] = useState(null);
  const [viewingBgvReportCandidate, setViewingBgvReportCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showUniversalExportModal, setShowUniversalExportModal] = useState(false);

  const company = companies.find(c => c.id === selectedCompanyId) || companies[0];
  const companyHrUsers = hrUsers.filter(h => h.companyId === company.id);
  const companyCandidates = candidates.filter(c => c.companyId === company.id);

  const filteredCandidates = companyCandidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifiedCount = companyCandidates.filter(c => c.status === 'Verified').length;
  const pendingCount = companyCandidates.filter(c => c.status !== 'Verified').length;

  const [newHr, setNewHr] = useState({
    name: '',
    email: '',
    dept: 'Engineering Recruitment'
  });

  const handleAddHrSubmit = (e) => {
    e.preventDefault();
    if (!newHr.name || !newHr.email) return;
    addHrUser({
      ...newHr,
      companyId: company.id
    });
    setShowAddHrModal(false);
    setNewHr({ name: '', email: '', dept: 'Engineering Recruitment' });
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      
      {/* Top Workstation Header Banner & Sub-Navigation Tabs */}
      <div className="glass-panel p-6 border-sky-200 bg-white space-y-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-600 to-teal-600" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan">Company Admin Workstation</span>
              <span className="text-xs text-slate-500 font-bold">• Executive Operations</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{company.name}</h2>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">HR Staff Telemetry, Turnaround Time Metrics, Employee Master Registry & Document Hub.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowGatewaysModal(true)}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
              title="Configure WhatsApp & SMTP Email Credentials"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp / Email API Gateways 💬</span>
            </button>

            <button
              onClick={() => setShowUniversalExportModal(true)}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-2xs cursor-pointer"
              title="Download date-filtered candidate dossiers and Excel CSVs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Date-Filtered Reports 📥</span>
            </button>

            {/* ⚡ 1-Click Verification Wallet Recharge via Razorpay */}
            <button
              onClick={() => setShowRazorpayModal(true)}
              className="btn btn-superadmin text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-black shadow-md cursor-pointer"
              title="Recharge Verification Credits via Razorpay UPI / Cards / NetBanking / Payment Link"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>Recharge Wallet ⚡</span>
            </button>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn btn-hrexecutive text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold shadow-sm"
              title="Pay Monthly Verification Bill Online"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Pay Online & Settle Bill 💳</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-bold">Company:</span>
              <select 
                value={company.id}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="form-select bg-slate-50 border-slate-300 text-slate-900 text-xs font-bold w-auto"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.plan})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs Bar (Executive Telemetry Statistics is FIRST option) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-1.5">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center justify-center lg:justify-start gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'telemetry' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 bg-white/60 lg:bg-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span className="truncate">Telemetry & TAT</span>
          </button>

          <button
            data-tour-step="company-registry-tab"
            onClick={() => setActiveTab('registry')}
            className={`flex items-center justify-center lg:justify-start gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'registry' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 bg-white/60 lg:bg-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">Registry</span>
          </button>

          <button
            data-tour-step="company-hr-tab"
            onClick={() => setActiveTab('hrteam')}
            className={`flex items-center justify-center lg:justify-start gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'hrteam' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 bg-white/60 lg:bg-transparent'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">HR Team</span>
          </button>

          <button
            data-tour-step="company-dochub-tab"
            onClick={() => setActiveTab('dochub')}
            className={`flex items-center justify-center lg:justify-start gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'dochub' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 bg-white/60 lg:bg-transparent'
            }`}
          >
            <FolderDown className="w-4 h-4 shrink-0" />
            <span className="truncate">Doc Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('billing_wallet')}
            className={`flex items-center justify-center lg:justify-start gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all text-center btn-interactive tab-interactive ${
              activeTab === 'billing_wallet' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 bg-white/60 lg:bg-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="truncate">Wallet 💳</span>
          </button>

          <button
            onClick={() => setActiveTab('hr_permissions')}
            className={`flex items-center justify-center lg:justify-start gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all text-center btn-interactive tab-interactive ${
              activeTab === 'hr_permissions' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 bg-white/60 lg:bg-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">HR Governance 🛡️</span>
          </button>

          <button
            data-tour-step="company-settings-tab"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-center lg:justify-start gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all text-center btn-interactive tab-interactive ${
              activeTab === 'settings' ? 'bg-indigo-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 bg-white/60 lg:bg-transparent'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="truncate">Settings ⚙️</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active HR Executives" 
          value={companyHrUsers.length} 
          subtext="Managing Onboarding" 
          icon={Users} 
          color="cyan" 
          onClick={() => setActiveDrilldown({
            title: 'Active HR Executives Team',
            subtitle: `Recruiting & Onboarding staff assigned to ${company.name}`,
            metricValue: `${companyHrUsers.length} HR Staff`,
            metricType: 'company_hr',
            data: companyHrUsers.map(h => ({
              name: h.name,
              email: h.email,
              dept: h.dept,
              companyName: company.name,
              status: 'Active Recruiter',
              badge: `${h.activeLinks || 0} Links Active`
            }))
          })}
        />
        <MetricCard 
          title="Verified Profiles" 
          value={verifiedCount} 
          subtext={`Out of ${companyCandidates.length} profiles`} 
          icon={CheckCircle2} 
          trend={`${Math.round((verifiedCount / (companyCandidates.length || 1)) * 100)}% Pass`}
          color="emerald" 
          onClick={() => setActiveDrilldown({
            title: 'Verified Employee Profiles Audit',
            subtitle: `Successfully verified candidates under ${company.name}`,
            metricValue: `${verifiedCount} Verified`,
            metricType: 'company_verified',
            data: companyCandidates.filter(c => c.status === 'Verified').map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: company.name,
              status: 'Verified',
              verificationDate: c.verificationDate || 'Recent',
              token: c.token
            }))
          })}
        />
        <MetricCard 
          title="In Progress / Pending" 
          value={pendingCount} 
          subtext="Awaiting Link Completion" 
          icon={Clock} 
          color="amber" 
          onClick={() => setActiveDrilldown({
            title: 'Pending & In-Progress Candidates',
            subtitle: `Candidates currently awaiting Aadhaar OTP, SMS OTP, or Face verification`,
            metricValue: `${pendingCount} Pending`,
            metricType: 'company_pending',
            data: companyCandidates.filter(c => c.status !== 'Verified').map(c => ({
              name: c.name,
              empId: c.empId,
              mobile: c.mobile,
              email: c.email,
              dept: c.designation || 'Specialist',
              companyName: company.name,
              status: c.status || 'In Progress',
              token: c.token
            }))
          })}
        />
        <MetricCard 
          tourStep="company-quota-card"
          title="Monthly Quota Usage" 
          value={`${company.verifiedCountThisMonth} / ${company.maxLimit}`} 
          subtext={`Plan: ${company.plan}`} 
          icon={FileCheck} 
          color="indigo" 
          onClick={() => setActiveDrilldown({
            title: 'Monthly Verification Quota Consumption',
            subtitle: `Detailed usage breakdown for plan ${company.plan}`,
            metricValue: `${company.verifiedCountThisMonth} / ${company.maxLimit} (${Math.round((company.verifiedCountThisMonth/company.maxLimit)*100)}%)`,
            metricType: 'company_quota',
            data: [
              { title: 'Verified Candidates this Month', amount: `${company.verifiedCountThisMonth} checks`, status: 'Consumed' },
              { title: 'Remaining Balance Quota', amount: `${company.maxLimit - company.verifiedCountThisMonth} checks`, status: 'Available' },
              { title: 'Current Billing Plan Tier', amount: `${company.plan} (₹${company.pricePerVerification}/check)`, status: 'Active Plan' }
            ]
          })}
        />
      </div>

      {/* TAB: MASTER EMPLOYEE REGISTRY */}
      {activeTab === 'registry' && (
        <div className="glass-panel p-4 sm:p-6 border-slate-200 bg-white space-y-4 rounded-2xl shadow-sm animate-tab-switch">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Employee Verification Master Registry</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Search, inspect, and download audit documents for all candidate records</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate name, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-9 text-xs"
              />
            </div>
          </div>

          {/* 💡 Point-in-Time Data Verification Notice Banner */}
          <div className="p-3 bg-amber-50/80 border border-amber-300/80 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong>Point-in-Time Truth Notice:</strong> Candidate KYC verifications reflect the authentic state in Government Repositories at the recorded timestamp.</span>
            </div>
            <button 
              onClick={() => setShowTermsModal(true)} 
              className="text-amber-900 font-bold hover:underline shrink-0 text-[11px] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Legal Disclosures & Terms 📄</span>
            </button>
          </div>

          {/* 📱 ADAPTIVE MOBILE CANDIDATE CARDS (< 640px) */}
          <div className="block sm:hidden space-y-3.5">
            {filteredCandidates.map(cand => {
              const lc = getCertificateLifecycle(cand);
              return (
                <div key={cand.id} className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-teal-500" />
                  
                  <div className="flex items-start justify-between gap-2.5 pt-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center font-black text-sm border border-sky-200 shrink-0">
                        {cand.name?.charAt(0) || 'C'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-900 text-sm truncate">{cand.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {cand.designation || 'Specialist'} • #{cand.empId || 'EMP-2026'}
                        </p>
                      </div>
                    </div>

                    <span className={`badge font-black text-[10px] shrink-0 ${
                      cand.status === 'Verified' ? 'badge-emerald' : cand.status === 'In Verification' ? 'badge-cyan' : 'badge-amber'
                    }`}>
                      {cand.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Department</span>
                      <span className="font-bold text-slate-900 text-[11px] truncate block">{cand.dept || 'Engineering'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Email Address</span>
                      <span className="font-mono text-slate-700 text-[11px] truncate block">{cand.email}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Verification Checks</span>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md border font-bold ${cand.verificationsCompleted?.aadhaar ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        Aadhaar {cand.verificationsCompleted?.aadhaar ? '✓' : '⌛'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-bold ${cand.verificationsCompleted?.mobile ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        Mobile {cand.verificationsCompleted?.mobile ? '✓' : '⌛'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-bold ${cand.verificationsCompleted?.face ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        Face {cand.verificationsCompleted?.face ? '✓' : '⌛'}
                      </span>
                    </div>
                  </div>

                  {lc.isVerified && (
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">60-Day Validity:</span>
                        <span className={lc.badgeColor}>{lc.badgeLabel}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${lc.progressPercent}%` }} 
                          className={`h-full rounded-full ${lc.isExpired || lc.status === 'critical' ? 'bg-rose-500' : lc.isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold">
                    <button 
                      onClick={() => setViewingBgvReportCandidate(cand)}
                      className="p-2 rounded-xl bg-purple-50 text-purple-950 border border-purple-200 hover:bg-purple-100 flex items-center justify-center gap-1 cursor-pointer btn-interactive text-center"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span className="truncate">360° Dossier</span>
                    </button>
                    <button 
                      onClick={() => setInspectCandidate(cand)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 flex items-center justify-center gap-1 cursor-pointer btn-interactive text-center"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">Inspect</span>
                    </button>
                    <button 
                      onClick={() => setDownloadingCandidate(cand)}
                      className="p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 flex items-center justify-center gap-1 cursor-pointer btn-interactive text-center shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Docs</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🖥️ WIDESCREEN DESKTOP TABLE (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold">
                  <th className="py-3 px-4">Employee Details</th>
                  <th className="py-3 px-4">Designation & Dept</th>
                  <th className="py-3 px-4">Aadhaar Check</th>
                  <th className="py-3 px-4">Mobile OTP</th>
                  <th className="py-3 px-4">Face Liveness</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Certificate Validity (60-Day)</th>
                  <th className="py-3 px-4 text-right">Document & Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredCandidates.map(cand => {
                  const lc = getCertificateLifecycle(cand);
                  return (
                    <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">{cand.name}</div>
                        <div className="text-slate-500 text-[11px] font-medium">{cand.email} • ID: #{cand.empId}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-900 font-semibold">{cand.designation}</div>
                        <div className="text-slate-500 text-[11px]">{cand.dept}</div>
                      </td>
                      <td className="py-4 px-4">
                        {cand.verificationsCompleted.aadhaar ? (
                          <span className="badge badge-emerald text-[10px]">Verified ✅</span>
                        ) : (
                          <span className="badge badge-amber text-[10px]">Pending ⏳</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {cand.verificationsCompleted.mobile ? (
                          <span className="badge badge-emerald text-[10px]">OTP Verified ✅</span>
                        ) : (
                          <span className="badge badge-amber text-[10px]">Pending ⏳</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {cand.verificationsCompleted.face ? (
                          <span className="badge badge-emerald text-[10px]">Matched ✅</span>
                        ) : (
                          <span className="badge badge-amber text-[10px]">Pending ⏳</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`badge ${
                          cand.status === 'Verified' ? 'badge-emerald' : cand.status === 'In Verification' ? 'badge-cyan' : 'badge-amber'
                        }`}>
                          {cand.status}
                        </span>
                      </td>

                      {/* ⏳ 60-Day Certificate Validity */}
                      <td className="py-4 px-4 text-center">
                        {lc.isVerified ? (
                          <div className="space-y-1 inline-block text-left">
                            <span className={`badge text-[9px] py-0.5 px-2 font-black ${lc.badgeColor}`}>
                              {lc.badgeLabel}
                            </span>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                style={{ width: `${lc.progressPercent}%` }} 
                                className={`h-full rounded-full ${lc.isExpired || lc.status === 'critical' ? 'bg-rose-500' : lc.isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              />
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono block">Expires: {lc.expiryDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Pending</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button 
                            onClick={() => setViewingBgvReportCandidate(cand)}
                            className="btn btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold text-purple-900 bg-purple-50 border-purple-200 hover:bg-purple-100 btn-interactive"
                            title="View 10+ Multi-API Background Verification Dossier"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                            <span>360° BGV Dossier</span>
                          </button>
                          <button 
                            onClick={() => setInspectCandidate(cand)}
                            className="btn btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold btn-interactive"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-600" />
                            <span>Inspect</span>
                          </button>
                          <button 
                            onClick={() => setDownloadingCandidate(cand)}
                            className="btn btn-company text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold btn-interactive"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Docs</span>
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

      {/* TAB: EXECUTIVE TELEMETRY & TAT */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* API Credit Ledger & Verification Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: API Credit Balance */}
            <div className="p-5 rounded-xl border border-sky-200 bg-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-sky-700">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  <span>API Credit Quota Balance</span>
                </span>
                <span className="badge badge-cyan text-[10px]">{company.plan}</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {(company.maxLimit - company.verifiedCountThisMonth).toLocaleString()} Credits Left
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-1">
                <div 
                  style={{ width: `${Math.min(Math.round((company.verifiedCountThisMonth / company.maxLimit) * 100), 100)}%` }} 
                  className="h-full bg-gradient-to-r from-sky-500 to-teal-600 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Used <strong>{company.verifiedCountThisMonth}</strong> of <strong>{company.maxLimit}</strong> monthly credits ({company.verifiedCountThisMonth * 5} API calls executed).
              </p>
            </div>

            {/* Card 2: Passed Verifications */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Passed Verifications</span>
                </span>
                <span className="badge badge-emerald text-[10px]">Verified ✅</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {verifiedCount} Verified
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Aadhaar UIDAI + Mobile OTP + AI Face Match Passed 100%.
              </p>
            </div>

            {/* Card 3: Failed / Pending Verifications */}
            <div className="p-5 rounded-xl border border-rose-200 bg-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-rose-700">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Failed / Pending Action</span>
                </span>
                <span className="badge badge-rose text-[10px]">Action Needed</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {pendingCount} Pending / Failed
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Candidates requiring link re-dispatch or manual verification.
              </p>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border-slate-200 bg-white">
              <HrPerformanceChart hrUsers={companyHrUsers} />
            </div>
            
            <div className="glass-panel p-6 border-slate-200 bg-white">
              <TatDistributionChart />
            </div>
          </div>
        </div>
      )}

      {/* TAB: HR EXECUTIVE TEAM */}
      {activeTab === 'hrteam' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                <span>HR Executive Staff Directory & Access Tiers</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">HR executives responsible for initiating candidate verification forms</p>
            </div>
            <button 
              onClick={() => setShowAddHrModal(true)}
              className="btn btn-company text-xs flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add HR Executive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companyHrUsers.map(hr => (
              <div key={hr.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-sky-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="badge badge-cyan text-[10px]">{hr.dept}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{hr.activeLinks} Active Links</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{hr.name}</h4>
                <p className="text-xs text-slate-500">{hr.email}</p>
                <div className="pt-2 flex justify-between items-center text-xs border-t border-slate-200">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active HR Account
                  </span>
                  <button 
                    onClick={() => setRoleView('hrexecutive')}
                    className="text-sky-700 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Open HR Workstation</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: COMPLIANCE DOCUMENT STORAGE MANAGEMENT SYSTEM (DMS) */}
      {activeTab === 'dochub' && (
        <DocumentStorageHub />
      )}

      {/* TAB: COMPANY ADMIN CONFIGURATION & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span>Company Governance, Verification Rules & Settings</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Configure AI face liveness match thresholds, low API credit alerts, and HR team seat limits.</p>
            </div>
            <span className="badge badge-cyan text-[10px]">Company Account Settings</span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateRoleSettings('company', systemSettings.company);
            }} 
            className="space-y-6 text-xs"
          >
            {/* 🏢 VERIFICATION MODULES & PIPELINE TOGGLES (ACTIVE CHECKS FOR EMPLOYEE LINK) */}
            <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base">
                      Verification Pipeline & Feature Modules (Company Controls)
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Enable or disable verification checks required for your candidates on their onboarding link
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const aadhaarOnly = {
                        ...(company.features || {}),
                        aadhaar: true,
                        mobileOtp: false,
                        emailGateway: false,
                        aiFaceBiometrics: false,
                        faceCapture: false,
                        pan: false,
                        bankCheck: false,
                        uan: false,
                        drivingLicense: false,
                        passport: false
                      };
                      updateCompanyFeatures(company.id, aadhaarOnly);
                    }}
                    className="btn btn-secondary text-[11px] py-1.5 px-3 font-black text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 cursor-pointer"
                  >
                    ⚡ Aadhaar Only Mode
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const allStandard = {
                        ...(company.features || {}),
                        aadhaar: true,
                        mobileOtp: true,
                        emailGateway: true,
                        aiFaceBiometrics: true,
                        faceCapture: true,
                        pan: true,
                        bankCheck: true,
                        uan: true,
                        drivingLicense: true,
                        passport: true
                      };
                      updateCompanyFeatures(company.id, allStandard);
                    }}
                    className="btn btn-secondary text-[11px] py-1.5 px-3 font-bold text-indigo-900 bg-indigo-50 border-indigo-300 hover:bg-indigo-100 cursor-pointer"
                  >
                    🌟 Enable All Modules
                  </button>
                </div>
              </div>

              {/* Module Toggle Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                
                {/* 1. Aadhaar */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.aadhaar !== false ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🪪</span>
                      <strong className="text-slate-900 font-black">Aadhaar UIDAI Live e-KYC</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">OTP & Demographics data fetching</p>
                    <span className="badge badge-emerald text-[9px] font-black">PRIMARY GOVT ID</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={company.features?.aadhaar !== false}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), aadhaar: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 2. Mobile SMS OTP */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.mobileOtp ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">📱</span>
                      <strong className="text-slate-900 font-black">Mobile SMS OTP</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Carrier SMS 6-digit OTP code</p>
                    <span className={`badge text-[9px] font-black ${company.features?.mobileOtp ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.mobileOtp ? 'ACTIVE' : 'PAUSED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.mobileOtp}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), mobileOtp: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 3. Official Email */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.emailGateway ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">📧</span>
                      <strong className="text-slate-900 font-black">Email OTP Verification</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Official inbox confirmation code</p>
                    <span className={`badge text-[9px] font-black ${company.features?.emailGateway ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.emailGateway ? 'ACTIVE' : 'PAUSED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.emailGateway}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), emailGateway: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 4. AI Live Face Biometrics */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.aiFaceBiometrics ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🤳</span>
                      <strong className="text-slate-900 font-black">AI Live Face Match</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">3D Liveness & photo match</p>
                    <span className={`badge text-[9px] font-black ${company.features?.aiFaceBiometrics ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.aiFaceBiometrics ? 'ACTIVE' : 'PAUSED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.aiFaceBiometrics}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), aiFaceBiometrics: e.target.checked, faceCapture: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 5. PAN Card */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.pan ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">💳</span>
                      <strong className="text-slate-900 font-black">PAN Card (NSDL)</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Tax ID & Aadhaar Link audit</p>
                    <span className={`badge text-[9px] font-black ${company.features?.pan ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.pan ? 'ACTIVE' : 'REMOVED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.pan}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), pan: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 6. Bank Penny Drop */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.bankCheck ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🏦</span>
                      <strong className="text-slate-900 font-black">Bank Penny Drop</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">IMPS Account Holder match</p>
                    <span className={`badge text-[9px] font-black ${company.features?.bankCheck ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.bankCheck ? 'ACTIVE' : 'REMOVED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.bankCheck}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), bankCheck: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 7. EPFO UAN */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.uan ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🏢</span>
                      <strong className="text-slate-900 font-black">EPFO UAN Dual Employment</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Service history & passbook</p>
                    <span className={`badge text-[9px] font-black ${company.features?.uan ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.uan ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.uan}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), uan: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 8. Driving License */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.drivingLicense ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🚗</span>
                      <strong className="text-slate-900 font-black">Driving License (MoRTH)</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Sarathi DL status verification</p>
                    <span className={`badge text-[9px] font-black ${company.features?.drivingLicense ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.drivingLicense ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.drivingLicense}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), drivingLicense: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 9. Passport */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.passport ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🛂</span>
                      <strong className="text-slate-900 font-black">MEA Passport Direct</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Ministry of External Affairs check</p>
                    <span className={`badge text-[9px] font-black ${company.features?.passport ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.passport ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.passport}
                    onChange={(e) => updateCompanyFeatures(company.id, { ...(company.features || {}), passport: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* ⚡ MASTER API ROUTING ENGINE SELECTOR (SERVER 1 SANDBOX vs SERVER 2 COINCIRCLE) */}
            <div className="p-6 rounded-2xl border-2 border-teal-300 bg-gradient-to-br from-teal-50/80 via-white to-sky-50/80 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-600 text-white shadow-sm">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">Upstream Verification Server Routing Engine</h4>
                    <p className="text-slate-500 text-[11px]">Select your company's upstream data fetching engine between Server 1 (Sandbox) and Server 2 (CoinCircleTrust)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="badge badge-emerald text-[10px] font-bold">
                    Active: {company.apiRoutingEngine === 'server1' ? 'Server 1 Only' : company.apiRoutingEngine === 'server2' ? 'Server 2 Only' : 'Smart Hybrid ⚡'}
                  </span>
                </div>
              </div>

              {/* Engine Selector Radio Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* 1. Smart Hybrid Engine (Recommended) */}
                <div 
                  onClick={() => updateCompanyRoutingEngine(company.id, 'hybrid')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                    (company.apiRoutingEngine || 'hybrid') === 'hybrid'
                      ? 'border-teal-600 bg-white shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:border-teal-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-emerald text-[9px] font-black">RECOMMENDED</span>
                      <input 
                        type="radio" 
                        name="routingEngine"
                        checked={(company.apiRoutingEngine || 'hybrid') === 'hybrid'}
                        onChange={() => updateCompanyRoutingEngine(company.id, 'hybrid')}
                        className="text-teal-600"
                      />
                    </div>
                    <strong className="text-slate-900 font-black text-xs block">⚡ Smart Hybrid Engine</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Routes standard IDs via <strong>Server 1 (Sandbox)</strong>. Automatically routes non-Sandbox checks (<strong>Passport, EPFO UAN V3, Court Records, Moonlighting Directorship</strong>) via <strong>Server 2 (CoinCircleTrust)</strong>.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-teal-800">
                    <span>Zero Missing Doc Fallbacks</span>
                    <span>100% Coverage</span>
                  </div>
                </div>

                {/* 2. Server 1 Only (Sandbox API) */}
                <div 
                  onClick={() => updateCompanyRoutingEngine(company.id, 'server1')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    company.apiRoutingEngine === 'server1'
                      ? 'border-indigo-600 bg-white shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-indigo text-[9px] font-black">SERVER 1</span>
                      <input 
                        type="radio" 
                        name="routingEngine"
                        checked={company.apiRoutingEngine === 'server1'}
                        onChange={() => updateCompanyRoutingEngine(company.id, 'server1')}
                        className="text-indigo-600"
                      />
                    </div>
                    <strong className="text-slate-900 font-black text-xs block">🌐 Server 1: Sandbox API Router</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Exclusively queries Sandbox API (<code className="font-mono text-[10px]">api.sandbox.co.in</code>). Fast standard checks for Aadhaar, PAN, Bank IMPS, and Driving License.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Latency: ~48ms</span>
                    <span>Cost: ₹2.50/call</span>
                  </div>
                </div>

                {/* 3. Server 2 Only (CoinCircleTrust 47+ APIs) */}
                <div 
                  onClick={() => updateCompanyRoutingEngine(company.id, 'server2')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    company.apiRoutingEngine === 'server2'
                      ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:border-purple-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-purple text-[9px] font-black">SERVER 2 (47+ APIs)</span>
                      <input 
                        type="radio" 
                        name="routingEngine"
                        checked={company.apiRoutingEngine === 'server2'}
                        onChange={() => updateCompanyRoutingEngine(company.id, 'server2')}
                        className="text-purple-600"
                      />
                    </div>
                    <strong className="text-slate-900 font-black text-xs block">🛡️ Server 2: CoinCircleTrust</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Exclusively queries CoinCircleTrust (<code className="font-mono text-[10px]">api.coincircletrust.com</code>). Full institutional BGV, Passport, Court eCourts, Dual Employment, and 3D Biometrics.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-purple-700 font-bold">
                    <span>47 Enterprise APIs</span>
                    <span>Cost: ₹4.00/call</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Verification Rules & AI Thresholds */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verification Rules & AI Thresholds</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">AI WebCam Face Match Confidence Threshold (%)</label>
                  <input 
                    type="number" 
                    min="50"
                    max="100"
                    value={systemSettings.company?.faceMatchThreshold || 85}
                    onChange={(e) => updateRoleSettings('company', { faceMatchThreshold: parseInt(e.target.value) || 85 })}
                    className="form-input text-xs font-mono font-bold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Minimum AI confidence score required for biometrics verification pass.</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mandatory Aadhaar UIDAI OTP Requirement</label>
                  <select 
                    value={systemSettings.company?.mandatoryAadhaarOtp ? 'true' : 'false'}
                    onChange={(e) => updateRoleSettings('company', { mandatoryAadhaarOtp: e.target.value === 'true' })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="true">Enforced 🟢 (Mandhaar OTP verification required)</option>
                    <option value="false">Optional 🟡 (Allow skip if DL/PAN present)</option>
                  </select>
                </div>
              </div>

              {/* Card 2: API Quota Alerts & HR Team Governance */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Credit Quota Alerts & HR Seats</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Low API Credit Alert Trigger Limit</label>
                  <input 
                    type="number" 
                    value={systemSettings.company?.lowCreditAlertThreshold || 50}
                    onChange={(e) => updateRoleSettings('company', { lowCreditAlertThreshold: parseInt(e.target.value) || 50 })}
                    className="form-input text-xs font-mono font-bold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Triggers warning toast when remaining credits drop below this value.</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max HR Executive Workstation Seats Limit</label>
                  <input 
                    type="number" 
                    value={systemSettings.company?.maxHrSeats || 10}
                    onChange={(e) => updateRoleSettings('company', { maxHrSeats: parseInt(e.target.value) || 10 })}
                    className="form-input text-xs font-mono font-bold"
                  />
                </div>
              </div>

            </div>

            {/* Card 3: HR Executive Operational Guidelines Editor */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Edit HR Executive Operational Guidelines & Onboarding Policy (Shown to HR Team)</span>
                </h4>
                <span className="badge badge-emerald text-[10px]">Company Admin Editable</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">HR Manual Header Title</label>
                  <input 
                    type="text" 
                    value={platformGuidelines.hr?.title || ''}
                    onChange={(e) => updateGuidelines('hr', { title: e.target.value })}
                    className="form-input text-xs font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">HR Onboarding Policy Summary</label>
                  <textarea 
                    rows={2}
                    value={platformGuidelines.hr?.summary || ''}
                    onChange={(e) => updateGuidelines('hr', { summary: e.target.value })}
                    className="form-input text-xs bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Step 1 Instruction</label>
                    <textarea 
                      rows={3}
                      value={platformGuidelines.hr?.step1 || ''}
                      onChange={(e) => updateGuidelines('hr', { step1: e.target.value })}
                      className="form-input text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Step 2 Instruction</label>
                    <textarea 
                      rows={3}
                      value={platformGuidelines.hr?.step2 || ''}
                      onChange={(e) => updateGuidelines('hr', { step2: e.target.value })}
                      className="form-input text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Step 3 Instruction</label>
                    <textarea 
                      rows={3}
                      value={platformGuidelines.hr?.step3 || ''}
                      onChange={(e) => updateGuidelines('hr', { step3: e.target.value })}
                      className="form-input text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: 📜 Enterprise Legal Compliance & Point-in-Time Agreement Status */}
            <div className="p-5 rounded-xl border-2 border-indigo-200 bg-indigo-50/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-700" />
                  <h4 className="font-extrabold text-slate-900 text-sm">Enterprise Terms of Service & DPDP Compliance Agreement</h4>
                </div>
                <span className="badge badge-purple text-[10px]">Active & Legally Bound (v2.4-2026) 🟢</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Bound Client Entity</span>
                  <span className="font-black text-slate-900">{company.name}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Authorized Signatory</span>
                  <span className="font-bold text-slate-900">{company.contactPerson} ({company.email})</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Point-in-Time Verification Truth</span>
                  <span className="font-bold text-emerald-800">ISO 27001 & DPDP 2023 Compliant</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-600 font-medium">
                  Includes the Point-in-Time Data Verification Mechanism, DPDP Act 2023 Candidate Consent Gate, and SLA commitments.
                </p>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="btn btn-superadmin text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold shadow-sm shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Legal Agreement 📄</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="btn btn-company text-xs flex items-center gap-2 font-bold shadow-md">
                <Save className="w-4 h-4" />
                <span>Save Company Settings & HR Guidelines</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: BILLING & RAZORPAY VERIFICATION WALLET */}
      {activeTab === 'billing_wallet' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Wallet Hero Banner */}
          <div className="glass-panel p-6 border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 rounded-3xl space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-purple text-xs font-black">B2B VERIFICATION WALLET</span>
                  <span className="text-xs text-slate-500 font-bold">• {company.name}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <span>Prepaid Verification Credits & Razorpay Gateway</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Recharge your BGV verification wallet instantly via UPI, Corporate Cards, NetBanking, or send a Razorpay payment link to your accounts department.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowRazorpayModal(true)}
                  className="btn btn-superadmin text-xs py-2.5 px-5 flex items-center gap-2 font-black shadow-lg cursor-pointer hover:scale-102 transition-all"
                >
                  <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>Recharge Wallet (Razorpay) ⚡</span>
                </button>
              </div>
            </div>

            {/* Live Wallet & Quota Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border-2 border-indigo-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Live Wallet Balance</span>
                <div className="text-2xl font-black text-indigo-700">
                  ₹{(company.walletBalance || 0).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active & Ready for Verifications
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Available Verification Quota</span>
                <div className="text-2xl font-black text-emerald-700">
                  ~{Math.floor((company.walletBalance || 0) / (company.pricePerVerification || 120))} Candidate Checks
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Based on current plan rate (₹{company.pricePerVerification || 120}/check)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-purple-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Billing Plan Tier</span>
                <div className="text-xl font-black text-purple-900 mt-1">
                  {company.plan || 'Enterprise Premier'}
                </div>
                <span className="badge badge-purple text-[9px] font-bold">18% GST Tax Invoices Included</span>
              </div>
            </div>
          </div>

          {/* Quick Payment Options & Virtual Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shareable Razorpay Payment Link Card */}
            <div className="glass-panel p-5 border-slate-200 bg-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                  <span>Shareable Razorpay Payment Link</span>
                </div>
                <span className="badge badge-indigo text-[9px]">Finance Team Ready</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Need your finance/accounts department to pay? Generate an encrypted Razorpay link that they can pay via corporate card or corporate banking.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowRazorpayModal(true)}
                  className="btn btn-secondary text-xs py-2 px-4 flex-1 flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                >
                  <SendHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Generate Custom Payment Link 🔗</span>
                </button>
              </div>
            </div>

            {/* Dedicated NEFT / RTGS Virtual Account */}
            <div className="glass-panel p-5 border-slate-200 bg-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>Dedicated B2B Virtual Bank Account</span>
                </div>
                <span className="badge badge-cyan text-[9px]">Auto-Reconcile</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Virtual Account:</span>
                  <span className="font-extrabold text-indigo-700">JOYCORP{company.code || 'ACME'}8821</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">IFSC Code:</span>
                  <span className="font-bold text-slate-900">ICIC0000104 (ICICI Bank)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recharge & Transaction History Table */}
          <div className="glass-panel p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  <span>Recharge History & GST Tax Invoices Ledger</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">All historical wallet recharges, Razorpay transaction IDs, and official GST tax invoices.</p>
              </div>
              <span className="badge badge-emerald text-[9px] font-bold">100% Tax Compliant</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                    <th className="py-2.5 px-3">Transaction Ref</th>
                    <th className="py-2.5 px-3">Razorpay Payment ID</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Base Recharge</th>
                    <th className="py-2.5 px-3">GST (18%)</th>
                    <th className="py-2.5 px-3">Total Paid</th>
                    <th className="py-2.5 px-3">Credits Added</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {(company.rechargeTransactions || []).map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{tx.id}</td>
                      <td className="py-3 px-3 font-mono text-indigo-700 font-bold">{tx.paymentId}</td>
                      <td className="py-3 px-3 text-slate-500">{tx.date}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{(tx.baseAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">₹{(tx.gstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-mono font-black text-emerald-700">₹{(tx.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-bold text-indigo-700">+{tx.creditsAdded} Checks</td>
                      <td className="py-3 px-3 text-slate-600">{tx.method}</td>
                      <td className="py-3 px-3">
                        <span className="badge badge-emerald text-[9px] font-bold">{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB: HR GOVERNANCE & FEATURE CONTROLS */}
      {activeTab === 'hr_permissions' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm animate-tab-switch">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-purple text-[10px]">Company Admin HR Policy Matrix</span>
                <span className="text-xs text-slate-500 font-bold">• Enterprise Governance Controls</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                HR Staff Feature Permissions & Verification Policies
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Configure allowed communication channels, candidate ingestion methods, and mandatory compliance gates for HR staff.
              </p>
            </div>

            <button
              onClick={() => {
                const fullPermissions = {
                  allowProfileCreation: true,
                  allowBulkExcelUpload: true,
                  allowWhatsAppDispatch: true,
                  allowEmailDispatch: true,
                  allowSmsDispatch: true,
                  requireOriginalDocumentVault: true,
                  requireAiFaceBiometrics: true,
                  allow360DossierExport: true,
                  allowCertificateGeneration: true
                };
                updateCompanyHrPermissions(company.id, fullPermissions);
              }}
              className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold cursor-pointer btn-interactive self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Enable All HR Features</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Category 1: Candidate Profiling & Ingestion */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-extrabold text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Users className="w-4 h-4" />
                <span>1. Candidate Profiling & Ingestion Rights</span>
              </h4>

              <div className="space-y-2.5">
                {[
                  { id: 'allowProfileCreation', title: 'Single Profile Creation', desc: 'Allow HR to manually add new candidate profiles' },
                  { id: 'allowBulkExcelUpload', title: 'Bulk Excel (.xlsx / .csv) Ingestion', desc: 'Allow HR to batch upload multiple candidates via spreadsheet' }
                ].map(item => {
                  const isChecked = company.hrPermissions?.[item.id] ?? true;
                  return (
                    <label key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-300 transition-all btn-interactive">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => updateCompanyHrPermissions(company.id, { [item.id]: e.target.checked })}
                        className="accent-indigo-600 w-4 h-4 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category 2: Communication Channels Dispatch Rights */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-extrabold text-xs text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <MessageSquare className="w-4 h-4" />
                <span>2. Candidate Communication Dispatch Channels</span>
              </h4>

              <div className="space-y-2.5">
                {[
                  { id: 'allowWhatsAppDispatch', title: 'WhatsApp Cloud API Dispatch 💬', desc: 'Allow HR to send magic verification links via WhatsApp' },
                  { id: 'allowEmailDispatch', title: 'Email Magic Link & OTP Dispatch 📧', desc: 'Allow HR to send automated invitation emails & OTP codes' },
                  { id: 'allowSmsDispatch', title: 'Carrier SMS Notification Dispatch 📱', desc: 'Allow HR to send direct SMS OTP and notification alerts' }
                ].map(item => {
                  const isChecked = company.hrPermissions?.[item.id] ?? true;
                  return (
                    <label key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-300 transition-all btn-interactive">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => updateCompanyHrPermissions(company.id, { [item.id]: e.target.checked })}
                        className="accent-emerald-600 w-4 h-4 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category 3: Mandatory Candidate Evidence Policies */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-extrabold text-xs text-purple-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Mandatory Candidate Verification Policies</span>
              </h4>

              <div className="space-y-2.5">
                {[
                  { id: 'requireOriginalDocumentVault', title: 'Enforce Original Document Evidence (8 Files) 📁', desc: 'Candidates must upload original PAN, Aadhaar, Degree & Bank files' },
                  { id: 'requireAiFaceBiometrics', title: 'Enforce AI 3-Pose Face Biometric Match 👤', desc: 'Candidates must pass 3D live webcam liveness verification' }
                ].map(item => {
                  const isChecked = company.hrPermissions?.[item.id] ?? true;
                  return (
                    <label key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-purple-300 transition-all btn-interactive">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => updateCompanyHrPermissions(company.id, { [item.id]: e.target.checked })}
                        className="accent-purple-600 w-4 h-4 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category 4: Report Export & Compliance Authority */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-extrabold text-xs text-sky-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <FileCheck className="w-4 h-4" />
                <span>4. Report Export & Certification Authority</span>
              </h4>

              <div className="space-y-2.5">
                {[
                  { id: 'allow360DossierExport', title: '360° Multi-API PDF Dossier Export 📄', desc: 'Allow HR to generate & export full candidate 360° dossiers' },
                  { id: 'allowCertificateGeneration', title: 'ISO 27001 Official Certificate Generation 🎖️', desc: 'Allow HR to issue official digital verification certificates' }
                ].map(item => {
                  const isChecked = company.hrPermissions?.[item.id] ?? true;
                  return (
                    <label key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-sky-300 transition-all btn-interactive">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => updateCompanyHrPermissions(company.id, { [item.id]: e.target.checked })}
                        className="accent-sky-600 w-4 h-4 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 flex items-center justify-between">
            <span className="font-bold">🔒 Changes apply instantly to all HR staff accounts under {company.name}</span>
            <span className="badge badge-indigo text-[9px] font-mono">Real-time Policy Enforcement</span>
          </div>
        </div>
      )}

      {/* Document Downloader Modal */}
      {downloadingCandidate && (
        <DocumentDownloader 
          candidate={downloadingCandidate} 
          onClose={() => setDownloadingCandidate(null)} 
        />
      )}

      {/* Inspect Candidate Modal */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-6 space-y-6 border-slate-200 bg-white text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="badge badge-emerald text-[10px] mb-1">Verification Audit Report</span>
                <h3 className="text-xl font-extrabold text-slate-900">{inspectCandidate.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">{inspectCandidate.designation} • Emp ID: {inspectCandidate.empId}</p>
              </div>
              <button onClick={() => setInspectCandidate(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-semibold">Aadhaar Number:</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{inspectCandidate.aadhaarNo}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Registered Mobile:</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{inspectCandidate.mobile}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button onClick={() => setInspectCandidate(null)} className="btn btn-secondary text-xs font-bold">Close View</button>
            </div>
          </div>
        </div>
      )}

      {/* Add HR Modal */}
      {showAddHrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-sky-600" />
                <span>Create HR Executive Account</span>
              </h3>
              <button onClick={() => setShowAddHrModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddHrSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">HR Executive Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Priya Sundaram"
                  value={newHr.name}
                  onChange={(e) => setNewHr({ ...newHr, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                <input 
                  type="email"
                  required
                  placeholder="priya@company.com"
                  value={newHr.email}
                  onChange={(e) => setNewHr({ ...newHr, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddHrModal(false)} className="btn btn-secondary text-xs font-bold">Cancel</button>
                <button type="submit" className="btn btn-company text-xs">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Payment & Settlement Modal */}
      {showPaymentModal && (
        <PaymentModal 
          company={company} 
          onClose={() => setShowPaymentModal(false)} 
        />
      )}

      {/* WhatsApp & SMTP Email Gateways Modal */}
      {showGatewaysModal && (
        <CommunicationGatewaysModal 
          onClose={() => setShowGatewaysModal(false)} 
        />
      )}

      {/* 📜 Terms & Privacy Policy Modal */}
      {showTermsModal && (
        <TermsAndPrivacyPolicyModal
          isOpen={showTermsModal}
          companyName={company?.name || 'Enterprise Employer'}
          onClose={() => setShowTermsModal(false)}
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
          role="company"
          data={activeDrilldown.data}
          onViewCandidateDossier={(cand) => setViewingDossierCandidate(cand)}
          onViewCandidateCertificate={(cand) => setViewingCertificateCandidate(cand)}
        />
      )}

      {/* Candidate Dossier & Certificate Modals */}
      {viewingDossierCandidate && (
        <EmployeeProfileDossierModal
          candidate={viewingDossierCandidate}
          onClose={() => setViewingDossierCandidate(null)}
        />
      )}

      {viewingCertificateCandidate && (
        <OfficialVerificationCertificateModal
          candidate={viewingCertificateCandidate}
          onClose={() => setViewingCertificateCandidate(null)}
        />
      )}

      {/* 360° Multi-API Comprehensive Background Verification Dossier Modal */}
      {viewingBgvReportCandidate && (
        <ComprehensiveBgvReportModal
          candidate={viewingBgvReportCandidate}
          companyName={company?.name || "Acme Global Technologies"}
          hrName="Authorized Company Officer"
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
        initialRole="company"
        scopedCompanyId={company?.id}
      />

      {/* ⚡ Razorpay Verification Wallet Recharge Modal */}
      <RazorpayPaymentModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        targetCompanyId={company?.id}
      />

    </div>
  );
};
