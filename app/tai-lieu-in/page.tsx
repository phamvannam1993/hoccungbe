import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { getPublishedCourses } from '../lib/topicSeo';
import { KidShell, KidCrumb } from '../components/seo/kid';
import { gradeFromKey, type CatalogItem, type Grade } from '../lib/catalog';
import { queryCatalog } from '../lib/catalogFull';
import LocTaiLieu, { type Nhom } from './LocTaiLieu';

// TÀI LIỆU IN — một trang gom mọi thứ in ra giấy: phiếu bài tập miễn phí, phiếu tập viết, gói tài liệu
// trả phí. Lọc theo lớp / môn.
//
// Vì sao là /tai-lieu-in chứ không phải /tai-lieu: /tai-lieu là kho PDF tải lên qua API (có trang chi tiết
// /tai-lieu/[slug], đang noindex). Đổi trang đó thành trang gom sẽ trộn hai tính năng và đụng SEO của nó,
// nên trang gom đứng riêng; /tai-lieu có dải dẫn sang đây.

export const revalidate = 86400;

const PATH = '/tai-lieu-in';
const TITLE = 'Tài liệu in cho bé: phiếu bài tập, phiếu tập viết, bộ đề thi in A4';
const DESCRIPTION =
  'Mọi tài liệu in của Bé Hay Học ở một chỗ, lọc theo lớp và môn: phiếu bài tập Toán, Tiếng Việt, Tiếng Anh miễn phí, vở tập viết ô li, bộ đề giữa kì – cuối kì in A4 kèm đáp án.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical(PATH) },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: canonical(PATH), type: 'website', siteName: SITE_NAME, locale: 'vi_VN', images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const COURSE_SUBJECT: Record<string, CatalogItem['subject']> = { math: 'toan', language: 'tieng-viet', english: 'tieng-anh' };
const ORDER = ['math', 'language', 'english'];
const COURSE_LABEL: Record<string, string> = { math: 'Toán', language: 'Tiếng Việt', english: 'Tiếng Anh' };

export default async function Page() {
  // Phiếu theo từng khóa học (API). Không gọi được API thì vẫn còn thẻ "Phiếu bài tập PDF" chung.
  const courses = await getPublishedCourses().catch(() => []);
  const phieuKhoa: CatalogItem[] = courses
    .map((c) => ({ c, g: gradeFromKey(c.slug.match(/lop-(\d)$/)?.[1] ?? '') }))
    .filter((x): x is { c: (typeof courses)[number]; g: Grade } => x.g != null && x.g > 0)
    .sort((a, b) => a.g - b.g || ORDER.indexOf(a.c.courseType ?? 'math') - ORDER.indexOf(b.c.courseType ?? 'math'))
    .map(({ c, g }) => ({
      href: `/phieu-bai-tap/lop/${c.slug}`,
      title: `Phiếu ${COURSE_LABEL[c.courseType ?? 'math'] ?? ''} lớp ${g}`.replace('  ', ' '),
      desc: 'Mỗi bài trong sách một phiếu, kèm đáp án.',
      emoji: '📄',
      subject: COURSE_SUBJECT[c.courseType ?? 'math'] ?? 'tong-hop',
      kind: 'tai-lieu',
      grades: [g],
    }));

  const all = queryCatalog({ kind: 'tai-lieu' });
  const free = [...all.filter((x) => !x.paid && x.group !== 'viet'), ...phieuKhoa];
  const viet = all.filter((x) => x.group === 'viet');
  const paid = all.filter((x) => x.paid);

  const nhom: Nhom[] = [
    { id: 'mien-phi', title: 'Phiếu bài tập miễn phí', emoji: '📄', desc: 'In hoặc lưu PDF, có đáp án.', items: free },
    { id: 'tap-viet', title: 'Phiếu tập viết', emoji: '✍️', desc: 'Khung ô li 5 mm đúng vở tập viết, nét mờ để bé tô theo.', items: viet },
    { id: 'goi-tai-lieu', title: 'Gói tài liệu in', emoji: '🎁', desc: 'Bộ đề in A4 như đề thật, kèm đáp án — mua một lần, in trong 12 tháng.', items: paid },
  ];

  const crumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tài liệu in', item: `${SITE_URL}${PATH}` },
    ],
  };

  return (
    <KidShell max="5xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tài liệu in' }]} />
      <header className="rounded-[28px] border-2 border-amber-200 bg-white p-5 sm:p-7">
        <p className="kid-display text-xs font-black uppercase tracking-widest text-amber-700">In ra giấy</p>
        <h1 className="kid-display mt-1 text-3xl font-black text-slate-900 sm:text-4xl">🖨️ Tài liệu in</h1>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          Phiếu bài tập, phiếu tập viết và bộ đề in A4 — chọn lớp, chọn môn là ra đúng tờ cần in.
        </p>
      </header>
      <LocTaiLieu nhom={nhom} />
    </KidShell>
  );
}
