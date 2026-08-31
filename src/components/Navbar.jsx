import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SupportTicketModal } from './SupportTicketModal';
import { HelpGuidelinesModal } from './HelpGuidelinesModal';
import { CustomReportBuilderModal } from './CustomReportBuilderModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { ActiveSessionBadge } from './ActiveSessionBadge';
import { TermsAndPrivacyPolicyModal } from './TermsAndPrivacyPolicyModal';
import { LegalComplianceHandbookModal } from './LegalComplianceHandbookModal';
import { UniversalDocumentExportModal } from './UniversalDocumentExportModal';
import { 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Smartphone, 
  Activity, 
  LogOut, 
  User, 
  Crown, 
  Sparkles, 
  LifeBuoy, 
  BookOpen, 
  FileDown, 
  Bell, 
  Scale, 
  Compass, 
  Home, 
  Download,
  Menu,
  X,
  PlusCircle,
  FolderLock,
  Layers,
  ChevronRight,
  Sliders
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, currentRole, logoutUser, candidates, selectedCandidateToken, setSelectedCandidateToken, notifications } = useApp();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showUniversalExportModal, setShowUniversalExportModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const roleKey = currentRole === 'employee_link' ? 'candidate' : currentRole;
  const unreadCount = (notifications || []).filter(n => n.role === roleKey && !n.isRead).length;

  const roleThemeDetails = {
    superadmin: {
      label: 'Super Admin Console',
      gradientClass: 'from-indigo-600 to-purple-600',
      badgeClass: 'badge-purple',
      icon: Crown,
      btnClass: 'bg-indigo-600 text-white shadow-indigo-500/30'
    },
    company: {
      label: 'Company Admin Console',
      gradientClass: 'from-sky-600 to-teal-600',
      badgeClass: 'badge-cyan',
      icon: Building2,
      btnClass: 'bg-sky-600 text-white shadow-sky-500/30'
    },
    hrexecutive: {
      label: 'HR Executive Workstation',
      gradientClass: 'from-emerald-600 to-teal-700',
      badgeClass: 'badge-emerald',
      icon: UserCheck,
      btnClass: 'bg-emerald-600 text-white shadow-emerald-500/30'
    },
    employee_link: {
      label: 'Employee Portal (Link)',
      gradientClass: 'from-amber-500 to-orange-600',
      badgeClass: 'badge-amber',
      icon: Smartphone,
      btnClass: 'bg-amber-600 text-white shadow-amber-500/30'
    }
  };

  const currentTheme = roleThemeDetails[currentRole] || roleThemeDetails.superadmin;
  const RoleIcon = currentTheme.icon;

  return (
    <>
      {/* ========================================================================= */}
      {/* 🖥️ TOP DESKTOP & TABLET HEADER BAR                                        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/95 border-b border-slate-200/90 px-3 sm:px-6 lg:px-8 py-2 transition-all shadow-xs relative select-none">
        
        {/* Top Role-Specific Dual-Color Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTheme.gradientClass}`} />

        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-3">
          
          {/* Brand Logo & Active Role Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0">
              <div className="relative shrink-0">
                <img 
                  src="/joy_logo.png" 
                  alt="JOY Logo" 
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform" 
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" title="Gateway Online" />
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="font-black text-sm sm:text-base tracking-tight text-slate-900 leading-none whitespace-nowrap">
                    JOY CORPORATE SOLUTIONS
                  </h1>
                  <span className={`badge ${currentTheme.badgeClass} text-[8.5px] sm:text-[9px] py-0.5 px-2 font-black shrink-0 whitespace-nowrap hidden sm:inline-flex`}>
                    {currentTheme.label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 hidden lg:flex items-center gap-2 mt-1 font-bold uppercase tracking-wider whitespace-nowrap">
                  <span className="text-indigo-800 font-extrabold">Enterprise Identity & 360° BGV Platform</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    ISO 27001 & DPDP Gateway
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Action Bar (>= lg screens) */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs shrink-0 whitespace-nowrap">
            
            {/* Grouped Action Navigation Pill Toolbar */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shadow-2xs">
              
              {/* Return to Public Homepage */}
              <Link
                to="/"
                className="h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-slate-700 bg-white hover:bg-slate-50 font-bold border border-slate-200 shadow-2xs hover:shadow-sm transition-all whitespace-nowrap"
                title="Return to Public Homepage"
              >
                <Home className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Home 🌐</span>
              </Link>
              
              {/* Interactive Guided Tour Replay Button */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('launch_guided_tour'))}
                className="h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-purple-900 bg-purple-50 hover:bg-purple-100 font-bold border border-purple-200 shadow-2xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                title="Launch Game-Style Interactive Guided Walkthrough"
              >
                <Compass className="w-3.5 h-3.5 text-purple-700 animate-spin-slow shrink-0" />
                <span>Tour 🎮</span>
              </button>

              {/* Statutory Legal & DPDP Compliance Handbook Trigger */}
              <button
                onClick={() => setShowLegalHandbook(true)}
                className="h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-indigo-950 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200 shadow-2xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                title="Statutory Legal & DPDP Act 2023 Compliance Framework"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span>Legal & DPDP 🛡️</span>
              </button>

              {/* Universal Date-Filtered Document & Report Export Trigger */}
              <button
                onClick={() => setShowUniversalExportModal(true)}
                className="h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-emerald-950 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-200 shadow-2xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                title="Download Date-Filtered Candidate Reports in PDF, CSV, or ZIP"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Reports 📥</span>
              </button>

              {/* Notification Center Bell Button */}
              <button
                onClick={() => setShowNotificationsModal(true)}
                className="h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-amber-800 bg-white hover:bg-amber-50 font-bold border border-slate-200 shadow-2xs hover:shadow-sm transition-all relative cursor-pointer whitespace-nowrap"
                title="Real-Time Notifications & System Alerts"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Alerts</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Help Guidelines Button */}
              <button
                onClick={() => setShowGuidelinesModal(true)}
                className="h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-indigo-800 bg-white hover:bg-indigo-50 font-bold border border-slate-200 shadow-2xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                title="Operational Guidelines & How-To Manual"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Guidelines</span>
              </button>

              {/* Support Ticket Raising Button */}
              <button
                onClick={() => setShowSupportModal(true)}
                className="h-8 px-2.5 rounded-xl flex items-center gap-1.5 text-purple-800 bg-white hover:bg-purple-50 font-bold border border-slate-200 shadow-2xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
                title="Raise Support Ticket / Feedback"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Support</span>
              </button>
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200 shrink-0" />

            {/* Desktop Active Session Countdown Badge */}
            <div className="shrink-0">
              <ActiveSessionBadge />
            </div>

            {/* User Profile Pill with Unique Profile Code */}
            <div className="flex items-center gap-2 bg-slate-100/90 px-3 h-8 rounded-xl border border-slate-200 text-xs shadow-2xs shrink-0 whitespace-nowrap">
              <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div className="text-left max-w-[180px] truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 leading-tight truncate">
                    {currentUser?.name || currentUser?.email || 'User'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 font-mono font-black text-[9px] border border-indigo-200">
                    {currentRole === 'superadmin' ? 'SUPERADMIN' : (currentUser?.uniqueProfileId || currentUser?.employeeCode || currentUser?.hrCode || currentUser?.code || (currentRole === 'company' ? 'COMP001' : currentRole === 'hrexecutive' ? 'COMP001HR001' : 'COMP001EMP001'))}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={logoutUser}
              className="h-8 px-3 rounded-xl flex items-center gap-1.5 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 font-bold shadow-2xs hover:shadow-sm transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="Logout / Switch Login Context"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>

          {/* Top Mobile Controls (< lg screens) */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            <ActiveSessionBadge />
            
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="p-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all relative cursor-pointer"
              title="Alerts"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[8px] font-black animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                mobileMenuOpen 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200'
              }`}
              title="Toggle Menu Sheet"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Candidate token switcher helper when in Employee Portal view */}
        {currentRole === 'employee_link' && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-center gap-2 sm:gap-3 text-xs bg-amber-50/80 p-2 rounded-xl border border-amber-200 flex-wrap">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-amber-900 font-semibold text-[11px] sm:text-xs">Candidate Verification Link:</span>
            <select 
              value={selectedCandidateToken} 
              onChange={(e) => setSelectedCandidateToken(e.target.value)}
              className="bg-white border border-amber-300 text-slate-900 rounded-lg px-2 py-1 text-[11px] sm:text-xs outline-none focus:border-amber-500 font-mono font-bold max-w-[200px] sm:max-w-none"
            >
              {(candidates || []).map(c => (
                <option key={c.id} value={c.token}>
                  {c.name} ({c.companyName || 'JOY CORPORATE SOLUTIONS'}) - [{c.status}]
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 📱 INNOVATIVE FLOATING BOTTOM ISLAND DOCK (MOBILE & TABLET < 1024px)       */}
      {/* ========================================================================= */}
      {currentRole !== 'employee_link' && (
        <div className="lg:hidden fixed bottom-3 left-3 right-3 max-w-lg mx-auto z-30 select-none animate-fadeIn">
          <div className="backdrop-blur-2xl bg-white/95 border border-slate-200/90 shadow-2xl rounded-3xl p-1.5 flex items-center justify-around gap-1">
            
            {/* 1. Dashboard / Home Tab */}
            <Link
              to="/"
              className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-indigo-600 active:scale-95 transition-all"
              title="Dashboard"
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-wider">Home</span>
            </Link>

            {/* 2. Universal Reports Hub */}
            <button
              onClick={() => setShowUniversalExportModal(true)}
              className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-600 hover:text-emerald-600 active:scale-95 transition-all cursor-pointer"
              title="Download Reports"
            >
              <Download className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-wider">Reports</span>
            </button>

            {/* 3. Center Vibrant Action Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('launch_guided_tour'))}
              className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-lg shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white flex items-center justify-center shrink-0"
              title="Interactive Guided Tour"
            >
              <Compass className="w-5 h-5 animate-spin-slow text-amber-300" />
            </button>

            {/* 4. Real-time Alerts */}
            <button
              onClick={() => setShowNotificationsModal(true)}
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

            {/* 5. More Menu Sheet Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
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
      {/* 📱 SLIDE-UP MOBILE SHEET DRAWER (MODAL OVERLAY)                           */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 animate-slideUp max-h-[85vh] overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                  <RoleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">{currentTheme.label}</h3>
                  <p className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">
                    {currentUser?.email || 'Authenticated User'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => { setMobileMenuOpen(false); setShowUniversalExportModal(true); }}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 flex items-center gap-2.5 transition-all text-left shadow-2xs"
              >
                <Download className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="truncate">Download Reports 📥</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowLegalHandbook(true); }}
                className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 flex items-center gap-2.5 transition-all text-left shadow-2xs"
              >
                <Scale className="w-4 h-4 text-indigo-700 shrink-0" />
                <span className="truncate">Legal & DPDP 🛡️</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowCustomReportModal(true); }}
                className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200 flex items-center gap-2.5 transition-all text-left shadow-2xs"
              >
                <Sliders className="w-4 h-4 text-sky-700 shrink-0" />
                <span className="truncate">Report Builder 📊</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); window.dispatchEvent(new CustomEvent('launch_guided_tour')); }}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 flex items-center gap-2.5 transition-all text-left shadow-2xs"
              >
                <Compass className="w-4 h-4 text-purple-700 shrink-0" />
                <span className="truncate">Guided Tour 🎮</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowGuidelinesModal(true); }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-2.5 transition-all text-left shadow-2xs"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Guidelines 📖</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowSupportModal(true); }}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 flex items-center gap-2.5 transition-all text-left shadow-2xs"
              >
                <LifeBuoy className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">Raise Ticket 🛟</span>
              </button>
            </div>

            {/* Logout and Terms Row */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => { setMobileMenuOpen(false); setShowTermsModal(true); }}
                className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 text-[11px]"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Terms & Privacy</span>
              </button>

              <button
                onClick={logoutUser}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📦 GLOBAL MODALS                                                          */}
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

      {showGuidelinesModal && (
        <HelpGuidelinesModal onClose={() => setShowGuidelinesModal(false)} />
      )}

      {showTermsModal && (
        <TermsAndPrivacyPolicyModal 
          isOpen={showTermsModal} 
          onClose={() => setShowTermsModal(false)} 
        />
      )}

      <LegalComplianceHandbookModal
        isOpen={showLegalHandbook}
        onClose={() => setShowLegalHandbook(false)}
      />

      <UniversalDocumentExportModal
        isOpen={showUniversalExportModal}
        onClose={() => setShowUniversalExportModal(false)}
        initialRole={currentRole}
      />
    </>
  );
};
