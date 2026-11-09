const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { FieldValue, Timestamp } = require('firebase-admin/firestore');
const Razorpay = require('razorpay');

// 1. Load local environment variables
const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret_key';

// 2. Initialize Firebase Admin SDK
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const sa = typeof process.env.FIREBASE_SERVICE_ACCOUNT_KEY === 'string'
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      admin.initializeApp({
        credential: admin.credential.cert(sa)
      });
      console.log('Firebase Admin initialized with external Service Account Key');
    } catch (e) {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY, falling back to default:', e.message);
      admin.initializeApp();
    }
  } else {
    admin.initializeApp();
  }
}

// 3. Load secure units data (all 21 units with questions & lesson content)
let unitsData = [];
try {
  unitsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'units_data.json'), 'utf8'));
} catch (e) {
  console.error('Failed to load units_data.json:', e);
}

// Helper: Razorpay client
function getRazorpayInstance() {
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
}

// Express App & Router
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const router = express.Router();

// Auth Middleware: Verifies Firebase ID Token
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Invalid or expired Firebase ID token' });
  }
}

// Optional Auth Middleware (allows unauthenticated callers, but extracts user if token present)
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1].trim();
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
    } catch (e) {
      // Ignore token decode failure for optional auth
    }
  }
  next();
}

// -------------------------------------------------------------
// 1. Health & Config Endpoint
// -------------------------------------------------------------
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    razorpayConfigured: RAZORPAY_KEY_ID !== 'rzp_test_placeholder'
  });
});

// -------------------------------------------------------------
// 2. Create Razorpay Order (/create-order)
// -------------------------------------------------------------
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;

    // Reject anonymous accounts for orders/payments (Requirement A.5 & D.1)
    if (req.user.firebase && req.user.firebase.sign_in_provider === 'anonymous') {
      return res.status(403).json({
        error: 'ANONYMOUS_NOT_ALLOWED',
        message: 'पेमेंट करण्यासाठी कृपया आपले कायमस्वरूपी विद्यार्थी खाते तयार करा किंवा लॉगिन करा.'
      });
    }

    // Check if student already has an active valid membership (Requirement D.8)
    const userSnap = await admin.firestore().collection('users').doc(uid).get();
    if (userSnap.exists) {
      const userData = userSnap.data();
      if (userData.isPaid === true) {
        let isActive = true;
        if (userData.expiresAt) {
          const expMs = userData.expiresAt.toMillis ? userData.expiresAt.toMillis() : new Date(userData.expiresAt).getTime();
          if (expMs <= Date.now()) {
            isActive = false;
          }
        }
        if (isActive) {
          return res.status(400).json({
            error: 'MEMBERSHIP_ALREADY_ACTIVE',
            message: 'आपले १ वर्षाचे सदस्यत्व आधीपासूनच सक्रिय आहे. पुन्हा पेमेंट करण्याची आवश्यकता नाही.'
          });
        }
      }
    }

    const amountInPaise = 2100; // Strictly ₹21.00 = 2100 paise
    const currency = 'INR';
    const receipt = `rcpt_${uid.substring(0, 8)}_${Date.now()}`;

    let razorpayOrderId;

    // If live/real test keys are provided, call Razorpay API
    if (RAZORPAY_KEY_ID !== 'rzp_test_placeholder' && !RAZORPAY_KEY_ID.includes('placeholder')) {
      const rzp = getRazorpayInstance();
      const order = await rzp.orders.create({
        amount: amountInPaise,
        currency: currency,
        receipt: receipt,
        notes: {
          uid: uid,
          purpose: 'Marathi Vyakaranveer 1-Year Membership'
        }
      });
      razorpayOrderId = order.id;
    } else {
      // Mock/Simulated test order generation for local offline testing
      razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    // Save pending order in Firestore under orders/{orderId}
    const orderData = {
      orderId: razorpayOrderId,
      uid: uid,
      amount: amountInPaise,
      currency: currency,
      status: 'created',
      receipt: receipt,
      createdAt: FieldValue.serverTimestamp()
    };

    await admin.firestore().collection('orders').doc(razorpayOrderId).set(orderData);

    return res.json({
      success: true,
      orderId: razorpayOrderId,
      keyId: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: currency,
      name: 'व्याकरणवीर — मराठी व्याकरणाची शब्दयात्रा',
      description: '१ वर्ष संपूर्ण ॲक्सेस (२१ धडे)'
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: 'ORDER_CREATION_FAILED', message: err.message });
  }
});

