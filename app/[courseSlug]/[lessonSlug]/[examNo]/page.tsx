import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ExamPage from '../../../components/edu/ExamPage';
import {
  SUBJECT_LABEL,
  courseLabel,
  examSlug,
  groupBySeg,
  parseCourseSlug,
  parseExamNo,
} from '../../../lib/examNav';

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com').replace(/\/$/, '');

type Props = { params: Promise<{ courseSlug: string; lessonSlug: string; examNo: string }> };

type ApiExam = {
  title: string; slug: string; subject: string; grade: number; semester: number;
  description?: string; totalPoints: number; timeLimitMinutes?: number;
};

async function fetchExam(slug: string): Promise<ApiExam | null> {
  try {
    const res = await fetch(`${API}/api/exams/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as ApiExam;
  } catch {
    return null;
  }
}

function resolve(courseSlug: string, lessonSlug: string, examNo: string) {
  const course = parseCourseSlug(courseSlug);
  const group = groupBySeg(lessonSlug);
  const n = parseExamNo(examNo);
  if (!course || !group || !n) return null;
  return { course, group, n, slug: examSlug(lessonSlug, courseSlug, n) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug, lessonSlug, examNo } = await params;
  const r = resolve(courseSlug, lessonSlug, examNo);
  if (!r) return { title: 'Không tìm thấy đề thi', robots: { index: false, follow: false } };
  const exam = await fetchExam(r.slug);
  if (!exam) return { title: 'Không tìm thấy đề thi', robots: { index: false, follow: false } };

  const title = exam.title;
  const description = (exam.description
    || `Làm ${exam.title} trực tuyến: có đáp án, lời giải, tự chấm điểm ngay. Ôn tập môn ${SUBJECT_LABEL[r.course.subject]} lớp ${r.course.grade} miễn phí tại Bé Hay Học.`).slice(0, 160);
  const url = `${SITE}/${courseSlug}/${lessonSlug}/de-${r.n}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article', siteName: 'Bé Hay Học', locale: 'vi_VN', images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE}/og-home.jpg`] },
  };
}

export default async function Page({ params }: Props) {
  const { courseSlug, lessonSlug, examNo } = await params;
  const r = resolve(courseSlug, lessonSlug, examNo);
  if (!r) notFound();
  const exam = await fetchExam(r.slug);
  if (!exam) notFound();

  const subjectLabel = SUBJECT_LABEL[r.course.subject] ?? r.course.subject;
  const cLabel = courseLabel(courseSlug);
  const url = `${SITE}/${courseSlug}/${lessonSlug}/de-${r.n}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: exam.title,
    description: exam.description || `Đề kiểm tra ${exam.title} tại Bé Hay Học`,
    url,
    inLanguage: 'vi-VN',
    educationalLevel: `Lớp ${r.course.grade}`,
    about: { '@type': 'Thing', name: subjectLabel },
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    provider: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
    timeRequired: exam.timeLimitMinutes ? `PT${exam.timeLimitMinutes}M` : undefined,
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      { '@type': 'ListItem', position: 2, name: cLabel, item: `${SITE}/khoa-hoc/${courseSlug}` },
      { '@type': 'ListItem', position: 3, name: r.group.short, item: `${SITE}/${courseSlug}/${lessonSlug}` },
      { '@type': 'ListItem', position: 4, name: `Đề ${r.n}`, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <section className="mx-auto w-full max-w-3xl px-4 pt-6">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
          <span className="mx-2">›</span>
          <Link href={`/khoa-hoc/${courseSlug}`} className="hover:text-sky-700">{cLabel}</Link>
          <span className="mx-2">›</span>
          <Link href={`/${courseSlug}/${lessonSlug}`} className="hover:text-sky-700">{r.group.short}</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-700">Đề {r.n}</span>
        </nav>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{exam.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">Môn {subjectLabel}</span>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">Lớp {r.course.grade}</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{r.group.short}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{exam.totalPoints} câu</span>
          {exam.timeLimitMinutes ? (
            <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">{exam.timeLimitMinutes} phút</span>
          ) : null}
        </div>
        <p className="mt-4 text-[15px] leading-7 text-slate-600">
          {exam.description
            || `${exam.title} giúp bé ôn luyện và tự kiểm tra kiến thức môn ${subjectLabel} lớp ${r.course.grade}. Bé làm bài trực tuyến, hệ thống tự chấm điểm và hiển thị đáp án kèm lời giải sau khi nộp — học lại nhiều lần miễn phí.`}
        </p>
      </section>

      <ExamPage slug={r.slug} />

      <section className="mx-auto mt-6 w-full max-w-3xl px-4 pb-8 text-sm font-semibold">
        <Link href={`/${courseSlug}/${lessonSlug}`} className="text-sky-700 hover:underline">← Xem tất cả đề {r.group.short.toLowerCase()} {cLabel}</Link>
        {r.n < 5 ? (
          <Link href={`/${courseSlug}/${lessonSlug}/de-${r.n + 1}`} className="ml-4 text-sky-700 hover:underline">Đề tiếp theo →</Link>
        ) : null}
      </section>
    </>
  );
}
