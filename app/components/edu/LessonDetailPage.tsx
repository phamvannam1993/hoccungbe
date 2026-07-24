'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';
import LessonQuizList from './LessonQuizList';

// Chèn <meta name="robots" content="noindex,follow"> vào <head> khi mount, gỡ khi unmount.
// Dùng cho trạng thái "không tìm thấy" ở client (HTTP 200) để Google không lập chỉ mục soft-404.
function NoIndex() {
  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots';
    m.content = 'noindex,follow';
    document.head.appendChild(m);
    return () => { document.head.removeChild(m); };
  }, []);
  return null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v');
      if (!videoId && u.pathname.startsWith('/embed/')) {
        videoId = u.pathname.split('/embed/')[1];
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  } catch {
    return null;
  }
}

// ─── Lesson Simple Layout ─────────────────────────────────────────────────────
// Layout này thay thế layout cũ: breadcrumb + title + video banner + danh sách bài tập

// ─── Types ───────────────────────────────────────────────────────────────────

type GoalItem = string;

type WarmupSection = {
  emoji: string;
  title: string;
  duration: number;
  description: string;
  steps: string[];
};

type KnowledgePoint = {
  title: string;
  explanation: string;
  example?: string;
  visual?: string;
};

type KnowledgeSection = {
  title: string;
  summary: string;
  points: KnowledgePoint[];
};

type PracticeItem = {
  type: 'choose' | 'fill' | 'match' | 'drag' | 'write';
  question: string;
  options?: string[];
  answer: string;
  hint?: string;
};

type PracticeSection = {
  title: string;
  instruction: string;
  items: PracticeItem[];
};

type GameSection = {
  title: string;
  type: string;
  description: string;
  duration: number;
  instructions: string[];
  reward: string;
};

