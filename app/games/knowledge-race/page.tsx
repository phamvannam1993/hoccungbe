import GameSeoContent from '@/app/components/edu/GameSeoContent';
import GameStructuredData from '@/app/components/edu/GameStructuredData';
import { gameSeoMeta } from '@/app/components/edu/gameMeta';
import KnowledgeRaceGame from './KnowledgeRaceGame';

export const metadata = gameSeoMeta('knowledge-race');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="dua-xe-kien-thuc" />
      <KnowledgeRaceGame />
      <GameSeoContent slug="dua-xe-kien-thuc" />
    </>
  );
}
