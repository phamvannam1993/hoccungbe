import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: {
    default: 'Thi thử lớp 2 – Đề Toán và Tiếng Việt học kì 1 có chấm điểm',
    template: '%s | Bé Hay Học',
  },
  description: '25 đề Toán và 10 đề Tiếng Việt lớp 2 (giữa kì 1, cuối kì 1) — làm trực tuyến như đề giấy, chấm điểm và xem đáp án ngay.',
  alternates: { canonical: `${SITE}/thi-lop-2` },
  openGraph: {
    title: 'Thi thử lớp 2 – Đề Toán và Tiếng Việt học kì 1 có chấm điểm | Bé Hay Học',
    description: '25 đề Toán và 10 đề Tiếng Việt lớp 2 (giữa kì 1, cuối kì 1) — làm trực tuyến như đề giấy, chấm điểm và xem đáp án ngay.',
    url: `${SITE}/thi-lop-2`,
    type: 'website',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: 'Thi thử lớp 2 – Bé Hay Học' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
