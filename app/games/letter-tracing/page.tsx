import LetterTracingGame from './LetterTracingGame';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('letter-tracing');

export default function LetterTracingPage() {
  return (
    <>
      <GameStructuredData slug="letter-tracing" imageUrl="/og-letter-tracing.jpg" />
      <LetterTracingGame />
    <GameSeoContent slug="letter-tracing" />
    </>
  );
}
