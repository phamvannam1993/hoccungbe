import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: {
    default: 'Thi thử lớp 1 – Toán và Tiếng Việt có chấm điểm',
    template: '%s | Bé Hay Học',
  },
  description: 'Đề kiểm tra giữa kì 1, phiếu ôn tập học kì 1 môn Toán và bài tập chính tả Tiếng Việt lớp 1 — làm trực tuyến, chấm điểm và xem đáp án ngay.',
  alternates: { canonical: `${SITE}/thi-lop-1` },
  openGraph: {
    title: 'Thi thử lớp 1 – Toán và Tiếng Việt có chấm điểm | Bé Hay Học',
    description: 'Đề kiểm tra giữa kì 1 và ôn tập học kì 1 lớp 1 — làm trực tuyến, chấm điểm ngay.',
    url: `${SITE}/thi-lop-1`,
    type: 'website',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: 'Thi thử lớp 1 – Bé Hay Học' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
