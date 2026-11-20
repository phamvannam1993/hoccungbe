// SỔ ĐĂNG KÝ NỘI DUNG — mỗi trang học / công cụ / trò chơi / đề thi / tài liệu in khai báo MỘT lần ở đây,
// kèm môn, kiểu trang và các lớp hợp. Menu, trang lớp (/lop-N), trang chủ, trang Tiếng Việt và trang
// Tài liệu in đều đọc từ đây — thêm trang mới chỉ cần thêm một dòng.
//
// File này cố ý NHẸ (không kéo dữ liệu bài học) vì menu đầu trang là client component. Phần cần dữ liệu
// nặng (trò chơi từ gamesData, gói tài liệu, bộ tập viết) ghép thêm ở catalogFull.ts, chỉ dùng phía máy chủ.
//
// Lớp: 0 = mẫu giáo (4–5 tuổi), 1…5 = lớp 1…5. `uncertain: true` = trang không ghi rõ lớp, lớp ở đây là
// ước lượng theo nội dung (vd. tiếng Anh dùng chung nhiều lứa) — đợt sau nên rà lại với người soạn bài.

import { CONG_CU_TOAN } from './congCuToan';

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;
export type Subject = 'toan' | 'tieng-viet' | 'tieng-anh' | 'tu-duy' | 'tong-hop';
export type Kind = 'cong-cu' | 'tro-choi' | 'de-thi' | 'on-tap' | 'tai-lieu' | 'thi-dau' | 'khoa-hoc';
/** Nhóm con của Tiếng Việt (trang /tieng-viet). */
export type TvGroup = 'doc' | 'viet' | 'chinh-ta' | 'tu-cau' | 'lam-van' | 'truyen';

export type CatalogItem = {
  href: string;
  title: string;
  /** Một câu: bé làm gì ở đó. */
  desc: string;
  emoji: string;
  subject: Subject;
  kind: Kind;
  grades: Grade[];
  group?: TvGroup;
  uncertain?: boolean;
  /** Trả phí (gói tài liệu, Toán IQ). */
  paid?: boolean;
};

export const ALL_GRADES: Grade[] = [0, 1, 2, 3, 4, 5];
export const SCHOOL_GRADES: Grade[] = [1, 2, 3, 4, 5];

// ── Bảng màu dùng chung — ĐỌC TỪ TOKEN trong app/globals.css (--hue-*) ─────────────────────────────
// Toán tím, Tiếng Việt hồng, Tiếng Anh xanh ngọc, Thi cam — theo bản thiết kế "cấu trúc mới".
// Giá trị là chuỗi var(--…) nên chỉ dùng được làm giá trị CSS (style inline, boxShadow…), không cộng chuỗi
// alpha kiểu `${c}33`. Đổi màu thì sửa globals.css, không sửa ở đây.
export type Palette = { c: string; soft: string; border: string };

const hue = (name: string): Palette => ({ c: `var(--hue-${name})`, soft: `var(--hue-${name}-soft)`, border: `var(--hue-${name}-line)` });

export const PALETTE = {
  purple: hue('purple'),
  pink: hue('pink'),
  teal: hue('teal'),
  orange: hue('orange'),
  sky: hue('sky'),
  green: hue('green'),
  amber: hue('amber'),
  slate: hue('slate'),
} satisfies Record<string, Palette>;

export const SUBJECT_META: Record<Subject, { label: string; emoji: string; palette: Palette; hub: string }> = {
  toan: { label: 'Toán', emoji: '🔢', palette: PALETTE.purple, hub: '/hoc-toan' },
  'tieng-viet': { label: 'Tiếng Việt', emoji: '📖', palette: PALETTE.pink, hub: '/tieng-viet' },
  'tieng-anh': { label: 'Tiếng Anh', emoji: '🌍', palette: PALETTE.teal, hub: '/tu-vung-tieng-anh' },
  'tu-duy': { label: 'Tư duy', emoji: '🧠', palette: PALETTE.sky, hub: '/toan-tu-duy' },
  'tong-hop': { label: 'Nhiều môn', emoji: '🎒', palette: PALETTE.slate, hub: '/' },
};

export const KIND_META: Record<Kind, { label: string; palette: Palette }> = {
  'cong-cu': { label: 'Công cụ', palette: PALETTE.purple },
  'tro-choi': { label: 'Trò chơi', palette: PALETTE.green },
  'de-thi': { label: 'Đề thi', palette: PALETTE.orange },
  'on-tap': { label: 'Ôn tập', palette: PALETTE.orange },
  'tai-lieu': { label: 'Phiếu in', palette: PALETTE.amber },
  'thi-dau': { label: 'Thi đấu', palette: PALETTE.sky },
  'khoa-hoc': { label: 'Khóa học', palette: PALETTE.pink },
};

