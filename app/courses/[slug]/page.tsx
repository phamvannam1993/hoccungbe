import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseDetailPage from '../../components/edu/CourseDetailPage';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

type Props = { params: Promise<{ slug: string }> };

async function fetchCourse(slug: string) {
  try {
    const res = await fetch(`${API}/api/courses/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<{
      title: string; description?: string; shortDescription?: string; slug: string;
      thumbnailUrl?: string; targetAgeMin?: number; targetAgeMax?: number;
      totalLessons?: number; estimatedMinutes?: number;
      lessons?: { title: string; slug: string; topicName?: string }[];
    }>;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchCourse(slug);

  const title = course ? `${course.title} | Bé Hay Học` : 'Khóa học | Bé Hay Học';
  const description = course?.description
    || (course ? `Khám phá khóa học "${course.title}" với các bài học và trò chơi giáo dục tương tác dành cho bé tại Bé Hay Học.` : 'Khóa học trực tuyến dành cho bé tại Bé Hay Học.');
  const url = `${SITE}/khoa-hoc/${slug}`;
  const image = course?.thumbnailUrl || `${SITE}/og-image.jpg`;

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
  const { slug } = await params;
  const course = await fetchCourse(slug);

  if (!course) notFound();

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
    image: course.thumbnailUrl || `${SITE}/og-image.jpg`,
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
      {/* SSR content — crawlable by Google */}
      {course && (
        <div className="sr-only" aria-hidden="true">
          <h1>{course.title}</h1>
          {(course.shortDescription || course.description) && (
            <p>{course.shortDescription || course.description}</p>
          )}
          {course.targetAgeMin && course.targetAgeMax && (
            <p>Dành cho bé {course.targetAgeMin}–{course.targetAgeMax} tuổi</p>
          )}
          {course.totalLessons && <p>Tổng số bài học: {course.totalLessons} bài</p>}
          {course.lessons && course.lessons.length > 0 && (
            <ul>
              {course.lessons.slice(0, 30).map((l) => (
                <li key={l.slug}><a href={`/${l.slug}`}>{l.title}</a></li>
              ))}
            </ul>
          )}
        </div>
      )}

      <CourseDetailPage slug={slug} />
    </>
  );
}
