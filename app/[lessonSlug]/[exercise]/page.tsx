import { notFound } from 'next/navigation';
import { parseExerciseParam } from '../../lib/quiz-slug';
import QuizPlayPage from '../../components/edu/QuizPlayPage';

type Props = { params: Promise<{ lessonSlug: string; exercise: string }> };

export default async function Page({ params }: Props) {
  const { lessonSlug, exercise } = await params;
  const parsed = parseExerciseParam(exercise);
  if (!parsed) return notFound();

  return (
    <QuizPlayPage
      lessonSlug={lessonSlug}
      difficulty={parsed.difficulty as 'easy' | 'medium' | 'hard'}
    />
  );
}
