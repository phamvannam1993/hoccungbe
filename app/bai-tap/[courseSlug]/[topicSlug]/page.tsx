import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopicPractice from '../../TopicPractice';
import {
  DIFFICULTIES,
  getTopic,
  getTopicQuizzes,
  type Difficulty,
  type PracticeQuiz,
  type Topic,
  type TopicCourse,
} from '../../../lib/topicSeo';
import { SITE_NAME, SITE_URL, canonical, truncateDescription } from '../../../lib/seo';

// Landing page bài tập theo CHỦ ĐỀ — bắt các truy vấn dạng
// "bài tập phép cộng trong phạm vi 10", "bài tập xem đồng hồ lớp 3".
//
// Nội dung mỗi trang là câu hỏi THẬT rút từ quiz của các bài trong chủ đề
// (xem getTopicQuizzes), nên không có hai trang nào trùng nội dung.

export const revalidate = 86400;

type Props = { params: Promise<{ courseSlug: string; topicSlug: string }> };

function pageTitle(course: TopicCourse, topic: Topic): string {
  return `Bài tập ${topic.label} – ${course.title} (có đáp án)`;
}

function pageDescription(course: TopicCourse, topic: Topic, total: number): string {
  return truncateDescription(
    `${total} bài tập ${topic.label} (${course.title}) từ dễ đến nâng cao, có đáp án và lời giải. ` +
      `Bé làm trực tiếp trên web, chấm ngay, kèm ${topic.lessons.length} bài học và phiếu bài tập in được.`,
  );
}

