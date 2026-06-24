import type { Metadata } from 'next';
import TraceSentenceGame from "./TraceSentenceGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Tô Theo Nét Câu | 4-6 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi tô theo nét câu giúp bé viết câu, reading, motor. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học viết câu.',
  keywords: ['tô theo', 'nét câu', 'viết', 'chữ', 'game tô theo nét câu', 'sentence tracing', 'luyện viết câu'],
  alternates: { canonical: '/tro-choi/to-theo-net-cau' },
  openGraph: {
    title: 'Tô Theo Nét Câu | 4-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi tô theo nét câu giúp bé viết câu, reading, motor. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học viết câu.',
    url: '/tro-choi/to-theo-net-cau',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Tô Theo Nét Câu - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tô Theo Nét Câu | 4-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi tô theo nét câu giúp bé viết câu, reading, motor. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học viết câu.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="to-theo-net-cau" />
      <TraceSentenceGame />
    </>
  );
}
