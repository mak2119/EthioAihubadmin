import { Language } from '../types/admin';

export interface AdminDictionary {
  appName: string;
  appSubtitle: string;
  searchPlaceholder: string;
  adminRole: string;
  verifiedAdmin: string;
  superAdmin: string;
  logout: string;
  themeToggle: string;
  languageSelect: string;
  lightMode: string;
  darkMode: string;
  saveChanges: string;
  cancel: string;
  confirm: string;
  approve: string;
  reject: string;
  delete: string;
  edit: string;
  view: string;
  filter: string;
  search: string;
  status: string;
  actions: string;
  date: string;
  amount: string;
  details: string;
  noDataFound: string;
  successSaved: string;
  operationFailed: string;
  maintenanceActiveAlert: string;
  freeTier: string;
  premiumTier: string;
  businessTier: string;

  // Nav items
  navDashboard: string;
  navUsers: string;
  navSubscriptions: string;
  navPaymentRequests: string;
  navAITools: string;
  navJobs: string;
  navHomes: string;
  navBrokers: string;
  navAcademy: string;
  navAcademyPayments: string;
  navComplaints: string;
  navNotifications: string;
  navEthioDrive: string;
  navEthioVerify: string;
  navMaintenance: string;
  navSettings: string;
  navAuditLogs: string;
  navProfile: string;
  navDeployment: string;

  // Section descriptions
  dashboardDesc: string;
  usersDesc: string;
  subscriptionsDesc: string;
  paymentRequestsDesc: string;
  toolsDesc: string;
  jobsDesc: string;
  homesDesc: string;
  brokersDesc: string;
  academyDesc: string;
  academyPaymentsDesc: string;
  complaintsDesc: string;
  notificationsDesc: string;
  ethioDriveDesc: string;
  ethioVerifyDesc: string;
  maintenanceDesc: string;
  settingsDesc: string;
  auditLogsDesc: string;
  profileDesc: string;
}

