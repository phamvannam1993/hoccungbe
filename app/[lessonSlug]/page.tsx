import type { Metadata } from 'next';
import LessonDetailPage from '../components/edu/LessonDetailPage';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

type Props = { params: Promise<{ lessonSlug: string }> };

async function fetchLesson(slug: string) {
  try {
    const res = await fetch(`${API}/lessons/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<{
      id: number; title: string; slug: string; description?: string;
      course?: { title: string; slug: string };
    }>;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonSlug } = await params;
  const lesson = await fetchLesson(lessonSlug);

  const title = lesson
    ? `${lesson.title}${lesson.course ? ` | ${lesson.course.title}` : ''} | Bé Hay Học`
    : 'Bài học | Bé Hay Học';
  const description = lesson?.description
    || (lesson ? `Luyện tập ${lesson.title} với bài tập tương tác, trò chơi vui nhộn dành cho bé tại Bé Hay Học.` : 'Bài học trực tuyến tương tác dành cho bé tại Bé Hay Học.');
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

export default async function Page({ params }: Props) {
  const { lessonSlug } = await params;
  const lesson = await fetchLesson(lessonSlug);

  const jsonLd = lesson ? {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: lesson.description || `Bài học ${lesson.title} tại Bé Hay Học`,
    url: `${SITE}/${lessonSlug}`,
    inLanguage: 'vi-VN',
    educationalLevel: 'Tiểu học',
    isPartOf: lesson.course ? {
      '@type': 'Course',
      name: lesson.course.title,
      url: `${SITE}/courses/${lesson.course.slug}`,
    } : undefined,
    provider: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <LessonDetailPage lessonSlug={lessonSlug} />
    </>
  );
}
