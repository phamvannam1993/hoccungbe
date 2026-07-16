import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import PrintBar from '../../PrintBar';
import { Sheet, PRINT_CSS, type Quiz } from '../../Sheet';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://behayhoc.com';

// Mỗi chặng online ↔ một phiếu PDF 10 câu.
const MUC = {
  'de': { diff: 'easy', order: 1, title: 'PHIẾU LÀM QUEN', emoji: '🌱', desc: 'Nhận biết', color: '#16a34a', bg: '#dcfce7' },
  'trung-binh': { diff: 'medium', order: 2, title: 'PHIẾU LUYỆN TẬP', emoji: '🌿', desc: 'Hiểu và thực hành', color: '#ea580c', bg: '#ffedd5' },
  'nang-cao': { diff: 'hard', order: 3, title: 'PHIẾU THỬ THÁCH', emoji: '🌳', desc: 'Vận dụng', color: '#7c3aed', bg: '#f3e8ff' },
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
 * Một bài có thể có nhiều chặng cùng mức độ (vd 8 chặng) → phải chọn đúng chặng
 * theo exerciseNumber, và số "Chặng N" tính theo thứ tự thật của cả bài.
 */
async function fetchExercise(lessonId: number, diff: string, exNum?: number) {
  try {
    const res = await fetch(`${API}/api/quizzes/exercises/${lessonId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { exercises: Ex[] };
    const all = [...(data.exercises ?? [])].sort(
      (a, b) => (ORDER[a.difficultyLevel] ?? 99) - (ORDER[b.difficultyLevel] ?? 99) || a.exerciseNumber - b.exerciseNumber,
    );
    const target = exNum
      ? all.find((e) => e.exerciseNumber === exNum && e.difficultyLevel === diff)
      : all.find((e) => e.difficultyLevel === diff);
    if (!target) return null;
    return { ex: target, chang: all.indexOf(target) + 1, totalStages: all.length };
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ lessonSlug: string; muc: string }> }): Promise<Metadata> {
  const { lessonSlug, muc } = await params;
  const cfg = MUC[muc as Muc];
  const lesson = await fetchLesson(lessonSlug);
  return {
    title: lesson && cfg ? `${cfg.title} – ${lesson.title} | Bé Hay Học` : 'Phiếu bài tập | Bé Hay Học',
    robots: { index: false, follow: false },
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

  const { ex: exercise, chang } = found;
  const isAnswer = sp.dapan === '1';
  const quizzes = exercise.quizzes;
  const qs = `ex=${exercise.exerciseNumber}`;
  const answerHref = isAnswer
    ? `/phieu-bai-tap/${lessonSlug}/${muc}?${qs}`
    : `/phieu-bai-tap/${lessonSlug}/${muc}?${qs}&dapan=1`;

  // QR đưa ba mẹ về đúng chặng online (nghe âm thanh, chấm điểm tự động)
  const playUrl = `${SITE}/${lessonSlug}/${lessonSlug}-${muc}.html?ex=${exercise.exerciseNumber}`;
  let qrDataUrl: string | undefined;
  try {
    qrDataUrl = await QRCode.toDataURL(playUrl, { margin: 1, width: 160 });
  } catch { /* không có QR thì phiếu vẫn in được */ }

  return (
    <div className="min-h-screen bg-slate-100">
      <PrintBar lessonSlug={lessonSlug} answerHref={answerHref} isAnswer={isAnswer} />
      <style>{PRINT_CSS}</style>
      <Sheet
        courseTitle={`${lesson.course?.title ?? 'Bài học'}${lesson.volume ? ` • ${lesson.volume}` : ''}`}
        lessonTitle={lesson.title}
        stageLabel={`Chặng ${chang} – ${cfg.desc === 'Nhận biết' ? 'Làm quen' : cfg.desc === 'Vận dụng' ? 'Thử thách' : 'Luyện tập'}`}
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
