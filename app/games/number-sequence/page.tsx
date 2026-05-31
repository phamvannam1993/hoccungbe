import type { Metadata } from 'next';
import NumberSequenceGame from "./NumberSequenceGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Dãy số | Bé Hay Học',
  description: 'Trò chơi dãy số giúp bé nhận biết quy luật tăng giảm, điền số còn thiếu và phát triển tư duy logic. Độ khó tăng dần, vô hạn câu hỏi.',
  keywords: ['dãy số', 'trò chơi dãy số cho bé', 'tìm quy luật số', 'điền số còn thiếu', 'tư duy logic toán học', 'bé hay học'],
  alternates: { canonical: '/tro-choi/day-so' },
  openGraph: {
    title: 'Dãy số | Bé Hay Học',
    description: 'Bé quan sát dãy số, tìm quy luật và điền số còn thiếu. Trò chơi rèn kỹ năng tư duy số học cho trẻ 5–8 tuổi.',
    url: '/tro-choi/day-so',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Dãy số - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dãy số | Bé Hay Học',
    description: 'Tìm quy luật và điền số còn thiếu – trò chơi toán học tư duy cho bé.',
    images: ['/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="number-sequence" />
      <NumberSequenceGame />
    </>
  );
}
