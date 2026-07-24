import TraceSentenceGame from "./TraceSentenceGame";
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('trace-sentence');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="to-theo-net-cau" />
      <TraceSentenceGame />
    <GameSeoContent slug="to-theo-net-cau" />
    </>
  );
}
