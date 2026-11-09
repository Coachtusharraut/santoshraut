const fs = require('fs');

const units21Complete = JSON.parse(fs.readFileSync('./units_21_complete.json', 'utf8'));

// Units client manifest: Full content for free demo lessons (0, 1, 2),
// but metadata-only for paid lessons (3-20) to keep paid questions and story text
// securely protected on the Cloud Functions backend.
const clientUnits = units21Complete.map((u, i) => {
  if (i < 3) return u;
  return {
    id: u.id,
    icon: u.icon,
    title: u.title,
    place: u.place,
    grade: u.grade,
    bg: u.bg,
    desc: u.desc,
    isLocked: true,
    lesson: null,
    questions: []
  };
});

// Extract base original CSS
const originalHtml = fs.readFileSync('./vyakaranveer-app/index.html.bak', 'utf8');
const originalCssStart = originalHtml.indexOf('<style>') + 7;
const originalCssEnd = originalHtml.indexOf('</style>');
const baseCss = originalHtml.slice(originalCssStart, originalCssEnd);

// Read production additions CSS
const productionCss = fs.readFileSync('./production_css.css', 'utf8');

const combinedCss = baseCss + '\n' + productionCss;

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
<!-- Firebase SDKs (Compat v10 for Auth, Firestore & Emulators) -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
<style>
${combinedCss}
</style>
</head>
<body>
<canvas id="confettiCanvas" class="confetti-canvas"></canvas>

