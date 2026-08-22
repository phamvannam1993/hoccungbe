import type { Metadata } from 'next';
import Link from 'next/link';
import { getCourseTopics, getPublishedCourses } from '../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, TONES, type Tone } from '../components/seo/kid';

// Hub gốc của cụm bài tập: /bai-tap → từng khoá → từng chủ đề.
// Bắt truy vấn chung "bài tập tiểu học", "bài tập toán tiếng việt lớp 1 2 3".

export const revalidate = 86400;

const TITLE = 'Bài tập Toán, Tiếng Việt, Tiếng Anh có đáp án';
const DESCRIPTION =
  'Kho bài tập tiểu học theo chủ đề: Toán lớp 1–5, Tiếng Việt lớp 1–3, Tiếng Anh lớp 1. Mỗi chủ đề 3 mức độ kèm đáp án, làm trực tiếp trên web miễn phí.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical('/bai-tap') },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: canonical('/bai-tap'),
    type: 'website',
    siteName: SITE_NAME,
    locale: 'vi_VN',
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [`${SITE_URL}/og-home.jpg`] },
};

const SUBJECT_ORDER = ['math', 'language', 'english'];
const SUBJECT_LABEL: Record<string, string> = {
  math: 'Bài tập Toán',
  language: 'Bài tập Tiếng Việt',
  english: 'Bài tập Tiếng Anh',
};
const SUBJECT_META: Record<string, { emoji: string; tone: Tone }> = {
  math: { emoji: '🧮', tone: 'blue' },
  language: { emoji: '📖', tone: 'pink' },
  english: { emoji: '🔤', tone: 'purple' },
};

export default async function Page() {
  const courses = await getPublishedCourses();

  // Lấy sẵn số chủ đề của từng khoá để thẻ khoá không phải là link "rỗng thông tin",
  // đồng thời tự loại khoá chưa gắn chủ đề nào (trang con sẽ 404).
  const withTopics = (
    await Promise.all(
      courses.map(async (c) => {
        const data = await getCourseTopics(c.slug);
        return { course: c, topicCount: data?.topics.length ?? 0 };
      }),
    )
  ).filter((x) => x.topicCount > 0);

  const groups = SUBJECT_ORDER.map((type) => ({
    type,
    label: SUBJECT_LABEL[type],
    items: withTopics
      .filter((x) => (x.course.courseType ?? 'math') === type)
      .sort((a, b) => a.course.slug.localeCompare(b.course.slug, 'vi')),
  })).filter((g) => g.items.length > 0);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bài tập', item: `${SITE_URL}/bai-tap` },
    ],
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài tập' }]} />

      <KidHero emoji="✏️" eyebrow="Kho bài tập tiểu học" title={TITLE} description={DESCRIPTION} tone="pink" />

      {groups.map((g) => {
        const meta = SUBJECT_META[g.type] ?? { emoji: '📚', tone: 'blue' as Tone };
        return (
          <div className="mt-8" key={g.type}>
            <KidCard emoji={meta.emoji} title={g.label} tone={meta.tone} badge={`${g.items.length} lớp`}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {g.items.map(({ course, topicCount }) => {
                  const t = TONES[meta.tone];
                  return (
                    <li key={course.id}>
                      <Link
                        href={`/bai-tap/${course.slug}`}
                        className="group flex h-full items-center gap-3 rounded-2xl border-2 bg-white p-4 transition hover:-translate-y-0.5"
                        style={{ borderColor: t.border, boxShadow: `0 4px 0 ${t.border}` }}
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-2xl" style={{ background: t.tint }} aria-hidden>{meta.emoji}</span>
                        <span className="min-w-0">
                          <span className="block font-black text-slate-900 kid-display">Bài tập {course.title}</span>
                          <span className="mt-0.5 block text-sm font-semibold" style={{ color: t.c }}>{topicCount} chủ đề · có đáp án</span>
                        </span>
                        <span className="ml-auto text-lg transition group-hover:translate-x-0.5" style={{ color: t.c }} aria-hidden>→</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </KidCard>
          </div>
        );
      })}

      <div className="mt-8">
        <KidCard emoji="⭐" title="Có thể bé thích" tone="yellow">
          <KidLinkList
            tone="yellow"
            items={[
              { href: '/phieu-bai-tap', label: 'Phiếu bài tập in / tải PDF', emoji: '🖨️' },
              { href: '/khoa-hoc', label: 'Toàn bộ khoá học', emoji: '🎒' },
              { href: '/de-thi', label: 'Đề thi & kiểm tra có chấm điểm', emoji: '📝' },
              { href: '/tro-choi', label: 'Trò chơi học tập', emoji: '🎮' },
              { href: '/bai-viet', label: 'Bài viết cho phụ huynh', emoji: '💡' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
