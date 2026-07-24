import PoolFishFirstGradeGame from "./PoolFishFirstGradeGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('pool-fish-first-grade');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="pool-fish-first-grade" />
      <PoolFishFirstGradeGame />
    <GameSeoContent slug="pool-fish-first-grade" />
    </>
  );
}
