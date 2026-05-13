import Script from 'next/script';
import { gamesData } from './data/gamesData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';
const DEFAULT_OG_IMAGE = '/og-image.jpg';

type GameStructuredDataProps = {
  slug: string;
  imageUrl?: string;
};

function toAbsolute(url: string) {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

function suggestedMinAgeFromGroup(ageGroup: string): string {
  return ageGroup.split('-')[0] ?? '3';
}

export default function GameStructuredData({ slug, imageUrl }: GameStructuredDataProps) {
  const game = gamesData.find((g) => g.page === slug);
  if (!game) return null;

  const url = `${SITE_URL}/games/${game.page}`;
  const image = toAbsolute(imageUrl ?? DEFAULT_OG_IMAGE);

  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: game.title,
    description: game.description,
    url,
    image,
    inLanguage: 'vi-VN',
    genre: game.category,
    keywords: game.skills.join(', '),
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: suggestedMinAgeFromGroup(game.ageGroup),
      audienceType: 'Trẻ em',
    },
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Học Cùng Bé',
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Kho trò chơi', item: `${SITE_URL}/games` },
      { '@type': 'ListItem', position: 3, name: game.title, item: url },
    ],
  };

  return (
    <>
      <Script
        id={`game-schema-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <Script
        id={`breadcrumb-schema-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
