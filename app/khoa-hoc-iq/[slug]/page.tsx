import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LessonMap from '../components/LessonMap';
import { getAccess } from '../lib/access';
import { combos, getCourse, grades, summarizeLessons } from '../lib/catalog';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ 'mo-khoa'?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return {
    title: `Khóa ${course.number}: ${course.title} – Toán IQ ${grades.find((g) => g.id === course.grade)?.title.toLowerCase() ?? ''}`,
    description: course.subtitle,
    alternates: { canonical: `/khoa-hoc-iq/${slug}` },
  };
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const expiresAt = (await getAccess())[slug] ?? null;
  const unlocked = expiresAt !== null;
  const needUnlock = (await searchParams)['mo-khoa'] === '1';

  return (
    <LessonMap
      course={course}
      lessons={summarizeLessons(course, unlocked)}
      unlocked={unlocked}
      expiresAt={expiresAt}
      needUnlock={needUnlock}
      comboTitle={combos.find((c) => c.grade === course.grade)?.title}
    />
  );
}
