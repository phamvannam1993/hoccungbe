import type { Metadata } from 'next';
import ApplePickingCompleteGame from "./ApplePickingCompleteGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Hái Táo Học Toán | 5-7 tuổi | Bé Hay Học 2025',
  description: 'Trò chơi hái táo giúp bé luyện phép cộng, dãy số. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học phép cộng.',
  keywords: ['hái táo', 'cộng', 'toán', 'dãy số', 'game hái táo học cộng', 'trò chơi cộng số cho bé', 'harvest math'],
  alternates: { canonical: '/tro-choi/hai-tao-hoc' },
  openGraph: {
    title: 'Hái Táo Học Toán | 5-7 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi hái táo giúp bé luyện phép cộng, dãy số. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học phép cộng.',
    url: '/tro-choi/hai-tao-hoc',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Hái Táo Học Toán - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hái Táo Học Toán | 5-7 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi hái táo giúp bé luyện phép cộng, dãy số. Phù hợp với trẻ 5-7 tuổi. Tải ngay để bé học phép cộng.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="apple-picking-complete" />
      <ApplePickingCompleteGame />
    </>
  );
}
