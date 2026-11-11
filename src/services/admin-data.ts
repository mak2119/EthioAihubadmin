import {
  UserAccount,
  PaymentRequest,
  AITool,
  JobListing,
  PropertyListing,
  BrokerReport,
  AcademyCourse,
  CoursePayment,
  ComplaintTicket,
  BroadcastNotification,
  OfficialSource,
  TransactionVerification,
  AdminAuditLog,
  PlatformSettings,
  UserPlan,
} from '../types/admin';

import {
  calculateSubscriptionExpiry,
  calculateNotificationDispatchTime,
  validateToolRestrictions,
} from '../utils/admin-logic';

export const INITIAL_SETTINGS: PlatformSettings = {
  platformName: 'Ethio AI Hub',
  platformLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&q=80',
  websiteTitle: 'Ethio AI Hub - Ethiopia’s #1 AI & Utility Ecosystem',
  contactEmail: 'contact@ethioaihub.et',
  contactPhone: '+251 911 223 344',
  telegramLink: 'https://t.me/ethioai_hub',
  developerHandle: '@TadeApps',
  defaultLanguage: 'am',
  telebirrPhone: '0911223344',
  telebirrAccountName: 'Ethio AI Hub / Tadesse G.',
  telebirrInstructions: 'እባክዎ ትክክለኛውን የክፍያ መጠን ወደ 0911223344 በቴሌብር ይላኩ፤ ከዚያም የተላከበትን የግብይት መለያ ቁጥር (Transaction ID) እና ስክሪንሾት ያስገቡ።',
  monthlyPremiumPrice: 250,
  annualPremiumPrice: 2700,
  monthlyBusinessPrice: 600,
  annualBusinessPrice: 6480,
  annualDiscountPercent: 10,
  freeDailyChatLimit: 12,
  premiumDailyChatLimit: 50,
  isMaintenanceMode: false,
  maintenanceMessageAm: 'ውድ የኢትዮ አይአይ ሀብ ተጠቃሚዎች፣ ሲስተማችን አዳዲስ አቅሞችን ለመጨመር በታቀደ ጥገና ላይ ይገኛል። በቅርቡ እንመለሳለን!',
  maintenanceMessageEn: 'Dear Ethio AI Hub users, we are currently performing scheduled maintenance to roll out new features. We will be back shortly!',
  maintenanceMessageOr: 'Kabajamtoota maamiltoota Ethio AI Hub, dandeettii haaraa dabalachuuf sirni keenya suphaa karoorfame keessa jira. Dhiyootti deebina!',
  maintenanceEstimatedReopening: '2026-11-12T18:00:00.000Z',
  homepageAnnouncement: 'እንኳን ወደ ኢትዮ አይአይ ሀብ በደህና መጡ! አዳዲስ የአይአይ ስራ ፈጠራ ኮርሶች በኢትዮ አካዳሚ ተለቀዋል!',
};

