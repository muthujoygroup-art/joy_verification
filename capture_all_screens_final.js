import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('./public/assets/project_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  console.log('🚀 Starting Final High-DPI Project Screenshot Capture...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Super Admin Portal
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
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_super_admin_portal.png') });
  console.log('✅ Super Admin saved.');

  // 2. Company Admin Portal
  console.log('📸 2. Capturing Company Admin Portal...');
  await page.evaluate(() => {
    const user = {
      id: 'comp_076a8152e0',
      code: 'COMP001',
      name: 'Joy Corporate Solutions Pvt Ltd',
      email: 'admin@joycorporatesolutions.com',
      role: 'company',
      companyId: 'comp_076a8152e0',
      companyName: 'Joy Corporate Solutions Pvt Ltd',
      status: 'Active'
    };
    localStorage.setItem('joy_auth_user', JSON.stringify(user));
    localStorage.setItem('joy_auth_role', 'company');
  });
  await page.goto('http://localhost:5173/company', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_company_admin_portal.png') });
  console.log('✅ Company Admin saved.');

  // 3. HR Executive Workstation
  console.log('📸 3. Capturing HR Executive Workstation...');
  await page.evaluate(() => {
    const user = {
      id: 'hr_001',
      code: 'COMP001HR001',
      name: 'Agilan (Lead HR)',
      email: 'agilan@joycorporatesolutions.com',
      role: 'hrexecutive',
      companyId: 'comp_076a8152e0',
      companyName: 'Joy Corporate Solutions Pvt Ltd',
      status: 'Active'
    };
    localStorage.setItem('joy_auth_user', JSON.stringify(user));
    localStorage.setItem('joy_auth_role', 'hrexecutive');
  });
  await page.goto('http://localhost:5173/hr', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, 'real_hr_workstation_portal.png') });
  console.log('✅ HR Workstation saved.');

  // 4. Official Verification Certificate
  console.log('📸 4. Capturing Official Certificate Modal...');
  // Click on the Certificate button in the first candidate row
  const certClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Certificate') || b.title?.includes('Certificate') || b.className?.includes('bg-indigo-50'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Cert button clicked:', certClicked);
  await new Promise(r => setTimeout(r, 2000));

  const certEl = await page.$('#printable-official-certificate') || await page.$('.animate-modal-spring') || await page.$('.pdf-page-block');
  if (certEl) {
    await certEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
  }
  console.log('✅ Project Certificate saved.');

  // 5. Candidate Mobile Portal
  console.log('📸 5. Capturing Candidate Mobile Portal...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173/verify?token=emp-101', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await mobilePage.screenshot({ path: path.join(outDir, 'real_candidate_portal.png') });
  await mobilePage.close();
  console.log('✅ Candidate Mobile Portal saved.');

  // 6. Vendor Due Diligence Portal
  console.log('📸 6. Capturing Vendor Due Diligence Portal...');
  await page.goto('http://localhost:5173/vendor?token=vend-1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_vendor_portal.png') });
  console.log('✅ Vendor Portal saved.');

  await browser.close();
  console.log('🎉 All 6 screenshots successfully captured and saved to public/assets/project_screenshots/!');
}

capture().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
