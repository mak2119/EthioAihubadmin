import React, { useState } from 'react';
import {
  Car,
  Plus,
  ShieldCheck,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Language, OfficialSource } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface EthioDriveViewProps {
  currentLang: Language;
}

export const EthioDriveView: React.FC<EthioDriveViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [sources, setSources] = useState<OfficialSource[]>(adminStore.officialSources);
  const [editingSource, setEditingSource] = useState<OfficialSource | null>(null);

  const handleToggleApprove = (source: OfficialSource) => {
    source.approved = !source.approved;
    source.lastCheckedDate = new Date().toISOString().split('T')[0];
    adminStore.logAction(
      source.approved ? 'Official Source Approved' : 'Official Source Suspended',
      `${source.title} (${source.sourceName})`
    );
    adminStore.notify();
    setSources([...adminStore.officialSources]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSource) return;
    const idx = adminStore.officialSources.findIndex((s) => s.id === editingSource.id);
    if (idx !== -1) {
      adminStore.officialSources[idx] = editingSource;
    } else {
      adminStore.officialSources.unshift(editingSource);
    }
    adminStore.notify();
    setSources([...adminStore.officialSources]);
    setEditingSource(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navEthioDrive} – {t.ethioDriveDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ይፋዊ የመንግስት የትራንስፖርት፣ የትራፊክ ደንብና የመንጃ ፍቃድ መረጃዎች ማስተዳደሪያ (RAG Storage)
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSource({
              id: `src_${Date.now()}`,
              sourceName: 'የኢትዮጵያ ፌደራል ትራንስፖርት ባለስልጣን',
              sourceUrl: 'https://motl.gov.et',
              category: 'traffic_fines',
              title: '',
              content: '',
              lastCheckedDate: new Date().toISOString().split('T')[0],
              approved: true,
            });
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>አዲስ ይፋዊ ምንጭ ጨምር</span>
        </button>
      </div>

      {/* RAG Verification Policy Banner */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-800 dark:text-blue-300 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          የህግና የትራንስፖርት መረጃ ትክክለኛነት ደንብ (RAG Trust Standard)
        </p>
        <p>
          በኢትዮ ድራይቭ ውስጥ የሚቀርቡ መረጃዎች በሙሉ በቀጥታ ከኢትዮጵያ መንግስት ይፋዊ ምንጮች (ትራፊክ ማኔጅመንት ኤጀንሲ፣ ትራንስፖርት ሚኒስቴር) ብቻ የተወሰዱ መሆን አለባቸው። በAI የተፈበረኩ የህግና የቅጣት መረጃዎች እንዳይገቡ በአስተዳዳሪው ብቻ ይረጋገጣሉ።
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sources.map((src) => (
          <div
            key={src.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {src.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    src.approved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {src.approved ? 'የጸደቀ (Verified)' : 'ያልጸደቀ'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-500">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  ምንጭ፡ {src.sourceName}
                </p>
                <a
                  href={src.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{src.sourceUrl}</span>
                </a>
                <p className="text-[10px] text-slate-400">
                  የመጨረሻ ምርመራ፡ {src.lastCheckedDate}
                </p>
              </div>

              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs leading-relaxed border border-slate-100 dark:border-slate-800">
                {src.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleApprove(src)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  src.approved ? 'text-slate-500 hover:text-slate-700' : 'bg-emerald-600 text-white'
                }`}
              >
                {src.approved ? 'ፈቃድ ሰርዝ' : 'አረጋግጥና አጽድቅ'}
              </button>

              <button
                onClick={() => setEditingSource({ ...src })}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                ✏️ አስተካክል
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                ይፋዊ የትራንስፖርት መረጃ ማዘጋጃ
              </h3>
              <button
                type="button"
                onClick={() => setEditingSource(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1">የሰነዱ/መመሪያው ርዕስ</label>
              <input
                type="text"
                required
                value={editingSource.title}
                onChange={(e) => setEditingSource({ ...editingSource, title: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">ይፋዊ የመንግስት አካል</label>
                <input
                  type="text"
                  required
                  value={editingSource.sourceName}
                  onChange={(e) => setEditingSource({ ...editingSource, sourceName: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ይፋዊ ድረገጽ (Source URL)</label>
                <input
                  type="url"
                  required
                  value={editingSource.sourceUrl}
                  onChange={(e) => setEditingSource({ ...editingSource, sourceUrl: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">የህግ/መመሪያው ዝርዝር ይዘት (RAG Chunk)</label>
              <textarea
                rows={4}
                required
                value={editingSource.content}
                onChange={(e) => setEditingSource({ ...editingSource, content: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSource(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
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
