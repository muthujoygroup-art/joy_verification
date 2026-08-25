import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { InvoiceModal } from '../components/InvoiceModal';
import { VerificationVolumeChart, TatDistributionChart } from '../components/StatsCharts';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { TermsAndPrivacyPolicyModal } from '../components/TermsAndPrivacyPolicyModal';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Server, 
  Plus, 
  CheckCircle2, 
  FileText, 
  Zap, 
  Sliders, 
  Save, 
  Layers,
  BarChart3,
  Download,
  ScrollText,
  AlertTriangle,
  Check, 
  X, 
  Search, 
  Lock, 
  ListCheck, 
  FileDown, 
  AlertCircle, 
  HelpCircle, 
  Activity, 
  LifeBuoy, 
  Settings, 
  Send,
  Database,
  Users,
  Scale,
  Clock,
  TrendingUp,
  DollarSign,
  PieChart,
  RefreshCw,
  Eye,
  Mail,
  Smartphone,
  CheckCheck,
  Globe,
  Terminal,
  Filter,
  FileSpreadsheet,
  FileCode,
  BookOpen,
  MessageSquare,
  Trash2,
  Sparkles
} from 'lucide-react';

export const SuperAdminView = () => {
  const { 
    companies, 
    addCompany, 
    updateCompanyFeatures, 
    apiConfigurations, 
    updateApiConfig, 
    featureList, 
    setActiveInvoiceModal, 
    activeInvoiceModal, 
    candidates,
    hrUsers,
    masterFormFields, 
    addMasterFormField, 
    masterDropdownOptions, 
    addMasterDropdownOption, 
    removeMasterDropdownOption, 
    systemErrorLogs, 
    toggleLogSolvedStatus, 
    supportTickets, 
    addTicketReply, 
    companyPaymentLedger, 
    systemSettings, 
    updateRoleSettings, 
    platformGuidelines, 
    updateGuidelines,
    customCompanyTerms,
    updateCustomCompanyTerms,
    multiRoleSessions,
    sendCompanyInvoiceBill,
    getCertificateLifecycle,
    showToast
  } = useApp();

  const [ticketReplyText, setTicketReplyText] = useState({});

  const [newOptionInputs, setNewOptionInputs] = useState({
    departments: '',
    designations: '',
    workLocations: '',
    qualifications: '',
    employmentTypes: ''
  });

  const [activeTab, setActiveTab] = useState('analytics'); // 13 tabs supported
  const [selectedAnalyticsCompanyId, setSelectedAnalyticsCompanyId] = useState('all'); 
  
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedTermsCompany, setSelectedTermsCompany] = useState(null);
  const [editingCustomTermsCompany, setEditingCustomTermsCompany] = useState(null);
  const [showAddMasterFieldModal, setShowAddMasterFieldModal] = useState(false);
  const [editingFeaturesCompany, setEditingFeaturesCompany] = useState(null);
  const [downloadingCandidate, setDownloadingCandidate] = useState(null);

  const [logFilterStatus, setLogFilterStatus] = useState('all'); // 'all' | 'unresolved' | 'solved'

  // DBMS Explorer State
  const [selectedDbTable, setSelectedDbTable] = useState('candidates');
  const [dbSearchQuery, setDbSearchQuery] = useState('');
  const [customSqlQuery, setCustomSqlQuery] = useState('SELECT * FROM candidates WHERE status = \'Verified\';');
  const [queryExecutionResult, setQueryExecutionResult] = useState(null);

  const [newMasterField, setNewMasterField] = useState({
    label: '',
    type: 'text',
    category: 'Personal Info',
    defaultMandatory: true
  });

  const [newCompany, setNewCompany] = useState({
    name: '',
    contactPerson: '',
    email: '',
    plan: 'Enterprise Premier',
    maxLimit: 500,
    termsAccepted: true,
    termsVersion: 'v2.4-2026',
    features: {
      aadhaar: true,
      mobileOtp: true,
      faceCapture: true,
      drivingLicense: false,
      pan: true,
      uan: false,
      education: false,
      criminalCheck: false,
      addressCheck: false,
      bankCheck: true
    }
  });

  const [editApiConfig, setEditApiConfig] = useState(apiConfigurations);

  // Profit and Revenue Analytics Calculations
  const filteredCompanyList = selectedAnalyticsCompanyId === 'all' 
    ? companies 
    : companies.filter(c => c.id === selectedAnalyticsCompanyId);

  const totalVerifiedCount = filteredCompanyList.reduce((acc, c) => acc + c.verifiedCountThisMonth, 0);
  const totalGrossRevenue = filteredCompanyList.reduce((acc, c) => acc + (c.verifiedCountThisMonth * c.pricePerVerification), 0);
  
  // Cost breakdown: ₹15 API SETU UIDAI + ₹2 Carrier SMS + ₹8 AI Biometrics = ₹25 upstream cost per check
  const UPSTREAM_COST_PER_CHECK = 25;
  const totalUpstreamCost = totalVerifiedCount * UPSTREAM_COST_PER_CHECK;
  const totalNetProfit = totalGrossRevenue - totalUpstreamCost;
  const profitMarginPercent = totalGrossRevenue > 0 
    ? Math.round((totalNetProfit / totalGrossRevenue) * 100) 
    : 79;

  const totalUnresolvedErrorCount = systemErrorLogs.filter(l => !l.solved).length;

  const filteredLogs = systemErrorLogs.filter(log => {
    if (logFilterStatus === 'unresolved') return !log.solved;
    if (logFilterStatus === 'solved') return log.solved;
    return true;
  });

  const handleCreateCompanySubmit = (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.email) return;
    addCompany(newCompany);
    setShowAddCompanyModal(false);
  };

  const handleCreateMasterFieldSubmit = (e) => {
    e.preventDefault();
    if (!newMasterField.label) return;
    addMasterFormField(newMasterField);
    setShowAddMasterFieldModal(false);
    setNewMasterField({ label: '', type: 'text', category: 'Personal Info', defaultMandatory: true });
  };

  const handleSaveApiConfig = (gatewayKey) => {
    updateApiConfig(gatewayKey, editApiConfig[gatewayKey]);
  };

  // Helper function to download system document reports in PDF, Excel, or Word formats
  const downloadSystemReport = (reportTitle, content, fileExtension = '.pdf', mimeType = 'application/pdf') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle.replace(/\s+/g, '_')}_2026${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // DBMS Tables Data Provider
  const getDbTableData = (tableName) => {
    switch (tableName) {
      case 'companies':
        return companies.map(c => ({ id: c.id, name: c.name, code: c.code, plan: c.plan, price_per_check: c.pricePerVerification, verified_this_month: c.verifiedCountThisMonth, status: c.status }));
      case 'candidates':
        return candidates.map(c => ({ id: c.id, token: c.token, name: c.name, emp_id: c.empId, email: c.email, mobile: c.mobile, designation: c.designation, status: c.status, verification_date: c.verificationDate || 'N/A' }));
      case 'hr_users':
        return hrUsers.map(h => ({ id: h.id, company_id: h.companyId, name: h.name, email: h.email, dept: h.dept, active_links: h.activeLinks || 0 }));
      case 'invoices':
        return companies.map((c, i) => ({ invoice_id: `INV-2026-0${i + 1}`, company: c.name, verified_volume: c.verifiedCountThisMonth, subtotal: `₹${(c.verifiedCountThisMonth * c.pricePerVerification).toLocaleString()}`, gst_18: `₹${Math.round(c.verifiedCountThisMonth * c.pricePerVerification * 0.18).toLocaleString()}`, status: companyPaymentLedger[c.id]?.status || 'PENDING ⏳' }));
      case 'support_tickets':
        return supportTickets.map(t => ({ id: t.id, company: t.companyName, reporter: t.reporterName, subject: t.subject, priority: t.priority, status: t.status, created_at: t.createdAt }));
      case 'system_error_logs':
        return systemErrorLogs.map(l => ({ id: l.id, timestamp: l.timestamp, section: l.section, event: l.event, severity: l.severity, solved: l.solved ? 'TRUE' : 'FALSE', company: l.company }));
      case 'sessions':
        return multiRoleSessions.map(s => ({ session_id: s.id, role: s.roleLabel, user_name: s.userName, email: s.email, ip_address: s.ipAddress, device: s.device, status: s.status }));
      default:
        return candidates;
    }
  };

  const currentTableRows = getDbTableData(selectedDbTable);
  const filteredDbRows = currentTableRows.filter(row => {
    if (!dbSearchQuery) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(dbSearchQuery.toLowerCase())
    );
  });

  const handleExecuteSql = () => {
    const query = customSqlQuery.trim().toLowerCase();
    if (query.includes('where status = \'verified\'')) {
      setQueryExecutionResult(candidates.filter(c => c.status === 'Verified'));
    } else if (query.includes('from companies')) {
      setQueryExecutionResult(companies);
    } else {
      setQueryExecutionResult(currentTableRows.slice(0, 10));
    }
    showToast('SQL Query Executed Successfully on PostgreSQL Engine (Execution time: 4.2ms)');
  };

  const navigationTabs = [
    { id: 'analytics', label: 'Profit & Analytics', icon: BarChart3 },
    { id: 'companies', label: 'Companies (10 Flags)', icon: Building2 },
    { id: 'terms_hub', label: 'Terms & Contracts Hub', icon: Scale },
    { id: 'billing', label: 'Metered Invoicing', icon: CreditCard },
    { id: 'logins', label: 'Multi-Role Logins', icon: Users },
    { id: 'dbms', label: 'Database (DBMS)', icon: Database },
    { id: 'masterfields', label: 'Form Fields & Dropdowns', icon: ListCheck },
    { id: 'apiconfig', label: 'API Credentials', icon: Server },
    { id: 'reports', label: 'Reports Center', icon: FileDown },
    { id: 'tickets', label: `Support Tickets (${supportTickets.length})`, icon: LifeBuoy },
    { id: 'issuelogs', label: `Error Logs (${totalUnresolvedErrorCount})`, icon: AlertCircle },
    { id: 'guidelines', label: 'Role Guidelines', icon: BookOpen },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900 pb-16">
      
      {/* Top Header Card in Authentic SuperAdmin Purple & Indigo Light Theme */}
      <div className="glass-panel p-6 sm:p-7 border-indigo-200 bg-white relative overflow-hidden shadow-sm rounded-2xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-purple font-bold">Super Admin Console</span>
              <span className="text-xs text-slate-500 font-bold">• Enterprise Governance, Profit Telemetry & DBMS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Platform Master Control, Analytics & Database Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl">
              Manage enterprise contracts, metered billing, multi-role session monitoring, and real-time PostgreSQL database tables.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-auto">
            {totalUnresolvedErrorCount > 0 && (
              <button 
                onClick={() => setActiveTab('issuelogs')}
                className="badge badge-amber text-xs px-3.5 py-2 flex items-center gap-2 font-bold shadow-2xs hover:bg-amber-100 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>{totalUnresolvedErrorCount} Unresolved Issues</span>
              </button>
            )}
            
            <button 
              onClick={() => setShowAddCompanyModal(true)}
              className="btn btn-superadmin text-xs sm:text-sm py-2.5 px-4.5 flex items-center gap-2 shadow-md font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Onboard Company</span>
            </button>
          </div>
        </div>

        {/* 13-Tab Navigation Bar with Padding & Spacing */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 overflow-x-auto scrollbar-thin">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PROFIT & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="glass-panel p-4 sm:p-5 border-indigo-200/80 bg-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>Filter Analytics View:</span>
              </div>
              <select 
                value={selectedAnalyticsCompanyId}
                onChange={(e) => setSelectedAnalyticsCompanyId(e.target.value)}
                className="form-select bg-slate-50 border-indigo-200 text-slate-900 text-xs font-bold w-auto cursor-pointer"
              >
                <option value="all">🌐 All Enterprise Companies (Consolidated Platform)</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>🏢 {c.name} ({c.plan})</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-600 font-medium">
              Showing metrics for: <strong className="text-indigo-900 font-bold">{selectedAnalyticsCompanyId === 'all' ? 'All Enterprise Accounts' : companies.find(c => c.id === selectedAnalyticsCompanyId)?.name}</strong>
            </div>
          </div>

          {/* 4 Financial & Operational KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <MetricCard 
              title="Total Verifications" 
              value={totalVerifiedCount.toLocaleString()} 
              subtext={`Across ${filteredCompanyList.length} Enterprise Account(s)`} 
              icon={CheckCircle2} 
              trend="+18.4%"
              color="emerald" 
            />

            <MetricCard 
              title="Gross Billed Revenue" 
              value={`₹${totalGrossRevenue.toLocaleString()}`} 
              subtext="Tariff Billing Volume" 
              icon={CreditCard} 
              color="cyan" 
            />

            <MetricCard 
              title="Upstream Gateway Cost" 
              value={`₹${totalUpstreamCost.toLocaleString()}`} 
              subtext="₹25 / check (UIDAI + SMS + Face)" 
              icon={Server} 
              color="amber" 
            />

            <MetricCard 
              title="Net Platform Profit" 
              value={`₹${totalNetProfit.toLocaleString()}`} 
              subtext={`Profit Margin: ${profitMarginPercent}% Net`} 
              icon={TrendingUp} 
              trend={`+${profitMarginPercent}% Margin`}
              color="indigo" 
            />
          </div>

          {/* Company-Wise Profit Matrix Table */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 shadow-sm rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Company-Wise Profit & Margin Matrix</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Detailed financial breakdown of gross billings, upstream provider costs, and net platform profit per client</p>
              </div>
              <span className="badge badge-emerald text-[10px]">Real-Time Telemetry</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] bg-slate-50/60">
                    <th className="py-3 px-4">Client Enterprise</th>
                    <th className="py-3 px-4">Subscription Plan</th>
                    <th className="py-3 px-4 text-center">Verified Volume</th>
                    <th className="py-3 px-4 text-center">Tariff Rate</th>
                    <th className="py-3 px-4 text-center">Gross Revenue</th>
                    <th className="py-3 px-4 text-center">Upstream Cost (₹25/ck)</th>
                    <th className="py-3 px-4 text-center">Net Profit</th>
                    <th className="py-3 px-4 text-center">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredCompanyList.map(c => {
                    const gross = c.verifiedCountThisMonth * c.pricePerVerification;
                    const cost = c.verifiedCountThisMonth * UPSTREAM_COST_PER_CHECK;
                    const profit = gross - cost;
                    const margin = gross > 0 ? Math.round((profit / gross) * 100) : 79;

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-bold text-slate-900 text-sm">{c.name}</td>
                        <td className="py-4 px-4">
                          <span className="badge badge-indigo text-[10px]">{c.plan}</span>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-slate-900">{c.verifiedCountThisMonth} checks</td>
                        <td className="py-4 px-4 text-center font-mono font-bold">₹{c.pricePerVerification}</td>
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-900">₹{gross.toLocaleString()}</td>
                        <td className="py-4 px-4 text-center font-mono text-slate-500">₹{cost.toLocaleString()}</td>
                        <td className="py-4 px-4 text-center font-mono font-black text-emerald-700">₹{profit.toLocaleString()}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="badge badge-emerald text-[10px] font-black">{margin}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Statistics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border-slate-200 bg-white shadow-sm rounded-2xl">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Verification Volume Trend (Last 7 Days)</span>
              </h3>
              <VerificationVolumeChart />
            </div>

            <div className="glass-panel p-6 border-slate-200 bg-white shadow-sm rounded-2xl">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Turnaround Time (TAT) Distribution</span>
              </h3>
              <TatDistributionChart />
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COMPANIES & 10 FLAGS */}
      {activeTab === 'companies' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span>Enterprise Client Companies & Feature Matrix Flags</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Configure subscription tiers, price per verification, and toggle 10 individual verification modules per company</p>
            </div>
            
            <button 
              onClick={() => setShowAddCompanyModal(true)}
              className="btn btn-superadmin text-xs py-2 px-4 flex items-center gap-1.5 shadow-md font-bold self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Onboard New Company</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] bg-slate-50/60">
                  <th className="py-3 px-4">Company Profile</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Tariff & Quota</th>
                  <th className="py-3 px-4 text-center">Active Features (out of 10)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {companies.map((comp) => {
                  const enabledCount = Object.values(comp.features || {}).filter(Boolean).length;
                  return (
                    <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">{comp.name}</div>
                        <div className="text-slate-500 text-[11px] font-mono">Code: {comp.code} • Plan: <strong>{comp.plan}</strong></div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-900 font-medium">{comp.contactPerson}</div>
                        <div className="text-slate-500 text-[11px]">{comp.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 font-mono">₹{comp.pricePerVerification} / check</div>
                        <div className="text-slate-500 text-[11px]">Quota: {comp.verifiedCountThisMonth} / {comp.maxLimit} used</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="badge badge-purple text-[10px] font-bold">
                          {enabledCount} of 10 Enabled
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setEditingFeaturesCompany(comp)}
                          className="btn btn-superadmin text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-xs ml-auto cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Configure 10 Flags</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TERMS & CONTRACTS HUB */}
      {activeTab === 'terms_hub' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <span>Enterprise Terms & Conditions Contracts Hub & Agreement Ledger</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Create customized T&C contracts per company, customize data retention (60d vs 90d), SLA tiers, and track digital signatures</p>
            </div>

            <button
              onClick={() => {
                setSelectedTermsCompany('Global Base Framework');
                setShowTermsModal(true);
              }}
              className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Review Global Terms (v2.4)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] bg-slate-50/60">
                  <th className="py-3 px-4">Enterprise Company</th>
                  <th className="py-3 px-4">Bound T&C Version</th>
                  <th className="py-3 px-4 text-center">Retention Period</th>
                  <th className="py-3 px-4">SLA Tier & Indemnity</th>
                  <th className="py-3 px-4">Authorized Signatory</th>
                  <th className="py-3 px-4 text-right">Contract Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {companies.map(comp => {
                  const customTerms = customCompanyTerms[comp.id] || {
                    retentionDays: 60,
                    customSla: '99.9% Standard Commercial Tier',
                    customIndemnityLimit: '₹5,00,000 INR',
                    boundVersion: 'v2.4-2026',
                    signedBy: `${comp.contactPerson} (${comp.email})`,
                    signedDate: '2026-08-20'
                  };

                  return (
                    <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 text-sm">{comp.name}</td>
                      <td className="py-4 px-4">
                        <span className="badge badge-purple text-[10px] font-black">{customTerms.boundVersion} 🟢</span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold">
                        <span className="badge badge-amber text-[10px]">{customTerms.retentionDays} Days Retention</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{customTerms.customSla}</div>
                        <div className="text-slate-500 text-[10px]">Indemnity: {customTerms.customIndemnityLimit}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{customTerms.signedBy}</div>
                        <div className="text-slate-500 text-[10px] font-mono">{customTerms.signedDate}</div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingCustomTermsCompany({ ...customTerms, companyId: comp.id, companyName: comp.name })}
                            className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-bold text-amber-900 bg-amber-50 border-amber-300 hover:bg-amber-100 cursor-pointer"
                            title="Customize Terms & Conditions for this Company"
                          >
                            <Sliders className="w-3.5 h-3.5 text-amber-700" />
                            <span>Edit T&C</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedTermsCompany(comp.name);
                              setShowTermsModal(true);
                            }}
                            className="btn btn-superadmin text-xs py-1.5 px-3 flex items-center gap-1 font-bold shadow-xs cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Contract</span>
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

      {/* TAB 4: METERED INVOICING */}
      {activeTab === 'billing' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                <span>Monthly Metered Invoicing & Automated Bill Dispatch Engine</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Auto-calculates monthly verification bills and dispatches official PDF invoices to company contacts via Email & WhatsApp</p>
            </div>
            <span className="badge badge-cyan text-[10px]">Auto GST 18% Compliant</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companies.map((comp) => {
              const subtotal = comp.verifiedCountThisMonth * comp.pricePerVerification;
              const gst = Math.round(subtotal * 0.18);
              const netTotal = subtotal + gst;
              const paymentStatus = companyPaymentLedger[comp.id]?.status || 'PENDING DEBIT ⏳';

              return (
                <div key={comp.id} className="p-6 rounded-2xl border-2 border-slate-200 bg-slate-50/60 hover:border-sky-300 transition-all flex flex-col justify-between gap-4 shadow-xs">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="badge badge-purple text-[10px]">{comp.plan}</span>
                        <h4 className="font-black text-slate-900 text-base mt-1">{comp.name}</h4>
                        <p className="text-slate-500 text-[11px]">{comp.email}</p>
                      </div>
                      <span className={`badge text-[10px] ${paymentStatus.includes('SETTLED') ? 'badge-emerald' : 'badge-amber'}`}>
                        {paymentStatus}
                      </span>
                    </div>

                    <div className="space-y-2 p-4 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Verifications this Month:</span>
                        <strong className="text-slate-900 font-mono">{comp.verifiedCountThisMonth} checks</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Tariff Rate:</span>
                        <strong className="text-slate-900 font-mono">₹{comp.pricePerVerification} / check</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <span className="font-mono">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST (18%):</span>
                        <span className="font-mono">₹{gst.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-sm text-indigo-950">
                        <span>Net Invoice Amount:</span>
                        <span className="text-emerald-700 font-mono font-black">₹{netTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => sendCompanyInvoiceBill(comp.id)}
                      className="btn btn-hrexecutive text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5 font-black shadow-sm cursor-pointer"
                      title="Dispatch Invoice to Company via Email & WhatsApp"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>📧 Send Bill</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveInvoiceModal(comp)}
                      className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Invoice PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: MULTI-ROLE LOGINS */}
      {activeTab === 'logins' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Multi-Role Login Sessions & Security Telemetry</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Real-time session monitoring across Super Admin, Company Admins, HR Executives, and Candidate Links</p>
            </div>
            <span className="badge badge-emerald text-[10px]">5 Active JWT Tokens</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] bg-slate-50/60">
                  <th className="py-3 px-4">Login Role</th>
                  <th className="py-3 px-4">User & Email</th>
                  <th className="py-3 px-4">Organization Entity</th>
                  <th className="py-3 px-4">IP Address & Network</th>
                  <th className="py-3 px-4">Device / Browser</th>
                  <th className="py-3 px-4 text-center">Actions Count</th>
                  <th className="py-3 px-4 text-right">Session Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {multiRoleSessions.map(sess => (
                  <tr key={sess.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className={`badge text-[10px] font-bold ${
                        sess.role === 'superadmin' ? 'badge-purple' : sess.role === 'company' ? 'badge-cyan' : sess.role === 'hrexecutive' ? 'badge-emerald' : 'badge-amber'
                      }`}>
                        {sess.roleLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm">{sess.userName}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{sess.email}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900">{sess.company}</td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">{sess.ipAddress}</td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{sess.device}</td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-indigo-700">{sess.actionsCount} events</td>
                    <td className="py-4 px-4 text-right">
                      <span className="badge badge-emerald text-[10px] font-black">{sess.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: DATABASE MANAGEMENT SYSTEM (DBMS) */}
      {activeTab === 'dbms' && (
        <div className="glass-panel p-6 sm:p-8 border-teal-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-teal text-[10px] font-bold">PostgreSQL 16 Connection Pool</span>
                <span className="text-xs text-slate-500 font-bold">• Database: joy_verification</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-700" />
                <span>Database Management System (DBMS Explorer & SQL Runner)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Browse live tables, inspect daily stored records, export data to CSV/JSON, and run safe read-only SQL queries</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const csvContent = 'data:text/csv;charset=utf-8,' + [Object.keys(currentTableRows[0] || {}).join(','), ...currentTableRows.map(r => Object.values(r).join(','))].join('\n');
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement('a');
                  link.setAttribute('href', encodedUri);
                  link.setAttribute('download', `${selectedDbTable}_export_2026.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showToast(`Exported ${selectedDbTable} table to CSV!`);
                }}
                className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => {
                  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentTableRows, null, 2));
                  const link = document.createElement('a');
                  link.setAttribute('href', jsonStr);
                  link.setAttribute('download', `${selectedDbTable}_export_2026.json`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  showToast(`Exported ${selectedDbTable} table to JSON!`);
                }}
                className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Table Selector Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select PostgreSQL Table to Inspect:</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
              {[
                { id: 'candidates', label: 'candidates (KYC Dossiers)' },
                { id: 'companies', label: 'companies (Enterprise Accounts)' },
                { id: 'hr_users', label: 'hr_users (HR Accounts)' },
                { id: 'invoices', label: 'invoices (Billing Ledger)' },
                { id: 'support_tickets', label: 'support_tickets' },
                { id: 'system_error_logs', label: 'system_error_logs' },
                { id: 'sessions', label: 'active_sessions' }
              ].map(tbl => (
                <button
                  key={tbl.id}
                  onClick={() => setSelectedDbTable(tbl.id)}
                  className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    selectedDbTable === tbl.id ? 'bg-teal-700 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tbl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
              <span className="text-teal-800 font-bold block text-[10px] uppercase">Total Table Rows</span>
              <span className="text-lg font-black text-slate-900">{currentTableRows.length} Records</span>
            </div>
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
              <span className="text-teal-800 font-bold block text-[10px] uppercase">Added Today</span>
              <span className="text-lg font-black text-emerald-700">+8 New Rows</span>
            </div>
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
              <span className="text-teal-800 font-bold block text-[10px] uppercase">Table Disk Storage</span>
              <span className="text-lg font-black text-slate-900 font-mono">128.4 KB</span>
            </div>
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
              <span className="text-teal-800 font-bold block text-[10px] uppercase">Engine Sync</span>
              <span className="text-lg font-black text-slate-900">PostgreSQL Pool (20)</span>
            </div>
          </div>

          {/* Live Data Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder={`Search in ${selectedDbTable}...`}
                  value={dbSearchQuery}
                  onChange={(e) => setDbSearchQuery(e.target.value)}
                  className="form-input pl-9 text-xs"
                />
              </div>
              <span className="text-xs text-slate-500 font-mono font-medium">Showing {filteredDbRows.length} of {currentTableRows.length} rows</span>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                  <tr className="border-b border-slate-200">
                    {Object.keys(currentTableRows[0] || {}).map((col, idx) => (
                      <th key={idx} className="py-3 px-3.5 uppercase text-[10px] whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                  {filteredDbRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-teal-50/50 transition-colors">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="py-3 px-3.5 whitespace-nowrap max-w-xs truncate text-[11px]">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SQL Query Runner Console */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-teal-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>Super Admin SQL Query Runner (PostgreSQL Console)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Read-Only Safe Mode Active</span>
            </div>

            <div className="space-y-2">
              <textarea
                rows={2}
                value={customSqlQuery}
                onChange={(e) => setCustomSqlQuery(e.target.value)}
                className="w-full bg-slate-950 text-teal-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 outline-none focus:border-teal-500"
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Quick Templates:</span>
                  <button onClick={() => setCustomSqlQuery('SELECT * FROM candidates WHERE status = \'Verified\';')} className="underline hover:text-teal-300 cursor-pointer">Verified Candidates</button>
                  <span>•</span>
                  <button onClick={() => setCustomSqlQuery('SELECT id, name, plan, verified_count_this_month FROM companies;')} className="underline hover:text-teal-300 cursor-pointer">Company Volume</button>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteSql}
                  className="btn btn-superadmin text-xs py-1.5 px-4 font-mono font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Execute SQL ▶</span>
                </button>
              </div>
            </div>

            {queryExecutionResult && (
              <div className="p-3.5 bg-slate-950 rounded-xl border border-teal-900/50 text-[11px] font-mono text-teal-200 space-y-1">
                <span className="text-[10px] text-teal-400 block font-bold">Query Execution Output ({queryExecutionResult.length} rows returned):</span>
                <pre className="max-h-36 overflow-y-auto overflow-x-auto text-[10px] text-slate-300">
                  {JSON.stringify(queryExecutionResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 7: MASTER FORM FIELDS & DROPDOWNS */}
      {activeTab === 'masterfields' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ListCheck className="w-5 h-5 text-teal-600" />
                  <span>Master Candidate Default Form Fields</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Standard default candidate form fields populated across all client companies during profile creation</p>
              </div>
              
              <button 
                onClick={() => setShowAddMasterFieldModal(true)}
                className="btn btn-superadmin text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md font-bold self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Master Default Field</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {masterFormFields.map((field) => (
                <div key={field.id} className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="badge badge-teal text-[9px]">{field.category}</span>
                    <h4 className="font-black text-slate-900 text-sm mt-1">{field.label}</h4>
                    <p className="text-slate-500 text-[10px] font-mono">Type: {field.type} • {field.defaultMandatory ? 'Mandatory ✅' : 'Optional'}</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <span>Topic-Based Master Data Dropdown Options Manager</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Manage standardized dropdown lists (Departments, Designations, Work Locations, Qualifications) populated in HR Stations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              
              {/* Dropdown 1: Departments */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs">🏢 Departments List ({masterDropdownOptions.departments?.length || 0})</h4>
                  <span className="badge badge-indigo text-[9px]">Master Table</span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                  {masterDropdownOptions.departments?.map((opt, i) => (
                    <span key={i} className="badge badge-indigo text-[10px] py-1 px-2.5 flex items-center gap-1.5 font-bold">
                      <span>{opt}</span>
                      <button onClick={() => removeMasterDropdownOption('departments', opt)} className="text-indigo-400 hover:text-indigo-900 font-black cursor-pointer">✕</button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add new department..."
                    value={newOptionInputs.departments}
                    onChange={(e) => setNewOptionInputs({ ...newOptionInputs, departments: e.target.value })}
                    className="form-input text-xs"
                  />
                  <button
                    onClick={() => {
                      if (newOptionInputs.departments.trim()) {
                        addMasterDropdownOption('departments', newOptionInputs.departments);
                        setNewOptionInputs({ ...newOptionInputs, departments: '' });
                      }
                    }}
                    className="btn btn-superadmin text-xs py-1.5 px-4 font-bold shrink-0 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Dropdown 2: Designations */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs">👔 Designations List ({masterDropdownOptions.designations?.length || 0})</h4>
                  <span className="badge badge-purple text-[9px]">Master Table</span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                  {masterDropdownOptions.designations?.map((opt, i) => (
                    <span key={i} className="badge badge-purple text-[10px] py-1 px-2.5 flex items-center gap-1.5 font-bold">
                      <span>{opt}</span>
                      <button onClick={() => removeMasterDropdownOption('designations', opt)} className="text-purple-400 hover:text-purple-900 font-black cursor-pointer">✕</button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add new designation..."
                    value={newOptionInputs.designations}
                    onChange={(e) => setNewOptionInputs({ ...newOptionInputs, designations: e.target.value })}
                    className="form-input text-xs"
                  />
                  <button
                    onClick={() => {
                      if (newOptionInputs.designations.trim()) {
                        addMasterDropdownOption('designations', newOptionInputs.designations);
                        setNewOptionInputs({ ...newOptionInputs, designations: '' });
                      }
                    }}
                    className="btn btn-superadmin text-xs py-1.5 px-4 font-bold shrink-0 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Dropdown 3: Work Locations */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs">📍 Work Locations ({masterDropdownOptions.workLocations?.length || 0})</h4>
                  <span className="badge badge-teal text-[9px]">Master Table</span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                  {masterDropdownOptions.workLocations?.map((opt, i) => (
                    <span key={i} className="badge badge-teal text-[10px] py-1 px-2.5 flex items-center gap-1.5 font-bold">
                      <span>{opt}</span>
                      <button onClick={() => removeMasterDropdownOption('workLocations', opt)} className="text-teal-400 hover:text-teal-900 font-black cursor-pointer">✕</button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add new location..."
                    value={newOptionInputs.workLocations}
                    onChange={(e) => setNewOptionInputs({ ...newOptionInputs, workLocations: e.target.value })}
                    className="form-input text-xs"
                  />
                  <button
                    onClick={() => {
                      if (newOptionInputs.workLocations.trim()) {
                        addMasterDropdownOption('workLocations', newOptionInputs.workLocations);
                        setNewOptionInputs({ ...newOptionInputs, workLocations: '' });
                      }
                    }}
                    className="btn btn-superadmin text-xs py-1.5 px-4 font-bold shrink-0 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Dropdown 4: Educational Qualifications */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs">🎓 Educational Qualifications ({masterDropdownOptions.qualifications?.length || 0})</h4>
                  <span className="badge badge-amber text-[9px]">Master Table</span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-slate-200">
                  {masterDropdownOptions.qualifications?.map((opt, i) => (
                    <span key={i} className="badge badge-amber text-[10px] py-1 px-2.5 flex items-center gap-1.5 font-bold">
                      <span>{opt}</span>
                      <button onClick={() => removeMasterDropdownOption('qualifications', opt)} className="text-amber-500 hover:text-amber-900 font-black cursor-pointer">✕</button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add qualification..."
                    value={newOptionInputs.qualifications}
                    onChange={(e) => setNewOptionInputs({ ...newOptionInputs, qualifications: e.target.value })}
                    className="form-input text-xs"
                  />
                  <button
                    onClick={() => {
                      if (newOptionInputs.qualifications.trim()) {
                        addMasterDropdownOption('qualifications', newOptionInputs.qualifications);
                        setNewOptionInputs({ ...newOptionInputs, qualifications: '' });
                      }
                    }}
                    className="btn btn-superadmin text-xs py-1.5 px-4 font-bold shrink-0 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 8: API CREDENTIALS */}
      {activeTab === 'apiconfig' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-600" />
                <span>Upstream Government & Biometrics API Credentials</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Configure API SETU DigiLocker, SMS Router, and Coincircletrust Biometrics Gateway keys</p>
            </div>
            <span className="badge badge-emerald text-[10px]">256-Bit Encrypted</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="space-y-2">
                <span className="badge badge-indigo text-[10px]">Govt Gateway</span>
                <h4 className="font-black text-slate-900 text-sm">API SETU DigiLocker UIDAI</h4>
                <p className="text-slate-500 text-[11px]">Primary gateway for authenticating Aadhaar 12-digit UID numbers and OTP checks</p>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">API Key Token</label>
                  <input 
                    type="password" 
                    value={editApiConfig.apiSetu.apiKey}
                    onChange={(e) => setEditApiConfig({ ...editApiConfig, apiSetu: { ...editApiConfig.apiSetu, apiKey: e.target.value } })}
                    className="form-input text-xs font-mono"
                  />
                </div>
                <button onClick={() => handleSaveApiConfig('apiSetu')} className="btn btn-superadmin text-xs py-2 w-full font-bold cursor-pointer">Save API SETU</button>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="space-y-2">
                <span className="badge badge-cyan text-[10px]">SMS Router</span>
                <h4 className="font-black text-slate-900 text-sm">Automated SMS OTP Router</h4>
                <p className="text-slate-500 text-[11px]">Multi-carrier gateway for dispatching phone SMS OTP verification codes</p>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Carrier Secret</label>
                  <input 
                    type="password" 
                    value={editApiConfig.sandbox.apiKey}
                    onChange={(e) => setEditApiConfig({ ...editApiConfig, sandbox: { ...editApiConfig.sandbox, apiKey: e.target.value } })}
                    className="form-input text-xs font-mono"
                  />
                </div>
                <button onClick={() => handleSaveApiConfig('sandbox')} className="btn btn-company text-xs py-2 w-full font-bold cursor-pointer">Save SMS Gateway</button>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="space-y-2">
                <span className="badge badge-amber text-[10px]">Biometrics Engine</span>
                <h4 className="font-black text-slate-900 text-sm">Coincircletrust WebCam AI</h4>
                <p className="text-slate-500 text-[11px]">AI face liveness detection & multi-angle biometric geometry validation</p>
              </div>
              
              <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Biometric Secret Key</label>
                  <input 
                    type="password" 
                    value={editApiConfig.coincircletrust.apiKey}
                    onChange={(e) => setEditApiConfig({ ...editApiConfig, coincircletrust: { ...editApiConfig.coincircletrust, apiKey: e.target.value } })}
                    className="form-input text-xs font-mono"
                  />
                </div>
                <button onClick={() => handleSaveApiConfig('coincircletrust')} className="btn btn-hrexecutive text-xs py-2 w-full font-bold cursor-pointer">Save Biometrics</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: REPORTS CENTER */}
      {activeTab === 'reports' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-amber-600" />
              <span>Platform Executive Reports Center (PDF, Excel, Word)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Export executive platform summaries, metered financial tariff reports, API SLA latency audits, and company quota allocation records</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <span className="badge badge-amber text-[10px]">Executive Audit</span>
                <h4 className="font-black text-slate-900 text-sm">Platform Master Verification Summary (PDF)</h4>
                <p className="text-slate-500 text-[11px]">Printable audit report of all verification volume across client enterprises</p>
              </div>
              <button 
                onClick={() => downloadSystemReport('Platform_Master_Summary', `JOY DATA VERIFICATION - PLATFORM MASTER REPORT\nDate: ${new Date().toLocaleString()}\nTotal Companies: ${companies.length}\nTotal Checks: ${totalVerifiedCount}\nRevenue: ₹${totalGrossRevenue.toLocaleString()}`, '.pdf', 'application/pdf')}
                className="btn btn-superadmin text-xs py-2 px-4 font-bold cursor-pointer shrink-0"
              >
                Export PDF
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <span className="badge badge-purple text-[10px]">Financial Statement</span>
                <h4 className="font-black text-slate-900 text-sm">Monthly Revenue & Tariff Breakdown (Excel)</h4>
                <p className="text-slate-500 text-[11px]">Spreadsheet breakdown of metered client usage and GST 18% taxes</p>
              </div>
              <button 
                onClick={() => downloadSystemReport('Monthly_Revenue_Statement', `Company,Plan,Volume,Price,Gross,GST,Net\n` + companies.map(c => `${c.name},${c.plan},${c.verifiedCountThisMonth},${c.pricePerVerification},${c.verifiedCountThisMonth*c.pricePerVerification},${Math.round(c.verifiedCountThisMonth*c.pricePerVerification*0.18)},${Math.round(c.verifiedCountThisMonth*c.pricePerVerification*1.18)}`).join('\n'), '.csv', 'text/csv')}
                className="btn btn-hrexecutive text-xs py-2 px-4 font-bold cursor-pointer shrink-0"
              >
                Export Excel
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <span className="badge badge-teal text-[10px]">Technical SLA</span>
                <h4 className="font-black text-slate-900 text-sm">API Gateway SLA & Latency Audit (Word/Doc)</h4>
                <p className="text-slate-500 text-[11px]">Upstream government gateway uptime metrics, average response times, and failure telemetry</p>
              </div>
              <button 
                onClick={() => downloadSystemReport('API_SLA_Latency_Audit', `API GATEWAY SLA & LATENCY AUDIT REPORT\nDate: ${new Date().toLocaleString()}\nDigiLocker Uptime: 99.95%\nAvg Latency: 1.2s\nCarrier SMS Uptime: 99.88%`, '.doc', 'application/msword')}
                className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer shrink-0"
              >
                Export Word
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <span className="badge badge-indigo text-[10px]">Client Quotas</span>
                <h4 className="font-black text-slate-900 text-sm">Company Feature Flags & Quota Audit (Excel)</h4>
                <p className="text-slate-500 text-[11px]">Audit matrix of 10 enabled feature flags and quota consumption per company</p>
              </div>
              <button 
                onClick={() => downloadSystemReport('Company_Feature_Quota_Audit', `Company,Plan,MaxLimit,UsedThisMonth,Aadhaar,Mobile,Face,PAN,DL,Bank\n` + companies.map(c => `${c.name},${c.plan},${c.maxLimit},${c.verifiedCountThisMonth},${c.features.aadhaar},${c.features.mobileOtp},${c.features.faceCapture},${c.features.pan},${c.features.drivingLicense},${c.features.bankCheck}`).join('\n'), '.csv', 'text/csv')}
                className="btn btn-company text-xs py-2 px-4 font-bold cursor-pointer shrink-0"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-indigo-600" />
                <span>Customer Support & Ticket Helpdesk Hub</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Review and reply to service tickets raised by HR Executives and Company Administrators</p>
            </div>
            <span className="badge badge-indigo text-[10px]">{supportTickets.length} Active Tickets</span>
          </div>

          <div className="space-y-4 text-xs">
            {supportTickets.map(ticket => (
              <div key={ticket.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">#{ticket.id} • {ticket.subject}</span>
                    <span className={`badge text-[9px] ${ticket.status === 'Resolved' ? 'badge-emerald' : 'badge-amber'}`}>{ticket.status}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Raised: {ticket.createdAt} • by {ticket.reporterName} ({ticket.companyName})</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-white rounded-xl border border-slate-200">
                  {ticket.messages?.map(msg => (
                    <div key={msg.id} className={`p-3 rounded-xl text-xs ${msg.type === 'admin_reply' ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 ml-4' : 'bg-slate-100 text-slate-800 mr-4'}`}>
                      <div className="flex justify-between font-bold text-[10px] text-slate-500 mb-1">
                        <span>{msg.sender}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-medium">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type official reply message to client..."
                    value={ticketReplyText[ticket.id] || ''}
                    onChange={(e) => setTicketReplyText({ ...ticketReplyText, [ticket.id]: e.target.value })}
                    className="form-input text-xs"
                  />
                  <button
                    onClick={() => {
                      if (ticketReplyText[ticket.id]?.trim()) {
                        addTicketReply(ticket.id, ticketReplyText[ticket.id], 'Super Admin Support', 'In Progress');
                        setTicketReplyText({ ...ticketReplyText, [ticket.id]: '' });
                      }
                    }}
                    className="btn btn-superadmin text-xs py-2 px-5 font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 11: ERROR LOGS */}
      {activeTab === 'issuelogs' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Section Error Logs & Diagnostics Tracker</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Monitor system errors across all sections and toggle Solved / Unresolved status</p>
            </div>

            <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
              <button onClick={() => setLogFilterStatus('all')} className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${logFilterStatus === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'}`}>All</button>
              <button onClick={() => setLogFilterStatus('unresolved')} className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${logFilterStatus === 'unresolved' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600'}`}>Unresolved</button>
              <button onClick={() => setLogFilterStatus('solved')} className={`px-3.5 py-1.5 rounded-lg cursor-pointer ${logFilterStatus === 'solved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'}`}>Solved</button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLogs.map(log => (
              <div key={log.id} className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${log.solved ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">#{log.id} • {log.section}</span>
                    <span className={`badge text-[9px] ${log.severity === 'Critical' ? 'badge-rose' : 'badge-amber'}`}>{log.severity}</span>
                  </div>
                  <p className="text-slate-700 text-xs font-medium">{log.event}: {log.details}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp} • Company: {log.company}</span>
                </div>

                <button
                  onClick={() => toggleLogSolvedStatus(log.id)}
                  className={`btn text-xs py-2 px-4 font-bold cursor-pointer shrink-0 ${log.solved ? 'btn-secondary text-emerald-800' : 'btn-superadmin'}`}
                >
                  {log.solved ? 'Mark Unresolved' : 'Mark Solved ✅'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: GUIDELINES */}
      {activeTab === 'guidelines' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Platform Role Workflows & Guidelines Hub</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Review and edit step-by-step operating guidelines for Super Admin, Company Admin, HR Executives, and Candidates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {Object.entries(platformGuidelines).map(([roleKey, guide]) => (
              <div key={roleKey} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 shadow-2xs">
                <span className="badge badge-purple text-[10px] uppercase font-bold self-start">{roleKey} Guide</span>
                <h4 className="font-black text-slate-900 text-sm">{guide.title}</h4>
                <p className="text-slate-600 leading-relaxed">{guide.summary}</p>
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-[11px] text-slate-700 font-medium">
                  <p><strong>Step 1:</strong> {guide.step1}</p>
                  <p><strong>Step 2:</strong> {guide.step2}</p>
                  <p><strong>Step 3:</strong> {guide.step3}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 13: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 sm:p-8 border-slate-200 bg-white space-y-6 shadow-sm rounded-2xl">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-800" />
              <span>Super Admin Global Platform Settings</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Configure global title, SLA parameters, session inactivity rules, and security policies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Global Platform Title</label>
              <input 
                type="text" 
                value={systemSettings.superadmin?.platformTitle || 'JOY DATA VERIFICATION'} 
                onChange={(e) => updateRoleSettings('superadmin', { platformTitle: e.target.value })}
                className="form-input" 
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">API Rate Limit Per Minute</label>
              <input 
                type="number" 
                value={systemSettings.superadmin?.apiRateLimitPerMin || 600} 
                onChange={(e) => updateRoleSettings('superadmin', { apiRateLimitPerMin: parseInt(e.target.value) || 600 })}
                className="form-input" 
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Session Inactivity Timeout (Minutes)</label>
              <input 
                type="number" 
                value={systemSettings.superadmin?.sessionTimeoutMins || 30} 
                onChange={(e) => updateRoleSettings('superadmin', { sessionTimeoutMins: parseInt(e.target.value) || 30 })}
                className="form-input" 
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Error Log Retention Period (Days)</label>
              <input 
                type="number" 
                value={systemSettings.superadmin?.logRetentionDays || 90} 
                onChange={(e) => updateRoleSettings('superadmin', { logRetentionDays: parseInt(e.target.value) || 90 })}
                className="form-input" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Onboard Company Modal */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 sm:p-8 space-y-5 border border-slate-200 bg-white text-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Onboard New Enterprise Company</span>
              </h3>
              <button onClick={() => setShowAddCompanyModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Acme Tech Corporation"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vikram Malhotra"
                    value={newCompany.contactPerson}
                    onChange={(e) => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official Email *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="admin@company.com"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tariff Plan Tier</label>
                  <select 
                    value={newCompany.plan}
                    onChange={(e) => setNewCompany({ ...newCompany, plan: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="Enterprise Premier">Enterprise Premier (₹120 / check)</option>
                    <option value="Standard Tier">Standard Tier (₹100 / check)</option>
                    <option value="Basic Tier">Basic Tier (₹80 / check)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Monthly Quota Limit</label>
                  <input 
                    type="number" 
                    min="50"
                    max="5000"
                    value={newCompany.maxLimit}
                    onChange={(e) => setNewCompany({ ...newCompany, maxLimit: parseInt(e.target.value) || 500 })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                    <Scale className="w-4 h-4 text-indigo-700" />
                    <span>Legal Compliance & Terms Acceptance</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTermsCompany(newCompany.name || 'New Enterprise Client');
                      setShowTermsModal(true);
                    }}
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                  >
                    Review Full Terms (v2.4)
                  </button>
                </div>

                <label className="flex items-start gap-2 pt-1 cursor-pointer">
                  <input 
                    type="checkbox"
                    required
                    checked={newCompany.termsAccepted}
                    onChange={(e) => setNewCompany({ ...newCompany, termsAccepted: e.target.checked })}
                    className="accent-indigo-600 w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-slate-800">
                    I confirm the authorized representative agrees to JOY Corporate Solutions Terms of Service, Point-in-Time Disclosures, and DPDP Privacy Policy.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddCompanyModal(false)} className="btn btn-secondary cursor-pointer">Cancel</button>
                <button type="submit" className="btn btn-superadmin font-bold shadow-md cursor-pointer">Save & Onboard Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Custom Company Terms Modal */}
      {editingCustomTermsCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 sm:p-8 space-y-4 border border-slate-200 bg-white text-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-amber text-[10px]">Custom T&C Contract Builder</span>
                <h3 className="text-base font-black text-slate-900 mt-1">Customize Terms: {editingCustomTermsCompany.companyName}</h3>
              </div>
              <button onClick={() => setEditingCustomTermsCompany(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Data Retention Period (Days)</label>
                  <select 
                    value={editingCustomTermsCompany.retentionDays}
                    onChange={(e) => setEditingCustomTermsCompany({ ...editingCustomTermsCompany, retentionDays: parseInt(e.target.value) || 60 })}
                    className="form-select text-xs font-bold"
                  >
                    <option value={60}>60 Days (Standard JCS Policy)</option>
                    <option value={90}>90 Days (Extended Fleet Retention)</option>
                    <option value={180}>180 Days (High-Compliance Archive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contract SLA Uptime Tier</label>
                  <select 
                    value={editingCustomTermsCompany.customSla}
                    onChange={(e) => setEditingCustomTermsCompany({ ...editingCustomTermsCompany, customSla: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="99.95% High-Availability SLA Tier">99.95% High-Availability Tier</option>
                    <option value="99.9% Standard Commercial Tier">99.9% Standard Commercial Tier</option>
                    <option value="99.9% Clinical Priority Tier">99.9% Clinical Priority Tier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Indemnity Protection Limit</label>
                <input 
                  type="text"
                  value={editingCustomTermsCompany.customIndemnityLimit}
                  onChange={(e) => setEditingCustomTermsCompany({ ...editingCustomTermsCompany, customIndemnityLimit: e.target.value })}
                  className="form-input text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Specialized Contract Addendums / Notes</label>
                <textarea 
                  rows={3}
                  value={editingCustomTermsCompany.customClauseNotes || ''}
                  onChange={(e) => setEditingCustomTermsCompany({ ...editingCustomTermsCompany, customClauseNotes: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setEditingCustomTermsCompany(null)} className="btn btn-secondary text-xs cursor-pointer">Cancel</button>
              <button 
                onClick={() => {
                  updateCustomCompanyTerms(editingCustomTermsCompany.companyId, editingCustomTermsCompany);
                  setEditingCustomTermsCompany(null);
                }} 
                className="btn btn-superadmin text-xs font-bold shadow-md cursor-pointer"
              >
                Save Custom Terms Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit 10 Feature Flags Modal */}
      {editingFeaturesCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl p-6 sm:p-8 space-y-5 border border-slate-200 bg-white text-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-indigo text-[10px]">Super Admin Feature Flags</span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">Configure 10 Verification Modules: {editingFeaturesCompany.name}</h3>
              </div>
              <button onClick={() => setEditingFeaturesCompany(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {featureList.map((feat) => {
                const isChecked = editingFeaturesCompany.features[feat.id] ?? false;
                return (
                  <label 
                    key={feat.id}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isChecked ? 'bg-indigo-50 border-indigo-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{feat.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{feat.category}</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const updated = {
                          ...editingFeaturesCompany.features,
                          [feat.id]: e.target.checked
                        };
                        setEditingFeaturesCompany({ ...editingFeaturesCompany, features: updated });
                      }}
                      className="accent-indigo-600 w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button onClick={() => setEditingFeaturesCompany(null)} className="btn btn-secondary text-xs cursor-pointer">Cancel</button>
              <button 
                onClick={() => {
                  updateCompanyFeatures(editingFeaturesCompany.id, editingFeaturesCompany.features, editingFeaturesCompany.plan);
                  setEditingFeaturesCompany(null);
                }} 
                className="btn btn-superadmin text-xs font-bold shadow-md cursor-pointer"
              >
                Save Feature Flags
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Master Default Field Modal */}
      {showAddMasterFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 space-y-4 border border-slate-200 bg-white text-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <ListCheck className="w-5 h-5 text-purple-600" />
                <span>Add Master Candidate Default Field</span>
              </h3>
              <button onClick={() => setShowAddMasterFieldModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateMasterFieldSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Field Label Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. UAN / EPF Number"
                  value={newMasterField.label}
                  onChange={(e) => setNewMasterField({ ...newMasterField, label: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Field Category</label>
                  <select 
                    value={newMasterField.category}
                    onChange={(e) => setNewMasterField({ ...newMasterField, category: e.target.value })}
                    className="form-select text-xs"
                  >
                    <option value="Personal Info">Personal Info</option>
                    <option value="Government ID">Government ID</option>
                    <option value="Contact">Contact</option>
                    <option value="Financial">Financial</option>
                    <option value="Employment">Employment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Default Mandatory</label>
                  <select 
                    value={newMasterField.defaultMandatory ? 'true' : 'false'}
                    onChange={(e) => setNewMasterField({ ...newMasterField, defaultMandatory: e.target.value === 'true' })}
                    className="form-select text-xs"
                  >
                    <option value="true">Mandatory ✅</option>
                    <option value="false">Optional</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddMasterFieldModal(false)} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="btn btn-superadmin text-xs font-bold cursor-pointer">Save Master Field</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {activeInvoiceModal && (
        <InvoiceModal 
          company={activeInvoiceModal} 
          onClose={() => setActiveInvoiceModal(null)} 
        />
      )}

      {/* Document Downloader Modal */}
      {downloadingCandidate && (
        <DocumentDownloader 
          candidate={downloadingCandidate} 
          onClose={() => setDownloadingCandidate(null)} 
        />
      )}

      {/* Terms & Privacy Policy Modal */}
      {showTermsModal && (
        <TermsAndPrivacyPolicyModal
          isOpen={showTermsModal}
          companyName={selectedTermsCompany || 'Client Enterprise'}
          onClose={() => setShowTermsModal(false)}
          onAccept={() => {
            setNewCompany(prev => ({ ...prev, termsAccepted: true }));
            setShowTermsModal(false);
          }}
        />
      )}

    </div>
  );
};
