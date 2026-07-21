import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: {
    // Chỉ hứa đúng nội dung hiện có (toàn bộ đề đang là môn Toán, lớp 1–5).
    default: 'Đề thi Toán lớp 1–5 có chấm điểm trực tuyến',
    template: '%s | Bé Hay Học',
  },
  description: 'Luyện đề Toán lớp 1 đến lớp 5 trực tuyến, có chấm điểm, đáp án và kết quả ngay sau khi hoàn thành.',
  alternates: { canonical: `${SITE}/de-thi` },
  openGraph: {
    title: 'Đề thi Toán lớp 1–5 có chấm điểm trực tuyến | Bé Hay Học',
    description: 'Luyện đề Toán lớp 1 đến lớp 5 trực tuyến, có chấm điểm và đáp án ngay sau khi hoàn thành.',
    url: `${SITE}/de-thi`,
    type: 'website',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: 'Đề thi Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đề thi & Kiểm tra | Bé Hay Học',
    description: 'Đề kiểm tra tiểu học – tự chấm điểm tức thì.',
    images: [`${SITE}/og-home.jpg`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
