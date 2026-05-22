import LessonDetailPage from '../components/edu/LessonDetailPage';

type Props = { params: Promise<{ lessonSlug: string }> };

export default async function Page({ params }: Props) {
  const { lessonSlug } = await params;
  return <LessonDetailPage lessonSlug={lessonSlug} />;
}
