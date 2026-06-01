import type { Metadata } from 'next';
import ColumnLiftDragGame from "./ColumnLiftDragGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Kéo cột số | Bé Hay Học',
  description: 'Trò chơi kéo cột số giúp bé nhận biết quy luật tăng giảm trong dãy số bằng cách kéo cột biểu đồ đến độ cao đúng. Vô hạn câu hỏi, độ khó tăng dần.',
  keywords: ['kéo cột số', 'trò chơi dãy số cho bé', 'tìm quy luật số', 'điền số còn thiếu', 'tư duy logic toán học', 'bé hay học'],
  alternates: { canonical: '/tro-choi/keo-cot-so' },
  openGraph: {
    title: 'Kéo cột số | Bé Hay Học',
    description: 'Bé kéo cột biểu đồ lên/xuống để điền số còn thiếu trong dãy số. Trò chơi rèn tư duy số học cho trẻ 5–8 tuổi.',
    url: '/tro-choi/keo-cot-so',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Kéo cột số - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kéo cột số | Bé Hay Học',
    description: 'Kéo cột biểu đồ và tìm số còn thiếu – trò chơi toán học tư duy cho bé.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="column-lift-drag" />
      <ColumnLiftDragGame />
    </>
  );
}
