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
  Sliders,
  ChevronRight
} from 'lucide-react';

export const PortalLayout = ({ children }) => {
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

  const roleKey = currentRole === 'employee_link' ? 'candidate' : currentRole;
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

  const currentTheme = roleThemeDetails[currentRole] || roleThemeDetails.superadmin;

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
    };

    window.addEventListener('portal_nav_navigate', handleNavEvent);
    return () => window.removeEventListener('portal_nav_navigate', handleNavEvent);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans antialiased overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP LEFT-SIDE SIDEBAR NAVIGATION (FIXED ON >= lg SCREENS)           */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 min-h-screen sticky top-0 h-screen bg-white border-r border-slate-200/90 z-30 select-none shadow-xs">
        <PortalSidebarNav />
      </aside>

      {/* ========================================================================= */}
      {/* 📱 MOBILE / TABLET SLIDE-OVER DRAWER SHEET (< lg SCREENS)                 */}
      {/* ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fadeIn">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileDrawerOpen(false)} 
          />
          {/* Off-Canvas Sidebar Drawer */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slideRight">
            <PortalSidebarNav 
              isMobile 
              onCloseMobile={() => setMobileDrawerOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏛️ RIGHT-HAND MAIN WORKSPACE & CONTENT COLUMN                              */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        
        {/* TOP SLIM PORTAL WORKSPACE HEADER BAR */}
        <header className="sticky top-0 z-20 backdrop-blur-2xl bg-white/95 border-b border-slate-200/90 px-3 sm:px-6 py-2 transition-all shadow-2xs select-none">
          
          {/* Top Role Accent Strip */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${currentTheme.accentGradient}`} />

          <div className="w-full flex items-center justify-between gap-2.5">
            
            {/* Left: Mobile Drawer Trigger + Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              
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
              <Link to="/" className="lg:hidden flex items-center gap-2 shrink-0">
                <img 
                  src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                  alt="JOY Logo" 
                  className="w-7 h-7 object-contain" 
                />
                <span className="font-black text-xs text-slate-900 leading-tight hidden sm:inline">
                  JOY <span className="text-amber-500">TRUE PROFILE</span>
                </span>
              </Link>

              {/* Desktop Breadcrumb Path */}
              <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-500">
                <Link to="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Joy Verification</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className={`badge ${currentTheme.badgeClass} text-[9px] py-0.5 px-2 font-black`}>
                  {currentTheme.label}
                </span>
              </div>
            </div>

            {/* Candidate verification link token switcher (when in Candidate view) */}
            {currentRole === 'employee_link' && (
              <div className="hidden md:flex items-center gap-2 text-xs bg-amber-50/80 px-2.5 py-1 rounded-xl border border-amber-200 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-amber-900 font-bold text-[11px]">Active Candidate:</span>
                <select
                  value={selectedCandidateToken}
                  onChange={(e) => setSelectedCandidateToken(e.target.value)}
                  className="bg-white border border-amber-300 text-slate-900 rounded-lg px-2 py-0.5 text-xs outline-none focus:border-amber-500 font-mono font-bold"
                >
                  {(candidates || []).map(c => (
                    <option key={c.id} value={c.token}>
                      {c.name} ({c.companyName || 'JOY CORPORATE'}) - [{c.status}]
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Right: Quick Action Controls Toolbar */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 text-xs">
              
              {/* Quick Role Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick?.();
                    setPortalSwitcherOpen(!portalSwitcherOpen);
                  }}
                  className="h-8 px-2 sm:px-2.5 rounded-xl flex items-center gap-1 text-blue-900 bg-blue-50 hover:bg-blue-100 font-bold border border-blue-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap text-xs"
                  title="Switch Active Portal or View Other Roles"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline">Switch</span>
                  <ChevronDown className="w-3 h-3 text-blue-500 shrink-0" />
                </button>

                {portalSwitcherOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 font-sans animate-in fade-in slide-in-from-top-2 duration-150 text-left"
                    onMouseLeave={() => setPortalSwitcherOpen(false)}
                  >
                    <div className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100">
                      Switch Active Console
                    </div>
                    <Link
                      to="/login?role=superadmin"
                      onClick={() => setPortalSwitcherOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 transition-colors"
                    >
                      <Crown className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="text-xs font-bold">Super Admin</span>
                    </Link>
                    <Link
                      to="/login?role=company"
                      onClick={() => setPortalSwitcherOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-sky-50 text-slate-800 hover:text-sky-900 transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="text-xs font-bold">Company Admin</span>
                    </Link>
                    <Link
                      to="/login?role=hrexecutive"
                      onClick={() => setPortalSwitcherOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold">HR Executive</span>
                    </Link>
                    <Link
                      to="/login?role=employee_link"
                      onClick={() => setPortalSwitcherOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-amber-900 transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-xs font-bold">Candidate Portal</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Guided Tour Modal Trigger */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowTourGuideModal(true);
                  window.dispatchEvent(new CustomEvent("open_tour_guide_modal"));
                }}
                className="hidden md:flex h-8 px-2.5 rounded-xl items-center gap-1.5 text-purple-900 bg-purple-50 hover:bg-purple-100 font-bold border border-purple-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Launch Interactive Feature Walkthroughs & How-To Guides"
              >
                <Compass className="w-3.5 h-3.5 text-purple-700 animate-spin-slow shrink-0" />
                <span>Tour 🎮</span>
              </button>

              {/* Statutory Legal Handbook Trigger */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowLegalHandbook(true);
                }}
                className="hidden xl:flex h-8 px-2.5 rounded-xl items-center gap-1.5 text-indigo-950 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Statutory Legal & DPDP Act 2023 Compliance Framework"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span>Legal & DPDP 🛡️</span>
              </button>

              {/* Universal Date-Filtered Export */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowUniversalExportModal(true);
                }}
                className="h-8 px-2 sm:px-2.5 rounded-xl flex items-center gap-1 text-emerald-950 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Download Date-Filtered Candidate Reports in PDF, Excel, Word, or ZIP"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="hidden sm:inline">Reports 📥</span>
              </button>

              {/* Notifications Alert Bell */}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setShowNotificationsModal(true);
                }}
                className="h-8 px-2 sm:px-2.5 rounded-xl flex items-center gap-1 text-amber-800 bg-white hover:bg-amber-50 font-bold border border-slate-200 shadow-2xs hover:shadow-xs transition-all relative cursor-pointer whitespace-nowrap"
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
                className="hidden sm:flex h-8 px-2.5 rounded-xl items-center gap-1 text-purple-800 bg-white hover:bg-purple-50 font-bold border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
                title="Raise Support Ticket / Feedback"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Support 🛟</span>
              </button>

              {/* Active Session Badge (Visible on < lg screens where sidebar is hidden) */}
              <div className="lg:hidden shrink-0">
                <ActiveSessionBadge />
              </div>

            </div>

          </div>

          {/* Candidate token switcher helper on mobile when in Employee Portal view */}
          {currentRole === 'employee_link' && (
            <div className="mt-2 pt-2 border-t border-slate-200/80 md:hidden flex items-center justify-between gap-2 text-xs bg-amber-50/80 p-2 rounded-xl border border-amber-200">
              <span className="text-amber-900 font-semibold text-[11px] truncate">Candidate:</span>
              <select 
                value={selectedCandidateToken} 
                onChange={(e) => setSelectedCandidateToken(e.target.value)}
                className="bg-white border border-amber-300 text-slate-900 rounded-lg px-2 py-0.5 text-xs outline-none focus:border-amber-500 font-mono font-bold max-w-[200px]"
              >
                {(candidates || []).map(c => (
                  <option key={c.id} value={c.token}>
                    {c.name} - [{c.status}]
                  </option>
                ))}
              </select>
            </div>
          )}

        </header>

        {/* WORKSPACE VIEW CONTENT */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden pb-32 sm:pb-12">
          {children}
        </main>

      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE FLOATING ACTION ISLAND DOCK (< lg SCREENS)                      */}
      {/* ========================================================================= */}
      {currentRole !== 'employee_link' && (
        <div className="lg:hidden fixed bottom-3 left-3 right-3 max-w-lg mx-auto z-30 select-none animate-fadeIn">
          <div className="backdrop-blur-2xl bg-white/95 border border-slate-200/90 shadow-2xl rounded-3xl p-1.5 flex items-center justify-around gap-1">
            
            {/* 1. Home Link */}
            <Link
              to="/"
              onClick={() => soundEngine.playClick?.()}
              className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-indigo-600 active:scale-95 transition-all"
              title="Dashboard"
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-wider">Home</span>
            </Link>

            {/* 2. Reports Hub */}
            <button
              onClick={() => {
                soundEngine.playClick?.();
                setShowUniversalExportModal(true);
              }}
              className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-emerald-600 active:scale-95 transition-all cursor-pointer"
              title="Download Reports"
            >
              <Download className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-wider">Reports</span>
            </button>

            {/* 3. Center Vibrant Action Button */}
            <button
              onClick={() => {
                soundEngine.playClick?.();
                window.dispatchEvent(new CustomEvent('launch_guided_tour'));
              }}
              className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-lg shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white flex items-center justify-center shrink-0"
              title="Interactive Guided Tour"
            >
              <Compass className="w-5 h-5 animate-spin-slow text-amber-300" />
            </button>

            {/* 4. Real-time Alerts */}
            <button
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
      )}

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

    </div>
  );
};
