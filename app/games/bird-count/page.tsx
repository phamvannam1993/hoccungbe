import BirdCountGame from "./BirdCountGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('bird-count');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="bird-count" />
      <BirdCountGame />
    <GameSeoContent slug="bird-count" />
    </>
  );
}
