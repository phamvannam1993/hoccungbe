'use client';

import { useState } from 'react';
import { ENGLISH_ALPHABET } from '../../lib/englishAlphabet';
import { PHONICS_GROUPS } from '../../lib/phonics';
import { WORD_FAMILIES } from '../../lib/wordFamilies';
import { DIGRAPHS } from '../../lib/digraphs';
import type { VocabFallback } from '../../lib/phonicsWords';
import { PhonicsImagesProvider } from '../../phonics-tieng-anh/PhonicsPic';
import WordCard, { BLUE, INK, RED, type Segment } from '../../phonics-tieng-anh/WordCard';
import { FlowerCard } from '../../phonics-tieng-anh/WordFamilyFlower';
import { split } from '../../phonics-tieng-anh/DigraphCards';
import PackToolbar from './PackToolbar';

type Card = { key: string; badge: string; segments: Segment[]; emoji: string; vi: string };
type Part = 'chu-cai' | 'cvc' | 'ho-tu' | 'am-ghep';

const PARTS: { id: Part; label: string }[] = [
  { id: 'chu-cai', label: 'Bảng chữ cái' },
  { id: 'cvc', label: 'Ghép vần CVC' },
  { id: 'ho-tu', label: 'Họ từ' },
  { id: 'am-ghep', label: 'Âm ghép' },
];

const alphabetCards = (): Card[] =>
  ENGLISH_ALPHABET.map((l) => ({
    key: `abc-${l.upper}`,
    badge: `${l.upper}${l.lower}`,
    segments: [
      { text: l.word.slice(0, 1), color: RED },
      { text: l.word.slice(1), color: INK },
    ],
    emoji: l.emoji,
    vi: l.vi,
  }));

const cvcCards = (): Card[] =>
  PHONICS_GROUPS.flatMap((g) =>
    g.words.map((w) => ({
      key: `cvc-${w.word}`,
      badge: g.vowel,
      segments: [
        { text: w.letters[0], color: INK },
        { text: w.letters[1], color: RED },
        { text: w.letters[2], color: INK },
      ],
      emoji: w.emoji,
      vi: w.vi,
    })),
  );

const onsetOf = (word: string, rime: string) => (word.endsWith(rime) ? word.slice(0, word.length - rime.length) : word);

const familyCards = (fam: (typeof WORD_FAMILIES)[number]): Card[] =>
  fam.words.map((w) => {
    const onset = onsetOf(w.word, fam.rime);
    return {
      key: `fam-${fam.rime}-${w.word}`,
      badge: onset || `-${fam.rime}`,
      segments: [
        { text: onset, color: BLUE },
        { text: w.word.slice(onset.length), color: RED },
      ].filter((s) => s.text),
      emoji: w.emoji,
      vi: w.vi,
    };
  });

const digraphCards = (): Card[] =>
  DIGRAPHS.flatMap((d) =>
    d.words.map((w) => ({ key: `dg-${d.letters}-${w.word}`, badge: d.letters, segments: split(w.word, d.letters), emoji: w.emoji, vi: w.vi })),
  );

// Khổ A4; card nhỏ 3 cột (9 card/trang), card lớn 2 cột (4 card/trang); thẻ hoa 2 cột. Viền nét đứt = đường cắt.
const CSS = `
  @page { size: A4 portrait; margin: 10mm; @bottom-right { content: "Trang " counter(page); font: 9px sans-serif; color: #94a3b8; } }
  .ps, .ps * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .ps .wc-hint { display: none; }
  .ps .wc-card { box-shadow: none !important; outline: 1px dashed #cbd5e1; outline-offset: 2mm; }
  .ps-grid { display: grid; justify-content: center; }
  .ps-grid.nho { grid-template-columns: repeat(3, 58mm); gap: 8mm 6mm; }
  .ps-grid.lon { grid-template-columns: repeat(2, 86mm); gap: 10mm 10mm; }
  .ps-flowers { display: grid; grid-template-columns: repeat(2, 86mm); gap: 8mm 10mm; justify-content: center; }
  .ps-flowers .wf-card { max-width: none !important; box-shadow: none !important; outline: 1px dashed #cbd5e1; outline-offset: 2mm; }
  .ps-grid > *, .ps-flowers > * { break-inside: avoid; }
  @media print {
    .no-print { display: none !important; }
    body, .khv-root { background: #fff !important; }
    .ps-part + .ps-part { break-before: page; }
  }
`;

