import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import { HrPerformanceChart, TatDistributionChart } from '../components/StatsCharts';
import { DocumentDownloader } from '../components/DocumentDownloader';
import { DocumentStorageHub } from '../components/DocumentStorageHub';
import { PaymentModal } from '../components/PaymentModal';
import { TermsAndPrivacyPolicyModal } from '../components/TermsAndPrivacyPolicyModal';
import { MetricDrilldownModal } from '../components/MetricDrilldownModal';
import { EmployeeProfileDossierModal } from '../components/EmployeeProfileDossierModal';
import { OfficialVerificationCertificateModal } from '../components/OfficialVerificationCertificateModal';
import { ComprehensiveBgvReportModal } from '../components/ComprehensiveBgvReportModal';
import { LegalComplianceHandbookModal } from '../components/LegalComplianceHandbookModal';
import { UniversalDocumentExportModal } from '../components/UniversalDocumentExportModal';
import { RazorpayPaymentModal } from '../components/RazorpayPaymentModal';
import { InteractiveTourGuideModal } from '../components/InteractiveTourGuideModal';
import { HrGovernanceModal } from '../components/HrGovernanceModal';
import { VendorVerificationCertificateModal } from '../components/VendorVerificationCertificateModal';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  FolderDown,
  KeyRound,
  Layers,
  LifeBuoy,
  Lock,
  Mail,
  MessageSquare,
  Plus,
  Receipt,
  RefreshCw,
  Save,
  Scale,
  Search,
  Send,
  SendHorizontal,
  Server,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  UploadCloud,
  User,
  UserPlus,
  Users,
  Zap
} from 'lucide-react';

