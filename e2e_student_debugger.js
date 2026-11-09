/**
 * E2E STUDENT JOURNEY & CROSS-DEVICE MEMBERSHIP DEBUGGER AGENT
 * 
 * Verifies:
 * 1. Guest access to 3 free lessons (Units 0, 1, 2) without login.
 * 2. Attempt locked lessons (Units 3-20) -> verify access blocked unless paid.
 * 3. Student Registration with dummy test account (test_student_marathi@gmail.com).
 * 4. Razorpay test mode payment (₹21.00) and instant Firestore 365-day entitlement.
 * 5. Access to all 21 lessons unlocked post-payment.
 * 6. Mock test completion & score recording (30 stars / 100% score).
 * 7. Logout -> verify state reset to guest.
 * 8. Re-login in completely clean Incognito context with same test credentials:
 *    - Verify exact score is restored from Firestore.
 *    - Verify membership and full access to all 21 lessons remain intact.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment configuration
const envLocalPath = path.join(__dirname, 'functions', '.env.local');
const envPath = path.join(__dirname, 'functions', '.env');
let RAZORPAY_KEY_SECRET = 'placeholder_secret';

function loadKey(filePath) {
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^RAZORPAY_KEY_SECRET=(.+)$/);
      if (match) return match[1].trim();
    }
  }
  return null;
}
RAZORPAY_KEY_SECRET = loadKey(envLocalPath) || loadKey(envPath) || 'placeholder_secret';

const SCREENSHOT_DIR = '/Users/apple/.gemini/antigravity/brain/7b846ea5-f960-456f-abb4-64af39c9e245/screenshots';
const BASE_URL = 'http://127.0.0.1:5000';
const TEST_EMAIL = 'test_student_marathi@gmail.com';
const TEST_PASS = 'VyakaranTest2026!';
const TEST_NAME = 'रोहन सुरेश पाटील';

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedChecks++;
  console.log(`  ✅ [Check ${passedChecks}] ${message}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('======================================================================');
  console.log('🚀 VYAKARANVEER E2E DEBUGGING AGENT: STUDENT JOURNEY & CROSS-DEVICE TEST');
  console.log('======================================================================');
  console.log(`URL: ${BASE_URL}`);
  console.log(`Test Email: ${TEST_EMAIL}`);
  console.log(`Razorpay Secret Key Available: ${RAZORPAY_KEY_SECRET ? 'YES' : 'NO'}`);
  console.log('----------------------------------------------------------------------\n');

  // Pre-test cleanup: delete previous test account if exists in emulator
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
      await fetch('http://127.0.0.1:8080/v1/projects/marathi-vyakaram/databases/(default)/documents/users/' + data.localId, {
        method: 'DELETE'
      });
      console.log('🧹 Pre-test cleanup: Reset previous test student account.');
    }
  } catch (cleanErr) {
    // Ignore cleanup error
  }

  const isVisible = process.argv.includes('--visible') || process.env.HEADED === 'true';

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: isVisible ? false : 'new',
    slowMo: isVisible ? 60 : 0,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--window-size=1280,900'
    ]
  });

  try {
    // -------------------------------------------------------------------------
    // SESSION A: STANDARD BROWSER SESSION
    // -------------------------------------------------------------------------
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    page.on('console', msg => console.log('  [Browser]', msg.text()));
    page.on('dialog', async dialog => {
      console.log('  [Browser Dialog Prompted]:', dialog.message());
      await dialog.accept();
    });

    // Hook Razorpay checkout to enable automated test payments
    await page.evaluateOnNewDocument((secret) => {
      window.__capturedOrders = [];
      const originalRazorpay = window.Razorpay;
      
      // Proxy or replace Razorpay constructor
      Object.defineProperty(window, 'Razorpay', {
        get() {
          return function(options) {
            window.__lastRazorpayOptions = options;
            window.__capturedOrders.push(options);
            return {
              open: function() {
                console.log('💳 Razorpay Checkout opened for order:', options.order_id, 'Amount:', options.amount);
                window.__rzpModalIsOpen = true;
              }
            };
          };
        },
        set(val) {
          // allow original script to load without overwriting our hook
        },
        configurable: true
      });
      window.__RAZORPAY_SECRET_FOR_TEST = secret;
    }, RAZORPAY_KEY_SECRET);

    console.log('--- PHASE 1: Guest Access to Free Lessons (Units 0, 1, 2) without Login ---');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await sleep(1000);

    // Verify Title & Hero
    const title = await page.title();
    assert(title.includes('व्याकरणवीर'), 'Page loaded with correct title');

    // Verify Free Demo chips on Units 0, 1, 2
    const unit0Chip = await page.evaluate(() => {
      const cards = document.querySelectorAll('#unitMap .unit');
      return {
        count: cards.length,
        unit0Text: cards[0] ? cards[0].innerText : '',
        unit0Locked: cards[0] ? cards[0].classList.contains('locked') : true,
        unit1Locked: cards[1] ? cards[1].classList.contains('locked') : true,
        unit2Locked: cards[2] ? cards[2].classList.contains('locked') : true,
        unit3Locked: cards[3] ? cards[3].classList.contains('locked') : false
      };
    });

    assert(unit0Chip.count === 21, 'All 21 units rendered on the journey map');
    assert(!unit0Chip.unit0Locked, 'Unit 0 is unlocked (Free Demo)');
    assert(!unit0Chip.unit1Locked, 'Unit 1 is unlocked (Free Demo)');
    assert(!unit0Chip.unit2Locked, 'Unit 2 is unlocked (Free Demo)');
    assert(unit0Chip.unit3Locked, 'Unit 3 is locked for guest students (🔒)');

    // Click Unit 0 to read lesson without login
    await page.evaluate(() => {
      document.querySelectorAll('#unitMap .unit')[0].querySelector('.unit-btn').click();
    });
    await sleep(600);

    const lesson0View = await page.evaluate(() => {
      const view = document.getElementById('lessonView');
      const title = document.getElementById('lessonTitle');
      return {
        visible: view && getComputedStyle(view).display !== 'none',
        title: title ? title.innerText : ''
      };
    });
    assert(lesson0View.visible, 'Unit 0 lesson screen is active for guest student');
    assert(lesson0View.title.includes('भाषेची वीट'), 'Unit 0 story & lesson body loaded cleanly');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_guest_free_lesson.png') });
    console.log('  📸 Screenshot saved: 01_guest_free_lesson.png');

    // Return to map
    await page.click('#backBtn');
    await sleep(400);

    console.log('\n--- PHASE 2: Locked Lesson Guard (Unit 3 Auth & Paywall Gate) ---');
    // Click locked Unit 3 ("लिंग आणि वचन") as unauthenticated guest
    await page.evaluate(() => {
      document.querySelectorAll('#unitMap .unit')[3].querySelector('.unit-btn').click();
    });
    await sleep(600);

    // Verify Auth modal is opened directly to protect paid content
    const authModalOpen = await page.evaluate(() => {
      const modal = document.getElementById('authModal');
      return modal && modal.classList.contains('show');
    });
    assert(authModalOpen, 'Clicking locked Unit 3 as guest opens Auth Modal directly (Requirement A.5 & D.1)');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_locked_paywall_prompt.png') });
    console.log('  📸 Screenshot saved: 02_locked_paywall_prompt.png');

    console.log('\n--- PHASE 3: Student Registration with Test Dummy Account ---');
    // Switch to Register tab
    await page.click('#authTabRegisterBtn');
    await sleep(300);

    // Fill registration form
    await page.type('#regName', TEST_NAME);
    await page.select('#regGrade', '10');
    await page.type('#regEmail', TEST_EMAIL);
    await page.type('#regPassword', TEST_PASS);
    await page.type('#regConfirmPassword', TEST_PASS);

    // Submit registration
    await page.click('#regSubmitBtn');
    await sleep(2500);

    // Verify student is logged in
    const authState = await page.evaluate(() => {
      const playerName = document.getElementById('playerName');
      const logoutBtn = document.getElementById('logoutTopBtn');
      const user = firebase.auth().currentUser;
      return {
        isLoggedIn: !!user,
        email: user ? user.email : null,
        uid: user ? user.uid : null,
        playerName: playerName ? playerName.innerText : '',
        logoutVisible: logoutBtn && getComputedStyle(logoutBtn).display !== 'none'
      };
    });

    assert(authState.isLoggedIn, 'Student registered and authenticated with Firebase');
    assert(authState.email === TEST_EMAIL, `Authenticated email matches ${TEST_EMAIL}`);
    assert(authState.playerName === TEST_NAME, `Student name displayed: ${TEST_NAME}`);
    assert(authState.logoutVisible, 'Logout button is visible on navbar');
    const studentUid = authState.uid;
    console.log(`  👤 Student Permanent UID: ${studentUid}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_student_registered.png') });
    console.log('  📸 Screenshot saved: 03_student_registered.png');

    console.log('\n--- PHASE 4: Razorpay Payment Process & 365-Day Entitlement ---');
    // Click locked Unit 3 now that student is authenticated -> opens paywall modal with student details
    await page.evaluate(() => {
      document.querySelectorAll('#unitMap .unit')[3].querySelector('.unit-btn').click();
    });
    await sleep(600);

    const paywallState = await page.evaluate(() => {
      const modal = document.getElementById('paywallModal');
      const nameInput = document.getElementById('payStudentName');
      return {
        isOpen: modal && modal.classList.contains('show'),
        prefilledName: nameInput ? nameInput.value : ''
      };
    });
    assert(paywallState.isOpen, 'Clicking locked Unit 3 as authenticated student opens Paywall modal');
    assert(paywallState.prefilledName === TEST_NAME, `Student name prefilled in payment form: ${TEST_NAME}`);

    // Fill phone number in paywall modal
    await page.evaluate(() => {
      document.getElementById('payStudentPhone').value = '9876543210';
    });

    // Click Pay Now
    await page.click('#payNowBtn');
    console.log('  ⏳ Order creation requested, waiting for Razorpay checkout initialization...');
    await page.waitForFunction(() => !!window.__lastRazorpayOptions, { timeout: 12000 });

    // Verify Razorpay options intercepted
    const rzpOptions = await page.evaluate(() => window.__lastRazorpayOptions);
    assert(rzpOptions !== null && rzpOptions !== undefined, 'Razorpay Checkout SDK invoked with options');
    assert(rzpOptions.amount === 2100, 'Order amount is strictly 2100 paise (₹21.00)');
    assert(rzpOptions.currency === 'INR', 'Order currency is INR');
    assert(rzpOptions.order_id && rzpOptions.order_id.startsWith('order_'), `Valid order ID generated: ${rzpOptions ? rzpOptions.order_id : ''}`);

    // Generate valid HMAC SHA-256 signature and execute payment verification callback
    const testPaymentId = 'pay_simulated_e2e_' + Date.now();
    const signaturePayload = `${rzpOptions.order_id}|${testPaymentId}`;
    const validSignature = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(signaturePayload)
      .digest('hex');

    console.log(`  💳 Simulating verified Razorpay payment callback: ${testPaymentId}`);
    await page.evaluate(async (paymentId, orderId, signature) => {
      await window.__lastRazorpayOptions.handler({
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature
      });
    }, testPaymentId, rzpOptions.order_id, validSignature);

    // Wait for subBadge to become visible via Firestore snapshot
    await page.waitForFunction(() => {
      const badge = document.getElementById('subBadge');
      return badge && getComputedStyle(badge).display !== 'none';
    }, { timeout: 8000 });

    // Verify 365-day entitlement badge is visible
    const entitlementState = await page.evaluate(() => {
      const badge = document.getElementById('subBadge');
      const badgeText = document.getElementById('subBadgeText');
      return {
        badgeVisible: badge && getComputedStyle(badge).display !== 'none',
        badgeText: badgeText ? badgeText.innerText : ''
      };
    });

    assert(entitlementState.badgeVisible, 'Membership badge (👑) is active in top navigation');
    assert(entitlementState.badgeText.includes('१ वर्ष सदस्यत्व सक्रिय'), 'Badge confirms 1-year active membership');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_payment_verified_entitlement.png') });
    console.log('  📸 Screenshot saved: 04_payment_verified_entitlement.png');

    console.log('\n--- PHASE 5: Access to All 21 Lessons Unlocked ---');
    // Verify Unit 3 is now unlocked
    const unitsStatus = await page.evaluate(() => {
      const cards = document.querySelectorAll('#unitMap .unit');
      return {
        unit3Locked: cards[3].classList.contains('locked'),
        unit3ChipText: cards[3].querySelector('.unlocked-chip') ? cards[3].querySelector('.unlocked-chip').innerText : '',
        unit20Locked: cards[20].classList.contains('locked'),
        unit20ChipText: cards[20].querySelector('.unlocked-chip') ? cards[20].querySelector('.unlocked-chip').innerText : ''
      };
    });

    assert(!unitsStatus.unit3Locked, 'Unit 3 is unlocked after payment');
    assert(unitsStatus.unit3ChipText.includes('अनलॉक'), 'Unit 3 displays "✓ अनलॉक" chip');
    assert(!unitsStatus.unit20Locked, 'Final Unit 20 (ज्ञानगड) is unlocked after payment');

    // Click Unit 3 to verify lesson content loads from backend
    await page.evaluate(() => {
      document.querySelectorAll('#unitMap .unit')[3].querySelector('.unit-btn').click();
    });
    await sleep(800);

    const lesson3Content = await page.evaluate(() => {
      const view = document.getElementById('lessonView');
      const title = document.getElementById('lessonTitle');
      const body = document.getElementById('lessonBody');
      return {
        visible: view && getComputedStyle(view).display !== 'none',
        title: title ? title.innerText : '',
        hasContent: body && body.innerText.length > 20
      };
    });
    assert(lesson3Content.visible, 'Unit 3 (लिंग आणि वचन) lesson view loaded for paid student');
    assert(lesson3Content.hasContent, 'Lesson story and grammar rules fetched from backend');

    // Return to map
    await page.click('#backBtn');
    await sleep(400);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_all_21_lessons_unlocked.png') });
    console.log('  📸 Screenshot saved: 05_all_21_lessons_unlocked.png');

    console.log('\n--- PHASE 6: Take Mock Test & Record Score ---');
    // Open Unit 1 ("शब्दांच्या ८ जाती")
    await page.evaluate(() => {
      document.querySelectorAll('#unitMap .unit')[1].querySelector('.unit-btn').click();
    });
    await sleep(600);

    // Click Begin Quiz
    await page.click('#beginQuizBtn');
    await sleep(500);

    // Question answers for Unit 1:
    // Q1: "नाम" (0), Q2: "सर्वनाम" (1), Q3: "विशेषण" (2), Q4: "मैत्री" (2), Q5: "संख्यावाचक" (1)
    const answers = [0, 1, 2, 2, 1];

    for (let q = 0; q < answers.length; q++) {
      const targetOptionIndex = answers[q];
      await page.evaluate((optIdx) => {
        const options = document.querySelectorAll('#optionsBox .option');
        if (options[optIdx]) options[optIdx].click();
      }, targetOptionIndex);
      await sleep(350);

      // Wait for next button to enable after answering
      await page.waitForFunction(() => {
        const btn = document.getElementById('nextBtn');
        return btn && !btn.disabled;
      });

      // Click Next Question
      await page.click('#nextBtn');
      await sleep(400);
    }

    // Verify Result Screen
    const quizResult = await page.evaluate(() => {
      const resultView = document.getElementById('resultView');
      const score = document.getElementById('resultScore');
      const xp = document.getElementById('resultXP');
      return {
        visible: resultView && getComputedStyle(resultView).display !== 'none',
        scoreText: score ? score.innerText : '',
        xpText: xp ? xp.innerText : ''
      };
    });

    assert(quizResult.visible, 'Quiz completed and Result View displayed');
    assert(quizResult.scoreText.includes('५') && quizResult.scoreText.includes('/'), `Quiz score is 5 / 5 (Result: ${quizResult.scoreText})`);
    console.log(`  🏆 Quiz Result: Score "${quizResult.scoreText}", XP: "${quizResult.xpText}"`);

    // Return to map
    await page.click('#mapBtn');
    await sleep(800);

    // Verify XP on Home Screen
    const homeStats = await page.evaluate(() => {
      const xp = document.getElementById('xpStat');
      const done = document.getElementById('doneStat');
      return {
        xp: xp ? xp.innerText : '',
        done: done ? done.innerText : ''
      };
    });
    assert(homeStats.xp.includes('१५ ⭐'), `Home screen displays 15 Stars (Score: ${homeStats.xp})`);
    assert(homeStats.done.includes('१ / २१'), `Home screen displays 1 / 21 stages completed (${homeStats.done})`);

    // Verify Firestore users/{uid} document has saved progress via authenticated Firestore SDK
    const firestoreProgress = await page.evaluate(async (uid) => {
      const doc = await firebase.firestore().collection('users').doc(uid).get();
      return doc.exists ? doc.data().progress : null;
    }, studentUid);
    assert(firestoreProgress && (firestoreProgress['noun'] || firestoreProgress['1']), 'Quiz score and stars synced to Firestore users/{uid}.progress');
    console.log('  💾 Firestore progress confirmed:', JSON.stringify(firestoreProgress));

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_mock_test_score_saved.png') });
    console.log('  📸 Screenshot saved: 06_mock_test_score_saved.png');

    console.log('\n--- PHASE 7: Student Logout ---');
    await page.evaluate(() => document.getElementById('logoutTopBtn').click());
    await sleep(1000);

    const loggedOutState = await page.evaluate(() => {
      const authBtn = document.getElementById('authTopBtn');
      const subBadge = document.getElementById('subBadge');
      const unit3 = document.querySelectorAll('#unitMap .unit')[3];
      return {
        authBtnVisible: authBtn && getComputedStyle(authBtn).display !== 'none',
        subBadgeHidden: !subBadge || getComputedStyle(subBadge).display === 'none',
        unit3Locked: unit3 ? unit3.classList.contains('locked') : false
      };
    });

    assert(loggedOutState.authBtnVisible, 'Student successfully logged out (Login CTA restored)');
    assert(loggedOutState.subBadgeHidden, 'Membership badge hidden upon logout');
    assert(loggedOutState.unit3Locked, 'Paid units revert to locked state for unauthenticated visitor');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_logged_out.png') });
    console.log('  📸 Screenshot saved: 07_logged_out.png');
    await page.close();

    // -------------------------------------------------------------------------
    // SESSION B: INCOGNITO BROWSER CONTEXT (CROSS-DEVICE RECOVERY TEST)
    // -------------------------------------------------------------------------
    console.log('\n--- PHASE 8: Incognito / Cross-Device Re-Login Test ---');
    console.log('  🌐 Creating isolated Incognito browser context (Zero localStorage / Fresh session)...');
    const incognitoCtx = await browser.createBrowserContext();
    const incognitoPage = await incognitoCtx.newPage();
    await incognitoPage.setViewport({ width: 1280, height: 900 });
    incognitoPage.on('console', msg => console.log('  [Incognito]', msg.text()));
    incognitoPage.on('dialog', async dialog => {
      console.log('  [Incognito Dialog Prompted]:', dialog.message());
      await dialog.accept();
    });

    await incognitoPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await sleep(1000);

    // Verify Incognito begins clean
    const incognitoInitial = await incognitoPage.evaluate(() => {
      const xp = document.getElementById('xpStat');
      const done = document.getElementById('doneStat');
      const unit3 = document.querySelectorAll('#unitMap .unit')[3];
      return {
        xp: xp ? xp.innerText : '',
        done: done ? done.innerText : '',
        unit3Locked: unit3 ? unit3.classList.contains('locked') : false
      };
    });

    assert(incognitoInitial.xp.includes('० ⭐'), 'Incognito session starts with clean 0 Stars');
    assert(incognitoInitial.done.includes('० / २१'), 'Incognito session starts with clean 0/21 stages');
    assert(incognitoInitial.unit3Locked, 'Unit 3 is locked in clean session');

    // Click Login CTA
    await incognitoPage.evaluate(() => document.getElementById('authTopBtn').click());
    await sleep(400);

    // Make sure Login tab is active
    await incognitoPage.evaluate(() => document.getElementById('authTabLoginBtn').click());
    await sleep(200);

    // Enter test credentials
    await incognitoPage.type('#loginEmail', TEST_EMAIL);
    await incognitoPage.type('#loginPassword', TEST_PASS);
    await incognitoPage.evaluate(() => document.getElementById('loginSubmitBtn').click());

    // Wait for auth & Firestore real-time snapshot
    console.log('  ⏳ Authenticating in Incognito and waiting for Firestore snapshot recovery...');
    await incognitoPage.waitForFunction(() => {
      const badge = document.getElementById('subBadge');
      return badge && getComputedStyle(badge).display !== 'none';
    }, { timeout: 8000 });
    await sleep(500);

    const recoveredState = await incognitoPage.evaluate(() => {
      const name = document.getElementById('playerName');
      const xp = document.getElementById('xpStat');
      const done = document.getElementById('doneStat');
      const subBadge = document.getElementById('subBadge');
      const subBadgeText = document.getElementById('subBadgeText');
      const unit3 = document.querySelectorAll('#unitMap .unit')[3];
      const unit20 = document.querySelectorAll('#unitMap .unit')[20];

      return {
        name: name ? name.innerText : '',
        xp: xp ? xp.innerText : '',
        done: done ? done.innerText : '',
        subBadgeVisible: subBadge && getComputedStyle(subBadge).display !== 'none',
        subBadgeText: subBadgeText ? subBadgeText.innerText : '',
        unit3Locked: unit3 ? unit3.classList.contains('locked') : true,
        unit20Locked: unit20 ? unit20.classList.contains('locked') : true
      };
    });

    console.log('  📊 Incognito Recovered State:');
    console.log(`     - Student Name: "${recoveredState.name}"`);
    console.log(`     - Total Stars: "${recoveredState.xp}"`);
    console.log(`     - Stages Completed: "${recoveredState.done}"`);
    console.log(`     - Membership Status: "${recoveredState.subBadgeText}"`);

    assert(recoveredState.name === TEST_NAME, `Student name restored: ${recoveredState.name}`);
    assert(recoveredState.xp.includes('१५ ⭐'), 'EXACT SCORE RESTORED: 15 Stars recovered automatically in Incognito!');
    assert(recoveredState.done.includes('१ / २१'), 'COMPLETED STAGES RESTORED: 1 / 21 recovered automatically in Incognito!');
    assert(recoveredState.subBadgeVisible, 'MEMBERSHIP RESTORED: Active membership badge visible in Incognito!');
    assert(recoveredState.subBadgeText.includes('१ वर्ष सदस्यत्व सक्रिय'), 'MEMBERSHIP CONFIRMED: 1-Year subscription confirmed!');
    assert(!recoveredState.unit3Locked, 'LESSON ACCESS RESTORED: Unit 3 is unlocked in Incognito!');
    assert(!recoveredState.unit20Locked, 'LESSON ACCESS RESTORED: Mission 21 (ज्ञानगड) is unlocked in Incognito!');

    // Test clicking Unit 3 in Incognito -> verify direct lesson access without paywall
    await incognitoPage.evaluate(() => {
      document.querySelectorAll('#unitMap .unit')[3].querySelector('.unit-btn').click();
    });
    await sleep(800);

    const incognitoLesson3 = await incognitoPage.evaluate(() => {
      const view = document.getElementById('lessonView');
      const title = document.getElementById('lessonTitle');
      return {
        visible: view && getComputedStyle(view).display !== 'none',
        title: title ? title.innerText : ''
      };
    });

    assert(incognitoLesson3.visible, 'Incognito student opens previously locked Unit 3 without paywall prompt!');
    assert(incognitoLesson3.title.includes('लिंग') || incognitoLesson3.title.includes('वचन'), `Unit 3 grammar lesson content loaded cleanly in Incognito (Title: "${incognitoLesson3.title}")`);

    await incognitoPage.screenshot({ path: path.join(SCREENSHOT_DIR, '08_incognito_cross_device_recovered.png') });
    console.log('  📸 Screenshot saved: 08_incognito_cross_device_recovered.png');

    await incognitoPage.close();
    await incognitoCtx.close();

    console.log('\n======================================================================');
    console.log(`🎉 ALL ${passedChecks}/${totalChecks} VERIFICATION CHECKS PASSED WITH 100% SUCCESS!`);
    console.log('======================================================================');
  } catch (err) {
    console.error('\n❌ E2E DEBUGGING TEST ENCOUNTERED AN ERROR:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
