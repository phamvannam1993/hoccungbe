import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import StadiumFrame from './StadiumFrame';
import SanChoiClient from './SanChoiClient';

export const revalidate = 86400;

const PATH = '/san-choi-tri-tue';
const TITLE = 'Sân chơi Trí tuệ — học mà vui, chơi mà giỏi';
const DESCRIPTION =
  'Sân chơi Trí tuệ cho bé tiểu học: mỗi ngày 10 câu thử thách mới (Toán tư duy, Tiếng Việt, Tiếng Anh, Khám phá), nhận ⭐ +100 sao, đua bảng xếp hạng tuần và chơi game nhìn hình đoán chữ, ghép chữ, ghép hình.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical(PATH) },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical(PATH),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: TITLE,
      description: DESCRIPTION,
      url: canonical(PATH),
      inLanguage: 'vi-VN',
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: canonical('/') },
        { '@type': 'ListItem', position: 2, name: 'Sân chơi Trí tuệ', item: canonical(PATH) },
      ],
    },
  ],
};

export default function Page() {
  return (
    <StadiumFrame crumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Sân chơi Trí tuệ' }]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SanChoiClient />
    </StadiumFrame>
  );
}
