import ConnectNumberOrderGame from './ConnectNumberOrderGame';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nối số theo thứ tự',
    description:
      'Trò chơi nối số theo thứ tự giúp bé nhận biết số, ghi nhớ thứ tự trước sau và rèn luyện tư duy quan sát một cách vui nhộn.',
    alternates: {
      canonical: '/games/connect-number-order',
    },
    openGraph: {
      title: 'Nối số theo thứ tự | Học Cùng Bé',
      description:
        'Bé học cách nhận biết và sắp xếp số đúng thứ tự thông qua trò chơi trực quan, sinh động và dễ hiểu.',
      url: '/games/connect-number-order',
      type: 'website',
      images: [
        {
          url: '/og-connect-number-order.jpg',
          width: 1200,
          height: 630,
          alt: 'Nối số theo thứ tự - Học Cùng Bé',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nối số theo thứ tự | Học Cùng Bé',
      description:
        'Trò chơi giúp bé học số, ghi nhớ thứ tự và phát triển khả năng quan sát.',
      images: ['/og-connect-number-order.jpg'],
    },
};

export default function ConnectNumberOrderPage() {
    return <ConnectNumberOrderGame />;
}