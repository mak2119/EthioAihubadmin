import {
  EmployerAccount,
  JobPortalSettings,
  PricingPackage,
} from '../types/job-portal';

/**
 * Calculates effective package price for an employer considering tier,
 * active discounts, and custom employer-specific overrides.
 */
export function calculatePackagePrice(
  pkg: PricingPackage,
  plan: 'free' | 'premium' | 'business',
  customOverrides?: Record<string, number>,
  currentTimestampMs: number = Date.now()
): number {
  // 1. Custom individual employer override has highest precedence
  if (customOverrides && typeof customOverrides[pkg.id] === 'number') {
    return Math.max(0, customOverrides[pkg.id]);
  }

  // 2. Base plan price
  const basePrice = pkg.prices[plan] ?? 0;
  if (basePrice <= 0) return 0;

  // 3. Optional package discount with expiration date
  if (pkg.discountPercent && pkg.discountPercent > 0) {
    let isDiscountActive = true;
    if (pkg.discountEndDate) {
      const endMs = new Date(pkg.discountEndDate).getTime();
      if (!isNaN(endMs) && currentTimestampMs > endMs) {
        isDiscountActive = false;
      }
    }

    if (isDiscountActive) {
      const discountMultiplier = Math.max(0, 1 - pkg.discountPercent / 100);
      return Math.round(basePrice * discountMultiplier);
    }
  }

  return basePrice;
}

/**
 * Checks if an employer has remaining free monthly posts.
 */
export function canEmployerPostFree(
  employer: EmployerAccount,
  settings: JobPortalSettings
): { allowed: boolean; remaining: number; monthlyQuota: number } {
  const monthlyQuota =
    typeof employer.customFreePostAllowance === 'number'
      ? employer.customFreePostAllowance
      : settings.freePostsPerMonthPerPlan[employer.plan] ?? 0;

  const used = employer.freePostsUsedThisMonth ?? 0;
  const remaining = Math.max(0, monthlyQuota - used);

  return {
    allowed: remaining > 0,
    remaining,
    monthlyQuota,
  };
}

/**
 * Checks whether an employer has reached their maximum active concurrent job postings.
 */
export function checkJobPostingLimits(
  employer: EmployerAccount,
  settings: JobPortalSettings
): { allowed: boolean; reason?: string; limit: number } {
  const limit = settings.maxActivePostsPerPlan[employer.plan] ?? 1;
  const activeCount = employer.activeJobsCount ?? 0;

  if (activeCount >= limit) {
    return {
      allowed: false,
      limit,
      reason: `Maximum active job limit of ${limit} reached for ${employer.plan.toUpperCase()} tier.`,
    };
  }

  return { allowed: true, limit };
}

/**
 * Scans content against the banned words list.
 */
export function scanBannedWords(
  text: string,
  bannedWords: string[]
): { hasBanned: boolean; foundWords: string[] } {
  if (!text || !bannedWords || bannedWords.length === 0) {
    return { hasBanned: false, foundWords: [] };
  }

  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const word of bannedWords) {
    const cleanWord = word.trim().toLowerCase();
    if (!cleanWord) continue;
    // Word boundary or substring check
    if (lower.includes(cleanWord)) {
      found.push(word.trim());
    }
  }

  return {
    hasBanned: found.length > 0,
    foundWords: found,
  };
}

/**
 * Determines whether a submitted job goes directly to 'approved' or 'pending_review'
 * according to settings and employer verification status.
 */
export function determineInitialJobStatus(
  employer: EmployerAccount,
  settings: JobPortalSettings
): 'approved' | 'pending_review' {
  // If review before publishing is disabled, approve immediately
  if (!settings.reviewBeforePublishing) {
    return 'approved';
  }

  // If verified employers skip moderation queue
  if (settings.skipReviewForVerified && employer.isVerified) {
    return 'approved';
  }

  return 'pending_review';
}

/**
 * Checks if a job listing is within its renewal window.
 */
export function isJobInRenewalWindow(
  expiresAtMs: number,
  renewalWindowDays: number,
  currentTimestampMs: number = Date.now()
): boolean {
  const windowMs = renewalWindowDays * 86400000;
  const renewalStart = expiresAtMs - windowMs;
  const renewalEnd = expiresAtMs + windowMs;
  return currentTimestampMs >= renewalStart && currentTimestampMs <= renewalEnd;
}
