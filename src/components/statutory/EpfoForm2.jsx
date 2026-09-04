import React from 'react';

export const EpfoForm2 = ({ candidate, jf = {}, companyName = "JOY CORPORATE SOLUTIONS PRIVATE LIMITED" }) => {
  const c = candidate || {};
  const name = c.name || jf.fullName || 'Candidate Name';
  const fatherOrSpouse = c.spouseName || jf.spouseName || c.fatherName || jf.fatherName || '-';
  const dob = c.dob || jf.dob || '-';
  const uan = c.uanEpf || jf.uanEpf || c.pfNumber || '-';
  const gender = c.gender || jf.gender || 'Female';
  const maritalStatus = c.maritalStatus || jf.maritalStatus || 'Married';
  const address = jf.permanentAddress || '-';
  const nomineeName = jf.nomineeName || c.spouseName || '-';
  const nomineeRel = jf.nomineeRelation || 'Husband';
  const doj = c.doj || jf.doj || '2026-04-13';
  const specimenSig = c.specimenSignature || jf.specimenSignature || jf.uploadedDocuments?.docSpecimenSignature?.file_path || null;

  return (
    <div className="bg-white p-6 border-2 border-slate-800 rounded-xl text-slate-950 font-sans text-xs space-y-5 shadow-sm max-w-[840px] mx-auto pdf-avoid-break">
      
      {/* Header */}
      <div className="text-center space-y-1 border-b-2 border-slate-900 pb-3">
        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">(FORM 2 REVISED)</div>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900">
          NOMINATION AND DECLARATION FORM FOR UNEXEMPTED/EXEMPTED ESTABLISHMENTS
        </h2>
        <p className="text-[9.5px] text-slate-600 font-medium leading-tight max-w-xl mx-auto">
          Declaration and Nomination Form under the Employees Provident Funds and Employees Pension Schemes<br/>
          (Paragraph 33 and 61 (1) of the Employees Provident Fund Scheme 1952 and Paragraph 18 of the Employees Pension Scheme 1995)
        </p>
      </div>

      {/* Member Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs p-3 bg-slate-50 border border-slate-800 rounded-lg leading-relaxed">
        <div>1. Name (IN BLOCK LETTERS): <strong className="font-mono uppercase font-black">{name}</strong></div>
        <div>Father's / Husband's Name: <strong className="font-mono uppercase font-bold">{fatherOrSpouse}</strong></div>
        <div>2. Date of Birth: <strong className="font-mono">{dob}</strong></div>
        <div>3. Account No. / UAN: <strong className="font-mono text-sky-900">{uan}</strong></div>
        <div>4. Sex: <strong className="uppercase">{gender}</strong></div>
        <div>5. Marital Status: <strong className="uppercase">{maritalStatus}</strong></div>
        <div className="sm:col-span-2">6. Address Permanent / Temporary: <strong className="text-slate-800">{address}</strong></div>
      </div>

      {/* PART A - EPF NOMINATION TABLE */}
      <div className="space-y-1.5">
        <div className="text-center font-bold text-xs underline uppercase">PART - A (EPF)</div>
        <p className="text-[10px] text-slate-600 italic leading-tight">
          I hereby nominate the person(s)/cancel the nomination made by me previously and nominate the person(s) mentioned below to receive the amount standing to my credit in the Employees Provident Fund, in the event of my death.
        </p>
        
        <table className="w-full border border-slate-800 text-[10px] text-left">
          <thead className="bg-slate-100 font-bold divide-x divide-slate-800 border-b border-slate-800">
            <tr>
              <th className="p-1.5">Name of Nominee(s)</th>
              <th className="p-1.5">Address</th>
              <th className="p-1.5">Nominee's Relationship</th>
              <th className="p-1.5">Date of Birth</th>
              <th className="p-1.5">Total Share (%)</th>
              <th className="p-1.5">Guardian Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-white">
            <tr className="divide-x divide-slate-800">
              <td className="p-1.5 font-bold font-mono">{nomineeName}</td>
              <td className="p-1.5 text-slate-700">Kurumbapalayam, Cbe, TN</td>
              <td className="p-1.5 font-bold">{nomineeRel}</td>
              <td className="p-1.5 font-mono">15/05/2000</td>
              <td className="p-1.5 font-bold font-mono text-emerald-800">100%</td>
              <td className="p-1.5 text-slate-400">N/A (Major)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PART B - EPS PARA 18 FAMILY PARTICULARS */}
      <div className="space-y-1.5 pt-2">
        <div className="text-center font-bold text-xs underline uppercase">PART - (EPS) Para 18</div>
        <p className="text-[10px] text-slate-600 italic leading-tight">
          I hereby furnish below particulars of the members of my family who would be eligible to receive Widow/Children Pension in the event of my premature death in service.
        </p>

        <table className="w-full border border-slate-800 text-[10px] text-left">
          <thead className="bg-slate-100 font-bold divide-x divide-slate-800 border-b border-slate-800">
            <tr>
              <th className="p-1.5 w-12 text-center">Sr. No</th>
              <th className="p-1.5">Name & Address of Family Member</th>
              <th className="p-1.5 w-16 text-center">Age</th>
              <th className="p-1.5">Relationship with Member</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-white">
            <tr className="divide-x divide-slate-800">
              <td className="p-1.5 text-center font-mono">1</td>
              <td className="p-1.5 font-bold font-mono">{nomineeName} (Kurumbapalayam, Cbe, TN)</td>
              <td className="p-1.5 text-center font-mono">26</td>
              <td className="p-1.5 font-bold">{nomineeRel}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signatures & Employer Certificate */}
      <div className="border-t-2 border-slate-800 pt-3 space-y-3 text-[10px]">
        <div className="flex items-end justify-between">
          <div>Date: <strong className="font-mono">{doj}</strong></div>
          <div className="text-right min-w-[140px]">
            {specimenSig ? (
              <img src={specimenSig} alt="Subscriber Signature" className="h-8 max-w-[130px] object-contain ml-auto" />
            ) : (
              <div className="font-serif italic font-bold text-sky-950 text-xs">✍️ {name}</div>
            )}
            <div className="border-t border-slate-800 pt-0.5 text-[10px]">Signature/Thumb impression of subscriber</div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-400 rounded-lg space-y-1.5">
          <strong className="block text-center uppercase tracking-wider font-black underline">CERTIFICATE BY EMPLOYER</strong>
          <p className="text-[9.5px] leading-relaxed">
            Certified that the above declaration and nomination has been signed / thumb impressed before me by <strong>{name}</strong> employed in my establishment after he/she has read the entries / the entries have been read over to him/her by me and got confirmed by him/her.
          </p>
          <div className="flex items-end justify-between pt-2">
            <div>
              <div>Name & address of Factory / Establishment:</div>
              <strong className="text-slate-900">{companyName} (Joy Manpower Service)</strong>
              <div className="text-slate-500">Avinashi Main Road, Thekkampalayam, Coimbatore - 641407</div>
            </div>
            <div className="text-right">
              <div>Place: <strong>Coimbatore</strong></div>
              <div>Date: <strong className="font-mono">{doj}</strong></div>
              <div className="border-t border-slate-800 pt-0.5 font-bold mt-2">Signature of Authorized Employer</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
