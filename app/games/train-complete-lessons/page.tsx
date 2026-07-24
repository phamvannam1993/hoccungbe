import TrainCompleteLessonsGame from "./TrainCompleteLessonsGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('train-complete-lessons');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="train-complete-lessons" />
      <TrainCompleteLessonsGame />
    <GameSeoContent slug="train-complete-lessons" />
    </>
  );
}
