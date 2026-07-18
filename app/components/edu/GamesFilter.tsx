'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ApiMiniGame } from '../../lib/api';
import KidIcon from './KidIcon';

const ALL_KEY = '__all__';

const GROUP_COLORS: Record<string, { color: string; bg: string }> = {
  'math-counting':        { color: '#0e7490', bg: 'from-sky-300 to-cyan-300' },
  'math-logic':           { color: '#7C3AED', bg: 'from-violet-300 to-fuchsia-300' },
  'language':             { color: '#db2777', bg: 'from-pink-300 to-rose-300' },
  'memory':               { color: '#d97706', bg: 'from-amber-300 to-orange-300' },
  'listening':            { color: '#059669', bg: 'from-emerald-300 to-teal-300' },
  'thinking-observation': { color: '#4f46e5', bg: 'from-indigo-300 to-sky-300' },
  'english':              { color: '#16a34a', bg: 'from-lime-300 to-emerald-300' },
};
const FALLBACK_COLOR = { color: '#A06CD5', bg: 'from-purple-300 to-pink-300' };

const GROUP_LABELS: Record<string, { label: string; short: string; emoji: string }> = {
  'math-counting':        { label: 'Toán đếm số & số lượng', short: 'Đếm số', emoji: '🔢' },
  'math-logic':           { label: 'Toán tư duy & quy luật', short: 'Toán tư duy', emoji: '🧠' },
  'language':             { label: 'Ngôn ngữ & đọc sớm', short: 'Ngôn ngữ', emoji: '🔤' },
  'memory':               { label: 'Ghi nhớ & tập trung', short: 'Ghi nhớ', emoji: '🧩' },
  'listening':            { label: 'Nghe hiểu & âm thanh', short: 'Nghe hiểu', emoji: '🔊' },
  'thinking-observation': { label: 'Quan sát, phân loại & tư duy', short: 'Quan sát', emoji: '👀' },
  'english':              { label: 'Tiếng Anh cho bé', short: 'Tiếng Anh', emoji: '🌍' },
};

const DIFF_STYLE: Record<string, string> = {
  'Dễ': 'bg-emerald-50 text-emerald-600',
  'Trung bình': 'bg-amber-50 text-amber-600',
  'Nâng cao': 'bg-rose-50 text-rose-600',
};

type Sort = 'new' | 'popular' | 'az';
const SORTS: { v: Sort; label: string }[] = [
  { v: 'new', label: 'Mới nhất' }, { v: 'popular', label: 'Phổ biến' }, { v: 'az', label: 'A → Z' },
];

interface Props { games: ApiMiniGame[]; }

