'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ApiMiniGame } from '../../lib/api';

const ALL_KEY = '__all__';

// Deterministic color mapping based on groupKey
const GROUP_COLORS: Record<string, { color: string; bg: string; colorClass: string }> = {
  'math-counting':        { color: '#0e7490', bg: 'from-sky-400 to-cyan-400',    colorClass: 'from-sky-400 to-cyan-400' },
  'math-logic':           { color: '#7C3AED', bg: 'from-violet-400 to-fuchsia-400', colorClass: 'from-violet-400 to-fuchsia-400' },
  'language':             { color: '#db2777', bg: 'from-pink-400 to-rose-400',   colorClass: 'from-pink-400 to-rose-400' },
  'memory':               { color: '#d97706', bg: 'from-amber-400 to-orange-400', colorClass: 'from-amber-400 to-orange-400' },
  'listening':            { color: '#059669', bg: 'from-emerald-400 to-teal-400', colorClass: 'from-emerald-400 to-teal-400' },
  'thinking-observation': { color: '#4f46e5', bg: 'from-indigo-400 to-sky-400',  colorClass: 'from-indigo-400 to-sky-400' },
  'english':              { color: '#16a34a', bg: 'from-lime-400 to-emerald-400', colorClass: 'from-lime-400 to-emerald-400' },
};

const FALLBACK_COLOR = { color: '#A06CD5', bg: 'from-purple-400 to-pink-400', colorClass: 'from-purple-400 to-pink-400' };

const GROUP_LABELS: Record<string, { label: string; emoji: string }> = {
  'math-counting':        { label: 'Toán đếm số & số lượng', emoji: '🔢' },
  'math-logic':           { label: 'Toán tư duy & quy luật', emoji: '🧠' },
  'language':             { label: 'Ngôn ngữ & đọc sớm',     emoji: '🔤' },
  'memory':               { label: 'Ghi nhớ & tập trung',    emoji: '🧩' },
  'listening':            { label: 'Nghe hiểu & âm thanh',   emoji: '🔊' },
  'thinking-observation': { label: 'Quan sát, phân loại & tư duy', emoji: '👀' },
  'english':              { label: 'Tiếng Anh cho bé',       emoji: '🌍' },
};

interface Props {
  games: ApiMiniGame[];
}

export default function GamesFilter({ games }: Props) {
  const [activeGroup, setActiveGroup] = useState<string>(ALL_KEY);
  const [search, setSearch] = useState('');

  // Unique groupKeys in order of first appearance
  const uniqueGroups = Array.from(new Set(games.map((g) => g.groupKey)));

  const visibleGames = games.filter((g) => {
    const matchGroup = activeGroup === ALL_KEY || g.groupKey === activeGroup;
    const q = search.toLowerCase();
    const matchSearch = !q || g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q);
    return matchGroup && matchSearch;
  });

  return (
    <>
      {/* Search input (inside the header band — rendered here, positioned via parent) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">Kho trò chơi giáo dục</h1>
            <p className="mt-1 text-white/80 text-sm">
              {games.length} trò chơi · {uniqueGroups.length} nhóm học tập
            </p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm trò chơi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full bg-white/25 text-white placeholder-white/60 text-sm outline-none focus:bg-white/35 w-48"
            />
          </div>
        </div>
      </div>

      {/* Group filter tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveGroup(ALL_KEY)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition
              ${activeGroup === ALL_KEY ? 'bg-white text-[#c0392b]' : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            Tất cả
          </button>
          {uniqueGroups.map((key) => {
            const info = GROUP_LABELS[key] ?? { label: key, emoji: '🎮' };
            return (
              <button
                key={key}
                onClick={() => setActiveGroup(key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition flex items-center gap-1.5
                  ${activeGroup === key ? 'bg-white text-[#c0392b]' : 'bg-white/20 text-white hover:bg-white/30'}`}
              >
                <span>{info.emoji}</span>
                {info.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Games grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        {visibleGames.length === 0 ? (
          <div className="bg-white/20 rounded-2xl p-10 text-center text-white/70">
            Không tìm thấy trò chơi phù hợp.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleGames.map((game) => {
              const scheme = GROUP_COLORS[game.groupKey] ?? FALLBACK_COLOR;
              const ready = game.status === 'ready' || game.isActive;
              return (
                <div
                  key={game.id}
                  className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Color bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${scheme.colorClass}`} />

                  <div className="flex flex-col flex-1 p-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-3xl">{game.emoji}</span>
                      <div className="flex flex-col items-end gap-1">
                        {ready ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Sẵn sàng</span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">Sắp có</span>
                        )}
                        <span className="text-xs text-slate-400">{game.age}</span>
                      </div>
                    </div>

                    {/* Title & desc */}
                    <h3 className="mt-3 font-black text-slate-900 leading-snug">{game.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">{game.description}</p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{game.category}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{game.difficulty}</span>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/tro-choi/${game.slug}`}
                        className={`block text-center rounded-full py-2 text-sm font-bold transition duration-200 hover:-translate-y-0.5
                          ${ready
                            ? 'bg-[#c0392b] text-white hover:bg-[#a93226] shadow-sm'
                            : 'bg-slate-100 text-slate-400 pointer-events-none'
                          }`}
                      >
                        {ready ? 'Chơi ngay' : 'Sắp ra mắt'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
