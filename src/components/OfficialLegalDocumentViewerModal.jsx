import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  CheckCircle2, 
  X, 
  Download, 
  Building2, 
  Award, 
  Lock, 
  Calendar,
  Printer
} from 'lucide-react';

export const OfficialLegalDocumentViewerModal = ({ isOpen, onClose, docType, docTitle, docSubtitle, content, certNumber }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 animate-modal-spring max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 text-purple-300 flex items-center justify-center font-black">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{docTitle || 'Official Statutory Certificate'}</h3>
                <span className="badge badge-purple text-[9px] font-black uppercase">GOVT COMPLIANT</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{docSubtitle || 'Verified Point-in-Time Regulatory Record'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate / Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-800">
          
          {/* Certificate Header Banner */}
          <div className="p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/80 text-center space-y-3 relative overflow-hidden shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 block">
                JOY CORPORATE SOLUTIONS PRIVATE LIMITED
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {docTitle || 'CERTIFICATE OF STATUTORY COMPLIANCE'}
              </h2>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Registered Under Ministry of Corporate Affairs • CIN: U74999TN2026PTC184912
              </p>
            </div>

            {/* Certificate ID Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-purple-200 text-slate-700 font-mono text-[11px] font-bold shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Certificate No: {certNumber || 'JOY/LEG-2026/0942'}</span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="space-y-4 leading-relaxed bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
            <h4 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>STATUTORY RECITALS & REGULATORY PROVISIONS</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE & ENFORCEABLE
              </span>
            </h4>

            <div className="text-xs text-slate-700 space-y-3 whitespace-pre-line leading-relaxed">
              {content}
            </div>
          </div>

          {/* Legal Signatures & Seal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Chief Compliance Officer</span>
              <strong className="text-xs font-black text-slate-900 block">Adv. Rajeshwari Sundaram, B.A. B.L.</strong>
              <p className="text-[11px] text-slate-500 font-mono">Bar Council Reg: BC/TN/2026/0912</p>
              <div className="pt-2 flex items-center gap-2 text-[10px] text-indigo-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Digitally Certified & Timestamped</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 text-right sm:text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Authorized Signatory</span>
              <strong className="text-xs font-black text-slate-900 block">JOY Corporate Solutions Pvt Ltd</strong>
              <p className="text-[11px] text-slate-500 font-mono">Statutory Trust ID: JOY-TRUST-IN-994</p>
              <div className="pt-2 flex items-center gap-2 text-[10px] text-indigo-700 font-bold justify-end sm:justify-start">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>ISO 27001:2022 Certified ISMS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl shrink-0">
          <span className="text-[10px] text-slate-400 font-medium">
            This document is an authentic electronic record under Section 4 of the Information Technology Act 2000.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn btn-secondary text-xs py-2 px-4 font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
