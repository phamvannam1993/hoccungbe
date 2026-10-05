import type { Metadata } from 'next';
import GameSeoContent from '@/app/components/edu/GameSeoContent';
import GameStructuredData from '@/app/components/edu/GameStructuredData';
import { gameSeoMeta } from '@/app/components/edu/gameMeta';
import VietnameseFirstGradeGame from './VietnameseFirstGradeGame';

export const metadata: Metadata = gameSeoMeta('tieng-viet-lop-1');

export default function VietnameseFirstGradeGamePage() {
  return (
    <>
      <GameStructuredData slug="tieng-viet-lop-1" />
      <VietnameseFirstGradeGame />
      <GameSeoContent slug="tieng-viet-lop-1" />
    </>
  );
}