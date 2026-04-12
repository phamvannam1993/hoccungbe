import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseBySlug } from '../../../../components/edu/data/courseLessonsData';
import LessonRenderer from '../../../../components/edu/course-lessons/LessonRenderer';

type PageProps = {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lessonId } = await params;

  const course = getCourseBySlug(slug);
  const lesson = course?.lessons.find((item) => item.id === lessonId);

  if (!course || !lesson) {
    return {
      title: 'Không tìm thấy bài học',
    };
  }

  return {
    title: `${lesson.title} | ${course.title}`,
    description: lesson.description,
  };
}

export default async function CourseLessonDetailPage({ params }: PageProps) {
  const { slug, lessonId } = await params;

  const course = getCourseBySlug(slug);
  const lesson = course?.lessons.find((item) => item.id === lessonId);

  if (!course || !lesson) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
                {course.tag}
              </span>
              <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
                {course.age}
              </span>
              <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
                {lesson.duration}
              </span>
              {lesson.isFree && (
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
                  Miễn phí
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {lesson.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              {lesson.description}
            </p>
          </div>

          <LessonRenderer courseSlug={slug} lessonId={lessonId} />
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Thông tin bài học
            </h3>

            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <span className="font-bold text-slate-900">Khóa học:</span> {course.title}
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <span className="font-bold text-slate-900">Bài học:</span> {lesson.title}
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <span className="font-bold text-slate-900">Thời lượng:</span> {lesson.duration}
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <span className="font-bold text-slate-900">Trạng thái:</span>{' '}
                {lesson.isFree ? 'Miễn phí' : 'Cần mở khóa'}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-sky-50 p-6 shadow-sm ring-1 ring-sky-100">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Điều hướng
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={`/courses/${course.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
              >
                Quay lại danh sách bài học
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
              >
                Về thư viện khóa học
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
