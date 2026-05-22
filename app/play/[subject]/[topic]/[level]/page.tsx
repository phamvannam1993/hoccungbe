'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { playFetch, type ApiLevel, type ApiGameLesson } from '../../../../lib/play-api';

type LevelData = { level: ApiLevel & { topic: { name: string; subject: { name: string; slug: string } } }; lessons: (ApiGameLesson & { questionCount: number })[] };

const LESSON_ICONS = ['❓', '🧩', '⚡', '🏆', '🌟', '🎯'];

export default function LevelPage({ params }: { params: Promise<{ subject: string; topic: string; level: string }> }) {
  const { subject: subjectSlug, topic: topicSlug, level: levelSlug } = use(params);
  const [data, setData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playFetch<LevelData>(`/levels/${levelSlug}/lessons`)
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [levelSlug]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-amber-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
    </div>
  );
  if (!data) return null;

  const { level, lessons } = data;
  const firstLesson = lessons[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50">
      <div className="mx-auto max-w-xl px-6 pt-10 pb-6">
        <Link href={`/play/${subjectSlug}/${topicSlug}`}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-white">
          ← Quay lại
        </Link>
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-black text-slate-800">{level.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{level.topic?.subject?.name} · {level.topic?.name}</p>
        </div>
      </div>

      <main className="mx-auto max-w-xl px-6 pb-16">
        {/* First lesson — highlighted */}
        {firstLesson && (
          <Link href={`/play/${subjectSlug}/${topicSlug}/${levelSlug}/${firstLesson.id}`}
            className="mb-4 flex items-center gap-4 rounded-3xl p-5 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: `linear-gradient(135deg, ${level.color}22, ${level.color}44)`, border: `2px solid ${level.color}` }}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-3xl ring-2 ring-sky-200">
              {LESSON_ICONS[0]}
            </div>
            <div className="flex-1">
              <p className="font-black text-slate-800">{firstLesson.title}</p>
              <p className="text-xs text-slate-500">{firstLesson.questionCount} câu hỏi</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full shadow-md text-white text-lg"
              style={{ backgroundColor: level.color }}>
              ▶
            </div>
          </Link>
        )}

        {/* Remaining lessons — locked style */}
        <div className="space-y-3">
          {lessons.slice(1).map((lesson, i) => (
            <Link key={lesson.id}
              href={`/play/${subjectSlug}/${topicSlug}/${levelSlug}/${lesson.id}`}
              className="flex items-center gap-4 rounded-2xl bg-white/60 px-5 py-4 shadow-sm ring-1 ring-slate-200 transition hover:bg-white hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl ring-1 ring-emerald-200">
                {LESSON_ICONS[(i + 1) % LESSON_ICONS.length]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{lesson.title}</p>
                <p className="text-xs text-slate-400">{lesson.questionCount} câu hỏi</p>
              </div>
              <span className="text-slate-300 text-lg">→</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
