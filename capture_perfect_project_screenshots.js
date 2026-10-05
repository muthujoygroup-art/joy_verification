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
  },
  {
    id: 'comp-2',
    code: 'COMP002',
    name: 'Joy Man Power Service',
    email: 'ops@joymanpower.com',
    plan: 'tier3',
    tierNumber: 3,
    status: 'Active',
    activation_status: 'Active',
    maxProfiles: 300,
    usedProfiles: 184,
    verifiedCountThisMonth: 165,
    unbilledAmount: 89000,
    postpaidCreditLimit: 500000,
    companyLogo: '/assets/logos/joy_true_profile_badge.png',
    companyPan: 'AABCM5678L',
    gstin: '33AABCM5678L1Z9',
    cin: 'U74999TN2026PTC039928',
    address: 'Joy Towers, Avinashi Road, Tiruppur, Tamil Nadu - 641602'
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
    companyName: 'Joy Corporate Solutions Pvt Ltd',
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
    companyName: 'Joy Corporate Solutions Pvt Ltd',
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
    companyName: 'Joy Corporate Solutions Pvt Ltd',
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
  console.log('🚀 Launching Chrome to capture perfect authentic project screenshots...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // Function to seed localStorage in the browser
  const seedBrowserStorage = async (role, user) => {
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
  await seedBrowserStorage('superadmin', {
    id: 'superadmin-01',
    name: 'Super Administrator',
    email: 'admin@joycorporatesolutions.com',
    role: 'superadmin',
    status: 'Active'
  });
  await page.goto('http://localhost:5173/superadmin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_super_admin_portal.png') });
  console.log('✅ Super Admin screenshot saved.');

  // 2. Company Admin Portal
  console.log('📸 2. Capturing Company Admin Portal...');
  await seedBrowserStorage('company', {
    id: 'comp-1',
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
  console.log('✅ Company Admin screenshot saved.');

  // 3. HR Executive Workstation
  console.log('📸 3. Capturing HR Executive Workstation...');
  await seedBrowserStorage('hrexecutive', {
    id: 'hr-1',
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
  console.log('✅ HR Executive Workstation screenshot saved.');

  // 4. Official Project Certificate Modal
  console.log('📸 4. Capturing Official Project Certificate Modal...');
  try {
    const certClicked = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      const certBtn = allButtons.find(b => 
        (b.innerText && (b.innerText.toLowerCase().includes('certificate') || b.innerText.toLowerCase().includes('cert'))) ||
        (b.title && b.title.toLowerCase().includes('certificate'))
      );
      if (certBtn) {
        certBtn.scrollIntoView();
        certBtn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked certificate button:', certClicked);
    await new Promise(r => setTimeout(r, 2000));
    
    const certEl = await page.$('#printable-official-certificate');
    if (certEl) {
      console.log('Found #printable-official-certificate!');
      await certEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
    } else {
      const modalEl = await page.$('.animate-modal-spring') || await page.$('.pdf-page-block');
      if (modalEl) {
        await modalEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
      } else {
        await page.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
      }
    }
  } catch (e) {
    console.error('Error capturing certificate modal:', e);
  }
  console.log('✅ Project Certificate screenshot saved.');

  // 5. Candidate Mobile Portal
  console.log('📸 5. Capturing Candidate Mobile Portal...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173/verify?token=emp-101', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await mobilePage.screenshot({ path: path.join(outDir, 'real_candidate_portal.png') });
  console.log('✅ Candidate Mobile Portal screenshot saved.');
  await mobilePage.close();

  // 6. Vendor Due Diligence Portal
  console.log('📸 6. Capturing Vendor Due Diligence Portal...');
  await page.goto('http://localhost:5173/vendor?token=vend-1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_vendor_portal.png') });
  console.log('✅ Vendor Portal screenshot saved.');

  await browser.close();
  console.log('🎉 All perfect authentic project screenshots captured successfully!');
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
