import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radio, 
  Smartphone, 
  Send, 
  Zap, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Edit3, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Key, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Search, 
  Save, 
  X,
  Sparkles,
  Link2,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const AirtelIqSmsGatewayConsole = () => {
  const { showToast } = useApp();

  // Gateway Config State
  const [gatewayConfig, setGatewayConfig] = useState({
    customer_id: '',
    username: '',
    password: '',
    has_password: false,
    entity_id: '',
    source_address: 'JYCORP',
    base_url: 'https://iqsms.airtel.in/api/v1/send-prepaid-sms',
    is_active: true,
    is_configured: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // DLT Templates State
  const [templates, setTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const [showTestModal, setShowTestModal] = useState(false);
  const [testPayload, setTestPayload] = useState({
    phone: '',
    template_name: '',
    dlt_template_id: '',
    header: 'JYCORP',
    message_type: 'SERVICE_IMPLICIT',
    variables: {},
    custom_message: ''
  });
  const [isDispatchingTest, setIsDispatchingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // New Template Form State
  const [newTemplate, setNewTemplate] = useState({
    template_name: '',
    dlt_template_id: '',
    header: 'JYCORP',
    message_type: 'SERVICE_IMPLICIT',
    category: 'OTP',
    template_content: '',
    variables: ['name', 'otp'],
    cta_url: '',
    cta_id: ''
  });

  // Approved CTA URLs Reference
  const approvedCtas = [
    {
      id: 'CTA_VERIFY_KYC',
      name: 'Candidate Verification KYC',
      url: 'https://trueprofile.joycorporatesolutions.com/verify?',
      desc: 'Dynamic candidate token attached at runtime'
    },
    {
      id: 'CTA_COMPANY_PORTAL',
      name: 'Company Admin Portal',
      url: 'https://trueprofile.joycorporatesolutions.com/company?',
      desc: 'Company administration access redirect'
    },
    {
      id: 'CTA_HR_PORTAL',
      name: 'HR Executive Console',
      url: 'https://trueprofile.joycorporatesolutions.com/hr?',
      desc: 'HR officer verification review workstation'
    },
    {
      id: 'CTA_VENDOR_PORTAL',
      name: 'Vendor Verification Workspace',
      url: 'https://trueprofile.joycorporatesolutions.com/vendor?',
      desc: 'B2B background verification partner console'
    }
  ];

  // Fetch Gateway Config & Templates on mount
  const loadData = async () => {
    setIsLoadingConfig(true);
    setIsLoadingTemplates(true);
    try {
      const cfg = await api.getSmsGatewayConfig();
      if (cfg) {
        setGatewayConfig(prev => ({ ...prev, ...cfg }));
      }
    } catch (e) {
      console.warn('Could not load SMS gateway config:', e);
    } finally {
      setIsLoadingConfig(false);
    }

    try {
      const tpls = await api.getSmsTemplates();
      if (Array.isArray(tpls)) {
        setTemplates(tpls);
      }
    } catch (e) {
      console.warn('Could not load DLT templates:', e);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Gateway Credentials
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      const payload = {
        customer_id: gatewayConfig.customer_id.trim(),
        username: gatewayConfig.username.trim(),
        password: gatewayConfig.password || (gatewayConfig.has_password ? '********' : ''),
        entity_id: gatewayConfig.entity_id.trim(),
        source_address: (gatewayConfig.source_address || 'JYCORP').trim().toUpperCase(),
        base_url: gatewayConfig.base_url.trim(),
        is_active: gatewayConfig.is_active
      };
      const res = await api.updateSmsGatewayConfig(payload);
      showToast('⚡ Airtel IQ SMS Gateway credentials saved successfully!', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to save Airtel IQ configuration: ' + (err.message || err), 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Add New Template
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplate.template_name || !newTemplate.template_content) {
      showToast('Template Name and Template Content are required.', 'error');
      return;
    }
    try {
      await api.createSmsTemplate(newTemplate);
      showToast(`⚡ DLT Template '${newTemplate.template_name}' registered successfully!`, 'success');
      setShowAddModal(false);
      setNewTemplate({
        template_name: '',
        dlt_template_id: '',
        header: 'JYCORP',
        message_type: 'SERVICE_IMPLICIT',
        category: 'OTP',
        template_content: '',
        variables: ['name', 'otp'],
        cta_url: '',
        cta_id: ''
      });
      loadData();
    } catch (err) {
      showToast('Failed to register template: ' + (err.message || err), 'error');
    }
  };

  // Update Template (e.g. paste approved DLT ID)
  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    if (!editingTemplate) return;
    try {
      await api.updateSmsTemplate(editingTemplate.id, {
        template_name: editingTemplate.template_name,
        dlt_template_id: editingTemplate.dlt_template_id,
        header: editingTemplate.header,
        message_type: editingTemplate.message_type,
        category: editingTemplate.category,
        template_content: editingTemplate.template_content,
        cta_url: editingTemplate.cta_url,
        cta_id: editingTemplate.cta_id,
        is_active: editingTemplate.is_active
      });
      showToast(`⚡ DLT Template '${editingTemplate.template_name}' updated successfully!`, 'success');
      setShowEditModal(false);
      setEditingTemplate(null);
      loadData();
    } catch (err) {
      showToast('Failed to update template: ' + (err.message || err), 'error');
    }
  };

  // Delete Template
  const handleDeleteTemplate = async (tpl) => {
    if (!window.confirm(`Are you sure you want to delete template '${tpl.template_name}'?`)) return;
    try {
      await api.deleteSmsTemplate(tpl.id);
      showToast(`Template '${tpl.template_name}' deleted.`, 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete template: ' + (err.message || err), 'error');
    }
  };

  // Open Test Modal prefilled with template
  const handleOpenTestModal = (tpl) => {
    const varsObj = {};
    if (Array.isArray(tpl.variables) && tpl.variables.length > 0) {
      tpl.variables.forEach(v => {
        const vKey = String(v).trim();
        const vLower = vKey.toLowerCase();
        if (vLower.includes('otp') || vLower.includes('passcode') || vLower.includes('code')) {
          varsObj[vKey] = '492015';
        } else if (vLower.includes('url') || vLower.includes('link')) {
          varsObj[vKey] = tpl.cta_url || 'https://trueprofile.joycorporatesolutions.com/verify?token=demo123';
        } else if (vLower.includes('comp')) {
          varsObj[vKey] = 'Joy Group';
        } else if (vLower.includes('id')) {
          varsObj[vKey] = 'JOY-2026-99';
        } else {
          varsObj[vKey] = 'Praveen';
        }
      });
    } else if (tpl.category === 'Onboarding Link') {
      varsObj.candidate_name = 'Praveen';
      varsObj.company_name = 'Joy Group';
      varsObj.verify_url = tpl.cta_url || 'https://trueprofile.joycorporatesolutions.com/verify?token=demo123';
    } else {
      varsObj.name = 'Praveen';
      varsObj.otp = '492015';
    }

    setTestPayload({
      phone: '9876543210',
      template_name: tpl.template_name,
      dlt_template_id: tpl.dlt_template_id || '',
      header: tpl.header || 'JYCORP',
      message_type: tpl.message_type || 'SERVICE_IMPLICIT',
      variables: varsObj,
      custom_message: tpl.template_content
    });
    setTestResult(null);
    setShowTestModal(true);
  };

  // Execute Test Dispatch
  const handleExecuteTestDispatch = async (e) => {
    e.preventDefault();
    if (!testPayload.phone) {
      showToast('Please enter a 10-digit mobile number.', 'error');
      return;
    }
    setIsDispatchingTest(true);
    setTestResult(null);
    try {
      const res = await api.testDispatchSms({
        phone: testPayload.phone,
        template_name: testPayload.template_name,
        dlt_template_id: testPayload.dlt_template_id,
        header: testPayload.header,
        message_type: testPayload.message_type,
        message: testPayload.custom_message,
        variables: testPayload.variables
      });
      setTestResult(res);
      if (res.success) {
        showToast(
          res.mode === 'live' 
            ? '⚡ Live SMS successfully delivered via Airtel IQ Gateway!' 
            : '🧪 Simulated SMS dispatch successful (credentials pending live activation).',
          'success'
        );
      } else {
        showToast('SMS dispatch failed: ' + (res.error || 'Gateway error'), 'error');
      }
    } catch (err) {
      setTestResult({ success: false, error: err.message || err });
      showToast('Dispatch error: ' + (err.message || err), 'error');
    } finally {
      setIsDispatchingTest(false);
    }
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchQuery = !searchQuery || 
        t.template_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.template_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.dlt_template_id && t.dlt_template_id.includes(searchQuery));
      
      const matchCat = categoryFilter === 'ALL' || 
        (categoryFilter === 'OTP' && (t.category === 'OTP' || t.category === 'Security' || t.category === 'e-Sign')) ||
        (categoryFilter === 'ONBOARDING' && t.category === 'Onboarding Link') ||
        (categoryFilter === 'UNIQUE_ID' && t.category === 'Unique ID');

      return matchQuery && matchCat;
    });
  }, [templates, searchQuery, categoryFilter]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* 🚀 TOP HERO BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white shadow-xl border border-sky-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
                <Radio className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Airtel IQ Prepaid SMS Gateway & DLT Registry
              </h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                TRAI DLT Compliant (Header: {gatewayConfig.source_address || 'JYCORP'})
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official telecom carrier SMS integration powered by <strong className="text-sky-300">Airtel IQ CPaaS</strong>. 
              Manages automated 2FA login OTPs, digital e-consent codes, employee KYC onboarding links, and TRAI-approved registered DLT content templates.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                setTestPayload({
                  phone: '9876543210',
                  template_name: 'JTP_MANDATORY_2FA_LOGIN_OTP',
                  dlt_template_id: '',
                  header: gatewayConfig.source_address || 'JYCORP',
                  message_type: 'SERVICE_IMPLICIT',
                  variables: { name: 'Praveen', otp: '492015' },
                  custom_message: ''
                });
                setTestResult(null);
                setShowTestModal(true);
              }}
              className="btn bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Test SMS Dispatch</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add DLT Template</span>
            </button>

            <button
              onClick={loadData}
              disabled={isLoadingTemplates || isLoadingConfig}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Refresh Registry"
            >
              <RefreshCw className={`w-4 h-4 ${(isLoadingTemplates || isLoadingConfig) ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ⚙️ GATEWAY CREDENTIALS & CONNECTION CONFIG */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-600" />
              <span>Airtel IQ Gateway Authentication</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Telecom carrier credentials provided by Airtel Business. Dispatches via HTTP Basic Authentication.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
              gatewayConfig.is_configured 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {gatewayConfig.is_configured ? '🟢 Credentials Active' : '🟡 Credentials Pending / Test Mode'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer ID */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Customer ID (Airtel Business) *
              </label>
              <input
                type="text"
                value={gatewayConfig.customer_id}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, customer_id: e.target.value })}
                placeholder="e.g. JYCORP_PREPAID_1029"
                className="form-input text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Your Airtel IQ Customer ID</span>
            </div>

            {/* Username */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Airtel IQ Username *
              </label>
              <input
                type="text"
                value={gatewayConfig.username}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, username: e.target.value })}
                placeholder="e.g. joycorp_iq"
                className="form-input text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Prepaid API authentication username</span>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Airtel IQ Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={gatewayConfig.password}
                  onChange={(e) => setGatewayConfig({ ...gatewayConfig, password: e.target.value })}
                  placeholder={gatewayConfig.has_password ? '******** (Saved)' : 'Enter Airtel IQ password'}
                  className="form-input text-xs font-mono pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Encrypted Basic Auth password</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Entity ID */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                DLT Principal Entity ID (19 Digits) *
              </label>
              <input
                type="text"
                value={gatewayConfig.entity_id}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, entity_id: e.target.value })}
                placeholder="e.g. 1101234567890123456"
                className="form-input text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Airtel DLT registered entity ID</span>
            </div>

            {/* Source Address (Header) */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Sender Header (Source Address) *
              </label>
              <input
                type="text"
                maxLength={6}
                value={gatewayConfig.source_address}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, source_address: e.target.value.toUpperCase() })}
                placeholder="JYCORP"
                className="form-input text-xs font-mono font-bold uppercase text-sky-700"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Approved 6-alpha header: <strong>JYCORP</strong></span>
            </div>

            {/* Base URL */}
            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">
                Airtel IQ API Base URL
              </label>
              <input
                type="text"
                value={gatewayConfig.base_url}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, base_url: e.target.value })}
                className="form-input text-xs font-mono text-slate-600 bg-slate-50"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Airtel IQ send-prepaid-sms endpoint</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={gatewayConfig.is_active}
                  onChange={(e) => setGatewayConfig({ ...gatewayConfig, is_active: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">Carrier SMS Gateway Active</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSavingConfig}
              className="btn btn-superadmin text-xs py-2 px-5 font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              {isSavingConfig ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSavingConfig ? 'Saving...' : 'Save Airtel IQ Credentials 💾'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 🔗 APPROVED DLT CTA URLS REFERENCE */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-600" />
            <h4 className="font-black text-slate-900 text-xs sm:text-sm">
              Registered TRAI DLT Call-to-Action (CTA) URLs
            </h4>
          </div>
          <span className="badge badge-indigo text-[9px] font-black">4 APPROVED CTAS</span>
        </div>
        <p className="text-[11px] text-slate-500">
          When registering Transactional onboarding templates in Airtel DLT, dynamic query parameters (e.g. <code>?token=xyz</code>) attach to these base URLs:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {approvedCtas.map(cta => (
            <div key={cta.id} className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{cta.name}</span>
                <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{cta.id}</span>
              </div>
              <div className="flex items-center justify-between gap-1 p-1.5 rounded-lg bg-slate-50 border border-slate-100 font-mono text-[10px] text-sky-700">
                <span className="truncate">{cta.url}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(cta.url, cta.name)}
                  className="p-1 text-slate-400 hover:text-sky-600 shrink-0 cursor-pointer"
                  title="Copy CTA URL"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block">{cta.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 📋 TRAI DLT SMS TEMPLATE REGISTRY TABLE */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>DLT Content Template Registry</span>
              <span className="badge badge-emerald text-[10px] font-black">{templates.length} TEMPLATES</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Approved message formats registered with TRAI & Airtel. SuperAdmin can paste approved 19-digit DLT IDs or add new templates dynamically.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-secondary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5 text-indigo-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Register New Template</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Templates' },
              { id: 'OTP', label: 'OTPs & Security (5)' },
              { id: 'ONBOARDING', label: 'Onboarding Links (4)' },
              { id: 'UNIQUE_ID', label: 'Unique ID' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  categoryFilter === tab.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search template name or text..."
              className="form-input text-xs pl-8 py-1.5 rounded-xl w-full"
            />
          </div>
        </div>

        {/* Template Cards / Table */}
        <div className="space-y-3">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h5 className="font-bold text-slate-700 text-sm">No DLT Templates Found</h5>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filter tab.</p>
            </div>
          ) : (
            filteredTemplates.map(tpl => (
              <div 
                key={tpl.id} 
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {tpl.template_name}
                    </span>
                    <span className="badge badge-sky text-[9px] font-bold">
                      Header: {tpl.header || 'JYCORP'}
                    </span>
                    <span className={`badge text-[9px] font-bold ${
                      tpl.message_type === 'TRANSACTIONAL' 
                        ? 'badge-emerald' 
                        : 'badge-purple'
                    }`}>
                      {tpl.message_type}
                    </span>
                    <span className="badge badge-slate text-[9px]">
                      {tpl.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* DLT ID Pill */}
                    {tpl.dlt_template_id ? (
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        DLT ID: {tpl.dlt_template_id}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTemplate(tpl);
                          setShowEditModal(true);
                        }}
                        className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Set Airtel DLT ID</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenTestModal(tpl)}
                      className="btn bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs py-1 px-2.5 font-bold rounded-lg border border-sky-200 flex items-center gap-1 cursor-pointer transition-all"
                      title="Send Live Test SMS"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Test</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingTemplate(tpl);
                        setShowEditModal(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                      title="Edit Template"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Allow deleting custom templates */}
                    {!tpl.id.startsWith('tpl-jtp-') && (
                      <button
                        onClick={() => handleDeleteTemplate(tpl)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Template Content Box */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 font-sans text-xs text-slate-800 leading-relaxed">
                  {tpl.template_content.split(/(\{#(?:alphanumeric|numeric|url|var)#\})/).map((chunk, i) => {
                    if (chunk.startsWith('{#') && chunk.endsWith('#}')) {
                      return (
                        <span key={i} className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1 py-0.5 rounded mx-0.5">
                          {chunk}
                        </span>
                      );
                    }
                    return chunk;
                  })}
                </div>

                {/* CTA URL Banner if present */}
                {tpl.cta_url && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="font-bold text-slate-700">Dynamic CTA:</span>
                    <code className="text-sky-700 font-mono bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                      {tpl.cta_url}
                    </code>
                    {tpl.cta_id && (
                      <span className="text-slate-400 text-[10px]">({tpl.cta_id})</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ⚡ MODAL 1: TEST SMS DISPATCH                                         */}
      {/* ===================================================================== */}
      {showTestModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Airtel IQ Carrier SMS Test Dispatch</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sends an immediate SMS through Airtel IQ Prepaid API to verify carrier delivery.
                </p>
              </div>
              <button 
                onClick={() => setShowTestModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteTestDispatch} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Recipient Mobile Number (10 Digits) *
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-600 font-mono text-xs font-bold">
                    +91 (India)
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={testPayload.phone}
                    onChange={(e) => setTestPayload({ ...testPayload, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="9876543210"
                    className="form-input text-xs font-mono font-bold flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Template</label>
                  <input
                    type="text"
                    readOnly
                    value={testPayload.template_name}
                    className="form-input text-xs font-mono bg-slate-50 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Sender Header</label>
                  <input
                    type="text"
                    readOnly
                    value={testPayload.header}
                    className="form-input text-xs font-mono bg-slate-50 text-slate-700 uppercase"
                  />
                </div>
              </div>

              {/* Dynamic Variables Input */}
              {Object.keys(testPayload.variables).length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                    Template Variable Values
                  </span>
                  <div className="space-y-2">
                    {Object.entries(testPayload.variables).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500 w-32 shrink-0">{key}:</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => setTestPayload({
                            ...testPayload,
                            variables: { ...testPayload.variables, [key]: e.target.value }
                          })}
                          className="form-input text-xs py-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response Feedback Box */}
              {testResult && (
                <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>{testResult.success ? '✅ Gateway Dispatch Accepted' : '❌ Gateway Rejected'}</span>
                    <span className="badge text-[9px] bg-white">
                      Mode: {testResult.mode || 'live'}
                    </span>
                  </div>
                  {testResult.message && <p className="text-[11px]">{testResult.message}</p>}
                  {testResult.error && <p className="text-[11px] text-rose-700 font-bold">{testResult.error}</p>}
                  {testResult.response && (
                    <pre className="p-2 bg-slate-900 text-emerald-400 rounded-lg text-[10px] font-mono overflow-x-auto mt-2">
                      {JSON.stringify(testResult.response, null, 2)}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="btn btn-secondary text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isDispatchingTest}
                  className="btn bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  {isDispatchingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isDispatchingTest ? 'Dispatching...' : 'Send Live SMS 🚀'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ✏️ MODAL 2: EDIT TEMPLATE / PASTE APPROVED DLT ID                     */}
      {/* ===================================================================== */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  <span>Configure DLT Template</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update approved Airtel DLT ID, header, or message content.
                </p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTemplate} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Template Name</label>
                <input
                  type="text"
                  value={editingTemplate.template_name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, template_name: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                  className="form-input text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Airtel DLT Template ID (19 Digits) *
                </label>
                <input
                  type="text"
                  value={editingTemplate.dlt_template_id}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, dlt_template_id: e.target.value.trim() })}
                  placeholder="Paste 19-digit Airtel DLT ID here"
                  className="form-input text-xs font-mono font-bold text-emerald-700"
                  autoFocus
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Copy from Airtel DLT Portal after approval.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Header</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={editingTemplate.header}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, header: e.target.value.toUpperCase() })}
                    className="form-input text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Message Type</label>
                  <select
                    value={editingTemplate.message_type}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, message_type: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="SERVICE_IMPLICIT">SERVICE_IMPLICIT</option>
                    <option value="TRANSACTIONAL">TRANSACTIONAL</option>
                    <option value="PROMOTIONAL">PROMOTIONAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">Template Content</label>
                <textarea
                  rows={4}
                  value={editingTemplate.template_content}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, template_content: e.target.value })}
                  className="form-input text-xs font-mono leading-relaxed"
                />
              </div>

              {editingTemplate.message_type === 'TRANSACTIONAL' && (
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Approved CTA URL</label>
                  <input
                    type="text"
                    value={editingTemplate.cta_url || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, cta_url: e.target.value })}
                    placeholder="https://trueprofile.joycorporatesolutions.com/verify?"
                    className="form-input text-xs font-mono"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-superadmin text-xs font-bold py-2 px-4 shadow-md cursor-pointer"
                >
                  Save Template Changes 💾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ➕ MODAL 3: ADD NEW DLT TEMPLATE                                     */}
      {/* ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Register New DLT Template</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add a new TRAI-approved SMS template to the JOY TrueProfile registry.
                </p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTemplate.template_name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, template_name: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                  placeholder="e.g. JTP_VENDOR_INVITE_SMS"
                  className="form-input text-xs font-mono font-bold uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Unique uppercase identifier</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Header *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newTemplate.header}
                    onChange={(e) => setNewTemplate({ ...newTemplate, header: e.target.value.toUpperCase() })}
                    placeholder="JYCORP"
                    className="form-input text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Category</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="OTP">OTP Verification</option>
                    <option value="Onboarding Link">Onboarding Link</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Unique ID">Unique ID</option>
                    <option value="Security">Security Alert</option>
                    <option value="General">General Notification</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">Message Type</label>
                  <select
                    value={newTemplate.message_type}
                    onChange={(e) => setNewTemplate({ ...newTemplate, message_type: e.target.value })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="SERVICE_IMPLICIT">SERVICE_IMPLICIT</option>
                    <option value="TRANSACTIONAL">TRANSACTIONAL</option>
                    <option value="PROMOTIONAL">PROMOTIONAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold text-xs mb-1">DLT Template ID (Airtel)</label>
                  <input
                    type="text"
                    value={newTemplate.dlt_template_id}
                    onChange={(e) => setNewTemplate({ ...newTemplate, dlt_template_id: e.target.value.trim() })}
                    placeholder="Optional (add when approved)"
                    className="form-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold text-xs mb-1">
                  Template Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newTemplate.template_content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, template_content: e.target.value })}
                  placeholder="Dear {#alphanumeric#}, your code is {#numeric#}. - JOY TRUE PROFILE"
                  className="form-input text-xs font-mono leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Use tags like <code>{'{#alphanumeric#}'}</code>, <code>{'{#numeric#}'}</code>, <code>{'{#url#}'}</code>. Maximum 3 variables.
                </span>
              </div>

              {newTemplate.message_type === 'TRANSACTIONAL' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">CTA URL</label>
                    <input
                      type="text"
                      value={newTemplate.cta_url}
                      onChange={(e) => setNewTemplate({ ...newTemplate, cta_url: e.target.value })}
                      placeholder="https://trueprofile.joycorporatesolutions.com/verify?"
                      className="form-input text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">CTA ID</label>
                    <input
                      type="text"
                      value={newTemplate.cta_id}
                      onChange={(e) => setNewTemplate({ ...newTemplate, cta_id: e.target.value })}
                      placeholder="e.g. CTA_VERIFY_KYC"
                      className="form-input text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-superadmin text-xs font-bold py-2 px-4 shadow-md cursor-pointer"
                >
                  Register Template 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirtelIqSmsGatewayConsole;
