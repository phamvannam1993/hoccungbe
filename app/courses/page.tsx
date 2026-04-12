import CourseLibraryPage from '../components/edu/CourseLibraryPage';
import type { Metadata } from 'next';

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
    'học cùng bé',
  ],
  alternates: {
    canonical: '/courses',
  },
  openGraph: {
    title: 'Khóa học cho bé | Học Cùng Bé',
    description:
      'Thư viện khóa học trực quan, ngắn gọn và phù hợp với từng giai đoạn phát triển của bé.',
    url: '/courses',
    type: 'website',
    images: [
      {
        url: '/og-courses.jpg',
        width: 1200,
        height: 630,
        alt: 'Khóa học cho bé - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khóa học cho bé | Học Cùng Bé',
    description:
      'Khám phá các nhóm bài học phù hợp với nhu cầu phát triển của bé.',
    images: ['/og-courses.jpg'],
  },
};

export default function Page() {
  return <CourseLibraryPage />;
}
