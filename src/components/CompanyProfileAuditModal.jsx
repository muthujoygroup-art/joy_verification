import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  FileCheck2, 
  UploadCloud, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Save, 
  Lock, 
  Clock, 
  Sparkles,
  Search,
  Mail,
  HardDrive
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CompanyProfileAuditModal = ({ company, onClose }) => {
  const { 
    updateCompanyVerificationStatus, 
    verifyCompanyProfileDetail,
    platformLogoEmblem,
    approveCompanyRegistration,
    showToast,
    updateCompanyStorageQuota
  } = useApp();

  const c = company || {};
  const currentVerif = c.company_verification || {};
  const checks = currentVerif.checks || {};

  const [selectedStatus, setSelectedStatus] = useState(
    c.verification_status || currentVerif.status || 'Under Review'
  );
  const [auditorNotes, setAuditorNotes] = useState(
    currentVerif.superadminNotes || ''
  );
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isVerifyingCin, setIsVerifyingCin] = useState(false);
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Cloud Storage Quota State
  const [companyStorageQuota, setCompanyStorageQuota] = useState(c.storage_limit_gb || c.features?.storage_limit_gb || 25);
  const [isEditingStorage, setIsEditingStorage] = useState(false);
  const [customQuotaInput, setCustomQuotaInput] = useState(c.storage_limit_gb || c.features?.storage_limit_gb || 25);
  const [isUpdatingStorage, setIsUpdatingStorage] = useState(false);

  const handleUpdateStorageQuota = async (newLimit) => {
    setIsUpdatingStorage(true);
    try {
      await updateCompanyStorageQuota(c.id, Number(newLimit));
      setCompanyStorageQuota(Number(newLimit));
      setIsEditingStorage(false);
      showToast(`☁️ Storage vault quota updated to ${newLimit} GB for ${c.name}`);
    } catch (err) {
      showToast(`❌ Failed to update storage quota: ${err.message}`, 'error');
    } finally {
      setIsUpdatingStorage(false);
    }
  };

  // Local document review status
  const [docStatuses, setDocStatuses] = useState(checks.documents || {
    coi: { verified: true, notes: 'Authentic RoC Certificate' },
    pan: { verified: true, notes: 'Valid Form 49A Registration' },
    gst: { verified: true, notes: 'REG-06 Tax Clearance' },
    signatory_proof: { verified: true, notes: 'Authorized Signatory Proof' }
  });

  const handleVerifyGst = async () => {
    setIsVerifyingGst(true);
    try {
      await verifyCompanyProfileDetail(c.id, 'gst', { gstin_number: c.gstin_number || c.gstin });
    } finally {
      setIsVerifyingGst(false);
    }
  };

  const handleVerifyPan = async () => {
    setIsVerifyingPan(true);
    try {
      await verifyCompanyProfileDetail(c.id, 'pan', { company_pan: c.company_pan || c.pan });
    } finally {
      setIsVerifyingPan(false);
    }
  };

  const handleVerifyCin = async () => {
    setIsVerifyingCin(true);
    try {
      await verifyCompanyProfileDetail(c.id, 'cin', { cin_number: c.cin_number || c.cin });
    } finally {
      setIsVerifyingCin(false);
    }
  };

  const handleVerifyBank = async () => {
    setIsVerifyingBank(true);
    try {
      await verifyCompanyProfileDetail(c.id, 'bank', {
        bank_account: c.bank_account || '••••••••4819',
        bank_ifsc: c.bank_ifsc || 'HDFC0000053'
      });
    } finally {
      setIsVerifyingBank(false);
    }
  };

  const handleSaveAudit = () => {
    setIsSavingStatus(true);
    try {
      updateCompanyVerificationStatus(
        c.id, 
        selectedStatus, 
        auditorNotes, 
        { documents: docStatuses }
      );
      setTimeout(() => {
        setIsSavingStatus(false);
        if (typeof onClose === 'function') onClose();
      }, 300);
    } catch (e) {
      setIsSavingStatus(false);
    }
  };

  return createPortal((
    <div 
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overflow-y-auto animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget && typeof onClose === 'function') onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-900 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center p-1 shrink-0">
              <img 
                src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                alt="JOY Emblem" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge badge-purple text-[9px] font-black uppercase tracking-wider">
                  SuperAdmin Statutory Compliance Desk
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Company ID: {c.code || c.id}
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5 tracking-tight flex items-center gap-2">
                <span>{c.name || 'Company Profile Audit'}</span>
                {c.verification_status === 'Verified' ? (
                  <span className="badge badge-emerald text-[9px] font-black">VERIFIED ✓</span>
                ) : (
                  <span className="badge badge-amber text-[9px] font-black">{c.verification_status || 'PENDING AUDIT'}</span>
                )}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Audit Workspace */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs bg-slate-50/50">
          
          {/* Pending Application Review Banner */}
          {(c.status === 'Pending Approval' || c.activation_status === 'Pending Approval') && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-indigo-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-purple text-[9px] font-black uppercase">ACTION REQUIRED</span>
                    <strong className="text-slate-900 text-xs">Self-Activation Application Submitted for Review</strong>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Company submitted official CIN, GSTIN, Entity PAN, and Corporate Bank details. Verify documents below and authorize credentials dispatch.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isApproving}
                onClick={async () => {
                  setIsApproving(true);
                  try {
                    const res = await approveCompanyRegistration(c.id);
                    showToast(res?.message || `🎉 ${c.name} approved! Credentials dispatched to ${c.email}`);
                    if (typeof onClose === 'function') onClose();
                  } catch (err) {
                    showToast(`❌ Approval failed: ${err.message}`, 'error');
                  } finally {
                    setIsApproving(false);
                  }
                }}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 px-4 font-black shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 transition-all active:scale-95 rounded-xl"
              >
                {isApproving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                <span>{isApproving ? 'Approving...' : 'Approve & Dispatch Login Credentials ✉️'}</span>
              </button>
            </div>
          )}

          {/* 1. Entity Overview Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Legal Entity Name</span>
              <strong className="text-slate-900 font-extrabold text-sm block truncate">{c.name}</strong>
              <span className="text-[10px] text-slate-500">{c.industry_sector || 'IT & Workforce'}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Authorized Signatory</span>
              <strong className="text-slate-900 font-bold block truncate">{c.contactPerson || c.signatory_name || 'Primary Executive'}</strong>
              <span className="text-[10px] text-slate-500 font-mono">{c.email}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registered Location</span>
              <strong className="text-slate-900 font-bold block truncate">{c.location || 'Bangalore, Karnataka'}</strong>
              <span className="text-[10px] text-slate-500 truncate block">{c.registered_address || 'Official Registered Office'}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Current Audit Status</span>
              <div className="mt-1">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="form-select font-black text-xs py-1 px-2.5 rounded-lg border-2 border-indigo-200 bg-indigo-50/40 text-indigo-950"
                >
                  <option value="Verified">🟢 Verified & Approved</option>
                  <option value="Under Review">🟡 Under Review / Auditing</option>
                  <option value="Action Required">🟠 Action Required (Re-upload)</option>
                  <option value="Rejected">🔴 Rejected / Discrepancy Found</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. STATUTORY ATTRIBUTES VERIFICATION CARDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Statutory Government Gateway Verifications</span>
              </h4>
              <span className="text-[10px] text-slate-400">Direct query against GSTN, NSDL & MCA databases</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Check A: GSTIN Verification */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-xs">
                      GST
                    </span>
                    <div>
                      <strong className="text-slate-900 font-bold block">GSTIN Registration</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{c.gstin_number || c.gstin || '29AAAAA0000A1Z5'}</span>
                    </div>
                  </div>

                  {checks.gst?.status === 'Verified' ? (
                    <span className="badge badge-emerald text-[9px] font-black">VERIFIED ✓</span>
                  ) : (
                    <button
                      type="button"
                      disabled={isVerifyingGst}
                      onClick={handleVerifyGst}
                      className="btn btn-secondary text-[10px] py-1 px-2.5 font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 cursor-pointer flex items-center gap-1"
                    >
                      {isVerifyingGst ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                      <span>Verify GSTIN</span>
                    </button>
                  )}
                </div>

                {checks.gst && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 font-mono text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Legal Entity:</span>
                      <strong className="text-slate-900 font-sans">{checks.gst.legalName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trade Title:</span>
                      <span className="text-slate-800 font-sans">{checks.gst.tradeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">GST Status:</span>
                      <span className="text-emerald-700 font-bold">{checks.gst.gstStatus} ({checks.gst.filingStatus})</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                      <span>Verified At:</span>
                      <span>{checks.gst.verifiedAt}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Check B: Company PAN Verification */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-black flex items-center justify-center text-xs">
                      PAN
                    </span>
                    <div>
                      <strong className="text-slate-900 font-bold block">Company PAN (Income Tax)</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{c.company_pan || c.pan || 'AAACJ1234F'}</span>
                    </div>
                  </div>

                  {checks.pan?.status === 'Verified' ? (
                    <span className="badge badge-emerald text-[9px] font-black">VERIFIED ✓</span>
                  ) : (
                    <button
                      type="button"
                      disabled={isVerifyingPan}
                      onClick={handleVerifyPan}
                      className="btn btn-secondary text-[10px] py-1 px-2.5 font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 cursor-pointer flex items-center gap-1"
                    >
                      {isVerifyingPan ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                      <span>Verify PAN</span>
                    </button>
                  )}
                </div>

                {checks.pan && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 font-mono text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name on PAN:</span>
                      <strong className="text-slate-900 font-sans">{checks.pan.nameOnPan}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Entity Category:</span>
                      <span className="text-slate-800">{checks.pan.panCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">NSDL Status:</span>
                      <span className="text-emerald-700 font-bold">{checks.pan.panStatus}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                      <span>Verified At:</span>
                      <span>{checks.pan.verifiedAt}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Check C: CIN / MCA Verification */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 font-black flex items-center justify-center text-xs">
                      CIN
                    </span>
                    <div>
                      <strong className="text-slate-900 font-bold block">MCA Incorporation (CIN)</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{c.cin_number || c.cin || 'U74999KA2026PTC192841'}</span>
                    </div>
                  </div>

                  {checks.cin?.status === 'Verified' ? (
                    <span className="badge badge-emerald text-[9px] font-black">VERIFIED ✓</span>
                  ) : (
                    <button
                      type="button"
                      disabled={isVerifyingCin}
                      onClick={handleVerifyCin}
                      className="btn btn-secondary text-[10px] py-1 px-2.5 font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 cursor-pointer flex items-center gap-1"
                    >
                      {isVerifyingCin ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                      <span>Verify CIN</span>
                    </button>
                  )}
                </div>

                {checks.cin && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 font-mono text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">RoC Office:</span>
                      <span className="text-slate-900">{checks.cin.rocCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Class of Company:</span>
                      <span className="text-slate-800">{checks.cin.companyClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">MCA Active:</span>
                      <span className="text-emerald-700 font-bold">{checks.cin.mcaStatus}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Check D: Corporate Bank Account Penny Drop */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 font-black flex items-center justify-center text-xs">
                      BNK
                    </span>
                    <div>
                      <strong className="text-slate-900 font-bold block">Bank Account Penny Drop (IMPS)</strong>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.bank_name || 'Corporate Bank'} • IFSC: {c.bank_ifsc || c.ifsc_code || 'HDFC0000053'}
                      </span>
                    </div>
                  </div>

                  {checks.bank?.status === 'Verified' ? (
                    <span className="badge badge-emerald text-[9px] font-black">VERIFIED ✓</span>
                  ) : (
                    <button
                      type="button"
                      disabled={isVerifyingBank}
                      onClick={handleVerifyBank}
                      className="btn btn-secondary text-[10px] py-1 px-2.5 font-black text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 cursor-pointer flex items-center gap-1"
                    >
                      {isVerifyingBank ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                      <span>Penny Drop IMPS</span>
                    </button>
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 font-mono text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Name:</span>
                    <strong className="text-slate-900 font-sans">{c.bank_name || 'Not provided'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Number:</span>
                    <strong className="text-indigo-900">{c.bank_account_number || c.bank_account || '••••••••4819'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="text-slate-900 font-bold uppercase">{c.bank_ifsc || c.ifsc_code || 'HDFC0000053'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Type:</span>
                    <span className="text-slate-800">{c.bank_account_type || 'Current Account'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Beneficiary Name:</span>
                    <strong className="text-emerald-800 font-sans">{c.bank_beneficiary_name || checks.bank?.beneficiaryName || c.name}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Uploaded Statutory Documents Audit */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              <span>Statutory Uploads Vault Verification</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { key: 'coi', label: '1. Certificate of Incorporation' },
                { key: 'pan', label: '2. Company PAN Card' },
                { key: 'gst', label: '3. GST REG-06 Certificate' },
                { key: 'signatory_proof', label: '4. Board Resolution / Signatory' }
              ].map(doc => {
                const isDocOk = docStatuses[doc.key]?.verified;
                return (
                  <div key={doc.key} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold text-[11px] block truncate">{doc.label}</strong>
                      <span className={`badge ${isDocOk ? 'badge-emerald' : 'badge-amber'} text-[8px] font-black`}>
                        {isDocOk ? 'AUDITED ✓' : 'REVIEW'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDocStatuses(prev => ({
                            ...prev,
                            [doc.key]: { verified: !isDocOk, notes: isDocOk ? 'Discrepancy noted' : 'Audited & authentic' }
                          }));
                        }}
                        className={`text-[10px] font-bold py-1 px-2.5 rounded-lg border cursor-pointer transition-all ${
                          isDocOk 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isDocOk ? 'Mark Discrepant ⚠️' : 'Approve Document ✓'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. CLOUD STORAGE VAULT & QUOTA ALLOCATION */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                    Cloud Storage Vault Allocation & Tenant Usage
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Dedicated cryptographic file isolation for candidate KYC, face biometrics & statutory contracts
                  </p>
                </div>
              </div>

              {!isEditingStorage ? (
                <button
                  type="button"
                  onClick={() => setIsEditingStorage(true)}
                  className="btn btn-secondary text-[11px] py-1 px-3 font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 cursor-pointer self-start sm:self-auto rounded-lg"
                >
                  Adjust Storage Quota ⚙️
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingStorage(false)}
                  className="btn btn-secondary text-[11px] py-1 px-2.5 font-bold text-slate-500 hover:text-slate-800 cursor-pointer rounded-lg"
                >
                  Close Edit
                </button>
              )}
            </div>

            {/* Storage Metric Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Allocated Quota</span>
                <span className="text-sm font-black text-indigo-950 font-mono mt-0.5 block">{companyStorageQuota} GB</span>
                <span className="text-[10px] text-slate-400">Plan Tier Quota</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vault Consumption</span>
                <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block">
                  {c.storage_used_mb !== undefined ? `${c.storage_used_mb} MB` : (c.storage_used_gb !== undefined ? `${c.storage_used_gb} GB` : '0.00 MB')}
                </span>
                <span className="text-[10px] text-slate-400">Physical + DB Docs</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Utilization</span>
                <span className={`text-sm font-black font-mono mt-0.5 block ${
                  (c.storage_used_percentage || 0) > 85 ? 'text-rose-600' : (c.storage_used_percentage || 0) > 65 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {c.storage_used_percentage !== undefined ? `${c.storage_used_percentage}%` : '0.0%'}
                </span>
                <span className="text-[10px] text-slate-400">Quota Consumed</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Stored Files</span>
                <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block">
                  {c.storage_file_count !== undefined ? `${c.storage_file_count} files` : '0 files'}
                </span>
                <span className="text-[10px] text-slate-400">Isolated Artifacts</span>
              </div>
            </div>

            {/* Utilization Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>Vault Capacity Utilization</span>
                <span>{c.storage_used_percentage || 0}% used of {companyStorageQuota} GB</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    (c.storage_used_percentage || 0) > 85 ? 'bg-rose-500' : (c.storage_used_percentage || 0) > 65 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(c.storage_used_percentage || 0.1, 100)}%` }}
                />
              </div>
            </div>

            {/* Quota Adjustment Controls (Expanded when editing) */}
            {isEditingStorage && (
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3 mt-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-indigo-950 uppercase tracking-wider">
                    Select New Cloud Vault Storage Quota:
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold">Instantly updates tenant cloud capacity</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[10, 25, 50, 100, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      disabled={isUpdatingStorage}
                      onClick={() => handleUpdateStorageQuota(val)}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer border transition-all ${
                        companyStorageQuota === val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {val} GB
                    </button>
                  ))}

                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-[10px] font-bold text-slate-500">Custom:</span>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={customQuotaInput}
                      onChange={(e) => setCustomQuotaInput(e.target.value)}
                      className="w-20 px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white font-mono font-bold"
                      placeholder="GB"
                    />
                    <button
                      type="button"
                      disabled={isUpdatingStorage || !customQuotaInput}
                      onClick={() => handleUpdateStorageQuota(customQuotaInput)}
                      className="btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 px-3 font-bold rounded-lg shadow-xs cursor-pointer"
                    >
                      {isUpdatingStorage ? 'Saving...' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Auditor Remarks & Sync to Company */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
            <label className="block font-bold text-xs text-indigo-950">
              Auditor Remarks & Compliance Instructions (Synced to Company Admin in Real-Time):
            </label>
            <textarea
              rows={2}
              value={auditorNotes}
              onChange={(e) => setAuditorNotes(e.target.value)}
              placeholder="e.g. GSTIN and Company PAN verified successfully. Certificate of Incorporation verified with RoC records. Profile Approved."
              className="form-input text-xs font-medium text-slate-900 bg-white"
            />
            <p className="text-[10px] text-indigo-800 font-medium">
              These notes are immediately displayed in the company's "Company Profile & Statutory Documents" workspace and delivered as an official notification.
            </p>
          </div>

        </div>

        {/* Modal Bottom Controls */}
        <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            Audit Last Modified: <strong className="text-slate-800 font-mono">{currentVerif.lastVerifiedAt || 'Never'}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-xs py-2 px-4 font-bold text-slate-600 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSavingStatus}
              onClick={handleSaveAudit}
              className="btn btn-secondary text-xs py-2 px-4 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {isSavingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Audit Status</span>
            </button>

            {(c.status === 'Pending Approval' || c.activation_status === 'Pending Approval') && (
              <button
                type="button"
                disabled={isApproving}
                onClick={async () => {
                  setIsApproving(true);
                  try {
                    const res = await approveCompanyRegistration(c.id);
                    showToast(res?.message || `🎉 ${c.name} approved! Credentials dispatched to ${c.email}`);
                    if (typeof onClose === 'function') onClose();
                  } catch (err) {
                    showToast(`❌ Approval failed: ${err.message}`, 'error');
                  } finally {
                    setIsApproving(false);
                  }
                }}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 px-5 font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 rounded-xl"
              >
                {isApproving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>Approve & Dispatch Login Credentials ✉️</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  ), document.body);
};
