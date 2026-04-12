import type { Metadata } from 'next';
import MissingNumberGame from './MissingNumberGame';

export const metadata: Metadata = {
  title: 'Tìm số còn thiếu',
  description:
    'Trò chơi tìm số còn thiếu giúp bé nhận biết quy luật số, đếm tăng giảm và rèn phản xạ toán học cơ bản qua các dãy số trực quan.',
  alternates: {
    canonical: '/games/missing-number',
  },
  openGraph: {
    title: 'Tìm số còn thiếu | Học Cùng Bé',
    description:
      'Bé quan sát dãy số, tìm số còn thiếu và rèn luyện tư duy toán học cơ bản theo cách vui nhộn, trực quan.',
    url: '/games/missing-number',
    type: 'website',
    images: [
      {
        url: '/og-missing-number.jpg',
        width: 1200,
        height: 630,
        alt: 'Tìm số còn thiếu - Học Cùng Bé',
      },
    ],
  },
};

export default function Page() {
  return <MissingNumberGame />;
}
