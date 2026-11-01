// Danh sách GỘP mọi từ có hình của trang Phonics (/phonics-tieng-anh) — dùng cho admin thay
// emoji bằng ảnh. Ảnh lưu chung bảng vocab_images (API /api/vocab-images) với khóa riêng
// "phonics:<từ>" để không đụng ảnh của trang Từ vựng tiếng Anh.
//
// Một ảnh cho MỘT từ: "sheep" ở âm sh, ee và Họ từ -eep dùng chung một ảnh.
//
// THỨ TỰ LẤY ẢNH: ảnh riêng Phonics ("phonics:cat") → ảnh của trang Từ vựng cùng từ tiếng Anh
// ("dong-vat:cat") → emoji. Từ có ở nhiều chủ đề từ vựng (chicken: con gà / thịt gà) thì ưu tiên
// chủ đề có nghĩa tiếng Việt trùng với Phonics, rồi theo thứ tự chủ đề.

import { ENGLISH_ALPHABET } from './englishAlphabet';
import { PHONICS_GROUPS } from './phonics';
import { WORD_FAMILIES } from './wordFamilies';
import { DIGRAPH_CATEGORIES, DIGRAPHS } from './digraphs';
import type { VocabTopic } from './vocab';

export const phonicsImageKey = (word: string) => `phonics:${word.trim().toLowerCase()}`;

export type PhonicsSection = 'alphabet' | 'cvc' | 'family' | 'digraph';

export const PHONICS_SECTIONS: { id: PhonicsSection; label: string }[] = [
  { id: 'alphabet', label: 'Âm 26 chữ cái' },
  { id: 'cvc', label: 'Ghép vần (CVC)' },
  { id: 'family', label: 'Họ từ (Word Family)' },
  { id: 'digraph', label: 'Âm ghép & nhóm âm' },
];

export type PhonicsImageWord = {
  key: string;
  word: string;
  vi: string;
  emoji: string;
  sections: PhonicsSection[];
  places: string[]; // vd ["CVC · A", "Họ từ -at"]
};

function collect(): PhonicsImageWord[] {
  const byKey = new Map<string, PhonicsImageWord>();
  const add = (word: string, vi: string, emoji: string, section: PhonicsSection, place: string) => {
    const key = phonicsImageKey(word);
    const cur = byKey.get(key);
    if (!cur) {
      byKey.set(key, { key, word: word.toLowerCase(), vi, emoji, sections: [section], places: [place] });
      return;
    }
    if (!cur.sections.includes(section)) cur.sections.push(section);
    if (!cur.places.includes(place)) cur.places.push(place);
  };
  for (const l of ENGLISH_ALPHABET) add(l.word, l.vi, l.emoji, 'alphabet', `Chữ ${l.upper}`);
  for (const g of PHONICS_GROUPS) for (const x of g.words) add(x.word, x.vi, x.emoji, 'cvc', `CVC · ${g.vowel.toUpperCase()}`);
  for (const f of WORD_FAMILIES) for (const x of f.words) add(x.word, x.vi, x.emoji, 'family', `Họ từ -${f.rime}`);
  const catLabel = Object.fromEntries(DIGRAPH_CATEGORIES.map((c) => [c.id, c.label]));
  for (const d of DIGRAPHS) for (const x of d.words) add(x.word, x.vi, x.emoji, 'digraph', `${catLabel[d.category]} · ${d.letters}`);
  return [...byKey.values()];
}

export const PHONICS_IMAGE_WORDS: PhonicsImageWord[] = collect();

/** Khóa ảnh dự phòng: { "phonics:cat": ["dong-vat:cat", …] } — khóa ảnh trang Từ vựng cùng từ. */
export type VocabFallback = Record<string, string[]>;

const normVi = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();

/**
 * Dựng bảng dự phòng từ dữ liệu Từ vựng (truyền vào thay vì import — vocab.ts ~100KB, chỉ
 * nên chạy ở server rồi gửi xuống bảng nhỏ này). Khóa ảnh từ vựng = "{slug}:{en}".
 */
export function buildVocabFallback(topics: VocabTopic[]): VocabFallback {
  const byEn = new Map<string, { key: string; vi: string }[]>();
  for (const t of topics)
    for (const w of t.words) {
      const en = w.en.trim().toLowerCase();
      byEn.set(en, [...(byEn.get(en) ?? []), { key: `${t.slug}:${w.en}`, vi: w.vi }]);
    }
  const out: VocabFallback = {};
  for (const p of PHONICS_IMAGE_WORDS) {
    const list = byEn.get(p.word);
    if (!list) continue;
    const same = (x: { vi: string }) => normVi(x.vi) === normVi(p.vi);
    out[p.key] = [...list.filter(same), ...list.filter((x) => !same(x))].map((x) => x.key);
  }
  return out;
}

/** Ảnh hiệu lực của một từ: ảnh riêng Phonics, không có thì ảnh Từ vựng đầu tiên còn có. */
export function resolvePhonicsImage(
  key: string,
  map: Record<string, string>,
  fallback: VocabFallback,
): { url: string; from: 'phonics' | 'vocab'; vocabKey?: string } | null {
  const ok = (u: string | undefined): u is string => !!u && /^https?:\/\//i.test(u);
  if (ok(map[key])) return { url: map[key], from: 'phonics' };
  for (const vk of fallback[key] ?? []) if (ok(map[vk])) return { url: map[vk], from: 'vocab', vocabKey: vk };
  return null;
}