<!-- SCREEN 1: Student Home Screen -->
<div class="app">
  <main id="homeScreen" class="screen active">
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
        <button class="pill" id="adminTopBtn" style="background:var(--cream);border-color:#ecdcc3;font-weight:800">⚙️ ॲडमिन</button>
      </div>
    </header>

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

    <!-- The 21 Lessons Map (Original Beloved Card Styling) -->
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
      <button class="admin-link-btn" id="footerAdminBtn">⚙️ शिक्षक व प्रशासकीय नियंत्रण कक्ष लॉगिन (Admin Portal)</button>
    </div>
  </main>

  <!-- SCREEN 2: Student Game & Quiz Screen -->
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

  <!-- SCREEN 3: Independent Admin Login Page -->
  <main id="adminLoginScreen" class="screen">
    <div class="admin-login-wrapper">
      <div class="admin-login-box">
        <div class="admin-login-brand">
          <div class="brandmark">📚</div>
          <h2>व्याकरणवीर — ॲडमिन पोर्टल</h2>
          <p>संतोष राऊत • शिक्षक व प्रशासकीय नियंत्रण कक्ष</p>
        </div>

        <div class="admin-login-card">
          <div class="login-shield-icon">🛡️</div>
          <h3>सुरक्षित ॲडमिन लॉगिन</h3>
          <p class="login-sub">अभ्यासक्रम संपादन, विद्यार्थी प्रगती व महसूल व्यवस्थापनासाठी पासवर्ड टाका.</p>

          <form id="adminLoginForm">
            <div class="form-row">
              <label style="text-align:left;display:block;margin-bottom:6px">ॲडमिन पासवर्ड / पिन</label>
              <div class="password-input-wrapper">
                <input type="password" id="adminPasswordInput" placeholder="••••••••" autocomplete="current-password" required />
                <button type="button" class="eye-toggle-btn" id="togglePasswordBtn" title="पासवर्ड पहा/लपवा">👁️</button>
              </div>
            </div>
            <button type="submit" class="primary admin-login-btn" id="adminLoginSubmitBtn">
              नियंत्रण कक्षात प्रवेश करा ➔
            </button>
          </form>

          <div class="admin-login-foot">
            <a href="#" id="backToAppFromLoginLink" class="back-link">← विद्यार्थ्यांच्या मुख्य ॲपवर परत जा</a>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- SCREEN 4: Independent Full-Screen Admin Command Center -->
  <main id="adminDashboardScreen" class="screen">
    <div class="admin-console-wrapper">
      <!-- Admin Topbar -->
      <header class="admin-topbar">
        <div class="admin-brand-bar">
          <div class="brandmark" style="width:40px;height:40px;font-size:22px">⚙️</div>
          <div>
            <strong style="font-size:16px">संतोष राऊत — मुख्य नियंत्रण कक्ष (Admin Master Console)</strong>
            <div style="font-size:11px;color:#d9ef8a">● थेट उत्पादन प्रणाली कार्यरत (Production Live)</div>
          </div>
        </div>
        <div class="admin-topbar-actions">
          <button class="pill" id="viewStudentAppBtn" style="background:var(--lime);color:#183f3a;font-weight:800">
            🌐 विद्यार्थी ॲप उघडा ↗
          </button>
          <button class="pill" id="adminLogoutBtn" style="background:#fff;border-color:#f1c2b5;color:#c0392b">
            लॉगआउट 🚪
          </button>
        </div>
      </header>

      <!-- Admin Nav Tabs -->
      <nav class="admin-nav-tabs">
        <button class="admin-nav-btn active" data-tab="tabAdminOverview">📊 डॅशबोर्ड व महसूल</button>
        <button class="admin-nav-btn" data-tab="tabAdminStudents">👥 विद्यार्थी व्यवस्थापन व अनलॉक</button>
        <button class="admin-nav-btn" data-tab="tabAdminCMS">✍️ नो-कोड प्रश्न व धडे संपादक</button>
        <button class="admin-nav-btn" data-tab="tabAdminSettlement">💳 बँक खाते व पेमेंट कसे जमा होते?</button>
        <button class="admin-nav-btn" data-tab="tabAdminBranding">🎨 ॲप ब्रँडिंग व डिझाइन</button>
      </nav>

      <div class="admin-page-body">
        <!-- Tab 1: Overview & Revenue -->
        <div id="tabAdminOverview" class="admin-tab-pane active">
          <div class="admin-kpi-grid">
            <div class="kpi-card"><small>एकूण महसूल (Revenue)</small><strong id="kpiRevenue">₹०</strong></div>
            <div class="kpi-card"><small>सक्रिय १-वर्ष सदस्य</small><strong id="kpiPaidUsers">०</strong></div>
            <div class="kpi-card"><small>नोंदणीकृत विद्यार्थी</small><strong id="kpiTotalUsers">०</strong></div>
            <div class="kpi-card"><small>पूर्ण झालेल्या चाचण्या</small><strong id="kpiTotalQuizzes">०</strong></div>
          </div>

          <div class="admin-panel-card">
            <h3>ताजे व्यवहार व विद्यार्थी सदस्यता नोंदवही (Live Transactions Ledger)</h3>
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
        </div>

        <!-- Tab 2: Students List & Manual 1-Year Unlock -->
        <div id="tabAdminStudents" class="admin-tab-pane">
          <div class="admin-panel-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;gap:12px;flex-wrap:wrap">
              <h3 style="margin:0">सर्व विद्यार्थी व १-वर्ष ॲक्सेस व्यवस्थापन</h3>
              <input type="text" id="adminStudentSearchInput" placeholder="🔍 नाव किंवा मोबाईल नंबर शोधा..." style="padding:10px 14px;border:1px solid var(--line);border-radius:12px;font-size:13px;width:260px" />
            </div>
            <div style="background:#f6faf7;border:1px solid #cce8d7;border-radius:12px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#1e6454">
              💡 <strong>टीप:</strong> ज्या विद्यार्थ्यांनी शाळेत रोख रक्कम (Cash) दिली आहे किंवा तुमच्या थेट वैयक्तिक UPI वर पैसे पाठवले आहेत, त्यांना खालील <strong>"⚡ १ वर्ष अनलॉक"</strong> बटण दाबून एका सेकंदात पूर्ण ॲक्सेस देता येतो.
            </div>
            <div style="overflow-x:auto">
              <table class="admin-table">
                <thead>
                  <tr><th>नाव</th><th>मोबाईल</th><th>सदस्यत्व</th><th>वैधता</th><th>कमाल स्टार्स</th><th>कृती (Action)</th></tr>
                </thead>
                <tbody id="adminStudentsTableBody">
                  <!-- Populated by JS -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab 3: No-Code Visual CMS -->
        <div id="tabAdminCMS" class="admin-tab-pane">
          <div class="admin-panel-card">
            <div class="form-row">
              <label style="font-weight:800;color:var(--ink);font-size:14px">धडा निवडा (Select Lesson to Edit):</label>
              <select id="cmsLessonSelect" style="font-size:15px;font-weight:700;padding:12px"></select>
            </div>
          </div>

          <!-- Lesson Info -->
          <div class="admin-panel-card">
            <h3>धड्याचा मूळ मजकूर (Lesson Info)</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <div class="form-row"><label>धड्याचे नाव</label><input type="text" id="cmsLessonTitle" /></div>
              <div class="form-row"><label>स्थान / ठिकाण (Place)</label><input type="text" id="cmsLessonPlace" /></div>
            </div>
            <div class="form-row" style="margin-top:12px">
              <label>धड्याचे स्पष्टीकरण (Story & Concept Body)</label>
              <textarea id="cmsLessonBody" rows="3"></textarea>
            </div>
            <div class="form-row" style="margin-top:12px">
              <label>रोजच्या आयुष्यातील उदाहरण (Real-Life Example)</label>
              <input type="text" id="cmsLessonExample" />
            </div>
            <div class="form-row" style="margin-top:12px">
              <label>महत्त्वाचे मुद्दे (Key Points - एका ओळीत एक मुद्दा)</label>
              <textarea id="cmsLessonPoints" rows="3"></textarea>
            </div>
          </div>

          <!-- Questions Editor -->
          <div class="admin-panel-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
              <h3 style="margin:0">या धड्यातील प्रश्नमंजुषा (MCQ Questions)</h3>
              <button class="pill" id="cmsAddQuestionBtn" style="background:var(--lime);color:#183f3a;font-weight:800;font-size:13px">+ नवीन प्रश्न जोडा</button>
            </div>
            <div id="cmsQuestionsContainer">
              <!-- Dynamically populated -->
            </div>
            <div style="display:flex;gap:12px;margin-top:20px;justify-content:flex-end">
              <button class="secondary" id="cmsResetBtn">↺ मूळ प्रश्न पूर्ववत करा</button>
              <button class="primary" id="cmsSaveBtn">💾 बदल सेव्ह करा आणि लाइव्ह करा</button>
            </div>
          </div>
        </div>

        <!-- Tab 4: Payment Gateway & Settlement Guidance -->
        <div id="tabAdminSettlement" class="admin-tab-pane">
          <div class="admin-panel-card">
            <h3>बँक खात्यात पैसे कसे जमा होतात? (Payment Gateway & Settlement Guide)</h3>
            <p style="font-size:14px;color:var(--muted);line-height:1.6">
              विद्यार्थ्यांनी GPay, PhonePe, Paytm किंवा कार्डने भरलेले ₹२१ थेट तुमच्या बँक खात्यात सुरक्षितपणे जमा होतात. हे कसे कार्य करते आणि तुम्हाला कोणते सोपे मॅन्युअल टप्पे करायचे आहेत ते खालीलप्रमाणे:
            </p>

            <div class="guide-step-box">
              <strong style="color:var(--green);font-size:15px"><span class="step-num">१</span> Razorpay वर मोफत खाते उघडणे</strong>
              <p style="font-size:13px;margin:6px 0 10px;line-height:1.5">
                <a href="https://razorpay.com" target="_blank" style="color:var(--green);font-weight:800">razorpay.com</a> वर जाऊन 'Sign Up' करा. तेथे तुमचे पॅन कार्ड आणि ज्या बँक खात्यात पैसे हवे आहेत त्या खात्याचा नंबर व IFSC कोड टाका. (Category: Education / Individual / Sole Proprietor).
              </p>
            </div>

            <div class="guide-step-box">
              <strong style="color:var(--green);font-size:15px"><span class="step-num">२</span> Live Key ID मिळवणे</strong>
              <p style="font-size:13px;margin:6px 0 10px;line-height:1.5">
                KYC पूर्ण झाल्यावर Razorpay Dashboard मध्ये डाव्या बाजूला <strong>Account & Settings ➔ API Keys</strong> वर क्लिक करा. तेथे <strong>'Generate Live Key'</strong> बटण दाबा. तुम्हाला एक <strong>Key ID (उदा. <code style="background:#e8f4ed;padding:2px 6px;border-radius:4px">rzp_live_xxxxxxxxxxxx</code>)</strong> मिळेल.
              </p>
            </div>

            <div class="guide-step-box">
              <strong style="color:var(--green);font-size:15px"><span class="step-num">३</span> खाली दिलेल्या बॉक्समध्ये Key ID सेव्ह करणे</strong>
              <p style="font-size:13px;margin:6px 0 10px;line-height:1.5">
                खालील बॉक्समध्ये ती Key ID पेस्ट करा आणि <strong>'पेमेंट गेटवे सेव्ह करा'</strong> दाबा. बस! एवढेच. आता प्रत्येक विद्यार्थ्याचे पैसे थेट तुमच्या बँक खात्यात Razorpay द्वारे (T+1 दिवसात) आपोआप जमा होतील.
              </p>
            </div>

            <div style="background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px;margin-top:20px">
              <h4 style="margin:0 0 14px;font-size:16px">तुमची पेमेंट गेटवे सेटिंग्ज (Live Payment Settings)</h4>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
                <div class="form-row">
                  <label>तुमची Razorpay Key ID</label>
                  <input type="text" id="gatewayRzpKeyInput" placeholder="उदा. rzp_live_xxxxxxxxxxxx" />
                </div>
                <div class="form-row">
                  <label>तुमचा UPI ID (पर्यायी QR साठी)</label>
                  <input type="text" id="gatewayUpiIdInput" placeholder="उदा. santoshraut@okaxis किंवा santoshraut@upi" />
                </div>
              </div>
              <div style="display:flex;gap:12px;margin-top:16px;align-items:center;justify-content:space-between">
                <a href="https://dashboard.razorpay.com" target="_blank" class="secondary" style="text-decoration:none;font-size:13px;padding:10px 16px;border-radius:12px;display:inline-block">
                  🔗 Razorpay Dashboard उघडा (dashboard.razorpay.com) ↗
                </a>
                <button class="primary" id="saveGatewayBtn">💾 पेमेंट गेटवे सेव्ह करा</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 5: Complete Branding & App Customizer -->
        <div id="tabAdminBranding" class="admin-tab-pane">
          <div class="admin-panel-card">
            <h3>मुख्य ॲप ब्रँडिंग व शिक्षक माहिती</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
              <div class="form-row"><label>ॲपचे मुख्य नाव</label><input type="text" id="brandInputAppName" /></div>
              <div class="form-row"><label>उपशीर्षक (Subtitle)</label><input type="text" id="brandInputSubTitle" /></div>
              <div class="form-row"><label>शिक्षकाचे नाव</label><input type="text" id="brandInputAuthorName" /></div>
              <div class="form-row"><label>बायलाइन (Byline)</label><input type="text" id="brandInputByline" /></div>
              <div class="form-row"><label>शिक्षकांच्या फोटोची लिंक (Photo URL)</label><input type="text" id="brandInputAuthorPhoto" /></div>
              <div class="form-row"><label>लोगो इमोजी (Logo Icon)</label><input type="text" id="brandInputLogo" /></div>
            </div>
          </div>

          <div class="admin-panel-card">
            <h3>शुल्क, वैधता व सुरक्षा (Pricing & Security)</h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
              <div class="form-row"><label>प्रवेश फी (₹ - GST सह)</label><input type="number" id="brandInputFee" /></div>
              <div class="form-row"><label>वैधता (दिवस)</label><input type="number" id="brandInputValidity" /></div>
              <div class="form-row"><label>विनामूल्य डेमो धडे (संख्या)</label><input type="number" id="brandInputFreeLessons" /></div>
            </div>
            <div class="form-row" style="margin-top:14px">
              <label>नवीन ॲडमिन पासवर्ड / पिन (येथून पासवर्ड बदला)</label>
              <input type="password" id="brandInputAdminPin" placeholder="नवीन गुप्त पासवर्ड टाका" />
            </div>
          </div>

          <div class="admin-panel-card">
            <h3>रंगसंगती (Theme Colors)</h3>
            <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:10px">
                <label style="font-size:13px;font-weight:700">मुख्य हिरवा रंग:</label>
                <input type="color" id="brandInputColorPrimary" style="width:44px;height:40px;border:none;cursor:pointer;border-radius:10px" />
              </div>
              <div style="display:flex;align-items:center;gap:10px">
                <label style="font-size:13px;font-weight:700">हायलाइट लाईम रंग:</label>
                <input type="color" id="brandInputColorAccent" style="width:44px;height:40px;border:none;cursor:pointer;border-radius:10px" />
              </div>
            </div>
            <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px">
              <button class="secondary" id="brandResetBtn">↺ मूळ ब्रँडिंग पूर्ववत करा</button>
              <button class="primary" id="brandSaveBtn">💾 ब्रँडिंग सेव्ह करा</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- MODAL: Name Profile Prompt -->
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

