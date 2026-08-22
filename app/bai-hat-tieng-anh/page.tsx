import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { SONGS, totalSongLines } from '../lib/songs';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import SongClient from './SongClient';

export const revalidate = 86400;

const TITLE = 'Bài hát tiếng Anh cho bé (có lời & phát âm)';
const DESCRIPTION =
  `${SONGS.length} bài hát tiếng Anh cho bé: ABC Song, Twinkle Twinkle, Days of the Week… Có lời tiếng Anh, nghĩa tiếng Việt và nghe hát cả bài. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/bai-hat-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bai-hat-tieng-anh'),
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
      { '@type': 'ListItem', position: 2, name: 'Bài hát tiếng Anh', item: `${SITE_URL}/bai-hat-tieng-anh` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài hát tiếng Anh' }]} />

      <KidHero
        emoji="🎵"
        eyebrow="Tiếng Anh · Nghe & hát"
        title="Bài hát tiếng Anh cho bé"
        tone="pink"
        description={
          <>
            {SONGS.length} bài hát và đồng dao quen thuộc (ABC Song, Twinkle Twinkle, Days of the Week…) với{' '}
            <strong>lời tiếng Anh + nghĩa tiếng Việt</strong>. Bấm từng dòng để nghe, hoặc <strong>🎵 hát cả bài</strong> —
            giai điệu giúp bé nhớ từ và phát âm tự nhiên.
          </>
        }
      />

      <SongClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Lộ trình học tiếng Anh" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/bang-chu-cai-tieng-anh', label: 'Bảng chữ cái tiếng Anh A–Z', emoji: '🔤' },
              { href: '/phonics-tieng-anh', label: 'Phonics – Ghép vần đọc', emoji: '🔉' },
              { href: '/sight-words-tieng-anh', label: 'Sight words – Từ thông dụng', emoji: '⚡' },
              { href: '/hoi-thoai-tieng-anh', label: 'Hội thoại tiếng Anh', emoji: '🗣️' },
              { href: '/tu-vung-tieng-anh', label: 'Từ vựng theo chủ đề', emoji: '📚' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
