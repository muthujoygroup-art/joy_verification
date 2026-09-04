import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  User, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  CreditCard, 
  Users, 
  X,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export const EmployeeLaborProfileModal = ({ candidate, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!candidate) return null;

  const handleDownloadPdf = () => {
    const downloadUrl = api.exportLaborProfileDossierUrl(candidate.token || candidate.id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Labor_Profile_Dossier_${candidate.name?.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const c = candidate;
  const verifs = c.verificationsCompleted || {};
  const facePhoto = c.faceImages?.straight || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start print:p-0 print:bg-white animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 my-auto text-slate-900 relative print:border-none print:shadow-none print:max-w-none">
        
        {/* Action Header Controls (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan text-[10px]">Labor Profile Dossier</span>
            <span className="text-xs text-slate-500 font-bold">• CiteHR Standard Joining Sheet</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="btn btn-company text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download Dossier PDF</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 ml-2 text-lg">✕</button>
          </div>
        </div>

        {/* Dossier Sheet */}
        <div className="p-6 border border-slate-300 rounded-xl bg-white space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-sky-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
                JOY
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase">JOY DATA VERIFICATION</h1>
                <p className="text-xs font-bold text-sky-700 uppercase tracking-wider">Comprehensive Labor & Employee Joining Dossier</p>
                <p className="text-[10px] text-slate-400 font-medium">Standard Statutory Employment Record (Form 11 / KYC Compliant)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {facePhoto && (
                <div className="w-20 h-24 rounded-lg border-2 border-slate-300 overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center">
                  <img src={facePhoto} alt="Employee Portrait" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-right text-xs space-y-1">
                <span className="badge badge-emerald">Verified Labor Profile</span>
                <p className="text-[11px] text-slate-500 font-mono">Emp ID: #{c.empId || 'EMP-2026-88'}</p>
                <p className="text-[10px] text-slate-400 font-mono">Token: {c.token}</p>
              </div>
            </div>
          </div>

          {/* Section 1: Personal & Bio Demographics */}
          <div className="space-y-2">
            <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>SECTION 1: PERSONAL & BIO DEMOGRAPHICS</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div><span className="text-slate-400 block text-[11px]">Full Name:</span><strong>{c.name}</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Father / Spouse Name:</span><strong>Suresh Kumar</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Date of Birth (DOB):</span><strong>15-May-1996</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Gender / Marital Status:</span><strong>Male / Married</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Blood Group:</span><strong>O+ Positive</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Nationality:</span><strong>Indian</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Designation:</span><strong>{c.designation || 'Associate'}</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Department:</span><strong>{c.dept || 'Engineering'}</strong></div>
            </div>
          </div>

          {/* Section 2: Contact & Residential Addresses */}
          <div className="space-y-2">
            <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>SECTION 2: CONTACT & RESIDENTIAL ADDRESSES</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <span className="text-slate-400 block text-[11px]">Mobile Number & Official Email:</span>
                <strong>{c.mobile} • {c.email || 'employee@joydata.com'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Emergency Contact Person & Phone:</span>
                <strong>Suresh Kumar (Father) • +91 98111 22334</strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Present Residential Address:</span>
                <p className="font-medium text-slate-800">124, Green Glen Layout, Bellandur, Bengaluru, KA - 560103</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block text-[11px]">Permanent Home Town Address:</span>
                <p className="font-medium text-slate-800">45, MG Road, Civil Lines, Jaipur, RJ - 302001</p>
              </div>
            </div>
          </div>

          {/* Section 3: Statutory & Government Identifiers */}
          <div className="space-y-2">
            <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>SECTION 3: STATUTORY & GOVERNMENT IDENTIFIERS</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div><span className="text-slate-400 block text-[11px]">Aadhaar UIDAI No:</span><strong className="font-mono text-emerald-700">{c.aadhaarNo || '5489 1234 9876'} ✓</strong></div>
              <div><span className="text-slate-400 block text-[11px]">PAN Card Number:</span><strong className="font-mono text-emerald-700">ABCDE1234F ✓</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Driving License (DL):</span><strong className="font-mono">RJ-14201800912</strong></div>
              <div><span className="text-slate-400 block text-[11px]">UAN / EPF Number:</span><strong className="font-mono">100982341209</strong></div>
            </div>
          </div>

          {/* Section 4: Academic Qualifications */}
          <div className="space-y-2">
            <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>SECTION 4: ACADEMIC QUALIFICATIONS & EDUCATION</span>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2">Qualification</th>
                    <th className="p-2">Board / University</th>
                    <th className="p-2">Year of Passing</th>
                    <th className="p-2">Percentage / Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-semibold">B.Tech in Computer Science</td>
                    <td className="p-2">VTU Technological University</td>
                    <td className="p-2">2018</td>
                    <td className="p-2 text-emerald-700 font-bold">82.4%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Higher Secondary (10+2)</td>
                    <td className="p-2">Central Board of Secondary Education</td>
                    <td className="p-2">2014</td>
                    <td className="p-2 text-emerald-700 font-bold">86.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Banking & Nominee Details */}
          <div className="space-y-2">
            <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>SECTION 5: BANKING & STATUTORY NOMINEE DETAILS</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div><span className="text-slate-400 block text-[11px]">Bank Name:</span><strong>HDFC Bank</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Account Number:</span><strong className="font-mono">50100234129845</strong></div>
              <div><span className="text-slate-400 block text-[11px]">IFSC Code:</span><strong className="font-mono">HDFC0001234</strong></div>
              <div><span className="text-slate-400 block text-[11px]">Nominee Name (Relation):</span><strong>Sunita Kumar (Spouse)</strong></div>
            </div>
          </div>

          {/* Section 6: Candidate Formal Signature */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-slate-900">Statutory Labor Declaration:</p>
              <p className="text-[11px] text-slate-500">I hereby declare that all particulars stated above are true and complete to the best of my knowledge.</p>
            </div>
            <div className="text-center border-t sm:border-t-0 sm:border-l border-slate-300 sm:pl-6 pt-3 sm:pt-0">
              <div className="w-44 h-10 border-b border-dashed border-slate-400 flex items-center justify-center italic text-slate-700 font-serif">
                {c.name}
              </div>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">Candidate Signature / Date</span>
            </div>
          </div>

        </div>

        </div>
      </div>
  );
};