export default function GamesFilter({ games }: Props) {
  const [activeGroup, setActiveGroup] = useState<string>(ALL_KEY);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('new');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const uniqueGroups = Array.from(new Set(games.map((g) => g.groupKey)));

  const visibleGames = games
    .filter((g) => {
      const matchGroup = activeGroup === ALL_KEY || g.groupKey === activeGroup;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || (g.description ?? '').toLowerCase().includes(q);
      return matchGroup && matchSearch;
    })
    .sort((a, b) => {
      if (sort === 'popular') return (Number(b.showOnHomepage) - Number(a.showOnHomepage)) || (a.homepageOrder - b.homepageOrder) || (a.sortOrder - b.sortOrder);
      if (sort === 'az') return a.title.localeCompare(b.title, 'vi');
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id;
    });

  return (
    <div className="rounded-[28px] p-3 sm:rounded-[36px] sm:p-5" style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f3f9ff 45%,#faf5ff 100%)' }}>
      {/* Breadcrumb */}
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 px-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-700">Trang chủ</Link>
        <span className="text-slate-300">›</span>
        <span className="font-semibold text-blue-600">Kho trò chơi</span>
      </nav>

      {/* Header + illustration */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-sky-100 to-blue-100 p-5 sm:p-7">
        <KidIcon name="tigerRead" className="pointer-events-none absolute -right-2 bottom-0 h-28 w-28 opacity-90 sm:right-6 sm:h-40 sm:w-40" />
        <span className="pointer-events-none absolute right-40 top-6 hidden text-2xl sm:block">✨</span>
        <div className="relative max-w-[70%] sm:max-w-none">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">Kho trò chơi giáo dục</h1>
          <p className="mt-1.5 text-sm font-semibold text-slate-500 sm:text-base">{games.length} trò chơi · {uniqueGroups.length} nhóm học tập</p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-3 flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-sm ring-1 ring-slate-100 sm:mt-4">
        <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm trò chơi..."
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none" />
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-500 text-white">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2M6 12H4m16 0h-2M7.05 7.05L5.6 5.6m12.8 12.8l-1.45-1.45M16.95 7.05L18.4 5.6M5.6 18.4l1.45-1.45" /></svg>
        </span>
      </div>

      {/* Group pills */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:mt-4 [&::-webkit-scrollbar]:hidden">
        <button onClick={() => setActiveGroup(ALL_KEY)}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold shadow-sm ring-1 transition ${activeGroup === ALL_KEY ? 'bg-teal-500 text-white ring-teal-500' : 'bg-white text-slate-600 ring-slate-100 hover:ring-teal-200'}`}>
          <span>▦</span> Tất cả
        </button>
        {uniqueGroups.map((key) => {
          const info = GROUP_LABELS[key] ?? { label: key, short: key, emoji: '🎮' };
          const on = activeGroup === key;
          return (
            <button key={key} onClick={() => setActiveGroup(key)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold shadow-sm ring-1 transition ${on ? 'bg-teal-500 text-white ring-teal-500' : 'bg-white text-slate-600 ring-slate-100 hover:ring-teal-200'}`}>
              <span>{info.emoji}</span> <span className="sm:hidden">{info.short}</span><span className="hidden sm:inline">{info.label}</span>
            </button>
          );
        })}
      </div>

      {/* Controls: lọc + sort + view */}
      <div className="mt-3 flex items-center justify-between gap-2 px-1">
        <button onClick={() => { setActiveGroup(ALL_KEY); setSearch(''); }}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 hover:ring-teal-200">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" /></svg>
          Lọc <span className="hidden text-slate-400 sm:inline">· {visibleGames.length} trò chơi</span>
        </button>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-100">
            <span className="hidden text-slate-400 sm:inline">Sắp xếp:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent font-bold text-slate-700 focus:outline-none">
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
            </select>
          </label>
          <div className="hidden items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-100 sm:flex">
            <button onClick={() => setView('grid')} title="Lưới" className={`grid h-7 w-7 place-items-center rounded-full text-sm ${view === 'grid' ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>▦</button>
            <button onClick={() => setView('list')} title="Danh sách" className={`grid h-7 w-7 place-items-center rounded-full text-sm ${view === 'list' ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>☰</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-3 pb-4">
        {visibleGames.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-400 ring-1 ring-slate-100">Không tìm thấy trò chơi phù hợp.</div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-3'}>
            {visibleGames.map((game) => {
              const scheme = GROUP_COLORS[game.groupKey] ?? FALLBACK_COLOR;
              const ready = game.status === 'ready' || game.isActive;
              const info = GROUP_LABELS[game.groupKey];
              if (view === 'list') {
                return (
                  <div key={game.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${scheme.bg} text-2xl`}>{game.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-slate-900">{game.title}</p>
                      <p className="truncate text-xs text-slate-500">{game.description}</p>
                    </div>
                    <Link href={`/tro-choi/${game.slug}`} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold text-white ${ready ? 'bg-[#e74c3c] hover:bg-[#c0392b]' : 'pointer-events-none bg-slate-200 text-slate-400'}`}>{ready ? 'Chơi ngay' : 'Sắp có'}</Link>
                  </div>
                );
              }
              return (
                <div key={game.id} className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg">
                  {/* Banner */}
                  <div className={`relative h-24 bg-gradient-to-br ${scheme.bg} sm:h-28`}>
                    <span className="absolute inset-0 grid place-items-center text-5xl drop-shadow-sm sm:text-6xl">{game.emoji}</span>
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-emerald-600 shadow-sm">
                      {ready ? '✓ Sẵn sàng' : '⏳ Sắp có'}
                    </span>
                    <span className="absolute right-2 top-2 rounded-full bg-slate-900/25 px-2 py-0.5 text-[10px] font-black text-white backdrop-blur-sm">{game.age}</span>
                  </div>

                  <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                    <div className="flex items-start gap-2">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 text-xl ring-1 ring-slate-100">{game.emoji}</span>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black leading-snug text-slate-900 sm:text-base">{game.title}</h3>
                      </div>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{game.description}</p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${scheme.color}14`, color: scheme.color }}>{info?.short ?? game.category}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${DIFF_STYLE[game.difficulty] ?? 'bg-slate-100 text-slate-500'}`}>{game.difficulty}</span>
                    </div>

                    <div className="mt-auto pt-3">
                      <Link href={`/tro-choi/${game.slug}`}
                        className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold transition ${ready ? 'bg-[#e74c3c] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#c0392b]' : 'pointer-events-none bg-slate-100 text-slate-400'}`}>
                        {ready ? <>▶ Chơi ngay</> : 'Sắp ra mắt'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
