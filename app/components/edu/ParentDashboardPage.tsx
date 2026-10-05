'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { listChildren, childStats, childStreak, childMastery, childHistory, isGuest, setCurrentChildId, getCurrentChildId, type Child, type Stats, type Streak, type Mastery, type HistoryItem } from '../../lib/childData';

type Rec = { id: number; lessonId: number; reason?: string; status: string; lessonSlug?: string | null; lessonTitle?: string | null };
type ChildBadge = { id: number; earnedAt: string; badge?: { name?: string; icon?: string } };
type QuestRow = { quest: { name: string; target: number }; progress: number; completed: boolean; claimed: boolean };
type Attempt = HistoryItem;
type Report = { weekStart: string; stats: Record<string, unknown> };

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

const LEVEL_LABEL = ['Mới', 'Đang học', 'Khá', 'Giỏi', 'Thành thạo'];

export default function ParentDashboardPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [childId, setChildId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [guest, setGuest] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [mastery, setMastery] = useState<Mastery[]>([]);
  const [badges, setBadges] = useState<ChildBadge[]>([]);
  const [quests, setQuests] = useState<QuestRow[]>([]);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [report, setReport] = useState<Report | null>(null);

  // Lấy danh sách bé (đăng nhập: server; khách: localStorage)
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

  // Tải toàn bộ dữ liệu cho bé đang chọn
  const loadChild = useCallback(async (id: number) => {
    setDataLoading(true);
    const guest = isGuest();
    const emptyArr = <T,>() => Promise.resolve<T[]>([]);
    const [s, st, r, m, b, q, h, rep] = await Promise.all([
      safe(childStats(id), null),
      safe(childStreak(id), null),
      // Các mục cá nhân hóa / thành tích chỉ có khi ĐĂNG NHẬP.
      guest ? emptyArr<Rec>() : safe(apiFetch<Rec[]>(`/recommendations/${id}`), []),
      safe(childMastery(id), []),
      guest ? emptyArr<ChildBadge>() : safe(apiFetch<ChildBadge[]>(`/gamification/child/${id}/badges`), []),
      guest ? emptyArr<QuestRow>() : safe(apiFetch<QuestRow[]>(`/gamification/child/${id}/quests`), []),
      safe(childHistory(id), []),
      guest ? emptyArr<Report>() : safe(apiFetch<Report[]>(`/reports/weekly/child/${id}`), []),
    ]);
    setStats(s);
    setStreak(st);
    setRecs(Array.isArray(r) ? r : []);
    setMastery(Array.isArray(m) ? m : []);
    setBadges(Array.isArray(b) ? b : []);
    setQuests(Array.isArray(q) ? q : []);
    setHistory(Array.isArray(h) ? h : []);
    setReport(Array.isArray(rep) && rep.length ? rep[0] : null);
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (childId != null) loadChild(childId);
  }, [childId, loadChild]);

  async function generateReport() {
    if (childId == null) return;
    await safe(apiFetch('/reports/weekly/generate', { method: 'POST', body: JSON.stringify({ childId }) }), null);
    loadChild(childId);
  }

  if (loading) {
    return <section className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">Đang tải bảng theo dõi…</section>;
  }

  const summary = [
    { title: 'Chuỗi ngày học', value: `${streak?.currentStreak ?? 0} 🔥`, sub: `Dài nhất: ${streak?.longestStreak ?? 0} ngày` },
    { title: 'Bài học hoàn thành', value: `${stats?.lessonsCompleted ?? 0}`, sub: `${stats?.totalAttempts ?? 0} lượt làm bài` },
    { title: 'Độ chính xác', value: `${stats?.accuracy ?? 0}%`, sub: `Điểm TB ${stats?.avgScore ?? 0}` },
    { title: 'Thời gian học', value: fmtTime(stats?.totalTimeSec ?? 0), sub: `${stats?.totalCorrect ?? 0}/${stats?.totalQuestions ?? 0} câu đúng` },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-xl lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">Bảng theo dõi phụ huynh</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Hành trình học tập của bé</h1>
          </div>
          {children.length > 0 && (
            <select
              value={childId ?? ''}
              onChange={(e) => {
                const id = Number(e.target.value);
                setChildId(id);
                localStorage.setItem('bhh_child_id', String(id));
              }}
              className="cursor-pointer rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-900">
                  👶 {c.fullName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {apiError && (
        <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-100">
          Chưa có hồ sơ bé. <Link href="/ho-so-be" className="font-bold underline">Tạo hồ sơ bé</Link> để bắt đầu theo dõi tiến độ
          {guest ? ' (chế độ khách — dữ liệu lưu trên trình duyệt này).' : '.'}
        </div>
      )}
      {guest && !apiError && (
        <div className="mt-6 rounded-2xl bg-sky-50 p-3 text-center text-xs font-medium text-sky-700 ring-1 ring-sky-100">
          👋 Chế độ khách — dữ liệu học lưu trên trình duyệt này. <Link href="/dang-nhap" className="font-bold underline">Đăng nhập</Link> để đồng bộ & mở khóa huy hiệu, nhiệm vụ, báo cáo tuần.
        </div>
      )}

      {/* Summary cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((card) => (
          <div key={card.title} className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-semibold text-slate-500">{card.title}</p>
            <div className="mt-3 text-3xl font-black tracking-tight text-slate-900">{card.value}</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Truy cập nhanh */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/ho-so-be" className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100 hover:bg-violet-100">👶 Hồ sơ bé</Link>
        <Link href="/on-tap-cau-sai" className="rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100">🔁 Ôn lại câu sai</Link>
        <Link href="/chung-nhan" className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100 hover:bg-amber-100">🏆 Chứng nhận</Link>
        <Link href="/tro-choi" className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100">🎮 Kho trò chơi</Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          {/* Kỹ năng (mastery thật) */}
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Mức thành thạo kỹ năng</h2>
            <div className="mt-6 space-y-5">
              {mastery.length === 0 && <p className="text-sm text-slate-400">Chưa có dữ liệu kỹ năng. Cho bé làm vài bài để bắt đầu theo dõi.</p>}
              {mastery.slice(0, 8).map((item) => (
                <div key={item.skillId}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
                    <span>{item.skill?.name ?? `Kỹ năng #${item.skillId}`} <span className="text-xs font-normal text-slate-400">· {LEVEL_LABEL[item.level] ?? ''}</span></span>
                    <span>{Number(item.masteryPercent)}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-500" style={{ width: `${Number(item.masteryPercent)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lịch sử làm bài */}
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Bài làm gần đây</h2>
            <div className="mt-5 space-y-3">
              {history.length === 0 && <p className="text-sm text-slate-400">Chưa có bài làm nào.</p>}
              {history.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                  <span className="text-sm text-slate-600">Bài #{a.lessonId} · {a.correctCount}/{a.totalQuestions} câu</span>
                  <span className={`text-sm font-bold ${Number(a.score) >= 50 ? 'text-emerald-600' : 'text-rose-500'}`}>{Number(a.score)}đ</span>
                </div>
              ))}
            </div>
            <Link href="/tien-do" className="mt-4 inline-block text-sm font-bold text-sky-600 hover:text-sky-700">Xem báo cáo chi tiết →</Link>
          </div>
        </div>

        <div className="space-y-6">
          {/* Gợi ý hôm nay */}
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Gợi ý hôm nay</h3>
            <div className="mt-5 space-y-3">
              {recs.length === 0 && <p className="text-sm text-slate-400">Chưa có gợi ý.</p>}
              {recs.map((r, i) => (
                <div key={r.id} className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">{i + 1}</div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">{r.lessonTitle ?? r.reason ?? 'Bài gợi ý'}</p>
                    {r.lessonTitle && r.reason && <p className="text-xs text-slate-400">{r.reason}</p>}
                    <Link href={r.lessonSlug ? `/${r.lessonSlug}` : `/lessons/${r.lessonId}`} className="mt-0.5 inline-block text-xs font-bold text-sky-600 hover:text-sky-700">
                      Cho bé học ngay →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Huy hiệu */}
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Huy hiệu ({badges.length})</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {badges.length === 0 && <p className="text-sm text-slate-400">Chưa có huy hiệu.</p>}
              {badges.map((b) => (
                <div key={b.id} className="flex flex-col items-center rounded-2xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100" title={b.badge?.name}>
                  <span className="text-2xl">{b.badge?.icon ?? '🏅'}</span>
                  <span className="mt-1 text-[11px] font-bold text-amber-700">{b.badge?.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nhiệm vụ */}
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Nhiệm vụ</h3>
            <div className="mt-4 space-y-4">
              {quests.length === 0 && <p className="text-sm text-slate-400">Chưa có nhiệm vụ.</p>}
              {quests.map((q, i) => (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{q.quest.name} {q.completed && '✅'}</span>
                    <span>{Math.min(q.progress, q.quest.target)}/{q.quest.target}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (q.progress / q.quest.target) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Báo cáo tuần */}
          <div className="rounded-[30px] bg-sky-50 p-6 shadow-sm ring-1 ring-sky-100 lg:p-7">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">Báo cáo tuần</h3>
            {report ? (
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Tuần {report.weekStart}: {String(report.stats?.attemptsCount ?? 0)} bài, điểm TB {String(report.stats?.avgScore ?? 0)}, {String(report.stats?.totalTimeMinutes ?? 0)} phút học.
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Chưa có báo cáo tuần này.</p>
            )}
            <button onClick={generateReport} className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5">
              Tạo/cập nhật báo cáo tuần
            </button>
          </div>
        </div>
      </div>

      {dataLoading && <p className="mt-6 text-center text-sm text-slate-400">Đang cập nhật dữ liệu của bé…</p>}
    </section>
  );
}
