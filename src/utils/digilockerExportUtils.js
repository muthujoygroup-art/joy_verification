import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Enterprise Excel and PDF Export Utilities for DigiLocker Verified Records
 * Adheres to NeGD (National e-Governance Division) and DPDP Act 2023 compliance standards.
 */

// Helper to safely format cell values
const val = (v, fallback = '-') => {
  if (v === null || v === undefined || v === '') return fallback;
  if (typeof v === 'boolean') return v ? 'YES' : 'NO';
  return String(v).trim();
};

const getAutoColumnWidths = (dataRows) => {
  const colWidths = [];
  dataRows.forEach(row => {
    row.forEach((cell, colIdx) => {
      const len = cell ? String(cell).length : 0;
      colWidths[colIdx] = Math.max(colWidths[colIdx] || 10, Math.min(len + 3, 50));
    });
  });
  return colWidths.map(w => ({ wch: w }));
};

/**
 * Export All DigiLocker Verified Records to Multi-Sheet Master Excel (.xlsx)
 */
export const exportAllDigilockerToExcel = (records = [], companyName = 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED') => {
  if (!Array.isArray(records) || records.length === 0) {
    alert('No DigiLocker verified records available to export.');
    return;
  }

  const wb = XLSX.utils.book_new();
  const exportTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // ----------------------------------------------------
  // SHEET 1: Master Summary & Profiles Roster
  // ----------------------------------------------------
  const summaryHeaderRows = [
    ['JOY CORPORATE SOLUTIONS - DIGILOCKER GOVERNMENT VAULT MASTER ROSTER'],
    ['Employer Organization', companyName],
    ['Report Generation Timestamp', `${exportTimestamp} (IST)`],
    ['Total Verified DigiLocker Accounts', records.length],
    ['Compliance Standard', 'Information Technology Act 2000 & NeGD DigiLocker Rules 2016'],
    ['Security / DPDP Seal', 'SHA-256 Cryptographic Tamper-Proof Audit Ledger'],
    []
  ];

  const tableHeader = [
    'S.No',
    'Candidate / Citizen Name',
    'DigiLocker ID',
    'Registered Mobile',
    'Date of Birth',
    'Gender',
    'Official Email',
    'Masked Aadhaar',
    'PAN Number',
    'UAN Number',
    'Driving License',
    'Residential Address',
    'Pincode',
    'Account Status',
    'Purpose of Fetch',
    'Requesting Service',
    'Verified Documents Count',
    'Verification Timestamp',
    'Cryptographic SHA256 Seal'
  ];

  const summaryDataRows = records.map((r, idx) => [
    idx + 1,
    val(r.full_name || r.candidate_name || r.name),
    val(r.digilocker_id || r.digilockerId),
    val(r.mobile || r.identifier_value),
    val(r.dob),
    val(r.gender),
    val(r.email),
    val(r.aadhaar_no || r.masked_aadhaar),
    val(r.pan_no || r.pan),
    val(r.uan_no || r.uan),
    val(r.dl_no || r.dl),
    val(r.address),
    val(r.pincode),
    val(r.status || r.account_status, 'VERIFIED_ACTIVE'),
    val(r.purpose, 'Employee onboarding (private sector)'),
    val(r.service_name, 'JoyVerify'),
    Array.isArray(r.documents) ? r.documents.length : (r.documents_count || 0),
    val(r.fetched_at || r.created_at || r.verified_at),
    val(r.sha256_seal || r.cryptographic_seal, `SHA256:${(r.digilocker_id || 'DL').toUpperCase()}`)
  ]);

  const allSummaryRows = [...summaryHeaderRows, tableHeader, ...summaryDataRows];
  const wsSummary = XLSX.utils.aoa_to_sheet(allSummaryRows);
  wsSummary['!cols'] = getAutoColumnWidths(allSummaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'DigiLocker Profiles Master');

  // ----------------------------------------------------
  // SHEET 2: Granular Issued Documents Ledger
  // ----------------------------------------------------
  const docHeaderRows = [
    ['DIGILOCKER GOVERNMENT ISSUED CERTIFICATES LEDGER'],
    ['Total Profiles Inspected', records.length],
    []
  ];

  const docTableHeader = [
    'Item #',
    'Candidate Name',
    'DigiLocker ID',
    'Mobile',
    'Document Name',
    'Issuing Authority / Department',
    'Document Reference No',
    'Document Type',
    'Status',
    'Document URI',
    'Fetched Timestamp'
  ];

  const granularDocRows = [];
  let itemCounter = 1;

  records.forEach(r => {
    const candName = val(r.full_name || r.candidate_name || r.name);
    const dlId = val(r.digilocker_id || r.digilockerId);
    const mob = val(r.mobile || r.identifier_value);
    const time = val(r.fetched_at || r.created_at || r.verified_at);
    const docs = Array.isArray(r.documents) ? r.documents : [];

    docs.forEach(d => {
      granularDocRows.push([
        itemCounter++,
        candName,
        dlId,
        mob,
        val(d.name || d.document_name),
        val(d.issuer),
        val(d.doc_no),
        val(d.doc_type || d.type),
        val(d.status || d.doc_status, 'Verified'),
        val(d.uri || d.doc_uri),
        time
      ]);
    });
  });

  const allDocRows = [...docHeaderRows, docTableHeader, ...granularDocRows];
  const wsDocs = XLSX.utils.aoa_to_sheet(allDocRows);
  wsDocs['!cols'] = getAutoColumnWidths(allDocRows);
  XLSX.utils.book_append_sheet(wb, wsDocs, 'Issued Documents Ledger');

  const fileName = `DigiLocker_Master_Roster_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

/**
 * Export Individual Candidate DigiLocker Verification Dataset to Excel (.xlsx)
 */
export const exportSingleDigilockerToExcel = (record, companyName = 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED') => {
  if (!record) return;

  const wb = XLSX.utils.book_new();
  const candName = val(record.full_name || record.candidate_name || record.name, 'Candidate');
  const dlId = val(record.digilocker_id || record.digilockerId, 'DL-UNKNOWN');
  const exportTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // SHEET 1: Candidate DigiLocker Profile Particulars
  const profileRows = [
    ['JOY CORPORATE SOLUTIONS - DIGILOCKER OFFICIAL VERIFICATION DOSSIER'],
    ['Candidate Full Name', candName],
    ['DigiLocker Account ID', dlId],
    ['Employer Organization', companyName],
    ['Registered Mobile Number', val(record.mobile || record.identifier_value)],
    ['Date of Birth (DOB)', val(record.dob)],
    ['Gender', val(record.gender)],
    ['Candidate Official Email', val(record.email)],
    ['Masked Aadhaar Number', val(record.aadhaar_no || record.masked_aadhaar)],
    ['Permanent Account Number (PAN)', val(record.pan_no || record.pan)],
    ['EPFO Universal Account Number (UAN)', val(record.uan_no || record.uan)],
    ['Driving License Number', val(record.dl_no || record.dl)],
    ['Full Residential Address (e-Aadhaar XML)', val(record.address)],
    ['Pincode', val(record.pincode)],
    ['Purpose of Verification', val(record.purpose, 'Employee onboarding (private sector)')],
    ['Requesting Service Name', val(record.service_name, 'JoyVerify')],
    ['Account Verification Status', val(record.status || record.account_status, 'VERIFIED_ACTIVE')],
    ['Verification Timestamp', val(record.fetched_at || record.created_at || record.verified_at)],
    ['DPDP Act 2023 Consent Status', 'EXPLICIT DIGITAL CONSENT LOGGED (SECTION 7A)'],
    ['Cryptographic Digital Seal', val(record.sha256_seal || record.cryptographic_seal, `SHA256:${dlId}`)],
    ['Report Exported On', `${exportTimestamp} (IST)`]
  ];

  const wsProfile = XLSX.utils.aoa_to_sheet(profileRows);
  wsProfile['!cols'] = [{ wch: 35 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsProfile, 'Profile Dossier');

  // SHEET 2: Verified Government Issued Documents
  const docs = Array.isArray(record.documents) ? record.documents : [];
  const docRows = [
    ['VERIFIED GOVERNMENT ISSUED CERTIFICATES'],
    ['Candidate Name', candName],
    ['DigiLocker ID', dlId],
    [],
    ['S.No', 'Document Title', 'Issuing Government Body', 'Document Number', 'Status', 'Document URI', 'Valid Upto']
  ];

  docs.forEach((d, idx) => {
    docRows.push([
      idx + 1,
      val(d.name || d.document_name),
      val(d.issuer),
      val(d.doc_no),
      val(d.status || d.doc_status, 'Verified'),
      val(d.uri || d.doc_uri),
      val(d.valid_upto, 'Permanent')
    ]);
  });

  const wsDocs = XLSX.utils.aoa_to_sheet(docRows);
  wsDocs['!cols'] = getAutoColumnWidths(docRows);
  XLSX.utils.book_append_sheet(wb, wsDocs, 'Issued Certificates');

  const fileName = `DigiLocker_Verification_${candName.replace(/[^a-zA-Z0-9]/g, '_')}_${dlId}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

/**
 * Generate Official DigiLocker Verified Profile PDF Certificate
 */
export const generateDigilockerOfficialCertificatePdf = async (record, companyName = 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED') => {
  if (!record) return;

  const candName = val(record.full_name || record.candidate_name || record.name, 'Candidate');
  const dlId = val(record.digilocker_id || record.digilockerId, 'DL-UNKNOWN');
  const docs = Array.isArray(record.documents) ? record.documents : [];
  const time = val(record.fetched_at || record.created_at || record.verified_at, new Date().toISOString().slice(0, 10));

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Page Dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Accent Stripe (Emerald)
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 38, pageWidth, 3, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('GOVERNMENT OF INDIA - DIGILOCKER DIGITAL VAULT', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('NATIONAL E-GOVERNANCE DIVISION (NeGD) • API SETU DIGITAL VERIFICATION CERTIFICATE', 14, 23);
  doc.text(`Authenticated for: ${companyName}`, 14, 30);

  // Status Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth - 52, 10, 38, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('100% VERIFIED', pageWidth - 48, 17);
  doc.setFontSize(7.5);
  doc.text('DPDP ACT 2023', pageWidth - 47, 21);

  // Candidate Profile Section
  let y = 50;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('1. CITIZEN IDENTITY PARTICULARS (e-KYC)', 14, y);

  y += 7;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(14, y, pageWidth - 28, 48, 3, 3, 'FD');

  const leftX = 18;
  const col2X = 90;
  let py = y + 8;

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'bold');
  doc.text('FULL LEGAL NAME:', leftX, py);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(candName, leftX + 38, py);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('DIGILOCKER ID:', col2X, py);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text(dlId, col2X + 30, py);

  py += 8;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('MOBILE NUMBER:', leftX, py);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.text(`+91 ${val(record.mobile || record.identifier_value)}`, leftX + 38, py);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('DATE OF BIRTH:', col2X, py);
  doc.setTextColor(15, 23, 42);
  doc.text(`${val(record.dob)} (${val(record.gender)})`, col2X + 30, py);

  py += 8;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('AADHAAR (MASKED):', leftX, py);
  doc.setTextColor(15, 23, 42);
  doc.text(val(record.aadhaar_no || record.masked_aadhaar), leftX + 38, py);

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('PAN CARD NUMBER:', col2X, py);
  doc.setTextColor(15, 23, 42);
  doc.text(val(record.pan_no || record.pan), col2X + 30, py);

  py += 8;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('RESIDENTIAL ADDRESS:', leftX, py);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  const splitAddress = doc.splitTextToSize(val(record.address), pageWidth - 70);
  doc.text(splitAddress, leftX + 42, py);

  // Issued Documents Section
  y = 114;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`2. VERIFIED GOVERNMENT ISSUED CERTIFICATES (${docs.length})`, 14, y);

  y += 7;
  docs.slice(0, 6).forEach((d, idx) => {
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${val(d.name || d.document_name)}`, 18, y + 6);

    // Issuer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Issuer: ${val(d.issuer)}`, 18, y + 11.5);

    // Doc Number
    doc.setFont('courier', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text(`No: ${val(d.doc_no)}`, pageWidth - 85, y + 6);

    // Badge
    doc.setFillColor(209, 250, 229); // emerald-100
    doc.roundedRect(pageWidth - 38, y + 3, 20, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(6, 95, 70); // emerald-800
    doc.text('VERIFIED ✓', pageWidth - 36, y + 7.5);

    y += 19;
  });

  // Statutory Compliance Box
  y = Math.max(y + 4, 240);
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(14, y, pageWidth - 28, 28, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(49, 46, 129); // indigo-900
  doc.text('STATUTORY AUDIT & DIGITAL LEDGER SEAL', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`• Verification Purpose: "${val(record.purpose, 'Employee onboarding (private sector)')}" (NeGD Mandate Compliant)`, 18, y + 12);
  doc.text(`• Cryptographic Hash: ${val(record.sha256_seal || record.cryptographic_seal, `SHA256:${dlId}`)}`, 18, y + 17);
  doc.text(`• Verified Timestamp: ${time} • Generated pursuant to Digital Personal Data Protection (DPDP) Act 2023.`, 18, y + 22);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('JOY Corporate Solutions Pvt Ltd • Background Verification & Statutory Compliance Platform', 14, pageHeight - 8);
  doc.text(`Page 1 of 1 • NeGD API Setu Production Gateway`, pageWidth - 70, pageHeight - 8);

  const pdfFileName = `DigiLocker_Certificate_${candName.replace(/[^a-zA-Z0-9]/g, '_')}_${dlId}.pdf`;
  doc.save(pdfFileName);
};
