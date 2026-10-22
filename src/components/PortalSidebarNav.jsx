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
  Lock,
  Volume2,
  VolumeX,
  Plus,
  X,
  Sparkles,
  Crown,
  ChevronRight,
  Layers,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle2,
  Mail,
  Globe,
  BookOpen,
  BarChart3,
  Share2
} from 'lucide-react';

export const PortalSidebarNav = ({ onCloseMobile, isMobile = false, isCollapsed = false, onToggleCollapse }) => {
  const {
    currentUser,
    currentRole,
    logoutUser,
    candidates,
    selectedCandidateToken,
    hrUsers,
    vendors,
    notifications,
    platformLogoEmblem,
    companies,
    showToast
  } = useApp();

  // 1. Top Segmented Switcher: 'company' (Operations) vs 'personal' (My Workspace)
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
    digilocker_vault: true,
    // Candidate
    cand_identity: true,
    cand_financial: false,
    cand_joining: false,
    cand_certs: false
  });

  // 5. Candidate verification route detection & effective role override
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const isCandidateRoute = (
    path.includes('/verify') ||
    path.includes('/employee') ||
    path.startsWith('/candidate-') ||
    (path.includes('/candidate') && !path.includes('/hr/') && !path.includes('/candidates') && !path.includes('/company/') && !path.includes('/superadmin'))
  );

  const effectiveRole = (isCandidateRoute || currentRole === 'employee_link')
    ? 'employee_link'
    : (currentRole || 'superadmin');

  const currentCandidate = useMemo(() => {
    if (effectiveRole === 'employee_link' || isCandidateRoute) {
      if (typeof window !== 'undefined') {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1];
        const params = new URLSearchParams(window.location.search);
        const pathToken = (lastPart && !['verify', 'employee', 'candidate', 'portal', 'verification'].includes(lastPart.toLowerCase())) ? lastPart : null;
        const token = params.get('token') || params.get('t') || params.get('id') || pathToken;
        if (token && candidates?.length) {
          const found = candidates.find(c => c.verificationToken === token || c.token === token || c.id === token || c.empId === token || c.employeeNumber === token);
          if (found) return found;

          // Check if candidate name is embedded in token (e.g. tok_dharun_782)
          const nameInTokenMatch = token.match(/tok_([^_]+)_/);
          const extractedTokenName = nameInTokenMatch ? nameInTokenMatch[1].toLowerCase() : null;
          if (extractedTokenName) {
            const foundByName = candidates.find(c => c.name && c.name.toLowerCase().includes(extractedTokenName));
            if (foundByName) return foundByName;
          }
        }

        if (token) {
          const nameInTokenMatch = token.match(/tok_([^_]+)_/);
          const rawName = nameInTokenMatch ? nameInTokenMatch[1].replace(/_/g, ' ') : 'Candidate';
          const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          const candidateSeqCount = (candidates?.length || 1) + 1;
          const assignedEmpCode = `COMP001EMP${String(candidateSeqCount).padStart(3, '0')}`;
          return {
            name: formattedName,
            empId: assignedEmpCode,
            employeeCode: assignedEmpCode,
            id: token
          };
        }
      }
      if (selectedCandidateToken && candidates?.length) {
        const found = candidates.find(c => c.verificationToken === selectedCandidateToken || c.token === selectedCandidateToken || c.id === selectedCandidateToken || c.empId === selectedCandidateToken || c.employeeNumber === selectedCandidateToken);
        if (found) return found;
      }
      return candidates?.[0] || null;
    }
    return null;
  }, [effectiveRole, isCandidateRoute, candidates, selectedCandidateToken]);

  const normStr = (str) => (str || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

  const scopedCandidates = useMemo(() => {
    const rawList = candidates || [];
    if (!rawList.length) return [];
    if (effectiveRole === 'superadmin') {
      const seen = new Set();
      return rawList.filter(c => {
        if (!c) return false;
        const tok = (c.token || c.id || '').toString().toLowerCase().trim();
        const empKey = (c.empId || c.employeeNumber || '').toString().toUpperCase().trim();
        const isGenericEmp = !empKey || ['EMP', 'PENDING', 'N/A', 'NONE', 'JOY-EMP-001', '0', '-'].includes(empKey);
        if (tok && seen.has(`TOK::${tok}`)) return false;
        if (!isGenericEmp && seen.has(`EMP::${empKey}`)) return false;
        if (tok) seen.add(`TOK::${tok}`);
        if (!isGenericEmp) seen.add(`EMP::${empKey}`);
        return true;
      });
    }

    // Accurately extract company slug from URL path
    let pathCompSlug = '';
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p.includes('/hr/')) {
        pathCompSlug = normStr(p.split('/hr/')[0].replace(/^\//, '').split('/')[0]);
      } else if (p.includes('/company/')) {
        const parts = p.split('/company/');
        pathCompSlug = normStr(parts[0].replace(/^\//, '').split('/')[0] || parts[1]?.split('/')[0]);
      }
    }

    const userCompIdNorm = normStr(currentUser?.companyId || currentUser?.companyCode || currentUser?.companyName);
    const userHrIdNorm = normStr(currentUser?.id || currentUser?.hrId || currentUser?.hr_id);

    // Resolve matched company ID from companies list
    let matchedCompanyId = null;
    if (Array.isArray(companies)) {
      const found = companies.find(comp => {
        const cId = normStr(comp.id);
        const cCode = normStr(comp.code);
        const cName = normStr(comp.name);
        return (pathCompSlug && (cId === pathCompSlug || cCode === pathCompSlug || cName === pathCompSlug || pathCompSlug.includes(cId) || cName.includes(pathCompSlug))) ||
               (userCompIdNorm && (cId === userCompIdNorm || cCode === userCompIdNorm || cName === userCompIdNorm));
      });
      if (found) matchedCompanyId = normStr(found.id);
    }

    const targetNorms = new Set([userCompIdNorm, pathCompSlug, matchedCompanyId].filter(Boolean));
    const joyAliases = new Set(['comp001', 'compjoy', 'comptest1', 'joy01', 'joy', 'joycorp', 'joycorporatesolutions', 'joycorporatesolutionsprivatelimited', 'comp002', 'joymanpower', 'joymanpowerservice']);
    const isJoyTarget = Array.from(targetNorms).some(n => joyAliases.has(n));

    const companyFiltered = rawList.filter(c => {
      if (!c) return false;
      const candCompNorm = normStr(c.companyId || c.company_id || c.companyCode || c.company_code || c.companyName || c.company_name);
      const candHrNorm = normStr(c.hrId || c.hr_id);
      if (!candCompNorm) return true;
      if (candHrNorm && userHrIdNorm && candHrNorm === userHrIdNorm) return true;
      if (targetNorms.has(candCompNorm)) return true;
      if (matchedCompanyId && candCompNorm === matchedCompanyId) return true;
      if (isJoyTarget && (joyAliases.has(candCompNorm) || candCompNorm.includes('comp') || candCompNorm.includes('joy') || candCompNorm.includes('manpower'))) {
        return true;
      }
      return true;
    });

    // Apply strict deduplication to prevent counting duplicate candidates
    const seen = new Set();
    return companyFiltered.filter(c => {
      if (!c) return false;
      const tok = (c.token || c.id || '').toString().toLowerCase().trim();
      const empKey = (c.empId || c.employeeNumber || '').toString().toUpperCase().trim();
      const emailKey = (c.email || '').toString().toLowerCase().trim();
      const mobDigits = (c.mobile || '').replace(/\D/g, '');
      const mobKey = mobDigits.length === 10 && !['9876543210', '1234567890', '0000000000'].includes(mobDigits) ? mobDigits : '';
      const aadhaarDigits = (c.aadhaarNo || c.aadhaar_no || '').replace(/\D/g, '');
      const aadhaarKey = aadhaarDigits.length === 12 ? aadhaarDigits : '';
      const isGenericEmp = !empKey || ['EMP', 'PENDING', 'N/A', 'NONE', 'JOY-EMP-001', '0', '-'].includes(empKey);
      
      const isDup = (tok && seen.has(`TOK::${tok}`)) || 
                    (!isGenericEmp && seen.has(`EMP::${empKey}`)) ||
                    (emailKey && emailKey.includes('@') && seen.has(`EML::${emailKey}`)) ||
                    (mobKey && seen.has(`MOB::${mobKey}`)) ||
                    (aadhaarKey && seen.has(`ADH::${aadhaarKey}`));
      
      if (isDup) return false;
      
      if (tok) seen.add(`TOK::${tok}`);
      if (!isGenericEmp) seen.add(`EMP::${empKey}`);
      if (emailKey && emailKey.includes('@')) seen.add(`EML::${emailKey}`);
      if (mobKey) seen.add(`MOB::${mobKey}`);
      if (aadhaarKey) seen.add(`ADH::${aadhaarKey}`);
      return true;
    });
  }, [candidates, effectiveRole, currentUser, companies]);

  const activeCandidateCompanyFeatures = useMemo(() => {
    if (effectiveRole !== 'employee_link') return null;
    const candCompId = currentCandidate?.companyId || currentCandidate?.company_id;
    const foundComp = (companies || []).find(c => c.id === candCompId || c.code === currentCandidate?.companyName || c.name === currentCandidate?.companyName) || companies?.[0];
    return foundComp?.features || {};
  }, [effectiveRole, currentCandidate, companies]);

  // 6. Active Selected Pillar & Division State
  const [activePillarId, setActivePillarId] = useState(() => {
    if (effectiveRole === 'superadmin') return 'core_ops';
    if (effectiveRole === 'company') return 'telemetry_candidates';
    if (effectiveRole === 'hrexecutive') return 'pipeline_dossiers';
    return 'cand_identity';
  });

  const [activeDivisionId, setActiveDivisionId] = useState(() => {
    if (effectiveRole === 'superadmin') return 'companies';
    if (effectiveRole === 'company') return 'registry';
    if (effectiveRole === 'hrexecutive') return 'pipeline';
    return 'aadhaar';
  });

  // Role details mapping
  const roleThemeDetails = {
    superadmin: {
      label: 'Super Admin',
      badgeClass: 'badge-purple',
      icon: Crown,
      codePrefix: 'SUPERADMIN',
      badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-200'
    },
    company: {
      label: 'Company Admin',
      badgeClass: 'badge-cyan',
      icon: Building2,
      codePrefix: 'COMP001',
      badgeColor: 'bg-sky-50 text-sky-900 border-sky-200'
    },
    hrexecutive: {
      label: 'HR Executive',
      badgeClass: 'badge-emerald',
      icon: UserCheck,
      codePrefix: 'COMP001HR001',
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200'
    },
    employee_link: {
      label: 'Candidate Portal',
      badgeClass: 'badge-amber',
      icon: Smartphone,
      codePrefix: 'COMP001EMP001',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200'
    }
  };

  const currentTheme = roleThemeDetails[effectiveRole] || roleThemeDetails.superadmin;
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
      const { activeMainSection, activeTab, activeDivisionId: syncDivId } = e.detail || {};
      if (syncDivId) {
        setActiveDivisionId(syncDivId);
      } else if (activeTab) {
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

  const slugify = (text) => (text || '').toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const companySlug = slugify(currentUser?.companyName || 'joy-corporate-solutions');
  const hrSlug = slugify(currentUser?.name || 'hari-priya');

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

    // Update browser address bar with hierarchical URL
    if (currentRole === 'hrexecutive') {
      const tabSlugMap = { pipeline: 'candidates', profiler: 'add-candidate', analytics: 'reports', settings: 'settings' };
      const currentTabSlug = tabSlugMap[targetTab] || targetTab || 'candidates';
      window.history.pushState(null, '', `/${companySlug}/hr/${hrSlug}/${currentTabSlug}`);
    } else if (currentRole === 'company') {
      window.history.pushState(null, '', `/${companySlug}/company/admin/${targetTab || 'telemetry'}`);
    } else if (currentRole === 'superadmin') {
      window.history.pushState(null, '', `/superadmin/console/${targetTab || 'companies'}`);
    }

    // Dispatch global event for Portal views to consume
    window.dispatchEvent(new CustomEvent('portal_nav_navigate', {
      detail: {
        section: pillar.id,
        tab: targetTab,
        division: division?.id || null,
        subDivision: division?.subDivision || null,
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
  // 🏛️ SOFT-CARD FLOATING PILLARS: Modern Notion & Apple Style (No plain numbers)
  // =========================================================================
  const pillarsConfig = useMemo(() => {
    if (workspaceMode === 'personal' && effectiveRole !== 'employee_link') {
      return [
        {
          id: 'my_workspace',
          title: 'Profile & Credentials',
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
          title: 'Session & Audit Trail',
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
          title: 'Alerts & Helpdesk',
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
          title: 'Exports & Legal Docs',
          subtitle: 'Exports & DPDP Framework',
          badgeText: '2 Tools',
          icon: Download,
          colorClass: 'from-sky-600 to-indigo-600',
          defaultTab: 'exports',
          divisions: [
            { id: 'export_hub', label: 'Universal Reports Hub', modal: 'universal_export', icon: Download },
            { id: 'legal_docs', label: 'Statutory DPDP Handbook', modal: 'legal_handbook', icon: Scale }
          ]
        }
      ];
    }

    // =========================================================================
    // 👑 1. SUPER ADMIN: MODULAR CATEGORIES (Clean Semantic SaaS Names)
    // =========================================================================
    if (effectiveRole === 'superadmin') {
      return [
        {
          id: 'core_ops',
          title: 'Companies & Tenants',
          subtitle: 'Tenants & Candidates',
          badgeText: '4 Modules',
          icon: Building2,
          colorClass: 'from-indigo-600 to-purple-600',
          defaultTab: 'companies',
          divisions: [
            { id: 'companies', label: 'All Companies List', tab: 'companies', icon: Building2 },
            { id: 'onboard_company', label: 'Onboard New Company', tab: 'onboard_company', icon: Plus },
            { id: 'ledger', label: 'Candidate Records', tab: 'ledger', icon: Users },
            { id: 'logins', label: 'Login Directory', tab: 'logins', icon: UserCheck },
            { id: 'omnisearch', label: 'Quick Search', tab: 'omnisearch', icon: Search }
          ]
        },
        {
          id: 'landing_public_cms',
          title: 'Landing Page & CMS',
          subtitle: 'Homepage, Leads & Reviews',
          badgeText: '4 Modules',
          icon: Globe,
          colorClass: 'from-blue-600 to-cyan-600',
          defaultTab: 'landing_cms',
          divisions: [
            { id: 'landing_cms', label: 'Homepage Content & CMS', tab: 'landing_cms', icon: Globe },
            { id: 'leads_inquiries', label: 'Inquiries & Leads', tab: 'inquiries', icon: Sparkles },
            { id: 'reviews_moderation', label: 'Customer Reviews', tab: 'reviews', icon: Star },
            { id: 'terms_hub', label: 'Terms & Agreements', tab: 'terms_hub', icon: Scale }
          ]
        },
        {
          id: 'gateways_engine',
          title: 'Verification Gateways',
          subtitle: '81 APIs & Live Studio',
          badgeText: '5 Gateways',
          icon: Zap,
          colorClass: 'from-teal-600 to-emerald-600',
          defaultTab: 'apiconfig',
          divisions: [
            { id: 'apiconfig', label: 'Gateway Settings (UIDAI/NSDL)', tab: 'apiconfig', icon: Zap },
            { id: 'studio', label: 'Live Verification Studio', tab: 'studio', icon: Layers },
            { id: 'api_margins', label: 'API Consumption & Profit Margins', tab: 'consumption_margins', icon: TrendingUp },
            { id: 'comm_gateways', label: 'Messaging (WhatsApp & SMS)', tab: 'whatsapp_sms', icon: MessageSquare },
            { id: 'settings_smtp', label: 'Email SMTP Server', tab: 'settings', icon: Mail }
          ]
        },
        {
          id: 'billing_finance',
          title: 'Invoices & Billing',
          subtitle: 'Postpaid Bills & Gateway',
          badgeText: '3 Modules',
          icon: CreditCard,
          colorClass: 'from-amber-600 to-orange-600',
          defaultTab: 'billing',
          divisions: [
            { id: 'billing', label: 'Company Billing Ledger', tab: 'billing', icon: CreditCard },
            { id: 'api_margins_fin', label: 'API Margins & Costs', tab: 'consumption_margins', icon: TrendingUp },
            { id: 'razorpay_modal', label: 'Razorpay Payment Gateway', modal: 'razorpay_admin', icon: Zap }
          ]
        },
        {
          id: 'db_security',
          title: 'Database & System Logs',
          subtitle: 'PostgreSQL & Forensics',
          badgeText: '5 Modules',
          icon: Database,
          colorClass: 'from-rose-600 to-pink-700',
          defaultTab: 'dbms',
          divisions: [
            { id: 'dbms', label: 'PostgreSQL Database Explorer', tab: 'dbms', icon: Database },
            { id: 'audit', label: 'Audit Trail & Activity Log', tab: 'audit', icon: FileText },
            { id: 'sessions', label: 'Active User Sessions', tab: 'sessions', icon: ShieldCheck },
            { id: 'issuelogs', label: 'System Incident Logs', tab: 'issuelogs', icon: Activity },
            { id: 'system_health', label: 'Platform Health & Telemetry', tab: 'system_health', icon: ShieldCheck }
          ]
        },
        {
          id: 'gov_reports',
          title: 'Compliance & Settings',
          subtitle: 'Reports, Privacy & Setup',
          badgeText: '5 Modules',
          icon: ShieldCheck,
          colorClass: 'from-purple-600 to-indigo-800',
          defaultTab: 'reports',
          divisions: [
            { id: 'reports', label: 'Reports Center', tab: 'reports', icon: Download },
            { id: 'guidelines', label: 'Legal & Privacy Rules', tab: 'legal_governance', icon: Scale },
            { id: 'masterfields', label: 'System Field Presets', tab: 'masterdata', icon: Sliders },
            { id: 'tickets', label: 'Support Helpdesk', tab: 'tickets', icon: LifeBuoy },
            { id: 'settings', label: 'Platform Settings', tab: 'settings', icon: Settings }
          ]
        }
      ];
    }

    // =========================================================================
    // 2. COMPANY ADMIN: 5 PILLARS (Clean Semantic SaaS Names)
    // =========================================================================
    if (effectiveRole === 'company') {
      return [
        {
          id: 'telemetry_candidates',
          title: 'Dashboard & Candidates',
          subtitle: 'Verification Records & Stats',
          badgeText: `${(scopedCandidates || []).length} Profiles`,
          icon: ShieldCheck,
          colorClass: 'from-sky-600 to-teal-600',
          defaultTab: 'registry',
          divisions: [
            { id: 'registry', label: `Candidate Directory (${(scopedCandidates || []).length})`, tab: 'registry', icon: Users },
            { id: 'telemetry', label: 'Verification Analytics', tab: 'telemetry', icon: TrendingUp }
          ]
        },
        {
          id: 'hr_governance',
          title: 'HR Team & Permissions',
          subtitle: 'Staff & Access Management',
          badgeText: `${(hrUsers || []).length} Staff`,
          icon: Users,
          colorClass: 'from-indigo-600 to-purple-700',
          defaultTab: 'hrteam',
          divisions: [
            { id: 'hrteam', label: `HR Team Directory (${(hrUsers || []).length})`, tab: 'hrteam', icon: UserCheck },
            { id: 'add_hr_modal', label: 'Add HR Recruiter', modal: 'add_hr', icon: Plus },
            { id: 'hr_permissions', label: 'HR Permissions & Access', tab: 'hr_permissions', icon: Sliders }
          ]
        },
        {
          id: 'vendor_verification',
          title: 'Vendor Verification',
          subtitle: 'Vendor Screening & Checks',
          badgeText: `${(vendors || []).length} Vendors`,
          icon: ShieldCheck,
          colorClass: 'from-purple-600 to-indigo-700',
          defaultTab: 'vendor_verification',
          divisions: [
            { id: 'vendor_directory', label: 'Vendor Directory', tab: 'vendor_verification', subDivision: 'directory', icon: BarChart3 },
            { id: 'vendor_register', label: 'Add New Vendor', tab: 'vendor_verification', subDivision: 'register', icon: Plus },
            { id: 'vendor_links', label: 'Send Vendor Link', tab: 'vendor_verification', subDivision: 'links', icon: Share2 },
            { id: 'vendor_studio', label: 'Vendor Background Checks', tab: 'vendor_verification', subDivision: 'studio', icon: Sparkles },
            { id: 'vendor_pdf', label: 'Download Verification Report', tab: 'vendor_verification', subDivision: 'pdf', icon: Download }
          ]
        },
        {
          id: 'corporate_dms',
          title: 'Company Profile & Files',
          subtitle: 'Company Information & Documents',
          badgeText: 'Vault',
          icon: Building2,
          colorClass: 'from-emerald-600 to-teal-700',
          defaultTab: 'profile_details',
          divisions: [
            { id: 'profile_details', label: 'Company Information', tab: 'profile_details', icon: Building2 },
            { id: 'statutory_creds', label: 'Tax & Business Registration', tab: 'profile_details', icon: ShieldCheck },
            { id: 'dochub', label: 'Document Storage', tab: 'dochub', icon: Layers }
          ]
        },
        {
          id: 'billing_gateways',
          title: 'Plans & Billing',
          subtitle: 'Monthly Invoices & Payments',
          badgeText: 'Billing',
          icon: CreditCard,
          colorClass: 'from-amber-600 to-orange-700',
          defaultTab: 'billing_wallet',
          divisions: [
            { id: 'billing_wallet', label: 'Plans & Invoices', tab: 'billing_wallet', icon: CreditCard },
            { id: 'recharge_wallet', label: 'Pay Bill Online', modal: 'razorpay', icon: Zap },
            { id: 'smtp_settings', label: 'Email Notifications Setup', tab: 'smtp_settings', icon: MessageSquare },
            { id: 'support', label: 'Helpdesk & Support', tab: 'support', icon: LifeBuoy }
          ]
        }
      ];
    }

    // =========================================================================
    // 3. HR EXECUTIVE: 4 PILLARS (Clean Semantic SaaS Names)
    // =========================================================================
    if (effectiveRole === 'hrexecutive') {
      return [
        {
          id: 'pipeline_dossiers',
          title: 'Candidate Pipeline',
          subtitle: 'Manage Employee Candidates',
          badgeText: `${(scopedCandidates || []).length} Candidates`,
          icon: Smartphone,
          colorClass: 'from-emerald-600 to-teal-700',
          defaultTab: 'pipeline',
          divisions: [
            { id: 'pipeline', label: `All Candidates (${(scopedCandidates || []).length})`, tab: 'pipeline', query: 'All', icon: Smartphone },
            { id: 'pipeline_active', label: `Pending Verification (${(scopedCandidates || []).filter(c => c?.status !== 'Verified' && c?.verification_status !== 'Verified' && !c?.digilocker_verified && c?.status?.toString().toLowerCase() !== 'inactive').length})`, tab: 'pipeline', query: 'Pending Verification', icon: Zap },
            { id: 'pipeline_verified', label: `Verified Candidates (${(scopedCandidates || []).filter(c => c?.status === 'Verified' || c?.verification_status === 'Verified' || c?.digilocker_verified === true).length})`, tab: 'pipeline', query: 'Verified', icon: CheckCircle2 }
          ]
        },
        {
          id: 'profiler_dispatch',
          title: 'Add Candidate',
          subtitle: 'New Candidate & Magic Link',
          badgeText: 'New Link',
          icon: Sliders,
          colorClass: 'from-teal-600 to-emerald-700',
          defaultTab: 'profiler',
          divisions: [
            { id: 'profiler', label: 'New Candidate Form', tab: 'profiler', icon: Sliders },
            { id: 'bulk_import_btn', label: 'Bulk Import (Excel)', tab: 'profiler', modal: 'bulk_import', icon: FileSpreadsheet }
          ]
        },
        {
          id: 'statutory_settings',
          title: 'Reports & Settings',
          subtitle: 'Analytics & HR Config',
          badgeText: 'Config',
          icon: Settings,
          colorClass: 'from-indigo-600 to-purple-700',
          defaultTab: 'analytics',
          divisions: [
            { id: 'analytics', label: 'Verification Reports', tab: 'analytics', icon: TrendingUp },
            { id: 'statutory_forms', label: 'Government Forms (EPF/ESI)', tab: 'statutory_forms', icon: Scale },
            { id: 'settings', label: 'HR Settings', tab: 'settings', icon: Settings }
          ]
        },
        {
          id: 'digilocker_vault',
          title: 'DigiLocker Vault',
          subtitle: 'Govt e-KYC & Certificates',
          badgeText: 'DigiLocker',
          icon: Building2,
          colorClass: 'from-sky-600 to-indigo-800',
          defaultTab: 'digilocker_vault',
          divisions: [
            { id: 'digilocker_create', label: 'DigiLocker Fetch', tab: 'digilocker_vault', icon: Smartphone },
            { id: 'digilocker_dossier', label: 'Verified Profiles', tab: 'digilocker_vault', icon: Building2 },
            { id: 'digilocker_compliance', label: 'NeGD Compliance', tab: 'digilocker_vault', icon: Scale }
          ]
        }
      ];
    }

    // =========================================================================
    // 📱 4. CANDIDATE PORTAL (Clean Steps)
    // =========================================================================
    return [
      {
        id: 'cand_identity',
        title: 'Identity Checks',
        subtitle: 'Aadhaar, Mobile & Photo',
        badgeText: 'Step 1',
        icon: ShieldCheck,
        colorClass: 'from-amber-600 to-orange-600',
        defaultTab: 'aadhaar_step',
        divisions: [
          { id: 'aadhaar_step', label: 'Aadhaar Verification', tab: 'aadhaar', icon: ShieldCheck },
          { id: 'otp_step', label: 'Mobile & Email OTP', tab: 'otp', icon: Smartphone },
          { id: 'face_step', label: 'Photo & Selfie Match', tab: 'face', icon: Sparkles }
        ]
      },
      {
        id: 'cand_financial',
        title: 'Bank & Tax Info',
        subtitle: 'PAN Card & Bank Account',
        badgeText: 'Step 2',
        icon: CreditCard,
        colorClass: 'from-sky-600 to-indigo-600',
        defaultTab: 'pan_step',
        divisions: [
          { id: 'pan_step', label: 'PAN Card Check', tab: 'pan', icon: CreditCard },
          { id: 'bank_step', label: 'Bank Account Check', tab: 'bank', icon: Building2 },
          { id: 'dl_step', label: 'Driving License / UAN', tab: 'dl', icon: Layers }
        ]
      },
      {
        id: 'cand_joining',
        title: 'Joining Form & Signature',
        subtitle: 'Personal Details & Sign',
        badgeText: 'Step 3',
        icon: FileText,
        colorClass: 'from-emerald-600 to-teal-700',
        defaultTab: 'joining_form',
        divisions: [
          { id: 'joining_form', label: 'Personal & Address Details', tab: 'joining_form', icon: FileText },
          { id: 'signature_step', label: 'Digital Signature Pad', tab: 'signature', icon: Scale }
        ]
      },
      {
        id: 'cand_certs',
        title: 'Download Documents',
        subtitle: 'Certificates & Privacy',
        badgeText: 'Final',
        icon: Download,
        colorClass: 'from-purple-600 to-indigo-700',
        defaultTab: 'cert_download',
        divisions: [
          { id: 'cert_download', label: 'Verification Certificate (PDF)', modal: 'cert', icon: Download },
          { id: 'labor_dossier', label: 'Employee Record (PDF)', modal: 'dossier', icon: FileText },
          { id: 'dpdp_rights', label: 'Privacy & Data Rights', modal: 'legal_handbook', icon: Scale }
        ]
      }
    ];
  }, [workspaceMode, effectiveRole, scopedCandidates, hrUsers, unreadCount, currentUser?.uniqueProfileId, currentTheme.codePrefix]);

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
    <div className="h-full flex flex-col justify-between bg-[#F8FAFC] text-slate-800 font-sans select-none overflow-hidden relative border-r border-slate-200/80">
      
      {/* ========================================================================= */}
      {/* 1. TOP BRAND HEADER: Clean Apple/Notion Soft-Card Style                   */}
      {/* ========================================================================= */}
      <div className={`border-b border-slate-200/70 flex items-center shrink-0 bg-white/80 backdrop-blur-md transition-all ${
        isCollapsed ? 'p-3 justify-center flex-col gap-2' : 'px-3.5 py-3 justify-between'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0 flex items-center justify-center">
            <img 
              src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
              alt="JOY TRUE PROFILE" 
              className="w-8 h-8 object-contain transition-transform duration-200 hover:scale-105" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="animate-fadeIn min-w-0">
              <h1 className="font-extrabold text-[13px] tracking-tight text-slate-900 leading-tight">
                JOY <span className="text-amber-500">TRUE PROFILE</span>
              </h1>
              <p className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="truncate">{currentTheme.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Desktop Collapsible Rail Toggle Button */}
        {!isMobile && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-700 transition-all cursor-pointer border border-slate-200/80 shadow-2xs hover:scale-105"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar (Compact Rail)"}
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
      {/* 2. TOP SEGMENTED SWITCHER: Modern Apple-Style Sliding Capsule              */}
      {/* ========================================================================= */}
      {!isCollapsed && (() => {
        const segmentedTabLabels = {
          superadmin: { mode1: 'Platform Ops', mode2: 'My Workspace' },
          company: { mode1: 'Company Ops', mode2: 'My Workspace' },
          hrexecutive: { mode1: 'Recruiter Hub', mode2: 'My Workspace' },
          employee_link: { mode1: 'Verification', mode2: 'My Documents' }
        };
        const currentModeLabels = segmentedTabLabels[effectiveRole] || { mode1: 'Operations', mode2: 'My Workspace' };

        return (
          <div className="px-3 pt-2.5 pb-1 shrink-0 animate-fadeIn">
            <div className="bg-slate-200/60 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setWorkspaceMode('company');
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer text-center truncate ${
                  workspaceMode === 'company'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
                title={currentModeLabels.mode1}
              >
                {currentModeLabels.mode1}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setWorkspaceMode('personal');
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer text-center truncate ${
                  workspaceMode === 'personal'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                }`}
                title={currentModeLabels.mode2}
              >
                {currentModeLabels.mode2}
              </button>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 3. REAL-TIME QUICK SEARCH INPUT: Notion-Grade Omni-Search                 */}
      {/* ========================================================================= */}
      {!isCollapsed && (
        <div className="px-3 py-1.5 shrink-0 animate-fadeIn">
          <div className="relative flex items-center group">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules & tools..."
              className="w-full bg-white/90 border border-slate-200/80 rounded-xl pl-9 pr-14 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400 font-medium transition-all shadow-2xs"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Clear Search"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200/80 pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SOFT-CARD FLOATING PILLARS & DIVISIONS (Notion & Apple Style)          */}
      {/* ========================================================================= */}
      <div className={`flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-200 ${
        isCollapsed ? 'px-2 py-3' : 'px-3 py-1.5'
      }`}>
        {filteredPillars.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <Search className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="text-xs font-medium">No pillars or divisions matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
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
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-all cursor-pointer shadow-2xs ${
                      isPillarActive
                        ? `bg-gradient-to-br ${pillar.colorClass} text-white ring-2 ring-indigo-400 ring-offset-2 scale-105 shadow-sm`
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                    }`}
                    title={pillar.title}
                  >
                    <Icon className="w-5 h-5" />
                  </button>

                  {/* 🚀 Hover Floating Flyout Menu */}
                  <div className="hidden group-hover:flex absolute left-full top-0 ml-3 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-2xl p-3 z-50 flex-col gap-2 animate-fadeIn font-sans text-left">
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
                        const isDivActive = activeDivisionId === div.id || (div.id === div.tab && activeDivisionId === div.tab && !divisions.some(d => d.id !== div.id && d.tab === div.tab));
                        const DivIcon = div.icon || ChevronRight;
                        return (
                          <button
                            key={div.id}
                            type="button"
                            onClick={() => handleNavigate(pillar, div)}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                              isDivActive
                                ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200/90'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                            }`}
                          >
                            <DivIcon className={`w-3.5 h-3.5 shrink-0 ${isDivActive ? 'text-indigo-600' : 'text-slate-400'}`} />
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
            // 📖 SOFT-CARD FLOATING PILLAR ITEM (Apple & Notion Tint Style)
            // =========================================================================
            return (
              <div 
                key={pillar.id} 
                className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                  isPillarActive 
                    ? 'bg-white shadow-xs border border-slate-200/90 ring-1 ring-slate-900/5' 
                    : 'bg-white/50 hover:bg-white/90 border border-slate-200/40 hover:border-slate-200/80'
                }`}
              >
                
                {/* 🌟 PILLAR HEADER CARD */}
                <div
                  className="p-2.5 flex items-center justify-between cursor-pointer group select-none transition-colors"
                  onClick={() => {
                    togglePillarAccordion(pillar.id);
                    handleNavigate(pillar);
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1 flex-1 overflow-hidden">
                    {/* Floating Soft Icon Squircle */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-transform duration-200 group-hover:scale-105 shrink-0 ${
                      isPillarActive
                        ? `bg-gradient-to-br ${pillar.colorClass} text-white shadow-2xs`
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Title + Subtitle */}
                    <div className="min-w-0 flex-1">
                      <h4 className={`font-bold text-xs tracking-tight truncate leading-tight transition-colors ${
                        isPillarActive ? 'text-slate-900 font-extrabold' : 'text-slate-700 group-hover:text-slate-900'
                      }`}>
                        {pillar.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {pillar.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Module Count Badge + Accordion Chevron */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <span className={`text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md whitespace-nowrap ${
                      isPillarActive
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {pillar.badgeText}
                    </span>

                    <span className="w-4 h-4 flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition-transform duration-200 shrink-0">
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-indigo-600' : ''}`} />
                    </span>
                  </div>
                </div>

                {/* 📂 NEAT DIVISIONS LIST WITH SOFT-TINT ACTIVE PILLS */}
                {isExpanded && divisions.length > 0 && (
                  <div className="pt-0.5 pb-2 px-2 space-y-0.5 border-t border-slate-100 animate-fadeIn">
                    {divisions.map((div) => {
                      const isDivActive = activeDivisionId === div.id || (div.id === div.tab && activeDivisionId === div.tab && !divisions.some(d => d.id !== div.id && d.tab === div.tab));
                      const DivIcon = div.icon || ChevronRight;

                      // Determine if candidate division is disabled by SuperAdmin / Company feature flags
                      let isDivDisabled = false;
                      if (effectiveRole === 'employee_link' && activeCandidateCompanyFeatures) {
                        const feats = activeCandidateCompanyFeatures;
                        if (div.tab === 'aadhaar' && feats.aadhaar === false) isDivDisabled = true;
                        if (div.tab === 'otp' && (feats.mobileOtp === false && feats.emailGateway === false && feats.email === false && feats.emailOtp === false)) isDivDisabled = true;
                        if (div.tab === 'face' && (feats.aiFaceBiometrics === false && feats.faceCapture === false)) isDivDisabled = true;
                        if (div.tab === 'pan' && feats.pan === false) isDivDisabled = true;
                        if (div.tab === 'bank' && feats.bankCheck === false) isDivDisabled = true;
                        if (div.tab === 'dl' && (feats.drivingLicense === false && feats.uan === false && feats.passport === false)) isDivDisabled = true;
                      }

                      return (
                        <button
                          key={div.id}
                          type="button"
                          title={isDivDisabled ? "🔒 Feature Disabled by Enterprise Administrator Policy" : div.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isDivDisabled) {
                              try { soundEngine?.playError?.(); } catch (err) {}
                              showToast('🚫 Feature Disabled: This verification module is deactivated for your organization by Super Admin.', 'error');
                              return;
                            }
                            handleNavigate(pillar, div);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all duration-150 text-left group/div cursor-pointer ${
                            isDivDisabled
                              ? 'bg-slate-100/70 text-slate-400 opacity-60 cursor-not-allowed select-none'
                              : isDivActive
                              ? 'bg-indigo-50/90 text-indigo-950 font-extrabold shadow-2xs border-l-[3px] border-indigo-600 rounded-l-xs translate-x-0.5'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium hover:translate-x-0.5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-1">
                            <DivIcon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                              isDivDisabled ? 'text-slate-300' : isDivActive ? 'text-indigo-600' : 'text-slate-400 group-hover/div:text-slate-700'
                            }`} />
                            <span className={`truncate ${isDivDisabled ? 'line-through decoration-slate-300' : ''}`}>{div.label}</span>
                          </div>

                          {isDivDisabled ? (
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5 shrink-0 ml-1" title="Disabled by Admin">
                              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                            </span>
                          ) : isDivActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 animate-pulse ml-1" />
                          ) : null}
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
      {/* 5. LIVE TELEMETRY MICRO-STRIP: Real-Time Operational Assurance            */}
      {/* ========================================================================= */}
      {!isCollapsed && (
        <div className="px-3 py-1 shrink-0 animate-fadeIn">
          <div className="flex items-center justify-between px-2.5 py-1 rounded-xl bg-slate-100/80 text-[10px] text-slate-500 font-semibold border border-slate-200/60 shadow-2xs">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{effectiveRole === 'superadmin' ? 'PostgreSQL 16 · Live' : (effectiveRole === 'employee_link' ? 'DPDP Consent Active' : 'Verification Engine Active')}</span>
            </span>
            <span className="font-mono text-slate-400 font-bold">
              {effectiveRole === 'superadmin' ? '81 APIs' : (effectiveRole === 'employee_link' ? '256-Bit SSL' : 'Live Sync')}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BOTTOM EXECUTIVE SECURITY DOCK: Notion & Apple Floating Card           */}
      {/* ========================================================================= */}
      <div className={`border-t border-slate-200/70 bg-white/90 backdrop-blur-md shrink-0 ${
        isCollapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-3 space-y-2'
      }`}>
        
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs" title={currentUser?.name || 'User'}>
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
            {/* Floating User Profile Card Pill */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/70 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                  <User className="w-3.5 h-3.5" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate leading-tight">
                    {effectiveRole === 'employee_link' 
                      ? (currentCandidate?.name || 'Candidate User') 
                      : (currentUser?.name || currentUser?.email || 'Administrator')}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-indigo-100/70 text-indigo-900 font-mono font-bold text-[9px] border border-indigo-200/60 truncate">
                      {effectiveRole === 'superadmin' ? 'SUPERADMIN' : (effectiveRole === 'employee_link' ? (currentCandidate?.employeeCode || currentCandidate?.empId || currentCandidate?.id || currentTheme.codePrefix) : (currentUser?.uniqueProfileId || currentUser?.employeeCode || currentUser?.hrCode || currentTheme.codePrefix))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sound FX Toggle Button */}
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
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
            <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
              <div className="shrink-0">
                <ActiveSessionBadge placement="top" />
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick?.();
                  logoutUser();
                }}
                className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-rose-700 hover:text-rose-800 bg-rose-50/80 hover:bg-rose-100 border border-rose-200 font-bold transition-all cursor-pointer text-xs shadow-2xs hover:shadow-xs shrink-0"
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
