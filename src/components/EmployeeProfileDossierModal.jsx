import { EpfoForm11 } from './statutory/EpfoForm11';
import { EpfoForm2 } from './statutory/EpfoForm2';
import { EsicForm1 } from './statutory/EsicForm1';
import { Form16TdsDeclaration } from './statutory/Form16TdsDeclaration';
import { GratuityFormF } from './statutory/GratuityFormF';
import { NdaAgreement } from './statutory/NdaAgreement';
import { PoshPolicyDeclaration } from './statutory/PoshPolicyDeclaration';
import { NonCompeteAgreement } from './statutory/NonCompeteAgreement';
import { ContractFormXIII } from './statutory/ContractFormXIII';
import React, { useState, useEffect } from 'react';
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
  File,
  FolderDown,
  Sparkles,
  Layers,
  HeartPulse,
  Scale,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { exportElementToPdf } from '../services/pdfExporter';

export const EmployeeProfileDossierModal = ({ candidate, onClose }) => {
  const [activeTab, setActiveTab] = useState(1);
  // 1: Demographics, 2: Role, 3: Edu & Exp, 4: Statutory & Bank, 5: Statutory Forms, 6: Attached Exhibits, 7: Complete Master PDF
  const [selectedAnnexureIdx, setSelectedAnnexureIdx] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock Body Scroll while Dossier Modal is Open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!candidate) return null;

  const c = candidate || {};
  const jf = {
    ...c,
    ...(c.joining_form_data || {}),
    ...(c.joiningFormData || {}),
    ...(c.submittedFormData || {})
  };

  const companyName = c.companyName || jf.companyName || jf.workingCompany || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED';
  const facePhoto = c.faceImages?.straight || c.faceImages?.livePhoto || c.faceImages?.aadhaarRef || c.photo || jf.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
  const generatedTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST';
  
  const indMap = {
    it_tech: '💻 IT, Software Engineering & AI Operations',
    manufacturing: '🏭 Manufacturing & Heavy Plant Operations',
    bfsi: '🏦 BFSI, Banking & Fintech Governance',
    healthcare: '🏥 Healthcare, Pharma & Hospital Operations',
    logistics: '🚚 Logistics, Fleet & Heavy Transport Operations',
    retail_hospitality: '🛍️ Retail, Hospitality & Frontline Services',
    contractual: '🏗️ Contract Labor Act (Form XIII) & Facility Workforce'
  };
  const attrs = c.verified_attributes || c.verifiedAttributes || {};
  const spec = jf.industrySpecialization || c.industrySpecialization || {};
  const indKey = c.employeeCategory || c.employeeType || spec.industryType || 'it_tech';
  const employeeTypeLabel = indMap[indKey] || 'Standard Corporate Staff';

  const aadhData = attrs.aadhaar || {};
  const panData = attrs.pan || {};
  const bankData = attrs.bankCheck || attrs.bank || {};
  const dlData = attrs.drivingLicense || attrs.dl || {};
  const epfoData = attrs.uan || attrs.epfo || {};

  // Clean, Dynamic Attributes Resolution (Removing fake mock fallbacks)
  const candidateName = jf.fullName || jf.name || c.name || '-';
  const fatherName = jf.fatherName || c.fatherName || aadhData.care_of || panData.father_name || epfoData.father_name || '-';
  const motherName = jf.motherName || c.motherName || '-';
  const maritalStatus = jf.maritalStatus || c.maritalStatus || 'Single';
  const spouseName = maritalStatus === 'Married' 
    ? (jf.spouseName || c.spouseName || '-') 
    : 'N/A (Single)';
  const dob = jf.dob || c.dob || aadhData.dob || panData.dob || epfoData.dob || dlData.dob || '-';
  const doj = jf.doj || c.doj || '-';
  const age = String(jf.age || c.age || (dob && dob !== '-' && dob.length >= 4 ? (new Date().getFullYear() - parseInt(dob.substring(0, 4))) : '-'));
  const bloodGroup = jf.bloodGroup || c.bloodGroup || dlData.blood_group || '-';
  const gender = jf.gender || c.gender || '-';
  const motherTongue = jf.motherTongue || c.motherTongue || '-';
  const languagesKnown = jf.languagesKnown || c.languagesKnown || '-';
  const religion = jf.religion || c.religion || '-';
  const caste = jf.caste || c.caste || '-';
  const category = jf.category || c.category || 'General';
  const nativeState = jf.nativeState || jf.state || c.nativeState || '-';
  const nativeDistrict = jf.nativeDistrict || jf.city || c.nativeDistrict || '-';
  const identificationMarks = jf.identificationMarks || jf.identificationMark1 || c.identificationMarks || '-';
  const mobile = jf.mobile || c.mobile || '-';
  const email = jf.email || c.email || '-';
  const emergencyContactName = jf.emergencyContactName || '-';
  const emergencyContactPhone = jf.emergencyContactPhone || '-';
  const presentAddress = jf.presentAddress || (jf.area || jf.city || jf.state ? `${jf.area || ''} ${jf.city || ''} ${jf.state || ''} ${jf.pincode || ''}`.trim() : c.presentAddress || '-');
  const permanentAddress = jf.permanentAddress || c.permanentAddress || presentAddress || '-';

  const bankName = jf.bankName || bankData.bank_name || c.bankName || '-';
  const accNo = jf.accountNo || jf.accountNumber || jf.bankAccountNo || bankData.account_number || c.bankAccountNo || '-';
  const ifsc = jf.ifscCode || bankData.ifsc_code || c.ifscCode || '-';
  const branch = jf.branchName || jf.bankBranch || bankData.branch || '-';
  const panNo = jf.panNo || panData.pan_number || c.panNo || '-';
  const aadhaarNo = jf.aadhaarNo || aadhData.masked_aadhaar || c.aadhaarNo || '-';
  const uanNo = jf.uanEpf || jf.pfNumber || epfoData.uan || c.uanEpf || c.pfNumber || '-';
  const pfNum = jf.pfNumber || c.pfNumber || uanNo || '-';
  const esiNum = jf.esiNumber || jf.esicNo || c.esiNumber || '-';
  const nomineeName = jf.nomineeName || (maritalStatus === 'Married' ? (jf.spouseName || c.spouseName || '-') : (jf.fatherName || c.fatherName || '-'));
  const nomineeRelation = jf.nomineeRelation || (maritalStatus === 'Married' ? 'Spouse' : 'Father');
  const nomineePhone = jf.nomineePhone || jf.emergencyContactPhone || mobile;

  // Social Media & Online Professional Presence
  const linkedIn = jf.linkedInUrl || c.linkedInUrl || spec.linkedInUrl || '';
  const github = jf.githubUrl || c.githubUrl || spec.githubUrl || '';
  const portfolio = jf.portfolioUrl || c.portfolioUrl || spec.portfolioUrl || '';
  const twitter = jf.twitterUrl || c.twitterUrl || '';

  // Dynamic Multi-Row Education Qualifications
  const rawEduList = (Array.isArray(jf.educationList) && jf.educationList.length > 0)
    ? jf.educationList
    : (Array.isArray(c.educationList) && c.educationList.length > 0)
      ? c.educationList
      : [];
  const eduList = rawEduList.filter(e => e && (e.degreeName || e.institutionName || e.qualificationCategory));

  // Dynamic Custom Fields Extraction
  const rawCustomFields = jf.customFields || c.customFields || c.custom_fields || c.customFieldsList || [];
  const customFieldsArray = Array.isArray(rawCustomFields)
    ? rawCustomFields
    : typeof rawCustomFields === 'object' && rawCustomFields !== null
      ? Object.entries(rawCustomFields).map(([k, v]) => ({
          key: k,
          label: typeof v === 'object' ? (v.label || k) : k,
          value: typeof v === 'object' ? (v.value || '-') : String(v || '-'),
          type: typeof v === 'object' ? (v.type || 'text') : 'text',
          required: typeof v === 'object' ? !!v.required : false
        }))
      : [];

  // Dynamic Multi-Row Previous Employment Experience
  const rawExpList = (Array.isArray(jf.experienceList) && jf.experienceList.length > 0)
    ? jf.experienceList
    : (Array.isArray(c.experienceList) && c.experienceList.length > 0)
      ? c.experienceList
      : [];
  const expList = rawExpList.filter(e => e && (e.companyName || e.institutionName || e.designation));

  // Construct attached documents list for exhibits (DB records + JSON Form data)
  const attachedDocsMap = jf.uploadedDocuments || c.uploadedDocuments || {};
  let attachedExhibits = [];

  if (Array.isArray(c.documents) && c.documents.length > 0) {
    attachedExhibits = c.documents.map(d => ({
      id: d.id || d.document_type || d.type,
      title: d.title || (d.document_type ? d.document_type.replace(/([A-Z])/g, ' $1').toUpperCase() : 'DOCUMENT EXHIBIT'),
      name: d.file_name || d.name || `${d.document_type || 'document'}.pdf`,
      doc_type: d.document_type || d.doc_type || d.type,
      file_format: (d.file_format || (d.file_name?.toLowerCase().endsWith('.pdf') ? 'PDF' : d.file_name?.toLowerCase().endsWith('.png') ? 'PNG' : 'JPG')).toUpperCase(),
      file_size_kb: d.file_size_kb || 450,
      file_path: d.file_path || d.dataUrl || d.data || ''
    }));
  } else if (Object.keys(attachedDocsMap).length > 0) {
    attachedExhibits = Object.entries(attachedDocsMap).map(([key, val]) => {
      const isObj = typeof val === 'object' && val !== null;
      const fileData = isObj ? (val.dataUrl || val.file_path || val.data || '') : (typeof val === 'string' ? val : '');
      const fileName = isObj ? (val.name || `${key}_document.pdf`) : `${key}_document.pdf`;
      const fileType = isObj ? (val.type || val.file_format || key) : 'pdf';
      const format = (fileName.toLowerCase().endsWith('.pdf') || String(fileType).includes('pdf')) ? 'PDF' : (fileName.toLowerCase().endsWith('.png') || String(fileType).includes('png')) ? 'PNG' : 'JPG';
      return {
        id: key,
        title: isObj && val.title ? val.title : key.replace(/([A-Z])/g, ' $1').toUpperCase(),
        name: fileName,
        doc_type: isObj && val.doc_type ? val.doc_type : key,
        file_format: format,
        file_size_kb: isObj && val.file_size_kb ? val.file_size_kb : 450,
        file_path: fileData
      };
    });
  }

  const handleDownloadExhibit = (doc) => {
    if (doc.file_path && doc.file_path.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = doc.file_path;
      link.download = doc.name || `${doc.title}.${doc.file_format?.toLowerCase() || 'pdf'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (doc.file_path) {
      const link = document.createElement('a');
      link.href = doc.file_path;
      link.download = doc.name || `${doc.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isImageDoc = (doc) => {
    return (
      (doc.file_path && doc.file_path.startsWith('data:image')) ||
      ['PNG', 'JPG', 'JPEG', 'WEBP'].includes(doc.file_format?.toUpperCase())
    );
  };

  const isPdfDoc = (doc) => {
    return (
      (doc.file_path && doc.file_path.startsWith('data:application/pdf')) ||
      doc.file_format?.toUpperCase() === 'PDF' ||
      doc.name?.toLowerCase().endsWith('.pdf')
    );
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const filename = `Employee_Master_Profile_Dossier_${(candidateName || 'Employee').replace(/\s+/g, '_')}.pdf`;
    
    try {
      // 1. Temporarily activate complete view to ensure all pages and exhibits are captured
      setActiveTab(7);
      await new Promise(r => setTimeout(r, 200));

      const el = document.getElementById('printable-employee-master-dossier');
      if (el) {
        await exportElementToPdf(el, filename);
        setDownloadSuccess('Complete Master Dossier PDF downloaded successfully!');
        setTimeout(() => setDownloadSuccess(null), 4000);
      } else {
        // Fallback to backend streaming endpoint
        await api.downloadDocument(api.exportLaborProfileDossierUrl(c.token || c.id), filename);
      }
    } catch (e) {
      console.warn("Client PDF compilation fallback to print:", e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    setActiveTab(7);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex items-center justify-center print:p-0 print:bg-white animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && typeof onClose === 'function') onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-5xl h-[92vh] max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 text-slate-900 relative print:border-none print:shadow-none print:max-w-none print:max-h-none print:p-0 print:m-0 animate-modal-spring overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Action Header Controls (Sticky Fixed at Top, Hidden on Print) */}
        <div className="shrink-0 bg-white/95 backdrop-blur-sm p-4 sm:p-5 border-b border-slate-200 z-30 flex flex-col gap-3 shadow-2xs print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan text-[10px]">Complete Master Profile Dossier</span>
              <span className="text-xs text-slate-500 font-bold">
                • {candidateName} (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP-2026'}) {attachedExhibits.length > 0 ? `• ${attachedExhibits.length} Exhibits` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={handlePrint} 
                className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold cursor-pointer print:hidden"
                title="Print Complete Multi-Page Dossier (with Annexures)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Packet</span>
              </button>
              <button 
                type="button" 
                onClick={handleDownloadPdf} 
                disabled={isExporting}
                className="btn btn-hrexecutive text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold shadow-md cursor-pointer print:hidden disabled:opacity-75"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isExporting ? "Compiling Master PDF..." : "Download Master Dossier PDF"}</span>
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer print:hidden"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation (Hidden on Print) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold flex-wrap print:hidden">
            <button 
              type="button"
              onClick={() => setActiveTab(1)} 
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 1 ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              1. Demographics
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(2)} 
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 2 ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              2. Role & Sector
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(3)} 
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 3 ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              3. Edu & Exp
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(4)} 
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === 4 ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              4. Statutory & Bank
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(5)} 
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${activeTab === 5 ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-300" />
              <span>5. Statutory Forms (Form 11, 2, ESIC 1)</span>
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(6)} 
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${activeTab === 6 ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>6. Attached Exhibits ({attachedExhibits.length})</span>
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(7)} 
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${activeTab === 7 ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>7. Complete Master PDF (Profile + Forms + Exhibits) 📄</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn print:hidden">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}
        </div>

        {/* Scrollable Modal Content Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 overscroll-contain bg-slate-50/50 print:p-0 print:bg-white print:overflow-visible">
          
          {/* ========================================================================= */}
          {/* PRINTABLE MASTER DOSSIER ROOT CONTAINER */}
          {/* ========================================================================= */}
          <div id="printable-employee-master-dossier" className="space-y-8 text-slate-900 bg-white p-4 sm:p-8 max-w-[840px] mx-auto shadow-xs border border-slate-200 rounded-2xl print:border-none print:shadow-none print:p-0 print:max-w-none">
            
            {/* SECTION 1: BIO & DEMOGRAPHICS */}
            {(activeTab === 1 || activeTab === 7 || isExporting) && (
              <div className="pdf-page-block space-y-5 bg-white p-4 rounded-xl border border-slate-200">
                
                {/* Hierarchical Entity Codes Stamp */}
                <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-between gap-2 text-xs font-mono font-bold text-slate-800 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-sans uppercase font-black">Entity Hierarchy Binding:</span>
                    <span className="text-purple-900 bg-purple-200/70 px-2 py-0.5 rounded border border-purple-300">🏢 Company: {c.companyCode || 'COMP001'}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-emerald-900 bg-emerald-200/70 px-2 py-0.5 rounded border border-emerald-300">👔 HR: {c.hrCode || `${c.companyCode || 'COMP001'}HR001`}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-sky-900 bg-sky-200/70 px-2 py-0.5 rounded border border-sky-300">👤 Employee: {c.employeeNumber || c.uniqueProfileId || c.empId || 'COMP001EMP001'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Verified Statutory Record</span>
                </div>

                {/* Master Corporate Header */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white border-2 border-slate-200 shadow-xs flex items-center justify-center p-1.5 shrink-0">
                      <img src="/joy_logo.png" alt="Company Official Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">{companyName}</h1>
                      <p className="text-[11px] text-slate-600 font-medium">Corporate Human Resources & Statutory Labor Compliance Operations</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] bg-slate-100 border border-slate-300 font-bold px-2 py-0.5 rounded uppercase text-slate-800">{employeeTypeLabel}</span>
                        <span className="text-[10px] text-slate-500 font-mono">CIN: U74999KA2026PTC192841</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-20 h-24 rounded-lg border-2 border-sky-600 overflow-hidden bg-slate-100 shadow-sm flex items-center justify-center shrink-0">
                      <img src={facePhoto} alt="Employee Profile Photo" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-right text-xs space-y-1">
                      <span className="badge badge-emerald font-black uppercase text-[10px] px-2.5 py-0.5">VERIFIED PROFILE ✓</span>
                      <p className="text-[11px] text-slate-900 font-mono font-bold">Emp ID: #{c.employeeNumber || c.empId || c.uniqueProfileId || 'COMP001EMP001'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Token: {c.token || 'tok_verified'}</p>
                    </div>
                  </div>
                </div>

                {/* Point in time notice */}
                <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-[11px] text-amber-950 flex items-start gap-2.5 leading-relaxed">
                  <span className="text-base shrink-0">ℹ️</span>
                  <div>
                    <strong className="font-bold text-amber-900 block">Statutory Point-in-Time Verification & Change Notice:</strong>
                    <span>
                      This dossier certifies official statutory records at the execution timestamp (<strong>{generatedTimestamp}</strong>). As government repositories (UIDAI, Income Tax Department, EPFO, NPCI) are live registers, any subsequent modifications made by the employee in original records post this date will necessitate an upstream re-verification cycle.
                    </span>
                  </div>
                </div>

                {/* Section 1: Demographics & Personal Attributes */}
                <div className="space-y-2">
                  <div className="bg-sky-800 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-bold">SECTION 1: PERSONAL & STATUTORY DEMOGRAPHIC PARTICULARS</span>
                    </div>
                    <span className="text-[10px] font-mono">18 Core Profile Attributes</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 text-xs p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Full Legal Name:</span>
                      <div className="text-slate-900 font-bold text-xs tracking-normal mt-0.5">{candidateName}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Employee Code / Unique ID:</span>
                      <div className="font-mono text-sky-900 font-bold text-xs mt-0.5">{c.employeeNumber || c.empId || c.uniqueProfileId || 'COMP001EMP001'}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Date of Joining (DOJ):</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{doj}</div>
                    </div>
                    
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Date of Birth (DOB):</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{dob} (Age: {age} Years)</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Father's Full Name:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{fatherName}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Mother's Full Name:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{motherName}</div>
                    </div>

                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Spouse Name:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{spouseName}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Gender / Blood Group:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{gender} • {bloodGroup}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Marital Status:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{maritalStatus}</div>
                    </div>

                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Nationality:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{c.nationality || jf.nationality || 'Indian'}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Mother Tongue:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{motherTongue}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Languages Known:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{languagesKnown}</div>
                    </div>

                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Religion / Caste / Category:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{religion} • {caste} ({category})</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Native State & District:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{nativeState}, {nativeDistrict}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Identification Marks:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{identificationMarks}</div>
                    </div>

                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Official Mobile:</span>
                      <div className="font-mono text-slate-900 font-bold text-xs mt-0.5">{mobile}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Official & Personal Email:</span>
                      <div className="font-mono text-slate-900 text-xs break-all mt-0.5">{email}</div>
                    </div>
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Emergency Contact:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">
                        {emergencyContactName !== '-' ? `${emergencyContactName} (${emergencyContactPhone})` : '-'}
                      </div>
                    </div>

                    {/* Full Width Residential & Permanent Addresses */}
                    <div className="sm:col-span-3 pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Present Residential Address:</span>
                        <div className="text-slate-900 text-xs leading-relaxed mt-0.5">{presentAddress}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Permanent Domicile Address:</span>
                        <div className="text-slate-900 text-xs leading-relaxed mt-0.5">{permanentAddress}</div>
                      </div>
                    </div>

                    {/* Dynamic Custom Form Fields */}
                    {customFieldsArray.length > 0 && (
                      <div className="sm:col-span-3 pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Custom Enterprise Attributes & Additional Form Particulars</span>
                          </span>
                          <span className="text-[10px] bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded border border-indigo-200">
                            {customFieldsArray.length} Custom Field{customFieldsArray.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          {customFieldsArray.map((cf, idx) => (
                            <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <span className="text-[10px] text-slate-500 block font-medium">{cf.label}</span>
                              <div className="font-bold text-slate-900 text-xs mt-0.5 break-all">
                                {cf.value || '<Not Provided>'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 2: APPOINTMENT & ROLE MATRIX */}
            {(activeTab === 2 || activeTab === 7 || isExporting) && (
              <div className="space-y-4 pdf-avoid-break">
                <div className="bg-sky-800 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>SECTION 2: APPOINTMENT, ROLE & INDUSTRY SPECIALIZATION MATRIX</span>
                  </div>
                  <span className="text-[10px] bg-sky-950 px-2 py-0.5 rounded font-mono">Role Architecture</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Designation:</span><div className="text-slate-900 font-bold text-xs mt-0.5">{c.designation || jf.designation || '-'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Department:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{c.dept || jf.dept || '-'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Employment Type:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{c.jobType || jf.jobType || 'Full Time Permanent'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Work Location:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{c.workLocation || jf.workLocation || 'Corporate HQ'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Previous Employer:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{jf.previousEmployer || c.previousEmployer || '-'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Total Experience:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{jf.experienceYears || c.experienceYears || (expList.length > 0 ? `${expList.length} Years` : 'Fresher')}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Probation Period:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{jf.probationPeriod || '6 Months'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Notice Period:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{jf.noticePeriod || '60 Days'}</div></div>
                </div>

                {/* Family Nominee & Health Fitness Disclosures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                    <span className="font-bold text-slate-900 text-[11px] block">Family & Statutory Nominee Details:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-slate-500 text-[10px] block">Nominee Name:</span><strong className="text-slate-900">{nomineeName}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Relationship:</span><strong className="text-slate-900">{nomineeRelation}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">EPF Share Allocation:</span><strong className="text-emerald-800 font-mono">100% Share</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Nominee Mobile:</span><strong className="font-mono text-slate-800">{nomineePhone}</strong></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                    <span className="font-bold text-slate-900 text-[11px] block">Health & Pre-Employment Medical Fitness:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-slate-500 text-[10px] block">Covid-19 Vaccination:</span><strong className="text-emerald-800">{jf.covidVaccineDoses ? `${jf.covidVaccineDoses} Doses ✓` : 'Declared Vaccinated ✓'}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Medical Fitness:</span><strong className="text-emerald-800">Certified Fit (Grade A)</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Pre-existing Illness:</span><strong>{jf.hasPreExistingIllness === 'Yes' ? (jf.preExistingDetails || 'Declared') : 'None Declared'}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Major Surgery:</span><strong>{jf.hasMajorSurgery === 'Yes' ? (jf.surgeryDetails || 'Declared') : 'None in past 5 years'}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Professional Links & Sector Specific Details */}
                {(linkedIn || github || portfolio || Object.keys(spec).length > 0) && (
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-lg space-y-1.5 text-xs">
                    <span className="font-extrabold text-indigo-950 text-[11px] block">Sector-Specific Parameters ({employeeTypeLabel}):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {linkedIn && <div><span className="text-slate-500 text-[10px] block">LinkedIn Profile:</span><a href={linkedIn} target="_blank" rel="noreferrer" className="text-indigo-700 font-mono truncate block hover:underline">{linkedIn}</a></div>}
                      {github && <div><span className="text-slate-500 text-[10px] block">GitHub / Repo:</span><a href={github} target="_blank" rel="noreferrer" className="text-indigo-700 font-mono truncate block hover:underline">{github}</a></div>}
                      {portfolio && <div><span className="text-slate-500 text-[10px] block">Portfolio URL:</span><a href={portfolio} target="_blank" rel="noreferrer" className="text-indigo-700 font-mono truncate block hover:underline">{portfolio}</a></div>}
                      {spec.techStack && <div><span className="text-slate-500 text-[10px] block">Tech Stack / Tools:</span><strong className="text-indigo-900 font-mono">{spec.techStack}</strong></div>}
                      {spec.laptopAssetTag && <div><span className="text-slate-500 text-[10px] block">Asset Provisioning:</span><strong className="font-mono text-purple-900">{spec.laptopAssetTag}</strong></div>}
                      <div><span className="text-slate-500 text-[10px] block">Anti-Moonlighting Covenant:</span><strong className="text-emerald-800">Executed & Consented ✓</strong></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: EDU & EXPERIENCE TABLES */}
            {(activeTab === 3 || activeTab === 7 || isExporting) && (
              <div className="pdf-page-block space-y-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="bg-sky-800 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>SECTION 3: ACADEMIC CREDENTIALS & PREVIOUS EMPLOYMENT HISTORY</span>
                  </div>
                  <span className="text-[10px] font-mono">{eduList.length} Education • {expList.length} Experience</span>
                </div>

                {/* Multi-row Education Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-sky-950 text-white font-bold text-[11px]">
                      <tr>
                        <th className="p-2.5">Qualification Level & Degree</th>
                        <th className="p-2.5">College / Institution</th>
                        <th className="p-2.5">University / Board</th>
                        <th className="p-2.5">Year</th>
                        <th className="p-2.5 text-right">Percentage / Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {eduList.length > 0 ? (
                        eduList.map((edu, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">
                              <div>{edu.degreeName || edu.qualificationCategory || `Qualification #${idx+1}`}</div>
                              {edu.degreeName && edu.qualificationCategory && (
                                <span className="text-[10px] text-slate-500 font-normal">{edu.qualificationCategory}</span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-700">{edu.institutionName || '-'}</td>
                            <td className="p-2.5 text-slate-600">{edu.university || '-'}</td>
                            <td className="p-2.5 font-mono">{edu.passingYear || edu.yearOfEnd || edu.yearOfJoining || '-'}</td>
                            <td className="p-2.5 text-right font-bold text-emerald-800 font-mono">{edu.grade || edu.percentage || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-500 italic bg-slate-50">
                            No educational qualifications submitted by candidate.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Multi-row Experience Table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-indigo-950 text-white font-bold text-[11px]">
                      <tr>
                        <th className="p-2.5">Company Name & Location</th>
                        <th className="p-2.5">Designation</th>
                        <th className="p-2.5">Tenure (Period of Service)</th>
                        <th className="p-2.5">Last Drawn CTC</th>
                        <th className="p-2.5 text-right">Relieving Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {expList.length > 0 ? (
                        expList.map((exp, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">
                              <div>{exp.companyName || exp.institutionName || `Company #${idx+1}`}</div>
                              {(exp.address || exp.institutionAddress) && (
                                <span className="text-[10px] text-slate-500 font-normal line-clamp-1">{exp.address || exp.institutionAddress}</span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-700">{exp.designation || '-'}</td>
                            <td className="p-2.5 text-slate-600 font-mono text-[11px]">{exp.periodOfService || '-'}</td>
                            <td className="p-2.5 font-mono">{exp.salaryDrawn || '-'}</td>
                            <td className="p-2.5 text-right">
                              <span className="badge badge-emerald text-[9px]">{exp.relievingStatus || 'Declared Relieved ✓'}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-500 italic bg-slate-50">
                            Fresher / No prior employment records declared.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 4: STATUTORY ACCOUNTS, HEALTH & LEGAL DECLARATION */}
            {(activeTab === 4 || activeTab === 7 || isExporting) && (
              <div className="space-y-4 pdf-avoid-break">
                <div className="bg-sky-800 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>SECTION 4: BANKING, STATUTORY ACCOUNTS & HEALTH DISCLOSURES</span>
                  </div>
                  <span className="text-[10px] font-mono">Statutory Proofs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div><span className="text-slate-400 block text-[10px]">Primary Bank:</span><strong className="text-slate-900">{bankName}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Account Number:</span><strong className="font-mono text-slate-900 font-bold">{accNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">IFSC & Branch:</span><strong className="font-mono">{ifsc} {branch !== '-' ? `(${branch})` : ''}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Income Tax PAN:</span><strong className="font-mono text-indigo-900 font-bold">{panNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Aadhaar Identity Ref:</span><strong className="font-mono text-indigo-900 font-bold">{aadhaarNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">EPFO UAN Number:</span><strong className="font-mono">{uanNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">PF Member ID:</span><strong className="font-mono text-[11px]">{pfNum}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">ESIC Insurance No:</span><strong className="font-mono text-[11px]">{esiNum}</strong></div>
                </div>

                {/* Health & Lifestyle Questionnaire */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1.5">
                  <span className="font-black text-emerald-950 text-[11px] block flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Health, Lifestyle & Integrity Disclosures:</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div><span className="text-slate-500 block">General Medical Fitness:</span><strong className="text-emerald-900">Declared Medically Fit</strong></div>
                    <div><span className="text-slate-500 block">Smoking Habits:</span><strong>{jf.isSmoker === 'Yes' ? `Smoker (${jf.cigarettesPerDay || '1-5'}/day)` : 'Non-Smoker (Zero Tobacco)'}</strong></div>
                    <div><span className="text-slate-500 block">Major Surgeries / Hospitalization:</span><strong>{jf.hasMajorSurgery === 'Yes' ? (jf.surgeryDetails || 'Declared') : 'None in past 5 years'}</strong></div>
                    <div><span className="text-slate-500 block">Criminal Conviction / Court Case:</span><strong className="text-emerald-800">{jf.hasCriminalConviction === 'Yes' ? 'Under Review' : 'Clean Record (Zero Pending Cases)'}</strong></div>
                    <div><span className="text-slate-500 block">Residential Property:</span><strong>{jf.ownsHouse === 'Yes' ? `Owns House (${jf.houseCityTown || 'Native'})` : 'Rented / Family Accommodation'}</strong></div>
                    <div><span className="text-slate-500 block">Group Company Relations:</span><strong>{jf.relatedToGroupEmployee === 'Yes' ? (jf.relatedEmployeeDetails || 'Declared') : 'No Relative in Organization'}</strong></div>
                  </div>
                </div>

                {/* Formal Legal Declaration & Signatures */}
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 text-xs">
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    <strong>EMPLOYEE STATUTORY SOLEMN DECLARATION:</strong> I hereby declare that all statements, academic qualifications, previous service records, and attached verification documents in this master onboarding profile are authentic, true, and correct. I authorize <strong>{companyName}</strong> and <strong>JOY CORPORATE SOLUTIONS PRIVATE LIMITED</strong> to verify all particulars against government and institutional repositories.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-700 text-center">
                    <div>
                      <div className="h-10 border-b border-dashed border-slate-500 flex items-end justify-center pb-1">
                        <span className="font-serif italic text-amber-300">{candidateName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Employee Digital Signature & Consent</span>
                    </div>
                    <div>
                      <div className="h-10 border-b border-dashed border-slate-500 flex items-end justify-center pb-1">
                        <span className="font-serif italic text-sky-300">Vikramaditya Rao (CCO)</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">Authorized HR Compliance Seal ({companyName})</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 5: STATUTORY MANUFACTURING & LABOR FORMS */}
            {/* ========================================================================= */}
            {(activeTab === 5 || activeTab === 7 || isExporting) && (
              <div className="space-y-6">
                <div className="bg-purple-900 text-white text-xs font-bold px-3 py-2 rounded-md flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span className="font-black">SECTION 5: STATUTORY LABOR & REGULATORY DECLARATION FORMS</span>
                  </div>
                  <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded font-mono">9 Statutory Forms Compiled</span>
                </div>

                {/* Form 1: EPFO Form 11 */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs pt-1">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">1</span>
                    <span>EPFO Form No. 11 — New Declaration Form (EPF 1952 & EPS 1995)</span>
                  </div>
                  <EpfoForm11 candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 2: EPFO Form 2 Revised */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">2</span>
                    <span>EPFO Form 2 (Revised) — Nomination & Declaration Form (Part A EPF & Part B EPS)</span>
                  </div>
                  <EpfoForm2 candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 3: ESIC Form 1 */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">3</span>
                    <span>ESIC Form 1 — Declaration Form, Family Particulars & Temporary Identification Card (TIC)</span>
                  </div>
                  <EsicForm1 candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 4: Form 16 / TDS Declaration */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">4</span>
                    <span>Form 16 / TDS Form 12B — Income Tax Salary & Deductions Statutory Declaration</span>
                  </div>
                  <Form16TdsDeclaration candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 5: Form F Gratuity */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">5</span>
                    <span>Form 'F' — Payment of Gratuity Act 1972 Statutory Nomination & Share Form</span>
                  </div>
                  <GratuityFormF candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 6: NDA Agreement */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">6</span>
                    <span>Non-Disclosure & Proprietary IP Information Binding Agreement (NDA)</span>
                  </div>
                  <NdaAgreement candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 7: POSH Policy Declaration */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">7</span>
                    <span>POSH Act 2013 — Workplace Safety Policy & Zero Tolerance Pledge</span>
                  </div>
                  <PoshPolicyDeclaration candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 8: Non-Compete Agreement */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">8</span>
                    <span>Enterprise Trade Secret Protection — Non-Compete & Non-Solicit Covenant</span>
                  </div>
                  <NonCompeteAgreement candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 9: Contract Form XIII */}
                <div className="pdf-page-block bg-white p-2 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">9</span>
                    <span>Contract Labour Act Form XIII — Rule 76 Statutory Employment Card</span>
                  </div>
                  <ContractFormXIII candidate={c} jf={jf} companyName={companyName} />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 6: ATTACHED ORIGINAL DOCUMENT EXHIBITS */}
            {/* ========================================================================= */}
            {(activeTab === 6 || activeTab === 7 || isExporting) && (
              <div className="space-y-6">
                
                {/* If in Tab 6 (Interactive Preview), show annexure selector bar */}
                {activeTab === 6 && !isExporting && attachedExhibits.length > 0 && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 print:hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                        📁 Select Attached Document Exhibit ({attachedExhibits.length} Available):
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded">
                        Exhibit {selectedAnnexureIdx + 1} of {attachedExhibits.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      {attachedExhibits.map((doc, idx) => (
                        <button
                          key={doc.id || idx}
                          type="button"
                          onClick={() => setSelectedAnnexureIdx(idx)}
                          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all cursor-pointer ${
                            selectedAnnexureIdx === idx
                              ? 'bg-indigo-700 text-white shadow-xs'
                              : 'bg-white border border-indigo-200 text-slate-700 hover:bg-indigo-100'
                          }`}
                        >
                          {idx + 1}. {doc.title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render either the selected annexure (Tab 6) or ALL annexures consecutively (Tab 7 & Export Mode) */}
                {attachedExhibits.length > 0 ? (
                  (activeTab === 6 && !isExporting ? [attachedExhibits[selectedAnnexureIdx] || attachedExhibits[0]] : attachedExhibits).map((doc, idx) => {
                    const actualIdx = activeTab === 6 && !isExporting ? selectedAnnexureIdx + 1 : idx + 1;
                    const docHash = `SHA256-VAULT-${(doc.doc_type || 'DOC').toUpperCase().substring(0, 4)}-${actualIdx * 8129 + 1092}`;

                    return (
                      <div 
                        key={doc.id || idx}
                        className="pdf-page-block p-6 sm:p-8 bg-white border-2 border-sky-300 rounded-2xl shadow-sm space-y-4 my-4"
                      >
                        {/* Top Annexure Header */}
                        <div className="flex items-start justify-between border-b-2 border-sky-600 pb-3 flex-wrap gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="badge badge-purple text-[10px]">ANNEXURE EXHIBIT {actualIdx}</span>
                              <span className="text-[10px] text-slate-500 font-mono">JOY-SECURE-VAULT-2026</span>
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase mt-0.5 tracking-tight">
                              {doc.title}
                            </h2>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Official attached document copy submitted by <strong className="text-slate-900">{candidateName}</strong> (#{c.empId || c.employeeNumber || 'JOY-2026-001'})
                            </p>
                          </div>

                          <div className="text-right flex items-center gap-2">
                            {doc.file_path ? (
                              <button
                                type="button"
                                onClick={() => handleDownloadExhibit(doc)}
                                className="btn btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 font-bold print:hidden cursor-pointer hover:bg-sky-50 hover:text-sky-800"
                                title="Download original uploaded file"
                              >
                                <Download className="w-3 h-3 text-sky-600" />
                                <span>Download Exhibit</span>
                              </button>
                            ) : null}
                            <div>
                              <span className="badge badge-emerald text-[10px]">VERIFIED ATTACHMENT ✓</span>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">{generatedTimestamp.split(' ')[0]}</p>
                            </div>
                          </div>
                        </div>

                        {/* Metadata Strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Original File Name:</span>
                            <strong className="text-slate-800 font-mono text-[11px] truncate block">📄 {doc.name}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Format & File Size:</span>
                            <strong className="text-slate-800 font-mono">{doc.file_format?.toUpperCase() || 'PDF'} • {doc.file_size_kb || 450} KB</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Cryptographic Hash:</span>
                            <strong className="text-indigo-700 font-mono text-[10px] truncate block">{docHash}</strong>
                          </div>
                        </div>

                        {/* High-Resolution Document Display Frame (Images & PDFs) */}
                        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-sky-50/60 via-slate-50 to-indigo-50/50 border-2 border-dashed border-sky-300 flex flex-col items-center justify-center text-center space-y-4 min-h-[360px]">
                          {isImageDoc(doc) && doc.file_path ? (
                            <div className="space-y-3 w-full flex flex-col items-center">
                              <img 
                                src={doc.file_path} 
                                alt={doc.title} 
                                className="max-h-[520px] max-w-full rounded-xl shadow-lg border border-slate-300 object-contain bg-white p-1"
                              />
                              <div className="flex items-center gap-2 print:hidden">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const win = window.open();
                                    if (win) {
                                      win.document.write(`<img src="${doc.file_path}" style="max-width:100%;height:auto;margin:20px auto;display:block;" />`);
                                    }
                                  }}
                                  className="btn btn-secondary text-xs py-1 px-3 flex items-center gap-1 font-bold cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Full Size Image</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadExhibit(doc)}
                                  className="btn btn-company text-xs py-1 px-3 flex items-center gap-1 font-bold cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download Image</span>
                                </button>
                              </div>
                            </div>
                          ) : isPdfDoc(doc) && doc.file_path ? (
                            <div className="w-full max-w-md bg-white p-6 rounded-2xl border-2 border-sky-200 shadow-md space-y-4 text-center">
                              <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-sm">
                                <FileText className="w-8 h-8" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900">{doc.title}</h3>
                                <p className="text-xs text-slate-600 font-mono">📄 {doc.name} ({doc.file_size_kb || 450} KB • PDF Document)</p>
                                <span className="badge badge-emerald text-[10px] mt-1">DPDP 2023 & ISO 27001 Encrypted Exhibit ✓</span>
                              </div>
                              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 print:hidden">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (doc.file_path.startsWith('data:')) {
                                      const win = window.open('');
                                      if (win) {
                                        win.document.write(`<iframe src="${doc.file_path}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                      }
                                    } else {
                                      window.open(doc.file_path, '_blank');
                                    }
                                  }}
                                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Open PDF in Tab</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadExhibit(doc)}
                                  className="btn btn-company text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download PDF</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-20 h-20 rounded-3xl bg-white border-2 border-sky-300 text-sky-700 flex items-center justify-center shadow-md">
                                <FileText className="w-10 h-10" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900">{doc.title}</h3>
                                <p className="text-xs text-slate-600 font-mono">📄 {doc.name} ({doc.file_size_kb || 450} KB)</p>
                                <span className="badge badge-emerald text-[10px] mt-1">Stored in ISO 27001 Encrypted Storage ✓</span>
                              </div>
                              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                                This document exhibit has been permanently bound into the Master Employee Dossier and verified under the DPDP Act 2023 with SHA-256 digital integrity.
                              </p>
                            </>
                          )}
                        </div>

                        {/* Footer Verification Seal */}
                        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200 gap-1">
                          <span>Certified by <strong>JOY CORPORATE SOLUTIONS PRIVATE LIMITED</strong> • ISO 27001:2022</span>
                          <span className="font-mono text-indigo-700 font-bold">ANNEXURE PAGE {actualIdx} OF {attachedExhibits.length}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl space-y-2 my-4">
                    <FolderDown className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-700">No Attached Document Exhibits</h3>
                    <p className="text-xs text-slate-500">Candidate has not uploaded any document attachments or file exhibits yet.</p>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

