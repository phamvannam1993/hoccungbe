'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { listChildren, childStats, childStreak, childMastery, isGuest, setCurrentChildId, getCurrentChildId, type Child, type Stats, type Streak, type Mastery } from '../../lib/childData';

type Rec = { id: number; lessonId: number; reason?: string; status: string; lessonSlug?: string | null; lessonTitle?: string | null };

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

function fmtTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}p` : `${m}p`;
}

const LEVEL_LABEL = ['Mới bắt đầu', 'Đang học', 'Khá', 'Giỏi', 'Thành thạo'];
// Màu thanh tiến độ luân phiên theo kỹ năng.
// Gradient thanh tiến độ luân phiên theo kỹ năng (đẹp & phân biệt rõ).
const BAR_GRADIENTS = [
  'linear-gradient(90deg,#38bdf8,#0ea5e9)',
  'linear-gradient(90deg,#a78bfa,#7c3aed)',
  'linear-gradient(90deg,#fb7185,#e11d48)',
  'linear-gradient(90deg,#34d399,#059669)',
  'linear-gradient(90deg,#fbbf24,#d97706)',
  'linear-gradient(90deg,#22d3ee,#0891b2)',
];

export default function ProgressPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [mastery, setMastery] = useState<Mastery[]>([]);
  const [recs, setRecs] = useState<Rec[]>([]);

  // Danh sách bé (đăng nhập: từ server; khách: từ localStorage)
  useEffect(() => {
    (async () => {
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
    const [s, st, m, r] = await Promise.all([
      safe(childStats(id), null),
      safe(childStreak(id), null),
      safe(childMastery(id), []),
      // Gợi ý chỉ có khi đăng nhập (khách chưa có lộ trình cá nhân hóa).
      isGuest() ? Promise.resolve<Rec[]>([]) : safe(apiFetch<Rec[]>(`/recommendations/${id}`), []),
    ]);
    setStats(s);
    setStreak(st);
    setMastery(Array.isArray(m) ? m : []);
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
  // Chỉ hiện kỹ năng bé đã luyện (có tiến độ > 0) — tránh liệt kê 10 kỹ năng 0%.
  const practiced = mastery.filter((m) => m.masteryPercent > 0).sort((a, b) => b.masteryPercent - a.masteryPercent);
  const pendingRecs = recs.filter((r) => r.status === 'pending');

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      {/* Hero */}
      <div
        className="relative mb-8 flex flex-col gap-5 overflow-hidden rounded-[36px] p-6 text-white shadow-xl lg:flex-row lg:items-center lg:justify-between lg:p-9"
        style={{ background: 'radial-gradient(120% 140% at 100% 0%, #1e3a5f 0%, #0f172a 55%)' }}
      >
        {/* đốm trang trí */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Bảng theo dõi phụ huynh</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Tiến độ học tập của bé</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Số liệu cập nhật theo thời gian thực từ các bài bé đã làm — môn nào đang mạnh, môn nào cần luyện thêm.
          </p>
        </div>
        {children.length > 1 && (
          <div className="relative shrink-0">
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-sky-200/90">Đang xem bé</label>
            <div className="relative">
              <select
                value={childId ?? ''}
                onChange={(e) => selectChild(Number(e.target.value))}
                className="w-full cursor-pointer appearance-none rounded-2xl bg-white py-3 pl-4 pr-10 text-sm font-black text-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-sky-400 sm:w-52"
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id} className="text-slate-900">
                    {c.fullName}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="py-16 text-center text-slate-400">Đang tải…</p>
      ) : children.length === 0 ? (
        // Chưa đăng nhập / chưa có hồ sơ bé
        <div className="rounded-[30px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
          <p className="text-5xl">👶</p>
          <h2 className="mt-4 text-2xl font-black text-slate-900">Chưa có hồ sơ bé</h2>
          <p className="mt-2 text-slate-500">Đăng nhập và tạo hồ sơ để bắt đầu ghi lại tiến độ học tập của bé.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dang-nhap" className="rounded-full bg-[#c0392b] px-6 py-3 text-sm font-bold text-white hover:bg-[#a93226]">
              Đăng nhập
            </Link>
            <Link href="/ho-so-be" className="rounded-full bg-slate-100 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">
              Tạo hồ sơ bé
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Thẻ chỉ số tổng quan */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            <StatCard label="Bài đã làm" value={stats?.totalAttempts ?? 0} icon="✏️" accent="#0ea5e9" />
            <StatCard label="Độ chính xác" value={`${Math.round(stats?.accuracy ?? 0)}%`} icon="🎯" accent="#10b981" />
            <StatCard label="Bài hoàn thành" value={stats?.lessonsCompleted ?? 0} icon="🏅" accent="#8b5cf6" />
            <StatCard label="Thời gian học" value={fmtTime(stats?.totalTimeSec ?? 0)} icon="⏱️" accent="#f59e0b" />
            <StatCard label="Chuỗi ngày" value={streak?.currentStreak ?? 0} icon="🔥" accent="#f43f5e" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            {/* Tiến độ theo kỹ năng */}
            <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Tiến độ theo kỹ năng</h2>
                {currentChild && (
                  <span className="flex items-center gap-2 rounded-full bg-slate-50 py-1 pl-1 pr-3 text-sm font-semibold text-slate-500 ring-1 ring-slate-100">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white">
                      {currentChild.fullName.trim().slice(-1).toUpperCase()}
                    </span>
                    {currentChild.fullName}
                  </span>
                )}
              </div>

              {dataLoading ? (
                <p className="mt-8 text-sm text-slate-400">Đang tải…</p>
              ) : practiced.length === 0 ? (
                <div className="mt-8 rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 ring-1 ring-slate-100">
                  Bé chưa luyện kỹ năng nào. Hãy chọn một bài học và làm thử để bắt đầu ghi tiến độ nhé!
                  <div className="mt-4">
                    <Link href="/khoa-hoc" className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700">
                      Chọn bài học
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  {practiced.map((m, i) => {
                    const pct = Math.round(m.masteryPercent);
                    const grad = BAR_GRADIENTS[i % BAR_GRADIENTS.length];
                    return (
                      <div key={m.skillId}>
                        <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                          <span className="font-bold text-slate-700">{m.skill?.name ?? `Kỹ năng #${m.skillId}`}</span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                              {LEVEL_LABEL[Math.min(m.level, 4)]}
                            </span>
                            <span className="w-9 text-right font-black text-slate-800">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-3.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full transition-[width] duration-700 ease-out"
                            style={{ width: `${pct}%`, background: grad }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Gợi ý học tiếp */}
            <div className="space-y-6">
              <div className="rounded-[30px] bg-amber-50 p-6 shadow-sm ring-1 ring-amber-100">
                <h3 className="text-2xl font-black tracking-tight text-amber-950">Gợi ý học tiếp</h3>
                {pendingRecs.length === 0 ? (
                  <p className="mt-4 text-sm leading-8 text-amber-900">
                    Chưa có gợi ý riêng. Bé cứ luyện đều mỗi ngày, hệ thống sẽ đề xuất bài phù hợp dựa trên kết quả thực tế.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {pendingRecs.slice(0, 4).map((r) => (
                      <Link
                        key={r.id}
                        href={r.lessonSlug ? `/${r.lessonSlug}` : `/lessons/${r.lessonId}`}
                        className="block rounded-2xl bg-white px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-100 transition hover:ring-amber-300"
                      >
                        <span className="block font-semibold">{r.lessonTitle ?? r.reason ?? 'Bài luyện đề xuất'}</span>
                        {r.lessonTitle && r.reason && <span className="block text-xs text-amber-500">{r.reason}</span>}
                        <span className="mt-0.5 block text-xs font-bold text-amber-600">→ Học ngay</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-lg font-black tracking-tight text-slate-900">Xem thêm</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-semibold">
                  <Link href="/dashboard" className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 ring-1 ring-slate-100 hover:bg-slate-100">📊 Bảng chi tiết</Link>
                  <Link href="/on-tap-cau-sai" className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 ring-1 ring-slate-100 hover:bg-slate-100">🔁 Ôn câu sai</Link>
                  <Link href="/chung-nhan" className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 ring-1 ring-slate-100 hover:bg-slate-100">🏆 Chứng nhận</Link>
                  <Link href="/ho-so-be" className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700 ring-1 ring-slate-100 hover:bg-slate-100">👶 Hồ sơ bé</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: string; accent: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl"
        style={{ background: `${accent}1f`, boxShadow: `inset 0 0 0 1px ${accent}33` }}
      >
        <span>{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-black leading-none text-slate-900">{value}</div>
      <div className="mt-1.5 text-xs font-semibold text-slate-400">{label}</div>
    </div>
  );
}
