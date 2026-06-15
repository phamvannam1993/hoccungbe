import type { Metadata } from 'next';
import LetterTracingGame from './LetterTracingGame';

export const metadata: Metadata = {
  title: 'Tập Viết Chữ | 3-6 tuổi | Bé Hay Học 2025',
  description: 'Trò chơi tập viết chữ giúp bé viết chữ, kỹ năng motor. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học viết chữ.',
  keywords: ['viết chữ', 'tập viết', 'chữ cái', 'motor', 'game tập viết chữ', 'letter tracing for kids', 'luyện viết chữ'],
  openGraph: {
    title: 'Tập Viết Chữ | 3-6 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi tập viết chữ giúp bé viết chữ, kỹ năng motor. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học viết chữ.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tập Viết Chữ | 3-6 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi tập viết chữ giúp bé viết chữ, kỹ năng motor. Phù hợp với trẻ 3-6 tuổi. Tải ngay để bé học viết chữ.',
  },
};

export default function LetterTracingPage() {
  return <LetterTracingGame />;
}
