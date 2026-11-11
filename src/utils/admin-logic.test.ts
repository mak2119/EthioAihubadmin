import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateToolRestrictions,
  calculateSubscriptionExpiry,
  isSubscriptionExpired,
  validateTelebirrTransactionId,
  calculateNotificationDispatchTime,
  DEFAULT_PLANS,
  formatETB,
} from './admin-logic';

test('DEFAULT_PLANS has correct pricing and annual 10% discounts', () => {
  assert.equal(DEFAULT_PLANS.premium.monthlyEtb, 250);
  assert.equal(DEFAULT_PLANS.premium.annualEtb, 2700);
  // (250 * 12) - 10% = 3000 - 300 = 2700
  assert.equal(250 * 12 * 0.9, 2700);

  assert.equal(DEFAULT_PLANS.business.monthlyEtb, 600);
  assert.equal(DEFAULT_PLANS.business.annualEtb, 6480);
  // (600 * 12) - 10% = 7200 - 720 = 6480
  assert.equal(600 * 12 * 0.9, 6480);
});

test('validateToolRestrictions enforces tier quotas', () => {
  // Free: up to 5 disabled
  assert.equal(validateToolRestrictions('free', 3).valid, true);
  assert.equal(validateToolRestrictions('free', 5).valid, true);
  assert.equal(validateToolRestrictions('free', 6).valid, false);

  // Premium: up to 2 disabled
  assert.equal(validateToolRestrictions('premium', 2).valid, true);
  assert.equal(validateToolRestrictions('premium', 3).valid, false);

  // Business: 0 disabled (must receive all tools)
  assert.equal(validateToolRestrictions('business', 0).valid, true);
  assert.equal(validateToolRestrictions('business', 1).valid, false);
});

test('calculateSubscriptionExpiry correctly adds 30 or 365 days', () => {
  const base = new Date('2026-01-01T00:00:00.000Z').getTime();
  const monthly = calculateSubscriptionExpiry(base, 'monthly');
  const annual = calculateSubscriptionExpiry(base, 'annual');

  const diffDaysMonthly = Math.round((monthly - base) / (1000 * 60 * 60 * 24));
  const diffDaysAnnual = Math.round((annual - base) / (1000 * 60 * 60 * 24));

  assert.equal(diffDaysMonthly, 30);
  assert.equal(diffDaysAnnual, 365);
});

test('isSubscriptionExpired detects expired vs active subscriptions', () => {
  const now = 1770000000000;
  assert.equal(isSubscriptionExpired(now - 1000, now), true);
  assert.equal(isSubscriptionExpired(now, now), true);
  assert.equal(isSubscriptionExpired(now + 10000, now), false);
});

test('validateTelebirrTransactionId validates real-world transaction patterns', () => {
  assert.equal(validateTelebirrTransactionId('CL98234190'), true);
  assert.equal(validateTelebirrTransactionId('TB-839210-9'), true);
  assert.equal(validateTelebirrTransactionId(''), false);
  assert.equal(validateTelebirrTransactionId('abc'), false); // too short
  assert.equal(validateTelebirrTransactionId('VALID_TX_12345'), true);
});

test('calculateNotificationDispatchTime computes plan delay tiers', () => {
  const now = 100000000;
  // Free: 8 hours delay
  assert.equal(calculateNotificationDispatchTime(now, 'free'), now + 8 * 3600 * 1000);
  // Premium: 1 hour delay
  assert.equal(calculateNotificationDispatchTime(now, 'premium'), now + 1 * 3600 * 1000);
  // Business: immediate
  assert.equal(calculateNotificationDispatchTime(now, 'business'), now);
});

test('formatETB formats currency correctly', () => {
  const formatted = formatETB(250);
  assert.ok(formatted.includes('250'));
});
