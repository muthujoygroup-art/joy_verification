/**
 * 🛡️ Validation & Formatting Utilities for Candidate Data Fields
 * Strictly enforces data types, formatting masks, and statutory constraints.
 */

// 1. Email Validation (Must contain @ and valid domain)
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
};

// 2. PAN Card Validation & Auto-Uppercase (Format: ABCDE1234F)
export const formatPan = (pan) => {
  if (!pan || typeof pan !== 'string') return '';
  return pan.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
};

export const validatePan = (pan) => {
  if (!pan) return false;
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return regex.test(pan.trim().toUpperCase());
};

// 3. Aadhaar Number Formatting (12 Digits with auto-spacing: XXXX-XXXX-1234)
export const formatAadhaar = (aadhaar) => {
  if (!aadhaar || typeof aadhaar !== 'string') return '';
  const digits = aadhaar.replace(/\D/g, '').slice(0, 12);
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
};

export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) return false;
  const digits = aadhaar.replace(/\D/g, '');
  return digits.length === 12;
};

// 4. Mobile Number Validation (Exactly 10 Digits)
export const formatMobile = (mobile) => {
  if (!mobile || typeof mobile !== 'string') return '';
  return mobile.replace(/\D/g, '').slice(0, 10);
};

export const validateMobile = (mobile) => {
  if (!mobile) return false;
  const digits = mobile.replace(/\D/g, '');
  return digits.length === 10;
};

// 5. IFSC Code Validation & Formatting (Format: HDFC0001234 - 4 letters, 0, 6 alphanumeric)
export const formatIfsc = (ifsc) => {
  if (!ifsc || typeof ifsc !== 'string') return '';
  return ifsc.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
};

export const validateIfsc = (ifsc) => {
  if (!ifsc) return false;
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return regex.test(ifsc.trim().toUpperCase());
};

// 6. Bank Account Number Validation (9 to 18 digits numeric)
export const formatBankAccount = (acc) => {
  if (!acc || typeof acc !== 'string') return '';
  return acc.replace(/\D/g, '').slice(0, 18);
};

export const validateBankAccount = (acc) => {
  if (!acc) return false;
  const digits = acc.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 18;
};

// 7. Pincode Validation (Exactly 6 Digits)
export const formatPincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') return '';
  return pincode.replace(/\D/g, '').slice(0, 6);
};

export const validatePincode = (pincode) => {
  if (!pincode) return false;
  const digits = pincode.replace(/\D/g, '');
  return digits.length === 6;
};

// 8. EPFO UAN / PF Number (12 Digits)
export const formatUan = (uan) => {
  if (!uan || typeof uan !== 'string') return '';
  return uan.replace(/\D/g, '').slice(0, 12);
};

export const validateUan = (uan) => {
  if (!uan) return false;
  const digits = uan.replace(/\D/g, '');
  return digits.length === 12;
};

// 9. Passport Validation & Auto-Uppercase (Format: A1234567)
export const formatPassport = (pass) => {
  if (!pass || typeof pass !== 'string') return '';
  return pass.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
};

export const validatePassport = (pass) => {
  if (!pass) return false;
  const regex = /^[A-Z]{1}[0-9]{7}$/;
  return regex.test(pass.trim().toUpperCase());
};

// 10. Driving License Validation & Auto-Uppercase (Format: TN-01-2022-0001234 or alphanumeric)
export const formatDrivingLicense = (dl) => {
  if (!dl || typeof dl !== 'string') return '';
  return dl.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20);
};

export const validateDrivingLicense = (dl) => {
  if (!dl) return false;
  return dl.trim().length >= 10;
};

// 11. Voter ID Validation & Auto-Uppercase (Format: ABC1234567)
export const formatVoterId = (voterId) => {
  if (!voterId || typeof voterId !== 'string') return '';
  return voterId.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
};

export const validateVoterId = (voterId) => {
  if (!voterId) return false;
  const regex = /^[A-Z]{3}[0-9]{7}$/;
  return regex.test(voterId.trim().toUpperCase());
};

