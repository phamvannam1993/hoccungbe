import type { Metadata } from 'next';
import ApplePickingCompleteGame from "./ApplePickingCompleteGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Hái táo học toán | Bé Hay Học',
  description: 'Trò chơi hái táo giúp bé luyện phép cộng, phép trừ, đếm số, so sánh và nhiều kỹ năng toán học khác. Độ khó tăng dần, vô hạn câu hỏi.',
  keywords: ['hái táo học toán', 'trò chơi toán học cho bé', 'học cộng trừ', 'đếm số', 'so sánh số', 'bé hay học'],
  alternates: { canonical: '/tro-choi/hai-tao-hoc' },
  openGraph: {
    title: 'Hái táo học toán | Bé Hay Học',
    description: 'Bé hái táo để luyện cộng, trừ, đếm số và so sánh. Trò chơi toán học tổng hợp cho trẻ 4–8 tuổi.',
    url: '/tro-choi/hai-tao-hoc',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Hái táo học toán - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hái táo học toán | Bé Hay Học',
    description: 'Hái táo học toán – trò chơi tổng hợp kỹ năng toán học cho bé.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="apple-picking-complete" />
      <ApplePickingCompleteGame />
    </>
  );
}
