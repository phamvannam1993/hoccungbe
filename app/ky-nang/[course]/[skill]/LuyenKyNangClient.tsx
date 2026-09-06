'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getSession, checkAnswer, getVariant, submitSession, getChildSkillLevel,
  type PracticeQuestion, type CheckResult, type MasteryProgress, type ChildSkillLevel,
} from '../../../lib/skillPractice';
import { getCurrentChildId, isGuest } from '../../../lib/childData';
import { speakSequence, stopSpeaking, unlockAudio } from '../../../components/edu/utils/speech';
import { splitForSpeech, type SpeechSubject } from '../../../lib/skillSpeech';

// Một phiên luyện TỔNG HỢP của một kỹ năng — không đi qua từng bài học.
// Vòng học: chọn đáp án → chấm ngay → giải thích CÁCH LÀM → nếu sai thì
// làm lại một câu cùng dạng khác số liệu rồi mới đi tiếp.

type Stage = 'idle' | 'loading' | 'playing' | 'done';
type Answer = { questionId: number; selectedIndex: number | null; isCorrect: boolean; retriedCorrect?: boolean };

const DIFF_LABEL: Record<string, { text: string; cls: string }> = {
  easy: { text: 'Dễ', cls: 'bg-emerald-50 text-emerald-600' },
  medium: { text: 'Trung bình', cls: 'bg-sky-50 text-sky-600' },
  hard: { text: 'Khó', cls: 'bg-amber-50 text-amber-600' },
};

const OPT_LETTER = ['A', 'B', 'C', 'D', 'E', 'F'];

const SOUND_KEY = 'bhh_skill_sound';

const LEVEL_STEPS = ['Mới bắt đầu', 'Đang học', 'Khá', 'Giỏi', 'Thành thạo'];

/** Thang 5 bậc — cho bé thấy mình đang ở đâu và còn bao xa tới bậc sau. */
function LevelBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {LEVEL_STEPS.map((name, i) => (
        <div key={name} className="flex-1">
          <div className={`h-1.5 rounded-full ${i <= level ? 'bg-violet-500' : 'bg-slate-200'}`} />
          <p className={`mt-1 text-center text-[10px] font-bold ${i === level ? 'text-violet-600' : 'text-slate-400'}`}>
            {name}
          </p>
        </div>
      ))}
    </div>
  );
}

const DIFF_NAME: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };

/**
 * Nói rõ cách lên bậc bằng con số thật của bé.
 * Thanh bậc mà không kèm điều kiện thì bé và phụ huynh không biết phải làm gì
 * để tiến lên — đó là câu hỏi đầu tiên ai nhìn thanh này cũng đặt ra.
 */
function HowToLevelUp({ p }: { p: ChildSkillLevel['progress'] }) {
  if (p.isMax) {
    return (
      <p className="mt-3 text-center text-xs font-bold text-emerald-600">
        🎉 Bé đã đạt bậc cao nhất. Quay lại luyện đều để giữ phong độ nhé!
      </p>
    );
  }
  const daysLeft = Math.max(0, p.needDays - p.distinctDays);
  return (
    <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-slate-100">
      <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Cách lên bậc tiếp theo</p>
      <ul className="mt-1.5 space-y-1 text-xs leading-5 text-slate-600">
        <li className="flex items-start gap-1.5">
          <span aria-hidden>{p.toNextLevel === 0 ? '✅' : '📝'}</span>
          <span>
            Làm đúng <strong>{p.needCorrect}/{p.needQuestions}</strong> câu ở mức{' '}
            <strong>{DIFF_NAME[p.difficulty]}</strong>
            {p.toNextLevel > 0 && <> — còn thiếu <strong className="text-violet-600">{p.toNextLevel} câu</strong></>}
          </span>
        </li>
        <li className="flex items-start gap-1.5">
          <span aria-hidden>{daysLeft === 0 ? '✅' : '📅'}</span>
          <span>
            Luyện vào <strong>{p.needDays} ngày khác nhau</strong> (đã có {p.distinctDays})
            {daysLeft > 0 && <> — nhớ lâu mới là giỏi thật, nên không thể cày xong trong một buổi</>}
          </span>
        </li>
      </ul>
    </div>
  );
}

