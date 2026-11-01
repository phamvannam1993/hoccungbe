'use client';

import { useRef, useState } from 'react';
import { FAMILY_GROUPS, WORD_FAMILIES, type FamilyGroup } from '../lib/wordFamilies';
import { speakEnThenVi, speakSequence, unlockAudio } from '../components/edu/utils/speech';
import PhonicsPic from './PhonicsPic';
import WordCard, { BLUE, PRINT_CSS, RED, printOnly } from './WordCard';

const BG = '/assets/images/bg-card.webp'; // 1024×1536: bông hoa 5 cánh trống + nhụy vàng

// Tâm 5 cánh hoa & nhụy trên ảnh nền (% theo bề rộng / bề cao ảnh), thứ tự: trên, trái-trên,
// phải-trên, trái-dưới, phải-dưới (giống thẻ word family in sẵn).
const PETALS = [
  { x: 50, y: 16 },
  { x: 23, y: 33 },
  { x: 77, y: 33 },
  { x: 26.5, y: 60 },
  { x: 73.5, y: 60 },
];
const CENTER = { x: 50, y: 42 };

// Thẻ hoa in trọn một trang A4 dọc (phần ẩn/hiện chung nằm trong PRINT_CSS của WordCard).
const FLOWER_PRINT_CSS = `
  @media print {
    .print-only.wf-card { margin: 0 auto !important; width: 170mm !important; max-width: none !important; box-shadow: none !important; break-inside: avoid; }
  }
`;

const onsetOf = (word: string, rime: string) => (word.endsWith(rime) ? word.slice(0, word.length - rime.length) : word);

function PetalWord({ word, rime }: { word: string; rime: string }) {
  const onset = onsetOf(word, rime);
  return (
    <span className="font-black leading-none tracking-tight" style={{ fontSize: `${Math.min(9, 40 / word.length)}cqw` }}>
      <span className="text-slate-900">{onset}</span>
      <span className="text-red-600">{word.slice(onset.length)}</span>
    </span>
  );
}

const FIRST: Record<FamilyGroup, number> = Object.fromEntries(
  FAMILY_GROUPS.map((g) => [g.id, WORD_FAMILIES.findIndex((f) => f.group === g.id)]),
) as Record<FamilyGroup, number>;

