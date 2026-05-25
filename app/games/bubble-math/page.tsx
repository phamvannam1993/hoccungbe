import type { Metadata } from 'next';
import BubbleMathGame from './BubbleMathGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Bắn bong bóng kết quả',
  description:
    'Trò chơi Bắn bong bóng kết quả giúp bé luyện phép cộng trừ đơn giản, tính nhẩm nhanh và chọn đúng đáp án qua các bong bóng vui nhộn.',
  alternates: {
    canonical: '/tro-choi/toan-bong-bong',
  },
  openGraph: {
    title: 'Bắn bong bóng kết quả | Bé Hay Học',
    description:
      'Bé quan sát phép tính, bấm vào bong bóng có kết quả đúng và rèn kỹ năng tính nhẩm một cách vui nhộn.',
    url: '/tro-choi/toan-bong-bong',
    type: 'website',
    images: [
      {
        url: '/og-bubble-math.jpg',
        width: 1200,
        height: 630,
        alt: 'Bắn bong bóng kết quả - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bắn bong bóng kết quả | Bé Hay Học',
    description:
      'Trò chơi giúp bé luyện cộng trừ, tính nhẩm và phản xạ chọn kết quả đúng.',
    images: ['/og-bubble-math.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="bubble-math" />
      <BubbleMathGame />
    </>
  );
}
