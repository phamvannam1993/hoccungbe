import QuizPlayPage from '../../../../components/edu/QuizPlayPage';

type Props = { params: Promise<{ id: string; exercise: string }> };

export default async function Page({ params }: Props) {
  const { id, exercise } = await params;
  return <QuizPlayPage lessonId={id} exerciseNumber={Number(exercise)} />;
}
