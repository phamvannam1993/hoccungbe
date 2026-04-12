import ParentDashboardPage from '../components/edu/ParentDashboardPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard phụ huynh',
  description:
    'Theo dõi toàn bộ hành trình học tập của bé với dashboard phụ huynh: bài học đã hoàn thành, thời gian học, mức độ tập trung, kỹ năng nổi bật và gợi ý nội dung nên học tiếp.',
  keywords: [
    'dashboard phụ huynh',
    'theo dõi tiến độ học của bé',
    'báo cáo học tập cho trẻ em',
    'kỹ năng của bé',
    'học cùng bé',
  ],
  alternates: {
    canonical: '/dashboard',
  },
  openGraph: {
    title: 'Dashboard phụ huynh | Học Cùng Bé',
    description:
      'Xem nhanh kết quả học tập, thời lượng học, kỹ năng nổi bật và gợi ý nội dung phù hợp cho bé.',
    url: '/dashboard',
    type: 'website',
    images: [
      {
        url: '/og-dashboard.jpg',
        width: 1200,
        height: 630,
        alt: 'Dashboard phụ huynh - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard phụ huynh | Học Cùng Bé',
    description:
      'Theo dõi toàn bộ hành trình học tập của bé một cách trực quan và dễ hiểu.',
    images: ['/og-dashboard.jpg'],
  },
};


export default function Page() {
  return <ParentDashboardPage />;
}
