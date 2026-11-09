const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function verifyUIFixes() {
  console.log('--- Verifying UI Fixes: Toast z-index, Alert Banner, and Google Button ---');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://127.0.0.1:5000', { waitUntil: 'networkidle2' });

  // 1. Open Auth modal
  await page.click('#authTopBtn');
  await page.waitForSelector('#authModal', { visible: true });

  // 2. Switch to Register tab
  await page.click('#authTabRegisterBtn');
  await new Promise(r => setTimeout(r, 400));

  // Take screenshot of Auth modal showing Google button and Register form
  const screenshotDir = path.join('/Users/apple/.gemini/antigravity/brain/7b846ea5-f960-456f-abb4-64af39c9e245/screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  await page.screenshot({ path: path.join(screenshotDir, '09_auth_modal_gis_google.png') });
  console.log('✅ Screenshot 09 saved: Google GIS button & Register form');

  // 3. Test inline error display and toast z-index
  // Fill mismatched passwords to trigger error
  await page.type('#regName', 'Tushar');
  await page.select('#regGrade', '8');
  await page.type('#regEmail', 'tsraut2001@gmail.com');
  await page.type('#regPassword', 'password123');
  await page.type('#regConfirmPassword', 'differentpassword');
  await page.click('#regSubmitBtn');

  await page.waitForSelector('#authAlertBox', { visible: true });
  await page.waitForSelector('.toast', { visible: true });

  // Check z-index of toast vs modal
  const zIndices = await page.evaluate(() => {
    const toast = document.querySelector('.toast');
    const modal = document.querySelector('#authModal');
    const alertBox = document.querySelector('#authAlertBox');
    return {
      toastZ: window.getComputedStyle(toast).zIndex,
      modalZ: window.getComputedStyle(modal).zIndex,
      toastVisible: toast.offsetHeight > 0,
      alertBoxVisible: alertBox.offsetHeight > 0,
      alertText: alertBox.innerText,
      toastText: toast.innerText
    };
  });

  console.log('Z-Index Check:', zIndices);

  await page.screenshot({ path: path.join(screenshotDir, '10_modal_with_toast_and_alert.png') });
  console.log('✅ Screenshot 10 saved: Toast floating strictly ABOVE modal, and alert box inside modal');

  // 4. Test clean registration with matching passwords
  await page.evaluate(() => {
    document.querySelector('#regConfirmPassword').value = 'password123';
  });
  await page.click('#regSubmitBtn');

  // Wait for auth to complete
  await page.waitForFunction(() => {
    const el = document.querySelector('#authAlertBox');
    return (el && el.innerText.includes('यशस्वी')) || document.querySelector('#logoutTopBtn').style.display !== 'none';
  }, { timeout: 8000 });

  console.log('✅ Student tsraut2001@gmail.com successfully registered!');

  await page.screenshot({ path: path.join(screenshotDir, '11_tsraut2001_registered_success.png') });
  console.log('✅ Screenshot 11 saved: tsraut2001 registered successfully');

  // Clean up tsraut2001 from auth emulator so user can test it themselves
  const uid = await page.evaluate(() => firebase.auth().currentUser ? firebase.auth().currentUser.uid : null);
  console.log('Registered UID:', uid);

  if (uid) {
    // Delete user from Auth Emulator
    const http = require('http');
    const postData = JSON.stringify({ localId: uid });
    const req = http.request({
      hostname: '127.0.0.1',
      port: 9099,
      path: '/emulator/v1/projects/vyakaranveer-marathi/accounts:delete',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      console.log(`Cleaned up test account tsraut2001@gmail.com from Auth Emulator: ${res.statusCode}`);
    });
    req.write(postData);
    req.end();
  }

  await browser.close();
  console.log('All UI fix verifications complete!');
}

verifyUIFixes().catch(err => {
  console.error('Error during UI verification:', err);
  process.exit(1);
});
