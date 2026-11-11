export type MasterPortalStatus = 'on' | 'off' | 'coming_soon';

export interface PricingPackage {
  id: string;
  nameAm: string;
  nameEn: string;
  nameOr: string;
  prices: {
    free: number;
    premium: number;
    business: number;
  };
  isFeatured?: boolean;
  postCount?: number;
  durationDays?: number;
  discountPercent?: number;
  discountEndDate?: string;
  activeStartDate?: string;
  activeEndDate?: string;
}

export interface TaxonomyItem {
  id: string;
  nameAm: string;
  nameEn: string;
  nameOr: string;
  order: number;
  hidden: boolean;
}

export interface JobPortalSettings {
  masterStatus: MasterPortalStatus;
  // Feature switches
  employerRegistrationOpen: boolean;
  employerApprovalRequired: boolean;
  reviewBeforePublishing: boolean;
  skipReviewForVerified: boolean;
  applicationsEnabled: boolean;
  savedJobsEnabled: boolean;
  cvImproveAiEnabled: boolean;
  applicantPdfExportEnabled: boolean;
  featuredPostsEnabled: boolean;
  reportsEnabled: boolean;
  externalContactJobsAllowed: boolean;

  // Numeric rules
  jobDurationDays: number;
  renewalWindowDays: number;
  maxActivePostsPerPlan: {
    free: number;
    premium: number;
    business: number;
  };
  freePostsPerMonthPerPlan: {
    free: number;
    premium: number;
    business: number;
  };
  maxApplicationsPerSeekerPerDay: number;

  // Pricing Table
  packages: PricingPackage[];

  // TeleBirr Details & Instructions (3 languages)
  telebirrReceivingNumber: string;
  telebirrAccountName: string;
  paymentInstructionsAm: string;
  paymentInstructionsEn: string;
  paymentInstructionsOr: string;

  // Moderation
  bannedWords: string[];

  // Taxonomies (Categories, Cities, Job Types)
  categories: TaxonomyItem[];
  cities: TaxonomyItem[];
  jobTypes: TaxonomyItem[];

  // Announcement Banner
  bannerEnabled: boolean;
  bannerMessageAm: string;
  bannerMessageEn: string;
  bannerMessageOr: string;
}

export interface EmployerAccount {
  id: string;
  companyName: string;
  logoUrl?: string;
  email: string;
  phone: string;
  city: string;
  website?: string;
  tinNumber?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  isVerified: boolean;
  rejectionReason?: string;
  plan: 'free' | 'premium' | 'business';
  customPricingOverrides?: Record<string, number>; // packageId -> custom price in ETB
  customFreePostAllowance?: number;
  freePostsUsedThisMonth: number;
  activeJobsCount: number;
  totalJobsCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface PortalJobListing {
  id: string;
  employerId: string;
  employerName: string;
  employerVerified: boolean;
  title: string;
  category: string;
  city: string;
  jobType: string;
  salaryText: string;
  description: string;
  requirements: string[];
  applicationType: 'internal' | 'external' | 'email' | 'phone';
  externalUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'expired' | 'draft';
  rejectionReason?: string;
  isFeatured: boolean;
  featuredUntil?: number;
  expiresAt: number;
  applicationsCount: number;
  viewsCount: number;
  createdAt: number;
  publishedAt?: number;
}

export interface PortalPaymentRecord {
  id: string;
  employerId: string;
  employerName: string;
  jobId?: string;
  jobTitle?: string;
  plan: 'free' | 'premium' | 'business';
  packageId: string;
  packageName: string;
  expectedPriceSnapshot: number; // Stored price that applied at that moment
  transactionId: string;
  screenshotUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: number;
  approvedAt?: number;
  adminUid?: string;
}

export interface PortalReportRecord {
  id: string;
  targetType: 'job' | 'employer';
  targetId: string;
  targetTitle: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone?: string;
  reason: string;
  details: string;
  status: 'open' | 'dismissed' | 'action_taken';
  actionNote?: string;
  createdAt: number;
}
