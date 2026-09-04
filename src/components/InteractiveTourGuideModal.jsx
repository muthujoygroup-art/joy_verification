import React, { useState, useEffect } from 'react';
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
  ChevronUp
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

  const tourTopics = [
    {
      id: 'full_tour',
      title: '🎓 Complete Platform Guided Tour (All Features Overview)',
      category: 'general',
      badge: 'ALL FEATURES',
      badgeClass: 'badge-purple',
      icon: Compass,
      summary: 'Step-by-step sequential interactive walkthrough across all tabs, metrics, and workflows.',
      steps: [
        'Step 1: Check your Monthly Verification Quota and remaining balance.',
        'Step 2: Inspect candidate profiles and 60-day certificate expiry in Candidate Registry.',
        'Step 3: Provision HR recruiter seats with hierarchical COMP001HR001 IDs.',
        'Step 4: Update company statutory documents, CIN, and GSTIN.',
        'Step 5: Configure custom SMTP email and communication gateways.',
        'Step 6: Top-up your prepaid wallet via Razorpay and download GST invoices.'
      ],
      actionLabel: 'Launch Full Spotlight Tour ▶',
      actionPayload: { type: 'launch_full_tour' }
    },
    {
      id: 'create_hr',
      title: '👔 How to Create an HR & Assign Recruiter Seats',
      category: 'hr_management',
      badge: 'TEAM SETUP',
      badgeClass: 'badge-indigo',
      icon: UserPlus,
      summary: 'Provision recruiter seats, assign department access (e.g. Engineering, Sales), and generate COMP001HR001 login credentials.',
      steps: [
        '1. Open the "3. HR Team" tab in the Company Portal.',
        '2. Click the "+ Add HR User" button at the top-right.',
        '3. Enter the HR Recruiter Full Name and official Email Address.',
        '4. Assign their specific Recruitment Department (e.g. Technology Hiring, Operations).',
        '5. Set a secure password or keep the default (Hr@Recruiter2026).',
        '6. Click "Create HR Account" - their hierarchical ID (COMP001HR001) will be issued instantly!'
      ],
      actionLabel: 'Go to HR Team & Add Recruiter 🚀',
      actionPayload: { type: 'navigate_tab', tab: 'hrteam', openModal: 'add_hr' }
    },
    {
      id: 'configure_email',
      title: '📧 How to Configure Company Email & Custom SMTP Gateway',
      category: 'communication',
      badge: 'COMMUNICATION',
      badgeClass: 'badge-purple',
      icon: Mail,
      summary: 'Switch between the Master JOY cPanel Mail Gateway and your own corporate SMTP server, save credentials, and send live test emails.',
      steps: [
        '1. Go to the "⚙️ Settings & Gateways" tab in the Company Portal.',
        '2. Scroll to the "📧 Company Email Gateway & Notification Rules" card.',
        '3. Select either "JOY Master cPanel Mail Gateway" (Default) or "Custom Corporate SMTP".',
        '4. If using Custom SMTP, enter Host (e.g. mail.yourcompany.com), Port (465 SSL or 587 TLS), Username, and Password.',
        '5. Click "Save Email Settings 💾" to persist your gateway.',
        '6. Click "Test Connection / Send Test Email 🧪" to verify instant delivery to your inbox!'
      ],
      actionLabel: 'Open Email Configuration 🚀',
      actionPayload: { type: 'navigate_tab', tab: 'settings', scrollTo: 'email_config' }
    },
    {
      id: 'configure_whatsapp',
      title: '💬 How to Configure WhatsApp & SMS Dispatch Gateways',
      category: 'communication',
      badge: 'COMMUNICATION',
      badgeClass: 'badge-emerald',
      icon: MessageSquare,
      summary: 'Connect Meta WhatsApp Cloud API and Karix / Twilio SMS gateways to dispatch instant verification magic links to candidate mobiles.',
      steps: [
        '1. Click on the "💬 Communication Gateways" button in the top bar or settings.',
        '2. Choose between "WhatsApp Gateway" or "SMS Gateway".',
        '3. For WhatsApp: Enter your Meta App ID, Permanent Access Token, and WhatsApp Business Phone Number ID.',
        '4. For SMS: Configure your SMS Provider API Key and Sender ID (e.g. JOYBGV).',
        '5. Click "Save Gateway Credentials" to enable instant mobile link dispatch!'
      ],
      actionLabel: 'Open Communication Gateways Modal 🚀',
      actionPayload: { type: 'open_modal', modal: 'gateways' }
    },
    {
      id: 'recharge_wallet',
      title: '💳 How to Recharge Company Wallet & Download Invoices',
      category: 'billing',
      badge: 'FINANCIALS',
      badgeClass: 'badge-amber',
      icon: CreditCard,
      summary: 'Top-up your prepaid verification balance using Razorpay UPI/Cards or Bank Wire transfer, and download itemized GST 18% tax invoices.',
      steps: [
        '1. Open the "💳 Billing & Wallet" tab in the Company Portal.',
        '2. Check your current wallet balance and remaining checks quota.',
        '3. Click "⚡ Top-up Wallet with Razorpay" or select a Quick Top-up Pack (₹5,000 / ₹15,000 / ₹50,000).',
        '4. Complete payment via UPI, Credit/Debit Card, or Net Banking in the secure Razorpay popup.',
        '5. Your wallet balance updates instantly in real-time!',
        '6. Download official GST-compliant tax invoices anytime from the Invoices table.'
      ],
      actionLabel: 'Go to Billing & Top-up Wallet 🚀',
      actionPayload: { type: 'navigate_tab', tab: 'billing_wallet', openModal: 'razorpay' }
    },
    {
      id: 'hr_notifications',
      title: '🔔 How to Configure Notification Alerts for HRs & Company',
      category: 'communication',
      badge: 'AUTOMATION',
      badgeClass: 'badge-purple',
      icon: Bell,
      summary: 'Set automated trigger notifications for HR account creation, candidate verification completion, low wallet balance warnings, and discrepancies.',
      steps: [
        '1. Go to "⚙️ Settings & Gateways" tab in the Company Portal.',
        '2. Under "Automated Notification Triggers", toggle the rules you want active:',
        '   • ✅ Notify on HR Account Created (Sends welcome credentials email to new HR).',
        '   • ✅ Notify on Candidate Verified (Sends instant alert when candidate passes KYC).',
        '   • ✅ Notify on Verification Discrepancy (Flags failed biometric/PAN mismatches).',
        '   • ✅ Low Wallet Balance Warning (Alerts admin when balance falls below threshold).',
        '3. Click "Save Email Settings 💾" to activate your rules.'
      ],
      actionLabel: 'Configure Notification Triggers 🚀',
      actionPayload: { type: 'navigate_tab', tab: 'settings', scrollTo: 'notification_rules' }
    },
    {
      id: 'support_ticket',
      title: '🎫 How to Raise a Customer Support Ticket to Super Admin',
      category: 'support',
      badge: 'HELPDESK',
      badgeClass: 'badge-cyan',
      icon: LifeBuoy,
      summary: 'Report gateway issues, request quota increases, or seek assistance from Super Admin support specialists with live message threads.',
      steps: [
        '1. Click the "🎫 Support / Tickets" button or help icon in the header.',
        '2. Click "+ Raise New Ticket".',
        '3. Enter your Ticket Subject and select Priority (Normal, High, Urgent).',
        '4. Describe your query or issue in detail and attach error codes if applicable.',
        '5. Submit the ticket - Super Admin will review and reply directly in your thread!'
      ],
      actionLabel: 'Open Customer Support Helpdesk 🚀',
      actionPayload: { type: 'open_modal', modal: 'support' }
    },
    {
      id: 'company_profile',
      title: '🛡️ How to Update Company Profile & Statutory Documents',
      category: 'general',
      badge: 'GOVERNANCE',
      badgeClass: 'badge-indigo',
      icon: Building2,
      summary: 'Maintain accurate corporate records, update CIN, GSTIN, Company PAN, registered headquarters address, and upload official statutory certificates.',
      steps: [
        '1. Click on the "🏢 Company Profile & Documents" tab in the Company Portal.',
        '2. Review and edit your Corporate Identification Number (CIN), GSTIN, and Company PAN.',
        '3. Update Registered Headquarters Address and official website URL.',
        '4. Upload PDF / Image copies of your Certificate of Incorporation, GST Certificate, and Board Resolutions.',
        '5. Click "Save Company Profile 💾" to update your official corporate record.'
      ],
      actionLabel: 'Go to Company Profile & Docs 🚀',
      actionPayload: { type: 'navigate_tab', tab: 'profile_details' }
    },
    {
      id: 'verification_features',
      title: '⚙️ How to Configure Verification Modules (Aadhaar, PAN, EPFO)',
      category: 'general',
      badge: 'KYC SUITE',
      badgeClass: 'badge-amber',
      icon: Sliders,
      summary: 'Customize the verification checks enabled for your candidates (Aadhaar OTP, PAN 2.0, Face Biometrics, EPFO Passbook, Bank Check, Driving License).',
      steps: [
        '1. Go to the "⚙️ Settings & Gateways" tab.',
        '2. Under "Verification Feature Modules Matrix", toggle individual check switches ON or OFF.',
        '3. Quick Modes: Click "Enable All Standard Modules" to activate full 10-check KYC suite, or "Aadhaar-Only Mode" for single-check validation.',
        '4. Changes take effect instantly for all new candidate links issued by your HR team!'
      ],
      actionLabel: 'Configure Verification Modules 🚀',
      actionPayload: { type: 'navigate_tab', tab: 'settings', scrollTo: 'features_matrix' }
    },
    {
      id: 'batch_export',
      title: '📂 How to Use Universal Batch Exporter & Download Dossiers',
      category: 'general',
      badge: 'EXPORTS',
      badgeClass: 'badge-emerald',
      icon: FileDown,
      summary: 'Filter candidate verification records by date range, department, and pass/fail status, and export in PDF dossiers, Excel spreadsheets, or ZIP archives.',
      steps: [
        '1. Click the "📥 Reports / Export" button in the navigation bar or Candidate Registry.',
        '2. Choose Date Presets: "Today", "Yesterday", "Last 7 Days", "This Month", or "Custom Range".',
        '3. Filter by Status (Verified, Pending, Action Needed) or Department.',
        '4. Select candidate dossiers or click "Select All".',
        '5. Choose your export format: "Export as PDF Dossiers", "Export as Excel (.xlsx/.csv)", or "Download ZIP Archive"!'
      ],
      actionLabel: 'Open Batch Export Wizard 🚀',
      actionPayload: { type: 'open_modal', modal: 'universal_export' }
    }
  ];

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

  return (
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
  );
};
