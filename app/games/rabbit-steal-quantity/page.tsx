import type { Metadata } from 'next';
import RabbitStealQuantityGame from "./RabbitStealQuantityGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Thỏ cắp cà rốt | Bé Hay Học',
  description: 'Trò chơi thỏ cắp cà rốt giúp bé luyện đếm số lượng và nhận biết số. Kéo chú thỏ cắp đúng số củ cà rốt theo yêu cầu.',
  keywords: ['thỏ cắp cà rốt', 'đếm số lượng cho bé', 'trò chơi kéo thả', 'học đếm cho trẻ em', 'trò chơi toán học', 'bé hay học'],
  alternates: { canonical: '/tro-choi/tho-cap-ca-rot' },
  openGraph: {
    title: 'Thỏ cắp cà rốt | Bé Hay Học',
    description: 'Kéo chú thỏ cắp đúng số củ cà rốt theo yêu cầu. Trò chơi rèn kỹ năng đếm số lượng cho bé 3–7 tuổi.',
    url: '/tro-choi/tho-cap-ca-rot',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Thỏ cắp cà rốt - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thỏ cắp cà rốt | Bé Hay Học',
    description: 'Giúp thỏ cắp đúng số cà rốt – trò chơi đếm số vui nhộn cho bé.',
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
