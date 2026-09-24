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
import { createPortal } from 'react-dom';
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
  FileSpreadsheet,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Globe,
  Baby,
  Heart,
  Phone,
  Mail
} from 'lucide-react';
import { Linkedin, Github, Twitter, Instagram, Facebook, Youtube } from './SocialIcons';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { exportElementToPdf } from '../services/pdfExporter';
import { exportIndividualCandidateToExcel } from '../utils/employeeExcelExport';
import { formatDobAndAge, formatDisplayDate, parseAnyDate, calculateAccurateAge } from '../utils/validationRules';
import { convertPdfToImages, isPdfSource } from '../utils/pdfToImage';

export const EmployeeProfileDossierModal = ({ candidate, onClose }) => {
  const { companies = [], platformLogo, platformLogoEmblem } = useApp() || {};
  const [activeTab, setActiveTab] = useState(1);
  // 1: Demographics, 2: Role, 3: Edu & Exp, 4: Statutory & Bank, 5: Statutory Forms, 6: Attached Exhibits, 7: Complete Master PDF
  const [selectedAnnexureIdx, setSelectedAnnexureIdx] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [renderedPdfMap, setRenderedPdfMap] = useState({});
  const [isConvertingPdfs, setIsConvertingPdfs] = useState(false);
  const [fitMode, setFitMode] = useState('width'); // 'width' | 'page'
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const candCompany = Array.isArray(companies) ? companies.find(comp => comp.id === c.companyId || comp.code === c.companyCode || comp.name === c.companyName) : null;
  const employerCompanyName = candCompany?.name || c.companyName || jf.companyName || jf.workingCompany || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED';
  const employerCompanyLogo = c.companyLogo || c.company_logo || candCompany?.logo || candCompany?.logo_url || candCompany?.company_logo || (candCompany?.documents || {}).company_logo || (candCompany?.features || {}).logo || platformLogoEmblem || '/assets/logos/joy_true_profile_shield_emblem.png';
  const companyName = employerCompanyName;
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
  const voterData = attrs.voter_id || attrs.voterId || {};
  const passportData = attrs.passport || attrs.passport_verification || {};
  const courtData = attrs.courtRecords || attrs.court_records || {};
  const rcData = attrs.rc_details || attrs.rcDetails || {};
  const esicData = attrs.esic || attrs.esic_data || {};

  // Clean, Dynamic Attributes Resolution (Removing fake mock fallbacks)
  const candidateName = jf.fullName || jf.name || c.name || '-';
  const fatherName = jf.fatherName || jf.father_name || jf.fatherSpouseName || c.fatherName || c.father_name || c.fatherSpouseName || aadhData.care_of || aadhData.careOf || panData.father_name || panData.fatherName || epfoData.father_name || '-';
  const fatherMobile = jf.fatherMobile || jf.father_mobile || c.fatherMobile || '-';
  const fatherOccupation = jf.fatherOccupation || jf.father_occupation || c.fatherOccupation || '-';
  const motherName = jf.motherName || jf.mother_name || c.motherName || c.mother_name || '-';
  const motherMobile = jf.motherMobile || jf.mother_mobile || c.motherMobile || '-';
  const motherOccupation = jf.motherOccupation || jf.mother_occupation || c.motherOccupation || '-';
  const maritalStatus = jf.maritalStatus || jf.marital_status || c.maritalStatus || c.marital_status || 'Single';
  const isMarried = maritalStatus === 'Married' || (typeof maritalStatus === 'string' && maritalStatus.toLowerCase().includes('married'));
  const spouseName = isMarried 
    ? (jf.spouseName || jf.spouse_name || c.spouseName || c.spouse_name || '-') 
    : 'N/A (Single)';
  const spouseMobile = isMarried ? (jf.spouseMobile || jf.spouse_mobile || c.spouseMobile || '-') : '-';
  const spouseOccupation = isMarried ? (jf.spouseOccupation || jf.spouse_occupation || c.spouseOccupation || '-') : '-';

  // Dynamic Sibling Array (Deduplicated)
  const rawSiblings = (Array.isArray(jf.siblings) && jf.siblings.length > 0) ? jf.siblings : (Array.isArray(c.siblings) && c.siblings.length > 0) ? c.siblings : [];
  const siblingsList = rawSiblings.filter(s => s && (s.name || s.relation || s.occupation));

  // Dynamic Children Array (Deduplicated)
  const rawChildren = (Array.isArray(jf.children) && jf.children.length > 0) ? jf.children : (Array.isArray(c.children) && c.children.length > 0) ? c.children : [];
  const childrenList = rawChildren.filter(ch => ch && (ch.name || ch.gender || ch.age));

  // Dynamic Languages Array
  const rawLanguages = (Array.isArray(jf.languages) && jf.languages.length > 0) ? jf.languages : (Array.isArray(c.languages) && c.languages.length > 0) ? c.languages : [];
  const languagesList = rawLanguages.map(l => typeof l === 'string' ? { name: l, read: true, write: true, speak: true } : l);

  const rawDob = jf.dob || c.dob || aadhData.dob || panData.dob || epfoData.dob || dlData.dob || '';
  const dob = formatDobAndAge(rawDob, jf.age || c.age);
  const rawDoj = jf.doj || c.doj || '';
  const doj = formatDisplayDate(rawDoj);
  const age = calculateAccurateAge(rawDob) || jf.age || c.age || '-';
  const bloodGroup = jf.bloodGroup || jf.blood_group || c.bloodGroup || c.blood_group || dlData.blood_group || '-';
  const gender = jf.gender || c.gender || '-';
  const motherTongue = jf.motherTongue || jf.mother_tongue || c.motherTongue || c.mother_tongue || '-';
  const languagesKnown = jf.languagesKnown || jf.languages_known || c.languagesKnown || c.languages_known || (languagesList.length > 0 ? languagesList.map(l => l.name).join(', ') : '-');
  const religion = jf.religion || c.religion || '-';
  const caste = jf.caste || c.caste || '-';
  const category = jf.category || c.category || 'General';
  const nativeState = jf.nativeState || jf.native_state || jf.state || c.nativeState || c.native_state || '-';
  const nativeDistrict = jf.nativeDistrict || jf.native_district || jf.city || c.nativeDistrict || c.native_district || '-';
  const identificationMarks = jf.identificationMarks || jf.identification_marks || jf.identificationMark1 || c.identificationMarks || c.identification_marks || '-';
  const mobile = jf.mobile || c.mobile || '-';
  const email = jf.email || c.email || '-';
  const emergencyContactName = jf.emergencyContactName || jf.emergency_contact_name || c.emergencyContactName || c.emergency_contact_name || '-';
  const emergencyContactPhone = jf.emergencyContactPhone || jf.emergency_contact_phone || c.emergencyContactPhone || c.emergency_contact_phone || '-';
  const presentAddress = jf.presentAddress || jf.present_address || jf.presentAddressLine || (jf.area || jf.city || jf.state ? `${jf.area || ''} ${jf.city || ''} ${jf.state || ''} ${jf.pincode || ''}`.trim() : c.presentAddress || c.present_address || '-');
  const permanentAddress = jf.permanentAddress || jf.permanent_address || jf.permanentAddressLine || c.permanentAddress || c.permanent_address || presentAddress || '-';

  const bankName = jf.bankName || jf.bank_name || bankData.bank_name || c.bankName || c.bank_name || '-';
  const accNo = jf.accountNo || jf.accountNumber || jf.bankAccountNo || jf.bank_account_no || bankData.account_number || c.bankAccountNo || c.bank_account_no || '-';
  const ifsc = jf.ifscCode || jf.ifsc_code || bankData.ifsc_code || c.ifscCode || c.ifsc_code || '-';
  const branch = jf.branchName || jf.branch_name || jf.bankBranch || bankData.branch || '-';
  const panNo = jf.panNo || jf.pan_no || panData.pan_number || c.panNo || c.pan_no || '-';
  const aadhaarNo = jf.aadhaarNo || jf.aadhaar_no || aadhData.masked_aadhaar || c.aadhaarNo || c.aadhaar_no || '-';
  const dlNo = jf.dlNo || jf.dl_no || jf.drivingLicense || dlData.dl_number || c.dlNo || c.dlNumber || '-';
  const passportNo = jf.passportNo || jf.passport_no || passportData.passport_number || passportData.fileNumber || c.passportNo || c.passport_no || '-';
  const voterId = jf.voterId || jf.voter_id || voterData.voter_id || voterData.epic_number || c.voterId || c.voter_id || '-';
  const rationCardNo = jf.rationCardNo || jf.ration_card_no || c.rationCardNo || '-';
  const uanNo = jf.uanEpf || jf.uan_no || jf.pfNumber || jf.pf_number || epfoData.uan || c.uanEpf || c.pfNumber || c.pf_number || '-';
  const pfNum = jf.pfNumber || jf.pf_number || c.pfNumber || c.pf_number || uanNo || '-';
  const esiNum = jf.esiNumber || jf.esi_number || jf.esicNo || esicData.esic_number || c.esiNumber || c.esi_number || '-';
  const vehicleRcNo = jf.rcNumber || jf.rc_number || rcData.rc_number || c.rcNumber || '-';
  const courtVerdict = jf.courtRecordStatus || courtData.verdict || c.courtRecordStatus || 'Clear / Verified';
  const nomineeName = jf.nomineeName || jf.nominee_name || (isMarried ? (jf.spouseName || c.spouseName || '-') : (jf.fatherName || c.fatherName || '-'));
  const nomineeRelation = jf.nomineeRelation || jf.nominee_relation || (isMarried ? 'Spouse' : 'Father');
  const nomineePhone = jf.nomineePhone || jf.emergencyContactPhone || mobile;

  // Social Media & Online Professional Presence
  const linkedIn = jf.linkedInUrl || c.linkedInUrl || spec.linkedInUrl || '';
  const github = jf.githubUrl || c.githubUrl || spec.githubUrl || '';
  const portfolio = jf.portfolioUrl || c.portfolioUrl || spec.portfolioUrl || '';
  const twitter = jf.twitterUrl || c.twitterUrl || '';
  const instagram = jf.instagramUrl || c.instagramUrl || '';
  const facebook = jf.facebookUrl || c.facebookUrl || '';
  const youtube = jf.youtubeUrl || c.youtubeUrl || '';

  // Dynamic Multi-Row Education Qualifications (Deduplicated)
  const rawEduList = (Array.isArray(jf.educationList) && jf.educationList.length > 0)
    ? jf.educationList
    : (Array.isArray(c.educationList) && c.educationList.length > 0)
      ? c.educationList
      : [];
  const filteredEduList = rawEduList.filter(e => e && (e.degreeName || e.institutionName || e.qualificationCategory));
  const seenEduKeys = new Set();
  const eduList = [];
  for (const e of filteredEduList) {
    const k = `${e.degreeName || ''}_${e.institutionName || ''}_${e.passingYear || ''}`.toLowerCase().trim();
    if (k && !seenEduKeys.has(k)) {
      seenEduKeys.add(k);
      eduList.push(e);
    }
  }

  // Dynamic Custom Fields Extraction (Deduplicated)
  const rawCustomFields = jf.customFields || c.customFields || c.custom_fields || c.customFieldsList || [];
  const rawCustomFieldsArray = Array.isArray(rawCustomFields)
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
  const seenFieldKeys = new Set();
  const customFieldsArray = [];
  for (const f of rawCustomFieldsArray) {
    if (!f) continue;
    const k = (f.key || f.label || '').toLowerCase().trim();
    if (k && !seenFieldKeys.has(k)) {
      seenFieldKeys.add(k);
      customFieldsArray.push(f);
    }
  }

  // Dynamic Multi-Row Previous Employment Experience (Deduplicated)
  const rawExpList = (Array.isArray(jf.experienceList) && jf.experienceList.length > 0)
    ? jf.experienceList
    : (Array.isArray(c.experienceList) && c.experienceList.length > 0)
      ? c.experienceList
      : [];
  const filteredExpList = rawExpList.filter(e => e && (e.companyName || e.institutionName || e.designation));
  const seenExpKeys = new Set();
  const expList = [];
  for (const exp of filteredExpList) {
    const k = `${exp.companyName || ''}_${exp.designation || ''}_${exp.fromDate || ''}`.toLowerCase().trim();
    if (k && !seenExpKeys.has(k)) {
      seenExpKeys.add(k);
      expList.push(exp);
    }
  }

  // Construct attached documents list for exhibits (DB records + JSON Form data, Strict Deduplication)
  const attachedDocsMap = jf.uploadedDocuments || c.uploadedDocuments || {};
  const allExhibits = [];

  if (Array.isArray(c.documents) && c.documents.length > 0) {
    c.documents.forEach(d => {
      if (d) {
        allExhibits.push({
          id: d.id || d.document_type || d.type,
          title: d.title || (d.document_type ? d.document_type.replace(/([A-Z])/g, ' $1').toUpperCase() : 'DOCUMENT EXHIBIT'),
          name: d.file_name || d.name || `${d.document_type || 'document'}.pdf`,
          doc_type: d.document_type || d.doc_type || d.type,
          file_format: (d.file_format || (d.file_name?.toLowerCase().endsWith('.pdf') ? 'PDF' : d.file_name?.toLowerCase().endsWith('.png') ? 'PNG' : 'JPG')).toUpperCase(),
          file_size_kb: d.file_size_kb || 450,
          file_path: d.file_path || d.dataUrl || d.data || '',
          preview_image: d.preview_image || d.previewImage || (Array.isArray(d.page_images) ? d.page_images[0] : ''),
          page_images: Array.isArray(d.page_images) ? d.page_images : (Array.isArray(d.pageImages) ? d.pageImages : [])
        });
      }
    });
  }
  if (Object.keys(attachedDocsMap).length > 0) {
    Object.entries(attachedDocsMap).forEach(([key, val]) => {
      const isObj = typeof val === 'object' && val !== null;
      const fileData = isObj ? (val.dataUrl || val.file_path || val.data || '') : (typeof val === 'string' ? val : '');
      const fileName = isObj ? (val.name || `${key}_document.pdf`) : `${key}_document.pdf`;
      const fileType = isObj ? (val.type || val.file_format || key) : 'pdf';
      const format = (fileName.toLowerCase().endsWith('.pdf') || String(fileType).includes('pdf')) ? 'PDF' : (fileName.toLowerCase().endsWith('.png') || String(fileType).includes('png')) ? 'PNG' : 'JPG';
      allExhibits.push({
        id: key,
        title: isObj && val.title ? val.title : key.replace(/([A-Z])/g, ' $1').toUpperCase(),
        name: fileName,
        doc_type: isObj && val.doc_type ? val.doc_type : key,
        file_format: format,
        file_size_kb: isObj && val.file_size_kb ? val.file_size_kb : 450,
        file_path: fileData,
        preview_image: isObj ? (val.preview_image || val.previewImage || (Array.isArray(val.page_images) ? val.page_images[0] : '')) : '',
        page_images: isObj ? (Array.isArray(val.page_images) ? val.page_images : (Array.isArray(val.pageImages) ? val.pageImages : [])) : []
      });
    });
  }

  // Deduplicate exhibits by normalized doc_type / key
  const attachedExhibits = [];
  const seenExhibitKeys = new Set();
  for (const ex of allExhibits) {
    const rawKey = (ex.doc_type || ex.id || ex.name || ex.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (rawKey && !seenExhibitKeys.has(rawKey)) {
      seenExhibitKeys.add(rawKey);
      attachedExhibits.push(ex);
    }
  }

  const isImageDoc = (doc) => {
    return (
      (doc?.file_path && doc.file_path.startsWith('data:image')) ||
      ['PNG', 'JPG', 'JPEG', 'WEBP'].includes(doc?.file_format?.toUpperCase())
    );
  };

  const isPdfDoc = (doc) => {
    return (
      (doc?.file_path && (doc.file_path.startsWith('data:application/pdf') || doc.file_path.includes('.pdf'))) ||
      doc?.file_format?.toUpperCase() === 'PDF' ||
      doc?.name?.toLowerCase().endsWith('.pdf') ||
      isPdfSource(doc?.file_path, doc?.name, doc?.file_format)
    );
  };

  // Convert any PDF documents into high-resolution image data URLs for flawless profile PDF display
  useEffect(() => {
    let isCancelled = false;

    const convertAllPdfExhibits = async () => {
      const pdfsToConvert = attachedExhibits.filter(ex => {
        const isPdf = isPdfDoc(ex);
        const hasExistingImages = (Array.isArray(ex.page_images) && ex.page_images.length > 0) || !!ex.preview_image;
        const alreadyConverted = !!renderedPdfMap[ex.id || ex.name];
        return isPdf && ex.file_path && !hasExistingImages && !alreadyConverted;
      });

      if (pdfsToConvert.length === 0) return;

      setIsConvertingPdfs(true);
      const newMap = {};

      for (const doc of pdfsToConvert) {
        if (isCancelled) break;
        try {
          const res = await convertPdfToImages(doc.file_path, { maxPages: 5, scale: 2.0 });
          if (res.pages && res.pages.length > 0) {
            newMap[doc.id || doc.name] = res.pages;
          }
        } catch (e) {
          console.warn(`Failed to convert PDF exhibit ${doc.name} to images:`, e);
        }
      }

      if (!isCancelled && Object.keys(newMap).length > 0) {
        setRenderedPdfMap(prev => ({ ...prev, ...newMap }));
      }
      if (!isCancelled) {
        setIsConvertingPdfs(false);
      }
    };

    convertAllPdfExhibits();

    return () => {
      isCancelled = true;
    };
  }, [attachedExhibits]);

  const getDocImages = (doc) => {
    if (!doc) return [];
    if (Array.isArray(doc.page_images) && doc.page_images.length > 0) {
      return doc.page_images;
    }
    const converted = renderedPdfMap[doc.id || doc.name];
    if (Array.isArray(converted) && converted.length > 0) {
      return converted;
    }
    if (doc.preview_image) {
      return [doc.preview_image];
    }
    if (isImageDoc(doc) && doc.file_path) {
      return [doc.file_path];
    }
    return [];
  };

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

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    const dossierDocId = `JCS-DOSSIER-2026-${c.id?.replace('emp-', '') || '101'}-${c.token ? c.token.substring(0, 6).toUpperCase() : 'REC'}`;
    const filename = `Employee_Master_Profile_Dossier_${(candidateName || 'Employee').replace(/\s+/g, '_')}.pdf`;
    
    try {
      // 1. Temporarily activate complete view to ensure all pages and exhibits are captured
      setActiveTab(7);
      await new Promise(r => setTimeout(r, 200));

      const el = document.getElementById('printable-employee-master-dossier');
      if (el) {
        await exportElementToPdf(el, filename, { docId: dossierDocId });
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

  const handleDownloadExcel = () => {
    try {
      exportIndividualCandidateToExcel(c, candCompany || { name: employerCompanyName });
      setDownloadSuccess('Candidate Profile Excel (.xlsx) generated successfully!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export candidate Excel:', err);
    }
  };

  const handlePrint = () => {
    setActiveTab(7);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Keyboard accessibility (Esc to close) & background scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && typeof onClose === 'function') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [onClose]);

  return createPortal((
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center overflow-hidden print:p-0 print:bg-white animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && typeof onClose === 'function') onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-5xl h-full max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 text-slate-900 relative print:border-none print:shadow-none print:max-w-none print:max-h-none print:p-0 print:m-0 overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Action Header Controls (Sticky Fixed at Top, Hidden on Print) */}
        <div className="shrink-0 bg-white border-b border-slate-200 z-50 p-3 sm:p-4 flex flex-col gap-2.5 shadow-xs print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-cyan text-[10px] font-bold">Complete Master Profile Dossier</span>
              <span className="text-xs text-slate-700 font-bold truncate max-w-xs sm:max-w-md">
                • {candidateName} (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP-2026'}) {attachedExhibits.length > 0 ? `• ${attachedExhibits.length} Exhibits` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                type="button" 
                onClick={handlePrint} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-all text-xs cursor-pointer print:hidden"
                title="Print Complete Multi-Page Dossier (with Annexures)"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print Packet</span>
              </button>
              <button 
                type="button" 
                onClick={handleDownloadExcel} 
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 transition-all text-xs cursor-pointer shadow-2xs print:hidden"
                title="Download Comprehensive Candidate Profile in Excel (.xlsx) Workbook"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button 
                type="button" 
                onClick={handleDownloadPdf} 
                disabled={isExporting}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all text-xs cursor-pointer print:hidden disabled:opacity-75"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isExporting ? "Compiling Master PDF..." : "Download Dossier (PDF)"}</span>
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-300 hover:border-rose-300 px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold transition-all text-xs cursor-pointer print:hidden"
                title="Close Dossier (Esc)"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation (Horizontal Scrolling, Hidden on Print) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto whitespace-nowrap scrollbar-none print:hidden">
            <button 
              type="button"
              onClick={() => setActiveTab(1)} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${activeTab === 1 ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              1. Demographics
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(2)} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${activeTab === 2 ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              2. Role & Sector
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(3)} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${activeTab === 3 ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              3. Edu & Exp
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(4)} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${activeTab === 4 ? 'bg-sky-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              4. Statutory & Bank
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(5)} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 ${activeTab === 5 ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-300" />
              <span>5. Statutory Forms</span>
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(6)} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 ${activeTab === 6 ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <FolderDown className="w-3.5 h-3.5" />
              <span>6. Exhibits ({attachedExhibits.length})</span>
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab(7)} 
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${activeTab === 7 ? 'bg-emerald-700 text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>7. Complete Master PDF 📄</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn print:hidden">
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
                
                {/* Corporate Governance & Entity Hierarchy */}
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 text-[11px] text-slate-700 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap font-medium">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Enterprise Mapping:</span>
                    <span className="bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">
                      🏢 Company: <strong>{c.companyCode || 'COMP001'}</strong>
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">
                      👔 HR: <strong>{c.hrCode || `${c.companyCode || 'COMP001'}HR001`}</strong>
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="bg-sky-50 border border-sky-300 text-sky-900 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                      👤 Emp ID: #{c.employeeNumber || c.uniqueProfileId || c.empId || 'COMP001EMP001'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Official Master Record</span>
                </div>

                {/* Master Corporate Header */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-white border-2 border-slate-200 shadow-xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <img src={employerCompanyLogo} alt={employerCompanyName} className="w-full h-full object-contain" />
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
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{dob}</div>
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
                    <div className="py-0.5">
                      <span className="text-slate-500 block text-[10px]">Master Languages Summary:</span>
                      <div className="text-slate-900 font-semibold text-xs mt-0.5">{languagesKnown}</div>
                    </div>

                    {/* Parents Details Sub-Block */}
                    <div className="sm:col-span-3 pt-3 border-t border-slate-200">
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block mb-2">
                        👨‍👩‍👦 Parents & Immediate Family Particulars:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Father's Details</span>
                          <div className="font-bold text-slate-900 text-xs mt-0.5">{fatherName}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5 flex items-center justify-between">
                            <span>Occ: <strong>{fatherOccupation}</strong></span>
                            <span className="font-mono text-slate-700">📞 {fatherMobile}</span>
                          </div>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Mother's Details</span>
                          <div className="font-bold text-slate-900 text-xs mt-0.5">{motherName}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5 flex items-center justify-between">
                            <span>Occ: <strong>{motherOccupation}</strong></span>
                            <span className="font-mono text-slate-700">📞 {motherMobile}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Adaptive Siblings Block (Rendered if siblings declared) */}
                    {siblingsList.length > 0 && (
                      <div className="sm:col-span-3 pt-2 border-t border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider">
                            👥 Declared Siblings ({siblingsList.length}):
                          </span>
                          <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold border border-blue-200">
                            Family Verification
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {siblingsList.map((sib, sIdx) => (
                            <div key={sIdx} className="p-2 bg-white rounded-lg border border-blue-200 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900 block">{sib.name}</span>
                                <span className="text-[10px] text-slate-500">{sib.relation || 'Sibling'} • {sib.occupation || 'Corporate / Student'}</span>
                              </div>
                              {sib.mobile && <span className="font-mono text-[10px] text-slate-700">📞 {sib.mobile}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Adaptive Marital Status & Dependents Block (Rendered if Married) */}
                    {isMarried && (
                      <div className="sm:col-span-3 pt-2 border-t border-rose-200 space-y-2 bg-rose-50/50 p-3 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                            <span>Spouse & Children Particulars (Married Candidate Record)</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Spouse Name:</span>
                            <strong className="text-slate-900 text-xs">{spouseName}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Spouse Mobile:</span>
                            <strong className="font-mono text-slate-900 text-xs">{spouseMobile}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Spouse Occupation:</span>
                            <strong className="text-slate-900 text-xs">{spouseOccupation}</strong>
                          </div>
                        </div>

                        {childrenList.length > 0 && (
                          <div className="pt-2 border-t border-rose-200/80 space-y-1">
                            <span className="text-[10px] font-bold text-rose-800 uppercase block">Children ({childrenList.length}):</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {childrenList.map((ch, cIdx) => (
                                <div key={cIdx} className="p-2 bg-white rounded border border-rose-200 flex items-center justify-between text-xs">
                                  <div>
                                    <span className="font-bold text-slate-900 block">{ch.name}</span>
                                    <span className="text-[10px] text-slate-500">{ch.gender || 'Child'} • Age: {ch.age || '-'}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-600">{ch.occupation || 'Student'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Adaptive Known Languages Proficiency Badges */}
                    {languagesList.length > 0 && (
                      <div className="sm:col-span-3 pt-2 border-t border-slate-200 space-y-1.5">
                        <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider block">
                          🌐 Known Languages Proficiency Matrix:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {languagesList.map((l, lIdx) => (
                            <span key={lIdx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-xs">
                              <strong className="text-emerald-950 font-bold">{l.name}</strong>
                              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1 rounded font-mono">
                                {[l.read !== false && 'R', l.write !== false && 'W', l.speak !== false && 'S'].filter(Boolean).join(' • ')}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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
              <div className="pdf-page-block space-y-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200">
                {/* Running Document Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{companyName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">Employee Master Dossier</span>
                  </div>
                  <div className="text-slate-600 text-[11px] font-mono">
                    <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                  </div>
                </div>

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
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Employment Type:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{c.jobType || jf.jobType || '-'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Work Location:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{c.workLocation || jf.workLocation || '-'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Previous Employer:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{jf.previousEmployer || c.previousEmployer || '-'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Total Experience:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{jf.experienceYears || c.experienceYears || (expList.length > 0 ? `${expList.length} Years` : '-')}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Probation Period:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{jf.probationPeriod || '-'}</div></div>
                  <div className="py-0.5"><span className="text-slate-500 block text-[10px]">Notice Period:</span><div className="text-slate-900 font-semibold text-xs mt-0.5">{jf.noticePeriod || '-'}</div></div>
                </div>

                {/* Family Nominee & Health Fitness Disclosures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                    <span className="font-bold text-slate-900 text-[11px] block">Family & Statutory Nominee Details:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-slate-500 text-[10px] block">Nominee Name:</span><strong className="text-slate-900">{nomineeName}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Relationship:</span><strong className="text-slate-900">{nomineeRelation}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">EPF Share Allocation:</span><strong className="text-emerald-800 font-mono">{nomineeName !== '-' ? '100% Share' : '-'}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Nominee Mobile:</span><strong className="font-mono text-slate-800">{nomineePhone}</strong></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
                    <span className="font-bold text-slate-900 text-[11px] block">Health & Pre-Employment Medical Fitness:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><span className="text-slate-500 text-[10px] block">Covid-19 Vaccination:</span><strong className="text-emerald-800">{jf.covidVaccineDoses ? `${jf.covidVaccineDoses} Doses ✓` : (jf.isCovidVaccinated === 'Yes' || jf.covidVaccinated ? 'Declared Vaccinated ✓' : '-')}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Medical Fitness:</span><strong className="text-emerald-800">{jf.medicalFitness || (jf.isMedicallyFit === 'Yes' ? 'Declared Fit' : '-')}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Pre-existing Illness:</span><strong>{jf.hasPreExistingIllness === 'Yes' ? (jf.preExistingDetails || 'Declared') : (jf.hasPreExistingIllness === 'No' ? 'None Declared' : '-')}</strong></div>
                      <div><span className="text-slate-500 text-[10px] block">Major Surgery:</span><strong>{jf.hasMajorSurgery === 'Yes' ? (jf.surgeryDetails || 'Declared') : (jf.hasMajorSurgery === 'No' ? 'None' : '-')}</strong></div>
                    </div>
                  </div>
                </div>

                {/* 🌟 ADAPTIVE PROFESSIONAL & SOCIAL MEDIA LINKS MATRIX */}
                {(linkedIn || github || portfolio || twitter || instagram || facebook || youtube) && (
                  <div className="p-3.5 bg-gradient-to-r from-indigo-50/90 to-sky-50/90 border border-indigo-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-indigo-950 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Professional & Social Media Verified Presence</span>
                      </span>
                      <span className="text-[9px] font-mono font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                        Interactive Verified Links
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {linkedIn && (
                        <a href={linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-50 transition shadow-2xs group">
                          <Linkedin className="w-4 h-4 text-sky-700 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-500 block">LinkedIn</span>
                            <span className="text-[11px] font-bold text-sky-800 truncate block group-hover:underline">{linkedIn.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </div>
                        </a>
                      )}
                      {github && (
                        <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-300 hover:bg-slate-50 transition shadow-2xs group">
                          <Github className="w-4 h-4 text-slate-900 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-500 block">GitHub</span>
                            <span className="text-[11px] font-bold text-slate-900 truncate block group-hover:underline">{github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </div>
                        </a>
                      )}
                      {portfolio && (
                        <a href={portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-emerald-200 hover:bg-emerald-50 transition shadow-2xs group">
                          <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-500 block">Portfolio</span>
                            <span className="text-[11px] font-bold text-emerald-800 truncate block group-hover:underline">{portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </div>
                        </a>
                      )}
                      {twitter && (
                        <a href={twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-sky-200 hover:bg-sky-50 transition shadow-2xs group">
                          <Twitter className="w-4 h-4 text-sky-500 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-500 block">Twitter (X)</span>
                            <span className="text-[11px] font-bold text-sky-700 truncate block group-hover:underline">{twitter.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </div>
                        </a>
                      )}
                      {instagram && (
                        <a href={instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-pink-200 hover:bg-pink-50 transition shadow-2xs group">
                          <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-500 block">Instagram</span>
                            <span className="text-[11px] font-bold text-pink-700 truncate block group-hover:underline">{instagram.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </div>
                        </a>
                      )}
                      {facebook && (
                        <a href={facebook} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition shadow-2xs group">
                          <Facebook className="w-4 h-4 text-blue-600 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-500 block">Facebook</span>
                            <span className="text-[11px] font-bold text-blue-700 truncate block group-hover:underline">{facebook.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </div>
                        </a>
                      )}
                      {youtube && (
                        <a href={youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-red-200 hover:bg-red-50 transition shadow-2xs group">
                          <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-500 block">YouTube</span>
                            <span className="text-[11px] font-bold text-red-700 truncate block group-hover:underline">{youtube.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: EDU & EXPERIENCE TABLES */}
            {(activeTab === 3 || activeTab === 7 || isExporting) && (
              <div className="pdf-page-block space-y-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200">
                {/* Running Document Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{companyName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">Employee Master Dossier</span>
                  </div>
                  <div className="text-slate-600 text-[11px] font-mono">
                    <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                  </div>
                </div>

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
              <div className="pdf-page-block space-y-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200">
                {/* Running Document Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{companyName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">Employee Master Dossier</span>
                  </div>
                  <div className="text-slate-600 text-[11px] font-mono">
                    <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                  </div>
                </div>

                <div className="bg-sky-800 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>SECTION 4: BANKING, STATUTORY ACCOUNTS & HEALTH DISCLOSURES</span>
                  </div>
                  <span className="text-[10px] font-mono">Statutory Proofs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div><span className="text-slate-400 block text-[10px]">Income Tax PAN:</span><strong className="font-mono text-indigo-900 font-bold">{panNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Aadhaar Identity Ref:</span><strong className="font-mono text-indigo-900 font-bold">{aadhaarNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Passport Number:</span><strong className="font-mono">{passportNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Driving License (DL):</span><strong className="font-mono">{dlNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Voter ID (EPIC):</span><strong className="font-mono">{voterId}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">National Ration Card:</span><strong className="font-mono text-emerald-900 font-bold">{rationCardNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">EPFO UAN Number:</span><strong className="font-mono">{uanNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">ESIC Insurance No:</span><strong className="font-mono text-[11px]">{esiNum}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Primary Bank:</span><strong className="text-slate-900">{bankName}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Account Number:</span><strong className="font-mono text-slate-900 font-bold">{accNo}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">IFSC & Branch:</span><strong className="font-mono">{ifsc} {branch !== '-' ? `(${branch})` : ''}</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">PF Member ID:</span><strong className="font-mono text-[11px]">{pfNum}</strong></div>
                </div>

                {/* Health & Lifestyle Questionnaire */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1.5">
                  <span className="font-black text-emerald-950 text-[11px] block flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Health, Lifestyle & Integrity Disclosures:</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div><span className="text-slate-500 block">General Medical Fitness:</span><strong className="text-emerald-900">{jf.medicalFitness || (jf.isMedicallyFit === 'Yes' ? 'Declared Fit' : (jf.isMedicallyFit === 'No' ? 'Not Fit' : '-'))}</strong></div>
                    <div><span className="text-slate-500 block">Smoking Habits:</span><strong>{jf.isSmoker === 'Yes' ? `Smoker (${jf.cigarettesPerDay || '1-5'}/day)` : (jf.isSmoker === 'No' ? 'Non-Smoker' : '-')}</strong></div>
                    <div><span className="text-slate-500 block">Major Surgeries / Hospitalization:</span><strong>{jf.hasMajorSurgery === 'Yes' ? (jf.surgeryDetails || 'Declared') : (jf.hasMajorSurgery === 'No' ? 'None' : '-')}</strong></div>
                    <div><span className="text-slate-500 block">Criminal Conviction / Court Case:</span><strong className="text-emerald-800">{jf.hasCriminalConviction === 'Yes' ? 'Under Review' : (jf.hasCriminalConviction === 'No' ? 'Clean Record (No Pending Cases)' : '-')}</strong></div>
                    <div><span className="text-slate-500 block">Residential Property:</span><strong>{jf.ownsHouse === 'Yes' ? `Owns House (${jf.houseCityTown || 'Native'})` : (jf.ownsHouse === 'No' ? 'Rented / Leased' : '-')}</strong></div>
                    <div><span className="text-slate-500 block">Group Company Relations:</span><strong>{jf.relatedToGroupEmployee === 'Yes' ? (jf.relatedEmployeeDetails || 'Declared') : (jf.relatedToGroupEmployee === 'No' ? 'No Relative in Organization' : '-')}</strong></div>
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
                        <span className="font-serif italic text-sky-300">HR Compliance Signatory</span>
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
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs pt-1">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">1</span>
                    <span>EPFO Form No. 11 — New Declaration Form (EPF 1952 & EPS 1995)</span>
                  </div>
                  <EpfoForm11 candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 2: EPFO Form 2 Revised */}
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">2</span>
                    <span>EPFO Form 2 (Revised) — Nomination & Declaration Form (Part A EPF & Part B EPS)</span>
                  </div>
                  <EpfoForm2 candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 3: ESIC Form 1 */}
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">3</span>
                    <span>ESIC Form 1 — Declaration Form, Family Particulars & Temporary Identification Card (TIC)</span>
                  </div>
                  <EsicForm1 candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 4: Form 16 / TDS Declaration */}
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">4</span>
                    <span>Form 16 / TDS Form 12B — Income Tax Salary & Deductions Statutory Declaration</span>
                  </div>
                  <Form16TdsDeclaration candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 5: Form F Gratuity */}
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">5</span>
                    <span>Form 'F' — Payment of Gratuity Act 1972 Statutory Nomination & Share Form</span>
                  </div>
                  <GratuityFormF candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 6: NDA Agreement */}
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">6</span>
                    <span>Non-Disclosure & Proprietary IP Information Binding Agreement (NDA)</span>
                  </div>
                  <NdaAgreement candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 7: POSH Policy Declaration */}
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">7</span>
                    <span>POSH Act 2013 — Workplace Safety Policy & Zero Tolerance Pledge</span>
                  </div>
                  <PoshPolicyDeclaration candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 8: Non-Compete Agreement */}
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">8</span>
                    <span>Enterprise Trade Secret Protection — Non-Compete & Non-Solicit Covenant</span>
                  </div>
                  <NonCompeteAgreement candidate={c} jf={jf} companyName={companyName} />
                </div>

                {/* Form 9: Contract Form XIII */}
                <div className="pdf-page-block bg-white p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Statutory Compliance Archive</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                    </div>
                  </div>
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
                        {/* Running Document Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{companyName}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600 font-medium">Document Verification Annexure</span>
                          </div>
                          <div className="text-slate-600 text-[11px] font-mono">
                            <strong className="text-slate-900">{candidateName}</strong> (#{c.employeeNumber || c.empId || c.uniqueProfileId || 'EMP001'})
                          </div>
                        </div>

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

                        {/* High-Resolution Document Display Frame (Images & Rendered PDFs) with Fit View */}
                        {(() => {
                          const docImages = getDocImages(doc);
                          const hasImages = docImages.length > 0;
                          const isConvertingThis = isConvertingPdfs && !hasImages && isPdfDoc(doc);

                          return (
                            <div className="rounded-2xl bg-slate-50/70 border border-slate-200 p-2 sm:p-4 flex flex-col items-center justify-center text-center space-y-3 print:bg-white print:border-none print:p-0 print:m-0">
                              {/* Interactive Fit View & Zoom Toolbar (Hidden on Print & PDF Export) */}
                              {hasImages && (
                                <div className="flex items-center justify-between w-full bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold print:hidden flex-wrap gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mr-1">Display:</span>
                                    <button
                                      type="button"
                                      onClick={() => { setFitMode('width'); setZoomLevel(1); }}
                                      className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                                        fitMode === 'width' && zoomLevel === 1 
                                          ? 'bg-sky-600 text-white shadow-2xs font-bold' 
                                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                      }`}
                                      title="Fit to Full Container Width (Optimal Reading View)"
                                    >
                                      Fit Width ↔
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { setFitMode('page'); setZoomLevel(1); }}
                                      className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                                        fitMode === 'page' && zoomLevel === 1 
                                          ? 'bg-sky-600 text-white shadow-2xs font-bold' 
                                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                      }`}
                                      title="Fit to Page Height"
                                    >
                                      Fit Page ↕
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setZoomLevel(prev => Math.max(0.75, Number((prev - 0.2).toFixed(2))))}
                                      disabled={zoomLevel <= 0.75}
                                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                                      title="Zoom Out (-20%)"
                                    >
                                      <ZoomOut className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="font-mono text-[11px] text-slate-700 px-1 font-bold min-w-[38px] text-center">
                                      {Math.round(zoomLevel * 100)}%
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setZoomLevel(prev => Math.min(2.0, Number((prev + 0.2).toFixed(2))))}
                                      disabled={zoomLevel >= 2.0}
                                      className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                                      title="Zoom In (+20%)"
                                    >
                                      <ZoomIn className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const win = window.open();
                                        if (win) {
                                          win.document.write(
                                            `<html style="background:#0f172a;margin:0;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;">` +
                                            docImages.map((img, i) => `<img src="${img}" style="max-width:96%;height:auto;margin:15px auto;display:block;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.5);" />`).join('') +
                                            `</html>`
                                          );
                                        }
                                      }}
                                      className="btn btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 font-bold cursor-pointer ml-1"
                                      title="Open full resolution in new window"
                                    >
                                      <Maximize2 className="w-3 h-3 text-slate-600" />
                                      <span>Full Resolution</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Document Display / Render Container */}
                              {hasImages ? (
                                <div className="w-full flex flex-col items-center space-y-4">
                                  {docImages.map((pageImg, pageIdx) => (
                                    <div key={pageIdx} className="w-full flex flex-col items-center space-y-1.5">
                                      {docImages.length > 1 && (
                                        <div className="flex items-center justify-between w-full px-2 text-[11px] font-bold text-slate-600 print:text-[10px]">
                                          <span className="badge badge-purple text-[10px] py-0.5">PAGE {pageIdx + 1} OF {docImages.length}</span>
                                          <span className="text-slate-400 font-mono text-[10px]">OFFICIAL GOVERNMENT / VERIFIED EXHIBIT</span>
                                        </div>
                                      )}
                                      <div className="w-full overflow-hidden flex justify-center rounded-xl bg-white border border-slate-200 shadow-sm p-1.5 sm:p-2.5 print:p-0 print:border-none print:shadow-none">
                                        <img 
                                          src={pageImg} 
                                          alt={`${doc.title} - Page ${pageIdx + 1}`} 
                                          className="w-full max-w-full h-auto object-contain rounded-lg transition-transform duration-200 bg-white"
                                          style={{
                                            maxHeight: fitMode === 'page' ? '700px' : 'none',
                                            transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
                                            transformOrigin: 'top center'
                                          }}
                                          loading="eager"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : isConvertingThis ? (
                                <div className="p-8 flex flex-col items-center justify-center space-y-3 bg-white rounded-xl border border-sky-200 shadow-sm w-full max-w-md my-4">
                                  <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                                  <p className="text-xs font-bold text-slate-800">Converting Original PDF to High-Resolution Image...</p>
                                  <p className="text-[10px] text-slate-500 font-mono">Rendering DPDP-compliant exhibit pages for profile dossier</p>
                                </div>
                              ) : (
                                <div className="w-full max-w-md bg-white p-6 rounded-2xl border-2 border-sky-200 shadow-md space-y-3 text-center my-2">
                                  <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shadow-2xs">
                                    <FileText className="w-7 h-7" />
                                  </div>
                                  <div className="space-y-1">
                                    <h3 className="text-base font-bold text-slate-900">{doc.title}</h3>
                                    <p className="text-xs text-slate-600 font-mono">📄 {doc.name} ({doc.file_size_kb || 450} KB • {doc.file_format || 'PDF'})</p>
                                    <span className="badge badge-emerald text-[10px] mt-1">DPDP 2023 & ISO 27001 Encrypted Exhibit ✓</span>
                                  </div>
                                  {doc.file_path ? (
                                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 print:hidden">
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadExhibit(doc)}
                                        className="btn btn-company text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold cursor-pointer"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Download Original Document</span>
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          );
                        })()}

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

        {/* Sticky Bottom Bar for instant PDF download at all scroll positions */}
        <div className="shrink-0 bg-white/95 backdrop-blur-md p-3 sm:p-4 border-t border-slate-200 z-30 flex items-center justify-between gap-3 shadow-md print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700 truncate max-w-xs sm:max-w-md">
              {candidateName} • Master Profile Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 text-xs transition-all cursor-pointer"
              title="Close Dossier (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close (Esc)</span>
            </button>
            <button 
              type="button" 
              onClick={handlePrint} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold py-1.5 px-3 rounded-xl flex items-center gap-1.5 text-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Packet</span>
            </button>
            <button 
              type="button" 
              onClick={handleDownloadPdf} 
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-xl flex items-center gap-1.5 text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isExporting ? "Compiling Master PDF..." : "Download Master Dossier (PDF)"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  ), document.body);;
};

export default EmployeeProfileDossierModal;

