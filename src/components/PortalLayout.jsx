import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PortalSidebarNav } from './PortalSidebarNav';
import { SupportTicketModal } from './SupportTicketModal';
import { AccessRestrictedModal } from './AccessRestrictedModal';
import { CustomReportBuilderModal } from './CustomReportBuilderModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { ActiveSessionBadge } from './ActiveSessionBadge';
import { TermsAndPrivacyPolicyModal } from './TermsAndPrivacyPolicyModal';
import { LegalComplianceHandbookModal } from './LegalComplianceHandbookModal';
import { UniversalDocumentExportModal } from './UniversalDocumentExportModal';
import { InteractiveTourGuideModal } from './InteractiveTourGuideModal';
import { UniversalSpotlightOmnibar } from './UniversalSpotlightOmnibar';
import { soundEngine } from '../utils/uiSoundEffects';
import {
  Building2,
  UserCheck,
  Smartphone,
  Crown,
  Sparkles,
  LifeBuoy,
  Scale,
  Compass,
  Home,
  Download,
  Menu,
  ChevronDown,
  Bell,
  Zap,
  ShieldCheck,
  Sliders,
  ChevronRight,
  Search
} from 'lucide-react';

export const PortalLayout = ({ children, isCandidatePortal = false }) => {
  const {
    currentRole,
    candidates,
    selectedCandidateToken,
    setSelectedCandidateToken,
    notifications,
    accessDeniedNotice,
    closeAccessDeniedNotice,
    platformLogoEmblem
  } = useApp();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [portalSwitcherOpen, setPortalSwitcherOpen] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showUniversalExportModal, setShowUniversalExportModal] = useState(false);
  const [showTourGuideModal, setShowTourGuideModal] = useState(false);
  const [showOmnibar, setShowOmnibar] = useState(false);

  const locationPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isCandidateRoute = Boolean(
    isCandidatePortal ||
    currentRole === 'employee_link' ||
    locationPath.includes('/verify') || 
    locationPath.includes('/employee') || 
    (locationPath.includes('/candidate') && !locationPath.includes('/hr/') && !locationPath.includes('/candidates') && !locationPath.includes('/company/') && !locationPath.includes('/superadmin'))
  );

  const effectiveRole = isCandidateRoute ? 'employee_link' : (currentRole || 'superadmin');
  const roleKey = effectiveRole === 'employee_link' ? 'candidate' : effectiveRole;
  const unreadCount = (notifications || []).filter(n => n.role === roleKey && !n.isRead).length;

  const roleThemeDetails = {
    superadmin: {
      label: 'Super Admin Console',
      badgeClass: 'badge-purple',
      icon: Crown,
      accentGradient: 'from-indigo-600 via-purple-600 to-indigo-800'
    },
    company: {
      label: 'Company Admin Console',
      badgeClass: 'badge-cyan',
      icon: Building2,
      accentGradient: 'from-sky-600 via-teal-600 to-sky-800'
    },
    hrexecutive: {
      label: 'HR Executive Workstation',
      badgeClass: 'badge-emerald',
      icon: UserCheck,
      accentGradient: 'from-emerald-600 via-teal-700 to-emerald-800'
    },
    employee_link: {
      label: 'Candidate Self-Verification',
      badgeClass: 'badge-amber',
      icon: Smartphone,
      accentGradient: 'from-amber-500 via-orange-600 to-amber-700'
    }
  };

  const currentTheme = roleThemeDetails[effectiveRole] || roleThemeDetails.superadmin;

  // Listen to navigation events from sidebar or other components requesting modals
  useEffect(() => {
    const handleNavEvent = (e) => {
      const { modal } = e.detail || {};
      if (!modal) return;
      if (modal === 'notifications') setShowNotificationsModal(true);
      if (modal === 'support') setShowSupportModal(true);
      if (modal === 'universal_export') setShowUniversalExportModal(true);
      if (modal === 'custom_report') setShowCustomReportModal(true);
      if (modal === 'legal_handbook') setShowLegalHandbook(true);
      if (modal === 'tour') setShowTourGuideModal(true);
      if (modal === 'terms') setShowTermsModal(true);
      if (modal === 'omnibar' || modal === 'search') setShowOmnibar(true);
    };

    const handleOpenOmnibar = () => setShowOmnibar(true);
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowOmnibar(prev => !prev);
      }
    };

    window.addEventListener('portal_nav_navigate', handleNavEvent);
    window.addEventListener('open_omnibar', handleOpenOmnibar);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('portal_nav_navigate', handleNavEvent);
      window.removeEventListener('open_omnibar', handleOpenOmnibar);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('portal_sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    soundEngine.playClick?.();
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('portal_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] flex text-slate-900 font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP LEFT-SIDE SIDEBAR NAVIGATION (PERMANENTLY FIXED ON >= lg SCREENS)*/}
      {/* ========================================================================= */}
      {!isCandidateRoute && (
        <aside className={`hidden lg:flex flex-col h-full shrink-0 bg-[#F8FAFC] border-r border-slate-200/80 z-30 select-none shadow-xs transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-72 xl:w-80'
        }`}>
          <PortalSidebarNav 
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 📱 MOBILE / TABLET SLIDE-OVER DRAWER SHEET (< lg SCREENS)                 */}
      {/* ========================================================================= */}
      {!isCandidateRoute && mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fadeIn">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileDrawerOpen(false)} 
          />
          {/* Off-Canvas Sidebar Drawer */}
          <div className="relative w-80 max-w-[85vw] bg-[#F8FAFC] h-full shadow-2xl flex flex-col z-10 animate-slideRight">
            <PortalSidebarNav 
              isMobile 
              onCloseMobile={() => setMobileDrawerOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏛️ RIGHT-HAND MAIN WORKSPACE & CONTENT COLUMN (INDEPENDENT SCROLL)        */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden transition-all duration-300 w-full">
        
        {/* TOP SLIM PORTAL WORKSPACE HEADER BAR */}
        <header className="sticky top-0 z-20 backdrop-blur-2xl bg-white/95 border-b border-slate-200/90 px-3 sm:px-6 py-2.5 transition-all shadow-2xs select-none">
          
          {/* Top Role Accent Strip */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentTheme.accentGradient}`} />

          {isCandidateRoute ? (
            /* Dedicated, Clean Candidate Header */
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                  alt="JOY Logo" 
                  className="w-8 h-8 object-contain shrink-0" 
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-slate-900 leading-tight">
                      JOY <span className="text-amber-500">TRUE PROFILE</span>
                    </span>
                    <span className="badge badge-amber text-[9px] py-0.5 px-2 font-black tracking-wide uppercase">
                      CANDIDATE SELF-VERIFICATION
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold truncate hidden sm:block mt-0.5">
                    Statutory Compliance & Digital Trust Verification Gateway
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick?.();
                    setShowOmnibar(true);
                  }}
                  className="flex h-8 px-2.5 rounded-xl items-center gap-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-xs"
                  title="Search Portal (Ctrl+K or ⌘K)"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="hidden sm:inline">Search</span>
                  <kbd className="hidden sm:inline-flex px-1 text-[9px] font-mono text-slate-400 bg-white border border-slate-300 rounded">⌘K</kbd>
                </button>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick?.();
                    setShowLegalHandbook(true);
                  }}
                  className="flex h-8 px-2 sm:px-2.5 rounded-xl items-center gap-1 text-indigo-950 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap text-xs"
                  title="DPDP Act 2023 Statutory Privacy & Data Rights"
                >
                  <Scale className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                  <span className="hidden sm:inline">DPDP Shield 🛡️</span>
                  <span className="sm:hidden font-bold">DPDP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick?.();
                    setShowSupportModal(true);
                  }}
                  className="flex h-8 px-2 sm:px-2.5 rounded-xl items-center gap-1 text-purple-900 bg-white hover:bg-purple-50 font-bold border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap text-xs"
                  title="Need Help? Contact Support"
                >
                  <LifeBuoy className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="hidden sm:inline">Help 🛟</span>
                  <span className="sm:hidden font-bold">Help</span>
                </button>
              </div>
            </div>
          ) : (
            /* Admin & HR Workspace Header */
            <div className="w-full flex items-center justify-between gap-2.5">
            
            {/* Left: Mobile Drawer Trigger + Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setMobileDrawerOpen(true);
                }}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0"
                title="Open Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              {/* Mobile Brand Emblem (< lg screens) */}
              <div className="lg:hidden flex items-center gap-2 shrink-0">
                <img 
                  src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                  alt="JOY Logo" 
                  className="w-7 h-7 object-contain" 
                />
                <span className="font-black text-xs text-slate-900 leading-tight hidden sm:inline">
                  JOY <span className="text-amber-500">TRUE PROFILE</span>
                </span>
              </div>

              {/* Desktop Breadcrumb Path & Hyperscaler Context */}
              <div className="hidden lg:flex items-center gap-2.5 text-xs font-semibold text-slate-500 shrink-0">
                <span className="font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-default">
                  JOY Hub
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-600 font-medium">Muthu Joy Group</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold text-[11px] shadow-2xs border ${
                  effectiveRole === 'superadmin' ? 'bg-indigo-50/80 text-indigo-700 border-indigo-200/80' :
                  effectiveRole === 'company' ? 'bg-sky-50/80 text-sky-700 border-sky-200/80' :
                  'bg-emerald-50/80 text-emerald-700 border-emerald-200/80'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    effectiveRole === 'superadmin' ? 'bg-indigo-600' :
                    effectiveRole === 'company' ? 'bg-sky-600' :
                    'bg-emerald-600'
                  }`} />
                  {currentTheme.label}
                </span>

                {/* Cloud Region & Health Telemetry Indicator */}
                <div className="hidden 2xl:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-600 border border-slate-200/80 text-[10.5px] font-medium ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AP-SOUTH-1</span>
                  <span className="text-slate-300">•</span>
                  <span>99.98% SLA</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Controls Toolbar (Hyperscaler Command Bar Standard) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 text-xs">
              
              {/* Universal Spotlight Omnibar Trigger Button (AWS / Azure Style) */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowOmnibar(true);
                }}
                className="flex h-8 px-2.5 sm:px-3 rounded-lg items-center gap-2 text-slate-600 bg-slate-100/90 hover:bg-slate-200/80 font-medium border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-xs group"
                title="Universal Spotlight Search (Press Ctrl+K or ⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                <span className="hidden xl:inline font-normal text-slate-500">Search resources, IDs, candidates...</span>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9.5px] font-mono font-bold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Guided Tour Modal Trigger */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowTourGuideModal(true);
                  window.dispatchEvent(new CustomEvent("open_tour_guide_modal"));
                }}
                className="hidden md:flex h-8 px-2.5 rounded-lg items-center gap-1.5 text-purple-900 bg-purple-50/80 hover:bg-purple-100 font-semibold border border-purple-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap text-xs"
                title="Launch Interactive Feature Walkthroughs & How-To Guides"
              >
                <Compass className="w-3.5 h-3.5 text-purple-700 animate-spin-slow shrink-0" />
                <span className="hidden xl:inline">Tour</span>
              </button>

              {/* Statutory Legal Handbook Trigger */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowLegalHandbook(true);
                }}
                className="hidden xl:flex h-8 px-2.5 rounded-lg items-center gap-1.5 text-indigo-950 bg-indigo-50/80 hover:bg-indigo-100 font-semibold border border-indigo-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap text-xs"
                title="Statutory Legal & DPDP Act 2023 Compliance Framework"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span>Legal & DPDP</span>
              </button>

              {/* Universal Date-Filtered Export */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowUniversalExportModal(true);
                }}
                className="hidden sm:flex h-8 px-2.5 rounded-lg items-center gap-1 text-emerald-950 bg-emerald-50/80 hover:bg-emerald-100 font-semibold border border-emerald-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap text-xs"
                title="Download Date-Filtered Candidate Reports in PDF, Excel, Word, or ZIP"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="hidden xl:inline text-[11px] sm:text-xs font-semibold text-emerald-950">Reports</span>
              </button>

              {/* Notifications Alert Bell */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowNotificationsModal(true);
                }}
                className="h-8 px-2 sm:px-2.5 rounded-lg flex items-center gap-1 text-amber-800 bg-white hover:bg-amber-50/80 font-semibold border border-slate-200 shadow-2xs hover:shadow-xs transition-all relative cursor-pointer whitespace-nowrap text-xs"
                title="Real-Time Notifications & System Alerts"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="hidden sm:inline">Alerts</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Support Ticket Modal Trigger */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowSupportModal(true);
                }}
                className="hidden sm:flex h-8 px-2.5 rounded-lg items-center gap-1 text-purple-800 bg-white hover:bg-purple-50/80 font-semibold border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap text-xs"
                title="Raise Support Ticket / Feedback"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="hidden xl:inline">Support</span>
              </button>

              {/* Active Session Badge (Visible on all screen sizes) */}
              <div className="shrink-0">
                <ActiveSessionBadge placement="bottom" />
              </div>

            </div>

          </div>
          )}

        </header>

        {/* WORKSPACE VIEW CONTENT */}
        <main className={`flex-1 w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden ${
          isCandidateRoute ? 'max-w-5xl pb-16' : 'max-w-[1600px] pb-32 sm:pb-12'
        }`}>
          {children}
        </main>

      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE FLOATING ACTION ISLAND DOCK (< lg SCREENS)                      */}
      {/* ========================================================================= */}
      {!isCandidateRoute && (() => {
        const isCandidate = isCandidateRoute || effectiveRole === 'employee_link';
        return (
          <div className="lg:hidden fixed bottom-3 left-3 right-3 max-w-lg mx-auto z-30 select-none animate-fadeIn">
            <div className="backdrop-blur-2xl bg-white/95 border border-slate-200/90 shadow-2xl rounded-3xl p-1.5 flex items-center justify-around gap-1">
              
              {/* 1. For Admin & HR: Reports Hub / For Candidate: Verify Checklist */}
              {isCandidate ? (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick?.();
                    const el = document.getElementById('verification_checklist') || document.querySelector('.verification-steps-card');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-emerald-600 active:scale-95 transition-all cursor-pointer"
                  title="Verify Checklist"
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">Verify</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick?.();
                    setShowUniversalExportModal(true);
                  }}
                  className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer group"
                  title="Date-Filtered Candidate & Platform Reports"
                >
                  <Download className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800">Reports</span>
                </button>
              )}

              {/* 2. For Admin & HR: Compliance / For Candidate: Legal */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowLegalHandbook(true);
                }}
                className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-indigo-600 active:scale-95 transition-all cursor-pointer"
                title="Legal & DPDP Compliance"
              >
                <Scale className="w-4 h-4 text-indigo-600" />
                <span className="text-[9px] font-black uppercase tracking-wider">{isCandidate ? 'Legal' : 'Compliance'}</span>
              </button>

              {/* 3. Center Vibrant Compass Action Button (Guided Product Tour) */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowTourGuideModal(true);
                  window.dispatchEvent(new CustomEvent('open_tour_guide_modal'));
                }}
                className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-lg shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white flex items-center justify-center shrink-0"
                title="Interactive Guided Tour"
              >
                <Compass className="w-5 h-5 animate-spin-slow text-amber-300" />
              </button>

              {/* 4. Real-time Alerts (For Candidate: Support Ticket) */}
              {isCandidate ? (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick?.();
                    setShowSupportModal(true);
                  }}
                  className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-purple-600 active:scale-95 transition-all cursor-pointer"
                  title="Helpdesk & Support"
                >
                  <LifeBuoy className="w-4 h-4 text-purple-600" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Support</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick?.();
                    setShowNotificationsModal(true);
                  }}
                  className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-amber-600 active:scale-95 transition-all relative cursor-pointer"
                  title="Notifications"
                >
                  <div className="relative">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 w-3 h-3 rounded-full bg-rose-500 text-white text-[7.5px] font-black flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider">Alerts</span>
                </button>
              )}

              {/* 5. More Menu Sheet Toggle (Opens Left Sidebar Drawer) */}
              <button
                onClick={() => {
                  soundEngine.playClick?.();
                  setMobileDrawerOpen(true);
                }}
                className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
                title="More Options"
              >
                <Sliders className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-wider">Menu</span>
              </button>

            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 📦 GLOBAL SHARED MODALS                                                    */}
      {/* ========================================================================= */}
      {showNotificationsModal && (
        <NotificationCenterModal onClose={() => setShowNotificationsModal(false)} />
      )}

      {showCustomReportModal && (
        <CustomReportBuilderModal onClose={() => setShowCustomReportModal(false)} />
      )}

      {showSupportModal && (
        <SupportTicketModal onClose={() => setShowSupportModal(false)} />
      )}

      <AccessRestrictedModal 
        notice={accessDeniedNotice} 
        onClose={closeAccessDeniedNotice} 
      />

      {showTermsModal && (
        <TermsAndPrivacyPolicyModal 
          isOpen={showTermsModal} 
          onClose={() => setShowTermsModal(false)} 
        />
      )}

      <InteractiveTourGuideModal
        isOpen={showTourGuideModal}
        onClose={() => setShowTourGuideModal(false)}
        currentRole={currentRole}
      />

      <LegalComplianceHandbookModal
        isOpen={showLegalHandbook}
        onClose={() => setShowLegalHandbook(false)}
      />

      <UniversalDocumentExportModal
        isOpen={showUniversalExportModal}
        onClose={() => setShowUniversalExportModal(false)}
        initialRole={currentRole}
      />

      {/* Universal Spotlight Omnibar (Ctrl+K / Cmd+K) */}
      <UniversalSpotlightOmnibar
        isOpen={showOmnibar}
        onClose={() => setShowOmnibar(false)}
      />

    </div>
  );
};
