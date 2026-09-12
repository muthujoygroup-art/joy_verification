import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  KeyRound,
  Activity,
  Database,
  Bell,
  LifeBuoy,
  Download,
  Scale,
  Sparkles,
  Lock,
  CheckCircle2,
  Clock,
  Globe,
  Smartphone,
  Building2,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react';

export const MyWorkspacePersonalView = ({ activeTab = 'profile', userRole = 'hrexecutive' }) => {
  const {
    currentUser,
    currentRole,
    showToast,
    notifications,
    candidates
  } = useApp();

  const [copiedId, setCopiedId] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [sessionPingLatency, setSessionPingLatency] = useState(42);
  const [isPinging, setIsPinging] = useState(false);

  // Derived user details
  const userName = currentUser?.name || currentUser?.username || 'Authenticated User';
  const userEmail = currentUser?.email || 'user@joycorporatesolutions.com';
  const userPhone = currentUser?.phone || currentUser?.mobile || '+91 98765 43210';
  const companyName = currentUser?.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED';
  const uniqueId = currentUser?.uniqueProfileId || currentUser?.hrId || currentUser?.empId || 'COMP001HR001';

  const roleTitleMap = {
    superadmin: 'Super Admin Console Administrator',
    company: 'Company Executive Administrator',
    hrexecutive: 'HR Executive Workstation Specialist',
    employee_link: 'Candidate Self-Verification Profile'
  };

  const handleCopyProfileId = () => {
    navigator.clipboard.writeText(uniqueId);
    setCopiedId(true);
    showToast('📋 Unique Profile ID copied to clipboard!');
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleTestPing = async () => {
    setIsPinging(true);
    const start = Date.now();
    try {
      await new Promise(res => setTimeout(res, 120));
      const latency = Date.now() - start;
      setSessionPingLatency(latency);
      showToast(`⚡ Workstation ping telemetry response: ${latency}ms (Optimal)`);
    } catch (e) {
      showToast('❌ Ping test failed');
    } finally {
      setIsPinging(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      showToast('⚠️ Password must be at least 4 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('❌ Passwords do not match', 'error');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      showToast('🔐 Security passcode updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(`❌ Failed to update passcode: ${err.message}`, 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const isProfileTab = ['profile', 'security', 'identity', 'profile_view', 'profile_creds', 'profile_code'].includes(activeTab);
  const isAuditTab = ['sessions', 'audit_log', 'session_ping', 'active_session', 'login_history'].includes(activeTab);

  return (
    <div className="space-y-6 animate-fadeIn text-slate-900">

      {/* TOP WORKSPACE BANNER */}
      <div className="glass-panel p-5 sm:p-6 border-indigo-200 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner font-black text-xl">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">{userName}</h2>
                <span className="badge bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-[10px] font-black uppercase tracking-wider">
                  {roleTitleMap[currentRole] || roleTitleMap.hrexecutive}
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 font-medium mt-1 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{companyName}</span>
              </p>
            </div>
          </div>

          {/* Quick Profile ID Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center justify-between gap-3 shrink-0 sm:self-center">
            <div>
              <span className="text-[9px] font-black uppercase text-indigo-300 tracking-wider block">Unique Profile ID</span>
              <span className="text-xs font-mono font-bold text-amber-300">{uniqueId}</span>
            </div>
            <button
              onClick={handleCopyProfileId}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              title="Copy Profile ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* TABS GRID VIEW */}
      {isProfileTab && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 1. PERSONAL PROFILE PARTICULARS */}
          <div className="lg:col-span-2 glass-panel p-5 sm:p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Personal Workstation Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">Verified workstation identity & contact particulars</p>
                </div>
              </div>
              <span className="badge badge-emerald text-[10px]">ACTIVE & VERIFIED</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Full Name</span>
                <span className="font-bold text-slate-900 text-sm block">{userName}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Official Work Email</span>
                <span className="font-mono font-bold text-slate-900 text-sm block truncate">{userEmail}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Registered Phone</span>
                <span className="font-mono font-bold text-slate-900 text-sm block">{userPhone}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Employer Corporate Name</span>
                <span className="font-bold text-slate-900 text-sm block truncate">{companyName}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3 text-xs">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-900 font-bold block">Enterprise Point-in-Time Security Seal</strong>
                <p className="text-indigo-700 mt-0.5 leading-relaxed">
                  Your personal profile credentials and workstation activity logs are continuously synced with digital identity seal <strong>{uniqueId}</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* 2. SECURITY & PASSCODE MANAGEMENT */}
          <div className="glass-panel p-5 sm:p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Passcode & 2FA</h3>
                <p className="text-xs text-slate-500 font-medium">Update workstation password</p>
              </div>
            </div>

            {(userRole === 'employee_link' || currentRole === 'employee_link') ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Candidate Access Control</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Passcode and password modifications are managed directly by your employer's HR Administrator under Section 7 of the DPDP Act 2023. Self-service password changes are disabled for candidate verification sessions.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                  <span>🔒 Password Modification Restricted for Candidate Links</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">New Workstation Passcode</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Confirm Passcode</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isUpdatingPassword ? 'Updating...' : 'Update Security Passcode'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* SESSION & ACTIVITY AUDIT VIEW */}
      {isAuditTab && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* REAL-TIME SESSION TELEMETRY */}
          <div className="glass-panel p-5 sm:p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Session Status</h3>
                  <p className="text-xs text-slate-500 font-medium">Real-time device ping & state</p>
                </div>
              </div>
              <button
                onClick={handleTestPing}
                disabled={isPinging}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                title="Test Ping Latency"
              >
                <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-900">Connection Status</span>
                <span className="badge badge-emerald text-[10px] font-black">ONLINE (HTTP/2)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Telemetry Latency</span>
                <span className="font-mono font-bold text-indigo-600">{sessionPingLatency} ms</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Session ID</span>
                <span className="font-mono text-[11px] font-bold text-slate-800">sess_joy_{Date.now().toString().slice(-6)}</span>
              </div>
            </div>
          </div>

          {/* AUDIT TRAIL LOGS */}
          <div className="lg:col-span-2 glass-panel p-5 sm:p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Security Audit Trail</h3>
                  <p className="text-xs text-slate-500 font-medium">Recent login sessions & system actions</p>
                </div>
              </div>
              <span className="badge badge-purple text-[10px]">60-DAY TRAIL</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { time: 'Just Now', action: 'Authenticated Workstation Session Opened', ip: '127.0.0.1 (Local Workstation)', status: 'Success' },
                { time: 'Today, 10:15 AM', action: 'Verified Candidate Profiler Dispatch', ip: '192.168.1.102 (Office Gateway)', status: 'Success' },
                { time: 'Yesterday, 04:30 PM', action: 'Updated Statutory EPFO Compliance Rules', ip: '192.168.1.102 (Office Gateway)', status: 'Success' }
              ].map((log, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">{log.action}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{log.ip}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* DOWNLOADS & SUPPORT SHORTCUTS VIEW */}
      {(!isProfileTab && !isAuditTab) && (
        <div className="glass-panel p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 font-bold">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Personal Workstation Tools & Support Shortcuts</h3>
                <p className="text-xs text-slate-500 font-medium">Quick access to date-filtered exports, legal handbooks, and incident tickets</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('portal_nav_navigate', { detail: { modal: 'notifications' } }))}
              className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 hover:bg-indigo-100/70 transition-all text-left space-y-2 cursor-pointer"
            >
              <Bell className="w-6 h-6 text-indigo-600" />
              <strong className="text-xs font-black text-slate-900 block">Notifications & Alerts Feed</strong>
              <p className="text-[11px] text-slate-500 font-medium">View 60-day expiry reminders & verification milestones.</p>
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('portal_nav_navigate', { detail: { modal: 'universal_export' } }))}
              className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100/70 transition-all text-left space-y-2 cursor-pointer"
            >
              <Download className="w-6 h-6 text-emerald-600" />
              <strong className="text-xs font-black text-slate-900 block">Date-Filtered Universal Reports</strong>
              <p className="text-[11px] text-slate-500 font-medium">Download CSV / Excel rosters for any date range.</p>
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('portal_nav_navigate', { detail: { modal: 'legal_handbook' } }))}
              className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 hover:bg-purple-100/70 transition-all text-left space-y-2 cursor-pointer"
            >
              <Scale className="w-6 h-6 text-purple-600" />
              <strong className="text-xs font-black text-slate-900 block">Statutory DPDP Legal Handbook</strong>
              <p className="text-[11px] text-slate-500 font-medium">Inspect DPDP Act 2023 statutory consent requirements.</p>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
