// Đọc danh mục khóa học và bài học từ JSON tạm. CHỈ dùng phía server:
// câu hỏi của bài trả phí không bao giờ được gửi xuống trình duyệt khi chưa mở khóa.

import catalogJson from '../data/courses.json';
import l1k01 from '../data/lessons/iq1-quan-sat-quy-luat.json';
import l1k02 from '../data/lessons/iq1-tu-duy-so-hoc.json';
import l1k03 from '../data/lessons/iq1-toan-loi-van.json';
import l1k04 from '../data/lessons/iq1-hinh-hoc-dem-hinh.json';
import l1k05 from '../data/lessons/iq1-logic-suy-luan.json';
import l1k06 from '../data/lessons/iq1-meo-cau-hoi-bay.json';
import l1k07 from '../data/lessons/iq1-so-sanh-sap-xep.json';
import l1k08 from '../data/lessons/iq1-thoi-gian-dong-ho.json';
import l1k09 from '../data/lessons/iq1-tien-mua-ban.json';
import l1k10 from '../data/lessons/iq1-do-luong-vi-tri.json';
import l1k11 from '../data/lessons/iq1-giai-quyet-van-de.json';
import l1k12 from '../data/lessons/iq1-sieu-thu-thach.json';
import k01 from '../data/lessons/iq2-quan-sat-quy-luat.json';
import k02 from '../data/lessons/iq2-tu-duy-so-hoc.json';
import k03 from '../data/lessons/iq2-toan-loi-van.json';
import k04 from '../data/lessons/iq2-hinh-hoc-dem-hinh.json';
import k05 from '../data/lessons/iq2-logic-suy-luan.json';
import k06 from '../data/lessons/iq2-meo-cau-hoi-bay.json';
import k07 from '../data/lessons/iq2-thoi-gian-dong-ho.json';
import k08 from '../data/lessons/iq2-tien-mua-ban.json';
import k09 from '../data/lessons/iq2-do-luong-so-sanh.json';
import k10 from '../data/lessons/iq2-to-hop-dem-cach.json';
import k11 from '../data/lessons/iq2-giai-quyet-van-de.json';
import k12 from '../data/lessons/iq2-sieu-thu-thach.json';
import l3k01 from '../data/lessons/iq3-quan-sat-quy-luat.json';
import l3k02 from '../data/lessons/iq3-tu-duy-so-hoc.json';
import l3k03 from '../data/lessons/iq3-toan-loi-van.json';
import l3k04 from '../data/lessons/iq3-hinh-hoc-dem-hinh.json';
import l3k05 from '../data/lessons/iq3-logic-suy-luan.json';
import l3k06 from '../data/lessons/iq3-meo-cau-hoi-bay.json';
import l3k07 from '../data/lessons/iq3-thoi-gian-dong-ho.json';
import l3k08 from '../data/lessons/iq3-tien-mua-ban.json';
import l3k09 from '../data/lessons/iq3-do-luong-dai-luong.json';
import l3k10 from '../data/lessons/iq3-to-hop-dem-cach.json';
import l3k11 from '../data/lessons/iq3-giai-quyet-van-de.json';
import l3k12 from '../data/lessons/iq3-sieu-thu-thach.json';
// Phần ĐỌC (khái niệm, ví dụ, các bước, mẹo) của từng bài
import th01 from '../data/theory/iq1-quan-sat-quy-luat.json';
import th02 from '../data/theory/iq1-tu-duy-so-hoc.json';
import th03 from '../data/theory/iq1-toan-loi-van.json';
import th04 from '../data/theory/iq1-hinh-hoc-dem-hinh.json';
import th05 from '../data/theory/iq1-logic-suy-luan.json';
import th06 from '../data/theory/iq1-meo-cau-hoi-bay.json';
import th07 from '../data/theory/iq1-so-sanh-sap-xep.json';
import th08 from '../data/theory/iq1-thoi-gian-dong-ho.json';
import th09 from '../data/theory/iq1-tien-mua-ban.json';
import th10 from '../data/theory/iq1-do-luong-vi-tri.json';
import th11 from '../data/theory/iq1-giai-quyet-van-de.json';
import th12 from '../data/theory/iq1-sieu-thu-thach.json';
import th13 from '../data/theory/iq2-quan-sat-quy-luat.json';
import th14 from '../data/theory/iq2-tu-duy-so-hoc.json';
import th15 from '../data/theory/iq2-toan-loi-van.json';
import th16 from '../data/theory/iq2-hinh-hoc-dem-hinh.json';
import th17 from '../data/theory/iq2-logic-suy-luan.json';
import th18 from '../data/theory/iq2-meo-cau-hoi-bay.json';
import th19 from '../data/theory/iq2-thoi-gian-dong-ho.json';
import th20 from '../data/theory/iq2-tien-mua-ban.json';
import th21 from '../data/theory/iq2-do-luong-so-sanh.json';
import th22 from '../data/theory/iq2-to-hop-dem-cach.json';
import th23 from '../data/theory/iq2-giai-quyet-van-de.json';
import th24 from '../data/theory/iq2-sieu-thu-thach.json';
import th25 from '../data/theory/iq3-quan-sat-quy-luat.json';
import th26 from '../data/theory/iq3-tu-duy-so-hoc.json';
import th27 from '../data/theory/iq3-toan-loi-van.json';
import th28 from '../data/theory/iq3-hinh-hoc-dem-hinh.json';
import th29 from '../data/theory/iq3-logic-suy-luan.json';
import th30 from '../data/theory/iq3-meo-cau-hoi-bay.json';
import th31 from '../data/theory/iq3-thoi-gian-dong-ho.json';
import th32 from '../data/theory/iq3-tien-mua-ban.json';
import th33 from '../data/theory/iq3-do-luong-dai-luong.json';
import th34 from '../data/theory/iq3-to-hop-dem-cach.json';
import th35 from '../data/theory/iq3-giai-quyet-van-de.json';
import th36 from '../data/theory/iq3-sieu-thu-thach.json';
import type { Combo, Course, Grade, Lesson, LessonSummary, Question, ShopInfo, Theory, Tile } from './types';

