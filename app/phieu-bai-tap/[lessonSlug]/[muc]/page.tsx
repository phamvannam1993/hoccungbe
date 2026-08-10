import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import PrintBar from '../../PrintBar';
import { Sheet, PRINT_CSS, type Quiz } from '../../Sheet';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

// Mỗi chặng online ↔ một phiếu PDF 10 câu. 'ca-bai' = gộp toàn bộ 3 mức của bài.
const MUC = {
  'de': { diff: 'easy', order: 1, title: 'PHIẾU LÀM QUEN', emoji: '🌱', desc: 'Nhận biết', color: '#16a34a', bg: '#dcfce7' },
  'trung-binh': { diff: 'medium', order: 2, title: 'PHIẾU LUYỆN TẬP', emoji: '🌿', desc: 'Hiểu và thực hành', color: '#ea580c', bg: '#ffedd5' },
  'nang-cao': { diff: 'hard', order: 3, title: 'PHIẾU THỬ THÁCH', emoji: '🌳', desc: 'Vận dụng', color: '#7c3aed', bg: '#f3e8ff' },
  'ca-bai': { diff: 'all', order: 0, title: 'PHIẾU CẢ BÀI', emoji: '📘', desc: 'Cả bài', color: '#0284c7', bg: '#e0f2fe' },
} as const;

type Muc = keyof typeof MUC;

type Lesson = {
  id: number; title: string; slug: string; volume?: string | null;
  course?: { title: string; slug: string } | null;
};

