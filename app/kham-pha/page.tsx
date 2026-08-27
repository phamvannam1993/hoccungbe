import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard } from '../components/seo/kid';
import { KHAM_PHA_TOPICS } from '../lib/khampha';
import KhamPhaClient from './KhamPhaClient';

export const revalidate = 86400;

const TITLE = 'Đố vui khám phá — Kiến thức cho bé phát triển trí tuệ';
const DESCRIPTION =
  'Đố vui kiến thức cho bé về động vật, cơ thể người, thiên nhiên, vũ trụ, Việt Nam và thế giới. Mỗi câu có giải thích dễ hiểu và nghe đọc — giúp bé mở mang trí tuệ, ham hiểu biết.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/kham-pha') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/kham-pha'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  const total = KHAM_PHA_TOPICS.reduce((s, t) => s + t.questions.length, 0);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Đố vui khám phá', item: `${SITE_URL}/kham-pha` },
    ],
  };

  return (
    <KidShell max="3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đố vui khám phá' }]} />
      <KidHero
        emoji="🔎"
        eyebrow="Phát triển trí tuệ"
        title="Đố vui khám phá thế giới"
        tone="sky"
        description={
          <>
            {total} câu đố kiến thức thú vị về <strong>động vật, cơ thể người, thiên nhiên, vũ trụ, Việt Nam &amp; thế giới</strong>.
            Mỗi câu có <strong>giải thích dễ hiểu và nghe đọc</strong> — bé vừa chơi vừa mở mang hiểu biết.
          </>
        }
      />
      <KhamPhaClient />

      <div className="mt-8">
        <KidCard emoji="🧠" title="Vì sao nên cho bé chơi đố vui kiến thức?" tone="purple">
          <ul className="space-y-2 leading-7 text-slate-700">
            <li>Nuôi dưỡng <strong>trí tò mò</strong> và tình yêu khám phá — nền tảng của tư duy.</li>
            <li>Mở rộng <strong>vốn hiểu biết</strong> về thế giới ngoài sách vở.</li>
            <li>Rèn <strong>phản xạ suy luận</strong> khi chọn đáp án và đọc giải thích.</li>
            <li>Mỗi câu là một cuộc trò chuyện "vì sao" thú vị giữa bố mẹ và con.</li>
          </ul>
        </KidCard>
      </div>
    </KidShell>
  );
}
