'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { listChildren, childStats, childStreak, childMastery, childHistory, isGuest, setCurrentChildId, getCurrentChildId, type Child, type Stats, type Streak, type Mastery, type HistoryItem } from '../../lib/childData';
import KidIcon, { subjectIcon, type IconName } from './KidIcon';

type Rec = { id: number; lessonId: number; reason?: string; status: string; lessonSlug?: string | null; lessonTitle?: string | null };

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

// Gradient thanh tiến độ luân phiên theo môn (đẹp & phân biệt rõ).
const BAR_GRADIENTS = [
  'linear-gradient(90deg,#60a5fa,#2563eb)',
  'linear-gradient(90deg,#34d399,#059669)',
  'linear-gradient(90deg,#fbbf24,#f59e0b)',
  'linear-gradient(90deg,#a78bfa,#7c3aed)',
  'linear-gradient(90deg,#fb7185,#e11d48)',
  'linear-gradient(90deg,#22d3ee,#0891b2)',
];

// Cấp độ suy ra từ điểm thưởng (mỗi câu đúng = 10 điểm).
const LEVEL_SIZE = 400; // điểm cần cho mỗi cấp
const LEVEL_TITLES = ['Tân binh chăm chỉ', 'Học sinh chăm chỉ', 'Ngôi sao nhỏ', 'Nhà thông thái nhí', 'Bậc thầy học tập'];
function levelTitle(level: number) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

const WEEKDAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
// YYYY-MM-DD theo giờ ĐỊA PHƯƠNG (không dùng toISOString để tránh lệch múi giờ).
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
// 7 ngày của tuần hiện tại, bắt đầu từ Thứ 2.
function weekDates(): string[] {
  const now = new Date();
  const monOffset = (now.getDay() + 6) % 7; // Mon=0 … Sun=6
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - monOffset);
  return Array.from({ length: 7 }, (_, i) => ymd(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)));
}
const WEEKLY_GOAL = 5; // mục tiêu: học 5 ngày/tuần