function countQuizzes(quizzes: Record<Difficulty, PracticeQuiz[]>): number {
  return DIFFICULTIES.reduce((n, d) => n + quizzes[d.key].length, 0);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug, topicSlug } = await params;
  const data = await getTopic(courseSlug, topicSlug);
  if (!data) return { title: 'Bài tập', robots: { index: false, follow: false } };

  const { course, topic } = data;
  // Đếm câu THẬT chứ không ghi cứng 30: nhiều chủ đề chỉ đủ 21–27 câu sau khi lọc,
  // và description hứa sai số lượng là tự hạ chất lượng snippet trên Google.
  // Các fetch bên dưới trùng với fetch của Page nên Next tái dùng cache, không gọi API hai lần.
  const total = countQuizzes(await getTopicQuizzes(topic));
  if (total === 0) return { title: 'Bài tập', robots: { index: false, follow: false } };

  const title = pageTitle(course, topic);
  const description = pageDescription(course, topic, total);
  const url = canonical(`/bai-tap/${courseSlug}/${topicSlug}`);
  const image = `${SITE_URL}/og-home.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: 'article',
      siteName: SITE_NAME,
      locale: 'vi_VN',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function Page({ params }: Props) {
  const { courseSlug, topicSlug } = await params;
  const data = await getTopic(courseSlug, topicSlug);
  if (!data) notFound();

  const { course, topic, siblings } = data;
  const quizzes = await getTopicQuizzes(topic);
  const total = countQuizzes(quizzes);

  // Chủ đề chưa có câu hỏi nào → không dựng trang rỗng (tránh trang mỏng bị Google
  // đánh giá thấp và kéo tụt chất lượng chung của tên miền).
  if (total === 0) notFound();

  const idx = siblings.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const path = `/bai-tap/${courseSlug}/${topicSlug}`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Bài tập', item: `${SITE_URL}/bai-tap` },
      { '@type': 'ListItem', position: 3, name: course.title, item: `${SITE_URL}/bai-tap/${courseSlug}` },
      { '@type': 'ListItem', position: 4, name: `Bài tập ${topic.label}`, item: `${SITE_URL}${path}` },
    ],
  };

  // Schema Quiz: khai báo đúng số câu và mức độ để Google hiểu đây là học liệu
  // luyện tập thật, không phải trang danh mục.
  const quizLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: pageTitle(course, topic),
    url: `${SITE_URL}${path}`,
    inLanguage: 'vi-VN',
    educationalLevel: 'Tiểu học',
    learningResourceType: 'Practice problem set',
    isAccessibleForFree: true,
    about: { '@type': 'Thing', name: topic.label },
    educationalAlignment: {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: course.title,
    },
    numberOfQuestions: total,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-sky-700">Trang chủ</Link></li>
          <li aria-hidden>›</li>
          <li><Link href="/bai-tap" className="hover:text-sky-700">Bài tập</Link></li>
          <li aria-hidden>›</li>
          <li><Link href={`/bai-tap/${courseSlug}`} className="hover:text-sky-700">{course.title}</Link></li>
          <li aria-hidden>›</li>
          <li className="font-medium text-slate-700">{topic.label}</li>
        </ol>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Bài tập {topic.label} – {course.title}
        </h1>
        <p className="mt-3 text-slate-600">
          Tổng hợp <strong>{total} câu bài tập {topic.label.toLowerCase()}</strong> của {course.title}, chia theo{' '}
          {DIFFICULTIES.length} mức độ từ dễ đến nâng cao. Mỗi câu đều có đáp án và lời giải ngắn gọn, bé bấm chọn là
          biết đúng sai ngay. Bộ câu hỏi được lấy từ {topic.lessons.length} bài học trong chủ đề nên phủ đều kiến thức,
          phù hợp để ôn tập tại nhà hoặc làm phiếu luyện cuối tuần.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm">
          {DIFFICULTIES.filter((d) => quizzes[d.key].length > 0).map((d) => (
            <li key={d.key}>
              <a href={`#muc-${d.key}`} className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-sky-100 hover:text-sky-800">
                {quizzes[d.key].length} câu mức {d.label.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <section className="mt-8 rounded-2xl border-2 border-sky-100 bg-sky-50/60 p-4">
        <h2 className="text-lg font-bold text-slate-900">Các bài học trong chủ đề {topic.label}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Nếu bé làm sai nhiều, hãy quay lại học kỹ từng bài rồi luyện tập tiếp.
        </p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {topic.lessons.map((l) => (
            <li key={l.id}>
              <Link
                href={`/${course.slug}/${l.slug}`}
                className="block rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:text-sky-700"
              >
                {l.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10">
        <TopicPractice quizzes={quizzes} />
      </div>

      {/* Khối điều hướng cuối trang: giữ bé ở lại site và giúp Google crawl sâu hơn. */}
      <section className="mt-12 rounded-2xl border-2 border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">📚 Học tiếp</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {prev && (
            <li>
              <Link href={`/bai-tap/${courseSlug}/${prev.slug}`} className="text-sky-700 hover:underline">
                ← Bài tập {prev.label}
              </Link>
            </li>
          )}
          {next && (
            <li>
              <Link href={`/bai-tap/${courseSlug}/${next.slug}`} className="text-sky-700 hover:underline">
                Bài tập {next.label} →
              </Link>
            </li>
          )}
          <li>
            <Link href={`/khoa-hoc/${courseSlug}`} className="text-sky-700 hover:underline">
              Toàn bộ bài học {course.title}
            </Link>
          </li>
          <li>
            <Link href={`/bai-tap/${courseSlug}`} className="text-sky-700 hover:underline">
              Tất cả chủ đề bài tập {course.title}
            </Link>
          </li>
          <li>
            <Link href={`/phieu-bai-tap/${topic.lessons[0].slug}/ca-bai`} className="text-sky-700 hover:underline">
              Phiếu bài tập in được (PDF)
            </Link>
          </li>
          <li>
            <Link href="/de-thi" className="text-sky-700 hover:underline">
              Đề thi &amp; kiểm tra có chấm điểm
            </Link>
          </li>
          <li>
            <Link href="/tro-choi" className="text-sky-700 hover:underline">
              Trò chơi học tập liên quan
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
