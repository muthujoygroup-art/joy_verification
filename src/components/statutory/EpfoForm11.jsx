import React from 'react';

export const EpfoForm11 = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'Candidate Name';
  const fatherOrSpouse = c.spouseName || jf.spouseName || c.fatherName || jf.fatherName || '-';
  const isSpouse = !!(c.spouseName || jf.spouseName || c.maritalStatus === 'Married');
  const dob = c.dob || jf.dob || '-';
  const gender = c.gender || jf.gender || 'Female';
  const maritalStatus = c.maritalStatus || jf.maritalStatus || 'Married';
  const mobile = c.mobile || jf.mobile || '-';
  const email = c.email || jf.email || '-';
  const uan = c.uanEpf || jf.uanEpf || c.pfNumber || '-';
  const prevPf = jf.previousPfNumber || '-';
  const bankAcc = jf.accountNumber || jf.bankAccountNo || '-';
  const ifsc = jf.ifscCode || '-';
  const aadhaar = c.aadhaarNo || jf.aadhaarNo || '-';
  const pan = c.panNo || jf.panNo || 'ABCDE1234F';
  const doj = c.doj || jf.doj || '2026-04-13';
  const specimenSig = c.specimenSignature || jf.specimenSignature || jf.uploadedDocuments?.docSpecimenSignature?.file_path || null;

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-4 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      
      {/* Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
        <div className="text-[11px] font-bold text-slate-700 tracking-wider">New Form No.-11 Declaration Form</div>
        <div className="text-[10px] text-slate-500 italic">(To be retained by the employer for future reference)</div>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 mt-1">
          EMPLOYEES' PROVIDENT FUND ORGANISATION
        </h2>
        <p className="text-[9.5px] text-slate-600 font-medium leading-tight max-w-xl mx-auto">
          Employees' Provident Funds Scheme, 1952 (Paragraph 34 & 57) & Employees' Pension Scheme, 1995 (Paragraph 24)<br/>
          (Declaration by a person taking up employment in any establishment on which EPF Scheme, 1952 and/or EPS, 1995 is applicable)
        </p>
      </div>

      {/* 11 Main Form Rows */}
      <div className="border border-slate-800 divide-y divide-slate-800 text-xs">
        
        {/* Row 1 */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">1.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Name of the member</div>
          <div className="col-span-6 p-2 font-mono font-black uppercase text-slate-900 bg-slate-50">{name}</div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">2.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">
            Father's Name [ {isSpouse ? ' ' : '✓'} ] / Spouse's Name [ {isSpouse ? '✓' : ' '} ]
          </div>
          <div className="col-span-6 p-2 font-mono font-bold uppercase text-slate-900 bg-slate-50">{fatherOrSpouse}</div>
        </div>

        {/* Row 3 & 4 */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">3.</div>
          <div className="col-span-3 p-2 font-semibold border-r border-slate-800">Date of Birth (DD/MM/YYYY)</div>
          <div className="col-span-2 p-2 font-mono font-bold border-r border-slate-800 bg-slate-50">{dob}</div>
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">4.</div>
          <div className="col-span-2 p-2 font-semibold border-r border-slate-800">Gender</div>
          <div className="col-span-3 p-2 font-bold bg-slate-50">{gender}</div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">5.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">Marital Status</div>
          <div className="col-span-6 p-2 font-bold bg-slate-50">{maritalStatus}</div>
        </div>

        {/* Row 6 */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">6.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">
            (a) Email ID<br/>(b) Mobile No.
          </div>
          <div className="col-span-6 p-2 font-mono font-bold bg-slate-50">
            <div>{email}</div>
            <div className="mt-0.5">{mobile}</div>
          </div>
        </div>

        {/* Row 7 & 8 */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">7.</div>
          <div className="col-span-8 p-2 font-semibold border-r border-slate-800">Whether earlier a member of Employees' Provident Fund Scheme 1952</div>
          <div className="col-span-3 p-2 font-bold text-center bg-slate-50">YES ✓ / NO</div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">8.</div>
          <div className="col-span-8 p-2 font-semibold border-r border-slate-800">Whether earlier a member of Employees' Pension Scheme, 1995</div>
          <div className="col-span-3 p-2 font-bold text-center bg-slate-50">YES ✓ / NO</div>
        </div>

        {/* Row 9: Previous Employment */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">9.</div>
          <div className="col-span-11 p-2 space-y-1.5 bg-slate-50">
            <div className="font-bold underline">Previous employment details: (If Yes to 7 AND/OR 8 above)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div><span className="text-slate-500">a) Universal Account Number (UAN):</span> <strong className="font-mono">{uan}</strong></div>
              <div><span className="text-slate-500">b) Previous PF Account Number:</span> <strong className="font-mono">{prevPf}</strong></div>
              <div><span className="text-slate-500">c) Date of exit from previous employment:</span> <strong className="font-mono">31/03/2026</strong></div>
              <div><span className="text-slate-500">d) Scheme Certificate No. (if issued):</span> <strong className="font-mono">N/A</strong></div>
              <div><span className="text-slate-500">e) Pension Payment Order (PPO) No:</span> <strong className="font-mono">N/A</strong></div>
            </div>
          </div>
        </div>

        {/* Row 10: International Worker */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">10.</div>
          <div className="col-span-5 p-2 font-semibold border-r border-slate-800">a) International Worker:</div>
          <div className="col-span-6 p-2 bg-slate-50"><strong>NO</strong> (Indian Resident)</div>
        </div>

        {/* Row 11: KYC Details */}
        <div className="grid grid-cols-12">
          <div className="col-span-1 p-2 font-bold border-r border-slate-800 text-center">11.</div>
          <div className="col-span-11 p-2 space-y-1 bg-slate-50">
            <div className="font-bold underline">KYC Details: (attach self attested copies of following KYCS)</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
              <div><span className="text-slate-500">a) Bank Acc & IFSC:</span><br/><strong className="font-mono">{bankAcc} ({ifsc})</strong></div>
              <div><span className="text-slate-500">b) AADHAAR Number:</span><br/><strong className="font-mono">{aadhaar}</strong></div>
              <div><span className="text-slate-500">c) Permanent Account (PAN):</span><br/><strong className="font-mono">{pan}</strong></div>
            </div>
          </div>
        </div>

      </div>

      {/* Undertaking */}
      <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-300 rounded-lg text-[10px] leading-relaxed">
        <strong className="block text-center uppercase tracking-wider font-black text-slate-900 underline">UNDERTAKING</strong>
        <p>1. Certified that the particulars are true to the best of my knowledge.</p>
        <p>2. I authorize EPFO to use my Aadhaar for verification/authentication/eKYC purpose for service delivery.</p>
        <p>3. Kindly transfer the funds and service details, if applicable, from the previous PF account as declared above to the present P.F. Account.</p>
        <p>4. In case of changes in above details, the same will be intimated to employer at the earliest.</p>
        
        <div className="flex items-end justify-between pt-3 text-[11px]">
          <div>
            <div>Date: <strong className="font-mono">{doj}</strong></div>
            <div>Place: <strong>Coimbatore / Bengaluru</strong></div>
          </div>
          <div className="text-right min-w-[140px]">
            {specimenSig ? (
              <img src={specimenSig} alt="Member Signature" className="h-8 max-w-[130px] object-contain ml-auto" />
            ) : (
              <div className="font-serif italic font-bold text-sky-950 text-xs">✍️ {name}</div>
            )}
            <div className="border-t border-slate-800 pt-0.5 text-[10px] text-slate-600">Signature of Member</div>
          </div>
        </div>
      </div>

      {/* Declaration by Present Employer */}
      <div className="p-3 border-2 border-dashed border-slate-400 rounded-lg text-[10px] space-y-1.5 bg-slate-50/50">
        <strong className="block uppercase font-black text-slate-900 underline">DECLARATION BY PRESENT EMPLOYER</strong>
        <p>A. The member Mr./Ms./Mrs. <strong>{name}</strong> has joined on <strong className="font-mono">{doj}</strong> and has been allotted PF Number <strong className="font-mono">{c.employeeNumber || 'COMP001EMP001'}</strong>.</p>
        <p>B. In case the person was earlier not a member of EPF Scheme: The UAN allotted is <strong className="font-mono">{uan}</strong>.</p>
        <p>C. In case the person was earlier a member of EPF Scheme: The above PF Account number has been tagged with his/her UAN/Previous Member ID.</p>
        
        <div className="flex items-end justify-between pt-3 text-[11px]">
          <div>
            <div>Date: <strong className="font-mono">{doj}</strong></div>
            <div className="font-bold text-slate-800">{companyName}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-900">Joy Manpower Service / HR Authorized Signatory</div>
            <div className="text-[9px] text-slate-500">Signature of Employer with Seal of Establishment</div>
          </div>
        </div>
      </div>

    </div>
  );
};
