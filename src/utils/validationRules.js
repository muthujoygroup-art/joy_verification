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
