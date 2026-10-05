'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { ApiCourse, ApiLesson, ApiVolume, ApiTopic } from '../../lib/api';

type CourseDetail = {
  lessons: ApiLesson[];
  volumes: ApiVolume[];
  topics: ApiTopic[];
};

const cache: Record<number, CourseDetail> = {};

async function loadCourseDetail(courseId: number): Promise<CourseDetail> {
  if (cache[courseId]) return cache[courseId];
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const [lessons, volumes, topics] = await Promise.all([
    fetch(`${base}/api/lessons?courseId=${courseId}`).then((r) => r.json()),
    fetch(`${base}/api/volumes?courseId=${courseId}`).then((r) => r.json()),
    fetch(`${base}/api/topics?courseId=${courseId}`).then((r) => r.json()),
  ]);
  const detail: CourseDetail = {
    lessons: Array.isArray(lessons) ? lessons : [],
    volumes: Array.isArray(volumes) ? volumes : [],
    topics: Array.isArray(topics) ? topics : [],
  };
  cache[courseId] = detail;
  return detail;
}

function groupByVolume(lessons: ApiLesson[], volumes: ApiVolume[], topics: ApiTopic[]) {
  const sortedVols = [...volumes].sort((a, b) => a.sortOrder - b.sortOrder);
  const hasVolumes = sortedVols.length > 0;

  if (!hasVolumes) {
    return [{ vol: null, lessons: [...lessons].sort((a, b) => a.sortOrder - b.sortOrder), topics }];
  }

  return sortedVols.map((vol) => ({
    vol,
    lessons: lessons.filter((l) => l.volumeId === vol.id).sort((a, b) => a.sortOrder - b.sortOrder),
    topics: topics.filter((t) => t.volumeId === vol.id),
  }));
}

function LessonRow({ lesson }: { lesson: ApiLesson }) {
  const hasQuizzes = lesson.quizzes && lesson.quizzes.length > 0;
  const href = lesson.slug ? `/${lesson.slug}` : `/lessons/${lesson.id}`;
  return (
    <Link href={href} className="flex items-center gap-2 py-1.5 px-2 hover:bg-sky-50 rounded-lg group">
      <svg className="w-4 h-4 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14v-4zM5 8h8a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2z" />
      </svg>
      <span className="flex-1 text-sm text-blue-700 group-hover:underline leading-snug">{lesson.title}</span>
      {hasQuizzes && (
        <span className="w-5 h-5 rounded-full bg-orange-400 text-white text-xs font-bold flex items-center justify-center shrink-0">?</span>
      )}
    </Link>
  );
}

function CourseExpanded({ courseId, courseSlug }: { courseId: number; courseSlug: string }) {
  const [detail, setDetail] = useState<CourseDetail | null>(null);

  useEffect(() => {
    loadCourseDetail(courseId).then(setDetail);
  }, [courseId]);

  if (!detail) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const groups = groupByVolume(detail.lessons, detail.volumes, detail.topics);
  const cols = groups.length >= 2 ? 'md:grid-cols-2' : 'grid-cols-1';

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className={`grid gap-6 ${cols}`}>
        {groups.map((g, i) => (
          <div key={g.vol?.id ?? i}>
            {g.vol && (
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 border-b border-slate-100 pb-1 mb-2">
                {g.vol.name}
              </h4>
            )}
            {g.lessons.length === 0 ? (
              <p className="text-xs text-slate-400 px-2">Chưa có bài học.</p>
            ) : (
              g.lessons.map((l) => <LessonRow key={l.id} lesson={l} />)
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Link href={`/khoa-hoc/${courseSlug}`} className="text-xs font-bold text-sky-600 hover:underline">
          Xem toàn bộ khóa học →
        </Link>
      </div>
    </div>
  );
}

export default function HomeCourseGrid({ courses }: { courses: ApiCourse[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (courses.length === 0) {
    return <p className="mt-10 text-center text-slate-500">Chưa có khóa học nào.</p>;
  }

  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => {
        const isOpen = openId === course.id;
        return (
          <div
            key={course.id}
            className={`flex flex-col rounded-2xl bg-white shadow-sm ring-1 transition-all duration-300
              ${isOpen ? 'ring-sky-400 shadow-md sm:col-span-2 lg:col-span-3 xl:col-span-4' : 'ring-slate-100 hover:-translate-y-1 hover:shadow-md'}`}
          >
            {/* Card header — always visible */}
            <button
              className="flex items-center gap-4 p-4 text-left w-full"
              onClick={() => setOpenId(isOpen ? null : course.id)}
            >
              {course.thumbnailUrl ? (
                <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden">
                  <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-sky-100 to-violet-100 flex items-center justify-center text-3xl">
                  📚
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 flex-wrap mb-1">
                  {course.isFree && (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Miễn phí</span>
                  )}
                  <span className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700">
                    {course.targetAgeMin}–{course.targetAgeMax} tuổi
                  </span>
                </div>
                <h3 className="font-black text-slate-900 leading-snug truncate">{course.title}</h3>
                {course.shortDescription && (
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{course.shortDescription}</p>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded lesson list */}
            {isOpen && (
              <div className="px-4 pb-5">
                <CourseExpanded courseId={course.id} courseSlug={course.slug} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
