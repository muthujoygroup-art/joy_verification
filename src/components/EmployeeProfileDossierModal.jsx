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
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

export const EmployeeProfileDossierModal = ({ candidate, onClose }) => {
  const [activePage, setActivePage] = useState(1);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 my-auto text-slate-900 relative print:border-none print:shadow-none print:max-w-none">
        
        {/* Action Header Controls (Hidden on Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="badge badge-cyan text-[10px]">Employee Profile Dossier</span>
            <span className="text-xs text-slate-500 font-bold">• 4-Page Comprehensive Statutory Dossier</span>
          </div>

          {/* Page Tabs in Preview */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button 
              onClick={() => setActivePage(1)} 
              className={`px-3 py-1 rounded-lg transition-all ${activePage === 1 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Page 1: Bio & Role
            </button>
            <button 
              onClick={() => setActivePage(2)} 
              className={`px-3 py-1 rounded-lg transition-all ${activePage === 2 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Page 2: KYC & Address
            </button>
            <button 
              onClick={() => setActivePage(3)} 
              className={`px-3 py-1 rounded-lg transition-all ${activePage === 3 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Page 3: Edu & Experience
            </button>
            <button 
              onClick={() => setActivePage(4)} 
              className={`px-3 py-1 rounded-lg transition-all ${activePage === 4 ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Page 4: Bank & Nominee
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
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 ml-2 text-lg">✕</button>
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
                <p className="text-[10px] text-slate-400 font-medium">Powered by JOY CORPORATE SOLUTIONS • Statutory Form 11 / KYC Record</p>
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

          {/* PAGE 2 CONTENT: Contact & Government KYC Proofs */}
          {(activePage === 2 || window.matchMedia('print').matches) && (
            <div className="space-y-4 animate-fadeIn">
              {/* Section 3: Contact & Addresses */}
              <div className="space-y-2">
                <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>SECTION 3: RESIDENTIAL ADDRESSES & CONTACT DETAILS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Mobile & Email:</span>
                    <strong>{c.mobile} • {c.email || 'employee@joydata.com'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Emergency Contact Person & Phone:</span>
                    <strong>Suresh Kumar (Father) • +91 98111 22334</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Present Residential Address:</span>
                    <p className="font-medium text-slate-800">Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103 (Stay: 3 Yrs)</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Permanent Hometown Address:</span>
                    <p className="font-medium text-slate-800">House No 45, MG Road, Civil Lines, Jaipur, Rajasthan - 302001 (Own Ancestral Home)</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Government Identifiers */}
              <div className="space-y-2">
                <div className="bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SECTION 4: STATUTORY & GOVERNMENT IDENTIFIERS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div><span className="text-slate-400 block text-[11px]">Aadhaar UIDAI No:</span><strong className="font-mono text-emerald-700">{c.aadhaarNo || '5489 1234 9876'} ✓</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">PAN Card Number:</span><strong className="font-mono text-emerald-700">ABCDE1234F ✓</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Driving License (DL):</span><strong className="font-mono">KA-01201900124</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Passport Number:</span><strong className="font-mono">Z9812401 (Exp: 2032)</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Voter ID Number:</span><strong className="font-mono">WB/09/2014/9812</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">UAN / EPF Number:</span><strong className="font-mono">100982341209</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">ESIC Insurance No:</span><strong className="font-mono">310082910291</strong></div>
                  <div><span className="text-slate-400 block text-[11px]">Labor ID (LIN):</span><strong className="font-mono">1982039102</strong></div>
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

          {/* Navigation Controls between pages */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 print:hidden text-xs">
            <button
              onClick={() => setActivePage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="btn btn-secondary text-xs flex items-center gap-1 font-bold disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="font-bold text-slate-500">
              Page {activePage} of 4 (Dossier Preview)
            </span>

            <button
              onClick={() => setActivePage(prev => Math.min(4, prev + 1))}
              disabled={activePage === 4}
              className="btn btn-secondary text-xs flex items-center gap-1 font-bold disabled:opacity-40"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
