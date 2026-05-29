import type { Metadata } from 'next';
import BirdCountGame from "./BirdCountGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Đếm chim | Bé Hay Học',
  description: 'Trò chơi đếm chim giúp bé luyện kỹ năng đếm số, nhận biết số lượng và phát triển khả năng quan sát. Độ khó tăng dần, vô hạn câu hỏi.',
  keywords: ['đếm chim', 'trò chơi đếm số cho bé', 'học đếm cho trẻ em', 'nhận biết số lượng', 'trò chơi toán học cho bé', 'bé hay học'],
  alternates: { canonical: '/tro-choi/dem-chim' },
  openGraph: {
    title: 'Đếm chim | Bé Hay Học',
    description: 'Bé quan sát đàn chim bay qua và chọn đúng số lượng. Trò chơi rèn kỹ năng đếm số trực quan cho trẻ 3–7 tuổi.',
    url: '/tro-choi/dem-chim',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Đếm chim - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đếm chim | Bé Hay Học',
    description: 'Đếm số chim bay qua màn hình – trò chơi toán học thú vị cho bé.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="bird-count" />
      <BirdCountGame />
    </>
  );
}