export const CompanyAdminView = () => {
  const { 
    currentUser,
    companies, 
    hrUsers, 
    candidates, 
    addHrUser, 
    setRoleView, 
    companyPaymentLedger, 
    systemSettings, 
    updateRoleSettings, 
    platformGuidelines, 
    updateGuidelines,
    getCertificateLifecycle,
    rechargeCompanyWallet,
    updateCompanyRoutingEngine,
    updateCompanyHrPermissions,
    updateCompanyFeatures,
    updateCompanyDetails,
    updateCompanyPassword,
    apiConfigurations,
    showToast,
    vendors,
    addCompanyVendor,
    updateCompanyVendor,
    deleteCompanyVendor,
    verifyVendorDocument,
    verifyCompanyProfileDetail,
    requestCompanyProfileReview
  } = useApp();
  const [selectedCompanyId, setSelectedCompanyId] = useState(() => localStorage.getItem('joy_active_company_id') || 'comp-joy');

  // Robust Tenant-Aware Company Resolution (Never returns undefined)
  const resolvedCompany = (Array.isArray(companies) && companies.length > 0)
    ? (companies.find(c => c.id === selectedCompanyId || c.id === currentUser?.companyId || c.email === currentUser?.email) || companies[0])
    : (currentUser?.company || {
        id: currentUser?.companyId || 'comp-joy',
        name: currentUser?.companyName || 'Joy Corporate Solutions Pvt Ltd',
        code: 'COMP001',
        email: currentUser?.email || 'info@joycorporatesolutions.com',
        plan: 'Enterprise Platinum',
        features: {},
        documents: {}
      });

  const company = resolvedCompany || {
    id: 'comp-joy',
    name: 'Joy Corporate Solutions Pvt Ltd',
    code: 'COMP001',
    email: 'info@joycorporatesolutions.com',
    plan: 'Enterprise Platinum',
    features: {},
    documents: {}
  };

  const [activeMainSection, setActiveMainSection] = useState('telemetry_candidates');
  const [activeTab, setActiveTab] = useState('telemetry');
  // 'telemetry' | 'registry' | 'hrteam' | 'dochub' | 'billing_wallet' | 'hr_permissions'
  const [showTourGuideModal, setShowTourGuideModal] = useState(false);
  const [showAddHrModal, setShowAddHrModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [inspectCandidate, setInspectCandidate] = useState(null);
  const [downloadingCandidate, setDownloadingCandidate] = useState(null);
  const [activeDrilldown, setActiveDrilldown] = useState(null);
  const [viewingDossierCandidate, setViewingDossierCandidate] = useState(null);
  const [viewingCertificateCandidate, setViewingCertificateCandidate] = useState(null);
  const [viewingBgvReportCandidate, setViewingBgvReportCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLegalHandbook, setShowLegalHandbook] = useState(false);
  const [showUniversalExportModal, setShowUniversalExportModal] = useState(false);

  // 🤝 Enterprise Vendor Management & Verification States
  const [selectedCertVendor, setSelectedCertVendor] = useState(null);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState('All');
  const [verifyingDocModal, setVerifyingDocModal] = useState(null); // { vendor, checkType, docNumber, additionalData }
  const [isProcessingVendorCheck, setIsProcessingVendorCheck] = useState(false);
  const [newVendorForm, setNewVendorForm] = useState({
    vendorName: '',
    category: 'IT Infrastructure & Cloud Services',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gstin: '',
    pan: '',
    bankAccount: '',
    bankIfsc: '',
    msmeNumber: '',
    epfoNumber: '',
    esicNumber: ''
  });

  // 🏛️ Company Profile Statutory Verification States
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isVerifyingCin, setIsVerifyingCin] = useState(false);
  const [isRequestingReview, setIsRequestingReview] = useState(false);

  // 👔 HR Recruiter Governance & Activation States
  const [governanceHr, setGovernanceHr] = useState(null);
  const [activatingHr, setActivatingHr] = useState(null);
  const [dbHrUsers, setDbHrUsers] = useState([]);
  const [isLoadingHr, setIsLoadingHr] = useState(false);

  // 📧 Company Outgoing SMTP Mail Server States
  const [smtpForm, setSmtpForm] = useState({
    use_custom_smtp: true,
    host: 'mail.joycorporatesolutions.com',
    port: 465,
    user: '',
    password: '',
    from_email: '',
    from_name: '',
    use_ssl: true,
    use_tls: false
  });
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [testSmtpEmail, setTestSmtpEmail] = useState('');

  // 4-Digit PIN & Advanced New HR State
  const [newHr, setNewHr] = useState({
    name: '',
    email: '',
    phone: '',
    dept: 'Engineering Recruitment',
    designation: 'HR Recruiter',
    password: 'Hr@Recruiter2026',
    activation_password: '1234',
    send_email: true
  });

  // 🏢 Company Profile Details, Branding Logo & Statutory Uploads States
  const [profileData, setProfileData] = useState({
    name: company?.name || '',
    logo: company?.logo || company?.logo_url || (company?.features || {}).logo || (company?.documents || {}).company_logo || '',
    contact_person: company?.contactPerson || company?.contact_person || '',
    phone: company?.phone || '',
    location: company?.location || company?.registered_address || '',
    registered_address: company?.registered_address || company?.location || '',
    cin_number: company?.cin_number || '',
    gstin_number: company?.gstin_number || '',
    company_pan: company?.company_pan || '',
    industry_sector: company?.industry_sector || 'Information Technology (IT/ITeS)',
    website: company?.website || ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 🔐 Company Administrator Login Password Update State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Sync profile form whenever active company changes
  useEffect(() => {
    if (company) {
      setProfileData({
        name: company.name || '',
        logo: company.logo || company.logo_url || (company.features || {}).logo || (company.documents || {}).company_logo || '',
        contact_person: company.contactPerson || company.contact_person || '',
        phone: company.phone || '',
        location: company.location || company.registered_address || '',
        registered_address: company.registered_address || company.location || '',
        cin_number: company.cin_number || '',
        gstin_number: company.gstin_number || '',
        company_pan: company.company_pan || '',
        industry_sector: company.industry_sector || 'Information Technology (IT/ITeS)',
        website: company.website || ''
      });
      setCompanyUploadedDocs(company.documents || {});
    }
  }, [company?.id]);

  // Save Company Master Profile & Statutory Credentials
  const handleSaveCompanyProfile = async (e) => {
    e?.preventDefault();
    setIsSavingProfile(true);
    try {
      const payload = {
        ...profileData,
        documents: companyUploadedDocs
      };
      if (typeof updateCompanyDetails === 'function') {
        await updateCompanyDetails(company.id, payload);
      } else {
        await api.updateCompanyProfile(company.id, payload);
      }
      showToast('💾 Corporate details, branding logo, and statutory credentials saved successfully!');
    } catch (err) {
      showToast(`❌ Failed to save profile: ${err.message}`, 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 🏛️ Real-time Gateway Verification of Company Profile Details (GST, PAN, CIN)
  const handleVerifyCompanyDetail = async (checkType) => {
    let data = {};
    if (checkType === 'gst') {
      if (!profileData.gstin_number) {
        showToast('⚠️ Please enter GSTIN first', 'error');
        return;
      }
      setIsVerifyingGst(true);
      data = { gstin: profileData.gstin_number };
    } else if (checkType === 'pan') {
      if (!profileData.company_pan) {
        showToast('⚠️ Please enter Company PAN first', 'error');
        return;
      }
      setIsVerifyingPan(true);
      data = { pan: profileData.company_pan, company_name: profileData.name };
    } else if (checkType === 'cin') {
      if (!profileData.cin_number) {
        showToast('⚠️ Please enter CIN first', 'error');
        return;
      }
      setIsVerifyingCin(true);
      data = { cin: profileData.cin_number };
    }

    try {
      if (typeof verifyCompanyProfileDetail === 'function') {
        await verifyCompanyProfileDetail(company.id, checkType, data);
      }
      showToast(`🏛️ ${checkType.toUpperCase()} verified successfully against government statutory gateway!`);
    } catch (err) {
      showToast(`❌ Gateway check failed: ${err.message}`, 'error');
    } finally {
      if (checkType === 'gst') setIsVerifyingGst(false);
      if (checkType === 'pan') setIsVerifyingPan(false);
      if (checkType === 'cin') setIsVerifyingCin(false);
    }
  };

  // 🚀 Request SuperAdmin Review of Company Profile & Statutory Credentials
  const handleRequestReview = () => {
    setIsRequestingReview(true);
    try {
      if (typeof requestCompanyProfileReview === 'function') {
        requestCompanyProfileReview(company.id);
      }
      showToast('🚀 Statutory profile review request submitted to SuperAdmin! Status updated to Under Review.');
    } catch (e) {
      showToast(`Failed to submit review request: ${e.message}`, 'error');
    } finally {
      setIsRequestingReview(false);
    }
  };

  // 🤝 VENDOR MANAGEMENT & STATUTORY VERIFICATION HANDLERS
  const handleOpenVerifyModal = (vendor, checkType = 'gst') => {
    let initialDoc = '';
    if (checkType === 'gst') initialDoc = vendor.gstin || '';
    else if (checkType === 'pan') initialDoc = vendor.pan || '';
    else if (checkType === 'bank') initialDoc = vendor.bankAccount || '';
    else if (checkType === 'msme') initialDoc = vendor.msmeNumber || '';
    else if (checkType === 'epfo') initialDoc = vendor.epfoNumber || '';
    else if (checkType === 'esic') initialDoc = vendor.esicNumber || '';

    setVerifyingDocModal({
      vendor,
      checkType,
      docNumber: initialDoc,
      panName: vendor.vendorName || '',
      bankAccount: vendor.bankAccount || '',
      bankIfsc: vendor.bankIfsc || '',
      beneficiaryName: vendor.vendorName || '',
      notes: ''
    });
  };

  const handleExecuteVendorCheck = async (e) => {
    e?.preventDefault();
    if (!verifyingDocModal) return;
    const { vendor, checkType, docNumber, panName, bankAccount, bankIfsc, beneficiaryName } = verifyingDocModal;

    if (!docNumber && checkType !== 'bank') {
      showToast('⚠️ Please enter the document number to verify', 'error');
      return;
    }

    if (checkType === 'bank' && (!bankAccount || !bankIfsc)) {
      showToast('⚠️ Both Bank Account Number and IFSC Code are required for Penny Drop verification', 'error');
      return;
    }

    // Check company wallet balance (₹60 required)
    if ((company.walletBalance || 0) < 60) {
      showToast('⚠️ Insufficient Wallet Credits (₹60 needed per check). Please recharge your wallet.', 'error');
      setShowRazorpayModal(true);
      return;
    }

    setIsProcessingVendorCheck(true);
    try {
      const additionalData = {
        company_name: panName || vendor.vendorName,
        account_number: bankAccount,
        ifsc: bankIfsc,
        beneficiary_name: beneficiaryName || vendor.vendorName
      };

      const docVal = checkType === 'bank' ? bankAccount : docNumber;

      const result = await verifyVendorDocument(company.id, vendor.id, checkType, docVal, additionalData);
      
      showToast(`🎉 ${checkType.toUpperCase()} verified successfully! ₹60 deducted from wallet credits.`);
      setVerifyingDocModal(null);
    } catch (err) {
      showToast(`❌ Verification failed: ${err.message}`, 'error');
    } finally {
      setIsProcessingVendorCheck(false);
    }
  };

  const handleAddNewVendorSubmit = (e) => {
    e?.preventDefault();
    if (!newVendorForm.vendorName || !newVendorForm.contactPerson) {
      showToast('⚠️ Vendor Name and Primary Contact Person are required', 'error');
      return;
    }

    try {
      addCompanyVendor(company.id, newVendorForm);
      showToast(`🎉 Vendor ${newVendorForm.vendorName} registered successfully!`);
      setShowAddVendorModal(false);
      setNewVendorForm({
        vendorName: '',
        category: 'IT Infrastructure & Cloud Services',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        gstin: '',
        pan: '',
        bankAccount: '',
        bankIfsc: '',
        msmeNumber: '',
        epfoNumber: '',
        esicNumber: ''
      });
    } catch (err) {
      showToast(`❌ Failed to add vendor: ${err.message}`, 'error');
    }
  };

  const handleDeleteVendor = (vendorId, vendorName) => {
    if (window.confirm(`Are you sure you want to remove vendor "${vendorName}" from your directory?`)) {
      deleteCompanyVendor(vendorId);
      showToast(`🗑️ Vendor "${vendorName}" removed.`);
    }
  };

  // Update Company Login Password
  const handleUpdateCompanyPassword = async (e) => {
    e?.preventDefault();
    if (!passwordData.new_password || passwordData.new_password.length < 4) {
      showToast('⚠️ New password must be at least 4 characters long', 'error');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast('⚠️ New password and confirmation do not match', 'error');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      if (typeof updateCompanyPassword === 'function') {
        await updateCompanyPassword(company.id, passwordData.new_password, passwordData.current_password);
      } else {
        await api.updateCompanyPassword(company.id, passwordData.new_password, true, passwordData.current_password);
      }
      showToast('🔐 Company Administrator password updated successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      showToast(`❌ Password update failed: ${err.message}`, 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };


  const [companyUploadedDocs, setCompanyUploadedDocs] = useState(company?.documents || {});

  // 📧 Company Custom Email Gateway & SMTP States
  const [compEmailConfig, setCompEmailConfig] = useState({
    use_custom_smtp: false,
    host: 'mail.joycorporatesolutions.com',
    port: 465,
    user: '',
    password: '',
    from_email: '',
    from_name: company?.name || 'HR Recruitment Team',
    use_ssl: true,
    use_tls: false,
    notification_rules: {
      notify_hr_created: true,
      notify_candidate_verified: true,
      notify_discrepancies: true,
      notify_low_balance: true
    }
  });
  const [showCompSmtpPassword, setShowCompSmtpPassword] = useState(false);
  const [isSavingCompEmail, setIsSavingCompEmail] = useState(false);
  const [showCompTestEmailModal, setShowCompTestEmailModal] = useState(false);
  const [compTestRecipient, setCompTestRecipient] = useState('');
  const [isSendingCompTestEmail, setIsSendingCompTestEmail] = useState(false);
  const [compTestEmailResult, setCompTestEmailResult] = useState(null);

  // Save Company Custom SMTP
  const handleSaveSmtp = async (e) => {
    e?.preventDefault();
    setIsSavingSmtp(true);
    try {
      const res = await api.saveCompanySmtpSettings(company.id, smtpForm);
      showToast(res.message || '💾 Company SMTP configuration saved to PostgreSQL!');
    } catch (err) {
      showToast(`❌ Failed to save SMTP: ${err.message}`, 'error');
    } finally {
      setIsSavingSmtp(false);
    }
  };

  // Test Company SMTP
  const handleTestSmtp = async (e) => {
    e?.preventDefault();
    if (!testSmtpEmail || !testSmtpEmail.includes('@')) {
      showToast('⚠️ Please enter a valid test recipient email address');
      return;
    }
    setIsTestingSmtp(true);
    try {
      const res = await api.testCompanySmtpDispatch(company.id, testSmtpEmail, smtpForm);
      showToast(res.message || `📧 Test email sent to ${testSmtpEmail}!`);
    } catch (err) {
      showToast(`❌ SMTP Test Failed: ${err.message}`, 'error');
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Onboard HR Recruiter Submit
  const handleOnboardHrSubmit = async (e) => {
    e?.preventDefault();
    if (!newHr.name || !newHr.email) {
      showToast('⚠️ Name and Email are required');
      return;
    }
    try {
      const res = await api.onboardHrUser(company.id, newHr);
      showToast(res.message || `🎉 HR Recruiter ${newHr.name} onboarded!`);
      if (res.hr_user) {
        setDbHrUsers(prev => [res.hr_user, ...prev]);
      }
      setShowAddHrModal(false);
      setNewHr({
        name: '',
        email: '',
        phone: '',
        dept: 'Engineering Recruitment',
        designation: 'HR Recruiter',
        password: 'Hr@Recruiter2026',
        activation_password: '1234',
        send_email: true
      });
    } catch (err) {
      showToast(`❌ Failed to onboard HR: ${err.message}`, 'error');
    }
  };

  // 1-Click Approve HR Recruiter
  const handleApproveHr = async (hrId, hrName) => {
    try {
      const res = await api.approveHrUser(company.id, hrId);
      showToast(res.message || `🎉 ${hrName} approved and live login access granted!`);
      setDbHrUsers(prev => prev.map(h => h.id === hrId ? { ...h, status: 'Active', activation_status: 'Active' } : h));
    } catch (err) {
      showToast(`❌ Approval failed: ${err.message}`, 'error');
    }
  };

  // Resend HR Activation Email
  const handleResendHrActivation = async (hrId, hrEmail) => {
    try {
      const res = await api.resendHrActivationEmail(company.id, hrId);
      showToast(res.message || `📧 Activation invitation resent to ${hrEmail}!`);
    } catch (err) {
      showToast(`❌ Failed to resend email: ${err.message}`, 'error');
    }
  };

  // Smooth Dashboard Positioning on Tab Switches
  // Smooth Dashboard Positioning on Tab Switches & Sync with Left Sidebar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('portal_nav_state_sync', {
      detail: { activeMainSection, activeTab }
    }));
  }, [activeTab, activeMainSection]);

  // Slugify Helper
  const slugify = (text) => (text || '').toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const companySlug = slugify(company?.name || 'joy-corporate-solutions');

  // Sync URL path when activeTab changes
  useEffect(() => {
    const targetPath = `/${companySlug}/company/admin/${activeTab}`;
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, '', targetPath);
    }
  }, [activeTab, companySlug]);

  // Parse initial tab from URL path
  useEffect(() => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (['telemetry', 'registry', 'hrteam', 'vendor_verification', 'dochub', 'billing_wallet', 'profile_details', 'smtp_settings'].includes(lastPart)) {
      setActiveTab(lastPart);
    }
  }, []);

  // Listen to navigation events from Left Portal Sidebar
  useEffect(() => {
    const handlePortalNav = (e) => {
      const { section, tab, modal } = e.detail || {};
      if (section) setActiveMainSection(section);
      if (tab) setActiveTab(tab);
      if (modal === 'add_hr') setShowAddHrModal(true);
      else if (modal === 'razorpay') setShowRazorpayModal(true);
      else if (modal === 'add_vendor') setShowAddVendorModal(true);
    };
    window.addEventListener('portal_nav_navigate', handlePortalNav);
    return () => window.removeEventListener('portal_nav_navigate', handlePortalNav);
  }, []);

  // Listen to tour action events from Navbar / Tour Modal
  useEffect(() => {
    const handleTourAction = (e) => {
      const payload = e.detail;
      if (!payload) return;
      if (payload.type === 'launch_full_tour') {
        window.dispatchEvent(new CustomEvent('launch_guided_tour'));
      } else if (payload.type === 'navigate_tab') {
        if (payload.tab) setActiveTab(payload.tab);
        if (payload.openModal === 'add_hr') setShowAddHrModal(true);
        if (payload.openModal === 'razorpay') setShowRazorpayModal(true);
      } else if (payload.type === 'open_modal') {
        if (payload.modal === 'gateways') setActiveTab('settings');
        if (payload.modal === 'universal_export') setShowUniversalExportModal(true);
        if (payload.modal === 'support') setActiveTab('support');
      }
    };
    window.addEventListener('tour_feature_action', handleTourAction);
    return () => window.removeEventListener('tour_feature_action', handleTourAction);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (inspectCandidate) setInspectCandidate(null);
        else if (downloadingCandidate) setDownloadingCandidate(null);
        else if (activeDrilldown) setActiveDrilldown(null);
        else if (viewingDossierCandidate) setViewingDossierCandidate(null);
        else if (viewingCertificateCandidate) setViewingCertificateCandidate(null);
        else if (viewingBgvReportCandidate) setViewingBgvReportCandidate(null);
        else if (showTourGuideModal) setShowTourGuideModal(false);
        else if (showAddHrModal) setShowAddHrModal(false);
        else if (showPaymentModal) setShowPaymentModal(false);
        else if (showRazorpayModal) setShowRazorpayModal(false);
        else if (showTermsModal) setShowTermsModal(false);
        else if (showLegalHandbook) setShowLegalHandbook(false);
        else if (showUniversalExportModal) setShowUniversalExportModal(false);
        else if (governanceHr) setGovernanceHr(null);
        else if (activatingHr) setActivatingHr(null);
        else if (showCompTestEmailModal) setShowCompTestEmailModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    inspectCandidate, downloadingCandidate, activeDrilldown, viewingDossierCandidate,
    viewingCertificateCandidate, viewingBgvReportCandidate, showTourGuideModal, showAddHrModal,
    showPaymentModal, showRazorpayModal, showTermsModal, showLegalHandbook,
    showUniversalExportModal, governanceHr, activatingHr, showCompTestEmailModal
  ]);



  const companyHrUsers = (hrUsers || []).filter(h => h.companyId === company.id);

  // Fetch Company SMTP Settings and HR Recruiters from PostgreSQL
  useEffect(() => {
    if (!company?.id) return;

    // Load HR Users
    setIsLoadingHr(true);
    api.getCompanyHrUsers(company.id)
      .then(data => {
        if (Array.isArray(data)) setDbHrUsers(data);
      })
      .catch(err => console.warn('Could not load HR users from DB:', err))
      .finally(() => setIsLoadingHr(false));

    // Load SMTP Settings
    api.getCompanySmtpSettings(company.id)
      .then(res => {
        if (res && res.smtp_settings) {
          setSmtpForm(prev => ({
            ...prev,
            ...res.smtp_settings,
            user: res.smtp_settings.user || company.email || '',
            from_email: res.smtp_settings.from_email || company.email || '',
            from_name: res.smtp_settings.from_name || `${company.name} - Verification Portal`
          }));
          setTestSmtpEmail(company.email || '');
        }
      })
      .catch(err => console.warn('Could not load SMTP settings:', err));
  }, [company?.id]);

  // Combine DB HR users with context HR users
  const allCompanyHrUsers = dbHrUsers.length > 0 ? dbHrUsers : companyHrUsers;

  const companyCandidates = (candidates || []).filter(c => c.companyId === company.id);

  const filteredCandidates = (companyCandidates || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifiedCount = (companyCandidates || []).filter(c => c.status === 'Verified').length;
  const pendingCount = (companyCandidates || []).filter(c => c.status !== 'Verified').length;


  const handleToggleFeature = (featKey, val) => {
    const updated = {
      ...(company.features || {}),
      [featKey]: val
    };
    if (featKey === 'aiFaceBiometrics') {
      updated.faceCapture = val;
    }
    try {
      localStorage.setItem('joy_company_features', JSON.stringify(updated));
    } catch (e) {}
    updateCompanyFeatures(company.id, updated);
  };

  const handleAadhaarOnlyMode = () => {
    const aadhaarOnly = {
      ...(company.features || {}),
      aadhaar: true,
      mobileOtp: false,
      emailGateway: false,
      aiFaceBiometrics: false,
      faceCapture: false,
      pan: false,
      bankCheck: false,
      uan: false,
      drivingLicense: false,
      passport: false
    };
    try {
      localStorage.setItem('joy_company_features', JSON.stringify(aadhaarOnly));
    } catch (e) {}
    updateCompanyFeatures(company.id, aadhaarOnly);
  };

  const handleEnableAllModules = () => {
    const allStandard = {
      ...(company.features || {}),
      aadhaar: true,
      mobileOtp: true,
      emailGateway: true,
      aiFaceBiometrics: true,
      faceCapture: true,
      pan: true,
      bankCheck: true,
      uan: true,
      drivingLicense: true,
      passport: true
    };
    try {
      localStorage.setItem('joy_company_features', JSON.stringify(allStandard));
    } catch (e) {}
    updateCompanyFeatures(company.id, allStandard);
  };

  const handleToggleHrStatus = async (hrId, currentStatus) => {
    const newStatus = (currentStatus === 'Active' || !currentStatus) ? 'Inactive' : 'Active';
    try {
      await api.updateHrStatus(company?.id || 'comp-joy', hrId, newStatus);
      showToast(`👔 HR Recruiter account set to ${newStatus}!`);
      // Update local state
      setDbHrUsers(prev => prev.map(h => h.id === hrId ? { ...h, status: newStatus } : h));
    } catch (err) {
      showToast('❌ Failed to update HR status: ' + err.message);
    }
  };

  // 🏢 Save Company Email Gateway Settings
  const handleSaveCompanyEmailSettings = async () => {
    if (!company?.id) return;
    setIsSavingCompEmail(true);
    try {
      await api.saveCompanyEmailConfig(company.id, compEmailConfig);
      showToast('💾 Company email gateway & notification rules saved successfully!');
    } catch (err) {
      console.warn('Error saving company email settings:', err);
      showToast('❌ Failed to save company email settings');
    } finally {
      setIsSavingCompEmail(false);
    }
  };

  // 🏢 Send Live Company Test Email
  const handleSendCompanyTestEmail = async (e) => {
    if (e) e.preventDefault();
    if (!compTestRecipient || !compTestRecipient.includes('@')) {
      showToast('⚠️ Please enter a valid test recipient email address');
      return;
    }
    setIsSendingCompTestEmail(true);
    setCompTestEmailResult(null);
    try {
      const res = await api.testCompanyEmail(company?.id || 'comp-001', compTestRecipient.trim(), compEmailConfig);
      setCompTestEmailResult(res);
      showToast(`🎉 Test email dispatched to ${compTestRecipient}!`);
    } catch (err) {
      setCompTestEmailResult({ success: false, error: err.message || 'SMTP Handshake failed' });
      showToast('❌ Test email delivery failed');
    } finally {
      setIsSendingCompTestEmail(false);
    }
  };

  const companyDivisionMetaMap = {
    registry: {
      pillarBadge: '🏛️ 1. Analytics & Candidates',
      badgeText: `${candidates.length} Candidates Enrolled`,
      title: 'Candidate Verification Directory & Onboarding Records',
      subtitle: 'Comprehensive registry of company candidate profiles, real-time verification progress, and point-in-time dossiers',
      icon: Users,
      colorClass: 'from-sky-600 to-teal-600'
    },
    telemetry: {
      pillarBadge: '🏛️ 1. Analytics & Candidates',
      badgeText: 'TAT & Completion Rates',
      title: 'Verification Telemetry, Turnaround Time & Operational Throughput',
      subtitle: 'Live telemetry analyzing mean turnaround times, module completion percentages, and recruiter throughput',
      icon: BarChart3,
      colorClass: 'from-teal-600 to-emerald-700'
    },
    hrteam: {
      pillarBadge: '👥 2. HR Team & Access',
      badgeText: `${companyHrUsers.length} Active Recruiters`,
      title: 'Recruiter Team Directory & Department Management',
      subtitle: 'Manage recruiter accounts, department roles, active candidate link allotments, and credentials',
      icon: Users,
      colorClass: 'from-indigo-600 to-purple-700'
    },
    hr_permissions: {
      pillarBadge: '👥 2. HR Team & Access',
      badgeText: 'Granular Access Matrix',
      title: 'Recruiter Field & Feature Check Flags Matrix',
      subtitle: 'Granular permissions controlling candidate profile creation, bulk Excel imports, and mandatory check fields',
      icon: Sliders,
      colorClass: 'from-purple-600 to-indigo-700'
    },
    vendor_verification: {
      pillarBadge: '🤝 3. Vendor Verification',
      badgeText: `${(vendors || []).length} Corporate Vendors`,
      title: 'Corporate Vendor Directory & Statutory Document Verification',
      subtitle: 'Point-in-time GSTIN, PAN, and Bank Account Penny-Drop verification with downloadable statutory certificates',
      icon: ShieldCheck,
      colorClass: 'from-purple-600 to-indigo-700'
    },
    profile_details: {
      pillarBadge: '🏢 4. Profile & Document Vault',
      badgeText: 'Verified Master Profile',
      title: 'Company Master Profile, Branding & Statutory Credentials',
      subtitle: 'Corporate identity, CIN, GSTIN, PAN, corporate logo, and verified legal address',
      icon: Building2,
      colorClass: 'from-emerald-600 to-teal-700'
    },
    dochub: {
      pillarBadge: '🏢 4. Profile & Document Vault',
      badgeText: 'Cloud DMS Vault',
      title: 'Cloud Document Hub & Statutory Verification Vault',
      subtitle: 'Centralized repository of verified candidate identity proofs, education certificates, and company statutory files',
      icon: FolderDown,
      colorClass: 'from-teal-600 to-sky-700'
    },
    billing_wallet: {
      pillarBadge: '💳 5. Billing & Gateways',
      badgeText: `₹${company.walletBalance?.toLocaleString() || 50000} Wallet Balance`,
      title: 'Verification Wallet Balance, Invoices & Metered Tariffs',
      subtitle: 'Real-time prepaid balance, transaction statements, itemized GST tax invoices, and per-check tariff rates',
      icon: CreditCard,
      colorClass: 'from-amber-600 to-orange-700'
    },
    settings: {
      pillarBadge: '💳 5. Billing & Gateways',
      badgeText: 'SMTP Mail Server',
      title: 'Outgoing Mail SMTP Server & Notification Routing',
      subtitle: 'Configure dedicated company outgoing email server credentials, TLS/SSL ports, and candidate email templates',
      icon: Mail,
      colorClass: 'from-indigo-600 to-blue-700'
    },
    smtp_settings: {
      pillarBadge: '💳 5. Billing & Gateways',
      badgeText: 'SMTP Mail Server',
      title: 'Outgoing Mail SMTP Server & Notification Routing',
      subtitle: 'Configure dedicated company outgoing email server credentials, TLS/SSL ports, and candidate email templates',
      icon: Mail,
      colorClass: 'from-indigo-600 to-blue-700'
    },
    support: {
      pillarBadge: '💳 5. Billing & Gateways',
      badgeText: 'Dedicated Support Desk',
      title: 'Support Helpdesk & Priority Escalation Tickets',
      subtitle: 'Direct enterprise support channel for questions, priority escalation, and platform feature requests',
      icon: LifeBuoy,
      colorClass: 'from-rose-600 to-pink-700'
    }
  };

  const currentCompanyDivMeta = companyDivisionMetaMap[activeTab] || companyDivisionMetaMap.registry;
  const CurrentCompanyDivIcon = currentCompanyDivMeta.icon || Building2;

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      
      {/* Top Workstation Header Banner & Sub-Navigation Tabs */}
      <div className="glass-panel p-6 border-sky-200 bg-white space-y-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-600 to-teal-600" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Corporate Logo Display */}
            {company?.logo || company?.logo_url || (company?.features || {}).logo || (company?.documents || {}).company_logo ? (
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 shadow-sm p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={company.logo || company.logo_url || (company.features || {}).logo || (company.documents || {}).company_logo} 
                  alt={company.name} 
                  className="w-full h-full object-contain" 
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md border-2 border-white">
                {(company?.name || 'JC').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge badge-cyan">Company Admin Workstation</span>
                <span className="text-xs text-slate-500 font-bold">• Executive Operations</span>
                {(company.location || company.registered_address) && (
                  <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    📍 {company.location || company.registered_address}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{company.name}</h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">HR Staff Activity, Turnaround Time Metrics, Employee Directory & Document Hub.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUniversalExportModal(true)}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 shadow-2xs cursor-pointer"
              title="Download date-filtered candidate dossiers and Excel CSVs"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Date-Filtered Reports 📥</span>
            </button>

            {/* 🤝 Enterprise Vendor Verification & Point-in-Time PDF Quick-Access */}
            <button
              type="button"
              onClick={() => {
                setActiveMainSection('vendor_verification');
                setActiveTab('vendor_verification');
              }}
              className={`btn text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-black rounded-xl shadow-md cursor-pointer shrink-0 transition-all ${
                activeTab === 'vendor_verification'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white ring-2 ring-purple-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              title="Verify Vendors (GST, PAN, Bank, MSME) & Download Official Point-in-Time PDF Certificates"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Verify Vendors & PDF 🤝</span>
            </button>

            {/* ⚡ 1-Click Verification Wallet Recharge via Razorpay */}
            <button
              onClick={() => setShowRazorpayModal(true)}
              className="btn btn-superadmin text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-black shadow-md cursor-pointer"
              title="Recharge Verification Credits via Razorpay UPI / Cards / NetBanking / Payment Link"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>Recharge Wallet ⚡</span>
            </button>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn btn-hrexecutive text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold shadow-sm"
              title="Pay Monthly Verification Bill Online"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Pay Online & Settle Bill 💳</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-bold">Company:</span>
              <select 
                value={company.id}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="form-select bg-slate-50 border-slate-300 text-slate-900 text-xs font-bold w-auto"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.plan})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 🌟 FOCUSED DIVISION WORKSPACE HEADER */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-br from-sky-600 via-teal-600 to-sky-800 shrink-0 transition-all duration-200">
              <CurrentCompanyDivIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-900 border border-sky-200 shadow-2xs">
                  {currentCompanyDivMeta.pillarBadge}
                </span>
                <span className="text-xs text-slate-300 font-bold">•</span>
                <span className="text-[11px] font-bold text-slate-500">
                  {currentCompanyDivMeta.badgeText}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight truncate mt-1">
                {currentCompanyDivMeta.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {currentCompanyDivMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setShowRazorpayModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
              title="Instant Wallet Top-Up via Razorpay"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Recharge Credits ⚡</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row: Context-Aware for Vendor Hub vs Candidate Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTab === 'vendor_verification' ? (
          <>
            <MetricCard 
              title="Registered Corporate Vendors" 
              value={(vendors || []).length} 
              subtext="Suppliers in Directory" 
              icon={Building2} 
              color="purple" 
              onClick={() => {}}
            />
            <MetricCard 
              title="Verified Vendor Profiles" 
              value={(vendors || []).filter(v => v.verifications?.gst?.verified && v.verifications?.pan?.verified).length} 
              subtext={`Out of ${(vendors || []).length} vendors`} 
              icon={CheckCircle2} 
              trend={`${Math.round(((vendors || []).filter(v => v.verifications?.gst?.verified && v.verifications?.pan?.verified).length / Math.max((vendors || []).length, 1)) * 100)}% Verified`}
              color="emerald" 
              onClick={() => {}}
            />
            <MetricCard 
              title="Verification Wallet Balance" 
              value={`₹${(company.walletBalance || 0).toLocaleString()}`} 
              subtext={`~${Math.floor((company.walletBalance || 0) / 60)} checks (@ ₹60/check)`} 
              icon={CreditCard} 
              color="amber" 
              onClick={() => setShowRazorpayModal(true)}
            />
            <MetricCard 
              title="Statutory PDF Audit" 
              value="Point-in-Time" 
              subtext="Legal Disclaimers & Hash" 
              icon={FileText} 
              color="indigo" 
              onClick={() => {
                const v = (vendors || [])[0];
                if (v) setSelectedCertVendor(v);
              }}
            />
          </>
        ) : (
          <>
            <MetricCard 
              title="Active HR Executives" 
              value={companyHrUsers.length} 
              subtext="Managing Onboarding" 
              icon={Users} 
              color="cyan" 
              onClick={() => setActiveDrilldown({
                title: 'Active HR Executives Team',
                subtitle: `Recruiting & Onboarding staff assigned to ${company.name}`,
                metricValue: `${companyHrUsers.length} HR Staff`,
                metricType: 'company_hr',
                data: (companyHrUsers || []).map(h => ({
                  name: h.name,
                  email: h.email,
                  dept: h.dept,
                  companyName: company.name,
                  status: 'Active Recruiter',
                  badge: `${h.activeLinks || 0} Links Active`
                }))
              })}
            />
            <MetricCard 
              title="Verified Profiles" 
              value={verifiedCount} 
              subtext={`Out of ${companyCandidates.length} profiles`} 
              icon={CheckCircle2} 
              trend={`${Math.round((verifiedCount / (companyCandidates.length || 1)) * 100)}% Pass`}
              color="emerald" 
              onClick={() => setActiveDrilldown({
                title: 'Verified Employee Profiles Audit',
                subtitle: `Successfully verified candidates under ${company.name}`,
                metricValue: `${verifiedCount} Verified`,
                metricType: 'company_verified',
                data: (companyCandidates || []).filter(c => c.status === 'Verified').map(c => ({
                  name: c.name,
                  empId: c.empId,
                  mobile: c.mobile,
                  email: c.email,
                  dept: c.designation || 'Specialist',
                  companyName: company.name,
                  status: 'Verified',
                  verificationDate: c.verificationDate || 'Recent',
                  token: c.token
                }))
              })}
            />
            <MetricCard 
              title="In Progress / Pending" 
              value={pendingCount} 
              subtext="Awaiting Link Completion" 
              icon={Clock} 
              color="amber" 
              onClick={() => setActiveDrilldown({
                title: 'Pending & In-Progress Candidates',
                subtitle: `Candidates currently awaiting Aadhaar OTP, SMS OTP, or Face verification`,
                metricValue: `${pendingCount} Pending`,
                metricType: 'company_pending',
                data: (companyCandidates || []).filter(c => c.status !== 'Verified').map(c => ({
                  name: c.name,
                  empId: c.empId,
                  mobile: c.mobile,
                  email: c.email,
                  dept: c.designation || 'Specialist',
                  companyName: company.name,
                  status: c.status || 'In Progress',
                  token: c.token
                }))
              })}
            />
            <MetricCard 
              tourStep="company-quota-card"
              title="Monthly Quota Usage" 
              value={`${company.verifiedCountThisMonth} / ${company.maxLimit}`} 
              subtext={`Plan: ${company.plan}`} 
              icon={FileCheck} 
              color="indigo" 
              onClick={() => setActiveDrilldown({
                title: 'Monthly Verification Quota Consumption',
                subtitle: `Detailed usage breakdown for plan ${company.plan}`,
                metricValue: `${company.verifiedCountThisMonth} / ${company.maxLimit} (${Math.round((company.verifiedCountThisMonth/company.maxLimit)*100)}%)`,
                metricType: 'company_quota',
                data: [
                  { title: 'Verified Candidates this Month', amount: `${company.verifiedCountThisMonth} checks`, status: 'Consumed' },
                  { title: 'Remaining Balance Quota', amount: `${company.maxLimit - company.verifiedCountThisMonth} checks`, status: 'Available' },
                  { title: 'Current Billing Plan Tier', amount: `${company.plan} (₹${company.pricePerVerification}/check)`, status: 'Active Plan' }
                ]
              })}
            />
          </>
        )}
      </div>

      {/* TAB: MASTER EMPLOYEE REGISTRY */}
      {activeTab === 'registry' && (
        <div className="glass-panel p-4 sm:p-6 border-slate-200 bg-white space-y-4 rounded-2xl shadow-sm animate-tab-switch">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Employee Verification Master Registry</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Search, inspect, and download audit documents for all candidate records</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate name, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-9 text-xs"
              />
            </div>
          </div>

          {/* 💡 Point-in-Time Data Verification Notice Banner */}
          <div className="p-3 bg-amber-50/80 border border-amber-300/80 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong>Point-in-Time Truth Notice:</strong> Candidate KYC verifications reflect the authentic state in Government Repositories at the recorded timestamp.</span>
            </div>
            <button 
              onClick={() => setShowTermsModal(true)} 
              className="text-amber-900 font-bold hover:underline shrink-0 text-[11px] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Legal Disclosures & Terms 📄</span>
            </button>
          </div>

          {/* 📱 ADAPTIVE MOBILE CANDIDATE CARDS (< 640px) */}
          <div className="block sm:hidden space-y-3.5">
            {filteredCandidates.map(cand => {
              const lc = getCertificateLifecycle(cand);
              return (
                <div key={cand.id} className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-teal-500" />
                  
                  <div className="flex items-start justify-between gap-2.5 pt-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center font-black text-sm border border-sky-200 shrink-0">
                        {cand.name?.charAt(0) || 'C'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-900 text-sm truncate">{cand.name}</h4>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          {cand.designation || 'Specialist'} • #{cand.empId || 'EMP-2026'}
                        </p>
                      </div>
                    </div>

                    <span className={`badge font-black text-[10px] shrink-0 ${
                      cand.status === 'Verified' ? 'badge-emerald' : cand.status === 'In Verification' ? 'badge-cyan' : 'badge-amber'
                    }`}>
                      {cand.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Department</span>
                      <span className="font-bold text-slate-900 text-[11px] truncate block">{cand.dept || 'Engineering'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Email Address</span>
                      <span className="font-mono text-slate-700 text-[11px] truncate block">{cand.email}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Verification Checks</span>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-md border font-bold ${cand.verificationsCompleted?.aadhaar ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        Aadhaar {cand.verificationsCompleted?.aadhaar ? '✓' : '⌛'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-bold ${cand.verificationsCompleted?.mobile ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        Mobile {cand.verificationsCompleted?.mobile ? '✓' : '⌛'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border font-bold ${cand.verificationsCompleted?.face ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        Face {cand.verificationsCompleted?.face ? '✓' : '⌛'}
                      </span>
                    </div>
                  </div>

                  {lc.isVerified && (
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">60-Day Validity:</span>
                        <span className={lc.badgeColor}>{lc.badgeLabel}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${lc.progressPercent}%` }} 
                          className={`h-full rounded-full ${lc.isExpired || lc.status === 'critical' ? 'bg-rose-500' : lc.isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-bold">
                    <button 
                      onClick={() => setViewingBgvReportCandidate(cand)}
                      className="p-2 rounded-xl bg-purple-50 text-purple-950 border border-purple-200 hover:bg-purple-100 flex items-center justify-center gap-1 cursor-pointer btn-interactive text-center"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span className="truncate">360° Dossier</span>
                    </button>
                    <button 
                      onClick={() => setInspectCandidate(cand)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 flex items-center justify-center gap-1 cursor-pointer btn-interactive text-center"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">Inspect</span>
                    </button>
                    <button 
                      onClick={() => setDownloadingCandidate(cand)}
                      className="p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 flex items-center justify-center gap-1 cursor-pointer btn-interactive text-center shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Docs</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🖥️ WIDESCREEN DESKTOP TABLE (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold">
                  <th className="py-3 px-4">Employee Details</th>
                  <th className="py-3 px-4">Designation & Dept</th>
                  <th className="py-3 px-4">Aadhaar Check</th>
                  <th className="py-3 px-4">Mobile OTP</th>
                  <th className="py-3 px-4">Face Liveness</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Certificate Validity (60-Day)</th>
                  <th className="py-3 px-4 text-right">Document & Audit Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredCandidates.map(cand => {
                  const lc = getCertificateLifecycle(cand);
                  return (
                    <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">{cand.name}</div>
                        <div className="text-slate-500 text-[11px] font-medium">{cand.email} • ID: #{cand.empId}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-900 font-semibold">{cand.designation}</div>
                        <div className="text-slate-500 text-[11px]">{cand.dept}</div>
                      </td>
                      <td className="py-4 px-4">
                        {cand.verificationsCompleted.aadhaar ? (
                          <span className="badge badge-emerald text-[10px]">Verified ✅</span>
                        ) : (
                          <span className="badge badge-amber text-[10px]">Pending ⏳</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {cand.verificationsCompleted.mobile ? (
                          <span className="badge badge-emerald text-[10px]">OTP Verified ✅</span>
                        ) : (
                          <span className="badge badge-amber text-[10px]">Pending ⏳</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {cand.verificationsCompleted.face ? (
                          <span className="badge badge-emerald text-[10px]">Matched ✅</span>
                        ) : (
                          <span className="badge badge-amber text-[10px]">Pending ⏳</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`badge ${
                          cand.status === 'Verified' ? 'badge-emerald' : cand.status === 'In Verification' ? 'badge-cyan' : 'badge-amber'
                        }`}>
                          {cand.status}
                        </span>
                      </td>

                      {/* ⏳ 60-Day Certificate Validity */}
                      <td className="py-4 px-4 text-center">
                        {lc.isVerified ? (
                          <div className="space-y-1 inline-block text-left">
                            <span className={`badge text-[9px] py-0.5 px-2 font-black ${lc.badgeColor}`}>
                              {lc.badgeLabel}
                            </span>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                style={{ width: `${lc.progressPercent}%` }} 
                                className={`h-full rounded-full ${lc.isExpired || lc.status === 'critical' ? 'bg-rose-500' : lc.isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              />
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono block">Expires: {lc.expiryDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Pending</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button 
                            onClick={() => setViewingBgvReportCandidate(cand)}
                            className="btn btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold text-purple-900 bg-purple-50 border-purple-200 hover:bg-purple-100 btn-interactive"
                            title="View 10+ Multi-API Background Verification Dossier"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                            <span>360° BGV Dossier</span>
                          </button>
                          <button 
                            onClick={() => setInspectCandidate(cand)}
                            className="btn btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold btn-interactive"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-600" />
                            <span>Inspect</span>
                          </button>
                          <button 
                            onClick={() => setDownloadingCandidate(cand)}
                            className="btn btn-company text-xs px-2.5 py-1.5 flex items-center gap-1 font-bold btn-interactive"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Docs</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: EXECUTIVE TELEMETRY & TAT */}
      {activeTab === 'telemetry' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* API Credit Ledger & Verification Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: API Credit Balance */}
            <div className="p-5 rounded-xl border border-sky-200 bg-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-sky-700">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  <span>API Credit Quota Balance</span>
                </span>
                <span className="badge badge-cyan text-[10px]">{company.plan}</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {(company.maxLimit - company.verifiedCountThisMonth).toLocaleString()} Credits Left
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-1">
                <div 
                  style={{ width: `${Math.min(Math.round((company.verifiedCountThisMonth / company.maxLimit) * 100), 100)}%` }} 
                  className="h-full bg-gradient-to-r from-sky-500 to-teal-600 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Used <strong>{company.verifiedCountThisMonth}</strong> of <strong>{company.maxLimit}</strong> monthly credits ({company.verifiedCountThisMonth * 5} API calls executed).
              </p>
            </div>

            {/* Card 2: Passed Verifications */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Passed Verifications</span>
                </span>
                <span className="badge badge-emerald text-[10px]">Verified ✅</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {verifiedCount} Verified
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Aadhaar UIDAI + Mobile OTP + AI Face Match Passed 100%.
              </p>
            </div>

            {/* Card 3: Failed / Pending Verifications */}
            <div className="p-5 rounded-xl border border-rose-200 bg-white space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-rose-700">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Failed / Pending Action</span>
                </span>
                <span className="badge badge-rose text-[10px]">Action Needed</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {pendingCount} Pending / Failed
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Candidates requiring link re-dispatch or manual verification.
              </p>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border-slate-200 bg-white">
              <HrPerformanceChart hrUsers={companyHrUsers} />
            </div>
            
            <div className="glass-panel p-6 border-slate-200 bg-white">
              <TatDistributionChart />
            </div>
          </div>
        </div>
      )}

      {/* TAB: HR EXECUTIVE TEAM */}
            {activeTab === 'hrteam' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900">HR Recruiter Directory & Governance Hub</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {allCompanyHrUsers.length} Appointed Staff
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Onboard recruiters with automated self-activation links, 4-digit PIN security, and audit submitted statutory dossiers.
              </p>
            </div>
            
            <button 
              onClick={() => setShowAddHrModal(true)}
              className="btn btn-company text-xs flex items-center gap-1.5 py-2 px-4 shadow-md font-bold"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Onboard HR Recruiter 🚀</span>
            </button>
          </div>

          {/* HR RECRUITERS TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-black text-[10px] tracking-wider">
                  <th className="py-3 px-4">Recruiter Profile</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {allCompanyHrUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                      No HR recruiters onboarded yet. Click "+ Onboard HR Recruiter" to invite your first team member!
                    </td>
                  </tr>
                ) : (
                  allCompanyHrUsers.map(hr => {
                    const isPendingAct = hr.status === 'Pending Activation' || hr.activation_status === 'Pending Activation';
                    const isPendingApp = hr.status === 'Pending Approval' || hr.activation_status === 'Pending Approval';
                    const isAct = hr.status === 'Active';

                    return (
                      <tr key={hr.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-xs">
                              {hr.name ? hr.name.charAt(0).toUpperCase() : 'H'}
                            </div>
                            <div>
                              <div 
                                onClick={() => setGovernanceHr(hr)}
                                className="font-black text-slate-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer underline decoration-dotted decoration-indigo-300"
                                title="Click to view full HR profile & documents"
                              >
                                {hr.name}
                              </div>
                              <span className="font-mono text-[10px] text-slate-400">#{hr.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-mono font-bold text-slate-800 text-[11px]">{hr.email}</div>
                            <div className="text-[11px] text-slate-500">{hr.phone || (hr.personal_details || {}).phone || 'No phone set'}</div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div>
                            <div className="font-bold text-slate-800">{hr.dept || 'Human Resources'}</div>
                            <div className="text-[11px] text-slate-500">{hr.designation || 'HR Recruiter'}</div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {isPendingAct ? (
                              <span className="badge badge-amber text-[10px] font-black py-1 px-2 border border-amber-300">
                                🟡 PENDING ACTIVATION
                              </span>
                            ) : isPendingApp ? (
                              <span className="badge badge-purple text-[10px] font-black py-1 px-2 border border-purple-300 animate-pulse">
                                🟣 PENDING APPROVAL
                              </span>
                            ) : isAct ? (
                              <span className="badge badge-emerald text-[10px] font-black py-1 px-2 border border-emerald-300">
                                🟢 ACTIVE & VERIFIED
                              </span>
                            ) : (
                              <span className="badge badge-rose text-[10px] font-black py-1 px-2 border border-rose-300">
                                🔴 SUSPENDED
                              </span>
                            )}

                            {isPendingApp && (
                              <button
                                type="button"
                                onClick={() => handleApproveHr(hr.id, hr.name)}
                                className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer transition-all active:scale-95"
                                title="Approve & Grant Workstation Login"
                              >
                                ✅ Approve Recruiter
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setGovernanceHr(hr)}
                              className="btn btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1 font-bold bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800 shadow-2xs cursor-pointer"
                              title="View & Edit HR Profile, Reset Password, Check Educational Records"
                            >
                              <User className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Manage Profile ⚙️</span>
                            </button>

                            {isPendingAct && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setActivatingHr(hr)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer"
                                  title="View HR Activation Token & PIN"
                                >
                                  🔗 Link & PIN
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResendHrActivation(hr.id, hr.email)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 cursor-pointer"
                                  title="Resend Invitation Email"
                                >
                                  📧 Resend
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => handleToggleHrStatus(hr.id, hr.status)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                                hr.status === 'Suspended' || hr.status === 'Inactive'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                              }`}
                            >
                              {hr.status === 'Suspended' || hr.status === 'Inactive' ? 'Reactivate 🟢' : 'Suspend ⏸️'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: COMPLIANCE DOCUMENT STORAGE MANAGEMENT SYSTEM (DMS) */}
            {/* TAB: COMPANY PROFILE & STATUTORY DOCUMENTS */}
      {activeTab === 'profile_details' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 animate-fadeIn rounded-3xl shadow-sm">
          
          {/* 🏛️ BIDIRECTIONAL STATUTORY VERIFICATION STATUS BANNER (SuperAdmin <-> Company) */}
          <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
            company.verification_status === 'Verified' 
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : company.verification_status === 'Action Required'
              ? 'bg-amber-50/85 border-amber-300 text-amber-950'
              : company.verification_status === 'Under Review'
              ? 'bg-sky-50/80 border-sky-300 text-sky-950'
              : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-black/10 pb-3.5">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-sm ${
                  company.verification_status === 'Verified'
                    ? 'bg-emerald-600 text-white'
                    : company.verification_status === 'Action Required'
                    ? 'bg-amber-600 text-white'
                    : company.verification_status === 'Under Review'
                    ? 'bg-sky-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black tracking-tight">Corporate Statutory Profile Verification</h3>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${
                      company.verification_status === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : company.verification_status === 'Action Required'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : company.verification_status === 'Under Review'
                        ? 'bg-sky-100 text-sky-900 border-sky-300'
                        : 'bg-indigo-100 text-indigo-900 border-indigo-200'
                    }`}>
                      {company.verification_status === 'Verified' ? '🟢 STATUTORY VERIFIED ✓' : 
                       company.verification_status === 'Action Required' ? '⚠️ ACTION REQUIRED' :
                       company.verification_status === 'Under Review' ? '⏳ UNDER SUPERADMIN AUDIT' :
                       '📋 PENDING VERIFICATION'}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Real-time verification sync between Company Operations and SuperAdmin Compliance Registry
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={handleRequestReview}
                  disabled={isRequestingReview || company.verification_status === 'Under Review'}
                  className="btn text-xs py-2 px-3.5 font-bold flex items-center gap-1.5 rounded-xl cursor-pointer shadow-2xs bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 disabled:opacity-50"
                  title="Request SuperAdmin compliance team to review statutory credentials"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{company.verification_status === 'Under Review' ? 'Audit in Progress ⏳' : 'Request SuperAdmin Review 🚀'}</span>
                </button>
              </div>
            </div>

            {/* Verification Status Notes / Feedback from SuperAdmin */}
            {company.verification_notes && (
              <div className="mt-3 p-3 rounded-xl bg-white/70 border border-black/10 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong className="block font-bold">SuperAdmin Compliance Auditor Feedback:</strong>
                  <p className="text-[11.5px] opacity-90 mt-0.5">{company.verification_notes}</p>
                  {company.last_audited_at && (
                    <span className="text-[9.5px] opacity-70 block mt-1">
                      Last Audited: {new Date(company.last_audited_at).toLocaleString('en-IN')} IST
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Instant Gateway Verification Action Badges */}
            <div className="mt-3.5 pt-3 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wide opacity-80 mr-1">Statutory Gateways:</span>
                
                {/* GST Gateway */}
                <button
                  type="button"
                  onClick={() => handleVerifyCompanyDetail('gst')}
                  disabled={isVerifyingGst}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer border transition-all ${
                    (company.statutory_checks?.gst?.verified)
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {isVerifyingGst ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>GSTIN: {(company.statutory_checks?.gst?.verified) ? 'Verified ✓' : 'Verify via Gateway ⚡'}</span>
                </button>

                {/* PAN Gateway */}
                <button
                  type="button"
                  onClick={() => handleVerifyCompanyDetail('pan')}
                  disabled={isVerifyingPan}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer border transition-all ${
                    (company.statutory_checks?.pan?.verified)
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {isVerifyingPan ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>PAN: {(company.statutory_checks?.pan?.verified) ? 'Verified ✓' : 'Verify via NSDL ⚡'}</span>
                </button>

                {/* CIN Gateway */}
                <button
                  type="button"
                  onClick={() => handleVerifyCompanyDetail('cin')}
                  disabled={isVerifyingCin}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer border transition-all ${
                    (company.statutory_checks?.cin?.verified)
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {isVerifyingCin ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>CIN: {(company.statutory_checks?.cin?.verified) ? 'Verified ✓' : 'Verify via MCA ⚡'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveCompanyProfile}
                  disabled={isSavingProfile}
                  className="btn btn-company text-xs py-1.5 px-4 flex items-center gap-1.5 font-bold shadow-md cursor-pointer shrink-0"
                >
                  {isSavingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes 💾'}</span>
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveCompanyProfile} className="space-y-6 text-xs">
            
            {/* 1. CORPORATE BRANDING & LOGO MANAGEMENT */}
            <div className="p-4 bg-gradient-to-r from-sky-50/80 via-indigo-50/50 to-white border border-sky-200 rounded-2xl shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">Official Corporate Logo & Visual Branding</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Uploaded logo displays on Company Workstation, HR Dashboard, and all Candidate Profile Dossier PDFs</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100/70 border border-sky-200 px-2 py-0.5 rounded-md self-start sm:self-auto">
                  High-Resolution PNG / SVG Recommended
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                {/* Logo Preview Frame */}
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-sky-300 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {profileData.logo ? (
                    <img 
                      src={profileData.logo} 
                      alt="Company Logo" 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <div className="text-center p-1">
                      <Building2 className="w-7 h-7 text-slate-300 mx-auto" />
                      <span className="text-[8.5px] text-slate-400 font-black block mt-0.5 uppercase">No Logo</span>
                    </div>
                  )}
                </div>

                {/* Logo Actions */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="btn btn-primary text-xs py-1.5 px-3.5 cursor-pointer flex items-center gap-1.5 font-bold shadow-2xs">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{profileData.logo ? 'Change Company Logo 🖼️' : 'Upload Corporate Logo 🖼️'}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 3 * 1024 * 1024) {
                              showToast('⚠️ Logo file size exceeds 3MB limit. Please choose a smaller image.', 'error');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              setProfileData(prev => ({ ...prev, logo: reader.result }));
                              showToast('🖼️ Company logo loaded! Click "Save Company Details" to persist.');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {profileData.logo && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileData(prev => ({ ...prev, logo: '' }));
                          showToast('Logo cleared. Click "Save Company Details" to persist.');
                        }}
                        className="btn btn-secondary text-xs py-1.5 px-3 text-red-600 hover:bg-red-50 border-red-200 cursor-pointer font-bold"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    Corporate logo will be automatically injected into employee profile sheets, joining verification dossiers, and portal headers.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. MASTER CORPORATE IDENTITY & LOCATION DETAILS */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Corporate Legal Identity & Location</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {/* Company Full Legal Name (Editable!) */}
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Company Full Legal Name *</label>
                  <input 
                    type="text" 
                    required
                    value={profileData.name} 
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="e.g. Apex Global Technologies Private Limited"
                    className="form-input font-bold text-slate-900 bg-white" 
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Official registered entity title on compliance files</span>
                </div>

                {/* Company Registered Location / City */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / Head Office City *</label>
                  <input 
                    type="text" 
                    value={profileData.location} 
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="e.g. Bangalore, Karnataka"
                    className="form-input font-bold" 
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Primary operating city / facility</span>
                </div>

                {/* Contact Person Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Executive Contact Person</label>
                  <input 
                    type="text" 
                    value={profileData.contact_person} 
                    onChange={(e) => setProfileData({ ...profileData, contact_person: e.target.value })}
                    placeholder="e.g. Vikram Malhotra"
                    className="form-input font-bold" 
                  />
                </div>

                {/* Contact Mobile Number */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Contact Phone / Mobile</label>
                  <input 
                    type="tel" 
                    value={profileData.phone} 
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="form-input font-mono font-bold" 
                  />
                </div>

                {/* Official Corporate Website */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Corporate Website</label>
                  <input 
                    type="url" 
                    value={profileData.website} 
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://www.yourcompany.com"
                    className="form-input font-bold" 
                  />
                </div>

                {/* CIN */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corporate Identification Number (CIN) *</label>
                  <input 
                    type="text" 
                    value={profileData.cin_number} 
                    onChange={(e) => setProfileData({ ...profileData, cin_number: e.target.value.toUpperCase() })}
                    placeholder="e.g. U74999KA2026PTC192841"
                    className="form-input font-mono font-bold" 
                  />
                </div>

                {/* PAN */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company PAN Number *</label>
                  <input 
                    type="text" 
                    maxLength={10}
                    value={profileData.company_pan} 
                    onChange={(e) => setProfileData({ ...profileData, company_pan: e.target.value.toUpperCase() })}
                    placeholder="e.g. AAACJ1234F"
                    className="form-input font-mono font-bold" 
                  />
                </div>

                {/* GSTIN */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GSTIN Registration Number *</label>
                  <input 
                    type="text" 
                    maxLength={15}
                    value={profileData.gstin_number} 
                    onChange={(e) => setProfileData({ ...profileData, gstin_number: e.target.value.toUpperCase() })}
                    placeholder="e.g. 29AAAAA0000A1Z5"
                    className="form-input font-mono font-bold" 
                  />
                </div>

                {/* Industry Sector */}
                <div className="md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Industry Sector / Domain *</label>
                  <select
                    value={profileData.industry_sector}
                    onChange={(e) => setProfileData({ ...profileData, industry_sector: e.target.value })}
                    className="form-select font-bold text-xs"
                  >
                    <option value="Information Technology (IT/ITeS)">Information Technology (IT/ITeS)</option>
                    <option value="Banking, Financial Services & Insurance (BFSI)">Banking, Financial Services & Insurance (BFSI)</option>
                    <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                    <option value="E-Commerce, Logistics & Supply Chain">E-Commerce, Logistics & Supply Chain</option>
                    <option value="Manufacturing & Infrastructure">Manufacturing & Infrastructure</option>
                    <option value="Consulting & Professional Services">Consulting & Professional Services</option>
                  </select>
                </div>

                {/* Registered Corporate Office Address */}
                <div className="md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Registered Corporate Office Address *</label>
                  <textarea 
                    rows={2}
                    value={profileData.registered_address} 
                    onChange={(e) => setProfileData({ ...profileData, registered_address: e.target.value })}
                    placeholder="Floor No, Building Name, Street Address, City, State, Pincode"
                    className="form-input text-xs" 
                  />
                </div>
              </div>
            </div>

            {/* Statutory Documents Uploads */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-indigo-600" />
                  <span>Statutory Corporate Documents Vault</span>
                </h4>
                <span className="text-[10px] text-slate-400">PDF, JPG, PNG Supported</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Doc 1: COI */}
                <div className="p-3.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-2 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold text-[11px]">1. Certificate of Incorporation</strong>
                    {companyUploadedDocs.coi && <span className="badge badge-emerald text-[8px]">ATTACHED ✓</span>}
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleCompanyDocUpload('coi', e.target.files[0])}
                    className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[9px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                {/* Doc 2: Company PAN */}
                <div className="p-3.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-2 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold text-[11px]">2. Company PAN Card</strong>
                    {companyUploadedDocs.pan && <span className="badge badge-emerald text-[8px]">ATTACHED ✓</span>}
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleCompanyDocUpload('pan', e.target.files[0])}
                    className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[9px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                {/* Doc 3: GST */}
                <div className="p-3.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-2 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold text-[11px]">3. GST REG-06 Certificate</strong>
                    {companyUploadedDocs.gst && <span className="badge badge-emerald text-[8px]">ATTACHED ✓</span>}
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleCompanyDocUpload('gst', e.target.files[0])}
                    className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[9px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                {/* Doc 4: Board Resolution */}
                <div className="p-3.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-2 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 font-bold text-[11px]">4. Signatory / Resolution</strong>
                    {companyUploadedDocs.signatory_proof && <span className="badge badge-emerald text-[8px]">ATTACHED ✓</span>}
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleCompanyDocUpload('signatory_proof', e.target.files[0])}
                    className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[9px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="btn btn-company text-xs py-2 px-6 flex items-center gap-2 font-bold shadow-md cursor-pointer"
              >
                {isSavingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSavingProfile ? 'Saving Profile...' : 'Save Corporate Profile & Documents 💾'}</span>
              </button>
            </div>
          </form>

          {/* 3. COMPANY ADMINISTRATOR LOGIN PASSWORD UPDATE CARD */}
          <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <span>Company Administrator Login Password & Access Control</span>
                    <span className="badge badge-amber text-[9px]">SECURITY MASTER</span>
                  </h4>
                  <p className="text-slate-500 text-[10px] font-medium">
                    Change the password used to authenticate into this Company Admin Workstation ({company.email})
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateCompanyPassword} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Current Password (Optional verification) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Current Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      className="form-input font-mono pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[9.5px] text-slate-400 mt-0.5 block">For security verification</span>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">New Login Password *</label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 4 characters"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="form-input font-mono font-bold pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[9.5px] text-slate-400 mt-0.5 block">Alphanumeric password</span>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Confirm New Password *</label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Repeat new password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      className="form-input font-mono font-bold pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[9.5px] text-slate-400 mt-0.5 block">Must match exactly</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-[10.5px] text-slate-500 font-medium">
                  Updating this password will apply to all future logins for user <strong className="text-slate-700">{company.email}</strong>.
                </p>
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !passwordData.new_password}
                  className="btn bg-slate-900 hover:bg-slate-800 text-white text-xs py-2 px-5 flex items-center gap-2 font-black rounded-xl shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isUpdatingPassword ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isUpdatingPassword ? 'Updating Password...' : 'Update Login Password 🔐'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: ENTERPRISE VENDOR MANAGEMENT & STATUTORY VERIFICATION SUITE */}
      {activeTab === 'vendor_verification' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Banner & Corporate Credit Balance Indicator */}
          <div className="glass-panel p-6 border-slate-200 bg-white rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black shadow-2xs shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Enterprise Vendor Verification & Point-in-Time Audit Hub</h3>
                    <span className="badge badge-indigo text-[10px] font-black">GOVERNMENT STATUTORY GATEWAYS</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Verify vendor GSTIN, PAN, Bank Penny Drop (IMPS), MSME/Udyam, EPFO, and ESIC with formal point-in-time timestamped audit certificates.
                  </p>
                </div>
              </div>

              {/* Wallet Credits & Recharge CTA */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/80 p-3.5 rounded-2xl shadow-2xs">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-black tracking-wider text-slate-500">Corporate Verification Credits</div>
                  <div className="text-base font-black text-slate-900 flex items-center justify-end gap-1">
                    <span className="text-amber-600">₹</span>
                    <span>{(company.walletBalance || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-500">
                    ~{Math.floor((company.walletBalance || 0) / 60)} checks (@ ₹60/check)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRazorpayModal(true)}
                  className="btn bg-amber-500 hover:bg-amber-600 text-white text-xs py-2 px-3.5 font-black rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Recharge ⚡</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10.5px] font-bold text-slate-500 block">Total Registered Vendors</span>
                <span className="text-lg font-black text-slate-900">
                  {(vendors || []).filter(v => !v.companyId || v.companyId === company.id || v.companyId === 'comp-joy' || v.companyId === 'comp-1').length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10.5px] font-bold text-emerald-800 block">Fully Verified Vendors</span>
                <span className="text-lg font-black text-emerald-900">
                  {(vendors || []).filter(v => (!v.companyId || v.companyId === company.id || v.companyId === 'comp-joy' || v.companyId === 'comp-1') && v.verifications?.gst?.verified && v.verifications?.pan?.verified).length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                <span className="text-[10.5px] font-bold text-indigo-800 block">Deduction per Verification</span>
                <span className="text-lg font-black text-indigo-900">₹60.00</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10.5px] font-bold text-amber-800 block">Certificate Format</span>
                <span className="text-xs font-black text-amber-900 mt-1 block">Point-in-Time PDF 📄</span>
              </div>
            </div>

            {/* Filter Bar & Register Vendor CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by vendor name, code, contact, GSTIN, or PAN..."
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    className="form-input pl-8 text-xs font-medium w-full"
                  />
                </div>
                <select
                  value={vendorCategoryFilter}
                  onChange={(e) => setVendorCategoryFilter(e.target.value)}
                  className="form-select text-xs font-bold w-auto"
                >
                  <option value="All">All Categories</option>
                  <option value="IT Infrastructure & Cloud Services">IT Infrastructure</option>
                  <option value="Corporate Logistics & Fleet">Logistics & Fleet</option>
                  <option value="Security & Facility Management">Facility Management</option>
                  <option value="Staffing & Manpower Solutions">Staffing & Manpower</option>
                  <option value="Consulting & Legal Advisory">Consulting & Legal</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowAddVendorModal(true)}
                className="btn btn-company text-xs py-2 px-4 font-bold flex items-center gap-2 shadow-sm cursor-pointer shrink-0 w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Vendor ➕</span>
              </button>
            </div>

            {/* Vendors Directory Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/90 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Vendor & Identity</th>
                      <th className="py-3 px-3">Contact Details</th>
                      <th className="py-3 px-3">Statutory Verification Checks</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {(() => {
                      const filteredVendors = (vendors || []).filter(v => {
                        const matchesCompany = !v.companyId || v.companyId === company.id || v.companyId === 'comp-joy' || v.companyId === 'comp-1';
                        if (!matchesCompany) return false;
                        if (vendorCategoryFilter !== 'All' && v.category !== vendorCategoryFilter) return false;
                        if (vendorSearch.trim()) {
                          const q = vendorSearch.toLowerCase();
                          return (
                            (v.vendorName || '').toLowerCase().includes(q) ||
                            (v.vendorCode || '').toLowerCase().includes(q) ||
                            (v.contactPerson || '').toLowerCase().includes(q) ||
                            (v.email || '').toLowerCase().includes(q) ||
                            (v.phone || '').toLowerCase().includes(q) ||
                            (v.gstin || '').toLowerCase().includes(q) ||
                            (v.pan || '').toLowerCase().includes(q)
                          );
                        }
                        return true;
                      });

                      if (filteredVendors.length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="py-10 text-center text-slate-400">
                              <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                              <p className="font-bold text-sm text-slate-600">No vendors found matching your criteria</p>
                              <p className="text-xs text-slate-400 mt-0.5">Click "Register New Vendor" to add your first vendor.</p>
                            </td>
                          </tr>
                        );
                      }

                      return filteredVendors.map((vendor) => {
                        const verifs = vendor.verifications || {};
                        return (
                          <tr key={vendor.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* Col 1: Vendor Name & Category */}
                            <td className="py-3.5 px-4 align-top">
                              <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                                <span>{vendor.vendorName}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="badge badge-purple text-[9px] font-mono font-bold py-0.5 px-2">
                                  {vendor.vendorCode || 'VEND'}
                                </span>
                                <span className="badge badge-cyan text-[9px] font-bold py-0.5 px-2">
                                  {vendor.category || 'General Vendor'}
                                </span>
                              </div>
                              {vendor.address && (
                                <p className="text-[10.5px] text-slate-500 font-normal mt-1 line-clamp-1">
                                  📍 {vendor.address}
                                </p>
                              )}
                            </td>

                            {/* Col 2: Contact Details */}
                            <td className="py-3.5 px-3 align-top text-[11px] space-y-0.5">
                              <div className="font-bold text-slate-800 flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                <span>{vendor.contactPerson || 'N/A'}</span>
                              </div>
                              <div className="text-slate-600 font-mono text-[10.5px]">
                                📞 {vendor.phone || 'N/A'}
                              </div>
                              <div className="text-slate-500 text-[10.5px]">
                                ✉️ {vendor.email || 'N/A'}
                              </div>
                            </td>

                            {/* Col 3: Statutory Verification Check Matrix */}
                            <td className="py-3.5 px-3 align-top">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-w-md">
                                
                                {/* GST Check */}
                                <div className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between gap-1 ${
                                  verifs.gst?.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}>
                                  <div>
                                    <strong className="block font-black">GSTIN</strong>
                                    <span className="font-mono text-[9px] block truncate max-w-[80px]">
                                      {vendor.gstin || 'Not set'}
                                    </span>
                                  </div>
                                  {verifs.gst?.verified ? (
                                    <span className="text-emerald-600 font-black text-[11px]">✓</span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenVerifyModal(vendor, 'gst')}
                                      className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[9px] cursor-pointer"
                                      title="Verify GSTIN (Deducts ₹60)"
                                    >
                                      Verify ⚡
                                    </button>
                                  )}
                                </div>

                                {/* PAN Check */}
                                <div className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between gap-1 ${
                                  verifs.pan?.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}>
                                  <div>
                                    <strong className="block font-black">PAN Card</strong>
                                    <span className="font-mono text-[9px] block truncate max-w-[80px]">
                                      {vendor.pan || 'Not set'}
                                    </span>
                                  </div>
                                  {verifs.pan?.verified ? (
                                    <span className="text-emerald-600 font-black text-[11px]">✓</span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenVerifyModal(vendor, 'pan')}
                                      className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[9px] cursor-pointer"
                                      title="Verify PAN (Deducts ₹60)"
                                    >
                                      Verify ⚡
                                    </button>
                                  )}
                                </div>

                                {/* Bank Penny Drop IMPS */}
                                <div className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between gap-1 ${
                                  verifs.bank?.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}>
                                  <div>
                                    <strong className="block font-black">Bank IMPS</strong>
                                    <span className="font-mono text-[9px] block truncate max-w-[80px]">
                                      {vendor.bankAccount ? `••••${vendor.bankAccount.slice(-4)}` : 'Not set'}
                                    </span>
                                  </div>
                                  {verifs.bank?.verified ? (
                                    <span className="text-emerald-600 font-black text-[11px]">✓</span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenVerifyModal(vendor, 'bank')}
                                      className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[9px] cursor-pointer"
                                      title="Verify Bank Account (Deducts ₹60)"
                                    >
                                      Verify ⚡
                                    </button>
                                  )}
                                </div>

                                {/* MSME Udyam */}
                                <div className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between gap-1 ${
                                  verifs.msme?.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}>
                                  <div>
                                    <strong className="block font-black">MSME Udyam</strong>
                                    <span className="font-mono text-[9px] block truncate max-w-[80px]">
                                      {vendor.msmeNumber || 'Not set'}
                                    </span>
                                  </div>
                                  {verifs.msme?.verified ? (
                                    <span className="text-emerald-600 font-black text-[11px]">✓</span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenVerifyModal(vendor, 'msme')}
                                      className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[9px] cursor-pointer"
                                      title="Verify MSME (Deducts ₹60)"
                                    >
                                      Verify ⚡
                                    </button>
                                  )}
                                </div>

                                {/* EPFO */}
                                <div className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between gap-1 ${
                                  verifs.epfo?.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}>
                                  <div>
                                    <strong className="block font-black">EPFO Est.</strong>
                                    <span className="font-mono text-[9px] block truncate max-w-[80px]">
                                      {vendor.epfoNumber || 'Not set'}
                                    </span>
                                  </div>
                                  {verifs.epfo?.verified ? (
                                    <span className="text-emerald-600 font-black text-[11px]">✓</span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenVerifyModal(vendor, 'epfo')}
                                      className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[9px] cursor-pointer"
                                      title="Verify EPFO (Deducts ₹60)"
                                    >
                                      Verify ⚡
                                    </button>
                                  )}
                                </div>

                                {/* ESIC */}
                                <div className={`p-1.5 rounded-lg border text-[10px] flex items-center justify-between gap-1 ${
                                  verifs.esic?.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}>
                                  <div>
                                    <strong className="block font-black">ESIC Reg.</strong>
                                    <span className="font-mono text-[9px] block truncate max-w-[80px]">
                                      {vendor.esicNumber || 'Not set'}
                                    </span>
                                  </div>
                                  {verifs.esic?.verified ? (
                                    <span className="text-emerald-600 font-black text-[11px]">✓</span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenVerifyModal(vendor, 'esic')}
                                      className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[9px] cursor-pointer"
                                      title="Verify ESIC (Deducts ₹60)"
                                    >
                                      Verify ⚡
                                    </button>
                                  )}
                                </div>

                              </div>
                            </td>

                            {/* Col 4: Action Buttons */}
                            <td className="py-3.5 px-4 align-top text-right">
                              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenVerifyModal(vendor, 'gst')}
                                  className="btn btn-secondary text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-bold bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800 cursor-pointer shadow-2xs"
                                  title="Verify any vendor statutory document"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                                  <span>Verify ⚡</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedCertVendor(vendor)}
                                  className="btn text-[11px] py-1.5 px-2.5 flex items-center gap-1 font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs cursor-pointer"
                                  title="Download Official Point-in-Time Verification Certificate PDF"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Certificate 📄</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteVendor(vendor.id, vendor.vendorName)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
                                  title="Remove vendor"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* ⚡ MODAL: VERIFY VENDOR STATUTORY DOCUMENT */}
          {verifyingDocModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-slate-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">
                        Statutory Document Verification
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {verifyingDocModal.vendor.vendorName} ({verifyingDocModal.vendor.vendorCode || 'VEND'})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerifyingDocModal(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleExecuteVendorCheck} className="p-6 space-y-4 text-xs">
                  {/* Document Type Selector */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Select Document Check Type *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'gst', label: 'GSTIN Portal' },
                        { id: 'pan', label: 'Vendor PAN' },
                        { id: 'bank', label: 'Bank Penny Drop' },
                        { id: 'msme', label: 'MSME / Udyam' },
                        { id: 'epfo', label: 'EPFO Est.' },
                        { id: 'esic', label: 'ESIC Reg.' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            let docVal = '';
                            if (item.id === 'gst') docVal = verifyingDocModal.vendor.gstin || '';
                            else if (item.id === 'pan') docVal = verifyingDocModal.vendor.pan || '';
                            else if (item.id === 'bank') docVal = verifyingDocModal.vendor.bankAccount || '';
                            else if (item.id === 'msme') docVal = verifyingDocModal.vendor.msmeNumber || '';
                            else if (item.id === 'epfo') docVal = verifyingDocModal.vendor.epfoNumber || '';
                            else if (item.id === 'esic') docVal = verifyingDocModal.vendor.esicNumber || '';

                            setVerifyingDocModal(prev => ({
                              ...prev,
                              checkType: item.id,
                              docNumber: docVal
                            }));
                          }}
                          className={`py-2 px-2.5 rounded-xl font-bold text-[11px] text-center border transition-all cursor-pointer ${
                            verifyingDocModal.checkType === item.id
                              ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Document Number Input */}
                  {verifyingDocModal.checkType !== 'bank' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {verifyingDocModal.checkType === 'gst' ? 'GSTIN Registration Number (15 Digits) *' :
                         verifyingDocModal.checkType === 'pan' ? 'Vendor Company PAN Number (10 Characters) *' :
                         verifyingDocModal.checkType === 'msme' ? 'MSME Udyam Registration Number *' :
                         verifyingDocModal.checkType === 'epfo' ? 'EPFO Establishment Code *' :
                         'ESIC Employer Registration Number *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={verifyingDocModal.docNumber}
                        onChange={(e) => setVerifyingDocModal(prev => ({ ...prev, docNumber: e.target.value.toUpperCase() }))}
                        placeholder={
                          verifyingDocModal.checkType === 'gst' ? 'e.g. 29AAAAA0000A1Z5' :
                          verifyingDocModal.checkType === 'pan' ? 'e.g. AAACJ1234F' :
                          verifyingDocModal.checkType === 'msme' ? 'e.g. UDYAM-KA-03-0012345' :
                          'e.g. MHBAN0012345000'
                        }
                        className="form-input font-mono font-bold text-xs"
                      />
                    </div>
                  )}

                  {/* Bank Account Details (Penny Drop) */}
                  {verifyingDocModal.checkType === 'bank' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Bank Account Number *</label>
                        <input
                          type="text"
                          required
                          value={verifyingDocModal.bankAccount}
                          onChange={(e) => setVerifyingDocModal(prev => ({ ...prev, bankAccount: e.target.value }))}
                          placeholder="e.g. 987654321012"
                          className="form-input font-mono font-bold text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Bank IFSC Code *</label>
                          <input
                            type="text"
                            required
                            maxLength={11}
                            value={verifyingDocModal.bankIfsc}
                            onChange={(e) => setVerifyingDocModal(prev => ({ ...prev, bankIfsc: e.target.value.toUpperCase() }))}
                            placeholder="e.g. HDFC0001234"
                            className="form-input font-mono font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Beneficiary Name</label>
                          <input
                            type="text"
                            value={verifyingDocModal.beneficiaryName}
                            onChange={(e) => setVerifyingDocModal(prev => ({ ...prev, beneficiaryName: e.target.value }))}
                            placeholder="Vendor Name"
                            className="form-input font-bold text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wallet Credit Deduction & Statutory Audit Notice */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="flex items-center gap-1.5 text-amber-900">
                        <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                        Verification Charge:
                      </span>
                      <span className="font-mono font-black text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                        ₹60.00 debited from Wallet
                      </span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed opacity-90 text-amber-900">
                      ⚡ Live Query Execution: This query authenticates data directly via government statutory API gateways. A formal <strong>Point-in-Time Temporal Audit Certificate</strong> will be minted for this exact moment.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setVerifyingDocModal(null)}
                      className="btn btn-secondary text-xs py-2 px-3.5 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingVendorCheck}
                      className="btn btn-company text-xs py-2 px-5 font-black flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isProcessingVendorCheck ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      <span>{isProcessingVendorCheck ? 'Querying Gateway...' : 'Execute Live Verification (₹60) ⚡'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 🏢 MODAL: REGISTER NEW VENDOR */}
          {showAddVendorModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-slate-50 to-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-900">
                        Register New Enterprise Vendor
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Onboard vendor for corporate compliance and statutory document verification
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddVendorModal(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddNewVendorSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Vendor Company Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={newVendorForm.vendorName}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, vendorName: e.target.value })}
                        placeholder="e.g. ZenScale Infrastructure Private Limited"
                        className="form-input font-bold"
                      />
                    </div>

                    {/* Category */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Vendor Industry Category *</label>
                      <select
                        value={newVendorForm.category}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, category: e.target.value })}
                        className="form-select font-bold text-xs"
                      >
                        <option value="IT Infrastructure & Cloud Services">IT Infrastructure & Cloud Services</option>
                        <option value="Corporate Logistics & Fleet">Corporate Logistics & Fleet</option>
                        <option value="Security & Facility Management">Security & Facility Management</option>
                        <option value="Manpower & Staffing Solutions">Manpower & Staffing Solutions</option>
                        <option value="Consulting & Legal Advisory">Consulting & Legal Advisory</option>
                        <option value="Catering & Hospitality Services">Catering & Hospitality Services</option>
                      </select>
                    </div>

                    {/* Contact Person */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Person Name *</label>
                      <input
                        type="text"
                        required
                        value={newVendorForm.contactPerson}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, contactPerson: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        className="form-input font-bold"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Phone / Mobile</label>
                      <input
                        type="tel"
                        value={newVendorForm.phone}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, phone: e.target.value })}
                        placeholder="e.g. +91 98450 11223"
                        className="form-input font-mono"
                      />
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Contact Email Address</label>
                      <input
                        type="email"
                        value={newVendorForm.email}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, email: e.target.value })}
                        placeholder="e.g. billing@zenscale.com"
                        className="form-input"
                      />
                    </div>

                    {/* GSTIN */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        maxLength={15}
                        value={newVendorForm.gstin}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, gstin: e.target.value.toUpperCase() })}
                        placeholder="e.g. 29AAAAA0000A1Z5"
                        className="form-input font-mono font-bold"
                      />
                    </div>

                    {/* PAN */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Vendor PAN Number</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={newVendorForm.pan}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, pan: e.target.value.toUpperCase() })}
                        placeholder="e.g. AAACJ1234F"
                        className="form-input font-mono font-bold"
                      />
                    </div>

                    {/* Bank Account */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Bank Account Number</label>
                      <input
                        type="text"
                        value={newVendorForm.bankAccount}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, bankAccount: e.target.value })}
                        placeholder="e.g. 987654321001"
                        className="form-input font-mono font-bold"
                      />
                    </div>

                    {/* Bank IFSC */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Bank IFSC Code</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={newVendorForm.bankIfsc}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, bankIfsc: e.target.value.toUpperCase() })}
                        placeholder="e.g. HDFC0001234"
                        className="form-input font-mono font-bold"
                      />
                    </div>

                    {/* MSME */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">MSME Udyam Registration Number</label>
                      <input
                        type="text"
                        value={newVendorForm.msmeNumber}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, msmeNumber: e.target.value.toUpperCase() })}
                        placeholder="e.g. UDYAM-KA-03-0012345"
                        className="form-input font-mono font-bold"
                      />
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Vendor Registered Address</label>
                      <textarea
                        rows={2}
                        value={newVendorForm.address}
                        onChange={(e) => setNewVendorForm({ ...newVendorForm, address: e.target.value })}
                        placeholder="Building, Street, City, State, Pincode"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddVendorModal(false)}
                      className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-company text-xs py-2 px-5 font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Save & Register Vendor 🏢</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'dochub' && (
        <DocumentStorageHub />
      )}

      {/* TAB: COMPANY ADMIN CONFIGURATION & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span>Company Governance, Verification Rules & Settings</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Configure AI face liveness match thresholds, low API credit alerts, and HR team seat limits.</p>
            </div>
            <span className="badge badge-cyan text-[10px]">Company Account Settings</span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateRoleSettings('company', systemSettings.company);
            }} 
            className="space-y-6 text-xs"
          >
                        {/* 📧 COMPANY CUSTOM OUTGOING SMTP MAIL SERVER CONFIGURATION */}
            <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/70 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base">
                      Company Outgoing Mail Server & SMTP Gateway Configuration
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Configure your company's dedicated mail server to dispatch HR onboarding invitations and candidate verification links.
                    </p>
                  </div>
                </div>

                <span className="badge badge-emerald text-[10px] font-black">
                  {smtpForm.use_custom_smtp ? 'CUSTOM COMPANY SMTP ACTIVE' : 'PLATFORM MASTER FALLBACK'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SMTP Host Server *</label>
                  <input
                    type="text"
                    value={smtpForm.host}
                    onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                    placeholder="mail.joycorporatesolutions.com"
                    className="form-input font-mono text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SMTP Port *</label>
                  <input
                    type="number"
                    value={smtpForm.port}
                    onChange={(e) => setSmtpForm({ ...smtpForm, port: parseInt(e.target.value) || 465 })}
                    placeholder="465"
                    className="form-input font-mono text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SMTP Username / Email *</label>
                  <input
                    type="text"
                    value={smtpForm.user}
                    onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })}
                    placeholder="info@joycorporatesolutions.com"
                    className="form-input font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SMTP Webmail Password *</label>
                  <input
                    type="password"
                    value={smtpForm.password}
                    onChange={(e) => setSmtpForm({ ...smtpForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="form-input font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Display Name (From Header)</label>
                  <input
                    type="text"
                    value={smtpForm.from_name}
                    onChange={(e) => setSmtpForm({ ...smtpForm, from_name: e.target.value })}
                    placeholder={`${company?.name || 'Company'} - HR Desk`}
                    className="form-input text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Email Address</label>
                  <input
                    type="email"
                    value={smtpForm.from_email}
                    onChange={(e) => setSmtpForm({ ...smtpForm, from_email: e.target.value })}
                    placeholder={company?.email || 'info@joycorporatesolutions.com'}
                    className="form-input font-mono text-xs"
                  />
                </div>
              </div>

              {/* SAVE & LIVE TEST TOOLBAR */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-indigo-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={testSmtpEmail}
                    onChange={(e) => setTestSmtpEmail(e.target.value)}
                    placeholder="Enter test recipient email..."
                    className="form-input text-xs w-full sm:w-64 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestSmtp}
                    disabled={isTestingSmtp}
                    className="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 cursor-pointer shadow-2xs whitespace-nowrap"
                  >
                    {isTestingSmtp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <SendHorizontal className="w-3.5 h-3.5" />}
                    <span>{isTestingSmtp ? 'Sending...' : 'Send Live Test Email 📨'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSmtp}
                  disabled={isSavingSmtp}
                  className="btn btn-primary text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSmtp ? 'Saving...' : '💾 Save SMTP Configuration to PostgreSQL'}</span>
                </button>
              </div>
            </div>


            {/* 🏢 VERIFICATION MODULES & PIPELINE TOGGLES (ACTIVE CHECKS FOR EMPLOYEE LINK) */}
            <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base">
                      Verification Checks & Feature Modules (Company Controls)
                    </h4>
                    <p className="text-slate-500 text-[11px]">
                      Enable or disable verification checks required for your candidates on their onboarding link
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAadhaarOnlyMode}
                    className="btn btn-secondary text-[11px] py-1.5 px-3 font-black text-emerald-800 bg-emerald-50 border-emerald-300 hover:bg-emerald-100 cursor-pointer"
                  >
                    ⚡ Aadhaar Only Mode
                  </button>

                  <button
                    type="button"
                    onClick={handleEnableAllModules}
                    className="btn btn-secondary text-[11px] py-1.5 px-3 font-bold text-indigo-900 bg-indigo-50 border-indigo-300 hover:bg-indigo-100 cursor-pointer"
                  >
                    🌟 Enable All Modules
                  </button>
                </div>
              </div>

              {/* Module Toggle Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                
                {/* 1. Aadhaar */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.aadhaar !== false ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🪪</span>
                      <strong className="text-slate-900 font-black">Aadhaar UIDAI Live e-KYC</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">OTP & Demographics data fetching</p>
                    <span className="badge badge-emerald text-[9px] font-black">PRIMARY GOVT ID</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={company.features?.aadhaar !== false}
                    onChange={(e) => handleToggleFeature('aadhaar', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 2. Mobile SMS OTP */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.mobileOtp ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">📱</span>
                      <strong className="text-slate-900 font-black">Mobile SMS OTP</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Carrier SMS 6-digit OTP code</p>
                    <span className={`badge text-[9px] font-black ${company.features?.mobileOtp ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.mobileOtp ? 'ACTIVE' : 'PAUSED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.mobileOtp}
                    onChange={(e) => handleToggleFeature('mobileOtp', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 3. Official Email */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.emailGateway ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">📧</span>
                      <strong className="text-slate-900 font-black">Email OTP Verification</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Official inbox confirmation code</p>
                    <span className={`badge text-[9px] font-black ${company.features?.emailGateway ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.emailGateway ? 'ACTIVE' : 'PAUSED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.emailGateway}
                    onChange={(e) => handleToggleFeature('emailGateway', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 4. AI Live Face Biometrics */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.aiFaceBiometrics ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🤳</span>
                      <strong className="text-slate-900 font-black">AI Live Face Match</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">3D Liveness & photo match</p>
                    <span className={`badge text-[9px] font-black ${company.features?.aiFaceBiometrics ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.aiFaceBiometrics ? 'ACTIVE' : 'PAUSED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.aiFaceBiometrics}
                    onChange={(e) => handleToggleFeature('aiFaceBiometrics', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 5. PAN Card */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.pan ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">💳</span>
                      <strong className="text-slate-900 font-black">PAN Card (NSDL)</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Tax ID & Aadhaar Link audit</p>
                    <span className={`badge text-[9px] font-black ${company.features?.pan ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.pan ? 'ACTIVE' : 'REMOVED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.pan}
                    onChange={(e) => handleToggleFeature('pan', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 6. Bank Penny Drop */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.bankCheck ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🏦</span>
                      <strong className="text-slate-900 font-black">Bank Penny Drop</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">IMPS Account Holder match</p>
                    <span className={`badge text-[9px] font-black ${company.features?.bankCheck ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.bankCheck ? 'ACTIVE' : 'REMOVED / OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.bankCheck}
                    onChange={(e) => handleToggleFeature('bankCheck', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 7. EPFO UAN */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.uan ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🏢</span>
                      <strong className="text-slate-900 font-black">EPFO UAN Dual Employment</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Service history & passbook</p>
                    <span className={`badge text-[9px] font-black ${company.features?.uan ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.uan ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.uan}
                    onChange={(e) => handleToggleFeature('uan', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 8. Driving License */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.drivingLicense ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🚗</span>
                      <strong className="text-slate-900 font-black">Driving License (MoRTH)</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Sarathi DL status verification</p>
                    <span className={`badge text-[9px] font-black ${company.features?.drivingLicense ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.drivingLicense ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.drivingLicense}
                    onChange={(e) => handleToggleFeature('drivingLicense', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

                {/* 9. Passport */}
                <div className={`p-3.5 rounded-xl border-2 transition-all flex items-start justify-between gap-3 ${
                  company.features?.passport ? 'bg-indigo-50/60 border-indigo-300 shadow-2xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">🛂</span>
                      <strong className="text-slate-900 font-black">MEA Passport Direct</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Ministry of External Affairs check</p>
                    <span className={`badge text-[9px] font-black ${company.features?.passport ? 'badge-indigo' : 'bg-slate-200 text-slate-600'}`}>
                      {company.features?.passport ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={!!company.features?.passport}
                    onChange={(e) => handleToggleFeature('passport', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded mt-1 cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* ⚡ MASTER API ROUTING ENGINE SELECTOR (SERVER 1 SANDBOX vs SERVER 2 COINCIRCLE) */}
            <div className="p-6 rounded-2xl border-2 border-teal-300 bg-gradient-to-br from-teal-50/80 via-white to-sky-50/80 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-600 text-white shadow-sm">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm sm:text-base">Upstream Verification Server Routing Engine</h4>
                    <p className="text-slate-500 text-[11px]">Select your company's upstream data fetching engine between Server 1 (Sandbox) and Server 2 (CoinCircleTrust)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="badge badge-emerald text-[10px] font-bold">
                    Active: {company.apiRoutingEngine === 'server1' ? 'Server 1 Only' : company.apiRoutingEngine === 'server2' ? 'Server 2 Only' : 'Smart Hybrid ⚡'}
                  </span>
                </div>
              </div>

              {/* Engine Selector Radio Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* 1. Smart Hybrid Engine (Recommended) */}
                <div 
                  onClick={() => updateCompanyRoutingEngine(company.id, 'hybrid')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                    (company.apiRoutingEngine || 'hybrid') === 'hybrid'
                      ? 'border-teal-600 bg-white shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:border-teal-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-emerald text-[9px] font-black">RECOMMENDED</span>
                      <input 
                        type="radio" 
                        name="routingEngine"
                        checked={(company.apiRoutingEngine || 'hybrid') === 'hybrid'}
                        onChange={() => updateCompanyRoutingEngine(company.id, 'hybrid')}
                        className="text-teal-600"
                      />
                    </div>
                    <strong className="text-slate-900 font-black text-xs block">⚡ Smart Hybrid Engine</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Routes standard IDs via <strong>Server 1 (Sandbox)</strong>. Automatically routes non-Sandbox checks (<strong>Passport, EPFO UAN V3, Court Records, Moonlighting Directorship</strong>) via <strong>Server 2 (CoinCircleTrust)</strong>.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-teal-800">
                    <span>Zero Missing Doc Fallbacks</span>
                    <span>100% Coverage</span>
                  </div>
                </div>

                {/* 2. Server 1 Only (Sandbox API) */}
                <div 
                  onClick={() => updateCompanyRoutingEngine(company.id, 'server1')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    company.apiRoutingEngine === 'server1'
                      ? 'border-indigo-600 bg-white shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:border-indigo-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-indigo text-[9px] font-black">SERVER 1</span>
                      <input 
                        type="radio" 
                        name="routingEngine"
                        checked={company.apiRoutingEngine === 'server1'}
                        onChange={() => updateCompanyRoutingEngine(company.id, 'server1')}
                        className="text-indigo-600"
                      />
                    </div>
                    <strong className="text-slate-900 font-black text-xs block">🌐 Server 1: Sandbox API Router</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Exclusively queries Sandbox API (<code className="font-mono text-[10px]">api.sandbox.co.in</code>). Fast standard checks for Aadhaar, PAN, Bank IMPS, and Driving License.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Latency: ~48ms</span>
                    <span>Cost: ₹2.50/call</span>
                  </div>
                </div>

                {/* 3. Server 2 Only (CoinCircleTrust 47+ APIs) */}
                <div 
                  onClick={() => updateCompanyRoutingEngine(company.id, 'server2')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    company.apiRoutingEngine === 'server2'
                      ? 'border-purple-600 bg-white shadow-md ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:border-purple-300 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-purple text-[9px] font-black">SERVER 2 (47+ APIs)</span>
                      <input 
                        type="radio" 
                        name="routingEngine"
                        checked={company.apiRoutingEngine === 'server2'}
                        onChange={() => updateCompanyRoutingEngine(company.id, 'server2')}
                        className="text-purple-600"
                      />
                    </div>
                    <strong className="text-slate-900 font-black text-xs block">🛡️ Server 2: CoinCircleTrust</strong>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Exclusively queries CoinCircleTrust (<code className="font-mono text-[10px]">api.coincircletrust.com</code>). Full institutional BGV, Passport, Court eCourts, Dual Employment, and 3D Biometrics.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-purple-700 font-bold">
                    <span>47 Enterprise APIs</span>
                    <span>Cost: ₹4.00/call</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Verification Rules & AI Thresholds */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verification Rules & AI Thresholds</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">AI WebCam Face Match Confidence Threshold (%)</label>
                  <input 
                    type="number" 
                    min="50"
                    max="100"
                    value={systemSettings.company?.faceMatchThreshold || 85}
                    onChange={(e) => updateRoleSettings('company', { faceMatchThreshold: parseInt(e.target.value) || 85 })}
                    className="form-input text-xs font-mono font-bold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Minimum AI confidence score required for biometrics verification pass.</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mandatory Aadhaar UIDAI OTP Requirement</label>
                  <select 
                    value={systemSettings.company?.mandatoryAadhaarOtp ? 'true' : 'false'}
                    onChange={(e) => updateRoleSettings('company', { mandatoryAadhaarOtp: e.target.value === 'true' })}
                    className="form-select text-xs font-bold"
                  >
                    <option value="true">Enforced 🟢 (Mandhaar OTP verification required)</option>
                    <option value="false">Optional 🟡 (Allow skip if DL/PAN present)</option>
                  </select>
                </div>
              </div>

              {/* Card 2: API Quota Alerts & HR Team Governance */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Credit Quota Alerts & HR Seats</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Low API Credit Alert Trigger Limit</label>
                  <input 
                    type="number" 
                    value={systemSettings.company?.lowCreditAlertThreshold || 50}
                    onChange={(e) => updateRoleSettings('company', { lowCreditAlertThreshold: parseInt(e.target.value) || 50 })}
                    className="form-input text-xs font-mono font-bold"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Triggers warning toast when remaining credits drop below this value.</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max HR Executive Workstation Seats Limit</label>
                  <input 
                    type="number" 
                    value={systemSettings.company?.maxHrSeats || 10}
                    onChange={(e) => updateRoleSettings('company', { maxHrSeats: parseInt(e.target.value) || 10 })}
                    className="form-input text-xs font-mono font-bold"
                  />
                </div>
              </div>

            </div>


            {/* 📧 Company Email Gateway & Notification Rules Card */}
            <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-white space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-900 text-base">
                        Company Email Gateway & Automated Notifications
                      </h4>
                      <span className="badge badge-indigo text-[10px] font-bold">WHITE-LABEL READY</span>
                    </div>
                    <p className="text-slate-500 text-xs">
                      Configure how candidate verification links, HR recruiter credentials, and BGV reports are emailed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCompTestRecipient(company?.email || 'admin@company.com');
                      setShowCompTestEmailModal(true);
                    }}
                    className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold cursor-pointer hover:bg-slate-100"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Test Dispatch 📨</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCompanyEmailSettings}
                    disabled={isSavingCompEmail}
                    className="btn btn-company text-xs py-2 px-4 flex items-center gap-1.5 font-bold shadow-sm cursor-pointer"
                  >
                    {isSavingCompEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{isSavingCompEmail ? 'Saving...' : 'Save Email Rules 💾'}</span>
                  </button>
                </div>
              </div>

              {/* Mode Selection Pill Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-800 text-xs">
                  Select Outgoing Email Gateway Routing:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Mode 1: Master Gateway */}
                  <label 
                    onClick={() => setCompEmailConfig({ ...compEmailConfig, use_custom_smtp: false })}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      !compEmailConfig.use_custom_smtp 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="email_mode" 
                      checked={!compEmailConfig.use_custom_smtp}
                      onChange={() => setCompEmailConfig({ ...compEmailConfig, use_custom_smtp: false })}
                      className="mt-1 text-indigo-600"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>JOY Master cPanel Mail Gateway</span>
                        <span className="badge badge-emerald text-[9px]">RECOMMENDED</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Dispatches via high-reputation system server (<code>admin@joycorporatesolutions.com</code>) branded with <strong>{company.name}</strong> headers.
                      </p>
                    </div>
                  </label>

                  {/* Mode 2: Custom Company SMTP */}
                  <label 
                    onClick={() => setCompEmailConfig({ ...compEmailConfig, use_custom_smtp: true })}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      compEmailConfig.use_custom_smtp 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="email_mode" 
                      checked={compEmailConfig.use_custom_smtp}
                      onChange={() => setCompEmailConfig({ ...compEmailConfig, use_custom_smtp: true })}
                      className="mt-1 text-indigo-600"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Custom Company SMTP Server</span>
                        <span className="badge badge-purple text-[9px]">WHITE-LABELED</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Route emails directly through your corporate mail server (e.g. Office 365, Google Workspace, SendGrid, or custom cPanel).
                      </p>
                    </div>
                  </label>
                </div>

                {/* Custom SMTP Config Form (Visible only if Custom SMTP chosen) */}
                {compEmailConfig.use_custom_smtp && (
                  <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Corporate SMTP Host *</label>
                      <input 
                        type="text" 
                        value={compEmailConfig.host}
                        onChange={(e) => setCompEmailConfig({ ...compEmailConfig, host: e.target.value })}
                        placeholder="e.g. mail.yourcompany.com"
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Port & Protocol *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="number" 
                          value={compEmailConfig.port}
                          onChange={(e) => setCompEmailConfig({ ...compEmailConfig, port: parseInt(e.target.value) || 465 })}
                          className="form-input font-mono font-bold"
                        />
                        <select 
                          value={compEmailConfig.port === 465 ? 'ssl' : 'tls'}
                          onChange={(e) => {
                            const isSSL = e.target.value === 'ssl';
                            setCompEmailConfig({
                              ...compEmailConfig,
                              port: isSSL ? 465 : 587,
                              use_ssl: isSSL,
                              use_tls: !isSSL
                            });
                          }}
                          className="form-input font-bold"
                        >
                          <option value="ssl">SSL (465)</option>
                          <option value="tls">TLS (587)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SMTP Login Email *</label>
                      <input 
                        type="text" 
                        value={compEmailConfig.user}
                        onChange={(e) => setCompEmailConfig({ ...compEmailConfig, user: e.target.value })}
                        placeholder="onboarding@yourcompany.com"
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SMTP Password *</label>
                      <div className="relative flex items-center">
                        <input 
                          type={showCompSmtpPassword ? 'text' : 'password'}
                          value={compEmailConfig.password}
                          onChange={(e) => setCompEmailConfig({ ...compEmailConfig, password: e.target.value })}
                          placeholder="Enter password..."
                          className="form-input pr-9 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCompSmtpPassword(!showCompSmtpPassword)}
                          className="absolute right-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {showCompSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">From Email Address *</label>
                      <input 
                        type="text" 
                        value={compEmailConfig.from_email}
                        onChange={(e) => setCompEmailConfig({ ...compEmailConfig, from_email: e.target.value })}
                        placeholder="hr@yourcompany.com"
                        className="form-input font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Sender Display Name *</label>
                      <input 
                        type="text" 
                        value={compEmailConfig.from_name}
                        onChange={(e) => setCompEmailConfig({ ...compEmailConfig, from_name: e.target.value })}
                        placeholder={`${company.name} Talent Acquisition`}
                        className="form-input font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Triggers Toggles */}
              <div className="pt-2 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Automated Company Event Notifications:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70">
                    <div>
                      <strong className="text-slate-900 block font-bold">👔 New HR Recruiter Credentials</strong>
                      <span className="text-[11px] text-slate-500">Auto-email login credentials and HR ID upon recruiter appointment</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={compEmailConfig.notification_rules?.notify_hr_created !== false}
                      onChange={(e) => setCompEmailConfig({
                        ...compEmailConfig,
                        notification_rules: { ...compEmailConfig.notification_rules, notify_hr_created: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-indigo-600 shrink-0 ml-2"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70">
                    <div>
                      <strong className="text-slate-900 block font-bold">✅ Candidate Verification Certified</strong>
                      <span className="text-[11px] text-slate-500">Email summary when an employee's 360° dossier is 100% certified</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={compEmailConfig.notification_rules?.notify_candidate_verified !== false}
                      onChange={(e) => setCompEmailConfig({
                        ...compEmailConfig,
                        notification_rules: { ...compEmailConfig.notification_rules, notify_candidate_verified: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-indigo-600 shrink-0 ml-2"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70">
                    <div>
                      <strong className="text-slate-900 block font-bold">🚨 Red-Flag & Moonlighting Escalation</strong>
                      <span className="text-[11px] text-slate-500">Instant email alert if moonlighting or adverse court cases are flagged</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={compEmailConfig.notification_rules?.notify_discrepancies !== false}
                      onChange={(e) => setCompEmailConfig({
                        ...compEmailConfig,
                        notification_rules: { ...compEmailConfig.notification_rules, notify_discrepancies: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-indigo-600 shrink-0 ml-2"
                    />
                  </label>

                  <label className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100/70">
                    <div>
                      <strong className="text-slate-900 block font-bold">💳 Low Wallet Balance / Billing Invoice</strong>
                      <span className="text-[11px] text-slate-500">Receive alerts when verification credits fall below safety threshold</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={compEmailConfig.notification_rules?.notify_low_balance !== false}
                      onChange={(e) => setCompEmailConfig({
                        ...compEmailConfig,
                        notification_rules: { ...compEmailConfig.notification_rules, notify_low_balance: e.target.checked }
                      })}
                      className="w-4 h-4 rounded text-indigo-600 shrink-0 ml-2"
                    />
                  </label>
                </div>
              </div>
            </div>

            
            {/* Card 4: 📜 Enterprise Legal Compliance & Point-in-Time Agreement Status */}
            <div className="p-5 rounded-xl border-2 border-indigo-200 bg-indigo-50/60 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-700" />
                  <h4 className="font-extrabold text-slate-900 text-sm">Enterprise Terms of Service & DPDP Compliance Agreement</h4>
                </div>
                <span className="badge badge-purple text-[10px]">Active & Legally Bound (v2.4-2026) 🟢</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Bound Client Entity</span>
                  <span className="font-black text-slate-900">{company.name}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Authorized Signatory</span>
                  <span className="font-bold text-slate-900">{company.contactPerson} ({company.email})</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-indigo-100">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Point-in-Time Verification Truth</span>
                  <span className="font-bold text-emerald-800">ISO 27001 & DPDP 2023 Compliant</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-600 font-medium">
                  Includes the Point-in-Time Data Verification Mechanism, DPDP Act 2023 Candidate Consent Gate, and SLA commitments.
                </p>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="btn btn-superadmin text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold shadow-sm shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Legal Agreement 📄</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" className="btn btn-company text-xs flex items-center gap-2 font-bold shadow-md">
                <Save className="w-4 h-4" />
                <span>Save Company Settings & Policies</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: BILLING & RAZORPAY VERIFICATION WALLET */}
      {activeTab === 'billing_wallet' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Wallet Hero Banner */}
          <div className="glass-panel p-6 border-indigo-200 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70 rounded-3xl space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-purple text-xs font-black">B2B VERIFICATION WALLET</span>
                  <span className="text-xs text-slate-500 font-bold">• {company.name}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <span>Prepaid Verification Credits & Razorpay Gateway</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Recharge your BGV verification wallet instantly via UPI, Corporate Cards, NetBanking, or send a Razorpay payment link to your accounts department.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowRazorpayModal(true)}
                  className="btn btn-superadmin text-xs py-2.5 px-5 flex items-center gap-2 font-black shadow-lg cursor-pointer hover:scale-102 transition-all"
                >
                  <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span>Recharge Wallet (Razorpay) ⚡</span>
                </button>
              </div>
            </div>

            {/* Live Wallet & Quota Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border-2 border-indigo-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Live Wallet Balance</span>
                <div className="text-2xl font-black text-indigo-700">
                  ₹{(company.walletBalance || 0).toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active & Ready for Verifications
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Available Verification Quota</span>
                <div className="text-2xl font-black text-emerald-700">
                  ~{Math.floor((company.walletBalance || 0) / (company.pricePerVerification || 120))} Candidate Checks
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Based on current plan rate (₹{company.pricePerVerification || 120}/check)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-purple-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Billing Plan Tier</span>
                <div className="text-xl font-black text-purple-900 mt-1">
                  {company.plan || 'Enterprise Premier'}
                </div>
                <span className="badge badge-purple text-[9px] font-bold">18% GST Tax Invoices Included</span>
              </div>
            </div>
          </div>

          {/* Quick Payment Options & Virtual Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shareable Razorpay Payment Link Card */}
            <div className="glass-panel p-5 border-slate-200 bg-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                  <span>Shareable Razorpay Payment Link</span>
                </div>
                <span className="badge badge-indigo text-[9px]">Finance Team Ready</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Need your finance/accounts department to pay? Generate an encrypted Razorpay link that they can pay via corporate card or corporate banking.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowRazorpayModal(true)}
                  className="btn btn-secondary text-xs py-2 px-4 flex-1 flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                >
                  <SendHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Generate Custom Payment Link 🔗</span>
                </button>
              </div>
            </div>

            {/* Dedicated NEFT / RTGS Virtual Account */}
            <div className="glass-panel p-5 border-slate-200 bg-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>Dedicated B2B Virtual Bank Account</span>
                </div>
                <span className="badge badge-cyan text-[9px]">Auto-Reconcile</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Virtual Account:</span>
                  <span className="font-extrabold text-indigo-700">JOYCORP{company.code || 'JOYCORP'}8821</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">IFSC Code:</span>
                  <span className="font-bold text-slate-900">ICIC0000104 (ICICI Bank)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recharge & Transaction History Table */}
          <div className="glass-panel p-6 border-slate-200 bg-white rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  <span>Recharge History & GST Tax Invoices Ledger</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">All historical wallet recharges, Razorpay transaction IDs, and official GST tax invoices.</p>
              </div>
              <span className="badge badge-emerald text-[9px] font-bold">100% Tax Compliant</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                    <th className="py-2.5 px-3">Transaction Ref</th>
                    <th className="py-2.5 px-3">Razorpay Payment ID</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Base Recharge</th>
                    <th className="py-2.5 px-3">GST (18%)</th>
                    <th className="py-2.5 px-3">Total Paid</th>
                    <th className="py-2.5 px-3">Credits Added</th>
                    <th className="py-2.5 px-3">Payment Method</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {(company.rechargeTransactions || []).map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{tx.id}</td>
                      <td className="py-3 px-3 font-mono text-indigo-700 font-bold">{tx.paymentId}</td>
                      <td className="py-3 px-3 text-slate-500">{tx.date}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">₹{(tx.baseAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">₹{(tx.gstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-mono font-black text-emerald-700">₹{(tx.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-bold text-indigo-700">+{tx.creditsAdded} Checks</td>
                      <td className="py-3 px-3 text-slate-600">{tx.method}</td>
                      <td className="py-3 px-3">
                        <span className="badge badge-emerald text-[9px] font-bold">{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB: HR GOVERNANCE & FEATURE CONTROLS */}
      {activeTab === 'hr_permissions' && (
        <div className="glass-panel p-6 border-slate-200 bg-white space-y-6 rounded-2xl shadow-sm animate-tab-switch">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-purple text-[10px]">Company Admin HR Policy Matrix</span>
                <span className="text-xs text-slate-500 font-bold">• Enterprise Governance Controls</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                HR Staff Feature Permissions & Verification Policies
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Configure allowed communication channels, candidate ingestion methods, and mandatory compliance gates for HR staff.
              </p>
            </div>

            <button
              onClick={() => {
                const fullPermissions = {
                  allowProfileCreation: true,
                  allowBulkExcelUpload: true,
                  allowWhatsAppDispatch: true,
                  allowEmailDispatch: true,
                  allowSmsDispatch: true,
                  requireOriginalDocumentVault: true,
                  requireAiFaceBiometrics: true,
                  allow360DossierExport: true,
                  allowCertificateGeneration: true
                };
                updateCompanyHrPermissions(company.id, fullPermissions);
              }}
              className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-bold cursor-pointer btn-interactive self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Enable All HR Features</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Category 1: Candidate Profiling & Ingestion */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-extrabold text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Users className="w-4 h-4" />
                <span>1. Candidate Profiling & Ingestion Rights</span>
              </h4>

              <div className="space-y-2.5">
                {[
                  { id: 'allowProfileCreation', title: 'Single Profile Creation', desc: 'Allow HR to manually add new candidate profiles' },
                  { id: 'allowBulkExcelUpload', title: 'Bulk Excel (.xlsx) Ingestion', desc: 'Allow HR to batch upload multiple candidates via spreadsheet' }
                ].map(item => {
                  const isChecked = company.hrPermissions?.[item.id] ?? true;
                  return (
                    <label key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-300 transition-all btn-interactive">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => updateCompanyHrPermissions(company.id, { [item.id]: e.target.checked })}
                        className="accent-indigo-600 w-4 h-4 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category 2: Communication Channels Dispatch Rights */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-extrabold text-xs text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <MessageSquare className="w-4 h-4" />
                <span>2. Candidate Communication Dispatch Channels</span>
              </h4>

              <div className="space-y-2.5">
                {[
                  { id: 'allowWhatsAppDispatch', title: 'WhatsApp Cloud API Dispatch 💬', desc: 'Allow HR to send magic verification links via WhatsApp' },
                  { id: 'allowEmailDispatch', title: 'Email Magic Link & OTP Dispatch 📧', desc: 'Allow HR to send automated invitation emails & OTP codes' },
                  { id: 'allowSmsDispatch', title: 'Carrier SMS Notification Dispatch 📱', desc: 'Allow HR to send direct SMS OTP and notification alerts' }
                ].map(item => {
                  const isChecked = company.hrPermissions?.[item.id] ?? true;
                  return (
                    <label key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-300 transition-all btn-interactive">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => updateCompanyHrPermissions(company.id, { [item.id]: e.target.checked })}
                        className="accent-emerald-600 w-4 h-4 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category 3: Mandatory Candidate Evidence Policies */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-extrabold text-xs text-purple-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Mandatory Candidate Verification Policies</span>
              </h4>

              <div className="space-y-2.5">
                {[
                  { id: 'requireOriginalDocumentVault', title: 'Enforce Original Document Evidence (8 Files) 📁', desc: 'Candidates must upload original PAN, Aadhaar, Degree & Bank files' },
                  { id: 'requireAiFaceBiometrics', title: 'Enforce AI 3-Pose Face Biometric Match 👤', desc: 'Candidates must pass 3D live webcam liveness verification' }
                ].map(item => {
                  const isChecked = company.hrPermissions?.[item.id] ?? true;
                  return (
                    <label key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-purple-300 transition-all btn-interactive">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => updateCompanyHrPermissions(company.id, { [item.id]: e.target.checked })}
                        className="accent-purple-600 w-4 h-4 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Category 4: Report Export & Compliance Authority */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
              <h4 className="font-extrabold text-xs text-sky-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <FileCheck className="w-4 h-4" />
                <span>4. Report Export & Certification Authority</span>
              </h4>

              <div className="space-y-2.5">
                {[
                  { id: 'allow360DossierExport', title: '360° Multi-API PDF Dossier Export 📄', desc: 'Allow HR to generate & export full candidate 360° dossiers' },
                  { id: 'allowCertificateGeneration', title: 'ISO 27001 Official Certificate Generation 🎖️', desc: 'Allow HR to issue official digital verification certificates' }
                ].map(item => {
                  const isChecked = company.hrPermissions?.[item.id] ?? true;
                  return (
                    <label key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:border-sky-300 transition-all btn-interactive">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => updateCompanyHrPermissions(company.id, { [item.id]: e.target.checked })}
                        className="accent-sky-600 w-4 h-4 shrink-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 flex items-center justify-between">
            <span className="font-bold">🔒 Changes apply instantly to all HR staff accounts under {company.name}</span>
            <span className="badge badge-indigo text-[9px] font-mono">Real-time Policy Enforcement</span>
          </div>
        </div>
      )}

      {/* Document Downloader Modal */}
      {downloadingCandidate && (
        <DocumentDownloader 
          candidate={downloadingCandidate} 
          onClose={() => setDownloadingCandidate(null)} 
        />
      )}

      {/* Inspect Candidate Modal */}
      {inspectCandidate && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="glass-panel w-full max-w-xl p-6 space-y-6 border-slate-200 bg-white text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="badge badge-emerald text-[10px] mb-1">Verification Audit Report</span>
                <h3 className="text-xl font-extrabold text-slate-900">{inspectCandidate.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">{inspectCandidate.designation} • Emp ID: {inspectCandidate.empId}</p>
              </div>
              <button onClick={() => setInspectCandidate(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-semibold">Aadhaar Number:</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{inspectCandidate.aadhaarNo}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Registered Mobile:</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{inspectCandidate.mobile}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button onClick={() => setInspectCandidate(null)} className="btn btn-secondary text-xs font-bold">Close View</button>
            </div>
          </div>
        </div>
      )}

            {/* Add HR Onboarding Modal */}
      {showAddHrModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border-slate-200 bg-white text-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Onboard & Invite HR Recruiter</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Provision workstation access with 4-digit PIN security</p>
                </div>
              </div>
              <button onClick={() => setShowAddHrModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleOnboardHrSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">HR Recruiter Full Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Priya Sundaram"
                    value={newHr.name}
                    onChange={(e) => setNewHr({ ...newHr, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Work Email Address *</label>
                  <input 
                    type="email"
                    required
                    placeholder="priya.s@company.com"
                    value={newHr.email}
                    onChange={(e) => setNewHr({ ...newHr, email: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Official Mobile / Phone</label>
                  <input 
                    type="text"
                    placeholder="+91 98401 23456"
                    value={newHr.phone}
                    onChange={(e) => setNewHr({ ...newHr, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Recruitment Department</label>
                  <input 
                    type="text"
                    placeholder="e.g. Talent Acquisition"
                    value={newHr.dept}
                    onChange={(e) => setNewHr({ ...newHr, dept: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Designation / Role</label>
                  <input 
                    type="text"
                    placeholder="e.g. Senior Technical Recruiter"
                    value={newHr.designation}
                    onChange={(e) => setNewHr({ ...newHr, designation: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">4-Digit Security Unlock PIN *</label>
                  <input 
                    type="text"
                    maxLength={6}
                    required
                    placeholder="1234"
                    value={newHr.activation_password}
                    onChange={(e) => setNewHr({ ...newHr, activation_password: e.target.value })}
                    className="form-input font-mono font-black text-center tracking-widest text-sm bg-emerald-50 border-emerald-300 text-emerald-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-[11px] text-indigo-900 font-medium space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-700">
                  <Sparkles className="w-4 h-4" />
                  <span>Automated Self-Onboarding Workflow:</span>
                </div>
                <p>
                  A self-activation invitation link will be dispatched to <strong>{newHr.email || 'the recruiter'}</strong> along with the 4-digit PIN. Once the recruiter completes their profile and document proofs, you can give final 1-click authorization.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddHrModal(false)} className="btn btn-secondary text-xs font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="btn btn-company text-xs font-black py-2 px-5 shadow-md cursor-pointer">
                  🚀 Onboard & Send Invitation Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HR Link & PIN Modal */}
      {activatingHr && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border-slate-200 bg-white text-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <span>HR Self-Activation Credentials</span>
              </h3>
              <button onClick={() => setActivatingHr(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-bold block mb-1">HR Recruiter:</span>
                <span className="text-sm font-black text-slate-900">{activatingHr.name} ({activatingHr.email})</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-700 uppercase block mb-1">4-Digit Security Unlock PIN</span>
                <span className="text-3xl font-mono font-black text-emerald-900 tracking-widest">{activatingHr.activation_password || '1234'}</span>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-200">
                <span className="text-indigo-700 font-bold block mb-1">Self-Activation URL:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/hr-activation?token=${activatingHr.activation_token}`}
                    className="form-input text-[11px] font-mono select-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/hr-activation?token=${activatingHr.activation_token}`);
                      showToast('📋 Activation link copied to clipboard!');
                    }}
                    className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer"
                    title="Copy Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setActivatingHr(null)} className="btn btn-secondary text-xs font-bold cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* HR GOVERNANCE & PROFILE DOSSIER MODAL */}
      {governanceHr && (
        <HrGovernanceModal
          hrUser={governanceHr}
          companyId={company.id}
          isOpen={!!governanceHr}
          onClose={() => setGovernanceHr(null)}
          onUpdateHr={(updated) => setDbHrUsers(prev => prev.map(h => h.id === updated.id ? { ...h, ...updated } : h))}
          showToast={showToast}
        />
      )}


      {/* Online Payment & Settlement Modal */}
      {showPaymentModal && (
        <PaymentModal 
          company={company} 
          onClose={() => setShowPaymentModal(false)} 
        />
      )}

      {/* 📜 Terms & Privacy Policy Modal */}
      {showTermsModal && (
        <TermsAndPrivacyPolicyModal
          isOpen={showTermsModal}
          companyName={company?.name || 'Enterprise Employer'}
          onClose={() => setShowTermsModal(false)}
        />
      )}

      {/* Metric Drilldown Details Modal */}
      {activeDrilldown && (
        <MetricDrilldownModal
          isOpen={Boolean(activeDrilldown)}
          onClose={() => setActiveDrilldown(null)}
          title={activeDrilldown.title}
          subtitle={activeDrilldown.subtitle}
          metricValue={activeDrilldown.metricValue}
          metricType={activeDrilldown.metricType}
          role="company"
          data={activeDrilldown.data}
          onViewCandidateDossier={(cand) => {
            setActiveDrilldown(null);
            setViewingCertificateCandidate(null);
            setViewingBgvReportCandidate(null);
            setViewingDossierCandidate(cand);
          }}
          onViewCandidateCertificate={(cand) => {
            setActiveDrilldown(null);
            setViewingDossierCandidate(null);
            setViewingBgvReportCandidate(null);
            setViewingCertificateCandidate(cand);
          }}
        />
      )}

      {/* Candidate Dossier & Certificate Modals */}
      {viewingDossierCandidate && (
        <EmployeeProfileDossierModal
          candidate={viewingDossierCandidate}
          onClose={() => setViewingDossierCandidate(null)}
        />
      )}

      {viewingCertificateCandidate && (
        <OfficialVerificationCertificateModal
          candidate={viewingCertificateCandidate}
          onClose={() => setViewingCertificateCandidate(null)}
        />
      )}

      {/* 360° Multi-API Comprehensive Background Verification Dossier Modal */}
      {viewingBgvReportCandidate && (
        <ComprehensiveBgvReportModal
          candidate={viewingBgvReportCandidate}
          companyName={company?.name || "JOY CORPORATE SOLUTIONS PRIVATE LIMITED"}
          hrName="Authorized Company Officer"
          onClose={() => setViewingBgvReportCandidate(null)}
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
        initialRole="company"
        scopedCompanyId={company?.id}
      />

      {/* ⚡ Razorpay Verification Wallet Recharge Modal */}
      <RazorpayPaymentModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        targetCompanyId={company?.id}
      />

    
      {/* 🏢 COMPANY TEST EMAIL TRANSMISSION MODAL */}
      {showCompTestEmailModal && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-modal-spring">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Test Company Email Dispatch</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Verify outgoing emails for {company.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCompTestEmailModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendCompanyTestEmail} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recipient Test Email Address *
                </label>
                <input 
                  type="email" 
                  required
                  value={compTestRecipient}
                  onChange={(e) => setCompTestRecipient(e.target.value)}
                  placeholder="e.g. admin@yourcompany.com"
                  className="form-input font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Mode: <strong>{compEmailConfig.use_custom_smtp ? `Custom SMTP (${compEmailConfig.host})` : 'JOY Master cPanel Mail Gateway'}</strong>
                </span>
              </div>

              {compTestEmailResult && (
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                  compTestEmailResult.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <strong className="block flex items-center gap-1.5 font-bold">
                    {compTestEmailResult.success ? '🎉 Transmission Successful!' : '❌ Delivery Failed'}
                  </strong>
                  <p className="text-[11px] leading-relaxed">
                    {compTestEmailResult.success 
                      ? `Successfully dispatched test message to ${compTestEmailResult.to}. Check your inbox!`
                      : `Error: ${compTestEmailResult.error || 'Connection failed'}`}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompTestEmailModal(false)}
                  className="btn btn-secondary text-xs py-2 px-3.5 font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSendingCompTestEmail}
                  className="btn btn-company text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  {isSendingCompTestEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isSendingCompTestEmail ? 'Sending...' : 'Send Test Email 📨'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📄 OFFICIAL VENDOR STATUTORY VERIFICATION CERTIFICATE MODAL */}
      {selectedCertVendor && (
        <VendorVerificationCertificateModal
          vendor={selectedCertVendor}
          onClose={() => setSelectedCertVendor(null)}
        />
      )}

    </div>
  );
};
