import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Câu Cá Chữ Cái | 4-6 tuổi | Bé Hay Học 2025',
  description: 'Trò chơi câu cá chữ cái giúp bé chữ cái, phân biệt, ngôn ngữ. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học chữ cái.',
  keywords: ['câu cá', 'chữ cái', 'học chữ', 'ngôn ngữ', 'trò chơi câu cá chữ cái', 'game học chữ cái cho bé', 'fishing letters game'],
  alternates: {
    canonical: 'https://behayhoc.com/tro-choi/cau-ca-chu-cai',
  },
  openGraph: {
    title: 'Câu Cá Chữ Cái | 4-6 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi câu cá chữ cái giúp bé chữ cái, phân biệt, ngôn ngữ. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học chữ cái.',
    url: 'https://behayhoc.com/tro-choi/cau-ca-chu-cai',
    type: 'website',
    images: [
      {
        url: 'https://behayhoc.com/og-fishing-letters.jpg',
        width: 1200,
        height: 630,
        alt: 'Câu Cá Chữ Cái - Bé Hay Học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Câu Cá Chữ Cái | 4-6 tuổi | Bé Hay Học 2025',
    description: 'Trò chơi câu cá chữ cái giúp bé chữ cái, phân biệt, ngôn ngữ. Phù hợp với trẻ 4-6 tuổi. Tải ngay để bé học chữ cái.',
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