export const INITIAL_TOOLS: AITool[] = [
  {
    id: 'ai-assistant',
    nameAm: 'አይአይ ረዳት (AI Assistant)',
    nameEn: 'AI Assistant',
    nameOr: 'Gargaaraa AI',
    descriptionAm: 'ለአማርኛ፣ ኦሮምኛ እና እንግሊዝኛ የተዘጋጀ ሁለገብ የማሰብና የመመለስ ረዳት',
    descriptionEn: 'Omni-purpose intelligence trained for Ethiopian multilingual workflows',
    icon: 'Bot',
    order: 1,
    enabled: true,
    isMaintenance: false,
    freeAccess: true,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'job-finder',
    nameAm: 'የስራ ፈላጊ (Job Finder)',
    nameEn: 'Job Finder',
    nameOr: 'Barbaadaa Hojii',
    descriptionAm: 'በኢትዮጵያ ውስጥ ያሉ የቅርብ ጊዜ የስራ ማስታወቂያዎችን የማጣሪያና የማመልከቻ ረዳት',
    descriptionEn: 'Ethiopian verified job vacancy search with smart CV matching',
    icon: 'Briefcase',
    order: 2,
    enabled: true,
    isMaintenance: false,
    freeAccess: true,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'education-helper',
    nameAm: 'የትምህርት ረዳት (Education Helper)',
    nameEn: 'Education Helper',
    nameOr: 'Gargaaraa Barnootaa',
    descriptionAm: 'ለተማሪዎች የፈተና ጥያቄዎች ማብራሪያ፣ የሂሳብና የሳይንስ ትምህርቶች ድጋፍ',
    descriptionEn: 'Curriculum-aligned homework, math, and national exam revision assistant',
    icon: 'GraduationCap',
    order: 3,
    enabled: true,
    isMaintenance: false,
    freeAccess: true,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'document-writer',
    nameAm: 'የደብዳቤና ሰነድ አዘጋጅ (Document Writer)',
    nameEn: 'Document Writer',
    nameOr: 'Qopheessaa Sanadaa',
    descriptionAm: 'የስራ ማመልከቻ፣ የስራ መልቀቂያ፣ የውል ሰነዶች እና ፕሮፖዛሎችን በደቂቃዎች ውስጥ ማመንጫ',
    descriptionEn: 'Formal Ethiopian business letters, contracts, and proposals generator',
    icon: 'FileText',
    order: 4,
    enabled: true,
    isMaintenance: false,
    freeAccess: true,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'translator',
    nameAm: 'ተርጓሚ (Translator)',
    nameEn: 'Multilingual Translator',
    nameOr: 'Hiikaa Afaanii',
    descriptionAm: 'አማርኛ፣ አፋን ኦሮሞ፣ ትግርኛ እና እንግሊዝኛን በትክክለኛ የባህል አገባብ መተርጎሚያ',
    descriptionEn: 'Context-aware Ethiopian vernacular translation and grammar engine',
    icon: 'Languages',
    order: 5,
    enabled: true,
    isMaintenance: false,
    freeAccess: true,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'business-helper',
    nameAm: 'የንግድ ረዳት (Business Helper)',
    nameEn: 'Business Helper',
    nameOr: 'Gargaaraa Daldalaa',
    descriptionAm: 'የንግድ እቅድ ማዘጋጃ፣ የግብይት ስልት እና የኢትዮጵያ ታክስ ህጎች መመሪያ',
    descriptionEn: 'Local business plan generation, marketing funnels, and tax regulations',
    icon: 'TrendingUp',
    order: 6,
    enabled: true,
    isMaintenance: false,
    freeAccess: false,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'home-finder',
    nameAm: 'የቤት ፈላጊ (Home Finder)',
    nameEn: 'Home Finder',
    nameOr: 'Barbaadaa Manaa',
    descriptionAm: 'የኪራይና የሽያጭ ቤቶች፣ አፓርታማዎች እና ቪላዎች መፈለጊያ መድረክ',
    descriptionEn: 'Verified residential rentals, villas, and commercial real estate',
    icon: 'Home',
    order: 7,
    enabled: true,
    isMaintenance: false,
    freeAccess: true,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'money-planner',
    nameAm: 'የገንዘብ እቅድ (Money Planner)',
    nameEn: 'Money Planner',
    nameOr: 'Karoorsaa Maallaqaa',
    descriptionAm: 'የወርሃዊ ወጪዎች ቁጥጥር፣ የቁጠባ እቅድ እና የዕቁብ አስተዳደር ማዕከል',
    descriptionEn: 'Personal budget, savings goals, and Equb cycle tracker',
    icon: 'DollarSign',
    order: 8,
    enabled: true,
    isMaintenance: false,
    freeAccess: false,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'health-assistant',
    nameAm: 'የጤና ረዳት (Health Assistant)',
    nameEn: 'Health Assistant',
    nameOr: 'Gargaaraa Fayyaa',
    descriptionAm: 'የመጀመሪያ ደረጃ የጤና ምክሮች፣ የአመጋገብ ስርዓት እና የመጀመሪያ እርዳታ መመሪያ',
    descriptionEn: 'First-aid guidance, nutrition plans, and wellness lifestyle checks',
    icon: 'HeartPulse',
    order: 9,
    enabled: true,
    isMaintenance: false,
    freeAccess: false,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'ethio-drive',
    nameAm: 'ኢትዮ ድራይቭ (Ethio Drive)',
    nameEn: 'Ethio Drive',
    nameOr: 'Itoophiyaa Draayivii',
    descriptionAm: 'የትራፊክ ህጎች፣ የመንጃ ፍቃድ ፈተና መለማመጃ እና የትራፊክ ቅጣት ተመኖች',
    descriptionEn: 'Driving license practice, official traffic fines, and road safety handbook',
    icon: 'Car',
    order: 10,
    enabled: true,
    isMaintenance: false,
    freeAccess: true,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'ethio-academy',
    nameAm: 'ኢትዮ አካዳሚ (Ethio Academy)',
    nameEn: 'Ethio Academy',
    nameOr: 'Itoophiyaa Akaadaamii',
    descriptionAm: 'የዲጂታል ክህሎቶች፣ የአይአይ ቴክኖሎጂ እና የፍሪላንስ ስራ ፈጠራ ኮርሶች',
    descriptionEn: 'Structured interactive courses with lesson exams and certificates',
    icon: 'BookOpen',
    order: 11,
    enabled: true,
    isMaintenance: false,
    freeAccess: true,
    premiumAccess: true,
    businessAccess: true,
  },
  {
    id: 'ethio-verify',
    nameAm: 'ኢትዮ ቬሪፋይ (EthioVerify)',
    nameEn: 'EthioVerify',
    nameOr: 'EthioVerify',
    descriptionAm: 'የቴሌብር እና የባንክ ደረሰኞች ትክክለኛነት ማረጋገጫና የደህንነት መቆጣጠሪያ',
    descriptionEn: 'Fraud prevention and transaction confirmation verification suite',
    icon: 'ShieldCheck',
    order: 12,
    enabled: true,
    isMaintenance: false,
    freeAccess: false,
    premiumAccess: false,
    businessAccess: true,
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    uid: 'usr_001',
    displayName: 'Alemayehu Tadesse',
    email: 'alemayehu.t@gmail.com',
    phone: '+251911456789',
    plan: 'business',
    status: 'active',
    createdAt: Date.now() - 65 * 86400000,
    subscriptionEndDate: Date.now() + 180 * 86400000,
    lastLoginAt: Date.now() - 3600000,
    chatsUsedToday: 42,
    unlockedCourses: ['course_001', 'course_002'],
  },
  {
    uid: 'usr_002',
    displayName: 'Bethlehem Haile',
    email: 'betti.haile@yahoo.com',
    phone: '+251922334455',
    plan: 'premium',
    status: 'active',
    createdAt: Date.now() - 40 * 86400000,
    subscriptionEndDate: Date.now() + 14 * 86400000,
    lastLoginAt: Date.now() - 7200000,
    chatsUsedToday: 18,
    unlockedCourses: ['course_001'],
  },
  {
    uid: 'usr_003',
    displayName: 'Chala Gemechu',
    email: 'chala.g@outlook.com',
    phone: '+251933778899',
    plan: 'free',
    status: 'active',
    createdAt: Date.now() - 25 * 86400000,
    lastLoginAt: Date.now() - 86400000,
    chatsUsedToday: 8,
  },
  {
    uid: 'usr_004',
    displayName: 'Dawit Mengistu',
    email: 'dawit.m@gmail.com',
    phone: '+251944112233',
    plan: 'premium',
    status: 'active',
    createdAt: Date.now() - 50 * 86400000,
    subscriptionEndDate: Date.now() - 2 * 86400000, // Expired! Needs auto-expiration check
    lastLoginAt: Date.now() - 172800000,
    chatsUsedToday: 0,
  },
  {
    uid: 'usr_005',
    displayName: 'Eden Solomon',
    email: 'eden.solo@gmail.com',
    phone: '+251955998877',
    plan: 'free',
    status: 'suspended',
    createdAt: Date.now() - 90 * 86400000,
    lastLoginAt: Date.now() - 800000000,
    chatsUsedToday: 0,
  },
  {
    uid: 'usr_006',
    displayName: 'Fikadu Wolde',
    email: 'fikadu.w@gmail.com',
    phone: '+251966224466',
    plan: 'business',
    status: 'active',
    createdAt: Date.now() - 12 * 86400000,
    subscriptionEndDate: Date.now() + 320 * 86400000,
    lastLoginAt: Date.now() - 1800000,
    chatsUsedToday: 65,
    unlockedCourses: ['course_001', 'course_002'],
  },
];

