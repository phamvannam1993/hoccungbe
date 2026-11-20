import WordSearchGame from './WordSearchGame';
import { WS_TOPICS } from './data';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';
import { KidCrumb, KidHero, KidShell } from '../../components/seo/kid';

// URL công khai: /tro-choi/tim-tu (rewrite trong next.config.ts → /games/word-search).
export const metadata = gameSeoMeta('word-search');

export default function Page() {
  const vi = WS_TOPICS.filter((t) => t.lang === 'vi').length;
  const en = WS_TOPICS.length - vi;
  return (
    // Huỷ padding ngang của app/games/layout.tsx để bảng 10×10 vẫn có ô ≥ 30px trên điện thoại 360px.
    <div className="-mx-4 sm:-mx-6">
      <GameStructuredData slug="word-search" hideBreadcrumb />
      <KidShell max="4xl">
        <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Kho trò chơi', href: '/tro-choi' }, { label: 'Tìm từ' }]} />
        <KidHero
          emoji="🔍"
          eyebrow="Trò chơi chữ"
          title="Tìm từ ẩn trong bảng chữ"
          tone="purple"
          description={
            <>
              Kéo ngón tay để khoanh các từ bị giấu trong bảng chữ cái. {vi} chủ đề <strong>tiếng Việt có dấu</strong> và {en} chủ đề{' '}
              <strong>tiếng Anh</strong>; bảng <strong>8×8</strong> cho bé mới chơi, <strong>10×10</strong> có thêm đường chéo cho bé giỏi.
            </>
          }
        />
        <WordSearchGame />
        <GameSeoContent slug="word-search" />
      </KidShell>
    </div>
  );
}
