import type { Metadata } from 'next';
import RabbitHoleGame from "./RabbitHoleGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Thỏ Vào Hang | 4-7 tuổi | Bé Hay Học 2025',
  description: 'Trò chơi thỏ vào hang giúp bé phép trừ, logic toán học. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
  keywords: ['thỏ', 'hang', 'số lượng', 'toán', 'trò chơi thỏ vào hang', 'game học số qua câu chuyện', 'subtraction game'],
  alternates: { canonical: '/tro-choi/tho-vao-hang' },
  openGraph: {
    title: 'Thỏ Vào Hang | 4-7 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi thỏ vào hang giúp bé phép trừ, logic toán học. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
    url: '/tro-choi/tho-vao-hang',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Thỏ Vào Hang - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thỏ Vào Hang | 4-7 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi thỏ vào hang giúp bé phép trừ, logic toán học. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="rabbit-hole" />
      <RabbitHoleGame />
    </>
  );
}
