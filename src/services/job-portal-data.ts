import {
  EmployerAccount,
  JobPortalSettings,
  PortalJobListing,
  PortalPaymentRecord,
  PortalReportRecord,
  PricingPackage,
  TaxonomyItem,
} from '../types/job-portal';
import { adminStore } from './admin-data';

export const DEFAULT_PORTAL_SETTINGS: JobPortalSettings = {
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

  packages: [
    {
      id: 'pkg_single',
      nameAm: 'ነጠላ ማስታወቂያ (Single Post)',
      nameEn: 'Single Job Post',
      nameOr: 'Beeksisa Tokko',
      prices: {
        free: 350,
        premium: 250,
        business: 150,
      },
      postCount: 1,
      durationDays: 30,
      isFeatured: false,
    },
    {
      id: 'pkg_5pack',
      nameAm: 'የ 5 ማስታወቂያዎች ጥቅል (5-Post Pack)',
      nameEn: '5-Job Post Pack',
      nameOr: 'Paakeejii Beeksisa 5',
      prices: {
        free: 1500,
        premium: 1000,
        business: 600,
      },
      postCount: 5,
      durationDays: 30,
      isFeatured: false,
      discountPercent: 15,
      discountEndDate: '2026-12-31T23:59:59.000Z',
    },
    {
      id: 'pkg_featured',
      nameAm: 'የደመቀ/ተመራጭ ማስታወቂያ (Featured Post)',
      nameEn: 'Featured Pinned Post',
      nameOr: 'Beeksisa Addaa (Featured)',
      prices: {
        free: 600,
        premium: 450,
        business: 300,
      },
      postCount: 1,
      durationDays: 30,
      isFeatured: true,
    },
    {
      id: 'pkg_renewal',
      nameAm: 'የማስታወቂያ እድሳት (Job Renewal)',
      nameEn: 'Job Renewal',
      nameOr: 'Haressoodha Beeksisaa',
      prices: {
        free: 250,
        premium: 180,
        business: 100,
      },
      postCount: 1,
      durationDays: 30,
      isFeatured: false,
    },
  ],

  telebirrReceivingNumber: '0911223344',
  telebirrAccountName: 'Ethio AI Hub / Tadesse G.',
  paymentInstructionsAm: 'እባክዎ የተመረጠውን የጥቅል ክፍያ ወደ 0911223344 በቴሌብር ይላኩ፤ የትራንዛክሽን ቁጥሩንና ስክሪንሾቱን በማስገባት ያስገቡ።',
  paymentInstructionsEn: 'Please transfer the exact package amount via TeleBirr to 0911223344, then enter the Transaction ID and screenshot.',
  paymentInstructionsOr: 'Mallaqa paakeejii filatame TeleBirr lakkoofsa 0911223344 irratti ergaa, sana booda lakkoofsa waraqaa ragaa galchaa.',

  bannedWords: [
    'scam',
    'ponzi',
    'forex hack',
    'pyramid',
    '100% guarantee',
    'advance fee',
    'የተከለከለ',
    'ቀብድ ክፈሉ',
    'ያለስራ ፈጣን ሀብት',
  ],

  categories: [
    { id: 'cat_tech', nameAm: 'ሶፍትዌርና አይቲ', nameEn: 'Software & IT', nameOr: 'Sofitweerii fi IT', order: 1, hidden: false },
    { id: 'cat_finance', nameAm: 'ሂሳብና ፋይናንስ', nameEn: 'Accounting & Finance', nameOr: 'Herrega fi Faayinaansii', order: 2, hidden: false },
    { id: 'cat_sales', nameAm: 'ሽያጭና ማርኬቲንግ', nameEn: 'Sales & Marketing', nameOr: 'Gurgurtaa fi Daldala', order: 3, hidden: false },
    { id: 'cat_health', nameAm: 'ጤናና ህክምና', nameEn: 'Healthcare & Medicine', nameOr: 'Fayyaa fi Yaala', order: 4, hidden: false },
    { id: 'cat_eng', nameAm: 'ኢንጂነሪንግና ኮንስትራክሽን', nameEn: 'Engineering & Construction', nameOr: 'Injinariingii fi Ijaarsa', order: 5, hidden: false },
    { id: 'cat_edu', nameAm: 'ትምህርትና ማስተማር', nameEn: 'Education & Teaching', nameOr: 'Barnoota fi Barsiisuu', order: 6, hidden: false },
    { id: 'cat_cust', nameAm: 'የደንበኞች አገልግሎት', nameEn: 'Customer Support', nameOr: 'Tajaajila Maamilaa', order: 7, hidden: false },
    { id: 'cat_hotel', nameAm: 'ሆቴልና ቱሪዝም', nameEn: 'Hospitality & Tourism', nameOr: 'Hoteela fi Tuurizimii', order: 8, hidden: false },
  ],

  cities: [
    { id: 'city_addis', nameAm: 'አዲስ አበባ', nameEn: 'Addis Ababa', nameOr: 'Finfinnee', order: 1, hidden: false },
    { id: 'city_hawassa', nameAm: 'ሀዋሳ', nameEn: 'Hawassa', nameOr: 'Hawaasaa', order: 2, hidden: false },
    { id: 'city_adama', nameAm: 'አዳማ', nameEn: 'Adama', nameOr: 'Adaamaa', order: 3, hidden: false },
    { id: 'city_bahirdar', nameAm: 'ባህር ዳር', nameEn: 'Bahir Dar', nameOr: 'Baahir Daar', order: 4, hidden: false },
    { id: 'city_diredawa', nameAm: 'ድሬዳዋ', nameEn: 'Dire Dawa', nameOr: 'Dirree Dhawaa', order: 5, hidden: false },
    { id: 'city_mekelle', nameAm: 'መቀሌ', nameEn: 'Mekelle', nameOr: 'Maqalee', order: 6, hidden: false },
    { id: 'city_remote', nameAm: 'የርቀት / በኦንላይን', nameEn: 'Remote / Online', nameOr: 'Fagoo / Onlaayinii', order: 7, hidden: false },
  ],

  jobTypes: [
    { id: 'type_full', nameAm: 'ሙሉ ሰዓት', nameEn: 'Full-time', nameOr: 'Yeroo Guutuu', order: 1, hidden: false },
    { id: 'type_part', nameAm: 'የትርፍ ሰዓት', nameEn: 'Part-time', nameOr: 'Yeroo Gartokkee', order: 2, hidden: false },
    { id: 'type_remote', nameAm: 'የርቀት ስራ', nameEn: 'Remote', nameOr: 'Hojii Fagoo', order: 3, hidden: false },
    { id: 'type_contract', nameAm: 'የኮንትራት', nameEn: 'Contract', nameOr: 'Waliigaltee', order: 4, hidden: false },
    { id: 'type_intern', nameAm: 'የልምምድ', nameEn: 'Internship', nameOr: 'Shaakala', order: 5, hidden: false },
  ],

  bannerEnabled: true,
  bannerMessageAm: 'አዲስ፡ አሰሪዎች አሁን በኢትዮ ስራ ፖርታል በቴሌብር በቀጥታ ከፍለው የስራ ማስታወቂያቸውን ማስተዋወቅ ይችላሉ!',
  bannerMessageEn: 'New: Employers can now post, promote, and receive verified applications via Ethio Job Portal instantly!',
  bannerMessageOr: 'Haaraa: Hojjechiiftonni amma TeleBirr dhaan kaffalanii beeksisa hojii qulqulluu baasuu dandeessu!',
};

