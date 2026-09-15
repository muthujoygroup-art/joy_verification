/**
 * Master Dropdown Options Directory
 * Provides standardized, comprehensive option matrices for all employee creation forms,
 * statutory filings, and onboarding dossiers with built-in 'Others' support.
 */

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Transgender',
  'Non-Binary',
  'Prefer not to say',
  'Others'
];

export const MARITAL_STATUS_OPTIONS = [
  'Single / Unmarried',
  'Married',
  'Divorced',
  'Widowed',
  'Separated',
  'Others'
];

export const BLOOD_GROUP_OPTIONS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Bombay Blood Group (hh)',
  'Others'
];

export const RELIGION_OPTIONS = [
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Buddhist',
  'Jain',
  'Parsi / Zoroastrian',
  'Jewish',
  'Others'
];

export const COMMUNITY_CATEGORY_OPTIONS = [
  'General (OC / UR)',
  'OBC (Other Backward Class)',
  'OBC-NCL (Non-Creamy Layer)',
  'SC (Scheduled Caste)',
  'ST (Scheduled Tribe)',
  'EWS (Economically Weaker Section)',
  'MBC (Most Backward Class)',
  'BC-Muslim',
  'DNC / DNT (De-Notified Community)',
  'Others'
];

export const EDUCATION_LEVEL_OPTIONS = [
  'Doctorate / Ph.D / Post-Doctoral',
  'Post Graduate (Master Degree - M.E / M.Tech / MBA / MCA / M.Sc / M.Com / M.A / MS)',
  'Under Graduate (Bachelor Degree - B.E / B.Tech / B.Sc / B.Com / B.A / BBA / BCA / MBBS / LLB)',
  'Polytechnic / Engineering Diploma (3-Year)',
  'Vocational / ITI Trade Certificate',
  'Higher Secondary Certificate (12th Standard / HSC / +2)',
  'Secondary School Leaving Certificate (10th Standard / SSLC / Matriculation)',
  'Post Graduate Diploma (PGD)',
  'Professional Certification (CA / CMA / CS / CFA / PMP / AWS / Cisco)',
  'Others'
];

export const DEPARTMENT_OPTIONS = [
  'Engineering & Software Architecture',
  'Information Technology (IT) & Cloud Infrastructure',
  'Human Resources (HR) & Talent Acquisition',
  'Finance, Accounts & Taxation',
  'Operations & Service Delivery',
  'Sales, Business Development & Key Accounts',
  'Marketing, Brand Communications & Public Relations',
  'Quality Assurance (QA) & Process Engineering',
  'Legal, Corporate Governance & Regulatory Compliance',
  'Administration, Security & Facilities Management',
  'Customer Support, BPO & Client Operations',
  'Manufacturing, Industrial Production & Shop-Floor',
  'Supply Chain, Logistics, Procurement & Warehousing',
  'Research & Development (R&D) & Innovation',
  'Healthcare, Medical Diagnostics & Clinical Trials',
  'Others'
];

export const EMPLOYEE_TYPE_OPTIONS = [
  { value: 'it_tech', label: '💻 IT, Software Engineering & AI Operations' },
  { value: 'manufacturing', label: '🏭 Manufacturing & Heavy Plant Operations' },
  { value: 'bfsi', label: '🏦 BFSI, Banking & Fintech Governance' },
  { value: 'healthcare', label: '🏥 Healthcare, Pharma & Hospital Operations' },
  { value: 'logistics', label: '🚚 Logistics, Fleet & Heavy Transport Operations' },
  { value: 'retail_hospitality', label: '🛍️ Retail, Hospitality & Frontline Services' },
  { value: 'contractual', label: '🏗️ Contract Labor Act (Form XIII) & Facility Workforce' },
  { value: 'corporate_exec', label: '👔 Corporate Executive & Strategic Leadership' },
  { value: 'others', label: '✨ Others' }
];

export const JOB_TYPE_OPTIONS = [
  'Full Time Permanent',
  'Probationary / Trainee (On-Rolls)',
  'Contractual (Fixed Term 1-3 Yrs)',
  'Third-Party Deputation / Staffing Agency',
  'Part-Time Employee',
  'Freelancer / Retained Consultant',
  'Intern / Graduate Engineering Trainee (GET)',
  'Apprentice (Under Apprentices Act)',
  'Others'
];

export const JOB_CATEGORY_OPTIONS = [
  'Information Technology & Software Services',
  'Cloud, DevOps, Cyber Security & Infrastructure',
  'Manufacturing & Heavy Industrial Engineering',
  'Automotive, Aerospace & Precision Mechanical',
  'Banking, Financial Services & Insurance (BFSI)',
  'Fintech, Payments & Algorithmic Trading',
  'Logistics, Warehousing, Supply Chain & Fleet Operations',
  'Healthcare, Pharmaceuticals, Biotechnology & Hospital Care',
  'Retail, FMCG, E-Commerce & Distribution',
  'Telecommunications, Networking & 5G Systems',
  'Construction, Real Estate, Civil & Infrastructure',
  'Media, Digital Content, Advertising & Design',
  'Consulting, Advisory, Auditing & Professional Services',
  'Others'
];

export const DESIGNATION_OPTIONS = [
  'Associate',
  'Software Engineer',
  'Senior Software Engineer',
  'Lead Software Engineer',
  'Principal Architect',
  'Engineering Manager',
  'DevOps Engineer',
  'Cloud Solutions Architect',
  'Data Analyst / Data Scientist',
  'QA Automation Engineer',
  'Product Manager',
  'UI/UX Designer',
  'HR Executive',
  'Talent Acquisition Lead',
  'Senior HR Manager',
  'Accountant / Senior Accountant',
  'Finance Manager',
  'Operations Executive',
  'Operations Manager',
  'Plant Supervisor',
  'Quality Control Inspector',
  'Production Engineer',
  'Logistics Coordinator',
  'Fleet Manager',
  'Executive Assistant',
  'Business Development Executive',
  'Sales Manager',
  'Customer Support Specialist',
  'Others'
];

export const DOCUMENT_TYPE_OPTIONS = [
  'Government Aadhaar Card (Masked e-Aadhaar)',
  'Income Tax PAN Card',
  'Indian Passport (Bio Page)',
  'MoRTH Driving License (Smart Card)',
  'Election Commission Voter ID Card (EPIC)',
  'Degree Certificate / Cumulative Marksheet',
  'Higher Secondary (12th) Marksheet',
  'Secondary School (10th) Marksheet',
  'Previous Employer Relieving & Experience Letter',
  'Last 3 Months Salary Payslips',
  'Bank Passbook / Pre-Printed Cancelled Cheque',
  'Form 16 / Income Tax Assessment (ITR-V)',
  'Police Verification / Clearance Certificate (PCC)',
  'Medical Fitness & Occupational Health Certificate',
  'Digital Specimen Signature',
  'Passport Size Photograph',
  'Others'
];

export const LANGUAGES_OPTIONS = [
  'English',
  'Tamil',
  'Hindi',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Bengali',
  'Gujarati',
  'Punjabi',
  'Odia',
  'Assamese',
  'Urdu',
  'Sanskrit',
  'Konkani',
  'French',
  'German',
  'Spanish',
  'Japanese',
  'Mandarin',
  'Others'
];

/**
 * Utility helper to test if a selected value requires an 'Other (Specify)' input field
 * @param {string} value 
 * @returns {boolean}
 */
export const isOtherValue = (value) => {
  if (!value) return false;
  const s = String(value).toLowerCase().trim();
  return s === 'others' || s === 'other' || s.startsWith('other ');
};