export const TV_GROUPS: { id: TvGroup; label: string; emoji: string; desc: string }[] = [
  { id: 'doc', label: 'Đọc', emoji: '🔤', desc: 'Chữ cái, đánh vần, vần và tập đọc có đọc mẫu.' },
  { id: 'viet', label: 'Viết', emoji: '✍️', desc: 'Tô nét, viết chữ đúng ô li, phiếu tập viết in được.' },
  { id: 'chinh-ta', label: 'Chính tả', emoji: '🎯', desc: 's/x, ch/tr, l/n và dấu hỏi, dấu ngã.' },
  { id: 'tu-cau', label: 'Từ và câu', emoji: '🧩', desc: 'Từ chỉ sự vật, hoạt động, đặc điểm; dấu câu; vốn từ.' },
  { id: 'lam-van', label: 'Tập làm văn', emoji: '📝', desc: 'Dàn ý, từ ngữ hay và bài văn mẫu.' },
  { id: 'truyen', label: 'Truyện & ca dao', emoji: '📚', desc: 'Truyện cổ tích, đồng dao, thành ngữ có giải nghĩa.' },
];

// ── Nhãn lớp ─────────────────────────────────────────────────────────────────────────────────────────
export const gradeName = (g: Grade) => (g === 0 ? 'Mẫu giáo' : `Lớp ${g}`);
export const gradeShort = (g: Grade) => (g === 0 ? 'MG' : String(g));
/** URL trang lớp: /lop-1 … /lop-5 (rewrite có sẵn) và /lop/mau-giao. */
export const gradeHref = (g: Grade) => (g === 0 ? '/lop/mau-giao' : `/lop-${g}`);
/** Khóa lưu localStorage (giữ định dạng cũ của ChonLop: 'mau-giao' | 'lop-N'). */
export const gradeKey = (g: Grade) => (g === 0 ? 'mau-giao' : `lop-${g}`);
export function gradeFromKey(k: string | null | undefined): Grade | null {
  if (!k) return null;
  if (k === 'mau-giao' || k === '0') return 0;
  const m = k.match(/^(?:lop-)?([1-5])$/);
  return m ? (Number(m[1]) as Grade) : null;
}
export const GRADE_AGE: Record<Grade, string> = { 0: '4–5 tuổi', 1: '6 tuổi', 2: '7 tuổi', 3: '8 tuổi', 4: '9 tuổi', 5: '10 tuổi' };

/** "Hợp lớp 1–3", "Hợp mẫu giáo – lớp 1", "Hợp lớp 2". */
export function gradeRangeLabel(grades: Grade[]): string {
  if (!grades.length) return '';
  const s = [...grades].sort((a, b) => a - b);
  const lo = s[0];
  const hi = s[s.length - 1];
  if (lo === hi) return lo === 0 ? 'Mẫu giáo' : `Lớp ${lo}`;
  if (lo === 0) return `Mẫu giáo – lớp ${hi}`;
  return `Lớp ${lo}–${hi}`;
}

const range = (a: Grade, b: Grade): Grade[] => ALL_GRADES.filter((g) => g >= a && g <= b);

// ── Toán: công cụ (lấy từ congCuToan.ts — nguồn cũ, đã có lớp) ────────────────────────────────────────
const TOAN_TOOLS: CatalogItem[] = CONG_CU_TOAN.filter((c) => c.href !== '/trieu-phu-nhi').map((c) => ({
  href: c.href,
  title: c.ten,
  desc: c.moTa,
  emoji: c.emoji,
  subject: c.href === '/toan-tu-duy' ? 'tu-duy' : 'toan',
  kind: 'cong-cu',
  grades: c.lop as Grade[],
}));

const TOAN_KHAC: CatalogItem[] = [
  ...SCHOOL_GRADES.map((g): CatalogItem => ({
    href: `/toan-tu-duy-lop-${g}`, title: `Toán tư duy lớp ${g}`, emoji: '🧠', subject: 'tu-duy', kind: 'cong-cu', grades: [g],
    desc: `Câu đố suy luận dành riêng cho lớp ${g}, có lời giải.`,
  })),
  // Toán IQ chỉ có lớp 1–3 (app/khoa-hoc-iq/data/courses.json).
  ...([1, 2, 3] as Grade[]).map((g): CatalogItem => ({
    href: `/khoa-hoc-iq?lop=lop-${g}`, title: `Toán IQ lớp ${g}`, emoji: '💡', subject: 'toan', kind: 'khoa-hoc', grades: [g], paid: true,
    desc: '12 khóa thử thách tư duy, học thử miễn phí vài bài đầu.',
  })),
  {
    href: '/cong-cu/tao-bai-tap-cong-tru', title: 'Tạo phiếu cộng trừ', emoji: '🖨️', subject: 'toan', kind: 'tai-lieu', grades: [1, 2],
    desc: 'Tự tạo phiếu cộng trừ theo phạm vi số, in ra cho bé làm.',
  },
];

