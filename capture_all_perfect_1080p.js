import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('./public/assets/project_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function capture() {
  console.log('🚀 Capturing all 6 project screenshots at 1920x1080 full HD...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 950, deviceScaleFactor: 2 });

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
    localStorage.setItem('joy_sidebar_collapsed', 'true');
  });
  await page.goto('http://localhost:5173/superadmin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
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
    localStorage.setItem('joy_sidebar_collapsed', 'true');
  });
  await page.goto('http://localhost:5173/company', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
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
    localStorage.setItem('joy_sidebar_collapsed', 'true');
  });
  await page.goto('http://localhost:5173/hr', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.join(outDir, 'real_hr_workstation_portal.png') });
  console.log('✅ HR Workstation saved.');

  // 4. Official Verification Certificate
  console.log('📸 4. Capturing Official Project Certificate Modal...');
  await page.goto('http://localhost:5173/certificate-preview', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1800));
  const certEl = await page.$('#printable-official-certificate') || await page.$('.pdf-page-block');
  if (certEl) {
    await certEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
  }
  console.log('✅ Certificate saved.');

  // 5. Candidate Mobile Portal
  console.log('📸 5. Capturing Candidate Mobile Portal...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173/verify?token=emp-101', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await mobilePage.screenshot({ path: path.join(outDir, 'real_candidate_portal.png') });
  await mobilePage.close();
  console.log('✅ Candidate Mobile saved.');

  // 6. Vendor Due Diligence Portal
  console.log('📸 6. Capturing Vendor Due Diligence Portal...');
  await page.goto('http://localhost:5173/vendor?token=vend-1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, 'real_vendor_portal.png') });
  console.log('✅ Vendor Portal saved.');

  await browser.close();
  console.log('🎉 All 6 screenshots successfully captured in high-DPI!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
