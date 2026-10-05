import type { Metadata } from 'next';

// Khu "chơi" là các trang app tương tác, nội dung tải bằng JS (client-side).
// Không phải trang nội dung SEO — nội dung để index nằm ở /khoa-hoc, /tro-choi, /lessons.
// Đặt noindex để tránh Google index nội dung mỏng và phí crawl budget; vẫn follow để truyền link.
export const metadata: Metadata = {
  title: 'Khu vực chơi & học tương tác | Bé Hay Học',
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
