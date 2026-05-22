'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { playFetch, type ApiTopic, type ApiSubject, type ApiLevel } from '../../../lib/play-api';

type PageData = { topic: ApiTopic & { subject: ApiSubject }; levels: ApiLevel[] };

const DIFF_LABEL: Record<string, string> = {
  beginner: 'Dễ', easy: 'Trung bình', medium: 'Khó', hard: 'Rất khó',
};
const DIFF_COLOR: Record<string, string> = {
  beginner: 'text-emerald-600 bg-emerald-50',
  easy: 'text-blue-600 bg-blue-50',
  medium: 'text-orange-600 bg-orange-50',
  hard: 'text-red-600 bg-red-50',
};

export default function TopicPage({ params }: { params: Promise<{ subject: string; topic: string }> }) {
  const { subject: subjectSlug, topic: topicSlug } = use(params);
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playFetch<PageData>(`/topics/${topicSlug}/levels`)
      .then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [topicSlug]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-amber-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
    </div>
  );
  if (!data) return null;

  const { topic, levels } = data;
  const unlockedIds = new Set(levels.filter((l) => !l.requiredLevelId).map((l) => l.id));

  // Simple unlock logic: level N unlocked if level N-1 is in unlocked set
  const isUnlocked = (lev: ApiLevel) => !lev.requiredLevelId || unlockedIds.has(lev.requiredLevelId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50">
      <div className="mx-auto max-w-2xl px-6 pt-10 pb-6">
        <Link href={`/play/${subjectSlug}`}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-white">
          ← Quay lại
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
            {topic.emoji}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">{topic.subject?.name}</p>
            <h1 className="text-2xl font-black text-slate-800">{topic.name}</h1>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-6 pb-16">
        <p className="mb-4 text-sm font-bold text-slate-500">Chọn cấp độ:</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {levels.map((lev) => {
            const unlocked = isUnlocked(lev);
            return (
              <div key={lev.id}
                className={`relative overflow-hidden rounded-3xl shadow-md transition-all ${unlocked ? 'hover:-translate-y-1 hover:shadow-xl' : 'opacity-70'}`}>
                <div className="h-2 w-full" style={{ backgroundColor: lev.color }} />
                <div className="bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-slate-900">{lev.name}</h3>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold ${DIFF_COLOR[lev.difficulty] || 'text-slate-500 bg-slate-50'}`}>
                        {DIFF_LABEL[lev.difficulty] || lev.difficulty}
                      </span>
                      {lev.gridSize > 0 && (
                        <span className="ml-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                          {lev.gridSize}×{lev.gridSize}
                        </span>
                      )}
                    </div>
                    {!unlocked && (
                      <span className="text-2xl">🔒</span>
                    )}
                  </div>

                  {unlocked ? (
                    <Link href={`/play/${subjectSlug}/${topicSlug}/${lev.slug}`}
                      className="mt-4 flex w-full items-center justify-center rounded-full py-2.5 text-sm font-black text-white transition hover:opacity-90"
                      style={{ backgroundColor: lev.color }}>
                      BẮT ĐẦU ▶
                    </Link>
                  ) : (
                    <div className="mt-4 flex w-full items-center justify-center rounded-full bg-slate-100 py-2.5 text-sm font-bold text-slate-400">
                      🔒 Đang khoá
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
