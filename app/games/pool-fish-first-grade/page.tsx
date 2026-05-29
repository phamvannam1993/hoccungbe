import type { Metadata } from 'next';
import PoolFishFirstGradeGame from "./PoolFishFirstGradeGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Cá trong hồ bơi | Bé Hay Học',
  description: 'Trò chơi đếm cá và làm quen phép cộng, phép trừ cho bé 4–7 tuổi. Quan sát cá bơi tới và bơi đi, chọn đúng số lượng cá còn lại. Độ khó tăng dần, vô hạn câu hỏi.',
  keywords: ['cá trong hồ bơi', 'trò chơi đếm số cho bé', 'phép cộng trừ cho trẻ em', 'học toán qua trò chơi', 'trò chơi toán học mầm non', 'bé hay học'],
  alternates: { canonical: '/tro-choi/ca-trong-ho' },
  openGraph: {
    title: 'Cá trong hồ bơi | Bé Hay Học',
    description: 'Bé quan sát cá bơi trong hồ, đếm số cá và làm quen phép cộng, phép trừ. Trò chơi toán học trực quan cho trẻ 4–7 tuổi.',
    url: '/tro-choi/ca-trong-ho',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Cá trong hồ bơi - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cá trong hồ bơi | Bé Hay Học',
    description: 'Đếm cá, làm phép cộng trừ qua hình ảnh trực quan – trò chơi toán học thú vị cho bé.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="pool-fish-first-grade" />
      <PoolFishFirstGradeGame />
    </>
  );
}
