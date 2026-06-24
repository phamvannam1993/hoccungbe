import { gamesData } from './data/gamesData';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from '@/app/lib/seo';

// Folder/route-key → public Vietnamese slug. Keep this in sync with next.config.ts rewrites.
const ROUTE_KEY_TO_SLUG: Record<string, string> = {
  'sea-bubble-math': 'toan-bong-bong-bien',
  'bird-count': 'dem-chim',
  'bird-subtraction': 'chim-bay-mat',
  'rabbit-hole': 'tho-vao-hang',
  'rabbit-steal-quantity': 'tho-cap-ca-rot',
  'pool-fish-first-grade': 'ca-trong-ho-boi',
  'apple-picking-complete': 'hai-tao-hoc-toan',
  'train-complete-lessons': 'doan-tau-toan-hoc',
  'number-sequence': 'day-so',
  'column-lift-drag': 'keo-cot-so',
  'fishing-letters': 'cau-ca-chu-cai',
  'missing-letter': 'tim-chu-bi-mat',
  'letter-tracing': 'tap-viet-chu',
  'trace-sentence': 'to-theo-net-cau',
  'doc-van-ghep-chu': 'ghep-chu-thanh-van',
  'bubble-vocabulary': 'bat-bong-tu-vung',
  'puzzle-game': 'ghep-hinh-rung',
};

type GameStructuredDataProps = {
  /** Accepts English folder name, routeKey, data page key, or canonical Vietnamese slug. */
  slug: string;
  imageUrl?: string;
};

function resolveGame(input: string) {
  const canonicalSlug = ROUTE_KEY_TO_SLUG[input] ?? input;
  return gamesData.find(
    (game) =>
      game.slug === canonicalSlug ||
      game.slug === input ||
      game.page === input ||
      game.page === canonicalSlug ||
      game.id === input,
  );
}

function ageBounds(ageGroup: string) {
  const [min, max] = ageGroup.split('-').map((part) => Number.parseInt(part, 10));
  return {
    min: Number.isFinite(min) ? min : 3,
    max: Number.isFinite(max) ? max : undefined,
  };
}

export default function GameStructuredData({ slug, imageUrl }: GameStructuredDataProps) {
  const game = resolveGame(slug);
  if (!game) return null;

  const url = `${SITE_URL}/tro-choi/${game.slug}`;
  const image = absoluteUrl(imageUrl ?? DEFAULT_OG_IMAGE);
  const { min, max } = ageBounds(game.ageGroup);

  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': ['Game', 'SoftwareApplication', 'LearningResource'],
    name: game.title,
    description: game.description,
    url,
    image,
    inLanguage: 'vi-VN',
    genre: game.category,
    keywords: game.skills.join(', '),
    educationalUse: ['practice', 'game-based learning'],
    learningResourceType: 'Interactive educational game',
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: min,
      ...(max ? { suggestedMaxAge: max } : {}),
      audienceType: 'Trẻ em',
    },
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web Browser',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Kho trò chơi', item: `${SITE_URL}/tro-choi` },
      { '@type': 'ListItem', position: 3, name: game.title, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* SSR block — crawlable by search engines even when the game UI is client-rendered. */}
      <div className="sr-only">
        <h1>{game.title} — Trò chơi giáo dục cho bé | {SITE_NAME}</h1>
        <p>{game.description}</p>
        <p>Dành cho bé {game.age} · Thể loại: {game.category} · Chơi miễn phí trên trình duyệt</p>
        {game.skills.length > 0 && <p>Kỹ năng rèn luyện: {game.skills.join(', ')}</p>}
        <nav aria-label="Breadcrumb">
          <a href={SITE_URL}>Trang chủ</a> › <a href={`${SITE_URL}/tro-choi`}>Kho trò chơi</a> › {game.title}
        </nav>
      </div>
    </>
  );
}
