import SanChoiTabs from '../components/edu/SanChoiTabs';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidCard } from '../components/seo/kid';
import { getIqPool } from './pool';
import ThuThachIqClient from './ThuThachIqClient';

export const revalidate = 86400;

const TITLE = 'Thử thách IQ mỗi ngày';
const DESCRIPTION =
  'Thử thách IQ mỗi ngày cho bé lớp 1–5: 10 câu đố tư duy, tìm quy luật, suy luận logic từ dễ đến khó, đổi mới lúc 0h. Có lời giải, chấm điểm và thưởng sao miễn phí tại Bé Hay Học.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['thử thách iq', 'câu đố iq cho bé', 'iq mỗi ngày', 'câu đố tư duy', 'tìm quy luật', 'toán tư duy lớp 1', 'đố vui logic cho trẻ'],
  alternates: { canonical: canonical('/thu-thach-iq') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/thu-thach-iq'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

export default function Page() {
  const pool = getIqPool();
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: TITLE, item: `${SITE_URL}/thu-thach-iq` },
    ],
  };

  return (
    <KidShell max="3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Thử thách IQ' }]} />
      <SanChoiTabs className="mb-5" />
      <ThuThachIqClient pool={pool} />

      <div className="mt-8">
        <KidCard emoji="💡" title="Thử thách IQ mỗi ngày là gì?" tone="purple">
          <p className="leading-7 text-slate-600">
            Mỗi ngày bé nhận 10 câu đố tư duy mới: 3 câu dễ để khởi động, 4 câu vừa và 3 câu khó để thử sức.
            Câu hỏi gồm tìm quy luật dãy số, dãy hình, tìm hình khác nhóm, suy luận logic và toán tư duy theo
            từng lớp. Bộ câu hỏi giống nhau cho mọi bạn cùng lớp trong ngày và đổi mới lúc 0 giờ.
          </p>
          <p className="mt-3 leading-7 text-slate-600">
            Muốn luyện thêm? Xem chuyên đề{' '}
            <Link href="/toan-tu-duy" className="font-bold text-[#c81e5b] hover:underline">Toán tư duy lớp 1–5</Link>.
          </p>
        </KidCard>
      </div>
    </KidShell>
  );
}
