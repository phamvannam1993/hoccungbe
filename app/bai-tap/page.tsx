import type { Metadata } from 'next';
import Link from 'next/link';
import { getCourseTopics, getPublishedCourses } from '../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical } from '../lib/seo';

// Hub gốc của cụm bài tập: /bai-tap → từng khoá → từng chủ đề.
// Bắt truy vấn chung "bài tập tiểu học", "bài tập toán tiếng việt lớp 1 2 3".

export const revalidate = 86400;

const TITLE = 'Bài tập Toán, Tiếng Việt, Tiếng Anh tiểu học có đáp án';
const DESCRIPTION =
  'Kho bài tập tiểu học theo chủ đề: Toán lớp 1–5, Tiếng Việt lớp 1–3, Tiếng Anh lớp 1. Mỗi chủ đề có 3 mức độ từ dễ đến nâng cao, kèm đáp án và lời giải, làm trực tiếp trên web miễn phí.';

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
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-sky-700">Trang chủ</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-slate-700">Bài tập</li>
        </ol>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{TITLE}</h1>
        <p className="mt-3 text-slate-600">{DESCRIPTION}</p>
      </header>

      {groups.map((g) => (
        <section key={g.type} className="mt-10">
          <h2 className="text-xl font-extrabold text-slate-900">{g.label}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {g.items.map(({ course, topicCount }) => (
              <li key={course.id}>
                <Link
                  href={`/bai-tap/${course.slug}`}
                  className="flex h-full flex-col rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-400 hover:shadow"
                >
                  <span className="font-bold text-slate-900">Bài tập {course.title}</span>
                  <span className="mt-2 text-sm text-slate-500">{topicCount} chủ đề · có đáp án</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mt-12 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">⭐ Có thể bé thích</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li><Link href="/phieu-bai-tap" className="text-sky-700 hover:underline">Phiếu bài tập in / tải PDF</Link></li>
          <li><Link href="/khoa-hoc" className="text-sky-700 hover:underline">Toàn bộ khoá học</Link></li>
          <li><Link href="/de-thi" className="text-sky-700 hover:underline">Đề thi &amp; kiểm tra có chấm điểm</Link></li>
          <li><Link href="/tro-choi" className="text-sky-700 hover:underline">Trò chơi học tập</Link></li>
          <li><Link href="/bai-viet" className="text-sky-700 hover:underline">Bài viết cho phụ huynh</Link></li>
        </ul>
      </section>
    </div>
  );
}