type QuizQuestion = {
  id: number;
  emoji?: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type QuizSection = {
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
};

type RewardSection = {
  badge: string;
  title: string;
  description: string;
  points: number;
  message: string;
};

type ReportSection = {
  summary: string;
  tracked: { metric: string; description: string }[];
  tips: string[];
};

type ReviewSection = {
  title: string;
  keyPoints: string[];
  nextLesson: string;
  encouragement: string;
};

type Detail = {
  goals: GoalItem[];
  warmup: WarmupSection;
  knowledge: KnowledgeSection;
  practice: PracticeSection;
  game: GameSection;
  quiz: QuizSection;
  reward: RewardSection;
  report: ReportSection;
  review: ReviewSection;
};

type LessonData = {
  id: number;
  title: string;
  slug: string;
  lessonType: string;
  sortOrder: number;
  durationMinutes: number;
  isPreview: boolean;
  videoUrl?: string;
  thumbnailUrl?: string;
  course?: { id: number; title: string; slug: string };
  detail: Detail | null;
  seoDescription?: string;  // Custom SEO description từ database
  learningObjectives?: string[];  // Learning objectives từ database
};

const LESSON_TYPE_LABEL: Record<string, string> = {
  video: 'Video', interactive: 'Tương tác', game: 'Trò chơi', quiz: 'Kiểm tra', story: 'Câu chuyện',
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

function SectionCard({ id, gradient, children }: { id: string; gradient: string; children: React.ReactNode }) {
  return (
    <div id={id} className={`scroll-mt-6 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-100 ${gradient}`}>
      {children}
    </div>
  );
}

function SectionHeader({ gradient, children }: { gradient: string; children: React.ReactNode }) {
  return (
    <div className={`bg-gradient-to-r ${gradient} px-6 py-4`}>
      {children}
    </div>
  );
}

// ─── 1. Goals ────────────────────────────────────────────────────────────────

function GoalsSection({ goals }: { goals: GoalItem[] }) {
  return (
    <SectionCard id="sec-goals" gradient="">
      <SectionHeader gradient="from-sky-500 to-cyan-500">
        <h2 className="text-base font-black text-white">🎯 Mục tiêu bài học</h2>
        <p className="mt-0.5 text-xs text-sky-100">Sau bài này bé sẽ làm được</p>
      </SectionHeader>
      <ul className="divide-y divide-slate-50 p-2">
        {goals.map((g, i) => (
          <li key={i} className="flex items-start gap-4 px-4 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sm font-black text-sky-700">
              {i + 1}
            </div>
            <p className="pt-1 text-sm leading-6 text-slate-700">{g}</p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

// ─── 2. Warmup ───────────────────────────────────────────────────────────────

function WarmupSection({ warmup }: { warmup: WarmupSection }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const allDone = warmup.steps.every((_, i) => done[i]);

  return (
    <SectionCard id="sec-warmup" gradient="">
      <SectionHeader gradient="from-orange-400 to-amber-400">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">🔥 Khởi động</h2>
            <p className="mt-0.5 text-xs text-orange-100">⏱ {warmup.duration} phút vận động</p>
          </div>
          <span className="text-3xl">{warmup.emoji}</span>
        </div>
      </SectionHeader>
      <div className="p-6">
        <p className="text-sm leading-7 text-slate-600">{warmup.description}</p>
        <p className="mt-4 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Các bước thực hiện</p>
        <ol className="space-y-3">
          {warmup.steps.map((step, i) => (
            <li key={i}
              onClick={() => setDone(d => ({ ...d, [i]: !d[i] }))}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 transition ${done[i] ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-orange-50 ring-1 ring-orange-100 hover:bg-orange-100'}`}>
              <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${done[i] ? 'bg-emerald-500 text-white' : 'bg-orange-200 text-orange-700'}`}>
                {done[i] ? '✓' : i + 1}
              </div>
              <p className={`text-sm leading-6 ${done[i] ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>{step}</p>
            </li>
          ))}
        </ol>
        {allDone && (
          <div className="mt-4 rounded-2xl bg-emerald-50 px-5 py-3 text-center ring-1 ring-emerald-200">
            <p className="text-sm font-bold text-emerald-700">🎉 Tuyệt! Bé đã khởi động xong — vào bài học thôi!</p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── 3. Knowledge ────────────────────────────────────────────────────────────

function KnowledgeSection({ knowledge }: { knowledge: KnowledgeSection }) {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });

  return (
    <SectionCard id="sec-knowledge" gradient="">
      <SectionHeader gradient="from-violet-500 to-purple-500">
        <h2 className="text-base font-black text-white">📚 Học kiến thức</h2>
        <p className="mt-0.5 text-xs text-violet-100">{knowledge.points.length} điểm kiến thức cần nắm</p>
      </SectionHeader>
      <div className="p-6">
        <div className="rounded-2xl bg-violet-50 px-5 py-4 ring-1 ring-violet-100">
          <p className="text-sm leading-7 text-slate-700">{knowledge.summary}</p>
        </div>
        <div className="mt-5 space-y-3">
          {knowledge.points.map((pt, i) => (
            <div key={i} className="overflow-hidden rounded-2xl ring-1 ring-slate-100">
              <button
                onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pt.visual}</span>
                  <span className="font-black text-slate-900">{pt.title}</span>
                </div>
                <span className={`text-slate-400 transition-transform ${open[i] ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {open[i] && (
                <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-4">
                  <p className="text-sm leading-7 text-slate-600">{pt.explanation}</p>
                  {pt.example && (
                    <div className="mt-3 flex gap-2 rounded-xl bg-violet-50 px-4 py-3 ring-1 ring-violet-100">
                      <span className="shrink-0 text-violet-500">📌</span>
                      <p className="text-xs leading-6 text-slate-600"><strong>Ví dụ:</strong> {pt.example}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

// ─── 4. Practice ─────────────────────────────────────────────────────────────

function PracticeSection({ practice }: { practice: PracticeSection }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [hints, setHints] = useState<Record<number, boolean>>({});

  return (
    <SectionCard id="sec-practice" gradient="">
      <SectionHeader gradient="from-emerald-500 to-teal-500">
        <h2 className="text-base font-black text-white">✍️ Thực hành</h2>
        <p className="mt-0.5 text-xs text-emerald-100">{practice.items.length} bài tập · {practice.instruction}</p>
      </SectionHeader>
      <div className="divide-y divide-slate-50">
        {practice.items.map((item, i) => {
          const isCorrect = checked[i] && answers[i] === item.answer;
          const isWrong = checked[i] && answers[i] !== item.answer;

          return (
            <div key={i} className="px-6 py-5">
              <div className="flex items-start gap-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${isCorrect ? 'bg-emerald-100 text-emerald-700' : isWrong ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {isCorrect ? '✓' : isWrong ? '✗' : i + 1}
                </span>
                <p className="font-bold text-slate-900">{item.question}</p>
              </div>

              {item.type === 'choose' && item.options?.length ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 pl-10">
                  {item.options.map((opt, oi) => {
                    const picked = answers[i] === opt;
                    const correct = checked[i] && opt === item.answer;
                    const wrong = checked[i] && picked && !correct;
                    return (
                      <button key={oi}
                        disabled={checked[i]}
                        onClick={() => setAnswers(a => ({ ...a, [i]: opt }))}
                        className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                          correct ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
                          : wrong ? 'bg-red-100 text-red-700 ring-1 ring-red-300'
                          : picked ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-300'
                          : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-emerald-50 hover:ring-emerald-200'
                        }`}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-3 pl-10">
                  <input
                    value={answers[i] || ''}
                    disabled={checked[i]}
                    onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                    placeholder="Nhập câu trả lời..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50" />
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 pl-10">
                {!checked[i] && (
                  <>
                    <button
                      disabled={!answers[i]}
                      onClick={() => setChecked(c => ({ ...c, [i]: true }))}
                      className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40">
                      Kiểm tra
                    </button>
                    {item.hint && (
                      <button
                        onClick={() => setHints(h => ({ ...h, [i]: true }))}
                        className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">
                        💡 Gợi ý
                      </button>
                    )}
                    {hints[i] && item.hint && (
                      <p className="w-full text-xs text-slate-500">💡 {item.hint}</p>
                    )}
                  </>
                )}
                {checked[i] && (
                  <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ${isCorrect ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-red-50 ring-1 ring-red-200'}`}>
                    <span className="text-sm font-bold">{isCorrect ? '🎉 Chính xác!' : `❌ Đáp án đúng: ${item.answer}`}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ─── 5. Game ─────────────────────────────────────────────────────────────────

const GAME_TYPE_ICON: Record<string, string> = {
  tap: '👆', 'drag-drop': '🖐️', match: '🔗', 'quiz-race': '⚡', collect: '🎒', sort: '📶',
};

function GameSection({ game }: { game: GameSection }) {
  const [started, setStarted] = useState(false);

  return (
    <SectionCard id="sec-game" gradient="">
      <SectionHeader gradient="from-pink-500 to-rose-500">
        <h2 className="text-base font-black text-white">🎮 Trò chơi củng cố</h2>
        <p className="mt-0.5 text-xs text-pink-100">⏱ {game.duration} phút · Loại: {game.type}</p>
      </SectionHeader>
      <div className="p-6">
        <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-5 ring-1 ring-pink-100">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-2xl ring-1 ring-pink-200">
              {GAME_TYPE_ICON[game.type] || '🎮'}
            </div>
            <div>
              <h3 className="font-black text-slate-900">{game.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{game.description}</p>
            </div>
          </div>
        </div>

        <p className="mt-5 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Cách chơi</p>
        <ol className="space-y-2">
          {game.instructions.map((ins, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-black text-pink-700">{i + 1}</span>
              <p className="text-sm leading-6 text-slate-700">{ins}</p>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-2xl bg-emerald-50 px-5 py-3 ring-1 ring-emerald-100">
          <p className="text-sm font-bold text-emerald-700">🎁 Phần thưởng: {game.reward}</p>
        </div>

        <button
          onClick={() => setStarted(true)}
          className={`mt-5 w-full rounded-full py-3 text-sm font-black transition ${started ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-100 hover:-translate-y-0.5 hover:shadow-pink-200'}`}>
          {started ? '✅ Trò chơi đang diễn ra — hãy thực hiện cùng bé!' : '▶ Bắt đầu trò chơi'}
        </button>
      </div>
    </SectionCard>
  );
}

// ─── 6. Quiz ─────────────────────────────────────────────────────────────────

function QuizSection({ quiz }: { quiz: QuizSection }) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted ? quiz.questions.filter(q => selected[q.id] === q.answer).length : 0;
  const pct = quiz.questions.length > 0 ? Math.round((score / quiz.questions.length) * 100) : 0;
  const pass = submitted && pct >= quiz.passingScore;

  return (
    <SectionCard id="sec-quiz" gradient="">
      <SectionHeader gradient="from-amber-500 to-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">📝 Kiểm tra</h2>
            <p className="mt-0.5 text-xs text-amber-100">Trả lời đúng ≥ {quiz.passingScore}% để qua bài</p>
          </div>
          <span className="text-sm font-black text-white">{quiz.questions.length} câu</span>
        </div>
      </SectionHeader>
      <div className="p-6">
        {/* Progress bar */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${(Object.keys(selected).length / quiz.questions.length) * 100}%` }} />
          </div>
          <span className="text-xs font-bold text-slate-500">{Object.keys(selected).length}/{quiz.questions.length}</span>
        </div>

        <div className="space-y-5">
          {quiz.questions.map((q) => (
            <div key={q.id} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-700">{q.id}</span>
                <p className="font-bold text-slate-900">{q.emoji && `${q.emoji} `}{q.question}</p>
              </div>
              <div className="mt-4 grid gap-2 pl-10 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const picked = selected[q.id] === opt;
                  const correct = submitted && opt === q.answer;
                  const wrong = submitted && picked && !correct;
                  return (
                    <button key={oi}
                      disabled={submitted}
                      onClick={() => setSelected(s => ({ ...s, [q.id]: opt }))}
                      className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                        correct ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300'
                        : wrong ? 'bg-red-100 text-red-700 ring-1 ring-red-300'
                        : picked ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                        : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-amber-50'
                      }`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className={`mt-3 pl-10 text-xs leading-5 ${selected[q.id] === q.answer ? 'text-emerald-700' : 'text-red-600'}`}>
                  💡 {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(selected).length < quiz.questions.length}
            className="mt-6 w-full rounded-full bg-amber-500 py-3 text-sm font-black text-white shadow-md hover:bg-amber-600 disabled:opacity-50">
            Nộp bài ({Object.keys(selected).length}/{quiz.questions.length} câu đã chọn)
          </button>
        ) : (
          <div className={`mt-6 rounded-2xl p-6 text-center ${pass ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-red-50 ring-1 ring-red-200'}`}>
            <p className="text-4xl">{pass ? '🎉' : '💪'}</p>
            <p className="mt-2 text-xl font-black">{pass ? 'Xuất sắc!' : 'Cố gắng thêm!'}</p>
            <p className="mt-1 text-sm text-slate-600">
              Đúng <strong>{score}/{quiz.questions.length}</strong> câu — <strong>{pct}%</strong>
              {' '}(cần {quiz.passingScore}%)
            </p>
            {!pass && (
              <button
                onClick={() => { setSelected({}); setSubmitted(false); }}
                className="mt-4 rounded-full bg-slate-200 px-6 py-2 text-sm font-bold text-slate-700 hover:bg-slate-300">
                🔄 Làm lại
              </button>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── 7. SEO Description Section ──────────────────────────────────────────────

// Unique SEO description generator - mỗi bài khác nhau
function generateAutoSeoDescription(lesson: LessonData): string {
  const goals = lesson.detail?.goals || [];
  const courseTitle = lesson.course?.title.toLowerCase() || '';
  const lessonTitle = lesson.title.toLowerCase();

  // Extract keywords từ lesson title - chi tiết hơn
  const titleKeywords = lessonTitle
    .split(/[\s\-:,]/)
    .filter(w => w.length > 2 && !['của', 'và', 'các', 'là', 'để', 'với', 'từ', 'bài', 'các', 'những'].includes(w));

  // Detect lesson type
  const isLanguage = courseTitle.includes('việt') || courseTitle.includes('anh') ||
                     lessonTitle.includes('chữ') || lessonTitle.includes('từ') ||
                     lessonTitle.includes('âm') || lessonTitle.includes('tiếng');
  const isMath = courseTitle.includes('toán') || courseTitle.includes('số') ||
                 lessonTitle.includes('đếm') || lessonTitle.includes('phép tính') ||
                 lessonTitle.includes('tính') || lessonTitle.includes('nhiều') || lessonTitle.includes('ít');
  const isScience = courseTitle.includes('khoa học') || courseTitle.includes('tự nhiên') ||
                    lessonTitle.includes('động vật') || lessonTitle.includes('thực vật') ||
                    lessonTitle.includes('con') || lessonTitle.includes('vật');

  const skillsList = goals.length > 0 ? goals.slice(0, 3) : [];
  const mainKeyword = titleKeywords.length > 0 ? titleKeywords[0] : 'nội dung học tập';

  // Variation arrays để tạo nội dung khác nhau
  const openings = [
    `Bài học "${lesson.title}" giúp bé `,
    `Trong bài "${lesson.title}", bé sẽ `,
    `Bài học về ${mainKeyword} này giúp bé `,
    `Với bài "${lesson.title}", bé có cơ hội `,
  ];

  const closes = [
    `được thiết kế vui vẻ và khắc sâu kiến thức.`,
    `phù hợp với độ tuổi và khuyến khích tò mò học tập.`,
    `được luyện tập toàn diện qua hình thức đa cảm.`,
    `có cơ hội ôn tập và làm quen từ từ.`,
  ];

  // Hash lesson ID để select variation consistent
  const lessonIdHash = (lesson.id || 0) % 4;

  let description = '';

  if (isLanguage) {
    const skills = skillsList.length > 0
      ? skillsList.slice(0, 2).join(', ').toLowerCase()
      : 'nhận biết chữ, phát âm, viết chữ';
    const subtitle = courseTitle.includes('anh') ? 'Tiếng Anh' : 'Tiếng Việt';
    const variations = [
      `nắm vững ${mainKeyword} trong chương trình ${subtitle}. Bé sẽ thực hành: ${skills}. Video bài giảng chi tiết, bài tập tương tác thú vị, bài kiểm tra giúp bé kiểm chứng. Nội dung ${closes[lessonIdHash]}`,
      `tiến bộ trong ${subtitle} thông qua bài học ${mainKeyword}. Luyện tập: ${skills}. Hình thức giảng dạy kết hợp video, bài tập, kiểm tra giúp bé vừa học vừa chơi. Được thiết kế để khuyến khích giao tiếp tự tin.`,
      `phát triển kỹ năng ${mainKeyword} một cách tự nhiên. Bé sẽ: ${skills}. Qua video hấp dẫn, bài tập đa dạng, bài kiểm tra ngắn, bé sẽ thấy tiến bộ từng ngày. ${closes[lessonIdHash]}`,
    ];
    description = openings[lessonIdHash] + variations[lessonIdHash % variations.length];
  } else if (isMath) {
    const skills = skillsList.length > 0
      ? skillsList.slice(0, 2).join(', ').toLowerCase()
      : 'tính toán, so sánh, nhận biết';
    const variations = [
      `rèn kỹ năng tư duy ${mainKeyword} một cách vui vẻ. Nội dung bài học: ${skills}. Video minh họa sinh động, bài tập tương tác cho phép bé thử sai an toàn, bài kiểm tra kiểm chứng kiến thức. ${closes[lessonIdHash]}`,
      `làm quen với ${mainKeyword} thông qua hoạt động luyện tập. Bé sẽ: ${skills}. Kết hợp video bài giảng, bài tập thực hành, bài kiểm tra để bé tự tin giải quyết vấn đề. Được thiết kế để trẻ yêu thích toán.`,
      `phát triển tư duy ${mainKeyword} từ từ qua bài học bài bản. Luyện tập: ${skills}. Video sinh động, bài tập đa dạng, kiểm tra kiến thức tổng hợp giúp bé nắm vững. ${closes[lessonIdHash]}`,
    ];
    description = openings[lessonIdHash] + variations[lessonIdHash % variations.length];
  } else if (isScience) {
    const skills = skillsList.length > 0
      ? skillsList.slice(0, 2).join(', ').toLowerCase()
      : 'quan sát, khám phá, suy luận';
    const variations = [
      `khám phá bí mật của ${mainKeyword}. Bé sẽ học: ${skills}. Video hình ảnh sinh động, bài tập tương tác kích thích tò mò, bài kiểm tra làm bé hiểu sâu hơn. ${closes[lessonIdHash]}`,
      `tìm hiểu về ${mainKeyword} qua hoạt động thực hành. Nội dung gồm: ${skills}. Hình thức giảng dạy kết hợp video, bài tập, kiểm tra giúp bé không quên kiến thức. Được thiết kế để phát triển tình yêu khoa học.`,
      `hiểu rõ hơn về ${mainKeyword} qua bài học khoa học vui vẻ. Luyện tập: ${skills}. Video sinh động, bài tập tương tác, kiểm tra toàn diện giúp bé tự tin khám phá. ${closes[lessonIdHash]}`,
    ];
    description = openings[lessonIdHash] + variations[lessonIdHash % variations.length];
  } else {
    // Generic - cũng tạo variation
    const skills = skillsList.length > 0
      ? skillsList.join(', ').toLowerCase()
      : 'tư duy, kỹ năng, sáng tạo';
    const variations = [
      `phát triển ${mainKeyword} một cách toàn diện. Bé sẽ: ${skills}. Video bài giảng chi tiết, bài tập tương tác, kiểm tra giúp bé nắm vững nội dung. ${closes[lessonIdHash]}`,
      `tiến bộ thông qua bài học ${mainKeyword} bài bản. Luyện tập: ${skills}. Kết hợp video hấp dẫn, bài tập đa dạng, kiểm tra toàn diện. Được thiết kế phù hợp chương trình giáo dục chuẩn.`,
      `làm quen với ${mainKeyword} qua các hoạt động luyện tập. Bé sẽ: ${skills}. Video sinh động, bài tập thực hành, kiểm tra ngắn giúp bé học hiệu quả. ${closes[lessonIdHash]}`,
    ];
    description = openings[lessonIdHash] + variations[lessonIdHash % variations.length];
  }

  return description;
}

function SeoDescriptionSection({ lesson }: { lesson: LessonData }) {
  // Priority: DB seoDescription > knowledge.summary > auto-generated
  const mainDescription = lesson.seoDescription
    ? lesson.seoDescription
    : lesson.detail?.knowledge?.summary
    ? lesson.detail.knowledge.summary
    : generateAutoSeoDescription(lesson);

  // Use DB learningObjectives or fall back to detail.goals
  const objectives = lesson.learningObjectives || lesson.detail?.goals || [];

  // Accordion: mở sẵn (SSR + desktop) để công cụ tìm kiếm đọc trọn nội dung; thu gọn trên
  // mobile sau khi hydrate cho gọn. Dùng <details> nên nội dung LUÔN nằm trong HTML
  // (Google mobile-first vẫn index) — tốt hơn display:none.
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const apply = () => setOpen(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="mt-8 rounded-3xl overflow-hidden shadow-lg ring-1 ring-blue-200/50"
    >
      {/* Header with gradient (bấm để mở/thu gọn trên mobile) */}
      <summary className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 px-6 py-4 cursor-pointer list-none flex items-center justify-between [&::-webkit-details-marker]:hidden">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <span>📖</span> Nội dung bài học
        </h2>
        <span className="text-white/90 text-sm lg:hidden">{open ? '▲' : '▼'}</span>
      </summary>

      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 px-6 py-6 space-y-5">
        {/* Main description - từ DB hoặc auto-gen */}
        <div className="bg-white/80 rounded-2xl px-5 py-4 ring-1 ring-blue-100/50 backdrop-blur-sm">
          <p className="text-sm leading-7 text-slate-700">
            {mainDescription}
          </p>
        </div>

        {/* Skills/Goals list */}
        {objectives && objectives.length > 0 && (
          <div className="bg-white/80 rounded-2xl px-5 py-4 ring-1 ring-green-100/50 backdrop-blur-sm">
            <p className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span> Mục tiêu bài học
            </p>
            <ul className="space-y-2">
              {objectives.slice(0, 4).map((goal, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Parent guidance */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl px-5 py-4 ring-1 ring-amber-200/50">
          <p className="text-sm leading-7 text-slate-700">
            <span className="inline-block text-xl mr-2">👨‍👩‍👧</span>
            <strong className="text-slate-900">Hướng dẫn phụ huynh:</strong>{' '}
            Khuyến khích bé thực hiện đầy đủ các phần bài học. Bé sẽ nhận được phản hồi ngay lập tức
            để biết điểm mạnh và cần cải thiện ở đâu. Hãy tạo môi trường yên tĩnh và động viên bé
            khi hoàn thành mỗi phần bài học.
          </p>
        </div>
      </div>
    </details>
  );
}

// ─── 8. Reward ───────────────────────────────────────────────────────────────

function RewardSection({ reward }: { reward: RewardSection }) {
  const [claimed, setClaimed] = useState(false);

  return (
    <SectionCard id="sec-reward" gradient="">
      <SectionHeader gradient="from-yellow-400 to-orange-400">
        <h2 className="text-base font-black text-white">🏆 Khen thưởng</h2>
        <p className="mt-0.5 text-xs text-yellow-100">Phần thưởng xứng đáng cho bé</p>
      </SectionHeader>
      <div className="p-6 text-center">
        <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] text-6xl shadow-xl transition-transform ${claimed ? 'scale-110 bg-gradient-to-br from-yellow-300 to-orange-400 shadow-orange-200' : 'bg-gradient-to-br from-slate-100 to-slate-200 grayscale'}`}>
          {reward.badge}
        </div>
        <h3 className="mt-5 text-xl font-black text-slate-900">{reward.title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-500">{reward.description}</p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="rounded-full bg-amber-50 px-5 py-2 ring-1 ring-amber-200">
            <span className="text-xl font-black text-amber-600">+{reward.points}</span>
            <span className="ml-1 text-sm font-bold text-amber-500">điểm</span>
          </div>
        </div>

        {!claimed ? (
          <button
            onClick={() => setClaimed(true)}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 py-3 text-sm font-black text-white shadow-lg shadow-orange-100 hover:-translate-y-0.5 transition">
            🎁 Nhận huy hiệu
          </button>
        ) : (
          <div className="mt-5 rounded-2xl bg-emerald-50 px-5 py-4 ring-1 ring-emerald-200">
            <p className="text-base font-bold text-emerald-700">{reward.message}</p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── 8. Report ───────────────────────────────────────────────────────────────

function ReportSection({ report }: { report: ReportSection }) {
  return (
    <SectionCard id="sec-report" gradient="">
      <SectionHeader gradient="from-blue-500 to-indigo-500">
        <h2 className="text-base font-black text-white">📊 Báo cáo cho phụ huynh</h2>
        <p className="mt-0.5 text-xs text-blue-100">Theo dõi tiến độ và gợi ý hỗ trợ</p>
      </SectionHeader>
      <div className="p-6">
        <div className="rounded-2xl bg-blue-50 px-5 py-4 ring-1 ring-blue-100">
          <p className="text-sm leading-7 text-slate-700">{report.summary}</p>
        </div>

        <p className="mt-5 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Các chỉ số theo dõi</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {report.tracked.map((t, i) => (
            <div key={i} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-xs font-black uppercase tracking-wider text-blue-700">{t.metric}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">{t.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">💡 Gợi ý cho bố mẹ</p>
        <ul className="space-y-3">
          {report.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-blue-50 px-4 py-3 ring-1 ring-blue-100">
              <span className="text-blue-500 shrink-0">•</span>
              <p className="text-sm leading-6 text-slate-700">{tip}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}

// ─── 9. Review ───────────────────────────────────────────────────────────────

function ReviewSection({ review, courseSlug }: { review: ReviewSection; courseSlug?: string }) {
  const [remembered, setRemembered] = useState<Record<number, boolean>>({});

  return (
    <SectionCard id="sec-review" gradient="">
      <SectionHeader gradient="from-slate-600 to-slate-700">
        <h2 className="text-base font-black text-white">🔄 Ôn tập & Tổng kết</h2>
        <p className="mt-0.5 text-xs text-slate-300">Ghi nhớ những điều quan trọng</p>
      </SectionHeader>
      <div className="p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Điểm cần nhớ</p>
        <ul className="space-y-3">
          {review.keyPoints.map((kp, i) => (
            <li key={i}
              onClick={() => setRemembered(r => ({ ...r, [i]: !r[i] }))}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 transition ${remembered[i] ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-slate-50 ring-1 ring-slate-100 hover:bg-slate-100'}`}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm transition ${remembered[i] ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {remembered[i] ? '✓' : '○'}
              </span>
              <p className="text-sm leading-6 text-slate-700">{kp}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl bg-gradient-to-r from-sky-50 to-violet-50 p-5 ring-1 ring-sky-100">
          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1">📌 Bài tiếp theo</p>
          <p className="text-sm leading-6 text-slate-700">{review.nextLesson}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-emerald-50 px-5 py-4 text-center ring-1 ring-emerald-100">
          <p className="text-base font-bold text-emerald-700">{review.encouragement}</p>
        </div>

        {courseSlug && (
          <Link
            href={`/khoa-hoc/${courseSlug}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800">
            ← Quay lại danh sách bài học
          </Link>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function LessonDetailPage({
  lessonId,
  lessonSlug,
}: {
  lessonId?: string;
  lessonSlug?: string;
}) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  const resolvedId = lessonId ?? lesson?.id?.toString();

  useEffect(() => {
    if (!lessonId && !lessonSlug) { setLoading(false); return; }
    const url = lessonSlug
      ? `/lessons/slug/${lessonSlug}`
      : `/lessons/${lessonId}/detail`;
    apiFetch<LessonData>(url)
      .then((data) => {
        // If fetched by slug, fetch detail separately
        if (lessonSlug) {
          return apiFetch<LessonData>(`/lessons/${data.id}/detail`);
        }
        return data;
      })
      .then(setLesson).catch(() => {}).finally(() => setLoading(false));
  }, [lessonId]);


  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
    </div>
  );

  if (!lesson) return (
    <div className="mx-auto max-w-2xl px-6 py-12 text-center">
      {/* Không tìm thấy bài học ở client → chặn Google index (tránh soft-404 HTTP 200). */}
      <NoIndex />
      <p className="text-6xl">📚</p>
      <h1 className="mt-4 text-2xl font-black text-slate-900">Không tìm thấy bài học</h1>
      <Link href="/khoa-hoc" className="mt-6 inline-flex rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white hover:bg-sky-700">
        Quay lại thư viện
      </Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">

      {/* ── Breadcrumb (trong thẻ trắng cho dễ đọc trên nền màu) ── */}
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 rounded-2xl bg-white/90 px-4 py-2.5 text-xs text-gray-500 shadow-sm sm:text-sm">
        <Link href="/" className="hover:text-blue-600 transition-colors">🏠 Trang chủ</Link>
        {lesson.course && (
          <>
            <span className="text-gray-300">›</span>
            <Link href={`/khoa-hoc/${lesson.course.slug}`} className="hover:text-blue-600 transition-colors">
              {lesson.course.title}
            </Link>
          </>
        )}
        <span className="text-gray-300">›</span>
        <span className="font-medium text-gray-700">{lesson.title}</span>
      </nav>

      {/* ── Title: tên bài đen, tên khóa học màu hồng ở dòng riêng ── */}
      <div className="mb-4 rounded-3xl bg-white/90 px-4 py-4 shadow-sm sm:px-6">
        {/* h2 (không phải h1): h1 duy nhất của trang nằm ở khối nội dung SSR để tránh trùng h1. */}
        <h2 className="text-xl font-black leading-snug text-gray-900 sm:text-2xl kid-display">
          {lesson.title}
        </h2>
        {lesson.course && (
          <p className="mt-1 text-sm font-black kid-display" style={{ color: '#FF6B9D' }}>
            {lesson.course.title}
          </p>
        )}
        {lesson.detail?.knowledge?.summary && (
          <p className="mt-2 text-sm text-gray-500">{lesson.detail.knowledge.summary}</p>
        )}
      </div>

      {/* ── Video Banner ── */}
      {(() => {
        const embedUrl = lesson.videoUrl ? getYouTubeEmbedUrl(lesson.videoUrl) : null;
        return (
          <>
            <div
              className="relative rounded-xl overflow-hidden mb-6 cursor-pointer group"
              style={{ background: 'linear-gradient(135deg, #1a6fa8 0%, #2196c4 60%, #1a8fb8 100%)' }}
              onClick={() => embedUrl && setShowVideo(true)}
            >
              {lesson.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={lesson.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm transition-colors ${embedUrl ? 'group-hover:bg-white/40' : 'opacity-50'}`}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span className="text-white text-xl font-bold drop-shadow">
                  {embedUrl ? 'Xem video bài giảng' : 'Chưa có video bài giảng'}
                </span>
              </div>
              <div className="h-48 sm:h-56" />
            </div>

            {/* YouTube modal */}
            {showVideo && embedUrl && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => setShowVideo(false)}
              >
                <div
                  className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-lg font-bold"
                  >
                    ×
                  </button>
                  <div className="aspect-video">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* ── SEO Description ── */}
      <SeoDescriptionSection lesson={lesson} />

      {/* ── Danh sách bài tập ── */}
      <div className="mt-10">
        <LessonQuizList lessonId={resolvedId ?? ''} lessonSlug={lesson.slug} />
      </div>

    </div>
  );
}
