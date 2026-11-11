/**
 * ETHIO AI HUB - Core Administration Business Logic & Rules
 * Pure utility functions decoupled for deterministic verification & testing.
 */

export interface SubscriptionPlan {
  id: 'free' | 'premium' | 'business';
  nameAm: string;
  nameEn: string;
  nameOr: string;
  monthlyEtb: number;
  annualEtb: number;
  annualDiscountPercent: number;
  dailyChatLimit: number; // e.g. 12, 50, -1 (unlimited)
  maxDisabledTools: number; // Free: 5, Premium: 2, Business: 0
  notificationDelayHours: number; // Free: 8, Premium: 1, Business: 0
}

export const DEFAULT_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    nameAm: 'ነፃ (Free)',
    nameEn: 'Free Plan',
    nameOr: 'Bilisa (Free)',
    monthlyEtb: 0,
    annualEtb: 0,
    annualDiscountPercent: 0,
    dailyChatLimit: 12,
    maxDisabledTools: 5,
    notificationDelayHours: 8,
  },
  premium: {
    id: 'premium',
    nameAm: 'ፕሪሚየም (Premium)',
    nameEn: 'Premium Plan',
    nameOr: 'Piriimiyemii (Premium)',
    monthlyEtb: 250,
    annualEtb: 2700, // 250 * 12 = 3000 -> 10% off = 2700
    annualDiscountPercent: 10,
    dailyChatLimit: 50,
    maxDisabledTools: 2,
    notificationDelayHours: 1,
  },
  business: {
    id: 'business',
    nameAm: 'ቢዝነስ (Business)',
    nameEn: 'Business Plan',
    nameOr: 'Daldalaa (Business)',
    monthlyEtb: 600,
    annualEtb: 6480, // 600 * 12 = 7200 -> 10% off = 6480
    annualDiscountPercent: 10,
    dailyChatLimit: -1, // Unlimited
    maxDisabledTools: 0,
    notificationDelayHours: 0,
  },
};

/**
 * Validates tool access restrictions based on user tier constraints:
 * - Free: Admin can disable up to 5 tools
 * - Premium: Admin can disable up to 2 tools
 * - Business: Receives all enabled platform tools
 */
export function validateToolRestrictions(
  planId: 'free' | 'premium' | 'business',
  disabledToolCount: number
): { valid: boolean; message?: string } {
  const plan = DEFAULT_PLANS[planId];
  if (!plan) return { valid: false, message: 'Unknown plan' };

  if (planId === 'business' && disabledToolCount > 0) {
    return {
      valid: false,
      message: 'Business subscribers must receive all enabled platform tools.',
    };
  }

  if (disabledToolCount > plan.maxDisabledTools) {
    return {
      valid: false,
      message: `${plan.nameEn} can have at most ${plan.maxDisabledTools} disabled tools. Current: ${disabledToolCount}.`,
    };
  }

  return { valid: true };
}

/**
 * Calculates subscription expiration date based on billing period.
 */
export function calculateSubscriptionExpiry(
  startDateMs: number,
  billingPeriod: 'monthly' | 'annual'
): number {
  const date = new Date(startDateMs);
  if (billingPeriod === 'monthly') {
    date.setDate(date.getDate() + 30);
  } else {
    date.setDate(date.getDate() + 365);
  }
  return date.getTime();
}

/**
 * Checks if a subscription has expired based on current timestamp.
 */
export function isSubscriptionExpired(endDateMs: number, currentTimestampMs: number): boolean {
  return endDateMs <= currentTimestampMs;
}

/**
 * Validates Ethiopian TeleBirr transaction ID format
 * TeleBirr transaction codes typically start with letters (e.g., CL, RA, PK, TB) followed by alphanumeric characters (8-16 chars).
 */
export function validateTelebirrTransactionId(txId: string): boolean {
  if (!txId || typeof txId !== 'string') return false;
  const clean = txId.trim();
  if (clean.length < 6 || clean.length > 25) return false;
  // Alphanumeric with optional dashes or spaces
  return /^[A-Z0-9\-_]{6,25}$/i.test(clean);
}

/**
 * Calculates notification scheduled timestamp based on subscriber plan.
 * Free: +8 hours
 * Premium: +1 hour
 * Business: 0 (immediate)
 */
export function calculateNotificationDispatchTime(
  baseTimestampMs: number,
  planId: 'free' | 'premium' | 'business'
): number {
  const plan = DEFAULT_PLANS[planId] || DEFAULT_PLANS.free;
  const delayMs = plan.notificationDelayHours * 60 * 60 * 1000;
  return baseTimestampMs + delayMs;
}

/**
 * Formats Ethiopian Birr (ETB) currency.
 */
export function formatETB(amount: number): string {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 2,
  }).format(amount).replace('ETB', 'ETB ');
}
