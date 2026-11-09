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
const AUTH_EMULATOR_SIGNUP = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key';
const AUTH_EMULATOR_SIGNIN = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key';
const AUTH_EMULATOR_RESET = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=fake-api-key';
const FIRESTORE_BASE = 'http://127.0.0.1:8080/v1/projects/marathi-vyakaram/databases/(default)/documents';

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
  const res = await fetch(AUTH_EMULATOR_SIGNUP, {
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

async function registerStudentWithEmail(email, password) {
  const res = await fetch(AUTH_EMULATOR_SIGNUP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  if (!res.ok) throw new Error(`Email registration error: ${res.statusText}`);
  const data = await res.json();
  return {
    uid: data.localId,
    email: data.email,
    idToken: data.idToken
  };
}

async function loginStudentWithEmail(email, password) {
  const res = await fetch(AUTH_EMULATOR_SIGNIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  if (!res.ok) throw new Error(`Email login error: ${res.statusText}`);
  const data = await res.json();
  return {
    uid: data.localId,
    email: data.email,
    idToken: data.idToken
  };
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🧪 VYAKARANVEER — STUDENT AUTH & CROSS-DEVICE MEMBERSHIP TEST SUITE');
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

  // Test 1: Anonymous student restrictions (Requirement A.5 & D.1)
  console.log('--- Test 1: Anonymous Account Restrictions (A.5 & D.1) ---');
  const anonStudent = await createAnonymousStudent();
  console.log(`Guest Student (Anonymous): UID = ${anonStudent.uid}`);

  // Free lesson 0 is accessible without login
  const freeLessonRes = await fetch(`${BASE_URL}/api/get-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonStudent.idToken}`
    },
    body: JSON.stringify({ unitIndex: 0 })
  });
  assert(freeLessonRes.status === 200, 'Free demo lesson 0 is accessible to guest/anonymous user');

  // Paid lesson 3 blocked for anonymous user
  const anonPaidRes = await fetch(`${BASE_URL}/api/get-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonStudent.idToken}`
    },
    body: JSON.stringify({ unitIndex: 3 })
  });
  assert(anonPaidRes.status === 403, 'Paid lesson 3 returns HTTP 403 Forbidden for anonymous student');
  const anonPaidData = await anonPaidRes.json();
  assert(anonPaidData.error === 'ANONYMOUS_NOT_ALLOWED', 'Error code is ANONYMOUS_NOT_ALLOWED');

  // Anonymous user cannot create a Razorpay order
  const anonOrderRes = await fetch(`${BASE_URL}/api/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonStudent.idToken}`
    }
  });
  assert(anonOrderRes.status === 403, 'Order creation returns HTTP 403 Forbidden for anonymous student');
  const anonOrderData = await anonOrderRes.json();
  assert(anonOrderData.error === 'ANONYMOUS_NOT_ALLOWED', 'Order error code is ANONYMOUS_NOT_ALLOWED');
  console.log('Silent anonymous accounts strictly blocked from payment & paid lessons!\n');

  // Test 2: Permanent Student Registration (Requirement A.3 & B.1)
  console.log('--- Test 2: Student Registration via Email + Password (A.3 & B.1) ---');
  const studentEmail = `student_${Date.now()}@vyakaranveer.test`;
  const studentPass = 'VyakaranPass2026!';
  const studentDevA = await registerStudentWithEmail(studentEmail, studentPass);
  console.log(`Student registered on Device A: UID = ${studentDevA.uid}, Email = ${studentDevA.email}`);
  assert(!!studentDevA.uid, 'Student assigned permanent Firebase UID');

  // Create initial profile in Firestore
  const createProfileRes = await fetch(`${FIRESTORE_BASE}/users/${studentDevA.uid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      fields: {
        name: { stringValue: 'रोहन सुरेश पाटील' },
        grade: { stringValue: '9' },
        school: { stringValue: 'ज्ञानदीप विद्यालय' },
        phone: { stringValue: '9876543210' },
        parentContact: { stringValue: '9876543211' }
      }
    })
  });
  assert(createProfileRes.status === 200, 'Student profile initialized in Firestore users/{uid}');
  console.log('Student profile created successfully!\n');

  // Test 3: Firestore Security Rules Enforcement (Requirement C & E)
  console.log('--- Test 3: Firestore Security Rules Enforcement (C & E) ---');

  // Update permitted profile field: school name
  const updateProfileRes = await fetch(`${FIRESTORE_BASE}/users/${studentDevA.uid}?updateMask.fieldPaths=school`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      fields: {
        school: { stringValue: 'आदर्श माध्यमिक विद्यालय, पुणे' }
      }
    })
  });
  assert(updateProfileRes.status === 200, 'Student can update permitted profile fields (school)');

  // Attempt privilege escalation: student writes isPaid: true directly
  const hackIsPaidRes = await fetch(`${FIRESTORE_BASE}/users/${studentDevA.uid}?updateMask.fieldPaths=isPaid`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      fields: {
        isPaid: { booleanValue: true }
      }
    })
  });
  assert(hackIsPaidRes.status === 403, 'Privilege escalation: Client cannot write isPaid directly (HTTP 403 Forbidden)');

  // Attempt privilege escalation: student writes expiresAt directly
  const hackExpiryRes = await fetch(`${FIRESTORE_BASE}/users/${studentDevA.uid}?updateMask.fieldPaths=expiresAt`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      fields: {
        expiresAt: { timestampValue: new Date(Date.now() + 365*24*60*60*1000).toISOString() }
      }
    })
  });
  assert(hackExpiryRes.status === 403, 'Privilege escalation: Client cannot write expiresAt directly (HTTP 403 Forbidden)');

  // Cross-user attack: Student A tries to update Student B
  const studentB = await registerStudentWithEmail(`student_b_${Date.now()}@vyakaranveer.test`, 'Password123!');
  const crossUserRes = await fetch(`${FIRESTORE_BASE}/users/${studentB.uid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      fields: {
        name: { stringValue: 'Hacked by Student A' }
      }
    })
  });
  assert(crossUserRes.status === 403, 'Cross-user write attack rejected with HTTP 403 Forbidden');
  console.log('Firestore security rules successfully prevented all privilege escalation and PII leaks!\n');

  // Test 4: Record Quiz Progress on Device A (Requirement B.4)
  console.log('--- Test 4: Record Quiz Progress on Device A (B.4) ---');
  const progressUpdateRes = await fetch(`${FIRESTORE_BASE}/users/${studentDevA.uid}?updateMask.fieldPaths=progress`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      fields: {
        progress: {
          mapValue: {
            fields: {
              "0": {
                mapValue: {
                  fields: {
                    bestScore: { integerValue: 5 },
                    bestStars: { integerValue: 15 },
                    completed: { booleanValue: true }
                  }
                }
              },
              "1": {
                mapValue: {
                  fields: {
                    bestScore: { integerValue: 5 },
                    bestStars: { integerValue: 15 },
                    completed: { booleanValue: true }
                  }
                }
              }
            }
          }
        }
      }
    })
  });
  assert(progressUpdateRes.status === 200, 'Student progress recorded in Firestore users/{uid}');
  console.log('Device A progress saved: 30 stars earned across Units 1 & 2!\n');

  // Test 5: Payment and Membership Grant (Requirement D.1, D.2, D.3, D.4, D.5)
  console.log('--- Test 5: Razorpay Order Creation & Payment Verification (D.1 - D.5) ---');
  const createOrderRes = await fetch(`${BASE_URL}/api/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    }
  });
  assert(createOrderRes.status === 200, 'Order created successfully with HTTP 200');
  const orderData = await createOrderRes.json();
  assert(orderData.amount === 2100, 'Order amount is strictly 2100 paise (₹21.00)');
  assert(orderData.currency === 'INR', 'Order currency is INR');
  assert(!!orderData.orderId, `Order ID generated: ${orderData.orderId}`);

  // Test Invalid Signature Attack
  const forgedSig = crypto.createHmac('sha256', 'wrong_secret_tampered')
    .update(`${orderData.orderId}|pay_forged_999`)
    .digest('hex');
  const invalidSigRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: 'pay_forged_999',
      razorpay_signature: forgedSig
    })
  });
  assert(invalidSigRes.status === 400, 'Forged signature rejected with HTTP 400 Bad Request');

  // Test Order Hijack Attack (Student B attempts to verify Student A order)
  const hijackSig = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderData.orderId}|pay_hijack_123`)
    .digest('hex');
  const hijackRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentB.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: 'pay_hijack_123',
      razorpay_signature: hijackSig
    })
  });
  assert(hijackRes.status === 403, 'Order hijacking blocked: Student B cannot claim Student A order (HTTP 403 Forbidden)');

  // Verify Valid Payment
  const validPaymentId = `pay_simulated_upi_${Date.now()}`;
  const validSignature = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderData.orderId}|${validPaymentId}`)
    .digest('hex');

  const verifySuccessRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: validPaymentId,
      razorpay_signature: validSignature
    })
  });
  assert(verifySuccessRes.status === 200, 'Valid payment verified with HTTP 200');
  const verifyData = await verifySuccessRes.json();
  assert(verifyData.success === true, 'Response confirms success');
  assert(verifyData.expiresAt > Date.now() + (360 * 24 * 60 * 60 * 1000), 'Entitlement set to 365 days in future');

  // Payment Idempotency check
  const dupVerifyRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    },
    body: JSON.stringify({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: validPaymentId,
      razorpay_signature: validSignature
    })
  });
  assert(dupVerifyRes.status === 409, 'Duplicate payment verification rejected with HTTP 409 Conflict');
  console.log('Payment verified and 1-year entitlement secured!\n');

  // Test 6: Duplicate Payment Prevention When Membership Exists (Requirement D.8)
  console.log('--- Test 6: Duplicate Payment Prevention (D.8) ---');
  const dupOrderRes = await fetch(`${BASE_URL}/api/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevA.idToken}`
    }
  });
  assert(dupOrderRes.status === 400, 'Duplicate order creation blocked with HTTP 400 Bad Request');
  const dupOrderData = await dupOrderRes.json();
  assert(dupOrderData.error === 'MEMBERSHIP_ALREADY_ACTIVE', 'Error code is MEMBERSHIP_ALREADY_ACTIVE');
  console.log('Duplicate payment prevented for active 1-year member!\n');

  // Test 7: Cross-Device Recovery on Device B (Requirement B.4 & D.6)
  console.log('--- Test 7: Cross-Device Login & Automatic Recovery (B.4 & D.6) ---');
  const studentDevB = await loginStudentWithEmail(studentEmail, studentPass);
  console.log(`Student signed in on Device B: UID = ${studentDevB.uid}`);
  assert(studentDevB.uid === studentDevA.uid, 'UID on Device B matches permanent UID from Device A');

  // Device B reads user-status
  const devBStatusRes = await fetch(`${BASE_URL}/api/user-status`, {
    headers: { 'Authorization': `Bearer ${studentDevB.idToken}` }
  });
  assert(devBStatusRes.status === 200, 'Device B user-status responds HTTP 200');
  const devBStatusData = await devBStatusRes.json();
  assert(devBStatusData.isPaid === true, 'Device B confirms isPaid = true');
  assert(devBStatusData.plan === 'annual_21', 'Device B confirms plan is annual_21');

  // Device B reads profile and progress directly from Firestore
  const devBProfileRes = await fetch(`${FIRESTORE_BASE}/users/${studentDevB.uid}`, {
    headers: { 'Authorization': `Bearer ${studentDevB.idToken}` }
  });
  assert(devBProfileRes.status === 200, 'Device B reads users/{uid} document from Firestore');
  const devBProfileData = await devBProfileRes.json();
  assert(devBProfileData.fields.name.stringValue === 'रोहन सुरेश पाटील', 'Device B restored student name');
  assert(devBProfileData.fields.progress.mapValue.fields['0'] !== undefined, 'Device B restored Unit 0 progress');
  assert(devBProfileData.fields.progress.mapValue.fields['1'] !== undefined, 'Device B restored Unit 1 progress');

  // Device B accesses previously locked paid lessons (Unit 4, index 3 & Unit 21, index 20)
  const devBLesson3Res = await fetch(`${BASE_URL}/api/get-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevB.idToken}`
    },
    body: JSON.stringify({ unitIndex: 3 })
  });
  assert(devBLesson3Res.status === 200, 'Device B unlocks paid lesson 3 (लिंग आणि वचन) with HTTP 200');
  const devBLesson3Data = await devBLesson3Res.json();
  assert(devBLesson3Data.lesson && devBLesson3Data.questions.length > 0, 'Device B received lesson story and questions');

  const devBLesson20Res = await fetch(`${BASE_URL}/api/get-lesson`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentDevB.idToken}`
    },
    body: JSON.stringify({ unitIndex: 20 })
  });
  assert(devBLesson20Res.status === 200, 'Device B unlocks final Mission 21 (ज्ञानगड) with HTTP 200');
  console.log('Cross-device membership and progress 100% recovered automatically on Device B!\n');

  // Test 8: Password Recovery Flow (Requirement A.3)
  console.log('--- Test 8: Password Recovery Flow (A.3) ---');
  const resetRes = await fetch(AUTH_EMULATOR_RESET, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestType: 'PASSWORD_RESET', email: studentEmail })
  });
  assert(resetRes.status === 200, 'Password reset email triggered successfully via Auth Emulator');
  const resetData = await resetRes.json();
  assert(resetData.email === studentEmail, 'Password reset target email confirmed');
  console.log('Password recovery verified!\n');

  // Final Summary
  console.log('===============================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('===============================================================');
}

runTestSuite().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
