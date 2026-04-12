import type { Metadata } from 'next';
import EnglishVocabularyPage from '../../components/edu/EnglishVocabularyPage';

export const metadata: Metadata = {
  title: 'Từ vựng tiếng Anh cho bé',
  description:
    'Trang học từ vựng tiếng Anh cho bé giúp làm quen với các từ cơ bản, ghi nhớ từ mới qua hình ảnh trực quan và hoạt động học tập vui nhộn.',
  alternates: {
    canonical: '/games/english-vocabulary',
  },
  openGraph: {
    title: 'Từ vựng tiếng Anh cho bé | Học Cùng Bé',
    description:
      'Bé học từ vựng tiếng Anh cơ bản qua hình ảnh sinh động, dễ nhớ và phù hợp với lứa tuổi mầm non, tiểu học.',
    url: '/games/english-vocabulary',
    type: 'website',
    images: [
      {
        url: '/og-english-vocabulary.jpg',
        width: 1200,
        height: 630,
        alt: 'Từ vựng tiếng Anh cho bé - Học Cùng Bé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Từ vựng tiếng Anh cho bé | Học Cùng Bé',
    description:
      'Trò chơi và bài học giúp bé làm quen với từ vựng tiếng Anh một cách trực quan và thú vị.',
    images: ['/og-english-vocabulary.jpg'],
  },
};

export default function Page() {
  return <EnglishVocabularyPage />;
}
