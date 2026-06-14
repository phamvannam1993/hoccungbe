import type { Metadata } from 'next';
import DocVanGhepChuGame from './DocVanGhepChuGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Ghép Chữ Thành Vần | Trò Chơi Học Đọc Tiếng Việt Cho Bé',
  description:
    'Trò chơi ghép chữ thành vần giúp bé nhận diện chữ cái, kết hợp để tạo vần đúng. Bé nghe phát âm, quan sát chữ đầu, chọn chữ tiếp để ghép thành vần hoàn chỉnh với âm thanh TTS.',
  keywords: ['ghép vần', 'học đọc', 'chữ cái', 'tiếng Việt', 'kéo thả', 'trẻ em'],
  alternates: {
    canonical: '/tro-choi/ghep-chu-thanh-van',
  },
  openGraph: {
    title: 'Ghép Chữ Thành Vần | Bé Hay Học',
    description:
      'Trò chơi kéo thả ghép chữ thành vần giúp bé phát triển kỹ năng đọc, nhận diện chữ cái và phát âm tiếng Việt.',
    url: '/tro-choi/ghep-chu-thanh-van',
    type: 'website',
    images: [
      {
        url: '/og-doc-van-ghep-chu.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép Chữ Thành Vần - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép Chữ Thành Vần | Bé Hay Học',
    description:
      'Bé ghép chữ thành vần để học đọc và phát âm tiếng Việt qua trò chơi vui nhộn.',
    images: ['/og-doc-van-ghep-chu.jpg'],
  },
};

export default function DocVanGhepChuPage() {
  return (
    <>
      <GameStructuredData slug="doc-van-ghep-chu" />
      <DocVanGhepChuGame />
    </>
  );
}
