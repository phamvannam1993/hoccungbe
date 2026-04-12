import type { Metadata } from 'next';
import ProgressPage from '../components/edu/ProgressPage';

export const metadata: Metadata = {
  title: 'Tiến độ học tập của bé',
  description:
    'Theo dõi tiến độ học tập của bé với báo cáo trực quan về bài học đã hoàn thành, thời gian học, kỹ năng đang phát triển và gợi ý nội dung nên học tiếp.',
  keywords: [
    'tiến độ học tập của bé',
    'báo cáo học tập cho trẻ em',
    'theo dõi quá trình học của bé',
    'kỹ năng của bé',
    'học cùng bé',
  ],
  alternates: {
    canonical: '/progress',
  },
  openGraph: {
    title: 'Tiến độ học tập của bé | Học Cùng Bé',
    description:
      'Xem báo cáo trực quan về quá trình học tập, kỹ năng phát triển và nội dung gợi ý cho bé.',
    url: '/progress',
    type: 'website',
    images: [
      {
        url: '/og-progress.jpg',
        width: 1200,
        height: 630,
        alt: 'Tiến độ học tập của bé - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiến độ học tập của bé | Học Cùng Bé',
    description:
      'Theo dõi bài học đã hoàn thành, thời gian học và kỹ năng nổi bật của bé.',
    images: ['/og-progress.jpg'],
  },
};

export default function Page() {
  return <ProgressPage />;
}