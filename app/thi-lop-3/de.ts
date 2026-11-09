// Chỉ mục khu /thi-lop-3 — đề Toán lớp 3 vẽ lại từ bản giấy, dùng chung bộ hiển thị và chấm điểm của /thi-lop-1.
import { compile, type Phieu } from '../thi-lop-1/kieu';
import { DE_GK3, DE_HK3 } from './de-toan';

export const THI_LOP_3: Phieu[] = [...DE_GK3, ...DE_HK3].map(compile);

export const deTheoSlug = (slug: string) => THI_LOP_3.find((e) => e.slug === slug) ?? null;

/** Tờ đề thuộc gói in nào (khớp slug trong goi-tai-lieu/packs.ts). */
export const TO_THEO_GOI_L3: Record<string, Phieu[]> = {
  'de-giua-ki-1-toan-lop-3': THI_LOP_3.filter((p) => p.slug.includes('-giua-ki-1-')),
  'de-hoc-ki-1-toan-lop-3': THI_LOP_3.filter((p) => p.slug.includes('-hoc-ki-1-')),
};

export const NHOM_DE: { key: string; title: string; icon: string; desc: string; items: Phieu[] }[] = [
  {
    key: 'giua-ki-1',
    title: 'Toán – Đề kiểm tra giữa kì 1 (5 đề, Kết nối tri thức)',
    icon: '🔢',
    desc: 'Bảng nhân chia, cộng trừ số có ba chữ số, một phần mấy, trung điểm, hình tròn, góc vuông, khối hộp.',
    items: TO_THEO_GOI_L3['de-giua-ki-1-toan-lop-3'],
  },
  {
    key: 'hoc-ki-1',
    title: 'Toán – Kiểm tra học kì 1 (20 đề)',
    icon: '🧮',
    desc: 'Nhân chia số có ba chữ số, biểu thức, tìm x, đổi đơn vị đo, chu vi, đếm hình – góc vuông, bài toán có lời văn.',
    items: TO_THEO_GOI_L3['de-hoc-ki-1-toan-lop-3'],
  },
];
