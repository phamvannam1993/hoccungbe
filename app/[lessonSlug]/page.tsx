import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LessonDetailPage from '../components/edu/LessonDetailPage';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

type Props = { params: Promise<{ lessonSlug: string }> };

type Lesson = {
  id: number; title: string; slug: string; courseId?: number; topicId?: number;
  shortDescription?: string; description?: string; content?: string; seoDescription?: string;
  topicName?: string; volume?: string; durationMinutes?: number; videoUrl?: string;
  course?: {
    title: string; slug: string; courseType?: string;
    shortDescription?: string; description?: string;
    targetAgeMin?: number; targetAgeMax?: number;
  };
};

type Sibling = { id: number; slug: string; title: string; sortOrder?: number; topicId?: number; isPublished?: boolean };

async function fetchLesson(slug: string): Promise<Lesson | null> {
  try {
    const res = await fetch(`${API}/api/lessons/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as Lesson;
  } catch { return null; }
}

// Danh sách bài (đã xuất bản) trong cùng khóa — nhẹ (~30KB), cache 1h — để dựng internal linking.
async function fetchSiblings(courseId?: number): Promise<Sibling[]> {
  if (!courseId) return [];
  try {
    const res = await fetch(`${API}/api/lessons?courseId=${courseId}&slim=1`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const list = (await res.json()) as Sibling[];
    return (Array.isArray(list) ? list : []).filter((l) => l.isPublished !== false);
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonSlug } = await params;
  const lesson = await fetchLesson(lessonSlug);

  const title = lesson
    ? `${lesson.title}${lesson.course ? ` | ${lesson.course.title}` : ''}`
    : 'Bài học';
  const description = lesson?.seoDescription || lesson?.shortDescription || lesson?.description
    || (lesson ? `Luyện tập bài "${lesson.title}" với bài tập tương tác và trò chơi giáo dục dành cho bé tại Bé Hay Học.` : 'Bài học trực tuyến tương tác dành cho bé tại Bé Hay Học.');
  const url = `${SITE}/${lessonSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Bé Hay Học',
      locale: 'vi_VN',
      images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE}/og-image.jpg`] },
  };
}

// ── Nội dung SSR duy nhất cho từng bài (Google index chắc chắn) ───────────────
// Kết hợp các field thật (seoDescription/content/khóa/độ tuổi/thời lượng) — độc nhất
// theo bài — với khung mô tả 3 mức độ + FAQ hữu ích. Anchor tính duy nhất là
// seoDescription + content (mỗi bài một khác).
function buildSeo(lesson: Lesson) {
  const t = lesson.title;
  const course = lesson.course;
  const ageMin = course?.targetAgeMin;
  const ageMax = course?.targetAgeMax;
  const dur = lesson.durationMinutes || 15;
  const ageText = ageMin && ageMax ? `bé ${ageMin}–${ageMax} tuổi` : 'bé tiểu học';
  const gradeText = course?.title ? course.title.replace(/^.*?(lớp\s*\d+).*$/i, 'lớp $1') : '';

  const intro = lesson.seoDescription
    || lesson.shortDescription
    || lesson.description
    || (lesson.content
      ? `${lesson.content} ${t} là một bài học tương tác trong khóa ${course?.title || 'của Bé Hay Học'}, giúp bé vừa học vừa chơi.`
      : `${t} là bài học tương tác dành cho ${ageText}${course ? `, thuộc khóa ${course.title}` : ''} tại Bé Hay Học.`);

  const willLearn = [
    lesson.content || `Nắm vững kiến thức trọng tâm của "${t}" qua ví dụ trực quan, dễ hiểu.`,
    `Luyện tập ngay với bài tập tương tác: trắc nghiệm, điền vào chỗ trống, nối từ và sắp xếp câu — có phản hồi đúng/sai tức thì.`,
    `Ôn lại những câu làm sai để ghi nhớ lâu hơn, kèm phần thưởng huy hiệu khích lệ bé.`,
  ];

  const faqs = [
    {
      q: `Bài "${t}" dành cho bé lớp mấy?`,
      a: `Bài học phù hợp với ${ageText}${gradeText ? `, tương ứng ${gradeText}` : ''}${course ? `, nằm trong khóa "${course.title}"${course.shortDescription ? ` — ${course.shortDescription}` : ''}` : ''}.`,
    },
    {
      q: `Học bài "${t}" mất bao lâu?`,
      a: `Bài học kéo dài khoảng ${dur} phút, chia thành 3 mức độ từ dễ đến nâng cao. Bé có thể học lại nhiều lần hoàn toàn miễn phí để nắm chắc kiến thức.`,
    },
    {
      q: `Bài "${t}" có những dạng bài tập nào?`,
      a: `Bài gồm nhiều dạng bài tập tương tác như trắc nghiệm, điền vào chỗ trống, nối từ, sắp xếp câu và đếm hình. Sau khi làm, bé được xem đáp án đúng, giải thích và ôn lại những câu còn sai.`,
    },
  ];

  return { intro, willLearn, faqs, dur, ageText };
}

export default async function Page({ params }: Props) {
  const { lessonSlug } = await params;
  const lesson = await fetchLesson(lessonSlug);

  if (!lesson) notFound();

  const seo = buildSeo(lesson);
  const url = `${SITE}/${lessonSlug}`;

  // ── Internal linking: bài trước/sau + bài cùng chủ đề trong khóa ─────────────
  const siblings = await fetchSiblings(lesson.courseId);
  const idx = siblings.findIndex((s) => s.slug === lessonSlug);
  const prevLesson = idx > 0 ? siblings[idx - 1] : null;
  const nextLesson = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const navSlugs = new Set([lessonSlug, prevLesson?.slug, nextLesson?.slug].filter(Boolean));
  const related = siblings
    .filter((s) => !navSlugs.has(s.slug) && lesson.topicId != null && s.topicId === lesson.topicId)
    .slice(0, 4);

  const learningLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: lesson.seoDescription || lesson.description || seo.intro,
    url,
    inLanguage: 'vi-VN',
    educationalLevel: 'Tiểu học',
    timeRequired: `PT${seo.dur}M`,
    isPartOf: lesson.course ? {
      '@type': 'Course',
      name: lesson.course.title,
      url: `${SITE}/khoa-hoc/${lesson.course.slug}`,
    } : undefined,
    provider: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seo.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const videoLd = lesson.videoUrl ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: lesson.title,
    description: seo.intro,
    contentUrl: lesson.videoUrl,
    embedUrl: lesson.videoUrl,
    uploadDate: '2026-01-01',
    thumbnailUrl: [`${SITE}/og-image.jpg`],
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {videoLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      )}

      {/* Interactive lesson (client-rendered) */}
      <LessonDetailPage lessonSlug={lessonSlug} />

      {/* ── Nội dung SEO: render server, HIỂN THỊ, độc nhất từng bài ──────────── */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-16 pt-2">
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 px-6 py-4">
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              <span>📖</span> {lesson.title}
            </h1>
            <p className="mt-0.5 text-sm text-white/90">Giới thiệu &amp; hướng dẫn học bài{lesson.course ? ` · ${lesson.course.title}` : ''}</p>
          </div>

          <div className="px-6 py-6 space-y-6 text-slate-700">
            <p className="text-[15px] leading-7">{seo.intro}</p>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>🎯</span> Bé sẽ học được gì?
              </h3>
              <ul className="space-y-2">
                {seo.willLearn.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-7">
                    <span className="shrink-0 mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>🪜</span> Ba mức độ luyện tập
              </h3>
              <ul className="space-y-2 text-[15px] leading-7">
                <li>🌱 <strong>Làm quen (Dễ):</strong> nhận biết và ghi nhớ kiến thức cơ bản của bài, câu hỏi nhẹ nhàng để bé tự tin bắt đầu.</li>
                <li>🌿 <strong>Luyện tập (Trung bình):</strong> vận dụng kiến thức vừa học vào nhiều dạng bài tập đa dạng hơn.</li>
                <li>🌳 <strong>Thử thách (Nâng cao):</strong> tổng hợp và mở rộng, giúp bé thành thạo và nhớ lâu.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>❓</span> Câu hỏi thường gặp
              </h3>
              <div className="space-y-3">
                {seo.faqs.map((f, i) => (
                  <details key={i} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <summary className="cursor-pointer font-semibold text-slate-900 list-none flex items-center justify-between gap-2">
                      <span>{f.q}</span>
                      <span className="text-slate-400 text-sm">＋</span>
                    </summary>
                    <p className="mt-2 text-[15px] leading-7 text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {lesson.course && (
              <p className="text-sm text-slate-500 pt-2 border-t border-slate-100">
                Bài học nằm trong khóa{' '}
                <Link href={`/khoa-hoc/${lesson.course.slug}`} className="font-semibold text-blue-600 hover:underline">
                  {lesson.course.title}
                </Link>{' '}
                — {seo.ageText}. Tất cả bài học tại Bé Hay Học đều miễn phí và học lại được nhiều lần.
              </p>
            )}
          </div>
        </div>

        {/* ── Điều hướng bài trước / sau (internal linking) ─────────────────── */}
        {(prevLesson || nextLesson) && (
          <nav className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Điều hướng bài học">
            {prevLesson ? (
              <Link
                href={`/${prevLesson.slug}`}
                className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 transition hover:ring-blue-200"
              >
                <span className="shrink-0 text-xl text-blue-500 group-hover:-translate-x-0.5 transition">‹</span>
                <span className="min-w-0">
                  <span className="block text-xs text-slate-400">Bài trước</span>
                  <span className="block truncate font-semibold text-slate-800">{prevLesson.title}</span>
                </span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {nextLesson && (
              <Link
                href={`/${nextLesson.slug}`}
                className="group flex items-center justify-end gap-3 rounded-2xl bg-white px-4 py-3 text-right shadow-sm ring-1 ring-slate-100 transition hover:ring-blue-200"
              >
                <span className="min-w-0">
                  <span className="block text-xs text-slate-400">Bài tiếp theo</span>
                  <span className="block truncate font-semibold text-slate-800">{nextLesson.title}</span>
                </span>
                <span className="shrink-0 text-xl text-blue-500 group-hover:translate-x-0.5 transition">›</span>
              </Link>
            )}
          </nav>
        )}

        {/* ── Bài học cùng chủ đề (internal linking) ────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-5 rounded-3xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-3 text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🔗</span> Bài học cùng chủ đề
            </h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/${r.slug}`}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] text-slate-700 ring-1 ring-slate-100 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span className="text-blue-400">📄</span>
                    <span className="truncate">{r.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
