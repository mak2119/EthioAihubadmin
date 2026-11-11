import React from 'react';
import {
  Users,
  CreditCard,
  Receipt,
  AlertTriangle,
  TrendingUp,
  Briefcase,
  Home,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';
import { jobPortalStore } from '../services/job-portal-data';
import { formatETB } from '../utils/admin-logic';

interface DashboardViewProps {
  currentLang: Language;
  onNavigate: (viewId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ currentLang, onNavigate }) => {
  const t = TRANSLATIONS[currentLang];

  const totalUsers = adminStore.users.length;
  const freeUsers = adminStore.users.filter((u) => u.plan === 'free').length;
  const premiumUsers = adminStore.users.filter((u) => u.plan === 'premium').length;
  const businessUsers = adminStore.users.filter((u) => u.plan === 'business').length;

  const pendingPayments = adminStore.payments.filter((p) => p.status === 'pending');
  const approvedPayments = adminStore.payments.filter((p) => p.status === 'approved');
  const rejectedPayments = adminStore.payments.filter((p) => p.status === 'rejected');

  // Revenue calculation from approved payments
  const totalRevenue = approvedPayments.reduce((acc, curr) => acc + curr.expectedAmount, 0);
  const monthlyRevenueEst = premiumUsers * adminStore.settings.monthlyPremiumPrice + businessUsers * adminStore.settings.monthlyBusinessPrice;
  const annualRevenueEst = premiumUsers * adminStore.settings.annualPremiumPrice + businessUsers * adminStore.settings.annualBusinessPrice;

  const pendingComplaints = adminStore.complaints.filter((c) => c.status === 'pending').length;
  const pendingBrokers = adminStore.brokers.filter((b) => b.status === 'pending').length;
  const pendingProperties = adminStore.properties.filter((p) => !p.published).length;
  const activeJobs = adminStore.jobs.filter((j) => j.published).length;

  const [expirationBanner, setExpirationBanner] = React.useState<string | null>(null);

  const handleRunExpiration = () => {
    const res = adminStore.runDailyExpirationCheck();
    if (res.expiredCount > 0) {
      setExpirationBanner(`✓ የማብቂያ ጊዜ ቼክ ተጠናቋል፡ ${res.expiredCount} ተጠቃሚዎች የአገልግሎት ጊዜያቸው ስላለቀ ወደ ነፃ ፕላን ተመልሰዋል!\n${res.details.join('\n')}`);
    } else {
      setExpirationBanner('✓ ምንም ያለቀበት የደንበኝነት ምዝገባ የለም። ሁሉም ደንበኞች በሰዓታቸው ላይ ናቸው።');
    }
    setTimeout(() => setExpirationBanner(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / System Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ethio AI Hub Production Cloud
              </span>
              <span className="text-xs text-slate-300">
                {new Date().toLocaleDateString('am-ET', { dateStyle: 'full' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {t.appName} – {t.appSubtitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {t.dashboardDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRunExpiration}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>የማብቂያ ጊዜ ቼክ አሂድ (Run Daily Expiration)</span>
            </button>
            <button
              onClick={() => onNavigate('maintenance')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>ጥገና አስተዳድር</span>
            </button>
          </div>
        </div>
      </div>

      {expirationBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 whitespace-pre-line flex items-start gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{expirationBanner}</span>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ጠቅላላ ተጠቃሚዎች (Total Users)
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalUsers}
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +18.4%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>ነፃ: <b>{freeUsers}</b></span>
            <span>ፕሪሚየም: <b>{premiumUsers}</b></span>
            <span>ቢዝነስ: <b>{businessUsers}</b></span>
          </div>
        </div>

        {/* Monthly Revenue Estimate */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ወርሃዊ የገቢ ግምት (Monthly Run Rate)
            </span>
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatETB(monthlyRevenueEst)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>አመታዊ ግምት:</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">{formatETB(annualRevenueEst)}</span>
          </div>
        </div>

        {/* TeleBirr Pending Payments */}
        <div
          onClick={() => onNavigate('payments')}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-amber-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ያልጸደቁ ክፍያዎች (Pending Payments)
            </span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 group-hover:scale-110 transition">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendingPayments.length}
            </span>
            <span className="text-[11px] text-slate-400">
              በቴሌብር የተከፈሉ
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>የጸደቁ: <b>{approvedPayments.length}</b></span>
            <span>ውድቅ: <b>{rejectedPayments.length}</b></span>
          </div>
        </div>

        {/* Action Items / Pending Complaints & Reports */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-blue-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              የድጋፍና የይዘት ጥያቄዎች (Open Items)
            </span>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {pendingComplaints + pendingBrokers + pendingProperties}
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400">
              ትኩረት የሚሹ
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>ቅሬታ: <b>{pendingComplaints}</b></span>
            <span>ደላላ: <b>{pendingBrokers}</b></span>
            <span>ቤት: <b>{pendingProperties}</b></span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Analytics & Pending Review Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Subscription Distribution & AI Usage Bars */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Breakdown Card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  የተጠቃሚዎች ፕላን ስርጭት (Subscription Distribution)
                </h3>
                <p className="text-xs text-slate-500">
                  በነፃ፣ ፕሪሚየም እና ቢዝነስ ፕላኖች የተከፋፈሉ አባላት
                </p>
              </div>
              <button
                onClick={() => onNavigate('subscriptions')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                ዋጋዎችን አስተካክል &rarr;
              </button>
            </div>

            {/* Visual Bar Distribution */}
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(freeUsers / (totalUsers || 1)) * 100}%` }}
                className="bg-slate-400 dark:bg-slate-600 h-full transition-all"
                title={`Free: ${freeUsers}`}
              />
              <div
                style={{ width: `${(premiumUsers / (totalUsers || 1)) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Premium: ${premiumUsers}`}
              />
              <div
                style={{ width: `${(businessUsers / (totalUsers || 1)) * 100}%` }}
                className="bg-teal-400 h-full transition-all"
                title={`Business: ${businessUsers}`}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-[11px] font-medium text-slate-500 block">ነፃ ፕላን (Free)</span>
                <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                  {freeUsers} ({Math.round((freeUsers / (totalUsers || 1)) * 100)}%)
                </span>
                <span className="text-[10px] text-slate-400 block">12 ቻት/ቀን</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 block">ፕሪሚየም (Premium)</span>
                <span className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                  {premiumUsers} ({Math.round((premiumUsers / (totalUsers || 1)) * 100)}%)
                </span>
                <span className="text-[10px] text-emerald-600/80 block">250 ETB / ወር</span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40">
                <span className="text-[11px] font-medium text-teal-700 dark:text-teal-400 block">ቢዝነስ (Business)</span>
                <span className="text-base font-bold text-teal-800 dark:text-teal-300">
                  {businessUsers} ({Math.round((businessUsers / (totalUsers || 1)) * 100)}%)
                </span>
                <span className="text-[10px] text-teal-600/80 block">600 ETB / ወር</span>
              </div>
            </div>
          </div>

          {/* AI Tools Popularity & Health Status */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  የ12ቱ አይአይ መሳሪያዎች የስራ ሁኔታ (AI Tools Status)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('tools')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                ፍቃዶችን አስተዳድር &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {adminStore.tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`p-2.5 rounded-xl border text-xs transition ${
                    tool.enabled
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                      : 'border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={tool.nameEn}>
                      {tool.nameEn}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tool.isMaintenance ? 'bg-amber-400' : tool.enabled ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className={`px-1 py-0.2 rounded font-mono ${tool.freeAccess ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' : 'text-slate-400'}`}>Free</span>
                    <span className={`px-1 py-0.2 rounded font-mono ${tool.premiumAccess ? 'text-teal-600 bg-teal-50 dark:bg-teal-950/50' : 'text-slate-400'}`}>Prem</span>
                    <span className="px-1 py-0.2 rounded font-mono text-purple-600 bg-purple-50 dark:bg-purple-950/50">Biz</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Pending Approvals & Activity Feed */}
        <div className="space-y-6">
          {/* Quick TeleBirr Payment Queue */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  የቅርብ የቴሌብር ክፍያዎች
                </h3>
              </div>
              <button
                onClick={() => onNavigate('payments')}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
              >
                ሁሉንም ተመልከት
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-2">
              {pendingPayments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="py-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {payment.userName}
                    </p>
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      TX: {payment.transactionId}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {payment.plan.toUpperCase()} • {payment.billingPeriod} • {formatETB(payment.expectedAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('payments')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                  >
                    መርምር &rarr;
                  </button>
                </div>
              ))}

              {pendingPayments.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                  ሁሉም የክፍያ ጥያቄዎች ተረጋግጠዋል!
                </div>
              )}
            </div>
          </div>

          {/* Quick Ecosystem Links */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              ፈጣን መዳረሻ (Ecosystem Shortcuts)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('job-portal')}
                className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-700/60 text-left hover:border-emerald-500 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">አዲስ</span>
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  የስራ ፖርታል ማኔጀር
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {jobPortalStore.jobs.filter((j) => j.status === 'approved').length} ንቁ • {jobPortalStore.jobs.filter((j) => j.status === 'pending_review').length} በግምገማ
                </span>
              </button>

              <button
                onClick={() => onNavigate('academy')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-left hover:border-emerald-500 transition"
              >
                <GraduationCap className="w-4 h-4 text-teal-500 mb-1" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  ኢትዮ አካዳሚ
                </span>
                <span className="text-[10px] text-slate-400">{adminStore.courses.length} ኮርሶች</span>
              </button>

              <button
                onClick={() => onNavigate('homes')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-left hover:border-emerald-500 transition"
              >
                <Home className="w-4 h-4 text-blue-500 mb-1" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  የቤት ፈላጊ
                </span>
                <span className="text-[10px] text-slate-400">{adminStore.properties.length} ቤቶች</span>
              </button>

              <button
                onClick={() => onNavigate('audit-logs')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-left hover:border-emerald-500 transition"
              >
                <Clock className="w-4 h-4 text-purple-500 mb-1" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  የስራ መዝገብ
                </span>
                <span className="text-[10px] text-slate-400">{adminStore.auditLogs.length} መዝገቦች</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