export default function WordFamilyFlower() {
  const [fi, setFi] = useState(() => WORD_FAMILIES.findIndex((f) => f.rime === 'ed')); // như thẻ mẫu -ed
  const [active, setActive] = useState<number | null>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);
  const fam = WORD_FAMILIES[fi];
  const group = FAMILY_GROUPS.find((g) => g.id === fam.group)!;
  const inGroup = WORD_FAMILIES.map((f, i) => ({ f, i })).filter(({ f }) => f.group === fam.group);
  const petals = fam.words.slice(0, 5);

  const pick = (i: number) => {
    unlockAudio();
    setFi(i);
    setActive(null);
  };

  const readAll = () => {
    unlockAudio();
    speakSequence(
      fam.words.map((w) => ({ text: w.word, lang: 'en' as const })),
      (i) => setActive(i),
      () => setActive(null),
    );
  };

  return (
    <>
      <style>{PRINT_CSS + FLOWER_PRINT_CSS}</style>

      {/* Tầng 1: nhóm nguyên âm — tránh một danh sách 50+ vần dài dằng dặc */}
      <div className="mt-4 flex flex-wrap gap-2">
        {FAMILY_GROUPS.map((g) => {
          const n = WORD_FAMILIES.filter((f) => f.group === g.id).length;
          const on = g.id === fam.group;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => pick(FIRST[g.id])}
              className={`rounded-2xl border-2 px-4 py-2 text-sm font-black transition ${on ? 'border-transparent bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'}`}
            >
              {g.label} <span className={on ? 'text-white/80' : 'text-slate-400'}>· {n}</span>
            </button>
          );
        })}
      </div>

      {/* Tầng 2: các vần trong nhóm */}
      <div className="mt-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
        <p className="px-1 text-xs font-bold text-slate-400">{group.hint}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {inGroup.map(({ f, i }) => (
            <button
              key={f.rime}
              type="button"
              onClick={() => pick(i)}
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-black transition ${i === fi ? 'border-transparent bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-pink-300'}`}
            >
              -{f.rime}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700">
        Các từ trong một <b>họ từ</b> có chung vần cuối <b className="text-red-600">-{fam.rime}</b> — chỉ đổi chữ đầu là đọc được từ mới. Bấm
        cánh hoa để nghe từng từ, bấm nhụy hoa để nghe cả họ.
        {fam.note && <span className="mt-1 block text-pink-800">⚠️ {fam.note}.</span>}
      </div>

      <div className="mt-5 flex flex-col items-center gap-4">
        <div
          ref={flowerRef}
          className="wf-card relative w-full max-w-[460px] overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100"
          style={{ aspectRatio: '2 / 3', containerType: 'inline-size' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ảnh nền cố định, cần in được */}
          <img src={BG} alt="" className="absolute inset-0 h-full w-full object-cover" />

          {PETALS.map((pos, i) => {
            const w = petals[i];
            if (!w) {
              // Họ chỉ có 4 từ thông dụng → cánh trống để bé tự nghĩ thêm một từ.
              return (
                <span
                  key={`blank-${i}`}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[1.5cqw] text-center"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: '30cqw' }}
                >
                  <span className="font-black leading-none text-slate-300" style={{ fontSize: '9cqw' }}>
                    __<span className="text-red-300">{fam.rime}</span>
                  </span>
                  <span className="font-black leading-none text-pink-300" style={{ fontSize: '12cqw' }}>
                    ?
                  </span>
                  <span className="font-bold leading-tight text-pink-400" style={{ fontSize: '3.6cqw' }}>
                    Bé tìm thêm từ
                  </span>
                </span>
              );
            }
            return (
              <button
                key={w.word}
                type="button"
                onClick={() => { unlockAudio(); setActive(i); speakEnThenVi(w.word, w.vi); }}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[1.5cqw] rounded-full transition active:scale-95 ${active === i ? 'scale-110' : 'hover:scale-105'}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: '30cqw' }}
                aria-label={`Nghe từ ${w.word} – ${w.vi}`}
              >
                <PetalWord word={w.word} rime={fam.rime} />
                <span className="leading-none" style={{ fontSize: '14cqw' }} aria-hidden>
                  <PhonicsPic word={w.word} emoji={w.emoji} />
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={readAll}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-full transition hover:scale-105 active:scale-95"
            style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%`, width: '34cqw' }}
            aria-label={`Nghe cả họ từ ${fam.rime}`}
          >
            <span
              className="font-black leading-none text-red-600"
              style={{ fontSize: fam.rime.length > 3 ? '11cqw' : fam.rime.length > 2 ? '14cqw' : '18cqw' }}
            >
              {fam.rime}
            </span>
            <span className="mt-[1cqw] font-black text-slate-900" style={{ fontSize: '5.5cqw' }}>
              Family
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => printOnly(flowerRef.current)}
          className="rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-6 py-2.5 text-sm font-black text-white shadow transition hover:brightness-105 active:scale-95"
        >
          🖨 In thẻ hoa họ -{fam.rime}
        </button>
      </div>

      {/* Thẻ từ vựng từng từ: huy hiệu = âm đầu, chữ đầu xanh + vần đỏ */}
      <h3 className="mt-10 text-center text-lg font-black text-slate-800">
        🃏 Thẻ từ họ <span className="text-red-600">-{fam.rime}</span> · {fam.words.length} từ
      </h3>
      <ul ref={cardsRef} className="wc-grid mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
        {fam.words.map((w) => {
          const onset = onsetOf(w.word, fam.rime);
          return (
            <WordCard
              key={w.word}
              badge={onset || `-${fam.rime}`}
              segments={[
                { text: onset, color: BLUE },
                { text: w.word.slice(onset.length), color: RED },
              ].filter((s) => s.text)}
              emoji={w.emoji}
              vi={w.vi}
              onTap={() => { unlockAudio(); speakEnThenVi(w.word, w.vi); }}
            />
          );
        })}
      </ul>
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => printOnly(cardsRef.current)}
          className="rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-6 py-2.5 text-sm font-black text-white shadow transition hover:brightness-105 active:scale-95"
        >
          🖨 In {fam.words.length} thẻ từ -{fam.rime}
        </button>
      </div>
    </>
  );
}
