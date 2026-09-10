import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/uiSoundEffects';
import { ActiveSessionBadge } from './ActiveSessionBadge';
import {
  Scale,
  Activity,
  UserCheck,
  FileText,
  TrendingUp,
  Star,
  User,
  Users,
  Building2,
  Smartphone,
  ShieldCheck,
  Zap,
  Database,
  CreditCard,
  Search,
  Plus,
  Minus,
  Bell,
  LogOut,
  Volume2,
  VolumeX,
  LifeBuoy,
  Download,
  Settings,
  Sliders,
  X
} from 'lucide-react';

export const PortalSidebarNav = ({ onCloseMobile, isMobile = false }) => {
  const {
    currentUser,
    currentRole,
    logoutUser,
    candidates,
    hrUsers,
    notifications,
    platformLogoEmblem
  } = useApp();

  // 1. Top Segmented Switcher State: 'company' (Enterprise Operations) vs 'personal' (My Workspace)
  const [workspaceMode, setWorkspaceMode] = useState('company');

  // 2. Real-Time Quick Search Input State
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Audio SFX Mute State
  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());

  // 4. Accordion Expanded Modules State (keyed by moduleId: boolean)
  const [expandedModules, setExpandedModules] = useState({
    // Defaults: open primary operational modules
    tenants_companies: true,
    candidate_registry: true,
    candidate_pipeline: true,
    statutory_verif: true,
    extras: true
  });

  // 5. Active Selected Module & Sub-Division State
  const [activeModuleId, setActiveModuleId] = useState('extras');
  const [activeSubId, setActiveSubId] = useState(null);

  // Role details mapping
  const roleThemeDetails = {
    superadmin: {
      label: 'Super Admin',
      badgeClass: 'badge-purple',
      icon: Crown,
      codePrefix: 'SUPERADMIN',
      primaryColor: 'indigo'
    },
    company: {
      label: 'Company Admin',
      badgeClass: 'badge-cyan',
      icon: Building2,
      codePrefix: 'COMP001',
      primaryColor: 'sky'
    },
    hrexecutive: {
      label: 'HR Executive',
      badgeClass: 'badge-emerald',
      icon: UserCheck,
      codePrefix: 'COMP001HR001',
      primaryColor: 'emerald'
    },
    employee_link: {
      label: 'Candidate Portal',
      badgeClass: 'badge-amber',
      icon: Smartphone,
      codePrefix: 'COMP001EMP001',
      primaryColor: 'amber'
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

  // Toggle Accordion Module
  const toggleModuleAccordion = (moduleId) => {
    soundEngine.playClick?.();
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Two-way listener: Sync active tab and section from Portal Views
  useEffect(() => {
    const handleStateSync = (e) => {
      const { activeMainSection, activeTab } = e.detail || {};
      if (activeTab) {
        setActiveSubId(activeTab);
      }
      if (activeMainSection) {
        setActiveModuleId(activeMainSection);
        // Automatically expand the parent module
        setExpandedModules(prev => ({ ...prev, [activeMainSection]: true }));
      }
    };
    window.addEventListener('portal_nav_state_sync', handleStateSync);
    return () => window.removeEventListener('portal_nav_state_sync', handleStateSync);
  }, []);

  // Handle navigation trigger to portal views
  const handleNavigate = (module, subItem = null) => {
    soundEngine.playClick?.();
    setActiveModuleId(module.id);
    if (subItem) {
      setActiveSubId(subItem.id);
    } else if (module.subItems && module.subItems.length > 0) {
      setActiveSubId(module.subItems[0].id);
    }

    // Dispatch global event for Portal views to consume
    window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
      detail: {
        section: module.mainSection || module.id,
        tab: subItem ? subItem.tab || subItem.id : (module.defaultTab || module.id),
        modal: subItem?.modal || module.modal || null,
        query: subItem?.query || null
      }
    }));

    // If on mobile, close the drawer
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  // =========================================================================
  // 📚 NAVIGATION DEFINITION: Tailored per Active Role and Workspace Mode
  // =========================================================================
  const navigationConfig = useMemo(() => {
    if (workspaceMode === 'personal') {
      return [
        {
          category: 'MY WORKSPACE',
          modules: [
            {
              id: 'my_profile',
              title: 'My Profile & ID',
              icon: User,
              defaultTab: 'profile',
              subItems: [
                { id: 'profile_view', label: 'View Profile Dossier', tab: 'profile' },
                { id: 'profile_creds', label: 'Credentials & Security', tab: 'security' },
                { id: 'profile_code', label: `Code: ${currentUser?.uniqueProfileId || currentTheme.codePrefix}`, tab: 'identity' }
              ]
            },
            {
              id: 'my_activity',
              title: 'Active Sessions & Audit',
              icon: Activity,
              defaultTab: 'sessions',
              subItems: [
                { id: 'active_session', label: 'Session Countdown & Ping', tab: 'session_ping' },
                { id: 'login_history', label: 'Login History & Devices', tab: 'audit_log' }
              ]
            },
            {
              id: 'my_notifications',
              title: 'Alerts & Messages',
              icon: Bell,
              badge: unreadCount > 0 ? `${unreadCount} new` : null,
              modal: 'notifications',
              subItems: [
                { id: 'all_alerts', label: 'Real-time Alerts Feed', modal: 'notifications' },
                { id: 'system_notices', label: 'DPDP & System Broadcasts', modal: 'legal_handbook' }
              ]
            },
            {
              id: 'my_support',
              title: 'Support Tickets',
              icon: LifeBuoy,
              modal: 'support',
              subItems: [
                { id: 'raise_ticket', label: 'Raise New Support Ticket', modal: 'support' },
                { id: 'ticket_history', label: 'View Incident Responses', modal: 'support' }
              ]
            },
            {
              id: 'my_downloads',
              title: 'Downloads & Exports',
              icon: Download,
              modal: 'universal_export',
              subItems: [
                { id: 'export_reports', label: 'Date-Filtered Reports Hub', modal: 'universal_export' },
                { id: 'legal_handbook', label: 'Statutory DPDP Handbook', modal: 'legal_handbook' }
              ]
            }
          ]
        }
      ];
    }

    // Role-specific Enterprise Navigation ('company' mode)
    if (currentRole === 'superadmin') {
      return [
        {
          category: 'CORE OPERATIONS',
          modules: [
            {
              id: 'tenants_companies',
              mainSection: 'core_ops',
              title: 'Tenants & Companies',
              icon: Building2,
              defaultTab: 'companies',
              subItems: [
                { id: 'companies', label: 'All Companies Ledger', tab: 'companies' },
                { id: 'add_company', label: 'Onboard New Company', modal: 'add_company' },
                { id: 'company_requests', label: 'Enterprise Access Requests', tab: 'companies' },
                { id: 'logins', label: 'Unified Logins Directory', tab: 'logins' }
              ]
            },
            {
              id: 'omnisearch_tracker',
              mainSection: 'core_ops',
              title: 'Universal Omnisearch',
              icon: Search,
              defaultTab: 'omnisearch',
              subItems: [
                { id: 'omnisearch', label: '360° Profile ID Search', tab: 'omnisearch' },
                { id: 'preset_comp', label: 'Preset: 🏢 COMP001', tab: 'omnisearch', query: 'COMP001' },
                { id: 'preset_hr', label: 'Preset: 👔 COMP001HR001', tab: 'omnisearch', query: 'COMP001HR001' },
                { id: 'preset_emp', label: 'Preset: 👤 COMP001EMP001', tab: 'omnisearch', query: 'COMP001EMP001' }
              ]
            },
            {
              id: 'enterprise_cms',
              mainSection: 'core_ops',
              title: 'Enterprise CMS & Leads',
              icon: Star,
              defaultTab: 'leads_inquiries',
              subItems: [
                { id: 'leads_inquiries', label: 'Enterprise Leads & Inquiries', tab: 'leads_inquiries' },
                { id: 'reviews_moderation', label: 'Reviews & Testimonials', tab: 'reviews_moderation' },
                { id: 'blog_cms', label: 'SEO Blog & Articles CMS', tab: 'blog_cms' }
              ]
            }
          ]
        },
        {
          category: 'ANALYSIS',
          modules: [
            {
              id: 'analytics_volume',
              mainSection: 'core_ops',
              title: 'Verification Analytics',
              icon: TrendingUp,
              defaultTab: 'analytics',
              subItems: [
                { id: 'analytics', label: 'Real-Time Volume & Margins', tab: 'analytics' },
                { id: 'tat_sla', label: 'Upstream Latency & SLA', tab: 'reports' }
              ]
            },
            {
              id: 'reports_hub',
              mainSection: 'gov_reports',
              title: 'Reports & Compliance',
              icon: FileText,
              defaultTab: 'reports',
              subItems: [
                { id: 'reports', label: 'Interactive Reports Center', tab: 'reports' },
                { id: 'universal_export', label: 'Universal Date-Filtered Export', modal: 'universal_export' }
              ]
            },
            {
              id: 'billing_finance',
              mainSection: 'billing_finance',
              title: 'Financial Billing',
              icon: CreditCard,
              defaultTab: 'billing',
              subItems: [
                { id: 'billing', label: 'Company Billing Ledger', tab: 'billing' },
                { id: 'custom_tariffs', label: 'Custom Tariff Schedules', tab: 'billing' },
                { id: 'razorpay_admin', label: 'Payment Gateway (Razorpay)', modal: 'razorpay_admin' }
              ]
            }
          ]
        },
        {
          category: 'OTHER',
          modules: [
            {
              id: 'extras',
              mainSection: 'gateways_engine',
              title: 'Upstream Gateways',
              icon: Zap,
              defaultTab: 'apiconfig',
              subItems: [
                { id: 'apiconfig', label: 'UIDAI / NSDL / EPFO APIs', tab: 'apiconfig' },
                { id: 'api_margins', label: 'API Consumption Margins', tab: 'api_margins' },
                { id: 'comm_gateways', label: 'WhatsApp & SMS Gateways', tab: 'comm_gateways' },
                { id: 'doc_sandbox', label: 'Document Sandbox Studio', tab: 'doc_sandbox' }
              ]
            },
            {
              id: 'db_incident_logs',
              mainSection: 'db_security',
              title: 'DBMS & Incident Logs',
              icon: Database,
              defaultTab: 'dbms',
              subItems: [
                { id: 'dbms', label: 'PostgreSQL Live Schema', tab: 'dbms' },
                { id: 'issuelogs', label: 'System Incident Logs', tab: 'issuelogs' }
              ]
            },
            {
              id: 'gov_config',
              mainSection: 'gov_reports',
              title: 'Governance & Settings',
              icon: Settings,
              defaultTab: 'settings',
              subItems: [
                { id: 'masterfields', label: 'Master Form Fields & Options', tab: 'masterfields' },
                { id: 'guidelines', label: 'Legal Terms & DPDP 2023', tab: 'guidelines' },
                { id: 'settings', label: 'Security & Platform Config', tab: 'settings' },
                { id: 'tickets', label: 'Helpdesk Tickets', tab: 'tickets' }
              ]
            }
          ]
        }
      ];
    }

    if (currentRole === 'company') {
      return [
        {
          category: 'CORE OPERATIONS',
          modules: [
            {
              id: 'telemetry_candidates',
              mainSection: 'telemetry_candidates',
              title: 'Candidate Directory',
              icon: Users,
              defaultTab: 'registry',
              subItems: [
                { id: 'registry', label: `Candidate Ledger (${candidates.length})`, tab: 'registry' },
                { id: 'telemetry', label: 'Live Telemetry & Metrics', tab: 'telemetry' }
              ]
            },
            {
              id: 'hr_governance',
              mainSection: 'hr_governance',
              title: 'HR Staff & Permissions',
              icon: UserCheck,
              defaultTab: 'hrteam',
              subItems: [
                { id: 'hrteam', label: `Recruiter Team (${(hrUsers || []).length})`, tab: 'hrteam' },
                { id: 'add_hr', label: 'Add New HR Recruiter', modal: 'add_hr' },
                { id: 'hr_permissions', label: 'Field & Access Permissions', tab: 'hr_permissions' }
              ]
            }
          ]
        },
        {
          category: 'ANALYSIS',
          modules: [
            {
              id: 'vendor_verification',
              mainSection: 'vendor_verification',
              title: 'Vendor Verification 🤝',
              icon: ShieldCheck,
              defaultTab: 'vendor_verification',
              subItems: [
                { id: 'vendor_list', label: 'Vendor Registry & Status', tab: 'vendor_verification' },
                { id: 'add_vendor', label: 'Verify New Vendor', modal: 'add_vendor' },
                { id: 'vendor_pdf', label: 'Point-in-Time PDF Certs', tab: 'vendor_verification' }
              ]
            },
            {
              id: 'reports_center',
              mainSection: 'telemetry_candidates',
              title: 'Reports & Analytics',
              icon: FileText,
              defaultTab: 'telemetry',
              subItems: [
                { id: 'universal_export', label: 'Date-Filtered Reports 📥', modal: 'universal_export' },
                { id: 'legal_handbook', label: 'Statutory DPDP Handbook', modal: 'legal_handbook' }
              ]
            }
          ]
        },
        {
          category: 'OTHER',
          modules: [
            {
              id: 'extras',
              mainSection: 'corporate_dms',
              title: 'Corporate DMS & Vault',
              icon: Building2,
              defaultTab: 'profile_details',
              subItems: [
                { id: 'profile_details', label: 'Company Master Profile', tab: 'profile_details' },
                { id: 'statutory_credentials', label: 'CIN / GSTIN / PAN Vault', tab: 'profile_details' },
                { id: 'dochub', label: 'Cloud Document Hub', tab: 'dochub' }
              ]
            },
            {
              id: 'billing_gateways',
              mainSection: 'billing_gateways',
              title: 'Billing & Mail SMTP',
              icon: CreditCard,
              defaultTab: 'billing_wallet',
              subItems: [
                { id: 'billing_wallet', label: 'Wallet Balance & Invoices', tab: 'billing_wallet' },
                { id: 'recharge_wallet', label: 'Recharge Credits (Razorpay)', modal: 'razorpay' },
                { id: 'smtp_settings', label: 'Outgoing Mail SMTP Server', tab: 'smtp_settings' },
                { id: 'support', label: 'Helpdesk & Tickets', tab: 'support' }
              ]
            }
          ]
        }
      ];
    }

    if (currentRole === 'hrexecutive') {
      return [
        {
          category: 'CORE OPERATIONS',
          modules: [
            {
              id: 'pipeline_dossiers',
              mainSection: 'pipeline_dossiers',
              title: 'Candidate Pipeline',
              icon: Smartphone,
              defaultTab: 'pipeline',
              subItems: [
                { id: 'pipeline', label: `All Candidates (${candidates.length})`, tab: 'pipeline' },
                { id: 'pipeline_in_progress', label: 'In Progress (Active Link)', tab: 'pipeline' },
                { id: 'pipeline_verified', label: 'Verified & Certified', tab: 'pipeline' }
              ]
            },
            {
              id: 'profiler_dispatch',
              mainSection: 'profiler_dispatch',
              title: 'Employee Profiler',
              icon: Sliders,
              defaultTab: 'profiler',
              subItems: [
                { id: 'profiler', label: 'Create Employee Profile', tab: 'profiler' },
                { id: 'bulk_import', label: 'Bulk Import (Excel) 📥', modal: 'bulk_import' },
                { id: 'autofill_mock', label: '1-Click Mock Auto-Fill', tab: 'profiler' }
              ]
            }
          ]
        },
        {
          category: 'ANALYSIS',
          modules: [
            {
              id: 'statutory_analysis',
              mainSection: 'statutory_settings',
              title: 'Statutory Verification',
              icon: Scale,
              defaultTab: 'analytics',
              subItems: [
                { id: 'analytics', label: 'Turnaround Time & Throughput', tab: 'analytics' },
                { id: 'statutory_forms', label: 'EPFO / ESIC / Gratuity Forms', tab: 'analytics' },
                { id: 'reports_hub', label: 'Date-Filtered Reports Hub', modal: 'universal_export' }
              ]
            }
          ]
        },
        {
          category: 'OTHER',
          modules: [
            {
              id: 'extras',
              mainSection: 'statutory_settings',
              title: 'Workstation Settings',
              icon: Settings,
              defaultTab: 'settings',
              subItems: [
                { id: 'settings', label: 'Workstation Preferences', tab: 'settings' },
                { id: 'legal_handbook', label: 'DPDP 2023 Legal Handbook', modal: 'legal_handbook' },
                { id: 'tour_guide', label: 'Launch Guided Tour 🎮', modal: 'tour' }
              ]
            }
          ]
        }
      ];
    }

    // Candidate Self-Verification Portal
    return [
      {
        category: 'CORE OPERATIONS',
        modules: [
          {
            id: 'candidate_steps',
            title: 'Identity Verification',
            icon: ShieldCheck,
            defaultTab: 'aadhaar_step',
            subItems: [
              { id: 'aadhaar_step', label: 'Aadhaar e-KYC (UIDAI)', tab: 'aadhaar' },
              { id: 'otp_step', label: 'Mobile & Email OTP Verification', tab: 'otp' },
              { id: 'face_step', label: 'Live AI Face Match Biometrics', tab: 'face' }
            ]
          },
          {
            id: 'financial_steps',
            title: 'Financial & Documents',
            icon: CreditCard,
            defaultTab: 'pan_step',
            subItems: [
              { id: 'pan_step', label: 'Income Tax PAN Check', tab: 'pan' },
              { id: 'bank_step', label: 'Bank Penny Drop Verification', tab: 'bank' },
              { id: 'dl_step', label: 'Driving License / Passport', tab: 'dl' }
            ]
          }
        ]
      },
      {
        category: 'ANALYSIS',
        modules: [
          {
            id: 'joining_dossier',
            title: 'Joining Particulars',
            icon: FileText,
            defaultTab: 'joining_form',
            subItems: [
              { id: 'joining_form', label: 'Candidate Onboarding Dossier', tab: 'joining_form' },
              { id: 'signature_step', label: 'Digital E-Signature Pad', tab: 'signature' }
            ]
          }
        ]
      },
      {
        category: 'OTHER',
        modules: [
          {
            id: 'extras',
            title: 'Official Certificates',
            icon: Download,
            defaultTab: 'cert_download',
            subItems: [
              { id: 'cert_download', label: 'Verification Certificate (PDF)', modal: 'cert' },
              { id: 'labor_dossier', label: 'Labor Law Dossier (PDF)', modal: 'dossier' },
              { id: 'legal_compliance', label: 'DPDP 2023 Digital Rights', modal: 'legal_handbook' }
            ]
          }
        ]
      }
    ];
  }, [workspaceMode, currentRole, candidates.length, hrUsers, unreadCount, currentUser?.uniqueProfileId, currentTheme.codePrefix]);

  // Real-Time Quick Search Filter
  const filteredNavigation = useMemo(() => {
    if (!searchQuery.trim()) return navigationConfig;

    const query = searchQuery.toLowerCase().trim();
    return navigationConfig
      .map(group => {
        const matchingModules = group.modules
          .map(mod => {
            const modTitleMatches = mod.title.toLowerCase().includes(query);
            const matchingSubItems = (mod.subItems || []).filter(sub =>
              sub.label.toLowerCase().includes(query)
            );

            if (modTitleMatches || matchingSubItems.length > 0) {
              return {
                ...mod,
                subItems: modTitleMatches ? mod.subItems : matchingSubItems
              };
            }
            return null;
          })
          .filter(Boolean);

        if (matchingModules.length > 0) {
          return {
            ...group,
            modules: matchingModules
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [navigationConfig, searchQuery]);

  return (
    <div className="h-full flex flex-col justify-between bg-white text-slate-800 font-sans select-none overflow-hidden">
      
      {/* 1. TOP BRAND HEADER */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
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
          <div>
            <h1 className="font-black text-sm tracking-tight text-slate-900 leading-none">
              JOY <span className="text-amber-500">TRUE PROFILE</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              {currentTheme.label}
            </p>
          </div>
        </Link>

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

      {/* 2. TOP SEGMENTED SWITCHER: [ COMPANY ] [ PERSONAL ] (Matches Screenshot) */}
      <div className="px-3 pt-3 pb-1 shrink-0">
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

      {/* 3. REAL-TIME QUICK SEARCH INPUT: 🔍 Quick search... (Matches Screenshot) */}
      <div className="px-3 py-2 shrink-0">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search..."
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

      {/* 4. SCROLLABLE CATEGORIZED NAVIGATION MODULES WITH EXPANDABLE SUB-DIVISIONS */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
        {filteredNavigation.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <Search className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="text-xs font-medium">No navigation modules matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filteredNavigation.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              
              {/* Category Header (Uppercase, small, muted - Matches Screenshot) */}
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">
                {group.category}
              </div>

              {/* Modules in this Category */}
              <div className="space-y-1">
                {group.modules.map((module) => {
                  const Icon = module.icon || Star;
                  const isExpanded = searchQuery.trim() ? true : !!expandedModules[module.id];
                  const isActiveModule = activeModuleId === module.id;
                  const hasSubItems = module.subItems && module.subItems.length > 0;

                  return (
                    <div key={module.id} className="space-y-0.5">
                      
                      {/* Parent Item Bar */}
                      <div
                        className={`group relative flex items-center justify-between px-3 py-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                          isActiveModule
                            ? 'bg-slate-100 font-bold text-slate-900 border-l-4 border-emerald-600 shadow-2xs scale-[1.01]'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                        }`}
                        onClick={() => {
                          if (hasSubItems) {
                            toggleModuleAccordion(module.id);
                          }
                          handleNavigate(module);
                        }}
                      >
                        {/* Left: Crisp Icon + Title */}
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                            isActiveModule ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-700'
                          }`} />
                          <span className="text-xs truncate tracking-tight">
                            {module.title}
                          </span>
                        </div>

                        {/* Right: + / − Accordion Toggle Button (Matches Screenshot) */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {module.badge && (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">
                              {module.badge}
                            </span>
                          )}

                          {hasSubItems && (
                            <span 
                              className={`w-5 h-5 flex items-center justify-center rounded-lg text-slate-400 group-hover:text-slate-800 transition-transform duration-200 ${
                                isExpanded ? 'text-emerald-600' : ''
                              }`}
                            >
                              {isExpanded ? (
                                <Minus className="w-3.5 h-3.5" />
                              ) : (
                                <Plus className="w-3.5 h-3.5" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Accordion Sub-Divisions (Smooth reveal with connecting line) */}
                      {hasSubItems && isExpanded && (
                        <div className="pl-6 pr-1 py-1 space-y-1 ml-3 border-l-2 border-slate-100 animate-in slide-in-from-top-1 duration-150">
                          {module.subItems.map((sub) => {
                            const isSubActive = activeSubId === sub.id || activeSubId === sub.tab;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => handleNavigate(module, sub)}
                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all duration-150 text-left cursor-pointer group/sub ${
                                  isSubActive
                                    ? 'bg-emerald-50 text-emerald-950 font-black shadow-2xs border border-emerald-200/80 translate-x-1'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium hover:translate-x-1'
                                }`}
                              >
                                <span className="truncate">{sub.label}</span>
                                {isSubActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </div>

      {/* 5. BOTTOM PROFILE, SESSION & DOCK SECTION */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2 shrink-0">
        
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

      </div>

    </div>
  );
};