const LESSON_FILES: Record<string, unknown> = {
  // Lớp 1
  'iq1-quan-sat-quy-luat': l1k01,
  'iq1-tu-duy-so-hoc': l1k02,
  'iq1-toan-loi-van': l1k03,
  'iq1-hinh-hoc-dem-hinh': l1k04,
  'iq1-logic-suy-luan': l1k05,
  'iq1-meo-cau-hoi-bay': l1k06,
  'iq1-so-sanh-sap-xep': l1k07,
  'iq1-thoi-gian-dong-ho': l1k08,
  'iq1-tien-mua-ban': l1k09,
  'iq1-do-luong-vi-tri': l1k10,
  'iq1-giai-quyet-van-de': l1k11,
  'iq1-sieu-thu-thach': l1k12,
  // Lớp 2
  'iq2-quan-sat-quy-luat': k01,
  'iq2-tu-duy-so-hoc': k02,
  'iq2-toan-loi-van': k03,
  'iq2-hinh-hoc-dem-hinh': k04,
  'iq2-logic-suy-luan': k05,
  'iq2-meo-cau-hoi-bay': k06,
  'iq2-thoi-gian-dong-ho': k07,
  'iq2-tien-mua-ban': k08,
  'iq2-do-luong-so-sanh': k09,
  'iq2-to-hop-dem-cach': k10,
  'iq2-giai-quyet-van-de': k11,
  'iq2-sieu-thu-thach': k12,
  // Lớp 3
  'iq3-quan-sat-quy-luat': l3k01,
  'iq3-tu-duy-so-hoc': l3k02,
  'iq3-toan-loi-van': l3k03,
  'iq3-hinh-hoc-dem-hinh': l3k04,
  'iq3-logic-suy-luan': l3k05,
  'iq3-meo-cau-hoi-bay': l3k06,
  'iq3-thoi-gian-dong-ho': l3k07,
  'iq3-tien-mua-ban': l3k08,
  'iq3-do-luong-dai-luong': l3k09,
  'iq3-to-hop-dem-cach': l3k10,
  'iq3-giai-quyet-van-de': l3k11,
  'iq3-sieu-thu-thach': l3k12,
};

