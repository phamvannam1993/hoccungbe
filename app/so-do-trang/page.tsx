import type { Metadata } from 'next';
import { getPublishedCourses } from '../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidPills } from '../components/seo/kid';

// Sơ đồ trang (HTML sitemap): /so-do-trang.
export const revalidate = 86400;

const TITLE = 'Sơ đồ trang – Toàn bộ nội dung Bé Hay Học';
const DESCRIPTION =
  'Sơ đồ trang Bé Hay Học: khóa học, bài tập, phiếu bài tập, đề thi, trò chơi, từ vựng và các chuyên đề học tập cho bé lớp 1–5.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/so-do-trang') },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: canonical('/so-do-trang'), type: 'website', siteName: SITE_NAME, locale: 'vi_VN' },
};

const HUBS = [
  { href: '/khoa-hoc', label: 'Khóa học' },
  { href: '/bai-tap', label: 'Bài tập theo chủ đề' },
  { href: '/phieu-bai-tap', label: 'Phiếu bài tập PDF' },
  { href: '/de-thi', label: 'Đề thi & kiểm tra' },
  { href: '/tro-choi', label: 'Trò chơi học tập' },
  { href: '/tu-vung-tieng-anh', label: 'Từ vựng tiếng Anh' },
  { href: '/cong-cu', label: 'Công cụ miễn phí' },
  { href: '/bai-viet', label: 'Góc phụ huynh' },
];
const CHUYEN_DE = [
  { href: '/toan-tu-duy', label: 'Toán tư duy' },
  { href: '/bang-cuu-chuong', label: 'Bảng cửu chương' },
  { href: '/bang-chu-cai', label: 'Bảng chữ cái' },
  { href: '/luyen-viet-chu', label: 'Luyện viết chữ' },
];
const GRADES = ['1', '2', '3', '4', '5'];

export default async function Page() {
  const courses = await getPublishedCourses();
  const courseItems = [...courses]
    .sort((a, b) => a.slug.localeCompare(b.slug, 'vi'))
    .map((c) => ({ href: `/khoa-hoc/${c.slug}`, label: c.title }));

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Sơ đồ trang', item: `${SITE_URL}/so-do-trang` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sơ đồ trang' }]} />

      <KidHero emoji="🗺️" eyebrow="Điều hướng" title="Sơ đồ trang" tone="sky"
        description="Toàn bộ khu vực nội dung của Bé Hay Học được sắp xếp gọn theo nhóm — bấm để đi tới từng phần." />

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <KidCard emoji="🧭" title="Khu vực chính" tone="sky" badge={HUBS.length}>
          <KidPills items={HUBS} />
        </KidCard>
        <KidCard emoji="🎒" title="Học theo lớp" tone="purple" badge={GRADES.length}>
          <KidPills tone="purple" items={GRADES.map((g) => ({ href: `/lop-${g}`, label: `Lớp ${g}` }))} />
        </KidCard>
        <KidCard emoji="📝" title="Đề thi theo lớp" tone="pink" badge={GRADES.length}>
          <KidPills tone="pink" items={GRADES.map((g) => ({ href: `/de-thi-lop-${g}`, label: `Đề thi lớp ${g}` }))} />
        </KidCard>
        <KidCard emoji="🧠" title="Toán tư duy theo lớp" tone="orange" badge={GRADES.length + 1}>
          <KidPills tone="orange" items={[{ href: '/toan-tu-duy', label: 'Tổng hợp' }, ...GRADES.map((g) => ({ href: `/toan-tu-duy-lop-${g}`, label: `Lớp ${g}` }))]} />
        </KidCard>
        <KidCard emoji="⭐" title="Chuyên đề học tập" tone="green" badge={CHUYEN_DE.length}>
          <KidPills tone="green" items={CHUYEN_DE} />
        </KidCard>
        {courseItems.length > 0 && (
          <div className="sm:col-span-2">
            <KidCard emoji="📚" title="Tất cả khóa học" tone="yellow" badge={courseItems.length}>
              <KidPills tone="yellow" items={courseItems} />
            </KidCard>
          </div>
        )}
      </div>
    </KidShell>
  );
}
