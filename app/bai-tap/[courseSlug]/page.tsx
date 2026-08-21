import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseTopics } from '../../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical, truncateDescription } from '../../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidLinkList, TONES, type Tone } from '../../components/seo/kid';

const TOPIC_CYCLE: Tone[] = ['blue', 'pink', 'orange', 'purple', 'green', 'sky', 'yellow'];

// Pillar page bài tập của một khoá: "bài tập toán lớp 1" → liệt kê mọi chủ đề.
// Đây là trang gom link cho toàn bộ cụm chủ đề bên dưới.

export const revalidate = 86400;

type Props = { params: Promise<{ courseSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug } = await params;
  const data = await getCourseTopics(courseSlug);
  if (!data || data.topics.length === 0) {
    return { title: 'Bài tập', robots: { index: false, follow: false } };
  }
  const { course, topics } = data;
  const title = `Bài tập ${course.title} theo chủ đề (có đáp án)`;
  const description = truncateDescription(
    `${topics.length} chủ đề bài tập ${course.title} bám sát chương trình, mỗi chủ đề có bài tập 3 mức độ từ dễ đến nâng cao kèm đáp án và lời giải. Làm trực tiếp trên web, miễn phí.`,
  );
  const url = canonical(`/bai-tap/${courseSlug}`);
  const image = `${SITE_URL}/og-home.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: 'website',
      siteName: SITE_NAME,
      locale: 'vi_VN',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function Page({ params }: Props) {
  const { courseSlug } = await params;
  const data = await getCourseTopics(courseSlug);
  if (!data || data.topics.length === 0) notFound();

  const { course, topics } = data;
  const totalLessons = topics.reduce((n, t) => n + t.lessons.length, 0);
  const path = `/bai-tap/${courseSlug}`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bài tập', item: `${SITE_URL}/bai-tap` },
      { '@type': 'ListItem', position: 3, name: course.title, item: `${SITE_URL}${path}` },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Bài tập ${course.title} theo chủ đề`,
    numberOfItems: topics.length,
    itemListElement: topics.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Bài tập ${t.label}`,
      url: `${SITE_URL}${path}/${t.slug}`,
    })),
  };

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài tập', href: '/bai-tap' }, { label: course.title }]} />

      <KidHero
        emoji="🧮"
        eyebrow={`${topics.length} chủ đề · ${totalLessons} bài học`}
        title={`Bài tập ${course.title} theo chủ đề`}
        tone="blue"
        description={
          <>
            {topics.length} chủ đề bám sát chương trình {course.title}, tổng hợp từ {totalLessons} bài học. Mỗi chủ đề có
            bộ bài tập 3 mức độ (dễ – trung bình – nâng cao) kèm đáp án và lời giải, bé làm ngay trên web không cần in.
          </>
        }
      />

      <ol className="mt-8 grid items-stretch gap-4 sm:grid-cols-2">
        {topics.map((t, i) => {
          const tone = TONES[TOPIC_CYCLE[i % TOPIC_CYCLE.length]];
          return (
            <li key={t.id} className="h-full">
              <Link
                href={`${path}/${t.slug}`}
                className="group flex h-full min-h-[136px] flex-col rounded-3xl border-2 bg-white p-4 transition hover:-translate-y-0.5"
                style={{ borderColor: tone.border, boxShadow: `0 5px 0 ${tone.border}` }}
              >
                <span className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-black kid-display" style={{ background: tone.tint, color: tone.c }}>
                  Chủ đề {i + 1}
                </span>
                <span className="mt-2 font-black text-slate-900 kid-display">Bài tập {t.label}</span>
                <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold" style={{ color: tone.c }}>
                  {t.lessons.length} bài học · 3 mức độ · có đáp án
                  <span className="ml-auto text-lg transition group-hover:translate-x-0.5" aria-hidden>→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-8">
        <KidCard emoji="⭐" title="Có thể bé thích" tone="yellow">
          <KidLinkList
            tone="yellow"
            items={[
              { href: `/khoa-hoc/${courseSlug}`, label: `Bài học ${course.title}`, emoji: '🎒' },
              { href: '/bai-tap', label: 'Bài tập các lớp khác', emoji: '✏️' },
              { href: '/de-thi', label: 'Đề thi & kiểm tra có chấm điểm', emoji: '📝' },
              { href: '/tro-choi', label: 'Trò chơi học tập', emoji: '🎮' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
