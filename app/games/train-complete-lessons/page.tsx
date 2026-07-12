import type { Metadata } from 'next';
import TrainCompleteLessonsGame from "./TrainCompleteLessonsGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Đoàn Tàu Toán Học | 5-7 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi đoàn tàu toán học giúp bé phép cộng, toán học. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học toán học.',
  keywords: ['tàu', 'cộng', 'toán học', 'dãy', 'game đoàn tàu toán', 'train math game', 'cộng số qua câu chuyện'],
  alternates: { canonical: '/tro-choi/doan-tau-toan-hoc' },
  openGraph: {
    title: 'Đoàn Tàu Toán Học | 5-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi đoàn tàu toán học giúp bé phép cộng, toán học. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học toán học.',
    url: '/tro-choi/doan-tau-toan-hoc',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đoàn Tàu Toán Học | 5-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi đoàn tàu toán học giúp bé phép cộng, toán học. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học toán học.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="train-complete-lessons" />
      <TrainCompleteLessonsGame />
    <GameSeoContent slug="train-complete-lessons" />
    </>
  );
}
