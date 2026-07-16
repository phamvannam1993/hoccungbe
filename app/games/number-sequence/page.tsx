import type { Metadata } from 'next';
import NumberSequenceGame from "./NumberSequenceGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Dãy Số | 5-8 tuổi',
  description: 'Trò chơi dãy số giúp bé logic, quy luật, dãy số. Phù hợp với trẻ 5-8 tuổi. Tải ngay để bé học logic.',
  keywords: ['dãy số', 'quy luật', 'pattern', 'logic', 'trò chơi dãy số', 'game quy luật toán', 'pattern recognition'],
  alternates: { canonical: '/tro-choi/day-so' },
  openGraph: {
    title: 'Dãy Số | 5-8 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi dãy số giúp bé logic, quy luật, dãy số. Phù hợp với trẻ 5-8 tuổi. Tải ngay để bé học logic.',
    url: '/tro-choi/day-so',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dãy Số | 5-8 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi dãy số giúp bé logic, quy luật, dãy số. Phù hợp với trẻ 5-8 tuổi. Tải ngay để bé học logic.',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="number-sequence" />
      <NumberSequenceGame />
    <GameSeoContent slug="number-sequence" />
    </>
  );
}
