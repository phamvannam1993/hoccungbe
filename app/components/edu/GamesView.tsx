import Link from 'next/link';
import type { ApiMiniGame } from '../../lib/api';
import { gamesData } from './data/gamesData';
import GamesFilter from './GamesFilter';

async function fetchGames(): Promise<ApiMiniGame[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/mini-games?isActive=true`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    return [];
  }
}

/** Convert static GameItem to ApiMiniGame shape for fallback */
function toApiMiniGame(g: (typeof gamesData)[number]): ApiMiniGame {
  return {
    id: parseInt(g.id.replace('game-', ''), 10) || 0,
    slug: g.slug,
    routeKey: g.page as string,
    title: g.title,
    emoji: g.emoji,
    description: g.shortDescription,
    age: g.age,
    ageGroup: g.ageGroup,
    category: g.category,
    groupKey: g.groupKey,
    difficulty: g.difficulty,
    skills: g.skills,
    sortOrder: 0,
    showOnHomepage: g.isFeatured,
    homepageOrder: 0,
    isActive: g.status === 'ready',
    status: g.status,
  };
}

export default async function GamesView() {
  const apiGames = await fetchGames();
  const games: ApiMiniGame[] = apiGames.length > 0 ? apiGames : gamesData.map(toApiMiniGame);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-white/80 mb-4">
          <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <span className="text-white/50">›</span>
          <span className="text-white font-medium">Kho trò chơi</span>
        </nav>
      </div>

      {/* Client component: header banner + group tabs + game grid */}
      <GamesFilter games={games} />
    </div>
  );
}