export default function ProgressPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [guest, setGuest] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [mastery, setMastery] = useState<Mastery[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [recs, setRecs] = useState<Rec[]>([]);

  // Danh sách bé (đăng nhập: từ server; khách: từ localStorage)
  useEffect(() => {
    (async () => {
      setGuest(isGuest());
      const arr = await safe(listChildren(), []);
      setChildren(arr);
      if (arr.length) {
        const stored = getCurrentChildId();
        const pick = arr.find((c) => c.id === stored)?.id ?? arr[0].id;
        setChildId(pick);
        setCurrentChildId(pick);
      }
      setLoading(false);
    })();
  }, []);

  const loadChild = useCallback(async (id: number) => {
    setDataLoading(true);
    const [s, st, m, h, r] = await Promise.all([
      safe(childStats(id), null),
      safe(childStreak(id), null),
      safe(childMastery(id), []),
      safe(childHistory(id, 80), []),
      // Gợi ý chỉ có khi đăng nhập (khách chưa có lộ trình cá nhân hóa).
      isGuest() ? Promise.resolve<Rec[]>([]) : safe(apiFetch<Rec[]>(`/recommendations/${id}`), []),
    ]);
    setStats(s);
    setStreak(st);
    setMastery(Array.isArray(m) ? m : []);
    setHistory(Array.isArray(h) ? h : []);
    setRecs(Array.isArray(r) ? r : []);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (childId) loadChild(childId);
  }, [childId, loadChild]);

  function selectChild(id: number) {
    setChildId(id);
    localStorage.setItem('bhh_child_id', String(id));
  }

  const currentChild = children.find((c) => c.id === childId);
  // Chỉ hiện môn bé đã luyện (có tiến độ > 0) — tránh liệt kê môn 0%.
  const practiced = mastery.filter((m) => m.masteryPercent > 0).sort((a, b) => b.masteryPercent - a.masteryPercent);
  const pendingRecs = recs.filter((r) => r.status === 'pending');

  // ── Số liệu suy ra ──
  const points = (stats?.totalCorrect ?? 0) * 10; // điểm thưởng
  const level = Math.floor(points / LEVEL_SIZE) + 1;
  const pointsIntoLevel = points % LEVEL_SIZE;

  // Lịch học tuần này: ngày nào trong tuần có làm bài.
  const activeDays = new Set(history.map((h) => ymd(new Date(h.createdAt))));
  const week = weekDates();
  const todayStr = ymd(new Date());
  const activeThisWeek = week.filter((d) => activeDays.has(d)).length;
  const doneToday = activeDays.has(todayStr);

  // Huy hiệu suy ra từ số liệu thật (đạt / chưa đạt).
  const curStreak = streak?.currentStreak ?? 0;
  const badges: { icon: IconName; name: string; desc: string; earned: boolean }[] = [
    { icon: 'flame', name: curStreak >= 2 ? `Chuỗi ${curStreak} ngày` : 'Chuỗi ngày', desc: 'Học liên tiếp', earned: curStreak >= 2 },
    { icon: 'starBadge', name: 'Chăm chỉ', desc: `${stats?.totalAttempts ?? 0} bài đã làm`, earned: (stats?.totalAttempts ?? 0) >= 10 },
    { icon: 'target', name: 'Điểm cao', desc: `Chính xác ${Math.round(stats?.accuracy ?? 0)}%`, earned: (stats?.accuracy ?? 0) >= 80 },
  ];

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8">
      <div
        className="rounded-[28px] p-3 sm:rounded-[36px] sm:p-6"
        style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f1f9ff 42%,#faf5ff 100%)' }}
      >
        {loading ? (
          <p className="py-20 text-center text-slate-400">Đang tải…</p>
        ) : children.length === 0 ? (
          // Chưa có hồ sơ bé (khách vẫn tạo được, không cần đăng nhập)
          <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
            <KidIcon name="tigerHero" className="mx-auto h-20 w-20" />
            <h2 className="mt-4 text-2xl font-black text-slate-900">Chưa có hồ sơ bé</h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">
              Tạo hồ sơ bé để bắt đầu ghi lại tiến độ học tập — <strong>không cần đăng nhập</strong>, dữ liệu lưu ngay trên trình duyệt này.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/ho-so-be" className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1d4ed8]">
                Tạo hồ sơ bé
              </Link>
              <Link href="/dang-nhap" className="rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Đăng nhập để đồng bộ
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {/* ── Hàng trên: tiêu đề + KPI (trái) · Cấp độ (phải) ── */}
            <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
              <div className="min-w-0 space-y-4">
                {/* Tiêu đề + mascot */}
                <div className="relative flex items-center gap-3 sm:gap-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 sm:h-24 sm:w-24">
                    <KidIcon name="tigerHero" className="h-12 w-12 sm:h-20 sm:w-20" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="flex items-center gap-2 text-2xl font-black leading-tight tracking-tight text-[#1e3a8a] sm:text-4xl">
                      Tiến độ học tập <KidIcon name="airplane" className="h-6 w-6 sm:h-9 sm:w-9" />
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 sm:text-base">Cùng xem bé đã học tập chăm chỉ như thế nào nhé!</p>
                    {children.length > 1 && (
                      <div className="relative mt-2 inline-block">
                        <select
                          value={childId ?? ''}
                          onChange={(e) => selectChild(Number(e.target.value))}
                          className="cursor-pointer appearance-none rounded-full bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                          {children.map((c) => (
                            <option key={c.id} value={c.id}>{c.fullName}</option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thẻ KPI */}
                <div className="grid grid-cols-2 gap-3 rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:grid-cols-4 sm:p-5">
                  <Kpi icon="bookBtn" color="#2563eb" label="Bài đã làm" value={stats?.totalAttempts ?? 0} sub={`${stats?.totalQuestions ?? 0} câu hỏi`} />
                  <Kpi icon="target" color="#059669" label="Độ chính xác" value={`${Math.round(stats?.accuracy ?? 0)}%`} pct={Math.round(stats?.accuracy ?? 0)} sub={`${stats?.totalCorrect ?? 0}/${stats?.totalQuestions ?? 0} câu đúng`} />
                  <Kpi icon="starBtn" color="#7c3aed" label="Bài hoàn thành" value={stats?.lessonsCompleted ?? 0} sub="đạt ≥ 50%" />
                  <Kpi icon="flame" color="#ea580c" label="Chuỗi ngày" value={curStreak} sub={`dài nhất ${streak?.longestStreak ?? 0} ngày`} />
                </div>
              </div>

              {/* Cấp độ */}
              <div className="relative min-w-0 overflow-hidden rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-100/70 blur-xl" />
                <div className="relative flex items-center gap-4">
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[22px] text-3xl font-black text-white shadow-md" style={{ background: 'linear-gradient(160deg,#4ade80,#16a34a)' }}>
                    <span className="drop-shadow">{level}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Cấp độ hiện tại</p>
                    <p className="text-2xl font-black text-slate-900">Cấp {level}</p>
                    <p className="text-sm font-semibold text-amber-600">{levelTitle(level)}</p>
                  </div>
                  <KidIcon name="giftRed" className="ml-auto h-10 w-10" />
                </div>
                <div className="relative mt-5">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${Math.round((pointsIntoLevel / LEVEL_SIZE) * 100)}%`, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)' }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    <strong className="text-slate-700">{pointsIntoLevel}</strong> / {LEVEL_SIZE} điểm để lên Cấp {level + 1}
                  </p>
                </div>
              </div>
            </div>

            {dataLoading ? (
              <p className="py-10 text-center text-sm text-slate-400">Đang tải dữ liệu của bé…</p>
            ) : (
              <>
                {/* ── 3 cột ── */}
                <div className="grid gap-4 lg:grid-cols-3">
                  {/* Cột 1: Tiến độ theo môn học */}
                  <div className="min-w-0 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="book" className="h-6 w-6" /> Tiến độ theo môn học</h2>
                      <Link href="/khoa-hoc" className="text-xs font-bold text-sky-600 hover:underline">Xem tất cả</Link>
                    </div>
                    {practiced.length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 ring-1 ring-slate-100">
                        Bé chưa luyện môn nào. Chọn một bài học và làm thử để bắt đầu ghi tiến độ nhé!
                        <div className="mt-4">
                          <Link href="/khoa-hoc" className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700">Chọn bài học</Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {practiced.map((m, i) => {
                          const pct = Math.round(m.masteryPercent);
                          return (
                            <div key={m.skillId} className="flex items-center gap-3">
                              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                                <KidIcon name={subjectIcon(m.subject)} className="h-9 w-9" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline justify-between gap-2">
                                  <span className="truncate text-sm font-bold text-slate-800">{m.skill?.name ?? `Môn #${m.skillId}`}</span>
                                  <span className="shrink-0 text-sm font-black text-slate-800">{pct}%</span>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="shrink-0 text-[11px] text-slate-400">{m.correctCount}/{m.totalCount} câu</span>
                                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${pct}%`, background: BAR_GRADIENTS[i % BAR_GRADIENTS.length] }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Cột 2: Lịch học tuần này */}
                  <div className="min-w-0 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="calendar" className="h-6 w-6" /> Lịch học tuần này</h2>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {week.map((d, i) => {
                        const isToday = d === todayStr;
                        const active = activeDays.has(d);
                        return (
                          <div key={d} className={`rounded-xl py-2 ${isToday ? 'bg-sky-50 ring-1 ring-sky-200' : ''}`}>
                            <div className="text-[10px] font-semibold text-slate-400 sm:text-xs">{WEEKDAYS[i]}</div>
                            <div className="mt-1.5 flex justify-center">
                              <KidIcon name={active ? 'check' : isToday ? 'starBig' : 'statusGray'} className="h-8 w-8" />
                            </div>
                            {isToday && <div className="mt-1 text-[9px] font-bold text-sky-500">Hôm nay</div>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Lời động viên */}
                    <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sky-50/70 p-3 ring-1 ring-sky-100">
                      <KidIcon name="rabbit" className="h-10 w-10 shrink-0" />
                      <p className="text-xs leading-5 text-slate-600">
                        {doneToday ? (
                          <><strong className="text-slate-800">Tuyệt vời! Bé đã học hôm nay 🎉</strong><br />Cố gắng thêm một chút nữa để đạt mục tiêu tuần nhé!</>
                        ) : (
                          <><strong className="text-slate-800">Hôm nay bé chưa học 💪</strong><br />Làm một bài ngắn thôi cũng giúp giữ chuỗi ngày đó!</>
                        )}
                      </p>
                    </div>

                    {/* Mục tiêu tuần */}
                    <div className="mt-3 rounded-2xl bg-emerald-50/70 p-3 ring-1 ring-emerald-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-800">Mục tiêu tuần</span>
                        <span className="text-emerald-600">Học {WEEKLY_GOAL} ngày</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-emerald-100">
                          <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 ease-out" style={{ width: `${Math.min(100, Math.round((activeThisWeek / WEEKLY_GOAL) * 100))}%` }} />
                        </div>
                        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700">{activeThisWeek}/{WEEKLY_GOAL} ngày <KidIcon name="giftGreen" className="h-4 w-4" /></span>
                      </div>
                    </div>
                  </div>

                  {/* Cột 3: Thành tích + gợi ý */}
                  <div className="min-w-0 space-y-4">
                    <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="trophy" className="h-6 w-6" /> Thành tích nổi bật</h2>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {badges.map((b) => (
                          <div key={b.name} className={b.earned ? '' : 'opacity-40 grayscale'}>
                            <KidIcon name={b.icon} className="mx-auto h-14 w-14" />
                            <div className="mt-2 text-[11px] font-black leading-tight text-slate-800">{b.name}</div>
                            <div className="text-[10px] leading-tight text-slate-400">{b.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {pendingRecs.length > 0 ? (
                      <div className="rounded-[24px] bg-amber-50 p-5 shadow-sm ring-1 ring-amber-100">
                        <h3 className="flex items-center gap-2 text-base font-black text-amber-950">✨ Gợi ý học tiếp</h3>
                        <div className="mt-3 space-y-2">
                          {pendingRecs.slice(0, 3).map((r) => (
                            <Link key={r.id} href={r.lessonSlug ? `/${r.lessonSlug}` : `/lessons/${r.lessonId}`} className="block rounded-2xl bg-white px-3 py-2.5 text-sm text-amber-900 ring-1 ring-amber-100 transition hover:ring-amber-300">
                              <span className="block truncate font-semibold">{r.lessonTitle ?? r.reason ?? 'Bài luyện đề xuất'}</span>
                              <span className="mt-0.5 block text-xs font-bold text-amber-600">→ Học ngay</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="relative overflow-hidden rounded-[24px] p-5 shadow-sm ring-1 ring-emerald-100" style={{ background: 'linear-gradient(160deg,#ecfdf5,#d1fae5)' }}>
                        <div className="flex items-start gap-3">
                          <div className="min-w-0">
                            <h3 className="text-lg font-black leading-tight text-emerald-800">Kiến thức là kho báu!</h3>
                            <p className="mt-2 text-xs leading-5 text-emerald-700">Bé đang làm rất tốt!<br />Hãy giữ vững phong độ nhé!</p>
                          </div>
                          <KidIcon name="tigerRead" className="ml-auto h-14 w-14 shrink-0" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Liên kết nhanh */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50"><KidIcon name="calendar" className="h-5 w-5" /> Bảng chi tiết</Link>
                  <Link href="/on-tap-cau-sai" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50"><KidIcon name="bookBtn" className="h-5 w-5" /> Ôn câu sai</Link>
                  <Link href="/chung-nhan" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50"><KidIcon name="medal" className="h-5 w-5" /> Chứng nhận</Link>
                  <Link href="/ho-so-be" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50"><KidIcon name="avatarBoy" className="h-5 w-5 rounded-full" /> Hồ sơ bé</Link>
                </div>

                {/* Mẹo hay */}
                <div className="flex flex-col items-center justify-between gap-3 rounded-[24px] bg-amber-50 p-4 ring-1 ring-amber-100 sm:flex-row sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💡</span>
                    <p className="text-sm text-amber-900">
                      <strong>Mẹo hay:</strong> Học mỗi ngày một chút sẽ giúp bé tiếp thu kiến thức tốt hơn và nhớ lâu hơn đó!
                    </p>
                  </div>
                  <Link href="/khoa-hoc" className="flex shrink-0 items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#1d4ed8]">
                    Khám phá khóa học mới <KidIcon name="airplane" className="h-5 w-5" />
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Kpi({ icon, color, label, value, sub, pct }: { icon: IconName; color: string; label: string; value: string | number; sub?: string; pct?: number }) {
  return (
    <div className="flex items-start gap-2.5">
      <KidIcon name={icon} className="h-11 w-11 shrink-0" />
      <div className="min-w-0">
        <div className="text-[11px] font-semibold text-slate-400">{label}</div>
        <div className="text-xl font-black leading-tight" style={{ color }}>{value}</div>
        {pct != null && (
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
          </div>
        )}
        {sub && <div className="mt-0.5 truncate text-[10px] text-slate-400">{sub}</div>}
      </div>
    </div>
  );
}
