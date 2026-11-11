/**
 * ETHIO AI HUB - ADMIN AUTHENTICATION & CUSTOM CLAIMS VERIFIER
 * File: admin/js/admin-auth.js
 *
 * Enforces server-verified Firebase Custom Claims (admin: true).
 * No public admin registration allowed.
 */

window.AdminAuth = {
  currentAdmin: null,

  async checkAdminStatus() {
    if (!window.ethioAuth) return null;
    return new Promise((resolve) => {
      window.ethioAuth.onAuthStateChanged(async (user) => {
        if (!user) {
          this.currentAdmin = null;
          resolve(false);
          return;
        }

        try {
          // Force refresh token to read latest custom claims
          const tokenResult = await user.getIdTokenResult(true);
          if (tokenResult.claims && tokenResult.claims.admin === true) {
            this.currentAdmin = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Super Admin',
              claims: tokenResult.claims,
            };
            resolve(true);
          } else {
            console.warn('[Ethio AI Hub] User does not possess Admin Custom Claims. Access denied.');
            this.currentAdmin = null;
            resolve(false);
          }
        } catch (err) {
          console.error('[Ethio AI Hub] Error verifying claims:', err);
          this.currentAdmin = null;
          resolve(false);
        }
      });
    });
  },

  async login(email, password) {
    if (!window.ethioAuth) throw new Error('Firebase Auth unavailable');
    const cred = await window.ethioAuth.signInWithEmailAndPassword(email, password);
    const tokenResult = await cred.user.getIdTokenResult(true);
    if (!tokenResult.claims || !tokenResult.claims.admin) {
      await window.ethioAuth.signOut();
      throw new Error('ተከልክሏል፡ ይህ መለያ የአስተዳዳሪ ፈቃድ (Admin Custom Claims) የለውም።');
    }
    return cred.user;
  },

  async logout() {
    if (window.ethioAuth) {
      await window.ethioAuth.signOut();
    }
    window.location.reload();
  },
};