// -------------------------------------------------------------
// 3. Verify Payment & Grant Entitlement (/verify-payment)
// -------------------------------------------------------------
router.post('/verify-payment', requireAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'MISSING_PAYMENT_FIELDS',
        message: 'razorpay_order_id, razorpay_payment_id and razorpay_signature are required'
      });
    }

    const uid = req.user.uid;

    // A. Check order existence and ownership in Firestore
    const orderRef = admin.firestore().collection('orders').doc(razorpay_order_id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(400).json({
        error: 'ORDER_NOT_FOUND',
        message: 'Order not found in system records'
      });
    }

    const orderData = orderSnap.data();

    // Verify order belongs to the authenticated user
    if (orderData.uid !== uid) {
      return res.status(403).json({
        error: 'ORDER_USER_MISMATCH',
        message: 'This order does not belong to the authenticated user'
      });
    }

    // Verify order amount is strictly 2100 paise
    if (orderData.amount !== 2100) {
      return res.status(400).json({
        error: 'INVALID_ORDER_AMOUNT',
        message: 'Order amount does not match the ₹21 requirement'
      });
    }

    // B. Check Idempotency (Prevent duplicate processing of same payment ID)
    const paymentRef = admin.firestore().collection('payments').doc(razorpay_payment_id);
    const paymentSnap = await paymentRef.get();

    if (paymentSnap.exists) {
      return res.status(409).json({
        error: 'DUPLICATE_PAYMENT',
        message: 'Payment has already been verified and processed'
      });
    }

    // C. Verify cryptographic HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        error: 'INVALID_SIGNATURE',
        message: 'Razorpay payment signature verification failed'
      });
    }

    // D. If connected with real test credentials, verify status directly from Razorpay API
    if (RAZORPAY_KEY_ID !== 'rzp_test_placeholder' && !RAZORPAY_KEY_ID.includes('placeholder')) {
      const isSimulatedTestPayment = process.env.FUNCTIONS_EMULATOR === 'true' && razorpay_payment_id.startsWith('pay_simulated_');
      if (!isSimulatedTestPayment) {
        try {
          const rzp = getRazorpayInstance();
          const payment = await rzp.payments.fetch(razorpay_payment_id);

          if (!payment || payment.order_id !== razorpay_order_id) {
            return res.status(400).json({
              error: 'PAYMENT_ORDER_MISMATCH',
              message: 'Payment record does not match the order ID'
            });
          }

          if (payment.amount !== 2100 || payment.currency !== 'INR') {
            return res.status(400).json({
              error: 'WRONG_PAYMENT_AMOUNT',
              message: `Payment amount is ${payment.amount}, expected 2100 paise`
            });
          }

          // Requirement D.3: Grant membership only after server-side payment verification confirms captured status
          if (payment.status !== 'captured') {
            return res.status(400).json({
              error: 'PAYMENT_NOT_CAPTURED',
              message: `Payment status is ${payment.status}, expected captured`
            });
          }
        } catch (rzpErr) {
          console.error('Razorpay API verification error:', rzpErr);
          return res.status(400).json({
            error: 'RAZORPAY_API_ERROR',
            message: rzpErr.message || 'Failed to verify payment with Razorpay'
          });
        }
      }
    }

    // E. Atomic Firestore Batch: Record payment, update order, grant 365-day entitlement
    const batch = admin.firestore().batch();
    const oneYearFromNow = Date.now() + (365 * 24 * 60 * 60 * 1000);

    // 1. Record in payments collection (admin-only)
    batch.set(paymentRef, {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      uid: uid,
      amount: 2100,
      currency: 'INR',
      status: 'verified',
      verifiedAt: FieldValue.serverTimestamp()
    });

    // 2. Mark order as paid
    batch.update(orderRef, {
      status: 'paid',
      paymentId: razorpay_payment_id,
      paidAt: FieldValue.serverTimestamp()
    });

    // 3. Update user entitlement document (users/{uid})
    const userRef = admin.firestore().collection('users').doc(uid);
    batch.set(userRef, {
      isPaid: true,
      plan: 'annual_21',
      planName: '१ वर्ष संपूर्ण ॲक्सेस (२१ धडे)',
      amount: 21,
      paidAt: FieldValue.serverTimestamp(),
      expiresAt: Timestamp.fromMillis(oneYearFromNow),
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });

    await batch.commit();

    return res.json({
      success: true,
      message: 'पेमेंट यशस्वीरित्या पडताळले गेले! १ वर्षाचे सभासदत्व सक्रिय झाले.',
      expiresAt: oneYearFromNow
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    return res.status(500).json({ error: 'VERIFICATION_FAILED', message: err.message });
  }
});

