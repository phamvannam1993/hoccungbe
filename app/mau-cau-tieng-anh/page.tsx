import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { SENTENCE_PATTERNS, totalSentences } from '../lib/sentencePatterns';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import SentenceClient from './SentenceClient';

export const revalidate = 86400;

const TITLE = 'Mẫu câu giao tiếp tiếng Anh cho bé (có phát âm)';
const DESCRIPTION =
  `Học ${totalSentences()} mẫu câu giao tiếp tiếng Anh cho bé: chào hỏi, This is a…, I like…, I can… Nghe cả câu giọng bản ngữ kèm nghĩa tiếng Việt. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/mau-cau-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/mau-cau-tieng-anh'),
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
      { '@type': 'ListItem', position: 2, name: 'Mẫu câu tiếng Anh', item: `${SITE_URL}/mau-cau-tieng-anh` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Mẫu câu tiếng Anh' }]} />

      <KidHero
        emoji="💬"
        eyebrow="Tiếng Anh · Tập nói"
        title="Mẫu câu giao tiếp tiếng Anh"
        tone="orange"
        description={
          <>
            Sau khi biết từ vựng, bé tập <strong>ghép thành câu</strong> với {totalSentences()} mẫu câu quen thuộc:{' '}
            chào hỏi, "This is a…", "I like…", "I can…", nói cảm xúc… Bấm để nghe <strong>cả câu</strong> giọng bản ngữ rồi
            nghĩa tiếng Việt.
          </>
        }
      />

      <SentenceClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Lộ trình học tiếng Anh" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/bang-chu-cai-tieng-anh', label: 'Bảng chữ cái tiếng Anh A–Z', emoji: '🔤' },
              { href: '/phonics-tieng-anh', label: 'Ghép vần đọc tiếng Anh (Phonics)', emoji: '🔉' },
              { href: '/tu-vung-tieng-anh', label: 'Từ vựng tiếng Anh theo chủ đề', emoji: '📚' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
