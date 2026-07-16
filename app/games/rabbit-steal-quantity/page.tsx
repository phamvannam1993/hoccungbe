import type { Metadata } from 'next';
import RabbitStealQuantityGame from "./RabbitStealQuantityGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Thỏ Cắp Cà Rốt | 4-7 tuổi',
  description: 'Trò chơi thỏ cắp cà rốt giúp bé phép trừ, đếm ngược. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
  keywords: ['thỏ', 'cà rốt', 'số lượng', 'trừ', 'game thỏ cắp cà rốt', 'học phép trừ qua trò chơi', 'mất bao nhiêu'],
  alternates: { canonical: '/tro-choi/tho-cap-ca-rot' },
  openGraph: {
    title: 'Thỏ Cắp Cà Rốt | 4-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi thỏ cắp cà rốt giúp bé phép trừ, đếm ngược. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
    url: '/tro-choi/tho-cap-ca-rot',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thỏ Cắp Cà Rốt | 4-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi thỏ cắp cà rốt giúp bé phép trừ, đếm ngược. Phù hợp với trẻ 4-7 tuổi. Tải ngay để bé học phép trừ.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="rabbit-steal-quantity" />
      <RabbitStealQuantityGame />
    <GameSeoContent slug="rabbit-steal-quantity" />
    </>
  );
}
