// Sổ đăng ký ĐẦY ĐỦ — CATALOG (nhẹ) cộng các mục suy ra từ dữ liệu có sẵn:
//   • trò chơi trong app/games/* (gamesData: lớp suy từ độ tuổi "3-6 tuổi" → 6 tuổi = lớp 1),
//   • gói tài liệu in trả phí (goi-tai-lieu/packs.ts, đã có grade + subjects),
//   • bộ phiếu tập viết (lib/luyenViet.ts),
//   • số đề thi từng lớp (thi-lop-N/de.ts).
// Kéo theo dữ liệu nặng → CHỈ import ở server component (trang lớp, trang chủ, các trang gom).

import { CATALOG, filterItems, type CatalogItem, type CatalogQuery, type Grade, type Subject } from './catalog';
import { gamesData, type GameItem } from '../components/edu/data/gamesData';
import { PACKS, chaoBan } from '../goi-tai-lieu/packs';
import { CAC_BO } from './luyenViet';
import { THI_LOP_1 } from '../thi-lop-1/de';
import { THI_LOP_2 } from '../thi-lop-2/de';
import { THI_LOP_3 } from '../thi-lop-3/de';
import { THI_LOP_4 } from '../thi-lop-4/de';
import { THI_LOP_5 } from '../thi-lop-5/de';

/** "3-6 tuổi" → [0, 1]: dưới 6 tuổi là mẫu giáo, 6 tuổi = lớp 1 … 10 tuổi trở lên = lớp 5. */
export function gradesFromAge(age: string): Grade[] {
  const m = age.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (!m) return [1, 2, 3, 4, 5];
  const toGrade = (a: number) => Math.min(5, Math.max(0, a - 5)) as Grade;
  const lo = toGrade(Number(m[1]));
  const hi = toGrade(Number(m[2]));
  const out: Grade[] = [];
  for (let g = lo; g <= hi; g++) out.push(g as Grade);
  return out;
}

const GAME_SUBJECT: Record<GameItem['category'], Subject> = {
  'Toán học': 'toan',
  'Ngôn ngữ': 'tieng-viet',
  'Âm thanh': 'tieng-viet',
  'Tiếng Anh': 'tieng-anh',
  'Ghi nhớ': 'tu-duy',
  'Phản xạ': 'tu-duy',
  'Tư duy': 'tu-duy',
};

const GAMES: CatalogItem[] = gamesData
  .filter((g) => g.status === 'ready')
  .map((g) => ({
    href: `/tro-choi/${g.slug}`,
    title: g.title,
    desc: g.shortDescription,
    emoji: g.emoji,
    subject: GAME_SUBJECT[g.category] ?? 'tong-hop',
    kind: 'tro-choi',
    grades: gradesFromAge(g.age),
    ...(g.category === 'Ngôn ngữ' || g.category === 'Âm thanh' ? { group: /viết|tô/i.test(g.title) ? ('viet' as const) : ('doc' as const) } : {}),
  }));

const PACK_ITEMS: CatalogItem[] = PACKS.filter(chaoBan).map((p) => ({
  href: `/goi-tai-lieu#${p.slug}`,
  title: p.title,
  desc: p.subtitle,
  emoji: p.emoji,
  subject: (p.subjects?.length === 1 ? p.subjects[0] : 'tong-hop') as Subject,
  kind: 'tai-lieu',
  // Gói Phonics không gắn lớp — dùng cho bé mới học tiếng Anh (mẫu giáo – lớp 3).
  grades: p.grade ? [p.grade as Grade] : [0, 1, 2, 3],
  ...(p.grade ? {} : { uncertain: true }),
  paid: true,
}));

/** "Lớp 1 – 2" | "Bắt đầu" → lớp. "Bắt đầu" (nét cơ bản) hợp cả mẫu giáo. */
function gradesFromLabel(s: string): Grade[] {
  const nums = (s.match(/\d/g) ?? []).map(Number);
  if (!nums.length) return [0, 1];
  const out: Grade[] = [];
  for (let g = Math.min(...nums); g <= Math.max(...nums); g++) out.push(g as Grade);
  return out;
}

const TAP_VIET: CatalogItem[] = CAC_BO.map((b) => ({
  href: `/luyen-viet-chu-dep/${b.slug}`,
  title: `Tập viết: ${b.ten}`,
  desc: b.moTa,
  emoji: b.emoji,
  subject: 'tieng-viet',
  kind: 'tai-lieu',
  group: 'viet',
  grades: gradesFromLabel(b.lop),
}));

export const FULL_CATALOG: CatalogItem[] = [...CATALOG, ...GAMES, ...TAP_VIET, ...PACK_ITEMS];

export const queryCatalog = (q: CatalogQuery) => filterItems(FULL_CATALOG, q);

// ── Đề thi theo lớp ─────────────────────────────────────────────────────────────────────────────────
const THI = { 1: THI_LOP_1, 2: THI_LOP_2, 3: THI_LOP_3, 4: THI_LOP_4, 5: THI_LOP_5 } as const;

export type ExamSummary = { grade: Grade; href: string; toan: number; tiengViet: number; total: number };

export function examSummary(g: Grade): ExamSummary | null {
  if (g === 0) return null;
  const list = THI[g];
  const toan = list.filter((e) => e.mon === 'toan').length;
  return { grade: g, href: `/thi-lop-${g}`, toan, tiengViet: list.length - toan, total: list.length };
}

/** Kì thi sắp tới theo tháng (năm học VN: cuối kì 1 tháng 12–1, cuối kì 2 tháng 4–5). */
export function upcomingTerm(d = new Date()): string {
  const m = d.getMonth() + 1;
  if (m >= 9 && m <= 10) return 'giữa kì 1';
  if (m >= 11 || m === 1) return 'cuối kì 1';
  if (m >= 2 && m <= 3) return 'giữa kì 2';
  return 'cuối kì 2';
}
