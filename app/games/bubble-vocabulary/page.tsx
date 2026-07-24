import BubbleVocabularyClient from './BubbleVocabularyClient';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';

export const metadata = gameSeoMeta('bubble-vocabulary');

export default function BubbleVocabularyPage() {
  return (
    <>
      <GameStructuredData slug="bubble-vocabulary" />
      <BubbleVocabularyClient />
    <GameSeoContent slug="bubble-vocabulary" />
    </>
  );
}
