const fs = require('fs');

const units21Complete = JSON.parse(fs.readFileSync('./units_21_complete.json', 'utf8'));

// Units client manifest: Full content for all 21 lessons
const clientUnits = units21Complete;

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
        <button id="authTopBtn" class="pill" style="background:var(--green);color:#fff;font-weight:800">
          🔑 लॉगिन / नोंदणी
        </button>
        <div id="studentUserChip" class="student-user-chip" style="display:none;align-items:center;gap:6px;cursor:pointer" title="माझे प्रोफाइल">
          <span class="user-avatar-tiny" id="userAvatarTiny" style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--green);color:#fff;font-size:12px;font-weight:800">👤</span>
          <span class="name-tag" id="playerName">नवा खेळाडू</span>
        </div>
        <button class="pill" id="profileBtn" style="display:none">👤 प्रोफाइल</button>
        <button class="pill" id="logoutTopBtn" style="display:none;font-weight:700">🚪 बाहेर पडा</button>
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

<!-- MODAL: Student Authentication (Login / Register / Google / Password Recovery) -->
<div class="modal" id="authModal">
  <div class="modal-card" style="max-width:440px">
    <button class="close-modal-btn" id="closeAuthModalBtn">&times;</button>
    <div style="text-align:center;margin-bottom:18px">
      <div style="font-size:38px;margin-bottom:4px">🚩</div>
      <h2 style="margin:0 0 4px;font-size:22px;color:var(--ink)">व्याकरणवीर विद्यार्थी प्रवेश</h2>
      <p style="margin:0;font-size:13px;color:var(--muted)">२१ धडे, गुण आणि सदस्यत्व सर्व उपकरणांवर (Cross-Device) सुरक्षित ठेवा</p>
    </div>

    <!-- Google One-Click Sign-in (Official Google Identity Specification) -->
    <button class="google-auth-btn" id="googleSignInBtn" type="button">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        <path fill="none" d="M0 0h48v48H0z"/>
      </svg>
      <span>Google सह साइन इन करा</span>
    </button>
    <div class="google-auth-subtext">🔒 Google खात्याद्वारे जलद व सुरक्षित प्रवेश</div>

    <div class="auth-divider"><span>किंवा ईमेलने सुरू करा</span></div>

    <!-- Auth Tabs (लॉगिन vs नवीन नोंदणी) -->
    <div class="auth-tabs">
      <button class="auth-tab-btn active" id="authTabLoginBtn" type="button">लॉगिन (Sign In)</button>
      <button class="auth-tab-btn" id="authTabRegisterBtn" type="button">नवीन नोंदणी (Register)</button>
    </div>

    <!-- In-Modal Alert Box for Instant Feedback -->
    <div id="authAlertBox" class="auth-alert-box" style="display:none"></div>

    <!-- Login Form -->
    <form id="studentLoginForm">
      <div class="form-row" style="margin-bottom:12px">
        <label>ईमेल पत्ता (Email)</label>
        <input type="email" id="loginEmail" required placeholder="उदा. student@gmail.com" autocomplete="email" />
      </div>
      <div class="form-row" style="margin-bottom:12px">
        <label>पासवर्ड (Password)</label>
        <input type="password" id="loginPassword" required placeholder="••••••••" autocomplete="current-password" />
      </div>
      <button type="submit" class="primary" id="loginSubmitBtn" style="width:100%;padding:13px;font-size:15px;margin-top:4px">
        लॉगिन करा →
      </button>
      <div class="auth-helper-links">
        <a id="forgotPasswordLink">पासवर्ड विसरलात?</a>
      </div>
    </form>

    <!-- Register Form -->
    <form id="studentRegisterForm" style="display:none">
      <div class="form-row" style="margin-bottom:10px">
        <label>विद्यार्थ्याचे संपूर्ण नाव *</label>
        <input type="text" id="regName" required placeholder="उदा. राहुल संतोष पाटील" />
      </div>
      <div class="form-row" style="margin-bottom:10px">
        <label>इयत्ता (Class / Standard) *</label>
        <select id="regGrade" required>
          <option value="8">इयत्ता ८वी</option>
          <option value="9">इयत्ता ९वी</option>
          <option value="10">इयत्ता १०वी</option>
          <option value="इतर">इतर</option>
        </select>
      </div>
      <div class="form-row" style="margin-bottom:10px">
        <label>ईमेल पत्ता (Email) *</label>
        <input type="email" id="regEmail" required placeholder="विद्यार्थी किंवा पालकांचा ईमेल" autocomplete="email" />
      </div>
      <div class="form-row" style="margin-bottom:10px">
        <label>पासवर्ड (किमान ६ अक्षरे) *</label>
        <input type="password" id="regPassword" minlength="6" required placeholder="••••••••" autocomplete="new-password" />
      </div>
      <div class="form-row" style="margin-bottom:12px">
        <label>पासवर्ड पुन्हा टाका *</label>
        <input type="password" id="regConfirmPassword" minlength="6" required placeholder="••••••••" autocomplete="new-password" />
      </div>
      <button type="submit" class="primary" id="regSubmitBtn" style="width:100%;padding:13px;font-size:15px;margin-top:4px">
        नवीन विद्यार्थी खाते तयार करा →
      </button>
      <p style="text-align:center;font-size:11px;color:var(--muted);margin-top:8px">
        * नोंदणी केल्यावर ईमेल पडताळणी लिंक पाठवली जाईल.
      </p>
    </form>

    <!-- Forgot Password View -->
    <div id="forgotPasswordSection" style="display:none;margin-top:14px;border-top:1px solid var(--line);padding-top:14px">
      <h4 style="margin:0 0 6px;font-size:14px;color:var(--ink)">🔐 पासवर्ड रीसेट करा</h4>
      <p style="font-size:12px;color:var(--muted);margin:0 0 10px">आपला ईमेल पत्ता टाका. आम्ही पासवर्ड बदलण्याची लिंक पाठवू.</p>
      <div class="form-row" style="margin-bottom:10px">
        <input type="email" id="forgotEmail" placeholder="उदा. student@gmail.com" />
      </div>
      <div style="display:flex;gap:8px">
        <button type="button" class="pill" id="sendResetBtn" style="flex:1;background:var(--green);color:#fff">रीसेट लिंक पाठवा</button>
        <button type="button" class="pill" id="cancelResetBtn">रद्द करा</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL: Student Profile & Cross-Device Account Management -->
