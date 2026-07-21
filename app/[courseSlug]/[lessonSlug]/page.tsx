import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import LessonDetailPage from '../../components/edu/LessonDetailPage';
import QuizPlayPage from '../../components/edu/QuizPlayPage';
import { parseExerciseParam } from '../../lib/quiz-slug';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

// Route 2 cấp gộp:
//   /{courseSlug}/{lessonSlug}             → trang bài học (SEO).
//   /{lessonSlug}/{lessonSlug}-{diff}.html → trang làm bài (quiz) — giữ nguyên như cũ.
// Phân biệt bằng đuôi ".html" của segment thứ 2.
type Props = { params: Promise<{ courseSlug: string; lessonSlug: string }> };

// Quiz sau khi rewrite bỏ ".html": /{lessonSlug}/{lessonSlug}-{diff}.
// Nhận diện: segment 2 tách được đuôi -de/-trung-binh/-nang-cao VÀ phần gốc == segment 1.
function isQuiz(seg1: string, seg2: string): boolean {
  const p = parseExerciseParam(seg2);
  return !!p && p.lessonSlug === seg1;
}

const DIFF_LABEL: Record<string, string> = {
  easy: 'Bài tập cơ bản', medium: 'Bài tập trung bình', hard: 'Bài tập nâng cao',
};

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
async function fetchSiblings(courseId?: number): Promise<Sibling[]> {
  if (!courseId) return [];
  try {
    const res = await fetch(`${API}/api/lessons?courseId=${courseId}&slim=1`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const list = (await res.json()) as Sibling[];
    return (Array.isArray(list) ? list : []).filter((l) => l.isPublished !== false);
  } catch { return []; }
}

// ── Nội dung RIÊNG từng bài: lấy câu hỏi luyện tập thật của chính bài (chống trùng template) ──
const QTYPE_LABEL: Record<string, string> = {
  fill_blank: 'điền vào chỗ trống',
  multiple_choice: 'trắc nghiệm nhiều lựa chọn',
  multiple_select: 'chọn nhiều đáp án',
  single_choice: 'trắc nghiệm',
  matching: 'nối',
  ordering: 'sắp xếp thứ tự',
  sorting: 'sắp xếp',
  counting: 'đếm hình',
  true_false: 'đúng / sai',
  drag_drop: 'kéo thả',
};

type QuizSample = { q: string; explanation?: string };

function cleanQuestionText(t?: string): string {
  return (t || '')
    .replace(/\[b\d+\]|\[blank\]|\[_+\]/gi, '___') // marker chỗ trống → ___
    .replace(/\s*\n\s*/g, ' ')
    .trim();
}

async function fetchQuizSamples(lessonId?: number): Promise<{ samples: QuizSample[]; typeLabels: string[] }> {
  if (!lessonId) return { samples: [], typeLabels: [] };
  try {
    const res = await fetch(`${API}/api/quizzes?lessonId=${lessonId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { samples: [], typeLabels: [] };
    const json = await res.json();
    const list = (Array.isArray(json) ? json : (json.data ?? [])) as {
      questionText?: string; explanation?: string; questionType?: string;
    }[];

    const typeLabels = [...new Set(list.map((q) => q.questionType).filter(Boolean) as string[])]
      .map((t) => QTYPE_LABEL[t]).filter(Boolean);

    // Ưu tiên mỗi dạng bài 1 câu (đa dạng), câu có chữ rõ ràng, tránh trùng.
    const seen = new Set<string>();
    const byType = new Map<string, QuizSample>();
    for (const q of list) {
      const text = cleanQuestionText(q.questionText);
      if (text.length < 6 || seen.has(text)) continue;
      seen.add(text);
      const key = q.questionType || 'x';
      if (!byType.has(key)) byType.set(key, { q: text, explanation: q.explanation?.trim() || undefined });
    }
    const samples = [...byType.values()];
    // Bổ sung cho đủ ~4 câu nếu ít dạng.
    for (const q of list) {
      if (samples.length >= 4) break;
      const text = cleanQuestionText(q.questionText);
      if (text.length < 6 || samples.some((s) => s.q === text)) continue;
      samples.push({ q: text, explanation: q.explanation?.trim() || undefined });
    }
    return { samples: samples.slice(0, 4), typeLabels };
  } catch {
    return { samples: [], typeLabels: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;

  // ── QUIZ (segment 2 kết thúc .html) ──
  if (isQuiz(courseSlug, lessonSlug)) {
    const parsed = parseExerciseParam(lessonSlug);
    const lesson = await fetchLesson(courseSlug); // ở URL quiz, segment 1 chính là lessonSlug
    const diffLabel = parsed ? DIFF_LABEL[parsed.difficulty] ?? 'Bài tập' : 'Bài tập';
    const lessonTitle = lesson?.title ?? courseSlug;
    const title = `${diffLabel} - ${lessonTitle}`;
    const description = `Luyện tập ${diffLabel.toLowerCase()} cho bài "${lessonTitle}" với các câu hỏi tương tác vui nhộn dành cho bé tại Bé Hay Học.`;
    const url = `${SITE}/${courseSlug}/${lessonSlug}`;
    return {
      title, description, alternates: { canonical: url }, robots: { index: false },
      openGraph: { title, description, url, siteName: 'Bé Hay Học', locale: 'vi_VN', images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630 }] },
    };
  }

  // ── LESSON DETAIL ──
  const lesson = await fetchLesson(lessonSlug);
  const title = lesson ? `${lesson.title}${lesson.course ? ` | ${lesson.course.title}` : ''}` : 'Bài học';
  const rawDesc = (lesson?.seoDescription || lesson?.shortDescription || lesson?.description
    || (lesson ? `Luyện tập bài "${lesson.title}" với bài tập tương tác và trò chơi giáo dục dành cho bé tại Bé Hay Học.` : 'Bài học trực tuyến tương tác dành cho bé tại Bé Hay Học.'))
    .replace(/\s+/g, ' ').trim();
  // Meta description gọn ~160 ký tự (seoDescription trong DB thường dài 300–450 ký tự).
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}…` : rawDesc;
  const url = `${SITE}/${lesson?.course?.slug || courseSlug}/${lessonSlug}`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', siteName: 'Bé Hay Học', locale: 'vi_VN', images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE}/og-home.jpg`] },
  };
}

function buildSeo(lesson: Lesson, typeLabels: string[] = []) {
  const t = lesson.title;
  const course = lesson.course;
  const ageMin = course?.targetAgeMin;
  const ageMax = course?.targetAgeMax;
  const dur = lesson.durationMinutes || 15;
  const ageText = ageMin && ageMax ? `bé ${ageMin}–${ageMax} tuổi` : 'bé tiểu học';
  const gradeMatch = course?.title?.match(/lớp\s*(\d+)/i);
  const gradeText = gradeMatch ? `lớp ${gradeMatch[1]}` : '';
  const intro = lesson.seoDescription || lesson.shortDescription || lesson.description
    || (lesson.content
      ? `${lesson.content} ${t} là một bài học tương tác trong khóa ${course?.title || 'của Bé Hay Học'}, giúp bé vừa học vừa chơi.`
      : `${t} là bài học tương tác dành cho ${ageText}${course ? `, thuộc khóa ${course.title}` : ''} tại Bé Hay Học.`);
  const typesPhrase = typeLabels.length
    ? typeLabels.slice(0, 5).join(', ')
    : 'trắc nghiệm, điền vào chỗ trống, nối từ và sắp xếp câu';
  const willLearn = [
    lesson.content || `Nắm vững kiến thức trọng tâm của "${t}" qua ví dụ trực quan, dễ hiểu.`,
    `Luyện tập với các dạng bài có trong bài này: ${typesPhrase} — có phản hồi đúng/sai tức thì.`,
    `Ôn lại những câu làm sai để ghi nhớ lâu hơn, kèm phần thưởng huy hiệu khích lệ bé.`,
  ];
  const faqs = [
    { q: `Bài "${t}" dành cho bé lớp mấy?`, a: `Bài học phù hợp với ${ageText}${gradeText ? `, tương ứng ${gradeText}` : ''}${course ? `, nằm trong khóa "${course.title}"${course.shortDescription ? ` — ${course.shortDescription}` : ''}` : ''}.` },
    { q: `Học bài "${t}" mất bao lâu?`, a: `Bài học kéo dài khoảng ${dur} phút, chia thành 3 mức độ từ dễ đến nâng cao. Bé có thể học lại nhiều lần hoàn toàn miễn phí để nắm chắc kiến thức.` },
    { q: `Bài "${t}" có những dạng bài tập nào?`, a: `${typeLabels.length ? `Bài gồm các dạng bài tập tương tác: ${typeLabels.slice(0, 6).join(', ')}.` : 'Bài gồm nhiều dạng bài tập tương tác như trắc nghiệm, điền vào chỗ trống, nối từ và sắp xếp câu.'} Sau khi làm, bé được xem đáp án đúng, giải thích và ôn lại những câu còn sai.` },
  ];
  return { intro, willLearn, faqs, dur, ageText };
}

export default async function Page({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;

  // ── QUIZ ──
  if (isQuiz(courseSlug, lessonSlug)) {
    const parsed = parseExerciseParam(lessonSlug);
    if (!parsed) return notFound();
    return <QuizPlayPage lessonSlug={courseSlug} difficulty={parsed.difficulty as 'easy' | 'medium' | 'hard'} />;
  }

  // ── LESSON DETAIL ──
  const lesson = await fetchLesson(lessonSlug);
  if (!lesson) notFound();

  // Sai khóa trong URL → 301 về đúng /{course}/{lesson}
  const courseSeg = lesson.course?.slug;
  if (courseSeg && courseSeg !== courseSlug) permanentRedirect(`/${courseSeg}/${lessonSlug}`);

  const cSlug = courseSeg || courseSlug;
  const url = `${SITE}/${cSlug}/${lessonSlug}`;
  const lessonHref = (s: string) => `/${cSlug}/${s}`;

  const [quiz, siblings] = await Promise.all([
    fetchQuizSamples(lesson.id),
    fetchSiblings(lesson.courseId),
  ]);
  const seo = buildSeo(lesson, quiz.typeLabels);
  const idx = siblings.findIndex((s) => s.slug === lessonSlug);
  const prevLesson = idx > 0 ? siblings[idx - 1] : null;
  const nextLesson = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const navSlugs = new Set([lessonSlug, prevLesson?.slug, nextLesson?.slug].filter(Boolean));
  const related = siblings
    .filter((s) => !navSlugs.has(s.slug) && lesson.topicId != null && s.topicId === lesson.topicId)
    .slice(0, 4);

  const learningLd = {
    '@context': 'https://schema.org', '@type': 'LearningResource',
    name: lesson.title, description: lesson.seoDescription || lesson.description || seo.intro,
    url, inLanguage: 'vi-VN', educationalLevel: 'Tiểu học', timeRequired: `PT${seo.dur}M`,
    isPartOf: lesson.course ? { '@type': 'Course', name: lesson.course.title, url: `${SITE}/khoa-hoc/${lesson.course.slug}` } : undefined,
    provider: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
  };
  // Không khai báo FAQPage schema: 3 câu FAQ dùng chung cấu trúc trên hàng trăm bài
  // → tránh rủi ro "generic FAQ schema at scale". FAQ vẫn hiển thị cho người đọc (text on-page).
  const videoLd = lesson.videoUrl ? {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: lesson.title, description: seo.intro, contentUrl: lesson.videoUrl, embedUrl: lesson.videoUrl,
    uploadDate: '2026-01-01', thumbnailUrl: [`${SITE}/og-home.jpg`],
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningLd) }} />
      {videoLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />}

      <LessonDetailPage lessonSlug={lessonSlug} />

      <section className="mx-auto w-full max-w-3xl px-4 pb-16 pt-2">
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 px-6 py-4">
            <h1 className="text-lg font-black text-white flex items-center gap-2"><span>📖</span> {lesson.title}</h1>
            <p className="mt-0.5 text-sm text-white/90">Giới thiệu &amp; hướng dẫn học bài{lesson.course ? ` · ${lesson.course.title}` : ''}</p>
          </div>
          <div className="px-6 py-6 space-y-6 text-slate-700">
            <p className="text-[15px] leading-7">{seo.intro}</p>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>🎯</span> Bé sẽ học được gì?</h3>
              <ul className="space-y-2">
                {seo.willLearn.map((item, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-7">
                    <span className="shrink-0 mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {quiz.samples.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>✏️</span> Ví dụ câu hỏi trong bài</h3>
                <ul className="space-y-3">
                  {quiz.samples.map((s, i) => (
                    <li key={i} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                      <p className="text-[15px] leading-7 font-semibold text-slate-800">{s.q}</p>
                      {s.explanation && <p className="mt-1 text-sm leading-7 text-slate-500">💡 {s.explanation}</p>}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-500">Và nhiều câu khác trong 3 mức độ — bé luyện trực tiếp ngay trong bài, hoàn toàn miễn phí.</p>
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>🪜</span> Ba mức độ luyện tập</h3>
              <ul className="space-y-2 text-[15px] leading-7">
                <li>🌱 <strong>Làm quen (Dễ):</strong> nhận biết và ghi nhớ kiến thức cơ bản của bài, câu hỏi nhẹ nhàng để bé tự tin bắt đầu.</li>
                <li>🌿 <strong>Luyện tập (Trung bình):</strong> vận dụng kiến thức vừa học vào nhiều dạng bài tập đa dạng hơn.</li>
                <li>🌳 <strong>Thử thách (Nâng cao):</strong> tổng hợp và mở rộng, giúp bé thành thạo và nhớ lâu.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><span>❓</span> Câu hỏi thường gặp</h3>
              <div className="space-y-3">
                {seo.faqs.map((f, i) => (
                  <details key={i} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <summary className="cursor-pointer font-semibold text-slate-900 list-none flex items-center justify-between gap-2"><span>{f.q}</span><span className="text-slate-400 text-sm">＋</span></summary>
                    <p className="mt-2 text-[15px] leading-7 text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
            {lesson.course && (
              <p className="text-sm text-slate-500 pt-2 border-t border-slate-100">
                Bài học nằm trong khóa{' '}
                <Link href={`/khoa-hoc/${lesson.course.slug}`} className="font-semibold text-blue-600 hover:underline">{lesson.course.title}</Link>{' '}
                — {seo.ageText}. Tất cả bài học tại Bé Hay Học đều miễn phí và học lại được nhiều lần.
              </p>
            )}
          </div>
        </div>

        {(prevLesson || nextLesson) && (
          <nav className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Điều hướng bài học">
            {prevLesson ? (
              <Link href={lessonHref(prevLesson.slug)} className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 transition hover:ring-blue-200">
                <span className="shrink-0 text-xl text-blue-500 group-hover:-translate-x-0.5 transition">‹</span>
                <span className="min-w-0"><span className="block text-xs text-slate-400">Bài trước</span><span className="block truncate font-semibold text-slate-800">{prevLesson.title}</span></span>
              </Link>
            ) : <span className="hidden sm:block" />}
            {nextLesson && (
              <Link href={lessonHref(nextLesson.slug)} className="group flex items-center justify-end gap-3 rounded-2xl bg-white px-4 py-3 text-right shadow-sm ring-1 ring-slate-100 transition hover:ring-blue-200">
                <span className="min-w-0"><span className="block text-xs text-slate-400">Bài tiếp theo</span><span className="block truncate font-semibold text-slate-800">{nextLesson.title}</span></span>
                <span className="shrink-0 text-xl text-blue-500 group-hover:translate-x-0.5 transition">›</span>
              </Link>
            )}
          </nav>
        )}

        {related.length > 0 && (
          <div className="mt-5 rounded-3xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-3 text-base font-bold text-slate-900 flex items-center gap-2"><span>🔗</span> Bài học cùng chủ đề</h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={lessonHref(r.slug)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-[15px] text-slate-700 ring-1 ring-slate-100 transition hover:bg-blue-50 hover:text-blue-700">
                    <span className="text-blue-400">📄</span><span className="truncate">{r.title}</span>
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
