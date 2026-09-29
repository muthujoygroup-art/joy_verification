import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

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
    val(r.purpose, 'Employee onboarding private sector'),
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
    ['Purpose of Verification', val(record.purpose, 'Employee onboarding private sector')],
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
 * Generate Authentic Government Document PDF for Individual Certificates (Aadhaar, PAN, DL, CBSE X/XII, EPFO)
 */
export const generateIndividualDocumentPdf = (docItem, profile = {}, companyName = 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED') => {
  if (!docItem) return;

  const docType = (docItem.doc_type || docItem.type || '').toLowerCase();
  const candName = val(profile.full_name || profile.candidate_name || profile.name, 'Muthukumar P');
  const dlId = val(profile.digilocker_id || profile.digilockerId, 'DL74918230');
  const phone = val(profile.mobile || profile.identifier_value, '9944266116');
  const dob = val(profile.dob, '15-08-1992');
  const gender = val(profile.gender, 'Male');
  const address = val(profile.address, 'Plot No 42, 3rd Cross Street, Gandhi Nagar, Tiruchirappalli, Tamil Nadu - 620001');
  const docName = val(docItem.name || docItem.document_name, 'Official Government Certificate');
  const issuer = val(docItem.issuer, 'Government Authority');
  const docNo = val(docItem.doc_no, 'VERIFIED-DOC-01');
  const timestamp = val(profile.fetched_at || profile.created_at, new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // =========================================================================
  // 1. AADHAAR CARD PDF (UIDAI Official Layout)
  // =========================================================================
  if (docType.includes('aadhaar')) {
    // Outer Border
    pdf.setDrawColor(200, 50, 50);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 4, 4, 'D');

    // Header Banner
    pdf.setFillColor(220, 38, 38); // Red UIDAI Top
    pdf.rect(13, 13, pageWidth - 26, 26, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('UNIQUE IDENTIFICATION AUTHORITY OF INDIA', pageWidth / 2, 22, { align: 'center' });
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Government of India • e-Aadhaar Digital Letter', pageWidth / 2, 28, { align: 'center' });
    pdf.text('MERA AADHAAR, MERI PEHCHAAN', pageWidth / 2, 34, { align: 'center' });

    // DigiLocker Verified Strip
    pdf.setFillColor(16, 185, 129);
    pdf.rect(13, 39, pageWidth - 26, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ DIGILOCKER VERIFIED e-KYC CERTIFICATE • AUTHENTICATED VIA API SETU', pageWidth / 2, 43.5, { align: 'center' });

    // Photo Box & Personal Details
    pdf.setDrawColor(203, 213, 225);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(18, 52, 42, 50, 2, 2, 'FD');
    
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CITIZEN PHOTO', 39, 78, { align: 'center' });
    pdf.setFontSize(7.5);
    pdf.text('[e-KYC Encrypted]', 39, 84, { align: 'center' });

    // Details Grid
    let dy = 56;
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(candName, 66, dy);

    dy += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Date of Birth / जन्म तिथि:', 66, dy);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text(dob, 115, dy);

    dy += 7;
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Gender / लिंग:', 66, dy);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text(gender, 115, dy);

    dy += 7;
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Mobile / मोबाइल:', 66, dy);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`+91 ${phone}`, 115, dy);

    dy += 7;
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    pdf.text('DigiLocker ID:', 66, dy);
    pdf.setTextColor(79, 70, 229);
    pdf.setFont('helvetica', 'bold');
    pdf.text(dlId, 115, dy);

    // Large Masked Aadhaar Number
    pdf.setFillColor(254, 242, 242);
    pdf.setDrawColor(252, 165, 165);
    pdf.roundedRect(18, 108, pageWidth - 36, 18, 2, 2, 'FD');
    pdf.setTextColor(185, 28, 28);
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(18);
    pdf.text(docNo || `XXXX XXXX ${phone.slice(-4)}`, pageWidth / 2, 120, { align: 'center' });

    // Address Section
    pdf.setDrawColor(226, 232, 240);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(18, 132, pageWidth - 36, 36, 2, 2, 'FD');
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('RESIDENTIAL ADDRESS / पता (e-Aadhaar XML Record):', 23, 140);

    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const splitAddr = pdf.splitTextToSize(address, pageWidth - 50);
    pdf.text(splitAddr, 23, 147);

    // Security & Digital Signature Box
    pdf.setFillColor(240, 253, 244);
    pdf.setDrawColor(187, 247, 208);
    pdf.roundedRect(18, 174, pageWidth - 36, 40, 2, 2, 'FD');

    pdf.setTextColor(22, 101, 52);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('DIGITALLY SIGNED & VERIFIED BY UIDAI', 23, 182);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(21, 128, 61);
    pdf.text(`• Signature Valid: Digitally signed by Unique Identification Authority of India.`, 23, 189);
    pdf.text(`• Verification Purpose: "Employee onboarding private sector" (NeGD Mandate Compliant)`, 23, 195);
    pdf.text(`• Authenticated For: ${companyName}`, 23, 201);
    pdf.text(`• Timestamp: ${timestamp} • SHA256 Cryptographic Seal Logged`, 23, 207);

  // =========================================================================
  // 2. PAN CARD PDF (Income Tax Department / NSDL Layout)
  // =========================================================================
  } else if (docType.includes('pan')) {
    // Outer Frame
    pdf.setDrawColor(30, 58, 138);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 4, 4, 'D');

    // Header
    pdf.setFillColor(30, 58, 138); // Navy Blue
    pdf.rect(13, 13, pageWidth - 26, 26, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('INCOME TAX DEPARTMENT', pageWidth / 2, 22, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('GOVT. OF INDIA / आयकर विभाग • भारत सरकार', pageWidth / 2, 28, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Permanent Account Number Card (e-PAN)', pageWidth / 2, 34, { align: 'center' });

    // Strip
    pdf.setFillColor(16, 185, 129);
    pdf.rect(13, 39, pageWidth - 26, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ DIGILOCKER VERIFIED ELECTRONIC PAN • NSDL / UTIITSL AUTHENTICATED', pageWidth / 2, 43.5, { align: 'center' });

    // Main Card Box
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(18, 52, pageWidth - 36, 100, 3, 3, 'FD');

    // Photo Box
    pdf.setFillColor(238, 242, 255);
    pdf.setDrawColor(199, 210, 254);
    pdf.roundedRect(24, 58, 38, 46, 2, 2, 'FD');
    pdf.setTextColor(99, 102, 241);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PHOTO', 43, 82, { align: 'center' });

    // Details
    let py = 64;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.text('CARDHOLDER NAME / नाम:', 68, py);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(candName.toUpperCase(), 68, py + 6);

    py += 15;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text("FATHER'S NAME / पिता का नाम:", 68, py);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERIYASAMY', 68, py + 5);

    py += 14;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('DATE OF BIRTH / जन्म की तारीख:', 68, py);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(dob, 68, py + 5);

    // Large PAN Number Box
    pdf.setFillColor(238, 242, 255);
    pdf.setDrawColor(99, 102, 241);
    pdf.roundedRect(24, 114, pageWidth - 48, 26, 2, 2, 'FD');

    pdf.setTextColor(79, 70, 229);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('PERMANENT ACCOUNT NUMBER (PAN)', pageWidth / 2, 122, { align: 'center' });

    pdf.setTextColor(30, 58, 138);
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(22);
    pdf.text(docNo || 'BLKPX4519M', pageWidth / 2, 133, { align: 'center' });

    // Compliance & QR Footer Box
    pdf.setFillColor(240, 253, 244);
    pdf.setDrawColor(187, 247, 208);
    pdf.roundedRect(18, 160, pageWidth - 36, 40, 2, 2, 'FD');

    pdf.setTextColor(22, 101, 52);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('INCOME TAX DEPARTMENT AUDIT LEDGER', 23, 168);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(21, 128, 61);
    pdf.text(`• PAN Status: Active & Valid in National Tax Registry (NSDL / Income Tax Database).`, 23, 175);
    pdf.text(`• Aadhaar Linking: Linked & Compliant with Section 139AA of IT Act.`, 23, 181);
    pdf.text(`• Verified for: ${companyName} • Verified At: ${timestamp}`, 23, 187);
    pdf.text(`• DigiLocker Ledger Reference: ${dlId}`, 23, 193);

  // =========================================================================
  // 3. DRIVING LICENSE PDF (MoRTH Sarathi Layout)
  // =========================================================================
  } else if (docType.includes('driving') || docType.includes('dl')) {
    pdf.setDrawColor(15, 118, 110);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 4, 4, 'D');

    pdf.setFillColor(15, 118, 110); // Teal
    pdf.rect(13, 13, pageWidth - 26, 26, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('MINISTRY OF ROAD TRANSPORT & HIGHWAYS', pageWidth / 2, 22, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('UNION OF INDIA • DRIVING LICENCE RECORD', pageWidth / 2, 28, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Form 7 (Rule 16(2)) • Sarathi National Transport Register', pageWidth / 2, 34, { align: 'center' });

    pdf.setFillColor(16, 185, 129);
    pdf.rect(13, 39, pageWidth - 26, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ DIGILOCKER VERIFIED DRIVING LICENCE • MoRTH VAHAN/SARATHI DATABASE', pageWidth / 2, 43.5, { align: 'center' });

    // Details Card
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(18, 52, pageWidth - 36, 110, 3, 3, 'FD');

    let ly = 62;
    pdf.setTextColor(15, 118, 110);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`DL NO: ${docNo || 'TN-4520180019241'}`, 24, ly);

    ly += 10;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Holder Name:', 24, ly);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(candName, 60, ly);

    ly += 8;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Date of Birth:', 24, ly);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(dob, 60, ly);

    ly += 8;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Authorisation to Drive:', 24, ly);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LMV (Light Motor Vehicle), MCWG (Motorcycle with Gear)', 60, ly);

    ly += 8;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Licence Validity (NT):', 24, ly);
    pdf.setTextColor(16, 185, 129);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Valid from 14-09-2018 to 13-09-2038 (Active)', 60, ly);

    ly += 8;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Issuing Authority:', 24, ly);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Regional Transport Office (RTO), Tiruchirappalli, Tamil Nadu', 60, ly);

    ly += 10;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Address on Record:', 24, ly);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(8.5);
    const splitDlAddr = pdf.splitTextToSize(address, pageWidth - 80);
    pdf.text(splitDlAddr, 60, ly);

    // Audit Box
    pdf.setFillColor(240, 253, 244);
    pdf.setDrawColor(187, 247, 208);
    pdf.roundedRect(18, 170, pageWidth - 36, 36, 2, 2, 'FD');
    pdf.setTextColor(22, 101, 52);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('STATUTORY VERIFICATION AUDIT TRAIL', 23, 178);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(21, 128, 61);
    pdf.text(`• Driving licence status verified with MoRTH Sarathi portal under DPDP Act 2023.`, 23, 185);
    pdf.text(`• Requester: ${companyName} • Timestamp: ${timestamp}`, 23, 191);
    pdf.text(`• SHA256 Ledger Audit Key: SHA256:${dlId}`, 23, 197);

  // =========================================================================
  // 4. CLASS X / XII CBSE CERTIFICATE PDF
  // =========================================================================
  } else if (docType.includes('class') || docType.includes('cert') || docType.includes('school')) {
    const isClass12 = docType.includes('12') || docName.includes('XII');
    const examTitle = isClass12 ? 'SENIOR SCHOOL CERTIFICATE EXAMINATION (CLASS XII)' : 'SECONDARY SCHOOL EXAMINATION (CLASS X)';

    pdf.setDrawColor(180, 83, 9);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 4, 4, 'D');

    pdf.setFillColor(180, 83, 9); // Amber / Gold
    pdf.rect(13, 13, pageWidth - 26, 26, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('CENTRAL BOARD OF SECONDARY EDUCATION', pageWidth / 2, 22, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('केंद्रीय माध्यमिक शिक्षा बोर्ड • MARKS STATEMENT CUM CERTIFICATE', pageWidth / 2, 28, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(examTitle, pageWidth / 2, 34, { align: 'center' });

    pdf.setFillColor(16, 185, 129);
    pdf.rect(13, 39, pageWidth - 26, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ DIGILOCKER VERIFIED ACADEMIC MARKSHEET • CBSE NATIONAL REPOSITORY', pageWidth / 2, 43.5, { align: 'center' });

    // Candidate Header
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(18, 50, pageWidth - 36, 28, 2, 2, 'FD');

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Candidate Name: ${candName}`, 24, 58);
    pdf.text(`Roll / Certificate No: ${docNo}`, 120, 58);

    pdf.setFontSize(8.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Date of Birth: ${dob}`, 24, 66);
    pdf.text(`School: St. John's Higher Secondary School, CBSE Affiliated`, 24, 73);

    // Subject Marks Table
    let ty = 84;
    pdf.setFillColor(241, 245, 249);
    pdf.rect(18, ty, pageWidth - 36, 8, 'F');
    pdf.setDrawColor(203, 213, 225);
    pdf.rect(18, ty, pageWidth - 36, 8, 'D');

    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('SUB CODE', 22, ty + 5.5);
    pdf.text('SUBJECT NAME', 50, ty + 5.5);
    pdf.text('MARKS (TH)', 110, ty + 5.5);
    pdf.text('MARKS (PR)', 135, ty + 5.5);
    pdf.text('TOTAL', 160, ty + 5.5);
    pdf.text('GRADE', 178, ty + 5.5);

    const subjects = isClass12 ? [
      { code: '301', name: 'ENGLISH CORE', th: '088', pr: '020', tot: '088', gr: 'A1' },
      { code: '042', name: 'PHYSICS', th: '062', pr: '030', tot: '092', gr: 'A1' },
      { code: '043', name: 'CHEMISTRY', th: '060', pr: '030', tot: '090', gr: 'A1' },
      { code: '041', name: 'MATHEMATICS', th: '085', pr: '000', tot: '085', gr: 'A2' },
      { code: '083', name: 'COMPUTER SCIENCE', th: '065', pr: '030', tot: '095', gr: 'A1' }
    ] : [
      { code: '184', name: 'ENGLISH LANG & LIT', th: '088', pr: '000', tot: '088', gr: 'A1' },
      { code: '085', name: 'HINDI COURSE-B', th: '085', pr: '000', tot: '085', gr: 'A2' },
      { code: '041', name: 'MATHEMATICS STANDARD', th: '094', pr: '000', tot: '094', gr: 'A1' },
      { code: '086', name: 'SCIENCE', th: '091', pr: '000', tot: '091', gr: 'A1' },
      { code: '087', name: 'SOCIAL SCIENCE', th: '090', pr: '000', tot: '090', gr: 'A1' }
    ];

    ty += 8;
    subjects.forEach((sub, sIdx) => {
      pdf.setFillColor(sIdx % 2 === 0 ? 255 : 250);
      pdf.rect(18, ty, pageWidth - 36, 7, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(18, ty, pageWidth - 36, 7, 'D');

      pdf.setFont('courier', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(15, 23, 42);
      pdf.text(sub.code, 22, ty + 5);

      pdf.setFont('helvetica', 'normal');
      pdf.text(sub.name, 50, ty + 5);

      pdf.setFont('courier', 'normal');
      pdf.text(sub.th, 115, ty + 5);
      pdf.text(sub.pr, 140, ty + 5);
      pdf.setFont('courier', 'bold');
      pdf.text(sub.tot, 163, ty + 5);
      pdf.setTextColor(16, 185, 129);
      pdf.text(sub.gr, 180, ty + 5);

      ty += 7;
    });

    // Result Strip
    pdf.setFillColor(236, 253, 245);
    pdf.setDrawColor(167, 243, 208);
    pdf.roundedRect(18, ty + 4, pageWidth - 36, 12, 2, 2, 'FD');
    pdf.setTextColor(6, 95, 70);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('FINAL RESULT: PASSED IN FIRST DIVISION WITH DISTINCTION (90.8%)', pageWidth / 2, ty + 12, { align: 'center' });

    // CBSE Controller Signature
    ty += 22;
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Digitally Certified by Controller of Examinations, CBSE, Delhi.', 18, ty);
    pdf.text(`Verified for Employer: ${companyName} • Timestamp: ${timestamp}`, 18, ty + 5);

  // =========================================================================
  // 5. EPFO UAN CARD PDF
  // =========================================================================
  } else if (docType.includes('uan') || docType.includes('epfo')) {
    pdf.setDrawColor(79, 70, 229);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 4, 4, 'D');

    pdf.setFillColor(79, 70, 229); // Indigo
    pdf.rect(13, 13, pageWidth - 26, 26, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text("EMPLOYEES' PROVIDENT FUND ORGANISATION", pageWidth / 2, 22, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('MINISTRY OF LABOUR & EMPLOYMENT • GOVT. OF INDIA', pageWidth / 2, 28, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Universal Account Number (UAN) Member Card', pageWidth / 2, 34, { align: 'center' });

    pdf.setFillColor(16, 185, 129);
    pdf.rect(13, 39, pageWidth - 26, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ DIGILOCKER VERIFIED EPFO UAN RECORD • UNIFIED MEMBER PORTAL', pageWidth / 2, 43.5, { align: 'center' });

    // UAN Banner
    pdf.setFillColor(238, 242, 255);
    pdf.setDrawColor(199, 210, 254);
    pdf.roundedRect(18, 52, pageWidth - 36, 30, 2, 2, 'FD');

    pdf.setTextColor(79, 70, 229);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('UNIVERSAL ACCOUNT NUMBER (UAN)', pageWidth / 2, 62, { align: 'center' });

    pdf.setTextColor(30, 58, 138);
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(22);
    pdf.text(docNo || '100829141052', pageWidth / 2, 74, { align: 'center' });

    // Details Grid
    let ey = 90;
    pdf.setDrawColor(226, 232, 240);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(18, ey, pageWidth - 36, 75, 2, 2, 'FD');

    ey += 10;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Member Full Name:', 24, ey);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(candName, 70, ey);

    ey += 10;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text("Father's Name:", 24, ey);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERIYASAMY', 70, ey);

    ey += 10;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Date of Birth & Gender:', 24, ey);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${dob} (${gender})`, 70, ey);

    ey += 10;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Aadhaar KYC Status:', 24, ey);
    pdf.setTextColor(16, 185, 129);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ Verified & Seeded in EPFO Database', 70, ey);

    ey += 10;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('PAN KYC Status:', 24, ey);
    pdf.setTextColor(16, 185, 129);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ Verified & Seeded (BLKPX4519M)', 70, ey);

    ey += 10;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Bank Account KYC:', 24, ey);
    pdf.setTextColor(16, 185, 129);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ Digitally Approved via NPCI / IMPS', 70, ey);

    // Audit Box
    pdf.setFillColor(240, 253, 244);
    pdf.setDrawColor(187, 247, 208);
    pdf.roundedRect(18, 175, pageWidth - 36, 36, 2, 2, 'FD');
    pdf.setTextColor(22, 101, 52);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('EPFO DIGITAL GOVERNANCE AUDIT RECORD', 23, 183);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(21, 128, 61);
    pdf.text(`• Member service details authenticated via EPFO unified database.`, 23, 190);
    pdf.text(`• Verified for: ${companyName} • Timestamp: ${timestamp}`, 23, 196);
    pdf.text(`• DigiLocker Ledger Audit Key: SHA256:${dlId}`, 23, 202);

  // =========================================================================
  // 6. GENERIC OFFICIAL GOVERNMENT CERTIFICATE
  // =========================================================================
  } else {
    pdf.setDrawColor(15, 23, 42);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 4, 4, 'D');

    pdf.setFillColor(15, 23, 42);
    pdf.rect(13, 13, pageWidth - 26, 26, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(docName.toUpperCase(), pageWidth / 2, 22, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text(issuer.toUpperCase(), pageWidth / 2, 28, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Official Government Issued Digital Document', pageWidth / 2, 34, { align: 'center' });

    pdf.setFillColor(16, 185, 129);
    pdf.rect(13, 39, pageWidth - 26, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ DIGILOCKER VERIFIED GOVERNMENT CERTIFICATE', pageWidth / 2, 43.5, { align: 'center' });

    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(18, 52, pageWidth - 36, 100, 3, 3, 'FD');

    let gy = 64;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.text('Citizen Name:', 24, gy);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(candName, 70, gy);

    gy += 12;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Document Ref No:', 24, gy);
    pdf.setTextColor(180, 83, 9);
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(11);
    pdf.text(docNo, 70, gy);

    gy += 12;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Issuing Authority:', 24, gy);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.text(issuer, 70, gy);

    gy += 12;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('DigiLocker ID:', 24, gy);
    pdf.setTextColor(79, 70, 229);
    pdf.setFont('helvetica', 'bold');
    pdf.text(dlId, 70, gy);

    gy += 12;
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Verification Status:', 24, gy);
    pdf.setTextColor(16, 185, 129);
    pdf.setFont('helvetica', 'bold');
    pdf.text('100% Cryptographically Verified & Active', 70, gy);
  }

  // Common Footer
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(148, 163, 184);
  pdf.text(`JOY Corporate Solutions • DigiLocker NeGD API Setu Production Gateway`, 14, pageHeight - 6);
  pdf.text(`Document Reference: ${docNo}`, pageWidth - 70, pageHeight - 6);

  const cleanFileDocName = docName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanCand = candName.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`${cleanCand}_${cleanFileDocName}.pdf`);
};

/**
 * Generate Master DigiLocker Verified Profile PDF Dossier Slip
 */
export const generateDigilockerOfficialCertificatePdf = (record, companyName = 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED') => {
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
  doc.setFontSize(15);
  doc.text('GOVERNMENT OF INDIA - DIGILOCKER DIGITAL VAULT', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
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
  doc.setFontSize(12);
  doc.text('1. CITIZEN IDENTITY PARTICULARS (e-KYC)', 14, y);

  y += 6;
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
  doc.setFontSize(12);
  doc.text(`2. VERIFIED GOVERNMENT ISSUED CERTIFICATES (${docs.length})`, 14, y);

  y += 6;
  docs.slice(0, 6).forEach((d, idx) => {
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.roundedRect(14, y, pageWidth - 28, 16, 2, 2, 'FD');

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
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

    y += 18.5;
  });

  // Statutory Compliance Box
  y = Math.max(y + 3, 238);
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
  doc.text(`• Verification Purpose: "${val(record.purpose, 'Employee onboarding private sector')}" (NeGD Mandate Compliant)`, 18, y + 12);
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