/**
 * Trọn bộ card Phonics để in. `limit` = số card mỗi phần khi CHƯA mua (bản xem thử); null = đủ bộ.
 * Danh sách cắt bớt ở đây là dữ liệu công khai (trang phonics miễn phí cũng có) — cái được bán là bản in trọn bộ.
 */
export default function PhonicsPrintSheet({ fallback, limit, locked }: { fallback: VocabFallback; limit: number | null; locked: React.ReactNode }) {
  const [parts, setParts] = useState<Part[]>(PARTS.map((p) => p.id));
  const [size, setSize] = useState<'nho' | 'lon'>('nho');
  const cut = <T,>(xs: T[]) => (limit === null ? xs : xs.slice(0, limit));
  const families = cut(WORD_FAMILIES);
  const on = (p: Part) => parts.includes(p);
  const toggle = (p: Part) => setParts((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const grid = (cards: Card[]) => (
    <ul className={`ps-grid ${size} mt-4`}>
      {cards.map((c) => (
        <WordCard key={c.key} badge={c.badge} segments={c.segments} emoji={c.emoji} vi={c.vi} onTap={() => {}} />
      ))}
    </ul>
  );

  return (
    <PhonicsImagesProvider fallback={fallback}>
      <style>{CSS}</style>
      <PackToolbar>
        <div className="flex flex-wrap gap-1.5">
          {PARTS.map((p) => (
            <label key={p.id} className="flex items-center gap-1.5 rounded-xl border-2 border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700">
              <input type="checkbox" checked={on(p.id)} onChange={() => toggle(p.id)} />
              {p.label}
            </label>
          ))}
        </div>
        <select value={size} onChange={(e) => setSize(e.target.value as 'nho' | 'lon')} className="rounded-xl border-2 border-slate-200 px-2 py-1.5 text-xs font-bold">
          <option value="nho">Card nhỏ · 9 card/trang</option>
          <option value="lon">Card lớn · 4 card/trang</option>
        </select>
      </PackToolbar>

      {locked && <div className="no-print mt-4 px-4">{locked}</div>}

      <div className="ps mx-auto max-w-[860px] px-4 pt-6 print:px-0 print:pt-0">
        {on('chu-cai') && (
          <section className="ps-part">
            <h2 className="text-center text-2xl font-black text-slate-800">🔤 Bảng chữ cái A–Z</h2>
            {grid(cut(alphabetCards()))}
          </section>
        )}
        {on('cvc') && (
          <section className="ps-part mt-10 print:mt-0">
            <h2 className="text-center text-2xl font-black text-slate-800">🧩 Ghép vần CVC (5 nguyên âm ngắn)</h2>
            {grid(cut(cvcCards()))}
          </section>
        )}
        {on('ho-tu') && (
          <section className="ps-part mt-10 print:mt-0">
            <h2 className="text-center text-2xl font-black text-slate-800">🌸 Thẻ hoa họ từ (word family)</h2>
            <div className="ps-flowers mt-4">
              {families.map((f) => (
                <FlowerCard key={f.rime} fam={f} />
              ))}
            </div>
            <h3 className="mt-8 text-center text-xl font-black text-slate-800 print:break-before-page">Thẻ từng từ trong họ</h3>
            {grid(families.flatMap(familyCards))}
          </section>
        )}
        {on('am-ghep') && (
          <section className="ps-part mt-10 print:mt-0">
            <h2 className="text-center text-2xl font-black text-slate-800">🔗 Âm ghép · vowel team · r-controlled · blends</h2>
            {grid(cut(digraphCards()))}
          </section>
        )}
        {limit !== null && <div className="no-print mt-8">{locked}</div>}
      </div>
    </PhonicsImagesProvider>
  );
}
