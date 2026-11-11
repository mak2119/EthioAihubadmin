import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Award,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  FileText,
  HelpCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Language, AcademyCourse, CourseLesson, CourseQuizQuestion } from '../types/admin';
import { TRANSLATIONS } from '../utils/translations';
import { adminStore } from '../services/admin-data';
import { formatETB } from '../utils/admin-logic';

interface AcademyViewProps {
  currentLang: Language;
}

export const AcademyView: React.FC<AcademyViewProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const [courses, setCourses] = useState<AcademyCourse[]>(adminStore.courses);
  const [editingCourse, setEditingCourse] = useState<AcademyCourse | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Lesson editor modal
  const [activeCourseForLessons, setActiveCourseForLessons] = useState<AcademyCourse | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [showCertificateDisclaimer, setShowCertificateDisclaimer] = useState(false);

  const handleTogglePublish = (course: AcademyCourse) => {
    course.published = !course.published;
    course.updatedAt = Date.now();
    adminStore.logAction(
      course.published ? 'Academy Course Published' : 'Academy Course Unpublished',
      `${course.title} (${course.id})`
    );
    adminStore.notify();
    setCourses([...adminStore.courses]);
  };

  const handleDeleteCourse = (courseId: string) => {
    adminStore.courses = adminStore.courses.filter((c) => c.id !== courseId);
    adminStore.logAction('Academy Course Deleted', `Course ID ${courseId}`);
    adminStore.notify();
    setCourses([...adminStore.courses]);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (isCreating) {
      adminStore.courses.unshift(editingCourse);
      adminStore.logAction('New Academy Course Created', editingCourse.title);
    } else {
      const idx = adminStore.courses.findIndex((c) => c.id === editingCourse.id);
      if (idx !== -1) {
        adminStore.courses[idx] = { ...editingCourse, updatedAt: Date.now() };
        adminStore.logAction('Academy Course Updated', editingCourse.title);
      }
    }
    adminStore.notify();
    setCourses([...adminStore.courses]);
    setEditingCourse(null);
    setIsCreating(false);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourseForLessons || !editingLesson) return;

    const existingIdx = activeCourseForLessons.lessons.findIndex((l) => l.id === editingLesson.id);
    if (existingIdx !== -1) {
      activeCourseForLessons.lessons[existingIdx] = editingLesson;
    } else {
      activeCourseForLessons.lessons.push(editingLesson);
    }
    activeCourseForLessons.updatedAt = Date.now();

    adminStore.logAction('Course Lesson Updated (Fixed Admin Content)', `${activeCourseForLessons.title} -> ${editingLesson.title}`);
    adminStore.notify();
    setCourses([...adminStore.courses]);
    setEditingLesson(null);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!activeCourseForLessons) return;
    activeCourseForLessons.lessons = activeCourseForLessons.lessons.filter((l) => l.id !== lessonId);
    adminStore.notify();
    setCourses([...adminStore.courses]);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.navAcademy} – {t.academyDesc}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            የኢትዮ አካዳሚ ኮርሶች፣ የትምህርት ምዕራፎች፣ ፈተናዎችና የተሳትፎ ምስክር ወረቀት ማስተዳደሪያ።
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCertificateDisclaimer(!showCertificateDisclaimer)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>የምስክር ወረቀት ፖሊሲ</span>
          </button>

          <button
            onClick={() => {
              setIsCreating(true);
              setEditingCourse({
                id: `course_${Date.now()}`,
                title: '',
                description: '',
                instructor: 'Ethio AI Academy Faculty',
                priceEtb: 400,
                language: 'am',
                published: true,
                thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
                lessons: [],
                quizzes: [],
                enrolledCount: 0,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>አዲስ ኮርስ ፍጠር</span>
          </button>
        </div>
      </div>

      {/* Certificate Policy Banner */}
      {showCertificateDisclaimer && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 space-y-1 animate-in fade-in">
          <p className="font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            የሰርተፊኬት ህጋዊ ማስታወሻ (Mandatory Certificate Standard)
          </p>
          <p>
            በመድረኩ ላይ የሚሰጡ ሰርተፊኬቶች በሙሉ በግልጽ እንደሚከተለው መጻፍ አለባቸው፡
          </p>
          <p className="p-2 bg-white/70 dark:bg-slate-900/70 rounded-lg font-mono font-semibold text-slate-900 dark:text-white border border-amber-300/50">
            "Participation Certificate – Not an Official Academic Certificate." (የተሳትፎ ምስክር ወረቀት – ይፋዊ የትምህርት ሰርተፊኬት አይደለም)
          </p>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white uppercase backdrop-blur">
                    {course.language}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur ${
                      course.published ? 'bg-emerald-600/90 text-white' : 'bg-slate-800/90 text-slate-300'
                    }`}
                  >
                    {course.published ? 'የታተመ (Published)' : 'ረቂቅ (Draft)'}
                  </span>
                </div>
                <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-emerald-400 backdrop-blur">
                  {formatETB(course.priceEtb)}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {course.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <b>{course.lessons.length}</b> ምዕራፎች
                  </span>
                  <span>{course.enrolledCount} ተማሪዎች</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setActiveCourseForLessons(course)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ምዕራፎችን አዘጋጅ</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTogglePublish(course)}
                  className={`p-1.5 rounded-lg text-xs font-semibold ${course.published ? 'text-slate-400 hover:text-slate-600' : 'text-emerald-600'}`}
                  title={course.published ? 'አትም አቁም' : 'አትም'}
                >
                  {course.published ? '🔴' : '🟢'}
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCourse({ ...course });
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Curriculum Editor Modal */}
      {activeCourseForLessons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  የኮርስ ምዕራፎች ማዘጋጃ፡ {activeCourseForLessons.title}
                </h3>
                <p className="text-[11px] text-slate-400">
                  ትምህርቶች ቋሚ የትምህርት ይዘት ናቸው፤ በAI በድብቅ አይቀየሩም።
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveCourseForLessons(null);
                  setEditingLesson(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Existing Lessons List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  ያሉ ምዕራፎች ({activeCourseForLessons.lessons.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLesson({
                      id: `les_${Date.now()}`,
                      title: '',
                      durationMinutes: 20,
                      content: '',
                      order: activeCourseForLessons.lessons.length + 1,
                    });
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>አዲስ ምዕራፍ ጨምር</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                {activeCourseForLessons.lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="p-3 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        #{idx + 1}. {lesson.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ቆይታ፡ {lesson.durationMinutes} ደቂቃ
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingLesson({ ...lesson })}
                        className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                      >
                        አስተካክል
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeCourseForLessons.lessons.length === 0 && (
                  <div className="p-6 text-center text-slate-400">
                    ምንም ምዕራፍ አልተጨመረም። እባክዎ አዲስ ምዕራፍ ይጨምሩ።
                  </div>
                )}
              </div>
            </div>

            {/* Sub-form: Add/Edit Lesson */}
            {editingLesson && (
              <form onSubmit={handleSaveLesson} className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 block">
                  የትምህርት ምዕራፍ ጽሁፍ አዘጋጅ
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="font-semibold block mb-1">የምዕራፉ ርዕስ</label>
                    <input
                      type="text"
                      required
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">ቆይታ (ደቂቃ)</label>
                    <input
                      type="number"
                      min="1"
                      value={editingLesson.durationMinutes}
                      onChange={(e) => setEditingLesson({ ...editingLesson, durationMinutes: Number(e.target.value) })}
                      className="w-full p-2 bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">የትምህርቱ ሙሉ ይዘት (Fixed Text by Admin)</label>
                  <textarea
                    rows={6}
                    required
                    value={editingLesson.content}
                    onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                    placeholder="ትምህርታዊ ማብራሪያ፣ የኮድ ምሳሌዎች፣ መመሪያዎች..."
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-sans text-xs leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingLesson(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    ይቅር
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold"
                  >
                    ምዕራፉን አስቀምጥ
                  </button>
                </div>
              </form>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveCourseForLessons(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                ዝጋ (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Meta Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSaveCourse}
            className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isCreating ? 'አዲስ ኮርስ መፍጠሪያ' : 'የኮርስ መረጃ ማስተካከያ'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1">የኮርስ ርዕስ</label>
              <input
                type="text"
                required
                value={editingCourse.title}
                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold block mb-1">ዋጋ (ETB)</label>
                <input
                  type="number"
                  required
                  value={editingCourse.priceEtb}
                  onChange={(e) => setEditingCourse({ ...editingCourse, priceEtb: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">ቋንቋ</label>
                <select
                  value={editingCourse.language}
                  onChange={(e) => setEditingCourse({ ...editingCourse, language: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="am">አማርኛ</option>
                  <option value="en">English</option>
                  <option value="or">Afaan Oromoo</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">አሰልጣኝ</label>
                <input
                  type="text"
                  value={editingCourse.instructor}
                  onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">የኮርስ ማብራሪያ</label>
              <textarea
                rows={3}
                required
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">የሽፋን ፎቶ (Thumbnail URL)</label>
              <input
                type="url"
                required
                value={editingCourse.thumbnailUrl}
                onChange={(e) => setEditingCourse({ ...editingCourse, thumbnailUrl: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
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
