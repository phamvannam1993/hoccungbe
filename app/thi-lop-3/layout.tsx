import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: {
    default: 'Thi thử lớp 3 – Đề Toán giữa kì 1 và học kì 1 có chấm điểm',
    template: '%s | Bé Hay Học',
  },
  description: '5 đề giữa kì 1 và 20 đề kiểm tra học kì 1 môn Toán lớp 3 — làm trực tuyến như đề giấy, chấm điểm và xem đáp án ngay.',
  alternates: { canonical: `${SITE}/thi-lop-3` },
  openGraph: {
    title: 'Thi thử lớp 3 – Đề Toán giữa kì 1 và học kì 1 có chấm điểm | Bé Hay Học',
    description: '5 đề giữa kì 1 và 20 đề kiểm tra học kì 1 môn Toán lớp 3 — làm trực tuyến như đề giấy, chấm điểm và xem đáp án ngay.',
    url: `${SITE}/thi-lop-3`,
    type: 'website',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: 'Thi thử lớp 3 – Bé Hay Học' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
