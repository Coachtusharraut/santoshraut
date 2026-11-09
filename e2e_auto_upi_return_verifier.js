const puppeteer = require('puppeteer-core');

async function testAutoUpiReturnFlow() {
  console.log('======================================================================');
  console.log('🧪 VERIFYING 100% AUTOMATIC RETURN ACTIVATION (NO BUTTON CLICKING)');
  console.log('======================================================================');

  const TEST_EMAIL = 'auto_return_student_' + Date.now() + '@gmail.com';
  const TEST_PASS = 'TestPass@123';

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Entitlement') || text.includes('Authenticated') || text.includes('Activated') || text.includes('Auto verification')) {
      console.log('  [Browser]', text);
    }
  });

  await page.goto('http://127.0.0.1:5000', { waitUntil: 'networkidle2' });

  // 1. Register student
  console.log('\nStep 1: Registering student...');
  await page.click('#authTopBtn');
  await page.waitForSelector('#authModal.show', { visible: true });
  await page.click('#authTabRegisterBtn');
  await new Promise(r => setTimeout(r, 200));

  await page.type('#regName', 'कौस्तुभ कुलकर्णी');
  await page.select('#regGrade', '10');
  await page.type('#regEmail', TEST_EMAIL);
  await page.type('#regPassword', TEST_PASS);
  await page.type('#regConfirmPassword', TEST_PASS);
  await page.click('#regSubmitBtn');

  await page.waitForSelector('#logoutTopBtn', { visible: true });
  console.log('✅ Student registered:', TEST_EMAIL);

  // 2. Open Paywall Modal
  console.log('\nStep 2: Opening Paywall Modal...');
  await page.waitForFunction(() => {
    const modal = document.querySelector('#authModal');
    return !modal || !modal.classList.contains('show');
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => openPaywallModal(3));
  await page.waitForSelector('#paywallModal.show', { visible: true });
  console.log('✅ Paywall Modal opened');

  // 3. Click the Single Unified UPI Pay Button
  console.log('\nStep 3: Clicking Unified UPI Pay Button...');
  await page.click('#payUnifiedUpiBtn');

  // Verify pending state was saved in localStorage
  const pendingState = await page.evaluate(() => localStorage.getItem('vv_pending_upi'));
  console.log('  Saved Pending UPI State:', pendingState);
  if (!pendingState) throw new Error('Pending UPI state must be saved on click');
  console.log('✅ Pending payment intent recorded in browser storage');

  // 4. Simulate student paying in UPI app for 3 seconds
  console.log('\nStep 4: Simulating 3 seconds in GPay / PhonePe...');
  await new Promise(r => setTimeout(r, 3200));

  // 5. Simulate student returning to the browser tab
  console.log('\nStep 5: Simulating student returning to browser (window.focus / visibilitychange)...');
  await page.evaluate(() => {
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
  });

  // 6. Verify automatic entitlement activation WITHOUT clicking any button
  console.log('\nStep 6: Verifying automatic activation without any user clicks...');
  await page.waitForSelector('#subBadge', { visible: true, timeout: 15000 });
  const badgeText = await page.$eval('#subBadgeText', el => el.innerText);
  console.log('  Active Membership Badge:', badgeText);
  if (!badgeText.includes('१ वर्ष सदस्यत्व सक्रिय')) throw new Error('Badge must show 1 year membership active');
  console.log('✅ 1-Year Membership badge activated automatically!');

  // Verify all 21 units unlocked
  const lockedCount = await page.$$eval('.unit.locked', els => els.length);
  console.log('  Locked units count:', lockedCount);
  if (lockedCount !== 0) throw new Error('All 21 units must be unlocked automatically');
  console.log('✅ All 21 units unlocked automatically on return from UPI app!');

  await browser.close();
  console.log('\n======================================================================');
  console.log('🎉 AUTOMATIC RETURN ACTIVATION FULLY VERIFIED WITH 100% SUCCESS!');
  console.log('======================================================================\n');
}

testAutoUpiReturnFlow().catch(err => {
  console.error('❌ Auto return test failed:', err);
  process.exit(1);
});

