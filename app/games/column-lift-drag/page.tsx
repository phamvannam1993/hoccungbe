import type { Metadata } from 'next';
import ColumnLiftDragGame from "./ColumnLiftDragGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Kéo Cột Số | 5-7 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi kéo cột số giúp bé sắp xếp, logic, motor skills. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học logic.',
  keywords: ['kéo', 'cột', 'số', 'logic', 'game kéo cột số', 'drag and drop math', 'sắp xếp số'],
  alternates: { canonical: '/tro-choi/keo-cot-so' },
  openGraph: {
    title: 'Kéo Cột Số | 5-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi kéo cột số giúp bé sắp xếp, logic, motor skills. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học logic.',
    url: '/tro-choi/keo-cot-so',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Kéo Cột Số - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kéo Cột Số | 5-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi kéo cột số giúp bé sắp xếp, logic, motor skills. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học logic.',
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