<!-- MODAL: Student ₹21 Paywall Modal (Clean, Secure, Zero Free Unlock Loophole) -->
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
      <div class="feat-item"><span class="feat-check">✓</span> <div><strong>सर्व २१ व्याकरण मोहिमा:</strong> स्वर संधी, व्यंजन संधी, विसर्ग संधी, विभक्ती व कारकार्थ, समास, अलंकार आणि सर्व बोर्ड घटक.</div></div>
      <div class="feat-item"><span class="feat-check">✓</span> <div><strong>११०+ संवादात्मक प्रश्न:</strong> प्रत्येक प्रश्नासोबत स्पष्टीकरण, संदर्भ आणि हिंट्स.</div></div>
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

<!-- MODAL: Direct QR / UTR Submission (In case Razorpay is not yet configured) -->
<div class="modal" id="upiModal">
  <div class="modal-card upi-card" style="max-width:440px;text-align:center">
    <button class="close-modal-btn" id="closeUpiBtn">&times;</button>
    <h3 style="margin:0 0 6px">📲 थेट UPI पेमेंट (₹२१)</h3>
    <p style="font-size:13px;color:var(--muted);margin:0 0 14px">कोणत्याही UPI ॲपवरून ₹२१ (GST समाविष्ट) भरा व १ वर्ष वैधतेचा आनंद घ्या:</p>
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
        </svg>
      </div>
      <div class="upi-id-copy">
        UPI ID: <strong id="upiIdText">santoshraut@upi</strong>
        <button class="pill-sm" id="copyUpiIdBtn">📋 कॉपी</button>
      </div>
    </div>
    <div class="utr-input-box">
      <label>पेमेंट झाल्यावर मिळालेला १२ अंकी UTR / Ref No. टाका:</label>
      <div style="display:flex;gap:8px">
        <input type="text" id="utrInput" placeholder="उदा. 428192849201" maxlength="16" />
        <button class="primary" id="verifyUtrBtn">तपासा</button>
      </div>
      <small style="color:var(--muted);display:block;margin-top:6px;font-size:11px">पडताळणीनंतर तुमचे खाते १ वर्षासाठी सक्रिय केले जाईल.</small>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<!-- Application Logic -->
