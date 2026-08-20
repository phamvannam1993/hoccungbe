'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listChildren, childStats, childStreak, childHistory, childMastery, dailyPlan, getPlacementLocal, getCurrentChildId, gradeLabel, lessonHref, type Child, type Stats, type Streak, type HistoryItem, type Mastery, type PlanTask, type PlanKind, type PlacementResult } from '../lib/childData';
import KidIcon, { ChildAvatar } from '../components/edu/KidIcon';

const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Icon minh họa (public/icons/hom-nay)
function Ic({ name, className = 'h-10 w-10' }: { name: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icons/hom-nay/${name}.webp`} alt="" className={`${className} object-contain`} />;
}

const KIND_META: Record<PlanKind, { chip: string; icon: string; color: string; grad: string; ring: string; btn: string; action: string; minutes: number }> = {
  review_wrong: { chip: 'Ôn lỗi sai', icon: '05_target_red', color: '#ef4444', grad: 'from-rose-50 to-red-50', ring: 'ring-rose-200', btn: 'bg-rose-500 hover:bg-rose-600', action: 'Bắt đầu', minutes: 5 },
  current: { chip: 'Bài đang học', icon: '06_book_open_blue', color: '#2563eb', grad: 'from-blue-50 to-cyan-50', ring: 'ring-blue-200', btn: 'bg-blue-600 hover:bg-blue-700', action: 'Học ngay', minutes: 7 },
  review_old: { chip: 'Nhắc lại', icon: '07_refresh_green', color: '#16a34a', grad: 'from-emerald-50 to-teal-50', ring: 'ring-emerald-200', btn: 'bg-emerald-500 hover:bg-emerald-600', action: 'Tiếp tục', minutes: 4 },
  challenge: { chip: 'Thử thách', icon: '08_gamepad_orange', color: '#f59e0b', grad: 'from-amber-50 to-orange-50', ring: 'ring-amber-200', btn: 'bg-amber-500 hover:bg-amber-600', action: 'Chơi', minutes: 3 },
};

const FORMULA = [
  { pct: 40, color: '#ef4444', label: 'câu bé từng làm sai' },
  { pct: 30, color: '#3b82f6', label: 'kiến thức đang học' },
  { pct: 20, color: '#22c55e', label: 'kiến thức cũ cần nhắc lại' },
  { pct: 10, color: '#eab308', label: 'câu thử thách' },
];

function taskHref(t: PlanTask): string {
  const base = lessonHref(t);
  return t.kind === 'review_wrong' ? `${base}?review=wrong` : base;
}
function taskTitle(t: PlanTask): string {
  const name = t.lessonTitle ?? `Bài #${t.lessonId}`;
  if (t.kind === 'review_wrong') return `Ôn ${t.wrongCount ?? ''} câu sai · ${name}`;
  return name;
}
function shortName(s?: string | null): string {
  if (!s) return '';
  return s.replace(/^Bài\s*\d+:\s*/i, '').trim();
}

export default function HocHomNayClient() {
  const [child, setChild] = useState<Child | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [plan, setPlan] = useState<PlanTask[]>([]);
  const [mastery, setMastery] = useState<Mastery[]>([]);
  const [placement, setPlacement] = useState<PlacementResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [noChild, setNoChild] = useState(false);

  useEffect(() => {
    const id = getCurrentChildId();
    if (!id) { setNoChild(true); setLoading(false); return; }
    (async () => {
      const [arr, s, st, h, p, m] = await Promise.all([
        listChildren().catch(() => [] as Child[]),
        childStats(id).catch(() => null),
        childStreak(id).catch(() => null),
        childHistory(id, 500).catch(() => [] as HistoryItem[]),
        dailyPlan(id).catch(() => [] as PlanTask[]),
        childMastery(id).catch(() => [] as Mastery[]),
      ]);
      setChild(arr.find((c) => c.id === id) ?? null);
      setStats(s);
      setStreak(st);
      setHistory(Array.isArray(h) ? h : []);
      setPlan(Array.isArray(p) ? p : []);
      setMastery(Array.isArray(m) ? m : []);
      setPlacement(getPlacementLocal(id));
      setLoading(false);
    })();
  }, []);

  const now = new Date();
  const todayStr = ymd(now);
  const todayHistory = history.filter((h) => ymd(new Date(h.createdAt)) === todayStr);
  const distinctSubjects = new Set(history.map((h) => h.courseType ?? 'other')).size;
  const curStreak = streak?.currentStreak ?? 0;

  const bestByLesson = new Map<number, number>();
  for (const h of history) bestByLesson.set(h.lessonId, Math.max(bestByLesson.get(h.lessonId) ?? 0, Math.round(Number(h.score) || 0)));

  const doneOf = (t: PlanTask) =>
    t.status === 'done' ||
    todayHistory.some((h) => h.lessonId === t.lessonId && Number(h.score) >= (t.kind === 'review_wrong' ? 100 : 70));
  const goalMin = plan.reduce((s, t) => s + KIND_META[t.kind].minutes, 0);
  const doneMin = plan.filter(doneOf).reduce((s, t) => s + KIND_META[t.kind].minutes, 0);
  const pct = goalMin ? Math.min(100, Math.round((doneMin / goalMin) * 100)) : 0;

  const sortedMastery = [...mastery].sort((a, b) => b.masteryPercent - a.masteryPercent);
  const strong = placement?.strengths?.[0] ?? sortedMastery[0]?.skill?.name ?? null;
  const weak = placement?.weaknesses?.[0] ?? (sortedMastery.length ? sortedMastery[sortedMastery.length - 1]?.skill?.name : null) ?? null;
  const learning = shortName(plan.find((t) => t.kind === 'current')?.lessonTitle) || null;
  const hasFocus = !!(strong || weak || learning);

  return (
    <section className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8">
      <div className="rounded-[24px] p-2.5 sm:rounded-[36px] sm:p-6" style={{ background: 'linear-gradient(180deg,#eef6ff 0%,#f1f9ff 42%,#faf5ff 100%)' }}>
        {/* Header banner */}
        <div className="relative overflow-hidden rounded-[22px] p-4 text-white shadow-sm sm:p-7" style={{ background: 'linear-gradient(120deg,#2563eb 0%,#3b82f6 55%,#60a5fa 100%)' }}>
          <span className="pointer-events-none absolute right-32 top-5 text-lg sm:right-40 sm:top-6 sm:text-2xl">⭐</span>
          <KidIcon name="tigerRead" className="pointer-events-none absolute bottom-0 right-28 hidden h-28 w-28 drop-shadow-lg sm:right-52 sm:block sm:h-40 sm:w-40" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight sm:text-5xl">Học hôm nay</h1>
              <p className="mt-1.5 text-xs leading-5 text-white/90 sm:mt-2 sm:text-base">
                Lộ trình riêng cho {child?.nickname || child?.fullName || 'bé'}<br className="sm:hidden" /> · Học đúng chỗ cần học mỗi ngày
              </p>
            </div>
            <div className="shrink-0 overflow-hidden rounded-xl bg-white text-center shadow-lg sm:rounded-2xl">
              <div className="relative bg-gradient-to-b from-rose-400 to-rose-500 px-4 py-1 text-xs font-bold text-white sm:px-6 sm:py-2 sm:text-sm">
                {WEEKDAYS[now.getDay()]}
              </div>
              <div className="px-4 py-1.5 sm:px-6 sm:py-2">
                <div className="text-3xl font-black leading-none text-slate-800 sm:text-5xl">{now.getDate()}</div>
                <div className="mt-0.5 text-[10px] font-bold text-rose-500 sm:mt-1 sm:text-xs">Tháng {now.getMonth() + 1}, {now.getFullYear()}</div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="py-16 text-center text-slate-400">Đang tải…</p>
        ) : noChild ? (
          <div className="mt-4 rounded-[24px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-100 sm:p-10">
            <KidIcon name="tigerRead" className="mx-auto h-20 w-20" />
            <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl">Chào bé! Bắt đầu học nào</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Tạo hồ sơ bé để lưu tiến độ mỗi ngày — không cần đăng nhập.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/ho-so-be" className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-bold text-white hover:bg-[#1d4ed8]">Tạo hồ sơ bé</Link>
              <Link href="/khoa-hoc" className="rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">Xem khóa học</Link>
            </div>
          </div>
        ) : (
          <>
            {/* KPI — 4 thẻ riêng */}
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 lg:grid-cols-4 sm:gap-3">
              <Kpi icon="01_book_blue_circle" color="#2563eb" value={`${distinctSubjects}`} label="khóa học đang học" />
              <Kpi icon="02_clock_green_circle" color="#16a34a" value={`${goalMin}`} unit="phút" label="mục tiêu hôm nay" />
              <Kpi icon="03_star_badge_purple" color="#7c3aed" value={`${stats?.lessonsCompleted ?? 0}`} label="bài học đã hoàn thành" />
              <Kpi icon="04_fire_streak_orange" color="#f59e0b" value={`${curStreak}`} unit="ngày" label="học liên tiếp" badge={curStreak >= 2 ? '🎉' : undefined} />
            </div>

            {/* Thẻ bé — ngang trên mobile, dọc trên desktop (cột trái) */}
            <div className="mt-3 grid gap-3 sm:mt-4 lg:grid-cols-[220px_1.5fr_1.1fr]">
              <div className="flex min-w-0 items-center gap-3 rounded-[22px] bg-white p-3.5 shadow-sm ring-1 ring-slate-100 sm:gap-4 sm:p-4 lg:block lg:text-center">
                {child && <ChildAvatar child={child} className="h-14 w-14 shrink-0 rounded-3xl ring-4 ring-blue-100 sm:h-16 sm:w-16 lg:mx-auto lg:h-24 lg:w-24" />}
                <div className="min-w-0 flex-1 lg:mt-3 lg:flex-none">
                  <p className="truncate text-base font-black text-slate-900 sm:text-lg">{child?.nickname || child?.fullName}</p>
                  {child?.currentLevel && <p className="text-xs font-bold text-slate-400 sm:text-sm">{gradeLabel(child.currentLevel)}</p>}
                  <p className="mt-1.5 inline-flex max-w-full items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-500 ring-1 ring-slate-100 sm:text-xs"><Ic name="02_clock_green_circle" className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">Hôm nay: {goalMin} phút</span></p>
                </div>
                <div className="flex shrink-0 flex-col items-center gap-0.5 lg:mt-4 lg:gap-2 lg:border-t lg:border-slate-100 lg:pt-4">
                  <ProgressRing pct={pct} />
                  <p className="whitespace-nowrap text-[10px] text-slate-400 sm:text-xs">Đã học <span className="font-black text-emerald-600">{doneMin}/{goalMin}</span> phút</p>
                </div>
              </div>

              {/* ── Cột giữa: lộ trình cá nhân hóa ── */}
              <div className="min-w-0 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
                <h2 className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">✨ Lộ trình cá nhân hóa hôm nay</h2>
                <p className="mb-3 text-xs text-slate-400 sm:mb-4">Tạo tự động dựa trên năng lực và bài đang học</p>

                {plan.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-100">
                    Hôm nay bé chưa có nhiệm vụ. <Link href="/khoa-hoc" className="font-bold text-sky-600 underline">Chọn bài học</Link> để hệ thống tạo lộ trình riêng nhé!
                  </div>
                ) : (
                  <div className="space-y-2.5 sm:space-y-3">
                    {plan.map((t, i) => {
                      const m = KIND_META[t.kind];
                      const p = bestByLesson.get(t.lessonId) ?? 0;
                      return (
                        <div key={t.id ?? `${t.kind}-${t.lessonId}-${i}`} className={`flex items-center gap-2.5 rounded-2xl bg-gradient-to-r ${m.grad} p-2.5 ring-1 ${m.ring} sm:gap-3 sm:p-3`}>
                          <div className="w-12 shrink-0 text-center sm:w-14">
                            <div className={`mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ${m.ring} sm:h-12 sm:w-12`}><Ic name={m.icon} className="h-8 w-8 sm:h-9 sm:w-9" /></div>
                            <div className="mt-1 text-[10px] font-black leading-tight" style={{ color: m.color }}>{m.chip}</div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-slate-800 sm:text-base">{taskTitle(t)}</p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-slate-400">🕒 {m.minutes} phút</span>
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/70">
                                <div className="h-full rounded-full" style={{ width: `${Math.max(6, p)}%`, background: m.color }} />
                              </div>
                            </div>
                          </div>
                          <Link href={taskHref(t)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold text-white ${m.btn} sm:px-4`}>{doneOf(t) ? 'Học lại' : m.action}</Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Cột phải ── */}
              <div className="min-w-0 space-y-3 sm:space-y-4">
                {/* Vì sao hệ thống gợi ý như vậy */}
                <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">Vì sao hệ thống gợi ý như vậy? <Ic name="09_question_blue_circle" className="h-4 w-4" /></h3>
                  <ul className="grid grid-cols-4 gap-2 lg:grid-cols-1 lg:gap-2.5">
                    {FORMULA.map((f) => (
                      <li key={f.label} className="flex flex-col items-center gap-1 text-center lg:flex-row lg:gap-2.5 lg:text-left">
                        <MiniRing pct={f.pct} color={f.color} />
                        <span className="text-sm font-black text-slate-800 lg:w-9">{f.pct}%</span>
                        <div className="hidden h-2 flex-1 overflow-hidden rounded-full bg-slate-100 lg:block">
                          <div className="h-full rounded-full" style={{ width: `${(f.pct / 40) * 100}%`, background: f.color }} />
                        </div>
                        <span className="text-[10px] leading-tight text-slate-500 lg:w-[38%] lg:text-[11px]">{f.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Điểm tập trung hôm nay */}
                <div className="rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
                  <h3 className="mb-3 text-sm font-black text-slate-900">🎯 Điểm tập trung hôm nay</h3>
                  {hasFocus ? (
                    <div className="grid grid-cols-3 gap-2">
                      <FocusChip icon="10_star_green_circle" color="emerald" label="Điểm mạnh" value={strong} />
                      <FocusChip icon="11_arrow_up_orange" color="amber" label="Cần cải thiện" value={weak} />
                      <FocusChip icon="12_home_book_blue" color="blue" label="Đang học ở trường" value={learning} />
                    </div>
                  ) : (
                    <Link href="/khao-sat-dau-vao" className="block rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-3 text-center text-xs font-bold text-violet-700 ring-1 ring-violet-100 hover:brightness-95">
                      🧭 Làm khảo sát đầu vào để biết điểm mạnh &amp; điểm yếu của bé →
                    </Link>
                  )}
                </div>

                {/* Cố gắng thêm */}
                <div className="relative overflow-hidden rounded-[22px] p-4 shadow-sm ring-1 ring-violet-100 sm:p-5" style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)' }}>
                  <div className="flex items-center gap-3">
                    <KidIcon name="tigerRead" className="h-14 w-14 shrink-0" />
                    <div>
                      <h3 className="text-base font-black leading-tight text-violet-700">Cố gắng thêm chút nữa nhé!</h3>
                      <p className="mt-1 text-xs text-violet-500">Mỗi ngày tiến bộ một chút là rất giỏi rồi ⭐</p>
                    </div>
                  </div>
                </div>

                {/* Gợi ý thêm (ẩn trên mobile cho gọn) */}
                <div className="hidden rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:block">
                  <h3 className="mb-3 text-sm font-black text-slate-900">💡 Gợi ý thêm</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <SuggestBtn href="/on-tap-cau-sai" bg="bg-violet-50" ring="ring-violet-100" icon="13_book_purple" label="Ôn bài phù hợp" />
                    <SuggestBtn href="/khoa-hoc" bg="bg-emerald-50" ring="ring-emerald-100" icon="14_pencil_green" label="Luyện tập thêm" />
                    <SuggestBtn href="/tro-choi" bg="bg-amber-50" ring="ring-amber-100" icon="15_trophy_orange" label="Thử thách vui" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Dải: hệ thống tự điều chỉnh cho ngày mai ── */}
            <div className="mt-3 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:mt-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <Ic name="20_robot_assistant" className="h-10 w-10 shrink-0" />
                <h3 className="text-sm font-black text-slate-900 sm:text-base">Hệ thống sẽ tự điều chỉnh cho ngày mai</h3>
              </div>
              <div className="-mx-1 flex items-stretch gap-1.5 overflow-x-auto px-1 pb-1 sm:gap-2">
                {[
                  { n: 1, t: 'Hoàn thành bài học', icon: '16_clipboard_check_orange', bg: 'bg-blue-50', ring: 'ring-blue-100', c: '#2563eb' },
                  { n: 2, t: 'Phân tích kết quả', icon: '17_chart_growth_green', bg: 'bg-emerald-50', ring: 'ring-emerald-100', c: '#16a34a' },
                  { n: 3, t: 'Điều chỉnh độ khó', icon: '18_sliders_purple', bg: 'bg-violet-50', ring: 'ring-violet-100', c: '#7c3aed' },
                  { n: 4, t: 'Tạo kế hoạch mới', icon: '19_calendar_check_purple', bg: 'bg-amber-50', ring: 'ring-amber-100', c: '#f59e0b' },
                ].map((s, i, arr) => (
                  <div key={s.n} className="flex items-center gap-1.5 sm:flex-1">
                    <div className={`flex w-32 items-center gap-2 rounded-2xl ${s.bg} px-2.5 py-2.5 ring-1 ${s.ring} sm:w-auto sm:flex-1`}>
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-black text-white" style={{ background: s.c }}>{s.n}</span>
                      <Ic name={s.icon} className="hidden h-7 w-7 shrink-0 sm:block" />
                      <p className="text-[11px] font-bold leading-tight text-slate-700">{s.t}</p>
                    </div>
                    {i < arr.length - 1 && <span className="shrink-0 text-slate-300">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const r = 34, C = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#dcfce7" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(pct / 100) * C} ${C}`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <Ic name="02_clock_green_circle" className="h-8 w-8 sm:h-9 sm:w-9" />
      </div>
    </div>
  );
}

function MiniRing({ pct, color }: { pct: number; color: string }) {
  const r = 8, C = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 22 22" className="h-6 w-6 shrink-0 -rotate-90 lg:h-5 lg:w-5">
      <circle cx="11" cy="11" r={r} fill="none" stroke="#eef2f7" strokeWidth="3" />
      <circle cx="11" cy="11" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(pct / 100) * C} ${C}`} />
    </svg>
  );
}

const FOCUS_STYLE: Record<string, { bg: string; ring: string; text: string }> = {
  emerald: { bg: 'bg-emerald-50', ring: 'ring-emerald-100', text: 'text-emerald-700' },
  amber: { bg: 'bg-amber-50', ring: 'ring-amber-100', text: 'text-amber-700' },
  blue: { bg: 'bg-blue-50', ring: 'ring-blue-100', text: 'text-blue-700' },
};
function FocusChip({ icon, color, label, value }: { icon: string; color: string; label: string; value: string | null }) {
  const s = FOCUS_STYLE[color];
  return (
    <div className={`rounded-2xl ${s.bg} px-2 py-2.5 text-center ring-1 ${s.ring}`}>
      <Ic name={icon} className="mx-auto h-7 w-7" />
      <p className={`mt-1 text-[10px] font-bold ${s.text}`}>{label}</p>
      <p className="truncate text-xs font-black text-slate-700">{value || '—'}</p>
    </div>
  );
}

function SuggestBtn({ href, bg, ring, icon, label }: { href: string; bg: string; ring: string; icon: string; label: string }) {
  return (
    <Link href={href} className={`flex flex-col items-center gap-1 rounded-2xl ${bg} px-2 py-3 text-center ring-1 ${ring} transition hover:brightness-95`}>
      <Ic name={icon} className="h-8 w-8" />
      <span className="text-[11px] font-black leading-tight text-slate-700">{label}</span>
    </Link>
  );
}

function Kpi({ icon, color, value, unit, label, badge }: { icon: string; color: string; value: string; unit?: string; label: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:p-4">
      <Ic name={icon} className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
      <div className="min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black leading-none sm:text-2xl" style={{ color }}>{value}</span>
          {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
          {badge && <span className="text-sm">{badge}</span>}
        </div>
        <div className="mt-0.5 text-[11px] font-semibold leading-tight text-slate-500">{label}</div>
      </div>
    </div>
  );
}