export const INITIAL_PAYMENTS: PaymentRequest[] = [
  {
    id: 'pay_001',
    uid: 'usr_007',
    userName: 'Kidus Worku',
    userEmail: 'kidus.w@gmail.com',
    userPhone: '+251912345678',
    plan: 'premium',
    billingPeriod: 'monthly',
    expectedAmount: 250,
    paymentMethod: 'telebirr',
    transactionId: 'CL98234190',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    submissionDate: Date.now() - 3600000 * 2,
    status: 'pending',
  },
  {
    id: 'pay_002',
    uid: 'usr_008',
    userName: 'Selamawit Kebede',
    userEmail: 'selam.kebede@gmail.com',
    userPhone: '+251911998822',
    plan: 'business',
    billingPeriod: 'annual',
    expectedAmount: 6480,
    paymentMethod: 'telebirr',
    transactionId: 'RA78441209',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
    submissionDate: Date.now() - 3600000 * 5,
    status: 'pending',
  },
  {
    id: 'pay_003',
    uid: 'usr_002',
    userName: 'Bethlehem Haile',
    userEmail: 'betti.haile@yahoo.com',
    userPhone: '+251922334455',
    plan: 'premium',
    billingPeriod: 'monthly',
    expectedAmount: 250,
    paymentMethod: 'telebirr',
    transactionId: 'TB55619283',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    submissionDate: Date.now() - 86400000 * 2,
    status: 'approved',
    processedAt: Date.now() - 86400000,
    processedByAdminUid: 'admin_primary_01',
  },
  {
    id: 'pay_004',
    uid: 'usr_009',
    userName: 'Tewodros Kassaye',
    userEmail: 'teddy.k@gmail.com',
    userPhone: '+251944556677',
    plan: 'premium',
    billingPeriod: 'monthly',
    expectedAmount: 250,
    paymentMethod: 'telebirr',
    transactionId: 'CL00998811',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    submissionDate: Date.now() - 86400000 * 4,
    status: 'rejected',
    adminNotes: 'የተላከው ስክሪንሾት ጥራት የጎደለውና የግብይት ቁጥሩ በቴሌብር ሲስተም አልተገኘም።',
    processedAt: Date.now() - 86400000 * 3,
    processedByAdminUid: 'admin_primary_01',
  },
];

