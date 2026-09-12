import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  Sliders,
  Laptop,
  Factory,
  Landmark,
  HeartPulse,
  Truck,
  Layers,
  Info,
  Search
} from 'lucide-react';

// 🏢 SECTOR SPECIFIC TEMPLATE METADATA
const SECTOR_TEMPLATES = [
  {
    id: 'master',
    title: 'Master Comprehensive Template',
    shortTitle: '📑 Master Multi-Sector',
    badge: '35+ Fields • All Sectors',
    desc: 'Multi-worksheet workbook with all 7-section joining form fields for any employee type',
    icon: Layers,
    color: 'border-indigo-300 bg-indigo-50/70 text-indigo-900',
    headerColor: 'bg-indigo-600 text-white'
  },
  {
    id: 'it_engineering',
    title: 'IT & Software Engineering',
    shortTitle: '💻 IT & Software',
    badge: 'Tech Stack & Degree',
    desc: 'Software engineers, cloud architects, DevOps, QA engineers with tech stack & UAN history',
    icon: Laptop,
    color: 'border-blue-300 bg-blue-50/70 text-blue-900',
    headerColor: 'bg-blue-600 text-white'
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing & Industrial Plant',
    shortTitle: '🏭 Manufacturing & Plant',
    badge: 'Plant, Shift & Trade',
    desc: 'Plant operators, machinists, fitters, safety training, shift types & ESIC insurance',
    icon: Factory,
    color: 'border-amber-300 bg-amber-50/70 text-amber-900',
    headerColor: 'bg-amber-600 text-white'
  },
  {
    id: 'bfsi',
    title: 'Banking, Financial Services & Insurance',
    shortTitle: '🏦 BFSI & Finance',
    badge: 'NISM & CIBIL Check',
    desc: 'Credit risk analysts, branch managers, accountants with regulatory certifications',
    icon: Landmark,
    color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
    headerColor: 'bg-emerald-600 text-white'
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Clinical Pharmaceuticals',
    shortTitle: '🏥 Healthcare & Pharma',
    badge: 'Medical Council Reg No',
    desc: 'ICU nurses, resident medical officers, clinical pharmacists with State Council registration',
    icon: HeartPulse,
    color: 'border-rose-300 bg-rose-50/70 text-rose-900',
    headerColor: 'bg-rose-600 text-white'
  },
  {
    id: 'logistics',
    title: 'Logistics, Retail & Fleet Delivery',
    shortTitle: '🚚 Logistics & Delivery',
    badge: 'Driving License & Vehicle',
    desc: 'Commercial fleet drivers, delivery executives, warehouse leads with MoRTH DL verification',
    icon: Truck,
    color: 'border-cyan-300 bg-cyan-50/70 text-cyan-900',
    headerColor: 'bg-cyan-600 text-white'
  }
];

