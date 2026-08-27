'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../lib/api';
import { getCurrentChildId, listChildren } from '../lib/childData';
import { playCorrect, playWrong, playWin, confetti } from '../lib/celebrate';
import { shareAchievement } from '../lib/share';
import { KHAM_PHA_TOPICS } from '../lib/khampha';
import { shuffleQuiz } from '../lib/quizShuffle';

type Problem = { prompt: string; options: string[]; correctIndex: number };
type LeaderRow = { name: string; score: number; rank: number };
type Subject = 'toan' | 'kham-pha';

const DURATION = 60;
const SUBJECTS: { key: Subject; label: string; emoji: string }[] = [
  { key: 'toan', label: 'Toán tốc độ', emoji: '➗' },
  { key: 'kham-pha', label: 'Khám phá', emoji: '🔎' },
];
const SUBJECT_LABEL: Record<Subject, string> = { toan: 'Toán', 'kham-pha': 'Khám phá' };

// Gộp toàn bộ câu hỏi khám phá để bốc ngẫu nhiên.
const KHAM_PHA_ALL = KHAM_PHA_TOPICS.flatMap((t) => t.questions);

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sinh phép tính theo LỚP để công bằng: lớp 1 dễ, lớp lớn khó dần.
function makeMath(grade: number): Problem {
  let text = '', answer = 0;
  const g = Math.min(5, Math.max(1, grade));
  if (g === 1) {
    if (randInt(0, 1) === 0) { const a = randInt(1, 10), b = randInt(1, 10); text = `${a} + ${b}`; answer = a + b; }
    else { const a = randInt(2, 20), b = randInt(1, a); text = `${a} − ${b}`; answer = a - b; }
  } else if (g === 2) {
    const r = randInt(0, 2);
    if (r === 0) { const a = randInt(5, 50), b = randInt(5, 50); text = `${a} + ${b}`; answer = a + b; }
    else if (r === 1) { const a = randInt(10, 90), b = randInt(1, a); text = `${a} − ${b}`; answer = a - b; }
    else { const a = randInt(2, 5), b = randInt(2, 5); text = `${a} × ${b}`; answer = a * b; }
  } else if (g === 3) {
    const r = randInt(0, 3);
    if (r === 0) { const a = randInt(2, 9), b = randInt(2, 9); text = `${a} × ${b}`; answer = a * b; }
    else if (r === 1) { const b = randInt(2, 9), q = randInt(2, 9); text = `${b * q} ÷ ${b}`; answer = q; }
    else if (r === 2) { const a = randInt(20, 90), b = randInt(10, 90); text = `${a} + ${b}`; answer = a + b; }
    else { const a = randInt(30, 99), b = randInt(1, a); text = `${a} − ${b}`; answer = a - b; }
  } else if (g === 4) {
    const r = randInt(0, 3);
    if (r === 0) { const a = randInt(11, 30), b = randInt(2, 9); text = `${a} × ${b}`; answer = a * b; }
    else if (r === 1) { const b = randInt(2, 9), q = randInt(10, 20); text = `${b * q} ÷ ${b}`; answer = q; }
    else if (r === 2) { const a = randInt(100, 900), b = randInt(50, 500); text = `${a} + ${b}`; answer = a + b; }
    else { const a = randInt(200, 999), b = randInt(1, a); text = `${a} − ${b}`; answer = a - b; }
  } else {
    const r = randInt(0, 3);
    if (r === 0) { const a = randInt(11, 40), b = randInt(3, 12); text = `${a} × ${b}`; answer = a * b; }
    else if (r === 1) { const b = randInt(3, 12), q = randInt(10, 40); text = `${b * q} ÷ ${b}`; answer = q; }
    else if (r === 2) { const a = randInt(1000, 9000), b = randInt(100, 900); text = `${a} + ${b}`; answer = a + b; }
    else { const a = randInt(25, 99), b = randInt(11, 25); text = `${a} × ${b}`; answer = a * b; }
  }

  const spread = Math.max(2, Math.round(answer * 0.15)) + 3;
  const nums = new Set<number>([answer]);
  while (nums.size < 4) {
    const cand = answer + randInt(-spread, spread);
    if (cand >= 0 && cand !== answer) nums.add(cand);
  }
  const arr = [...nums].sort(() => randInt(-1, 1));
  return { prompt: `${text} = ?`, options: arr.map(String), correctIndex: arr.indexOf(answer) };
}

// Bốc ngẫu nhiên một câu đố khám phá.
function makeKham(): Problem {
  const q = KHAM_PHA_ALL[randInt(0, KHAM_PHA_ALL.length - 1)];
  const s = shuffleQuiz(q.options, q.correct_index, `${q.question}|${randInt(0, 999999)}`);
  return { prompt: q.question, options: s.options, correctIndex: s.correctIndex };
}

function makeQ(subject: Subject, grade: number): Problem {
  return subject === 'kham-pha' ? makeKham() : makeMath(grade);
}

