import LetterTracingGame from './LetterTracingGame';
import GameStructuredData, { resolveGame } from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('letter-tracing');

export default function LetterTracingPage() {
  const g = resolveGame('letter-tracing');
  return (
    <>
      {/* h1 cho trang game (game canvas không có heading) — sr-only để không phá layout */}
      <h1 className="sr-only">{g ? `Game ${g.title}` : 'Trò chơi cho bé'}</h1>
      <GameStructuredData slug="letter-tracing" imageUrl="/og-letter-tracing.jpg" />
      <LetterTracingGame />
    <GameSeoContent slug="letter-tracing" />
    </>
  );
}
