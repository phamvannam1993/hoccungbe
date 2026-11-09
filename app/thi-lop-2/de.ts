// Chỉ mục khu /thi-lop-2 — đề Toán lớp 2 vẽ lại từ bản giấy, dùng chung bộ hiển thị và chấm điểm của /thi-lop-1.
import { compile, type Phieu } from '../thi-lop-1/kieu';
import { DE_GK, DE_HK } from './de-toan';
import { DE_TV_L2 } from './de-tv';

export const THI_LOP_2: Phieu[] = [...DE_GK, ...DE_HK, ...DE_TV_L2].map(compile);

export const deTheoSlug = (slug: string) => THI_LOP_2.find((e) => e.slug === slug) ?? null;

/** Tờ đề thuộc gói in nào (khớp slug trong goi-tai-lieu/packs.ts). */
export const TO_THEO_GOI_L2: Record<string, Phieu[]> = {
  'de-giua-ki-1-toan-lop-2': THI_LOP_2.filter((p) => p.slug.startsWith('toan-') && p.slug.includes('-giua-ki-1-')),
  'de-hoc-ki-1-toan-lop-2': THI_LOP_2.filter((p) => p.slug.includes('-hoc-ki-1-')),
  'de-tieng-viet-lop-2-hk1': THI_LOP_2.filter((p) => p.slug.startsWith('tieng-viet-lop-2-')),
};

export const NHOM_DE: { key: string; title: string; icon: string; desc: string; items: Phieu[] }[] = [
  {
    key: 'giua-ki-1',
    title: 'Toán – Đề thi giữa kì 1 (5 đề)',
    icon: '🔢',
    desc: 'Cộng trừ có nhớ trong phạm vi 100, so sánh, đề-xi-mét, ki-lô-gam, lít, bài toán nhiều hơn – ít hơn.',
    items: TO_THEO_GOI_L2['de-giua-ki-1-toan-lop-2'],
  },
  {
    key: 'hoc-ki-1',
    title: 'Toán – Kiểm tra học kì 1 (20 đề)',
    icon: '🧮',
    desc: 'Trắc nghiệm và tự luận: đặt tính, tìm x, xem lịch – đồng hồ, đếm hình tam giác – tứ giác, bài toán có lời văn.',
    items: TO_THEO_GOI_L2['de-hoc-ki-1-toan-lop-2'],
  },
  {
    key: 'tv-giua-ki-1',
    title: 'Tiếng Việt – Đề thi giữa học kì 1 (5 đề)',
    icon: '📖',
    desc: 'Đọc hiểu, từ chỉ sự vật – hoạt động – đặc điểm, dấu câu, kiểu câu; nghe viết và viết đoạn văn.',
    items: THI_LOP_2.filter((p) => p.slug.startsWith('tieng-viet-lop-2-giua-ki-1')),
  },
  {
    key: 'tv-cuoi-ki-1',
    title: 'Tiếng Việt – Đề thi cuối học kì 1 (5 đề)',
    icon: '📝',
    desc: 'Đọc hiểu, từ trái nghĩa, gạch chân từ, dấu chấm – phẩy – chấm hỏi; nghe viết và viết đoạn văn.',
    items: THI_LOP_2.filter((p) => p.slug.startsWith('tieng-viet-lop-2-cuoi-ki-1')),
  },
];
