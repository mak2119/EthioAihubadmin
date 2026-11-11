import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Language, BrokerReport } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface BrokersViewProps {
  currentLang: Language;
}

export const BrokersView: React.FC<BrokersViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [reports, setReports] = useState<BrokerReport[]>(adminStore.brokers);
  const [selectedReport, setSelectedReport] = useState<BrokerReport | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const handleUpdateStatus = (id: string, status: BrokerReport['status'], notes?: string) => {
    const report = adminStore.brokers.find((b) => b.id === id);
    if (!report) return;
    const prev = report.status;
    report.status = status;
    if (notes) report.adminNotes = notes;

    adminStore.logAction(
      `Broker Report Status: ${status}`,
      `${report.brokerName} (${report.brokerPhone})`,
      `Previous: ${prev}`,
      `New: ${status}`
    );
    adminStore.notify();
    setReports([...adminStore.brokers]);
    setSelectedReport(null);
  };

  const handleDelete = (id: string) => {
    adminStore.brokers = adminStore.brokers.filter((b) => b.id !== id);
    adminStore.logAction('Broker Report Dismissed & Removed', `Report ID ${id}`);
    adminStore.notify();
    setReports([...adminStore.brokers]);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navBrokers} – {t.brokersDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የተጠቃሚዎች የደላላ ቅሬታዎችና ማስረጃዎች መገምገሚያ ክፍል (Firestore: <code>brokerReports</code>)
          </p>
        </div>
      </div>

      {/* Critical Legal & Ethical Policy Warning Box */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-700 dark:text-amber-400">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>የህግና የስነ-ምግባር ጥበቃ መመሪያ (Strict Ethics Compliance)</span>
        </div>
        <p>
          1. <b>ሪፖርቶች በራስ-ሰር ለህዝብ ይፋ አይሆኑም፡</b> ያለ ፍተሻ ማንኛውም ሪፖርት በድረገጹ ላይ መለጠፍ በጥብቅ የተከለከለ ነው።
        </p>
        <p>
          2. <b>"የተረጋገጠ" (Verified) የሚል ስያሜ ለደላላ በፍጹም አይሰጥም፡</b> መድረኩ የደላሎችን ትክክለኛነት በይፋ አያረጋግጥም።
        </p>
        <p>
          3. <b>ክሶችና እውነታዎች በግልጽ ይለዩ፡</b> በተጠቃሚ የቀረበ ክስ (Allegation) እንደተረጋገጠ እውነት (Fact) ተደርጎ ሊወሰድ አይችልም።
        </p>
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3 px-4">የደላላው ስም</th>
              <th className="py-3 px-4">ስልክ ቁጥር</th>
              <th className="py-3 px-4">የክሱ ምክንያት</th>
              <th className="py-3 px-4">ቀን</th>
              <th className="py-3 px-4">ሁኔታ</th>
              <th className="py-3 px-4 text-right">እርምጃዎች</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  {report.brokerName}
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-500">
                  {report.brokerPhone}
                </td>

                <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300" title={report.reason}>
                  {report.reason}
                </td>

                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  {new Date(report.submittedDate).toLocaleDateString()}
                </td>

                <td className="py-3.5 px-4">
                  {report.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                      አልተመረመረም (Pending)
                    </span>
                  )}
                  {report.status === 'under_review' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
                      በምርመራ ላይ (Review)
                    </span>
                  )}
                  {report.status === 'rejected' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      ውድቅ (Rejected)
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setAdminNote(report.adminNotes || '');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>መርምር</span>
                    </button>

                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {reports.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  {t.noDataFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Broker Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የደላላ ሪፖርት መመርመሪያ ({selectedReport.id})
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-2 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">የተከሰሰው ደላላ፡</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedReport.brokerName}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">ስልክ ቁጥር፡</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedReport.brokerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">አቅራቢ ተጠቃሚ፡</span>
                <span className="text-slate-500">{selectedReport.userEmail}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የቀረበው ክስ ዝርዝር፡
              </span>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedReport.reason}
              </div>
            </div>

            {selectedReport.evidenceUrl && (
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የቀረበ ማስረጃ ፎቶ፡
                </span>
                <a
                  href={selectedReport.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>የማስረጃ ፋይሉን በሌላ ገጽ ክፈት</span>
                </a>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የአስተዳዳሪው ማስታወሻ (Admin Review Notes)
              </label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="የተከናወነ ምርመራ፣ የደላላው መልስ ወይም ተጨማሪ መረጃ..."
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'rejected', adminNote)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
              >
                ውድቅ አድርግ
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'under_review', adminNote)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold"
              >
                በምርመራ ላይ አድርግ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
