'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { THI_SUBJECTS, SUBJECT_LABEL, buildMatch, todayTheme, levelOf, nextLevel, type ThiRound, type ThiSubject } from '../lib/thiTai';
import { playCorrect, playWrong, playWin, confetti } from '../lib/celebrate';
import { addStars } from '../lib/stars';
import { getCurrentChildId, listChildren } from '../lib/childData';
import { apiFetch } from '../lib/api';
import { shareAchievement } from '../lib/share';

type Phase = 'lobby' | 'countdown' | 'round-intro' | 'playing' | 'result';
type Quest = { id: string; label: string; emoji: string; goal: number; progress: number; reward: number; claimed: boolean };
type Store = { season: number; correctTotal: number; days: string[]; best: Record<string, number>; questDate?: string; quests?: Quest[] };
type Row = { name: string; score: number; rank: number };

const KEY = 'bhh_thitai_v1';
function readStore(): Store {
  if (typeof window === 'undefined') return { season: 0, correctTotal: 0, days: [], best: {} };
  try { return { season: 0, correctTotal: 0, days: [], best: {}, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { season: 0, correctTotal: 0, days: [], best: {} }; }
}
function writeStore(s: Store) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }

const iso = (d: Date) => d.toISOString().slice(0, 10);
// Chuỗi ngày thi liên tiếp (tính tới hôm nay; nếu hôm nay chưa thi thì vẫn giữ chuỗi tới hết ngày).
function computeStreak(days: string[]): number {
  const set = new Set(days); let s = 0; const cur = new Date();
  if (!set.has(iso(cur))) cur.setDate(cur.getDate() - 1);
  while (set.has(iso(cur))) { s++; cur.setDate(cur.getDate() - 1); }
  return s;
}
// Nhiệm vụ hằng ngày — chọn 3 theo NGÀY (ổn định trong ngày).
const QUEST_POOL: Omit<Quest, 'progress' | 'claimed'>[] = [
  { id: 'play2', label: 'Hoàn thành 2 lượt thi', emoji: '🎮', goal: 2, reward: 15 },
  { id: 'correct20', label: 'Trả lời đúng 20 câu', emoji: '✅', goal: 20, reward: 20 },
  { id: 'combo5', label: 'Đạt combo 5 trong 1 lượt', emoji: '🔥', goal: 1, reward: 15 },
  { id: 'acc80', label: 'Đạt độ chính xác 80%+', emoji: '🎯', goal: 1, reward: 15 },
  { id: 'toan', label: 'Thi 1 lượt môn Toán', emoji: '➗', goal: 1, reward: 10 },
  { id: 'score150', label: 'Ghi 150 điểm trong 1 lượt', emoji: '🏅', goal: 1, reward: 20 },
];
function rollQuests(date: string): Quest[] {
  let seed = 2166136261 >>> 0;
  for (let i = 0; i < date.length; i++) { seed ^= date.charCodeAt(i); seed = Math.imul(seed, 16777619) >>> 0; }
  const idxs = QUEST_POOL.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) { seed ^= seed << 13; seed >>>= 0; seed ^= seed >>> 17; seed ^= seed << 5; seed >>>= 0; const j = seed % (i + 1); [idxs[i], idxs[j]] = [idxs[j], idxs[i]]; }
  return idxs.slice(0, 3).map((i) => ({ ...QUEST_POOL[i], progress: 0, claimed: false }));
}
function ensureQuests(s: Store): Store {
  const today = iso(new Date());
  if (s.questDate !== today) { s.questDate = today; s.quests = rollQuests(today); }
  return s;
}
// Cập nhật tiến độ nhiệm vụ sau 1 lượt; trả về SỐ SAO thưởng từ nhiệm vụ vừa hoàn thành + tên nhiệm vụ xong.
function bumpQuests(s: Store, r: { correct: number; maxCombo: number; subject: string; accuracy: number; score: number }): { stars: number; done: string[] } {
  if (!s.quests) return { stars: 0, done: [] };
  let stars = 0; const done: string[] = [];
  for (const q of s.quests) {
    if (q.claimed) continue;
    if (q.id === 'play2') q.progress += 1;
    else if (q.id === 'correct20') q.progress += r.correct;
    else if (q.id === 'combo5') q.progress += r.maxCombo >= 5 ? 1 : 0;
    else if (q.id === 'acc80') q.progress += r.accuracy >= 0.8 ? 1 : 0;
    else if (q.id === 'toan') q.progress += r.subject === 'toan' ? 1 : 0;
    else if (q.id === 'score150') q.progress += r.score >= 150 ? 1 : 0;
    if (!q.claimed && q.progress >= q.goal) { q.claimed = true; stars += q.reward; done.push(q.label); }
  }
  return { stars, done };
}

