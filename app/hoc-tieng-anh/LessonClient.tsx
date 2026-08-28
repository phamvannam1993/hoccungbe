'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { LESSON_TOPICS, buildLesson, type Exercise } from '../lib/englishLesson';
import type { VocabWord } from '../lib/vocab';
import { speakEnglish, speakText, speakSequence, unlockAudio, stopSpeaking } from '../components/edu/utils/speech';
import { playCorrect, playWrong, playWin, confetti } from '../lib/celebrate';
import { addStars } from '../lib/stars';
import { getCurrentChildId } from '../lib/childData';
import { getCrowns, addCrown, MAX_CROWN } from '../lib/englishProgress';
import { useVocabImages } from '../components/edu/utils/vocabImages';

const MAX_HEARTS = 5;
const CHANG_SIZE = 6;

// Chia từ của một chủ đề thành các CHẶNG (mỗi chặng ~6 từ; gộp đuôi nếu <4 từ).
function changSlices(words: VocabWord[]): VocabWord[][] {
  const clean = words.filter((w) => w.en && w.vi);
  const slices: VocabWord[][] = [];
  for (let i = 0; i < clean.length; i += CHANG_SIZE) slices.push(clean.slice(i, i + CHANG_SIZE));
  if (slices.length >= 2 && slices[slices.length - 1].length < 4) {
    const tail = slices.pop()!;
    slices[slices.length - 1] = slices[slices.length - 1].concat(tail);
  }
  return slices.length ? slices : [clean];
}