export const INITIAL_JOBS: JobListing[] = [
  {
    id: 'job_001',
    title: 'Senior Full Stack Developer (React & Node.js)',
    company: 'Gebeya Inc.',
    location: 'Bole, Addis Ababa (Hybrid)',
    salaryText: '45,000 - 65,000 ETB / Month',
    description: 'We are seeking an experienced Full Stack Engineer to lead high-impact financial tech solutions.',
    requirements: ['3+ years React & Node.js', 'Experience with PostgreSQL or Firestore', 'Fluent in English and Amharic'],
    applicationUrl: 'https://gebeya.com/careers/fullstack',
    published: true,
    deadline: '2026-12-15',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'job_002',
    title: 'Digital Marketing & Content Specialist',
    company: 'Ride Delivery Services',
    location: 'Kazanchis, Addis Ababa',
    salaryText: '25,000 - 35,000 ETB / Month',
    description: 'Manage social media campaigns, Telegram channels, and viral growth initiatives in Ethiopia.',
    requirements: ['Proven track record in social marketing', 'Graphic design & video editing', 'Creative Amharic copywriter'],
    applicationUrl: 'https://t.me/ethioai_hub',
    published: true,
    deadline: '2026-11-30',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'job_003',
    title: 'Junior AI Prompt Engineer & Annotator',
    company: 'Ethio AI Labs',
    location: 'CMC, Addis Ababa',
    salaryText: '20,000 - 28,000 ETB / Month',
    description: 'Help annotate Amharic and Afaan Oromoo datasets and evaluate LLM responses for high fidelity.',
    requirements: ['B.Sc in Computer Science, Linguistics or related field', 'Strong analytical mindset'],
    applicationUrl: 'https://ethioaihub.et/careers',
    published: false,
    deadline: '2026-12-01',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
];

export const INITIAL_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop_001',
    title: 'ዘመናዊ ባለ 3 መኝታ ቪላ ቤት ከነ ሙሉ እቃው',
    type: 'rental',
    priceEtb: 45000,
    period: 'monthly',
    location: 'ቦሌ ሩዋንዳ (Bole Rwanda)',
    city: 'Addis Ababa',
    bedrooms: 3,
    bathrooms: 3,
    description: 'ውብ የአትክልት ስፍራ ያለው፣ ጸጥታ የሰፈነበት አካባቢ፣ ለዲፕሎማቶችና ለቤተሰብ ምቹ።',
    contactPhone: '+251 911 345 678',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    published: true,
    favoritesCount: 38,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'prop_002',
    title: 'G+2 Luxury Villa for Sale in Ayat',
    type: 'sale',
    priceEtb: 38000000,
    period: 'total',
    location: 'አያት ዞን 3 (Ayat Zone 3)',
    city: 'Addis Ababa',
    bedrooms: 5,
    bathrooms: 5,
    description: 'ካርታ ያለው፣ ዘመናዊ ፊኒሺንግ፣ ሰፊ የመኪና ማቆሚያ እና የጥበቃ ቤት የተሟላለት።',
    contactPhone: '+251 922 887 766',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    published: true,
    favoritesCount: 94,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'prop_003',
    title: 'ባለ 2 መኝታ አዲስ አፓርታማ ኪራይ',
    type: 'apartment',
    priceEtb: 28000,
    period: 'monthly',
    location: 'ገርጂ ሮቤል አደባባይ (Gerji)',
    city: 'Addis Ababa',
    bedrooms: 2,
    bathrooms: 2,
    description: 'አሳንሰርና ጀነሬተር ያለው ዘመናዊ ህንጻ፣ ቅርብ መንገድ ያለው።',
    contactPhone: '+251 933 112 233',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    published: false, // Pending admin approval
    favoritesCount: 12,
    createdAt: Date.now() - 86400000 * 1,
  },
];

export const INITIAL_BROKERS: BrokerReport[] = [
  {
    id: 'rep_001',
    brokerName: 'Mulugeta Tesfaye (ደላላ ሙሉጌታ)',
    brokerPhone: '+251 911 887 654',
    reason: 'የቅድመ ክፍያ ተቀብሎ የተሰጠውን አድራሻ አላሳየም፣ ስልኩም ዝግ ሆኗል።',
    submittedDate: Date.now() - 86400000 * 2,
    evidenceUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    status: 'pending',
    userEmail: 'user.victim@gmail.com',
  },
  {
    id: 'rep_002',
    brokerName: 'Solomon Abera (ኮሚሽን ደላላ ሰለሞን)',
    brokerPhone: '+251 922 119 900',
    reason: 'የቤት ባለቤት ሳያውቅ ሌላ ዋጋ ጨምሮ በመጠየቅ አሳሳች መረጃ ሰጥቷል።',
    submittedDate: Date.now() - 86400000 * 7,
    status: 'under_review',
    adminNotes: 'የተጠቀሰው ቤት ባለቤት ተጠርቶ እየተጣራ ነው።',
    userEmail: 'buyer.witness@yahoo.com',
  },
];

