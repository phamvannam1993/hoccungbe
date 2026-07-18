import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { parseExerciseParam } from '../../lib/quiz-slug';
import QuizPlayPage from '../../components/edu/QuizPlayPage';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

const DIFF_LABEL: Record<string, string> = {
  easy: 'Bài tập cơ bản',
  medium: 'Bài tập trung bình',
  hard: 'Bài tập nâng cao',
};

type Props = { params: Promise<{ lessonSlug: string; exercise: string }> };

async function fetchLesson(slug: string) {
  try {
    const res = await fetch(`${API}/api/lessons/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<{
      title: string; description?: string;
      course?: { title: string; slug: string };
    }>;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonSlug, exercise } = await params;
  const parsed = parseExerciseParam(exercise);
  const lesson = await fetchLesson(lessonSlug);

  const diffLabel = parsed ? DIFF_LABEL[parsed.difficulty] ?? 'Bài tập' : 'Bài tập';
  const lessonTitle = lesson?.title ?? lessonSlug;
  const title = `${diffLabel} - ${lessonTitle}`;
  const description = `Luyện tập ${diffLabel.toLowerCase()} cho bài "${lessonTitle}" với các câu hỏi tương tác vui nhộn dành cho bé tại Bé Hay Học.`;
  const url = `${SITE}/${lessonSlug}/${exercise}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: false }, // quiz play pages — no indexing
    openGraph: {
      title,
      description,
      url,
      siteName: 'Bé Hay Học',
      locale: 'vi_VN',
      images: [{ url: `${SITE}/og-home.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }: Props) {
  const { lessonSlug, exercise } = await params;
  const parsed = parseExerciseParam(exercise);
  if (!parsed) return notFound();

  return (
    <>
      <QuizPlayPage
        lessonSlug={lessonSlug}
        difficulty={parsed.difficulty as 'easy' | 'medium' | 'hard'}
      />
    </>
  );
}
