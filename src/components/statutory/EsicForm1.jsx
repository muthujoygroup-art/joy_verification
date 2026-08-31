import React from 'react';

export const EsicForm1 = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'DHANA SRI';
  const fatherOrHusband = c.spouseName || jf.spouseName || c.fatherName || jf.fatherName || 'SIVA KUMAR';
  const dob = c.dob || jf.dob || '2005-07-21';
  const gender = c.gender || jf.gender || 'Female';
  const maritalStatus = c.maritalStatus || jf.maritalStatus || 'Married';
  const mobile = c.mobile || jf.mobile || '9150547581';
  const presentAddr = jf.presentAddress || 'Selva vinayagar store near, Kurumbapalayam, Cbe, TN - 641107';
  const permAddr = jf.permanentAddress || 'Selva vinayagar store near, Kurumbapalayam, Cbe, TN - 641107';
  const nomineeName = jf.nomineeName || c.spouseName || 'Selva kumar';
  const nomineeRel = jf.nomineeRelation || 'Spouse';
  const bankAcc = jf.accountNumber || jf.bankAccountNo || '7139197771';
  const ifsc = jf.ifscCode || 'IDIB000R041';
  const branch = jf.branchName || 'Rajadhani';
  const insNo = c.esiNumber || jf.esiNumber || '5611450865';
  const doj = c.doj || jf.doj || '2026-04-13';

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-4 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
        <div className="text-center flex-1">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900">
            EMPLOYEES' STATE INSURANCE CORPORATION — FORM 1
          </h2>
          <div className="text-[10px] font-bold text-slate-600">DECLARATION FORM (Regulation 11 & 12)</div>
        </div>
        <div className="border-2 border-slate-800 p-1.5 text-center font-mono">
          <span className="text-[9px] block text-slate-500">Employer's Code No.</span>
          <strong className="text-xs font-black">3251</strong>
        </div>
      </div>

      {/* Part A & B Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-slate-800 divide-y sm:divide-y-0 sm:divide-x divide-slate-800 p-2 bg-slate-50 text-[11px]">
        
        {/* Section A: Insured Person */}
        <div className="space-y-1 pr-2">
          <strong className="block font-black text-slate-900 underline uppercase text-[10px]">(A) Insured Person's Particulars</strong>
          <div>1. Insurance No: <strong className="font-mono text-emerald-800 font-bold">{insNo}</strong></div>
          <div>2. Name (in block capital): <strong className="font-mono uppercase font-black">{name}</strong></div>
          <div>3. Father's / Husband's Name: <strong className="font-mono uppercase">{fatherOrHusband}</strong></div>
          <div>4. Date of Birth: <strong className="font-mono">{dob}</strong></div>
          <div>5. Marital Status: <strong className="uppercase font-bold">{maritalStatus}</strong> | 6. Sex: <strong className="uppercase">{gender}</strong></div>
          <div>7. Present Address: <strong className="text-slate-800">{presentAddr}</strong></div>
          <div>8. Permanent Address: <strong className="text-slate-800">{permAddr}</strong></div>
          <div>Phone: <strong className="font-mono">{mobile}</strong></div>
        </div>

        {/* Section B: Employer Particulars */}
        <div className="space-y-1 pl-2 pt-2 sm:pt-0">
          <strong className="block font-black text-slate-900 underline uppercase text-[10px]">(B) Employer's Particulars</strong>
          <div>10. Date of Appointment: <strong className="font-mono">{doj}</strong></div>
          <div>11. Name & Address of Employer: <strong className="block">{companyName} (Joy Manpower Service)</strong></div>
          <div>Department: <strong>Production</strong> | Nature: <strong>Helper / Operator</strong></div>
          <div className="pt-1 border-t border-slate-300">
            <span className="text-[10px] text-slate-500 block">Bank Account for Benefit Disbursals:</span>
            <div>Acc: <strong className="font-mono">{bankAcc}</strong> | IFSC: <strong className="font-mono">{ifsc}</strong></div>
            <div>Branch: <strong className="font-mono">{branch}</strong></div>
          </div>
        </div>

      </div>

      {/* Part C: Details of Nominee */}
      <div className="p-2.5 bg-slate-50 border border-slate-800 rounded-md text-[10px] space-y-1">
        <strong className="block font-black text-slate-900 underline uppercase">(C) Details of Nominee (u/s 71 of ESI Act / Rule 56)</strong>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>Name of Nominee: <strong className="font-mono font-bold">{nomineeName}</strong></div>
          <div>Relationship: <strong>{nomineeRel}</strong></div>
          <div>Address: <strong>Kurumbapalayam, Cbe, TN</strong></div>
        </div>
      </div>

      {/* Part D: Family Particulars Table */}
      <div className="space-y-1">
        <strong className="block font-black text-slate-900 uppercase text-[10px]">(D) FAMILY PARTICULARS OF INSURED PERSON</strong>
        <table className="w-full border border-slate-800 text-[10px] text-left">
          <thead className="bg-slate-100 font-bold divide-x divide-slate-800 border-b border-slate-800">
            <tr>
              <th className="p-1.5 w-10 text-center">Sl. No</th>
              <th className="p-1.5">Family Member Name</th>
              <th className="p-1.5 w-20 text-center">DOB / Age</th>
              <th className="p-1.5">Relationship</th>
              <th className="p-1.5 text-center">Residing Together?</th>
              <th className="p-1.5">Place of Residence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-white">
            <tr className="divide-x divide-slate-800">
              <td className="p-1.5 text-center font-mono">1</td>
              <td className="p-1.5 font-bold font-mono">{nomineeName}</td>
              <td className="p-1.5 text-center font-mono">26 Yrs</td>
              <td className="p-1.5 font-bold">{nomineeRel}</td>
              <td className="p-1.5 text-center font-bold text-emerald-800">YES ✓</td>
              <td className="p-1.5 text-slate-600">Coimbatore, TN</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Temporary Identification Card (TIC) Box */}
      <div className="p-3 border-2 border-slate-800 rounded-lg text-[10px] bg-slate-50 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-400 pb-1">
          <span className="font-black uppercase text-slate-900">ESI CORPORATION — TEMPORARY IDENTIFICATION CARD (TIC)</span>
          <span className="text-[9px] text-slate-500 font-mono">Valid for 3 months from date of appointment</span>
        </div>
        
        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-9 space-y-1">
            <div>Name: <strong className="font-mono uppercase font-bold">{name}</strong> | Ins No: <strong className="font-mono">{insNo}</strong></div>
            <div>Father's/Husband's: <strong className="font-mono">{fatherOrHusband}</strong> | DOB: <strong className="font-mono">{dob}</strong></div>
            <div>Dispensary: <strong>ESI Dispensary Coimbatore</strong></div>
            <div>Employer: <strong>{companyName} (Code: 3251)</strong></div>
          </div>
          <div className="col-span-3 border-2 border-dashed border-slate-400 h-20 rounded flex items-center justify-center text-center p-1 text-[8.5px] text-slate-400 font-bold">
            Affix Passport Photo Here
          </div>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-slate-300 text-[10px]">
          <div>
            <div>Date: <strong className="font-mono">{doj}</strong></div>
          </div>
          <div className="text-center">
            <div className="font-mono font-bold text-sky-900">✍️ {name}</div>
            <div className="border-t border-slate-800 pt-0.5">Signature / T.I. of IP</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-800">Joy Manpower Service</div>
            <div className="border-t border-slate-800 pt-0.5">Signature of Employer with Seal</div>
          </div>
        </div>
      </div>

    </div>
  );
};
