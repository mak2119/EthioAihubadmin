export type Language = 'am' | 'en' | 'or';

export type UserPlan = 'free' | 'premium' | 'business';
export type UserStatus = 'active' | 'suspended';

export interface UserAccount {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  plan: UserPlan;
  status: UserStatus;
  createdAt: number;
  subscriptionEndDate?: number;
  lastLoginAt: number;
  chatsUsedToday: number;
  unlockedCourses?: string[];
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'info_requested';

export interface PaymentRequest {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  plan: UserPlan;
  billingPeriod: 'monthly' | 'annual';
  expectedAmount: number;
  paymentMethod: 'telebirr' | 'cbe' | 'mpesa';
  transactionId: string;
  screenshotUrl: string;
  submissionDate: number;
  status: PaymentStatus;
  adminNotes?: string;
  processedAt?: number;
  processedByAdminUid?: string;
}

export interface AITool {
  id: string;
  nameAm: string;
  nameEn: string;
  nameOr: string;
  descriptionAm: string;
  descriptionEn: string;
  icon: string;
  order: number;
  enabled: boolean;
  isMaintenance: boolean;
  freeAccess: boolean;
  premiumAccess: boolean;
  businessAccess: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryText: string;
  description: string;
  requirements: string[];
  applicationUrl: string;
  published: boolean;
  deadline: string;
  createdAt: number;
  updatedAt: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  type: 'rental' | 'sale' | 'commercial' | 'villa' | 'apartment';
  priceEtb: number;
  period?: 'monthly' | 'total';
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  contactPhone: string;
  imageUrl: string;
  published: boolean;
  submittedBy?: string;
  favoritesCount: number;
  createdAt: number;
}

export interface BrokerReport {
  id: string;
  brokerName: string;
  brokerPhone: string;
  reason: string;
  submittedDate: number;
  evidenceUrl?: string;
  status: 'pending' | 'under_review' | 'rejected' | 'dismissed';
  adminNotes?: string;
  userEmail: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  content: string;
  order: number;
}

export interface CourseQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface AcademyCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  priceEtb: number;
  language: 'am' | 'en' | 'or';
  published: boolean;
  thumbnailUrl: string;
  lessons: CourseLesson[];
  quizzes: CourseQuizQuestion[];
  enrolledCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface CoursePayment {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  transactionId: string;
  screenshotUrl: string;
  submissionDate: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}

export interface ComplaintTicket {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  category: 'technical' | 'payment' | 'ai_response' | 'account' | 'general';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  createdAt: number;
  adminReply?: string;
  resolvedAt?: number;
}

export interface BroadcastNotification {
  id: string;
  title: string;
  message: string;
  category: 'general' | 'maintenance' | 'jobs' | 'academy' | 'homes' | 'subscription' | 'ethiodrive';
  targetAudience: 'all' | 'free' | 'premium' | 'business' | 'individual';
  targetUid?: string;
  createdAt: number;
  sentAt?: number;
  status: 'draft' | 'scheduled' | 'sent';
}

export interface OfficialSource {
  id: string;
  sourceName: string;
  sourceUrl: string;
  category: 'traffic_fines' | 'license_renewal' | 'road_safety' | 'transport_decree';
  title: string;
  content: string;
  lastCheckedDate: string;
  approved: boolean;
}

export interface TransactionVerification {
  id: string;
  service: 'telebirr' | 'cbe' | 'mpesa';
  transactionId: string;
  amount: number;
  senderName: string;
  senderPhone: string;
  submissionDate: number;
  screenshotUrl: string;
  notes: string;
  status: 'pending' | 'verified' | 'rejected' | 'suspicious';
  verificationMethod: string;
  verifiedAt?: number;
}

export interface AdminAuditLog {
  id: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  targetRecord: string;
  timestamp: number;
  previousValue?: string;
  newValue?: string;
}

export interface PlatformSettings {
  platformName: string;
  platformLogoUrl: string;
  websiteTitle: string;
  contactEmail: string;
  contactPhone: string;
  telegramLink: string;
  developerHandle: string;
  defaultLanguage: Language;
  telebirrPhone: string;
  telebirrAccountName: string;
  telebirrInstructions: string;
  monthlyPremiumPrice: number;
  annualPremiumPrice: number;
  monthlyBusinessPrice: number;
  annualBusinessPrice: number;
  annualDiscountPercent: number;
  freeDailyChatLimit: number;
  premiumDailyChatLimit: number;
  isMaintenanceMode: boolean;
  maintenanceMessageAm: string;
  maintenanceMessageEn: string;
  maintenanceMessageOr: string;
  maintenanceEstimatedReopening: string;
  homepageAnnouncement: string;
}
