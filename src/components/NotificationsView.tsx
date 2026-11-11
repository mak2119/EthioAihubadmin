import React, { useState } from 'react';
import {
  BellRing,
  Send,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Language, BroadcastNotification } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface NotificationsViewProps {
  currentLang: Language;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [notifications, setNotifications] = useState<BroadcastNotification[]>(adminStore.notifications);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<BroadcastNotification['category']>('general');
  const [audience, setAudience] = useState<BroadcastNotification['targetAudience']>('all');
  const [targetUid, setTargetUid] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const newNotif: BroadcastNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      category,
      targetAudience: audience,
      targetUid: audience === 'individual' ? targetUid : undefined,
      createdAt: Date.now(),
      status: 'sent',
      sentAt: Date.now(),
    };

    adminStore.notifications.unshift(newNotif);
    adminStore.logAction(
      `Broadcast Notification Sent (${audience})`,
      `${title} [${category}]`
    );
    adminStore.notify();
    setNotifications([...adminStore.notifications]);

    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navNotifications} – {t.notificationsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ለተጠቃሚዎች ማሳወቂያዎችን እና የዜና መልዕክቶችን በፕላን ደረጃ መላኪያ ማዕከል።
          </p>
        </div>
      </div>

      {/* Tier Delay Rules Explainer Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>የማሳወቂያ ማድረሻ ሰዓት እንደ ደንበኛው ፕላን (Tiered Delivery Schedule)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">ነፃ አባላት (Free)</span>
            <span className="text-[11px] text-slate-500 block">ከ <b>8 ሰዓት</b> መዘግየት በኋላ ይደርሳል</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800/60">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block">ፕሪሚየም (Premium)</span>
            <span className="text-[11px] text-slate-500 block">ከ <b>1 ሰዓት</b> መዘግየት በኋላ ይደርሳል</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-800/60">
            <span className="font-bold text-purple-700 dark:text-purple-400 block">ቢዝነስ (Business)</span>
            <span className="text-[11px] text-slate-500 block"><b>ወዲያውኑ በቅጽበት (0 ሰዓት)</b> ይደርሳል</span>
          </div>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>ማሳወቂያው በተሳካ ሁኔታ ተልኳል! በባክኢንድ ሰንጠረዥ መሰረት ለተጠቃሚዎች ይደርሳል።</span>
        </div>
      )}

      {/* Broadcast Composer */}
      <form
        onSubmit={handleSendBroadcast}
        className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Send className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            አዲስ ማሳወቂያ መላኪያ (Compose Broadcast)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              የማሳወቂያው አርዕስት (Title)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ምሳሌ፡ አዲስ የኢትዮ አካዳሚ ኮርስ ተለቋል..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                ምድብ (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              >
                <option value="general">አጠቃላይ (General)</option>
                <option value="maintenance">ጥገና (Maintenance)</option>
                <option value="jobs">ስራ (Jobs)</option>
                <option value="academy">አካዳሚ (Academy)</option>
                <option value="homes">ቤቶች (Homes)</option>
                <option value="subscription">ምዝገባ (Subscription)</option>
                <option value="ethiodrive">ኢትዮ ድራይቭ (Drive)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                ተደራሽ አካል (Audience)
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              >
                <option value="all">ለሁሉም ተጠቃሚዎች (All)</option>
                <option value="free">ለነፃ አባላት ብቻ (Free)</option>
                <option value="premium">ለፕሪሚየም ብቻ (Premium)</option>
                <option value="business">ለቢዝነስ ብቻ (Business)</option>
                <option value="individual">ለአንድ ግለሰብ ብቻ (Individual)</option>
              </select>
            </div>
          </div>
        </div>

        {audience === 'individual' && (
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              የተጠቃሚው መለያ (UID)
            </label>
            <input
              type="text"
              required
              value={targetUid}
              onChange={(e) => setTargetUid(e.target.value)}
              placeholder="usr_001..."
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono"
            />
          </div>
        )}

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            የማሳወቂያው መልዕክት (Message)
          </label>
          <textarea
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ዝርዝር መልዕክትዎን እዚህ ይጻፉ..."
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ማሳወቂያውን ላክ (Broadcast Now)</span>
          </button>
        </div>
      </form>

      {/* History of Sent Notifications */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          የተላኩ ማሳወቂያዎች ታሪክ (Sent History)
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                  <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                    {n.category}
                  </span>
                  <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 uppercase">
                    {n.targetAudience}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{n.message}</p>
              </div>

              <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
