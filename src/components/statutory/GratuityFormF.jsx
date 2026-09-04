import React from 'react';

export const GratuityFormF = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'DHANA SRI';
  const fatherOrSpouse = c.spouseName || jf.spouseName || c.fatherName || jf.fatherName || 'SIVA KUMAR';
  const dob = c.dob || jf.dob || '2005-07-21';
  const gender = c.gender || jf.gender || 'Female';
  const maritalStatus = c.maritalStatus || jf.maritalStatus || 'Married';
  const address = jf.permanentAddress || 'Selva vinayagar store near, Kurumbapalayam, Coimbatore, Tamil Nadu - 641107';
  const nomineeName = jf.nomineeName || c.spouseName || 'Siva Kumar';
  const nomineeRel = jf.nomineeRelation || 'Husband';
  const doj = c.doj || jf.doj || '2026-04-13';
  const empId = c.employeeNumber || c.empId || jf.empId || 'JOY-EMP-2026-001';
  const dept = c.designation || jf.designation || 'Engineering';
  const specimenSig = c.specimenSignature || jf.specimenSignature || jf.uploadedDocuments?.docSpecimenSignature?.file_path || null;

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-4 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      {/* Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">FORM 'F' (NOMINATION FORM)</div>
        <div className="text-[10px] text-slate-500 italic">[See sub-rule (1) of Rule 6 of Payment of Gratuity (Central) Rules, 1972]</div>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 mt-1">
          NOMINATION UNDER THE PAYMENT OF GRATUITY ACT, 1972
        </h2>
        <p className="text-[9.5px] text-slate-600 font-medium leading-tight max-w-xl mx-auto">
          To: <strong>{companyName}</strong> (Establishment / Employer)
        </p>
      </div>

      <div className="space-y-2 text-xs leading-relaxed">
        <p>
          I, Shri / Shrimati / Kumari <strong>{name}</strong>, whose particulars are given in the statement below, hereby nominate the person(s) mentioned below to receive the gratuity payable after my death as also the gratuity standing to my credit in the event of my death before that amount has become payable, or having become payable has not been paid.
        </p>
      </div>

      {/* Nominee Table */}
      <div className="space-y-1">
        <div className="font-bold text-xs underline uppercase">Nominee Particulars</div>
        <table className="w-full border border-slate-800 text-[10px] text-left">
          <thead className="bg-slate-100 font-bold divide-x divide-slate-800 border-b border-slate-800">
            <tr>
              <th className="p-1.5">Name in Full with Address of Nominee(s)</th>
              <th className="p-1.5">Relationship with Employee</th>
              <th className="p-1.5">Age / DOB</th>
              <th className="p-1.5">Proportion of Gratuity (100%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr>
              <td className="p-1.5 font-bold uppercase">{nomineeName} ({address})</td>
              <td className="p-1.5">{nomineeRel}</td>
              <td className="p-1.5 font-mono">{dob}</td>
              <td className="p-1.5 font-mono font-black text-emerald-800">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Statement of Particulars */}
      <div className="space-y-1.5 border border-slate-800 p-3 bg-slate-50 rounded-lg text-xs leading-relaxed">
        <div className="font-bold text-slate-900 underline uppercase text-[11px]">Statement of Particulars:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div>1. Name of employee in full: <strong className="font-mono uppercase">{name}</strong></div>
          <div>2. Sex: <strong>{gender}</strong> | Marital Status: <strong>{maritalStatus}</strong></div>
          <div>3. Department / Section: <strong>{dept}</strong></div>
          <div>4. Employee Token / ID No: <strong className="font-mono">{empId}</strong></div>
          <div>5. Date of Appointment: <strong className="font-mono">{doj}</strong></div>
          <div>6. Permanent Address: <strong>{address}</strong></div>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex items-end justify-between pt-3 text-[11px] border-t border-slate-300">
        <div>
          <div>Date: <strong className="font-mono">{doj}</strong></div>
          <div>Place: <strong>Coimbatore / Bengaluru</strong></div>
        </div>
        <div className="text-right min-w-[140px]">
          {specimenSig ? (
            <img src={specimenSig} alt="Signature" className="h-8 max-w-[130px] object-contain ml-auto" />
          ) : (
            <div className="font-serif italic font-bold text-slate-900 text-xs">✍️ {name}</div>
          )}
          <div className="border-t border-slate-800 pt-0.5 text-[10px] text-slate-600">Signature / Thumb Impression of Employee</div>
        </div>
      </div>

      {/* Employer Certificate */}
      <div className="p-3 border-2 border-dashed border-slate-400 rounded-lg text-[10px] space-y-1 bg-slate-50/50">
        <strong className="block uppercase font-black text-slate-900 underline">CERTIFICATE BY THE EMPLOYER</strong>
        <p>
          Certified that the nomination has been recorded in the statutory register under Rule 6(2) of the Payment of Gratuity (Central) Rules, 1972 on <strong className="font-mono">{doj}</strong>.
        </p>
        <div className="flex items-center justify-between pt-2">
          <span>Official Gratuity Record No: <strong className="font-mono">GRAT-2026-{(name || 'EMP').replace(/\s+/g, '-').toUpperCase()}</strong></span>
          <span className="font-bold text-slate-800">{companyName} — Authorized HR Signatory</span>
        </div>
      </div>
    </div>
  );
};