// -------------------------------------------------------------
// 4. Secure Lesson Delivery (/get-lesson)
// -------------------------------------------------------------
router.post('/get-lesson', optionalAuth, async (req, res) => {
  try {
    const { unitIndex } = req.body;

    if (typeof unitIndex !== 'number' || unitIndex < 0 || unitIndex >= unitsData.length) {
      return res.status(400).json({ error: 'INVALID_UNIT_INDEX', message: 'Invalid unit index' });
    }

    const targetUnit = unitsData[unitIndex];

    // Lessons 0, 1, 2 (First 3 lessons) are 100% free demos
    if (unitIndex < 3) {
      return res.json({
        success: true,
        unitIndex: unitIndex,
        isFree: true,
        lesson: targetUnit.lesson,
        questions: targetUnit.questions
      });
    }

    // Lessons 3-20 require valid permanent student authentication and paid membership in Firestore
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        error: 'AUTH_REQUIRED',
        message: 'या धड्यासाठी लॉगिन किंवा ओळख पडताळणी आवश्यक आहे.'
      });
    }

    // Do not permit anonymous accounts to access paid lessons (Requirement A.5)
    if (req.user.firebase && req.user.firebase.sign_in_provider === 'anonymous') {
      return res.status(403).json({
        error: 'ANONYMOUS_NOT_ALLOWED',
        message: 'हा धडा उघडण्यासाठी कृपया आपले कायमस्वरूपी विद्यार्थी खाते तयार करा किंवा लॉगिन करा.'
      });
    }

    const uid = req.user.uid;
    const userSnap = await admin.firestore().collection('users').doc(uid).get();

    let isEntitled = false;
    if (userSnap.exists) {
      const userData = userSnap.data();
      if (userData.isPaid === true) {
        // Check 365-day expiration if timestamp present
        if (userData.expiresAt) {
          const expMs = userData.expiresAt.toMillis ? userData.expiresAt.toMillis() : new Date(userData.expiresAt).getTime();
          if (expMs > Date.now()) {
            isEntitled = true;
          }
        } else {
          isEntitled = true;
        }
      }
    }

    if (!isEntitled) {
      return res.status(403).json({
        error: 'PAID_MEMBERSHIP_REQUIRED',
        message: 'हा धडा उघडण्यासाठी ₹२१ चे १ वर्षाचे सभासदत्व आवश्यक आहे.',
        unitIndex: unitIndex
      });
    }

    // Return the secure lesson and question bank
    return res.json({
      success: true,
      unitIndex: unitIndex,
      isFree: false,
      lesson: targetUnit.lesson,
      questions: targetUnit.questions
    });
  } catch (err) {
    console.error('Error fetching lesson:', err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
});

// -------------------------------------------------------------
// 5. Get User Entitlement Status (/user-status)
// -------------------------------------------------------------
router.get('/user-status', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userSnap = await admin.firestore().collection('users').doc(uid).get();

    if (!userSnap.exists) {
      return res.json({
        uid: uid,
        isPaid: false,
        expiresAt: null
      });
    }

    const data = userSnap.data();
    let isPaid = !!data.isPaid;
    if (isPaid && data.expiresAt) {
      const expMs = data.expiresAt.toMillis ? data.expiresAt.toMillis() : new Date(data.expiresAt).getTime();
      if (expMs <= Date.now()) {
        isPaid = false;
      }
    }

    return res.json({
      uid: uid,
      isPaid: isPaid,
      expiresAt: data.expiresAt ? (data.expiresAt.toMillis ? data.expiresAt.toMillis() : data.expiresAt) : null,
      plan: data.plan || null,
      planName: data.planName || null,
      paymentId: data.paymentId || null
    });
  } catch (err) {
    console.error('Error getting user status:', err);
    return res.status(500).json({ error: 'STATUS_ERROR', message: err.message });
  }
});

// Mount router on both '/api' and '/' so it seamlessly handles hosting rewrites
app.use('/api', router);
app.use('/', router);

// Export Cloud Function for Firebase
exports.api = functions.https.onRequest(app);

// Export Express app for Vercel / Render / Node standalone server
module.exports = app;

if (require.main === module || (!process.env.FUNCTION_TARGET && process.env.PORT)) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Backend API listening on port ${PORT}`);
  });
}
