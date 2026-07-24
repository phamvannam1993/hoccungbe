import BirdSubtractionGame from "./BirdSubtractionGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('bird-subtraction');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="bird-subtraction" />
      <BirdSubtractionGame />
    <GameSeoContent slug="bird-subtraction" />
    </>
  );
}
