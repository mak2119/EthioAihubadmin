import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  DollarSign,
  Globe,
  Trash2,
  Edit,
} from 'lucide-react';
import { Language, JobListing } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';

interface JobsViewProps {
  currentLang: Language;
}

export const JobsView: React.FC<JobsViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [jobs, setJobs] = useState<JobListing[]>(adminStore.jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTogglePublish = (job: JobListing) => {
    job.published = !job.published;
    job.updatedAt = Date.now();
    adminStore.logAction(
      job.published ? 'Job Vacancy Published' : 'Job Vacancy Unpublished',
      `${job.title} (${job.company})`
    );
    adminStore.notify();
    setJobs([...adminStore.jobs]);
  };

  const handleDeleteJob = (jobId: string) => {
    adminStore.jobs = adminStore.jobs.filter((j) => j.id !== jobId);
    adminStore.logAction('Job Vacancy Deleted', `Job ID ${jobId}`);
    adminStore.notify();
    setJobs([...adminStore.jobs]);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    if (isCreating) {
      adminStore.jobs.unshift(editingJob);
      adminStore.logAction('New Job Vacancy Created', `${editingJob.title} (${editingJob.company})`);
    } else {
      const idx = adminStore.jobs.findIndex((j) => j.id === editingJob.id);
      if (idx !== -1) {
        adminStore.jobs[idx] = { ...editingJob, updatedAt: Date.now() };
        adminStore.logAction('Job Vacancy Updated', `${editingJob.title} (${editingJob.company})`);
      }
    }
    adminStore.notify();
    setJobs([...adminStore.jobs]);
    setEditingJob(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navJobs} – {t.jobsDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            እውነተኛ እና የተረጋገጡ የስራ ማስታወቂያዎችን ማስተዳደሪያ (Firestore: <code>jobs</code>)
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(true);
            setEditingJob({
              id: `job_${Date.now()}`,
              title: '',
              company: '',
              location: 'Addis Ababa',
              salaryText: 'ተደራዳሪ (Negotiable)',
              description: '',
              requirements: ['በሙያው ቢያንስ 1 አመት የስራ ልምድ'],
              applicationUrl: 'https://',
              published: true,
              deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>አዲስ የስራ ማስታወቂያ መዝግብ</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="በስራ መደብ፣ በኩባንያ ወይም በቦታ ይፈልጉ..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`p-5 rounded-2xl border transition ${
              job.published
                ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                {job.title}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  job.published
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {job.published ? 'የታተመ (Published)' : 'ረቂቅ (Draft)'}
              </span>
            </div>

            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              {job.company}
            </p>

            <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>{job.salaryText}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>የማመልከቻ ማብቂያ፡ {job.deadline}</span>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {job.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(job)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  job.published
                    ? 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {job.published ? 'አትም አቁም' : 'አትም'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingJob({ ...job });
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSaveJob}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isCreating ? 'አዲስ የስራ ማስታወቂያ መፍጠሪያ' : 'የስራ ማስታወቂያ ማስተካከያ'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የስራው መጠሪያ (Job Title)
              </label>
              <input
                type="text"
                required
                value={editingJob.title}
                onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የኩባንያ ስም
                </label>
                <input
                  type="text"
                  required
                  value={editingJob.company}
                  onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የስራ ቦታ (Location)
                </label>
                <input
                  type="text"
                  required
                  value={editingJob.location}
                  onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  ደመወዝ (ETB)
                </label>
                <input
                  type="text"
                  value={editingJob.salaryText}
                  onChange={(e) => setEditingJob({ ...editingJob, salaryText: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  የማመልከቻ ማብቂያ ቀን
                </label>
                <input
                  type="date"
                  required
                  value={editingJob.deadline}
                  onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የማመልከቻ ሊንክ / ቴሌግራም
              </label>
              <input
                type="url"
                required
                value={editingJob.applicationUrl}
                onChange={(e) => setEditingJob({ ...editingJob, applicationUrl: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                የስራው ዝርዝር ማብራሪያ
              </label>
              <textarea
                rows={3}
                required
                value={editingJob.description}
                onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingJob(null)}
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
