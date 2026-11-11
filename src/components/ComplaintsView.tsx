import React, { useState } from 'react';
import {
  MessageSquareWarning,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Reply,
  ShieldAlert,
  Search,
  Filter,
} from 'lucide-react';
import { Language, ComplaintTicket } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface ComplaintsViewProps {
  currentLang: Language;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(adminStore.complaints);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Reply modal
  const [replyingTicket, setReplyingTicket] = useState<ComplaintTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintTicket['status']>('resolved');

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTicket) return;
    adminStore.replyComplaint(replyingTicket.id, replyText, newStatus);
    setComplaints([...adminStore.complaints]);
    setReplyingTicket(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navComplaints} – {t.complaintsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የተጠቃሚዎች ቴክኒካል፣ የክፍያና የአገልግሎት ቅሬታዎች መመለሻ ማዕከል (Firestore: <code>complaints</code>)
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>ምስጢራዊነት፡ የተጠቃሚዎች የግል ቻት ታሪክ ለድጋፍ ሰጪዎች አይታይም</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="በተጠቃሚ ስም፣ ኢሜል ወይም ርዕስ ይፈልጉ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ሁሉም ዘርፍ (Category)</option>
            <option value="payment">የክፍያ ቅሬታ (Payment)</option>
            <option value="technical">ቴክኒካል ችግር (Technical)</option>
            <option value="ai_response">የAI መልስ (AI Response)</option>
            <option value="account">የአካውንት ጉዳይ (Account)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ሁሉም ሁኔታ</option>
            <option value="pending">ያልተመለሰ (Pending)</option>
            <option value="in_progress">በሂደት ላይ (In Progress)</option>
            <option value="resolved">የተፈታ (Resolved)</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-5 rounded-2xl border transition ${
              ticket.status === 'pending'
                ? 'border-amber-300 dark:border-amber-800/80 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ticket.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-pulse'
                      : ticket.priority === 'high'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {ticket.priority} priority
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                  {ticket.category}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">#{ticket.id}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">{new Date(ticket.createdAt).toLocaleString()}</span>
                {ticket.status === 'pending' && (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> በመጠባበቅ ላይ
                  </span>
                )}
                {ticket.status === 'in_progress' && (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">በመታየት ላይ</span>
                )}
                {ticket.status === 'resolved' && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> የተፈታ
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {ticket.subject}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ከ {ticket.userName} ({ticket.userEmail})
                </p>
              </div>

              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                {ticket.description}
              </p>

              {ticket.adminReply && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold flex items-center gap-1 text-[11px] mb-1">
                    <Reply className="w-3 h-3 text-emerald-600" />
                    የአስተዳዳሪው መልስ፡
                  </span>
                  <p className="text-xs">{ticket.adminReply}</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setReplyingTicket(ticket);
                  setReplyText(ticket.adminReply || '');
                  setNewStatus(ticket.status === 'pending' ? 'resolved' : ticket.status);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition shadow-sm"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>ለተጠቃሚው መልስ ስጥ</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSendReply}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                ቅሬታ መመለሻ፡ {replyingTicket.subject}
              </h3>
              <button
                type="button"
                onClick={() => setReplyingTicket(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-slate-500">
                ለ <b className="text-slate-800 dark:text-slate-200">{replyingTicket.userName}</b> ዳሽቦርድ ላይ የሚደርስ ይፋዊ መልስ ይጻፉ፡
              </p>
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="ሰላም፣ የጠቀሱትን ችግር ፈትተነዋል..."
                className="w-full mt-2 p-3 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">አዲሱ የቅሬታው ሁኔታ</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              >
                <option value="in_progress">በሂደት ላይ (In Progress)</option>
                <option value="resolved">የተፈታ / ተመልሷል (Resolved)</option>
                <option value="closed">የተዘጋ (Closed)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReplyingTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
              >
                መልስ ላክ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
