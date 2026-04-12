import type { Metadata } from 'next';
import ColorSortGame from './ColorSortGame';

export const metadata: Metadata = {
  title: 'Phân loại màu sắc',
  description:
    'Trò chơi phân loại màu sắc giúp bé nhận biết các màu cơ bản, quan sát nhanh và chọn đúng đồ vật theo màu tương ứng.',
  alternates: {
    canonical: '/games/color-sort',
  },
  openGraph: {
    title: 'Phân loại màu sắc | Học Cùng Bé',
    description:
      'Bé nhìn yêu cầu màu sắc và chọn đúng đồ vật tương ứng để học màu một cách trực quan, vui nhộn.',
    url: '/games/color-sort',
    type: 'website',
    images: [
      {
        url: '/og-color-sort.jpg',
        width: 1200,
        height: 630,
        alt: 'Phân loại màu sắc - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phân loại màu sắc | Học Cùng Bé',
    description:
      'Trò chơi giúp bé nhận biết màu sắc và phân loại đồ vật theo màu đúng.',
    images: ['/og-color-sort.jpg'],
  },
};

export default function Page() {
  return <ColorSortGame />;
}
