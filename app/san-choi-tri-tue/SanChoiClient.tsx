'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ThiQ } from '../lib/thiTai';
import {
  DAILY_COUNT, DAILY_STARS, SAN_CHOI_SUBJECT, buildDailyChallenge, bestSanChoiBadge, capRun, childKey, dayKey,
  getNick, getSanChoi, recordRun, sanChoiStreak, setNick, type SanChoiState,
} from '../lib/sanChoi';
import PlayModal from './PlayModal';
import { addStars, getStarState } from '../lib/stars';
import { childHistory, childStreak, getCurrentChildId, listChildren, subjectInfo, type Child } from '../lib/childData';
import { BADGES, isEarned } from '../lib/achievements';
import { COLLECTIBLES, getOwned } from '../lib/collection';
import { apiFetch } from '../lib/api';
import FramedAvatar from '../components/edu/FramedAvatar';
import { ChildAvatar, childAvatar } from '../components/edu/KidIcon';

type Row = { name: string; score: number; rank: number; avatar?: string | null };
type Period = 'week' | 'month' | 'all';
type BadgeView = { emoji: string; title: string; date?: string };

const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Tuần này' },
  { key: 'month', label: 'Tháng này' },
  { key: 'all', label: 'Mọi thời gian' },
];

// Bốn khu chơi chính (hàng thẻ màu). Phase 1 trỏ sang trang/game đã có.
const ZONES = [
  { emoji: '🧠', title: 'Thử thách IQ', desc: 'Mỗi ngày 10 câu mới · Từ dễ đến khó', href: '/thu-thach-iq', from: '#B794F6', to: '#7C3AED', dark: '#5B21B6' },
  { emoji: '🔍', title: 'Nhìn hình đoán chữ', desc: 'Đoán từ qua hình ảnh · Ghép chữ có dấu', href: '/tro-choi/nhin-hinh-doan-chu', from: '#6EE7A0', to: '#16A34A', dark: '#15803D' },
  { emoji: '🌍', title: 'Khám phá thế giới', desc: 'Vạn câu hỏi thú vị về khoa học, đời sống', href: '/kham-pha', from: '#FDBA74', to: '#F97316', dark: '#C2410C' },
  { emoji: '🔤', title: 'Sân chơi ngôn ngữ', desc: 'Nối từ, tìm từ, ghép chữ', href: '/tro-choi/tieng-viet', from: '#7DD3FC', to: '#2563EB', dark: '#1E40AF' },
];

const FEATURED = [
  { emoji: '🧮', title: 'Toán Tư Duy', href: '/toan-tu-duy', bg: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)', c: '#6D28D9' },
  { emoji: '🔤', title: 'Ghép Chữ', href: '/tro-choi/ghep-chu-thanh-van', bg: 'linear-gradient(135deg,#DCFCE7,#BBF7D0)', c: '#15803D' },
  { emoji: '🧩', title: 'Ghép Hình', href: '/tro-choi/ghep-hinh-rung', bg: 'linear-gradient(135deg,#FFEDD5,#FED7AA)', c: '#C2410C' },
  { emoji: '🔠', title: 'Tìm Từ', href: '/tro-choi/tim-tu', bg: 'linear-gradient(135deg,#E0F2FE,#BAE6FD)', c: '#0369A1' },
];

