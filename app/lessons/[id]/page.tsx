import type { Metadata } from 'next';
import LessonDetailPage from '../../components/edu/LessonDetailPage';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

type Props = { params: Promise<{ id: string }> };

async function fetchLesson(id: string) {
  try {
    const res = await fetch(`${API}/lessons/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<{
      id: number;
      title: string;
      description?: string;
      slug?: string;
      thumbnailUrl?: string;
      course?: { title: string; slug: string };
    }>;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lesson = await fetchLesson(id);
  if (!lesson) return { title: 'Bài học | Bé Hay Học' };

  const title = `${lesson.title} | Bé Hay Học`;
  const description = lesson.description
    || `Bài học "${lesson.title}" với các bài tập và trò chơi giáo dục tương tác dành cho bé tại Bé Hay Học.`;
  const url = lesson.slug ? `${SITE}/${lesson.slug}` : `${SITE}/lessons/${id}`;
  const image = lesson.thumbnailUrl || `${SITE}/og-image.jpg`;

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
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const lesson = await fetchLesson(id);

  const breadcrumb = lesson ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      ...(lesson.course ? [{ '@type': 'ListItem', position: 2, name: lesson.course.title, item: `${SITE}/khoa-hoc/${lesson.course.slug}` }] : [
        { '@type': 'ListItem', position: 2, name: 'Khóa học', item: `${SITE}/khoa-hoc` },
      ]),
      { '@type': 'ListItem', position: 3, name: lesson.title, item: lesson.slug ? `${SITE}/${lesson.slug}` : `${SITE}/lessons/${id}` },
    ],
  } : null;

  return (
    <>
      {breadcrumb && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}/>
      )}
      <LessonDetailPage lessonId={id} />
    </>
  );
}
