import type { Metadata } from 'next';
import LetterTracingGame from './LetterTracingGame';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Tập Viết Chữ | 3-6 tuổi',
  description: 'Game tập viết chữ giúp bé 3-6 tuổi luyện tô nét chữ cái tiếng Việt, nhận diện chữ và rèn kỹ năng vận động tinh qua hoạt động tương tác.',
  keywords: ['tập viết chữ cho bé', 'game tập viết chữ', 'luyện viết chữ cái', 'tô nét chữ cái', 'học chữ cái tiếng Việt', 'letter tracing for kids'],
  alternates: { canonical: '/tro-choi/tap-viet-chu' },
  openGraph: {
    title: 'Tập Viết Chữ | 3-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi luyện tô nét chữ cái tiếng Việt giúp bé học viết tự nhiên, vui và dễ bắt đầu.',
    url: '/tro-choi/tap-viet-chu',
    type: 'website',
    images: [{ url: '/og-letter-tracing.jpg', width: 1200, height: 630, alt: 'Tập Viết Chữ - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tập Viết Chữ | Bé Hay Học',
    description: 'Game luyện viết chữ cái tiếng Việt miễn phí cho bé 3-6 tuổi.',
    images: ['/og-letter-tracing.jpg'],
  },
};

export default function LetterTracingPage() {
  return (
    <>
      <GameStructuredData slug="letter-tracing" imageUrl="/og-letter-tracing.jpg" />
      <LetterTracingGame />
    <GameSeoContent slug="letter-tracing" />
    </>
  );
}