export const INITIAL_EMPLOYERS: EmployerAccount[] = [
  {
    id: 'emp_001',
    companyName: 'Gebeya Inc.',
    logoUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&q=80',
    email: 'hr@gebeya.com',
    phone: '+251 911 234 567',
    city: 'Addis Ababa',
    website: 'https://gebeya.com',
    tinNumber: '0049281741',
    status: 'approved',
    isVerified: true,
    plan: 'business',
    freePostsUsedThisMonth: 3,
    activeJobsCount: 4,
    totalJobsCount: 18,
    createdAt: Date.now() - 90 * 86400000,
    updatedAt: Date.now() - 2 * 86400000,
  },
  {
    id: 'emp_002',
    companyName: 'Ride Delivery Services (Hybrid)',
    logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&q=80',
    email: 'careers@ride.et',
    phone: '+251 922 889 900',
    city: 'Addis Ababa',
    website: 'https://ride.et',
    tinNumber: '0081293450',
    status: 'approved',
    isVerified: true,
    plan: 'premium',
    freePostsUsedThisMonth: 1,
    activeJobsCount: 2,
    totalJobsCount: 8,
    createdAt: Date.now() - 60 * 86400000,
    updatedAt: Date.now() - 5 * 86400000,
  },
  {
    id: 'emp_003',
    companyName: 'Zemen Logistics & Cargo',
    email: 'admin@zemenlogistics.et',
    phone: '+251 933 112 233',
    city: 'Hawassa',
    website: 'https://zemenlogistics.et',
    tinNumber: '0077192844',
    status: 'pending',
    isVerified: false,
    plan: 'free',
    freePostsUsedThisMonth: 0,
    activeJobsCount: 0,
    totalJobsCount: 0,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'emp_004',
    companyName: 'Ethio Fast Forex Traders',
    email: 'fastcash@ethioforex.com',
    phone: '+251 944 555 666',
    city: 'Addis Ababa',
    tinNumber: '0000000000',
    status: 'suspended',
    isVerified: false,
    rejectionReason: 'ተገቢ ያልሆነና የቅድመ ክፍያ የሚጠይቅ የሃሰት ስራ ማስታወቂያ በመለጠፉ ታግዷል።',
    plan: 'free',
    freePostsUsedThisMonth: 0,
    activeJobsCount: 0,
    totalJobsCount: 2,
    createdAt: Date.now() - 120 * 86400000,
    updatedAt: Date.now() - 10 * 86400000,
  },
];

