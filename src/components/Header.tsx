import React, { useState } from 'react';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Globe,
  Menu,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Language } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
  onNavigate: (viewId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  onToggleMobileSidebar,
  onNavigate,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pendingPaymentsCount = adminStore.payments.filter((p) => p.status === 'pending').length;
  const pendingComplaintsCount = adminStore.complaints.filter((c) => c.status === 'pending').length;
  const isMaintenance = adminStore.settings.isMaintenanceMode;

  const totalAlerts = pendingPaymentsCount + pendingComplaintsCount + (isMaintenance ? 1 : 0);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 lg:px-6 py-3 transition-colors">
      {/* Left section: Mobile menu + Brand & search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-2xl">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Open sidebar menu"
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            EA
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight hidden md:inline">
            ETHIO AI HUB
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            ADMIN
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md ml-1 sm:ml-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-lg border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Right section: Maintenance badge, Notification center, Language, Theme, Admin profile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {isMaintenance && (
          <button
            onClick={() => onNavigate('maintenance')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ጥገና በርቷል (Maintenance)</span>
          </button>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notification center"
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-3 transition animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                  የማሳወቂያ ማዕከል (Admin Alerts)
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto mt-1">
                {pendingPaymentsCount > 0 ? (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('payments');
                    }}
                    className="py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer flex gap-3 items-start"
                  >
                    <div className="p-1.5 bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 rounded-md shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {pendingPaymentsCount} ያልተረጋገጡ የቴሌብር ክፍያዎች
                      </p>
                      <p className="text-[11px] text-slate-500">
                        የተጠቃሚዎችን ክፍያ ለማጽደቅ እዚህ ይጫኑ
                      </p>
                    </div>
                  </div>
                ) : null}

                {pendingComplaintsCount > 0 ? (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('complaints');
                    }}
                    className="py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer flex gap-3 items-start"
                  >
                    <div className="p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 rounded-md shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {pendingComplaintsCount} አዲስ ክፍት ቅሬታዎች
                      </p>
                      <p className="text-[11px] text-slate-500">
                        ከተጠቃሚዎች የተላኩ ቅሬታዎችን ለመመለስ
                      </p>
                    </div>
                  </div>
                ) : null}

                {isMaintenance ? (
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('maintenance');
                    }}
                    className="py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer flex gap-3 items-start"
                  >
                    <div className="p-1.5 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 rounded-md shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        የጥገና ሁነታ በርቷል
                      </p>
                      <p className="text-[11px] text-slate-500">
                        ተጠቃሚዎች ወደ ድረገጹ መግባት አይችሉም
                      </p>
                    </div>
                  </div>
                ) : null}

                {totalAlerts === 0 && (
                  <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-1" />
                    ሁሉም ነገሮች ሰላም ናቸው! ምንም ያልተመለሰ ጉዳይ የለም።
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative flex items-center">
          <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            aria-label={t.languageSelect}
            className="pl-7 pr-2 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="am">አማርኛ (Amharic)</option>
            <option value="en">English (EN)</option>
            <option value="or">Afaan Oromoo (OR)</option>
          </select>
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleTheme}
          aria-label={t.themeToggle}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Admin Super User Profile Pill */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition text-left"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            TG
          </div>
          <div className="hidden xl:block">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Tadesse G.
              </span>
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight">
              {t.superAdmin}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