export default function DauTruongClient() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [flashWrong, setFlashWrong] = useState(false);
  const [lostByWrong, setLostByWrong] = useState(false);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState(1);
  const [subject, setSubject] = useState<Subject>('toan');
  const [hasChild, setHasChild] = useState(false);
  const [viewGrade, setViewGrade] = useState(1);
  const [board, setBoard] = useState<LeaderRow[]>([]);
  const [week, setWeek] = useState('');
  const [myRank, setMyRank] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doShare = async () => {
    const r = await shareAchievement('dau-truong', name || 'Bé', `Hạng ${myRank} ${SUBJECT_LABEL[subject]} Lớp ${grade} · ${score} câu đúng`);
    if (r === 'copied') { setShareMsg('✅ Đã sao chép link! Dán vào Zalo/Facebook để khoe.'); setTimeout(() => setShareMsg(''), 3000); }
    else if (r === 'fail') { setShareMsg('Chưa chia sẻ được, thử lại nhé.'); setTimeout(() => setShareMsg(''), 2500); }
  };

  const loadBoard = useCallback(async (g: number, subj: Subject) => {
    try {
      const d = await apiFetch<{ week: string; rows: LeaderRow[] }>(`/challenges/leaderboard?grade=${g}&subject=${subj}&limit=20`);
      setBoard(d.rows || []);
      setWeek(d.week || '');
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    (async () => {
      let g = 1;
      try {
        const id = getCurrentChildId();
        if (id) {
          const kids = await listChildren();
          const c = kids.find((k) => k.id === id);
          if (c) {
            setHasChild(true);
            setName(c.nickname || c.fullName || '');
            g = Number(c.currentLevel) || 1;
          }
        }
      } catch {
        /* ignore */
      }
      setGrade(g);
      setViewGrade(g);
      loadBoard(g, 'toan');
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loadBoard]);

  const changeGrade = (g: number) => {
    setGrade(g);
    setViewGrade(g);
    loadBoard(g, subject);
  };

  const changeSubject = (s: Subject) => {
    setSubject(s);
    loadBoard(viewGrade, s);
  };

  // Xem BXH lớp khác (không đổi lớp thi đấu của bé).
  const viewBoard = (g: number) => {
    setViewGrade(g);
    loadBoard(g, subject);
  };

  const start = () => {
    setScore(0);
    setLeft(DURATION);
    setMyRank(null);
    setLostByWrong(false);
    setProblem(makeQ(subject, grade));
    setPhase('playing');
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('done');
          playWin();
          confetti('big');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const answer = (idx: number) => {
    if (phase !== 'playing' || !problem) return;
    if (idx === problem.correctIndex) {
      setScore((s) => s + 1);
      playCorrect();
      setProblem(makeQ(subject, grade));
    } else {
      // Sai một câu là dừng ngay (chế độ sinh tử).
      playWrong();
      setFlashWrong(true);
      setTimeout(() => setFlashWrong(false), 300);
      if (timerRef.current) clearInterval(timerRef.current);
      setLostByWrong(true);
      setPhase('done');
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await apiFetch<{ rank: number; best: number }>('/challenges/submit', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim() || 'Bé ẩn danh', score, grade, subject }),
      });
      setMyRank(res.rank);
      setViewGrade(grade);
      await loadBoard(grade, subject);
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  };

  const bigPrompt = (problem?.prompt.length ?? 0) <= 16;

  return (
    <div className="mt-6 space-y-6">
      {/* Khu thi đấu */}
      <div className={`rounded-3xl border-4 p-6 text-center transition ${flashWrong ? 'border-rose-300 bg-rose-50' : 'border-orange-100 bg-white'}`}>
        {phase === 'idle' && (
          <div className="py-6">
            <p className="text-5xl">⚔️</p>
            <h2 className="mt-3 text-xl font-black text-slate-800">Đấu Trường — Trả lời đúng liên tiếp</h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">Trả lời đúng càng nhiều câu liên tiếp càng tốt — <b className="text-rose-500">sai một câu là dừng!</b> Mỗi lớp & mỗi môn có bảng xếp hạng riêng.</p>

            {/* Chọn môn */}
            <div className="mt-4 inline-flex rounded-full bg-slate-100 p-1">
              {SUBJECTS.map((s) => (
                <button key={s.key} type="button" onClick={() => changeSubject(s.key)} className={`rounded-full px-4 py-1.5 text-sm font-black transition ${subject === s.key ? 'bg-white text-orange-600 shadow' : 'text-slate-500'}`}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>

            {hasChild ? (
              <p className="mt-4 inline-block rounded-full bg-orange-50 px-4 py-1.5 text-sm font-black text-orange-600">🎓 Thi đấu theo hồ sơ của bé: Lớp {grade}</p>
            ) : (
              <div className="mt-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-sm font-bold text-slate-500">Chọn lớp:</span>
                  {[1, 2, 3, 4, 5].map((g) => (
                    <button key={g} type="button" onClick={() => changeGrade(g)} className={`h-9 w-14 rounded-full border-2 text-sm font-black transition ${grade === g ? 'border-transparent bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-orange-300'}`}>
                      Lớp {g}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs font-semibold text-slate-400">Mẹo: <a href="/ho-so-be" className="text-orange-500 underline">tạo hồ sơ bé</a> (có chọn lớp) để tự động thi đúng lớp.</p>
              </div>
            )}
            <div className="mt-5">
              <button type="button" onClick={start} className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-3 text-base font-black text-white shadow-md">🚀 Bắt đầu ({SUBJECT_LABEL[subject]} · Lớp {grade})</button>
            </div>
          </div>
        )}

        {phase === 'playing' && problem && (
          <div>
            <div className="mx-auto flex max-w-md items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">⭐ {score} điểm</span>
              <span className={`rounded-full px-3 py-1 text-sm font-black ${left <= 10 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>⏱ {left}s</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-orange-400 transition-all duration-1000 ease-linear" style={{ width: `${(left / DURATION) * 100}%` }} />
            </div>
            <p className={`mx-auto mt-6 max-w-2xl font-black leading-snug text-slate-800 ${bigPrompt ? 'text-4xl sm:text-6xl' : 'text-xl sm:text-3xl'}`}>{problem.prompt}</p>
            <div className="mx-auto mt-6 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
              {problem.options.map((op, i) => (
                <button key={`${op}-${i}`} type="button" onClick={() => answer(i)} className="rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-lg font-black text-slate-800 transition hover:border-orange-400 hover:bg-orange-50 active:scale-95">
                  {op}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="py-4">
            <p className="text-5xl">{lostByWrong ? '😅' : '🎉'}</p>
            <h2 className="mt-2 text-2xl font-black text-slate-800">
              {lostByWrong ? 'Sai một câu rồi!' : 'Hết giờ!'} Bé đúng {score} câu liên tiếp
            </h2>
            {lostByWrong && problem && (
              <p className="mx-auto mt-1 max-w-lg text-sm font-semibold text-slate-500">Đáp án đúng là <b className="text-emerald-600">{problem.options[problem.correctIndex]}</b>.</p>
            )}
            {myRank ? (
              <div className="mt-2">
                <p className="text-lg font-black text-orange-600">🏆 Hạng {myRank} {SUBJECT_LABEL[subject]} Lớp {grade} tuần này!</p>
                <button type="button" onClick={doShare} className="mt-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 text-sm font-black text-white shadow">
                  📤 Khoe thành tích
                </button>
                {shareMsg && <p className="mt-1 text-xs font-bold text-emerald-600">{shareMsg}</p>}
              </div>
            ) : (
              <div className="mx-auto mt-4 flex max-w-sm flex-col items-center gap-2">
                <p className="text-sm font-semibold text-slate-500">Nhập tên để lên bảng xếp hạng:</p>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Tên của bé"
                  className="w-full rounded-full border-2 border-slate-200 px-4 py-2 text-center font-bold focus:border-orange-400 focus:outline-none" />
                <button type="button" onClick={submit} disabled={submitting} className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-sm font-black text-white shadow disabled:opacity-60">
                  {submitting ? 'Đang gửi…' : '📤 Nộp điểm'}
                </button>
              </div>
            )}
            <button type="button" onClick={start} className="mt-4 rounded-full border-2 border-orange-200 px-6 py-2 text-sm font-black text-orange-600">🔁 Chơi lại</button>
          </div>
        )}
      </div>

      {/* Bảng xếp hạng */}
      <div className="rounded-3xl border-2 border-slate-100 bg-white p-5">
        <div className="mb-3">
          <h2 className="text-lg font-black text-slate-800 kid-display">🏆 Bảng xếp hạng {SUBJECT_LABEL[subject]} · Lớp {viewGrade} {week && <span className="text-sm font-bold text-slate-400">· tuần {week}</span>}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400">Môn:</span>
              {SUBJECTS.map((s) => (
                <button key={s.key} type="button" onClick={() => changeSubject(s.key)} className={`h-7 rounded-full px-3 text-xs font-black transition ${subject === s.key ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400">Xem lớp:</span>
              {[1, 2, 3, 4, 5].map((g) => (
                <button key={g} type="button" onClick={() => viewBoard(g)} className={`h-7 rounded-full px-3 text-xs font-black transition ${viewGrade === g ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
        {board.length === 0 ? (
          <p className="py-6 text-center text-slate-400">Chưa có ai thi đấu môn này tuần này. Bé hãy là người đầu tiên!</p>
        ) : (
          <ol className="space-y-1.5">
            {board.map((r) => {
              const medal = r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `#${r.rank}`;
              return (
                <li key={`${r.rank}-${r.name}`} className={`flex items-center justify-between rounded-xl px-3 py-2 ${r.rank <= 3 ? 'bg-amber-50' : 'bg-slate-50'}`}>
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="w-7 text-center">{medal}</span>
                    <span className="truncate">{r.name}</span>
                  </span>
                  <span className="font-black text-orange-600">{r.score} điểm</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
