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
          title: '👑 Super Admin Master Console & Profit Telemetry Overview',
          category: 'governance',
          badge: 'SUPERADMIN',
          badgeClass: 'badge-purple',
          icon: Crown,
          summary: 'Master control dashboard for managing platform tenants, overall system health, revenue telemetry, and database metrics.',
          steps: [
            '1. View total registered companies, overall verification volume, and active subscriber contracts.',
            '2. Monitor live system health, API gateway latencies, and server status.',
            '3. Inspect master revenue telemetry and metered consumption analytics.'
          ],
          tourSteps: [
            { target: 'superadmin-analytics-tab', title: '1. Platform Telemetry Dashboard', description: 'Click here to view overall system health, total active enterprise tenants, and verification check metrics.' },
            { target: 'superadmin-companies-tab', title: '2. Client Companies Registry', description: 'Inspect all registered enterprise client tenants, manage credit quotas, and provision feature suites.' }
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
          tourSteps: [
            { target: 'superadmin-companies-tab', title: '1. Open Companies Tab', description: 'Navigate to the Companies management section to view registered client accounts.' },
            { target: 'onboard-company-btn', title: '2. Click "+ Onboard Company"', description: 'Click this highlighted button to launch the instant company registration wizard.' }
          ],
          actionLabel: 'Open Company Onboarding Form 🚀',
          actionPayload: { type: 'open_modal', modal: 'onboard_company' }
        },
        {
          id: 'superadmin_apiconfig',
          title: '⚡ Dual Upstream API Gateways (Server 1 Sandbox / Server 2 CoinCircleTrust)',
          category: 'governance',
          badge: 'INFRASTRUCTURE',
          badgeClass: 'badge-amber',
          icon: Zap,
          summary: 'Manage dual upstream API server engines, API keys, endpoints, and fallback routing priorities.',
          steps: [
            '1. Open "Dual Upstream API Gateways" tab.',
            '2. Inspect Server 1 (Sandbox API Gateway) credentials and response times.',
            '3. Inspect Server 2 (CoinCircleTrust 47+ APIs Gateway) production endpoints.',
            '4. Test API ping and configure failover routing rules.'
          ],
          tourSteps: [
            { target: 'superadmin-apiconfig-tab', title: '1. API Gateway Configuration', description: 'Manage dual upstream API provider credentials and system endpoints.' },
            { target: 'apigateway-server1-card', title: '2. Server 1 Sandbox Gateway', description: 'Configure Server 1 Sandbox API key, API URL, and status.' },
            { target: 'apigateway-server2-card', title: '3. Server 2 Production Gateway', description: 'Configure Server 2 (CoinCircleTrust 47+ APIs) production credentials.' }
          ],
          actionLabel: 'Configure API Gateways 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'apiconfig' }
        },
        {
          id: 'superadmin_billing',
          title: '💳 Company Billing Ledger & GST Tax Invoices',
          category: 'billing',
          badge: 'FINANCIALS',
          badgeClass: 'badge-emerald',
          icon: CreditCard,
          summary: 'Audit monthly metered check consumption, Razorpay wallet top-ups, and dispatch GST invoices.',
          steps: [
            '1. Open "Metered Billing & Ledger" tab.',
            '2. Review company wallet balances and payment transactions.',
            '3. Generate and dispatch official GST tax invoice bills to client corporate emails.'
          ],
          tourSteps: [
            { target: 'superadmin-billing-tab', title: '1. Open Billing Ledger', description: 'Inspect wallet balances, metered check usage, and transaction logs.' },
            { target: 'superadmin-invoice-dispatch-btn', title: '2. Dispatch GST Invoices', description: 'Click here to issue official tax invoice bills to corporate clients.' }
          ],
          actionLabel: 'View Billing & Invoices 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'billing' }
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
          tourSteps: [
            { target: 'superadmin-dbms-tab', title: '1. Database & Telemetry Tab', description: 'Inspect live PostgreSQL database tables, connection pools, and records.' },
            { target: 'superadmin-log-filter', title: '2. Live Error Logs Filter', description: 'Filter system error traces by portal, severity level, or timeframe.' }
          ],
          actionLabel: 'View Database Telemetry 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'database' }
        },
        {
          id: 'superadmin_comm',
          title: '📧 Communication Gateways (WhatsApp Cloud & Carrier SMS DLT)',
          category: 'governance',
          badge: 'MESSAGING',
          badgeClass: 'badge-indigo',
          icon: Mail,
          summary: 'Configure Meta WhatsApp Business API tokens and Twilio/DLT SMS carrier credentials.',
          steps: [
            '1. Open Communication Gateways configuration modal.',
            '2. Enter WhatsApp WABA ID, Phone Number ID, and Permanent Access Token.',
            '3. Enter SMS DLT Entity ID and Twilio credentials.',
            '4. Send live test dispatch to verify delivery status.'
          ],
          tourSteps: [
            { target: 'superadmin-comm-gateways-btn', title: '1. Open Messaging Gateways', description: 'Click here to open WhatsApp & Carrier SMS gateway settings.' }
          ],
          actionLabel: 'Configure Messaging Gateways 🚀',
          actionPayload: { type: 'open_modal', modal: 'comm_gateways' }
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
          tourSteps: [
            { target: 'candidate-docs-gate', title: '1. Onboarding Advisory Guidelines', description: 'Review the mandatory verification requirements and expected documents.' },
            { target: 'candidate-pin-input', title: '2. 4-Digit PIN Security Gate', description: 'Enter your 4-digit access PIN (default: 1234) to unlock your portal.' }
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
          tourSteps: [
            { target: 'candidate-aadhaar-gate', title: '1. Aadhaar Verification Card', description: 'Locate the e-KYC Aadhaar verification step on your portal.' },
            { target: 'candidate-aadhaar-input', title: '2. Enter 12-Digit Aadhaar', description: 'Input your 12-digit Aadhaar number and click Send UIDAI OTP.' }
          ],
          actionLabel: 'Start Aadhaar Verification 🚀',
          actionPayload: { type: 'trigger_action', action: 'open_aadhaar_modal' }
        },
        {
          id: 'cand_mobile',
          title: '📱 Mobile Phone & Official Email SMS OTP Validation',
          category: 'kyc',
          badge: 'CONTACT OTP',
          badgeClass: 'badge-cyan',
          icon: Mail,
          summary: 'Validate your mobile number via instant carrier SMS OTP.',
          steps: [
            '1. Click "Validate Phone Number" in Step 2.',
            '2. Check your phone SMS inbox for 6-digit verification OTP.',
            '3. Enter OTP code and submit to confirm phone ownership.'
          ],
          tourSteps: [
            { target: 'candidate-mobile-gate', title: '1. Contact OTP Card', description: 'Locate the mobile phone verification card.' },
            { target: 'candidate-mobile-otp-btn', title: '2. Send SMS OTP', description: 'Click to dispatch an instant 6-digit OTP to your registered phone.' }
          ],
          actionLabel: 'Validate Phone Number 🚀',
          actionPayload: { type: 'scroll_to', elementId: 'candidate-mobile-gate' }
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
          tourSteps: [
            { target: 'candidate-face-gate', title: '1. Biometric Liveness Gate', description: 'Locate the live face camera capture step.' },
            { target: 'candidate-camera-trigger', title: '2. Open Camera', description: 'Click to launch your device camera for a 3D liveness selfie scan.' }
          ],
          actionLabel: 'Open Live Photo Camera 🚀',
          actionPayload: { type: 'trigger_action', action: 'open_photo_modal' }
        },
        {
          id: 'cand_docs',
          title: '📄 Document Vault & Statutory Declarations Upload',
          category: 'documents',
          badge: 'DOCUMENTS',
          badgeClass: 'badge-indigo',
          icon: FileDown,
          summary: 'Upload PAN card, educational degrees, and previous employment records.',
          steps: [
            '1. Click "Upload Files" on the Document Vault card.',
            '2. Select clear PDF or image files of your PAN card and certificates.',
            '3. Confirm statutory declaration statements.'
          ],
          tourSteps: [
            { target: 'candidate-doc-upload-btn', title: '1. Upload Document Files', description: 'Click here to upload your statutory ID & qualification documents.' }
          ],
          actionLabel: 'Go to Document Upload 🚀',
          actionPayload: { type: 'scroll_to', elementId: 'candidate-doc-upload-btn' }
        },
        {
          id: 'cand_checklist',
          title: '🏁 Final Candidate Verification Checklist & Submission Receipt',
          category: 'completion',
          badge: 'CHECKLIST',
          badgeClass: 'badge-emerald',
          icon: CheckCircle2,
          summary: 'Review your 100% verification progress status and download submission receipt.',
          steps: [
            '1. Check that all verification items display green status.',
            '2. Click "Download Verification Receipt" for your records.',
            '3. HR will review your dossier instantly!'
          ],
          tourSteps: [
            { target: 'candidate-checklist-gate', title: '1. Verification Checklist', description: 'Inspect your completed check items and overall readiness percentage.' },
            { target: 'candidate-receipt-btn', title: '2. Download Submission Receipt', description: 'Download your official verification submission confirmation receipt.' }
          ],
          actionLabel: 'View Checklist & Receipt 🚀',
          actionPayload: { type: 'scroll_to', elementId: 'verification_checklist' }
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
          tourSteps: [
            { target: 'hr-pipeline-tab', title: '1. Open Pipeline Tab', description: 'View and filter all onboarded candidate profiles.' },
            { target: 'hr-candidate-filter-pending', title: '2. Filter Pending Candidates', description: 'Quickly isolate candidates awaiting e-KYC completion.' },
            { target: 'hr-candidate-filter-verified', title: '3. Filter Verified Candidates', description: 'View fully verified candidates ready for background certificates.' }
          ],
          actionLabel: 'Go to Candidate Directory 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'pipeline' }
        },
        {
          id: 'hr_profiler',
          title: '➕ Create Profile & Select API Verification Suite',
          category: 'recruitment',
          badge: 'CREATE PROFILE',
          badgeClass: 'badge-indigo',
          icon: UserPlus,
          summary: 'Input candidate demographics and pick custom verification checks per employee with live Server 1 / Server 2 tags.',
          steps: [
            '1. Open "Create Profile" tab.',
            '2. Enter candidate Full Name, Email, Phone, and Department.',
            '3. Select mandatory API check boxes (Aadhaar, PAN, Bank, DL, UAN).',
            '4. Click "Create Candidate Profile" - login PIN and magic links are issued instantly!'
          ],
          tourSteps: [
            { target: 'hr-profiler-tab', title: '1. Create Profile Tab', description: 'Open candidate profile creation form.' },
            { target: 'hr-create-profile-form', title: '2. Demographic Form', description: 'Enter candidate name, email ID, and mobile number.' },
            { target: 'hr-checks-selector', title: '3. Select Verification Checks', description: 'Choose API checks to execute (Aadhaar, PAN, DL, UAN, Bank).' }
          ],
          actionLabel: 'Create Candidate Profile 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'profiler' }
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
          tourSteps: [
            { target: 'hr-dispatch-btn', title: '1. Click Dispatch Link Button', description: 'Open instant candidate magic link dispatcher modal.' }
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
          tourSteps: [
            { target: 'hr-bulk-btn', title: '1. Click Bulk Import Button', description: 'Launch the Excel spreadsheet bulk candidate import wizard.' }
          ],
          actionLabel: 'Open Excel Bulk Import Wizard 🚀',
          actionPayload: { type: 'open_modal', modal: 'bulk_import' }
        },
        {
          id: 'hr_dossier',
          title: '🔍 360° Background Verification Dossier & Certificate Viewer',
          category: 'recruitment',
          badge: 'DOSSIER',
          badgeClass: 'badge-purple',
          icon: ShieldCheck,
          summary: 'Inspect complete 360° KYC submissions, verify document scans, and issue digital PDF certificates.',
          steps: [
            '1. Click "Inspect Dossier" on candidate card.',
            '2. Review e-KYC verification status, facial match score, and uploaded documents.',
            '3. Click "Generate Digital Certificate" to issue official JOY Verification Certificate.'
          ],
          tourSteps: [
            { target: 'hr-bgv-dossier-btn', title: '1. Inspect Candidate Dossier', description: 'Click to open comprehensive 360° background dossier.' },
            { target: 'hr-view-certificate-btn', title: '2. View Certificate', description: 'Generate and download official PDF background verification certificate.' }
          ],
          actionLabel: 'Inspect Candidate Dossier 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'pipeline' }
        },
        {
          id: 'hr_redispatch',
          title: '🔄 Re-dispatch Magic Link & Expiry Deadline Extension',
          category: 'recruitment',
          badge: 'MANAGEMENT',
          badgeClass: 'badge-emerald',
          icon: ArrowRight,
          summary: 'Re-send onboarding magic links to pending candidates or update recipient phone/email.',
          steps: [
            '1. Locate candidate card in Pipeline tab.',
            '2. Click "Re-dispatch Magic Link".',
            '3. Confirm channel (WhatsApp / SMS / Email) and re-send instantly!'
          ],
          tourSteps: [
            { target: 'hr-redispatch-btn', title: '1. Click Re-dispatch Link', description: 'Re-send verification link to candidate via WhatsApp or SMS.' }
          ],
          actionLabel: 'Go to Pipeline & Re-dispatch 🚀',
          actionPayload: { type: 'navigate_tab', tab: 'pipeline' }
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
        tourSteps: [
          { target: 'company-quota-card', title: '1. Verification Quota Card', description: 'Check remaining verification check credits and subscription plan status.' },
          { target: 'company-analytics-overview', title: '2. Analytics Overview', description: 'Monitor total verified employees, pending checks, and turnaround time.' }
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
        tourSteps: [
          { target: 'company-hr-tab', title: '1. Open HR Team Tab', description: 'Navigate to HR Recruiter team management.' },
          { target: 'company-add-hr-btn', title: '2. Click "+ Add HR User"', description: 'Click this highlighted button to open the HR Recruiter creation modal.' }
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
        tourSteps: [
          { target: 'company-billing-tab', title: '1. Open Billing & Wallet Tab', description: 'Inspect wallet balance, metered rates, and invoice history.' },
          { target: 'company-topup-wallet-btn', title: '2. Click Top-up Wallet', description: 'Click to launch Razorpay instant payment top-up modal.' }
        ],
        actionLabel: 'Go to Billing & Top-up Wallet 🚀',
        actionPayload: { type: 'navigate_tab', tab: 'billing_wallet', openModal: 'razorpay' }
      },
      {
        id: 'company_registry',
        title: '📋 Master Employee Verification Registry & Dossiers',
        category: 'general',
        badge: 'VERIFICATION',
        badgeClass: 'badge-emerald',
        icon: ShieldCheck,
        summary: 'Inspect verified employee profiles, check 60-day certificate lifecycle deadlines, and download reports.',
        steps: [
          '1. Open "Employee Verification Registry" tab.',
          '2. Filter by company department or search by employee name/ID.',
          '3. Click "Inspect Dossier" or "Download Certificate".'
        ],
        tourSteps: [
          { target: 'company-registry-tab', title: '1. Open Registry Tab', description: 'Access master employee verification registry.' },
          { target: 'company-candidate-search', title: '2. Search Candidate', description: 'Use search input to find specific employee records.' },
          { target: 'company-dossier-download-btn', title: '3. Download Dossier', description: 'Click to download 360° background verification dossier.' }
        ],
        actionLabel: 'Go to Employee Registry 🚀',
        actionPayload: { type: 'navigate_tab', tab: 'registry' }
      },
      {
        id: 'company_dochub',
        title: '📁 Compliance Vault & Corporate Document Storage Hub',
        category: 'support',
        badge: 'COMPLIANCE',
        badgeClass: 'badge-purple',
        icon: FileDown,
        summary: 'Access encrypted cloud document vaults, tax invoices, and official JOY Corporate compliance certificates.',
        steps: [
          '1. Open "Document Hub" tab.',
          '2. Download statutory compliance handbooks, GST invoices, and security policies.'
        ],
        tourSteps: [
          { target: 'company-dochub-tab', title: '1. Open Document Hub', description: 'Access statutory corporate document vault.' },
          { target: 'company-compliance-cert-btn', title: '2. Download Compliance Cert', description: 'Download official corporate verification compliance certificate.' }
        ],
        actionLabel: 'Open Compliance Document Hub 🚀',
        actionPayload: { type: 'navigate_tab', tab: 'dochub' }
      },
      {
        id: 'company_settings',
        title: '⚙️ Upstream API Routing Engine Selector',
        category: 'general',
        badge: 'SETTINGS',
        badgeClass: 'badge-indigo',
        icon: Sliders,
        summary: 'Choose your upstream routing engine: Smart Hybrid Engine (Sandbox + CoinCircleTrust fallback), Server 1 Only, or Server 2 Only.',
        steps: [
          '1. Open "Settings & API Engine" tab.',
          '2. Toggle desired API Routing Engine mode.',
          '3. Click "Save Settings" - engine switches routing dynamically.'
        ],
        tourSteps: [
          { target: 'company-settings-tab', title: '1. Open Settings Tab', description: 'Access company configurations and API routing settings.' },
          { target: 'company-api-selector', title: '2. Upstream API Routing Selector', description: 'Choose between Smart Hybrid Gateway, Server 1 Sandbox, or Server 2 Production.' }
        ],
        actionLabel: 'Configure API Engine 🚀',
        actionPayload: { type: 'navigate_tab', tab: 'settings' }
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

  const handleExecuteAction = (topic) => {
    onClose();
    const actionPayload = topic.actionPayload || {};
    if (onSelectAction) {
      onSelectAction(actionPayload);
    } else {
      // Global fallback event
      window.dispatchEvent(new CustomEvent('tour_feature_action', { detail: actionPayload }));
    }

    // Launch guided tour spotlight with step targets!
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('launch_guided_tour', {
        detail: {
          processId: topic.id,
          processTitle: topic.title,
          steps: topic.tourSteps || [
            {
              target: actionPayload.targetStep || topic.id,
              title: topic.title,
              description: topic.summary
            }
          ]
        }
      }));
    }, 250);
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
