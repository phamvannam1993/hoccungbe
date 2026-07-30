// Điều hướng & ánh xạ cho URL đề thi lồng:
//   /{courseSlug}/{groupSeg}            → trang tổng hợp 5 đề của một cụm kỳ thi
//   /{courseSlug}/{groupSeg}/de-{n}     → trang làm đề chi tiết
// courseSlug dạng "toan-lop-1" | "tieng-viet-lop-2" | "tieng-anh-lop-1".

export type ExamGroupDef = {
  seg: string;      // segment trên URL (de-thi-giua-hoc-ky-1)
  key: string;      // examGroup trong DB (giua-hk1)
  label: string;    // hiển thị đầy đủ
  short: string;    // hiển thị ngắn (breadcrumb/thẻ)
  semester: number;
};

export const EXAM_GROUPS: ExamGroupDef[] = [
  { seg: 'de-thi-giua-hoc-ky-1', key: 'giua-hk1', label: 'Đề thi giữa học kỳ 1', short: 'Giữa học kỳ 1', semester: 1 },
  { seg: 'de-thi-cuoi-hoc-ky-1', key: 'cuoi-hk1', label: 'Đề thi cuối học kỳ 1', short: 'Cuối học kỳ 1', semester: 1 },
  { seg: 'de-thi-giua-hoc-ky-2', key: 'giua-hk2', label: 'Đề thi giữa học kỳ 2', short: 'Giữa học kỳ 2', semester: 2 },
  { seg: 'de-thi-cuoi-hoc-ky-2', key: 'cuoi-hk2', label: 'Đề thi cuối học kỳ 2', short: 'Cuối học kỳ 2', semester: 2 },
];

export const SUBJECT_LABEL: Record<string, string> = {
  toan: 'Toán',
  'tieng-viet': 'Tiếng Việt',
  'tieng-anh': 'Tiếng Anh',
};

export function groupBySeg(seg: string): ExamGroupDef | null {
  return EXAM_GROUPS.find((g) => g.seg === seg) ?? null;
}

export function isExamGroupSeg(seg: string): boolean {
  return groupBySeg(seg) !== null;
}

// "toan-lop-1" → { subject:'toan', grade:1 }
export function parseCourseSlug(courseSlug: string): { subject: string; grade: number } | null {
  const m = /^(toan|tieng-viet|tieng-anh)-lop-(\d+)$/.exec(courseSlug);
  if (!m) return null;
  return { subject: m[1], grade: Number(m[2]) };
}

export function courseLabel(courseSlug: string): string {
  const p = parseCourseSlug(courseSlug);
  if (!p) return courseSlug;
  return `${SUBJECT_LABEL[p.subject] ?? p.subject} lớp ${p.grade}`;
}

// slug đề trong DB: de-thi-giua-hoc-ky-1-toan-lop-1-de-3
export function examSlug(groupSeg: string, courseSlug: string, n: number): string {
  return `${groupSeg}-${courseSlug}-de-${n}`;
}

// "de-3" → 3 ; các dạng khác → null
export function parseExamNo(seg: string): number | null {
  const m = /^de-(\d+)$/.exec(seg);
  return m ? Number(m[1]) : null;
}

// Lấy số thứ tự đề từ slug đầy đủ (…-de-3 → 3) để sắp xếp/hiển thị.
export function orderFromSlug(slug: string): number {
  const m = /-de-(\d+)$/.exec(slug);
  return m ? Number(m[1]) : 0;
}

// slug DB → thành phần URL lồng: "de-thi-giua-hoc-ky-1-toan-lop-1-de-3"
//   → { groupSeg:'de-thi-giua-hoc-ky-1', courseSlug:'toan-lop-1', n:3 }
export function parseExamDbSlug(slug: string): { groupSeg: string; courseSlug: string; n: number } | null {
  const m = /^(de-thi-(?:giua|cuoi)-hoc-ky-[12])-((?:toan|tieng-viet|tieng-anh)-lop-\d+)-de-(\d+)$/.exec(slug);
  if (!m) return null;
  return { groupSeg: m[1], courseSlug: m[2], n: Number(m[3]) };
}

// URL lồng của một đề (dùng làm canonical).
export function nestedExamPath(slug: string): string | null {
  const p = parseExamDbSlug(slug);
  return p ? `/${p.courseSlug}/${p.groupSeg}/de-${p.n}` : null;
}
