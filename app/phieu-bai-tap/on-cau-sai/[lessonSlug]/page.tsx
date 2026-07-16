'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';
import { getCurrentChildId, listChildren, wrongQuizIdsForLesson } from '../../../lib/childData';
import PrintBar from '../../PrintBar';
import { Sheet, PRINT_CSS, skillOf, type Quiz } from '../../Sheet';

type Lesson = { id: number; title: string; slug: string; volume?: string | null; course?: { title: string } | null };
type Ex = { difficultyLevel: string; exerciseNumber: number; quizzes: Quiz[] };

export default function Page() {
  const params = useParams<{ lessonSlug: string }>();
  const searchParams = useSearchParams();
  const lessonSlug = params.lessonSlug;
  const isAnswer = searchParams?.get('dapan') === '1';

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [childName, setChildName] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const ls = await apiFetch<Lesson>(`/lessons/slug/${lessonSlug}`);
        if (stop) return;
        setLesson(ls);

        const childId = getCurrentChildId();
        if (!childId) { setQuizzes([]); return; }

        // Tên bé để in lên phiếu
        try {
          const kids = await listChildren();
          const me = kids.find((k) => k.id === childId);
          if (me && !stop) setChildName(me.nickname || me.fullName || '');
        } catch { /* không có tên thì thôi */ }

        const [data, wrongIds] = await Promise.all([
          apiFetch<{ exercises: Ex[] }>(`/quizzes/exercises/${ls.id}`),
          wrongQuizIdsForLesson(childId, ls.id),
        ]);
        if (stop) return;

        const all = (data.exercises ?? []).flatMap((e) => e.quizzes ?? []);
        setQuizzes(all.filter((q) => wrongIds.includes(q.id)));
      } catch {
        if (!stop) setQuizzes([]);
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => { stop = true; };
  }, [lessonSlug]);

  // QR về đúng bài học để bé làm lại online
  useEffect(() => {
    import('qrcode')
      .then((m) => m.toDataURL(`${window.location.origin}/${lessonSlug}`, { margin: 1, width: 160 }))
      .then(setQrDataUrl)
      .catch(() => {});
  }, [lessonSlug]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-400">Đang tạo phiếu ôn…</div>;
  }

  if (!lesson || !quizzes || quizzes.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="text-xl font-black text-slate-800">Chưa có câu sai nào để ôn</h1>
        <p className="max-w-md text-sm text-slate-500">
          Bé chưa làm bài này, hoặc bé đã làm đúng hết. Hãy cho bé làm bài online trước, hệ thống sẽ tự gom các câu sai vào phiếu ôn riêng.
        </p>
        <Link href={`/${lessonSlug}`} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white">
          ← Quay lại bài học
        </Link>
      </div>
    );
  }

  // Các kỹ năng bé đang yếu (gom từ chính những câu làm sai)
  const skills = [...new Set(quizzes.map((q) => skillOf(q, 'Vận dụng kiến thức của bài')))];
  const answerHref = isAnswer
    ? `/phieu-bai-tap/on-cau-sai/${lessonSlug}`
    : `/phieu-bai-tap/on-cau-sai/${lessonSlug}?dapan=1`;

  return (
    <div className="min-h-screen bg-slate-100">
      <PrintBar lessonSlug={lessonSlug} answerHref={answerHref} isAnswer={isAnswer} />
      <style>{PRINT_CSS}</style>
      <Sheet
        courseTitle={lesson.course?.title ?? 'Bài học'}
        lessonTitle={lesson.title}
        stageLabel={`Ôn câu sai${childName ? ` – bé ${childName}` : ''}`}
        stageColor="#e11d48"
        stageBg="#ffe4e6"
        quizCount={quizzes.length}
        minutes={quizzes.length}
        quizzes={quizzes}
        isAnswer={isAnswer}
        skillFallback="Vận dụng kiến thức của bài"
        footerLink={`behayhoc.com/${lessonSlug}`}
        qrDataUrl={qrDataUrl}
        intro={
          <div className="keep mb-3 rounded-2xl border-2 border-rose-200 bg-rose-50/60 p-3">
            <div className="text-xs font-black text-rose-600">
              {childName ? `PHIẾU ÔN TẬP CỦA BÉ ${childName.toUpperCase()}` : 'PHIẾU ÔN TẬP RIÊNG CỦA BÉ'}
            </div>
            <div className="mt-1 text-[11px] font-bold text-slate-600">Con đang cần luyện thêm:</div>
            <ul className="mt-0.5 list-inside list-disc text-[11px] text-slate-700">
              {skills.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <div className="mt-1 text-[11px] text-slate-500">Phiếu gồm {quizzes.length} câu bé từng làm chưa đúng.</div>
          </div>
        }
      />
    </div>
  );
}