export const INITIAL_COURSES: AcademyCourse[] = [
  {
    id: 'course_001',
    title: 'AI Prompt Engineering & Freelancing for Ethiopians',
    description: 'በአማርኛና በእንግሊዝኛ የተዘጋጀ፣ በአለም አቀፍ የፍሪላንስ መድረኮች (Upwork, Fiverr) በአይአይ በመታገዝ ስራ መስራት የሚያስችል አጠቃላይ ኮርስ።',
    instructor: 'Tadesse G. (Senior AI Engineer)',
    priceEtb: 500,
    language: 'am',
    published: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    enrolledCount: 342,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 2,
    lessons: [
      {
        id: 'les_001',
        title: 'ምዕራፍ 1፡ የአይአይ ሞዴሎች አሰራር እና ትክክለኛ የPrompt አፃፃፍ ስልት',
        durationMinutes: 25,
        content: 'የአይአይ ሞዴሎችን ስንጠቀም ትክክለኛውን መልስ ለማግኘት ዐውድ (Context)፣ ሚና (Role) እና የተፈለገውን የውጤት ቅርጸት (Format) በግልጽ ማስቀመጥ ወሳኝ ነው።',
        order: 1,
      },
      {
        id: 'les_002',
        title: 'ምዕራፍ 2፡ ሰነዶችን፣ ኢሜሎችን እና ማመልከቻዎችን በአይአይ ማዘጋጀት',
        durationMinutes: 30,
        content: 'በዚህ ምዕራፍ ውስጥ ፕሮፌሽናል ደብዳቤዎችንና የፕሮጀክት ሀሳቦችን በደቂቃዎች ውስጥ ለማዘጋጀት የሚረዱ ዝርዝር መመሪያዎችን እንመለከታለን።',
        order: 2,
      },
      {
        id: 'les_003',
        title: 'ምዕራፍ 3፡ በአለም አቀፍ የፍሪላንስ ገበያ ስራዎችን መፈለግና በዶላር መካፈል',
        durationMinutes: 45,
        content: 'Upwork እና ሌሎች መድረኮች ላይ ፕሮፋይል አከፋፈት፣ የክፍያ መቀበያ ዘዴዎች እና የአይአይ መሳሪያዎችን በመጠቀም ስራዎችን በአጭር ጊዜ ማጠናቀቅ።',
        order: 3,
      },
    ],
    quizzes: [
      {
        id: 'quiz_001',
        question: 'በአይአይ Prompt ውስጥ "Role Prompting" ማለት ምን ማለት ነው?',
        options: [
          'ለአይአይ ሞዴሉ የተወሰነ ሙያ ወይም ማንነት መስጠት (ምሳሌ፡ እንደ ልምድ ያለው የህግ ባለሙያ ሆነህ መልስ)',
          'የይለፍ ቃል መቀየር',
          'የኮምፒውተር ስክሪን ብርሃን መጨመር',
          'ምንም ትርጉም የለውም',
        ],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: 'course_002',
    title: 'Python & Automation for Beginners (በአማርኛ)',
    description: 'የኮዲንግ እውቀት ለሌላቸው የሚሆን፣ ስራዎችን በራስ-ሰር (Automation) ለማከናወን የሚረዳ ተግባራዊ የፓይተን ትምህርት።',
    instructor: 'Ermias Belay (Software Architect)',
    priceEtb: 650,
    language: 'am',
    published: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
    enrolledCount: 188,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 5,
    lessons: [
      {
        id: 'les_004',
        title: 'ምዕራፍ 1፡ ፓይተን መጫን እና የመጀመሪያው ፕሮግራም',
        durationMinutes: 20,
        content: 'ፓይተንን በኮምፒውተራችን ላይ መጫን እና የፕሮግራሚንግ መሰረታዊ ህጎችን መረዳት።',
        order: 1,
      },
    ],
    quizzes: [],
  },
];

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'cmp_001',
    uid: 'usr_010',
    userName: 'Kaleb Getachew',
    userEmail: 'kaleb.g@gmail.com',
    category: 'payment',
    subject: 'የቴሌብር ክፍያ ከፍዬ ፕሪሚየም አልበራም',
    description: 'ዛሬ ጠዋት 250 ብር በቴሌብር ከፍያለሁ፤ የትራንዛክሽን ቁጥሩን CL889922 ልኬያለሁ ነገር ግን እስካሁን አካውንቴ ነፃ ላይ ነው ያለው። እባክዎ ይፈትሹልኝ።',
    priority: 'urgent',
    status: 'pending',
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'cmp_002',
    uid: 'usr_011',
    userName: 'Martha Abebe',
    userEmail: 'martha.a@yahoo.com',
    category: 'technical',
    subject: 'በአፋን ኦሮሞ ተርጓሚው ላይ አንዳንድ ቃላት እየተቆራረጡ ነው',
    description: 'በተርጓሚው ረጅም ጽሁፍ ሳስገባ የመጨረሻው አንቀጽ አልተተረጎመም።',
    priority: 'medium',
    status: 'in_progress',
    createdAt: Date.now() - 86400000 * 1,
    adminReply: 'ሰላም ማርታ፣ ችግሩን በቴክኒካል ቡድኑ እየተመለከትን ነው። እስከዚያው በአጭር በአጭሩ ጽሁፍ ተጠቅመው እንዲሞክሩ እንመክራለን።',
  },
];

export const INITIAL_NOTIFICATIONS: BroadcastNotification[] = [
  {
    id: 'notif_001',
    title: 'የኢትዮ አካዳሚ አዲስ ኮርስ ተለቋል!',
    message: 'የአይአይ ፕሮምፕት ኢንጂነሪንግና ፍሪላንሲንግ ኮርስ አሁን ለሁሉም ተጠቃሚዎች ክፍት ሆኗል!',
    category: 'academy',
    targetAudience: 'all',
    createdAt: Date.now() - 86400000 * 2,
    status: 'sent',
    sentAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'notif_002',
    title: 'የታቀደ ሲስተም ጥገና ማስታወቂያ',
    message: 'እሁድ ከምሽቱ 4:00 እስከ 6:00 ሰአት የዳታቤዝ ማሻሻያ ስለሚደረግ አጭር መቆራረጥ ሊኖር ይችላል።',
    category: 'maintenance',
    targetAudience: 'all',
    createdAt: Date.now() - 86400000 * 4,
    status: 'sent',
    sentAt: Date.now() - 86400000 * 4,
  },
];

