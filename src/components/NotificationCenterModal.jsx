import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { EmployeeProfileDossierModal } from './EmployeeProfileDossierModal';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings, 
  ShieldCheck, 
  Building2, 
  Users, 
  UserCheck, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  X,
  CreditCard,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react';

export const NotificationCenterModal = ({ onClose }) => {
  const { 
    currentRole, 
    notifications, 
    notificationPreferences, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications, 
    updateNotificationPreferences,
    candidates,
    dispatchReVerificationLink,
    showToast,
    setRoleView
  } = useApp();

  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'feed' | 'settings'
  const [feedCategoryFilter, setFeedCategoryFilter] = useState('all'); // 'all' | 'expiry' | 'verification' | 'billing' | 'system'
  const [dossierCandidate, setDossierCandidate] = useState(null);

  // Map employee_link role to candidate
  const roleKey = currentRole === 'employee_link' ? 'candidate' : currentRole;
  
  const roleFeed = notifications.filter(n => n.role === roleKey);
  const unreadCount = roleFeed.filter(n => !n.isRead).length;
  const rolePrefs = notificationPreferences[roleKey] || { whatsapp: true, email: true, sms: true, inAppSound: true };

  // Filtered by category
  const filteredFeed = roleFeed.filter(n => {
    if (feedCategoryFilter === 'all') return true;
    if (feedCategoryFilter === 'expiry') return n.category === 'expiry';
    if (feedCategoryFilter === 'verification') return n.category === 'verification' || n.category === 'candidate';
    if (feedCategoryFilter === 'billing') return n.category === 'billing';
    if (feedCategoryFilter === 'system') return n.category === 'system' || n.category === 'company';
    return true;
  });

  const expiryCount = roleFeed.filter(n => n.category === 'expiry').length;

  const roleTitleMap = {
    superadmin: 'Super Admin Governance Console',
    company: 'Company Admin Executive Console',
    hr: 'HR Executive Onboarding Workstation',
    candidate: 'Candidate Verification Portal'
  };

  const handleDownloadDossierForToken = (token) => {
    const cand = candidates.find(c => c.token === token);
    if (cand) {
      setDossierCandidate(cand);
    } else {
      showToast('Candidate record loaded.', 'info');
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div 
          className="glass-panel w-full max-w-2xl max-h-[92vh] flex flex-col border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl relative z-10 overflow-hidden my-auto animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border-b border-slate-100 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-800 font-bold relative shadow-sm">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">Notifications & Alert Center</h2>
                  <span className="badge badge-purple text-[10px]">{roleTitleMap[roleKey]}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Real-time 60-day certificate expiry reminders, verification milestones & SLA alerts</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 hover:bg-slate-100 rounded-lg cursor-pointer">✕</button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'feed' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Live Alerts ({roleFeed.length})</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black">{unreadCount} New</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Channel Preferences ⚙️</span>
              </button>
            </div>

            {activeTab === 'feed' && roleFeed.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-bold">
                <button 
                  onClick={() => markAllNotificationsAsRead(roleKey)} 
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  title="Mark all alerts as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
                <span className="text-slate-300">•</span>
                <button 
                  onClick={() => clearAllNotifications(roleKey)} 
                  className="text-rose-500 hover:text-rose-700 flex items-center gap-1"
                  title="Clear notification feed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: LIVE ALERTS FEED */}
          {activeTab === 'feed' && (
            <div className="space-y-3">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
                <button
                  onClick={() => setFeedCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    feedCategoryFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Alerts ({roleFeed.length})
                </button>

                {expiryCount > 0 && (
                  <button
                    onClick={() => setFeedCategoryFilter('expiry')}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                      feedCategoryFilter === 'expiry' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>⏳ 60-Day Expiry ({expiryCount})</span>
                  </button>
                )}

                <button
                  onClick={() => setFeedCategoryFilter('verification')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    feedCategoryFilter === 'verification' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  👥 Candidates
                </button>

                <button
                  onClick={() => setFeedCategoryFilter('billing')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    feedCategoryFilter === 'billing' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  💳 Billing
                </button>

                <button
                  onClick={() => setFeedCategoryFilter('system')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    feedCategoryFilter === 'system' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🚨 System SLA
                </button>
              </div>

              {/* Feed List */}
              <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
                {filteredFeed.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 space-y-2">
                    <Bell className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-bold text-xs text-slate-700">No active notifications in this category!</p>
                    <p className="text-[11px]">All verification milestones, 60-day expiry reminders, and gateway alerts will appear here in real time.</p>
                  </div>
                ) : (
                  filteredFeed.map(item => (
                    <div 
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                        item.category === 'expiry'
                          ? 'bg-amber-50/60 border-amber-300 shadow-2xs'
                          : item.isRead 
                            ? 'bg-slate-50 border-slate-200 opacity-80' 
                            : 'bg-indigo-50/40 border-indigo-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${item.isRead ? 'bg-slate-300' : 'bg-indigo-600 animate-ping'}`} />
                            <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{item.title}</span>
                            </h4>
                            <span className={`badge text-[9px] py-0 px-1.5 ${
                              item.priority === 'critical' ? 'badge-rose' : item.priority === 'high' ? 'badge-amber' : 'badge-indigo'
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-slate-700 text-xs pl-4 font-medium leading-relaxed">{item.message}</p>
                          <div className="text-[10px] text-slate-400 pl-4 font-mono flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{item.timestamp}</span>
                          </div>
                        </div>

                        {!item.isRead && (
                          <button
                            onClick={() => markNotificationAsRead(item.id)}
                            className="text-indigo-600 hover:text-indigo-900 bg-white p-1.5 rounded-lg border border-indigo-200 shadow-2xs shrink-0"
                            title="Mark as Read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Interactive Quick Action Buttons */}
                      <div className="pl-4 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                        
                        {/* 60-Day Expiry Specific Actions */}
                        {item.category === 'expiry' && item.candidateToken && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDownloadDossierForToken(item.candidateToken)}
                              className="btn btn-company text-[11px] py-1 px-2.5 flex items-center gap-1 font-bold shadow-2xs"
                            >
                              <FileText className="w-3 h-3" />
                              <span>📥 Download 4-Page Dossier Backup</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                dispatchReVerificationLink(item.candidateToken);
                                markNotificationAsRead(item.id);
                              }}
                              className="btn btn-superadmin text-[11px] py-1 px-2.5 flex items-center gap-1 font-bold shadow-2xs"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>🔄 Dispatch Re-Verification Link</span>
                            </button>
                          </>
                        )}

                        {/* General Candidate Inspection */}
                        {item.category === 'verification' && item.candidateToken && (
                          <button
                            type="button"
                            onClick={() => handleDownloadDossierForToken(item.candidateToken)}
                            className="text-[11px] font-bold text-indigo-700 hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Verified Certificate</span>
                          </button>
                        )}

                        {/* General Billing Action */}
                        {item.category === 'billing' && (
                          <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>PostgreSQL Ledger Synced</span>
                          </span>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 2: CHANNEL PREFERENCES */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 font-medium">
                Configure real-time dispatch channels for <strong>{roleTitleMap[roleKey]}</strong>.
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold block text-slate-900">WhatsApp Cloud Alerts</span>
                      <span className="text-[11px] text-slate-500">Dispatch 60-day expiry notices & verification token links via WhatsApp</span>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={rolePrefs.whatsapp}
                    onChange={(e) => updateNotificationPreferences(roleKey, { whatsapp: e.target.checked })}
                    className="accent-indigo-600 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="font-bold block text-slate-900">SMTP Email Digest</span>
                      <span className="text-[11px] text-slate-500">Weekly PDF certificate expiry audits & monthly invoicing summaries</span>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={rolePrefs.email}
                    onChange={(e) => updateNotificationPreferences(roleKey, { email: e.target.checked })}
                    className="accent-indigo-600 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="font-bold block text-slate-900">Carrier SMS Gateway</span>
                      <span className="text-[11px] text-slate-500">Urgent SMS dispatch when certificate is within 3 days of expiry</span>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={rolePrefs.sms}
                    onChange={(e) => updateNotificationPreferences(roleKey, { sms: e.target.checked })}
                    className="accent-indigo-600 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>

      {/* Dossier Modal when triggered from Notifications */}
      {dossierCandidate && (
        <EmployeeProfileDossierModal
          candidate={dossierCandidate}
          onClose={() => setDossierCandidate(null)}
        />
      )}
    </>
  );
};

