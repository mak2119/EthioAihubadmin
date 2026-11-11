import React, { useState } from 'react';
import {
  BookCheck,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Language, CoursePayment } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';
import { formatETB } from '../utils/admin-logic';

interface AcademyPaymentsViewProps {
  currentLang: Language;
}

export const AcademyPaymentsView: React.FC<AcademyPaymentsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [payments, setPayments] = useState<CoursePayment[]>(adminStore.coursePayments);
  const [selectedPayment, setSelectedPayment] = useState<CoursePayment | null>(null);

  // Seed sample course payment if empty for demonstration
  React.useEffect(() => {
    if (adminStore.coursePayments.length === 0) {
      adminStore.coursePayments = [
        {
          id: 'cpay_001',
          uid: 'usr_003',
          userName: 'Chala Gemechu',
          userEmail: 'chala.g@outlook.com',
          courseId: 'course_001',
          courseTitle: 'AI Prompt Engineering & Freelancing for Ethiopians',
          amount: 500,
          transactionId: 'CL44556677',
          screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
          submissionDate: Date.now() - 3600000 * 4,
          status: 'pending',
        },
      ];
      setPayments([...adminStore.coursePayments]);
    }
  }, []);

  const handleApprove = (payment: CoursePayment) => {
    payment.status = 'approved';
    const user = adminStore.users.find((u) => u.uid === payment.uid);
    if (user) {
      if (!user.unlockedCourses) user.unlockedCourses = [];
      if (!user.unlockedCourses.includes(payment.courseId)) {
        user.unlockedCourses.push(payment.courseId);
      }
    }
    adminStore.logAction(
      'Academy Course Payment Approved',
      `${payment.courseTitle} unlocked for ${payment.userName} (${payment.uid})`
    );
    adminStore.notify();
    setPayments([...adminStore.coursePayments]);
    setSelectedPayment(null);
  };

  const handleReject = (payment: CoursePayment) => {
    payment.status = 'rejected';
    adminStore.logAction('Academy Course Payment Rejected', `${payment.id} for ${payment.userName}`);
    adminStore.notify();
    setPayments([...adminStore.coursePayments]);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navAcademyPayments} – {t.academyPaymentsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የኢትዮ አካዳሚ የተናጠል ኮርሶች ክፍያ ማረጋገጫና ለተጠቃሚዎች ኮርስ መክፈቻ።
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-600 dark:text-purple-300">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>ማስታወሻ፡ የቢዝነስ (Business) ደንበኞች ሁሉንም ኮርሶች በነፃ በራስ-ሰር ያገኛሉ</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3 px-4">ተጠቃሚ</th>
              <th className="py-3 px-4">የተገዛው ኮርስ</th>
              <th className="py-3 px-4">መጠን (ETB)</th>
              <th className="py-3 px-4">ትራንዛክሽን ቁጥር</th>
              <th className="py-3 px-4">ቀን</th>
              <th className="py-3 px-4">ሁኔታ</th>
              <th className="py-3 px-4 text-right">እርምጃ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 dark:text-white">{p.userName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{p.userEmail}</div>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                  {p.courseTitle}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {formatETB(p.amount)}
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {p.transactionId}
                </td>
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  {new Date(p.submissionDate).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4">
                  {p.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800 animate-pulse">
                      Pending
                    </span>
                  )}
                  {p.status === 'approved' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                      Approved
                    </span>
                  )}
                  {p.status === 'rejected' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400">
                      Rejected
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedPayment(p)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
                      መርምር
                    </button>
                    {p.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(p)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        አጽድቅ
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lightbox Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የኮርስ ክፍያ ማረጋገጫ
              </h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <p><b>ተማሪ፡</b> {selectedPayment.userName} ({selectedPayment.userEmail})</p>
              <p><b>ኮርስ፡</b> {selectedPayment.courseTitle}</p>
              <p><b>መጠን፡</b> {formatETB(selectedPayment.amount)}</p>
              <p className="font-mono"><b>TX ID:</b> {selectedPayment.transactionId}</p>
              <div className="h-44 rounded-xl overflow-hidden border">
                <img src={selectedPayment.screenshotUrl} alt="Slip" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                ዝጋ
              </button>
              {selectedPayment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedPayment)}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold"
                  >
                    ውድቅ
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPayment)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold"
                  >
                    ክፍያውን አጽድቅና ኮርሱን ክፈት
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
