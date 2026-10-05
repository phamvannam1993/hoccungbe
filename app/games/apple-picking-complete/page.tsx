import type { Metadata } from 'next';
import ApplePickingCompleteGame from "./ApplePickingCompleteGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Hái Táo Học Toán | 5-7 tuổi | Bé Hay Học 2026',
  description: 'Trò chơi hái táo giúp bé luyện phép cộng, dãy số. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học phép cộng.',
  keywords: ['hái táo', 'cộng', 'toán', 'dãy số', 'game hái táo học cộng', 'trò chơi cộng số cho bé', 'harvest math'],
  alternates: { canonical: '/tro-choi/hai-tao-hoc-toan' },
  openGraph: {
    title: 'Hái Táo Học Toán | 5-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi hái táo giúp bé luyện phép cộng, dãy số. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học phép cộng.',
    url: '/tro-choi/hai-tao-hoc-toan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hái Táo Học Toán | 5-7 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi hái táo giúp bé luyện phép cộng, dãy số. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học phép cộng.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="apple-picking-complete" />
      <ApplePickingCompleteGame />
    <GameSeoContent slug="apple-picking-complete" />
    </>
  );
}
