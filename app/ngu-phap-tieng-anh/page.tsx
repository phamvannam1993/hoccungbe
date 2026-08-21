import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { GRAMMAR_TOPICS, totalGrammarQuestions } from '../lib/grammar';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import GrammarClient from './GrammarClient';

export const revalidate = 86400;

const TITLE = 'Ngữ pháp tiếng Anh cơ bản cho bé (học qua trò chơi)';
const DESCRIPTION =
  `Học ${GRAMMAR_TOPICS.length} chủ điểm ngữ pháp tiếng Anh cơ bản cho trẻ qua trò chơi chọn đáp án: a/an, số nhiều -s, this/that, to be (am/is/are), can/can't. ${totalGrammarQuestions()} câu có quy tắc, ví dụ nghe được và giải thích. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/ngu-phap-tieng-anh') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/ngu-phap-tieng-anh'),
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
      { '@type': 'ListItem', position: 2, name: 'Ngữ pháp tiếng Anh', item: `${SITE_URL}/ngu-phap-tieng-anh` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Ngữ pháp tiếng Anh' }]} />

      <KidHero
        emoji="🧩"
        eyebrow="Tiếng Anh · Ngữ pháp"
        title="Ngữ pháp tiếng Anh cơ bản"
        tone="green"
        description={
          <>
            Học {GRAMMAR_TOPICS.length} chủ điểm ngữ pháp nền tảng qua <strong>trò chơi chọn đáp án</strong>: a/an, số
            nhiều -s, this/that, to be, can/can’t. Mỗi câu có <strong>quy tắc, ví dụ nghe được và giải thích</strong>, chọn
            đúng là có tiếng khen ngay.
          </>
        }
      />

      <GrammarClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Lộ trình học tiếng Anh" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/mau-cau-tieng-anh', label: 'Mẫu câu giao tiếp', emoji: '💬' },
              { href: '/hoi-thoai-tieng-anh', label: 'Hội thoại tình huống', emoji: '🗣️' },
              { href: '/sight-words-tieng-anh', label: 'Sight words – Từ thông dụng', emoji: '⚡' },
              { href: '/phonics-tieng-anh', label: 'Phonics – Ghép vần đọc', emoji: '🔉' },
              { href: '/tu-vung-tieng-anh', label: 'Từ vựng theo chủ đề', emoji: '📚' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
