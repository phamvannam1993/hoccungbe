import Link from 'next/link';
import { courseLessonsData } from './data/courseLessonsData';

export default function CourseLibraryPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
          Thư viện khóa học
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Chọn nhóm bài học phù hợp với nhu cầu phát triển của bé
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
          Mỗi nhóm nội dung được sắp xếp rõ ràng theo kỹ năng và độ tuổi để phụ
          huynh có thể bắt đầu từ đúng điểm, không bị rối và cũng không làm bé quá tải.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {courseLessonsData.map((course) => (
          <div
            key={course.slug}
            className="flex h-full flex-col rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 ring-1 ring-sky-100">
                {course.tag}
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {course.lessons.length} bài
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl">{course.emoji}</span>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">
                {course.title}
              </h3>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {course.description}
            </p>

            <div className="mt-4">
              <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-violet-100">
                {course.age}
              </span>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <Link
                href={`/courses/${course.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl hover:shadow-sky-200"
              >
                Xem bài học
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}