// ── Tiếng Việt ───────────────────────────────────────────────────────────────────────────────────────
const TIENG_VIET: CatalogItem[] = [
  { href: '/bang-chu-cai', title: 'Bảng chữ cái tiếng Việt', emoji: '🔤', group: 'doc', grades: [0, 1], desc: '29 chữ thường và hoa, nguyên âm, phụ âm, dấu thanh.' },
  { href: '/hoc-doc-tieng-viet', title: 'Học đọc tiếng Việt', emoji: '📘', group: 'doc', grades: [0, 1], desc: 'Đánh vần, 6 dấu thanh và bảng vần, bấm nghe giọng đọc.' },
  { href: '/vong-tron-am', title: 'Vòng tròn âm vần', emoji: '🎡', group: 'doc', grades: [0, 1], desc: 'Xoay vòng ghép âm với vần để tập đánh vần.' },
  { href: '/noi-am-van', title: 'Nối âm vần', emoji: '🔗', group: 'doc', grades: [0, 1], uncertain: true, desc: 'Nhìn hình, nối âm đầu với vần thành chữ.' },
  { href: '/tap-doc-tieng-viet', title: 'Tập đọc', emoji: '📖', group: 'doc', grades: [1, 2], desc: 'Bài đọc ngắn có đọc mẫu từng câu và câu hỏi đọc hiểu.' },
  { href: '/luyen-viet-chu', title: 'Luyện viết chữ', emoji: '✏️', group: 'viet', grades: [1], desc: 'Viết chữ cái đúng nét, đúng ô li, có trò tô chữ.' },
  { href: '/luyen-viet-chu-dep', title: 'Phiếu tập viết chữ đẹp', emoji: '🖋️', group: 'viet', kind: 'tai-lieu', grades: [0, 1, 2], desc: 'Vở ô li in được: nét cơ bản, chữ thường, chữ hoa, vần, câu.' },
  { href: '/chinh-ta-tieng-viet', title: 'Chính tả', emoji: '🎯', group: 'chinh-ta', grades: [1, 2, 3], uncertain: true, desc: 'Phân biệt s/x, ch/tr, l/n, d/gi/r và dấu hỏi/ngã.' },
  { href: '/luyen-tu-va-cau', title: 'Luyện từ và câu', emoji: '🧩', group: 'tu-cau', grades: [2, 3], desc: 'Từ chỉ sự vật, hoạt động, đặc điểm; dấu câu; trái nghĩa.' },
  { href: '/mo-rong-von-tu', title: 'Mở rộng vốn từ', emoji: '🌱', group: 'tu-cau', grades: [1, 2, 3], uncertain: true, desc: 'Từ theo chủ đề, mỗi từ có nghĩa, ví dụ và phát âm.' },
  { href: '/thanh-ngu-tuc-ngu', title: 'Thành ngữ, tục ngữ', emoji: '💬', group: 'tu-cau', grades: [3, 4, 5], uncertain: true, desc: 'Câu thành ngữ theo chủ đề, có giải nghĩa và ví dụ.' },
  { href: '/tap-lam-van', title: 'Tập làm văn', emoji: '📝', group: 'lam-van', grades: [2, 3], desc: 'Dàn ý, từ ngữ hay, bài văn mẫu và ô cho bé tự viết.' },
  { href: '/truyen-co-tich', title: 'Truyện cổ tích', emoji: '🏯', group: 'truyen', grades: [1, 2, 3, 4, 5], uncertain: true, desc: 'Truyện cổ tích Việt Nam có đọc mẫu và câu hỏi.' },
  { href: '/dong-dao-ca-dao', title: 'Đồng dao, ca dao', emoji: '🎶', group: 'truyen', grades: [0, 1, 2], uncertain: true, desc: 'Bài đồng dao, ca dao dân gian có đọc mẫu và ý nghĩa.' },
].map((x) => ({ subject: 'tieng-viet', kind: 'cong-cu', ...x }) as CatalogItem);

