import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  EXAM_GROUPS,
  SUBJECT_LABEL,
  courseLabel,
  groupBySeg,
  orderFromSlug,
  parseCourseSlug,
} from '../../lib/examNav';

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

type ApiExam = {
  slug: string; title: string; subject: string; grade: number; semester: number;
  totalPoints: number; timeLimitMinutes?: number; examGroup?: string; description?: string;
};

async function fetchExams(subject: string, grade: number): Promise<ApiExam[]> {
  try {
    const res = await fetch(`${API}/api/exams?subject=${subject}&grade=${grade}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function ExamGroupPage({ courseSlug, groupSeg }: { courseSlug: string; groupSeg: string }) {
  const parsed = parseCourseSlug(courseSlug);
  const group = groupBySeg(groupSeg);
  if (!parsed || !group) notFound();

  const all = await fetchExams(parsed.subject, parsed.grade);
  const prefix = `${groupSeg}-${courseSlug}-de-`;
  const exams = all
    .filter((e) => e.slug.startsWith(prefix))
    .sort((a, b) => orderFromSlug(a.slug) - orderFromSlug(b.slug));

  if (exams.length === 0) notFound();

  const subjectLabel = SUBJECT_LABEL[parsed.subject] ?? parsed.subject;
  const cLabel = courseLabel(courseSlug);
  const otherGroups = EXAM_GROUPS.filter((g) => g.seg !== groupSeg);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
        <span className="mx-2">›</span>
        <Link href={`/khoa-hoc/${courseSlug}`} className="hover:text-sky-700">{cLabel}</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700">{group.short}</span>
      </nav>

      <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {group.label} {cLabel} – Bộ {exams.length} đề có đáp án
      </h1>

      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
        Tuyển tập {exams.length} đề {group.short.toLowerCase()} môn {subjectLabel} lớp {parsed.grade}, mỗi đề có
        đáp án và lời giải, chấm điểm trực tuyến ngay sau khi nộp. Bé làm bài nhiều lần miễn phí để ôn tập
        và tự đánh giá kiến thức.
      </p>

      {/* Danh sách đề */}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {exams.map((e) => {
          const n = orderFromSlug(e.slug);
          return (
            <li key={e.slug}>
              <Link
                href={`/${courseSlug}/${groupSeg}/de-${n}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-sky-300 hover:shadow-md"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-lg font-black text-white">
                    {n}
                  </span>
                  <span>
                    <span className="block font-bold text-slate-800 group-hover:text-sky-700">Đề số {n}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                      {e.totalPoints} câu · {e.timeLimitMinutes ? `${e.timeLimitMinutes} phút` : 'không giới hạn'} · có đáp án
                    </span>
                  </span>
                </span>
                <span className="text-sm font-bold text-sky-600 group-hover:translate-x-0.5">Làm đề →</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Liên kết nội bộ: bài học + cụm đề khác */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-base font-black text-slate-800">Ôn tập thêm</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
          <Link href={`/khoa-hoc/${courseSlug}`} className="rounded-full bg-white px-4 py-2 text-sky-700 ring-1 ring-slate-200 hover:ring-sky-300">
            📚 Bài học {cLabel}
          </Link>
          {otherGroups.map((g) => (
            <Link
              key={g.seg}
              href={`/${courseSlug}/${g.seg}`}
              className="rounded-full bg-white px-4 py-2 text-slate-700 ring-1 ring-slate-200 hover:ring-sky-300"
            >
              📝 {g.short}
            </Link>
          ))}
          <Link href="/de-thi" className="rounded-full bg-white px-4 py-2 text-slate-700 ring-1 ring-slate-200 hover:ring-sky-300">
            🗂️ Tất cả đề thi
          </Link>
        </div>
      </section>
    </main>
  );
}
