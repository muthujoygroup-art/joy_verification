/**
 * JOY DATA VERIFICATION - CENTRAL 7-CATEGORY EMPLOYEE PROFILE REGISTRY
 * Standard configuration schema defining specialized fields, required document upload slots,
 * and statutory signing paper templates across all 7 industry verticals.
 */

export const EMPLOYEE_CATEGORIES = {
  it_tech: {
    key: 'it_tech',
    title: 'IT & Software Engineering',
    subtitle: 'Software developers, QA, Cloud engineers & IT product teams',
    badge: 'Tech & Product',
    colorTheme: 'cyan',
    icon: 'code',
    defaultDelegation: {
      githubUrl: 'link',
      primaryTechStack: 'link',
      wfhAssetSerial: 'hr',
      codeIpConsent: 'link'
    },
    specializedFields: [
      { key: 'githubUrl', label: 'GitHub / Tech Portfolio URL', type: 'text', placeholder: 'https://github.com/username', defaultDelegation: 'link' },
      { key: 'primaryTechStack', label: 'Primary Tech Stack & Frameworks', type: 'text', placeholder: 'React, Node.js, Python, PostgreSQL', defaultDelegation: 'link' },
      { key: 'wfhAssetSerial', label: 'Assigned WFH Laptop Serial Number', type: 'text', placeholder: 'C02FX912Q168 / SN-998124', defaultDelegation: 'hr' },
      { key: 'codeIpConsent', label: 'Code IP Authorization Code', type: 'text', placeholder: 'IP-AUTH-2026-IT', defaultDelegation: 'link' }
    ],
    documentSlots: [
      { id: 'github_portfolio', title: 'GitHub / Tech Portfolio Proof', docType: 'portfolio', subtitle: 'Code repository screenshot or technical portfolio PDF', required: true, defaultDelegation: 'link' },
      { id: 'wfh_asset_ack', title: 'WFH Laptop / Hardware Receipt', docType: 'asset_receipt', subtitle: 'Company assigned laptop serial receipt', required: false, defaultDelegation: 'hr' },
      { id: 'degree_cert', title: 'B.Tech / B.E / MCA Degree Certificate', docType: 'education', subtitle: 'Highest engineering or technical degree copy', required: true, defaultDelegation: 'link' }
    ],
    signingPapers: [
      { id: 'it_ip_assignment', title: 'Proprietary Code & Software IP Assignment Agreement', lawReference: 'Indian Copyright Act Section 17(c) & IT Act 2000', description: 'Transfers all source code, software patents, and algorithms created during employment to the company.', sampleCode: 'AGREE-IT-IP-2026' },
      { id: 'it_nda', title: 'Technical Confidentiality & Developer Non-Disclosure NDA', lawReference: 'Defend Trade Secrets Standard Code', description: 'Enforces strictly zero unauthorized code leakage, API key exposure, or external repo commits.', sampleCode: 'AGREE-IT-NDA-2026' }
    ]
  },

  manufacturing: {
    key: 'manufacturing',
    title: 'Manufacturing & Industrial',
    subtitle: 'Plant operators, shopfloor supervisors, quality control & safety engineers',
    badge: 'Industrial Plant',
    colorTheme: 'amber',
    icon: 'factory',
    defaultDelegation: {
      shiftPreference: 'hr',
      plantUnitCode: 'hr',
      safetyShoeSize: 'link',
      ppeGearSize: 'link',
      bloodGroup: 'link'
    },
    specializedFields: [
      { key: 'shiftPreference', label: 'Shift Roster Assignment', type: 'select', options: ['Shift A (06:00 - 14:00)', 'Shift B (14:00 - 22:00)', 'Shift C (22:00 - 06:00)', 'General Shift (09:00 - 18:00)'], defaultDelegation: 'hr' },
      { key: 'plantUnitCode', label: 'Plant Unit / Shopfloor Code', type: 'text', placeholder: 'PLANT-UNIT-04B', defaultDelegation: 'hr' },
      { key: 'safetyShoeSize', label: 'Steel-Toe Safety Shoe Size (UK/EU)', type: 'select', options: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'], defaultDelegation: 'link' },
      { key: 'ppeGearSize', label: 'PPE Uniform Vest Size', type: 'select', options: ['S', 'M', 'L', 'XL', 'XXL'], defaultDelegation: 'link' },
      { key: 'bloodGroup', label: 'Worker Emergency Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], defaultDelegation: 'link' }
    ],
    documentSlots: [
      { id: 'form_3a_medical', title: 'Form 3A Factory Medical Fitness Certificate', docType: 'medical_fitness', subtitle: 'Signed by Certified Factory Certifying Surgeon', required: true, defaultDelegation: 'link' },
      { id: 'industrial_safety_cert', title: 'Industrial Safety & Fire Training Card', docType: 'safety_card', subtitle: 'OSHA / Factory Safety Orientation certificate', required: true, defaultDelegation: 'link' },
      { id: 'machine_operator_license', title: 'Heavy Plant Equipment Operator License', docType: 'operator_license', subtitle: 'Forklift, CNC or Crane operator license', required: false, defaultDelegation: 'link' }
    ],
    signingPapers: [
      { id: 'factory_form_36', title: 'Factory Safety Compliance Undertaking (Form 36)', lawReference: 'Factories Act 1948 Section 7A & State Factory Rules', description: 'Mandatory safety protocol declaration covering personal protective equipment, machinery guards, and hazard reporting.', sampleCode: 'AGREE-MFG-FORM36' },
      { id: 'shift_roster_consent', title: 'Shift Work Roster & Overtime Consent Form', lawReference: 'Factories Act 1948 Section 51, 54 & 59', description: 'Formal agreement to work rotational shifts, night shifts, and emergency plant maintenance duties.', sampleCode: 'AGREE-MFG-ROSTER' }
    ]
  },

  bfsi: {
    key: 'bfsi',
    title: 'BFSI & Fintech Services',
    subtitle: 'Banking staff, loan officers, credit underwriters, NISM/IRDA advisors',
    badge: 'Banking & Finance',
    colorTheme: 'indigo',
    icon: 'landmark',
    defaultDelegation: {
      nismIrdaiLicense: 'link',
      cibilBracket: 'link',
      financialConflictDecl: 'link',
      fidelityBondRef: 'hr'
    },
    specializedFields: [
      { key: 'nismIrdaiLicense', label: 'NISM / IRDAI License Certificate No', type: 'text', placeholder: 'NISM-SERIES-V-A-99120', defaultDelegation: 'link' },
      { key: 'cibilBracket', label: 'CIBIL Credit Score Range', type: 'select', options: ['750+ (Excellent)', '700 - 749 (Good)', '650 - 699 (Fair)', 'Below 650 (Requires Review)'], defaultDelegation: 'link' },
      { key: 'financialConflictDecl', label: 'Securities / Trading Conflict Declaration', type: 'select', options: ['No Conflict - Zero Direct Securities', 'Active Portfolio Declared', 'Family Demat Account Disclosed'], defaultDelegation: 'link' },
      { key: 'fidelityBondRef', label: 'Fidelity Guarantee Bond Reference', type: 'text', placeholder: 'FIDELITY-BOND-2026-BFSI', defaultDelegation: 'hr' }
    ],
    documentSlots: [
      { id: 'nism_irdai_cert', title: 'NISM / IRDAI Advisor License Copy', docType: 'regulatory_cert', subtitle: 'Official certification scan from SEBI / IRDAI portal', required: true, defaultDelegation: 'link' },
      { id: 'cibil_consent_doc', title: 'CIBIL Credit Bureau Authorization Consent', docType: 'cibil_consent', subtitle: 'Signed letter permitting employer CIBIL verification', required: true, defaultDelegation: 'link' },
      { id: 'financial_relieving', title: 'Past Financial Bank Relieving & No-Dues', docType: 'relieving_letter', subtitle: 'Relieving letter with clean audit clearance', required: true, defaultDelegation: 'link' }
    ],
    signingPapers: [
      { id: 'bfsi_aml_bond', title: 'Anti-Money Laundering (AML) & Fidelity Guarantee Bond', lawReference: 'PMLA Act 2002 & RBI Master Direction on Fraud Prevention', description: 'Legal undertaking ensuring strict adherence to Anti-Money Laundering rules, KYC regulations, and financial liability indemnity.', sampleCode: 'AGREE-BFSI-AML' },
      { id: 'financial_data_privacy', title: 'Financial Customer Data Privacy & Ethics Agreement', lawReference: 'RBI Cyber Security Framework & DPDP Act 2023', description: 'Strict non-disclosure of customer account details, loan balances, credit card records, and banking credentials.', sampleCode: 'AGREE-BFSI-PRIVACY' }
    ]
  },

  healthcare: {
    key: 'healthcare',
    title: 'Healthcare & Clinical Services',
    subtitle: 'Doctors, nurses, lab technicians, pharmacists & medical staff',
    badge: 'Clinical & Pharma',
    colorTheme: 'rose',
    icon: 'heart-pulse',
    defaultDelegation: {
      medicalCouncilRegNo: 'link',
      councilRegExpiry: 'link',
      immunizationStatus: 'link',
      cleanroomBslLevel: 'hr'
    },
    specializedFields: [
      { key: 'medicalCouncilRegNo', label: 'State Medical / Nursing Council Reg No', type: 'text', placeholder: 'MCI/NMC-2026-99812', defaultDelegation: 'link' },
      { key: 'councilRegExpiry', label: 'Council Registration Expiry Date', type: 'date', defaultDelegation: 'link' },
      { key: 'immunizationStatus', label: 'Hepatitis B & Covid Immunization Status', type: 'select', options: ['Fully Vaccinated (HepB 3-Doses + Covid)', 'HepB Partial (In Progress)', 'Medical Exemption Filed'], defaultDelegation: 'link' },
      { key: 'cleanroomBslLevel', label: 'Clinical Cleanroom / BSL Level Access', type: 'select', options: ['General Ward / OPD', 'BSL-2 Clinical Lab', 'BSL-3 ICU / Quarantine', 'OT / Surgical Suite'], defaultDelegation: 'hr' }
    ],
    documentSlots: [
      { id: 'medical_council_cert', title: 'State Medical Council / Nursing Registration', docType: 'council_registration', subtitle: 'Valid license copy issued by NMC / State Council', required: true, defaultDelegation: 'link' },
      { id: 'nursing_pharma_license', title: 'Pharmacy / Clinical Practitioner Certificate', docType: 'clinical_license', subtitle: 'Diploma or Degree registration certificate', required: true, defaultDelegation: 'link' },
      { id: 'immunization_card', title: 'Official Immunization & Vaccination Card', docType: 'vaccine_record', subtitle: 'Hepatitis B antibody titre & Covid vaccine record', required: true, defaultDelegation: 'link' }
    ],
    signingPapers: [
      { id: 'patient_privacy_hipaa', title: 'Patient Data Confidentiality & HIPAA/DPDP Agreement', lawReference: 'Digital Personal Data Protection Act 2023 & ICMR Code', description: 'Ensures absolute confidentiality of Electronic Health Records (EHR), medical test results, and patient identities.', sampleCode: 'AGREE-HEALTH-HIPAA' },
      { id: 'biomedical_waste_policy', title: 'Bio-Medical Waste Handling & Clinical Safety Compliance', lawReference: 'Bio-Medical Waste Management Rules 2016', description: 'Mandatory protocol agreement for segregation, treatment, and disposal of clinical waste and sharps.', sampleCode: 'AGREE-HEALTH-WASTE' }
    ]
  },

  logistics: {
    key: 'logistics',
    title: 'Logistics, Fleet & Delivery',
    subtitle: 'Commercial vehicle drivers, delivery partners, warehouse & fleet crews',
    badge: 'Fleet & Logistics',
    colorTheme: 'blue',
    icon: 'truck',
    defaultDelegation: {
      commercialDlBadgeNo: 'link',
      vehicleRcNo: 'hr',
      dlExpiryDate: 'link',
      fleetCategory: 'hr',
      gpsTrackingConsent: 'link'
    },
    specializedFields: [
      { key: 'commercialDlBadgeNo', label: 'Commercial Driving Badge No (HMV/LMV)', type: 'text', placeholder: 'KA-01-BADGE-8812', defaultDelegation: 'link' },
      { key: 'vehicleRcNo', label: 'Assigned Fleet Vehicle RC No', type: 'text', placeholder: 'KA-05-EV-9912', defaultDelegation: 'hr' },
      { key: 'dlExpiryDate', label: 'Commercial Driving License Expiry', type: 'date', defaultDelegation: 'link' },
      { key: 'fleetCategory', label: 'Vehicle Fleet Category', type: 'select', options: ['Two-Wheeler EV Delivery', 'LMV Light Commercial (Tata Ace/Mahindra Bolero)', 'HMV Heavy Truck / Trailer', 'Warehouse Forklift'], defaultDelegation: 'hr' },
      { key: 'gpsTrackingConsent', label: 'Real-Time GPS Tracking Consent Code', type: 'text', placeholder: 'GPS-CONSENT-2026', defaultDelegation: 'link' }
    ],
    documentSlots: [
      { id: 'commercial_dl_copy', title: 'Commercial Driving License (Front & Back)', docType: 'driving_license', subtitle: 'Clear color scan of valid transport DL with badge endorsement', required: true, defaultDelegation: 'link' },
      { id: 'police_noc_pcc', title: 'Police Clearance Certificate (PCC / NOC)', docType: 'police_clearance', subtitle: 'Character certificate issued by District Police HQ', required: true, defaultDelegation: 'link' },
      { id: 'hmv_badge_doc', title: 'HMV Public Transport Badge Document', docType: 'fleet_badge', subtitle: 'State RTO heavy vehicle badge verification', required: false, defaultDelegation: 'link' }
    ],
    signingPapers: [
      { id: 'defensive_driving_undertaking', title: 'Vehicle Fleet & Defensive Driving Undertaking', lawReference: 'Motor Vehicles Act 2019 & Road Transport Rules', description: 'Commits to zero drink-driving, strict speed limits, mandatory seatbelt/helmet use, and safe cargo handling.', sampleCode: 'AGREE-FLEET-SAFETY' },
      { id: 'gps_telemetry_agreement', title: 'Real-Time GPS Telemetry & Asset Safety Agreement', lawReference: 'Commercial Vehicle Telemetry Norms', description: 'Consents to continuous GPS route tracking, speed monitoring, fuel telemetry, and vehicle liability maintenance.', sampleCode: 'AGREE-FLEET-GPS' }
    ]
  },

  retail_hospitality: {
    key: 'retail_hospitality',
    title: 'Retail & F&B / Hospitality',
    subtitle: 'Store cashiers, sales associates, restaurant staff, chefs & floor managers',
    badge: 'Retail & Hospitality',
    colorTheme: 'emerald',
    icon: 'shopping-bag',
    defaultDelegation: {
      fssaiLicenseNo: 'link',
      assignedStoreCode: 'hr',
      posOperatorId: 'hr',
      uniformApronSize: 'link'
    },
    specializedFields: [
      { key: 'fssaiLicenseNo', label: 'FSSAI Food Handler License / Reg No', type: 'text', placeholder: 'FSSAI-21224012000912', defaultDelegation: 'link' },
      { key: 'assignedStoreCode', label: 'Assigned Outlet Store Code / Location', type: 'text', placeholder: 'STORE-BLR-IND-04', defaultDelegation: 'hr' },
      { key: 'posOperatorId', label: 'POS Machine Operator ID', type: 'text', placeholder: 'POS-CASHIER-991', defaultDelegation: 'hr' },
      { key: 'uniformApronSize', label: 'Staff Uniform / Apron Size', type: 'select', options: ['S (Small)', 'M (Medium)', 'L (Large)', 'XL (Extra Large)', 'XXL'], defaultDelegation: 'link' }
    ],
    documentSlots: [
      { id: 'fssai_medical_cert', title: 'FSSAI Food Handler Medical Certificate', docType: 'fssai_cert', subtitle: 'Certified medical fitness for handling food & beverages', required: true, defaultDelegation: 'link' },
      { id: 'retail_past_exp', title: 'Past Retail Outlet Service Certificate', docType: 'experience_cert', subtitle: 'Work experience or cashier clearance certificate', required: true, defaultDelegation: 'link' },
      { id: 'health_clearance_cert', title: 'Public Hygiene & Typhoid Clearance Cert', docType: 'hygiene_cert', subtitle: 'Typhoid vaccination and skin hygiene certificate', required: true, defaultDelegation: 'link' }
    ],
    signingPapers: [
      { id: 'cash_till_accountability', title: 'Cash Register / Till Balance Accountability Agreement', lawReference: 'Payment of Wages Act 1936 & Store Audit Guidelines', description: 'Underlines personal liability for cash drawer reconciliation, POS discount authorization, and inventory audit shortages.', sampleCode: 'AGREE-RETAIL-CASH' },
      { id: 'food_safety_hygiene', title: 'Food Safety, Sanitation & Customer Service Policy', lawReference: 'FSS Act 2006 & Food Hygiene Regulations', description: 'Strict adherence to temperature controls, personal grooming, food storage safety, and customer service decorum.', sampleCode: 'AGREE-RETAIL-FOOD' }
    ]
  },

  contractual: {
    key: 'contractual',
    title: 'Contract Staff & Blue-Collar',
    subtitle: 'Contractual laborers, facility guards, maintenance techs & agency personnel',
    badge: 'Contract Worker',
    colorTheme: 'purple',
    icon: 'users',
    defaultDelegation: {
      contractorName: 'hr',
      contractorLicenseNo: 'hr',
      esicIpNumber: 'link',
      psaraGuardLicense: 'link',
      siteLocation: 'hr'
    },
    specializedFields: [
      { key: 'contractorName', label: 'Labor Contractor / Agency Name', type: 'text', placeholder: 'Joy Manpower Solutions Pvt Ltd', defaultDelegation: 'hr' },
      { key: 'contractorLicenseNo', label: 'CLRA Form XII Contractor License No', type: 'text', placeholder: 'CLRA-LIC-2026-9912', defaultDelegation: 'hr' },
      { key: 'esicIpNumber', label: 'ESIC Insurance IP Number', type: 'text', placeholder: '31092810293109', defaultDelegation: 'link' },
      { key: 'psaraGuardLicense', label: 'PSARA Security Guard License No', type: 'text', placeholder: 'PSARA-BLR-SECURITY-991', defaultDelegation: 'link' },
      { key: 'siteLocation', label: 'Client Deployment Site / Factory Unit', type: 'text', placeholder: 'Client Site - Electronic City Phase 1', defaultDelegation: 'hr' }
    ],
    documentSlots: [
      { id: 'form_xii_deployment_slip', title: 'Form XII Contract Worker Deployment Slip', docType: 'deployment_slip', subtitle: 'Official contractor deployment mandate & badge', required: true, defaultDelegation: 'link' },
      { id: 'psara_license_copy', title: 'PSARA Security License / Training Certificate', docType: 'security_license', subtitle: 'Security guard orientation & fitness card', required: false, defaultDelegation: 'link' },
      { id: 'esic_epehchan_card', title: 'ESIC E-Pehchan Identity Card', docType: 'esic_card', subtitle: 'Official ESIC portal identity download copy', required: true, defaultDelegation: 'link' }
    ],
    signingPapers: [
      { id: 'clra_form_xi', title: 'CLRA Form XI Contract Worker Safety & Wage Undertaking', lawReference: 'Contract Labour (Regulation & Abolition) Act 1970', description: 'Protects statutory rights regarding minimum wages, provident fund deposits, ESIC healthcare coverage, and safe work conditions.', sampleCode: 'AGREE-CLRA-FORM11' },
      { id: 'site_access_policy', title: 'Client Property Site Access & Gate Pass Policy', lawReference: 'Industrial Security & Access Control Norms', description: 'Regulates entry pass usage, biometrics check-in, confidentiality of client premises, and prohibition of unauthorized entry.', sampleCode: 'AGREE-CLRA-SITE' }
    ]
  }
};

/**
 * Helper to get Category configuration or fallback to IT & Tech
 */
export const getEmployeeCategoryConfig = (categoryKey) => {
  if (!categoryKey) return EMPLOYEE_CATEGORIES.it_tech;
  const key = String(categoryKey).toLowerCase();
  return EMPLOYEE_CATEGORIES[key] || EMPLOYEE_CATEGORIES.it_tech;
};

/**
 * List of all 7 categories as an array
 */
export const CATEGORIES_LIST = Object.values(EMPLOYEE_CATEGORIES);
