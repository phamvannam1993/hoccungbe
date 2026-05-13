import type { Metadata } from 'next';
import PatternCompleteGame from './PatternCompleteGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Hoàn thành quy luật',
  description:
    'Trò chơi hoàn thành quy luật giúp bé nhận biết quy tắc lặp lại, suy luận logic và chọn phần còn thiếu để hoàn thiện dãy hình hoặc đối tượng.',
  alternates: {
    canonical: '/games/pattern-complete',
  },
  openGraph: {
    title: 'Hoàn thành quy luật | Học Cùng Bé',
    description:
      'Bé quan sát dãy hình, tìm ra quy luật và chọn đáp án đúng để phát triển tư duy logic và khả năng nhận biết mẫu.',
    url: '/games/pattern-complete',
    type: 'website',
    images: [
      {
        url: '/og-pattern-complete.jpg',
        width: 1200,
        height: 630,
        alt: 'Hoàn thành quy luật - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hoàn thành quy luật | Học Cùng Bé',
    description:
      'Trò chơi giúp bé nhận biết quy luật, rèn suy luận và hoàn thiện dãy hình một cách trực quan.',
    images: ['/og-pattern-complete.jpg'],
  },
};

export default function PatternCompletePage() {
  return (
    <>
      <GameStructuredData slug="pattern-complete" />
      <PatternCompleteGame />
    </>
  );
}
