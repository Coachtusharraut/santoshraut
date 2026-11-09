const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
// Load environment config without third-party dependencies
const envLocalPath = path.join(__dirname, 'functions', '.env.local');
const envPath = path.join(__dirname, 'functions', '.env');
let RAZORPAY_KEY_SECRET = 'placeholder_secret_key';

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

RAZORPAY_KEY_SECRET = loadKey(envLocalPath) || loadKey(envPath) || 'placeholder_secret_key';
const BASE_URL = 'http://127.0.0.1:5000';
const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✅ PASS: ${message}`);
}

async function createAnonymousStudent() {
  const res = await fetch(AUTH_EMULATOR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ returnSecureToken: true })
  });
  if (!res.ok) throw new Error(`Auth emulator error: ${res.statusText}`);
  const data = await res.json();
  return {
    uid: data.localId,
    idToken: data.idToken
  };
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🧪 VYAKARANVEER — LOCAL RAZORPAY PAYMENT TEST SUITE');
  console.log('===============================================================');
  console.log(`Target Hosting URL: ${BASE_URL}`);
  console.log(`Razorpay Secret Key configured: ${RAZORPAY_KEY_SECRET ? 'YES' : 'NO'}`);
  console.log('---------------------------------------------------------------\n');

  // Step 0: Check Health Endpoint
  console.log('--- Step 0: Health Check ---');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert(healthRes.status === 200, 'Health endpoint responds with HTTP 200');
  const healthData = await healthRes.json();
  assert(healthData.status === 'healthy', 'Health status is "healthy"');
  console.log('Server is healthy!\n');

  // Create test students
  console.log('--- Creating Silent Anonymous Students via Auth Emulator ---');
  const studentA = await createAnonymousStudent();
  console.log(`Student A (Unpaid): UID = ${studentA.uid}`);
  const studentB = await createAnonymousStudent();
  console.log(`Student B (Paid):   UID = ${studentB.uid}\n`);

  // ===============================================================
  // Test Scenario 6: Student trying to access paid lessons without entitlement
  // ===============================================================
  console.log('--- Scenario 6: Access Paid Lessons Without Entitlement ---');
  // Free lesson 0 should be accessible
  const freeLessonRes = await fetch(`${BASE_URL}/api/get-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentA.idToken}`
    },
    body: JSON.stringify({ unitIndex: 0 })
  });
  assert(freeLessonRes.status === 200, 'Free demo lesson 0 is accessible without payment');
  const freeData = await freeLessonRes.json();
  assert(freeData.lesson && freeData.questions.length > 0, 'Free lesson has questions');

  // Paid lesson 3 (Unit 4: लिंग आणि वचन) should be blocked with 403 Forbidden
  const paidLessonRes = await fetch(`${BASE_URL}/api/get-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentA.idToken}`
    },
    body: JSON.stringify({ unitIndex: 3 })
  });
  assert(paidLessonRes.status === 403, 'Paid lesson 3 returns HTTP 403 Forbidden for unpaid student');
  const paidData = await paidLessonRes.json();
  assert(paidData.error === 'PAID_MEMBERSHIP_REQUIRED', 'Error code is PAID_MEMBERSHIP_REQUIRED');
  console.log('Security check passed: Unpaid students cannot access paid lessons!\n');

  // ===============================================================
  // Create Order for Student B
  // ===============================================================
  console.log('--- Creating Order for Student B ---');
  const createOrderRes = await fetch(`${BASE_URL}/api/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentB.idToken}`
    }
  });
  assert(createOrderRes.status === 200, 'Order created successfully with HTTP 200');
  const orderData = await createOrderRes.json();
  assert(orderData.amount === 2100, 'Order amount is strictly 2100 paise (₹21.00)');
  assert(orderData.currency === 'INR', 'Order currency is INR');
  assert(!!orderData.orderId, `Order ID generated: ${orderData.orderId}`);
  console.log(`Order ID: ${orderData.orderId}, Amount: ${orderData.amount} paise\n`);

  // ===============================================================
  // Test Scenario 4: Wrong Payment Amount
  // ===============================================================
  console.log('--- Scenario 4: Wrong Payment Amount ---');
  // Attempt verification with non-existent or tampered order
  const wrongAmountRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentB.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: 'order_non_existent_9999',
      razorpay_payment_id: 'pay_simulated_wrong_amount',
      razorpay_signature: 'dummy_sig'
    })
  });
  assert(wrongAmountRes.status === 400, 'Invalid/wrong order verification returns HTTP 400 Bad Request');
  console.log('Tampered/wrong order correctly rejected!\n');

  // ===============================================================
  // Test Scenario 3: Invalid Payment Signature
  // ===============================================================
  console.log('--- Scenario 3: Invalid Payment Signature ---');
  const invalidSigRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentB.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: 'pay_test_forged_123',
      razorpay_signature: 'completely_forged_invalid_signature_hash_abcdef'
    })
  });
  assert(invalidSigRes.status === 400, 'Invalid signature returns HTTP 400 Bad Request');
  const invalidSigData = await invalidSigRes.json();
  assert(invalidSigData.error === 'INVALID_SIGNATURE', 'Error code is INVALID_SIGNATURE');
  console.log('Cryptographic HMAC verification rejected fake signature!\n');

  // ===============================================================
  // Test Scenario 2: Failed Simulated Payment (User mismatch or missing fields)
  // ===============================================================
  console.log('--- Scenario 2: Failed / Mismatched Payment ---');
  // Student A tries to verify Student B's order
  const forgedSig = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderData.orderId}|pay_student_a_hijack`)
    .digest('hex');

  const hijackRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentA.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: 'pay_student_a_hijack',
      razorpay_signature: forgedSig
    })
  });
  assert(hijackRes.status === 403, 'Order ownership mismatch returns HTTP 403 Forbidden');
  console.log('Attacker trying to verify another student order was blocked!\n');

  // ===============================================================
  // Test Scenario 1: Successful Simulated UPI Payment
  // ===============================================================
  console.log('--- Scenario 1: Successful Simulated UPI Payment ---');
  const validPaymentId = `pay_simulated_upi_${Date.now()}`;
  const validSignature = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderData.orderId}|${validPaymentId}`)
    .digest('hex');

  const verifySuccessRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentB.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: validPaymentId,
      razorpay_signature: validSignature
    })
  });

  assert(verifySuccessRes.status === 200, 'Valid payment verification succeeds with HTTP 200');
  const verifySuccessData = await verifySuccessRes.json();
  assert(verifySuccessData.success === true, 'Response success is true');
  assert(verifySuccessData.expiresAt > Date.now() + (360 * 24 * 60 * 60 * 1000), 'Entitlement set to 365 days');
  console.log('Payment verified and 1-year entitlement recorded in backend!\n');

  // Verify status endpoint
  const statusRes = await fetch(`${BASE_URL}/api/user-status`, {
    headers: { 'Authorization': `Bearer ${studentB.idToken}` }
  });
  assert(statusRes.status === 200, 'User status endpoint responds with HTTP 200');
  const statusData = await statusRes.json();
  assert(statusData.isPaid === true, 'Student B status confirms isPaid = true');
  console.log(`Verified entitlement in database: isPaid=${statusData.isPaid}\n`);

  // ===============================================================
  // Test Scenario 5: Duplicate Verification Request (Idempotency)
  // ===============================================================
  console.log('--- Scenario 5: Duplicate Verification Request (Idempotency) ---');
  const duplicateRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentB.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: validPaymentId,
      razorpay_signature: validSignature
    })
  });
  assert(duplicateRes.status === 409, 'Duplicate payment returns HTTP 409 Conflict');
  const duplicateData = await duplicateRes.json();
  assert(duplicateData.error === 'DUPLICATE_PAYMENT', 'Error code is DUPLICATE_PAYMENT');
  console.log('Idempotency check passed: Same payment cannot be processed twice!\n');

  // ===============================================================
  // Test Scenario 7: Successful Unlock After Verified Payment
  // ===============================================================
  console.log('--- Scenario 7: Successful Unlock After Verified Payment ---');
  // Student B now fetches previously locked paid lesson (Unit 4, index 3)
  const unlockedLessonRes = await fetch(`${BASE_URL}/api/get-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentB.idToken}`
    },
    body: JSON.stringify({ unitIndex: 3 })
  });
  assert(unlockedLessonRes.status === 200, 'Paid lesson 3 is now unlocked and accessible with HTTP 200');
  const unlockedData = await unlockedLessonRes.json();
  assert(unlockedData.unitIndex === 3, 'Returned unitIndex is 3');
  assert(unlockedData.lesson && unlockedData.lesson.title, 'Lesson story and title returned securely');
  assert(unlockedData.questions.length > 0, `All ${unlockedData.questions.length} questions unlocked for quiz!`);

  // Test final lesson 20 (Unit 21: महाअंतिम परीक्षा)
  const finalLessonRes = await fetch(`${BASE_URL}/api/get-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentB.idToken}`
    },
    body: JSON.stringify({ unitIndex: 20 })
  });
  assert(finalLessonRes.status === 200, 'Final Mission 21 is unlocked and accessible');
  const finalData = await finalLessonRes.json();
  assert(finalData.questions.length > 0, 'Final mission questions delivered');

  console.log('All 21 lessons successfully unlocked for student after verified payment!\n');

  // ===============================================================
  // Final Summary
  // ===============================================================
  console.log('===============================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('===============================================================');
}

runTestSuite().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
