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
  'knowledge-race': 'dua-xe-kien-thuc',
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

export function resolveGame(input: string) {
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
      {/* Breadcrumb hiển thị — khớp với BreadcrumbList schema, hỗ trợ điều hướng & SEO. */}
      <nav
        aria-label="Đường dẫn"
        className="mx-auto max-w-6xl px-4 pt-4 pb-4 text-sm text-slate-500 sm:px-6"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <a href="/" className="hover:text-sky-600">Trang chủ</a>
          </li>
          <li aria-hidden="true" className="text-slate-300">›</li>
          <li>
            <a href="/tro-choi" className="hover:text-sky-600">Kho trò chơi</a>
          </li>
          <li aria-hidden="true" className="text-slate-300">›</li>
          <li aria-current="page" className="font-semibold text-slate-700">{game.title}</li>
        </ol>
      </nav>
      {/* SSR block — crawlable by search engines even when the game UI is client-rendered. */}
      <div className="sr-only">
        {/* H1 thật là tiêu đề hiển thị trong component game → dùng h2 ở đây để mỗi trang chỉ có 1 H1. */}
        <h2>{game.title} — Trò chơi giáo dục cho bé | {SITE_NAME}</h2>
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
