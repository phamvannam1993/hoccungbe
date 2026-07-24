import GameStructuredData from '../../components/edu/GameStructuredData';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('fishing-letters');

export default function FishingLettersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GameStructuredData slug="fishing-letters" imageUrl="/og-fishing-letters.jpg" />
      {children}
    </>
  );
}
