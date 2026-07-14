'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { listChildren, childStats, childStreak, childHistory, isGuest, setCurrentChildId, getCurrentChildId, subjectInfo, type Child, type Stats, type Streak, type HistoryItem } from '../../lib/childData';
import KidIcon, { subjectIcon, type IconName } from './KidIcon';

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

// ── Cấp độ / điểm suy ra từ số liệu thật ──
const LEVEL_SIZE = 400;

// ── Tuần hiện tại (Thứ 2 → CN), theo giờ địa phương ──
const WEEKDAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
const WEEKLY_GOAL = 5;
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function weekDates(): string[] {
  const now = new Date();
  const monOffset = (now.getDay() + 6) % 7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - monOffset);
  return Array.from({ length: 7 }, (_, i) => ymd(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)));
}
function starsForScore(s: number) {
  if (s >= 90) return 3;
  if (s >= 70) return 2;
  if (s >= 50) return 1;
  return 0;
}

export default function ParentDashboardPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [guest, setGuest] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [parentNote, setParentNote] = useState('');
  const [todayNote, setTodayNote] = useState('');

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
      } else setApiError(true);
      setLoading(false);
    })();
  }, []);

  const loadChild = useCallback(async (id: number) => {
    setDataLoading(true);
    const [s, st, h] = await Promise.all([
      safe(childStats(id), null),
      safe(childStreak(id), null),
      safe(childHistory(id, 500), []),
    ]);
    setStats(s);
    setStreak(st);
    setHistory(Array.isArray(h) ? h : []);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (childId != null) loadChild(childId);
  }, [childId, loadChild]);

  // Ghi chú của phụ huynh (lưu localStorage — riêng tư, cả khách & đăng nhập).
  useEffect(() => {
    if (childId == null) return;
    setParentNote(localStorage.getItem(`bhh_parent_note_${childId}`) || '');
    setTodayNote(localStorage.getItem(`bhh_today_note_${childId}`) || '');
  }, [childId]);
  function saveParentNote(v: string) {
    setParentNote(v);
    if (childId != null) localStorage.setItem(`bhh_parent_note_${childId}`, v);
  }
  function saveTodayNote(v: string) {
    setTodayNote(v);
    if (childId != null) localStorage.setItem(`bhh_today_note_${childId}`, v);
  }

  if (loading) {
    return <section className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">Đang tải bảng theo dõi…</section>;
  }

  // ── Số liệu suy ra ──
  const points = (stats?.totalCorrect ?? 0) * 10;
  const pointsIntoLevel = points % LEVEL_SIZE;
  const curStreak = streak?.currentStreak ?? 0;

  const week = weekDates();
  const todayStr = ymd(new Date());
  const activeDays = new Set(history.map((h) => ymd(new Date(h.createdAt))));
  const activeThisWeek = week.filter((d) => activeDays.has(d)).length;

  // Bảng theo dõi: điểm cao nhất theo (môn | ngày) trong tuần.
  const boardByKey = new Map<string, number>();
  for (const h of history) {
    const day = ymd(new Date(h.createdAt));
    if (!week.includes(day)) continue;
    const key = `${h.courseType ?? 'other'}|${day}`;
    const sc = Number(h.score) || 0;
    if (!boardByKey.has(key) || sc > boardByKey.get(key)!) boardByKey.set(key, sc);
  }
  // Các môn bé đã học (hàng của bảng), sắp theo thứ tự môn.
  const subjects = [...new Set(history.map((h) => h.courseType ?? 'other'))]
    .map((ct) => ({ ct, ...subjectInfo(ct) }))
    .sort((a, b) => a.id - b.id);

  // Mục tiêu tuần
  const lessonsThisWeek = new Set(
    history.filter((h) => week.includes(ymd(new Date(h.createdAt))) && Number(h.score) >= 50).map((h) => h.lessonId),
  ).size;
  const GOAL_LESSONS = 10;
  const GOAL_STARS = 1000;

  // Huy hiệu suy ra
  const perDayCount = new Map<string, number>();
  for (const h of history) {
    const d = ymd(new Date(h.createdAt));
    perDayCount.set(d, (perDayCount.get(d) ?? 0) + 1);
  }
  const maxPerDay = Math.max(0, ...perDayCount.values());
  const rewards: { icon: IconName; name: string; desc: string; earned: boolean }[] = [
    { icon: 'starBadge', name: 'Học đều', desc: '7 ngày liên tiếp', earned: (streak?.longestStreak ?? 0) >= 7 },
    { icon: 'tigerHero', name: 'Chăm chỉ', desc: 'Hoàn thành mục tiêu tuần', earned: activeThisWeek >= WEEKLY_GOAL },
    { icon: 'target', name: 'Siêu tập trung', desc: 'Nhiều bài trong 1 ngày', earned: maxPerDay >= 3 },
  ];

  const currentChild = children.find((c) => c.id === childId);

  return (
    <section className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8">
      <div className="rounded-[28px] p-3 sm:rounded-[36px] sm:p-6" style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f1f9ff 42%,#faf5ff 100%)' }}>
        {/* Header */}
        <div className="relative flex items-center justify-between gap-3 overflow-hidden">
          <KidIcon name="tigerHero" className="hidden h-16 w-16 shrink-0 sm:block sm:h-20 sm:w-20" />
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-black tracking-tight text-[#1e3a8a] sm:text-4xl">Bảng theo dõi học tập</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">Cùng bé theo dõi việc học mỗi ngày nhé!</p>
          </div>
          <KidIcon name="rabbit" className="hidden h-16 w-16 shrink-0 sm:block sm:h-20 sm:w-20" />
        </div>

        {children.length > 1 && (
          <div className="mt-3 flex justify-center">
            <select
              value={childId ?? ''}
              onChange={(e) => {
                const id = Number(e.target.value);
                setChildId(id);
                localStorage.setItem('bhh_child_id', String(id));
              }}
              className="cursor-pointer appearance-none rounded-full bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.fullName}</option>
              ))}
            </select>
          </div>
        )}

        {apiError && (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-center text-sm text-amber-800 ring-1 ring-amber-100">
            Chưa có hồ sơ bé. <Link href="/ho-so-be" className="font-bold underline">Tạo hồ sơ bé</Link> để bắt đầu theo dõi
            {guest ? ' — không cần đăng nhập, dữ liệu lưu trên trình duyệt này.' : '.'}
          </div>
        )}

        {!apiError && (
          <>
            {/* KPI */}
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <KpiCard icon="bookBtn" color="#2563eb" label="Bài đã học" value={`${stats?.lessonsCompleted ?? 0}`} sub={`${stats?.totalAttempts ?? 0} lượt làm bài`} pct={stats && stats.totalAttempts ? Math.round(stats.accuracy) : 0} />
              <KpiCard icon="clock" color="#16a34a" label="Ngày học liên tiếp" value={`${curStreak} ngày`} sub={curStreak >= 1 ? 'Tuyệt vời! 🔥' : 'Bắt đầu nào!'} />
              <KpiCard icon="starBtn" color="#f59e0b" label="Sao thưởng" value={`${points} ★`} sub="Cố gắng thêm nhé!" pct={Math.round((pointsIntoLevel / LEVEL_SIZE) * 100)} />
              <KpiCard icon="target" color="#7c3aed" label="Mục tiêu tuần" value={`${activeThisWeek}/${WEEKLY_GOAL}`} sub="ngày trong tuần" pct={Math.round((activeThisWeek / WEEKLY_GOAL) * 100)} />
            </div>

            {guest && (
              <div className="mt-3 rounded-2xl bg-sky-50 p-2.5 text-center text-xs font-medium text-sky-700 ring-1 ring-sky-100">
                👋 Chế độ khách — dữ liệu lưu trên trình duyệt này. <Link href="/dang-nhap" className="font-bold underline">Đăng nhập</Link> để đồng bộ nhiều thiết bị.
              </div>
            )}

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
              {/* Cột trái */}
              <div className="min-w-0 space-y-4">
                {/* Bảng theo dõi tuần */}
                <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="calendar" className="h-6 w-6" /> Theo dõi tuần này</h2>
                  {subjects.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-100">
                      Tuần này bé chưa học môn nào. <Link href="/khoa-hoc" className="font-bold text-sky-600 underline">Chọn bài học</Link> để bắt đầu nhé!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[520px] border-separate border-spacing-0 text-center">
                        <thead>
                          <tr>
                            <th className="sticky left-0 z-10 bg-white" />
                            {week.map((d, i) => {
                              const isToday = d === todayStr;
                              return (
                                <th key={d} className={`px-1 py-2 text-xs font-bold ${isToday ? 'rounded-t-xl bg-sky-50 text-sky-600' : 'text-slate-500'}`}>
                                  {WEEKDAYS[i]}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map((s) => (
                            <tr key={s.ct}>
                              <td className="sticky left-0 z-10 bg-white py-2 pr-2 text-left">
                                <span className="flex items-center gap-2 whitespace-nowrap">
                                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 ring-1 ring-slate-100"><KidIcon name={subjectIcon(s.ct)} className="h-6 w-6" /></span>
                                  <span className="text-sm font-bold text-slate-700">{s.name}</span>
                                </span>
                              </td>
                              {week.map((d) => {
                                const isToday = d === todayStr;
                                const sc = boardByKey.get(`${s.ct}|${d}`);
                                return (
                                  <td key={d} className={`px-1 py-2 ${isToday ? 'bg-sky-50' : ''}`}>
                                    <div className="flex justify-center"><StatusMark score={sc} /></div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* Chú thích */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><KidIcon name="check" className="h-4 w-4" /> Đã hoàn thành</span>
                    <span className="flex items-center gap-1"><KidIcon name="starBig" className="h-4 w-4" /> Hoàn thành tốt</span>
                    <span className="flex items-center gap-1"><KidIcon name="trophy" className="h-4 w-4" /> Xuất sắc</span>
                    <span className="flex items-center gap-1"><KidIcon name="statusGray" className="h-4 w-4" /> Chưa học</span>
                  </div>
                </div>

                {/* Ghi chú phụ huynh */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <h3 className="flex items-center gap-2 text-sm font-black text-slate-800"><span>👨‍👩‍👧</span> Nhận xét của bố mẹ</h3>
                    <textarea
                      value={parentNote}
                      onChange={(e) => saveParentNote(e.target.value)}
                      rows={3}
                      placeholder={`Vài lời động viên cho ${currentChild?.fullName ?? 'bé'}…`}
                      className="mt-2 w-full resize-none rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-100 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                  <div className="rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <h3 className="flex items-center gap-2 text-sm font-black text-slate-800"><span>📝</span> Ghi chú hôm nay</h3>
                    <textarea
                      value={todayNote}
                      onChange={(e) => saveTodayNote(e.target.value)}
                      rows={3}
                      placeholder="Viết ghi chú hoặc lời nhắn cho bé…"
                      className="mt-2 w-full resize-none rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-100 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                  </div>
                </div>
              </div>

              {/* Cột phải */}
              <div className="min-w-0 space-y-4">
                {/* Thưởng cho bé */}
                <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="trophy" className="h-6 w-6" /> Thưởng cho bé</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {rewards.map((r) => (
                      <div key={r.name} className={r.earned ? '' : 'opacity-40 grayscale'}>
                        <KidIcon name={r.icon} className="mx-auto h-14 w-14" />
                        <div className="mt-2 text-[11px] font-black leading-tight text-slate-800">{r.name}</div>
                        <div className="text-[10px] leading-tight text-slate-400">{r.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mục tiêu tuần */}
                <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900"><KidIcon name="target" className="h-6 w-6" /> Mục tiêu tuần</h3>
                  <div className="space-y-4">
                    <GoalRow icon="bookBtn" label={`Hoàn thành ${GOAL_LESSONS} bài học`} cur={lessonsThisWeek} target={GOAL_LESSONS} barColor="#2563eb" />
                    <GoalRow icon="clock" label={`Học ít nhất ${WEEKLY_GOAL} ngày`} cur={activeThisWeek} target={WEEKLY_GOAL} barColor="#7c3aed" />
                    <GoalRow icon="starBtn" label={`Tích lũy ${GOAL_STARS} sao`} cur={Math.min(points, GOAL_STARS)} target={GOAL_STARS} barColor="#f59e0b" />
                  </div>
                </div>

                {/* Liên kết nhanh */}
                <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                  <Link href="/tien-do" className="rounded-2xl bg-white px-3 py-2.5 text-center text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50">📈 Tiến độ</Link>
                  <Link href="/on-tap-cau-sai" className="rounded-2xl bg-white px-3 py-2.5 text-center text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50">🔁 Ôn câu sai</Link>
                  <Link href="/chung-nhan" className="rounded-2xl bg-white px-3 py-2.5 text-center text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50">🏅 Chứng nhận</Link>
                  <Link href="/ho-so-be" className="rounded-2xl bg-white px-3 py-2.5 text-center text-slate-700 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50">👶 Hồ sơ bé</Link>
                </div>
              </div>
            </div>

            {/* Câu động viên */}
            <div className="mt-4 flex items-center justify-center gap-3 rounded-[24px] bg-amber-50 p-4 text-center ring-1 ring-amber-100">
              <KidIcon name="trophy" className="h-8 w-8" />
              <p className="text-sm font-black text-[#1e3a8a] sm:text-base">
                Mỗi ngày học một chút, bé sẽ <span className="text-orange-500">tiến bộ thật nhiều!</span>
              </p>
              <KidIcon name="tigerHero" className="h-8 w-8" />
            </div>

            {dataLoading && <p className="mt-4 text-center text-sm text-slate-400">Đang cập nhật dữ liệu của bé…</p>}
          </>
        )}
      </div>
    </section>
  );
}

function KpiCard({ icon, color, label, value, sub, pct }: { icon: IconName; color: string; label: string; value: string; sub?: string; pct?: number }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[20px] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 sm:p-4">
      <KidIcon name={icon} className="h-11 w-11 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold text-slate-400">{label}</div>
        <div className="text-lg font-black leading-tight sm:text-xl" style={{ color }}>{value}</div>
        {pct != null && (
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
          </div>
        )}
        {sub && <div className="mt-1 truncate text-[10px] text-slate-400">{sub}</div>}
      </div>
    </div>
  );
}

// Ô trạng thái trong bảng theo dõi tuần.
function StatusMark({ score }: { score?: number }) {
  if (score == null) return <KidIcon name="statusGray" className="h-7 w-7" alt="Chưa học" />;
  if (score >= 90) return <KidIcon name="trophy" className="h-7 w-7" alt={`Xuất sắc · ${Math.round(score)}đ`} />;
  if (score >= 70) return <KidIcon name="starBig" className="h-7 w-7" alt={`Hoàn thành tốt · ${Math.round(score)}đ`} />;
  return <KidIcon name="check" className="h-7 w-7" alt={`Đã hoàn thành · ${Math.round(score)}đ`} />;
}

function GoalRow({ icon, label, cur, target, barColor }: { icon: IconName; label: string; cur: number; target: number; barColor: string }) {
  const pct = Math.min(100, Math.round((cur / target) * 100));
  const done = cur >= target;
  return (
    <div className="flex items-center gap-3">
      <KidIcon name={icon} className="h-9 w-9 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="truncate font-semibold text-slate-700">{label}</span>
          <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-slate-500">
            {cur}/{target} {done && <KidIcon name="check" className="h-4 w-4" />}
          </span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${pct}%`, background: barColor }} />
        </div>
      </div>
    </div>
  );
}
