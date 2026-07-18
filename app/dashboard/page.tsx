import ParentDashboardPage from '../components/edu/ParentDashboardPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng theo dõi phụ huynh',
  description:
    'Theo dõi toàn bộ hành trình học tập của bé với bảng theo dõi phụ huynh: bài học đã hoàn thành, thời gian học, mức độ tập trung, kỹ năng nổi bật và gợi ý nội dung nên học tiếp.',
  keywords: [
    'bảng theo dõi phụ huynh',
    'theo dõi tiến độ học của bé',
    'báo cáo học tập cho trẻ em',
    'kỹ năng của bé',
    'bé hay học',
  ],
  alternates: {
    canonical: '/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Bảng theo dõi phụ huynh | Bé Hay Học',
    description:
      'Xem nhanh kết quả học tập, thời lượng học, kỹ năng nổi bật và gợi ý nội dung phù hợp cho bé.',
    url: '/dashboard',
    type: 'website',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Bảng theo dõi phụ huynh - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bảng theo dõi phụ huynh | Bé Hay Học',
    description:
      'Theo dõi toàn bộ hành trình học tập của bé một cách trực quan và dễ hiểu.',
    images: ['/og-home.jpg'],
  },
};


export default function Page() {
  return <ParentDashboardPage />;
}
