import React from 'react';

export const PoshPolicyDeclaration = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'Candidate Name';
  const doj = c.doj || jf.doj || '2026-04-13';
  const designation = c.designation || jf.designation || 'Specialist';
  const empId = c.employeeNumber || c.empId || jf.empId || 'JOY-EMP-2026-001';
  const email = c.email || jf.email || '-';
  const specimenSig = c.specimenSignature || jf.specimenSignature || jf.uploadedDocuments?.docSpecimenSignature?.file_path || null;

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-4 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      {/* Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
        <div className="text-[11px] font-bold text-rose-700 tracking-wider">STATUTORY WORKPLACE SAFETY DECLARATION</div>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 mt-1">
          PREVENTION OF SEXUAL HARASSMENT (POSH) POLICY & CODE OF CONDUCT
        </h2>
        <p className="text-[9.5px] text-slate-600 font-medium leading-tight max-w-xl mx-auto">
          Under Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013
        </p>
      </div>

      {/* Policy Details */}
      <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg space-y-2 text-[11px] leading-relaxed">
        <strong className="block font-black text-rose-950 uppercase text-[10px]">Zero Tolerance Policy Framework:</strong>
        <p>
          <strong>{companyName}</strong> is committed to providing a safe, respectful, and inclusive working environment free from harassment, discrimination, or intimidation. Every employee is entitled to dignity in the workplace.
        </p>
        <p>
          <strong>Internal Complaints Committee (ICC):</strong> The Company has constituted an ICC with qualified presiding members. Complaints can be filed confidentially via <strong className="font-mono text-rose-900">icc-compliance@joycorporatesolutions.com</strong>.
        </p>
      </div>

      {/* Employee Undertaking */}
      <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-300 rounded-lg text-[10px] leading-relaxed">
        <strong className="block uppercase font-black text-slate-900 underline">EMPLOYEE ACKNOWLEDGMENT & PLEDGE</strong>
        <p>
          I, <strong>{name}</strong> (Designation: <strong>{designation}</strong>, Emp ID: <strong>{empId}</strong>), acknowledge that I have read and understood the POSH Policy and Code of Conduct of <strong>{companyName}</strong>. I pledge to adhere strictly to workplace behavioral guidelines and zero-tolerance standards.
        </p>
        
        <div className="flex items-end justify-between pt-3 text-[11px]">
          <div>
            <div>Date: <strong className="font-mono">{doj}</strong></div>
            <div>Place: <strong>Corporate Station</strong></div>
            <div className="text-[9px] text-slate-500 font-mono mt-0.5">Email: {email}</div>
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
    </div>
  );
};