export default function LuyenKyNangClient({
  skillCode,
  skillName,
  icon,
  grade,
  subject,
}: {
  skillCode: string;
  skillName: string;
  icon?: string | null;
  grade: string;
  /** Môn quyết định cách đọc: Toán đọc đơn vị đo, Tiếng Việt đọc âm con chữ. */
  subject: SpeechSubject;
}) {
  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<PracticeQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [retry, setRetry] = useState<PracticeQuestion | null>(null);
  const [pendingVariant, setPendingVariant] = useState<PracticeQuestion | null>(null);
  const startedAt = useRef<number>(0);
  const [sound, setSound] = useState(true);
  const [level, setLevel] = useState<{ level: number; name: string } | null>(null);
  const [howTo, setHowTo] = useState<ChildSkillLevel['progress'] | null>(null);
  const [mastery, setMastery] = useState<MasteryProgress | null>(null);

  // Nạp bậc thành thạo ngay khi mở trang, để bé thấy mình đang ở đâu
  // trước cả khi bấm luyện.
  useEffect(() => {
    const cid = getCurrentChildId();
    if (!cid) return;
    getChildSkillLevel(cid, skillCode)
      .then((r) => { setLevel({ level: r.level, name: r.levelName }); setHowTo(r.progress); })
      .catch(() => { /* chưa luyện hoặc lỗi mạng thì chỉ không hiện thanh bậc */ });
  }, [skillCode]);

  // Nhớ lựa chọn bật/tắt tiếng của từng máy.
  useEffect(() => {
    try {
      const v = localStorage.getItem(SOUND_KEY);
      if (v != null) setSound(v === '1');
    } catch { /* trình duyệt chặn lưu thì cứ để mặc định bật */ }
  }, []);

  function toggleSound() {
    // Tác dụng phụ để NGOÀI hàm cập nhật state: React có thể gọi hàm cập nhật
    // nhiều lần, đặt unlockAudio/stopSpeaking bên trong sẽ chạy lặp.
    const next = !sound;
    // Bật tiếng cũng là một cú chạm — mở khoá luôn, nếu không iOS sẽ chặn mọi
    // lần phát tự động sau đó.
    if (next) unlockAudio();
    else stopSpeaking();
    try { localStorage.setItem(SOUND_KEY, next ? '1' : '0'); } catch { /* bỏ qua */ }
    setSound(next);
  }

  // Câu hỏi thường trộn hai thứ tiếng ('Từ "window" nghĩa là gì?'), nên phải
  // cắt thành từng đoạn kèm ngôn ngữ rồi phát nối tiếp — đọc cả câu bằng một
  // giọng thì từ tiếng Anh sai bét.
  const speak = useCallback((text: string) => {
    if (!text) return;
    speakSequence(splitForSpeech(text, subject));
  }, [subject]);

  const say = useCallback((text: string) => {
    if (!sound || !text) return;
    speak(text);
  }, [sound, speak]);

  // Câu đang hiển thị: câu chính, hoặc câu tương tự khi bé đang làm lại.
  const current = retry ?? queue[idx];
  const total = queue.length;

  // Đọc câu hỏi mỗi khi chuyển sang câu mới. Nhiều bé lớp 1–2 chưa đọc trôi,
  // nghe được đề mới làm được bài.
  //
  // Hai cái bẫy ở đây, cùng vì cả app dùng CHUNG một thẻ <audio>:
  //  1. `unlockAudio()` phát một WAV im lặng rồi mới `pause()` trong callback
  //     bất đồng bộ — chạy muộn thì nó tạm dừng luôn câu hỏi vừa phát. Hoãn một
  //     nhịp để phần mở khoá kịp xong.
  //  2. KHÔNG gọi `stopSpeaking()` trong hàm dọn dẹp: ở chế độ dev, React gắn –
  //     tháo – gắn lại hiệu ứng, hàm dọn dẹp sẽ cắt tiếng ngay khi vừa phát.
  //     Chỉ huỷ hẹn giờ, còn dừng tiếng thì làm ở đầu lần chạy sau.
  useEffect(() => {
    if (stage !== 'playing' || !current || !sound) return;
    stopSpeaking();
    const timer = setTimeout(() => speak(current.questionText), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, stage, sound]);

  const start = useCallback(async (count = 10) => {
    // Phải gọi trong chính cử chỉ chạm, nếu không iOS chặn mọi lần phát sau đó.
    unlockAudio();
    setStage('loading');
    setError(null);
    try {
      const s = await getSession(skillCode, grade, count, getCurrentChildId() || null);
      if (!s.questions.length) {
        setError('Kỹ năng này chưa có câu luyện tập.');
        setStage('idle');
        return;
      }
      setQueue(s.questions);
      setLevel({ level: s.level, name: s.levelName });
      setMastery(null);
      setIdx(0);
      setAnswers([]);
      setPicked(null);
      setResult(null);
      setRetry(null);
      startedAt.current = Date.now();
      setStage('playing');
    } catch {
      setError('Không tải được câu hỏi. Bé thử lại nhé!');
      setStage('idle');
    }
  }, [skillCode, grade]);

  async function pick(i: number) {
    if (picked != null || !current) return;
    setPicked(i);
    try {
      const r = await checkAnswer(current.id, i);
      setResult(r);
      // Tự đọc NHẬN XÉT → ĐÁP ÁN ĐÚNG → CÁCH LÀM, không bắt bé phải bấm nút.
      // Đáp án để trong ngoặc kép để phần luyện tiếng Anh đọc đúng giọng Anh.
      const nhanXet = r.isCorrect ? 'Chính xác!' : 'Chưa đúng rồi.';
      say(`${nhanXet} Đáp án đúng là "${r.correctAnswer}". ${r.explanation}`);
      // Sai ở câu chính thì nạp sẵn một câu cùng dạng để bé thử lại ngay.
      if (!r.isCorrect && !retry) {
        getVariant(current.id)
          .then((v) => setPendingVariant(v))
          .catch(() => setPendingVariant(null));
      }
    } catch {
      setResult(null);
      setPicked(null);
    }
  }

  function tryVariant() {
    if (!pendingVariant) return;
    setRetry(pendingVariant);
    setPendingVariant(null);
    setPicked(null);
    setResult(null);
  }

  function next() {
    if (!current || !result) return;

    if (retry) {
      // Lượt làm lại không tính thêm câu, chỉ đánh dấu bé đã hiểu ra hay chưa.
      const mainId = queue[idx].id;
      const updated = answers.map((a) => (a.questionId === mainId ? { ...a, retriedCorrect: result.isCorrect } : a));
      setAnswers(updated);
      setRetry(null);
      clearQuestionState();
      if (idx + 1 >= total) return finish(updated);
      setIdx((i) => i + 1);
      return;
    }

    const updated = [...answers, { questionId: current.id, selectedIndex: picked, isCorrect: result.isCorrect }];
    setAnswers(updated);
    clearQuestionState();
    if (idx + 1 >= total) return finish(updated);
    setIdx((i) => i + 1);
  }

  function clearQuestionState() {
    setPicked(null);
    setResult(null);
    setPendingVariant(null);
  }

  async function finish(final: Answer[]) {
    stopSpeaking();
    setStage('done');
    setAnswers(final);
    const childId = getCurrentChildId();
    if (!childId || isGuest()) return; // Khách vẫn luyện được, chỉ không lưu lên server.
    try {
      const r = await submitSession({
        childId,
        skillCode,
        grade: Number(grade),
        timeSpentSec: Math.round((Date.now() - startedAt.current) / 1000),
        answers: final,
      });
      setMastery(r.mastery);
    } catch { /* không chặn màn hình kết quả nếu lưu lỗi */ }
  }

  // ── IDLE ──
  if (stage === 'idle' || stage === 'loading') {
    return (
      <div className="rounded-3xl border-2 border-violet-200 bg-white p-5 sm:p-6" style={{ boxShadow: '0 6px 22px rgba(124,58,237,0.18)' }}>
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-50 text-2xl" aria-hidden>{icon ?? '🎯'}</span>
          <div className="min-w-0">
            <h2 className="text-lg font-black text-slate-900 sm:text-xl">Luyện {skillName.toLowerCase()}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Một lượt gồm các câu trộn từ dễ đến khó của riêng kỹ năng này. Sai câu nào, bé được giải thích cách làm rồi thử lại một câu tương tự.
            </p>
          </div>
        </div>
        {level && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-3">
            <p className="mb-2 text-xs font-black text-slate-500">
              Bé đang ở bậc <span className="text-violet-600">{level.name}</span>
            </p>
            <LevelBar level={level.level} />
            {howTo && <HowToLevelUp p={howTo} />}
          </div>
        )}
        {error && <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => start(10)} disabled={stage === 'loading'}
            className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
            {stage === 'loading' ? 'Đang chuẩn bị…' : '🚀 Luyện 10 câu'}
          </button>
          <button onClick={() => start(5)} disabled={stage === 'loading'}
            className="rounded-full border-2 border-violet-200 px-5 py-3 text-sm font-black text-violet-600 transition hover:bg-violet-50 disabled:opacity-60">
            Làm nhanh 5 câu
          </button>
        </div>
      </div>
    );
  }

  // ── DONE ──
  if (stage === 'done') {
    const done = answers.length;
    const right = answers.filter((a) => a.isCorrect).length;
    const pct = done ? Math.round((right / done) * 100) : 0;
    const fixed = answers.filter((a) => !a.isCorrect && a.retriedCorrect).length;
    return (
      <div className="rounded-3xl border-2 border-violet-200 bg-white p-6 text-center" style={{ boxShadow: '0 6px 22px rgba(124,58,237,0.18)' }}>
        <div className="text-5xl" aria-hidden>{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '🌱'}</div>
        <h2 className="mt-2 text-xl font-black text-slate-900">
          {pct >= 80 ? 'Bé làm rất tốt!' : pct >= 50 ? 'Bé đang tiến bộ!' : 'Cùng luyện thêm nhé!'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Đúng <strong className="text-violet-600">{right}/{done}</strong> câu {skillName.toLowerCase()} ({pct}%)
        </p>
        {fixed > 0 && (
          <p className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
            ✓ {fixed} câu sai đã làm lại đúng ở câu tương tự
          </p>
        )}

        {mastery && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-left">
            {mastery.changed === 'up' && (
              <p className="mb-2 text-center text-sm font-black text-violet-600">
                🎊 Bé vừa lên bậc {mastery.levelName}!
              </p>
            )}
            {mastery.changed === 'down' && (
              <p className="mb-2 text-center text-sm font-bold text-slate-500">
                Bài sẽ quay về mức vừa sức hơn để bé chắc lại nền.
              </p>
            )}
            <LevelBar level={mastery.level} />
            {mastery.level < 4 && (
              <p className="mt-3 text-center text-xs font-bold text-slate-500">
                {mastery.toNextLevel > 0
                  ? `Còn ${mastery.toNextLevel} câu đúng nữa là lên bậc tiếp theo.`
                  : mastery.distinctDays < mastery.needDays
                    ? `Bé làm rất tốt! Quay lại luyện vào một ngày khác nữa là lên bậc — nhớ lâu mới là giỏi thật.`
                    : 'Bé sắp lên bậc rồi!'}
              </p>
            )}
          </div>
        )}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button onClick={() => start(10)} className="rounded-full bg-violet-600 px-6 py-3 text-sm font-black text-white hover:bg-violet-700">
            🔄 Luyện lượt nữa
          </button>
        </div>
      </div>
    );
  }

  // ── PLAYING ──
  if (!current) return null;
  const diff = DIFF_LABEL[current.difficulty] ?? DIFF_LABEL.easy;
  const progress = Math.round(((idx + (result ? 1 : 0)) / total) * 100);

  return (
    <div className="rounded-3xl border-2 border-violet-200 bg-white p-5 sm:p-6" style={{ boxShadow: '0 6px 22px rgba(124,58,237,0.18)' }}>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-black text-slate-500">Câu {idx + 1}/{total}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${diff.cls}`}>{diff.text}</span>
        {retry && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-black text-violet-600">Câu tương tự</span>}
        <button
          onClick={toggleSound}
          aria-label={sound ? 'Tắt giọng đọc' : 'Bật giọng đọc'}
          title={sound ? 'Tắt giọng đọc' : 'Bật giọng đọc'}
          className={`ml-auto grid h-8 w-8 place-items-center rounded-full transition ${sound ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-400'}`}
        >
          {sound ? '🔊' : '🔇'}
        </button>
        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <button
          onClick={() => { unlockAudio(); speak(current.questionText); }}
          aria-label="Nghe lại câu hỏi"
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-600 transition hover:bg-violet-100"
        >
          🔊
        </button>
        <p className="whitespace-pre-line text-lg font-bold leading-7 text-slate-900">{current.questionText}</p>
      </div>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {current.options.map((o, i) => {
          const isPicked = picked === i;
          const isRight = result && i === result.correctIndex;
          const isWrongPick = result && isPicked && !result.isCorrect;
          const base = 'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition';
          const tone = isRight
            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
            : isWrongPick
              ? 'border-rose-400 bg-rose-50 text-rose-700'
              : 'border-slate-200 text-slate-700 hover:-translate-y-0.5 hover:border-violet-300';
          return (
            <li key={i}>
              <button onClick={() => pick(i)} disabled={picked != null} className={`${base} ${tone} disabled:cursor-default`}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-sm font-black ring-2 ring-current">
                  {OPT_LETTER[i]}
                </span>
                <span className="min-w-0">{o}</span>
                {isRight && <span className="ml-auto" aria-hidden>✓</span>}
                {isWrongPick && <span className="ml-auto" aria-hidden>✗</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {result && (
        <div className={`mt-4 rounded-2xl p-4 ${result.isCorrect ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          <p className={`text-sm font-black ${result.isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
            {result.isCorrect ? '🎉 Chính xác!' : '💡 Thử nghĩ lại nhé!'}
          </p>
          <div className="mt-1 flex items-start gap-2">
            <button
              onClick={() => { unlockAudio(); speak(`Đáp án đúng là "${result.correctAnswer}". ${result.explanation}`); }}
              aria-label="Nghe lại lời giải thích"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/70 text-sm transition hover:bg-white"
            >
              🔊
            </button>
            <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{result.explanation}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pendingVariant && (
              <button onClick={tryVariant} className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-black text-white hover:bg-amber-600">
                🔄 Thử một câu tương tự
              </button>
            )}
            <button onClick={next} className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-black text-white hover:bg-violet-700">
              {idx + 1 >= total && !retry ? 'Xem kết quả →' : 'Câu tiếp theo →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
