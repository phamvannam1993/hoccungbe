'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { childHistory, subjectInfo, getCurrentChildId, isGuest, type HistoryItem } from '../lib/childData';
import KidIcon, { subjectIcon } from '../components/edu/KidIcon';
import { ArrowLeft, RefreshCw, RotateCcw, Eye, X } from 'lucide-react';

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fmtDate(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
function dateLabel(iso?: string | null) {
  if (!iso) return '—';
  const s = ymd(new Date(iso));
  const today = new Date();
  const y = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  if (s === ymd(today)) return 'Hôm nay';
  if (s === ymd(y)) return 'Hôm qua';
  return fmtDate(iso);
}

type SortKey = 'recent' | 'most';

export default function OnTapCauSaiClient() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noChild, setNoChild] = useState(false);
  const [subject, setSubject] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('recent');

  const load = useCallback(() => {
    const childId = getCurrentChildId();
    if (!childId) {
      setNoChild(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    childHistory(childId, 500)
      .then((r) => setHistory(Array.isArray(r) ? r : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Gộp theo bài — giữ lần làm gần nhất của mỗi bài (history đã sắp mới→cũ).
  const byLesson = new Map<number, HistoryItem>();
  for (const h of history) if (!byLesson.has(h.lessonId)) byLesson.set(h.lessonId, h);
  const lessons = [...byLesson.values()];
  const wrongAll = lessons
    .map((h) => ({ ...h, wrong: (h.totalQuestions ?? 0) - (h.correctCount ?? 0) }))
    .filter((h) => h.wrong > 0);
  const fixedCount = lessons.filter((h) => (h.totalQuestions ?? 0) > 0 && (h.correctCount ?? 0) >= (h.totalQuestions ?? 0)).length;
  const progress = wrongAll.length + fixedCount ? Math.round((fixedCount / (wrongAll.length + fixedCount)) * 100) : 0;
  const lastDate = history.length ? [...history.map((h) => h.createdAt)].sort().at(-1) : null;

  // Bộ lọc môn
  const subjCount = new Map<string, number>();
  for (const w of wrongAll) subjCount.set(w.courseType ?? 'other', (subjCount.get(w.courseType ?? 'other') ?? 0) + 1);
  const subjectTabs = [...subjCount.entries()].sort((a, b) => b[1] - a[1]);

  let list = subject === 'all' ? wrongAll : wrongAll.filter((w) => (w.courseType ?? 'other') === subject);
  list = [...list].sort((a, b) => (sort === 'most' ? b.wrong - a.wrong : (a.createdAt < b.createdAt ? 1 : -1)));

  const kpis = [
    { icon: 'bookBtn' as const, color: '#7c3aed', label: 'Tổng bài tập sai', value: `${wrongAll.length}`, sub: 'bài' },
    { icon: 'calendar' as const, color: '#f59e0b', label: 'Lần làm gần nhất', value: dateLabel(lastDate), sub: fmtDate(lastDate) },
    { icon: 'target' as const, color: '#16a34a', label: 'Đã làm đúng', value: `${fixedCount}`, sub: 'bài' },
    { icon: 'starBtn' as const, color: '#2563eb', label: 'Tiến bộ', value: `${progress}%`, sub: 'bài đã đạt' },
  ];

  return (
    <section className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-8">
      <div className="rounded-[28px] p-3 sm:rounded-[36px] sm:p-6" style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f1f9ff 42%,#faf5ff 100%)' }}>
        {/* Header */}
        <div className="relative overflow-hidden rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/dashboard" className="flex shrink-0 items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-100 hover:bg-slate-100">
              <ArrowLeft size={14} /> Quay lại
            </Link>
            <KidIcon name="tigerRead" className="hidden h-16 w-16 shrink-0 sm:block sm:h-20 sm:w-20" />
            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#1e3a8a] sm:text-3xl">
                Ôn bài tập sai
                <button onClick={load} title="Tải lại" className="grid h-7 w-7 place-items-center rounded-full bg-sky-50 text-sky-500 ring-1 ring-sky-100 hover:bg-sky-100"><RefreshCw size={13} /></button>
              </h1>
              <p className="mt-1 text-sm text-slate-500">Cùng ôn lại những bài tập bé đã làm sai để ghi nhớ tốt hơn nhé!</p>
            </div>
          </div>
        </div>

        {loading && <p className="py-16 text-center text-slate-400">Đang tải…</p>}

        {!loading && noChild && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-center text-sm text-amber-800 ring-1 ring-amber-100">
            Chưa có hồ sơ bé. <Link href="/ho-so-be" className="font-bold underline">Tạo hồ sơ bé</Link> để bắt đầu — không cần đăng nhập, dữ liệu lưu trên trình duyệt này.
          </div>
        )}

        {!loading && !noChild && (
          <>
            {/* KPI */}
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:grid-cols-4 sm:p-5">
              {kpis.map((k) => (
                <div key={k.label} className="flex items-center gap-2.5">
                  <KidIcon name={k.icon} className="h-11 w-11 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-400">{k.label}</div>
                    <div className="text-lg font-black leading-tight" style={{ color: k.color }}>{k.value}</div>
                    {k.sub && <div className="truncate text-[10px] text-slate-400">{k.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Bộ lọc môn + sắp xếp */}
            {wrongAll.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-slate-100">
                <FilterTab active={subject === 'all'} onClick={() => setSubject('all')} label={`Tất cả (${wrongAll.length})`} />
                {subjectTabs.map(([ct, n]) => (
                  <FilterTab key={ct} active={subject === ct} onClick={() => setSubject(ct)} icon={<KidIcon name={subjectIcon(ct)} className="h-4 w-4" />} label={`${subjectInfo(ct).name} (${n})`} />
                ))}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="ml-auto cursor-pointer rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 focus:outline-none"
                >
                  <option value="recent">Mới nhất</option>
                  <option value="most">Sai nhiều nhất</option>
                </select>
              </div>
            )}

            {/* Danh sách */}
            {wrongAll.length === 0 ? (
              <div className="mt-4 rounded-[24px] bg-emerald-50 p-8 text-center ring-1 ring-emerald-100">
                <KidIcon name="trophy" className="mx-auto h-14 w-14" />
                <p className="mt-3 text-lg font-black text-emerald-800">Tuyệt vời! Bé không còn bài tập nào đang sai.</p>
                <p className="mt-1 text-sm text-emerald-600">Cùng khám phá bài học mới nhé!</p>
                <Link href="/khoa-hoc" className="mt-4 inline-block rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Học bài mới</Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {list.map((w) => {
                  const href = w.lessonSlug ? `/${w.lessonSlug}` : `/lessons/${w.lessonId}`;
                  const info = subjectInfo(w.courseType);
                  return (
                    <div key={w.lessonId} className="flex flex-col gap-3 rounded-[20px] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:p-4">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                        <KidIcon name={subjectIcon(w.courseType)} className="h-10 w-10" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-600">{info.name}</span>
                          <span className="truncate font-black text-slate-800">{w.lessonTitle ?? `Bài #${w.lessonId}`}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Làm sai vào {fmtDate(w.createdAt)} · Sai {w.wrong}/{w.totalQuestions} câu
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-500"><X size={12} /> Sai {w.wrong} câu</span>
                        <Link href={href} className="flex items-center gap-1.5 rounded-full bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1d4ed8]">
                          Ôn lại ngay <RotateCcw size={13} />
                        </Link>
                        <Link href={href} className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 sm:flex">
                          <Eye size={13} /> Xem đáp án
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mẹo nhỏ */}
            <div className="mt-4 flex items-center gap-3 rounded-[24px] bg-sky-50 p-4 ring-1 ring-sky-100">
              <span className="text-2xl">💡</span>
              <p className="text-sm text-sky-900">
                <strong>Mẹo nhỏ:</strong> Bé hãy ôn lại bài tập sai thường xuyên để ghi nhớ kiến thức lâu hơn và làm bài chính xác hơn nhé!
              </p>
              <KidIcon name="rabbit" className="ml-auto hidden h-12 w-12 sm:block" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FilterTab({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
        active ? 'bg-[#2563eb] text-white shadow-sm' : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
