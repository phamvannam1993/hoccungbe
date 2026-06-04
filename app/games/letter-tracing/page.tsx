import type { Metadata } from 'next';
import LetterTracingGame from './LetterTracingGame';

export const metadata: Metadata = {
  title: 'Tập viết chữ - Trò chơi luyện viết cho bé',
  description: 'Trò chơi luyện viết chữ tiếng Việt cho bé với ô ly, nét mờ, bút mẫu và phát âm tiếng Việt.',
};

export default function LetterTracingPage() {
  return <LetterTracingGame />;
}
