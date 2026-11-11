import React, { useState } from 'react';
import {
  Cpu,
  Bot,
  Briefcase,
  GraduationCap,
  FileText,
  Languages,
  TrendingUp,
  Home,
  DollarSign,
  HeartPulse,
  Car,
  BookOpen,
  ShieldCheck,
  Check,
  AlertTriangle,
  Wrench,
  Lock,
  Unlock,
  ShieldAlert,
} from 'lucide-react';
import { Language, AITool } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface ToolsViewProps {
  currentLang: Language;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Bot,
  Briefcase,
  GraduationCap,
  FileText,
  Languages,
  TrendingUp,
  Home,
  DollarSign,
  HeartPulse,
  Car,
  BookOpen,
  ShieldCheck,
};

export const ToolsView: React.FC<ToolsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [tools, setTools] = useState<AITool[]>(adminStore.tools);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit tool info modal
  const [editingTool, setEditingTool] = useState<AITool | null>(null);

  // Counts of disabled tools per tier
  const freeDisabledCount = tools.filter((t) => !t.freeAccess || !t.enabled).length;
  const premiumDisabledCount = tools.filter((t) => !t.premiumAccess || !t.enabled).length;

  const handleToggleEnable = (tool: AITool) => {
    const res = adminStore.updateToolStatus(tool.id, { enabled: !tool.enabled });
    if (!res.success) {
      setErrorMessage(res.message);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      setTools([...adminStore.tools]);
      setSuccessMessage(`${tool.nameEn} የስራ ሁኔታ ተቀይሯል`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleToggleMaintenance = (tool: AITool) => {
    const res = adminStore.updateToolStatus(tool.id, { isMaintenance: !tool.isMaintenance });
    if (res.success) {
      setTools([...adminStore.tools]);
      setSuccessMessage(`${tool.nameEn} የጥገና ሁኔታ ተቀይሯል`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleToggleTierAccess = (tool: AITool, tier: 'free' | 'premium') => {
    if (tier === 'free') {
      const nextFree = !tool.freeAccess;
      const res = adminStore.updateToolStatus(tool.id, { freeAccess: nextFree });
      if (!res.success) {
        setErrorMessage(res.message);
        setTimeout(() => setErrorMessage(null), 4000);
      } else {
        setTools([...adminStore.tools]);
      }
    } else if (tier === 'premium') {
      const nextPrem = !tool.premiumAccess;
      const res = adminStore.updateToolStatus(tool.id, { premiumAccess: nextPrem });
      if (!res.success) {
        setErrorMessage(res.message);
        setTimeout(() => setErrorMessage(null), 4000);
      } else {
        setTools([...adminStore.tools]);
      }
    }
  };

  const handleSaveToolDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;
    const existing = adminStore.tools.find((t) => t.id === editingTool.id);
    if (existing) {
      Object.assign(existing, editingTool);
      adminStore.logAction('Tool Metadata Edited', `${editingTool.nameEn} (${editingTool.id})`);
      adminStore.notify();
      setTools([...adminStore.tools]);
      setEditingTool(null);
      setSuccessMessage('የመሳሪያው መረጃ ተዘምኗል');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Quota Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navAITools} – {t.toolsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የ12ቱ አይአይ መሳሪያዎች ፍቃድ፣ የጥገና ሁነታ እና በፕላን ደረጃ የሚደረግ ገደብ።
          </p>
        </div>

        {/* Quota Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <span className="text-slate-400 font-medium">ነፃ ፕላን የተገደቡ፡</span>
            <span className={`font-bold ${freeDisabledCount > 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {freeDisabledCount} / 5 (ከፍተኛ)
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <span className="text-slate-400 font-medium">ፕሪሚየም የተገደቡ፡</span>
            <span className={`font-bold ${premiumDisabledCount > 2 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {premiumDisabledCount} / 2 (ከፍተኛ)
            </span>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <b>የፍቃድ ህግ፡</b> ነፃ ተጠቃሚዎች እስከ 5 መሳሪያዎች ሊከለከሉ ይችላሉ። ፕሪሚየም እስከ 2 ብቻ። ቢዝነስ ተጠቃሚዎች ሁሉንም 12 መሳሪያዎች በሙሉ ያገኛሉ።
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 12 Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const Icon = ICON_MAP[tool.icon] || Cpu;
          return (
            <div
              key={tool.id}
              className={`p-5 rounded-2xl border transition-all ${
                tool.enabled
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
                  : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${tool.enabled ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {currentLang === 'am' ? tool.nameAm : tool.nameEn}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{tool.order} • {tool.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingTool({ ...tool })}
                    title="አስተካክል"
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
                  >
                    ✏️
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-slate-500 line-clamp-2 h-8">
                {currentLang === 'am' ? tool.descriptionAm : tool.descriptionEn}
              </p>

              {/* Status Toggles: Enabled & Maintenance */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleToggleEnable(tool)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                    tool.enabled
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {tool.enabled ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{tool.enabled ? 'የበራ (Enabled)' : 'የጠፋ (Disabled)'}</span>
                </button>

                <button
                  onClick={() => handleToggleMaintenance(tool)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition ${
                    tool.isMaintenance
                      ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-700 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{tool.isMaintenance ? 'በጥገና ላይ' : 'ጥገና አይደለም'}</span>
                </button>
              </div>

              {/* Tier Access Checkboxes */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                  የፕላን ፈቃድ (Tier Access Matrix)
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {/* Free access */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tool.freeAccess}
                      disabled={!tool.enabled}
                      onChange={() => handleToggleTierAccess(tool, 'free')}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={tool.freeAccess ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}>
                      Free
                    </span>
                  </label>

                  {/* Premium access */}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tool.premiumAccess}
                      disabled={!tool.enabled}
                      onChange={() => handleToggleTierAccess(tool, 'premium')}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className={tool.premiumAccess ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}>
                      Premium
                    </span>
                  </label>

                  {/* Business access (always locked to true if tool enabled) */}
                  <label className="flex items-center gap-1.5 cursor-not-allowed" title="Business subscribers always receive all tools">
                    <input
                      type="checkbox"
                      checked={tool.businessAccess && tool.enabled}
                      disabled={true}
                      className="rounded text-purple-600"
                    />
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      Business
                    </span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Tool Modal */}
      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSaveToolDetails}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የመሳሪያ መረጃ ማስተካከያ ({editingTool.id})
              </h3>
              <button
                type="button"
                onClick={() => setEditingTool(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የአማርኛ ስም
                </label>
                <input
                  type="text"
                  required
                  value={editingTool.nameAm}
                  onChange={(e) => setEditingTool({ ...editingTool, nameAm: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የእንግሊዝኛ ስም
                </label>
                <input
                  type="text"
                  required
                  value={editingTool.nameEn}
                  onChange={(e) => setEditingTool({ ...editingTool, nameEn: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የአማርኛ ማብራሪያ
              </label>
              <textarea
                rows={2}
                value={editingTool.descriptionAm}
                onChange={(e) => setEditingTool({ ...editingTool, descriptionAm: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የእንግሊዝኛ ማብራሪያ
              </label>
              <textarea
                rows={2}
                value={editingTool.descriptionEn}
                onChange={(e) => setEditingTool({ ...editingTool, descriptionEn: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTool(null)}
                className="px-4 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                {t.saveChanges}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
