import RabbitHoleGame from "./RabbitHoleGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('rabbit-hole');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="rabbit-hole" />
      <RabbitHoleGame />
    <GameSeoContent slug="rabbit-hole" />
    </>
  );
}
