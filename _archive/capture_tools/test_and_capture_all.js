import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('./public/assets/project_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Capture Super Admin Console
  console.log('📸 1. Capturing Super Admin Portal...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const user = {
      id: 'superadmin-01',
      name: 'Super Administrator',
      email: 'admin@joycorporatesolutions.com',
      role: 'superadmin',
      status: 'Active'
    };
    localStorage.setItem('joy_auth_user', JSON.stringify(user));
    localStorage.setItem('joy_auth_role', 'superadmin');
  });
  await page.goto('http://localhost:5173/superadmin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'real_super_admin_portal.png') });

  // 2. Capture Company Admin Portal
  console.log('📸 2. Capturing Company Admin Portal...');
  await page.evaluate(() => {
    const user = {
      id: 'comp-1',
      code: 'COMP001',
      name: 'Joy Corporate Solutions Pvt Ltd',
      email: 'admin@joycorporatesolutions.com',
      role: 'company',
      companyId: 'comp-1',
      companyName: 'Joy Corporate Solutions Pvt Ltd',
      status: 'Active'
    };
    localStorage.setItem('joy_auth_user', JSON.stringify(user));
    localStorage.setItem('joy_auth_role', 'company');
  });
  await page.goto('http://localhost:5173/company', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'real_company_admin_portal.png') });

  // 3. Capture HR Executive Workstation
  console.log('📸 3. Capturing HR Executive Workstation...');
  await page.evaluate(() => {
    const user = {
      id: 'hr-1',
      code: 'COMP001HR001',
      name: 'Agilan (Lead HR)',
      email: 'agilan@joycorporatesolutions.com',
      role: 'hrexecutive',
      companyId: 'comp-1',
      companyName: 'Joy Corporate Solutions Pvt Ltd',
      status: 'Active'
    };
    localStorage.setItem('joy_auth_user', JSON.stringify(user));
    localStorage.setItem('joy_auth_role', 'hrexecutive');
  });
  await page.goto('http://localhost:5173/hr', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, 'real_hr_workstation_portal.png') });

  // 4. Capture Official Project Certificate Modal
  console.log('📸 4. Capturing Official Project Certificate Modal...');
  // Trigger open certificate modal in HR workstation
  await page.evaluate(() => {
    // Find all buttons and click the first certificate button
    const btns = Array.from(document.querySelectorAll('button'));
    const certBtn = btns.find(b => b.innerText.includes('Certificate') || b.title?.includes('Certificate') || b.className?.includes('bg-indigo-50'));
    if (certBtn) certBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  const certEl = await page.$('#printable-official-certificate') || await page.$('.animate-modal-spring') || await page.$('.pdf-page-block');
  if (certEl) {
    await certEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
  }

  // 5. Candidate Mobile Portal
  console.log('📸 5. Capturing Candidate Mobile Portal...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173/verify?token=emp-101', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await mobilePage.screenshot({ path: path.join(outDir, 'real_candidate_portal.png') });
  await mobilePage.close();

  // 6. Vendor Due Diligence Portal
  console.log('📸 6. Capturing Vendor Due Diligence Portal...');
  await page.goto('http://localhost:5173/vendor?token=vend-1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'real_vendor_portal.png') });

  await browser.close();
  console.log('🎉 Done capturing screenshots!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
