import type { Metadata } from 'next';
import LessonDetailPage from '../../components/edu/LessonDetailPage';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Bài học #${id} | Bé Hay Học` };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <LessonDetailPage lessonId={id} />;
}
