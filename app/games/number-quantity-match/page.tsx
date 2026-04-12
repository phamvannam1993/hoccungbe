import type { Metadata } from 'next';
import NumberQuantityMatchGame from './NumberQuantityMatchGame';

export const metadata: Metadata = {
  title: 'Ghép số với số lượng',
  description:
    'Trò chơi ghép số với số lượng giúp bé nhận biết chữ số, hiểu khái niệm số lượng và rèn luyện tư duy toán học cơ bản qua hình ảnh trực quan.',
  alternates: {
    canonical: '/games/number-quantity-match',
  },
  openGraph: {
    title: 'Ghép số với số lượng | Học Cùng Bé',
    description:
      'Bé quan sát số và số lượng đồ vật để ghép đúng, từ đó phát triển khả năng đếm, nhận biết số và học toán sớm.',
    url: '/games/number-quantity-match',
    type: 'website',
    images: [
      {
        url: '/og-number-quantity-match.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghép số với số lượng - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghép số với số lượng | Học Cùng Bé',
    description:
      'Trò chơi giúp bé học đếm, nhận biết chữ số và ghép đúng số với số lượng tương ứng.',
    images: ['/og-number-quantity-match.jpg'],
  },
};

export default function NumberQuantityMatchPage() {
  return <NumberQuantityMatchGame />;
}
