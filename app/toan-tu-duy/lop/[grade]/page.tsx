import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GRADES, getTuDuyGrade, type TuDuyQuestion } from '../../data';
import { SITE_NAME, SITE_URL, canonical } from '../../../lib/seo';
import { KidShell, KidCrumb, KidHero, KidCard, KidPills, KidLinkList, KidPager, TONES } from '../../../components/seo/kid';

// /toan-tu-duy-lop-1 … 5. Câu hỏi lấy từ DB (iq_questions) qua API; rỗng → fallback data.ts.
// Phân trang 50 câu/trang qua ?trang=N.
export const revalidate = 3600;

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.behayhoc.com';
const PER_PAGE = 50;

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
    }));
  } catch {
    return [];
  }
}

function parseGrade(g: string): number | null {
  const n = Number(g);
  return GRADES.includes(n as (typeof GRADES)[number]) ? n : null;
}
function parsePage(v: string | string[] | undefined): number {
  const raw = Array.isArray(v) ? v[0] : v;
  const n = Math.floor(Number(raw));
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function generateStaticParams() {
  return GRADES.map((grade) => ({ grade: String(grade) }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string }>;
  searchParams: Promise<{ trang?: string | string[] }>;
}): Promise<Metadata> {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (!g) return { title: 'Không tìm thấy', robots: { index: false, follow: false } };
  const sp = await searchParams;
  const data = getTuDuyGrade(g)!;
  const apiQ = await fetchIqQuestions(g);
  const total = (apiQ.length > 0 ? apiQ : data.questions).length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(parsePage(sp.trang), totalPages);

  const suffix = page > 1 ? ` – Trang ${page}` : '';
  const title = `Toán tư duy lớp ${g}${suffix} – bài tập rèn tư duy, suy luận (có lời giải)`;
  const description = `Toán tư duy lớp ${g}${suffix}: các dạng bài rèn tư duy, suy luận logic cho bé kèm lời giải chi tiết. Luyện tập miễn phí, bám sát chương trình lớp ${g} tại Bé Hay Học.`;
  const path = `/toan-tu-duy-lop-${g}`;
  const url = page > 1 ? `${canonical(path)}?trang=${page}` : canonical(path);
  return {
    title,
    description,
    keywords: [`toán tư duy lớp ${g}`, 'toán tư duy', `toán suy luận lớp ${g}`, `toán tư duy cho bé lớp ${g}`, `bài tập toán tư duy lớp ${g}`],
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url, type: 'article', siteName: SITE_NAME, locale: 'vi_VN', images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/og-home.jpg`] },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string }>;
  searchParams: Promise<{ trang?: string | string[] }>;
}) {
  const { grade } = await params;
  const g = parseGrade(grade);
  if (!g) notFound();
  const data = getTuDuyGrade(g)!;
  const path = `/toan-tu-duy-lop-${g}`;

  const apiQuestions = await fetchIqQuestions(g);
  const questions = apiQuestions.length > 0 ? apiQuestions : data.questions;
  const hasQuestions = questions.length > 0;

  const totalPages = Math.max(1, Math.ceil(questions.length / PER_PAGE));
  const page = Math.min(parsePage((await searchParams).trang), totalPages);
  const offset = (page - 1) * PER_PAGE;
  const pageQuestions = questions.slice(offset, offset + PER_PAGE);
  const isFirst = page === 1;

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
  const quizLd = pageQuestions.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `Trắc nghiệm Toán tư duy lớp ${g}${page > 1 ? ` – Trang ${page}` : ''}`,
    url: page > 1 ? `${SITE_URL}${path}?trang=${page}` : `${SITE_URL}${path}`,
    inLanguage: 'vi-VN',
    educationalLevel: `Lớp ${g}`,
    learningResourceType: 'Quiz',
    isAccessibleForFree: true,
    about: { '@type': 'Thing', name: `Toán tư duy lớp ${g}` },
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    hasPart: pageQuestions.map((qz) => ({
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
      {isFirst && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      {quizLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quizLd) }} />}

      <KidCrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Toán tư duy', href: '/toan-tu-duy' }, { label: `Lớp ${g}` }]} />

      <KidHero emoji="🧠" eyebrow="Chuyên đề" title={`Toán tư duy lớp ${g}`} tone="purple" description={data.intro} />

      {isFirst && (
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
      )}

      <div className="mt-6">
        <KidCard
          emoji="📝"
          title={`Câu hỏi luyện tập${totalPages > 1 ? ` (Trang ${page}/${totalPages})` : ''}`}
          tone="blue"
          badge={hasQuestions ? questions.length : undefined}
        >
          {hasQuestions ? (
            <>
              <ol className="space-y-5">
                {pageQuestions.map((qz, idx) => (
                  <li key={qz.id} className="rounded-2xl border-2 p-4 sm:p-5" style={{ borderColor: TONES.blue.border, background: '#fff' }}>
                    <p className="font-black text-slate-900 kid-display">
                      <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full text-sm text-white" style={{ background: TONES.blue.c }}>{offset + idx + 1}</span>
                      <span className="whitespace-pre-line font-bold">{qz.question}</span>
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {qz.options.map((op, i) => {
                        const ok = i === qz.correct_index;
                        return (
                          <li key={i} className="rounded-xl border-2 px-3 py-2 font-semibold" style={ok ? { borderColor: '#6BCB77', background: '#F0FDF4', color: '#15803d' } : { borderColor: '#e2e8f0', color: '#334155' }}>
                            {String.fromCharCode(65 + i)}. {op} {ok && <span aria-hidden>✓</span>}
                          </li>
                        );
                      })}
                    </ul>
                    {qz.explanation && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-black kid-display" style={{ color: TONES.blue.c }}>💡 Xem lời giải</summary>
                        <p className="mt-2 whitespace-pre-line rounded-xl bg-slate-50 p-3 leading-7 text-slate-600">{qz.explanation}</p>
                      </details>
                    )}
                  </li>
                ))}
              </ol>
              <KidPager basePath={path} page={page} totalPages={totalPages} param="trang" tone="blue" />
            </>
          ) : (
            <p className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center font-bold text-slate-500">
              Bộ câu hỏi Toán tư duy lớp {g} đang được cập nhật. Ba mẹ quay lại sau nhé! 🌟
            </p>
          )}
        </KidCard>
      </div>

      {isFirst && (
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
      )}

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
