import type { Metadata } from 'next';
import CourseDetailPage from '../../components/edu/CourseDetailPage';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Khóa học | Bé Hay Học`,
    alternates: { canonical: `/courses/${slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CourseDetailPage slug={slug} />;
}