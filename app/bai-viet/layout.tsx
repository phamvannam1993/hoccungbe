import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  // default cho chính trang /bai-viet, template để bài viết con vẫn có thương hiệu
  title: {
    default: 'Góc phụ huynh - Kiến thức nuôi dạy con',
    template: '%s | Bé Hay Học',
  },
  description: 'Bài viết kiến thức, kinh nghiệm nuôi dạy con, tin tức giáo dục trẻ em và các hoạt động học tập cho bé từ đội ngũ Bé Hay Học.',
  keywords: [
    'nuôi dạy con',
    'kinh nghiệm dạy trẻ',
    'giáo dục trẻ em tại nhà',
    'bài viết cho phụ huynh',
    'kiến thức phát triển trẻ',
    'bé hay học blog',
  ],
  alternates: { canonical: `${SITE}/bai-viet` },
  openGraph: {
    title: 'Góc phụ huynh | Bé Hay Học',
    description: 'Kiến thức, kinh nghiệm và tin tức giáo dục trẻ em từ Bé Hay Học.',
    url: `${SITE}/bai-viet`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: 'Góc phụ huynh - Bé Hay Học' }],
  },
};

// Layout chỉ giữ metadata dùng chung. JSON-LD Blog + danh sách bài crawlable
// đã chuyển sang page.tsx (chỉ trang danh sách), tránh lọt sang bài viết chi tiết.
export default function BaiVietLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
