import type { Metadata } from 'next';
import { getCourseTopics, getPublishedCourses } from '../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, KidPills, type Tone } from '../components/seo/kid';

// Hub gốc phiếu bài tập in/PDF: /phieu-bai-tap → từng khoá → phiếu từng bài.
export const revalidate = 86400;

const TITLE = 'Phiếu bài tập Toán, Tiếng Việt, Tiếng Anh (PDF)';
const DESCRIPTION =
  'Tải và in phiếu bài tập tiểu học miễn phí: Toán lớp 1–5, Tiếng Việt lớp 1–3, Tiếng Anh lớp 1. Mỗi bài một phiếu kèm đáp án, in hoặc lưu PDF cho bé luyện ở nhà.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/phieu-bai-tap') },
  openGraph: { title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION, url: canonical('/phieu-bai-tap'), type: 'website', siteName: SITE_NAME, locale: 'vi_VN', images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const SUBJECT_ORDER = ['math', 'language', 'english'];
const SUBJECT_LABEL: Record<string, string> = { math: 'Phiếu bài tập Toán', language: 'Phiếu bài tập Tiếng Việt', english: 'Phiếu bài tập Tiếng Anh' };
const SUBJECT_TONE: Record<string, Tone> = { math: 'pink', language: 'blue', english: 'green' };
const SUBJECT_EMOJI: Record<string, string> = { math: '🔢', language: '📖', english: '🌍' };

export default async function Page() {
  const courses = await getPublishedCourses();
  const withCounts = (
    await Promise.all(
      courses.map(async (c) => {
        const data = await getCourseTopics(c.slug);
        const lessonCount = data?.topics.reduce((n, t) => n + t.lessons.length, 0) ?? 0;
        return { course: c, lessonCount };
      }),
    )
  ).filter((x) => x.lessonCount > 0);

  const groups = SUBJECT_ORDER.map((type) => ({
    type,
    label: SUBJECT_LABEL[type],
    items: withCounts.filter((x) => (x.course.courseType ?? 'math') === type).sort((a, b) => a.course.slug.localeCompare(b.course.slug, 'vi')),
  })).filter((g) => g.items.length > 0);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Phiếu bài tập', item: `${SITE_URL}/phieu-bai-tap` },
    ],
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Phiếu bài tập' }]} />

      <KidHero emoji="📄" eyebrow="Phiếu bài tập PDF" title="Phiếu bài tập tiểu học (PDF, có đáp án)" tone="blue" description={DESCRIPTION} />

      <div className="mt-6 space-y-6">
        {groups.map((g) => (
          <KidCard key={g.type} emoji={SUBJECT_EMOJI[g.type]} title={g.label} tone={SUBJECT_TONE[g.type]} badge={g.items.length}>
            <KidLinkList
              tone={SUBJECT_TONE[g.type]}
              items={g.items.map(({ course, lessonCount }) => ({
                href: `/phieu-bai-tap/lop/${course.slug}`,
                label: `${course.title} · ${lessonCount} bài`,
                emoji: '📄',
              }))}
            />
          </KidCard>
        ))}
      </div>

      <div className="mt-6">
        <KidCard emoji="⭐" title="Có thể bé thích" tone="orange">
          <KidPills
            tone="orange"
            items={[
              { href: '/bai-tap', label: 'Bài tập online' },
              { href: '/de-thi', label: 'Đề thi có chấm điểm' },
              { href: '/khoa-hoc', label: 'Khoá học' },
              { href: '/tro-choi', label: 'Trò chơi' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
