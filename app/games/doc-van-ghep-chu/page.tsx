import type { Metadata } from 'next';
import DocVanGhepChuGame from './DocVanGhepChuGame';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';

export const metadata: Metadata = {
  title: 'Ghép Chữ Thành Vần | 4-6 tuổi',
  description: 'Trò chơi ghép chữ thành vần giúp bé vần tiếng Việt, phát âm, đọc. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học vần.',
  keywords: ['ghép chữ', 'vần', 'tiếng Việt', 'âm thanh', 'trò chơi ghép chữ thành vần', 'game học vần tiếng Việt', 'syllable building'],
  alternates: {
    canonical: '/tro-choi/ghep-chu-thanh-van',
  },
  openGraph: {
    title: 'Ghép Chữ Thành Vần | 4-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi ghép chữ thành vần giúp bé vần tiếng Việt, phát âm, đọc. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học vần.',
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
    title: 'Ghép Chữ Thành Vần | 4-6 tuổi | Bé Hay Học 2026',
    description: 'Trò chơi ghép chữ thành vần giúp bé vần tiếng Việt, phát âm, đọc. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học vần.',
    images: ['/og-doc-van-ghep-chu.jpg'],
  },
};

export default function DocVanGhepChuPage() {
  return (
    <>
      <GameStructuredData slug="doc-van-ghep-chu" />
      <DocVanGhepChuGame />
    <GameSeoContent slug="doc-van-ghep-chu" />
    </>
  );
}
