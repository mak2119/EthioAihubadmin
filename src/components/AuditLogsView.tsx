import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  Download,
  Lock,
} from 'lucide-react';
import { Language, AdminAuditLog } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface AuditLogsViewProps {
  currentLang: Language;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [logs, setLogs] = useState<AdminAuditLog[]>(adminStore.auditLogs);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetRecord.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = 'ID,Timestamp,AdminUID,AdminEmail,Action,TargetRecord,PreviousValue,NewValue\n';
    const rows = filtered
      .map(
        (l) =>
          `"${l.id}","${new Date(l.timestamp).toISOString()}","${l.adminUid}","${l.adminEmail}","${l.action.replace(/"/g, '""')}","${l.targetRecord.replace(/"/g, '""')}","${(l.previousValue || '').replace(/"/g, '""')}","${(l.newValue || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ethio_ai_hub_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navAuditLogs} – {t.auditLogsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የማይለወጥ የአስተዳዳሪ የስራ እንቅስቃሴና የለውጦች መዝገብ (Firestore: <code>adminLogs</code>)
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>መዝገቡን በCSV አውርድ (Export CSV)</span>
        </button>
      </div>

      {/* Immutable Security Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          <b>የደህንነት ዋስትና፡</b> ይህ መዝገብ የማይለወጥ (Immutable Append-Only) ሲሆን ማናቸውም የክፍያ ማጽደቅ፣ የዋጋ ለውጥ እና የፕላን ማስተካከያ በሰከንድ ደረጃ ይመዘገባል።
        </span>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="በእርምጃ አይነት፣ በዒላማ መዝገብ ወይም በአድሚን ኢሜል ይፈልጉ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3 px-4">ሰዓትና ቀን (Timestamp)</th>
              <th className="py-3 px-4">አስተዳዳሪ (Admin)</th>
              <th className="py-3 px-4">የተከናወነ እርምጃ (Action)</th>
              <th className="py-3 px-4">ዒላማ መዝገብ (Target)</th>
              <th className="py-3 px-4">የነበረው እሴት (Before)</th>
              <th className="py-3 px-4">አዲሱ እሴት (After)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-900 dark:text-white block font-mono text-[11px]">
                    {log.adminEmail}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.adminUid}</span>
                </td>
                <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                  {log.action}
                </td>
                <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                  {log.targetRecord}
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate" title={log.previousValue}>
                  {log.previousValue || '-'}
                </td>
                <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 text-[11px] max-w-xs truncate" title={log.newValue}>
                  {log.newValue || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
