/**
 * ETHIO AI HUB - HASH ROUTER FOR BLOGGER COMPATIBILITY
 * File: admin/js/admin-router.js
 *
 * Blogger cannot serve separate dynamic subpages. This router listens to
 * location.hash changes (#/dashboard, #/users, #/payments) and switches views.
 */

window.AdminRouter = {
  currentRoute: 'dashboard',
  routes: {},

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(path) {
    window.location.hash = '#/' + path;
  },

  init() {
    const handleRoute = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') || 'dashboard';
      this.currentRoute = hash;
      const handler = this.routes[hash] || this.routes['dashboard'];
      if (handler) {
        handler();
      }
      // Update sidebar active classes
      document.querySelectorAll('.admin-nav-item').forEach((el) => {
        if (el.getAttribute('data-route') === hash) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    };

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('DOMContentLoaded', handleRoute);
    handleRoute();
  },
};
