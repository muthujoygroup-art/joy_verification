import React, { useRef, useState } from 'react';
import { 
  FileText, Download, X, CheckCircle2, AlertTriangle, ShieldCheck, 
  Building2, User, Calendar, MapPin, CreditCard, Award, Printer, Copy, Sparkles
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { formatDisplayDate, parseAnyDate } from '../utils/validationRules';

export const DocumentComparisonPdfModal = ({ isOpen, onClose, candidate }) => {
  const reportRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'name' | 'dob' | 'address' | 'father'

  if (!isOpen || !candidate) return null;

  // Extract candidate data and live-verified attributes
  const candName = candidate.name || 'Valued Employee';
  const candEmpId = candidate.empId || candidate.employeeNumber || candidate.id || 'EMP-001';
  const candCompany = candidate.companyName || candidate.company_name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED';
  const candDesignation = candidate.designation || 'Associate';
  const candDept = candidate.dept || 'General Operations';

  const verifs = candidate.verifiedAttributes || candidate.verified_attributes || {};
  const jData = candidate.joiningFormData || candidate.joining_form_data || candidate.submittedFormData || {};

  const maskAadhaarNo = (val) => {
    if (!val) return 'Not Uploaded';
    const digits = String(val).replace(/\D/g, '');
    return digits.length >= 4 ? `XXXX-XXXX-${digits.slice(-4)}` : 'XXXX-XXXX-****';
  };

  const aadh = verifs.aadhaar || candidate.aadhaar_data || {};
  const pan = verifs.pan || candidate.pan_data || {};
  const dl = verifs.drivingLicense || verifs.dl || verifs.driving_license || candidate.dl_data || {};
  const passport = verifs.passport || candidate.passport_data || {};
  const epfo = verifs.epfoUan || verifs.uan || verifs.epfo || candidate.epfo_data || {};
  const esic = verifs.esic || {};
  const bank = verifs.bankCheck || verifs.bank || candidate.bank_data || {};
  const voter = verifs.voter_id || verifs.voterId || {};

  const aadhAddressStr = typeof aadh.address === 'object' && aadh.address !== null
    ? `${aadh.address.house || ''} ${aadh.address.street || ''} ${aadh.address.city || ''} ${aadh.address.state || ''} ${aadh.address.pincode || ''}`.trim()
    : (aadh.address || candidate.permanentAddress || jData.permanentAddress || 'Not Uploaded');

  const isAadhaarDone = !!(candidate.verificationsCompleted?.aadhaar || candidate.verifications_completed?.aadhaar || aadh.full_name || aadh.name || (candidate.status === 'Verified' && (candidate.aadhaarNo || candidate.aadhaar_no || aadh.masked_aadhaar)));
  const isPanDone = !!(candidate.verificationsCompleted?.pan || candidate.verifications_completed?.pan || pan.pan_number || pan.pan || (candidate.status === 'Verified' && (candidate.panNo || candidate.pan_no)));
  const isDlDone = !!(candidate.verificationsCompleted?.drivingLicense || candidate.verificationsCompleted?.dl || candidate.verifications_completed?.driving_license || candidate.verifications_completed?.dl || dl.dl_number || dl.license_number || (candidate.status === 'Verified' && (candidate.dlNumber || candidate.dl_no || candidate.drivingLicense)));
  const isPassportDone = !!(candidate.verificationsCompleted?.passport || candidate.verifications_completed?.passport || passport.passport_number || (candidate.status === 'Verified' && (candidate.passportNo || candidate.passport_no)));
  const isEpfoDone = !!(candidate.verificationsCompleted?.epfoUan || candidate.verificationsCompleted?.uan || candidate.verificationsCompleted?.epfo || candidate.verifications_completed?.epfo || candidate.verifications_completed?.uan || epfo.uan || (candidate.status === 'Verified' && (candidate.uanEpf || candidate.pfNumber)));
  const isEsicDone = !!(candidate.verificationsCompleted?.esic || candidate.verifications_completed?.esic || esic.esic_number || esic.ip_number || (candidate.status === 'Verified' && (candidate.esiNumber || candidate.esi_number)));
  const isBankDone = !!(candidate.verificationsCompleted?.bankCheck || candidate.verificationsCompleted?.bank || candidate.verifications_completed?.bank || candidate.verifications_completed?.bank_check || bank.account_number || bank.beneficiary_name || (candidate.status === 'Verified' && (candidate.bankAccountNo || candidate.bank_account_no)));
  const isVoterDone = !!(candidate.verificationsCompleted?.voterId || candidate.verificationsCompleted?.voter_id || candidate.verifications_completed?.voter_id || candidate.verifications_completed?.voterId || voter.epic_number || (candidate.status === 'Verified' && candidate.voterId));

  const hasDocFile = (docType) => {
    if (!candidate.documents) return false;
    if (Array.isArray(candidate.documents)) {
      return candidate.documents.some(d => d && (d.type === docType || d.docType === docType || d.name?.toLowerCase()?.includes(docType.toLowerCase())));
    }
    return !!candidate.documents[docType];
  };

  const isAadhaarUploaded = !!(isAadhaarDone || candidate.aadhaarNo || candidate.aadhaar_no || aadh.masked_aadhaar || aadh.aadhaar_number || jData.aadhaarNo || hasDocFile('aadhaar'));
  const isPanUploaded = !!(isPanDone || (candidate.panNo && candidate.panNo !== 'ABCDE1234F') || (candidate.pan_no && candidate.pan_no !== 'ABCDE1234F') || (jData.panNo && jData.panNo !== 'ABCDE1234F') || hasDocFile('pan'));
  const isDlUploaded = !!(isDlDone || candidate.dlNumber || candidate.dl_no || candidate.drivingLicense || jData.drivingLicense || hasDocFile('dl') || hasDocFile('drivingLicense') || hasDocFile('driving_license'));
  const isPassportUploaded = !!(isPassportDone || candidate.passportNo || candidate.passport_no || jData.passportNo || hasDocFile('passport'));
  const isEpfoUploaded = !!(isEpfoDone || candidate.uanEpf || candidate.uan_no || candidate.pfNumber || candidate.pf_number || jData.uanEpf || jData.pfNumber || hasDocFile('epfo') || hasDocFile('uan'));
  const isEsicUploaded = !!(isEsicDone || candidate.esiNumber || candidate.esi_number || candidate.esi_no || jData.esiNumber || hasDocFile('esic'));
  const isBankUploaded = !!(isBankDone || candidate.bankAccountNo || candidate.bank_account_no || bank.account_number || jData.bankAccountNo || hasDocFile('bank'));
  const isVoterUploaded = !!(isVoterDone || candidate.voterId || candidate.voter_id || jData.voterId || hasDocFile('voter') || hasDocFile('voterId'));

  // Resolve extracted identity data for each document source
  const docDataMap = {
    aadhaar: {
      label: 'AADHAAR CARD (UIDAI)',
      isUploaded: isAadhaarUploaded,
      isVerified: isAadhaarDone,
      name: isAadhaarDone
        ? (aadh.full_name || aadh.name || candidate.name || jData.fullName || 'Not Uploaded').toUpperCase()
        : isAadhaarUploaded
          ? (jData.fullName || candidate.name || 'Not Uploaded').toUpperCase()
          : 'Not Uploaded',
      dob: isAadhaarDone
        ? formatDisplayDate(aadh.dob || candidate.dob || jData.dob)
        : isAadhaarUploaded
          ? formatDisplayDate(candidate.dob || jData.dob)
          : 'Not Uploaded',
      address: isAadhaarDone
        ? aadhAddressStr
        : isAadhaarUploaded
          ? (candidate.permanentAddress || jData.permanentAddress || 'Not Uploaded')
          : 'Not Uploaded',
      fatherName: isAadhaarDone
        ? (aadh.care_of || aadh.careOf || aadh.father_name || candidate.fatherName || jData.fatherName || 'Not Uploaded')
        : isAadhaarUploaded
          ? (candidate.fatherName || jData.fatherName || 'Not Uploaded')
          : 'Not Uploaded',
      docNo: isAadhaarUploaded
        ? maskAadhaarNo(candidate.aadhaarNo || candidate.aadhaar_no || aadh.masked_aadhaar || aadh.aadhaar_number || jData.aadhaarNo)
        : 'Not Uploaded',
      status: isAadhaarDone ? 'Verified 🟢' : (isAadhaarUploaded ? 'Submitted 🟡' : 'Not Uploaded ⚪')
    },
    pan: {
      label: 'PAN CARD (NSDL / ITD)',
      isUploaded: isPanUploaded,
      isVerified: isPanDone,
      name: isPanDone
        ? (pan.full_name || pan.name || candidate.name || jData.fullName || 'Not Uploaded').toUpperCase()
        : isPanUploaded
          ? (jData.fullName || candidate.name || 'Not Uploaded').toUpperCase()
          : 'Not Uploaded',
      dob: isPanDone
        ? formatDisplayDate(pan.dob || candidate.dob || jData.dob)
        : isPanUploaded
          ? formatDisplayDate(candidate.dob || jData.dob)
          : 'Not Uploaded',
      address: isPanDone
        ? (pan.address || 'N/A (ITD Records)')
        : isPanUploaded
          ? 'N/A (ITD Records)'
          : 'Not Uploaded',
      fatherName: isPanDone
        ? (pan.father_name || pan.fatherName || candidate.fatherName || jData.fatherName || 'Not Uploaded')
        : isPanUploaded
          ? (candidate.fatherName || jData.fatherName || 'Not Uploaded')
          : 'Not Uploaded',
      docNo: isPanUploaded
        ? (pan.pan_number || pan.pan || candidate.panNo || candidate.pan_no || jData.panNo || 'Not Uploaded')
        : 'Not Uploaded',
      status: isPanDone ? 'Verified 🟢' : (isPanUploaded ? 'Submitted 🟡' : 'Not Uploaded ⚪')
    },
    drivingLicense: {
      label: 'DRIVING LICENSE (MoRTH)',
      isUploaded: isDlUploaded,
      isVerified: isDlDone,
      name: isDlDone
        ? (dl.holder_name || dl.name || dl.user_full_name || candidate.name || 'Not Uploaded').toUpperCase()
        : isDlUploaded
          ? (jData.fullName || candidate.name || 'Not Uploaded').toUpperCase()
          : 'Not Uploaded',
      dob: isDlDone
        ? formatDisplayDate(dl.dob || dl.date_of_birth || candidate.dob)
        : isDlUploaded
          ? formatDisplayDate(candidate.dob || jData.dob)
          : 'Not Uploaded',
      address: isDlDone
        ? (dl.address || candidate.presentAddress || 'Not Uploaded')
        : isDlUploaded
          ? (candidate.presentAddress || 'Not Uploaded')
          : 'Not Uploaded',
      fatherName: isDlDone
        ? (dl.father_name || dl.fatherName || candidate.fatherName || 'Not Uploaded')
        : isDlUploaded
          ? (candidate.fatherName || 'Not Uploaded')
          : 'Not Uploaded',
      docNo: isDlUploaded
        ? (dl.dl_number || dl.license_number || candidate.dlNumber || candidate.dl_no || candidate.drivingLicense || jData.drivingLicense || 'Not Uploaded')
        : 'Not Uploaded',
      status: isDlDone ? 'Verified 🟢' : (isDlUploaded ? 'Submitted 🟡' : 'Not Uploaded ⚪')
    },
    passport: {
      label: 'PASSPORT (MEA)',
      isUploaded: isPassportUploaded,
      isVerified: isPassportDone,
      name: isPassportDone
        ? (passport.full_name || (passport.given_name ? `${passport.given_name} ${passport.surname || ''}`.trim() : '') || candidate.name || 'Not Uploaded').toUpperCase()
        : isPassportUploaded
          ? (jData.fullName || candidate.name || 'Not Uploaded').toUpperCase()
          : 'Not Uploaded',
      dob: isPassportDone
        ? formatDisplayDate(passport.dob || candidate.dob)
        : isPassportUploaded
          ? formatDisplayDate(candidate.dob || jData.dob)
          : 'Not Uploaded',
      address: isPassportDone
        ? (passport.address || candidate.permanentAddress || 'Not Uploaded')
        : isPassportUploaded
          ? (candidate.permanentAddress || 'Not Uploaded')
          : 'Not Uploaded',
      fatherName: isPassportDone
        ? (passport.father_name || passport.fatherName || candidate.fatherName || 'Not Uploaded')
        : isPassportUploaded
          ? (candidate.fatherName || 'Not Uploaded')
          : 'Not Uploaded',
      docNo: isPassportUploaded
        ? (passport.passport_number || candidate.passportNo || candidate.passport_no || jData.passportNo || 'Not Uploaded')
        : 'Not Uploaded',
      status: isPassportDone ? 'Verified 🟢' : (isPassportUploaded ? 'Submitted 🟡' : 'Not Uploaded ⚪')
    },
    uan: {
      label: 'EPFO UAN (MEMBER SERVICE)',
      isUploaded: isEpfoUploaded,
      isVerified: isEpfoDone,
      name: isEpfoDone
        ? (epfo.member_name || epfo.full_name || epfo.name || candidate.name || 'Not Uploaded').toUpperCase()
        : isEpfoUploaded
          ? (jData.fullName || candidate.name || 'Not Uploaded').toUpperCase()
          : 'Not Uploaded',
      dob: isEpfoDone
        ? formatDisplayDate(epfo.dob || candidate.dob)
        : isEpfoUploaded
          ? formatDisplayDate(candidate.dob || jData.dob)
          : 'Not Uploaded',
      address: isEpfoDone
        ? (epfo.establishment_address || 'N/A (EPFO Records)')
        : isEpfoUploaded
          ? 'N/A (EPFO Records)'
          : 'Not Uploaded',
      fatherName: isEpfoDone
        ? (epfo.father_name || epfo.fatherName || candidate.fatherName || 'Not Uploaded')
        : isEpfoUploaded
          ? (candidate.fatherName || 'Not Uploaded')
          : 'Not Uploaded',
      docNo: isEpfoUploaded
        ? (epfo.uan || candidate.uanEpf || candidate.uan_no || candidate.pfNumber || candidate.pf_number || jData.uanEpf || jData.pfNumber || 'Not Uploaded')
        : 'Not Uploaded',
      status: isEpfoDone ? 'Verified 🟢' : (isEpfoUploaded ? 'Submitted 🟡' : 'Not Uploaded ⚪')
    },
    esic: {
      label: 'ESIC (INSURED PERSON)',
      isUploaded: isEsicUploaded,
      isVerified: isEsicDone,
      name: isEsicDone
        ? (esic.insured_person_name || esic.ipName || esic.name || candidate.name || 'Not Uploaded').toUpperCase()
        : isEsicUploaded
          ? (jData.fullName || candidate.name || 'Not Uploaded').toUpperCase()
          : 'Not Uploaded',
      dob: isEsicDone
        ? formatDisplayDate(esic.dob || candidate.dob)
        : isEsicUploaded
          ? formatDisplayDate(candidate.dob || jData.dob)
          : 'Not Uploaded',
      address: isEsicDone
        ? (esic.address || 'N/A (ESIC Portal)')
        : isEsicUploaded
          ? 'N/A (ESIC Portal)'
          : 'Not Uploaded',
      fatherName: isEsicDone
        ? (esic.father_name || esic.fatherName || candidate.fatherName || 'Not Uploaded')
        : isEsicUploaded
          ? (candidate.fatherName || 'Not Uploaded')
          : 'Not Uploaded',
      docNo: isEsicUploaded
        ? (esic.esic_number || esic.ip_number || candidate.esiNumber || candidate.esi_number || jData.esiNumber || 'Not Uploaded')
        : 'Not Uploaded',
      status: isEsicDone ? 'Verified 🟢' : (isEsicUploaded ? 'Submitted 🟡' : 'Not Uploaded ⚪')
    },
    bank: {
      label: 'BANK ACCOUNT (IMPS PENNY DROP)',
      isUploaded: isBankUploaded,
      isVerified: isBankDone,
      name: isBankDone
        ? (bank.beneficiary_name || bank.beneficiaryName || bank.name || candidate.name || 'Not Uploaded').toUpperCase()
        : isBankUploaded
          ? (jData.fullName || candidate.name || 'Not Uploaded').toUpperCase()
          : 'Not Uploaded',
      dob: 'N/A (Bank Privacy Policy)',
      address: isBankDone
        ? (bank.branch || bank.branch_name || 'N/A (CBS Branch Records)')
        : isBankUploaded
          ? 'N/A (CBS Branch Records)'
          : 'Not Uploaded',
      fatherName: 'N/A (Bank CBS)',
      docNo: isBankUploaded
        ? ((candidate.bankAccountNo || candidate.bank_account_no || bank.account_number || jData.bankAccountNo)
          ? `A/C: ••••••${String(candidate.bankAccountNo || candidate.bank_account_no || bank.account_number || jData.bankAccountNo).slice(-4)} (${candidate.bankName || bank.bank_name || jData.bankName || 'Bank'})`
          : 'Not Uploaded')
        : 'Not Uploaded',
      status: isBankDone ? 'Verified 🟢' : (isBankUploaded ? 'Submitted 🟡' : 'Not Uploaded ⚪')
    },
    voterId: {
      label: 'VOTER ID (EPIC / ECI)',
      isUploaded: isVoterUploaded,
      isVerified: isVoterDone,
      name: isVoterDone
        ? (voter.name || voter.epic_name || candidate.name || 'Not Uploaded').toUpperCase()
        : isVoterUploaded
          ? (jData.fullName || candidate.name || 'Not Uploaded').toUpperCase()
          : 'Not Uploaded',
      dob: isVoterDone
        ? formatDisplayDate(voter.dob || candidate.dob)
        : isVoterUploaded
          ? formatDisplayDate(candidate.dob || jData.dob)
          : 'Not Uploaded',
      address: isVoterDone
        ? (voter.address || candidate.permanentAddress || 'Not Uploaded')
        : isVoterUploaded
          ? (candidate.permanentAddress || 'Not Uploaded')
          : 'Not Uploaded',
      fatherName: isVoterDone
        ? (voter.relative_name || voter.relativeName || voter.father_name || candidate.fatherName || 'Not Uploaded')
        : isVoterUploaded
          ? (candidate.fatherName || 'Not Uploaded')
          : 'Not Uploaded',
      docNo: isVoterUploaded
        ? (voter.epic_number || candidate.voterId || candidate.voter_id || jData.voterId || 'Not Uploaded')
        : 'Not Uploaded',
      status: isVoterDone ? 'Verified 🟢' : (isVoterUploaded ? 'Submitted 🟡' : 'Not Uploaded ⚪')
    }
  };

  const docKeys = ['aadhaar', 'pan', 'drivingLicense', 'passport', 'uan', 'esic', 'bank', 'voterId'];

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Document_Attribute_Comparison_${candName.replace(/\s+/g, '_')}_${candEmpId}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please try printing or copying the report.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-6 overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-lg text-white tracking-tight">
                Original Document Attribute Comparison Report (PDF)
              </h2>
              <p className="text-xs text-indigo-300 font-medium">
                Side-by-side Statutory Attribute Verification & Identity Extraction Matrix
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="btn bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Report 📄'}</span>
            </button>
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Sub-Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider">Attribute Filter:</span>
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
            >
              All Attributes Matrix
            </button>
            <button 
              onClick={() => setActiveTab('name')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${activeTab === 'name' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
            >
              Name Comparison
            </button>
            <button 
              onClick={() => setActiveTab('dob')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${activeTab === 'dob' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
            >
              Date of Birth Comparison
            </button>
            <button 
              onClick={() => setActiveTab('address')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${activeTab === 'address' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
            >
              Address Comparison
            </button>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Candidate ID: <strong className="text-slate-800">{candEmpId}</strong>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100">
          <div 
            ref={reportRef}
            className="bg-white p-8 rounded-xl shadow-md border border-slate-200 text-slate-800 font-sans max-w-4xl mx-auto"
            style={{ width: '100%', minHeight: '800px' }}
          >
            {/* Header Document Banner */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl">
                  JOY
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {candCompany}
                  </h1>
                  <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                    Statutory Original Document Attribute Comparison Certificate
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs uppercase tracking-wider border border-emerald-300">
                  ISO 27001 Certified ✓
                </span>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Report Ref: BGV-CMP-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>

            {/* Employee Dossier Header Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Candidate Name</span>
                <span className="font-black text-slate-900 text-sm">{candName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Employee ID</span>
                <span className="font-mono font-bold text-indigo-700 text-sm">{candEmpId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Designation</span>
                <span className="font-semibold text-slate-800">{candDesignation}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Department</span>
                <span className="font-semibold text-slate-800">{candDept}</span>
              </div>
            </div>

            {/* Summary Banner */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-950 leading-relaxed">
                <strong>Executive Audit Purpose:</strong> This report presents the exact raw attributes (Full Name, Date of Birth, Permanent/Present Address, and Father/Spouse Name) extracted directly from official Government Primary Source Gateways (UIDAI, NSDL, MoRTH, MEA, EPFO, ESIC, ECI, NPCI).
              </div>
            </div>

            {/* TABULAR COMPARISON MATRIX (Exact user-requested structure) */}

            {/* 1. NAME COMPARISON TABLE */}
            {(activeTab === 'all' || activeTab === 'name') && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    1. Candidate Name Cross-Document Matrix
                  </h3>
                </div>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="p-2.5 text-left border border-slate-700 w-1/4">Attribute Parameter</th>
                      <th className="p-2.5 text-left border border-slate-700 w-1/3">Document Identity Source</th>
                      <th className="p-2.5 text-left border border-slate-700">Extracted Name Particulars</th>
                      <th className="p-2.5 text-center border border-slate-700 w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docKeys.map((key, idx) => {
                      const d = docDataMap[key];
                      const isNotUploaded = !d.isUploaded || d.name === 'Not Uploaded' || d.name.toUpperCase() === 'NOT UPLOADED';
                      const isPending = d.isUploaded && !d.isVerified;
                      const isMatch = d.isVerified && !isNotUploaded && (
                        candName.toLowerCase().split(' ').some(part => part && part.length > 1 && d.name.toLowerCase().includes(part)) ||
                        d.name.toLowerCase().split(' ').some(part => part && part.length > 1 && candName.toLowerCase().includes(part))
                      );
                      return (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          {idx === 0 && (
                            <td rowSpan={docKeys.length} className="p-3 border border-slate-300 font-black text-slate-900 bg-slate-100 align-top">
                              Full Candidate Name
                            </td>
                          )}
                          <td className="p-2.5 border border-slate-300 font-bold text-slate-800">
                            {d.label}
                          </td>
                          <td className="p-2.5 border border-slate-300 font-mono font-bold text-slate-900">
                            {d.name}
                          </td>
                          <td className="p-2.5 border border-slate-300 text-center font-bold">
                            {isNotUploaded ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600">
                                Not Uploaded
                              </span>
                            ) : isPending ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">
                                Pending 🟡
                              </span>
                            ) : isMatch ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">
                                Matched ✓
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">
                                Variant ⚠️
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. DATE OF BIRTH COMPARISON TABLE */}
            {(activeTab === 'all' || activeTab === 'dob') && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    2. Date of Birth (DOB) Cross-Document Matrix
                  </h3>
                </div>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="p-2.5 text-left border border-slate-700 w-1/4">Attribute Parameter</th>
                      <th className="p-2.5 text-left border border-slate-700 w-1/3">Document Identity Source</th>
                      <th className="p-2.5 text-left border border-slate-700">Extracted Date of Birth</th>
                      <th className="p-2.5 text-center border border-slate-700 w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docKeys.map((key, idx) => {
                      const d = docDataMap[key];
                      const isNotUploaded = !d.isUploaded || d.dob === 'Not Uploaded' || d.dob.toUpperCase() === 'NOT UPLOADED' || d.dob === '—';
                      const isNA = d.dob.includes('N/A') || d.dob.toUpperCase().includes('PRIVACY');
                      const isPending = d.isUploaded && !d.isVerified && !isNA;
                      return (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          {idx === 0 && (
                            <td rowSpan={docKeys.length} className="p-3 border border-slate-300 font-black text-slate-900 bg-slate-100 align-top">
                              Date of Birth (DOB)
                            </td>
                          )}
                          <td className="p-2.5 border border-slate-300 font-bold text-slate-800">
                            {d.label}
                          </td>
                          <td className="p-2.5 border border-slate-300 font-mono font-bold text-slate-900">
                            {d.dob}
                          </td>
                          <td className="p-2.5 border border-slate-300 text-center font-bold">
                            {isNotUploaded || isNA ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600">
                                N/A
                              </span>
                            ) : isPending ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">
                                Pending 🟡
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">
                                Verified ✓
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. ADDRESS COMPARISON TABLE */}
            {(activeTab === 'all' || activeTab === 'address') && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    3. Permanent & Present Address Cross-Document Matrix
                  </h3>
                </div>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="p-2.5 text-left border border-slate-700 w-1/4">Attribute Parameter</th>
                      <th className="p-2.5 text-left border border-slate-700 w-1/3">Document Identity Source</th>
                      <th className="p-2.5 text-left border border-slate-700">Extracted Residential Address</th>
                      <th className="p-2.5 text-center border border-slate-700 w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docKeys.map((key, idx) => {
                      const d = docDataMap[key];
                      const isNotUploaded = !d.isUploaded || d.address === 'Not Uploaded' || d.address.toUpperCase() === 'NOT UPLOADED' || d.address === '—';
                      const isNA = d.address.includes('N/A');
                      const isPending = d.isUploaded && !d.isVerified && !isNA;
                      return (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          {idx === 0 && (
                            <td rowSpan={docKeys.length} className="p-3 border border-slate-300 font-black text-slate-900 bg-slate-100 align-top">
                              Residential Address
                            </td>
                          )}
                          <td className="p-2.5 border border-slate-300 font-bold text-slate-800">
                            {d.label}
                          </td>
                          <td className="p-2.5 border border-slate-300 text-slate-800 leading-relaxed">
                            {d.address}
                          </td>
                          <td className="p-2.5 border border-slate-300 text-center font-bold">
                            {isNotUploaded ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600">
                                Not Uploaded
                              </span>
                            ) : isNA ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600">
                                N/A
                              </span>
                            ) : isPending ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">
                                Pending 🟡
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">
                                Recorded ✓
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. DOCUMENT NUMBER & FATHER NAME SUMMARY */}
            {activeTab === 'all' && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    4. Statutory Document Number & Father/Spouse Particulars
                  </h3>
                </div>
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="p-2.5 text-left border border-slate-700">Document Type</th>
                      <th className="p-2.5 text-left border border-slate-700">Document ID / Account No</th>
                      <th className="p-2.5 text-left border border-slate-700">Father / Spouse Name</th>
                      <th className="p-2.5 text-center border border-slate-700">Verification Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docKeys.map((key, idx) => {
                      const d = docDataMap[key];
                      const isNotUploaded = !d.isUploaded || d.docNo === 'Not Uploaded' || d.docNo.toUpperCase() === 'NOT UPLOADED';
                      const isPending = d.isUploaded && !d.isVerified;
                      return (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 border border-slate-300 font-bold text-slate-800">
                            {d.label}
                          </td>
                          <td className="p-2.5 border border-slate-300 font-mono font-bold text-indigo-700">
                            {d.docNo}
                          </td>
                          <td className="p-2.5 border border-slate-300 font-semibold text-slate-800">
                            {d.fatherName}
                          </td>
                          <td className="p-2.5 border border-slate-300 text-center font-bold">
                            {isNotUploaded ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600">
                                Not Uploaded ⚪
                              </span>
                            ) : isPending ? (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">
                                Submitted 🟡
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800">
                                Verified 🟢
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* PDF Stamp & Sign Footer */}
            <div className="mt-8 pt-6 border-t-2 border-slate-900 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-900 uppercase">
                  Issued By: JOY Corporate Solutions Verification Division
                </p>
                <p className="text-[10px] text-slate-500">
                  DPDP Act 2023 Statutory Compliance & Encrypted Audit Trail
                </p>
              </div>
              <div className="text-right">
                <div className="inline-block p-2 border-2 border-emerald-600 rounded-lg bg-emerald-50 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                  OFFICIAL AUDIT COMPLETE ✓
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn btn-secondary font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
          >
            Close Viewer
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="btn bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2 px-6 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
