'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { playFetch, type ApiSubject, type ApiTopic } from '../../lib/play-api';

type PageData = { subject: ApiSubject; topics: ApiTopic[] };

const GAME_TYPE_EMOJI: Record<string, string> = {
  matrix: '🔲', pattern: '🔄', connect: '🔗', spot_diff: '🔍', maze: '🗺️', color_fill: '🎨',
};

export default function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectSlug } = use(params);
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playFetch<PageData>(`/subjects/${subjectSlug}/topics`)
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [subjectSlug]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-amber-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
    </div>
  );

  if (!data) return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-sky-100 to-amber-50">
      <p className="text-2xl">😢</p>
      <p className="text-slate-500">Không tìm thấy chủ đề</p>
      <Link href="/play" className="rounded-full bg-amber-400 px-6 py-2 text-sm font-bold text-white">← Quay lại</Link>
    </div>
  );

  const { subject, topics } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50">
      {/* Header */}
      <div className="mx-auto max-w-3xl px-6 pt-10 pb-6">
        <Link href="/play" className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-white">
          ← Quay lại
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-lg">
            {subject.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">{subject.name}</h1>
            <p className="text-sm text-slate-600">{subject.description}</p>
          </div>
        </div>
      </div>

      {/* Topics grid */}
      <main className="mx-auto max-w-3xl px-6 pb-16">
        <p className="mb-5 text-sm font-bold text-slate-500">Chọn loại trò chơi:</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/play/${subjectSlug}/${topic.slug}`}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-amber-200">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-4xl ring-1 ring-amber-100 transition group-hover:scale-110">
                {topic.emoji || GAME_TYPE_EMOJI[topic.gameType] || '🎮'}
              </div>
              <div className="text-center">
                <h2 className="font-black text-slate-900">{topic.name}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{topic.description}</p>
              </div>
              <div className="mt-auto rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-white">
                Chơi ngay →
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
