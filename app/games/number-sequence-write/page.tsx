import type { Metadata } from 'next';
import NumberSequenceWriteGame from './NumberSequenceWriteGame';

export const metadata: Metadata = {
  title: 'Viết dãy số',
  description:
    'Trò chơi Viết dãy số giúp bé luyện thứ tự số, số liền trước – liền sau, đếm cách đều và hoàn thành dãy số còn thiếu.',
  alternates: {
    canonical: '/games/number-sequence-write',
  },
  openGraph: {
    title: 'Viết dãy số | Học Cùng Bé',
    description:
      'Bé quan sát dãy số, nhập các số còn thiếu và rèn tư duy quy luật toán học một cách trực quan.',
    url: '/games/number-sequence-write',
    type: 'website',
    images: [
      {
        url: '/og-number-sequence-write.jpg',
        width: 1200,
        height: 630,
        alt: 'Viết dãy số - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Viết dãy số | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện dãy số, số liền trước – liền sau và đếm cách đều.',
    images: ['/og-number-sequence-write.jpg'],
  },
};

export default function Page() {
  return <NumberSequenceWriteGame />;
}
