import React from 'react';

export const NonCompeteAgreement = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'Candidate Name';
  const doj = c.doj || jf.doj || '2026-04-13';
  const designation = c.designation || jf.designation || 'Specialist';
  const empId = c.employeeNumber || c.empId || jf.empId || 'JOY-EMP-2026-001';
  const specimenSig = c.specimenSignature || jf.specimenSignature || jf.uploadedDocuments?.docSpecimenSignature?.file_path || null;

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-4 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      {/* Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
        <div className="text-[11px] font-bold text-amber-700 tracking-wider">ENTERPRISE TRADE SECRET PROTECTION</div>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 mt-1">
          NON-COMPETE & NON-SOLICITATION STATUTORY COVENANT
        </h2>
        <p className="text-[9.5px] text-slate-600 font-medium leading-tight max-w-xl mx-auto">
          Covenant protecting proprietary business goodwill, client relationships, and technological assets
        </p>
      </div>

      <div className="space-y-2 text-xs leading-relaxed">
        <p>
          This Non-Compete and Non-Solicitation Covenant is entered into on <strong className="font-mono">{doj}</strong> by and between <strong>{companyName}</strong> and <strong>{name}</strong> ({designation}, ID: {empId}).
        </p>

        <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2 text-[11px]">
          <strong className="block font-bold text-slate-900 uppercase underline text-[10px]">Binding Protective Terms:</strong>
          <p><strong>1. Non-Solicitation of Clients:</strong> During employment and for 12 months post-cessation, Employee shall not directly or indirectly solicit business from any client or prospective customer of {companyName}.</p>
          <p><strong>2. Non-Solicitation of Personnel:</strong> Employee shall not recruit or solicit any employee, consultant, or contractor of {companyName}.</p>
          <p><strong>3. Non-Disparagement:</strong> Both parties agree to maintain professional goodwill and refrain from defamatory statements across social and business media.</p>
        </div>
      </div>

      {/* Signature & Seal */}
      <div className="flex items-end justify-between pt-3 text-[11px] border-t border-slate-300">
        <div>
          <div>Date: <strong className="font-mono">{doj}</strong></div>
          <div>Place: <strong>Bengaluru / India</strong></div>
        </div>
        <div className="text-right min-w-[140px]">
          {specimenSig ? (
            <img src={specimenSig} alt="Signature" className="h-8 max-w-[130px] object-contain ml-auto" />
          ) : (
            <div className="font-serif italic font-bold text-slate-900 text-xs">✍️ {name}</div>
          )}
          <div className="border-t border-slate-800 pt-0.5 text-[10px] text-slate-600">Employee Signature</div>
        </div>
      </div>
    </div>
  );
};
