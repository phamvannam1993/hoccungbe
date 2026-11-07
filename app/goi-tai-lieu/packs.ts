// Gói tài liệu in / tải (bán một lần, dùng 12 tháng). Mã gói bắt đầu bằng DL — api-hoccungbe
// (planOf) ghi quyền 12 tháng và payOS đưa người mua về /goi-tai-lieu. Quyền học lưu chung cookie
// khv_access với Toán IQ, khóa là `goi:<slug>` (slugsForPrefix trong khoa-hoc-iq/lib/catalog.ts).

import { ENGLISH_ALPHABET } from '../lib/englishAlphabet';
import { PHONICS_GROUPS } from '../lib/phonics';
import { WORD_FAMILIES } from '../lib/wordFamilies';
import { DIGRAPHS } from '../lib/digraphs';

/** Số card trong gói Phonics (đếm thẳng từ dữ liệu trang phonics). */
export const PHONICS_COUNTS = {
  cards:
    ENGLISH_ALPHABET.length +
    PHONICS_GROUPS.reduce((n, g) => n + g.words.length, 0) +
    WORD_FAMILIES.reduce((n, f) => n + f.words.length, 0) +
    DIGRAPHS.reduce((n, d) => n + d.words.length, 0),
  flowers: WORD_FAMILIES.length,
};

export type PackKind = 'de-hk1' | 'phonics' | 'thi-lop-1';

export type Pack = {
  slug: string;
  codePrefix: string;
  kind: PackKind;
  title: string;
  subtitle: string;
  price: number;
  oldPrice?: number;
  emoji: string;
  bullets: string[];
  /** Bộ đề: lớp và các môn (khớp exams.subject ở API). */
  grade?: number;
  subjects?: string[];
};

export const PACK_MONTHS = 12;

const hk1 = (grade: number, subjects: string[], price: number, oldPrice: number): Pack => {
  const n = subjects.length * 10;
  const names = subjects.map((s) => SUBJECT_LABEL[s]).join(', ');
  return {
    slug: `de-on-thi-hk1-lop-${grade}`,
    codePrefix: `DLHK1L${grade}`,
    kind: 'de-hk1',
    title: `Bộ đề ôn thi học kỳ 1 lớp ${grade}`,
    subtitle: `${n} đề ${names} (giữa kỳ + cuối kỳ), in A4 kèm đáp án và lời giải`,
    price,
    oldPrice,
    emoji: '📝',
    bullets: [
      `${n} đề: 5 đề giữa HK1 + 5 đề cuối HK1 mỗi môn`,
      'Bản in A4 gọn gàng, có ô điểm và chỗ ghi tên',
      'Phần đáp án và lời giải ở cuối bộ đề, xé riêng được',
      'In bao nhiêu lần cũng được trong 12 tháng',
    ],
    grade,
    subjects,
  };
};

export const SUBJECT_LABEL: Record<string, string> = { toan: 'Toán', 'tieng-viet': 'Tiếng Việt', 'tieng-anh': 'Tiếng Anh' };

