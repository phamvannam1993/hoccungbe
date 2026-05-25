import type { Metadata } from 'next';
import MissingNumberGame from './MissingNumberGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Tìm số còn thiếu',
  description:
    'Trò chơi tìm số còn thiếu giúp bé nhận biết quy luật số, đếm tăng giảm và rèn phản xạ toán học cơ bản qua các dãy số trực quan.',
  alternates: {
    canonical: '/tro-choi/tim-so-thieu',
  },
  openGraph: {
    title: 'Tìm số còn thiếu | Bé Hay Học',
    description:
      'Bé quan sát dãy số, tìm số còn thiếu và rèn luyện tư duy toán học cơ bản theo cách vui nhộn, trực quan.',
    url: '/tro-choi/tim-so-thieu',
    type: 'website',
    images: [
      {
        url: '/og-missing-number.jpg',
        width: 1200,
        height: 630,
        alt: 'Tìm số còn thiếu - Bé Hay Học',
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="missing-number" />
      <MissingNumberGame />
    </>
  );
}
