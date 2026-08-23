import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { THANH_NGU_GROUPS, totalThanhNgu } from '../lib/thanhNgu';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList } from '../components/seo/kid';
import ThanhNguClient from './ThanhNguClient';

export const revalidate = 86400;

const TITLE = 'Thành ngữ, tục ngữ Việt Nam cho bé (có giải nghĩa)';
const DESCRIPTION =
  `Học ${totalThanhNgu()} câu thành ngữ, tục ngữ Việt Nam cho bé theo chủ đề: chăm chỉ, đoàn kết, biết ơn, sống đẹp. Mỗi câu có giải nghĩa dễ hiểu, ví dụ và nghe đọc. Miễn phí.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/thanh-ngu-tuc-ngu') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/thanh-ngu-tuc-ngu'),
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
      { '@type': 'ListItem', position: 2, name: 'Thành ngữ, tục ngữ', item: `${SITE_URL}/thanh-ngu-tuc-ngu` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Thành ngữ, tục ngữ' }]} />

      <KidHero
        emoji="🧧"
        eyebrow="Tiếng Việt · Văn hóa"
        title="Thành ngữ, tục ngữ cho bé"
        tone="orange"
        description={
          <>
            Học {totalThanhNgu()} câu <strong>thành ngữ, tục ngữ</strong> quen thuộc theo chủ đề (chăm chỉ, đoàn kết, biết
            ơn, sống đẹp). Mỗi câu có <strong>giải nghĩa dễ hiểu, ví dụ</strong> và nghe đọc — vừa giàu vốn từ, vừa học điều hay.
          </>
        }
      />

      <ThanhNguClient />

      <div className="mt-8">
        <KidCard emoji="👉" title="Học tiếp tiếng Việt" tone="blue">
          <KidLinkList
            tone="blue"
            items={[
              { href: '/dong-dao-ca-dao', label: 'Đồng dao, ca dao', emoji: '🎶' },
              { href: '/truyen-co-tich', label: 'Truyện cổ tích Việt Nam', emoji: '📖' },
              { href: '/mo-rong-von-tu', label: 'Mở rộng vốn từ', emoji: '📚' },
              { href: '/luyen-tu-va-cau', label: 'Luyện từ và câu', emoji: '🧩' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
