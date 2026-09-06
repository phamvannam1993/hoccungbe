// Lớp dữ liệu cho "Học theo kỹ năng" — cách học thứ hai bên cạnh "Học theo sách".
//
// Mỗi bài học đã được gắn kỹ năng (bảng lesson_skills, xem scripts/remap-skills.cjs
// bên api-hoccungbe). Một kỹ năng như "Phép chia" gom bài từ nhiều bài SGK khác nhau,
// nên không cần tạo lại nội dung — chỉ cần nhìn kho bài theo một trục khác.
//
// Slug kỹ năng CHÍNH LÀ `code` trong bảng skills, nên nó phải ổn định:
// đổi code = mất URL đã index.

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

// Chương trình học gần như tĩnh; các trang kỹ năng đều ISR nên 1 ngày là đủ.
const REVALIDATE = 86400;

export type SkillSubject = 'math' | 'language' | 'english';

export type SkillCatalogItem = {
  id: number;
  code: string;
  name: string;
  subject: SkillSubject | string;
  icon?: string | null;
  lessonCount: number;
  /**
   * Số câu hỏi thuộc kỹ năng — quy mô thật của kho luyện tập, khác số bài.
   * Có thể thiếu nếu API đang chạy bản cũ, nên luôn đọc qua `countLabel()`.
   */
  questionCount?: number;
};

/**
 * Nhãn quy mô của một kỹ năng: "16 bài · 493 câu", hoặc chỉ "16 bài" khi API
 * chưa trả số câu. Không bao giờ được để lọt chữ "undefined" ra giao diện.
 */
export function countLabel(k: Pick<SkillCatalogItem, 'lessonCount' | 'questionCount'>): string {
  const lessons = Number(k.lessonCount) || 0;
  const questions = Number(k.questionCount) || 0;
  const parts = [`${lessons} bài`];
  if (questions > 0) parts.push(`${questions} câu`);
  return parts.join(' · ');
}

export type SkillLesson = {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string | null;
  thumbnailUrl?: string | null;
  courseSlug: string;
  courseTitle: string;
  courseType: string;
};

export const GRADES = ['1', '2', '3', '4', '5'] as const;

export const SUBJECT_LABEL: Record<string, string> = {
  math: 'Toán',
  language: 'Tiếng Việt',
  english: 'Tiếng Anh',
};

export const SUBJECT_EMOJI: Record<string, string> = {
  math: '🔢',
  language: '📖',
  english: '🌍',
};

/** Các khoá có trang kỹ năng: slug dạng "toan-lop-3" → { subject, grade }. */
export function parseCourseSlug(slug: string): { subject: SkillSubject; grade: string } | null {
  const m = /^(toan|tieng-viet|tieng-anh)-lop-([1-5])$/.exec(slug);
  if (!m) return null;
  const subject = ({ toan: 'math', 'tieng-viet': 'language', 'tieng-anh': 'english' } as const)[
    m[1] as 'toan' | 'tieng-viet' | 'tieng-anh'
  ];
  return { subject, grade: m[2] };
}

export function courseSlugOf(subject: SkillSubject, grade: string): string {
  return `${{ math: 'toan', language: 'tieng-viet', english: 'tieng-anh' }[subject]}-lop-${grade}`;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api${path}`, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Danh mục kỹ năng kèm số bài, lọc theo lớp và/hoặc môn. */
export async function getSkillCatalog(opts: { grade?: string; subject?: string } = {}): Promise<SkillCatalogItem[]> {
  const qs = new URLSearchParams();
  if (opts.grade) qs.set('grade', opts.grade);
  if (opts.subject) qs.set('subject', opts.subject);
  const rows = await fetchJson<SkillCatalogItem[]>(`/skills/catalog?${qs}`);
  if (!Array.isArray(rows)) return [];
  return rows.filter((r) => r.lessonCount > 0).sort((a, b) => b.lessonCount - a.lessonCount);
}

/** Các bài học thuộc một kỹ năng, tuỳ chọn lọc theo lớp. */
export async function getLessonsBySkill(code: string, grade?: string): Promise<SkillLesson[]> {
  const qs = grade ? `?grade=${grade}` : '';
  const rows = await fetchJson<SkillLesson[]>(`/skills/code/${encodeURIComponent(code)}/lessons${qs}`);
  return Array.isArray(rows) ? rows : [];
}
