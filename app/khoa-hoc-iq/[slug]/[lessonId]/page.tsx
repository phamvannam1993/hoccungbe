import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import LessonPlayer from '../../components/LessonPlayer';
import { getUnlockedSlugs } from '../../lib/access';
import { getCourse, getLessons, isFreeLesson } from '../../lib/catalog';

type Props = { params: Promise<{ slug: string; lessonId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const course = getCourse(slug);
  const lesson = getLessons(slug).find((l) => l.id === lessonId);
  if (!course || !lesson) return {};
  return {
    title: `${lesson.title} – Khóa ${course.number}: ${course.title}`,
    robots: { index: false, follow: true },
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonId } = await params;
  const course = getCourse(slug);
  const lessons = getLessons(slug);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (!course || index === -1) notFound();

  // Chỉ gửi câu hỏi xuống trình duyệt khi bài miễn phí hoặc khóa đã được mở.
  const unlocked = (await getUnlockedSlugs()).includes(slug);
  if (!unlocked && !isFreeLesson(course, index)) redirect(`/khoa-hoc-iq/${slug}?mo-khoa=1`);

  const next = lessons[index + 1];

  return (
    <LessonPlayer
      key={lessonId}
      courseSlug={slug}
      courseTitle={`Khóa ${course.number}: ${course.title}`}
      subject={course.subject}
      lesson={lessons[index]}
      lessonNumber={index + 1}
      totalLessons={lessons.length}
      nextLesson={next ? { id: next.id, title: next.title, locked: !unlocked && !isFreeLesson(course, index + 1) } : null}
    />
  );
}