export default function LessonClient() {
  const [phase, setPhase] = useState<'topics' | 'map' | 'playing' | 'done' | 'failed'>('topics');
  const [topicIdx, setTopicIdx] = useState<number | null>(null);
  const [changIdx, setChangIdx] = useState(0);
  const [lesson, setLesson] = useState<Exercise[]>([]);
  const [idx, setIdx] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [correctCount, setCorrectCount] = useState(0);
  const [crowns, setCrowns] = useState<Record<string, number>>({});
  const [lastReward, setLastReward] = useState(0);
  const [leveledUp, setLeveledUp] = useState(false);

  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [matched, setMatched] = useState<string[]>([]);
  const [selEn, setSelEn] = useState<string | null>(null);
  const [selVi, setSelVi] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState(false);
  const [order, setOrder] = useState<number[]>([]); // dạng translate: thứ tự thẻ đã xếp
  const [readIdx, setReadIdx] = useState(-1); // read-along: từ đang được đọc

  const imgMap = useVocabImages();

  // Kéo bản đồ bằng chuột như game (touch dùng cuộn tự nhiên).
  const mapRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ y: number; top: number } | null>(null);
  const onMapDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    // Bấm vào node chặng thì để click chạy, không bắt đầu kéo.
    if ((e.target as HTMLElement).closest('button')) return;
    const el = mapRef.current;
    if (!el) return;
    drag.current = { y: e.clientY, top: el.scrollTop };
  };
  const onMapMove = (e: React.PointerEvent) => {
    const el = mapRef.current;
    if (!el || !drag.current) return;
    el.scrollTop = drag.current.top - (e.clientY - drag.current.y);
  };
  const onMapUp = () => { drag.current = null; };

  // Đọc theo: đọc từng từ tiếng Anh và tô sáng từ đang đọc.
  const readAlong = (sentence: string) => {
    unlockAudio();
    const words = sentence.split(/\s+/).filter(Boolean);
    speakSequence(
      words.map((w) => ({ text: w.replace(/[.,!?;:"“”']/g, ''), lang: 'en' as const })),
      setReadIdx,
      () => setReadIdx(-1),
    );
  };

  const topic = topicIdx !== null ? LESSON_TOPICS[topicIdx] : null;
  // Ảnh từ vựng theo key thật `${slug}:${en}` (vd "dong-vat:cat"); không có → dùng emoji.
  const imgFor = (en: string): string | undefined => (topic ? imgMap[`${topic.slug}:${en}`] : undefined);
  const slices = useMemo(() => (topic ? changSlices(topic.words) : []), [topic]);
  const ex = lesson[idx];
  const crownKey = (ci: number) => (topic ? `${topic.slug}#${ci}` : '');

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => { setCrowns(getCrowns(getCurrentChildId() || 0)); }, []);

  useEffect(() => {
    stopSpeaking(); // cắt giọng đọc câu trước khi sang câu mới
    setPicked(null);
    setAnswered(false);
    setMatched([]);
    setSelEn(null);
    setSelVi(null);
    setWrongPair(false);
    setOrder([]);
    setReadIdx(-1);
    if (ex?.kind === 'listen') {
      const t = setTimeout(() => speakEnglish(ex.word.en), 400);
      return () => clearTimeout(t);
    }
    if (ex?.kind === 'translate') {
      const t = setTimeout(() => readAlong(ex.en), 400);
      return () => clearTimeout(t);
    }
    // Đọc câu hỏi tiếng Việt cho dạng có đề bài tiếng Việt.
    if (ex?.kind === 'pick') {
      const t = setTimeout(() => speakText(`Đâu là ${ex.word.vi}?`), 400);
      return () => clearTimeout(t);
    }
    if (ex?.kind === 'word') {
      const t = setTimeout(() => speakText(ex.word.vi), 400);
      return () => clearTimeout(t);
    }
    // Đọc đề (instruction) tiếng Việt cho các dạng còn lại.
    if (ex?.kind === 'meaning') {
      const t = setTimeout(() => speakText('Chọn nghĩa đúng'), 400);
      return () => clearTimeout(t);
    }
    if (ex?.kind === 'pairs') {
      const t = setTimeout(() => speakText('Ghép từ với nghĩa'), 400);
      return () => clearTimeout(t);
    }
  }, [idx, ex]);

  const pairCols = useMemo(() => {
    if (ex?.kind !== 'pairs') return null;
    const s = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
    return { left: s(ex.words), right: s(ex.words) };
  }, [ex]);

  const openTopic = (i: number) => { setTopicIdx(i); setPhase('map'); };

  const startChang = (ci: number) => {
    unlockAudio();
    const l = buildLesson(slices[ci] ?? []);
    if (!l.length) return;
    setLesson(l);
    setChangIdx(ci);
    setIdx(0);
    setHearts(MAX_HEARTS);
    setCorrectCount(0);
    setPhase('playing');
  };

  const finish = (won: boolean) => {
    if (won) {
      playWin();
      confetti('big');
      const id = getCurrentChildId() || 0;
      const key = crownKey(changIdx);
      const res = key ? addCrown(id, key) : { leveledUp: false };
      setCrowns(getCrowns(id));
      setLeveledUp(res.leveledUp);
      const reward = res.leveledUp ? correctCount : 2;
      setLastReward(reward);
      if (id && reward > 0) addStars(id, reward);
      setPhase('done');
    } else {
      setPhase('failed');
    }
  };

  const next = () => { if (idx + 1 >= lesson.length) finish(true); else setIdx(idx + 1); };

  const select = (oi: number) => { if (!answered) { unlockAudio(); setPicked(oi); } };

  const markResult = (ok: boolean) => {
    setAnswered(true);
    if (ok) {
      setCorrectCount((c) => c + 1);
      playCorrect();
      confetti('small');
    } else {
      playWrong();
      setHearts((h) => {
        const nh = h - 1;
        if (nh <= 0) setTimeout(() => finish(false), 1000);
        return nh;
      });
    }
  };

  const check = () => {
    if (answered) return;
    if (ex.kind === 'translate') {
      if (order.length !== ex.answer.length) return;
      const built = order.map((i) => ex.bank[i]);
      markResult(built.join(' ').toLowerCase() === ex.answer.join(' ').toLowerCase());
      return;
    }
    if (ex.kind === 'pairs' || picked === null) return;
    markResult(picked === ex.correct);
  };

  const tapBank = (i: number) => { if (!answered && !order.includes(i)) setOrder([...order, i]); };
  const tapChosen = (pos: number) => { if (!answered) setOrder(order.filter((_, k) => k !== pos)); };

  const tapPair = (side: 'en' | 'vi', word: VocabWord) => {
    if (matched.includes(word.en)) return;
    unlockAudio();
    if (side === 'en') { speakEnglish(word.en); setSelEn(word.en); } else setSelVi(word.en);
    const en = side === 'en' ? word.en : selEn;
    const vi = side === 'vi' ? word.en : selVi;
    if (en && vi) {
      if (en === vi) {
        const m = [...matched, en];
        setMatched(m);
        setSelEn(null);
        setSelVi(null);
        playCorrect();
        if (ex.kind === 'pairs' && m.length >= ex.words.length) {
          setCorrectCount((c) => c + 1);
          confetti('small');
          setAnswered(true);
        }
      } else {
        playWrong();
        setWrongPair(true);
        setTimeout(() => { setWrongPair(false); setSelEn(null); setSelVi(null); }, 500);
      }
    }
  };

  // ═══ TẦNG 1: chọn chủ đề ═══
  if (phase === 'topics') {
    return (
      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-slate-500">Chọn một chủ đề để mở bản đồ các chặng học:</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {LESSON_TOPICS.map((t, i) => {
            const sl = changSlices(t.words);
            const done = sl.filter((_, ci) => (crowns[`${t.slug}#${ci}`] || 0) >= 1).length;
            return (
              <button key={t.slug} type="button" onClick={() => openTopic(i)} className="flex items-center gap-2 rounded-2xl border-2 border-emerald-100 bg-white p-3 text-left shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50">
                <span className="text-3xl">{t.emoji}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-slate-800">{t.heading}</span>
                  <span className="text-xs text-slate-400">{done}/{sl.length} chặng</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══ TẦNG 2: bản đồ các chặng của chủ đề (dọc, kiểu Duolingo) ═══
  if (phase === 'map' && topic) {
    const WIND = [0, 54, 78, 54, 0, -54, -78, -54];
    const doneCount = slices.filter((_, ci) => (crowns[`${topic.slug}#${ci}`] || 0) >= 1).length;
    return (
      <div className="mx-auto mt-4 max-w-md">
        <button type="button" onClick={() => setPhase('topics')} className="mb-2 text-sm font-black text-emerald-600">← Đổi chủ đề</button>

        {/* KHUNG GAME: viền bo, header + vùng bản đồ cuộn dọc */}
        <div className="overflow-hidden rounded-3xl border-4 border-emerald-300 shadow-xl">
          {/* Thanh tiêu đề chủ đề */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wider opacity-90">Chủ đề</p>
              <p className="truncate text-base font-black">{topic.heading}</p>
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-black">{doneCount}/{slices.length} ✅</span>
          </div>

          {/* Vùng bản đồ — nền FIX cứng, path cuộn/kéo dọc đè lên như game */}
          <div className="relative h-[65dvh] max-h-[560px] min-h-[380px]">
            {/* Lớp nền cố định (độ dài chuẩn, không lặp) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/assets/images/nen_game.jpg)' }}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/15" />
            {/* Lớp cuộn/kéo */}
            <div
              ref={mapRef}
              onPointerDown={onMapDown}
              onPointerMove={onMapMove}
              onPointerUp={onMapUp}
              onPointerLeave={onMapUp}
              className="absolute inset-0 cursor-grab touch-pan-y select-none overflow-y-auto overscroll-contain active:cursor-grabbing"
            >
              <div className="flex flex-col items-center gap-7 px-4 pb-16 pt-6">
              {slices.map((_, ci) => {
                const c = crowns[`${topic.slug}#${ci}`] || 0;
                const unlocked = ci === 0 || (crowns[`${topic.slug}#${ci - 1}`] || 0) >= 1;
                const isNext = unlocked && c === 0;
                const maxed = c >= MAX_CROWN;
                return (
                  <div key={ci} className="flex flex-col items-center" style={{ transform: `translateX(${WIND[ci % WIND.length]}px)` }}>
                    {isNext && <span className="mb-1.5 animate-bounce rounded-2xl bg-white px-3 py-1 text-xs font-black text-emerald-600 shadow-md ring-1 ring-emerald-100">BẮT ĐẦU</span>}
                    <button
                      type="button"
                      disabled={!unlocked}
                      onClick={() => startChang(ci)}
                      aria-label={`Chặng ${ci + 1}`}
                      className={`relative grid h-[74px] w-[74px] place-items-center rounded-[42%] text-2xl font-black text-white transition active:translate-y-1 ${
                        !unlocked
                          ? 'bg-slate-400 text-slate-200 shadow-[0_6px_0_#64748b] ring-4 ring-white/70'
                          : maxed
                            ? 'bg-gradient-to-b from-amber-400 to-amber-600 shadow-[0_6px_0_#b45309] ring-4 ring-white hover:brightness-105'
                            : 'bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_6px_0_rgba(0,0,0,0.35)] ring-4 ring-white hover:brightness-105'
                      }`}
                    >
                      {unlocked ? (maxed ? '👑' : ci + 1) : '🔒'}
                      {c > 0 && !maxed && (
                        <span className="absolute -bottom-3 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-black text-amber-500 shadow ring-1 ring-amber-100">{'👑'.repeat(Math.min(c, 3))}</span>
                      )}
                    </button>
                    <span className="mt-3 rounded-full bg-black/40 px-2 py-0.5 text-xs font-black text-white">Chặng {ci + 1}</span>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ Kết thúc bài ═══
  if (phase === 'done' || phase === 'failed') {
    const won = phase === 'done';
    return (
      <div className="mt-6 rounded-3xl border-4 border-emerald-100 bg-white p-8 text-center">
        <p className="text-6xl">{won ? '🎉' : '💔'}</p>
        <h2 className="mt-3 text-2xl font-black text-slate-800">{won ? 'Hoàn thành chặng!' : 'Hết tim rồi!'}</h2>
        <p className="mt-1 font-semibold text-slate-500">Bé trả lời đúng {correctCount} câu{won ? ` — nhận ${lastReward} ⭐` : ''}.</p>
        {won && leveledUp && <p className="mt-1 text-sm font-black text-amber-500">👑 Lên vương miện mới cho chặng này!</p>}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => startChang(changIdx)} className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-black text-white shadow">🔁 Học lại chặng</button>
          <button type="button" onClick={() => setPhase('map')} className="rounded-full border-2 border-emerald-200 px-6 py-2.5 text-sm font-black text-emerald-600">🗺️ Về bản đồ</button>
        </div>
      </div>
    );
  }

  if (!ex) return null;

  // ═══ Màn chơi bài — full-screen nền tối kiểu Duolingo ═══
  const transBuilt = ex.kind === 'translate' ? order.map((i) => ex.bank[i]) : [];
  const transWrong = ex.kind === 'translate' && answered && transBuilt.join(' ').toLowerCase() !== ex.answer.join(' ').toLowerCase();
  const isWrong =
    answered && ((ex.kind !== 'pairs' && ex.kind !== 'translate' && picked !== ex.correct) || transWrong);
  const ready =
    ex.kind === 'pairs' ? answered : ex.kind === 'translate' ? order.length === ex.answer.length : picked !== null;
  const btnLabel = answered ? (idx + 1 >= lesson.length ? 'HOÀN THÀNH' : 'TIẾP TỤC') : 'KIỂM TRA';

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#131f24] text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <button type="button" onClick={() => setPhase('map')} className="text-2xl text-slate-400 hover:text-slate-200" aria-label="Thoát">✕</button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#37464f]">
          <div className="h-full rounded-full bg-[#58cc02] transition-all duration-300" style={{ width: `${((idx + (answered ? 1 : 0)) / lesson.length) * 100}%` }} />
        </div>
        <span className="flex shrink-0 items-center gap-1 text-lg font-black text-[#ff4b4b]">❤️<span>{Math.max(0, hearts)}</span></span>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-7 sm:px-6">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ce82ff] text-xs">🔶</span>
            <span className="text-sm font-black uppercase tracking-wider text-[#ce82ff]">Từ vựng mới</span>
          </div>

          {/* PICK: Đâu là "..."? → chọn tranh */}
          {ex.kind === 'pick' && (
            <>
              <h2 className="mt-4 flex items-center gap-2 text-2xl font-black">
                <Spk onSpeak={() => speakText(`Đâu là ${ex.word.vi}?`)} />
                Đâu là “{ex.word.vi}”?
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                {ex.options.map((op, oi) => (
                  <button key={oi} type="button" onClick={() => { select(oi); speakEnglish(op.en); }} className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-b-4 p-4 transition ${cardCls(answered, oi, picked, ex.correct)}`}>
                    <Visual url={imgFor(op.en)} emoji={op.emoji} />
                    <span className="text-base font-bold">{op.en}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* LISTEN: nghe → chọn tranh */}
          {ex.kind === 'listen' && (
            <>
              <h2 className="mt-4 text-2xl font-black">Nghe rồi chọn tranh</h2>
              <div className="mt-5 flex justify-center">
                <button type="button" onClick={() => { unlockAudio(); speakEnglish(ex.word.en); }} className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-b-4 border-[#1899d6] bg-[#1cb0f6] text-4xl text-white transition active:translate-y-0.5 active:scale-95" aria-label="Nghe"><span className="animate-pulse">🔊</span></button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                {ex.options.map((op, oi) => (
                  <button key={oi} type="button" onClick={() => select(oi)} className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-b-4 p-4 transition ${cardCls(answered, oi, picked, ex.correct)}`}>
                    <Visual url={imgFor(op.en)} emoji={op.emoji} />
                    <span className="text-base font-bold">{op.en}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* MEANING: en → chọn nghĩa Việt (thẻ chữ) */}
          {ex.kind === 'meaning' && (
            <>
              <h2 className="mt-4 flex items-center gap-2 text-2xl font-black">
                <Spk onSpeak={() => speakText('Chọn nghĩa đúng')} />
                Chọn nghĩa đúng
              </h2>
              {(imgFor(ex.word.en) || ex.word.emoji) && (
                <div className="mt-5 flex justify-center">
                  <Visual url={imgFor(ex.word.en)} emoji={ex.word.emoji} />
                </div>
              )}
              <button type="button" onClick={() => { unlockAudio(); speakEnglish(ex.word.en); }} className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-[#37464f] bg-[#1f2c34] px-4 py-3 transition active:scale-[0.98]">
                <span className="text-2xl text-[#1cb0f6]">🔊</span>
                <span className="text-2xl font-black">{ex.word.en}</span>
                {ex.word.ipa && <span className="text-sm text-slate-400">{ex.word.ipa}</span>}
              </button>
              <div className="mt-6 grid gap-3">
                {ex.options.map((op, oi) => (
                  <button key={oi} type="button" onClick={() => select(oi)} className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-4 text-left text-base font-bold transition ${cardCls(answered, oi, picked, ex.correct)}`}><Thumb url={imgFor(op.en)} emoji={op.emoji} />{op.vi}</button>
                ))}
              </div>
            </>
          )}

          {/* WORD: vi → chọn từ Anh (thẻ chữ) */}
          {ex.kind === 'word' && (
            <>
              <h2 className="mt-4 text-2xl font-black">Chọn từ tiếng Anh</h2>
              {(imgFor(ex.word.en) || ex.word.emoji) && (
                <div className="mt-5 flex justify-center">
                  <Visual url={imgFor(ex.word.en)} emoji={ex.word.emoji} />
                </div>
              )}
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-3xl font-black">
                <Spk onSpeak={() => speakText(ex.word.vi)} className="text-2xl text-[#1cb0f6]" />
                {ex.word.vi}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {ex.options.map((op, oi) => (
                  <button key={oi} type="button" onClick={() => { select(oi); speakEnglish(op); }} className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-4 text-base font-bold transition ${cardCls(answered, oi, picked, ex.correct)}`}><Thumb url={imgFor(op)} />{op}</button>
                ))}
              </div>
            </>
          )}

          {/* TRANSLATE: nghe câu → xếp thẻ chữ tiếng Việt */}
          {ex.kind === 'translate' && (
            <>
              <h2 className="mt-4 text-2xl font-black">Viết lại bằng tiếng Việt</h2>
              <div className="mt-5 flex items-end gap-2">
                {(() => {
                  const Char = (changIdx + idx) % 2 === 0 ? HumanMascot : Mascot;
                  return <Char className="h-28 w-24 shrink-0 drop-shadow-lg" mood={!answered ? 'idle' : isWrong ? 'sad' : 'happy'} speaking={readIdx >= 0} />;
                })()}
                <button type="button" onClick={() => readAlong(ex.en)} className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl rounded-bl-none border-2 border-[#37464f] bg-[#1f2c34] px-4 py-3 text-left">
                  <span className={`shrink-0 text-xl text-[#1cb0f6] ${readIdx >= 0 ? 'animate-pulse' : ''}`}>🔊</span>
                  <span className="break-words text-lg font-bold">
                    {ex.en.split(/\s+/).map((w, i) => (
                      <span key={i} className={`underline decoration-dotted underline-offset-4 transition-colors ${readIdx === i ? 'rounded bg-[#1cb0f6]/30 px-0.5 text-[#7dd3fc]' : ''}`}>{w}{' '}</span>
                    ))}
                  </span>
                </button>
              </div>

              {/* Dòng đáp án đã xếp */}
              <div className="mt-6 min-h-[54px] border-b-2 border-[#37464f] pb-2">
                <div className="flex flex-wrap gap-2">
                  {order.map((bi, pos) => (
                    <button key={pos} type="button" onClick={() => tapChosen(pos)} className="rounded-xl border-2 border-b-4 border-[#37464f] bg-[#1f2c34] px-3 py-2 text-sm font-bold text-white">{ex.bank[bi]}</button>
                  ))}
                </div>
              </div>

              {/* Kho thẻ chữ */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {ex.bank.map((tk, bi) => {
                  const used = order.includes(bi);
                  return (
                    <button key={bi} type="button" disabled={used} onClick={() => tapBank(bi)} className={`rounded-xl border-2 border-b-4 px-3 py-2 text-sm font-bold transition ${used ? 'border-[#2b363c] bg-[#131f24] text-transparent' : 'border-[#37464f] bg-[#1f2c34] text-white hover:bg-[#26343d]'}`}>{tk}</button>
                  );
                })}
              </div>
            </>
          )}

          {/* PAIRS: ghép cặp */}
          {ex.kind === 'pairs' && pairCols && (
            <>
              <h2 className="mt-4 flex items-center gap-2 text-2xl font-black">
                <Spk onSpeak={() => speakText('Ghép từ với nghĩa')} />
                Ghép từ với nghĩa
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="space-y-2.5">
                  {pairCols.left.map((w) => {
                    const done = matched.includes(w.en);
                    const sel = selEn === w.en;
                    return (
                      <button key={w.en} type="button" disabled={done} onClick={() => tapPair('en', w)} className={`w-full rounded-2xl border-2 border-b-4 px-3 py-3.5 text-sm font-bold transition ${pairCls(done, sel, wrongPair)}`}>{w.en}</button>
                    );
                  })}
                </div>
                <div className="space-y-2.5">
                  {pairCols.right.map((w) => {
                    const done = matched.includes(w.en);
                    const sel = selVi === w.en;
                    return (
                      <button key={w.en} type="button" disabled={done} onClick={() => tapPair('vi', w)} className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-b-4 px-3 py-3 text-sm font-bold transition ${pairCls(done, sel, wrongPair)}`}><Thumb url={imgFor(w.en)} emoji={w.emoji} />{w.vi}</button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom bar: feedback + nút KIỂM TRA / TIẾP TỤC */}
      <div className={`border-t-2 ${answered ? (isWrong ? 'border-[#ff4b4b]/30 bg-[#2d1518]' : 'border-[#58cc02]/30 bg-[#16241a]') : 'border-white/5'}`}>
        <div className="mx-auto max-w-xl px-5 pt-4 sm:px-6" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {answered && ex.kind !== 'pairs' && (
            <div className="mb-3">
              {isWrong ? (
                <>
                  <p className="text-lg font-black text-[#ff4b4b]">Đáp án đúng:</p>
                  <p className="font-bold text-[#ff7b7b]">{ex.kind === 'translate' ? ex.answer.join(' ') : ex.kind === 'listen' || ex.kind === 'pick' ? `${ex.options[ex.correct].emoji || ''} ${ex.options[ex.correct].en}` : ex.kind === 'meaning' ? ex.options[ex.correct].vi : (ex.options as string[])[ex.correct]}</p>
                </>
              ) : (
                <p className="text-lg font-black text-[#58cc02]">Chính xác! 🎉</p>
              )}
            </div>
          )}
          <button
            type="button"
            disabled={!ready}
            onClick={answered ? next : check}
            className={`w-full rounded-2xl border-b-4 py-4 text-base font-black uppercase tracking-wide transition active:translate-y-0.5 ${
              !ready
                ? 'cursor-not-allowed border-[#2b363c] bg-[#37464f] text-[#59696f]'
                : isWrong
                  ? 'border-[#c93a3a] bg-[#ff4b4b] text-white'
                  : 'border-[#58a700] bg-[#58cc02] text-white'
            }`}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Thẻ chọn ở màn tối: base / đang chọn (xanh dương) / đúng (xanh lá) / sai (đỏ)
function cardCls(answered: boolean, oi: number, picked: number | null, correct: number): string {
  if (!answered) {
    return oi === picked
      ? 'border-[#1cb0f6] bg-[#1cb0f6]/15 text-[#1cb0f6]'
      : 'border-[#37464f] bg-[#1f2c34] text-white hover:bg-[#26343d]';
  }
  if (oi === correct) return 'border-[#58cc02] bg-[#58cc02]/15 text-[#79e838]';
  if (oi === picked) return 'border-[#ff4b4b] bg-[#ff4b4b]/15 text-[#ff7b7b]';
  return 'border-[#37464f] bg-[#1f2c34] text-slate-500 opacity-60';
}

// Hình minh hoạ thẻ: có link ảnh → <img>, không thì emoji icon.
function Visual({ url, emoji }: { url?: string; emoji?: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="h-20 w-20 rounded-xl object-contain" loading="lazy" />;
  }
  return <span className="text-6xl">{emoji || '🔤'}</span>;
}

// Mascot gấu tự vẽ bằng SVG (nét phẳng kiểu Duolingo) + cử động/biểu cảm theo mood.
function Mascot({ className, mood = 'idle', speaking = false }: { className?: string; mood?: 'idle' | 'happy' | 'sad'; speaking?: boolean }) {
  const anim =
    mood === 'happy'
      ? 'animate-[mascotPop_0.6s_ease]'
      : mood === 'sad'
        ? 'animate-[mascotShake_0.5s_ease]'
        : 'animate-[mascotBob_3s_ease-in-out_infinite]';
  return (
    <div className={`${className ?? ''} ${anim}`} style={{ transformOrigin: '50% 90%' }}>
      <style>{`
        @keyframes mascotBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes mascotPop{0%{transform:scale(1)}30%{transform:scale(1.14) translateY(-8px)}55%{transform:scale(0.97)}100%{transform:scale(1)}}
        @keyframes mascotShake{0%,100%{transform:rotate(0)}20%{transform:rotate(-7deg)}60%{transform:rotate(7deg)}80%{transform:rotate(-3deg)}}
        @keyframes mascotBlink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.1)}}
        @keyframes mascotTalk{0%,100%{transform:scaleY(0.35)}50%{transform:scaleY(1)}}
        @keyframes spkPop{0%{transform:scale(1)}40%{transform:scale(1.25)}100%{transform:scale(1)}}
      `}</style>
      <svg viewBox="0 0 100 112" className="h-full w-full" aria-hidden="true">
        <circle cx="28" cy="24" r="12" fill="#7A5231" />
        <circle cx="72" cy="24" r="12" fill="#7A5231" />
        <circle cx="28" cy="24" r="6" fill="#9B6A43" />
        <circle cx="72" cy="24" r="6" fill="#9B6A43" />
        <ellipse cx="50" cy="92" rx="30" ry="20" fill="#9B6A43" />
        <circle cx="50" cy="40" r="26" fill="#9B6A43" />
        <ellipse cx="50" cy="48" rx="14" ry="11" fill="#E8C9A0" />
        <ellipse cx="50" cy="43" rx="4" ry="3" fill="#4A3524" />

        {/* Mắt + miệng theo biểu cảm */}
        {mood === 'happy' ? (
          <>
            <path d="M35 35 q5 -6 10 0" stroke="#3A2A1C" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M55 35 q5 -6 10 0" stroke="#3A2A1C" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M43 51 q7 8 14 0" stroke="#4A3524" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'sad' ? (
          <>
            <path d="M35 33 q5 5 10 2" stroke="#3A2A1C" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M55 35 q5 -3 10 -2" stroke="#3A2A1C" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M43 55 q7 -6 14 0" stroke="#4A3524" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <g className="animate-[mascotBlink_4.5s_ease-in-out_infinite]" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx="40" cy="34" r="3.2" fill="#3A2A1C" />
              <circle cx="60" cy="34" r="3.2" fill="#3A2A1C" />
            </g>
            <path d="M50 46 v3" stroke="#4A3524" strokeWidth="2" strokeLinecap="round" />
            {speaking ? (
              <ellipse cx="50" cy="53" rx="4.5" ry="3.5" fill="#5A3A22" className="animate-[mascotTalk_0.26s_ease-in-out_infinite]" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            ) : (
              <path d="M45 52 q5 3 10 0" stroke="#4A3524" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </>
        )}

        <path d="M24 66 q26 14 52 0 l-4 10 q-22 12 -44 0 z" fill="#57C4F0" />
        <rect x="26" y="80" width="30" height="12" rx="6" fill="#7A5231" transform="rotate(-12 41 86)" />
        <rect x="44" y="80" width="30" height="12" rx="6" fill="#8B5E3C" transform="rotate(12 59 86)" />
      </svg>
    </div>
  );
}

// Nhân vật NGƯỜI tự vẽ (kiểu Duolingo): nháy mắt, thở, mấp môi khi đọc, vui/buồn.
function HumanMascot({ className, mood = 'idle', speaking = false }: { className?: string; mood?: 'idle' | 'happy' | 'sad'; speaking?: boolean }) {
  const anim =
    mood === 'happy'
      ? 'animate-[mascotPop_0.6s_ease]'
      : mood === 'sad'
        ? 'animate-[mascotShake_0.5s_ease]'
        : 'animate-[mascotBob_3s_ease-in-out_infinite]';
  return (
    <div className={`${className ?? ''} ${anim}`} style={{ transformOrigin: '50% 92%' }}>
      <style>{`
        @keyframes mascotBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes mascotPop{0%{transform:scale(1)}30%{transform:scale(1.12) translateY(-8px)}55%{transform:scale(0.97)}100%{transform:scale(1)}}
        @keyframes mascotShake{0%,100%{transform:rotate(0)}20%{transform:rotate(-7deg)}60%{transform:rotate(7deg)}80%{transform:rotate(-3deg)}}
        @keyframes mascotBlink{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(0.1)}}
        @keyframes mascotTalk{0%,100%{transform:scaleY(0.35)}50%{transform:scaleY(1)}}
      `}</style>
      <svg viewBox="0 0 100 132" className="h-full w-full" aria-hidden="true">
        <ellipse cx="50" cy="126" rx="24" ry="4.5" fill="rgba(0,0,0,0.35)" />
        <rect x="40" y="100" width="8" height="24" rx="4" fill="#4FA05F" />
        <rect x="52" y="100" width="8" height="24" rx="4" fill="#4FA05F" />
        <ellipse cx="42" cy="124" rx="7" ry="4" fill="#4A90E2" />
        <ellipse cx="58" cy="124" rx="7" ry="4" fill="#4A90E2" />
        <path d="M30 78 q20 -8 40 0 l2 24 q-22 8 -44 0 z" fill="#6DBE7A" />
        <rect x="29" y="99" width="42" height="5" fill="#3E8C50" />
        <path d="M34 70 q16 12 32 0 l-4 12 q-12 8 -24 0 z" fill="#F3A6C0" />
        <rect x="44" y="60" width="12" height="12" fill="#B5763F" />
        <circle cx="50" cy="44" r="24" fill="#C6864F" />
        <circle cx="27" cy="46" r="4.5" fill="#C6864F" />
        <circle cx="73" cy="46" r="4.5" fill="#C6864F" />
        <path d="M25 42 q-5 -28 25 -30 q30 2 25 30 q-7 -13 -19 -13 q4 6 -2 8 q-7 -8 -17 -4 q-10 2 -12 9 z" fill="#3A2E2A" />
        <path d="M34 39 q8 -5 15 -1 l-1 4 q-7 -3 -13 1 z" fill="#3A2E2A" />
        <path d="M66 39 q-8 -5 -15 -1 l1 4 q7 -3 13 1 z" fill="#3A2E2A" />
        <g className="animate-[mascotBlink_4.5s_ease-in-out_infinite]" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <ellipse cx="42" cy="46" rx="3.6" ry="4" fill="#ffffff" />
          <ellipse cx="58" cy="46" rx="3.6" ry="4" fill="#ffffff" />
          <circle cx="43" cy="47" r="2" fill="#2A2320" />
          <circle cx="57" cy="47" r="2" fill="#2A2320" />
        </g>
        <ellipse cx="50" cy="52" rx="3.6" ry="3" fill="#B5763F" />
        <path d="M36 56 q6 -3 14 2 q8 -5 14 -2 q-2 9 -14 6 q-12 3 -14 -6 z" fill="#3A2E2A" />
        {mood === 'sad' ? (
          <path d="M44 65 q6 -4 12 0" stroke="#5A2E2E" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : speaking ? (
          <ellipse cx="50" cy="63" rx="3.5" ry="3" fill="#5A2E2E" className="animate-[mascotTalk_0.26s_ease-in-out_infinite]" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        ) : (
          <path d="M44 62 q6 4 12 0" stroke="#5A2E2E" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}

// Nút loa 🔊 có hiệu ứng khi bấm (vòng sóng lan + nảy nhẹ).
function Spk({ onSpeak, className }: { onSpeak: () => void; className?: string }) {
  const [ping, setPing] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { unlockAudio(); setPing(true); window.setTimeout(() => setPing(false), 600); onSpeak(); }}
      className={`relative inline-grid place-items-center transition active:scale-90 ${className ?? 'text-[#1cb0f6]'}`}
      aria-label="Đọc"
    >
      <span className={ping ? 'inline-block scale-110 transition-transform' : 'inline-block transition-transform'}>🔊</span>
      {ping && <span className="pointer-events-none absolute -inset-2 animate-ping rounded-full bg-[#1cb0f6]/25" />}
    </button>
  );
}

// Ảnh nhỏ inline cho thẻ chữ (ghép cặp): có link → ảnh, không thì emoji, không có gì → bỏ.
function Thumb({ url, emoji }: { url?: string; emoji?: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="h-7 w-7 shrink-0 rounded object-contain" loading="lazy" />;
  }
  if (emoji) return <span className="shrink-0">{emoji}</span>;
  return null;
}

function pairCls(done: boolean, sel: boolean, wrong: boolean): string {
  if (done) return 'border-[#37464f] bg-[#1f2c34] text-slate-600 opacity-50';
  if (sel) return wrong ? 'border-[#ff4b4b] bg-[#ff4b4b]/15 text-[#ff7b7b]' : 'border-[#1cb0f6] bg-[#1cb0f6]/15 text-[#1cb0f6]';
  return 'border-[#37464f] bg-[#1f2c34] text-white hover:bg-[#26343d]';
}
