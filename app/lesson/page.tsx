import LessonDetailPage from '../components/edu/LessonDetailPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi tiết bài học cho bé',
  description:
    'Khám phá bài học chi tiết cho bé với nội dung trực quan, thời lượng ngắn, rèn nhận biết mặt chữ, ghi nhớ hình ảnh và tăng khả năng tập trung.',
  keywords: [
    'chi tiết bài học cho bé',
    'bài học ngôn ngữ cho trẻ em',
    'nhận biết mặt chữ',
    'bài học trực quan cho bé',
    'học cùng bé',
  ],
  alternates: {
    canonical: '/lesson',
  },
  openGraph: {
    title: 'Chi tiết bài học cho bé | Học Cùng Bé',
    description:
      'Bài học ngắn, trực quan và dễ tiếp cận giúp bé học vui hơn mỗi ngày.',
    url: '/lesson',
    type: 'website',
    images: [
      {
        url: '/og-lesson.jpg',
        width: 1200,
        height: 630,
        alt: 'Chi tiết bài học cho bé - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chi tiết bài học cho bé | Học Cùng Bé',
    description:
      'Khám phá bài học trực quan giúp bé nhận biết mặt chữ và tăng tập trung.',
    images: ['/og-lesson.jpg'],
  },
};
export default function Page() {
  return <LessonDetailPage />;
}
