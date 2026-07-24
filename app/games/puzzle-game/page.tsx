import PuzzleGame from './PuzzleGame';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('puzzle-game');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="ghep-hinh-rung" />
      <PuzzleGame />
    <GameSeoContent slug="ghep-hinh-rung" />
    </>
  );
}
