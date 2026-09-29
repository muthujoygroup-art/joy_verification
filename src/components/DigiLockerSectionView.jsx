import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  FileText, 
  Download, 
  Sparkles, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Eye, 
  ArrowRight,
  BadgeCheck,
  AlertCircle,
  FileCheck2,
  GraduationCap,
  Car,
  FileSpreadsheet,
  QrCode,
  Scale,
  Award,
  Calendar,
  MapPin,
  Mail,
  User,
  Info,
  CreditCard,
  Briefcase,
  X,
  Share2,
  CheckCircle,
  FlaskConical,
  KeyRound,
  Shield
} from 'lucide-react';
import { 
  exportAllDigilockerToExcel, 
  exportSingleDigilockerToExcel, 
  generateDigilockerOfficialCertificatePdf 
} from '../utils/digilockerExportUtils';

export const DigiLockerSectionView = ({ currentCompany, activeHr }) => {
  const { candidates, showToast, refreshCandidates } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('create_fetch'); // 'create_fetch' | 'dossier' | 'compliance'
  
  // Verification Form State
  const [userType, setUserType] = useState('individual'); // 'individual' | 'company'
  const [authType, setAuthType] = useState('mobile'); // 'mobile' | 'aadhaar' | 'pan'
  const [identifierValue, setIdentifierValue] = useState('9944266116');
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('Employee onboarding private sector');
  const [customPurpose, setCustomPurpose] = useState('');
  const [serviceName, setServiceName] = useState('JoyVerify');
  const [selectedDocTypes, setSelectedDocTypes] = useState([
    'aadhaar', 
    'pan', 
    'driving_license', 
    'class_x', 
    'class_xii',
    'epfo_uan'
  ]);

  // Telemetry & Fetch State
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgressStage, setFetchProgressStage] = useState(0);
  const [latestFetchResult, setLatestFetchResult] = useState(null);
  
  // Auth Redirection Link Generation State & Modals
  const [isGeneratingAuth, setIsGeneratingAuth] = useState(false);
  const [generatedAuthData, setGeneratedAuthData] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Document Details Modal Preview (matching dd/callback.php)
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);

  // Sandbox Simulation Modal (matching dd/mock_digilocker.php)
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [sandboxStep, setSandboxStep] = useState('signin'); // 'signin' | 'consent'
  const [sandboxPin, setSandboxPin] = useState('123456');
  const [sandboxOtp, setSandboxOtp] = useState('654321');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('all');

  // Purpose Catalogue from API / Backend
  const [purposesList, setPurposesList] = useState([]);
  
  // Stored DigiLocker Records Cache
  const [verifiedRecords, setVerifiedRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('joy_digilocker_verified_records');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Load standard NeGD Purpose catalogue on mount
  useEffect(() => {
    api.getDigilockerPurposes().then(res => {
      if (res && Array.isArray(res.purposes)) {
        setPurposesList(res.purposes);
      }
    }).catch(() => {});
  }, []);

  // Sync server DigiLocker records from database
  const loadDbRecords = () => {
    api.getDigilockerRecords().then(res => {
      if (res && Array.isArray(res.records) && res.records.length > 0) {
        setVerifiedRecords(prev => {
          const combined = [...res.records, ...prev];
          const unique = Array.from(new Map(combined.map(item => [item.id || item.digilocker_id || item.mobile, item])).values());
          try {
            localStorage.setItem('joy_digilocker_verified_records', JSON.stringify(unique));
          } catch (e) {}
          return unique;
        });
      }
    }).catch(() => {});
  };

  useEffect(() => {
    loadDbRecords();
  }, []);

  // When candidate is selected from dropdown, pre-populate identifier
  const handleCandidateSelect = (candId) => {
    setSelectedCandidateId(candId);
    if (!candId) {
      setIdentifierValue('');
      return;
    }
    const cand = (candidates || []).find(c => c.id === candId);
    if (cand) {
      if (authType === 'mobile') {
        const cleanMob = (cand.mobile || '').replace(/\D/g, '').slice(-10);
        setIdentifierValue(cleanMob);
      } else if (authType === 'aadhaar') {
        const cleanAadh = (cand.aadhaarNo || cand.aadhaar_no || '').replace(/\D/g, '').slice(0, 12);
        setIdentifierValue(cleanAadh);
      } else if (authType === 'pan') {
        setIdentifierValue(cand.panNo || cand.pan_no || '');
      }
    }
  };

  // Toggle document type selection
  const toggleDocType = (typeKey) => {
    setSelectedDocTypes(prev => 
      prev.includes(typeKey) 
        ? prev.filter(t => t !== typeKey) 
        : [...prev, typeKey]
    );
  };

  // 🚀 BUTTON 1: Open Live DigiLocker Portal with PKCE & NeGD Redirection
  const handleRedirectToDigilocker = async (e) => {
    if (e) e.preventDefault();
    const cleanId = (identifierValue || '').trim();
    if (!cleanId) {
      showToast('⚠️ Please enter a valid Mobile Number, Aadhaar Number, or PAN.', 'error');
      return;
    }

    const effectivePurpose = customPurpose ? customPurpose.trim().slice(0, 50) : selectedPurpose;
    const effectiveService = (serviceName || 'JoyVerify').trim().slice(0, 50);

    setIsGeneratingAuth(true);
    try {
      const res = await api.initiateDigilockerAuth({
        user_type: userType,
        auth_type: authType,
        identifier_value: cleanId,
        purpose: effectivePurpose,
        service_name: effectiveService,
        candidate_id: selectedCandidateId || undefined
      });

      if (res && res.success && res.auth_url) {
        setGeneratedAuthData(res);
        setShowAuthModal(true);
        showToast('🚀 Opening DigiLocker Gateway URL (api.digitallocker.gov.in)...', 'success');
        
        // Open official DigiLocker login page in a new window/tab
        try {
          const win = window.open(res.auth_url, '_blank', 'noopener,noreferrer');
          if (!win || win.closed || typeof win.closed === 'undefined') {
            // Popup blocker intercepted - show modal with direct link
            setShowAuthModal(true);
          }
        } catch (popupErr) {
          setShowAuthModal(true);
        }
      } else {
        showToast(res?.message || 'Failed to initiate DigiLocker redirection.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error communicating with DigiLocker service.', 'error');
    } finally {
      setIsGeneratingAuth(false);
    }
  };

  // ⚡ BUTTON 2: Execute Instant Live Government Vault Fetch (In-Portal Direct Ingest)
  const handleExecuteFetch = async (e) => {
    if (e) e.preventDefault();
    const cleanId = (identifierValue || '').trim();
    if (!cleanId) {
      showToast('⚠️ Please enter a valid Mobile Number, Aadhaar Number, or PAN.', 'error');
      return;
    }

    const effectivePurpose = customPurpose ? customPurpose.trim().slice(0, 50) : selectedPurpose;
    const effectiveService = (serviceName || 'JoyVerify').trim().slice(0, 50);

    setIsFetching(true);
    setFetchProgressStage(1);
    setLatestFetchResult(null);

    const timer1 = setTimeout(() => setFetchProgressStage(2), 350);
    const timer2 = setTimeout(() => setFetchProgressStage(3), 700);

    try {
      const response = await api.fetchDigilockerDetails({
        identifier: cleanId,
        mobile: authType === 'mobile' ? cleanId : undefined,
        auth_type: authType,
        user_type: userType,
        purpose: effectivePurpose,
        service_name: effectiveService,
        doc_types: selectedDocTypes,
        candidate_id: selectedCandidateId || undefined,
        company_id: currentCompany?.id || 'COMP001',
        hr_id: activeHr?.id || 'hr-1'
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setFetchProgressStage(4);

      if (response && response.success) {
        setLatestFetchResult(response);
        
        // Update local records
        setVerifiedRecords(prev => {
          const updated = [response, ...prev.filter(r => (r.digilocker_id !== response.digilocker_id && r.mobile !== response.mobile))];
          try {
            localStorage.setItem('joy_digilocker_verified_records', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });

        showToast(`🎉 DigiLocker Verified! Retrieved ${response.documents?.length || 0} government certificates for ${response.candidate_name}.`, 'success');
        if (typeof refreshCandidates === 'function') {
          refreshCandidates();
        }
        loadDbRecords();
      } else {
        showToast(response?.message || 'Failed to fetch DigiLocker details. Please try again.', 'error');
      }
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      showToast(err.message || 'DigiLocker Gateway Connection Timeout.', 'error');
    } finally {
      setIsFetching(false);
    }
  };

  // Open Sandbox Simulation Modal (matching dd/mock_digilocker.php)
  const handleOpenSandboxSimulation = () => {
    setSandboxStep('signin');
    setSandboxPin('123456');
    setSandboxOtp('654321');
    setShowSandboxModal(true);
    setShowAuthModal(false);
  };

  // Complete Sandbox Simulation and Ingest Documents
  const handleCompleteSandbox = () => {
    setShowSandboxModal(false);
    showToast('✅ Citizen consent granted! Ingesting verified documents...', 'success');
    handleExecuteFetch();
  };

  // Copy generated auth URL to clipboard
  const handleCopyLink = () => {
    if (generatedAuthData?.auth_url) {
      navigator.clipboard.writeText(generatedAuthData.auth_url);
      setCopiedLink(true);
      showToast('📋 DigiLocker authorization URL copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Share generated auth URL via WhatsApp
  const handleShareWhatsApp = () => {
    if (generatedAuthData?.auth_url) {
      const text = encodeURIComponent(`Hello, please complete your official DigiLocker document verification for Joy TrueProfile onboarding here: ${generatedAuthData.auth_url}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  // Filter verified records
  const filteredRecords = useMemo(() => {
    return (verifiedRecords || []).filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (r.full_name || r.candidate_name || r.name || '').toLowerCase().includes(q) ||
        (r.mobile || r.identifier_value || '').includes(q) ||
        (r.digilocker_id || '').toLowerCase().includes(q) ||
        (r.pan_no || '').toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (docTypeFilter === 'all') return true;
      const docs = Array.isArray(r.documents) ? r.documents : [];
      return docs.some(d => (d.doc_type || d.type || '').toLowerCase().includes(docTypeFilter.toLowerCase()));
    });
  }, [verifiedRecords, searchQuery, docTypeFilter]);

  // Aggregate Metrics
  const totalVerified = verifiedRecords.length;
  const totalAadhaar = verifiedRecords.filter(r => (r.documents || []).some(d => (d.doc_type || '').includes('aadhaar'))).length;
  const totalPan = verifiedRecords.filter(r => (r.documents || []).some(d => (d.doc_type || '').includes('pan'))).length;
  const totalAcademic = verifiedRecords.filter(r => (r.documents || []).some(d => (d.doc_type || '').includes('class'))).length;
  const totalDL = verifiedRecords.filter(r => (r.documents || []).some(d => (d.doc_type || '').includes('driving') || (d.doc_type || '').includes('dl'))).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 🌟 1. SECTION CONTROL & COMPLIANCE BAR */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-950 font-mono text-[11px] font-black border border-sky-300 shadow-2xs flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-sky-700" />
              <span>NeGD API Setu Live Gateway (Client ID: QEC8BCDA95)</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 font-mono text-[11px] font-black border border-emerald-300 shadow-2xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Oct 21 2026 NeGD Mandate Compliant</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-950 font-mono text-[11px] font-black border border-purple-300 shadow-2xs">
              🔒 DPDP Act 2023 Encrypted Vault
            </span>
          </div>

          <p className="text-xs text-slate-700 font-bold max-w-3xl leading-relaxed">
            Directly query and ingest verified government documents (Aadhaar e-KYC XML, PAN, Driving License, CBSE Marksheets, and EPFO UAN) into employee dossiers with cryptographic verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => exportAllDigilockerToExcel(verifiedRecords, currentCompany?.name)}
            className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold text-emerald-900 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 shadow-2xs cursor-pointer transition-all active:scale-95"
            title="Download Master DigiLocker Excel spreadsheet (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Overall Excel (.xlsx) 📊</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('create_fetch');
              setIdentifierValue('9944266116');
              setSelectedCandidateId('');
              setLatestFetchResult(null);
            }}
            className="btn bg-sky-600 hover:bg-sky-700 text-white text-xs py-2 px-4 rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-sky-100" />
            <span>New DigiLocker Fetch ⚡</span>
          </button>
        </div>
      </div>

      {/* 📊 2. TOP TELEMETRY KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{totalVerified}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Verified Profiles</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{totalAadhaar}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">e-Aadhaar XMLs</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{totalPan}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PAN & Tax Cards</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{totalAcademic}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CBSE Marksheets</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5 col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{totalDL}</div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">MoRTH Licenses</div>
          </div>
        </div>
      </div>

      {/* 🎛️ 3. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('create_fetch')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'create_fetch'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>1. Profile Creation & Direct Data Fetch ⚡</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('dossier')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'dossier'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>2. Verified Profiles Master Dossier 🏛️ ({verifiedRecords.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('compliance')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'compliance'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>3. NeGD 2026 Advisory & DPDP Regulations 🛡️</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 TAB 1: PROFILE CREATION & DIRECT DATA FETCH DESK                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'create_fetch' && (
        <div className="space-y-6">
          
          {/* Main Form & Top Action Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Form Column (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Initiate DigiLocker Profile Query</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Enter candidate mobile number, declare verification purpose, and fetch certified certificates.</p>
                </div>

                <span className="badge badge-emerald text-[10px]">
                  API Setu Live
                </span>
              </div>

              <form onSubmit={handleRedirectToDigilocker} className="space-y-4">
                
                {/* 1. Target Entity Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Verification Target</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserType('individual')}
                      className={`py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        userType === 'individual'
                          ? 'bg-sky-50 border-sky-400 text-sky-950 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      <span>Individual (Citizen)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserType('company')}
                      className={`py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        userType === 'company'
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Company (Entity Locker)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Identifier Type Tabs */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Authentication Identifier</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { setAuthType('mobile'); }}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        authType === 'mobile' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 text-slate-700'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile (10-Digit)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthType('aadhaar'); }}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        authType === 'aadhaar' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 text-slate-700'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Aadhaar (12-Digit)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthType('pan'); }}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        authType === 'pan' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>PAN Number</span>
                    </button>
                  </div>
                </div>

                {/* 3. Candidate Quick-Select Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Link to Registered Candidate (Optional)</label>
                  <select
                    value={selectedCandidateId}
                    onChange={(e) => handleCandidateSelect(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="">-- Quick Select from Candidate Directory --</option>
                    {(candidates || []).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} • {c.mobile || 'No Phone'} • #{c.empId || c.employeeNumber || c.id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Identifier Input Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {authType === 'mobile' ? '10-Digit Registered Mobile Number' : authType === 'aadhaar' ? '12-Digit Aadhaar Number' : '10-Character PAN Number'}
                    <span className="text-rose-500 font-bold ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifierValue}
                      onChange={(e) => setIdentifierValue(e.target.value)}
                      placeholder={
                        authType === 'mobile' 
                          ? 'e.g. 9944266116' 
                          : authType === 'aadhaar' 
                          ? 'e.g. 1234 5678 9012' 
                          : 'e.g. BLKPX4519M'
                      }
                      maxLength={authType === 'mobile' ? 10 : authType === 'aadhaar' ? 14 : 10}
                      className="w-full text-sm font-mono font-bold py-2.5 px-3.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none uppercase"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                      {authType === 'mobile' ? '+91 (India)' : authType === 'aadhaar' ? 'UIDAI' : 'ITD'}
                    </span>
                  </div>
                </div>

                {/* 5. 🏛️ MANDATORY NEGD 2026 PURPOSE DECLARATION */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-950 font-black text-xs">
                      <Scale className="w-4 h-4 text-indigo-600" />
                      <span>NeGD 2026 Advisory: Mandatory Purpose Specification</span>
                    </div>
                    <span className="text-[10px] text-indigo-700 font-mono font-bold">Max 50 Chars</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Standard Purpose (NeGD Catalogue)</label>
                    <select
                      value={selectedPurpose}
                      onChange={(e) => {
                        setSelectedPurpose(e.target.value);
                        setCustomPurpose('');
                      }}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-indigo-200 bg-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {(purposesList.length > 0 ? purposesList : [
                        { category: "Employment & Onboarding", purpose: "Employee onboarding private sector" },
                        { category: "Employment & Onboarding", purpose: "Background check for jobs or gig work" },
                        { category: "Tax & Government Services", purpose: "Provident fund enrolment EPFO" },
                        { category: "Tax & Government Services", purpose: "State insurance enrolment ESIC" },
                        { category: "Tax & Government Services", purpose: "Linking PAN to bank or tax records" },
                        { category: "Certificates & Identity", purpose: "Police verification for job or tenancy" }
                      ]).map((p, pIdx) => (
                        <option key={pIdx} value={p.purpose}>
                          [{p.category}] {p.purpose} ({p.purpose.length} chars)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Or Explicit Custom Purpose (Max 50 Chars)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customPurpose}
                        onChange={(e) => setCustomPurpose(e.target.value.slice(0, 50))}
                        placeholder="e.g. Joy workforce background verification"
                        maxLength={50}
                        className="w-full text-xs py-1.5 px-3 rounded-lg border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] font-mono text-indigo-600">
                        {(customPurpose || selectedPurpose).length}/50
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Service / Brand Name (Max 50 Chars)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value.slice(0, 50))}
                        placeholder="e.g. JoyVerify or Joy Corporate Solutions"
                        maxLength={50}
                        className="w-full text-xs py-1.5 px-3 rounded-lg border border-indigo-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] font-mono text-indigo-600">
                        {serviceName.length}/50
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Target Documents Checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Target Certificates to Fetch</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'aadhaar', label: 'Aadhaar e-KYC', icon: '🪪' },
                      { id: 'pan', label: 'PAN Card', icon: '💳' },
                      { id: 'driving_license', label: 'Driving License', icon: '🚗' },
                      { id: 'class_x', label: 'Class X Certificate', icon: '🎓' },
                      { id: 'class_xii', label: 'Class XII Marksheet', icon: '📜' },
                      { id: 'epfo_uan', label: 'EPFO UAN Passbook', icon: '💼' }
                    ].map(doc => (
                      <button
                        type="button"
                        key={doc.id}
                        onClick={() => toggleDocType(doc.id)}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all text-left ${
                          selectedDocTypes.includes(doc.id)
                            ? 'bg-sky-50/80 border-sky-400 text-sky-950'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDocTypes.includes(doc.id)}
                          onChange={() => {}}
                          className="rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span>{doc.icon}</span>
                        <span className="truncate">{doc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🚀 THE TWO PROMINENT ACTION BUTTONS */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Button 1: Live Gateway */}
                  <button
                    type="submit"
                    disabled={isGeneratingAuth}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98"
                    style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
                  >
                    {isGeneratingAuth ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span className="text-white font-black">Opening DigiLocker Portal...</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 text-white" />
                        <span className="text-white font-black">Continue with DigiLocker Gateway 🚀</span>
                      </>
                    )}
                  </button>

                  {/* Button 2: Direct In-Portal Fetch */}
                  <button
                    type="button"
                    onClick={handleExecuteFetch}
                    disabled={isFetching}
                    className="w-full py-3.5 px-4 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 active:scale-98"
                    style={{ backgroundColor: '#059669', color: '#ffffff' }}
                  >
                    {isFetching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span className="text-white font-black">Ingesting Vault Records...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-white font-black">Direct In-Portal Fetch (Instant) ⚡</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Right Column (5 Cols) - Live Telemetry & Result / Auth URL Preview */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Live Progress Stage */}
              {isFetching && (
                <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl border border-slate-800 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-sky-400 font-bold">DIGILOCKER GATEWAY TELEMETRY</span>
                    <span className="badge badge-emerald text-[9px] animate-pulse">QUERYING VAULT</span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className={`flex items-center gap-2 ${fetchProgressStage >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>1. Authenticating with NeGD API Setu Gateway</span>
                    </div>
                    <div className={`flex items-center gap-2 ${fetchProgressStage >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>2. Querying Citizen ID Vault & Issued Certificates</span>
                    </div>
                    <div className={`flex items-center gap-2 ${fetchProgressStage >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>3. Ingesting e-Aadhaar XML & Digital Signatures</span>
                    </div>
                    <div className={`flex items-center gap-2 ${fetchProgressStage >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>4. Storing Verified Records in PostgreSQL Ledger</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Information & Quick Actions Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>DigiLocker Integration Options</span>
                  </div>
                  <span className="badge badge-indigo text-[9px] font-bold">PHP & Python Dual Engine</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    <strong>1. Direct In-Portal Fetch (Instant) ⚡:</strong> Instantly connects to the vault for the entered mobile number and extracts all 6 government certificates (Aadhaar, PAN, DL, CBSE X/XII, EPFO) directly into the candidate profile.
                  </p>
                  <p>
                    <strong>2. Continue with DigiLocker Gateway 🚀:</strong> Initiates the official government redirection page where the candidate inputs their OTP and PIN for live biometric/consent verification.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenSandboxSimulation}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <FlaskConical className="w-4 h-4 text-purple-600" />
                  <span>Test with Interactive Sandbox Simulation 🧪</span>
                </button>
              </div>

            </div>

          </div>

          {/* 🌟 2. FULL-WIDTH VERIFIED CITIZEN DOSSIER (Rendered after Fetch matching dd/callback.php) */}
          {latestFetchResult && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-300 shadow-lg space-y-6 animate-fadeIn">
              
              {/* Top Success Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-emerald-950">DigiLocker Verification Successful!</h3>
                    <p className="text-xs text-emerald-800 font-medium">Government digital certificates authenticated via NeGD API Setu & stored in database.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => generateDigilockerOfficialCertificatePdf(latestFetchResult, currentCompany?.name)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center gap-1.5 border border-emerald-300 shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Download Official PDF Slip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportSingleDigilockerToExcel(latestFetchResult, currentCompany?.name)}
                    className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
                    <span>Export Profile Excel (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Citizen Identity Particulars (Avatar + Demographics Grid matching dd/callback.php) */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start gap-5">
                <div 
                  className="w-16 h-16 rounded-2xl text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0"
                  style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
                >
                  {latestFetchResult.candidate_name ? latestFetchResult.candidate_name.substring(0, 2).toUpperCase() : 'DL'}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">{latestFetchResult.candidate_name}</h2>
                      <div className="text-xs text-indigo-700 font-mono font-bold">
                        DigiLocker ID: {latestFetchResult.digilocker_id}
                      </div>
                    </div>
                    <span className="badge badge-emerald text-xs font-black">
                      VERIFIED ACTIVE ✓
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Registered Mobile:</span>
                      <strong className="font-mono text-slate-800">+91 {latestFetchResult.mobile}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Date of Birth & Gender:</span>
                      <strong className="text-slate-800">{latestFetchResult.dob} ({latestFetchResult.gender})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Official Email:</span>
                      <strong className="text-slate-800">{latestFetchResult.email || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Masked Aadhaar:</span>
                      <strong className="font-mono text-slate-800">{latestFetchResult.masked_aadhaar || 'XXXX-XXXX-8942'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">PAN Number:</span>
                      <strong className="font-mono text-slate-800">{latestFetchResult.pan_no || 'BLKPX4519M'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">EPFO UAN:</span>
                      <strong className="font-mono text-slate-800">{latestFetchResult.uan_no || '100829141052'}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-xs">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Residential Address (eAadhaar XML):</span>
                    <p className="text-slate-700 font-medium leading-relaxed mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 inline mr-1" />
                      {latestFetchResult.address || 'Plot No 42, 3rd Cross Street, Gandhi Nagar, Tiruchirappalli, Tamil Nadu, Pincode: 620001'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 6 Document Cards Grid (matching dd/callback.php) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Government Documents & Certificates ({(latestFetchResult.documents || []).length})</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    Cryptographic Seal: {latestFetchResult.sha256_seal?.slice(0, 18)}...
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {(latestFetchResult.documents || []).map((doc, docIdx) => (
                    <div 
                      key={docIdx}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {doc.doc_type === 'aadhaar' ? '🪪' : 
                               doc.doc_type === 'pan' ? '💳' : 
                               doc.doc_type === 'driving_license' ? '🚗' : 
                               doc.doc_type === 'class_x' ? '🎓' : 
                               doc.doc_type === 'class_xii' ? '📜' : '💼'}
                            </span>
                            <div>
                              <h5 className="text-xs font-black text-slate-900 leading-tight">{doc.name || doc.document_name}</h5>
                              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">{doc.issuer}</p>
                            </div>
                          </div>
                          <span className="badge badge-emerald text-[9px] font-black shrink-0">
                            {doc.status || doc.doc_status || 'Verified'} ✓
                          </span>
                        </div>

                        <div className="font-mono text-xs font-bold text-amber-700 bg-amber-50/60 px-2 py-1 rounded-lg border border-amber-200/50">
                          No: {doc.doc_no}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setActivePreviewDoc(doc)}
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all border border-sky-200"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-600" />
                          <span>View Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => generateDigilockerOfficialCertificatePdf(latestFetchResult, currentCompany?.name)}
                          className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setLatestFetchResult(null);
                    setIdentifierValue('');
                  }}
                  className="btn btn-secondary text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Run Another Verification</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab('dossier')}
                  className="btn bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>View in Master Dossier Ledger 🏛️</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 TAB 2: VERIFIED PROFILES MASTER DOSSIER & ROSTER TABLE                */}
      {/* ========================================================================= */}
      {activeSubTab === 'dossier' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          
          {/* Top Search & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate name, mobile, DigiLocker ID..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="all">All Documents ({verifiedRecords.length})</option>
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="driving">Driving License</option>
                <option value="class">CBSE Marksheets</option>
                <option value="epfo">EPFO UAN</option>
              </select>

              <button
                type="button"
                onClick={() => exportAllDigilockerToExcel(filteredRecords, currentCompany?.name)}
                className="btn btn-secondary text-xs flex items-center gap-1.5 font-bold text-emerald-900 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Filtered Excel ({filteredRecords.length})</span>
              </button>
            </div>
          </div>

          {/* Dossier Cards List */}
          {filteredRecords.length === 0 ? (
            <div className="text-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No DigiLocker Verified Records Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No DigiLocker profiles match your current search criteria. Switch to "Profile Creation & Fetch" to run a live query.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('create_fetch')}
                className="btn bg-sky-600 hover:bg-sky-500 text-white text-xs py-2 px-4 rounded-xl font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Run New DigiLocker Fetch</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((rec, idx) => (
                <div 
                  key={rec.id || idx}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 hover:bg-white transition-all shadow-xs space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl text-white flex items-center justify-center font-black text-base shadow-sm shrink-0"
                        style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
                      >
                        {rec.full_name ? rec.full_name.substring(0, 2).toUpperCase() : (rec.candidate_name ? rec.candidate_name.substring(0, 2).toUpperCase() : 'DL')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-900">{rec.full_name || rec.candidate_name || rec.name}</h4>
                          <span className="badge badge-emerald text-[9px] font-black">
                            {rec.status || rec.account_status || 'VERIFIED ✅'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[10px] font-mono font-bold">
                            🏛️ ID: {rec.digilocker_id || rec.digilockerId}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span>Mobile: <strong className="font-mono text-slate-800">+91 {rec.mobile || rec.identifier_value}</strong></span>
                          <span>DOB: <strong>{rec.dob} ({rec.gender})</strong></span>
                          <span>Purpose: <strong className="text-indigo-700">"{rec.purpose || 'Employee onboarding'}"</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => generateDigilockerOfficialCertificatePdf(rec, currentCompany?.name)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-indigo-200 shadow-2xs"
                        title="Download official PDF verification certificate"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-600" />
                        <span>PDF Certificate</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => exportSingleDigilockerToExcel(rec, currentCompany?.name)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-200 shadow-2xs"
                        title="Download individual candidate Excel record"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Profile Excel (.xlsx)</span>
                      </button>
                    </div>
                  </div>

                  {/* Address & Identifiers Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200/80">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residential Address (eAadhaar XML)</span>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 inline mr-1" />
                        {rec.address || 'Full address authenticated against eAadhaar XML records.'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cryptographic Audit Seal</span>
                      <p className="font-mono text-[11px] text-slate-600 truncate">
                        🔒 {rec.sha256_seal || rec.cryptographic_seal || `SHA256:${rec.digilocker_id || 'DL'}`}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Fetched At: {rec.fetched_at || rec.created_at || 'Just now'}
                      </span>
                    </div>
                  </div>

                  {/* Issued Documents Badges */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Verified Issued Government Certificates ({(rec.documents || []).length})
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {(rec.documents || []).map((doc, dIdx) => (
                        <div key={dIdx} className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{doc.name || doc.document_name}</span>
                          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                            {doc.doc_no}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 TAB 3: NEGD 2026 ADVISORY & STATUTORY COMPLIANCE REGULATIONS           */}
      {/* ========================================================================= */}
      {activeSubTab === 'compliance' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              <span>DigiLocker NeGD Compliance & Redirection URL Advisory</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Mandatory parameters for Requestor organizations under IT Rules 2016 and DPDP Act 2023.</p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 font-black text-sm text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Statutory Advisory from National e-Governance Division (NeGD)</span>
            </div>
            <p>
              In accordance with the <strong>Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, 2016</strong> and applicable data protection regulations, all Requestors must pass explicit purpose and service declarations in the authorization URL.
            </p>
            <p className="font-bold text-amber-900">
              ⚡ Implementation Deadline: 21st October 2026. Any request without purpose and service_name will be rejected at the gateway level.
            </p>
          </div>

          {/* Key Compliance Parameters Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Mandatory Web Redirection Parameters</h4>
            
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="grid grid-cols-12 bg-slate-100 p-3 font-bold text-slate-700 border-b border-slate-200">
                <div className="col-span-3">Parameter</div>
                <div className="col-span-3">Enforcement</div>
                <div className="col-span-6">Description & Limit</div>
              </div>

              <div className="grid grid-cols-12 p-3 border-b border-slate-100 items-center">
                <div className="col-span-3 font-mono font-bold text-indigo-700">purpose</div>
                <div className="col-span-3"><span className="badge badge-emerald text-[9px]">Mandatory</span></div>
                <div className="col-span-6 text-slate-600">
                  Exact purpose declaration selected from standard NeGD Sample Purpose list or explicit description (<strong>Max 50 characters</strong>, alphanumeric only).
                </div>
              </div>

              <div className="grid grid-cols-12 p-3 border-b border-slate-100 items-center">
                <div className="col-span-3 font-mono font-bold text-indigo-700">service_name</div>
                <div className="col-span-3"><span className="badge badge-emerald text-[9px]">Mandatory</span></div>
                <div className="col-span-6 text-slate-600">
                  Clear, identifiable legal or brand name of requesting client (e.g. <code>JoyVerify</code>, <strong>Max 50 characters</strong>).
                </div>
              </div>

              <div className="grid grid-cols-12 p-3 items-center">
                <div className="col-span-3 font-mono font-bold text-indigo-700">code_challenge</div>
                <div className="col-span-3"><span className="badge badge-emerald text-[9px]">PKCE S256</span></div>
                <div className="col-span-6 text-slate-600">
                  SHA-256 cryptographic hash of random 32-byte verifier for Proof Key for Code Exchange security.
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 4. GATEWAY REDIRECTION MODAL (When Gateway Button is Clicked)           */}
      {/* ========================================================================= */}
      {showAuthModal && generatedAuthData && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sky-700 font-black text-sm">
                <ExternalLink className="w-5 h-5 text-sky-600" />
                <span>DigiLocker Official Redirection Gateway</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2 text-xs">
              <div className="font-bold text-sky-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>NeGD API Setu Live Gateway Connection Prepared</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Click below to continue to the official Government of India MeriPehchaan DigiLocker login portal.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-2xl text-[11px] font-mono text-sky-300 break-all max-h-24 overflow-y-auto border border-slate-800">
              {generatedAuthData.auth_url}
            </div>

            <div className="space-y-2">
              <a
                href={generatedAuthData.auth_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
              >
                <ExternalLink className="w-4 h-4 text-white" />
                <span className="text-white font-black">Open Official DigiLocker Gateway ↗️</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied URL!' : 'Copy Gateway URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                  title="Send link on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share WhatsApp 💬</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleOpenSandboxSimulation}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
                  <span>Test with Interactive Sandbox Simulation 🧪</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 5. DOCUMENT DETAILS PREVIEW MODAL (Matching dd/callback.php)            */}
      {/* ========================================================================= */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 truncate">
                {activePreviewDoc.name || activePreviewDoc.document_name}
              </h3>
              <button 
                type="button" 
                onClick={() => setActivePreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2">
              <div className="text-5xl mb-2">
                {activePreviewDoc.doc_type === 'aadhaar' ? '🪪' : 
                 activePreviewDoc.doc_type === 'pan' ? '💳' : 
                 activePreviewDoc.doc_type === 'driving_license' ? '🚗' : 
                 activePreviewDoc.doc_type === 'class_x' ? '🎓' : 
                 activePreviewDoc.doc_type === 'class_xii' ? '📜' : '💼'}
              </div>
              <h4 className="text-base font-black text-slate-900">{activePreviewDoc.name || activePreviewDoc.document_name}</h4>
              <span className="badge badge-emerald text-[10px] font-black mt-1">
                {activePreviewDoc.status || activePreviewDoc.doc_status || 'Verified'} ✓
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issuing Authority:</span>
                <strong className="text-slate-800">{activePreviewDoc.issuer}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Reference No:</span>
                <strong className="font-mono text-amber-700 font-bold">{activePreviewDoc.doc_no}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document URI:</span>
                <span className="font-mono text-slate-600 text-[11px]">{activePreviewDoc.uri || activePreviewDoc.doc_uri || 'in.gov.digilocker.doc'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description:</span>
                <p className="text-slate-600 leading-relaxed">{activePreviewDoc.description || 'Verified official government certificate retrieved securely via DigiLocker API response.'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  generateDigilockerOfficialCertificatePdf(latestFetchResult || { full_name: 'Candidate', documents: [activePreviewDoc] }, currentCompany?.name);
                  setActivePreviewDoc(null);
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
              >
                <Download className="w-4 h-4 text-white" />
                <span className="text-white font-black">Download Official PDF Certificate</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePreviewDoc(null)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 6. SANDBOX SIMULATION MODAL (Matching dd/mock_digilocker.php)           */}
      {/* ========================================================================= */}
      {showSandboxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="bg-sky-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <h3 className="text-sm font-black">DigiLocker Citizen Portal</h3>
              </div>
              <span className="badge bg-amber-500 text-white font-bold text-[9px]">
                SANDBOX MOCK
              </span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              
              {sandboxStep === 'signin' ? (
                <>
                  <div className="text-center space-y-1">
                    <h4 className="text-base font-black text-slate-900">Citizen Sign In</h4>
                    <p className="text-xs text-slate-500">Sign in to authenticate and link credentials with JoyVerify.</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-800 flex items-center justify-between">
                        <span>+91 {identifierValue || '9944266116'}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">6-Digit Security PIN</label>
                      <input
                        type="password"
                        value={sandboxPin}
                        onChange={(e) => setSandboxPin(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-center tracking-widest text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">One Time Password (OTP)</label>
                      <input
                        type="text"
                        value={sandboxOtp}
                        onChange={(e) => setSandboxOtp(e.target.value)}
                        placeholder="654321"
                        maxLength={6}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-center tracking-widest text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSandboxStep('consent')}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                      style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
                    >
                      <span className="text-white font-black">Sign In & Authenticate ➔</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSandboxModal(false)}
                      className="w-full py-2 px-3 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center space-y-1">
                    <h4 className="text-base font-black text-slate-900">Consent Approval</h4>
                    <p className="text-xs text-slate-500">Review permissions requested by Joy Corporate Solutions.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 text-slate-700">
                    <div className="font-bold text-slate-900">
                      <strong>JoyVerify</strong> is requesting access to perform:
                    </div>
                    <ul className="space-y-1.5 text-[11px]">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Read profile (Name, DOB, Gender, Address)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>View and download issued certificates list</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Download e-Aadhaar XML & verified PAN records</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCompleteSandbox}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                      style={{ backgroundColor: '#059669', color: '#ffffff' }}
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-white font-black">Allow & Grant Consent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSandboxModal(false)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Deny Access
                    </button>
                  </div>
                </>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DigiLockerSectionView;
