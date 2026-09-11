import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/uiSoundEffects';
import { ActiveSessionBadge } from './ActiveSessionBadge';
import {
  Building2,
  Zap,
  CreditCard,
  Database,
  ShieldCheck,
  Users,
  UserCheck,
  Smartphone,
  Search,
  Star,
  FileText,
  TrendingUp,
  Settings,
  Sliders,
  Scale,
  LifeBuoy,
  Download,
  User,
  Activity,
  Bell,
  LogOut,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  X,
  Sparkles,
  Crown,
  ChevronRight,
  Layers,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle2,
  Mail
} from 'lucide-react';

export const PortalSidebarNav = ({ onCloseMobile, isMobile = false, isCollapsed = false, onToggleCollapse }) => {
  const {
    currentUser,
    currentRole,
    logoutUser,
    candidates,
    hrUsers,
    notifications,
    platformLogoEmblem
  } = useApp();

  // 1. Top Segmented Switcher: 'company' (Enterprise Operations) vs 'personal' (My Workspace)
  const [workspaceMode, setWorkspaceMode] = useState('company');

  // 2. Real-Time Quick Search Input State
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Audio SFX Mute State
  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());

  // 4. Accordion Expanded Pillars (keyed by pillarId: boolean)
  const [expandedPillars, setExpandedPillars] = useState({
    core_ops: true,
    gateways_engine: false,
    billing_finance: false,
    db_security: false,
    gov_reports: true,
    // Company Admin
    telemetry_candidates: true,
    hr_governance: false,
    vendor_verification: true,
    corporate_dms: false,
    billing_gateways: false,
    // HR Executive
    pipeline_dossiers: true,
    profiler_dispatch: false,
    statutory_settings: false,
    // Candidate
    cand_identity: true,
    cand_financial: false,
    cand_joining: false,
    cand_certs: false
  });

  // 5. Active Selected Pillar & Division State
  const [activePillarId, setActivePillarId] = useState(() => {
    if (currentRole === 'superadmin') return 'core_ops';
    if (currentRole === 'company') return 'telemetry_candidates';
    if (currentRole === 'hrexecutive') return 'pipeline_dossiers';
    return 'cand_identity';
  });

  const [activeDivisionId, setActiveDivisionId] = useState(() => {
    if (currentRole === 'superadmin') return 'companies';
    if (currentRole === 'company') return 'registry';
    if (currentRole === 'hrexecutive') return 'pipeline';
    return 'aadhaar';
  });

  // Role details mapping
  const roleThemeDetails = {
    superadmin: {
      label: 'Super Admin',
      badgeClass: 'badge-purple',
      icon: Crown,
      codePrefix: 'SUPERADMIN',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    company: {
      label: 'Company Admin',
      badgeClass: 'badge-cyan',
      icon: Building2,
      codePrefix: 'COMP001',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300'
    },
    hrexecutive: {
      label: 'HR Executive',
      badgeClass: 'badge-emerald',
      icon: UserCheck,
      codePrefix: 'COMP001HR001',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    employee_link: {
      label: 'Candidate Portal',
      badgeClass: 'badge-amber',
      icon: Smartphone,
      codePrefix: 'COMP001EMP001',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
    }
  };

  const currentTheme = roleThemeDetails[currentRole] || roleThemeDetails.superadmin;
  const unreadCount = (notifications || []).filter(n => !n.isRead).length;

  // Toggle Sound Effects
  const toggleSound = () => {
    const nextMute = soundEngine.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      soundEngine.playSuccess?.();
    }
  };

  // Toggle Accordion Pillar
  const togglePillarAccordion = (pillarId) => {
    soundEngine.playClick?.();
    setExpandedPillars(prev => ({
      ...prev,
      [pillarId]: !prev[pillarId]
    }));
  };

  // Two-way listener: Sync active tab and pillar from Portal Views
  useEffect(() => {
    const handleStateSync = (e) => {
      const { activeMainSection, activeTab } = e.detail || {};
      if (activeTab) {
        setActiveDivisionId(activeTab);
      }
      if (activeMainSection) {
        setActivePillarId(activeMainSection);
        setExpandedPillars(prev => ({ ...prev, [activeMainSection]: true }));
      }
    };
    window.addEventListener('portal_nav_state_sync', handleStateSync);
    return () => window.removeEventListener('portal_nav_state_sync', handleStateSync);
  }, []);

  // Handle navigation trigger to portal views
  const handleNavigate = (pillar, division = null) => {
    soundEngine.playClick?.();
    setActivePillarId(pillar.id);

    const targetTab = division ? (division.tab || division.id) : (pillar.defaultTab || pillar.divisions?.[0]?.tab || pillar.divisions?.[0]?.id);
    if (division) {
      setActiveDivisionId(division.id);
    } else if (pillar.divisions && pillar.divisions.length > 0) {
      setActiveDivisionId(pillar.divisions[0].id);
    }

    // Dispatch global event for Portal views to consume
    window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
      detail: {
        section: pillar.id,
        tab: targetTab,
        modal: division?.modal || pillar.modal || null,
        query: division?.query || null
      }
    }));

    // If on mobile, close the drawer
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  // =========================================================================
  // 🏛️ 5 PILLARS NAVIGATION: Exactly Matching User Screenshot 2
  // =========================================================================
  const pillarsConfig = useMemo(() => {
    if (workspaceMode === 'personal') {
      return [
        {
          id: 'my_workspace',
          title: '1. My Profile & Credentials',
          subtitle: 'Identity & Authentication',
          badgeText: '3 Tools',
          icon: User,
          colorClass: 'from-indigo-600 to-purple-600',
          defaultTab: 'profile',
          divisions: [
            { id: 'profile_view', label: 'View Profile Dossier', tab: 'profile', icon: User },
            { id: 'profile_creds', label: 'Security & 2FA Credentials', tab: 'security', icon: ShieldCheck },
            { id: 'profile_code', label: `ID: ${currentUser?.uniqueProfileId || currentTheme.codePrefix}`, tab: 'identity', icon: Sparkles }
          ]
        },
        {
          id: 'my_sessions',
          title: '2. Session & Activity Audit',
          subtitle: 'Real-Time Device Telemetry',
          badgeText: '2 Tools',
          icon: Activity,
          colorClass: 'from-teal-600 to-emerald-600',
          defaultTab: 'sessions',
          divisions: [
            { id: 'active_session', label: 'Session Status & Ping', tab: 'session_ping', icon: Activity },
            { id: 'login_history', label: 'Login History & IP Trail', tab: 'audit_log', icon: Database }
          ]
        },
        {
          id: 'my_alerts',
          title: '3. Alerts & Incident Tickets',
          subtitle: 'Helpdesk & Communications',
          badgeText: unreadCount > 0 ? `${unreadCount} NEW` : '2 Tools',
          icon: Bell,
          colorClass: 'from-amber-500 to-rose-600',
          defaultTab: 'tickets',
          divisions: [
            { id: 'all_alerts', label: 'Real-Time Notifications Feed', modal: 'notifications', icon: Bell },
            { id: 'my_support_tickets', label: 'Raise Support / Feedback', modal: 'support', icon: LifeBuoy }
          ]
        },
        {
          id: 'my_reports',
          title: '4. Downloads & Legal Docs',
          subtitle: 'Exports & DPDP Framework',
          badgeText: '2 Tools',
          icon: Download,
          colorClass: 'from-sky-600 to-indigo-600',
          defaultTab: 'exports',
          divisions: [
            { id: 'export_hub', label: 'Date-Filtered Universal Reports', modal: 'universal_export', icon: Download },
            { id: 'legal_docs', label: 'Statutory DPDP Handbook', modal: 'legal_handbook', icon: Scale }
          ]
        }
      ];
    }

    // =========================================================================
    // 👑 1. SUPER ADMIN: EXACT MATCH WITH USER SCREENSHOT 2
    // =========================================================================
    if (currentRole === 'superadmin') {
      return [
        {
          id: 'core_ops',
          title: '1. Core Operations',
          subtitle: 'Tenants & Candidates',
          badgeText: '6 MODULES',
          icon: Building2,
          colorClass: 'from-indigo-600 to-purple-600',
          defaultTab: 'companies',
          divisions: [
            { id: 'companies', label: 'All Companies Ledger', tab: 'companies', icon: Building2 },
            { id: 'onboard_company', label: '+ Onboard New Company', modal: 'add_company', icon: Plus },
            { id: 'omnisearch', label: 'Omnisearch Profile Tracker', tab: 'omnisearch', icon: Search },
            { id: 'ledger', label: 'Candidate Ledger & Records', tab: 'ledger', icon: Users },
            { id: 'leads_inquiries', label: 'Enterprise Inquiries & Leads', tab: 'inquiries', icon: Sparkles },
            { id: 'reviews_moderation', label: 'Reviews & Public Testimonials', tab: 'reviews', icon: Star },
            { id: 'terms_hub', label: 'Terms & Agreements Hub', tab: 'terms_hub', icon: Scale },
            { id: 'logins', label: 'Unified Logins Directory', tab: 'logins', icon: UserCheck }
          ]
        },
        {
          id: 'gateways_engine',
          title: '2. Upstream Gateways',
          subtitle: 'APIs & Live Studio',
          badgeText: '4 MODULES',
          icon: Zap,
          colorClass: 'from-teal-600 to-emerald-600',
          defaultTab: 'apiconfig',
          divisions: [
            { id: 'apiconfig', label: 'Verification APIs Studio (UIDAI/NSDL)', tab: 'apiconfig', icon: Zap },
            { id: 'studio', label: 'Live Verification Studio', tab: 'studio', icon: Layers },
            { id: 'api_margins', label: 'API Consumption & Profit Margins', tab: 'consumption_margins', icon: TrendingUp },
            { id: 'comm_gateways', label: 'Automated Messaging (WhatsApp & SMS)', tab: 'whatsapp_sms', icon: MessageSquare },
            { id: 'settings_smtp', label: 'cPanel SMTP & Mail 📧', tab: 'settings', icon: Mail }
          ]
        },
        {
          id: 'billing_finance',
          title: '3. Financial Billing',
          subtitle: 'Invoices & Ledger',
          badgeText: '2 MODULES',
          icon: CreditCard,
          colorClass: 'from-amber-600 to-orange-600',
          defaultTab: 'billing',
          divisions: [
            { id: 'billing', label: 'Company Billing Ledger & Invoices', tab: 'billing', icon: CreditCard },
            { id: 'api_margins_fin', label: 'API Consumption & Margins', tab: 'consumption_margins', icon: TrendingUp },
            { id: 'razorpay_modal', label: 'Razorpay Instant Payment Gateway', modal: 'razorpay_admin', icon: Zap }
          ]
        },
        {
          id: 'db_security',
          title: '4. Database & Security',
          subtitle: 'DBMS & Audit Chain',
          badgeText: '4 MODULES',
          icon: Database,
          colorClass: 'from-rose-600 to-pink-700',
          defaultTab: 'dbms',
          divisions: [
            { id: 'dbms', label: 'PostgreSQL Live Schema & DBMS', tab: 'dbms', icon: Database },
            { id: 'audit', label: 'Audit Trail & DPDP Hash Chain', tab: 'audit', icon: FileText },
            { id: 'sessions', label: 'Active Multi-Role Sessions Hub', tab: 'sessions', icon: ShieldCheck },
            { id: 'issuelogs', label: 'System Incident Logs & Solved Hub', tab: 'issuelogs', icon: Activity },
            { id: 'system_health', label: 'Platform Analytics & Telemetry', tab: 'analytics', icon: TrendingUp }
          ]
        },
        {
          id: 'gov_reports',
          title: '5. Governance & Config',
          subtitle: 'DPDP, Reports & Help',
          badgeText: '4 MODULES',
          icon: ShieldCheck,
          colorClass: 'from-purple-600 to-indigo-800',
          defaultTab: 'reports',
          // Exactly matching bottom sub-tab buttons from Screenshot 2!
          divisions: [
            { id: 'reports', label: '1. Reports Center', tab: 'reports', icon: Download },
            { id: 'guidelines', label: '2. Legal & DPDP Governance 🏛️', tab: 'legal_governance', icon: Scale },
            { id: 'masterfields', label: '3. Master Data Presets 🎛️', tab: 'masterdata', icon: Sliders },
            { id: 'tickets', label: '4. Support Helpdesk ⚙️', tab: 'tickets', icon: LifeBuoy },
            { id: 'settings', label: '5. Security & Platform Config 🔒', tab: 'settings', icon: Settings },
            { id: 'omnisearch_gov', label: 'Omnisearch 🔍', tab: 'omnisearch', icon: Search }
          ]
        }
      ];
    }

    // =========================================================================
    // 🏢 2. COMPANY ADMIN: 5 PILLARS & RESPECTIVE DIVISIONS
    // =========================================================================
    if (currentRole === 'company') {
      return [
        {
          id: 'telemetry_candidates',
          title: '1. Analytics & Candidates',
          subtitle: 'Usage & Candidate Directory',
          badgeText: `${candidates.length} PROFILES`,
          icon: ShieldCheck,
          colorClass: 'from-sky-600 to-teal-600',
          defaultTab: 'registry',
          divisions: [
            { id: 'registry', label: `Candidate Directory (${candidates.length})`, tab: 'registry', icon: Users },
            { id: 'telemetry', label: 'Verification Telemetry & Stats', tab: 'telemetry', icon: TrendingUp }
          ]
        },
        {
          id: 'hr_governance',
          title: '2. HR Team & Access',
          subtitle: 'Recruiters & Permissions',
          badgeText: `${(hrUsers || []).length} STAFF`,
          icon: Users,
          colorClass: 'from-indigo-600 to-purple-700',
          defaultTab: 'hrteam',
          divisions: [
            { id: 'hrteam', label: `Recruiter Team Directory (${(hrUsers || []).length})`, tab: 'hrteam', icon: UserCheck },
            { id: 'add_hr_modal', label: '+ Add New HR Recruiter', modal: 'add_hr', icon: Plus },
            { id: 'hr_permissions', label: 'Recruiter Field & Access Permissions', tab: 'hr_permissions', icon: Sliders }
          ]
        },
        {
          id: 'vendor_verification',
          title: '3. Vendor Verification 🤝',
          subtitle: 'Document Checks & Point-in-Time PDF',
          badgeText: 'STATUTORY',
          icon: ShieldCheck,
          colorClass: 'from-purple-600 to-indigo-700',
          defaultTab: 'vendor_verification',
          divisions: [
            { id: 'vendor_list', label: 'Vendor Directory & Checks (GST/PAN)', tab: 'vendor_verification', icon: ShieldCheck },
            { id: 'add_vendor_modal', label: '+ Verify New Corporate Vendor', modal: 'add_vendor', icon: Plus },
            { id: 'vendor_pdf', label: 'Official Point-in-Time PDF Certificates', tab: 'vendor_verification', icon: Download }
          ]
        },
        {
          id: 'corporate_dms',
          title: '4. Profile & Document Vault',
          subtitle: 'CIN, GSTIN & Cloud DMS',
          badgeText: 'VAULT',
          icon: Building2,
          colorClass: 'from-emerald-600 to-teal-700',
          defaultTab: 'profile_details',
          divisions: [
            { id: 'profile_details', label: 'Company Master Profile & Branding', tab: 'profile_details', icon: Building2 },
            { id: 'statutory_creds', label: 'CIN, GSTIN & PAN Credentials', tab: 'profile_details', icon: ShieldCheck },
            { id: 'dochub', label: 'Cloud Document Hub & Vault', tab: 'dochub', icon: Layers }
          ]
        },
        {
          id: 'billing_gateways',
          title: '5. Billing & Gateways',
          subtitle: 'Wallet, SMTP & Alerts',
          badgeText: 'CREDITS',
          icon: CreditCard,
          colorClass: 'from-amber-600 to-orange-700',
          defaultTab: 'billing_wallet',
          divisions: [
            { id: 'billing_wallet', label: 'Wallet Balance, Invoices & Tariffs', tab: 'billing_wallet', icon: CreditCard },
            { id: 'recharge_wallet', label: '⚡ Recharge Credits (Razorpay)', modal: 'razorpay', icon: Zap },
            { id: 'smtp_settings', label: 'Outgoing Mail SMTP Server Config', tab: 'smtp_settings', icon: MessageSquare },
            { id: 'support', label: 'Helpdesk Tickets & Support', tab: 'support', icon: LifeBuoy }
          ]
        }
      ];
    }

    // =========================================================================
    // 👔 3. HR EXECUTIVE: 3 PILLARS & RESPECTIVE DIVISIONS
    // =========================================================================
    if (currentRole === 'hrexecutive') {
      return [
        {
          id: 'pipeline_dossiers',
          title: '1. Candidate List & Records',
          subtitle: 'Candidate Applications & Dossiers',
          badgeText: `${candidates.length} CANDIDATES`,
          icon: Smartphone,
          colorClass: 'from-emerald-600 to-teal-700',
          defaultTab: 'pipeline',
          divisions: [
            { id: 'pipeline', label: `All Candidates Pipeline (${candidates.length})`, tab: 'pipeline', icon: Smartphone },
            { id: 'pipeline_active', label: 'Active Verification Magic Links', tab: 'pipeline', icon: Zap },
            { id: 'pipeline_verified', label: 'Verified Candidates & Dossiers', tab: 'pipeline', icon: CheckCircle2 }
          ]
        },
        {
          id: 'profiler_dispatch',
          title: '2. Add New Candidate',
          subtitle: 'Form Profiler & Dispatch Links',
          badgeText: 'ONBOARDING',
          icon: Sliders,
          colorClass: 'from-teal-600 to-emerald-700',
          defaultTab: 'profiler',
          divisions: [
            { id: 'profiler', label: 'Create Employee Profile Form', tab: 'profiler', icon: Sliders },
            { id: 'bulk_import_btn', label: 'Bulk Import (Excel Spreadsheet) 📥', modal: 'bulk_import', icon: FileSpreadsheet },
            { id: 'autofill_mock', label: '1-Click Multi-Industry Mock Auto-Fill', tab: 'profiler', icon: Sparkles }
          ]
        },
        {
          id: 'statutory_settings',
          title: '3. Analytics & Settings',
          subtitle: 'Turnaround Times & Compliance Rules',
          badgeText: 'SETTINGS',
          icon: Settings,
          colorClass: 'from-indigo-600 to-purple-700',
          defaultTab: 'analytics',
          divisions: [
            { id: 'analytics', label: 'Verification TAT & Throughput Analytics', tab: 'analytics', icon: TrendingUp },
            { id: 'statutory_forms', label: 'EPFO / ESIC / Gratuity Forms Preview', tab: 'analytics', icon: Scale },
            { id: 'settings', label: 'Workstation Preferences & Audit Rules', tab: 'settings', icon: Settings }
          ]
        }
      ];
    }

    // =========================================================================
    // 📱 4. CANDIDATE PORTAL (EMPLOYEE LINK)
    // =========================================================================
    return [
      {
        id: 'cand_identity',
        title: '1. Identity & e-KYC Verification',
        subtitle: 'UIDAI Aadhaar, OTP & Face Match',
        badgeText: 'STAGE 1',
        icon: ShieldCheck,
        colorClass: 'from-amber-600 to-orange-600',
        defaultTab: 'aadhaar_step',
        divisions: [
          { id: 'aadhaar_step', label: 'Aadhaar OTP e-KYC Verification', tab: 'aadhaar', icon: ShieldCheck },
          { id: 'otp_step', label: 'Mobile & Email Two-Factor OTP', tab: 'otp', icon: Smartphone },
          { id: 'face_step', label: 'Live AI Face Match Biometrics', tab: 'face', icon: Sparkles }
        ]
      },
      {
        id: 'cand_financial',
        title: '2. Financial & Professional Credentials',
        subtitle: 'PAN, Bank & Statutory Numbers',
        badgeText: 'STAGE 2',
        icon: CreditCard,
        colorClass: 'from-sky-600 to-indigo-600',
        defaultTab: 'pan_step',
        divisions: [
          { id: 'pan_step', label: 'Income Tax PAN Card Check', tab: 'pan', icon: CreditCard },
          { id: 'bank_step', label: 'Bank Account Penny-Drop Validation', tab: 'bank', icon: Building2 },
          { id: 'dl_step', label: 'Driving License / Passport / UAN', tab: 'dl', icon: Layers }
        ]
      },
      {
        id: 'cand_joining',
        title: '3. Joining Dossier & Digital Sign',
        subtitle: 'Employment Particulars & Enclosures',
        badgeText: 'STAGE 3',
        icon: FileText,
        colorClass: 'from-emerald-600 to-teal-700',
        defaultTab: 'joining_form',
        divisions: [
          { id: 'joining_form', label: 'Candidate Onboarding Particulars', tab: 'joining_form', icon: FileText },
          { id: 'signature_step', label: 'Digital E-Signature Specimen Pad', tab: 'signature', icon: Scale }
        ]
      },
      {
        id: 'cand_certs',
        title: '4. Official Certificates & Downloads',
        subtitle: 'Official PDF Dossier & DPDP Consent',
        badgeText: 'FINAL',
        icon: Download,
        colorClass: 'from-purple-600 to-indigo-700',
        defaultTab: 'cert_download',
        divisions: [
          { id: 'cert_download', label: 'Official Verification Certificate (PDF)', modal: 'cert', icon: Download },
          { id: 'labor_dossier', label: 'Statutory Labor Law Dossier (PDF)', modal: 'dossier', icon: FileText },
          { id: 'dpdp_rights', label: 'DPDP Act 2023 Statutory Rights', modal: 'legal_handbook', icon: Scale }
        ]
      }
    ];
  }, [workspaceMode, currentRole, candidates.length, hrUsers, unreadCount, currentUser?.uniqueProfileId, currentTheme.codePrefix]);

  // Real-Time Quick Search Filter across Pillars and Divisions
  const filteredPillars = useMemo(() => {
    if (!searchQuery.trim()) return pillarsConfig;

    const query = searchQuery.toLowerCase().trim();
    return pillarsConfig
      .map(pillar => {
        const pillarMatches = pillar.title.toLowerCase().includes(query) || pillar.subtitle.toLowerCase().includes(query);
        const matchingDivisions = (pillar.divisions || []).filter(div =>
          div.label.toLowerCase().includes(query)
        );

        if (pillarMatches || matchingDivisions.length > 0) {
          return {
            ...pillar,
            divisions: pillarMatches ? pillar.divisions : matchingDivisions
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [pillarsConfig, searchQuery]);

  return (
    <div className="h-full flex flex-col justify-between bg-white text-slate-800 font-sans select-none overflow-hidden relative">
      
      {/* ========================================================================= */}
      {/* 1. TOP BRAND HEADER                                                       */}
      {/* ========================================================================= */}
      <div className={`border-b border-slate-100 flex items-center shrink-0 bg-white transition-all ${
        isCollapsed ? 'p-3 justify-center flex-col gap-2' : 'p-4 justify-between'
      }`}>
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group cursor-pointer"
          title="Return to Public Homepage"
          onClick={() => soundEngine.playClick?.()}
        >
          <div className="relative shrink-0">
            <img 
              src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
              alt="JOY TRUE PROFILE" 
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-200" 
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="animate-fadeIn">
              <h1 className="font-black text-sm tracking-tight text-slate-900 leading-none">
                JOY <span className="text-amber-500">TRUE PROFILE</span>
              </h1>
              <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                {currentTheme.label}
              </p>
            </div>
          )}
        </Link>

        {/* Desktop Collapsible Rail Toggle Button */}
        {!isMobile && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-700 transition-all cursor-pointer border border-slate-200/80 shadow-2xs hover:scale-105"
            title={isCollapsed ? "Expand Sidebar (Wider)" : "Collapse Sidebar (Compact Rail)"}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        )}

        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP SEGMENTED SWITCHER: [ COMPANY ] [ PERSONAL ]                       */}
      {/* ========================================================================= */}
      {!isCollapsed && (
        <div className="px-3 pt-3 pb-1 shrink-0 bg-white animate-fadeIn">
          <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick?.();
                setWorkspaceMode('company');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black tracking-wider transition-all duration-200 cursor-pointer ${
                workspaceMode === 'company'
                  ? 'bg-white text-indigo-950 shadow-xs border border-slate-200/60 scale-[1.01]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              COMPANY
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick?.();
                setWorkspaceMode('personal');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black tracking-wider transition-all duration-200 cursor-pointer ${
                workspaceMode === 'personal'
                  ? 'bg-white text-indigo-950 shadow-xs border border-slate-200/60 scale-[1.01]'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              PERSONAL
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. REAL-TIME QUICK SEARCH INPUT: 🔍 Quick search...                       */}
      {/* ========================================================================= */}
      {!isCollapsed && (
        <div className="px-3 py-2 shrink-0 bg-white animate-fadeIn">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search modules & divisions..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INNOVATIVE 5 PILLARS & RESPECTIVE DIVISIONS ACCORDION LIST             */}
      {/* ========================================================================= */}
      <div className={`flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-200 ${
        isCollapsed ? 'px-2 py-3' : 'px-3 py-2'
      }`}>
        {filteredPillars.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <Search className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="text-xs font-medium">No pillars or divisions matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filteredPillars.map((pillar) => {
            const Icon = pillar.icon || Star;
            const isPillarActive = activePillarId === pillar.id;
            const isExpanded = searchQuery.trim() ? true : !!expandedPillars[pillar.id];
            const divisions = pillar.divisions || [];

            // =========================================================================
            // 📍 COLLAPSED RAIL MODE POPUP MENU ITEM
            // =========================================================================
            if (isCollapsed) {
              return (
                <div key={pillar.id} className="relative group flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleNavigate(pillar)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-all cursor-pointer shadow-xs ${
                      isPillarActive
                        ? `bg-gradient-to-br ${pillar.colorClass} text-white ring-2 ring-indigo-400 ring-offset-2 scale-105`
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>

                  {/* 🚀 Hover Floating Flyout Menu */}
                  <div className="hidden group-hover:flex absolute left-full top-0 ml-3 w-64 bg-white border border-slate-200/90 shadow-2xl rounded-2xl p-3 z-50 flex-col gap-2 animate-fadeIn font-sans text-left">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${pillar.colorClass} shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">{pillar.title}</h4>
                        <p className="text-[9.5px] text-slate-500 font-medium truncate">{pillar.subtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                      {divisions.map((div) => {
                        const isDivActive = activeDivisionId === div.id || activeDivisionId === div.tab;
                        const DivIcon = div.icon || ChevronRight;
                        return (
                          <button
                            key={div.id}
                            type="button"
                            onClick={() => handleNavigate(pillar, div)}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                              isDivActive
                                ? 'bg-emerald-50 text-emerald-950 font-black border border-emerald-300'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                            }`}
                          >
                            <DivIcon className={`w-3.5 h-3.5 shrink-0 ${isDivActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <span className="truncate">{div.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // =========================================================================
            // 📖 FULL EXPANDED SIDEBAR ACCORDION ITEM
            // =========================================================================
            return (
              <div 
                key={pillar.id} 
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isPillarActive 
                    ? 'border-indigo-400/80 bg-slate-50/80 shadow-xs' 
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                
                {/* 🌟 PILLAR HEADER CARD (Matches Screenshot 2 Pillars) */}
                <div
                  className="p-2.5 sm:p-3 flex items-center justify-between cursor-pointer group select-none transition-all duration-150"
                  onClick={() => {
                    togglePillarAccordion(pillar.id);
                    handleNavigate(pillar);
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {/* Floating Squircle Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-transform duration-200 group-hover:scale-110 shrink-0 ${
                      isPillarActive
                        ? `bg-gradient-to-br ${pillar.colorClass} text-white shadow-sm`
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Title + Subtitle */}
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 tracking-tight truncate leading-tight group-hover:text-indigo-600 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Module Count Badge + Accordion + / - */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                      isPillarActive
                        ? 'bg-indigo-100 text-indigo-900 font-bold border border-indigo-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {pillar.badgeText}
                    </span>

                    <span className="w-5 h-5 flex items-center justify-center rounded-lg text-slate-400 group-hover:text-slate-800 transition-transform duration-200">
                      {isExpanded ? (
                        <Minus className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* 📂 RESPECTIVE DIVISIONS LIST WITH TREE-GUIDELINE CONNECTORS */}
                {isExpanded && divisions.length > 0 && (
                  <div className="ml-3 pl-2.5 border-l-2 border-slate-200/80 my-1 space-y-1 bg-white/70 animate-in slide-in-from-top-1 duration-150 pr-2 pb-1.5">
                    {divisions.map((div) => {
                      const isDivActive = activeDivisionId === div.id || activeDivisionId === div.tab;
                      const DivIcon = div.icon || ChevronRight;

                      return (
                        <button
                          key={div.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(pillar, div);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all duration-150 text-left cursor-pointer group/div ${
                            isDivActive
                              ? 'bg-emerald-50 text-emerald-950 font-black border-l-2 border-emerald-500 shadow-2xs translate-x-0.5'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium hover:translate-x-0.5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <DivIcon className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover/div:scale-110 ${
                              isDivActive ? 'text-emerald-600' : 'text-slate-400 group-hover/div:text-slate-700'
                            }`} />
                            <span className="truncate">{div.label}</span>
                          </div>

                          {isDivActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM PROFILE, ACTIVE SESSION & DOCK SECTION                          */}
      {/* ========================================================================= */}
      <div className={`border-t border-slate-100 bg-slate-50/80 space-y-2 shrink-0 ${
        isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3'
      }`}>
        
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-xs" title={currentUser?.name || 'User'}>
              <User className="w-4 h-4" />
            </div>
            <button
              onClick={() => {
                soundEngine.playClick?.();
                logoutUser();
              }}
              className="p-2 rounded-xl text-rose-700 hover:bg-rose-100 bg-rose-50 border border-rose-200 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Profile Card Pill with Unique Profile Code */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs font-black text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-black text-xs text-slate-900 truncate leading-tight">
                    {currentUser?.name || currentUser?.email || 'User'}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 font-mono font-black text-[9px] border border-indigo-200 truncate">
                      {currentRole === 'superadmin' ? 'SUPERADMIN' : (currentUser?.uniqueProfileId || currentUser?.employeeCode || currentUser?.hrCode || currentTheme.codePrefix)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isMuted 
                    ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
                title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Session Countdown & Logout Button */}
            <div className="flex items-center justify-between gap-1.5 text-xs">
              <div className="shrink-0">
                <ActiveSessionBadge />
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick?.();
                  logoutUser();
                }}
                className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold transition-all cursor-pointer text-xs shadow-2xs hover:shadow-xs shrink-0"
                title="Sign Out / End Session"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  );
};
