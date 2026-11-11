import React, { useState } from 'react';
import {
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Search,
  Lock,
} from 'lucide-react';
import { Language, TransactionVerification } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';
import { formatETB } from '../utils/admin-logic';

interface EthioVerifyViewProps {
  currentLang: Language;
}

export const EthioVerifyView: React.FC<EthioVerifyViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [verifications, setVerifications] = useState<TransactionVerification[]>(adminStore.verifications);
  const [selectedItem, setSelectedItem] = useState<TransactionVerification | null>(null);
  const [methodNote, setMethodNote] = useState('');

  const handleUpdate = (id: string, status: TransactionVerification['status']) => {
    const item = adminStore.verifications.find((v) => v.id === id);
    if (!item) return;

    item.status = status;
    item.verifiedAt = Date.now();
    if (methodNote) item.verificationMethod = methodNote;

    adminStore.logAction(
      `EthioVerify Decision: ${status.toUpperCase()}`,
      `TX ${item.transactionId} (${item.service}) - ${item.senderName}`,
      `Previous: pending`,
      `Status: ${status}, Verification Method: ${item.verificationMethod}`
    );
    adminStore.notify();
    setVerifications([...adminStore.verifications]);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navEthioVerify} – {t.ethioVerifyDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የቴሌብር፣ የኢትዮጵያ ንግድ ባንክ (CBE) እና ኤም-ፔሳ (M-Pesa) ግብይቶች ማጣሪያና ማረጋገጫ።
          </p>
        </div>
      </div>

      {/* Critical Banking Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-700 dark:text-amber-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>የፋይናንስ ማረጋገጫ ጥብቅ መመሪያ (Anti-Fraud & Authenticity Verification)</span>
        </div>
        <p>
          <b>ማስጠንቀቂያ፡</b> ስክሪንሾት ወይም የOCR ምስል ብቻውን የግብይቱን ትክክለኛነት አያረጋግጥም! ትክክለኛ ማረጋገጫ በይፋዊ የቴሌብር/የባንክ መግቢያ (Merchant Portal) ወይም በይፋዊ የኤስኤምኤስ ሪፖርት መመሳከር አለበት። በምንም መልኩ የፈጠራ ባንክ API አናቀርብም። እያንዳንዱ ውሳኔ የተረጋገጠበት ዘዴ በግልጽ ይመዘገባል።
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3 px-4">አገልግሎት (Service)</th>
              <th className="py-3 px-4">ትራንዛክሽን ቁጥር (TX ID)</th>
              <th className="py-3 px-4">መጠን (Amount)</th>
              <th className="py-3 px-4">ከፋይ (Sender)</th>
              <th className="py-3 px-4">የማረጋገጫ ዘዴ (Method)</th>
              <th className="py-3 px-4">ሁኔታ</th>
              <th className="py-3 px-4 text-right">እርምጃ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {verifications.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                <td className="py-3.5 px-4 font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  {item.service}
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                  {item.transactionId}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {formatETB(item.amount)}
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold block">{item.senderName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{item.senderPhone}</span>
                </td>
                <td className="py-3.5 px-4 max-w-xs truncate text-slate-500" title={item.verificationMethod}>
                  {item.verificationMethod}
                </td>
                <td className="py-3.5 px-4">
                  {item.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800 animate-pulse">
                      Pending
                    </span>
                  )}
                  {item.status === 'verified' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      Verified
                    </span>
                  )}
                  {item.status === 'rejected' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400">
                      Rejected
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setMethodNote(item.verificationMethod);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
                  >
                    መርምር & ውሳኔ ስጥ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review & Decision Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የግብይት ምርመራና ውሳኔ ({selectedItem.service.toUpperCase()})
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-2 border">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">TX ID:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedItem.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">መጠን:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatETB(selectedItem.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ከፋይ:</span>
                <span>{selectedItem.senderName} ({selectedItem.senderPhone})</span>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">
                የተረጋገጠበት ይፋዊ ዘዴ (Verification Audit Methodology)
              </label>
              <textarea
                rows={2}
                value={methodNote}
                onChange={(e) => setMethodNote(e.target.value)}
                placeholder="ምሳሌ፡ በቴሌብር ነጋዴ መተግበሪያ ላይ የሂሳብ ቁጥር ተመሳክሯል..."
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                ዝጋ
              </button>
              <button
                onClick={() => handleUpdate(selectedItem.id, 'rejected')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold"
              >
                ውድቅ አድርግ
              </button>
              <button
                onClick={() => handleUpdate(selectedItem.id, 'verified')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold"
              >
                ትክክለኛነቱን አረጋግጥ (Verify)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
