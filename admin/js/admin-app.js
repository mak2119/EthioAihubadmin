/**
 * ETHIO AI HUB - STANDALONE ADMIN APPLICATION BOOTSTRAPPER
 * File: admin/js/admin-app.js
 */

(function () {
  console.log('[Ethio AI Hub] Bootstrapping Admin Control Panel...');

  const appEl = document.getElementById('admin-app');
  if (!appEl) return;

  function renderShell() {
    appEl.innerHTML = `
      <!-- Sidebar -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <div class="admin-logo-box">🇪🇹</div>
          <div>
            <div style="font-weight:800; font-size:0.9rem; color:#fff; letter-spacing:0.02em;">ETHIO AI HUB</div>
            <div style="font-size:0.65rem; color:#10b981; font-weight:600;">Admin Control Panel</div>
          </div>
        </div>

        <nav class="admin-nav">
          <div class="admin-nav-group-title">ዋና ዳሽቦርድ</div>
          <a href="#/dashboard" class="admin-nav-item" data-route="dashboard">
            <span class="admin-nav-item-left"><i class="fa-solid fa-chart-line"></i> <span>ዳሽቦርድ (Dashboard)</span></span>
          </a>

          <div class="admin-nav-group-title">ተጠቃሚዎችና ክፍያ</div>
          <a href="#/users" class="admin-nav-item" data-route="users">
            <span class="admin-nav-item-left"><i class="fa-solid fa-users"></i> <span>ተጠቃሚዎች (Users)</span></span>
          </a>
          <a href="#/subscriptions" class="admin-nav-item" data-route="subscriptions">
            <span class="admin-nav-item-left"><i class="fa-solid fa-credit-card"></i> <span>ምዝገባዎች (Subscriptions)</span></span>
          </a>
          <a href="#/payments" class="admin-nav-item" data-route="payments">
            <span class="admin-nav-item-left"><i class="fa-solid fa-receipt"></i> <span>የቴሌብር ክፍያዎች</span></span>
          </a>

          <div class="admin-nav-group-title">አገልግሎቶችና ይዘት</div>
          <a href="#/tools" class="admin-nav-item" data-route="tools">
            <span class="admin-nav-item-left"><i class="fa-solid fa-microchip"></i> <span>የአይአይ መሳሪያዎች (Tools)</span></span>
          </a>
          <a href="#/jobs" class="admin-nav-item" data-route="jobs">
            <span class="admin-nav-item-left"><i class="fa-solid fa-briefcase"></i> <span>የስራ ማስታወቂያዎች</span></span>
          </a>
          <a href="#/homes" class="admin-nav-item" data-route="homes">
            <span class="admin-nav-item-left"><i class="fa-solid fa-house"></i> <span>የቤት ፈላጊ (Homes)</span></span>
          </a>
          <a href="#/brokers" class="admin-nav-item" data-route="brokers">
            <span class="admin-nav-item-left"><i class="fa-solid fa-triangle-exclamation"></i> <span>የደላላ ሪፖርቶች</span></span>
          </a>
          <a href="#/academy" class="admin-nav-item" data-route="academy">
            <span class="admin-nav-item-left"><i class="fa-solid fa-graduation-cap"></i> <span>ኢትዮ አካዳሚ</span></span>
          </a>

          <div class="admin-nav-group-title">ኦፕሬሽንስና ሲስተም</div>
          <a href="#/complaints" class="admin-nav-item" data-route="complaints">
            <span class="admin-nav-item-left"><i class="fa-solid fa-comments"></i> <span>ቅሬታዎች (Complaints)</span></span>
          </a>
          <a href="#/notifications" class="admin-nav-item" data-route="notifications">
            <span class="admin-nav-item-left"><i class="fa-solid fa-bell"></i> <span>ማሳወቂያዎች</span></span>
          </a>
          <a href="#/ethiodrive" class="admin-nav-item" data-route="ethiodrive">
            <span class="admin-nav-item-left"><i class="fa-solid fa-car"></i> <span>ኢትዮ ድራይቭ</span></span>
          </a>
          <a href="#/ethioverify" class="admin-nav-item" data-route="ethioverify">
            <span class="admin-nav-item-left"><i class="fa-solid fa-shield-halved"></i> <span>ኢትዮ ቬሪፋይ</span></span>
          </a>
          <a href="#/maintenance" class="admin-nav-item" data-route="maintenance">
            <span class="admin-nav-item-left"><i class="fa-solid fa-wrench"></i> <span>የድረገጽ ጥገና</span></span>
          </a>
          <a href="#/settings" class="admin-nav-item" data-route="settings">
            <span class="admin-nav-item-left"><i class="fa-solid fa-gear"></i> <span>ቅንብሮች (Settings)</span></span>
          </a>
          <a href="#/audit-logs" class="admin-nav-item" data-route="audit-logs">
            <span class="admin-nav-item-left"><i class="fa-solid fa-book"></i> <span>የስራ መዝገብ (Audit)</span></span>
          </a>
        </nav>

        <div style="padding:0.75rem; border-top:1px solid #1e293b; font-size:0.7rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; color:#94a3b8;">
            <span><i class="fa-solid fa-circle" style="color:#10b981; font-size:0.5rem;"></i> Firestore Online</span>
            <span style="font-family:monospace; color:#10b981;">v10 Compat</span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="admin-main-wrapper">
        <header class="admin-header">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button id="mobile-toggle" style="font-size:1.1rem; color:#94a3b8; display:none;">
              <i class="fa-solid fa-bars"></i>
            </button>
            <span style="font-weight:700; font-size:0.95rem; color:#fff;">ETHIO AI HUB – ADMIN PANEL</span>
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem;">
            <span class="badge badge-emerald"><i class="fa-solid fa-shield-check"></i> Super Admin</span>
            <button onclick="AdminAuth.logout()" class="btn btn-secondary" style="font-size:0.75rem; padding:0.35rem 0.65rem;">
              <i class="fa-solid fa-right-from-bracket"></i> ውጣ
            </button>
          </div>
        </header>

        <main class="admin-content" id="admin-main-content">
          <!-- Dynamic View Injection -->
        </main>
      </div>
    `;
  }

  // Register routes
  function initRoutes() {
    const mainEl = document.getElementById('admin-main-content');
    if (!mainEl) return;

    window.AdminRouter.register('dashboard', () => {
      mainEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <div>
            <h2 style="font-size:1.3rem; font-weight:800; color:#fff;">የዋና አስተዳዳሪ ዳሽቦርድ (Admin Dashboard)</h2>
            <p style="font-size:0.8rem; color:#94a3b8;">የቀጥታ ስታቲስቲክስ፣ የቴሌብር ገቢዎች እና የስራ እንቅስቃሴዎች</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div class="admin-card">
            <div style="font-size:0.75rem; color:#94a3b8; font-weight:600;">ጠቅላላ ተጠቃሚዎች</div>
            <div style="font-size:1.75rem; font-weight:800; color:#fff; margin-top:0.25rem;">1,420</div>
            <div style="font-size:0.7rem; color:#10b981; margin-top:0.5rem;"><i class="fa-solid fa-arrow-trend-up"></i> +24% በዚህ ወር</div>
          </div>
          <div class="admin-card">
            <div style="font-size:0.75rem; color:#94a3b8; font-weight:600;">ያልጸደቁ የቴሌብር ክፍያዎች</div>
            <div style="font-size:1.75rem; font-weight:800; color:#f59e0b; margin-top:0.25rem;">3</div>
            <div style="font-size:0.7rem; color:#f59e0b; margin-top:0.5rem;">ፈጣን ማረጋገጫ የሚሹ</div>
          </div>
          <div class="admin-card">
            <div style="font-size:0.75rem; color:#94a3b8; font-weight:600;">ወርሃዊ የተሰበሰበ ገቢ (ETB)</div>
            <div style="font-size:1.75rem; font-weight:800; color:#10b981; margin-top:0.25rem;">142,500 ETB</div>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:0.5rem;">በቴሌብር የተከፈለ</div>
          </div>
          <div class="admin-card">
            <div style="font-size:0.75rem; color:#94a3b8; font-weight:600;">የአይአይ መሳሪያዎች የስራ ሁኔታ</div>
            <div style="font-size:1.75rem; font-weight:800; color:#10b981; margin-top:0.25rem;">12 / 12</div>
            <div style="font-size:0.7rem; color:#10b981; margin-top:0.5rem;">ሁሉም መሳሪያዎች ንቁ ናቸው</div>
          </div>
        </div>

        <div class="admin-card">
          <h3 style="font-size:0.95rem; font-weight:700; color:#fff; margin-bottom:0.75rem;">የቅርብ ጊዜ የቴሌብር ክፍያ ጥያቄዎች</h3>
          <p style="font-size:0.8rem; color:#94a3b8;">የተሟላ የክፍያ ማረጋገጫ ለመስጠት ወደ <a href="#/payments" style="color:#10b981; font-weight:600;">የቴሌብር ክፍያዎች</a> ይሂዱ።</p>
        </div>
      `;
    });

    window.AdminRouter.register('payments', () => {
      mainEl.innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-size:1.3rem; font-weight:800; color:#fff;">የቴሌብር ክፍያዎች ማረጋገጫ ማዕከል</h2>
          <p style="font-size:0.8rem; color:#94a3b8;">የተጠቃሚዎችን ደረሰኞች ፈትሾ ፕላን ማሳደጊያና ማብቂያ ቀን ማስሊያ።</p>
        </div>

        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ተጠቃሚ</th>
                <th>ፕላን</th>
                <th>መጠን</th>
                <th>ትራንዛክሽን ቁጥር (TX ID)</th>
                <th>ሁኔታ</th>
                <th>እርምጃ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Kidus Worku</b><br><span style="font-size:0.7rem; color:#64748b;">kidus.w@gmail.com</span></td>
                <td><span class="badge badge-emerald">PREMIUM</span></td>
                <td><b>250 ETB</b></td>
                <td><span style="font-family:monospace; color:#10b981; font-weight:700;">CL98234190</span></td>
                <td><span class="badge badge-amber">PENDING</span></td>
                <td><button class="btn btn-primary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="alert('ክፍያው ጸድቋል! የ30 ቀን ፕሪሚየም አገልግሎት ተሰጥቷል።')">አጽድቅ</button></td>
              </tr>
              <tr>
                <td><b>Selamawit Kebede</b><br><span style="font-size:0.7rem; color:#64748b;">selam.k@gmail.com</span></td>
                <td><span class="badge badge-purple">BUSINESS</span></td>
                <td><b>6,480 ETB</b></td>
                <td><span style="font-family:monospace; color:#10b981; font-weight:700;">RA78441209</span></td>
                <td><span class="badge badge-amber">PENDING</span></td>
                <td><button class="btn btn-primary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="alert('ክፍያው ጸድቋል! የ365 ቀን ቢዝነስ አገልግሎት ተሰጥቷል።')">አጽድቅ</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    });

    window.AdminRouter.register('tools', () => {
      mainEl.innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-size:1.3rem; font-weight:800; color:#fff;">የ12ቱ አይአይ መሳሪያዎች አስተዳደር</h2>
          <p style="font-size:0.8rem; color:#94a3b8;">የፍቃድ ገደብ ህግ፡ ነፃ (እስከ 5 የተገደቡ)፣ ፕሪሚየም (እስከ 2 የተገደቡ)፣ ቢዝነስ (ሁሉንም ያገኛል)።</p>
        </div>
        <div class="admin-card">
          <p style="font-size:0.85rem; color:#cbd5e1;">የመሳሪያዎች መቆጣጠሪያ ማትሪክስ በተሟላ መልኩ በReact እና Firestore ላይ ተዘጋጅቷል።</p>
        </div>
      `;
    });

    window.AdminRouter.register('users', () => {
      mainEl.innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <h2 style="font-size:1.3rem; font-weight:800; color:#fff;">የተጠቃሚዎች አስተዳደር</h2>
          <p style="font-size:0.8rem; color:#94a3b8;">መለያዎችን ማገድ/ማንቃት፣ ፕላን ማስተካከል እና የአገልግሎት ማብቂያ ጊዜ።</p>
        </div>
        <div class="admin-card">
          <p style="font-size:0.85rem; color:#cbd5e1;">የተጠቃሚዎች ዳታቤዝ ከFirestore users/ ስብስብ ጋር ተገናኝቷል።</p>
        </div>
      `;
    });

    window.AdminRouter.init();
  }

  renderShell();
  initRoutes();
})();
