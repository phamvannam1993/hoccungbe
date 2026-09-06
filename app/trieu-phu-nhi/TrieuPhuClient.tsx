'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  getSession, checkAnswer, hintFifty, hintFriends, hintSwap, finishRun, analyse, leaderboard,
  getCoins, setCoins, formatVnd, MODES,
  type GameMode, type GameQuestion, type GameSession, type SkillAnalysis, type LeaderRow,
} from '../lib/millionaire';
import { getCurrentChildId, listChildren, type Child } from '../lib/childData';
import { ChildAvatar } from '../components/edu/KidIcon';
import { speakSequence, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import { splitForSpeech } from '../lib/skillSpeech';
import { Stage, SkyStage, GoldText, GameButton, CoinChip, Coin, Icon, Panel, Ribbon } from './theme';
import {
  unlockSfx, setSfxEnabled, sfxSelect, sfxLock, sfxCorrect, sfxWrong, sfxWin, sfxTick,
  startSuspense, stopSuspense, startMusic, stopMusic,
} from './sfx';
import PrizeLadder, { PrizeStrip } from './PrizeLadder';
import AnswerGrid, { type AnswerState } from './AnswerGrid';

type Screen = 'home' | 'grade' | 'mode' | 'play' | 'result' | 'board';

// Mỗi lớp một gương mặt riêng, lấy từ bộ ảnh avatar có sẵn trong /public/avatars
// — emoji 🧒 mỗi máy vẽ một kiểu và trông rất nhạt.
const GRADES = [
  { g: 1, color: '#22c55e', dark: '#15803d', icon: 'hom-nay/10_star_green_circle.webp', avatar: '/avatars/avatar-be-01.webp' },
  { g: 2, color: '#3b82f6', dark: '#1d4ed8', icon: 'hom-nay/01_book_blue_circle.webp', avatar: '/avatars/avatar-be-02.webp' },
  { g: 3, color: '#f97316', dark: '#c2410c', icon: 'hom-nay/04_fire_streak_orange.webp', avatar: '/avatars/avatar-be-03.webp' },
  { g: 4, color: '#8b5cf6', dark: '#6d28d9', icon: 'hom-nay/03_star_badge_purple.webp', avatar: '/avatars/avatar-be-05.webp' },
  { g: 5, color: '#ec4899', dark: '#be185d', icon: 'hom-nay/15_trophy_orange.webp', avatar: '/avatars/avatar-be-06.webp' },
];

// Icon cho ba chế độ chơi và ba quyền trợ giúp.
const MODE_ICON: Record<string, string> = {
  classic: 'hom-nay/15_trophy_orange.webp',
  speed: 'khao_sat/05_stopwatch_speed.webp',
  boss: 'hom-nay/05_target_red.webp',
};
const HINT_ICON = {
  fifty: 'hom-nay/09_question_blue_circle.webp',
  friends: 'hom-nay/20_robot_assistant.webp',
  swap: 'hom-nay/07_refresh_green.webp',
} as const;

// Ba chế độ ba tông màu, đúng thứ tự khó dần: xanh dương → tím xanh → đỏ.
const MODE_TONE: Record<string, { from: string; to: string; edge: string }> = {
  classic: { from: '#4f8dff', to: '#2563eb', edge: '#1740a8' },
  speed: { from: '#6366f1', to: '#4338ca', edge: '#312e81' },
  boss: { from: '#fb7185', to: '#e11d48', edge: '#9f1239' },
};

/**
 * Câu vừa trả lời có phải MỐC QUAN TRỌNG không.
 * Hai mốc an toàn (câu 5 và câu 10) và mốc cuối cùng — đúng ba chặng mà chương
 * trình dừng lại để công bố.
 */
function mocQuanTrong(idx: number, session: GameSession): { title: string; sub: string } | null {
  const tien = session.prizes[Math.min(idx, session.prizes.length - 1)];
  const cuoi = idx >= session.prizes.length - 1;
  if (cuoi) {
    return { title: 'Tuyệt vời!', sub: `Bé đã chinh phục mốc cao nhất: ${formatVnd(tien)} đồng!` };
  }
  if (session.safeLevels.includes(idx)) {
    const thu = session.safeLevels.indexOf(idx) + 1;
    return {
      title: thu === 1 ? 'Chúc mừng bé!' : 'Xuất sắc!',
      sub: `Bé đã vượt qua mốc an toàn thứ ${thu} và chắc chắn có ${formatVnd(tien)} đồng.`,
    };
  }
  return null;
}

const HINT_COST = { fifty: 50, friends: 50, swap: 50 } as const;
const SPEED_SECONDS = 60;

export default function TrieuPhuClient() {
  const [screen, setScreen] = useState<Screen>('home');
  const [grade, setGrade] = useState(3);
  const [mode, setMode] = useState<GameMode>('classic');
  const [coins, setCoinState] = useState(0);
  const [name, setName] = useState('Bé ẩn danh');
  const [child, setChild] = useState<Child | null>(null);

  const [session, setSession] = useState<GameSession | null>(null);
  const [queue, setQueue] = useState<GameQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState<AnswerState>({ picked: null, correctIndex: null, removed: [], votes: null, locked: false });
  const [explain, setExplain] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [log, setLog] = useState<{ questionId: number; isCorrect: boolean }[]>([]);
  const [prize, setPrize] = useState(0);
  const [ending, setEnding] = useState<'win' | 'stop' | 'lose'>('lose');
  const [pending, setPending] = useState<number | null>(null);   // đáp án đang chờ bé xác nhận
  const [revealing, setRevealing] = useState(false);             // đang hồi hộp chờ công bố
  const [sound, setSound] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(SPEED_SECONDS);
  const [report, setReport] = useState<SkillAnalysis[]>([]);
  const [board, setBoard] = useState<LeaderRow[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [milestone, setMilestone] = useState<{ title: string; sub: string } | null>(null);
  const startedAt = useRef(0);

  const current = queue[idx];

  useEffect(() => {
    setCoinState(getCoins());
    const id = getCurrentChildId();
    if (!id) return;
    listChildren()
      .then((arr) => {
        const c = arr.find((x) => x.id === id);
        if (c) { setChild(c); setName(c.nickname || c.fullName || 'Bé ẩn danh'); }
      })
      .catch(() => { /* chưa có hồ sơ thì chơi ẩn danh */ });
  }, []);

  const spend = useCallback((n: number) => {
    setCoinState((c) => { const next = Math.max(0, c - n); setCoins(next); return next; });
  }, []);

  const earn = useCallback((n: number) => {
    setCoinState((c) => { const next = c + n; setCoins(next); return next; });
  }, []);

  // Đọc đề: câu hỏi trộn Toán/Tiếng Việt nên dùng chung bộ tách ngôn ngữ của
  // phần luyện kỹ năng, không tự viết lại.
  /** MC đọc đề rồi đọc lần lượt bốn đáp án — giống cách dẫn của chương trình. */
  const readQuestion = useCallback((q: GameQuestion) => {
    if (!sound) return;
    // Đọc theo ĐÚNG MÔN của câu. Ván chơi trộn cả ba môn; nếu đọc mọi câu theo
    // kiểu Toán thì câu chính tả bị phát sai — con chữ "b" đọc thành "bê" (tên
    // chữ) thay vì "bờ" (âm) như cách dạy ở tiểu học.
    const parts = splitForSpeech(q.questionText, q.subject);
    q.options.forEach((o, i) => {
      // NHÃN đáp án đọc nguyên tên chữ ("A, bê, xê, dê") — KHÔNG cho qua bộ
      // chuẩn hoá, nếu không "B." bị đổi thành âm "bờ".
      // Chỉ NỘI DUNG đáp án mới đi qua bộ chuẩn hoá, vì với câu nhận biết chữ
      // cái thì đọc "pờ" mới đúng cách dạy.
      parts.push({ text: `Đáp án ${'ABCD'[i]}`, lang: 'vi' });
      parts.push(...splitForSpeech(`${o}.`, q.subject));
    });
    speakSequence(parts);
  }, [sound]);

  async function start(m: GameMode) {
    unlockAudio();
    unlockSfx();
    setLoading(true);
    setError(null);
    setMode(m);
    try {
      const s = await getSession(grade, m);
      if (!s.questions.length) {
        setError('Lớp này chưa có câu hỏi. Bé thử chọn lớp khác nhé!');
        return;
      }
      setSession(s);
      setQueue(s.questions);
      setIdx(0);
      setAns({ picked: null, correctIndex: null, removed: [], votes: null, locked: false });
      setExplain(null);
      setCombo(0); setBestCombo(0); setLog([]); setPrize(0);
      setUsedHints([]);
      setSeconds(SPEED_SECONDS);
      startedAt.current = Date.now();
      setScreen('play');
    } catch {
      // Mất mạng hoặc máy chủ chưa chạy — báo cho bé biết thay vì để trang lỗi.
      setError('Không tải được câu hỏi. Bé kiểm tra kết nối rồi thử lại nhé!');
    } finally { setLoading(false); }
  }

  // Nhạc nền chỉ chạy ở các màn MENU. Vào ván thì tắt để nhường chỗ cho lời
  // đọc đề, tiếng hồi hộp và tiếng công bố kết quả.
  useEffect(() => {
    if (!sound || screen === 'play') { stopMusic(); return; }
    startMusic();
  }, [screen, sound]);

  // Trình duyệt chặn tự phát nhạc cho tới khi người dùng chạm vào trang.
  // Bắt CÚ CHẠM ĐẦU TIÊN ở bất kỳ đâu để mở khoá rồi bật nhạc ngay.
  useEffect(() => {
    const moKhoa = () => {
      unlockSfx();
      unlockAudio();
      if (sound && screen !== 'play') startMusic();
    };
    window.addEventListener('pointerdown', moKhoa, { once: true });
    window.addEventListener('keydown', moKhoa, { once: true });
    return () => {
      window.removeEventListener('pointerdown', moKhoa);
      window.removeEventListener('keydown', moKhoa);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rời trang thì dừng hẳn mọi âm thanh.
  useEffect(() => () => { stopMusic(); stopSuspense(); stopSpeaking(); }, []);

  // Tự đọc đề khi sang câu mới. Hoãn một nhịp để phần mở khoá âm thanh kịp xong
  // (cả app dùng chung một thẻ <audio>).
  useEffect(() => {
    if (screen !== 'play' || !current || !sound) return;
    stopSpeaking();
    const t = setTimeout(() => readQuestion(current), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, screen, sound]);

  // Đồng hồ cho chế độ 60 giây.
  useEffect(() => {
    if (screen !== 'play' || mode !== 'speed') return;
    const t = setInterval(() => setSeconds((s) => {
      if (s <= 1) { finish('stop'); return 0; }
      if (s <= 11) sfxTick();
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, mode]);

  /** Bước 1 — bé chọn đáp án. Chưa chấm vội, còn phải xác nhận. */
  function pick(i: number) {
    if (ans.locked || revealing || !current) return;
    setError(null);
    unlockSfx();
    sfxSelect();
    setPending(i);
    stopSpeaking();
  }

  /**
   * Bước 2 — bé bấm "Chắc chắn". Đây là nhịp đặc trưng của chương trình:
   * chốt xong thì nhạc hồi hộp nổi lên, chờ một lát mới công bố kết quả.
   */
  async function confirm() {
    if (pending == null || !current) return;
    sfxLock();
    setRevealing(true);
    setAns((a) => ({ ...a, picked: pending, locked: true }));
    startSuspense();

    let r: Awaited<ReturnType<typeof checkAnswer>>;
    try {
      r = await checkAnswer(current.id, pending);
    } catch {
      // Không chấm được thì phải TRẢ LẠI quyền chọn, nếu không ván treo vĩnh
      // viễn ở trạng thái "đang công bố" kèm nhạc hồi hộp chạy mãi.
      stopSuspense();
      setRevealing(false);
      setAns((a) => ({ ...a, picked: null, locked: false }));
      setError('Không chấm được câu này. Bé thử chọn lại nhé!');
      return;
    }

    // Giữ nhịp hồi hộp một lát rồi mới lật đáp án.
    await new Promise((res) => setTimeout(res, 1800));
    stopSuspense();

    setAns((a) => ({ ...a, correctIndex: r.correctIndex }));
    setExplain(r.explanation);
    setLog((l) => [...l, { questionId: current.id, isCorrect: r.isCorrect }]);
    setRevealing(false);
    setPending(null);

    if (r.isCorrect) {
      const c = combo + 1;
      setCombo(c);
      setBestCombo((b) => Math.max(b, c));
      if (session) setPrize(session.prizes[Math.min(idx, session.prizes.length - 1)]);
      earn(10);
      if (idx + 1 >= queue.length) sfxWin(); else sfxCorrect();
    } else {
      setCombo(0);
      sfxWrong();
    }

    // Công bố khi VƯỢT MỐC — nhịp quen thuộc của chương trình: qua mốc an toàn
    // thì MC nhắc số tiền bé đã chắc chắn có, tạo cảm giác vừa đạt được gì đó
    // thật sự chứ không chỉ là "sang câu tiếp".
    const moc = r.isCorrect && session ? mocQuanTrong(idx, session) : null;
    if (moc) {
      setMilestone(moc);
      if (idx + 1 >= queue.length) sfxWin();
    }

    if (sound) {
      const noi = r.isCorrect ? 'Chính xác!' : 'Chưa đúng rồi.';
      const mon = current.subject;
      // Vượt mốc thì đọc lời công bố TRƯỚC, rồi mới tới cách làm.
      const loi = moc ? `${moc.title} ${moc.sub}` : '';
      setTimeout(
        () => speakSequence(splitForSpeech(`${noi} ${loi} ${r.explanation}`, mon)),
        700,
      );
    }
  }

  function next() {
    const lastAnswerWrong = ans.correctIndex != null && ans.picked !== ans.correctIndex;
    // Chế độ leo thang: sai là dừng ván (giữ tiền mốc an toàn).
    if (mode === 'classic' && lastAnswerWrong) return finish('lose');
    if (idx + 1 >= queue.length) return finish(lastAnswerWrong ? 'lose' : 'win');
    setIdx((i) => i + 1);
    setAns({ picked: null, correctIndex: null, removed: [], votes: null, locked: false });
    setExplain(null);
    setPending(null);
    setMilestone(null);
  }

  /**
   * Kết thúc ván. `ending` phân biệt ba đường ra như chương trình thật:
   *  - 'win'  : trả lời hết thang tiền
   *  - 'stop' : bé chủ động DỪNG CUỘC CHƠI, giữ trọn số tiền đang có
   *  - 'lose' : trả lời sai, tụt về mốc an toàn gần nhất đã qua
   */
  async function finish(ending: 'win' | 'stop' | 'lose') {
    stopSpeaking();
    stopSuspense();
    const timeSec = Math.round((Date.now() - startedAt.current) / 1000);
    const correct = log.filter((x) => x.isCorrect).length;

    let finalPrize = prize;
    if (ending === 'lose' && session) {
      const passed = session.safeLevels.filter((sl) => sl < idx);
      finalPrize = passed.length ? session.prizes[passed[passed.length - 1]] : 0;
    }
    setEnding(ending);
    setPrize(finalPrize);
    setScreen('result');
    earn(Math.round(finalPrize / 1000));

    try {
      await finishRun({
        childId: getCurrentChildId() || null, name, grade, mode,
        totalQuestions: log.length, correctCount: correct,
        prize: finalPrize, bestCombo, timeSec, answers: log,
      });
      setReport(await analyse(log));
    } catch { /* mất mạng thì vẫn hiện kết quả, chỉ không lên bảng xếp hạng */ }
  }

  async function applyHint(kind: 'fifty' | 'friends' | 'swap') {
    if (!current || usedHints.includes(kind) || coins < HINT_COST[kind]) return;
    setShowHints(false);
    spend(HINT_COST[kind]);
    setUsedHints((u) => [...u, kind]);
    try {
      if (kind === 'fifty') {
        const r = await hintFifty(current.id);
        setAns((a) => ({ ...a, removed: r.remove }));
      } else if (kind === 'friends') {
        const r = await hintFriends(current.id);
        setAns((a) => ({ ...a, votes: r.votes }));
      } else {
        const q = await hintSwap(grade, current.band, queue.map((x) => x.id));
        setQueue((list) => list.map((x, i) => (i === idx ? q : x)));
        setAns({ picked: null, correctIndex: null, removed: [], votes: null, locked: false });
        setExplain(null);
      }
    } catch { /* hết câu để đổi thì bỏ qua */ }
  }

  async function openBoard() {
    setScreen('board');
    try { setBoard((await leaderboard(grade, period)).rows); } catch { setBoard([]); }
  }
  useEffect(() => {
    if (screen !== 'board') return;
    leaderboard(grade, period).then((r) => setBoard(r.rows)).catch(() => setBoard([]));
  }, [period, grade, screen]);

  // ── 1. MÀN HÌNH CHÍNH ──
  if (screen === 'home') {
    return (
      <Stage>
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-black text-white/80 hover:text-white">‹ Bé Hay Học</Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-1.5 ring-1 ring-white/20">
            <ChildAvatar child={child} className="h-8 w-8 ring-2 ring-white/40" />
            <span className="text-sm font-black text-white">{name}</span>
            <CoinChip coins={coins} />
          </span>
        </div>

        <div className="mx-auto max-w-md text-center">
          <Icon name="khao_sat/15_tiger_mascot.webp" size={112} className="mx-auto drop-shadow-2xl" />
          <h1 className="mt-1 text-4xl leading-tight sm:text-5xl">
            <GoldText>AI LÀ<br />TRIỆU PHÚ NHÍ</GoldText>
          </h1>
          <p className="mt-3 text-sm font-bold text-white/75">Thử thách kiến thức · Kiến tạo tương lai</p>

          <div className="mt-7 space-y-3">
            <GameButton onClick={() => setScreen('mode')}>Bắt đầu chơi</GameButton>
            <GameButton variant="blue" onClick={() => setScreen('grade')}>🎓 Chọn lớp học</GameButton>
            <GameButton variant="ghost" onClick={openBoard}>🏆 Bảng xếp hạng</GameButton>
          </div>
          <p className="mt-4 text-xs font-bold text-white/50">Đang chơi ở Lớp {grade}</p>
        </div>
      </Stage>
    );
  }

  // ── 2. CHỌN LỚP ──
  if (screen === 'grade') {
    return (
      <SkyStage>
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => setScreen('home')} aria-label="Quay lại"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0a1a52] shadow-md">‹</button>
          <span className="flex-1" />
        </div>
        <div className="mx-auto mb-6 max-w-md rounded-[26px] bg-white px-5 py-4 text-center shadow-xl">
          <h2 className="text-2xl font-black text-[#1e4fd8]">🎓 Chọn lớp học</h2>
          <p className="mt-1 text-xs font-bold text-slate-500">
            Hành trình chinh phục TRIỆU PHÚ bắt đầu từ đây!
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {GRADES.map((g) => (
            <button
              key={g.g}
              onClick={() => { unlockSfx(); sfxSelect(); setGrade(g.g); setScreen('mode'); }}
              className={`relative overflow-hidden rounded-[28px] px-3 pb-5 pt-6 text-center font-black text-white transition hover:-translate-y-1.5 ${grade === g.g ? 'ring-4 ring-white' : ''}`}
              style={{
                background: `linear-gradient(180deg,${g.color} 0%,${g.dark} 100%)`,
                boxShadow: `0 10px 0 ${g.dark}, 0 20px 30px rgba(0,0,0,.22)`,
              }}
            >
              {/* Vệt sáng bóng ở nửa trên cho thẻ trông nổi khối */}
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                style={{ background: 'linear-gradient(180deg,rgba(255,255,255,.28),transparent)' }} />
              {/* eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh trong /public */}
              <img src={g.avatar} alt="" draggable={false}
                className="relative mx-auto h-20 w-20 rounded-full bg-white/25 object-cover ring-4 ring-white/60" />
              <span className="relative mt-3 block text-xl drop-shadow">Lớp {g.g}</span>
              <span className="relative mt-1 inline-grid h-10 w-10 place-items-center rounded-full bg-white/25">
                <Icon name={g.icon} size={24} />
              </span>
            </button>
          ))}
        </div>
      </SkyStage>
    );
  }

  // ── 3. CHỌN CHẾ ĐỘ ──
  if (screen === 'mode') {
    return (
      <Stage>
        <TopBar title="Chọn chế độ chơi" onBack={() => setScreen('home')} />
        <div className="mx-auto max-w-lg space-y-3">
          {MODES.map((m) => {
            const tone = MODE_TONE[m.key];
            return (
              <button
                key={m.key}
                onClick={() => start(m.key)}
                disabled={loading}
                className="relative flex w-full items-center gap-4 overflow-hidden rounded-3xl p-4 text-left transition hover:-translate-y-1 disabled:opacity-60"
                style={{ background: `linear-gradient(180deg,${tone.from},${tone.to})`, boxShadow: `0 8px 0 ${tone.edge}, 0 16px 26px rgba(0,0,0,.3)` }}
              >
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{ background: 'linear-gradient(180deg,rgba(255,255,255,.25),transparent)' }} />
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/25">
                  <Icon name={MODE_ICON[m.key]} size={34} />
                </span>
                <span className="relative min-w-0 flex-1">
                  <span className="block text-base font-black text-white drop-shadow">{m.label}</span>
                  <span className="block text-xs font-bold text-white/80">{m.desc}</span>
                </span>
                <span className="relative text-xl text-white/70" aria-hidden>›</span>
              </button>
            );
          })}
          {error && (
            <p className="rounded-2xl bg-rose-500/20 px-4 py-3 text-center text-sm font-bold text-rose-100 ring-1 ring-rose-300/40">
              {error}
            </p>
          )}
          <p className="pt-2 text-center text-xs font-bold text-white/55">Lớp {grade} · đổi ở mục “Chọn lớp học”</p>
        </div>
      </Stage>
    );
  }

  // ── 4 & 5. MÀN CHƠI + TRỢ GIÚP ──
  if (screen === 'play' && current && session) {
    const answered = ans.correctIndex != null;
    return (
      <Stage>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-sm font-black text-white ring-1 ring-white/20">
            Câu {idx + 1}/{queue.length}
          </span>
          <div className="order-last h-2.5 w-full overflow-hidden rounded-full bg-white/15 sm:order-none sm:w-auto sm:flex-1">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${((idx + (answered ? 1 : 0)) / queue.length) * 100}%`, background: 'linear-gradient(90deg,#4ade80,#22d3ee)' }} />
          </div>
          {mode === 'speed' && (
            <span className={`rounded-full px-3 py-1.5 text-sm font-black ${seconds <= 10 ? 'bg-rose-500 text-white' : 'bg-white/10 text-white ring-1 ring-white/20'}`}>
              ⏱️ {seconds}s
            </span>
          )}
          <button
            onClick={() => {
              const n = !sound;
              setSound(n);
              setSfxEnabled(n);
              if (n) unlockSfx(); else { stopSpeaking(); stopSuspense(); stopMusic(); }
            }}
            aria-label={sound ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className={`grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/25 ${sound ? 'bg-white/15 text-white' : 'bg-white/5 text-white/40'}`}
          >{sound ? '🔊' : '🔇'}</button>
          <CoinChip coins={coins} />
        </div>

        {prize > 0 && (
          <p className="mb-2 text-center text-xs font-black text-white/70">
            Đang có <span className="text-[#FFD54A]">{formatVnd(prize)}</span>
            {session && session.safeLevels.some((sl) => sl < idx) && ' · đã qua mốc an toàn 🛡️'}
          </p>
        )}

        {/* Điện thoại: dải mốc gọn nằm trên câu hỏi */}
        <div className="mb-3 sm:hidden">
          <PrizeStrip prizes={session.prizes} safeLevels={session.safeLevels} current={idx} />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
          <div>
            <div className="rounded-3xl bg-white p-4 shadow-xl sm:p-5">
              <div className="flex items-start gap-3">
                <button onClick={() => { unlockAudio(); unlockSfx(); readQuestion(current); }}
                  aria-label="Nghe lại câu hỏi"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e8f0ff] text-[#1e4fd8]">🔊</button>
                <p className="min-w-0 whitespace-pre-line text-lg font-black leading-7 text-[#0a1a52]">{current.questionText}</p>
              </div>
              <p className="mt-2 text-[11px] font-bold text-slate-400">{current.skillName}</p>
            </div>

            <div className="mt-3">
              <AnswerGrid options={current.options} state={{ ...ans, pending }} onPick={pick} />
            </div>

            {error && (
              <p className="mt-3 rounded-2xl bg-rose-500/20 px-4 py-3 text-center text-sm font-bold text-rose-100 ring-1 ring-rose-300/40">
                {error}
              </p>
            )}

            {pending != null && !answered && !revealing && (
              <div className="mt-3 rounded-2xl bg-white/12 p-4 text-center ring-1 ring-white/20">
                <p className="text-sm font-black text-white">
                  Bé chọn <span className="text-[#FFD54A]">{'ABCD'[pending]}</span>. Đây là câu trả lời cuối cùng chứ?
                </p>
                <div className="mt-3 flex gap-2">
                  <GameButton onClick={confirm}>✅ Chắc chắn</GameButton>
                  <GameButton variant="ghost" onClick={() => { setPending(null); sfxSelect(); }}>Chọn lại</GameButton>
                </div>
              </div>
            )}

            {revealing && (
              <p className="mt-4 animate-pulse text-center text-lg font-black text-[#FFD54A]">
                Đáp án của bé là…
              </p>
            )}

            {milestone && (
              <div className="mt-3 overflow-hidden rounded-2xl px-4 py-3 text-center"
                style={{ background: 'linear-gradient(180deg,#FFE27A,#F0A400)', boxShadow: '0 6px 0 #B96A00' }}>
                <p className="text-base font-black text-[#5a2d00]">🛡️ {milestone.title}</p>
                <p className="mt-0.5 text-sm font-bold text-[#7a3f00]">{milestone.sub}</p>
              </div>
            )}

            {answered && explain && (
              <div className="mt-3 rounded-2xl bg-white/12 p-4 ring-1 ring-white/20">
                <p className="text-sm font-black text-[#FFD54A]">
                  {ans.picked === ans.correctIndex ? '🎉 Chính xác!' : '💡 Chưa đúng rồi'}
                </p>
                <p className="mt-1 text-sm leading-6 text-white/85">{explain}</p>
                <div className="mt-3">
                  <GameButton onClick={next}>
                    {idx + 1 >= queue.length ? 'Xem kết quả →' : 'Câu tiếp theo →'}
                  </GameButton>
                </div>
              </div>
            )}

            {!answered && pending == null && !revealing && (
              <div className="mt-3 flex justify-center gap-3">
                <HintButton icon={HINT_ICON.fifty} label="Gợi ý" cost={HINT_COST.fifty} used={usedHints.includes('fifty')} onClick={() => applyHint('fifty')} />
                <HintButton icon={HINT_ICON.friends} label="Hỏi bạn" cost={HINT_COST.friends} used={usedHints.includes('friends')} onClick={() => applyHint('friends')} />
                <HintButton icon={HINT_ICON.swap} label="Đổi câu" cost={HINT_COST.swap} used={usedHints.includes('swap')} onClick={() => applyHint('swap')} />
                <button onClick={() => setShowHints(true)}
                  className="self-center text-xs font-black text-white/60 underline hover:text-white">
                  Xem tất cả
                </button>
              </div>
            )}

            {/* Dừng cuộc chơi — luật của chương trình: bỏ cuộc thì được giữ
                trọn số tiền đang có, thay vì mạo hiểm rồi tụt về mốc an toàn. */}
            {!answered && pending == null && !revealing && mode === 'classic' && prize > 0 && (
              <div className="mt-4 text-center">
                <button onClick={() => finish('stop')}
                  className="rounded-full bg-white/10 px-5 py-2 text-xs font-black text-white/80 ring-1 ring-white/25 hover:bg-white/20">
                  🛑 Dừng cuộc chơi và giữ {formatVnd(prize)}
                </button>
              </div>
            )}
          </div>

          {/* Thang đầy đủ chỉ hiện từ màn hình vừa trở lên — 15 dòng trên điện
              thoại sẽ chiếm hết chỗ và đẩy câu hỏi xuống dưới đáy. */}
          <div className="hidden sm:block">
            <PrizeLadder prizes={session.prizes} safeLevels={session.safeLevels} current={idx} compact />
          </div>
        </div>

        {showHints && <HintSheet coins={coins} used={usedHints} onPick={applyHint} onClose={() => setShowHints(false)} />}
      </Stage>
    );
  }

  // ── 6 & 7. KẾT QUẢ + PHÂN TÍCH NĂNG LỰC ──
  if (screen === 'result') {
    const correct = log.filter((x) => x.isCorrect).length;
    const weakest = report.length ? report[report.length - 1] : null;
    return (
      <Stage>
        <div className="mx-auto max-w-lg">
          <div className="mb-4 text-center">
            <div className="text-5xl" aria-hidden>{ending === 'win' ? '🎉' : ending === 'stop' ? '🤝' : prize > 0 ? '💪' : '🌱'}</div>
            <div className="mt-2">
              <Ribbon>{ending === 'win' ? 'CHÚC MỪNG!' : ending === 'stop' ? 'DỪNG CUỘC CHƠI' : 'RẤT TIẾC!'}</Ribbon>
            </div>
            <p className="mt-2 text-sm font-bold text-white/85">
              {ending === 'win' && 'Bé đã chinh phục toàn bộ thang tiền!'}
              {ending === 'stop' && `Bé dừng đúng lúc và giữ trọn số tiền. Đúng ${correct}/${log.length} câu.`}
              {ending === 'lose' && (prize > 0
                ? `Câu trả lời chưa đúng — bé về mốc an toàn và giữ được ${formatVnd(prize)}.`
                : 'Câu trả lời chưa đúng. Bé chưa qua mốc an toàn nào, thử lại nhé!')}
            </p>
          </div>

          <Panel className="text-center">
            <p className="text-xs font-black text-slate-400">Câu {log.length}/{queue.length}</p>
            <div className="mt-2 rounded-3xl px-4 py-4" style={{ background: 'linear-gradient(180deg,#FFF7D6,#FFE8A3)' }}>
              <p className="text-xs font-black uppercase tracking-widest text-[#C77800]">Tiền thưởng</p>
              <p className="flex items-center justify-center gap-2 text-3xl font-black text-[#5a2d00]">
                <Coin size={30} /> {formatVnd(prize)}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <Stat icon="hom-nay/04_fire_streak_orange.webp" label="Chuỗi đúng" value={String(bestCombo)} />
              <Stat icon="hom-nay/16_clipboard_check_orange.webp" label="Đúng" value={`${correct}/${log.length}`} />
              <Stat icon="hom-nay/03_star_badge_purple.webp" label="Lớp" value={String(grade)} />
            </div>
          </Panel>

          {report.length > 0 && (
            <Panel className="mt-4">
              <h3 className="mb-3 flex items-center gap-2 text-base font-black text-[#0a1a52]">
                <Icon name="hom-nay/17_chart_growth_green.webp" size={22} /> Phân tích năng lực
              </h3>
              <ul className="space-y-2.5">
                {report.map((r) => (
                  <li key={r.code}>
                    <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>{r.icon} {r.name}</span>
                      <span>{r.percent}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${r.percent}%`, background: r.percent >= 80 ? '#22c55e' : r.percent >= 50 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </li>
                ))}
              </ul>
              {weakest && weakest.percent < 80 && (
                <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                  💡 Bé nên luyện thêm <strong>{weakest.name}</strong>.{' '}
                  <Link href={`/ky-nang/toan-lop-${grade}/${weakest.code}`} className="underline">Luyện ngay →</Link>
                </p>
              )}
            </Panel>
          )}

          <div className="mt-4 space-y-3">
            <GameButton onClick={() => start(mode)}>🔄 Chơi ván nữa</GameButton>
            <GameButton variant="blue" onClick={openBoard}>🏆 Bảng xếp hạng</GameButton>
            <GameButton variant="ghost" onClick={() => setScreen('home')}>Về trang chính</GameButton>
          </div>
        </div>
      </Stage>
    );
  }

  // ── 8. BẢNG XẾP HẠNG ──
  if (screen === 'board') {
    const medal = ['🥇', '🥈', '🥉'];
    return (
      <Stage>
        <TopBar title="Bảng xếp hạng" onBack={() => setScreen('home')} />
        <div className="mx-auto max-w-lg">
          <div className="mb-3 flex gap-2">
            {(['week', 'month'] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-black transition ${period === p ? 'bg-white text-[#0a1a52]' : 'bg-white/10 text-white/80 ring-1 ring-white/20'}`}>
                {p === 'week' ? 'Tuần này' : 'Tháng này'}
              </button>
            ))}
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/80 ring-1 ring-white/20">Lớp {grade}</span>
          </div>
          <Panel>
            {board.length === 0 ? (
              <p className="py-8 text-center text-sm font-bold text-slate-400">Chưa có ai xếp hạng. Bé chơi một ván để lên bảng nhé!</p>
            ) : (
              <ol className="space-y-1.5">
                {board.map((r) => (
                  <li key={r.name + r.rank}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${r.rank <= 3 ? 'bg-amber-50' : ''}`}>
                    <span className="w-7 shrink-0 text-center text-lg font-black text-slate-500">
                      {medal[r.rank - 1] ?? r.rank}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element -- ảnh tĩnh trong /public */}
                    <img src={`/avatars/avatar-be-0${((r.rank - 1) % 8) + 1}.webp`} alt="" draggable={false}
                      className="h-9 w-9 shrink-0 rounded-full bg-sky-100 object-cover" />
                    <span className="min-w-0 flex-1 truncate font-black text-[#0a1a52]">{r.name}</span>
                    <span className="shrink-0 font-black text-amber-600">⭐ {formatVnd(r.score)}</span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      </Stage>
    );
  }

  return (
    <Stage>
      <p className="py-20 text-center font-black text-white/80">Đang chuẩn bị…</p>
    </Stage>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <button onClick={onBack} aria-label="Quay lại"
        className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25">‹</button>
      <h2 className="flex-1 text-center text-xl font-black text-white">{title}</h2>
      <span className="w-10" />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-2 py-2.5">
      <Icon name={icon} size={22} className="mx-auto" />
      <p className="mt-1 text-[10px] font-bold text-slate-400">{label}</p>
      <p className="text-sm font-black text-[#0a1a52]">{value}</p>
    </div>
  );
}

function HintButton({ icon, label, cost, used, onClick }: {
  icon: string; label: string; cost: number; used: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} disabled={used}
      className="flex flex-col items-center gap-1 disabled:opacity-35">
      <span className="grid h-14 w-14 place-items-center rounded-full ring-2 ring-white/25"
        style={{ background: 'linear-gradient(180deg,rgba(255,255,255,.2),rgba(255,255,255,.08))' }}>
        <Icon name={icon} size={30} />
      </span>
      <span className="text-[11px] font-black text-white">{label}</span>
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFD54A]"><Coin size={13} /> {cost}</span>
    </button>
  );
}