<script>
// Master Data: 21 Complete Units (Client manifest with server-protected paid lessons)
const DEFAULT_UNITS = ${JSON.stringify(clientUnits, null, 2)};

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
  upiId: 'santoshraut@upi',
  adminPin: '2121'
};

// Application State
let branding = Object.assign({}, DEFAULT_BRANDING, JSON.parse(localStorage.getItem('vv_branding') || '{}'));
let units = JSON.parse(localStorage.getItem('vv_custom_units') || 'null') || JSON.parse(JSON.stringify(DEFAULT_UNITS));
const progress = JSON.parse(localStorage.getItem('vv_progress') || '{}');
let userPlan = null;
let audioEnabled = localStorage.getItem('vv_audio') !== 'false';
let isAdminAuthenticated = false;

// -------------------------------------------------------------
// Firebase Configuration & Local Emulator Support
// -------------------------------------------------------------
const firebaseConfig = {
  apiKey: "local-emulator-key",
  authDomain: "marathi-vyakaram.firebaseapp.com",
  projectId: "marathi-vyakaram",
  storageBucket: "marathi-vyakaram.appspot.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

// Connect to Local Emulators when running locally
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  auth.useEmulator('http://127.0.0.1:9099');
  db.useEmulator('127.0.0.1', 8080);
  console.log('⚡ Connected to Firebase Auth (9099) & Firestore (8080) Emulators');
}

