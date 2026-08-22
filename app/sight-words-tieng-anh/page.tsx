import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { SIGHT_WORD_GROUPS, totalSightWords } from '../lib/sightWords';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import SightWordsClient from './SightWordsClient';

export const revalidate = 86400;

const TITLE = 'Sight words – Từ thông dụng tiếng Anh cho bé';
const DESCRIPTION =
  `Học ${totalSightWords()} sight words (từ thông dụng) tiếng Anh cho bé theo cấp độ Dolch: the, and, is, you… Nhận mặt nhanh, nghe phát âm. Giúp bé đọc trôi chảy. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/sight-words-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/sight-words-tieng-anh'),
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
      { '@type': 'ListItem', position: 2, name: 'Sight words tiếng Anh', item: `${SITE_URL}/sight-words-tieng-anh` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sight words tiếng Anh' }]} />

      <KidHero
        emoji="⚡"
        eyebrow="Tiếng Anh · Đọc trôi chảy"
        title="Sight words – Từ thông dụng"
        tone="green"
        description={
          <>
            <strong>Sight words</strong> là những từ xuất hiện nhiều nhất trong sách thiếu nhi (the, and, is, you…). Bé cần{' '}
            <strong>nhận mặt nhanh</strong> mà không phải đánh vần. Học {totalSightWords()} từ theo {SIGHT_WORD_GROUPS.length}{' '}
            cấp độ để đọc câu trôi chảy hơn.
          </>
        }
      />

      <SightWordsClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Lộ trình học tiếng Anh" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/bang-chu-cai-tieng-anh', label: 'Bảng chữ cái tiếng Anh A–Z', emoji: '🔤' },
              { href: '/phonics-tieng-anh', label: 'Phonics – Ghép vần đọc', emoji: '🔉' },
              { href: '/mau-cau-tieng-anh', label: 'Mẫu câu giao tiếp', emoji: '💬' },
              { href: '/hoi-thoai-tieng-anh', label: 'Hội thoại tiếng Anh', emoji: '🗣️' },
              { href: '/bai-hat-tieng-anh', label: 'Bài hát tiếng Anh', emoji: '🎵' },
              { href: '/tu-vung-tieng-anh', label: 'Từ vựng theo chủ đề', emoji: '📚' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
