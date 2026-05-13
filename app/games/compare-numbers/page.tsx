import type { Metadata } from 'next';
import CompareNumbersGame from './CompareNumbersGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'So sánh số',
  description:
    'Trò chơi So sánh số giúp bé nhận biết số lớn hơn, số bé hơn, hai số bằng nhau và chọn đúng dấu >, <, = qua hình ảnh trực quan.',
  alternates: {
    canonical: '/games/compare-numbers',
  },
  openGraph: {
    title: 'So sánh số | Học Cùng Bé',
    description:
      'Bé quan sát hai số hoặc hai nhóm đồ vật, sau đó chọn dấu so sánh đúng để học toán một cách vui nhộn.',
    url: '/games/compare-numbers',
    type: 'website',
    images: [
      {
        url: '/og-compare-numbers.jpg',
        width: 1200,
        height: 630,
        alt: 'So sánh số - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'So sánh số | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện lớn hơn, bé hơn, bằng nhau và nhận diện dấu >, <, =.',
    images: ['/og-compare-numbers.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="compare-numbers" />
      <CompareNumbersGame />
    </>
  );
}
