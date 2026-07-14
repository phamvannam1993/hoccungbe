'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getCurrentChildId, listChildren, GRADES, gradeLabel, gradeFromSlug } from '../../lib/childData';

type Course = { id: number; slug: string; title: string; thumbnailUrl?: string; shortDescription?: string; isFree?: boolean; totalLessons?: number };

// Lưới khóa học trang chủ — lọc theo LỚP của bé đang chọn (khách vãng lai thấy tất cả).
export default function HomeCourseSection({ courses }: { courses: Course[] }) {
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [childName, setChildName] = useState<string>('');

  useEffect(() => {
    const id = getCurrentChildId();
    if (!id) return;
    listChildren()
      .then((arr) => {
        const cur = arr.find((c) => c.id === id);
        if (cur?.currentLevel) setGradeFilter(cur.currentLevel);
        if (cur) setChildName(cur.nickname || cur.fullName);
      })
      .catch(() => {});
  }, []);

  if (courses.length === 0) {
    return <p className="text-slate-400 text-center py-8">Chưa có khóa học nào.</p>;
  }

  const availableGrades = GRADES.filter((g) => courses.some((c) => gradeFromSlug(c.slug) === g));
  const visible = gradeFilter === 'all' ? courses : courses.filter((c) => gradeFromSlug(c.slug) === gradeFilter);

  return (
    <>
      {availableGrades.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-sm font-black kid-display" style={{ color: '#A06CD5' }}>🎒 Lớp:</span>
          {availableGrades.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGradeFilter(g)}
              className={`rounded-full px-4 py-1.5 text-sm font-black kid-display transition ${gradeFilter === g ? 'text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              style={gradeFilter === g ? { background: 'linear-gradient(135deg,#FF6B9D,#FF9F45)', boxShadow: '0 3px 0 #c2185b' } : undefined}
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
            <span className="text-xs text-slate-400">— dành cho {childName}</span>
          )}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-8 text-center text-slate-400">
          Chưa có khóa học cho {gradeLabel(gradeFilter)}.{' '}
          <button onClick={() => setGradeFilter('all')} className="font-bold text-sky-600 underline">Xem tất cả</button>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <Link key={course.id} href={`/khoa-hoc/${course.slug}`}
              className="group flex gap-4 items-start rounded-3xl border-4 border-pink-100 p-4 kid-card-hover bg-white">
              {course.thumbnailUrl ? (
                <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden">
                  <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-14 w-14 shrink-0 rounded-xl bg-[#6ec6c6]/20 flex items-center justify-center text-2xl">📚</div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 group-hover:text-[#0e7490] leading-snug text-sm">{course.title}</h3>
                {course.shortDescription && (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.shortDescription}</p>
                )}
                <div className="mt-2 flex gap-2 flex-wrap">
                  {course.isFree && <span className="text-xs font-semibold text-emerald-600">Miễn phí</span>}
                  {(course.totalLessons ?? 0) > 0 && <span className="text-xs text-slate-400">{course.totalLessons} bài học</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
