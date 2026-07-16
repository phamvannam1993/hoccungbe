'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* "Tất cả" đứng đầu, rồi tới từng lớp — gọn trên 1 hàng */}
          {['all', ...availableGrades].map((g) => {
            const active = gradeFilter === g;
            return (
              <button
                key={g}
                type="button"
                title={g !== 'all' && childName ? `Khóa học dành cho ${childName}` : undefined}
                onClick={() => setGradeFilter(g)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-black kid-display transition ${
                  active ? 'text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                style={active ? { background: 'linear-gradient(135deg,#FF6B9D,#ff4f8b)' } : undefined}
              >
                {g === 'all' ? 'Tất cả' : gradeLabel(g)}
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="py-8 text-center text-slate-400">
          Chưa có khóa học cho {gradeLabel(gradeFilter)}.{' '}
          <button onClick={() => setGradeFilter('all')} className="font-bold text-sky-600 underline">Xem tất cả</button>
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {visible.map((course) => (
            <Link key={course.id} href={`/khoa-hoc/${course.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:shadow-md active:scale-[0.99]">
              {/* Ảnh khóa học */}
              {course.thumbnailUrl ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">📚</div>
              )}

              {/* Nội dung */}
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-black leading-snug text-slate-900 group-hover:text-[#0e7490]">{course.title}</h3>
                {course.shortDescription && (
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{course.shortDescription}</p>
                )}
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {course.isFree && <span className="text-xs font-black text-emerald-600">Miễn phí</span>}
                  {(course.totalLessons ?? 0) > 0 && <span className="text-xs text-slate-400">{course.totalLessons} bài học</span>}
                </div>
              </div>

              {/* Nút mũi tên */}
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-sm transition group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg,#FF6B9D,#ff4f8b)' }}
                aria-hidden="true"
              >
                <ArrowRight size={18} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