const THEORY_FILES: Record<string, Record<string, Theory>> = {
  'iq1-quan-sat-quy-luat': th01,
  'iq1-tu-duy-so-hoc': th02,
  'iq1-toan-loi-van': th03,
  'iq1-hinh-hoc-dem-hinh': th04,
  'iq1-logic-suy-luan': th05,
  'iq1-meo-cau-hoi-bay': th06,
  'iq1-so-sanh-sap-xep': th07,
  'iq1-thoi-gian-dong-ho': th08,
  'iq1-tien-mua-ban': th09,
  'iq1-do-luong-vi-tri': th10,
  'iq1-giai-quyet-van-de': th11,
  'iq1-sieu-thu-thach': th12,
  'iq2-quan-sat-quy-luat': th13,
  'iq2-tu-duy-so-hoc': th14,
  'iq2-toan-loi-van': th15,
  'iq2-hinh-hoc-dem-hinh': th16,
  'iq2-logic-suy-luan': th17,
  'iq2-meo-cau-hoi-bay': th18,
  'iq2-thoi-gian-dong-ho': th19,
  'iq2-tien-mua-ban': th20,
  'iq2-do-luong-so-sanh': th21,
  'iq2-to-hop-dem-cach': th22,
  'iq2-giai-quyet-van-de': th23,
  'iq2-sieu-thu-thach': th24,
  'iq3-quan-sat-quy-luat': th25,
  'iq3-tu-duy-so-hoc': th26,
  'iq3-toan-loi-van': th27,
  'iq3-hinh-hoc-dem-hinh': th28,
  'iq3-logic-suy-luan': th29,
  'iq3-meo-cau-hoi-bay': th30,
  'iq3-thoi-gian-dong-ho': th31,
  'iq3-tien-mua-ban': th32,
  'iq3-do-luong-dai-luong': th33,
  'iq3-to-hop-dem-cach': th34,
  'iq3-giai-quyet-van-de': th35,
  'iq3-sieu-thu-thach': th36,
} as unknown as Record<string, Record<string, Theory>>;

type Catalog = { shop: ShopInfo; grades: Grade[]; combos: Combo[]; courses: Course[] };
const catalog = catalogJson as unknown as Catalog;

export const shopInfo = catalog.shop;
export const grades = catalog.grades;
export const combos = catalog.combos;
export const courses = catalog.courses;

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesByGrade(gradeId: string): Course[] {
  return courses.filter((c) => c.grade === gradeId);
}

// ── Chuẩn hóa câu hỏi ──
// Chấp nhận cả định dạng gốc của đội nội dung:
//   { question, options: string[], correct_index, countdown: string[], method, explanation }

type RawQuestion = Record<string, unknown>;

function toTile(v: unknown): Tile {
  if (typeof v === 'string' || typeof v === 'number') return { text: String(v) };
  return (v ?? {}) as Tile;
}

