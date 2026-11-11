import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter,
} from 'lucide-react';
import { Language, PaymentRequest } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';
import { formatETB } from '../utils/admin-logic';

interface PaymentsViewProps {
  currentLang: Language;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [inspectingPayment, setInspectingPayment] = useState<PaymentRequest | null>(null);
  const [rejectingPayment, setRejectingPayment] = useState<PaymentRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('የተላከው ስክሪንሾት ጥራት የጎደለውና የግብይት ቁጥሩ በቴሌብር ሲስተም አልተገኘም።');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredPayments = adminStore.payments.filter((p) => {
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch =
      p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (payment: PaymentRequest) => {
    const res = adminStore.approvePayment(payment.id);
    if (res.success) {
      setStatusMessage(`✓ ${res.message} - ${payment.userName} አሁን ወደ ${payment.plan.toUpperCase()} ፕላን አድጓል!`);
      setInspectingPayment(null);
      setTimeout(() => setStatusMessage(null), 5000);
    } else {
      setStatusMessage(`✕ ${res.message}`);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPayment) return;
    const res = adminStore.rejectPayment(rejectingPayment.id, rejectionReason);
    if (res.success) {
      setStatusMessage(`✓ የክፍያ ጥያቄው ውድቅ ተደርጓል፤ ለተጠቃሚው ማሳወቂያ ተልኳል።`);
      setRejectingPayment(null);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navPaymentRequests} – {t.paymentRequestsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የቴሌብር ማኑዋል ክፍያዎች፡ ደረሰኝን ፈትሾ ማጽደቅ፣ ፕላን ማሳደግ እና ማብቂያ ቀን ማስላት።
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>የደህንነት ህግ፡ ክፍያዎች በAI ብቻ በራስ-ሰር አይጸድቁም፤ የሰው ፈቃድ ግዴታ ነው</span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="በስም፣ በኢሜል ወይም በትራንዛክሽን ቁጥር (TX ID) ይፈልጉ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>ሁኔታ፡</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ሁሉም ሁኔታ</option>
            <option value="pending">ያልጸደቀ (Pending)</option>
            <option value="approved">የጸደቀ (Approved)</option>
            <option value="rejected">ውድቅ የተደረገ (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3 px-4">ተጠቃሚ (User)</th>
              <th className="py-3 px-4">ፕላንና ቆይታ</th>
              <th className="py-3 px-4">መጠን (Amount)</th>
              <th className="py-3 px-4">ትራንዛክሽን ቁጥር (TX ID)</th>
              <th className="py-3 px-4">የቀረበበት ቀን</th>
              <th className="py-3 px-4">ሁኔታ</th>
              <th className="py-3 px-4 text-right">እርምጃ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {payment.userName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {payment.userEmail} • {payment.userPhone}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-semibold uppercase text-emerald-600 dark:text-emerald-400 block">
                    {payment.plan}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {payment.billingPeriod}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {formatETB(payment.expectedAmount)}
                </td>

                <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {payment.transactionId}
                </td>

                <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                  {new Date(payment.submissionDate).toLocaleString()}
                </td>

                <td className="py-3.5 px-4">
                  {payment.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800 animate-pulse">
                      <Clock className="w-3 h-3" /> ያልጸደቀ (Pending)
                    </span>
                  )}
                  {payment.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> የጸደቀ (Approved)
                    </span>
                  )}
                  {payment.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                      <XCircle className="w-3 h-3" /> ውድቅ (Rejected)
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setInspectingPayment(payment)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>መርምር</span>
                    </button>

                    {payment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(payment)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
                        >
                          አጽድቅ
                        </button>
                        <button
                          onClick={() => setRejectingPayment(payment)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm"
                        >
                          ውድቅ
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  {t.noDataFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Payment Modal with TeleBirr Evidence Lightbox */}
      {inspectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  የቴሌብር ክፍያ ማረጋገጫ (TeleBirr Payment Evidence)
                </h3>
              </div>
              <button
                onClick={() => setInspectingPayment(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Data fields */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">ከፋይ ተጠቃሚ</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{inspectingPayment.userName}</p>
                  <p className="text-slate-500 font-mono">{inspectingPayment.userEmail}</p>
                  <p className="text-slate-500 font-mono">{inspectingPayment.userPhone}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">የተመረጠ ፕላን</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {inspectingPayment.plan} ({inspectingPayment.billingPeriod})
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">የሚጠበቅ መጠን</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatETB(inspectingPayment.expectedAmount)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block font-semibold">
                    ቴሌብር የግብይት መለያ (Transaction ID)
                  </span>
                  <span className="font-mono font-black text-sm text-emerald-900 dark:text-emerald-200">
                    {inspectingPayment.transactionId}
                  </span>
                </div>

                {inspectingPayment.adminNotes && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
                    <span className="font-bold block text-[10px]">የውድቅ ምክንያት፡</span>
                    <p className="mt-0.5">{inspectingPayment.adminNotes}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Screenshot Viewer */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  የተላከው የክፍያ ስክሪንሾት (Payment Slip)
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative group">
                  <img
                    src={inspectingPayment.screenshotUrl}
                    alt="TeleBirr Screenshot"
                    className="w-full h-56 object-cover"
                  />
                  <a
                    href={inspectingPayment.screenshotUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-xs gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>ሙሉ ፎቶ በሌላ መስኮት ክፈት</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setInspectingPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                ዝጋ (Close)
              </button>

              {inspectingPayment.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setRejectingPayment(inspectingPayment);
                      setInspectingPayment(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
                  >
                    ውድቅ አድርግ
                  </button>
                  <button
                    onClick={() => handleApprove(inspectingPayment)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                  >
                    ክፍያውን አጽድቅ (Approve)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Reason Modal */}
      {rejectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleRejectSubmit}
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400">
                የክፍያ ጥያቄን ውድቅ ማድረጊያ
              </h3>
              <button
                type="button"
                onClick={() => setRejectingPayment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-500">
                ለ <b className="text-slate-800 dark:text-slate-200">{rejectingPayment.userName}</b> የሚላክ የውድቅ ምክንያት ያስገቡ፡
              </p>

              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                ውድቅ መዝግብ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