export const PACKS: Pack[] = [
  {
    slug: 'the-phonics',
    codePrefix: 'DLPHONICS',
    kind: 'phonics',
    title: 'Trọn bộ card Phonics tiếng Anh',
    subtitle: `${PHONICS_COUNTS.cards} card + ${PHONICS_COUNTS.flowers} thẻ hoa in A4: bảng chữ cái, ghép vần CVC, họ từ, âm ghép`,
    price: 29000,
    oldPrice: 199000,
    emoji: '🔤',
    bullets: [
      '26 card bảng chữ cái A–Z có hình',
      '110 card ghép vần CVC theo 5 nguyên âm ngắn',
      `${PHONICS_COUNTS.flowers} thẻ hoa họ từ (word family) + thẻ từng từ`,
      'Card âm ghép: digraph, vowel team, r-controlled, blends',
      'In một lần cả bộ, có đường cắt, dùng 12 tháng',
    ],
  },
  {
    // Bản in đề giữa kì của khu /thi-lop-1 (tờ đề vẽ lại từ bộ đề giấy) — làm online vẫn miễn phí
    slug: 'thi-giua-ki-1-lop-1',
    codePrefix: 'DLGK1L1',
    kind: 'thi-lop-1',
    title: 'Bộ 30 đề kiểm tra giữa kì 1 Toán lớp 1',
    subtitle: '30 đề kiểm tra giữa kì 1 môn Toán lớp 1 (Đề 1 → Đề 30), in A4 như đề thật, kèm đáp án',
    price: 29000,
    oldPrice: 199000,
    emoji: '🏆',
    bullets: [
      '30 đề Kiểm tra giữa kì 1 môn Toán (Đề 1 → Đề 30)',
      'Đủ dạng bài: đếm hình, so sánh, tách – gộp, tính, viết phép tính theo tranh',
      'Trình bày y như đề giấy: tranh, ô điểm, chỗ ghi tên',
      'Phần đáp án ở cuối bộ, in bao nhiêu lần cũng được trong 12 tháng',
    ],
    grade: 1,
    subjects: ['toan'],
  },
  {
    // Bản in phiếu ôn tập học kì 1 của khu /thi-lop-1
    slug: 'on-thi-hoc-ki-1-lop-1',
    codePrefix: 'DLONHK1L1',
    kind: 'thi-lop-1',
    title: 'Ôn thi học kỳ 1 lớp 1 – phiếu ôn tập',
    subtitle: '10 phiếu ôn tập học kì 1 môn Toán và 4 phiếu Tiếng Việt (chính tả, ôn giữa kì), in A4 như phiếu thật, kèm đáp án',
    price: 29000,
    oldPrice: 149000,
    emoji: '📚',
    bullets: [
      '10 phiếu Ôn tập học kì 1 môn Toán: tính, tìm số, điền dấu, viết phép tính theo tranh',
      '4 phiếu Tiếng Việt: chính tả g/gh, x/s, ua/ưa, ch/tr và phiếu ôn giữa kì',
      'Trình bày y như phiếu giấy, có tranh minh hoạ',
      'Phần đáp án ở cuối bộ, in bao nhiêu lần cũng được trong 12 tháng',
    ],
    grade: 1,
    subjects: ['toan', 'tieng-viet'],
  },
  {
    // Bản in 23 đề Kiểm tra học kì 1 Tiếng Việt lớp 1 của khu /thi-lop-1
    slug: 'de-tieng-viet-hk1-lop-1',
    codePrefix: 'DLTVHK1L1',
    kind: 'thi-lop-1',
    title: 'Bộ 23 đề kiểm tra học kì 1 Tiếng Việt lớp 1',
    subtitle: '23 đề kiểm tra học kì 1 môn Tiếng Việt lớp 1: đọc thành tiếng, đọc hiểu, chính tả, bài tập — in A4 có tranh, kèm đáp án',
    price: 29000,
    oldPrice: 199000,
    emoji: '📝',
    bullets: [
      '23 đề Kiểm tra học kì 1 môn Tiếng Việt (Đề 1 → Đề 23)',
      'Đủ phần: đọc thành tiếng, đọc hiểu, chính tả, bài tập',
      'Có tranh minh hoạ, ô li để bé tập chép',
      'Phần đáp án ở cuối bộ, in bao nhiêu lần cũng được trong 12 tháng',
    ],
    grade: 1,
    subjects: ['tieng-viet'],
  },
  hk1(1, ['toan', 'tieng-viet', 'tieng-anh'], 29000, 199000),
  hk1(2, ['toan', 'tieng-viet'], 29000, 149000),
  hk1(3, ['toan', 'tieng-viet'], 29000, 149000),
  hk1(4, ['toan'], 29000, 99000),
  hk1(5, ['toan'], 29000, 99000),
];

/** Khóa quyền trong cookie khv_access. */
export const packKey = (slug: string) => `goi:${slug}`;

export const getPack = (slug: string) => PACKS.find((p) => p.slug === slug);

/** Gói bộ đề HK1 chứa đề của môn/lớp này (để mời mua ở trang làm đề). */
export const hk1PackFor = (grade: number, subject: string) =>
  PACKS.find((p) => p.kind === 'de-hk1' && p.grade === grade && p.subjects?.includes(subject));
export const packForPrefix = (prefix: string) => PACKS.find((p) => p.codePrefix === prefix);
