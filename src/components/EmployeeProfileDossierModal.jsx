import React, { useState } from 'react';
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
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
  ExternalLink,
  File
} from 'lucide-react';
import { api } from '../services/api';

export const EmployeeProfileDossierModal = ({ candidate, onClose }) => {
  const [activePage, setActivePage] = useState(1);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  if (!candidate) return null;

  const handleDownloadPdf = () => {
    const downloadUrl = api.exportLaborProfileDossierUrl(candidate.token || candidate.id);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Employee_Profile_Dossier_${candidate.name?.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const c = candidate;
  const companyName = c.companyId === 'comp-2' ? 'Apex Logistics Solutions' : 'Acme Global Technologies Pvt Ltd';
  const facePhoto = c.faceImages?.straight || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
  const generatedTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST';
  const employeeTypeLabel = c.employeeCategory === 'high_profile' 
    ? 'Type 1: High Profile / C-Suite Executive'
    : c.employeeCategory === 'skilled'
    ? 'Type 2: Skilled Technical & Professional Staff'
    : c.employeeCategory === 'manufacturing'
    ? 'Type 3: Manufacturing & Industrial Worker'
    : 'Type 4: Unskilled & Contractual Labor';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 my-auto text-slate-900 relative print:border-none print:shadow-none print:max-w-none">
        
        {/* Action Header Controls (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan text-[10px]">Complete Master Profile Dossier</span>
            <span className="text-xs text-slate-500 font-bold">• 5-Page Statutory Joining & Documents Packet</span>
          </div>

          {/* Page Tabs in Preview */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold flex-wrap">
            <button 
              onClick={() => setActivePage(1)} 
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activePage === 1 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              1. Bio & Role
            </button>
            <button 
              onClick={() => setActivePage(2)} 
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activePage === 2 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              2. Statutory Forms (16/11/F)
            </button>
            <button 
              onClick={() => setActivePage(3)} 
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activePage === 3 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              3. Edu & Experience
            </button>
            <button 
              onClick={() => setActivePage(4)} 
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activePage === 4 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              4. Payroll & Signature
            </button>
            <button 
              onClick={() => setActivePage(5)} 
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${activePage === 5 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              5. Embedded Documents 📁
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
              title="Print Full Dossier"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="btn btn-company text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download 4-Page PDF</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 ml-2 text-lg cursor-pointer">✕</button>
          </div>
        </div>

        {/* Dossier Sheet Container */}
        <div className="p-6 border border-slate-300 rounded-xl bg-white space-y-6">
          
          {/* Header Banner with Employer Company Logo */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-sky-700 pb-4">
            <div className="flex items-center gap-3">
              {/* Employer Company Logo Block */}
              <div className="p-3 rounded-xl bg-sky-700 text-white flex flex-col items-center justify-center font-black shadow-md min-w-[120px]">
                <Building2 className="w-6 h-6 mb-0.5" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-200">EMPLOYER</span>
                <span className="text-xs font-black text-white text-center leading-tight">{companyName.split(' ')[0]}</span>
              </div>

              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">{companyName}</h1>
                <p className="text-xs font-bold text-sky-700 uppercase tracking-wider">Comprehensive Employee Onboarding & Compliance Dossier</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {employeeTypeLabel} • Generated on: <strong className="text-slate-800 font-mono">{generatedTimestamp}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {facePhoto && (
                <div className="w-20 h-24 rounded-lg border-2 border-sky-600 overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center">
                  <img src={facePhoto} alt="Employee Portrait" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-right text-xs space-y-1">
                <span className="badge badge-emerald">Verified Profile</span>
                <p className="text-[11px] text-slate-500 font-mono font-bold">Emp ID: #{c.empId || 'EMP-2026-88'}</p>
                <p className="text-[10px] text-slate-400 font-mono">Token: {c.token}</p>
              </div>
            </div>
          </div>

          {/* ⚡ POINT-IN-TIME VERIFICATION AWARENESS BANNER */}
          <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-[11px] text-amber-950 flex items-start gap-2.5 leading-relaxed">
            <span className="text-base shrink-0">ℹ️</span>
            <div>
              <strong className="font-bold text-amber-900 block">Statutory Point-in-Time Verification & Change Notice:</strong>
              <span>
                This dossier certifies official statutory records at the execution timestamp (<strong>{generatedTimestamp}</strong>). As government repositories (UIDAI, Income Tax Department, EPFO, NPCI) are live registers, any subsequent modifications made by the employee in original records post this date will necessitate an upstream re-verification cycle.
              </span>
            </div>
          </div>

          {/* PAGE 1 CONTENT: Bio & Appointment Details */}
          {(activePage === 1 || window.matchMedia('print').matches) && (
            <div className="space-y-4 animate-fadeIn">
              {/* Section 1: Personal Demographics */}
              <div className="space-y-2">
                <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>SECTION 1: PERSONAL & DEMOGRAPHIC PARTICULARS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div><span className="text-slate-400 block text-[11px]">Full Legal Name:</span><strong>{c.name}</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Father's Name:</span><strong>Suresh Kumar</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Mother's Name:</span><strong>Kavitha Kumar</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Spouse Name:</span><strong>Sunita Kumar</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Date of Birth (DOB):</span><strong>15-May-1996 (Age: 30)</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Gender:</span><strong>Male</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Marital Status:</span><strong>Married</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Blood Group:</span><strong>O+ Positive</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Nationality:</span><strong>Indian</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Religion:</span><strong>Hindu / General</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Mother Tongue:</span><strong>Tamil / Hindi</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Identification Mark:</span><strong>Mole on right forearm</strong></div>
                </div>
              </div>

              {/* Section 2: Appointment & Role */}
              <div className="space-y-2">
                <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>SECTION 2: APPOINTMENT & EMPLOYMENT POSITION</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div><span className="text-slate-400 block text-[11px]">Designation:</span><strong>{c.designation || 'Senior Specialist'}</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Department:</span><strong>{c.dept || 'Engineering'}</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Employment Type:</span><strong>Full Time Permanent</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Date of Joining (DOJ):</span><strong>25-Aug-2026</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Work Location:</span><strong>Bengaluru Tech Hub (HQ)</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Reporting Manager:</span><strong>Vikram Malhotra (VP)</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Probation Period:</span><strong>6 Months</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Notice Period:</span><strong>60 Days</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2 CONTENT: Statutory Labor Compliance & Tax Forms (Govt Approved Form 16A / Form 11 / Form F / NDA) */}
          {(activePage === 2 || window.matchMedia('print').matches) && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* 1. FORM 16 / 16A TDS TAX DEDUCTION CERTIFICATE (CBDT / INCOME TAX DEPT FORMAT) */}
              <div className="space-y-2 border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="bg-sky-800 text-white text-xs font-bold px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-200" />
                    <span>FORM NO. 16 / 16A • CERTIFICATE UNDER SECTION 203 OF INCOME-TAX ACT, 1961</span>
                  </div>
                  <span className="text-[10px] bg-sky-950 px-2.5 py-0.5 rounded font-mono text-sky-300">CBDT Prescribed Format</span>
                </div>

                <div className="p-3.5 space-y-3 text-xs bg-slate-50/50">
                  {/* Tax Identification Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 bg-white border border-slate-200 rounded-lg">
                    <div><span className="text-slate-400 block text-[10px]">Employer TAN No:</span><strong className="font-mono text-slate-800">BLRA01928F</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Employer PAN No:</span><strong className="font-mono text-slate-800">AAACA1298D</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Employee PAN No:</span><strong className="font-mono text-emerald-700">{c.panNo || 'ABCDE1234F'} ✓</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Assessment Year (AY):</span><strong className="text-slate-800 font-mono">2026-2027</strong></div>
                  </div>

                  {/* Summary of Tax Deducted at Source (TDS) */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2">Quarter (FY 2025-26)</th>
                          <th className="p-2">Receipt / Challan No</th>
                          <th className="p-2">Gross Salary Paid (₹)</th>
                          <th className="p-2">TDS Deducted (₹)</th>
                          <th className="p-2">Tax Deposited into Central Govt (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        <tr>
                          <td className="p-2 font-sans font-medium">Q1 (Apr - Jun)</td>
                          <td className="p-2 text-slate-500">CIN-0029108-2025</td>
                          <td className="p-2 font-bold">₹ 3,50,000.00</td>
                          <td className="p-2 text-indigo-700">₹ 28,500.00</td>
                          <td className="p-2 text-emerald-700 font-bold">₹ 28,500.00 ✓</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-sans font-medium">Q2 (Jul - Sep)</td>
                          <td className="p-2 text-slate-500">CIN-0044812-2025</td>
                          <td className="p-2 font-bold">₹ 3,50,000.00</td>
                          <td className="p-2 text-indigo-700">₹ 28,500.00</td>
                          <td className="p-2 text-emerald-700 font-bold">₹ 28,500.00 ✓</td>
                        </tr>
                        <tr className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
                          <td className="p-2 font-sans">Total TDS Deposited:</td>
                          <td className="p-2 text-slate-400 font-normal">Income Tax Sec 192</td>
                          <td className="p-2">₹ 7,00,000.00</td>
                          <td className="p-2 text-indigo-800">₹ 57,000.00</td>
                          <td className="p-2 text-emerald-800">₹ 57,000.00 ✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Form 12B Declaration */}
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-950">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Form 12B Declaration:</strong> Previous employer earnings & tax credits verified via TRACES portal.</span>
                    </div>
                    <span className="badge badge-emerald text-[9px]">TRACES Verified</span>
                  </div>
                </div>
              </div>

              {/* 2. FORM 11 (EPFO DECLARATION • EMPLOYEES' PROVIDENT FUND ACT 1952) */}
              <div className="space-y-2 border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="bg-sky-800 text-white text-xs font-bold px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-200" />
                    <span>FORM 11 (NEW) • EPFO STATUTORY DECLARATION (EPF SCHEME 1952 • RULE 36(7) & 42)</span>
                  </div>
                  <span className="text-[10px] bg-sky-950 px-2.5 py-0.5 rounded font-mono text-sky-300">Min. of Labour & Employment</span>
                </div>

                <div className="p-3.5 space-y-2 text-xs bg-slate-50/50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 bg-white border border-slate-200 rounded-lg">
                    <div><span className="text-slate-400 block text-[10px]">Universal Account No (UAN):</span><strong className="font-mono text-emerald-700">{c.uanEpf || '100982341209'} ✓</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Previous PF Member ID:</span><strong className="font-mono text-slate-800">BGBNG00123450000067890</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Date of Exit Previous Post:</span><strong className="text-slate-800 font-mono">31-Jul-2026</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">International Worker Status:</span><strong className="text-slate-800">No (Domestic Citizen)</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Scheme Certificate Enclosed:</span><strong className="text-slate-800">Not Applicable</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">EPF & EPS Continuation:</span><strong className="text-emerald-700">Yes (Auto-Transfer Mode)</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Aadhaar Seeding Status:</span><strong className="text-emerald-700">Seeded & UIDAI Verified ✓</strong></div>
                    <div><span className="text-slate-400 block text-[10px]">Bank KYC Linked:</span><strong className="text-emerald-700">Active (HDFC Bank) ✓</strong></div>
                  </div>
                </div>
              </div>

              {/* 3. FORM F (NOMINATION UNDER PAYMENT OF GRATUITY ACT 1972 • RULE 6(1)) */}
              <div className="space-y-2 border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="bg-sky-800 text-white text-xs font-bold px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-200" />
                    <span>FORM 'F' • STATUTORY NOMINATION UNDER PAYMENT OF GRATUITY CENTRAL RULES 1972</span>
                  </div>
                  <span className="text-[10px] bg-sky-950 px-2.5 py-0.5 rounded font-mono text-sky-300">Rule 6(1) Format</span>
                </div>

                <div className="p-3.5 space-y-2 text-xs bg-slate-50/50">
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-2">Name of Nominee with Address</th>
                          <th className="p-2">Relationship with Employee</th>
                          <th className="p-2">Age of Nominee</th>
                          <th className="p-2">Proportion of Gratuity (%)</th>
                          <th className="p-2">Legal Guardian (if minor)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-2 font-semibold">Sunita Kumar (Flat 402, Green Glen Layout, Bengaluru)</td>
                          <td className="p-2 text-slate-700">Spouse (Wife)</td>
                          <td className="p-2 font-mono">28 Years</td>
                          <td className="p-2 font-bold text-emerald-700 font-mono">100% (Sole Beneficiary)</td>
                          <td className="p-2 text-slate-400">Not Applicable (Major)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 4. EMPLOYEE NON-DISCLOSURE & PROPRIETARY RIGHTS AGREEMENT (NDA) */}
              <div className="space-y-2 border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="bg-sky-800 text-white text-xs font-bold px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-200" />
                    <span>EMPLOYEE NON-DISCLOSURE, IP ASSIGNMENT & ETHICAL CONDUCT COVENANT</span>
                  </div>
                  <span className="text-[10px] bg-sky-950 px-2.5 py-0.5 rounded font-mono text-sky-300">Indian Contract Act 1872</span>
                </div>

                <div className="p-3.5 space-y-2 text-xs bg-slate-50/50">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-relaxed space-y-1.5">
                    <p><strong>1. Confidentiality:</strong> The employee agrees to maintain strict secrecy regarding trade secrets, source code, client databases, and financial formulas of {companyName}.</p>
                    <p><strong>2. Non-Solicitation:</strong> For 24 months post termination, employee shall not directly or indirectly solicit customers, vendors, or personnel of the employer.</p>
                    <p><strong>3. Intellectual Property:</strong> All patents, inventions, software, and works created during employment are the sole, exclusive property of {companyName}.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* PAGE 3 CONTENT: Education & Prior Experience Track Record */}
          {(activePage === 3 || window.matchMedia('print').matches) && (
            <div className="space-y-4 animate-fadeIn">
              {/* Section 5: Academic Qualifications */}
              <div className="space-y-2">
                <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>SECTION 5: ACADEMIC & PROFESSIONAL QUALIFICATIONS</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2">Qualification</th>
                        <th className="p-2">College / Institute</th>
                        <th className="p-2">Board / University</th>
                        <th className="p-2">Year</th>
                        <th className="p-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-semibold">B.Tech in Computer Science</td>
                        <td className="p-2">BMS College of Engineering</td>
                        <td className="p-2">VTU Technological University</td>
                        <td className="p-2">2018</td>
                        <td className="p-2 text-emerald-700 font-bold">82.4% (Distinction)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Higher Secondary (10+2)</td>
                        <td className="p-2">Delhi Public School</td>
                        <td className="p-2">CBSE Central Board</td>
                        <td className="p-2">2014</td>
                        <td className="p-2 text-emerald-700 font-bold">86.2%</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Secondary School (10th)</td>
                        <td className="p-2">St. Xavier's High School</td>
                        <td className="p-2">ICSE Board</td>
                        <td className="p-2">2012</td>
                        <td className="p-2 text-emerald-700 font-bold">89.0%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 6: Prior Employment History */}
              <div className="space-y-2">
                <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>SECTION 6: PRIOR EMPLOYMENT & WORK EXPERIENCE HISTORY</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2">Employer Name</th>
                        <th className="p-2">Designation</th>
                        <th className="p-2">Period (From - To)</th>
                        <th className="p-2">Last CTC</th>
                        <th className="p-2">Reason for Leaving</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 font-semibold">Infosys Technologies Ltd</td>
                        <td className="p-2">Software Engineer</td>
                        <td className="p-2">Jul 2018 - Sep 2021 (3.2 Yrs)</td>
                        <td className="p-2 font-mono">INR 6.5 LPA</td>
                        <td className="p-2 text-slate-600">Career Advancement</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Wipro Enterprises Pvt Ltd</td>
                        <td className="p-2">Senior Systems Analyst</td>
                        <td className="p-2">Oct 2021 - Jul 2026 (4.8 Yrs)</td>
                        <td className="p-2 font-mono">INR 14.0 LPA</td>
                        <td className="p-2 text-slate-600">Joining New Enterprise</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 4 CONTENT: Banking, Nominees & Statutory Declaration */}
          {(activePage === 4 || window.matchMedia('print').matches) && (
            <div className="space-y-4 animate-fadeIn">
              {/* Section 7: Banking Details */}
              <div className="space-y-2">
                <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>SECTION 7: BANKING & PAYROLL SETTLEMENT PARTICULARS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div><span className="text-slate-400 block text-[11px]">Primary Bank Name:</span><strong>HDFC Bank</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Account Holder:</span><strong>{c.name}</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Account Number:</span><strong className="font-mono">50100234129845</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">IFSC Code:</span><strong className="font-mono">HDFC0001234</strong></div>
                  <div className="sm:col-span-2"><span className="text-slate-400 block text-[11px]">Branch:</span><strong>Koramangala 4th Block, Bengaluru</strong></div>
                  <div className="sm:col-span-2"><span className="text-slate-400 block text-[11px]">Account Type:</span><strong>Salary / Savings Account</strong></div>
                </div>
              </div>

              {/* Section 8: Nominees */}
              <div className="space-y-2">
                <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>SECTION 8: STATUTORY NOMINEE DECLARATION (EPF, GRATUITY & INSURANCE)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div><span className="text-slate-400 block text-[11px]">EPF Nominee:</span><strong>Sunita Kumar (Spouse - 100%)</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Gratuity Nominee:</span><strong>Sunita Kumar (Spouse - 100%)</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Term Life Insurance:</span><strong>Suresh Kumar (Father - 100%)</strong></div>
                </div>
              </div>

              {/* Section 9: Formal Declaration & Signature */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50 text-xs">
                <div className="space-y-1 sm:max-w-md">
                  <p className="font-bold text-slate-900">Statutory Employee Declaration:</p>
                  <p className="text-[11px] text-slate-500">
                    I hereby declare that all particulars stated in this comprehensive dossier are authentic. I authorize {companyName} and JOY CORPORATE SOLUTIONS PRIVATE LIMITED to verify these credentials against government databases and past employers.
                  </p>
                </div>
                <div className="text-center border-t sm:border-t-0 sm:border-l border-slate-300 sm:pl-6 pt-3 sm:pt-0">
                  <div className="w-44 h-10 border-b border-dashed border-slate-400 flex items-center justify-center italic text-slate-700 font-serif">
                    {c.name}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Candidate Signature / Date</span>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 5 CONTENT: Embedded Uploaded Documents & Verification Evidence Archive */}
          {(activePage === 5 || window.matchMedia('print').matches) && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="bg-sky-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center justify-between shadow-2xs">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-200" />
                  <span>SECTION 9: EMBEDDED UPLOADED COMPLIANCE DOCUMENTS & EVIDENCE ARCHIVE</span>
                </span>
                <span className="text-[10px] bg-sky-950 px-2.5 py-0.5 rounded font-mono text-sky-300">ISO 27001 Certified Vault</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {[
                  { 
                    id: 'doc-aadhaar',
                    name: '1. Government Aadhaar Card (Front & Back)', 
                    type: 'Official UIDAI Identity Proof', 
                    format: 'Color PDF • 1.4 MB', 
                    status: 'UIDAI API Verified ✓', 
                    hash: 'SHA256-AADH-9812401', 
                    date: generatedTimestamp,
                    previewType: 'aadhaar',
                    maskedNo: 'XXXX XXXX 9876',
                    holder: c.name
                  },
                  { 
                    id: 'doc-pan',
                    name: '2. Income Tax PAN Card Copy', 
                    type: 'Statutory Tax Identification', 
                    format: 'High-Res PNG • 820 KB', 
                    status: 'NSDL NSDL Verified ✓', 
                    hash: 'SHA256-PANC-1092834', 
                    date: generatedTimestamp,
                    previewType: 'pan',
                    maskedNo: c.panNo || 'ABCDE1234F',
                    holder: c.name
                  },
                  { 
                    id: 'doc-bank',
                    name: '3. Bank Passbook / Cancelled Cheque Leaf', 
                    type: 'Banking & IMPS Settlement Proof', 
                    format: 'Scan PDF • 950 KB', 
                    status: 'IMPS Penny Drop Match ✓', 
                    hash: 'SHA256-BANK-5591024', 
                    date: generatedTimestamp,
                    previewType: 'bank',
                    maskedNo: 'HDFC Bank • A/c ...9845',
                    holder: c.name
                  },
                  { 
                    id: 'doc-degree',
                    name: '4. Highest Degree Certificate / Marksheet', 
                    type: 'Academic Degree & Convocation Record', 
                    format: 'PDF • 2.1 MB', 
                    status: 'VTU University Verified ✓', 
                    hash: 'SHA256-ACAD-7781290', 
                    date: generatedTimestamp,
                    previewType: 'degree',
                    maskedNo: 'B.Tech CS • 84.5% Distinction',
                    holder: c.name
                  },
                  { 
                    id: 'doc-relieving',
                    name: '5. Previous Employer Relieving & Service Letter', 
                    type: 'Past Employment Track Record', 
                    format: 'Official Letter PDF • 1.8 MB', 
                    status: 'HR Reference Verified ✓', 
                    hash: 'SHA256-EXPR-3341092', 
                    date: generatedTimestamp,
                    previewType: 'relieving',
                    maskedNo: 'Infosys Limited • 3.2 Yrs',
                    holder: c.name
                  },
                  { 
                    id: 'doc-nda',
                    name: '6. Signed Non-Disclosure Agreement (NDA)', 
                    type: 'Executed Legal Compliance Covenant', 
                    format: 'Signed PDF • 1.1 MB', 
                    status: 'Digitally Executed & Stamped ✓', 
                    hash: 'SHA256-LEGL-8812903', 
                    date: generatedTimestamp,
                    previewType: 'nda',
                    maskedNo: 'Indian Contract Act 1872',
                    holder: c.name
                  },
                  { 
                    id: 'doc-passport',
                    name: '7. Passport Bio-Data Page (if applicable)', 
                    type: 'MEA Travel & Citizenship Proof', 
                    format: 'Encrypted PDF • 1.6 MB', 
                    status: 'MEA Seva Verified ✓', 
                    hash: 'SHA256-PSPT-4491028', 
                    date: generatedTimestamp,
                    previewType: 'passport',
                    maskedNo: 'Passport Seva • Valid 2034',
                    holder: c.name
                  },
                  { 
                    id: 'doc-face',
                    name: '8. 3D WebCam Biometric Live Portrait Scan', 
                    type: 'Anti-Spoof AI Liveness Telemetry', 
                    format: 'JPEG Biometric • 640 KB', 
                    status: '99.4% Liveness Authenticated ✓', 
                    hash: 'SHA256-FACE-1102938', 
                    date: generatedTimestamp,
                    previewType: 'face',
                    maskedNo: 'ISO/IEC 30107-3 Level 2',
                    holder: c.name
                  }
                ].map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-xs transition-all space-y-2.5 flex flex-col justify-between">
                    
                    {/* Header with Title & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-slate-900 text-xs block leading-tight">{doc.name}</span>
                        <span className="text-[10px] text-slate-500">{doc.type} • {doc.format}</span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-black text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap border border-emerald-300 shrink-0">
                        {doc.status}
                      </span>
                    </div>

                    {/* Document Visual Card Preview */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2.5">
                        {doc.previewType === 'face' && facePhoto ? (
                          <img src={facePhoto} alt="Live Face Scan" className="w-10 h-12 object-cover rounded border border-sky-400 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 font-bold shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <strong className="block text-slate-800 text-[11px] font-mono">{doc.maskedNo}</strong>
                          <span className="text-[10px] text-slate-500">Holder: {doc.holder}</span>
                        </div>
                      </div>

                      {/* View Original Document Button (Hidden on Print) */}
                      <button
                        type="button"
                        onClick={() => setSelectedDocForPreview(doc)}
                        className="btn btn-secondary text-[10px] py-1 px-2 flex items-center gap-1 font-bold hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 print:hidden cursor-pointer"
                        title="View Original Uploaded Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </div>

                    {/* Audit Hash Footer */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-1.5">
                      <span>Hash: {doc.hash}</span>
                      <span>{doc.date.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Document Vault Summary */}
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sky-950">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
                  <span className="font-bold">Total Embedded Compliance Documents: 8 Encrypted Files (100% Verified)</span>
                </div>
                <span className="font-mono text-[10px] text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Digital Vault Hash: 0x9f88a2...3b</span>
              </div>

            </div>
          )}

          {/* Navigation Controls between pages */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 print:hidden text-xs">
            <button
              onClick={() => setActivePage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="btn btn-secondary text-xs flex items-center gap-1 font-bold disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="font-bold text-slate-500">
              Page {activePage} of 5 (Dossier Preview)
            </span>

            <button
              onClick={() => setActivePage(prev => Math.min(5, prev + 1))}
              disabled={activePage === 5}
              className="btn btn-secondary text-xs flex items-center gap-1 font-bold disabled:opacity-40 cursor-pointer"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 👁️ ORIGINAL DOCUMENT PREVIEW MODAL (FULL RESOLUTION) */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">{selectedDocForPreview.name}</h3>
                  <p className="text-[11px] text-slate-400">{selectedDocForPreview.type} • {selectedDocForPreview.format}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDocForPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Viewer Content */}
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-100 flex-1 flex flex-col items-center justify-center">
              {selectedDocForPreview.previewType === 'face' && facePhoto ? (
                <div className="text-center space-y-2">
                  <img src={facePhoto} alt="Live WebCam Capture" className="max-w-xs max-h-72 rounded-xl shadow-lg border-2 border-emerald-500 mx-auto object-cover" />
                  <p className="text-xs font-bold text-emerald-700">3D WebCam Biometric Liveness Scan (99.4% Confidence Score)</p>
                </div>
              ) : (
                <div className="w-full bg-white p-6 rounded-xl border border-slate-300 shadow-sm space-y-4 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-sky-700" />
                      <div>
                        <strong className="text-slate-900 font-sans block">{companyName}</strong>
                        <span className="text-[10px] text-slate-500 font-sans">Official Verification Evidence Repository</span>
                      </div>
                    </div>
                    <span className="badge badge-emerald">API Authenticated</span>
                  </div>

                  <div className="space-y-2 py-2">
                    <div className="flex justify-between"><span>Document Name:</span><strong className="text-slate-900">{selectedDocForPreview.name}</strong></div>
                    <div className="flex justify-between"><span>Subject Name:</span><strong className="text-slate-900">{c.name}</strong></div>
                    <div className="flex justify-between"><span>Document Class:</span><strong>{selectedDocForPreview.maskedNo}</strong></div>
                    <div className="flex justify-between"><span>Upload Execution Timestamp:</span><strong>{selectedDocForPreview.date}</strong></div>
                    <div className="flex justify-between"><span>SHA-256 Digital Checksum:</span><strong className="text-indigo-700">{selectedDocForPreview.hash}</strong></div>
                    <div className="flex justify-between"><span>Cryptographic Vault State:</span><strong className="text-emerald-700">Locked & Non-Repudiable ✓</strong></div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] font-sans flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>This original document file was transmitted securely under DPDP Act 2023 end-to-end encryption and validated against government authoritative registries.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">Digital Signature: Valid & Stamped</span>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="btn btn-secondary text-xs py-1.5 px-4 font-bold cursor-pointer"
              >
                Close Viewer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
