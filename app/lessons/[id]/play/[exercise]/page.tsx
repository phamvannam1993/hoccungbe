import type { Metadata } from 'next';
import QuizPlayPage from '../../../../components/edu/QuizPlayPage';
import CurrentChildBar from '../../../../components/edu/CurrentChildBar';

// Trình chơi bài tập tương tác — không phải trang nội dung, đặt noindex để tránh index nội dung mỏng.
export const metadata: Metadata = {
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

type Props = { params: Promise<{ id: string; exercise: string }> };

export default async function Page({ params }: Props) {
  const { id, exercise } = await params;
  return (
    <>
      <CurrentChildBar />
      <QuizPlayPage lessonId={id} exerciseNumber={Number(exercise)} />
    </>
  );
}
