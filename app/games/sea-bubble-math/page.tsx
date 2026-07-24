import { Metadata } from 'next';
import SeaBubbleMathGame from "./SeaBubbleMathGame";
import GameStructuredData from '@/app/components/edu/GameStructuredData';
import GameSeoContent from '@/app/components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('sea-bubble-math');

export default function Page() {
  return (
    <>
      <GameStructuredData slug="toan-bong-bong-bien" />
      <SeaBubbleMathGame />
    <GameSeoContent slug="toan-bong-bong-bien" />
    </>
  );
}
