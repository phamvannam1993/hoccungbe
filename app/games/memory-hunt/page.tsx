import type { Metadata } from 'next';
import MemoryHuntPage from '../../components/edu/MemoryHuntPage';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Săn hình ghi nhớ | Bé Hay Học',
  description: 'Trò chơi săn hình ghi nhớ giúp bé rèn trí nhớ ngắn hạn, khả năng quan sát và tập trung. Ghi nhớ vị trí hình ảnh và chọn lại đúng.',
  keywords: ['săn hình ghi nhớ', 'trò chơi ghi nhớ cho bé', 'luyện trí nhớ trẻ em', 'trò chơi quan sát', 'bé hay học'],
  alternates: { canonical: '/tro-choi/san-hinh-ghi-nho' },
  openGraph: {
    title: 'Săn hình ghi nhớ | Bé Hay Học',
    description: 'Ghi nhớ vị trí các hình ảnh rồi chọn lại đúng – trò chơi rèn trí nhớ và sự tập trung cho bé 4–6 tuổi.',
    url: '/tro-choi/san-hinh-ghi-nho',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Săn hình ghi nhớ - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Săn hình ghi nhớ | Bé Hay Học',
    description: 'Ghi nhớ và tìm lại hình đúng – trò chơi luyện trí nhớ cho bé.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="memory-hunt" />
      <MemoryHuntPage />
    </>
  );
}
