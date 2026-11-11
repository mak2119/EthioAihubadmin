/**
 * ETHIO AI HUB - FIREBASE SDK INITIALIZER (V10 COMPAT)
 * File: js/firebase.js
 */

(function () {
  if (typeof firebase === 'undefined') {
    console.warn('[Ethio AI Hub] Firebase SDK not loaded in script tag yet.');
    return;
  }

  if (!firebase.apps.length) {
    const config = window.ETHIO_FIREBASE_CONFIG || {};
    try {
      firebase.initializeApp(config);
      console.log('[Ethio AI Hub] Firebase App initialized successfully with project:', config.projectId);
    } catch (e) {
      console.error('[Ethio AI Hub] Firebase initialization error:', e);
    }
  }

  // Export convenience globals
  window.ethioAuth = firebase.auth();
  window.ethioDb = firebase.firestore();
  window.ethioStorage = firebase.storage();
})();
