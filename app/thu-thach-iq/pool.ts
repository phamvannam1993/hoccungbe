// Ngân hàng câu hỏi cho "Thử thách IQ" — CHỈ chạy phía server (page.tsx).
// Nguồn:
//   1. Toán tư duy lớp 1–5 (app/toan-tu-duy/data.ts) — trắc nghiệm, có lời giải.
//   2. Khóa Toán IQ (app/khoa-hoc-iq): CHỈ các bài HỌC THỬ MIỄN PHÍ (isFreeLesson), CHỈ câu
//      trắc nghiệm một đáp án, lựa chọn là chữ/emoji (không ảnh, không tiền), hình minh họa
//      chỉ là dòng emoji hoặc ma trận (bỏ đồng hồ/tiền/ảnh vì cần trình vẽ riêng).
//      Câu của bài trả phí KHÔNG BAO GIỜ được đưa vào đây.

import { GRADES, TOAN_TU_DUY } from '../toan-tu-duy/data';
import { courses, getLessons, isFreeLesson } from '../khoa-hoc-iq/lib/catalog';
import type { Tile } from '../khoa-hoc-iq/lib/types';
import { assignTiers, rankOf, type IqItem, type IqTier } from '../lib/thuThachIq';

type Raw = Omit<IqItem, 'tier'> & { rank: number; difficulty?: IqTier };

const CLOCK_EMOJI = /[\u{1F550}-\u{1F567}⏰⌚]/u;
const tileLabel = (t: Tile) => [t.emoji, t.text].filter(Boolean).join(' ').trim();

function fromTuDuy(): Raw[] {
  const out: Raw[] = [];
  for (const g of GRADES) {
    const qs = TOAN_TU_DUY[g]?.questions ?? [];
    qs.forEach((q, i) => {
      out.push({
        id: q.id,
        grade: g,
        source: 'tu-duy',
        question: q.question,
        speech: q.question_speech,
        options: q.options,
        correct: q.correct_index,
        explanation: q.explanation,
        rank: rankOf(i, qs.length, q.question),
        difficulty: q.difficulty,
      });
    });
  }
  return out;
}

function fromFreeIqLessons(): Raw[] {
  const out: Raw[] = [];
  for (const course of courses) {
    const grade = Number(String(course.grade).replace(/\D/g, ''));
    if (!(grade >= 1 && grade <= 5)) continue;
    getLessons(course.slug).forEach((lesson, li) => {
      if (!isFreeLesson(course, li)) return; // chỉ bài học thử miễn phí
      lesson.questions.forEach((q, qi) => {
        if (q.type !== 'choice') return;
        if (q.options.some((o) => o.image || o.money !== undefined || !tileLabel(o))) return;
        const v = q.visual;
        if (v && (v.image || v.clock || v.money)) return;
        if (v?.emoji && CLOCK_EMOJI.test(v.emoji)) return;
        if (CLOCK_EMOJI.test(q.prompt)) return;
        const explanation = [q.explanation, q.method && !q.explanation ? q.method : ''].filter(Boolean).join('\n');
        out.push({
          id: `iq:${q.id}`,
          grade,
          source: 'iq',
          question: q.prompt,
          speech: q.speak,
          visual: v ? { emoji: v.emoji, grid: v.grid } : undefined,
          options: q.options.map(tileLabel),
          correct: q.answer,
          explanation: explanation || undefined,
          rank: rankOf(qi, lesson.questions.length, q.prompt),
        });
      });
    });
  }
  return out;
}

let cache: IqItem[] | null = null;

/** Toàn bộ ngân hàng (mọi lớp) đã gắn mức độ Dễ/Vừa/Khó. */
export function getIqPool(): IqItem[] {
  if (cache) return cache;
  const seen = new Set<string>();
  const raw = [...fromTuDuy(), ...fromFreeIqLessons()].filter((q) => {
    if (q.correct < 0 || q.correct >= q.options.length) return false;
    const key = `${q.grade}|${q.question.replace(/\s+/g, ' ').trim().toLowerCase()}`;
    if (seen.has(key)) return false; // bỏ câu trùng đề trong cùng lớp
    seen.add(key);
    return true;
  });
  cache = assignTiers(raw).map((x) => {
    const q: IqItem & { rank?: number; difficulty?: IqTier } = { ...x };
    delete q.rank;
    delete q.difficulty;
    return q;
  });
  return cache;
}
