import type { Metadata } from 'next';
import TraceSentenceGame from "./TraceSentenceGame";
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Tô Theo Nét Câu | Bé Hay Học',
  description: 'Trò chơi tô theo nét câu giúp bé luyện kỹ năng viết chữ, phát triển khả năng điều khiển cơ bắp tay. Với hơn 100 câu tiếng Việt đa dạng, audio hướng dẫn, bé học vui vẻ.',
  keywords: ['tô theo nét câu', 'trò chơi viết chữ cho bé', 'học viết chữ cho trẻ em', 'trò chơi luyện viết', 'phát triển kỹ năng tay bé', 'bé hay học'],
  alternates: { canonical: '/tro-choi/to-theo-net-cau' },
  openGraph: {
    title: 'Tô Theo Nét Câu | Bé Hay Học',
    description: 'Bé tô theo nét câu để luyện viết chữ. Trò chơi rèn kỹ năng điều khiển cơ bắp tay và chuẩn bị cho việc học viết cho trẻ 3–6 tuổi.',
    url: '/tro-choi/to-theo-net-cau',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Tô Theo Nét Câu - Bé Hay Học' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tô Theo Nét Câu | Bé Hay Học',
    description: 'Tô theo nét câu để luyện viết chữ – trò chơi phát triển kỹ năng tay cho bé.',
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
