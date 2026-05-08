import Link from 'next/link';
import { getCourseBySlug } from './data/courseLessonsData';

function getLessonTypeLabel(type: 'video' | 'game' | 'practice') {
  switch (type) {
    case 'video':
      return 'Bài học';
    case 'game':
      return 'Trò chơi';
    case 'practice':
      return 'Luyện tập';
    default:
      return 'Nội dung';
  }
}

function getLessonTypeColor(type: 'video' | 'game' | 'practice') {
  switch (type) {
    case 'video':
      return 'bg-sky-50 text-sky-700 ring-sky-100';
    case 'game':
      return 'bg-violet-50 text-violet-700 ring-violet-100';
    case 'practice':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
    default:
      return 'bg-slate-50 text-slate-700 ring-slate-100';
  }
}

export default function CourseDetailPage({ slug }: { slug: string }) {
  const course = getCourseBySlug(slug);
  if (!course) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
          <div className="text-5xl">📚</div>
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Không tìm thấy khóa học
          </h1>
          <p className="mt-3 text-base leading-8 text-slate-600">
            Khóa học này chưa tồn tại hoặc đã được thay đổi đường dẫn.
          </p>

          <div className="mt-6">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
            >
              Quay lại thư viện khóa học
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
      <div className="rounded-[36px] bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-xl lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Chi tiết khóa học
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/10 text-3xl">
                {course.emoji}
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {course.title}
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">
                    {course.tag}
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">
                    {course.age}
                  </span>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">
                    {course.lessons.length} bài học
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              {course.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition duration-300 hover:bg-white/20"
            >
              Quay lại khóa học
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.88fr]">
        <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Danh sách bài học
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-500">
            Phụ huynh có thể cho bé học theo thứ tự từ cơ bản đến nâng cao để giữ nhịp học ổn định.
          </p>

          <div className="mt-6 space-y-4">
            {course.lessons.map((lesson, index) => (
              <article
                key={lesson.id}
                className="rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-100"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-black text-white">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-xl font-black tracking-tight text-slate-900">
                        {lesson.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${getLessonTypeColor(
                        lesson.type
                      )}`}
                    >
                      {getLessonTypeLabel(lesson.type)}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                      {lesson.duration}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${
                        lesson.isFree
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                          : 'bg-amber-50 text-amber-700 ring-amber-100'
                      }`}
                    >
                      {lesson.isFree ? 'Miễn phí' : 'Khóa nâng cao'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/courses/${course.slug}/lessons/${lesson.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
                  >
                    Bắt đầu bài học
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-7">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Lộ trình gợi ý
            </h3>

            <div className="mt-5 space-y-4">
              {[
                'Cho bé học 1 bài mới mỗi ngày, thời lượng ngắn và đều đặn.',
                'Sau mỗi 2 đến 3 bài mới, nên cho bé ôn tập lại bằng game hoặc bài luyện tập.',
                'Ưu tiên giữ nhịp học vui vẻ, không ép học quá lâu trong một lần.',
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] bg-sky-50 p-6 shadow-sm ring-1 ring-sky-100 lg:p-7">
            <h3 className="text-2xl font-black tracking-tight text-slate-900">
              Hành động nhanh
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/games"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition duration-300 hover:-translate-y-0.5 hover:from-sky-600 hover:to-violet-600 hover:shadow-xl"
              >
                Mở kho trò chơi
              </Link>

              <Link
                href="/progress"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:shadow-md"
              >
                Xem tiến độ học
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
