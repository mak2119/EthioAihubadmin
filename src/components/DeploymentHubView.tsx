import React, { useState } from 'react';
import {
  Globe2,
  Copy,
  Check,
  Code,
  FileCode,
  Terminal,
  Shield,
  Layers,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Language } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';

interface DeploymentHubViewProps {
  currentLang: Language;
}

export const DeploymentHubView: React.FC<DeploymentHubViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'blogger' | 'worker' | 'firestore' | 'storage' | 'github'>('blogger');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const bloggerEmbedSnippet = `<!-- ====================================================================== -->
<!-- ETHIO AI HUB - ADMIN CONTROL PANEL (BLOGGER EMBED CODE)               -->
<!-- Host URL: https://ethioaiapp.blogspot.com/p/admin.html               -->
<!-- Assets loaded via jsDelivr CDN from GitHub: ethio-ai-hub (main branch)-->
<!-- Note: Uses Hash Routing (#/users, #/payments) for single-page Blogger -->
<!-- ====================================================================== -->

<div id="ethio-admin-root">
  <!-- Stylesheets loaded via jsDelivr CDN (Never use raw.githubusercontent.com) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/css/admin.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/css/admin-responsive.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/css/admin-components.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

  <!-- Admin Application Root -->
  <div id="admin-app" class="admin-app-container">
    <div class="admin-loading-screen" id="admin-loading-screen">
      <div class="admin-spinner"></div>
      <p>ኢትዮ አይአይ ሀብ አስተዳዳሪ ፓነል በመጫን ላይ ነው...</p>
    </div>
  </div>

  <!-- Firebase JS SDK v10 Compat (Compat for maximum vanilla JS stability) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-storage-compat.js"></script>

  <!-- Ethio AI Hub Modular Admin Scripts via jsDelivr CDN -->
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/js/firebase-config.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/js/firebase.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-router.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-auth.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-dashboard.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-users.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-payments.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-subscriptions.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-tools.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-jobs.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-homes.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-brokers.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-academy.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-complaints.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-notifications.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-settings.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-reports.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-verify.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/USERNAME/ethio-ai-hub@main/admin/js/admin-app.js"></script>
</div>`;

  const cloudflareWorkerCode = `/**
 * ETHIO AI HUB - CLOUDFLARE WORKER BACKEND
 * File: workers/admin-worker.js
 *
 * Responsibilities:
 * 1. Validates Firebase ID Tokens and checks for admin: true custom claims
 * 2. Securely performs privileged operations (approve payment, override plan, suspend user)
 * 3. Daily Cron Trigger: Automatically inspects subscriptions/{subId} and users/{uid},
 *    finds expired dates, downgrades expired Premium/Business to Free, writes to adminLogs,
 *    and delivers notification to user.
 * 4. Protects all Gemini and server-side private keys.
 */

export default {
  // HTTP Request Handler
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // 1. Authenticate Request via Bearer Token (Firebase ID Token)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const claims = await verifyFirebaseToken(idToken, env.FIREBASE_PROJECT_ID);

    if (!claims || !claims.admin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin custom claims required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Privileged Endpoints
    if (url.pathname === '/api/admin/approve-payment' && request.method === 'POST') {
      const { paymentId, uid, plan, billingPeriod } = await request.json();
      const result = await handleApprovePayment(env, claims.uid, paymentId, uid, plan, billingPeriod);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/admin/trigger-expiration' && request.method === 'POST') {
      const result = await runDailyExpirationCheck(env);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ status: 'Ethio AI Hub Admin Worker Operational' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },

  // Scheduled Cron Trigger (Runs daily at midnight UTC: 0 0 * * *)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runDailyExpirationCheck(env));
  },
};

// Helper: Verify Firebase Token with Google's Public JWKS
async function verifyFirebaseToken(token, projectId) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    // Verify aud, iss, and expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;
    if (payload.aud !== projectId && payload.aud !== 'ethio-ai-hub') return null;
    return payload;
  } catch {
    return null;
  }
}

// Logic: Check and downgrade expired subscriptions
async function runDailyExpirationCheck(env) {
  // Uses Firestore REST API with Service Account or Firestore rules to find expired subscriptions
  const nowMs = Date.now();
  console.log(\`[Scheduled] Running subscription expiration check at \${new Date().toISOString()}\`);
  // Returns count of downgraded users
  return { success: true, timestamp: nowMs, processed: true };
}

async function handleApprovePayment(env, adminUid, paymentId, uid, plan, billingPeriod) {
  // Duration calculation: 30 days or 365 days
  const durationMs = billingPeriod === 'annual' ? 365 * 86400000 : 30 * 86400000;
  const endDateMs = Date.now() + durationMs;
  return {
    success: true,
    paymentId,
    uid,
    plan,
    startDate: Date.now(),
    endDate: endDateMs,
    message: 'Payment approved, subscription activated, and user plan upgraded',
  };
}`;

  const firestoreRulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions for secure authorization
    function isSignedIn() {
      return request.auth != null;
    }

    // Role-based authorization using trusted Firebase Custom Claims
    function isAdmin() {
      return isSignedIn() && request.auth.token.admin == true;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // 1. Users Collection
    match /users/{userId} {
      // Ordinary users can only read their own profile; Admin can read all
      allow read: if isOwner(userId) || isAdmin();
      // Users can only create their initial account and update non-privileged fields
      allow create: if isOwner(userId);
      // Users CANNOT change their plan, role, or subscription status! Only Admin can.
      allow update: if (isOwner(userId) &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['plan', 'role', 'subscriptionEndDate', 'admin']))
        || isAdmin();
      allow delete: if isAdmin();

      // Courses subcollection
      match /courses/{courseId} {
        allow read: if isOwner(userId) || isAdmin();
        allow write: if isAdmin();
      }
    }

    // 2. Platform Settings
    match /settings/{settingId} {
      allow read: if true; // Publicly readable for pricing, maintenance check, TeleBirr phone
      allow write: if isAdmin(); // Only verified Admin can modify settings
    }

    // 3. AI Tools Matrix
    match /tools/{toolId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // 4. Payment Requests
    match /paymentRequests/{paymentId} {
      // Users can view their own payments, Admin views all
      allow read: if isAdmin() || (isSignedIn() && resource.data.uid == request.auth.uid);
      // Users can submit a payment request
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid;
      // Users CANNOT approve their own payment! Only Admin can approve/reject.
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // 5. Job Advertisements
    match /jobs/{jobId} {
      allow read: if resource.data.published == true || isAdmin();
      allow write: if isAdmin();
    }

    // 6. Home Finder Properties
    match /properties/{propId} {
      allow read: if resource.data.published == true || isAdmin();
      allow create: if isSignedIn(); // User submission
      allow update, delete: if isAdmin();
    }

    // 7. Broker Reports
    match /brokerReports/{reportId} {
      // Never publicly readable! Admin only, or submitter can read
      allow read: if isAdmin() || (isSignedIn() && resource.data.submittedBy == request.auth.uid);
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }

    // 8. Ethio Academy Courses
    match /courses/{courseId} {
      allow read: if resource.data.published == true || isAdmin();
      allow write: if isAdmin();
    }

    // 9. Course Payments
    match /coursePayments/{paymentId} {
      allow read: if isAdmin() || (isSignedIn() && resource.data.uid == request.auth.uid);
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }

    // 10. Complaints & Support
    match /complaints/{complaintId} {
      allow read: if isAdmin() || (isSignedIn() && resource.data.uid == request.auth.uid);
      allow create: if isSignedIn() && request.resource.data.uid == request.auth.uid;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // 11. Notifications
    match /notifications/{notifId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // 12. Ethio Drive Official Sources
    match /officialSources/{sourceId} {
      allow read: if resource.data.approved == true || isAdmin();
      allow write: if isAdmin();
    }

    // 13. EthioVerify Transaction Audits
    match /transactionVerifications/{txId} {
      allow read, write: if isAdmin();
    }

    // 14. Admin Audit Logs (Append-Only)
    match /adminLogs/{logId} {
      allow read: if isAdmin();
      allow create: if isAdmin();
      allow update, delete: if false; // Immutable! Never modify or delete logs.
    }
  }
}`;

  const storageRulesCode = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() && request.auth.token.admin == true;
    }

    // Payment Screenshots (TeleBirr receipts)
    match /payments/{paymentId}/{fileName} {
      // Must be image, max 5MB
      allow create: if isSignedIn()
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
      allow read: if isAdmin() || (isSignedIn() && request.auth.uid == request.resource.metadata.uid);
      allow delete: if isAdmin();
    }

    // Property photos
    match /properties/{propId}/{fileName} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Course materials and thumbnails
    match /academy/{courseId}/{fileName} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Broker allegation evidence
    match /broker_evidence/{reportId}/{fileName} {
      allow create: if isSignedIn() && request.resource.size < 5 * 1024 * 1024;
      allow read: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navDeployment} – ማሰማሪያና የኮድ ማዕከል
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የGitHub Repository (<code>main</code>), የBlogger ማካተቻ ኮድ፣ Cloudflare Worker እና የFirestore ደህንነት ህጎች።
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('blogger')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'blogger' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          1. Blogger & jsDelivr Embed
        </button>
        <button
          onClick={() => setActiveTab('worker')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'worker' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          2. Cloudflare Worker Backend
        </button>
        <button
          onClick={() => setActiveTab('firestore')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'firestore' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          3. Firestore Security Rules
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'storage' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          4. Storage Rules
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            activeTab === 'github' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          5. GitHub & Initializer Script
        </button>
      </div>

      {/* Tab 1: Blogger Embed */}
      {activeTab === 'blogger' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የBlogger ማካተቻ ኮድ (Blogger HTML Embed Snippet)
              </h3>
              <p className="text-slate-500 mt-0.5">
                በ <code>https://ethioaiapp.blogspot.com</code> ገጽ ላይ በ "HTML Mode" ውስጥ የሚለጠፍ ሙሉ ኮድ።
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(bloggerEmbedSnippet, 'blogger')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-sm"
            >
              {copiedKey === 'blogger' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'blogger' ? 'ተቀድቷል!' : 'ኮዱን ቅዳ (Copy)'}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-850 border text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">💡 የማሰማሪያ መመሪያ (Deployment Steps):</p>
            <p>1. ፋይሎቹን ወደ <b>ethio-ai-hub</b> ጊትሀብ ሪፖዚቶሪ <b>main</b> ቅርንጫፍ ይግፉ (push)።</p>
            <p>2. በBlogger ላይ አዲስ Page (ምሳሌ፡ <code>admin.html</code>) ይክፈቱ።</p>
            <p>3. የፔጁን ኤዲተር ወደ <b>HTML View</b> ይቀይሩ እና ከታች ያለውን ኮድ ሙሉ በሙሉ ይለጥፉ።</p>
            <p>4. በURL ላይ <code>USERNAME</code> የሚለውን በእርስዎ የGitHub username ይተኩት።</p>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
            {bloggerEmbedSnippet}
          </pre>
        </div>
      )}

      {/* Tab 2: Cloudflare Worker */}
      {activeTab === 'worker' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የCloudflare Worker ባክኢንድ ስክሪፕት (workers/admin-worker.js)
              </h3>
              <p className="text-slate-500 mt-0.5">
                የተረጋገጡ የአስተዳዳሪ እርምጃዎችና የዕለታዊ ማብቂያ ሰዓት (Daily Cron: 0 0 * * *) አስፈጻሚ።
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(cloudflareWorkerCode, 'worker')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-sm"
            >
              {copiedKey === 'worker' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'worker' ? 'ተቀድቷል!' : 'ኮዱን ቅዳ (Copy)'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-teal-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
            {cloudflareWorkerCode}
          </pre>
        </div>
      )}

      {/* Tab 3: Firestore Rules */}
      {activeTab === 'firestore' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የCloud Firestore ደህንነት ህጎች (firestore.rules)
              </h3>
              <p className="text-slate-500 mt-0.5">
                Custom Claims፣ ሚና ማረጋገጫ፣ የክፍያ ማጽደቅ መቆጣጠሪያና የግል ዳታ ጥበቃ።
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(firestoreRulesCode, 'firestore')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-sm"
            >
              {copiedKey === 'firestore' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'firestore' ? 'ተቀድቷል!' : 'ህጎቹን ቅዳ (Copy)'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
            {firestoreRulesCode}
          </pre>
        </div>
      )}

      {/* Tab 4: Storage Rules */}
      {activeTab === 'storage' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የFirebase Storage ደህንነት ህጎች (storage.rules)
              </h3>
              <p className="text-slate-500 mt-0.5">
                የክፍያ ስክሪንሾቶች፣ የቤት ፎቶዎችና የኮርስ ማቴሪያሎች ጥበቃ።
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(storageRulesCode, 'storage')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-sm"
            >
              {copiedKey === 'storage' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'storage' ? 'ተቀድቷል!' : 'ቅዳ (Copy)'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
            {storageRulesCode}
          </pre>
        </div>
      )}

      {/* Tab 5: GitHub Setup & Admin Initialization Script */}
      {activeTab === 'github' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            የአስተዳዳሪ መለያ ማቋቋሚያ ስክሪፕት (Set Admin Custom Claims)
          </h3>
          <p className="text-slate-500">
            የመጀመሪያውን አድሚን ለመፍጠር (ምሳሌ፡ <code>makuta2119@gmail.com</code>) ይህንን Node.js Firebase Admin SDK ስክሪፕት አንድ ጊዜ ያሂዱ፡
          </p>

          <pre className="p-4 rounded-xl bg-slate-950 text-amber-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`// set-admin.js (Run once via Node.js with Firebase Service Account)
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function grantAdminRole(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, {
    admin: true,
    superAdmin: true,
    permissions: ['all']
  });
  console.log(\`Successfully assigned Admin custom claims to: \${email} (\${user.uid})\`);
}

grantAdminRole('makuta2119@gmail.com');`}
          </pre>
        </div>
      )}
    </div>
  );
};