export const INITIAL_PORTAL_JOBS: PortalJobListing[] = [
  {
    id: 'pjob_001',
    employerId: 'emp_001',
    employerName: 'Gebeya Inc.',
    employerVerified: true,
    title: 'Senior Full Stack Developer (React & Node.js)',
    category: 'cat_tech',
    city: 'city_addis',
    jobType: 'type_full',
    salaryText: '45,000 - 65,000 ETB / Month',
    description: 'We are looking for a Senior Full Stack Engineer to lead web and AI-driven platforms in Addis Ababa.',
    requirements: ['3+ years in React & Node.js', 'Experience with cloud deployment and PostgreSQL', 'Strong problem solving skills'],
    applicationType: 'internal',
    status: 'approved',
    isFeatured: true,
    featuredUntil: Date.now() + 15 * 86400000,
    expiresAt: Date.now() + 25 * 86400000,
    applicationsCount: 38,
    viewsCount: 420,
    createdAt: Date.now() - 5 * 86400000,
    publishedAt: Date.now() - 5 * 86400000,
  },
  {
    id: 'pjob_002',
    employerId: 'emp_002',
    employerName: 'Ride Delivery Services',
    employerVerified: true,
    title: 'Senior Fleet & Logistics Operations Manager',
    category: 'cat_sales',
    city: 'city_addis',
    jobType: 'type_full',
    salaryText: '35,000 - 50,000 ETB / Month',
    description: 'Lead urban logistics, driver coordination, and dispatch performance across Addis Ababa.',
    requirements: ['BA in Logistics, Business or Engineering', '2+ years operations experience', 'Ethiopian driver license'],
    applicationType: 'internal',
    status: 'approved',
    isFeatured: false,
    expiresAt: Date.now() + 20 * 86400000,
    applicationsCount: 19,
    viewsCount: 280,
    createdAt: Date.now() - 10 * 86400000,
    publishedAt: Date.now() - 10 * 86400000,
  },
  {
    id: 'pjob_003',
    employerId: 'emp_003',
    employerName: 'Zemen Logistics & Cargo',
    employerVerified: false,
    title: 'Warehouse Supervisor (ሀዋሳ)',
    category: 'cat_cust',
    city: 'city_hawassa',
    jobType: 'type_full',
    salaryText: '18,000 - 25,000 ETB',
    description: 'በሀዋሳ ከተማ ለሚገኘው የጭነት ማስተናገጃ መጋዘን ልምድ ያለው ሱፐርቫይዘር እንፈልጋለን።',
    requirements: ['በማኔጅመንት ወይም አቅርቦት ሰንሰለት የተመረቀ/ች', 'ቢያንስ 1 አመት ልምድ'],
    applicationType: 'internal',
    status: 'pending_review',
    isFeatured: false,
    expiresAt: Date.now() + 30 * 86400000,
    applicationsCount: 0,
    viewsCount: 12,
    createdAt: Date.now() - 4 * 3600000,
  },
  {
    id: 'pjob_004',
    employerId: 'emp_001',
    employerName: 'Gebeya Inc.',
    employerVerified: true,
    title: 'Junior AI Prompt Engineer & Annotator',
    category: 'cat_tech',
    city: 'city_remote',
    jobType: 'type_remote',
    salaryText: '20,000 - 30,000 ETB / Month',
    description: 'Work remotely on Amharic and Afaan Oromoo dataset evaluations and prompt optimization.',
    requirements: ['Strong linguistic skills in Amharic and Afaan Oromoo', 'Familiarity with LLMs and chat prompts'],
    applicationType: 'internal',
    status: 'pending_review',
    isFeatured: true,
    expiresAt: Date.now() + 30 * 86400000,
    applicationsCount: 0,
    viewsCount: 5,
    createdAt: Date.now() - 1 * 3600000,
  },
];

