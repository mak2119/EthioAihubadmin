import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Cpu,
  Briefcase,
  Home,
  AlertOctagon,
  GraduationCap,
  BookCheck,
  MessageSquareWarning,
  BellRing,
  Car,
  FileCheck2,
  Wrench,
  Settings,
  ScrollText,
  UserCheck,
  Globe2,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Language } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';
import { jobPortalStore } from '../services/job-portal-data';

interface SidebarProps {
  currentView: string;
  onSelectView: (viewId: string) => void;
  currentLang: Language;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  currentLang,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const t = TRANSLATIONS[currentLang];

  const pendingPayments = adminStore.payments.filter((p) => p.status === 'pending').length;
  const pendingComplaints = adminStore.complaints.filter((c) => c.status === 'pending').length;
  const pendingBrokers = adminStore.brokers.filter((b) => b.status === 'pending').length;
  const pendingJobPortal = jobPortalStore.employers.filter((e) => e.status === 'pending').length +
    jobPortalStore.jobs.filter((j) => j.status === 'pending_review').length +
    jobPortalStore.payments.filter((p) => p.status === 'pending').length;

  const navGroups = [
    {
      groupTitle: currentLang === 'am' ? 'ዋና ዳሽቦርድ' : currentLang === 'or' ? 'Daashboordii' : 'OVERVIEW',
      items: [
        { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
      ],
    },
    {
      groupTitle: currentLang === 'am' ? 'ተጠቃሚዎችና ክፍያ' : currentLang === 'or' ? 'Fayyadamtoota fi Kaffaltii' : 'MONETIZATION & USERS',
      items: [
        { id: 'users', label: t.navUsers, icon: Users },
        { id: 'subscriptions', label: t.navSubscriptions, icon: CreditCard },
        { id: 'payments', label: t.navPaymentRequests, icon: Receipt, count: pendingPayments },
      ],
    },
    {
      groupTitle: currentLang === 'am' ? 'የስራ ፖርታልና አገልግሎቶች' : currentLang === 'or' ? 'Pootaala Hojii fi Tajaajila' : 'JOB PORTAL & SERVICES',
      items: [
        {
          id: 'job-portal',
          label: currentLang === 'am' ? 'የስራ ፖርታል ማኔጀር' : currentLang === 'or' ? 'Maanajera Pootaala Hojii' : 'Job Portal Manager',
          icon: Briefcase,
          count: pendingJobPortal,
        },
        { id: 'tools', label: t.navAITools, icon: Cpu },
        { id: 'jobs', label: t.navJobs, icon: Briefcase },
        { id: 'homes', label: t.navHomes, icon: Home },
        { id: 'brokers', label: t.navBrokers, icon: AlertOctagon, count: pendingBrokers },
        { id: 'academy', label: t.navAcademy, icon: GraduationCap },
        { id: 'academy-payments', label: t.navAcademyPayments, icon: BookCheck },
      ],
    },
    {
      groupTitle: currentLang === 'am' ? 'ኦፕሬሽንስና ድጋፍ' : currentLang === 'or' ? 'Hojii fi Deeggarsa' : 'OPERATIONS & SUPPORT',
      items: [
        { id: 'complaints', label: t.navComplaints, icon: MessageSquareWarning, count: pendingComplaints },
        { id: 'notifications', label: t.navNotifications, icon: BellRing },
        { id: 'ethiodrive', label: t.navEthioDrive, icon: Car },
        { id: 'ethioverify', label: t.navEthioVerify, icon: FileCheck2 },
      ],
    },
    {
      groupTitle: currentLang === 'am' ? 'የሲስተም ቁጥጥር' : currentLang === 'or' ? 'To\'annoo Sirnaa' : 'SYSTEM & GOVERNANCE',
      items: [
        { id: 'maintenance', label: t.navMaintenance, icon: Wrench },
        { id: 'settings', label: t.navSettings, icon: Settings },
        { id: 'audit-logs', label: t.navAuditLogs, icon: ScrollText },
        { id: 'profile', label: t.navProfile, icon: UserCheck },
        { id: 'deployment', label: t.navDeployment, icon: Globe2 },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 w-64 lg:w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/20">
              🇪🇹
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-wide">
                ETHIO AI HUB
              </h1>
              <p className="text-[11px] text-emerald-400 font-medium">
                Admin Control Center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h2 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.groupTitle}
              </h2>

              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.count && item.count > 0 ? (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm animate-pulse">
                            {item.count}
                          </span>
                        ) : null}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / System Status & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between px-2 py-2 mb-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[11px]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${adminStore.settings.isMaintenanceMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="text-slate-300">
                {adminStore.settings.isMaintenanceMode ? 'Maintenance' : 'Firestore: Connected'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">v10 Compat</span>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
