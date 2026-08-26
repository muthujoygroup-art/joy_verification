import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  X
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

  const roleKey = currentRole === 'employee_link' ? 'candidate' : currentRole;
  const unreadCount = (notifications || []).filter(n => n.role === roleKey && !n.isRead).length;

  const roleThemeDetails = {
    superadmin: {
      label: 'Super Admin Console',
      gradientClass: 'from-indigo-600 to-purple-600',
      badgeClass: 'badge-purple',
      icon: Crown
    },
    company: {
      label: 'Company Admin Console',
      gradientClass: 'from-sky-600 to-teal-600',
      badgeClass: 'badge-cyan',
      icon: Building2
    },
    hrexecutive: {
      label: 'HR Executive Workstation',
      gradientClass: 'from-emerald-600 to-teal-700',
      badgeClass: 'badge-emerald',
      icon: UserCheck
    },
    employee_link: {
      label: 'Employee Portal (Link)',
      gradientClass: 'from-amber-500 to-orange-600',
      badgeClass: 'badge-amber',
      icon: Smartphone
    }
  };

  const currentTheme = roleThemeDetails[currentRole] || roleThemeDetails.superadmin;
  const RoleIcon = currentTheme.icon;

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 transition-all shadow-xs relative">
        
        {/* Top Role-Specific Dual-Color Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTheme.gradientClass}`} />

        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Active Role Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
              <img 
                src="/joy_logo.png" 
                alt="JOY Logo" 
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform shrink-0" 
              />
              <div className="shrink-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-sm lg:text-base tracking-tight text-slate-900 leading-none whitespace-nowrap">
                    JOY CORPORATE SOLUTIONS
                  </h1>
                  <span className={`badge ${currentTheme.badgeClass} text-[9px] py-0.5 px-2 font-black shrink-0 whitespace-nowrap`}>
                    {currentTheme.label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1 font-bold uppercase tracking-wider whitespace-nowrap">
                  <span className="text-indigo-700 font-extrabold">Candidate Background Verification & Digital Trust</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Gateway Online
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Action Bar (>= lg screens) */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs shrink-0 whitespace-nowrap">
            
            {/* Quick Action Navigation Buttons Toolbar */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              
              {/* Return to Public Homepage */}
              <Link
                to="/"
                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-slate-700 bg-white hover:bg-slate-50 font-bold border border-slate-200 shadow-2xs transition-all whitespace-nowrap"
                title="Return to Public Homepage & Services Overview"
              >
                <Home className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Home 🌐</span>
              </Link>
              
              {/* Interactive Guided Tour Replay Button */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('launch_guided_tour'))}
                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-purple-900 bg-purple-50 hover:bg-purple-100 font-bold border border-purple-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Launch Game-Style Interactive Guided Walkthrough"
              >
                <Compass className="w-3.5 h-3.5 text-purple-700 animate-spin-slow shrink-0" />
                <span>Tour 🎮</span>
              </button>

              {/* Statutory Legal & DPDP Compliance Handbook Trigger */}
              <button
                onClick={() => setShowLegalHandbook(true)}
                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-indigo-950 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Statutory Legal & DPDP Act 2023 Compliance Framework"
              >
                <Scale className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                <span>Legal & DPDP 🛡️</span>
              </button>

              {/* Universal Date-Filtered Document & Report Export Trigger */}
              <button
                onClick={() => setShowUniversalExportModal(true)}
                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-emerald-950 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Download Date-Filtered Candidate Reports in PDF, CSV, or ZIP"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Reports 📥</span>
              </button>

              {/* Notification Center Bell Button */}
              <button
                onClick={() => setShowNotificationsModal(true)}
                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-amber-800 bg-white hover:bg-amber-50 font-bold border border-slate-200 shadow-2xs transition-all relative cursor-pointer whitespace-nowrap"
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
                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-indigo-800 bg-white hover:bg-indigo-50 font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Operational Guidelines & How-To Manual"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Guidelines</span>
              </button>

              {/* Support Ticket Raising Button */}
              <button
                onClick={() => setShowSupportModal(true)}
                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-purple-800 bg-white hover:bg-purple-50 font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Raise Support Ticket / Feedback"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Support</span>
              </button>

              {/* Legal Terms of Service & Privacy Disclosures */}
              <button
                onClick={() => setShowTermsModal(true)}
                className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-slate-800 bg-white hover:bg-slate-50 font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title="Enterprise Terms of Service, Privacy Policy & Point-in-Time Disclosures"
              >
                <Scale className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Legal</span>
              </button>
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200 shrink-0" />

            {/* Desktop Active Session Countdown Badge */}
            <div className="shrink-0">
              <ActiveSessionBadge />
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 bg-slate-100/90 px-3 h-8 rounded-xl border border-slate-200 text-xs shadow-2xs shrink-0 whitespace-nowrap">
              <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div className="text-left max-w-[150px] truncate">
                <p className="font-extrabold text-slate-900 leading-tight truncate">
                  {currentUser?.email || `${currentRole?.toUpperCase()} User`}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={logoutUser}
              className="h-8 px-3 rounded-xl flex items-center gap-1.5 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 font-bold shadow-2xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="Logout / Switch Login Context"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Action Controls (< lg screens) */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
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

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* 📱 SLIDE-DOWN MOBILE DRAWER FOR TABLET & MOBILE VIEW */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 bg-white/95 backdrop-blur-xl rounded-2xl p-4 space-y-4 shadow-xl animate-drawerSlide border border-slate-200">
            {/* User profile & Active context card */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {currentUser?.email || `${currentRole?.toUpperCase()} User`}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">{currentTheme.label}</span>
                </div>
              </div>
              <button 
                onClick={logoutUser}
                className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Quick Action Grid (2 columns on mobile) */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => { setMobileMenuOpen(false); setShowUniversalExportModal(true); }}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 flex items-center gap-2 transition-all text-left cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="truncate">Reports 📥</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowLegalHandbook(true); }}
                className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 flex items-center gap-2 transition-all text-left cursor-pointer"
              >
                <Scale className="w-4 h-4 text-indigo-700 shrink-0" />
                <span className="truncate">Legal & DPDP 🛡️</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); window.dispatchEvent(new CustomEvent('launch_guided_tour')); }}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 flex items-center gap-2 transition-all text-left cursor-pointer"
              >
                <Compass className="w-4 h-4 text-purple-700 shrink-0" />
                <span className="truncate">Tour 🎮</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowGuidelinesModal(true); }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-2 transition-all text-left cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">Guidelines 📖</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowSupportModal(true); }}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 flex items-center gap-2 transition-all text-left cursor-pointer"
              >
                <LifeBuoy className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">Support 🛟</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); setShowTermsModal(true); }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-2 transition-all text-left cursor-pointer"
              >
                <Scale className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="truncate">Terms ⚖️</span>
              </button>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 flex items-center justify-center gap-2 transition-all font-black text-center"
              >
                <Home className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Return to Homepage 🌐</span>
              </Link>
            </div>
          </div>
        )}

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
                  {c.name} ({c.companyId === 'comp-1' ? 'Acme Tech' : 'Apex Logistics'}) - [{c.status}]
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Modals placed outside header */}
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

      {/* Terms & Privacy Policy Modal */}
      {showTermsModal && (
        <TermsAndPrivacyPolicyModal 
          isOpen={showTermsModal} 
          onClose={() => setShowTermsModal(false)} 
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
        initialRole={currentRole}
      />
    </>
  );
};
