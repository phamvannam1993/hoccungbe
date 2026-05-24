import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Góc phụ huynh - Kiến thức nuôi dạy con | Bé Hay Học',
  description: 'Bài viết kiến thức, kinh nghiệm nuôi dạy con, tin tức giáo dục trẻ em và các hoạt động học tập cho bé từ đội ngũ Bé Hay Học.',
  keywords: [
    'nuôi dạy con',
    'kinh nghiệm dạy trẻ',
    'giáo dục trẻ em tại nhà',
    'bài viết cho phụ huynh',
    'kiến thức phát triển trẻ',
    'bé hay học blog',
  ],
  alternates: { canonical: '/bai-viet' },
  openGraph: {
    title: 'Góc phụ huynh | Bé Hay Học',
    description: 'Kiến thức, kinh nghiệm và tin tức giáo dục trẻ em từ Bé Hay Học.',
    url: `${SITE}/bai-viet`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Góc phụ huynh | Bé Hay Học',
  description: 'Kiến thức, kinh nghiệm nuôi dạy con và tin tức giáo dục trẻ em.',
  url: `${SITE}/bai-viet`,
  inLanguage: 'vi-VN',
  publisher: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
    { '@type': 'ListItem', position: 2, name: 'Bài viết', item: `${SITE}/bai-viet` },
  ],
};

export default function BaiVietLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
