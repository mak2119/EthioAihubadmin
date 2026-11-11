import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Lock,
  Unlock,
} from 'lucide-react';
import { Language } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface MaintenanceViewProps {
  currentLang: Language;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const settings = adminStore.settings;

  const [isMaintenance, setIsMaintenance] = useState(settings.isMaintenanceMode);
  const [msgAm, setMsgAm] = useState(settings.maintenanceMessageAm);
  const [msgEn, setMsgEn] = useState(settings.maintenanceMessageEn);
  const [msgOr, setMsgOr] = useState(settings.maintenanceMessageOr);
  const [reopeningTime, setReopeningTime] = useState(settings.maintenanceEstimatedReopening);
  const [showPreview, setShowPreview] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleGlobal = (enable: boolean) => {
    setIsMaintenance(enable);
    adminStore.toggleMaintenanceMode(enable, msgAm, reopeningTime);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveMessages = (e: React.FormEvent) => {
    e.preventDefault();
    adminStore.updateSettings({
      isMaintenanceMode: isMaintenance,
      maintenanceMessageAm: msgAm,
      maintenanceMessageEn: msgEn,
      maintenanceMessageOr: msgOr,
      maintenanceEstimatedReopening: reopeningTime,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navMaintenance} – {t.maintenanceDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የመድረኩን ተደራሽነት ለጥገና ማገድ እና ለተጠቃሚዎች ይፋዊ መልዕክት ማሳያ።
          </p>
        </div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
        >
          <Eye className="w-4 h-4" />
          <span>{showPreview ? 'ቅድመ እይታ ደብቅ' : 'የተጠቃሚዎች ገጽ ቅድመ እይታ (Preview)'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>የጥገና ሁነታ ቅንብሮች በተሳካ ሁኔታ ተቀምጠዋል!</span>
        </div>
      )}

      {/* Global Toggle Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isMaintenance
            ? 'border-amber-400 bg-amber-500/10 shadow-lg'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                isMaintenance
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                አጠቃላይ የድረገጽ ጥገና ሁነታ (Global Maintenance Mode)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ይህ ሲበራ ተራ ተጠቃሚዎች ወደ መድረኩ መግባት አይችሉም፤ የአስተዳዳሪው ፓነል ግን ሁልጊዜ ክፍት ሆኖ ይቀጥላል።
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleGlobal(!isMaintenance)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
                isMaintenance
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700'
              }`}
            >
              {isMaintenance ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>{isMaintenance ? 'ጥገናውን አጥፋ (Reopen Platform)' : 'ጥገናውን አብራ (Enable Maintenance)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Public Maintenance Page Live Preview */}
      {showPreview && (
        <div className="p-8 rounded-3xl border-2 border-dashed border-amber-400/80 bg-slate-950 text-white shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Wrench className="w-3.5 h-3.5" />
            <span>ይፋዊ የተጠቃሚዎች መመልከቻ ገጽ (Live User View)</span>
          </div>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl">
            🇪🇹
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            ኢትዮ አይአይ ሀብ በታቀደ ጥገና ላይ ነው
          </h2>

          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {msgAm}
          </p>

          <div className="p-3 bg-white/10 rounded-xl inline-flex items-center gap-2 text-xs font-mono text-emerald-400 border border-white/10">
            <Clock className="w-4 h-4" />
            <span>ስራ የሚጀመርበት ግምት፡ {new Date(reopeningTime).toLocaleString()}</span>
          </div>

          <p className="text-xs text-slate-400">
            ለጥያቄ ወይም አስቸኳይ ድጋፍ፡ <b>https://t.me/ethioai_hub</b>
          </p>
        </div>
      )}

      {/* Maintenance Messages Form */}
      <form
        onSubmit={handleSaveMessages}
        className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs"
      >
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          የጥገና ማስታወቂያ መልዕክቶች በ3 ቋንቋዎች (Trilingual Maintenance Messages)
        </h3>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            የአማርኛ መልዕክት (Amharic)
          </label>
          <textarea
            rows={2}
            value={msgAm}
            onChange={(e) => setMsgAm(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            የእንግሊዝኛ መልዕክት (English)
          </label>
          <textarea
            rows={2}
            value={msgEn}
            onChange={(e) => setMsgEn(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            የአፋን ኦሮሞ መልዕክት (Afaan Oromoo)
          </label>
          <textarea
            rows={2}
            value={msgOr}
            onChange={(e) => setMsgOr(e.target.value)}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            ስራ የሚጀመርበት የተገመተ ሰዓት (Estimated Reopening Time)
          </label>
          <input
            type="datetime-local"
            value={reopeningTime.slice(0, 16)}
            onChange={(e) => setReopeningTime(new Date(e.target.value).toISOString())}
            className="w-full sm:w-80 p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            {t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
};
