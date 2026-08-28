/**
 * Verification & Data-Fetching Requirements Engine
 * Defines mandatory field prerequisites for all 47+ identity & background verification checks.
 */

export const VERIFICATION_REQUIREMENTS = [
  {
    id: 'aadhaar',
    name: 'Aadhaar e-KYC & Data Fetch',
    shortName: 'Aadhaar e-KYC',
    icon: '🪪',
    category: 'Identity & Biometric',
    requiredFields: [
      { key: 'aadhaarNo', label: 'Aadhaar Number', section: 'govt', pattern: /^\d{12}$/ },
      { key: 'dob', label: 'Date of Birth (DOB)', section: 'personal' },
      { key: 'fullName', label: 'Candidate Full Name', section: 'personal' }
    ],
    optionalFields: [
      { key: 'mobile', label: 'Mobile (for OTP e-KYC)', section: 'address' }
    ],
    outcome: 'Fetches official UIDAI Name, Gender, Photo, Care-Of & Full Residential Address'
  },
  {
    id: 'pan',
    name: 'Income Tax PAN Card Verification',
    shortName: 'PAN Verification',
    icon: '💳',
    category: 'Tax & Compliance',
    requiredFields: [
      { key: 'panNo', label: 'PAN Card Number', section: 'govt', pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i },
      { key: 'fullName', label: 'Candidate Full Name', section: 'personal' },
      { key: 'dob', label: 'Date of Birth (DOB)', section: 'personal' }
    ],
    optionalFields: [
      { key: 'fatherName', label: "Father's Name", section: 'personal' }
    ],
    outcome: 'Validates PAN Active Status, Category, Name Match % & Aadhaar-PAN Linkage'
  },
  {
    id: 'bankCheck',
    name: 'Bank Account & Penny Drop (NPCI)',
    shortName: 'Bank Settlement',
    icon: '🏦',
    category: 'Payroll & Banking',
    requiredFields: [
      { key: 'accountNo', label: 'Bank Account Number', section: 'bank' },
      { key: 'ifscCode', label: 'Bank IFSC Code', section: 'bank', pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/i },
      { key: 'fullName', label: 'Beneficiary Full Name', section: 'personal' }
    ],
    optionalFields: [
      { key: 'bankName', label: 'Bank Name', section: 'bank' }
    ],
    outcome: 'Deposits ₹1 test credit and matches Beneficiary Registered Name with Employer records'
  },
  {
    id: 'passport',
    name: 'Passport Seva Verification',
    shortName: 'Passport Check',
    icon: '✈️',
    category: 'Identity & Travel',
    requiredFields: [
      { key: 'passportNo', label: 'Passport Number', section: 'govt', pattern: /^[A-Z][0-9]{7}$/i },
      { key: 'dob', label: 'Date of Birth (DOB)', section: 'personal' },
      { key: 'fullName', label: 'Full Legal Name', section: 'personal' }
    ],
    optionalFields: [],
    outcome: 'Verifies Passport file number, issue date, expiry date and citizenship credentials'
  },
  {
    id: 'drivingLicense',
    name: 'MoRTH Driving License (DL) Check',
    shortName: 'Driving License',
    icon: '🚗',
    category: 'Identity & Transport',
    requiredFields: [
      { key: 'drivingLicenseNo', label: 'Driving License Number', section: 'govt' },
      { key: 'dob', label: 'Date of Birth (DOB)', section: 'personal' }
    ],
    optionalFields: [],
    outcome: 'Validates DL Class of Vehicle (MCWG/LMV/TRANS), badge endorsement & state records'
  },
  {
    id: 'uan',
    name: 'EPFO UAN & Service History Verification',
    shortName: 'EPFO / UAN',
    icon: '📋',
    category: 'Employment History',
    requiredFields: [
      { key: 'uanEpf', label: '12-Digit EPFO UAN', section: 'govt', pattern: /^\d{12}$/ }
    ],
    optionalFields: [
      { key: 'mobile', label: 'EPFO-Linked Mobile Number', section: 'address' },
      { key: 'fullName', label: 'Member Name', section: 'personal' }
    ],
    outcome: 'Fetches past employer service history, EPFO member IDs, join/exit dates & dual-employment flags'
  },
  {
    id: 'mobileOtp',
    name: 'Mobile SMS OTP Real-Time Verification',
    shortName: 'Mobile SMS OTP',
    icon: '📱',
    category: 'Contact Verification',
    requiredFields: [
      { key: 'mobile', label: '10-Digit Mobile Number', section: 'address', pattern: /^\d{10}$/ }
    ],
    optionalFields: [],
    outcome: 'Sends live 6-digit cryptographic OTP to mobile device with 10-minute expiry'
  },
  {
    id: 'emailOtp',
    name: 'Email Address OTP Verification',
    shortName: 'Email OTP',
    icon: '📧',
    category: 'Contact Verification',
    requiredFields: [
      { key: 'email', label: 'Official Candidate Email', section: 'address', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    ],
    optionalFields: [],
    outcome: 'Dispatches secure authentication OTP code directly to candidate inbox'
  },
  {
    id: 'faceCapture',
    name: 'AI Biometric Face Match & Liveness',
    shortName: 'AI Face Liveness',
    icon: '👤',
    category: 'Biometrics & Anti-Spoof',
    requiredFields: [
      { key: 'fullName', label: 'Candidate Full Name', section: 'personal' },
      { key: 'aadhaarNo', label: 'Aadhaar Reference Photo', section: 'govt' }
    ],
    optionalFields: [],
    outcome: 'Captures 3D live webcam frames, extracts 512D ArcFace embeddings and calculates age-progression concordance'
  }
];

/**
 * Evaluates current form data to return:
 * 1. readyChecks: List of verification checks that have all required fields filled
 * 2. pendingChecks: List of verification checks that need more fields, along with missing field list
 * 3. readyCheckIds: Set of ready check IDs
 * 4. completionScore: % of core checks ready
 */
export const evaluateVerificationReadiness = (formData = {}) => {
  const readyChecks = [];
  const pendingChecks = [];
  const readyCheckIds = new Set();

  VERIFICATION_REQUIREMENTS.forEach((check) => {
    const missingFields = [];

    check.requiredFields.forEach((field) => {
      const val = (formData[field.key] || '').toString().trim();
      if (!val) {
        missingFields.push(field);
      } else if (field.pattern && !field.pattern.test(val.replace(/\s+/g, ''))) {
        missingFields.push({ ...field, invalidFormat: true });
      }
    });

    if (missingFields.length === 0) {
      readyChecks.push(check);
      readyCheckIds.add(check.id);
    } else {
      pendingChecks.push({
        ...check,
        missingFields,
        missingCount: missingFields.length
      });
    }
  });

  const completionScore = Math.round((readyChecks.length / VERIFICATION_REQUIREMENTS.length) * 100);

  return {
    readyChecks,
    pendingChecks,
    readyCheckIds,
    completionScore,
    totalChecks: VERIFICATION_REQUIREMENTS.length
  };
};

/**
 * Returns field ownership status
 * If field has value -> 'filled_by_hr'
 * If field is explicitly delegated or empty -> 'delegated_to_employee'
 */
export const getFieldOwnershipStatus = (fieldName, fieldValue, delegatedFieldsMap = {}) => {
  const isExplicitlyDelegated = !!delegatedFieldsMap[fieldName];
  const hasValue = !!(fieldValue && fieldValue.toString().trim().length > 0);

  if (isExplicitlyDelegated || !hasValue) {
    return {
      status: 'employee',
      label: 'To be filled by Employee via Link 📱',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      borderClass: 'border-amber-300 bg-amber-50/20'
    };
  }

  return {
    status: 'hr',
    label: 'Filled by HR 🏢',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    borderClass: 'border-slate-300 bg-white'
  };
};
