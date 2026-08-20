import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GRADES, getTuDuyGrade, type TuDuyQuestion } from '../../data';
import { SITE_NAME, SITE_URL, canonical } from '../../../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidPills, KidLinkList, TONES } from '../../../components/seo/kid';
import TuDuyQuiz from './TuDuyQuiz';

// /toan-tu-duy-lop-1 … 5. Câu hỏi lấy từ DB (iq_questions) qua API; rỗng → fallback data.ts.
// Phân trang + chọn số câu/trang xử lý client-side trong TuDuyQuiz (URL không đổi).
export const revalidate = 3600;

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';

type ApiIqQuestion = {
  id: number;
  code?: string;
  question: string;
  questionSpeech?: string;
  optionsJson: string[];
  correctIndex: number;
  countdownJson?: string[];
  explanation?: string;
  explanationSpeech?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
};

async function fetchIqQuestions(grade: number): Promise<TuDuyQuestion[]> {
  try {
    const res = await fetch(`${API}/api/iq-questions/by-grade/${grade}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as ApiIqQuestion[];
    if (!Array.isArray(rows)) return [];
    return rows.map((r) => ({
      id: r.code || String(r.id),
      question: r.question,
      question_speech: r.questionSpeech,
      options: Array.isArray(r.optionsJson) ? r.optionsJson : [],
      correct_index: r.correctIndex ?? 0,
      countdown: r.countdownJson,
      explanation: r.explanation,
      explanation_speech: r.explanationSpeech,
      difficulty: r.difficulty,
    }));
  } catch {
    return [];
  }
}

function parseGrade(g: string): number | null {
  const n = Number(g);
  return GRADES.includes(n as (typeof GRADES)[number]) ? n : null;
}

export function generateStaticParams() {
  return GRADES.map((grade) => ({ grade: String(grade) }));
}

export async function generateMetadata({ params }: { params: Promise<{ grade: string }> }): Promise<Metadata> {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (!g) return { title: 'Không tìm thấy', robots: { index: false, follow: false } };
  const title = `Toán tư duy lớp ${g} – bài tập rèn tư duy, suy luận (có lời giải)`;
  const description = `Toán tư duy lớp ${g}: các dạng bài rèn tư duy, suy luận logic cho bé kèm lời giải chi tiết. Luyện tập miễn phí, bám sát chương trình lớp ${g} tại Bé Hay Học.`;
  const path = `/toan-tu-duy-lop-${g}`;
  const url = canonical(path);
  return {
    title,
    description,
    keywords: [`toán tư duy lớp ${g}`, 'toán tư duy', `toán suy luận lớp ${g}`, `toán tư duy cho bé lớp ${g}`, `bài tập toán tư duy lớp ${g}`],
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url, type: 'article', siteName: SITE_NAME, locale: 'vi_VN', images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
  };
}

export default async function Page({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (!g) notFound();
  const data = getTuDuyGrade(g)!;
  const path = `/toan-tu-duy-lop-${g}`;

  const apiQuestions = await fetchIqQuestions(g);
  const questions = apiQuestions.length > 0 ? apiQuestions : data.questions;
  const hasQuestions = questions.length > 0;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Toán tư duy', item: `${SITE_URL}/toan-tu-duy` },
      { '@type': 'ListItem', position: 3, name: `Lớp ${g}`, item: `${SITE_URL}${path}` },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  // Quiz schema: lấy 50 câu đầu làm dữ liệu có cấu trúc (đủ cho rich result, tránh JSON-LD quá lớn).
  const quizLd = hasQuestions ? {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `Trắc nghiệm Toán tư duy lớp ${g}`,
    url: `${SITE_URL}${path}`,
    inLanguage: 'vi-VN',
    educationalLevel: `Lớp ${g}`,
    learningResourceType: 'Quiz',
    isAccessibleForFree: true,
    about: { '@type': 'Thing', name: `Toán tư duy lớp ${g}` },
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    hasPart: questions.slice(0, 50).map((qz) => ({
      '@type': 'Question',
      eduQuestionType: 'Multiple choice',
      text: qz.question,
      acceptedAnswer: { '@type': 'Answer', text: qz.options[qz.correct_index] ?? '' },
      suggestedAnswer: qz.options.map((o, i) => ({ o, i })).filter(({ i }) => i !== qz.correct_index).map(({ o }) => ({ '@type': 'Answer', text: o })),
    })),
  } : null;

  return (
    <KidShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {quizLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd) }} />}

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Toán tư duy', href: '/toan-tu-duy' }, { label: `Lớp ${g}` }]} />

      <KidHero emoji="🧠" eyebrow="Chuyên đề" title={`Toán tư duy lớp ${g}`} tone="purple" description={data.intro} />

      <div className="mt-6">
        <KidCard emoji="🧩" title={`Các dạng bài toán tư duy lớp ${g}`} tone="orange" badge={data.topics.length}>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {data.topics.map((t) => (
              <li key={t} className="flex items-start gap-2 rounded-2xl px-3 py-2 text-slate-700" style={{ background: '#FFF7ED' }}>
                <span aria-hidden style={{ color: '#FF9F45' }}>◆</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="📝" title="Câu hỏi luyện tập" tone="blue" badge={hasQuestions ? questions.length : undefined}>
          {hasQuestions ? (
            <TuDuyQuiz
              grade={g}
              questions={questions.map((qz) => ({ id: qz.id, question: qz.question, question_speech: qz.question_speech, options: qz.options, correct_index: qz.correct_index, explanation: qz.explanation, explanation_speech: qz.explanation_speech, difficulty: qz.difficulty }))}
            />
          ) : (
            <p className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center font-bold text-slate-500">
              Bộ câu hỏi Toán tư duy lớp {g} đang được cập nhật. Ba mẹ quay lại sau nhé! 🌟
            </p>
          )}
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="❓" title="Câu hỏi thường gặp" tone="purple">
          <div className="space-y-3">
            {data.faq.map((f) => (
              <details key={f.q} className="rounded-2xl border-2 bg-white p-4" style={{ borderColor: TONES.purple.border }}>
                <summary className="cursor-pointer font-black text-slate-800 kid-display">{f.q}</summary>
                <p className="mt-2 leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="🎯" title="Toán tư duy các lớp khác" tone="green">
          <KidPills tone="green" items={GRADES.map((gr) => ({ href: `/toan-tu-duy-lop-${gr}`, label: `Lớp ${gr}` }))} />
        </KidCard>
      </div>

      <div className="mt-6">
        <KidCard emoji="⭐" title={`Học thêm cho lớp ${g}`} tone="sky">
          <KidLinkList
            tone="sky"
            items={[
              { href: `/khoa-hoc/toan-lop-${g}`, label: `Khóa học Toán lớp ${g}`, emoji: '📚' },
              { href: `/bai-tap/toan-lop-${g}`, label: `Bài tập Toán lớp ${g}`, emoji: '✏️' },
              { href: `/de-thi-lop-${g}`, label: `Đề thi lớp ${g}`, emoji: '📝' },
              { href: `/lop-${g}`, label: `Tổng hợp học lớp ${g}`, emoji: '🎒' },
            ]}
          />
        </KidCard>
      </div>
    </KidShell>
  );
}
