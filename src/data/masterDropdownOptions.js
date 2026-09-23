/**
 * Master Dropdown Options Directory
 * Standardized, comprehensive option matrices for all employee creation forms,
 * statutory filings (EPFO, ESIC, Gratuity, Mediclaim), and onboarding dossiers.
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
  'A1+',
  'A1-',
  'A2+',
  'A2-',
  'A1B+',
  'A1B-',
  'A2B+',
  'A2B-',
  'Bombay Blood Group (hh)',
  'Rh-null (Golden Blood)',
  'Unknown / Unspecified',
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
  'Sanamahism',
  'Bahá\'í',
  'Tribal / Sarna / Donyi-Polo',
  'Atheist / Agnostic / Secular',
  'Prefer Not to Disclose',
  'Others'
];

export const CASTE_OPTIONS = [
  'General / Forward Caste (FC / OC / UR)',
  'Brahmin (All Sub-sects / Iyer / Iyengar / Smartha / Deshastha / Kanyakubja / Saraswat / Nagar / Gaur)',
  'Kshatriya / Rajput / Thakur / Varma',
  'Vaishya / Arya Vysya / Baniya / Agarwal / Gupta / Maheshwari / Oswal / Khandelwal / Mahajan',
  'Kayastha / Prabhu / Karan',
  'Vellalar (Pillai / Mudaliar / Saiva Vellalar / Karkatha / Thuluva)',
  'Kongu Vellala Gounder',
  'Thevar / Mukkulathor (Kallar / Maravar / Agamudayar)',
  'Vanniyar / Padayachi / Gounder (North TN)',
  'Nadar (All Sub-sects)',
  'Naidu / Balija / Kamma / Reddy / Kapu / Velama / Telaga',
  'Maratha / Kunbi / Deshmukh / Patil',
  'Lingayat / Veerashaiva',
  'Vokkaliga / Gowda',
  'Nair / Menon / Kurup / Pillai',
  'Ezhava / Thiyya / Billava / Poojary',
  'Jat / Jaat',
  'Gurjar / Gujjar',
  'Yadav / Ahir / Gwala / Konar / Idaiyar',
  'Kurmi / Patel / Patidar / Kanbi',
  'Bunt / Shetty',
  'Khatri / Arora / Sood',
  'Saini / Mali / Maurya / Kushwaha / Shakya',
  'Vishwakarma / Achari / Kammalar / Panchal / Suthar / Sonar / Badhai / Lohar',
  'Devanga / Padmashali / Saliyar / Sengunthar / Kaikolar / Weaver',
  'Chettiar (Nattukottai / Devanga / Vaniya / Beri)',
  'Meena / Mina',
  'Scheduled Caste (SC - Adi Dravidar / Pallar / Devendra Kula Vellalar / Paraiyar / Arunthathiyar)',
  'Scheduled Caste (SC - Chamar / Jatav / Mahar / Madiga / Mala / Valmiki / Paswan / Meghwal)',
  'Scheduled Tribe (ST - Bhil / Gond / Santhal / Munda / Oraon / Bodo / Khasi / Garo / Naga / Mizo / Toda / Irula)',
  'Muslim Community (Sheikh / Sayyid / Mughal / Pathan / Ansari / Qureshi / Memon / Bohra)',
  'Muslim Community (Lebbai / Rowther / Marakkayar / Mappila / Dakhni)',
  'Christian Community (Roman Catholic / CSI / CNI / Syrian Christian / Jacobite / Mar Thoma / Protestant / Pentecostal)',
  'Sikh Community (Jat Sikh / Khatri Sikh / Ramgarhia / Mazhabi / Ahluwalia)',
  'Jain Community (Digambar / Shwetambar / Oswal / Porwal / Khandelwal / Shrimal)',
  'Parsi / Irani Community',
  'De-Notified Tribe / Nomadic Community (DNC / DNT)',
  'Prefer Not to Disclose',
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
  'BC / BC-A / BC-B / BC-C / BC-D / BC-E',
  'BC-Muslim (BCM)',
  'DNC / DNT (De-Notified Community / Nomadic Tribe)',
  'PwD (Persons with Disabilities / Divyangjan)',
  'Ex-Servicemen (ESM / Defense Quota)',
  'Minority Community (Religious / Linguistic)',
  'Others'
];

export const EDUCATION_LEVEL_OPTIONS = [
  'Doctorate / Ph.D / Post-Doctoral',
  'Post Graduate (Master Degree - M.E / M.Tech / MBA / MCA / M.Sc / M.Com / M.A / MS / MD / MS)',
  'Under Graduate (Bachelor Degree - B.E / B.Tech / B.Sc / B.Com / B.A / BBA / BCA / MBBS / LLB / B.Des / B.Arch)',
  'Polytechnic / Engineering Diploma (3-Year)',
  'Vocational / ITI Trade Certificate',
  'Higher Secondary Certificate (12th Standard / HSC / +2 / CBSE / ICSE / State Board)',
  'Secondary School Leaving Certificate (10th Standard / SSLC / Matriculation / CBSE / ICSE)',
  'Post Graduate Diploma (PGD / PGDM)',
  'Professional Certification (CA / CMA / CS / CFA / PMP / AWS / Azure / Cisco / ITIL)',
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
  'Tamil (தமிழ்)',
  'Telugu (తెలుగు)',
  'Hindi (हिन्दी)',
  'Kannada (ಕನ್ನಡ)',
  'Malayalam (മലയാളം)',
  'Marathi (मराठी)',
  'Bengali (বাংলা)',
  'Gujarati (ગુજરાતી)',
  'Odia (ଓଡ଼ିଆ)',
  'Punjabi (ਪੰਜਾਬੀ)',
  'Assamese (অসমীয়া)',
  'Urdu (اردو)',
  'Sanskrit (संस्कृतम्)',
  'Konkani (कोंकणी)',
  'Sindhi (सिन्धी)',
  'Nepali (नेपाली)',
  'Kashmiri (कश्मीरी)',
  'Maithili (मैथिली)',
  'Dogri (डोगरी)',
  'Santali (संथाली)',
  'Bodo (बड़ो)',
  'Manipuri / Meitei (মৈতৈলোন্)',
  'Tulu (ತುಳು)',
  'Sourashtra (சௌராஷ்டிரா)',
  'Badaga (படகா)',
  'Kodava (ಕೊಡವ)',
  'Marwari (मारवाड़ी)',
  'Bhojpuri (भोजपुरी)',
  'Rajasthani (राजस्थानी)',
  'Chhattisgarhi (छत्तीसगढ़ी)',
  'Haryanvi (हरियाणवी)',
  'Magahi (मगही)',
  'Kumaoni (कुमाऊँनी)',
  'Garhwali (गढ़वाली)',
  'Khasi (Khasi)',
  'Garo (Garo)',
  'Mizo (Mizo)',
  'Kokborok (Kokborok)',
  'Ladakhi (ལ་དྭགས་སྐད་)',
  'French (Français)',
  'German (Deutsch)',
  'Spanish (Español)',
  'Arabic (العربية)',
  'Japanese (日本語)',
  'Mandarin Chinese (中文)',
  'Russian (Русский)',
  'Others'
];

export const MOTHER_TONGUE_OPTIONS = LANGUAGES_OPTIONS;

/**
 * Statutory Nomination & Family Relationship Matrix
 * Tailored for EPF Form 2, EPS 1995, ESIC Form 1, Payment of Gratuity Act Form F,
 * Group Mediclaim & Term Insurance policies.
 */
