import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('./public/assets/project_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('🚀 Capturing direct Official Project Certificate...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1600,1200']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1600, deviceScaleFactor: 2 });

  await page.goto('http://localhost:5173/certificate-preview', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Make parent modal scrollable container visible / expanded if needed
  await page.evaluate(() => {
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.style.overflow = 'visible';
      scrollContainer.style.maxHeight = 'none';
    }
    const modalBox = document.querySelector('.max-h-\\[92vh\\]');
    if (modalBox) {
      modalBox.style.maxHeight = 'none';
      modalBox.style.overflow = 'visible';
    }
  });

  await new Promise(r => setTimeout(r, 1000));

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

  await browser.close();
  console.log('✅ Real Project Certificate captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
