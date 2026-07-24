import ColumnLiftDragGame from "./ColumnLiftDragGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('column-lift-drag');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="column-lift-drag" />
      <ColumnLiftDragGame />
    <GameSeoContent slug="column-lift-drag" />
    </>
  );
}