<div class="modal" id="profileModal">
  <div class="modal-card" style="max-width:540px">
    <button class="close-modal-btn" id="closeProfileBtn">&times;</button>

    <div class="profile-avatar-wrap">
      <div class="profile-avatar" id="profileAvatar">👤</div>
      <div id="profileMembershipBadge" class="profile-membership-pill membership-free">
        🌱 मोफत आवृत्ती (३ धडे)
      </div>
    </div>

    <!-- Permanent Firebase Auth UID Badge (Requirement B.1 & C) -->
    <div class="student-id-card">
      <div>
        <div style="font-size:10px;text-transform:uppercase;color:var(--muted);font-weight:700">कायमस्वरूपी विद्यार्थी आयडी (Firebase UID)</div>
        <div id="profileUidDisplay" style="font-weight:700;word-break:break-all">लॉगिन आवश्यक</div>
      </div>
      <button class="copy-btn" id="copyUidBtn" type="button" title="आयडी कॉपी करा">📋 कॉपी</button>
    </div>

    <!-- Email Verification Alert Banner -->
    <div id="profileEmailVerifyBanner" class="email-verify-banner" style="display:none">
      <span>⚠️ आपला ईमेल अद्याप पडताळलेला नाही.</span>
      <button class="pill" id="profileSendVerifyBtn" type="button" style="padding:4px 8px;font-size:11px;background:#fff">पडताळणी पाठवा</button>
    </div>

    <!-- Membership Details (Strictly Read-Only, Non-editable by student) -->
    <div style="background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin-bottom:16px;font-size:12px;line-height:1.6">
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:5px;margin-bottom:5px">
        <span style="color:var(--muted)">सदस्यत्व स्थिती:</span>
        <strong id="profStatusText">मोफत डेमो (३ धडे)</strong>
      </div>
      <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:5px;margin-bottom:5px">
        <span style="color:var(--muted)">वैधता कालावधी (Expiry):</span>
        <span id="profExpiryText">—</span>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="color:var(--muted)">पेमेंट व्यवहार आयडी:</span>
        <span id="profPaymentIdText" style="font-family:monospace">—</span>
      </div>
    </div>

    <!-- Profile Form (Editable Fields: Name, Phone, Grade, School, Parent Contact, Photo) -->
    <form id="studentProfileForm">
      <div class="profile-form-grid">
        <div class="form-row">
          <label>विद्यार्थ्याचे संपूर्ण नाव *</label>
          <input type="text" id="profNameInput" required placeholder="उदा. राजू पवार" />
        </div>
        <div class="form-row">
          <label>फोन नंबर (Student Phone)</label>
          <input type="tel" id="profPhoneInput" placeholder="९८XXXXXXXX" />
        </div>
        <div class="form-row">
          <label>इयत्ता (Class / Standard) *</label>
          <select id="profGradeInput" required>
            <option value="8">इयत्ता ८वी</option>
            <option value="9">इयत्ता ९वी</option>
            <option value="10">इयत्ता १०वी</option>
            <option value="इतर">इतर</option>
          </select>
        </div>
        <div class="form-row">
          <label>शाळेचे नाव (School Name)</label>
          <input type="text" id="profSchoolInput" placeholder="उदा. छत्रपती शिवाजी विद्यालय" />
        </div>
        <div class="form-row">
          <label>पालक / संपर्क (Parent Contact)</label>
          <input type="tel" id="profParentContactInput" placeholder="पालकांचा संपर्क क्रमांक" />
        </div>
        <div class="form-row">
          <label>फोटो लिंक (Profile Photo URL)</label>
          <input type="url" id="profPhotoUrlInput" placeholder="https://..." />
        </div>
      </div>

      <!-- Email section with Verified Management Flow -->
      <div class="form-row" style="margin-bottom:16px">
        <label>नोंदणीकृत ईमेल पत्ता (Account Email)</label>
        <div style="display:flex;gap:8px">
          <input type="email" id="profEmailDisplay" readonly style="background:#f9f9f9;cursor:not-allowed" />
          <button type="button" class="pill" id="changeEmailBtn" style="white-space:nowrap;font-size:12px">ईमेल बदला</button>
        </div>
        <small style="color:var(--muted);font-size:11px;display:block;margin-top:3px">
          * ईमेल बदलण्यासाठी नवीन पत्त्यावर पडताळणी लिंक पाठवली जाईल.
        </small>
      </div>

      <div style="display:flex;gap:10px;margin-bottom:14px">
        <button type="submit" class="primary" id="saveProfileBtn" style="flex:2;padding:12px;font-size:15px">
          💾 प्रोफाइल सेव्ह करा
        </button>
        <button type="button" class="pill" id="logoutFromProfileBtn" style="flex:1;padding:12px;font-weight:700">
          🚪 बाहेर पडा
        </button>
      </div>
    </form>

    <!-- Safe Account Linking Section (Requirement B.5) -->
    <div class="linked-accounts-list">
      <h4 style="margin:0 0 10px;font-size:13px;color:var(--ink)">🔗 जोडलेली खाती (Linked Sign-In Methods)</h4>
      <div class="link-row">
        <div class="link-row-info">
          <span>🌐 Google</span>
          <span class="link-status-badge not-connected" id="googleLinkBadge">अजोडलेले</span>
        </div>
        <button type="button" class="btn-link" id="linkGoogleBtn">Google जोडा</button>
      </div>
      <div class="link-row">
        <div class="link-row-info">
          <span>✉️ Email + Password</span>
          <span class="link-status-badge not-connected" id="emailLinkBadge">अजोडलेले</span>
        </div>
        <button type="button" class="btn-link" id="linkEmailBtn">पासवर्ड जोडा</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL: Student ₹1 Paywall Modal with Direct GPay / PhonePe / Paytm UPI -->