function normalizeQuestion(raw: RawQuestion, index: number): Question {
  const base = {
    id: String(raw.id ?? `q${index + 1}`),
    prompt: String(raw.prompt ?? raw.question ?? ''),
    speak: raw.speak as string | undefined,
    method: raw.method as string | undefined,
    explanation: raw.explanation as string | undefined,
    timeLimit:
      (raw.timeLimit as number | undefined) ??
      (Array.isArray(raw.countdown) ? raw.countdown.length : undefined),
    visual: raw.visual as Question['visual'],
  };

  const type = (raw.type ?? ('correct_index' in raw ? 'choice' : undefined)) as Question['type'] | undefined;

  switch (type) {
    case 'choice':
      return {
        ...base,
        type,
        options: (raw.options as unknown[]).map(toTile),
        answer: Number(raw.answer ?? raw.correct_index),
      };
    case 'multi_choice':
      return {
        ...base,
        type,
        options: (raw.options as unknown[]).map(toTile),
        answers: (raw.answers as number[]).map(Number),
      };
    case 'input':
      return { ...base, type, answers: (raw.answers as unknown[]).map(String), unit: raw.unit as string | undefined };
    case 'match':
    case 'match_vertical':
      return {
        ...base,
        type,
        pairs: (raw.pairs as { left: unknown; right: unknown }[]).map((p) => ({
          left: toTile(p.left),
          right: toTile(p.right),
        })),
      };
    case 'match_multi':
      return {
        ...base,
        type,
        groups: (raw.groups as unknown[]).map(toTile),
        items: (raw.items as (Tile & { group: number })[]).map((it) => ({ ...toTile(it), group: Number(it.group) })),
      };
    case 'reveal_match':
      return {
        ...base,
        type,
        pairs: (raw.pairs as { front: unknown; back: unknown }[]).map((p) => ({
          front: toTile(p.front),
          back: toTile(p.back),
        })),
      };
    case 'fill_blank':
      return { ...base, type, sentence: String(raw.sentence), choices: (raw.choices as unknown[]).map(String) };
    case 'order':
      return { ...base, type, items: (raw.items as unknown[]).map(toTile) };
    case 'pick_order':
      return {
        ...base,
        type,
        items: (raw.items as unknown[]).map(String),
        distractors: ((raw.distractors as unknown[] | undefined) ?? []).map(String),
      };
    case 'puzzle':
      return { ...base, type, image: String(raw.image), size: Number(raw.size ?? 3) };
    default:
      throw new Error(`[khoa-hoc-iq] Câu hỏi "${base.id}" có dạng không hỗ trợ: ${String(type)}`);
  }
}

const lessonCache = new Map<string, Lesson[]>();

export function getLessons(slug: string): Lesson[] {
  const cached = lessonCache.get(slug);
  if (cached) return cached;
  const file = LESSON_FILES[slug] as { lessons?: RawQuestion[] } | undefined;
  const lessons: Lesson[] = (file?.lessons ?? []).map((l) => ({
    id: String(l.id),
    title: String(l.title),
    emoji: String(l.emoji ?? '⭐'),
    description: l.description as string | undefined,
    timeLimit: l.timeLimit as number | undefined,
    theory: THEORY_FILES[slug]?.[String(l.id)],
    questions: ((l.questions as RawQuestion[] | undefined) ?? []).map(normalizeQuestion),
  }));
  lessonCache.set(slug, lessons);
  return lessons;
}

export function isFreeLesson(course: Course, lessonIndex: number) {
  return lessonIndex < course.freeLessons;
}

export function summarizeLessons(course: Course, unlocked: boolean): LessonSummary[] {
  return getLessons(course.slug).map((l, i) => {
    const free = isFreeLesson(course, i);
    return {
      id: l.id,
      title: l.title,
      emoji: l.emoji,
      description: l.description,
      questionCount: l.questions.length,
      free,
      locked: !free && !unlocked,
    };
  });
}

/** Mã tiền tố → danh sách slug khóa được mở. */
export function slugsForPrefix(prefix: string): string[] {
  const combo = combos.find((c) => c.codePrefix === prefix);
  if (combo) return getCoursesByGrade(combo.grade).map((c) => c.slug);
  const course = courses.find((c) => c.codePrefix === prefix);
  return course ? [course.slug] : [];
}