export const INITIAL_PORTAL_PAYMENTS: PortalPaymentRecord[] = [
  {
    id: 'ppay_001',
    employerId: 'emp_002',
    employerName: 'Ride Delivery Services',
    jobId: 'pjob_002',
    jobTitle: 'Senior Fleet & Logistics Operations Manager',
    plan: 'premium',
    packageId: 'pkg_featured',
    packageName: 'Featured Pinned Post',
    expectedPriceSnapshot: 450,
    transactionId: 'TB99882211',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    status: 'pending',
    submittedAt: Date.now() - 2 * 3600000,
  },
  {
    id: 'ppay_002',
    employerId: 'emp_001',
    employerName: 'Gebeya Inc.',
    plan: 'business',
    packageId: 'pkg_5pack',
    packageName: '5-Job Post Pack',
    expectedPriceSnapshot: 600,
    transactionId: 'CL12345678',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
    status: 'pending',
    submittedAt: Date.now() - 6 * 3600000,
  },
  {
    id: 'ppay_003',
    employerId: 'emp_001',
    employerName: 'Gebeya Inc.',
    jobId: 'pjob_001',
    jobTitle: 'Senior Full Stack Developer',
    plan: 'business',
    packageId: 'pkg_single',
    packageName: 'Single Job Post',
    expectedPriceSnapshot: 150,
    transactionId: 'RA88229900',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    status: 'approved',
    submittedAt: Date.now() - 86400000 * 5,
    approvedAt: Date.now() - 86400000 * 5,
    adminUid: 'admin_primary_01',
  },
];

export const INITIAL_PORTAL_REPORTS: PortalReportRecord[] = [
  {
    id: 'prep_001',
    targetType: 'job',
    targetId: 'pjob_003',
    targetTitle: 'Warehouse Supervisor (ሀዋሳ)',
    reporterName: 'Kaleb Getachew',
    reporterEmail: 'kaleb.g@gmail.com',
    reporterPhone: '+251 911 889900',
    reason: 'የስራ ማመልከቻ ለመቀበል የቅድመ ክፍያ 500 ብር ጠይቀዋል',
    details: 'በቴሌግራም አነጋግሬያቸው ለፈተና መመዝገቢያ በሚል 500 ብር እንድልክ ጠይቀውኛል። እባክዎ ይመርምሩ።',
    status: 'open',
    createdAt: Date.now() - 86400000 * 1,
  },
];

const JOB_PORTAL_STORAGE_KEY = 'ethio_job_portal_state_v1';

