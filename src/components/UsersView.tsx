import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  Edit,
  Eye,
  Calendar,
  Lock,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { Language, UserAccount, UserPlan } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface UsersViewProps {
  currentLang: Language;
}

export const UsersView: React.FC<UsersViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals state
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [targetPlan, setTargetPlan] = useState<UserPlan>('premium');
  const [durationDays, setDurationDays] = useState<number>(30);
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);

  const filteredUsers = adminStore.users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchesPlan = selectedPlan === 'all' || u.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleToggleStatus = (user: UserAccount) => {
    adminStore.toggleUserStatus(user.uid);
  };

  const handleSavePlanOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    adminStore.updateUserPlan(editingUser.uid, targetPlan, durationDays);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Privacy Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navUsers} – {t.usersDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ጠቅላላ የተመዘገቡ ተጠቃሚዎች፡ <b className="text-slate-800 dark:text-slate-200">{adminStore.users.length}</b>
          </p>
        </div>

        {/* Privacy Protection Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
          <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>የግል ዳታ ጥበቃ፡ የግል ቻት፣ ጤና እና የዕቁብ መረጃዎች የተጠበቁ ናቸው</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="በስም፣ በኢሜል ወይም በስልክ ቁጥር ይፈልጉ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>ፕላን፡</span>
          </div>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ሁሉም ፕላኖች</option>
            <option value="free">ነፃ (Free)</option>
            <option value="premium">ፕሪሚየም (Premium)</option>
            <option value="business">ቢዝነስ (Business)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ሁሉም ሁኔታ</option>
            <option value="active">ንቁ (Active)</option>
            <option value="suspended">የታገደ (Suspended)</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="py-3 px-4">ተጠቃሚ (User)</th>
              <th className="py-3 px-4">ፕላን (Plan)</th>
              <th className="py-3 px-4">ሁኔታ (Status)</th>
              <th className="py-3 px-4">የምዝገባ ማብቂያ (Expiry)</th>
              <th className="py-3 px-4">የተመዘገበበት ቀን</th>
              <th className="py-3 px-4 text-right">እርምጃዎች (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filteredUsers.map((user) => {
              const isExpired = user.subscriptionEndDate && user.subscriptionEndDate <= Date.now();
              return (
                <tr key={user.uid} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs">
                        {user.displayName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {user.displayName}
                        </span>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          {user.email} • {user.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        user.plan === 'business'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                          : user.plan === 'premium'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {user.plan}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" /> ንቁ (Active)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                        <XCircle className="w-3.5 h-3.5" /> የታገደ (Suspended)
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {user.subscriptionEndDate ? (
                      <div className="text-[11px]">
                        <span className={`font-medium ${isExpired ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                          {new Date(user.subscriptionEndDate).toLocaleDateString()}
                        </span>
                        {isExpired && <span className="text-[10px] text-rose-500 block">(ያለቀበት)</span>}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">የለም (ነፃ)</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-[11px] text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingUser(user)}
                        title="ዝርዝር ተመልከት"
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setTargetPlan(user.plan);
                          setDurationDays(30);
                        }}
                        title="ፕላን ቀይር"
                        className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === 'active' ? 'አግድ (Suspend)' : 'አንቃ (Reactivate)'}
                        className={`p-1.5 rounded-lg transition ${
                          user.status === 'active'
                            ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                            : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                        }`}
                      >
                        {user.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  {t.noDataFound}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View User Minimal Details Modal (Strict Privacy Protection) */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የተጠቃሚ መረጃ (User Overview)
              </h3>
              <button
                onClick={() => setViewingUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {viewingUser.displayName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{viewingUser.displayName}</p>
                  <p className="text-slate-400 font-mono">{viewingUser.email}</p>
                  <p className="text-slate-400 font-mono">{viewingUser.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ፕላን</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">{viewingUser.plan}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ሁኔታ</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingUser.status}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">ዛሬ ያገለገለ ቻት</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{viewingUser.chatsUsedToday}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">የተከፈቱ ኮርሶች</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {viewingUser.unlockedCourses?.length || 0} ኮርሶች
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold mb-0.5">🔒 የደህንነት ማረጋገጫ (Privacy Enforced)</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  የተጠቃሚው የግል AI ውይይቶች፣ የጤና ጥያቄዎች እና የዕቁብ የፋይናንስ መረጃዎች ለአስተዳዳሪው እንዳይታዩ በሲስተም ደረጃ ተዘግተዋል።
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSavePlanOverride}
            className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                የደንበኝነት ፕላን ማስተካከያ (Admin Plan Override)
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <p className="text-slate-500">
                ለ <b className="text-slate-800 dark:text-slate-200">{editingUser.displayName}</b> አዲስ ፕላን እና የአገልግሎት ማብቂያ ቀን ይምረጡ፡
              </p>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  አዲስ ፕላን ምረጥ
                </label>
                <select
                  value={targetPlan}
                  onChange={(e) => setTargetPlan(e.target.value as UserPlan)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="free">ነፃ (Free Plan) - ያለ ማብቂያ ቀን</option>
                  <option value="premium">ፕሪሚየም (Premium Plan - 50 ቻት/ቀን)</option>
                  <option value="business">ቢዝነስ (Business Plan - ያልተገደበ ቻት)</option>
                </select>
              </div>

              {targetPlan !== 'free' && (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    የአገልግሎት ቆይታ (ቀናት)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="730"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    ምሳሌ፡ 30 ቀናት (1 ወር) ወይም 365 ቀናት (1 ዓመት)
                  </p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300">
                ይህ እርምጃ በአስተዳዳሪው የስራ መዝገብ (Audit Logs) ላይ ይመዘገባል።
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
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
