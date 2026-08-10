// Lớp dữ liệu cho các trang SEO theo CHỦ ĐỀ.
//
// Bối cảnh: mỗi bài học trong DB đã gắn sẵn `topicId`, và mỗi chủ đề là một cụm
// kiến thức phụ huynh thực sự tìm kiếm ("phép cộng trong phạm vi 10", "xem đồng hồ",
// "học vần"). Chủ đề trong DB chỉ có `name` + `id`, không có slug → slug được suy ra
// từ tên và phải ỔN ĐỊNH (đổi slug = mất URL đã index), nên mọi thay đổi ở
// `topicSlug()` phải kèm redirect 301 trong next.config.ts.

import { safeDate } from './seo';
import { topicLabel, topicSlug } from './topicSlug';

export { slugifyVi, topicLabel, topicSlug } from './topicSlug';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

// Cache 1 ngày: dữ liệu chương trình học gần như tĩnh, và các trang chủ đề
// đều là ISR nên không cần tươi hơn thế.
const REVALIDATE = 86400;

export type TopicLesson = {
  id: number;
  title: string;
  slug: string;
  sortOrder: number;
  updatedAt?: string;
  createdAt?: string;
};

export type Topic = {
  id: number;
  /** Tên gốc trong DB, vd "Chủ đề 3: Phép cộng, phép trừ trong phạm vi 10". */
  name: string;
  /** Tên đã bỏ tiền tố "Chủ đề N:" — dùng cho title/H1. */
  label: string;
  slug: string;
  sortOrder: number;
  lessons: TopicLesson[];
};

export type TopicCourse = {
  id: number;
  title: string;
  slug: string;
  courseType?: string;
  description?: string;
};

export type CourseTopics = { course: TopicCourse; topics: Topic[] };

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api${path}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function unwrap<T>(value: T[] | { data?: T[] } | null): T[] {
  if (Array.isArray(value)) return value;
  return Array.isArray(value?.data) ? value.data : [];
}

// ── Truy vấn ────────────────────────────────────────────────────────────────
export async function getCourse(courseSlug: string): Promise<TopicCourse | null> {
  return fetchJson<TopicCourse>(`/courses/slug/${courseSlug}`);
}

/** Danh sách khoá đã xuất bản — dùng cho hub /bai-tap và sitemap. */
export async function getPublishedCourses(): Promise<TopicCourse[]> {
  type C = TopicCourse & { isPublished?: boolean };
  const res = await fetchJson<C[] | { data: C[] }>(`/courses?limit=500`);
  return unwrap<C>(res).filter((c) => c.isPublished && !!c.slug && c.id != null);
}

/**
 * Chủ đề của một khoá, mỗi chủ đề kèm danh sách bài học thuộc nó.
 * Chủ đề rỗng (chưa có bài nào) bị loại — trang rỗng không nên tồn tại.
 */
