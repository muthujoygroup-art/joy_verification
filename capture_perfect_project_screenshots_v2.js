import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('./public/assets/project_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const mockCompanies = [
  {
    id: 'comp-1',
    code: 'COMP001',
    name: 'Joy Corporate Solutions Pvt Ltd',
    email: 'admin@joycorporatesolutions.com',
    plan: 'tier2',
    tierNumber: 2,
    status: 'Active',
    activation_status: 'Active',
    maxProfiles: 100,
    usedProfiles: 42,
    verifiedCountThisMonth: 38,
    unbilledAmount: 42500,
    postpaidCreditLimit: 200000,
    companyLogo: '/assets/logos/joy_true_profile_badge.png',
    companyPan: 'AABCJ1234K',
    gstin: '33AABCJ1234K1Z5',
    cin: 'U74999KA2026PTC098214',
    address: 'Joy Tech Park, Electronic City, Bengaluru, Karnataka - 560100'
  }
];

const mockHrUsers = [
  {
    id: 'hr-1',
    code: 'COMP001HR001',
    name: 'Agilan (Lead HR)',
    email: 'agilan@joycorporatesolutions.com',
    role: 'hrexecutive',
    companyId: 'comp-1',
    companyName: 'Joy Corporate Solutions Pvt Ltd',
    status: 'Active',
    activeLinks: 6,
    verifiedCandidatesCount: 38,
    passRate: '98.8%'
  },
  {
    id: 'hr-2',
    code: 'COMP001HR002',
    name: 'Meera (Senior Recruiter)',
    email: 'meera@joycorporatesolutions.com',
    role: 'hrexecutive',
    companyId: 'comp-1',
    companyName: 'Joy Corporate Solutions Pvt Ltd',
    status: 'Active',
    activeLinks: 4,
    verifiedCandidatesCount: 29,
    passRate: '100%'
  }
];

const mockCandidates = [
  {
    id: 'emp-101',
    token: 'emp-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    mobile: '9876543210',
    empId: 'JOY-EMP-8921',
    employeeNumber: 'JOY-EMP-8921',
    designation: 'Senior Software Engineer',
    department: 'Engineering & Product',
    companyId: 'comp-1',
    company_id: 'comp-1',
    companyName: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    status: 'Verified',
    verificationDate: '02 Oct 2026, 14:32:10 IST',
    riskScore: 0,
    bgvVerdict: 'Verified & Compliant',
    verificationsCompleted: {
      aadhaar: true,
      pan: true,
      bankCheck: true,
      uan: true,
      face: true,
      email: true,
      mobile: true,
      education: true,
      criminalCheck: true
    },
    verifiedAttributes: {
      aadhaar: { maskedNumber: 'XXXX-XXXX-5829', name: 'Aarav Sharma', dob: '1994-08-15', gender: 'Male', status: 'VERIFIED' },
      pan: { panNumber: 'ABCPS1234F', registeredName: 'AARAV SHARMA', status: 'VERIFIED', matchScore: 100 },
      bankCheck: { accountNumber: '987654321098', ifsc: 'SBIN0001234', bankName: 'State Bank of India', registeredName: 'AARAV SHARMA', status: 'VERIFIED' },
      uan: { uanNumber: '101234567890', employerName: 'Joy Corporate Solutions Pvt Ltd', doj: '2021-04-01', status: 'CLEAR - NO MOONLIGHTING' },
      education: { degree: 'B.Tech Computer Science', university: 'Anna University', year: '2016', rollNo: '12CS889', status: 'DIGILOCKER VERIFIED' }
    },
    joiningFormData: {
      fullName: 'Aarav Sharma',
      empId: 'JOY-EMP-8921',
      companyName: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
      designation: 'Senior Software Engineer',
      department: 'Engineering & Product',
      fatherSpouseName: 'Rajesh Sharma',
      dob: '1994-08-15',
      gender: 'Male',
      bloodGroup: 'O+'
    }
  },
  {
    id: 'emp-102',
    token: 'emp-102',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    mobile: '9845012345',
    empId: 'JOY-EMP-8922',
    employeeNumber: 'JOY-EMP-8922',
    designation: 'Financial Analyst',
    department: 'Corporate Finance',
    companyId: 'comp-1',
    company_id: 'comp-1',
    companyName: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    status: 'Verified',
    verificationDate: '02 Oct 2026, 11:15:00 IST',
    riskScore: 0,
    bgvVerdict: 'Verified & Compliant',
    verificationsCompleted: {
      aadhaar: true,
      pan: true,
      bankCheck: true,
      uan: true,
      face: true,
      email: true,
      mobile: true
    },
    verifiedAttributes: {
      aadhaar: { maskedNumber: 'XXXX-XXXX-1940', name: 'Priya Nair', dob: '1996-03-22', gender: 'Female', status: 'VERIFIED' },
      pan: { panNumber: 'BNVPN5678G', registeredName: 'PRIYA NAIR', status: 'VERIFIED', matchScore: 100 },
      bankCheck: { accountNumber: '984501234567', ifsc: 'HDFC0001234', bankName: 'HDFC Bank', registeredName: 'PRIYA NAIR', status: 'VERIFIED' }
    }
  },
  {
    id: 'emp-103',
    token: 'emp-103',
    name: 'Karthik R',
    email: 'karthik.r@example.com',
    mobile: '9789012345',
    empId: 'JOY-EMP-8923',
    employeeNumber: 'JOY-EMP-8923',
    designation: 'Plant Supervisor',
    department: 'Plant Operations',
    companyId: 'comp-1',
    company_id: 'comp-1',
    companyName: 'JOY CORPORATE SOLUTIONS PRIVATE LIMITED',
    status: 'Under Review',
    verificationDate: '02 Oct 2026, 09:40:00 IST',
    riskScore: 65,
    bgvVerdict: 'Moonlighting Alert',
    verificationsCompleted: {
      aadhaar: true,
      pan: true,
      bankCheck: true,
      uan: false
    }
  }
];

