import React from 'react';

export const Form16TdsDeclaration = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'Candidate Name';
  const pan = c.panNo || jf.panNo || 'ABCDE1234F';
  const doj = c.doj || jf.doj || '2026-04-13';
  const designation = c.designation || jf.designation || 'Specialist';
  const empId = c.employeeNumber || c.empId || jf.empId || 'JOY-EMP-2026-001';
  const email = c.email || jf.email || '-';
  const mobile = c.mobile || jf.mobile || '9876543210';
  const prevOrg = jf.previousEmployer || 'Previous Organization Pvt Ltd';
  const regime = jf.taxRegime || 'New Tax Regime (u/s 115BAC - Default)';
  const specimenSig = c.specimenSignature || jf.specimenSignature || jf.uploadedDocuments?.docSpecimenSignature?.file_path || null;

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-4 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      {/* Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
        <div className="text-[11px] font-bold text-slate-700 tracking-wider">FORM NO. 12B / SECTION 192(2)</div>
        <div className="text-[10px] text-slate-500 italic">[See Rule 26A of Income-tax Rules, 1962]</div>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 mt-1">
          INCOME TAX SALARY & TDS STATUTORY DECLARATION (FORM 16 TDS ADVANCE)
        </h2>
        <p className="text-[9.5px] text-slate-600 font-medium leading-tight max-w-xl mx-auto">
          Form for furnishing details of income under section 192(2) for computation of tax deductible at source by the employer
        </p>
      </div>

      {/* Employee & Employer Details Grid */}
      <div className="border border-slate-800 divide-y divide-slate-800 text-xs">
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">1.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Name of the Employee</div>
          <div className="col-span-6 p-2 font-mono font-black uppercase text-slate-900 bg-slate-50">{name}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">2.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Permanent Account Number (PAN)</div>
          <div className="col-span-6 p-2 font-mono font-bold uppercase text-indigo-900 bg-slate-50">{pan}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">3.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Employee ID / Designation</div>
          <div className="col-span-6 p-2 font-bold bg-slate-50">{empId} • {designation}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">4.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Current Employer</div>
          <div className="col-span-6 p-2 font-bold text-slate-900 bg-slate-50">{companyName}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">5.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Date of Joining (DOJ)</div>
          <div className="col-span-6 p-2 font-mono font-bold bg-slate-50">{doj}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">6.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Income Tax Regime Election</div>
          <div className="col-span-6 p-2 font-black text-emerald-800 bg-emerald-50/50">{regime}</div>
        </div>
      </div>

      {/* Salary & Previous Employer Particulars */}
      <div className="space-y-1.5">
        <div className="font-black text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
          7. Particulars of Income from Previous Employer during Current Financial Year (2026-2027)
        </div>
        <table className="w-full border border-slate-800 text-[10px] text-left">
          <thead className="bg-slate-100 font-bold divide-x divide-slate-800 border-b border-slate-800">
            <tr>
              <th className="p-1.5">Previous Employer Name</th>
              <th className="p-1.5">Gross Salary Paid (₹)</th>
              <th className="p-1.5">PF Deducted (₹)</th>
              <th className="p-1.5">PT Deducted (₹)</th>
              <th className="p-1.5">TDS Deducted (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr>
              <td className="p-1.5 font-medium">{prevOrg}</td>
              <td className="p-1.5 font-mono">₹ {jf.previousGrossSalary || '0.00'}</td>
              <td className="p-1.5 font-mono">₹ {jf.previousPfDeducted || '0.00'}</td>
              <td className="p-1.5 font-mono">₹ {jf.previousPtDeducted || '0.00'}</td>
              <td className="p-1.5 font-mono">₹ {jf.previousTdsDeducted || '0.00'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Verification & Declaration */}
      <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-300 rounded-lg text-[10px] leading-relaxed">
        <strong className="block text-center uppercase tracking-wider font-black text-slate-900 underline">VERIFICATION & STATUTORY DECLARATION</strong>
        <p>
          I, <strong>{name}</strong>, do hereby declare that what is stated above is true to the best of my knowledge and belief. I authorize <strong>{companyName}</strong> to deduct tax at source (TDS) under Section 192 based on the regime and declarations furnished above.
        </p>
        
        <div className="flex items-end justify-between pt-3 text-[11px]">
          <div>
            <div>Date: <strong className="font-mono">{doj}</strong></div>
            <div>Place: <strong>Bengaluru / Corporate Station</strong></div>
            <div className="text-[9px] text-slate-500 font-mono mt-0.5">PAN: {pan}</div>
          </div>
          <div className="text-right min-w-[140px]">
            {specimenSig ? (
              <img src={specimenSig} alt="Signature" className="h-8 max-w-[130px] object-contain ml-auto" />
            ) : (
              <div className="font-serif italic font-bold text-indigo-950 text-xs">✍️ {name}</div>
            )}
            <div className="border-t border-slate-800 pt-0.5 text-[10px] text-slate-600">Signature of the Employee</div>
          </div>
        </div>
      </div>

      {/* Employer Endorsement */}
      <div className="p-3 border-2 border-dashed border-slate-400 rounded-lg text-[10px] space-y-1 bg-slate-50/50 flex items-center justify-between">
        <div>
          <span className="font-black text-slate-900 block">FOR EMPLOYER ACCOUNTS & PAYROLL USE:</span>
          <span className="text-slate-600">Verified & Recorded under TAN: BLRJ01234F | Payroll Cycle 2026-27</span>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-900">Authorized Payroll Officer</div>
          <div className="text-[9px] text-slate-500">{companyName}</div>
        </div>
      </div>
    </div>
  );
};
