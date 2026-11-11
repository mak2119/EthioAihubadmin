import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePackagePrice,
  canEmployerPostFree,
  checkJobPostingLimits,
  scanBannedWords,
  determineInitialJobStatus,
  isJobInRenewalWindow,
} from './job-portal-logic';
import { EmployerAccount, JobPortalSettings, PricingPackage } from '../types/job-portal';

const samplePackage: PricingPackage = {
  id: 'pkg_single',
  nameAm: 'ነጠላ ማስታወቂያ (Single Post)',
  nameEn: 'Single Post',
  nameOr: 'Beeksisa Tokko',
  prices: {
    free: 350,
    premium: 250,
    business: 150,
  },
  durationDays: 30,
};

const sampleSettings: JobPortalSettings = {
  masterStatus: 'on',
  employerRegistrationOpen: true,
  employerApprovalRequired: true,
  reviewBeforePublishing: true,
  skipReviewForVerified: true,
  applicationsEnabled: true,
  savedJobsEnabled: true,
  cvImproveAiEnabled: true,
  applicantPdfExportEnabled: true,
  featuredPostsEnabled: true,
  reportsEnabled: true,
  externalContactJobsAllowed: true,
  jobDurationDays: 30,
  renewalWindowDays: 7,
  maxActivePostsPerPlan: {
    free: 2,
    premium: 10,
    business: 50,
  },
  freePostsPerMonthPerPlan: {
    free: 1,
    premium: 3,
    business: 10,
  },
  maxApplicationsPerSeekerPerDay: 5,
  packages: [samplePackage],
  telebirrReceivingNumber: '0911223344',
  telebirrAccountName: 'Ethio AI Hub / Tadesse G.',
  paymentInstructionsAm: 'ቴሌብር',
  paymentInstructionsEn: 'TeleBirr',
  paymentInstructionsOr: 'TeleBirr',
  bannedWords: ['scam', 'forex hack', 'pyramid', 'ponzi', 'የተከለከለ'],
  categories: [],
  cities: [],
  jobTypes: [],
  bannerEnabled: false,
  bannerMessageAm: '',
  bannerMessageEn: '',
  bannerMessageOr: '',
};

test('calculatePackagePrice returns correct base plan price', () => {
  assert.equal(calculatePackagePrice(samplePackage, 'free'), 350);
  assert.equal(calculatePackagePrice(samplePackage, 'premium'), 250);
  assert.equal(calculatePackagePrice(samplePackage, 'business'), 150);
});

test('calculatePackagePrice prioritizes employer custom override', () => {
  const overrides = { pkg_single: 99 };
  assert.equal(calculatePackagePrice(samplePackage, 'free', overrides), 99);
  assert.equal(calculatePackagePrice(samplePackage, 'business', overrides), 99);
});

test('calculatePackagePrice handles active discount and expired discount', () => {
  const discountedPkg: PricingPackage = {
    ...samplePackage,
    discountPercent: 20, // 20% off
    discountEndDate: '2026-12-31T23:59:59.000Z',
  };

  const now = new Date('2026-11-11T00:00:00.000Z').getTime();
  // 350 - 20% = 280
  assert.equal(calculatePackagePrice(discountedPkg, 'free', undefined, now), 280);

  // Expired discount
  const futureNow = new Date('2027-01-01T00:00:00.000Z').getTime();
  assert.equal(calculatePackagePrice(discountedPkg, 'free', undefined, futureNow), 350);
});

test('canEmployerPostFree checks quota correctly', () => {
  const employer: EmployerAccount = {
    id: 'emp_01',
    companyName: 'Bole Tech',
    email: 'info@boletech.et',
    phone: '0911000000',
    city: 'Addis Ababa',
    status: 'approved',
    isVerified: true,
    plan: 'free',
    freePostsUsedThisMonth: 0,
    activeJobsCount: 0,
    totalJobsCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const res1 = canEmployerPostFree(employer, sampleSettings);
  assert.equal(res1.allowed, true);
  assert.equal(res1.remaining, 1);

  employer.freePostsUsedThisMonth = 1;
  const res2 = canEmployerPostFree(employer, sampleSettings);
  assert.equal(res2.allowed, false);
  assert.equal(res2.remaining, 0);

  // Custom employer allowance
  employer.customFreePostAllowance = 5;
  const res3 = canEmployerPostFree(employer, sampleSettings);
  assert.equal(res3.allowed, true);
  assert.equal(res3.remaining, 4);
});

test('checkJobPostingLimits enforces plan active limits', () => {
  const employer: EmployerAccount = {
    id: 'emp_02',
    companyName: 'Addis Soft',
    email: 'hr@addissoft.et',
    phone: '0911000000',
    city: 'Addis Ababa',
    status: 'approved',
    isVerified: false,
    plan: 'free', // limit is 2
    freePostsUsedThisMonth: 1,
    activeJobsCount: 1,
    totalJobsCount: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  assert.equal(checkJobPostingLimits(employer, sampleSettings).allowed, true);

  employer.activeJobsCount = 2;
  assert.equal(checkJobPostingLimits(employer, sampleSettings).allowed, false);
});

test('scanBannedWords flags prohibited words', () => {
  const clean = scanBannedWords('Urgent Software Engineer in Addis Ababa', sampleSettings.bannedWords);
  assert.equal(clean.hasBanned, false);
  assert.equal(clean.foundWords.length, 0);

  const spam = scanBannedWords('Make 100k daily with this FOREX HACK and ponzi link', sampleSettings.bannedWords);
  assert.equal(spam.hasBanned, true);
  assert.deepEqual(spam.foundWords, ['forex hack', 'ponzi']);
});

test('determineInitialJobStatus respects moderation and verification bypass', () => {
  const unverified: EmployerAccount = {
    id: 'emp_03',
    companyName: 'New Start',
    email: 'new@start.et',
    phone: '0911000000',
    city: 'Hawassa',
    status: 'approved',
    isVerified: false,
    plan: 'free',
    freePostsUsedThisMonth: 0,
    activeJobsCount: 0,
    totalJobsCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const verified: EmployerAccount = {
    ...unverified,
    isVerified: true,
  };

  // Review is enabled and skipReviewForVerified is true
  assert.equal(determineInitialJobStatus(unverified, sampleSettings), 'pending_review');
  assert.equal(determineInitialJobStatus(verified, sampleSettings), 'approved');

  // If review is disabled entirely
  const noReviewSettings: JobPortalSettings = {
    ...sampleSettings,
    reviewBeforePublishing: false,
  };
  assert.equal(determineInitialJobStatus(unverified, noReviewSettings), 'approved');
});

test('isJobInRenewalWindow detects renewal timeframe', () => {
  const expiresAt = 100000000;
  const windowDays = 7;
  const windowMs = 7 * 86400000;

  // Exactly on expiration
  assert.equal(isJobInRenewalWindow(expiresAt, windowDays, expiresAt), true);
  // 3 days before expiration
  assert.equal(isJobInRenewalWindow(expiresAt, windowDays, expiresAt - 3 * 86400000), true);
  // 10 days before expiration (outside window)
  assert.equal(isJobInRenewalWindow(expiresAt, windowDays, expiresAt - 10 * 86400000), false);
});
