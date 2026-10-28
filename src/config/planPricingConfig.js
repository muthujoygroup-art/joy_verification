/**
 * JOY TrueProfile - Single Plan Checklist & Dynamic Pricing Configuration
 * Standard Indian BGV & Corporate Statutory Due Diligence Rate Card
 */

export const PROFILE_VOLUME_PRESETS = [
  { id: 'vol_100', count: 100, label: '100 Profiles', desc: 'Ideal for startups & small teams', badge: 'Starter' },
  { id: 'vol_300', count: 300, label: '300 Profiles', desc: 'Mid-size companies & quarterly cohorts', badge: 'Most Popular ⭐', isPopular: true },
  { id: 'vol_500', count: 500, label: '500 Profiles', desc: 'Large enterprises & manufacturing workforces', badge: 'Enterprise' },
  { id: 'vol_custom', count: 1000, label: 'Custom Profiles', desc: 'Flexible volume on demand', isCustom: true }
];

export const EMPLOYEE_VERIFICATION_CHECKS = [
  {
    category: 'Contact Verification',
    items: [
      { id: 'mobile_otp', name: 'Mobile Number Check', subType: 'OTP Verify', rate: 1.0, defaultChecked: true, desc: 'Airtel IQ DLT Carrier SMS 6-digit OTP delivery and validation' },
      { id: 'email_otp', name: 'Email ID Check', subType: 'OTP Verify', rate: 0.5, defaultChecked: true, desc: 'Corporate / personal email verification via secure SMTP OTP code' }
    ]
  },
  {
    category: 'Government Statutory Identity',
    items: [
      { id: 'aadhaar_basic', name: 'Aadhaar Check (Basic)', subType: 'Name, Status', rate: 3.0, defaultChecked: false, desc: 'Instant UIDAI Aadhaar number existence and demographic status check', group: 'aadhaar' },
      { id: 'aadhaar_detailed', name: 'Aadhaar Check (Detailed)', subType: 'Name, Status, Details & Photo', rate: 8.0, defaultChecked: true, desc: 'Full UIDAI biometric e-KYC with photo, address, and offline paperless XML', group: 'aadhaar' },
      { id: 'pan_basic', name: 'PAN Check (Basic)', subType: 'Name, Status', rate: 2.5, defaultChecked: false, desc: 'NSDL Income Tax PAN active verification and name match', group: 'pan' },
      { id: 'pan_detailed', name: 'PAN Check (Detailed)', subType: 'Name, Status, Father Name, DOB, Details', rate: 6.0, defaultChecked: true, desc: 'Complete NSDL PAN 2.0 with father name, category, and date of birth match', group: 'pan' }
    ]
  },
  {
    category: 'Financial & Banking',
    items: [
      { id: 'bank_basic', name: 'Bank Account Check', subType: 'IMPS Penny Drop (Name, Status)', rate: 4.0, defaultChecked: true, desc: 'Real-time NPCI IMPS penny-drop validation matching candidate legal title' }
    ]
  },
  {
    category: 'Government Licenses & Civil Identity',
    items: [
      { id: 'dl_basic', name: 'Driving License Check (Basic)', subType: 'Name, Status', rate: 3.0, defaultChecked: false, desc: 'MoRTH Sarathi driving license active validity check', group: 'dl' },
      { id: 'dl_detailed', name: 'Driving License Check (Detailed)', subType: 'Name, Status, Class, Expiry, Details', rate: 7.0, defaultChecked: false, desc: 'Full Sarathi license profile, vehicle classes permitted, and validity dates', group: 'dl' },
      { id: 'voter_basic', name: 'Voter ID Check (Basic)', subType: 'Name, Status', rate: 3.0, defaultChecked: false, desc: 'Election Commission of India EPIC number and name match', group: 'voter' },
      { id: 'voter_detailed', name: 'Voter ID Check (Detailed)', subType: 'Name, Status, Constituency, Details', rate: 6.0, defaultChecked: false, desc: 'Full electoral roll voter dossier, polling station, and state constituency', group: 'voter' },
      { id: 'passport_basic', name: 'Passport Check', subType: 'Name, Status, Passport Validity', rate: 6.0, defaultChecked: false, desc: 'Ministry of External Affairs Passport Seva Kendra verification' }
    ]
  },
  {
    category: 'Social Security & Employment History',
    items: [
      { id: 'esic_basic', name: 'ESIC Check (Basic)', subType: 'Name, Status', rate: 3.0, defaultChecked: false, desc: 'Employees State Insurance Corporation registration and IP validity', group: 'esic' },
      { id: 'esic_detailed', name: 'ESIC Check (Detailed)', subType: 'Name, Status, Employer, Details', rate: 8.0, defaultChecked: false, desc: 'Full ESIC insurance contributions, employer code, and dispensary allocation', group: 'esic' },
      { id: 'epfo_basic', name: 'EPFO Check (Basic)', subType: 'UAN, Name, Status', rate: 4.0, defaultChecked: false, desc: 'EPFO Universal Account Number (UAN) active validation', group: 'epfo' },
      { id: 'epfo_detailed', name: 'EPFO Check (Detailed)', subType: 'Name, Status, Service History, Details', rate: 12.0, defaultChecked: true, desc: 'Comprehensive UAN service history, dual employment detection, and past employers', group: 'epfo' }
    ]
  },
  {
    category: 'Digital Document Vault',
    items: [
      { id: 'digilocker_detailed', name: 'DigiLocker Data Check', subType: 'Detailed Data (Name, Verified Documents)', rate: 8.0, defaultChecked: true, desc: 'Direct government DigiLocker gateway pulling tamper-proof certified documents' }
    ]
  }
];

