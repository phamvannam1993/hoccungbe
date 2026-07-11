import GameSeoContent from '../../components/edu/GameSeoContent';
import FishingLettersClient from './FishingLettersClient';

// Metadata và structured data do layout.tsx của thư mục này cung cấp (không lặp lại ở đây).
export default function Page() {
  return (
    <>
      <FishingLettersClient />
      <GameSeoContent slug="fishing-letters" />
    </>
  );
}
