import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Send, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Users, 
  X, 
  RefreshCw, 
  Copy, 
  Sparkles, 
  Trash2, 
  CheckSquare, 
  Square,
  ShieldCheck,
  Building2,
  FileCheck,
  Zap,
  Eye,
  Sliders
} from 'lucide-react';

export const BulkEmployeeImportModal = ({ 
  isOpen, 
  onClose, 
  activeHr, 
  currentCompany,
  onImportComplete 
}) => {
  const { addCandidate, showToast } = useApp();

  // Step 1: Upload & Data | Step 2: Verification Checklist & Dispatch | Step 3: Success Summary
  const [currentStep, setCurrentStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [selectedEmployeeTypeFilter, setSelectedEmployeeTypeFilter] = useState('ALL');
  const fileInputRef = useRef(null);

  // Link Sending Option States
  const [autoSendLinks, setAutoSendLinks] = useState(true);
  const [dispatchChannels, setDispatchChannels] = useState({
    email: true,
    sms: true,
    whatsapp: false
  });
  const [customHrMessage, setCustomHrMessage] = useState(
    `Welcome to ${currentCompany?.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}! Please click the official onboarding link to complete your digital identity and background verification.`
  );

  // Documents Verification Checklist States
  const [checklist, setChecklist] = useState({
    aadhaar: { enabled: true, title: 'Aadhaar Card (UIDAI OTP e-KYC)', category: 'Identity' },
    pan: { enabled: true, title: 'PAN Card Verification (NSDL/ITD)', category: 'Tax / Identity' },
    bankCheck: { enabled: true, title: 'Bank Account & IFSC (Penny Drop)', category: 'Financial' },
    uan: { enabled: true, title: 'EPFO UAN Service History', category: 'Employment' },
    education: { enabled: true, title: 'Academic Degree & Marksheets', category: 'Education' },
    experience: { enabled: true, title: 'Previous Employer Relieving Letter', category: 'Employment' },
    salarySlips: { enabled: true, title: 'Last 3 Months Salary Payslips', category: 'Financial' },
    addressProof: { enabled: false, title: 'Permanent Address Proof', category: 'Address' },
    criminalCheck: { enabled: true, title: 'Police Criminal Record Check', category: 'Legal / Police' },
    courtLitigation: { enabled: true, title: 'Court Litigation / e-Courts Check', category: 'Legal' },
    drivingLicense: { enabled: false, title: 'Driving License (MoRTH)', category: 'Identity' },
    passport: { enabled: false, title: 'Passport Verification', category: 'Identity' },
    specimenSignature: { enabled: true, title: 'Digital Specimen Signature', category: 'Compliance' },
    dpdpConsent: { enabled: true, title: 'DPDP Act 2023 Statutory Consent Gate', category: 'Compliance' }
  });

  // Processing & Results
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importedCandidates, setImportedCandidates] = useState([]);
  const [copiedToken, setCopiedToken] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isImporting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isImporting, onClose]);

  if (!isOpen) return null;

  // Supported Employee Types
  const EMPLOYEE_TYPES = [
    { key: 'Full-Time', label: 'Full-Time (Regular)', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { key: 'Contract', label: 'Contract / Retainer', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
    { key: 'Intern', label: 'Intern / Trainee', badge: 'bg-purple-100 text-purple-800 border-purple-300' },
    { key: 'Part-Time', label: 'Part-Time Staff', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
    { key: 'Executive', label: 'Executive / Leadership', badge: 'bg-rose-100 text-rose-800 border-rose-300' },
    { key: 'Vendor', label: 'Vendor / Third-Party', badge: 'bg-slate-100 text-slate-800 border-slate-300' }
  ];

  // Quick Preset Handlers for Document Checklist
  const applyChecklistPreset = (presetName) => {
    const updated = { ...checklist };
    if (presetName === 'all') {
      Object.keys(updated).forEach(k => { updated[k].enabled = true; });
    } else if (presetName === 'clear') {
      Object.keys(updated).forEach(k => { updated[k].enabled = false; });
    } else if (presetName === 'standard') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'bankCheck', 'education', 'experience', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    } else if (presetName === 'comprehensive') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'bankCheck', 'uan', 'education', 'experience', 'salarySlips', 'criminalCheck', 'courtLitigation', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    } else if (presetName === 'intern') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'education', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    } else if (presetName === 'contract') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'bankCheck', 'addressProof', 'criminalCheck', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    }
    setChecklist(updated);
  };

  // 1. GENERATE & DOWNLOAD EXCEL TEMPLATE
  const handleDownloadTemplate = (format = 'xlsx') => {
    // Sheet 1: Sample Candidate Data for All Types of Employees
    const sampleData = [
      {
        'Full Name *': 'Rahul Sharma',
        'Email Address *': 'rahul.sharma@example.com',
        'Mobile Number *': '9876543210',
        'Employment Type *': 'Full-Time',
        'Designation *': 'Senior Software Engineer',
        'Department *': 'Engineering',
        'Employee ID / Staff Code': 'EMP-1001',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-10-01',
        'PAN Number': 'ABCDE1234F',
        'Aadhaar Number (12 Digits)': '234567890123',
        'Gender': 'Male',
        'Highest Qualification': 'B.Tech in Computer Science',
        'Prior Experience (Years)': '4.5',
        'Previous Company': 'Infosys Limited'
      },
      {
        'Full Name *': 'Priya Patel',
        'Email Address *': 'priya.patel@example.com',
        'Mobile Number *': '9823456781',
        'Employment Type *': 'Contract',
        'Designation *': 'UI/UX Product Designer',
        'Department *': 'Product Design',
        'Employee ID / Staff Code': 'CON-2001',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-09-25',
        'PAN Number': 'PRPPA5544K',
        'Aadhaar Number (12 Digits)': '345678901234',
        'Gender': 'Female',
        'Highest Qualification': 'Master of Design',
        'Prior Experience (Years)': '3.0',
        'Previous Company': 'Freelance / Agency'
      },
      {
        'Full Name *': 'Amit Kumar Verma',
        'Email Address *': 'amit.verma@example.com',
        'Mobile Number *': '9123456789',
        'Employment Type *': 'Intern',
        'Designation *': 'Data Science Trainee',
        'Department *': 'AI & Analytics',
        'Employee ID / Staff Code': 'INT-3001',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-10-05',
        'PAN Number': 'AMKPV8899Z',
        'Aadhaar Number (12 Digits)': '456789012345',
        'Gender': 'Male',
        'Highest Qualification': 'B.Sc Statistics (Final Year)',
        'Prior Experience (Years)': '0',
        'Previous Company': 'N/A'
      },
      {
        'Full Name *': 'Sunita Mehra',
        'Email Address *': 'sunita.mehra@example.com',
        'Mobile Number *': '9988776655',
        'Employment Type *': 'Part-Time',
        'Designation *': 'Corporate Legal Counsel',
        'Department *': 'Legal & Compliance',
        'Employee ID / Staff Code': 'PT-4001',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-10-10',
        'PAN Number': 'SUNMH3322L',
        'Aadhaar Number (12 Digits)': '567890123456',
        'Gender': 'Female',
        'Highest Qualification': 'LL.M Corporate Law',
        'Prior Experience (Years)': '8.0',
        'Previous Company': 'Mehra & Associates'
      },
      {
        'Full Name *': 'Vikramaditya Rao',
        'Email Address *': 'vikram.rao@example.com',
        'Mobile Number *': '9711223344',
        'Employment Type *': 'Executive',
        'Designation *': 'Vice President of Operations',
        'Department *': 'Leadership & Operations',
        'Employee ID / Staff Code': 'EXEC-5001',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-11-01',
        'PAN Number': 'VIKRA1122Q',
        'Aadhaar Number (12 Digits)': '678901234567',
        'Gender': 'Male',
        'Highest Qualification': 'MBA Operations (IIM)',
        'Prior Experience (Years)': '14.0',
        'Previous Company': 'Tata Consultancy Services'
      },
      {
        'Full Name *': 'Kavita Sundaram',
        'Email Address *': 'kavita.sundaram@example.com',
        'Mobile Number *': '9845012345',
        'Employment Type *': 'Vendor',
        'Designation *': 'IT Support Technician',
        'Department *': 'Facilities & IT Support',
        'Employee ID / Staff Code': 'VEN-6001',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-09-20',
        'PAN Number': 'KAVSU9988B',
        'Aadhaar Number (12 Digits)': '789012345678',
        'Gender': 'Female',
        'Highest Qualification': 'Diploma in Hardware & Networking',
        'Prior Experience (Years)': '2.5',
        'Previous Company': 'TeamLease Services'
      }
    ];

    // Sheet 2: Guidelines & Allowed Values Reference
    const guideData = [
      { 'Field Name': 'Full Name', 'Mandatory': 'YES', 'Allowed Values': 'Candidate legal name as per Aadhaar/PAN', 'Notes': 'Used on official BGV certificates' },
      { 'Field Name': 'Email Address', 'Mandatory': 'YES', 'Allowed Values': 'Valid email format (user@domain.com)', 'Notes': 'Onboarding link & welcome email sent here' },
      { 'Field Name': 'Mobile Number', 'Mandatory': 'YES', 'Allowed Values': '10-digit Indian Mobile Number', 'Notes': 'Used for SMS OTP, link dispatches & WhatsApp' },
      { 'Field Name': 'Employment Type', 'Mandatory': 'YES', 'Allowed Values': 'Full-Time | Contract | Intern | Part-Time | Executive | Vendor', 'Notes': 'Determines verification rigor & profile category' },
      { 'Field Name': 'Designation', 'Mandatory': 'YES', 'Allowed Values': 'Any valid job title', 'Notes': 'Displayed in candidate profile dossier' },
      { 'Field Name': 'Department', 'Mandatory': 'YES', 'Allowed Values': 'Engineering, Sales, Operations, HR, Finance, etc.', 'Notes': 'Used for organizational reporting' },
      { 'Field Name': 'Employee ID', 'Mandatory': 'NO', 'Allowed Values': 'Alphanumeric internal staff code', 'Notes': 'Auto-generated if left blank' },
      { 'Field Name': 'Proposed Joining Date', 'Mandatory': 'NO', 'Allowed Values': 'YYYY-MM-DD format (e.g. 2026-10-01)', 'Notes': 'Used to schedule verification deadlines' },
      { 'Field Name': 'PAN Number', 'Mandatory': 'NO', 'Allowed Values': '10-character PAN (e.g. ABCDE1234F)', 'Notes': 'Pre-fills candidate verification station' },
      { 'Field Name': 'Aadhaar Number', 'Mandatory': 'NO', 'Allowed Values': '12-digit UID (e.g. 234567890123)', 'Notes': 'Pre-fills candidate UIDAI OTP e-KYC' }
    ];

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(sampleData);
    const ws2 = XLSX.utils.json_to_sheet(guideData);

    ws1['!cols'] = [
      { wch: 22 }, { wch: 28 }, { wch: 16 }, { wch: 18 }, { wch: 28 },
      { wch: 22 }, { wch: 24 }, { wch: 26 }, { wch: 16 }, { wch: 22 },
      { wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 26 }
    ];

    ws2['!cols'] = [
      { wch: 22 }, { wch: 14 }, { wch: 45 }, { wch: 45 }
    ];

    XLSX.utils.book_append_sheet(wb, ws1, 'Employee_Import_Data');
    XLSX.utils.book_append_sheet(wb, ws2, 'Employment_Types_&_Guide');

    if (format === 'csv') {
      XLSX.writeFile(wb, 'Employee_Bulk_Import_Template.csv', { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, 'Employee_Bulk_Import_Template.xlsx', { bookType: 'xlsx' });
    }
    showToast(`📥 Bulk Import Template (${format.toUpperCase()}) downloaded successfully!`);
  };

  // 2. PARSE UPLOADED EXCEL / CSV FILE
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);
    setParseError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          setParseError('The uploaded file contains no data rows. Please download the template and fill in candidate records.');
          setIsParsing(false);
          return;
        }

        const normalized = rawJson.map((row, idx) => {
          const keys = Object.keys(row);
          const findVal = (terms) => {
            const matchedKey = keys.find(k => 
              terms.some(t => k.toLowerCase().replace(/[^a-z0-9]/g, '').includes(t.toLowerCase().replace(/[^a-z0-9]/g, '')))
            );
            return matchedKey ? String(row[matchedKey]).trim() : '';
          };

          const name = findVal(['fullname', 'candidatename', 'employeename', 'name']) || `Candidate #${idx + 1}`;
          const email = findVal(['emailaddress', 'email', 'candidateemail', 'mail']);
          let mobile = findVal(['mobilenumber', 'mobile', 'phonenumber', 'phone', 'contact', 'whatsapp']);
          mobile = mobile.replace(/[^0-9]/g, '');
          if (mobile.length > 10 && mobile.startsWith('91')) mobile = mobile.substring(2);

          let empTypeRaw = findVal(['employmenttype', 'employeetype', 'category', 'type', 'contracttype']) || 'Full-Time';
          let empType = 'Full-Time';
          const lowerType = empTypeRaw.toLowerCase();
          if (lowerType.includes('contract') || lowerType.includes('retainer')) empType = 'Contract';
          else if (lowerType.includes('intern') || lowerType.includes('trainee')) empType = 'Intern';
          else if (lowerType.includes('part') || lowerType.includes('freelance')) empType = 'Part-Time';
          else if (lowerType.includes('exec') || lowerType.includes('lead') || lowerType.includes('director') || lowerType.includes('vp')) empType = 'Executive';
          else if (lowerType.includes('vendor') || lowerType.includes('third')) empType = 'Vendor';

          const designation = findVal(['designation', 'jobrole', 'role', 'title', 'position']) || 'Associate';
          const dept = findVal(['department', 'dept', 'function', 'division']) || 'General';
          const empId = findVal(['employeeid', 'staffcode', 'empid', 'id']) || `${currentCompany?.code || 'COMP'}EMP${String(Date.now()).slice(-4)}${idx + 1}`;
          const doj = findVal(['joiningdate', 'doj', 'dateofjoining']) || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
          const pan = findVal(['pan', 'pannumber', 'pancard']).toUpperCase();
          const aadhaar = findVal(['aadhaar', 'aadhaarnumber', 'uid']).replace(/[^0-9]/g, '');
          const gender = findVal(['gender', 'sex']) || 'Male';
          const qualification = findVal(['qualification', 'highestqualification', 'education', 'degree']);
          const experience = findVal(['experience', 'priorexperience', 'workexperience']);
          const prevCompany = findVal(['previouscompany', 'lastcompany', 'employer']);

          const errors = [];
          if (!name || name.length < 2) errors.push('Name is required');
          if (!email || !email.includes('@') || !email.includes('.')) errors.push('Valid Email is required');
          if (!mobile || mobile.length !== 10) errors.push('10-digit Indian Mobile is required');

          return {
            rowId: idx + 1,
            name,
            email,
            mobile,
            employeeType: empType,
            designation,
            dept,
            empId,
            doj,
            pan,
            aadhaar,
            gender,
            qualification,
            experience,
            prevCompany,
            isValid: errors.length === 0,
            errors,
            isSelected: errors.length === 0
          };
        });

        setParsedRows(normalized);
        setIsParsing(false);
        showToast(`✅ Successfully parsed ${normalized.length} candidate rows from "${file.name}"!`);
      } catch (err) {
        console.error('File parsing error:', err);
        setParseError(`Failed to parse file: ${err.message || 'Corrupt or unsupported spreadsheet format.'}`);
        setIsParsing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const toggleRowSelection = (rowId) => {
    setParsedRows(prev => prev.map(r => r.rowId === rowId ? { ...r, isSelected: !r.isSelected } : r));
  };

  const toggleAllRows = (select) => {
    setParsedRows(prev => prev.map(r => r.isValid ? { ...r, isSelected: select } : r));
  };

  const removeRow = (rowId) => {
    setParsedRows(prev => prev.filter(r => r.rowId !== rowId));
  };

  const displayedRows = parsedRows.filter(r => {
    if (selectedEmployeeTypeFilter === 'ALL') return true;
    return r.employeeType === selectedEmployeeTypeFilter;
  });

  const validSelectedCount = parsedRows.filter(r => r.isValid && r.isSelected).length;
  const totalValidCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.filter(r => !r.isValid).length;

  const countsByType = EMPLOYEE_TYPES.reduce((acc, t) => {
    acc[t.key] = parsedRows.filter(r => r.employeeType === t.key).length;
    return acc;
  }, {});

  // 3. EXECUTE BULK IMPORT & DISPATCH LINKS
  const handleExecuteBulkImport = async () => {
    const candidatesToImport = parsedRows.filter(r => r.isValid && r.isSelected);
    if (candidatesToImport.length === 0) {
      showToast('⚠️ No valid candidates selected for import.');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    const activeChecklistKeys = Object.entries(checklist)
      .filter(([_, v]) => v.enabled)
      .map(([k, _]) => k);

    const createdResults = [];

    for (let i = 0; i < candidatesToImport.length; i++) {
      const row = candidatesToImport[i];
      const candidatePin = '1234';

      const verificationConfig = {};
      Object.entries(checklist).forEach(([k, v]) => {
        verificationConfig[k] = {
          enabled: v.enabled,
          mode: 'through_link',
          title: v.title
        };
      });

      const candidatePayload = {
        name: row.name,
        email: row.email,
        mobile: row.mobile,
        empId: row.empId,
        employeeNumber: row.empId,
        employeeCategory: row.employeeType.toLowerCase().replace(/[^a-z]/g, '_'),
        employeeType: row.employeeType,
        designation: row.designation,
        dept: row.dept,
        doj: row.doj,
        panNumber: row.pan,
        aadhaarNo: row.aadhaar,
        gender: row.gender,
        companyId: currentCompany?.id || 'COMP001',
        hrId: activeHr?.id || 'HR001',
        portalPassword: candidatePin,
        verificationConfig,
        verificationChecklist: activeChecklistKeys,
        hrCustomMessage: customHrMessage,
        status: autoSendLinks ? 'Link Sent' : 'Pending',
        isBulkImported: true,
        importBatchDate: new Date().toISOString()
      };

      try {
        const createdToken = await addCandidate(candidatePayload);
        const tokenString = (typeof createdToken === 'string' ? createdToken : createdToken?.token) || 
          `tok_${row.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(100 + Math.random() * 900)}`;

        createdResults.push({
          ...row,
          token: tokenString,
          portalPassword: candidatePin,
          linkUrl: `${window.location.origin}/employee?token=${tokenString}&mode=onboarding`,
          status: autoSendLinks ? 'Link Dispatched 🟢' : 'Profile Created 🟡'
        });
      } catch (err) {
        console.error('Error importing candidate:', row.name, err);
      }

      setImportProgress(Math.round(((i + 1) / candidatesToImport.length) * 100));
    }

    setImportedCandidates(createdResults);
    setIsImporting(false);
    setCurrentStep(3);
    showToast(`🎉 Bulk import completed! ${createdResults.length} employee profiles created & links generated.`);
    if (onImportComplete) onImportComplete(createdResults);
  };

  const handleDownloadBatchCredentials = () => {
    if (importedCandidates.length === 0) return;
    const exportData = importedCandidates.map(c => ({
      'Full Name': c.name,
      'Email Address': c.email,
      'Mobile Number': c.mobile,
      'Employment Type': c.employeeType,
      'Designation': c.designation,
      'Department': c.dept,
      'Employee ID': c.empId,
      'Candidate Token': c.token,
      'Portal Security PIN': c.portalPassword,
      'Direct Onboarding Link URL': c.linkUrl,
      'Dispatch Status': c.status,
      'Date Imported': new Date().toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = [
      { wch: 22 }, { wch: 28 }, { wch: 16 }, { wch: 18 }, { wch: 24 },
      { wch: 20 }, { wch: 16 }, { wch: 22 }, { wch: 14 }, { wch: 65 },
      { wch: 18 }, { wch: 16 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Imported_Candidates_Links');
    XLSX.writeFile(wb, `Candidate_Batch_Links_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('📥 Batch credentials & links spreadsheet downloaded!');
  };

  const handleCopyLink = (token, linkUrl) => {
    navigator.clipboard.writeText(linkUrl);
    setCopiedToken(token);
    showToast('📋 Direct Candidate Onboarding Link copied to clipboard!');
    setTimeout(() => setCopiedToken(null), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 flex justify-center items-start animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isImporting) onClose();
      }}
    >
      <div className="glass-panel w-full max-w-5xl p-4 sm:p-7 space-y-6 border-emerald-300 bg-white text-slate-900 shadow-2xl rounded-3xl my-auto animate-fadeIn max-h-[92vh] overflow-y-auto">
        
        {/* MODAL HEADER */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black shadow-lg">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Bulk Employee Profile Ingestion & Link Dispatch</h2>
                <span className="badge badge-emerald text-[10px] font-bold">ALL EMPLOYEE TYPES</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Download spreadsheet template, upload candidate batch (Full-Time, Contract, Intern, Executive), select document verification checklist & dispatch onboarding links.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            disabled={isImporting}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 font-bold flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* STEP PROGRESS TRACKER */}
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            disabled={isImporting || currentStep === 3}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              currentStep === 1 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                : currentStep > 1 
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                  : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">1</span>
            <span>1. Template & Excel Upload</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (parsedRows.length > 0 && validSelectedCount > 0) setCurrentStep(2);
              else showToast('⚠️ Please upload and select valid candidates first.');
            }}
            disabled={isImporting || parsedRows.length === 0 || currentStep === 3}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              currentStep === 2 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                : currentStep > 2 
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                  : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">2</span>
            <span>2. Document Checklist & Link Dispatch</span>
          </button>

          <div
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 select-none ${
              currentStep === 3 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">3</span>
            <span>3. Batch Summary & Token Registry</span>
          </div>
        </div>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* HERO */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-200 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Universal Employee Type Support</span>
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Import any mix of employee contracts in a single spreadsheet
                  </h3>
                  <p className="text-xs text-slate-600">
                    The template includes dedicated columns and sample pre-filled records for each employee category.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="btn btn-secondary text-xs py-2.5 px-4 font-black flex items-center gap-2 bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50 shadow-xs cursor-pointer"
                    title="Download pre-formatted Excel template with sample rows and guidelines"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Download Excel Template (.xlsx) 📥</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('csv')}
                    className="btn btn-secondary text-xs py-2.5 px-3 font-bold bg-white text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer"
                    title="Download CSV template format"
                  >
                    <span>CSV Format</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px]">
                <span className="font-bold text-slate-600">Supported Categories:</span>
                {EMPLOYEE_TYPES.map(t => (
                  <span key={t.key} className={`px-2.5 py-0.5 rounded-md font-bold border ${t.badge}`}>
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* DRAG & DROP UPLOAD BOX */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-8 rounded-3xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all cursor-pointer text-center space-y-3 group"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                {isParsing ? <RefreshCw className="w-7 h-7 animate-spin text-emerald-600" /> : <Upload className="w-7 h-7" />}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base">
                  {fileName ? `Selected: ${fileName}` : 'Click to Browse or Drag & Drop Excel Spreadsheet'}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Accepts standard Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
                </p>
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs">
                Browse Files from Device 📂
              </div>
            </div>

            {parseError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="flex-1 font-medium">{parseError}</div>
                <button 
                  type="button" 
                  onClick={() => setParseError(null)} 
                  className="font-bold text-rose-700 hover:text-rose-900"
                >
                  ✕
                </button>
              </div>
            )}

            {parsedRows.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-xs">Batch Overview:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                      {validSelectedCount} of {totalValidCount} Valid Candidates Selected
                    </span>
                    {invalidCount > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-black">
                        {invalidCount} Missing Fields / Invalid
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500">Filter Type:</span>
                    <select 
                      value={selectedEmployeeTypeFilter}
                      onChange={(e) => setSelectedEmployeeTypeFilter(e.target.value)}
                      className="form-select text-xs font-bold py-1 px-2.5 rounded-lg border-slate-300"
                    >
                      <option value="ALL">All Employee Types ({parsedRows.length})</option>
                      {EMPLOYEE_TYPES.map(t => (
                        <option key={t.key} value={t.key}>
                          {t.label} ({countsByType[t.key] || 0})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => toggleAllRows(validSelectedCount < totalValidCount)}
                      className="btn btn-secondary text-xs py-1 px-2.5 font-bold cursor-pointer"
                    >
                      {validSelectedCount < totalValidCount ? 'Select All Valid' : 'Deselect All'}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden overflow-x-auto shadow-2xs max-h-72">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 w-10 text-center">Select</th>
                        <th className="p-3">#</th>
                        <th className="p-3">Candidate Full Name</th>
                        <th className="p-3">Email & Contact</th>
                        <th className="p-3">Employee Type</th>
                        <th className="p-3">Designation & Dept</th>
                        <th className="p-3">Identity Proofs</th>
                        <th className="p-3">Validation</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {displayedRows.map(r => (
                        <tr key={r.rowId} className={`hover:bg-slate-50/80 ${!r.isValid ? 'bg-rose-50/40' : ''}`}>
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox" 
                              disabled={!r.isValid}
                              checked={r.isSelected}
                              onChange={() => toggleRowSelection(r.rowId)}
                              className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-400">{r.rowId}</td>
                          <td className="p-3 font-extrabold text-slate-900">
                            <div>{r.name}</div>
                            <span className="text-[10px] font-mono text-slate-500">{r.empId}</span>
                          </td>
                          <td className="p-3 font-medium text-slate-700">
                            <div>{r.email || <span className="text-rose-500 font-bold">Missing Email</span>}</div>
                            <div className="font-mono text-[11px] text-slate-500">{r.mobile || <span className="text-rose-500 font-bold">Missing Mobile</span>}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] border ${
                              EMPLOYEE_TYPES.find(t => t.key === r.employeeType)?.badge || 'bg-slate-100 text-slate-800'
                            }`}>
                              {r.employeeType}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{r.designation}</div>
                            <div className="text-[10px] text-slate-500">{r.dept}</div>
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            {r.pan && <div className="text-emerald-700 font-bold">PAN: {r.pan}</div>}
                            {r.aadhaar && <div className="text-indigo-700 font-bold">UID: {r.aadhaar.slice(0, 4)}XXXX{r.aadhaar.slice(-4)}</div>}
                            {!r.pan && !r.aadhaar && <span className="text-slate-400 italic">Self-Fill at Link</span>}
                          </td>
                          <td className="p-3">
                            {r.isValid ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Valid</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center gap-1 w-fit" title={r.errors.join(', ')}>
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>{r.errors[0]}</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeRow(r.rowId)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Remove row from batch"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn btn-secondary text-xs font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={validSelectedCount === 0}
                    className="btn btn-hrexecutive text-xs py-2.5 px-6 flex items-center gap-2 font-black shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Proceed to Document Checklist & Links ({validSelectedCount} Candidates) →</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn text-xs">
            
            {/* CHECKLIST */}
            <div className="p-5 rounded-2xl bg-white border-2 border-indigo-200 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-base font-black text-slate-900">Documents Verification Checklist for this Batch</h3>
                  </div>
                  <p className="text-slate-600 text-xs">
                    Select which credentials and physical documents candidates must submit and verify through their link.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-500 text-[11px]">Presets:</span>
                  <button
                    type="button"
                    onClick={() => applyChecklistPreset('standard')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold border border-indigo-200 cursor-pointer text-[11px]"
                  >
                    Standard (5 Checks)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyChecklistPreset('comprehensive')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 cursor-pointer text-[11px]"
                  >
                    Comprehensive (10 Checks)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyChecklistPreset('intern')}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold border border-purple-200 cursor-pointer text-[11px]"
                  >
                    Intern Pack
                  </button>
                  <button
                    type="button"
                    onClick={() => applyChecklistPreset('contract')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold border border-blue-200 cursor-pointer text-[11px]"
                  >
                    Contractor Pack
                  </button>
                  <button
                    type="button"
                    onClick={() => applyChecklistPreset('all')}
                    className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer text-[11px]"
                  >
                    All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(checklist).map(([k, item]) => {
                  const isChecked = item.enabled;
                  return (
                    <label 
                      key={k}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-bold shadow-2xs' 
                          : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => {
                          setChecklist(prev => ({
                            ...prev,
                            [k]: { ...prev[k], enabled: !prev[k].enabled }
                          }));
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                      />
                      <div className="space-y-0.5 flex-1">
                        <div className="text-xs leading-tight">{item.title}</div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                          [{item.category}]
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* LINK SENDING OPTIONS */}
            <div className="p-5 rounded-2xl bg-white border-2 border-emerald-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-black text-slate-900">Link Sending & Dispatch Option</h3>
                </div>
                <label className="flex items-center gap-2 cursor-pointer font-extrabold text-slate-900 text-xs bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <input 
                    type="checkbox" 
                    checked={autoSendLinks}
                    onChange={(e) => setAutoSendLinks(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Dispatch Verification Links Immediately</span>
                </label>
              </div>

              {autoSendLinks && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${
                      dispatchChannels.email ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={dispatchChannels.email}
                        onChange={(e) => setDispatchChannels({ ...dispatchChannels, email: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span>Official HR SMTP Email</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${
                      dispatchChannels.sms ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={dispatchChannels.sms}
                        onChange={(e) => setDispatchChannels({ ...dispatchChannels, sms: e.target.checked })}
                        className="rounded text-sky-600"
                      />
                      <Smartphone className="w-4 h-4 text-sky-600" />
                      <span>Automated SMS Alert</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${
                      dispatchChannels.whatsapp ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={dispatchChannels.whatsapp}
                        onChange={(e) => setDispatchChannels({ ...dispatchChannels, whatsapp: e.target.checked })}
                        className="rounded text-emerald-600"
                      />
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp Link</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Custom HR Instructions for Candidates (Sent with Link):</label>
                    <textarea 
                      rows={2}
                      value={customHrMessage}
                      onChange={(e) => setCustomHrMessage(e.target.value)}
                      className="form-input text-xs"
                      placeholder="Enter custom instructions or deadline for the candidate..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PROGRESS */}
            {isImporting && (
              <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3 text-center animate-pulse">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <h4 className="font-black text-emerald-950 text-base">
                  Creating Candidate Records & Generating Secure Tokens ({importProgress}%)
                </h4>
                <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-3 transition-all duration-300 rounded-full" 
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
                <p className="text-xs text-emerald-800 font-medium">
                  Setting up verification checklists and dispatching onboarding links...
                </p>
              </div>
            )}

            {/* ACTION BAR */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setCurrentStep(1)} 
                disabled={isImporting}
                className="btn btn-secondary text-xs font-bold cursor-pointer"
              >
                ← Back to Spreadsheet Review
              </button>

              <button
                type="button"
                onClick={handleExecuteBulkImport}
                disabled={isImporting || validSelectedCount === 0}
                className="btn btn-hrexecutive text-xs py-2.5 px-6 flex items-center gap-2 font-black shadow-lg cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Import {validSelectedCount} Candidates & Dispatch Links 🚀</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn text-xs">
            
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white space-y-3 text-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black">
                {importedCandidates.length} Employee Profiles Successfully Created!
              </h3>
              <p className="text-emerald-100 text-xs max-w-xl mx-auto font-medium">
                All candidates have been ingested into the system with their configured document verification checklists. Unique magic tokens have been generated and recorded.
              </p>
              
              <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadBatchCredentials}
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Download Batch Links Sheet (.xlsx) 📥</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Generated Candidate Verification Links ({importedCandidates.length})</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-bold">
                  Click link button to copy URL
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 overflow-hidden overflow-x-auto shadow-2xs max-h-80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="p-3">Candidate</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Token & PIN</th>
                      <th className="p-3">Onboarding Link URL</th>
                      <th className="p-3 text-center">Copy Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {importedCandidates.map(c => (
                      <tr key={c.token} className="hover:bg-slate-50/80">
                        <td className="p-3 font-extrabold text-slate-900">
                          <div>{c.name}</div>
                          <div className="text-[10px] font-mono font-normal text-slate-500">{c.email} • {c.mobile}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                            EMPLOYEE_TYPES.find(t => t.key === c.employeeType)?.badge || 'bg-slate-100 text-slate-800'
                          }`}>
                            {c.employeeType}
                          </span>
                        </td>
                        <td className="p-3 font-mono">
                          <div className="text-emerald-700 font-bold">{c.token}</div>
                          <div className="text-[10px] text-slate-400">PIN: {c.portalPassword}</div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600 max-w-xs truncate" title={c.linkUrl}>
                          {c.linkUrl}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(c.token, c.linkUrl)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 mx-auto transition-all cursor-pointer ${
                              copiedToken === c.token 
                                ? 'bg-emerald-600 text-white shadow-xs' 
                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                            }`}
                          >
                            {copiedToken === c.token ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-hrexecutive text-xs py-2.5 px-6 font-black shadow-md cursor-pointer"
              >
                <span>Done & Return to Candidate List ✓</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
