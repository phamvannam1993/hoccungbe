import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Đề thi & Kiểm tra | Bé Hay Học',
  description: 'Bộ đề thi, bài kiểm tra Toán, Tiếng Việt, Tiếng Anh lớp 1–5 theo chuẩn Bộ Giáo dục – Đào tạo. Tự chấm điểm tức thì, luyện tập hiệu quả cho bé.',
  alternates: { canonical: `${SITE}/de-thi` },
  openGraph: {
    title: 'Đề thi & Kiểm tra | Bé Hay Học',
    description: 'Đề kiểm tra Toán, Tiếng Việt, Tiếng Anh tiểu học – tự chấm điểm tức thì.',
    url: `${SITE}/de-thi`,
    type: 'website',
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: 'Đề thi Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đề thi & Kiểm tra | Bé Hay Học',
    description: 'Đề kiểm tra tiểu học – tự chấm điểm tức thì.',
    images: [`${SITE}/og-image.jpg`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
