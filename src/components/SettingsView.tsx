import React, { useState } from 'react';
import {
  Settings,
  Phone,
  CreditCard,
  Send,
  User,
  Globe,
  CheckCircle2,
  Sparkles,
  Link,
  MessageSquare,
} from 'lucide-react';
import { Language, PlatformSettings } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface SettingsViewProps {
  currentLang: Language;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [form, setForm] = useState<PlatformSettings>({ ...adminStore.settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminStore.updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navSettings} – {t.settingsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የቴሌብር መቀበያ ስልክ፣ የዋጋ ተመኖች፣ የማህበራዊ ገጾች እና የመድረኩ ጠቅላላ ቅንብሮች።
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>የመድረኩ ቅንብሮች በተሳካ ሁኔታ ተቀምጠዋል! በFirestore ውስጥ ተዘምነዋል።</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Payment & TeleBirr Config */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Phone className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              የቴሌብር ክፍያ መቀበያ ቅንብር (TeleBirr Receiving Account)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የቴሌብር መቀበያ ስልክ ቁጥር (TeleBirr Phone Number)
              </label>
              <input
                type="text"
                required
                value={form.telebirrPhone}
                onChange={(e) => setForm({ ...form, telebirrPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                ይህ ቁጥር በተጠቃሚዎች የክፍያ ገጽ ላይ ይታያል፤ በኮድ ውስጥ ሃርድኮድ አልተደረገም።
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የሂሳብ ባለቤት ስም (Account Holder Name)
              </label>
              <input
                type="text"
                required
                value={form.telebirrAccountName}
                onChange={(e) => setForm({ ...form, telebirrAccountName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              ለተጠቃሚዎች የሚታይ የክፍያ መመሪያ (Payment Instructions)
            </label>
            <textarea
              rows={2}
              value={form.telebirrInstructions}
              onChange={(e) => setForm({ ...form, telebirrInstructions: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* General Brand & Identity */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              አጠቃላይ የመድረክ መረጃ (Brand & Identity)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የመድረክ ስም (Platform Name)
              </label>
              <input
                type="text"
                required
                value={form.platformName}
                onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የድረገጽ አርዕስት (Website Title)
              </label>
              <input
                type="text"
                required
                value={form.websiteTitle}
                onChange={(e) => setForm({ ...form, websiteTitle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የግንኙነት ኢሜል (Contact Email)
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የግንኙነት ስልክ (Contact Phone)
              </label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Telegram & Social Links */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Send className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              የማህበራዊ ገጾችና የደራሲ መረጃ (Social Channels & Developer)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                ይፋዊ የቴሌግራም ቻናል (Telegram Channel)
              </label>
              <input
                type="url"
                required
                value={form.telegramLink}
                onChange={(e) => setForm({ ...form, telegramLink: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">https://t.me/ethioai_hub</p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የአዘጋጅ/ደራሲ መለያ (Developer Handle)
              </label>
              <input
                type="text"
                required
                value={form.developerHandle}
                onChange={(e) => setForm({ ...form, developerHandle: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">@TadeApps</p>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              በድረገጽ መነሻ ገጽ ላይ የሚለጠፍ ማስታወቂያ (Homepage Announcement)
            </label>
            <textarea
              rows={2}
              value={form.homepageAnnouncement}
              onChange={(e) => setForm({ ...form, homepageAnnouncement: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            {t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
};
