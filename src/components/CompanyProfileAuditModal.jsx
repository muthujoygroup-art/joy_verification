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
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CompanyProfileAuditModal = ({ company, onClose }) => {
  const { 
    updateCompanyVerificationStatus, 
    verifyCompanyProfileDetail,
    platformLogoEmblem,
    showToast 
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
                      <span className="text-[10px] text-slate-400 font-mono">HDFC Bank • IFSC: HDFC0000053</span>
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

                {checks.bank && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 font-mono text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Beneficiary Name:</span>
                      <strong className="text-emerald-800 font-sans">{checks.bank.beneficiaryName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Name Match Score:</span>
                      <span className="text-emerald-700 font-bold">{checks.bank.matchScore}% Match</span>
                    </div>
                  </div>
                )}
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

          {/* 4. Auditor Remarks & Sync to Company */}
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
              className="btn btn-primary text-xs py-2 px-5 font-black flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {isSavingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Publish Statutory Verification Status</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  ), document.body);
};
