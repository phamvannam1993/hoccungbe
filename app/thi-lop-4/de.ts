// Chỉ mục khu /thi-lop-4 — đề Toán lớp 4 vẽ lại từ bản giấy, dùng chung bộ hiển thị và chấm điểm của /thi-lop-1.
import { compile, type Phieu } from '../thi-lop-1/kieu';
import { DE_GK4, DE_HK4 } from './de-toan';

export const THI_LOP_4: Phieu[] = [...DE_GK4, ...DE_HK4].map(compile);

export const deTheoSlug = (slug: string) => THI_LOP_4.find((e) => e.slug === slug) ?? null;

/** Tờ đề thuộc gói in nào (khớp slug trong goi-tai-lieu/packs.ts). */
export const TO_THEO_GOI_L4: Record<string, Phieu[]> = {
  'de-giua-ki-1-toan-lop-4': THI_LOP_4.filter((p) => p.slug.includes('-giua-ki-1-')),
  'de-hoc-ki-1-toan-lop-4': THI_LOP_4.filter((p) => p.slug.includes('-hoc-ki-1-')),
};

export const NHOM_DE: { key: string; title: string; icon: string; desc: string; items: Phieu[] }[] = [
  {
    key: 'giua-ki-1',
    title: 'Toán – Đề kiểm tra giữa kì 1 (5 đề)',
    icon: '🔢',
    desc: 'Đọc viết số đến lớp triệu, giá trị chữ số, đổi đơn vị đo khối lượng – thời gian, thế kỉ, trung bình cộng, góc nhọn – vuông – tù – bẹt, tổng – hiệu.',
    items: TO_THEO_GOI_L4['de-giua-ki-1-toan-lop-4'],
  },
  {
    key: 'hoc-ki-1',
    title: 'Toán – Kiểm tra học kì 1 (20 đề)',
    icon: '🧮',
    desc: 'Cộng trừ nhân chia số nhiều chữ số, tìm x, dấu hiệu chia hết, tính thuận tiện, đổi đơn vị diện tích, hai đường thẳng song song – vuông góc, tổng – hiệu, trung bình cộng.',
    items: TO_THEO_GOI_L4['de-hoc-ki-1-toan-lop-4'],
  },
];