const TIERS = [
  { min: 5000, name: 'Kim cương', emoji: '💎', color: '#22D3EE' },
  { min: 2500, name: 'Kiện tướng', emoji: '👑', color: '#F5B301' },
  { min: 1000, name: 'Cao thủ', emoji: '🥇', color: '#F59E0B' },
  { min: 300, name: 'Tài năng', emoji: '🥈', color: '#9CA3AF' },
  { min: 0, name: 'Chiến binh', emoji: '🌟', color: '#8B5CF6' },
];
function tierOf(p: number) { return TIERS.find((t) => p >= t.min)!; }

function medalOf(acc: number) {
  if (acc >= 0.9) return { name: 'HUY CHƯƠNG VÀNG', color: '#F5B301', ring: '#FEF3C7', glow: 'rgba(245,179,1,.5)' };
  if (acc >= 0.75) return { name: 'HUY CHƯƠNG BẠC', color: '#94A3B8', ring: '#F1F5F9', glow: 'rgba(148,163,184,.45)' };
  if (acc >= 0.6) return { name: 'HUY CHƯƠNG ĐỒNG', color: '#CD7F32', ring: '#FBEBD9', glow: 'rgba(205,127,50,.45)' };
  return { name: 'GẦN ĐẠT RỒI', color: '#64748B', ring: '#F1F5F9', glow: 'rgba(100,116,139,.35)' };
}

const FX = `
@keyframes tt-pop{0%{transform:scale(.35);opacity:0}45%{transform:scale(1.18);opacity:1}100%{transform:scale(1)}}
@keyframes tt-ring{0%{transform:scale(.6);opacity:.55}100%{transform:scale(1.7);opacity:0}}
@keyframes tt-shine{0%{transform:translateX(-130%) skewX(-18deg)}60%,100%{transform:translateX(260%) skewX(-18deg)}}
@keyframes tt-spin{to{transform:rotate(360deg)}}
@keyframes tt-flame{0%,100%{transform:scale(1) rotate(-4deg)}50%{transform:scale(1.18) rotate(4deg)}}
@keyframes tt-reveal{0%{transform:scale(0) rotate(-35deg);opacity:0}60%{transform:scale(1.22) rotate(10deg)}100%{transform:scale(1) rotate(0)}}
@keyframes tt-rise{0%{transform:translateY(12px);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes tt-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@media(prefers-reduced-motion:reduce){.tt *{animation:none!important}}
`;
function Fx() { return <style>{FX}</style>; }

