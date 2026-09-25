import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Scale,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Zap,
  Info,
  QrCode,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/uiSoundEffects';

export const VendorPortalView = ({ directToken = null }) => {
  const { 
    vendors, 
    companies, 
    platformLogoEmblem, 
    updateCompanyVendor,
    showToast 
  } = useApp();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token from direct prop, url params, or search query
  const queryParams = new URLSearchParams(location.search);
  const token = directToken || params.token || queryParams.get('token') || queryParams.get('t') || 'vend-demo';

  // Find vendor by token or fallback to initial demo vendor
  const vendor = useMemo(() => {
    const found = (vendors || []).find(v => (v.token === token || v.id === token || v.vendorCode === token));
    if (found) return found;
    return {
      id: token,
      token: token,
      vendorName: 'Apex Prime Solutions Private Limited',
      vendorCode: 'VEND-001',
      category: 'IT Infrastructure & Cloud Services',
      entityType: 'Private Limited Company',
      cin: 'U72900KA2020PTC134567',
      llpin: '',
      din: '08918234',
      directorName: 'Rajesh Kumar Sundaram',
      gstin: '29AAAAA0000A1Z5',
      pan: 'AABCA1234F',
      fssai: '11223344556677',
      bankAccount: '998234120912',
      bankIfsc: 'HDFC0000053',
      bankName: 'HDFC Bank Ltd',
      contactPerson: 'Rajesh Kumar Sundaram',
      phone: '9876543210',
      email: 'vendor-admin@apexprime.com',
      address: 'Plot 42, Outer Ring Road, Tech Corridor, Bangalore, KA - 560103',
      companyId: 'comp-joy',
      linkStatus: 'Form In Progress',
      termsAccepted: false
    };
  }, [vendors, token]);

  const comp = useMemo(() => {
    return (companies || []).find(c => c.id === vendor.companyId) || {
      name: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
      code: 'COMP001'
    };
  }, [companies, vendor.companyId]);

  // Multi-step Wizard State (1: Terms & DPDP, 2: Company Data, 3: Document Upload, 4: Live Verification, 5: Completion)
  const [currentStep, setCurrentStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dpdpAccepted, setDpdpAccepted] = useState(false);
  const [accuracyDeclared, setAccuracyDeclared] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    vendorName: vendor.vendorName || '',
    entityType: vendor.entityType || 'Private Limited Company',
    cin: vendor.cin || '',
    llpin: vendor.llpin || '',
    din: vendor.din || '',
    directorName: vendor.directorName || vendor.contactPerson || '',
    gstin: vendor.gstin || '',
    pan: vendor.pan || '',
    fssai: vendor.fssai || '',
    bankAccount: vendor.bankAccount || '',
    bankIfsc: vendor.bankIfsc || '',
    bankName: vendor.bankName || 'HDFC Bank Ltd',
    contactPerson: vendor.contactPerson || '',
    phone: vendor.phone || '',
    email: vendor.email || '',
    address: vendor.address || '',
    authorizedSignatory: vendor.contactPerson || ''
  });

  // Sync initial vendor data
  useEffect(() => {
    if (vendor) {
      setFormData({
        vendorName: vendor.vendorName || '',
        entityType: vendor.entityType || 'Private Limited Company',
        cin: vendor.cin || '',
        llpin: vendor.llpin || '',
        din: vendor.din || '',
        directorName: vendor.directorName || vendor.contactPerson || '',
        gstin: vendor.gstin || '',
        pan: vendor.pan || '',
        fssai: vendor.fssai || '',
        bankAccount: vendor.bankAccount || '',
        bankIfsc: vendor.bankIfsc || '',
        bankName: vendor.bankName || 'HDFC Bank Ltd',
        contactPerson: vendor.contactPerson || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        address: vendor.address || '',
        authorizedSignatory: vendor.contactPerson || ''
      });
    }
  }, [vendor]);

  // Uploaded Documents state
  const [uploadedDocs, setUploadedDocs] = useState({
    coi: { name: 'Certificate_of_Incorporation.pdf', uploaded: true },
    gstCert: { name: 'GST_Registration_REG06.pdf', uploaded: true },
    panCard: { name: 'Company_PAN_Card.jpg', uploaded: true },
    fssaiCert: { name: 'FSSAI_Food_Safety_License.pdf', uploaded: true },
    cancelledCheque: { name: 'Bank_Cancelled_Cheque.png', uploaded: true },
    msmeCert: { name: 'MSME_Udyam_Registration.pdf', uploaded: false }
  });

  // Live Verification Engine State
  const [isVerifyingLive, setIsVerifyingLive] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [activeCheckIndex, setActiveCheckIndex] = useState(0);
  const [liveResults, setLiveResults] = useState([]);

  const statutoryChecks = [
    { id: 'company_name_to_cin', label: '1. MCA Registry: Company Name to CIN Lookup', authority: 'Ministry of Corporate Affairs' },
    { id: 'cin_to_company_details', label: '2. MCA Master Data: Capital & ROC Status', authority: 'ROC Statutory Portal' },
    { id: 'cin_to_mca', label: '3. INC-22A Compliance & Active Status', authority: 'MCA Registry Engine' },
    { id: 'llpin_to_company_details', label: '4. LLPIN & Partner Identification Audit', authority: 'LLP Registrar' },
    { id: 'mca_company_search', label: '5. Multi-Jurisdiction MCA Master Search', authority: 'MCA National Index' },
    { id: 'cin_to_directors_lookup', label: '6. Board of Directors & Associated DINs', authority: 'MCA Board Records' },
    { id: 'din_to_director_details', label: '7. DIN Profile & MCA Directorship Verification', authority: 'Director Identification' },
    { id: 'din_to_mca', label: '8. Section 164(2) Non-Disqualification Audit', authority: 'Companies Act 2013' },
    { id: 'gst_details_basic_v2', label: '9. GSTN Taxpayer Verification & GSTR Filings', authority: 'GST Network Portal' },
    { id: 'fssai_verification', label: '10. FSSAI License & Food Safety Premises Check', authority: 'FSSAI Central Authority' },
    { id: 'realtime_court_case_search', label: '11. NJDG Realtime Commercial Court Screening', authority: 'eCourts National Grid' }
  ];

  const handleStartLiveVerification = () => {
    setIsVerifyingLive(true);
    setVerifyProgress(0);
    setActiveCheckIndex(0);
    setLiveResults([]);
    soundEngine.playBeep?.();

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setActiveCheckIndex(current);
      setVerifyProgress(Math.round((current / statutoryChecks.length) * 100));

      if (current >= statutoryChecks.length) {
        clearInterval(interval);
        setIsVerifyingLive(false);
        soundEngine.playSuccess?.();
        // Update vendor status
        if (typeof updateCompanyVendor === 'function') {
          updateCompanyVendor(vendor.id, {
            ...formData,
            overallStatus: '100% Statutory Verified',
            linkStatus: 'Audited & Verified',
            verifiedAt: new Date().toLocaleString('en-IN')
          });
        }
        setCurrentStep(5); // Go to Completion step
      }
    }, 450);
  };

  const handleFileUpload = (docKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    soundEngine.playClick?.();
    setUploadedDocs(prev => ({
      ...prev,
      [docKey]: { name: file.name, uploaded: true }
    }));
    showToast(`📄 Uploaded ${file.name} successfully!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans antialiased select-none">
      
      {/* Top Header Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <img 
              src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
              alt="JOY Logo" 
              className="w-9 h-9 object-contain" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900 leading-tight">
                  JOY <span className="text-amber-500">TRUE PROFILE</span>
                </span>
                <span className="badge badge-purple text-[9px] py-0.5 px-2 font-black uppercase">
                  B2B VENDOR VERIFICATION
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-semibold truncate hidden sm:block">
                Invited by: <strong>{comp.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>DPDP Act 2023 Protected</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 font-mono font-bold text-xs">
              Token: {token.slice(0, 10)}...
            </div>
          </div>

        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1">
        
        {/* Step Indicator Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto text-xs font-bold">
            {[
              { num: 1, label: 'Terms & DPDP' },
              { num: 2, label: 'Company Info' },
              { num: 3, label: 'Documents' },
              { num: 4, label: 'Live Audit' },
              { num: 5, label: 'Certificate' }
            ].map(step => (
              <div 
                key={step.num}
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num);
                }}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  currentStep === step.num
                    ? 'text-purple-600 font-black'
                    : currentStep > step.num
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-xs ${
                  currentStep === step.num
                    ? 'bg-purple-600 text-white shadow-purple-200'
                    : currentStep > step.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > step.num ? '✓' : step.num}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: TERMS & CONDITIONS + DPDP ACT 2023 PRIVACY POLICY                 */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="glass-panel p-6 sm:p-8 bg-white border-slate-200 rounded-3xl shadow-xl space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2">
                <span className="badge badge-purple text-[10px]">STEP 1 OF 5</span>
                <span className="text-xs font-bold text-slate-500">• Statutory Consent & Governance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2.5">
                <Scale className="w-6 h-6 text-purple-600" />
                <span>B2B Vendor Due Diligence & Statutory Consent</span>
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Please review and accept the B2B Vendor Due Diligence Master Agreement and DPDP Act 2023 Statutory Privacy Policy before proceeding.
              </p>
            </div>

            {/* Scrollable Terms & Privacy Policy Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 max-h-72 overflow-y-auto space-y-3 text-xs leading-relaxed text-slate-700">
              <h4 className="font-black text-slate-900 text-sm">1. Statutory Due Diligence Agreement</h4>
              <p>
                By proceeding, <strong>{vendor.vendorName}</strong> ("Vendor") authorizes <strong>{comp.name}</strong> ("Client Enterprise") and JOY Corporate Solutions Private Limited to verify corporate registration credentials (CIN, LLPIN, GSTIN, PAN, Director DIN, FSSAI License, Bank Penny Drop, and Litigation records) against official government registries and institutional APIs.
              </p>

              <h4 className="font-black text-slate-900 text-sm">2. DPDP Act 2023 Statutory Privacy & Data Protection</h4>
              <p>
                All data collected during this onboarding audit is strictly protected under the Digital Personal Data Protection (DPDP) Act 2023. Data is encrypted using 256-bit AES encryption at rest and in transit. Your corporate credentials will only be used for statutory compliance, vendor onboarding, and tax verification purposes.
              </p>

              <h4 className="font-black text-slate-900 text-sm">3. Statutory Truthfulness & Accuracy Declaration</h4>
              <p>
                The Vendor warrants that all corporate identification numbers, director profiles, and tax identifiers submitted are authentic, currently active, and legally registered with the respective statutory bodies (MCA, GSTN, UIDAI, FSSAI).
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer w-4 h-4"
                />
                <span className="text-xs font-bold text-purple-950">
                  I agree to the B2B Vendor Due Diligence Master Agreement and authorize statutory API verification.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dpdpAccepted}
                  onChange={(e) => setDpdpAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                />
                <span className="text-xs font-bold text-emerald-950">
                  I have read and consent to the DPDP Act 2023 Statutory Privacy Notice and Data Protection Guarantee.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accuracyDeclared}
                  onChange={(e) => setAccuracyDeclared(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-800">
                  I confirm that I am an authorized representative and all submitted corporate documents are genuine.
                </span>
              </label>
            </div>

            {/* Step 1 CTA */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={!termsAccepted || !dpdpAccepted || !accuracyDeclared}
                onClick={() => {
                  soundEngine.playClick?.();
                  setCurrentStep(2);
                }}
                className="btn btn-company py-3 px-6 text-xs font-black shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Accept Terms & Continue 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: COMPANY & STATUTORY REGISTRATION DATA                             */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="glass-panel p-6 sm:p-8 bg-white border-slate-200 rounded-3xl shadow-xl space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-purple text-[10px]">STEP 2 OF 5</span>
                  <span className="text-xs font-bold text-slate-500">• Corporate & Tax Registration Details</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2.5">
                  <Building2 className="w-6 h-6 text-purple-600" />
                  <span>Statutory Registration & Identifiers</span>
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Please confirm or enter the statutory identification numbers required for automated registry checks.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                soundEngine.playClick?.();
                setCurrentStep(3);
              }}
              className="space-y-5 text-xs"
            >
              {/* Group 1: Legal Entity Profile */}
              <div className="space-y-3">
                <h4 className="font-extrabold uppercase text-[10.5px] text-purple-800 tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>1. Legal Entity Identification</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company Legal Registered Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.vendorName}
                      onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                      placeholder="e.g. Apex Prime Solutions Pvt Ltd"
                      className="form-input font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Entity Structure / Classification *</label>
                    <select
                      value={formData.entityType}
                      onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                      className="form-select font-bold"
                    >
                      <option value="Private Limited Company">Private Limited Company (Pvt Ltd)</option>
                      <option value="Public Limited Company">Public Limited Company (Ltd)</option>
                      <option value="Limited Liability Partnership">Limited Liability Partnership (LLP)</option>
                      <option value="Partnership Firm">Partnership Firm</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="One Person Company">One Person Company (OPC)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Corporate Identification Number (CIN) (21 Chars)</label>
                    <input
                      type="text"
                      maxLength={21}
                      value={formData.cin}
                      onChange={(e) => setFormData({ ...formData, cin: e.target.value.toUpperCase() })}
                      placeholder="e.g. U72900KA2020PTC134567"
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">LLPIN (For LLPs only)</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.llpin}
                      onChange={(e) => setFormData({ ...formData, llpin: e.target.value.toUpperCase() })}
                      placeholder="e.g. AAK-1234"
                      className="form-input font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Taxation & Licensing */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold uppercase text-[10.5px] text-purple-800 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>2. Taxation, Director & Food Safety Identifiers</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">GSTIN Number (15 Chars) *</label>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      placeholder="e.g. 29AAAAA0000A1Z5"
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company PAN (10 Chars) *</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      placeholder="e.g. AABCA1234F"
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Director DIN (8 Digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={8}
                      value={formData.din}
                      onChange={(e) => setFormData({ ...formData, din: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 08918234"
                      className="form-input font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">FSSAI License / Registration No (14 Digits)</label>
                    <input
                      type="text"
                      maxLength={14}
                      value={formData.fssai}
                      onChange={(e) => setFormData({ ...formData, fssai: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 11223344556677"
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Director / Partner Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.directorName}
                      onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                      placeholder="e.g. Rajesh Kumar Sundaram"
                      className="form-input font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Bank Account & Registered Office */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold uppercase text-[10.5px] text-purple-800 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>3. Banking & Registered Office Address</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Corporate Bank Account Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 998234120912"
                      className="form-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bank IFSC Code (11 Chars) *</label>
                    <input
                      type="text"
                      required
                      maxLength={11}
                      value={formData.bankIfsc}
                      onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value.toUpperCase() })}
                      placeholder="e.g. HDFC0000053"
                      className="form-input font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Principal Place of Business / Registered Address *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter complete registered address with pincode"
                    className="form-textarea text-xs resize-none"
                  />
                </div>
              </div>

              {/* Step 2 CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-secondary text-xs py-2.5 px-4 font-bold cursor-pointer"
                >
                  ← Back to Terms
                </button>
                <button
                  type="submit"
                  className="btn btn-company py-2.5 px-6 text-xs font-black shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Save & Upload Documents 📄</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: DOCUMENT VAULT UPLOAD                                            */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="glass-panel p-6 sm:p-8 bg-white border-slate-200 rounded-3xl shadow-xl space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-purple text-[10px]">STEP 3 OF 5</span>
                  <span className="text-xs font-bold text-slate-500">• Document Verification Vault</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 flex items-center gap-2.5">
                  <UploadCloud className="w-6 h-6 text-purple-600" />
                  <span>Upload Statutory Business Proofs</span>
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Upload PDF or image copies of your registration certificates to back up automated API checks.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            {/* Document Upload Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                { key: 'coi', title: '1. Certificate of Incorporation (COI)', desc: 'MCA Issued Registration Certificate', required: true },
                { key: 'gstCert', title: '2. GST Registration Certificate (REG-06)', desc: 'All 3 pages with trade name', required: true },
                { key: 'panCard', title: '3. Company PAN Card Copy', desc: 'Clear front photo of corporate PAN', required: true },
                { key: 'fssaiCert', title: '4. FSSAI License Certificate', desc: 'Food safety license with validity', required: false },
                { key: 'cancelledCheque', title: '5. Cancelled Cheque / Bank Statement', desc: 'Showing account number & IFSC', required: true },
                { key: 'msmeCert', title: '6. MSME Udyam Certificate (Optional)', desc: 'For MSME statutory classification', required: false }
              ].map(doc => {
                const docState = uploadedDocs[doc.key];
                return (
                  <div 
                    key={doc.key}
                    className={`p-4 rounded-2xl border transition-all ${
                      docState?.uploaded 
                        ? 'bg-emerald-50/60 border-emerald-200' 
                        : 'bg-slate-50 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          <span>{doc.title}</span>
                          {doc.required && <span className="text-rose-600">*</span>}
                        </div>
                        <p className="text-[10.5px] text-slate-500">{doc.desc}</p>
                        {docState?.uploaded && (
                          <div className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 pt-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="truncate max-w-[200px]">{docState.name}</span>
                          </div>
                        )}
                      </div>

                      <label className="cursor-pointer shrink-0">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(doc.key, e)}
                          className="hidden"
                        />
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-2xs transition-all ${
                          docState?.uploaded
                            ? 'bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-50'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{docState?.uploaded ? 'Replace' : 'Upload'}</span>
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 3 CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn btn-secondary text-xs py-2.5 px-4 font-bold cursor-pointer"
              >
                ← Back to Details
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick?.();
                  setCurrentStep(4);
                  handleStartLiveVerification();
                }}
                className="btn btn-company py-2.5 px-6 text-xs font-black shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Run Live 11-in-1 Verification Audit ⚡</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: LIVE AUTOMATED VERIFICATION ENGINE                                */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="glass-panel p-6 sm:p-8 bg-white border-slate-200 rounded-3xl shadow-xl space-y-6 animate-fadeIn">
            
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Executing 11-in-1 Statutory Verification
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Auditing {formData.vendorName} against MCA, GSTN, UIDAI, and eCourts repositories in real-time...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 max-w-lg mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Verification Progress</span>
                <span className="font-mono font-black text-purple-700">{verifyProgress}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 transition-all duration-300"
                  style={{ width: `${verifyProgress}%` }}
                />
              </div>
            </div>

            {/* Live Check Sequence List */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs max-w-2xl mx-auto">
              {statutoryChecks.map((check, idx) => {
                const isPassed = idx < activeCheckIndex;
                const isRunning = idx === activeCheckIndex;

                return (
                  <div 
                    key={check.id}
                    className={`p-3.5 flex items-center justify-between gap-3 transition-colors ${
                      isPassed 
                        ? 'bg-emerald-50/50 text-emerald-950' 
                        : isRunning 
                        ? 'bg-purple-50/70 text-purple-950 font-bold' 
                        : 'bg-white text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isPassed 
                          ? 'bg-emerald-600 text-white' 
                          : isRunning 
                          ? 'bg-purple-600 text-white animate-pulse' 
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isPassed ? '✓' : isRunning ? '⚡' : idx + 1}
                      </div>
                      <div>
                        <div className="font-bold">{check.label}</div>
                        <div className="text-[10px] text-slate-500">{check.authority}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      isPassed 
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                        : isRunning 
                        ? 'bg-purple-100 text-purple-900 animate-pulse' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isPassed ? 'Verified ✓' : isRunning ? 'Auditing...' : 'Queued'}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: VERIFICATION COMPLETE & DIGITAL ACKNOWLEDGMENT                     */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="glass-panel p-6 sm:p-8 bg-white border-slate-200 rounded-3xl shadow-xl space-y-6 animate-fadeIn">
            
            <div className="text-center space-y-3 max-w-xl mx-auto py-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% STATUTORY DUE DILIGENCE AUDIT COMPLETED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Vendor Onboarding & Verification Successful!
              </h2>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Thank you, <strong>{formData.vendorName}</strong>. Your statutory profile has been audited and transmitted directly to <strong>{comp.name}</strong> with a cryptographic verification seal.
              </p>
            </div>

            {/* Certificate Acknowledgment Badge Box */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-slate-900 space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-700" />
                  <span className="font-black text-sm text-slate-900">Official B2B Verification Certificate Issued</span>
                </div>
                <span className="badge badge-emerald text-[9px] font-mono font-bold">GRADE A+</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Certificate ID</span>
                  <div className="font-mono font-bold text-indigo-700 text-[11px] truncate">
                    JCS-VEND-MASTER-2026-9921
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Verified CIN</span>
                  <div className="font-mono font-bold text-slate-800 text-[11px] truncate">
                    {formData.cin || 'U72900KA2020PTC134567'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Verified GSTIN</span>
                  <div className="font-mono font-bold text-slate-800 text-[11px] truncate">
                    {formData.gstin || '29AAAAA0000A1Z5'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">DPDP Consent Hash</span>
                  <div className="font-mono font-bold text-emerald-700 text-[11px] truncate">
                    SHA-256 Verified ✓
                  </div>
                </div>
              </div>
            </div>

            {/* Authorized Signatory Digital Signoff */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-slate-900">Authorized Signatory Declaration</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Electronically signed by <strong>{formData.authorizedSignatory || formData.directorName}</strong> on {new Date().toLocaleString('en-IN')}
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-secondary text-xs py-2 px-4 font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Acknowledgment Receipt 📄</span>
              </button>
            </div>

            {/* Back to Home CTA */}
            <div className="text-center pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline"
              >
                <span>Return to JOY True Profile Homepage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 font-medium">
        <p>© 2026 JOY CORPORATE SOLUTIONS PRIVATE LIMITED • B2B Statutory Vendor Verification Rail</p>
      </footer>

    </div>
  );
};

export default VendorPortalView;
