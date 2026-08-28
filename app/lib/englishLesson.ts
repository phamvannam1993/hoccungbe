import { VOCAB_TOPICS, type VocabWord } from './vocab';

// Engine bài học tiếng Anh kiểu Duolingo: sinh một bài gồm nhiều dạng câu xen kẽ từ
// dữ liệu từ vựng theo chủ đề. Sinh lúc bấm chơi (client) nên dùng Math.random thoải mái.

export type Exercise =
  | { kind: 'meaning'; word: VocabWord; options: VocabWord[]; correct: number } // en → chọn nghĩa Việt (thẻ chữ)
  | { kind: 'word'; word: VocabWord; options: string[]; correct: number } // Việt → chọn từ Anh (thẻ chữ)
  | { kind: 'pick'; word: VocabWord; options: VocabWord[]; correct: number } // "Đâu là ..." → chọn tranh
  | { kind: 'listen'; word: VocabWord; options: VocabWord[]; correct: number } // nghe → chọn tranh
  | { kind: 'translate'; en: string; answer: string[]; bank: string[] } // nghe câu → xếp thẻ chữ Việt
  | { kind: 'pairs'; words: VocabWord[] }; // ghép cặp Anh ↔ Việt

function shuf<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Lấy n từ khác nhau (theo keyFn), khác giá trị loại trừ. */
function pickN(pool: VocabWord[], keyFn: (w: VocabWord) => string, exclude: string, n: number): VocabWord[] {
  const seen = new Set<string>([exclude]);
  const out: VocabWord[] = [];
  for (const w of shuf(pool)) {
    const k = keyFn(w);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(w);
    if (out.length >= n) break;
  }
  return out;
}

export function topicBySlug(slug: string) {
  return VOCAB_TOPICS.find((t) => t.slug === slug);
}

/** Tách câu thành các thẻ chữ (bỏ dấu câu). */
function tokenize(s: string): string[] {
  return s
    .replace(/[.,!?;:"“”'()]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/** Dạng dịch câu: hiện câu tiếng Anh, xếp thẻ chữ tiếng Việt đúng thứ tự. */
function buildTranslate(w: VocabWord, pool: VocabWord[]): Exercise | null {
  if (!w.example || !w.exampleVi) return null;
  const answer = tokenize(w.exampleVi);
  if (answer.length < 2 || answer.length > 8) return null;
  const distr = pickN(pool, (x) => x.vi, w.vi, 4)
    .map((x) => x.vi.split(/\s+/)[0])
    .filter((t) => t && !answer.includes(t));
  const bank = shuf([...answer, ...distr.slice(0, 2)]);
  return { kind: 'translate', en: w.example, answer, bank };
}

export const LESSON_TOPICS = VOCAB_TOPICS.filter((t) => t.words.filter((w) => w.en && w.vi).length >= 6);

/** Sinh một bài học (~10 câu) từ danh sách từ của một chủ đề. */
export function buildLesson(pool: VocabWord[]): Exercise[] {
  const clean = pool.filter((w) => w.en && w.vi);
  const words = shuf(clean).slice(0, 8);
  if (words.length < 4) return [];
  const withEmoji = clean.filter((w) => w.emoji);
  const ex: Exercise[] = [];

  // Mở đầu: ghép cặp 4 từ.
  ex.push({ kind: 'pairs', words: shuf(words).slice(0, 4) });

  const canImg = withEmoji.length >= 4;
  words.forEach((w, i) => {
    const type = i % 4;
    if (type === 2 && w.emoji && canImg) {
      // "Đâu là ...?" → chọn tranh (đọc tiếng Việt, chọn thẻ hình tiếng Anh)
      const opts = shuf([w, ...pickN(withEmoji, (x) => x.en, w.en, 3)]);
      ex.push({ kind: 'pick', word: w, options: opts, correct: opts.indexOf(w) });
    } else if (type === 3 && w.emoji && canImg) {
      // Nghe → chọn tranh
      const opts = shuf([w, ...pickN(withEmoji, (x) => x.en, w.en, 3)]);
      ex.push({ kind: 'listen', word: w, options: opts, correct: opts.indexOf(w) });
    } else if (type === 1) {
      // Việt → chọn từ Anh (thẻ chữ)
      const opts = shuf([w.en, ...pickN(clean, (x) => x.en, w.en, 3).map((x) => x.en)]);
      ex.push({ kind: 'word', word: w, options: opts, correct: opts.indexOf(w.en) });
    } else {
      // Anh → chọn nghĩa Việt (thẻ chữ, kèm ảnh/emoji)
      const opts = shuf([w, ...pickN(clean, (x) => x.vi, w.vi, 3)]);
      ex.push({ kind: 'meaning', word: w, options: opts, correct: opts.indexOf(w) });
    }
  });

  // Xen 1–2 câu dịch (nếu chủ đề có ví dụ câu).
  const withEx = words.filter((w) => w.example && w.exampleVi);
  shuf(withEx)
    .slice(0, 2)
    .forEach((w) => {
      const t = buildTranslate(w, clean);
      if (t) ex.splice(Math.min(ex.length - 1, 3 + Math.floor(Math.random() * 4)), 0, t);
    });

  // Kết: ghép cặp 4 từ còn lại (nếu đủ).
  const rest = shuf(words).slice(0, 4);
  ex.push({ kind: 'pairs', words: rest });

  return ex;
}
