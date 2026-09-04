import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { EpfoForm11 } from './statutory/EpfoForm11';
import { EpfoForm2 } from './statutory/EpfoForm2';
import { EsicForm1 } from './statutory/EsicForm1';
import { Form16TdsDeclaration } from './statutory/Form16TdsDeclaration';
import { GratuityFormF } from './statutory/GratuityFormF';
import { NdaAgreement } from './statutory/NdaAgreement';
import { PoshPolicyDeclaration } from './statutory/PoshPolicyDeclaration';
import { NonCompeteAgreement } from './statutory/NonCompeteAgreement';
import { ContractFormXIII } from './statutory/ContractFormXIII';

const FORM_TITLES = {
  form11: 'EPFO Form 11 (New Declaration Form)',
  form2: 'EPFO Form 2 Revised (Nomination & Family Particulars)',
  esicForm1: 'ESIC Form 1 (Declaration & Temporary ID Card)',
  form16: 'Form 16 / TDS Declaration (Form 12B)',
  formF: 'Form F (Payment of Gratuity Act 1972)',
  nda: 'Non-Disclosure Agreement (NDA)',
  posh: 'POSH Policy & Code of Conduct',
  nonCompete: 'Non-Compete & Non-Solicit Covenant',
  contractFormXIII: 'Contract Labor Act Form XIII (Employment Card)'
};

export const StatutoryFormPreviewModal = ({ 
  formKey, 
  formData = {}, 
  companyName = 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED', 
  onClose 
}) => {
  if (!formKey) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Lock body scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const candidateData = {
    name: formData.name || 'Candidate Name',
    email: formData.email || '',
    mobile: formData.mobile || '',
    dob: formData.dob || '',
    doj: formData.doj || new Date().toISOString().split('T')[0],
    gender: formData.gender || '',
    maritalStatus: formData.maritalStatus || '',
    aadhaarNo: formData.aadhaarNo || '',
    panNo: formData.panNo || '',
    uanEpf: formData.uanEpf || formData.pfNumber || '',
    esiNumber: formData.esiNumber || '',
    fatherName: formData.fatherName || '',
    spouseName: formData.spouseName || '',
    employeeNumber: formData.employeeNumber || formData.empId || '',
    designation: formData.designation || ''
  };

  const formTitle = FORM_TITLES[formKey] || 'Statutory Compliance Document';

  const modalContent = (
    <div 
      id="statutory-modal-overlay"
      className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target.id === 'statutory-modal-overlay') {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-indigo-500 overflow-hidden flex flex-col my-auto relative z-10 print:border-none print:shadow-none print:max-w-none"
        style={{
          maxHeight: '92vh',
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-600 text-white font-mono font-bold text-xs uppercase shadow-sm shrink-0">
              Live Preview
            </span>
            <span className="text-xs sm:text-sm text-slate-100 font-bold truncate">
              {formTitle}
            </span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1.5 px-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer hover:bg-slate-700 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div 
          className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1"
          style={{ overflowY: 'auto', flex: 1, padding: '20px' }}
        >
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs print:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <strong className="text-indigo-900 block font-bold">Real-Time Auto-Generated Statutory Form</strong>
                <span>Data populated for candidate: <strong className="text-slate-900 font-mono font-bold">{candidateData.name}</strong> ({candidateData.email}).</span>
              </div>
            </div>
            <span className="badge badge-emerald font-bold shrink-0 self-start sm:self-auto">Live Synced ✓</span>
          </div>

          {/* Form Component Render */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-2 sm:p-4 overflow-x-auto">
            {formKey === 'form11' && (
              <EpfoForm11 candidate={candidateData} jf={formData} companyName={companyName} />
            )}
            {formKey === 'form2' && (
              <EpfoForm2 candidate={candidateData} jf={formData} companyName={companyName} />
            )}
            {formKey === 'esicForm1' && (
              <EsicForm1 candidate={candidateData} jf={formData} companyName={companyName} />
            )}
            {formKey === 'form16' && (
              <Form16TdsDeclaration candidate={candidateData} jf={formData} companyName={companyName} />
            )}
            {formKey === 'formF' && (
              <GratuityFormF candidate={candidateData} jf={formData} companyName={companyName} />
            )}
            {formKey === 'nda' && (
              <NdaAgreement candidate={candidateData} jf={formData} companyName={companyName} />
            )}
            {formKey === 'posh' && (
              <PoshPolicyDeclaration candidate={candidateData} jf={formData} companyName={companyName} />
            )}
            {formKey === 'nonCompete' && (
              <NonCompeteAgreement candidate={candidateData} jf={formData} companyName={companyName} />
            )}
            {formKey === 'contractFormXIII' && (
              <ContractFormXIII candidate={candidateData} jf={formData} companyName={companyName} />
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs shrink-0 print:hidden">
          <span className="text-slate-500 font-mono text-[11px]">
            ISO 27001 & DPDP Act 2023 Certified Document
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer transition-all active:scale-95"
          >
            Close Preview
          </button>
        </div>

      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};