// ── Tiếng Anh (lớp chưa ghi trên trang → phần lớn là ước lượng) ──────────────────────────────────────
const TIENG_ANH: CatalogItem[] = [
  { href: '/tu-vung-tieng-anh', title: 'Từ vựng theo chủ đề', emoji: '🔤', grades: range(0, 5), uncertain: true, desc: 'Từ vựng có phiên âm, hình minh hoạ và nghe phát âm.' },
  { href: '/bang-chu-cai-tieng-anh', title: 'Bảng chữ cái A–Z', emoji: '🅰️', grades: [0, 1, 2], uncertain: true, desc: 'Tên chữ, âm phonics và từ mẫu có hình.' },
  { href: '/phonics-tieng-anh', title: 'Phonics – ghép vần đọc', emoji: '🐱', grades: [0, 1, 2], uncertain: true, desc: 'Âm chữ cái, từ CVC, họ từ và âm ghép.' },
  { href: '/bang-phien-am-ipa', title: 'Bảng phiên âm IPA', emoji: '🗣️', grades: [3, 4, 5], uncertain: true, desc: '44 âm IPA, khẩu hình và từ ví dụ nghe được.' },
  { href: '/sight-words-tieng-anh', title: 'Sight words', emoji: '👀', grades: [1, 2], desc: 'Từ thông dụng theo cấp Dolch để đọc trôi chảy.' },
  { href: '/mau-cau-tieng-anh', title: 'Mẫu câu giao tiếp', emoji: '💬', grades: [1, 2, 3], uncertain: true, desc: 'Chào hỏi, I like…, I can… có giọng bản ngữ.' },
  { href: '/hoi-thoai-tieng-anh', title: 'Hội thoại tình huống', emoji: '🧑‍🤝‍🧑', grades: [2, 3, 4, 5], uncertain: true, desc: 'Đoạn hội thoại ở lớp, ở nhà, đi mua đồ.' },
  { href: '/bai-hat-tieng-anh', title: 'Bài hát tiếng Anh', emoji: '🎵', grades: [0, 1, 2, 3], uncertain: true, desc: 'ABC Song, Twinkle Twinkle… có lời và nghĩa.' },
  { href: '/ngu-phap-tieng-anh', title: 'Ngữ pháp qua trò chơi', emoji: '🧠', grades: [2, 3, 4, 5], uncertain: true, desc: 'a/an, số nhiều, this/that, to be, can.' },
  { href: '/hoc-tieng-anh', title: 'Game học tiếng Anh', emoji: '🦉', kind: 'tro-choi', grades: [1, 2, 3, 4, 5], uncertain: true, desc: 'Bài học ngắn: nghe chọn tranh, ghép cặp, chọn từ.' },
  { href: '/vong-tu-vung', title: 'Vòng tròn từ vựng', emoji: '🎡', kind: 'tro-choi', grades: [1, 2, 3, 4, 5], desc: 'Vòng từ vựng chia theo lớp và chủ đề.' },
  { href: '/luyen-nghe', title: 'Luyện nghe tiếng Anh', emoji: '🎧', kind: 'tro-choi', grades: [1, 2, 3, 4, 5], desc: 'Bốn trò luyện nghe cho bé lớp 1–5.' },
  { href: '/nghe-chon-hinh', title: 'Nghe chọn hình', emoji: '🖼️', kind: 'tro-choi', grades: [1, 2, 3, 4, 5], desc: 'Nghe từ rồi chạm đúng hình.' },
  { href: '/nghe-doan-tu', title: 'Nghe đoán từ', emoji: '✍️', kind: 'tro-choi', grades: [2, 3, 4, 5], uncertain: true, desc: 'Nhìn hình, nghe từ, chọn đúng cách viết.' },
  { href: '/nghe-nhanh', title: 'Nghe nhanh 60 giây', emoji: '⚡', kind: 'tro-choi', grades: [2, 3, 4, 5], uncertain: true, desc: 'Phản xạ nghe từ trong 60 giây.' },
  { href: '/nghe-truyen', title: 'Nghe truyện tiếng Anh', emoji: '📻', kind: 'tro-choi', grades: [1, 2, 3, 4, 5], desc: 'Nghe truyện ngắn rồi trả lời câu hỏi.' },
  { href: '/tinh-huong-tieng-anh', title: '360 tình huống nói với con', emoji: '🏠', grades: range(0, 5), desc: 'Câu tiếng Anh hằng ngày cho ba mẹ nói cùng con.' },
].map((x) => ({ subject: 'tieng-anh', kind: 'cong-cu', ...x }) as CatalogItem);