export const INITIAL_OFFICIAL_SOURCES: OfficialSource[] = [
  {
    id: 'src_001',
    sourceName: 'የአዲስ አበባ ከተማ ትራፊክ ማኔጅመንት ኤጀንሲ',
    sourceUrl: 'https://traffic.addisababa.gov.et',
    category: 'traffic_fines',
    title: 'የአዲሱ የትራፊክ ደንብ መተላለፍ የቅጣት ተመን ዝርዝር (2018 ዓ.ም)',
    content: 'ቀይ መብራት መጣስ 2,500 ብር፣ በፍጥነት ማሽከርከር ከ1,500 እስከ 3,000 ብር፣ ያለመንጃ ፍቃድ ማሽከርከር 5,000 ብር እና መኪና ማገድ።',
    lastCheckedDate: '2026-11-01',
    approved: true,
  },
  {
    id: 'src_002',
    sourceName: 'የትራንስፖርትና ሎጂስቲክስ ሚኒስቴር',
    sourceUrl: 'https://motl.gov.et',
    category: 'license_renewal',
    title: 'የመንጃ ፍቃድ እድሳትና የህክምና ምርመራ መስፈርቶች',
    content: 'የመንጃ ፍቃድ እድሳት በየ 4 ዓመቱ የሚከናወን ሲሆን የዓይንና አጠቃላይ የጤና ምርመራ ማረጋገጫ በኦንላይን ሲስተም በኩል መቅረብ አለበት።',
    lastCheckedDate: '2026-11-05',
    approved: true,
  },
];

export const INITIAL_VERIFICATIONS: TransactionVerification[] = [
  {
    id: 'ver_001',
    service: 'telebirr',
    transactionId: 'CL98234190',
    amount: 250,
    senderName: 'Kidus Worku',
    senderPhone: '0912345678',
    submissionDate: Date.now() - 3600000 * 2,
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    notes: 'Premium monthly subscription payment verification request',
    status: 'pending',
    verificationMethod: 'TeleBirr Official Merchant Portal Portal Re-check',
  },
  {
    id: 'ver_002',
    service: 'cbe',
    transactionId: 'FT2611090019',
    amount: 6480,
    senderName: 'Selamawit Kebede',
    senderPhone: '0911998822',
    submissionDate: Date.now() - 3600000 * 5,
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80',
    notes: 'Business annual plan payment CBE Birr mobile app slip',
    status: 'pending',
    verificationMethod: 'Commercial Bank of Ethiopia (CBE) 889 SMS confirmation log',
  },
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_001',
    adminUid: 'admin_primary_01',
    adminEmail: 'admin@ethioaihub.et',
    action: 'Payment Approved & Subscription Activated',
    targetRecord: 'pay_003 (Bethlehem Haile)',
    timestamp: Date.now() - 86400000,
    previousValue: 'Status: Pending, Plan: Free',
    newValue: 'Status: Approved, Plan: Premium (Exp: 30 days)',
  },
  {
    id: 'log_002',
    adminUid: 'admin_primary_01',
    adminEmail: 'admin@ethioaihub.et',
    action: 'AI Tool Access Restricted for Free Tier',
    targetRecord: 'money-planner',
    timestamp: Date.now() - 86400000 * 3,
    previousValue: 'Free: true',
    newValue: 'Free: false (Premium & Business only)',
  },
  {
    id: 'log_003',
    adminUid: 'admin_primary_01',
    adminEmail: 'admin@ethioaihub.et',
    action: 'Academy Course Published',
    targetRecord: 'course_001 (AI Prompt Engineering)',
    timestamp: Date.now() - 86400000 * 5,
    previousValue: 'Published: false',
    newValue: 'Published: true',
  },
];

const STORAGE_KEY = 'ethio_ai_hub_admin_state_v1';

