import RabbitStealQuantityGame from "./RabbitStealQuantityGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('rabbit-steal-quantity');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="rabbit-steal-quantity" />
      <RabbitStealQuantityGame />
    <GameSeoContent slug="rabbit-steal-quantity" />
    </>
  );
}
