'use client';

import { useCallback, useState } from 'react';
import { PHONICS_GROUPS, phonemes, type PhonicsGroup, type PhonicsWord } from '../lib/phonics';
import PhonicsPic from './PhonicsPic';
import { speakEnglish, speakText, unlockAudio } from '../components/edu/utils/speech';

// Mini quiz cuối mỗi nhóm nguyên âm ngắn, 8 câu trộn 4 dạng:
//   listen  – nghe từ, chọn từ đúng (3 chữ)
//   picture – đọc từ, chọn hình đúng
//   vowel   – từ thiếu nguyên âm (s_n), chọn a/e/i/o/u
//   blend   – nhìn các âm /s/ /ʌ/ /n/, chọn từ ghép được
type Kind = 'listen' | 'picture' | 'vowel' | 'blend';
type Q = { kind: Kind; w: PhonicsWord; options: string[]; answer: string };

const TOTAL = 8;
// Câu "chọn hình": lựa chọn lưu bằng TỪ để hiện ảnh admin (nếu có); emoji tra theo từ.
const EMOJI: Record<string, string> = Object.fromEntries(PHONICS_GROUPS.flatMap((g) => g.words.map((x) => [x.word, x.emoji])));
const KINDS: Kind[] = ['listen', 'picture', 'blend', 'vowel'];
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

function build(group: PhonicsGroup): Q[] {
  // Chỉ dùng từ cơ bản (hình rõ nghĩa); từ nâng cao (fed, got…) dễ làm bé chọn sai vì hình mơ hồ.
  const basic = (ws: PhonicsWord[]) => ws.filter((x) => !x.adv);
  const others = basic(PHONICS_GROUPS.filter((g) => g.slug !== group.slug).flatMap((g) => g.words));
  const words = shuffle(basic(group.words));
  return Array.from({ length: TOTAL }, (_, i) => {
    const w = words[i % words.length];
    const kind = KINDS[i % KINDS.length];
    // Lựa chọn nhiễu: 1 từ cùng nhóm (khó, chỉ khác phụ âm) + 1 từ nhóm khác (khác nguyên âm).
    const same = shuffle(basic(group.words).filter((x) => x.word !== w.word && x.emoji !== w.emoji))[0];
    const diff = shuffle(others.filter((x) => x.emoji !== w.emoji))[0];
    const pool = [w, same, diff].filter(Boolean) as PhonicsWord[];
    if (kind === 'picture') return { kind, w, options: shuffle(pool.map((x) => x.word)), answer: w.word };
    if (kind === 'vowel') {
      const wrong = shuffle(VOWELS.filter((v) => v !== w.letters[1])).slice(0, 2);
      return { kind, w, options: shuffle([w.letters[1], ...wrong]), answer: w.letters[1] };
    }
    return { kind, w, options: shuffle(pool.map((x) => x.word)), answer: w.word };
  });
}

const PROMPT: Record<Kind, string> = {
  listen: 'Nghe và chọn từ đúng',
  picture: 'Chọn hình đúng với từ',
  vowel: 'Từ này thiếu nguyên âm nào?',
  blend: 'Ghép các âm thành từ',
};

