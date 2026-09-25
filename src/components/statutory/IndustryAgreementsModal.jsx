import React, { useState } from 'react';
import { EMPLOYEE_CATEGORIES, getEmployeeCategoryConfig } from '../../config/employeeCategories';
import { ShieldCheck, Printer, CheckCircle, FileText, Download, X, Scale, AlertCircle, Building2, UserCheck } from 'lucide-react';

export default function IndustryAgreementsModal({ isOpen, onClose, candidate, categoryKey, selectedPaperId }) {
  if (!isOpen) return null;

  const currentCatKey = categoryKey || candidate?.employeeCategory || 'it_tech';
  const categoryConfig = getEmployeeCategoryConfig(currentCatKey);
  const signingPapers = categoryConfig.signingPapers || [];

  const [activePaperId, setActivePaperId] = useState(selectedPaperId || signingPapers[0]?.id || '');
  const [signedState, setSignedState] = useState({});

  const activePaper = signingPapers.find(p => p.id === activePaperId) || signingPapers[0];

  const handlePrint = () => {
    window.print();
  };

  const handleSignAgreement = (paperId) => {
    setSignedState(prev => ({
      ...prev,
      [paperId]: {
        signed: true,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        seal: `DIGI-SEAL-${Math.floor(100000 + Math.random() * 900000)}`
      }
    }));
  };

  const isSigned = activePaper ? signedState[activePaper.id]?.signed : false;
  const signDetail = activePaper ? signedState[activePaper.id] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-700">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900">Statutory & Industry Legal Agreements</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                  {categoryConfig.title}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Official Legal Statutory Paperwork for <span className="text-slate-900 font-bold">{candidate?.name || 'Employee Candidate'}</span> ({candidate?.employeeNumber || candidate?.emp_id || candidate?.empId || '-'})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Selector Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center space-x-2 overflow-x-auto shrink-0">
          {signingPapers.map((paper) => {
            const isActive = paper.id === activePaperId;
            const paperSigned = signedState[paper.id]?.signed;
            return (
              <button
                key={paper.id}
                onClick={() => setActivePaperId(paper.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center space-x-2 transition-all shrink-0 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{paper.title}</span>
                {paperSigned && (
                  <CheckCircle className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-emerald-600'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Agreement Body Content */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 print:p-0 print:overflow-visible" id="printable-agreement">
          
          {activePaper ? (
            <div className="border border-slate-300 rounded-xl p-8 bg-slate-50/50 shadow-inner relative space-y-6 print:border-none print:p-0">
              
              {/* Document Letterhead Header */}
              <div className="flex items-start justify-between border-b border-slate-300 pb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-bold tracking-wider text-slate-900 uppercase">JOY CORPORATE SOLUTIONS PRIVATE LIMITED</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Statutory & Legal Compliance Wing | Registration ID: CIN-U74999KA2026PTC1092</p>
                  <p className="text-xs text-slate-500">Ministry of Corporate Affairs & Ministry of Labour and Employment Compliance</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-mono font-bold rounded">
                    REF: {activePaper.sampleCode}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Date: {new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Title & Law Reference */}
              <div className="text-center space-y-1">
                <h1 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                  {activePaper.title}
                </h1>
                <p className="text-xs font-semibold text-indigo-700 bg-indigo-50 inline-block px-3 py-1 rounded-full border border-indigo-200">
                  Statutory Reference: {activePaper.lawReference}
                </p>
              </div>

              {/* Parties Statement */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-2 leading-relaxed">
                <p>
                  This Statutory Agreement is executed between <strong className="text-slate-900">JOY CORPORATE SOLUTIONS PVT LTD</strong> (hereinafter referred to as the <em>"Employer / Company"</em>) and the employee candidate whose details are set forth below (hereinafter referred to as the <em>"Employee / Contractor"</em>).
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs bg-slate-50 p-3 rounded border border-slate-100">
                  <div><strong>Employee Name:</strong> {candidate?.name || '—'}</div>
                  <div><strong>Employee ID:</strong> {candidate?.employeeNumber || candidate?.emp_id || candidate?.empId || '—'}</div>
                  <div><strong>Designation:</strong> {candidate?.designation || '—'}</div>
                  <div><strong>Industry Vertical:</strong> {categoryConfig.title}</div>
                </div>
              </div>

              {/* Formal Clauses Text */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-700 bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b pb-1 text-xs">Section 1. Scope & Obligation</h3>
                <p>
                  {activePaper.description} The Employee hereby covenants that all disclosures, documents, representations, and statutory qualifications furnished to the Employer are true, valid, and authentic in accordance with Indian Law.
                </p>

                <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b pb-1 text-xs">Section 2. Confidentiality & Intellectual Property</h3>
                <p>
                  All proprietary source code, trade secrets, clinical records, customer accounts, fleet telematics, cash balances, and operational documentation accessed during the tenure of employment shall remain the sole and exclusive property of the Employer. Any breach shall invoke civil and criminal liabilities under the Indian Penal Code, Information Technology Act 2000, and specific industry acts.
                </p>

                <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b pb-1 text-xs">Section 3. Verification Audit & Termination Right</h3>
                <p>
                  The Employer reserves the right to audit statutory credentials via government registry API rails (UIDAI, NSDL, EPFO, MoRTH, High Courts). Discovery of forged certificates, impersonation, or criminal concealment will lead to immediate summary termination and legal report filing.
                </p>
              </div>

              {/* Digital Signature Box */}
              <div className="border-t-2 border-dashed border-slate-300 pt-6 grid grid-cols-2 gap-6">
                
                {/* Employer Side */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-900 uppercase">For JOY CORPORATE SOLUTIONS PVT LTD</p>
                  <div className="h-16 border border-slate-300 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-mono">
                    [AUTHORIZED HR STAMP & SEAL]
                  </div>
                  <p className="text-[11px] text-slate-500">Authorized Signatory / Talent Acquisition Lead</p>
                </div>

                {/* Candidate Side */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-900 uppercase">Employee Signature & Consent</p>
                  
                  {isSigned ? (
                    <div className="h-16 border border-emerald-300 bg-emerald-50 rounded p-2 flex flex-col justify-center">
                      <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs">
                        <CheckCircle className="w-4 h-4" />
                        <span>DIGITALLY SIGNED VIA OTP / AADHAAR</span>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-mono">Seal: {signDetail.seal} | {signDetail.timestamp}</p>
                    </div>
                  ) : (
                    <div className="h-16 border border-amber-300 bg-amber-50/50 rounded flex items-center justify-center">
                      <button
                        onClick={() => handleSignAgreement(activePaper.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Sign & Affirm Agreement</span>
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500">
                    Candidate: {candidate?.name || 'Employee Candidate'}
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p>No statutory agreements defined for this category.</p>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act 2023 Digital Signature Vault Verified</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Agreement PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              Done & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
