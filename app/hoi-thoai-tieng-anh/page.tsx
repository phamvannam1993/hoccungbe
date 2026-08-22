import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { DIALOGUES, totalDialogueLines } from '../lib/dialogues';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import DialogueClient from './DialogueClient';

export const revalidate = 86400;

const TITLE = 'Hội thoại tiếng Anh cho bé theo tình huống';
const DESCRIPTION =
  `Học ${DIALOGUES.length} đoạn hội thoại tiếng Anh cho bé theo tình huống: làm quen, ở lớp, ở nhà, đi mua đồ. Nghe cả đoạn giọng bản ngữ kèm nghĩa tiếng Việt. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/hoi-thoai-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/hoi-thoai-tieng-anh'),
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
      { '@type': 'ListItem', position: 2, name: 'Hội thoại tiếng Anh', item: `${SITE_URL}/hoi-thoai-tieng-anh` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Hội thoại tiếng Anh' }]} />

      <KidHero
        emoji="🗣️"
        eyebrow="Tiếng Anh · Giao tiếp"
        title="Hội thoại tiếng Anh theo tình huống"
        tone="sky"
        description={
          <>
            Bé tập <strong>nghe và nói</strong> qua {DIALOGUES.length} đoạn hội thoại quen thuộc: làm quen, ở lớp, ở nhà,
            đi mua đồ… Bấm từng câu để nghe, hoặc <strong>▶️ nghe cả hội thoại</strong> (tiếng Anh → nghĩa tiếng Việt).
          </>
        }
      />

      <DialogueClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Lộ trình học tiếng Anh" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/mau-cau-tieng-anh', label: 'Mẫu câu giao tiếp', emoji: '💬' },
              { href: '/sight-words-tieng-anh', label: 'Sight words – Từ thông dụng', emoji: '⚡' },
              { href: '/bai-hat-tieng-anh', label: 'Bài hát tiếng Anh', emoji: '🎵' },
              { href: '/tu-vung-tieng-anh', label: 'Từ vựng theo chủ đề', emoji: '📚' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