// ── Thi & ôn tập ─────────────────────────────────────────────────────────────────────────────────────
const THI_MON: Record<number, string> = { 1: 'Toán, Tiếng Việt', 2: 'Toán, Tiếng Việt', 3: 'Toán', 4: 'Toán', 5: 'Toán' };
const THI: CatalogItem[] = [
  ...SCHOOL_GRADES.map((g): CatalogItem => ({
    href: `/thi-lop-${g}`, title: `Đề thi lớp ${g}`, emoji: '📝', subject: g <= 2 ? 'tong-hop' : 'toan', kind: 'de-thi', grades: [g],
    desc: `Đề giữa kì, cuối kì ${THI_MON[g]} — làm trên máy, chấm điểm ngay.`,
  })),
  { href: '/bai-tap', title: 'Bài tập theo chủ đề', emoji: '✏️', subject: 'tong-hop', kind: 'on-tap', grades: [1, 2, 3, 4, 5], desc: 'Toán 1–5, Tiếng Việt 1–3, Tiếng Anh 1; ba mức kèm đáp án.' },
  { href: '/ky-nang', title: 'Học theo kỹ năng', emoji: '🎯', subject: 'tong-hop', kind: 'on-tap', grades: [1, 2, 3, 4, 5], desc: 'Luyện đúng kỹ năng bé còn yếu, vd. phép chia lớp 3.' },
  { href: '/on-tap-cau-sai', title: 'Ôn câu sai', emoji: '🔁', subject: 'tong-hop', kind: 'on-tap', grades: [1, 2, 3, 4, 5], desc: 'Làm lại những câu bé từng làm sai.' },
];

// ── Chơi & thi đấu (Sân chơi Trí tuệ) ───────────────────────────────────────────────────────────────
const THI_DAU: CatalogItem[] = [
  { href: '/san-choi-tri-tue', title: 'Thử thách hôm nay', emoji: '🏆', grades: [1, 2, 3, 4, 5], desc: '10 câu mới mỗi ngày, nhận sao, đua bảng tuần.' },
  { href: '/thu-thach-iq', title: 'Thử thách IQ', emoji: '🧠', grades: [1, 2, 3, 4, 5], subject: 'tu-duy', desc: '10 câu đố tư duy mỗi ngày, có lời giải.' },
  { href: '/thi-tai', title: 'Thi Tài', emoji: '🥇', grades: [1, 2, 3, 4, 5], desc: 'Thi tính giờ, combo điểm, huy chương và hạng mùa.' },
  { href: '/trieu-phu-nhi', title: 'Triệu Phú Nhí', emoji: '💎', grades: [1, 2, 3, 4, 5], desc: 'Trả lời câu hỏi leo bậc thang thưởng.' },
  { href: '/kham-pha', title: 'Đố vui khám phá', emoji: '🔎', grades: range(0, 5), desc: 'Động vật, cơ thể, vũ trụ, Việt Nam — có giải thích.' },
  { href: '/san-choi-tri-tue/phong', title: 'Phòng thi với bạn', emoji: '👫', grades: [1, 2, 3, 4, 5], desc: 'Tạo phòng, mời bạn cùng thi một bộ câu.' },
].map((x) => ({ subject: 'tong-hop', kind: 'thi-dau', ...x }) as CatalogItem);

// ── Tài liệu in (phần nhẹ; gói trả phí + bộ tập viết ở catalogFull.ts) ───────────────────────────────
const TAI_LIEU: CatalogItem[] = [
  { href: '/phieu-bai-tap', title: 'Phiếu bài tập PDF', emoji: '📄', subject: 'tong-hop', kind: 'tai-lieu', grades: [1, 2, 3, 4, 5], desc: 'Mỗi bài một phiếu kèm đáp án, in hoặc lưu PDF miễn phí.' },
];

/** Danh sách nhẹ, an toàn để dùng trong client component (menu). */
export const CATALOG: CatalogItem[] = [...TOAN_TOOLS, ...TOAN_KHAC, ...TIENG_VIET, ...TIENG_ANH, ...THI, ...THI_DAU, ...TAI_LIEU];

export const byHref = (href: string) => CATALOG.find((x) => x.href === href);

export type CatalogQuery = { grade?: Grade | null; subject?: Subject | Subject[]; kind?: Kind | Kind[]; group?: TvGroup };

export function filterItems(items: CatalogItem[], q: CatalogQuery): CatalogItem[] {
  const subj = q.subject == null ? null : Array.isArray(q.subject) ? q.subject : [q.subject];
  const kind = q.kind == null ? null : Array.isArray(q.kind) ? q.kind : [q.kind];
  return items.filter(
    (x) =>
      (q.grade == null || x.grades.includes(q.grade)) &&
      (!subj || subj.includes(x.subject)) &&
      (!kind || kind.includes(x.kind)) &&
      (!q.group || x.group === q.group),
  );
}
