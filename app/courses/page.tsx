import CourseLibraryPage from '../components/edu/CourseLibraryPage';
import type { Metadata } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

export const metadata: Metadata = {
  title: 'Khóa học cho bé',
  description:
    'Khám phá thư viện khóa học cho bé với các nhóm nội dung về ngôn ngữ, toán học, tư duy và ngoại ngữ, được thiết kế trực quan, dễ tiếp cận và phù hợp theo độ tuổi.',
  keywords: [
    'khóa học cho bé',
    'bài học cho trẻ em',
    'học ngôn ngữ cho bé',
    'toán học cho bé',
    'tiếng Anh cho trẻ em',
    'học trực tuyến cho trẻ',
    'bé hay học',
  ],
  alternates: {
    canonical: '/khoa-hoc',
  },
  openGraph: {
    title: 'Khóa học cho bé | Bé Hay Học',
    description:
      'Thư viện khóa học trực quan, ngắn gọn và phù hợp với từng giai đoạn phát triển của bé.',
    url: `${SITE}/khoa-hoc`,
    siteName: 'Bé Hay Học',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og-courses.jpg', width: 1200, height: 630, alt: 'Khóa học cho bé - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khóa học cho bé | Bé Hay Học',
    description: 'Khám phá các nhóm bài học phù hợp với nhu cầu phát triển của bé.',
    images: ['/og-courses.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Khóa học cho bé | Bé Hay Học',
  description: 'Thư viện khóa học giáo dục cho bé 3-10 tuổi: ngôn ngữ, toán học, tư duy và tiếng Anh.',
  url: `${SITE}/khoa-hoc`,
  inLanguage: 'vi-VN',
  publisher: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
    { '@type': 'ListItem', position: 2, name: 'Khóa học', item: `${SITE}/khoa-hoc` },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <CourseLibraryPage />
    </>
  );
}
