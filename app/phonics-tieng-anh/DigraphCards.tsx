'use client';

import { useEffect, useRef, useState } from 'react';
import { DIGRAPH_CATEGORIES, DIGRAPHS, type DigraphCategory } from '../lib/digraphs';
import { speakEnThenVi, speakEnglish, speakEnglishSlow, speakSequence, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import WordCard, { BLUE, INK, PRINT_CSS, printOnly, type Segment } from './WordCard';

// Tách từ để tô màu chữ ghép (vị trí xuất hiện đầu tiên, không phân biệt hoa thường: August).
function split(word: string, letters: string): Segment[] {
  const at = word.toLowerCase().indexOf(letters);
  if (at < 0) return [{ text: word, color: INK }];
  return [
    { text: word.slice(0, at), color: INK },
    { text: word.slice(at, at + letters.length), color: BLUE },
    { text: word.slice(at + letters.length), color: INK },
  ].filter((s) => s.text);
}

// Tô đậm từ đang học trong câu ví dụ.
function Sentence({ text, word }: { text: string; word: string }) {
  const i = text.toLowerCase().indexOf(word.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <b className="text-[#1565c0]">{text.slice(i, i + word.length)}</b>
      {text.slice(i + word.length)}
    </>
  );
}

const DEFAULT = DIGRAPHS.findIndex((d) => d.letters === 'wh'); // như thẻ mẫu whale

export default function DigraphCards() {
  const [di, setDi] = useState(DEFAULT);
  const [wi, setWi] = useState(0);
  const gridRef = useRef<HTMLUListElement>(null);
  const dg = DIGRAPHS[di];
  const cat = DIGRAPH_CATEGORIES.find((c) => c.id === dg.category)!;
  const word = dg.words[wi] ?? dg.words[0];
  const mainSound = dg.sound.split(',')[0].trim();
  const wordSound = word.ipa ?? mainSound;
  const multi = dg.sound.includes(',');

  // Trong danh mục: gom nhóm theo hàng "level" (Cơ bản / Mở rộng / Blends với l…), giữ thứ tự dữ liệu.
  const inCat = DIGRAPHS.map((d, i) => ({ d, i })).filter(({ d }) => d.category === dg.category);
  const levels = [...new Set(inCat.map(({ d }) => d.level))];

  useEffect(() => () => stopSpeaking(), []);

  const pickGroup = (i: number) => {
    unlockAudio();
    setDi(i);
    setWi(0);
  };
  const pickCat = (c: DigraphCategory) => pickGroup(DIGRAPHS.findIndex((d) => d.category === c));
  const go = (step: number) => {
    unlockAudio();
    const n = dg.words.length;
    const next = (wi + step + n) % n;
    setWi(next);
    speakEnglish(dg.words[next].word);
  };
  // "Nghe nhóm âm": đọc tên các chữ (S-H) rồi 3 từ ví dụ chậm → bé nghe âm chung trong nhiều từ.
  // (Giọng đọc máy không phát được một âm rời như /ʃ/ cho chuẩn, nên nghe âm qua từ mẫu.)
  const playGroupSound = () => {
    unlockAudio();
    speakSequence([
      { text: dg.letters.toUpperCase().split('').join(', '), lang: 'en' },
      ...dg.words.slice(0, 3).map((x) => ({ text: x.word, lang: 'en' as const, speed: 0.6 })),
    ]);
  };

  const btn = 'rounded-full px-4 py-2 text-sm font-black shadow-sm transition active:scale-95';

  return (
    <>
      <style>{PRINT_CSS}</style>

      {/* Tầng 1: 4 danh mục */}
      <div className="mt-4 flex flex-wrap gap-2">
        {DIGRAPH_CATEGORIES.map((c) => {
          const n = DIGRAPHS.filter((d) => d.category === c.id).length;
          const on = c.id === dg.category;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => pickCat(c.id)}
              className={`rounded-2xl border-2 px-4 py-2 text-sm font-black transition ${on ? 'border-transparent bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300'}`}
            >
              {c.label} <span className={on ? 'text-white/80' : 'text-slate-400'}>· {n}</span>
            </button>
          );
        })}
      </div>

      {/* Tầng 2: các nhóm trong danh mục, theo mức */}
      <div className="mt-3 space-y-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-semibold text-slate-500">{cat.desc}</p>
        {levels.map((lv) => (
          <div key={lv}>
            {levels.length > 1 && <p className="mb-1.5 text-xs font-black uppercase tracking-wide text-slate-400">{lv}</p>}
            <div className="flex flex-wrap gap-2">
              {inCat
                .filter(({ d }) => d.level === lv)
                .map(({ d, i }) => (
                  <button
                    key={d.letters}
                    type="button"
                    onClick={() => pickGroup(i)}
                    className={`rounded-full border-2 px-4 py-1.5 text-sm font-black transition ${i === di ? 'border-transparent bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'border-slate-200 bg-white text-slate-700 hover:border-pink-300'}`}
                  >
                    {d.letters}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-800">
        <b className="text-[#1565c0]">{dg.letters}</b> đọc là <b>{dg.sound}</b>
        {dg.note ? <> — {dg.note}.</> : '.'}
      </div>

      {/* Xem từng từ: thẻ lớn + nghe từ / nghe chậm / nghe nhóm âm / câu ví dụ / chuyển từ */}
      <div className="mt-5 grid items-center gap-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:grid-cols-[minmax(0,260px)_1fr] sm:p-6">
        <div className="mx-auto w-full max-w-[260px]">
          <WordCard
            as="div"
            badge={dg.letters}
            segments={split(word.word, dg.letters)}
            emoji={word.emoji}
            vi={word.vi}
            onTap={() => { unlockAudio(); speakEnThenVi(word.word, word.vi); }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-4xl font-black text-slate-900">{word.word}</span>
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-sm font-black text-sky-700">
              {dg.letters} = {wordSound}
            </span>
            {multi && word.ipa && <span className="text-xs font-bold text-amber-600">(từ này đọc khác âm chính {mainSound})</span>}
          </div>
          <p className="mt-1 font-bold text-emerald-600">{word.vi}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => { unlockAudio(); speakEnglish(word.word); }} className={`${btn} bg-gradient-to-r from-sky-500 to-blue-600 text-white`}>
              🔊 Nghe từ
            </button>
            <button type="button" onClick={() => { unlockAudio(); speakEnglishSlow(word.word); }} className={`${btn} bg-gradient-to-r from-amber-400 to-orange-400 text-white`}>
              🐢 Nghe chậm
            </button>
            <button type="button" onClick={playGroupSound} className={`${btn} bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50`}>
              🔈 Nghe nhóm “{dg.letters}”
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-amber-50 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-amber-600">Câu ví dụ</p>
            <p className="mt-1 text-lg font-bold text-slate-800">
              <Sentence text={word.ex} word={word.word} />
            </p>
            <p className="text-sm font-semibold text-slate-500">{word.exVi}</p>
            <button
              type="button"
              onClick={() => { unlockAudio(); speakEnThenVi(word.ex, word.exVi); }}
              className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-black text-amber-700 shadow-sm ring-1 ring-amber-200 hover:bg-amber-100"
            >
              🔊 Nghe câu
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} className={`${btn} bg-slate-100 text-slate-700 hover:bg-slate-200`} aria-label="Từ trước">
              ◀ Từ trước
            </button>
            <span className="text-sm font-black text-slate-400">
              {wi + 1}/{dg.words.length}
            </span>
            <button type="button" onClick={() => go(1)} className={`${btn} bg-slate-100 text-slate-700 hover:bg-slate-200`} aria-label="Từ tiếp">
              Từ tiếp ▶
            </button>
          </div>
        </div>
      </div>

      {/* Bộ thẻ của nhóm (in được) */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-black text-slate-800">
          🃏 Bộ thẻ “{dg.letters}” · {dg.words.length} từ
        </h3>
        <button
          type="button"
          onClick={() => { unlockAudio(); speakSequence(dg.words.map((x) => ({ text: x.word, lang: 'en' as const }))); }}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-sky-700 shadow-sm ring-1 ring-sky-100 hover:bg-sky-100"
        >
          🔊 Nghe cả nhóm
        </button>
      </div>
      <ul ref={gridRef} className="wc-grid mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
        {dg.words.map((x, i) => (
          <WordCard
            key={x.word}
            badge={dg.letters}
            segments={split(x.word, dg.letters)}
            emoji={x.emoji}
            vi={x.ipa ? `${x.vi} · ${x.ipa}` : x.vi}
            selected={i === wi}
            onTap={() => { unlockAudio(); setWi(i); speakEnThenVi(x.word, x.vi); }}
          />
        ))}
      </ul>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => printOnly(gridRef.current)}
          className="rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-6 py-2.5 text-sm font-black text-white shadow transition hover:brightness-105 active:scale-95"
        >
          🖨 In {dg.words.length} thẻ “{dg.letters}”
        </button>
      </div>
    </>
  );
}