<div class="modal" id="paywallModal">
  <div class="modal-card paywall-card" style="max-width:480px">
    <button class="close-modal-btn" id="closePaywallBtn">&times;</button>
    <div class="paywall-header">
      <div class="trophy-badge">🏆</div>
      <h2>मराठी व्याकरणवीर बना — सर्व २१ धडे अनलॉक करा!</h2>
      <p class="paywall-sub">इयत्ता ८वी ते १०वीच्या विद्यार्थ्यांसाठी संपूर्ण मराठी व्याकरणाचा आनंददायी खेळ</p>
    </div>
    <div class="paywall-price-banner">
      <div class="price-val">फक्त ₹१ <span class="tax-tag">विशेष ऑफर (१ वर्ष ॲक्सेस)</span></div>
      <div class="validity-val">⏱️ १ वर्ष (३६५ दिवस) सर्व २१ धडे अमर्याद वैधता</div>
    </div>

    <!-- Student details form -->
    <div class="paywall-form" style="margin-bottom:12px">
      <div class="form-row">
        <label>विद्यार्थ्याचे नाव</label>
        <input type="text" id="payStudentName" placeholder="उदा. सई, अथर्व" />
      </div>
      <div class="form-row">
        <label>मोबाईल / WhatsApp नंबर</label>
        <input type="tel" id="payStudentPhone" placeholder="उदा. 98XXXXXXXX" />
      </div>
    </div>

    <!-- 1-Tap Direct UPI App Buttons -->
    <div style="font-size:13px;font-weight:800;color:var(--ink);margin:8px 0 4px">
      📲 तुमच्या आवडीच्या ॲपवरून थेट ₹१ भरा (Direct 1-Tap UPI):
    </div>
    <div class="upi-app-grid">
      <button type="button" class="upi-app-btn upi-btn-gpay" id="payGpayBtn">
        <span>GPay (Google Pay)</span>
      </button>
      <button type="button" class="upi-app-btn upi-btn-phonepe" id="payPhonepeBtn">
        <span>🟣 PhonePe</span>
      </button>
      <button type="button" class="upi-app-btn upi-btn-paytm" id="payPaytmBtn">
        <span>🔵 Paytm</span>
      </button>
      <button type="button" class="upi-app-btn upi-btn-any" id="payAnyUpiBtn">
        <span>⚡ इतर कोणतेही UPI</span>
      </button>
    </div>

    <!-- Dynamic UPI QR Code for Desktop / Tablet -->
    <div class="upi-qr-card">
      <div style="font-size:12px;font-weight:800;color:var(--green)">
        📷 किंवा मोबाईलवरून खालील QR कोड स्कॅन करून ₹१ भरा:
      </div>
      <img id="upiDynamicQrImg" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi%3A%2F%2Fpay%3Fpa%3Dtsraut2001-1%40oksbi%26pn%3DTushar%2520Raut%26am%3D1%26cu%3DINR%26tn%3DMarathi%2520Vyakaranveer" alt="UPI QR Code" />
      <div style="font-size:12px;color:var(--muted);margin-top:4px">
        UPI ID: <code id="displayUpiId" style="font-weight:800;background:var(--cream);padding:2px 6px;border-radius:4px">tsraut2001-1@oksbi</code>
        <button type="button" class="copy-btn" id="copyUpiTextBtn" style="margin-left:6px">📋 कॉपी</button>
      </div>
    </div>

    <!-- Instant Activation Form -->
    <div id="paymentVerifySection" style="background:#f4f9f4;border:1px solid #bce2c7;border-radius:14px;padding:14px;text-align:left">
      <div style="font-size:13px;font-weight:800;color:var(--green);margin-bottom:4px">
        ✅ पेमेंट झाल्यावर ॲक्सेस सक्रिय करा:
      </div>
      <p style="font-size:12px;color:var(--muted);margin:0 0 10px">
        GPay / PhonePe वर पेमेंट झाल्यावर मिळालेला १२ अंकी UTR नंबर किंवा तुमचा मोबाईल नंबर खाली टाका:
      </p>
      <div style="display:flex;gap:8px">
        <input type="text" id="verifyPaymentIdInput" placeholder="उदा. 428192849201 किंवा मोबाईल नंबर" style="flex:1;padding:10px 12px;border:1px solid var(--line);border-radius:10px;font-size:13px" />
        <button type="button" class="primary" id="activateAccessBtn" style="padding:10px 14px;font-size:13px;white-space:nowrap;background:var(--green);color:#fff">
          ⚡ १ वर्ष ॲक्सेस सुरू करा
        </button>
      </div>
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
  fee: 1,
  validityDays: 365,
  freeLessonsCount: 3,
  razorpayKey: '',
  razorpayLink: 'https://rzp.io/rzp/3HZZGlT',
  upiId: '9552489452@ybl',
  gpayUpiId: 'tsraut2001-1@oksbi',
  phonepeUpiId: '9552489452@ybl',
  paytmUpiId: '9552489452@ptsbi',
  payeeName: 'Tushar Raut',
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
  apiKey: "AIzaSyASLw7k09jJ1P1wj0_xP28ORMvMhK1URIs",
  authDomain: "marathi-vyakaram.firebaseapp.com",
  projectId: "marathi-vyakaram",
  storageBucket: "marathi-vyakaram.firebasestorage.app",
  messagingSenderId: "474455969619",
  appId: "1:474455969619:web:93258093cc2db904829ba6",
  measurementId: "G-J6GLG8Q152"
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
let studentDocUnsubscribe = null;

// Auth State Listener (Requirement A.5: Do NOT silently create anonymous accounts)
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentAuthUser = user;
    if (user.isAnonymous) {
      console.log('👤 Guest Student (Anonymous):', user.uid);
      updateAuthUI(false);
    } else {
      console.log('👤 Student Authenticated:', user.uid, user.email);
      updateAuthUI(true);
      listenToStudentDoc(user.uid);
    }
  } else {
    currentAuthUser = null;
    currentEntitlement = null;
    userPlan = null;
    if (studentDocUnsubscribe) { studentDocUnsubscribe(); studentDocUnsubscribe = null; }
    if (entitlementUnsubscribe) { entitlementUnsubscribe(); entitlementUnsubscribe = null; }
    updateAuthUI(false);
    renderMap();
    updateSubscriptionUI();
  }
});

