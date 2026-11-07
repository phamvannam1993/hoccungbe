// Chỉ mục khu /thi-lop-1 — các tờ đề Toán và Tiếng Việt lớp 1 vẽ lại từ bản giấy (không qua API /exams).
import { DE_TOAN } from './de-toan';
import { DE_TOAN_THEM } from './de-toan-them';
import { DE_TV } from './de-tv';
import { DE_TV_HK1 } from './de-tv-hk1';
import { compile, type Phieu } from './kieu';

// Đề giữa kì xếp theo số đề 1 → 30, rồi phiếu ôn tập, rồi Tiếng Việt
const soDe = (slug: string) => Number(/giua-ki-1-de-(\d+)$/.exec(slug)?.[1] ?? 999);
export const THI_LOP_1: Phieu[] = [...DE_TOAN, ...DE_TOAN_THEM]
  .sort((a, b) => soDe(a.slug) - soDe(b.slug))
  .concat(DE_TV, DE_TV_HK1)
  .map(compile);

export const deTheoSlug = (slug: string) => THI_LOP_1.find((e) => e.slug === slug) ?? null;

/** Tờ đề thuộc gói in nào (khớp slug trong goi-tai-lieu/packs.ts). */
export const giuaKi = (p: Phieu) => /^toan-giua-ki-1-de-\d+$/.test(p.slug);
export const TO_THEO_GOI: Record<string, Phieu[]> = {
  'thi-giua-ki-1-lop-1': THI_LOP_1.filter(giuaKi),
  'on-thi-hoc-ki-1-lop-1': THI_LOP_1.filter((p) => !giuaKi(p) && !p.slug.startsWith('tieng-viet-hk1-')),
  'de-tieng-viet-hk1-lop-1': THI_LOP_1.filter((p) => p.slug.startsWith('tieng-viet-hk1-')),
};

export const NHOM_DE: { key: string; title: string; icon: string; desc: string; items: Phieu[] }[] = [
  {
    key: 'toan-giua-ki-1',
    title: 'Toán – Kiểm tra giữa kì 1',
    icon: '🔢',
    desc: 'Các số trong phạm vi 10, so sánh, tách – gộp số, cộng trừ và bài toán có lời văn.',
    items: THI_LOP_1.filter((e) => e.slug.startsWith('toan-giua-ki-1')),
  },
  {
    key: 'toan-on-tap',
    title: 'Toán – Ôn tập học kì 1',
    icon: '🧮',
    desc: 'Phiếu luyện tính nhẩm, tìm số chưa biết, điền dấu, chuỗi phép tính và viết phép tính theo tranh.',
    items: THI_LOP_1.filter((e) => e.slug.startsWith('toan-on-tap')),
  },
  {
    key: 'tieng-viet-hk1',
    title: 'Tiếng Việt – Kiểm tra học kì 1 (23 đề)',
    icon: '📝',
    desc: 'Đọc hiểu, điền âm – vần, nối câu, viết từ theo tranh; phần đọc thành tiếng và chính tả để người lớn chấm.',
    items: THI_LOP_1.filter((e) => e.slug.startsWith('tieng-viet-hk1-')),
  },
  {
    key: 'tieng-viet',
    title: 'Tiếng Việt – Chính tả & Ôn giữa kì 1',
    icon: '📖',
    desc: 'Phân biệt g/gh, x/s, ua/ưa, ch/tr, nối từ với tranh và đọc hiểu.',
    items: THI_LOP_1.filter((e) => e.mon === 'tieng-viet' && !e.slug.startsWith('tieng-viet-hk1-')),
  },
];