// Cha render với key={group.slug} → đổi nhóm là quiz tự về màn bắt đầu.
export default function PhonicsQuiz({ group }: { group: PhonicsGroup }) {
  const [qs, setQs] = useState<Q[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const q = qs?.[idx];

  const sayQuestion = useCallback((cur: Q | undefined) => {
    if (cur?.kind === 'listen') speakEnglish(cur.w.word);
  }, []);

  const start = () => {
    unlockAudio();
    const built = build(group);
    setQs(built);
    setIdx(0);
    setPicked(null);
    setScore(0);
    sayQuestion(built[0]);
  };

  const choose = (opt: string) => {
    if (!q || picked) return;
    setPicked(opt);
    const ok = opt === q.answer;
    if (ok) setScore((s) => s + 1);
    // Đúng: đọc lại từ; sai: báo nhẹ bằng tiếng Việt rồi bé xem đáp án đúng.
    if (ok) speakEnglish(q.w.word);
    else speakText(`Chưa đúng. Đáp án là ${q.w.word}`, { lang: 'vi' });
  };

  const next = () => {
    if (!qs) return;
    const n = idx + 1;
    setIdx(n);
    setPicked(null);
    if (n < qs.length) sayQuestion(qs[n]);
  };

  const card = 'mt-8 rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-sky-50 p-5 shadow-sm';

  if (!qs) {
    return (
      <div className={`${card} text-center`}>
        <p className="text-3xl">📝</p>
        <h3 className="mt-1 text-xl font-black text-slate-800">Luyện tập {group.label.toLowerCase()}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-slate-500">
          {TOTAL} câu: nghe và chọn từ, chọn hình đúng, tìm nguyên âm còn thiếu và ghép âm thành từ.
        </p>
        <button type="button" onClick={start} className="mt-4 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-7 py-2.5 font-black text-white shadow active:scale-95">
          Bắt đầu ▶
        </button>
      </div>
    );
  }

  if (!q) {
    const stars = score >= TOTAL ? 3 : score >= TOTAL - 2 ? 2 : score >= TOTAL / 2 ? 1 : 0;
    return (
      <div className={`${card} text-center`}>
        <p className="text-4xl tracking-widest">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</p>
        <h3 className="mt-2 text-xl font-black text-slate-800">
          Bé đúng {score}/{TOTAL} câu!
        </h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {stars === 3 ? 'Xuất sắc! Bé đã đọc được cả nhóm rồi.' : 'Ôn lại các thẻ ở trên rồi làm lại nhé.'}
        </p>
        <button type="button" onClick={start} className="mt-4 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-7 py-2.5 font-black text-white shadow active:scale-95">
          🔁 Làm lại
        </button>
      </div>
    );
  }

  const vowelBlank = q.w.letters.map((ch, i) => (i === 1 ? (picked ? q.answer : '_') : ch)).join('');

  return (
    <div className={card}>
      <div className="flex items-center justify-between text-sm font-black text-violet-600">
        <span>
          Câu {idx + 1}/{TOTAL} · {PROMPT[q.kind]}
        </span>
        <span>⭐ {score}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full bg-gradient-to-r from-violet-500 to-sky-500 transition-all" style={{ width: `${(idx / TOTAL) * 100}%` }} />
      </div>

      <div className="mt-5 flex flex-col items-center gap-2 text-center">
        {q.kind === 'listen' && (
          <button type="button" onClick={() => speakEnglish(q.w.word)} className="rounded-full bg-white px-6 py-3 text-2xl shadow ring-1 ring-violet-100 active:scale-95">
            🔊 <span className="text-base font-black text-violet-700">Nghe lại</span>
          </button>
        )}
        {q.kind === 'picture' && <p className="text-5xl font-black text-slate-800">{q.w.word}</p>}
        {q.kind === 'vowel' && (
          <>
            <span className="text-6xl"><PhonicsPic word={q.w.word} emoji={q.w.emoji} /></span>
            <p className="text-5xl font-black tracking-widest text-slate-800">{vowelBlank}</p>
          </>
        )}
        {q.kind === 'blend' && (
          <p className="flex gap-2 text-3xl font-black">
            {phonemes(q.w).map((p, i) => (
              <span key={i} className={`rounded-xl px-3 py-1 ${i === 1 ? 'bg-pink-100 text-pink-600' : 'bg-white text-slate-700'}`}>
                /{p}/
              </span>
            ))}
          </p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {q.options.map((opt) => {
          const isAns = opt === q.answer;
          const state = !picked ? 'bg-white hover:ring-violet-300' : isAns ? 'bg-emerald-100 ring-emerald-400' : opt === picked ? 'bg-rose-100 ring-rose-400' : 'bg-white opacity-50';
          return (
            <button
              key={opt}
              type="button"
              onClick={() => choose(opt)}
              disabled={!!picked}
              className={`rounded-2xl py-4 font-black text-slate-800 shadow-sm ring-2 ring-transparent transition active:scale-95 ${state} ${q.kind === 'picture' ? 'text-5xl' : 'text-3xl'}`}
            >
              {q.kind === 'picture' ? <PhonicsPic word={opt} emoji={EMOJI[opt] ?? '❓'} /> : opt}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className={`font-black ${picked === q.answer ? 'text-emerald-600' : 'text-rose-600'}`}>
            {picked === q.answer ? '🎉 Đúng rồi!' : <>Đáp án đúng: {q.w.word} <PhonicsPic word={q.w.word} emoji={q.w.emoji} /></>} <span className="font-semibold text-slate-500">· {q.w.vi}</span>
          </p>
          <button type="button" onClick={next} className="rounded-full bg-violet-500 px-6 py-2 font-black text-white shadow active:scale-95">
            {idx + 1 < TOTAL ? 'Câu tiếp ▶' : 'Xem kết quả'}
          </button>
        </div>
      )}
    </div>
  );
}
