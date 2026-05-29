import type { Metadata } from 'next';
import RabbitHoleGame from "./RabbitHoleGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Thỏ vào hang | Bé Hay Học',
  description: 'Trò chơi thỏ vào hang giúp bé nhận biết số, luyện phối hợp tay-mắt và tập trung. Kéo chú thỏ vào đúng hang theo số yêu cầu.',
  keywords: ['thỏ vào hang', 'nhận biết số cho bé', 'trò chơi kéo thả', 'học số cho trẻ em', 'trò chơi toán học', 'bé hay học'],
  alternates: { canonical: '/tro-choi/tho-vao-hang' },
  openGraph: {
    title: 'Thỏ vào hang | Bé Hay Học',
    description: 'Kéo chú thỏ vào đúng hang có số yêu cầu. Độ khó tăng dần với nhiều hang hơn và số lớn hơn.',
    url: '/tro-choi/tho-vao-hang',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Thỏ vào hang - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thỏ vào hang | Bé Hay Học',
    description: 'Giúp chú thỏ tìm đúng hang – trò chơi nhận biết số vui nhộn cho bé.',
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
