import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Lock, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  Building2, 
  Scale, 
  Check, 
  Info, 
  Award,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';

export const TermsAndPrivacyPolicyModal = ({ isOpen, onClose, companyName = 'Enterprise Employer', onAccept = null }) => {
  const [activeLegalTab, setActiveLegalTab] = useState('point_in_time');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
 // 'point_in_time' | 'terms' | 'privacy' | 'audit_guarantee'

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start print:p-0 print:bg-white animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 my-auto text-slate-900 relative print:border-none print:shadow-none print:max-w-none">
        
        {/* Header (Screen View) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950 text-white font-bold shadow-md">
              <Scale className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="badge badge-purple text-[9px]">Official Legal Framework</span>
                <span className="text-xs text-slate-500 font-bold">• Version 2.4 (2026 Edition)</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                JOY Corporate Solutions — Enterprise Terms & Privacy Policy
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Governing <strong className="text-indigo-900">{companyName}</strong> and JOY CORPORATE SOLUTIONS PRIVATE LIMITED
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
              title="Print Agreement"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Agreement</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold ml-1">✕</button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto text-xs font-bold print:hidden">
          <button
            onClick={() => setActiveLegalTab('point_in_time')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
              activeLegalTab === 'point_in_time' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>1. Point-in-Time Verification Truth</span>
          </button>

          <button
            onClick={() => setActiveLegalTab('terms')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
              activeLegalTab === 'terms' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveLegalTab('privacy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
              activeLegalTab === 'privacy' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. DPDP Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveLegalTab('audit_guarantee')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
              activeLegalTab === 'audit_guarantee' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>4. Cryptographic Audit Guarantee</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs leading-relaxed text-slate-700">
          
          {/* TAB 1: POINT-IN-TIME VERIFICATION TRUTH DISCLOSURE */}
          {activeLegalTab === 'point_in_time' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Highlight Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 border-2 border-amber-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>The Fundamental "Point-in-Time" Verification Principle</span>
                </div>
                <p className="text-amber-950 font-medium leading-relaxed">
                  JOY Corporate Solutions operates a direct, cryptographically authenticated conduit to authentic Government of India repositories (UIDAI, Income Tax Department, Ministry of Road Transport, DigiLocker, and Banking Penny Drop engines). <strong>Every verification is 100% authentic and genuine at the exact moment of execution.</strong>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>1. Nature of Government Repository Data</span>
                </h4>
                <p>
                  When an employee completes their verification, the fetched government records (e.g. UIDAI Aadhaar demographic name/address, PAN Tax active status, Driving License validity, and biometric match) reflect the candidate's authentic state in the official repositories <strong>strictly as of that recorded date and timestamp</strong>.
                </p>

                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 pt-2">
                  <span>2. Document Life-Cycle & Subsequent Modifications</span>
                </h4>
                <p>
                  Employees may subsequently update their residential address on Aadhaar, change their registered mobile number, renew their driving license, or obtain new statutory records. <strong>Such future changes do not invalidate the historical authenticity of the past verification dossier.</strong> The historical verification dossier remains a permanently valid, tamper-evident record of what was true at the moment of onboarding.
                </p>

                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-sky-900">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>Recommended Enterprise Best Practice for Employer Companies</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Employer companies are encouraged to implement <strong>Periodic Re-Verification Protocols</strong> (e.g. annual KYC audit sweeps or re-verification upon employee promotion/role transfer) to capture ongoing updates to candidate profiles.
                  </p>
                </div>

                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 pt-2">
                  <span>3. Enterprise Trust & Legal Admissibility</span>
                </h4>
                <p>
                  Every verification dossier generated by JOY Corporate Solutions is timestamped with atomic precision, stamped with a 256-bit SHA hash, and digitally signed with RSA-2048 credentials, making it legally admissible as electronic evidence under Section 65B of the Indian Evidence Act and the Information Technology Act 2000.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: ENTERPRISE TERMS OF SERVICE */}
          {activeLegalTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-extrabold text-slate-900 text-sm">Enterprise Service Level & Operations Agreement</h3>
              
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">1. Authorized Employer Usage</h4>
                <p>
                  The Client Company agrees to utilize the JOY Data Verification platform solely for lawful employment background screening, statutory labor compliance, and authorized workforce onboarding. Using the service for unauthorized third-party snooping or non-employment purposes is strictly prohibited.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">2. Service Uptime & API Gateway SLA</h4>
                <p>
                  JOY Corporate Solutions commits to a 99.9% platform availability SLA. While connections to third-party government repositories (API SETU, UIDAI, Income Tax) are engineered with multi-carrier failover routing, temporary upstream maintenance on government servers will be flagged transparently on the dashboard.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">3. Metered Billing & Tariffs</h4>
                <p>
                  Verifications are billed on a metered usage model according to the chosen tariff tier (Basic, Standard, or Enterprise Premier). Invoices are generated monthly on the 1st of each calendar month with 18% statutory GST, due within 15 calendar days.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DPDP PRIVACY POLICY */}
          {activeLegalTab === 'privacy' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-extrabold text-slate-900 text-sm">Digital Personal Data Protection (DPDP) Act 2023 Compliance</h3>
              
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 font-medium">
                JOY Corporate Solutions acts as a <strong>Data Processor</strong> under the Digital Personal Data Protection Act 2023, processing personal employee identity data strictly under lawful consent given by the Data Principal (candidate).
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">1. Explicit Candidate Consent Gate</h4>
                <p>
                  No government repository query or biometric liveness capture is performed without the candidate explicitly entering an Aadhaar/Mobile OTP or enabling camera permissions on their personal device.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">2. Zero Data Brokering & Purpose Limitation</h4>
                <p>
                  Candidate data is never sold, shared, monetized, or repurposed for commercial advertising. Verified dossiers remain exclusive to the designated Employer Company and the candidate.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">3. AES-256 Data Encryption at Rest & In Transit</h4>
                <p>
                  All database records, Aadhaar numbers, biometric snapshots, and document dossiers are encrypted using AES-256 encryption at rest and TLS 1.3 in transit.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CRYPTOGRAPHIC AUDIT GUARANTEE */}
          {activeLegalTab === 'audit_guarantee' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-extrabold text-slate-900 text-sm">Cryptographic Verification Guarantee & Tamper-Proof Audit</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="badge badge-purple text-[9px]">256-Bit SHA Telemetry</span>
                  <h4 className="font-bold text-slate-900 text-xs">Immutable Hash Ledger</h4>
                  <p className="text-slate-500 text-[11px]">Every verified candidate record generates a unique SHA-256 cryptographic fingerprint that detects any post-verification document tampering.</p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="badge badge-emerald text-[9px]">RSA-2048 Seal</span>
                  <h4 className="font-bold text-slate-900 text-xs">Digital Verification Seal</h4>
                  <p className="text-slate-500 text-[11px]">Official PDF certificates feature the dual emblem of JOY Corporate Solutions and the Employer Enterprise with scannable QR verification keys.</p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-indigo-950 font-bold text-xs">
                  "The document numbers and employee details are verified using JOY CORPORATE SOLUTIONS PRIVATE LIMITED under ISO 27001 Certified Security Standards."
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP 2023 Compliant • ISO 27001 Certified Security</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onAccept ? (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="btn btn-superadmin text-xs py-2 px-5 flex items-center gap-2 font-black shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>I Accept & Agree to Terms</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary text-xs py-1.5 px-4 font-bold"
              >
                Close Agreement
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
