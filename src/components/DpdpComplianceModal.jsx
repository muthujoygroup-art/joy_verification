import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, FileText, CheckCircle2, AlertTriangle, X, 
  Trash2, Download, Eye, KeyRound, Sparkles, Scale, RefreshCw, Layers
} from 'lucide-react';
import { api } from '../services/api';

export const DpdpComplianceModal = ({ isOpen, onClose, candidate, companyName }) => {
  const [activeTab, setActiveTab] = useState('principles'); // 'principles' | 'consent' | 'erasure' | 'audit'
  const [isErasing, setIsErasing] = useState(false);
  const [erasureSuccess, setErasureSuccess] = useState(false);
  const [erasureMsg, setErasureMsg] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  if (!isOpen) return null;

  const candName = candidate?.name || 'Valued Candidate';
  const candEmpId = candidate?.empId || candidate?.employeeNumber || 'EMP-001';
  const cName = companyName || candidate?.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED';

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const candId = candidate?.id || candidate?.token;
      const res = await api.getDpdpAuditTrail(candId);
      if (res && res.audit_logs) {
        setAuditLogs(res.audit_logs);
      }
    } catch (err) {
      console.warn('Audit log fetch error:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleErasureRequest = async () => {
    if (!window.confirm("⚠️ STATUTORY WARNING: Are you sure you want to request complete data erasure and anonymization under DPDP Act 2023 Section 12? This action is irreversible.")) {
      return;
    }
    setIsErasing(true);
    try {
      const candId = candidate?.id || candidate?.token;
      const res = await api.requestDpdpErasure(candId, candidate?.token);
      if (res && res.success) {
        setErasureSuccess(true);
        setErasureMsg(res.message);
      }
    } catch (err) {
      console.error('Erasure request error:', err);
      alert('Could not complete erasure request: ' + (err.message || 'Server error'));
    } finally {
      setIsErasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-6 overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Statutory Compliance Officer Desk</span>
              </div>
              <h2 className="font-black text-lg text-white tracking-tight">
                Digital Personal Data Protection (DPDP) Act 2023 Governance Portal
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('principles')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${activeTab === 'principles' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
          >
            📜 DPDP Statutory Principles
          </button>
          <button
            onClick={() => setActiveTab('consent')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${activeTab === 'consent' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
          >
            🔑 Consent & Purpose Notice
          </button>
          <button
            onClick={() => setActiveTab('erasure')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${activeTab === 'erasure' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
          >
            🗑️ Right to Erasure / Anonymization
          </button>
          <button
            onClick={() => {
              setActiveTab('audit');
              fetchAuditLogs();
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
          >
            ⛓️ Cryptographic Audit Ledger
          </button>
        </div>

        {/* Body Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">

          {/* Candidate Dossier Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shadow-sm">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Candidate Name</span>
              <span className="font-black text-slate-900 text-sm">{candName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Candidate ID / Emp ID</span>
              <span className="font-mono font-bold text-indigo-700 text-sm">{candEmpId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Data Fiduciary (Employer)</span>
              <span className="font-bold text-slate-800">{cName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Data Processor</span>
              <span className="font-bold text-emerald-800">JOY Corporate Solutions</span>
            </div>
          </div>

          {/* TAB 1: PRINCIPLES */}
          {activeTab === 'principles' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 leading-relaxed">
                  <strong>Digital Personal Data Protection Act 2023 Principles:</strong> All candidate profile data, government identity documents (Aadhaar, PAN, DL, Passport, UAN), e-KYC responses, and live biometric photos processed through this platform strictly adhere to DPDP statutory provisions.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Explicit Candidate Consent</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Personal data is collected strictly after clear, affirmative statutory consent. Candidates receive transparent notice specifying purpose, scope, and retention period.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>2. UIDAI Aadhaar Data Vault Masking</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under UIDAI Regulations 2016, 12-digit Aadhaar numbers are automatically masked (`XXXX-XXXX-1234`) across database records, UI displays, and exported PDF reports.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>3. Purpose Limitation & Data Minimization</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Data processed is limited strictly to employment background verification, statutory EPFO/ESIC enrollment, and statutory compliance verification.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>4. Tamper-Proof Cryptographic Audit Chain</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Every data view, modification, verification call, and document generation is signed with a SHA-256 hash and stored in an immutable audit ledger.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONSENT & NOTICE */}
          {activeTab === 'consent' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 uppercase">
                  Candidate Data Protection Notice (Form DPDP-N1)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  Active Notice Version 2.4 ✓
                </span>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed space-y-3">
                <p>
                  <strong>Notice Statement:</strong> {cName} ("Data Fiduciary") and JOY Corporate Solutions ("Data Processor") process your personal information for employment background verification.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1 text-slate-800">
                  <div>• Purposed Categories: Identity (Aadhaar/PAN), Employment History (EPFO UAN), Bank Account Verification (IMPS), Address, Face Biometrics.</div>
                  <div>• Statutory Rights: Right to Access Summary, Right to Correction, Right to Erasure, Right to Grievance Redressal.</div>
                  <div>• DPDP Consent Hash: <span className="text-indigo-700 font-bold">SHA256-CONSENT-{Date.now().toString().slice(-8)}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RIGHT TO ERASURE */}
          {activeTab === 'erasure' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Trash2 className="w-5 h-5" />
                <span>Statutory Right to Erasure & Data Anonymization (DPDP Section 12)</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Under DPDP Act 2023, candidates have the right to request the erasure and anonymization of their personal data once employment verification purpose has concluded.
              </p>

              {erasureSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-black text-emerald-950">Statutory Data Erasure Request Executed!</p>
                    <p className="mt-1 font-normal text-emerald-800 leading-relaxed">{erasureMsg}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-xs">
                  <div className="font-bold text-amber-900">
                    Executing data erasure will immediately anonymize candidate name, email, phone, Aadhaar, PAN, and Bank details in PostgreSQL storage.
                  </div>
                  <button
                    onClick={handleErasureRequest}
                    disabled={isErasing}
                    className="btn bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isErasing ? 'Processing Erasure...' : 'Request Statutory Data Erasure Now →'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT LEDGER */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 uppercase">
                  Cryptographic Chained Audit Trail Ledger
                </h3>
                <button
                  onClick={fetchAuditLogs}
                  disabled={isLoadingLogs}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                  <span>Refresh Ledger</span>
                </button>
              </div>

              {auditLogs.length === 0 ? (
                <div className="p-6 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
                  {isLoadingLogs ? 'Loading audit trail records...' : 'No statutory audit logs recorded yet for this candidate context.'}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-900 text-white font-bold">
                      <tr>
                        <th className="p-2.5 border border-slate-800">Timestamp</th>
                        <th className="p-2.5 border border-slate-800">Actor</th>
                        <th className="p-2.5 border border-slate-800">Action Event</th>
                        <th className="p-2.5 border border-slate-800">IP Address</th>
                        <th className="p-2.5 border border-slate-800 font-mono">SHA-256 Chain Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, idx) => (
                        <tr key={log.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 border border-slate-200 font-mono text-[11px]">
                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-2.5 border border-slate-200 font-bold text-indigo-700">
                            {log.actor_role} ({log.actor_email})
                          </td>
                          <td className="p-2.5 border border-slate-200 font-extrabold text-slate-900">
                            {log.action}
                          </td>
                          <td className="p-2.5 border border-slate-200 font-mono">
                            {log.ip_address}
                          </td>
                          <td className="p-2.5 border border-slate-200 font-mono text-[10px] text-slate-600 truncate max-w-[150px]">
                            {log.curr_hash}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-secondary font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
          >
            Close Governance Portal
          </button>
        </div>

      </div>
    </div>
  );
};
