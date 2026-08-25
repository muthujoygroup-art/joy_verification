import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupportTicketModal } from './SupportTicketModal';
import { HelpGuidelinesModal } from './HelpGuidelinesModal';
import { CustomReportBuilderModal } from './CustomReportBuilderModal';
import { NotificationCenterModal } from './NotificationCenterModal';
import { ActiveSessionBadge } from './ActiveSessionBadge';
import { TermsAndPrivacyPolicyModal } from './TermsAndPrivacyPolicyModal';
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
  Scale
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, currentRole, logoutUser, candidates, selectedCandidateToken, setSelectedCandidateToken, notifications } = useApp();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b border-slate-200/80 px-4 lg:px-8 py-2.5 transition-all shadow-xs relative">
        
        {/* Top Role-Specific Dual-Color Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTheme.gradientClass}`} />

        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-3">
          
          {/* Brand Logo & Active Role Badge */}
          <div className="flex items-center justify-between w-full xl:w-auto gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${currentTheme.gradientClass} p-[2px] shadow-sm flex-shrink-0`}>
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <RoleIcon className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base lg:text-lg tracking-tight text-slate-900 leading-none">
                    JOY DATA VERIFICATION
                  </h1>
                  <span className={`badge ${currentTheme.badgeClass} text-[9px] py-0.5 px-2`}>
                    {currentTheme.label}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                  <span>Enterprise Verification System</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Govt Gateway Online
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Session Badge (visible on small screens) */}
            <div className="xl:hidden">
              <ActiveSessionBadge />
            </div>
          </div>

          {/* Action Bar & Profile Suite */}
          <div className="flex items-center gap-2 flex-wrap justify-center xl:justify-end w-full xl:w-auto text-xs">
            
            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/80">
              {/* Notification Center Bell Button */}
              <button
                onClick={() => setShowNotificationsModal(true)}
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-amber-800 bg-white hover:bg-amber-50 font-bold border border-slate-200 shadow-2xs transition-all relative"
                title="Real-Time Notifications & System Alerts"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
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
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-indigo-800 bg-white hover:bg-indigo-50 font-bold border border-slate-200 shadow-2xs transition-all"
                title="Operational Guidelines & How-To Manual"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Guidelines</span>
              </button>

              {/* Custom Report Generator Hub Button */}
              <button
                onClick={() => setShowCustomReportModal(true)}
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-emerald-800 bg-white hover:bg-emerald-50 font-bold border border-slate-200 shadow-2xs transition-all"
                title="Generate Custom Multi-Filter Reports"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reports</span>
              </button>

              {/* Support Ticket Raising Button */}
              <button
                onClick={() => setShowSupportModal(true)}
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-purple-800 bg-white hover:bg-purple-50 font-bold border border-slate-200 shadow-2xs transition-all"
                title="Raise Support Ticket / Feedback"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-purple-600" />
                <span>Support</span>
              </button>

              {/* Legal Terms of Service & Privacy Disclosures */}
              <button
                onClick={() => setShowTermsModal(true)}
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-800 bg-white hover:bg-slate-50 font-bold border border-slate-200 shadow-2xs transition-all"
                title="Enterprise Terms of Service, Privacy Policy & Point-in-Time Disclosures"
              >
                <Scale className="w-3.5 h-3.5 text-slate-600" />
                <span>Legal</span>
              </button>
            </div>

            {/* Desktop Active Session Badge */}
            <div className="hidden xl:block">
              <ActiveSessionBadge />
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <div className="text-left max-w-[140px] truncate">
                <p className="font-extrabold text-slate-900 leading-tight truncate">
                  {currentUser?.email || `${currentRole?.toUpperCase()} User`}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={logoutUser}
              className="px-3 py-1.5 flex items-center gap-1 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 font-bold rounded-xl shadow-2xs transition-all"
              title="Logout / Switch Login Context"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* Candidate token switcher helper when in Employee Portal view */}
        {currentRole === 'employee_link' && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-center gap-3 text-xs bg-amber-50/80 p-2 rounded-xl border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-amber-900 font-semibold">Candidate Verification Link:</span>
            <select 
              value={selectedCandidateToken} 
              onChange={(e) => setSelectedCandidateToken(e.target.value)}
              className="bg-white border border-amber-300 text-slate-900 rounded-lg px-2 py-1 text-xs outline-none focus:border-amber-500 font-mono font-bold"
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
    </>
  );
};
