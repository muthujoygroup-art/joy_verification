import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/uiSoundEffects';
import { EmployeeProfileDossierModal } from './EmployeeProfileDossierModal';
import {
  Search,
  X,
  UserCheck,
  Building2,
  Zap,
  Download,
  Scale,
  LifeBuoy,
  Bell,
  Compass,
  CreditCard,
  Volume2,
  VolumeX,
  ShieldCheck,
  Activity,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Terminal,
  Clock,
  Sparkles,
  Crown,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Users,
  Layers,
  KeyRound,
  Filter
} from 'lucide-react';

// Institutional 81 Neev API catalogue items for immediate search matching
const DEFAULT_NEEV_APIS = [
  { id: 'aadhaar-v2', name: 'Aadhaar Detail Verification V2', path: '/aadhaar-detail-verification-v2', category: 'Identity Verification', desc: 'UIDAI OTP verification with name, DOB, address & photo validation.' },
  { id: 'aadhaar-link', name: 'Aadhaar Link Check', path: '/aadhaar-link-check', category: 'Identity Verification', desc: 'Checks if Mobile or Email is officially linked to Aadhaar.' },
  { id: 'aadhaar-pan', name: 'Aadhaar to PAN Retrieval', path: '/aadhaar-to-pan', category: 'Identity Verification', desc: 'Retrieves verified PAN registered with Aadhaar.' },
  { id: 'pan-basic', name: 'PAN Basic Verification', path: '/pan-basic', category: 'Identity Verification', desc: 'ITD real-time PAN number, holder name & status check.' },
  { id: 'pan-comp', name: 'PAN Comprehensive OCR Verification', path: '/pan-comprehensive', category: 'Identity Verification', desc: 'Extracts and verifies PAN details from image or direct number.' },
  { id: 'bank-penny', name: 'Bank Account Penny Drop (IMPS)', path: '/bank-verification', category: 'Banking & UPI', desc: 'NPCI IMPS instant penny drop verifying account holder name match.' },
  { id: 'upi-vpa', name: 'UPI VPA Handle Verification', path: '/upi-verification', category: 'Banking & UPI', desc: 'Validates UPI ID (e.g. name@okhdfcbank) and fetches registered name.' },
  { id: 'uan-epfo', name: 'UAN EPFO Employment History', path: '/uan-verification', category: 'Employment & UAN', desc: 'Fetches complete employer tenure history, PF contributions & dual employment.' },
  { id: 'driving-license', name: 'Driving License Verification (Sarathi)', path: '/driving-license-verification', category: 'Identity Verification', desc: 'MoRTH Sarathi verification with vehicle classes, validity & address.' },
  { id: 'rc-vehicle', name: 'RC Vehicle Verification (Vahan)', path: '/rc-verification', category: 'Vehicle & RC', desc: 'MoRTH Vahan check for vehicle ownership, chassis, engine & fitness.' },
  { id: 'passport-check', name: 'Passport Verification (MEA)', path: '/passport-verification', category: 'Identity Verification', desc: 'Ministry of External Affairs file number and passport authenticity.' },
  { id: 'voter-id', name: 'Voter ID Verification (ECI EPIC)', path: '/voter-id-verification', category: 'Identity Verification', desc: 'Election Commission of India EPIC number and polling station.' },
  { id: 'court-records', name: 'e-Courts Criminal & Civil Record Search', path: '/court-case-search', category: 'Court & Criminal', desc: 'Supreme Court, High Court & 3,000+ District Court litigation checks.' },
  { id: 'gstin-check', name: 'GSTIN Business Tax Verification', path: '/gstin-verification', category: 'Business & Compliance', desc: 'GST portal business name, state jurisdiction, active status & filings.' },
  { id: 'mca-din', name: 'MCA Director DIN Verification', path: '/din-verification', category: 'Business & Compliance', desc: 'Ministry of Corporate Affairs Director Identification Number & company filings.' },
  { id: 'face-match', name: 'AI Face Match & Liveness Biometrics', path: '/face-match-verification', category: 'Identity Verification', desc: 'High-assurance selfie-to-ID card biometric facial comparison score.' },
  { id: 'credit-cibil', name: 'Credit Score & Financial Health Check', path: '/credit-score-check', category: 'Financial & Credit', desc: 'Authorized credit bureau history, defaults & loan telemetry.' },
  { id: 'police-pcc', name: 'Police Clearance Certificate (PCC)', path: '/pcc-verification', category: 'Court & Criminal', desc: 'State police department verification check for criminal antecedents.' }
];

