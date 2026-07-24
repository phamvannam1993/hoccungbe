import DocVanGhepChuGame from './DocVanGhepChuGame';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('doc-van-ghep-chu');

export default function DocVanGhepChuPage() {
  return (
    <>
      <GameStructuredData slug="doc-van-ghep-chu" />
      <DocVanGhepChuGame />
    <GameSeoContent slug="doc-van-ghep-chu" />
    </>
  );
}
