'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch, ApiCourse } from '../../lib/api';
import { getCurrentChildId, listChildren, GRADES, gradeLabel, gradeFromSlug } from '../../lib/childData';

const GROUP_LABELS: Record<string, string> = {
  math: 'Toán học',
  language: 'Ngôn ngữ & Tiếng Việt',
  english: 'Tiếng Anh',
  science: 'Khoa học',
  art: 'Nghệ thuật & Sáng tạo',
  life: 'Kỹ năng sống',
  logic: 'Tư duy & Logic',
  other: 'Khác',
};

const GROUP_EMOJIS: Record<string, string> = {
  math: '🔢',
  language: '📖',
  english: '🔤',
  science: '🔬',
  art: '🎨',
  life: '🌱',
  logic: '🧩',
  other: '✨',
};

const COLORS = [
  { c: '#FF6B9D', bg: 'linear-gradient(135deg, #FFE5F1 0%, #FFD6E8 100%)' },
  { c: '#4ECDC4', bg: 'linear-gradient(135deg, #C9F0FF 0%, #B3E5DC 100%)' },
  { c: '#A06CD5', bg: 'linear-gradient(135deg, #EBD8FF 0%, #DDC3FF 100%)' },
  { c: '#FF9F45', bg: 'linear-gradient(135deg, #FFF4D6 0%, #FFE5B4 100%)' },
  { c: '#6BCB77', bg: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' },
];

const CARD_EMOJIS = ['🌟', '📚', '🎈', '🌈', '🎨', '🚀', '🦄', '🍭'];

function groupCourses(courses: ApiCourse[]): { key: string; label: string; courses: ApiCourse[] }[] {
  const map: Record<string, ApiCourse[]> = {};
  for (const c of courses) {
    const key = c.courseType || 'other';
    if (!map[key]) map[key] = [];
    map[key].push(c);
  }
  return Object.entries(map).map(([key, list]) => ({
    key,
    label: GROUP_LABELS[key] || key,
    courses: list,
  }));
}

export default function CourseLibraryPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  // Quản lý theo lớp: mặc định lọc theo lớp của bé đang chọn.
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [childName, setChildName] = useState<string>('');

  useEffect(() => {
    apiFetch<ApiCourse[]>('/courses')
      .then((data) => setCourses(Array.isArray(data) ? data.filter((c) => c.isPublished) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
    // Lấy lớp của bé đang chọn để lọc mặc định.
    const id = getCurrentChildId();
    if (id) {
      listChildren()
        .then((arr) => {
          const cur = arr.find((c) => c.id === id);
          if (cur?.currentLevel) setGradeFilter(cur.currentLevel);
          if (cur) setChildName(cur.nickname || cur.fullName);
        })
        .catch(() => {});
    }
  }, []);

  if (loading) {
    return (
      <div className="kid-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent" />
      </div>
    );
  }

  // Lọc theo lớp (dựa vào slug). "all" = tất cả các lớp.
  const visibleCourses = gradeFilter === 'all' ? courses : courses.filter((c) => gradeFromSlug(c.slug) === gradeFilter);
  const groups = groupCourses(visibleCourses);
  // Các lớp thực sự có khóa học (để hiện tab).
  const availableGrades = GRADES.filter((g) => courses.some((c) => gradeFromSlug(c.slug) === g));

  return (
    <div className="kid-bg min-h-screen relative overflow-hidden">
      {/* Decorative floating emojis */}
      <span aria-hidden className="pointer-events-none select-none absolute top-10 left-4 text-4xl opacity-70" style={{ animation: 'wiggle 3s ease-in-out infinite' }}>⭐</span>
      <span aria-hidden className="pointer-events-none select-none absolute top-24 right-8 text-5xl opacity-70" style={{ animation: 'bounce-pop 2.4s ease-in-out infinite' }}>🎈</span>
      <span aria-hidden className="pointer-events-none select-none absolute top-72 left-10 text-3xl opacity-60" style={{ animation: 'wiggle 4s ease-in-out infinite' }}>🌈</span>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 relative">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link href="/" className="font-bold kid-display" style={{ color: '#A06CD5' }}>🏠 Trang chủ</Link>
          <span style={{ color: '#FF6B9D' }}>›</span>
          <span className="font-black kid-display" style={{ color: '#FF6B9D' }}>Khóa học</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4 relative">
        <div
          className="bg-white rounded-[32px] border-4 border-pink-200 p-6 sm:p-8 kid-pop-in"
          style={{ boxShadow: '0 12px 40px rgba(255,107,157,0.20)' }}
        >
          <p className="text-xs font-black uppercase tracking-widest mb-1 kid-display" style={{ color: '#FF6B9D' }}>
            🎓 Thư viện khóa học
          </p>
          <h1
            className="text-3xl sm:text-4xl font-black kid-display"
            style={{ background: 'linear-gradient(135deg, #FF6B9D, #FFD93D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Học vui mỗi ngày cùng các bé 🌟
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Khám phá những khóa học siêu thú vị, đầy màu sắc và trò chơi giáo dục dành cho bé yêu của bạn!
          </p>

          {/* Lọc theo lớp */}
          {availableGrades.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-500">🎒 Chọn lớp:</span>
              {availableGrades.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGradeFilter(g)}
                  className={`rounded-full px-4 py-1.5 text-sm font-black kid-display transition ${gradeFilter === g ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  style={gradeFilter === g ? { background: 'linear-gradient(135deg,#FF6B9D,#FF9F45)', boxShadow: '0 3px 0 #c0392b' } : undefined}
                >
                  {gradeLabel(g)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setGradeFilter('all')}
                className={`rounded-full px-4 py-1.5 text-sm font-black kid-display transition ${gradeFilter === 'all' ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                style={gradeFilter === 'all' ? { background: 'linear-gradient(135deg,#A06CD5,#4ECDC4)', boxShadow: '0 3px 0 #6d28d9' } : undefined}
              >
                Tất cả
              </button>
              {gradeFilter !== 'all' && childName && (
                <span className="text-xs text-slate-400">— đang xem nội dung {gradeLabel(gradeFilter)} của {childName}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 relative">
        {visibleCourses.length === 0 ? (
          <div
            className="bg-white rounded-3xl border-4 border-pink-200 p-12 text-center"
            style={{ boxShadow: '0 8px 30px rgba(255,107,157,0.20)' }}
          >
            <div className="text-6xl mb-3">📚</div>
            <p className="text-slate-500 font-bold kid-display">
              {gradeFilter === 'all' ? 'Chưa có khóa học nào.' : `Chưa có khóa học cho ${gradeLabel(gradeFilter)}.`}
            </p>
            {gradeFilter !== 'all' && (
              <button onClick={() => setGradeFilter('all')} className="mt-3 rounded-full bg-slate-100 px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200">Xem tất cả lớp</button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group, gIdx) => {
              const headColor = COLORS[gIdx % COLORS.length];
              return (
                <section
                  key={group.key}
                  className="bg-white rounded-3xl border-4 p-6 sm:p-8"
                  style={{
                    borderColor: headColor.c + '55',
                    boxShadow: `0 8px 30px ${headColor.c}33`,
                  }}
                >
                  <p
                    className="text-xs font-black uppercase tracking-widest mb-1 kid-display"
                    style={{ color: headColor.c }}
                  >
                    {GROUP_EMOJIS[group.key] || '✨'} Nhóm khóa học
                  </p>
                  <h2
                    className="text-2xl sm:text-3xl font-black kid-display mb-5"
                    style={{
                      background: `linear-gradient(135deg, ${headColor.c}, #FFD93D)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {group.label}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {group.courses.map((course, idx) => {
                      const color = COLORS[idx % COLORS.length];
                      const emoji = CARD_EMOJIS[idx % CARD_EMOJIS.length];
                      return (
                        <Link
                          key={course.id}
                          href={`/khoa-hoc/${course.slug}`}
                          className="group block rounded-3xl p-5 kid-card-hover"
                          style={{
                            background: color.bg,
                            border: `3px solid ${color.c}`,
                            boxShadow: `0 4px 0 ${color.c}66`,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="text-3xl shrink-0 rounded-2xl w-14 h-14 flex items-center justify-center bg-white"
                              style={{ boxShadow: `0 3px 0 ${color.c}55` }}
                            >
                              {emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-slate-900 leading-snug kid-display text-lg">
                                {course.title}
                              </h3>
                              {(course.shortDescription || course.description) && (
                                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                                  {course.shortDescription || course.description}
                                </p>
                              )}
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {course.totalLessons > 0 && (
                                  <span
                                    className="text-xs font-black kid-display px-3 py-1 rounded-full text-white"
                                    style={{ background: color.c }}
                                  >
                                    📖 {course.totalLessons} bài
                                  </span>
                                )}
                                {course.targetAgeMin > 0 && (
                                  <span
                                    className="text-xs font-black kid-display px-3 py-1 rounded-full bg-white"
                                    style={{ color: color.c, border: `2px solid ${color.c}` }}
                                  >
                                    👶 {course.targetAgeMin}–{course.targetAgeMax} tuổi
                                  </span>
                                )}
                                {course.isFree && (
                                  <span
                                    className="text-xs font-black kid-display px-3 py-1 rounded-full text-white"
                                    style={{ background: 'linear-gradient(135deg, #6BCB77, #4ECDC4)' }}
                                  >
                                    🎁 Miễn phí
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