export async function getCourseTopics(courseSlug: string): Promise<CourseTopics | null> {
  const course = await getCourse(courseSlug);
  if (!course?.id) return null;

  const [rawTopics, rawLessons] = await Promise.all([
    fetchJson<{ id: number; name: string; sortOrder?: number }[]>(`/topics?courseId=${course.id}`),
    fetchJson<(TopicLesson & { topicId?: number | null; isPublished?: boolean })[]>(
      `/lessons?courseId=${course.id}&slim=1`,
    ),
  ]);

  const lessons = unwrap(rawLessons).filter((l) => !!l.slug && l.isPublished !== false);
  const byTopic = new Map<number, TopicLesson[]>();
  for (const l of lessons) {
    if (l.topicId == null) continue;
    const list = byTopic.get(l.topicId) ?? [];
    list.push({
      id: l.id,
      title: l.title,
      slug: l.slug,
      sortOrder: l.sortOrder ?? 0,
      updatedAt: l.updatedAt,
      createdAt: l.createdAt,
    });
    byTopic.set(l.topicId, list);
  }

  // Slug trùng nhau (hiếm, vd hai khối cùng tên "Ôn tập cuối năm") → gắn hậu tố
  // theo thứ tự để URL vẫn phân biệt được, thay vì để hai chủ đề tranh một URL.
  const used = new Set<string>();
  const topics: Topic[] = unwrap(rawTopics)
    .map((t) => ({ ...t, sortOrder: t.sortOrder ?? 0 }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    .map((t) => {
      const base = topicSlug(t.name);
      let slug = base;
      let n = 2;
      while (used.has(slug)) slug = `${base}-${n++}`;
      used.add(slug);
      return {
        id: t.id,
        name: t.name,
        label: topicLabel(t.name),
        slug,
        sortOrder: t.sortOrder,
        lessons: (byTopic.get(t.id) ?? []).sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
      };
    })
    .filter((t) => t.lessons.length > 0);

  return { course, topics };
}

export async function getTopic(courseSlug: string, slug: string): Promise<{ course: TopicCourse; topic: Topic; siblings: Topic[] } | null> {
  const data = await getCourseTopics(courseSlug);
  if (!data) return null;
  const topic = data.topics.find((t) => t.slug === slug);
  if (!topic) return null;
  return { course: data.course, topic, siblings: data.topics };
}

export function topicLastmod(topic: Topic): Date {
  const stamps = topic.lessons
    .map((l) => safeDate(l.updatedAt || l.createdAt).getTime())
    .filter((n) => Number.isFinite(n));
  return stamps.length ? new Date(Math.max(...stamps)) : new Date();
}

// ── Câu hỏi luyện tập của một chủ đề ────────────────────────────────────────

/** Bản ghi quiz thô từ API — hình dạng optionsJson KHÔNG đồng nhất, xem normalizeQuiz. */
type RawQuiz = {
  id: number;
  lessonId: number;
  questionText?: string;
  questionType?: string;
  questionImageUrl?: string | null;
  optionsJson?: unknown;
  correctAnswerJson?: unknown;
  explanation?: string | null;
  difficultyLevel?: string;
};

/** Quiz đã chuẩn hoá: options luôn có {key,text}, đáp án luôn quy về danh sách key. */
export type PracticeQuiz = {
  id: number;
  questionText: string;
  questionImageUrl?: string | null;
  options: { key: string; text: string }[];
  /** Key đáp án đúng, vd ['C','D']. */
  answers: string[];
  explanation?: string | null;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES: { key: Difficulty; label: string; blurb: string }[] = [
  { key: 'easy', label: 'Dễ', blurb: 'Nhận biết – làm quen với kiến thức' },
  { key: 'medium', label: 'Trung bình', blurb: 'Hiểu và thực hành thành thạo' },
  { key: 'hard', label: 'Nâng cao', blurb: 'Vận dụng, giải toán có lời văn' },
];

const LETTERS = 'ABCDEFGHIJ';

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : '';
}

/**
 * DB chứa ba kiểu optionsJson khác nhau (tích luỹ qua nhiều đợt nhập liệu):
 *   1. ["Hình tròn", "Hình tam giác", …]                → không có key, đáp án lưu theo NỘI DUNG
 *   2. [{key:'A', text:'…'}, …]                          → đáp án lưu theo KEY
 *   3. [{key:'A', value:'…'}, …]                         → như (2) nhưng đổi tên trường
 * Hàm này quy hết về {key,text} + danh sách key đáp án; câu không dùng được → null.
 */
function normalizeQuiz(raw: RawQuiz): PracticeQuiz | null {
  const questionText = asText(raw.questionText);
  if (!questionText || !Array.isArray(raw.optionsJson) || raw.optionsJson.length < 2) return null;

  const options: { key: string; text: string }[] = [];
  for (const [i, opt] of raw.optionsJson.entries()) {
    const fallbackKey = LETTERS[i] ?? String(i + 1);
    if (typeof opt === 'string' || typeof opt === 'number') {
      const text = asText(opt);
      if (!text) return null;
      options.push({ key: fallbackKey, text });
      continue;
    }
    if (opt && typeof opt === 'object') {
      const o = opt as Record<string, unknown>;
      const text = asText(o.text) || asText(o.value) || asText(o.label);
      if (!text) return null;
      options.push({ key: (asText(o.key) || fallbackKey).toUpperCase(), text });
      continue;
    }
    return null;
  }

  // Đáp án có thể là key ('C'), nội dung ('Hình tam giác'), mảng, hoặc chuỗi JSON.
  const rawAnswers: string[] = [];
  const collect = (v: unknown) => {
    const t = asText(v);
    if (t) rawAnswers.push(t);
  };
  const value = raw.correctAnswerJson;
  if (Array.isArray(value)) value.forEach(collect);
  else if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) parsed.forEach(collect);
      else collect(value);
    } catch {
      collect(value);
    }
  } else collect(value);

  const answers: string[] = [];
  for (const a of rawAnswers) {
    const byKey = options.find((o) => o.key === a.toUpperCase());
    const byText = options.find((o) => o.text === a);
    const hit = byKey ?? byText;
    if (hit && !answers.includes(hit.key)) answers.push(hit.key);
  }
  // Không xác định được đáp án → bỏ câu, vì trang bài tập phải chấm đúng/sai được.
  if (answers.length === 0) return null;

  return {
    id: raw.id,
    questionText,
    questionImageUrl: raw.questionImageUrl ?? null,
    options,
    answers,
    explanation: asText(raw.explanation) || null,
  };
}

async function fetchLessonQuizzes(lessonId: number): Promise<RawQuiz[]> {
  const data = await fetchJson<{ exercises?: { quizzes?: RawQuiz[] }[] }>(`/quizzes/exercises/${lessonId}`);
  return (data?.exercises ?? []).flatMap((e) => e.quizzes ?? []);
}

/**
 * Lấy `perLevel` câu mỗi mức độ cho một chủ đề.
 *
 * Câu được rút LUÂN PHIÊN qua các bài trong chủ đề (round-robin) thay vì lấy hết
 * của bài đầu tiên — để một phiếu luyện tập phủ đều cả chủ đề, và để hai chủ đề
 * khác nhau không bao giờ ra cùng bộ câu hỏi (tránh trang trùng nội dung).
 */
export async function getTopicQuizzes(
  topic: Topic,
  perLevel = 10,
): Promise<Record<Difficulty, PracticeQuiz[]>> {
  // Giới hạn số bài phải gọi API: 12 bài × 90 câu đã thừa cho 30 câu cần dùng.
  const lessons = topic.lessons.slice(0, 12);
  const perLesson = await Promise.all(lessons.map((l) => fetchLessonQuizzes(l.id)));

  const out: Record<Difficulty, PracticeQuiz[]> = { easy: [], medium: [], hard: [] };
  for (const { key } of DIFFICULTIES) {
    const pools = perLesson.map((qs) =>
      qs.filter((q) => q.difficultyLevel === key).map(normalizeQuiz).filter((q): q is PracticeQuiz => q !== null),
    );
    const seen = new Set<number>();
    // Vòng ngoài: lượt rút; vòng trong: từng bài → câu 1 của bài A, B, C… rồi câu 2.
    for (let round = 0; out[key].length < perLevel; round++) {
      const before = out[key].length;
      for (const pool of pools) {
        if (out[key].length >= perLevel) break;
        const q = pool[round];
        if (!q || seen.has(q.id)) continue;
        seen.add(q.id);
        out[key].push(q);
      }
      if (out[key].length === before) break; // hết câu ở mọi bài
    }
  }
  return out;
}
