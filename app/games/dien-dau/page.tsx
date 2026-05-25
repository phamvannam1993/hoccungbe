import type { Metadata } from 'next';
import DiendauGame from './DiendauGame';
import GameStructuredData from '../../components/edu/GameStructuredData';

export const metadata: Metadata = {
  title: 'Điền dấu thanh - Tiếng Việt lớp 2',
  description:
    'Trò chơi điền dấu thanh giúp bé lớp 2 phân biệt dấu hỏi/ngã, sắc/huyền và rèn chính tả tiếng Việt qua các bài tập tương tác vui nhộn.',
  alternates: { canonical: '/games/dien-dau' },
  openGraph: {
    title: 'Điền dấu thanh | Bé Hay Học',
    description:
      'Bé chọn đúng dấu thanh cho từ trong câu — phân biệt hỏi/ngã, sắc/huyền, rèn chính tả tiếng Việt lớp 2.',
    url: '/games/dien-dau',
    type: 'website',
  },
};

export default function Page() {
  return (
    <>
      <GameStructuredData slug="dien-dau" />
      <DiendauGame />
    </>
  );
}
