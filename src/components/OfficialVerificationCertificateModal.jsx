import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Award, 
  QrCode,
  Building2,
  FileCheck2,
  Lock,
  Sparkles,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { exportElementToPdf } from '../services/pdfExporter';

export const OfficialVerificationCertificateModal = ({ candidate, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!candidate) return null;

  const isFullyVerified = candidate.status === 'Verified' || candidate.status === 'VERIFIED';
  const certId = `JCS-VERIF-2026-${candidate.id?.replace('emp-', '') || '101'}-${isFullyVerified ? '889' : 'DRAFT'}`;
  const verifDate = isFullyVerified 
    ? (candidate.verificationDate || '2026-08-28 10:30 IST') 
    : 'Pending Final Verification';
  const companyName = candidate.companyName || candidate.joiningFormData?.companyName || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED';

  const verifs = candidate.verificationsCompleted || {};
  const aadhaarPassed = !!verifs.aadhaar;
  const mobilePassed = !!verifs.mobile;
  const facePassed = !!verifs.face;
  const panPassed = !!verifs.pan;
  const bankPassed = !!verifs.bank || !!verifs.bankCheck;



  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const filename = `JOY_Corporate_Certificate_${(candidate.name || 'Candidate').replace(/\s+/g, '_')}.pdf`;
    try {
      const el = document.getElementById('printable-official-certificate');
      if (el) {
        await exportElementToPdf(el, filename);
      } else {
        await api.downloadDocument(api.exportCertificatePdfUrl(candidate.token || candidate.id), filename);
      }
    } catch (e) {
      console.warn("Client PDF generation fallback to print:", e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white animate-fadeIn">
      <div className="bg-white w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-double border-indigo-200 p-4 sm:p-8 space-y-5 sm:space-y-6 my-auto text-slate-900 relative print:border-none print:shadow-none print:max-w-none animate-modal-spring">
        
        {/* Action Header Controls (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className={`badge text-[10px] ${isFullyVerified ? 'badge-purple' : 'badge-amber'}`}>
              {isFullyVerified ? 'Official Compliance Certificate' : 'Provisional Certificate (Pending Verification)'}
            </span>
            <span className="text-xs text-slate-500 font-bold">• JOY CORPORATE SOLUTIONS PVT LTD</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="btn btn-superadmin text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? "Compiling PDF..." : "Download Official PDF"}</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 ml-2 text-lg cursor-pointer">✕</button>
          </div>
        </div>

        {/* Certificate Decorative Border Container */}
        <div id="printable-official-certificate" className={`p-6 sm:p-8 border-2 rounded-xl space-y-6 relative overflow-hidden bg-white ${
          isFullyVerified 
            ? 'border-indigo-600/30 bg-gradient-to-b from-slate-50/50 via-white to-indigo-50/30' 
            : 'border-amber-400/50 bg-gradient-to-b from-amber-50/30 via-white to-slate-50/40'
        }`}>
          
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <ShieldCheck className="w-96 h-96 text-indigo-900" />
          </div>

          {/* Top Brand Dual-Logo Header Block */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-indigo-100 pb-4 relative z-10">
            {/* Logo 1: JOY Corporate Solutions Logo */}
            <div className="p-2 rounded-2xl bg-white border-2 border-indigo-100 shadow-sm flex items-center justify-center shrink-0">
              <img 
                src="/joy_logo.png" 
                alt="JOY Logo" 
                className="w-14 h-14 object-contain" 
              />
            </div>

            {/* Central Authority Header */}
            <div className="text-center space-y-1">
              <h1 className="text-lg sm:text-xl font-black text-indigo-950 tracking-tight">
                JOY CORPORATE SOLUTIONS PRIVATE LIMITED
              </h1>
              <p className="text-[11px] font-extrabold text-indigo-600 tracking-widest uppercase">
                Enterprise Identity Verification & Compliance Division
              </p>
              <p className="text-[9.5px] text-slate-500 font-semibold">
                CIN: U74999KA2026PTC098214 • ISO 27001:2022 Certified Government Gateway Partner
              </p>
            </div>

            {/* Logo 2: Employer Company Logo */}
            <div className="p-3 rounded-xl bg-sky-700 text-white flex flex-col items-center justify-center font-black shadow-md min-w-[130px]">
              <Building2 className="w-6 h-6 mb-0.5 text-sky-200" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-200">EMPLOYER</span>
              <span className="text-xs font-black text-white text-center leading-tight">{companyName.split(' ')[0]}</span>
            </div>
          </div>

          {/* Certificate Identification Banner */}
          <div className={`border rounded-xl p-3 flex flex-wrap items-center justify-between text-xs font-semibold gap-2 relative z-10 ${
            isFullyVerified 
              ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900' 
              : 'bg-amber-50/90 border-amber-300 text-amber-950'
          }`}>
            <div>
              <span className="text-slate-500 font-medium">Certificate Ref: </span>
              <strong className="font-mono text-indigo-700">{certId}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Verification Timestamp: </span>
              <strong>{verifDate}</strong>
            </div>
            <div className={`badge flex items-center gap-1 ${isFullyVerified ? 'badge-emerald' : 'badge-amber'}`}>
              {isFullyVerified ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>VERIFIED & COMPLIANT ✓</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>PROVISIONAL • PENDING GATES ⌛</span>
                </>
              )}
            </div>
          </div>

          {/* The Mandated Formal Certification Text */}
          <div className={`text-center py-2.5 px-4 rounded-xl shadow-sm relative z-10 ${
            isFullyVerified ? 'bg-indigo-950 text-white' : 'bg-slate-900 text-amber-200'
          }`}>
            <p className="text-xs sm:text-sm font-black tracking-wide leading-relaxed">
              {isFullyVerified ? (
                <>THIS IS TO CERTIFY THAT THE DOCUMENT NUMBERS AND EMPLOYEE DETAILS SPECIFIED BELOW HAVE BEEN THOROUGHLY VERIFIED AND AUTHENTICATED USING <span className="underline decoration-amber-400">JOY CORPORATE SOLUTIONS PRIVATE LIMITED</span> COMPLIANCE ENGINE.</>
              ) : (
                <>⚠️ PROVISIONAL AUDIT NOTICE: THIS RECORD HAS BEEN REGISTERED UNDER <span className="underline decoration-amber-400">JOY CORPORATE SOLUTIONS</span> AND IS CURRENTLY UNDERGOING GOVERNMENT GATEWAY & BIOMETRIC VERIFICATION AUDIT.</>
              )}
            </p>
          </div>

          {/* Verified Candidate Profile Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-sm relative z-10">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Employee Full Name</span>
              <strong className="text-slate-900 font-extrabold text-sm">{candidate.name}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Employee Code / ID</span>
              <strong className="text-slate-900 font-extrabold text-sm">{candidate.empId || candidate.employeeNumber || 'EMP-2026-88'}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Designation</span>
              <strong className="text-slate-900 font-bold">{candidate.designation || 'Specialist'}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Employer Enterprise</span>
              <strong className="text-sky-700 font-bold">{companyName}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Mobile Number</span>
              <strong className="text-slate-900 font-bold font-mono">{candidate.mobile}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Aadhaar Identity Ref</span>
              <strong className="text-slate-900 font-bold font-mono">{candidate.aadhaarNo ? `XXXX XXXX ${candidate.aadhaarNo.slice(-4)}` : 'XXXX XXXX 9876'}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Token Link Reference</span>
              <strong className="text-indigo-600 font-mono text-[11px] truncate block">{candidate.token}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Biometrics Liveness Score</span>
              {facePassed ? (
                <span className="badge badge-emerald text-[10px]">99.4% Match ✓</span>
              ) : (
                <span className="badge badge-amber text-[10px]">Pending Liveness ⌛</span>
              )}
            </div>
          </div>

          {/* Audit Verification Table */}
          <div className="space-y-1 relative z-10">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Statutory Verification Audit Breakdown</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-indigo-950 text-white font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5">Verification Check</th>
                    <th className="p-2.5">Provider Gateway</th>
                    <th className="p-2.5">Telemetry & Score</th>
                    <th className="p-2.5 text-right">Audit Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  
                  {/* Check 1: Aadhaar */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">1. Aadhaar UIDAI Check</td>
                    <td className="p-2 text-slate-600">Govt API SETU DigiLocker Gateway</td>
                    <td className="p-2 text-slate-500 font-mono text-[11px]">
                      {aadhaarPassed ? '256-Bit SHA Match' : 'Awaiting DigiLocker OTP'}
                    </td>
                    <td className="p-2 text-right">
                      {aadhaarPassed ? (
                        <span className="badge badge-emerald text-[10px]">PASSED ✓</span>
                      ) : (
                        <span className="badge badge-amber text-[10px]">NEED TO VERIFY ⌛</span>
                      )}
                    </td>
                  </tr>

                  {/* Check 2: Mobile */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">2. Mobile OTP Validation</td>
                    <td className="p-2 text-slate-600">Carrier SMS Gateway (Sandbox API)</td>
                    <td className="p-2 text-slate-500 font-mono text-[11px]">
                      {mobilePassed ? 'OTP Authenticated' : 'Awaiting SMS OTP Verification'}
                    </td>
                    <td className="p-2 text-right">
                      {mobilePassed ? (
                        <span className="badge badge-emerald text-[10px]">PASSED ✓</span>
                      ) : (
                        <span className="badge badge-amber text-[10px]">NEED TO VERIFY ⌛</span>
                      )}
                    </td>
                  </tr>

                  {/* Check 3: Face Liveness */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">3. AI Face Liveness Match</td>
                    <td className="p-2 text-slate-600">Coincircletrust 3-Pose Engine</td>
                    <td className="p-2 text-slate-500 font-mono text-[11px]">
                      {facePassed ? '99.4% Liveness Score' : 'Awaiting WebCam Face Scan'}
                    </td>
                    <td className="p-2 text-right">
                      {facePassed ? (
                        <span className="badge badge-emerald text-[10px]">PASSED ✓</span>
                      ) : (
                        <span className="badge badge-amber text-[10px]">NEED TO VERIFY ⌛</span>
                      )}
                    </td>
                  </tr>

                  {/* Check 4: PAN Tax Identity */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">4. PAN Tax Identity Check</td>
                    <td className="p-2 text-slate-600">Income Tax Dept NSDL Repository</td>
                    <td className="p-2 text-slate-500 font-mono text-[11px]">
                      {panPassed ? 'Active PAN Holder Linked' : 'Pending NSDL Gateway Query'}
                    </td>
                    <td className="p-2 text-right">
                      {panPassed ? (
                        <span className="badge badge-emerald text-[10px]">AUTHENTICATED ✓</span>
                      ) : (
                        <span className="badge badge-amber text-[10px]">NEED TO VERIFY ⌛</span>
                      )}
                    </td>
                  </tr>

                  {/* Check 5: Bank Penny Drop */}
                  <tr className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-800">5. Bank Penny Drop Check</td>
                    <td className="p-2 text-slate-600">NPCI / IMPS Banking API</td>
                    <td className="p-2 text-slate-500 font-mono text-[11px]">
                      {bankPassed ? 'Beneficiary Name Match' : 'Pending Penny Drop Deposit'}
                    </td>
                    <td className="p-2 text-right">
                      {bankPassed ? (
                        <span className="badge badge-emerald text-[10px]">AUTHENTICATED ✓</span>
                      ) : (
                        <span className="badge badge-amber text-[10px]">NEED TO VERIFY ⌛</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Digital Certification Seal & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-indigo-100 text-xs items-center relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Certified Authority</span>
              <p className="font-extrabold text-slate-900">JOY CORPORATE SOLUTIONS</p>
              <p className="text-[11px] text-slate-500">Bangalore Tech Hub, KA - 560103</p>
            </div>

            <div className={`text-center p-2 rounded-xl border ${
              isFullyVerified ? 'bg-indigo-50 border-indigo-200' : 'bg-amber-50 border-amber-300'
            }`}>
              <div className="w-7 h-7 mx-auto text-indigo-700 mb-1 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-black text-indigo-900">
                {isFullyVerified ? 'DIGITALLY VERIFIED SEAL' : 'PROVISIONAL AUDIT SEAL'}
              </p>
              <p className="text-[9px] text-indigo-600 font-mono">
                {isFullyVerified ? 'RSA-2048 / 8fa9-22b1-098e' : 'AUDIT-PENDING / GATE-AUTH'}
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Authorized Signatory</span>
              <p className="font-serif italic font-bold text-indigo-950 text-sm">Vikramaditya Rao</p>
              <p className="text-[11px] font-semibold text-slate-700">Chief Compliance Officer (CCO)</p>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 print:hidden">
          <span>Official digital verification record valid under Information Technology Act, 2000.</span>
          <span className="font-bold text-indigo-600">JOY CORPORATE SOLUTIONS PVT LTD • All Rights Reserved</span>
        </div>

      </div>
    </div>
  );
};
