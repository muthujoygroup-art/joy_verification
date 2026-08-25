import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { HrPerformanceChart, TatDistributionChart } from '../components/StatsCharts';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { DocumentStorageHub } from '../components/DocumentStorageHub';
import { PaymentModal } from '../components/PaymentModal';
import { CommunicationGatewaysModal } from '../components/CommunicationGatewaysModal';
import { TermsAndPrivacyPolicyModal } from '../components/TermsAndPrivacyPolicyModal';
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
  Lock
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
    getCertificateLifecycle 
  } = useApp();
  const [selectedCompanyId, setSelectedCompanyId] = useState('comp-1');
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'registry' | 'hrteam' | 'dochub'
  const [showAddHrModal, setShowAddHrModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGatewaysModal, setShowGatewaysModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [inspectCandidate, setInspectCandidate] = useState(null);
  const [downloadingCandidate, setDownloadingCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'telemetry' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Telemetry & TAT</span>
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'registry' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Master Employee Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('hrteam')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'hrteam' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>HR Executive Team</span>
          </button>

          <button
            onClick={() => setActiveTab('dochub')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'dochub' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderDown className="w-4 h-4" />
            <span>Compliance Document Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-indigo-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Company Settings ⚙️</span>
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
        />
        <MetricCard 
          title="Verified Profiles" 
          value={verifiedCount} 
          subtext={`Out of ${companyCandidates.length} profiles`} 
          icon={CheckCircle2} 
          trend={`${Math.round((verifiedCount / (companyCandidates.length || 1)) * 100)}% Pass`}
          color="emerald" 
        />
        <MetricCard 
          title="In Progress / Pending" 
          value={pendingCount} 
          subtext="Awaiting Link Completion" 
          icon={Clock} 
          color="amber" 
        />
        <MetricCard 
          title="Monthly Quota Usage" 
          value={`${company.verifiedCountThisMonth} / ${company.maxLimit}`} 
          subtext={`Plan: ${company.plan}`} 
          icon={FileCheck} 
          color="indigo" 
        />
      </div>

      {/* TAB: MASTER EMPLOYEE REGISTRY */}
      {activeTab === 'registry' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-4">
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
              className="text-amber-900 font-bold hover:underline shrink-0 text-[11px] flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Legal Disclosures & Terms 📄</span>
            </button>
          </div>

          <div className="overflow-x-auto">
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
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setInspectCandidate(cand)}
                            className="btn btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-600" />
                            <span>Inspect</span>
                          </button>
                          <button 
                            onClick={() => setDownloadingCandidate(cand)}
                            className="btn btn-company text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold"
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

    </div>
  );
};