export const TRANSLATIONS: Record<Language, AdminDictionary> = {
  am: {
    appName: 'ኢትዮ አይአይ ሀብ (Ethio AI Hub)',
    appSubtitle: 'የዋና አስተዳዳሪ መቆጣጠሪያ ፓነል',
    searchPlaceholder: 'በመላው ሲስተሙ ይፈልጉ...',
    adminRole: 'የሲስተም ዋና አስተዳዳሪ',
    verifiedAdmin: 'የተረጋገጠ አድሚን',
    superAdmin: 'ሱፐር አድሚን',
    logout: 'ውጣ (Logout)',
    themeToggle: 'ገጽታ ቀይር',
    languageSelect: 'ቋንቋ ምረጥ',
    lightMode: 'ብርሃን ሁነታ',
    darkMode: 'ጨለማ ሁነታ',
    saveChanges: 'ለውጦችን መዝግብ',
    cancel: 'ይቅር',
    confirm: 'አረጋግጥ',
    approve: 'አጽድቅ',
    reject: 'ውድቅ አድርግ',
    delete: 'ሰርዝ',
    edit: 'አስተካክል',
    view: 'ተመልከት',
    filter: 'አጣራ',
    search: 'ፈልግ',
    status: 'ሁኔታ',
    actions: 'እርምጃዎች',
    date: 'ቀን',
    amount: 'መጠን',
    details: 'ዝርዝር',
    noDataFound: 'ምንም አይነት መረጃ አልተገኘም',
    successSaved: 'ለውጦቹ በተሳካ ሁኔታ ተቀምጠዋል',
    operationFailed: 'ክንውኑ አልተሳካም፤ እባክዎ እንደገና ይሞክሩ',
    maintenanceActiveAlert: 'የድረገጽ ጥገና ሁነታ በርቷል! ተራ ተጠቃሚዎች የጥገና ገጹን ብቻ ነው የሚያዩት።',
    freeTier: 'ነፃ',
    premiumTier: 'ፕሪሚየም',
    businessTier: 'ቢዝነስ',

    navDashboard: 'ዳሽቦርድ',
    navUsers: 'ተጠቃሚዎች',
    navSubscriptions: 'የደንበኝነት ምዝገባዎች',
    navPaymentRequests: 'የክፍያ ጥያቄዎች',
    navAITools: 'የአይአይ መሳሪያዎች',
    navJobs: 'የስራ ማስታወቂያዎች',
    navHomes: 'የቤትና ንብረት ማስታወቂያዎች',
    navBrokers: 'የደላላ ሪፖርቶች',
    navAcademy: 'ኢትዮ አካዳሚ',
    navAcademyPayments: 'የአካዳሚ ክፍያዎች',
    navComplaints: 'ቅሬታዎችና ድጋፍ',
    navNotifications: 'ማሳወቂያዎች',
    navEthioDrive: 'ኢትዮ ድራይቭ',
    navEthioVerify: 'ኢትዮ ቬሪፋይ',
    navMaintenance: 'የድረገጽ ጥገና',
    navSettings: 'የመድረኩ ቅንብሮች',
    navAuditLogs: 'የስራ መዝገብ (Audit Logs)',
    navProfile: 'የአድሚን መገለጫ',
    navDeployment: 'የብሎገርና ጊትሀብ ማሰማሪያ',

    dashboardDesc: 'የቀጥታ ስታቲስቲክስ፣ የገቢ ሁኔታ እና የሲስተም አጠቃላይ እይታ።',
    usersDesc: 'የተጠቃሚዎች መዝገብ፣ አካውንት ማገድ/ማንቃት እና ፕላን ማስተካከያ።',
    subscriptionsDesc: 'የፕላን ዋጋዎች፣ የቀን ቻት ገደብ እና የአገልግሎት ማብቂያ ጊዜ።',
    paymentRequestsDesc: 'በቴሌብር የተከፈሉ ክፍያዎችን ማረጋገጫና ፈቃድ መስጫ።',
    toolsDesc: 'የ12ቱ አይአይ መሳሪያዎች ፍቃድና በፕላን ደረጃ የመቆጣጠሪያ ማዕከል።',
    jobsDesc: 'የስራ ቅጥር ማስታወቂያዎች መፍጠሪያ፣ ማረጋገጫና ማሳተሚያ።',
    homesDesc: 'የኪራይና ሽያጭ ቤቶች ዝርዝር ማጽደቂያና ማስተዳደሪያ።',
    brokersDesc: 'በደላሎች ላይ የቀረቡ ሪፖርቶችና ማስረጃዎች ግምገማ።',
    academyDesc: 'የኮርስ ትምህርቶች፣ ፈተናዎችና የትምህርት ይዘት ማዘጋጃ።',
    academyPaymentsDesc: 'የተጠቃሚዎች የኮርስ ክፍያ ማረጋገጫና ኮርሶችን መክፈቻ።',
    complaintsDesc: 'ከተጠቃሚዎች የቀረቡ ቴክኒካልና የክፍያ ቅሬታዎች መመለሻ።',
    notificationsDesc: 'ለተጠቃሚዎች መልዕክትና ማሳወቂያ መላኪያ ዳሽቦርድ።',
    ethioDriveDesc: 'የትራንስፖርት፣ የመንጃ ፍቃድና የትራፊክ ቅጣት መረጃዎች።',
    ethioVerifyDesc: 'የቴሌብርና የባንክ ግብይቶች ማረጋገጫና ምርመራ።',
    maintenanceDesc: 'መድረኩን ወደ ጥገና ሁነታ ማስገቢያና ማስታወቂያ ማሳያ።',
    settingsDesc: 'የቴሌብር ቁጥር፣ የዋጋ ተመኖችና የቴሌግራም ሊንኮች ቅንብር።',
    auditLogsDesc: 'በአስተዳዳሪዎች የተከናወኑ ሁሉንም እርምጃዎች የሚመዘግብ የማይለወጥ መዝገብ።',
    profileDesc: 'የአስተዳዳሪ መለያ፣ የሴኪዩሪቲ ክሌይምስ እና የይለፍ ቃል ማስተካከያ።',
  },

  en: {
    appName: 'Ethio AI Hub',
    appSubtitle: 'Enterprise Admin Control Panel',
    searchPlaceholder: 'Search across system...',
    adminRole: 'System Administrator',
    verifiedAdmin: 'Verified Admin',
    superAdmin: 'Super Admin',
    logout: 'Logout',
    themeToggle: 'Toggle Theme',
    languageSelect: 'Select Language',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    confirm: 'Confirm',
    approve: 'Approve',
    reject: 'Reject',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    filter: 'Filter',
    search: 'Search',
    status: 'Status',
    actions: 'Actions',
    date: 'Date',
    amount: 'Amount',
    details: 'Details',
    noDataFound: 'No records found',
    successSaved: 'Changes saved successfully',
    operationFailed: 'Operation failed. Please try again.',
    maintenanceActiveAlert: 'Maintenance Mode is ACTIVE! Regular users will see the maintenance landing page.',
    freeTier: 'Free',
    premiumTier: 'Premium',
    businessTier: 'Business',

    navDashboard: 'Dashboard',
    navUsers: 'Users',
    navSubscriptions: 'Subscriptions',
    navPaymentRequests: 'Payment Requests',
    navAITools: 'AI Tool Management',
    navJobs: 'Job Management',
    navHomes: 'Home Finder',
    navBrokers: 'Broker Reports',
    navAcademy: 'Ethio Academy',
    navAcademyPayments: 'Academy Payments',
    navComplaints: 'Complaints & Support',
    navNotifications: 'Notifications',
    navEthioDrive: 'Ethio Drive',
    navEthioVerify: 'EthioVerify',
    navMaintenance: 'Maintenance Mode',
    navSettings: 'Platform Settings',
    navAuditLogs: 'Audit Logs',
    navProfile: 'Admin Profile',
    navDeployment: 'Blogger & GitHub Deploy',

    dashboardDesc: 'Live platform KPIs, revenue analytics, and system overview.',
    usersDesc: 'User accounts, suspension/reactivation, and tier controls.',
    subscriptionsDesc: 'Plan pricing, daily limits, and expiration enforcement.',
    paymentRequestsDesc: 'TeleBirr manual payment verification queue.',
    toolsDesc: 'Access matrix and maintenance switches for all 12 AI tools.',
    jobsDesc: 'Job vacancy publisher, approval, and deadline tracker.',
    homesDesc: 'Property listings for rent, sale, commercial, and villas.',
    brokersDesc: 'Review allegations and evidence submitted by users.',
    academyDesc: 'Curriculum builder, lesson editor, and participation quizzes.',
    academyPaymentsDesc: 'Course unlock approvals and enrollment tracking.',
    complaintsDesc: 'Resolution center for technical, payment, and AI complaints.',
    notificationsDesc: 'Tier-scheduled broadcasts and direct user messages.',
    ethioDriveDesc: 'Verified Ethiopian official transport and licensing repository.',
    ethioVerifyDesc: 'Multi-service transaction inspection and audit records.',
    maintenanceDesc: 'Global platform lockdown with custom reopening schedule.',
    settingsDesc: 'TeleBirr payment details, pricing rates, and Telegram handles.',
    auditLogsDesc: 'Immutable audit trail of all administrative actions.',
    profileDesc: 'Session credentials, custom claims, and security settings.',
  },

  or: {
    appName: 'Ethio AI Hub',
    appSubtitle: 'Paanaalii Bulchiinsa Olaanaa',
    searchPlaceholder: 'Sirna guutuu keessaa barbaadaa...',
    adminRole: 'Bulchaa Sirnaa',
    verifiedAdmin: 'Bulchaa Mirkanaa\'e',
    superAdmin: 'Bulchaa Ol\'aanaa',
    logout: 'Ba\'i (Logout)',
    themeToggle: 'Haala jijjiiri',
    languageSelect: 'Afaan filadhaa',
    lightMode: 'Ifaa',
    darkMode: 'Dukkana',
    saveChanges: 'Jijjiirama Galmeessi',
    cancel: 'Dhiisi',
    confirm: 'Mirkaneessi',
    approve: 'Fayeessi (Approve)',
    reject: 'Kufisi (Reject)',
    delete: 'Haqi',
    edit: 'Gulaali',
    view: 'Ilaali',
    filter: 'Filtarii',
    search: 'Barbaadi',
    status: 'Haala',
    actions: 'Tarkaanfiiwwan',
    date: 'Guyyaa',
    amount: 'Hanga',
    details: 'Bal\'ina',
    noDataFound: 'Ragaan tokkoyyuu hin argamne',
    successSaved: 'Jijjiiramoonni milkaa\'inaan galmaa\'aniiru',
    operationFailed: 'Tarkaanfiin hin milkoofne; lammata yaalaa.',
    maintenanceActiveAlert: 'Haalli suphaa banameera! Fayyadamtoonni baramaan fuula suphaa qofa argu.',
    freeTier: 'Bilisa',
    premiumTier: 'Piriimiyemii',
    businessTier: 'Daldalaa',

    navDashboard: 'Daashboordii',
    navUsers: 'Fayyadamtoota',
    navSubscriptions: 'Galmee Miseensummaa',
    navPaymentRequests: 'Gaaffii Kaffaltii',
    navAITools: 'Meeshaalee AI',
    navJobs: 'Beeksisa Hojii',
    navHomes: 'Manneen fi Qabeenya',
    navBrokers: 'Gabaasa Dallaalaa',
    navAcademy: 'Itoophiyaa Akaadaamii',
    navAcademyPayments: 'Kaffaltii Akaadaamii',
    navComplaints: 'Koomii fi Deeggarsa',
    navNotifications: 'Beeksisoota',
    navEthioDrive: 'Itoophiyaa Draayivii',
    navEthioVerify: 'EthioVerify',
    navMaintenance: 'Haala Suphaa',
    navSettings: 'Qindaa\'ina Dhaabbataa',
    navAuditLogs: 'Galmee Hojii (Audit Logs)',
    navProfile: 'Piroofayilii Bulchaa',
    navDeployment: 'Blogger & GitHub',

    dashboardDesc: 'Istaatistiksii kallattii, galii fi ilaallata sirnaa.',
    usersDesc: 'Galmee fayyadamtootaa, ugguruu/kaasuu fi sirreessaa pillaanii.',
    subscriptionsDesc: 'Gatii miseensummaa, daangaa gaaffii fi yeroo xumuraa.',
    paymentRequestsDesc: 'Kaffaltii TeleBirr mirkaneessuu fi hayyamuu.',
    toolsDesc: 'Meeshaalee AI 12 to\'achuu fi daangessuu.',
    jobsDesc: 'Hojiiwwan haaraa baasuu fi to\'achuu.',
    homesDesc: 'Manneen kireeffaman fi gurguraman to\'achuu.',
    brokersDesc: 'Gabaasa dallaalota irratti dhiyaate qorachuu.',
    academyDesc: 'Barnoota fi qormaata akaadaamii qopheessuu.',
    academyPaymentsDesc: 'Kaffaltii barnootaa mirkaneessuu fi banuu.',
    complaintsDesc: 'Koomii fayyadamtootaa deebisuu fi furuu.',
    notificationsDesc: 'Ergaa fi beeksisa fayyadamtootaaf erguu.',
    ethioDriveDesc: 'Oduu geejjibaa, heeyyama konkolaachisummaa fi adabbii.',
    ethioVerifyDesc: 'Kaffaltiiwwan TeleBirr fi Baankii qorachuu.',
    maintenanceDesc: 'Marsariitii cufuufi odeeffannoo suphaa agarsiisuu.',
    settingsDesc: 'Lakkoofsa TeleBirr, gatiiwwan fi Telegram qindeessuu.',
    auditLogsDesc: 'Galmee tarkaanfii bulchitootaa hin haqamne.',
    profileDesc: 'Eenyummaa bulchaa fi nageenya sirnaa.',
  },
};
