import WordGuessGame from './WordGuessGame';
import { WORD_GUESS_ITEMS } from './data';
import GameStructuredData from '../../components/edu/GameStructuredData';
import GameSeoContent from '../../components/edu/GameSeoContent';
import { gameSeoMeta } from '../../components/edu/gameMeta';
import { KidCrumb, KidHero, KidShell } from '../../components/seo/kid';

// URL công khai: /tro-choi/nhin-hinh-doan-chu (rewrite trong next.config.ts → /games/word-guess).
export const metadata = gameSeoMeta('word-guess');

export default function Page() {
  return (
    // Huỷ padding ngang của app/games/layout.tsx để khung chơi rộng đủ trên điện thoại 360px.
    <div className="-mx-4 sm:-mx-6">
      <GameStructuredData slug="word-guess" hideBreadcrumb />
      <KidShell max="3xl">
        <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Kho trò chơi', href: '/tro-choi' }, { label: 'Nhìn hình đoán chữ' }]} />
        <KidHero
          emoji="🖼️"
          eyebrow="Trò chơi chữ"
          title="Nhìn hình đoán chữ"
          tone="pink"
          description={
            <>
              Nhìn tranh, chạm các <strong>chữ cái có dấu</strong> để ghép thành tên đúng. {WORD_GUESS_ITEMS.length} hình con vật, trái cây,
              đồ vật — ba cấp <strong>Dễ, Vừa, Khó</strong>, có nút gợi ý và giọng đọc đáp án.
            </>
          }
        />
        <WordGuessGame />
        <GameSeoContent slug="word-guess" />
      </KidShell>
    </div>
  );
}
