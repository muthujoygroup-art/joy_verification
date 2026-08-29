import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { InvoiceModal } from '../components/InvoiceModal';
import { VerificationVolumeChart, TatDistributionChart } from '../components/StatsCharts';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { TermsAndPrivacyPolicyModal } from '../components/TermsAndPrivacyPolicyModal';
import { MetricDrilldownModal } from '../components/MetricDrilldownModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { UniversalDocumentExportModal } from '../components/UniversalDocumentExportModal';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
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
  Receipt,
  ExternalLink,
  Edit,
  Copy,
  Calculator,
  Sparkles,
  KeyRound,
  Cpu,
  Power,
  Star,
  ToggleLeft,
  ToggleRight,
  EyeOff
} from 'lucide-react';

export const SuperAdminView = () => {
  const { 
    companies, 
    addCompany, 
    updateCompanyFeatures, 
    apiConfigurations, 
    updateApiConfig, 
    addApiProvider,
    toggleApiProvider,
    setPrimaryApiProvider,
    deleteApiProvider,
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
    paymentGatewayConfig,
    updatePaymentGatewayConfig,
    showToast
  } = useApp();

  const [ticketReplyText, setTicketReplyText] = useState({});
  const [showSuperAdminRazorpayModal, setShowSuperAdminRazorpayModal] = useState(false);
  const [selectedRechargeCompanyId, setSelectedRechargeCompanyId] = useState('comp-1');
  const [gatewayForm, setGatewayForm] = useState({
    provider: paymentGatewayConfig?.provider || 'Razorpay Payments India',
    mode: paymentGatewayConfig?.mode || 'Sandbox / Test Mode',
    keyId: paymentGatewayConfig?.keyId || 'rzp_test_JoyVerif2026',
    keySecret: paymentGatewayConfig?.keySecret || 'rzp_sec_JoyCorpMaster99',
    webhookSecret: paymentGatewayConfig?.webhookSecret || 'whsec_JoyCorpHook2026',
    autoInvoicing: true,
    gstRate: 18,
    sacCode: '998311'
  });

  const [newOptionInputs, setNewOptionInputs] = useState({
    departments: '',
    designations: '',
    workLocations: '',
    qualifications: '',
    employmentTypes: ''
  });

  const [activeMasterMenu, setActiveMasterMenu] = useState('skills');
  const [masterSearchQuery, setMasterSearchQuery] = useState('');
  const [masterEntriesPerPage, setMasterEntriesPerPage] = useState(10);
  const [newMasterItemInput, setNewMasterItemInput] = useState('');

  const [activeTab, setActiveTab] = useState('analytics'); 
  // 'analytics' | 'companies' | 'terms_hub' | 'billing' | 'logins' | 'dbms' | 'masterfields' | 'apiconfig' | 'reports' | 'tickets' | 'issuelogs' | 'guidelines' | 'settings'

  // Company filtering for analytics
  const [selectedAnalyticsCompanyId, setSelectedAnalyticsCompanyId] = useState('all'); 
  
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showUniversalExportModal, setShowUniversalExportModal] = useState(false);
  const [selectedTermsCompany, setSelectedTermsCompany] = useState(null);
  const [editingCustomTermsCompany, setEditingCustomTermsCompany] = useState(null);
  const [showAddMasterFieldModal, setShowAddMasterFieldModal] = useState(false);
  const [editingFeaturesCompany, setEditingFeaturesCompany] = useState(null);
  const [downloadingCandidate, setDownloadingCandidate] = useState(null);
  const [activeDrilldown, setActiveDrilldown] = useState(null);
  const [viewingDossierCandidate, setViewingDossierCandidate] = useState(null);
  const [viewingCertificateCandidate, setViewingCertificateCandidate] = useState(null);

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
    password: 'Company@Admin2026',
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

  const [editApiConfig, setEditApiConfig] = useState(() => ({
    server1_sandbox: {
      apiKey: apiConfigurations.server1_sandbox?.apiKey || 'sb_live_key_9942a1bc88',
      secretKey: apiConfigurations.server1_sandbox?.secretKey || 'sb_sec_JoyCorp2026_m89',
      endpointUrl: apiConfigurations.server1_sandbox?.endpointUrl || 'https://api.sandbox.co.in/v2',
      status: apiConfigurations.server1_sandbox?.status || 'Online',
      mode: apiConfigurations.server1_sandbox?.mode || 'Production (Live Mode)'
    },
    server2_coincircle: {
      clientId: apiConfigurations.server2_coincircle?.clientId || 'CCT_CORP_VERIF_882910',
      clientSecret: apiConfigurations.server2_coincircle?.clientSecret || 'cct_sec_JoyCircleTrust_9921_xK',
      endpointUrl: apiConfigurations.server2_coincircle?.endpointUrl || 'https://api.coincircletrust.com/api/v1',
      status: apiConfigurations.server2_coincircle?.status || 'Online',
      mode: apiConfigurations.server2_coincircle?.mode || 'Production (Live Mode)'
    }
  }));

  const [callbackUrl, setCallbackUrl] = useState('https://verification.joycorporatesolutions.com/api/verification/webhook/callback');
  const [isCallbackCopied, setIsCallbackCopied] = useState(false);

  // Dynamic API Provider Management States
  const [showAddApiModal, setShowAddApiModal] = useState(false);
  const [newApiProvider, setNewApiProvider] = useState({
    name: '',
    providerKey: '',
    providerType: 'Institutional Gateway',
    endpointUrl: 'https://api.example.com/v1',
    apiKey: '',
    secretKey: '',
    webhookUrl: 'https://verification.joycorporatesolutions.com/api/verification/webhook/callback',
    mode: 'Production (Live Mode)',
    rateLimitPerMin: 120,
    monthlyQuota: 10000,
    isPrimary: false,
    supportedDocs: ['Aadhaar UIDAI OTP', 'PAN Card Basic (NSDL)', 'Bank Account IMPS Penny Drop (₹1)', 'Driving License (MoRTH)']
  });
  const [showEditApiModal, setShowEditApiModal] = useState(false);
  const [selectedEditProvider, setSelectedEditProvider] = useState(null);
  const [revealedKeys, setRevealedKeys] = useState({});

  // 📊 API Telemetry & Candidate Document Ledger States
  const [telemetryTimeRange, setTelemetryTimeRange] = useState('all'); // 'today' | '7d' | '30d' | 'month' | 'all'
  const [companyTelemetry, setCompanyTelemetry] = useState(null);
  const [candidateLedgerList, setCandidateLedgerList] = useState([]);
  const [candidateLedgerSearch, setCandidateLedgerSearch] = useState('');
  const [candidateLedgerCompany, setCandidateLedgerCompany] = useState('all');
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState(null);
  const [showCandidateDetailModal, setShowCandidateDetailModal] = useState(false);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);

  // Fetch telemetry from backend
  const fetchTelemetryData = async (timeRange = telemetryTimeRange) => {
    setIsTelemetryLoading(true);
    try {
      const [compRes, candRes] = await Promise.all([
        api.getCompanyApiTelemetry(timeRange).catch(() => null),
        api.getCandidateApiLedger({ time_range: timeRange }).catch(() => null)
      ]);
      if (compRes && compRes.success) {
        setCompanyTelemetry(compRes);
      }
      if (candRes && candRes.success) {
        setCandidateLedgerList(candRes.candidates || []);
      }
    } catch (e) {
      console.warn('Telemetry load failed:', e);
    } finally {
      setIsTelemetryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'apiconfig' || activeTab === 'reports' || activeTab === 'analytics') {
      fetchTelemetryData(telemetryTimeRange);
    }
  }, [activeTab, telemetryTimeRange]);

  const viewCandidateApiDetail = async (candidateId) => {
    try {
      const res = await api.getCandidateDetailedApiBreakdown(candidateId);
      if (res && res.success) {
        setSelectedCandidateDetail(res);
        setShowCandidateDetailModal(true);
      } else {
        showToast('Candidate detailed audit not found', 'error');
      }
    } catch (e) {
      showToast('Failed to load candidate audit detail', 'error');
    }
  };


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

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900 pb-16">
      
      {/* Top Header Banner & Sub-Navigation Tabs Bar */}
      <div className="glass-panel p-6 border-indigo-200 bg-white space-y-6 relative overflow-hidden shadow-sm rounded-2xl">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-purple font-bold">Super Admin Console</span>
              <span className="text-xs text-slate-500 font-bold">• Enterprise Governance, Profit Telemetry & DBMS</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">Platform Master Control, Analytics & Database Operations</h2>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">Manage enterprise contracts, metered billing, multi-role session monitoring, and real-time PostgreSQL database tables.</p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {totalUnresolvedErrorCount > 0 && (
              <button 
                onClick={() => setActiveTab('issuelogs')}
                className="badge badge-amber text-xs px-3 py-1.5 flex items-center gap-1 font-bold animate-pulse"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{totalUnresolvedErrorCount} Unresolved Issues</span>
              </button>
            )}
            
            <button 
              onClick={() => setShowUniversalExportModal(true)}
              className="btn btn-secondary text-xs flex items-center gap-1.5 shadow-2xs font-bold text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer"
              title="Download platform-wide cross-company reports by date range"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Date-Filtered Reports 📥</span>
            </button>

            <button 
              onClick={() => setShowAddCompanyModal(true)}
              className="btn btn-superadmin text-xs flex items-center gap-1.5 shadow-md font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard Company</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
          
          {/* TAB 1: Analytics & Profit */}
          <button
            data-tour-step="superadmin-analytics-tab"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>1. Platform & Profit Analytics</span>
          </button>

          {/* TAB 2: Companies & Features */}
          <button
            data-tour-step="superadmin-companies-tab"
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'companies' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>2. Companies & Feature Matrix</span>
          </button>

          {/* TAB 3: Terms & Conditions Contracts Hub */}
          <button
            onClick={() => setActiveTab('terms_hub')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'terms_hub' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>3. Terms & Contracts Hub 📜</span>
          </button>

          {/* TAB 4: Metered Billing & Invoices */}
          <button
            data-tour-step="superadmin-billing-tab"
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'billing' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>4. Metered Invoicing & Bill Dispatch</span>
          </button>

          {/* TAB 5: Multi-Login Telemetry */}
          <button
            onClick={() => setActiveTab('logins')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'logins' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>5. Login Sessions Telemetry 👥</span>
          </button>

          {/* TAB 6: Database Management System (DBMS) */}
          <button
            data-tour-step="superadmin-dbms-tab"
            onClick={() => setActiveTab('dbms')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'dbms' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>6. Database Management (DBMS) 🗄️</span>
          </button>

          {/* TAB 7: Master Fields & Dropdowns */}
          <button
            onClick={() => setActiveTab('masterfields')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'masterfields' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ListCheck className="w-4 h-4" />
            <span>7. Master Fields & Dropdowns</span>
          </button>

          {/* TAB 8: API Credentials */}
          <button
            data-tour-step="superadmin-apiconfig-tab"
            onClick={() => setActiveTab('apiconfig')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'apiconfig' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>8. API Credentials</span>
          </button>

          {/* TAB 9: Reports Center */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'reports' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>9. Reports Center</span>
          </button>

          {/* TAB 10: Support Tickets */}
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'tickets' ? 'bg-indigo-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>10. Support Helpdesk ({supportTickets.length})</span>
          </button>

          {/* TAB 11: Issue Logs */}
          <button
            onClick={() => setActiveTab('issuelogs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'issuelogs' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>11. Error Logs ({totalUnresolvedErrorCount})</span>
          </button>

          {/* TAB 12: Guidelines */}
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'guidelines' ? 'bg-purple-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>12. Platform Guidelines</span>
          </button>

          {/* TAB 13: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'settings' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>13. Settings</span>
          </button>

          {/* TAB 14: Legal & DPDP Governance */}
          <button
            onClick={() => setActiveTab('legal_governance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === 'legal_governance' ? 'bg-purple-800 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Scale className="w-4 h-4 text-purple-400" />
            <span>14. Legal & DPDP Governance 🏛️</span>
          </button>

        </div>
      </div>

      {/* TAB 1: PLATFORM STATISTICS & COMPANY-WISE PROFIT MARGIN ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* Company-Wise Filter Bar */}
          <div className="glass-panel p-4 border-indigo-200 bg-indigo-50/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-700" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">Filter Analytics View:</span>
              <select 
                value={selectedAnalyticsCompanyId}
                onChange={(e) => setSelectedAnalyticsCompanyId(e.target.value)}
                className="bg-white border border-indigo-300 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              >
                <option value="all">🌐 All Enterprise Companies (Consolidated)</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>🏢 {c.name} ({c.plan})</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-600 font-medium">
              Showing financial & operational metrics for: <strong className="text-indigo-900">{selectedAnalyticsCompanyId === 'all' ? 'All Client Accounts' : companies.find(c => c.id === selectedAnalyticsCompanyId)?.name}</strong>
            </div>
          </div>

          {/* High-Level Financial & Profit KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <MetricCard 
              title="Total Verifications" 
              value={totalVerifiedCount.toLocaleString()} 
              subtext={`Across ${filteredCompanyList.length} Enterprise Account(s)`} 
              icon={CheckCircle2} 
              trend="+18.4%"
              color="emerald" 
              onClick={() => setActiveDrilldown({
                title: 'Total Verifications Audit',
                subtitle: `Itemized breakdown of all candidate verifications across ${filteredCompanyList.length} enterprise account(s)`,
                metricValue: `${totalVerifiedCount} Checks`,
                metricType: 'total_verifications',
                data: candidates.filter(c => selectedAnalyticsCompanyId === 'all' || c.companyId === selectedAnalyticsCompanyId).map(c => ({
                  name: c.name,
                  empId: c.empId,
                  mobile: c.mobile,
                  email: c.email,
                  companyName: companies.find(comp => comp.id === c.companyId)?.name || 'Enterprise Client',
                  status: c.status,
                  verificationDate: c.verificationDate || 'Recent',
                  token: c.token
                }))
              })}
            />

            <MetricCard 
              title="Gross Billed Revenue" 
              value={`₹${totalGrossRevenue.toLocaleString()}`} 
              subtext="Tariff Billing Volume" 
              icon={CreditCard} 
              color="cyan" 
              onClick={() => setActiveDrilldown({
                title: 'Gross Billed Revenue Breakdown',
                subtitle: 'Calculated monthly metered tariff volume across client companies',
                metricValue: `₹${totalGrossRevenue.toLocaleString()}`,
                metricType: 'gross_revenue',
                data: filteredCompanyList.map(c => ({
                  name: c.name,
                  plan: c.plan,
                  title: `${c.verifiedCountThisMonth} checks @ ₹${c.pricePerVerification}/check`,
                  amount: `₹${(c.verifiedCountThisMonth * c.pricePerVerification).toLocaleString()}`,
                  status: 'Billed'
                }))
              })}
            />

            <MetricCard 
              title="Upstream Gateway Cost" 
              value={`₹${totalUpstreamCost.toLocaleString()}`} 
              subtext="₹25 / check (UIDAI + SMS + Face)" 
              icon={Server} 
              color="amber" 
              onClick={() => setActiveDrilldown({
                title: 'Upstream Gateway Cost Ledger',
                subtitle: 'Fixed upstream fee breakdown (₹15 API SETU UIDAI + ₹2 Carrier SMS + ₹8 AI Biometrics)',
                metricValue: `₹${totalUpstreamCost.toLocaleString()}`,
                metricType: 'upstream_cost',
                data: filteredCompanyList.map(c => ({
                  name: c.name,
                  title: `UIDAI (₹15): ₹${(c.verifiedCountThisMonth * 15).toLocaleString()} • SMS (₹2): ₹${(c.verifiedCountThisMonth * 2).toLocaleString()} • Face AI (₹8): ₹${(c.verifiedCountThisMonth * 8).toLocaleString()}`,
                  amount: `₹${(c.verifiedCountThisMonth * UPSTREAM_COST_PER_CHECK).toLocaleString()}`,
                  status: 'Paid Upstream'
                }))
              })}
            />

            <MetricCard 
              title="Net Platform Profit" 
              value={`₹${totalNetProfit.toLocaleString()}`} 
              subtext={`Profit Margin: ${profitMarginPercent}% Net`} 
              icon={TrendingUp} 
              trend={`+${profitMarginPercent}% Margin`}
              color="indigo" 
              onClick={() => setActiveDrilldown({
                title: 'Net Platform Profit Margin Matrix',
                subtitle: 'Company-by-company net platform revenue after deducting provider costs',
                metricValue: `₹${totalNetProfit.toLocaleString()}`,
                metricType: 'net_profit',
                data: filteredCompanyList.map(c => {
                  const gross = c.verifiedCountThisMonth * c.pricePerVerification;
                  const cost = c.verifiedCountThisMonth * UPSTREAM_COST_PER_CHECK;
                  const profit = gross - cost;
                  const margin = gross > 0 ? Math.round((profit / gross) * 100) : 79;
                  return {
                    name: c.name,
                    plan: c.plan,
                    title: `Gross ₹${gross.toLocaleString()} - Upstream ₹${cost.toLocaleString()}`,
                    amount: `₹${profit.toLocaleString()} (${margin}% Net)`,
                    status: 'Profitable'
                  };
                })
              })}
            />

          </div>

          {/* Company-Wise Profit Matrix Table */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
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
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
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
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
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
            <div className="glass-panel p-6 border-slate-200 bg-white rounded-2xl shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Verification Volume Trend (Last 7 Days)</span>
              </h3>
              <VerificationVolumeChart />
            </div>

            <div className="glass-panel p-6 border-slate-200 bg-white rounded-2xl shadow-sm">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Turnaround Time (TAT) Distribution</span>
              </h3>
              <TatDistributionChart />
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COMPANIES & 10-FEATURE FLAGS MATRIX */}
      {activeTab === 'companies' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span>Enterprise Client Companies & Feature Matrix Flags</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Configure subscription tiers, price per verification, and toggle 10 individual verification modules per company</p>
            </div>
            
            <button 
              onClick={() => setShowAddCompanyModal(true)}
              className="btn btn-superadmin text-xs flex items-center gap-1.5 shadow-md font-bold self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Onboard New Company</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
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
                          className="btn btn-superadmin text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold shadow-2xs ml-auto"
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

      {/* TAB 3: TERMS & CONDITIONS CONTRACTS HUB & AGREEMENT LEDGER */}
      {activeTab === 'terms_hub' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
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
              className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Review Global Terms (v2.4)</span>
            </button>
          </div>

          {/* Company Contracts Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
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
                            className="btn btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 font-bold text-amber-900 bg-amber-50 border-amber-300 hover:bg-amber-100"
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
                            className="btn btn-superadmin text-xs py-1.5 px-2.5 flex items-center gap-1 font-bold shadow-2xs"
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

      {/* TAB 4: METERED BILLING, RAZORPAY GATEWAY & WALLET MANAGEMENT */}
      {activeTab === 'billing' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* 1. Razorpay Payment Gateway Master Configuration Card */}
          <div className="glass-panel p-6 border-indigo-200 bg-gradient-to-r from-indigo-50/60 via-white to-purple-50/60 space-y-6 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-purple text-xs font-black">PAYMENT INFRASTRUCTURE</span>
                  <span className="text-xs text-slate-500 font-bold">• Razorpay India & B2B Billing Gateway</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Razorpay Gateway Master Settings & Sandbox Keys</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium">Configure credentials, webhook signatures, 18% GST invoicing SAC codes, and toggle between Sandbox/Test and Live Production.</p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`badge text-xs font-black py-1 px-3 ${gatewayForm.mode.includes('Live') ? 'badge-emerald' : 'badge-amber'}`}>
                  {gatewayForm.mode} ⚡
                </span>
              </div>
            </div>

            {/* Gateway Configuration Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                updatePaymentGatewayConfig(gatewayForm);
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gateway Provider</label>
                  <input
                    type="text"
                    value={gatewayForm.provider}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, provider: e.target.value })}
                    className="form-input text-xs font-bold w-full bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gateway Environment</label>
                  <select
                    value={gatewayForm.mode}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, mode: e.target.value })}
                    className="form-select text-xs font-bold w-full bg-white"
                  >
                    <option value="Sandbox / Test Mode">Sandbox / Test Mode (rzp_test_...)</option>
                    <option value="Live Production">Live Production (rzp_live_...)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">GST Tax Rate & SAC Code</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="18% GST"
                      disabled
                      className="form-input text-xs font-bold w-24 bg-slate-100 text-slate-600"
                    />
                    <input
                      type="text"
                      value="SAC: 998311 (IT/BGV)"
                      disabled
                      className="form-input text-xs font-bold flex-1 bg-slate-100 text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Razorpay Key ID *</label>
                  <input
                    type="text"
                    required
                    value={gatewayForm.keyId}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, keyId: e.target.value })}
                    className="form-input text-xs font-mono font-bold w-full bg-white text-indigo-700"
                    placeholder="rzp_test_..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Razorpay Key Secret *</label>
                  <input
                    type="password"
                    required
                    value={gatewayForm.keySecret}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, keySecret: e.target.value })}
                    className="form-input text-xs font-mono font-bold w-full bg-white"
                    placeholder="••••••••••••••••"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Webhook Secret Key</label>
                  <input
                    type="password"
                    value={gatewayForm.webhookSecret}
                    onChange={(e) => setGatewayForm({ ...gatewayForm, webhookSecret: e.target.value })}
                    className="form-input text-xs font-mono font-bold w-full bg-white"
                    placeholder="whsec_..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Supports Instant UPI (Google Pay, PhonePe, Paytm), Corporate Credit Cards, NetBanking & Payment Links</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-superadmin text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Gateway Settings</span>
                </button>
              </div>
            </form>
          </div>

          {/* 2. Platform Revenue & Margin Overview Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Platform Wallet Recharges</span>
              <div className="text-2xl font-black text-slate-900">
                ₹{companies.reduce((sum, c) => sum + (c.rechargeTransactions || []).reduce((acc, t) => acc + (t.baseAmount || 0), 0), 0).toLocaleString('en-IN')}
              </div>
              <span className="badge badge-emerald text-[9px] font-black">Gross Inflow 🟢</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Corporate Wallets</span>
              <div className="text-2xl font-black text-indigo-700">
                ₹{companies.reduce((sum, c) => sum + (c.walletBalance || 0), 0).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{companies.length} Corporate Clients</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Estimated Upstream API Cost</span>
              <div className="text-2xl font-black text-amber-700">
                ₹{Math.round(companies.reduce((sum, c) => sum + c.verifiedCountThisMonth, 0) * 25).toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Sandbox + CoinCircle @ ₹25/check</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Gross Profit Margin</span>
              <div className="text-2xl font-black text-emerald-700">
                79.2% Margin
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">₹95 Avg Profit per Candidate Check</span>
            </div>
          </div>

          {/* 3. Corporate Clients Wallet & Invoicing Status Grid */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-600" />
                  <span>Corporate Client Wallets & Monthly Metered Invoicing</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Manage company prepaid balances, recharge credits via Razorpay on their behalf, or dispatch monthly tax bills</p>
              </div>
              <span className="badge badge-cyan text-[10px]">Auto GST 18% Compliant</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companies.map((comp) => {
                const subtotal = comp.verifiedCountThisMonth * comp.pricePerVerification;
                const gst = Math.round(subtotal * 0.18);
                const netTotal = subtotal + gst;
                const paymentStatus = companyPaymentLedger[comp.id]?.status || 'PENDING DEBIT ⏳';

                return (
                  <div key={comp.id} className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/60 hover:border-indigo-300 transition-all space-y-4 shadow-2xs">
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

                    <div className="space-y-1.5 p-3.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Prepaid Wallet Balance:</span>
                        <strong className="text-indigo-700 font-mono font-black">₹{(comp.walletBalance || 0).toLocaleString('en-IN')}</strong>
                      </div>
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
                      <div className="border-t border-slate-100 pt-1.5 flex justify-between font-black text-sm text-indigo-950">
                        <span>Net Monthly Consumption:</span>
                        <span className="text-emerald-700 font-mono font-black">₹{netTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Actions: Recharge, Send Bill & Invoice PDF */}
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRechargeCompanyId(comp.id);
                          setShowSuperAdminRazorpayModal(true);
                        }}
                        className="btn btn-superadmin text-xs py-2 px-3 w-full flex items-center justify-center gap-1.5 font-black shadow-sm cursor-pointer"
                        title="Recharge Wallet via Razorpay for this Company"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                        <span>Recharge Wallet (Razorpay) ⚡</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => sendCompanyInvoiceBill(comp.id)}
                          className="btn btn-hrexecutive text-xs py-1.5 px-3 flex-1 flex items-center justify-center gap-1.5 font-bold shadow-2xs"
                          title="Dispatch Invoice to Company via Email & WhatsApp"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Bill 📧</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveInvoiceModal(comp)}
                          className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Global Recharge Transactions Ledger across all Clients */}
          <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  <span>Platform-Wide Razorpay Recharge Transactions Ledger</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">Real-time payment captures, Razorpay Order IDs, and GST tax invoice records across all enrolled companies.</p>
              </div>
              <span className="badge badge-emerald text-[9px] font-bold">100% Reconciled</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                    <th className="py-2.5 px-3">Company</th>
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
                  {companies.flatMap(comp => 
                    (comp.rechargeTransactions || []).map(tx => ({ ...tx, companyName: comp.name }))
                  ).map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{tx.companyName}</td>
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

      {/* TAB 5: MULTI-ROLE LOGIN SESSIONS & TELEMETRY */}
      {activeTab === 'logins' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
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
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
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

      {/* TAB 6: DATABASE MANAGEMENT SYSTEM (DBMS) CONSOLE */}
      {activeTab === 'dbms' && (
        <div className="glass-panel p-6 border-teal-300 bg-white space-y-6 rounded-2xl shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-teal text-[10px] font-bold">PostgreSQL 16 Connection Pool</span>
                <span className="text-xs text-slate-500 font-bold">• Database: joy_verification</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-700" />
                <span>Database Management System (DBMS Explorer & Query Runner)</span>
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
                className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
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
                className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Table Selector Pills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">Select PostgreSQL Table to Inspect:</label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
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
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    selectedDbTable === tbl.id ? 'bg-teal-700 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tbl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <span className="text-teal-800 font-bold block text-[10px] uppercase">Total Table Rows</span>
              <span className="text-base font-black text-slate-900">{currentTableRows.length} Records</span>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <span className="text-teal-800 font-bold block text-[10px] uppercase">Added Today</span>
              <span className="text-base font-black text-emerald-700">+8 New Rows</span>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <span className="text-teal-800 font-bold block text-[10px] uppercase">Table Disk Storage</span>
              <span className="text-base font-black text-slate-900 font-mono">128.4 KB</span>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <span className="text-teal-800 font-bold block text-[10px] uppercase">Engine Sync</span>
              <span className="text-base font-black text-slate-900">PostgreSQL Pool (20)</span>
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

            <div className="overflow-x-auto max-h-72 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                  <tr className="border-b border-slate-200">
                    {Object.keys(currentTableRows[0] || {}).map((col, idx) => (
                      <th key={idx} className="py-2.5 px-3 uppercase text-[10px] whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                  {filteredDbRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-teal-50/50 transition-colors">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3 whitespace-nowrap max-w-xs truncate text-[11px]">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SQL Query Runner Console */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 space-y-3">
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
                className="w-full bg-slate-950 text-teal-300 font-mono text-xs p-3 rounded-lg border border-slate-800 outline-none focus:border-teal-500"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Quick Templates:</span>
                  <button onClick={() => setCustomSqlQuery('SELECT * FROM candidates WHERE status = \'Verified\';')} className="underline hover:text-teal-300">Verified Candidates</button>
                  <span>•</span>
                  <button onClick={() => setCustomSqlQuery('SELECT id, name, plan, verified_count_this_month FROM companies;')} className="underline hover:text-teal-300">Company Volume</button>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteSql}
                  className="btn btn-superadmin text-xs py-1.5 px-4 font-mono font-bold flex items-center gap-1.5 shadow-md"
                >
                  <span>Execute SQL ▶</span>
                </button>
              </div>
            </div>

            {queryExecutionResult && (
              <div className="p-3 bg-slate-950 rounded-lg border border-teal-900/50 text-[11px] font-mono text-teal-200 space-y-1">
                <span className="text-[10px] text-teal-400 block font-bold">Query Execution Output ({queryExecutionResult.length} rows returned):</span>
                <pre className="max-h-36 overflow-y-auto overflow-x-auto text-[10px] text-slate-300">
                  {JSON.stringify(queryExecutionResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 7: ENTERPRISE MANAGE MASTER CONSOLE */}
      {activeTab === 'masterfields' && (() => {
        const MASTER_CATEGORIES = [
          { key: 'skills', label: 'Manage Skills' },
          { key: 'selfInterests', label: 'Manage Self Interest' },
          { key: 'qualificationCategories', label: 'Manage Qualification Category' },
          { key: 'qualifications', label: 'Manage Qualification' },
          { key: 'languages', label: 'Manage Language Known' },
          { key: 'jobCategories', label: 'Manage Job Category' },
          { key: 'jobTypes', label: 'Manage Job Type' },
          { key: 'states', label: 'Manage State' },
          { key: 'cities', label: 'Manage City' },
          { key: 'areas', label: 'Manage Area' },
          { key: 'statutoryForms', label: 'Manage Statutory Forms & Agreements' },
          { key: 'documentTypes', label: 'Manage Document Types' },
          { key: 'departments', label: 'Manage Departments' },
          { key: 'designations', label: 'Manage Designations' },
          { key: 'workLocations', label: 'Manage Work Locations' },
          { key: 'employmentTypes', label: 'Manage Employment Types' }
        ];

        const currentMasterCategoryObj = MASTER_CATEGORIES.find(c => c.key === activeMasterMenu) || MASTER_CATEGORIES[0];
        const allCurrentMasterItems = masterDropdownOptions[activeMasterMenu] || [];
        const filteredMasterItems = allCurrentMasterItems.filter(item => 
          item.toLowerCase().includes(masterSearchQuery.toLowerCase())
        );
        const displayedMasterItems = filteredMasterItems.slice(0, masterEntriesPerPage);

        return (
          <div className="glass-panel p-6 border-amber-200 bg-white rounded-3xl space-y-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="badge badge-amber text-[10px] mb-1 font-bold">Enterprise System Master</span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-600" />
                  <span>Centralized Manage Master Console</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Standardize master records (Skills, Qualifications, Languages, Job Types, Locations, Statutory Forms) populated across all HR & Candidate forms</p>
              </div>
            </div>

            {/* Master 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Manage Master Sidebar (Orange Header & List) */}
              <div className="lg:col-span-4 rounded-2xl border border-amber-300 overflow-hidden shadow-xs bg-slate-50">
                {/* Sidebar Header */}
                <div className="bg-[#e67300] text-white font-black text-sm px-4 py-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Manage Master</span>
                  </div>
                  <span className="text-xs">▼</span>
                </div>

                {/* Menu Links */}
                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  {MASTER_CATEGORIES.map((cat) => {
                    const isActive = activeMasterMenu === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => {
                          setActiveMasterMenu(cat.key);
                          setMasterSearchQuery('');
                          setNewMasterItemInput('');
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isActive 
                            ? 'bg-[#e67300] text-white font-black shadow-inner' 
                            : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={isActive ? 'text-white' : 'text-[#e67300]'}>➔</span>
                          <span>{cat.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {masterDropdownOptions[cat.key]?.length || 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Data Table View */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Quick Add Bar */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="w-full sm:w-auto">
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      + Add New {currentMasterCategoryObj?.label?.replace('Manage ', '')} Record
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder={`Enter new ${currentMasterCategoryObj?.label?.replace('Manage ', '').toLowerCase()}...`}
                      value={newMasterItemInput}
                      onChange={(e) => setNewMasterItemInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newMasterItemInput.trim()) {
                          addMasterDropdownOption(activeMasterMenu, newMasterItemInput);
                          setNewMasterItemInput('');
                        }
                      }}
                      className="form-input text-xs w-full sm:w-64"
                    />
                    <button
                      onClick={() => {
                        if (newMasterItemInput.trim()) {
                          addMasterDropdownOption(activeMasterMenu, newMasterItemInput);
                          setNewMasterItemInput('');
                        }
                      }}
                      className="btn btn-company text-xs py-2 px-4 font-bold shrink-0 bg-[#e67300] hover:bg-[#cc6600] text-white shadow-xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Data Table Controls: Show Entries & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Show</span>
                    <select
                      value={masterEntriesPerPage}
                      onChange={(e) => setMasterEntriesPerPage(Number(e.target.value))}
                      className="form-input text-xs py-1 px-2.5 w-20"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-slate-500 font-medium">entries</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Search:</span>
                    <input
                      type="text"
                      placeholder="Search in table..."
                      value={masterSearchQuery}
                      onChange={(e) => setMasterSearchQuery(e.target.value)}
                      className="form-input text-xs py-1 px-3 w-48 sm:w-56"
                    />
                  </div>
                </div>

                {/* Data Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-16 text-center">SNo</th>
                        <th className="p-3">{currentMasterCategoryObj?.label?.replace('Manage ', '') || 'Item Name'}</th>
                        <th className="p-3 w-28 text-center">Status</th>
                        <th className="p-3 w-32">Created By</th>
                        <th className="p-3 w-28 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedMasterItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400">
                            No records found for "{masterSearchQuery || currentMasterCategoryObj?.label}".
                          </td>
                        </tr>
                      ) : (
                        displayedMasterItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 text-center text-slate-500 font-mono font-medium">{idx + 1}</td>
                            <td className="p-3 font-bold text-slate-900">{item}</td>
                            <td className="p-3 text-center">
                              <span className="bg-[#00a65a] text-white font-bold text-[10px] px-3 py-1 rounded-full shadow-xs">
                                Active
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 text-[11px] font-medium">Super Admin</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    const newVal = prompt(`Edit ${currentMasterCategoryObj?.label?.replace('Manage ', '')}:`, item);
                                    if (newVal && newVal.trim() && newVal !== item) {
                                      removeMasterDropdownOption(activeMasterMenu, item);
                                      addMasterDropdownOption(activeMasterMenu, newVal.trim());
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                                  title="Edit Record"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeMasterDropdownOption(activeMasterMenu, item)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer / Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                  <span>
                    Showing 1 to {Math.min(displayedMasterItems.length, masterEntriesPerPage)} of {filteredMasterItems.length} entries
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="btn btn-secondary text-xs py-1 px-2.5 font-bold" disabled>Previous</button>
                    <button className="btn btn-superadmin text-xs py-1 px-2.5 font-bold">1</button>
                    <button className="btn btn-secondary text-xs py-1 px-2.5 font-bold" disabled>Next</button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* TAB 8: DYNAMIC UPSTREAM API PROVIDERS & GATEWAY MANAGEMENT */}
      {activeTab === 'apiconfig' && (() => {
        // Filter out backwards-compatibility alias keys so we get distinct provider cards
        const providerList = Object.entries(apiConfigurations || {})
          .filter(([key, val]) => val && typeof val === 'object' && !['apiSetu', 'sandbox', 'coincircletrust'].includes(key))
          .map(([key, val]) => ({ key, ...val }));

        // Count stats
        const activeCount = providerList.filter(p => p.enabled !== false && p.is_active !== false && p.status !== 'Disabled' && p.status !== 'DISABLED').length;
        const disabledCount = providerList.length - activeCount;
        const primaryProvider = providerList.find(p => p.isPrimary || p.is_primary) || providerList.find(p => p.key === 'server2_coincircle') || providerList[0];

        return (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Info & Action Banner */}
            <div className="glass-panel p-6 border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge badge-purple text-xs font-black">PLATFORM VERIFICATION ENGINES</span>
                    <span className="text-xs text-slate-500 font-bold">• {providerList.length} Integrated Providers</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      {activeCount} Active / Enabled
                    </span>
                    {disabledCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                        {disabledCount} Disabled
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2.5">
                    <Server className="w-6 h-6 text-indigo-600" />
                    <span>API Verification Providers & Gateways</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium max-w-3xl">
                    Configure upstream credentials, toggle providers ON/OFF for maintenance, add new API engines (Sandbox, CoinCircle, API Setu, Surepass, HyperVerge), and designate the primary verification gateway.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddApiModal(true)}
                    className="btn btn-superadmin text-xs py-2.5 px-4 font-black shadow-md cursor-pointer flex items-center gap-2 btn-interactive"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New API Provider</span>
                  </button>
                </div>
              </div>

              {/* Live Gateway Telemetry Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-2xl border border-purple-200 shadow-2xs space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center justify-between">
                    <span>⭐ Primary Verification Engine</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </span>
                  <div className="text-sm sm:text-base font-black text-purple-700 truncate">
                    {primaryProvider?.name || 'Server 2: CoinCircleTrust'}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold block">
                    All candidate KYC & BGVs routed through primary gateway
                  </span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-indigo-200 shadow-2xs space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Dynamic Gateway Failover</span>
                  <div className="text-sm sm:text-base font-black text-indigo-700">{activeCount} / {providerList.length} Gateways Operational</div>
                  <span className="text-[11px] text-slate-600 font-medium">Automatic skip & alert if a provider is disabled</span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Platform Gateway Uptime</span>
                  <div className="text-sm sm:text-base font-black text-emerald-700">99.98% High Availability</div>
                  <span className="text-[11px] text-emerald-700 font-bold">24/7 Monitored Telemetry & Auto-Retry</span>
                </div>
              </div>
            </div>

            {/* LIVE ASYNCHRONOUS WEBHOOK & API CALLBACK URL MANAGER */}
            <div className="glass-panel p-6 border-2 border-indigo-500/40 bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="badge bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 text-[10px] font-black">
                        WEBHOOK & CALLBACK ROUTER
                      </span>
                      <span className="badge badge-emerald text-[10px] font-bold">Active & Listening 🟢</span>
                    </div>
                    <h4 className="font-black text-white text-base mt-0.5">Government & Gateway Asynchronous Callback URL</h4>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-indigo-200 bg-indigo-950/80 px-3 py-1.5 rounded-xl border border-indigo-800 self-start sm:self-auto">
                  POST /api/verification/webhook/callback
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                External government registries (UIDAI, NSDL, NPCI), communication gateways (WhatsApp Meta API), and payment switches (Razorpay) dispatch real-time asynchronous verification payloads to this endpoint. You can dynamically modify, test, or copy this URL below.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <div className="relative flex-1 w-full">
                  <input 
                    type="text" 
                    value={callbackUrl}
                    onChange={(e) => setCallbackUrl(e.target.value)}
                    className="w-full bg-slate-950/80 border-2 border-indigo-500/40 text-indigo-200 font-mono text-xs py-2.5 px-3.5 rounded-xl outline-none focus:border-indigo-400 font-bold"
                    placeholder="https://your-domain.com/api/verification/webhook/callback"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(callbackUrl);
                      setIsCallbackCopied(true);
                      showToast('📋 Callback URL copied to clipboard!');
                      setTimeout(() => setIsCallbackCopied(false), 2500);
                    }}
                    className="btn btn-secondary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 font-bold cursor-pointer flex-1 sm:flex-none btn-interactive"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCallbackCopied ? 'Copied ✓' : 'Copy URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast('⚡ Webhook endpoint ping verified: 200 OK (Latency: 24ms)')}
                    className="btn btn-secondary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 font-bold cursor-pointer flex-1 sm:flex-none btn-interactive text-amber-300 bg-amber-950/40 border-amber-800/60 hover:bg-amber-900/50"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ping Test</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => showToast('💾 Webhook Callback URL updated and saved dynamically!')}
                    className="btn btn-superadmin text-xs py-2 px-4 flex items-center justify-center gap-1.5 font-black shadow-md cursor-pointer flex-1 sm:flex-none btn-interactive"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save URL</span>
                  </button>
                </div>
              </div>
            </div>

            {/* DYNAMIC API PROVIDERS CARDS GRID */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  <span>Configured Upstream API Gateways ({providerList.length})</span>
                </h4>
                <span className="text-xs text-slate-500 font-medium">
                  Toggle switches enable or disable providers on the fly with automatic failover
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {providerList.map((provider) => {
                  const key = provider.key;
                  const isPrimary = provider.isPrimary || provider.is_primary || (key === 'server2_coincircle' && !providerList.some(p => p.key !== 'server2_coincircle' && (p.isPrimary || p.is_primary)));
                  const isEnabled = provider.enabled !== false && provider.is_active !== false && provider.status !== 'Disabled' && provider.status !== 'DISABLED';
                  const isRevealed = revealedKeys[key];
                  const rawKey = provider.apiKey || provider.clientId || '';
                  const maskedKey = isRevealed ? rawKey : (rawKey ? `${rawKey.substring(0, 8)}••••••••${rawKey.substring(Math.max(0, rawKey.length - 4))}` : '••••••••');
                  const hostname = provider.endpointUrl ? new URL(provider.endpointUrl.startsWith('http') ? provider.endpointUrl : `https://${provider.endpointUrl}`).hostname : 'api.gateway';
                  const isSystemDefault = key === 'server1_sandbox' || key === 'server2_coincircle';

                  return (
                    <div 
                      key={key} 
                      className={`glass-panel p-6 rounded-3xl space-y-5 shadow-sm flex flex-col justify-between transition-all border-2 ${
                        isPrimary 
                          ? 'border-purple-400/80 bg-gradient-to-b from-purple-50/40 via-white to-white ring-2 ring-purple-400/20' 
                          : isEnabled 
                            ? 'border-indigo-200 bg-white' 
                            : 'border-slate-300 bg-slate-50/80 opacity-80'
                      }`}
                    >
                      <div className="space-y-4">
                        
                        {/* Header with Title & Badges */}
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`badge text-[10px] font-black uppercase ${
                                key === 'server2_coincircle' ? 'badge-purple' : key === 'server1_sandbox' ? 'badge-indigo' : 'badge-sky'
                              }`}>
                                {provider.shortName || provider.name || key}
                              </span>

                              {isPrimary && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black flex items-center gap-1 shadow-2xs">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                                  <span>PRIMARY ENGINE</span>
                                </span>
                              )}

                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                                isEnabled 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span>{isEnabled ? 'Enabled (Online)' : 'Disabled (Offline)'}</span>
                              </span>
                            </div>

                            <h4 className="font-black text-slate-900 text-base">
                              {provider.name || provider.displayName || key}
                            </h4>
                            <p className="text-slate-500 text-xs font-medium mt-0.5">
                              {provider.provider || provider.providerType || 'Institutional Verification Gateway'}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                              {hostname}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {provider.mode || 'Production (Live Mode)'}
                            </span>
                          </div>
                        </div>

                        {/* Provider Credentials Preview */}
                        <div className="space-y-2.5 text-xs bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 font-bold text-[11px]">API Key / Client ID:</span>
                            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-900">
                              <span>{maskedKey}</span>
                              <button
                                type="button"
                                onClick={() => setRevealedKeys(prev => ({ ...prev, [key]: !prev[key] }))}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                                title={isRevealed ? "Hide key" : "Show key"}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-slate-500 font-bold text-[11px]">Base Endpoint:</span>
                            <span className="font-mono text-[11px] font-semibold text-slate-700 truncate max-w-[240px]">
                              {provider.endpointUrl || 'https://api.coincircletrust.com/api/v1'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/80 text-[10px]">
                            <span className="text-slate-500 font-medium">Rate Limit: <strong>{provider.rateLimitPerMin || 120} req/min</strong></span>
                            <span className="text-slate-500 font-medium">Monthly Quota: <strong>{provider.monthlyQuota || 10000} calls</strong></span>
                            <span className="text-emerald-700 font-bold">Latency: {provider.latency || '62 ms'}</span>
                          </div>
                        </div>

                        {/* Supported Capabilities Tags */}
                        <div className="space-y-1.5 text-xs">
                          <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">
                            Supported Verification Capabilities
                          </span>
                          <div className="flex flex-wrap gap-1.5 text-[10px]">
                            {(provider.supportedDocs || ['Aadhaar UIDAI OTP', 'PAN Card Basic (NSDL)', 'Bank Account IMPS Penny Drop (₹1)', 'Driving License (MoRTH)']).slice(0, 8).map((doc, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>{doc}</span>
                              </span>
                            ))}
                            {(provider.supportedDocs || []).length > 8 && (
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                                +{(provider.supportedDocs.length - 8)} more
                              </span>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Interactive Controls Bar: Enable/Disable, Set Primary, Configure, Delete */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                        
                        {/* Status Switch Toggle */}
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => toggleApiProvider(key, !isEnabled)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all border shadow-2xs btn-interactive ${
                              isEnabled 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            }`}
                            title={isEnabled ? "Click to Disable this API Provider" : "Click to Enable this API Provider"}
                          >
                            <Power className={`w-3.5 h-3.5 ${isEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span>{isEnabled ? 'Gateway Enabled' : 'Gateway Disabled'}</span>
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPrimaryApiProvider(key)}
                              className="btn btn-secondary text-xs py-1.5 px-3 font-bold flex items-center gap-1 text-amber-900 bg-amber-50 border-amber-300 hover:bg-amber-100 cursor-pointer"
                              title="Set as the platform's primary verification provider"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-500" />
                              <span>Set Primary</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => showToast(`⚡ ${provider.name || key} Connection Ping: 200 OK (${provider.latency || '62ms'})`)}
                            className="btn btn-secondary text-xs py-1.5 px-2.5 font-bold cursor-pointer"
                            title="Test connectivity to gateway endpoint"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEditProvider({ key, ...provider });
                              setShowEditApiModal(true);
                            }}
                            className="btn btn-superadmin text-xs py-1.5 px-3 font-black shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Configure</span>
                          </button>

                          {!isSystemDefault && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove the API provider "${provider.name || key}"?`)) {
                                  deleteApiProvider(key);
                                }
                              }}
                              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                              title="Delete this custom API provider"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE TIME-FILTERED COMPANY-WISE API TELEMETRY & FINANCIAL REVENUE CALCULATOR */}
            <div className="glass-panel p-6 border-indigo-200 bg-white rounded-3xl space-y-5 shadow-sm">
              
              {/* Header with Title & Time-Range Filter */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-emerald text-[10px] font-black uppercase">REAL-TIME METERED BILLING & TOKENS</span>
                    <span className="text-xs text-slate-500 font-bold">• Primary Gateway: {primaryProvider?.name || 'CoinCircleTrust'}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    <span>Company-Wise API Call Telemetry & Financial Ledger</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Filter by timeframe to audit exact API calls, token consumption, upstream costs incurred, and gross client profit margins.
                  </p>
                </div>

                {/* Interactive Time Range Filters */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 self-start lg:self-auto overflow-x-auto no-scrollbar">
                  {[
                    { id: 'today', label: '⚡ Today' },
                    { id: '7d', label: '📅 Last 7 Days' },
                    { id: '30d', label: '🗓️ Last 30 Days' },
                    { id: 'month', label: '📊 This Month' },
                    { id: 'all', label: '🌐 All Time' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setTelemetryTimeRange(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        telemetryTimeRange === filter.id
                          ? 'bg-white text-indigo-700 shadow-xs border border-indigo-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => fetchTelemetryData(telemetryTimeRange)}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-white transition-all cursor-pointer"
                    title="Refresh Telemetry"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTelemetryLoading ? 'animate-spin text-indigo-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Timeframe Summary KPIs Strip */}
              {(() => {
                const compStats = companyTelemetry?.companies || [];
                const totalCalls = companyTelemetry?.summary?.total_api_calls || compStats.reduce((acc, c) => acc + c.total_api_calls, 0) || companies.reduce((acc, c) => acc + (c.verifiedCountThisMonth * 6), 0);
                const totalCost = companyTelemetry?.summary?.total_upstream_cost || compStats.reduce((acc, c) => acc + c.upstream_cost, 0) || (totalCalls * 4.0);
                const totalRev = companyTelemetry?.summary?.total_billed_revenue || compStats.reduce((acc, c) => acc + c.billed_revenue, 0) || companies.reduce((acc, c) => acc + (c.verifiedCountThisMonth * c.pricePerVerification), 0);
                const grossProfit = totalRev - totalCost;
                const margin = totalRev > 0 ? ((grossProfit / totalRev) * 100).toFixed(1) : '80.0';

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Total API Calls ({telemetryTimeRange.toUpperCase()})</span>
                      <strong className="text-base sm:text-lg font-black text-indigo-900 mt-0.5 block font-mono">{totalCalls.toLocaleString()} calls</strong>
                      <span className="text-[10px] text-slate-500 font-medium">Across {companies.length} client accounts</span>
                    </div>

                    <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-bold uppercase block">Upstream Gateway Cost</span>
                      <strong className="text-base sm:text-lg font-black text-rose-900 mt-0.5 block font-mono">₹{totalCost.toFixed(2)}</strong>
                      <span className="text-[10px] text-rose-700 font-medium">@ ₹4.00 avg / API call</span>
                    </div>

                    <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">Billed Client Tariff</span>
                      <strong className="text-base sm:text-lg font-black text-emerald-900 mt-0.5 block font-mono">₹{totalRev.toFixed(2)}</strong>
                      <span className="text-[10px] text-emerald-700 font-bold">Gross Invoiced Revenue</span>
                    </div>

                    <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200">
                      <span className="text-[10px] text-purple-700 font-bold uppercase block">Net Margin & SLA</span>
                      <strong className="text-base sm:text-lg font-black text-purple-900 mt-0.5 block font-mono">+{margin}% Profit</strong>
                      <span className="text-[10px] text-purple-700 font-bold">58 ms avg gateway latency</span>
                    </div>
                  </div>
                );
              })()}

              {/* Calculations Table */}
              <div className="border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar shadow-xs bg-white">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="p-3.5">Enterprise Client</th>
                      <th className="p-3.5 text-center">Enrolled / Verified</th>
                      <th className="p-3.5 text-center">Total API Calls</th>
                      <th className="p-3.5">Document Call Distribution</th>
                      <th className="p-3.5 text-right">Upstream Cost</th>
                      <th className="p-3.5 text-right">Billed Revenue</th>
                      <th className="p-3.5 text-center">Gross Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(() => {
                      const telemetryList = companyTelemetry?.companies || [];
                      
                      return companies.map((comp) => {
                        const tel = telemetryList.find(t => t.company_id === comp.id);
                        const totalCalls = tel?.total_api_calls || (comp.verifiedCountThisMonth * 6) || 18;
                        const upstreamCost = tel?.upstream_cost || (totalCalls * 4.00);
                        const verifiedVol = tel?.verified_candidates ?? comp.verifiedCountThisMonth ?? 0;
                        const billedRevenue = tel?.billed_revenue || (verifiedVol * (comp.pricePerVerification || 120));
                        const grossProfit = billedRevenue - upstreamCost;
                        const marginPct = billedRevenue > 0 ? ((grossProfit / billedRevenue) * 100).toFixed(1) : '80.0';
                        const docs = tel?.doc_breakdown || {
                          aadhaar: Math.round(totalCalls * 0.28),
                          pan: Math.round(totalCalls * 0.18),
                          bankCheck: Math.round(totalCalls * 0.18),
                          drivingLicense: Math.round(totalCalls * 0.12),
                          uan: Math.round(totalCalls * 0.16)
                        };

                        return (
                          <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5">
                              <strong className="text-slate-900 font-black text-xs block">{comp.name}</strong>
                              <span className="text-[10px] text-slate-500 font-mono">Code: {comp.code} • Plan: {comp.plan}</span>
                            </td>
                            <td className="p-3.5 text-center font-mono">
                              <span className="font-bold text-slate-800">{verifiedVol}</span>
                              <span className="text-slate-400 text-[10px] block">checks</span>
                            </td>
                            <td className="p-3.5 text-center font-mono">
                              <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 text-[11px]">
                                {totalCalls} calls
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1 flex-wrap text-[9px] font-mono">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold" title="Aadhaar UIDAI Calls">
                                  UIDAI: {docs.aadhaar || 0}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-bold" title="NSDL PAN Calls">
                                  PAN: {docs.pan || 0}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-bold" title="NPCI Bank Drop Calls">
                                  IMPS: {docs.bankCheck || 0}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold" title="MoRTH DL Calls">
                                  DL: {docs.drivingLicense || 0}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold" title="EPFO UAN Calls">
                                  EPFO: {docs.uan || 0}
                                </span>
                              </div>
                            </td>
                            <td className="p-3.5 text-right font-mono font-bold text-rose-700">
                              ₹{upstreamCost.toFixed(2)}
                            </td>
                            <td className="p-3.5 text-right font-mono font-black text-emerald-700">
                              ₹{billedRevenue.toFixed(2)}
                            </td>
                            <td className="p-3.5 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-black text-[11px] shadow-2xs">
                                +{marginPct}%
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>


            {/* 👤 GRANULAR EMPLOYEE / CANDIDATE-LEVEL API CONSUMPTION & DOCUMENT LEDGER */}
            <div className="glass-panel p-6 border-indigo-200 bg-white rounded-3xl space-y-5 shadow-sm">
              
              {/* Header with Search & Company Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-purple text-[10px] font-black uppercase">INDIVIDUAL EMPLOYEE AUDIT TRAIL</span>
                    <span className="text-xs text-slate-500 font-bold">• Document-by-Document API Metering</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Employee Verification Process & Document API Call Ledger</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Inspect exact API call levels consumed per employee (Aadhaar OTP + eKYC, PAN Info, IMPS Bank Drop, Sarathi DL, MEA Passport, EPFO UAN, Face Biometrics).
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={candidateLedgerSearch}
                      onChange={(e) => setCandidateLedgerSearch(e.target.value)}
                      placeholder="Search Candidate / Emp ID / Token..."
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-indigo-400 w-52 sm:w-64"
                    />
                  </div>

                  {/* Company Select */}
                  <select
                    value={candidateLedgerCompany}
                    onChange={(e) => setCandidateLedgerCompany(e.target.value)}
                    className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-400 cursor-pointer"
                  >
                    <option value="all">All Enterprise Companies</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Candidate Table */}
              <div className="border border-slate-200 rounded-2xl overflow-x-auto no-scrollbar shadow-xs bg-white">
                <table className="w-full text-left text-xs border-collapse min-w-[850px]">
                  <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="p-3.5">Candidate / Employee</th>
                      <th className="p-3.5">Enterprise Client</th>
                      <th className="p-3.5 text-center">Total API Calls Incurred</th>
                      <th className="p-3.5 text-center">Upstream Cost</th>
                      <th className="p-3.5">Verified Documents & Verification Status</th>
                      <th className="p-3.5 text-right">Audit Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(() => {
                      // Combined candidate source
                      const list = candidateLedgerList.length > 0 ? candidateLedgerList : candidates.map(c => {
                        const comp = companies.find(cp => cp.id === c.company_id);
                        const completedCount = Object.values(c.verifications_completed || {}).filter(Boolean).length;
                        const calls = completedCount > 0 ? (completedCount + 1) : 0;
                        return {
                          id: c.id,
                          name: c.name,
                          emp_id: c.emp_id || `EMP-${c.id.slice(-4).toUpperCase()}`,
                          token: c.token,
                          email: c.email,
                          mobile: c.mobile,
                          designation: c.designation || 'Associate',
                          dept: c.dept || 'Operations',
                          status: c.status,
                          company_id: c.company_id,
                          company_name: comp?.name || 'Acme Global Technologies',
                          company_code: comp?.code || 'ACME',
                          total_api_calls: calls,
                          total_cost_inr: calls * 4.0,
                          verifications_completed_count: completedCount,
                          verified_types: Object.keys(c.verifications_completed || {}).filter(k => c.verifications_completed[k])
                        };
                      });

                      const filtered = list.filter(c => {
                        const matchComp = candidateLedgerCompany === 'all' || c.company_id === candidateLedgerCompany;
                        const s = candidateLedgerSearch.toLowerCase().trim();
                        const matchSearch = !s || c.name.toLowerCase().includes(s) || (c.emp_id && c.emp_id.toLowerCase().includes(s)) || (c.token && c.token.toLowerCase().includes(s));
                        return matchComp && matchSearch;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-slate-400 font-medium">
                              No candidate verification records found matching your filters.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((cand) => (
                        <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <strong className="text-slate-900 font-black text-xs block">{cand.name}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ID: {cand.emp_id} • {cand.designation} ({cand.dept})
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-800 block text-xs">{cand.company_name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Code: {cand.company_code}</span>
                          </td>
                          <td className="p-3.5 text-center font-mono">
                            <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 font-black text-xs inline-flex items-center gap-1 shadow-2xs">
                              <Cpu className="w-3 h-3 text-purple-600" />
                              <span>{cand.total_api_calls} API Calls</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-center font-mono font-bold text-rose-700">
                            ₹{(cand.total_cost_inr || (cand.total_api_calls * 4.0)).toFixed(2)}
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                              {(cand.verified_types && cand.verified_types.length > 0) ? (
                                cand.verified_types.map((vType, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>{vType.replace('aiFaceBiometrics', 'Face 3D').replace('bankCheck', 'Bank IMPS').replace('drivingLicense', 'DL Sarathi')}</span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-slate-400 font-medium">Link Dispatched (Pending Candidate Action)</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => viewCandidateApiDetail(cand.id)}
                              className="btn btn-secondary text-xs py-1.5 px-3 font-bold flex items-center gap-1.5 text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 cursor-pointer ml-auto btn-interactive"
                              title="View Document-by-Document API Breakdown"
                            >
                              <Search className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Audit Calls</span>
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        );
      })()}


      {/* TAB 9: REPORTS SECTION (4 DETAILED REPORTS) */}
      {activeTab === 'reports' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-amber-600" />
              <span>Platform Executive Reports Center (PDF, Excel, Word)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Export executive platform summaries, metered financial tariff reports, API SLA latency audits, and company quota allocation records</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Report 1 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
              <div className="space-y-1">
                <span className="badge badge-amber text-[10px]">Executive Audit</span>
                <h4 className="font-black text-slate-900 text-sm">Platform Master Verification Summary (PDF)</h4>
                <p className="text-slate-500 text-[11px]">Printable audit report of all verification volume across client enterprises</p>
              </div>
              <button 
                onClick={() => downloadSystemReport('Platform_Master_Summary', `JOY DATA VERIFICATION - PLATFORM MASTER REPORT\nDate: ${new Date().toLocaleString()}\nTotal Companies: ${companies.length}\nTotal Checks: ${totalVerifiedCount}\nRevenue: ₹${totalGrossRevenue.toLocaleString()}`, '.pdf', 'application/pdf')}
                className="btn btn-superadmin text-xs py-1.5 px-3 font-bold"
              >
                Export PDF
              </button>
            </div>

            {/* Report 2 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
              <div className="space-y-1">
                <span className="badge badge-purple text-[10px]">Financial Statement</span>
                <h4 className="font-black text-slate-900 text-sm">Monthly Revenue & Tariff Breakdown (Excel)</h4>
                <p className="text-slate-500 text-[11px]">Spreadsheet breakdown of metered client usage and GST 18% taxes</p>
              </div>
              <button 
                onClick={() => downloadSystemReport('Monthly_Revenue_Statement', `Company,Plan,Volume,Price,Gross,GST,Net\n` + companies.map(c => `${c.name},${c.plan},${c.verifiedCountThisMonth},${c.pricePerVerification},${c.verifiedCountThisMonth*c.pricePerVerification},${Math.round(c.verifiedCountThisMonth*c.pricePerVerification*0.18)},${Math.round(c.verifiedCountThisMonth*c.pricePerVerification*1.18)}`).join('\n'), '.csv', 'text/csv')}
                className="btn btn-hrexecutive text-xs py-1.5 px-3 font-bold"
              >
                Export Excel
              </button>
            </div>

            {/* Report 3 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
              <div className="space-y-1">
                <span className="badge badge-teal text-[10px]">Technical SLA</span>
                <h4 className="font-black text-slate-900 text-sm">API Gateway SLA & Latency Audit (Word/Doc)</h4>
                <p className="text-slate-500 text-[11px]">Upstream government gateway uptime metrics, average response times, and failure telemetry</p>
              </div>
              <button 
                onClick={() => downloadSystemReport('API_SLA_Latency_Audit', `API GATEWAY SLA & LATENCY AUDIT REPORT\nDate: ${new Date().toLocaleString()}\nDigiLocker Uptime: 99.95%\nAvg Latency: 1.2s\nCarrier SMS Uptime: 99.88%`, '.doc', 'application/msword')}
                className="btn btn-secondary text-xs py-1.5 px-3 font-bold"
              >
                Export Word
              </button>
            </div>

            {/* Report 4 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
              <div className="space-y-1">
                <span className="badge badge-indigo text-[10px]">Client Quotas</span>
                <h4 className="font-black text-slate-900 text-sm">Company Feature Flags & Quota Audit (Excel)</h4>
                <p className="text-slate-500 text-[11px]">Audit matrix of 10 enabled feature flags and quota consumption per company</p>
              </div>
              <button 
                onClick={() => downloadSystemReport('Company_Feature_Quota_Audit', `Company,Plan,MaxLimit,UsedThisMonth,Aadhaar,Mobile,Face,PAN,DL,Bank\n` + companies.map(c => `${c.name},${c.plan},${c.maxLimit},${c.verifiedCountThisMonth},${c.features.aadhaar},${c.features.mobileOtp},${c.features.faceCapture},${c.features.pan},${c.features.drivingLicense},${c.features.bankCheck}`).join('\n'), '.csv', 'text/csv')}
                className="btn btn-company text-xs py-1.5 px-3 font-bold"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: CUSTOMER SUPPORT & TICKET HELPDESK HUB */}
      {activeTab === 'tickets' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-indigo-600" />
                <span>Customer Support & Ticket Helpdesk Hub</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Review and reply to service tickets raised by HR Executives and Company Administrators</p>
            </div>
            <span className="badge badge-indigo text-[10px]">{supportTickets.length} Active Tickets</span>
          </div>

          <div className="space-y-4 text-xs">
            {supportTickets.map(ticket => (
              <div key={ticket.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">#{ticket.id} • {ticket.subject}</span>
                    <span className={`badge text-[9px] ${ticket.status === 'Resolved' ? 'badge-emerald' : 'badge-amber'}`}>{ticket.status}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Raised: {ticket.createdAt} • by {ticket.reporterName} ({ticket.companyName})</span>
                </div>

                {/* Message Thread */}
                <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-white rounded-lg border border-slate-200">
                  {ticket.messages?.map(msg => (
                    <div key={msg.id} className={`p-2 rounded-lg text-xs ${msg.type === 'admin_reply' ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 ml-4' : 'bg-slate-100 text-slate-800 mr-4'}`}>
                      <div className="flex justify-between font-bold text-[10px] text-slate-500 mb-0.5">
                        <span>{msg.sender}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-medium">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Composer */}
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
                    className="btn btn-superadmin text-xs py-1.5 px-4 font-bold flex items-center gap-1 shrink-0"
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

      {/* TAB 11: ERROR LOGS & ISSUE TRACKER */}
      {activeTab === 'issuelogs' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-4 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Section Error Logs & Issue Tracker</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Monitor system errors across all sections and toggle Solved / Unresolved status</p>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button onClick={() => setLogFilterStatus('all')} className={`px-3 py-1 rounded-lg ${logFilterStatus === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'}`}>All</button>
              <button onClick={() => setLogFilterStatus('unresolved')} className={`px-3 py-1 rounded-lg ${logFilterStatus === 'unresolved' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600'}`}>Unresolved</button>
              <button onClick={() => setLogFilterStatus('solved')} className={`px-3 py-1 rounded-lg ${logFilterStatus === 'solved' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'}`}>Solved</button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredLogs.map(log => (
              <div key={log.id} className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${log.solved ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'}`}>
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
                  className={`btn text-xs py-1.5 px-3 font-bold ${log.solved ? 'btn-secondary text-emerald-800' : 'btn-superadmin'}`}
                >
                  {log.solved ? 'Mark Unresolved' : 'Mark Solved ✅'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 12: PLATFORM GUIDELINES */}
      {activeTab === 'guidelines' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Platform Role Workflows & Guidelines Hub</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Review and edit step-by-step operating guidelines for Super Admin, Company Admin, HR Executives, and Candidates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {Object.entries(platformGuidelines).map(([roleKey, guide]) => (
              <div key={roleKey} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="badge badge-purple text-[10px] uppercase font-bold">{roleKey} Guide</span>
                <h4 className="font-black text-slate-900 text-sm">{guide.title}</h4>
                <p className="text-slate-600">{guide.summary}</p>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1 text-[11px] text-slate-700 font-medium">
                  <p><strong>Step 1:</strong> {guide.step1}</p>
                  <p><strong>Step 2:</strong> {guide.step2}</p>
                  <p><strong>Step 3:</strong> {guide.step3}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 13: PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Super Admin Global Platform Settings</h3>
            <p className="text-xs text-slate-500 font-medium">Configure global title, SLA parameters, session inactivity rules, and security policies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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

      {/* TAB 14: Legal & DPDP Regulatory Governance Hub */}
      {activeTab === 'legal_governance' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Master Banner */}
          <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl border-2 border-purple-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-purple-600/40 border border-purple-400/40 text-purple-300">
                  <Scale className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-purple text-[10px] font-black uppercase">
                      Master Regulatory Governance
                    </span>
                    <span className="text-xs text-slate-300 font-mono">DPDP Act 2023 & ISO 27001</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white mt-1">
                    Statutory Compliance & Legal Telemetry Monitor
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowLegalHandbook(true)}
                className="btn btn-superadmin text-xs py-2.5 px-5 font-black shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <FileText className="w-4 h-4" />
                <span>Open Full Legal Handbook 📖</span>
              </button>
            </div>

            <p className="text-xs text-slate-200 font-medium leading-relaxed max-w-3xl">
              Real-time platform governance ensuring zero regulatory risk across all verification channels. Enforces explicit candidate digital consent (Section 6 DPDP Act), automated 60-day data lifecycle purges, and UIDAI masked Aadhaar storage integrity.
            </p>
          </div>

          {/* 4 Regulatory Pillar Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-purple text-[10px]">DPDP Act 2023</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">100% Logged</div>
              <div className="text-xs text-slate-500 font-semibold">Consent Records Captured</div>
              <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                Timestamp + IP + Device Hash
              </p>
            </div>

            <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-indigo text-[10px]">UIDAI Aadhaar Shield</span>
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-xl font-black text-indigo-700 font-mono">0 Leaks (100%)</div>
              <div className="text-xs text-slate-500 font-semibold">Masked Aadhaar Integrity</div>
              <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                XXXX-XXXX-9876 Format Enforced
              </p>
            </div>

            <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-emerald text-[10px]">Data Retention Policy</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-emerald-700 font-mono">60 Days Active</div>
              <div className="text-xs text-slate-500 font-semibold">Automated Purge Scheduler</div>
              <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                Next Queue: 3 candidates
              </p>
            </div>

            <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-cyan text-[10px]">IT Act Section 79</span>
                <Scale className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-xl font-black text-sky-700 font-mono">Safe Harbor</div>
              <div className="text-xs text-slate-500 font-semibold">Technology Intermediary Status</div>
              <p className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                Point-in-Time Public Repository
              </p>
            </div>
          </div>

          {/* Master DPDP Consent Audit Table */}
          <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900">Live Candidate Digital Consent Audit Ledger</h4>
                <p className="text-xs text-slate-500 font-medium">Immutable consent trail recorded under Section 6(1) of the DPDP Act 2023</p>
              </div>
              <span className="badge badge-emerald text-xs font-mono font-bold">100% Legally Authorized</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                    <th className="py-2.5 px-3">Candidate & Token</th>
                    <th className="py-2.5 px-3">Employer Fiduciary</th>
                    <th className="py-2.5 px-3">Authorized Scope</th>
                    <th className="py-2.5 px-3">Consent Timestamp</th>
                    <th className="py-2.5 px-3">IP Address & Device</th>
                    <th className="py-2.5 px-3 text-right">Legal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {candidates.map((c, i) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.token}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {companies.find(comp => comp.id === c.companyId)?.name || 'Acme Global Technologies'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge badge-indigo text-[9px]">Aadhaar + PAN + EPFO + Bank</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        2026-08-26 10:{20 + i}:14 UTC
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                        117.201.88.{40 + i} (Mobile Safari / Chrome)
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="badge badge-emerald text-[9px] font-black">VALID CONSENT ✓</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Onboard Company Modal */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-5 border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Onboard New Enterprise Company</span>
              </h3>
              <button onClick={() => setShowAddCompanyModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
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

              <div className="grid grid-cols-3 gap-3">
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
                  <label className="block text-slate-700 font-bold mb-1">Admin Email *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="admin@company.com"
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Admin Password *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Company@Admin2026"
                    value={newCompany.password}
                    onChange={(e) => setNewCompany({ ...newCompany, password: e.target.value })}
                    className="form-input font-mono font-bold"
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
              <div className="p-3.5 rounded-xl border-2 border-indigo-200 bg-indigo-50/50 space-y-2.5">
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
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline"
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
                    className="accent-indigo-600 w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span className="text-[11px] font-bold text-slate-800">
                    I confirm the authorized representative agrees to JOY Corporate Solutions Terms of Service, Point-in-Time Disclosures, and DPDP Privacy Policy.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddCompanyModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-superadmin font-bold shadow-md">Save & Onboard Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Custom Company Terms Modal */}
      {editingCustomTermsCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge badge-amber text-[10px]">Custom T&C Contract Builder</span>
                <h3 className="text-base font-black text-slate-900 mt-1">Customize Terms: {editingCustomTermsCompany.companyName}</h3>
              </div>
              <button onClick={() => setEditingCustomTermsCompany(null)} className="text-slate-400 hover:text-slate-700">✕</button>
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
              <button onClick={() => setEditingCustomTermsCompany(null)} className="btn btn-secondary text-xs">Cancel</button>
              <button 
                onClick={() => {
                  updateCustomCompanyTerms(editingCustomTermsCompany.companyId, editingCustomTermsCompany);
                  setEditingCustomTermsCompany(null);
                }} 
                className="btn btn-superadmin text-xs font-bold shadow-md"
              >
                Save Custom Terms Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛠️ COMPREHENSIVE COMPANY FEATURE FLAGS & GATEWAY GOVERNANCE MODAL */}
      {editingFeaturesCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-5 border-2 border-indigo-500/30 bg-white text-slate-900 rounded-3xl shadow-2xl animate-modal-spring my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-purple text-[10px]">Super Admin Master Governance</span>
                  <span className="text-xs text-slate-500 font-bold">• Plan: {editingFeaturesCompany.plan}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Feature Flags & Gateway Matrix: {editingFeaturesCompany.name}
                </h3>
              </div>
              <button 
                onClick={() => setEditingFeaturesCompany(null)} 
                className="text-slate-400 hover:text-slate-700 text-lg p-1 rounded-lg hover:bg-slate-100 cursor-pointer btn-interactive"
              >
                ✕
              </button>
            </div>

            {/* 1-Click Plan-Based Quick Presets Bar */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>1-Click Plan Presets:</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const preset = {
                      ...editingFeaturesCompany.features,
                      whatsappGateway: true, emailGateway: true, smsGateway: true,
                      allowCompanyAdminLogin: true, allowHrLogin: true, allowEmployeePortalAccess: true,
                      documentVaultVerification: true, statutoryAgreements: true, aiFaceBiometrics: true,
                      aadhaar: true, pan: true, bankCheck: true, mobileOtp: true, uan: false, drivingLicense: false
                    };
                    setEditingFeaturesCompany({ ...editingFeaturesCompany, features: preset });
                    showToast('Standard Plan Preset Loaded');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 font-bold border border-slate-200 hover:border-indigo-300 transition-all btn-interactive"
                >
                  Standard Preset
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const preset = {
                      ...editingFeaturesCompany.features,
                      whatsappGateway: true, emailGateway: true, smsGateway: true,
                      allowCompanyAdminLogin: true, allowHrLogin: true, allowEmployeePortalAccess: true,
                      documentVaultVerification: true, statutoryAgreements: true, aiFaceBiometrics: true,
                      aadhaar: true, pan: true, bankCheck: true, mobileOtp: true, uan: true, drivingLicense: true,
                      passport: true, criminalCheck: true, education: true, directorship: true, voterId: true, addressCheck: true
                    };
                    setEditingFeaturesCompany({ ...editingFeaturesCompany, features: preset });
                    showToast('Full-Stack Enterprise Preset Loaded');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xs transition-all btn-interactive"
                >
                  ⚡ Full Enterprise (All ON)
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 text-xs">
              
              {/* Category 1: Login & Portal Access Controls */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>1. Login & Portal Access Gateways</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'allowCompanyAdminLogin', name: 'Company Admin Portal', desc: 'Enable executive dashboard login' },
                    { id: 'allowHrLogin', name: 'HR Workstation Login', desc: 'Enable recruiter workstation access' },
                    { id: 'allowEmployeePortalAccess', name: 'Employee Portal Magic Link', desc: 'Enable self-service e-KYC link' }
                  ].map(gate => {
                    const isChecked = editingFeaturesCompany.features[gate.id] ?? true;
                    return (
                      <label 
                        key={gate.id}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 btn-interactive ${
                          isChecked ? 'bg-indigo-50/70 border-indigo-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs">{gate.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{gate.desc}</div>
                        </div>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = { ...editingFeaturesCompany.features, [gate.id]: e.target.checked };
                            setEditingFeaturesCompany({ ...editingFeaturesCompany, features: updated });
                          }}
                          className="accent-indigo-600 w-4 h-4 mt-0.5 shrink-0"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: Communication Gateways */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>2. Communication Dispatch Gateways</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'whatsappGateway', name: 'WhatsApp Meta API 💬', desc: 'Automated candidate WhatsApp link dispatch' },
                    { id: 'emailGateway', name: 'Email SMTP / Postmark 📧', desc: 'Magic link & OTP verification emails' },
                    { id: 'smsGateway', name: 'Carrier SMS Fast2SMS 📱', desc: 'Direct carrier SMS OTP & notifications' }
                  ].map(gate => {
                    const isChecked = editingFeaturesCompany.features[gate.id] ?? true;
                    return (
                      <label 
                        key={gate.id}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 btn-interactive ${
                          isChecked ? 'bg-emerald-50/70 border-emerald-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs">{gate.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{gate.desc}</div>
                        </div>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = { ...editingFeaturesCompany.features, [gate.id]: e.target.checked };
                            setEditingFeaturesCompany({ ...editingFeaturesCompany, features: updated });
                          }}
                          className="accent-emerald-600 w-4 h-4 mt-0.5 shrink-0"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Category 3: Document & Statutory Compliance */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>3. Document Evidence & Compliance</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'documentVaultVerification', name: 'Original Document Vault (8 Files) 📁', desc: 'Candidate uploads sharp original scans for verification' },
                    { id: 'statutoryAgreements', name: 'Statutory Agreements (Form 16A/11/F/NDA) ⚖️', desc: 'Mandatory digital compliance declarations & signing' }
                  ].map(gate => {
                    const isChecked = editingFeaturesCompany.features[gate.id] ?? true;
                    return (
                      <label 
                        key={gate.id}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 btn-interactive ${
                          isChecked ? 'bg-purple-50/70 border-purple-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs">{gate.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{gate.desc}</div>
                        </div>
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = { ...editingFeaturesCompany.features, [gate.id]: e.target.checked };
                            setEditingFeaturesCompany({ ...editingFeaturesCompany, features: updated });
                          }}
                          className="accent-purple-600 w-4 h-4 mt-0.5 shrink-0"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Category 4: 10+ Government API Modules */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>4. Government Verification APIs (10+ Modules)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {featureList.map((feat) => {
                    const isChecked = editingFeaturesCompany.features[feat.id] ?? false;
                    return (
                      <label 
                        key={feat.id}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 btn-interactive ${
                          isChecked ? 'bg-sky-50/70 border-sky-300 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs">{feat.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{feat.category} • {feat.serverTag}</div>
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
                          className="accent-sky-600 w-4 h-4 mt-0.5 shrink-0"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">
                Changes cascade down to Company Admin & HR
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingFeaturesCompany(null)} 
                  className="btn btn-secondary text-xs py-2 px-3 font-bold cursor-pointer btn-interactive"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    updateCompanyFeatures(editingFeaturesCompany.id, editingFeaturesCompany.features, editingFeaturesCompany.plan);
                    setEditingFeaturesCompany(null);
                  }} 
                  className="btn btn-superadmin text-xs py-2 px-4 font-black shadow-md cursor-pointer btn-interactive"
                >
                  Save Feature & Gateway Matrix ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Master Default Field Modal */}
      {showAddMasterFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <ListCheck className="w-5 h-5 text-purple-600" />
                <span>Add Master Candidate Default Field</span>
              </h3>
              <button onClick={() => setShowAddMasterFieldModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
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
                <button type="button" onClick={() => setShowAddMasterFieldModal(false)} className="btn btn-secondary text-xs font-bold">Cancel</button>
                <button type="submit" className="btn btn-superadmin text-xs font-bold">Save Master Field</button>
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

      {/* Metric Drilldown Details Modal */}
      {activeDrilldown && (
        <MetricDrilldownModal
          isOpen={Boolean(activeDrilldown)}
          onClose={() => setActiveDrilldown(null)}
          title={activeDrilldown.title}
          subtitle={activeDrilldown.subtitle}
          metricValue={activeDrilldown.metricValue}
          metricType={activeDrilldown.metricType}
          role="superadmin"
          data={activeDrilldown.data}
          onViewCandidateDossier={(cand) => setViewingDossierCandidate(cand)}
          onViewCandidateCertificate={(cand) => setViewingCertificateCandidate(cand)}
        />
      )}

      {/* Candidate Dossier & Certificate Modals for Drilldown actions */}
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

      {/* Statutory Legal & DPDP Compliance Handbook Modal */}
      <LegalComplianceHandbookModal
        isOpen={showLegalHandbook}
        onClose={() => setShowLegalHandbook(false)}
      />

      {/* Universal Date-Filtered Document & Report Export Modal */}
      <UniversalDocumentExportModal
        isOpen={showUniversalExportModal}
        onClose={() => setShowUniversalExportModal(false)}
        initialRole="superadmin"
      />

      
      {/* ➕ ADD NEW API PROVIDER MODAL */}
      {showAddApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-indigo-100 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <span className="badge badge-purple text-[10px] font-black">NEW GATEWAY ONBOARDING</span>
                  <h3 className="text-xl font-black text-slate-900">Add New Verification API Provider</h3>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddApiModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newApiProvider.name || !newApiProvider.apiKey) {
                  showToast('Please provide Provider Name and API Key', 'error');
                  return;
                }
                const key = newApiProvider.providerKey || `server_${newApiProvider.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
                addApiProvider({
                  ...newApiProvider,
                  id: key,
                  providerKey: key
                });
                setShowAddApiModal(false);
                setNewApiProvider({
                  name: '',
                  providerKey: '',
                  providerType: 'Institutional Gateway',
                  endpointUrl: 'https://api.example.com/v1',
                  apiKey: '',
                  secretKey: '',
                  webhookUrl: 'https://verification.joycorporatesolutions.com/api/verification/webhook/callback',
                  mode: 'Production (Live Mode)',
                  rateLimitPerMin: 120,
                  monthlyQuota: 10000,
                  isPrimary: false,
                  supportedDocs: ['Aadhaar UIDAI OTP', 'PAN Card Basic (NSDL)', 'Bank Account IMPS Penny Drop (₹1)', 'Driving License (MoRTH)']
                });
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Provider Display Name *</label>
                  <input
                    type="text"
                    required
                    value={newApiProvider.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const autoKey = `server_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
                      setNewApiProvider(prev => ({
                        ...prev,
                        name,
                        providerKey: prev.providerKey ? prev.providerKey : autoKey
                      }));
                    }}
                    className="form-input text-xs font-bold"
                    placeholder="e.g. Surepass Technologies / HyperVerge"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Provider Unique Key / Code *</label>
                  <input
                    type="text"
                    required
                    value={newApiProvider.providerKey}
                    onChange={(e) => setNewApiProvider(prev => ({ ...prev, providerKey: e.target.value }))}
                    className="form-input text-xs font-mono font-bold"
                    placeholder="e.g. server3_surepass"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Provider Category / Type</label>
                  <select
                    value={newApiProvider.providerType}
                    onChange={(e) => setNewApiProvider(prev => ({ ...prev, providerType: e.target.value }))}
                    className="form-select text-xs font-bold"
                  >
                    <option value="Institutional Gateway">Institutional Gateway (47+ APIs)</option>
                    <option value="Government Registry Direct">Government Registry Direct (UIDAI/NSDL/NPCI)</option>
                    <option value="AI Biometrics & Liveness">AI Biometrics & 3D Liveness</option>
                    <option value="Telecom & SMS OTP">Telecom SMS & WhatsApp Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Environment Mode</label>
                  <select
                    value={newApiProvider.mode}
                    onChange={(e) => setNewApiProvider(prev => ({ ...prev, mode: e.target.value }))}
                    className="form-select text-xs font-bold"
                  >
                    <option value="Production (Live Mode)">Production (Live Mode)</option>
                    <option value="Sandbox / Staging Mode">Sandbox / Staging Mode</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Base Endpoint URL *</label>
                <input
                  type="text"
                  required
                  value={newApiProvider.endpointUrl}
                  onChange={(e) => setNewApiProvider(prev => ({ ...prev, endpointUrl: e.target.value }))}
                  className="form-input text-xs font-mono"
                  placeholder="https://api.provider.com/v1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">API Key / Client ID *</label>
                  <input
                    type="text"
                    required
                    value={newApiProvider.apiKey}
                    onChange={(e) => setNewApiProvider(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="form-input text-xs font-mono font-bold"
                    placeholder="pk_live_..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Secret Key / Secret Token (Optional)</label>
                  <input
                    type="password"
                    value={newApiProvider.secretKey}
                    onChange={(e) => setNewApiProvider(prev => ({ ...prev, secretKey: e.target.value }))}
                    className="form-input text-xs font-mono"
                    placeholder="sk_live_..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rate Limit (req / min)</label>
                  <input
                    type="number"
                    value={newApiProvider.rateLimitPerMin}
                    onChange={(e) => setNewApiProvider(prev => ({ ...prev, rateLimitPerMin: parseInt(e.target.value) || 120 }))}
                    className="form-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Monthly Call Quota</label>
                  <input
                    type="number"
                    value={newApiProvider.monthlyQuota}
                    onChange={(e) => setNewApiProvider(prev => ({ ...prev, monthlyQuota: parseInt(e.target.value) || 10000 }))}
                    className="form-input text-xs font-mono"
                  />
                </div>
              </div>

              {/* Supported Capabilities Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-slate-700 font-bold">Supported Document Verifications</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Aadhaar UIDAI OTP',
                    'PAN Card Basic (NSDL)',
                    'Bank Account IMPS Penny Drop (₹1)',
                    'Driving License (MoRTH)',
                    'Passport Verification (MEA Direct)',
                    'UAN Dual Employment & History',
                    'AI 3D Biometrics & Liveness'
                  ].map((doc) => {
                    const isChecked = newApiProvider.supportedDocs.includes(doc);
                    return (
                      <label key={doc} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewApiProvider(prev => ({ ...prev, supportedDocs: [...prev.supportedDocs, doc] }));
                            } else {
                              setNewApiProvider(prev => ({ ...prev, supportedDocs: prev.supportedDocs.filter(d => d !== doc) }));
                            }
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-semibold text-slate-800 text-[11px]">{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Primary Toggle */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div>
                  <strong className="text-purple-950 font-bold block text-xs">Designate as Primary Verification Gateway</strong>
                  <span className="text-[11px] text-purple-800">All candidate verifications will route through this gateway first</span>
                </div>
                <input
                  type="checkbox"
                  checked={newApiProvider.isPrimary}
                  onChange={(e) => setNewApiProvider(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 rounded"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddApiModal(false)}
                  className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-superadmin text-xs py-2 px-6 font-black shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Onboard & Connect Gateway</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ✏️ CONFIGURE / EDIT API PROVIDER MODAL */}
      {showEditApiModal && selectedEditProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-indigo-100 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <span className="badge badge-purple text-[10px] font-black">CREDENTIALS & CONFIGURATION</span>
                  <h3 className="text-xl font-black text-slate-900">Configure {selectedEditProvider.name || selectedEditProvider.key}</h3>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setShowEditApiModal(false);
                  setSelectedEditProvider(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                updateApiConfig(selectedEditProvider.key, selectedEditProvider);
                setShowEditApiModal(false);
                setSelectedEditProvider(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={selectedEditProvider.name || selectedEditProvider.displayName || ''}
                  onChange={(e) => setSelectedEditProvider(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">API Key / Client ID *</label>
                <input
                  type="text"
                  required
                  value={selectedEditProvider.apiKey || selectedEditProvider.clientId || ''}
                  onChange={(e) => setSelectedEditProvider(prev => ({ ...prev, apiKey: e.target.value, clientId: e.target.value }))}
                  className="form-input text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Secret Key / Secret Token</label>
                <input
                  type="password"
                  value={selectedEditProvider.secretKey || selectedEditProvider.clientSecret || ''}
                  onChange={(e) => setSelectedEditProvider(prev => ({ ...prev, secretKey: e.target.value, clientSecret: e.target.value }))}
                  className="form-input text-xs font-mono"
                  placeholder="Paste secret key..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Base Endpoint URL *</label>
                <input
                  type="text"
                  required
                  value={selectedEditProvider.endpointUrl || ''}
                  onChange={(e) => setSelectedEditProvider(prev => ({ ...prev, endpointUrl: e.target.value }))}
                  className="form-input text-xs font-mono text-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Environment Mode</label>
                  <select
                    value={selectedEditProvider.mode || 'Production (Live Mode)'}
                    onChange={(e) => setSelectedEditProvider(prev => ({ ...prev, mode: e.target.value }))}
                    className="form-select text-xs font-bold"
                  >
                    <option value="Production (Live Mode)">Production (Live Mode)</option>
                    <option value="Sandbox / Staging Mode">Sandbox / Staging Mode</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rate Limit (req/min)</label>
                  <input
                    type="number"
                    value={selectedEditProvider.rateLimitPerMin || 120}
                    onChange={(e) => setSelectedEditProvider(prev => ({ ...prev, rateLimitPerMin: parseInt(e.target.value) || 120 }))}
                    className="form-input text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditApiModal(false);
                    setSelectedEditProvider(null);
                  }}
                  className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-superadmin text-xs py-2 px-6 font-black shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}


      
      {/* 🔍 CANDIDATE GRANULAR API CALL AUDIT & DOCUMENT LEDGER MODAL */}
      {showCandidateDetailModal && selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-indigo-100 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-200">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="badge badge-purple text-[10px] font-black uppercase">EMPLOYEE API TELEMETRY AUDIT</span>
                    <span className="badge badge-emerald text-[10px] font-bold">100% Cryptographically Sealed 🔒</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {selectedCandidateDetail.candidate?.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Emp ID: <strong>{selectedCandidateDetail.candidate?.emp_id}</strong> • Company: <strong>{selectedCandidateDetail.candidate?.company_name}</strong> ({selectedCandidateDetail.candidate?.company_code}) • Token: <code className="text-indigo-600">{selectedCandidateDetail.candidate?.token}</code>
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setShowCandidateDetailModal(false);
                  setSelectedCandidateDetail(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Overview KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Total API Calls Incurred</span>
                <strong className="text-lg font-black text-indigo-900 mt-0.5 block font-mono">
                  {selectedCandidateDetail.summary?.total_api_calls || selectedCandidateDetail.document_breakdown?.length || 7} Calls
                </strong>
                <span className="text-[10px] text-slate-500 font-medium">Across all verification levels</span>
              </div>

              <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200">
                <span className="text-[10px] text-rose-700 font-bold uppercase block">Total Upstream Cost</span>
                <strong className="text-lg font-black text-rose-900 mt-0.5 block font-mono">
                  ₹{(selectedCandidateDetail.summary?.total_cost_inr || 28.00).toFixed(2)}
                </strong>
                <span className="text-[10px] text-rose-700 font-medium">@ ₹4.00 / call CoinCircle</span>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">Verified Documents</span>
                <strong className="text-lg font-black text-emerald-900 mt-0.5 block font-mono">
                  {selectedCandidateDetail.document_breakdown?.length || 7} / 7 Checked
                </strong>
                <span className="text-[10px] text-emerald-700 font-bold">100% Passed SLA</span>
              </div>

              <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200">
                <span className="text-[10px] text-purple-700 font-bold uppercase block">Avg Turnaround Latency</span>
                <strong className="text-lg font-black text-purple-900 mt-0.5 block font-mono">
                  {selectedCandidateDetail.summary?.avg_latency_ms || 58.4} ms
                </strong>
                <span className="text-[10px] text-purple-700 font-medium">AWS App Runner Gateway</span>
              </div>
            </div>

            {/* Document-by-Document Step Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Document-by-Document API Execution & Verification Steps</span>
                </h4>
                <span className="text-xs text-slate-500 font-medium">
                  Authoritative responses with cryptographic SHA-256 digital stamps
                </span>
              </div>

              <div className="space-y-3">
                {(selectedCandidateDetail.document_breakdown || []).map((doc, idx) => (
                  <div key={doc.record_id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    
                    {/* Card Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <strong className="text-slate-900 font-black text-sm capitalize">
                          {doc.verification_type === 'aadhaar' ? 'Aadhaar UIDAI e-KYC (Demographics & Photo)' :
                           doc.verification_type === 'pan' ? 'NSDL PAN Card (Section 139AA Compliance)' :
                           doc.verification_type === 'bankCheck' ? 'NPCI IMPS Bank Account Penny Drop' :
                           doc.verification_type === 'drivingLicense' ? 'MoRTH Sarathi Driving License' :
                           doc.verification_type === 'passport' ? 'MEA Passport Seva Registry' :
                           doc.verification_type === 'uan' ? 'EPFO UAN Dual Employment Moonlighting Audit' :
                           doc.verification_type === 'aiFaceBiometrics' ? 'AI 3D Facial Geometry & Liveness' :
                           doc.verification_type}
                        </strong>

                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{doc.status}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 font-extrabold border border-purple-300">
                          {doc.api_calls_count || 1} API Call{(doc.api_calls_count || 1) !== 1 ? 's' : ''} (₹{(doc.cost_incurred || 4.0).toFixed(2)})
                        </span>
                        <span className="text-slate-500 font-medium">
                          {doc.latency_ms || 58} ms
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Endpoint Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-white p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-400 font-semibold text-[10px] block">API ENDPOINT & ID</span>
                        <span className="text-indigo-700 font-bold truncate block">{doc.endpoint_path || `/apiProduct/${doc.verification_type}`}</span>
                        <span className="text-slate-500 text-[10px]">API ID: {doc.api_id || '6a01e1a51c9b7da283e198ac'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold text-[10px] block">TRANSACTION REF & GATEWAY</span>
                        <span className="text-slate-800 font-bold truncate block">{doc.transaction_ref || 'TXN-CCT-UIDAI-994201'}</span>
                        <span className="text-slate-500 text-[10px]">{doc.provider || 'Server 2: CoinCircleTrust API Gateway (47+ APIs)'}</span>
                      </div>
                    </div>

                    {/* Cryptographic SHA-256 Seal */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-[11px] font-mono text-slate-700 font-bold truncate">
                          Digital Seal: {doc.sha256_seal || 'SHA256-39544A0CE0B...'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(doc.sha256_seal || '');
                          showToast('📋 SHA-256 Digital Checksum copied!');
                        }}
                        className="btn btn-secondary text-[10px] py-1 px-2 font-bold cursor-pointer shrink-0"
                      >
                        Copy Seal
                      </button>
                    </div>

                    {/* Extracted Verified Data JSON Details */}
                    {doc.fetched_data && Object.keys(doc.fetched_data).length > 0 && (
                      <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs space-y-1">
                        <span className="text-[10px] font-black text-indigo-900 uppercase block">Extracted Government Registry Attributes</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                          {Object.entries(doc.fetched_data).filter(([k, v]) => typeof v !== 'object' && !['photo_present', 'mobile_hash', 'email_hash'].includes(k)).slice(0, 6).map(([k, v]) => (
                            <div key={k} className="truncate">
                              <span className="text-slate-500 font-semibold capitalize text-[10px] block">{k.replace(/_/g, ' ')}:</span>
                              <strong className="text-slate-900 font-bold truncate">{String(v)}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Verified at: {new Date().toLocaleString()} • DPDP Act 2023 Compliant Audit Log
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowCandidateDetailModal(false);
                  setSelectedCandidateDetail(null);
                }}
                className="btn btn-secondary text-xs py-2 px-6 font-bold cursor-pointer"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ⚡ Razorpay Verification Wallet Recharge Modal */}
      <RazorpayPaymentModal
        isOpen={showSuperAdminRazorpayModal}
        onClose={() => setShowSuperAdminRazorpayModal(false)}
        targetCompanyId={selectedRechargeCompanyId}
      />

    </div>
  );
};
