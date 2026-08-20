import type { ApiCourse, ApiLesson, ApiTopic } from '../../lib/api';
import { KidCard, KidFaq, KidLinkList } from '../../components/seo/kid';

// Nội dung SEO unique cho trang khóa học (SSR, crawlable) — bù cho CourseDetailPage
// vốn chủ yếu là widget tương tác. Mỗi khóa ra một mô tả + chương trình + FAQ khác nhau.
// FAQ hiển thị bằng <details> ĐÚNG với FAQPage schema (không mismatch).

const SUBJECT_LABEL: Record<string, string> = { math: 'Toán', language: 'Tiếng Việt', english: 'Tiếng Anh' };

function gradeFromSlug(slug: string): number | null {
  const m = slug.match(/-lop-(\d)$/);
  return m ? Number(m[1]) : null;
}

export default function CourseSeoContent({
  course,
  topics,
  lessons,
}: {
  course: ApiCourse;
  topics: ApiTopic[];
  lessons: ApiLesson[];
}) {
  const grade = gradeFromSlug(course.slug);
  const subject = SUBJECT_LABEL[course.courseType] ?? '';
  const isMath = course.courseType === 'math';
  const lessonCount = course.totalLessons || lessons.length;
  const topicNames = [...topics].sort((a, b) => a.sortOrder - b.sortOrder).map((t) => t.name);
  const ageMin = course.targetAgeMin || 3;
  const ageMax = course.targetAgeMax || 10;

  const intro =
    course.description?.trim() ||
    `Khóa học ${course.title} tại Bé Hay Học được biên soạn bám sát chương trình giáo dục tiểu học` +
      `${grade ? `, dành cho học sinh lớp ${grade}` : ''}. Khóa gồm ${lessonCount ? `${lessonCount} bài học` : 'nhiều bài học'} ` +
      `${topicNames.length ? `theo ${topicNames.length} chủ đề` : ''}, mỗi bài là một bài giảng ngắn kèm bài tập tương tác có đáp án ` +
      `và trò chơi, giúp bé ${ageMin}–${ageMax} tuổi vừa học vừa chơi, ghi nhớ lâu và tiến bộ thấy rõ.`;

  const faq = [
    {
      q: `Khóa học ${course.title} học những gì?`,
      a: topicNames.length
        ? `${course.title} gồm các chủ đề: ${topicNames.join('; ')}. Mỗi chủ đề có bài giảng ngắn kèm bài tập và trò chơi luyện tập.`
        : `${course.title} gồm nhiều bài học ngắn kèm bài tập tương tác có đáp án và trò chơi giúp bé luyện tập.`,
    },
    {
      q: grade ? `${course.title} dành cho bé lớp mấy?` : `${course.title} dành cho bé mấy tuổi?`,
      a: grade
        ? `Khóa học phù hợp với học sinh lớp ${grade} (khoảng ${ageMin}–${ageMax} tuổi), bám sát chương trình ${subject || 'tiểu học'} lớp ${grade}.`
        : `Khóa học phù hợp với bé khoảng ${ageMin}–${ageMax} tuổi.`,
    },
    {
      q: `Học ${course.title} tại Bé Hay Học có mất phí không?`,
      a: `Bé có thể học ${course.title} miễn phí: xem bài giảng, làm bài tập có đáp án, ôn lại câu sai và theo dõi tiến độ mà không mất phí.`,
    },
  ];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const links = [
    { href: `/bai-tap/${course.slug}`, label: `Bài tập ${course.title}`, emoji: '✏️' },
    ...(isMath ? [{ href: `/phieu-bai-tap/lop/${course.slug}`, label: `Phiếu bài tập ${course.title} (PDF)`, emoji: '📄' }] : []),
    ...(grade ? [{ href: `/de-thi-lop-${grade}`, label: `Đề thi lớp ${grade}`, emoji: '📝' }] : []),
    ...(grade ? [{ href: `/toan-tu-duy-lop-${grade}`, label: `Toán tư duy lớp ${grade}`, emoji: '🧠' }] : []),
  ];

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <KidCard emoji="🎓" title={`Giới thiệu khóa học ${course.title}`} tone="pink">
        <p className="leading-7 text-slate-600">{intro}</p>
        {topicNames.length > 0 && (
          <div className="mt-5">
            <h3 className="font-black text-slate-900 kid-display">Chương trình học {course.title}</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {topicNames.map((name) => (
                <li key={name} className="flex items-start gap-2 rounded-2xl px-3 py-2 text-slate-700" style={{ background: '#FFF1F6' }}>
                  <span aria-hidden style={{ color: '#FF6B9D' }}>◆</span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </KidCard>

      <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="purple">
        <KidFaq items={faq} />
      </KidCard>

      <KidCard emoji="⭐" title={`Luyện tập & ôn thi ${course.title}`} tone="green">
        <KidLinkList tone="green" items={links} />
      </KidCard>
    </section>
  );
}
