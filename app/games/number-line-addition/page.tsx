import type { Metadata } from 'next';
import NumberLineAdditionGame from './NumberLineAdditionGame';

export const metadata: Metadata = {
  title: 'Cộng trên trục số',
  description:
    'Trò chơi Cộng trên trục số giúp bé hiểu phép cộng bằng cách nhảy bước trên trục số, rèn tư duy số học trực quan và nhận biết thứ tự số.',
  alternates: {
    canonical: '/games/number-line-addition',
  },
  openGraph: {
    title: 'Cộng trên trục số | Học Cùng Bé',
    description:
      'Bé quan sát phép cộng, nhảy bước trên trục số và chọn điểm đến đúng để hiểu phép cộng một cách trực quan.',
    url: '/games/number-line-addition',
    type: 'website',
    images: [
      {
        url: '/og-number-line-addition.jpg',
        width: 1200,
        height: 630,
        alt: 'Cộng trên trục số - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cộng trên trục số | Học Cùng Bé',
    description:
      'Trò chơi giúp bé luyện phép cộng bằng cách nhảy bước trên trục số.',
    images: ['/og-number-line-addition.jpg'],
  },
};

export default function Page() {
  return <NumberLineAdditionGame />;
}
