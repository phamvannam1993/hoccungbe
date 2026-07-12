import type { Metadata } from 'next';
import ExamPage from '../../components/edu/ExamPage';

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

  const title = exam
    ? `${exam.title} | Bé Hay Học`
    : 'Đề thi | Bé Hay Học';

  const description = exam?.description || (exam
    ? `Làm đề kiểm tra "${exam.title}" môn ${SUBJECT_LABEL[exam.subject] ?? exam.subject} lớp ${exam.grade} – tự chấm điểm tức thì tại Bé Hay Học.`
    : 'Đề kiểm tra tiểu học – tự chấm điểm tức thì tại Bé Hay Học.');

  const url = `${SITE}/de-thi/${slug}`;

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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const exam = await fetchExam(slug);

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
      <ExamPage slug={slug} />
    </>
  );
}