async function fetchLesson(slug: string): Promise<Lesson | null> {
  try {
    const res = await fetch(`${API}/api/lessons/slug/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

const ORDER: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

type Ex = { difficultyLevel: string; exerciseNumber: number; quizzes: Quiz[] };

/**
 * Một bài có thể có nhiều chặng cùng mức độ (vd bài có ex7/ex8/ex9 đều "hard").
 * - Có ?ex=N  → in ĐÚNG một chặng đó (số "Chặng N" theo thứ tự thật của cả bài).
 * - Không ?ex → GỘP HẾT các chặng cùng mức độ → phiếu hiển thị TẤT CẢ câu của mức đó.
 */
async function fetchExercise(lessonId: number, diff: string, exNum?: number) {
  try {
    const res = await fetch(`${API}/api/quizzes/exercises/${lessonId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { exercises: Ex[] };
    const all = [...(data.exercises ?? [])].sort(
      (a, b) => (ORDER[a.difficultyLevel] ?? 99) - (ORDER[b.difficultyLevel] ?? 99) || a.exerciseNumber - b.exerciseNumber,
    );
    // 'all' → gộp TOÀN BỘ bài (cả 3 mức) thành một phiếu đầy đủ.
    if (diff === 'all') {
      if (!all.length) return null;
      const whole: Ex = {
        difficultyLevel: 'all',
        exerciseNumber: all[0].exerciseNumber,
        quizzes: all.flatMap((e) => e.quizzes ?? []),
      };
      return { ex: whole, chang: 1, totalStages: all.length, merged: true };
    }
    if (exNum) {
      const target = all.find((e) => e.exerciseNumber === exNum && e.difficultyLevel === diff);
      if (!target) return null;
      return { ex: target, chang: all.indexOf(target) + 1, totalStages: all.length, merged: false };
    }
    // Không chỉ định chặng → gộp mọi chặng cùng mức độ thành một phiếu đầy đủ.
    const group = all.filter((e) => e.difficultyLevel === diff);
    if (!group.length) return null;
    const merged: Ex = {
      difficultyLevel: diff,
      exerciseNumber: group[0].exerciseNumber,
      quizzes: group.flatMap((e) => e.quizzes ?? []),
    };
    return { ex: merged, chang: ORDER[diff] ?? 1, totalStages: all.length, merged: group.length > 1 };
  } catch { return null; }
}

// Nhãn mức độ dùng cho tiêu đề SEO (khác với "PHIẾU LÀM QUEN…" chỉ để in).
const LEVEL_LABEL: Record<string, string> = { 'de': 'Cơ bản', 'trung-binh': 'Trung bình', 'nang-cao': 'Nâng cao', 'ca-bai': 'Đầy đủ cả bài' };

export async function generateMetadata({ params }: { params: Promise<{ lessonSlug: string; muc: string }> }): Promise<Metadata> {
  const { lessonSlug, muc } = await params;
  const cfg = MUC[muc as Muc];
  const lesson = await fetchLesson(lessonSlug);
  if (!lesson || !cfg) {
    return { title: 'Phiếu bài tập', robots: { index: false, follow: false } };
  }
  const courseTitle = lesson.course?.title ?? 'Bé Hay Học';
  const level = LEVEL_LABEL[muc] ?? cfg.desc;
  const canonical = `/phieu-bai-tap/${lessonSlug}/${muc}`;
  // VD: "Phiếu bài tập Bài 3: Nhiều hơn, ít hơn, bằng nhau – Cơ bản (có đáp án) | Toán lớp 1"
  // Kèm mức độ để 3 phiếu (de/trung-binh/nang-cao) không trùng title — chuẩn SEO.
  const title = `Phiếu bài tập ${lesson.title} – ${level} (có đáp án) | ${courseTitle}`;
  const description = `Phiếu bài tập ${courseTitle} ${lesson.title} mức ${level}: các câu hỏi kèm đáp án, in hoặc tải PDF miễn phí giúp bé luyện tập và ôn lại kiến thức hiệu quả.`;
  return {
    // absolute: bỏ hậu tố "| Bé Hay Học" của layout để tự kết bằng "| <Tên khoá>".
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: `${SITE}${canonical}`, type: 'article' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lessonSlug: string; muc: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const { lessonSlug, muc } = await params;
  const sp = await searchParams;
  const cfg = MUC[muc as Muc];
  if (!cfg) notFound();

  const lesson = await fetchLesson(lessonSlug);
  if (!lesson) notFound();

  const exNum = Number(Array.isArray(sp.ex) ? sp.ex[0] : sp.ex) || undefined;
  const found = await fetchExercise(lesson.id, cfg.diff, exNum);
  if (!found || !found.ex.quizzes?.length) notFound();

  const { ex: exercise, chang, merged } = found;
  const isAnswer = sp.dapan === '1';
  const quizzes = exercise.quizzes;
  // Gộp nhiều chặng → không gắn ?ex (giữ nguyên phiếu đầy đủ); một chặng → gắn ?ex.
  const base = `/phieu-bai-tap/${lessonSlug}/${muc}`;
  const withEx = merged ? base : `${base}?ex=${exercise.exerciseNumber}`;
  const answerHref = isAnswer
    ? withEx
    : `${withEx}${merged ? '?' : '&'}dapan=1`;

  // QR đưa ba mẹ về phần luyện online (nghe âm thanh, chấm điểm tự động).
  // 'ca-bai' không có 1 chặng online riêng → trỏ thẳng về trang bài học.
  const playUrl =
    muc === 'ca-bai'
      ? `${SITE}/${lessonSlug}`
      : merged
        ? `${SITE}/${lessonSlug}/${lessonSlug}-${muc}.html`
        : `${SITE}/${lessonSlug}/${lessonSlug}-${muc}.html?ex=${exercise.exerciseNumber}`;
  let qrDataUrl: string | undefined;
  try {
    qrDataUrl = await QRCode.toDataURL(playUrl, { margin: 1, width: 160 });
  } catch { /* không có QR thì phiếu vẫn in được */ }

  // Chỉ JSON-LD, không thêm breadcrumb hiển thị: trang này là phiếu để IN, mọi thứ
  // ngoài tờ phiếu đều thừa trên giấy (SiteShell cũng đã bỏ header/footer ở đây).
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE },
      ...(lesson.course?.slug
        ? [{
            '@type': 'ListItem',
            position: 2,
            name: lesson.course.title,
            item: `${SITE}/khoa-hoc/${lesson.course.slug}`,
          }]
        : []),
      {
        '@type': 'ListItem',
        position: lesson.course?.slug ? 3 : 2,
        name: `Phiếu bài tập ${lesson.title}`,
        item: `${SITE}${base}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <PrintBar lessonSlug={lessonSlug} answerHref={answerHref} isAnswer={isAnswer} />
      <style>{PRINT_CSS}</style>
      <Sheet
        courseTitle={`${lesson.course?.title ?? 'Bài học'}${lesson.volume ? ` • ${lesson.volume}` : ''}`}
        lessonTitle={lesson.title}
        stageLabel={(() => {
          if (muc === 'ca-bai') return `Cả bài • ${quizzes.length} câu`;
          const w = cfg.desc === 'Nhận biết' ? 'Làm quen' : cfg.desc === 'Vận dụng' ? 'Thử thách' : 'Luyện tập';
          return merged ? `${w} • ${quizzes.length} câu` : `Chặng ${chang} – ${w}`;
        })()}
        stageColor={cfg.color}
        stageBg={cfg.bg}
        quizCount={quizzes.length}
        minutes={quizzes.length}
        quizzes={quizzes}
        isAnswer={isAnswer}
        skillFallback={cfg.desc}
        footerLink={`behayhoc.com/${lessonSlug}`}
        qrDataUrl={qrDataUrl}
      />
    </div>
  );
}
