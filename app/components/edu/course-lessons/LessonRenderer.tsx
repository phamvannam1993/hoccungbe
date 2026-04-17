import InteractiveLesson from './InteractiveLesson';
import { interactiveLessonDataMap } from './interactiveLessonData';

type LessonRendererProps = {
  courseSlug: string;
  lessonId: string;
};

function DefaultLesson({ lessonId }: { lessonId: string }) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
        Nội dung đang cập nhật
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
        Bài học {lessonId}
      </h2>
      <p className="mt-3 text-base leading-8 text-slate-600">
        Phần nội dung chi tiết cho bài học này đang được bổ sung thêm.
      </p>
    </div>
  );
}

export default function LessonRenderer({
  courseSlug,
  lessonId,
}: LessonRendererProps) {
  const lessonKey = `${courseSlug}:${lessonId}`;
  const interactiveData = interactiveLessonDataMap[lessonKey];

  if (interactiveData) {
    return <InteractiveLesson data={interactiveData} />;
  }

  return <DefaultLesson lessonId={lessonId} />;
}