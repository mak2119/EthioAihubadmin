import React, { useState } from 'react';
import {
  Briefcase,
  Settings,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  Flag,
  BarChart3,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Star,
  Clock,
  ExternalLink,
  ShieldAlert,
  Download,
  Percent,
  Layers,
  Lock,
  Unlock,
  Building,
  Check,
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { Language } from '../types/admin';
import {
  JobPortalSettings,
  PricingPackage,
  EmployerAccount,
  PortalJobListing,
  PortalPaymentRecord,
  PortalReportRecord,
  TaxonomyItem,
} from '../types/job-portal';
import { jobPortalStore } from '../services/job-portal-data';
import {
  calculatePackagePrice,
  canEmployerPostFree,
  checkJobPostingLimits,
  scanBannedWords,
} from '../utils/job-portal-logic';
import { formatETB } from '../utils/admin-logic';

interface JobPortalManagerViewProps {
  currentLang: Language;
}

export const JobPortalManagerView: React.FC<JobPortalManagerViewProps> = ({ currentLang }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'employers' | 'jobs' | 'payments' | 'reports' | 'stats'>('settings');

  // Re-render trigger
  const [, setStoreVersion] = useState(0);
  React.useEffect(() => {
    return jobPortalStore.subscribe(() => setStoreVersion((v) => v + 1));
  }, []);

  const settings = jobPortalStore.settings;

  // --- Confirmation Modal State for Dangerous Actions ---
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: 'አረጋግጥ',
    isDanger: true,
    onConfirm: () => {},
  });

  const requestConfirmation = (title: string, description: string, confirmLabel: string, onConfirm: () => void, isDanger = true) => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      confirmLabel,
      isDanger,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- Tab 1: Settings States ---
  const [previewPlan, setPreviewPlan] = useState<'free' | 'premium' | 'business'>('free');
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [newBannedWord, setNewBannedWord] = useState('');
  const [activeTaxonomyTab, setActiveTaxonomyTab] = useState<'categories' | 'cities' | 'jobTypes'>('categories');
  const [newTaxonomyNameAm, setNewTaxonomyNameAm] = useState('');
  const [newTaxonomyNameEn, setNewTaxonomyNameEn] = useState('');

  // --- Tab 2: Employers States ---
  const [employerSearch, setEmployerSearch] = useState('');
  const [employerFilterStatus, setEmployerFilterStatus] = useState<string>('all');
  const [rejectingEmployer, setRejectingEmployer] = useState<EmployerAccount | null>(null);
  const [employerRejectReason, setEmployerRejectReason] = useState('የቀረበው የንግድ ምዝገባ ሰነድ ወይም TIN ቁጥር ትክክለኛ አይደለም።');
  const [editingEmployerAllowance, setEditingEmployerAllowance] = useState<EmployerAccount | null>(null);
  const [customFreeAllowanceInput, setCustomFreeAllowanceInput] = useState<number>(0);
  const [customOverridesInput, setCustomOverridesInput] = useState<Record<string, number>>({});

  // --- Tab 3: Jobs States ---
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState<string>('all');
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>('all');
  const [jobCityFilter, setJobCityFilter] = useState<string>('all');
  const [rejectingJob, setRejectingJob] = useState<PortalJobListing | null>(null);
  const [jobRejectReason, setJobRejectReason] = useState('የስራ ማስታወቂያው ግልጽ ያልሆነ ደመወዝ ወይም የቅድመ ክፍያ ጥያቄ ይዟል።');
  const [inspectingJob, setInspectingJob] = useState<PortalJobListing | null>(null);

  // --- Tab 4: Payments States ---
  const [inspectingPayment, setInspectingPayment] = useState<PortalPaymentRecord | null>(null);
  const [rejectingPayment, setRejectingPayment] = useState<PortalPaymentRecord | null>(null);
  const [paymentRejectReason, setPaymentRejectReason] = useState('የቴሌብር ትራንዛክሽን ቁጥር በስርዓቱ አልተገኘም።');

  // --- Tab 5: Reports States ---
  const [actioningReport, setActioningReport] = useState<PortalReportRecord | null>(null);
  const [reportActionNote, setReportActionNote] = useState('የቀረበው ማስረጃ ተመርምሮ ተገቢው እርምጃ ተወስዷል።');
  const [reportRemoveJob, setReportRemoveJob] = useState(true);
  const [reportSuspendEmployer, setReportSuspendEmployer] = useState(false);

  // Calculations for Stats
  const openJobsCount = jobPortalStore.jobs.filter((j) => j.status === 'approved' && j.expiresAt > Date.now()).length;
  const pendingJobsCount = jobPortalStore.jobs.filter((j) => j.status === 'pending_review').length;
  const approvedEmployersCount = jobPortalStore.employers.filter((e) => e.status === 'approved').length;
  const pendingEmployersCount = jobPortalStore.employers.filter((e) => e.status === 'pending').length;
  const totalApplications = jobPortalStore.jobs.reduce((acc, curr) => acc + (curr.applicationsCount || 0), 0);
  const pendingPaymentsCount = jobPortalStore.payments.filter((p) => p.status === 'pending').length;
  const openReportsCount = jobPortalStore.reports.filter((r) => r.status === 'open').length;

  const approvedPaymentsList = jobPortalStore.payments.filter((p) => p.status === 'approved');
  const totalPortalIncome = approvedPaymentsList.reduce((acc, curr) => acc + curr.expectedPriceSnapshot, 0);

  // Plan income breakdown
  const freePlanIncome = approvedPaymentsList.filter((p) => p.plan === 'free').reduce((acc, curr) => acc + curr.expectedPriceSnapshot, 0);
  const premiumPlanIncome = approvedPaymentsList.filter((p) => p.plan === 'premium').reduce((acc, curr) => acc + curr.expectedPriceSnapshot, 0);
  const businessPlanIncome = approvedPaymentsList.filter((p) => p.plan === 'business').reduce((acc, curr) => acc + curr.expectedPriceSnapshot, 0);

  // --- Export Stats to Excel (CSV) ---
  const handleExportExcel = () => {
    let csv = 'ETHIO JOB PORTAL - EXPORT SUMMARY\n';
    csv += `Generated At,${new Date().toISOString()}\n`;
    csv += `Open Jobs,${openJobsCount}\n`;
    csv += `Approved Employers,${approvedEmployersCount}\n`;
    csv += `Total Applications,${totalApplications}\n`;
    csv += `Total Portal Income (ETB),${totalPortalIncome}\n\n`;

    csv += 'PAYMENT TRANSACTIONS\n';
    csv += 'Payment ID,Employer,Plan,Package,Price Snapshot (ETB),Transaction ID,Status,Submitted Date\n';
    jobPortalStore.payments.forEach((p) => {
      csv += `"${p.id}","${p.employerName}","${p.plan}","${p.packageName}",${p.expectedPriceSnapshot},"${p.transactionId}","${p.status}","${new Date(p.submittedAt).toISOString()}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ethio_job_portal_stats_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ የስራ ፖርታል ስታቲስቲክስ በExcel/CSV ቅርጸት ወርዷል!');
  };

  // --- Export Stats to PDF (Formatted Print / Download) ---
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('እባክዎ ፖፕ-አፕ (Pop-up) ፈቃድ ይስጡ።');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Ethio Job Portal Official Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; padding: 30px; color: #1e293b; }
            h1 { color: #059669; font-size: 22px; border-bottom: 2px solid #059669; padding-bottom: 8px; }
            .kpi-grid { display: flex; gap: 20px; margin: 20px 0; }
            .kpi-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; flex: 1; background: #f8fafc; }
            .kpi-value { font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>ETHIO AI HUB - JOB PORTAL OFFICIAL REPORT</h1>
          <p>Generated by System Admin on: ${new Date().toLocaleString()}</p>
          <div class="kpi-grid">
            <div class="kpi-card"><div>Active Jobs</div><div class="kpi-value">${openJobsCount}</div></div>
            <div class="kpi-card"><div>Employers</div><div class="kpi-value">${approvedEmployersCount}</div></div>
            <div class="kpi-card"><div>Seeker Applications</div><div class="kpi-value">${totalApplications}</div></div>
            <div class="kpi-card"><div>Total Income</div><div class="kpi-value">${formatETB(totalPortalIncome)}</div></div>
          </div>
          <h3>Payment Breakdown by Subscription Tier</h3>
          <ul>
            <li>Free Tier Employers Income: <b>${formatETB(freePlanIncome)}</b></li>
            <li>Premium Tier Employers Income: <b>${formatETB(premiumPlanIncome)}</b></li>
            <li>Business Tier Employers Income: <b>${formatETB(businessPlanIncome)}</b></li>
          </ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Portal Identity */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white shadow-xl border border-emerald-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ethio Job Portal Core Service
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Firestore: <code>jobPortalSettings/main</code>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
              <Briefcase className="w-6 h-6 text-emerald-400" />
              <span>ETHIO JOB PORTAL MANAGER</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              የአሰሪዎች ምዝገባ፣ የስራዎች ፍተሻና ማጽደቂያ፣ የዋጋ ተመን ማትሪክስ፣ የቴሌብር ክፍያዎች እና የቀጥታ ፖርታል መቆጣጠሪያ።
            </p>
          </div>

          {/* Master Status Switch Display */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">የስራ ፖርታል ዋና ቁልፍ (Master Switch)</span>
              <span className="text-xs font-bold text-white uppercase flex items-center justify-end gap-1.5 mt-0.5">
                <span className={`w-2.5 h-2.5 rounded-full ${settings.masterStatus === 'on' ? 'bg-emerald-400 animate-pulse' : settings.masterStatus === 'coming_soon' ? 'bg-amber-400' : 'bg-rose-500'}`} />
                {settings.masterStatus === 'on' ? 'በርቷል (Live ON)' : settings.masterStatus === 'coming_soon' ? 'በቅርቡ (Coming Soon)' : 'ጠፍቷል (OFF)'}
              </span>
            </div>

            <select
              value={settings.masterStatus}
              onChange={(e) => {
                const newStatus = e.target.value as any;
                requestConfirmation(
                  'የፖርታል ዋና ቁልፍ ለውጥ',
                  `የስራ ፖርታሉን ሁኔታ ወደ "${newStatus.toUpperCase()}" መቀየር ይፈልጋሉ? ይህ በተጠቃሚው ድረገጽ ላይ በቀጥታ ተፈጻሚ ይሆናል።`,
                  'ቀይር',
                  () => {
                    jobPortalStore.updateSettings({ masterStatus: newStatus });
                    showToast(`✓ የፖርታል ዋና ሁኔታ ወደ ${newStatus.toUpperCase()} ተቀይሯል!`);
                  }
                );
              }}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl border-none focus:outline-none cursor-pointer transition shadow"
            >
              <option value="on">🟢 ON (ቀጥታ ስራ ላይ)</option>
              <option value="coming_soon">🟡 COMING SOON (በቅርቡ)</option>
              <option value="off">🔴 OFF (ዝግ ነው)</option>
            </select>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-2xl overflow-x-auto text-xs shadow-inner">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>1. Settings & Feature Control</span>
        </button>

        <button
          onClick={() => setActiveTab('employers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'employers'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>2. Employers</span>
          {pendingEmployersCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
              {pendingEmployersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'jobs'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>3. Job Moderation & Queue</span>
          {pendingJobsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black animate-pulse">
              {pendingJobsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'payments'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>4. TeleBirr Payments</span>
          {pendingPaymentsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
              {pendingPaymentsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>5. Reports</span>
          {openReportsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
              {openReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>6. Stats & Export</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SETTINGS / FEATURE CONTROL & PRICING TABLE                         */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Section A: Live Feature Switches */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  የፖርታል አገልግሎቶችና ፈቃዶች (Feature Switches)
                </h3>
                <p className="text-xs text-slate-500">
                  እያንዳንዱ ማብሪያና ማጥፊያ በተጠቃሚው ድረገጽ ላይ በቀጥታ (Live) ተግባራዊ ይሆናል።
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              {[
                { key: 'employerRegistrationOpen', label: 'የአሰሪዎች አዲስ ምዝገባ (Employer Registration)', desc: 'አዳዲስ አሰሪዎች መመዝገብ ይችሉ' },
                { key: 'employerApprovalRequired', label: 'አሰሪን መርምሮ ማጽደቅ (Employer Approval Required)', desc: 'አድሚኑ እስኪያጸድቅ ስራ መለጠፍ አይቻልም' },
                { key: 'reviewBeforePublishing', label: 'ስራዎችን ከህትመት በፊት መገምገም (Review Before Publishing)', desc: 'ማስታወቂያዎች በሞደሬሽን ወረፋ ያልፋሉ' },
                { key: 'skipReviewForVerified', label: 'የተረጋገጡ አሰሪዎችን አለመገምገም (Skip Review for Verified)', desc: 'Verified አሰሪዎች በቀጥታ እንዲያትሙ' },
                { key: 'applicationsEnabled', label: 'የስራ ማመልከቻ ስርዓት (Applications System)', desc: 'ስራ ፈላጊዎች CV እና ማመልከቻ እንዲልኩ' },
                { key: 'savedJobsEnabled', label: 'ስራዎችን ማስቀመጥ (Saved Jobs)', desc: 'ተጠቃሚዎች ስራዎችን ለበኋላ እንዲያስቀምጡ' },
                { key: 'cvImproveAiEnabled', label: 'CV በAI ማሻሻል (CV Improve with AI)', desc: 'የአይአይ ረዳት CVዎችን እንዲያስተካክል' },
                { key: 'applicantPdfExportEnabled', label: 'አመልካቾችን በPDF ማውረድ (Applicant PDF Export)', desc: 'አሰሪዎች የአመልካች ዝርዝር በPDF እንዲያወርዱ' },
                { key: 'featuredPostsEnabled', label: 'ተመራጭ ማስታወቂያዎች (Featured Posts)', desc: 'በክፍያ ከላይ የሚሰኩ ማስታወቂያዎች' },
                { key: 'reportsEnabled', label: 'የቅሬታ ማቅረቢያ (Job & Employer Reports)', desc: 'ተጠቃሚዎች አጠራጣሪ ስራን እንዲጠቁሙ' },
                { key: 'externalContactJobsAllowed', label: 'የቀጥታ ስልክና ኢሜል ማመልከቻ (External-Contact Jobs)', desc: 'በስልክ/በውጭ ሊንክ ማመልከት ይፈቀድ' },
              ].map((sw) => {
                const isChecked = Boolean(settings[sw.key as keyof JobPortalSettings]);
                return (
                  <div
                    key={sw.key}
                    onClick={() => {
                      jobPortalStore.updateSettings({ [sw.key]: !isChecked });
                      showToast(`✓ "${sw.label}" ተቀይሯል!`);
                    }}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                      isChecked
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {sw.label}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {sw.desc}
                      </span>
                    </div>

                    <div
                      className={`w-9 h-5 rounded-full transition-colors relative shrink-0 mt-0.5 ${
                        isChecked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          isChecked ? 'left-4.5' : 'left-1'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Numeric Limits & Rules */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              የቀናትና የቁጥር ገደቦች (Numerical Quotas & Limits)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የስራ ማስታወቂያ የሚቆይበት ጊዜ (ቀናት)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.jobDurationDays}
                  onChange={(e) => jobPortalStore.updateSettings({ jobDurationDays: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">መደበኛ፡ 30 ቀናት</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የማስታወቂያ እድሳት መስኮት (ቀናት)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.renewalWindowDays}
                  onChange={(e) => jobPortalStore.updateSettings({ renewalWindowDays: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">ከማብቃቱ በፊት/በኋላ እድሳት የሚፈቀድበት ጊዜ (7 ቀናት)</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  አንድ ስራ ፈላጊ በቀን የሚያመለክተው ከፍተኛ ቁጥር
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.maxApplicationsPerSeekerPerDay}
                  onChange={(e) => jobPortalStore.updateSettings({ maxApplicationsPerSeekerPerDay: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">ስፓምን ለመከላከል (ነባሪ፡ 5 በቀን)</p>
              </div>
            </div>

            {/* Quotas per plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  በአንድ ወቅት በአየር ላይ የሚፈቀዱ ከፍተኛ ስራዎች (Max Active Posts)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">ነፃ (Free)</span>
                    <input
                      type="number"
                      value={settings.maxActivePostsPerPlan.free}
                      onChange={(e) =>
                        jobPortalStore.updateSettings({
                          maxActivePostsPerPlan: { ...settings.maxActivePostsPerPlan, free: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">ፕሪሚየም (Premium)</span>
                    <input
                      type="number"
                      value={settings.maxActivePostsPerPlan.premium}
                      onChange={(e) =>
                        jobPortalStore.updateSettings({
                          maxActivePostsPerPlan: { ...settings.maxActivePostsPerPlan, premium: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">ቢዝነስ (Business)</span>
                    <input
                      type="number"
                      value={settings.maxActivePostsPerPlan.business}
                      onChange={(e) =>
                        jobPortalStore.updateSettings({
                          maxActivePostsPerPlan: { ...settings.maxActivePostsPerPlan, business: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-purple-600"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  በየወሩ የሚሰጡ ነፃ ማስታወቂያዎች (Free Posts Per Month)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400">ነፃ (Free)</span>
                    <input
                      type="number"
                      value={settings.freePostsPerMonthPerPlan.free}
                      onChange={(e) =>
                        jobPortalStore.updateSettings({
                          freePostsPerMonthPerPlan: { ...settings.freePostsPerMonthPerPlan, free: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">ፕሪሚየም (Premium)</span>
                    <input
                      type="number"
                      value={settings.freePostsPerMonthPerPlan.premium}
                      onChange={(e) =>
                        jobPortalStore.updateSettings({
                          freePostsPerMonthPerPlan: { ...settings.freePostsPerMonthPerPlan, premium: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">ቢዝነስ (Business)</span>
                    <input
                      type="number"
                      value={settings.freePostsPerMonthPerPlan.business}
                      onChange={(e) =>
                        jobPortalStore.updateSettings({
                          freePostsPerMonthPerPlan: { ...settings.freePostsPerMonthPerPlan, business: Number(e.target.value) },
                        })
                      }
                      className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Dynamic PRICING TABLE with LIVE EMPLOYER PREVIEW */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  የማስታወቂያ ዋጋ ተመን ሠንጠረዥ (Package Pricing Matrix)
                </h3>
                <p className="text-xs text-slate-500">
                  ተጠቃሚው አሰሪ በሚገኝበት ፕላን (Free, Premium, Business) መሰረት የተለያየ ዋጋ በብር ያያል።
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingPackage({
                    id: `pkg_${Date.now()}`,
                    nameAm: 'አዲስ ጥቅል',
                    nameEn: 'New Package',
                    nameOr: 'Paakeejii Haaraa',
                    prices: { free: 500, premium: 350, business: 200 },
                    postCount: 1,
                    durationDays: 30,
                    isFeatured: false,
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow"
              >
                <Plus className="w-4 h-4" />
                <span>አዲስ የጥቅል አይነት ጨምር (Add Package)</span>
              </button>
            </div>

            {/* Pricing Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-bold text-slate-700 dark:text-slate-300">
                    <th className="py-3 px-4">ጥቅል (Package Row)</th>
                    <th className="py-3 px-4">የስራ ብዛትና ቆይታ</th>
                    <th className="py-3 px-4 text-center">ነፃ አሰሪ ዋጋ (Free Plan)</th>
                    <th className="py-3 px-4 text-center text-emerald-600">ፕሪሚየም ዋጋ (Premium)</th>
                    <th className="py-3 px-4 text-center text-purple-600">ቢዝነስ ዋጋ (Business)</th>
                    <th className="py-3 px-4">ቅናሽ (Discount)</th>
                    <th className="py-3 px-4 text-right">እርምጃ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {settings.packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                      <td className="py-3 px-4 font-semibold">
                        <div>{pkg.nameAm}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{pkg.nameEn}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {pkg.postCount || 1} ስራ • {pkg.durationDays || 30} ቀናት
                        {pkg.isFeatured && (
                          <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-500 font-bold">
                            Featured
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold">
                        {formatETB(pkg.prices.free)}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatETB(pkg.prices.premium)}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-purple-600 dark:text-purple-400">
                        {formatETB(pkg.prices.business)}
                      </td>

                      <td className="py-3 px-4">
                        {pkg.discountPercent ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                            {pkg.discountPercent}% ቅናሽ
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">የለም</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingPackage({ ...pkg })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              requestConfirmation(
                                'ጥቅል ሰርዝ',
                                `እርግጠኛ ነዎት "${pkg.nameEn}" የተባለውን የዋጋ ጥቅል መሰረዝ ይፈልጋሉ?`,
                                'ሰርዝ',
                                () => {
                                  jobPortalStore.deletePackage(pkg.id);
                                  showToast('✓ ጥቅሉ ተሰርዟል');
                                }
                              );
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* LIVE EMPLOYER PERSPECTIVE PREVIEW BOX */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs uppercase tracking-wide text-amber-300">
                    የአሰሪው ገጽ የቀጥታ ቅድመ እይታ (Employer Live View Simulation)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">የአሰሪ ፕላን ምረጥ፡</span>
                  <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs font-semibold">
                    {(['free', 'premium', 'business'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPreviewPlan(p)}
                        className={`px-2.5 py-1 rounded-md uppercase transition ${
                          previewPlan === p ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {settings.packages.map((pkg) => {
                  const effectivePrice = calculatePackagePrice(pkg, previewPlan);
                  const originalPrice = pkg.prices[previewPlan];
                  const hasDiscount = effectivePrice < originalPrice;

                  return (
                    <div
                      key={pkg.id}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <span className="font-bold text-white text-xs">{pkg.nameAm}</span>
                          {pkg.isFeatured && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold uppercase">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {pkg.postCount || 1} ስራ • {pkg.durationDays || 30} ቀናት ቆይታ
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                        <div>
                          {hasDiscount && (
                            <span className="text-[10px] text-slate-500 line-through mr-1.5">
                              {formatETB(originalPrice)}
                            </span>
                          )}
                          <span className="text-sm font-black text-emerald-400 font-mono">
                            {formatETB(effectivePrice)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          ለ{previewPlan} አሰሪ
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section D: TeleBirr receiving, Instructions, Taxonomies, Banned Words, Announcement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* TeleBirr & Payment Instructions (3 Languages) */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                የቴሌብር መቀበያና መመሪያዎች (3 ቋንቋዎች)
              </h3>

              <div>
                <label className="font-semibold block mb-1">የቴሌብር መቀበያ ቁጥር</label>
                <input
                  type="text"
                  value={settings.telebirrReceivingNumber}
                  onChange={(e) => jobPortalStore.updateSettings({ telebirrReceivingNumber: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">የክፍያ መመሪያ (Amharic)</label>
                <textarea
                  rows={2}
                  value={settings.paymentInstructionsAm}
                  onChange={(e) => jobPortalStore.updateSettings({ paymentInstructionsAm: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">የክፍያ መመሪያ (English)</label>
                <textarea
                  rows={2}
                  value={settings.paymentInstructionsEn}
                  onChange={(e) => jobPortalStore.updateSettings({ paymentInstructionsEn: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">የክፍያ መመሪያ (Afaan Oromoo)</label>
                <textarea
                  rows={2}
                  value={settings.paymentInstructionsOr}
                  onChange={(e) => jobPortalStore.updateSettings({ paymentInstructionsOr: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Taxonomies & Banned Words */}
            <div className="space-y-6">
              {/* Banned Words Card */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>የተከለከሉ ቃላት ዝርዝር (Banned Words)</span>
                  <span className="text-[11px] text-slate-400 font-normal">{settings.bannedWords.length} ቃላት</span>
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBannedWord}
                    onChange={(e) => setNewBannedWord(e.target.value)}
                    placeholder="አዲስ የተከለከለ ቃል ያስገቡ..."
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      if (newBannedWord.trim()) {
                        jobPortalStore.addBannedWord(newBannedWord);
                        setNewBannedWord('');
                      }
                    }}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg font-semibold"
                  >
                    ጨምር
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {settings.bannedWords.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-mono text-[11px]"
                    >
                      <span>{word}</span>
                      <button
                        onClick={() => jobPortalStore.removeBannedWord(word)}
                        className="text-rose-400 hover:text-rose-700 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Announcement Banner Switch & Texts */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    የስራ ፖርታል ማስታወቂያ ባነር (Announcement Banner)
                  </h3>
                  <button
                    onClick={() => jobPortalStore.updateSettings({ bannerEnabled: !settings.bannerEnabled })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      settings.bannerEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {settings.bannerEnabled ? 'የበራ (ON)' : 'የጠፋ (OFF)'}
                  </button>
                </div>

                <div>
                  <label className="font-semibold block mb-1">የባነር መልዕክት (Amharic)</label>
                  <input
                    type="text"
                    value={settings.bannerMessageAm}
                    onChange={(e) => jobPortalStore.updateSettings({ bannerMessageAm: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">የባነር መልዕክት (English)</label>
                  <input
                    type="text"
                    value={settings.bannerMessageEn}
                    onChange={(e) => jobPortalStore.updateSettings({ bannerMessageEn: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EMPLOYERS DIRECTORY & PENDING APPROVALS                             */}
      {/* ========================================================================= */}
      {activeTab === 'employers' && (
        <div className="space-y-6">
          {/* Sub-header & Pending Count Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                የአሰሪዎች አስተዳደር (Employers Directory)
              </h2>
              <p className="text-xs text-slate-500">
                የአሰሪዎችን ማረጋገጫ (Verified Badge)፣ ፈቃድ መስጠት፣ ማገድ እና የተናጠል የዋጋ/የነፃ ማስታወቂያ ጥቅል መመደቢያ።
              </p>
            </div>

            {pendingEmployersCount > 0 && (
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{pendingEmployersCount} አሰሪዎች ማረጋገጫ በመጠባበቅ ላይ ናቸው</span>
              </div>
            )}
          </div>

          {/* Search & Filter */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={employerSearch}
                onChange={(e) => setEmployerSearch(e.target.value)}
                placeholder="በድርጅት ስም፣ ኢሜል፣ ስልክ ወይም TIN ቁጥር ይፈልጉ..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={employerFilterStatus}
              onChange={(e) => setEmployerFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-300"
            >
              <option value="all">ሁሉም ሁኔታ</option>
              <option value="pending">ያልተረጋገጠ (Pending Approval)</option>
              <option value="approved">የጸደቀ (Approved)</option>
              <option value="suspended">የታገደ (Suspended)</option>
              <option value="rejected">ውድቅ የተደረገ (Rejected)</option>
            </select>
          </div>

          {/* Employers Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-bold">
                  <th className="py-3 px-4">አሰሪ ድርጅት (Company)</th>
                  <th className="py-3 px-4">ፕላንና ከተማ</th>
                  <th className="py-3 px-4">TIN ቁጥር</th>
                  <th className="py-3 px-4">የተረጋገጠ (Verified)</th>
                  <th className="py-3 px-4">ንቁ ስራዎች</th>
                  <th className="py-3 px-4">ሁኔታ (Status)</th>
                  <th className="py-3 px-4 text-right">እርምጃዎች</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {jobPortalStore.employers
                  .filter((emp) => {
                    const matchSearch =
                      emp.companyName.toLowerCase().includes(employerSearch.toLowerCase()) ||
                      emp.email.toLowerCase().includes(employerSearch.toLowerCase()) ||
                      emp.phone.includes(employerSearch) ||
                      (emp.tinNumber && emp.tinNumber.includes(employerSearch));
                    const matchStatus = employerFilterStatus === 'all' || emp.status === employerFilterStatus;
                    return matchSearch && matchStatus;
                  })
                  .map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {emp.companyName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {emp.companyName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {emp.email} • {emp.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold uppercase text-emerald-600 dark:text-emerald-400 block">
                          {emp.plan}
                        </span>
                        <span className="text-[11px] text-slate-400">{emp.city}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {emp.tinNumber || 'የለም'}
                      </td>

                      {/* Verified Badge Toggle Switch */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => {
                            jobPortalStore.toggleEmployerVerified(emp.id);
                            showToast(`✓ ${emp.companyName} የVerified ባጅ ተቀይሯል`);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                            emp.isVerified
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          <span>{emp.isVerified ? 'VERIFIED' : 'መደበኛ'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold">
                        {emp.activeJobsCount} / {emp.totalJobsCount} ስራዎች
                      </td>

                      <td className="py-3.5 px-4">
                        {emp.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 animate-pulse">
                            Pending Approval
                          </span>
                        )}
                        {emp.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300">
                            Approved
                          </span>
                        )}
                        {emp.status === 'suspended' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300">
                            Suspended
                          </span>
                        )}
                        {emp.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            Rejected
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {emp.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => {
                                  jobPortalStore.approveEmployer(emp.id);
                                  showToast(`✓ ${emp.companyName} ተረጋግጦ ጸድቋል!`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 shadow-sm"
                              >
                                አጽድቅ
                              </button>
                              <button
                                onClick={() => setRejectingEmployer(emp)}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500"
                              >
                                ውድቅ
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Custom Allowance & Overrides */}
                              <button
                                onClick={() => {
                                  setEditingEmployerAllowance(emp);
                                  setCustomFreeAllowanceInput(emp.customFreePostAllowance ?? settings.freePostsPerMonthPerPlan[emp.plan]);
                                  setCustomOverridesInput(emp.customPricingOverrides ? { ...emp.customPricingOverrides } : {});
                                }}
                                title="ልዩ የዋጋ/ነፃ ማስታወቂያ ስጥ"
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold"
                              >
                                ልዩ ጥቅል/ዋጋ
                              </button>

                              {/* Suspend / Restore */}
                              <button
                                onClick={() => {
                                  const isSuspending = emp.status !== 'suspended';
                                  requestConfirmation(
                                    isSuspending ? 'አሰሪን እገድ' : 'አሰሪውን መልስ',
                                    `እርግጠኛ ነዎት ${emp.companyName} የተባሉትን አሰሪ ${isSuspending ? 'ማገድ' : 'ማንቃት'} ይፈልጋሉ?`,
                                    isSuspending ? 'አግድ (Suspend)' : 'አንቃ (Restore)',
                                    () => {
                                      jobPortalStore.toggleEmployerSuspend(emp.id);
                                      showToast(`✓ ${emp.companyName} ሁኔታ ተቀይሯል`);
                                    },
                                    isSuspending
                                  );
                                }}
                                className={`px-2 py-1 rounded-lg font-semibold ${
                                  emp.status === 'suspended'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                                }`}
                              >
                                {emp.status === 'suspended' ? 'አንቃ' : 'አግድ'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: JOBS MODERATION QUEUE & SEARCH                                     */}
      {/* ========================================================================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                የስራ ማስታወቂያዎች ሞደሬሽንና ፍተሻ (Job Moderation Queue)
              </h2>
              <p className="text-xs text-slate-500">
                የቀረቡ የስራ ማስታወቂያዎችን ማጽደቅ፣ ውድቅ ማድረግ፣ ማደስ (Renew)፣ ማድመቅ (Feature) እና የተከለከሉ ቃላትን መፈተሽ።
              </p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="በስራ መደብ፣ በአሰሪ ስም ወይም በዝርዝር መግለጫ ይፈልጉ..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-300"
            >
              <option value="all">ሁሉም ሁኔታ</option>
              <option value="pending_review">ፍተሻ የሚጠብቁ (Pending Review)</option>
              <option value="approved">የጸደቁ (Approved)</option>
              <option value="rejected">ውድቅ የተደረጉ (Rejected)</option>
              <option value="expired">ያለቀባቸው (Expired)</option>
            </select>
          </div>

          {/* Jobs List */}
          <div className="space-y-3.5 text-xs">
            {jobPortalStore.jobs
              .filter((j) => {
                const matchSearch =
                  j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
                  j.employerName.toLowerCase().includes(jobSearch.toLowerCase());
                const matchStatus = jobStatusFilter === 'all' || j.status === jobStatusFilter;
                return matchSearch && matchStatus;
              })
              .map((job) => {
                const bannedScan = scanBannedWords(job.title + ' ' + job.description, settings.bannedWords);
                return (
                  <div
                    key={job.id}
                    className={`p-5 rounded-2xl border transition ${
                      job.status === 'pending_review'
                        ? 'border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</span>
                        {job.isFeatured && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Featured
                          </span>
                        )}
                        {bannedScan.hasBanned && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> የተከለከለ ቃል ተገኝቷል: {bannedScan.foundWords.join(', ')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {job.status === 'pending_review' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300">
                            ማረጋገጫ የሚጠብቅ
                          </span>
                        )}
                        {job.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300">
                            የታተመ (Approved)
                          </span>
                        )}
                        {job.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400">
                            ውድቅ የተደረገ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-500 dark:text-slate-400">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">አሰሪ</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{job.employerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">ደመወዝ</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{job.salaryText}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">የማብቂያ ቀን</span>
                        <span className="font-mono">{new Date(job.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                      {job.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {job.applicationsCount} አመልካቾች • {job.viewsCount} እይታዎች
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {job.status === 'pending_review' && (
                          <>
                            <button
                              onClick={() => {
                                jobPortalStore.approveJob(job.id);
                                showToast(`✓ "${job.title}" ጸድቋልና ታትሟል!`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow"
                            >
                              አጽድቅና አትም (Approve)
                            </button>
                            <button
                              onClick={() => setRejectingJob(job)}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                            >
                              ውድቅ አድርግ
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            jobPortalStore.toggleJobFeatured(job.id);
                            showToast(`✓ "${job.title}" Featured ሁኔታ ተቀይሯል`);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg font-semibold border ${
                            job.isFeatured
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 inline mr-1 fill-current" />
                          {job.isFeatured ? 'ተመራጭነቱን አንሳ' : 'ተመራጭ አድርግ (Feature)'}
                        </button>

                        <button
                          onClick={() => {
                            jobPortalStore.extendJobDuration(job.id, 30);
                            showToast(`✓ "${job.title}" ለ 30 ተጨማሪ ቀናት ታድሷል!`);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold"
                        >
                          +30 ቀናት አድስ
                        </button>

                        <button
                          onClick={() => {
                            requestConfirmation(
                              'ስራ ማስታወቂያ ሰርዝ',
                              `እርግጠኛ ነዎት "${job.title}" የተባለውን የስራ ማስታወቂያ መሰረዝ ይፈልጋሉ?`,
                              'ሰርዝ',
                              () => {
                                jobPortalStore.deleteJob(job.id);
                                showToast('✓ የስራ ማስታወቂያው ተሰርዟል');
                              }
                            );
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TELEBIRR PAYMENTS (WITH PRICE SNAPSHOT & APPROVAL)                  */}
      {/* ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                የስራ ፖርታል የቴሌብር ክፍያዎች (Payment Approvals & Snapshot)
              </h2>
              <p className="text-xs text-slate-500">
                የተፈቀደው ክፍያ በወቅቱ የነበረውን ትክክለኛ የዋጋ ቅጽበት (Snapshot Price) ይመዘግባል፤ ማጽደቅ ስራውን ወዲያው ያትማል ወይም ያድሳል።
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 font-bold text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-4">ከፋይ አሰሪ (Employer)</th>
                  <th className="py-3 px-4">የተገዛው ጥቅል</th>
                  <th className="py-3 px-4">የዋጋ ቅጽበት (Snapshot Price)</th>
                  <th className="py-3 px-4">ቴሌብር ትራንዛክሽን ቁጥር</th>
                  <th className="py-3 px-4">ቀን</th>
                  <th className="py-3 px-4">ሁኔታ</th>
                  <th className="py-3 px-4 text-right">እርምጃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {jobPortalStore.payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold block text-slate-900 dark:text-white">{p.employerName}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">ፕላን፡ {p.plan}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {p.packageName}
                      {p.jobTitle && <span className="block text-[11px] text-slate-400">({p.jobTitle})</span>}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatETB(p.expectedPriceSnapshot)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {p.transactionId}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(p.submittedAt).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      {p.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 animate-pulse">
                          Pending Approval
                        </span>
                      )}
                      {p.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300">
                          Approved
                        </span>
                      )}
                      {p.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingPayment(p)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" /> መርምር
                        </button>
                        {p.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                const res = jobPortalStore.approvePayment(p.id);
                                if (res.success) showToast(res.message);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                            >
                              አጽድቅ
                            </button>
                            <button
                              onClick={() => setRejectingPayment(p)}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                            >
                              ውድቅ
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: REPORTS (SUSPEND EMPLOYER / REMOVE JOB)                             */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                የስራና የአሰሪዎች ጥቆማዎች (Reported Jobs & Employers)
              </h2>
              <p className="text-xs text-slate-500">
                በስራ ፈላጊዎች የቀረቡ የሃሰት ስራ፣ የቅድመ ክፍያ ማጭበርበር ወይም አሳሳች መረጃዎች ምርመራ።
              </p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            {jobPortalStore.reports.map((rep) => (
              <div
                key={rep.id}
                className={`p-5 rounded-2xl border transition ${
                  rep.status === 'open'
                    ? 'border-rose-300 dark:border-rose-900/80 bg-white dark:bg-slate-900 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 uppercase">
                      {rep.targetType} Report
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      ዒላማ፡ {rep.targetTitle}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rep.status === 'open'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {rep.status === 'open' ? 'ክፍት ጥቆማ' : rep.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="text-rose-600 dark:text-rose-400 font-semibold">
                    የክሱ ምክንያት፡ {rep.reason}
                  </div>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                    {rep.details}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ጠቋሚ፡ {rep.reporterName} ({rep.reporterEmail}) • {new Date(rep.createdAt).toLocaleString()}
                  </p>
                </div>

                {rep.actionNote && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px]">
                    <b>የተወሰደ እርምጃ፡</b> {rep.actionNote}
                  </div>
                )}

                {rep.status === 'open' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        jobPortalStore.dismissReport(rep.id);
                        showToast('✓ ጥቆማው ውድቅ ተደርጓል');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      ውድቅ አድርግ (Dismiss)
                    </button>
                    <button
                      onClick={() => setActioningReport(rep)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow"
                    >
                      እርምጃ ውሰድ (Take Action)
                    </button>
                  </div>
                )}
              </div>
            ))}

            {jobPortalStore.reports.length === 0 && (
              <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                ምንም የቀረበ ጥቆማ የለም።
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: STATS & ANALYTICS (EXCEL & PDF EXPORT)                              */}
      {/* ========================================================================= */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                የስራ ፖርታል አጠቃላይ ስታቲስቲክስና ሪፖርት
              </h2>
              <p className="text-xs text-slate-500">
                ንቁ ስራዎች፣ የተመዘገቡ አሰሪዎች፣ ማመልከቻዎች እና በወርና በፕላን የተሰበሰበ ገቢ።
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>በExcel (CSV) አውርድ</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>በPDF አትም (Print/PDF)</span>
              </button>
            </div>
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-slate-400 font-semibold block">ክፍት/ንቁ ስራዎች (Open Jobs)</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {openJobsCount}
              </span>
              <span className="text-[11px] text-emerald-600 mt-2 block font-medium">
                {pendingJobsCount} ማረጋገጫ የሚጠብቁ
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-slate-400 font-semibold block">ተቀባይነት ያገኙ አሰሪዎች</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {approvedEmployersCount}
              </span>
              <span className="text-[11px] text-amber-500 mt-2 block font-medium">
                {pendingEmployersCount} አዲስ ማረጋገጫ የሚጠብቁ
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-slate-400 font-semibold block">ጠቅላላ ማመልከቻዎች (Applications)</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {totalApplications}
              </span>
              <span className="text-[11px] text-emerald-600 mt-2 block font-medium">
                በስራ ፈላጊዎች የቀረቡ
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-slate-400 font-semibold block">ጠቅላላ የተሰበሰበ ገቢ (Revenue)</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block font-mono">
                {formatETB(totalPortalIncome)}
              </span>
              <span className="text-[11px] text-slate-400 mt-2 block font-medium">
                {approvedPaymentsList.length} የተረጋገጡ ግብይቶች
              </span>
            </div>
          </div>

          {/* Revenue by Subscription Tier */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              የስራ ፖርታል ገቢ በደንበኝነት ፕላን (Income by Employer Plan)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-center">
                <span className="text-slate-400 font-semibold block">ነፃ አሰሪዎች (Free Tier)</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                  {formatETB(freePlanIncome)}
                </span>
                <span className="text-[10px] text-slate-400">ከነጠላና ተጨማሪ ማስታወቂያዎች</span>
              </div>

              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-center">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">ፕሪሚየም አሰሪዎች (Premium)</span>
                <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300 font-mono mt-1 block">
                  {formatETB(premiumPlanIncome)}
                </span>
                <span className="text-[10px] text-emerald-600/80">ከተመራጭና የጥቅል ክፍያዎች</span>
              </div>

              <div className="p-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 text-center">
                <span className="text-purple-700 dark:text-purple-400 font-semibold block">ቢዝነስ ኢንተርፕራይዝ (Business)</span>
                <span className="text-lg font-bold text-purple-800 dark:text-purple-300 font-mono mt-1 block">
                  {formatETB(businessPlanIncome)}
                </span>
                <span className="text-[10px] text-purple-600/80">ከድርጅት ፓኬጆች</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS & OVERLAYS                                                         */}
      {/* ========================================================================= */}

      {/* 1. Dangerous Action Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{confirmModal.title}</h3>
                <span className="text-[11px] text-rose-500 font-semibold">ማረጋገጫ ግዴታ ነው (Confirmation Required)</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                ይቅር (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 rounded-xl text-white font-bold transition shadow ${
                  confirmModal.isDanger ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add / Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              jobPortalStore.savePackage(editingPackage);
              setEditingPackage(null);
              showToast('✓ የዋጋ ጥቅሉ በተሳካ ሁኔታ ተቀምጧል!');
            }}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የማስታወቂያ ጥቅል ማስተካከያ (Edit Package)
              </h3>
              <button type="button" onClick={() => setEditingPackage(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">የጥቅል ስም (Amharic)</label>
                <input
                  type="text"
                  required
                  value={editingPackage.nameAm}
                  onChange={(e) => setEditingPackage({ ...editingPackage, nameAm: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">የጥቅል ስም (English)</label>
                <input
                  type="text"
                  required
                  value={editingPackage.nameEn}
                  onChange={(e) => setEditingPackage({ ...editingPackage, nameEn: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border space-y-2">
              <span className="font-bold block text-slate-700 dark:text-slate-300">የዋጋ ተመኖች በፕላን (Price in ETB)</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block">Free Plan</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingPackage.prices.free}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        prices: { ...editingPackage.prices, free: Number(e.target.value) },
                      })
                    }
                    className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Premium Plan</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingPackage.prices.premium}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        prices: { ...editingPackage.prices, premium: Number(e.target.value) },
                      })
                    }
                    className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Business Plan</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingPackage.prices.business}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        prices: { ...editingPackage.prices, business: Number(e.target.value) },
                      })
                    }
                    className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-purple-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">የስራ ማስታወቂያ ብዛት</label>
                <input
                  type="number"
                  min="1"
                  value={editingPackage.postCount || 1}
                  onChange={(e) => setEditingPackage({ ...editingPackage, postCount: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">የቆይታ ጊዜ (ቀናት)</label>
                <input
                  type="number"
                  min="1"
                  value={editingPackage.durationDays || 30}
                  onChange={(e) => setEditingPackage({ ...editingPackage, durationDays: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">የቅናሽ መቶኛ (%)</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={editingPackage.discountPercent || 0}
                  onChange={(e) => setEditingPackage({ ...editingPackage, discountPercent: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">የቅናሽ ማብቂያ ቀን</label>
                <input
                  type="date"
                  value={editingPackage.discountEndDate ? editingPackage.discountEndDate.slice(0, 10) : ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, discountEndDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={Boolean(editingPackage.isFeatured)}
                onChange={(e) => setEditingPackage({ ...editingPackage, isFeatured: e.target.checked })}
                className="rounded text-emerald-600"
              />
              <span className="font-bold text-slate-800 dark:text-slate-200">ይህ ጥቅል ማስታወቂያውን ከላይ ይሰካል (Featured/Pinned Post)</span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
              >
                ይቅር
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                ጥቅሉን አስቀምጥ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Reject Employer Modal */}
      {rejectingEmployer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              jobPortalStore.rejectEmployer(rejectingEmployer.id, employerRejectReason);
              setRejectingEmployer(null);
              showToast(`✓ ${rejectingEmployer.companyName} ውድቅ ተደርጓል`);
            }}
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs"
          >
            <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400">
              አሰሪን ውድቅ ማድረጊያ፡ {rejectingEmployer.companyName}
            </h3>
            <p className="text-slate-500">ለአሰሪው የሚላክ የውድቅ ምክንያት ያስገቡ፡</p>
            <textarea
              rows={3}
              required
              value={employerRejectReason}
              onChange={(e) => setEmployerRejectReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            />
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setRejectingEmployer(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                ይቅር
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                ውድቅ መዝግብ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Employer Custom Pricing / Free Allowance Modal */}
      {editingEmployerAllowance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              jobPortalStore.setEmployerCustomAllowance(
                editingEmployerAllowance.id,
                customFreeAllowanceInput,
                customOverridesInput
              );
              setEditingEmployerAllowance(null);
              showToast(`✓ ለ ${editingEmployerAllowance.companyName} ልዩ ጥቅልና ዋጋ ተመደበ!`);
            }}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                ለአሰሪ ልዩ ጥቅልና ዋጋ ማስተካከያ ({editingEmployerAllowance.companyName})
              </h3>
              <button type="button" onClick={() => setEditingEmployerAllowance(null)} className="text-slate-400">✕</button>
            </div>

            <div>
              <label className="font-semibold block mb-1">
                በየወሩ የሚሰጥ ነፃ የማስታወቂያ ኮታ (Custom Free Post Allowance)
              </label>
              <input
                type="number"
                min="0"
                value={customFreeAllowanceInput}
                onChange={(e) => setCustomFreeAllowanceInput(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                መደበኛ የፕላን ኮታ፡ {settings.freePostsPerMonthPerPlan[editingEmployerAllowance.plan]} በወር
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border space-y-2">
              <span className="font-bold block text-slate-700 dark:text-slate-300">
                ለዚህ አሰሪ የተለየ የጥቅል ዋጋ መመደቢያ (Custom Price Overrides in ETB)
              </span>
              <p className="text-[10px] text-slate-400">እሴት ከተሞላ የመደበኛውን ሰንጠረዥ ዋጋ ይተካዋል</p>

              <div className="space-y-2 pt-1">
                {settings.packages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{pkg.nameEn}</span>
                    <input
                      type="number"
                      placeholder={`መደበኛ፡ ${pkg.prices[editingEmployerAllowance.plan]} ETB`}
                      value={customOverridesInput[pkg.id] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const copy = { ...customOverridesInput };
                        if (val === '') {
                          delete copy[pkg.id];
                        } else {
                          copy[pkg.id] = Number(val);
                        }
                        setCustomOverridesInput(copy);
                      }}
                      className="w-32 p-1.5 bg-white dark:bg-slate-800 border rounded font-mono font-bold text-right"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setEditingEmployerAllowance(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
              >
                ይቅር
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                መዝግብ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. Reject Job Modal */}
      {rejectingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              jobPortalStore.rejectJob(rejectingJob.id, jobRejectReason);
              setRejectingJob(null);
              showToast(`✓ "${rejectingJob.title}" ውድቅ ተደርጓል`);
            }}
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs"
          >
            <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400">
              የስራ ማስታወቂያ ውድቅ ማድረጊያ
            </h3>
            <p className="text-slate-500">ለአሰሪው የሚላክ ይፋዊ የውድቅ ምክንያት ያስገቡ፡</p>
            <textarea
              rows={3}
              required
              value={jobRejectReason}
              onChange={(e) => setJobRejectReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            />
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setRejectingJob(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                ይቅር
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                ውድቅ መዝግብ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. Inspect Payment Lightbox Modal */}
      {inspectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የቴሌብር ክፍያ ደረሰኝ ምርመራ ({inspectingPayment.id})
              </h3>
              <button type="button" onClick={() => setInspectingPayment(null)} className="text-slate-400">✕</button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">አሰሪ፡</span>
                <span className="font-bold text-slate-900 dark:text-white">{inspectingPayment.employerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">የተገዛው ጥቅል፡</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectingPayment.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">የተመዘገበ ዋጋ (Snapshot Price)፡</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{formatETB(inspectingPayment.expectedPriceSnapshot)}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">TX ID:</span>
                <span className="font-black text-emerald-500">{inspectingPayment.transactionId}</span>
              </div>

              <div className="h-44 rounded-xl overflow-hidden border mt-2">
                <img
                  src={inspectingPayment.screenshotUrl}
                  alt="Receipt"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setInspectingPayment(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
              >
                ዝጋ
              </button>
              {inspectingPayment.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => {
                    const res = jobPortalStore.approvePayment(inspectingPayment.id);
                    setInspectingPayment(null);
                    if (res.success) showToast(res.message);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  ክፍያውን አጽድቅና ስራውን አትም
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Take Action on Report Modal */}
      {actioningReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              jobPortalStore.takeActionOnReport(
                actioningReport.id,
                reportActionNote,
                reportRemoveJob,
                reportSuspendEmployer
              );
              setActioningReport(null);
              showToast('✓ በጥቆማው ላይ እርምጃ ተወስዷል!');
            }}
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs"
          >
            <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400">
              በጥቆማው ላይ አስተዳደራዊ እርምጃ ውሰድ
            </h3>

            <p className="text-slate-500">ዒላማ፡ <b>{actioningReport.targetTitle}</b></p>

            <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportRemoveJob}
                  onChange={(e) => setReportRemoveJob(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span className="font-bold text-slate-800 dark:text-slate-200">የተከሰሰውን ስራ ማስታወቂያ ወዲያው ሰርዝ</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportSuspendEmployer}
                  onChange={(e) => setReportSuspendEmployer(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span className="font-bold text-rose-600 dark:text-rose-400">አሰሪውን ድርጅት አካውንት ሙሉ ለሙሉ አግድ (Suspend)</span>
              </label>
            </div>

            <div>
              <label className="font-semibold block mb-1">የውሳኔ ማስታወሻ (Action Note)</label>
              <textarea
                rows={2}
                required
                value={reportActionNote}
                onChange={(e) => setReportActionNote(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setActioningReport(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold"
              >
                ይቅር
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                እርምጃውን ፈጽም
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
