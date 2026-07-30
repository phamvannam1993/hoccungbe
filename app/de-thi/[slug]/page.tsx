import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ExamPage from '../../components/edu/ExamPage';
import { nestedExamPath } from '../../lib/examNav';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

type Props = { params: Promise<{ slug: string }> };

async function fetchExam(slug: string) {
  try {
    const res = await fetch(`${API}/api/exams/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<{
      title: string; description?: string; slug: string;
      subject: string; grade: number; semester: number;
      totalPoints: number; timeLimitMinutes?: number;
    }>;
  } catch { return null; }
}

const SUBJECT_LABEL: Record<string, string> = {
  toan: 'Toán', 'tieng-viet': 'Tiếng Việt', 'tieng-anh': 'Tiếng Anh',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exam = await fetchExam(slug);

  // Không tự nối "| Bé Hay Học" — layout de-thi đã có title.template thêm thương hiệu (tránh lặp brand).
  const title = exam ? exam.title : 'Đề thi';

  const description = exam?.description || (exam
    ? `Làm đề kiểm tra "${exam.title}" môn ${SUBJECT_LABEL[exam.subject] ?? exam.subject} lớp ${exam.grade} – tự chấm điểm tức thì tại Bé Hay Học.`
    : 'Đề kiểm tra tiểu học – tự chấm điểm tức thì tại Bé Hay Học.');

  // Đề thuộc bộ URL lồng → canonical trỏ về URL lồng (tránh trùng nội dung 2 URL).
  const nested = nestedExamPath(slug);
  const url = `${SITE}${nested ?? `/de-thi/${slug}`}`;

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
      images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE}/og-home.jpg`] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const exam = await fetchExam(slug);

  // Đề thi không tồn tại → 404 thật (tránh trang trống trả 200).
  if (!exam) notFound();

  const subjectLabel = SUBJECT_LABEL[exam.subject] ?? exam.subject;
  const semesterLabel = exam.semester === 1 ? 'Học kỳ 1' : exam.semester === 2 ? 'Học kỳ 2' : `Học kỳ ${exam.semester}`;

  const jsonLd = exam ? {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: exam.title,
    description: exam.description || `Đề kiểm tra ${exam.title} tại Bé Hay Học`,
    url: `${SITE}/de-thi/${slug}`,
    inLanguage: 'vi-VN',
    educationalLevel: `Lớp ${exam.grade}`,
    about: { '@type': 'Thing', name: SUBJECT_LABEL[exam.subject] ?? exam.subject },
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    provider: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
    timeRequired: exam.timeLimitMinutes ? `PT${exam.timeLimitMinutes}M` : undefined,
  } : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      {/* Nội dung SSR (crawlable) — mô tả đề, tránh trang chỉ có "Đang tải…". */}
      <section className="mx-auto w-full max-w-3xl px-4 pt-6">
        <nav className="mb-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/de-thi" className="hover:text-sky-700">Đề thi</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{exam.title}</span>
        </nav>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{exam.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">Môn {subjectLabel}</span>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">Lớp {exam.grade}</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{semesterLabel}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{exam.totalPoints} điểm</span>
          {exam.timeLimitMinutes ? (
            <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">{exam.timeLimitMinutes} phút</span>
          ) : null}
        </div>
        <p className="mt-4 text-[15px] leading-7 text-slate-600">
          {exam.description
            || `Đề ${exam.title.toLowerCase()} giúp bé ôn luyện và tự kiểm tra kiến thức môn ${subjectLabel} lớp ${exam.grade}. Bé làm bài trực tuyến, hệ thống tự chấm điểm và hiển thị đáp án kèm giải thích sau khi nộp — học lại nhiều lần hoàn toàn miễn phí.`}
        </p>
      </section>

      <ExamPage slug={slug} />
    </>
  );
}
