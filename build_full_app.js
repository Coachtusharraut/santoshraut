const fs = require('fs');

const units21Complete = JSON.parse(fs.readFileSync('./units_21_complete.json', 'utf8'));
const extraCss = fs.readFileSync('./extra_css.css', 'utf8');

// Read original index.html.bak for base CSS
const originalHtml = fs.readFileSync('./vyakaranveer-app/index.html.bak', 'utf8');
const originalCssStart = originalHtml.indexOf('<style>') + 7;
const originalCssEnd = originalHtml.indexOf('</style>');
const baseCss = originalHtml.slice(originalCssStart, originalCssEnd);

// Combine CSS
const combinedCss = baseCss + '\n' + extraCss;

// Build the full HTML page
const fullHtml = `<!doctype html>
<html lang="mr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<meta name="theme-color" content="#183f3a" />
<meta name="description" content="इयत्ता ८वी ते १०वीच्या विद्यार्थ्यांसाठी गोष्टी, उदाहरणे आणि खेळातून मराठी व्याकरण शिकवणारा संवादात्मक गेम." />
<title>व्याकरणवीर — मराठी व्याकरणाची शब्दयात्रा | संतोष राऊत</title>
<!-- Razorpay Standard Checkout SDK -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<style>
${combinedCss}
</style>
</head>
<body>
<canvas id="confettiCanvas" class="confetti-canvas"></canvas>

<div class="app">
  <header class="topbar">
    <div class="brand">
      <div class="brandmark" id="brandLogo">📚</div>
      <div>
        <span id="brandAppName">व्याकरणवीर</span>
        <div class="brand-byline" id="brandByline">संतोष राऊत यांचे सादरीकरण</div>
      </div>
    </div>
    <div class="top-actions">
      <div id="subBadge" class="sub-badge" style="display:none">
        👑 <span id="subBadgeText">१ वर्ष सदस्यत्व सक्रिय</span>
      </div>
      <button id="unlockTopBtn" class="pill unlock-cta-pill">
        🔒 सर्व २१ धडे अनलॉक करा (₹२१)
      </button>
      <span class="name-tag" id="playerName">नवा खेळाडू</span>
      <button class="pill" id="profileBtn">✏️ नाव बदला</button>
      <button class="pill icon-pill" id="audioToggleBtn" title="आवाज सुरु/बंद">🔊</button>
      <button class="pill" id="shareBtn">↗️ शेअर</button>
      <button class="pill" id="adminTopBtn" style="background:var(--cream);border-color:#ecc664">⚙️ ॲडमिन</button>
    </div>
  </header>

  <main id="homeScreen" class="screen active">
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow" id="heroEyebrow">इयत्ता ८वी • ९वी • १०वी | महाराष्ट्राची शब्दयात्रा</div>
        <h1 id="heroTitle">मराठीचा <span id="heroSpan">खेळ</span> खेळा.<br>व्याकरणाचे हिरो बना!</h1>
        <p id="heroDesc">किल्ले, एसटीचा प्रवास, गणपती मंडळ, क्रिकेट आणि शाळेच्या गमती-जमतीतून मराठी व्याकरण शिका. चुकलात तरी हरकत नाही—प्रत्येक उत्तरामागे एक छोटी शिकवण आहे!</p>
        <button class="primary" id="startBtn">माझी शब्दयात्रा सुरू करा <span>→</span></button>
      </div>
      <div class="hero-art">
        <div class="sun"></div>
        <div class="cloud">☁️</div>
        <div class="fort">🏰</div>
        <div class="art-label">मिशन: ज्ञानगड वाचवा! 🏆</div>
      </div>
    </section>

    <section class="stats" aria-label="तुमची प्रगती">
      <div class="stat"><strong id="xpStat">० ⭐</strong><small>एकूण स्टार्स (कमाल गुण)</small></div>
      <div class="stat"><strong id="doneStat">० / २१</strong><small>पूर्ण केलेले टप्पे</small></div>
      <div class="stat"><strong id="bestStat">—</strong><small>सर्वोत्तम गुण</small></div>
      <div class="stat"><strong id="badgeStat">🌱</strong><small>तुमचा बॅज</small></div>
    </section>

    <div class="section-head">
      <div>
        <h2>🗺️ शब्दयात्रेचा नकाशा</h2>
        <p>पहिले ३ धडे मोफत सराव करा. सर्व २१ टप्पे पूर्ण करून ज्ञानगड गाठा!</p>
      </div>
      <div class="grade-tabs" role="group" aria-label="इयत्ता निवडा">
        <button class="grade-tab active" data-grade="8">८वी</button>
        <button class="grade-tab" data-grade="9">९वी</button>
        <button class="grade-tab" data-grade="10">१०वी</button>
      </div>
    </div>

    <div class="map" id="unitMap"></div>

    <section class="story-banner">
      <div class="emoji">🧭</div>
      <div>
        <strong>कथा सुरू होते नांदेडच्या शाळेतून…</strong>
        <p>ज्ञानगडाचा नकाशा हरवला आहे. तो परत मिळवण्यासाठी महाराष्ट्रभरच्या २१ व्याकरण मोहिमा पूर्ण करा. प्रत्येक योग्य उत्तर म्हणजे नकाशाचा एक तुकडा!</p>
      </div>
    </section>

    <section class="santosh-brand" aria-label="Santosh Raut branding">
      <img id="santoshPhotoImg" class="santosh-photo" src="assets/santosh-raut.jpg" alt="संतोष राऊत यांचे छायाचित्र" loading="lazy" />
      <div class="santosh-copy">
        <div class="santosh-kicker">विशेष सादरीकरण</div>
        <h2 id="brandPresenterName">संतोष राऊत <span style="font-size:.62em;color:#d9ef8a;font-weight:600">| Santosh Raut</span></h2>
        <p id="brandPresenterDesc">महाराष्ट्रातील विद्यार्थ्यांसाठी मराठी व्याकरण शिकण्याचा आनंददायी, गोष्टींवर आधारित उपक्रम.</p>
        <div class="santosh-signature" id="brandSignature">📚 व्याकरणवीर • मराठीची शब्दयात्रा</div>
      </div>
    </section>

    <div class="footer">
      <span id="footerBrandText">व्याकरणवीर • संतोष राऊत • मराठी शिकणे आता खेळासारखे!</span><br>
      सर्व २१ धडे: वर्णविचार, शब्दांच्या जाती, क्रियापद, लिंग व वचन, विभक्ती व कारकार्थ, अव्यये, काळ, वाक्यरूपांतर, प्रयोग, समास, संधी, स्वर संधी, व्यंजन संधी, विसर्ग संधी, अलंकार, शब्दसंपत्ती, विरामचिन्हे, शब्दसिद्धी, वाक्यरचना, वृत्त आणि महाअंतिम ज्ञानगड परीक्षा.<br>
      <button class="admin-link-btn" id="footerAdminBtn">⚙️ शिक्षक / ॲडमिन कन्सोल लॉगिन</button>
    </div>
  </main>

  <main id="gameScreen" class="screen">
    <div class="game-shell">
      <div class="game-head">
        <button class="back" id="backBtn">← नकाशाकडे</button>
        <div>
          <div class="game-title" id="gameTitle">मोहिम</div>
          <div class="game-meta" id="gameMeta">शिका • सराव करा • जिंका</div>
        </div>
        <div class="game-meta" id="gameCounter">० / ५</div>
      </div>
      <div class="game-progress"><div id="gameProgressFill"></div></div>

      <section id="lessonView">
        <div class="lesson-wrap">
          <div class="lesson-main">
            <div class="lesson-kicker" id="lessonKicker">शिकण्याची वेळ</div>
            <h2 id="lessonTitle">आजचा धडा</h2>
            <p id="lessonBody"></p>
            <div class="example-box">
              <strong>💡 गावाकडचं / रोजच्या आयुष्यातलं उदाहरण</strong>
              <p id="lessonExample"></p>
            </div>
          </div>
          <aside class="lesson-side">
            <h3>🧠 लक्षात ठेवा</h3>
            <ul id="lessonPoints"></ul>
            <div class="small-note">हा मुद्दा समजला की पुढची प्रश्नमंजुषा सोपी वाटेल.</div>
          </aside>
        </div>
        <div class="lesson-actions">
          <span class="game-meta" id="lessonLevel">स्तर १ • ओळख</span>
          <button class="primary" id="beginQuizBtn">चला, प्रश्न सोडवूया →</button>
        </div>
      </section>

      <section id="quizView" style="display:none">
        <div class="quiz-wrap">
          <div class="quiz-kicker">
            <span id="quizUnit">व्याकरण सराव</span>
            <span id="quizScore">⭐ ० गुण</span>
          </div>
          <div class="question-card">
            <div class="scene" id="questionScene">📍 प्रसंग</div>
            <h2 id="questionText"></h2>
            <p class="context" id="questionContext"></p>
          </div>
          <div class="options" id="optionsBox"></div>
          <div class="hint" id="hintBox"></div>
          <div class="feedback" id="feedbackBox" aria-live="polite"></div>
          <div class="quiz-controls">
            <button class="hint-btn" id="hintBtn">💡 छोटी हिंट द्या</button>
            <button class="primary" id="nextBtn" disabled>पुढचा प्रश्न →</button>
          </div>
        </div>
      </section>

      <section id="resultView" style="display:none">
        <div class="results">
          <div class="result-medal" id="resultMedal">🏆</div>
          <h2 id="resultTitle">शाब्बास!</h2>
          <p id="resultText"></p>
          <div class="result-stats">
            <div class="result-chip"><strong id="resultScore">०/५</strong><small>बरोबर उत्तरे</small></div>
            <div class="result-chip"><strong id="resultPercent">०%</strong><small>अचूकता</small></div>
            <div class="result-chip"><strong id="resultXP">+० ⭐</strong><small>स्टार्स</small></div>
          </div>
          <div class="result-actions">
            <button class="primary" id="retryBtn">पुन्हा सराव करा ↻</button>
            <button class="secondary" id="mapBtn">नकाशाकडे चला</button>
            <button class="secondary" id="shareResultBtn">निकाल शेअर करा ↗</button>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>

<!-- Modal 1: Name Profile -->
<div class="modal" id="profileModal">
  <div class="modal-card">
    <button class="close-modal-btn" id="closeProfileBtn">&times;</button>
    <h2>तुमचं नाव काय? 👋</h2>
    <p>तुमच्या गुणपत्रिकेवर कोणतं नाव दिसावं?</p>
    <div class="form-row" style="margin:14px 0">
      <input id="nameInput" maxlength="24" placeholder="उदा. सई, अथर्व, आर्या" />
    </div>
    <button class="primary" id="saveNameBtn" style="width:100%">चला, सुरू करूया!</button>
  </div>
</div>

<!-- Modal 2: Paywall Modal (₹21 for 1 Year) -->
<div class="modal" id="paywallModal">
  <div class="modal-card paywall-card">
    <button class="close-modal-btn" id="closePaywallBtn">&times;</button>
    <div class="paywall-header">
      <div class="trophy-badge">🏆</div>
      <h2>मराठी व्याकरणवीर बना — सर्व २१ धडे अनलॉक करा!</h2>
      <p class="paywall-sub">इयत्ता ८वी ते १०वीच्या विद्यार्थ्यांसाठी संपूर्ण मराठी व्याकरणाचा आनंददायी खेळ</p>
    </div>
    <div class="paywall-price-banner">
      <div class="price-val">फक्त ₹२१ <span class="tax-tag">सर्व करांसहित (Incl. of GST)</span></div>
      <div class="validity-val">⏱️ १ वर्ष (३६५ दिवस) संपूर्ण अमर्याद वैधता</div>
    </div>
    <div class="paywall-features">
      <div class="feat-item"><span class="feat-check">✓</span> <div><strong>सर्व २१ व्याकरण मोहिमा:</strong> स्वर संधी, व्यंजन संधी, विसर्ग संधी, विभक्ती व कारकार्थ, समास, अलंकार आणि सर्व बोर्ड विषय.</div></div>
      <div class="feat-item"><span class="feat-check">✓</span> <div><strong>१००+ संवादात्मक प्रश्न:</strong> प्रत्येक प्रश्नासोबत स्पष्टीकरण, संदर्भ आणि हिंट्स.</div></div>
      <div class="feat-item"><span class="feat-check">✓</span> <div><strong>ज्ञानगड महाअंतिम परीक्षा:</strong> प्रावीण्य मिळवा व डिजिटल बॅज जिंका.</div></div>
      <div class="feat-item"><span class="feat-check">✓</span> <div><strong>१ वर्ष अमर्याद सराव:</strong> मोबाईल किंवा लॅपटॉपवर कधीही सराव करा.</div></div>
      <div class="feat-item"><span class="feat-check">✓</span> <div><strong>संतोष राऊत सरांचे मार्गदर्शन:</strong> महाराष्ट्रातील विद्यार्थ्यांसाठी खास डिझाइन.</div></div>
    </div>
    <div class="paywall-form">
      <div class="form-row">
        <label>विद्यार्थ्याचे नाव</label>
        <input type="text" id="payStudentName" placeholder="उदा. सई, अथर्व" />
      </div>
      <div class="form-row">
        <label>मोबाईल / WhatsApp नंबर</label>
        <input type="tel" id="payStudentPhone" placeholder="उदा. 98XXXXXXXX" />
      </div>
    </div>
    <div class="paywall-actions">
      <button class="primary pay-cta-btn" id="payNowBtn">
        💳 ₹२१ भरा आणि लगेच अनलॉक करा 🚀
      </button>
      <div class="pay-trust-note">🔒 १००% सुरक्षित UPI (Google Pay, PhonePe, Paytm, BHIM, Debit/Credit Card)</div>
    </div>
  </div>
</div>

<!-- Modal 3: UPI Direct / QR & Simulator Modal -->
<div class="modal" id="upiModal">
  <div class="modal-card upi-card">
    <button class="close-modal-btn" id="closeUpiBtn">&times;</button>
    <h3>📲 १-टॅप UPI पेमेंट (₹२१)</h3>
    <p style="font-size:13px;color:var(--muted)">कोणत्याही UPI ॲपवरून ₹२१ (GST समाविष्ट) भरा व १ वर्ष वैधतेचा आनंद घ्या:</p>
    <div class="upi-qr-box">
      <div id="upiQrDisplay" class="qr-code-placeholder">
        <svg viewBox="0 0 100 100" width="160" height="160">
          <rect width="100" height="100" fill="#fff"/>
          <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z" fill="#183f3a"/>
          <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z" fill="#183f3a"/>
          <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z" fill="#183f3a"/>
          <circle cx="50" cy="50" r="10" fill="#1e6454"/>
          <rect x="45" y="15" width="8" height="18" fill="#ff9e59"/>
          <rect x="15" y="45" width="18" height="8" fill="#7bc5d3"/>
          <rect x="52" y="62" width="16" height="16" fill="#183f3a"/>
          <rect x="72" y="52" width="16" height="16" fill="#183f3a"/>
          <rect x="50" y="42" width="6" height="6" fill="#fff"/>
        </svg>
      </div>
      <div class="upi-id-copy">
        UPI ID: <strong id="upiIdText">santoshraut@upi</strong>
        <button class="pill-sm" id="copyUpiIdBtn">📋 कॉपी</button>
      </div>
    </div>
    <div class="quick-upi-apps">
      <a id="gpayIntentLink" class="upi-app-btn gpay" href="#">GPay</a>
      <a id="phonepeIntentLink" class="upi-app-btn phonepe" href="#">PhonePe</a>
      <a id="paytmIntentLink" class="upi-app-btn paytm" href="#">Paytm</a>
    </div>
    <div class="utr-input-box">
      <label>पेमेंट झाल्यावर मिळालेला १२ अंकी UTR / Ref No. टाका:</label>
      <div style="display:flex;gap:8px">
        <input type="text" id="utrInput" placeholder="उदा. 428192849201" maxlength="16" />
        <button class="primary" id="verifyUtrBtn">तपासा</button>
      </div>
    </div>
    <div class="sim-box">
      <div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:6px">परीक्षणासाठी किंवा त्वरित चाचणीसाठी:</div>
      <button class="secondary btn-sm" id="simulateSuccessBtn">⚡ थेट अनलॉक चाचणी (Demo Test Unlock)</button>
    </div>
  </div>
</div>

<!-- Modal 4: Admin PIN Prompt -->
<div class="modal" id="adminPinModal">
  <div class="modal-card pin-card" style="max-width:380px;text-align:center">
    <button class="close-modal-btn" id="closePinModalBtn">&times;</button>
    <div style="font-size:42px;margin-bottom:6px">🔐</div>
    <h2 style="margin:0 0 6px">शिक्षक / ॲडमिन लॉगिन</h2>
    <p style="font-size:13px;color:var(--muted);margin:0 0 16px">ॲडमिन कन्सोल उघडण्यासाठी ४ अंकी पिन टाका:</p>
    <div class="form-row">
      <input type="password" id="adminPinInput" maxlength="8" placeholder="पिन टाका (Default: 2121)" style="text-align:center;font-size:20px;letter-spacing:4px" />
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="primary" id="submitAdminPinBtn" style="flex:1">लॉगिन करा</button>
      <button class="secondary" id="cancelAdminPinBtn">रद्द</button>
    </div>
  </div>
</div>

<!-- Modal 5: Full Admin Console & No-Code CMS -->
<div class="modal" id="adminConsoleModal">
  <div class="modal-card admin-modal-card">
    <div class="admin-header">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:28px">⚙️</span>
        <div>
          <h2 style="margin:0;font-size:20px">संतोष राऊत — शिक्षक व ॲडमिन नियंत्रण कक्ष</h2>
          <small style="color:var(--muted);font-weight:700">व्याकरणवीर पोर्टल व्यवस्थापन (No-Code CMS)</small>
        </div>
      </div>
      <button class="close-modal-btn" id="closeAdminConsoleBtn">&times;</button>
    </div>

    <!-- Admin Tabs -->
    <div class="admin-tabs">
      <button class="admin-tab active" data-tab="tabDashboard">📊 डॅशबोर्ड व महसूल</button>
      <button class="admin-tab" data-tab="tabStudents">👥 विद्यार्थी यादी व अनलॉक</button>
      <button class="admin-tab" data-tab="tabCMS">✍️ नो-कोड प्रश्न व धडे संपादक</button>
      <button class="admin-tab" data-tab="tabBranding">🎨 संपूर्ण ॲप ब्रँडिंग व डिझाइन</button>
    </div>

    <!-- Tab 1: Dashboard -->
    <div id="tabDashboard" class="admin-tab-content active">
      <div class="admin-grid-stats">
        <div class="admin-stat-card"><strong id="adminRevenueStat">₹०</strong><small>एकूण महसूल (₹२१ × Paid)</small></div>
        <div class="admin-stat-card"><strong id="adminPaidStudentsStat">०</strong><small>सक्रिय १-वर्ष सदस्यत्वे</small></div>
        <div class="admin-stat-card"><strong id="adminTotalStudentsStat">०</strong><small>नोंदणीकृत विद्यार्थी</small></div>
        <div class="admin-stat-card"><strong id="adminQuizzesStat">०</strong><small>पूर्ण झालेल्या चाचण्या</small></div>
      </div>
      <h3 style="margin:16px 0 8px;font-size:16px">ताजे व्यवहार व विद्यार्थी ॲक्टिव्हिटी</h3>
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead>
            <tr><th>विद्यार्थी नाव</th><th>मोबाईल</th><th>तारीख</th><th>रक्कम</th><th>स्थिती</th><th>वैधता मुदत</th></tr>
          </thead>
          <tbody id="adminRecentPaymentsTable">
            <tr><td colspan="6" style="text-align:center;color:var(--muted)">अजून कोणतेही व्यवहार नाहीत.</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab 2: Students List & Manual Unlock -->
    <div id="tabStudents" class="admin-tab-content">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:10px;flex-wrap:wrap">
        <h3 style="margin:0;font-size:16px">सर्व विद्यार्थी व १-वर्ष ॲक्सेस व्यवस्थापन</h3>
        <input type="text" id="adminStudentSearchInput" placeholder="🔍 विद्यार्थी नाव किंवा मोबाईल शोधा..." style="padding:8px 12px;border:1px solid var(--line);border-radius:10px;font-size:13px;width:240px" />
      </div>
      <div style="overflow-x:auto">
        <table class="admin-table">
          <thead>
            <tr><th>नाव</th><th>मोबाईल</th><th>सदस्यत्व</th><th>वैधता</th><th>कमाल स्टार्स</th><th>कृती (Action)</th></tr>
          </thead>
          <tbody id="adminStudentsTableBody">
            <!-- Dynamically populated -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tab 3: No-Code Question & Lesson CMS -->
    <div id="tabCMS" class="admin-tab-content">
      <div style="background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:18px">
        <div class="form-row">
          <label style="font-weight:800;color:var(--ink)">धडा निवडा (Select Lesson):</label>
          <select id="cmsLessonSelect" style="font-size:15px;font-weight:700"></select>
        </div>
      </div>

      <!-- Lesson Metadata Editor -->
      <div style="border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:18px;background:#fff">
        <h4 style="margin:0 0 12px;font-size:15px">धड्याचा तपशील (Lesson Info)</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-row"><label>धड्याचे नाव</label><input type="text" id="cmsLessonTitle" /></div>
          <div class="form-row"><label>स्थान / ठिकाण (Place)</label><input type="text" id="cmsLessonPlace" /></div>
        </div>
        <div class="form-row" style="margin-top:10px">
          <label>धड्याचे स्पष्टीकरण (Story & Concept Body)</label>
          <textarea id="cmsLessonBody" rows="3"></textarea>
        </div>
        <div class="form-row" style="margin-top:10px">
          <label>रोजच्या आयुष्यातील उदाहरण (Real-Life Example)</label>
          <input type="text" id="cmsLessonExample" />
        </div>
        <div class="form-row" style="margin-top:10px">
          <label>महत्त्वाचे मुद्दे (Key Points - एका ओळीत एक मुद्दा)</label>
          <textarea id="cmsLessonPoints" rows="3"></textarea>
        </div>
      </div>

      <!-- Questions List Editor -->
      <div style="border:1px solid var(--line);border-radius:16px;padding:16px;background:#fff">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h4 style="margin:0;font-size:15px">या धड्यातील प्रश्नमंजुषा (MCQ Questions)</h4>
          <button class="pill" id="cmsAddQuestionBtn" style="background:var(--lime);font-size:12px">+ नवीन प्रश्न जोडा</button>
        </div>
        <div id="cmsQuestionsContainer">
          <!-- Populated by JS -->
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:18px;justify-content:flex-end">
        <button class="secondary" id="cmsResetBtn">↺ मूळ प्रश्न पूर्ववत करा</button>
        <button class="primary" id="cmsSaveBtn">💾 बदल सेव्ह करा आणि लाइव्ह करा</button>
      </div>
    </div>

    <!-- Tab 4: Complete Branding & App Customizer -->
    <div id="tabBranding" class="admin-tab-content">
      <div style="border:1px solid var(--line);border-radius:16px;padding:18px;background:#fff;margin-bottom:16px">
        <h4 style="margin:0 0 14px;font-size:15px">मुख्य ॲप ब्रँडिंग व शिक्षक माहिती</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-row"><label>ॲपचे मुख्य नाव</label><input type="text" id="brandInputAppName" /></div>
          <div class="form-row"><label>उपशीर्षक (Subtitle)</label><input type="text" id="brandInputSubTitle" /></div>
          <div class="form-row"><label>शिक्षकाचे / ब्रँड नाव</label><input type="text" id="brandInputAuthorName" /></div>
          <div class="form-row"><label>बायलाइन (Byline)</label><input type="text" id="brandInputByline" /></div>
          <div class="form-row"><label>शिक्षकांच्या फोटोची लिंक (Photo URL)</label><input type="text" id="brandInputAuthorPhoto" /></div>
          <div class="form-row"><label>लोगो इमोजी (Logo Icon)</label><input type="text" id="brandInputLogo" /></div>
        </div>
      </div>

      <div style="border:1px solid var(--line);border-radius:16px;padding:18px;background:#fff;margin-bottom:16px">
        <h4 style="margin:0 0 14px;font-size:15px">शुल्क, वैधता व प्रवेश नियम (Pricing & Access)</h4>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          <div class="form-row"><label>प्रवेश फी (₹ - GST सह)</label><input type="number" id="brandInputFee" /></div>
          <div class="form-row"><label>वैधता (दिवस)</label><input type="number" id="brandInputValidity" /></div>
          <div class="form-row"><label>विनामूल्य डेमो धडे (संख्या)</label><input type="number" id="brandInputFreeLessons" /></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div class="form-row"><label>Razorpay Key ID (उदा. rzp_live_...)</label><input type="text" id="brandInputRzpKey" placeholder="रिकामे ठेवल्यास थेट UPI / Demo मोड चालू राहील" /></div>
          <div class="form-row"><label>ॲडमिन पिन (Admin PIN)</label><input type="password" id="brandInputAdminPin" maxlength="8" /></div>
        </div>
      </div>

      <div style="border:1px solid var(--line);border-radius:16px;padding:18px;background:#fff;margin-bottom:16px">
        <h4 style="margin:0 0 14px;font-size:15px">रंगसंगती (Theme Colors)</h4>
        <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:8px">
            <label style="font-size:13px;font-weight:700">मुख्य हिरवा रंग:</label>
            <input type="color" id="brandInputColorPrimary" style="width:40px;height:36px;border:none;cursor:pointer;border-radius:8px" />
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <label style="font-size:13px;font-weight:700">हायलाइट लाईम रंग:</label>
            <input type="color" id="brandInputColorAccent" style="width:40px;height:36px;border:none;cursor:pointer;border-radius:8px" />
          </div>
        </div>
      </div>

      <div style="display:flex;gap:12px;justify-content:flex-end">
        <button class="secondary" id="brandResetBtn">↺ मूळ ब्रँडिंग पूर्ववत करा</button>
        <button class="primary" id="brandSaveBtn">💾 ब्रँडिंग सेव्ह करा</button>
      </div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<!-- Application Logic -->
<script>
// Master Data: 21 Complete Units
const DEFAULT_UNITS = ${JSON.stringify(units21Complete, null, 2)};

// Master Data: Default Branding
const DEFAULT_BRANDING = {
  appName: 'व्याकरणवीर',
  subTitle: 'मराठी व्याकरणाची शब्दयात्रा',
  authorName: 'संतोष राऊत',
  authorRole: 'Santosh Raut',
  authorByline: 'संतोष राऊत यांचे सादरीकरण',
  authorPhoto: 'assets/santosh-raut.jpg',
  authorDesc: 'महाराष्ट्रातील विद्यार्थ्यांसाठी मराठी व्याकरण शिकण्याचा आनंददायी, गोष्टींवर आधारित उपक्रम.',
  authorSignature: '📚 व्याकरणवीर • मराठीची शब्दयात्रा',
  logoIcon: '📚',
  heroEyebrow: 'इयत्ता ८वी • ९वी • १०वी | महाराष्ट्राची शब्दयात्रा',
  heroTitle: 'मराठीचा <span id="heroSpan">खेळ</span> खेळा.<br>व्याकरणाचे हिरो बना!',
  heroDesc: 'किल्ले, एसटीचा प्रवास, गणपती मंडळ, क्रिकेट आणि शाळेच्या गमती-जमतीतून मराठी व्याकरण शिका. चुकलात तरी हरकत नाही—प्रत्येक उत्तरामागे एक छोटी शिकवण आहे!',
  primaryColor: '#1e6454',
  accentColor: '#d9ef8a',
  paperColor: '#fffaf0',
  fee: 21,
  validityDays: 365,
  freeLessonsCount: 3,
  razorpayKey: '',
  adminPin: '2121'
};

// Application State
let branding = Object.assign({}, DEFAULT_BRANDING, JSON.parse(localStorage.getItem('vv_branding') || '{}'));
let units = JSON.parse(localStorage.getItem('vv_custom_units') || 'null') || JSON.parse(JSON.stringify(DEFAULT_UNITS));
const progress = JSON.parse(localStorage.getItem('vv_progress') || '{}');
let userPlan = JSON.parse(localStorage.getItem('vv_plan') || 'null');
let audioEnabled = localStorage.getItem('vv_audio') !== 'false';

const state = {
  name: localStorage.getItem('vv_name') || '',
  grade: '8',
  unit: null,
  stage: 'lesson',
  questions: [],
  index: 0,
  score: 0,
  answered: false,
  hintUsed: false
};

// Helper Functions
function el(id) { return document.getElementById(id); }
function toDevanagari(n) { return String(n).replace(/[0-9]/g, d => '०१२३४५६७८९'[d]); }
function toast(msg) {
  const t = el('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}
function showScreen(which) {
  el('homeScreen').classList.toggle('active', which === 'home');
  el('gameScreen').classList.toggle('active', which === 'game');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Subscription & Paywall Logic
function hasActiveAccess() {
  if (!userPlan || !userPlan.isPaid) return false;
  if (userPlan.expiresAt && Date.now() > userPlan.expiresAt) return false;
  return true;
}

function updateSubscriptionUI() {
  const isPaid = hasActiveAccess();
  const subBadge = el('subBadge');
  const unlockTopBtn = el('unlockTopBtn');
  if (isPaid) {
    subBadge.style.display = 'inline-flex';
    const expDate = new Date(userPlan.expiresAt).toLocaleDateString('mr-IN');
    el('subBadgeText').textContent = '१ वर्ष सदस्यत्व सक्रिय (वैध: ' + expDate + ')';
    unlockTopBtn.style.display = 'none';
  } else {
    subBadge.style.display = 'none';
    unlockTopBtn.style.display = 'inline-block';
  }
}

// Star Scoring Calculation: Strict Best Score Rule
function calcStarsForScore(score, total) {
  if (total <= 0) return 0;
  const pct = Math.round((score / total) * 100);
  if (pct === 100) return 15;
  if (pct >= 80) return 10;
  if (pct >= 60) return 6;
  if (pct >= 40) return 3;
  return score > 0 ? 1 : 0;
}

function getTotalXP() {
  return Object.values(progress).reduce((sum, p) => sum + (p.bestStars || 0), 0);
}

function saveProgress() {
  localStorage.setItem('vv_progress', JSON.stringify(progress));
}

// Audio Synthesizer (Web Audio API)
let audioCtx = null;
function playSound(type) {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'correct') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(174.61, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.18, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
        o.start(now + i * 0.1);
        o.stop(now + i * 0.1 + 0.3);
      });
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch(e) {}
}

// Confetti System
function fireConfetti() {
  const canvas = el('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = [];
  const colors = ['#d9ef8a', '#ff9e59', '#7bc5d3', '#ef765f', '#1e6454', '#ffd166'];
  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 10
    });
  }
  let frame = 0;
  function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    frame++;
    if (frame < 120) requestAnimationFrame(anim);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  anim();
}

// Map Rendering
function renderMap() {
  const map = el('unitMap');
  map.innerHTML = '';
  const isPaid = hasActiveAccess();

  units.forEach((u, i) => {
    const p = progress[u.id] || { bestScore: 0, bestStars: 0, attempts: 0 };
    const isLocked = (i >= branding.freeLessonsCount) && !isPaid;
    const isFreeDemo = (i < branding.freeLessonsCount);

    const card = document.createElement('div');
    card.className = 'unit' + (isLocked ? ' unit-locked' : '');
    card.style.setProperty('--unit-bg', u.bg || '#e7f2dc');

    let badgeHtml = '';
    if (isFreeDemo) {
      badgeHtml = '<span class="free-demo-tag">🎁 मोफत डेमो</span>';
    } else if (isLocked) {
      badgeHtml = '<span class="lock-overlay-tag">🔒 ₹' + toDevanagari(branding.fee) + ' मध्ये अनलॉक</span>';
    } else {
      badgeHtml = '<span class="free-demo-tag" style="background:#d9ef8a;color:#183f3a">✓ अनलॉक</span>';
    }

    card.innerHTML = \`
      \${badgeHtml}
      <div class="unit-top">
        <div class="unit-icon">\${u.icon}</div>
        <div class="unit-tag">\${u.grade}</div>
      </div>
      <div class="unit-place">📍 \${u.place}</div>
      <div class="unit-title">\${toDevanagari(i+1)}. \${u.title}</div>
      <div class="unit-desc">\${u.desc}</div>
      <div class="unit-foot">
        <div class="unit-xp">⭐ \${toDevanagari(p.bestStars || 0)} कमाल स्टार्स</div>
        <button class="unit-play-btn" \${isLocked ? 'style=\"background:#f3e3ca;color:#5a3f12\"' : ''}>
          \${isLocked ? '🔒 अनलॉक करा' : (p.bestScore > 0 ? 'सराव करा ↻' : 'सुरू करा →')}
        </button>
      </div>
    \`;

    card.addEventListener('click', () => {
      playSound('click');
      if (isLocked) {
        openPaywallModal(i);
      } else {
        openUnit(i);
      }
    });

    map.appendChild(card);
  });

  refreshStats();
  updateSubscriptionUI();
}

function refreshStats() {
  el('playerName').textContent = state.name ? state.name : 'नवा खेळाडू';
  el('xpStat').textContent = toDevanagari(getTotalXP()) + ' ⭐';

  const doneCount = Object.values(progress).filter(p => (p.bestScore || 0) > 0).length;
  el('doneStat').textContent = toDevanagari(doneCount) + ' / ' + toDevanagari(units.length);

  const bestScores = Object.values(progress).map(p => p.bestScore || 0);
  const maxScore = bestScores.length ? Math.max(...bestScores) : 0;
  el('bestStat').textContent = maxScore > 0 ? toDevanagari(maxScore) + '%' : '—';

  let badge = '🌱 व्याकरण शिकू';
  if (doneCount >= 21) badge = '👑 ज्ञानगड विजेता';
  else if (doneCount >= 15) badge = '🏰 सरदार';
  else if (doneCount >= 10) badge = '⚔️ किल्लेदार';
  else if (doneCount >= 5) badge = '🏹 सैनिक';
  el('badgeStat').textContent = badge;
}

// Unit & Quiz Gameplay
function openUnit(index) {
  state.unit = index;
  const u = units[index];
  state.questions = u.questions || [];
  state.index = 0;
  state.score = 0;
  state.answered = false;
  state.hintUsed = false;

  el('gameTitle').textContent = u.title;
  el('gameMeta').textContent = '📍 ' + u.place + ' • ' + u.grade;
  el('gameCounter').textContent = 'धडा वाचन';
  el('gameProgressFill').style.width = '0%';

  el('lessonKicker').textContent = 'मोहीम क्र. ' + toDevanagari(index + 1) + ' • शिकण्याची वेळ';
  el('lessonTitle').textContent = u.lesson.title;
  el('lessonBody').textContent = u.lesson.body;
  el('lessonExample').textContent = u.lesson.example;

  const pointsList = el('lessonPoints');
  pointsList.innerHTML = '';
  (u.lesson.points || []).forEach(pt => {
    const li = document.createElement('li');
    li.textContent = pt;
    pointsList.appendChild(li);
  });

  el('lessonView').style.display = 'block';
  el('quizView').style.display = 'none';
  el('resultView').style.display = 'none';

  showScreen('game');
}

function beginQuiz() {
  playSound('click');
  if (!state.questions.length) {
    toast('या मोहिमेचे प्रश्न लवकरच जोडले जातील!');
    return;
  }
  el('lessonView').style.display = 'none';
  el('quizView').style.display = 'block';
  renderQuestion();
}

function renderQuestion() {
  state.answered = false;
  state.hintUsed = false;
  const q = state.questions[state.index];
  const u = units[state.unit];

  el('quizUnit').textContent = u.title + ' • प्रश्न ' + toDevanagari(state.index + 1) + ' / ' + toDevanagari(state.questions.length);
  el('quizScore').textContent = '⭐ ' + toDevanagari(state.score) + ' गुण';
  el('gameCounter').textContent = toDevanagari(state.index + 1) + ' / ' + toDevanagari(state.questions.length);
  el('gameProgressFill').style.width = ((state.index) / state.questions.length * 100) + '%';

  el('questionScene').textContent = q.scene || '📍 प्रसंग';
  el('questionText').textContent = q.q;
  el('questionContext').textContent = q.context || '';

  const optsBox = el('optionsBox');
  optsBox.innerHTML = '';
  q.o.forEach((optText, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = optText;
    btn.addEventListener('click', () => selectOption(i));
    optsBox.appendChild(btn);
  });

  el('hintBox').style.display = 'none';
  el('feedbackBox').style.display = 'none';
  el('nextBtn').disabled = true;
}

function selectOption(choiceIdx) {
  if (state.answered) return;
  state.answered = true;
  const q = state.questions[state.index];
  const isCorrect = choiceIdx === q.a;
  const btns = el('optionsBox').querySelectorAll('.option-btn');

  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.a) btn.classList.add('correct');
    else if (i === choiceIdx) btn.classList.add('wrong');
  });

  const fb = el('feedbackBox');
  fb.style.display = 'block';

  if (isCorrect) {
    state.score++;
    playSound('correct');
    fb.className = 'feedback correct';
    fb.innerHTML = '<strong>बरोबर उत्तर! 🎯</strong><br>' + q.why;
  } else {
    playSound('wrong');
    fb.className = 'feedback wrong';
    fb.innerHTML = '<strong>चुकले, पण हरकत नाही! शिकून घेऊया:</strong><br>' + q.why;
  }

  el('quizScore').textContent = '⭐ ' + toDevanagari(state.score) + ' गुण';
  el('nextBtn').disabled = false;
}

function showHint() {
  if (state.hintUsed) return;
  state.hintUsed = true;
  playSound('click');
  const q = state.questions[state.index];
  const hb = el('hintBox');
  hb.textContent = '💡 हिंट: ' + (q.hint || 'वाक्यातील शब्दांचा नीट विचार करा.');
  hb.style.display = 'block';
}

function nextQuestion() {
  playSound('click');
  if (!state.answered) return;
  if (state.index < state.questions.length - 1) {
    state.index++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const totalQ = state.questions.length;
  const percent = Math.round(state.score / totalQ * 100);
  const u = units[state.unit];
  const old = progress[u.id] || { bestScore: 0, bestStars: 0, attempts: 0 };

  // Calculate stars based on this run's score
  const earnedStarsThisRun = calcStarsForScore(state.score, totalQ);
  const oldBestStars = old.bestStars || 0;
  let newStarsAwarded = 0;

  if (earnedStarsThisRun > oldBestStars) {
    newStarsAwarded = earnedStarsThisRun - oldBestStars;
    old.bestStars = earnedStarsThisRun;
  }

  old.bestScore = Math.max(old.bestScore || 0, percent);
  old.attempts = (old.attempts || 0) + 1;
  progress[u.id] = old;
  saveProgress();

  // Switch to result view
  el('quizView').style.display = 'none';
  el('resultView').style.display = 'block';
  el('gameProgressFill').style.width = '100%';
  el('gameCounter').textContent = 'पूर्ण!';

  el('resultScore').textContent = toDevanagari(state.score) + ' / ' + toDevanagari(totalQ);
  el('resultPercent').textContent = toDevanagari(percent) + '%';

  if (newStarsAwarded > 0) {
    el('resultXP').textContent = '+' + toDevanagari(newStarsAwarded) + ' ⭐ (कमाल गुणांवरून)';
  } else {
    el('resultXP').textContent = '+० ⭐ (आधीच ' + toDevanagari(oldBestStars) + ' ⭐ मिळाले आहेत)';
  }

  let title, medal, text;
  if (percent === 100) {
    title = 'अप्रतिम! तुम्ही खरे व्याकरणवीर!';
    medal = '🏆';
    text = 'एकही चूक नाही! तुमचा अभ्यास आणि निरीक्षण दोन्ही कमाल आहेत. ज्ञानगडाकडे आणखी एक मोठे पाऊल!';
    playSound('win');
    fireConfetti();
  } else if (percent >= 80) {
    title = 'वा! जबरदस्त कामगिरी!';
    medal = '🥇';
    text = 'तुमची संकल्पना छान समजली आहे. थोडा सराव केला की १००% गुण नक्की!';
    playSound('win');
  } else if (percent >= 60) {
    title = 'छान प्रगती!';
    medal = '🥈';
    text = 'बहुतेक प्रश्न बरोबर आले. चुकीची उत्तरे पुन्हा वाचा आणि आणखी एक फेरी खेळा.';
  } else {
    title = 'हार नाही, ही तर प्रॅक्टिस!';
    medal = '🌱';
    text = 'चुकीची उत्तरे ही शिकण्याची संधी असतात. धड्यातील मुद्दे पुन्हा वाचा आणि पुन्हा प्रयत्न करा.';
  }

  el('resultTitle').textContent = title;
  el('resultMedal').textContent = medal;
  el('resultText').textContent = (state.name ? state.name + ', ' : '') + text;

  renderMap();
}

// Paywall & Payment Flow
function openPaywallModal(unitIdx) {
  el('payStudentName').value = state.name || '';
  el('paywallModal').classList.add('show');
}

function handlePayNow() {
  const name = el('payStudentName').value.trim() || state.name || 'विद्यार्थी';
  const phone = el('payStudentPhone').value.trim();

  if (name && !state.name) {
    state.name = name;
    localStorage.setItem('vv_name', name);
    refreshStats();
  }

  // Check if Razorpay Key is provided
  if (branding.razorpayKey && window.Razorpay) {
    const options = {
      key: branding.razorpayKey,
      amount: branding.fee * 100, // amount in paise (₹21 = 2100)
      currency: 'INR',
      name: branding.appName,
      description: '१ वर्ष संपूर्ण ॲक्सेस — ' + branding.subTitle,
      image: branding.authorPhoto || 'assets/santosh-raut.jpg',
      prefill: {
        name: name,
        contact: phone
      },
      theme: {
        color: branding.primaryColor || '#1e6454'
      },
      handler: function (response) {
        activateSubscription(name, phone, response.razorpay_payment_id);
      }
    };
    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      return;
    } catch(e) {
      console.warn('Razorpay checkout failed, opening UPI fallback', e);
    }
  }

  // Fallback: Open UPI Modal
  el('paywallModal').classList.remove('show');
  openUpiModal(name, phone);
}

function openUpiModal(name, phone) {
  const amount = branding.fee;
  const upiId = 'santoshraut@upi';
  const upiUrl = \`upi://pay?pa=\${upiId}&pn=Santosh+Raut&am=\${amount}&cu=INR&tn=Marathi+Vyakaranveer+1Yr\`;

  el('gpayIntentLink').href = upiUrl;
  el('phonepeIntentLink').href = upiUrl;
  el('paytmIntentLink').href = upiUrl;

  el('upiModal').classList.add('show');
}

function activateSubscription(name, phone, orderId) {
  userPlan = {
    isPaid: true,
    expiresAt: Date.now() + (branding.validityDays * 24 * 60 * 60 * 1000),
    paidAt: Date.now(),
    plan: '1_year',
    amount: branding.fee,
    orderId: orderId || ('ORD_' + Date.now()),
    studentName: name || state.name || 'विद्यार्थी',
    studentPhone: phone || ''
  };
  localStorage.setItem('vv_plan', JSON.stringify(userPlan));

  // Save to studentsList for Admin Console
  recordStudent(userPlan.studentName, userPlan.studentPhone, true, userPlan.expiresAt);

  updateSubscriptionUI();
  renderMap();
  el('paywallModal').classList.remove('show');
  el('upiModal').classList.remove('show');
  fireConfetti();
  playSound('win');
  toast('🎉 अभिनंदन! आपले १ वर्षाचे सदस्यत्व सक्रिय झाले आहे!');
}

function recordStudent(name, phone, isPaid, expiresAt) {
  let list = JSON.parse(localStorage.getItem('vv_students') || '[]');
  const existingIdx = list.findIndex(s => (phone && s.phone === phone) || (s.name === name));
  const studentData = {
    name: name,
    phone: phone || '—',
    isPaid: isPaid,
    expiresAt: expiresAt,
    joinedAt: existingIdx >= 0 ? list[existingIdx].joinedAt : Date.now(),
    bestStars: getTotalXP(),
    completedCount: Object.values(progress).filter(p => (p.bestScore || 0) > 0).length
  };
  if (existingIdx >= 0) list[existingIdx] = studentData;
  else list.unshift(studentData);
  localStorage.setItem('vv_students', JSON.stringify(list));
}

// Admin Console Logic
function openAdminPinPrompt() {
  el('adminPinInput').value = '';
  el('adminPinModal').classList.add('show');
  el('adminPinInput').focus();
}

function verifyAdminPin() {
  const entered = el('adminPinInput').value.trim();
  const correct = branding.adminPin || '2121';
  if (entered === correct) {
    el('adminPinModal').classList.remove('show');
    openAdminConsole();
  } else {
    toast('❌ चुकीचा पिन! कृपया पुन्हा प्रयत्न करा.');
    el('adminPinInput').value = '';
  }
}

function openAdminConsole() {
  populateAdminDashboard();
  populateAdminStudents();
  populateAdminCMS();
  populateAdminBranding();
  el('adminConsoleModal').classList.add('show');
}

function populateAdminDashboard() {
  const list = JSON.parse(localStorage.getItem('vv_students') || '[]');
  const paidCount = list.filter(s => s.isPaid && s.expiresAt > Date.now()).length;
  const totalRevenue = paidCount * (branding.fee || 21);
  const totalQuizzes = Object.values(progress).reduce((sum, p) => sum + (p.attempts || 0), 0);

  el('adminRevenueStat').textContent = '₹' + toDevanagari(totalRevenue);
  el('adminPaidStudentsStat').textContent = toDevanagari(paidCount);
  el('adminTotalStudentsStat').textContent = toDevanagari(list.length);
  el('adminQuizzesStat').textContent = toDevanagari(totalQuizzes);

  const tbody = el('adminRecentPaymentsTable');
  tbody.innerHTML = '';
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted)">अजून कोणतेही व्यवहार नाहीत.</td></tr>';
    return;
  }
  list.slice(0, 8).forEach(s => {
    const tr = document.createElement('tr');
    const dateStr = new Date(s.joinedAt).toLocaleDateString('mr-IN');
    const expStr = s.expiresAt ? new Date(s.expiresAt).toLocaleDateString('mr-IN') : '—';
    const statusPill = s.isPaid ? '<span class="status-pill active">सक्रिय</span>' : '<span class="status-pill free">विनामूल्य</span>';
    tr.innerHTML = \`
      <td><strong>\${s.name}</strong></td>
      <td>\${s.phone}</td>
      <td>\${dateStr}</td>
      <td>₹\${toDevanagari(s.isPaid ? branding.fee : 0)}</td>
      <td>\${statusPill}</td>
      <td>\${expStr}</td>
    \`;
    tbody.appendChild(tr);
  });
}

function populateAdminStudents(filterText = '') {
  const tbody = el('adminStudentsTableBody');
  tbody.innerHTML = '';
  let list = JSON.parse(localStorage.getItem('vv_students') || '[]');
  if (filterText) {
    const q = filterText.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.phone.includes(q));
  }
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted)">विद्यार्थी आढळले नाहीत.</td></tr>';
    return;
  }
  list.forEach((s, idx) => {
    const tr = document.createElement('tr');
    const isActive = s.isPaid && s.expiresAt > Date.now();
    const statusText = isActive ? '<span class=\"status-pill active\">१ वर्ष सक्रिय</span>' : (s.isPaid ? '<span class=\"status-pill expired\">मुदत संपली</span>' : '<span class=\"status-pill free\">विनामूल्य</span>');
    const expStr = s.expiresAt ? new Date(s.expiresAt).toLocaleDateString('mr-IN') : '—';

    tr.innerHTML = \`
      <td><strong>\${s.name}</strong></td>
      <td>\${s.phone}</td>
      <td>\${statusText}</td>
      <td>\${expStr}</td>
      <td>⭐ \${toDevanagari(s.bestStars || 0)}</td>
      <td>
        <button class=\"btn-unlock-sm\" onclick=\"adminManualUnlock(\${idx})\">⚡ १ वर्ष अनलॉक</button>
        <button class=\"btn-del-sm\" onclick=\"adminDeleteStudent(\${idx})\">🗑️</button>
      </td>
    \`;
    tbody.appendChild(tr);
  });
}

window.adminManualUnlock = function(idx) {
  let list = JSON.parse(localStorage.getItem('vv_students') || '[]');
  if (list[idx]) {
    list[idx].isPaid = true;
    list[idx].expiresAt = Date.now() + (branding.validityDays * 24 * 60 * 60 * 1000);
    localStorage.setItem('vv_students', JSON.stringify(list));
    // If it's the current user, update runtime plan
    if (list[idx].name === state.name) {
      userPlan = { isPaid: true, expiresAt: list[idx].expiresAt, paidAt: Date.now(), studentName: list[idx].name, studentPhone: list[idx].phone };
      localStorage.setItem('vv_plan', JSON.stringify(userPlan));
      updateSubscriptionUI();
      renderMap();
    }
    toast('✅ ' + list[idx].name + ' साठी १ वर्ष सदस्यत्व अनलॉक केले!');
    populateAdminStudents();
    populateAdminDashboard();
  }
};

window.adminDeleteStudent = function(idx) {
  if (!confirm('हा विद्यार्थी डेटा हटवायचा आहे का?')) return;
  let list = JSON.parse(localStorage.getItem('vv_students') || '[]');
  list.splice(idx, 1);
  localStorage.setItem('vv_students', JSON.stringify(list));
  populateAdminStudents();
  populateAdminDashboard();
  toast('विद्यार्थी डेटा काढला.');
};

// Admin CMS (Lesson & Questions Editor)
let currentCmsLessonIdx = 0;

function populateAdminCMS() {
  const select = el('cmsLessonSelect');
  select.innerHTML = '';
  units.forEach((u, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = toDevanagari(i + 1) + '. ' + u.title + ' (' + (u.questions ? u.questions.length : 0) + ' प्रश्न)';
    select.appendChild(opt);
  });
  select.value = currentCmsLessonIdx;
  loadCmsLesson(currentCmsLessonIdx);
}

function loadCmsLesson(idx) {
  currentCmsLessonIdx = idx;
  const u = units[idx];
  el('cmsLessonTitle').value = u.title || '';
  el('cmsLessonPlace').value = u.place || '';
  el('cmsLessonBody').value = u.lesson.body || '';
  el('cmsLessonExample').value = u.lesson.example || '';
  el('cmsLessonPoints').value = (u.lesson.points || []).join('\\n');

  renderCmsQuestions();
}

function renderCmsQuestions() {
  const container = el('cmsQuestionsContainer');
  container.innerHTML = '';
  const qList = units[currentCmsLessonIdx].questions || [];

  qList.forEach((q, qIdx) => {
    const acc = document.createElement('div');
    acc.className = 'cms-accordion';
    acc.innerHTML = \`
      <div class="cms-acc-head" onclick="toggleCmsAcc(this)">
        <span>प्रश्न \${toDevanagari(qIdx + 1)}: \${q.q.slice(0, 38)}...</span>
        <span>▼</span>
      </div>
      <div class="cms-acc-body">
        <div class="form-row">
          <label>प्रश्नाचा मजकूर (Question Text)</label>
          <textarea class="cms-q-text" rows="2">\${q.q}</textarea>
        </div>
        <div style="margin:10px 0 6px"><small style="font-weight:800;color:var(--muted)">पर्याय व बरोबर उत्तराची खूण (रेडिओ बटण निवडा):</small></div>
        <div class="cms-opts-box">
          \${q.o.map((opt, oIdx) => \`
            <div class="opt-radio-row">
              <input type="radio" name="correct_opt_\${qIdx}" value="\${oIdx}" \${q.a === oIdx ? 'checked' : ''} />
              <input type="text" class="cms-opt-input" value="\${opt}" style="flex:1" placeholder="पर्याय \${oIdx+1}" />
            </div>
          \`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">
          <div class="form-row"><label>प्रसंग (Scene)</label><input type="text" class="cms-scene" value="\${q.scene || ''}" /></div>
          <div class="form-row"><label>संदर्भ (Context)</label><input type="text" class="cms-context" value="\${q.context || ''}" /></div>
        </div>
        <div class="form-row" style="margin-top:10px">
          <label>हिंट (Hint)</label>
          <input type="text" class="cms-hint" value="\${q.hint || ''}" />
        </div>
        <div class="form-row" style="margin-top:10px">
          <label>स्पष्टीकरण (हे उत्तर का बरोबर आहे?)</label>
          <textarea class="cms-why" rows="2">\${q.why || ''}</textarea>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:10px">
          <button class="btn-del-sm" onclick="cmsDeleteQuestion(\${qIdx})">🗑️ हा प्रश्न काढा</button>
        </div>
      </div>
    \`;
    container.appendChild(acc);
  });
}

window.toggleCmsAcc = function(headEl) {
  const body = headEl.nextElementSibling;
  body.classList.toggle('open');
};

window.cmsDeleteQuestion = function(qIdx) {
  if (!confirm('हा प्रश्न काढून टाकायचा आहे का?')) return;
  units[currentCmsLessonIdx].questions.splice(qIdx, 1);
  renderCmsQuestions();
  toast('प्रश्न काढला.');
};

function cmsAddQuestion() {
  const newQ = {
    q: 'नवीन प्रश्न येथे लिहा...',
    o: ['पर्याय १', 'पर्याय २', 'पर्याय ३', 'पर्याय ४'],
    a: 0,
    why: 'येथे स्पष्टीकरण लिहा.',
    scene: '📍 नवीन प्रसंग',
    context: 'संदर्भ येथे लिहा.',
    hint: 'हिंट येथे लिहा.'
  };
  if (!units[currentCmsLessonIdx].questions) units[currentCmsLessonIdx].questions = [];
  units[currentCmsLessonIdx].questions.push(newQ);
  renderCmsQuestions();
  // Open the newly added accordion
  const bodies = el('cmsQuestionsContainer').querySelectorAll('.cms-acc-body');
  if (bodies.length) bodies[bodies.length - 1].classList.add('open');
  toast('नवीन प्रश्न जोडला!');
}

function saveCmsChanges() {
  const u = units[currentCmsLessonIdx];
  u.title = el('cmsLessonTitle').value.trim();
  u.place = el('cmsLessonPlace').value.trim();
  u.lesson.body = el('cmsLessonBody').value.trim();
  u.lesson.example = el('cmsLessonExample').value.trim();
  u.lesson.points = el('cmsLessonPoints').value.split('\\n').map(s => s.trim()).filter(Boolean);

  const accBodies = el('cmsQuestionsContainer').querySelectorAll('.cms-acc-body');
  accBodies.forEach((body, qIdx) => {
    if (u.questions[qIdx]) {
      u.questions[qIdx].q = body.querySelector('.cms-q-text').value.trim();
      const optInputs = body.querySelectorAll('.cms-opt-input');
      u.questions[qIdx].o = Array.from(optInputs).map(inp => inp.value.trim());
      const checkedRadio = body.querySelector('input[type="radio"]:checked');
      u.questions[qIdx].a = checkedRadio ? parseInt(checkedRadio.value, 10) : 0;
      u.questions[qIdx].scene = body.querySelector('.cms-scene').value.trim();
      u.questions[qIdx].context = body.querySelector('.cms-context').value.trim();
      u.questions[qIdx].hint = body.querySelector('.cms-hint').value.trim();
      u.questions[qIdx].why = body.querySelector('.cms-why').value.trim();
    }
  });

  localStorage.setItem('vv_custom_units', JSON.stringify(units));
  renderMap();
  populateAdminCMS();
  toast('✅ धडा व प्रश्न यशस्वीरीत्या सेव्ह व लाइव्ह झाले!');
}

function resetCmsToDefault() {
  if (!confirm('या धड्याचे मूळ प्रश्न व मजकूर पूर्ववत करायचे का?')) return;
  units[currentCmsLessonIdx] = JSON.parse(JSON.stringify(DEFAULT_UNITS[currentCmsLessonIdx]));
  localStorage.setItem('vv_custom_units', JSON.stringify(units));
  loadCmsLesson(currentCmsLessonIdx);
  renderMap();
  toast('मूळ प्रश्न पूर्ववत केले.');
}

// Admin Branding Customizer
function populateAdminBranding() {
  el('brandInputAppName').value = branding.appName || '';
  el('brandInputSubTitle').value = branding.subTitle || '';
  el('brandInputAuthorName').value = branding.authorName || '';
  el('brandInputByline').value = branding.authorByline || '';
  el('brandInputAuthorPhoto').value = branding.authorPhoto || '';
  el('brandInputLogo').value = branding.logoIcon || '📚';
  el('brandInputFee').value = branding.fee || 21;
  el('brandInputValidity').value = branding.validityDays || 365;
  el('brandInputFreeLessons').value = branding.freeLessonsCount || 3;
  el('brandInputRzpKey').value = branding.razorpayKey || '';
  el('brandInputAdminPin').value = branding.adminPin || '2121';
  el('brandInputColorPrimary').value = branding.primaryColor || '#1e6454';
  el('brandInputColorAccent').value = branding.accentColor || '#d9ef8a';
}

function saveBrandingChanges() {
  branding.appName = el('brandInputAppName').value.trim() || DEFAULT_BRANDING.appName;
  branding.subTitle = el('brandInputSubTitle').value.trim() || DEFAULT_BRANDING.subTitle;
  branding.authorName = el('brandInputAuthorName').value.trim() || DEFAULT_BRANDING.authorName;
  branding.authorByline = el('brandInputByline').value.trim() || DEFAULT_BRANDING.authorByline;
  branding.authorPhoto = el('brandInputAuthorPhoto').value.trim() || DEFAULT_BRANDING.authorPhoto;
  branding.logoIcon = el('brandInputLogo').value.trim() || DEFAULT_BRANDING.logoIcon;
  branding.fee = parseInt(el('brandInputFee').value, 10) || 21;
  branding.validityDays = parseInt(el('brandInputValidity').value, 10) || 365;
  branding.freeLessonsCount = parseInt(el('brandInputFreeLessons').value, 10) || 3;
  branding.razorpayKey = el('brandInputRzpKey').value.trim();
  branding.adminPin = el('brandInputAdminPin').value.trim() || '2121';
  branding.primaryColor = el('brandInputColorPrimary').value;
  branding.accentColor = el('brandInputColorAccent').value;

  localStorage.setItem('vv_branding', JSON.stringify(branding));
  applyBrandingToDOM();
  renderMap();
  toast('✅ नवीन ब्रँडिंग व सेटिंग्ज सेव्ह झाल्या!');
}

function resetBrandingToDefault() {
  if (!confirm('मूळ ब्रँडिंग सेटिंग्ज पूर्ववत करायच्या का?')) return;
  branding = Object.assign({}, DEFAULT_BRANDING);
  localStorage.removeItem('vv_branding');
  populateAdminBranding();
  applyBrandingToDOM();
  renderMap();
  toast('मूळ ब्रँडिंग पूर्ववत केले.');
}

function applyBrandingToDOM() {
  el('brandLogo').textContent = branding.logoIcon || '📚';
  el('brandAppName').textContent = branding.appName || 'व्याकरणवीर';
  el('brandByline').textContent = branding.authorByline || 'संतोष राऊत यांचे सादरीकरण';
  el('brandPresenterName').innerHTML = branding.authorName + ' <span style=\"font-size:.62em;color:#d9ef8a;font-weight:600\">| ' + (branding.authorRole || 'Santosh Raut') + '</span>';
  el('santoshPhotoImg').src = branding.authorPhoto || 'assets/santosh-raut.jpg';
  el('unlockTopBtn').textContent = '🔒 सर्व २१ धडे अनलॉक करा (₹' + toDevanagari(branding.fee) + ')';

  // Apply colors to CSS Variables
  if (branding.primaryColor) document.documentElement.style.setProperty('--green', branding.primaryColor);
  if (branding.accentColor) document.documentElement.style.setProperty('--lime', branding.accentColor);
}

// Event Listeners Initialization
function initEventListeners() {
  // Navigation & Screens
  el('startBtn').addEventListener('click', () => {
    playSound('click');
    if (!state.name) {
      el('profileModal').classList.add('show');
      el('nameInput').focus();
    } else {
      document.querySelector('#unitMap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  el('backBtn').addEventListener('click', () => {
    playSound('click');
    showScreen('home');
    renderMap();
  });

  el('mapBtn').addEventListener('click', () => {
    playSound('click');
    showScreen('home');
    renderMap();
  });

  el('beginQuizBtn').addEventListener('click', beginQuiz);
  el('hintBtn').addEventListener('click', showHint);
  el('nextBtn').addEventListener('click', nextQuestion);
  el('retryBtn').addEventListener('click', () => {
    playSound('click');
    openUnit(state.unit);
  });

  // Profile modal
  el('profileBtn').addEventListener('click', () => {
    playSound('click');
    el('nameInput').value = state.name;
    el('profileModal').classList.add('show');
    el('nameInput').focus();
  });

  el('closeProfileBtn').addEventListener('click', () => {
    el('profileModal').classList.remove('show');
  });

  el('saveNameBtn').addEventListener('click', () => {
    state.name = el('nameInput').value.trim().slice(0, 24);
    localStorage.setItem('vv_name', state.name);
    el('profileModal').classList.remove('show');
    refreshStats();
    toast(state.name ? 'स्वागत आहे, ' + state.name + '!' : 'चला, शब्दयात्रा सुरू करूया!');
  });

  el('nameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') el('saveNameBtn').click();
  });

  // Audio Toggle
  el('audioToggleBtn').addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    localStorage.setItem('vv_audio', audioEnabled);
    el('audioToggleBtn').textContent = audioEnabled ? '🔊' : '🔇';
    toast(audioEnabled ? 'ध्वनी सुरू केला 🔊' : 'ध्वनी बंद केला 🔇');
  });
  el('audioToggleBtn').textContent = audioEnabled ? '🔊' : '🔇';

  // Share Buttons
  el('shareBtn').addEventListener('click', () => {
    playSound('click');
    const msg = branding.appName + ' — ' + branding.authorName + ' यांचे सादरीकरण. इयत्ता ८वी ते १०वीसाठी मराठी व्याकरणाचा मजेशीर गेम! खेळून पाहा: ' + location.href;
    if (navigator.share) {
      navigator.share({ title: branding.appName, text: msg, url: location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(msg).then(() => toast('गेमची लिंक कॉपी झाली!'));
    }
  });

  el('shareResultBtn').addEventListener('click', () => {
    playSound('click');
    const u = units[state.unit];
    const msg = 'मी व्याकरणवीरमध्ये “' + u.title + '” ही मराठी व्याकरण मोहीम खेळली आणि ' + state.score + '/' + state.questions.length + ' गुण मिळवले! विशेष सादरीकरण: ' + branding.authorName + '. तुम्हीही खेळा: ' + location.href;
    if (navigator.share) {
      navigator.share({ title: branding.appName, text: msg, url: location.href }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(msg).then(() => toast('शेअर मजकूर कॉपी झाला!'));
    }
  });

  // Paywall Actions
  el('unlockTopBtn').addEventListener('click', () => {
    playSound('click');
    openPaywallModal(3);
  });

  el('closePaywallBtn').addEventListener('click', () => {
    el('paywallModal').classList.remove('show');
  });

  el('payNowBtn').addEventListener('click', handlePayNow);

  // UPI Modal Actions
  el('closeUpiBtn').addEventListener('click', () => {
    el('upiModal').classList.remove('show');
  });

  el('copyUpiIdBtn').addEventListener('click', () => {
    navigator.clipboard.writeText('santoshraut@upi').then(() => toast('UPI ID कॉपी झाला: santoshraut@upi'));
  });

  el('verifyUtrBtn').addEventListener('click', () => {
    const utr = el('utrInput').value.trim();
    if (!utr || utr.length < 6) {
      toast('कृपया अचूक १२ अंकी UTR किंवा संदर्भ क्रमांक टाका.');
      return;
    }
    const name = el('payStudentName').value.trim() || state.name || 'विद्यार्थी';
    const phone = el('payStudentPhone').value.trim();
    activateSubscription(name, phone, 'UTR_' + utr);
  });

  el('simulateSuccessBtn').addEventListener('click', () => {
    const name = el('payStudentName').value.trim() || state.name || 'विद्यार्थी';
    const phone = el('payStudentPhone').value.trim();
    activateSubscription(name, phone, 'DEMO_' + Date.now());
  });

  // Admin Access PIN
  el('adminTopBtn').addEventListener('click', () => {
    playSound('click');
    openAdminPinPrompt();
  });

  el('footerAdminBtn').addEventListener('click', () => {
    playSound('click');
    openAdminPinPrompt();
  });

  el('closePinModalBtn').addEventListener('click', () => {
    el('adminPinModal').classList.remove('show');
  });

  el('cancelAdminPinBtn').addEventListener('click', () => {
    el('adminPinModal').classList.remove('show');
  });

  el('submitAdminPinBtn').addEventListener('click', verifyAdminPin);
  el('adminPinInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyAdminPin();
  });

  // Admin Console Modal
  el('closeAdminConsoleBtn').addEventListener('click', () => {
    el('adminConsoleModal').classList.remove('show');
  });

  // Admin Tab Navigation
  document.querySelectorAll('.admin-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      tabBtn.classList.add('active');
      const targetId = tabBtn.dataset.tab;
      if (el(targetId)) el(targetId).classList.add('active');
    });
  });

  // Admin Search Students
  el('adminStudentSearchInput').addEventListener('input', (e) => {
    populateAdminStudents(e.target.value.trim());
  });

  // Admin CMS
  el('cmsLessonSelect').addEventListener('change', (e) => {
    loadCmsLesson(parseInt(e.target.value, 10));
  });
  el('cmsAddQuestionBtn').addEventListener('click', cmsAddQuestion);
  el('cmsSaveBtn').addEventListener('click', saveCmsChanges);
  el('cmsResetBtn').addEventListener('click', resetCmsToDefault);

  // Admin Branding
  el('brandSaveBtn').addEventListener('click', saveBrandingChanges);
  el('brandResetBtn').addEventListener('click', resetBrandingToDefault);

  // Grade tabs
  document.querySelectorAll('.grade-tab').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.grade-tab').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.grade = b.dataset.grade;
      toast('इयत्ता ' + b.textContent + ' साठी सराव निवडला');
    });
  });
}

// Initial Launch
applyBrandingToDOM();
initEventListeners();
renderMap();
if (!state.name) {
  setTimeout(() => el('profileModal').classList.add('show'), 700);
}
</script>
</body>
</html>
`;

fs.writeFileSync('./vyakaranveer-app/index.html', fullHtml);
console.log('Successfully wrote updated vyakaranveer-app/index.html!');
console.log('New file length:', fullHtml.length, 'bytes');