export const VENDOR_VERIFICATION_CHECKS = [
  {
    category: 'Corporate Tax & Legal Entity',
    items: [
      { id: 'vendor_pan_detailed', name: 'PAN Check (Vendor)', subType: 'Company Name, DIN, GST Details', rate: 8.0, defaultChecked: true, desc: 'Corporate PAN entity check cross-referencing GSTIN and director names' },
      { id: 'vendor_bank_account', name: 'Bank Account Number Check', subType: 'Bank Account Verify (Company Legal Name)', rate: 5.0, defaultChecked: true, desc: 'NPCI IMPS penny-drop validation matching corporate trade name' },
      { id: 'vendor_mca_name', name: 'MCA to Company Name', subType: 'MCA Verify (Company Name Search)', rate: 6.0, defaultChecked: true, desc: 'Ministry of Corporate Affairs name-to-CIN lookup and legal registration verification' },
      { id: 'vendor_gst_details', name: 'GST Check', subType: 'GST Details (Company Name, Active Status, Filings)', rate: 6.0, defaultChecked: true, desc: '15-digit GSTIN active status, legal vs trade name, and tax return filing regularity' }
    ]
  },
  {
    category: 'Corporate Governance & Directorship',
    items: [
      { id: 'vendor_cin_detailed', name: 'CIN Check', subType: 'CIN Detailed Verify (Company Details, Directors, MCA, GST)', rate: 15.0, defaultChecked: true, desc: 'Comprehensive Corporate Identification Number audit: capital, class, ROC, and filings' },
      { id: 'vendor_din_detailed', name: 'DIN Check', subType: 'DIN Detailed Verify (Company, PAN, Director, MCA)', rate: 10.0, defaultChecked: true, desc: 'Director Identification Number profile and Section 164(2) disqualification audit' }
    ]
  },
  {
    category: 'Statutory Licenses & Registrations',
    items: [
      { id: 'vendor_fssai', name: 'FSSAI Check', subType: 'FSSAI Verify (Name, License Details)', rate: 6.0, defaultChecked: false, desc: '14-digit food safety license verification for catering & pantry vendors' },
      { id: 'vendor_udyam', name: 'UDYAM Check', subType: 'UDYAM Verify (Enterprise Name, MSME Category, Details)', rate: 8.0, defaultChecked: true, desc: 'Ministry of MSME official Udyam certificate and enterprise classification' },
      { id: 'vendor_digilocker_detailed', name: 'DigiLocker Data Check', subType: 'Detailed Data (Name, Documents)', rate: 8.0, defaultChecked: false, desc: 'Direct corporate DigiLocker document pull for company incorporation and certificates' },
      { id: 'vendor_vehicle_rc', name: 'Vehicle RC Data Check', subType: 'Detailed Data (Owner Name, Vehicle Details)', rate: 7.0, defaultChecked: false, desc: 'Vahan database vehicle registration and fleet due diligence for transport vendors' }
    ]
  }
];

