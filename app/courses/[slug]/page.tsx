import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CourseDetailPage from '../..//components/edu/CourseDetailPage';
import { getCourseBySlug } from '../../components/edu/data/courseLessonsData';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return {
      title: 'Không tìm thấy khóa học',
      description: 'Khóa học bạn đang tìm không tồn tại.',
    };
  }

  return {
    title: `${course.title} | Học Cùng Bé`,
    description: course.description,
    alternates: {
      canonical: `/courses/${course.slug}`,
    },
    openGraph: {
      title: `${course.title} | Học Cùng Bé`,
      description: course.description,
      url: `/courses/${course.slug}`,
      type: 'website',
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailPage slug={slug} />;
}