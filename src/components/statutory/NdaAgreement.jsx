import React from 'react';

export const NdaAgreement = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'Candidate Name';
  const pan = c.panNo || jf.panNo || 'ABCDE1234F';
  const aadhaar = c.aadhaarNo || jf.aadhaarNo || '-';
  const doj = c.doj || jf.doj || '2026-04-13';
  const designation = c.designation || jf.designation || 'Software Specialist';
  const empId = c.employeeNumber || c.empId || jf.empId || 'JOY-EMP-2026-001';
  const specimenSig = c.specimenSignature || jf.specimenSignature || jf.uploadedDocuments?.docSpecimenSignature?.file_path || null;

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-4 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      {/* Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
        <div className="text-[11px] font-bold text-indigo-700 tracking-wider">EMPLOYMENT CONFIDENTIALITY & IP ASSIGNMENT</div>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 mt-1">
          NON-DISCLOSURE & PROPRIETARY INFORMATION AGREEMENT (NDA)
        </h2>
        <p className="text-[9.5px] text-slate-600 font-medium leading-tight max-w-xl mx-auto">
          Executed between <strong>{companyName}</strong> ("Company") and <strong>{name}</strong> ("Employee")
        </p>
      </div>

      {/* Recitals */}
      <div className="space-y-2 text-xs leading-relaxed">
        <p>
          This Non-Disclosure & Proprietary Information Agreement (the "Agreement") is made effective as of <strong className="font-mono">{doj}</strong>, by and between <strong>{companyName}</strong>, and <strong>{name}</strong> (Employee ID: <strong className="font-mono">{empId}</strong>, Aadhaar: <strong className="font-mono">{aadhaar}</strong>).
        </p>

        <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2 text-[11px]">
          <strong className="block font-bold text-slate-900 uppercase underline text-[10px]">Key Binding Covenants:</strong>
          <p><strong>1. Confidential Information:</strong> Employee acknowledges access to confidential business secrets, software source codes, algorithmic models, customer PII, payroll databases, and strategic plans.</p>
          <p><strong>2. Non-Disclosure:</strong> Employee agrees not to publish, reproduce, or disclose any confidential information to third parties without prior written authorization.</p>
          <p><strong>3. Intellectual Property Assignment:</strong> All inventions, software routines, designs, copyrights, and discoveries made during employment shall belong exclusively to {companyName}.</p>
          <p><strong>4. DPDP Act 2023 & ISO 27001 Compliance:</strong> Employee covenants to strictly uphold digital data protection standards and safe credential management.</p>
        </div>
      </div>

      {/* Digital Stamp & Signatures */}
      <div className="flex items-end justify-between pt-3 text-[11px] border-t border-slate-300">
        <div>
          <div>Date: <strong className="font-mono">{doj}</strong></div>
          <div>Place: <strong>Bengaluru / India</strong></div>
          <div className="text-[9px] text-slate-500 font-mono mt-0.5">Agreement UUID: NDA-2026-{(name || 'EMP').replace(/\s+/g, '-').toUpperCase()}</div>
        </div>
        <div className="text-right min-w-[140px]">
          {specimenSig ? (
            <img src={specimenSig} alt="Signature" className="h-8 max-w-[130px] object-contain ml-auto" />
          ) : (
            <div className="font-serif italic font-bold text-slate-900 text-xs">✍️ {name}</div>
          )}
          <div className="border-t border-slate-800 pt-0.5 text-[10px] text-slate-600">Employee Signature & Consent</div>
        </div>
      </div>

      <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[10px] flex items-center justify-between text-indigo-950">
        <span>Stamping: Stamped electronically under Information Technology Act 2000 Sec 10A</span>
        <span className="font-bold">{companyName} — Corporate Legal Desk</span>
      </div>
    </div>
  );
};
