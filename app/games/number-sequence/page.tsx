import NumberSequenceGame from "./NumberSequenceGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('number-sequence');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="number-sequence" />
      <NumberSequenceGame />
    <GameSeoContent slug="number-sequence" />
    </>
  );
}
