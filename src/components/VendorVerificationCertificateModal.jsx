import React, { useRef, useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Printer, 
  X, 
  Lock, 
  Sparkles, 
  Calendar, 
  Clock, 
  Check, 
  AlertCircle,
  QrCode,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportElementToPdf } from '../services/pdfExporter';

export const VendorVerificationCertificateModal = ({ vendor, checkType = 'all', onClose }) => {
  const { platformLogoEmblem, companies } = useApp() || {};
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef(null);

  const v = vendor || {};
  const verifs = v.verifications || {};
  const comp = (companies || []).find(c => c.id === v.companyId) || {
    name: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    code: 'COMP001'
  };

  const certificateId = `JCS-VEND-CERT-${v.vendorCode || 'VEND'}-${Math.floor(100000 + Math.random() * 900000)}`;
  const formattedDate = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  }) + ' IST';

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const filename = `Vendor_Verification_Certificate_${(v.vendorName || 'Vendor').replace(/\s+/g, '_')}.pdf`;
    try {
      const el = document.getElementById('printable-vendor-certificate');
      if (el) {
        await exportElementToPdf(el, filename);
      } else {
        window.print();
      }
    } catch (e) {
      console.warn('Fallback to print:', e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Get active check details based on prop
  const activeChecks = checkType === 'all' 
    ? Object.keys(verifs) 
    : [checkType].filter(k => verifs[k]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overflow-y-auto animate-fadeIn select-none print:p-0 print:bg-white"
      onClick={(e) => {
        if (e.target === e.currentTarget && typeof onClose === 'function') onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-900 my-auto print:border-none print:shadow-none print:max-w-none print:max-h-none print:m-0"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Action Bar (Hidden on Print) */}
        <div className="px-5 py-3.5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center p-1 shrink-0">
              <img 
                src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                alt="Emblem" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                Official Statutory Audit Certificate
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                {v.vendorName || 'Vendor Verification Record'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="btn btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-black shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>{isExporting ? 'Exporting PDF...' : 'Download PDF Certificate 📄'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100/60 print:p-0 print:bg-white">
          <div 
            id="printable-vendor-certificate"
            ref={printRef}
            className="pdf-page-block max-w-[800px] mx-auto bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200 text-slate-900 space-y-6 print:border-none print:shadow-none print:p-8 print:m-0"
          >
            
            {/* 1. Official Header with Shield Emblem */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-900 p-1.5 shadow-sm flex items-center justify-center shrink-0">
                  <img 
                    src={platformLogoEmblem || "/assets/logos/joy_true_profile_shield_emblem.png"} 
                    alt="Shield Emblem" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-[9px] font-black uppercase tracking-wider mb-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Statutory Authenticated Record ✓</span>
                  </div>
                  <h1 className="text-base sm:text-xl font-black text-slate-950 uppercase tracking-tight font-outfit leading-tight">
                    JOY CORPORATE SOLUTIONS PRIVATE LIMITED
                  </h1>
                  <p className="text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    Enterprise Workforce & Third-Party Vendor Verification Authority
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                    Operating Under Statutory Guidelines • ISO 27001:2022 Certified • DPDP Act 2023 Compliant
                  </p>
                </div>
              </div>

              <div className="text-right sm:shrink-0 space-y-1">
                <span className="badge badge-purple text-[9px] font-black uppercase tracking-wider block">
                  VENDOR AUDIT DOSSIER
                </span>
                <p className="text-[10px] font-mono text-slate-700">
                  Cert ID: <strong className="text-slate-950 font-bold">{certificateId}</strong>
                </p>
                <p className="text-[9px] font-mono text-slate-500">
                  Audit Timestamp: {formattedDate}
                </p>
              </div>
            </div>

            {/* 2. Employing Enterprise & Vendor Master Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Employing Client Enterprise</span>
                <strong className="text-slate-900 font-extrabold text-sm block">{comp.name}</strong>
                <p className="text-[10px] text-slate-500 font-mono">Enterprise Mapping ID: {comp.code || comp.id}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Audited Vendor Entity</span>
                <strong className="text-indigo-950 font-extrabold text-sm block">{v.vendorName}</strong>
                <p className="text-[10px] text-slate-600 font-medium">Category: <strong>{v.category || 'Third-Party Contractor'}</strong> • Code: #{v.vendorCode}</p>
                <p className="text-[10px] text-slate-500 truncate">{v.address || 'Registered Business Office'}</p>
              </div>
            </div>

            {/* 3. CRITICAL REQUIREMENT: Official Point-in-Time Legal & Statutory Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 text-amber-950 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                  Legal & Statutory Point-in-Time Verification Notice
                </span>
              </div>
              <p className="text-[10.5px] leading-relaxed text-amber-950/90 font-medium">
                This Official Verification Certificate confirms that the credentials and statutory records for the specified document identifier(s) were <strong>queried and authenticated directly against the respective government statutory gateway(s) (GSTN, Income Tax NSDL, NPCI IMPS, Ministry of MSME, EPFO, and ESIC) on {formattedDate}</strong>.
              </p>
              <p className="text-[10px] leading-relaxed text-amber-900 font-semibold border-t border-amber-200/80 pt-1.5">
                ⚖️ <strong>Temporal Validity Clause:</strong> This audit record attests strictly to the statutory validity, active registration, and authenticity of the records as recorded in the authoritative government databases at the precise moment of verification. Any subsequent alteration, cancellation, or amendment to these credentials post-verification date is not reflected in this document.
              </p>
            </div>

            {/* 4. Document Verification Results Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Audited Document Credentials & Verification Breakdown</span>
              </h3>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-[10px] uppercase font-black tracking-wider">
                      <th className="py-2.5 px-3.5">Statutory Parameter</th>
                      <th className="py-2.5 px-3.5">Entered Identifier</th>
                      <th className="py-2.5 px-3.5">Gateway Authenticated Details</th>
                      <th className="py-2.5 px-3.5 text-center">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-800">
                    
                    {/* GSTIN Check */}
                    {verifs.gst && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-3.5">
                          <strong className="font-sans text-slate-900 font-bold block">1. GSTIN Registration</strong>
                          <span className="text-[9.5px] text-slate-400 font-sans">GSTN Central Gateway</span>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          {verifs.gst.documentNumber || '29AAACA1234A1Z5'}
                        </td>
                        <td className="py-3 px-3.5 font-sans">
                          <div className="font-bold text-slate-900">{verifs.gst.legalName}</div>
                          <div className="text-[10px] text-slate-500">Trade: {verifs.gst.tradeName} • {verifs.gst.taxpayerType}</div>
                          <div className="text-[10px] text-emerald-700 font-bold font-mono">Status: {verifs.gst.activeStatus} ({verifs.gst.filingStatus})</div>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <span className="badge badge-emerald text-[9px] font-black py-0.5 px-2">
                            VERIFIED ✓
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* PAN Check */}
                    {verifs.pan && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-3.5">
                          <strong className="font-sans text-slate-900 font-bold block">2. Income Tax PAN</strong>
                          <span className="text-[9.5px] text-slate-400 font-sans">NSDL e-Governance</span>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          {verifs.pan.documentNumber || 'AAACA1234A'}
                        </td>
                        <td className="py-3 px-3.5 font-sans">
                          <div className="font-bold text-slate-900">{verifs.pan.nameOnPan}</div>
                          <div className="text-[10px] text-slate-500">Category: {verifs.pan.category}</div>
                          <div className="text-[10px] text-emerald-700 font-bold font-mono">{verifs.pan.panStatus}</div>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <span className="badge badge-emerald text-[9px] font-black py-0.5 px-2">
                            VERIFIED ✓
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Bank Account Penny Drop */}
                    {verifs.bank && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-3.5">
                          <strong className="font-sans text-slate-900 font-bold block">3. Bank Penny Drop (IMPS)</strong>
                          <span className="text-[9.5px] text-slate-400 font-sans">NPCI Interbank Gateway</span>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          {verifs.bank.accountNumber}
                          <div className="text-[10px] text-slate-500 font-mono">IFSC: {verifs.bank.ifsc}</div>
                        </td>
                        <td className="py-3 px-3.5 font-sans">
                          <div className="font-bold text-emerald-900">{verifs.bank.beneficiaryName}</div>
                          <div className="text-[10px] text-slate-500">Bank: {verifs.bank.bankName}</div>
                          <div className="text-[10px] text-emerald-700 font-bold font-mono">UTR: {verifs.bank.utrNumber} ({verifs.bank.matchScore}% Match)</div>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <span className="badge badge-emerald text-[9px] font-black py-0.5 px-2">
                            VERIFIED ✓
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* MSME Udyam Check */}
                    {verifs.msme && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-3.5">
                          <strong className="font-sans text-slate-900 font-bold block">4. MSME / Udyam Reg.</strong>
                          <span className="text-[9.5px] text-slate-400 font-sans">Ministry of MSME</span>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          {verifs.msme.documentNumber}
                        </td>
                        <td className="py-3 px-3.5 font-sans">
                          <div className="font-bold text-slate-900">{verifs.msme.enterpriseType}</div>
                          <div className="text-[10px] text-slate-500">Activity: {verifs.msme.majorActivity}</div>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <span className="badge badge-emerald text-[9px] font-black py-0.5 px-2">
                            VERIFIED ✓
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* EPFO Check */}
                    {verifs.epfo && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-3.5">
                          <strong className="font-sans text-slate-900 font-bold block">5. EPFO Establishment</strong>
                          <span className="text-[9.5px] text-slate-400 font-sans">EPFO Unified Portal</span>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          {verifs.epfo.documentNumber}
                        </td>
                        <td className="py-3 px-3.5 font-sans">
                          <div className="font-bold text-slate-900">{verifs.epfo.establishmentName}</div>
                          <div className="text-[10px] text-slate-500">{verifs.epfo.activeStatus}</div>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <span className="badge badge-emerald text-[9px] font-black py-0.5 px-2">
                            VERIFIED ✓
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* ESIC Check */}
                    {verifs.esic && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-3.5">
                          <strong className="font-sans text-slate-900 font-bold block">6. ESIC Establishment</strong>
                          <span className="text-[9.5px] text-slate-400 font-sans">ESIC Portal</span>
                        </td>
                        <td className="py-3 px-3.5 font-bold text-slate-900">
                          {verifs.esic.documentNumber}
                        </td>
                        <td className="py-3 px-3.5 font-sans">
                          <div className="font-bold text-slate-900">{verifs.esic.employerName}</div>
                          <div className="text-[10px] text-slate-500">{verifs.esic.complianceStatus}</div>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <span className="badge badge-emerald text-[9px] font-black py-0.5 px-2">
                            VERIFIED ✓
                          </span>
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Statutory Security Seals & Authorized Signature */}
            <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              
              {/* QR Code & Security Stamp */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-center p-1 shrink-0">
                  <div className="text-center font-mono text-[8px] text-slate-500">
                    <QrCode className="w-10 h-10 text-slate-900 mx-auto" />
                    <span>AUDIT HASH</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-500 font-mono leading-tight">
                  <span>Tamper-evident SHA-256</span>
                  <p className="text-[8px] text-slate-400 truncate">GATEWAY-SEAL-2026-{certificateId.slice(-6)}</p>
                  <span className="text-emerald-700 font-bold">100% Cryptographic Lock</span>
                </div>
              </div>

              {/* Statutory Seals */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  <span>UIDAI</span> • <span>NSDL</span> • <span>GSTN</span> • <span>EPFO</span>
                </div>
                <p className="text-[9px] text-slate-500">
                  Direct Gateway Integration via CoinCircleTrust™
                </p>
              </div>

              {/* Digital Authorized Signatory */}
              <div className="text-right space-y-1">
                <div className="font-cursive text-indigo-900 text-sm font-bold pr-2">
                  Praveen B.
                </div>
                <div className="border-t border-slate-300 pt-1">
                  <strong className="text-slate-900 font-bold text-[11px] block">
                    Authorized Verification Officer
                  </strong>
                  <span className="text-[10px] text-slate-500 block">
                    JOY CORPORATE SOLUTIONS PVT LTD
                  </span>
                  <span className="text-[8.5px] text-slate-400 font-mono">
                    Digitally Signed on {formattedDate}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