// 12. Field Warning Popup Generator
export const validateFieldWithWarning = (fieldType, value) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  switch (fieldType) {
    case 'pan':
      if (trimmed.length > 0 && trimmed.length < 10) return 'PAN Card must be exactly 10 alphanumeric characters (e.g. ABCDE1234F).';
      if (trimmed.length === 10 && !validatePan(trimmed)) return 'Invalid PAN format! First 5 characters must be uppercase letters, next 4 digits, last 1 letter.';
      break;
    case 'aadhaar':
      const aDigits = trimmed.replace(/\D/g, '');
      if (aDigits.length > 0 && aDigits.length < 12) return 'Aadhaar Number must be exactly 12 digits.';
      break;
    case 'mobile':
      const mDigits = trimmed.replace(/\D/g, '');
      if (mDigits.length > 0 && mDigits.length < 10) return 'Mobile Number must be exactly 10 digits.';
      break;
    case 'ifsc':
      if (trimmed.length > 0 && trimmed.length < 11) return 'IFSC Code must be exactly 11 characters (e.g. HDFC0001234).';
      if (trimmed.length === 11 && !validateIfsc(trimmed)) return 'Invalid IFSC Code! 5th character must be digit 0.';
      break;
    case 'pincode':
      const pDigits = trimmed.replace(/\D/g, '');
      if (pDigits.length > 0 && pDigits.length < 6) return 'Pincode must be exactly 6 digits.';
      break;
    case 'uan':
      const uDigits = trimmed.replace(/\D/g, '');
      if (uDigits.length > 0 && uDigits.length < 12) return 'EPFO UAN must be exactly 12 digits.';
      break;
    case 'passport':
      if (trimmed.length > 0 && trimmed.length < 8) return 'Passport Number must be 8 alphanumeric characters (e.g. A1234567).';
      break;
    default:
      return null;
  }
  return null;
};

// 13. PII & Password Data Masking Helpers for Browser UI & Exports
export const maskAadhaar = (val) => {
  if (!val || typeof val !== 'string') return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 4) {
    return `XXXX-XXXX-${digits.slice(-4)}`;
  }
  return 'XXXX-XXXX-****';
};

export const maskPan = (val) => {
  if (!val || typeof val !== 'string') return '';
  const clean = val.trim().toUpperCase();
  if (clean.length === 10) {
    return `${clean.slice(0, 5)}****${clean.slice(-1)}`;
  }
  return '*****';
};

export const maskBankAccount = (val) => {
  if (!val || typeof val !== 'string') return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 4) {
    return `••••••••${digits.slice(-4)}`;
  }
  return '••••••••';
};

export const maskMobile = (val) => {
  if (!val || typeof val !== 'string') return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 10) {
    return `+91 ${digits.slice(0, 2)}****${digits.slice(-4)}`;
  }
  return '+91 *******';
};

export const maskPassword = (val) => {
  return '••••••••';
};

/**
 * 📅 Excel Serial Date & Universal Date Formatter
 * Converts raw Excel date numbers (e.g., 37824) to formatted DD-MM-YYYY dates.
 * Also standardizes ISO strings, DD/MM/YYYY, etc.
 */
