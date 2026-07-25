import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseDetailPage from '../../components/edu/CourseDetailPage';
import type { ApiCourse, ApiLesson, ApiVolume, ApiTopic } from '../../lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

type Props = { params: Promise<{ slug: string }> };

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (e) {
    console.error('[fetch]', path, e);
    return null;
  }
}

async function fetchCourseBundle(slug: string) {
  const course = await fetchJson<ApiCourse>(`/courses/slug/${slug}`);
  if (!course) return null;
  const [lessons, volumes, topics] = await Promise.all([
    fetchJson<ApiLesson[]>(`/lessons?courseId=${course.id}`),
    fetchJson<ApiVolume[]>(`/volumes?courseId=${course.id}`),
    fetchJson<ApiTopic[]>(`/topics?courseId=${course.id}`),
  ]);
  return {
    course,
    lessons: Array.isArray(lessons) ? lessons : [],
    volumes: Array.isArray(volumes) ? volumes : [],
    topics: Array.isArray(topics) ? topics : [],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchJson<ApiCourse>(`/courses/slug/${slug}`);

  // Layout gốc đã có template "%s | Bé Hay Học" → KHÔNG thêm brand vào title (tránh lặp).
  //  <title> ra: "Toán lớp 1 – Bài học, bài tập và trò chơi miễn phí | Bé Hay Học"
  const title = course
    ? `${course.title} – Bài học, bài tập và trò chơi miễn phí`
    : 'Khóa học';
  const ogTitle = `${title} | Bé Hay Học`; // OG tag riêng, template không áp → thêm brand ở đây.
  const description = course
    ? `Học ${course.title} qua bài giảng ngắn, bài tập tương tác và trò chơi vui nhộn. Có đáp án, ôn lại câu sai và theo dõi tiến độ học miễn phí.`
    : 'Khóa học trực tuyến tương tác dành cho bé tại Bé Hay Học.';
  const url = `${SITE}/khoa-hoc/${slug}`;
  const image = course?.thumbnailUrl || `${SITE}/og-home.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      type: 'article',
      siteName: 'Bé Hay Học',
      locale: 'vi_VN',
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description, images: [image] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const bundle = await fetchCourseBundle(slug);

  if (!bundle) notFound();
  const { course, lessons, volumes, topics } = bundle;

  const jsonLd = course ? {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description || `Khóa học ${course.title} tại Bé Hay Học`,
    url: `${SITE}/khoa-hoc/${slug}`,
    inLanguage: 'vi-VN',
    educationalLevel: 'Tiểu học',
    typicalAgeRange: course.targetAgeMin && course.targetAgeMax
      ? `${course.targetAgeMin}-${course.targetAgeMax}`
      : '3-10',
    isAccessibleForFree: true,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: course.estimatedMinutes ? `PT${course.estimatedMinutes}M` : undefined,
    },
    teaches: course.title,
    numberOfCredits: course.totalLessons,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    provider: { '@type': 'Organization', name: 'Bé Hay Học', url: SITE },
    image: course.thumbnailUrl || `${SITE}/og-home.jpg`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND', availability: 'https://schema.org/InStock' },
  } : null;

  const breadcrumb = course ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Khóa học', item: `${SITE}/khoa-hoc` },
      { '@type': 'ListItem', position: 3, name: course.title, item: `${SITE}/khoa-hoc/${slug}` },
    ],
  } : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      )}
      {breadcrumb && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      )}
      <CourseDetailPage slug={slug} initial={{ course, lessons, volumes, topics }} />
    </>
  );
}
