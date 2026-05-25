import { gamesData } from './data/gamesData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';
const DEFAULT_OG_IMAGE = '/og-image.jpg';

// Maps English route name → Vietnamese page key (matches next.config.ts GAME_MAP)
const EN_TO_PAGE: Record<string, string> = {
  'match-word': 'ghep-tu', 'math-fun': 'toan-vui', 'memory-hunt': 'san-hinh-ghi-nho',
  'english-vocab': 'tu-vung-tieng-anh', 'sound-match': 'ghep-am-thanh', 'quick-pick': 'chon-nhanh',
  'missing-number': 'tim-so-thieu', 'shadow-match': 'ghep-bong', 'color-sort': 'sap-xep-mau',
  'count-animals': 'dem-dong-vat', 'first-letter': 'chu-cai-dau', 'group-match': 'ghep-nhom',
  'opposite-pairs': 'cap-doi-trai-nghia', 'sequence-sort': 'sap-xep-thu-tu', 'odd-one-out': 'tim-ke-le',
  'initial-sound': 'am-dau', 'number-quantity-match': 'so-va-so-luong', 'pattern-complete': 'hoan-thanh-quy-luat',
  'listen-and-do': 'nghe-va-lam', 'mini-maze': 'me-cung-nho', 'half-match': 'ghep-doi',
  'sequence-memory': 'nho-thu-tu', 'rhyme-match': 'ghep-van', 'connect-numbers': 'noi-so',
  'apple-pick': 'hai-tao', 'animal-feed': 'cho-vat-an', 'bubble-math': 'toan-bong-bong',
  'number-line-addition': 'cong-tren-so-do', 'compare-numbers': 'so-sanh-so',
  'number-sequence-write': 'viet-day-so', 'falling-number': 'so-roi', 'where-belongs': 'tim-cho-cho-vat',
  'story-order': 'sap-xep-truyen',
};

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
  const pageKey = EN_TO_PAGE[slug] ?? slug;
  const game = gamesData.find((g) => g.page === pageKey);
  if (!game) return null;

  const url = `${SITE_URL}/tro-choi/${game.page}`;
  const image = toAbsolute(imageUrl ?? DEFAULT_OG_IMAGE);

  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': ['Game', 'SoftwareApplication'],
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
      name: 'Bé Hay Học',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* SSR block — crawlable by Google and AI crawlers */}
      <div className="sr-only">
        <h1>{game.title} — Trò chơi giáo dục cho bé | Bé Hay Học</h1>
        <p>{game.description}</p>
        <p>Dành cho bé {game.age} · Thể loại: {game.category} · Chơi miễn phí trên trình duyệt</p>
        {game.skills && game.skills.length > 0 && (
          <p>Kỹ năng rèn luyện: {game.skills.join(', ')}</p>
        )}
        <nav aria-label="Breadcrumb">
          <a href={SITE_URL}>Trang chủ</a> › <a href={`${SITE_URL}/tro-choi`}>Kho trò chơi</a> › {game.title}
        </nav>
      </div>
    </>
  );
}
