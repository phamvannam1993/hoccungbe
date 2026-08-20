import BirdCountGame from "./BirdCountGame";
import GameStructuredData, { resolveGame } from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('bird-count');

export default function Page() {
  const g = resolveGame('bird-count');
  return (
    <>
      {/* h1 cho trang game (game canvas không có heading) — sr-only để không phá layout */}
      <h1 className="sr-only">{g ? `Game ${g.title}` : 'Trò chơi cho bé'}</h1>
      <GameStructuredData slug="bird-count" />
      <BirdCountGame />
    <GameSeoContent slug="bird-count" />
    </>
  );
}