function HintSheet({ coins, used, onPick, onClose }: {
  coins: number; used: string[];
  onPick: (k: 'fifty' | 'friends' | 'swap') => void; onClose: () => void;
}) {
  const items = [
    { k: 'fifty' as const, icon: HINT_ICON.fifty, label: 'Gợi ý', desc: 'Loại bỏ 2 đáp án sai', cost: HINT_COST.fifty },
    { k: 'friends' as const, icon: HINT_ICON.friends, label: 'Hỏi bạn', desc: 'Hỏi ý kiến bạn bè', cost: HINT_COST.friends },
    { k: 'swap' as const, icon: HINT_ICON.swap, label: 'Đổi câu hỏi', desc: 'Đổi sang câu khác', cost: HINT_COST.swap },
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-black text-[#0a1a52]">Trợ giúp</h3>
            <button onClick={onClose} aria-label="Đóng" className="text-slate-400">✕</button>
          </div>
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.k}>
                <button onClick={() => onPick(it.k)} disabled={used.includes(it.k) || coins < it.cost}
                  className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left transition hover:bg-slate-100 disabled:opacity-40">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm">
                    <Icon name={it.icon} size={26} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-black text-[#0a1a52]">{it.label}</span>
                    <span className="block text-xs font-bold text-slate-500">{it.desc}</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-black text-amber-600"><Coin size={16} /> {it.cost}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
