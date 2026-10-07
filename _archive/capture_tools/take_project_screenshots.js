import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('./public/assets/project_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('🚀 Launching Chrome to capture authentic project screenshots...');
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
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, 'real_super_admin_portal.png') });
  console.log('✅ Super Admin screenshot saved.');

  // 2. Capture Company Admin Portal
  console.log('📸 2. Capturing Company Admin Portal...');
  await page.evaluate(() => {
    const user = {
      id: 'comp-1',
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
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, 'real_company_admin_portal.png') });
  console.log('✅ Company Admin screenshot saved.');

  // 3. Capture HR Executive Workstation
  console.log('📸 3. Capturing HR Executive Workstation...');
  await page.evaluate(() => {
    const user = {
      id: 'hr-1',
      name: 'Agilan (Lead HR)',
      email: 'agilan@joycorporatesolutions.com',
      role: 'hrexecutive',
      companyId: 'comp-1',
      companyName: 'Joy Man Power Service',
      status: 'Active'
    };
    localStorage.setItem('joy_auth_user', JSON.stringify(user));
    localStorage.setItem('joy_auth_role', 'hrexecutive');
  });
  await page.goto('http://localhost:5173/hr', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, 'real_hr_workstation_portal.png') });
  console.log('✅ HR Executive Workstation screenshot saved.');

  // 4. Capture Real Project Certificate Modal
  console.log('📸 4. Capturing Official Project Certificate Modal...');
  try {
    const clicked = await page.evaluate(() => {
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
    console.log('Clicked certificate button:', clicked);
    await new Promise(r => setTimeout(r, 2000));
    
    // Look for printable certificate container or modal
    const certEl = await page.$('#printable-official-certificate');
    if (certEl) {
      console.log('Found #printable-official-certificate, capturing element screenshot...');
      await certEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
    } else {
      const modalEl = await page.$('.animate-modal-spring') || await page.$('.pdf-page-block');
      if (modalEl) {
        console.log('Found modal element, capturing element screenshot...');
        await modalEl.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
      } else {
        console.log('Capturing full page modal fallback...');
        await page.screenshot({ path: path.join(outDir, 'real_project_certificate.png') });
      }
    }
  } catch (e) {
    console.error('Error opening certificate modal in HR workstation:', e);
  }
  console.log('✅ Project Certificate screenshot saved.');

  // 5. Capture Candidate Mobile Portal
  console.log('📸 5. Capturing Candidate Mobile Portal...');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 412, height: 860, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobilePage.goto('http://localhost:5173/verify?token=emp-1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await mobilePage.screenshot({ path: path.join(outDir, 'real_candidate_portal.png') });
  console.log('✅ Candidate Mobile Portal screenshot saved.');
  await mobilePage.close();

  // 6. Capture Vendor Due Diligence Portal
  console.log('📸 6. Capturing Vendor Portal...');
  await page.goto('http://localhost:5173/vendor?token=vend-1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, 'real_vendor_portal.png') });
  console.log('✅ Vendor Portal screenshot saved.');

  await browser.close();
  console.log('🎉 All authentic project screenshots captured successfully!');
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
