import MissingLetterGame from './MissingLetterGame';
import GameStructuredData from '@/app/components/edu/GameStructuredData';
import GameSeoContent from '@/app/components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('missing-letter');

export default function MissingLetterGamePage() {
  return (
    <>
      <GameStructuredData slug="tim-chu-bi-mat" />
      <MissingLetterGame />
    <GameSeoContent slug="tim-chu-bi-mat" />
    </>
  );
}