export const BulkEmployeeImportModal = ({ 
  isOpen, 
  onClose, 
  activeHr, 
  currentCompany,
  onImportComplete 
}) => {
  const { 
    addCandidate, 
    bulkAddCandidates, 
    showToast, 
    companies, 
    currentUser, 
    hrUsers, 
    candidates 
  } = useApp();

  const targetCompany = currentCompany || (companies && (
    companies.find(c => c.id === currentUser?.companyId || c.code === currentUser?.companyCode || c.name === currentUser?.companyName) ||
    companies[0]
  )) || { id: 'comp-joy', name: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED' };

  const targetCompanyId = targetCompany.id || currentUser?.companyId || 'comp-joy';
  const targetCompanyName = targetCompany.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED';
  const targetHrId = activeHr?.id || currentUser?.id || (hrUsers && hrUsers[0]?.id) || 'HR001';

  // Step 1: Upload & Data | Step 2: Verification Checklist & Dispatch | Step 3: Success Summary
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Mode, setStep1Mode] = useState('upload'); // 'upload' | 'templates'
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [selectedEmployeeTypeFilter, setSelectedEmployeeTypeFilter] = useState('ALL');
  const [selectedSectorTemplate, setSelectedSectorTemplate] = useState('master');
  
  // Real-Time Progress & Import Status Message State
  const [importStatusMessage, setImportStatusMessage] = useState('');
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

  // Body scroll lock & Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isImporting) {
        if (typeof onClose === 'function') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
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
    } else if (presetName === 'it_tech') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'bankCheck', 'uan', 'education', 'experience', 'salarySlips', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    } else if (presetName === 'manufacturing') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'bankCheck', 'uan', 'addressProof', 'criminalCheck', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    } else if (presetName === 'logistics') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'bankCheck', 'drivingLicense', 'criminalCheck', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    } else if (presetName === 'bfsi') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'bankCheck', 'uan', 'education', 'experience', 'criminalCheck', 'courtLitigation', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    } else if (presetName === 'healthcare') {
      Object.keys(updated).forEach(k => {
        updated[k].enabled = ['aadhaar', 'pan', 'bankCheck', 'education', 'experience', 'criminalCheck', 'specimenSignature', 'dpdpConsent'].includes(k);
      });
    }
    setChecklist(updated);
  };

  // 1. GENERATE & DOWNLOAD COMPREHENSIVE SECTOR TEMPLATES (35+ COLUMNS)
  const handleDownloadTemplate = (sector = selectedSectorTemplate, format = 'xlsx') => {
    // 💻 IT & Engineering Data Set
    const itSampleData = [
      {
        'Full Name *': 'Rahul Sharma',
        'Father / Spouse Name': 'Suresh Sharma',
        'Mother Name': 'Kanta Sharma',
        'Date of Birth (YYYY-MM-DD)': '1997-04-12',
        'Age': '29',
        'Gender': 'Male',
        'Blood Group': 'B+',
        'Marital Status': 'Single',
        'Mother Tongue': 'Hindi',
        'Official Email *': 'rahul.sharma@example.com',
        'Mobile Number (10 Digits) *': '9876543210',
        'Alternate / WhatsApp Number': '9876543211',
        'Emergency Contact Name': 'Suresh Sharma',
        'Emergency Contact Mobile': '9876543212',
        'Emergency Contact Relationship': 'Father',
        'Permanent Address Line': '#104, Green Glen Layout, Bellandur',
        'Permanent City': 'Bengaluru',
        'Permanent State': 'Karnataka',
        'Permanent PIN Code': '560103',
        'Present Address Line': '#104, Green Glen Layout, Bellandur',
        'Present City': 'Bengaluru',
        'Present State': 'Karnataka',
        'Present PIN Code': '560103',
        'Employee ID / Staff Code': 'IT-1001',
        'Designation *': 'Senior Software Engineer',
        'Department *': 'Engineering & Software Architecture',
        'Employment Type *': 'Full-Time',
        'Work Location': 'Bengaluru Tech Park (HQ)',
        'Work Shift': 'General (09:30 - 18:30)',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-10-01',
        'Offered Annual CTC (INR)': '2400000',
        'Primary Tech Stack / Skills': 'React JS, Node.js, Python, PostgreSQL, AWS',
        'Highest Degree': 'B.Tech in Computer Science',
        'Specialization / Major': 'Computer Science & Engineering',
        'University / College': 'VTU Belagavi',
        'Year of Passing': '2019',
        'Percentage / CGPA': '84.5%',
        'Total Experience (Years)': '6.0',
        'Previous Company Name': 'Infosys Limited',
        'Previous Designation': 'Software Engineer',
        'Previous Relieving Date (YYYY-MM-DD)': '2026-09-15',
        'Last Drawn Annual CTC': '1800000',
        'PAN Card Number (10 Digits)': 'ABCDE1234F',
        'Aadhaar Number (12 Digits)': '234567890123',
        'EPFO UAN Number (12 Digits)': '101298450123',
        'Bank Account Holder Name': 'Rahul Sharma',
        'Bank Name': 'HDFC Bank',
        'Account Number': '50100234129845',
        'IFSC Code': 'HDFC0000128',
        'Branch Name': 'Koramangala 4th Block'
      },
      {
        'Full Name *': 'Priya Patel',
        'Father / Spouse Name': 'Ramesh Patel',
        'Mother Name': 'Geeta Patel',
        'Date of Birth (YYYY-MM-DD)': '1999-08-25',
        'Age': '27',
        'Gender': 'Female',
        'Blood Group': 'O+',
        'Marital Status': 'Single',
        'Mother Tongue': 'Gujarati',
        'Official Email *': 'priya.patel@example.com',
        'Mobile Number (10 Digits) *': '9823456781',
        'Alternate / WhatsApp Number': '9823456782',
        'Emergency Contact Name': 'Ramesh Patel',
        'Emergency Contact Mobile': '9823456783',
        'Emergency Contact Relationship': 'Father',
        'Permanent Address Line': 'Flat 302, Palm Meadows, Hinjewadi',
        'Permanent City': 'Pune',
        'Permanent State': 'Maharashtra',
        'Permanent PIN Code': '411057',
        'Present Address Line': 'Flat 302, Palm Meadows, Hinjewadi',
        'Present City': 'Pune',
        'Present State': 'Maharashtra',
        'Present PIN Code': '411057',
        'Employee ID / Staff Code': 'IT-1002',
        'Designation *': 'Full Stack Developer',
        'Department *': 'Engineering & Software Architecture',
        'Employment Type *': 'Full-Time',
        'Work Location': 'Pune Innovation Hub',
        'Work Shift': 'General',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-09-25',
        'Offered Annual CTC (INR)': '1600000',
        'Primary Tech Stack / Skills': 'Java, Spring Boot, Angular, Docker',
        'Highest Degree': 'B.E. Information Technology',
        'Specialization / Major': 'Information Technology',
        'University / College': 'Savitribai Phule Pune University',
        'Year of Passing': '2020',
        'Percentage / CGPA': '81.2%',
        'Total Experience (Years)': '4.5',
        'Previous Company Name': 'Wipro Limited',
        'Previous Designation': 'Associate Consultant',
        'Previous Relieving Date (YYYY-MM-DD)': '2026-09-20',
        'Last Drawn Annual CTC': '1150000',
        'PAN Card Number (10 Digits)': 'PRPPA5544K',
        'Aadhaar Number (12 Digits)': '345678901234',
        'EPFO UAN Number (12 Digits)': '101456789012',
        'Bank Account Holder Name': 'Priya Patel',
        'Bank Name': 'ICICI Bank',
        'Account Number': '000401589234',
        'IFSC Code': 'ICIC0000004',
        'Branch Name': 'Hinjewadi Phase 1'
      }
    ];

    // 🏭 Manufacturing & Plant Data Set
    const mfgSampleData = [
      {
        'Full Name *': 'Murugan Subramani',
        'Father / Spouse Name': 'Subramani K',
        'Mother Name': 'Lakshmi S',
        'Date of Birth (YYYY-MM-DD)': '1994-03-10',
        'Age': '32',
        'Gender': 'Male',
        'Blood Group': 'A+',
        'Marital Status': 'Married',
        'Mother Tongue': 'Tamil',
        'Official Email *': 'murugan.s@example.com',
        'Mobile Number (10 Digits) *': '9841234567',
        'Alternate / WhatsApp Number': '9841234568',
        'Emergency Contact Name': 'Subramani K',
        'Emergency Contact Mobile': '9841234569',
        'Emergency Contact Relationship': 'Father',
        'Permanent Address Line': '12, Mill Street, Sriperumbudur',
        'Permanent City': 'Kanchipuram',
        'Permanent State': 'Tamil Nadu',
        'Permanent PIN Code': '602105',
        'Present Address Line': '12, Mill Street, Sriperumbudur',
        'Present City': 'Kanchipuram',
        'Present State': 'Tamil Nadu',
        'Present PIN Code': '602105',
        'Employee ID / Staff Code': 'MFG-2001',
        'Designation *': 'CNC Machine Programmer & Operator',
        'Department *': 'Manufacturing, Plant & Assembly',
        'Employment Type *': 'Full-Time',
        'Plant / Factory Location *': 'Sriperumbudur Assembly Plant Unit 2',
        'Work Shift *': 'Shift A (06:00 - 14:00)',
        'Trade / ITI / Skill Certification': 'ITI Machinist / CNC Programming (Fanuc/Siemens)',
        'Safety Training / PPE Clearance': 'Certified (Factory Act 1948 Compliance)',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-09-25',
        'Offered Monthly / Annual CTC': '480000',
        'Highest Degree': 'ITI Machinist Trade Certificate',
        'Specialization / Major': 'Mechanical Machining',
        'Trade Institute / ITI College': 'Govt ITI Guindy',
        'Year of Passing': '2014',
        'Percentage / CGPA': '78.5%',
        'Total Experience (Years)': '8.0',
        'Previous Plant / Employer': 'Sundram Fasteners Ltd',
        'Previous Designation': 'Machinist Grade 2',
        'Previous Relieving Date (YYYY-MM-DD)': '2026-09-10',
        'Last Drawn Annual CTC': '380000',
        'PAN Card Number (10 Digits)': 'MURGS4411M',
        'Aadhaar Number (12 Digits)': '789012345678',
        'ESIC IP Number': '5198234129',
        'EPFO UAN Number': '100987654321',
        'Bank Account Holder Name': 'Murugan Subramani',
        'Bank Name': 'State Bank of India',
        'Account Number': '20194819201',
        'IFSC Code': 'SBIN0001234',
        'Branch Name': 'Sriperumbudur Main'
      },
      {
        'Full Name *': 'Ganesh Vasant Patil',
        'Father / Spouse Name': 'Vasant Patil',
        'Mother Name': 'Sunita Patil',
        'Date of Birth (YYYY-MM-DD)': '1996-11-14',
        'Age': '29',
        'Gender': 'Male',
        'Blood Group': 'O+',
        'Marital Status': 'Married',
        'Mother Tongue': 'Marathi',
        'Official Email *': 'ganesh.patil@example.com',
        'Mobile Number (10 Digits) *': '9765432190',
        'Alternate / WhatsApp Number': '9765432191',
        'Emergency Contact Name': 'Vasant Patil',
        'Emergency Contact Mobile': '9765432192',
        'Emergency Contact Relationship': 'Father',
        'Permanent Address Line': 'Plot 45, MIDC Industrial Area, Bhosari',
        'Permanent City': 'Pune',
        'Permanent State': 'Maharashtra',
        'Permanent PIN Code': '411026',
        'Present Address Line': 'Plot 45, MIDC Industrial Area, Bhosari',
        'Present City': 'Pune',
        'Present State': 'Maharashtra',
        'Present PIN Code': '411026',
        'Employee ID / Staff Code': 'MFG-2002',
        'Designation *': 'Plant Operations Supervisor',
        'Department *': 'Manufacturing, Plant & Assembly',
        'Employment Type *': 'Full-Time',
        'Plant / Factory Location *': 'Bhosari MIDC Manufacturing Hub',
        'Work Shift *': 'General Shift (08:30 - 17:30)',
        'Trade / ITI / Skill Certification': 'Diploma in Mechanical Engineering',
        'Safety Training / PPE Clearance': 'Certified Six Sigma Green Belt',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-10-01',
        'Offered Monthly / Annual CTC': '650000',
        'Highest Degree': 'Diploma in Mechanical Engineering',
        'Specialization / Major': 'Mechanical & Production',
        'Trade Institute / ITI College': 'Government Polytechnic Pune',
        'Year of Passing': '2016',
        'Percentage / CGPA': '82.0%',
        'Total Experience (Years)': '7.5',
        'Previous Plant / Employer': 'Bharat Forge Limited',
        'Previous Designation': 'Production Line Lead',
        'Previous Relieving Date (YYYY-MM-DD)': '2026-09-18',
        'Last Drawn Annual CTC': '520000',
        'PAN Card Number (10 Digits)': 'GANPT8822B',
        'Aadhaar Number (12 Digits)': '890123456789',
        'ESIC IP Number': '3198451290',
        'EPFO UAN Number': '101876543210',
        'Bank Account Holder Name': 'Ganesh Vasant Patil',
        'Bank Name': 'Bank of Baroda',
        'Account Number': '04810100019283',
        'IFSC Code': 'BARB0BHOSAR',
        'Branch Name': 'Bhosari Pune'
      }
    ];

    // 🏦 BFSI Data Set
    const bfsiSampleData = [
      {
        'Full Name *': 'Ananya Sengupta',
        'Father / Spouse Name': 'Subir Sengupta',
        'Mother Name': 'Malati Sengupta',
        'Date of Birth (YYYY-MM-DD)': '1995-07-18',
        'Age': '31',
        'Gender': 'Female',
        'Blood Group': 'B+',
        'Marital Status': 'Single',
        'Mother Tongue': 'Bengali',
        'Official Email *': 'ananya.s@example.com',
        'Mobile Number (10 Digits) *': '9830123456',
        'Alternate / WhatsApp Number': '9830123457',
        'Emergency Contact Name': 'Subir Sengupta',
        'Emergency Contact Mobile': '9830123458',
        'Emergency Contact Relationship': 'Father',
        'Permanent Address Line': 'Tower 4, Flat 12B, BKC Heights',
        'Permanent City': 'Mumbai',
        'Permanent State': 'Maharashtra',
        'Permanent PIN Code': '400051',
        'Present Address Line': 'Tower 4, Flat 12B, BKC Heights',
        'Present City': 'Mumbai',
        'Present State': 'Maharashtra',
        'Present PIN Code': '400051',
        'Employee ID / Staff Code': 'BFSI-3001',
        'Designation *': 'Senior Credit Risk Analyst',
        'Department *': 'Risk Management & Underwriting',
        'Employment Type *': 'Full-Time',
        'Branch / Regional Hub': 'Bandra Kurla Complex (BKC) National Hub',
        'Work Shift': 'Corporate General',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-10-01',
        'Offered Annual CTC (INR)': '1850000',
        'Regulatory Certifications': 'NISM Series VIII / CFA Level 2',
        'CIBIL Clearance Declaration': 'Cleared (Score: 812, Zero Default)',
        'Highest Degree': 'MBA in Finance',
        'Specialization / Major': 'Banking & Financial Markets',
        'University / College': 'NMIMS Mumbai',
        'Year of Passing': '2019',
        'Percentage / CGPA': '8.6 CGPA',
        'Total Experience (Years)': '5.5',
        'Previous Company Name': 'Axis Bank Limited',
        'Previous Designation': 'Assistant Credit Manager',
        'Previous Relieving Date (YYYY-MM-DD)': '2026-09-15',
        'Last Drawn Annual CTC': '1400000',
        'PAN Card Number (10 Digits)': 'ANASG9911K',
        'Aadhaar Number (12 Digits)': '901234567890',
        'EPFO UAN Number (12 Digits)': '101123456789',
        'Bank Account Holder Name': 'Ananya Sengupta',
        'Bank Name': 'HDFC Bank',
        'Account Number': '00600159823412',
        'IFSC Code': 'HDFC0000060',
        'Branch Name': 'Fort Branch Mumbai'
      }
    ];

    // 🏥 Healthcare Data Set
    const healthSampleData = [
      {
        'Full Name *': 'Sister Mary Kurian',
        'Father / Spouse Name': 'Thomas Kurian',
        'Mother Name': 'Annamma Kurian',
        'Date of Birth (YYYY-MM-DD)': '1993-05-22',
        'Age': '33',
        'Gender': 'Female',
        'Blood Group': 'AB+',
        'Marital Status': 'Married',
        'Mother Tongue': 'Malayalam',
        'Official Email *': 'mary.kurian@example.com',
        'Mobile Number (10 Digits) *': '9447123456',
        'Alternate / WhatsApp Number': '9447123457',
        'Emergency Contact Name': 'Thomas Kurian',
        'Emergency Contact Mobile': '9447123458',
        'Emergency Contact Relationship': 'Spouse',
        'Permanent Address Line': 'House 14, Greams Road, Thousand Lights',
        'Permanent City': 'Chennai',
        'Permanent State': 'Tamil Nadu',
        'Permanent PIN Code': '600006',
        'Present Address Line': 'House 14, Greams Road, Thousand Lights',
        'Present City': 'Chennai',
        'Present State': 'Tamil Nadu',
        'Present PIN Code': '600006',
        'Employee ID / Staff Code': 'HLTH-4001',
        'Designation *': 'Senior ICU Staff Nurse',
        'Department *': 'Critical Care Unit (ICU)',
        'Employment Type *': 'Full-Time',
        'Hospital / Facility Unit': 'Chennai Regional Medical Center',
        'Work Shift': 'Rotational Shift (Day / Night)',
        'Medical Council Registration No': 'Tamil Nadu Nursing Council: TNC-88291',
        'Medical Degree / Specialization': 'B.Sc Nursing (Critical Care)',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-09-28',
        'Offered Annual CTC (INR)': '550000',
        'Highest Degree': 'B.Sc in Nursing',
        'University / College': 'The Tamil Nadu Dr. M.G.R. Medical University',
        'Year of Passing': '2015',
        'Percentage / CGPA': '76.4%',
        'Total Experience (Years)': '7.0',
        'Previous Company Name': 'Apollo Hospitals Enterprises',
        'Previous Designation': 'Staff Nurse Grade 1',
        'Previous Relieving Date (YYYY-MM-DD)': '2026-09-12',
        'Last Drawn Annual CTC': '450000',
        'PAN Card Number (10 Digits)': 'MARYK3344P',
        'Aadhaar Number (12 Digits)': '123456789012',
        'ESIC IP Number': '5194819201',
        'EPFO UAN Number (12 Digits)': '100456123789',
        'Bank Account Holder Name': 'Sister Mary Kurian',
        'Bank Name': 'Canara Bank',
        'Account Number': '10451010029384',
        'IFSC Code': 'CNRB0001045',
        'Branch Name': 'Thousand Lights Chennai'
      }
    ];

    // 🚚 Logistics Data Set
    const logSampleData = [
      {
        'Full Name *': 'Rajendra Prasad Yadav',
        'Father / Spouse Name': 'Ramdev Yadav',
        'Mother Name': 'Phoolwati Yadav',
        'Date of Birth (YYYY-MM-DD)': '1991-09-15',
        'Age': '35',
        'Gender': 'Male',
        'Blood Group': 'O+',
        'Marital Status': 'Married',
        'Mother Tongue': 'Hindi',
        'Official Email *': 'rajendra.yadav@example.com',
        'Mobile Number (10 Digits) *': '9890123456',
        'Alternate / WhatsApp Number': '9890123457',
        'Emergency Contact Name': 'Ramdev Yadav',
        'Emergency Contact Mobile': '9890123458',
        'Emergency Contact Relationship': 'Father',
        'Permanent Address Line': 'Village Post Sarai, Azamgarh',
        'Permanent City': 'Azamgarh',
        'Permanent State': 'Uttar Pradesh',
        'Permanent PIN Code': '276001',
        'Present Address Line': 'Room 12, Chawl 4, Bhiwandi Logistics Park',
        'Present City': 'Thane',
        'Present State': 'Maharashtra',
        'Present PIN Code': '421302',
        'Employee ID / Staff Code': 'LOG-5001',
        'Designation *': 'Commercial Fleet Driver (Heavy Vehicles)',
        'Department *': 'Logistics, Warehousing & Fleet Operations',
        'Employment Type *': 'Full-Time',
        'Delivery Hub / Warehouse Depot': 'Bhiwandi Central Fulfillment Depot',
        'Work Shift': 'Night Line-Haul Shift',
        'Commercial Driving License Number': 'MH0420150009812',
        'DL Expiry Date (YYYY-MM-DD)': '2032-05-18',
        'Vehicle Category': 'Heavy Commercial Vehicle (HCV) + Transport Badge',
        'Proposed Joining Date (YYYY-MM-DD)': '2026-09-22',
        'Offered Annual CTC (INR)': '420000',
        'Highest Degree': 'Higher Secondary (10+2)',
        'Trade / Driving Academy': 'Govt Heavy Vehicle Driving Training Institute',
        'Year of Passing': '2009',
        'Total Experience (Years)': '10.0',
        'Previous Company Name': 'Delhivery Limited',
        'Previous Designation': 'Line-Haul Fleet Captain',
        'Previous Relieving Date (YYYY-MM-DD)': '2026-09-10',
        'Last Drawn Annual CTC': '360000',
        'PAN Card Number (10 Digits)': 'RAJPR5522D',
        'Aadhaar Number (12 Digits)': '456789012345',
        'ESIC IP Number': '3184910291',
        'EPFO UAN Number (12 Digits)': '100876543987',
        'Bank Account Holder Name': 'Rajendra Prasad Yadav',
        'Bank Name': 'Punjab National Bank',
        'Account Number': '0123000100987654',
        'IFSC Code': 'PUNB0012300',
        'Branch Name': 'Bhiwandi Branch'
      }
    ];

    // 📑 Guidelines Sheet Data
    const guideData = [
      { 'Field Name': 'Full Name', 'Mandatory': 'YES', 'Section': '1. Personal Information', 'Allowed Values': 'Legal candidate name as per Aadhaar / PAN', 'Notes': 'Used on official BGV certificates' },
      { 'Field Name': 'Official Email Address', 'Mandatory': 'EITHER EMAIL OR MOBILE', 'Section': '2. Contact Details', 'Allowed Values': 'Valid email address format (user@domain.com)', 'Notes': 'Candidate receives login credentials & verification link' },
      { 'Field Name': 'Mobile Number', 'Mandatory': 'EITHER EMAIL OR MOBILE', 'Section': '2. Contact Details', 'Allowed Values': '10-digit Indian mobile number', 'Notes': 'Used for SMS OTP, link dispatches & WhatsApp' },
      { 'Field Name': 'Employment Type', 'Mandatory': 'YES', 'Section': '4. Employment Details', 'Allowed Values': 'Full-Time | Contract | Intern | Part-Time | Executive | Vendor', 'Notes': 'Controls profile classification in Master Registry' },
      { 'Field Name': 'Designation', 'Mandatory': 'YES', 'Section': '4. Employment Details', 'Allowed Values': 'Any corporate or plant job title', 'Notes': 'Printed on official candidate TrueProfile dossier' },
      { 'Field Name': 'Department', 'Mandatory': 'YES', 'Section': '4. Employment Details', 'Allowed Values': 'Engineering, Plant, BFSI, Healthcare, Logistics, etc.', 'Notes': 'Used for organizational reporting' },
      { 'Field Name': 'Date of Birth', 'Mandatory': 'NO', 'Section': '1. Personal Information', 'Allowed Values': 'YYYY-MM-DD (e.g. 1996-05-15)', 'Notes': 'Required for MoRTH Driving License & Passport checks' },
      { 'Field Name': 'Aadhaar Number', 'Mandatory': 'NO', 'Section': '5. Statutory KYC', 'Allowed Values': '12-digit Indian UID (e.g. 234567890123)', 'Notes': 'Pre-fills UIDAI OTP e-KYC gate' },
      { 'Field Name': 'PAN Card Number', 'Mandatory': 'NO', 'Section': '5. Statutory KYC', 'Allowed Values': '10-character alphanumeric PAN (e.g. ABCDE1234F)', 'Notes': 'Pre-fills NSDL 2.0 direct verification' },
      { 'Field Name': 'EPFO UAN Number', 'Mandatory': 'NO', 'Section': '5. Statutory KYC', 'Allowed Values': '12-digit EPFO UAN (e.g. 101298450123)', 'Notes': 'Enables dual employment & moonlighting audit V3' },
      { 'Field Name': 'ESIC IP Number', 'Mandatory': 'NO', 'Section': '5. Statutory KYC', 'Allowed Values': '10 or 17 digit ESIC Insurance Number', 'Notes': 'Manufacturing, plant & delivery social security' },
      { 'Field Name': 'Commercial Driving License', 'Mandatory': 'NO', 'Section': '5. Statutory KYC', 'Allowed Values': 'MoRTH Sarathi DL Code (e.g. KA0120200004910)', 'Notes': 'Transport & logistics fleet verification' },
      { 'Field Name': 'Bank Account & IFSC', 'Mandatory': 'NO', 'Section': '8. Bank Details', 'Allowed Values': 'Account Number + 11-char IFSC Code', 'Notes': 'Enables automated NPCI IMPS penny-drop verification' }
    ];

    const wb = XLSX.utils.book_new();

    const setColWidths = (ws) => {
      ws['!cols'] = [
        { wch: 24 }, { wch: 22 }, { wch: 20 }, { wch: 18 }, { wch: 8 }, 
        { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 28 }, 
        { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 16 }, 
        { wch: 32 }, { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 32 }, 
        { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 18 }, { wch: 28 }, 
        { wch: 26 }, { wch: 18 }, { wch: 26 }, { wch: 20 }, { wch: 18 }, 
        { wch: 18 }, { wch: 30 }, { wch: 26 }, { wch: 26 }, { wch: 26 }, 
        { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 26 }, { wch: 24 }, 
        { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 20 }, { wch: 20 }, 
        { wch: 24 }, { wch: 20 }, { wch: 22 }, { wch: 16 }, { wch: 22 }
      ];
    };

    let downloadFilename = '';

    if (sector === 'it_engineering') {
      const ws = XLSX.utils.json_to_sheet(itSampleData);
      setColWidths(ws);
      XLSX.utils.book_append_sheet(wb, ws, 'IT_Software_Employees');
      downloadFilename = 'Employee_Bulk_Import_Template_IT_Software';
    } else if (sector === 'manufacturing') {
      const ws = XLSX.utils.json_to_sheet(mfgSampleData);
      setColWidths(ws);
      XLSX.utils.book_append_sheet(wb, ws, 'Manufacturing_Plant_Staff');
      downloadFilename = 'Employee_Bulk_Import_Template_Manufacturing_Plant';
    } else if (sector === 'bfsi') {
      const ws = XLSX.utils.json_to_sheet(bfsiSampleData);
      setColWidths(ws);
      XLSX.utils.book_append_sheet(wb, ws, 'BFSI_Finance_Employees');
      downloadFilename = 'Employee_Bulk_Import_Template_BFSI_Finance';
    } else if (sector === 'healthcare') {
      const ws = XLSX.utils.json_to_sheet(healthSampleData);
      setColWidths(ws);
      XLSX.utils.book_append_sheet(wb, ws, 'Healthcare_Clinical_Staff');
      downloadFilename = 'Employee_Bulk_Import_Template_Healthcare_Clinical';
    } else if (sector === 'logistics') {
      const ws = XLSX.utils.json_to_sheet(logSampleData);
      setColWidths(ws);
      XLSX.utils.book_append_sheet(wb, ws, 'Logistics_Fleet_Delivery');
      downloadFilename = 'Employee_Bulk_Import_Template_Logistics_Fleet';
    } else {
      // Master Multi-Sheet Template containing all sectors
      const wsMaster = XLSX.utils.json_to_sheet([...itSampleData, ...mfgSampleData, ...bfsiSampleData, ...healthSampleData, ...logSampleData]);
      setColWidths(wsMaster);
      XLSX.utils.book_append_sheet(wb, wsMaster, '1_Master_All_Sectors');

      const wsIT = XLSX.utils.json_to_sheet(itSampleData);
      setColWidths(wsIT);
      XLSX.utils.book_append_sheet(wb, wsIT, '2_IT_Software');

      const wsMfg = XLSX.utils.json_to_sheet(mfgSampleData);
      setColWidths(wsMfg);
      XLSX.utils.book_append_sheet(wb, wsMfg, '3_Manufacturing_Plant');

      const wsBfsi = XLSX.utils.json_to_sheet(bfsiSampleData);
      setColWidths(wsBfsi);
      XLSX.utils.book_append_sheet(wb, wsBfsi, '4_BFSI_Finance');

      const wsHlth = XLSX.utils.json_to_sheet(healthSampleData);
      setColWidths(wsHlth);
      XLSX.utils.book_append_sheet(wb, wsHlth, '5_Healthcare_Clinical');

      const wsLog = XLSX.utils.json_to_sheet(logSampleData);
      setColWidths(wsLog);
      XLSX.utils.book_append_sheet(wb, wsLog, '6_Logistics_Fleet');

      downloadFilename = 'Employee_Bulk_Import_Master_Multi_Sector_Template';
    }

    // Add Guidelines Sheet to all workbooks
    const wsGuide = XLSX.utils.json_to_sheet(guideData);
    wsGuide['!cols'] = [{ wch: 26 }, { wch: 14 }, { wch: 28 }, { wch: 45 }, { wch: 45 }];
    XLSX.utils.book_append_sheet(wb, wsGuide, 'Field_Guide_&_Allowed_Values');

    if (format === 'csv') {
      XLSX.writeFile(wb, `${downloadFilename}.csv`, { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, `${downloadFilename}.xlsx`, { bookType: 'xlsx' });
    }

    showToast(`📥 ${downloadFilename} (${format.toUpperCase()}) downloaded successfully!`);
  };

  // 2. PARSE UPLOADED EXCEL / CSV FILE (UNIVERSAL 35+ FIELDS SUPPORT)
  const processFile = (file) => {
    if (!file) return;

    setFileName(file.name);
    setUploadedFileSize((file.size / 1024).toFixed(1) + ' KB');
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
          setParseError('The uploaded file contains no data rows. Please download the sector template and fill in candidate records.');
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

          // 1. Personal Fields
          const name = findVal(['fullname', 'candidatename', 'employeename', 'name']) || `Candidate #${idx + 1}`;
          const fatherSpouseName = findVal(['fatherspousename', 'fathername', 'father', 'spouse', 'husband']);
          const motherName = findVal(['mothername', 'mother']);
          const dob = findVal(['dateofbirth', 'dob', 'birthdate', 'birth']);
          const age = findVal(['age', 'yearsold']);
          const gender = findVal(['gender', 'sex']) || 'Male';
          const bloodGroup = findVal(['bloodgroup', 'blood']);
          const maritalStatus = findVal(['maritalstatus', 'marital', 'married']) || 'Single';
          const motherTongue = findVal(['mothertongue', 'language']);

          // 2. Contact Fields
          const email = findVal(['officialemail', 'emailaddress', 'email', 'candidateemail', 'mail']);
          let mobile = findVal(['mobilenumber', 'mobile', 'phonenumber', 'phone', 'contact']);
          mobile = mobile.replace(/[^0-9]/g, '');
          if (mobile.length > 10 && mobile.startsWith('91')) mobile = mobile.substring(2);

          let alternateMobile = findVal(['alternatemobile', 'alternatenumber', 'altmobile', 'whatsappnumber', 'whatsapp']);
          alternateMobile = alternateMobile.replace(/[^0-9]/g, '');
          if (alternateMobile.length > 10 && alternateMobile.startsWith('91')) alternateMobile = alternateMobile.substring(2);

          const emergencyContactName = findVal(['emergencycontactname', 'emergencyname', 'emergencycontact']);
          const emergencyContactMobile = findVal(['emergencycontactmobile', 'emergencyphone', 'emergencynumber', 'emergencymobile']);
          const emergencyRelationship = findVal(['emergencycontactrelationship', 'emergencyrelationship', 'emergencyrelation', 'relation']) || 'Parent / Relative';

          // 3. Address Fields
          const permanentAddressLine = findVal(['permanentaddressline', 'permanentaddress', 'permaddress', 'addressline', 'address']);
          const permanentCity = findVal(['permanentcity', 'permcity', 'city']);
          const permanentState = findVal(['permanentstate', 'permstate', 'state']);
          const permanentPincode = findVal(['permanentpincode', 'permpin', 'pincode', 'pin', 'postalcode']);

          const presentAddressLine = findVal(['presentaddressline', 'presentaddress', 'currentaddress', 'localaddress']) || permanentAddressLine;
          const presentCity = findVal(['presentcity', 'currentcity']) || permanentCity;
          const presentState = findVal(['presentstate', 'currentstate']) || permanentState;
          const presentPincode = findVal(['presentpincode', 'currentpin']) || permanentPincode;

          // 4. Employment Fields
          let empTypeRaw = findVal(['employmenttype', 'employeetype', 'category', 'type', 'contracttype']) || 'Full-Time';
          let empType = 'Full-Time';
          const lowerType = empTypeRaw.toLowerCase();
          if (lowerType.includes('contract') || lowerType.includes('retainer')) empType = 'Contract';
          else if (lowerType.includes('intern') || lowerType.includes('trainee') || lowerType.includes('apprentice')) empType = 'Intern';
          else if (lowerType.includes('part') || lowerType.includes('freelance')) empType = 'Part-Time';
          else if (lowerType.includes('exec') || lowerType.includes('lead') || lowerType.includes('director') || lowerType.includes('vp')) empType = 'Executive';
          else if (lowerType.includes('vendor') || lowerType.includes('third')) empType = 'Vendor';

          const designation = findVal(['designation', 'jobrole', 'role', 'title', 'position']) || 'Associate';
          const dept = findVal(['department', 'dept', 'function', 'division']) || 'General Operations';
          const empId = findVal(['employeeid', 'staffcode', 'empid', 'id']) || `${currentCompany?.code || 'JOY'}EMP${String(Date.now()).slice(-4)}${idx + 1}`;
          const doj = findVal(['proposedjoiningdate', 'joiningdate', 'doj', 'dateofjoining']) || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
          const workLocation = findVal(['worklocation', 'plantlocation', 'factorylocation', 'branch', 'hub', 'location']) || 'Main Office';
          const workShift = findVal(['workshift', 'shift', 'shifttype']) || 'General Shift';
          const offeredCtc = findVal(['offeredannualctc', 'offeredctc', 'annualctc', 'ctc', 'salary']);

          // 5. Statutory KYC Fields
          const pan = findVal(['pancardnumber', 'pan', 'pannumber', 'pancard']).toUpperCase();
          const aadhaar = findVal(['aadhaarnumber', 'aadhaar', 'uid']).replace(/[^0-9]/g, '');
          const uanEpf = findVal(['epfouannumber', 'uannumber', 'uan', 'epf', 'pfnumber']).replace(/[^0-9]/g, '');
          const esicNo = findVal(['esicipnumber', 'esicnumber', 'esicno', 'esic']).replace(/[^0-9]/g, '');
          const drivingLicense = findVal(['commercialdrivinglicense', 'drivinglicense', 'dlnumber', 'dlno']);
          const passportNo = findVal(['passportnumber', 'passportno', 'passport']);
          const regulatoryCert = findVal(['regulatorycertifications', 'medicalcouncil', 'tradecertification', 'nism', 'trade', 'safetytraining']);

          // 6. Academic Fields
          const highestQualification = findVal(['highestdegree', 'highestqualification', 'degree', 'qualification', 'education']);
          const specialization = findVal(['specialization', 'major', 'stream', 'branch']);
          const university = findVal(['university', 'college', 'institute', 'board']);
          const yearOfPassing = findVal(['yearofpassing', 'passingyear', 'passyear', 'year']);
          const percentage = findVal(['percentage', 'cgpa', 'marks', 'score']);

          // 7. Experience Fields
          const totalExperience = findVal(['totalexperience', 'priorexperience', 'workexperience', 'experienceyears', 'experience']);
          const previousCompany = findVal(['previouscompanyname', 'previouscompany', 'lastcompany', 'previousemployer', 'employer']);
          const previousDesignation = findVal(['previousdesignation', 'lastdesignation', 'priorrole']);
          const previousRelievingDate = findVal(['previousrelievingdate', 'relievingdate', 'relieveddate']);
          const lastDrawnCtc = findVal(['lastdrawnannualctc', 'lastdrawnctc', 'previousctc', 'lastctc']);

          // 8. Bank Details
          const bankAccountHolder = findVal(['bankaccountholdername', 'accountholdername', 'accountholder', 'holdername']) || name;
          const bankName = findVal(['bankname', 'bank']);
          const bankAccountNo = findVal(['bankaccountnumber', 'accountnumber', 'accountno', 'accno']);
          const bankIfsc = findVal(['bankifsccode', 'ifsccode', 'ifsc']).toUpperCase();
          const bankBranch = findVal(['branchname', 'bankbranch', 'branch']);

          const errors = [];
          if (!name || name.length < 2) {
            errors.push('Candidate Name is required');
          }
          if (!email && !mobile) {
            errors.push('At least an Email Address or 10-digit Mobile Number is required');
          } else {
            if (email && (!email.includes('@') || !email.includes('.'))) {
              errors.push('Valid Email Address format (e.g. name@company.com) is required');
            }
            if (mobile && mobile.length !== 10) {
              errors.push('10-digit Indian Mobile Number is required if provided');
            }
          }

          return {
            rowId: idx + 1,
            // Core
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
            // Extended 35+ fields
            fatherSpouseName,
            motherName,
            dob,
            age,
            bloodGroup,
            maritalStatus,
            motherTongue,
            alternateMobile,
            emergencyContactName,
            emergencyContactMobile,
            emergencyRelationship,
            permanentAddressLine,
            permanentCity,
            permanentState,
            permanentPincode,
            presentAddressLine,
            presentCity,
            presentState,
            presentPincode,
            workLocation,
            workShift,
            offeredCtc,
            uanEpf,
            esicNo,
            drivingLicense,
            passportNo,
            regulatoryCert,
            highestQualification,
            specialization,
            university,
            yearOfPassing,
            percentage,
            totalExperience,
            previousCompany,
            previousDesignation,
            previousRelievingDate,
            lastDrawnCtc,
            bankAccountHolder,
            bankName,
            bankAccountNo,
            bankIfsc,
            bankBranch,
            isValid: errors.length === 0,
            errors,
            isSelected: errors.length === 0
          };
        });

        setParsedRows(normalized);
        setIsParsing(false);
        showToast(`✅ Successfully parsed ${normalized.length} candidate rows from "${file.name}" with full 35+ field profile support!`);
      } catch (err) {
        console.error('File parsing error:', err);
        setParseError(`Failed to parse file: ${err.message || 'Corrupt or unsupported spreadsheet format.'}`);
        setIsParsing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearUploadedFile = () => {
    setFileName('');
    setUploadedFileSize(null);
    setParsedRows([]);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    if (selectedEmployeeTypeFilter !== 'ALL' && r.employeeType !== selectedEmployeeTypeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = r.name?.toLowerCase().includes(q);
      const matchMobile = r.mobile?.includes(q);
      const matchEmail = r.email?.toLowerCase().includes(q);
      const matchEmpId = r.empId?.toLowerCase().includes(q);
      const matchRole = r.designation?.toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchEmail && !matchEmpId && !matchRole) return false;
    }
    return true;
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
    setImportProgress(10);

    const activeChecklistKeys = Object.entries(checklist)
      .filter(([_, v]) => v.enabled)
      .map(([k, _]) => k);

    const candidatePayloads = candidatesToImport.map(row => {
      const candidatePin = '1234';
      const verificationConfig = {};
      Object.entries(checklist).forEach(([k, v]) => {
        verificationConfig[k] = {
          enabled: v.enabled,
          mode: 'through_link',
          title: v.title
        };
      });

      // Complete 7-Section Joining Form Data Mapping
      const joiningFormData = {
        // 1. Personal Information
        fullName: row.name,
        fatherSpouseName: row.fatherSpouseName,
        motherName: row.motherName,
        dob: row.dob,
        age: row.age ? parseInt(row.age) : null,
        gender: row.gender,
        bloodGroup: row.bloodGroup,
        maritalStatus: row.maritalStatus,
        motherTongue: row.motherTongue,
        nationality: 'Indian',

        // 2. Contact Details
        email: row.email,
        mobile: row.mobile,
        alternateMobile: row.alternateMobile,
        emergencyContactName: row.emergencyContactName,
        emergencyContactPhone: row.emergencyContactMobile,
        emergencyRelationship: row.emergencyRelationship,

        // 3. Addresses
        permanentAddressLine: row.permanentAddressLine,
        permanentCity: row.permanentCity,
        permanentState: row.permanentState,
        permanentPincode: row.permanentPincode,
        presentAddressLine: row.presentAddressLine || row.permanentAddressLine,
        presentCity: row.presentCity || row.permanentCity,
        presentState: row.presentState || row.permanentState,
        presentPincode: row.presentPincode || row.permanentPincode,

        // 4. Employment Details
        empId: row.empId,
        employeeNumber: row.empId,
        designation: row.designation,
        dept: row.dept,
        employeeType: row.employeeType,
        doj: row.doj,
        workLocation: row.workLocation,
        shift: row.workShift,
        offeredCtc: row.offeredCtc,

        // 5. Statutory & KYC
        aadhaarNo: row.aadhaar,
        panNo: row.pan,
        uanEpf: row.uanEpf,
        esicNo: row.esicNo,
        drivingLicense: row.drivingLicense,
        passportNo: row.passportNo,
        tradeCertification: row.regulatoryCert,

        // 6. Academic Qualifications
        highestQualification: row.highestQualification,
        specialization: row.specialization,
        college: row.university,
        yearOfPassing: row.yearOfPassing,
        percentage: row.percentage,

        // 7. Previous Experience
        totalExperience: row.totalExperience,
        previousCompany: row.previousCompany,
        previousDesignation: row.previousDesignation,
        relievingDate: row.previousRelievingDate,
        lastDrawnCtc: row.lastDrawnCtc,

        // 8. Bank Account Details
        accountHolderName: row.bankAccountHolder || row.name,
        bankName: row.bankName,
        accountNumber: row.bankAccountNo,
        ifscCode: row.bankIfsc,
        branchName: row.bankBranch,

        checklist: activeChecklistKeys
      };

      return {
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
        dob: row.dob,
        age: row.age ? parseInt(row.age) : null,
        gender: row.gender,
        workLocation: row.workLocation,
        panNumber: row.pan,
        aadhaarNo: row.aadhaar,
        pfNumber: row.uanEpf,
        esiNumber: row.esicNo,
        companyId: targetCompanyId,
        companyName: targetCompanyName,
        hrId: targetHrId,
        portalPassword: candidatePin,
        verificationConfig,
        verificationChecklist: activeChecklistKeys,
        hrCustomMessage: customHrMessage,
        status: autoSendLinks ? 'Link Sent' : 'Pending',
        isBulkImported: true,
        importBatchDate: new Date().toISOString(),
        joiningFormData,
        submittedFormData: joiningFormData,
        _originalRow: row
      };
    });

    try {
      setImportProgress(35);
      let imported = [];
      if (typeof bulkAddCandidates === 'function') {
        imported = await bulkAddCandidates(candidatePayloads);
      } else {
        for (let i = 0; i < candidatePayloads.length; i++) {
          const item = candidatePayloads[i];
          const token = await addCandidate(item);
          imported.push({ ...item, token: typeof token === 'string' ? token : token?.token });
          setImportProgress(35 + Math.round(((i + 1) / candidatePayloads.length) * 55));
        }
      }

      setImportProgress(95);

      const createdResults = imported.map((cand, idx) => {
        const orig = candidatesToImport[idx] || {};
        const tokenString = cand.token || `tok_${(cand.name || 'cand').toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(100 + Math.random() * 900)}`;
        return {
          ...orig,
          name: cand.name || orig.name,
          email: cand.email || orig.email,
          mobile: cand.mobile || orig.mobile,
          empId: cand.empId || cand.emp_id || orig.empId,
          designation: cand.designation || orig.designation,
          dept: cand.dept || orig.dept,
          employeeType: cand.employeeType || orig.employeeType,
          token: tokenString,
          portalPassword: '1234',
          linkUrl: `${window.location.origin}/employee?token=${tokenString}&mode=onboarding`,
          status: autoSendLinks ? 'Link Dispatched 🟢' : 'Profile Created 🟡'
        };
      });

      setImportProgress(100);
      setImportedCandidates(createdResults);
      setIsImporting(false);
      setCurrentStep(3);
      showToast(`🎉 Bulk import completed! ${createdResults.length} employee profiles created & links generated.`);
      if (onImportComplete) onImportComplete(createdResults);
    } catch (err) {
      console.error('Error during bulk candidate import:', err);
      setIsImporting(false);
      showToast(`⚠️ Import encountered an error: ${err.message || 'Check console'}`);
    }
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
      'Company Name': currentCompany?.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
      'Date Imported': new Date().toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws['!cols'] = [
      { wch: 22 }, { wch: 28 }, { wch: 16 }, { wch: 18 }, { wch: 24 },
      { wch: 20 }, { wch: 16 }, { wch: 22 }, { wch: 14 }, { wch: 65 },
      { wch: 18 }, { wch: 35 }, { wch: 16 }
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

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center overflow-hidden animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isImporting) onClose();
      }}
    >
      <div className="w-full max-w-5xl h-full max-h-[calc(100vh-2rem)] flex flex-col border border-slate-200 bg-white text-slate-900 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 animate-fadeIn">
        
        {/* MODAL HEADER - PINNED TO TOP */}
        <div className="shrink-0 bg-white p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-4 z-20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black shadow-lg shrink-0">
              <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">Bulk Employee Ingestion & Link Dispatch</h2>
                <span className="badge badge-emerald text-[9px] sm:text-[10px] font-bold">ALL EMPLOYEE TYPES & SECTORS</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
                Import candidates across IT & Engineering, Manufacturing, BFSI, Healthcare & Logistics with full 35+ field profile creation & automated link dispatch.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            disabled={isImporting}
            className="flex items-center gap-1.5 text-slate-500 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors text-xs font-bold cursor-pointer shrink-0 disabled:opacity-50"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Close (Esc)</span>
          </button>
        </div>

        {/* SCROLLABLE BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">

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
            <span>1. Sector Template & Upload</span>
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
            <span>2. Document Checklist & Channels</span>
          </button>

          <div
            className={`p-3 rounded-xl border flex items-center justify-center gap-2 select-none ${
              currentStep === 3 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">3</span>
            <span>3. Batch Summary & Links</span>
          </div>
        </div>

        {/* STEP 1: TEMPLATE DOWNLOAD & FILE UPLOAD */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* 🌟 DUAL-MODE SWITCHER (UPLOAD EDITED EXCEL vs DOWNLOAD TEMPLATES) */}
            <div className="flex items-center p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 gap-1.5 max-w-xl mx-auto shadow-inner">
              <button
                type="button"
                onClick={() => setStep1Mode('upload')}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  step1Mode === 'upload'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>1. Upload Edited Excel File 📤</span>
                {parsedRows.length > 0 && (
                  <span className="badge bg-white text-emerald-900 text-[10px] font-black">
                    {parsedRows.length} Rows
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep1Mode('templates')}
                className={`flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  step1Mode === 'templates'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>2. Download Blank Templates 📥</span>
                <span className="badge bg-indigo-100 text-indigo-800 text-[9px] font-extrabold">6 Sectors</span>
              </button>
            </div>

            {/* 📤 MODE 1: UPLOAD EDITED EXCEL SPREADSHEET */}
            {step1Mode === 'upload' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Helpful Guidance Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50/60 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <span>Ready to import? Upload your filled Excel file below. Need the blank template first?</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDownloadTemplate(selectedSectorTemplate, 'xlsx')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Download Master Template (.xlsx)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep1Mode('templates')}
                      className="text-xs text-indigo-700 hover:text-indigo-900 font-extrabold underline cursor-pointer"
                    >
                      All 6 Sectors →
                    </button>
                  </div>
                </div>

                {/* PROMINENT DRAG & DROP UPLOAD BOX */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all text-center space-y-4 ${
                    isDragging 
                      ? 'border-emerald-600 bg-emerald-100/70 ring-4 ring-emerald-400/30 scale-[1.01]' 
                      : fileName 
                        ? 'border-emerald-400 bg-emerald-50/40 hover:bg-emerald-50/70' 
                        : 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-500 hover:bg-emerald-50/60'
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={handleFileInputChange} 
                    className="hidden" 
                  />

                  <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 mx-auto flex items-center justify-center shadow-md border border-emerald-200">
                    {isParsing ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                  </div>

                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="font-black text-slate-900 text-base sm:text-lg">
                      {fileName ? `Uploaded File: ${fileName}` : 'Drop Your Edited Excel Spreadsheet Here'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Upload candidate profiles to parse 35+ personal, statutory, employment & bank fields automatically.
                    </p>
                  </div>

                  {/* PRIMARY ACTION BUTTON */}
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm py-3.5 px-8 font-black rounded-2xl shadow-lg flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-98"
                    >
                      <Upload className="w-5 h-5" />
                      <span>{fileName ? 'Choose Another File 📁' : 'Browse & Upload Edited Excel (.xlsx, .xls, .csv) 📁'}</span>
                    </button>
                  </div>

                  {/* FILE INFO CARD */}
                  {fileName && (
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white text-emerald-950 text-xs font-bold border border-emerald-300 shadow-xs mt-2">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[220px]">{fileName}</span>
                      {uploadedFileSize && <span className="text-slate-400 font-mono text-[11px]">({uploadedFileSize})</span>}
                      <span className="badge badge-emerald text-[10px] font-black">{parsedRows.length} Candidates Parsed ✓</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clearUploadedFile(); }}
                        className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ERROR NOTICE */}
                {parseError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div className="flex-1 font-medium">{parseError}</div>
                    <button 
                      type="button" 
                      onClick={() => setParseError(null)} 
                      className="font-bold text-rose-600 hover:text-rose-900 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 📥 MODE 2: SECTOR TEMPLATE DOWNLOAD HUB */}
            {step1Mode === 'templates' && (
              <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Select Industry & Download Specific Blank Template</span>
                      </span>
                      <span className="badge badge-emerald text-[9px] font-bold">35+ FULL FIELDS</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Choose your sector below to download an industry-tailored Excel template with pre-filled sample rows.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadTemplate(selectedSectorTemplate, 'xlsx')}
                      className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2.5 px-4 font-black flex items-center gap-2 shadow-sm rounded-xl cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download ({SECTOR_TEMPLATES.find(s => s.id === selectedSectorTemplate)?.shortTitle}) 📥</span>
                    </button>
                  </div>
                </div>

                {/* SECTOR CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SECTOR_TEMPLATES.map((sector) => {
                    const Icon = sector.icon;
                    const isSelected = selectedSectorTemplate === sector.id;
                    return (
                      <div
                        key={sector.id}
                        onClick={() => setSelectedSectorTemplate(sector.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 relative ${
                          isSelected 
                            ? 'border-emerald-500 bg-white shadow-md ring-2 ring-emerald-400/30' 
                            : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-xs">{sector.title}</h4>
                              <span className="text-[10px] text-slate-500 font-medium">{sector.badge}</span>
                            </div>
                          </div>

                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                              ✓
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-300" />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {sector.desc}
                        </p>

                        <div className="pt-1 flex justify-between items-center text-[10px]">
                          <span className="font-bold text-slate-400">Excel .XLSX</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadTemplate(sector.id, 'xlsx');
                            }}
                            className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                          >
                            Download Single 📥
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SWITCH TO UPLOAD BANNER */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 font-bold">
                  <span>Already filled in your candidate details? Switch back to upload your completed spreadsheet.</span>
                  <button
                    type="button"
                    onClick={() => setStep1Mode('upload')}
                    className="btn bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 px-4 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Completed Excel Now 📤</span>
                  </button>
                </div>
              </div>
            )}

            {/* PARSED DATA PREVIEW */}
            {parsedRows.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-slate-900 text-sm">
                      Parsed Records: {parsedRows.length} Total
                    </span>
                    <span className="badge badge-emerald text-[11px] font-bold">
                      {validSelectedCount} Selected for Import
                    </span>
                    {invalidCount > 0 && (
                      <span className="badge badge-rose text-[11px] font-bold">
                        {invalidCount} Errors Detected
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input text-xs py-1.5 pl-8 pr-3 w-40 sm:w-56 bg-white"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAllRows(true)}
                      className="btn btn-secondary text-xs py-1.5 px-3 font-bold cursor-pointer"
                    >
                      Select All Valid
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAllRows(false)}
                      className="btn btn-secondary text-xs py-1.5 px-3 font-bold cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* TABLE CONTAINER */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto max-h-[380px]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider sticky top-0 z-10">
                        <tr>
                          <th className="p-3 w-10 text-center">✓</th>
                          <th className="p-3">Candidate Full Name</th>
                          <th className="p-3">Category & Role</th>
                          <th className="p-3">Mobile & Email</th>
                          <th className="p-3">Work Location & Shift</th>
                          <th className="p-3">Aadhaar / PAN</th>
                          <th className="p-3">Proposed DOJ</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {displayedRows.map((row) => (
                          <tr 
                            key={row.rowId}
                            className={`hover:bg-slate-50/80 transition-colors ${!row.isValid ? 'bg-rose-50/40' : row.isSelected ? 'bg-emerald-50/30' : ''}`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={row.isSelected}
                                disabled={!row.isValid}
                                onChange={() => toggleRowSelection(row.rowId)}
                                className="accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                              />
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{row.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">ID: {row.empId}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                                {row.employeeType}
                              </span>
                              <div className="text-[11px] text-slate-600 font-semibold mt-0.5">{row.designation}</div>
                              <div className="text-[10px] text-slate-400">{row.dept}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-slate-800">{row.mobile}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{row.email}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-800 text-[11px]">{row.workLocation || 'Main Hub'}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{row.workShift || 'General'}</div>
                            </td>
                            <td className="p-3 font-mono text-[11px]">
                              <div>{row.pan ? `PAN: ${row.pan}` : 'PAN: —'}</div>
                              <div className="text-slate-500">{row.aadhaar ? `UID: XXXX-${row.aadhaar.slice(-4)}` : 'UID: —'}</div>
                            </td>
                            <td className="p-3 font-mono text-[11px] text-slate-600">
                              {row.doj}
                            </td>
                            <td className="p-3 text-center">
                              {row.isValid ? (
                                <span className="badge badge-emerald text-[9px] font-black">VALID ROW</span>
                              ) : (
                                <span 
                                  className="badge badge-rose text-[9px] font-black cursor-help"
                                  title={row.errors.join(', ')}
                                >
                                  INVALID ({row.errors.length})
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeRow(row.rowId)}
                                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                                title="Remove row from import queue"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CONTINUE BUTTON */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 font-medium">
                    {validSelectedCount} valid candidate records prepared for onboarding link generation.
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (validSelectedCount > 0) setCurrentStep(2);
                      else showToast('⚠️ Please select at least one valid candidate record.');
                    }}
                    disabled={validSelectedCount === 0}
                    className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-98"
                  >
                    <span>Proceed to Verification Checklist (Step 2) ➡️</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STEP 2: DOCUMENTS CHECKLIST & LINK SENDING CHANNELS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* 1. SECTOR PRESET QUICK SWITCHER */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Document Verification Checklist & Sector Presets</span>
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Toggle statutory verification requirements for this batch of {validSelectedCount} employees.
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyChecklistPreset('it_tech')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-blue-800 border border-blue-200 hover:bg-blue-50 cursor-pointer"
                >
                  💻 IT & Tech Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyChecklistPreset('manufacturing')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-amber-800 border border-amber-200 hover:bg-amber-50 cursor-pointer"
                >
                  🏭 Plant Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyChecklistPreset('bfsi')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                >
                  🏦 BFSI Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyChecklistPreset('logistics')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-cyan-800 border border-cyan-200 hover:bg-cyan-50 cursor-pointer"
                >
                  🚚 Fleet Preset
                </button>
                <button
                  type="button"
                  onClick={() => applyChecklistPreset('all')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-white hover:bg-slate-900 cursor-pointer"
                >
                  All 14 Checks
                </button>
              </div>
            </div>

            {/* 2. CHECKLIST ITEMS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(checklist).map(([key, item]) => (
                <label 
                  key={key}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                    item.enabled 
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => {
                      setChecklist(prev => ({
                        ...prev,
                        [key]: { ...prev[key], enabled: e.target.checked }
                      }));
                    }}
                    className="accent-emerald-600 w-4 h-4 rounded mt-0.5 shrink-0 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-xs">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 block">{item.category}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* 3. LINK SENDING OPTION & DISPATCH CHANNELS */}
            <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <span>Automated Onboarding Link Dispatch Channels</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Control how the generated magic onboarding token links are dispatched to candidates.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSendLinks}
                    onChange={(e) => setAutoSendLinks(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors flex items-center p-1 ${autoSendLinks ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'}`}>
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {autoSendLinks ? 'Auto-Dispatch ON' : 'Create Profiles Only'}
                  </span>
                </label>
              </div>

              {autoSendLinks && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${dispatchChannels.email ? 'bg-white border-indigo-300 shadow-xs' : 'bg-slate-100 border-slate-200'}`}>
                      <input
                        type="checkbox"
                        checked={dispatchChannels.email}
                        onChange={(e) => setDispatchChannels({ ...dispatchChannels, email: e.target.checked })}
                        className="accent-indigo-600 w-4 h-4 rounded"
                      />
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-800">Email Dispatch (cPanel SMTP)</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${dispatchChannels.sms ? 'bg-white border-teal-300 shadow-xs' : 'bg-slate-100 border-slate-200'}`}>
                      <input
                        type="checkbox"
                        checked={dispatchChannels.sms}
                        onChange={(e) => setDispatchChannels({ ...dispatchChannels, sms: e.target.checked })}
                        className="accent-teal-600 w-4 h-4 rounded"
                      />
                      <Smartphone className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold text-slate-800">Carrier SMS (Twilio / DLT)</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${dispatchChannels.whatsapp ? 'bg-white border-emerald-300 shadow-xs' : 'bg-slate-100 border-slate-200'}`}>
                      <input
                        type="checkbox"
                        checked={dispatchChannels.whatsapp}
                        onChange={(e) => setDispatchChannels({ ...dispatchChannels, whatsapp: e.target.checked })}
                        className="accent-emerald-600 w-4 h-4 rounded"
                      />
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Meta WhatsApp Cloud</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold text-xs mb-1">
                      Custom HR Welcome Message to Employees
                    </label>
                    <textarea
                      rows={2}
                      value={customHrMessage}
                      onChange={(e) => setCustomHrMessage(e.target.value)}
                      className="form-input text-xs"
                      placeholder="Type custom instructions to be included in the onboarding invitation..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary text-xs py-2.5 px-4 font-bold cursor-pointer"
              >
                ⬅️ Back to Review Records
              </button>

              <button
                type="button"
                onClick={handleExecuteBulkImport}
                disabled={isImporting}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 px-6 rounded-xl flex items-center gap-2 shadow-xl cursor-pointer transition-all active:scale-98"
              >
                {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>
                  {isImporting 
                    ? `Creating Profiles (${importProgress}%)...` 
                    : `Execute Bulk Import for ${validSelectedCount} Candidates 🚀`
                  }
                </span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: BATCH IMPORT RESULTS & TOKEN REGISTRY */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* SUCCESS BANNER */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center space-y-3 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white mx-auto flex items-center justify-center font-black">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                Successfully Ingested {importedCandidates.length} Employee Profiles!
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl mx-auto">
                Candidate records have been stored in the PostgreSQL database under {currentCompany?.name || 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED'}. Onboarding links and security PINs are generated below.
              </p>

              <div className="pt-2 flex justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadBatchCredentials}
                  className="btn bg-white text-emerald-900 hover:bg-emerald-50 text-xs py-2.5 px-5 font-black flex items-center gap-2 rounded-xl shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Download Credentials & Links Spreadsheet (.xlsx) 📥</span>
                </button>
              </div>
            </div>

            {/* RESULTS LIST */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 uppercase text-[10px] tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Candidate Employee</th>
                      <th className="p-3">Role & Category</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Security PIN</th>
                      <th className="p-3">Onboarding Link Token</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {importedCandidates.map((cand, idx) => (
                      <tr key={cand.token || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{cand.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{cand.empId}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{cand.designation}</div>
                          <span className="text-[10px] text-slate-500 font-mono">{cand.employeeType}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-slate-800">{cand.mobile}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{cand.email}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-indigo-700">
                          {cand.portalPassword}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">
                          <div className="truncate max-w-[200px]" title={cand.linkUrl}>
                            {cand.token}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="badge badge-emerald text-[9px] font-black">
                            {cand.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(cand.token, cand.linkUrl)}
                            className="btn btn-secondary text-[11px] py-1 px-2.5 font-bold cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedToken === cand.token ? 'Copied!' : 'Copy Link'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 px-6 rounded-xl cursor-pointer"
              >
                Close & Return to Workstation ✓
              </button>
            </div>

          </div>
        )}

        </div>
      </div>
    </div>,
    document.body
  );
};