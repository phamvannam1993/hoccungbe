// Chỉ mục khu /thi-lop-5 — đề Toán lớp 5 vẽ lại từ bản giấy, dùng chung bộ hiển thị và chấm điểm của /thi-lop-1.
import { compile, type Phieu } from '../thi-lop-1/kieu';
import { DE_GK_A } from './de-gk-a';
import { DE_GK_B } from './de-gk-b';
import { DE_HK_A } from './de-hk-a';
import { DE_HK_B } from './de-hk-b';

export const THI_LOP_5: Phieu[] = [...DE_GK_A, ...DE_GK_B, ...DE_HK_A, ...DE_HK_B].map(compile);

export const deTheoSlug = (slug: string) => THI_LOP_5.find((e) => e.slug === slug) ?? null;

/** Tờ đề thuộc gói in nào (khớp slug trong goi-tai-lieu/packs.ts). */
export const TO_THEO_GOI_L5: Record<string, Phieu[]> = {
  'de-giua-ki-1-toan-lop-5': THI_LOP_5.filter((p) => p.slug.includes('-giua-ki-1-')),
  'de-hoc-ki-1-toan-lop-5': THI_LOP_5.filter((p) => p.slug.includes('-hoc-ki-1-')),
};

export const NHOM_DE: { key: string; title: string; icon: string; desc: string; items: Phieu[] }[] = [
  {
    key: 'giua-ki-1',
    title: 'Toán – Đề kiểm tra giữa kì 1 (15 đề)',
    icon: '🔢',
    desc: 'Phân số thập phân, hỗn số, số thập phân: đọc viết, so sánh, đổi đơn vị đo độ dài – khối lượng – diện tích, bài toán tỉ lệ, tổng – tỉ, hiệu – tỉ.',
    items: TO_THEO_GOI_L5['de-giua-ki-1-toan-lop-5'],
  },
  {
    key: 'hoc-ki-1',
    title: 'Toán – Kiểm tra học kì 1 (17 đề)',
    icon: '🧮',
    desc: 'Cộng trừ nhân chia số thập phân, tìm x, tỉ số phần trăm, diện tích hình tam giác, đổi đơn vị đo, bài toán có lời văn.',
    items: TO_THEO_GOI_L5['de-hoc-ki-1-toan-lop-5'],
  },
];