const MEDAL = ['🥇', '🥈', '🥉'];
const fmt = (n: number) => n.toLocaleString('vi-VN');
const fmtDate = (d: string) => d.split('-').reverse().join('/');
// Băm tên → số, để chọn ảnh mặc định ổn định cho mỗi biệt danh trên bảng xếp hạng.
function hashN(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

// API cũ không biết subject 'san-choi' / grade 0 và trả về bảng Thi Tài (Toán lớp 1).
// Gặp bản đó thì coi như chưa hỗ trợ: không hiện bảng sai, không gửi điểm lẫn vào Thi Tài.
let apiSupported: boolean | null = null;
async function fetchBoard(period: Period, limit = 20): Promise<Row[]> {
  const d = await apiFetch<{ period?: string; subject?: string; rows?: Row[] }>(
    `/challenges/leaderboard?subject=${SAN_CHOI_SUBJECT}&grade=0&period=${period}&limit=${limit}`,
  );
  if (d?.subject && d.subject !== SAN_CHOI_SUBJECT) { apiSupported = false; throw new Error('unsupported'); }
  apiSupported = true;
  return Array.isArray(d?.rows) ? d.rows : [];
}

export default function SanChoiClient() {
  const [child, setChild] = useState<Child | null>(null);
  const [grade, setGrade] = useState(2);
  const [nick, setNickState] = useState('');
  const [sc, setSc] = useState<SanChoiState | null>(null);
  const [learnStreak, setLearnStreak] = useState(0);
  const [generalBadge, setGeneralBadge] = useState<BadgeView | null>(null);

  const [period, setPeriod] = useState<Period>('week');
  const [rows, setRows] = useState<Row[]>([]);
  // Kỳ + lượt tải mà `rows` đang phản ánh; khác kỳ đang chọn nghĩa là đang tải.
  const [loadedFor, setLoadedFor] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [weekRows, setWeekRows] = useState<Row[]>([]);
  const [boardTick, setBoardTick] = useState(0);

  const [questions, setQuestions] = useState<ThiQ[] | null>(null);

  const childId = child?.id || 0;
  const key = childKey(childId);
  const myName = (child ? child.nickname || child.fullName : nick) || '';
  const today = sc?.days[dayKey()] || null;

  // Bé đang chọn (nếu có) + dữ liệu local.
  useEffect(() => {
    let alive = true;
    (async () => {
      setNickState(getNick());
      setSc(getSanChoi(childKey(getCurrentChildId())));
      try {
        const kids = await listChildren();
        const id = getCurrentChildId();
        const me = kids.find((k) => k.id === id) || kids[0];
        if (!alive || !me) return;
        setChild(me);
        setSc(getSanChoi(childKey(me.id)));
        const g = parseInt(String(me.currentLevel || '').replace(/\D/g, ''), 10);
        if (g >= 1 && g <= 5) setGrade(g);
        const [streak, hist] = await Promise.all([
          childStreak(me.id).catch(() => null),
          childHistory(me.id, 300).catch(() => []),
        ]);
        if (!alive) return;
        setLearnStreak(streak?.currentStreak || 0);
        // Huy hiệu chung (app/lib/achievements.ts) — dùng khi bé chưa có huy hiệu Sân chơi.
        const owned = getOwned(me.id);
        const ctx = {
          lessons: hist.length,
          perfect: hist.filter((h) => (h.score || 0) >= 100).length,
          subjects: new Set(hist.map((h) => subjectInfo(h.courseType).name)).size,
          currentStreak: streak?.currentStreak || 0,
          longestStreak: streak?.longestStreak || 0,
          totalActiveDays: streak?.totalActiveDays || 0,
          starsEarned: getStarState(me.id).earned,
          petsOwned: COLLECTIBLES.filter((i) => i.category === 'pet' && owned.includes(i.id)).length,
          itemsOwned: owned.length,
          itemsTotal: COLLECTIBLES.length,
        };
        const earned = BADGES.filter((b) => isEarned(b, ctx));
        const top = earned[earned.length - 1];
        if (top) setGeneralBadge({ emoji: top.emoji, title: top.title });
      } catch { /* khách chưa có hồ sơ */ }
    })();
    return () => { alive = false; };
  }, []);

  // Bảng xếp hạng theo kỳ đang chọn.
  const boardFor = `${period}|${boardTick}`;
  const boardLoading = loadedFor !== boardFor;
  useEffect(() => {
    let alive = true;
    fetchBoard(period)
      .then((r) => { if (alive) { setRows(r); if (period === 'week') setWeekRows(r); } })
      .catch(() => { if (alive) setRows([]); })
      .finally(() => { if (alive) setLoadedFor(`${period}|${boardTick}`); });
    return () => { alive = false; };
  }, [period, boardTick]);

  // Hạng tuần cho ô Thành tích (khi đang xem tab khác vẫn cần).
  useEffect(() => {
    if (period === 'week') return;
    fetchBoard('week').then(setWeekRows).catch(() => setWeekRows([]));
  }, [period, boardTick]);

  const openChallenge = () => {
    setQuestions(buildDailyChallenge(dayKey(), grade));
  };

  // Gọi khi bé làm xong 10 câu. Chỉ lượt đầu trong ngày được điểm + sao + lên bảng.
  const handleFinish = useCallback((score: number, correct: number, timeSec: number, name: string): ReactNode => {
    const res = recordRun(key, score, correct);
    setSc(res.state);
    let stars = 0;
    const submitted = res.first && apiSupported !== false;
    if (res.first) {
      if (childId) { addStars(childId, DAILY_STARS); stars = DAILY_STARS; }
      if (submitted) apiFetch('/challenges/submit', {
        method: 'POST',
        body: JSON.stringify({ name: name || 'Bé', score: capRun(score), grade: 0, subject: SAN_CHOI_SUBJECT, time: timeSec, avatar: childAvatar(child) }),
      })
        .then(() => setBoardTick((t) => t + 1))
        .catch(() => {});
    }
    return (
      <>
        {res.first ? (
          stars > 0 ? (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-base font-black text-amber-600">⭐ +{stars} sao đã vào ví của bé!</p>
          ) : (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
              {submitted ? 'Điểm đã lên bảng xếp hạng!' : 'Điểm hôm nay đã được lưu!'} <Link href="/ho-so-be" className="font-black underline">Tạo hồ sơ bé</Link> để cất ⭐ sao vào ví nhé.
            </p>
          )
        ) : (
          <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500">
            Lượt luyện tập — hôm nay bé đã nhận sao rồi. Mai quay lại với 10 câu mới nhé!
          </p>
        )}
        {res.newBadges.length > 0 && (
          <div className="mt-3 rounded-2xl bg-violet-50 px-4 py-2 text-sm font-black text-violet-700">
            Huy hiệu mới: {res.newBadges.map((b) => `${b.emoji} ${b.title}`).join(' · ')}
          </div>
        )}
      </>
    );
  }, [key, childId, child]);

  const myWeek = myName ? weekRows.find((r) => r.name === myName) : undefined;
  const totalPoints = Math.max(sc?.total || 0, myWeek?.score || 0);
  const streak = Math.max(learnStreak, sc ? sanChoiStreak(sc) : 0);
  const scBadge = sc ? bestSanChoiBadge(sc) : null;
  const badge: BadgeView | null = scBadge
    ? { emoji: scBadge.badge.emoji, title: scBadge.badge.title, date: scBadge.date }
    : generalBadge;
  const shown = showAll ? rows : rows.slice(0, 5);

  return (
    <>
      {/* ═══ HÀNG 1: Hero + Thử thách hôm nay ═══ */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <section
          className="relative overflow-hidden rounded-[28px] p-5 text-white sm:p-7"
          style={{
            background: 'radial-gradient(120% 120% at 0% 0%, #7C5CFF 0%, #5B3BE8 40%, #2F6BFF 100%)',
            boxShadow: '0 8px 0 #2b1fa8, 0 18px 34px rgba(60,40,200,.28)',
          }}
        >
          <Image src="/assets/images/10-confetti-curves.webp" alt="" width={416} height={93} aria-hidden
            className="pointer-events-none absolute right-4 top-2 w-40 opacity-70 sm:w-56" />
          <Image src="/assets/images/11-confetti-diamonds.webp" alt="" width={380} height={75} aria-hidden
            className="pointer-events-none absolute bottom-3 right-36 hidden w-48 opacity-70 sm:block" />
          <div className="relative z-10 max-w-[62%] sm:max-w-[60%]">
            <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#FFE27A]">
              🏟️ Đấu trường kiến thức
            </p>
            <h1 className="kid-display mt-2 text-3xl font-black leading-tight sm:text-5xl" style={{ textShadow: '0 3px 0 rgba(30,20,120,.45)' }}>
              Sân chơi Trí tuệ
            </h1>
            <p className="kid-display mt-1 text-lg font-extrabold text-[#FFE27A] sm:text-2xl">Học mà vui · Chơi mà giỏi!</p>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs font-black sm:text-sm">
              <li className="rounded-full bg-white/15 px-3 py-1.5">🗓️ 10 câu mới mỗi ngày</li>
              <li className="rounded-full bg-white/15 px-3 py-1.5">⭐ Nhận sao thưởng</li>
              <li className="rounded-full bg-white/15 px-3 py-1.5">🏆 Đua bảng xếp hạng</li>
            </ul>
          </div>
          <Image src="/assets/images/05-trophy-cup.webp" alt="" width={284} height={254} aria-hidden
            className="pointer-events-none absolute bottom-3 right-[30%] hidden w-20 drop-shadow-lg md:block" />
          <Image src="/assets/images/01-mascot-tiger-trophy.webp" alt="Bạn hổ ôm cúp vô địch" width={388} height={420} priority
            className="pointer-events-none absolute -bottom-2 right-1 w-[38%] max-w-[210px] drop-shadow-xl sm:right-4" />
        </section>

        <section className="flex flex-col rounded-[28px] border-4 border-orange-200 bg-white p-5"
          style={{ boxShadow: '0 6px 0 #fdba74, 0 14px 28px rgba(249,115,22,.15)' }}>
          <h2 className="kid-display text-xl font-black text-slate-800">🎯 Thử thách hôm nay</h2>
          {today ? (
            <p className="mt-2 text-sm font-bold text-slate-600">
              ✅ Bé đã hoàn thành hôm nay: <b className="text-orange-600">{today.correct}/{DAILY_COUNT} câu · {fmt(today.score)} điểm</b>.
              Chơi lại để luyện tập, mai có 10 câu mới nhé!
            </p>
          ) : (
            <p className="mt-2 text-sm font-bold text-slate-600">
              Hoàn thành <b>10 câu hỏi</b> để nhận ngay <b className="text-amber-500">⭐ +{DAILY_STARS} sao</b>
            </p>
          )}
          <div className="my-3 flex items-center justify-center gap-3">
            <Image src="/assets/images/12-star-set.webp" alt="" width={382} height={87} aria-hidden className="w-44" />
          </div>
          <div className="mb-3 flex justify-center gap-1.5" aria-label={today ? 'Đã xong 10/10 câu' : 'Chưa làm câu nào'}>
            {Array.from({ length: DAILY_COUNT }, (_, i) => (
              <span key={i} className={`h-2.5 w-2.5 rounded-full ${today ? 'bg-orange-400' : 'bg-orange-100'}`} />
            ))}
          </div>
          <button type="button" onClick={openChallenge}
            className="kid-btn-3d mt-auto w-full text-lg"
            style={{ background: 'linear-gradient(180deg,#FFB547,#F97316)', boxShadow: '0 4px 0 #C2410C' }}>
            {today ? 'Chơi lại luyện tập ▶' : 'Bắt đầu ngay ▶'}
          </button>
        </section>
      </div>

      {/* ═══ HÀNG 2: 4 khu chơi ═══ */}
      <div className="mt-5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {ZONES.map((z) => (
          <Link key={z.href} href={z.href}
            className="group flex flex-col rounded-[24px] p-4 text-white transition hover:-translate-y-1"
            style={{ background: `linear-gradient(160deg, ${z.from}, ${z.to})`, boxShadow: `0 6px 0 ${z.dark}, 0 12px 22px ${z.to}40` }}>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/25 text-3xl" aria-hidden>{z.emoji}</span>
            <span className="kid-display mt-3 text-lg font-black leading-tight">{z.title}</span>
            <span className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] font-bold leading-snug text-white/90">{z.desc}</span>
            <span className="kid-display mt-3 self-start rounded-full bg-white px-4 py-1.5 text-sm font-black transition group-hover:scale-105"
              style={{ color: z.dark, boxShadow: `0 3px 0 ${z.dark}55` }}>
              Chơi ngay ▶
            </span>
          </Link>
        ))}
      </div>

      {/* ═══ HÀNG 3: Bảng xếp hạng · Trò chơi nổi bật · Thành tích ═══ */}
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        {/* Bảng xếp hạng */}
        <section className="rounded-[24px] border-4 border-violet-100 bg-white p-4 md:col-span-2 lg:col-span-1"
          style={{ boxShadow: '0 5px 0 #ddd6fe' }}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="kid-display text-lg font-black text-slate-800">🏆 Bảng xếp hạng</h2>
            {rows.length > 5 && (
              <button type="button" onClick={() => setShowAll((v) => !v)} className="text-sm font-black text-violet-600 hover:underline">
                {showAll ? 'Thu gọn ↑' : 'Xem tất cả →'}
              </button>
            )}
          </div>
          <div role="tablist" aria-label="Kỳ xếp hạng" className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-violet-50 p-1">
            {PERIODS.map((p) => (
              <button key={p.key} type="button" role="tab" aria-selected={period === p.key}
                onClick={() => { setPeriod(p.key); setShowAll(false); }}
                className={`rounded-full px-2 py-1.5 text-xs font-black transition sm:text-sm ${period === p.key ? 'bg-violet-600 text-white shadow' : 'text-violet-500 hover:bg-white'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <ol className="mt-3 space-y-1.5">
            {boardLoading && Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="h-11 animate-pulse rounded-2xl bg-slate-100" />
            ))}
            {!boardLoading && rows.length === 0 && (
              <li className="rounded-2xl bg-violet-50 px-4 py-6 text-center text-sm font-bold text-violet-500">
                Chưa có ai trên bảng — hãy là người đầu tiên! 🚀
              </li>
            )}
            {!boardLoading && shown.map((r) => {
              const mine = !!myName && r.name === myName;
              return (
                <li key={`${r.rank}-${r.name}`}
                  className={`flex items-center gap-2.5 rounded-2xl px-2.5 py-1.5 ${mine ? 'border-2 border-amber-300 bg-amber-50' : 'bg-slate-50'}`}>
                  <span className="w-7 shrink-0 text-center text-lg font-black text-slate-500">{r.rank <= 3 ? MEDAL[r.rank - 1] : r.rank}</span>
                  {mine && child
                    ? <FramedAvatar child={child} className="h-8 w-8" />
                    : <ChildAvatar child={{ id: hashN(r.name), avatarUrl: r.avatar || undefined }} className="h-8 w-8" />}
                  <span className={`min-w-0 flex-1 truncate text-sm font-black ${mine ? 'text-amber-700' : 'text-slate-700'}`}>
                    {r.name}{mine && ' (bé)'}
                  </span>
                  <span className="shrink-0 text-sm font-black text-violet-600">{fmt(r.score)} điểm</span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Trò chơi nổi bật */}
        <section className="rounded-[24px] border-4 border-amber-100 bg-white p-4" style={{ boxShadow: '0 5px 0 #fde68a' }}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="kid-display text-lg font-black text-slate-800">⭐ Các trò chơi nổi bật</h2>
            <Link href="/tro-choi" className="shrink-0 text-sm font-black text-amber-600 hover:underline">Xem tất cả →</Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {FEATURED.map((g) => (
              <Link key={g.href} href={g.href}
                className="flex aspect-[5/4] flex-col items-center justify-center rounded-2xl p-2 text-center transition hover:-translate-y-0.5"
                style={{ background: g.bg, boxShadow: `0 3px 0 ${g.c}44` }}>
                <span className="text-4xl" aria-hidden>{g.emoji}</span>
                <span className="kid-display mt-1 text-sm font-black" style={{ color: g.c }}>{g.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Thành tích của bạn */}
        <section className="flex flex-col rounded-[24px] border-4 border-sky-100 bg-white p-4" style={{ boxShadow: '0 5px 0 #bae6fd' }}>
          <h2 className="kid-display text-lg font-black text-slate-800">🎖️ Thành tích của bạn</h2>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 p-3">
            <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full text-3xl ${badge ? '' : 'grayscale'}`}
              style={{ background: 'radial-gradient(circle at 35% 30%, #FFF6C8, #FFC93C 60%, #E59A00)', boxShadow: '0 3px 0 #B97800, inset 0 -3px 0 rgba(0,0,0,.08)' }}
              aria-hidden>
              {badge?.emoji || '🎖️'}
            </span>
            <div className="min-w-0">
              <p className="kid-display truncate text-base font-black text-slate-800">{badge ? badge.title : 'Chưa có huy hiệu'}</p>
              <p className="text-xs font-bold text-amber-700">
                {badge ? (badge.date ? `Đạt ngày ${fmtDate(badge.date)}` : 'Huy hiệu học tập') : 'Xong thử thách đầu tiên để nhận nhé!'}
              </p>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm font-bold text-slate-600">
            <li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span>⭐ Điểm Sân chơi</span><b className="text-amber-600">{fmt(totalPoints)} điểm</b>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span>🔥 Chuỗi ngày</span><b className="text-orange-600">{streak} ngày</b>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span>🏆 Hạng tuần này</span><b className="text-violet-600">{myWeek ? `Top ${myWeek.rank}` : 'Chưa xếp hạng'}</b>
            </li>
          </ul>
          <Link href="/bo-suu-tap" className="mt-3 self-end text-sm font-black text-sky-600 hover:underline">Xem chi tiết →</Link>
        </section>
      </div>

      {/* ═══ DẢI DƯỚI: phòng thi đấu + nhiệm vụ tuần ═══ */}
      <div className="mt-5 grid gap-3 rounded-[24px] bg-white/85 p-3 backdrop-blur md:grid-cols-2" style={{ boxShadow: '0 5px 0 rgba(22,163,74,.25)' }}>
        <Link href="/san-choi-tri-tue/phong" className="flex items-center gap-3 rounded-2xl bg-sky-50 p-3 transition hover:bg-sky-100">
          <span className="text-3xl" aria-hidden>📣</span>
          <p className="min-w-0 flex-1 text-sm font-bold text-slate-700">Tham gia phòng thi đấu trực tuyến để thử sức cùng bạn bè nhé!</p>
          <span className="kid-display shrink-0 rounded-full px-4 py-2 text-xs font-black text-white"
            style={{ background: 'linear-gradient(180deg,#38BDF8,#2563EB)', boxShadow: '0 3px 0 #1E40AF' }}>
            Vào phòng ngay →
          </span>
        </Link>
        <Link href="/bo-suu-tap" className="flex items-center gap-3 rounded-2xl bg-pink-50 p-3 transition hover:bg-pink-100">
          <span className="text-3xl" aria-hidden>🎁</span>
          <p className="min-w-0 flex-1 text-sm font-bold text-slate-700">Hoàn thành thử thách nhận quà hấp dẫn!</p>
          <span className="kid-display shrink-0 rounded-full px-4 py-2 text-xs font-black text-white"
            style={{ background: 'linear-gradient(180deg,#FF8FB8,#EC4899)', boxShadow: '0 3px 0 #BE185D' }}>
            Nhiệm vụ tuần →
          </span>
        </Link>
      </div>

      {questions && (
        <PlayModal
          questions={questions}
          title="Thử thách hôm nay"
          intro={today ? (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
              Hôm nay bé đã nhận sao rồi. Lượt này để luyện tập, không cộng thêm sao và điểm xếp hạng nhé!
            </p>
          ) : (
            <p className="mt-3 rounded-2xl bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
              Xong lượt đầu tiên hôm nay: nhận ⭐ +{DAILY_STARS} sao và lên bảng xếp hạng!
            </p>
          )}
          needName={!child}
          initialName={myName}
          onSaveNick={(n) => { setNick(n); setNickState(n); }}
          onFinish={handleFinish}
          onClose={() => setQuestions(null)}
        />
      )}
    </>
  );
}
