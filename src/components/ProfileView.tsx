import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Key,
  Lock,
  Mail,
  Smartphone,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';

interface ProfileViewProps {
  currentLang: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          {t.navProfile} – {t.profileDesc}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          የተረጋገጠ የአስተዳዳሪ ክፍለ-ጊዜ እና የደህንነት ፈቃዶች (Custom Claims)።
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-2xl font-black shadow-lg">
            TG
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Tadesse G. (@TadeApps)
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.superAdmin}</span>
            </p>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-left text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ሚና (Role):</span>
              <span className="font-semibold text-slate-900 dark:text-white">Platform Super Admin</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">መለያ (UID):</span>
              <span className="font-mono text-[10px] text-slate-500">admin_primary_01</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ኢሜል (Email):</span>
              <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200">admin@ethioaihub.et</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">የሴኪዩሪቲ ሁኔታ:</span>
              <span className="text-emerald-500 font-semibold">Active & Token Verified</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Firebase Custom Claims & Security Protocol */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የፋየርቤዝ ከስተም ክሌይምስ ሁኔታ (Firebase Custom Claims Verification)
              </h3>
            </div>

            <p className="text-slate-500 leading-relaxed">
              በፕሮጀክት ደንቡ መሰረት የአስተዳዳሪ ፈቃድ በፋየርቤዝ ከስተም ክሌይምስ (Custom Claims: <code>role: 'admin'</code>) ብቻ ነው የሚረጋገጠው። ተራ ተጠቃሚ በFirestore ውስጥ የራሱን ሚና መቀየር እንዳይችል በደህንነት ህጉ ተከልክሏል።
            </p>

            <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto space-y-1">
              <p className="text-slate-500">// Firebase ID Token Decoded Claims Payload:</p>
              <p>{'{'}</p>
              <p className="pl-4">"iss": "https://securetoken.google.com/ethio-ai-hub",</p>
              <p className="pl-4">"aud": "ethio-ai-hub",</p>
              <p className="pl-4">"auth_time": 1770000000,</p>
              <p className="pl-4">"user_id": "admin_primary_01",</p>
              <p className="pl-4">"email": "admin@ethioaihub.et",</p>
              <p className="pl-4 text-teal-300">"admin": true,</p>
              <p className="pl-4 text-teal-300">"superAdmin": true,</p>
              <p className="pl-4 text-teal-300">"permissions": ["all", "manage_users", "approve_payments", "platform_settings"]</p>
              <p>{'}'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
              <p className="font-bold mb-0.5">✓ አድሚን የማቋቋሚያ ምስጢር (Admin Provisioning Standard)</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                አዲስ አድሚን የሚሾመው በይፋዊ የምዝገባ ቅጽ ሳይሆን በNode.js Firebase Admin SDK ስክሪፕት ወይም በCloudflare Worker ደህንነቱ በተጠበቀ ማስተር ኪይ ብቻ ነው።
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
