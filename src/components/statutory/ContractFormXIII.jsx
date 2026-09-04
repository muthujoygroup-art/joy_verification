import React from 'react';

export const ContractFormXIII = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'Candidate Name';
  const fatherName = c.fatherName || jf.fatherName || 'Father Name';
  const doj = c.doj || jf.doj || '2026-04-13';
  const designation = c.designation || jf.designation || 'Field Specialist / Operator';
  const empId = c.employeeNumber || c.empId || jf.empId || 'JOY-CONTR-2026-001';
  const mobile = c.mobile || jf.mobile || '9876543210';
  const wages = jf.monthlyCtc || '₹ 24,500 / Month';
  const address = jf.permanentAddress || 'Tamil Nadu, India';
  const specimenSig = c.specimenSignature || jf.specimenSignature || jf.uploadedDocuments?.docSpecimenSignature?.file_path || null;

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-4 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      {/* Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
        <div className="text-[11px] font-bold text-slate-700 tracking-wider">FORM XIII [See Rule 76]</div>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 mt-1">
          EMPLOYMENT CARD (CONTRACT LABOUR REGULATION ACT, 1970)
        </h2>
        <p className="text-[9.5px] text-slate-600 font-medium leading-tight max-w-xl mx-auto">
          Under Rule 76 of the Contract Labour (Regulation and Abolition) Central Rules, 1971
        </p>
      </div>

      {/* Card Table */}
      <div className="border border-slate-800 divide-y divide-slate-800 text-xs">
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">1.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Name of the Contractor</div>
          <div className="col-span-6 p-2 font-bold text-slate-900 bg-slate-50">{companyName}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">2.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Name of the Workman</div>
          <div className="col-span-6 p-2 font-mono font-black uppercase bg-slate-50">{name}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">3.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Father's / Husband's Name</div>
          <div className="col-span-6 p-2 font-mono uppercase bg-slate-50">{fatherName}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">4.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Token / Ticket ID & Mobile</div>
          <div className="col-span-6 p-2 font-mono bg-slate-50">{empId} • {mobile}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">5.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Designation / Nature of Work</div>
          <div className="col-span-6 p-2 font-bold bg-slate-50">{designation}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">6.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Wage Rate with Particulars of Unit</div>
          <div className="col-span-6 p-2 font-black text-emerald-900 bg-emerald-50/50">{wages}</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">7.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Tenure / Date of Employment</div>
          <div className="col-span-6 p-2 font-mono bg-slate-50">From {doj} (Active Deployment)</div>
        </div>
      </div>

      {/* Signature & Seal */}
      <div className="flex items-end justify-between pt-3 text-[11px] border-t border-slate-300">
        <div>
          <div>Date of Issue: <strong className="font-mono">{doj}</strong></div>
          <div className="text-[10px] text-slate-500">Contractor License No: CLRA/TN/2026/0498</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-900">{companyName}</div>
          <div className="text-[10px] text-slate-600 border-t border-slate-800 pt-0.5">Signature of Contractor / Authorized Rep</div>
        </div>
      </div>
    </div>
  );
};
