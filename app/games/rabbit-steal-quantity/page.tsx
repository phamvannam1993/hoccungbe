import type { Metadata } from 'next';
import RabbitStealQuantityGame from "./RabbitStealQuantityGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Thỏ Cắp Cà Rốt | 4-7 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi thỏ cắp cà rốt giúp bé phép trừ, đếm ngược. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
  keywords: ['thỏ', 'cà rốt', 'số lượng', 'trừ', 'game thỏ cắp cà rốt', 'học phép trừ qua trò chơi', 'mất bao nhiêu'],
  alternates: { canonical: '/tro-choi/tho-cap-ca-rot' },
  openGraph: {
    title: 'Thỏ Cắp Cà Rốt | 4-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi thỏ cắp cà rốt giúp bé phép trừ, đếm ngược. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
    url: '/tro-choi/tho-cap-ca-rot',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Thỏ Cắp Cà Rốt - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thỏ Cắp Cà Rốt | 4-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi thỏ cắp cà rốt giúp bé phép trừ, đếm ngược. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="rabbit-steal-quantity" />
      <RabbitStealQuantityGame />
    </>
  );
}
