'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch, ApiCourse } from '../../lib/api';

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

  useEffect(() => {
    apiFetch<ApiCourse[]>('/courses')
      .then((data) => setCourses(Array.isArray(data) ? data.filter((c) => c.isPublished) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  const groups = groupCourses(courses);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-white/80">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span className="text-white/50">›</span>
          <span className="text-white font-medium">Khóa học</span>
        </nav>
      </div>

      {/* Content card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {courses.length === 0 ? (
            <p className="text-center text-slate-500 py-16">Chưa có khóa học nào.</p>
          ) : (
            <div className="space-y-10">
              {groups.map((group) => (
                <section key={group.key}>
                  <h2 className="text-base font-black uppercase tracking-wide text-[#c0392b] mb-4 pb-2 border-b border-slate-100">
                    {group.label}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {group.courses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/khoa-hoc/${course.slug}`}
                        className="group block rounded-xl border border-slate-200 p-5 hover:border-teal-400 hover:shadow-md transition-all duration-200"
                      >
                        <h3 className="font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                          {course.title}
                        </h3>
                        {(course.shortDescription || course.description) && (
                          <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
                            {course.shortDescription || course.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                          {course.totalLessons > 0 && (
                            <span>{course.totalLessons} bài học</span>
                          )}
                          {course.targetAgeMin > 0 && (
                            <span>{course.targetAgeMin}–{course.targetAgeMax} tuổi</span>
                          )}
                          {course.isFree && (
                            <span className="text-emerald-600 font-semibold">Miễn phí</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