const mockVendors = [
  {
    id: 'vend-1',
    name: 'Apex Prime Solutions Private Limited',
    cin: 'U74999KA2026PTC192841',
    gstin: '33AABCT1332L1Z2',
    pan: 'AABCT1332L',
    udyam: 'UDYAM-TN-03-0019284',
    bankAccount: '987654321098',
    ifsc: 'SBIN0001234',
    status: 'Verified',
    contractorStaffCount: 48,
    clraLicenseNo: 'CLRA/TN/2026/0912',
    gateSyncStatus: '100% Turnstile Synced'
  }
];

async function run() {
  console.log('🚀 Capturing crisp project screenshots...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const seed = async (role, user) => {
    await page.evaluate((r, u, comps, hrs, cands, vends) => {
      localStorage.setItem('joy_auth_role', r);
      localStorage.setItem('joy_auth_user', JSON.stringify(u));
      localStorage.setItem('joy_companies_v1', JSON.stringify(comps));
      localStorage.setItem('joy_hr_users_v1', JSON.stringify(hrs));
      localStorage.setItem('joy_candidates_v1', JSON.stringify(cands));
      localStorage.setItem('joy_company_vendors_v1', JSON.stringify(vends));
      localStorage.setItem('joy_platform_logo', '/assets/logos/joy_true_profile_badge.png');
    }, role, user, mockCompanies, mockHrUsers, mockCandidates, mockVendors);
  };

  // 1. Super Admin Console
  console.log('📸 1. Capturing Super Admin Portal...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
  await seed('superadmin', {
    id: 'superadmin-01',
    name: 'Super Administrator',
    email: 'admin@joycorporatesolutions.com',
    role: 'superadmin',
    status: 'Active'
  });
  await page.goto('http://localhost:5173/superadmin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_super_admin_portal.png') });

  // 2. Company Admin Portal
  console.log('📸 2. Capturing Company Admin Portal...');
  await seed('company', {
    id: 'comp-1',
    code: 'COMP001',
    name: 'Joy Corporate Solutions Pvt Ltd',
    email: 'admin@joycorporatesolutions.com',
    role: 'company',
    companyId: 'comp-1',
    companyName: 'Joy Corporate Solutions Pvt Ltd',
    status: 'Active'
  });
  await page.goto('http://localhost:5173/company', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_company_admin_portal.png') });

  // 3. HR Executive Workstation
  console.log('📸 3. Capturing HR Executive Workstation...');
  await seed('hrexecutive', {
    id: 'hr-1',
    code: 'COMP001HR001',
    name: 'Agilan (Lead HR)',
    email: 'agilan@joycorporatesolutions.com',
    role: 'hrexecutive',
    companyId: 'comp-1',
    companyName: 'Joy Corporate Solutions Pvt Ltd',
    status: 'Active'
  });
  await page.goto('http://localhost:5173/hr', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_hr_workstation_portal.png') });

  // 4. Capture Real Project Certificate
  console.log('📸 4. Capturing Official Project Certificate Modal...');
  // Trigger opening certificate modal directly or clicking button
  const opened = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const certBtn = btns.find(b => b.innerText.includes('Certificate') || b.title.includes('Certificate') || b.className.includes('bg-indigo-50'));
    if (certBtn) {
      certBtn.click();
      return true;
    }
    return false;
  });
  console.log('Opened cert modal in HR workstation:', opened);
  await new Promise(r => setTimeout(r, 2000));

  const certEl = await page.$('#printable-official-certificate');
  if (certEl) {
    await certEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
  } else {
    const modalEl = await page.$('.animate-modal-spring') || await page.$('.pdf-page-block');
    if (modalEl) {
      await modalEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
    } else {
      await page.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
    }
  }

  // 5. Candidate Mobile Portal
  console.log('📸 5. Capturing Candidate Mobile Portal...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173/verify?token=emp-101', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await mobilePage.screenshot({ path: path.join(outDir, 'real_candidate_portal.png') });
  await mobilePage.close();

  // 6. Vendor Portal
  console.log('📸 6. Capturing Vendor Portal...');
  await page.goto('http://localhost:5173/vendor?token=vend-1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_vendor_portal.png') });

  await browser.close();
  console.log('🎉 All perfect screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
