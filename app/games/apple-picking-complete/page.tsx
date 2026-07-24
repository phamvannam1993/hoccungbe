import ApplePickingCompleteGame from "./ApplePickingCompleteGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('apple-picking-complete');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="apple-picking-complete" />
      <ApplePickingCompleteGame />
    <GameSeoContent slug="apple-picking-complete" />
    </>
  );
}
