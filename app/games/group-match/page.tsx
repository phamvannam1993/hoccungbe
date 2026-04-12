import type { Metadata } from 'next';
import GroupMatchGame from './GroupMatchGame';

export const metadata: Metadata = {
  title: 'Nối hình theo nhóm',
  description:
    'Trò chơi nối hình theo nhóm giúp bé nhận biết các hình cùng nhóm, tăng khả năng phân loại, quan sát và tư duy logic.',
  alternates: {
    canonical: '/games/group-match',
  },
  openGraph: {
    title: 'Nối hình theo nhóm | Học Cùng Bé',
    description:
      'Bé quan sát các hình và chọn nhóm hình cùng loại để rèn tư duy phân loại và ghi nhớ.',
    url: '/games/group-match',
    type: 'website',
    images: [
      {
        url: '/og-group-match.jpg',
        width: 1200,
        height: 630,
        alt: 'Nối hình theo nhóm - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nối hình theo nhóm | Học Cùng Bé',
    description:
      'Trò chơi giúp bé phân loại hình ảnh theo nhóm quen thuộc.',
    images: ['/og-group-match.jpg'],
  },
};

export default function Page() {
  return <GroupMatchGame />;
}