export const UniversalSpotlightOmnibar = ({ isOpen = false, onClose }) => {
  const {
    candidates = [],
    companies = [],
    hrUsers = [],
    currentRole = 'superadmin',
    currentUser = null,
    showToast,
    systemHealthData,
    pingGateway
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'candidates' | 'actions' | 'apis' | 'companies'
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [activeDossierCandidate, setActiveDossierCandidate] = useState(null);
  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());

  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      soundEngine.playPopup?.();
      setSearchQuery('');
      setHighlightedIndex(0);
      setSelectedCategory('all');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global Keyboard Listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Omnibar on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (isOpen) {
          onClose?.();
        } else {
          window.dispatchEvent(new CustomEvent('open_omnibar'));
        }
        return;
      }

      // Quick slash trigger when not in an active input
      if (e.key === '/' && !isOpen) {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (!['input', 'textarea', 'select'].includes(activeTag) && !document.activeElement?.isContentEditable) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('open_omnibar'));
          return;
        }
      }

      // If Omnibar is not open, ignore navigation keys
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        soundEngine.playClick?.();
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Toggle Sound SFX
  const handleToggleSound = () => {
    const next = soundEngine.toggleMute();
    setIsMuted(next);
    if (!next) soundEngine.playSuccess?.();
    showToast?.(next ? 'Audio sound effects muted 🔇' : 'Audio sound effects enabled 🔊');
  };

  // Base platform actions catalogue
  const actionsCatalogue = useMemo(() => {
    return [
      {
        id: 'act-add-candidate',
        title: 'Send Verification Link to Candidate',
        subtitle: '1-Click candidate onboarding via WhatsApp, SMS & Email',
        category: 'actions',
        icon: UserCheck,
        badge: 'Recruiter',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        action: () => {
          window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
            detail: { section: 'profiler_dispatch', tab: 'profiler', action: 'add_candidate' }
          }));
          onClose?.();
        }
      },
      {
        id: 'act-universal-export',
        title: 'Download Universal Reports (PDF, Excel, Word, ZIP)',
        subtitle: 'Date-filtered statutory verification dossiers with SHA-256 seals',
        category: 'actions',
        icon: Download,
        badge: 'Export',
        badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        action: () => {
          window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
            detail: { modal: 'universal_export' }
          }));
          onClose?.();
        }
      },
      {
        id: 'act-dpdp-handbook',
        title: 'DPDP Act 2023 Statutory Privacy Handbook',
        subtitle: 'Candidate consent lifecycle, data rights & digital audit protocols',
        category: 'actions',
        icon: Scale,
        badge: 'Compliance',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        action: () => {
          window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
            detail: { modal: 'legal_handbook' }
          }));
          onClose?.();
        }
      },
      {
        id: 'act-tour-guide',
        title: 'Launch Interactive Platform Feature Tour',
        subtitle: 'Step-by-step guided walkthrough of verification workflows',
        category: 'actions',
        icon: Compass,
        badge: 'Walkthrough',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        action: () => {
          window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
            detail: { modal: 'tour' }
          }));
          onClose?.();
        }
      },
      {
        id: 'act-notifications',
        title: 'Real-Time Notifications & System Alerts',
        subtitle: 'View verification completions, security events & threshold warnings',
        category: 'actions',
        icon: Bell,
        badge: 'Alerts',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        action: () => {
          window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
            detail: { modal: 'notifications' }
          }));
          onClose?.();
        }
      },
      {
        id: 'act-support-ticket',
        title: 'Raise Support Ticket / Platform Feedback',
        subtitle: 'Direct SLA-backed communication with Joy Verification engineers',
        category: 'actions',
        icon: LifeBuoy,
        badge: 'Help Desk',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
        action: () => {
          window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
            detail: { modal: 'support' }
          }));
          onClose?.();
        }
      },
      {
        id: 'act-billing-ledger',
        title: 'Postpaid Billing & GST Invoices Ledger',
        subtitle: 'Inspect monthly profile verification consumption & tax invoices',
        category: 'actions',
        icon: CreditCard,
        badge: 'Finance',
        badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
        action: () => {
          window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
            detail: { section: 'billing_finance', tab: 'billing' }
          }));
          onClose?.();
        }
      },
      {
        id: 'act-system-health',
        title: 'System Health & Live API Gateway Status',
        subtitle: 'Check 99.99% SLA, latency benchmarks & UIDAI/ITD connections',
        category: 'actions',
        icon: Activity,
        badge: 'Telemetry',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        action: () => {
          if (pingGateway) pingGateway();
          window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
            detail: { section: 'db_security', tab: 'health' }
          }));
          onClose?.();
        }
      },
      {
        id: 'act-toggle-audio',
        title: isMuted ? 'Enable UI Audio Sound Effects' : 'Mute UI Audio Sound Effects',
        subtitle: 'Toggle tactile sound engine feedback for clicks, approvals & toasts',
        category: 'actions',
        icon: isMuted ? VolumeX : Volume2,
        badge: isMuted ? 'Muted' : 'Audio Active',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
        action: handleToggleSound
      }
    ];
  }, [isMuted, onClose, pingGateway, showToast]);

  // Filter and rank search results across all categories
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Candidate results
    const matchedCandidates = (candidates || []).filter(c => {
      if (!c) return false;
      if (!q) return true;
      const name = (c.name || '').toLowerCase();
      const token = (c.verificationToken || c.token || '').toLowerCase();
      const empId = (c.empId || c.employeeNumber || '').toLowerCase();
      const email = (c.email || '').toLowerCase();
      const mobile = (c.mobile || '').replace(/\D/g, '');
      const compName = (c.companyName || '').toLowerCase();
      const status = (c.overallStatus || c.status || '').toLowerCase();
      return name.includes(q) || token.includes(q) || empId.includes(q) || 
             email.includes(q) || mobile.includes(q) || compName.includes(q) || status.includes(q);
    }).slice(0, q ? 10 : 4).map(c => ({
      id: `cand-${c.id || c.token}`,
      type: 'candidate',
      title: c.name || 'Candidate',
      subtitle: `${c.empId || c.employeeNumber || 'JOY-EMP'} • ${c.companyName || 'Corporate Workforce'} • ${c.mobile || 'No Mobile'}`,
      token: c.verificationToken || c.token || c.id,
      status: (c.overallStatus || c.status || 'PENDING').toUpperCase(),
      candidateData: c,
      category: 'candidates',
      action: () => {
        soundEngine.playSuccess?.();
        setActiveDossierCandidate(c);
      }
    }));

    // 2. Action results
    const matchedActions = actionsCatalogue.filter(act => {
      if (!q) return true;
      return act.title.toLowerCase().includes(q) || act.subtitle.toLowerCase().includes(q) || act.badge.toLowerCase().includes(q);
    }).slice(0, q ? 6 : 4).map(act => ({
      ...act,
      type: 'action'
    }));

    // 3. 81 Neev API endpoints
    const matchedApis = DEFAULT_NEEV_APIS.filter(api => {
      if (!q) return true;
      return api.name.toLowerCase().includes(q) || api.path.toLowerCase().includes(q) || 
             api.desc.toLowerCase().includes(q) || api.category.toLowerCase().includes(q);
    }).slice(0, q ? 8 : 4).map(api => ({
      id: `api-${api.id}`,
      type: 'api',
      title: api.name,
      subtitle: `${api.path} • ${api.desc}`,
      badge: api.category,
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      category: 'apis',
      action: () => {
        soundEngine.playClick?.();
        window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
          detail: { 
            section: 'gateways_engine', 
            tab: 'api-tester',
            endpoint: api.path
          }
        }));
        onClose?.();
      }
    }));

    // 4. Companies & Tenants (for Super Admin & Company views)
    const matchedCompanies = (companies || []).filter(comp => {
      if (!comp) return false;
      if (!q) return true;
      const cName = (comp.name || '').toLowerCase();
      const cCode = (comp.code || '').toLowerCase();
      const cDomain = (comp.domain || '').toLowerCase();
      return cName.includes(q) || cCode.includes(q) || cDomain.includes(q);
    }).slice(0, q ? 5 : 2).map(comp => ({
      id: `comp-${comp.id}`,
      type: 'company',
      title: comp.name || 'Company Account',
      subtitle: `${comp.code || 'COMP'} • ${comp.plan || 'Postpaid Tier'} • ${comp.activeEmployeesCount || 0} Employees`,
      badge: comp.status || 'Active',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      category: 'companies',
      action: () => {
        soundEngine.playClick?.();
        window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
          detail: { section: 'core_ops', tab: 'companies', companyId: comp.id }
        }));
        onClose?.();
      }
    }));

    // Grouping by selected category filter
    const pool = [];
    if (selectedCategory === 'all' || selectedCategory === 'candidates') {
      pool.push(...matchedCandidates);
    }
    if (selectedCategory === 'all' || selectedCategory === 'actions') {
      pool.push(...matchedActions);
    }
    if (selectedCategory === 'all' || selectedCategory === 'apis') {
      pool.push(...matchedApis);
    }
    if (selectedCategory === 'all' || selectedCategory === 'companies') {
      pool.push(...matchedCompanies);
    }

    return pool;
  }, [searchQuery, selectedCategory, candidates, actionsCatalogue, companies, onClose]);

  // Keep highlighted index in bounds
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchResults.length, selectedCategory]);

  // Handle keyboard navigation (Arrow Up, Arrow Down, Enter)
  const handleKeyDownInResults = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      soundEngine.playHover?.();
      setHighlightedIndex(prev => (prev + 1 < searchResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      soundEngine.playHover?.();
      setHighlightedIndex(prev => (prev - 1 >= 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = searchResults[highlightedIndex];
      if (target && target.action) {
        soundEngine.playSuccess?.();
        target.action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  if (!isOpen && !activeDossierCandidate) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 animate-fadeIn select-none">
          
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />

          {/* Main Floating Omnibar Panel */}
          <div 
            className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[82vh] animate-scaleUp text-slate-900"
            onKeyDown={handleKeyDownInResults}
          >
            
            {/* Top Role Accent Strip */}
            <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500" />

            {/* Omnibar Input Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Search className="w-5 h-5 text-indigo-600" />
              </div>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search candidates, 81 verification APIs, companies, or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-slate-900 font-bold text-sm sm:text-base placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0"
              />

              <div className="flex items-center gap-2 shrink-0">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Clear search query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-md shadow-2xs">
                  ESC
                </kbd>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="px-3 sm:px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
              {[
                { id: 'all', label: 'All Results' },
                { id: 'candidates', label: `Candidates (${candidates.length})` },
                { id: 'actions', label: 'Quick Actions' },
                { id: 'apis', label: '81 Govt APIs' },
                { id: 'companies', label: `Companies (${companies.length})` }
              ].map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick?.();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs font-black'
                        : 'bg-white hover:bg-slate-200/80 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Results Roster List */}
            <div 
              ref={resultsContainerRef}
              className="p-2 sm:p-3 overflow-y-auto max-h-[50vh] space-y-1 divide-y divide-slate-50"
            >
              {searchResults.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-800 text-sm">No matches found for "{searchQuery}"</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try searching with candidate name, Aadhaar, token number (e.g. tok_...), PAN, or API endpoint name.
                    </p>
                  </div>
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const isHighlighted = idx === highlightedIndex;

                  // Render Candidate Row
                  if (item.type === 'candidate') {
                    const isApproved = item.status === 'APPROVED' || item.status === 'VERIFIED';
                    return (
                      <div
                        key={item.id}
                        data-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          isHighlighted 
                            ? 'bg-indigo-50/80 border-indigo-200 shadow-xs translate-x-0.5' 
                            : 'bg-white hover:bg-slate-50 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                            isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          }`}>
                            {item.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-xs sm:text-sm text-slate-900 truncate">
                                {item.title}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {item.token}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                isApproved 
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg">
                            Open Dossier 🗂️
                          </span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${isHighlighted ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300'}`} />
                        </div>
                      </div>
                    );
                  }

                  // Render Action Row
                  if (item.type === 'action') {
                    const ActionIcon = item.icon || Zap;
                    return (
                      <div
                        key={item.id}
                        data-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          isHighlighted 
                            ? 'bg-indigo-50/80 border-indigo-200 shadow-xs translate-x-0.5' 
                            : 'bg-white hover:bg-slate-50 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
                            <ActionIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs sm:text-sm text-slate-900 truncate">
                                {item.title}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${item.badgeColor || 'bg-slate-100 text-slate-800'}`}>
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Execute
                          </span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${isHighlighted ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300'}`} />
                        </div>
                      </div>
                    );
                  }

                  // Render 81 API Row
                  if (item.type === 'api') {
                    return (
                      <div
                        key={item.id}
                        data-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          isHighlighted 
                            ? 'bg-sky-50/80 border-sky-200 shadow-xs translate-x-0.5' 
                            : 'bg-white hover:bg-slate-50 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs font-mono font-bold text-[10px]">
                            POST
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs sm:text-sm text-slate-900 truncate">
                                {item.title}
                              </span>
                              <span className="font-mono text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                                81 Neev API
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline-block text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-lg">
                            Test Endpoint ⚡
                          </span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${isHighlighted ? 'text-sky-600 translate-x-0.5' : 'text-slate-300'}`} />
                        </div>
                      </div>
                    );
                  }

                  // Render Company Row
                  return (
                    <div
                      key={item.id}
                      data-index={idx}
                      onClick={item.action}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                        isHighlighted 
                          ? 'bg-purple-50/80 border-purple-200 shadow-xs translate-x-0.5' 
                          : 'bg-white hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs sm:text-sm text-slate-900 truncate">
                              {item.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-block text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-lg">
                          Manage Tenant 🏢
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isHighlighted ? 'text-purple-600 translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Omnibar Footer Helper Bar */}
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-700 text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-700 text-[10px]">↓</kbd>
                  <span className="text-slate-600">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-700 text-[10px]">↵</kbd>
                  <span className="text-slate-600">Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-700 text-[10px]">ESC</kbd>
                  <span className="text-slate-600">Close</span>
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-indigo-700 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>JOY Spotlight Omnibar v2.0</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Embedded Candidate Dossier Preview if candidate selected from Omnibar */}
      {activeDossierCandidate && (
        <EmployeeProfileDossierModal
          candidate={activeDossierCandidate}
          onClose={() => setActiveDossierCandidate(null)}
        />
      )}
    </>
  );
};

export default UniversalSpotlightOmnibar;
