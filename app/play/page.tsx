'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { playFetch, type ApiSubject } from '../lib/play-api';

const BG_COLORS: Record<string, string> = {
  '#7C3AED': 'from-violet-500 to-purple-600',
  '#2563EB': 'from-blue-500 to-indigo-600',
  '#EC4899': 'from-pink-500 to-rose-600',
  '#059669': 'from-emerald-500 to-teal-600',
  '#F97316': 'from-orange-500 to-amber-600',
  '#DC2626': 'from-red-500 to-rose-600',
};

export default function PlayHomePage() {
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playFetch<ApiSubject[]>('/subjects')
      .then(setSubjects).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50">
      {/* Sky decorations */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-4 left-1/4 text-5xl opacity-80">🌈</div>
          <div className="absolute top-6 right-8 text-4xl opacity-70">🎈</div>
          <div className="absolute top-2 left-10 text-3xl opacity-60">☁️</div>
          <div className="absolute top-3 right-1/3 text-4xl opacity-50">☁️</div>
        </div>

        <div className="relative mx-auto max-w-4xl px-6 pt-12 pb-6 text-center">
          <h1 className="text-3xl font-black text-slate-800 sm:text-4xl">🎮 Chọn Chủ Đề Học</h1>
          <p className="mt-2 text-slate-600">Bé khám phá thế giới kiến thức qua trò chơi thú vị!</p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((sub) => {
              const grad = BG_COLORS[sub.color] || 'from-slate-500 to-slate-600';
              return (
                <Link key={sub.id} href={`/play/${sub.slug}`}
                  className="group relative overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`bg-gradient-to-br ${grad} p-6`}>
                    {/* Decorative circle */}
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute -right-2 -bottom-4 h-16 w-16 rounded-full bg-white/10" />

                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-4xl shadow-inner backdrop-blur-sm">
                        {sub.emoji}
                      </div>
                      <h2 className="mt-4 text-xl font-black text-white">{sub.name}</h2>
                      <p className="mt-1 text-sm leading-5 text-white/80">{sub.description}</p>
                      <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                        Khám phá →
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
