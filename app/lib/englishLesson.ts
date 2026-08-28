import { VOCAB_TOPICS, type VocabWord } from './vocab';
import { DIALOGUES, type DialogueLine } from './englishDialogues';

// Engine bài học tiếng Anh kiểu Duolingo: sinh một bài gồm nhiều dạng câu xen kẽ từ
// dữ liệu từ vựng theo chủ đề. Sinh lúc bấm chơi (client) nên dùng Math.random thoải mái.

export type Exercise =
  | { kind: 'meaning'; word: VocabWord; options: VocabWord[]; correct: number } // en → chọn nghĩa Việt (thẻ chữ)
  | { kind: 'word'; word: VocabWord; options: string[]; correct: number } // Việt → chọn từ Anh (thẻ chữ)
  | { kind: 'pick'; word: VocabWord; options: VocabWord[]; correct: number } // "Đâu là ..." → chọn tranh
  | { kind: 'listen'; word: VocabWord; options: VocabWord[]; correct: number } // nghe → chọn tranh
  | { kind: 'translate'; en: string; answer: string[]; bank: string[] } // nghe câu → xếp thẻ chữ Việt
  | { kind: 'fill'; word: VocabWord; answer: string[]; bank: string[] } // nghe từ → xếp thẻ chữ Anh
  | { kind: 'dialogue'; lines: DialogueLine[]; blank: number; options: string[]; correct: number } // hoàn thành hội thoại
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

/** Dạng "nghe và điền": nghe từ tiếng Anh, xếp các thẻ chữ thành từ đúng. */
function buildFill(w: VocabWord, pool: VocabWord[]): Exercise {
  const answer = tokenize(w.en);
  const distr = pickN(pool, (x) => x.en, w.en, 4)
    .map((x) => x.en)
    .filter((t) => t && !answer.includes(t));
  const bank = shuf([...answer, ...distr.slice(0, answer.length >= 2 ? 2 : 2)]);
  return { kind: 'fill', word: w, answer, bank };
}

// ── Các hàm dựng 1 câu hỏi cho một từ ──
function makeMeaning(w: VocabWord, clean: VocabWord[]): Exercise {
  const opts = shuf([w, ...pickN(clean, (x) => x.vi, w.vi, 3)]);
  return { kind: 'meaning', word: w, options: opts, correct: opts.indexOf(w) };
}
function makeWord(w: VocabWord, clean: VocabWord[]): Exercise {
  const opts = shuf([w.en, ...pickN(clean, (x) => x.en, w.en, 3).map((x) => x.en)]);
  return { kind: 'word', word: w, options: opts, correct: opts.indexOf(w.en) };
}
function makePick(w: VocabWord, withEmoji: VocabWord[]): Exercise {
  const opts = shuf([w, ...pickN(withEmoji, (x) => x.en, w.en, 3)]);
  return { kind: 'pick', word: w, options: opts, correct: opts.indexOf(w) };
}
function makeListen(w: VocabWord, withEmoji: VocabWord[]): Exercise {
  const opts = shuf([w, ...pickN(withEmoji, (x) => x.en, w.en, 3)]);
  return { kind: 'listen', word: w, options: opts, correct: opts.indexOf(w) };
}

/** Dạng "hoàn thành hội thoại": lấy ngẫu nhiên 1 hội thoại, ẩn 1 câu để bé chọn. */
function buildDialogue(): Exercise | null {
  if (!DIALOGUES.length) return null;
  const d = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
  const correctEn = d.lines[d.blank].en;
  const opts = shuf([correctEn, ...d.distractors]);
  return { kind: 'dialogue', lines: d.lines, blank: d.blank, options: opts, correct: opts.indexOf(correctEn) };
}

/** Sinh một bài học (~20 câu) từ danh sách từ của một chủ đề. */
export function buildLesson(pool: VocabWord[]): Exercise[] {
  const clean = pool.filter((w) => w.en && w.vi);
  if (clean.length < 4) return [];
  const withEmoji = clean.filter((w) => w.emoji);
  const canImg = withEmoji.length >= 4;
  const CORE = 18; // số câu lõi (chưa tính 2 ghép cặp + 1 hội thoại) → tổng ~20–21

  // Kho câu hỏi: mỗi từ sinh nhiều dạng, rồi trộn và lấy đủ số lượng.
  const q: Exercise[] = [];
  for (const w of clean) {
    q.push(makeMeaning(w, clean));
    q.push(makeWord(w, clean));
    if (w.emoji && canImg) {
      q.push(makePick(w, withEmoji));
      q.push(makeListen(w, withEmoji));
    }
    q.push(buildFill(w, clean));
    const t = buildTranslate(w, clean);
    if (t) q.push(t);
  }
  const core = shuf(q).slice(0, CORE);

  const ex: Exercise[] = [];
  ex.push({ kind: 'pairs', words: shuf(clean).slice(0, 4) });
  ex.push(...core);
  const dlg = buildDialogue();
  if (dlg) ex.splice(Math.min(ex.length, 5 + Math.floor(Math.random() * 5)), 0, dlg);
  ex.push({ kind: 'pairs', words: shuf(clean).slice(0, 4) });

  return ex;
}