function listenToStudentDoc(uid) {
  if (studentDocUnsubscribe) studentDocUnsubscribe();
  studentDocUnsubscribe = db.collection('users').doc(uid).onSnapshot((doc) => {
    if (doc.exists) {
      const data = doc.data();
      // 1. Restore Profile info across devices (Requirement B.4 & C)
      if (data.name) {
        state.name = data.name;
        localStorage.setItem('vv_name', data.name);
      }
      if (data.grade) {
        state.grade = data.grade;
      }

      // 2. Restore Progress across devices (Requirement B.4)
      if (data.progress && typeof data.progress === 'object') {
        let changed = false;
        for (const unitId in data.progress) {
          const remoteP = data.progress[unitId];
          if (!progress[unitId]) {
            progress[unitId] = remoteP;
            changed = true;
          } else {
            if ((remoteP.bestStars || 0) > (progress[unitId].bestStars || 0)) {
              progress[unitId].bestStars = remoteP.bestStars;
              changed = true;
            }
            if ((remoteP.bestScore || 0) > (progress[unitId].bestScore || 0)) {
              progress[unitId].bestScore = remoteP.bestScore;
              changed = true;
            }
            if (remoteP.completed) {
              progress[unitId].completed = true;
              changed = true;
            }
          }
        }
        if (changed) {
          localStorage.setItem('vv_progress', JSON.stringify(progress));
          refreshStats();
        }
      }

      // 3. Restore Entitlement across devices (Requirement B.4 & D.6)
      if (data.isPaid) {
        let isExpired = false;
        if (data.expiresAt) {
          const expMs = data.expiresAt.toMillis ? data.expiresAt.toMillis() : new Date(data.expiresAt).getTime();
          if (expMs <= Date.now()) isExpired = true;
        }
        if (!isExpired) {
          currentEntitlement = data;
          userPlan = {
            isPaid: true,
            plan: data.plan || 'annual_21',
            planName: data.planName || '१ वर्ष संपूर्ण ॲक्सेस',
            expiresAt: data.expiresAt ? (data.expiresAt.toMillis ? data.expiresAt.toMillis() : new Date(data.expiresAt).getTime()) : (Date.now() + 365*24*60*60*1000),
            paymentId: data.paymentId || '',
            orderId: data.orderId || ''
          };
          console.log('🎉 Verified 365-day Entitlement active for student:', uid);
        } else {
          currentEntitlement = null;
          userPlan = null;
        }
      } else {
        currentEntitlement = null;
        userPlan = null;
      }
    } else {
      // Initialize profile document in Firestore
      db.collection('users').doc(uid).set({
        name: auth.currentUser.displayName || state.name || 'मराठी विद्यार्थी',
        email: auth.currentUser.email || '',
        grade: state.grade || '8',
        phone: '',
        school: '',
        parentContact: '',
        photoURL: auth.currentUser.photoURL || '',
        progress: progress,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(e => console.warn('Init profile error:', e));
    }
    updateAuthUI(true);
    renderMap();
    updateSubscriptionUI();
  }, (err) => {
    console.warn('Student doc listener error:', err);
  });
}

function updateAuthUI(isLoggedIn) {
  const authTopBtn = el('authTopBtn');
  const studentUserChip = el('studentUserChip');
  const profileBtn = el('profileBtn');
  const logoutTopBtn = el('logoutTopBtn');
  const playerName = el('playerName');
  const userAvatarTiny = el('userAvatarTiny');

  if (isLoggedIn && currentAuthUser && !currentAuthUser.isAnonymous) {
    if (authTopBtn) authTopBtn.style.display = 'none';
    if (studentUserChip) studentUserChip.style.display = 'inline-flex';
    if (profileBtn) profileBtn.style.display = 'inline-block';
    if (logoutTopBtn) logoutTopBtn.style.display = 'inline-block';
    const displayName = state.name || currentAuthUser.displayName || currentAuthUser.email || 'विद्यार्थी';
    if (playerName) playerName.textContent = displayName;
    if (userAvatarTiny) {
      if (currentAuthUser.photoURL) {
        userAvatarTiny.innerHTML = '<img src="' + currentAuthUser.photoURL + '" style="width:24px;height:24px;border-radius:50%;object-fit:cover" alt="avatar"/>';
      } else {
        userAvatarTiny.textContent = displayName.charAt(0) || '👤';
      }
    }
  } else {
    if (authTopBtn) authTopBtn.style.display = 'inline-block';
    if (studentUserChip) studentUserChip.style.display = 'none';
    if (profileBtn) profileBtn.style.display = 'none';
    if (logoutTopBtn) logoutTopBtn.style.display = 'none';
    if (playerName) playerName.textContent = state.name || 'पाहुणा खेळाडू';
  }
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
  // Cross-device progress sync to Firestore users/{uid} (Requirement B.4)
  if (currentAuthUser && !currentAuthUser.isAnonymous) {
    db.collection('users').doc(currentAuthUser.uid).update({
      progress: progress,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => {
      console.warn('Firestore progress sync warning:', err);
    });
  }
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

  // Lessons 0, 1, 2 are 100% free demos.
  // Lessons 3-20 require permanent student login & paid membership (Requirement A.5 & D.1)
  if (index >= 3) {
    if (!currentAuthUser || currentAuthUser.isAnonymous) {
      openAuthModal();
      toast('🔒 हा धडा उघडण्यासाठी कृपया आधी विद्यार्थी लॉगिन किंवा नोंदणी करा.');
      return;
    }
    if (!hasActiveAccess()) {
      openPaywallModal(index);
      return;
    }
  }

  // Ensure complete lesson and questions are loaded
  if (!u.questions || !u.questions.length || !u.lesson) {
    const full = DEFAULT_UNITS[index];
    if (full && full.lesson && full.questions) {
      u.lesson = full.lesson;
      u.questions = full.questions;
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
  if (hasActiveAccess()) {
    toast('👑 आपले १ वर्षाचे सदस्यत्व सक्रिय आहे! सर्व २१ धडे उपलब्ध आहेत.');
    return;
  }
  if (!currentAuthUser || currentAuthUser.isAnonymous) {
    openAuthModal();
    toast('🔒 सर्व २१ धडे अनलॉक करण्यासाठी कृपया आधी विद्यार्थी खाते तयार करा किंवा लॉगिन करा.');
    return;
  }
  el('payStudentName').value = state.name || currentAuthUser.displayName || '';
  el('paywallModal').classList.add('show');
}

function openDirectUpi(upiId, appName) {
  if (!currentAuthUser || currentAuthUser.isAnonymous) {
    el('paywallModal').classList.remove('show');
    openAuthModal();
    toast('🔒 पेमेंट करण्यापूर्वी कृपया आधी विद्यार्थी खाते तयार करा किंवा लॉगिन करा.');
    return;
  }
  if (hasActiveAccess()) {
    toast('👑 आपले १ वर्षाचे सदस्यत्व आधीपासूनच सक्रिय आहे!');
    el('paywallModal').classList.remove('show');
    return;
  }

  const name = el('payStudentName').value.trim() || state.name || currentAuthUser.displayName || 'विद्यार्थी';
  const phone = el('payStudentPhone').value.trim();
  if (name && !state.name) {
    state.name = name;
    localStorage.setItem('vv_name', name);
    refreshStats();
  }

  const targetUpiId = upiId || branding.upiId || '9552489452@ybl';
  const payee = branding.payeeName || 'Tushar Raut';
  const amount = branding.fee || 1;
  const note = 'Marathi Vyakaranveer 1 Year';

  const upiUrl = 'upi://pay?pa=' + encodeURIComponent(targetUpiId) + '&pn=' + encodeURIComponent(payee) + '&am=' + amount + '&cu=INR&tn=' + encodeURIComponent(note);

  // Trigger native UPI application on mobile
  window.location.href = upiUrl;

  toast('📲 ' + (appName || 'UPI') + ' ॲप उघडले आहे. ₹१ भरल्यानंतर UTR नंबर येथे टाका.');

  const input = el('verifyPaymentIdInput');
  if (input) {
    if (phone) input.placeholder = 'उदा. ' + phone + ' किंवा १२-अंकी UTR';
    input.focus();
  }
}

async function handlePayNow() {
  // 1. Require authentication before payment
  if (!currentAuthUser || currentAuthUser.isAnonymous) {
    el('paywallModal').classList.remove('show');
    openAuthModal();
    toast('🔒 पेमेंट करण्यासाठी कृपया आधी आपले विद्यार्थी खाते तयार करा किंवा लॉगिन करा.');
    return;
  }

  // 2. Prevent duplicate payments when valid membership exists
  if (hasActiveAccess()) {
    toast('👑 आपले १ वर्षाचे सदस्यत्व आधीपासूनच सक्रिय आहे! पुन्हा पेमेंट करण्याची आवश्यकता नाही.');
    el('paywallModal').classList.remove('show');
    return;
  }

  const name = el('payStudentName').value.trim() || state.name || currentAuthUser.displayName || 'मराठी विद्यार्थी';
  const phone = el('payStudentPhone').value.trim();

  if (name && !state.name) {
    state.name = name;
    localStorage.setItem('vv_name', name);
    refreshStats();
  }

  // Open the Razorpay live payment link
  const link = branding.razorpayLink || 'https://rzp.io/rzp/3HZZGlT';
  window.open(link, '_blank');
  toast('💳 Razorpay पेमेंट पेज उघडले आहे. पेमेंट पूर्ण झाल्यावर खाली Payment ID टाकून ॲक्सेस सुरू करा.');

  const input = el('verifyPaymentIdInput');
  if (input) {
    if (phone) input.placeholder = 'उदा. ' + phone + ' किंवा pay_...';
    input.focus();
  }
}

async function handleActivateAccess() {
  if (!currentAuthUser || currentAuthUser.isAnonymous) {
    el('paywallModal').classList.remove('show');
    openAuthModal();
    toast('🔒 कृपया आधी आपले विद्यार्थी खाते तयार करा किंवा लॉगिन करा.');
    return;
  }

  const input = el('verifyPaymentIdInput');
  const paymentId = input ? input.value.trim() : '';
  const name = el('payStudentName').value.trim() || state.name || currentAuthUser.displayName || 'मराठी विद्यार्थी';
  const phone = el('payStudentPhone').value.trim();

  if (!paymentId && !phone) {
    toast('कृपया Razorpay Payment ID (उदा. pay_...) किंवा मोबाईल नंबर टाका.');
    if (input) input.focus();
    return;
  }

  const activateBtn = el('activateAccessBtn');
  const originalText = activateBtn.innerHTML;
  activateBtn.disabled = true;
  activateBtn.innerHTML = '⏳ ॲक्सेस सुरू होत आहे...';

  try {
    const finalPaymentId = paymentId || ('pay_rzp_' + (phone || currentAuthUser.uid.slice(0, 8)));
    const oneYearMs = Date.now() + (365 * 24 * 60 * 60 * 1000);
    const expDate = new Date(oneYearMs);

    // 1. Save directly to Cloud Firestore users/{uid}
    await firebase.firestore().collection('users').doc(currentAuthUser.uid).set({
      isPaid: true,
      expiresAt: firebase.firestore.Timestamp.fromDate(expDate),
      paidAt: firebase.firestore.FieldValue.serverTimestamp(),
      paymentId: finalPaymentId,
      amount: branding.fee || 1,
      plan: 'annual_1',
      planName: '१ वर्ष संपूर्ण ॲक्सेस (२१ धडे)',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // 2. Audit log to payment_submissions
    try {
      await firebase.firestore().collection('payment_submissions').add({
        uid: currentAuthUser.uid,
        name: name,
        phone: phone || '',
        email: currentAuthUser.email || '',
        paymentId: finalPaymentId,
        amount: branding.fee || 1,
        submittedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (auditErr) {
      console.warn('Submission audit log non-fatal error:', auditErr.message);
    }

    // 3. Update local state & UI
    currentEntitlement = {
      isPaid: true,
      expiresAt: expDate
    };
    state.isPaid = true;
    state.subExpiry = oneYearMs;
    activateSubscription(name, phone, finalPaymentId);
    toast('🎉 अभिनंदन! आपले १ वर्षाचे सदस्यत्व सक्रिय झाले आहे! सर्व २१ धडे उपलब्ध आहेत.');
  } catch (err) {
    console.error('Activation error:', err);
    toast('❌ ॲक्सेस सक्रिय करताना अडचण: ' + err.message);
  } finally {
    activateBtn.disabled = false;
    activateBtn.innerHTML = originalText;
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

// -------------------------------------------------------------
// Student Authentication & Profile Management Functions
// -------------------------------------------------------------
function showAuthAlert(msg, type = 'error') {
  const box = el('authAlertBox');
  if (!box) return;
  box.className = 'auth-alert-box ' + type;
  const icon = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : '❌');
  box.innerHTML = '<span style="font-size:16px">' + icon + '</span><span>' + msg + '</span>';
  box.style.display = 'flex';
}

function clearAuthAlert() {
  const box = el('authAlertBox');
  if (box) {
    box.style.display = 'none';
    box.innerHTML = '';
  }
}

function openAuthModal(defaultTab = 'login') {
  clearAuthAlert();
  showAuthTab(defaultTab);
  el('authModal').classList.add('show');
}

function closeAuthModal() {
  clearAuthAlert();
  el('authModal').classList.remove('show');
  el('forgotPasswordSection').style.display = 'none';
}

function showAuthTab(tab) {
  clearAuthAlert();
  if (tab === 'login') {
    el('authTabLoginBtn').classList.add('active');
    el('authTabRegisterBtn').classList.remove('active');
    el('studentLoginForm').style.display = 'block';
    el('studentRegisterForm').style.display = 'none';
  } else {
    el('authTabLoginBtn').classList.remove('active');
    el('authTabRegisterBtn').classList.add('active');
    el('studentLoginForm').style.display = 'none';
    el('studentRegisterForm').style.display = 'block';
  }
  el('forgotPasswordSection').style.display = 'none';
}

function openProfileModal() {
  if (!currentAuthUser || currentAuthUser.isAnonymous) {
    openAuthModal();
    return;
  }
  populateProfileModal();
  el('profileModal').classList.add('show');
}

function closeProfileModal() {
  el('profileModal').classList.remove('show');
}

async function populateProfileModal() {
  if (!currentAuthUser || currentAuthUser.isAnonymous) return;

  el('profileUidDisplay').textContent = currentAuthUser.uid;
  el('profEmailDisplay').value = currentAuthUser.email || '(Google / Anonymous)';

  if (currentAuthUser.email && !currentAuthUser.emailVerified) {
    el('profileEmailVerifyBanner').style.display = 'flex';
  } else {
    el('profileEmailVerifyBanner').style.display = 'none';
  }

  try {
    const snap = await db.collection('users').doc(currentAuthUser.uid).get();
    const data = snap.exists ? snap.data() : {};

    el('profNameInput').value = data.name || currentAuthUser.displayName || state.name || '';
    el('profPhoneInput').value = data.phone || '';
    el('profGradeInput').value = data.grade || state.grade || '8';
    el('profSchoolInput').value = data.school || '';
    el('profParentContactInput').value = data.parentContact || '';
    el('profPhotoUrlInput').value = data.photoURL || currentAuthUser.photoURL || '';

    const avatar = el('profileAvatar');
    if (data.photoURL || currentAuthUser.photoURL) {
      avatar.innerHTML = '<img src="' + (data.photoURL || currentAuthUser.photoURL) + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover" alt="avatar"/>';
    } else {
      const initial = (data.name || currentAuthUser.displayName || 'वि').charAt(0);
      avatar.textContent = initial;
    }

    const isPaid = hasActiveAccess();
    const badge = el('profileMembershipBadge');
    const statusText = el('profStatusText');
    const expiryText = el('profExpiryText');
    const paymentIdText = el('profPaymentIdText');

    if (isPaid) {
      badge.className = 'profile-membership-pill membership-active';
      badge.textContent = '👑 १ वर्ष सदस्यत्व सक्रिय';
      statusText.innerHTML = '<span style="color:#1e6454;font-weight:800">✅ सक्रिय (Active 365 Days)</span>';

      let expDateStr = '१ वर्ष';
      if (currentEntitlement && currentEntitlement.expiresAt) {
        const expMs = currentEntitlement.expiresAt.toMillis ? currentEntitlement.expiresAt.toMillis() : new Date(currentEntitlement.expiresAt).getTime();
        expDateStr = new Date(expMs).toLocaleDateString('mr-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      expiryText.textContent = expDateStr;
      paymentIdText.textContent = (currentEntitlement && currentEntitlement.paymentId) ? currentEntitlement.paymentId : 'रॅझरपे व्हेरिफाइड';
    } else {
      badge.className = 'profile-membership-pill membership-free';
      badge.textContent = '🌱 मोफत आवृत्ती (३ धडे)';
      statusText.textContent = 'मोफत डेमो आवृत्ती';
      expiryText.textContent = 'अमर्याद (फक्त ३ धडे)';
      paymentIdText.textContent = '—';
    }

    // Linked providers (Requirement B.5)
    const providers = (currentAuthUser.providerData || []).map(p => p.providerId);
    const googleBadge = el('googleLinkBadge');
    const linkGoogleBtn = el('linkGoogleBtn');
    if (providers.includes('google.com')) {
      googleBadge.className = 'link-status-badge connected';
      googleBadge.textContent = 'जोडलेले ✓';
      linkGoogleBtn.style.display = 'none';
    } else {
      googleBadge.className = 'link-status-badge not-connected';
      googleBadge.textContent = 'अजोडलेले';
      linkGoogleBtn.style.display = 'inline-block';
    }

    const emailBadge = el('emailLinkBadge');
    const linkEmailBtn = el('linkEmailBtn');
    if (providers.includes('password')) {
      emailBadge.className = 'link-status-badge connected';
      emailBadge.textContent = 'जोडलेले ✓';
      linkEmailBtn.style.display = 'none';
    } else {
      emailBadge.className = 'link-status-badge not-connected';
      emailBadge.textContent = 'अजोडलेले';
      linkEmailBtn.style.display = 'inline-block';
    }
  } catch (err) {
    console.warn('Load profile modal error:', err);
  }
}

// Google Sign-In with safe anonymous upgrade (Requirement B.5 & B.6)
async function handleGoogleSignIn() {
  clearAuthAlert();
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    if (currentAuthUser && currentAuthUser.isAnonymous) {
      try {
        await currentAuthUser.linkWithPopup(provider);
        toast('🎉 Google खात्यासह विद्यार्थी ओळख जोडली!');
        closeAuthModal();
        return;
      } catch (linkErr) {
        if (linkErr.code === 'auth/credential-already-in-use') {
          await auth.signInWithPopup(provider);
          toast('🎉 स्वागत आहे! आपले जुने खाते लोड झाले.');
          closeAuthModal();
          return;
        }
        throw linkErr;
      }
    } else {
      await auth.signInWithPopup(provider);
      toast('🎉 Google द्वारे यशस्वीरित्या लॉगिन झाले!');
      closeAuthModal();
    }
  } catch (err) {
    console.error('Google sign-in error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      showAuthAlert('Google लॉगिन विंडो बंद करण्यात आली.', 'warning');
      return;
    }
    if (err.code === 'auth/popup-blocked') {
      showAuthAlert('ब्राउझरने Google पॉपअप ब्लॉक केले. कृपया पॉपअपला परवानगी द्या किंवा ईमेलने साइन इन करा.', 'error');
      return;
    }
    showAuthAlert('❌ Google लॉगिन अयशस्वी: ' + (err.message || 'Error'), 'error');
    toast('❌ Google लॉगिन अयशस्वी');
  }
}

// Email + Password Registration
async function handleEmailRegister(name, grade, email, password, confirmPassword) {
  clearAuthAlert();
  if (!name) {
    showAuthAlert('कृपया विद्यार्थ्याचे संपूर्ण नाव टाका.', 'error');
    toast('कृपया नाव टाका.');
    return;
  }
  if (!email) {
    showAuthAlert('कृपया ईमेल पत्ता टाका.', 'error');
    toast('कृपया ईमेल टाका.');
    return;
  }
  if (password !== confirmPassword) {
    showAuthAlert('दोन्ही पासवर्ड जुळत नाहीत. कृपया पुन्हा तपासा.', 'error');
    toast('❌ दोन्ही पासवर्ड जुळत नाहीत!');
    return;
  }
  if (password.length < 6) {
    showAuthAlert('पासवर्ड किमान ६ अक्षरांचा असावा.', 'error');
    toast('❌ पासवर्ड किमान ६ अक्षरांचा असावा.');
    return;
  }

  const regBtn = el('regSubmitBtn');
  const originalText = regBtn.innerHTML;
  regBtn.disabled = true;
  regBtn.innerHTML = '⏳ खाते तयार करत आहे...';

  try {
    if (currentAuthUser && currentAuthUser.isAnonymous) {
      const cred = firebase.auth.EmailAuthProvider.credential(email, password);
      try {
        await currentAuthUser.linkWithCredential(cred);
        await currentAuthUser.updateProfile({ displayName: name });
        try { await currentAuthUser.sendEmailVerification(); } catch(e){}
        await db.collection('users').doc(currentAuthUser.uid).set({
          name: name,
          email: email,
          grade: grade,
          phone: '',
          school: '',
          parentContact: '',
          photoURL: '',
          progress: progress,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        showAuthAlert('🎉 नोंदणी पूर्ण! खाते तयार झाले.', 'success');
        toast('🎉 नोंदणी पूर्ण! आम्ही पडताळणी ईमेल पाठवला आहे.');
        setTimeout(closeAuthModal, 600);
        return;
      } catch (linkErr) {
        if (linkErr.code === 'auth/email-already-in-use' || linkErr.code === 'auth/credential-already-in-use') {
          showAuthTab('login');
          el('loginEmail').value = email;
          showAuthAlert('⚠️ हा ईमेल आधीपासून नोंदणीकृत आहे. कृपया आपला पासवर्ड टाकून लॉगिन करा.', 'warning');
          toast('⚠️ हा ईमेल आधीपासून नोंदणीकृत आहे.');
          return;
        }
        throw linkErr;
      }
    } else {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      try { await cred.user.sendEmailVerification(); } catch(e){}
      await db.collection('users').doc(cred.user.uid).set({
        name: name,
        email: email,
        grade: grade,
        phone: '',
        school: '',
        parentContact: '',
        photoURL: '',
        progress: progress,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showAuthAlert('🎉 नोंदणी पूर्ण! खाते तयार झाले.', 'success');
      toast('🎉 नोंदणी पूर्ण! आम्ही पडताळणी ईमेल पाठवला आहे.');
      setTimeout(closeAuthModal, 600);
    }
  } catch (err) {
    console.error('Registration error:', err);
    let msg = err.message || 'नोंदणी अयशस्वी.';
    if (err.code === 'auth/email-already-in-use') {
      showAuthTab('login');
      el('loginEmail').value = email;
      showAuthAlert('⚠️ हा ईमेल आधीपासून नोंदणीकृत आहे. कृपया लॉगिन करा.', 'warning');
      toast('⚠️ हा ईमेल आधीपासून नोंदणीकृत आहे.');
      return;
    } else if (err.code === 'auth/weak-password') {
      msg = 'पासवर्ड अधिक सुरक्षित असावा (किमान ६ अक्षरे).';
    } else if (err.code === 'auth/invalid-email') {
      msg = 'कृपया अचूक व वैध ईमेल पत्ता टाका.';
    }
    showAuthAlert('❌ नोंदणी त्रुटी: ' + msg, 'error');
    toast('❌ नोंदणी त्रुटी: ' + msg);
  } finally {
    regBtn.disabled = false;
    regBtn.innerHTML = originalText;
  }
}

// Email + Password Login
async function handleEmailLogin(email, password) {
  clearAuthAlert();
  if (!email || !password) {
    showAuthAlert('कृपया ईमेल आणि पासवर्ड दोन्ही भरा.', 'error');
    toast('कृपया ईमेल आणि पासवर्ड भरा.');
    return;
  }

  const loginBtn = el('loginSubmitBtn');
  const originalText = loginBtn.innerHTML;
  loginBtn.disabled = true;
  loginBtn.innerHTML = '⏳ लॉगिन होत आहे...';

  try {
    await auth.signInWithEmailAndPassword(email, password);
    showAuthAlert('🎉 स्वागत आहे! यशस्वीरित्या लॉगिन झाले.', 'success');
    toast('🎉 स्वागत आहे! यशस्वीरित्या लॉगिन झाले.');
    setTimeout(closeAuthModal, 500);
  } catch (err) {
    console.error('Login error:', err);
    let msg = err.message || 'लॉगिन अयशस्वी';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      msg = 'ईमेल किंवा पासवर्ड चुकीचा आहे. कृपया तपासा.';
    } else if (err.code === 'auth/too-many-requests') {
      msg = 'अनेक अयशस्वी प्रयत्नांमुळे खाते तात्पुरते थांबवले आहे. कृपया थोड्या वेळाने प्रयत्न करा किंवा पासवर्ड रीसेट करा.';
    }
    showAuthAlert('❌ ' + msg, 'error');
    toast('❌ ' + msg);
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = originalText;
  }
}

// Forgot Password
async function handleForgotPassword(email) {
  clearAuthAlert();
  if (!email) {
    showAuthAlert('कृपया पासवर्ड रीसेट करण्यासाठी आपला ईमेल टाका.', 'error');
    toast('कृपया ईमेल पत्ता टाका.');
    return;
  }
  try {
    await auth.sendPasswordResetEmail(email);
    showAuthAlert('📧 पासवर्ड रीसेट लिंक आपल्या ईमेलवर पाठवली आहे!', 'success');
    toast('📧 पासवर्ड रीसेट ईमेल पाठवला!');
    el('forgotPasswordSection').style.display = 'none';
  } catch (err) {
    console.error('Forgot password error:', err);
    showAuthAlert('❌ त्रुटी: ' + (err.message || 'Error'), 'error');
    toast('❌ ' + (err.message || 'Error'));
  }
}

// Student Profile Save (Requirement C)
async function handleSaveProfile(e) {
  if (e) e.preventDefault();
  if (!currentAuthUser || currentAuthUser.isAnonymous) return;

  const name = el('profNameInput').value.trim();
  const phone = el('profPhoneInput').value.trim();
  const grade = el('profGradeInput').value;
  const school = el('profSchoolInput').value.trim();
  const parentContact = el('profParentContactInput').value.trim();
  const photoURL = el('profPhotoUrlInput').value.trim();

  if (!name) {
    toast('कृपया विद्यार्थ्याचे नाव टाका.');
    return;
  }

  const saveBtn = el('saveProfileBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = '⏳ सेव्ह करत आहे...';

  try {
    await db.collection('users').doc(currentAuthUser.uid).update({
      name: name,
      phone: phone,
      grade: grade,
      school: school,
      parentContact: parentContact,
      photoURL: photoURL,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    state.name = name;
    state.grade = grade;
    localStorage.setItem('vv_name', name);

    await currentAuthUser.updateProfile({
      displayName: name,
      ...(photoURL ? { photoURL: photoURL } : {})
    });

    toast('✅ प्रोफाइल यशस्वीरित्या सेव्ह केले!');
    updateAuthUI(true);
    refreshStats();
    closeProfileModal();
  } catch (err) {
    console.error('Save profile error:', err);
    toast('❌ सेव्ह करताना त्रुटी: ' + (err.message || 'Error'));
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 प्रोफाइल सेव्ह करा';
  }
}

// Email Change with Verified Flow (Requirement C)
async function handleChangeEmail() {
  if (!currentAuthUser || currentAuthUser.isAnonymous) return;
  const newEmail = prompt('नवीन ईमेल पत्ता टाका:');
  if (!newEmail || !newEmail.includes('@')) return;

  try {
    if (typeof currentAuthUser.verifyBeforeUpdateEmail === 'function') {
      await currentAuthUser.verifyBeforeUpdateEmail(newEmail);
      toast('📧 नवीन ईमेलवर पडताळणी लिंक पाठवली आहे. पडताळणीनंतर ईमेल अपडेट होईल.');
    } else {
      await currentAuthUser.updateEmail(newEmail);
      await currentAuthUser.sendEmailVerification();
      toast('📧 ईमेल अपडेट झाला! पडताळणी लिंक पाठवली गेली आहे.');
    }
  } catch (err) {
    console.error('Email update error:', err);
    if (err.code === 'auth/requires-recent-login') {
      toast('❌ सुरक्षेसाठी कृपया पुन्हा लॉगिन करून ईमेल बदला.');
    } else {
      toast('❌ त्रुटी: ' + (err.message || 'Error'));
    }
  }
}

// Student Logout
async function handleStudentLogout() {
  if (confirm('तुम्हाला खरोखर बाहेर पडायचे (Logout) आहे का?')) {
    try {
      if (studentDocUnsubscribe) { studentDocUnsubscribe(); studentDocUnsubscribe = null; }
      if (entitlementUnsubscribe) { entitlementUnsubscribe(); entitlementUnsubscribe = null; }
      await auth.signOut();
      currentAuthUser = null;
      currentEntitlement = null;
      userPlan = null;
      closeProfileModal();
      updateAuthUI(false);
      renderMap();
      updateSubscriptionUI();
      toast('आपण यशस्वीरित्या बाहेर पडलात.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
}

// Account Linking (Requirement B.5)
async function handleLinkGoogle() {
  if (!currentAuthUser || currentAuthUser.isAnonymous) return;
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await currentAuthUser.linkWithPopup(provider);
    toast('✅ Google खाते यशस्वी जोडले!');
    populateProfileModal();
  } catch (err) {
    if (err.code === 'auth/credential-already-in-use') {
      toast('❌ हे Google खाते आधीपासूनच दुसऱ्या खात्याशी जोडलेले आहे.');
    } else {
      toast('❌ त्रुटी: ' + (err.message || 'Error'));
    }
  }
}

async function handleLinkEmailPassword() {
  if (!currentAuthUser || currentAuthUser.isAnonymous) return;
  const pwd = prompt('या खात्यासाठी पासवर्ड टाका (किमान ६ अक्षरे):');
  if (!pwd) return;
  if (pwd.length < 6) {
    toast('पासवर्ड किमान ६ अक्षरांचा असावा.');
    return;
  }
  const email = currentAuthUser.email || prompt('आपला ईमेल पत्ता टाका:');
  if (!email) return;

  const cred = firebase.auth.EmailAuthProvider.credential(email, pwd);
  try {
    await currentAuthUser.linkWithCredential(cred);
    toast('✅ पासवर्ड यशस्वी जोडला गेला!');
    populateProfileModal();
  } catch (err) {
    if (err.code === 'auth/credential-already-in-use' || err.code === 'auth/email-already-in-use') {
      toast('❌ हा ईमेल आधीपासूनच दुसऱ्या खात्याशी जोडलेला आहे.');
    } else {
      toast('❌ त्रुटी: ' + (err.message || 'Error'));
    }
  }
}

// Event Listeners Initialization
function initEventListeners() {
  el('startBtn').addEventListener('click', () => {
    playSound('click');
    document.querySelector('#unitMap').scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Student Auth Modal Triggers
  el('authTopBtn').addEventListener('click', () => {
    playSound('click');
    openAuthModal();
  });
  el('closeAuthModalBtn').addEventListener('click', closeAuthModal);

  el('authTabLoginBtn').addEventListener('click', () => showAuthTab('login'));
  el('authTabRegisterBtn').addEventListener('click', () => showAuthTab('register'));

  el('googleSignInBtn').addEventListener('click', handleGoogleSignIn);

  el('studentLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    handleEmailLogin(el('loginEmail').value.trim(), el('loginPassword').value);
  });

  el('studentRegisterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    handleEmailRegister(
      el('regName').value.trim(),
      el('regGrade').value,
      el('regEmail').value.trim(),
      el('regPassword').value,
      el('regConfirmPassword').value
    );
  });

  el('forgotPasswordLink').addEventListener('click', () => {
    el('forgotPasswordSection').style.display = 'block';
  });

  el('sendResetBtn').addEventListener('click', () => {
    handleForgotPassword(el('forgotEmail').value.trim());
  });

  el('cancelResetBtn').addEventListener('click', () => {
    el('forgotPasswordSection').style.display = 'none';
  });

  // Student Profile Modal Triggers
  el('studentUserChip').addEventListener('click', () => {
    playSound('click');
    openProfileModal();
  });

  el('profileBtn').addEventListener('click', () => {
    playSound('click');
    openProfileModal();
  });

  el('closeProfileBtn').addEventListener('click', closeProfileModal);

  el('copyUidBtn').addEventListener('click', () => {
    if (currentAuthUser) {
      navigator.clipboard.writeText(currentAuthUser.uid).then(() => {
        toast('📋 विद्यार्थी आयडी कॉपी झाला: ' + currentAuthUser.uid);
      });
    }
  });

  el('profileSendVerifyBtn').addEventListener('click', async () => {
    if (currentAuthUser) {
      await currentAuthUser.sendEmailVerification();
      toast('📧 पडताळणी लिंक आपल्या ईमेलवर पुन्हा पाठवली!');
    }
  });

  el('studentProfileForm').addEventListener('submit', handleSaveProfile);
  el('changeEmailBtn').addEventListener('click', handleChangeEmail);

  el('logoutTopBtn').addEventListener('click', handleStudentLogout);
  el('logoutFromProfileBtn').addEventListener('click', handleStudentLogout);

  el('linkGoogleBtn').addEventListener('click', handleLinkGoogle);
  el('linkEmailBtn').addEventListener('click', handleLinkEmailPassword);

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

  if (el('payNowBtn')) el('payNowBtn').addEventListener('click', handlePayNow);
  if (el('payGpayBtn')) {
    el('payGpayBtn').addEventListener('click', () => openDirectUpi(branding.gpayUpiId || 'tsraut2001-1@oksbi', 'Google Pay'));
  }
  if (el('payPhonepeBtn')) {
    el('payPhonepeBtn').addEventListener('click', () => openDirectUpi(branding.phonepeUpiId || '9552489452@ybl', 'PhonePe'));
  }
  if (el('payPaytmBtn')) {
    el('payPaytmBtn').addEventListener('click', () => openDirectUpi(branding.paytmUpiId || '9552489452@ptsbi', 'Paytm'));
  }
  if (el('payAnyUpiBtn')) {
    el('payAnyUpiBtn').addEventListener('click', () => openDirectUpi(branding.upiId || '9552489452@ybl', 'UPI'));
  }
  if (el('copyUpiTextBtn')) {
    el('copyUpiTextBtn').addEventListener('click', () => {
      const upi = el('displayUpiId') ? el('displayUpiId').textContent.trim() : 'tsraut2001-1@oksbi';
      navigator.clipboard.writeText(upi).then(() => toast('UPI ID कॉपी झाला: ' + upi));
    });
  }
  if (el('activateAccessBtn')) {
    el('activateAccessBtn').addEventListener('click', handleActivateAccess);
  }

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
</script>
</body>
</html>
`;

fs.writeFileSync('./vyakaranveer-app/index.html', fullHtml);
console.log('Successfully generated production vyakaranveer-app/index.html');
console.log('File size:', fullHtml.length, 'bytes');

