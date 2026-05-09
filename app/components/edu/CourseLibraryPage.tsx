import Link from 'next/link';
import { courseLessonsData } from './data/courseLessonsData';

const mathCourse = courseLessonsData.find(
  (course) => course.slug === 'toan-lop-1-theo-chu-de'
);

const otherCourses = courseLessonsData.filter(
  (course) => course.slug !== 'toan-lop-1-theo-chu-de'
);

function getTypeLabel(type: 'video' | 'game' | 'practice') {
  if (type === 'video') return 'Bài học';
  if (type === 'game') return 'Trò chơi';
  return 'Luyện tập';
}

function getCourseStats(course: (typeof courseLessonsData)[number]) {
  const videoCount = course.lessons.filter((lesson) => lesson.type === 'video').length;
  const gameCount = course.lessons.filter((lesson) => lesson.type === 'game').length;
  const practiceCount = course.lessons.filter((lesson) => lesson.type === 'practice').length;
  const freeCount = course.lessons.filter((lesson) => lesson.isFree).length;

  return {
    videoCount,
    gameCount,
    practiceCount,
    freeCount,
  };
}

export default function CourseLibraryPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
      <div className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-100 sm:rounded-[36px]">
        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[80px] bg-sky-100/70 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-tr-[80px] bg-violet-100/70 blur-2xl" />

          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Thư viện khóa học
            </p>

            <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Bắt đầu với Toán lớp 1 theo chủ đề
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Trước mắt, hệ thống sẽ ưu tiên xây dựng lộ trình Toán lớp 1 theo từng
              chủ đề nhỏ: nhận biết số, so sánh số, sắp xếp số, cộng trừ, tìm số còn
              thiếu và bài toán có lời văn. Mỗi bài học nên ngắn, dễ hiểu, có luyện
              tập và trò chơi củng cố để bé không bị quá tải.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100">
                {courseLessonsData.length} nhóm khóa học
              </span>

              <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 ring-1 ring-violet-100">
                Ưu tiên Toán lớp 1
              </span>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
                Có game + luyện tập
              </span>
            </div>
          </div>
        </div>
      </div>

      {mathCourse && (
        <div className="mt-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">
                Khóa nên bắt đầu trước
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Toán học lớp 1
              </h2>
            </div>

            <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 ring-1 ring-amber-100">
              Lộ trình nền tảng
            </span>
          </div>

          <CourseCard course={mathCourse} featured />
        </div>
      )}

      {otherCourses.length > 0 && (
        <div className="mt-10">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Các nhóm nội dung khác
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Mở rộng kỹ năng cho bé
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {otherCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CourseCard({
  course,
  featured = false,
}: {
  course: (typeof courseLessonsData)[number];
  featured?: boolean;
}) {
  const stats = getCourseStats(course);
  const previewLessons = course.lessons.slice(0, featured ? 6 : 3);

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[30px] ${
        featured ? 'lg:grid lg:grid-cols-[1.05fr_0.95fr]' : ''
      }`}
    >
      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 ring-1 ring-sky-100">
            {course.tag}
          </span>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {course.lessons.length} bài
          </span>
        </div>

        <div className="mt-5 flex items-start gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] text-4xl shadow-lg ${
              featured
                ? 'bg-gradient-to-br from-sky-400 via-cyan-300 to-violet-400'
                : 'bg-slate-50'
            }`}
          >
            {course.emoji}
          </div>

          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {course.title}
            </h3>

            <p className="mt-2 text-sm font-semibold text-violet-700">
              {course.age}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
          {course.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
            <p className="text-xl font-black text-slate-900">{stats.videoCount}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Bài học</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
            <p className="text-xl font-black text-slate-900">{stats.practiceCount}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Luyện tập</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
            <p className="text-xl font-black text-slate-900">{stats.gameCount}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Trò chơi</p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-3 text-center ring-1 ring-emerald-100">
            <p className="text-xl font-black text-emerald-700">{stats.freeCount}</p>
            <p className="mt-1 text-xs font-bold text-emerald-700">Miễn phí</p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl hover:shadow-sky-200 sm:w-auto"
          >
            Xem bài học
          </Link>

          {featured && (
            <Link
              href="/games"
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 sm:w-auto"
            >
              Xem game toán học
            </Link>
          )}
        </div>
      </div>

      {featured && (
        <div className="border-t border-slate-100 bg-slate-50/80 p-5 sm:p-6 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-black tracking-tight text-slate-900">
              Lộ trình đề xuất
            </h4>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
              Học theo thứ tự
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {previewLessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/courses/${course.slug}`}
                className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-black text-sky-700 ring-1 ring-sky-100">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold leading-6 text-slate-900">
                      {lesson.title}
                    </p>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                      {getTypeLabel(lesson.type)}
                    </span>

                    {lesson.isFree && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                        Free
                      </span>
                    )}
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {lesson.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