let currentAuthUser = null;
let currentEntitlement = null;
let entitlementUnsubscribe = null;

// Silent Anonymous Authentication in Background
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentAuthUser = user;
    console.log('👤 Silent Anonymous Student Authenticated:', user.uid);
    listenToEntitlement(user.uid);
  } else {
    try {
      const cred = await auth.signInAnonymously();
      currentAuthUser = cred.user;
      console.log('👤 Initialized Anonymous Student:', currentAuthUser.uid);
    } catch (err) {
      console.error('Anonymous sign-in error:', err);
    }
  }
});

function listenToEntitlement(uid) {
  if (entitlementUnsubscribe) entitlementUnsubscribe();
  entitlementUnsubscribe = db.collection('users').doc(uid).onSnapshot((doc) => {
    if (doc.exists && doc.data().isPaid) {
      currentEntitlement = doc.data();
      userPlan = {
        isPaid: true,
        plan: doc.data().plan || 'annual_21',
        planName: doc.data().planName || '१ वर्ष संपूर्ण ॲक्सेस',
        expiresAt: doc.data().expiresAt ? (doc.data().expiresAt.toMillis ? doc.data().expiresAt.toMillis() : doc.data().expiresAt) : (Date.now() + 365*24*60*60*1000),
        paymentId: doc.data().paymentId || ''
      };
      console.log('🎉 Verified 365-day Entitlement active for student:', uid);
    } else {
      currentEntitlement = null;
      userPlan = null;
    }
    renderMap();
    updateSubscriptionUI();
  }, (err) => {
    console.warn('Entitlement snapshot error:', err);
  });
}

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

