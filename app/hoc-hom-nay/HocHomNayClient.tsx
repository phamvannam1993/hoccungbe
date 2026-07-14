'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listChildren, childStats, childStreak, childHistory, subjectInfo, getCurrentChildId, gradeLabel, type Child, type Stats, type Streak, type HistoryItem } from '../lib/childData';
import KidIcon, { subjectIcon, ChildAvatar } from '../components/edu/KidIcon';
import { ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type Task = { lessonId: number; title: string; slug?: string; ct?: string | null; pct: number; done: boolean };

export default function HocHomNayClient() {
  const [child, setChild] = useState<Child | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noChild, setNoChild] = useState(false);

  useEffect(() => {
    const id = getCurrentChildId();
    if (!id) { setNoChild(true); setLoading(false); return; }
    (async () => {
      const [arr, s, st, h] = await Promise.all([
        listChildren().catch(() => [] as Child[]),
        childStats(id).catch(() => null),
        childStreak(id).catch(() => null),
        childHistory(id, 500).catch(() => [] as HistoryItem[]),
      ]);
      setChild(arr.find((c) => c.id === id) ?? null);
      setStats(s);
      setStreak(st);
      setHistory(Array.isArray(h) ? h : []);
      setLoading(false);
    })();
  }, []);

  const now = new Date();
  const todayStr = ymd(now);

  // ── Lịch hôm qua/hôm nay để tính "so với hôm qua" ──
  const yStr = ymd(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  const todayCount = history.filter((h) => ymd(new Date(h.createdAt)) === todayStr).length;
  const yesterdayCount = history.filter((h) => ymd(new Date(h.createdAt)) === yStr).length;
  const diff = todayCount - yesterdayCount;

  const distinctSubjects = new Set(history.map((h) => h.courseType ?? 'other')).size;
  const curStreak = streak?.currentStreak ?? 0;

  // ── Nhiệm vụ hôm nay: các bài gần đây (điểm cao nhất mỗi bài) ──
  const map = new Map<number, Task>();
  for (const h of history) {
    const cur = map.get(h.lessonId);
    const sc = Math.round(Number(h.score) || 0);
    if (!cur) {
      map.set(h.lessonId, { lessonId: h.lessonId, title: h.lessonTitle ?? `Bài #${h.lessonId}`, slug: h.lessonSlug, ct: h.courseType, pct: sc, done: sc >= 70 });
    } else if (sc > cur.pct) {
      cur.pct = sc; cur.done = sc >= 70;
    }
  }
  const tasks = [...map.values()].slice(0, 4);
  const doneCount = tasks.filter((t) => t.done).length;

  const SUGGESTIONS = [
    { icon: 'bookBtn' as const, title: 'Bài học phù hợp', desc: 'Dành riêng cho bé', href: '/khoa-hoc', bg: 'bg-amber-50', ring: 'ring-amber-100' },
    { icon: 'target' as const, title: 'Luyện tập thêm', desc: 'Rèn kỹ năng mỗi ngày', href: '/on-tap-cau-sai', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
    { icon: 'trophy' as const, title: 'Thử thách vui', desc: 'Học mà chơi, chơi mà học', href: '/tro-choi', bg: 'bg-violet-50', ring: 'ring-violet-100' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8">
      <div className="rounded-[28px] p-3 sm:rounded-[36px] sm:p-6" style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f1f9ff 42%,#faf5ff 100%)' }}>
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-[24px] p-5 text-white shadow-sm sm:p-7" style={{ background: 'linear-gradient(120deg,#2563eb 0%,#3b82f6 55%,#60a5fa 100%)' }}>
          <span className="pointer-events-none absolute right-40 top-6 text-2xl">⭐</span>
          <span className="pointer-events-none absolute right-64 bottom-6 text-xl">⭐</span>
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-5">
              <KidIcon name="tigerRead" className="hidden h-24 w-24 shrink-0 drop-shadow sm:block" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Học hôm nay</h1>
                  {child?.currentLevel && (
                    <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-black text-white ring-1 ring-white/40">🎒 {gradeLabel(child.currentLevel)}</span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-white/90 sm:text-lg">Cùng bé học mỗi ngày<br />Tiến bộ từng bước nhỏ! ✏️</p>
              </div>
            </div>
            {/* Lịch */}
            <div className="hidden shrink-0 overflow-hidden rounded-2xl bg-white text-center shadow-lg sm:block">
              <div className="relative bg-gradient-to-b from-rose-400 to-rose-500 px-6 py-2 text-sm font-bold text-white">
                <span className="absolute -top-1 left-3 h-3 w-1.5 rounded-full bg-white/80" />
                <span className="absolute -top-1 right-3 h-3 w-1.5 rounded-full bg-white/80" />
                {WEEKDAYS[now.getDay()]}
              </div>
              <div className="px-6 py-2">
                <div className="text-5xl font-black leading-none text-slate-800">{now.getDate()}</div>
                <div className="mt-1 text-xs font-bold text-rose-500">Tháng {now.getMonth() + 1}, {now.getFullYear()}</div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="py-16 text-center text-slate-400">Đang tải…</p>
        ) : noChild ? (
          <div className="mt-4 rounded-[24px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
            <KidIcon name="tigerRead" className="mx-auto h-20 w-20" />
            <h2 className="mt-3 text-2xl font-black text-slate-900">Chào bé! Bắt đầu học nào</h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">Tạo hồ sơ bé để lưu tiến độ mỗi ngày — không cần đăng nhập.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/ho-so-be" className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-bold text-white hover:bg-[#1d4ed8]">Tạo hồ sơ bé</Link>
              <Link href="/khoa-hoc" className="rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">Xem khóa học</Link>
            </div>
          </div>
        ) : (
          <>
            {/* KPI */}
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 lg:grid-cols-4 sm:p-5">
              <Kpi icon="bookBtn" color="#2563eb" value={`${distinctSubjects}`} label="Khóa học đang học" />
              <Kpi icon="clock" color="#16a34a" value={`${todayCount}`} unit="lượt" label="Học hôm nay" extra={diff !== 0 && todayCount > 0 ? `${diff > 0 ? '↑' : '↓'} ${Math.abs(diff)} so với hôm qua` : undefined} />
              <Kpi icon="starBtn" color="#7c3aed" value={`${stats?.lessonsCompleted ?? 0}`} label="Bài học đã hoàn thành" />
              <Kpi icon="flame" color="#f59e0b" value={`${curStreak}`} unit="ngày" label="Ngày liên tiếp học tập" badge={curStreak >= 2 ? 'Tuyệt vời! 🔥' : undefined} />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              {/* Nhiệm vụ hôm nay */}
              <div className="min-w-0 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="target" className="h-6 w-6" /> Nhiệm vụ hôm nay</h2>
                  {tasks.length > 0 && <span className="text-xs font-bold text-sky-600">{doneCount}/{tasks.length} đã hoàn thành</span>}
                </div>
                {tasks.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-100">
                    Hôm nay bé chưa có nhiệm vụ. <Link href="/khoa-hoc" className="font-bold text-sky-600 underline">Chọn bài học</Link> để bắt đầu nhé!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((t) => (
                      <div key={t.lessonId} className="flex items-center gap-3 rounded-2xl bg-slate-50/60 p-2.5 ring-1 ring-slate-100">
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black ${t.done ? 'bg-emerald-500 text-white' : t.pct > 0 ? 'bg-amber-400 text-white' : 'bg-white text-slate-300 ring-2 ring-slate-200'}`}>
                          {t.done ? '✓' : t.pct > 0 ? '●' : ''}
                        </span>
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-slate-100">
                          <KidIcon name={subjectIcon(t.ct)} className="h-9 w-9" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-800">{t.title}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                              <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.done ? '#22c55e' : t.pct > 0 ? '#f59e0b' : '#cbd5e1' }} />
                            </div>
                            <span className={`w-9 text-right text-xs font-black ${t.done ? 'text-emerald-600' : t.pct > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{t.pct}%</span>
                          </div>
                        </div>
                        <Link href={t.slug ? `/${t.slug}` : `/lessons/${t.lessonId}`} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${t.pct > 0 ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]' : 'bg-white text-sky-700 ring-1 ring-sky-300 hover:bg-sky-50'}`}>
                          {t.pct > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cột phải */}
              <div className="min-w-0 space-y-4">
                {/* Cố gắng thêm */}
                <div className="relative overflow-hidden rounded-[24px] p-5 shadow-sm ring-1 ring-violet-100" style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}>
                  <div className="flex items-center gap-3">
                    <KidIcon name="rabbit" className="h-16 w-16 shrink-0" />
                    <div>
                      <h3 className="text-lg font-black leading-tight text-violet-700">Cố gắng thêm chút nữa nhé!</h3>
                      <p className="mt-1 text-xs text-violet-500">Học mỗi ngày, vui mỗi ngày 💖</p>
                    </div>
                  </div>
                </div>

                {/* Gợi ý dành cho bé */}
                <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-3 flex items-center gap-2 text-base font-black text-slate-900">💡 Gợi ý dành cho bé</h3>
                  <div className="space-y-2.5">
                    {SUGGESTIONS.map((s) => (
                      <Link key={s.title} href={s.href} className={`flex items-center gap-3 rounded-2xl ${s.bg} p-3 ring-1 ${s.ring} transition hover:brightness-95`}>
                        <KidIcon name={s.icon} className="h-9 w-9 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-800">{s.title}</p>
                          <p className="truncate text-xs text-slate-500">{s.desc}</p>
                        </div>
                        <ChevronRight size={18} className="shrink-0 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                {child && (
                  <Link href="/tien-do" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50">
                    <ChildAvatar child={child} className="h-6 w-6" /> Xem tiến độ của {child.nickname || child.fullName}
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Kpi({ icon, color, value, unit, label, extra, badge }: { icon: Parameters<typeof KidIcon>[0]['name']; color: string; value: string; unit?: string; label: string; extra?: string; badge?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <KidIcon name={icon} className="h-11 w-11 shrink-0" />
      <div className="min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black leading-none" style={{ color }}>{value}</span>
          {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
        </div>
        <div className="mt-0.5 text-[11px] font-semibold text-slate-500">{label}</div>
        {extra && <div className="text-[10px] font-bold text-emerald-500">{extra}</div>}
        {badge && <div className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-600 ring-1 ring-amber-100">{badge}</div>}
      </div>
    </div>
  );
}
