import { notFound, permanentRedirect } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// URL bài học CŨ (phẳng 1 cấp): /{lessonSlug}
// → 301 sang cấu trúc mới /{courseSlug}/{lessonSlug}.
// Đường dẫn 1 cấp không phải bài học → 404.
type Props = { params: Promise<{ courseSlug: string }> };

async function fetchLesson(slug: string) {
  try {
    const res = await fetch(`${API}/api/lessons/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as { slug: string; course?: { slug: string } };
  } catch { return null; }
}

export default async function Page({ params }: Props) {
  const { courseSlug: oldLessonSlug } = await params;
  const lesson = await fetchLesson(oldLessonSlug);
  if (lesson?.course?.slug && lesson.slug) {
    permanentRedirect(`/${lesson.course.slug}/${lesson.slug}`);
  }
  notFound();
}