export class AdminDataStore {
  settings: PlatformSettings = { ...INITIAL_SETTINGS };
  tools: AITool[] = [...INITIAL_TOOLS];
  users: UserAccount[] = [...INITIAL_USERS];
  payments: PaymentRequest[] = [...INITIAL_PAYMENTS];
  jobs: JobListing[] = [...INITIAL_JOBS];
  properties: PropertyListing[] = [...INITIAL_PROPERTIES];
  brokers: BrokerReport[] = [...INITIAL_BROKERS];
  courses: AcademyCourse[] = [...INITIAL_COURSES];
  coursePayments: CoursePayment[] = [];
  complaints: ComplaintTicket[] = [...INITIAL_COMPLAINTS];
  notifications: BroadcastNotification[] = [...INITIAL_NOTIFICATIONS];
  officialSources: OfficialSource[] = [...INITIAL_OFFICIAL_SOURCES];
  verifications: TransactionVerification[] = [...INITIAL_VERIFICATIONS];
  auditLogs: AdminAuditLog[] = [...INITIAL_AUDIT_LOGS];

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
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.settings) this.settings = parsed.settings;
        if (parsed.tools) this.tools = parsed.tools;
        if (parsed.users) this.users = parsed.users;
        if (parsed.payments) this.payments = parsed.payments;
        if (parsed.jobs) this.jobs = parsed.jobs;
        if (parsed.properties) this.properties = parsed.properties;
        if (parsed.brokers) this.brokers = parsed.brokers;
        if (parsed.courses) this.courses = parsed.courses;
        if (parsed.coursePayments) this.coursePayments = parsed.coursePayments;
        if (parsed.complaints) this.complaints = parsed.complaints;
        if (parsed.notifications) this.notifications = parsed.notifications;
        if (parsed.officialSources) this.officialSources = parsed.officialSources;
        if (parsed.verifications) this.verifications = parsed.verifications;
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
      }
    } catch {
      // Use defaults if storage read fails
    }
  }

  saveToStorage(): void {
    try {
      const data = {
        settings: this.settings,
        tools: this.tools,
        users: this.users,
        payments: this.payments,
        jobs: this.jobs,
        properties: this.properties,
        brokers: this.brokers,
        courses: this.courses,
        coursePayments: this.coursePayments,
        complaints: this.complaints,
        notifications: this.notifications,
        officialSources: this.officialSources,
        verifications: this.verifications,
        auditLogs: this.auditLogs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage unavailable
    }
  }

  resetToDefaults(): void {
    this.settings = { ...INITIAL_SETTINGS };
    this.tools = [...INITIAL_TOOLS];
    this.users = [...INITIAL_USERS];
    this.payments = [...INITIAL_PAYMENTS];
    this.jobs = [...INITIAL_JOBS];
    this.properties = [...INITIAL_PROPERTIES];
    this.brokers = [...INITIAL_BROKERS];
    this.courses = [...INITIAL_COURSES];
    this.coursePayments = [];
    this.complaints = [...INITIAL_COMPLAINTS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.officialSources = [...INITIAL_OFFICIAL_SOURCES];
    this.verifications = [...INITIAL_VERIFICATIONS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.logAction('System Reset', 'Entire platform state reloaded to initial demo state');
    this.notify();
  }

  logAction(action: string, targetRecord: string, previousValue?: string, newValue?: string): void {
    const log: AdminAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminUid: 'admin_primary_01',
      adminEmail: 'admin@ethioaihub.et',
      action,
      targetRecord,
      timestamp: Date.now(),
      previousValue,
      newValue,
    };
    this.auditLogs = [log, ...this.auditLogs];
  }

  // --- Payment Approval / Rejection Workflow ---
  approvePayment(paymentId: string, adminNotes?: string): { success: boolean; message: string } {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, message: 'Payment record not found' };
    if (payment.status === 'approved') return { success: false, message: 'Payment already approved' };

    const prevStatus = payment.status;
    payment.status = 'approved';
    payment.processedAt = Date.now();
    payment.processedByAdminUid = 'admin_primary_01';
    if (adminNotes) payment.adminNotes = adminNotes;

    // Activate/update user subscription
    let user = this.users.find((u) => u.uid === payment.uid);
    if (!user) {
      // Create user if not existing
      user = {
        uid: payment.uid,
        displayName: payment.userName,
        email: payment.userEmail,
        phone: payment.userPhone,
        plan: 'free',
        status: 'active',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        chatsUsedToday: 0,
      };
      this.users.push(user);
    }

    const prevPlan = user.plan;
    user.plan = payment.plan;
    user.subscriptionEndDate = calculateSubscriptionExpiry(Date.now(), payment.billingPeriod);

    this.logAction(
      'Payment Approved & Subscription Activated',
      `${payment.id} for ${user.displayName}`,
      `Status: ${prevStatus}, User Plan: ${prevPlan}`,
      `Status: approved, Plan: ${payment.plan}, Expiry: ${new Date(user.subscriptionEndDate).toLocaleDateString()}`
    );

    // Notify user
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'የክፍያ ማረጋገጫና የአካውንት እድሳት',
      message: `ውድ ${user.displayName}፣ የ${payment.plan.toUpperCase()} ፕላን ክፍያዎ ተረጋግጧል! አሁን ሁሉንም የተፈቀዱ አገልግሎቶች መጠቀም ይችላሉ።`,
      category: 'subscription',
      targetAudience: 'individual',
      targetUid: user.uid,
      createdAt: Date.now(),
      status: 'sent',
      sentAt: Date.now(),
    });

    this.notify();
    return { success: true, message: 'Payment verified and subscription activated successfully' };
  }

  rejectPayment(paymentId: string, reason: string): { success: boolean; message: string } {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, message: 'Payment record not found' };

    const prevStatus = payment.status;
    payment.status = 'rejected';
    payment.adminNotes = reason;
    payment.processedAt = Date.now();
    payment.processedByAdminUid = 'admin_primary_01';

    this.logAction(
      'Payment Rejected',
      `${payment.id} (${payment.userName})`,
      `Status: ${prevStatus}`,
      `Status: rejected, Reason: ${reason}`
    );

    // Notify user
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'የክፍያ ማረጋገጫ ውድቅ ተደርጓል',
      message: `ውድ ${payment.userName}፣ ያስገቡት ክፍያ በሚከተለው ምክንያት ተቀባይነት አላገኘም፡ ${reason}`,
      category: 'subscription',
      targetAudience: 'individual',
      targetUid: payment.uid,
      createdAt: Date.now(),
      status: 'sent',
      sentAt: Date.now(),
    });

    this.notify();
    return { success: true, message: 'Payment marked as rejected' };
  }

  // --- Automatic Expiration Checker (Simulated Cloudflare Worker Scheduled Job) ---
  runDailyExpirationCheck(): { expiredCount: number; details: string[] } {
    const now = Date.now();
    let expiredCount = 0;
    const details: string[] = [];

    for (const user of this.users) {
      if (
        user.plan !== 'free' &&
        user.subscriptionEndDate &&
        user.subscriptionEndDate <= now
      ) {
        const prevPlan = user.plan;
        user.plan = 'free';
        expiredCount++;
        const detail = `${user.displayName} (${user.email}): ${prevPlan} -> free`;
        details.push(detail);

        this.logAction(
          'Automated Subscription Expiration',
          `User ${user.uid} (${user.displayName})`,
          `Plan: ${prevPlan}, Exp: ${new Date(user.subscriptionEndDate).toLocaleDateString()}`,
          'Plan: free (Expired)'
        );

        this.notifications.unshift({
          id: `notif_${Date.now()}_${user.uid}`,
          title: 'የደንበኝነት አገልግሎት ጊዜ ተጠናቋል',
          message: `ውድ ${user.displayName}፣ የ${prevPlan.toUpperCase()} አገልግሎት ጊዜዎ ተጠናቋል። ወደ ነፃ ፕላን ተመልሰዋል፤ ለማደስ እባክዎ ክፍያ ይፈጽሙ።`,
          category: 'subscription',
          targetAudience: 'individual',
          targetUid: user.uid,
          createdAt: Date.now(),
          status: 'sent',
          sentAt: Date.now(),
        });
      }
    }

    if (expiredCount > 0) {
      this.notify();
    }
    return { expiredCount, details };
  }

  // --- Tool Permission Management ---
  updateToolStatus(
    toolId: string,
    updates: Partial<Pick<AITool, 'enabled' | 'isMaintenance' | 'freeAccess' | 'premiumAccess' | 'businessAccess'>>
  ): { success: boolean; message: string } {
    const tool = this.tools.find((t) => t.id === toolId);
    if (!tool) return { success: false, message: 'Tool not found' };

    const prev = JSON.stringify(tool);
    Object.assign(tool, updates);

    // Business tier always has all enabled tools
    if (tool.enabled) {
      tool.businessAccess = true;
    }

    // Validate restrictions
    const freeDisabledCount = this.tools.filter((t) => !t.freeAccess || !t.enabled).length;
    const premDisabledCount = this.tools.filter((t) => !t.premiumAccess || !t.enabled).length;

    const freeVal = validateToolRestrictions('free', freeDisabledCount);
    if (!freeVal.valid) {
      // Revert
      Object.assign(tool, JSON.parse(prev));
      return { success: false, message: freeVal.message || 'Free tier restriction exceeded (Max 5 disabled)' };
    }

    const premVal = validateToolRestrictions('premium', premDisabledCount);
    if (!premVal.valid) {
      Object.assign(tool, JSON.parse(prev));
      return { success: false, message: premVal.message || 'Premium tier restriction exceeded (Max 2 disabled)' };
    }

    this.logAction('AI Tool Updated', `${tool.nameEn} (${tool.id})`, prev, JSON.stringify(tool));
    this.notify();
    return { success: true, message: 'Tool permissions updated successfully' };
  }

  // --- User Operations ---
  toggleUserStatus(uid: string): { success: boolean; newStatus: string } {
    const user = this.users.find((u) => u.uid === uid);
    if (!user) return { success: false, newStatus: '' };

    const prev = user.status;
    user.status = user.status === 'active' ? 'suspended' : 'active';
    this.logAction(
      user.status === 'suspended' ? 'User Suspended' : 'User Reactivated',
      `User ${user.uid} (${user.displayName})`,
      `Status: ${prev}`,
      `Status: ${user.status}`
    );
    this.notify();
    return { success: true, newStatus: user.status };
  }

  updateUserPlan(uid: string, newPlan: UserPlan, durationDays: number): { success: boolean; message: string } {
    const user = this.users.find((u) => u.uid === uid);
    if (!user) return { success: false, message: 'User not found' };

    const prevPlan = user.plan;
    user.plan = newPlan;
    if (newPlan === 'free') {
      user.subscriptionEndDate = undefined;
    } else {
      user.subscriptionEndDate = Date.now() + durationDays * 86400000;
    }

    this.logAction(
      'Manual User Plan Override',
      `User ${user.uid} (${user.displayName})`,
      `Plan: ${prevPlan}`,
      `Plan: ${newPlan}, Duration: ${durationDays} days`
    );
    this.notify();
    return { success: true, message: 'User subscription plan successfully updated' };
  }

  // --- Maintenance Mode ---
  toggleMaintenanceMode(enable: boolean, customMessageAm?: string, reopeningTime?: string): void {
    const prev = this.settings.isMaintenanceMode;
    this.settings.isMaintenanceMode = enable;
    if (customMessageAm) this.settings.maintenanceMessageAm = customMessageAm;
    if (reopeningTime) this.settings.maintenanceEstimatedReopening = reopeningTime;

    this.logAction(
      enable ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled',
      'Global Website Setting',
      `Active: ${prev}`,
      `Active: ${enable}, Estimated Reopening: ${this.settings.maintenanceEstimatedReopening}`
    );
    this.notify();
  }

  // --- Settings Update ---
  updateSettings(newSettings: Partial<PlatformSettings>): void {
    const prev = JSON.stringify(this.settings);
    Object.assign(this.settings, newSettings);
    this.logAction('Platform Settings Modified', 'Global Settings', prev, JSON.stringify(this.settings));
    this.notify();
  }

  // --- Complaints ---
  replyComplaint(id: string, reply: string, newStatus: ComplaintTicket['status']): void {
    const complaint = this.complaints.find((c) => c.id === id);
    if (!complaint) return;
    const prev = `${complaint.status}: ${complaint.adminReply || 'none'}`;
    complaint.adminReply = reply;
    complaint.status = newStatus;
    if (newStatus === 'resolved' || newStatus === 'closed') {
      complaint.resolvedAt = Date.now();
    }
    this.logAction('Complaint Replied/Updated', `Ticket ${id} (${complaint.userName})`, prev, `${newStatus}: ${reply}`);
    this.notify();
  }
}

export const adminStore = new AdminDataStore();
