import type { Metadata } from 'next';
import TrainCompleteLessonsGame from "./TrainCompleteLessonsGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Đoàn Tàu Toán Học | 5-7 tuổi | Bé Hay Học 2025',
  description: 'Trò chơi đoàn tàu toán học giúp bé phép cộng, toán học. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học toán học.',
  keywords: ['tàu', 'cộng', 'toán học', 'dãy', 'game đoàn tàu toán', 'train math game', 'cộng số qua câu chuyện'],
  alternates: { canonical: '/tro-choi/tau-hoc-toan' },
  openGraph: {
    title: 'Đoàn Tàu Toán Học | 5-7 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi đoàn tàu toán học giúp bé phép cộng, toán học. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học toán học.',
    url: '/tro-choi/tau-hoc-toan',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Đoàn Tàu Toán Học - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đoàn Tàu Toán Học | 5-7 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi đoàn tàu toán học giúp bé phép cộng, toán học. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học toán học.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="train-complete-lessons" />
      <TrainCompleteLessonsGame />
    </>
  );
}