export const COMMUNICATION_GATEWAYS = [
  { id: 'gw_email', name: 'Email Gateway', subType: 'Default Included', rate: 0.0, defaultChecked: true, isFixed: true, desc: 'Automated candidate invite emails, reminders, and verification notifications' },
  { id: 'gw_sms', name: 'Normal SMS Gateway', subType: 'Airtel IQ DLT Carrier SMS', rate: 0.25, defaultChecked: true, desc: 'Official TRAI DLT approved carrier SMS via Airtel IQ Gateway (Header: JYCORP)' },
  { id: 'gw_whatsapp', name: 'WhatsApp Communication', subType: 'Meta Cloud API verified templates', rate: 0.85, defaultChecked: true, desc: 'Real-time interactive WhatsApp candidate onboarding bot with document photo uploads' }
];

/**
 * Calculates complete itemized breakdown and total payable amount
 */
export function calculateDynamicPlanBill({
  profileCount = 100,
  selectedEmployeeCheckIds = [],
  selectedVendorCheckIds = [],
  selectedGatewayIds = []
}) {
  const count = Math.max(1, Number(profileCount) || 100);

  // Flatten items for easy lookup
  const empMap = new Map();
  EMPLOYEE_VERIFICATION_CHECKS.forEach(cat => cat.items.forEach(it => empMap.set(it.id, it)));

  const vendMap = new Map();
  VENDOR_VERIFICATION_CHECKS.forEach(cat => cat.items.forEach(it => vendMap.set(it.id, it)));

  const gwMap = new Map();
  COMMUNICATION_GATEWAYS.forEach(it => gwMap.set(it.id, it));

  // 1. Calculate per-profile rate from employee checks
  let empRatePerProfile = 0;
  const selectedEmpItems = [];
  selectedEmployeeCheckIds.forEach(id => {
    const item = empMap.get(id);
    if (item) {
      empRatePerProfile += item.rate;
      selectedEmpItems.push(item);
    }
  });

  // 2. Calculate vendor checks rate (applies when company utilizes vendor due diligence)
  let vendorRatePerProfile = 0;
  const selectedVendorItems = [];
  selectedVendorCheckIds.forEach(id => {
    const item = vendMap.get(id);
    if (item) {
      vendorRatePerProfile += item.rate;
      selectedVendorItems.push(item);
    }
  });

  // 3. Calculate gateway rate per profile
  let gatewayRatePerProfile = 0;
  const selectedGwItems = [];
  selectedGatewayIds.forEach(id => {
    const item = gwMap.get(id);
    if (item) {
      gatewayRatePerProfile += item.rate;
      selectedGwItems.push(item);
    }
  });

  // Consolidated rate per profile
  const totalRatePerProfile = Math.round((empRatePerProfile + vendorRatePerProfile + gatewayRatePerProfile) * 100) / 100;
  const subtotal = Math.round(totalRatePerProfile * count);
  const gstRate = 18.0;
  const gstAmount = Math.round(subtotal * (gstRate / 100.0));
  const totalAmount = subtotal + gstAmount;

  return {
    profileCount: count,
    empRatePerProfile,
    vendorRatePerProfile,
    gatewayRatePerProfile,
    totalRatePerProfile,
    subtotal,
    gstRate,
    gstAmount,
    totalAmount,
    selectedEmpItems,
    selectedVendorItems,
    selectedGwItems,
    totalSelectedChecksCount: selectedEmpItems.length + selectedVendorItems.length + selectedGwItems.length
  };
}
