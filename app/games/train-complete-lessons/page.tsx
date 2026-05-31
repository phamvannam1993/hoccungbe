import type { Metadata } from 'next';
import TrainCompleteLessonsGame from "./TrainCompleteLessonsGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Đoàn tàu toán học | Bé Hay Học',
  description: 'Trò chơi đoàn tàu giúp bé luyện phép cộng, phép trừ, đếm số, so sánh và dãy số. Độ khó tăng dần, vô hạn câu hỏi.',
  keywords: ['đoàn tàu toán học', 'trò chơi toán học cho bé', 'học cộng trừ', 'đếm số', 'dãy số', 'bé hay học'],
  alternates: { canonical: '/tro-choi/tau-hoc-toan' },
  openGraph: {
    title: 'Đoàn tàu toán học | Bé Hay Học',
    description: 'Bé lái đoàn tàu để luyện cộng, trừ, đếm số, so sánh và dãy số. Trò chơi toán học tổng hợp cho trẻ 4–8 tuổi.',
    url: '/tro-choi/tau-hoc-toan',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Đoàn tàu toán học - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đoàn tàu toán học | Bé Hay Học',
    description: 'Đoàn tàu toán học – trò chơi tổng hợp kỹ năng toán học cho bé.',
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
