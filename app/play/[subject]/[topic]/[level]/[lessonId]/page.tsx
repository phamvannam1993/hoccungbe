import GamePlayPage from '../../../../../components/play/GamePlayPage';

type Props = { params: Promise<{ lessonId: string }> };

export default async function Page({ params }: Props) {
  const { lessonId } = await params;
  return <GamePlayPage lessonId={lessonId} />;
}