export const RELATIONSHIP_OPTIONS = [
  'Spouse (Husband / Wife)',
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Dependent Father',
  'Dependent Mother',
  'Dependent Brother (Minor / Unemployed)',
  'Dependent Sister (Unmarried / Widowed)',
  'Grandfather (Paternal)',
  'Grandmother (Paternal)',
  'Grandfather (Maternal)',
  'Grandmother (Maternal)',
  'Grandson',
  'Granddaughter',
  'Father-in-law',
  'Mother-in-law',
  'Son-in-law',
  'Daughter-in-law',
  'Brother-in-law',
  'Sister-in-law',
  'Uncle (Paternal / Maternal)',
  'Aunt (Paternal / Maternal)',
  'Nephew',
  'Niece',
  'First Cousin',
  'Legally Adopted Son',
  'Legally Adopted Daughter',
  'Legal Guardian / Ward',
  'Nominee / Non-Family Dependent (As Permitted by Law)',
  'Others'
];

export const FAMILY_MEMBER_RELATION_OPTIONS = RELATIONSHIP_OPTIONS;

/**
 * Utility helper to test if a selected value requires an 'Other (Specify)' input field
 * @param {string} value 
 * @returns {boolean}
 */
export const isOtherValue = (value) => {
  if (!value) return false;
  const s = String(value).toLowerCase().trim();
  return (
    s === 'others' || 
    s === 'other' || 
    s.startsWith('other ') || 
    s.includes('(custom)') ||
    s.includes('specify')
  );
};
