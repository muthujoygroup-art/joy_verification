import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Compass, 
  Search, 
  Sparkles, 
  UserPlus, 
  Mail, 
  MessageSquare, 
  CreditCard, 
  Bell, 
  LifeBuoy, 
  Building2, 
  Sliders, 
  FileDown, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  X, 
  Play, 
  HelpCircle,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InteractiveTourGuideModal = ({ 
  isOpen = false, 
  onClose, 
  onSelectAction, 
  currentRole = 'company' 
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTopicId, setExpandedTopicId] = useState(null);

  React.useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    const handleOpen = () => {
      setInternalOpen(true);
    };
    window.addEventListener('open_tour_guide_modal', handleOpen);
    return () => window.removeEventListener('open_tour_guide_modal', handleOpen);
  }, []);

  const isModalVisible = isOpen || internalOpen;
  if (!isModalVisible) return null;

  const handleModalClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
  };

  const { currentRole: appRole } = useApp();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const isCandidateRoute = path.includes('/verify') || path.includes('/employee') || path.startsWith('/candidate');
  const activeRole = (isCandidateRoute || appRole === 'employee_link') ? 'employee_link' : (currentRole || appRole || 'superadmin');

  // Role-Specific Dynamic Tour Topics
  const getRoleTourTopics = () => {
    if (activeRole === 'superadmin') {
      return [
        {
          id: 'superadmin_overview',
          title: '👑 Super Admin Master Console Overview',
          category: 'governance',
          badge: 'SUPERADMIN',
          badgeClass: 'badge-purple',
          icon: Crown,
          summary: 'Master control dashboard for managing platform tenants, overall system health, and database metrics.',
          steps: [
            '1. View total registered companies, overall verification volume, and active subscriber contracts.',
            '2. Monitor live system health, API gateway latencies, and server status.',
            '3. Inspect master revenue telemetry and metered consumption analytics.'
          ],
          actionLabel: 'Explore Master Console 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'omnisearch' }
        },
        {
          id: 'superadmin_onboard',
          title: '🏢 Onboarding New Client Companies & Setting Quotas',
          category: 'governance',
          badge: 'TENANT MGMT',
          badgeClass: 'badge-indigo',
          icon: Building2,
          summary: 'Register new corporate accounts, issue company codes (COMP001), and allocate verification credits.',
          steps: [
            '1. Click "+ Onboard Company" button at top or open Companies tab.',
            '2. Fill company legal name, CIN, GSTIN, and primary contact email.',
            '3. Assign initial verification check credit quotas (e.g. 1000 checks).',
            '4. Submit form - tenant database entries and admin access credentials are issued instantly!'
          ],
          actionLabel: 'Open Company Onboarding Form 🚀',
          actionPayload: { type: 'open_modal', modal: 'onboard_company' }
        },
        {
          id: 'superadmin_db',
          title: '🗄️ Real-Time PostgreSQL Telemetry & System Error Logs',
          category: 'governance',
          badge: 'DATABASE',
          badgeClass: 'badge-cyan',
          icon: Sliders,
          summary: 'Audit live database tables, check connection pools, and monitor client error logs.',
          steps: [
            '1. Go to "Database & Telemetry" tab in the SuperAdmin console.',
            '2. Check active PostgreSQL connections, table record counts, and migration status.',
            '3. Inspect real-time client error trace logs for troubleshooting.'
          ],
          actionLabel: 'View Database Telemetry 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'database' }
        }
      ];
    }

    if (activeRole === 'employee_link') {
      return [
        {
          id: 'cand_quickstart',
          title: '🚀 Candidate Self-Verification Quickstart Guide',
          category: 'onboarding',
          badge: 'CANDIDATE PORTAL',
          badgeClass: 'badge-amber',
          icon: Compass,
          summary: 'Step-by-step walkthrough to complete your employee background verification in under 3 minutes.',
          steps: [
            'Step 1: Read the Onboarding Advisory Guidelines before starting.',
            'Step 2: Enter your 4-digit security PIN (default: 1234) when prompted.',
            'Step 3: Complete Aadhaar e-KYC verification using UIDAI OTP.',
            'Step 4: Verify your mobile phone and official email via 6-digit OTP.',
            'Step 5: Capture a live 3D face portrait using your device camera.',
            'Step 6: Review and submit statutory declarations to complete your profile.'
          ],
          actionLabel: 'Proceed to Verification Checklist 🚀',
          actionPayload: { type: 'scroll_to', elementId: 'verification_checklist' }
        },
        {
          id: 'cand_aadhaar',
          title: '🆔 Aadhaar UIDAI e-KYC & Demographic Verification',
          category: 'kyc',
          badge: 'GOVERNMENT ID',
          badgeClass: 'badge-emerald',
          icon: ShieldCheck,
          summary: 'How to validate your 12-digit Aadhaar number securely with official UIDAI OTP.',
          steps: [
            '1. Click "Start Aadhaar Verification" in Step 1.',
            '2. Enter your 12-Digit Aadhaar number.',
            '3. Tap "Send UIDAI OTP" - an official OTP will be dispatched to your Aadhaar-linked mobile.',
            '4. Enter the 6-digit OTP and tap Verify. Your demographic details match instantly!'
          ],
          actionLabel: 'Start Aadhaar Verification 🚀',
          actionPayload: { type: 'trigger_action', action: 'open_aadhaar_modal' }
        },
        {
          id: 'cand_photo',
          title: '🤳 Live 3D AI WebCam Biometric Liveness & Photo Match',
          category: 'kyc',
          badge: 'BIOMETRICS',
          badgeClass: 'badge-purple',
          icon: Zap,
          summary: 'How to capture a clear live face photo for anti-spoofing liveness verification.',
          steps: [
            '1. Click "Capture Live Photo" in Step 4.',
            '2. Allow camera access permission on your mobile or desktop browser.',
            '3. Align your face inside the oval guide overlay in good lighting.',
            '4. Click "Capture Photo" - AI biometric liveness and face match score are calculated instantly!'
          ],
          actionLabel: 'Open Live Photo Camera 🚀',
          actionPayload: { type: 'trigger_action', action: 'open_photo_modal' }
        }
      ];
    }

    if (activeRole === 'hrexecutive') {
      return [
        {
          id: 'hr_pipeline',
          title: '📋 Candidate Directory & Status Pipeline Tracker',
          category: 'recruitment',
          badge: 'HR WORKSTATION',
          badgeClass: 'badge-emerald',
          icon: UserPlus,
          summary: 'Track candidate applications, verification links sent, pending items, and verified profiles.',
          steps: [
            '1. Use "All Candidates", "Pending Verifications", or "Verified Candidates" quick filters.',
            '2. View real-time readiness progress percentage (e.g. 85% completed).',
            '3. Click "Inspect Dossier" to view candidate KYC submissions and original document scans.'
          ],
          actionLabel: 'Go to Candidate Directory 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'pipeline' }
        },
        {
          id: 'hr_dispatch',
          title: '📲 Multi-Channel Magic Link Dispatcher (WhatsApp / SMS / Email)',
          category: 'recruitment',
          badge: 'DISPATCHER',
          badgeClass: 'badge-cyan',
          icon: Mail,
          summary: 'Dispatch instant verification links directly to candidate mobile numbers and email addresses.',
          steps: [
            '1. Click "+ Add Candidate & Send Link" button.',
            '2. Enter candidate Name, Email ID, Mobile Number, and Department.',
            '3. Select notification channels: WhatsApp, SMS, or Email.',
            '4. Click "Dispatch Verification Link" - candidate receives magic link instantly!'
          ],
          actionLabel: 'Add Candidate & Dispatch Link 🚀',
          actionPayload: { type: 'open_modal', modal: 'add_candidate' }
        },
        {
          id: 'hr_bulk',
          title: '📥 Bulk Candidate Import via Excel Spreadsheet',
          category: 'recruitment',
          badge: 'BULK IMPORT',
          badgeClass: 'badge-amber',
          icon: FileDown,
          summary: 'Upload Excel files with employee names & email IDs to issue verification links in bulk.',
          steps: [
            '1. Click "Bulk Import (Excel) 📥" button.',
            '2. Download the pre-formatted Excel template.',
            '3. Add candidate Name and Email ID columns and upload the file.',
            '4. System auto-generates sequential employee IDs (JOY-EMP-002) and dispatches links!'
          ],
          actionLabel: 'Open Excel Bulk Import Wizard 🚀',
          actionPayload: { type: 'open_modal', modal: 'bulk_import' }
        }
      ];
    }

    // Default Company Admin Tour Topics
    return [
      {
        id: 'company_quota',
        title: '🏢 Company Dashboard & Verification Quota Management',
        category: 'general',
        badge: 'COMPANY ADMIN',
        badgeClass: 'badge-cyan',
        icon: Building2,
        summary: 'Monitor remaining verification credits, active HR seats, and corporate settings.',
        steps: [
          '1. Check your Monthly Verification Quota and remaining check balance.',
          '2. Review active HR recruiter seats and department allocations.',
          '3. Update company statutory records (CIN, GSTIN, PAN).'
        ],
        actionLabel: 'Go to Company Dashboard 🚀',
        actionPayload: { type: 'navigate_tab', tab: 'dashboard' }
      },
      {
        id: 'create_hr',
        title: '👔 How to Create an HR & Assign Recruiter Seats',
        category: 'hr_management',
        badge: 'TEAM SETUP',
        badgeClass: 'badge-indigo',
        icon: UserPlus,
        summary: 'Provision recruiter seats, assign department access, and generate COMP001HR001 login credentials.',
        steps: [
          '1. Open the "3. HR Team" tab in the Company Portal.',
          '2. Click the "+ Add HR User" button at the top-right.',
          '3. Enter the HR Recruiter Full Name and official Email Address.',
          '4. Assign their specific Recruitment Department.',
          '5. Click "Create HR Account" - their hierarchical ID (COMP001HR001) will be issued instantly!'
        ],
        actionLabel: 'Go to HR Team & Add Recruiter 🚀',
        actionPayload: { type: 'navigate_tab', tab: 'hrteam', openModal: 'add_hr' }
      },
      {
        id: 'recharge_wallet',
        title: '💳 How to Recharge Company Wallet & Download Invoices',
        category: 'billing',
        badge: 'FINANCIALS',
        badgeClass: 'badge-amber',
        icon: CreditCard,
        summary: 'Top-up your prepaid verification balance using Razorpay UPI/Cards and download GST invoices.',
        steps: [
          '1. Open the "💳 Billing & Wallet" tab.',
          '2. Click "⚡ Top-up Wallet with Razorpay".',
          '3. Complete payment via UPI, Credit/Debit Card, or Net Banking.',
          '4. Download official GST-compliant tax invoices anytime from the Invoices table.'
        ],
        actionLabel: 'Go to Billing & Top-up Wallet 🚀',
        actionPayload: { type: 'navigate_tab', tab: 'billing_wallet', openModal: 'razorpay' }
      }
    ];
  };

  const tourTopics = getRoleTourTopics();

  const filteredTopics = tourTopics.filter(t => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q) || t.steps.some(s => s.toLowerCase().includes(q));
    }
    return true;
  });

  const handleExecuteAction = (actionPayload) => {
    onClose();
    if (onSelectAction) {
      onSelectAction(actionPayload);
    } else {
      // Global fallback event
      window.dispatchEvent(new CustomEvent('tour_feature_action', { detail: actionPayload }));
    }
  };

  return createPortal((
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 animate-modal-spring max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-t-3xl border-b border-purple-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-purple-600/40 border border-purple-400/40 text-purple-300">
              <Compass className="w-7 h-7 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-purple text-[10px] font-black uppercase">
                  Interactive Learning Hub
                </span>
                <span className="text-xs text-slate-300 font-mono">Company Feature Navigator</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white mt-1">
                How-To Guides & Interactive Feature Tour
              </h3>
            </div>
          </div>

          <button 
            onClick={handleModalClose} 
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              placeholder="Search guides: 'create HR', 'configure email', 'whatsapp', 'wallet', 'tickets'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'all', label: 'All Guides' },
              { id: 'hr_management', label: '👔 HR Team' },
              { id: 'communication', label: '📧 Email & WhatsApp' },
              { id: 'billing', label: '💳 Wallet & Billing' },
              { id: 'support', label: '🎫 Helpdesk' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Guides List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No walkthrough guides matching "{searchQuery}"</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                className="text-xs text-purple-600 underline font-bold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const Icon = topic.icon;
              const isExpanded = expandedTopicId === topic.id;

              return (
                <div 
                  key={topic.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded 
                      ? 'border-purple-300 bg-gradient-to-br from-purple-50/60 via-white to-indigo-50/40 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-purple-200 shadow-2xs'
                  }`}
                >
                  {/* Topic Header Card */}
                  <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`badge ${topic.badgeClass} text-[9px] font-black uppercase`}>
                            {topic.badge}
                          </span>
                          <strong className="text-sm font-black text-slate-900 block sm:inline">
                            {topic.title}
                          </strong>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {topic.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleExecuteAction(topic.actionPayload)}
                        className="btn bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-3.5 font-black shadow-sm flex items-center gap-1.5 cursor-pointer rounded-xl transition-all active:scale-95 whitespace-nowrap"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">{topic.actionLabel}</span>
                        <span className="sm:hidden">Go</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 cursor-pointer"
                        title={isExpanded ? 'Collapse Steps' : 'View Step-by-Step Instructions'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Step-by-Step Instructions */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-purple-100 space-y-3 animate-fadeIn text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Step-by-Step Illustrated Procedure:</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{topic.steps.length} Steps</span>
                      </div>

                      <div className="space-y-2 bg-white/80 p-4 rounded-xl border border-purple-100">
                        {topic.steps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2.5 text-slate-700 font-medium leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                              {sIdx + 1}
                            </span>
                            <span className="flex-1">{step}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Clicking below will navigate to the exact feature screen automatically.
                        </span>

                        <button
                          type="button"
                          onClick={() => handleExecuteAction(topic.actionPayload)}
                          className="btn btn-superadmin text-xs py-2 px-4 font-black flex items-center gap-1.5 cursor-pointer rounded-xl shadow-md"
                        >
                          <span>{topic.actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 rounded-b-3xl shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-700">Need personal assistance? Super Admin Live Support is available 24/7.</span>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  ), document.body);
};
