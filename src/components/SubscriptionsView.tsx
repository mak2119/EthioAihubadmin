import React, { useState } from 'react';
import {
  CreditCard,
  Percent,
  MessageSquare,
  Clock,
  Sparkles,
  ShieldCheck,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';
import { formatETB } from '../utils/admin-logic';

interface SubscriptionsViewProps {
  currentLang: Language;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const settings = adminStore.settings;

  // Form states for prices and limits
  const [monthlyPremium, setMonthlyPremium] = useState(settings.monthlyPremiumPrice);
  const [annualPremium, setAnnualPremium] = useState(settings.annualPremiumPrice);
  const [monthlyBusiness, setMonthlyBusiness] = useState(settings.monthlyBusinessPrice);
  const [annualBusiness, setAnnualBusiness] = useState(settings.annualBusinessPrice);
  const [discountPercent, setDiscountPercent] = useState(settings.annualDiscountPercent);

  const [freeChatLimit, setFreeChatLimit] = useState(settings.freeDailyChatLimit);
  const [premiumChatLimit, setPremiumChatLimit] = useState(settings.premiumDailyChatLimit);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expirationResult, setExpirationResult] = useState<string | null>(null);

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    adminStore.updateSettings({
      monthlyPremiumPrice: Number(monthlyPremium),
      annualPremiumPrice: Number(annualPremium),
      monthlyBusinessPrice: Number(monthlyBusiness),
      annualBusinessPrice: Number(annualBusiness),
      annualDiscountPercent: Number(discountPercent),
      freeDailyChatLimit: Number(freeChatLimit),
      premiumDailyChatLimit: Number(premiumChatLimit),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCalculateAnnuals = (disc: number) => {
    setDiscountPercent(disc);
    const pAnnual = Math.round(monthlyPremium * 12 * (1 - disc / 100));
    const bAnnual = Math.round(monthlyBusiness * 12 * (1 - disc / 100));
    setAnnualPremium(pAnnual);
    setAnnualBusiness(bAnnual);
  };

  const handleTriggerExpirationWorker = () => {
    const res = adminStore.runDailyExpirationCheck();
    if (res.expiredCount > 0) {
      setExpirationResult(
        `✓ የተሳካ የማብቂያ ሂደት፡ ${res.expiredCount} ተጠቃሚዎች ወደ ነፃ ፕላን ተመልሰዋል:\n${res.details.join('\n')}`
      );
    } else {
      setExpirationResult('✓ ምንም ያበቃበት ተጠቃሚ የለም። ሁሉም የደንበኝነት ምዝገባዎች ንቁ ናቸው።');
    }
    setTimeout(() => setExpirationResult(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navSubscriptions} – {t.subscriptionsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የዋጋ ተመኖች በዳታቤዝ ውስጥ ይቀመጣሉ፤ በሲስተሙ በሙሉ በራስ-ሰር ይተገበራሉ።
          </p>
        </div>

        <button
          onClick={handleTriggerExpirationWorker}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>ዕለታዊ ማብቂያ አስፈጽም (Trigger Expiration Worker)</span>
        </button>
      </div>

      {expirationResult && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 whitespace-pre-line flex items-start gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{expirationResult}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-teal-600" />
          <span>አዳዲሶቹ የዋጋ ተመኖችና ገደቦች በተሳካ ሁኔታ ተቀምጠዋል!</span>
        </div>
      )}

      {/* Plan Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* FREE PLAN */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                ነፃ (Free)
              </span>
              <span className="text-xs font-bold text-slate-400">0 ETB</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">ነፃ አባልነት</h3>
            <p className="text-xs text-slate-500 mt-1">
              ለጀማሪዎች እና ለመድረኩ ተጠቃሚዎች የተዘጋጀ ነፃ ጥቅል።
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span><b>{freeChatLimit}</b> ቻቶች በቀን</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>አድሚኑ እስከ <b>5 መሳሪያዎችን</b> መገደብ ይችላል</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>የማሳወቂያ መዘግየት፡ <b>8 ሰዓት</b></span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            ነባሪ ፕላን (ያለ ክፍያ ይሰራል)
          </div>
        </div>

        {/* PREMIUM PLAN */}
        <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[10px] px-3 py-0.5 rounded-bl-lg">
            ታዋቂ (Popular)
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 uppercase">
                ፕሪሚየም (Premium)
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {formatETB(monthlyPremium)} / ወር
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">ፕሪሚየም አባልነት</h3>
            <p className="text-xs text-slate-500 mt-1">
              ለተማሪዎች፣ ለተመራማሪዎች እና ለግል ባለሙያዎች።
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span><b>{premiumChatLimit}</b> ቻቶች በቀን</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>አድሚኑ እስከ <b>2 መሳሪያዎችን</b> ብቻ መገደብ ይችላል</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>የማሳወቂያ መዘግየት፡ <b>1 ሰዓት</b></span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                <span>አመታዊ ክፍያ፡ <b>{formatETB(annualPremium)}</b> (10% ቅናሽ)</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            ከፍተኛ ተጠቃሚ ያለበት ፕላን
          </div>
        </div>

        {/* BUSINESS PLAN */}
        <div className="p-5 rounded-2xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 uppercase">
                ቢዝነስ (Business)
              </span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {formatETB(monthlyBusiness)} / ወር
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">ቢዝነስ ኢንተርፕራይዝ</h3>
            <p className="text-xs text-slate-500 mt-1">
              ለድርጅቶች፣ ለንግድ ስራ ባለቤቶች እና ለኩባንያዎች።
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                <span><b>ያልተገደበ ቻት</b> (Unlimited Chat)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                <span><b>ሁሉንም 12 የአይአይ መሳሪያዎች</b> ያገኛል</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>የማሳወቂያ መዘግየት፡ <b>ወዲያውኑ (0 ሰዓት)</b></span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>ሁሉንም <b>የኢትዮ አካዳሚ ኮርሶች በነፃ</b> ያካትታል</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            ሙሉ ስልጣን ያለው ፕላን
          </div>
        </div>
      </div>

      {/* Pricing and Chat Limit Form */}
      <form
        onSubmit={handleSavePrices}
        className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              የዋጋና የቻት ገደብ ማስተካከያ (Pricing & Limits Matrix)
            </h3>
            <p className="text-xs text-slate-500">
              እዚህ የሚቀየሩት ዋጋዎች በተጠቃሚው ገጽ፣ በክፍያ መጠየቂያ እና በዳታቤዙ ላይ ወዲያውኑ ይንጸባረቃሉ።
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCalculateAnnuals(discountPercent)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>አመታዊ ዋጋ በቅናሽ አስላ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {/* Monthly Premium */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              ፕሪሚየም ወርሃዊ ዋጋ (ETB)
            </label>
            <input
              type="number"
              min="50"
              max="5000"
              value={monthlyPremium}
              onChange={(e) => setMonthlyPremium(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
            />
            <p className="text-[10px] text-slate-400 mt-1">መደበኛ፡ 250 ETB</p>
          </div>

          {/* Annual Premium */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              ፕሪሚየም አመታዊ ዋጋ (ETB)
            </label>
            <input
              type="number"
              min="500"
              max="50000"
              value={annualPremium}
              onChange={(e) => setAnnualPremium(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
            />
            <p className="text-[10px] text-slate-400 mt-1">መደበኛ፡ 2,700 ETB (10% ቅናሽ)</p>
          </div>

          {/* Annual Discount % */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              አመታዊ የቅናሽ መቶኛ (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="50"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
              />
              <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">መደበኛ፡ 10%</p>
          </div>

          {/* Monthly Business */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              ቢዝነስ ወርሃዊ ዋጋ (ETB)
            </label>
            <input
              type="number"
              min="100"
              max="10000"
              value={monthlyBusiness}
              onChange={(e) => setMonthlyBusiness(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
            />
            <p className="text-[10px] text-slate-400 mt-1">መደበኛ፡ 600 ETB</p>
          </div>

          {/* Annual Business */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              ቢዝነስ አመታዊ ዋጋ (ETB)
            </label>
            <input
              type="number"
              min="1000"
              max="100000"
              value={annualBusiness}
              onChange={(e) => setAnnualBusiness(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
            />
            <p className="text-[10px] text-slate-400 mt-1">መደበኛ፡ 6,480 ETB (10% ቅናሽ)</p>
          </div>

          {/* Daily Chat Limits */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የነፃ ቻት ገደብ
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={freeChatLimit}
                onChange={(e) => setFreeChatLimit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
              />
              <p className="text-[10px] text-slate-400 mt-1">ነባሪ፡ 12 በቀን</p>
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የፕሪሚየም ገደብ
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={premiumChatLimit}
                onChange={(e) => setPremiumChatLimit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
              />
              <p className="text-[10px] text-slate-400 mt-1">ነባሪ፡ 50 በቀን</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            {t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
};