// Avatar tròn có màu theo tên + chữ cái đầu.
const AV_COLORS = ['#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#EF4444', '#14B8A6', '#F97316'];
function hashN(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function Avatar({ name, size = 44, ring }: { name: string; size?: number; ring?: string }) {
  const c = AV_COLORS[hashN(name) % AV_COLORS.length];
  const ch = (name.trim()[0] || 'B').toUpperCase();
  return (
    <span className="inline-grid shrink-0 place-items-center rounded-full font-black text-white"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${c}, ${c}bb)`, fontSize: size * 0.42, boxShadow: ring ? `0 0 0 3px ${ring}` : undefined }}>
      {ch}
    </span>
  );
}

export default function ThiTaiClient() {
  const [phase, setPhase] = useState<Phase>('lobby');
  // TẠM: chỉ mở môn Toán, các môn khác ẩn (giữ code để bật lại sau).
  const [subject, setSubject] = useState<ThiSubject>('toan');
  const [grade, setGrade] = useState(1);
  const [match, setMatch] = useState<ThiRound[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [idx, setIdx] = useState(0);
  const [qTime, setQTime] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [count, setCount] = useState(3);
  const [store, setStore] = useState<Store>({ season: 0, correctTotal: 0, days: [], best: {} });
  const [reward, setReward] = useState(0);
  const [questDone, setQuestDone] = useState<string[]>([]);
  const [leveledUp, setLeveledUp] = useState<{ level: number; name: string } | null>(null);
  const [shareMsg, setShareMsg] = useState('');
  const [childName, setChildName] = useState('Bé');
  const [rows, setRows] = useState<Row[]>([]);
  const [week, setWeek] = useState('');
  const [myRank, setMyRank] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const maxComboRef = useRef(0);
  const finishedRef = useRef(false);
  const startTimeRef = useRef(0); // mốc bắt đầu lượt thi — đo thời gian để phá hoà khi bằng điểm

  const round = match[roundIdx];
  const cur = round?.questions[idx];
  const totalQ = match.reduce((n, r) => n + r.questions.length, 0);
  const bestKey = `${subject}-${grade}`;
  const tier = tierOf(store.season);
  const answeredRef = useRef(false);

  useEffect(() => { const s = ensureQuests(readStore()); writeStore(s); setStore(s); }, []);

  // Tên + lớp của bé.
  useEffect(() => {
    (async () => {
      try {
        const kids = await listChildren();
        const id = getCurrentChildId();
        const me = kids.find((k) => k.id === id) || kids[0];
        if (me) {
          setChildName(me.nickname || me.fullName || 'Bé');
          const g = parseInt(String(me.currentLevel || '').replace(/\D/g, ''), 10);
          if (g >= 1 && g <= 5) setGrade(g);
        }
      } catch { /* khách */ }
    })();
  }, []);

  // Bảng xếp hạng theo lớp + môn.
  const loadBoard = useCallback(async (g: number, subj: ThiSubject) => {
    try {
      const d = await apiFetch<{ week: string; rows: Row[] }>(`/challenges/leaderboard?grade=${g}&subject=${subj}&limit=20`);
      setRows(d.rows || []); setWeek(d.week || '');
      const mine = (d.rows || []).find((r) => r.name === childName);
      setMyRank(mine ? mine.rank : null);
    } catch { setRows([]); }
  }, [childName]);

  useEffect(() => { if (phase === 'lobby') loadBoard(grade, subject); }, [phase, grade, subject, loadBoard]);

  // Đếm ngược 3-2-1 → vào màn chuyển vòng.
  useEffect(() => {
    if (phase !== 'countdown') return;
    setCount(3); let c = 3;
    const iv = setInterval(() => { c -= 1; if (c <= 0) { clearInterval(iv); setPhase('round-intro'); } else setCount(c); }, 850);
    return () => clearInterval(iv);
  }, [phase]);

  // Màn chuyển vòng (1.5s) → vào thi.
  useEffect(() => {
    if (phase !== 'round-intro') return;
    const t = setTimeout(() => setPhase('playing'), 1500);
    return () => clearTimeout(t);
  }, [phase, roundIdx]);

  // Đồng hồ vòng THẦN TỐC (giây/câu); hết giờ → coi như bỏ lỡ, sang câu sau.
  useEffect(() => {
    if (phase !== 'playing' || !round || round.mechanic !== 'speed') { setQTime(0); return; }
    setQTime(round.perQ || 5);
    const iv = setInterval(() => {
      setQTime((t) => { if (t <= 1) { clearInterval(iv); handleTimeout(); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundIdx, idx]);

  const start = (subj?: ThiSubject) => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    const sj = subj || subject; if (subj) setSubject(subj);
    finishedRef.current = false; scoreRef.current = 0; correctRef.current = 0; maxComboRef.current = 0; answeredRef.current = false;
    startTimeRef.current = Date.now();
    setMatch(buildMatch(sj, grade));
    setRoundIdx(0); setIdx(0); setPicked(null); setAnswered(false);
    setScore(0); setCorrect(0); setCombo(0); setMaxCombo(0);
    setPhase('countdown');
  };

  // Sang câu/vòng kế tiếp; hết vòng cuối → tổng kết.
  const advance = () => {
    const r = match[roundIdx];
    answeredRef.current = false;
    if (r && idx + 1 < r.questions.length) { setIdx(idx + 1); setPicked(null); setAnswered(false); }
    else if (roundIdx + 1 < match.length) { setRoundIdx(roundIdx + 1); setIdx(0); setPicked(null); setAnswered(false); setPhase('round-intro'); }
    else finish();
  };

  const handleTimeout = () => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setAnswered(true); setPicked(null); setCombo(0); playWrong();
    setTimeout(advance, 500);
  };

  const finish = () => {
    if (finishedRef.current) return; finishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    const sc = scoreRef.current;
    const s = ensureQuests(readStore());
    const oldBest = s.best[bestKey] || 0;
    const newBest = Math.max(oldBest, sc);
    s.best[bestKey] = newBest;
    const lv = levelOf(newBest);
    setLeveledUp(lv.level > levelOf(oldBest).level ? { level: lv.level, name: lv.name } : null);
    s.season = (s.season || 0) + sc;
    s.correctTotal = (s.correctTotal || 0) + correctRef.current;
    const today = iso(new Date());
    if (!s.days.includes(today)) s.days = [...s.days, today];
    const total = match.reduce((n, r) => n + r.questions.length, 0) || 1;
    const acc = correctRef.current / total;
    const qr = bumpQuests(s, { correct: correctRef.current, maxCombo: maxComboRef.current, subject, accuracy: acc, score: sc });
    writeStore(s); setStore(s);
    const id = getCurrentChildId() || 0;
    const rw = Math.max(5, Math.round(sc / 8)) + qr.stars;
    setReward(rw); setQuestDone(qr.done); if (id) addStars(id, rw);
    // Gửi lên bảng xếp hạng kèm thời gian thi (giây) để phá hoà khi bằng điểm.
    const timeSec = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
    apiFetch<{ rank: number }>('/challenges/submit', { method: 'POST', body: JSON.stringify({ name: childName || 'Bé', score: sc, grade, subject, time: timeSec }) })
      .then((res) => setMyRank(res.rank)).catch(() => {});
    playWin(); confetti('big');
    setPhase('result');
  };

  const answer = (oi: number) => {
    if (answered || !cur || !round) return;
    answeredRef.current = true;
    setPicked(oi); setAnswered(true);
    const ok = oi === cur.correctIndex;
    if (ok) {
      let pts = 10 + Math.min(combo, 5) * 2;
      if (round.mechanic === 'speed') pts += Math.max(0, qTime) * 2; // thưởng tốc độ
      const isLast = !!round.doubleLast && idx === round.questions.length - 1;
      if (isLast) pts *= 2; // câu cuối ×2
      correctRef.current += 1; scoreRef.current += pts;
      const nc = combo + 1; maxComboRef.current = Math.max(maxComboRef.current, nc);
      setCorrect(correctRef.current); setScore(scoreRef.current); setCombo(nc); setMaxCombo(maxComboRef.current);
      playCorrect(); if (nc >= 3) confetti('small');
    } else { setCombo(0); playWrong(); }
    setTimeout(advance, 650);
  };

  const doShare = async () => {
    const r = await shareAchievement('dau-truong', childName || 'Bé', `Thi Tài ${SUBJECT_LABEL[subject]} Lớp ${grade} · ${score} điểm`);
    if (r === 'copied') { setShareMsg('✅ Đã sao chép link! Dán vào Zalo/Facebook để khoe.'); setTimeout(() => setShareMsg(''), 3000); }
  };

  // ════════ ĐẾM NGƯỢC ════════
  if (phase === 'countdown') {
    return (
      <div className="tt relative mt-6 grid min-h-[55vh] place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-500 via-fuchsia-600 to-violet-600 text-white shadow-xl">
        <Fx />
        <span aria-hidden className="pointer-events-none absolute h-64 w-64 rounded-full border-4 border-white/40" style={{ animation: 'tt-ring 1.7s ease-out infinite' }} />
        <span aria-hidden className="pointer-events-none absolute h-64 w-64 rounded-full border-4 border-white/30" style={{ animation: 'tt-ring 1.7s ease-out infinite', animationDelay: '.6s' }} />
        <div className="relative text-center">
          <p className="kid-display text-lg font-black uppercase tracking-[0.3em] opacity-90">Sẵn sàng</p>
          <p key={count} className="kid-display text-[130px] font-black leading-none drop-shadow-lg" style={{ animation: 'tt-pop 0.8s ease' }}>{count}</p>
        </div>
      </div>
    );
  }

  // ════════ KẾT QUẢ ════════
  if (phase === 'result') {
    const acc = totalQ ? correct / totalQ : 0;
    const medal = medalOf(acc);
    const best = store.best[bestKey] || 0;
    const isRecord = score >= best && score > 0;
    return (
      <div className="tt mx-auto mt-6 max-w-xl">
        <Fx />
        <div className="relative overflow-hidden rounded-[28px] border-2 border-amber-100 bg-white p-6 text-center shadow-xl">
          <div className="relative mx-auto grid h-32 w-32 place-items-center">
            <Rays color={medal.color} />
            <div className="relative grid h-28 w-28 place-items-center rounded-full" style={{ background: medal.ring, boxShadow: `0 8px 34px ${medal.glow}`, animation: 'tt-reveal 0.9s ease' }}>
              <MedalIcon color={medal.color} size={94} />
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"><span className="absolute inset-y-0 -left-1/3 w-1/3" style={{ background: 'linear-gradient(105deg, transparent, rgba(255,255,255,.85), transparent)', animation: 'tt-shine 2.6s ease-in-out 0.6s infinite' }} /></span>
            </div>
          </div>
          <p className="kid-display mt-3 text-sm font-black tracking-wide" style={{ color: medal.color }}>{medal.name}</p>
          <h2 className="kid-display mt-1 text-4xl font-black text-slate-800">{score}<span className="text-lg text-slate-400"> điểm</span></h2>
          {isRecord && <p className="text-sm font-black text-orange-600">🎉 Kỷ lục mới của bé!</p>}
          {leveledUp && <p className="mt-1 text-base font-black text-red-500" style={{ animation: 'tt-pop .8s ease' }}>🔓 Mở khoá Level {leveledUp.level} · {leveledUp.name}!</p>}
          {myRank && <p className="mt-1 text-sm font-black text-violet-600">🏆 Hạng {myRank} · {SUBJECT_LABEL[subject]} · Lớp {grade}</p>}
          <div className="mx-auto mt-4 grid max-w-sm grid-cols-3 gap-2">
            <Stat label="Đúng" value={`${correct}/${totalQ}`} c="#16A34A" />
            <Stat label="Chính xác" value={`${Math.round(acc * 100)}%`} c="#2563EB" />
            <Stat label="Combo" value={`🔥${maxCombo}`} c="#EA580C" />
          </div>
          <p className="mt-3 font-black text-amber-500">+{reward} ⭐ vào ví sao</p>
          <p className="mt-1 text-sm font-black text-orange-600">🔥 Chuỗi {computeStreak(store.days)} ngày</p>
          {questDone.length > 0 && (
            <div className="mx-auto mt-3 max-w-sm rounded-2xl border-2 border-emerald-100 bg-emerald-50 p-3 text-left">
              <p className="text-xs font-black text-emerald-700">🎯 Hoàn thành nhiệm vụ:</p>
              {questDone.map((d, i) => <p key={i} className="text-sm font-bold text-emerald-800">✅ {d}</p>)}
            </div>
          )}
          {shareMsg && <p className="mt-3 text-sm font-black text-emerald-600">{shareMsg}</p>}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => start()} className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-sm font-black text-white shadow">🔁 Thi lại</button>
            <button type="button" onClick={doShare} className="rounded-full border-2 border-violet-200 px-6 py-2.5 text-sm font-black text-violet-600">📣 Khoe</button>
            <button type="button" onClick={() => setPhase('lobby')} className="rounded-full border-2 border-slate-200 px-6 py-2.5 text-sm font-black text-slate-500">🏟️ Về Đấu Trường</button>
          </div>
        </div>
      </div>
    );
  }

  // ════════ MÀN CHUYỂN VÒNG ════════
  if (phase === 'round-intro' && round) {
    const hint = round.mechanic === 'speed' ? `⏱ ${round.perQ}s mỗi câu — nhanh tay!` : round.mechanic === 'boss' ? '👑 Câu cuối ×2 điểm!' : round.mechanic === 'chill' ? 'Từ từ khởi động nào' : `${round.questions.length} câu`;
    return (
      <div className="tt relative mt-6 grid min-h-[45vh] place-items-center overflow-hidden rounded-[28px] text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${round.color}, ${round.color}cc)` }}>
        <Fx />
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,.22), transparent 55%)' }} />
        <div className="relative text-center" style={{ animation: 'tt-pop 0.7s ease' }}>
          <p className="kid-display text-sm font-black uppercase tracking-[0.25em] opacity-90">Vòng {roundIdx + 1} / {match.length}</p>
          <p className="mt-1 text-7xl">{round.emoji}</p>
          <p className="kid-display mt-1 text-3xl font-black">{round.name}</p>
          <p className="mt-2 text-sm font-bold opacity-95">{hint}</p>
        </div>
      </div>
    );
  }

  // ════════ ĐANG THI ════════
  if (phase === 'playing' && cur && round) {
    const isLastBoss = !!round.doubleLast && idx === round.questions.length - 1;
    return (
      <div className="tt mx-auto mt-6 max-w-xl">
        <Fx />
        <div className="rounded-3xl bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-3 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-sm font-black" style={{ background: `${round.color}33`, color: '#fff' }}>{round.emoji} {round.name}</span>
            {round.mechanic === 'speed' && (
              <div className="flex flex-1 items-center gap-2">
                <span className={`text-lg font-black tabular-nums ${qTime <= 2 ? 'animate-pulse text-red-400' : ''}`}>⏱ {qTime}s</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(qTime / (round.perQ || 5)) * 100}%`, background: qTime <= 2 ? '#ef4444' : '#F59E0B' }} /></div>
              </div>
            )}
            <span className="ml-auto shrink-0 rounded-full bg-white/15 px-3 py-1 text-sm font-black tabular-nums">{score}đ</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs font-black">
            <span className="opacity-80">Câu {idx + 1}/{round.questions.length}{isLastBoss && <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5">×2</span>}</span>
            {combo >= 2 ? <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-0.5" style={{ animation: 'tt-flame .5s ease-in-out infinite' }}>🔥 COMBO x{combo}</span> : <span className="opacity-50">Điểm mùa · {store.season}</span>}
          </div>
        </div>
        <div key={`${roundIdx}-${idx}`} className="mt-4 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm" style={{ animation: 'tt-rise .35s ease' }}>
          <div className="h-1.5 w-full" style={{ background: round.color }} />
          <div className="p-6 text-center">
            <p className="kid-display whitespace-pre-line text-2xl font-black text-slate-800 sm:text-3xl">{cur.prompt}</p>
            <div className="mx-auto mt-5 grid max-w-md gap-3 sm:grid-cols-2">
              {cur.options.map((op, oi) => (
                <button key={oi} type="button" disabled={answered} onClick={() => answer(oi)}
                  className={`rounded-2xl border-2 border-b-4 px-4 py-4 text-lg font-black transition active:translate-y-0.5 ${!answered ? 'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50' : oi === cur.correctIndex ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : oi === picked ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-slate-100 bg-white text-slate-300 opacity-70'}`}>
                  {op}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════ DASHBOARD ĐẤU TRƯỜNG (lobby) ════════
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3, 8);
  const best = store.best[bestKey] || 0;
  const top20 = rows[19]?.score;
  const toTop20 = top20 && best < top20 ? top20 - best : 0;
  const streak = computeStreak(store.days);
  const doneToday = store.days.includes(iso(new Date()));
  const quests = store.quests || [];
  // TẠM: chỉ môn Toán — luôn chạy Toán dù chủ đề ngày là gì; ẩn các môn khác.
  const VISIBLE_SUBJECTS = THI_SUBJECTS.filter((s) => s.key === 'toan');
  const rawTheme = todayTheme();
  const theme = { ...rawTheme, subject: 'toan' as ThiSubject };
  const myLevel = levelOf(best);
  const nl = nextLevel(best);

  return (
    <div className="tt mt-6">
      <Fx />
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-center">
        <span className="text-4xl" style={{ animation: 'tt-float 3s ease-in-out infinite' }}>🏆</span>
        <div>
          <h1 className="kid-display text-2xl font-black text-violet-700 sm:text-3xl">ĐẤU TRƯỜNG BÉ HAY HỌC</h1>
          <p className="text-xs font-bold text-slate-400">Thi tài mỗi ngày · Học vui mỗi ngày · Tiến bộ mỗi ngày</p>
        </div>
      </div>

      {/* Chủ đề thi hôm nay */}
      <button type="button" onClick={() => start(theme.subject)} className="mb-4 flex w-full items-center gap-3 rounded-3xl bg-gradient-to-r from-fuchsia-600 to-violet-600 p-4 text-left text-white shadow-lg transition hover:brightness-105 active:scale-[0.99]">
        <span className="text-4xl" style={{ animation: 'tt-float 3s ease-in-out infinite' }}>{theme.emoji}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-black uppercase tracking-wider opacity-90">Chủ đề hôm nay</span>
          <span className="kid-display block truncate text-lg font-black">{theme.name}</span>
          <span className="block truncate text-xs font-bold opacity-90">{theme.desc}</span>
        </span>
        <span className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-black text-violet-600 shadow">Thi ngay →</span>
      </button>

      {/* Grade tabs */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5].map((g) => (
          <button key={g} type="button" onClick={() => setGrade(g)}
            className={`flex shrink-0 items-center gap-1.5 rounded-2xl border-2 px-4 py-2 text-sm font-black transition ${grade === g ? 'border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow' : 'border-slate-100 bg-white text-slate-500 hover:border-violet-200'}`}>
            {grade === g && <span>🏆</span>} Lớp {g}
          </button>
        ))}
      </div>

      {/* Subject tabs (tạm chỉ Toán) */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {VISIBLE_SUBJECTS.map((s) => (
          <button key={s.key} type="button" onClick={() => setSubject(s.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-black transition ${subject === s.key ? 'border-transparent text-white shadow' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}
            style={subject === s.key ? { background: s.color } : undefined}>
            <span>{s.emoji}</span> {s.short}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* ── Bảng xếp hạng ── */}
        <div className="rounded-3xl border-2 border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="kid-display text-lg font-black text-slate-800">👑 Bảng xếp hạng · Lớp {grade}</h2>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-600">{week ? `Tuần ${week}` : 'Tuần này'}</span>
          </div>

          {podium.length >= 3 ? (
            <div className="mb-4 grid grid-cols-3 items-end gap-2">
              <PodiumCol row={podium[1]} place={2} h="h-24" bg="from-slate-100 to-slate-50" ring="#CBD5E1" />
              <PodiumCol row={podium[0]} place={1} h="h-32" bg="from-amber-100 to-amber-50" ring="#F5B301" crown />
              <PodiumCol row={podium[2]} place={3} h="h-20" bg="from-orange-100 to-orange-50" ring="#CD7F32" />
            </div>
          ) : (
            <div className="mb-4 rounded-2xl bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
              Chưa có ai trên bảng lớp này. <b className="text-violet-600">Thi ngay để đứng đầu!</b>
            </div>
          )}

          {/* Bảng chi tiết */}
          {rest.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="grid grid-cols-[44px_1fr_auto] gap-2 bg-slate-50 px-3 py-2 text-[11px] font-black uppercase text-slate-400">
                <span>Hạng</span><span>Bé</span><span>Điểm</span>
              </div>
              {rest.map((r) => (
                <div key={r.rank} className="grid grid-cols-[44px_1fr_auto] items-center gap-2 border-t border-slate-50 px-3 py-2.5">
                  <span className="font-black text-slate-500">{r.rank}</span>
                  <span className="flex items-center gap-2 truncate font-bold text-slate-700"><Avatar name={r.name} size={30} /> <span className="truncate">{r.name}</span></span>
                  <span className="font-black text-slate-800">{r.score.toLocaleString('vi-VN')}</span>
                </div>
              ))}
              {myRank && myRank > 8 && (
                <div className="grid grid-cols-[44px_1fr_auto] items-center gap-2 border-t-2 border-violet-100 bg-violet-50 px-3 py-2.5">
                  <span className="font-black text-violet-600">{myRank}</span>
                  <span className="flex items-center gap-2 font-black text-violet-700"><Avatar name={childName} size={30} /> Bạn ({childName})</span>
                  <span className="font-black text-violet-700">{best.toLocaleString('vi-VN')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Hồ sơ */}
          <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <Avatar name={childName} size={52} ring="rgba(255,255,255,.5)" />
              <div className="min-w-0">
                <p className="kid-display truncate text-lg font-black">{childName}</p>
                <p className="text-xs font-bold opacity-90">Lớp {grade} · {tier.emoji} {tier.name}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-white/15 p-3">
              <p className="text-[11px] font-bold uppercase opacity-90">Hạng của bạn</p>
              <p className="kid-display text-3xl font-black">{myRank ? `#${myRank}` : '—'}</p>
              {toTop20 > 0 ? (
                <>
                  <p className="mt-1 text-xs font-bold opacity-90">Còn {toTop20.toLocaleString('vi-VN')} điểm để vào TOP 20</p>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white" style={{ width: `${Math.min(100, (best / (top20 || 1)) * 100)}%` }} /></div>
                </>
              ) : <p className="mt-1 text-xs font-bold opacity-90">Thi để leo hạng cùng lớp nhé!</p>}
            </div>
          </div>

          {/* Chuỗi ngày thi (streak) */}
          <div className="flex items-center gap-3 rounded-3xl border-2 border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 shadow-sm">
            <span className="text-4xl" style={{ animation: streak > 0 ? 'tt-flame .6s ease-in-out infinite' : undefined }}>{streak > 0 ? '🔥' : '🕯️'}</span>
            <div className="min-w-0 flex-1">
              <p className="kid-display text-2xl font-black text-orange-600">{streak} ngày</p>
              <p className="text-xs font-bold text-slate-500">{doneToday ? 'Đã giữ chuỗi hôm nay — giỏi lắm!' : streak > 0 ? 'Thi hôm nay để giữ chuỗi 🔥 nhé!' : 'Thi mỗi ngày để bắt đầu chuỗi!'}</p>
            </div>
          </div>

          {/* Cấp độ theo môn + lớp */}
          <div className="rounded-3xl border-2 border-slate-100 bg-white p-4 shadow-sm">
            <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">Cấp độ · {SUBJECT_LABEL[subject]} Lớp {grade}</p>
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow" style={{ background: myLevel.color }}>
                <span className="kid-display text-lg font-black leading-none">Lv{myLevel.level}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="kid-display text-lg font-black" style={{ color: myLevel.color }}>{myLevel.name}</p>
                {nl ? (
                  <>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (best / nl.min) * 100)}%`, background: myLevel.color }} /></div>
                    <p className="mt-0.5 text-[11px] font-bold text-slate-400">Còn {nl.min - best} điểm lên {nl.name}</p>
                  </>
                ) : <p className="text-[11px] font-black text-red-500">🏆 Đã đạt Cao thủ!</p>}
              </div>
            </div>
          </div>

          {/* Thống kê */}
          <div className="rounded-3xl border-2 border-slate-100 bg-white p-5 shadow-sm">
            <p className="kid-display mb-3 text-base font-black text-slate-800">Thống kê của bạn</p>
            <StatRow emoji="🏆" value={store.season.toLocaleString('vi-VN')} label="Điểm tổng" c="#F59E0B" />
            <StatRow emoji="💜" value={String(store.correctTotal)} label="Câu trả lời đúng" c="#8B5CF6" />
            <StatRow emoji="📅" value={String(store.days.length)} label="Ngày thi đấu" c="#3B82F6" />
          </div>

          {/* Huy hiệu */}
          <div className="rounded-3xl border-2 border-slate-100 bg-white p-5 shadow-sm">
            <p className="kid-display mb-3 text-base font-black text-slate-800">Hạng mùa của bạn</p>
            <div className="flex flex-wrap gap-2">
              {TIERS.slice().reverse().map((t) => {
                const on = store.season >= t.min;
                return <span key={t.name} className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${on ? '' : 'opacity-30 grayscale'}`} style={{ background: `${t.color}22` }} title={t.name}>{t.emoji}</span>;
              })}
            </div>
          </div>

          {/* Nhiệm vụ hằng ngày */}
          <div className="rounded-3xl border-2 border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="kid-display text-base font-black text-slate-800">Nhiệm vụ hôm nay 🎯</p>
              <span className="text-xs font-black text-emerald-600">{quests.filter((q) => q.claimed).length}/{quests.length}</span>
            </div>
            <div className="space-y-2.5">
              {quests.map((q) => (
                <div key={q.id} className={`rounded-2xl border-2 p-2.5 ${q.claimed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{q.claimed ? '✅' : q.emoji}</span>
                    <span className={`flex-1 text-sm font-bold ${q.claimed ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>{q.label}</span>
                    <span className="shrink-0 text-xs font-black text-amber-500">+{q.reward}⭐</span>
                  </div>
                  {!q.claimed && (
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400" style={{ width: `${Math.min(100, (q.progress / q.goal) * 100)}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => start('tong-hop')} className="mt-3 w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 py-2.5 text-sm font-black text-white shadow">Làm nhiệm vụ ngay</button>
          </div>
        </div>
      </div>

      {/* Thanh THI TÀI NGAY */}
      <div className="mt-5 rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-5 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="kid-display text-lg font-black">🎮 THI TÀI NGAY</p>
            <p className="text-xs font-bold opacity-90">Chọn lớp và bắt đầu thử thách Toán nào!</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {VISIBLE_SUBJECTS.map((s) => (
              <button key={s.key} type="button" onClick={() => start(s.key)}
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black text-white shadow transition hover:brightness-110 active:scale-95"
                style={{ background: s.color }}>
                <span>{s.emoji}</span> {s.short}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PodiumCol({ row, place, h, bg, ring, crown }: { row?: Row; place: number; h: string; bg: string; ring: string; crown?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      {crown && <span className="mb-0.5 text-2xl">👑</span>}
      <div className="relative">
        <Avatar name={row?.name || 'Bé'} size={place === 1 ? 64 : 52} ring={ring} />
        <span className="absolute -bottom-1 left-1/2 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full text-xs font-black text-white shadow" style={{ background: ring }}>{place}</span>
      </div>
      <p className="mt-2 max-w-[92px] truncate text-center text-sm font-black text-slate-700">{row?.name || '—'}</p>
      <p className="text-xs font-black" style={{ color: ring }}>{row ? row.score.toLocaleString('vi-VN') : 0} đ</p>
      <div className={`mt-2 w-full rounded-t-xl bg-gradient-to-b ${bg} ${h}`} />
    </div>
  );
}

function StatRow({ emoji, value, label, c }: { emoji: string; value: string; label: string; c: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-50 py-2 last:border-0">
      <span className="grid h-9 w-9 place-items-center rounded-xl text-lg" style={{ background: `${c}18` }}>{emoji}</span>
      <span className="kid-display text-xl font-black" style={{ color: c }}>{value}</span>
      <span className="ml-auto text-xs font-bold text-slate-400">{label}</span>
    </div>
  );
}

function Stat({ label, value, c }: { label: string; value: string; c: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-2.5">
      <p className="kid-display text-lg font-black" style={{ color: c }}>{value}</p>
      <p className="text-[11px] font-black uppercase text-slate-400">{label}</p>
    </div>
  );
}

function Rays({ color }: { color: string }) {
  return (
    <svg className="pointer-events-none absolute inset-[-14px] h-[calc(100%+28px)] w-[calc(100%+28px)]" viewBox="0 0 100 100" aria-hidden="true" style={{ animation: 'tt-spin 14s linear infinite' }}>
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x="49" y="2" width="2" height="20" rx="1" fill={color} opacity="0.35" transform={`rotate(${i * 30} 50 50)`} />)}
    </svg>
  );
}

function MedalIcon({ color, size = 64 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M22 6l8 20-8-2-6 5z" fill={color} opacity="0.85" />
      <path d="M42 6l-8 20 8-2 6 5z" fill={color} opacity="0.6" />
      <circle cx="32" cy="42" r="17" fill={color} />
      <circle cx="32" cy="42" r="17" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2" />
      <path d="M32 33l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="#ffffff" opacity="0.95" />
    </svg>
  );
}