export const excelSerialToDate = (val) => {
  if (val === null || val === undefined || val === '') return '';
  let numVal = val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    // Check if it is a pure integer string of 4-5 digits (Excel serial)
    if (/^\d{4,5}$/.test(trimmed)) {
      numVal = parseInt(trimmed, 10);
    } else {
      // Check if string contains serial with trailing text e.g. "37824 (MALE)"
      const serialMatch = trimmed.match(/^(\d{4,5})\s*(.*)$/);
      if (serialMatch) {
        numVal = parseInt(serialMatch[1], 10);
        const suffix = serialMatch[2];
        if (numVal > 1000 && numVal < 70000) {
          const utc_days = Math.floor(numVal - 25569);
          const date = new Date(utc_days * 86400 * 1000);
          const y = date.getUTCFullYear();
          const m = String(date.getUTCMonth() + 1).padStart(2, '0');
          const d = String(date.getUTCDate()).padStart(2, '0');
          const formatted = `${d}-${m}-${y}`;
          return suffix ? `${formatted} ${suffix}` : formatted;
        }
      }
    }
  }

  if (typeof numVal === 'number' && numVal > 1000 && numVal < 70000) {
    const utc_days = Math.floor(numVal - 25569);
    const date = new Date(utc_days * 86400 * 1000);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${d}-${m}-${y}`;
  }

  return String(val);
};

export const formatDisplayDate = (val) => {
  if (!val) return '—';
  const converted = excelSerialToDate(val);
  if (!converted || converted === '—') return '—';
  
  // If in YYYY-MM-DD format, format nicely as DD-MM-YYYY
  const isoMatch = converted.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const y = isoMatch[1];
    const m = isoMatch[2].padStart(2, '0');
    const d = isoMatch[3].padStart(2, '0');
    return `${d}-${m}-${y}`;
  }
  return converted;
};

/**
 * 🔍 Duplicate Check Helper
 * Checks if email, mobile, or document number (Aadhaar, PAN, Bank, Passport, UAN, DL) is already attached to another profile.
 * Returns { isDuplicate: true/false, field: 'Aadhaar Card Number', name: 'John Doe', val: '1234' }
 */
export const checkProfileDocumentConflict = (fieldValues = {}, candidatesList = [], currentTokenOrId = null) => {
  if (!candidatesList || !Array.isArray(candidatesList) || candidatesList.length === 0) {
    return { isDuplicate: false };
  }

  const cleanCurrent = (currentTokenOrId || '').toString().toLowerCase().trim();

  // Normalize inputs
  const inputEmail = (fieldValues.email || '').toString().trim().toLowerCase();
  const inputMobile = (fieldValues.mobile || '').toString().replace(/\D/g, '');
  const inputAadhaar = (fieldValues.aadhaarNo || fieldValues.aadhaar_no || fieldValues.aadhaar || '').toString().replace(/\D/g, '');
  const inputPan = (fieldValues.panNo || fieldValues.panNumber || fieldValues.pan || '').toString().trim().toUpperCase();
  const inputBank = (fieldValues.bankAccountNo || fieldValues.accountNumber || fieldValues.accountNo || fieldValues.bankAccount || '').toString().replace(/\D/g, '');
  const inputPassport = (fieldValues.passportNo || fieldValues.passportNumber || fieldValues.passport || '').toString().trim().toUpperCase();
  const inputUan = (fieldValues.pfNumber || fieldValues.uan || fieldValues.uanEpf || '').toString().replace(/\D/g, '');
  const inputDl = (fieldValues.drivingLicenseNo || fieldValues.dlNumber || fieldValues.dlNo || fieldValues.drivingLicense || '').toString().trim().toUpperCase();

  for (const c of candidatesList) {
    if (!c) continue;
    const cToken = (c.token || c.id || '').toString().toLowerCase().trim();
    if (cleanCurrent && (cToken === cleanCurrent || c.id?.toLowerCase() === cleanCurrent)) {
      continue; // Skip comparing against self
    }

    const cName = c.name || 'another candidate profile';
    const cEmail = (c.email || '').toString().trim().toLowerCase();
    const cMobile = (c.mobile || '').toString().replace(/\D/g, '');
    const cAadhaar = (c.aadhaarNo || c.aadhaar_no || '').toString().replace(/\D/g, '');
    
    const jf = c.joiningFormData || c.joining_form_data || {};
    const attrs = c.verifiedAttributes || c.verified_attributes || {};

    const cPan = (jf.panNo || attrs.pan?.pan_number || c.panNo || '').toString().trim().toUpperCase();
    const cBank = (jf.bankAccountNo || attrs.bank?.account_number || c.bankAccountNo || '').toString().replace(/\D/g, '');
    const cPassport = (jf.passportNo || attrs.passport?.passport_number || c.passportNo || '').toString().trim().toUpperCase();
    const cUan = (c.pfNumber || c.pf_number || jf.pfNumber || '').toString().replace(/\D/g, '');
    const cDl = (jf.drivingLicenseNo || attrs.drivingLicense?.dl_number || c.dlNumber || '').toString().trim().toUpperCase();

    if (inputEmail && inputEmail.includes('@') && cEmail === inputEmail) {
      return { isDuplicate: true, field: 'Email Address', name: cName, val: inputEmail };
    }
    if (inputMobile && inputMobile.length === 10 && cMobile === inputMobile) {
      return { isDuplicate: true, field: 'Mobile Number', name: cName, val: inputMobile };
    }
    if (inputAadhaar && inputAadhaar.length === 12 && cAadhaar === inputAadhaar) {
      return { isDuplicate: true, field: 'Aadhaar Card Number', name: cName, val: inputAadhaar };
    }
    if (inputPan && inputPan.length === 10 && cPan === inputPan) {
      return { isDuplicate: true, field: 'PAN Card Number', name: cName, val: inputPan };
    }
    if (inputBank && inputBank.length >= 9 && cBank === inputBank) {
      return { isDuplicate: true, field: 'Bank Account Number', name: cName, val: inputBank };
    }
    if (inputPassport && inputPassport.length >= 8 && cPassport === inputPassport) {
      return { isDuplicate: true, field: 'Passport Number', name: cName, val: inputPassport };
    }
    if (inputUan && inputUan.length === 12 && cUan === inputUan) {
      return { isDuplicate: true, field: 'EPFO UAN Number', name: cName, val: inputUan };
    }
    if (inputDl && inputDl.length >= 10 && cDl === inputDl) {
      return { isDuplicate: true, field: 'Driving License Number', name: cName, val: inputDl };
    }
  }

  return { isDuplicate: false };
};
