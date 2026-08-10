import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseTopics } from '../../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical, truncateDescription } from '../../lib/seo';

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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-sky-700">Trang chủ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/bai-tap" className="hover:text-sky-700">Bài tập</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-slate-700">{course.title}</li>
        </ol>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Bài tập {course.title} theo chủ đề
        </h1>
        <p className="mt-3 text-slate-600">
          {topics.length} chủ đề bám sát chương trình {course.title}, tổng hợp từ {totalLessons} bài học. Mỗi chủ đề có
          bộ bài tập 3 mức độ (dễ – trung bình – nâng cao) kèm đáp án và lời giải, bé làm ngay trên web không cần in.
        </p>
      </header>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2">
        {topics.map((t, i) => (
          <li key={t.id}>
            <Link
              href={`${path}/${t.slug}`}
              className="flex h-full flex-col rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-400 hover:shadow"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-sky-600">Chủ đề {i + 1}</span>
              <span className="mt-1 font-bold text-slate-900">Bài tập {t.label}</span>
              <span className="mt-2 text-sm text-slate-500">{t.lessons.length} bài học · 3 mức độ · có đáp án</span>
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-12 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">⭐ Có thể bé thích</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li>
            <Link href={`/khoa-hoc/${courseSlug}`} className="text-sky-700 hover:underline">
              Bài học {course.title}
            </Link>
          </li>
          <li><Link href="/bai-tap" className="text-sky-700 hover:underline">Bài tập các lớp khác</Link></li>
          <li><Link href="/de-thi" className="text-sky-700 hover:underline">Đề thi &amp; kiểm tra có chấm điểm</Link></li>
          <li><Link href="/tro-choi" className="text-sky-700 hover:underline">Trò chơi học tập</Link></li>
        </ul>
      </section>
    </div>
  );
}
