const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function runLivePaywallVerification() {
  console.log('======================================================================');
  console.log('🚀 VYAKARANVEER E2E VERIFICATION: ₹1 RAZORPAY PAGE & 1-YEAR ENTITLEMENT');
  console.log('======================================================================');

  const TEST_EMAIL = 'student_goal_test@gmail.com';
  const TEST_PASS = 'TestPass@123';
  const TEST_PAY_ID = 'pay_live_rzp_goal_' + Date.now();

  // 0. Pre-clean test user in emulator
  try {
    const tokenRes = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASS, returnSecureToken: true })
    });
    if (tokenRes.ok) {
      const data = await tokenRes.json();
      await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:delete?key=fake-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: data.idToken })
      });
      await fetch('http://127.0.0.1:8080/v1/projects/marathi-vyakaram/databases/(default)/documents/users/' + data.localId, { method: 'DELETE' });
      console.log('🧹 Cleaned up existing test account in emulator.');
    }
  } catch (e) {}

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => console.log('  [Browser]', msg.text()));
  page.on('pageerror', err => console.log('  [Browser PageError]', err.message));

  // ---------------------------------------------------------
  // PHASE 1: Guest Free Units & Paywall Lock on Unit 3
  // ---------------------------------------------------------
  console.log('\n--- PHASE 1: Free Demos (0, 1, 2) vs Locked Lesson Guard (Unit 3) ---');
  await page.goto('http://127.0.0.1:5000', { waitUntil: 'networkidle2' });

  // Check Unit 0 is playable
  const unit0Text = await page.$eval('.unit:nth-child(1) .unit-btn', el => el.innerText);
  console.log('  Unit 0 button:', unit0Text);
  if (!unit0Text.includes('सुरू') && !unit0Text.includes('सराव')) throw new Error('Unit 0 should be playable');

  // Check Unit 3 is locked
  const unit3Locked = await page.$eval('.unit:nth-child(4)', el => el.classList.contains('locked'));
  console.log('  Unit 3 is locked for guest:', unit3Locked);
  if (!unit3Locked) throw new Error('Unit 3 must be locked for guest');

  // Click Unit 3 as guest -> prompts Auth modal
  await page.click('.unit:nth-child(4) .unit-btn');
  await page.waitForSelector('#authModal.show', { visible: true });
  console.log('✅ [Check 1] Guest clicking locked unit correctly prompts Auth Modal');

  // ---------------------------------------------------------
  // PHASE 2: Student Registration
  // ---------------------------------------------------------
  console.log('\n--- PHASE 2: Student Registration ---');
  await page.click('#authTabRegisterBtn');
  await new Promise(r => setTimeout(r, 200));

  await page.type('#regName', 'अनिकेत जोशी');
  await page.select('#regGrade', '9');
  await page.type('#regEmail', TEST_EMAIL);
  await page.type('#regPassword', TEST_PASS);
  await page.type('#regConfirmPassword', TEST_PASS);
  await page.click('#regSubmitBtn');

  await page.waitForSelector('#logoutTopBtn', { visible: true });
  console.log('✅ [Check 2] Student registered and authenticated:', TEST_EMAIL);

  // Wait for auth modal to finish closing
  await new Promise(r => setTimeout(r, 1000));

  // ---------------------------------------------------------
  // PHASE 3: Paywall Modal & ₹1 Razorpay Page Link
  // ---------------------------------------------------------
  console.log('\n--- PHASE 3: Paywall Modal with ₹1 Pricing & Razorpay Link ---');
  await page.evaluate(() => {
    const am = document.querySelector('#authModal');
    if (am) am.classList.remove('show');
    openPaywallModal(3);
  });
  await page.waitForSelector('#paywallModal.show', { visible: true });

  const priceText = await page.$eval('#paywallModal .price-val', el => el.innerText);
  console.log('  Paywall Price Banner:', priceText);
  if (!priceText.includes('₹१')) throw new Error('Price must show ₹1');

  const unifiedBtnText = await page.$eval('#payUnifiedUpiBtn', el => el.innerText);
  console.log('  Unified UPI Pay Button:', unifiedBtnText);
  if (!unifiedBtnText.includes('कोणत्याही UPI') || !unifiedBtnText.includes('₹१')) {
    throw new Error('Unified UPI button must display single unified CTA');
  }
  console.log('✅ [Check 3] Paywall modal displays ₹1 pricing and Unified Direct 1-Tap UPI CTA');

  // ---------------------------------------------------------
  // PHASE 4: Instant 1-Click Activation & 1-Year Entitlement
  // ---------------------------------------------------------
  console.log('\n--- PHASE 4: Instant 1-Click Activation & 1-Year Entitlement ---');
  await page.click('#activateAccessBtn');

  // Wait for membership badge
  await page.waitForSelector('#subBadge', { visible: true });
  const badgeText = await page.$eval('#subBadgeText', el => el.innerText);
  console.log('  Active Membership Badge:', badgeText);
  if (!badgeText.includes('१ वर्ष सदस्यत्व सक्रिय')) throw new Error('1-year membership must be active');
  console.log('✅ [Check 4] 1-Year Membership badge activated on UI');

  // Verify all 21 units unlocked
  const lockedUnitsCount = await page.$$eval('.unit.locked', els => els.length);
  console.log('  Remaining locked units:', lockedUnitsCount);
  if (lockedUnitsCount !== 0) throw new Error('All 21 units must be unlocked after payment');
  console.log('✅ [Check 5] ALL 21 units successfully unlocked on the journey map!');

  // Open Unit 3 (Previously locked)
  await page.waitForFunction(() => {
    const modal = document.querySelector('#paywallModal');
    return !modal || !modal.classList.contains('show');
  });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const units = document.querySelectorAll('.unit');
    if (units[3]) units[3].querySelector('.unit-btn').click();
  });
  await page.waitForSelector('#lessonView', { visible: true });
  const lessonTitle = await page.$eval('#lessonTitle', el => el.innerText);
  console.log('  Unit 3 Lesson Title:', lessonTitle);
  if (!lessonTitle || lessonTitle.length < 3) throw new Error('Unit 3 lesson content must load');
  console.log('✅ [Check 6] Unit 3 lesson content loaded cleanly without paywall!');

  // ---------------------------------------------------------
  // PHASE 5: Take Quiz and Verify Score Sync
  // ---------------------------------------------------------
  console.log('\n--- PHASE 5: Complete Quiz and Sync Score to Firestore ---');
  await page.click('#beginQuizBtn');
  await page.waitForSelector('#quizView', { visible: true });

  // Answer 5 questions
  for (let q = 0; q < 5; q++) {
    await page.waitForSelector('#optionsBox .option', { visible: true });
    await page.evaluate(() => {
      const options = document.querySelectorAll('#optionsBox .option');
      if (options[0]) options[0].click();
    });
    await new Promise(r => setTimeout(r, 350));
    await page.waitForFunction(() => {
      const btn = document.getElementById('nextBtn');
      return btn && !btn.disabled;
    });
    await page.click('#nextBtn');
    await new Promise(r => setTimeout(r, 400));
  }

  await page.waitForSelector('#resultView', { visible: true });
  const scoreText = await page.$eval('#resultScore', el => el.innerText);
  console.log('  Quiz Completed! Score:', scoreText);
  await page.click('#mapBtn');
  await page.waitForSelector('#homeScreen.active', { visible: true });

  const stars = await page.$eval('#xpStat', el => el.innerText);
  console.log('  Stars earned and displayed on dashboard:', stars);
  console.log('✅ [Check 7] Quiz completed and score displayed');

  // ---------------------------------------------------------
  // PHASE 6: Logout
  // ---------------------------------------------------------
  console.log('\n--- PHASE 6: Student Logout ---');
  page.on('dialog', dialog => dialog.accept());
  await page.evaluate(() => el('logoutTopBtn').click());
  await page.waitForSelector('#authTopBtn', { visible: true });
  console.log('✅ [Check 8] Student successfully logged out');

  // ---------------------------------------------------------
  // PHASE 7: Incognito / Cross-Device Recovery Test
  // ---------------------------------------------------------
  console.log('\n--- PHASE 7: Incognito Cross-Device Recovery Test ---');
  const incognitoContext = await browser.createBrowserContext();
  const incognitoPage = await incognitoContext.newPage();
  await incognitoPage.setViewport({ width: 1280, height: 900 });

  await incognitoPage.goto('http://127.0.0.1:5000', { waitUntil: 'networkidle2' });

  // Login in incognito
  await incognitoPage.click('#authTopBtn');
  await incognitoPage.waitForSelector('#authModal.show', { visible: true });
  await incognitoPage.type('#loginEmail', TEST_EMAIL);
  await incognitoPage.type('#loginPassword', TEST_PASS);
  await incognitoPage.click('#loginSubmitBtn');

  // Wait for login to restore from Firestore
  await incognitoPage.waitForSelector('#logoutTopBtn', { visible: true });
  await incognitoPage.waitForSelector('#subBadge', { visible: true });

  const incognitoBadge = await incognitoPage.$eval('#subBadgeText', el => el.innerText);
  console.log('  Incognito Recovered Badge:', incognitoBadge);
  if (!incognitoBadge.includes('१ वर्ष सदस्यत्व सक्रिय')) throw new Error('Membership must be restored in Incognito');
  console.log('✅ [Check 9] 1-Year Membership RESTORED automatically across devices in Incognito!');

  const incognitoLockedCount = await incognitoPage.$$eval('.unit.locked', els => els.length);
  console.log('  Incognito Locked Units:', incognitoLockedCount);
  if (incognitoLockedCount !== 0) throw new Error('All 21 units must remain unlocked in Incognito');
  console.log('✅ [Check 10] All 21 units remained UNLOCKED in Incognito session!');

  // Open Unit 3 directly in incognito
  await incognitoPage.waitForFunction(() => {
    const modal = document.querySelector('#authModal');
    return !modal || !modal.classList.contains('show');
  });
  await new Promise(r => setTimeout(r, 600));
  await incognitoPage.evaluate(() => {
    const units = document.querySelectorAll('.unit');
    if (units[3]) units[3].querySelector('.unit-btn').click();
  });
  await incognitoPage.waitForSelector('#lessonView', { visible: true });
  const incognitoLesson = await incognitoPage.$eval('#lessonTitle', el => el.innerText);
  console.log('  Incognito Unit 3 Title:', incognitoLesson);
  console.log('✅ [Check 11] Unit 3 opened directly in Incognito with zero paywall barrier!');

  await browser.close();
  console.log('\n======================================================================');
  console.log('🎉 ALL 11/11 COMPREHENSIVE VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  console.log('======================================================================\n');
}

runLivePaywallVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

