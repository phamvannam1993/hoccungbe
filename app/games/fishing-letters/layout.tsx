import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Câu Cá Chữ Cái - Game Học Chữ Cái Tiếng Việt | Bé Hay Học',
  description:
    'Game câu cá chữ cái giúp bé học nhận diện chữ cái, phân biệt chữ hoa/thường, từ hoàn chỉnh qua trò chơi vui nhộn. Có 5 cấp độ, âm thanh TTS, theo dõi tiến độ.',
  keywords: [
    'game học chữ cái',
    'câu cá chữ cái',
    'học tiếng việt cho bé',
    'game tiếng việt',
    'trò chơi giáo dục',
    'học chữ hoa chữ thường',
    'từ hoàn chỉnh',
    'game tư duy cho bé',
    'game học toán tư duy',
  ],
  alternates: {
    canonical: 'https://behayhoc.com/tro-choi/cau-ca-chu-cai',
  },
  openGraph: {
    title: 'Câu Cá Chữ Cái - Game Học Chữ Cái Cho Bé 3-6 Tuổi',
    description:
      'Trò chơi câu cá chữ cái vui nhộn giúp bé học nhận diện chữ cái, từ vựng tiếng Việt qua gameplay hấp dẫn.',
    url: 'https://behayhoc.com/tro-choi/cau-ca-chu-cai',
    type: 'website',
    images: [
      {
        url: 'https://behayhoc.com/og-fishing-letters.jpg',
        width: 1200,
        height: 630,
        alt: 'Trò chơi câu cá chữ cái - Game học chữ cái tiếng Việt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Câu Cá Chữ Cái - Game Học Chữ Cái Cho Bé',
    description:
      'Game học chữ cái tiếng Việt cho bé 3-6 tuổi với âm thanh TTS, 5 cấp độ, và theo dõi tiến độ.',
    images: ['https://behayhoc.com/og-fishing-letters.jpg'],
  },
};

export default function FishingLettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Game',
            name: 'Câu Cá Chữ Cái',
            description:
              'Game câu cá chữ cái giúp bé học nhận diện chữ cái, phân biệt chữ hoa/thường qua trò chơi vui nhộn.',
            url: 'https://behayhoc.com/tro-choi/cau-ca-chu-cai',
            image: 'https://behayhoc.com/og-fishing-letters.jpg',
            applicationCategory: 'EducationalGame',
            inLanguage: 'vi-VN',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '250',
            },
            author: {
              '@type': 'Organization',
              name: 'Bé Hay Học',
              url: 'https://behayhoc.com',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'VND',
              availability: 'https://schema.org/OnlineOnly',
            },
            gamePlayMode: [
              'SinglePlayer',
              'MultiPlayer',
            ],
            genre: ['Educational', 'Puzzle'],
            numberOfPlayers: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 1,
            },
          }),
        }}
      />
      {children}
    </>
  );
}