// Navigation & Screen Management
function showScreen(which) {
  el('homeScreen').classList.toggle('active', which === 'home');
  el('gameScreen').classList.toggle('active', which === 'game');
  el('adminLoginScreen').classList.toggle('active', which === 'admin-login');
  el('adminDashboardScreen').classList.toggle('active', which === 'admin-dash');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRoute() {
  const hash = window.location.hash;
  if (hash === '#admin') {
    if (isAdminAuthenticated) {
      showScreen('admin-dash');
      populateAdminConsole();
    } else {
      showScreen('admin-login');
    }
  } else if (hash === '#game') {
    showScreen('game');
  } else {
    showScreen('home');
  }
}
window.addEventListener('hashchange', handleRoute);

// Subscription & Paywall Logic (Strictly Verified via Firestore Entitlement)
function hasActiveAccess() {
  if (currentEntitlement && currentEntitlement.isPaid) {
    if (currentEntitlement.expiresAt) {
      const expMs = currentEntitlement.expiresAt.toMillis ? currentEntitlement.expiresAt.toMillis() : new Date(currentEntitlement.expiresAt).getTime();
      return expMs > Date.now();
    }
    return true;
  }
  return false;
}

function updateSubscriptionUI() {
  const isPaid = hasActiveAccess();
  const subBadge = el('subBadge');
  const unlockTopBtn = el('unlockTopBtn');
  if (isPaid) {
    subBadge.style.display = 'inline-flex';
    let expDate = '१ वर्ष';
    if (currentEntitlement && currentEntitlement.expiresAt) {
      const expMs = currentEntitlement.expiresAt.toMillis ? currentEntitlement.expiresAt.toMillis() : new Date(currentEntitlement.expiresAt).getTime();
      expDate = new Date(expMs).toLocaleDateString('mr-IN');
    }
    el('subBadgeText').textContent = '१ वर्ष सदस्यत्व सक्रिय (वैध: ' + expDate + ')';
    unlockTopBtn.style.display = 'none';
  } else {
    subBadge.style.display = 'none';
    unlockTopBtn.style.display = 'inline-flex';
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

// Map Rendering: Restored Exact Beloved Style & Typography!
function renderMap() {
  const map = el('unitMap');
  map.innerHTML = '';
  const isPaid = hasActiveAccess();

  units.forEach((u, i) => {
    const p = progress[u.id] || { bestScore: 0, bestStars: 0, attempts: 0 };
    const isLocked = (i >= branding.freeLessonsCount) && !isPaid;
    const isFreeDemo = (i < branding.freeLessonsCount);

    const card = document.createElement('article');
    card.className = 'unit' + (isLocked ? ' locked' : '');
    card.style.setProperty('--unit-bg', u.bg || '#e7f2dc');

    let statusChip = '';
    if (isFreeDemo) {
      statusChip = '<span class="free-chip">🎁 मोफत डेमो</span>';
    } else if (isLocked) {
      statusChip = '<span class="lock-chip">🔒 ₹' + toDevanagari(branding.fee) + '</span>';
    } else {
      statusChip = '<span class="unlocked-chip">✓ अनलॉक</span>';
    }

    let btnText = '';
    if (isLocked) {
      btnText = '🔒 ₹' + toDevanagari(branding.fee) + ' मध्ये १ वर्ष अनलॉक';
    } else if (p.bestScore >= 60) {
      btnText = 'पुन्हा खेळा ↻';
    } else if (p.bestScore > 0) {
      btnText = 'पुन्हा प्रयत्न करा';
    } else {
      btnText = 'मोहिम सुरू करा →';
    }

    card.innerHTML = \`
      <div class="unit-top">
        <div class="unit-icon">\${u.icon}</div>
        <div style="display:flex;gap:6px;align-items:center">
          \${statusChip}
          <span class="unit-tag">\${u.grade}</span>
        </div>
      </div>
      <h3>\${toDevanagari(i + 1)}. \${u.title}</h3>
      <p>📍 \${u.place} · \${u.desc}</p>
      <div class="unit-foot">
        <div class="progress-track">
          <div class="progress-fill" style="width:\${p.bestScore || 0}%"></div>
        </div>
        <span class="unit-score">\${p.bestScore ? toDevanagari(p.bestScore) + '%' : (isLocked ? 'कुलूप' : 'नवीन')}</span>
      </div>
      <button class="unit-btn">\${btnText}</button>
    \`;

    card.querySelector('.unit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('click');
      if (isLocked) {
        openPaywallModal(i);
      } else {
        openUnit(i);
      }
    });

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
async function openUnit(index) {
  state.unit = index;
  const u = units[index];

  // If questions/lesson not loaded yet (paid lessons 3-20), fetch securely from backend
  if (!u.questions || !u.questions.length || !u.lesson) {
    if (!auth.currentUser) {
      try {
        await auth.signInAnonymously();
      } catch(e) {}
    }
    toast('धडा सुरक्षितपणे लोड होत आहे...');
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/get-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ unitIndex: index })
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 || data.error === 'PAID_MEMBERSHIP_REQUIRED') {
          openPaywallModal(index);
          return;
        }
        toast('धडा उघडताना अडचण: ' + (data.message || 'Error'));
        return;
      }
      u.lesson = data.lesson;
      u.questions = data.questions;
    } catch (e) {
      console.error('Fetch lesson error:', e);
      toast('सर्व्हरशी संपर्क होऊ शकला नाही.');
      return;
    }
  }

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

  window.location.hash = '#game';
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
    btn.className = 'option';
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
  const btns = el('optionsBox').querySelectorAll('.option');

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
    fb.className = 'feedback show good';
    fb.innerHTML = '<strong>बरोबर उत्तर! 🎯</strong><p>' + q.why + '</p>';
  } else {
    playSound('wrong');
    fb.className = 'feedback show bad';
    fb.innerHTML = '<strong>चुकले, पण हरकत नाही! शिकून घेऊया:</strong><p>' + q.why + '</p>';
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
  hb.classList.add('show');
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

  // Calculate stars based strictly on best score
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

// Student Paywall & Payment Flow (Secure, No Free Unlock Loophole)
function openPaywallModal(unitIdx) {
  el('payStudentName').value = state.name || '';
  el('paywallModal').classList.add('show');
}

async function handlePayNow() {
  const name = el('payStudentName').value.trim() || state.name || 'मराठी विद्यार्थी';
  const phone = el('payStudentPhone').value.trim();

  if (name && !state.name) {
    state.name = name;
    localStorage.setItem('vv_name', name);
    refreshStats();
  }

  const payBtn = el('payNowBtn');
  const originalText = payBtn.innerHTML;
  payBtn.disabled = true;
  payBtn.innerHTML = '⏳ ऑर्डर तयार करत आहे...';

  try {
    if (!auth.currentUser) {
      await auth.signInAnonymously();
    }
    const token = await auth.currentUser.getIdToken();

    // 1. Create order on Cloud Functions backend (strictly 2100 paise = ₹21.00)
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.orderId) {
      throw new Error(orderData.message || 'ऑर्डर तयार करता आली नाही.');
    }

    // 2. Open Razorpay Standard Checkout
    const options = {
      key: orderData.keyId,
      amount: orderData.amount, // strictly 2100 paise
      currency: orderData.currency || 'INR',
      name: branding.appName || 'व्याकरणवीर',
      description: '१ वर्ष संपूर्ण ॲक्सेस — ' + (branding.subTitle || 'मराठी व्याकरण'),
      image: branding.authorPhoto || 'assets/santosh-raut.jpg',
      order_id: orderData.orderId,
      prefill: {
        name: name,
        contact: phone || ''
      },
      theme: {
        color: branding.primaryColor || '#1e6454'
      },
      handler: async function (response) {
        toast('💳 पेमेंट पूर्ण झाले! सर्व्हर पडताळणी सुरू आहे...');
        payBtn.innerHTML = '⏳ पेमेंट पडताळत आहे...';
        try {
          const verifyToken = await auth.currentUser.getIdToken();
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + verifyToken
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            throw new Error(verifyData.message || 'पेमेंट पडताळणी अयशस्वी');
          }

          // Verified and entitlement granted!
          recordStudent(name, phone, true, Date.now() + (365 * 24 * 60 * 60 * 1000));
          el('paywallModal').classList.remove('show');
          fireConfetti();
          playSound('win');
          toast('🎉 ' + (verifyData.message || 'अभिनंदन! आपले १ वर्षाचे सदस्यत्व सक्रिय झाले!'));
        } catch (vErr) {
          console.error('Payment verification failed:', vErr);
          toast('❌ ' + vErr.message);
        } finally {
          payBtn.disabled = false;
          payBtn.innerHTML = originalText;
        }
      },
      modal: {
        ondismiss: function() {
          payBtn.disabled = false;
          payBtn.innerHTML = originalText;
          toast('पेमेंट प्रक्रिया रद्द केली गेली.');
        }
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      throw new Error('Razorpay SDK लोड होऊ शकले नाही. कृपया इंटरनेट कनेक्शन तपासा.');
    }
  } catch (err) {
    console.error('Pay error:', err);
    toast('❌ त्रुटी: ' + err.message);
    payBtn.disabled = false;
    payBtn.innerHTML = originalText;
  }
}

function openUpiModal(name, phone) {
  el('upiIdText').textContent = branding.upiId || 'santoshraut@upi';
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

// Independent Admin Portal Logic
function handleAdminLogin() {
  const entered = el('adminPasswordInput').value.trim();
  const correct = branding.adminPin || '2121';
  if (entered === correct) {
    isAdminAuthenticated = true;
    el('adminPasswordInput').value = '';
    window.location.hash = '#admin';
    showScreen('admin-dash');
    populateAdminConsole();
    toast('✅ ॲडमिन नियंत्रण कक्षात स्वागत आहे!');
  } else {
    toast('❌ चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा.');
    el('adminPasswordInput').value = '';
  }
}

function populateAdminConsole() {
  populateAdminOverview();
  populateAdminStudents();
  populateAdminCMS();
  populateAdminSettlement();
  populateAdminBranding();
}

function populateAdminOverview() {
  const list = JSON.parse(localStorage.getItem('vv_students') || '[]');
  const paidCount = list.filter(s => s.isPaid && s.expiresAt > Date.now()).length;
  const totalRevenue = paidCount * (branding.fee || 21);
  const totalQuizzes = Object.values(progress).reduce((sum, p) => sum + (p.attempts || 0), 0);

  el('kpiRevenue').textContent = '₹' + toDevanagari(totalRevenue);
  el('kpiPaidUsers').textContent = toDevanagari(paidCount);
  el('kpiTotalUsers').textContent = toDevanagari(list.length);
  el('kpiTotalQuizzes').textContent = toDevanagari(totalQuizzes);

  const tbody = el('adminRecentPaymentsTable');
  tbody.innerHTML = '';
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted)">अजून कोणतेही व्यवहार नाहीत.</td></tr>';
    return;
  }
  list.slice(0, 10).forEach(s => {
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
    if (list[idx].name === state.name) {
      userPlan = { isPaid: true, expiresAt: list[idx].expiresAt, paidAt: Date.now(), studentName: list[idx].name, studentPhone: list[idx].phone };
      localStorage.setItem('vv_plan', JSON.stringify(userPlan));
      updateSubscriptionUI();
      renderMap();
    }
    toast('✅ ' + list[idx].name + ' साठी १ वर्ष सदस्यत्व अनलॉक केले!');
    populateAdminStudents();
    populateAdminOverview();
  }
};

window.adminDeleteStudent = function(idx) {
  if (!confirm('हा विद्यार्थी डेटा हटवायचा आहे का?')) return;
  let list = JSON.parse(localStorage.getItem('vv_students') || '[]');
  list.splice(idx, 1);
  localStorage.setItem('vv_students', JSON.stringify(list));
  populateAdminStudents();
  populateAdminOverview();
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

async function loadCmsLesson(idx) {
  currentCmsLessonIdx = idx;
  const u = units[idx];
  if (!u.lesson || !u.questions || !u.questions.length) {
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const res = await fetch('/api/get-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        },
        body: JSON.stringify({ unitIndex: idx })
      });
      if (res.ok) {
        const d = await res.json();
        u.lesson = d.lesson;
        u.questions = d.questions;
      }
    } catch(e) {}
  }
  el('cmsLessonTitle').value = u.title || '';
  el('cmsLessonPlace').value = u.place || '';
  el('cmsLessonBody').value = (u.lesson && u.lesson.body) || '';
  el('cmsLessonExample').value = (u.lesson && u.lesson.example) || '';
  el('cmsLessonPoints').value = (u.lesson && u.lesson.points || []).join('\\n');

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
        <span>प्रश्न \${toDevanagari(qIdx + 1)}: \${q.q.slice(0, 42)}...</span>
        <span>▼</span>
      </div>
      <div class="cms-acc-body">
        <div class="form-row">
          <label>प्रश्नाचा मजकूर (Question Text)</label>
          <textarea class="cms-q-text" rows="2">\${q.q}</textarea>
        </div>
        <div style="margin:12px 0 6px"><small style="font-weight:800;color:var(--muted)">पर्याय व बरोबर उत्तराची खूण (रेडिओ बटण निवडा):</small></div>
        <div class="cms-opts-box">
          \${q.o.map((opt, oIdx) => \`
            <div class="opt-radio-row">
              <input type="radio" name="correct_opt_\${qIdx}" value="\${oIdx}" \${q.a === oIdx ? 'checked' : ''} />
              <input type="text" class="cms-opt-input" value="\${opt}" style="flex:1" placeholder="पर्याय \${oIdx+1}" />
            </div>
          \`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div class="form-row"><label>प्रसंग (Scene)</label><input type="text" class="cms-scene" value="\${q.scene || ''}" /></div>
          <div class="form-row"><label>संदर्भ (Context)</label><input type="text" class="cms-context" value="\${q.context || ''}" /></div>
        </div>
        <div class="form-row" style="margin-top:12px">
          <label>हिंट (Hint)</label>
          <input type="text" class="cms-hint" value="\${q.hint || ''}" />
        </div>
        <div class="form-row" style="margin-top:12px">
          <label>स्पष्टीकरण (हे उत्तर का बरोबर आहे?)</label>
          <textarea class="cms-why" rows="2">\${q.why || ''}</textarea>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:12px">
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

// Payment Settlement Tab
function populateAdminSettlement() {
  el('gatewayRzpKeyInput').value = branding.razorpayKey || '';
  el('gatewayUpiIdInput').value = branding.upiId || 'santoshraut@upi';
}

function saveGatewaySettings() {
  branding.razorpayKey = el('gatewayRzpKeyInput').value.trim();
  branding.upiId = el('gatewayUpiIdInput').value.trim() || 'santoshraut@upi';
  localStorage.setItem('vv_branding', JSON.stringify(branding));
  toast('✅ पेमेंट गेटवे सेटिंग्ज सुरक्षित सेव्ह झाल्या!');
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
  el('brandInputAdminPin').value = '';
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
  if (el('brandInputAdminPin').value.trim()) {
    branding.adminPin = el('brandInputAdminPin').value.trim();
  }
  branding.primaryColor = el('brandInputColorPrimary').value;
  branding.accentColor = el('brandInputColorAccent').value;

  localStorage.setItem('vv_branding', JSON.stringify(branding));
  applyBrandingToDOM();
  renderMap();
  toast('✅ नवीन ब्रँडिंग व डिझाइन सेव्ह झाले!');
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

  if (branding.primaryColor) document.documentElement.style.setProperty('--green', branding.primaryColor);
  if (branding.accentColor) document.documentElement.style.setProperty('--lime', branding.accentColor);
}

// Event Listeners Initialization
function initEventListeners() {
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
    window.location.hash = '';
    showScreen('home');
    renderMap();
  });

  el('mapBtn').addEventListener('click', () => {
    playSound('click');
    window.location.hash = '';
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

  // UPI Direct Modal Actions
  el('closeUpiBtn').addEventListener('click', () => {
    el('upiModal').classList.remove('show');
  });

  el('copyUpiIdBtn').addEventListener('click', () => {
    const id = branding.upiId || 'santoshraut@upi';
    navigator.clipboard.writeText(id).then(() => toast('UPI ID कॉपी झाला: ' + id));
  });

  el('verifyUtrBtn').addEventListener('click', () => {
    const utr = el('utrInput').value.trim();
    if (!utr || utr.length < 6) {
      toast('कृपया अचूक १२ अंकी UTR किंवा संदर्भ क्रमांक टाका.');
      return;
    }
    const name = el('payStudentName').value.trim() || state.name || 'विद्यार्थी';
    const phone = el('payStudentPhone').value.trim();
    recordStudent(name, phone, false, null);
    el('upiModal').classList.remove('show');
    toast('✅ संदर्भ क्रमांक नोंदवला गेला आहे. शिक्षक पडताळणीनंतर ॲक्सेस सुरू होईल.');
  });

  // Admin Navigation Links
  el('adminTopBtn').addEventListener('click', () => {
    playSound('click');
    window.location.hash = '#admin';
  });

  el('footerAdminBtn').addEventListener('click', () => {
    playSound('click');
    window.location.hash = '#admin';
  });

  el('backToAppFromLoginLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '';
    showScreen('home');
  });

  el('viewStudentAppBtn').addEventListener('click', () => {
    window.location.hash = '';
    showScreen('home');
  });

  el('adminLogoutBtn').addEventListener('click', () => {
    isAdminAuthenticated = false;
    window.location.hash = '';
    showScreen('home');
    toast('ॲडमिन कन्सोलमधून बाहेर पडलात.');
  });

  // Admin Login
  el('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    handleAdminLogin();
  });

  el('togglePasswordBtn').addEventListener('click', () => {
    const inp = el('adminPasswordInput');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  // Admin Dashboard Tabs
  document.querySelectorAll('.admin-nav-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-pane').forEach(c => c.classList.remove('active'));
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

  // Admin Settlement
  el('saveGatewayBtn').addEventListener('click', saveGatewaySettings);

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

// Initial App Launch
applyBrandingToDOM();
initEventListeners();
handleRoute();
renderMap();
if (!state.name && window.location.hash !== '#admin') {
  setTimeout(() => el('profileModal').classList.add('show'), 700);
}
</script>
</body>
</html>
`;

fs.writeFileSync('./vyakaranveer-app/index.html', fullHtml);
console.log('Successfully generated production vyakaranveer-app/index.html');
console.log('File size:', fullHtml.length, 'bytes');

