import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { ENGLISH_ALPHABET } from '../lib/englishAlphabet';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import EnglishAlphabetClient from './EnglishAlphabetClient';

export const revalidate = 86400;

const TITLE = 'Bảng chữ cái tiếng Anh A–Z cho bé (có phát âm)';
const DESCRIPTION =
  'Học bảng chữ cái tiếng Anh A–Z cho trẻ: tên chữ, âm phonics và từ mẫu kèm hình, nghe phát âm chuẩn giọng bản ngữ. Nền tảng để bé bắt đầu tập đọc tiếng Anh. Miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/bang-chu-cai-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bang-chu-cai-tieng-anh'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bảng chữ cái tiếng Anh', item: `${SITE_URL}/bang-chu-cai-tieng-anh` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bảng chữ cái tiếng Anh' }]} />

      <KidHero
        emoji="🔤"
        eyebrow="Tiếng Anh · Nền tảng tập đọc"
        title="Bảng chữ cái tiếng Anh A–Z"
        tone="pink"
        description={
          <>
            Làm quen 26 chữ cái tiếng Anh: <strong>tên chữ</strong>, <strong>âm phonics</strong> và một{' '}
            <strong>từ mẫu</strong> quen thuộc kèm hình. Bé bấm để nghe phát âm chuẩn giọng bản ngữ — bước đầu tiên để tập
            đọc tiếng Anh.
          </>
        }
      />

      <EnglishAlphabetClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp lộ trình đọc" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/phonics-tieng-anh', label: 'Ghép vần đọc tiếng Anh (Phonics)', emoji: '🔉' },
              { href: '/mau-cau-tieng-anh', label: 'Mẫu câu giao tiếp tiếng Anh', emoji: '💬' },
              { href: '/tu-vung-tieng-anh', label: 'Từ vựng tiếng Anh theo chủ đề', emoji: '📚' },
              { href: '/bang-chu-cai', label: 'Bảng chữ cái Tiếng Việt', emoji: '🅰️' },
            ]}
          />
        </KidCard>
      </div>

      <div className="mt-8">
        <KidCard emoji="📝" title={`26 chữ cái với ${ENGLISH_ALPHABET.length} từ mẫu`} tone="green">
          <p className="leading-7 text-slate-600">
            Mỗi chữ đi kèm một từ tiếng Anh bắt đầu bằng chữ đó (A – apple, B – ball, C – cat…) giúp bé vừa nhớ mặt chữ
            vừa mở rộng vốn từ. Hãy cho bé nghe <strong>tên chữ</strong> trước, rồi nghe <strong>âm</strong> khi ghép vần —
            đây chính là cách trẻ em các nước nói tiếng Anh học đọc (phonics).
          </p>
        </KidCard>
      </div>
    </KidShell>
  );
}