export class JobPortalDataStore {
  settings: JobPortalSettings = { ...DEFAULT_PORTAL_SETTINGS };
  employers: EmployerAccount[] = [...INITIAL_EMPLOYERS];
  jobs: PortalJobListing[] = [...INITIAL_PORTAL_JOBS];
  payments: PortalPaymentRecord[] = [...INITIAL_PORTAL_PAYMENTS];
  reports: PortalReportRecord[] = [...INITIAL_PORTAL_REPORTS];

  listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(): void {
    this.saveToStorage();
    for (const listener of this.listeners) {
      listener();
    }
  }

  loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(JOB_PORTAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.settings) this.settings = parsed.settings;
        if (parsed.employers) this.employers = parsed.employers;
        if (parsed.jobs) this.jobs = parsed.jobs;
        if (parsed.payments) this.payments = parsed.payments;
        if (parsed.reports) this.reports = parsed.reports;
      }
    } catch {
      // Fallback to initial
    }
  }

  saveToStorage(): void {
    try {
      const data = {
        settings: this.settings,
        employers: this.employers,
        jobs: this.jobs,
        payments: this.payments,
        reports: this.reports,
      };
      localStorage.setItem(JOB_PORTAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  }

  // --- Settings & Feature Control ---
  updateSettings(updates: Partial<JobPortalSettings>): void {
    const prev = JSON.stringify(this.settings);
    Object.assign(this.settings, updates);
    adminStore.logAction(
      'Job Portal Settings Updated (jobPortalSettings/main)',
      'Global Portal Config',
      prev.slice(0, 100) + '...',
      JSON.stringify(updates)
    );
    this.notify();
  }

  // Packages
  savePackage(pkg: PricingPackage): void {
    const idx = this.settings.packages.findIndex((p) => p.id === pkg.id);
    if (idx !== -1) {
      const prev = JSON.stringify(this.settings.packages[idx]);
      this.settings.packages[idx] = pkg;
      adminStore.logAction('Job Portal Pricing Package Updated', pkg.nameEn, prev, JSON.stringify(pkg));
    } else {
      this.settings.packages.push(pkg);
      adminStore.logAction('Job Portal Pricing Package Added', pkg.nameEn, undefined, JSON.stringify(pkg));
    }
    this.notify();
  }

  deletePackage(pkgId: string): void {
    const pkg = this.settings.packages.find((p) => p.id === pkgId);
    if (pkg) {
      this.settings.packages = this.settings.packages.filter((p) => p.id !== pkgId);
      adminStore.logAction('Job Portal Pricing Package Deleted', pkg.nameEn);
      this.notify();
    }
  }

  // Taxonomies
  updateTaxonomy(type: 'categories' | 'cities' | 'jobTypes', items: TaxonomyItem[]): void {
    this.settings[type] = items;
    adminStore.logAction(`Job Portal ${type} Updated`, `${items.length} items`);
    this.notify();
  }

  // Banned Words
  addBannedWord(word: string): void {
    const clean = word.trim().toLowerCase();
    if (clean && !this.settings.bannedWords.includes(clean)) {
      this.settings.bannedWords.push(clean);
      adminStore.logAction('Job Portal Banned Word Added', clean);
      this.notify();
    }
  }

  removeBannedWord(word: string): void {
    this.settings.bannedWords = this.settings.bannedWords.filter((w) => w !== word);
    adminStore.logAction('Job Portal Banned Word Removed', word);
    this.notify();
  }

  // --- Employers ---
  approveEmployer(id: string): void {
    const emp = this.employers.find((e) => e.id === id);
    if (!emp) return;
    const prev = emp.status;
    emp.status = 'approved';
    emp.updatedAt = Date.now();
    adminStore.logAction('Employer Account Approved', `${emp.companyName} (${emp.id})`, `Status: ${prev}`, 'Status: approved');
    this.notify();
  }

  rejectEmployer(id: string, reason: string): void {
    const emp = this.employers.find((e) => e.id === id);
    if (!emp) return;
    emp.status = 'rejected';
    emp.rejectionReason = reason;
    emp.updatedAt = Date.now();
    adminStore.logAction('Employer Account Rejected', `${emp.companyName} (${emp.id})`, undefined, `Reason: ${reason}`);
    this.notify();
  }

  toggleEmployerSuspend(id: string): void {
    const emp = this.employers.find((e) => e.id === id);
    if (!emp) return;
    const prev = emp.status;
    emp.status = emp.status === 'suspended' ? 'approved' : 'suspended';
    emp.updatedAt = Date.now();
    adminStore.logAction(
      emp.status === 'suspended' ? 'Employer Account Suspended' : 'Employer Account Restored',
      `${emp.companyName} (${emp.id})`,
      `Status: ${prev}`,
      `Status: ${emp.status}`
    );
    this.notify();
  }

  toggleEmployerVerified(id: string): void {
    const emp = this.employers.find((e) => e.id === id);
    if (!emp) return;
    const prev = emp.isVerified;
    emp.isVerified = !emp.isVerified;
    emp.updatedAt = Date.now();
    adminStore.logAction(
      emp.isVerified ? 'Employer Verified Badge Granted' : 'Employer Verified Badge Revoked',
      `${emp.companyName} (${emp.id})`,
      `Verified: ${prev}`,
      `Verified: ${emp.isVerified}`
    );
    this.notify();
  }

  setEmployerCustomAllowance(
    id: string,
    customFreePosts: number,
    customOverrides: Record<string, number>
  ): void {
    const emp = this.employers.find((e) => e.id === id);
    if (!emp) return;
    emp.customFreePostAllowance = customFreePosts;
    emp.customPricingOverrides = customOverrides;
    emp.updatedAt = Date.now();
    adminStore.logAction(
      'Employer Custom Allowance / Pricing Override Saved',
      `${emp.companyName} (${emp.id})`,
      undefined,
      `FreePosts: ${customFreePosts}, Overrides: ${JSON.stringify(customOverrides)}`
    );
    this.notify();
  }

  // --- Jobs Moderation ---
  approveJob(id: string): void {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) return;
    const prev = job.status;
    job.status = 'approved';
    job.publishedAt = Date.now();
    job.expiresAt = Date.now() + this.settings.jobDurationDays * 86400000;

    // Update employer active count
    const emp = this.employers.find((e) => e.id === job.employerId);
    if (emp) {
      emp.activeJobsCount = (emp.activeJobsCount || 0) + 1;
      emp.totalJobsCount = (emp.totalJobsCount || 0) + 1;
    }

    adminStore.logAction(
      'Job Moderation: Approved & Published',
      `${job.title} (${job.employerName})`,
      `Status: ${prev}`,
      `Status: approved, Expires: ${new Date(job.expiresAt).toLocaleDateString()}`
    );
    this.notify();
  }

  rejectJob(id: string, reason: string): void {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) return;
    const prev = job.status;
    job.status = 'rejected';
    job.rejectionReason = reason;

    adminStore.logAction(
      'Job Moderation: Rejected',
      `${job.title} (${job.employerName})`,
      `Status: ${prev}`,
      `Status: rejected, Reason: ${reason}`
    );
    this.notify();
  }

  deleteJob(id: string): void {
    const job = this.jobs.find((j) => j.id === id);
    if (job) {
      this.jobs = this.jobs.filter((j) => j.id !== id);
      const emp = this.employers.find((e) => e.id === job.employerId);
      if (emp && emp.activeJobsCount > 0) {
        emp.activeJobsCount -= 1;
      }
      adminStore.logAction('Job Listing Deleted', `${job.title} (${job.employerName})`);
      this.notify();
    }
  }

  toggleJobFeatured(id: string): void {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) return;
    job.isFeatured = !job.isFeatured;
    if (job.isFeatured) {
      job.featuredUntil = Date.now() + 15 * 86400000;
    } else {
      job.featuredUntil = undefined;
    }
    adminStore.logAction(
      job.isFeatured ? 'Job Marked as Featured Pinned' : 'Job Unpinned',
      `${job.title} (${job.employerName})`
    );
    this.notify();
  }

  extendJobDuration(id: string, additionalDays: number): void {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) return;
    const currentExpiry = job.expiresAt > Date.now() ? job.expiresAt : Date.now();
    job.expiresAt = currentExpiry + additionalDays * 86400000;
    if (job.status === 'expired') {
      job.status = 'approved';
    }
    adminStore.logAction(
      'Job Duration Extended',
      `${job.title} (+${additionalDays} days)`,
      undefined,
      `New Expiry: ${new Date(job.expiresAt).toLocaleDateString()}`
    );
    this.notify();
  }

  saveJob(job: PortalJobListing): void {
    const idx = this.jobs.findIndex((j) => j.id === job.id);
    if (idx !== -1) {
      this.jobs[idx] = job;
      adminStore.logAction('Job Details Edited by Admin', job.title);
    } else {
      this.jobs.unshift(job);
      adminStore.logAction('New Job Added by Admin', job.title);
    }
    this.notify();
  }

  // --- Payments ---
  approvePayment(paymentId: string): { success: boolean; message: string } {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, message: 'Payment record not found' };
    if (payment.status === 'approved') return { success: false, message: 'Payment already approved' };

    payment.status = 'approved';
    payment.approvedAt = Date.now();
    payment.adminUid = 'admin_primary_01';

    // If payment is linked to a job, approve/renew that job
    if (payment.jobId) {
      const job = this.jobs.find((j) => j.id === payment.jobId);
      if (job) {
        job.status = 'approved';
        job.publishedAt = Date.now();
        job.expiresAt = Date.now() + this.settings.jobDurationDays * 86400000;
        if (payment.packageId === 'pkg_featured') {
          job.isFeatured = true;
          job.featuredUntil = Date.now() + 15 * 86400000;
        }
      }
    }

    adminStore.logAction(
      'Job Portal Payment Approved',
      `Payment ${payment.id} for ${payment.employerName} (Package: ${payment.packageName})`,
      'Status: pending',
      `Status: approved, Applied Price: ${payment.expectedPriceSnapshot} ETB, TX: ${payment.transactionId}`
    );
    this.notify();
    return { success: true, message: `Payment approved! Applied snapshot price: ${payment.expectedPriceSnapshot} ETB` };
  }

  rejectPayment(paymentId: string, reason: string): { success: boolean; message: string } {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, message: 'Payment record not found' };

    payment.status = 'rejected';
    payment.rejectionReason = reason;

    adminStore.logAction(
      'Job Portal Payment Rejected',
      `Payment ${payment.id} for ${payment.employerName}`,
      'Status: pending',
      `Status: rejected, Reason: ${reason}`
    );
    this.notify();
    return { success: true, message: 'Payment marked as rejected' };
  }

  // --- Reports ---
  dismissReport(reportId: string): void {
    const rep = this.reports.find((r) => r.id === reportId);
    if (!rep) return;
    rep.status = 'dismissed';
    adminStore.logAction('Job Portal Report Dismissed', `${rep.targetTitle} (Report ${reportId})`);
    this.notify();
  }

  takeActionOnReport(
    reportId: string,
    actionNote: string,
    removeJob: boolean,
    suspendEmployer: boolean
  ): void {
    const rep = this.reports.find((r) => r.id === reportId);
    if (!rep) return;
    rep.status = 'action_taken';
    rep.actionNote = actionNote;

    if (removeJob && rep.targetType === 'job') {
      this.deleteJob(rep.targetId);
    }
    if (suspendEmployer) {
      const employerId = rep.targetType === 'employer' ? rep.targetId : this.jobs.find((j) => j.id === rep.targetId)?.employerId;
      if (employerId) {
        this.toggleEmployerSuspend(employerId);
      }
    }

    adminStore.logAction(
      'Job Portal Report Action Taken',
      `${rep.targetTitle} (Report ${reportId})`,
      'Status: open',
      `Action: ${actionNote}, RemovedJob: ${removeJob}, SuspendedEmployer: ${suspendEmployer}`
    );
    this.notify();
  }
}

export const jobPortalStore = new JobPortalDataStore();
