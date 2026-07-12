import type { Metadata } from 'next';
import TraceSentenceGame from "./TraceSentenceGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tô Theo Nét Câu | 4-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi tô theo nét câu giúp bé viết câu, reading, motor. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học viết câu.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="to-theo-net-cau" />
      <TraceSentenceGame />
    <GameSeoContent slug="to-theo-net-cau" />
    </>
  );
}
