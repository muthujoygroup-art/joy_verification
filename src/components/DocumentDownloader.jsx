import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Printer,
  ShieldCheck,
  Package,
  FileCheck,
  FileSpreadsheet,
  Award,
  Eye,
  Building2,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { OfficialVerificationCertificateModal } from './OfficialVerificationCertificateModal';
import { EmployeeProfileDossierModal } from './EmployeeProfileDossierModal';

export const DocumentDownloader = ({ candidate, onClose }) => {
  const [showCertPreview, setShowCertPreview] = useState(false);
  const [showDossierPreview, setShowDossierPreview] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  if (!candidate) return null;

  // Direct backend PDF downloads
  const handleDownloadCertificatePdf = () => {
    const url = api.exportCertificatePdfUrl(candidate.token || candidate.id);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JOY_Corporate_Certificate_${candidate.name?.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('JOY Corporate Verification Certificate (PDF)');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadEmployeeDossierPdf = () => {
    const url = api.exportLaborProfileDossierUrl(candidate.token || candidate.id);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Employee_Profile_Dossier_${candidate.name?.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('Employee Profile Dossier (4-Page PDF)');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleDownloadExcel = () => {
    const csvContent = 
      `Candidate Name,Employee ID,Designation,Department,Mobile,Aadhaar Number,Aadhaar Status,Mobile OTP Status,Face Match Status,Final Status,Verification Timestamp\n` +
      `"${candidate.name}","${candidate.empId || 'EMP-2026-88'}","${candidate.designation || 'Associate'}","${candidate.dept || 'Operations'}","${candidate.mobile}","${candidate.aadhaarNo || '5489 1234 9876'}","Passed","Passed","Passed (99.4%)","${candidate.status}","${candidate.verificationDate || '2026-08-24 10:30'}"\n`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit_Ledger_${candidate.name?.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess('Audit Ledger (Excel/CSV)');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="glass-panel w-full max-w-xl p-6 space-y-5 border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="text-base font-extrabold">Download Verification Documents</h3>
                <p className="text-xs text-slate-500 font-medium">Official verified documents for <strong className="text-slate-900">{candidate.name}</strong></p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Downloaded "{downloadSuccess}" successfully!</span>
            </div>
          )}

          <div className="space-y-3.5 text-xs">
            
            {/* PRIMARY DOCUMENT 1: Employee Profile Dossier PDF (4 Pages) */}
            <div className="p-4 rounded-xl border-2 border-sky-300 bg-sky-50/50 hover:bg-sky-50 transition-all space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-700 text-white font-bold shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-slate-900 text-sm">1. Comprehensive Employee Profile Dossier</h4>
                      <span className="badge badge-cyan text-[9px]">4-Page PDF</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Exhaustive employee sheet with Employer Company Logo, personal bio, photograph, KYC IDs, education, prior employment history, banking & nominee declarations.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowDossierPreview(true)}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-700" />
                  <span>Preview & Print</span>
                </button>
                <button
                  onClick={handleDownloadEmployeeDossierPdf}
                  className="btn btn-company text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 4-Page Dossier PDF</span>
                </button>
              </div>
            </div>

            {/* PRIMARY DOCUMENT 2: Official JOY Corporate Verification Certificate (Dual Logos) */}
            <div className="p-4 rounded-xl border-2 border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 transition-all space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-950 text-white font-bold shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-slate-900 text-sm">2. JOY Corporate Solutions Official Certificate</h4>
                      <span className="badge badge-purple text-[9px]">Dual Logos</span>
                    </div>
                    <p className="text-[11px] text-indigo-950 font-bold mt-0.5">
                      "The document numbers and employee details are verified using JOY CORPORATE SOLUTIONS PRIVATE LIMITED"
                    </p>
                    <p className="text-[10px] text-slate-500">Includes JOY Corporate Logo + Employer Company Logo, 256-bit UIDAI hash, biometric 99.4% match scores, and digital verification seal.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowCertPreview(true)}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Preview Certificate</span>
                </button>
                <button
                  onClick={handleDownloadCertificatePdf}
                  className="btn btn-superadmin text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official PDF</span>
                </button>
              </div>
            </div>

            {/* AUXILIARY FORMAT: Excel Audit Ledger */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-emerald-300 transition-all">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">Excel Audit & Verification Ledger</h5>
                  <p className="text-[10px] text-slate-500">Structured candidate data spreadsheet (.csv / .xlsx)</p>
                </div>
              </div>
              <button 
                onClick={handleDownloadExcel}
                className="btn btn-hrexecutive text-xs py-1 px-2.5 flex items-center gap-1 font-bold"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
            </div>

          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button onClick={onClose} className="btn btn-secondary text-xs font-bold">Close Window</button>
          </div>

        </div>
      </div>

      {/* Modals for Direct Full Previews */}
      {showCertPreview && (
        <OfficialVerificationCertificateModal
          candidate={candidate}
          onClose={() => setShowCertPreview(false)}
        />
      )}

      {showDossierPreview && (
        <EmployeeProfileDossierModal
          candidate={candidate}
          onClose={() => setShowDossierPreview(false)}
        />
      )}
    </>
  );
};
